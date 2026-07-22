import type { ReactNode } from "react";
import "../../styles/tokens.css";
import { TopNav } from "./TopNav";
import { QuickCapturePanel } from "./QuickCapturePanel";
import { AssistantChatPanel } from "./AssistantChatPanel";

interface AppShellProps {
  children: ReactNode;
  /** Oculta la pestana Finanzas para roles sin acceso (seller/freelancer). */
  canSeeFinance?: boolean;
}

export function AppShell({ children, canSeeFinance = true }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-6 border-b border-border bg-card/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <span className="text-[15px] font-semibold tracking-tight">ONIA Center</span>
        <TopNav canSeeFinance={canSeeFinance} />
        <div className="flex items-center gap-2">
          <AssistantChatPanel />
          <QuickCapturePanel />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
