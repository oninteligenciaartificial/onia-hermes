import type {
  DailyAction,
  EvidenceGate,
  Idea,
  Income,
  Lead,
  Note,
  NuviaClosureRule,
  OperatingCenter,
  OperationSnapshot,
  PaymentCadence,
  PayoutRule,
  PlaybookItem,
  RequirementGroup,
  SellerNavigationItem,
  SellerScreen,
  ServiceScope,
  WeeklyTarget,
  WebDiagnostic,
} from "./types";

export const sellerNavigation: SellerNavigationItem[] = [
  { id: "inicio", href: "/vendedores", label: "Inicio", detail: "Resumen diario" },
  { id: "operacion", href: "/vendedores/operacion", label: "Operacion", detail: "60 dias" },
  { id: "captura", href: "/vendedores/captura", label: "Captura", detail: "Nuevo prospecto" },
  { id: "leads", href: "/vendedores/pipeline", label: "Pipeline", detail: "Seguimientos" },
  { id: "webs", href: "/vendedores/webs", label: "Webs", detail: "Diagnostico" },
  { id: "notas", href: "/vendedores/notas", label: "Notas", detail: "Llamadas" },
  { id: "ideas", href: "/vendedores/ideas", label: "Ideas", detail: "Oportunidades" },
  { id: "ingresos", href: "/vendedores/ingresos", label: "Ingresos", detail: "Comisiones" },
  { id: "biblioteca", href: "/vendedores/reglas", label: "Reglas", detail: "Venta segura" },
  { id: "requerimientos", href: "/vendedores/requerimientos", label: "Requerimientos", detail: "Para operar" },
];

export const sellerScreens: Record<string, SellerScreen> = {
  inicio: {
    label: "Sales Desk operativo",
    title: "ONIA Panel de Vendedores",
    description:
      "Centro diario para saber que vender, a quien llamar, que falta validar y cuanto dinero/comision esta en juego.",
    tags: ["Notion oficial hoy", "Supabase preparado", "Seguimiento diario"],
    primaryAction: { href: "/vendedores/captura", label: "Nuevo lead" },
  },
  operacion: {
    label: "Acuerdo operativo",
    title: "Operacion 60 dias Arthur / ONIA / Nuvia",
    description:
      "Vista de control para que roles, caja, Nuvia, comisiones, contenido obligatorio y pagos se manejen con evidencia y sin discusiones.",
    tags: ["60 dias", "Caja primero", "Evidencia obligatoria"],
    primaryAction: { href: "/vendedores/ingresos", label: "Ver ingresos" },
  },
  captura: {
    label: "Entrada comercial",
    title: "Captura de prospectos",
    description:
      "Pantalla para registrar leads sin improvisar: datos minimos, dolor probable, canal, rubro y siguiente validacion.",
    tags: ["5 campos minimos", "Sin promesas tecnicas", "Listo para investigar"],
    primaryAction: { href: "/vendedores/pipeline", label: "Ver pipeline" },
  },
  leads: {
    label: "Operacion de ventas",
    title: "Pipeline y seguimientos",
    description:
      "Vista para priorizar llamadas, demos, propuestas y clientes con datos incompletos antes de moverlos a cierre.",
    tags: ["Prioridad", "Siguiente accion", "Datos completos"],
    primaryAction: { href: "/vendedores/captura", label: "Registrar lead" },
  },
  webs: {
    label: "Diagnostico comercial",
    title: "Venta de webs y sistemas",
    description:
      "Pantalla para diferenciar landing, web profesional, CRM, automatizacion o sistema antes de cotizar mal.",
    tags: ["Web", "CRM", "Automatizacion", "Discovery"],
    primaryAction: { href: "/vendedores/requerimientos", label: "Ver requerimientos" },
  },
  notas: {
    label: "Memoria de llamadas",
    title: "Notas, objeciones y promesas",
    description:
      "Registro de lo importante de cada llamada para proteger margen, reputacion y continuidad operativa.",
    tags: ["Objeciones", "Promesas", "Preguntas tecnicas"],
    primaryAction: { href: "/vendedores/reglas", label: "Ver reglas" },
  },
  ideas: {
    label: "Aprendizaje comercial",
    title: "Ideas, nichos y oportunidades",
    description:
      "Backlog de paquetes, add-ons y patrones que aparecen al vender. Las ideas se revisan antes de convertirlas en oferta.",
    tags: ["Nuevos paquetes", "Nicho", "Upsell"],
    primaryAction: { href: "/vendedores/webs", label: "Cruzar con servicios" },
  },
  ingresos: {
    label: "Control financiero",
    title: "Ingresos y comisiones",
    description:
      "Pantalla para distinguir venta hablada, cobro real, comision estimada y comision aprobada por ONIA.",
    tags: ["Cobro validado", "Primer pago", "Margen sano"],
    primaryAction: { href: "/vendedores/requerimientos", label: "Que falta para usar" },
  },
  biblioteca: {
    label: "Playbook operativo",
    title: "Reglas para vender sin riesgo",
    description:
      "Criterios para saber que puede prometer ventas, que debe escalar a Sergio y cuando no conviene cerrar rapido.",
    tags: ["No prometer de mas", "Escalar tecnico", "Comision clara"],
  },
  requerimientos: {
    label: "Arranque operativo",
    title: "Requerimientos para empezar a usar",
    description:
      "Lista concreta de datos, accesos, reglas y decisiones que ONIA necesita para pasar de maqueta operativa a panel real.",
    tags: ["Notion", "Supabase", "Roles", "Comisiones"],
  },
};

export const initialLeads: Lead[] = [
  {
    id: "lead-dental-norte",
    empresa: "Clinica Dental Norte",
    rubro: "Dental",
    ciudad: "Santa Cruz",
    canal: "WhatsApp",
    estado: "Demo agendada",
    prioridad: "alta",
    producto: "DentalGest + landing",
    dolor: "Pierde consultas por agenda manual, respuestas lentas y falta de seguimiento.",
    seguimiento: "Hoy 16:30",
    contacto: "Dra. responsable",
    valorEstimado: "Bs. 750/mes",
    siguienteAccion: "Confirmar demo, revisar agenda actual y preparar propuesta con primer mes.",
    datosCompletos: true,
  },
  {
    id: "lead-beauty-lab",
    empresa: "Beauty Lab SCZ",
    rubro: "Estetica",
    ciudad: "Santa Cruz",
    canal: "Instagram",
    estado: "Respondio",
    prioridad: "alta",
    producto: "Web Pro ONIA + CRM simple",
    dolor: "Recibe mensajes por Instagram pero no sabe que prospectos vuelven o compran.",
    seguimiento: "Manana 10:00",
    contacto: "Admin IG",
    valorEstimado: "Bs. 1,800 setup",
    siguienteAccion: "Pedir enlace actual, detectar servicios principales y proponer captacion.",
    datosCompletos: false,
  },
  {
    id: "lead-distribuidora-kai",
    empresa: "Distribuidora KAI",
    rubro: "Pyme comercial",
    ciudad: "La Paz",
    canal: "Llamada",
    estado: "Propuesta enviada",
    prioridad: "media",
    producto: "GestiOS + automatizacion",
    dolor: "Inventario, pedidos y clientes dependen de Excel y mensajes sueltos.",
    seguimiento: "Viernes 09:00",
    contacto: "Gerente operativo",
    valorEstimado: "Bs. 950/mes",
    siguienteAccion: "Cerrar alcance del primer modulo y confirmar monto de enganche.",
    datosCompletos: true,
  },
  {
    id: "lead-legal-vargas",
    empresa: "Estudio Legal Vargas",
    rubro: "Servicios profesionales",
    ciudad: "Cochabamba",
    canal: "Referido",
    estado: "Mensaje preparado",
    prioridad: "media",
    producto: "Web Profesional",
    dolor: "No tiene presencia clara, formulario ni forma ordenada de recibir consultas.",
    seguimiento: "Pendiente aprobar contacto",
    contacto: "Referido por cliente",
    valorEstimado: "Bs. 1,200 setup",
    siguienteAccion: "Sergio aprueba contacto y define si conviene auditoria primero.",
    datosCompletos: false,
  },
];

export const initialNotes: Note[] = [
  {
    id: "note-objection-web-whatsapp",
    title: "Objecion repetida",
    body: "Varios clientes preguntan si la web incluye WhatsApp, formulario y seguimiento. Responder con alcance exacto y ofrecer CRM simple como add-on.",
    type: "objecion",
    owner: "Vendedor",
    linkedLead: "General",
  },
  {
    id: "note-whatsapp-risk",
    title: "Promesa que requiere Sergio",
    body: "No prometer integracion de WhatsApp automatico sin validar BSP, numero, costo mensual, plantillas y politica de Meta.",
    type: "riesgo",
    owner: "Sergio",
    linkedLead: "Todos los leads con WhatsApp",
  },
];

export const initialIdeas: Idea[] = [
  {
    id: "idea-clinicas-pequenas",
    title: "Paquete clinicas pequenas",
    body: "Landing + agenda + mensajes preparados + seguimiento en CRM simple para clinicas que no estan listas para DentalGest completo.",
    signal: "3 consultas similares",
    stage: "revisar",
  },
  {
    id: "idea-auditoria-express",
    title: "Auditoria web express",
    body: "Diagnostico de presencia digital con plan de accion, screenshots y cotizacion de mejora en 24 horas.",
    signal: "Entrada barata",
    stage: "aprobada",
  },
  {
    id: "idea-recordatorio-telegram",
    title: "Bot de recordatorios por Telegram",
    body: "Bot privado para que el cliente reciba recordatorios de tareas, cobros, citas o seguimientos sin instalar un sistema completo.",
    signal: "Upsell liviano",
    stage: "nueva",
  },
];

export const incomes: Income[] = [
  {
    id: "income-dental-norte",
    client: "Clinica Dental Norte",
    service: "DentalGest primer mes",
    charged: "Bs. 750",
    netAmount: "Por validar",
    commission: "Pendiente",
    status: "pendiente",
    paymentDate: "Sin comprobante",
  },
  {
    id: "income-tienda-lira",
    client: "Tienda Lira",
    service: "Landing captacion",
    charged: "Bs. 1,200",
    netAmount: "Bs. 1,200",
    commission: "Bs. 180",
    status: "aprobada",
    paymentDate: "2026-06-18",
  },
  {
    id: "income-autopartes-sur",
    client: "AutoPartes Sur",
    service: "Auditoria express",
    charged: "Bs. 350",
    netAmount: "Bs. 350",
    commission: "Bs. 52.50",
    status: "pagada",
    paymentDate: "2026-06-17",
  },
];

export const webDiagnostics: WebDiagnostic[] = [
  {
    id: "has-website",
    label: "Presencia web propia",
    whyItMatters: "Sin web, el cliente depende de redes y pierde confianza cuando alguien busca la marca.",
    missingSignal: "No hay dominio, la web esta caida o solo existe Instagram.",
    offer: "Landing de Captacion o Web Profesional.",
  },
  {
    id: "whatsapp-visible",
    label: "WhatsApp visible y medible",
    whyItMatters: "La conversion se pierde si el boton no esta claro o si nadie sabe de donde vino el mensaje.",
    missingSignal: "Boton escondido, numero viejo o sin mensaje precargado.",
    offer: "CTA directo + tracking simple + script de respuesta.",
  },
  {
    id: "form-capture",
    label: "Captura estructurada",
    whyItMatters: "Formulario y CRM evitan que consultas valiosas queden enterradas en chats.",
    missingSignal: "Solo DM o WhatsApp sin nombre, servicio, fecha ni fuente.",
    offer: "CRM simple, Google Sheet operativo o mini portal.",
  },
  {
    id: "offer-clarity",
    label: "Oferta entendible",
    whyItMatters: "El visitante debe entender que compra, para quien es y que paso sigue.",
    missingSignal: "Servicios mezclados, textos genericos o precios imposibles de ubicar.",
    offer: "Auditoria Express + copy comercial.",
  },
  {
    id: "followup-system",
    label: "Seguimiento despues del contacto",
    whyItMatters: "ONIA vende sistemas, no solo paginas. El seguimiento convierte consultas en dinero.",
    missingSignal: "Nadie sabe quien respondio, cuando llamar o que se prometio.",
    offer: "Pipeline simple + recordatorios n8n/Telegram.",
  },
];

export const dailyActions: DailyAction[] = [
  {
    id: "action-operation-review",
    time: "09:30",
    title: "Actualizar Operacion 60 dias",
    detail: "Caja, deuda, Nuvia, evidencia de Arthur y tareas semanales deben quedar registradas.",
    owner: "Sergio",
    tone: "danger",
  },
  {
    id: "action-demo-dental",
    time: "16:30",
    title: "Demo DentalGest",
    detail: "Confirmar agenda, dolor principal y si pagaria primer mes hoy.",
    owner: "Vendedora",
    tone: "success",
  },
  {
    id: "action-approve-legal",
    time: "18:00",
    title: "Aprobar contacto legal",
    detail: "Sergio decide si se entra con auditoria o web directa.",
    owner: "Sergio",
    tone: "warning",
  },
  {
    id: "action-review-commissions",
    time: "Cierre",
    title: "Revisar comisiones pendientes",
    detail: "Solo aprobar cuando exista cobro real, datos completos y margen sano.",
    owner: "Admin",
    tone: "info",
  },
];

export const serviceScopes: ServiceScope[] = [
  {
    id: "scope-landing",
    service: "Landing de Captacion",
    includes: ["secciones comerciales", "formulario o WhatsApp", "copy base", "SEO tecnico basico"],
    needs: ["logo", "servicios", "fotos o referencias", "canal de contacto"],
    notIncluded: "No incluye login, base de datos compleja ni automatizacion avanzada.",
  },
  {
    id: "scope-web-pro",
    service: "Web Profesional",
    includes: ["home", "servicios", "contacto", "estructura de confianza", "responsive"],
    needs: ["dominio", "contenido aprobado", "identidad visual minima", "responsable de feedback"],
    notIncluded: "No incluye CRM interno ni portal de clientes sin discovery.",
  },
  {
    id: "scope-crm",
    service: "CRM simple",
    includes: ["pipeline", "campos basicos", "seguimientos", "reporte manual"],
    needs: ["etapas del negocio", "responsables", "fuentes de leads", "reglas de seguimiento"],
    notIncluded: "No incluye WhatsApp automatico hasta validar proveedor y costos.",
  },
];

export const playbook: PlaybookItem[] = [
  {
    id: "rule-onia-center",
    title: "ONIA Center manda",
    body: "Si no esta en ONIA Center o Notion, no cuenta para comision, cierre, Nuvia ni revision semanal.",
    detail: "El sistema debe guardar prueba, fecha, responsable y estado aprobado.",
    tone: "danger",
  },
  {
    id: "rule-commission",
    title: "Regla de comision",
    body: "La comision aplica solo sobre el primer pago realmente cobrado y validado por ONIA.",
    detail: "Si faltan datos, comprobante o margen, queda pendiente.",
    tone: "success",
  },
  {
    id: "rule-call",
    title: "Llamadas",
    body: "La vendedora hace las llamadas y registra notas. Sergio acompana solo cierres sensibles, tecnicos o de alto valor.",
    detail: "Esto protege tiempo de Sergio y entrena a ventas.",
    tone: "info",
  },
  {
    id: "rule-promises",
    title: "No prometer",
    body: "No prometer ventas garantizadas, SEO garantizado, viralidad ni WhatsApp automatico sin validacion.",
    detail: "Promesa no aprobada puede destruir margen y reputacion.",
    tone: "danger",
  },
  {
    id: "rule-web-system",
    title: "Web vs sistema",
    body: "Si hay login, dashboard, usuarios internos, base de datos o roles, no es web simple.",
    detail: "Ese caso va a discovery pagado o sistema a medida.",
    tone: "warning",
  },
];

export const operationSnapshot: OperationSnapshot = {
  trial: "60 dias",
  debt: "Control interno",
  initialInvestment: "Privado Sergio/ONIA",
  operatingCashAfterDebt: "Privado Sergio/ONIA",
  monthlyBaseExpense: "Privado Sergio/ONIA",
  pettyCash: "Segun centro aprobado",
  conservativeMonthlyNeed: "Privado Sergio/ONIA",
  runway: "No visible para colaboradores",
  monthlyNetTarget: "Ventas cobradas + Fondo ONIA",
  healthySixtyDayTarget: "Pipeline, caja y entregas aprobadas",
};

export const operatingCenters: OperatingCenter[] = [
  {
    id: "center-onia-services",
    title: "ONIA Servicios",
    owner: "Sergio direccion / Arthur ventas-operacion",
    status: "activo",
    tone: "success",
    purpose: "Webs, automatizaciones, marketing, DentalGest, GestiOS, auditorias y sistemas.",
    rules: [
      "40% Fondo ONIA protegido durante 60 dias para sostener operacion y riesgo.",
      "Arthur solo cobra si hay cobro real, CRM completo y participacion probada.",
      "Si Arthur vende y entrega todo aprobado sin capital ONIA y sin rescate: 50% Arthur, 40% Fondo ONIA, 10% Sergio.",
      "Si Sergio corrige, reestructura, termina, rescata o dirige demasiado una entrega, Arthur baja de categoria y Sergio sube segun evidencia.",
    ],
  },
  {
    id: "center-nuvia",
    title: "Nuvia",
    owner: "Sergio / Arthur 50-50 en capital e inventario",
    status: "vigilado",
    tone: "warning",
    purpose: "Producto fisico, catalogo, contenido, ventas, inventario, caja chica y cierres quincenales.",
    rules: [
      "No se mezcla con ingresos generales de ONIA.",
      "Primero se descuentan producto, transporte, bolsas, envios, caja chica y herramientas caras prorrateadas.",
      "Despues se separa 20% Fondo ONIA y 15% Reserva Nuvia.",
      "La utilidad repartible restante se divide 50% Sergio y 50% Arthur.",
    ],
  },
  {
    id: "center-media",
    title: "ONIA Media / YouTube",
    owner: "ONIA como activo base",
    status: "vigilado",
    tone: "info",
    purpose: "Canales de YouTube, contenido monetizable, sponsors, afiliados y piezas de largo plazo.",
    rules: [
      "No se paga por monetizacion hipotetica.",
      "Solo se calcula cuando plataforma, afiliado o sponsor paga realmente.",
      "Usa apps ONIA base sin duplicar gasto; solo se cargan costos incrementales o premium prorrateados.",
      "Si Arthur opera canal completo aprobado: 40% Arthur, 40% Fondo ONIA unico, 20% Sergio.",
      "Activos, guiones, prompts y cuentas quedan como ONIA Media salvo acuerdo escrito.",
    ],
  },
  {
    id: "center-cash",
    title: "Fondo ONIA y Caja Chica",
    owner: "Sergio / Administracion",
    status: "activo",
    tone: "danger",
    purpose: "Mantener viva la empresa, pagar deuda, herramientas, pruebas necesarias y gastos chicos.",
    rules: [
      "Deuda previa, apps y gastos generales son asumidos por Sergio/ONIA.",
      "Arthur no paga deuda previa ni apps de ONIA y no tiene retencion por este concepto.",
      "La existencia mensual se paga con Fondo ONIA; si no alcanza, Sergio/ONIA cubre temporalmente con capital de arranque.",
      "Excedente del Fondo ONIA recupera capital interno antes de bonos o retiros grandes.",
      "Caja chica se asigna por centro y necesita comprobante, responsable y motivo.",
      "Si ONIA entra en caja roja, se congelan compras y pagos no criticos.",
      "Todo gasto debe tener comprobante, responsable, motivo y centro asignado.",
    ],
  },
];

export const payoutRules: PayoutRule[] = [
  {
    id: "payout-lead-no-call",
    case: "Arthur solo pasa contacto",
    fund: "40%",
    arthur: "3%-5%",
    sergio: "55%-57%",
    condition: "Cuenta solo si el contacto era util, registrable y ONIA logra cerrar despues.",
  },
  {
    id: "payout-sales-delivered-onia",
    case: "Arthur llama, cierra y Sergio/ONIA entrega",
    fund: "40%",
    arthur: "12%-15%",
    sergio: "45%-48%",
    condition: "Requiere llamada/reunion, seguimiento, CRM completo y pago confirmado.",
  },
  {
    id: "payout-full-web-arthur",
    case: "Arthur cierra y entrega todo aprobado sin rescate",
    fund: "40%",
    arthur: "50%",
    sergio: "10%",
    condition: "Solo si Sergio no reestructura, termina ni rescata; si interviene fuerte, Arthur baja de categoria.",
  },
  {
    id: "payout-partial-build",
    case: "Arthur construye parte y Sergio termina",
    fund: "40%",
    arthur: "10%-20%",
    sergio: "40%-50%",
    condition: "El porcentaje depende de la parte funcional aprobada y documentada.",
  },
  {
    id: "payout-higgsfield-training",
    case: "Higgsfield/capacitacion vendida aparte",
    fund: "40%",
    arthur: "15%-35%",
    sergio: "25%-45%",
    condition: "Debe registrar objetivo, costo/prorrateo, guion, entrega y aprobacion.",
  },
  {
    id: "payout-unlisted-service",
    case: "Servicio nuevo no listado",
    fund: "40%",
    arthur: "3%-15% hasta clasificar",
    sergio: "resto",
    condition: "No hereda porcentaje alto; Sergio debe aprobar categoria, precio, alcance, costos y responsable.",
  },
  {
    id: "payout-technical-risk",
    case: "Servicio tecnico o riesgoso",
    fund: "40%",
    arthur: "5%-15% venta / 10%-25% apoyo",
    sergio: "resto",
    condition: "Aplica a sistemas, APIs, pagos, datos, credenciales, SaaS, integraciones o cliente grande.",
  },
  {
    id: "payout-cofunded-project",
    case: "Proyecto especifico cofinanciado por Arthur",
    fund: "35%-40%",
    arthur: "hasta 50%",
    sergio: "10%-15%",
    condition: "Solo si existe aprobacion escrita previa; no crea propiedad sobre ONIA general.",
  },
];

export const evidenceGates: EvidenceGate[] = [
  {
    id: "gate-crm",
    title: "CRM / ONIA Center completo",
    requiredProof: "Lead, responsable, estado, siguiente accion, fecha y notas de seguimiento.",
    blocks: "Comision, semana aprobada y cierre si falta informacion.",
    owner: "Arthur registra / Sergio aprueba",
  },
  {
    id: "gate-money",
    title: "Cobro real",
    requiredProof: "Comprobante, monto, fecha, cliente, servicio, costos directos y estado de pago.",
    blocks: "Ningun pago se hace sobre promesas o saldos no cobrados.",
    owner: "Administracion ONIA",
  },
  {
    id: "gate-delivery",
    title: "Entrega aprobada",
    requiredProof: "Link, archivo, checklist, demo, QA o aprobacion escrita del cliente/Sergio.",
    blocks: "Baja porcentaje o retiene pago cuando Sergio debe rescatar la entrega.",
    owner: "Responsable de entrega",
  },
  {
    id: "gate-costs",
    title: "Costos y caja chica",
    requiredProof: "Foto, factura, recibo, captura o nota simple con responsable y motivo.",
    blocks: "Utilidad de Nuvia, Fondo ONIA y pago personal si el gasto no esta claro.",
    owner: "Quien hizo el gasto",
  },
  {
    id: "gate-week",
    title: "Cierre semanal",
    requiredProof: "Reporte de avances, 80% de metas, CRM viernes 100% y tareas ONIA/Nuvia.",
    blocks: "Subida de porcentaje, pagos variables y continuidad despues de 60 dias.",
    owner: "Arthur / Sergio",
  },
];

export const weeklyTargets: WeeklyTarget[] = [
  {
    id: "week-prospects",
    area: "Prospeccion",
    arthur: "35 prospectos completos, 25 contactos reales y 20 seguimientos.",
    sergio: "Revisar calidad, aprobar contactos sensibles y priorizar rubros rentables.",
    status: "obligatorio",
  },
  {
    id: "week-calls",
    area: "Cierre comercial",
    arthur: "8 llamadas/audios, 3 reuniones o demos y 3 propuestas/auditorias.",
    sergio: "Entrar solo en cierres tecnicos, contratos, precios sensibles o clientes grandes.",
    status: "obligatorio",
  },
  {
    id: "week-content",
    area: "Contenido ONIA/Nuvia",
    arthur: "5 videos grabados, 2 videos Higgsfield/IA y 3 piezas/carruseles listos.",
    sergio: "Definir direccion, aprobar guiones y asegurar que el contenido venda o mejore marca.",
    status: "obligatorio",
  },
  {
    id: "week-system",
    area: "Sistema y orden",
    arthur: "CRM viernes 100%, 2 mejoras internas y 1 reporte semanal.",
    sergio: "Actualizar reglas, revisar caja, aprobar pagos y corregir el sistema cuando falte estructura.",
    status: "obligatorio",
  },
  {
    id: "week-learning",
    area: "Aprendizaje real",
    arthur: "Capacitacion, onboarding, bot, automatizacion o mejora documentada.",
    sergio: "Asignar tareas que suban nivel sin poner en riesgo clientes ni caja.",
    status: "operativo",
  },
];

export const nuviaClosureRules: NuviaClosureRule[] = [
  {
    id: "nuvia-formula",
    item: "Formula base",
    value: "Venta cobrada - producto - gastos directos - herramientas premium",
    rule: "Si el margen operativo es negativo, no hay reparto y la perdida se arrastra.",
  },
  {
    id: "nuvia-margin-alert",
    item: "Margen minimo",
    value: "30%",
    rule: "Debajo de 30% requiere aprobacion de Sergio antes de repetir esa venta.",
  },
  {
    id: "nuvia-healthy",
    item: "Margen sano",
    value: "40%+",
    rule: "Nuvia empieza a verse saludable cuando supera 40% antes de reservas.",
  },
  {
    id: "nuvia-onia-fund",
    item: "Aporte Nuvia al Fondo ONIA",
    value: "20%",
    rule: "Cubre web, catalogo, IA, automatizaciones, direccion y herramientas pagadas por ONIA.",
  },
  {
    id: "nuvia-reserve",
    item: "Reserva Nuvia",
    value: "15%",
    rule: "Reposicion, mermas, muestras, devoluciones, caja chica, fotos y crecimiento de inventario.",
  },
  {
    id: "nuvia-distribution",
    item: "Utilidad repartible",
    value: "50% Sergio / 50% Arthur",
    rule: "Solo despues de costos, Fondo ONIA, Reserva Nuvia y recuperacion de perdidas previas.",
  },
];

export const paymentCadence: PaymentCadence[] = [
  {
    id: "pay-onia-sales",
    incomeType: "Adelanto quincenal general",
    calculation: "Dias 1-15 y 16-fin de mes, sobre pago ganado/aprobable de Arthur.",
    payment: "Hasta 20% como adelanto dentro de 72 horas del corte aprobado.",
  },
  {
    id: "pay-monthly-settlement",
    incomeType: "Cierre mensual general",
    calculation: "Fin de mes con cobros, costos, entregas, reclamos y adelantos revisados.",
    payment: "Se paga el saldo restante o se compensa diferencia en el siguiente cierre.",
  },
  {
    id: "pay-web-progress",
    incomeType: "Web/automatizacion con anticipo y saldo",
    calculation: "Proporcional al dinero realmente cobrado.",
    payment: "Puede entrar al adelanto quincenal; no se paga comision sobre saldos prometidos.",
  },
  {
    id: "pay-nuvia",
    incomeType: "Nuvia",
    calculation: "Cierre quincenal de ventas/productos con utilidad aprobada.",
    payment: "Adelanto/cierre segun utilidad aprobada y ajuste final mensual si aplica.",
  },
  {
    id: "pay-media",
    incomeType: "ONIA Media / YouTube",
    calculation: "Solo sobre ingreso liquidable: cobro real menos plataforma, impuestos, costos externos y uso premium prorrateado.",
    payment: "Cierre mensual dentro de 7 dias del dinero recibido y conciliado; apps ONIA base no se descuentan dos veces.",
  },
  {
    id: "pay-onia-expenses",
    incomeType: "Deuda y apps ONIA",
    calculation: "Sergio/ONIA asume deuda previa, apps, herramientas y gastos operativos ONIA.",
    payment: "No se retiene ni descuenta comision de Arthur por deuda previa o apps de ONIA.",
  },
];

export const startupRequirements: RequirementGroup[] = [
  {
    id: "req-source",
    title: "Fuente oficial de datos",
    owner: "Sergio / Operaciones",
    priority: "obligatorio",
    items: [
      "Definir si el primer uso real se carga en Notion CRM o directamente en Supabase.",
      "Confirmar campos minimos del lead: empresa, contacto, rubro, canal, ciudad, dolor, oferta, estado, proximo paso.",
      "Definir quien puede editar estados y quien puede aprobar comisiones.",
    ],
    why: "Sin una fuente unica, ventas termina duplicando datos entre WhatsApp, Notion, hojas y el panel.",
  },
  {
    id: "req-sales-flow",
    title: "Proceso comercial minimo",
    owner: "Ventas",
    priority: "obligatorio",
    items: [
      "Usar estados claros: Nuevo, Investigado, Contactado, Respondio, Demo agendada, Propuesta enviada, Ganado o Perdido.",
      "Registrar siempre siguiente accion con fecha o criterio de seguimiento.",
      "Separar lead interesado de lead calificado; no todo contacto merece propuesta.",
    ],
    why: "El panel debe decir que hacer hoy, no solo almacenar nombres.",
  },
  {
    id: "req-commission",
    title: "Reglas de comision",
    owner: "Administracion",
    priority: "obligatorio",
    items: [
      "Comision solo sobre el primer pago realmente cobrado y validado.",
      "Registrar comprobante, fecha de pago, servicio vendido, monto neto y estado de aprobacion.",
      "Dejar pendiente cualquier comision con datos incompletos, descuento especial o margen dudoso.",
    ],
    why: "Esto evita pagar por ventas no cobradas o por promesas que despues consumen margen.",
  },
  {
    id: "req-weekly-arthur",
    title: "Requisitos semanales Arthur",
    owner: "Arthur / Sergio",
    priority: "obligatorio",
    items: [
      "Registrar 35 prospectos completos, 25 contactos reales, 20 seguimientos y 8 llamadas o audios comerciales.",
      "Agendar 3 reuniones o demos, enviar 3 propuestas/auditorias/diagnosticos y dejar 5 videos grabados para ONIA/Nuvia.",
      "Mantener CRM/ONIA Center al 100% cada viernes; sin registro no hay comision ni semana aprobada.",
    ],
    why: "El acuerdo de 60 dias necesita volumen, evidencia y seguimiento para saber si ONIA se mantiene viva.",
  },
  {
    id: "req-services",
    title: "Catalogo de servicios vendibles",
    owner: "ONIA",
    priority: "operativo",
    items: [
      "Confirmar paquetes base: landing, web profesional, CRM simple, chatbot, automatizacion, auditoria y sistemas.",
      "Definir que incluye, que no incluye, tiempo estimado, precio inicial y add-ons permitidos.",
      "Marcar que casos requieren discovery pagado antes de cotizar.",
    ],
    why: "La vendedora necesita saber que puede vender sin inventar alcance en cada llamada.",
  },
  {
    id: "req-access",
    title: "Accesos y permisos",
    owner: "Tecnico",
    priority: "operativo",
    items: [
      "Crear usuario de vendedora con permisos limitados cuando haya autenticacion.",
      "Conectar Supabase Auth/RLS antes de guardar datos privados de clientes.",
      "Definir backups y exportacion CSV semanal para leads, ingresos y notas.",
    ],
    why: "Un panel comercial va a tocar datos sensibles de clientes y dinero.",
  },
  {
    id: "req-automation",
    title: "Automatizaciones posteriores",
    owner: "Hermes / n8n",
    priority: "siguiente",
    items: [
      "Recordatorios por Telegram para leads sin seguimiento.",
      "Alertas de comision pendiente cuando hay cobro validado.",
      "Resumen diario para Sergio con leads calientes, cobros y riesgos.",
    ],
    why: "Primero se valida el proceso manual; luego se automatiza lo que se repite.",
  },
];
