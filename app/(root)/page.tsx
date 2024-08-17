import Hero from "@/components/home/Hero";
import MonthlyWinner from "@/components/home/MonthlyWinner";
import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";

const page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <MonthlyWinner />
    </div>
  );
};

export default page;
