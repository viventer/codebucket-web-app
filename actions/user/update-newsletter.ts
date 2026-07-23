"use server";

import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";

import { adminDB } from "@/firebase/admin-init";
import { getSessionUser } from "@/lib/auth/session";

type UpdateNewsletterResult =
  | { success: true }
  | { success: false; error: string };

const newsletterInput = z.boolean();

export async function updateNewsletter(
  input: unknown,
): Promise<UpdateNewsletterResult> {
  const parsed = newsletterInput.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return { success: false, error: "Unauthenticated" };
  }

  try {
    await adminDB.collection("users").doc(sessionUser.uid).update({
      "preferences.newsletter": parsed.data,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("updateNewsletter failed:", error);
    return {
      success: false,
      error: "Nie udało się zaktualizować preferencji newslettera.",
    };
  }
}
