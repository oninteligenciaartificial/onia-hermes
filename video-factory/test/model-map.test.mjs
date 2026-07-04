import { test } from "node:test";
import assert from "node:assert/strict";
import { mapModel } from "../engine/higgsfield/model-map.mjs";

test("marketing_studio_video mapea a modo ugc 720p", () => {
  const { model, params } = mapModel({ engine_model: "marketing_studio_video", aspect_ratio: "9:16", duration_s: 15, generate_audio: false });
  assert.equal(model, "marketing_studio_video");
  assert.equal(params.mode, "ugc");
  assert.equal(params.resolution, "720p");
  assert.equal(params.aspect_ratio, "9:16");
});

test("seedance_2_0 mapea a modo std 720p", () => {
  const { params } = mapModel({ engine_model: "seedance_2_0", aspect_ratio: "9:16", duration_s: 8, generate_audio: false });
  assert.equal(params.mode, "std");
  assert.equal(params.duration, 8);
});

test("modelo sin override conserva params base", () => {
  const { params } = mapModel({ engine_model: "veo3_1_lite", aspect_ratio: "9:16", duration_s: 6, generate_audio: true });
  assert.equal(params.generate_audio, true);
  assert.equal(params.mode, undefined);
});
