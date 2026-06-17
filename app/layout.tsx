import type { Metadata } from "next";
import "./globals.css";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mock-user";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
});

const ubuntuMono = Ubuntu_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CodeBucket",
  description: "Najskuteczniejsza platforma do nauki programowania",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userTheme = mockUser.preferences.colorScheme;

  return (
    <html
      lang="pl"
      className={cn(
        userTheme,
        "h-full",
        "antialiased",
        "font-sans",
        ubuntu.variable,
        ubuntuMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
