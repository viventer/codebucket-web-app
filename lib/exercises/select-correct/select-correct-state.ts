import type { SelectCorrectAnswer } from "@/schemas/courseSchema";

export type SelectCorrectInput = {
  question: string;
  answers: SelectCorrectAnswer[];
  correctAnswerId: number;
};

export type SelectCorrectAttempt = "first" | "retry";

export type SelectCorrectPhase =
  | "idle"
  | "correct"
  | "wrongPending"
  | "wrongDeferred"
  | "wrongResolved";

export type SelectCorrectAnswerVisualState =
  | "idle"
  | "correct"
  | "incorrect"
  | "revealedCorrect";

export type SelectCorrectPersistedState = {
  selectedAnswerId: number | null;
  phase: SelectCorrectPhase;
  attempt: SelectCorrectAttempt;
};

export function createInitialSelectCorrectState(): SelectCorrectPersistedState {
  return {
    selectedAnswerId: null,
    phase: "idle",
    attempt: "first",
  };
}

export function createInitialSelectCorrectRetryState(): SelectCorrectPersistedState {
  return {
    selectedAnswerId: null,
    phase: "idle",
    attempt: "retry",
  };
}

export function isSelectCorrectComplete(
  state: SelectCorrectPersistedState,
): boolean {
  return (
    state.phase === "correct" ||
    state.phase === "wrongDeferred" ||
    state.phase === "wrongResolved"
  );
}

export function isSelectCorrectLocked(
  state: SelectCorrectPersistedState,
): boolean {
  return state.selectedAnswerId !== null;
}

export function applySelectCorrectAnswer(
  state: SelectCorrectPersistedState,
  answerId: number,
  correctAnswerId: number,
): SelectCorrectPersistedState {
  if (state.selectedAnswerId !== null) {
    return state;
  }

  if (answerId === correctAnswerId) {
    return {
      ...state,
      selectedAnswerId: answerId,
      phase: "correct",
    };
  }

  return {
    ...state,
    selectedAnswerId: answerId,
    phase: "wrongPending",
  };
}

export function deferSelectCorrectWrongAnswer(
  state: SelectCorrectPersistedState,
): SelectCorrectPersistedState {
  if (state.phase !== "wrongPending" || state.attempt !== "first") {
    return state;
  }

  return {
    ...state,
    phase: "wrongDeferred",
  };
}

export function resolveSelectCorrectWrongAnswer(
  state: SelectCorrectPersistedState,
): SelectCorrectPersistedState {
  if (state.phase !== "wrongPending") {
    return state;
  }

  return {
    ...state,
    phase: "wrongResolved",
  };
}

export function getSelectCorrectAnswerVisualState(
  state: SelectCorrectPersistedState,
  answerId: number,
  correctAnswerId: number,
): SelectCorrectAnswerVisualState {
  if (state.phase === "idle") {
    return "idle";
  }

  if (answerId === correctAnswerId) {
    if (state.phase === "correct" || state.phase === "wrongResolved") {
      return "correct";
    }
    return "idle";
  }

  if (answerId === state.selectedAnswerId) {
    return state.phase === "wrongPending" ||
      state.phase === "wrongDeferred" ||
      state.phase === "wrongResolved"
      ? "incorrect"
      : "idle";
  }

  return "idle";
}

export function getSelectCorrectWrongExplanation(
  state: SelectCorrectPersistedState,
  answers: SelectCorrectAnswer[],
  correctAnswerId: number,
): string | null {
  if (
    state.selectedAnswerId === null ||
    state.selectedAnswerId === correctAnswerId
  ) {
    return null;
  }

  if (
    state.phase !== "wrongPending" &&
    state.phase !== "wrongDeferred" &&
    state.phase !== "wrongResolved"
  ) {
    return null;
  }

  const answer = answers.find((item) => item.id === state.selectedAnswerId);
  return answer?.explanation ?? null;
}
