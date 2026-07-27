"use client";

import { Button } from "@/components/ui/button";

export function RefreshPaymentStatusButton() {
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="w-fit"
      onClick={() => {
        window.location.reload();
      }}
    >
      Odśwież status
    </Button>
  );
}
