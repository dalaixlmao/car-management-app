import { SigninType } from "@/types/requests";
import { hash, compare } from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { signInSchema } from "@/schemas/zodSchemas";
import { User } from "@/types/schema";

const prisma = new PrismaClient();

export default async function signin(credentials: SigninType) {
  try {
    const { email, password } = credentials;
    const hashedPass = await hash(password, 10);
    const res = signInSchema.safeParse({
      email: email,
      password: password,
    });
    if (!res.success) return null;
    const user: Omit<User, "cars"> | null = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) return null;
    const res1 = await compare(password, user.password);
    if (!res1) return null;
    return { id: user.id.toString() };
  } catch (e) {
    return null;
  }
}
