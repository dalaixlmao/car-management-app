"use client";

import { useEffect, useState } from "react";
import Car from "./Car";
import { SignupType } from "@/types/requests";
import { getUserDetailsById } from "@/services/userServices";

const cars = [
  {
    title: "Tesla Model S",
    description:
      "A premium electric sedan with unmatched performance and cutting-edge technology.",
    images: [
      "https://example.com/tesla-model-s-1.jpg",
      "https://example.com/tesla-model-s-2.jpg",
    ],
    tags: ["electric", "Tesla", "sedan", "luxury", "performance"],
  },
  {
    title: "Ford Mustang Mach-E",
    description:
      "An all-electric SUV that combines iconic Mustang performance with modern EV capabilities.",
    images: [
      "https://example.com/mustang-mach-e-1.jpg",
      "https://example.com/mustang-mach-e-2.jpg",
    ],
    tags: ["electric", "Ford", "SUV", "performance", "dealer-certified"],
  },
  {
    title: "Toyota Corolla",
    description:
      "A reliable and fuel-efficient compact sedan, perfect for daily commutes.",
    images: [
      "https://example.com/toyota-corolla-1.jpg",
      "https://example.com/toyota-corolla-2.jpg",
    ],
    tags: ["gasoline", "Toyota", "sedan", "economy", "certified pre-owned"],
  },
  {
    title: "BMW X5",
    description:
      "A luxury mid-size SUV with excellent driving dynamics and premium features.",
    images: [
      "https://example.com/bmw-x5-1.jpg",
      "https://example.com/bmw-x5-2.jpg",
    ],
    tags: ["SUV", "BMW", "luxury", "all-wheel-drive", "dealer"],
  },
  {
    title: "Honda Civic",
    description:
      "A sporty compact sedan with advanced safety features and great fuel efficiency.",
    images: [
      "https://example.com/honda-civic-1.jpg",
      "https://example.com/honda-civic-2.jpg",
    ],
    tags: ["compact", "Honda", "sedan", "economy", "reliable"],
  },
  {
    title: "Chevrolet Silverado 1500",
    description: "A powerful full-size pickup truck built for work and play.",
    images: [
      "https://example.com/chevrolet-silverado-1.jpg",
      "https://example.com/chevrolet-silverado-2.jpg",
    ],
    tags: ["truck", "Chevrolet", "pickup", "off-road", "dealer-certified"],
  },
  {
    title: "Audi A4",
    description:
      "A premium compact sedan offering refined performance and a luxurious interior.",
    images: [
      "https://example.com/audi-a4-1.jpg",
      "https://example.com/audi-a4-2.jpg",
    ],
    tags: ["luxury", "Audi", "sedan", "performance", "dealer"],
  },
  {
    title: "Hyundai Tucson",
    description:
      "A stylish and practical compact SUV with advanced tech and safety features.",
    images: [
      "https://example.com/hyundai-tucson-1.jpg",
      "https://example.com/hyundai-tucson-2.jpg",
    ],
    tags: ["SUV", "Hyundai", "compact", "practical", "dealer-certified"],
  },
  {
    title: "Mercedes-Benz C-Class",
    description:
      "A luxury sedan with advanced technology, comfort, and exceptional performance.",
    images: [
      "https://example.com/mercedes-c-class-1.jpg",
      "https://example.com/mercedes-c-class-2.jpg",
    ],
    tags: ["luxury", "Mercedes-Benz", "sedan", "performance", "dealer"],
  },
  {
    title: "Jeep Wrangler",
    description:
      "An iconic off-road SUV built to conquer any terrain with rugged style.",
    images: [
      "https://example.com/jeep-wrangler-1.jpg",
      "https://example.com/jeep-wrangler-2.jpg",
    ],
    tags: ["off-road", "Jeep", "SUV", "adventure", "dealer-certified"],
  },
];

export default function Feed({ userId }: { userId: number }) {
  const [user, setUser] = useState<Omit<SignupType, "password">>();
  const [createCar, setCreateCar] = useState(false);
  useEffect(() => {
    async function getUser() {
      const u = await getUserDetailsById(userId);
      if (u) setUser(u);
    }
    getUser();
  }, [userId, setUser]);

  const car = {
    title: "Tesla Model S",
    description:
      "A premium electric sedan with unmatched performance and cutting-edge technology.",
    images: [
      "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVzbGElMjBtb2RlbCUyMHN8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1620891507099-170ea1456fd9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHRlc2xhJTIwbW9kZWwlMjBzfGVufDB8fDB8fHww",
    ],
    tags: ["electric", "Tesla", "sedan", "luxury", "performance"],
  };

  return (
    <div className="lg:w-2/5 md:w-3/5 w-[90%] h-screen md:border-r md:border-l md:border-white/10">
      <div>
        <button
          onClick={() => {
            setCreateCar(true);
          }}
          className="bg-indigo-500 px-3 py-1 text-black rounded-full text-sm font-semibold ml-5 my-2 hover:bg-indigo-400 transition-all"
        >
          Add you car
        </button>
        <div className="z-10 absolute w-screen h-screen bg-black/70 backdrop-blur-sm top-0 left-0">
          <div>
            
          </div>
        </div>
      </div>
      <div className="w-full px-4 py-2">
        <Car
          title={car.title}
          images={car.images}
          description={car.description}
          tags={car.tags}
          userName={user?.name || ""}
        />
      </div>
    </div>
  );
}
