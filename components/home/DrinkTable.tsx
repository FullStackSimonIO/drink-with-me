// components/home/DrinkTable.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";

export default function DrinkTable({
  users,
}: {
  users: { id: string; name: string; balance: number; currScore: number }[];
}) {
  const router = useRouter();

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Aktueller Score</TableHead>
            <TableHead>Aktion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.balance}</TableCell>
              <TableCell>{u.currScore}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  size="sm"
                  onClick={async () => {
                    await fetch(`/api/users/${u.id}/balance`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ delta: +1 }),
                    });
                    router.refresh(); // ← hier erzwingst du das Neuladen aller Server-Props
                  }}
                >
                  +1 Bier
                </Button>
                <Button
                  size="sm"
                  onClick={async () => {
                    await fetch(`/api/users/${u.id}/balance`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ delta: -1 }),
                    });
                    router.refresh();
                  }}
                >
                  –1 Bier
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
