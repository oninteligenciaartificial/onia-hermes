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
  githubDesignSources: {
    generatedAt: string;
    policy: string;
    path: string;
    repos: Array<{
      fullName: string;
      url: string;
      stars: number;
      forks: number;
      openIssues: number;
      pushedAt: string;
      license: string;
      description: string;
      usage: string;
      risk: string;
      fit: string[];
    }>;
    skillSources: Array<{
      fullName: string;
      url: string;
      stars: number;
      forks: number;
      openIssues: number;
      pushedAt: string;
      license: string;
      category: string;
      description: string;
      usage: string;
      risk: string;
    }>;
  };
  operatingCommands: Array<{
    label: string;
    command: string;
    purpose: string;
  }>;
  workflowSteps: Array<{
    step: number;
    title: string;
    owner: "Arthur" | "Sergio" | "ONIA";
    visibleTo: Array<"arthur" | "sergio" | "area">;
    input: string;
    action: string;
    output: string;
    approval: string;
    command?: string;
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

type RecipeSeed = {
  slug: string;
  name: string;
  template: string;
  verticalLabel: string;
  sections: number;
  references: number;
  screenshots: number;
  codeReferences: number;
  products?: number;
  categories?: number;
  requiredMedia: string[];
  objective: string;
  visualDirection: string;
  genericRisk: string;
  matchedKeywords: string[];
  referenceSamples: Array<{
    role: string;
    sourceName: string;
    url: string;
    licenseStatus: string;
    reuseGuidance: string;
    screenshotCount: number;
  }>;
  codeSamples: Array<{
    repo: string;
    license: string;
    status: string;
    file: string;
    reuseRule: string;
    score: number;
  }>;
};

const GENERATED_AT = "2026-06-29T19:05:54.066Z";

const RECIPES: WebFactoryClientRecipe[] = [
  makeRecipe({
    slug: "clinic-demo",
    name: "Vital Clinic Demo",
    template: "landing",
    verticalLabel: "Clinic / health",
    sections: 3,
    references: 8,
    screenshots: 12,
    codeReferences: 10,
    requiredMedia: ["Foto de equipo, consultorio o hero generado aprobado"],
    objective: "Generar confianza suficiente para agendar consulta sin exagerar promesas.",
    visualDirection: "Jerarquia sobria, pruebas reales, servicios entendibles, equipo/instalaciones y agenda visible.",
    genericRisk: "Parecer plantilla medica stock sin equipo, ubicacion ni limites profesionales.",
    matchedKeywords: ["clinica", "clinic", "salud", "medico", "consulta"],
    referenceSamples: [
      {
        role: "client-reference",
        sourceName: "Zocdoc",
        url: "https://www.zocdoc.com",
        licenseStatus: "client-provided-reference-review-required",
        reuseGuidance: "Usar claridad de agenda y confianza antes del CTA. Evitar parecer marketplace.",
        screenshotCount: 0,
      },
      {
        role: "structure",
        sourceName: "SaaSFrame Landing Pages",
        url: "https://www.saasframe.io/saas/slite",
        licenseStatus: "inspiration-only",
        reuseGuidance: "Usar patrones de hero, prueba social, pricing y CRO mobile-first.",
        screenshotCount: 2,
      },
    ],
    codeSamples: [
      {
        repo: "serafimcloud__21st",
        license: "MIT",
        status: "allowed-after-review",
        file: "apps/web/components/ui/copy-code-card-button.tsx",
        reuseRule: "Solo despues de review, retokenizacion, accesibilidad y QA responsive.",
        score: 32,
      },
      {
        repo: "harshjdhv__componentry",
        license: "MIT",
        status: "allowed-after-review",
        file: "packages/ui/src/components/flight-status-card.tsx",
        reuseRule: "Solo despues de review, retokenizacion, accesibilidad y QA responsive.",
        score: 31,
      },
    ],
  }),
  makeRecipe({
    slug: "demo",
    name: "Clinica Aurora",
    template: "landing",
    verticalLabel: "Clinic / health",
    sections: 3,
    references: 8,
    screenshots: 12,
    codeReferences: 10,
    requiredMedia: ["Foto de equipo, consultorio o hero generado aprobado"],
    objective: "Generar confianza suficiente para agendar consulta sin exagerar promesas.",
    visualDirection: "Jerarquia sobria, pruebas reales, servicios entendibles, equipo/instalaciones y agenda visible.",
    genericRisk: "Parecer plantilla medica stock sin equipo, ubicacion ni limites profesionales.",
    matchedKeywords: ["clinica", "clinic", "dental", "odontologia", "paciente"],
    referenceSamples: [
      {
        role: "client-reference",
        sourceName: "Zocdoc",
        url: "https://www.zocdoc.com",
        licenseStatus: "client-provided-reference-review-required",
        reuseGuidance: "Usar claridad de agenda, confianza y CTA visible. Evitar copiar marketplace o identidad.",
        screenshotCount: 0,
      },
      {
        role: "structure",
        sourceName: "SaaSFrame Landing Pages",
        url: "https://www.saasframe.io/saas/slite",
        licenseStatus: "inspiration-only",
        reuseGuidance: "Usar patrones de hero, prueba social, pricing y CRO mobile-first.",
        screenshotCount: 2,
      },
    ],
    codeSamples: [
      {
        repo: "serafimcloud__21st",
        license: "MIT",
        status: "allowed-after-review",
        file: "apps/web/components/ui/copy-code-card-button.tsx",
        reuseRule: "Solo despues de review, retokenizacion, accesibilidad y QA responsive.",
        score: 32,
      },
      {
        repo: "harshjdhv__componentry",
        license: "MIT",
        status: "allowed-after-review",
        file: "packages/ui/src/components/flight-status-card.tsx",
        reuseRule: "Solo despues de review, retokenizacion, accesibilidad y QA responsive.",
        score: 31,
      },
    ],
  }),
  makeRecipe({
    slug: "engineering-demo",
    name: "Altura Engineers Demo",
    template: "landing",
    verticalLabel: "Engineering / industrial services",
    sections: 3,
    references: 8,
    screenshots: 12,
    codeReferences: 10,
    requiredMedia: ["Foto de proyecto, equipo o visual tecnico aprobado"],
    objective: "Vender capacidad tecnica, proyectos y contacto para cotizacion.",
    visualDirection: "Layout sobrio con evidencia: proyectos, capacidades, proceso, certificaciones y contacto.",
    genericRisk: "Decir innovacion y excelencia sin fotos, proyectos ni proceso concreto.",
    matchedKeywords: ["ingenieria", "engineering", "obra", "proyecto", "estructura"],
    referenceSamples: [
      {
        role: "client-reference",
        sourceName: "Arup",
        url: "https://www.arup.com",
        licenseStatus: "client-provided-reference-review-required",
        reuseGuidance: "Usar seriedad institucional y jerarquia de proyectos. Evitar densidad excesiva.",
        screenshotCount: 0,
      },
      {
        role: "client-reference",
        sourceName: "WSP",
        url: "https://www.wsp.com",
        licenseStatus: "client-provided-reference-review-required",
        reuseGuidance: "Usar presentacion de capacidades y sectores. No copiar estructura corporativa completa.",
        screenshotCount: 0,
      },
    ],
    codeSamples: [
      {
        repo: "harshjdhv__componentry",
        license: "MIT",
        status: "allowed-after-review",
        file: "packages/ui/src/components/flight-status-card.tsx",
        reuseRule: "Solo despues de review, retokenizacion, accesibilidad y QA responsive.",
        score: 31,
      },
      {
        repo: "shadcn-ui__ui",
        license: "MIT",
        status: "allowed-after-review",
        file: "apps/v4/registry/bases/base/blocks/dashboard-01/components/section-cards.tsx",
        reuseRule: "Solo despues de review, retokenizacion, accesibilidad y QA responsive.",
        score: 31,
      },
    ],
  }),
  makeRecipe({
    slug: "nuvia",
    name: "Nuvia",
    template: "store",
    verticalLabel: "Ecommerce skincare / beauty",
    sections: 5,
    references: 8,
    screenshots: 14,
    codeReferences: 10,
    products: 315,
    categories: 9,
    requiredMedia: [
      "Hero poster liviano o imagen principal con permiso de uso.",
      "Imagen por producto o placeholder aprobado para cada producto publicado.",
    ],
    objective: "Vender productos con claridad, confianza y asistencia antes de compra.",
    visualDirection: "Editorial de producto, superficies limpias, packshots grandes, comparacion simple y CTA comercial persistente.",
    genericRisk: "Caer en una tienda beige generica con tres cards iguales, fotos rotas y claims cosmeticos vagos.",
    matchedKeywords: ["skincare", "skin", "piel", "dermo", "dermocosmetica"],
    referenceSamples: [
      {
        role: "client-reference",
        sourceName: "Glossier",
        url: "https://www.glossier.com/",
        licenseStatus: "client-provided-reference-review-required",
        reuseGuidance: "Usar claridad de producto, aire visual, catalogo y CTA directo. No copiar identidad ni claims.",
        screenshotCount: 0,
      },
      {
        role: "client-reference",
        sourceName: "The Ordinary",
        url: "https://theordinary.com/",
        licenseStatus: "client-provided-reference-review-required",
        reuseGuidance: "Usar explicacion funcional de producto y categorias por necesidad. No copiar nomenclatura.",
        screenshotCount: 0,
      },
    ],
    codeSamples: [
      {
        repo: "shadcn-ui__ui",
        license: "MIT",
        status: "allowed-after-review",
        file: "apps/v4/registry/bases/base/blocks/dashboard-01/components/section-cards.tsx",
        reuseRule: "Solo despues de review, retokenizacion, accesibilidad y QA responsive.",
        score: 31,
      },
      {
        repo: "tremorlabs__tremor",
        license: "MIT",
        status: "allowed-after-review",
        file: "src/components/Accordion/accordion.stories.tsx",
        reuseRule: "Solo despues de review, retokenizacion, accesibilidad y QA responsive.",
        score: 31,
      },
    ],
  }),
  makeRecipe({
    slug: "restaurant-demo",
    name: "Mesa Norte Demo",
    template: "landing",
    verticalLabel: "Restaurant / hospitality",
    sections: 3,
    references: 8,
    screenshots: 12,
    codeReferences: 10,
    requiredMedia: ["Foto hero propia o generada con permiso", "3 a 6 fotos de platos o ambiente"],
    objective: "Convertir apetito e intencion local en reserva, pedido o visita.",
    visualDirection: "Fotografia protagonista, menu corto, horarios visibles, ubicacion y CTA de reserva sin friccion.",
    genericRisk: "Usar textos gourmet vacios y no mostrar platos, horarios ni direccion.",
    matchedKeywords: ["restaurant", "restaurante", "menu", "cocina", "reserva"],
    referenceSamples: [
      {
        role: "client-reference",
        sourceName: "Sweetgreen",
        url: "https://www.sweetgreen.com",
        licenseStatus: "client-provided-reference-review-required",
        reuseGuidance: "Usar menu visual, ritmo limpio y CTA visible. Evitar look corporativo frio.",
        screenshotCount: 0,
      },
      {
        role: "structure",
        sourceName: "SaaSFrame Landing Pages",
        url: "https://www.saasframe.io/saas/slite",
        licenseStatus: "inspiration-only",
        reuseGuidance: "Usar patrones de hero, prueba social, pricing y CRO mobile-first.",
        screenshotCount: 2,
      },
    ],
    codeSamples: [
      {
        repo: "serafimcloud__21st",
        license: "MIT",
        status: "allowed-after-review",
        file: "apps/web/components/ui/copy-code-card-button.tsx",
        reuseRule: "Solo despues de review, retokenizacion, accesibilidad y QA responsive.",
        score: 32,
      },
      {
        repo: "harshjdhv__componentry",
        license: "MIT",
        status: "allowed-after-review",
        file: "packages/ui/src/components/flight-status-card.tsx",
        reuseRule: "Solo despues de review, retokenizacion, accesibilidad y QA responsive.",
        score: 31,
      },
    ],
  }),
  makeRecipe({
    slug: "saas-demo",
    name: "PulseOps Demo",
    template: "landing",
    verticalLabel: "SaaS / B2B software",
    sections: 3,
    references: 8,
    screenshots: 12,
    codeReferences: 10,
    requiredMedia: ["Screenshot real, mock aprobado o video corto con poster"],
    objective: "Explicar producto, valor y prueba para pedir demo.",
    visualDirection: "Producto visible, flujo de problema a resultado, features agrupadas, prueba y CTA de demo.",
    genericRisk: "Hero abstracto con gradientes y features genericas que no muestran el sistema.",
    matchedKeywords: ["saas", "software", "dashboard", "automatizacion", "app"],
    referenceSamples: [
      {
        role: "client-reference",
        sourceName: "Stripe",
        url: "https://stripe.com",
        licenseStatus: "client-provided-reference-review-required",
        reuseGuidance: "Usar claridad de producto y CTA. Evitar copiar gradientes o identidad.",
        screenshotCount: 0,
      },
      {
        role: "client-reference",
        sourceName: "Linear",
        url: "https://linear.app",
        licenseStatus: "client-provided-reference-review-required",
        reuseGuidance: "Usar sensacion de software pulido y foco en workflow. Evitar oscurecer demasiado la UI.",
        screenshotCount: 0,
      },
    ],
    codeSamples: [
      {
        repo: "serafimcloud__21st",
        license: "MIT",
        status: "allowed-after-review",
        file: "apps/web/components/features/studio/ui/studio-header.tsx",
        reuseRule: "Solo despues de review, retokenizacion, accesibilidad y QA responsive.",
        score: 34,
      },
      {
        repo: "harshjdhv__componentry",
        license: "MIT",
        status: "allowed-after-review",
        file: "packages/ui/src/components/flight-status-card.tsx",
        reuseRule: "Solo despues de review, retokenizacion, accesibilidad y QA responsive.",
        score: 33,
      },
    ],
  }),
  makeRecipe({
    slug: "skincare-demo",
    name: "Luma Skin Demo",
    template: "store",
    verticalLabel: "Ecommerce skincare / beauty",
    sections: 5,
    references: 8,
    screenshots: 12,
    codeReferences: 10,
    products: 2,
    categories: 3,
    requiredMedia: [
      "Hero poster liviano o imagen principal con permiso de uso.",
      "Imagen por producto o placeholder aprobado para cada producto publicado.",
    ],
    objective: "Vender productos con claridad, confianza y asistencia antes de compra.",
    visualDirection: "Editorial de producto, superficies limpias, packshots grandes, comparacion simple y CTA comercial persistente.",
    genericRisk: "Caer en una tienda beige generica con tres cards iguales, fotos rotas y claims cosmeticos vagos.",
    matchedKeywords: ["skincare", "skin", "piel", "rutina", "producto"],
    referenceSamples: [
      {
        role: "client-reference",
        sourceName: "Glossier",
        url: "https://www.glossier.com",
        licenseStatus: "client-provided-reference-review-required",
        reuseGuidance: "Usar claridad de producto, aire visual y CTA directo. Evitar copiar identidad, tono o claims.",
        screenshotCount: 0,
      },
      {
        role: "client-reference",
        sourceName: "The Ordinary",
        url: "https://theordinary.com",
        licenseStatus: "client-provided-reference-review-required",
        reuseGuidance: "Usar jerarquia de producto y explicacion funcional. Evitar estetica demasiado clinica.",
        screenshotCount: 0,
      },
    ],
    codeSamples: [
      {
        repo: "harshjdhv__componentry",
        license: "MIT",
        status: "allowed-after-review",
        file: "packages/ui/src/components/flight-status-card.tsx",
        reuseRule: "Solo despues de review, retokenizacion, accesibilidad y QA responsive.",
        score: 38,
      },
      {
        repo: "harshjdhv__componentry",
        license: "MIT",
        status: "allowed-after-review",
        file: "packages/ui/src/components/orbit-card-stack.tsx",
        reuseRule: "Solo despues de review, retokenizacion, accesibilidad y QA responsive.",
        score: 34,
      },
    ],
  }),
];

const STATIC_SNAPSHOT: Omit<WebFactoryCenterSnapshot, "generatedAt"> = {
  webFactoryRoot: "web-factory",
  counts: {
    clientProfiles: 7,
    designRecipes: 7,
    ready: 7,
    review: 0,
    needsAssets: 0,
    needsReferences: 0,
    draft: 0,
    screenshots: 86,
    codeReferences: 70,
    references: 56,
  },
  recipes: RECIPES,
  missingRecipeProfiles: [],
  intelligence: {
    generatedAt: GENERATED_AT,
    policy:
      "Usar como inteligencia de diseno, no como fuente para copiar. Capturas, estructuras y repos se revisan antes de usar en trabajos comerciales.",
    summary: {
      sources: 23,
      examples: 93,
      screenshots: 186,
      codeBlocksFromDocs: 32,
      reusableCodeRepositories: 11,
    },
    path: "web-factory/data/references/design-sources/latest-design-intelligence.json",
    markdownPath: "web-factory/docs/WEB_FACTORY_DESIGN_INTELLIGENCE_LATEST.md",
    topSources: [
      {
        id: "10x-app",
        name: "10x App",
        url: "https://www.10x.app/",
        licenseStatus: "noncommercial-code-study-only",
        usage: "Estudio de producto e interaccion. No usar codigo en trabajo comercial.",
        examples: 1,
        screenshots: 2,
        codeBlocks: 0,
        animationLibraries: [],
        topFonts: [],
        topCtas: [],
      },
      {
        id: "21st-community-components",
        name: "21st.dev Community Components",
        url: "https://21st.dev/community/components",
        licenseStatus: "review-required",
        usage: "Descubrimiento de componentes y patrones UI. Verificar cada componente antes de copiar codigo.",
        examples: 10,
        screenshots: 20,
        codeBlocks: 0,
        animationLibraries: [],
        topFonts: [],
        topCtas: [],
      },
      {
        id: "21st-landing-page-components",
        name: "21st.dev Landing Page Components",
        url: "https://21st.dev/community/components/s/landing-page",
        licenseStatus: "review-required-per-component",
        usage: "Patrones de heroes, features, CTAs, pricing, testimonios y secciones animadas.",
        examples: 3,
        screenshots: 6,
        codeBlocks: 0,
        animationLibraries: [],
        topFonts: [],
        topCtas: [],
      },
      {
        id: "aceternity-shadcn-blocks",
        name: "Aceternity shadcn Blocks",
        url: "https://ui.aceternity.com/shadcn-blocks",
        licenseStatus: "free-and-premium-review-required",
        usage: "Ideas de motion y bloques de landing. No copiar codigo premium sin licencia.",
        examples: 3,
        screenshots: 6,
        codeBlocks: 0,
        animationLibraries: [],
        topFonts: [],
        topCtas: [],
      },
    ],
  },
  githubDesignSources: {
    generatedAt: "2026-06-26T00:38:19.3452004Z",
    policy:
      "Buscar repos actuales por estrellas, actividad reciente y licencia. Usarlos como referencia revisable, no como copia literal de marca, assets, claims o identidad visual.",
    path: "web-factory/data/references/design-sources/github-design-repos-20260626.json",
    repos: [
      {
        fullName: "twbs/bootstrap",
        url: "https://github.com/twbs/bootstrap",
        stars: 174398,
        forks: 78781,
        openIssues: 357,
        pushedAt: "2026-06-25T20:11:44Z",
        license: "MIT",
        description: "Framework HTML, CSS y JavaScript para proyectos responsive.",
        usage: "Baseline de responsive, layout, navegacion y componentes probados para webs simples y robustas.",
        risk: "Puede verse generico si se copia el look; usar solo patrones y adaptar visualmente.",
        fit: ["landing", "store", "institutional"],
      },
      {
        fullName: "shadcn-ui/ui",
        url: "https://github.com/shadcn-ui/ui",
        stars: 117438,
        forks: 9148,
        openIssues: 2059,
        pushedAt: "2026-06-24T19:56:48Z",
        license: "MIT",
        description: "Componentes accesibles y distribucion de codigo para frameworks modernos.",
        usage: "Referencia principal para componentes React/Tailwind sobrios y adaptables.",
        risk: "No copiar temas por defecto; retokenizar spacing, color, copy y estados.",
        fit: ["saas", "dashboard", "landing"],
      },
      {
        fullName: "mui/material-ui",
        url: "https://github.com/mui/material-ui",
        stars: 98473,
        forks: 32593,
        openIssues: 1537,
        pushedAt: "2026-06-25T15:12:14Z",
        license: "MIT",
        description: "Libreria React para componentes complejos y formularios.",
        usage: "Referencia de sistemas complejos, tablas, filtros y estados para dashboards.",
        risk: "Puede sentirse corporativo generico si no se personaliza la marca.",
        fit: ["dashboard", "saas", "admin"],
      },
      {
        fullName: "ant-design/ant-design",
        url: "https://github.com/ant-design/ant-design",
        stars: 98470,
        forks: 54625,
        openIssues: 1330,
        pushedAt: "2026-06-25T13:08:56Z",
        license: "MIT",
        description: "Sistema enterprise para React UI.",
        usage: "Referencia para productos operativos densos: formularios, tablas, filtros y permisos.",
        risk: "Evitar copiar estetica enterprise por defecto en webs comerciales pequenas.",
        fit: ["admin", "saas", "crm"],
      },
      {
        fullName: "tailwindlabs/tailwindcss",
        url: "https://github.com/tailwindlabs/tailwindcss",
        stars: 95753,
        forks: 5303,
        openIssues: 63,
        pushedAt: "2026-06-25T17:24:40Z",
        license: "MIT",
        description: "Framework utility-first CSS.",
        usage: "Base para tokens, responsive rapido y componentes propios de Web Factory.",
        risk: "Sin direccion visual acelera lo generico; exigir referencias y criterio por rubro.",
        fit: ["all"],
      },
    ],
    skillSources: [
      {
        fullName: "nextlevelbuilder/ui-ux-pro-max-skill",
        url: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill",
        stars: 96483,
        forks: 10146,
        openIssues: 153,
        pushedAt: "2026-06-25T13:17:39Z",
        license: "MIT",
        category: "design-skill",
        description: "Skill IA para UI/UX profesional.",
        usage: "Referencia externa para razonamiento visual, decisiones anti-genericas y variedad UI.",
        risk: "No copiar reglas ni outputs a ciegas; comparar con marca ONIA y licencias.",
      },
      {
        fullName: "VoltAgent/awesome-design-md",
        url: "https://github.com/VoltAgent/awesome-design-md",
        stars: 93199,
        forks: 11067,
        openIssues: 291,
        pushedAt: "2026-06-16T14:21:08Z",
        license: "MIT",
        category: "design-md-library",
        description: "Coleccion de analisis DESIGN.md de sitios populares.",
        usage: "Biblioteca de patrones para specs que los agentes pueden seguir antes de generar webs.",
        risk: "Usar ejemplos como analisis; nunca copiar identidad o composicion exacta.",
      },
      {
        fullName: "DavidHDev/react-bits",
        url: "https://github.com/DavidHDev/react-bits",
        stars: 41903,
        forks: 1922,
        openIssues: 0,
        pushedAt: "2026-06-24T07:06:16Z",
        license: "NOASSERTION",
        category: "animated-components",
        description: "Componentes React animados e interactivos.",
        usage: "Inspiracion de motion y comportamiento para landings premium.",
        risk: "Revisar licencia antes de copiar codigo; preferir reimplementar ideas dentro de ONIA.",
      },
      {
        fullName: "alexpate/awesome-design-systems",
        url: "https://github.com/alexpate/awesome-design-systems",
        stars: 25199,
        forks: 1621,
        openIssues: 12,
        pushedAt: "2026-04-28T16:03:25Z",
        license: "Unlicense",
        category: "design-system-index",
        description: "Indice de design systems.",
        usage: "Descubrir sistemas de diseno por industria y madurez.",
        risk: "Es solo indice; seguir la licencia de cada sistema enlazado.",
      },
    ],
  },
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
      purpose: "Lee brief, referencias y banco de patrones para producir una receta accionable.",
    },
    {
      label: "Construir preview",
      command: "pnpm factory:build -- <slug> --template <landing|store> --force",
      purpose: "Genera el HTML preview del cliente usando receta y assets disponibles.",
    },
    {
      label: "Build estable",
      command: "pnpm build:stable",
      purpose: "Cierra previews locales, limpia .next y compila Next con retry controlado.",
    },
    {
      label: "Validacion rapida",
      command: "pnpm factory:smoke",
      purpose: "Recompila demos principales y evita romper el flujo base de Web Factory.",
    },
  ],
  workflowSteps: [
    {
      step: 1,
      title: "Registrar datos clave del cliente",
      owner: "Arthur",
      visibleTo: ["arthur", "sergio", "area"],
      input: "Nombre, rubro, oferta, ciudad, WhatsApp, redes, productos/servicios y referencias del cliente.",
      action: "Cargar el perfil y diferenciar web, tienda, sistema o automatizacion.",
      output: "Perfil de cliente listo para receta.",
      approval: "Si el alcance parece sistema, automatizacion o app, Arthur escala a Sergio.",
    },
    {
      step: 2,
      title: "Seleccionar referencias",
      owner: "Arthur",
      visibleTo: ["arthur", "sergio", "area"],
      input: "URLs del cliente, galerias internas, screenshots, fuentes, CTAs y patrones por rubro.",
      action: "Usar referencias como inspiracion estructural. No copiar marca, fotos, copy, claims ni codigo cerrado.",
      output: "Referencias vinculadas al brief.",
      approval: "Sergio revisa riesgos legales, promesas sensibles o identidad demasiado parecida.",
      command: "pnpm references:harvest:daily",
    },
    {
      step: 3,
      title: "Generar receta de diseno",
      owner: "ONIA",
      visibleTo: ["arthur", "sergio", "area"],
      input: "Perfil, contexto, referencias e inteligencia actual.",
      action: "Crear tesis de conversion, riesgo generico, secciones, assets, codigo referencial y warnings.",
      output: ".design.json y .design.md revisables.",
      approval: "Arthur prepara; Sergio aprueba si se usa para propuesta o entrega.",
      command: "pnpm design:auto -- <slug> --template <landing|store> --force",
    },
    {
      step: 4,
      title: "Pedir materiales faltantes",
      owner: "Arthur",
      visibleTo: ["arthur", "sergio", "area"],
      input: "Warnings, mediaPlan y assets rotos o ausentes.",
      action: "Pedir fotos reales, logo, videos, catalogo, precios o autorizacion para placeholders.",
      output: "Lista concreta de assets faltantes o aprobacion de placeholders.",
      approval: "No prometer entrega final si faltan fotos, precios, permisos o textos criticos.",
    },
    {
      step: 5,
      title: "Construir preview interno",
      owner: "ONIA",
      visibleTo: ["arthur", "sergio", "area"],
      input: "Receta aprobable y assets disponibles.",
      action: "Generar preview para revisar estructura, copy, responsive, performance e imagenes.",
      output: "Preview en out/<slug>/index.html.",
      approval: "Arthur revisa internamente; no envia al cliente sin aprobacion de Sergio.",
      command: "pnpm factory:build -- <slug> --template <landing|store> --force",
    },
    {
      step: 6,
      title: "QA, precio y entrega",
      owner: "Sergio",
      visibleTo: ["arthur", "sergio", "area"],
      input: "Preview, checklist de alcance, precio, soporte, dominio, hosting y evidencia.",
      action: "Validar imagenes, promesas, alcance cobrado y riesgos de copia.",
      output: "Decision: enviar propuesta, pedir datos, cobrar extra o bloquear entrega.",
      approval: "Solo Sergio aprueba precio final, descuentos, deploy, cobro, entrega y cambios client-facing.",
      command: "pnpm factory:smoke",
    },
  ],
  canonicalDocs: [
    { label: "Runbook operativo", path: "web-factory/docs/WEB_FACTORY_OPERATING_RUNBOOK_20260625.md" },
    { label: "Captura de referencias", path: "web-factory/WEB_FACTORY_REFERENCE_CAPTURE_RUNBOOK.md" },
    { label: "Inteligencia actual", path: "web-factory/docs/WEB_FACTORY_DESIGN_INTELLIGENCE_LATEST.md" },
    { label: "Repos GitHub diseno", path: "web-factory/data/references/design-sources/github-design-repos-20260626.json" },
    { label: "Diseno Nuvia", path: "web-factory/data/clients/nuvia.design.md" },
  ],
  nextActions: [
    {
      priority: "alta",
      title: "Mantener Nuvia vendible",
      detail: "No gastar la caja en assets innecesarios: publicar productos con fotos autorizadas, precios revisados y margen claro.",
    },
    {
      priority: "alta",
      title: "Usar Web Factory como caballito de batalla",
      detail: "El flujo rentable es brief -> receta -> preview interno -> propuesta cerrada -> deploy controlado.",
    },
    {
      priority: "media",
      title: "Conectar intake controlado",
      detail: "El siguiente salto es formulario de brief con aprobacion ONIA antes de generar o enviar una web.",
    },
  ],
};

export async function getWebFactoryCenterSnapshot(): Promise<WebFactoryCenterSnapshot> {
  return {
    ...STATIC_SNAPSHOT,
    generatedAt: new Date().toISOString(),
  };
}

function makeRecipe(seed: RecipeSeed): WebFactoryClientRecipe {
  return {
    slug: seed.slug,
    name: seed.name,
    template: seed.template,
    verticalLabel: seed.verticalLabel,
    verticalConfidence: 0.95,
    generatedAt: GENERATED_AT,
    status: "ready",
    statusLabel: "Operativa",
    confidenceScore: 95,
    productCount: seed.products ?? 0,
    categoryCount: seed.categories ?? 0,
    referenceCount: seed.references,
    screenshotCount: seed.screenshots,
    codeReferenceCount: seed.codeReferences,
    sectionCount: seed.sections,
    requiredMedia: seed.requiredMedia,
    clientMediaRequests: [],
    warnings: [],
    matchedKeywords: seed.matchedKeywords,
    designRead: {
      objective: seed.objective,
      visualDirection: seed.visualDirection,
      conversionThesis: "Convertir interes en accion medible con prueba, claridad de oferta y CTA visible.",
      genericRisk: seed.genericRisk,
    },
    references: seed.referenceSamples.map((reference) => ({
      ...reference,
      title: reference.sourceName,
      topFonts: [],
      motionSignals: [],
    })),
    codeReferences: seed.codeSamples.map((reference) => ({
      ...reference,
      signals: [],
    })),
    sectionPlan: Array.from({ length: seed.sections }, (_, index) => ({
      id: `section-${index + 1}`,
      title: `Seccion ${index + 1}`,
      goal: "Resolver una duda comercial concreta antes del CTA.",
      pattern: "Jerarquia clara, evidencia y accion.",
    })),
    paths: {
      profile: `web-factory/data/clients/${seed.slug}.json`,
      recipe: `web-factory/data/clients/${seed.slug}.design.json`,
      markdown: `web-factory/data/clients/${seed.slug}.design.md`,
      context: `web-factory/data/clients/${seed.slug}.context.md`,
      preview: `web-factory/out/${seed.slug}/index.html`,
    },
    artifacts: {
      hasProfile: true,
      hasRecipe: true,
      hasMarkdown: true,
      hasContext: true,
      hasPreview: true,
    },
    commands: {
      refreshDesign: `pnpm design:auto -- ${seed.slug} --template ${seed.template} --force`,
      buildPreview: `pnpm factory:build -- ${seed.slug} --template ${seed.template} --force`,
      smoke: "pnpm factory:smoke",
    },
  };
}
