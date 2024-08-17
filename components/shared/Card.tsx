import Image from "next/image";
import React from "react";

const Card = () => {
  return (
    <div className="max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <div className="relative">
        <Image
          className="w-full h-48 object-cover"
          src="https://via.placeholder.com/400x300"
          alt="Card Image"
          width={400}
          height={300}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Titel der Karte
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mt-4">
          Dies ist eine Beschreibung, die kurz und prägnant ist. Sie bietet dem
          Leser einen schnellen Überblick über den Inhalt der Karte.
        </p>
        <button className="mt-6 px-4 py-2 bg-primary-500 text-white rounded-lg shadow-md hover:bg-primary-600 transition-colors duration-300">
          Mehr erfahren
        </button>
      </div>
    </div>
  );
};

export default Card;
