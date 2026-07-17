import { useState, useEffect } from "react";
import { getOtpCooldownSecondsLeft } from "@/lib/otp/otp-cooldown";

export function useOtpCountdown() {
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!cooldownUntil) return;
    const update = () => {
      const left = getOtpCooldownSecondsLeft(cooldownUntil);
      if (left <= 0) {
        setSecondsLeft(0);
        setCooldownUntil(null);
      } else {
        setSecondsLeft(left);
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  return { cooldownUntil, setCooldownUntil, secondsLeft, setSecondsLeft };
}
