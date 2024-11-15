"use client";

import { useEffect, useState} from "react";
import Car from "./Car";
import { type FileState } from "@/components/MultiImageDropZone";
import { useEdgeStore } from "@/lib/edgestore";
import axios from "axios";
import { GetCarType } from "@/types/response";
import ChangingCarState from "./ChangingeCarState";
import { useSearchContext } from "./SearchContext";

export default function Feed() {
  const url = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const [createCar, setCreateCar] = useState(false);
  const { edgestore } = useEdgeStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState<GetCarType[]>([]);
  const [check2, setCheck2] = useState(false);


  const { searchText } = useSearchContext(); // Get the search text from context

  useEffect(() => {
    async function fetchAllCars() {
      const res = await axios.get(url + "/api/car");
      setCars(res.data.cars);
      setCheck2(true);
    }
    fetchAllCars();
  }, [setCars, setCheck2, url]);


  const handleFileUpload = async (addedFiles: FileState[]) => {
    const uploadedImages: string[] = [];
    for (const fileState of addedFiles) {
      try {
        const response = await edgestore.publicFiles.upload({
          file: fileState.file,
        });
        uploadedImages.push(response.url);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
    console.log("Uploaded images:", uploadedImages);

    setImages([...images, ...uploadedImages]);
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
    const carTags = car.tags.map((tag) => {
      return tag.name.toLowerCase();
    });
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

      {/* Loader Display */}
      {!check2 && (
        <div className="z-20 absolute top-0 left-0 w-screen h-screen bg-black/70 backdrop-blur flex flex-col items-center justify-center">
          <div
        className="z-20 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >Loading...</span>
      </div>
        </div>
      )}

      {/* Cars List */}
      { check2 && (
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
      )}
    </div>
  );
}
