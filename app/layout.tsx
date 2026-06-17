import type { Metadata } from "next";
import "./globals.css";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

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
  return (
    <html lang="pl" className={cn("h-full", "antialiased", "font-sans", ubuntu.variable, ubuntuMono.variable)}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
