'use server'

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getUserDetailsById(id: number) {
  const userDetail = await prisma.user.findUnique({ where: { id }, select:{name:true, email:true} });
  console.log(userDetail);
  return userDetail
}


export {getUserDetailsById};
