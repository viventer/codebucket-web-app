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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export function PasswordChangeOtpEmail({
  code,
  ttlMinutes,
}: PasswordChangeOtpEmailProps) {
  return (
    <Html lang="pl" dir="ltr">
      <Head />
      <Preview>Twój kod do zmiany hasła w CodeBucket</Preview>
      <Tailwind
        config={{
          theme: {
            extend: emailTheme,
          },
        }}
      >
        <Body className="text-foreground bg-background m-0 py-16 font-[ubuntu,roboto,arial,sans-serif]">
          <Container className="max-w-[480px] mx-auto bg-card rounded-lg border border-border">
            <Section className="px-8 pt-8 pb-6 ">
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

            <Section className="px-8 py-6 ">
              <Heading as="h2" className=" text-xl font-medium mt-0 mb-1">
                Potwierdź zmianę hasła
              </Heading>
              <Text className="text-muted-foreground text-sm leading-relaxed mt-0 mb-6">
                Otrzymaliśmy prośbę o zmianę hasła do Twojego konta. Wprowadź
                poniższy kod, aby potwierdzić operację.
              </Text>

              <Section>
                <Heading as="h2" className="text-xl font-medium mt-0 mb-1">
                  Kod weryfikacyjny
                </Heading>
                <Text className="text-4xl tracking-widest font-bold m-0">
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

            <Section className="px-8 pb-8 ">
              <Hr className="border-muted-foreground my-6" />
              <Text className="text-muted-foreground text-xs leading-relaxed m-0">
                Jeśli nie inicjowałeś zmiany hasła, zignoruj tę wiadomość —
                Twoje hasło pozostanie bez zmian. Jeśli uważasz, że ktoś próbuje
                uzyskać dostęp do Twojego konta, zmień hasło jak najszybciej.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default PasswordChangeOtpEmail;
