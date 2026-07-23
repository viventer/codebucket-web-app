"use server";

import { adminAuth, adminDB } from "@/firebase/admin-init";
import { FieldValue } from "firebase-admin/firestore";

type CreateUserResult =
  | { success: true; email: string }
  | { success: false; error: string };

async function resolveUserEmail(uid: string, email: string): Promise<string> {
  if (email) return email;

  const userRecord = await adminAuth.getUser(uid);
  return userRecord.email ?? "";
}

export async function ensureUserDocument(
  uid: string,
  email: string,
  newsletter = false,
): Promise<CreateUserResult> {
  try {
    const resolvedEmail = await resolveUserEmail(uid, email);
    if (!resolvedEmail) {
      return {
        success: false,
        error: "Nie udało się ustalić adresu email dla tego konta.",
      };
    }

    const userRef = adminDB.collection("users").doc(uid);
    const existing = await userRef.get();
    if (existing.exists) {
      const storedEmail = existing.data()?.email;
      return {
        success: true,
        email: typeof storedEmail === "string" ? storedEmail : resolvedEmail,
      };
    }

    const normalizedEmail = resolvedEmail.trim().toLowerCase();
    const newsletterRef = adminDB.collection("newsletter").doc(normalizedEmail);
    const newsletterDoc = await newsletterRef.get();
    const hadAnonymousSubscription = newsletterDoc.exists;
    const newsletterPreference = newsletter || hadAnonymousSubscription;

    const batch = adminDB.batch();
    batch.set(userRef, {
      email: resolvedEmail,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      role: "user",
      unlockedCourses: [],
      completedCourses: [],
      currentCourse: null,
      courseProgress: {},
      preferences: {
        colorScheme: null,
        newsletter: newsletterPreference,
      },
    });

    if (hadAnonymousSubscription) {
      batch.delete(newsletterRef);
    }

    await batch.commit();

    return { success: true, email: resolvedEmail };
  } catch (error) {
    console.error("ensureUserDocument failed:", error);
    return {
      success: false,
      error: "Nie udało się utworzyć konta użytkownika.",
    };
  }
}

export async function createUser(
  uid: string,
  email: string,
  newsletter = false,
): Promise<CreateUserResult> {
  return ensureUserDocument(uid, email, newsletter);
}
