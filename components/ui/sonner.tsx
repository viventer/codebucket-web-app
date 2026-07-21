"use client";

import {
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { ClientIcon } from "@/components/ui/client-icon";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      position="bottom-right"
      offset="6.5rem"
      mobileOffset={{
        bottom: "5.5rem",
        left: "5%",
        right: "5%",
      }}
      className="toaster group"
      icons={{
        success: (
          <ClientIcon
            src="checkCircle.svg"
            size={20}
            className="text-feedback-success"
          />
        ),
        info: <InfoIcon className="size-5 text-accent" />,
        warning: <TriangleAlertIcon className="size-5 text-feedback-warning" />,
        error: <OctagonXIcon className="size-5 text-feedback-destructive" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast border-2 bg-popover text-foreground shadow-lg px-6! py-4! gap-3!",
          description: "text-muted-foreground!",
          success: "cn-toast-success",
          info: "cn-toast-info",
          warning: "cn-toast-warning",
          error: "cn-toast-error",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
