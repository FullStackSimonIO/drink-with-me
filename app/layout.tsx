/* eslint-disable camelcase */
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import Navbar from "@/components/shared/navbar/Navbar";
import { prisma } from "./lib/prisma";

export const metadata: Metadata = {
  title: "Suff Bier",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, balance: true, currScore: true },
  });

  return (
    <html lang="de">
      <body className="background-light800_dark300">
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: "primary-gradient",
              footerActionLink: "primary-text-gradient hover:text-primary-500",
            },
          }}
        >
          <ThemeProvider>
            <Navbar />
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
