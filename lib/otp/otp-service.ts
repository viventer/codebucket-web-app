"use server";

import { adminDB } from "@/firebase/admin-init";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import crypto from "crypto";
import * as React from "react";
import { sendEmail } from "@/lib/email/send-email";

const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const MAX_RESENDS = 3;
const RESEND_COOLDOWN_SECONDS = 60;

export type SendOtpResult =
  | { success: true; cooldownUntil: number }
  | {
      success: false;
      error: string;
      cooldownUntil?: number;
      maxResendsReached?: boolean;
    };

export type VerifyOtpResult =
  | { success: true }
  | { success: false; error: string; tooManyAttempts?: boolean };

function hashOtp(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function generateOtp(): string {
  return String(crypto.randomInt(100000, 999999));
}

type SendOtpOptions = {
  collection: string;
  docId: string;
  emailTo: string;
  emailSubject: string;
  buildEmailElement: (code: string, ttlMinutes: number) => React.ReactElement;
};

export async function sendOtp({
  collection,
  docId,
  emailTo,
  emailSubject,
  buildEmailElement,
}: SendOtpOptions): Promise<SendOtpResult> {
  try {
    const otpRef = adminDB.collection(collection).doc(docId);
    const existing = await otpRef.get();

    if (existing.exists) {
      const data = existing.data()!;

      if (data.resendCount >= MAX_RESENDS) {
        return {
          success: false,
          error: "Osiągnięto limit wysyłek. Skontaktuj się z pomocą techniczną.",
          maxResendsReached: true,
        };
      }

      if (data.lastResentAt) {
        const lastResent = (data.lastResentAt as Timestamp).toDate();
        const secondsSince = (Date.now() - lastResent.getTime()) / 1000;
        if (secondsSince < RESEND_COOLDOWN_SECONDS) {
          const cooldownUntil =
            lastResent.getTime() + RESEND_COOLDOWN_SECONDS * 1000;
          return {
            success: false,
            error: "Poczekaj chwilę przed ponownym wysłaniem kodu.",
            cooldownUntil,
          };
        }
      }
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await otpRef.set({
      code: hashOtp(code),
      expiresAt: Timestamp.fromDate(expiresAt),
      attempts: 0,
      resendCount: existing.exists
        ? (existing.data()!.resendCount ?? 0) + 1
        : 0,
      lastResentAt: FieldValue.serverTimestamp(),
    });

    const emailResult = await sendEmail({
      to: emailTo,
      subject: emailSubject,
      react: buildEmailElement(code, OTP_TTL_MINUTES),
    });

    if (!emailResult.success) {
      return {
        success: false,
        error: "Nie udało się wysłać emaila. Spróbuj ponownie.",
      };
    }

    const cooldownUntil = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
    return { success: true, cooldownUntil };
  } catch {
    return { success: false, error: "Wystąpił błąd. Spróbuj ponownie." };
  }
}

type VerifyOtpOptions = {
  collection: string;
  docId: string;
  code: string;
  consume: boolean;
};

export async function verifyOtp({
  collection,
  docId,
  code,
  consume,
}: VerifyOtpOptions): Promise<VerifyOtpResult> {
  try {
    const otpRef = adminDB.collection(collection).doc(docId);
    const doc = await otpRef.get();

    if (!doc.exists) {
      return {
        success: false,
        error: "Brak aktywnego kodu weryfikacyjnego. Wyślij nowy kod.",
      };
    }

    const data = doc.data()!;

    const expiresAt = (data.expiresAt as Timestamp).toDate();
    if (new Date() > expiresAt) {
      return { success: false, error: "Kod wygasł. Wyślij nowy kod." };
    }

    if (data.attempts >= MAX_ATTEMPTS) {
      return {
        success: false,
        error: "Zbyt wiele błędnych prób. Wyślij nowy kod.",
        tooManyAttempts: true,
      };
    }

    if (data.code !== hashOtp(code)) {
      await otpRef.update({ attempts: data.attempts + 1 });
      const remaining = MAX_ATTEMPTS - (data.attempts + 1);
      if (remaining <= 0) {
        return {
          success: false,
          error: "Zbyt wiele błędnych prób. Wyślij nowy kod.",
          tooManyAttempts: true,
        };
      }
      return {
        success: false,
        error: `Nieprawidłowy kod. Pozostało prób: ${remaining}.`,
      };
    }

    if (consume) {
      await otpRef.delete();
    }

    return { success: true };
  } catch {
    return { success: false, error: "Wystąpił błąd. Spróbuj ponownie." };
  }
}
