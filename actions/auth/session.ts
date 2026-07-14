"use server";

import { adminAuth } from "@/firebase/admin-init";
import { ensureUserDocument } from "@/actions/auth/create-user";
import { getSession } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CB_AUTH_COOKIE = "cb_auth";
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;

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
    session.issuedAt = Date.now();
    await session.save();

    const cookieStore = await cookies();
    cookieStore.set(CB_AUTH_COOKIE, "1", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_TTL_SECONDS,
      path: "/",
    });

    return { success: true, uid, email: userResult.email };
  } catch {
    return { success: false, error: "Nie udało się zweryfikować tokenu logowania." };
  }
}

export async function deleteSession(redirectTo = "/login"): Promise<void> {
  const session = await getSession();
  session.destroy();

  const cookieStore = await cookies();
  cookieStore.delete(CB_AUTH_COOKIE);

  redirect(redirectTo);
}
