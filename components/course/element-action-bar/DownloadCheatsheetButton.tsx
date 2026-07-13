"use client";

import { DownloadIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { getCheatsheetDownloadUrl } from "@/actions/storage/download-cheatsheet";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";

export function DownloadCheatsheetButton() {
  const { toast } = useToast();
  const params = useParams<{ id: string; element: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!params.id || !params.element) {
      return;
    }

    setIsLoading(true);
    try {
      const url = await getCheatsheetDownloadUrl(params.id, params.element);
      window.location.href = url;
    } catch {
      toast.error("Nie udało się pobrać ściągi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="ghost" onClick={handleDownload} disabled={isLoading}>
      <ActionBarButtonLabel label="Pobierz" icon={DownloadIcon} />
    </Button>
  );
}
