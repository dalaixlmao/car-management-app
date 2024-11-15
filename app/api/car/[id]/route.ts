import { NextRequest, NextResponse } from "next/server";
import { getCarById } from "@/services/carServices";
import { GetCarType } from "@/types/response";

type Props = {
  params: { id: string }
}

export async function GET(
  req: NextRequest,
  context: Props
): Promise<NextResponse> {
  const carId = parseInt(context.params.id, 10);

  if (isNaN(carId)) {
    return NextResponse.json(
      { message: "Invalid car ID" },
      { status: 400 }
    );
  }

  try {
    const car: GetCarType | null = await getCarById(carId);

    if (!car) {
      return NextResponse.json(
        { message: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ car }, { status: 200 });
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}