import { NextRequest, NextResponse } from "next/server";
import { updateCar } from "@/services/carServices";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();

    // Your logic to handle the PUT request goes here.
    const updatedCar = await updateCar({ ...body, id: Number(id) });
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
