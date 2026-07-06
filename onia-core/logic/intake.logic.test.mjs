/*
 * Tests de la logica de intake (core). Run:
 *   node --test onia-core/logic/intake.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  findChannel,
  intakeDedupeKey,
  isDuplicateIntake,
  isRegisteredChannel,
  normalizeIntake,
  resolveAssignee,
} from "./intake.logic.mjs";

const channels = [
  {
    id: "ch1",
    organizationId: "org1",
    channelType: "email",
    address: "ventas@empresa.bo",
    routedAreaId: "ventas",
    routingRule: "round_robin",
    intakeWorkItemType: "mensaje_correo",
  },
  {
    id: "ch2",
    organizationId: "org1",
    channelType: "whatsapp",
    address: "+591700",
    routedAreaId: "recepcion",
    routingRule: "fixed_owner",
    ownerId: "u-reception",
  },
];

describe("gobernanza de canales", () => {
  it("encuentra canales registrados y marca los no registrados", () => {
    assert.equal(findChannel(channels, "email", "ventas@empresa.bo")?.id, "ch1");
    assert.equal(isRegisteredChannel(channels, "email", "ventas@empresa.bo"), true);
    assert.equal(isRegisteredChannel(channels, "email", "otro@empresa.bo"), false);
  });
});

describe("dedupe de intake (contacto + canal, 24h)", () => {
  const now = "2026-07-05T12:00:00.000Z";
  const existing = [
    { organizationId: "org1", channelId: "ch1", partnerId: "p1", createdAt: "2026-07-05T02:00:00.000Z" },
  ];

  it("misma clave dentro de la ventana es duplicado", () => {
    const candidate = { organizationId: "org1", channelId: "ch1", partnerId: "p1" };
    assert.equal(isDuplicateIntake(existing, candidate, { now }), true);
  });

  it("otro contacto o fuera de la ventana no es duplicado", () => {
    assert.equal(
      isDuplicateIntake(existing, { organizationId: "org1", channelId: "ch1", partnerId: "p2" }, { now }),
      false,
    );
    const old = [{ organizationId: "org1", channelId: "ch1", partnerId: "p1", createdAt: "2026-07-01T00:00:00.000Z" }];
    assert.equal(isDuplicateIntake(old, { organizationId: "org1", channelId: "ch1", partnerId: "p1" }, { now }), false);
  });

  it("la clave combina org, canal y contacto", () => {
    assert.equal(intakeDedupeKey({ organizationId: "org1", channelId: "ch1", partnerId: "p1" }), "org1:ch1:p1");
  });
});

describe("ruteo y asignacion", () => {
  it("fixed_owner asigna al dueno del canal", () => {
    assert.equal(resolveAssignee(channels[1], [], {}), "u-reception");
  });

  it("round_robin asigna al miembro con menor carga", () => {
    const assignee = resolveAssignee(channels[0], ["a", "b", "c"], { a: 3, b: 1, c: 2 });
    assert.equal(assignee, "b");
  });

  it("round_robin sin miembros cae al owner o null", () => {
    assert.equal(resolveAssignee({ routingRule: "round_robin", ownerId: "x" }, [], {}), "x");
    assert.equal(resolveAssignee({ routingRule: "round_robin" }, [], {}), null);
  });
});

describe("normalizacion a WorkItem", () => {
  it("usa el tipo del canal, area de ruteo y defaults", () => {
    const draft = normalizeIntake(
      { from: "cliente@x.com", payload: { asunto: "cotizacion" } },
      channels[0],
      { now: "2026-07-05T12:00:00.000Z" },
    );
    assert.equal(draft.type, "mensaje_correo");
    assert.equal(draft.areaId, "ventas");
    assert.equal(draft.channelId, "ch1");
    assert.equal(draft.status, "open");
    assert.equal(draft.priority, "normal");
    assert.equal(draft.createdAt, "2026-07-05T12:00:00.000Z");
  });

  it("respeta type/priority sugeridos", () => {
    const draft = normalizeIntake({ type: "lead_formulario", priority: "high" }, channels[1]);
    // el canal no define intakeWorkItemType -> usa el sugerido
    assert.equal(draft.type, "lead_formulario");
    assert.equal(draft.priority, "high");
  });
});
