// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const fridge = await prisma.fridge.upsert({
    where: { id: 1 },
    update: {},
    create: {
      beerCount: 0,
    },
  });
  console.log(`Fridge created or updated with ID: ${fridge.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
