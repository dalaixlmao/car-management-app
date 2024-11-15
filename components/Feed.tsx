"use client";

import { useEffect, useState, useCallback } from "react";
import Car from "./Car";
import { SignupType } from "@/types/requests";
import { getUserDetailsById } from "@/services/userServices";
import {
  type FileState,
} from "@/components/MultiImageDropZone";
import { useEdgeStore } from "@/lib/edgestore";
import axios from "axios";
import { GetCarType } from "@/types/response";
import ChangingCarState from "./ChangingeCarState";
import { useSearchContext } from "./SearchContext";

export default function Feed({ userId }: { userId: number }) {
  const url = process.env.NEXTAUTH_URL || "";
  const [user, setUser] = useState<Omit<SignupType, "password">>();
  const [createCar, setCreateCar] = useState(false);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState<GetCarType[]>([]);

  const { searchText } = useSearchContext(); // Get the search text from context

  const fetchUserDetails = useCallback(async () => {
    try {
      const userData = await getUserDetailsById(userId);
      if (userData) setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  useEffect(() => {
    async function fetchAllCars() {
      const res = await axios.get(url + "/api/car");
      setCars(res.data.cars);
    }
    fetchAllCars();
  }, [setCars]);

  const updateFileProgress = useCallback(
    (key: string, progress: FileState["progress"]) => {
      setFileStates((prevFileStates) => {
        const updatedFileStates = structuredClone(prevFileStates);
        const fileState = updatedFileStates.find((state) => state.key === key);
        if (fileState) {
          fileState.progress = progress;
        }
        return updatedFileStates;
      });
    },
    []
  );

  const handleFileUpload = async (addedFiles: FileState[]) => {
    setFileStates((prevState) => [...prevState, ...addedFiles]);
    await Promise.all(
      addedFiles.map(async (fileState) => {
        try {
          const response = await edgestore.publicFiles.upload({
            file: fileState.file,
            onProgressChange: async (progress) => {
              updateFileProgress(fileState.key, progress);
              if (progress === 100) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                updateFileProgress(fileState.key, "COMPLETE");
              }
            },
          });
          setImages((prevImages) => [...prevImages, response.url]);
        } catch (error) {
          console.error("Upload failed:", error);
          updateFileProgress(fileState.key, "ERROR");
        }
      })
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/car/create", {
        title,
        description,
        tags,
        images,
      });
      console.log("Car created:", response.data);
      setCreateCar(false);
    } catch (error) {
      console.error("Error creating car:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter cars based on the searchText
  const filteredCars = cars.filter((car) => {
    const carTitle = car.title.toLowerCase();
    const carDescription = car.description.toLowerCase();
    const carTags = car.tags.map((tag) => {return tag.name.toLowerCase()});
    const lowerSearchText = searchText.toLowerCase();

    return (
      carTitle.includes(lowerSearchText) ||
      carDescription.includes(lowerSearchText) ||
      carTags.some((tag) => tag.includes(lowerSearchText))
    );
  });

  return (
    <div className="lg:w-2/5 md:w-3/5 w-[90%] h-screen md:border-r md:border-l md:border-white/10">
      <button
        onClick={() => setCreateCar(true)}
        className="bg-indigo-500 px-3 py-1 text-black rounded-full text-sm font-semibold ml-5 my-2 hover:bg-indigo-400 transition-all"
      >
        Add your car
      </button>
      {createCar && (
        <ChangingCarState
          setCreateCar={setCreateCar}
          setTitle={setTitle}
          setDescription={setDescription}
          setTags={setTags}
          setImages={setImages}
          images={images}
          loading={loading}
          handleFileUpload={handleFileUpload}
          handleSubmit={handleSubmit}
        />
      )}
      <div className="w-full px-4">
        {filteredCars.map((c, index) => {
          return (
            <Car
              key={index}
              id={c.id}
              description={c.description}
              title={c.title}
              user={c.user}
              tags={c.tags}
              images={c.images}
            />
          );
        })}
      </div>
    </div>
  );
}
