"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { href: string; label: string; finance?: boolean };

const TABS: Tab[] = [
  { href: "/onia-center/next/hoy", label: "Hoy" },
  { href: "/onia-center/next/pipeline", label: "Pipeline" },
  { href: "/onia-center/next/agentes", label: "Agentes" },
  { href: "/onia-center/next/finanzas", label: "Finanzas", finance: true },
  { href: "/onia-center/next/negocio", label: "Negocio" },
];

interface TopNavProps {
  /** Cuando es false, la pestana Finanzas no se renderiza (rol seller/freelancer). */
  canSeeFinance?: boolean;
}

export function TopNav({ canSeeFinance = true }: TopNavProps) {
  const pathname = usePathname();
  const tabs = TABS.filter((tab) => (tab.finance ? canSeeFinance : true));

  return (
    <nav aria-label="Secciones de ONIA Center" className="flex gap-0.5">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex h-9 items-center rounded-md px-3.5 text-sm font-medium transition-colors ${
              active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
