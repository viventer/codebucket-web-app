"use server";

import * as React from "react";
import { sendOtp, verifyOtp } from "@/lib/otp/otp-service";
import type { SendOtpResult, VerifyOtpResult } from "@/lib/otp/otp-service";
import { PasswordChangeOtpEmail } from "@/emails/password-change-otp";

const COLLECTION = "otp_password_change";

export async function sendPasswordChangeOtp(
  uid: string,
  email: string,
): Promise<SendOtpResult> {
  return sendOtp({
    collection: COLLECTION,
    docId: uid,
    emailTo: "kontakt.codebucket@gmail.com",
    emailSubject: "Potwierdź zmianę hasła – CodeBucket",
    buildEmailElement: (code, ttlMinutes) =>
      React.createElement(PasswordChangeOtpEmail, { code, ttlMinutes }),
  });
}

export async function verifyPasswordChangeOtp(
  uid: string,
  code: string,
): Promise<VerifyOtpResult> {
  return verifyOtp({
    collection: COLLECTION,
    docId: uid,
    code,
    consume: true,
  });
}
