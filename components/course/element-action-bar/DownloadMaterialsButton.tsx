"use client";

import { DownloadIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { getExerciseMaterialsDownloadUrl } from "@/actions/storage/download-exercise-materials";
import { Button } from "@/components/ui/button";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";

export function DownloadMaterialsButton() {
  const params = useParams<{ id: string; element: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!params.id || !params.element) {
      return;
    }

    setIsLoading(true);
    try {
      const url = await getExerciseMaterialsDownloadUrl(
        params.id,
        params.element,
      );
      window.location.href = url;
    } catch {
      toast.error("Nie udało się pobrać materiałów.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="ghost" onClick={handleDownload} disabled={isLoading}>
      <ActionBarButtonLabel label="Pobierz materiały" icon={DownloadIcon} />
    </Button>
  );
}
