// Logica de scoring del radar Maquina Humana. Pura y testeable (sin red, sin gasto).
// Puntua cada item RSS contra los temas del canal (cuerpo + mente, marco "rendi mejor")
// y lo mapea a una sugerencia de estilo/modelo. NO decide producir: solo propone;
// el gate humano y el research-brief (fuente real) siguen despues. Ver PLAN.md #4.

// Temas del canal. Cada uno con su gancho-template y palabras clave (es/en).
export const THEMES = [
  {
    key: "foco",
    label: "Foco / atencion",
    hook: "Por que no te podes concentrar",
    keywords: ["attention", "atencion", "focus", "concentr", "distrac", "multitask", "task switch", "task-switch", "cognitive control", "working memory"],
  },
  {
    key: "sueno",
    label: "Sueno / energia",
    hook: "Por que rendis mal sin dormir",
    keywords: ["sleep", "sueno", "insomnia", "circadian", "circadiano", "melatonin", "fatigue", "fatiga", "glymphatic", "rem sleep"],
  },
  {
    key: "estres",
    label: "Estres",
    hook: "Por que rendis peor bajo presion",
    keywords: ["stress", "estres", "cortisol", "anxiety", "ansiedad", "hpa axis", "burnout", "pressure"],
  },
  {
    key: "motivacion",
    label: "Motivacion / recompensa",
    hook: "Por que arrancas y despues abandonas",
    keywords: ["dopamine", "dopamina", "motivation", "motivac", "reward", "recompensa", "craving", "addict", "adicc", "reinforc"],
  },
  {
    key: "habitos",
    label: "Habitos",
    hook: "Por que un habito se pega y cuesta romperlo",
    keywords: ["habit ", "habits", "habitual", "habito", "habitos", "habit loop", "basal ganglia", "routine", "rutina", "behavior change", "conducta"],
  },
  {
    key: "aprendizaje",
    label: "Memoria / aprendizaje",
    hook: "Como tu cerebro fija lo que aprendes",
    keywords: ["memory", "memoria", "learning", "aprendiz", "hippocamp", "hipocamp", "plasticity", "plasticidad", "neuron", "neurona", "synap", "sinap"],
  },
  {
    key: "emociones",
    label: "Emociones / miedo",
    hook: "Que pasa en tu cerebro cuando tenes miedo",
    keywords: ["fear", "miedo", "amygdala", "amigdala", "emotion", "emocion", "mood", "animo", "depress", "depres"],
  },
  {
    key: "cuerpo",
    label: "Cuerpo / rendimiento fisico",
    hook: "Como funciona tu cuerpo por dentro",
    keywords: ["muscle", "musculo", "exercise", "ejercicio", "metabol", "immune", "inmune", "microbiome", "microbioma", "aging", "envejec", "gut", "intestino", "hormone", "hormona"],
  },
];

// Palabras que suben el "gancho de rendimiento / curiosidad" (marco rendi mejor).
export const PERF_WORDS = [
  "performance", "rendimiento", "productiv", "better", "mejor", "brain", "cerebro",
  "mind", "mente", "why", "por que", "how ", "como ", "boost", "improve", "energy", "energia",
];

// Palabras que marcan riesgo YMYL / consejo-tratamiento: NO descartan, FLAGGEAN.
// Un item asi necesita 2 fuentes + encuadre extra-cuidado (mecanismo, nunca receta).
export const YMYL_WORDS = [
  "treatment", "tratamiento", "cure", "cura", "therapy", "terapia", "drug", "farmaco",
  "clinical trial", "ensayo clinico", "disease", "enfermedad", "cancer", "diagnos",
  "symptom", "sintoma", "patient", "paciente", "vaccine", "vacuna", "supplement",
  "suplemento", "diet", "dieta", "dose", "dosis", "medication", "medicac",
];

function haystack(item) {
  return `${item.title || ""} ${item.summary || item.contentSnippet || ""}`.toLowerCase();
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Match por limite de palabra izquierdo (prefijo): "circadian" cae en "circadiano",
// pero "nap" NO cae dentro de "synaptic". Evita falsos positivos por substring.
function hasKeyword(hay, keyword) {
  return new RegExp("\\b" + escapeRegExp(keyword)).test(hay);
}

export function daysOld(pubDate, now = Date.now()) {
  const t = pubDate ? new Date(pubDate).getTime() : NaN;
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((now - t) / 86400000));
}

// Puntua un item. Devuelve el desglose para que el digest sea explicable.
export function scoreItem(item, now = Date.now()) {
  const hay = haystack(item);

  // Cuenta hits por tema y ordena por cantidad (desc). El tema con mas
  // coincidencias gana como topTheme (empate -> orden de THEMES). Asi el gancho
  // sugerido es el mas certero, no el primero que aparezca en la lista.
  const matchedThemes = THEMES.map((theme) => ({
    theme,
    hits: theme.keywords.filter((k) => hasKeyword(hay, k)).length,
  }))
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .map((x) => x.theme);
  const themeScore = matchedThemes.length * 10;

  const perfHits = PERF_WORDS.filter((w) => hasKeyword(hay, w));
  const perfScore = Math.min(perfHits.length, 4) * 2;

  const ymylHits = YMYL_WORDS.filter((w) => hasKeyword(hay, w));
  const ymylSensitive = ymylHits.length > 0;

  const age = daysOld(item.pubDate, now);
  const recencyScore = age === null ? 0 : Math.max(0, 14 - age) * 0.5;

  const score = themeScore + perfScore + recencyScore;

  return {
    score: Math.round(score * 10) / 10,
    matchedThemes: matchedThemes.map((t) => t.key),
    topTheme: matchedThemes[0] || null,
    perfHits,
    ymylSensitive,
    ymylHits,
    ageDays: age,
    breakdown: { themeScore, perfScore, recencyScore: Math.round(recencyScore * 10) / 10 },
  };
}

// Un item CALIFICA para el shortlist si toca al menos un tema del canal.
export function qualifies(scored) {
  return scored.matchedThemes.length >= 1;
}

// Mapea un item calificado a una entrada de shortlist para el gate humano.
export function mapToChannel(item, scored, snapshot) {
  const theme = scored.topTheme;
  return {
    raw_headline: item.title || "",
    source_lead: {
      link: item.link || "",
      publisher: item.publisher || item.feedName || "",
      pub_date: item.pubDate || "",
    },
    matched_theme: theme ? theme.key : null,
    matched_theme_label: theme ? theme.label : null,
    all_matched_themes: scored.matchedThemes,
    title_hook_suggestion: theme ? theme.hook : null,
    ymyl_sensitive: scored.ymylSensitive,
    ymyl_flags: scored.ymylHits,
    // REGLA DURA: el item RSS es un lead, no la fuente final. El research-brief
    // debe encontrar el paper peer-reviewed / NIH / OMS antes de producir.
    needs_source_verification: true,
    suggested_style_preset_id: snapshot.default_style_preset_id,
    suggested_style_title: snapshot.default_style_title,
    suggested_models: {
      stills: snapshot.recommended_models?.stills?.id ?? null,
      hero_clip: snapshot.recommended_models?.hero_clip?.id ?? null,
    },
    est_credits: snapshot.est_credits_per_video_benchmark ?? null,
    score: scored.score,
    score_breakdown: scored.breakdown,
  };
}
