export type RetryableStagePhase =
  | "idle"
  | "correct"
  | "wrongPending"
  | "wrongDeferred"
  | "wrongResolved";

export type RetryableStageAttempt = "first" | "retry";

export type RetryableStageMeta = {
  firstAttemptWrong: boolean;
  retryCompleted: boolean;
};

export function isRetryableStageComplete(phase: RetryableStagePhase): boolean {
  return (
    phase === "correct" ||
    phase === "wrongDeferred" ||
    phase === "wrongResolved"
  );
}

export function isRetryableStageSatisfied(
  meta: RetryableStageMeta,
  phase: RetryableStagePhase,
  attempt: RetryableStageAttempt,
): boolean {
  if (attempt === "retry" && (phase === "correct" || phase === "wrongResolved")) {
    return true;
  }

  if (meta.firstAttemptWrong) {
    return meta.retryCompleted;
  }

  return phase === "correct";
}

export function isRetryableRetryDone(meta: RetryableStageMeta): boolean {
  return meta.retryCompleted;
}
