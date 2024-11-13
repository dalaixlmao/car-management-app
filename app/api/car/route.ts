import { getAllCars } from "@/services/carServices";
import { NextApiRequest, NextApiResponse } from "next";
import { GetCarType } from "@/types/response";

interface ResponseErrorMessage {
  message: string;
}

interface GetAllCarResponse {
  message: string;
  cars: GetCarType[];
}

export default async function GET(
  req: NextApiRequest,
  res: NextApiResponse<ResponseErrorMessage | GetAllCarResponse>
) {
  const body = req.body;
  const cars: GetCarType[] = await getAllCars();
  if (cars) {
    res
      .status(200)
      .json({ message: "All cars are fetched successfully", cars });
  } else {
    res.status(400).json({ message: "Cars don't exist" });
  }
}
