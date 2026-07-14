import { getIronSession, type IronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { adminDB } from "@/firebase/admin-init";
import { Timestamp } from "firebase-admin/firestore";

export type SessionData = {
  uid: string;
  email: string;
  issuedAt: number;
};

const SESSION_OPTIONS: SessionOptions = {
  cookieName: "cb_session",
  password: process.env.SESSION_SECRET!,
  ttl: 30 * 24 * 60 * 60, // 30 days in seconds
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}

export async function getSessionUser(): Promise<SessionData | null> {
  const session = await getSession();
  if (!session.uid || !session.email) return null;

  try {
    const userDoc = await adminDB.collection("users").doc(session.uid).get();
    const sessionsValidAfter = userDoc.data()?.sessionsValidAfter;
    if (sessionsValidAfter) {
      const validAfterMs =
        sessionsValidAfter instanceof Timestamp
          ? sessionsValidAfter.toMillis()
          : Number(sessionsValidAfter);
      if ((session.issuedAt ?? 0) < validAfterMs) {
        session.destroy();
        return null;
      }
    }
  } catch {
    // Fail-open: if Firestore is unavailable, allow the session to proceed
  }

  return { uid: session.uid, email: session.email, issuedAt: session.issuedAt };
}
