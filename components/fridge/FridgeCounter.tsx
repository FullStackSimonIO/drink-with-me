// components/FridgeCounter.tsx
"use client"; // To use React state and handle UI updates

import { useState } from "react";
import { prisma } from "@/app/lib/prisma";

export default function FridgeCounter({ initialCount, fridgeId }: any) {
  const [beerCount, setBeerCount] = useState(initialCount);

  async function incrementBeerCount() {
    "use server";
    setBeerCount(beerCount + 1);
    await prisma.fridge.update({
      where: { id: fridgeId },
      data: {
        beerCount: {
          increment: 1,
        },
      },
    });
  }

  async function decrementBeerCount() {
    "use server";
    if (beerCount > 0) {
      setBeerCount(beerCount - 1);
      await prisma.fridge.update({
        where: { id: fridgeId },
        data: {
          beerCount: {
            decrement: 1,
          },
        },
      });
    }
  }

  return (
    <div>
      <p>Beers in fridge: {beerCount}</p>
      <button
        onClick={incrementBeerCount}
        className="bg-green-500 text-white py-2 px-4 rounded-lg"
      >
        Add a Beer
      </button>
      <button
        onClick={decrementBeerCount}
        className="bg-red-500 text-white py-2 px-4 rounded-lg"
      >
        Remove a Beer
      </button>
    </div>
  );
}
