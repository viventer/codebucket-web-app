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
import { FileQuestionIcon } from "lucide-react";

export function NotFoundPageView() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileQuestionIcon
            className="size-7 text-feedback-destructive"
            strokeWidth={3}
          />
          Strona{" "}
          <span className="text-feedback-destructive">
            nie została znaleziona
          </span>
        </CardTitle>
        <CardDescription>
          Podany adres nie istnieje albo został przeniesiony.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-sm">
          Szukasz czegoś konkretnego? Wróć na stronę główną albo{" "}
          <Link
            href="/help"
            className="text-foreground underline underline-offset-4"
          >
            skontaktuj się z nami
          </Link>
          .
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-0 bg-transparent">
        <Button asChild className="w-full" size="lg">
          <Link href="/">Wróć na stronę główną</Link>
        </Button>
        <Button asChild variant="secondary" className="w-full" size="lg">
          <Link href="/help">Centrum pomocy</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
