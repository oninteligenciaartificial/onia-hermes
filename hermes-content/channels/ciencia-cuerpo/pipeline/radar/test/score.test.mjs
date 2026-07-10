import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreItem, qualifies, mapToChannel, daysOld } from "../score.mjs";

// now fijo para que la recencia sea determinista.
const NOW = new Date("2026-07-10T00:00:00Z").getTime();

const snapshot = {
  default_style_preset_id: "5a1ae304-c541-4f11-9784-595e0f2c3d2b",
  default_style_title: "2D Illustrator",
  recommended_models: { stills: { id: "nano_banana_pro" }, hero_clip: { id: "kling3_0_turbo" } },
  est_credits_per_video_benchmark: 360,
};

test("item on-brand (atencion) califica con tema foco", () => {
  const item = {
    title: "Brain study reveals why task-switching hurts attention and focus",
    summary: "cognitive control networks and multitasking",
    pubDate: "2026-07-09",
  };
  const s = scoreItem(item, NOW);
  assert.ok(qualifies(s), "deberia calificar");
  assert.equal(s.topTheme.key, "foco");
  assert.ok(s.score > 0);
});

test("item de tratamiento/enfermedad se marca YMYL", () => {
  const item = {
    title: "Experimental drug shrinks tumors in early cancer clinical trial",
    summary: "medication reduced tumor size in patients; treatment under study",
    pubDate: "2026-07-09",
  };
  const s = scoreItem(item, NOW);
  assert.equal(s.ymylSensitive, true);
  assert.ok(s.ymylHits.length > 0);
});

test("item off-brand (exoplaneta) NO califica", () => {
  const item = {
    title: "Astronomers detect a new exoplanet orbiting a distant star",
    summary: "rocky world in the habitable zone",
    pubDate: "2026-07-09",
  };
  const s = scoreItem(item, NOW);
  assert.equal(qualifies(s), false);
});

test("recencia: mas nuevo puntua mas", () => {
  const base = { title: "dopamine motivation reward", summary: "" };
  const nuevo = scoreItem({ ...base, pubDate: "2026-07-09" }, NOW);
  const viejo = scoreItem({ ...base, pubDate: "2026-05-01" }, NOW);
  assert.ok(nuevo.score > viejo.score);
});

test("daysOld devuelve null si no hay fecha valida", () => {
  assert.equal(daysOld(undefined, NOW), null);
  assert.equal(daysOld("no-es-fecha", NOW), null);
});

test("mapToChannel arma la entrada con fuente-por-verificar y estilo default", () => {
  const item = {
    title: "How the hippocampus encodes memory through synaptic plasticity",
    summary: "long-term potentiation, learning",
    link: "https://example.org/x",
    pubDate: "2026-07-05",
    publisher: "ScienceDaily",
  };
  const s = scoreItem(item, NOW);
  const entry = mapToChannel(item, s, snapshot);
  assert.equal(entry.needs_source_verification, true);
  assert.equal(entry.suggested_style_title, "2D Illustrator");
  assert.equal(entry.matched_theme, "aprendizaje");
  assert.equal(entry.suggested_models.stills, "nano_banana_pro");
  assert.equal(entry.est_credits, 360);
});
