"use client"; // Markiere die gesamte Datei als Client-kompatibel

import { useEffect, useState } from "react";
import { getTopUserByMonthlyCount } from "@/app/actions/getMonthlyWinner";
import Image from "next/image";

export default function TopUserCard() {
  const [topUser, setTopUser] = useState<any>(null);

  useEffect(() => {
    const fetchTopUser = async () => {
      const response = await getTopUserByMonthlyCount();

      if (response.success) {
        setTopUser(response.user);
      } else {
        console.error("Failed to fetch top user:", response.error);
      }
    };

    fetchTopUser();
  }, []);

  return (
    <div className="max-w-sm p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      {topUser ? (
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative  ">
            <Image
              src="/assets/liebwein.png"
              alt="Liebwein"
              width={150}
              height={150}
              objectFit="contain"
              className="rounded-full border-4 border-[#FF7000]"
            />
          </div>
          <h3 className="text-3xl font-semibold text-[#FF7000]">
            {topUser.name}
          </h3>
          <p className="text-white text-lg">
            Aktueller Monat:{" "}
            <span className="font-bold">{topUser.monthlyCount}</span> Halbe
          </p>
          <p className="text-white text-lg">
            Aktuelles Jahr:{" "}
            <span className="font-bold">{topUser.yearlyCount}</span> Halbe
          </p>
        </div>
      ) : (
        <p className="text-white text-lg">Loading...</p>
      )}
    </div>
  );
}
