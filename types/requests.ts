import { User, Car } from "./schema";

type CreateCarWithoutIdTagsImages = Omit<Car, "id" | "tags" | "images" | "user">;

type CreateCarType = CreateCarWithoutIdTagsImages & {
  tags: string[];
  images: string[];
};

type UpdateCarType = Partial<CreateCarType> & {id: number};

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
