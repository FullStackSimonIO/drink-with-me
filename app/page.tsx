"use client";
import React, { useState } from "react";
import { alkis as initialAlkis } from "@/data";

const Page = () => {
  // Zustand für die Alkis initialisieren
  const [alkis, setAlkis] = useState(initialAlkis);

  // Funktion zum Erhöhen des Counters
  const increaseCounter = (name: any) => {
    setAlkis((prevAlkis) =>
      prevAlkis.map((alki) =>
        alki.name === name ? { ...alki, counter: alki.counter + 1 } : alki
      )
    );
  };

  // Funktion zum Verringern des Counters
  const decreaseCounter = (name: any) => {
    setAlkis((prevAlkis) =>
      prevAlkis.map((alki) =>
        alki.name === name ? { ...alki, counter: alki.counter - 1 } : alki
      )
    );
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Alex Keller</h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        {alkis.map((alki) => (
          <div
            key={alki.name}
            className="flex text-black items-center justify-between mb-4 border-b-2 pb-2 last:border-b-0"
          >
            <span className="text-xl font-semibold">{alki.name}</span>
            <div className="flex items-center">
              <button
                onClick={() => decreaseCounter(alki.name)}
                className="bg-red-500 text-white font-bold py-1 px-3 rounded-l-lg hover:bg-red-600 focus:outline-none"
              >
                -
              </button>
              <span className="bg-gray-200 text-gray-800 font-medium py-1 px-4">
                {alki.counter}
              </span>
              <button
                onClick={() => increaseCounter(alki.name)}
                className="bg-green-500 text-white font-bold py-1 px-3 rounded-r-lg hover:bg-green-600 focus:outline-none"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
