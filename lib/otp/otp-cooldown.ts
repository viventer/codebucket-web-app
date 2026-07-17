export type OtpSendResult =
  | { success: true; cooldownUntil: number }
  | {
      success: false;
      error: string;
      cooldownUntil?: number;
      maxResendsReached?: boolean;
    };

export function getOtpCooldownSecondsLeft(cooldownUntil: number | null): number {
  if (!cooldownUntil) return 0;
  return Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
}

export function applyOtpSendResult(
  result: OtpSendResult,
  callbacks: {
    setCooldownUntil: (value: number) => void;
    setError?: (value: string | null) => void;
    setMaxResendsReached?: (value: boolean) => void;
  },
): boolean {
  if (result.cooldownUntil) {
    callbacks.setCooldownUntil(result.cooldownUntil);
  }

  if (result.success) {
    callbacks.setError?.(null);
    return true;
  }

  if (result.maxResendsReached) {
    callbacks.setMaxResendsReached?.(true);
  }

  if (result.cooldownUntil) {
    callbacks.setError?.(null);
  } else {
    callbacks.setError?.(result.error);
  }

  return false;
}
