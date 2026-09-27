"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Terang", icon: Sun },
  { value: "dark", label: "Gelap", icon: Moon },
  { value: "system", label: "Ikuti Sistem", icon: Monitor },
] as const;

/**
 * Light / dark / system switcher.
 *
 * Renders a stable placeholder until mounted so the icon never flickers or
 * causes a hydration mismatch (the server cannot know the active theme).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const active = OPTIONS.find((option) => option.value === theme);
  const ActiveIcon = mounted && active ? active.icon : Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-9 w-9", className)}
          aria-label="Ubah tema tampilan"
        >
          <ActiveIcon className="h-[18px] w-[18px]" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Tema tampilan</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => setTheme(option.value)}
              className="gap-2"
            >
              <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span>{option.label}</span>
              {mounted && theme === option.value ? (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              ) : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
