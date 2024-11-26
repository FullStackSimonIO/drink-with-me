// components/FridgeCounter.tsx
"use client"; // To use React state and handle UI updates

import { useEffect, useState } from "react";
import { addBeer, removeBeer } from "@/app/actions/fridgeActions";

export default function FridgeCounter({ initialCount, fridgeId }: any) {
  const [beerCount, setBeerCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBeerCount() {
      try {
        const count = await fridgeId;
        setBeerCount(count);
      } catch (err) {
        setError("Failed to fetch beer count. Please try again.");
      }
    }

    loadBeerCount();
  }, [fridgeId]);

  async function incrementBeerCount() {
    try {
      setBeerCount(beerCount + 1);
      await addBeer(fridgeId);
    } catch (err) {
      setError("Failed to update beer count. Please try again.");
      setBeerCount(beerCount - 1); // Revert the count in case of error
    }
  }

  async function decrementBeerCount() {
    if (beerCount > 0) {
      try {
        setBeerCount(beerCount - 1);
        await removeBeer(fridgeId);
      } catch (err) {
        setError("Failed to update beer count. Please try again.");
        setBeerCount(beerCount + 1); // Revert the count in case of error
      }
    }
  }

  return (
    <div>
      <p>Beers in fridge: {beerCount}</p>
      {error && <p className="text-red-500">{error}</p>}
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
