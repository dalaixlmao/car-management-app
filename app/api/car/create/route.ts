import { NextResponse } from "next/server";
import { CreateCarType } from "@/types/requests";
import { createCarSchema } from "@/schemas/zodSchemas";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import findUserById from "@/services/findUserById";
import { createCar } from "@/services/carServices";

interface CreateCarResponseType {
  message: string;
}

async function middleware(
  req: NextApiRequest,
  res: NextApiResponse<CreateCarResponseType>,
  next: any
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user)
    return res.status(401).json({ message: "Not authenticated to use this page" });
  const userId = Number(session.user.id);
  try {
    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    (req as any).userId = userId;
    next();
  } catch (e: any) {
    return res.status(401).json({ message: e.message });
  }
}

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse<CreateCarResponseType>
) {
  const body: CreateCarType = req.body;
  const check = createCarSchema.safeParse(body);
  if (!check.success) return res.status(400).json({ message: "Invalid inputs" });
  const { title, description, images, tags } = body;
  const userId = (req as any).userId;
  try {
    await createCar({ title, description, images, tags, userId });
    return res.status(200).json({ message: "New car created successfully" });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
}