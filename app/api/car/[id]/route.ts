import { getAllCars, getCarById } from "@/services/carServices";
import { NextApiRequest, NextApiResponse } from "next";
import { GetCarType } from "@/types/response";

interface ResponseErrorMessage {
  message: string;
}

interface GetCarResponse {
  message: string;
  car: GetCarType;
}

export default async function GET(
  req: NextApiRequest,
  res: NextApiResponse<ResponseErrorMessage | GetCarResponse>
) {
  const { id } = req.query;
  if (id) {
    const car = await getCarById(Number(id));
    if (car) {
      res
        .status(200)
        .json({ message: "All cars are fetched successfully", car });
    } else {
      res.status(400).json({ message: "Invalid car id" });
    }
  }
}
