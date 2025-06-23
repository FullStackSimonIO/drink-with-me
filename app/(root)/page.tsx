"use client";
import { Chart } from "@/components/home/CurrMonthlyTable";
import { BeerDataTable } from "@/components/home/DataTable";
import Hero from "@/components/home/Hero";
import WinnersPodium from "@/components/home/TopThreeWinners";
import Navbar from "@/components/shared/navbar/Navbar";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";

const Page = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetch("/api/profile/sync", { method: "POST" }).catch(console.error);
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <div>
      <Hero />
      <BeerDataTable data={[]} />

      <Chart />
    </div>
  );
};

export default Page;
