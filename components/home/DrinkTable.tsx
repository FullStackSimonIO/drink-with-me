// components/home/DrinkTable.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";

type UserType = {
  id: string;
  name: string;
  balance: number;
  currScore: number;
};

export default function DrinkTable() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1) zentrale Fetch-Funktion
  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users", {
        cache: "no-store", // kein Cache, immer live
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setUsers(await res.json());
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  // 2) onMount + Polling alle 5s
  useEffect(() => {
    fetchUsers(); // sofort beim Mount
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Keine Nutzer gefunden.
              </TableCell>
            </TableRow>
          )}
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
                    await fetchUsers(); // sofort neu ziehen
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
                    await fetchUsers();
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
