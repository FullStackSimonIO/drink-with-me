// pages/api/clerk-webhook.ts

import { NextApiRequest, NextApiResponse } from "next";
import { ConvexHttpClient } from "convex/browser";
import { ClerkWebhook } from "@clerk/clerk-sdk-node"; // Importiere Clerk SDK
import crypto from "crypto";

// Initialisiere den Convex HTTP Client
const convex = new ConvexHttpClient("https://your-convex-endpoint.com");

// Verarbeite Webhook-Anfragen von Clerk
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  const signature = req.headers["clerk-signature"] as string;

  // Überprüfe die Webhook-Signatur
  const computedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (signature !== computedSignature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  try {
    const { type, data } = req.body;

    if (type === "user.created") {
      const { id, email_addresses, first_name, last_name } = data;
      const email = email_addresses[0].email_address;
      const name = `${first_name} ${last_name}`;

      // Erstelle einen neuen Benutzer in der Convex-Datenbank
      await convex.mutate("createUser", {
        clerkId: id,
        email: email,
        name: name,
        // weitere Felder, die du hinzufügen möchtest
      });

      res.status(200).json({ message: "User created in Convex" });
    } else {
      res.status(200).json({ message: "Event ignored" });
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
