import { NextRequest, NextResponse } from "next/server";
import { getCarById } from "@/services/carServices";
import { GetCarType } from "@/types/response";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const carId = parseInt(url.pathname.split('/').pop()!, 10);

  if (isNaN(carId)) {
    return NextResponse.json({ message: "Invalid car ID" }, { status: 400 });
  }

  try {
    const car: GetCarType | null = await getCarById(carId);

    if (!car) {
      return NextResponse.json({ message: "Car not found" }, { status: 404 });
    }

    return NextResponse.json({ car }, { status: 200 });
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
