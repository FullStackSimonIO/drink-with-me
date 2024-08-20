"use client";
import React from "react";
import Card from "../shared/Card";

const MonthlyWinner = () => {
  return (
    <section className="w-full h-screen">
      <div className="flex flex-col pt-10 justify-center items-center h-screen font-bold background-light800_dark300">
        <h2 className="text-5xl font-bold pb-10 dark:text-white text-black">
          Alkoholiker des Monats:
        </h2>
        <div className="flex flex-col items-center justify-center text-center">
          <Card />
        </div>
      </div>
    </section>
  );
};

export default MonthlyWinner;
