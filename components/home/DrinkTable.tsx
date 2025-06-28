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

  // zentrale Funktion zum Laden der Daten
  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users", {
        cache: "no-store", // immer frisch vom Server
        credentials: "include", // falls Auth-Cookies nötig
      });
      if (!res.ok) throw new Error(res.statusText);
      const data: UserType[] = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Fehler beim Laden");
    } finally {
      setLoading(false);
    }
  }

  // beim ersten Mount laden
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;
  if (users.length === 0) return <p>Keine Nutzer gefunden.</p>;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Akt. Score</TableHead>
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
                    // +1
                    await fetch(`/api/users/${u.id}/balance`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ delta: +1 }),
                    });
                    await fetchUsers(); // Daten neu holen
                  }}
                >
                  +1 Bier
                </Button>
                <Button
                  size="sm"
                  onClick={async () => {
                    // -1
                    await fetch(`/api/users/${u.id}/balance`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ delta: -1 }),
                    });
                    await fetchUsers(); // Daten neu holen
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
