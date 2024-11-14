"use client";

import { GetCarType } from "@/types/response";
import axios from "axios";
import { useEffect, useState } from "react";
import Tag from "./Tags";
import Image from "next/image";

export default function CarDescription({
  id,
  userId,
}: {
  id: number;
  userId: number;
}) {
  const url = process.env.NEXTAUTH_URL || "";
  const [car, setCar] = useState<GetCarType>();
  const [canEdit, setCanEdit] = useState(false);
  useEffect(() => {
    async function fetchCar() {
      const res = await axios.get(url + `/api/car/${id}`);
      setCar(res.data.car);
      setCanEdit(res.data.car.user.id === userId);
    }
    fetchCar();
  }, [setCar, setCanEdit]);
  return (
    <div className="lg:w-2/5 md:w-3/5 w-[90%] md:border-l-2 border-white/10 md:border-r-2 px-4 h-full">
      <div>
        <button className="py-1 px-3 bg-indigo-500 text-black rounded-full font-semibold mt-2 hover:bg-indigo-400 transition-all">
          Edit
        </button>
        <button
          onClick={async () => {
            const res = await axios.delete(url + "/api/car/delete/" + id);
          }}
          className="py-1 px-3 bg-red-500 ml-3 rounded-full text-black font-semibold hover:bg-red-400 transition-all"
        >
          Delete
        </button>
      </div>
      <div className="border-b border-white/10 py-5">
        <div className="text-5xl font-semibold">{car?.title}</div>
        <div className="text-3xl text-white/30 my-2">
          {car?.user.name} (Owner)
        </div>
        <div className="flex flex-row gap-4">
          {car?.tags.map((t, index) => {
            return <Tag size={"xl"} key={index} content={t.name} />;
          })}
        </div>
      </div>
      <div className="py-5">
        <div className="flex gap-12 w-full flex-row overflow-x-scroll border-b border-white/10 pb-5">
          {car?.images.map((i, index) => {
            if (!i.url.startsWith("blob"))
              return (
                <div className="w-[500px] h-[250px] flex-shrink-0 " key={index}>
                  <Image
                    src={i.url}
                    width={500}
                    height={500}
                    alt={`image ${id}`}
                    className="object-cover w-full h-full rounded-xl border-2 border-white"
                  />
                </div>
              );
          })}
        </div>
        <div className="text-2xl text-white/30 hover:text-white/80 transition-all duration-700 mt-5">
          {car?.description}
        </div>
      </div>
    </div>
  );
}
