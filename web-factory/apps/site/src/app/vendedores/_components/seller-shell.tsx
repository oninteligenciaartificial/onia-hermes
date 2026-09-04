"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  BookOpen,
  Building2,
  Calculator,
  CheckCircle2,
  ClipboardList,
  MessageSquareText,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  WalletCards,
} from "lucide-react";
import { sellerNavigation } from "../data";

const navIcons = {
  inicio: Target,
  operacion: ClipboardList,
  captura: Plus,
  leads: Building2,
  webs: Search,
  cotizador: Calculator,
  notas: MessageSquareText,
  ideas: Sparkles,
  ingresos: Banknote,
  biblioteca: BookOpen,
  requerimientos: CheckCircle2,
};

export function SellerSidebar() {
  const pathname = usePathname() ?? "";

  return (
    <aside className="seller-sidebar" aria-label="Panel de vendedores">
      <Link className="seller-back" href="/">
        <ArrowLeft size={16} />
        Control Center
      </Link>

      <div className="seller-brand">
        <span>
          <WalletCards size={20} />
        </span>
        <div>
          <strong>Onia Panel</strong>
          <small>Vendedores</small>
        </div>
      </div>

      <nav className="seller-nav">
        {sellerNavigation.map((item) => {
          const Icon = navIcons[item.id as keyof typeof navIcons] ?? Target;
          const isRoot = item.href === "/vendedores" && pathname === "/vendedores";
          const isActive = isRoot || (item.href !== "/vendedores" && pathname.startsWith(item.href));

          return (
            <Link href={item.href} className={isActive ? "is-active" : ""} key={item.id}>
              <Icon size={15} />
              <span>{item.label}</span>
              <small>{item.detail}</small>
            </Link>
          );
        })}
      </nav>

      <section className="seller-rule">
        <ShieldCheck size={17} />
        <div>
          <strong>Sin datos completos, no hay comision aprobada.</strong>
          <p>Notion es fuente oficial hoy. Supabase queda preparado para el panel propio.</p>
        </div>
      </section>
    </aside>
  );
}
