import type { ThankYouPaymentViewStatus } from "@/components/order/thank-you-types";

type CourseAccessNotesProps = {
  paymentStatus: ThankYouPaymentViewStatus;
  releaseDateLabel: string | null;
};

export function CourseAccessNotes({
  paymentStatus,
  releaseDateLabel,
}: CourseAccessNotesProps) {
  if (paymentStatus === "paid") {
    return (
      <div className="flex flex-col gap-2">
        <div>
          <p className="font-medium">
            Kurs został przypisany do Twojego konta.
          </p>
          <p className="text-muted-foreground text-sm">
            Gdy tylko zostanie opublikowany otrzymasz powiadomienie na maila.
          </p>
        </div>
        {releaseDateLabel ? (
          <p>
            Planowana data premiery:{" "}
            <span className="font-medium text-foreground">
              {releaseDateLabel}
            </span>
          </p>
        ) : null}
      </div>
    );
  }

  if (paymentStatus === "pending") {
    return (
      <p>
        Otrzymasz informacje o płatności i potwierdzenie zamówienia na maila.
      </p>
    );
  }

  return <p>Płatność nie została zrealizowana. Możesz spróbować ponownie.</p>;
}
