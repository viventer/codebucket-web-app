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
    "feedback-success": "#93ff66",
  },
} as const;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export interface OrderConfirmationEmailProps {
  courseTitle: string;
  courseDescription: string;
  courseImageUrl: string;
  amountLabel: string;
  releaseDateLabel: string | null;
}

export function OrderConfirmationEmail({
  courseTitle,
  courseDescription,
  courseImageUrl,
  amountLabel,
  releaseDateLabel,
}: OrderConfirmationEmailProps) {
  return (
    <Html lang="pl" dir="ltr">
      <Head />
      <Preview>Potwierdzamy przyjęcie płatności – {courseTitle}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: emailTheme,
          },
        }}
      >
        <Body className="text-foreground bg-background m-0 py-16 font-[ubuntu,roboto,arial,sans-serif]">
          <Container className="max-w-[480px] mx-auto bg-card rounded-lg border border-border">
            <Section className="px-8 pt-8 pb-6">
              <Heading as="h1" className="m-0">
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
            </Section>

            <Section className="px-8 py-6">
              <Heading as="h2" className="text-xl font-medium mt-0 mb-1">
                Dzięki, że wybrałeś{" "}
                <span className="text-accent">CodeBucket</span>
              </Heading>
              <Text className="text-muted-foreground text-sm leading-relaxed mt-0 mb-2">
                Potwierdzamy przyjęcie płatności.
              </Text>
              <Text className="text-muted-foreground text-sm leading-relaxed mt-0 mb-6">
                Cieszę się, że mogę pomóc Ci tworzyć coraz lepsze strony
                internetowe.
              </Text>

              <Heading as="h2" className="text-lg font-medium mt-0 mb-3">
                Twój kurs
              </Heading>
              <Section className="border border-border rounded-lg p-4 mb-4">
                <Row>
                  <Column className="w-[48px] align-top">
                    <Img
                      src={
                        courseImageUrl.startsWith("http")
                          ? courseImageUrl
                          : `${baseUrl}${courseImageUrl}`
                      }
                      alt=""
                      width={48}
                      height={48}
                    />
                  </Column>
                  <Column className="pl-3 align-top">
                    <Text className="font-medium m-0 mb-1">{courseTitle}</Text>
                    <Text className="text-muted-foreground text-sm m-0">
                      {courseDescription}
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Text className="text-muted-foreground text-sm leading-relaxed mt-0 mb-1">
                Kurs został przypisany do Twojego konta.
              </Text>
              <Text className="text-muted-foreground text-sm leading-relaxed mt-0 mb-1">
                Gdy tylko zostanie opublikowany otrzymasz powiadomienie na
                maila.
              </Text>
              {releaseDateLabel ? (
                <Text className="text-muted-foreground text-sm leading-relaxed mt-0 mb-6">
                  Planowana data premiery: {releaseDateLabel}
                </Text>
              ) : (
                <Text className="mb-6 mt-0"> </Text>
              )}

              <Heading as="h2" className="text-lg font-medium mt-0 mb-2">
                Szczegóły płatności
              </Heading>
              <Text className="text-sm mt-0 mb-1">
                Kwota: <span className="font-medium">{amountLabel}</span>
              </Text>
              <Text className="text-sm mt-0 mb-0">
                Status:{" "}
                <span className="text-feedback-success font-medium">
                  opłacone
                </span>
              </Text>
            </Section>

            <Section className="px-8 pb-8">
              <Hr className="border-muted-foreground my-6" />
              <Text className="text-muted-foreground text-xs leading-relaxed m-0">
                Jeśli masz pytania dotyczące zamówienia napisz na
                kontakt@codebucket.pl.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default OrderConfirmationEmail;
