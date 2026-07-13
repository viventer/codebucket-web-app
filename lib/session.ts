import { getIronSession, type IronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  uid: string;
  email: string;
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
  return { uid: session.uid, email: session.email };
}
