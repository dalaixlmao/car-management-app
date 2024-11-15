import { NextRequest, NextResponse } from "next/server";
import { updateCar } from "@/services/carServices";

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const carId = url.pathname.split('/').pop();
    
    if (!carId) {
      return NextResponse.json(
        { success: false, message: "Car ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updatedCar = await updateCar({ ...body, id: Number(carId) });
    return NextResponse.json({ success: true, data: updatedCar });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      return NextResponse.json(
        { success: false, message: error.message || "Internal Server Error" },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { success: false, message: error || "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
