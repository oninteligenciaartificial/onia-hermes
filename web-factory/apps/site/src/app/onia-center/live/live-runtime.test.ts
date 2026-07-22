import { describe, expect, it } from "vitest";
import {
  countActiveAgents,
  mergeLiveAgentStatus,
  parseReviewBody,
  selectLiveInfoByAgentId,
  toContentPipelineCounts,
  type LiveAgentStatus,
} from "./live-runtime";
import type { OperatingAgent } from "@/app/onia-center/types";

function liveStatus(overrides: Partial<LiveAgentStatus> = {}): LiveAgentStatus {
  return { status: "ready", lastRunAt: null, live: false, cadenceLabel: null, ...overrides };
}

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
      agent_finance_fund: liveStatus({ status: "ready", lastRunAt: "2026-07-09T11:15:00Z", live: true }),
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
      agent_finance_fund: liveStatus({ status: "ready" }),
    };

    mergeLiveAgentStatus(agents, live);
    expect(agents[0].status).toBe("prepared_pending_connection");
  });
});

describe("selectLiveInfoByAgentId", () => {
  it("reindexes the underscore live map back to the agent hyphen id", () => {
    const agents = [makeAgent("agent-finance-fund", "ready")];
    const live: Record<string, LiveAgentStatus> = {
      agent_finance_fund: liveStatus({ live: true, cadenceLabel: "Lun+Jue 07:40" }),
    };

    const byId = selectLiveInfoByAgentId(agents, live);
    expect(byId["agent-finance-fund"]?.cadenceLabel).toBe("Lun+Jue 07:40");
  });

  it("omits agents without a live row", () => {
    const agents = [makeAgent("agent-ceo-monthly", "planned")];
    expect(selectLiveInfoByAgentId(agents, {})).toEqual({});
  });
});

describe("countActiveAgents", () => {
  it("counts agents flagged live=true", () => {
    const agents = [makeAgent("agent-a", "ready"), makeAgent("agent-b", "ready")];
    const live: Record<string, LiveAgentStatus> = {
      agent_a: liveStatus({ live: true }),
    };
    expect(countActiveAgents(agents, live)).toBe(1);
  });

  it("falls back to counting ready agents when none are flagged live", () => {
    const agents = [makeAgent("agent-a", "ready"), makeAgent("agent-b", "planned")];
    expect(countActiveAgents(agents, {})).toBe(1);
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

describe("toContentPipelineCounts", () => {
  it("returns null when neither list could be read (no config or error)", () => {
    expect(toContentPipelineCounts(null, null)).toBeNull();
  });

  it("counts each list length when both were read", () => {
    expect(toContentPipelineCounts([{}, {}, {}], [{}])).toEqual({
      ideasPending: 3,
      draftsPending: 1,
    });
  });

  it("treats an empty list as a real zero, not as missing data", () => {
    expect(toContentPipelineCounts([], [])).toEqual({
      ideasPending: 0,
      draftsPending: 0,
    });
  });

  it("falls back to zero for the list that failed while keeping the one that read", () => {
    expect(toContentPipelineCounts([{}, {}], null)).toEqual({
      ideasPending: 2,
      draftsPending: 0,
    });
    expect(toContentPipelineCounts(null, [{}, {}, {}, {}])).toEqual({
      ideasPending: 0,
      draftsPending: 4,
    });
  });
});
