"use client";

import { useEffect } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { ErrorPageView } from "@/components/ErrorPageView";

type ErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12">
      <title>Wystąpił błąd – CodeBucket</title>
      <div className="w-full max-w-lg">
        <BrandLogo />
        <ErrorPageView onRetry={unstable_retry} />
      </div>
    </div>
  );
}
