"use server";

import { adminDB } from "@/firebase/admin-init";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import crypto from "crypto";
import { Resend } from "resend";

const COLLECTION = "otp_password_change";
const MAX_ATTEMPTS = 5;

type VerifyPasswordChangeOtpResult =
  | { success: true }
  | { success: false; error: string; tooManyAttempts?: boolean };

function hashOtp(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function verifyPasswordChangeOtp(
  uid: string,
  code: string,
): Promise<VerifyPasswordChangeOtpResult> {
  try {
    const otpRef = adminDB.collection(COLLECTION).doc(uid);
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

    await otpRef.delete();

    return { success: true };
  } catch {
    return { success: false, error: "Wystąpił błąd. Spróbuj ponownie." };
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

const OTP_TTL_MINUTES = 10;
const MAX_RESENDS = 3;
const RESEND_COOLDOWN_SECONDS = 60;

type SendPasswordChangeOtpResult =
  | { success: true; cooldownUntil: number }
  | {
      success: false;
      error: string;
      cooldownUntil?: number;
      maxResendsReached?: boolean;
    };

function generateOtp(): string {
  return String(crypto.randomInt(100000, 999999));
}

export async function sendPasswordChangeOtp(
  uid: string,
  email: string,
): Promise<SendPasswordChangeOtpResult> {
  try {
    const otpRef = adminDB.collection(COLLECTION).doc(uid);
    const existing = await otpRef.get();

    if (existing.exists) {
      const data = existing.data()!;

      if (data.resendCount >= MAX_RESENDS) {
        return {
          success: false,
          error:
            "Osiągnięto limit wysyłek. Skontaktuj się z pomocą techniczną.",
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

    const { error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "kontakt.codebucket@gmail.com",
      subject: "Potwierdź zmianę hasła – CodeBucket",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Potwierdź zmianę hasła</h2>
          <p>Otrzymaliśmy prośbę o zmianę hasła do Twojego konta CodeBucket.</p>
          <p>Wprowadź poniższy kod, aby potwierdzić operację:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px 0;">
            ${code}
          </div>
          <p style="color: #666; font-size: 14px;">
            Kod jest ważny przez ${OTP_TTL_MINUTES} minut.<br/>
            Jeśli nie inicjowałeś zmiany hasła, zignoruj tę wiadomość — Twoje hasło pozostanie bez zmian.
          </p>
        </div>
      `,
    });

    if (error) {
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
