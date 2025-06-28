// app/page.tsx
import DrinkTable from "@/components/home/DrinkTable";
import Hero from "@/components/home/Hero";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic"; // sicherstellen, dass immer server-seitig neu gerendert wird

export default async function Page() {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, balance: true, currScore: true },
  });

  return (
    <main className="p-4">
      <Hero />
      <DrinkTable users={users} />
    </main>
  );
}
