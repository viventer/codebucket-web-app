"use server";

import { FieldValue } from "firebase-admin/firestore";

import { adminDB } from "@/firebase/admin-init";
import { newsletterSubscribeInputSchema } from "@/schemas/newsletterSchema";

type SubscribeNewsletterResult =
  | { success: true }
  | { success: false; error: string };

export async function subscribeNewsletter(
  input: unknown,
): Promise<SubscribeNewsletterResult> {
  const parsed = newsletterSubscribeInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const email = parsed.data.email.trim().toLowerCase();

  try {
    const ref = adminDB.collection("newsletter").doc(email);
    const existing = await ref.get();

    if (!existing.exists) {
      await ref.set({
        email,
        createdAt: FieldValue.serverTimestamp(),
        source: "roadmap",
      });
    }

    return { success: true };
  } catch (error) {
    console.error("subscribeNewsletter failed:", error);
    return {
      success: false,
      error: "Nie udało się zapisać do newslettera.",
    };
  }
}
