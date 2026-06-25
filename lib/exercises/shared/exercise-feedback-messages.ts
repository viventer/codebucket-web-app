import type { ExerciseFeedback } from "./types";

export type ExerciseFeedbackMessageContent = {
  label: string;
  text: string;
  colorClass: string;
};

export const EXERCISE_ERROR_FEEDBACK: ExerciseFeedbackMessageContent = {
  label: "Ups!",
  text: "Rozwiązanie jest nieprawidłowe. Spróbuj ponownie.",
  colorClass: "text-feedback-destructive",
};

export const EXERCISE_INLINE_FEEDBACK_MESSAGES: Partial<
  Record<ExerciseFeedback, ExerciseFeedbackMessageContent>
> = {
  success: {
    label: "Sukces!",
    text: "Zadanie wykonane. Możesz przejść do kolejnego rozdziału.",
    colorClass: "text-feedback-success",
  },
  stageSuccess: {
    label: "Poprawnie!",
    text: "Za chwilę przejdziesz do następnego etapu.",
    colorClass: "text-feedback-success",
  },
  stageSolution: {
    label: "Skip!",
    text: "Zadanie pominięte. Za chwilę przejdziesz do następnego etapu.",
    colorClass: "text-feedback-warning",
  },
  stageWrongFirst: {
    label: "Niepoprawnie",
    text: "Spróbujesz odpowiedzieć ponownie po ukończeniu pozostałych etapów.",
    colorClass: "text-feedback-destructive",
  },
  stageWrongRetry: {
    label: "Niepoprawnie",
    text: "Poprawna odpowiedź została podświetlona.",
    colorClass: "text-feedback-destructive",
  },
  solution: {
    label: "Skip!",
    text: "Zadanie pominięte. Możesz przejść do kolejnego rozdziału.",
    colorClass: "text-feedback-warning",
  },
};
