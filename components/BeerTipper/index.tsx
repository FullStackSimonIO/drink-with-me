// components/dashboard/BeerTipper.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useMe } from "@/app/lib/hooks/useMe";

type User = {
  id: string;
  name: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function BeerTipper() {
  const router = useRouter();
  const { me, loading: meLoading } = useMe();

  // Alle User laden
  const {
    data: users,
    error: usersError,
    isLoading: usersLoading,
  } = useSWR<User[]>("/api/users", fetcher, { revalidateOnFocus: false });

  const [targetId, setTargetId] = useState<string>("");
  const [amount, setAmount] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!targetId || amount < 1) {
      return toast.error("Bitte Empfänger und Menge angeben.");
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/users/${targetId}/tip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(`Du hast ${amount} Bier(e) gespendet!`);
      router.refresh();
      setAmount(1);
      setTargetId("");
    } catch (err: any) {
      toast.error(`Fehler: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (meLoading || usersLoading) return <p>Lade Dashboard…</p>;
  if (usersError) return <p style={{ color: "red" }}>Fehler beim Laden.</p>;

  // Filtere sich selbst heraus
  const choices = users!.filter((u) => u.id !== me?.id);

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Bier spenden</CardTitle>
        <CardDescription>
          Verschenke ein oder mehrere Bier an einen Freund.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Empfänger auswählen */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Empfänger
          </label>
          <Select
            value={targetId}
            onValueChange={setTargetId}
            disabled={submitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Wähle einen Nutzer" />
            </SelectTrigger>
            <SelectContent>
              {choices.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Anzahl eingeben */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Anzahl Bier
          </label>
          <Input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={submitting}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={submitting || !targetId}
          className="w-full"
        >
          {submitting ? "Spende läuft…" : "Bier spenden"}
        </Button>
      </CardFooter>
    </Card>
  );
}
