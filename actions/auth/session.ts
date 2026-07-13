"use server";

import { adminAuth } from "@/firebase/admin-init";
import { ensureUserDocument } from "@/actions/auth/create-user";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

type CreateSessionResult =
  | { success: true; uid: string; email: string }
  | { success: false; error: string };

export async function createSession(idToken: string): Promise<CreateSessionResult> {
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    const userResult = await ensureUserDocument(uid, decoded.email ?? "");
    if (!userResult.success) {
      return { success: false, error: userResult.error };
    }

    const session = await getSession();
    session.uid = uid;
    session.email = userResult.email;
    await session.save();

    return { success: true, uid, email: userResult.email };
  } catch {
    return { success: false, error: "Nie udało się zweryfikować tokenu logowania." };
  }
}

export async function deleteSession(): Promise<void> {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
