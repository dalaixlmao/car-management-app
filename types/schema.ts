interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  cars: Car[];
}

interface Car {
  id: number;
  title: string;
  description: string;
  images: Image[];
  tags: Tag[];
  user: User;
}

interface Image {
  id: number;
  url: string;
  car: Car;
}

interface Tag {
  id: number;
  name: string;
  cars: Car[];
}

export type { User, Car, Image, Tag };
