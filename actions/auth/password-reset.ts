"use server";

import * as React from "react";
import { adminAuth } from "@/firebase/admin-init";
import { sendOtp, verifyOtp } from "@/lib/otp/otp-service";
import type { SendOtpResult, VerifyOtpResult } from "@/lib/otp/otp-service";
import { revokeUserSessions } from "@/lib/revoke-user-sessions";
import { PasswordResetOtpEmail } from "@/emails/password-reset-otp";

const COLLECTION = "otp_password_reset";

async function resolveUidForReset(
  email: string,
): Promise<{ uid: string } | { error: string }> {
  try {
    const userRecord = await adminAuth.getUserByEmail(email);
    const hasPassword = userRecord.providerData.some(
      (p) => p.providerId === "password",
    );
    if (!hasPassword) {
      return {
        error:
          "To konto nie używa logowania przez email i hasło. Zaloguj się przez Google lub innego dostawcę.",
      };
    }
    return { uid: userRecord.uid };
  } catch (err) {
    const code = (err as { code?: string }).code ?? "";
    if (code === "auth/user-not-found") {
      return {
        error: "Konto o podanym adresie email nie istnieje.",
      };
    }
    return { error: "Wystąpił błąd. Spróbuj ponownie." };
  }
}

export async function sendPasswordResetOtp(
  email: string,
): Promise<SendOtpResult> {
  const resolved = await resolveUidForReset(email);
  if ("error" in resolved) {
    return { success: false, error: resolved.error };
  }

  return sendOtp({
    collection: COLLECTION,
    docId: resolved.uid,
    emailTo: "kontakt.codebucket@gmail.com",
    emailSubject: "Zresetuj hasło – CodeBucket",
    buildEmailElement: (code, ttlMinutes) =>
      React.createElement(PasswordResetOtpEmail, { code, ttlMinutes }),
  });
}

export async function verifyPasswordResetOtp(
  email: string,
  code: string,
): Promise<VerifyOtpResult> {
  const resolved = await resolveUidForReset(email);
  if ("error" in resolved || !resolved.uid) {
    return { success: false, error: "Nieprawidłowy kod. Spróbuj ponownie." };
  }

  return verifyOtp({
    collection: COLLECTION,
    docId: resolved.uid,
    code,
    consume: false,
  });
}

type ResetPasswordResult =
  | { success: true }
  | { success: false; error: string; tooManyAttempts?: boolean };

export async function resetPasswordWithOtp(
  email: string,
  code: string,
  newPassword: string,
): Promise<ResetPasswordResult> {
  const resolved = await resolveUidForReset(email);
  if ("error" in resolved || !resolved.uid) {
    return { success: false, error: "Nieprawidłowy kod. Spróbuj ponownie." };
  }

  const { uid } = resolved;

  // Verify and consume the OTP
  const verifyResult = await verifyOtp({
    collection: COLLECTION,
    docId: uid,
    code,
    consume: true,
  });

  if (!verifyResult.success) {
    return verifyResult;
  }

  try {
    await adminAuth.updateUser(uid, { password: newPassword });
    await revokeUserSessions(uid);
    return { success: true };
  } catch {
    return { success: false, error: "Nie udało się zmienić hasła. Spróbuj ponownie." };
  }
}
