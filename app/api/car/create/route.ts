import { NextResponse } from "next/server";
import { createCarSchema } from "@/schemas/zodSchemas";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import findUserById from "@/services/findUserById";
import { createCar } from "@/services/carServices";

// Define the POST handler
export async function POST(req: Request) {
  try {
    // Step 1: Get session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: "Not authenticated to use this page" },
        { status: 401 }
      );
    }
    console.log("Process 1 cleared, User session cleared, user session going on.");

    // Step 2: Get user details
    const userId = Number(session.user.id);
    const user = await findUserById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    console.log("Process 2 cleared, User not found in db.", "id= ", userId);

    // Step 3: Parse and validate request body
    const body = await req.json();
    const check = createCarSchema.safeParse(body);
    if (!check.success) {
      return NextResponse.json({ message: "Invalid inputs" }, { status: 400 });
    }
    console.log("Process 3 cleared, Inputs validated, all inputs are correct.");

    const { title, description, images, tags } = check.data;

    // Step 4: Create the car
    await createCar({ title, description, images, tags, userId });
    console.log("Process 4 cleared, new Car created.");

    return NextResponse.json(
      { message: "New car created successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in POST handler:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
