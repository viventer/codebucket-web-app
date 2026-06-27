export type ChooseMatchingPhase =
  | "idle"
  | "correct"
  | "wrongDeferred"
  | "wrongResolved";

export type ChooseMatchingAttempt = "first" | "retry";

export type ChooseMatchingPersistedState = {
  selectedIds: number[];
  phase: ChooseMatchingPhase;
  attempt: ChooseMatchingAttempt;
};

export type ChooseMatchingItemVisualState =
  | "idle"
  | "selected"
  | "correct"
  | "missed"
  | "incorrect";

export function createInitialChooseMatchingState(): ChooseMatchingPersistedState {
  return {
    selectedIds: [],
    phase: "idle",
    attempt: "first",
  };
}

export function createInitialChooseMatchingRetryState(): ChooseMatchingPersistedState {
  return {
    selectedIds: [],
    phase: "idle",
    attempt: "retry",
  };
}

export function isChooseMatchingComplete(
  state: ChooseMatchingPersistedState,
): boolean {
  return (
    state.phase === "correct" ||
    state.phase === "wrongDeferred" ||
    state.phase === "wrongResolved"
  );
}

export function isChooseMatchingChecked(
  state: ChooseMatchingPersistedState,
): boolean {
  return state.phase !== "idle";
}

export function toggleItemSelection(
  state: ChooseMatchingPersistedState,
  itemId: number,
): ChooseMatchingPersistedState {
  if (state.phase !== "idle") {
    return state;
  }

  const isSelected = state.selectedIds.includes(itemId);
  return {
    ...state,
    selectedIds: isSelected
      ? state.selectedIds.filter((id) => id !== itemId)
      : [...state.selectedIds, itemId],
  };
}

export function isChooseMatchingAnswerCorrect(
  selectedIds: number[],
  correctItemIds: number[],
): boolean {
  if (selectedIds.length !== correctItemIds.length) {
    return false;
  }

  const correctSet = new Set(correctItemIds);
  return selectedIds.every((id) => correctSet.has(id));
}

export function applyChooseMatchingCheck(
  state: ChooseMatchingPersistedState,
  correctItemIds: number[],
): ChooseMatchingPersistedState {
  if (state.phase !== "idle") {
    return state;
  }

  const isCorrect = isChooseMatchingAnswerCorrect(
    state.selectedIds,
    correctItemIds,
  );

  if (isCorrect) {
    return {
      ...state,
      phase: "correct",
    };
  }

  if (state.attempt === "first") {
    return {
      ...state,
      phase: "wrongDeferred",
    };
  }

  return {
    ...state,
    phase: "wrongResolved",
  };
}

export function getChooseMatchingItemVisualState(
  state: ChooseMatchingPersistedState,
  itemId: number,
  correctItemIds: number[],
): ChooseMatchingItemVisualState {
  if (state.phase === "idle") {
    return state.selectedIds.includes(itemId) ? "selected" : "idle";
  }

  const isCorrect = correctItemIds.includes(itemId);
  const isSelected = state.selectedIds.includes(itemId);

  if (isCorrect && isSelected) {
    return "correct";
  }

  if (isCorrect && !isSelected) {
    return "missed";
  }

  if (!isCorrect && isSelected) {
    return "incorrect";
  }

  return "idle";
}

export function getChooseMatchingGridColumns(itemCount: number): number {
  const rowCount = itemCount > 10 ? 3 : 2;
  return Math.ceil(itemCount / rowCount);
}
