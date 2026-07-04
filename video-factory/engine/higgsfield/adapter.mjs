const CREDIT_RATE = {
  marketing_studio_video: 8,
  seedance_2_0: 5,
  seedance_2_0_mini: 3,
  veo3_1_lite: 4,
  kling3_0: 9,
};

export function estimateCost({ model, duration_s }) {
  const rate = CREDIT_RATE[model];
  if (rate == null) throw new Error(`estimateCost: modelo desconocido ${model}`);
  return Math.ceil(rate * duration_s);
}

export function createHiggsfieldAdapter({ runtime } = {}) {
  return {
    estimateCost,
    async generate(job) {
      if (!runtime) return { ok: false, reason: "engine_runtime_required", job };
      return runtime.generate(job);
    },
    async getStatus(id) {
      if (!runtime) return { id, status: "unknown", reason: "engine_runtime_required" };
      return runtime.getStatus(id);
    },
  };
}
