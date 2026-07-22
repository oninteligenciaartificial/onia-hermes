import type { OperatingAgent } from "@/app/onia-center/types";
import type { RuntimeReview } from "@/lib/onia-center-store";
import type { AgentRunEntry, IntegrationConnector, LiveAgentStatus } from "@/app/onia-center/live/live-runtime";
import { AgentDetailPanel } from "./AgentDetailPanel";
import { AgentRunFeedPanel } from "./AgentRunFeedPanel";
import { ReviewHistoryPanel } from "./ReviewHistoryPanel";
import { IntegrationsPanel } from "./IntegrationsPanel";

interface AgentesViewProps {
  agents: OperatingAgent[];
  liveInfo: Record<string, LiveAgentStatus>;
  reviews: RuntimeReview[];
  integrations: IntegrationConnector[];
  feed: AgentRunEntry[];
  canTrigger: boolean;
}

export function AgentesView({ agents, liveInfo, reviews, integrations, feed, canTrigger }: AgentesViewProps) {
  return (
    <div className="grid gap-6">
      <header className="grid gap-1">
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Agentes</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Tu equipo autónomo: qué corre solo y cada cuánto, qué está en preparación y qué integraciones faltan conectar.
        </p>
      </header>
      <div className="grid items-start gap-6 lg:grid-cols-[repeat(auto-fit,minmax(340px,1fr))]">
        <AgentDetailPanel agents={agents} liveInfo={liveInfo} canTrigger={canTrigger} />
        <ReviewHistoryPanel reviews={reviews} />
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[repeat(auto-fit,minmax(340px,1fr))]">
        <IntegrationsPanel integrations={integrations} />
        <AgentRunFeedPanel feed={feed} />
      </div>
    </div>
  );
}
