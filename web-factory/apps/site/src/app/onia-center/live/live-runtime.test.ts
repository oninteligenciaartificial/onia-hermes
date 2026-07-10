import { describe, expect, it } from "vitest";
import { mergeLiveAgentStatus, type LiveAgentStatus } from "./live-runtime";
import type { OperatingAgent } from "@/app/onia-center/types";

function makeAgent(id: string, status: OperatingAgent["status"]): OperatingAgent {
  return {
    id,
    name: id,
    mission: "test",
    ownerRole: "sergio",
    visibility: "sergio_private",
    cadence: "daily",
    status,
    monthlyOutcome: "",
    inputs: [],
    outputs: [],
    actions: [],
    blockedBy: [],
    nextAction: "",
    safetyRule: "",
    connectorIds: [],
    toolPreference: ["manual"],
  };
}

describe("mergeLiveAgentStatus", () => {
  it("overrides the static status with the live one, mapping hyphen id to underscore key", () => {
    const agents = [makeAgent("agent-finance-fund", "prepared_pending_connection")];
    const live: Record<string, LiveAgentStatus> = {
      agent_finance_fund: { status: "ready", lastRunAt: "2026-07-09T11:15:00Z" },
    };

    const merged = mergeLiveAgentStatus(agents, live);
    expect(merged[0].status).toBe("ready");
  });

  it("keeps the static status when there is no live row for the agent", () => {
    const agents = [makeAgent("agent-ceo-monthly", "planned")];

    const merged = mergeLiveAgentStatus(agents, {});
    expect(merged[0].status).toBe("planned");
  });

  it("does not mutate the input agents", () => {
    const agents = [makeAgent("agent-finance-fund", "prepared_pending_connection")];
    const live: Record<string, LiveAgentStatus> = {
      agent_finance_fund: { status: "ready", lastRunAt: null },
    };

    mergeLiveAgentStatus(agents, live);
    expect(agents[0].status).toBe("prepared_pending_connection");
  });
});
