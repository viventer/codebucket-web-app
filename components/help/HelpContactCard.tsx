import { MailIcon } from "lucide-react";

import { LegalLink } from "@/components/legal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type HelpContactCardProps = {
  title: string;
  description: string;
  email: string;
};

export function HelpContactCard({
  title,
  description,
  email,
}: HelpContactCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <MailIcon className="size-4 shrink-0 text-muted-foreground" />
        <LegalLink href={`mailto:${email}`} className="font-medium">
          {email}
        </LegalLink>
      </CardContent>
    </Card>
  );
}
