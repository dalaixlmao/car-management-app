"use client";

import { GetCarType } from "@/types/response";
import axios from "axios";
import { useEffect, useState } from "react";
import Tag from "./Tags";
import Image from "next/image";
import ChangingCarState from "./ChangingeCarState";
import { FileState } from "./MultiImageDropZone";
import { useEdgeStore } from "@/lib/edgestore";

export default function CarDescription({
  id,
  userId,
}: {
  id: number;
  userId: number;
}) {
  const baseURL = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const [car, setCar] = useState<GetCarType>();
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { edgestore } = useEdgeStore();
  const [check1, setCheck1] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      setCheck1(true);
      try {
        const { data } = await axios.get(`${baseURL}/api/car/${id}`);
        const { car: carData } = data;
        console.log("Fetched car data:", carData);

        setCar(carData);
        if (Array.isArray(carData.images)) {
          setImages(carData.images.map((image: { url: string }) => image.url));
        } else {
          setImages([]); // Fallback if images is not an array
        }
        if (carData.user.id == userId) setCanEdit(true);
        setTags(carData.tags.map((tag: { name: string }) => tag.name));
        setTitle(carData.title);
        setDescription(carData.description);
        setCheck1(false); // Mark the car details as loaded
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [baseURL, id, setCheck1, userId]);

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(`${baseURL}/api/car/update/${id}`, {
        title,
        description,
        tags,
        images,
      });
      alert("Car updated successfully!");
      setCar(data.car); // Refresh updated data
      setEditMode(false); // Exit edit mode
      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      } else {
        console.error("Error updating car:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this car?")) return;

    try {
      await axios.delete(`${baseURL}/api/car/delete/${id}`);
      alert("Car deleted successfully!");
      window.location.reload(); // Optionally redirect or reload the page
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Failed to delete the car.");
    }
  };

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

    // Debugging log
    console.log("Uploaded images:", uploadedImages);

    setImages([...images, ...uploadedImages]);
  };

  return (
    <div className="lg:w-2/5 md:w-3/5 w-[90%] md:border-l-2 border-white/10 md:border-r-2 px-4 h-full">
      {/* Loader Display */}
      {loading && check1 && (
        <div className="z-20 absolute top-0 left-0 w-screen h-screen bg-black/70 backdrop-blur flex flex-col items-center justify-center">
          <div
            className="z-20 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}

      {canEdit && (
        <div>
          <button
            onClick={() => setEditMode(true)}
            className="py-1 px-3 bg-indigo-500 text-black rounded-full font-semibold mt-2 hover:bg-indigo-400 transition-all"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="py-1 px-3 bg-red-500 ml-3 rounded-full text-black font-semibold hover:bg-red-400 transition-all"
          >
            Delete
          </button>
        </div>
      )}

      {editMode && (
        <ChangingCarState
          setCreateCar={setEditMode}
          setTitle={setTitle}
          setDescription={setDescription}
          setTags={setTags}
          setImages={setImages}
          images={Array.isArray(images) ? images : []}
          title={title}
          description={description}
          tags={tags}
          handleFileUpload={handleFileUpload}
          handleSubmit={handleUpdate}
          loading={loading}
        />
      )}

      <div className="border-b border-white/10 py-5">
        <div className="text-5xl font-semibold">{car?.title}</div>
        <div className="text-3xl text-white/30 my-2">
          {car?.user.name} (Owner)
        </div>
        <div className="flex flex-row gap-4">
          {car?.tags.map((tag, index) => (
            <Tag size="xl" key={index} content={tag.name} />
          ))}
        </div>
      </div>
      <div className="py-5">
        <div className="flex gap-12 w-full flex-row overflow-x-scroll border-b border-white/10 pb-5">
          {car?.images.map((image, index) => (
            <div className="w-[500px] h-[250px] flex-shrink-0" key={index}>
              <Image
                src={image.url}
                alt={`image ${index}`}
                width={500}
                height={500}
                className="object-cover w-full h-full rounded-xl border-2 border-white"
              />
            </div>
          ))}
        </div>
        <div className="text-2xl text-white/30 hover:text-white/80 transition-all duration-700 mt-5">
          {car?.description}
        </div>
      </div>
    </div>
  );
}
