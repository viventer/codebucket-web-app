"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckoutEventNames,
  initializePaddle,
  type Paddle,
} from "@paddle/paddle-js";

import {
  getPaddleClientToken,
  getPaddleEnvironment,
} from "@/lib/paddle/config";

type CheckoutClientProps = {
  courseId: string;
  priceId: string;
  userId: string;
  email: string;
};

export function CheckoutClient({
  courseId,
  priceId,
  userId,
  email,
}: CheckoutClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const openedRef = useRef(false);

  useEffect(() => {
    if (openedRef.current) {
      return;
    }
    openedRef.current = true;

    let paddleInstance: Paddle | undefined;

    async function openCheckout() {
      try {
        paddleInstance = await initializePaddle({
          environment: getPaddleEnvironment(),
          token: getPaddleClientToken(),
          eventCallback: (event) => {
            if (event.name === CheckoutEventNames.CHECKOUT_COMPLETED) {
              const transactionId = event.data?.transaction_id;
              if (transactionId) {
                router.replace(
                  `/order/thank-you?transaction_id=${encodeURIComponent(transactionId)}`,
                );
                return;
              }
              setError(
                "Płatność zakończona, ale nie otrzymaliśmy identyfikatora transakcji.",
              );
              return;
            }

            if (event.name === CheckoutEventNames.CHECKOUT_CLOSED) {
              router.replace(`/course/${courseId}`);
            }
          },
        });

        if (!paddleInstance) {
          setError("Nie udało się zainicjalizować płatności.");
          return;
        }

        paddleInstance.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          customer: { email },
          customData: {
            userId,
            courseId,
          },
          settings: {
            displayMode: "overlay",
            theme: "dark",
            locale: "pl",
          },
        });
      } catch (err) {
        console.error("Failed to open Paddle checkout:", err);
        setError("Nie udało się otworzyć płatności. Spróbuj ponownie.");
      }
    }

    void openCheckout();
  }, [courseId, email, priceId, router, userId]);

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <div className="bg-card max-w-md rounded-xl border p-8 text-center">
          <p className="text-destructive mb-4 text-sm">{error}</p>
          <button
            type="button"
            className="text-accent text-sm underline underline-offset-4"
            onClick={() => router.replace(`/course/${courseId}`)}
          >
            Wróć do strony kursu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="bg-card max-w-md rounded-xl border p-8 text-center">
        <p className="text-lg font-medium">Otwieramy płatność…</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Jeśli okno nie pojawiło się automatycznie, odśwież stronę.
        </p>
      </div>
    </div>
  );
}
