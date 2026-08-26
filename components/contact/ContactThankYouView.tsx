import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ContactThankYouViewProps = {
  message: string;
};

export function ContactThankYouView({ message }: ContactThankYouViewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Dziękujemy za zgłoszenie
        </CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardFooter className="border-0 bg-transparent">
        <Button asChild className="w-full" size="lg">
          <Link href="/">Wróć na stronę główną</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
