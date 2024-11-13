import { SignupType } from "@/types/requests";
import { User } from "@/types/schema";
import { PrismaClient } from "@prisma/client";
import { signUpSchema } from "@/schemas/zodSchemas";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export default async function signup(credentials:SignupType){
    try {
        const { email, password, name } = credentials;

        const res = signUpSchema.safeParse({
          email,
          password,
          name,
        });

        if (!res.success) return null;
        const user: Omit<User, "cars"> | null = await prisma.user.findUnique({
          where: { email },
        });

        if (user) return null;
        else {
          const hashedPass = await hash(password, 10);
          const user = await prisma.user.create({
            data: {
              name,
              email,
              password: hashedPass,
            },
          });
          return { id: user.id.toString() };
        }
      } catch {
        return null;
      }
}