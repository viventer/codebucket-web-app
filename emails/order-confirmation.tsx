import {
  Body,
  Button,
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
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  courseImageUrl: string;
  amountLabel: string;
  releaseDateLabel: string | null;
}

export function OrderConfirmationEmail({
  courseId,
  courseTitle,
  courseDescription,
  courseImageUrl,
  amountLabel,
  releaseDateLabel,
}: OrderConfirmationEmailProps) {
  const resolvedCourseImageUrl = courseImageUrl.startsWith("http")
    ? courseImageUrl
    : `${baseUrl}${courseImageUrl}`;

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
                Dzięki, że wybrałeś Code
                <span className="text-accent">Bucket</span>
              </Heading>
              <Text className="text-muted-foreground text-sm leading-relaxed m-0 mb-0">
                Cieszę się, że mogę pomóc Ci tworzyć coraz lepsze strony
                internetowe.
              </Text>
            </Section>

            <Section className="px-8 py-6">
              <Heading as="h3" className="text-lg font-medium mt-0 mb-1">
                Zamówiony kurs
              </Heading>
              <Section
                className="rounded-lg p-3 mb-4"
                style={{
                  backgroundColor: "rgba(126, 224, 240, 0.1)",
                  border: "1px solid #7ee0f0",
                }}
              >
                <Row>
                  <Column className="w-10 align-middle">
                    <Img
                      src={resolvedCourseImageUrl}
                      alt=""
                      width={40}
                      height={40}
                    />
                  </Column>
                  <Column className="pl-2 align-middle">
                    <Text className="font-medium m-0">{courseTitle}</Text>
                    <Text className="text-muted-foreground text-sm m-0">
                      {courseDescription}
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Text className="font-medium m-0 mb-0">
                Kurs został przypisany do Twojego konta.
              </Text>
              <Text className="text-muted-foreground text-sm m-0 mb-2">
                Gdy tylko zostanie opublikowany otrzymasz powiadomienie na
                maila.
              </Text>
              {releaseDateLabel ? (
                <Text className="m-0 mb-0">
                  Planowana data premiery:{" "}
                  <span className="font-medium text-foreground">
                    {releaseDateLabel}
                  </span>
                </Text>
              ) : null}
            </Section>

            <Section className="px-8 pb-2">
              <Heading as="h3" className="text-lg font-medium mt-0 mb-1">
                Szczegóły płatności
              </Heading>
              <Text className="text-sm m-0 mb-0">
                Kwota: <span className="font-medium">{amountLabel}</span>
              </Text>
              <Text className="text-sm m-0 mb-0">
                Status:{" "}
                <span className="text-feedback-success font-medium">
                  opłacone
                </span>
              </Text>
            </Section>

            <Section className="px-8 pt-6 pb-8">
              <Button
                href={`${baseUrl}/course/${courseId}`}
                className="bg-primary text-primary-foreground box-border w-full rounded-md py-3 text-center text-sm font-medium no-underline"
              >
                Przejdź na stronę kursu
              </Button>
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
