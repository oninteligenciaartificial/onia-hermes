import type { ReactNode } from "react";
import "../../styles/tokens.css";
import { TopNav } from "./TopNav";
import { QuickCapturePanel } from "./QuickCapturePanel";
import { AssistantChatPanel } from "./AssistantChatPanel";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-6">
        <span className="text-[15px] font-semibold tracking-tight">ONIA Center</span>
        <TopNav />
        <div className="flex items-center gap-2">
          <AssistantChatPanel />
          <QuickCapturePanel />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
