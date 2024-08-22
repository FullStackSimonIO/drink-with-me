"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { create } from "domain";
import React from "react";

const Page = () => {
  const createDocument = useMutation(api.documents.createDocument);

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Button
        className="bg-red rounded-lg text-black"
        onClick={() => createDocument({ username: "Simon" })}
      >
        Click Me
      </Button>
    </div>
  );
};

export default Page;
