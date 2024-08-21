import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

const Card = () => {
  return (
    <div className="max-w-sm mx-auto bg-white/30 dark:bg-gray-800/30 rounded-3xl shadow-lg backdrop-blur-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <div className="relative w-32 h-32 mx-auto -mt-16">
        <Image
          className="rounded-full object-cover"
          src="/assets/liebwein.png"
          alt="Card Image"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 rounded-full"></div>
      </div>
      <div className="p-6">
        <h2 className="text-3xl flex items-center justify-center font-bold text-primary-500">
          Herzlichen Glückwunsch! 🎉
        </h2>
        <p className="flex items-center justify-center text-gray-700 dark:text-gray-300 mt-4 text-lg">
          Tobias Liebwein
        </p>
        <p className="flex items-center justify-center text-gray-700 dark:text-gray-300 mt-4 text-lg">
          Gesoffen: 50 Halbe
        </p>
        <p className="flex items-center justify-center text-gray-700 dark:text-gray-300 mt-4 text-lg">
          Jahresumsatz: 600 Halbe
        </p>
        <div className="flex items-center justify-center text-dark-100 dark:text-white">
          <Button className="mt-6 bg-primary-500 text-white rounded-full px-6 py-2 shadow-md hover:bg-primary-600">
            Profil ansehen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
