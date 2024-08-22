"use client"; // Markiere die gesamte Datei als Client-kompatibel

import { useEffect, useState } from "react";
import { getTopUserByMonthlyCount } from "@/app/actions/getMonthlyWinner";

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
    <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">Top User</h2>
      {topUser ? (
        <div>
          <p>Name: {topUser.name}</p>
          <p>Monthly Count: {topUser.monthlyCount}</p>
          <p>Current Count: {topUser.currCount}</p>
          <p>Yearly Count: {topUser.yearlyCount}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
