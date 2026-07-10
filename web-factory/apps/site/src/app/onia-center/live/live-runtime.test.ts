import { describe, expect, it } from "vitest";
import { mergeLiveAgentStatus, parseReviewBody, type LiveAgentStatus } from "./live-runtime";
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

describe("parseReviewBody", () => {
  it("extracts a content_script body", () => {
    const raw = {
      agent: "content-media-agent-v1",
      kind: "content_script",
      script: { format: "reel", pillar: "automatizacion", hook: "Enganche", body: "Cuerpo del guion", cta: "Segui" },
    };
    expect(parseReviewBody(raw)).toEqual({
      kind: "content_script",
      format: "reel",
      pillar: "automatizacion",
      hook: "Enganche",
      body: "Cuerpo del guion",
      cta: "Segui",
    });
  });

  it("extracts a content_carousel body with string slides", () => {
    const raw = {
      kind: "content_carousel",
      carousel: { title: "Titulo", slides: ["Slide 1", "Slide 2"], cta: "Guardalo" },
    };
    expect(parseReviewBody(raw)).toEqual({
      kind: "content_carousel",
      title: "Titulo",
      cta: "Guardalo",
      slides: ["Slide 1", "Slide 2"],
    });
  });

  it("maps object slides to text and drops empties", () => {
    const raw = {
      kind: "content_carousel",
      carousel: { slides: [{ text: "Uno" }, { title: "Dos" }, ""] },
    };
    const parsed = parseReviewBody(raw);
    expect(parsed?.slides).toEqual(["Uno", "Dos"]);
  });

  it("returns null for an unknown kind", () => {
    expect(parseReviewBody({ kind: "lead", raw: {} })).toBeNull();
  });

  it("returns null for non-object input", () => {
    expect(parseReviewBody(null)).toBeNull();
    expect(parseReviewBody("x")).toBeNull();
  });
});
