"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { submitRefundRequest } from "@/actions/refund/submit-refund-request";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ResponsiveDialogContent } from "@/components/ui/ResponsiveDialogContent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { logEvent } from "firebase/analytics";

import { useToast } from "@/hooks/use-toast";
import { analytics } from "@/firebase/init";
import type { RefundableCourse } from "@/lib/refund/get-refundable-courses";
import {
  REFUND_REASONS,
  type RefundReason,
} from "@/schemas/refundRequestSchema";

type RefundCourseCardProps = {
  course: RefundableCourse;
};

export function RefundCourseCard({ course }: RefundCourseCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<RefundReason | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const isDisabled = !course.refundEligible || course.alreadyRequested;

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return;
    if (!nextOpen) {
      setReason(undefined);
      setError(undefined);
    }
    setOpen(nextOpen);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);

    startTransition(async () => {
      const result = await submitRefundRequest({
        courseId: course.courseId,
        paddleTransactionId: course.paddleTransactionId,
        reason,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      if (analytics) {
        logEvent(analytics, "refund", {
          transaction_id: course.paddleTransactionId,
          items: [{ item_id: course.courseId }],
        });
      }

      setOpen(false);
      setReason(undefined);
      toast.success("Wniosek o zwrot został wysłany.");
      router.refresh();
    });
  }

  return (
    <li className="flex flex-col gap-3 border-b pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-3">
        <Image
          src={course.imageUrl}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0"
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="font-medium">{course.title}</p>
          <p className="text-sm text-muted-foreground">
            Data zakupu: {course.purchaseDateLabel}
          </p>
          {course.isPresale && course.releaseDateLabel ? (
            <p className="text-sm text-muted-foreground">
              Planowana premiera: {course.releaseDateLabel}
            </p>
          ) : null}
        </div>
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={isDisabled}
        onClick={() => setOpen(true)}
      >
        Rezygnuję z zakupu
      </Button>
      {course.alreadyRequested ? (
        <p className="text-sm text-muted-foreground">
          Wniosek oczekuje na rozpatrzenie
        </p>
      ) : !course.refundEligible ? (
        <p className="text-sm text-muted-foreground">Okno zwrotu minęło</p>
      ) : null}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <ResponsiveDialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Czy na pewno chcesz zrezygnować?</DialogTitle>
            <DialogDescription>
              Po rozpatrzeniu zwrotu utracisz dostęp do kursu. Wniosek
              rozpatrzymy w ciągu 14 dni.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`refund-reason-${course.courseId}`}>
                Powód zwrotu (opcjonalnie)
              </Label>
              <Select
                value={reason}
                onValueChange={(value) => {
                  setReason(value as RefundReason);
                  if (error) setError(undefined);
                }}
                disabled={isPending}
              >
                <SelectTrigger
                  id={`refund-reason-${course.courseId}`}
                  className="w-full"
                >
                  <SelectValue placeholder="Wybierz powód" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {REFUND_REASONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error ? (
              <p className="text-sm text-feedback-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => handleOpenChange(false)}
              >
                Anuluj
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Wysyłanie..." : "Potwierdzam rezygnację"}
              </Button>
            </div>
          </form>
        </ResponsiveDialogContent>
      </Dialog>
    </li>
  );
}
