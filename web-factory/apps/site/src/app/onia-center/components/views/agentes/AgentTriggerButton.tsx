"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AgentTriggerButtonProps {
  agentId: string;
  agentName: string;
}

type Feedback = { tone: "ok" | "warn" | "error"; text: string };

export function AgentTriggerButton({ agentId, agentName }: AgentTriggerButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function trigger() {
    setBusy(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/onia-center/agents/trigger", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agentId }),
      });
      const body = (await response.json()) as { ok?: boolean; mode?: string; message?: string };

      if (body.ok) {
        setFeedback({ tone: "ok", text: body.message ?? `${agentName} disparado.` });
        router.refresh();
      } else if (body.mode === "webhook_not_configured") {
        setFeedback({ tone: "warn", text: body.message ?? "Agente sin webhook configurado." });
      } else {
        setFeedback({ tone: "error", text: body.message ?? "No se pudo disparar el agente." });
      }
    } catch {
      setFeedback({ tone: "error", text: "Error de red, reintenta." });
    } finally {
      setBusy(false);
    }
  }

  const toneClass =
    feedback?.tone === "ok"
      ? "text-primary"
      : feedback?.tone === "warn"
        ? "text-muted-foreground"
        : "text-destructive";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={trigger}
        className="h-7 rounded-md border border-border bg-card px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
      >
        {busy ? "Disparando..." : "Disparar"}
      </button>
      {feedback ? <span className={`text-xs ${toneClass}`}>{feedback.text}</span> : null}
    </div>
  );
}
