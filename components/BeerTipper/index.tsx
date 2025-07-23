// components/dashboard/BeerTipper.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Gift,
  Users,
  Heart,
  Coins,
  Send,
  Sparkles,
  Plus,
  Minus,
  Check,
  ArrowRight,
} from "lucide-react";

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
  const [showSuccess, setShowSuccess] = useState(false);

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

      setShowSuccess(true);
      toast.success(`Du hast ${amount} Bier(e) gespendet! 🍺`);

      // Reset form after success animation
      setTimeout(() => {
        setAmount(1);
        setTargetId("");
        setShowSuccess(false);
        router.refresh();
      }, 2000);
    } catch (err: any) {
      toast.error(`Fehler: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const incrementAmount = () => setAmount((prev) => Math.min(prev + 1, 50));
  const decrementAmount = () => setAmount((prev) => Math.max(prev - 1, 1));

  const selectedUser = users?.find((u) => u.id === targetId);

  // Loading state
  if (meLoading || usersLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 border border-white/10 shadow-2xl p-6"
      >
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-white">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white/70 rounded-full animate-spin"></div>
            <span className="text-sm">Lade Dashboard...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (usersError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-red-800/90 via-red-900/90 to-slate-800/90 border border-red-500/20 shadow-2xl p-6"
      >
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-300 font-medium">Fehler beim Laden</p>
          <p className="text-red-400/70 text-sm mt-1">
            Benutzer konnten nicht geladen werden
          </p>
        </div>
      </motion.div>
    );
  }

  // Filtere sich selbst heraus
  const choices = users!.filter((u) => u.id !== me?.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-slate-800/90 via-purple-900/90 to-slate-800/90 border border-white/10 shadow-2xl"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-red-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-400/20 to-yellow-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 flex items-center justify-center"
          >
            <Gift className="w-8 h-8 text-orange-400" />
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white font-bold text-xl mb-2 flex items-center justify-center gap-2"
          >
            Bier ausgeben
            <Heart className="w-5 h-5 text-red-400" />
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-white/60 text-sm"
          >
            Verschenke ein oder mehrere Bier an einen Freund
          </motion.p>
        </div>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center z-50 backdrop-blur-xl"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white font-bold text-lg"
                >
                  Erfolgreich gesendet! 🍺
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-green-300 text-sm mt-1"
                >
                  {amount} Bier(e) an {selectedUser?.name}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Content */}
        <div className="space-y-6">
          {/* Recipient Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <label className="flex items-center gap-2 text-white/80 text-sm font-medium mb-3">
              <Users className="w-4 h-4 text-blue-400" />
              Empfänger wählen:
            </label>

            <div className="relative">
              <Select
                value={targetId}
                onValueChange={setTargetId}
                disabled={submitting}
              >
                <SelectTrigger className="w-full h-12 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm">
                  <SelectValue placeholder="🍺 Wähle einen Freund..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl">
                  {choices.map((u) => (
                    <SelectItem
                      key={u.id}
                      value={u.id}
                      className="text-white hover:bg-white/10 focus:bg-white/10 rounded-lg m-1"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        {u.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Amount Selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <label className="flex items-center gap-2 text-white/80 text-sm font-medium mb-3">
              <Coins className="w-4 h-4 text-yellow-400" />
              Anzahl Biere:
            </label>

            <div className="flex items-center gap-3">
              {/* Decrease Button */}
              <button
                onClick={decrementAmount}
                disabled={amount <= 1 || submitting}
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 flex items-center justify-center text-red-400 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-5 h-5" />
              </button>

              {/* Amount Display */}
              <div className="flex-1 relative">
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={amount}
                  onChange={(e) =>
                    setAmount(Math.max(1, Math.min(50, Number(e.target.value))))
                  }
                  disabled={submitting}
                  className="w-full h-12 bg-white/5 border border-white/20 rounded-xl text-white text-center text-lg font-bold focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                  🍺
                </div>
              </div>

              {/* Increase Button */}
              <button
                onClick={incrementAmount}
                disabled={amount >= 50 || submitting}
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center text-green-400 hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2 mt-3">
              {[5, 10, 20].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount)}
                  disabled={submitting}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                    amount === quickAmount
                      ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-black"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/20"
                  }`}
                >
                  {quickAmount}x
                </button>
              ))}
            </div>
          </motion.div>

          {/* Selected User Preview */}
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {selectedUser.name}
                    </p>
                    <p className="text-blue-300 text-xs">Empfänger</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{amount}x 🍺</p>
                  <p className="text-yellow-300 text-xs">Geschenk</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Send Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Button
              onClick={handleSubmit}
              disabled={submitting || !targetId || amount < 1}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  Sende Geschenk...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Bier verschenken
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </motion.div>

          {/* Fun Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center pt-4 border-t border-white/10"
          >
            <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
              <Sparkles className="w-3 h-3" />
              <span>Teilen macht glücklich!</span>
              <Sparkles className="w-3 h-3" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
