"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { CutReview, EditorProject, HiggsfieldAccount, StudioOverview } from "./source";
import { KpiStrip, type KpiItem } from "../hoy/KpiStrip";
import { EditorFlow } from "./EditorFlow";
import { VideoProjectsTable } from "./VideoProjectsTable";
import { HiggsfieldPanel } from "./HiggsfieldPanel";
import { CutApprovalRail } from "./CutApprovalRail";

interface EstudioViewProps {
  overview: StudioOverview;
  projects: EditorProject[];
  higgsfield: HiggsfieldAccount;
  cutQueue: CutReview[];
}

// Los 6 KPIs de la franja hairline. El único en ámbar (tono yellow) es la cola de
// corte: es lo que necesita tu OK. El resto usa semánticos vivos/neutros.
function buildKpis(kpis: StudioOverview["kpis"]): KpiItem[] {
  return [
    { key: "creditos", label: "Créditos Higgsfield", value: kpis.higgsfieldCreditsLabel, hint: kpis.higgsfieldUsedLabel, tone: "green" },
    { key: "gasto", label: "Gasto IA · mes", value: kpis.spendMonthLabel, hint: kpis.spendTodayLabel, tone: "neutral" },
    { key: "cola", label: "En cola de corte", value: String(kpis.cutQueue), hint: "Necesitan tu OK", tone: "yellow" },
    { key: "listos", label: "Videos listos", value: String(kpis.videosReady), hint: kpis.videosReadyHint, tone: "green" },
    { key: "proceso", label: "En proceso", value: String(kpis.inProcess), hint: kpis.inProcessHint, tone: "blue" },
    { key: "ahorro", label: "Ahorro vs editor", value: kpis.savingsLabel, hint: kpis.savingsHint, tone: "green" },
  ];
}

export function EstudioView({ overview, projects, higgsfield, cutQueue }: EstudioViewProps) {
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const kpis = useMemo(() => buildKpis(overview.kpis), [overview.kpis]);

  // Corte que muestra el rail: el enfocado, o el primero con detalle (el activo).
  const activeReview = useMemo(() => {
    const detailed = cutQueue.find((review) => review.detail) ?? cutQueue[0];
    if (!focusedId) {
      return detailed;
    }
    return cutQueue.find((review) => review.id === focusedId) ?? detailed;
  }, [cutQueue, focusedId]);

  const focus = focusedId !== null;
  const waitingCount = Math.max(0, cutQueue.length - 1);

  // "Ver cortes" de un proyecto abre el foco; si el corte no trae detalle, cae al
  // activo (el que sí tiene segmentos) para no dejar el rail vacío.
  const openCuts = (reviewId: string) => {
    const target = cutQueue.find((review) => review.id === reviewId);
    setFocusedId(target?.detail ? reviewId : cutQueue.find((review) => review.detail)?.id ?? reviewId);
  };
  const openQueue = () => {
    if (activeReview) {
      setFocusedId(activeReview.id);
    }
  };

  if (!activeReview) {
    return null;
  }

  return (
    <div className="grid gap-5">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="grid gap-1.5">
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-foreground">Estudio de Contenido</h1>
          <p className="max-w-[60ch] text-[13px] leading-relaxed text-muted-foreground">
            Ver, cortar y publicar video sin editores humanos. Núcleo gratis{" "}
            <InlineCode>Speaches</InlineCode> · <InlineCode>cut-plan.mjs</InlineCode> ·{" "}
            <InlineCode>HyperFrames</InlineCode>. Generación paga solo con tu OK.
          </p>
        </div>
        <div className="flex flex-wrap items-stretch gap-3">
          <div
            className="flex min-w-[132px] flex-col gap-0.5 rounded-xl border px-3.5 py-2.5"
            style={{
              background: "linear-gradient(180deg, var(--accent-wash), var(--card) 60%)",
              borderColor: "color-mix(in oklch, var(--primary) 30%, var(--border))",
              boxShadow: "var(--panel-shadow-sm)",
            }}
          >
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.03em] text-[color:var(--faint)]">
              Créditos Higgsfield
            </span>
            <span className="flex items-baseline gap-1 text-[19px] font-bold tabular-nums" style={{ color: "var(--accent-strong)" }}>
              {overview.headerCreditsLabel}
              <span className="text-[11px] font-semibold text-[color:var(--faint)]">{overview.headerCreditUnit}</span>
            </span>
            <span className="self-start rounded-[5px] px-1.5 py-px text-[10px] font-bold uppercase tracking-[0.04em] onia-center-tone-green">
              plan {overview.plan}
            </span>
          </div>
          <div className="flex min-w-[132px] flex-col gap-0.5 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-[var(--panel-shadow-sm)]">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.03em] text-[color:var(--faint)]">Gasto IA · mes</span>
            <span className="text-[19px] font-bold tabular-nums text-foreground">{overview.spendMonthLabel}</span>
            <span className="text-[11px] text-muted-foreground">{overview.spendTodayLabel}</span>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 self-stretch rounded-xl bg-primary px-5 text-[13.5px] font-semibold text-primary-foreground shadow-[var(--panel-shadow-sm)] transition-[filter,transform] hover:-translate-y-px hover:brightness-[1.06] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]"
          >
            <Plus size={15} aria-hidden="true" />
            Nuevo video
          </button>
        </div>
      </header>

      <KpiStrip items={kpis} />

      <EditorFlow stages={overview.pipeline} />

      {focus ? (
        <div className="grid gap-5">
          <CutApprovalRail
            review={activeReview}
            waitingCount={waitingCount}
            focus
            onOpenFocus={openQueue}
            onExitFocus={() => setFocusedId(null)}
          />
          <VideoProjectsTable projects={projects} onOpenCuts={openCuts} />
          <HiggsfieldPanel account={higgsfield} />
        </div>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_452px]">
          {/* En mobile el rail de aprobación (la compuerta) sube primero: es lo que
              necesita tu OK. En desktop vuelve a la derecha, sticky. */}
          <div className="order-2 grid min-w-0 gap-5 lg:order-1">
            <VideoProjectsTable projects={projects} onOpenCuts={openCuts} />
            <HiggsfieldPanel account={higgsfield} />
          </div>
          <div className="order-1 lg:order-2 lg:sticky lg:top-4">
            <CutApprovalRail
              review={activeReview}
              waitingCount={waitingCount}
              focus={false}
              onOpenFocus={openQueue}
              onExitFocus={() => setFocusedId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function InlineCode({ children }: { children: string }) {
  return (
    <code className="rounded-[5px] border border-border bg-secondary px-1.5 py-px font-mono text-[11.5px] text-foreground">
      {children}
    </code>
  );
}
