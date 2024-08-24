import { Chart } from "@/components/home/CurrMonthlyTable";
import Hero from "@/components/home/Hero";
import MonthlyWinner from "@/components/home/MonthlyWinner";
import WinnersPodium from "@/components/home/TopThreeWinners";
import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";

const page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <WinnersPodium />
      <Chart />
    </div>
  );
};

export default page;
