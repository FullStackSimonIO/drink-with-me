// components/ProfileCard/index.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Me } from "@/app/lib/hooks/useMe";

export function ProfileCard({ user }: { user: Me }) {
  const [amt, setAmt] = useState(1);
  const isAdmin = user.role === "ADMIN";

  const addFreeBeer = async () => {
    const res = await fetch("/api/freibier", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta: amt }),
    });
    if (res.ok) {
      toast.success(`${amt} Freibier hinzugefügt! 🍺`);
      // hier könntest du router.refresh() oder SWR mutate auf /api/me auslösen
    } else {
      toast.error("Fehler beim Hinzufügen von Freibier");
    }
  };

  return (
    <div className="glass-card flex flex-col items-center text-center">
      <div className="relative w-24 h-24 mb-4">
        {user.profileImage ? (
          <Image
            src={user.profileImage}
            alt={user.name}
            fill
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full  rounded-full" />
        )}
      </div>
      <h2 className="text-2xl font-semibold text-primary-500 mb-1">
        {user.name}
      </h2>
      <dl className="space-y-2 text-gray-200">
        <div>
          <dt className="inline font-medium">Kontostand:</dt>{" "}
          <dd className="inline">{user.balance} €</dd>
        </div>
        <div>
          <dt className="inline font-medium">Bier dieses Jahr:</dt>{" "}
          <dd className="inline">{user.currScore}</dd>
        </div>
      </dl>

      {isAdmin && (
        <div className="mt-6 w-full space-y-3">
          <label className="block text-left text-gray-200">
            <span className="block mb-1">Anzahl Freibier:</span>
            <input
              type="number"
              value={amt}
              min={1}
              onChange={(e) => setAmt(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-500 bg-transparent px-4 py-2 text-white focus:ring-2 focus:ring-orange-400"
            />
          </label>
          <Button
            className="px-6 py-4 text-[#161821] bg-primary-500 rounded-lg font-bold hover:-translate-y-1 transition"
            onClick={addFreeBeer}
          >
            Freibier hinzufügen
          </Button>
        </div>
      )}
    </div>
  );
}
