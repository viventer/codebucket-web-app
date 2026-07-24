/** Paddle amounts are stored as strings in the smallest currency unit (e.g. grosze). */
export function paddleAmountToMajor(amount: string | null | undefined): number {
  if (!amount) {
    return 0;
  }

  const parsed = Number(amount);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return parsed / 100;
}
