import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadClientProfile, type ClientProfile } from "../data/schema";
import { parseSlug } from "../generate/generate";

export type WebFactoryTemplate = "landing" | "store" | "dashboard";

export type VerticalId =
  | "skincare-ecommerce"
  | "restaurant-hospitality"
  | "clinic-health"
  | "engineering-industrial"
  | "saas-b2b"
  | "dashboard-analytics"
  | "local-services";

export type DesignDial = "low" | "medium" | "high";

export type AutoDesignOptions = {
  rootDir?: string;
  template?: WebFactoryTemplate;
  designIntelligencePath?: string;
  codeExamplesPath?: string;
  now?: Date;
};

export type WriteAutoDesignOptions = AutoDesignOptions & {
  outDir?: string;
  force?: boolean;
  dryRun?: boolean;
};

export type AutoDesignResult = {
  slug: string;
  jsonPath: string;
  markdownPath: string;
  recipe: AutoDesignRecipe;
};

export type AutoDesignRecipe = {
  schemaVersion: "web-factory-auto-design-v1";
  generatedAt: string;
  client: {
    slug: string;
    name: string;
    template: WebFactoryTemplate;
    inferredVertical: VerticalId;
    verticalLabel: string;
    verticalConfidence: number;
    matchedKeywords: string[];
  };
  sourcePaths: {
    clientProfile: string;
    clientContext?: string;
    designIntelligence: string;
    codeExamples: string;
  };
  designRead: {
    objective: string;
    visualDirection: string;
    conversionThesis: string;
    genericRisk: string;
  };
  dials: {
    conversionDensity: DesignDial;
    visualDensity: DesignDial;
    motionIntensity: DesignDial;
    trustTone: string;
  };
  selectedReferences: AutoDesignReference[];
  codeReferences: AutoDesignCodeReference[];
  sectionPlan: AutoDesignSection[];
  tokenDirection: {
    fonts: {
      heading: string;
      body: string;
      referenceSignals: string[];
    };
    palette: {
      primary: string;
      secondary: string;
      accent: string;
      bg: string;
      fg: string;
      usage: string[];
    };
    layout: string[];
    componentBehavior: string[];
    motion: string[];
  };
  mediaPlan: {
    required: string[];
    optional: string[];
    generationRequests: string[];
  };
  implementationPlan: string[];
  antiGenericGuardrails: string[];
  qaChecklist: string[];
  warnings: string[];
  confidence: {
    score: number;
    reasons: string[];
  };
};

export type AutoDesignReference = {
  role: "client-reference" | "structure" | "typography" | "motion" | "conversion" | "component";
  sourceName: string;
  title: string;
  url: string;
  licenseStatus: string;
  reuseGuidance: string;
  screenshots: {
    desktop?: ScreenshotReference;
    mobile?: ScreenshotReference;
  };
  headings: string[];
  ctas: string[];
  topFonts: string[];
  motionSignals: string[];
  codeLinks: Array<{ url: string; text: string }>;
  qualityWarnings: string[];
  whySelected: string[];
  score: number;
};

export type ScreenshotReference = {
  path: string;
  sha256: string;
  mode?: string;
};

export type AutoDesignCodeReference = {
  repo: string;
  license: string;
  status: string;
  localPath: string;
  file: string;
  sha256: string;
  signals: {
    type?: string;
    hasTailwind?: boolean;
    hasMotion?: boolean;
    hasShadcn?: boolean;
    imports?: string[];
    exports?: string[];
  };
  samplePreview: string;
  whySelected: string[];
  reuseRule: string;
  score: number;
};

export type AutoDesignSection = {
  id: string;
  label: string;
  objective: string;
  pattern: string;
  dataNeeded: string[];
  referenceCue: string;
};

type VerticalDefinition = {
  id: VerticalId;
  label: string;
  keywords: string[];
  objective: string;
  visualDirection: string;
  conversionThesis: string;
  genericRisk: string;
  trustTone: string;
  storeBias?: boolean;
  productBias?: boolean;
  dials: {
    conversionDensity: DesignDial;
    visualDensity: DesignDial;
    motionIntensity: DesignDial;
  };
  sections: AutoDesignSection[];
  requiredMedia: string[];
  optionalMedia: string[];
  layout: string[];
  componentBehavior: string[];
  motion: string[];
};

type DesignIntelligence = {
  generatedAt?: string;
  sourceSummaries?: SourceSummary[];
  topExamples?: VisualExample[];
  globalSignals?: {
    topFonts?: Array<{ value: string; count: number }>;
  };
  reusableCodeRepositories?: Array<{
    name?: string;
    license?: string;
    localPath?: string;
    selectedExamples?: number;
    motionExamples?: number;
    shadcnExamples?: number;
    tailwindExamples?: number;
  }>;
};

type SourceSummary = {
  id?: string;
  name?: string;
  url?: string;
  mode?: string;
  licenseStatus?: string;
  usage?: string;
  screenshots?: number;
  topFonts?: Array<{ value: string; count: number }>;
  topCtas?: Array<{ value: string; count: number }>;
};

type VisualExample = {
  sourceId?: string;
  sourceName?: string;
  licenseStatus?: string;
  url?: string;
  title?: string;
  description?: string;
  reuseGuidance?: string;
  screenshots?: {
    desktop?: ScreenshotReference;
    mobile?: ScreenshotReference;
  };
  headings?: string[];
  ctas?: string[];
  topFonts?: string[];
  animationSignals?: string[];
  codeLinks?: Array<{ url?: string; text?: string }>;
  codeBlockCount?: number;
  qualityWarnings?: string[];
};

type ComponentCodePack = {
  capturedAt?: string;
  repositories?: ComponentRepository[];
};

type ComponentRepository = {
  name?: string;
  localPath?: string;
  license?: string;
  status?: string;
  examples?: ComponentExample[];
};

type ComponentExample = {
  relativePath?: string;
  sha256?: string;
  sample?: string;
  signals?: {
    type?: string;
    hasTailwind?: boolean;
    hasMotion?: boolean;
    hasShadcn?: boolean;
    imports?: string[];
    exports?: string[];
  };
};

const VERTICALS: VerticalDefinition[] = [
  {
    id: "skincare-ecommerce",
    label: "Ecommerce skincare / beauty",
    keywords: [
      "skincare",
      "skin",
      "piel",
      "dermo",
      "dermocosmetica",
      "cosmetica",
      "belleza",
      "rutina",
      "producto",
      "catalogo",
      "tienda",
      "serum",
      "crema",
      "limpieza",
      "hidratacion",
      "proteccion",
      "solar",
    ],
    objective: "Vender productos con claridad, confianza y asistencia antes de compra.",
    visualDirection:
      "Editorial de producto, superficies limpias, packshots grandes, comparacion simple y CTA comercial persistente.",
    conversionThesis:
      "La persona no compra por decorar la pagina; compra cuando entiende producto, uso, precio y canal de asistencia.",
    genericRisk:
      "Caer en una tienda beige generica con tres cards iguales, fotos rotas y claims cosmeticos vagos.",
    trustTone: "comercial claro con cuidado experto, sin prometer resultados medicos",
    storeBias: true,
    productBias: true,
    dials: { conversionDensity: "high", visualDensity: "medium", motionIntensity: "medium" },
    sections: [
      {
        id: "hero-product",
        label: "Hero de producto",
        objective: "Mostrar oferta, categoria principal y CTA antes del primer scroll.",
        pattern: "Hero split con producto real o poster ligero, bullets de compra y CTA a catalogo/WhatsApp.",
        dataNeeded: ["heroPoster o heroImage", "CTA", "categorias", "2 productos destacados"],
        referenceCue: "Usar screenshots ecommerce para decidir escala de packshot y aire visual.",
      },
      {
        id: "catalog",
        label: "Catalogo escaneable",
        objective: "Permitir comparar productos sin repetir informacion en secciones secundarias.",
        pattern: "Grid con filtros simples, imagen estable, precio, categoria, beneficios y accion.",
        dataNeeded: ["productos", "imagenes", "precios", "categorias"],
        referenceCue: "Revisar cards de producto y densidad en referencias de ecommerce.",
      },
      {
        id: "routine-guide",
        label: "Guia de rutina",
        objective: "Ayudar a elegir segun necesidad sin convertir la pagina en blog.",
        pattern: "Tres pasos maximo: elegir, consultar, comprar. Si hay rutina real, ordenar por paso.",
        dataNeeded: ["beneficios", "uso", "ordenRutina"],
        referenceCue: "Tomar ritmo de landing clara, no copiar claims de marcas.",
      },
      {
        id: "trust-faq",
        label: "Confianza y FAQ",
        objective: "Reducir dudas comerciales y legales antes de escribir.",
        pattern: "Preguntas compactas sobre disponibilidad, precios, envio, asistencia y limites.",
        dataNeeded: ["politicas", "metodos de pago", "contacto"],
        referenceCue: "Usar acordiones de repos MIT si pasan revision.",
      },
      {
        id: "final-cta",
        label: "CTA final",
        objective: "Cerrar con accion directa y sin repetir todo el catalogo.",
        pattern: "Bloque corto con carrito/cotizacion o WhatsApp.",
        dataNeeded: ["canal de conversion"],
        referenceCue: "CTA simple, visible y no decorativo.",
      },
    ],
    requiredMedia: [
      "Hero poster liviano o imagen principal con permiso de uso.",
      "Imagen por producto o placeholder aprobado para cada producto publicado.",
    ],
    optionalMedia: ["Micro video de uso del producto con poster", "Fotos de textura o detalle"],
    layout: [
      "Primer viewport con producto real, no una ilustracion abstracta.",
      "Catalogo con espacios de imagen estables para evitar saltos.",
      "Densidad media: suficiente informacion para comprar sin saturar.",
    ],
    componentBehavior: [
      "Carrito o cotizacion asistida debe funcionar sin precio inventado.",
      "Filtros y detalles no deben esconder el CTA principal.",
    ],
    motion: [
      "Reveals sutiles con IntersectionObserver.",
      "Video diferido con poster y `prefers-reduced-motion`.",
    ],
  },
  {
    id: "restaurant-hospitality",
    label: "Restaurant / hospitality",
    keywords: [
      "restaurant",
      "restaurante",
      "menu",
      "cocina",
      "chef",
      "bar",
      "cafe",
      "reserva",
      "mesa",
      "delivery",
      "comida",
      "bebida",
    ],
    objective: "Convertir apetito e intencion local en reserva, pedido o visita.",
    visualDirection:
      "Fotografia protagonista, menu corto, horarios visibles, ubicacion y CTA de reserva sin friccion.",
    conversionThesis:
      "El visitante decide rapido si quiere ir o pedir; la web debe mostrar comida, precio relativo, horario y canal.",
    genericRisk: "Usar textos gourmet vacios y no mostrar platos, horarios ni direccion.",
    trustTone: "cercano y sensorial, con informacion practica primero",
    dials: { conversionDensity: "medium", visualDensity: "high", motionIntensity: "low" },
    sections: [
      {
        id: "hero-dish",
        label: "Hero con plato real",
        objective: "Hacer que la oferta se entienda visualmente en segundos.",
        pattern: "Imagen full bleed o stage editorial con CTA reservar/pedir.",
        dataNeeded: ["foto hero", "horario", "CTA"],
        referenceCue: "Comparar encuadre y contraste en screenshots de restaurantes.",
      },
      {
        id: "menu-shortlist",
        label: "Menu corto",
        objective: "Mostrar platos estrella sin subir un PDF pesado.",
        pattern: "Categorias reducidas con precios si existen.",
        dataNeeded: ["platos", "categorias", "precios"],
        referenceCue: "Priorizar lectura movil.",
      },
      {
        id: "visit-info",
        label: "Visita",
        objective: "Resolver direccion, horarios y contacto.",
        pattern: "Bloque compacto con mapa/link, WhatsApp y redes.",
        dataNeeded: ["direccion", "horarios", "telefono"],
        referenceCue: "No esconder datos de ubicacion en footer.",
      },
    ],
    requiredMedia: ["Foto hero propia o generada con permiso", "3 a 6 fotos de platos o ambiente"],
    optionalMedia: ["Video corto de cocina o ambiente con poster"],
    layout: ["Imagen primero", "Menu en tarjetas compactas", "CTA sticky solo si no tapa contenido"],
    componentBehavior: ["Reserva o pedido debe abrir canal real", "Galeria ligera sin autoplay pesado"],
    motion: ["Motion bajo; transiciones cortas para no distraer de menu y reserva"],
  },
  {
    id: "clinic-health",
    label: "Clinic / health",
    keywords: [
      "clinica",
      "clinic",
      "salud",
      "medico",
      "dental",
      "odontologia",
      "paciente",
      "consulta",
      "tratamiento",
      "doctor",
      "dermatologia",
    ],
    objective: "Generar confianza suficiente para agendar consulta sin exagerar promesas.",
    visualDirection:
      "Jerarquia sobria, pruebas reales, servicios entendibles, equipo/instalaciones y agenda visible.",
    conversionThesis:
      "La salud requiere confianza y claridad; el CTA funciona cuando el usuario entiende especialidad, ubicacion y proceso.",
    genericRisk: "Parecer plantilla medica stock sin equipo, ubicacion ni limites profesionales.",
    trustTone: "profesional, preciso y seguro",
    dials: { conversionDensity: "medium", visualDensity: "medium", motionIntensity: "low" },
    sections: [
      {
        id: "hero-trust",
        label: "Hero de confianza",
        objective: "Explicar especialidad, ubicacion y agenda.",
        pattern: "Copy directo, foto real/equipo, CTA agendar.",
        dataNeeded: ["especialidad", "ubicacion", "foto", "contacto"],
        referenceCue: "Evitar estetica hospital generica; buscar confianza especifica.",
      },
      {
        id: "services",
        label: "Servicios",
        objective: "Organizar tratamientos sin sobreprometer resultados.",
        pattern: "Lista con para quien es, duracion/rango si existe y CTA.",
        dataNeeded: ["servicios", "restricciones", "precios si aplica"],
        referenceCue: "Densidad clara tipo landing B2B, no card wall.",
      },
      {
        id: "booking-faq",
        label: "Agenda y FAQ",
        objective: "Resolver dudas de primera visita.",
        pattern: "Pasos de agenda, documentos, horarios, FAQ.",
        dataNeeded: ["horarios", "politicas", "canal"],
        referenceCue: "Acordeones accesibles de repos MIT.",
      },
    ],
    requiredMedia: ["Foto de equipo, consultorio o hero generado aprobado"],
    optionalMedia: ["Iconografia simple por servicio", "Testimonios con permiso"],
    layout: ["Mucho aire", "Contraste alto", "CTA de agenda visible"],
    componentBehavior: ["Formularios con labels claros", "FAQ accesible"],
    motion: ["Motion minimo; nada que parezca juego en salud"],
  },
  {
    id: "engineering-industrial",
    label: "Engineering / industrial services",
    keywords: [
      "ingenieria",
      "engineering",
      "industrial",
      "obra",
      "proyecto",
      "estructura",
      "mantenimiento",
      "energia",
      "planta",
      "supervision",
      "certificacion",
    ],
    objective: "Vender capacidad tecnica, proyectos y contacto para cotizacion.",
    visualDirection:
      "Layout sobrio con evidencia: proyectos, capacidades, proceso, certificaciones y contacto.",
    conversionThesis:
      "El cliente B2B necesita pruebas y alcance; la pagina debe mostrar que ONIA entiende decision tecnica.",
    genericRisk: "Decir innovacion y excelencia sin fotos, proyectos ni proceso concreto.",
    trustTone: "tecnico, serio y orientado a riesgo",
    dials: { conversionDensity: "medium", visualDensity: "medium", motionIntensity: "low" },
    sections: [
      {
        id: "hero-proof",
        label: "Hero con capacidad",
        objective: "Decir que resuelve y para que tipo de cliente.",
        pattern: "Titular tecnico, foto/proyecto, metricas verificables si existen.",
        dataNeeded: ["servicio principal", "sector", "foto/proyecto"],
        referenceCue: "Benchmark HSB Engineers como piso visual interno.",
      },
      {
        id: "projects",
        label: "Proyectos",
        objective: "Probar experiencia sin inventar metricas.",
        pattern: "Casos breves con rol, alcance y resultado verificable.",
        dataNeeded: ["proyectos", "fotos", "resultados"],
        referenceCue: "Usar grilla sobria, no decoracion.",
      },
      {
        id: "process-contact",
        label: "Proceso y contacto",
        objective: "Hacer facil pedir diagnostico/cotizacion.",
        pattern: "Pasos de trabajo y CTA con requerimientos minimos.",
        dataNeeded: ["proceso", "canal", "requisitos"],
        referenceCue: "Timeline simple de repos MIT si aplica.",
      },
    ],
    requiredMedia: ["Foto de proyecto, equipo o visual tecnico aprobado"],
    optionalMedia: ["Planos o diagramas simplificados propios", "Certificaciones"],
    layout: ["Grid tecnico", "Jerarquia de evidencia", "Copy sin promesas infladas"],
    componentBehavior: ["CTA de cotizacion debe pedir datos minimos", "Casos con informacion verificable"],
    motion: ["Motion bajo; microinteracciones solo para progresion y hover"],
  },
  {
    id: "saas-b2b",
    label: "SaaS / B2B software",
    keywords: [
      "saas",
      "software",
      "dashboard",
      "plataforma",
      "sistema",
      "automatizacion",
      "crm",
      "app",
      "demo",
      "b2b",
      "analytics",
    ],
    objective: "Explicar producto, valor y prueba para pedir demo.",
    visualDirection:
      "Producto visible, flujo de problema a resultado, features agrupadas, prueba y CTA de demo.",
    conversionThesis:
      "El SaaS vende cuando el usuario ve el producto y entiende el antes/despues operativo.",
    genericRisk: "Hero abstracto con gradientes y features genericas que no muestran el sistema.",
    trustTone: "moderno, operativo y orientado a decision",
    dials: { conversionDensity: "high", visualDensity: "medium", motionIntensity: "medium" },
    sections: [
      {
        id: "hero-product-screenshot",
        label: "Hero con producto",
        objective: "Mostrar la interfaz o un mock real desde el inicio.",
        pattern: "Copy de problema, screenshot de producto, CTA demo.",
        dataNeeded: ["screenshot", "CTA", "beneficio principal"],
        referenceCue: "Usar SaaSFrame/Landingfolio para jerarquia, no copiar identidad.",
      },
      {
        id: "workflow",
        label: "Workflow",
        objective: "Conectar features con operaciones reales.",
        pattern: "Tres pasos: capturar, automatizar, medir.",
        dataNeeded: ["features", "roles", "integraciones"],
        referenceCue: "Evitar card wall de features.",
      },
      {
        id: "pricing-demo",
        label: "Plan y demo",
        objective: "Reducir friccion comercial.",
        pattern: "Pricing simple o CTA demo si precio no esta definido.",
        dataNeeded: ["precio", "paquetes", "contacto"],
        referenceCue: "Usar patrones de pricing MIT tras revision.",
      },
    ],
    requiredMedia: ["Screenshot real, mock aprobado o video corto con poster"],
    optionalMedia: ["Logos/testimonios con permiso", "Animacion de flujo"],
    layout: ["Producto como protagonista", "Features por workflow", "Prueba visible antes del CTA final"],
    componentBehavior: ["Demo CTA visible", "Tabs o accordions solo si reducen lectura"],
    motion: ["Motion medio para reveal de producto; siempre con reduced motion"],
  },
  {
    id: "dashboard-analytics",
    label: "Dashboard / analytics / internal tool",
    keywords: [
      "dashboard",
      "panel",
      "panel de control",
      "panel administrativo",
      "tablero",
      "cuadro de mando",
      "admin",
      "administrador",
      "backoffice",
      "back office",
      "kpi",
      "kpis",
      "metrica",
      "metricas",
      "indicador",
      "indicadores",
      "reporte",
      "reportes",
      "reporteria",
      "analitica",
      "analytics",
      "business intelligence",
      "bi",
      "observabilidad",
      "monitoreo",
      "tiempo real",
      "grafico",
      "graficas",
      "visualizacion",
    ],
    objective: "Mostrar el estado del negocio de un vistazo y permitir accion sobre los datos.",
    visualDirection:
      "Layout de datos: KPIs arriba, graficos y tablas con jerarquia clara, filtros y estados de carga/vacio cuidados.",
    conversionThesis:
      "Un panel funciona cuando el usuario entiende el estado en segundos y puede filtrar o accionar sin friccion; la densidad es una feature, no adorno.",
    genericRisk:
      "Cards de KPI sin jerarquia, graficos decorativos sin insight y tablas sin estados de carga/vacio ni acciones.",
    trustTone: "operativo, denso y legible",
    dials: { conversionDensity: "medium", visualDensity: "high", motionIntensity: "low" },
    sections: [
      {
        id: "kpi-overview",
        label: "Resumen de KPIs",
        objective: "Comunicar el estado del negocio de un vistazo.",
        pattern: "Fila de 4-6 KPIs con valor, delta y contexto de periodo.",
        dataNeeded: ["metricas clave", "periodo", "comparativo"],
        referenceCue: "Tremor/shadcn charts (Apache/MIT) para jerarquia de KPI; no copiar identidad.",
      },
      {
        id: "charts-grid",
        label: "Graficos",
        objective: "Explicar tendencia y composicion, un insight por grafico.",
        pattern: "Grid de 2-3 graficos con titulo, unidad y leyenda claras.",
        dataNeeded: ["series", "dimensiones", "unidades"],
        referenceCue: "Recharts/Tremor para tipos de grafico; revisar licencia antes de reusar codigo.",
      },
      {
        id: "data-table",
        label: "Tabla operativa",
        objective: "Permitir detalle y accion sobre los datos.",
        pattern: "Tabla con orden, filtro, paginacion, estados de carga/vacio y acciones por fila.",
        dataNeeded: ["columnas", "filas", "acciones"],
        referenceCue: "Tabler/shadcn data-table (MIT) para patrones de tabla accesible.",
      },
    ],
    requiredMedia: [
      "Datos o mock de metricas/series aprobado",
      "Definicion de KPIs, unidades y periodos",
    ],
    optionalMedia: ["Logo/marca para el shell", "Iconografia de estados"],
    layout: [
      "KPIs arriba, luego graficos, luego tabla",
      "Densidad alta con ritmo legible",
      "Shell con navegacion lateral opcional",
    ],
    componentBehavior: [
      "Filtros controlan toda la vista",
      "Tablas con estados de carga y vacio explicitos",
      "Acciones destructivas confirmadas",
    ],
    motion: ["Motion bajo; solo transiciones de estado y skeleton de carga, nada decorativo"],
  },
  {
    id: "local-services",
    label: "Local services / professional business",
    keywords: ["servicio", "empresa", "negocio", "local", "cotizacion", "agenda", "whatsapp", "bolivia"],
    objective: "Explicar oferta, prueba y contacto de forma directa.",
    visualDirection:
      "Landing sobria, jerarquia comercial clara, servicios agrupados y CTA a conversacion.",
    conversionThesis:
      "Una web de servicios convierte cuando reduce la duda: que hace, para quien, por que confiar y como contactar.",
    genericRisk: "Tres tarjetas de servicios sin prueba, sin diferenciacion y sin canal real.",
    trustTone: "profesional y directo",
    dials: { conversionDensity: "medium", visualDensity: "medium", motionIntensity: "low" },
    sections: [
      {
        id: "hero-offer",
        label: "Hero de oferta",
        objective: "Comunicar servicio y cliente ideal.",
        pattern: "Titular claro, proof panel y CTA.",
        dataNeeded: ["oferta", "CTA", "ubicacion"],
        referenceCue: "Usar Bench/Garabato/HSB como piso interno.",
      },
      {
        id: "services-proof",
        label: "Servicios con prueba",
        objective: "Explicar servicios sin relleno.",
        pattern: "Agrupar por resultado, no por lista generica.",
        dataNeeded: ["servicios", "beneficios", "casos"],
        referenceCue: "Evitar tres cards iguales si no aportan decision.",
      },
      {
        id: "contact",
        label: "Contacto",
        objective: "Cerrar con canal real y siguiente paso claro.",
        pattern: "CTA y datos de contacto visibles.",
        dataNeeded: ["WhatsApp/email", "direccion"],
        referenceCue: "No esconder canal en footer.",
      },
    ],
    requiredMedia: ["Hero visual propio, generado o foto de negocio con permiso"],
    optionalMedia: ["Casos o resultados con permiso"],
    layout: ["Jerarquia clara", "Secciones solo si cambian la decision", "CTA directo"],
    componentBehavior: ["Servicios con objetivo", "Footer util"],
    motion: ["Motion bajo; hover y reveal sutil si suma"],
  },
];

export async function buildAutoDesignRecipe(
  slug: string,
  options: AutoDesignOptions = {},
): Promise<AutoDesignRecipe> {
  const safeSlug = parseSlug(slug);
  const rootDir = options.rootDir ?? process.cwd();
  const generatedAt = (options.now ?? new Date()).toISOString();
  const clientProfilePath = path.join(rootDir, "data", "clients", `${safeSlug}.json`);
  const clientContextPath = path.join(rootDir, "data", "clients", `${safeSlug}.context.md`);
  const designIntelligencePath = resolveFromRoot(
    rootDir,
    options.designIntelligencePath ??
      path.join("data", "references", "design-sources", "latest-design-intelligence.json"),
  );
  const codeExamplesPath = resolveFromRoot(
    rootDir,
    options.codeExamplesPath ??
      path.join("data", "references", "code-sources", "latest-component-code-examples.json"),
  );
  const warnings: string[] = [];
  const client = await loadClientProfile(clientProfilePath);
  const context = await readOptional(clientContextPath);
  const template = options.template ?? inferTemplate(client);
  const designIntelligence = await readJsonFile<DesignIntelligence>(designIntelligencePath, warnings);
  const codePack = await readJsonFile<ComponentCodePack>(codeExamplesPath, warnings);
  const verticalMatch = inferVertical(client, context, template);
  const selectedReferences = selectVisualReferences(client, verticalMatch.definition, designIntelligence);
  const dials = buildDials(verticalMatch.definition, template, client);
  const codeReferences = selectCodeReferences(codePack, verticalMatch.definition, dials.motionIntensity);
  const mediaPlan = buildMediaPlan(client, verticalMatch.definition);

  warnings.push(...buildWarnings(client, selectedReferences, codeReferences, mediaPlan, designIntelligence, codePack));

  const confidence = buildConfidence(selectedReferences, codeReferences, mediaPlan, warnings, verticalMatch.score);

  return {
    schemaVersion: "web-factory-auto-design-v1",
    generatedAt,
    client: {
      slug: safeSlug,
      name: client.nombre,
      template,
      inferredVertical: verticalMatch.definition.id,
      verticalLabel: verticalMatch.definition.label,
      verticalConfidence: verticalMatch.confidence,
      matchedKeywords: verticalMatch.matchedKeywords,
    },
    sourcePaths: {
      clientProfile: clientProfilePath,
      ...(context ? { clientContext: clientContextPath } : {}),
      designIntelligence: designIntelligencePath,
      codeExamples: codeExamplesPath,
    },
    designRead: {
      objective: verticalMatch.definition.objective,
      visualDirection: verticalMatch.definition.visualDirection,
      conversionThesis: verticalMatch.definition.conversionThesis,
      genericRisk: verticalMatch.definition.genericRisk,
    },
    dials,
    selectedReferences,
    codeReferences,
    sectionPlan: verticalMatch.definition.sections,
    tokenDirection: buildTokenDirection(client, selectedReferences, designIntelligence, verticalMatch.definition),
    mediaPlan,
    implementationPlan: buildImplementationPlan(template, verticalMatch.definition),
    antiGenericGuardrails: buildGuardrails(template, verticalMatch.definition),
    qaChecklist: buildQaChecklist(template),
    warnings,
    confidence,
  };
}

export async function writeAutoDesignRecipe(
  slug: string,
  options: WriteAutoDesignOptions = {},
): Promise<AutoDesignResult> {
  const rootDir = options.rootDir ?? process.cwd();
  const safeSlug = parseSlug(slug);
  const outDir = resolveFromRoot(rootDir, options.outDir ?? path.join("data", "clients"));
  const recipe = await buildAutoDesignRecipe(safeSlug, options);
  const jsonPath = path.join(outDir, `${safeSlug}.design.json`);
  const markdownPath = path.join(outDir, `${safeSlug}.design.md`);

  if (!options.force && !options.dryRun) {
    await assertDoesNotExist(jsonPath);
    await assertDoesNotExist(markdownPath);
  }

  if (!options.dryRun) {
    await mkdir(outDir, { recursive: true });
    await writeFile(jsonPath, `${JSON.stringify(recipe, null, 2)}\n`, "utf8");
    await writeFile(markdownPath, renderAutoDesignMarkdown(recipe), "utf8");
  }

  return {
    slug: safeSlug,
    jsonPath,
    markdownPath,
    recipe,
  };
}

export function renderAutoDesignMarkdown(recipe: AutoDesignRecipe): string {
  const refRows = recipe.selectedReferences
    .map((reference) => {
      const shots = [
        reference.screenshots.desktop ? `desktop: ${reference.screenshots.desktop.path}` : "",
        reference.screenshots.mobile ? `mobile: ${reference.screenshots.mobile.path}` : "",
      ]
        .filter(Boolean)
        .join("<br>");
      return `| ${escapeMarkdownCell(reference.role)} | ${escapeMarkdownCell(reference.sourceName)} | ${escapeMarkdownCell(reference.title)} | ${escapeMarkdownCell(reference.url)} | ${escapeMarkdownCell(reference.licenseStatus)} | ${escapeMarkdownCell(reference.whySelected.join("; "))} | ${escapeMarkdownCell(shots || "sin screenshot")} |`;
    })
    .join("\n");

  const codeRows = recipe.codeReferences
    .map((code) => {
      const signals = [
        code.signals.type,
        code.signals.hasTailwind ? "tailwind" : "",
        code.signals.hasMotion ? "motion" : "",
        code.signals.hasShadcn ? "shadcn" : "",
      ]
        .filter(Boolean)
        .join(", ");
      return `| ${escapeMarkdownCell(code.repo)} | ${escapeMarkdownCell(code.file)} | ${escapeMarkdownCell(code.license)} | ${escapeMarkdownCell(signals)} | ${escapeMarkdownCell(code.whySelected.join("; "))} |`;
    })
    .join("\n");

  const sectionRows = recipe.sectionPlan
    .map(
      (section) =>
        `| ${escapeMarkdownCell(section.label)} | ${escapeMarkdownCell(section.objective)} | ${escapeMarkdownCell(section.pattern)} | ${escapeMarkdownCell(section.dataNeeded.join(", "))} |`,
    )
    .join("\n");

  return `# Auto Design Recipe - ${recipe.client.name}

Generated: ${recipe.generatedAt}

## Decision

- Slug: \`${recipe.client.slug}\`
- Template: \`${recipe.client.template}\`
- Rubro inferido: ${recipe.client.verticalLabel} (${recipe.client.inferredVertical})
- Confianza vertical: ${recipe.client.verticalConfidence}
- Objetivo: ${recipe.designRead.objective}
- Direccion visual: ${recipe.designRead.visualDirection}
- Tesis de conversion: ${recipe.designRead.conversionThesis}
- Riesgo generico a evitar: ${recipe.designRead.genericRisk}

## Dials

- Conversion: ${recipe.dials.conversionDensity}
- Densidad visual: ${recipe.dials.visualDensity}
- Motion: ${recipe.dials.motionIntensity}
- Tono de confianza: ${recipe.dials.trustTone}

## Referencias Seleccionadas

| Rol | Fuente | Titulo | URL | Licencia | Por que | Screenshots |
|---|---|---|---|---|---|---|
${refRows || "| - | - | - | - | - | - | - |"}

## Codigo Referencial Permitido

| Repo | Archivo | Licencia | Senales | Por que |
|---|---|---|---|---|
${codeRows || "| - | - | - | - | - |"}

Regla: usar estos archivos solo como referencia compatible despues de review, retokenizacion, accessibility check y responsive QA.

## Plan De Secciones

| Seccion | Objetivo | Patron | Datos necesarios |
|---|---|---|---|
${sectionRows}

## Tokens

- Heading: ${recipe.tokenDirection.fonts.heading}
- Body: ${recipe.tokenDirection.fonts.body}
- Senales de fuentes: ${recipe.tokenDirection.fonts.referenceSignals.join(", ") || "sin senales"}
- Paleta: primary ${recipe.tokenDirection.palette.primary}, secondary ${recipe.tokenDirection.palette.secondary}, accent ${recipe.tokenDirection.palette.accent}, bg ${recipe.tokenDirection.palette.bg}, fg ${recipe.tokenDirection.palette.fg}

## Media

### Requerida
${recipe.mediaPlan.required.map((item) => `- ${item}`).join("\n") || "- Sin media requerida adicional."}

### Opcional
${recipe.mediaPlan.optional.map((item) => `- ${item}`).join("\n") || "- Sin media opcional."}

### Pedidos De Generacion
${recipe.mediaPlan.generationRequests.map((item) => `- ${item}`).join("\n") || "- No hace falta pedir generacion ahora."}

## Implementacion
${recipe.implementationPlan.map((item) => `- ${item}`).join("\n")}

## Guardrails
${recipe.antiGenericGuardrails.map((item) => `- ${item}`).join("\n")}

## QA
${recipe.qaChecklist.map((item) => `- ${item}`).join("\n")}

## Warnings
${recipe.warnings.map((item) => `- ${item}`).join("\n") || "- Sin warnings."}
`;
}

function inferTemplate(client: ClientProfile): WebFactoryTemplate {
  return client.productos.length ? "store" : "landing";
}

function inferVertical(client: ClientProfile, context: string, template: WebFactoryTemplate) {
  const text = normalizeText(
    [
      client.nombre,
      client.tagline,
      client.descripcion,
      client.categorias.join(" "),
      client.beneficios.join(" "),
      client.productos
        .map((product) =>
          [
            product.titulo,
            product.categoria,
            product.desc,
            product.marca,
            product.uso,
            product.beneficios.join(" "),
            product.idealPara.join(" "),
            product.ingredientesClave.join(" "),
          ].join(" "),
        )
        .join(" "),
      client.servicios.map((service) => `${service.titulo} ${service.desc}`).join(" "),
      client.referencias.map((reference) => `${reference.title} ${reference.url} ${reference.use}`).join(" "),
      context,
    ].join(" "),
  );

  const scored = VERTICALS.map((definition) => {
    const matchedKeywords = definition.keywords.filter((keyword) => text.includes(normalizeText(keyword)));
    let score = matchedKeywords.length * 4;

    if (template === "store" && definition.storeBias) {
      score += 10;
    }

    if (client.productos.length && definition.productBias) {
      score += 8;
    }

    if (definition.id === "local-services") {
      score += 1;
    }

    return { definition, score, matchedKeywords };
  }).sort((a, b) => b.score - a.score);

  const winner = scored[0] ?? {
    definition: VERTICALS[VERTICALS.length - 1],
    score: 1,
    matchedKeywords: [],
  };

  return {
    ...winner,
    confidence: Math.min(1, Number((winner.score / 42).toFixed(2))),
  };
}

function selectVisualReferences(
  client: ClientProfile,
  vertical: VerticalDefinition,
  intelligence: DesignIntelligence,
): AutoDesignReference[] {
  const summariesById = new Map(
    (intelligence.sourceSummaries ?? []).map((summary) => [summary.id ?? summary.name ?? "", summary]),
  );
  const clientReferences = client.referencias.map((reference, index) => {
    const matchedExample = findMatchingExample(reference.url, intelligence.topExamples ?? []);
    return normalizeClientReference(reference, index, matchedExample);
  });
  const usedUrls = new Set(clientReferences.map((reference) => normalizeUrl(reference.url)));
  const scoredExamples = (intelligence.topExamples ?? [])
    .filter((example): example is VisualExample & { url: string } => Boolean(example.url))
    .map((example) => scoreVisualExample(example, vertical, client, summariesById.get(example.sourceId ?? "")))
    .filter((reference) => !usedUrls.has(normalizeUrl(reference.url)))
    .sort((a, b) => b.score - a.score);
  const selected = [...clientReferences];
  const sourceCount = new Map<string, number>();
  const pageReferences = scoredExamples.filter(isPageGalleryReference);
  const preferredPageReferences = [...pageReferences].sort(
    (a, b) => pageReferencePriority(b) - pageReferencePriority(a) || b.score - a.score,
  );
  const typographyReferences = scoredExamples.filter((reference) => reference.role === "typography");
  const componentReferences = scoredExamples.filter(
    (reference) => !isPageGalleryReference(reference) && ["component", "motion"].includes(reference.role),
  );

  for (const reference of selected) {
    sourceCount.set(reference.sourceName, (sourceCount.get(reference.sourceName) ?? 0) + 1);
  }

  addReferences(selected, sourceCount, preferredPageReferences, 5, 1);
  addReferences(selected, sourceCount, pageReferences, 6, 1);
  addReferences(selected, sourceCount, typographyReferences, 7, 1);
  addReferences(selected, sourceCount, componentReferences, 8, 1);
  addReferences(selected, sourceCount, scoredExamples, 8, 1);

  return selected.slice(0, 8);
}

function addReferences(
  selected: AutoDesignReference[],
  sourceCount: Map<string, number>,
  candidates: AutoDesignReference[],
  maxTotal: number,
  maxPerSource = 2,
): void {
  const usedUrls = new Set(selected.map((reference) => normalizeUrl(reference.url)));

  for (const reference of candidates) {
    if (selected.length >= maxTotal || selected.length >= 8) {
      break;
    }

    const url = normalizeUrl(reference.url);
    if (usedUrls.has(url)) {
      continue;
    }

    const count = sourceCount.get(reference.sourceName) ?? 0;
    if (count >= maxPerSource) {
      continue;
    }

    selected.push(reference);
    usedUrls.add(url);
    sourceCount.set(reference.sourceName, count + 1);
  }
}

function normalizeClientReference(
  reference: ClientProfile["referencias"][number],
  index: number,
  matchedExample?: VisualExample,
): AutoDesignReference {
  const screenshots = matchedExample?.screenshots ?? {};
  const topFonts = matchedExample?.topFonts ?? [];
  const ctas = matchedExample?.ctas ?? [];
  const codeLinks = normalizeCodeLinks(matchedExample?.codeLinks ?? []);
  const whySelected = [
    "referencia exacta entregada en el brief",
    reference.use ? `usar: ${reference.use}` : "usar como direccion visual declarada",
    reference.avoid ? `evitar: ${reference.avoid}` : "evitar copia de identidad o assets",
  ];

  return {
    role: "client-reference",
    sourceName: reference.title || getHostname(reference.url) || `Referencia ${index + 1}`,
    title: reference.title || reference.url,
    url: reference.url,
    licenseStatus: matchedExample?.licenseStatus ?? "client-provided-reference-review-required",
    reuseGuidance: [reference.use ? `Use: ${reference.use}` : "", reference.avoid ? `Avoid: ${reference.avoid}` : ""]
      .filter(Boolean)
      .join(" | "),
    screenshots,
    headings: matchedExample?.headings ?? [],
    ctas,
    topFonts,
    motionSignals: matchedExample?.animationSignals ?? [],
    codeLinks,
    qualityWarnings: matchedExample?.qualityWarnings ?? [],
    whySelected,
    score: 100 - index,
  };
}

function scoreVisualExample(
  example: VisualExample & { url: string },
  vertical: VerticalDefinition,
  client: ClientProfile,
  summary?: SourceSummary,
): AutoDesignReference {
  const text = normalizeText(
    [
      example.sourceName,
      example.title,
      example.description,
      example.url,
      example.headings?.join(" "),
      example.ctas?.join(" "),
      example.reuseGuidance,
      summary?.mode,
      summary?.usage,
    ].join(" "),
  );
  const matchedKeywords = vertical.keywords.filter((keyword) => text.includes(normalizeText(keyword)));
  const whySelected: string[] = [];
  let score = matchedKeywords.length * 5;

  if (matchedKeywords.length) {
    whySelected.push(`coincide con rubro: ${matchedKeywords.slice(0, 5).join(", ")}`);
  }

  if (example.screenshots?.desktop) {
    score += 12;
    whySelected.push("tiene screenshot desktop");
  }

  if (example.screenshots?.mobile) {
    score += 10;
    whySelected.push("tiene screenshot mobile");
  }

  if ((example.topFonts ?? []).length) {
    score += 4;
    whySelected.push("aporta senales de fuente");
  }

  if ((example.ctas ?? []).length) {
    score += 3;
    whySelected.push("aporta CTAs reales");
  }

  if ((example.animationSignals ?? []).length) {
    score += 5;
    whySelected.push("aporta senales de motion");
  }

  if ((example.codeBlockCount ?? 0) > 0 || (example.codeLinks ?? []).length) {
    score += 4;
    whySelected.push("aporta links o bloques de codigo para estudiar");
  }

  if (isProductiveSource(example.sourceName ?? "", example.url)) {
    score += 6;
    whySelected.push("fuente fuerte para patrones web");
  }

  const exactClientRef = client.referencias.some((reference) => sameHostOrUrl(reference.url, example.url));
  if (exactClientRef) {
    score += 40;
    whySelected.push("coincide con referencia exacta del cliente");
  }

  const license = normalizeText(example.licenseStatus ?? "");
  if (license.includes("mit") || license.includes("repo-available")) {
    score += 4;
    whySelected.push("tiene pista de codigo reusable con review");
  }

  if (license.includes("noncommercial")) {
    score -= 16;
    whySelected.push("solo estudio visual por licencia no comercial");
  }

  if (license.includes("overdesign")) {
    score -= 4;
    whySelected.push("requiere simplificar para ONIA");
  }

  score -= (example.qualityWarnings ?? []).length * 3;

  if (!whySelected.length) {
    whySelected.push("referencia complementaria para variacion visual");
  }

  return {
    role: pickReferenceRole(example, vertical),
    sourceName: example.sourceName ?? summary?.name ?? getHostname(example.url) ?? "Referencia",
    title: example.title ?? example.url,
    url: example.url,
    licenseStatus: example.licenseStatus ?? summary?.licenseStatus ?? "review-required",
    reuseGuidance:
      example.reuseGuidance ??
      summary?.usage ??
      "Extraer estructura, ritmo, CTAs y senales visuales. No copiar assets ni identidad.",
    screenshots: example.screenshots ?? {},
    headings: example.headings ?? [],
    ctas: example.ctas ?? [],
    topFonts: example.topFonts ?? [],
    motionSignals: example.animationSignals ?? [],
    codeLinks: normalizeCodeLinks(example.codeLinks ?? []),
    qualityWarnings: example.qualityWarnings ?? [],
    whySelected,
    score,
  };
}

function selectCodeReferences(
  codePack: ComponentCodePack,
  vertical: VerticalDefinition,
  motionIntensity: DesignDial,
): AutoDesignCodeReference[] {
  const references: AutoDesignCodeReference[] = [];

  for (const repo of codePack.repositories ?? []) {
    if (repo.status !== "allowed-after-review") {
      continue;
    }

    for (const example of repo.examples ?? []) {
      const file = example.relativePath ?? "";
      if (!file) {
        continue;
      }

      const score = scoreCodeExample(repo, example, vertical, motionIntensity);
      const whySelected = explainCodeExample(repo, example, vertical, motionIntensity);
      references.push({
        repo: repo.name ?? "unknown-repo",
        license: repo.license ?? "unknown",
        status: repo.status,
        localPath: repo.localPath ?? "",
        file,
        sha256: example.sha256 ?? "",
        signals: {
          type: example.signals?.type,
          hasTailwind: example.signals?.hasTailwind,
          hasMotion: example.signals?.hasMotion,
          hasShadcn: example.signals?.hasShadcn,
          imports: example.signals?.imports ?? [],
          exports: example.signals?.exports ?? [],
        },
        samplePreview: trimSample(example.sample ?? ""),
        whySelected,
        reuseRule:
          "Allowed only after manual code review, retokenization, dependency check, accessibility check and responsive QA.",
        score,
      });
    }
  }

  return references.sort((a, b) => b.score - a.score).slice(0, 10);
}

function scoreCodeExample(
  repo: ComponentRepository,
  example: ComponentExample,
  vertical: VerticalDefinition,
  motionIntensity: DesignDial,
): number {
  const file = normalizeText(example.relativePath ?? "");
  const repoName = normalizeText(repo.name ?? "");
  const signals = example.signals ?? {};
  let score = 0;

  if (repo.license?.toLowerCase().includes("mit")) {
    score += 8;
  }

  if (signals.type === "react-component") {
    score += 5;
  }

  if (signals.hasTailwind) {
    score += 5;
  }

  if (signals.hasShadcn) {
    score += 4;
  }

  if (signals.hasMotion && motionIntensity !== "low") {
    score += 7;
  }

  for (const keyword of codeKeywordsForVertical(vertical.id)) {
    if (file.includes(keyword) || repoName.includes(keyword)) {
      score += 5;
    }
  }

  if (file.includes("button") || file.includes("card") || file.includes("accordion")) {
    score += 4;
  }

  return score;
}

function explainCodeExample(
  repo: ComponentRepository,
  example: ComponentExample,
  vertical: VerticalDefinition,
  motionIntensity: DesignDial,
): string[] {
  const file = normalizeText(example.relativePath ?? "");
  const signals = example.signals ?? {};
  const reasons: string[] = [];

  if (repo.license?.toLowerCase().includes("mit")) {
    reasons.push("licencia MIT");
  }

  if (signals.hasTailwind) {
    reasons.push("compatible con Tailwind/tokenizacion");
  }

  if (signals.hasShadcn) {
    reasons.push("patron shadcn revisable");
  }

  if (signals.hasMotion && motionIntensity !== "low") {
    reasons.push("motion reusable con reduced-motion check");
  }

  const matched = codeKeywordsForVertical(vertical.id).filter((keyword) => file.includes(keyword));
  if (matched.length) {
    reasons.push(`match de componente: ${matched.slice(0, 4).join(", ")}`);
  }

  if (!reasons.length) {
    reasons.push("componente base reusable despues de review");
  }

  return reasons;
}

function buildDials(
  vertical: VerticalDefinition,
  template: WebFactoryTemplate,
  client: ClientProfile,
): AutoDesignRecipe["dials"] {
  return {
    conversionDensity: template === "store" || client.productos.length > 4 ? "high" : vertical.dials.conversionDensity,
    visualDensity: vertical.dials.visualDensity,
    motionIntensity: client.heroVideo ? "low" : vertical.dials.motionIntensity,
    trustTone: vertical.trustTone,
  };
}

function buildTokenDirection(
  client: ClientProfile,
  references: AutoDesignReference[],
  intelligence: DesignIntelligence,
  vertical: VerticalDefinition,
): AutoDesignRecipe["tokenDirection"] {
  const referenceFonts = getUnique(
    [
      ...references.flatMap((reference) => reference.topFonts),
      ...(intelligence.globalSignals?.topFonts ?? []).map((font) => font.value),
    ].filter(Boolean),
  ).slice(0, 8);

  return {
    fonts: {
      heading: client.tipografia.heading,
      body: client.tipografia.body,
      referenceSignals: referenceFonts,
    },
    palette: {
      primary: client.colores.primary,
      secondary: client.colores.secondary,
      accent: client.colores.accent,
      bg: client.colores.bg,
      fg: client.colores.fg,
      usage: [
        "Primary para CTA principal y estados activos.",
        "Secondary para texto fuerte, nav o superficies de confianza.",
        "Accent solo para una familia de accion o senal comercial; evitar que todo sea del mismo tono.",
        vertical.id === "skincare-ecommerce"
          ? "Fondos limpios con contraste suficiente para packshots."
          : "Fondos sobrios con contraste visible en mobile.",
      ],
    },
    layout: vertical.layout,
    componentBehavior: vertical.componentBehavior,
    motion: vertical.motion,
  };
}

function buildMediaPlan(client: ClientProfile, vertical: VerticalDefinition): AutoDesignRecipe["mediaPlan"] {
  const required = [...vertical.requiredMedia];
  const optional = [...vertical.optionalMedia];
  const generationRequests: string[] = [];

  if (!client.heroPoster && !client.heroVideo) {
    generationRequests.push(
      `Pedir o generar asset hero para ${client.nombre}: visual real del rubro, limpio, con espacio para copy y sin logos de terceros.`,
    );
  }

  if (client.heroVideo && !client.heroPoster) {
    required.push("Poster de hero obligatorio para no cargar video pesado al inicio.");
  }

  const productsMissingImages = client.productos.filter((product) => !product.imagen);
  if (productsMissingImages.length) {
    required.push(`${productsMissingImages.length} producto(s) sin imagen en catalogo.`);
    generationRequests.push(
      `Pedir fotos o generar placeholders aprobados para: ${productsMissingImages
        .slice(0, 6)
        .map((product) => product.titulo)
        .join(", ")}.`,
    );
  }

  return {
    required: getUnique(required),
    optional: getUnique(optional),
    generationRequests: getUnique(generationRequests),
  };
}

function buildImplementationPlan(template: WebFactoryTemplate, vertical: VerticalDefinition): string[] {
  return [
    "Abrir screenshots desktop y mobile seleccionados antes de tocar layout.",
    "Elegir una referencia para estructura, una para tipografia/densidad, una para motion o componentes.",
    "Reconstruir patrones con tokens de ONIA; no pegar HTML/CSS cerrado de referencias inspiration-only.",
    "Usar solo codigo de repos `allowed-after-review` y registrar archivo exacto usado.",
    "Mapear cada seccion del plan a datos reales del cliente; eliminar secciones sin dato util.",
    template === "store"
      ? "Validar catalogo, carrito/cotizacion, productos sin imagen, precios y CTA de WhatsApp."
      : "Validar hero, servicios, prueba/confianza y CTA principal.",
    `Aplicar direccion del rubro: ${vertical.visualDirection}`,
  ];
}

function buildGuardrails(template: WebFactoryTemplate, vertical: VerticalDefinition): string[] {
  return [
    "No copiar identidad, copy, imagenes, videos, logos, claims ni estructura reconocible de terceros.",
    "No usar tres cards iguales si no cambian la decision del cliente.",
    "No usar gradientes genericos ni paletas de un solo tono como solucion visual principal.",
    "Primer viewport debe tener una senal real del negocio: producto, lugar, equipo, dashboard, proyecto o resultado.",
    "Todo video debe tener poster, carga diferida y respeto a `prefers-reduced-motion`.",
    "Cada bloque debe justificar venta, confianza, entendimiento de alcance o siguiente paso.",
    template === "store"
      ? "No publicar producto sin imagen o precio/estado comercial claro salvo que sea cotizacion asistida."
      : "No inventar metricas, clientes, testimonios ni resultados.",
    `Riesgo especifico: ${vertical.genericRisk}`,
  ];
}

function buildQaChecklist(template: WebFactoryTemplate): string[] {
  return [
    "Correr `pnpm test`.",
    "Generar preview con `pnpm generate <slug> --template <landing|store>` o `pnpm factory:build`.",
    "Revisar desktop y mobile con screenshot antes de enviar a cliente.",
    "Confirmar que no hay imagenes rotas ni videos con carga inmediata pesada.",
    "Confirmar contraste, foco visible, labels en forms y CTA accesible.",
    "Confirmar que cada URL externa abre y que WhatsApp/email funcionan.",
    template === "store"
      ? "Probar agregar producto, abrir carrito, quitar producto y checkout/cotizacion."
      : "Probar nav, CTA primario y secciones de servicio/contacto.",
  ];
}

function buildWarnings(
  client: ClientProfile,
  references: AutoDesignReference[],
  codeReferences: AutoDesignCodeReference[],
  mediaPlan: AutoDesignRecipe["mediaPlan"],
  intelligence: DesignIntelligence,
  codePack: ComponentCodePack,
): string[] {
  const warnings: string[] = [];

  if (!(intelligence.topExamples ?? []).length) {
    warnings.push("No hay topExamples en latest-design-intelligence.json; correr pnpm references:harvest:daily.");
  }

  if (!(codePack.repositories ?? []).length) {
    warnings.push("No hay repos de codigo indexados; correr pnpm references:code-index y pnpm references:code-examples.");
  }

  if (!client.referencias.length) {
    warnings.push("El cliente no tiene referencias exactas registradas.");
  }

  if (!references.some((reference) => reference.screenshots.desktop || reference.screenshots.mobile)) {
    warnings.push("Las referencias seleccionadas no tienen screenshots; capturar antes de disenar.");
  }

  if (!codeReferences.length) {
    warnings.push("No hay codigo permitido seleccionado; construir componentes desde el sistema local.");
  }

  if (mediaPlan.generationRequests.length) {
    warnings.push("Faltan assets visuales; pedirlos o generarlos antes de entrega profesional.");
  }

  return warnings;
}

function buildConfidence(
  references: AutoDesignReference[],
  codeReferences: AutoDesignCodeReference[],
  mediaPlan: AutoDesignRecipe["mediaPlan"],
  warnings: string[],
  verticalScore: number,
): AutoDesignRecipe["confidence"] {
  const screenshotRefs = references.filter((reference) => reference.screenshots.desktop || reference.screenshots.mobile).length;
  const clientRefs = references.filter((reference) => reference.role === "client-reference").length;
  let score = 35 + Math.min(verticalScore, 30) + screenshotRefs * 5 + clientRefs * 3 + Math.min(codeReferences.length, 6) * 2;

  score -= mediaPlan.generationRequests.length * 6;
  score -= warnings.length * 3;
  score = Math.max(10, Math.min(95, Math.round(score)));

  const reasons = [
    `${references.length} referencias seleccionadas`,
    `${screenshotRefs} referencias con screenshot`,
    `${codeReferences.length} archivos de codigo permitidos como referencia`,
    `${mediaPlan.generationRequests.length} pedidos de media pendientes`,
  ];

  return { score, reasons };
}

function findMatchingExample(url: string, examples: VisualExample[]): VisualExample | undefined {
  return examples.find((example) => example.url && sameHostOrUrl(url, example.url));
}

function pickReferenceRole(example: VisualExample, vertical: VerticalDefinition): AutoDesignReference["role"] {
  const text = normalizeText([example.title, example.description, example.url, example.sourceName].join(" "));

  if ((example.animationSignals ?? []).length || text.includes("motion") || text.includes("animated")) {
    return "motion";
  }

  if ((example.topFonts ?? []).length && (text.includes("font") || text.includes("typography"))) {
    return "typography";
  }

  if (vertical.id === "skincare-ecommerce" && (text.includes("shop") || text.includes("product") || text.includes("ecommerce"))) {
    return "conversion";
  }

  if (text.includes("component") || text.includes("shadcn") || text.includes("registry")) {
    return "component";
  }

  return "structure";
}

function isProductiveSource(sourceName: string, url: string): boolean {
  const text = normalizeText(`${sourceName} ${url}`);
  return [
    "lapa",
    "landingfolio",
    "saasframe",
    "saas landing",
    "mobbin",
    "shadcn",
    "magic ui",
    "componentry",
    "awwwards",
    "recent design",
  ].some((source) => text.includes(source));
}

function isPageGalleryReference(reference: AutoDesignReference): boolean {
  const text = normalizeText(`${reference.sourceName} ${reference.title} ${reference.url}`);

  if (
    [
      "lapa",
      "landingfolio",
      "saasframe",
      "saas landing",
      "mobbin",
      "awwwards",
      "recent design",
      "dribbble",
      "10x",
    ].some((source) => text.includes(source))
  ) {
    return true;
  }

  return ![
    "componentry",
    "magic ui",
    "shadcn",
    "registry",
    "21st",
    "efferd",
    "fontpair",
    "watermelon",
  ].some((source) => text.includes(source));
}

function pageReferencePriority(reference: AutoDesignReference): number {
  const text = normalizeText(`${reference.sourceName} ${reference.title} ${reference.url}`);
  const priorities: Array<[string, number]> = [
    ["lapa", 100],
    ["saasframe", 94],
    ["saas landing", 92],
    ["landingfolio", 88],
    ["mobbin", 84],
    ["recent design", 78],
    ["awwwards", 72],
    ["dribbble", 54],
    ["10x", 48],
  ];
  const match = priorities.find(([source]) => text.includes(source));

  return match?.[1] ?? 40;
}

function codeKeywordsForVertical(vertical: VerticalId): string[] {
  switch (vertical) {
    case "skincare-ecommerce":
      return ["product", "card", "cart", "pricing", "accordion", "drawer", "carousel", "shop", "badge"];
    case "restaurant-hospitality":
      return ["menu", "gallery", "reservation", "card", "carousel", "button", "calendar"];
    case "clinic-health":
      return ["accordion", "form", "card", "testimonial", "calendar", "dialog", "button"];
    case "engineering-industrial":
      return ["timeline", "stats", "grid", "card", "case", "project", "accordion"];
    case "saas-b2b":
      return ["pricing", "feature", "hero", "dashboard", "tabs", "marquee", "accordion", "button"];
    default:
      return ["hero", "card", "button", "accordion", "form", "feature"];
  }
}

async function readJsonFile<T>(filePath: string, warnings: string[]): Promise<T> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    warnings.push(`${filePath} no se pudo leer: ${error instanceof Error ? error.message : String(error)}`);
    return {} as T;
  }
}

async function readOptional(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

async function assertDoesNotExist(filePath: string): Promise<void> {
  try {
    await access(filePath);
  } catch {
    return;
  }

  throw new Error(`${filePath} already exists. Use --force to overwrite.`);
}

function resolveFromRoot(rootDir: string, value: string): string {
  return path.isAbsolute(value) ? value : path.join(rootDir, value);
}

function normalizeCodeLinks(links: Array<{ url?: string; text?: string }>): Array<{ url: string; text: string }> {
  return links
    .filter((link): link is { url: string; text?: string } => Boolean(link.url))
    .slice(0, 8)
    .map((link) => ({
      url: link.url,
      text: link.text ?? "",
    }));
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeUrl(value: string): string {
  try {
    const url = new URL(value);
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return value.trim().replace(/\/$/, "");
  }
}

function sameHostOrUrl(left: string, right: string): boolean {
  const normalizedLeft = normalizeUrl(left);
  const normalizedRight = normalizeUrl(right);

  if (normalizedLeft === normalizedRight) {
    return true;
  }

  return Boolean(getHostname(left) && getHostname(left) === getHostname(right));
}

function getHostname(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getUnique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function trimSample(sample: string): string {
  const normalized = sample.replace(/\r\n/g, "\n").trim();
  if (normalized.length <= 900) {
    return normalized;
  }

  return `${normalized.slice(0, 900)}\n/* sample truncated in recipe */`;
}

function escapeMarkdownCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}
