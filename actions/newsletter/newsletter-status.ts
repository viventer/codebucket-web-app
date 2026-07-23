"use server";

import { adminDB } from "@/firebase/admin-init";
import { getSessionUser } from "@/lib/auth/session";

type NewsletterStatus = {
  isAuthenticated: boolean;
  subscribed: boolean;
};

export async function getNewsletterStatus(): Promise<NewsletterStatus> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return { isAuthenticated: false, subscribed: false };
  }

  try {
    const userDoc = await adminDB.collection("users").doc(sessionUser.uid).get();
    return {
      isAuthenticated: true,
      subscribed: Boolean(userDoc.data()?.preferences?.newsletter),
    };
  } catch {
    return { isAuthenticated: true, subscribed: false };
  }
}
