import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "react-email";

const emailTheme = {
  colors: {
    background: "oklch(0.145 0 0)",
    foreground: "oklch(0.985 0 0)",
    card: "oklch(0.205 0 0)",
    "card-foreground": "oklch(0.985 0 0)",
    primary: "oklch(0.451 0.084 223.8)",
    "primary-foreground": "oklch(0.985 0 0)",
    secondary: "oklch(0.269 0 0)",
    "secondary-foreground": "oklch(0.985 0 0)",
    muted: "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.85 0 0)",
    accent: "oklch(0.846 0.117 217.9)",
    "accent-foreground": "oklch(0.205 0.03 224)",
    border: "oklch(1 0 0 / 10%)",
    ring: "oklch(0.556 0 0)",
  },
} as const;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export interface RefundRequestStaffEmailProps {
  userEmail: string;
  userId: string;
  courseTitle: string;
  courseId: string;
  paddleTransactionId: string;
  reason: string | null;
}

export function RefundRequestStaffEmail({
  userEmail,
  userId,
  courseTitle,
  courseId,
  paddleTransactionId,
  reason,
}: RefundRequestStaffEmailProps) {
  return (
    <Html lang="pl" dir="ltr">
      <Head />
      <Preview>Prośba o zwrot – {courseTitle}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: emailTheme,
          },
        }}
      >
        <Body className="text-foreground bg-background m-0 py-16 font-[ubuntu,roboto,arial,sans-serif]">
          <Container className="max-w-lg mx-auto bg-card rounded-lg border border-border">
            <Section className="px-8 pt-8 pb-0">
              <Heading as="h1" className="m-0 mb-6">
                <Row className="w-fit">
                  <Column>
                    <Img
                      src={`${baseUrl}/logo.svg`}
                      alt="CodeBucket"
                      width={32}
                      height={32}
                      className="mr-2"
                    />
                  </Column>
                  <Column>
                    <Text className="text-2xl font-bold m-0 tracking-tight">
                      Code<span className="text-accent">Bucket</span>
                    </Text>
                  </Column>
                </Row>
              </Heading>
              <Heading
                as="h2"
                className="text-2xl font-bold tracking-tight mt-0 mb-2"
              >
                Nowa prośba o zwrot
              </Heading>
              <Text className="text-muted-foreground text-sm leading-relaxed m-0">
                Użytkownik złożył wniosek o zwrot środków za zakupiony kurs.
              </Text>
            </Section>

            <Section className="px-8 py-6">
              <Text className="text-sm m-0 mb-1">
                Email: <span className="font-medium">{userEmail}</span>
              </Text>
              <Text className="text-sm m-0 mb-1">
                UID: <span className="font-medium">{userId}</span>
              </Text>
              <Text className="text-sm m-0 mb-1">
                Kurs: <span className="font-medium">{courseTitle}</span> (
                {courseId})
              </Text>
              <Text className="text-sm m-0 mb-1">
                Transakcja Paddle:{" "}
                <span className="font-medium">{paddleTransactionId}</span>
              </Text>
              <Text className="text-sm m-0">
                Powód:{" "}
                <span className="font-medium">
                  {reason ?? "Nie podano"}
                </span>
              </Text>
            </Section>

            <Section className="px-8 pb-8">
              <Hr className="border-muted-foreground my-0" />
              <Text className="text-muted-foreground text-xs leading-relaxed m-0 mt-6">
                Wniosek jest zapisany w Firestore (kolekcja refundRequests) ze
                statusem pending. Dostęp do kursu nie został jeszcze cofnięty.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default RefundRequestStaffEmail;
