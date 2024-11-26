// app/actions/fridgeActions.ts
"use server";

import { prisma } from "@/app/lib/prisma";

export async function addBeer(fridgeId: string) {
  await prisma.fridge.update({
    where: { id: parseInt(fridgeId) },
    data: {
      beerCount: {
        increment: 1,
      },
    },
  });
}

export async function removeBeer(fridgeId: string) {
  await prisma.fridge.update({
    where: { id: parseInt(fridgeId) },
    data: {
      beerCount: {
        decrement: 1,
      },
    },
  });
}

export async function fetchBeerCount(fridgeId: string) {
  const fridge = await prisma.fridge.findUnique({
    where: { id: parseInt(fridgeId) },
  });
  return fridge?.beerCount || 0;
}
