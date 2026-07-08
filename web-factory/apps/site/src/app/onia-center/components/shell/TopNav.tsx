"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/onia-center/next/hoy", label: "Hoy" },
  { href: "/onia-center/next/pipeline", label: "Pipeline" },
  { href: "/onia-center/next/agentes", label: "Agentes" },
  { href: "/onia-center/next/negocio", label: "Negocio" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Secciones de ONIA Center" className="flex gap-1">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`inline-flex h-9 items-center rounded-md px-3.5 text-sm font-medium ${
            pathname === tab.href ? "bg-secondary text-foreground" : "text-muted-foreground"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
