// components/home/DrinkTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Beer, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import type { Role } from "@prisma/client";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export type UserType = {
  id: string;
  level: number;
  clerkUserId: string | null;
  role: Role;
  name: string;
  profileImage: string | null;
  balance: number;
  currScore: number;
};

export default React.memo(function DrinkTable({
  users,
  me,
}: {
  users: UserType[];
  me: UserType | null;
}) {
  const router = useRouter();
  const meId = me?.id;
  const isAdmin = me?.role === "ADMIN";

  // hier merken wir uns, bei welcher Zeile gerade ein Request läuft
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Sort-Key State
  const [sortKey, setSortKey] = useState<"currScore" | "balance" | "name">(
    "currScore"
  );

  // Memoized sorted array
  const sortedUsers = useMemo(() => {
    const arr = [...users];
    switch (sortKey) {
      case "name":
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      case "balance":
        return arr.sort((a, b) => b.balance - a.balance);
      case "currScore":
      default:
        return arr.sort((a, b) => b.currScore - a.currScore);
    }
  }, [users, sortKey]);

  // universeller Handler für "Bier trinken"
  const handleDrink = async (userId: string) => {
    setLoadingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}/drink`, {
        method: "POST",
      });
      if (!res.ok) {
        // wenn die API zurückweist, zeige den Fehlertext
        const text = await res.text();
        toast.error(`Fehler: ${text}`);
      } else {
        // falls alles gut, evtl. die neuen Werte auslesen
        const { user: updated } = await res.json();
        toast.success("🍻 Prost!");
      }
    } catch (err: any) {
      toast.error(`Netzwerkfehler: ${err.message}`);
    } finally {
      setLoadingId(null);
      router.refresh();
    }
  };

  return (
    <div className="w-full md:px-4 lg:px-8 py-4">
      {/* Sort Dropdown */}
      <div className="flex justify-end pb-2">
        <label className="flex items-center space-x-2 text-gray-600 dark:text-gray-200">
          <span>Sortieren:</span>
          <select
            value={sortKey}
            onChange={(e) =>
              setSortKey(e.target.value as "currScore" | "balance" | "name")
            }
            className="bg-light-800 dark:bg-dark-400 text-sm p-1 rounded"
          >
            <option value="currScore">Zähler (absteigend)</option>
            <option value="balance">Guthaben (absteigend)</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto card-wrapper rounded-lg shadow-md">
        <Table className="min-w-full table-fixed text-base text-dark-400 dark:text-light-200 bg-transparent">
          <TableHeader>
            <TableRow className="bg-light-800 dark:bg-dark-400">
              <TableHead className="text-xs lg:px-4 py-3 text-center text-orange-400" />
              <TableHead className="text-xs lg:px-4 py-3 text-left text-orange-400 font-bold">
                Name
              </TableHead>
              <TableHead className="text-xs lg:px-4 py-3 text-center text-orange-400 font-bold">
                Konto
              </TableHead>
              <TableHead className="text-xs lg:px-4 py-3 text-center text-orange-400 font-bold">
                Zähler
              </TableHead>
              <TableHead className="text-xs lg:px-4 py-3 text-center text-orange-400 font-bold">
                Aktion
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((u, idx) => {
              const isMe = u.id === meId;
              const isLoading = loadingId === u.id;
              return (
                <TableRow
                  key={u.id}
                  className={
                    idx % 2 === 0
                      ? "bg-light-700 dark:bg-dark-300"
                      : "bg-light-600 dark:bg-dark-200"
                  }
                >
                  {/* Avatar mit Klick-Dialog */}
                  <TableCell className="md:px-4 py-3 bg-transparent text-center">
                    {u.profileImage ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="focus:outline-none">
                            <Image
                              src={u.profileImage}
                              alt={u.name}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg max-w-xs p-0">
                          <DialogHeader>
                            <DialogTitle>
                              {u.name} {u.level}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="relative w-full h-0 pb-[100%]">
                            <Image
                              src={u.profileImage}
                              alt={u.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <DialogClose className="absolute top-2 right-2 p-1">
                            ✕
                          </DialogClose>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-500 mx-auto" />
                    )}
                  </TableCell>

                  {/* Name */}
                  <TableCell className="lg:px-4 py-3 truncate bg-transparent text-gray-600 dark:text-gray-400">
                    {u.name}
                  </TableCell>

                  {/* Balance mit Farbe */}
                  <TableCell
                    className={cn(
                      "lg:px-4 py-3 text-center bg-transparent",
                      u.balance < 0
                        ? "text-red-500"
                        : u.balance > 0
                          ? "text-green-500"
                          : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    {u.balance}
                  </TableCell>

                  {/* CurrScore */}
                  <TableCell className="lg:px-4 py-3 text-center bg-transparent text-gray-600 dark:text-gray-400">
                    {u.currScore}
                  </TableCell>

                  {/* Aktionen */}
                  <TableCell className="lg:px-4 py-3 bg-transparent">
                    <div className="flex items-center justify-center gap-2">
                      {/* +1 Balance (Admin) */}
                      {isAdmin && (
                        <Button
                          size="icon"
                          variant="secondary"
                          className="p-2"
                          onClick={async () => {
                            setLoadingId(u.id);
                            try {
                              await fetch(`/api/users/${u.id}/balance`, {
                                method: "PATCH",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ delta: +1 }),
                              });
                            } catch {}
                            setLoadingId(null);
                            router.refresh();
                          }}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                          ) : (
                            <Plus className="w-4 h-4 text-orange-400" />
                          )}
                        </Button>
                      )}

                      {/* Bier trinken */}
                      {(isAdmin || isMe) && (
                        <Button
                          size="icon"
                          variant="secondary"
                          className="p-2"
                          onClick={() => handleDrink(u.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                          ) : (
                            <Beer className="w-4 h-4 text-orange-400" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});
