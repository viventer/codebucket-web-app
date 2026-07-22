import type { ComponentProps, ReactNode } from "react";

import { MainContainer } from "@/components/MainContainer";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CONTACT_NAME = "Oskar Goczał";
const CONTACT_EMAIL = "kontakt@codebucket.pl";

function LegalDocument({ children }: { children: ReactNode }) {
  return (
    <MainContainer>
      <div className="flex max-w-3xl flex-col gap-12">{children}</div>
    </MainContainer>
  );
}

function LegalHeader({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      {lastUpdated ? (
        <p className="text-sm text-muted-foreground">
          Ostatnia aktualizacja: {lastUpdated}
        </p>
      ) : null}
      {children}
    </div>
  );
}

function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-lg font-medium tracking-tight sm:text-xl">
        {title}
      </h2>
      <div className="flex flex-col gap-2 text-sm sm:text-base">{children}</div>
    </section>
  );
}

function LegalList({ children }: { children: ReactNode }) {
  return <ul className="flex list-disc flex-col gap-1 pl-5">{children}</ul>;
}

function LegalListItem({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

function LegalStrong({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-foreground">{children}</strong>;
}

function LegalEmph({ children }: { children: ReactNode }) {
  return <span className="font-medium text-foreground">{children}</span>;
}

function LegalLink({
  className,
  external,
  children,
  ...props
}: ComponentProps<"a"> & { external?: boolean }) {
  return (
    <a
      className={cn(
        "underline underline-offset-2 decoration-accent hover:no-underline",
        className,
      )}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
      {...props}
    >
      {children}
    </a>
  );
}

function LegalContactCard({
  name = CONTACT_NAME,
  email = CONTACT_EMAIL,
}: {
  name?: string;
  email?: string;
} = {}) {
  return (
    <Card>
      <CardContent>
        <address className="not-italic">
          <strong>{name}</strong>
          <br />
          E-mail: <LegalLink href={`mailto:${email}`}>{email}</LegalLink>
        </address>
      </CardContent>
    </Card>
  );
}

export {
  CONTACT_EMAIL,
  CONTACT_NAME,
  LegalContactCard,
  LegalDocument,
  LegalEmph,
  LegalHeader,
  LegalLink,
  LegalList,
  LegalListItem,
  LegalSection,
  LegalStrong,
};
