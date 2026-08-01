import type { ReactNode } from "react";
import "../../styles/tokens.css";
import { TopNav } from "./TopNav";
import { QuickCapturePanel } from "./QuickCapturePanel";
import { AssistantChatPanel } from "./AssistantChatPanel";

interface AppShellProps {
  children: ReactNode;
  /** Oculta la pestana Finanzas para roles sin acceso (seller/freelancer). */
  canSeeFinance?: boolean;
  /** Nombre del actor en sesion: alimenta el avatar del nav (inicial). Opcional. */
  actorName?: string;
}

function initial(name?: string): string {
  const clean = (name ?? "").trim();
  return clean ? clean[0].toUpperCase() : "·";
}

export function AppShell({ children, canSeeFinance = true, actorName }: AppShellProps) {
  return (
    <div className="onia-panel min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 flex h-14 items-center gap-5 border-b border-border bg-card px-5 sm:px-[22px]">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid h-6 w-6 place-items-center rounded-[7px] text-[13px] font-bold text-primary-foreground"
            style={{ background: "linear-gradient(150deg, var(--primary), var(--accent-strong))" }}
          >
            O
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Onia Center</span>
        </div>
        <TopNav canSeeFinance={canSeeFinance} />
        <div className="ml-auto flex items-center gap-2">
          <AssistantChatPanel />
          <QuickCapturePanel />
          <span
            aria-hidden="true"
            title={actorName}
            className="grid h-7 w-7 place-items-center rounded-full text-xs font-bold onia-center-tone-green"
          >
            {initial(actorName)}
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-5 py-9 sm:px-6">{children}</main>
    </div>
  );
}
