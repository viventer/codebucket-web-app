"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckoutEventNames,
  initializePaddle,
  type Paddle,
} from "@paddle/paddle-js";

import { CheckoutPaddleSkeleton } from "@/components/checkout/CheckoutPaddleSkeleton";
import { Card } from "@/components/ui/card";
import { ClientIcon } from "@/components/ui/client-icon";
import { useToast } from "@/hooks/use-toast";
import {
  getPaddleClientToken,
  getPaddleEnvironment,
} from "@/lib/paddle/config";

const FRAME_TARGET = "paddle-checkout-frame";

// Paddle dark theme has a known contrast bug for input labels (e.g. rgb(43,42,53)
// on dark backgrounds). Force light until Paddle fixes theme token mapping.
const PADDLE_THEME = "light" as const;

const FRAME_STYLE = [
  "width: 100%",
  "min-width: 312px",
  "background-color: transparent",
  "border: none",
].join("; ");

type CheckoutInlineFrameProps = {
  courseId: string;
  priceId: string;
  userId: string;
  email: string;
};

export function CheckoutInlineFrame({
  courseId,
  priceId,
  userId,
  email,
}: CheckoutInlineFrameProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const paddleRef = useRef<Paddle | null>(null);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (hasOpenedRef.current) {
      return;
    }

    setIsLoaded(false);
    setError(null);

    let cancelled = false;

    async function openCheckout() {
      try {
        const paddleInstance = await initializePaddle({
          environment: getPaddleEnvironment(),
          token: getPaddleClientToken(),
          eventCallback: (event) => {
            if (event.name === CheckoutEventNames.CHECKOUT_LOADED) {
              setIsLoaded(true);
              return;
            }

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

            if (
              event.name === CheckoutEventNames.CHECKOUT_ERROR ||
              event.name === CheckoutEventNames.CHECKOUT_PAYMENT_FAILED ||
              event.name === CheckoutEventNames.CHECKOUT_PAYMENT_ERROR
            ) {
              const message =
                "Nie udało się dokończyć płatności. Spróbuj ponownie.";
              setError(message);
              toast.error(message);
            }
          },
          checkout: {
            settings: {
              variant: "one-page",
              displayMode: "inline",
              theme: PADDLE_THEME,
              locale: "pl",
              allowLogout: false,
              frameTarget: FRAME_TARGET,
              frameInitialHeight: 720,
              frameStyle: FRAME_STYLE,
            },
          },
        });

        if (cancelled) {
          return;
        }

        if (!paddleInstance) {
          setError("Nie udało się zainicjalizować płatności.");
          return;
        }

        paddleRef.current = paddleInstance;
        hasOpenedRef.current = true;

        paddleInstance.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          customer: {
            email,
            address: {
              countryCode: "PL",
            },
          },
          customData: {
            userId,
            courseId,
          },
          settings: {
            theme: PADDLE_THEME,
            displayMode: "inline",
            variant: "one-page",
            locale: "pl",
            allowLogout: false,
            frameTarget: FRAME_TARGET,
            frameInitialHeight: 720,
            frameStyle: FRAME_STYLE,
          },
        });
      } catch (err) {
        console.error("Failed to open Paddle checkout:", err);
        if (!cancelled) {
          setError("Nie udało się otworzyć płatności. Spróbuj ponownie.");
        }
      }
    }

    void openCheckout();

    return () => {
      cancelled = true;
    };
  }, [courseId, email, priceId, router, toast, userId]);

  if (error) {
    return (
      <Card className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <button
          type="button"
          className="text-sm text-accent underline underline-offset-4"
          onClick={() => router.replace(`/course/${courseId}`)}
        >
          Wróć do strony kursu
        </button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <ClientIcon
            src="lock-locked.svg"
            size={24}
            className="text-feedback-success shrink-0"
          />
          <p className="font-medium">Bezpieczna płatność</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Twoje dane są szyfrowane i przetwarzane przez Paddle.
        </p>
      </div>
      <Card className="relative min-h-[720px] overflow-hidden bg-[oklch(0.95_0_0)] p-4 text-[oklch(0.145_0_0)] sm:p-6">
        {!isLoaded ? <CheckoutPaddleSkeleton /> : null}
        <div
          className={FRAME_TARGET}
          style={{ visibility: isLoaded ? "visible" : "hidden" }}
        />
      </Card>
    </div>
  );
}
