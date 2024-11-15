import { useState } from "react";
import {
  MultiImageDropzone,
  type FileState,
} from "@/components/MultiImageDropZone";
import Cross from "@/public/icons/cross";
import { FormInput, TagsInput } from "./ui/inputs";
import Image from "next/image";
import { X } from "lucide-react";

export default function ChangingCarState({
  setCreateCar,
  setTitle,
  setDescription,
  setTags,
  images,
  setImages,
  handleSubmit,
  handleFileUpload,
  loading,
  title,
  description,
  tags,
}: {
  setCreateCar: (a: boolean) => void;
  setTitle: (a: string) => void;
  setDescription: (a: string) => void;
  setTags: (a: string[]) => void;
  setImages: (a: string[]) => void;
  images: string[];
  loading: boolean;
  handleFileUpload: (addedFiles: FileState[]) => Promise<void>;
  handleSubmit: () => Promise<void>;
  title?: string;
  description?: string;
  tags?: string[];
}) {
  const [fileStates, setFileStates] = useState<FileState[]>([]);

  const handleRemoveImage = (imageUrl: string) => {
    setImages(images.filter((img) => img !== imageUrl));
  };

  return (
    <div className="z-10 absolute flex flex-col items-center justify-center w-screen h-screen bg-black/70 backdrop-blur-md top-0 left-0">
      <div
        className="w-6 h-6 cursor-pointer mb-3"
        onClick={() => setCreateCar(false)}
      >
        <Cross />
      </div>
      <div className="flex md:w-3/5 w-4/5 bg-white/10 rounded-xl pb-10 flex-col items-center">
        <div className="text-4xl font-bold pt-5">{title?"Edit Car":"Create Car"}</div>
        <div className="w-full px-10 flex flex-col items-center">
          <FormInput
            label="Car Title"
            placeholder="Enter car title..."
            type="text"
            setFunction={setTitle}
            value={title}
          />
          <FormInput
            label="Car Description"
            placeholder="Enter the description of the car..."
            type="textArea"
            setFunction={setDescription}
            value={description}
          />
          
          {/* Tags Section */}
          <div className="w-full mb-4">
            <TagsInput setFunction={setTags} existingTags={tags} />
          </div>

          {/* Images Section */}
          <div className="mt-5 w-full">
            <label className="block text-sm font-medium mb-2">Images</label>
            <div className="flex flex-row flex-wrap gap-2 mb-4">
              {(Array.isArray(images) ? images : []).map((image) => (
                <div key={image} className="relative group">
                  <Image
                    className="border border-white/30 p-2 rounded-lg object-cover"
                    src={image}
                    alt="Car image"
                    width={100}
                    height={100}
                  />
                  <button
                    onClick={() => handleRemoveImage(image)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
            <div className="w-[200px]">
              <MultiImageDropzone
                setFunction={setImages}
                value={fileStates}
                dropzoneOptions={{ maxFiles: 10 }}
                onChange={setFileStates}
                onFilesAdded={handleFileUpload}
              />
            </div>
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
  );
}