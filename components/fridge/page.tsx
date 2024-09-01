// components/FridgeCounter.tsx
import { prisma } from "@/lib/prisma"; // Make sure to set up a Prisma client in /lib/prisma

export default function FridgeCounter({ fridgeId }) {
  async function incrementBeerCount() {
    "use server";
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
    await prisma.fridge.update({
      where: { id: fridgeId },
      data: {
        beerCount: {
          decrement: 1,
        },
      },
    });
  }

  return (
    <div>
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
