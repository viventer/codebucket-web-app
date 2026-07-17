"use server";

import { adminAuth, adminDB } from "@/firebase/admin-init";
import { FieldValue } from "firebase-admin/firestore";

export async function revokeUserSessions(uid: string): Promise<void> {
  await Promise.all([
    adminDB
      .collection("users")
      .doc(uid)
      .update({ sessionsValidAfter: FieldValue.serverTimestamp() }),
    adminAuth.revokeRefreshTokens(uid),
  ]);
}
