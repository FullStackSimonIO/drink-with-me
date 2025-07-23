// app/lib/tokenLogic.ts
import { PrismaClient } from "@prisma/client";

/**
 * Handles token generation when balance decreases.
 * For every 10 balance decrease, user gets 1 token.
 */
export async function handleTokenGeneration(
  prisma: PrismaClient,
  userId: string,
  balanceChange: number
) {
  // Only process when balance decreases (negative change)
  if (balanceChange >= 0) return;

  const balanceDecrease = Math.abs(balanceChange);

  // Get current user data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tokens: true, purchaseProgress: true },
  });

  if (!user) return;

  // Add the decrease amount to purchase progress
  let newProgress = user.purchaseProgress + balanceDecrease;

  // Calculate how many tokens to award (every 10 balance decrease = 1 token)
  const tokensToAdd = Math.floor(newProgress / 10);

  // Remaining progress after awarding tokens
  const remainingProgress = newProgress % 10;

  // Update user if tokens should be awarded
  if (tokensToAdd > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        tokens: { increment: tokensToAdd },
        purchaseProgress: remainingProgress,
      },
    });
  } else {
    // Just update the progress
    await prisma.user.update({
      where: { id: userId },
      data: { purchaseProgress: remainingProgress },
    });
  }
}

/**
 * Wrapper for transaction-safe token generation
 */
export async function handleTokenGenerationInTransaction(
  tx: any, // Prisma transaction client
  userId: string,
  balanceChange: number
) {
  // Only process when balance decreases (negative change)
  if (balanceChange >= 0) return;

  const balanceDecrease = Math.abs(balanceChange);

  // Get current user data
  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { tokens: true, purchaseProgress: true },
  });

  if (!user) return;

  // Add the decrease amount to purchase progress
  let newProgress = user.purchaseProgress + balanceDecrease;

  // Calculate how many tokens to award (every 10 balance decrease = 1 token)
  const tokensToAdd = Math.floor(newProgress / 10);

  // Remaining progress after awarding tokens
  const remainingProgress = newProgress % 10;

  // Update user if tokens should be awarded
  if (tokensToAdd > 0) {
    await tx.user.update({
      where: { id: userId },
      data: {
        tokens: { increment: tokensToAdd },
        purchaseProgress: remainingProgress,
      },
    });
  } else {
    // Just update the progress
    await tx.user.update({
      where: { id: userId },
      data: { purchaseProgress: remainingProgress },
    });
  }
}
