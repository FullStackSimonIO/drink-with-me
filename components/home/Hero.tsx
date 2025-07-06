"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { TypewriterEffect } from "../ui/typewriter-effect";

type UserRecord = {
  id: string;
  clerkUserId: string | null;
  name: string;
  balance: number;
  currScore: number;
  profileImage: string | null;
};

const Hero = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [me, setMe] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    setLoading(true);
    fetch("/api/users", { cache: "no-store" })
      .then((res) => res.json())
      .then((users: UserRecord[]) => {
        const found = users.find((u) => u.clerkUserId === user.id) ?? null;
        setMe(found);
      })
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, user]);

  const heroHeaderWords = [
    {
      text: "Promillecrew",
      className:
        "text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-primary-500 ",
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
    <section className="relative flex flex-col items-center justify-center w-full h-screen background-light800_dark300">
      <div className="grid max-w-screen-xl px-6 py-12 mx-auto lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-7 items-start justify-start">
          <TypewriterEffect words={heroHeaderWords} />
          {isLoaded && isSignedIn ? (
            me ? (
              <p className="mt-4 text-gray-600 dark:text-gray-400 md:text-lg lg:text-lg">
                Herzlich willkommen zurück{" "}
                <span className="font-semibold dark:text-primary-500 text-primary-500">
                  {user.firstName}
                </span>
                ! <br />
                Dein Guthaben beträgt:{" "}
                <span className="font-semibold dark:text-primary-500 text-primary-500">
                  {me.balance} Biercoins!
                </span>
                <br />
                Du hast dieses Jahr schon{" "}
                <span className="font-semibold dark:text-primary-500 text-primary-500">
                  {me.currScore} Bier{me.currScore === 1 ? "" : "e"}
                </span>{" "}
                getrunken.
              </p>
            ) : (
              <p className="mt-4 text-gray-600 dark:text-gray-400 md:text-lg lg:text-xl">
                Du bist registriert, aber dein Profil konnte nicht geladen
                werden.
              </p>
            )
          ) : (
            <p className="mt-4 text-gray-600 dark:text-gray-400 md:text-lg lg:text-xl">
              Bitte melde dich an.
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
          className="px-6 py-4 text-[#161821] bg-primary-500 rounded-lg font-bold hover:-translate-y-1 transition"
        >
          Alkoholiker des Monats
        </button>
      </div>
    </section>
  );
};

export default Hero;
