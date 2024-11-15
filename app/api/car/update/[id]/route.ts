import { NextRequest, NextResponse } from "next/server";
import { updateCar } from "@/services/carServices";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();

    // Your logic to handle the PUT request goes here.
    const updatedCar = await updateCar({ ...body, id: Number(id) });
    return NextResponse.json({ success: true, data: updatedCar });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
