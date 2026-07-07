# Onia Center Shell + Hoy (Fase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a navigable "Clean operator" shell for the new ONIA Center at `/onia-center/next/*` with a fully data-wired "Hoy" home view (roster de agentes, cola de aprobación, agenda de hoy), living alongside the production monolith at `/onia-center` without touching it.

**Architecture:** A mirror route tree (`onia-center/next/**`) inherits the existing auth middleware for free (matcher `/onia-center/:path*`). Small presentational components (`components/ui`, `components/shell`, `components/views/hoy`) compose around the existing, untouched data layer (`onia-center-store.ts`, `onia-center-auth.ts`, `operating-source.ts`, `operating-engine.ts`) — none of those files are edited in this plan. Pipeline/Agentes/Negocio ship as honest empty-state placeholders in this phase; they get wired to real data one view per commit in Phase 2 (separate plan).

**Tech Stack:** Next.js 15.5 App Router (React 19 Server Components), TypeScript 5, Tailwind v4 utility classes bound to the existing `globals.css` tokens (`bg-card`, `text-muted-foreground`, `border-border`, `rounded-lg`, etc.), a small custom `tokens.css` only for the 5-way `CenterTone` color system (not present in the existing theme), Vitest for the one module with real logic (`schedule-helpers.ts`).

**Deviation from the approved spec:** the spec listed a generic `ui/Tile.tsx` metric primitive. While building this plan, none of Hoy's three tiles are actually big-number KPI displays — they're all lists (agent roster, pending reviews, schedule rows) that fit `SurfaceCard` directly. Building `Tile.tsx` now would be unused scaffolding, so it's dropped from this phase; add it later if a Phase 2 view (e.g. Negocio) actually needs a KPI-number tile.

**Base path for every file below:** `web-factory/apps/site/src/app/onia-center/` (all "Create" paths are relative to this unless they start with `web-factory/apps/site/src/lib` or similar).

---

## Task 1: Design tokens for the `CenterTone` color system

**Files:**
- Create: `web-factory/apps/site/src/app/onia-center/styles/tokens.css`

- [ ] **Step 1: Create the tokens file**

```css
:root {
  --center-tone-green: oklch(0.5 0.13 155);
  --center-tone-green-bg: oklch(0.94 0.05 155);
  --center-tone-yellow: oklch(0.52 0.14 85);
  --center-tone-yellow-bg: oklch(0.94 0.06 85);
  --center-tone-red: oklch(0.5 0.19 25);
  --center-tone-red-bg: oklch(0.93 0.06 25);
  --center-tone-blue: oklch(0.46 0.12 250);
  --center-tone-blue-bg: oklch(0.93 0.04 250);
}

.onia-center-tone-green {
  color: var(--center-tone-green);
  background: var(--center-tone-green-bg);
}

.onia-center-tone-yellow {
  color: var(--center-tone-yellow);
  background: var(--center-tone-yellow-bg);
}

.onia-center-tone-red {
  color: var(--center-tone-red);
  background: var(--center-tone-red-bg);
}

.onia-center-tone-blue {
  color: var(--center-tone-blue);
  background: var(--center-tone-blue-bg);
}

.onia-center-tone-neutral {
  color: var(--muted-foreground);
  background: var(--muted);
}
```

This follows the same pattern already used in `globals.css` for the `automation-page` styles (`:root` custom properties + modifier classes like `.status-pill.is-warn`) — no new build tooling, no Tailwind `@theme` block needed. `--muted-foreground` and `--muted` already exist in `globals.css`, reused here instead of duplicated.

- [ ] **Step 2: Commit**

```bash
git add web-factory/apps/site/src/app/onia-center/styles/tokens.css
git commit -m "feat(onia-center): add CenterTone design tokens for the new shell"
```

---

## Task 2: Schedule helper functions (TDD — real logic)

**Files:**
- Create: `web-factory/apps/site/src/app/onia-center/components/views/hoy/schedule-helpers.ts`
- Test: `web-factory/apps/site/src/app/onia-center/components/views/hoy/schedule-helpers.test.ts`

`sergioStrictScheduleBlocks` (in `operating-source.ts`) stores `dayPattern` as a free-text Spanish phrase like `"Lunes a viernes"` or `"Lunes a sabado"`, not a machine code — so picking "today's" blocks requires parsing that phrase. This is the one piece of Phase 1 with real branching logic, so it gets a real test first.

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, expect, it } from "vitest";
import {
  getTodaysScheduleBlocks,
  isBlockHappeningNow,
  isScheduleBlockActiveToday,
} from "./schedule-helpers";
import type { SergioScheduleBlock } from "@/app/onia-center/types";

const MONDAY = new Date("2024-01-01T10:00:00");
const SATURDAY = new Date("2024-01-06T10:00:00");
const SUNDAY = new Date("2024-01-07T10:00:00");

describe("isScheduleBlockActiveToday", () => {
  it("returns true when today falls inside a Lunes a viernes range", () => {
    expect(isScheduleBlockActiveToday("Lunes a viernes", MONDAY)).toBe(true);
  });

  it("returns false when today falls outside a Lunes a viernes range", () => {
    expect(isScheduleBlockActiveToday("Lunes a viernes", SATURDAY)).toBe(false);
  });

  it("returns true when today falls inside a Lunes a sabado range", () => {
    expect(isScheduleBlockActiveToday("Lunes a sabado", SATURDAY)).toBe(true);
  });

  it("returns false for an unrecognized day pattern", () => {
    expect(isScheduleBlockActiveToday("Todos los dias", SUNDAY)).toBe(false);
  });
});

describe("isBlockHappeningNow", () => {
  it("returns true when the reference time is within start and end", () => {
    const reference = new Date("2026-07-06T07:15:00");
    expect(isBlockHappeningNow({ start: "07:00", end: "07:30" }, reference)).toBe(true);
  });

  it("returns false when the reference time is before start", () => {
    const reference = new Date("2026-07-06T06:59:00");
    expect(isBlockHappeningNow({ start: "07:00", end: "07:30" }, reference)).toBe(false);
  });

  it("returns false when the reference time equals end", () => {
    const reference = new Date("2026-07-06T07:30:00");
    expect(isBlockHappeningNow({ start: "07:00", end: "07:30" }, reference)).toBe(false);
  });
});

describe("getTodaysScheduleBlocks", () => {
  const blocks: SergioScheduleBlock[] = [
    {
      id: "sergio-sales-block",
      dayPattern: "Lunes a viernes",
      start: "08:30",
      end: "10:30",
      title: "Ventas, CRM y seguimientos",
      category: "sales",
      strictness: "fixed",
      meetingPolicy: "emergency_only",
      note: "Solo leads, llamadas, propuestas y proximas acciones.",
      visibility: "sergio_private",
    },
    {
      id: "sergio-ceo-plan",
      dayPattern: "Lunes a viernes",
      start: "07:00",
      end: "07:30",
      title: "Plan CEO: caja, ventas, 3 prioridades",
      category: "planning",
      strictness: "fixed",
      meetingPolicy: "blocked",
      note: "Definir una accion de venta, una accion de entrega y una accion personal protegida.",
      visibility: "sergio_private",
    },
    {
      id: "sergio-weekend-block",
      dayPattern: "Sabado a domingo",
      start: "10:00",
      end: "12:00",
      title: "Bloque de fin de semana",
      category: "personal",
      strictness: "flex",
      meetingPolicy: "blocked",
      note: "No aplica entre semana.",
      visibility: "sergio_private",
    },
  ];

  it("returns only today's blocks sorted by start time", () => {
    const result = getTodaysScheduleBlocks(blocks, MONDAY);
    expect(result.map((block) => block.id)).toEqual(["sergio-ceo-plan", "sergio-sales-block"]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run (from `web-factory/`): `pnpm test schedule-helpers`
Expected: FAIL — `Cannot find module './schedule-helpers'` (the file doesn't exist yet).

- [ ] **Step 3: Write the implementation**

```typescript
import type { SergioScheduleBlock } from "@/app/onia-center/types";

const WEEKDAY_ORDER = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

const COMBINING_DIACRITICS_START = String.fromCharCode(0x0300);
const COMBINING_DIACRITICS_END = String.fromCharCode(0x036f);
const COMBINING_DIACRITICS_PATTERN = new RegExp(`[${COMBINING_DIACRITICS_START}-${COMBINING_DIACRITICS_END}]`, "g");

function stripAccents(value: string): string {
  return value.normalize("NFD").replace(COMBINING_DIACRITICS_PATTERN, "");
}

function weekdayIndexFromDate(referenceDate: Date): number {
  const jsDay = referenceDate.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function isScheduleBlockActiveToday(dayPattern: string, referenceDate: Date): boolean {
  const [rawStart, rawEnd] = stripAccents(dayPattern.toLowerCase()).split(" a ");
  if (!rawStart || !rawEnd) {
    return false;
  }

  const startIndex = WEEKDAY_ORDER.indexOf(rawStart.trim());
  const endIndex = WEEKDAY_ORDER.indexOf(rawEnd.trim());
  if (startIndex === -1 || endIndex === -1) {
    return false;
  }

  const todayIndex = weekdayIndexFromDate(referenceDate);
  return todayIndex >= startIndex && todayIndex <= endIndex;
}

function timeLabel(referenceDate: Date): string {
  const hours = String(referenceDate.getHours()).padStart(2, "0");
  const minutes = String(referenceDate.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function isBlockHappeningNow(
  block: Pick<SergioScheduleBlock, "start" | "end">,
  referenceDate: Date,
): boolean {
  const nowLabel = timeLabel(referenceDate);
  return nowLabel >= block.start && nowLabel < block.end;
}

export function getTodaysScheduleBlocks(
  blocks: SergioScheduleBlock[],
  referenceDate: Date,
): SergioScheduleBlock[] {
  return blocks
    .filter((block) => isScheduleBlockActiveToday(block.dayPattern, referenceDate))
    .sort((a, b) => a.start.localeCompare(b.start));
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run (from `web-factory/`): `pnpm test schedule-helpers`
Expected: PASS — 8 tests green.

- [ ] **Step 5: Commit**

```bash
git add web-factory/apps/site/src/app/onia-center/components/views/hoy/schedule-helpers.ts web-factory/apps/site/src/app/onia-center/components/views/hoy/schedule-helpers.test.ts
git commit -m "feat(onia-center): add schedule-helpers for today's agenda filtering"
```

---

## Task 3: UI primitives (Badge, EmptyState, SurfaceCard)

**Files:**
- Create: `web-factory/apps/site/src/app/onia-center/components/ui/Badge.tsx`
- Create: `web-factory/apps/site/src/app/onia-center/components/ui/EmptyState.tsx`
- Create: `web-factory/apps/site/src/app/onia-center/components/ui/SurfaceCard.tsx`

- [ ] **Step 1: Create `Badge.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `EmptyState.tsx`**

```tsx
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  body: string;
  linkHref?: string;
  linkLabel?: string;
}

export function EmptyState({ title, body, linkHref, linkLabel }: EmptyStateProps) {
  return (
    <div className="grid gap-2 rounded-lg border border-border bg-card p-12 text-center">
      <h2 className="text-lg font-medium text-card-foreground">{title}</h2>
      <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">{body}</p>
      {linkHref && linkLabel ? (
        <Link href={linkHref} className="mt-2 justify-self-center text-sm font-medium text-primary">
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 3: Create `SurfaceCard.tsx`**

```tsx
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
```

- [ ] **Step 4: Type-check**

Run (from `web-factory/apps/site/`): `npx tsc --noEmit`
Expected: no errors referencing these 3 files.

- [ ] **Step 5: Commit**

```bash
git add web-factory/apps/site/src/app/onia-center/components/ui/Badge.tsx web-factory/apps/site/src/app/onia-center/components/ui/EmptyState.tsx web-factory/apps/site/src/app/onia-center/components/ui/SurfaceCard.tsx
git commit -m "feat(onia-center): add Badge, EmptyState and SurfaceCard UI primitives"
```

---

## Task 4: TopNav (4-tab navigation)

**Files:**
- Create: `web-factory/apps/site/src/app/onia-center/components/shell/TopNav.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
```

`usePathname` requires the `"use client"` boundary; `Link` itself does not, but it lives in the same file here.

- [ ] **Step 2: Type-check**

Run (from `web-factory/apps/site/`): `npx tsc --noEmit`
Expected: no errors referencing this file.

- [ ] **Step 3: Commit**

```bash
git add web-factory/apps/site/src/app/onia-center/components/shell/TopNav.tsx
git commit -m "feat(onia-center): add TopNav with 4-tab navigation"
```

---

## Task 5: QuickCapturePanel (global slide-over stub)

**Files:**
- Create: `web-factory/apps/site/src/app/onia-center/components/shell/QuickCapturePanel.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { EmptyState } from "../ui/EmptyState";

export function QuickCapturePanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-9 rounded-md border border-border bg-card px-3.5 text-sm font-medium text-foreground"
      >
        Notas e ideas
      </button>
      {open ? (
        <div className="fixed inset-0 z-30 flex justify-end bg-black/30" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-label="Notas e ideas"
            onClick={(event) => event.stopPropagation()}
            className="h-full w-full max-w-md overflow-y-auto border-l border-border bg-card p-6"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mb-4 text-sm text-muted-foreground"
            >
              Cerrar
            </button>
            <EmptyState
              title="Notas e ideas en camino"
              body="Esta captura rapida todavia vive en el panel actual. Se conecta a los datos reales cuando se porte esta pieza."
              linkHref="/onia-center"
              linkLabel="Ver notas e ideas en el panel actual"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
```

This is a stub: it opens/closes and shows an honest empty state, but does not read or write real notes/ideas yet. That wiring happens when Negocio is ported in Phase 2 (per the approved spec's roadmap).

- [ ] **Step 2: Type-check**

Run (from `web-factory/apps/site/`): `npx tsc --noEmit`
Expected: no errors referencing this file.

- [ ] **Step 3: Commit**

```bash
git add web-factory/apps/site/src/app/onia-center/components/shell/QuickCapturePanel.tsx
git commit -m "feat(onia-center): add QuickCapturePanel stub for notes and ideas"
```

---

## Task 6: AppShell (topbar + content slot)

**Files:**
- Create: `web-factory/apps/site/src/app/onia-center/components/shell/AppShell.tsx`

- [ ] **Step 1: Create the component**

```tsx
import type { ReactNode } from "react";
import "../../styles/tokens.css";
import { TopNav } from "./TopNav";
import { QuickCapturePanel } from "./QuickCapturePanel";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-6">
        <span className="text-[15px] font-semibold tracking-tight">ONIA Center</span>
        <TopNav />
        <QuickCapturePanel />
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
```

The root `bg-background text-foreground` on this div is deliberate: `globals.css`'s `body` rule hardcodes `bg-black text-white` unconditionally (for the marketing/Nuvia pages), so every product surface in this app (see `.automation-page`, `.nuvia-next-page`) repaints its own background at the page-root level. This div does the same for the new shell.

- [ ] **Step 2: Type-check**

Run (from `web-factory/apps/site/`): `npx tsc --noEmit`
Expected: no errors referencing this file.

- [ ] **Step 3: Commit**

```bash
git add web-factory/apps/site/src/app/onia-center/components/shell/AppShell.tsx
git commit -m "feat(onia-center): add AppShell with topbar and content slot"
```

---

## Task 7: AgentRosterTile

**Files:**
- Create: `web-factory/apps/site/src/app/onia-center/components/views/hoy/AgentRosterTile.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { getAgentTone } from "@/app/onia-center/operating-engine";
import type { OperatingAgent } from "@/app/onia-center/types";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";

interface AgentRosterTileProps {
  agents: OperatingAgent[];
}

export function AgentRosterTile({ agents }: AgentRosterTileProps) {
  return (
    <SurfaceCard title="Agentes">
      <div className="grid gap-2.5">
        {agents.map((agent) => (
          <div key={agent.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">{agent.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{agent.mission}</p>
            </div>
            <Badge tone={getAgentTone(agent.status)}>{agent.status}</Badge>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
```

`getAgentTone` is reused directly from `operating-engine.ts` (already handles the `ready → green / prepared_pending_connection → yellow / blocked → red / else → blue` mapping) — no new tone logic is written here.

- [ ] **Step 2: Type-check**

Run (from `web-factory/apps/site/`): `npx tsc --noEmit`
Expected: no errors referencing this file.

- [ ] **Step 3: Commit**

```bash
git add web-factory/apps/site/src/app/onia-center/components/views/hoy/AgentRosterTile.tsx
git commit -m "feat(onia-center): add AgentRosterTile for the Hoy view"
```

---

## Task 8: ReviewQueueTile

**Files:**
- Create: `web-factory/apps/site/src/app/onia-center/components/views/hoy/ReviewQueueTile.tsx`

- [ ] **Step 1: Create the component**

```tsx
import type { RuntimeReview } from "@/lib/onia-center-store";
import { Badge } from "../../ui/Badge";
import { SurfaceCard } from "../../ui/SurfaceCard";

interface ReviewQueueTileProps {
  reviews: RuntimeReview[];
}

const STATUS_TONE: Record<RuntimeReview["status"], "green" | "yellow" | "red" | "blue"> = {
  pendiente: "yellow",
  aprobado: "green",
  rechazado: "red",
  importado: "blue",
};

export function ReviewQueueTile({ reviews }: ReviewQueueTileProps) {
  const pending = reviews.filter((review) => review.status === "pendiente");

  return (
    <SurfaceCard title={`Cola de aprobacion (${pending.length} pendientes)`}>
      {pending.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nada esperando tu aprobacion ahora mismo.</p>
      ) : (
        <div className="grid gap-2.5">
          {pending.map((review) => (
            <div key={review.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{review.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{review.source}</p>
              </div>
              <Badge tone={STATUS_TONE[review.status]}>{review.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </SurfaceCard>
  );
}
```

**Important:** `RuntimeReview` comes from `@/lib/onia-center-store` (the real Supabase `review_queue` table). There is a *different*, same-named-sounding `reviewQueue` seed array exported from `./operating-source` (type `ReviewQueueItem`) — that one is static demo data for the legacy dashboard and must NOT be used here.

- [ ] **Step 2: Type-check**

Run (from `web-factory/apps/site/`): `npx tsc --noEmit`
Expected: no errors referencing this file.

- [ ] **Step 3: Commit**

```bash
git add web-factory/apps/site/src/app/onia-center/components/views/hoy/ReviewQueueTile.tsx
git commit -m "feat(onia-center): add ReviewQueueTile backed by the real review_queue table"
```

---

## Task 9: TodayScheduleCard

**Files:**
- Create: `web-factory/apps/site/src/app/onia-center/components/views/hoy/TodayScheduleCard.tsx`

- [ ] **Step 1: Create the component**

```tsx
import type { SergioScheduleBlock } from "@/app/onia-center/types";
import { SurfaceCard } from "../../ui/SurfaceCard";
import { getTodaysScheduleBlocks, isBlockHappeningNow } from "./schedule-helpers";

interface TodayScheduleCardProps {
  blocks: SergioScheduleBlock[];
  referenceDate: Date;
}

export function TodayScheduleCard({ blocks, referenceDate }: TodayScheduleCardProps) {
  const todaysBlocks = getTodaysScheduleBlocks(blocks, referenceDate);

  return (
    <SurfaceCard title="Agenda de hoy">
      {todaysBlocks.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin bloques definidos para hoy.</p>
      ) : (
        <div className="grid gap-2.5">
          {todaysBlocks.map((block) => {
            const isNow = isBlockHappeningNow(block, referenceDate);
            return (
              <div
                key={block.id}
                className={`flex items-baseline gap-3 rounded-md ${isNow ? "bg-secondary px-2.5 py-2" : ""}`}
              >
                <span className="min-w-[88px] text-xs font-semibold text-muted-foreground">
                  {block.start} - {block.end}
                </span>
                <span className={`text-sm ${isNow ? "font-semibold" : ""}`}>{block.title}</span>
              </div>
            );
          })}
        </div>
      )}
    </SurfaceCard>
  );
}
```

- [ ] **Step 2: Type-check**

Run (from `web-factory/apps/site/`): `npx tsc --noEmit`
Expected: no errors referencing this file.

- [ ] **Step 3: Commit**

```bash
git add web-factory/apps/site/src/app/onia-center/components/views/hoy/TodayScheduleCard.tsx
git commit -m "feat(onia-center): add TodayScheduleCard with current-block highlight"
```

---

## Task 10: HoyView (composition)

**Files:**
- Create: `web-factory/apps/site/src/app/onia-center/components/views/hoy/HoyView.tsx`

- [ ] **Step 1: Create the component**

```tsx
import type { OperatingAgent, SergioScheduleBlock } from "@/app/onia-center/types";
import type { RuntimeReview } from "@/lib/onia-center-store";
import { AgentRosterTile } from "./AgentRosterTile";
import { ReviewQueueTile } from "./ReviewQueueTile";
import { TodayScheduleCard } from "./TodayScheduleCard";

interface HoyViewProps {
  agents: OperatingAgent[];
  reviews: RuntimeReview[];
  scheduleBlocks: SergioScheduleBlock[];
  referenceDate: Date;
}

export function HoyView({ agents, reviews, scheduleBlocks, referenceDate }: HoyViewProps) {
  return (
    <div className="grid gap-4">
      <TodayScheduleCard blocks={scheduleBlocks} referenceDate={referenceDate} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        <AgentRosterTile agents={agents} />
        <ReviewQueueTile reviews={reviews} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run (from `web-factory/apps/site/`): `npx tsc --noEmit`
Expected: no errors referencing this file.

- [ ] **Step 3: Commit**

```bash
git add web-factory/apps/site/src/app/onia-center/components/views/hoy/HoyView.tsx
git commit -m "feat(onia-center): compose HoyView from schedule, roster and review tiles"
```

---

## Task 11: `/onia-center/next/hoy` — the real data-wired page

**Files:**
- Create: `web-factory/apps/site/src/app/onia-center/next/hoy/page.tsx`

This is the only file in Phase 1 that touches the data layer. It mirrors the auth pattern already used by `src/app/api/onia-center/runtime/route.ts`, adapted to a Server Component: instead of receiving a `Request` from Next.js routing (like a Route Handler does), it builds a minimal one from `next/headers` cookies, because `getOniaCenterActor` only ever reads `request.headers.get("cookie")` / `authorization` (confirmed by reading `getAccessTokenFromRequest` in `onia-center-auth.ts`).

- [ ] **Step 1: Create the page**

```tsx
import { cookies } from "next/headers";
import {
  filterOniaCenterRuntimeForActor,
  getMissingOniaCenterConfig,
  getOniaCenterRuntime,
  isOniaCenterConfigured,
} from "@/lib/onia-center-store";
import { getOniaCenterActor } from "@/lib/onia-center-auth";
import { sergioStrictScheduleBlocks } from "@/app/onia-center/operating-source";
import { getVisibleOperatingAgents } from "@/app/onia-center/operating-engine";
import { AppShell } from "@/app/onia-center/components/shell/AppShell";
import { HoyView } from "@/app/onia-center/components/views/hoy/HoyView";
import { EmptyState } from "@/app/onia-center/components/ui/EmptyState";

export const dynamic = "force-dynamic";

async function buildAuthRequest(): Promise<Request> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return new Request("https://onia-center.internal/onia-center/next/hoy", {
    headers: { cookie: cookieHeader },
  });
}

export default async function HoyPage() {
  if (!isOniaCenterConfigured()) {
    return (
      <AppShell>
        <EmptyState
          title="Falta configurar Supabase"
          body={`ONIA Center necesita estas variables de entorno: ${getMissingOniaCenterConfig().join(", ")}.`}
        />
      </AppShell>
    );
  }

  const auth = await getOniaCenterActor(await buildAuthRequest());
  if (!auth.ok) {
    return (
      <AppShell>
        <EmptyState title="No se pudo verificar tu sesion" body={auth.message} />
      </AppShell>
    );
  }

  const runtime = filterOniaCenterRuntimeForActor(await getOniaCenterRuntime(), auth.actor);
  const visibleAgents = getVisibleOperatingAgents(auth.actor.role);

  return (
    <AppShell>
      <HoyView
        agents={visibleAgents}
        reviews={runtime.reviews}
        scheduleBlocks={sergioStrictScheduleBlocks}
        referenceDate={new Date()}
      />
    </AppShell>
  );
}
```

- [ ] **Step 2: Type-check**

Run (from `web-factory/apps/site/`): `npx tsc --noEmit`
Expected: no errors referencing this file.

- [ ] **Step 3: Commit**

```bash
git add web-factory/apps/site/src/app/onia-center/next/hoy/page.tsx
git commit -m "feat(onia-center): wire /onia-center/next/hoy to real agent, review and schedule data"
```

---

## Task 12: Route index redirect + empty-state stubs for Pipeline/Agentes/Negocio

**Files:**
- Create: `web-factory/apps/site/src/app/onia-center/next/page.tsx`
- Create: `web-factory/apps/site/src/app/onia-center/next/pipeline/page.tsx`
- Create: `web-factory/apps/site/src/app/onia-center/next/agentes/page.tsx`
- Create: `web-factory/apps/site/src/app/onia-center/next/negocio/page.tsx`

- [ ] **Step 1: Create the index redirect**

```tsx
import { redirect } from "next/navigation";

export default function OniaCenterNextIndexPage() {
  redirect("/onia-center/next/hoy");
}
```

- [ ] **Step 2: Create the Pipeline stub**

```tsx
import { AppShell } from "@/app/onia-center/components/shell/AppShell";
import { EmptyState } from "@/app/onia-center/components/ui/EmptyState";

export default function PipelinePage() {
  return (
    <AppShell>
      <EmptyState
        title="Pipeline se esta portando"
        body="Leads y tareas todavia viven en el panel actual. Esta vista se conecta a los datos reales en la proxima etapa."
        linkHref="/onia-center"
        linkLabel="Ver leads y tareas en el panel actual"
      />
    </AppShell>
  );
}
```

- [ ] **Step 3: Create the Agentes stub**

```tsx
import { AppShell } from "@/app/onia-center/components/shell/AppShell";
import { EmptyState } from "@/app/onia-center/components/ui/EmptyState";

export default function AgentesPage() {
  return (
    <AppShell>
      <EmptyState
        title="Agentes (detalle) se esta portando"
        body="Historial de revisiones, auditoria e integraciones todavia viven en el panel actual. Esta vista se conecta a los datos reales en la proxima etapa."
        linkHref="/onia-center"
        linkLabel="Ver el detalle en el panel actual"
      />
    </AppShell>
  );
}
```

- [ ] **Step 4: Create the Negocio stub**

```tsx
import { AppShell } from "@/app/onia-center/components/shell/AppShell";
import { EmptyState } from "@/app/onia-center/components/ui/EmptyState";

export default function NegocioPage() {
  return (
    <AppShell>
      <EmptyState
        title="Negocio se esta portando"
        body="Proyectos, colaboradores, inventario y organizaciones todavia viven en el panel actual. Esta vista se conecta a los datos reales en la proxima etapa."
        linkHref="/onia-center"
        linkLabel="Ver el detalle en el panel actual"
      />
    </AppShell>
  );
}
```

- [ ] **Step 5: Type-check**

Run (from `web-factory/apps/site/`): `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add web-factory/apps/site/src/app/onia-center/next/page.tsx web-factory/apps/site/src/app/onia-center/next/pipeline/page.tsx web-factory/apps/site/src/app/onia-center/next/agentes/page.tsx web-factory/apps/site/src/app/onia-center/next/negocio/page.tsx
git commit -m "feat(onia-center): add next/ index redirect and honest empty-state stubs"
```

---

## Task 13: Full verification pass

**Files:** none created — this task only runs checks.

- [ ] **Step 1: Full type-check**

Run (from `web-factory/apps/site/`): `npx tsc --noEmit`
Expected: no errors anywhere in the project (confirms the new tree didn't break anything already there).

- [ ] **Step 2: Run the unit tests**

Run (from `web-factory/`): `pnpm test`
Expected: all tests pass, including the 8 in `schedule-helpers.test.ts`.

- [ ] **Step 3: Start the dev server and render every new route**

Use the project's preview tooling (`preview_start` against the `site` dev server) or, if unavailable, `pnpm --filter site dev` from `web-factory/`. Visit, in order:

- `/onia-center/next` — expect an immediate redirect to `/onia-center/next/hoy`.
- `/onia-center/next/hoy` — expect the shell (topbar with 4 tabs, "Hoy" active) plus one of:
  - If Supabase env vars are not set locally: the "Falta configurar Supabase" empty state, still a 200 render (no crash).
  - If logged in as Sergio against a real Supabase instance: today's schedule blocks, the 6-agent roster with tone badges, and the pending-review count.
- `/onia-center/next/pipeline`, `/onia-center/next/agentes`, `/onia-center/next/negocio` — expect the shell with the matching honest empty-state copy and a working link back to `/onia-center`.

Check `preview_console_logs` / browser devtools for errors on each route.

- [ ] **Step 4: Confirm middleware protection carries over**

This only proves something when Supabase env vars **are** configured (otherwise middleware intentionally no-ops — see `oniaCenterAuthConfigured()` in `middleware.ts`). With env vars set, an unauthenticated request to `/onia-center/next/hoy` must redirect (307) to `/onia-center/login?reason=auth_required&next=%2Fonia-center%2Fnext%2Fhoy` — same behavior as the existing `/onia-center` route, since both are covered by the same `matcher: ["/onia-center/:path*"]`.

- [ ] **Step 5: Code review**

Run the `code-reviewer` agent against the full diff (`git diff main...HEAD` or equivalent) before merging. Focus areas: no accidental edits to `operating-workspace.tsx` / `onia-center.css` / `page.tsx` / `operating-source.ts` (must all still show 0 changes), and the `RuntimeReview` vs `operating-source.ts`'s `reviewQueue` naming trap called out in Task 8.

- [ ] **Step 6: Final commit (only if any fixes were made in this task)**

```bash
git add -A
git commit -m "fix(onia-center): address verification findings for the Hoy shell"
```

---

## Roadmap after this plan (Phase 2, separate plan/spec each)

1. Pipeline (leads + tasks) — replaces the `pipeline/page.tsx` stub.
2. Agentes detail (review history, audit log, integrations, feature readiness) — replaces `agentes/page.tsx`.
3. Negocio (projects, collaborators, inventory, organizations, commercial policy) + wiring `QuickCapturePanel` to real notes/ideas — replaces `negocio/page.tsx`.
4. Phase 3 swap: point `page.tsx` at the same tree `next/hoy` renders, delete `next/`, then delete `operating-workspace.tsx` + `onia-center.css` + the old `page.tsx` + whatever is left unused in `operating-source.ts`.
