"use client";
import Image from "next/image";
import React from "react";
import MonthlyWinner from "./MonthlyWinner";
import { useUser } from "@clerk/nextjs";

const Hero = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  return (
    <div>
      <section className="relative flex flex-col items-center justify-center w-full h-screen background-light800_dark300">
        {/* Left Side: Header + Text */}
        <div className="grid max-w-screen-xl px-6 py-12 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="place-self-center lg:col-span-7">
            <h1 className="text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
              DRINK WITH ME
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400 md:text-lg lg:text-xl">
              {`Herzlich Willkommen zurück ${user?.firstName}`}
            </p>
          </div>

          {/* Right Side: Image */}
          <div className="mt-10 lg:mt-0 lg:col-span-5 lg:flex lg:justify-end">
            <div className="relative w-full h-96 lg:w-96 lg:h-96">
              <Image
                src="/assets/beer.png"
                alt="Hero"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <button className="px-6 py-4 bg-primary-500 text-dark-100 dark:text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
            Alkoholiker des Monats
          </button>
        </div>
      </section>
    </div>
  );
};

export default Hero;
