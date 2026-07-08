import type { ReactNode } from "react";

interface SurfaceCardProps {
  title?: string;
  children: ReactNode;
}

export function SurfaceCard({ title, children }: SurfaceCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      {title ? <h3 className="mb-3 text-base font-medium text-card-foreground">{title}</h3> : null}
      {children}
    </div>
  );
}
