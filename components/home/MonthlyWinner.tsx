"use client";
import React from "react";
import Card from "../shared/Card";
import { TypewriterEffect } from "../ui/typewriter-effect";
import { Spotlight } from "../shared/Spotlight";

const MonthlyWinner = () => {
  const header = [{ text: "Alkoholiker" }, { text: "des" }, { text: "Monats" }];

  return (
    <section
      id="monthlyWinner"
      className="relative w-full h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden"
    >
      {/* Spotlight Effects */}
      <Spotlight
        fill="white"
        className="absolute top-0 left-0 transform -scale-x-100"
      />
      <Spotlight fill="white" className="absolute top-0 right-0" />

      <div className="flex flex-col items-center justify-center h-full px-4 py-10 font-bold background-light800_dark300 relative z-10">
        <h2 className="text-5xl font-bold pb-10 text-black dark:text-white">
          <TypewriterEffect words={header} />
        </h2>

        {/* Card Container */}
        <div className="flex flex-col items-center justify-center w-full max-w-md px-4">
          <Card />
        </div>
      </div>
    </section>
  );
};

export default MonthlyWinner;
