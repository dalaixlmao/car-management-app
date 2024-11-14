import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import findUserById from "@/services/findUserById";
import { deleteCarById } from "@/services/carServices";

// Middleware to validate user session
async function validateSession(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { message: "Not authenticated to use this page" },
      { status: 401 }
    );
  }

  const userId = Number(session.user.id);
  const user = await findUserById(userId);
  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return userId;
}

// DELETE handler
export async function DELETE(req: NextRequest,   { params }: { params: { id: string } }) {
  try {
    const id = params.id
    console.log("carId=",id)
    if (!id) {
      return NextResponse.json(
        { message: "Car ID is required" },
        { status: 400 }
      );
    }

    console.log(`Deleting car with ID: ${id}`);

    // Validate user session and ensure the user exists
    const userId = await validateSession(req);
    if (typeof userId !== "number") return userId;

    // Perform the delete operation
    await deleteCarById({ id: Number(id) });

    return NextResponse.json(
      { message: "Car deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting car:", error.message);
    return NextResponse.json(
      { message: "An unexpected error occurred while deleting the car" },
      { status: 500 }
    );
  }
}
