import type { OperatingAgent } from "@/app/onia-center/types";
import type { RuntimeReview } from "@/lib/onia-center-store";
import type { AgentRunEntry, IntegrationConnector } from "@/app/onia-center/live/live-runtime";
import { AgentDetailPanel } from "./AgentDetailPanel";
import { AgentRunFeedPanel } from "./AgentRunFeedPanel";
import { ReviewHistoryPanel } from "./ReviewHistoryPanel";
import { IntegrationsPanel } from "./IntegrationsPanel";

interface AgentesViewProps {
  agents: OperatingAgent[];
  lastRuns: Record<string, string | null>;
  reviews: RuntimeReview[];
  integrations: IntegrationConnector[];
  feed: AgentRunEntry[];
  canTrigger: boolean;
}

export function AgentesView({ agents, lastRuns, reviews, integrations, feed, canTrigger }: AgentesViewProps) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        <AgentDetailPanel agents={agents} lastRuns={lastRuns} canTrigger={canTrigger} />
        <ReviewHistoryPanel reviews={reviews} />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        <IntegrationsPanel integrations={integrations} />
        <AgentRunFeedPanel feed={feed} />
      </div>
    </div>
  );
}
