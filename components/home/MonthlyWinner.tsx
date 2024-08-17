"use client";
import React from "react";
import Card from "../shared/Card";

const MonthlyWinner = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-3xl font-bold">
      <div className="flex flex-col items-center">
        <h2 className="mb-6">Aktueller Alkoholiker des Monats:</h2>
        <Card />
      </div>
    </div>
  );
};

export default MonthlyWinner;
