// components/DrinkTable.tsx
"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { User, useUsers } from "@/app/lib/hooks/useUsers";
import useSWR from "swr";

export default function DrinkTable() {
  const { users, isLoading, error } = useUsers();
  const { mutate } = useSWR("/api/users");

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Fehler beim Laden</p>;
  if (!users?.length) return <p>Keine Nutzer gefunden</p>;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Curr Score</TableHead>
            <TableHead>Aktion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.balance}</TableCell>
              <TableCell>{user.currScore}</TableCell>
              <TableCell>
                <Button
                  onClick={async () => {
                    await fetch(`/api/users/${user.id}/balance`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ delta: +1 }),
                    });
                    mutate(); // Refetch the users list
                  }}
                >
                  +1 Bier
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={async () => {
                    await fetch(`/api/users/${user.id}/balance`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ delta: -1 }),
                    });
                    mutate();
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
