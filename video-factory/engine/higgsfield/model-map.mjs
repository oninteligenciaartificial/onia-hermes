const OVERRIDES = {
  marketing_studio_video: { mode: "ugc", resolution: "720p" },
  seedance_2_0: { mode: "std", resolution: "720p" },
};

export function mapModel(format) {
  const params = {
    aspect_ratio: format.aspect_ratio,
    duration: format.duration_s,
    generate_audio: format.generate_audio,
    ...(OVERRIDES[format.engine_model] ?? {}),
  };
  return { model: format.engine_model, params };
}
