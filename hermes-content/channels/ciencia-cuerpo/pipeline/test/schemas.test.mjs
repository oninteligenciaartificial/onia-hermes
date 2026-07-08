import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseResearchBrief,
  parseShotList,
  parseMetadata,
} from "../schemas.mjs";

function baseBrief(overrides = {}) {
  return {
    topic_id: "01",
    slug: "azucar-y-el-cerebro",
    title_working: "Que le hace el azucar a tu cerebro",
    angle_thesis: "El azucar activa el circuito dopaminergico mesolimbico",
    audience: "adultos hispanohablantes curiosos",
    ymyl_sensitive_topic: false,
    key_claims: [
      {
        claim: "El azucar eleva dopamina en el nucleo accumbens",
        source_title: "Sugars and Sweet Taste: Addictive or Rewarding?",
        source_url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8468293/",
        source_publisher: "NIH/PMC",
        verified_date: "2026-07-08",
      },
    ],
    disclaimer_required: true,
    fact_check: { status: "passed" },
    ...overrides,
  };
}

test("research brief valido pasa y exige URL real por fuente", () => {
  const out = parseResearchBrief(baseBrief());
  assert.equal(out.key_claims[0].source_url.startsWith("https://"), true);
});

test("research brief sin fuentes falla", () => {
  assert.throws(() => parseResearchBrief(baseBrief({ key_claims: [] })));
});

test("research brief con fuente sin URL valida falla", () => {
  assert.throws(() =>
    parseResearchBrief(
      baseBrief({
        key_claims: [
          {
            claim: "x",
            source_title: "x",
            source_url: "no-es-una-url",
            source_publisher: "x",
            verified_date: "2026-07-08",
          },
        ],
      }),
    ),
  );
});

test("research brief con disclaimer_required=false falla (regla dura)", () => {
  assert.throws(() => parseResearchBrief(baseBrief({ disclaimer_required: false })));
});

function baseMetadata(overrides = {}) {
  return {
    content_id: "c1",
    title_options: ["t1", "t2"],
    description: "d",
    disclaimer_text:
      "Este video es contenido educativo y no reemplaza el consejo de un profesional de la salud.",
    sources_in_description: [{ n: 1, title: "t", url: "https://example.com" }],
    thumbnail_brief: "tb",
    language: "es",
    category: "Education",
    made_for_kids: false,
    contains_synthetic_media: true,
    privacy_status_initial: "private",
    ...overrides,
  };
}

test("metadata valida aplica defaults", () => {
  const out = parseMetadata(baseMetadata());
  assert.deepEqual(out.tags, []);
});

test("metadata con made_for_kids=true falla (regla dura)", () => {
  assert.throws(() => parseMetadata(baseMetadata({ made_for_kids: true })));
});

test("metadata con privacy_status_initial=public falla (regla dura)", () => {
  assert.throws(() =>
    parseMetadata(baseMetadata({ privacy_status_initial: "public" })),
  );
});

test("metadata con contains_synthetic_media=false falla (regla dura del canal)", () => {
  assert.throws(() =>
    parseMetadata(baseMetadata({ contains_synthetic_media: false })),
  );
});

test("shot list valida calcula defaults", () => {
  const sl = {
    topic_id: "01",
    video_slug: "azucar-y-el-cerebro",
    style_guide: {
      palette: "azul/naranja tipo Kurzgesagt",
      line_style: "ilustracion plana",
      reused_assets_ref: "pipeline/asset-library/",
    },
    shots: [
      {
        n: 1,
        script_ref: "Hook",
        seconds: 8,
        type: "hero_clip",
        description: "Neurona liberando dopamina, estilo abstracto",
        higgsfield_model: "kling3_0_turbo",
        higgsfield_prompt:
          "abstract neuron releasing glowing particles, flat illustration style",
        negative_prompt: "no fotorrealismo, no texto, no logos",
        estimated_credits: 56,
      },
    ],
    totals: { still_count: 0, hero_clip_count: 1, estimated_credits_total: 56 },
  };
  const out = parseShotList(sl);
  assert.equal(out.shots[0].reuse_from_library, false);
});

test("shot list sin shots falla", () => {
  assert.throws(() =>
    parseShotList({
      topic_id: "01",
      video_slug: "x",
      style_guide: { palette: "x", line_style: "x", reused_assets_ref: "x" },
      shots: [],
      totals: { still_count: 0, hero_clip_count: 0, estimated_credits_total: 0 },
    }),
  );
});
