import type { PersonEarnings } from "@/app/onia-center/live/live-runtime";
import { formatBs } from "@/app/onia-center/engine";
import { SurfaceCard } from "../../ui/SurfaceCard";

interface EarningsCardProps {
  earnings: PersonEarnings[];
}

const ROLE_LABEL: Record<string, string> = {
  sergio: "Fundador",
  arthur: "Socio operativo",
  area: "Responsable de área",
  seller: "Ventas",
  freelancer: "Freelance",
  area_responsible: "Responsable de área",
};

function roleLabel(role: string): string {
  return ROLE_LABEL[role] ?? role;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function EarningsCard({ earnings }: EarningsCardProps) {
  const ranked = [...earnings].sort((a, b) => b.earnedBs - a.earnedBs);
  const totalEarned = ranked.reduce((sum, entry) => sum + entry.earnedBs, 0);
  const hasSales = ranked.some((entry) => entry.salesCount > 0 || entry.earnedBs > 0 || entry.pendingBs > 0);

  return (
    <SurfaceCard
      title="Ganancias del equipo"
      subtitle="Cuánto lleva ganado y pendiente cada persona, por resultado real"
      action={
        hasSales ? (
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tabular-nums onia-center-tone-green">
            {formatBs(totalEarned, { compact: true })}
          </span>
        ) : null
      }
    >
      {!hasSales ? (
        <p className="text-sm text-muted-foreground">
          Sin ventas aún. Cuando el equipo cierre y el agente Finanzas concilie el cobro, cada
          comisión aparece acá con su monto ganado y lo pendiente.
        </p>
      ) : (
        <div className="grid">
          {ranked.map((entry) => (
            <div
              key={entry.personKey || entry.displayName}
              className="flex items-center justify-between gap-4 border-t border-border py-3 first:border-t-0 first:pt-0.5 last:pb-0"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                  {initials(entry.displayName)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{entry.displayName}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {roleLabel(entry.role)}
                    {entry.salesCount > 0
                      ? ` · ${entry.salesCount} ${entry.salesCount === 1 ? "venta" : "ventas"}`
                      : ""}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold tabular-nums text-foreground">{formatBs(entry.earnedBs)}</p>
                {entry.pendingBs > 0 ? (
                  <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                    {formatBs(entry.pendingBs)} pendiente
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </SurfaceCard>
  );
}
