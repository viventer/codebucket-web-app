import type { LucideIcon } from "lucide-react";

type ActionBarButtonLabelProps = {
  label: string;
  icon: LucideIcon;
};

export function ActionBarButtonLabel({
  label,
  icon: Icon,
}: ActionBarButtonLabelProps) {
  return (
    <>
      <span className="hidden sm:inline">{label}</span>
      <Icon className="size-4 sm:hidden" />
    </>
  );
}
