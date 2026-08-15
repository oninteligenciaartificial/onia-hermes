# ONIA — Research de continuación: startups similares, stack de IA y herramientas

Fecha: 2026-07-26 · Estado: DECISIÓN (integra 3 investigaciones del 2026-07-25)
Contexto: plataforma una-app (rubro + módulos encendibles) para PyMEs Bolivia; DentalGest = primer vertical (completo en código); agentes IA human-in-the-loop; foso = fiscal Bolivia (SIAT); runway corto; VPS 4 cores/16GB sin GPU; litellm en uso (~$0.006/acción) con presupuestos por key.

Regla del doc: fuentes citadas, UNKNOWN lo no verificable, sin humo.

---

## 1. Lo que enseñan las startups similares

Se analizaron 8 productos + delta Dapta. Hallazgo estructural: **ningún regional grande (Alegra, Siigo, Bind, Nubox) opera en Bolivia** — el foso SIAT es real, pero el competidor local ya existe (Sintic Bolivia vende módulos SIAT para Odoo/Laravel a desarrolladores). El patrón ganador de la categoría se repite en todos: suscripción base + add-ons de IA/automatización cobrados aparte + % de pagos. Y el hueco común que ONIA explota: **nadie combina vertical + fiscal local profundo + agentes IA con aprobación humana**.

### Tabla comparativa (fuerte / débil / hueco)

| Producto | Segmento | Pricing entrada | IA | Fiscal local profundo | Bolivia | Hueco que ONIA explota |
|---|---|---|---|---|---|---|
| Alegra | Conta pyme LatAm (9 países) | $499 MXN/mes | Marketing "con IA" | Sí, 9 países | NO | Bolivia + operación vertical (no agenda pacientes ni ficha clínica) |
| Siigo | Conta Colombia | $145.993 COP/mes | No visible | Sí (DIAN) | NO | Soporte colapsado + cero IA + Bolivia |
| Odoo | ERP modular global | $0 / ~$31 usuario/mes | Básica | No (vía partners como Sintic) | Solo integradores | Setup caro (el proyecto cuesta más que la licencia); sin rubro ni país |
| Dentalink | Dental LatAm (líder, 20+ países) | Oculto (cotización) | No | No | UNKNOWN | Precios ocultos, sin IA, sin SIAT |
| Jobber | Servicios (US/CA) | $39-599/mes + add-ons | Copilot + AI Receptionist ($29-99/mes) | N/A | NO | Referencia de monetización, no compite |
| Leadsales | WhatsApp CRM MX | $84/mes (3 usuarios) | Chatbot básico | No | NO | Solo chat, sin ERP ni fiscal |
| Bind ERP | ERP pyme MX | $599 MXN/mes | No visible | Sí (SAT, timbrado ilimitado) | NO | Solo México, sin vertical |
| Nubox | Conta Chile | Cotización | No visible | Sí (SII) | NO | Solo Chile, integraciones débiles |
| Dapta (delta) | Agentes IA ventas | $19/$99/$499 + créditos | Core del producto | No | NO | Sin vertical ni fiscal — confirma la decisión vertical-first previa |

Lo copiable más fuerte por producto:
- **Alegra:** escalera de precios por VOLUMEN de uso (facturas/mes), no por mutilar features; el plan chico ya sirve completo.
- **Siigo:** herramienta GRATIS para el contador → el gremio se vuelve canal de distribución.
- **Odoo:** "todas las apps por un precio por usuario" mata la fricción de decisión; su talón = implementación cara (el wizard /setup de DentalGest es el antídoto correcto).
- **Dentalink:** escalera por MADUREZ de la clínica (Esencial→Pro→Titanium) mapea 1:1 a la narrativa ONIA (ordenarse → convertir → automatizar); esconde precios = diferenciación gratis para nosotros.
- **Jobber:** monetización en 3 capas — suscripción + IA como add-on con precio propio + 1-2.9%+30c de cada pago procesado.
- **Leadsales:** en LatAm el CRM ES WhatsApp; el intake WhatsApp debe ser lo primero que el cliente VE funcionar.
- **Bind:** "timbrado ilimitado incluido, sin costo por factura" como arma de marketing; prueba de que fiscal-profundo-de-un-país es un foso que ni los grandes cruzan.
- **Nubox:** la conexión nativa al ente fiscal retiene clientes 20 años; la homologación SIAT no es un trámite, es EL producto.
- **Dapta delta:** su modelo créditos + presupuesto por plan valida el esquema litellm-presupuesto-por-key que ONIA ya usa; "créditos de agente" por plan es copiable directo.

### Las 5 lecciones que cambian cómo sigue ONIA

1. **El foso SIAT expira si no se corre.** Nadie regional está en Bolivia hoy, pero Sintic ya vende módulos SIAT y la obligación de facturación en línea (30-sep/1-oct-2026) va a atraer a todos. Homologación + NIT = LA ruta crítica, no un pendiente más.
2. **Monetizar en 3 capas (jugada Jobber):** suscripción por tier + agentes IA como add-on con precio propio (nunca regalados) + % de pagos vía modelo Facilitador (BNB/BCP). El pricing DentalGest 390/890/1990 cubre la capa 1; formalizar capas 2 y 3.
3. **Regalar la herramienta al contador (jugada Siigo):** un "ONIA Contador" gratis para contadores bolivianos pre-deadline SIAT convierte al gremio en canal de venta justo cuando sus clientes los presionan por la obligación.
4. **Publicar precios donde el vertical los esconde:** Dentalink cotiza a puerta cerrada; precios públicos + "emisión SIAT ilimitada incluida, cero costo por factura" (jugada Bind) es diferenciación inmediata y gratis.
5. **Escalar por volumen y madurez, no por mutilar features:** el plan chico de DentalGest debe ser COMPLETO en lo operativo y limitar volumen/agentes — el upgrade lo dispara el crecimiento del cliente, no la frustración.

---

## 2. Stack de IA decidido

Precios verificados en páginas oficiales de cada provider (fetch 2026-07-25). Supuestos de volumen explícitos: cliente activo = clínica con ~300 conversaciones WhatsApp/mes de 6 turnos, ~200 work items de agentes/mes (ajustar con datos reales del panel).

### Tarea → modelo → costo (vía litellm existente)

| Tarea | Modelo primario | Fallback | Costo est./cliente/mes | Racional |
|---|---|---|---|---|
| Chatbot WhatsApp | **Gemini 2.5 Flash-Lite** ($0.10/$0.40 por 1M) | GPT-5.4-nano | ~$0.50-0.80 | El más barato con no-training contractual; rápido (latencia importa); español sólido. DeepSeek sería igual de barato pero está VETADO para datos de pacientes (ver riesgos) |
| Agentes Recall/Cobrador | **Claude Haiku 4.5** ($1/$5) | GPT-5.4-mini | ~$0.70-1.00 | Volumen bajo → prima confiabilidad de tool-use para borradores human-in-the-loop. Batch API (-50%) aplica: corren por cron, no en tiempo real |
| Análisis web cliente (lead magnet) | **Gemini 3.5 Flash** ($1.50/$9) | GPT-5.4-mini | ~$0.20-0.50/reporte | Contexto 1M traga el sitio entero sin chunking; es artefacto de VENTA → calidad sobre centavos. Alternativa premium: Sonnet 5 intro ~$0.35/reporte |
| Reportes internos | **Haiku 4.5** (rutina) / **Sonnet 5** (estratégico) | DeepSeek v4-flash SOLO texto no sensible | ~$1-3/mes total | Interno, bajo volumen. DeepSeek ($0.14/$0.28) imbatible para digestión masiva de texto público |

**Total LLM por cliente activo: ~$1.20-1.80/mes** contra planes de Bs 320-1,500 → el LLM es <2% del ticket. Con la devaluación (Bs 11.37/USD) son ~Bs 14-20/cliente/mes. El margen no está en riesgo por el costo de inferencia.

Implementación en litellm (el proxy con presupuestos por key ya existe):
- Grupos de ruteo: `onia-chat` → flash-lite (fallback nano) · `onia-agents` → haiku-4.5 (fallback gpt-5.4-mini) · `onia-webreport` → gemini-3.5-flash · `onia-internal` → haiku-4.5.
- Presupuesto por key por tarea (ej. `onia-chat` cap $30/mes global al inicio) + alertas al 80%.
- Prompt caching en el chatbot (system prompt + contexto clínica es fijo por tenant): baja el input hasta ~90% en Gemini/Anthropic.
- **Urgente:** DeepSeek deprecó los alias `deepseek-chat`/`deepseek-reasoner` el 2026-07-24 — si algún config de litellm los referencia, migrar a `deepseek-v4-flash` YA.
- Versiones pinneadas + revisión trimestral de precios (churn real: en 6 meses murieron gpt-4o-mini/4.1-mini, DeepSeek retiró alias, Google repreció Flash 5x entre generaciones).

### Riesgo duro — privacidad de datos

| Provider | ¿Entrena con datos API? | Nota |
|---|---|---|
| OpenAI API | NO por defecto; ZDR disponible; retención 30 días | [openai.com/enterprise-privacy](https://openai.com/enterprise-privacy/) |
| Google Gemini tier PAGO | NO. OJO: el tier gratis SÍ entrena y hay revisión humana | [foro oficial Google AI](https://discuss.ai.google.dev/t/is-my-data-used-for-training-or-retained-with-gemini-paid-api-calls/64837) |
| Anthropic API | NO por defecto (términos comerciales) | [anthropic.com/legal/commercial-terms](https://www.anthropic.com/legal/commercial-terms) — verificar cláusula al firmar T&C |
| DeepSeek API | **SÍ por defecto**; servidores en China (PRC), sin data residency | [política](https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html) |
| Alibaba Model Studio | NO según su doc; endpoint internacional = Singapur | [docs Model Studio](https://www.alibabacloud.com/help/en/model-studio/what-is-model-studio) |

**Regla dura resultante: DeepSeek VETADO para cualquier dato de paciente, cliente o PII** (chatbot WhatsApp, Recall/Cobrador, datos de clínicas). Datos dentales = datos de salud = sensibles → solo providers con no-training contractual (Google pago / OpenAI / Anthropic). Gate en litellm: keys de DeepSeek sin acceso a los grupos de ruteo que tocan datos de clientes.

Cláusulas a añadir a los borradores T&C + privacidad (commit `3881ae21`):
1. Disclosure de subencargados IA (Google, OpenAI, Anthropic) + compromiso de usar SOLO endpoints con no-training contractual.
2. Minimización: solo lo necesario va al modelo; seudonimizar PII de pacientes donde sea viable (nombre → iniciales/ID interno en agentes internos).
3. Retención: reflejar los 30 días de OpenAI y equivalentes; lo persistente vive en Supabase, no en los providers de IA.
4. Política de ingeniería: veto DeepSeek para PII (gate en litellm, no solo papel).
5. Marco Bolivia: sin ley general de protección de datos vigente (Constitución art. 21.2 + habeas data; proyectos en curso = UNKNOWN, validar con el abogado de los T&C). Tratar datos de salud con estándar GDPR-like por defecto: es foso comercial además de cobertura legal.
6. Portabilidad futura: reservar el derecho de migrar procesamiento a infraestructura propia (habilita el upsell on-prem sin renegociar).

### Camino local — honesto

- El VPS 4c/16GB sin GPU corre (llama.cpp/Ollama CPU-only) Qwen3-4B/8B Q4 a ~2-10 tok/s estimados (benchmark real en ese VPS = UNKNOWN): una respuesta de chatbot tardaría 1-3 minutos. **Viable SOLO para clasificación/etiquetado/dedup en batch nocturno y embeddings (bge-m3). NO para chatbot en tiempo real.** Además compite por RAM/CPU con n8n + Hermes + panel.
- **Kimi K2: IMPOSIBLE en ese hardware, punto.** MoE ~1T parámetros; solo los pesos Q4 son ~550-600GB.
- Local serio = GPU 24GB VRAM (RTX 3090 usada ~$700-1,000 / 4090 ~$1,800-2,500; precio Bolivia con importación = UNKNOWN) → capex ~$1,500-3,000 para calidad clase "mini de API de hace un año". Breakeven vs API: ~$110-140/mes equivalente ≈ **100-200 clientes activos sostenidos** antes de empatar — y para entonces la API habrá bajado de precio otra vez (tendencia 2024-2026: -50 a -80% por generación).
- **Conclusión sin humo: API gana por años al tamaño actual de ONIA.** Local solo en dos escenarios: (a) embeddings/clasificación gratis en el VPS como experimento de costo cero; (b) "tus datos nunca salen de tu clínica" como feature premium on-prem a un cliente grande que lo pague — ahí el hardware lo financia el deal, no el runway.

---

## 3. Herramientas a adoptar

### La que vio Sergio: CONFIRMADA — Responsively App → ADOPTAR

- [github.com/responsively-org/responsively-app](https://github.com/responsively-org/responsively-app) — AGPL-3.0 (dev-tool local, no se distribuye ni embebe → sin impacto en nuestro código); ACTIVO (push 2026-07-24, v1.18.0 feb-2026, 25.051 stars).
- Navegador Electron que muestra el sitio en 30+ dispositivos LADO A LADO con scroll/click/input espejados + hot reload + screenshots de todos a la vez.
- Instalar con el .exe de [releases](https://github.com/responsively-org/responsively-app/releases) (el paquete Chocolatey está viejo en v1.5.0 — no usarlo; winget = UNKNOWN).
- Honesto: Chrome DevTools ya cubre un viewport a la vez y Playwright ya testea breakpoints. Lo único que agrega es N dispositivos simultáneos con interacción espejada → vale para la **QA visual humana de Sergio antes de entregar webs de web-factory**, no reemplaza nada del pipeline automático. Costo cero, riesgo cero. Alternativa mejor de la categoría (Polypane) es comercial ~USD 9+/mes → descartada por runway.

### Top adoptar / parquear

| Herramienta | Veredicto | Para qué | Dato clave |
|---|---|---|---|
| [unlighthouse](https://github.com/harlan-zw/unlighthouse) | **ADOPTAR** | Lead magnet "analizamos tu web gratis": n8n recibe URL → unlighthouse en el VPS → reporte HTML + resumen al lead | MIT, 4.734 stars, push 2026-07-19; CPU-only OK en el VPS (limitar concurrencia) |
| [driver.js](https://github.com/kamranahmedse/driver.js) | **ADOPTAR** | Tours guiados del wizard /setup de DentalGest y onboarding del panel | MIT, 26.451 stars, release 2026-07-17; vanilla ~5kb, sin wrapper React |
| [node-qrcode](https://github.com/soldair/node-qrcode) (npm `qrcode`) | **ADOPTAR** (cuando llegue el API bancario) | SOLO renderizar el QR que devuelva el API del banco | MIT, 8.138 stars, el estándar npm. **No existe lib OSS viable para generar QR Simple: el QR pagable lo genera el banco** (modelo Facilitador ya definido; bloqueo = preguntas al banco, no tooling) |
| [devices.css](https://github.com/marvelapp/devices.css) | **ADOPTAR con cuidado** | Marcos de dispositivo CSS para sales kit y landings | MIT pero sin mantenimiento desde 2023-01; CSS puro = riesgo cero; sin marcos 2025-2026 (screenshot desde Responsively cubre el hueco) |
| [react-use-wizard](https://github.com/devrnt/react-use-wizard) | PARQUEAR | Wizard multi-paso headless | El wizard /setup YA está construido; recién para el próximo vertical si el actual duele |
| [md-to-pdf](https://github.com/simonhaenisch/md-to-pdf) | PARQUEAR | Markdown→PDF | Ya tenemos generador de propuestas propio + skill make-pdf + Puppeteer en stack |
| [ImpuestosBolivianos.Net](https://github.com/alexpizarroj/ImpuestosBolivianos.Net) | PARQUEAR | Referencia formato legacy | Régimen VIEJO (SFV pre-SIAT); nuestro foso SIAT/CUF ya está en el core |

Resumen ejecutable: instalar Responsively (installer de releases) + `driver.js` para tours + `unlighthouse` en el VPS para el lead magnet + `npm i qrcode` cuando llegue el API bancario. Todo MIT salvo Responsively (AGPL, uso local sin impacto). Nada más falta comprarse ni construirse para estos frentes.

---

## 4. Cómo sigue ONIA (próximos pasos, en orden)

1. **Correr la ruta crítica SIAT (homologación + NIT) como prioridad #1 comercial.** Es lo único con deadline externo (30-sep/1-oct-2026) y con competidor local activo (Sintic). Nubox y Bind prueban que quien conecta primero al ente fiscal retiene 20 años. Destrabar los bloqueos humanos S2 (NIT SIAT) y S8 (fiscal) esta semana.
2. **Cablear el ruteo litellm decidido** (`onia-chat`/`onia-agents`/`onia-webreport`/`onia-internal` con fallbacks, presupuestos por key, prompt caching) + **migrar cualquier alias `deepseek-chat`/`deepseek-reasoner`** (deprecados 2026-07-24) + gate: keys DeepSeek sin acceso a grupos con PII. Es un cambio de YAML, no de código.
3. **Añadir las 6 cláusulas de IA/datos a los borradores T&C + privacidad** (commit `3881ae21`) antes de que los revise el abogado — subencargados IA, minimización, retención, veto DeepSeek, estándar GDPR-like para datos de salud, portabilidad on-prem.
4. **Formalizar el pricing en 3 capas** (jugada Jobber): publicar los planes DentalGest 390/890/1990 con precios VISIBLES (donde Dentalink esconde), agentes IA como add-on con precio propio ("créditos de agente" por plan, jugada Dapta), y la línea "emisión SIAT ilimitada incluida, cero costo por factura" (jugada Bind) en todo el material de venta. El plan chico queda operativamente COMPLETO; limita volumen y agentes, no features.
5. **Diseñar "ONIA Contador"** (jugada Siigo): versión gratis para contadores bolivianos pre-deadline SIAT como canal de distribución. Primero validar con 3-5 contadores reales qué necesitan (no construir a ciegas); el deadline de facturación en línea es el gancho.
6. **Montar el lead magnet de análisis web:** unlighthouse en el VPS + workflow n8n (URL → escaneo → reporte con Gemini 3.5 Flash a ~$0.20-0.50/reporte). Es la pieza de captación más barata que sale de este research.
7. **QA visual + onboarding:** instalar Responsively para la QA de Sergio en web-factory; integrar driver.js en el wizard /setup y el panel. Bajo esfuerzo, mejora entrega y activación.

Lo que NO se hace (decidido): no plataforma horizontal (Dapta lo re-confirma), no LLM local para chat (breakeven a 100-200 clientes), no comprar Polypane, no construir generación de QR bancario (es bank-side).

---

## 5. UNKNOWN / a verificar

- **Dentalink en Bolivia:** presencia real UNKNOWN — verificar con 2-3 clínicas prospecto si lo usan o lo cotizaron.
- **Dapta funding 2026:** sin ronda nueva encontrada = UNKNOWN (no cambia la decisión).
- **Precios Qwen/Alibaba:** tomados de agregador ([benchlm.ai](https://benchlm.ai/alibaba/api-pricing)); verificar en consola Model Studio antes de cablear.
- **Calidad en español de los modelos:** valoración cualitativa, sin benchmark ES-específico citable = UNKNOWN formal (los 5 son usables; Claude/GPT/Gemini los más naturales).
- **Anthropic commercial terms:** no fetcheado en la sesión de research (confianza alta en no-training); verificar cláusula exacta al firmar.
- **Tok/s reales del VPS con Qwen3-4B/8B CPU-only:** estimación de orden de magnitud; benchmark real pendiente (solo si se activa el experimento de embeddings/clasificación).
- **Precio GPU 24GB en Bolivia con importación:** UNKNOWN exacto (solo relevante si aparece el deal on-prem).
- **Ley de protección de datos Bolivia:** estado exacto de los proyectos de ley = UNKNOWN; validar con el abogado que revisa los T&C.
- **Responsively:** manifest winget UNKNOWN; preset "iPhone 17 Pro Max" UNKNOWN (se puede agregar como dispositivo custom).
- **Fuentes de Bind ERP, Nubox y Dapta:** los links llegaron truncados en el handoff del research de startups; los datos citados (precios, claims) provienen de esa investigación — re-verificar URL exacta si se usan en material externo.
- **Riesgo Gemini 2.5 Flash-Lite:** generación vieja aún listada; si se depreca, el sucesor (3.1 Flash-Lite) cuesta 2.5x → por eso versión pinneada + revisión trimestral.

---

## Fuentes

Startups:
- Alegra: [precios MX](https://www.alegra.com/mexico/contabilidad/precios/) · [países (sin Bolivia)](https://www.alegra.com/) · [limitaciones](https://www.appvizer.es/contabilidad-finanzas/facturacion/alegra) · [análisis](https://www.guiadesoftware.com/software/alegra)
- Siigo: [producto](https://www.siigo.com/software-contable/) · [opiniones](https://www.comparapps.com/apps/siigo/) · [comparativa](https://programascontabilidad.com/comparativas-de-software/alegra-siigo-comparativa/)
- Odoo: [pricing](https://www.erpresearch.com/pricing/odoo) · [costos reales](https://www.swell.is/content/odoo-pricing) · [implementación](https://silentinfotech.com/blog/odoo-1/odoo-erp-implementation-cost-guide-2026-459)
- Dentalink: [planes](https://www.softwaredentalink.com/planes) · [opiniones](https://www.softwaredentalink.com/blog/opiniones-dentalink-pros-y-contras) · [Capterra](https://www.capterra.com/p/196361/Dentalink/)
- Jobber: [pricing](https://serviceagent.ai/blogs/jobber-pricing/) · [add-ons/fees](https://myquoteiq.com/jobber-pricing-breakdown-2026/) · [perfil](https://www.softwareadvice.com/field-service/jobber-profile/)
- Leadsales: [precios](https://www.eligetucrm.com/blog/leadsales-precios-2026) · [contexto MX](https://www.eligetucrm.com/crm-para-pymes-mexico)
- Bind ERP / Nubox / Dapta: links truncados en el handoff (ver §5).

Modelos (fetch 2026-07-25, páginas oficiales):
- [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) · [OpenAI API pricing](https://developers.openai.com/api/docs/pricing) · [Claude pricing](https://platform.claude.com/docs/en/about-claude/pricing) · [DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing) · [BenchLM Qwen (agregador)](https://benchlm.ai/alibaba/api-pricing)
- Privacidad: [OpenAI enterprise privacy](https://openai.com/enterprise-privacy/) · [OpenAI business data](https://openai.com/business-data/) · [Gemini paid tier (foro oficial)](https://discuss.ai.google.dev/t/is-my-data-used-for-training-or-retained-with-gemini-paid-api-calls/64837) · [Anthropic commercial terms](https://www.anthropic.com/legal/commercial-terms) · [DeepSeek privacy policy](https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html) · [Security Magazine sobre DeepSeek](https://www.securitymagazine.com/articles/101374-dangers-of-deepseeks-privacy-policy-data-risks-in-the-age-of-ai) · [Alibaba Model Studio](https://www.alibabacloud.com/help/en/model-studio/what-is-model-studio)

Herramientas:
- [Responsively App](https://github.com/responsively-org/responsively-app) · [responsively.app](https://responsively.app) · [unlighthouse](https://github.com/harlan-zw/unlighthouse) · [driver.js](https://github.com/kamranahmedse/driver.js) · [react-joyride](https://github.com/gilbarbara/react-joyride) · [react-use-wizard](https://github.com/devrnt/react-use-wizard) · [node-qrcode](https://github.com/soldair/node-qrcode) · [md-to-pdf](https://github.com/simonhaenisch/md-to-pdf) · [devices.css](https://github.com/marvelapp/devices.css) · [vendis-qr-php](https://github.com/10quality/vendis-qr-php) · [BCP-ADB-BOLIVIA](https://github.com/99Arrzel/BCP-ADB-BOLIVIA) · [ImpuestosBolivianos.Net](https://github.com/alexpizarroj/ImpuestosBolivianos.Net) · [Chocolatey `responsively` v1.5.0](https://community.chocolatey.org)
