"use client";

import { useEffect, useState } from "react";
import { getTopThreeUsersByMonthlyCount } from "@/app/actions/getMonthlyTopThree";
import Image from "next/image";
import { TypewriterEffect } from "../ui/typewriter-effect";

export default function TopThreeWinners() {
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopUsers = async () => {
      const response = await getTopThreeUsersByMonthlyCount();

      if (response.success) {
        setTopUsers(response.users!);
      } else {
        console.error("Failed to fetch top users:", response.error);
        setError(response.error);
      }
    };

    fetchTopUsers();
  }, []);

  // Get the current month
  const getCurrentMonth = () => {
    const currentDate = new Date();
    return currentDate.toLocaleString("de-DE", {
      month: "long",
      year: "numeric",
    });
  };

  const currentMonth = getCurrentMonth();

  const monthlyWinnerWords = [
    {
      text: "Alkoholiker",
      className:
        "text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white",
    },
    {
      text: "des",
      className:
        "text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white",
    },
    {
      text: "Monats",
      className:
        "text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white",
    },
  ];

  return (
    <section
      id="monthlyWinner"
      className="flex flex-col w-full h-screen justify-center items-center gap-6 bg-light-800_dark-300 py-12 px-4 md:px-8 lg:px-16 background-light800_dark300"
    >
      <h2 className="text-2xl md:text-4xl font-bold text-center text-white mb-8">
        <TypewriterEffect words={monthlyWinnerWords} />
        <br />
        <p className="text-primary-500 pt-5">{currentMonth}</p>
      </h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        {error && <p className="text-red-500">{error}</p>}
        {topUsers.map((user, index) => (
          <div
            key={user.id}
            className={`relative w-full max-w-xs p-6 bg-white bg-opacity-20 backdrop-blur-lg border rounded-lg shadow-lg ${
              index === 0
                ? "md:order-2 transform md:-translate-y-6"
                : index === 1
                ? "md:order-1"
                : "md:order-3 transform md:translate-y-6"
            }`}
            style={{
              background: "rgba(255, 112, 0, 0.2)",
              border: "1px solid rgba(255, 112, 0, 0.3)",
            }}
          >
            <div className="flex flex-col items-center justify-center">
              {index === 0 && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg">
                  🥇
                </div>
              )}
              {index === 1 && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-400 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg">
                  🥈
                </div>
              )}
              {index === 2 && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-400 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg">
                  🥉
                </div>
              )}
              {/*<Image
                src={user.profileImage}
                alt={user.name}
                width={100}
                height={100}
                className="border rounded-full"
              /> */}
              <h3 className="mt-4 text-2xl font-semibold text-primary-500 text-center">
                {user.name}
              </h3>
              <p className="mt-2 text-sm text-gray-100 text-center">
                Aktueller Monat: {user.monthlyCount} Halbe
              </p>
              <p className="mt-1 text-sm text-gray-100 text-center">
                Aktuelles Jahr: {user.yearlyCount} Halbe
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
