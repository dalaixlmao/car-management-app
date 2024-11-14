import { CreateCarType, DeleteCarType, UpdateCarType } from "@/types/requests";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import findUserById from "./findUserById";
const prisma = new PrismaClient();

async function deleteCarById({ id }: DeleteCarType) {
  const deleteCar = await prisma.car.delete({where: { id }});
}

async function updateCar(body: UpdateCarType) {
  const { id, tags, images, ...carData } = body;

  const existingCar = await prisma.car.findUnique({
    where: { id },
    include: { tags: true, images: true },
  });

  if (!existingCar) {
    throw new Error(`Car with id ${id} not found.`);
  }

  const updatedCar = await prisma.car.update({
    where: { id },
    data: {
      ...carData,
      tags: tags
        ? {
            connect: tags.filter((tag) => existingCar.tags.some((t) => t.name === tag)).map((tag) => ({ name: tag })),
            create: tags.filter((tag) => !existingCar.tags.some((t) => t.name === tag)).map((tag) => ({ name: tag })),
            disconnect: existingCar.tags.filter((tag) => !tags.includes(tag.name)).map((tag) => ({ id: tag.id })),
          }
        : undefined,

      images: images
        ? {
            create: images.filter((url) => !existingCar.images.some((image) => image.url === url)).map((url) => ({ url })),
            deleteMany: {id: { in: existingCar.images.filter((image) => !images.includes(image.url)).map((image) => image.id)}},
          }
        : undefined,
    },
    include: { tags: true, images: true},
  });

  return updatedCar;
}

async function createCar({
  title,
  description,
  images,
  tags,
  userId,
}: CreateCarType & { userId: number }) {
  const car = await prisma.car.create({
    data: {
      title,
      description,
      user: {connect: {id: userId}},
      tags: {
        connect: tags.map((t) => { return { name: t }}),
        create: tags.map((t) => {return { name: t }}),
      },
      images: {create: images.map((i) => {return { url: i }})},
    },
  });
  return car;
}

async function getAllCars() {
  return await prisma.car.findMany({
    select: {
      images: {select: { id: true, url: true, }},
      tags: {select: { id: true, name: true, }},
      id: true,
      title: true,
      user: { select: { id: true, name: true, }},
      description: true,
    },
  });
}

async function getCarById(id: number) {
  return await prisma.car.findUnique({
    where: { id },
    select: {
      images: {select: { id: true, url: true }},
      tags: {select: { id: true,name: true }},
      id: true,
      title: true,
      user: {select: { id: true, name: true }},
      description: true,
    },
  });
}

export { createCar, deleteCarById, updateCar, getAllCars, getCarById };
