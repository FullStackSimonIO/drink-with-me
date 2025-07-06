// components/OnlineUsers.tsx
"use client";

import React from "react";
import Image from "next/image";
import { usePresence } from "@/app/lib/hooks/usePresence";

export function OnlineUsers() {
  const { online, isLoading, error } = usePresence();

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "red" }}>Fehler beim Laden.</p>;

  return (
    <div className="p-4 bg-light-800 dark:bg-dark-400 rounded-lg shadow-md max-w-md">
      <h3 className="mb-2 text-lg font-semibold">Aktuell online</h3>
      {online && online.length === 0 && <p>Niemand online.</p>}
      <ul className="space-y-2">
        {online?.map((u) => (
          <li key={u.id} className="flex items-center space-x-3">
            {u.profileImage ? (
              <Image
                src={u.profileImage}
                alt={u.name}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-500 rounded-full" />
            )}
            <span className="text-sm">{u.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
