"use client";
import { Chart } from "@/components/home/CurrMonthlyTable";
import { BeerDataTable } from "@/components/home/DataTable";
import DrinkTable from "@/components/home/DrinkTable";
import Hero from "@/components/home/Hero";

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
      <DrinkTable />
      <Chart />
    </div>
  );
};

export default Page;
