import Image from "next/image";
import Tag from "./Tags";
import Left from "@/public/icons/left";
import Right from "@/public/icons/right";
import { useState } from "react";
import { GetCarType } from "@/types/response";
import { useRouter } from "next/navigation";

export default function Car({
  images,
  tags,
  title,
  description,
  id,
  user,
}: GetCarType) {
  const [imageInd, setImageInd] = useState(0);
  const router = useRouter();
  return (
    <div className="cursor-pointer hover:bg-white/10 transition-all duration-400 mt-4 relative w-full flex flex-col border-2 border-white/30 rounded-lg">
      <div
        onClick={() => {
          router.push(`/car/${id}`);
        }}
        className="flex flex-row items-end px-5 py-3"
      >
        <div className="text-4xl">{title}</div>
        <div className="text-3xl text-white/30 ml-3">{user.name}</div>
      </div>
      <div
        className="h-64 bg-cover bg-center rounded-b-lg"
        style={{
          backgroundImage: `url(${images[imageInd].url})`,
        }}
      >
        <div className="backdrop-saturate-0 w-full h-full">
          <div className="bg-black/80 w-full h-full flex flex-row items-center px-4">
            <div className="border-2 rounded-md border-white/30">
              <Image
                className="rounded-md"
                src={images[imageInd].url}
                alt={title}
                width={150}
                height={150}
              />
            </div>
            <div className="ml-5 md:max-w-[300px] sm:max-w-[300px] max-w-[200px]">
              <div className="flex flex-row flex-wrap gap-2">
                {tags.map((t, index) => {
                  return <Tag key={index} content={t.name} size={"sm"} />;
                })}
              </div>
              <div className="text-wrap text-white/50 mt-2 ">{description}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row absolute bottom-2 w-full flex justify-center">
        <div
          onClick={() => {
            setImageInd((imageInd + 1) % images.length);
          }}
          className="h-8 w-8 opacity-50 hover:opacity-70 cursor-pointer"
        >
          <Left active={true} />
        </div>
        <div
          onClick={() => {
            setImageInd((imageInd - 1 + images.length) % images.length);
          }}
          className="h-8 w-8 opacity-50 hover:opacity-70 cursor-pointer"
        >
          <Right active={true} />
        </div>
      </div>
    </div>
  );
}
