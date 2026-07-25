# ONIA — Research Pack: Tooling + Device Preview + Modelos IA + Startups

**Fecha:** 2026-07-26 · **Estado:** doc de DECISIÓN (consolidado de 4 investigaciones verificadas 2026-07-25)
**Contexto:** ONIA = plataforma una-app (Next.js + Prisma + Supabase) para PyMEs Bolivia. DentalGest primer vertical (completo en código). Agentes IA human-in-the-loop. Runway corto (no gastar). VPS 4c/16GB sin GPU (Easypanel, n8n, litellm-db ~$0.006/acción). Webs en web-factory (Next 15).
**Regla del doc:** fuentes citadas; UNKNOWN cuando no hay fuente; cero humo.

---

## 1. Ver la UI en dispositivos (la herramienta + pasos)

### Decisión

| Capa | Herramienta | Costo | Cuándo |
|---|---|---|---|
| Principal | **Responsively App** (~25.1k ⭐, AGPL-3.0, OSS) | $0 | Diseño responsive multi-viewport: iPhone + tablet + desktop lado a lado, scroll espejado, screenshot masivo, hot-reload |
| Validación pre-entrega | **iPhone físico** (WiFi o túnel cloudflared) | $0 | Único método que muestra Safari/WebKit real (safe-area, dvh, quirks) |
| Día a día codeando | **Chrome DevTools** device toolbar | $0 | Cubre el 80% del trabajo de CSS responsive |

Descartados: **Polypane** (mejor UX pero ~$14/mes — no con este runway), viewers web iframe-based tipo MobileViewer (se rompen con X-Frame-Options/CSP, no espejan interacciones). Responsively es casi seguro lo que vio Sergio — es EL producto OSS conocido de esta categoría.

### Pasos concretos

**Instalar (Windows, elegir una):**

```powershell
winget install ResponsivelyApp
# o
choco install responsively
# o instalador .exe desde https://github.com/responsively-org/responsively-app/releases
```

**iPhone 17 Pro Max:** si no está en el roster built-in, agregarlo como custom device: **440 × 956 CSS px, DPR 3** (viewport oficial; fuente YesViz). El 17 Pro normal es 402 × 874 @3x.

**Levantar las apps ONIA** (ambos `package.json` tienen `dev: "next dev"` sin puerto fijo; el puerto va por flag):

```powershell
# terminal 1
cd C:\dev\proyectos\onia-hermes\web-factory\apps\onia-platform ; npm run dev -- -p 3198
# terminal 2
cd C:\dev\proyectos\onia-hermes\web-factory\apps\dentalgest-landing ; npm run dev -- -p 3199
```

En Responsively: pegar `http://localhost:3198` (o `:3199`), elegir suite iPhone 17 Pro Max + iPad + desktop. Hot-reload de Next funciona igual que en Chrome.

**iPhone físico — Vía 1, misma WiFi (2 min):**

1. `npm run dev -- -p 3198 -H 0.0.0.0`
2. `ipconfig` → IPv4 del adaptador WiFi (ej. `192.168.0.15`)
3. Primera vez, abrir firewall (PowerShell admin): `netsh advfirewall firewall add rule name="Next dev 3198-3199" dir=in action=allow protocol=TCP localport=3198-3199` (o aceptar el popup de Windows Defender para Node)
4. Safari del iPhone: `http://192.168.0.15:3198`. Requisito: misma red y router sin AP isolation.

**iPhone físico — Vía 2, túnel (sin red compartida, o para mostrar a un cliente):** cloudflared Quick Tunnel, gratis y SIN cuenta:

```powershell
winget install Cloudflare.cloudflared
cloudflared tunnel --url http://localhost:3198
```

Imprime `https://<random>.trycloudflare.com` — se abre desde cualquier lado (4G incluido), HTTPS real (sirve para APIs que exigen secure context). Muere al cerrar el proceso; es dev, no producción. ngrok también sirve pero exige cuenta y el free tier mete intersticial — cloudflared gana.

**Chrome DevTools:** F12 → Ctrl+Shift+M → Settings → Devices → custom "iPhone 17 Pro Max" (440×956, DPR 3). Lo que NO da: varios devices a la vez, screenshots masivos, ni rendering real de Safari/WebKit — para eso las otras dos capas.

**Fuentes:** [responsively-app (GitHub)](https://github.com/responsively-org/responsively-app) · [responsively.app](https://responsively.app/) · [iPhone 17 Pro Max viewport — YesViz](https://yesviz.com/devices/iphone-17-pro-max/) · [Cloudflare Tunnel — OpenReplay](https://blog.openreplay.com/exposing-localhost-cloudflare-tunnel/) · [Quick Tunnel 2026](https://recca0120.github.io/en/2026/04/14/cloudflare-tunnel-2026/) · [MobileViewer](https://mobileviewer.github.io/multi-device-preview) · [Responsively vs Polypane](https://www.opensourcealternative.to/project/responsively)

---

## 2. Repos/skills a adoptar (ADOPTAR / EVALUAR / SKIP)

Verificado 2026-07-25 vía `gh search repos` / `gh repo view` / `gh api` + WebSearch. Estrellas y actividad del API de GitHub ese día.

### Tabla de decisión

| Necesidad | Candidato | Stars | Licencia | Actividad | Veredicto |
|---|---|---|---|---|---|
| QR cobro Bolivia | **OpenBCB** (API gratuita del BCB, oct-2025: genera QR + consulta estado + webhook, sin costo) | n/a (API estatal) | gratis | lanzada 2025-10 | **ADOPTAR vía API** (evaluar acceso — tarea humana) |
| QR cobro Bolivia | [4n7h0ny07/QR-BNB (PHP)](https://github.com/4n7h0ny07/QR-del-Banco-Nacional-de-Bolivia-BNB-) | 0 | MIT | 2026-05 | Solo REFERENCIA del flujo REST para portar a TS |
| QR cobro Bolivia | [steplix/emv-qrcps](https://github.com/steplix/emv-qrcps) | 24 | ISC | muerto 2020 | **SKIP** (solo serviría para decodificar/validar) |
| Auditor de webs | [GoogleChrome/lighthouse](https://github.com/GoogleChrome/lighthouse) | 30,580 | Apache-2.0 | 2026-07-25 | **ADOPTAR** (módulo Node programático; corre en el VPS, $0) |
| Auditor de webs | [harlan-zw/unlighthouse](https://github.com/harlan-zw/unlighthouse) | 4,734 | MIT | 2026-07-19 | **EVALUAR** (sitio entero: crawlea + escanea con una llamada) |
| Auditor de webs | [StJudeWasHere/seonaut](https://github.com/StJudeWasHere/seonaut) | 742 | MIT | 2026-05 | EVALUAR solo si el SEO profundo entra al pitch; si no, SKIP |
| Legales SaaS es-LATAM | [basecamp/policies](https://github.com/basecamp/policies) | 125 | CC BY 4.0 | 2023-12 | **SKIP como dependencia** — usar como esqueleto, redactar 1 vez en español y versionar como plantilla propia |
| Admin/entitlements | [refinedev/refine](https://github.com/refinedev/refine) | 35,383 | MIT | 2026-06 | **EVALUAR (favorito)** — headless, Next App Router primera clase, respeta el look ONIA |
| Admin/entitlements | [marmelab/react-admin](https://github.com/marmelab/react-admin) + [ra-data-simple-prisma](https://github.com/codeledge/ra-data-simple-prisma) | 26,855 / 76 | MIT | 2026-07 | Plan B (UI Material choca con look ONIA; SSR/Next segunda clase) |
| Admin/entitlements | [SoftwareBrothers/adminjs](https://github.com/SoftwareBrothers/adminjs) | 8,973 | MIT | 2025-07 | **SKIP** (segundo runtime en el VPS, momentum en baja) |
| Wizard onboarding | [damianricobelli/stepperize](https://github.com/damianricobelli/stepperize) | 1,587 | MIT | 2026-06 | **ADOPTAR** para `/empezar` (base del stepper de shadcn; combina con react-hook-form + Zod ya en stack) |
| Wizard onboarding | [devrnt/react-use-wizard](https://github.com/devrnt/react-use-wizard) | 663 | MIT | 2026-01 | Plan B (hook minimalista, cero UI) |
| Wizard onboarding | [surveyjs/survey-library](https://github.com/surveyjs/survey-library) | 4,815 | MIT (core) | 2026-07 | **SKIP** (overkill salvo formularios definidos por no-devs) |
| Más skills de agente | [anthropics/skills](https://github.com/anthropics/skills) | 164,136 | sin LICENSE detectada | 2026-07 | **SKIP instalar más** — catálogo de actualizaciones, no gap-filler |

### Notas clave por bloque

- **QR Bolivia — hallazgo estructural:** el QR interoperable NO se genera localmente; lo genera la entidad financiera vía API (BNB/BCP/Baneco) y ahora **OpenBCB** (API gratuita del Banco Central). Una lib EMVCo local produce un QR que ningún banco boliviano acredita. No existe SDK JS/TS battle-tested para QR Bolivia. Ruta: seguir integración API bancaria (BNB sandbox ya en curso) + evaluar OpenBCB como vía cero-comisión — pedir acceso/docs al BCB es bloqueo humano tipo S*.
- **Auditor de webs** (feature "mandá tu web y la analizamos"): núcleo = lighthouse programático (`import lighthouse`, headless Chrome en el VPS). Operativa: correr los scans en cola (n8n/worker) porque Chrome headless come RAM.
- **Legales es-LATAM:** no existe repo OSS serio en español (búsquedas `gh search repos` solo devuelven repos personales de 0-2 stars — UNKNOWN como fuente única). Ruta: basecamp/policies (CC BY 4.0, atribución en footer) como estructura + adaptación Bolivia (Ley 164, habeas data; no hay ley general de datos personales vigente — **validar con abogado, no automatizable**). Generadores gratuitos ([Usercentrics ES](https://usercentrics.com/es/knowledge-hub/plantilla-terminos-y-condiciones/), [Shopify](https://www.shopify.com/tools/policy-generator/terms-and-conditions)) sirven para el primer borrador.
- **Admin:** contra-argumento honesto — para "altas + entitlements" (2-3 tablas), 4-5 páginas a mano con componentes ya existentes del onia-center pueden ser MÁS baratas que aprender un framework admin. Decidir por número real de entidades a operar.
- **Skills:** el cuello de botella del roadmap no son skills (137 globales + plugins ya cubren deploy/e2e/seo/security/n8n/supabase); son los bloqueos humanos S1-S9.

**Fuentes QR:** [BCB — Pagos QR](https://www.bcb.gob.bo/?q=pagos_qr_bcb_bolivia) · [Nota de prensa OpenBCB (PDF, BCB)](https://www.bcb.gob.bo/webdocs/10_notas_prensa/CP-44%20LANZAMIENTO%20OPENBCB%20_OK.pdf) · [Inside PayTech — OpenBCB](https://www.insidepaytech.com/noticias/bolivia-openbcb-banco-central-pagos-digitales-api-qr)

---

## 3. Startups similares (fuerte/débil + lecciones)

Amplía el scan previo — Dapta/Dentalink/Leadsales ya cubiertos en memoria `dapta-analisis-decision-vertical-first`; no se repiten.

### Tabla comparativa

| Startup | Qué vende | Pricing | FUERTE (copiar) | DÉBIL (donde ONIA gana) |
|---|---|---|---|---|
| **Alegra** (CO, ~2012) | Contabilidad + facturación electrónica + POS pyme, multi-país con fisco local integrado (DIAN/SAT/SUNAT/SRI/AFIP) | Planes fijos, no por usuario: MX $499–1.999 MXN/mes (~28–110 USD); CO ~17–70 USD | La integración fiscal local ES el producto (lock-in); autoservicio total sin humanos | **NO opera en Bolivia** (selector de países verificado en alegra.com 2026-07-25: Bolivia ausente); soporte degradado; registro sin operación (no agentes, no WhatsApp-first) |
| **Siigo/Aspel** (CO, roll-up) | Contable + administrativo + nómina + POS; CO/EC/UY/MX/PE; +1,2M clientes pyme | Modular; implementación completa suma 30-50% sobre plan base | Distribución vía **contadores como canal**; creció comprando al líder local de cada país | Soporte colapsa en picos fiscales (+2h espera, tickets a 72h); costos ocultos; legacy sin IA; tampoco Bolivia |
| **Odoo** (BE, +5M usuarios) | 50+ apps modulares ERP | One App Free → ~$25–31 USD/usuario/mes → Custom ~$47; implementación típica $5k–100k, personalización >3x licencias | Funnel "One App Free"; plataforma única multi-vertical = validación a escala del diseño onia-core (18 entidades / 9 módulos) | Inviable para pyme sin informático: curva alta, dependencia de partner, costo incontrolable; Odoo+SIAT en Bolivia = proyecto a medida vía integradores (ej. Sintic), no producto |
| **Bsale** (CL, +20.000 empresas) | POS + boleta/factura SII + inventario + ecommerce retail; CL/PE/CO/MX | Desde 1,5 UF + IVA/mes (~$27–87 USD); precio en UF indexa contra inflación | Dominó UN flujo de dinero (vender + emitir comprobante) y lo hizo perfecto; indexación de precio (aplica a Bolivia post-devaluación 2026) | No es contabilidad completa (integra terceros); centraliza ventas pero NO las automatiza; postventa pésimo según reviews |
| **AgendaPro** (CL, YC W21; +20.000 negocios, 1,8M reservas/mes) | "Shopify para belleza/bienestar LatAm": agenda + cobros + comisiones staff + CRM; Serie B $35M (Riverwood, ago-2025) para meter IA | Desde ~$20 USD/mes (sin free) + **% sobre pagos procesados** (doble motor SaaS + take-rate) | Vertical-first puro con motor transaccional encima del SaaS; prueba que "servicios con agenda + cobros" escala en LatAm hasta Serie B | Ni contabilidad ni fiscal local profundo; IA recién comprándose (2025); no Bolivia; sin agentes human-in-the-loop de cobranza/recall |
| **Darwin AI** (AR/BR, 2023) | "Empleados IA" para pymes: Alba (leads WhatsApp), Sophia (postventa), Lucas (cobranza); +300 clientes, ~$2M ARR, $7M levantados | UNKNOWN (venta consultiva, sin precios públicos verificables) | Packaging: no venden "IA", venden **un empleado con nombre y tarea medible**; ticket implícito alto (~$500+/mes) — las pymes SÍ pagan cuando reemplaza horas humanas | Capa conversacional horizontal SIN sistema de registro: sus agentes operan a ciegas sobre CRM de terceros. ONIA tiene agentes + ERP + fiscal en una app (el Cobrador de DentalGest ve la deuda real y emite la factura SIAT) |

### Las 5 lecciones accionables

1. **El gancho pyme LatAm es "cumplir con el fisco sin tipear" a plan fijo bajo** (Alegra) — exactamente la tesis SIAT de ONIA. **Bolivia es un hueco real del líder regional:** nadie con la calidad de Alegra está ahí.
2. **El canal > el producto en contabilidad pyme** (Siigo): reclutar contadores bolivianos como prescriptores de DentalGest/GestiOS con comisión recurrente = la versión sin-capital de la jugada Siigo; encaja con el esquema de colaboradores sin inversión ya definido.
3. **La pyme no compra "plataforma configurable", compra "resultado ya configurado"** (Odoo): vender DentalGest como producto terminado con onboarding de horas; onia-core queda como ventaja interna de velocidad, no como pitch.
4. **Anclar el producto donde entra la plata** (Bsale): el módulo a pulir primero en cada vertical es el que toca caja + SIAT, no el back-office. Y precio con cláusula de ajuste, nunca fijo eterno (memoria `bolivia-devaluacion-2026-impacto`).
5. **Take-rate + empleados IA con nombre** (AgendaPro + Darwin): cuando la pasarela BCP/BNB esté viva, cobrar un % chico del flujo (modelo facilitador ya definido) además del plan; y renombrar los agentes de DentalGest como empleados con KPI ("tu recepcionista IA que recupera pacientes", "tu cobrador IA") vendidos como add-on premium.

---

## 4. Modelos IA (matriz + camino en 3 etapas + recomendación)

### Decisión en 3 bullets

- **HOY:** mantener litellm y rutear en 2 carriles: **Gemini 2.5 Flash-Lite** ($0.10/$0.40 por 1M) para clasificación/volumen y **Claude Haiku 4.5** ($1/$5) para redacción de agentes con datos de paciente. El costo por acción cae de ~$0.006 a ~$0.0002–0.004 según caso. Regla dura: **datos de paciente NUNCA a endpoints chinos** (DeepSeek/Moonshot/Alibaba entrenan con prompts y sirven desde China).
- **INTERMEDIO:** con volumen sin datos sensibles (scraping, análisis de webs públicas, contenido), añadir **DeepSeek V4-Flash** ($0.14/$0.28; cache hit $0.0028) — 10-30x más barato que Haiku.
- **FUTURO/LOCAL:** el VPS 4c/16GB sin GPU **no corre nada serio** (Qwen3-32B pide ~20-25GB VRAM; Kimi K2 pide 350GB+). GPU alquilada (RTX 4090 ~$0.35/h ≈ $250/mes) recién con gasto API sostenido >$200-300/mes por 3 meses o exigencia contractual on-premise. Hoy ONIA está a >100x de ese volumen. Kimi "local" es fantasía con este hardware; Qwen local solo 4-8B y no vale por costo (solo por privacidad).

### Precios verificados (jul-2026, por 1M tokens, USD, vía litellm)

| Modelo | Input | Output | Nota |
|---|---|---|---|
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 | se retira 16-oct-2026; migrar al sucesor Flash-Lite 3.x |
| Gemini 3 Flash | $0.50 | $3.00 | 1M contexto, multimodal |
| Claude Haiku 4.5 | $1.00 | $5.00 | no entrena con datos API; retención 7 días |
| GPT-5.4 nano | $0.20 | $1.25 | |
| GPT-5.4 mini | $0.75 | $4.50 | |
| DeepSeek V4-Flash | $0.14 | $0.28 | cache hit $0.0028; servidores China |
| DeepSeek V4-Pro | $0.435 | $0.87 | servidores China |
| Qwen-Flash (3.5) | $0.05–0.10 | $0.40 | endpoint Singapur; Beijing 60-70% más barato |
| Qwen3.7-Max | $1.25 (promo 50%) | $3.75 | lista $2.50/$7.50 — NO es barato |
| Kimi K2.5 | $0.60 | $2.50 | pesos abiertos; API hosted entrena con prompts |
| Kimi K2.6 | $0.95 | $4.00 | |
| Kimi K3 | $3.00 | $15.00 | 2.8T params — modelo PREMIUM, no la jugada barata |

Nota: GPT-4o-mini y o3-mini ya son línea legacy — la comparación vigente es GPT-5.4 nano/mini.

### Matriz por caso de uso ONIA (supuestos de tokens propios, marcados)

| Caso de uso | Tokens (in/out) | Recomendado HOY | $/acción | Alternativa barata (sin datos paciente) | $/acción |
|---|---|---|---|---|---|
| Clasificar intake (work items) | 1k / 100 | Gemini 2.5 Flash-Lite | ~$0.00014 | Qwen-Flash | ~$0.0001 |
| Redactar mensajes Recall/Cobrador (borrador, human-in-the-loop) | 2k / 400 | **Claude Haiku 4.5** | ~$0.004 | — (datos de paciente: no sale del carril seguro) | — |
| Chatbot WhatsApp conversacional | 3k / 300 por turno | Gemini 3 Flash | ~$0.0024 | GPT-5.4 nano | ~$0.001 |
| Análisis de web del cliente | 15k / 1.5k | Gemini 3 Flash (1M ctx) | ~$0.012 | DeepSeek V4-Pro | ~$0.008 |
| Generación de docs/propuestas | 4k / 3k | Claude Haiku 4.5 (redacción ES) | ~$0.019 | Kimi K2.5 vía host US | ~$0.010 |

Lectura: el $0.006/acción actual de litellm-db es consistente; con este ruteo la clasificación cae ~40x y solo la redacción sensible queda en el rango actual.

### La verdad del "local"

- **Kimi K2/K2.6 (1T MoE):** Q2 = 350GB+ RAM+VRAM combinados; INT4 ~500GB VRAM (4× A100 80GB u 8× RTX 4090). Imposible e irrelevante para ONIA.
- **Qwen3-32B:** ~19-25GB VRAM en Q4 (una 4090/3090 justa). En el VPS sin GPU no entra ni en RAM (ya corre Easypanel/n8n/Speaches); en CPU daría 1-2 tok/s — inservible.
- **Lo único viable en el VPS:** modelos 4-8B Q4 (Qwen3-4B/8B ≈ 3-6GB RAM, ~5-15 tok/s) para clasificación simple, y **embeddings CPU (bge-m3 / multilingual-e5)**. Pero clasificar por API cuesta $0.0001/acción: lo local no ahorra dinero real y añade ops + contención de RAM. **Veredicto: local hoy solo para embeddings, y solo si se necesita búsqueda semántica.**

### Camino en 3 etapas (decidido)

1. **HOY (0-6 meses):** APIs ruteadas por litellm con la matriz de arriba. Dos carriles: `seguro` (Anthropic/Google/OpenAI pagos — datos de paciente) y `volumen` (Gemini Flash-Lite/Qwen-Flash — no sensibles). Acción concreta: configurar alias en litellm-db y poner el carril como campo del work item. Presupuesto esperado: <$10/mes hasta ~50k acciones/mes.
2. **INTERMEDIO (gasto >$50-100/mes):** activar DeepSeek V4-Flash (prompt caching: system prompts repetidos casi gratis) y Kimi K2.5 **vía hosts US (OpenRouter/Bedrock/Cloudflare — pesos abiertos, sin mandar datos a Moonshot)** para redacción larga barata. Solo tráfico sin datos de paciente.
3. **FUTURO (GPU):** gatillo = gasto API sostenido >$200-300/mes por 3 meses O cliente que exija on-premise. Primera jugada: **alquilar** RTX 4090 ($0.29-0.39/h ≈ $210-280/mes 24/7) con Qwen3-32B-AWQ + vLLM. Breakeven vs Haiku ≈ 60k acciones/mes de redacción; vs DeepSeek Flash ≈ 500k — la GPU se justifica por **privacidad/contrato, no por costo**. Comprar GPU propia (>$2,000 + importación a Bolivia + devaluación BOB) solo tras 8-12 meses de alquiler estable.

### Riesgos de privacidad (crítico: DentalGest = datos de salud)

| Proveedor | ¿Entrena con datos API? | Dónde procesa | Apto datos paciente |
|---|---|---|---|
| Anthropic (API comercial) | No; retención 7 días; ZDR disponible | US | SÍ |
| Google (tier PAGO) | No en tier pago (el gratuito SÍ usa datos) | US/global | SÍ (solo tier pago) |
| OpenAI (API) | No por defecto en API business (retención ~30 días) | US | SÍ |
| DeepSeek | Puede entrenar con prompts; almacena TODO en China; Ley de Inteligencia Nacional obliga entrega al Estado; investigado en UE | China | NO |
| Moonshot/Kimi hosted | Política admite entrenar con prompts; servidores sin país nombrado | China (vía entidad Singapur) | NO — usar pesos abiertos en host US |
| Alibaba/Qwen | Endpoint Singapur disponible; mismo marco legal chino para la matriz | Singapur/China | NO |

Contexto Bolivia: no hay ley integral de protección de datos vigente (solo habeas data constitucional) — el riesgo es contractual/reputacional, no multa local. Aun así DentalGest vende confianza: la regla "paciente = solo carril seguro" es innegociable y debe quedar **codificada en litellm, no como convención**.

**Fuentes:** [Anthropic Haiku pricing](https://www.anthropic.com/claude/haiku) · [pricepertoken Haiku 4.5](https://pricepertoken.com/pricing-page/model/anthropic-claude-haiku-4.5) · [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) · [pricepertoken Gemini 2.5 Flash-Lite](https://pricepertoken.com/pricing-page/model/google-gemini-2.5-flash-lite) · [OpenRouter Gemini 3 Flash](https://openrouter.ai/google/gemini-3-flash-preview) · [pricepertoken GPT-5 mini](https://pricepertoken.com/pricing-page/model/openai-gpt-5-mini) · [cloudzero OpenAI pricing](https://www.cloudzero.com/blog/openai-pricing/) · [DeepSeek pricing](https://deepseek.ai/pricing) · [chat-deep DeepSeek V4](https://chat-deep.ai/pricing/) · [OpenRouter DeepSeek V3.2](https://openrouter.ai/deepseek/deepseek-v3.2) · [BenchLM Qwen](https://benchlm.ai/alibaba/api-pricing) · [eesel Qwen](https://www.eesel.ai/blog/qwen-pricing) · [OpenRouter Kimi K2.5](https://openrouter.ai/moonshotai/kimi-k2.5) · [OpenRouter Kimi K3](https://openrouter.ai/moonshotai/kimi-k3) · [Unsloth Kimi K2.6 local](https://unsloth.ai/docs/models/kimi-k2.6) · [apxml GPU reqs Kimi](https://apxml.com/posts/gpu-system-requirements-kimi-llm) · [apxml Qwen3-32B VRAM](https://apxml.com/models/qwen3-32b)

---

## 5. Acciones concretas (priorizadas)

| # | Acción | Quién | Costo | Prioridad |
|---|---|---|---|---|
| 1 | Configurar alias de carriles en litellm-db (`seguro` = Haiku 4.5 / Gemini pago; `volumen` = Gemini 2.5 Flash-Lite) y agregar el carril como campo del work item. Regla "paciente = solo carril seguro" codificada, no convención | Agente (carril infra/G) | $0 (baja el costo/acción ~40x en clasificación) | **P0** |
| 2 | Instalar Responsively App (`winget install ResponsivelyApp`) + custom device iPhone 17 Pro Max (440×956 @3x) + probar onia-platform (`-p 3198`) y dentalgest-landing (`-p 3199`) | Sergio (2 min) o agente con computer-use | $0 | **P0** |
| 3 | Adoptar **stepperize** en el wizard `/empezar` de onia-platform (carpeta ya existe sin trackear; combina con react-hook-form + Zod; diseño 100% propio, regla anti-genérico) | Agente (carril web-factory) | $0 | **P1** |
| 4 | Prototipo del auditor de webs con **lighthouse programático** en el VPS, corriendo en cola vía n8n/worker (Chrome headless come RAM); evaluar unlighthouse para reporte multi-página | Agente (carril G, serial) | $0 | **P1** |
| 5 | Averiguar acceso/docs de **OpenBCB** (API QR gratuita del BCB) — vía cero-comisión para cobros; en paralelo seguir sandbox BNB | **Sergio** (gestión ante BCB/banco — bloqueo humano tipo S*) | $0 | **P1** |
| 6 | Reempaquetar los agentes de DentalGest como **empleados IA con nombre y KPI** ("recepcionista IA que recupera pacientes", "cobrador IA") como add-on premium en pricing/propuestas (lección Darwin AI + encaja con pricing ratificado) | Agente (carril C propuestas) + OK de Sergio | $0 | **P1** |
| 7 | Sumar **contadores bolivianos como canal prescriptor** al esquema de colaboradores sin inversión (comisión recurrente — jugada Siigo sin capital) | Sergio (reclutamiento) + agente (materiales) | $0 | **P2** |
| 8 | Redactar legales SaaS 1 vez en español (esqueleto basecamp/policies CC BY 4.0 + adaptación Ley 164/habeas data) y versionarlos como plantilla propia en web-factory; **validación final con abogado** | Agente (borrador) + Sergio (abogado) | $0 borrador | **P2** |
| 9 | Decidir admin/entitlements por número real de entidades: si son 2-3 tablas → páginas a mano con componentes del onia-center; si crece → refine (MIT, headless) | Agente propone, Sergio decide | $0 | **P2** |
| 10 | Anotar migración: Gemini 2.5 Flash-Lite se retira el **16-oct-2026** → migrar alias litellm al sucesor Flash-Lite 3.x antes de esa fecha | Agente (recordatorio n8n/radar) | $0 | **P2** |
| 11 | NO hacer: comprar GPU, instalar más skills de agente, libs EMVCo locales, AdminJS, SurveyJS, Polypane, modelos locales en el VPS (salvo embeddings CPU si aparece búsqueda semántica) | — | ahorro | — |

---

*Consolidado de 4 investigaciones (device preview · repos OSS · startups comparables · modelos IA), verificadas 2026-07-25. Investigaciones 2 y 3 llegaron truncadas en el traspaso (Research 2 corta en la sección de skills; Research 3 corta en la lección de Darwin AI); lo consolidado refleja el contenido recibido íntegro hasta ese punto.*
