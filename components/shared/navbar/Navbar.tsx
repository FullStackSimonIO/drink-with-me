"use client";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  SignUp,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Theme from "./Theme";
import MobileNavbar from "./MobileNavbar";

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-3 sm:gap-5 p-3 sm:p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1 flex-shrink-0">
        <Image
          src="/assets/beer.png"
          width={28}
          height={28}
          alt="Partykeller"
          className="sm:w-8 sm:h-8"
        />

        <p className="h2-bold font-spaceGrotesk text-primary-500 max-sm:hidden text-base sm:text-lg">
          Promille<span className="black">Crew</span>
        </p>
      </Link>

      <Link
        href="/"
        className="hidden lg:flex items-center gap-2 text-dark-100 dark:text-white hover:text-primary-500 dark:hover:text-primary-500  text-lg font-bold"
      >
        Home
      </Link>

      <Link
        href="/bier-casino"
        className="hidden lg:flex items-center gap-2 text-dark-100 dark:text-white hover:text-primary-500 dark:hover:text-primary-500 text-lg font-bold"
      >
        Bier-Casino
      </Link>

      <Link
        href="/profil"
        className="hidden lg:flex items-center gap-2 text-dark-100 dark:text-white hover:text-primary-500 dark:hover:text-primary-500 text-lg font-bold"
      >
        Profil
      </Link>

      <div className="flex-between gap-2 sm:gap-5">
        <Theme />

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8 sm:h-10 sm:w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <MobileNavbar />
      </div>
    </nav>
  );
};

export default Navbar;
