import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface PasswordChangeOtpEmailProps {
  code: string;
  ttlMinutes: number;
}

export const previewProps: PasswordChangeOtpEmailProps = {
  code: "847291",
  ttlMinutes: 10,
};

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

export function PasswordChangeOtpEmail({
  code,
  ttlMinutes,
}: PasswordChangeOtpEmailProps) {
  return (
    <Html lang="pl" dir="ltr">
      <Head />
      <Preview>Twój kod do zmiany hasła CodeBucket: {code}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: emailTheme,
          },
        }}
      >
        <Body className="bg-background font-sans m-0 py-8">
          <Container className="max-w-[480px] mx-auto">
            <Section className="bg-card rounded-t-lg px-8 pt-8 pb-6 border border-border border-b-0">
              <Heading
                as="h1"
                className="text-primary text-2xl font-bold m-0 tracking-tight"
              >
                CodeBucket
              </Heading>
            </Section>

            <Section className="bg-card px-8 py-6 border-x border-border">
              <Heading
                as="h2"
                className="text-card-foreground text-xl font-semibold mt-0 mb-4"
              >
                Potwierdź zmianę hasła
              </Heading>
              <Text className="text-muted-foreground text-sm leading-relaxed mt-0 mb-6">
                Otrzymaliśmy prośbę o zmianę hasła do Twojego konta CodeBucket.
                Wprowadź poniższy kod, aby potwierdzić operację.
              </Text>

              <Section className="bg-secondary border border-primary rounded-lg py-5 px-4 text-center mb-6">
                <Text
                  className="text-primary text-xs font-semibold uppercase tracking-[0.15em] m-0 mb-2"
                  style={{ letterSpacing: "0.15em" }}
                >
                  Kod weryfikacyjny
                </Text>
                <Text
                  className="text-foreground font-mono text-4xl font-bold m-0 tracking-[0.5em]"
                  style={{
                    fontFamily: "monospace",
                    letterSpacing: "0.5em",
                    paddingLeft: "0.5em",
                  }}
                >
                  {code}
                </Text>
              </Section>

              <Text className="text-muted-foreground text-xs leading-relaxed mt-0 mb-0">
                Kod jest ważny przez{" "}
                <span className="text-foreground font-semibold">
                  {ttlMinutes} minut
                </span>
                .
              </Text>
            </Section>

            <Section className="bg-card px-8 pb-8 border-x border-border">
              <Hr className="border-border my-6" />
              <Text className="text-muted-foreground text-xs leading-relaxed m-0">
                Jeśli nie inicjowałeś zmiany hasła, zignoruj tę wiadomość —
                Twoje hasło pozostanie bez zmian. Jeśli uważasz, że ktoś próbuje
                uzyskać dostęp do Twojego konta, zmień hasło jak najszybciej.
              </Text>
            </Section>

            <Section className="bg-background rounded-b-lg px-8 py-5 border border-border border-t-0">
              <Text className="text-muted-foreground text-xs m-0 text-center">
                © {new Date().getFullYear()} CodeBucket. Wszystkie prawa
                zastrzeżone.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default PasswordChangeOtpEmail;
