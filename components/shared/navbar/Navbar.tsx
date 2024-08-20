import { SignedIn, SignedOut, SignIn, SignUp, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Theme from "./Theme";
import MobileNavbar from "./MobileNavbar";

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/assets/images/site-logo.svg"
          width={23}
          height={23}
          alt="Partykeller"
        />

        <p className="h2-bold font-spaceGrotesk text-primary-500 max-sm:hidden">
          Party<span className="black">Keller</span>
        </p>
      </Link>

      <Link
        href="/"
        className="hidden lg:flex items-center gap-2 text-dark-100 dark:text-white hover:text-primary-500 dark:hover:text-primary-500  text-lg font-bold"
      >
        Home
      </Link>
      <Link
        href="/saeufer"
        className="hidden lg:flex items-center gap-2 text-dark-100 dark:text-white hover:text-primary-500 dark:hover:text-primary-500 text-lg font-bold"
      >
        Säufer
      </Link>
      <Link
        href="/profile"
        className="hidden lg:flex items-center gap-2 text-dark-100 dark:text-white hover:text-primary-500 dark:hover:text-primary-500 text-lg font-bold"
      >
        Profil
      </Link>

      <div className="flex-between gap-5">
        <Theme />

        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          />
        </SignedIn>
        <SignedOut>
          <SignIn />
        </SignedOut>

        <MobileNavbar />
      </div>
    </nav>
  );
};

export default Navbar;