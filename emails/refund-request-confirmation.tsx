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

export interface RefundRequestConfirmationEmailProps {
  courseTitle: string;
}

export function RefundRequestConfirmationEmail({
  courseTitle,
}: RefundRequestConfirmationEmailProps) {
  return (
    <Html lang="pl" dir="ltr">
      <Head />
      <Preview>Przyjęliśmy Twoją prośbę o zwrot – {courseTitle}</Preview>
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
                Przyjęliśmy Twoją prośbę o zwrot
              </Heading>
              <Text className="text-muted-foreground text-sm leading-relaxed m-0">
                Potwierdzamy otrzymanie wniosku o zwrot środków za kurs{" "}
                <span className="text-foreground font-medium">{courseTitle}</span>
                .
              </Text>
            </Section>

            <Section className="px-8 py-6">
              <Text className="text-sm leading-relaxed m-0 mb-2">
                Wniosek zostanie rozpatrzony w ciągu 14 dni. Poinformujemy Cię
                mailowo o decyzji.
              </Text>
              <Text className="text-sm leading-relaxed m-0">
                Do czasu rozpatrzenia nadal masz dostęp do kursu. Jeśli wniosek
                zostanie zatwierdzony, dostęp zostanie cofnięty, a zwrot
                zrealizuje Paddle na tę samą metodę płatności.
              </Text>
            </Section>

            <Section className="px-8 pb-8">
              <Hr className="border-muted-foreground my-0 mb-6" />
              <Text className="text-muted-foreground text-xs leading-relaxed m-0">
                Jeśli masz pytania, napisz na zwroty@codebucket.pl.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default RefundRequestConfirmationEmail;
