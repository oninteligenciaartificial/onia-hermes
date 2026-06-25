import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

type DesignReference = {
  role?: string;
  sourceName?: string;
  title?: string;
  url?: string;
  licenseStatus?: string;
  reuseGuidance?: string;
  screenshots?: Record<string, { path?: string } | undefined>;
  topFonts?: Array<{ value?: string; count?: number } | string>;
  motionSignals?: string[];
};

type CodeReference = {
  repo?: string;
  license?: string;
  status?: string;
  file?: string;
  reuseRule?: string;
  score?: number;
  signals?: {
    hasMotion?: boolean;
    hasShadcn?: boolean;
    hasTailwind?: boolean;
    imports?: string[];
    exports?: string[];
  };
};

type AutoDesignRecipe = {
  generatedAt?: string;
  client?: {
    slug?: string;
    name?: string;
    template?: string;
    inferredVertical?: string;
    verticalLabel?: string;
    verticalConfidence?: number;
    matchedKeywords?: string[];
  };
  designRead?: {
    objective?: string;
    visualDirection?: string;
    conversionThesis?: string;
    genericRisk?: string;
  };
  selectedReferences?: DesignReference[];
  codeReferences?: CodeReference[];
  sectionPlan?: Array<{ id?: string; title?: string; goal?: string; pattern?: string }>;
  mediaPlan?: {
    required?: string[];
    requestFromClient?: string[];
    fallbackAllowed?: string[];
  };
  warnings?: string[];
  confidence?: {
    score?: number;
    reasons?: string[];
  };
};

type ClientProfile = {
  nombre?: string;
  slug?: string;
  categorias?: string[];
  productos?: unknown[];
  referencias?: unknown[];
  references?: unknown[];
};

type DesignIntelligence = {
  generatedAt?: string;
  policy?: string;
  summary?: {
    sources?: number;
    examples?: number;
    screenshots?: number;
    codeBlocksFromDocs?: number;
    reusableCodeRepositories?: number;
  };
  sourceSummaries?: Array<{
    id?: string;
    name?: string;
    url?: string;
    licenseStatus?: string;
    usage?: string;
    examples?: number;
    screenshots?: number;
    codeBlocks?: number;
    animationLibraries?: string[];
    topFonts?: Array<{ value?: string; count?: number }>;
    topCtas?: Array<{ value?: string; count?: number }>;
  }>;
};

export type WebFactoryRecipeStatus = "ready" | "review" | "needs_assets" | "needs_references" | "draft";

export type WebFactoryClientRecipe = {
  slug: string;
  name: string;
  template: string;
  verticalLabel: string;
  verticalConfidence: number;
  generatedAt: string;
  status: WebFactoryRecipeStatus;
  statusLabel: string;
  confidenceScore: number;
  productCount: number;
  categoryCount: number;
  referenceCount: number;
  screenshotCount: number;
  codeReferenceCount: number;
  sectionCount: number;
  requiredMedia: string[];
  clientMediaRequests: string[];
  warnings: string[];
  matchedKeywords: string[];
  designRead: {
    objective: string;
    visualDirection: string;
    conversionThesis: string;
    genericRisk: string;
  };
  references: Array<{
    role: string;
    sourceName: string;
    title: string;
    url: string;
    licenseStatus: string;
    reuseGuidance: string;
    screenshotCount: number;
    topFonts: string[];
    motionSignals: string[];
  }>;
  codeReferences: Array<{
    repo: string;
    license: string;
    status: string;
    file: string;
    reuseRule: string;
    score: number;
    signals: string[];
  }>;
  sectionPlan: Array<{
    id: string;
    title: string;
    goal: string;
    pattern: string;
  }>;
  paths: {
    profile: string;
    recipe: string;
    markdown: string;
    context: string;
    preview: string;
  };
  artifacts: {
    hasProfile: boolean;
    hasRecipe: boolean;
    hasMarkdown: boolean;
    hasContext: boolean;
    hasPreview: boolean;
  };
  commands: {
    refreshDesign: string;
    buildPreview: string;
    smoke: string;
  };
};

export type WebFactoryCenterSnapshot = {
  generatedAt: string;
  webFactoryRoot: string;
  counts: {
    clientProfiles: number;
    designRecipes: number;
    ready: number;
    review: number;
    needsAssets: number;
    needsReferences: number;
    draft: number;
    screenshots: number;
    codeReferences: number;
    references: number;
  };
  recipes: WebFactoryClientRecipe[];
  missingRecipeProfiles: Array<{
    slug: string;
    name: string;
    profilePath: string;
    command: string;
  }>;
  intelligence: {
    generatedAt: string;
    policy: string;
    summary: {
      sources: number;
      examples: number;
      screenshots: number;
      codeBlocksFromDocs: number;
      reusableCodeRepositories: number;
    };
    path: string;
    markdownPath: string;
    topSources: Array<{
      id: string;
      name: string;
      url: string;
      licenseStatus: string;
      usage: string;
      examples: number;
      screenshots: number;
      codeBlocks: number;
      animationLibraries: string[];
      topFonts: string[];
      topCtas: string[];
    }>;
  };
  operatingCommands: Array<{
    label: string;
    command: string;
    purpose: string;
  }>;
  canonicalDocs: Array<{
    label: string;
    path: string;
  }>;
  nextActions: Array<{
    priority: "alta" | "media";
    title: string;
    detail: string;
  }>;
};

const WEB_FACTORY_ROOT = path.resolve(process.cwd(), "..", "..");
const REPO_ROOT = path.resolve(WEB_FACTORY_ROOT, "..");
const CLIENTS_DIR = path.join(WEB_FACTORY_ROOT, "data", "clients");
const DESIGN_INTELLIGENCE_PATH = path.join(
  WEB_FACTORY_ROOT,
  "data",
  "references",
  "design-sources",
  "latest-design-intelligence.json",
);
const DESIGN_INTELLIGENCE_MARKDOWN_PATH = path.join(WEB_FACTORY_ROOT, "docs", "WEB_FACTORY_DESIGN_INTELLIGENCE_LATEST.md");

export async function getWebFactoryCenterSnapshot(): Promise<WebFactoryCenterSnapshot> {
  const clientFiles = await readdirSafe(CLIENTS_DIR);
  const profileFiles = clientFiles
    .filter((file) => file.endsWith(".json") && !file.endsWith(".design.json") && !file.endsWith(".finance.json"))
    .sort((a, b) => a.localeCompare(b));
  const recipeFiles = clientFiles
    .filter((file) => file.endsWith(".design.json"))
    .sort((a, b) => a.localeCompare(b));

  const profilesBySlug = new Map<string, ClientProfile>();
  for (const profileFile of profileFiles) {
    const profilePath = path.join(CLIENTS_DIR, profileFile);
    const profile = await readJsonSafe<ClientProfile>(profilePath, {});
    profilesBySlug.set(profileFile.replace(/\.json$/, ""), profile);
  }

  const recipes = await Promise.all(
    recipeFiles.map((recipeFile) => loadClientRecipe(recipeFile, profilesBySlug.get(recipeFile.replace(/\.design\.json$/, "")))),
  );

  const recipeSlugs = new Set(recipes.map((recipe) => recipe.slug));
  const missingRecipeProfiles = profileFiles
    .map((profileFile) => {
      const slug = profileFile.replace(/\.json$/, "");
      const profile = profilesBySlug.get(slug) ?? {};
      return {
        slug,
        name: profile.nombre ?? slug,
        profilePath: toRepoPath(path.join(CLIENTS_DIR, profileFile)),
        command: `pnpm design:auto -- ${slug} --force`,
      };
    })
    .filter((profile) => !recipeSlugs.has(profile.slug));

  const intelligence = await loadDesignIntelligence();
  const counts = summarizeRecipes(recipes, profileFiles.length);

  return {
    generatedAt: new Date().toISOString(),
    webFactoryRoot: toRepoPath(WEB_FACTORY_ROOT),
    counts,
    recipes,
    missingRecipeProfiles,
    intelligence,
    operatingCommands: [
      {
        label: "Refrescar referencias",
        command: "pnpm references:harvest:daily",
        purpose: "Scrapea galerias/proyectos permitidos, toma capturas y actualiza el banco de patrones.",
      },
      {
        label: "Regenerar inteligencia",
        command: "pnpm references:intelligence",
        purpose: "Convierte capturas, fuentes, CTAs y codigo revisable en inteligencia de diseno.",
      },
      {
        label: "Crear receta de cliente",
        command: "pnpm design:auto -- <slug> --template <landing|store> --force",
        purpose: "Lee brief, referencias exactas y banco de patrones para producir una receta accionable.",
      },
      {
        label: "Construir preview",
        command: "pnpm factory:build -- <slug> --template <landing|store> --force",
        purpose: "Genera el HTML preview del cliente usando la receta y assets disponibles.",
      },
      {
        label: "Validacion rapida",
        command: "pnpm factory:smoke",
        purpose: "Recompila demos principales y evita romper el flujo base de Web Factory.",
      },
    ],
    canonicalDocs: [
      { label: "Runbook operativo", path: "web-factory/docs/WEB_FACTORY_OPERATING_RUNBOOK_20260625.md" },
      { label: "Captura de referencias", path: "web-factory/WEB_FACTORY_REFERENCE_CAPTURE_RUNBOOK.md" },
      { label: "Inteligencia actual", path: "web-factory/docs/WEB_FACTORY_DESIGN_INTELLIGENCE_LATEST.md" },
      { label: "Diseño Nuvia", path: "web-factory/data/clients/nuvia.design.md" },
    ],
    nextActions: buildNextActions(recipes, missingRecipeProfiles.length),
  };
}

async function loadClientRecipe(recipeFile: string, profile: ClientProfile | undefined): Promise<WebFactoryClientRecipe> {
  const slug = recipeFile.replace(/\.design\.json$/, "");
  const recipePath = path.join(CLIENTS_DIR, recipeFile);
  const markdownPath = path.join(CLIENTS_DIR, `${slug}.design.md`);
  const contextPath = path.join(CLIENTS_DIR, `${slug}.context.md`);
  const profilePath = path.join(CLIENTS_DIR, `${slug}.json`);
  const previewPath = path.join(WEB_FACTORY_ROOT, "out", slug, "index.html");
  const recipe = await readJsonSafe<AutoDesignRecipe>(recipePath, {});
  const references = (recipe.selectedReferences ?? []).map(normalizeReference);
  const codeReferences = (recipe.codeReferences ?? []).map(normalizeCodeReference);
  const hasMarkdown = await fileExists(markdownPath);
  const hasContext = await fileExists(contextPath);
  const hasPreview = await fileExists(previewPath);
  const warnings = [
    ...(recipe.warnings ?? []),
    ...(!hasMarkdown ? ["Falta receta markdown para revision humana."] : []),
    ...(!hasPreview ? ["Falta preview generado en out/<slug>/index.html."] : []),
  ];
  const confidenceScore = recipe.confidence?.score ?? 0;
  const status = getRecipeStatus(warnings, hasPreview, hasMarkdown, confidenceScore);
  const template = recipe.client?.template ?? "landing";

  return {
    slug,
    name: recipe.client?.name ?? profile?.nombre ?? slug,
    template,
    verticalLabel: recipe.client?.verticalLabel ?? recipe.client?.inferredVertical ?? "Vertical sin clasificar",
    verticalConfidence: recipe.client?.verticalConfidence ?? 0,
    generatedAt: recipe.generatedAt ?? "",
    status,
    statusLabel: getStatusLabel(status),
    confidenceScore,
    productCount: profile?.productos?.length ?? 0,
    categoryCount: profile?.categorias?.length ?? 0,
    referenceCount: references.length,
    screenshotCount: references.reduce((total, reference) => total + reference.screenshotCount, 0),
    codeReferenceCount: codeReferences.length,
    sectionCount: recipe.sectionPlan?.length ?? 0,
    requiredMedia: recipe.mediaPlan?.required ?? [],
    clientMediaRequests: recipe.mediaPlan?.requestFromClient ?? [],
    warnings,
    matchedKeywords: recipe.client?.matchedKeywords ?? [],
    designRead: {
      objective: recipe.designRead?.objective ?? "Objetivo no registrado.",
      visualDirection: recipe.designRead?.visualDirection ?? "Direccion visual pendiente.",
      conversionThesis: recipe.designRead?.conversionThesis ?? "Tesis de conversion pendiente.",
      genericRisk: recipe.designRead?.genericRisk ?? "Riesgo generico pendiente.",
    },
    references,
    codeReferences,
    sectionPlan: (recipe.sectionPlan ?? []).map((section) => ({
      id: section.id ?? "section",
      title: section.title ?? "Seccion",
      goal: section.goal ?? "Objetivo pendiente.",
      pattern: section.pattern ?? "Patron pendiente.",
    })),
    paths: {
      profile: toRepoPath(profilePath),
      recipe: toRepoPath(recipePath),
      markdown: toRepoPath(markdownPath),
      context: toRepoPath(contextPath),
      preview: toRepoPath(previewPath),
    },
    artifacts: {
      hasProfile: Boolean(profile),
      hasRecipe: true,
      hasMarkdown,
      hasContext,
      hasPreview,
    },
    commands: {
      refreshDesign: `pnpm design:auto -- ${slug} --template ${template} --force`,
      buildPreview: `pnpm factory:build -- ${slug} --template ${template} --force`,
      smoke: "pnpm factory:smoke",
    },
  };
}

async function loadDesignIntelligence(): Promise<WebFactoryCenterSnapshot["intelligence"]> {
  const intelligence = await readJsonSafe<DesignIntelligence>(DESIGN_INTELLIGENCE_PATH, {});
  const summary = intelligence.summary ?? {};

  return {
    generatedAt: intelligence.generatedAt ?? "",
    policy:
      intelligence.policy ??
      "Usar como inteligencia de diseno. No copiar codigo, assets, marca ni claims sin revision manual.",
    summary: {
      sources: summary.sources ?? 0,
      examples: summary.examples ?? 0,
      screenshots: summary.screenshots ?? 0,
      codeBlocksFromDocs: summary.codeBlocksFromDocs ?? 0,
      reusableCodeRepositories: summary.reusableCodeRepositories ?? 0,
    },
    path: toRepoPath(DESIGN_INTELLIGENCE_PATH),
    markdownPath: toRepoPath(DESIGN_INTELLIGENCE_MARKDOWN_PATH),
    topSources: (intelligence.sourceSummaries ?? []).slice(0, 8).map((source) => ({
      id: source.id ?? "source",
      name: source.name ?? "Fuente",
      url: source.url ?? "",
      licenseStatus: source.licenseStatus ?? "review-required",
      usage: source.usage ?? "Referencia estructural pendiente de revision.",
      examples: source.examples ?? 0,
      screenshots: source.screenshots ?? 0,
      codeBlocks: source.codeBlocks ?? 0,
      animationLibraries: source.animationLibraries ?? [],
      topFonts: (source.topFonts ?? []).slice(0, 3).map((font) => font.value ?? ""),
      topCtas: (source.topCtas ?? []).slice(0, 4).map((cta) => cta.value ?? ""),
    })),
  };
}

function normalizeReference(reference: DesignReference): WebFactoryClientRecipe["references"][number] {
  return {
    role: reference.role ?? "reference",
    sourceName: reference.sourceName ?? reference.title ?? "Referencia",
    title: reference.title ?? reference.sourceName ?? "Referencia",
    url: reference.url ?? "",
    licenseStatus: reference.licenseStatus ?? "review-required",
    reuseGuidance: reference.reuseGuidance ?? "Extraer estructura, jerarquia y patrones. No copiar identidad ni assets.",
    screenshotCount: Object.values(reference.screenshots ?? {}).filter((shot) => Boolean(shot?.path)).length,
    topFonts: (reference.topFonts ?? [])
      .slice(0, 3)
      .map((font) => (typeof font === "string" ? font : font.value ?? ""))
      .filter(Boolean),
    motionSignals: (reference.motionSignals ?? []).slice(0, 4),
  };
}

function normalizeCodeReference(reference: CodeReference): WebFactoryClientRecipe["codeReferences"][number] {
  const signals = [
    reference.signals?.hasTailwind ? "Tailwind" : "",
    reference.signals?.hasShadcn ? "shadcn" : "",
    reference.signals?.hasMotion ? "motion" : "",
    ...(reference.signals?.exports ?? []).slice(0, 2),
  ].filter(Boolean);

  return {
    repo: reference.repo ?? "repo",
    license: reference.license ?? "review",
    status: reference.status ?? "review-required",
    file: reference.file ?? "",
    reuseRule: reference.reuseRule ?? "Solo despues de review, retokenizacion, accesibilidad y QA responsive.",
    score: reference.score ?? 0,
    signals,
  };
}

function summarizeRecipes(recipes: WebFactoryClientRecipe[], clientProfiles: number): WebFactoryCenterSnapshot["counts"] {
  return {
    clientProfiles,
    designRecipes: recipes.length,
    ready: recipes.filter((recipe) => recipe.status === "ready").length,
    review: recipes.filter((recipe) => recipe.status === "review").length,
    needsAssets: recipes.filter((recipe) => recipe.status === "needs_assets").length,
    needsReferences: recipes.filter((recipe) => recipe.status === "needs_references").length,
    draft: recipes.filter((recipe) => recipe.status === "draft").length,
    screenshots: recipes.reduce((total, recipe) => total + recipe.screenshotCount, 0),
    codeReferences: recipes.reduce((total, recipe) => total + recipe.codeReferenceCount, 0),
    references: recipes.reduce((total, recipe) => total + recipe.referenceCount, 0),
  };
}

function buildNextActions(recipes: WebFactoryClientRecipe[], missingRecipeCount: number): WebFactoryCenterSnapshot["nextActions"] {
  const actions: WebFactoryCenterSnapshot["nextActions"] = [];
  const recipesNeedingAssets = recipes.filter((recipe) => recipe.status === "needs_assets").length;
  const recipesNeedingReview = recipes.filter((recipe) => recipe.status === "review" || recipe.status === "needs_references").length;

  if (missingRecipeCount > 0) {
    actions.push({
      priority: "alta",
      title: "Completar recetas faltantes",
      detail: `${missingRecipeCount} perfil(es) de cliente todavia no tienen .design.json operativo.`,
    });
  }

  if (recipesNeedingAssets > 0) {
    actions.push({
      priority: "alta",
      title: "Pedir imagenes/videos utiles",
      detail: `${recipesNeedingAssets} receta(s) necesitan assets reales antes de vender como web final.`,
    });
  }

  if (recipesNeedingReview > 0) {
    actions.push({
      priority: "media",
      title: "Revisar referencias y retokenizar",
      detail: `${recipesNeedingReview} receta(s) requieren criterio humano para evitar diseno generico o copia indebida.`,
    });
  }

  actions.push({
    priority: "media",
    title: "Conectar intake controlado",
    detail: "El siguiente salto rentable es formulario de brief -> receta -> preview interno -> aprobacion ONIA.",
  });

  return actions;
}

function getRecipeStatus(
  warnings: string[],
  hasPreview: boolean,
  hasMarkdown: boolean,
  confidenceScore: number,
): WebFactoryRecipeStatus {
  const warningText = warnings.join(" ").toLowerCase();

  if (!hasPreview || !hasMarkdown || confidenceScore < 60) {
    return "draft";
  }

  if (warningText.includes("asset") || warningText.includes("imagen") || warningText.includes("video") || warningText.includes("media")) {
    return "needs_assets";
  }

  if (warningText.includes("referencia") || warningText.includes("reference")) {
    return "needs_references";
  }

  if (warnings.length === 0 && confidenceScore >= 80) {
    return "ready";
  }

  return "review";
}

function getStatusLabel(status: WebFactoryRecipeStatus): string {
  const labels: Record<WebFactoryRecipeStatus, string> = {
    ready: "Operativa",
    review: "Revision",
    needs_assets: "Faltan assets",
    needs_references: "Faltan referencias",
    draft: "Borrador",
  };

  return labels[status];
}

async function readJsonSafe<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function readdirSafe(dirPath: string): Promise<string[]> {
  try {
    return await readdir(dirPath);
  } catch {
    return [];
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile();
  } catch {
    return false;
  }
}

function toRepoPath(filePath: string): string {
  return path.relative(REPO_ROOT, filePath).replaceAll("\\", "/");
}
