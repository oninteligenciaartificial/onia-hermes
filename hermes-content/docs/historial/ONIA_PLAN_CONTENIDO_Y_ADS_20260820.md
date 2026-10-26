# ONIA — Plan de contenido y ads · 2026-08-20 → 15-sep

> Síntesis de 3 auditorías verificadas (stack interno · Meta Ads en vivo · corpus + tendencias web).
> Cada afirmación lleva su fuente exacta. Lo que un verificador adversarial tumbó NO está acá;
> lo no verificable está marcado. Rutas relativas a la raíz del repo salvo indicación.
> Estado en vivo (Postiz, n8n, API de Meta) verificado 2026-08-18/20; no re-verificar antes del plan.

## 0 · La respuesta en 3 frases

1. **La fábrica está lista y la cadena no existe:** el sistema produce carruseles a costo cero con motor probado (7 piezas reales publicadas/programadas), pero ninguna pieza cruza sola de brief a post — el tramo del medio es una persona corriendo dos scripts, y la cola de `@oniahq` muere el 02-sep (`hermes-content/docs/ONIA_RECORRIDO_24_7_20260820.md` §1, §5.2).
2. **La pauta está a 1 tarjeta + 2 anuncios de encenderse:** la campaña existe PAUSED con techo USD 35 pero está VACÍA (0 anuncios, hallazgo nuevo por API en vivo), y el único bloqueo duro es el método de pago (`has_payment_method: false`, API en vivo 20-ago).
3. **Lucía arranca esta semana sin gastar un crédito:** sus 6 imágenes con captions ya están en disco (`hermes-content/references/modelos/lucia/posts-20260807/`, verificado 20-ago) — lo que falta son 3 decisiones de Sergio y 2 captions reescritos, no técnica ni plata.

---

## 1 · Estado del stack — capacidades y huecos

### Capacidades listas HOY

| Capacidad | Estado | Fuente |
|---|---|---|
| **Carruseles por código, 0 créditos**: motor brief JSON → PNG (4 packs, 3 formatos, recibo itemizado) + generador de copy + pipeline completo | 7 piezas producidas y programadas; 13 briefs + 18 tandas en disco | `scripts/carousel_render.js` · `scripts/carousel_generator.py` · `scripts/carousel_pipeline.js` · `hermes-content/carousels/CAROUSEL_SYSTEM.md` · `web-factory/docs/CAROUSEL_PATTERN_BANK_2026.md` §9.5 |
| **Programación a Postiz por script** con comentario automático de hashtags y detección de falso-200 | publicación real 18-ago | `scripts/postiz_schedule.mjs` · `hermes-content/contenido/ONIAHQ.md` §4 |
| **Publicar + responder corren solos 24/7**: Postiz publica, n8n hace comentario→DM con SISTEMA (→ Cal) y LISTA (→ PDF) | probado en vivo 18-ago | `hermes-content/docs/ONIA_RECORRIDO_24_7_20260820.md` §0-§2 · `hermes-content/contenido/README.md` |
| **Video generativo medido al crédito**: tabla con-cara vs sin-cara (13× de diferencia), español con guion literal (`kling3_0_turbo`), rúbrica de 9 criterios, plantillas CINE/UGC listas para aprobar | Fases A y B corridas (40,54 cr de 300) | `web-factory/docs/MODELOS_IA_QUE_USAR_PARA_QUE.md` §1-2, §6 · `web-factory/docs/LUCIA_BANCO_DE_PRUEBAS_2026.md` §2, §11 · `hermes-content/docs/ONIA_PLANTILLAS_PROMPT_VIDEO_20260818.md` |
| **Edición de video gratis y local**: pipeline de 14 pasos, 19 scripts en disco, 2 reglas de oro codificadas (preview a Sergio antes de cortar; gate ortográfico antes de quemar texto) | scripts verificados en disco | `.claude/skills/editor-videos/SKILL.md` |
| **Split-screen antes/después en un plano**, cero créditos | render de prueba en disco | `.hermes/video-lab/split-screen-onia/LEEME.md` |
| **Pauta preparada en papel**: 4 ángulos + campaña 1 escrita para copiar/pegar | — | `web-factory/docs/ADS_PATTERN_BANK_2026.md` §3, §6 |
| **Identidad de Lucía completa**: ancla, paleta, checklist pre-publicación, tarifario | — | `web-factory/docs/LUCIA_PATTERN_BANK_2026.md` §4, §6 |

### Huecos, rankeados

| # | Hueco | Detalle | Fuente |
|---|---|---|---|
| **H1** | **El tramo de producción es una persona** — EL hueco; los demás son subordinados | El agente n8n redacta solo texto a `review_queue`; entre borrador aprobado y post en cola hay un render + una llamada API manuales. Las dos puntas ya existen probadas — falta SOLO el puente. Consecuencia: la cola se apaga sola el 02-sep | `hermes-content/docs/ONIA_RECORRIDO_24_7_20260820.md` §1, §4.2 ítem 1, §5.2 |
| **H2** | **Semana 4 de `@oniahq` casi toda de venta** | Renderizado sin programar: 3 piezas `ui-patterns` — las tres piden SISTEMA. Programarlas seguidas rompe la regla 1-de-4. Faltan 2-3 informativos nuevos (el motor los hace a costo cero) | `hermes-content/contenido/ONIAHQ.md` §3-§4 |
| **H3** | **Lucía: 0 piezas publicadas, bloqueo NO técnico** | 6 imágenes listas en disco. Falta: (1) decisión de Sergio sobre el origen de los videos de su cara; (2) OAuth de la cuenta en Postiz; (3) confirmar handle `@lucia.antelo.oficial` (hardcodeado en `scripts/carousel_render.js`, nadie lo confirmó); (4) reescribir 2 captions (P4→MODELO, P5→CLIENTES), costo cero; (5) decidir % del pilar informativo. Ojo: `LUCIA.md` §1 dice "la cuenta no existe" — DESACTUALIZADO, la cuenta existe y está conectada a Postiz (verificado en vivo 18-ago) | `hermes-content/contenido/LUCIA.md` §4, §6 · `hermes-content/docs/ONIA_RECORRIDO_24_7_20260820.md` §6 · `web-factory/docs/LUCIA_PATTERN_BANK_2026.md` §10 |
| **H4** | **Video de `@oniahq`: prompt CINE listo, nada generado** | "El costo invisible", 10 s sin caras, prototipo ~10 cr en 480p, escrito palabra por palabra para aprobar. Formato exacto para el hueco post-02-sep | `hermes-content/docs/ONIA_PLANTILLAS_PROMPT_VIDEO_20260818.md` Plantilla A |
| **H5** | **El ejemplo "Onia Comercio" lleva datos fabricados marcados adentro** | El propio doc lo confiesa (cita fabricada del incidente 18-ago). Ese prompt NO se corre tal cual | `hermes-content/docs/ONIA_PLANTILLAS_PROMPT_VIDEO_20260818.md`, ejemplo Comercio |
| **H6** | **Consistencia de cara generada: sin resolver** | De 17 ítems analizados, ninguno la resuelve generando. Soul+texto sigue siendo el único método para Lucía | `hermes-content/docs/ONIA_PLANTILLAS_PROMPT_VIDEO_20260818.md` sección final · `web-factory/docs/LUCIA_PATTERN_BANK_2026.md` |
| **H7** | **Multi-cuenta en el render** (producir para Lucía es caso especial: `--account lucia` + handle sin confirmar) | ítem #7 de desarrollo del mapa 24/7 | `hermes-content/docs/ONIA_RECORRIDO_24_7_20260820.md` §4.2 |

**Contexto que encuadra todo:** el mejor motor del mundo hoy publica a ~22-23 seguidores con la pauta apagada (`hermes-content/docs/ONIA_RECORRIDO_24_7_20260820.md` §5.1). Cerrar H1-H4 sin el método de pago mejora la fábrica, no el alcance.

**Discrepancias entre docs detectadas (arreglar la fuente, no trabajar encima):**
- `CAROUSEL_PATTERN_BANK_2026.md` §9.10 nombra el pack `dark-neon`; `hermes-content/carousels/CAROUSEL_SYSTEM.md` no lo lista. Aclarar antes de arreglar los 3 packs sin botón CTA.
- El README de contenido linkea el PDF de LISTA a `contenido/recursos/` (no existe); el recurso real está en `hermes-content/recursos/lista-por-donde-empezar.pdf`.
- `LUCIA.md` §1 y §7 desactualizados (la cuenta existe; el PDF de LISTA ya está resuelto).

---

## 2 · Qué funciona — patrones con evidencia

Corpus: ~57 piezas analizadas vía 3 síntesis + índice (`hermes-content/references/video-intake/SINTESIS_CORPUS.md`, `2026-08-18-sintesis-lote-17.md`, `2026-08-18-ugc-auto-receta-completa.md`, `INDEX.md`). Web: solo se citan acá las fuentes FETCHEADAS y confirmadas (Buffer 24-mar-2026, Hootsuite 1-jun-2026, inBeat parcial); el resto de URLs del informe original quedan fuera o marcadas.

| # | Patrón | Evidencia | Aplica a |
|---|---|---|---|
| P1 | **Comentario → palabra clave → DM** — el más sólido. Lámina final DEBE enumerar qué contiene el recurso; PROHIBIDO pedir la palabra sin recurso real detrás | [CORPUS] 20 de 40 piezas + 12 de 17 del lote IG (`SINTESIS_CORPUS.md` §2.1 · `2026-08-18-sintesis-lote-17.md` §5.1). [WEB] feature #1 de automatización IG 2026 (fuentes vendor, no fetcheadas — dirección, no cifra). **Ya VIVO en n8n** (SISTEMA/LISTA): no construir, alimentar | ambas cuentas |
| P2 | **Sin cara, sin voz, solo pantalla — el portafolio silencioso** | [CORPUS] 11 de 40 piezas; hallazgo #1 del corpus: 4 fichas convergentes, encolado 4 veces, nunca producido; única palanca que mueve el precio 790/1.500 → 2.000/4.500 (`SINTESIS_CORPUS.md` §2.4, §4) | `@oniahq` |
| P3 | **Carrusel educativo enumerado** (chip 0X/06, overlay sincronizado) | [CORPUS] plantilla parametrizable extraída (`2026-08-18-sintesis-lote-17.md` §3). [WEB] Buffer (fetcheado): análisis de 4M posts — carruseles ganan en engagement a foto única y video (`buffer.com/resources/instagram-algorithms/`) | `@oniahq` (valida los 6 en cola) |
| P4 | **Comparación en un solo cuadro** — ganador grande y arriba, perdedor achicado y hundido; montaje puro, 0 créditos | [CORPUS] 5 ítems del lote 17 (`2026-08-18-sintesis-lote-17.md` §5.9) | `@oniahq` |
| P5 | **UGC imperfecto a propósito** — pedirle fealdad al modelo (grain, wobble, sin filtros) | [CORPUS] mecanismo 2 de la receta verificada con diálogo palabra por palabra (`2026-08-18-ugc-auto-receta-completa.md` §1). [WEB] dirección coincide con Hootsuite (autenticidad + hook 3 s); la cifra "31% más engagement" es de un solo vendor NO fetcheado — no usar | Lucía |
| P6 | **El humano real como ancla; la IA solo toca el objeto** (T1 `video_edit` / T2 keyframes) — elimina de raíz el problema de sostener una cara: no generándola | [CORPUS] hallazgo comercial del lote 17 (`2026-08-18-sintesis-lote-17.md` §5.7). [WEB] SOLO la parte cualitativa sobrevivió verificación: estrategia híbrida IA-para-volumen + real-para-escalar (inBeat, fetcheado). ⚠️ Las cifras "hook rate 30-50%" y "ROAS 2.1-2.8x en cohortes de 90 días" CAYERON en verificación (no están en las fuentes citadas; una fuente dice lo OPUESTO) — no existen para nosotros | `@oniahq` (molde B2B) |
| P7 | **Resultado primero + un paso por plano + karaoke** — con gate ortográfico antes de quemar | [CORPUS] 3 reels con el mismo esqueleto (`2026-08-18-sintesis-lote-17.md` §5.10, §5.8). [WEB] Hootsuite (fetcheado): watch time y completion = señales más fuertes de TikTok 2026, hook en 3 s (`blog.hootsuite.com/tiktok-algorithm/`) | ambas |
| P8 | **Declarar el motor / etiquetar la IA** | [CORPUS] correlación medida: los 5 que declaran = los confiables; los 6 que esconden = cebo (`2026-08-18-sintesis-lote-17.md` §5.4). [WEB] etiquetado obligatorio Meta/TikTok (fuentes secundarias, no fetcheadas — el mandato es dirección conocida). "Lucía es IA y no se esconde" queda alineado con compliance | Lucía |
| P9 | **Optimizar para shares y saves, no likes** | [WEB] Buffer (fetcheado): DM shares mandan en distribución de reels; IG de-rankea reposteado con watermark. El matiz "cita de Mosseri" no se pudo confirmar en esa sección — la afirmación queda sin atribuírsela a él | ambas |
| P10 | **Cifras sin fuente = humo (anti-patrón)** — donde ellos ponen cifras dibujadas, nosotros capturas reales | [CORPUS] 8 fichas desmintiendo cifras + 5 ítems del lote sin fuente (`SINTESIS_CORPUS.md` §2.2 · `2026-08-18-sintesis-lote-17.md` §5.5). Esta regla también rige ESTE doc: por eso P5/P6 perdieron sus cifras | ambas + producción propia |

**Anti-patrón confirmado para `@oniahq`:** glosarios/listas genéricas — el corpus las midió con audiencia equivocada ("aspirante a freelancer vs dueño de negocio formal boliviano", `hermes-content/references/video-intake/SINTESIS_CORPUS.md` §5-§6). Nada que le sirva igual a un estudiante.

---

## 3 · Meta Ads — de 0 a la primera pauta

Estado consultado EN VIVO por API el 20-ago (solo lecturas, 8 llamadas reproducidas por el verificador):

| Activo | Estado |
|---|---|
| Cuenta ONIA Ads `1073680778314945` | ✅ ACTIVE, USD, business OniaAgency, mínimo diario $1 |
| Método de pago | ❌ `has_payment_method: false` en las dos cuentas — **el único bloqueo duro** |
| Página vinculada a la cuenta de ads | ❌ vacío — PERO la página "Onia" `1140384625819526` aparece a nivel usuario con permiso CREATE_ADS |
| Pixel `1012611478191231` | ⚠️ `is_active: true` pero nunca disparó (epoch 0) |
| Campaña 1 `120253773124020022` | ✅ PAUSED, OUTCOME_TRAFFIC, lifetime USD 35, stop 2026-09-05 |
| Ad set `120253773125540022` | ✅ PAUSED, LINK_CLICKS, Bolivia país ENTERO — falta acotar a SCZ+25km |
| **Anuncios** | 🔴 **CERO — hallazgo nuevo: la campaña está VACÍA.** Encenderla tal cual no gasta ni muestra nada |
| Verificación de negocio | Último estado escrito: "Sin verificar", envío bloqueado por el footer legal de onia.com.bo (`hermes-content/docs/ONIA_META_CIERRE_VERIFICACION_20260726.md` §0). No re-verificado si el footer ya se publicó |

Las creatividades existen físicamente: `hermes-content/carousels/out/ads/ad-a2-v1-no-volvieron/slide-01.png`, `ad-a2-v2-cuaderno/slide-01.png`, `ad-a3-silla-vacia/slide-01.png` + briefs en `hermes-content/carousels/briefs/ads/`.

### Checklist ordenado

**Solo Sergio/Leslie (panel + tarjeta):**
1. **Cargar método de pago** en `1073680778314945` — el único bloqueo duro. Tarjeta = acto de Leslie/Sergio, nunca de un agente (palanca #2 del plan 24/7, `hermes-content/docs/ONIA_RECORRIDO_24_7_20260820.md`).
2. **Vincular la página Onia** `1140384625819526` a la cuenta de ads en el BM (~5 min, gratis). Quizá evitable por API con CREATE_ADS (hipótesis NO probada); hacerlo elimina la duda.
3. **Acotar geo a Santa Cruz de la Sierra + 25 km** — el MCP no expone búsqueda geográfica (`hermes-content/docs/ONIA_ADS_CAMPANA_1_LISTA_20260813.md`): son 2 clics en Ads Manager.
4. **Migrar el token USER a System User** — ⚠️ vence **2026-09-05**; sin migrar, el motor de ads por API muere (`ONIA_ADS_CAMPANA_1_LISTA_20260813.md` fila 6).
5. (Paralelo, NO bloquea la pauta — *inferencia nuestra, no frase de ningún doc*: lo más cercano escrito es que la verificación solo acelera el límite diario de gasto, `hermes-content/docs/ONIA_META_VERIFICACION_CHECKLIST_20260725.md`) **Verificación de negocio**: publicar el footer legal y enviar. Desbloquea WhatsApp 2→20 números.

**Por API / código (agente), apenas 1-2 estén:**
- **Crear los 2 anuncios** en el ad set: A2-v1 + A2-v2, `object_story_spec` con la página, destinos `onia.com.bo/?src=ads-a2-v1` / `-v2`. Copy exacto ya aprobado en `ONIA_ADS_CAMPANA_1_LISTA_20260813.md`. Sin `?src=` no se lanza (`web-factory/docs/ADS_PATTERN_BANK_2026.md` §6).
- **Ajustar `stop_time`** a activación+7 días si se enciende después del ~29-ago, y **activar** (write, con OK explícito de Sergio).
- **Instalar el pixel** en onia.com.bo (carril web-factory, código no trámite). NO bloquea la campaña 1; sin él nunca se sube a conversiones.

### Presupuesto

**USD 5/día × 7 días ≈ USD 35 lifetime** — ya cargado, y es lo que ambos docs fijan (`ONIA_ADS_CAMPANA_1_LISTA_20260813.md` · `ADS_PATTERN_BANK_2026.md` §6). El mínimo técnico es $1/día pero no junta señal. **Regla de corte escrita:** si en 7 días el clic no trae ni una reunión atribuida con `?src=ads-*`, se apaga y se cambia el ángulo — no se sube presupuesto "para darle tiempo".

**Piezas:** A2-v1 + A2-v2 (par A/B del mismo ángulo "el paciente que no volvió" — ~5 competidores en el nicho dental LatAm vs 367 del genérico IA, `ADS_PATTERN_BANK_2026.md` §1). A3 queda para la rotación siguiente: con $5/día no hay volumen para 3.

### Riesgos

| Riesgo | Mitigación |
|---|---|
| Cuenta virgen: 0 gastado, límites iniciales bajos y review estricta (límite exacto no verificable — Meta no lo publica) | Arrancar a $5/día construye historial sin disparar reviews |
| Token USER vence 2026-09-05 | Migrar a System User ANTES (ítem 4 de Sergio) |
| `stop_time` fijo al 05-sep: tarjeta tarde = pacing acelerado | Ajustar `stop_time` al activar |
| Pixel jamás disparó → cuenta condenada a tráfico | Instalar en semana 2-3 (no bloquea) |
| Geo a país entero → los $35 se riegan por toda Bolivia | Acotar ANTES de activar (gate) |

---

## 4 · EL PLAN — semana a semana hasta el 15-sep

Principio: lo "del sistema" corre en paralelo y no espera a Sergio; lo "de Sergio" son clics, tarjeta y decisiones que nadie más puede hacer. Cada semana cierra con lo suyo en `main` (o en prod si aplica).

### Semana 1 · 20-24 ago — destrabar Lucía y armar la pauta

**De Sergio (≈30 min + 3 decisiones):**
- [ ] Tarjeta en la cuenta ONIA Ads `1073680778314945` (checklist §3 ítem 1).
- [ ] Vincular página Onia a la cuenta de ads + acotar geo a SCZ+25km (ítems 2-3; ~7 min total).
- [ ] **Decisión Lucía #1:** origen de los videos de los que salió su cara (`hermes-content/contenido/LUCIA.md` §6) — sin esto no se publica su primera pieza.
- [ ] **Decisión Lucía #2:** confirmar el handle `@lucia.antelo.oficial` (hardcodeado en `scripts/carousel_render.js`).
- [ ] **Decisión Lucía #3:** % del pilar informativo genérico de su feed.
- [ ] OAuth de la cuenta de Lucía en Postiz (clic #1 del mapa 24/7, `hermes-content/docs/ONIA_RECORRIDO_24_7_20260820.md` §6).

**Del sistema:**
- [ ] Reescribir los 2 captions de Lucía (P4 → MODELO, P5 → CLIENTES; `LUCIA.md` §6 ítem 4). Costo cero. Con esto las 6 piezas de `posts-20260807/` quedan publicables y el arranque depende SOLO de Sergio.
- [ ] Actualizar `LUCIA.md` §1 y §7 (desactualizados) y el link del PDF en el README de contenido.
- [ ] Producir 2-3 carruseles informativos nuevos con el motor (0 créditos) para intercalar la semana 4 sin romper 1-de-4 (H2). Gate de copy de `hermes-content/carousels/CAROUSEL_SYSTEM.md`.
- [ ] **Puente render→programar v1: UN script** que toma un brief aprobado de `review_queue`, corre `scripts/carousel_render.js` y llama `scripts/postiz_schedule.mjs`. Es el esqueleto del cron que el mapa marca como "esto es el 24/7" (`ONIA_RECORRIDO_24_7_20260820.md` §4.2 ítem 1). Riesgo bajo: las dos puntas ya están probadas en producción.
- [ ] Apenas la página esté vinculada: crear los 2 anuncios (A2-v1, A2-v2) por API, PAUSED, con `?src=`.

### Semana 2 · 25-31 ago — encender la pauta y sembrar Lucía

**De Sergio:**
- [ ] **OK explícito de activación** de la campaña (con geo acotado verificado — gate duro).
- [ ] Migrar token a System User (deadline real: antes del 05-sep).
- [ ] OK de gasto para el prototipo CINE de `@oniahq` (~10 cr en 480p, H4) — opcional pero recomendado: es el formato para después del 02-sep.

**Del sistema:**
- [ ] Ajustar `stop_time` a activación+7 días y activar. Desde ese día: leer atribución `?src=ads-*` en el panel (que ya la cuenta — Meta no necesita el pixel para que NOSOTROS midamos).
- [ ] Programar la **semana 4 de `@oniahq`**: intercalar las 3 `ui-patterns` (venta) con los 2-3 informativos nuevos, respetando 1-de-4 (`hermes-content/contenido/ONIAHQ.md` §3). La cola queda cubierta más allá del 02-sep.
- [ ] **Primera pieza de Lucía publicada** (si las 3 decisiones + OAuth llegaron): arrancar con P1 y escalonar las 6 en 2 semanas — siembra, no ráfaga. Con 0 seguidores, el arranque en frío es lento (P9); cada caption cierra con palabra clave SOLO si hay recurso detrás (P1).
- [ ] Producir el **reel mudo antes/después** (portafolio silencioso, P2): 0 créditos, hallazgo #1 del corpus, jerarquía visual de §5.9 del lote 17. Herramienta: split-screen propio (`.hermes/video-lab/split-screen-onia/LEEME.md`) o editor local.

### Semana 3 · 01-07 sep — la semana de los deadlines

Tres relojes suenan esta semana: la cola vieja muere el **02-sep** (ya cubierta en semana 2), el token USER vence el **05-sep** (migrado en semana 2 o el motor muere), la campaña cierra su ventana el **05-sep** (o activación+7).

**De Sergio:**
- [ ] Leer el veredicto de la pauta con el sistema: ¿hubo reunión atribuida `?src=ads-*`? Decidir: rotar a A3 / escalar / apagar y cambiar ángulo. La regla de corte ya está escrita — no se negocia en caliente.
- [ ] Si dio OK al CINE: aprobar el prototipo 480p antes de la versión final.

**Del sistema:**
- [ ] **Puente v2 = cron**: el script de semana 1 pasa a correr solo (borrador aprobado → render → cola Postiz sin humano). Con esto el 24/7 queda cerrado de punta a punta (H1 muerto).
- [ ] Carrusel-auditoría "N señales de que tu web pierde clientes" con capturas reales (P3 + P10) — con el cuidado escrito en el corpus: no usarla mientras nuestras propias landings la fallen (`SINTESIS_CORPUS.md` §4.3º).
- [ ] Instalar el pixel en onia.com.bo (carril web-factory).
- [ ] Lucía: continúa la siembra escalonada (piezas 3-4 de 6).

### Semana 4 · 08-15 sep — operar con datos

**De Sergio:**
- [ ] Decisión de rotación de pauta según semana 3 (A3 entra o cambia el ángulo).
- [ ] Si la fábrica 24/7 corre sola: definir el siguiente lote de briefs (el agente redactor ya alimenta `review_queue`; Sergio solo aprueba).

**Del sistema:**
- [ ] `@oniahq`: siguiente tanda por el cron (ya sin manos). Sumar el video CINE si fue aprobado.
- [ ] Lucía: piezas 5-6 de 6 + serie "así me hacen" (screen-capture del propio pipeline, barato, P8: declarar el motor está correlacionado con confianza en el corpus).
- [ ] Cerrar deudas del motor: los packs sin botón CTA — PREVIO: resolver la discrepancia `dark-neon` entre `CAROUSEL_PATTERN_BANK_2026.md` §9.10 y `CAROUSEL_SYSTEM.md` (arreglar el doc, después el pack).
- [ ] Retro escrita del mes: qué patrón trajo DMs reales (SISTEMA/LISTA cuentan solas en n8n), qué se mata.

---

## 5 · Qué NO hacemos (y por qué — para que ninguna sesión futura lo reabra)

1. **NO boostear el post de `@oniahq`.** El post publicado es presentación de marca, no ángulo de dolor; el boost optimiza a engagement (likes, no dueños de clínica); la campaña tiene techo duro lifetime que un boost no tiene; y la regla escrita dice "se paga el post que ya trajo reuniones" (`web-factory/docs/ADS_PATTERN_BANK_2026.md` §4) — ese dato hoy no existe. Si un carrusel orgánico trae un lead con `?src=`, ESE se convierte en el próximo ad.
2. **NO glosarios ni listas genéricas en `@oniahq`.** El corpus las midió: 0 tareas, audiencia equivocada (`hermes-content/references/video-intake/SINTESIS_CORPUS.md` §5-§6). Falla la prueba del vendedor.
3. **NO pedir palabra clave sin recurso real escrito detrás.** Caso degenerado documentado en el corpus (§2.1). Cada cebo nuevo exige su recurso ANTES de programarse.
4. **NO citar cifras sin fuente en piezas propias — ni en docs propios.** Regla P10. Aplicada a este mismo plan: las cifras "hook rate 30-50%", "ROAS 2.1-2.8x", "31% más engagement raw" y "5,67% vs 1,89%" del research web NO existen para nosotros (dos cayeron en verificación adversarial — una fuente decía lo opuesto — y dos son de vendor único no fetcheado).
5. **NO correr el prompt "Onia Comercio" tal cual.** Lleva datos fabricados marcados adentro (H5, `hermes-content/docs/ONIA_PLANTILLAS_PROMPT_VIDEO_20260818.md`). Reemplazar producto/monto/plazo por datos reales o rotular como ejemplo.
6. **NO arrancar Lucía con video pago.** Las 6 imágenes ya están en disco; el video UGC (~35 cr presupuestados, `web-factory/docs/LUCIA_PATTERN_BANK_2026.md` §9) espera OK de gasto y NO es el bloqueo del arranque. Generación paga = permiso explícito caso por caso, siempre.
7. **NO construir herramientas de comentario→DM (ManyChat o similar).** El ciclo ya está VIVO en n8n con SISTEMA y LISTA (verificado 18-ago). Se alimenta, no se reconstruye.
8. **NO comentario→DM en TikTok.** Gate geográfico (VN/ID/TH) — no disponible para Bolivia (verificado en research previo; contexto en vivo 18-20 ago). TikTok sirve para publicar y responder en público.
9. **NO esperar la verificación de negocio de Meta para lanzar la pauta.** *Inferencia, no frase de un doc:* ningún doc dice que correr ads la exija; lo escrito es que la verificación acelera el límite diario de gasto (`hermes-content/docs/ONIA_META_VERIFICACION_CHECKLIST_20260725.md`). Se tramita en paralelo, no como gate.
10. **NO subir presupuesto "para darle tiempo".** Regla de corte de 7 días escrita en `hermes-content/docs/ONIA_ADS_CAMPANA_1_LISTA_20260813.md`: sin reunión atribuida → se apaga y se cambia el ángulo.
11. **NO intentar resolver la consistencia de cara generada con más research.** 17 ítems analizados: ninguno la resuelve generando (H6). Soul+texto para Lucía; para clientes, el molde P6 (metraje real + sustituir solo el objeto).
12. **NO encender la campaña sin acotar el geo.** Bolivia país entero riega los $35. Gate duro antes de activar.

---

## Verificación

Este plan sintetiza 3 informes que pasaron verificación adversarial independiente (cada referencia chequeada una por una contra disco / API en vivo / fetch web):

- **Stack interno:** 23 referencias de archivo verificadas en ruta y contenido exacto — 0 fabricadas. Conteos reproducidos (13 briefs, 18 tandas, 19 scripts, 22 patrones motion).
- **Meta Ads:** 6 archivos verificados con número de línea + las 8 llamadas API reproducidas EN VIVO con coincidencia exacta — 0 fabricadas. 1 atribución corregida en este plan (la frase "correr ads no exige la verificación" no está en el doc citado: acá figura como inferencia, §3 ítem 5 y §5 ítem 9).
- **Corpus + tendencias:** 4 archivos de corpus verificados punto por punto + 4 de 13 URLs web fetcheadas. **2 referencias web CAYERON** (cifras atribuidas a Superscale e inBeat que no están en esas páginas; una decía lo opuesto) → **excluidas de este plan** (ver §2 P5-P6 y §5 ítem 4). Las 9 URLs no fetcheadas no aportan cifras acá — solo dirección, marcada.
- **Verificación propia del sintetizador (20-ago):** rama `claude/ads-creatividades-publicos` confirmada; las 6 imágenes P1-P6 de Lucía confirmadas en disco en `hermes-content/references/modelos/lucia/posts-20260807/` (el informe de stack las heredaba de `LUCIA.md` sin listar — ahora están vistas).

**Total: ~45 referencias verificadas · 2 caídas (excluidas) · ~13 no verificables (marcadas donde se usan).**
No verificado en esta síntesis: estado en vivo de Postiz/n8n/VPS posterior al 18-20 ago (prohibido re-tocar; se usó el contexto verificado provisto), y si el footer legal ya está publicado en onia.com.bo.

---

# ESTADO 2026-08-21 (noche) — construido vs siguiente

## Construido y verificado

| Sistema | Estado |
|---|---|
| Publicación | Postiz con 2 cuentas · cola @oniahq llena hasta el 09-sep (9 posts + comentarios) · 1er post publicado y vivo |
| Respuesta | comentario→DM v8 multi-cuenta EN PROD: SISTEMA/LISTA (@oniahq) + SISTEMA con voz propia (Lucía) · freno 24h · anti-bucle |
| Motor carruseles | pack editorial-clean (serif) · gate CTA-con-palabra · gate ortografía · Chrome-first · puente render→programar probado |
| Identidad Lucía | ancla vigente + molde corregido (paleta opcional = sin filtro) · 4 fotos nuevas sin filtro (L1b/2b/4b/5b) |
| Lanzamiento Lucía | guion reel 4 beats + brief carrusel fijado (7 slides) + **motor elegido: kling natural** (seedance mini respaldo) |
| Modelo 2 | INTERNA en pausa · método ganado: ficha de rasgos → imagen maestra → encadenado |
| Conocimiento | tarifario completo medido (incl. seedance_2_5 = 32.5cr/5s) · plantillas foto/CINE/UGC · encuadres · radar de ganchos · tendencias influencers IA · TikTok research |

## Los errores de generación, anotados con causa (pedido de Sergio)

1. Photoshoot v1 derivado → Element mezclaba 3 bases; regla: imagen maestra única
2. Filtro de color → bloque de paleta del molde; regla: color natural por defecto
3. "CLOSED" horneado → mayúsculas en el prompt se vuelven texto
4. **Slow motion → "slowly/softly" en MIS prompts; regla: `natural real-time speed` siempre**
5. Patrón de fondo: instrucciones sin auditar efectos secundarios → checklist de 3 preguntas antes de generar (mayúsculas / velocidad / paleta)

## Siguiente, en orden

1. **Reel de lanzamiento de Lucía** (kling natural, velocidad natural, voz Marcela, subtítulos con gate) → tabla de cortes + preview 360p a Sergio
2. Render del carrusel fijado con las fotos aprobadas → QC
3. OK de Sergio al preview → **Lucía AL AIRE** (reel + fijado + posts escalonados)
4. Después: historias, serie "El prompt de hoy", cron v2 (puente autónomo)
5. Bloqueado por Sergio: **tarjeta en ONIA Ads** (amplificar el lanzamiento)
6. En pausa: modelo 2 · TikTok (conector Higgsfield, link vencido — se regenera al retomar)
