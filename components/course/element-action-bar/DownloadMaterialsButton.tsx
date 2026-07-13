"use client";

import { DownloadIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getExerciseMaterialsDownloadUrl } from "@/actions/storage/download-exercise-materials";
import { Button } from "@/components/ui/button";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";

type DownloadMaterialsButtonProps = {
  source?: "exercise" | "guidedProject";
};

export function DownloadMaterialsButton({
  source = "exercise",
}: DownloadMaterialsButtonProps) {
  const { toast } = useToast();
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
        source,
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
