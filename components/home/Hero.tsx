// components/Hero.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { TypewriterEffect } from "../ui/typewriter-effect";

type MeRecord = {
  id: string;
  clerkUserId: string | null;
  name: string;
  balance: number;
  currScore: number;
  profileImage: string | null;
};

const Hero = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [me, setMe] = useState<MeRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    setLoading(true);
    // benutze hier `/api/me`, das Du in app/api/me/route.ts schon implementiert hast
    fetch("/api/me", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data: MeRecord) => {
        setMe(data);
      })
      .catch((err) => {
        console.error("Fetch /api/me failed:", err);
        setMe(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isLoaded, isSignedIn, user]);

  const heroHeaderWords = [
    {
      text: "Promillecrew",
      className:
        "text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-primary-500",
    },
    {
      text: "-",
      className:
        "text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-white",
    },
    {
      text: "Biertracker",
      className:
        "text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-primary-500 text-primary-500",
    },
  ];

  function scrollToSection(e: React.MouseEvent) {
    e.preventDefault();
    document
      .querySelector("#monthlyWinner")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative flex flex-col items-center justify-center w-full h-screen bg-light-800 dark:bg-dark-300">
      <div className="grid max-w-screen-xl px-6 py-12 mx-auto lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-7 flex flex-col justify-center">
          <TypewriterEffect words={heroHeaderWords} />

          {isLoaded && isSignedIn ? (
            loading ? (
              <p className="mt-4 text-gray-600 dark:text-gray-400">Lade…</p>
            ) : me ? (
              <p className="mt-4 text-gray-600 dark:text-gray-400 md:text-lg lg:text-lg">
                Herzlich willkommen zurück{" "}
                <span className="font-semibold text-primary-500 dark:text-primary-500">
                  {me.name}
                </span>
                !<br />
                Dein Guthaben beträgt:{" "}
                <span className="font-semibold text-primary-500 dark:text-primary-500">
                  {me.balance} Biercoins!
                </span>
                <br />
                Du hast dieses Jahr schon{" "}
                <span className="font-semibold text-primary-500 dark:text-primary-500">
                  {me.currScore} Bier{me.currScore === 1 ? "" : "e"}
                </span>{" "}
                getrunken.
              </p>
            ) : (
              <p className="mt-4 text-red-500 md:text-lg lg:text-xl">
                Fehler beim Laden Deines Profils.
              </p>
            )
          ) : (
            <p className="mt-4 text-gray-600 dark:text-gray-400 md:text-lg lg:text-xl">
              Bitte melde Dich an.
            </p>
          )}
        </div>

        <div className="mt-10 lg:mt-0 lg:col-span-5 lg:flex lg:justify-end">
          <div className="relative w-full h-96 lg:w-96 lg:h-96">
            <Image
              src="/assets/beer.png"
              alt="Hero Beer"
              width={500}
              height={500}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <button
          onClick={scrollToSection}
          className="px-6 py-4 bg-primary-500 text-[#161821] rounded-lg font-bold hover:-translate-y-1 transition"
        >
          Alkoholiker des Monats
        </button>
      </div>
    </section>
  );
};

export default Hero;
