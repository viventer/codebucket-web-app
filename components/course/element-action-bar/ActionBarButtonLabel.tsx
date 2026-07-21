"use client";

import type { LucideIcon } from "lucide-react";

import { ClientIcon } from "@/components/ui/client-icon";

type ActionBarButtonLabelProps = {
  label: string;
  icon?: LucideIcon;
  iconSrc?: string;
};

export function ActionBarButtonLabel({
  label,
  icon: Icon,
  iconSrc,
}: ActionBarButtonLabelProps) {
  return (
    <>
      <span className="hidden sm:inline">{label}</span>
      {iconSrc ? (
        <ClientIcon src={iconSrc} size={16} className="sm:hidden" />
      ) : Icon ? (
        <Icon className="size-4 sm:hidden" />
      ) : null}
    </>
  );
}
