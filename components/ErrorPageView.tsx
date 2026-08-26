import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TriangleAlertIcon } from "lucide-react";

type ErrorPageViewProps = {
  onRetry: () => void;
};

export function ErrorPageView({ onRetry }: ErrorPageViewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <TriangleAlertIcon
            className="size-7 text-feedback-destructive"
            strokeWidth={3}
          />
          Wystąpił{" "}
          <span className="text-feedback-destructive">nieoczekiwany błąd</span>
        </CardTitle>
        <CardDescription>
          Nie udało się wczytać tej strony. Spróbuj ponownie za chwilę.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-sm">
          Jeśli problem się powtarza,{" "}
          <Link
            href="/contact"
            className="text-foreground underline underline-offset-4"
          >
            zgłoś błąd
          </Link>
          .
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-0 bg-transparent">
        <Button className="w-full" size="lg" onClick={onRetry}>
          Spróbuj ponownie
        </Button>
        <Button asChild variant="secondary" className="w-full" size="lg">
          <Link href="/">Wróć na stronę główną</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
