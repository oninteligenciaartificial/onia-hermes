import type { OperatingAgent } from "@/app/onia-center/types";
import type { RuntimeReview } from "@/lib/onia-center-store";
import { EmptyState } from "../../ui/EmptyState";
import { AgentDetailPanel } from "./AgentDetailPanel";
import { ReviewHistoryPanel } from "./ReviewHistoryPanel";

interface AgentesViewProps {
  agents: OperatingAgent[];
  lastRuns: Record<string, string | null>;
  reviews: RuntimeReview[];
}

export function AgentesView({ agents, lastRuns, reviews }: AgentesViewProps) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        <AgentDetailPanel agents={agents} lastRuns={lastRuns} />
        <ReviewHistoryPanel reviews={reviews} />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        <EmptyState
          title="Auditoria se esta portando"
          body="El registro de auditoria en vivo todavia no lo escribe el motor. Cuando el carril Motor agregue la tabla de auditoria, esta seccion se llena sola."
        />
        <EmptyState
          title="Integraciones se estan portando"
          body="El estado en vivo de las integraciones (WhatsApp, n8n, calendario) todavia no lo escribe el motor. Se conecta cuando el carril Motor publique esa tabla."
        />
      </div>
    </div>
  );
}
