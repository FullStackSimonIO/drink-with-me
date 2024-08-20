"use client";
import React from "react";
import Card from "../shared/Card";

const MonthlyWinner = () => {
  return (
    <div className="flex flex-col pt-10 items-center h-screen text-3xl font-bold background-light800_dark300">
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="mb-6 dark:text-white text-dark-100">
          Aktueller Alkoholiker des Monats:..w
        </h2>
        <Card />
      </div>
    </div>
  );
};

export default MonthlyWinner;
