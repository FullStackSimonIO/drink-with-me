"use client";
import { Chart } from "@/components/home/CurrMonthlyTable";
import Hero from "@/components/home/Hero";
import WinnersPodium from "@/components/home/TopThreeWinners";
import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";

const Page = () => {
  return (
    <div>
      <Hero />
      <WinnersPodium />
      <Chart />
    </div>
  );
};

export default Page;
