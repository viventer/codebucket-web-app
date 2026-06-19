import { DownloadIcon } from "lucide-react";

import { ActionBarButtonLabel } from "./ActionBarButtonLabel";
import { PlaceholderButton } from "./PlaceholderButton";

export function DownloadMaterialsButton() {
  return (
    <PlaceholderButton variant="ghost">
      <ActionBarButtonLabel label="Pobierz materiały" icon={DownloadIcon} />
    </PlaceholderButton>
  );
}
