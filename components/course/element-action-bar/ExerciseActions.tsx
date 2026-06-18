import { NavButton } from "./NavButton";
import { PlaceholderButton } from "./PlaceholderButton";

type ExerciseActionsProps = {
  nextHref: string | null;
};

export function ExerciseActions({ nextHref }: ExerciseActionsProps) {
  return (
    <>
      <PlaceholderButton variant="ghost">Wskazówka</PlaceholderButton>
      <PlaceholderButton variant="ghost">Rozwiązanie</PlaceholderButton>
      <PlaceholderButton variant="ghost">Reset</PlaceholderButton>
      <NavButton href={nextHref}>Zrobione</NavButton>
    </>
  );
}
