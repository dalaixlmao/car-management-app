"use server";

import { CreateCarType, DeleteCarType, UpdateCarType } from "@/types/requests";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import findUserById from "./findUserById";
const prisma = new PrismaClient();

async function deleteCarById({ id }: DeleteCarType) {
  const deleteCar = await prisma.car.delete({ where: { id } });
}

async function updateCar(body: UpdateCarType) {
  const { id, tags, images, ...carData } = body;

  // Check if the car exists
  const existingCar = await prisma.car.findUnique({
    where: { id },
    include: { tags: true, images: true },
  });

  if (!existingCar) {
    throw new Error(`Car with ID ${id} not found.`);
  }

  // Prepare updates for tags
  const tagUpdates = tags
    ? {
        connect: tags
          .filter((tag) => existingCar.tags.some((t) => t.name === tag))
          .map((tag) => ({ name: tag })),
        create: tags
          .filter((tag) => !existingCar.tags.some((t) => t.name === tag))
          .map((tag) => ({ name: tag })),
        disconnect: existingCar.tags
          .filter((tag) => !tags.includes(tag.name))
          .map((tag) => ({ id: tag.id })),
      }
    : undefined;

  // Prepare updates for images
  const imageUpdates = images
    ? {
        create: images
          .filter(
            (url) => !existingCar.images.some((image) => image.url === url)
          )
          .map((url) => ({ url })),
        deleteMany: {
          id: {
            in: existingCar.images
              .filter((image) => !images.includes(image.url))
              .map((image) => image.id),
          },
        },
      }
    : undefined;

  // Ensure no undefined values are passed to Prisma
  const data: Record<string, any> = {
    ...carData,
  };

  if (tagUpdates) {
    data.tags = tagUpdates;
  }
  if (imageUpdates) {
    data.images = imageUpdates;
  }

  // Update the car
  const updatedCar = await prisma.car.update({
    where: { id },
    data,
    include: { tags: true, images: true },
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
  console.log(
    "Adding car to db started with parameters",
    title,
    description,
    images,
    tags,
    userId
  );

  // Ensure user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error(`User not found in db. id= ${userId}`);
  }

  const car = await prisma.car.create({
    data: {
      title,
      description,
      user: { connect: { id: userId } },
      tags: {
        connectOrCreate: tags.map((t) => ({
          where: { name: t },
          create: { name: t },
        })),
      },
      images: {
        create: images.map((i) => ({
          url: i,
        })),
      },
    },
  });

  console.log("New Car finally created, moving to next step");
  return car;
}

async function getAllCars() {
  return await prisma.car.findMany({
    select: {
      images: { select: { id: true, url: true } },
      tags: { select: { id: true, name: true } },
      id: true,
      title: true,
      user: { select: { id: true, name: true } },
      description: true,
    },
  });
}

async function getCarById(id: number) {
  return await prisma.car.findUnique({
    where: { id },
    select: {
      images: { select: { id: true, url: true } },
      tags: { select: { id: true, name: true } },
      id: true,
      title: true,
      user: { select: { id: true, name: true } },
      description: true,
    },
  });
}

function removeUnnecessaryImages(images: string[]) {
  return images.filter((i) => {
    return !i.startsWith("blob");
  });
}

export { createCar, deleteCarById, updateCar, getAllCars, getCarById, removeUnnecessaryImages };
