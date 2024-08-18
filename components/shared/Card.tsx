import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

const Card = () => {
  return (
    <div className="max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <div className="flex justify-center ">
        <div className="relative w-32 h-32">
          <Image
            className="rounded-full object-cover"
            src="/assets/liebwein.png"
            alt="Card Image"
            layout="fill"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 rounded-full"></div>
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-2xl flex items-center justify-center font-bold text-primary-500">
          Herzlichen Glückwunsch! 🎉
        </h2>
        <p className="flex items-center justify-center  text-gray-700 dark:text-gray-300 mt-4 text-lg">
          Tobias Liebwein
        </p>
        <p className="flex items-center justify-center text-gray-700 dark:text-gray-300 mt-4 text-lg">
          Gesoffen: 50 Halbe
        </p>
        <p className="flex items-center justify-center text-gray-700 dark:text-gray-300 mt-4 text-lg">
          Jahresumsatz: 600 Halbe
        </p>
        <div className="flex items-center justify-center text-dark-100 dark:text-white">
          <Button className="mt-4 border-primary-500 bg" variant="outline">
            Profil ansehen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
