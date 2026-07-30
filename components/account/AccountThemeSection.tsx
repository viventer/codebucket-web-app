"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeOption = { value: string; label: string; icon: ReactNode };

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Jasny", icon: <SunIcon className="size-4" /> },
  { value: "dark", label: "Ciemny", icon: <MoonIcon className="size-4" /> },
  {
    value: "system",
    label: "Systemowy",
    icon: <MonitorIcon className="size-4" />,
  },
];

const DEFAULT_THEME = "dark";

export function AccountThemeSection() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? (theme ?? DEFAULT_THEME) : DEFAULT_THEME;

  return (
    <section className="flex flex-col gap-1">
      <h3 className="font-medium">Motyw kolorów</h3>
      <div className="flex gap-3 flex-col sm:flex-row">
        {THEME_OPTIONS.map((option) => (
          <Button
            onClick={() => setTheme(option.value)}
            key={option.value}
            variant="outline"
            size="sm"
            className={cn(
              "sm:flex-1 p-4 transition-colors",
              activeTheme === option.value
                ? "border-accent"
                : "text-muted-foreground",
            )}
          >
            <span className="flex items-center gap-1">
              {option.icon}
              {option.label}
            </span>
          </Button>
        ))}
      </div>
    </section>
  );
}
