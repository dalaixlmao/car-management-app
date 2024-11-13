import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function findUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
  });
}
