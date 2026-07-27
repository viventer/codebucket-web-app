"use server";

import { FieldValue } from "firebase-admin/firestore";

import { adminAuth, adminDB } from "@/firebase/admin-init";
import { newsletterSubscribeInputSchema } from "@/schemas/newsletterSchema";

type SubscribeNewsletterResult =
  | { success: true }
  | { success: false; error: string };

async function isRegisteredUserEmail(email: string): Promise<boolean> {
  try {
    await adminAuth.getUserByEmail(email);
    return true;
  } catch (error) {
    const code = (error as { code?: string }).code ?? "";
    if (code === "auth/user-not-found") {
      return false;
    }
    throw error;
  }
}

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
    if (await isRegisteredUserEmail(email)) {
      return {
        success: false,
        error:
          "Ten adres email jest już powiązany z kontem. Zaloguj się, aby dołączyć do newslettera.",
      };
    }

    const ref = adminDB.collection("newsletter").doc(email);
    const existing = await ref.get();

    if (existing.exists) {
      return {
        success: false,
        error: "Ten adres email jest już zapisany do newslettera.",
      };
    }

    await ref.set({
      email,
      createdAt: FieldValue.serverTimestamp(),
      source: "roadmap",
    });

    return { success: true };
  } catch (error) {
    console.error("subscribeNewsletter failed:", error);
    return {
      success: false,
      error: "Nie udało się zapisać do newslettera.",
    };
  }
}
