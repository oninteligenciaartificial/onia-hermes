import type { ReactNode } from "react";
import type { CenterTone } from "@/app/onia-center/types";

const TONE_CLASSES: Record<CenterTone, string> = {
  green: "onia-center-tone-green",
  yellow: "onia-center-tone-yellow",
  red: "onia-center-tone-red",
  blue: "onia-center-tone-blue",
  neutral: "onia-center-tone-neutral",
};

interface BadgeProps {
  tone: CenterTone;
  children: ReactNode;
}

export function Badge({ tone, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
