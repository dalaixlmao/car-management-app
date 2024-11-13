import { DeleteCarType, UpdateCarType } from "@/types/requests";
import { deleteCarSchema } from "@/schemas/zodSchemas";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import findUserById from "@/services/findUserById";
import { updateCar } from "@/services/carServices";

interface UpdateCarResponseType {
  message: string;
}

async function middleware(
  req: NextApiRequest,
  res: NextApiResponse<UpdateCarResponseType>,
  next: any
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user)
    return res
      .status(401)
      .json({ message: "Not authenticated to use this page" });
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

export default async function PUT(
  req: NextApiRequest,
  res: NextApiResponse<UpdateCarResponseType>
) {
  const body: UpdateCarType = req.body;
  const check = deleteCarSchema.safeParse(body);
  if (!check.success)
    return res.status(400).json({ message: "Invalid inputs" });
  const userId = (req as any).userId;
  try {
    await updateCar(body);
    return res.status(200).json({ message: "car deleted successfully" });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
}
