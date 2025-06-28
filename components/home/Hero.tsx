"use client";
import Image from "next/image";
import React from "react";

import { useUser } from "@clerk/nextjs";
import { TypewriterEffect } from "../ui/typewriter-effect";

const Hero = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  const heroHeaderWords = [
    {
      text: "DRINK",
      className:
        "text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-primary-500 text-primary-500",
    },
    {
      text: "WITH",
      className:
        "text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white",
    },
    {
      text: "ME",
      className:
        "text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white",
    },
  ];

  const scrollToSection = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const section = document.querySelector("#monthlyWinner");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <section className="relative flex flex-col items-center justify-center w-full h-auto background-light800_dark300">
        {/* Left Side: Header + Text */}
        <div className="grid max-w-screen-xl px-6 py-12 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="place-self-center lg:col-span-7">
            <TypewriterEffect words={heroHeaderWords} />
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
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <button
            className="px-6 py-4 bg-primary-500 text-dark-100 dark:text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
            onClick={scrollToSection}
          >
            Alkoholiker des Monats
          </button>
        </div>
      </section>
    </div>
  );
};

export default Hero;
