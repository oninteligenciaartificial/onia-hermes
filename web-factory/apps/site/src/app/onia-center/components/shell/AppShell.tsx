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
