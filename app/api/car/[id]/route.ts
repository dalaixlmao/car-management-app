import { getCarById } from "@/services/carServices";
import { NextRequest, NextResponse } from "next/server";
import { GetCarType } from "@/types/response";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const carId = parseInt(params.id, 10);

  if (isNaN(carId)) {
    return NextResponse.json(
      { message: "Invalid car ID. Please provide a valid numeric ID." },
      { status: 400 }
    );
  }

  try {
    console.log("Fetching car with ID:", carId);
    const car: GetCarType | null = await getCarById(carId);

    if (!car) {
      return NextResponse.json(
        { message: "Car not found for the provided ID." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Car fetched successfully.", car },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching car by ID:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while fetching the car." },
      { status: 500 }
    );
  }
}
