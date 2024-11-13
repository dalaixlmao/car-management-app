import { User, Car } from "./schema";

type CreateCarWithoutIdTagsImages = Omit<Car, "id" | "tags" | "images">;

type CreateCarType = CreateCarWithoutIdTagsImages & {
  tags: number[];
  images: string[];
};

type UpdateCarType = Partial<CreateCarType>;

interface DeleteCarType {
  id: number;
}

type SignupType = Omit<User, "id" | "cars">;
type SigninType = Omit<SignupType, "name">;

export type {
  CreateCarType,
  UpdateCarType,
  DeleteCarType,
  SignupType,
  SigninType,
};

