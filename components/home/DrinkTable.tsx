"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Minus, Beer } from "lucide-react";
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

export type UserType = {
  id: string;
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

  return (
    <div className="w-full px-2 md:px-4 lg:px-8 py-4">
      <div className="overflow-x-auto card-wrapper rounded-lg shadow-md">
        <Table className="min-w-full table-fixed text-base text-dark-400 dark:text-light-200 bg-transparent">
          <TableHeader>
            <TableRow className="bg-light-800 dark:bg-dark-400">
              <TableHead className="px-4 py-3 text-center text-orange-400"></TableHead>
              <TableHead className="px-4 py-3 text-left text-orange-400 font-bold text-sm">
                Name:
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-orange-400 font-bold text-sm">
                Guthaben:
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-orange-400 font-bold text-sm">
                Zähler:
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-orange-400 font-bold text-sm">
                Aktion:
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u, idx) => {
              const isMe = u.id === meId;
              return (
                <TableRow
                  key={u.id}
                  className={
                    idx % 2 === 0
                      ? "bg-light-700 dark:bg-dark-300"
                      : "bg-light-600 dark:bg-dark-200"
                  }
                >
                  {/* Avatar */}
                  <TableCell className="px-4 py-3 bg-transparent text-center">
                    {u.profileImage ? (
                      <Image
                        src={u.profileImage}
                        alt={u.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-500 mx-auto" />
                    )}
                  </TableCell>

                  {/* Name */}
                  <TableCell className="px-4 py-3 truncate bg-transparent text-gray-600 dark:text-gray-400">
                    {u.name}
                  </TableCell>

                  {/* Balance */}
                  <TableCell className="px-4 py-3 text-center bg-transparent text-gray-600 dark:text-gray-400">
                    {u.balance}
                  </TableCell>

                  {/* CurrScore */}
                  <TableCell className="px-4 py-3 text-center bg-transparent text-gray-600 dark:text-gray-400">
                    {u.currScore}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-4 py-3 bg-transparent">
                    <div className="flex items-center justify-center gap-2">
                      {/* +1 Balance nur Admin */}
                      {isAdmin && (
                        <Button
                          size="icon"
                          variant="secondary"
                          className="p-2"
                          onClick={async () => {
                            await fetch(`/api/users/${u.id}/balance`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ delta: +1 }),
                            });
                            router.refresh();
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Bier Trinken: nur Du selbst oder Admin */}
                      {(isAdmin || isMe) && (
                        <Button
                          size="icon"
                          variant="secondary"
                          className="p-2"
                          onClick={async () => {
                            await fetch(`/api/users/${u.id}/drink`, {
                              method: "POST",
                            });
                            router.refresh();
                          }}
                        >
                          <Beer className="w-4 h-4" />
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
