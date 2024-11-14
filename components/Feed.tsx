"use client";

import { useEffect, useState, useCallback } from "react";
import Car from "./Car";
import { CreateCarType, SignupType } from "@/types/requests";
import { getUserDetailsById } from "@/services/userServices";
import {
  MultiImageDropzone,
  type FileState,
} from "@/components/MultiImageDropZone";
import { useEdgeStore } from "@/lib/edgestore";
import Cross from "@/public/icons/cross";
import { FormInput, TagsInput } from "./ui/inputs";
import Image from "next/image";
import axios from "axios";
import { GetCarType } from "@/types/response";

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

  return (
    <div className="lg:w-2/5 md:w-3/5 w-[90%] h-screen md:border-r md:border-l md:border-white/10">
      <button
        onClick={() => setCreateCar(true)}
        className="bg-indigo-500 px-3 py-1 text-black rounded-full text-sm font-semibold ml-5 my-2 hover:bg-indigo-400 transition-all"
      >
        Add your car
      </button>

      {createCar && (
        <div className="z-10 absolute flex flex-col items-center justify-center w-screen h-screen bg-black/70 backdrop-blur-md top-0 left-0">
          <div
            className="w-6 h-6 cursor-pointer mb-3"
            onClick={() => setCreateCar(false)}
          >
            <Cross />
          </div>

          <div className="flex md:w-3/5 w-4/5 bg-white/10 rounded-xl pb-10 flex-col items-center">
            <div className="text-4xl font-bold pt-5">Create Car</div>
            <div className="w-full px-10 flex flex-col items-center">
              <FormInput
                label="Car Title"
                placeholder="Enter car title..."
                type="text"
                setFunction={setTitle}
              />
              <FormInput
                label="Car Description"
                placeholder="Enter the description of the car..."
                type="textArea"
                setFunction={setDescription}
              />
              <TagsInput setFunction={setTags} />

              <div className="mt-5 w-[200px]">
                <div className="flex flex-row flex-wrap">
                  {images.map((image) => (
                    <Image
                      key={image}
                      className="border border-white/30 p-2 mr-2 mb-2 rounded-lg"
                      src={image}
                      alt="Car image"
                      width={50}
                      height={50}
                    />
                  ))}
                </div>
                <MultiImageDropzone
                  setFunction={setImages}
                  value={fileStates}
                  dropzoneOptions={{ maxFiles: 10 }}
                  onChange={setFileStates}
                  onFilesAdded={handleFileUpload}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full mt-5 py-1 border rounded-md ${
                  loading
                    ? "bg-gray-500 text-white"
                    : "border-white/60 hover:bg-white hover:border-white hover:text-black transition-all text-white/60"
                }`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-4">
        {cars.map((c, index)=>{
          return <Car 
          key={index}
          id={c.id}
          description={c.description}
          title={c.title}
          user={c.user}
          tags={c.tags}
          images={c.images}
          />
        })}
      </div>
    </div>
  );
}
