import { User, Car, Tag, Image } from "./schema";

type CreateCarWithoutIdTagsImages = Omit<Car, "id">;

type CreateCarType = CreateCarWithoutIdTagsImages & {
  tags: number[];
  images: string[];
};

type UpdateCarType = Partial<CreateCarType>;

interface DeleteCar {
  id: number;
}

type SignupType = Omit<User, "id" | "cars">;
type SigninType = Omit<SignupType, "name">;

export type { CreateCarType, UpdateCarType, DeleteCar, SignupType, SigninType };
