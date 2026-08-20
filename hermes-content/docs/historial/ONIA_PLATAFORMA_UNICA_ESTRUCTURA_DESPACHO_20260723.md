# Estructura de Despacho — Plataforma Única ONIA (para el orquestador)

> **Carril I (research/estrategia).** Fecha: 2026-07-23. Handoff dispatch-ready para el onia-orchestrator.
> Resuelve: marca+dominio, arquitectura internacional (Bolivia→Argentina→LatAm), costos de agentes 24/7 e interfaz tipo Dapta, estudio de startups, y el reparto de carriles en paralelo + paquetes de trabajo para Artur. Todo subordinado a la disciplina de runway.
> Docs hermanos: `ONIA_PLATAFORMA_UNICA_PLAN_MAESTRO_20260723.md` (carriles técnicos) · `ONIA_PLATAFORMA_UNICA_BRIEF_DECISION_20260723.md` (decisión) · `research/ONIA_DAPTA_PLATAFORMA_UNIFICADA_20260723.md` (análisis Dapta).

## 0. La regla que manda (runway)

Runway útil ~Bs 11.000 = ~2,5-3 meses; piso Bs 4.000/mes para sobrevivir; deuda ~Bs 4.000; 0 clientes pagando. **La plata la trae DentalGest (~90%, con `dentalgest.app` ya en mano) vendido a los warm leads que YA llamaron y escribieron, no una plataforma más linda.** Regla dura: ingresos en SEMANAS, no plataforma en meses. Reparto de recursos que ordena todo — **Sergio no codea: sus horas humanas son para VENDER y destrabar trámites; los agentes IA construyen la puerta/plataforma en paralelo (carriles aislados, contra mock cuando falta el trámite); Artur produce presencia/credibilidad en carpetas totalmente separadas.** Cero gasto en dominios, créditos, plataformas o video pago sin OK explícito de Sergio. Todo build está subordinado a la venta; nada de segundo vertical, billing ni LatAm antes de que la habitación #1 tenga inquilino pagando.

## 1. Marca, empresa y dominio

**Arquitectura de marca — branded house con endoso vertical.** `Onia` = marca madre única (plataforma + producto que escala internacional). Los verticales NO son marcas separadas: se venden por su nombre de rubro (que convierte) endosados por Onia (que capitaliza). Al dentista le vendés **"DentalGest, de Onia"** (liderás con lo específico = "hecho para tu consultorio"), al comercio **"GestiOS, de Onia"**. Todo el equity suma a UN solo nombre. House-of-brands (marcas independientes) es inviable para un fundador solo pre-ingreso: multiplica SEO/PR/tráfico por marca. NO borrar los nombres verticales todavía: "DentalGest" tiene SEO y conversión propios que son activo de venta.

**"Onia Agency" = razón social / entidad legal (holding operador). NO la marca madre de cara al mercado** — "Agency" te encasilla como taller de servicios de bajo margen y techa la valuación. El brazo de servicios "hecho-por-vos" (web + ads + setup chatbot + montaje de agentes) que financia el runway se llama **"Onia Studio"** como línea DENTRO de Onia, no como techo. Jerarquía: Onia (plataforma, héroe) · DentalGest/GestiOS (verticales endosados) · Onia Studio (servicios) · Onia Agency (entidad legal detrás).

**Dominio.** Regla anti-gasto: un apex, subdominios y subcarpetas gratis; ccTLD de país solo cuando el país sea mercado validado.

| Dominio | Qué hacer | Costo |
|---|---|---|
| `dentalgest.app` | **Usar YA para vender esta semana.** Landing dental + SEO "software dental". Costo cero. | Bs 0 (en mano) |
| `onia.com.bo` | Conservar como **storefront Bolivia** (Bs, SIAT, prueba local). NO como primario internacional — un ccTLD señala "solo Bolivia". Para la Puerta usar `app.onia.com.bo` ahora: no limita alcance y señaliza que el foso es Bolivia = activo en la ventana de 60 días. | Bs 0 (en mano) |
| `gestios.hq` | **Verificar primero que `.hq` resuelve como dominio real** (no es TLD público confirmado por ICANN). Si no resuelve, GestiOS vive bajo apex de Onia (`gestios.onia.app`). | UNKNOWN |
| Primario internacional | **`onia.app`** recomendado (~Bs 105-125/año [Sup, ~$15-18]): barato, coherente con `dentalgest.app`, HTTPS forzado = señal de confianza. `onia.com` a wishlist (un 4-letras casi seguro está tomado o es premium de cientos-miles USD — disponibilidad/precio **UNKNOWN**, verificador rate-limited). NO comprar `.ai` (gasto injustificado, Onia no es un lab de modelos). | Diferido |

> **Comprar cualquier dominio internacional = gasto → requiere OK explícito de Sergio.** Verificar precio real en Cloudflare Registrar (a costo) o Namecheap antes de comprar. **No comprar ahora:** con `dentalgest.app` + `onia.com.bo` en mano se vende esta semana sin rebrand. Registrar `onia.app` recién cuando LatAm esté realmente sobre la mesa y haya cliente pagando.

## 2. Estructura internacional (Bolivia → Argentina → LatAm)

**El patrón país-pluggable YA está soportado por onia-core y se preserva como invariante de diseño, no se implementa un 2do país ahora.** El acoplamiento a Bolivia NO vive en el core (18 entidades neutras a país y rubro) sino concentrado en 4 `moduleCapabilities` (`accounting`/`tax_bolivia`, `invoicing`, `payroll`, `import_costing`) y en el `external_gate` de emisión (`siat`). Un país nuevo = un **`countryPack`** (config declarativa: código país, moneda, tipo de ID fiscal, tabla de tasas, catálogo de documentos, calendario fiscal) + **un adapter que implementa la interfaz compartida `FiscalEmitter`**. No es un fork, no toca el core ni las 18 entidades. Es el mismo patrón probado de las localizaciones fiscales de Odoo (>100 países sobre un core común).

**Argentina va DESPUÉS de validar Bolivia, no antes.** Las dos objeciones que mataron los deals ("éramos muy pequeños" = credibilidad; "el sistema muy básico" = madurez) son de Bolivia, no de geografía — abrir Argentina no arregla ninguna y multiplica la superficie a mantener (ARCA cambia reglas: `CondicionIVAReceptorId` v4.5 obligatorio, deadline AGIP ago-2026, Libro IVA Digital = mantenimiento perpetuo que no se paga con 0 ingresos). Multi-país es MOAT (se vende después a cuentas grandes), no wedge (palanca de supervivencia). Esfuerzo real de sumar Argentina: emitir una factura AR válida = **L** (dominado por el adapter WSAA cert X.509 → token → WSFEv1 SOAP → CAE); paridad contable total con IIBB multi-jurisdicción + Ganancias + planilla = **XL, se difiere**. El core (18 entidades, intake, SSO, dashboard) = **0, no se toca**.

**Qué dejar "listo para enchufar" SIN construirlo (horas dentro del trabajo de Bolivia, no semanas):** construir el SOCKET, no el PLUG.
1. Columnas en `organization`: `countryCode` (default `BO`), `currencyCode` (`BOB`), `taxIdType` (`NIT`) — migración aditiva, compatible con core congelado.
2. Formalizar la interfaz `FiscalEmitter` que el emisor SIAT ya implementa de facto (integrations/siat, 262 tests) — refactor de firma.
3. Extraer las constantes Bolivia a `bolivia.countrypack.json` (IVA 13%, IT 3%, tipos doc) en vez de literales inline — deja el motor "leyendo config".
4. Schema de tasas con **N niveles de jurisdicción** (Bolivia usa 1 nacional; Argentina agrega provincial/IIBB) — decisión de forma, minutos, evita reescritura futura.

**Nada de ARCA/WSAA/certificados/entidad argentina/contador AR hasta que haya un lead argentino con plata en la mesa.** Gatillo de expansión: ≥3-5 clínicas bolivianas pagando + 1 caso publicable + prospecto argentino con capacidad de pago.

> **Estructura legal cross-border = requiere asesor legal/fiscal real en BO y AR antes de operar; no se funda aquí.** Dimensiones a resolver con profesional (todas UNKNOWN sin counsel): modelo de operación (exportación de servicios desde BO vs constituir en AR), si un software extranjero requiere registración ante ARCA, cobro/repatriación ARS↔BOB con controles de capital, Ley 25.326 de datos personales (más sensible por datos de salud). Ventaja del modelo ya decidido: cobro a mano permite manejar caso por caso sin infra de pagos multi-moneda. Ninguno de estos costos se dispara hasta que exista demanda argentina pagante.

## 3. Agentes 24/7 + interfaz tipo Dapta: cómo se acomodan y cuánto cuestan

**El costo estable de un agente de TEXTO 24/7 NO es el problema.** El insight que define todo: desde jul-2025 WhatsApp cobra por mensaje, pero las conversaciones **iniciadas por el cliente (inbound) y tus respuestas dentro de 24h son GRATIS e ilimitadas**. Solo cuesta la plantilla que vos iniciás (Recall, Cobrador).

Modelo de costo — "clínica dental activa" (atención inbound 24/7 + Recall + Cobrador):

| Componente | Costo marginal/mes |
|---|---|
| LLM (~1.750 turnos, techo $0.006/acción litellm) | ~$10.4 |
| WhatsApp inbound (servicio) | **$0** |
| WhatsApp plantillas Utility (~380 outbound × $0.0113) | ~$4.3 |
| Infra amortizada (VPS+Supabase, ya pago) | ~$1.5 |
| **Total marginal** | **≈$16.2 → Bs 114 [Sup @7] · Bs 196 [Sup @12 parallel]** |

Con modelo barato bien ruteado (Gemini Flash-Lite $0.10/$0.40 por 1M tokens) el LLM baja a ~$1.5 → total ~Bs 50-84. **Un plan DentalGest Bs 750-890 cubre el costo marginal de ~5-8 clientes con agente activo → margen bruto 78-87% si va incluido, >40% si es add-on Bs 250-350.**

**Cómo cobrarlo sin comerse el margen — incluido-por-plan con fair-use + pass-through de lo volátil** (evita metering en tiempo real y billing automático; cobro a mano):
- **Incluido en el plan (done-for-you, con tope duro):** agente de atención inbound ILIMITADO (es $0 para ONIA) + N recalls Utility/mes incluidos (ej. 300).
- **Chatbot IA = add-on** (el botón click-to-chat va gratis en la web; se cobra el agente que responde/califica).
- **Voz = add-on premium separado, prepago + pass-through, o NO ofrecerla aún.**
- **Mensajería WhatsApp pagada + créditos IA = costos de terceros excluidos** (ya en CLAUDE.md): el cliente paga su propia WABA o un paquete metered con markup.

**Dónde SÍ se dispara el costo (y protección):** (1) **VOZ** ~$0.333/min ref. Dapta [real ~$0.08-0.20/min Sup] → un cliente intensivo = $64-160/mes, puede exceder el margen de varios clientes → **off por defecto**; (2) **plantilla reclasificada a Marketing** ×6.5 → redactar recall/cobro como Utility estricta; (3) **cliente "ballena"** → topes duros por cliente en código; (4) **ciclo de caja negativo** (pagás API en USD antes de cobrar en Bs) → **cobrar por adelantado**; (5) **escasez de USD** infla el costo en Bs. Barreras (mucho ya en el stack ONIA): topes duros enforced, presupuesto por API-key en litellm-db, alertas Telegram, kill-switch por agente, diseño inbound-first.

**Veredicto sobre la interfaz conversacional estilo Dapta/ChatGPT ("le escribís y va pidiendo cosas"): NO ahora. Es exactamente la plataforma que quema runway.** Su meta-agente es el turno más caro que existe: Dapta lo cobra ~$0.15-2.00/mensaje (25-300× un turno normal). Construir un builder NL→acción grado-Dapta = semanas-meses de ingeniería sin revenue cercano. Para VENDER no lo necesitás: necesitás agentes ya armados que funcionen (Recall/Cobrador/atención, done-for-you) + un flujo de demo guionado. **La interfaz conversacional se REUSA con lo que ya existe: ONIA Center (carril A) + cola `/pending` (D2) + intake WhatsApp (G).** Un UI conversacional nuevo = Fase 2 / diferenciador premium, a construir cuando un cliente que paga lo pida y lo financie.

## 4. Lo que roba ONIA de Dapta y startups (playbook)

Confirmado por los tres comparables — **ninguno empezó por la plataforma-de-agentes; todos vendieron primero un producto angosto y aburrido y montaron la IA encima de la base instalada:** Dentálink vendió gestión dental ~una década sin IA (revenue $211K→$11,1M); Leadsales bootstrapeó a $1,6M ARR / 1.400 clientes con un CRM de WhatsApp simple ANTES de lanzar su agente de IA; la propia Dapta pivoteó a agentes DESPUÉS del pre-seed.

| # | ROBAR (barato, trae plata) | TRAMPA (quema runway) |
|---|---|---|
| 1 | **Vender el ERP + servicios AHORA como "done-for-you"** (sistema configurado + web + chatbot WhatsApp + presencia + ads, armado a mano para warm leads). Cobrás setup = cash inmediato + mensual. | Perfeccionar lo visual o construir el builder conversacional antes de cerrar clientes. |
| 2 | **Pricing por créditos con pass-through, WhatsApp/texto primero.** El cliente paga el costo volátil, el margen queda protegido. Benchmark: $0.33/min-voz retail de Dapta → ONIA muy rentable en texto. | Voz como héroe (créditos caros queman caja). |
| 3 | **UN paraguas "Onia", verticales como módulos endosados, entidad legal aparte** (Onia Agency). Splitear marketing con runway corto es suicida. | House-of-brands / marca de producto separada ahora. |
| 4 | **Implementación done-for-you como cuña** (Dapta Scale Up = sesiones 1-1; vendés implementación = cash hoy). | "300 integraciones" (vanidad; hacé las 3-5 que pide tu primer cliente). |
| 5 | **Vertical angosto → base instalada → IA después.** Un ERP dental vertical LatAm es negocio real de 8 cifras (Dentálink lo prueba). ONIA acelera combinándolo con servicios que dan cash inmediato mientras la base SaaS crece. | Esperar años como Dentálink; o plataforma horizontal "para todo" (ya descartado en memoria). |
| 6 | **Adaptador fiscal por país** (`external_gate`) — el foso que Dapta/Leadsales/Dentálink NO tienen. Bolivia ahora, Argentina solo con cliente AR pagando. | Estructurar entidades legales/fiscales multi-país antes de tener revenue multi-país (Dapta abrió Miami CON tracción). |
| 7 | **Modelo de carriles ya escrito en CLAUDE.md** para trabajo paralelo (el límite es el CHOQUE, no el plan Max). | Levantar capital / expansión US como meta (ONIA no tiene tracción todavía). |

## 5. El reparto para desarrollar en PARALELO

Repos/carpetas distintas = paralelo libre. ⭐ = ruta crítica al primer cobro. 1 sesión de control orquesta subagentes (worktree explícito, `git branch --show-current`, rebase `origin/main`, commits chicos por carpeta, gates `tsc --noEmit`/e2e/review, merge a `main` como árbol coherente que compila).

| Carril | Quién | Repo / carpeta exacta | Entrega (scope cerrado) | Depende de | No-choca-con |
|---|---|---|---|---|---|
| **SERGIO** ⭐ | Sergio (horas humanas) | — (venta, no código) | Re-contactar warm leads → demos con DentalGest actual → cerrar 3-5 clínicas (cobro a mano Bs) → destrabar **S2 (NIT/creds SIAT piloto), SEPREC (matrícula), S1 (precios), S3/S6 (secrets n8n/WhatsApp)** | — | No toma carril de build |
| **N · siat-service** ⭐ | Agente | `onia-hermes/hermes-content/integrations/siat/**` | Exponer el emisor (262 tests) como endpoint + registrar tenant piloto + cerrar `[VERIFICAR]` SOAP/XSD/XMLDSig contra WSDL públicos. **Publica el CONTRATO primero.** NO reescribir el emisor. | S2 (solo para CUF prod) | repo aparte de D |
| **D1 · dentalgest-fiscal** ⭐ | Agente | `C:\dev\proyectos\DentaGest\dental-saas` (`feat/onia-dental-medical-alert`): `prisma/schema.prisma`, `app/api/invoices/**`, `app/(dashboard)/billing/**` | `Invoice` bespoke → `OniaInvoicingInvoice`; al confirmar → llama siat-service → persiste cuf/qr/authNumber; QR+leyenda en print; feature-flag ruta SIAT | N (contrato) · S2 | repo DentaGest, aislado |
| **D2 · dentalgest-agentes** ⭐ | Agente | repo DentaGest: `lib/onia-core/` (agents), `app/(dashboard)/pending/**`, crons | Runtime 24/7 human-in-the-loop: **Recall + Cobrador** → cola `/pending`. Demoable con drafts sin envío real | D1 (serial) · S6 (envío) | serial dentro de DentaGest |
| **D3 · dentalgest-ultima-milla** | Agente | repo DentaGest: `components/patients/**`, `app/(dashboard)/billing/[id]/page.tsx` | Form crear alerta médica, collab en factura, SavedView en más listas. Barato, alto impacto percibido | D2 (serial) | serial dentro de DentaGest |
| **P · puerta-plataforma** | Agente | `onia-hermes/web-factory/apps/puerta` (**app NUEVA**) | Web única → selector de rubro (lee `contract.json`) → signup ONIA ID → provisionador rutea a DentalGest vía **SSO token-exchange** → catálogo add-ons (solo CTA + cobro a mano, **sin billing**). Cargar skill `impeccable` + tokens web-factory antes de codear | S1 · contrato SSO con D1 | app nueva; **AVISAR antes de los 4 raíz** |
| **A · onia-center** (rebuild) | Agente | `onia-hermes/web-factory/apps/site/src/app/onia-center/**` + `api/onia-center/**` | Continuar rebuild a componentes chicos al lado de prod; swap al final. Conserva Vendedor/Día + cola aprobación. Es la sala que opera `/pending` | — (data existe) | solo subcarpeta onia-center |
| **I · research-estrategia** | Agente | `onia-hermes/hermes-content/docs/research/**` | Cerrar `[VERIFICAR]` §2.3 (grupo SIAT piloto, no-show odontológico BO, penetración WhatsApp, ticket Bs) + insumos S1 + go/no-go 2do vertical. **NO codea** | — | solo docs/research |
| **G · infra-deploy** | Agente (serial, gateado por Sergio) | n8n / VPS Easypanel `187.77.16.63` / Supabase | Deploy siat-service + puerta; n8n agentes (recall/cobrador/radar) + intake WhatsApp; provisioning Supabase por tenant. **n8n VPS = Credentials, nada de `$env`** | Código N/P/D en `main` · S3 · S6 | único dueño de infra a la vez |
| **AR-1 · landing DentalGest** | **Artur** | `onia-hermes/web-factory/apps/dentalgest-landing` (app nueva propia) | §6 | — | app propia; NO toca site/puerta/4 raíz |
| **AR-2 · demo/sales kit** | **Artur** | `onia-hermes/hermes-content/sales-kit/**` (contenido) | §6 | pantallas DentalGest actual | solo contenido, cero código |
| **AR-3 · GestiOS hygiene** (opcional/último) | **Artur** | repo **GestiOS** (separado) | §6 | — | repo aparte, cero choque |

**Paralelo día 1, cero choque:** N · P · A · I · G(serial) · AR-1 · AR-2. **D** = cadena serial dentro de DentaGest (subagentes secuenciales). **AR-3** solo si AR-1/AR-2 entregados y sin nueva orden.

## 6. Paquetes de trabajo para Artur (copy-paste)

> Elegidos deliberadamente **fuera de la ruta crítica de venta** (no dependemos de Artur para cobrar) pero que atacan el motivo real por el que no se cerró: **credibilidad y presencia**. Carpetas/repos aislados: no puede romper `main`, el repo DentaGest ni la infra.
> **Regla explícita en TODOS los paquetes:** *"Cuando termines ESTE paquete: hacé los gates, commiteá en tu rama, avisá a Sergio con el link/deploy — y PARÁ. No avances a ningún otro trabajo ni toques otra carpeta hasta nuevo aviso. Nada de 'ya que estoy toco esto otro'."*

**AR-1 · Landing pública de DentalGest (presencia visual)**
- **Objetivo:** web pública de DentalGest impecable que dé credibilidad para cerrar warm leads (mata el "eran muy pequeños"). Doble uso: plantilla del add-on "página web".
- **Carpeta:** `onia-hermes/web-factory/apps/dentalgest-landing/` — app nueva con su propio `package.json` y deploy propio. Dominio sugerido `dentalgest.app` (ya de ONIA). Assets en `public/`.
- **Scope cerrado:** hero + qué resuelve (facturación SIAT + agenda + cobro + agentes) + 3 planes en Bs (placeholder hasta S1) + prueba social/screenshots del sistema real + CTA WhatsApp click-to-chat (incluido, gratis) + footer legal. Cargar skills `impeccable` + galería/tokens web-factory ANTES de codear; exigir ≥4 Required Qualities (regla anti-genérico). Responsive + light/dark.
- **NO hacer:** tocar `apps/site`, `apps/puerta`, `templates/`, `harvester/`, ni los 4 raíz de web-factory. No chatbot pago. No billing. No inventar cifras de clientes.
- **Hecho cuando:** deploy propio en vivo, `tsc --noEmit` verde en su app, responsive OK a 375/768/1440, ambos temas intencionales, aprobado por Sergio.

**AR-2 · Demo / sales kit (contenido, cero código)**
- **Objetivo:** armar a Sergio para vender HOY con el DentalGest actual: material que hace ver la oferta completa y madura.
- **Carpeta:** `onia-hermes/hermes-content/sales-kit/` (markdown + imágenes).
- **Scope cerrado:** (1) one-pager de la oferta (ERP + chatbot + web + ads + agentes 24/7) en Bs con planes lanzamiento; (2) screenshots/screen-recording del sistema operando (agenda, factura, `/pending`) — captura del producto real, **sin gasto en plataformas de video**; (3) guion de demo 5-7 min; (4) scripts de seguimiento WhatsApp para re-abrir warm leads; (5) checklist de objeciones ("muy pequeños"/"muy básico") con respuesta. Consistente con skill `onia-propuestas` y las 9 reglas de propuestas del CLAUDE.md (niveles diferenciados, resultado por paquete, dominio/hosting a cargo del cliente, plantillas = confidencial).
- **NO hacer:** generar video con créditos pagos (Higgsfield/fal) sin OK explícito de Sergio. No inventar casos/números. No prometer SLA ni tiempos de empresa.
- **Hecho cuando:** kit completo en `sales-kit/`, revisado contra las 9 reglas, listo para mandar.

**AR-3 · GestiOS baseline — higiene de seguridad (opcional, solo si AR-1/AR-2 cerrados y sin nueva orden)**
- **Objetivo:** cerrar la deuda de seguridad del baseline (NO productizar): **RLS OFF en 15 tablas = exposición de datos**. Repo separado = imposible de chocar.
- **Carpeta:** repo **GestiOS** (separado de onia-hermes y DentaGest).
- **Scope cerrado:** (1) diagnóstico del gap código↔DB; (2) **activar RLS** en las 15 tablas con políticas mínimas; (3) reconciliar el core huérfano del código (Sprint 0). **Nada de features nuevas, UI ni "hacerlo vendible".**
- **NO hacer:** convertir GestiOS en oferta (no se construye habitación #2 antes de que la #1 pague). No tocar onia-core.
- **Hecho cuando:** RLS on verificado, diagnóstico escrito, gates verdes (`security-reviewer` + tests). **Y PARÁ.**

## 7. Que NO se hace todavia

Si aparece cualquiera antes de **1 clínica pagando**, es la trampa (puerta linda a un cuarto vacío). Ningún carril ni Artur los toca:

1. **Argentina / LatAm / estructura fiscal país-pluggable IMPLEMENTADA.** La arquitectura ya lo soporta (invariante de diseño a preservar); implementar AFIP/ARCA = habitación #2 sin inquilino en la #1.
2. **Billing self-serve / metered post-pago / "Acción ONIA" que cobra.** Cobro a mano en Bs; el crédito solo topa fair-use interno (`action_ledger`).
3. **Runtime unificado / capa B / DB compartida cross-producto / adopción de onia-core.** Core CONGELADO (`installInProductRepos=false`); DentalGest sigue repo aparte con SSO token-exchange.
4. **Interfaz conversacional standalone estilo ChatGPT/Dapta.** Se reusa ONIA Center (A) + `/pending` (D2) + intake WhatsApp (G); UI nuevo = polish, no ruta al primer cobro.
5. **Capacitadora como línea de negocio.** Vuelve como lead-magnet gratis dentro del marketing, nunca P&L propio en esta ventana.
6. **Nuvia como retail operado.** Congelada a grado demo/dogfood (probar SIAT/QR/checkout sobre NIT propio), no catálogo que administrar.
7. **GestiOS/ProveeGest/Ganadero como vendibles.** Un solo vertical validado primero (AR-3 es solo higiene de seguridad, explícitamente NO productización).
8. **Voz como oferta · Higgsfield como agencia de video a terceros · portal del paciente · promesas de SLA · comprar dominio internacional/`onia.app` · levantar capital / expansión US.**

## 8. El camino mas corto a plata (semanas)

Dos hitos distintos (la distinción que salva el cronograma): **demo-presentable** (todo código, sin trámite, es el camino más corto y no depende de Claude/cupo/Artur para la ruta de cierre) vs **cobrando-legal** (gateado por trámites bolivianos = el cuello de botella real).

| Semana | SERGIO (vender) | AGENTES (build) | ARTUR |
|---|---|---|---|
| **0 (ahora)** | Re-abre warm leads + agenda demos con DentalGest actual. **Destraba S2/SEPREC/S1 (lo #1)** | Dispatch paralelo: **N** (contrato SIAT), **P** (esqueleto puerta), **A** (onia-center), **I** (research S1 + §2.3) | Arranca **AR-1** (landing) + **AR-2** (sales kit) |
| **1-2** | Da demos usando **AR-2** + landing **AR-1** como prueba de seriedad. Sigue empujando trámites | **D1** (fiscal, contra contrato de N + mock). **P** cablea signup→SSO→DentalGest | **AR-1 en vivo** + **AR-2 listo** → PARA, avisa |
| **2-3** | **Cierra 1ª clínica** a precio lanzamiento (cobro a mano) en cuanto S1 esté | **D2** (Recall/Cobrador demoable en `/pending`). **G** despliega N-service + puerta + n8n (según lleguen S3/S6) | (AR-3 opcional solo si sin nueva orden) |
| **3-5** | Onboarda cliente #1; 1ª **factura SIAT prod** (gateada S2/SEPREC); **1er mensual pagado** | **D3** (última milla) + G en vivo probado | — |

- **HITO "presentable / demo-vendible" (~fin semana 2):** DentalGest operando + landing pulida (AR-1) + sales kit (AR-2) + puerta esqueleto (P) + un agente demoable (D2 con drafts). Sergio presenta una oferta **entera y creíble** a los warm leads. Todo código puro, sin bloqueo humano.
- **HITO "cobrando legal" (~semana 3-5):** factura SIAT prod validada (estado 908) + primer mensual en Bs. Gateado por **S2 (NIT/creds piloto) + SEPREC (matrícula) + S1 (precios)** — trámites de Sergio, corriendo en paralelo desde el día 0.

**Regla que evita el error clásico:** aterrizar en la aspirina (facturar/operar/cumplir) antes que en la vitamina (web/chatbot). N→D1→D2 (aspirina) son ruta crítica; AR-1/AR-2 (presencia) son aceleradores de cierre en paralelo, nunca el gate del cobro. **Landeá antes de expandir: no construyas capa B / 2do vertical / billing / LatAm hasta que la habitación #1 tenga inquilino pagando y haya encendido un segundo módulo.**

---

**UNKNOWN / a verificar (no bloquean el dispatch):** disponibilidad y precio real de `onia.app`/`onia.com` (verificador rate-limited → chequear en Cloudflare/Namecheap antes de comprar, con OK de Sergio); validez de `gestios.hq` como dominio que resuelve; tasa USD/BOB parallel en vivo (modelo usó Bs 7 piso / Bs 12 [Sup]); costo real por minuto de voz para ONIA ([Sup] ~$0.08-0.20/min); markup exacto de BSPs sobre tarifa Meta en Bolivia; estructura legal/fiscal óptima cross-border (requiere asesor real en BO y AR). Fuentes de anclaje: `ONIA_PLATAFORMA_UNICA_PLAN_MAESTRO_20260723.md` · `..._BRIEF_DECISION_20260723.md` · `CLAUDE.md`.
