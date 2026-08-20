# ONIA — Benchmark de industria + opciones de pricing (2026-08-07)

Síntesis de 5 investigaciones paralelas (Lety.ai · salud/dental · comercio/POS · horizontales/AI-employees · pricing regional). Todo claim lleva fuente; lo no verificado está marcado como **inferencia** o **sin fuente**. Conversiones a USD al paralelo ~11,4 Bs son referenciales (paralelo verificado 6-8-26 en Bs 11,05–11,11 — dolarbluebolivia.click).

---

## 1. Veredicto en 5 líneas

1. **Onia NO compite hoy contra los monstruos**: Square, Alegra, Siigo, Dentrix, Jane, Doctoralia — ninguno opera Bolivia ni emite factura SIAT (fuentes §6). La cancha real de Onia es Bolivia contra locales sin pricing público (YoFacturo, Sintic) y el foso es regulatorio: SIAT + QR + Bs, con deadline 30-sep-2026 que obliga a todo el mercado.
2. **En features operativos Onia está a nivel de tier medio LATAM** (agenda, historia clínica, kardex, multi-sede), pero **pierde en profundidad clínica** (imagenología, periodontograma, telemedicina, AI scribe) y **en contabilidad/nómina formal** contra Alegra/Siigo/Contifico.
3. **Los agentes que EJECUTAN (Recall + Cobrador, human-in-the-loop) no tienen equivalente publicado en NINGUNO de los ~20 productos relevados** — la "IA" de la competencia es scribe de notas, chatbot de soporte, o consulta de datos solo-lectura. Es la ventaja más defendible después del SIAT.
4. **El talón de Aquiles no es precio ni features: es que el SIAT sigue en homologación y hay 0 casos públicos** — todo competidor con factura electrónica la tiene EN PRODUCCIÓN en su país, y Siigo declara 300k empresas. Hasta cerrar homologación, el foso es promesa.
5. **Ningún dato relevado justifica bajar precios**: la entrada de Onia (Bs 320 ≈ USD 28) está en la mediana LATAM (USD 29), el add-on chatbot (Bs 350 ≈ USD 31) está en la banda BAJA del mercado (USD 15–300), y el tier alto cuesta menos que comprar las piezas por separado.

---

## 2. Tabla por módulo: Onia vs mejor-de-clase

| Módulo Onia | Mejor de clase relevado | Qué hace el mejor | Gap concreto de Onia | Fuente |
|---|---|---|---|---|
| Agenda/reservas | Jane App (CAD 54–99/mes) | Booking online + telemedicina 1:1 incluida + AI Scribe CAD 15 | Onia sin telemedicina ni scribe de voz; agenda propia sí (Lety ni eso: usa Calendly) | jane.app/pricing |
| Historia clínica dental | Dentrix (~USD 500-800/mes, est. terceros) / Dentalink Titanium | Charting completo, imagenología integrada (sensores RX), periodontograma, módulo ortodoncia | Onia tiene odontograma básico; sin RX integrada, sin periodontograma, sin ortodoncia | themolarreport.com · softwaredentalink.com |
| Recall / recuperación de pacientes | **Onia es el mejor de clase relevado** | Competencia: recall = listas + campañas email/SMS (Dentrix Patient Engage, Dentalink Titanium, Doctoralia). Nadie publica un agente IA que proponga y ejecute con cola de aprobación | Sin gap en el mecanismo; gap en prueba social (0 casos publicados vs marcas con décadas) | relevamiento salud §2-4 |
| Cobranza (agente Cobrador) | **Sin equivalente publicado en los ~20 relevados** | Los "AI employees" (Fin $0.99/resolución, Agentforce $2/conversación, Breeze $0.50/resolución) resuelven SOPORTE, no persiguen pagos | Gap: los grandes cobran por outcome y facturan variable; Onia flat. Riesgo inverso: sin métrica de outcome que mostrar aún | gleap.io · help.salesforce.com · huboexperts.com |
| Chatbot WhatsApp | Cliengo (WhatsApp API recién en Business $259/mes) / ManyChat Pro $39 + fees Meta | Multicanal, HSM salientes, flujos visuales | Onia Bs 350 (~$31) < Starter Cliengo ($45) que ni trae WhatsApp API. Gap: desde 2026-10-01 Meta cobra todos los mensajes de servicio salientes → costo variable dentro de un flat | cliengo.com/pricing · guiawabusiness.cliengo.com |
| POS / ventas comercio | Loyverse (core GRATIS; inventario avanzado $25/tienda) | POS multi-tienda gratis, loyalty, KDS | El ancla gratis existe y se usa en Bolivia; Onia Bs 320 es caro como primer escalón si el cliente SOLO quiere vender. Contra-gap: Loyverse sin SIAT, sin fiado de mostrador como flujo | loyverse.com/pricing · loyverse.com/en-us/features |
| Inventario/kardex | Alegra / Contifico (tiers contables) | Bodegas múltiples, valuación, órdenes de compra | Onia kardex sí; sin órdenes de compra ni valuación documentadas en la oferta (inferencia desde la lista de features dada) | alegra.com/colombia/precios |
| Facturación fiscal | Alegra/Siigo/Contifico/Cliniweb/Bsale — cada uno homologado EN PRODUCCIÓN en su país (DIAN, SRI, DGI, SII) | Certificado digital incluido, facturas ilimitadas, emisión vía WhatsApp (Siigo) | **SIAT de Onia en homologación = el gap más urgente.** Nadie cubre Bolivia, pero Onia tampoco todavía. Deadline mercado: 30-sep-2026 | alegra.com · siigo.com · contifico.com/planes |
| Contabilidad formal / nómina | Alegra (nómina COP 22k–194k/mes) / Siigo / Contifico | Libro diario, reportes para el contador, usuario contador gratis, nómina electrónica | Onia no ofrece contabilidad formal ni nómina en el producto desplegado (el core la tiene, no está encendida — dato interno) | alegra.com/colombia/precios · programascontabilidad.com |
| Cobros | Square (2.4–2.6% + fijo, integrado) | Cobro con hardware y comisión propia | Irrelevante en Bolivia (Square no opera aquí); QR de Onia es lo correcto para el mercado (QR = 92% de pagos digitales, 891M transacciones 2025) | squareup.com/help · larazon.bo |
| Adquisición de pacientes | Doctoralia (directorio >10M visitas/mes solo MX) | El marketplace TRAE demanda — motivo #1 por el que pagan | Onia no tiene directorio ni marketplace; vende gestión, no demanda | pro.doctoralia.com.mx |
| Multi-rubro | **Onia único vertical multi-rubro relevado** | Dentalink/Dentrix solo dental; Doctoralia/Jane/Cliniweb solo salud; Alegra/Siigo/Square horizontales sin verticales clínicas; Lety = 12 verticales pero solo como plantillas de prompt | Gap: amplitud vs profundidad — 6 rubros de Onia vs la profundidad dental de Dentalink | sitios oficiales de cada uno |

---

## 3. Qué tiene Onia que NADIE de la lista tiene (solo lo verificable)

1. **Factura SIAT Bolivia** (en homologación). Ninguno de los ~20 productos relevados emite factura SIN: Square/Alegra/Siigo/Contifico no operan Bolivia (squareup.com/help/article/4956, selectores de país de alegra.com y siigo.com, contifico.com); Cliniweb factura DGI Panamá; Bsale SII Chile; Dentalink boletas Chile; Lety no factura fiscal en absoluto (lety.ai/pricing). *Matiz honesto: los locales bolivianos (YoFacturo, Sintic) SÍ facturan SIAT — la unicidad es "SIAT + gestión completa + agentes en un solo producto", no SIAT a secas.*
2. **Agentes IA que ejecutan tareas de negocio con cola de aprobación humana, incluidos en el plan** (Recall recupera clientes, Cobrador persigue pagos). Verificado por ausencia en todo lo relevado: HubSpot Breeze = soporte/prospección por crédito; Intercom Fin y Sierra = resolución de soporte por outcome; Agentforce = conversaciones; Zoho Zia = agentes construibles por créditos; Alegra MCP = consulta solo-lectura; Lety = auto-responders sin human-in-the-loop documentado. Nadie vende de fábrica "recuperar clientes inactivos" ni "perseguir pagos" empaquetado con aprobación.
3. **Precio flat en Bs sin riesgo de factura sorpresa.** El modelo dominante de agentes IA es outcome/uso ($0.50–0.99/resolución, $2/conversación, créditos) con letra chica que infla facturas (Fin cobra "resolución" cuando el cliente simplemente deja de responder — aimdoc.ai). Onia: flat conocido.
4. **Fiado de mostrador como flujo de tienda de barrio.** Loyverse (el gratis que se usa en Bolivia) no lo lista como feature; en los contables es un módulo de cartera, no un flujo de mostrador (loyverse.com/en-us/features).
5. **Precio público + trial 14 días sin tarjeta + garantía primer mes.** Dentrix, Dentalink, Doctoralia, Cliniweb, Siigo (POS) y Sierra esconden precio detrás de demo/cotización; Doctoralia además ata contrato anual; Lety da solo 7 días.
6. **Localización Bolivia completa**: QR nativo, precios en Bs, kardex, figura local. Odoo llega a Bolivia solo geolocalizando precio (~Bs 100/usuario/mes Standard) pero requiere localización fiscal por partner; nadie más llega.

**Inferencia (no verificado como único)**: manejo de figuras bolivianas tipo anticrético — cero menciones en competidores, pero porque nadie más está en Bolivia; ventaja plausible sin evidencia comparable.

---

## 4. Lety.ai cara a cara

**Corrección de encuadre**: Lety NO es un competidor directo del SaaS Onia Platform. Es **infraestructura white-label para AGENCIAS** que revenden chatbots (B2B2B); el negocio final no le compra a Lety. Compite —indirectamente— contra el **add-on chatbot de Onia (Bs 350/mes)**, y solo si una agencia montada sobre Lety ataca Bolivia.

**El "USD 300/mes" de Sergio, confirmado con dos lecturas** (ambas con fuente):
- Plan **Standard de Lety a la agencia: USD 297/mes** (10 subcuentas) — el match más probable. Starter USD 97 (2 subcuentas), Unlimited USD 497. Fuente: lety.ai/pricing.
- Lo que **la agencia cobra al negocio final: USD 300–2.000/mes por chatbot** (lo fija la agencia, no Lety). Fuente: lety.ai/white-label-chatbot.
- En ambos casos hay **extras pass-through**: tokens LLM a costo + tarifas de sesión WhatsApp de Meta. El fee no es el costo total.

| Dimensión | Onia | Lety.ai | Gana |
|---|---|---|---|
| Qué es | SaaS vertical operativo directo al negocio | Plataforma white-label para agencias (Colombia, ~16 personas, pivote 2026) | Juegos distintos |
| Precio al negocio final | Bs 320/750/1500 (~USD 28/66/132) | USD 300–2.000/mes vía agencia | Onia 10–15x más barato |
| Chatbot WhatsApp | Bs 350/mes + 1.000 instalación (~USD 31 + 88) | Vía agencia USD 300+/mes + fees Meta | Onia ~10x más barato |
| Software operativo (agenda, clientes, kardex, cobros) | Nativo | **No tiene nada**: agenda = Calendly, pagos = Stripe, CRM = HubSpot/GHL — todos terceros en USD; Stripe no opera en Bolivia | Onia |
| Factura fiscal | SIAT en homologación | No existe ni es su negocio | Onia |
| Human-in-the-loop | Cola de aprobación explícita | No documentado; auto-responders | Onia |
| Verticales | 6 rubros con software completo | 12 verticales / 46 nichos como plantillas de prompt | Lety amplitud, Onia profundidad |
| Integraciones | Las del producto | 600+ MCP | Lety |
| White-label / reventa | No | Core del producto | Lety |
| Credibilidad | 0 casos públicos | Métricas inconsistentes: "250+ agencias" en Product Hunt vs "1.000+" en su web; "$2M+ facturados" sin verificación externa; contadores placeholder "0+" en su homepage; 0 reviews en PH | Empate en flaqueza |

**Lectura estratégica**: Lety valida que "agencia revende agentes IA en LATAM a $300–2.000/mes" es un mercado real. Si Onia algún día abre canal de colaboradores/revendedores, el benchmark de plataforma es $97–497/mes al revendedor con margen 100% del spread. Sin fuente: churn de Lety, agencias activas reales, precio anual.

---

## 5. Pricing: opciones con números

**Posición actual verificada** (Bs 320/750/1500; USD @11,4 paralelo / @9,40 referencial BCB):

| Plan | Bs | ~USD | Contra el mercado |
|---|---|---|---|
| Base | 320 | 28–34 | = mediana de entrada LATAM: Doctocliq Básico 29, AgendaPro Pro 29, Dentalink desde 29, benchmark SMB entrada USD 29 (getmonetizely.com). **Alineado, NO caro** — aunque Loyverse gratis y Alegra desde ~USD 3 existen como ancla baja para microcomercio |
| Medio | 750 | 66–80 | > tope Doctocliq (49) y AgendaPro (59); ≈ Bsale Estándar (~82); se sostiene solo si el bundle SIAT+agentes es visible en el pitch |
| Alto | 1.500 | 132–160 | ≈ Bsale Full (~125); < Dentrix Ascend entrada (USD 399+); un chatbot BSP solo ya cuesta USD 50–300/mes → el tier alto cuesta menos que las piezas por separado |
| Add-on chatbot | 350/mes + 1.000 inst. | 31 | Banda BAJA del mercado (pymes 15–50; BSP 50–300; Cliengo Starter 45 sin WhatsApp API; vía Lety-agencia 300+). **Espacio hacia arriba, no hacia abajo** |

**Ningún dato relevado justifica bajar precios.** No hay competidor local boliviano con precio publicado más bajo (no hay precio publicado local, punto).

### Opción A — Mantener Bs nominales + cláusula de ajuste semestral, vender resultado
- 320/750/1500 quedan; contrato con revisión semestral indexada (regla ya vigente post-devaluación); pitch = lo que Recall/Cobrador recuperan en Bs, no features.
- **Pro**: entrada en la mediana (USD 28 vs 29 benchmark); la sensibilidad SMB dice que USD 10/mes definen un deal (getmonetizely.com) → no subir la entrada; QR masivo (92% de pagos digitales) elimina fricción de cobro.
- **Contra**: inflación proyectada 2026 hasta 17% (mercadoherald.com.mx) con costos en USD → cada mes sin ajustar es rebaja silenciosa; exige disciplina de reajuste.

### Opción B — Cuarto tier "Full" Bs ~1.850–2.000/mes (chatbot + agentes + SIAT incluidos), sin tocar los 3 actuales
- Bundlea lo que hoy es add-on (chatbot 350) en un tope; los BSP cobran USD 50–300 SOLO por el chatbot y Doctocliq cobra la facturación electrónica aparte → el bundle es el diferencial estructural.
- **Pro**: sube ARPU sin tocar la entrada; ancla que abarata el 750/1500 a la vista; patrón value-based del 78% del mercado (getmonetizely.com).
- **Contra**: desde 2026-10-01 Meta cobra todos los mensajes de servicio salientes (guiawabusiness.cliengo.com) → costo variable dentro de un flat; necesita fair-use de créditos (patrón ya decidido robar de Dapta) o come margen; 4 tiers = más fricción.

### Opción C — Doble lista: Bs indexado Bolivia + lista USD exterior (ej. 29/69/129, espejo de comps)
- Preparada pero APAGADA hasta tener demanda exterior real.
- **Pro**: los comps regionales ya cotizan USD; protege margen FX.
- **Contra**: prematuro con 0 clientes fuera; riesgo de arbitraje si el precio USD visible queda bajo el Bs al paralelo.

**Compatibilidad**: A es la base, B se apila encima, C queda diseñada y apagada.

### Datos que faltan para decidir
1. **Precios de la competencia local boliviana** (YoFacturo, Sintic, otros con SIAT): no publicados — requiere contacto directo o cotización encubierta. Es EL dato que falta para saber el techo real en Bolivia.
2. **Costo real Meta por conversación post 2026-10-01** para dimensionar el fair-use del tier Full (Opción B).
3. **Willingness-to-pay real de 3–5 prospectos bolivianos** (el benchmark dice que medir WTP da +23% ARPU; hoy es todo comparativo, cero dato propio).
4. **Fecha firme de homologación SIAT propia** — sin eso, ni A ni B pueden vender el bundle fiscal como hecho.
5. Precio mensual de Siigo sin descuento anual, precio real de Sierra, add-on IA de ManyChat, Decagon: no publicados (relevancia baja para decidir, se anotan por completitud).

---

## 6. Fuentes completas

Accedidas 2026-08-07 salvo indicación. Las marcadas (†) son de terceros/estimaciones, no oficiales.

**Lety.ai**: [lety.ai/pricing](https://lety.ai/pricing/) · [lety.ai](https://lety.ai/) · [lety.ai/chatbot-reseller](https://lety.ai/chatbot-reseller/) · [lety.ai/about](https://lety.ai/about/) · [lety.ai/white-label-chatbot](https://lety.ai/white-label-chatbot/) · [lety.ai/ai-employees-for-business](https://www.lety.ai/ai-employees-for-business) · [lety.ai/industries/healthcare](https://www.lety.ai/industries/healthcare) · [Product Hunt](https://www.producthunt.com/products/lety-ai) · [EIN Presswire 2024](https://www.einpresswire.com/article/716050837/lety-ai-la-ia-colombiana-que-transforma-la-atenci-n-al-cliente-y-el-marketing-empresarial)

**Salud/dental**: [jane.app/pricing](https://jane.app/pricing) · [softwaredentalink.com/es/planes](https://www.softwaredentalink.com/es/planes) · [softwaredentalink.com — confirmaciones WhatsApp](https://www.softwaredentalink.com/mx/experiencia-de-pacientes/confirmaciones-automaticas-de-citas) · [pro.doctoralia.com.mx/precios/clinicas](https://pro.doctoralia.com.mx/precios/clinicas) · [cliniweb.com/es/planes](https://www.cliniweb.com/es/planes) · [dentipilot.cl — precios](https://www.dentipilot.cl/precios-software-dental-chile) · [doctocliq.com/planes-y-precios](https://www.doctocliq.com/planes-y-precios) · [turnito.app — software odontólogos Bolivia](https://turnito.app/blog/los-mejores-software-de-reservas-para-odontologos-en-bolivia-2026/) · † [themolarreport.com — Dentrix pricing](https://www.themolarreport.com/learn/dental-software-real-world-pricing) · † [wiredforthefuture.com — Dentrix cost](https://wiredforthefuture.com/blog/how-much-does-dentrix-dental-software-cost/) · † [itqlick.com — Dentrix Ascend](https://www.itqlick.com/dentrix-ascend/pricing) · † [findemr.com — Dentrix Ascend](https://www.findemr.com/dentrix-ascend) · † [vitaldesk.cl — vs Dentalink](https://vitaldesk.cl/blog/vitaldesk-vs-dentalink-comparativa-software-dental) · † [theclinicalmarketing.com — cuánto cuesta Doctoralia](https://theclinicalmarketing.com/es/blog/cuanto-cuesta-doctoralia/) · † [capterra.com — Dentalink](https://www.capterra.com/p/196361/Dentalink/) · † [blog.cronoscal.com — AgendaPro](https://blog.cronoscal.com/agendapro-opiniones-precios/)

**Comercio/POS**: [alegra.com/colombia/precios](https://www.alegra.com/colombia/precios/) · [alegra.com/mexico/facturacion](https://www.alegra.com/mexico/facturacion-electronica/precios/) · [alegra.com/colombia/contabilidad/precios](https://www.alegra.com/colombia/contabilidad/precios/) · [siigo.com](https://www.siigo.com/) · [loyverse.com/pricing](https://loyverse.com/pricing) · [loyverse.com/en-us/features](https://loyverse.com/en-us/features) · [contifico.com/planes](https://contifico.com/planes/) · [squareup.com — disponibilidad](https://squareup.com/help/us/en/article/4956-international-availability) · [bsale.cl/sheet/precios](https://www.bsale.cl/sheet/precios) · [okvet.co/okvet-planes](https://okvet.co/okvet-planes/) · [yo-facturo.com/bo](https://yo-facturo.com/bo/) · [sinticbolivia.net](https://sinticbolivia.net/productos/sistema-de-facturacion-electronica-en-linea/) · † [tech.co — Square pricing](https://tech.co/pos-system/square-pos-pricing) · † [koronapos.com — Square](https://koronapos.com/blog/square-pos-pricing/) · † [programascontabilidad.com — Siigo](https://programascontabilidad.com/comparativas-de-software/precios-de-software-contable-colombia-2026/) · † [blog.alegra.com — Alegra vs Siigo (parte interesada)](https://blog.alegra.com/colombia/alegra-vs-siigo-colombia/)

**Horizontales/agentes**: [odoo.com/pricing](https://www.odoo.com/pricing) (geolocalizado a Bolivia) · [hubspot.com/pricing/crm](https://www.hubspot.com/pricing/crm) · [help.salesforce.com — Agentforce](https://help.salesforce.com/s/articleView?id=004811240&language=en_US&type=1) · [zoho.com — Zia model config](https://www.zoho.com/agents/resources/help/platform-reference/model-configuration.html) · [cliengo.com/pricing](https://www.cliengo.com/pricing) · [guiawabusiness.cliengo.com — precios WhatsApp oct-2026](https://guiawabusiness.cliengo.com/cambio-precios-whatsapp-octubre-2026) · † [erpresearch.com — Odoo](https://www.erpresearch.com/pricing/odoo) · † [oec.sh — Odoo](https://oec.sh/odoo-pricing) · † [cxtoday.com — Zoho One](https://www.cxtoday.com/crm/zoho-one-pricing-everything-you-need-to-pay-for-zoho/) · † [aaxonix.com — Zoho One](https://aaxonix.com/resources/zoho-one-pricing-explained/) · † [eesel.ai — HubSpot AI pricing](https://www.eesel.ai/blog/hubspot-ai-pricing) · † [huboexperts.com — créditos 2026](https://www.huboexperts.com/blog/hubspot-credits-pricing-changes-2026-guide) · † [gleap.io — Fin pricing](https://www.gleap.io/blog/intercom-fin-ai-pricing-2026) · † [coworker.ai — Fin](https://coworker.ai/blog/intercom-fin-pricing) · † [aimdoc.ai — letra chica Fin](https://aimdoc.ai/blog/intercom-resolution-pricing-explained) · † [cloudtalk.io — Sierra (estimaciones)](https://www.cloudtalk.io/blog/sierra-ai-pricing) · † [valueaddvc.com — Sierra](https://valueaddvc.com/blog/how-does-sierra-ai-make-money-outcome-based-pricing-enterprise-agents-and-the-business-model-breakdown) · † [jitendrazaa.com — Agentforce credits](https://www.jitendrazaa.com/blog/salesforce/salesforce-agentforce-credits-cost-model-complete-guide-2026/) · † [layer3labs.io — Zia](https://www.layer3labs.io/guides/zoho-zia-explained) · † [layer3labs.io — ManyChat](https://www.layer3labs.io/guides/manychat-pricing) · † [chatarmin.com — ManyChat](https://chatarmin.com/en/blog/manychat-pricing) · † [thewitn.com — AI agent pricing](https://www.thewitn.com/blog/ai-agent-pricing-in-2026-what-fin-sierra-decagon-and-agentforce-actually-charge)

**Benchmarks y contexto Bolivia**: † [getmonetizely.com — SaaS pricing benchmark 2025](https://www.getmonetizely.com/articles/saas-pricing-benchmark-study-2025-key-insights-from-100-companies-analyzed) · † [getmonetizely.com — SMB vs Enterprise](https://www.getmonetizely.com/articles/smb-vs-enterprise-saas-pricing-key-testing-differences-for-maximum-revenue) · [dolarbluebolivia.click](https://www.dolarbluebolivia.click/) · [bcb.gob.bo](https://www.bcb.gob.bo/) · † [mercadoherald.com.mx — dólar/inflación Bolivia 2026](https://www.mercadoherald.com.mx/bolivia-dlar-oficial-vs-mercado-paralelo-en-2026/) · [larazon.bo — QR +131%](https://larazon.bo/economia-y-empresa/2026/05/17/pagos-con-qr-crecen-131-en-bolivia-y-consolidan-digitalizacion-financiera/) · [reduno.com.bo — QR 2025](https://www.reduno.com.bo/economia/bolivia-consolida-el-uso-del-qr-891-millones-de-transacciones-movieron-us-51-293-millones-en-2025-202621211959) · [economy.com.bo — ticket QR](https://www.economy.com.bo/articulo/banca-finanzas/qr-concentro-92-pagos-digitales-bolivia-primer-semestre-2025/20250819182503019791.html) · † [auto-latam.com — chatbot WhatsApp precios](https://auto-latam.com/blog/chatbot-whatsapp-precio-empresas-latam-2026) · † [eligetucrm.com — Leadsales](https://www.eligetucrm.com/blog/leadsales-precios-2026) · [guiawabusiness.cliengo.com/precios](https://guiawabusiness.cliengo.com/precios) · [calcular.cl — valor UF](https://www.calcular.cl/valor-uf)

**Datos internos (no públicos)**: precios Onia Bs 320/750/1500 + add-on chatbot Bs 350/1.000 · estado SIAT en homologación · deadline facturación en línea 30-sep-2026 · payroll en core sin desplegar.
