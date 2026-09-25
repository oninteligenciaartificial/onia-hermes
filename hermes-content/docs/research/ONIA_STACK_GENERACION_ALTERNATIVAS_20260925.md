# Stack de generación (video, imagen, voz): alternativas a Higgsfield y ElevenLabs, y «nuestro propio Higgsfield»

> **Investigación del 2026-09-25** · sesión CONTENIDO · para Sergio Urcullo. Solo lectura: no se
> gastó, no se generó, no se usaron claves y no se abrió cuenta en ningún proveedor.
> **Foto de un día:** los precios de IA cambian cada mes. **Ningún precio de este doc autoriza una
> compra.**
> Este doc **no fija ni cita precios de ONIA**. Los planes se leen de
> `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`) y los add-ons de
> `onia-platform/lib/pricing.ts`.

## ⚠️ Límite de la verificación (leer primero)

- **El proxy de la sesión bloqueó las páginas de precios de los proveedores** (403 en la conexión
  CONNECT): `higgsfield.ai`, `elevenlabs.io`, `fal.ai`, `replicate.com`, `ai.google.dev`,
  `openrouter.ai`, `runware.ai`, `docs.litellm.ai`. Re-comprobado hoy con `curl` para higgsfield.ai,
  elevenlabs.io y fal.ai.
- Por eso **ningún precio de proveedor se leyó en su propia página**. Cada precio lleva su origen:
  - **[O]** resumen del buscador sobre la página oficial. **La página no se abrió.**
  - **[L]** catálogo de precios de LiteLLM en GitHub (`model_prices_and_context_window.json`, rama
    `main`, bajado el 25-sep). Fuente secundaria, mantenida por la comunidad.
  - **[T]** blog o comparador de terceros.
  - **[R]** medido por ONIA en el repo, con su fecha y archivo.
- **Todo lo [O], [L] y [T] sale de resúmenes o de terceros**, consultado el **2026-09-25** salvo
  donde se indica otra fecha. Lo único medido de primera mano es lo [R].
- Antes de cualquier compra se mira la página del proveedor ("verificar es MIRAR"): son 5 minutos.

---

## 0. La respuesta corta

1. **El problema no es de proveedor: es de tamaño del plan.** ONIA paga **Higgsfield Ultra**
   (US$99 anual o US$129 mensual; 3.000 créditos por mes que **no se acumulan**) y consumió
   **~1.040 créditos en agosto** (su mes pico, con Lucía) y **~27 en septiembre** (después vino
   "Nada de Higgsfield"). A precio de API, la canasta de agosto costaría **≈ US$40-50**. En agosto,
   el crédito usado salió **~3 veces más caro** que su valor nominal; en septiembre, absurdo.
2. **Por unidad, la suscripción NO es cara.** Usada entera, sus créditos salen igual o más baratos
   que las APIs para los modelos que usa ONIA (Kling 3.0: US$0,041-0,054/s contra US$0,084/s en fal;
   Nano Banana Pro: US$0,066-0,086 contra US$0,134 directo de Google). **Una capa propia sobre APIs
   no baja el costo por unidad: lo sube.** Lo único que se gana es no pagar un mínimo mensual.
3. **Ese ahorro se consigue sin construir nada:** bajar de Ultra a Plus o Starter, o pasar a la
   **API de pago por uso que Higgsfield abrió el 16-sep-2026** (US$ por segundo o por imagen, sin
   suscripción; las fallas no se cobran [O]). Trae su catálogo y **Soul 2 a ~US$0,0032 por imagen**
   [T]. Es, literalmente, "Higgsfield sin suscripción".
4. **Los "Open Higgsfield" de GitHub no son un Higgsfield propio:** son **interfaces sobre una API
   paga**. El más popular con ese nombre (3.735★) corre **sobre la propia API de Higgsfield** y **no
   tiene licencia** (no se puede reutilizar legalmente). El de 29k★ es una puerta de entrada
   comercial a MuAPI y se promociona "sin filtros de contenido". **Ninguno entrena modelos ni
   replica Soul ID, Elements ni Marketing Studio**, que es justo lo que ONIA usa para la identidad.
5. **Test de las tres preguntas:** como producto para vender, **falla dos o tres de las tres** y
   sería la **décima línea de negocio**. Como herramienta interna, **no sirve a la Etapa 1**: el
   cuello de botella son los clientes, no el costo de generar. **No se construye ahora.** La
   construcción recién se paga con **≈ US$160-540/mes de generación sostenida**, entre **4 y 12
   veces** el pico de agosto.
6. **Lo que sí sirve a la Etapa 1 depende de Sergio Urcullo:** cerrar el tema del cobro de
   Higgsfield y **ajustar el plan al uso real**. Ultra es **~37 % del gasto mensual** con el que la
   estrategia calcula el punto de equilibrio (Bs 1.365 de Bs 3.650; `FINANCE_LOG_2026.md:21`,
   `ONIA_ESTRATEGIA_DE_EMPRESA.md` §4). Como el equilibrio es `gasto ÷ precio del plan`, recortar el
   plan lo baja **de ~5 a ~3-4 clientes**. Además, confirmar que ElevenLabs está en **Starter** o
   más: **el plan Free no da licencia comercial**.
7. **Sesión:** esta sesión (CONTENIDO) no lo toma. La decisión de facturación es de Sergio Urcullo y
   no necesita sesión técnica. La capa técnica, si algún día se hace, es de la **Fase 3 del carril
   Higgsfield/Lucía** (wrapper `doctor/quote/submit/poll/reconcile/download/qa`;
   `hermes-content/docs/handoff/HIGGSFIELD-LUCIA-SYSTEM-2026-09-22.md:188-194`), que el propio
   handoff condiciona a que gane el Soul v4, y va **después de la salida de la Etapa 1** y con los
   disparadores del §6.

---

## 1. Uso y gasto reales de ONIA (del repo)

### 1.1 Suscripciones y herramientas

| Herramienta | Plan / costo | Para qué | Estado | Fuente en el repo |
|---|---|---|---|---|
| **Higgsfield** | **Ultra**, 3.000 cr/mes. `FINANCE_LOG_2026.md:21` registra **US$130 = Bs 1.365** el 01-jun (mensual). El 31-ago la cuenta decía "3.000 cr/mes por $99 facturado anual" y costo real **US$0,033/cr = Bs 0,375** (`references/modelos/lucia/TECNICA-HIGGSFIELD.md:235-239`) | Lucía (influencer IA), avatares de Sergio Urcullo, b-roll, fotos, UGC, lipsync (`sync_so`) | **Cobro en estado incierto** (§1.2). 22-sep: la sesión local de la CLI no está operativa y pide un nuevo `higgsfield auth login` (`handoff/HIGGSFIELD-LUCIA-SYSTEM-2026-09-22.md:72`) | `FINANCE_LOG_2026.md`; `TECNICA-HIGGSFIELD.md` §226-268 y §867-921; `ONIA_MARCA_PERSONAL_HIGGSFIELD_RECETAS.md`; `cola/drops/2026-09-07.md` |
| **ElevenLabs** | Probablemente **Starter** (~US$5-6/mes): "starter ≈ USD 5/mes — plan actual" (`ONIA_SERVICIOS_POR_CASO_PRECIOS_20260801.md:129`, 01-ago). **No figura en `FINANCE_LOG_2026.md`** | Voz de Lucía («Marcela», colombiana, `eleven_multilingual_v2`; `references/modelos/lucia/LUCIA.md:379-388`), voz diseñada «Lucia-ONIA», clon «Sergio ONIA», **Jarvis matinal** (voz premade «Daniel», desde el 17-sep) | La voz **clonada** del `.env` da **401 `subscription_required` en el plan actual** (`scripts/loops/extras/jarvis-voz.sh:6-7`): o la cuenta está en Free (sin clonación ni uso comercial) o es un clon profesional que exige Creator. **No verificado** | `references/models/lucia-voice/README.md`; `web-factory/docs/MODELOS_IA_QUE_USAR_PARA_QUE.md` §6 |
| **fal.ai / Replicate / otros** | **Nunca se dieron de alta** ("falta API key" desde julio) | — | — | `ONIA_SYSTEM_TASKBOARD_2026.md:48`; `.claude/agents/_retirados/onia-integrations.md` |
| **kie.ai** | Solo en **2 plantillas n8n importadas e inactivas** (`active=false`, mar-2026) | Veo 3 → TikTok (plantilla de terceros) | Inactivas | `hermes-content/deploy/vps-ops/n8n-backup-20260820/p73krZtQA0IYzaKZ.json` |
| **Kokoro (local)** | Gratis, CPU | TTS de respaldo del motor de audio de HyperFrames/media-use | Disponible | `.claude/skills/media-use/audio/scripts/lib/tts.mjs` |
| **Voz del chatbot (futuro)** | Decidido **ElevenLabs Flash v2.5**, gasto aprobado por Sergio Urcullo el 2026-08-07, **a contratar** | Llamadas de WhatsApp (add-on de voz) | No contratado a esa fecha | `ONIA_VOZ_WHATSAPP_ARQUITECTURA_20260802.md:268`, `:876` |

### 1.2 Estado del cobro de Higgsfield: las fuentes no cierran entre sí

- **01-sep:** barra roja *"Payment failed. We couldn't charge your subscription. Unlimited
  generations are paused."*; no bloquea generar por crédito y lo resuelve Sergio Urcullo, no Claude
  (`TECNICA-HIGGSFIELD.md:869-879`). Ese mismo día un clic por coordenada abrió un modal
  `Pro · Annual · $348`; se cerró y se verificó que **no quedó ningún compromiso** (`:884-890`).
- **02-sep:** generación capada por `grace_daily_limit_reached` (~13 h sin generar). Una nota lo
  atribuye a una "cuenta en periodo de gracia por el cobro anual reclamado"
  (`ONIA_MARCA_PERSONAL_HIGGSFIELD_RECETAS.md:104`); la bitácora dice que esa relación es
  **hipótesis, no medición**, y que la API "miente por omisión" sobre ese estado
  (`references/modelos/lucia/BITACORA-PERFECCION.md:406-414`).
- **07-sep:** se registra "un cobro de Pro anual $348 no deseado en reclamo", y Sergio Urcullo
  ratificó igual la herramienta (`cola/drops/2026-09-07.md:48-51`). El plan de videos del 11-20 sep
  dice "Nada de Higgsfield (cobro en reclamo)" (`cola/PLAN-VIDEOS-11-20-SEP.md:28`).

**Conclusión:** si los US$348 se cobraron o no, y en qué quedó el reclamo, **solo lo ve Sergio
Urcullo** en `higgsfield.ai/me/settings/subscription` y en su banco. Ningún doc del repo lo cierra.

### 1.3 Volumen real: créditos por mes (Higgsfield)

Los créditos se reinician el día 1 y no se acumulan (Higgsfield [O] y la serie de saldos: 24-jul
2.354 → 01-ago 2.996).

| Mes | Consumo | Evidencia |
|---|---|---|
| jun-2026 | **~3.000** (por diferencia; mes de pruebas fuertes con avatares de Sergio Urcullo y Mara) | Uso histórico al 01-sep: **4.900,85 cr · 782 generaciones · US$196,03** (`TECNICA-HIGGSFIELD.md:897-898`); 04-jun: 2.752 → 2.680 cr (`references/sergio-approved-media/higgsfield-runs/20260604-black-avatar-test/credits-estimate.json`) |
| jul-2026 | **≥ 646** al 24-jul (3.000 → 2.354,22) | `supabase/migrations/20260724_onia_center_provider_credits.sql:2` |
| **ago-2026** | **~1.040** (3.000 → 1.959,58 al 31-ago) | 01-ago ~2.996 (`ONIA_MODELOS_IA_FICHAS_20260801.md`) · 06-ago 2.993,73 (`HIGGSFIELD_FULL_CAPABILITIES_MAP.md`) · 12-ago 2.862,68 (`ONIA_AUDITORIA_MARKETING_LUCIA_20260812.md`) · 31-ago 1.959,58 (`TECNICA-HIGGSFIELD.md:237`) |
| sep-2026 | **~27** (1.959,58 → 1.932,14 al 03-sep), después **pausa**. No hubo recarga el 1-sep por el pago fallido | `BITACORA-PERFECCION.md:1257-1263`; `cola/PLAN-VIDEOS-11-20-SEP.md` ("Nada de Higgsfield"); handoff del 22-sep |

**Mezcla histórica por modelo** (porcentaje del gasto en créditos, al 01-sep; `TECNICA-HIGGSFIELD.md`
§3): Seedance 2.0 29 % · Marketing Studio Video 15 % · Nano Banana Pro 11 % · Kling 3.0 9 % · Soul
ID 6 % · Nano Banana 2 4 % · GPT Image 2 4 % · Wan 2.7 3 % · otros 20 %.

**Un mes "activo" de ~1.000 créditos, en unidades físicas** (estimación: aplica la mezcla histórica
a los costos medidos del §1.4):

| Rubro | Estimación mensual |
|---|---|
| Imágenes | **~115-155** (≈55 Nano Banana Pro, ≈20 Nano Banana 2, 40-80 GPT Image 2, más stills Soul) |
| Video generado | **~175 s ≈ 3 minutos** (≈35 clips de 5 s: Seedance ~32 s, Marketing Studio ~50 s, Kling ~72 s, Wan ~20 s) |
| Lipsync, upscale, audio | ~200 cr (≈10 lipsyncs `sync_so` de 5 s o equivalente) |
| **Voz de contenido** | **~1-3 minutos** (narraciones de Lucía: ~350 caracteres por reel, en una sola llamada; Sergio Urcullo graba con su voz real) |
| Voz interna (Jarvis) | Hasta 2.400 caracteres por día (`jarvis-voz.sh:18`) ≈ **≤ 72k caracteres/mes ≈ ≤ 80 min**. Es el **tope** del script, **no el consumo medido**. Con Starter (30k créditos) se agotaría a mitad de mes: conviene mirarlo en el panel de ElevenLabs |

**Hoy (septiembre):** el contenido se hace con **grabación real de Sergio Urcullo y pantallas**, con
cero video generado (`handoff/EDICION-MARCA-PERSONAL-2026-09-21.md`, `cola/PLAN-VIDEOS-11-20-SEP.md`).
Lucía está frenada por el gate de derechos (`references/modelos/lucia/LUCIA-HIGGSFIELD-IDENTITY.json`:
`rights_gate.status = "unresolved"`, `new_training = "blocked"`).

### 1.4 Costo medido por pieza dentro de Higgsfield [R]

Conversión a US$ con **US$0,033/cr (Ultra anual)** o **US$0,043/cr (Ultra mensual US$129)**.

| Pieza | Créditos | US$ | Fuente |
|---|---:|---:|---|
| Imagen `nano_banana_2` / `nano_banana_pro` 2K | 2,00 | 0,066-0,086 | `web-factory/docs/MODELOS_IA_QUE_USAR_PARA_QUE.md` §7; `TECNICA-HIGGSFIELD.md` §226 |
| Imagen sin cara `z_image` | 0,15 | 0,005-0,006 | idem |
| Imagen `gpt_image_2` low | 0,50 | 0,017-0,022 | idem |
| Still Soul `text2image_soul_v2` 2K | 0,12 | 0,004-0,005 | `ONIA_MARCA_PERSONAL_HIGGSFIELD_RECETAS.md` (cotizado = debitado) |
| Kling 3.0 "Animate" 5 s sin sonido | 6,25 | 0,21-0,27 (**0,041-0,054/s**) | `TECNICA-HIGGSFIELD.md` §226 |
| `kling3_0_turbo` 5 s | 7,50 | 0,25-0,32 (0,050-0,065/s) | `MODELOS_IA_QUE_USAR_PARA_QUE.md` §1 |
| `veo3_1_lite` 8 s | 8,00 | 0,26-0,34 (0,033-0,043/s) | idem |
| `seedance_2_5` omni_reference 5 s | 32,5 | 1,07-1,40 (**0,21-0,28/s**) | idem (medido el 21-ago) |
| `marketing_studio_video` (~12-15 s) | 42 | 1,39-1,81 | `references/VIDEO_MODEL_STACK_DECISION_2026.md` |
| Lipsync `sync_so` (remap, ~5 s) | 18,15 | 0,60-0,78 | `MODELOS_IA_QUE_USAR_PARA_QUE.md` §6 |
| Reel completo (b-roll + voz + fotos) | 25-30 | 0,83-1,29 | `TECNICA-HIGGSFIELD.md` §248 |

### 1.5 Infraestructura propia: nada sirve hoy para modelos generativos

- **VPS:** 4 vCPU, 16 GB, **sin GPU**; el disco llegó al 85 % (`PLAN_HOMELAB.md:78`;
  `handoff/onia-dev-node-setup.md`).
- **nodo-casa** (`DESKTOP-0GGGNMF`): i5-12400F, 16 GB, ~1,1 TB libre y **GeForce GT 730 de 4 GB**
  (2014, sin núcleos tensoriales). El repo concluye que **"la gráfica no sirve para modelos
  locales"** (`PLAN_HOMELAB.md:20-25`). Además está caído: WSL apagado desde el 19-sep
  (`handoff/infra-cerebro-loops.md:124-126`).
- **LiteLLM ya corre en el VPS** como puerta de enlace del chatbot.
- **`video-factory/` es un esqueleto:** planificador con contratos, formatos y un adapter de
  Higgsfield **sin runtime productivo**, con tarifas históricas y compuertas de cotización y
  aprobación (`video-factory/FACTORY.md:7-16`).

---

## 2. Precios por unidad (consulta 2026-09-25)

Unidades: **US$ por segundo de video**, **US$ por imagen**, **US$ por 1.000 caracteres o por minuto
de voz** (el repo supone ~900 caracteres por minuto de español hablado: supuesto A1 de
`ONIA_VOZ_WHATSAPP_ARQUITECTURA_20260802.md:556`, marcado ahí como supuesto sin medir). Ninguna
página traía sello de fecha, salvo donde se indica.

### 2.1 Planes de Higgsfield (referencia)

| Plan | Precio | Créditos/mes | US$/crédito | Nota | Fuente |
|---|---|---:|---:|---|---|
| Starter | US$15/mes | 200 | 0,075 | sin el set "unlimited" | [O] higgsfield.ai/creator-hub/help-center/plans/how-do-higgsfield-plans-work |
| Plus | US$49/mes o **US$39 anual** | 1.000 | 0,039-0,049 | set de 6 modelos de imagen por 365 días; ventana de 7 días de NB2 | [O] idem · higgsfield.ai/pricing |
| **Ultra (el de ONIA)** | US$129/mes o **US$99 anual** | 3.000 | 0,033-0,043 | ventanas de Nano Banana Pro y NB2; el anual suma Kling 3.0 | [O] idem |
| Packs de créditos | US$5 (80) a US$80 (1.700) | — | 0,047-0,0625 | vencen a los 90 días | [T] layer3labs / krea |
| **API de pago por uso** (nueva, **16-sep-2026**) | Sin suscripción; US$ por segundo o por imagen; **las fallas no se cobran** | — | — | Base `https://api.higgsfield.ai`, clave `id:secret`; las salidas se guardan ≥ 7 días (hay que bajarlas); incluye Soul 2, Soul Cinema, Marketing Studio Image, Kling, Seedance, MiniMax, Wan, Recraft e Ideogram | [O] open.higgsfield.ai/pricing · higgsfield.ai/blog/higgsfield-api · [T] github.com/jondmarien/ai-ugc-pipeline/issues/33 |

### 2.2 Video (US$ por segundo)

| Modelo | Higgsfield suscripción [R] | Higgsfield API | fal.ai | Oficial / otros | Notas |
|---|---:|---:|---:|---|---|
| **Kling 3.0** std, sin audio | **0,041-0,054** | **0,084** de lista (0,042-0,046 con la promo de lanzamiento, ya vencida) [O] | **0,084**; con audio 0,126; Pro 0,112 / 0,168 [O] | Kling oficial 1080p 0,112 sin audio / 0,168 con audio; **API en paquetes prepagos desde US$700** [T cloudzero] | Un tercero dice que la API de HF sale ~15 % más barata que fal [T] |
| Kling 3.0 Turbo | 0,050-0,065 | — | 0,095 [T] | — | — |
| **Seedance 2.5** | **0,21-0,28** (omni-ref) | ≈0,21 (480p) / ≈0,46 (720p), derivado de US$0,0214 por 1k tokens [O] | 0,2205 (480p) / 0,473 (720p) [L] | Runway API 0,20 / 0,30 / 0,68 (480p / base / 1080p) [L]; MuAPI "desde 0,17" [T]; WaveSpeed US$0,90 por 5 s a 480p [T] | "El más caro": ~US$5 por 15 s [T daily.dev] |
| **Seedance 2.0** | (~9 cr/s, 45-135 cr por clip) | 0,0985 en el lanzamiento (con 30 % de descuento) [T] | 0,1346 (480p) / 0,3034 (720p) / 0,682 (1080p) [L] | **BytePlus ModelArk US$10,70 por millón de tokens ≈ 0,231/s a 720p** [T apiframe]; Runway 0,36 [L] | **Los canales oficiales bloquean referencias con cara real** desde feb-2026 (§4) |
| **Veo 3.1 Lite** | 0,033-0,043 | — | 0,05 [T] | **Google 0,03-0,05 (720p/1080p)** [L][T] | Marca de agua SynthID |
| Veo 3.1 Fast | — | — | — | Google 0,10-0,15 (4K 0,30) [L][T]; kie.ai "US$0,40 por 8 s" = 0,05 [O kie, revendedor] | Precio de kie por debajo del oficial: señal de reventa no oficial |
| Veo 3.1 (calidad) | ~0,07-0,09 (`veo3_1` basic, 16,5 cr por clip) [R 09-jul] | — | — | **Google 0,40** (4K 0,60) [L] | La suscripción sale mucho más barata que la API directa |
| MiniMax H3 / Hailuo | ~0,033-0,043 (`minimax_hailuo` 6 cr por clip) [R] | incluye Hailuo 2.3 | H3: 0,05 (480p) / 0,06 (768p) / 0,13 (2K) [L] | MiniMax oficial H3 0,08 (768p) / 0,13 (2K) [T]; Hailuo 2.3 0,0817 (legacy) [T] | — |
| Wan | (`wan2_7` 7,5 cr por 5 s) | incluye Wan | — | Wan 2.6 ~0,05 en agregadores [T]. **Wan 2.7 con pesos abiertos, Apache-2.0 (mar-2026)**; Wan 3.0 solo por API (beta desde el 06-ago-2026) [T] | Autohospedado: Wan 2.2 TI2V-5B genera **5 s a 720p en < 9 min en una GPU de consumo** (README oficial) → RunPod 4090 a US$0,34/h ≈ **US$0,05 por clip ≈ 0,01/s de GPU**, sin contar horas de montaje ni la calidad inferior |
| Runway Gen-4.5 | — | — | — | **0,12** (US$0,01 por crédito × 12); Aleph 2 0,28 [T] | — |
| Luma Ray 3.2 | — | — | — | ≈US$1,20 por 5 s a 1080p SDR (≈0,24) [T] | — |
| xAI Grok Imagine Video 1.5 | — | — | — | 0,08 / 0,14 / 0,25 (480p / 720p / 1080p) [L] | — |
| ~~OpenAI Sora 2~~ | — | — | — | Era 0,10 (Pro 0,30-0,70). **API apagada el 24-sep-2026** [T costgoat / unifically / leaxor] | **Descartado** |
| OpenRouter | — | — | — | **API de video desde abr-2026** (Seedance, Veo 3.1, Wan, MiniMax H3…), precios de paso [T] | Útil si se quiere una sola clave para LLM, imagen y video |
| Replicate / Together | — | — | — | **No verificado** (página bloqueada; el buscador no devolvió tarifas) | — |

### 2.3 Imagen (US$ por imagen)

| Modelo | Higgsfield suscripción [R] | Directo del fabricante | fal.ai / otros | Fuente |
|---|---:|---:|---:|---|
| Nano Banana 2 (Gemini 3.1 Flash Image) | 0,066-0,086 (2K) | **0,045 (0,5K) · 0,067 (1K) · 0,101 (2K) · 0,151 (4K)**; batch −50 % | fal 0,08 (1K) / 0,12 (2K) [L] | [T] openrouter / benchlm; [L] |
| **Nano Banana Pro** (Gemini 3 Pro Image) | **0,066-0,086** | **0,134 (1K/2K) · 0,24 (4K)** | fal 0,15 / 0,30 [L] | [T] pixmind ("precio oficial al 05-ago-2026") |
| GPT Image 2 (1024×1536) | 0,017-0,022 (low) | low **0,005** · medium **0,041** · high **0,165** | GPT Image 2.5 (08-sep-2026): misma tarifa por token | [T] aifreeapi (consultado el 06-sep-2026) · [O] developers.openai.com |
| Seedream 5.0 | — | 0,045 (≤ 2,36 MP) / 0,09 | — | [T] atlascloud (BytePlus) |
| Qwen-Image 2.0 / Pro | — | 0,035 / 0,075 | pesos abiertos (Qwen-Image v1, Apache-2.0) | [T] therundown |
| FLUX.2 Pro | — | 0,03 el primer MP + 0,015 por MP adicional | — | [T] docs.bfl.ml vía buscador |
| **Z-Image Turbo** (sin cara) | **0,005-0,006** | — | fal **0,005 por MP** | [O] fal |
| **Soul 2** (Higgsfield) | 0,004-0,005 | **API de HF ≈ 0,0032** | — | [T] layer3labs · github issue #33 |
| **Entrenar identidad (LoRA)** | Soul ID: 6 % del gasto histórico | — | fal FLUX LoRA **US$2 por entrenamiento**; Qwen-Image LoRA **US$1,50 por 1.000 pasos** | [O] fal |

### 2.4 Voz por API (TTS)

| Opción | Precio | US$ por 1k caracteres (≈1 min) | Clonación | Español / variante | Licencia comercial | Fuente |
|---|---|---:|---|---|---|---|
| **ElevenLabs** Free / Starter / Creator / Pro | US$0 (10k cr) · **US$6 (30k; US$5 anual)** · US$22 (121k; primer mes US$11) · US$99 (600k) · Scale US$299 · Business US$990 | Starter 0,20 · Creator 0,18 · Pro 0,165 (v2 = 1 crédito por carácter; Flash = 0,5) | IVC desde Starter; PVC desde Creator | Multilingual v2 lista "Spanish (Spain, Mexico)"; sin es-419 declarado | **Free: NO (exige atribución).** Starter o más: sí | [O] elevenlabs.io/pricing (coincide con lo que el repo leyó el 07-ago) |
| ElevenLabs API de pago por uso | Flash/Turbo **US$0,05 por 1k**; Multilingual v2/v3 **US$0,10 por 1k** | 0,05-0,10 | — | — | a verificar | [O] blog "We've lowered API & Agents pricing and introduced PAYG" (Flash); [T] v2/v3 |
| OpenAI `gpt-4o-mini-tts` | ≈**US$0,015 por minuto**; `tts-1` US$15 por millón de caracteres; HD US$30 | ~0,015-0,017 | no | multilingüe; sin variante regional | sí | [L] · [T] texttolab / costgoat |
| Google Chirp 3 HD / Gemini TTS | Chirp 3 HD **US$30 por millón de caracteres (1M gratis por mes)**; Gemini 2.5 Flash TTS US$10 por millón de tokens de audio ≈ 0,015/min; Gemini 3.8 Flash-Lite TTS ≈ 0,009/min | 0,009-0,03 | no | es-US / es-ES | sí | [L] · [T] |
| **Azure Neural** | **US$15-16 por millón de caracteres; gratis 0,5M por mes (F0)** | 0,015-0,016 | Custom Neural Voice (con trámite) | **es-BO nativo** (`es-BO-SofiaNeural`, `es-BO-MarceloNeural`) y **es-AR rioplatense** | sí | [T] texttolab · [O] learn.microsoft.com (language-support) |
| MiniMax Speech 2.6 | HD US$100 / Turbo US$60 por millón de caracteres | 0,06-0,10 | sí | multilingüe | sí | [L] |
| Cartesia Sonic 3.x | Free (~27 min) · Pro US$4/mes (~133 min) · Startup US$39 · Scale US$239 | ~0,03-0,04 | sí (10 s de audio; PVC a 1,5 cr por carácter) | 44 idiomas, incluido español | sí (planes pagos) | [T] eesel / cloudtalk |
| Fish Audio | API **US$15 por millón de bytes UTF-8**; Plus US$15/mes | ~0,015-0,02 | desde 15 s de audio | español | sí por API; **los pesos abiertos NO** (licencia de investigación) | [O] docs.fish.audio vía buscador |
| Hume Octave | Creator US$14/mes (140k) · excedente US$0,15 por 1k; Pro US$70 (1M) | 0,05-0,15 | sí | — | sí | [T] |
| Mistral Voxtral mini TTS | US$16 por millón de caracteres | 0,016 | — | — | sí | [L] |

### 2.5 Voz de código abierto (costo = cómputo + horas; estrellas y licencias leídas hoy en GitHub)

| Modelo | ★ | Licencia (código / pesos) | Español | Clonación | ¿Corre sin GPU? | Veredicto para ONIA |
|---|---:|---|---|---|---|---|
| **Kokoro-82M** (hexgrad) | 9.000 | Apache-2.0 | sí (vía espeak), calidad justa | no | sí, CPU (ya integrado en `media-use`) | Sirve para audio interno (Jarvis); no vende |
| **MOSS-TTS-Nano** (OpenMOSS) | 4.404 | Apache-2.0 | sí (20 idiomas) | sí | sí: **CPU en tiempo real (ONNX)** | El único con clonación que corre en el hardware de ONIA: **probar antes de creerle** |
| **Chatterbox Multilingual V3** (Resemble) | 26.555 | MIT | sí (23+ idiomas) | zero-shot | lento en CPU (Nano y Turbo corren en CPU, pero solo en inglés) | Buena opción abierta si hay GPU |
| **VoxCPM2** (OpenBMB) | 37.973 | Apache-2.0, **pesos incluidos** ("commercial-ready") | sí (30 idiomas) | sí | GPU (RTF 0,3 en una 4090) | Buena opción abierta si hay GPU |
| **Qwen3-TTS** (Alibaba) | 13.540 | Apache-2.0 | sí | diseño de voz y clonación | CPU inviable: el repo midió **~30 s por cada 3 s de audio** en el VPS | Solo con GPU |
| OmniVoice (k2-fsa) | 13.862 | Apache-2.0 | 600+ idiomas | sí (toma el acento de la referencia) | GPU | Solo con GPU |
| VibeVoice (Microsoft) | 54.494 | MIT | voces ES experimentales (Realtime-0.5B) | — | — | Foco en EN/ZH |
| F5-TTS | 15.288 | código MIT, **pesos CC-BY-NC** | — | sí | — | No comercial |
| Higgs Audio v3 (Boson) | 8.361 | **licencia de investigación, no comercial** | 100+ idiomas | sí | — | No comercial sin licencia |
| Fish-Speech / OpenAudio | 32.842 | **Fish Audio Research License** | sí | sí | — | No comercial sin licencia |
| IndexTTS 2.5 | 24.184 | licencia bilibili (el uso comercial exige contacto) | sí | sí | — | Dudoso |

**Voz boliviana o rioplatense:** ningún modelo, abierto o de API, trae una voz boliviana lista para
clonar. Las opciones reales son **Azure es-BO** (nativa, voces fijas) o **clonar con consentimiento
a un hablante boliviano** (la clonación copia el acento de la referencia; por ejemplo, la voz del
propio Sergio Urcullo). La voz actual de Lucía, «Marcela», es **colombiana** (Voice Library de
ElevenLabs).

### 2.6 Lipsync y avatares

| Opción | Precio | Fuente |
|---|---|---|
| Higgsfield `sync_so` (suscripción) | 18,15 cr por ~5 s ≈ US$0,60-0,78 (≈0,12-0,16/s) | [R] `MODELOS_IA_QUE_USAR_PARA_QUE.md` §6 |
| **Sync lipsync-2-pro** (directo) | **US$0,067-0,083/s**; lipsync-2 ≈ 1/1,7 de eso; planes desde Hobbyist US$5/mes | [O] sync.so/pricing vía buscador |
| HeyGen API (pago por uso) | Photo Avatar IV/V **US$0,05/s (US$3/min)**; Digital Twin US$0,0667/s | [T] g2 / realtimeavatar |
| Hedra Character-3 API | US$0,025/s (540p) · 0,05 (720p) · 0,0625 (1080p) | [T] |
| OmniHuman 1.5 (ByteDance) | US$0,14-0,16/s (fal / BytePlus) | [O] fal vía buscador |
| Kling Avatar 2.0 (fal) | estándar US$0,0562/s · pro US$0,115/s | [O] fal vía buscador |

---

## 3. Qué sería «nuestro propio Higgsfield»

### 3.1 Qué es y qué no es

**Es una capa de orquestación:** una CLI o UI propia con **presets** (formato → modelo, parámetros,
plantilla de prompt, negativo, pack de identidad), **cola**, **topes de presupuesto**, **libro de
gastos** y **almacenamiento propio**, montada sobre una o varias APIs. **No entrena modelos.**

**Lo que Higgsfield tiene y NO se consigue conectando APIs** (según
`.claude/skills/higgsfield-generate/references/model-catalog.md` y los docs del repo):

- **Soul ID / Soul 2 / Soul Cinema / Soul Location / Soul Cast**: modelos y entrenamiento propios.
  Soul 2 **sí** está en su API; el entrenamiento de Soul ID por API **no está verificado**.
- **Elements**: el ancla `lucia-skin-v1` vive **solo en la web** (`cli_portable: false`).
- **Marketing Studio** (avatares, productos, hooks, brand kits; "la MEJOR consistencia" según la
  revisión de Sergio Urcullo del 09-jul). En la API figura **MS Image**; **MS Video no está
  verificado**.
- **Cinema Studio, Virality Predictor, Supercomputer, Canvas y las ventanas "unlimited"** del plan.

**Lo que sí es commodity** (Kling, Seedance, Veo, Nano Banana, GPT Image, Wan, MiniMax, Seedream,
FLUX, Recraft, Z-Image): Higgsfield lo **revende**, y eso es lo único que un "Higgsfield propio"
reemplaza.

### 3.2 Los «Open Higgsfield» de GitHub: qué hacen de verdad (leídos hoy)

| Repo | ★ | Licencia | De qué backend depende | Qué es realmente |
|---|---:|---|---|---|
| `wide-trace/open-higgsfield` | 3.735 (creado el 26-ago-2026) | **ninguna** (todos los derechos reservados: no se puede reutilizar) | **La propia API de Higgsfield** (clave `id:secret`, `HF_API_BASE_URL`; Soul 2, Soul Cinema, Seedance, Kling…) | Un compositor y galería en Next.js sobre la API paga de Higgsfield. **No reemplaza a Higgsfield: lo usa** |
| `Anil-matcha/Open-Generative-AI` (antes "Open-Higgsfield-AI") | 29.194 | MIT | **MuAPI** (nube); local solo en la app de escritorio vía sd.cpp (SD1.5/SDXL/Z-Image) o un servidor Wan2GP propio (exige GPU) | Puerta de entrada comercial a MuAPI ("White Label desde US$49/mes"); se vende "**sin filtros de contenido**" → riesgo de marca |
| `SegFault42/HeliosGen` | 2.293 | **ninguna** | **kie.ai** (enlace de afiliado) | App de escritorio tipo lienzo de nodos; solo hay build para macOS |
| `ClabstreamTeam/Open-Higgsfield-AI` | 166 | ninguna | — | Herramienta interna, "pausada hasta cargar créditos" |
| `BeatAPI/BeatDesign` | 94 | Apache-2.0 | BeatAPI | Lienzo y timeline local con MCP |
| `clawnify/OpenStudio` | 50 | MIT | OpenRouter (solo imagen) | Estudio de imagen |
| `opencanvasai/OpenCanvas` | 40 | MIT | BYOK | Lienzo de nodos |
| Oficiales: `higgsfield-ai/cli` 591★ MIT · `higgsfield-ai/skills` 1.135★ MIT · `higgsfield-ai/higgsfield-client` 118★ Apache-2.0 (SDK Python de la API) | | | | Lo que ONIA ya usa (CLI y skills) o podría usar (SDK de la API) |

**Conclusión:** "open Higgsfield" es **una UI**. Todos dependen de un backend pago, ninguno entrena y
ninguno trae identidad persistente. ONIA opera desde Claude Code y Codex por CLI: **una UI le aporta
poco**.

### 3.3 Boceto de arquitectura, si algún día se hace

Lo marcado "ya existe" está en el repo.

```
Pedido (Telegram/Hermes: ya existe · Claude Code/Codex: ya existe)
  → Brief = job de Video Lab (ya existe: lane · format · guion · referencias · approval_required)
  → PRESETS ← video-factory/formats + ONIA_PLANTILLAS_PROMPT_VIDEO + MODELOS_IA_QUE_USAR_PARA_QUE (ya existen)
  → ROUTER modelo→proveedor [falta] (1er proveedor: API de Higgsfield; 2º solo si hace falta: fal o Gemini/Veo;
                                     LiteLLM ya enruta /v1/videos para Veo y RunwayML)
  → COTIZACIÓN con tabla de precios versionada [falta]
  → GATE DE GASTO ← quote ligada a input/modelo/params/refs + aprobación de Sergio Urcullo (prototipo en el adapter)
                   + TOPES US$/día y US$/mes [falta] + saldo prepago como tope duro (fal no tiene tope nativo)
  → COLA + WORKER (JSONL/SQLite en el VPS, backoff, idempotencia por input_hash) [falta]
  → POLL / WEBHOOK → DESCARGA + SHA256 → ALMACENAMIENTO PROPIO [falta] (la API de HF guarda ≥ 7 días; las URLs de fal vencen)
  → QA HUMANO (rúbrica de identidad 11/11: ya existe) → LEDGER append-only [falta] → Video Lab
  → edición: editor-videos / HyperFrames (ya existen) → publicar SOLO con aprobación (ig-publish, ya existe)
```

**Identidad sin Soul ID:** paquete canónico de referencias por personaje más las funciones de
referencia de cada modelo (Seedance 2.x omni-reference hasta 9 imágenes, Nano Banana hasta 14
referencias, Kling 3.0 `@elements`), o un LoRA para los stills (US$1,50-2 por entrenamiento en fal)
y después imagen a video. **Deriva más que un Soul entrenado**: exige el A/B que el repo ya definió.

### 3.4 Horas estimadas (estimación propia, no medida; parte del esqueleto que ya existe)

| Componente | Horas |
|---|---:|
| Presets: portar lo vigente a un catálogo por proveedor | 6-10 |
| Adapter y runtime para 1 proveedor (submit / poll / cancel / download / errores) | 10-16 |
| Cotización + topes en US$ | 4-8 |
| Cola, worker y aviso directo a Telegram | 6-10 |
| Ledger, SHA256 y almacenamiento | 4-6 |
| Identidad: pack, A/B contra Soul/Element y quizás LoRA | 10-20 (+ US$20-50 de pruebas) |
| Tests de contrato y una prueba paga mínima | 4-8 |
| **Total CLI (MVP)** | **~44-78 h** |
| UI web tipo open-higgsfield (opcional, no recomendada) | +30-60 h |
| **Mantenimiento** (rotación de modelos: API de Sora apagada el 24-sep, Hailuo 2.3 pasó a legacy, Seedance 2.5 con modos nuevos, cambios de schema; incidentes; claves) | **2-6 h/mes** |

A **Bs 100/h** (la valuación de horas del §9 de la estrategia): construir cuesta **Bs 4.400-7.800** y
mantener **Bs 200-600/mes**. El costo real es otro: **esas horas salen de las horas de vender**
(§4 de la estrategia).

### 3.5 Costo por unidad contra la suscripción, al volumen REAL de ONIA

Tipo de cambio: **Bs 11,52 por US$** (`ONIA_AGENTES_COSTO_API.md:143`).

| Escenario de uso | Ultra (US$99-129 fijo) | Plus (US$39-49; 1.000 cr) | Pago por uso (API de HF o fal) | Costo efectivo de Ultra por crédito usado |
|---|---:|---:|---:|---:|
| **Septiembre** (~27 cr, pausa) | US$99-129 | US$39-49 | **≈ US$1-2** | US$3,7-4,8 por crédito |
| **Agosto** (~1.040 cr, pico con Lucía) | US$99-129 | US$39-49 (justo) | **≈ US$40-50** | US$0,095-0,124 (**~3×** el nominal) |
| Promedio de vida (~1.630 cr/mes, jun-ago) | US$99-129 | no alcanza (+ packs) | ≈ US$65-80 | US$0,061-0,079 |
| Uso completo (3.000 cr) | US$99-129 | — | ≈ US$120-150 | US$0,033-0,043 ← aquí Ultra gana |

Cómo sale "≈ US$40-50" para agosto: Seedance 2.0 ~32 s × US$0,23-0,30 · Marketing Studio ~50 s
(equivalente US$0,13-0,21/s) · Kling 3.0 ~72 s × US$0,084 · Wan ~20 s × ~US$0,10 · NB Pro ~55 ×
US$0,134 · NB2 ~20 × US$0,07-0,10 · GPT Image ~60 × US$0,041 · 1 LoRA ~US$2-5 · lipsync y upscale
~US$5. **El crédito equivalente vale ≈ US$0,04-0,05 a precio de API.**

### 3.6 Puntos de equilibrio

1. **Suscripción contra pago por uso** (sin construir nada):
   - Ultra anual (US$99) solo gana por encima de **~2.000-2.500 créditos por mes**.
   - Ultra mensual (US$129) solo gana si se usa **casi entero**.
   - Plus (US$39) empata en **~800-1.000 créditos**.
   - ONIA está en **30-1.040** → **Ultra está sobredimensionado**; lo que corresponde es Plus o
     Starter más la API.
2. **Construir contra no construir.** Lo único que agrega una capa propia sobre "usar la API de
   Higgsfield" es elegir el proveedor más barato por modelo: un ahorro de **~15-30 %** (por ejemplo
   Veo Lite directo de Google, o Kling según quién esté más barato ese mes).
   - Al volumen de ONIA (US$0-50/mes) eso es **≤ US$15/mes**, y **no cubre ni el mantenimiento**
     (Bs 200-600 ≈ US$17-52).
   - La construcción recién se paga con **≈ US$160-540/mes de generación sostenida**: mantenimiento
     más construcción amortizada en 12 meses (US$49-108/mes), dividido por un 20-30 % de ahorro.
     Eso es **entre 4 y 12 veces el pico de agosto**.
3. **Contra el negocio.** Ultra (US$99-129 ≈ **Bs 1.140-1.486/mes**) es **~37 % del gasto mensual**
   con el que la estrategia calcula el punto de equilibrio (Bs 1.365 de Bs 3.650: `FINANCE_LOG_2026.md`
   base de Bs 2.950,50 + Bs 700 de caja chica, `ONIA_ESTRATEGIA_DE_EMPRESA.md` §4). Como el
   equilibrio es `gasto ÷ precio del plan` (el precio se lee de `DEFAULT_PLAN_AMOUNTS`, no de este
   doc), ajustar el plan lo lleva **de ~5 a ~3-4 clientes**. **Es la palanca de Etapa 1 más barata de
   todo este tema.**

---

## 4. Riesgos

1. **Consistencia de identidad.** Hoy Lucía vive en **4 sistemas no portables** (Element web,
   referencias de la CLI, Souls, avatar de Marketing Studio;
   `handoff/HIGGSFIELD-LUCIA-SYSTEM-2026-09-22.md:40-46`). Salir de Higgsfield pierde **Soul ID y
   Elements**; sumar proveedores multiplica la fragmentación. Las alternativas (referencias
   múltiples, LoRA) derivan más y exigen A/B y rúbrica por proveedor.
   - **Seedance 2.x por canales oficiales rechaza rostros reales como referencia** desde feb-2026
     (tras el deepfake del 9-feb y la presión de Disney y la MPA; BytePlus pide verificación de
     identidad o autorización legal) [T mindstudio / aividpipeline]. **Para la cara de Sergio
     Urcullo, la vía que funcionaba era Soul ID o un still aprobado dentro de Higgsfield.**
   - Google Veo: SynthID en todos los frames y filtros contra "personas reales identificables sin
     consentimiento" [T/O ai.google.dev/gemini-api/docs/veo].
2. **Límites de uso.** Higgsfield ya frenó a ONIA con `grace_daily_limit_reached`, un cupo **diario
   y de la cuenta**, distinto del saldo (`TECNICA-HIGGSFIELD.md:1407`, `:1426`). En otros
   proveedores: concurrencia atada al saldo prepago (WaveSpeed exige recargar entre US$100 y
   US$10.000 para subirla [T]); **fal no tiene tope de gasto nativo** (solo prepago y alertas [T]);
   Kling oficial exige paquetes prepagos desde US$700; kie.ai y MuAPI cobran por debajo del precio
   oficial, **señal de reventa no oficial**: puede desaparecer.
3. **Términos de servicio.**
   - Higgsfield: los planes pagos dan uso comercial y el Free no; no reclama la propiedad de lo
     generado, pero **conserva licencia para mejorar sus modelos con lo que se genera** [O help
     center; T startupfortune]; **prohíbe scraping y descargas automatizadas de la web** (ya en el
     repo y en `CLAUDE.md`).
   - **ElevenLabs Free: sin licencia comercial y con atribución obligatoria.** Si hoy la cuenta está
     en Free, publicar voz de Lucía o de Sergio Urcullo **incumple los términos**.
   - Pesos abiertos "no comerciales": F5-TTS, Higgs Audio v3, Fish-Speech, IndexTTS.
   - Un output sintético **no da derecho automático** a entrenar otra identidad (ya en
     `LUCIA-HIGGSFIELD-IDENTITY.json`).
   - Los repos "open" sin licencia (open-higgsfield, HeliosGen) **no se pueden copiar**.
4. **Derechos de imagen, voz y consentimiento.**
   - **Código Civil de Bolivia, art. 16 "Derecho a la imagen":** permite pedir al juez que cese la
     comercialización o exhibición que lesione la reputación o el decoro, y **alcanza a la
     reproducción de la voz** [T paradaabogados / infoleyes / scielo.org.bo].
   - Lucía tiene el **gate de derechos sin resolver**: referencias derivadas de frames de una persona
     real sin consentimiento documentado. **Cambiar de proveedor no lo resuelve.**
   - Clonar voces exige consentimiento escrito (ya es regla del repo).
   - TikTok y Meta etiquetan el contenido de IA realista. Sigue vigente la regla de ONIA: el
     presentador de IA no se hace pasar por cliente ni por testimonio.
5. **Deriva de calidad y de catálogo.** Los modelos cambian cada mes: la **API de Sora se apagó el
   24-sep**, Hailuo 2.3 pasó a legacy, Wan 3.0 salió solo por API y Seedance 2.5 trajo modos nuevos.
   Cada cambio rompe presets y exige regresión con "prompts dorados": son las 2-6 h/mes del §3.4. El
   propio repo avisa que su mapa de Higgsfield "envejece rápido"
   (`HIGGSFIELD_FULL_CAPABILITIES_MAP.md:47`).
6. **Operación.** Disco del VPS (ya estuvo al 85 %), manejo de claves (hay precedente de una clave de
   ElevenLabs pegada en el chat, y el autosync commitea), turno de infra compartido (VPS y n8n tienen
   un dueño a la vez) y salidas que vencen si no se bajan.

---

## 5. Recomendación por modalidad

| Modalidad | Veredicto | Qué significa en concreto |
|---|---|---|
| **Video** | **Mantener Higgsfield, redimensionado** (híbrido liviano, sin construir) | Cerrar el tema del cobro. Bajar de **Ultra a Plus o Starter** según el uso esperado: la Etapa 1 casi no necesita video generado, porque el contenido es grabación real y la pauta exige UI real. Antes de bajar, **confirmar que se conservan Souls y Elements**. Para picos o jobs de agente, la **API de pago por uso de Higgsfield** (en US$, las fallas no se cobran; `CLAUDE.md` ya la prevé como "fábrica futura") antes que un proveedor nuevo. fal u otro solo si falta un modelo. **No construir la multiplataforma.** |
| **Imagen** | **Híbrido** | El default sigue siendo cero crédito: plantillas, fotos reales y packs tipográficos (`ONIA_ADDON_CONTENIDO.md`). Imágenes con cara: dentro de Higgsfield (Soul o NB con ancla). Imágenes sin cara: `z_image` (US$0,005) o, si algún día se da de alta, Z-Image, Qwen-Image o NB2 directo. El costo de imagen es ruido: **el ahorro está en el plan, no en la imagen.** |
| **Voz** | **Mantener ElevenLabs en Starter** y reemplazar solo lo interno | Confirmar el plan: si está en Free, **Starter (US$5-6/mes) es obligatorio para publicar voz**, por licencia. Por volumen, el contenido usa **1-3 min/mes**. **Jarvis (interno)** puede pasar a **Azure es-BO** (voces bolivianas, 0,5M caracteres gratis por mes) o a **Kokoro local**, y así libera créditos. La voz del add-on de chatbot es otro tema (ElevenLabs Flash cuesta Bs ~0,45/min contra ~US$0,015/min de OpenAI mini-tts o Azure es-BO): lo decide **el carril chatbot con una prueba en español boliviano**, no este doc. |

---

## 6. Test de las tres preguntas y regla de la Etapa 1

**a) Si «nuestro propio Higgsfield» se VENDE** (estudio de contenido IA para clientes, o marca
blanca estilo MuAPI a US$49/mes):

| Pregunta (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §10) | Respuesta | |
|---|---|---|
| ¿Se le vende al MISMO cliente que ya paga el núcleo? | A medias: una clínica podría querer contenido, pero la estrategia ya clasifica "Contenido / ads" como servicio de agencia | No / dudoso |
| ¿Deja de tener sentido sin el núcleo? | **No.** Un estudio de generación funciona solo: open-higgsfield y la marca blanca de MuAPI existen como productos sueltos | No |
| ¿Se entrega sin horas de Sergio Urcullo por cliente? | **No.** Brief, QA de identidad, consentimiento de cara y voz, aprobación por pieza. Y el costo crece con cada cliente y cada mes: "un negocio que empeora cuando funciona" (`ONIA_ADDON_CONTENIDO.md:87`) | No |

→ **Falla dos o tres de las tres: es un negocio nuevo disfrazado.** Sería la **décima línea**, con
una sola persona y cero clientes pagando: lo prohíben `CLAUDE.md` y la Etapa 1 ("congelar todo lo
que no sea Onia Platform + chatbot").

**b) Si es una HERRAMIENTA INTERNA** (para el contenido de ONIA): el test de add-on no aplica, pero
**el filtro de la etapa sí**. ¿Acerca los 5 clientes pagando? **No.** El cuello de botella es vender
(leads sin contestar, soporte), no el costo de generar. El contenido vigente no usa video generado,
Lucía está congelada (influencer IA = "otro producto entero", `ONIA_ESTRATEGIA_DE_EMPRESA.md:364`) y
el ahorro se consigue **sin** construir. **No se construye ahora: queda anotado con su disparador.**

**Disparadores para reabrirlo** (hacen falta todos):

1. Gasto de generación **≥ US$200/mes sostenido durante 2-3 meses**.
2. **Etapa 1 cerrada** (criterio de salida numérico en `ONIA_ESTRATEGIA_DE_EMPRESA.md` §7) o
   decisión explícita de Sergio Urcullo.
3. **Gate de derechos de Lucía resuelto.**
4. Higgsfield dejó de servir (reclamo sin resolver, cambio de términos, subida de precio o baja de
   la API).

---

## 7. Qué sesión se encarga y cuándo

| Qué | Quién | Cuándo |
|---|---|---|
| Cerrar el tema del cobro de Higgsfield (US$348 Pro anual; pago fallido del 01-sep) y **elegir plan** (Ultra → Plus o Starter, más la API para picos), confirmando que Souls y Elements sobreviven al cambio | **Sergio Urcullo**, en `higgsfield.ai/me/settings/subscription` y con su banco. **No necesita sesión técnica** | **Ahora.** Es gasto fijo que baja el punto de equilibrio de la Etapa 1 |
| Confirmar el plan de ElevenLabs (Free o Starter) y cuántos caracteres consume Jarvis | **Sergio Urcullo** (panel de ElevenLabs) | Ahora (5 min) |
| Registrar Higgsfield y ElevenLabs en `FINANCE_LOG_2026.md` y en Notion "Finanzas & Gastos" (hoy Higgsfield figura "falta el número" en `ONIA_AGENTES_COSTO_API.md:41`) | La sesión que lleve finanzas o fiscal, cuando Sergio Urcullo dé los números | Después de la decisión |
| **Esta sesión (CONTENIDO)** | **No lo toca.** A lo sumo anota una línea de pendiente en su handoff. Los guiones siguen sin depender de generación, con la regla vigente "Nada de Higgsfield" | — |
| Capa técnica (wrapper sobre la API de Higgsfield; router multiproveedor solo si hiciera falta) | **Carril Higgsfield/Lucía** (Codex), su **Fase 3** (`handoff/HIGGSFIELD-LUCIA-SYSTEM-2026-09-22.md:188-194`), en `video-factory/`, con turno de infra para el VPS y n8n | **Después de la Etapa 1** y con los disparadores del §6 cumplidos |
| TTS del add-on de voz de WhatsApp (costo por minuto) | **Carril chatbot** (`onia-chatbot`) | Cuando se programe la F0 de voz |
| Mover Jarvis a Azure es-BO o a Kokoro | Carril `infra-cerebro-loops` (Codex) | Baja prioridad; solo si ElevenLabs se queda corto |

---

## 8. Las palancas que dependen de Sergio Urcullo

Ninguna necesita construir nada; todas se hacen desde sus cuentas.

1. **Higgsfield — el cobro.** Mirar en `higgsfield.ai/me/settings/subscription` y en el banco si los
   US$348 del Pro anual se cobraron, y cerrar el reclamo (§1.2: las fuentes del repo no cierran entre
   sí). También queda pendiente el aviso de pago fallido del 01-sep.
2. **Higgsfield — el plan.** Pasar de **Ultra** a **Plus** o **Starter** (y la API de pago por uso
   para picos) según el uso esperado: 27 créditos en septiembre, ~1.040 en el mes pico. Antes de
   bajar, confirmar que **Souls y Elements** (el ancla de Lucía vive solo en la web) sobreviven al
   cambio. Efecto: el punto de equilibrio baja de **~5 a ~3-4 clientes** (§3.6).
3. **ElevenLabs — el plan y la licencia.** Confirmar en el panel si la cuenta está en **Free** o en
   **Starter**. En Free **no hay licencia comercial** (y se exige atribución): publicar voz de Lucía o
   de Sergio Urcullo incumpliría los términos. Starter cuesta US$5-6/mes [O]. De paso, mirar cuántos
   caracteres consume Jarvis (el script tiene un tope de 2.400 por día, no una medición).
4. **Registrar los dos gastos** para que la sesión de finanzas los cargue en `FINANCE_LOG_2026.md`
   (ElevenLabs no figura).

---

## 9. Lo que no se pudo verificar

- **Todas las páginas de precios de los proveedores** (el proxy las bloqueó): hay que mirarlas antes
  de cualquier compra.
- El **estado real** de la suscripción de Higgsfield y del plan de ElevenLabs: son cuentas de Sergio
  Urcullo.
- Si la API de Higgsfield permite **entrenar o usar Soul ID** y **Marketing Studio Video**.
- Tarifas de Replicate y Together.
- Si **LiteLLM aplica los presupuestos por clave** también a `/v1/videos`, y si enruta video de fal.
- El consumo real de caracteres de Jarvis.
- La calidad de cualquier TTS abierto en español boliviano: **nada está probado; se prueba con audio
  real antes de creerle**.
- `DEFAULT_PLAN_AMOUNTS`: el repo `onia-platform` no está en este checkout; el punto de equilibrio se
  expresó en proporción del gasto, sin precios.

---

## 10. Fuentes

**Repo** (leído el 2026-09-25):

- `hermes-content/docs/`: `HIGGSFIELD_VIDEO_SYSTEM.md` · `HIGGSFIELD_FULL_CAPABILITIES_MAP.md` ·
  `ELEVENLABS_AUDIO_SYSTEM.md` · `ONIA_OPEN_SOURCE_AI_VIDEO_LAB_2026.md` ·
  `ONIA_SELF_HOSTED_AI_TOOLS_2026.md` · `AI_MODEL_ROUTING_2026.md` · `FINANCE_LOG_2026.md` ·
  `ONIA_AGENTES_COSTO_API.md` · `ONIA_ESTRATEGIA_DE_EMPRESA.md` (§4, §7, §9, §10, §14) ·
  `ONIA_ADDON_CONTENIDO.md` · `ONIA_MARCA_PERSONAL_HIGGSFIELD_RECETAS.md` ·
  `ONIA_VOZ_WHATSAPP_ARQUITECTURA_20260802.md` · `PLAN_HOMELAB.md` ·
  `ONIA_SERVICIOS_POR_CASO_PRECIOS_20260801.md` · `ONIA_SYSTEM_TASKBOARD_2026.md` ·
  `ONIA_MODELOS_IA_FICHAS_20260801.md` · `ONIA_AUDITORIA_MARKETING_LUCIA_20260812.md`
- `hermes-content/docs/handoff/`: `HIGGSFIELD-LUCIA-SYSTEM-2026-09-22.md` · `infra-cerebro-loops.md` ·
  `onia-dev-node-setup.md` · `EDICION-MARCA-PERSONAL-2026-09-21.md`
- `hermes-content/docs/cola/`: `PLAN-VIDEOS-11-20-SEP.md` · `drops/2026-09-07.md`
- `hermes-content/references/modelos/lucia/`: `TECNICA-HIGGSFIELD.md` · `BITACORA-PERFECCION.md` ·
  `LUCIA-HIGGSFIELD-IDENTITY.json` · `LUCIA.md`
- `hermes-content/references/`: `VIDEO_MODEL_STACK_DECISION_2026.md` ·
  `models/lucia-voice/README.md` ·
  `sergio-approved-media/higgsfield-runs/20260604-black-avatar-test/credits-estimate.json`
- `web-factory/docs/MODELOS_IA_QUE_USAR_PARA_QUE.md` · `video-factory/FACTORY.md` ·
  `.claude/skills/higgsfield-generate/references/model-catalog.md` ·
  `.claude/skills/media-use/audio/scripts/lib/tts.mjs` · `scripts/loops/extras/jarvis-voz.sh` ·
  `supabase/migrations/20260724_onia_center_provider_credits.sql` ·
  `.claude/agents/_retirados/onia-integrations.md` ·
  `hermes-content/deploy/vps-ops/n8n-backup-20260820/p73krZtQA0IYzaKZ.json`

**Web** (todas consultadas el **2026-09-25**; las [O] son resúmenes del buscador sobre la página
oficial, que no se pudo abrir):

- Higgsfield: https://higgsfield.ai/creator-hub/help-center/plans/how-do-higgsfield-plans-work · https://higgsfield.ai/pricing · https://open.higgsfield.ai/pricing · https://higgsfield.ai/blog/higgsfield-api · https://higgsfield.ai/creator-hub/help-center/account/who-owns-my-generations-and-can-i-use-them-commercially · https://higgsfield.ai/terms-of-use-agreement · https://github.com/jondmarien/ai-ugc-pipeline/issues/33 · https://daily.dev/posts/higgsfield-s-new-api-undercuts-its-own-220-month-subscription-gzlqvxcmb
- ElevenLabs: https://elevenlabs.io/pricing · https://elevenlabs.io/pricing/api · https://elevenlabs.io/blog/weve-lowered-api-agents-pricing-and-introduced-pay-as-you-go · https://oakgen.ai/blog/elevenlabs-free-commercial-use
- Catálogo LiteLLM (precios de video, imagen y TTS): https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json · https://docs.litellm.ai/docs/providers/gemini/videos
- Kling: https://fal.ai/models/fal-ai/kling-video/v3/pro/image-to-video · https://fal.ai/models/fal-ai/kling-video/v3/standard/text-to-video · https://www.cloudzero.com/blog/kling-ai-pricing/
- Seedance: https://apiframe.ai/blog/seedance-2.0-api-providers · https://aividpipeline.com/blog/seedance-real-human-face-rules-2026
- Veo: https://costgoat.com/pricing/google-veo · https://ai.google.dev/gemini-api/docs/veo
- Sora (API apagada el 24-sep): https://costgoat.com/pricing/sora · https://leaxor.com/blog/sora-api-shutdown-2026
- Otros de video: https://docs.dev.runwayml.com/guides/pricing/ · https://www.eesel.ai/blog/luma-ai-pricing · https://platform.minimax.io/docs/guides/pricing-video · https://openrouter.ai/docs/guides/overview/multimodal/video-generation · https://www.atlascloud.ai/blog/tips/is-wan-3.0-open-source · https://github.com/Wan-Video/Wan2.2 · https://kie.ai/v3-api-pricing · https://muapi.ai/docs/pricing · https://wavespeed.ai/pricing · https://runware.ai/pricing
- Imagen: https://www.pixmind.io/posts/nano-banana-pro-pricing-guide-2026 · https://openrouter.ai/google/gemini-3.1-flash-image · https://www.aifreeapi.com/en/posts/openai-image-generation-api-pricing · https://www.atlascloud.ai/blog/ai-updates/seedream-5-0-pro-price · https://www.therundown.ai/tools/qwen-image-2-0 · https://docs.bfl.ml/quick_start/pricing · https://fal.ai/models/fal-ai/z-image/turbo · https://fal.ai/models/fal-ai/flux-lora-fast-training
- Voz: https://azure.microsoft.com/en-us/pricing/details/speech/ · https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support · https://cloud.google.com/text-to-speech · https://costgoat.com/pricing/openai-tts · https://www.cartesia.ai/pricing · https://docs.fish.audio/developer-guide/models-pricing/pricing-and-rate-limits · https://autogpt.net/hume-ai-pricing-every-plan-explained/
- Lipsync y avatares: https://sync.so/pricing · https://www.g2.com/articles/heygen-api-pricing · https://magichour.ai/blog/guide-to-hedra-ai · https://fal.ai/models/fal-ai/bytedance/omnihuman/v1.5 · https://fal.ai/models/fal-ai/kling-video/ai-avatar/v2/standard
- GPU: https://www.runpod.io/pricing
- Derecho boliviano: https://paradaabogados.com/codigo-civil-bolivia/art-16-derecho-a-la-imagen/ · http://www.scielo.org.bo/scielo.php?script=sci_arttext&pid=S2070-81572013000100003
- GitHub (estrellas y licencias leídas el 25-sep): `wide-trace/open-higgsfield` · `Anil-matcha/Open-Generative-AI` · `SegFault42/HeliosGen` · `ClabstreamTeam/Open-Higgsfield-AI` · `BeatAPI/BeatDesign` · `clawnify/OpenStudio` · `opencanvasai/OpenCanvas` · `higgsfield-ai/cli` · `higgsfield-ai/skills` · `higgsfield-ai/higgsfield-client` · `resemble-ai/chatterbox` · `hexgrad/kokoro` · `OpenMOSS/MOSS-TTS-Nano` · `OpenBMB/VoxCPM` · `QwenLM/Qwen3-TTS` · `k2-fsa/OmniVoice` · `microsoft/VibeVoice` · `SWivid/F5-TTS` · `boson-ai/higgs-audio` · `fishaudio/fish-speech` · `index-tts/index-tts`
