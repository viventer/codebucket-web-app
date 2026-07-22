import Link from "next/link";
import { Button } from "./ui/button";

export function AuthButtons({ stacked = false }: { stacked?: boolean }) {
  return (
    <div
      className={stacked ? "flex flex-col gap-2" : "flex items-center gap-2"}
    >
      <Button
        asChild
        variant={stacked ? "secondary" : "ghost"}
        size="sm"
        className={stacked ? "w-full" : undefined}
      >
        <Link href="/login">Zaloguj się</Link>
      </Button>
      <Button
        asChild
        variant={stacked ? "default" : "secondary"}
        size="sm"
        className={stacked ? "w-full" : undefined}
      >
        <Link href="/signup">Utwórz darmowe konto</Link>
      </Button>
    </div>
  );
}
