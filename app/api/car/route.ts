import { getAllCars } from "@/services/carServices";
import { GetCarType } from "@/types/response";
import { NextRequest, NextResponse } from "next/server";

interface ResponseErrorMessage {
  message: string;
}

interface GetAllCarResponse {
  message: string;
  cars: GetCarType[];
}

// Named export for the GET method
export async function GET(req: NextRequest) {
  try {
    console.log("Entered API fetching process");
    const cars: GetCarType[] = await getAllCars();
    console.log(cars);

    if (cars.length > 0) {
      return NextResponse.json(
        { message: "All cars are fetched successfully", cars },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "No cars found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred while fetching cars" },
      { status: 500 }
    );
  }
}
