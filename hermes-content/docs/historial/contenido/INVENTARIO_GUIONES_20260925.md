> 🔴 **Foto del 2026-09-25, NO es fuente de verdad; la fuente viva es
> `contenido/SISTEMA_DE_GUIONES.md` y el índice `ONIA_CIRCUITO_DE_CONTENIDO.md`**
> (las dos rutas, bajo `hermes-content/docs/`). No se edita más: si algo de acá cambia,
> se cambia en la fuente viva.
>
> **Qué es.** El informe «A1» que un subagente de la sesión CONTENIDO midió el 2026-09-25,
> en sólo lectura, con piso `origin/main` = `ea6e6677`. Se archiva **tal cual**. Cita
> ramas sin integrar (`@codex/…`, `@claude/…`): lo que vive en una rama **no está en
> `main` y no manda** hasta que se integre.
>
> **Lo único que se tocó al archivarlo:** (1) se quitaron las referencias al scratchpad de
> la sesión, que no existe fuera de ella; (2) los montos de precio de ONIA se reemplazaron
> por `[monto omitido]`, porque ningún doc define precio: se leen de
> `onia-platform/lib/subscription-plans.ts` y `lib/pricing.ts` (CLAUDE.md §2). Los precios
> de modelos de IA de terceros (US$ por millón de tokens) quedaron como estaban.

# A1 · Inventario de guiones — marca personal de Sergio Urcullo, comunidad y ONIA

- **Fecha:** 2026-09-25 · **Base:** `claude/onia-content-scripts-cvat9r` = `origin/main` `ea6e6677`.
- **Modo:** sólo lectura. No se editó, creó ni borró nada del repo; el informe se escribió fuera del repo y esta copia se archivó en `historial/contenido/` el mismo día.
- **Regla con la que se evalúa cada guion (Sergio Urcullo):** *«cada guion tiene que ENSEÑAR algo concreto, y si hay que mostrar pantalla, tiene que ser real (grabación real, no inventada)»*.

---

## 0. Cómo se hizo y qué NO se pudo confirmar

- **Leído entero:** todo lo que agregan las 4 ramas nombradas (`codex/marca-comunidad-plan`, `codex/sergio-vault-growth`, `codex/samuel-grabaciones-20260921`, `claude/marca-personal-carruseles-dist-deadab`) y, en main, los guiones de `docs/cola/` (incluye `drops/`), `SERIE_*`, `docs/yt/`, `carousels/out/yt-*`, `campaigns/`, los 3 `ONIA_*_GUION_*`, `ONIA_MARCA_PERSONAL_SEMANA1`, `ONIA_COMUNIDAD_CONTENIDO`, `videos/*/README` y los handoffs de edición, carruseles y serie YT. **Leído sólo por encabezado, caption o brief (no lámina por lámina):** los `PARA-PUBLICAR-*` viejos, los carruseles de agosto de @oniahq, Lucía y los auto-generados. **Mirados renderizados:** carrusel dental v2, carrusel Opus 5.5 (y su lámina 3), carrusel «6 columnas» y la captura oficial de precios de Opus.
- **Barrido de las 118 ramas remotas:** comparé sus árboles contra main buscando archivos de guion/cola/carrusel/YT que main no tenga. Salieron **30 rutas**: todas de las 4 ramas nombradas, más `claude/carril-contenido` (Lucía D15–D19, anuncios D17, cola `contenido.md`), `claude/ads-creatividades-publicos` (cola `contenido.md`) y dos ramas viejas con la ruta antigua del guion del YT 03. Para los archivos que existen en main y en otras ramas con contenido distinto, las versiones de las ramas viejas son **anteriores** a main (ver §4).
- **El clon es *shallow*:** la historia de main arranca el 2026-09-11 y el commit `f7bcc9d7` (21-sep) es frontera; por eso casi todo archivo de main "dice" 21-sep en `git log`. Para fechar uso las fechas escritas dentro de cada doc y las ramas que sí tienen historia.
- **Sin red hacia `sergiourcullo.vercel.app` ni a docs oficiales** (el proxy responde 403): **ninguna URL ni recurso se verificó en vivo**. Las grabaciones viven en `E:\ONIA-YouTube\…` (máquina de Sergio Urcullo): las reporto *según el brief/handoff*, no las vi.
- **Publicación:** sin acceso a Instagram/TikTok/WhatsApp. Marco PUBLICADO sólo lo que un doc registra con fecha o URL: YT 01–03, drops D0–D6, carrusel «Mi stack» enviado a la comunidad. El handoff de carruseles del **10-sep** dice *«Publicado en Instagram: NADA»*; después no hay registro por pieza (la auditoría IG del 22-sep da métricas agregadas).
- **Opus 5.5:** miré la captura oficial `02-cost-and-speed.png` (22-sep) y contrasté con la referencia de modelos del skill `claude-api`: US$4/20 por 1M tokens, lectura de caché 0,20 (Opus 5: 5/25 y caché 0,50, «60 % menos»), thinking no desactivable, `tool_choice` any/forzado da 400, **effort por defecto `medium`** (Opus 5: `high`). **Las cifras del guion coinciden.** El «40 % menos» oficial es *«at default settings»*.

**Leyenda.** Aud.: **J** = jóvenes/aficionados a la IA que quieren construir o vender (audiencia de la marca personal desde el 21-sep) · **D** = dueños de negocio en general · **C** = dueños/administradores de clínicas (cliente de ONIA, Etapa 1 vigente) · **G** = público general (Lucía). Estado: IDEA (título/esquema) · ESCRITO (texto grabable) · RENDER (carrusel/imagen renderizado) · GRABADO · EDITADO · PROGRAMADO · PUBLICADO/ENVIADO. **MANTENER\*** = sólo si se cumple la condición escrita. **(n)** junto al ID = la fila agrupa n piezas. **Rutas:** sin prefijo = dentro de `hermes-content/`; `videos/`, `out/` y `scripts/` están en la raíz del repo; `@rama` indica dónde vive la versión citada.

---

## 1. Resumen

### Conteos (filas = guiones o grupos; piezas = unidades que representan)

Total: **194 filas**, que cubren **307 piezas**.

| Formato | Filas | Piezas |
|---|---:|---:|
| Vertical corto (Reel/TikTok/Short/pilar) | 113 | 160 |
| YouTube largo | 16 | 18 |
| Carrusel / imagen | 33 | 67 |
| Historias | 6 | 12 |
| Drop de comunidad | 17 | 29 |
| Anuncio ONIA | 7 | 17 |
| Texto (DM, X/LinkedIn) | 2 | 4 |

| Estado (con evidencia) | Filas | Piezas |
|---|---:|---:|
| IDEA | 28 | 65 |
| ESCRITO | 102 | 128 |
| RENDER | 38 | 82 |
| GRABADO | 9 | 9 |
| EDITADO | 5 | 5 |
| PROGRAMADO | 1 | 7 |
| PUBLICADO | 11 | 11 |

| Veredicto | Filas | Piezas |
|---|---:|---:|
| MANTENER | 106 | 109 |
| REESCRIBIR | 48 | 90 |
| DESCARTAR | 40 | 108 |

| Formato × veredicto (filas) | MANTENER | REESCRIBIR | DESCARTAR |
|---|---:|---:|---:|
| Vertical corto (Reel/TikTok/Short/pilar) | 65 | 24 | 24 |
| YouTube largo | 11 | 2 | 3 |
| Carrusel / imagen | 12 | 11 | 10 |
| Historias | 3 | 3 | 0 |
| Drop de comunidad | 12 | 5 | 0 |
| Anuncio ONIA | 3 | 2 | 2 |
| Texto (DM, X/LinkedIn) | 0 | 1 | 1 |

| Fuente | Filas | MANTENER | REESCRIBIR | DESCARTAR |
|---|---:|---:|---:|---:|
| S1 Rama `codex/marca-comunidad-plan` (21–22 sep, NO mergeada) | 42 | 29 | 8 | 5 |
| S2 Rama `codex/sergio-vault-growth` (21 sep, NO mergeada) | 3 | 2 | 1 | 0 |
| S3 Rama `codex/samuel-grabaciones-20260921` | 10 | 4 | 5 | 1 |
| S4 Rama `claude/marca-personal-carruseles-dist-deadab` (17–21 sep, NO mergeada) | 19 | 13 | 2 | 4 |
| S5 main · cola del 21-sep (Codex) y sus carruseles | 11 | 4 | 2 | 5 |
| S6 main (+deadab) · YouTube: serie «Claude Code de cero» y largos propuestos | 10 | 7 | 2 | 1 |
| S7 main · GUIONES-RODAJE-17-20-SEP (cortos) | 16 | 10 | 5 | 1 |
| S8 main · Semana 1 «Mi stack» (10-sep), Tanda 2 (18-sep) y PLAN-VIDEOS 11–20 | 20 | 9 | 6 | 5 |
| S9 main · Drops de la comunidad | 15 | 11 | 4 | 0 |
| S10 main · marca personal temprana (31-ago/02-sep) y carruseles/imágenes de septiembre | 22 | 5 | 9 | 8 |
| S11 ONIA / @oniahq | 10 | 3 | 4 | 3 |
| S12 Lucía (línea congelada) y otros | 6 | 0 | 0 | 6 |
| S13 main · Serie TikTok «Convertí mi PC en un empleado que no duerme» (SERIE_TIKTOK_NODO_AGENTE) | 10 | 9 | 0 | 1 |

De los 106 MANTENER, 9 son condicionados (\*). Por audiencia: 133 filas son J, 30 mezclan J/D, 15 son D, 11 son C o C/D y 5 son G.

### Lo que hay que saber, en 9 puntos

1. **Casi todo está escrito y casi nada está grabado o publicado.** Grabado con evidencia: los A-roll de G1 y G2 del 22-sep (*«[x] grabado; falta localizar el archivo»*) y los clips de pantalla de Samuel (18 y 21-sep, en `E:\`). Editado: 4 TikToks del 17-sep (sin música; publicación no consta) y el reel Fable/Astra (vencido). Publicado: YT 01, 02 y 03; drops D0–D6; carrusel «Mi stack» en la comunidad.
2. **Lo que mejor enseña está en `codex/marca-comunidad-plan` (22-sep):** cada guion nombra nodo, comando, JSON, prueba y límite. **Pero sus pantallas no existen:** en el repo no hay ninguno de los workflows n8n que muestran (clasificador con Basic LLM Chain + parser, AI Agent con 3 tools, loop con `attempt` + Wait) ni capturas de `claude mcp list` / `/mcp`. La única pantalla real lista es la de Opus 5.5 (capturas Playwright).
3. **Contradicción técnica, a resolver antes de publicar:** el 21-sep (main) se enseña *«AI Agent + OpenAI Chat Model para clasificar»* (S5-04, S5-05, láminas 3–4 del carrusel S5-09, historia S2-02); el 22-sep se enseña lo contrario (S1-02: *«no uses un AI Agent para clasificar leads»*). El carrusel S5-09 está agendado para el sáb 26.
4. **Versiones corregidas sin mergear:** el guion del YT 04 en main trae el dato central falso (*«doce errores en una sola sesión»*); la versión recontada —con `LISTO-PARA-GRABAR.md` y la demo— está sólo en `deadab`. Lo mismo con el YT 03.
5. **Un dato caído sobrevive en ~12 guiones:** *«todo corre en una PC vieja en mi casa, gratis»*. Medido el 18-sep: 40 trabajos por horario en el VPS pago y 0 en la PC de casa. Aparece en YT 06, Mi stack §0/§2/§7/§8a, 19.3, PLAN-VIDEOS vie 11, E2, Semana1 D, DM STACK y el carrusel «Mi equipo no cobra».
6. **Noticias vencidas por la regla propia de 48 h:** Opus 5.5 *«salió hoy»* (22-sep), GPT-6 Sol/Luna, Fable 5.1 vs GPT-6 Astra (carrusel y reel). Opus sigue valiendo como **tutorial de migración** si se cambia el gancho y se agrega el effort por defecto.
7. **Dos calendarios chocan para el 22–27 sep:** `deadab` (MISMO-PRECIO, AGENTS-MD, INSTRUMENTO-ROTO, DATO-HEREDADO, 18-ERRORES — y `GUIONES-DIA-21-SEP` propone otro orden) contra `codex` (OPUS, MAPA, PROCESO, ARQUITECTURA, SANTA CRUZ). También hay **dos planes distintos para el mismo lunes 21** (main vs deadab).
8. **Los CTA no tienen dónde aterrizar solos:** el paquete de recursos (`SISTEMAS_IA_PACKS_2026-09-22.md`) y las páginas de Bóveda (`/agentes`, `/automatizar`, `/mcp`) existen sólo en ramas; el DM automático de @sergiourcullo no tiene palabras cableadas → toda entrega es manual.
9. **Audiencia y negocio:** desde el 21-sep la marca personal apunta a jóvenes/aficionados; lo previo (drops «tu negocio», Semana1 B/C/F, 20.3, Tanda 2 ⑧) le habla a dueños. Y lo único alineado con la **Etapa 1** (dental) son los anuncios de @oniahq: listos, no publicados, y el UGC sin generar.

---

## 2. Los 10 que conviene producir primero (valor de enseñanza × qué tan listos están)

| # | Guion (ID) | Ruta @rama | Por qué primero | Qué falta, concreto | Pantalla real a grabar |
|---|---|---|---|---|---|
| 1 | **G2 «No uses un AI Agent para clasificar leads en n8n»** (S1-02) | `docs/cola/GUIONES-DIA-2026-09-22.md` §Guion 2 @codex/marca-comunidad-plan | A-roll ya grabado; el tutorial más literal y corrige el error del 21-sep | localizar el archivo; pickup V2; **construir el workflow** | n8n: Webhook → Basic LLM Chain + OpenAI Chat Model → Structured Output Parser → Sheets → Switch → Telegram, con JSON ficticio, una salida inválida y una válida |
| 2 | **G1 «Las 5 piezas de un agente de IA que sí trabaja»** (S1-01) | ídem §Guion 1 | ya grabado | pickup V1 + las 12 tomas de B-roll | libreta OBJETIVO/TOOLS/LOOP/LÍMITE, canvas n8n saneado, doc MCP |
| 3 | **G4 «El loop mínimo en n8n para no repetir para siempre»** (S1-04) | ídem §Guion 4 | paso a paso completo con pruebas definidas | construir el flujo con `attempt` y Wait; ajustar el gancho | n8n + 3 corridas (pending, pending, paid y 3×pending) contra un endpoint de prueba; base: clip `n8n-04` de Samuel |
| 4 | **G3 «MCP no es un agente: revisá esto antes de conectarlo»** (S1-03) | ídem §Guion 3 | sólo terminal; alto valor práctico | un servidor MCP saneado | `claude mcp list`, `claude mcp get <nombre>`, `/mcp` sin variables ni tokens |
| 5 | **YT 04 «La IA te dice “listo” y te está mintiendo»** (S6-04) | `carousels/out/yt-04-verificar/{GUION.md,LISTO-PARA-GRABAR.md,demo-falso-verde/}` @claude/marca-personal-carruseles-dist-deadab | cifras recontadas el 21-sep, demo que corre, continúa la serie publicada | mergear **esa** versión (la de main es falsa) y grabar | terminal con `demo.sh` + navegador con `login.html` — decir que es reproducción del bug real |
| 6 | **F2 «El verde que miente»** (S4-02) | `docs/cola/GUIONES-DIA-21-SEP.md` @deadab | 35 s, demo lista, comparte material con el 04 | grabarlo en la misma sesión que el 04 | el mismo |
| 7 | **Opus 5.5 → «Cómo decidir si migrar a Opus 5.5 con números»** (S1-08 + S1-15 + carrusel S1-38) | `GUIONES-DIA-2026-09-22.md` §Guion 8 · `carousels/out/sergio-opus-5-5-migracion-20260922` · `captures/opus-5-5/` @codex | la única pieza con pantalla oficial ya capturada; envejece cada día | sacar «salió hoy»; sumar effort por defecto `medium` y fijar effort en el A/B; corregir las etiquetas de la lámina 3 | existe (capturas 01–07); re-correr el script el día |
| 8 | **Carrusel «No automatices hasta poder llenar estas seis columnas»** (S1-39) | `carousels/out/sergio-proceso-6-columnas-20260922` (+zip) @codex | renderizado, caption y recurso PROCESO listos | aprobación de Sergio Urcullo y subida manual | — |
| 9 | **YouTube «MCP, agentes, loops y n8n»** (S1-09 + S1-32) | `GUIONES-DIA-2026-09-22.md` §Guion 9 + `carousels/out/yt-09-mcp-agentes-loops/` @codex | deck listo; reusa las pantallas de 1–4 | unificar las dos versiones del guion; grabar después de 1–4 | 3 workflows + contratos de tools + doc MCP |
| 10 | **Samuel n8n A «Tu primer loop en 30 segundos»** (S3-04) | `docs/cola/BRIEF-SAMUEL-VIDEOS.md` @codex/samuel-grabaciones-20260921 | construcción ya grabada el 21-sep | autorizar un mensaje de prueba y grabarlo llegando al teléfono | `n8n-01`/`n8n-03` (en `E:\…\ENTREGA-20260921`) + teléfono |

**Siguientes en la fila:** G5 contrato de tool (S1-05, con las dos pruebas corriendo), yt-08 (S1-31), EP0 y EP2 de la serie TikTok de depuración (S13-01/03), y los drops «Mi stack» si no se enviaron (S9-09…14). **Fuera del ranking de enseñanza pero el único alineado con la Etapa 1:** el UGC dental (S11-01) y el carrusel dental v2 (S11-02).

---

## 3. Inventario completo

### S1 · Rama `codex/marca-comunidad-plan` (21–22 sep, NO mergeada) — lo más nuevo

| ID | Guion | Archivo @rama | Formato | Aud. | Qué enseña (concreto) | Pantalla real necesaria → ¿existe? | Estado (evidencia) | Veredicto | ⏰ vence · versiones/duplicados |
|---|---|---|---|---|---|---|---|---|---|
| S1-01 | G1 «Las 5 piezas de un agente de IA que sí trabaja» | docs/cola/GUIONES-DIA-2026-09-22.md §1 @codex/marca-comunidad-plan | Vertical · Feed B-roll ~55 s | J | objetivo verificable · modelo · tools · loop · límite (3 intentos, humano antes de mensaje externo); «conecta ≠ decide» (MCP/n8n) | canvas n8n y selector de modelo saneados, doc MCP, libreta real → no hay capturas en repo (biblioteca de 12 tomas B-roll pendiente) | GRABADO A-roll («[x] grabado; falta localizar el archivo»); PAQUETE pide pickup V1 | MANTENER: editar con el pickup (la toma es anterior a las correcciones); pantalla n8n real, no diagrama decorativo | Dup de ángulo: S5-05 y carrusel S5-09 |
| S1-02 | G2 «No uses un AI Agent para clasificar leads en n8n» | docs/cola/GUIONES-DIA-2026-09-22.md §2 @codex/marca-comunidad-plan | Vertical · Feed normal | J | Webhook → Basic LLM Chain+OpenAI Chat Model → Structured Output Parser (JSON Schema) → Google Sheets → Switch (requiere_humano primero) → Telegram; el parser valida forma, no verdad; «¿quién decide el próximo paso?» | workflow real en n8n ejecutado con JSON ficticio → NO existe el workflow ni su export en el repo (los JSON de demos-samuel son otros flujos) | GRABADO A-roll (archivo sin localizar); PAQUETE pide pickup V2 | MANTENER: construir el workflow real y capturarlo antes de editar | Supera S5-02/03/04; hermano largo = S1-31 (yt-08); versión con pantalla = S1-17 |
| S1-03 | G3 «MCP no es un agente: revisá esto antes de conectarlo» | docs/cola/GUIONES-DIA-2026-09-22.md §3 @codex/marca-comunidad-plan | Vertical · Trial v2 (pantalla verde) | J | `claude mcp list` → `claude mcp get NOMBRE` → `/mcp`; clasificar cada tool en lee/escribe/borra/sale a internet; readOnlyHint es pista, no barrera | terminal de Claude Code con un servidor saneado + arquitectura oficial MCP → no hay captura | ESCRITO | MANTENER | ⏰ comandos de la versión instalada. Versión corta duplicada = S1-14 |
| S1-04 | G4 «El loop mínimo en n8n para no repetir para siempre» | docs/cola/GUIONES-DIA-2026-09-22.md §4 @codex/marca-comunidad-plan | Vertical · Trial v2 (split 60/40) | J | Edit Fields attempt=0 → HTTP Request → IF status==='paid' → attempt+1 → IF attempt<3 → Wait 10 min → Telegram; pruebas pending,pending,paid y 3×pending (una sola alerta); loop determinista vs agentivo | n8n real + endpoint de prueba → base parcial: clip de Samuel `n8n-04-construccion-monitor.mp4` (Schedule→HTTP→IF→Telegram, sin contador ni Wait; en E:\, fuera del repo) | ESCRITO | MANTENER (el tutorial más literal del lote); ajustar el gancho «puede quedarse gastando dinero» (un HTTP+Wait no gasta tokens) | Supera S5-07 |
| S1-05 | G5 «La descripción de una tool decide si tu agente la usa bien» | docs/cola/GUIONES-DIA-2026-09-22.md §5 @codex/marca-comunidad-plan | Vertical · Trial v2 (JSON sobre el hombro) | J | contrato get_lead_by_id: inputSchema/outputSchema, required, additionalProperties:false, readOnlyHint; prueba `{}` falla y `lead_demo_001` devuelve 3 campos; separar leer de escribir | ejecución REAL de las 2 pruebas (servidor MCP o tool de n8n que valide) → hoy sólo existe el JSON escrito | ESCRITO | MANTENER*: no sale si las dos pruebas no se graban corriendo | Recurso TOOL existe (SISTEMAS_IA_PACKS, rama) |
| S1-06 | G6 «Mucho de lo que te venden como agente es un workflow con otro nombre» | docs/cola/GUIONES-DIA-2026-09-22.md §6 @codex/marca-comunidad-plan | Vertical · Trial v2 polémico | J | auditoría de 20 s: marcar puntos de decisión; si todo es IF/Switch es workflow; pedir lista de tools, condición de salida y máximo de iteraciones | 2 canvas reales (lineal vs AI Agent + 3 tools) → no existen | ESCRITO | MANTENER | Dup: S5-05, S1-19 |
| S1-07 | G7 «El problema de aprender tecnología mirando redes» | docs/cola/GUIONES-DIA-2026-09-22.md §7 @codex/marca-comunidad-plan | Vertical · Trial v2 personal | J | mini-sistema: Manual Trigger → Edit Fields (tarea, estado) → IF; guardar el JSON y el primer error | n8n real (ejecución fallida y exitosa) + carpeta real de tutoriales guardados | ESCRITO | MANTENER (personal con acción concreta) | «Guardé cientos de videos»: lo confirma Sergio Urcullo |
| S1-08 | G8 «Claude Opus 5.5 salió hoy: así decidís si migrar con números» | docs/cola/GUIONES-DIA-2026-09-22.md §8 @codex/marca-comunidad-plan | Vertical · Trial v2 noticia (split) | J | 0,2M entrada + 0,05M salida + 5M caché = US$2,80 vs 4,75 con Opus 5 (−41,1 %); −20 % por token sin caché; thinking no se desactiva; tool_choice any/forzado no soportado; métrica costo ÷ tareas exitosas | páginas oficiales → EXISTE: captures/opus-5-5/01–05.png + 06/07.webm + manifest.json @codex/marca-comunidad-plan (22-sep 23:38 BO) | ESCRITO (A-roll sin evidencia de grabación) | REESCRIBIR: «salió hoy» venció (regla propia: noticia 48 h) → tutorial de migración; el 40 % es «at default settings» y el effort por defecto de 5.5 es medium (Opus 5: high): el A/B debe fijar effort. Precios y cálculo verificados | ⏰ fecha, precios, claims 40 %/30 %. Versión corta = S1-15; carrusel = S1-38 |
| S1-09 | G9 YouTube «MCP, agentes, loops y n8n: cómo se conectan de verdad» (texto literal con tiempos) | docs/cola/GUIONES-DIA-2026-09-22.md §9 @codex/marca-comunidad-plan | YouTube 12 min | J | mapa workflow / llamada a modelo / agente / loop / MCP; construye clasificador determinista, agente con 3 tools y loop con frenos | 3 workflows n8n reales + contratos de tools + doc MCP + deck yt-09 → demos NO existen | ESCRITO | MANTENER: grabar después de S1-02/03/04 (reusa sus pantallas) | 2ª versión del mismo video = S1-32 (GUION.md generado). Unificar |
| S1-10 | 3 historias de comunidad del rodaje | docs/cola/PAQUETE-GRABACION-2026-09-22.md @codex/marca-comunidad-plan | Historias 8–12 s ×3 | J | no enseña: anuncia la serie, encuesta y CTA COMUNIDAD al piloto | cara (sin pantalla) | ESCRITO | REESCRIBIR: sumar el resultado útil (plantilla situación → prueba → encuesta → resultado → comunidad, auditoría IG 22-sep) |  |
| S1-11 | Mié 23 · B-roll «No elijo modelos por benchmarks» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Feed B-roll | J | A/B con 10 tareas reales: pasó / tokens / latencia / tools / costo → costo total ÷ tareas correctas | hoja con 10 casos CORRIDOS → no existe (la tabla del recurso OPUS está vacía) | ESCRITO (fecha pasada, sin evidencia) | MANTENER*: sólo con una corrida real en pantalla | Evergreen |
| S1-12 | Mié 23 · Feed normal «Las 6 preguntas antes de automatizar» (1:1) | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Feed normal (pizarra) | J | qué entra, pasos, frecuencia, dónde falla, costo del fallo, resultado; agenda de llamada 5/25/10/5 | pizarra real | ESCRITO | MANTENER | Recurso 1A1 (rama) |
| S1-13 | Mié 23 · Trial v2 «GPT-6 Sol vs Luna» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Trial v2 (split) | J | precios Sol US$2/10 vs Luna 0,10/0,50 por 1M; A/B de 10 tareas | anuncio oficial de OpenAI → sin captura | ESCRITO | DESCARTAR: noticia vencida; el método ya está en S1-11 | ⏰ precios de OpenAI no verificados acá |
| S1-14 | Mié 23 · Trial v2 «Auditoría MCP en dos comandos» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Trial v2 | J | = G3 resumido (`claude mcp list`, `claude mcp get`, `/mcp`, 4 columnas) | terminal | ESCRITO | DESCARTAR: duplicado de S1-03 (usar G3) | Dup de S1-03 |
| S1-15 | Mié 23 · Trial v2 «Opus 5.5 rompe estas dos configuraciones» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Trial v2 (pantalla verde) | J | `thinking: disabled` da error → controlar con output_config.effort; tool_choice any/forzado no soportado → auto + tools estrictas; buscar ambos en tu código | guía oficial de migración → EXISTE: captures/opus-5-5/04 y 05 @codex/marca-comunidad-plan | ESCRITO | MANTENER (evergreen para quien migra); sumar effort por defecto medium | ⏰ guía de migración. Mitad técnica de S1-08 |
| S1-16 | Mié 23 · Trial v2 «Cómo preparo una llamada 1:1» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · B-roll personal | J | 5 campos de preparación; cerrar una acción con responsable y fecha; no usar el caso sin permiso | calendario real con datos ocultos | ESCRITO | MANTENER | Solapa con S1-12 |
| S1-17 | Jue 24 · Feed normal «Calificador de leads nodo por nodo» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Feed normal (split) | J | Webhook → Basic LLM Chain → Parser (categoria, urgencia, requiere_humano, score, razon) → Sheets → Switch (score ≥ 70, fallback); probar payload claro y ambiguo | n8n real ejecutando 2 payloads → no existe | ESCRITO | MANTENER como versión con pantalla de S1-02 (no publicar las dos el mismo día) | Dup extendido de S1-02 |
| S1-18 | Jue 24 · Trial v2 «El parser no valida verdad» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Trial v2 | J | JSON válido con decisión equivocada; 3 casos conocidos esperado vs real | 2 salidas reales de n8n | ESCRITO | MANTENER |  |
| S1-19 | Jue 24 · Trial v2 «Force Tool Call no garantiza verdad» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Trial v2 | J | Manual Trigger → AI Agent → Calculator Tool con la opción on/off; leer el trace | trace real en n8n | ESCRITO | MANTENER*: el propio doc exige confirmar que la opción existe en la versión instalada | ⏰ feature de n8n |
| S1-20 | Jue 24 · Trial v2 «Switch o agente» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Trial v2 | J | quién decide el siguiente paso; ¿podés dibujar todas las rutas? | 2 diagramas | ESCRITO | DESCARTAR: duplicado de S1-06 y de la lámina 08 de yt-09 | Dup |
| S1-21 | Jue 24 · Trial v2 «Antes de automatizar ONIA pregunta esto» (6 columnas) | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Trial v2 (pizarra) | J/D | entrada · responsable · dato · decisión · salida · excepción, con el ejemplo de una reserva | pizarra | ESCRITO | MANTENER (es la versión video del carrusel S1-39; no el mismo día) | Dup temático S1-39 |
| S1-22 | Vie 25 · Feed normal «El dato del 23 de septiembre quedó viejo» (SIN) | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Feed normal | D | revisar fuente oficial antes de publicar una fecha; regularización ampliada al 31-dic-2026 (DS 5708) | comunicado de impuestos.gob.bo → sin captura | ESCRITO | DESCARTAR: fuera de la audiencia (jóvenes IA), dato fiscal que vence y riesgo de parecer asesoría | ⏰ fiscal |
| S1-23 | Vie 25 · Trial v2 «ROI de automatización en Bs» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Trial v2 (pizarra) | J/D | fórmula horas×costo hora + errores + oportunidades − costo mensual; recuperación = costo inicial ÷ retorno; marcar medido vs supuesto | calculadora real (hoja) | ESCRITO | MANTENER (sirve al que quiere vender automatizaciones) | Recurso BOLIVIA (rama) |
| S1-24 | Vie 25 · Trial v2 «Información tributaria no es asesoría» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical | D | «cuatro datos que revisar en SIAT» (sólo la fila de la tabla; no hay texto) | — | IDEA | DESCARTAR: sin guion, fuera de audiencia, riesgo fiscal |  |
| S1-25 | Vie 25 · Trial v2 «Automatizar un proceso roto» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Trial v2 | J | correr el proceso 5 veces a mano; definir éxito/error/humano; ejecución que falla por campo vacío y la que usa fallback | n8n real con la ejecución fallida y la exitosa → no existe | ESCRITO | MANTENER |  |
| S1-26 | Vie 25 · Trial v2 «Qué aprendí de una 1:1 sin contar el caso» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · personal | J | plantilla con huecos [patrón]/[método]; se llena sólo si aparece una lección verificable | — | IDEA (plantilla) | MANTENER condicionado (el propio doc: si no hay lección, se reemplaza) |  |
| S1-27 | Sáb 26 · Feed normal «Laboratorio de IA en 120 minutos» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Feed normal | J | agenda 15/25/45/20/15 y resultado mínimo (un workflow ejecutado); medir tras 4 pilotos | hoja de sesión real | ESCRITO | REESCRIBIR: la agenda de 120 min difiere entre PLAN/SISTEMAS_IA_PACKS (15/25/45/20/15) y ONIA_COMUNIDAD_CONTENIDO (15/35/25/25/15/5); unificar y no anunciar sin sede/fecha | Dup temático S1-40 |
| S1-28 | Sáb 26 · Trial v2 «HTML a video con HyperFrames» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Trial v2 (split) | J | init → preview → check/snapshots → render; timeline pausada y registrada | terminal real + preview + MP4 resultante → no hay captura (el deck yt-07 no es grabación) | ESCRITO | MANTENER | ⏰ versión HyperFrames (v0.8.62 al 22-sep) y flags |
| S1-29 | Sáb 26 · Trial v2 «Qué hace seekable una animación» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Trial v2 | J | timeline pausada; scrub del playhead vuelve al mismo estado | preview real de HyperFrames con scrub | ESCRITO | MANTENER (fusionable con S1-28) |  |
| S1-30 | Sáb 26 · Trial v2 «Primeros 20 miembros fundadores» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Trial v2 | J | no enseña: propone la acción semanal de la comunidad | — | ESCRITO | REESCRIBIR: pasarlo a drop/historia; no pasa la regla de enseñar |  |
| S1-31 | yt-08 «n8n paso a paso: clasificá leads sin construir un agente» (deck + GUION generado) | carousels/out/yt-08-n8n-leads/{index.html,GUION.md} @codex/marca-comunidad-plan | YouTube 10–14 min | J | workflow determinista de 7 nodos, prompt operativo, JSON Schema, Switch con default, 3 payloads, cuándo sí AI Agent | n8n real construido en vivo → workflow no existe; deck sí | ESCRITO (deck listo) | MANTENER (hermano largo de S1-02) | GUION = notas-instrucción, no texto literal |
| S1-32 | yt-09 «MCP, agentes, loops y n8n» (deck + GUION generado) | carousels/out/yt-09-mcp-agentes-loops/{index.html,GUION.md} @codex/marca-comunidad-plan | YouTube 10–14 min | J | 10 láminas: workflow, agente, loop, frenos, contrato de tool, MCP, árbol de decisión, parte honesta | n8n + doc MCP → demos no existen; deck sí | ESCRITO (deck listo) | MANTENER como deck; el texto hablado sale de S1-09 | Dup de S1-09 (dos fuentes del mismo video) |
| S1-33 | yt-07 «HyperFrames desde cero: videos programables con HTML» (deck + GUION generado) | carousels/out/yt-07-hyperframes/{index.html,GUION.md} @codex/marca-comunidad-plan | YouTube 10–14 min | J | composición mínima (data-*), timeline pausada (window.__timelines), lint/check/preview/render, present vs render | terminal real + archivos + snapshots de check → sin captura | ESCRITO (deck listo) | MANTENER: verificar comandos y la afirmación «render resuelve sólo la primera slide» | ⏰ versión/flags |
| S1-34 | Dom 27 · Feed normal «De comentario a recurso» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical/horizontal · Feed normal | J | palabra clave → respuesta manual o integración → URL → formulario con consentimiento → webhook n8n → entrega → registro; campos comment_id, from_id, keyword, resource_url, delivery_status, consent_at | demo manual punta a punta real → no existe (DM automático de @sergiourcullo sin palabras cableadas) | ESCRITO | MANTENER |  |
| S1-35 | Dom 27 · Trial v2 «CTA sin recurso es humo» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Trial v2 | J | checklist: abrir URL, incógnito, móvil, datos mínimos, ensayar la respuesta; si falla uno, sacar el CTA | recurso abierto real | ESCRITO | MANTENER |  |
| S1-36 | Dom 27 · Trial v2 «Postiz no responde DMs» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Trial v2 | J | programador ≠ inbox; firma de webhook, deduplicación por comment_id, límites, humano | UI real de Postiz → hoy no accesible (502/bloqueada según handoffs) | ESCRITO | REESCRIBIR: meterlo como lámina dentro de S1-34 |  |
| S1-37 | Dom 27 · Trial v2 «Cotizar SaaS en Bolivia» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · Trial v2 (pizarra) | J | moneda de origen, fuente del tipo de cambio (BCB), fecha, cargos, margen, vigencia; factura ficticia de US$100 | fuente BCB del día | ESCRITO | MANTENER (útil al que vende) | ⏰ tipo de cambio |
| S1-37b | Dom 27 · Trial v2 «Revisión personal de domingo» | docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md @codex/marca-comunidad-plan | Vertical · personal | J | 4 preguntas de revisión con huecos [mostrar] | tablero semanal real | IDEA (plantilla) | MANTENER condicionado: sólo con datos reales de la semana |  |
| S1-38 | Carrusel «Claude Opus 5.5: el costo bajó, pero migrar sin probar puede romper tu agente» | carousels/out/sergio-opus-5-5-migracion-20260922 (+zip, brief) @codex/marca-comunidad-plan | Carrusel 8 láminas | J | precio, cálculo reproducible, 2 cambios de migración, A/B de 20 tareas | no necesita (fuente citada) | RENDERIZADO (agendado mié 23; sin evidencia de publicación) | REESCRIBIR: lámina 3 (mirada) rotula INPUT «$0,80 + $1,00» (mezcla entrada y salida), OUTPUT «+ $1,00 caché» y PERMISOS «total = $2,80»; el cuerpo «= $1. 5M caché» se lee como «$1.5M». Sumar effort por defecto y publicar ya o se vence | ⏰ |
| S1-39 | Carrusel «No automatices hasta poder llenar estas seis columnas» | carousels/out/sergio-proceso-6-columnas-20260922 @codex/marca-comunidad-plan | Carrusel 8 láminas | J/D | 6 columnas con ejemplo de reserva + test de 5 ejecuciones manuales | no necesita | RENDERIZADO (agendado vie 25; sin evidencia) | MANTENER: listo (hoja de contacto mirada); recurso PROCESO existe. La caja «terminal» de la lámina 6 es ilustrativa, no una captura |  |
| S1-40 | Carrusel «Así funcionaría una comunidad de IA que sí construye cosas» (Santa Cruz) | carousels/out/sergio-comunidad-lab-santa-cruz-20260922 @codex/marca-comunidad-plan | Carrusel 8 láminas | J | formato de laboratorio de 120 min, 20 fundadores, 4 métricas antes de cobrar | no necesita | RENDERIZADO (agendado dom 27) | REESCRIBIR: unificar la agenda (ver S1-27) y esperar las decisiones abiertas del piloto (sede, día, cupo) |  |
| S1-41 (7) | Drops de comunidad 22–28 sep (7: MAPA, 5 cajas, permisos de tool, revisión de diagramas, n8n sin agente, audio de cierre, encuesta piloto) | docs/ONIA_COMUNIDAD_CONTENIDO.md §Activación inmediata @codex/marca-comunidad-plan | Drops ×7 | J | cada uno nombra su entregable (árbol MAPA, plantilla ENTRADA→REGLA→ACCIÓN→REGISTRO→HUMANO, checklist de permisos…) | no | IDEA (sólo tabla; falta el texto pegable) | REESCRIBIR: escribir los textos (los recursos ya existen en SISTEMAS_IA_PACKS); 22–25 ya pasaron |  |

### S2 · Rama `codex/sergio-vault-growth` (21 sep, NO mergeada)

| ID | Guion | Archivo @rama | Formato | Aud. | Qué enseña (concreto) | Pantalla real necesaria → ¿existe? | Estado (evidencia) | Veredicto | ⏰ vence · versiones/duplicados |
|---|---|---|---|---|---|---|---|---|---|
| S2-01 | Historias «Día MAPA» (3 frames) | docs/OPERACION_SERGIO_BOVEDA_Y_COMUNIDAD.md @codex/sergio-vault-growth | Historias ×3 | J/D | Entrada → Regla → Salida antes de abrir n8n; encuesta; «el mapa está en la Bóveda» | video vertical de pantalla con workflow real → no existe | ESCRITO | MANTENER, si /automatizar existe en vivo (la página sólo está en esta rama; no verificable desde acá) |  |
| S2-02 | Historias «Día ARQUITECTURA» (3 frames) | docs/OPERACION_SERGIO_BOVEDA_Y_COMUNIDAD.md @codex/sergio-vault-growth | Historias ×3 | J | tabla IF / Agent / Loop = regla fija / lenguaje ambiguo / estado que cambia | Sergio a cámara + tabla | ESCRITO | REESCRIBIR: «Agent para lenguaje ambiguo» contradice S1-02 (clasificar = LLM Chain + parser; agente sólo si elige tools) |  |
| S2-03 | Historias «Día MCP» (3 frames) | docs/OPERACION_SERGIO_BOVEDA_Y_COMUNIDAD.md @codex/sergio-vault-growth | Historias ×3 | J | input → output → permiso; una tool segura empieza en lectura; encuesta | grabación de terminal sin tokens → no existe | ESCRITO | MANTENER |  |

### S3 · Rama `codex/samuel-grabaciones-20260921` — BRIEF de los 10 videos de Samuel (versión más nueva)

| ID | Guion | Archivo @rama | Formato | Aud. | Qué enseña (concreto) | Pantalla real necesaria → ¿existe? | Estado (evidencia) | Veredicto | ⏰ vence · versiones/duplicados |
|---|---|---|---|---|---|---|---|---|---|
| S3-01 | Samuel A «Tu negocio en orden» (Onia Platform) | docs/cola/BRIEF-SAMUEL-VIDEOS.md @codex/samuel-grabaciones-20260921 | Video @oniahq (pilar Samuel) | C/D | agenda y citas, ficha con historial, inventario, reserva pública | app.onia.com.bo con org demo → EXISTEN clips 18-sep onia-1-registro (39 s), onia-3-onboarding (97 s), onia-4-producto-y-venta (93 s) en E:\ONIA-YouTube\grabaciones\samuel\ (fuera del repo) | GRABADO (pantalla) | REESCRIBIR: los clips son de rubro comercio («Tienda La Esquina») y la etapa vigente vende dental; HALLAZGOS 18-sep: el onboarding dejó stock 0 y Caja bloqueó la venta → regrabar tras el arreglo |  |
| S3-02 | Samuel B «El que contesta cuando no estás» (chatbot) | docs/cola/BRIEF-SAMUEL-VIDEOS.md @codex/samuel-grabaciones-20260921 | Video @oniahq | C/D | chat web respondiendo precio, dueño editando el guion, bandeja con humano, escala cita | chat web + panel + bandeja → sólo existe onia-5-panel-y-asistente (61 s) | GRABADO parcial | REESCRIBIR: el chatbot es add-on, no titular (CLAUDE.md); falta grabar chat y bandeja |  |
| S3-03 | Samuel #3 «Cómo instalar una Skill en Claude Code» | docs/cola/BRIEF-SAMUEL-VIDEOS.md @codex/samuel-grabaciones-20260921 | Vertical (recorte) | J | carpeta .claude/skills → SKILL.md → reglas → invocar | tramo del YT 02 publicado + clip web-claude-code.mp4 (20 s) | GRABADO: listo para recortar del YT 02 (publicado) | MANTENER: recortar del YT 02 |  |
| S3-04 | Samuel n8n A «Tu primer loop en 30 segundos» | docs/cola/BRIEF-SAMUEL-VIDEOS.md @codex/samuel-grabaciones-20260921 | Vertical (pilar Samuel) | J/D | Schedule 09:00 → Telegram: trigger + un mensaje | EXISTEN n8n-01-mensaje-programado.mp4 y n8n-03-construccion-paso-a-paso.mp4 (58 s, 21-sep, E:\…\ENTREGA-20260921) | GRABADO (falta la toma del mensaje llegando: pide autorización de 1 mensaje a Telegram) | MANTENER: casi listo |  |
| S3-05 | Samuel n8n B «El aviso que te salva» | docs/cola/BRIEF-SAMUEL-VIDEOS.md @codex/samuel-grabaciones-20260921 | Vertical (pilar Samuel) | J/D | cada 5 min → HTTP → IF → Telegram (trigger + condición + acción) | EXISTEN n8n-02-monitor-y-alerta.mp4 y n8n-04-construccion-monitor.mp4 (136 s); HTTP a example.com y TU_CHAT_ID | GRABADO (sin prueba de fallo real) | MANTENER: grabar un fallo real y el aviso llegando; el «caso de las 3:01 AM» se dice sólo con su captura |  |
| S3-06 | Samuel llamadas A «Qué te llevás de la llamada» | docs/cola/BRIEF-SAMUEL-VIDEOS.md @codex/samuel-grabaciones-20260921 | Vertical | J/D | no enseña: presenta el roadmap de la llamada | Cal real + roadmap ejemplo | ESCRITO | REESCRIBIR: link /30min daba 404 el 21-sep (usar /llamada → /20min) y convertirlo en método (las 6 preguntas, S1-12) | ⏰ link |
| S3-07 | Samuel llamadas B «Cómo agendar en 30 segundos» | docs/cola/BRIEF-SAMUEL-VIDEOS.md @codex/samuel-grabaciones-20260921 | Vertical | J/D | recorrido de reserva (no enseña una habilidad) | EXISTE llamadas-B-agendar.mp4 (31 s, sin confirmar reserva) | GRABADO parcial | REESCRIBIR: usarlo como historia fija, no como pieza |  |
| S3-08 | Samuel «Campaña con Pomelli» | docs/cola/BRIEF-SAMUEL-VIDEOS.md @codex/samuel-grabaciones-20260921 | Vertical | D | nada (app no probada) | — | IDEA | DESCARTAR: regla de la casa, sólo apps probadas |  |
| S3-09 | Samuel «Ranking de Skills para desarrollo web» | docs/cola/BRIEF-SAMUEL-VIDEOS.md @codex/samuel-grabaciones-20260921 | Vertical | J | impeccable, ui-ux-pro-max, frontend-design, gsap-skills, taste-design; landing CON vs SIN skills | Claude Code generando la misma sección con y sin skills → no existe | ESCRITO | MANTENER: la prueba lado a lado es la pieza | ⏰ nombres/conteos de skills |
| S3-10 | Samuel «Cómo crear tu avatar con Higgsfield» | docs/cola/BRIEF-SAMUEL-VIDEOS.md @codex/samuel-grabaciones-20260921 + docs/cola/HIGGSFIELD-AVATAR-21-SEP.md @claude/marca-personal-carruseles-dist-deadab | Vertical/YT | J | Soul + texto: la cara va en el Soul, el prompt describe la escena; 2 generaciones con la misma cara; contraejemplo | web Higgsfield → EXISTEN imágenes reales generadas (references/marca-personal-sergio/higgsfield-avatar-21sep/*.png @claude/marca-personal-carruseles-dist-deadab) y clips higgsfield-00/01/02 (E:\) | GRABADO parcial (bloqueado por Cloudflare/sesión; entrenar Soul pide aprobación de gasto) | REESCRIBIR: dos versiones chocan (deadab «único método que da consistencia» vs codex «no prometer que sea el único») → usar la de codex | ⏰ créditos/costos |

### S4 · Rama `claude/marca-personal-carruseles-dist-deadab` (17–21 sep, NO mergeada)

| ID | Guion | Archivo @rama | Formato | Aud. | Qué enseña (concreto) | Pantalla real necesaria → ¿existe? | Estado (evidencia) | Veredicto | ⏰ vence · versiones/duplicados |
|---|---|---|---|---|---|---|---|---|---|
| S4-01 | F1 pilar «Un archivo de reglas. Los dos agentes» (AGENTS.md) | docs/cola/GUIONES-DIA-21-SEP.md @claude/marca-personal-carruseles-dist-deadab | Vertical · pilar Samuel ~75 s | J | Claude Code lee AGENTS.md sólo si el proyecto no tiene CLAUDE.md; línea `@AGENTS.md` dentro de CLAUDE.md | changelog oficial + CLAUDE.md y AGENTS.md lado a lado + /claude-code → sin captura; la máquina tenía 2.1.267 | ESCRITO | MANTENER: re-verificar el changelog y actualizar Claude Code antes de grabar pantalla | ⏰ versión 2.1.277; cortar «5.270 / pedido #1» |
| S4-02 | F2 «El verde que miente» | docs/cola/GUIONES-DIA-21-SEP.md @claude/marca-personal-carruseles-dist-deadab | Vertical · Feed normal 35 s | J | grep y HTTP 200 dan verde con la pantalla rota; «si el instrumento puede dar verde con la cosa rota, está roto» | EXISTE demo: carousels/out/yt-04-verificar/demo-falso-verde/{demo.sh,login.html,prueba3-mirala.png} @claude/marca-personal-carruseles-dist-deadab (reproducción local del bug real) | ESCRITO | MANTENER: decir en cámara que es una reproducción, no la pantalla de producción | Versión vieja = S4-10 (C) |
| S4-03 | T4 yap «AGENTS.md leído del changelog» (Samuel) | docs/cola/GUIONES-DIA-21-SEP.md @claude/marca-personal-carruseles-dist-deadab | Vertical · yap ~45 s | J | mismo matiz que F1, leyendo el changelog textual | changelog | ESCRITO | MANTENER (réplica por diseño) | ⏰ |
| S4-04 | V1 «La regla que se desobedece» | docs/cola/GUIONES-DIA-21-SEP.md @claude/marca-personal-carruseles-dist-deadab | Vertical · Trial v2 | J | escribir cada regla con el caso que la originó (fecha incluida) | plano real del CLAUDE.md con la regla y su historia (sumar) | ESCRITO | MANTENER + 1 plano real del archivo | Versión vieja S4-10 (A) decía «días», inventado |
| S4-05 | V2 «Terminar no es lograr» | docs/cola/GUIONES-DIA-21-SEP.md @claude/marca-personal-carruseles-dist-deadab | Vertical · Trial v2 | J | un proceso verde puede no haber hecho nada (lista vacía; «undefined» / «fila agregada») | log real del caso (handoff onia-dev-node-setup §5 ítem 11) | ESCRITO | MANTENER | Versión vieja S4-10 (B) |
| S4-06 | V3 «El número que nunca volví a contar» | docs/cola/GUIONES-DIA-21-SEP.md @claude/marca-personal-carruseles-dist-deadab | Vertical · Trial v2 | J | recontar antes de afirmar: «4 en mi casa» eran 40 en el VPS y 0 en casa | `crontab -l` real en VPS y casa | ESCRITO | MANTENER: recontar el día; decisión de Sergio Urcullo sobre admitir el error del YT 03 | ⏰ 40/0 |
| S4-07 | V4 «18 anotados, y sólo 4 de una sesión» | docs/cola/GUIONES-DIA-21-SEP.md @claude/marca-personal-carruseles-dist-deadab | Vertical · Trial v2 | J | la IA se autocorrige mucho; lo que muerde es lo que nadie revisó | el §5 real del handoff (opcional) | ESCRITO | MANTENER | ⏰ 18/4 |
| S4-08 | D «Mi instrumento decía 4. Eran 3.» | docs/cola/GUIONES-DIA-21-SEP.md @claude/marca-personal-carruseles-dist-deadab §encolado | Vertical · Trial v2 | J | `ls *.md \| wc -l` cuenta el README: mirar qué cuenta el instrumento | terminal `ls .claude/agents/` | ESCRITO | MANTENER (corto y concreto) |  |
| S4-09 | Carrusel apple MISMO-PRECIO (Fable 5.1 vs GPT-6 Astra) | docs/cola/PARA-PUBLICAR-SEMANA-22-APPLE.md + carousels/out/apple-mismo-precio-inter @claude/marca-personal-carruseles-dist-deadab | Carrusel 6 | J | mismo precio por token → elegir por forma de trabajar; probar una semana con la misma tarea | no necesita | RENDERIZADO (agendado lun 22; sin evidencia de publicación) | DESCARTAR: noticia del 1–4 sep vencida | ⏰ precios Fable/Astra (Fable 5.1 = US$10/50 según referencia; Astra no verificado) |
| S4-09b | Carrusel apple AGENTS-MD | docs/cola/PARA-PUBLICAR-SEMANA-22-APPLE.md + carousels/out/apple-agents-md-inter @claude/marca-personal-carruseles-dist-deadab | Carrusel 6 | J | Claude Code lee AGENTS.md sólo si no hay CLAUDE.md; `@AGENTS.md` | no necesita | RENDERIZADO (agendado mar 23) | MANTENER (re-verificar changelog) | ⏰ versión |
| S4-09c | Carrusel apple INSTRUMENTO-ROTO | docs/cola/PARA-PUBLICAR-SEMANA-22-APPLE.md + carousels/out/apple-instrumento-roto-inter @claude/marca-personal-carruseles-dist-deadab | Carrusel 6 | J | dos verdes (grep, HTTP 200) sobre una pantalla rota; la regla que salió | no necesita | RENDERIZADO (agendado mié 24) | MANTENER (versión corregida) |  |
| S4-09d | Carrusel apple DATO-HEREDADO | docs/cola/PARA-PUBLICAR-SEMANA-22-APPLE.md + carousels/out/apple-dato-heredado-inter @claude/marca-personal-carruseles-dist-deadab | Carrusel 6 | J | recontar antes de afirmar (4 → 40) | no necesita | RENDERIZADO (agendado jue 25) | REESCRIBIR: la tabla de la cola todavía dice «repetido 5 veces», dato que la misma cola declara sin fuente — mirar la lámina | ⏰ 40/0 |
| S4-09e | Carrusel apple 18-ERRORES | docs/cola/PARA-PUBLICAR-SEMANA-22-APPLE.md + carousels/out/apple-errores-18-inter @claude/marca-personal-carruseles-dist-deadab | Carrusel 6 | J | 18 anotados, 4 de una sola sesión; lo que muerde es lo que nadie miró | no necesita | RENDERIZADO (agendado vie 26) | MANTENER (cuidar «autodetectados» vs «anotados») | La agenda lun 22–vie 26 choca con la de codex (S1-38/39/40, S5-01, S5-09) |
| S4-10 (3) | GUIONES-GUARDADOS A/B/C (18-sep) | docs/cola/GUIONES-GUARDADOS-PROXIMO-DIA.md @claude/marca-personal-carruseles-dist-deadab | Vertical ×3 | J | = V1, V2 y F2 | — | ESCRITO | DESCARTAR: versiones viejas de S4-04/05/02 (traen «días», sin fuente) | Dup |
| S4-11 | Cola semana 22 v2: NOTICIA-WHATSAPP (precios WhatsApp 1-oct) | docs/cola/PARA-PUBLICAR-COLA-SEMANA-22.md + out/apple-noticia-whatsapp-inter @claude/marca-personal-carruseles-dist-deadab | Carrusel 6 | D/J | responder dentro de la ventana es gratis; plantillas se cobran; 72 h gratis si arranca desde anuncio; revisar plantillas antes del 1-oct | doc oficial de precios de Meta (leída 17-sep) | RENDERIZADO | REESCRIBIR: publicar antes del 1-oct sólo releyendo la fuente ese día; si no, DESCARTAR | ⏰ 1-oct |
| S4-12 | Cola semana 22 v2: CUADERNO-EXCEL | idem + out/apple-cuaderno-excel-inter @claude/marca-personal-carruseles-dist-deadab | Carrusel 6 | D/J | prompt literal: foto del cuaderno → tabla fecha/cliente/monto, marcar «debe», sumar fiado; revisar números | una prueba real foto→tabla (sumarla) | RENDERIZADO | MANTENER (y grabar la prueba real como corto) |  |
| S4-13 | Cola semana 22 v2: APP-ESCRITORIO | idem + out/apple-app-escritorio-inter @claude/marca-personal-carruseles-dist-deadab | Carrusel 5 | J | Claude Code tiene app de escritorio; el plan gratis no incluye Claude Code | app real | RENDERIZADO | MANTENER | ⏰ planes |
| S4-14 (3) | Carruseles de tesis regla-74 · tres-preguntas · falla-solo | idem (fuera de cola) + out/apple-* @claude/marca-personal-carruseles-dist-deadab | Carrusel ×3 | J | tesis sin dato (Sergio: «no enseñan nada interesante») | — | RENDERIZADO | DESCARTAR (ya descartados por Sergio Urcullo 17-sep) |  |
| S4-15 (5) | Renders viejos sergio-*-20260921 (5) | carousels/briefs/sergio-*-20260921.json + out/sergio-*-20260921 @claude/marca-personal-carruseles-dist-deadab | Carrusel 7 ×5 | J | = S4-09 con datos falsos («18 en una sesión», «tres veces», «días», «5.270», «cinco veces») | — | RENDERIZADO | DESCARTAR: reemplazados por los apple-* | Dup |

### S5 · main · cola del 21-sep (Codex) y sus carruseles

| ID | Guion | Archivo @rama | Formato | Aud. | Qué enseña (concreto) | Pantalla real necesaria → ¿existe? | Estado (evidencia) | Veredicto | ⏰ vence · versiones/duplicados |
|---|---|---|---|---|---|---|---|---|---|
| S5-01 | Carrusel «Antes de usar n8n, elegí qué automatizar» (matriz) | docs/cola/GUIONES-DIA-2026-09-21.md @main §carrusel + carousels/out/sergio-matriz-n8n-20260921 (+zip) | Carrusel 8 | J/D | entrada → regla → salida → excepción con Webhook, IF, Sheets/Append Row, Telegram/Send Message; puntuar repetición·minutos·claridad·costo del error | no necesita | RENDERIZADO (PARA-PUBLICAR-CARRUSELES-2026-09-21: casilla «publicado» sin marcar) | MANTENER | Recurso /automatizar sólo en @codex/sergio-vault-growth |
| S5-02 | G1 «n8n: Webhook → IF → Google Sheets → Telegram para no perder leads» | docs/cola/GUIONES-DIA-2026-09-21.md @main §1 | Vertical · Feed normal | J/D | flujo determinista de 4 nodos; la rama falsa pide el dato faltante | n8n real con ambas ramas del IF → handoff EDICION-MARCA-PERSONAL-2026-09-21: «esperando material bruto» | ESCRITO (sin bruto al 21-sep) | MANTENER (el «hola mundo» de n8n; complementa a S1-02) |  |
| S5-03 | G2 «Cómo mapear un lead» (4 campos) | docs/cola/GUIONES-DIA-2026-09-21.md @main §2 | Vertical · Trial v2 | J | plantilla ENTRADA/DECISIÓN/SALIDA/EXCEPCIÓN | texto en pantalla | ESCRITO | DESCARTAR: duplica S5-02 y S5-01 | Dup |
| S5-04 | G3 «n8n AI Agent: clasificá leads sin dejar que la IA responda sola» | docs/cola/GUIONES-DIA-2026-09-21.md @main §3 | Vertical · Trial v2 | J | AI Agent + OpenAI → IF requiere_humano | canvas | ESCRITO | DESCARTAR: contradice S1-02 (22-sep): para clasificar se usa LLM Chain + parser, no AI Agent | Contradicción |
| S5-05 | G4 «Automatización, AI Agent o loop: elegí con herramientas reales» | docs/cola/GUIONES-DIA-2026-09-21.md @main §4 | Vertical · Trial v2 | J | IF / AI Agent / Schedule+HTTP+IF+Wait | texto en pantalla | ESCRITO | DESCARTAR: misma contradicción; superado por S1-01/S1-06 | Contradicción |
| S5-06 | G5 «MCP en Claude Code: conectá Notion sin darle permiso para todo» | docs/cola/GUIONES-DIA-2026-09-21.md @main §5 | Vertical · Trial v2 | J | `claude mcp add --transport http notion https://mcp.notion.com/mcp`, `claude mcp list`, `/mcp`; contrato de sólo lectura | terminal real conectando Notion (OAuth) → sin captura | ESCRITO | REESCRIBIR: el JSON `permissions: ["read"]` no es la forma MCP; usar inputSchema/annotations como S1-05 | ⏰ comando/URL de Notion MCP |
| S5-07 | G6 «n8n: loop con Wait, IF y límite de intentos» | docs/cola/GUIONES-DIA-2026-09-21.md @main §6 | Vertical · Trial v2 | J | Schedule → HTTP → IF paid → Wait → attempt ≥ 3 | canvas | ESCRITO | DESCARTAR: superado por S1-04 (que conserva attempt) | Dup |
| S5-08 | Drop del día 21-sep «Qué automatizar primero» | docs/cola/GUIONES-DIA-2026-09-21.md @main §Drop | Drop | J/D | plantilla entrada/herramienta/decisión/salida/excepción + ejemplo Webhook→IF→Sheets→Telegram | no | ESCRITO (envío no confirmado) | MANTENER |  |
| S5-09 | Carrusel «Automatización, AI Agent o loop» | carousels/out/sergio-agente-loop-20260921 (+brief, PUBLICAR.md) @main | Carrusel 7 | J | IF para reglas fijas; AI Agent para clasificar lenguaje; loop para estado que cambia | no necesita | RENDERIZADO (agendado sáb 26 por ENTREGA-CARRUSELES) | REESCRIBIR láminas 3–4 (AI Agent para clasificar contradice S1-02) |  |
| S5-10 | Carrusel «MCP en Claude Code: conectá Notion con permisos» | carousels/out/sergio-mcp-claude-code-20260921 @main | Carrusel 7 | J | comando literal de Notion MCP, `claude mcp list`, `/mcp`, input/output/permiso | no necesita | RENDERIZADO | MANTENER (re-verificar comando/URL) | ⏰ |
| S5-11 (3) | 3 aperturas de YouTube (leads n8n · Claude Code sin perder control · MCP/agentes/loops) | docs/cola/GUIONES-DIA-2026-09-21.md @main §Aperturas | YouTube (ideas) | J | temas | — | IDEA | DESCARTAR: ya desarrolladas en S1-31/32/33 | Dup |

### S6 · main (+deadab) · YouTube: serie «Claude Code de cero» y largos propuestos

| ID | Guion | Archivo @rama | Formato | Aud. | Qué enseña (concreto) | Pantalla real necesaria → ¿existe? | Estado (evidencia) | Veredicto | ⏰ vence · versiones/duplicados |
|---|---|---|---|---|---|---|---|---|---|
| S6-01 | YT 01 «Claude y Claude Code no son lo mismo» | docs/yt/VIDEO-01-QUE-ES-CLAUDE.md + carousels/out/yt-01-que-es + videos/claude-vs-claudecode @main | YouTube 7:10 | J | chat vs agente con acceso a tu máquina, con demo | demo real (grabada) | PUBLICADO 09-sep (youtu.be/kAsAhGe6zyA) | MANTENER (el doc VIDEO-01 aún dice «sin grabar»: estado viejo) |  |
| S6-02 | YT 02 «Instalá Claude Code en 2 minutos» + primera skill | carousels/out/yt-02-instalar @main | YouTube 13:57 | J | instalación y primera skill | pantalla real | PUBLICADO 10-sep (oXaqV-HDufA) | MANTENER | ⏰ método de instalación |
| S6-03 | YT 03 «Hago que la IA trabaje mientras duermo» | carousels/out/yt-03-sin-vos/GUION.md @main (viejo) · yt-claude-code-automatizacion/GUION.md @claude/marca-personal-carruseles-dist-deadab (18-sep, corregido) | YouTube ~6:36 | J | hooks, subagentes, conectores, trabajos por horario | deck + pantallas | PUBLICADO 18-sep (8iMRBo7ppac) | MANTENER (publicado). Pendientes de Sergio Urcullo: desliz 2:31 «cuatro» vs 4:44 «tres» subagentes; confirmar escuchando si dijo «4 trabajos en la PC de casa» (falso) | Versiones: e05b78cc (10-sep) → main 27edab4b (dato falso) → deadab 3c82aa21 (última) |
| S6-04 | YT 04 «La IA te dice “listo” y te está mintiendo» | carousels/out/yt-04-verificar/{GUION.md,LISTO-PARA-GRABAR.md,demo-falso-verde/} @claude/marca-personal-carruseles-dist-deadab (última) · GUION.md @main (viejo) | YouTube ~8 min | J | ¿lo miré? ¿cuánto salió? ¿lo conté hoy?; terminar ≠ lograr; demo del falso verde; regla + historia | demo-falso-verde (reproducción local) → EXISTE en la rama | ESCRITO (listo para grabar, cifras recontadas 21-sep) | MANTENER la versión deadab; DESCARTAR la de main («12 errores en una sesión», dato central falso) | ⏰ 18/4, «16 años» |
| S6-05 | YT 05 «No escribas nada: casi todo ya está hecho y es gratis» | carousels/out/yt-05-no-construyas/GUION.md @main (= deadab) | YouTube ~8 min | J | orden de confianza oficial → empresas → comunidad; instalar un plugin de punta a punta en vivo; leer antes de instalar | instalación real sin cortes (lámina 6) + repos en GitHub | ESCRITO (el handoff dice «guion NO»: desactualizado) | MANTENER: recontar [N]/[M]/[K] y «197 piezas» (sin fuente) el día | ⏰ nombres de repos |
| S6-06 | YT 06 «Tengo 16 años y mi empresa entera corre con IA» | carousels/out/yt-06-mi-empresa/GUION.md @main | YouTube ~11 min | J | 3 capas del sistema, un día, worktrees y «anotá el punto de partida», costos | crontab, panel de uso, etc. | ESCRITO | REESCRIBIR: dice «una PC prendida en mi casa» y «cero dólares la PC de casa»; el 18-sep se midió 0 trabajos en casa y 40 en el VPS pago | ⏰ edad, US$40/US$200 |
| S6-07 | Largo experimento E1 «Le pido una página web a la IA y la cronometramos» | docs/cola/GUIONES-RODAJE-17-20-SEP.md §E1 @main | YouTube 8–12 min | J | experimento en vivo: prompt, lectura, diff, error en vivo, reloj, revisión, costo | Claude Code en vivo + navegador | IDEA (capítulos) | MANTENER |  |
| S6-08 | Largo experimento E2 «Mi servidor es una PC vieja de $0» | idem §E2 | YouTube 10–15 min | J | specs, htop, carga, consumo | la máquina real | IDEA | DESCARTAR: la premisa cayó (nodo de casa sin trabajos; todo corre en VPS pago) |  |
| S6-09 | Largo experimento E3 «Dejo a la IA trabajando toda la noche y revisamos qué hizo» | idem §E3 | YouTube 10–12 min | J | cola escrita en vivo → cron → revisión sin editar de commits/logs → costo de la noche | cola, cron, commits y logs reales | IDEA | MANTENER |  |
| S6-10 | YT «Cómo armé el sistema que hace andar mi empresa por $200 al mes» | docs/cola/GUIONES-SEMANA-1-MI-STACK.md §7 @main | YouTube 12–15 min | J/D | 6 herramientas instaladas en pantalla, con «lo que NO hace» | máquina real | IDEA (estructura) | REESCRIBIR: «PC vieja como servidor» cayó; solapa con S6-06 |  |

### S7 · main · GUIONES-RODAJE-17-20-SEP (cortos) — con los 4 TikToks editados

| ID | Guion | Archivo @rama | Formato | Aud. | Qué enseña (concreto) | Pantalla real necesaria → ¿existe? | Estado (evidencia) | Veredicto | ⏰ vence · versiones/duplicados |
|---|---|---|---|---|---|---|---|---|---|
| S7-01 | 17.1 «Claude Code por dentro» | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical/TikTok | J | ciclo pedido → lectura de archivos → diff → aprobación | terminal real → EDITADO: videos/tiktok-20260917 → tiktok-03-como-funciona.mp4 (37,9 s, E:\ONIA-YouTube\tiktoks\) | EDITADO (sin música; publicación no confirmada) | MANTENER |  |
| S7-02 | 17.2 «Skills: enseñale TU forma de trabajar, una vez» | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical/TikTok | J | una skill es un archivo de texto; SKILL.md real de propuestas | EDITADO tiktok-01-skills.mp4 (55,9 s) | EDITADO | MANTENER; revisar el CTA «SKILL» (no hay recurso cableado) |  |
| S7-03 | 17.3 «Una IA que toca tus archivos necesita reglas ESCRITAS» | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical/TikTok | J | 3 cláusulas del CLAUDE.md (plata no, mirar, regla + historia) | EDITADO tiktok-02-claude-md-3-reglas.mp4 (54,5 s) | EDITADO | MANTENER |  |
| S7-04 | 17.4 pool «anthropics/skills» | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical/TikTok (split) | J | repo oficial de skills; leer antes de instalar | EDITADO tiktok-04-repo-skills-oficiales.mp4 (50,3 s) | EDITADO | MANTENER | ⏰ «14 más» (conteo del repo) |
| S7-05 | 18.1 «Mi feed lo produce un sistema, no una persona» | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical | J | reparto código / IA / criterio; script de placas; HTML→MP4 | script corriendo + HTML→MP4 | ESCRITO | REESCRIBIR: «8 hechas · 3 tiradas» sin conteo; al 10-sep no había nada publicado |  |
| S7-06 | 18.2 «Dónde la IA suma en video y las dos cosas que tiene prohibidas» | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical | J | transcripción con tiempos, corte de silencios, subtítulos; prohibido cara generada y voz clonada | transcripción y corte reales | ESCRITO | REESCRIBIR: «mi cara generada, prohibida» choca con el avatar Higgsfield (S3-10) — decidir postura antes |  |
| S7-07 | 18.3 «La IA como empleado: cuánto rinde, y la cuenta» | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical | J | producción vs US$200/mes; ejecuta ≠ decide | panel de uso real | ESCRITO | REESCRIBIR: recontar el día (lista y costo) | ⏰ US$200 |
| S7-08 | 18.4 pool «plugins oficiales» (o reel Fable) | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical | J | claude-plugins-official; instalar uno en vivo | instalación real | IDEA (1 línea) | MANTENER: escribirlo completo |  |
| S7-09 | 19.1 «Agentes que vigilan: cómo decide que algo está roto» | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical | J | loop → comparación → aviso; avisa, no arregla | el aviso real de las 3:01 con la hora → no hay captura en el repo | ESCRITO | MANTENER*: sólo si existe la captura real del aviso | Dup S8-07, S8-17 |
| S7-10 | 19.2 «El alma de un agente — te la leo» (SOUL.md) | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical | J | la sección «Lo que NO hacés» se escribe primero | SOUL.md real | ESCRITO | MANTENER |  |
| S7-11 | 19.3 «Cuánto cuesta un agente 24/7» | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical | J | $0 programa · $0 casa · $40 servidor · centavos por vuelta; 74 % un trabajo mal configurado | números en pantalla | ESCRITO | REESCRIBIR: «máquina de casa: cero» cayó; recontar costos | ⏰ |
| S7-12 | 19.4 pool «ponytail + caveman» | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical | J | dos plugins; respuesta antes/después | antes/después real | IDEA (1 línea) | MANTENER*: con antes/después real y repos recontados | ⏰ repos |
| S7-13 | 20.1 «La IA multiplica lo que ya sabés hacer» | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical | J | opinión + orden de herramientas | /stack | ESCRITO | REESCRIBIR: poca acción concreta |  |
| S7-14 | 20.2 «Publiqué [N] piezas esta semana — números honestos» | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical | J | métricas de la semana | métricas reales | IDEA | DESCARTAR: dependía de una semana publicada que no consta |  |
| S7-15 | 20.3 interactivo «Contame UN proceso de tu negocio» | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical | D/J | veces × minutos; recordatorio de cobro = loop de 2 nodos, sin IA | flujo de 2 nodos armándose | ESCRITO | MANTENER |  |
| S7-16 | 20.4 pool «Understand-Anything» | docs/cola/GUIONES-RODAJE-17-20-SEP.md @main | Vertical | J | convertir un proyecto en grafo recorrible | grafo generándose sobre proyecto real | IDEA (1 línea) | MANTENER* | ⏰ repo |

### S8 · main · Semana 1 «Mi stack» (10-sep), Tanda 2 (18-sep) y PLAN-VIDEOS 11–20

| ID | Guion | Archivo @rama | Formato | Aud. | Qué enseña (concreto) | Pantalla real necesaria → ¿existe? | Estado (evidencia) | Veredicto | ⏰ vence · versiones/duplicados |
|---|---|---|---|---|---|---|---|---|---|
| S8-01 | MS §0 «Mi empresa entera corre con seis herramientas» | docs/cola/GUIONES-SEMANA-1-MI-STACK.md @main | Vertical | J/D | índice de 6 herramientas | ráfaga de pantallas reales | ESCRITO | REESCRIBIR: «una PC vieja que hace de servidor» cayó |  |
| S8-02 | MS §1 WhatsApp Business (cortado) | docs/cola/GUIONES-SEMANA-1-MI-STACK.md @main | Vertical | D | respuestas rápidas | app real | ESCRITO | DESCARTAR: cortado por Sergio Urcullo el 10-sep (queda el drop) |  |
| S8-03 | MS §2 «El servidor» | docs/cola/GUIONES-SEMANA-1-MI-STACK.md @main | Vertical | J | Ubuntu Server en una PC vieja (4 GB / 40 GB) | la máquina real (hoy sin trabajos) | ESCRITO | REESCRIBIR: mostrar la real o no hacerlo |  |
| S8-04 | MS §3 «n8n» | docs/cola/GUIONES-SEMANA-1-MI-STACK.md @main | Vertical | J | empezar con UN flujo; no adivina | flujo real funcionando | ESCRITO | MANTENER |  |
| S8-05 | MS §4 «Claude Code» | docs/cola/GUIONES-SEMANA-1-MI-STACK.md @main | Vertical | J | Claude Code ≠ chat; el plan gratis no lo incluye | terminal real | ESCRITO | MANTENER (solapa con S7-01 ya editado) | ⏰ planes |
| S8-06 | MS §5 «HyperFrames» | docs/cola/GUIONES-SEMANA-1-MI-STACK.md @main | Vertical | J | HTML → MP4; «salteálo si no publicás video» | split HTML/MP4 real | ESCRITO | MANTENER |  |
| S8-07 | MS §6 «Hermes» | docs/cola/GUIONES-SEMANA-1-MI-STACK.md @main | Vertical | J | agente que avisa; SOUL.md | aviso real con hora | ESCRITO | MANTENER* (misma condición que S7-09) | Dup |
| S8-08 | MS §8a promesa /homelab | docs/cola/GUIONES-SEMANA-1-MI-STACK.md @main | Vertical | J | guía /homelab | máquina real | ESCRITO | REESCRIBIR: misma premisa caída |  |
| S8-09 | MS §8b promesa /stack | docs/cola/GUIONES-SEMANA-1-MI-STACK.md @main | Vertical | J | guía /stack | guía en el teléfono | ESCRITO | MANTENER (verificar la guía viva) |  |
| S8-10 | Tanda 2 ① carrusel «Los 4 escalones para que trabaje sin vos» | docs/cola/GUIONES-TANDA-2-18-SEP.md @main | Carrusel 7 | J | hooks, subagentes, conectores, horarios | láminas del deck YT 03 | IDEA (sin render) | DESCARTAR: duplica el YT 03 |  |
| S8-11 | Tanda 2 ② pilar «Le pagué 200 dólares a una IA y esto hizo en 30 días» (Samuel) | docs/cola/GUIONES-TANDA-2-18-SEP.md @main | Vertical · pilar | J | producción vs costo; ejecuta ≠ decide | ráfaga de pantallas reales | ESCRITO | REESCRIBIR: recontar la lista y el costo | ⏰ |
| S8-12 | Tanda 2 ③ «Mientras dormía, cuatro agentes editaron cuatro videos» | docs/cola/GUIONES-TANDA-2-18-SEP.md @main | Vertical · Feed normal | J | subagente real: 4 en paralelo, cada uno verifica mirando fotogramas | las 4 tareas + reporte (el lote existe: videos/tiktok-20260917) | ESCRITO | MANTENER; cambiar el CTA «SUBAGENTE» (sin recurso) |  |
| S8-13 | Tanda 2 ④ «El error que te va a pasar cuando automatices» | docs/cola/GUIONES-TANDA-2-18-SEP.md @main | Vertical | J | verde ≠ hecho; avisar cuando falla; contar lo que salió | log verde real | ESCRITO | REESCRIBIR: «3 semanas en cero» sin fuente citada |  |
| S8-14 | Tanda 2 ⑤ «El comando que revisa tu proyecto antes de tocarlo» (hooks) | docs/cola/GUIONES-TANDA-2-18-SEP.md @main | Vertical | J | hook previo en settings.json | settings.json real | ESCRITO | MANTENER: recontar (hoy 4 hooks, el guion dice 3) | ⏰ |
| S8-15 | Tanda 2 ⑥ «La palabra que tu IA no escucha» | docs/cola/GUIONES-TANDA-2-18-SEP.md @main | Vertical · Trial v2 | J | Whisper borra muletillas; detectarlas por energía de audio | waveform real | ESCRITO | MANTENER (recontar «83») |  |
| S8-16 | Tanda 2 ⑦ «Por qué no contrato a nadie todavía» | docs/cola/GUIONES-TANDA-2-18-SEP.md @main | Vertical · Trial v2 | J | margen vs clientes; el cuello es soporte | — | ESCRITO | MANTENER |  |
| S8-17 | Tanda 2 ⑧ «Facturación electrónica: lo que nadie te dijo del plazo» | docs/cola/GUIONES-TANDA-2-18-SEP.md @main | Vertical · Trial v2 | D | portal gratis del SIN; certificado y punto de venta antes | — | ESCRITO | DESCARTAR: fuera de audiencia y plazos que vencen | ⏰ fiscal |
| S8-18 (3) | PLAN-VIDEOS vie 11 (3 temas con texto: vigila, plata, una suscripción) | docs/cola/PLAN-VIDEOS-11-20-SEP.md @main (última: @claude/marca-personal-carruseles-dist-deadab) | Vertical ×3 | J | agente vs chat; 3 reglas; techo de gasto | — | ESCRITO | DESCARTAR: «vive en una PC en mi casa» / «PC vieja gratis» cayeron; superados por S7 |  |
| S8-19 (7) | PLAN-VIDEOS sáb 12 «los 7 finales» (WhatsApp solo, claude-mem, página delante mío, b-roll, primer loop, Cal.com, cuaderno→Excel) | docs/cola/PLAN-VIDEOS-11-20-SEP.md @main (última: @claude/marca-personal-carruseles-dist-deadab) | Vertical ×7 | J/D | funciones/apps concretas | placas out/placas-sab12/*.png (existen); el guion literal NO está en el repo («en el mensaje de la sesión») | IDEA en repo | REESCRIBIR: reconstruir los guiones si se quieren usar |  |
| S8-20 (24) | PLAN-VIDEOS dom 13 → dom 20 (≈24 temas) | docs/cola/PLAN-VIDEOS-11-20-SEP.md @main (última: @claude/marca-personal-carruseles-dist-deadab) | Vertical | J/D | títulos | — | IDEA | DESCARTAR como fuente: bajados a rodaje en S7 | Dup |

### S9 · main · Drops de la comunidad

| ID | Guion | Archivo @rama | Formato | Aud. | Qué enseña (concreto) | Pantalla real necesaria → ¿existe? | Estado (evidencia) | Veredicto | ⏰ vence · versiones/duplicados |
|---|---|---|---|---|---|---|---|---|---|
| S9-01 | D0 bienvenida + paquete de arranque (Avisos, General, Biblioteca, historias, LinkedIn/X) | docs/cola/PARA-PUBLICAR-2026-09-02.md + drops/2026-09-02.md @main | Drop + historias + posts | J/D | 2 cursos gratis con certificado | no | ENVIADO (ONIA_COMUNIDAD_CONTENIDO: serie D0–D6 «cumplida») | MANTENER (histórico) |  |
| S9-02 | D1 Claude Code (03-sep) | docs/cola/drops/2026-09-03.md @main | Drop | J/D | instalar y probar un pedido | no | ENVIADO | REESCRIBIR si se reusa: usa `npm install -g`; el drop del 17-sep usa el instalador nativo | ⏰ |
| S9-03 | D2 Los 5 prompts de negocio | drops/2026-09-04.md @main | Drop | D/J | 5 prompts copiables | no | ENVIADO | MANTENER |  |
| S9-04 | D3 Tu primera automatización | drops/2026-09-05.md @main | Drop | D/J | tabla veces × minutos; «si se escribe como instrucción, se automatiza» | no | ENVIADO | MANTENER |  |
| S9-05 | D4 Las habilidades de Claude | drops/2026-09-06.md @main | Drop | D/J | skill = instrucción escrita una vez; ejercicio de 10 min | no | ENVIADO | MANTENER |  |
| S9-06 | D5 Fotos de producto sin fotógrafo | drops/2026-09-07.md @main | Drop | D | foto de celular → catálogo; advertencia del plan anual | imagen real [TU EJEMPLO] (pendiente) | ENVIADO (hueco sin llenar) | REESCRIBIR si se reusa: falta el ejemplo real |  |
| S9-07 | D6 Contame tu negocio | drops/2026-09-08.md @main | Drop | D | 3 líneas para diagnosticar por dónde empezar | no | ENVIADO | MANTENER |  |
| S9-08 | Beneficio «15 minutos conmigo» | drops/2026-09-13.md @main | Drop | J/D | no enseña (beneficio) | no | ESCRITO | REESCRIBIR: verificar cal.com/sergiourcullo/15min (el 21-sep /30min daba 404) | ⏰ link |
| S9-09 | S1·D1 Las seis respuestas que no volvés a escribir | docs/cola/drops/2026-09-14.md @main | Drop + archivo | D | WhatsApp Business → respuestas rápidas; la 6ª «/cierro» pide la decisión | no (entrega archivo de /stack/archivos o /homelab/archivos) | ESCRITO (envío no confirmado) | MANTENER |  |
| S9-10 | S1·D2 La PC que tenés guardada es un servidor | docs/cola/drops/2026-09-15.md @main | Drop + archivo | J | Ubuntu Server + primer-arranque.sh (zona horaria, Docker, firewall, parches) | no (entrega archivo de /stack/archivos o /homelab/archivos) | ESCRITO (envío no confirmado) | MANTENER (no afirmar que el nodo de Sergio corre) |  |
| S9-11 | S1·D3 El empleado que trabaja mientras dormís (n8n) | docs/cola/drops/2026-09-16.md @main | Drop + archivo | J | docker-compose.yml; `docker compose up -d`; empezar con UN flujo | no (entrega archivo de /stack/archivos o /homelab/archivos) | ESCRITO (envío no confirmado) | MANTENER |  |
| S9-12 | S1·D4 Claude Code: la única que pago | docs/cola/drops/2026-09-17.md @main | Drop + archivo | J | instalador nativo, `claude --version`, `claude doctor`; el plan gratis no lo incluye | no (entrega archivo de /stack/archivos o /homelab/archivos) | ESCRITO (envío no confirmado) | MANTENER | ⏰ comandos/planes |
| S9-13 | S1·D5 Video sin abrir un editor (HyperFrames) | docs/cola/drops/2026-09-18.md @main | Drop + archivo | J | `npx hyperframes@latest --help` + composición mínima | no (entrega archivo de /stack/archivos o /homelab/archivos) | ESCRITO (envío no confirmado) | MANTENER | ⏰ comandos/planes |
| S9-14 | S1·D6 El que avisa cuando algo se rompe (Hermes) | docs/cola/drops/2026-09-19.md @main | Drop + archivo | J | plantilla SOUL.md con «Lo que NO hacés» primero | no (entrega archivo de /stack/archivos o /homelab/archivos) | ESCRITO (envío no confirmado) | MANTENER |  |
| S9-15 (7) | Drops de reserva «qué automatizar primero» (lun–dom, 7) | docs/ONIA_COMUNIDAD_CONTENIDO.md §Drops de reserva @main | Drops ×7 | D | n8n, prompt cotizador, reto 10 min, caso, checklist 5 preguntas, la más pedida, cierre | no | ESCRITO (con huecos [ejemplo real]) | REESCRIBIR: llenar huecos; se solapan con S1-41/S5-08 |  |

### S10 · main · marca personal temprana (31-ago/02-sep) y carruseles/imágenes de septiembre

| ID | Guion | Archivo @rama | Formato | Aud. | Qué enseña (concreto) | Pantalla real necesaria → ¿existe? | Estado (evidencia) | Veredicto | ⏰ vence · versiones/duplicados |
|---|---|---|---|---|---|---|---|---|---|
| S10-01 | Semana1 A «Reunión de directorio» | docs/ONIA_MARCA_PERSONAL_SEMANA1.md @main | Vertical humor | J | nada concreto | — | ESCRITO (grabación no consta) | DESCARTAR: no enseña |  |
| S10-02 | Semana1 B «Guardá esto antes de pagarle a una agencia» | docs/ONIA_MARCA_PERSONAL_SEMANA1.md @main | Vertical | D | 3 cosas genéricas con IA | — | ESCRITO | REESCRIBIR: sin herramienta ni paso literal |  |
| S10-03 | Semana1 C interactivo «Decime tu negocio» | docs/ONIA_MARCA_PERSONAL_SEMANA1.md @main | Vertical | D | no enseña (pide comentarios) | — | ESCRITO | DESCARTAR |  |
| S10-04 | Semana1 D «Mi servidor se arregla solo» | docs/ONIA_MARCA_PERSONAL_SEMANA1.md @main | Vertical | J | cron cada 10 min revisa y levanta servicios; aviso Telegram | `crontab -l` + Telegram real | ESCRITO | REESCRIBIR: contradice «avisa, no arregla» y las cifras cambiaron | ⏰ |
| S10-05 | Semana1 E «Hoy despedí a mi diseñador. Era yo.» | docs/ONIA_MARCA_PERSONAL_SEMANA1.md @main | Vertical | J | Higgsfield CLI: `generate cost` antes de `create` (0,12 cr) | terminal real | ESCRITO | REESCRIBIR: costo y CLI cambiaron; todo gasto pide aprobación | ⏰ créditos |
| S10-06 | Semana1 F «Tu negocio ya te está pidiendo un empleado» (venta chatbot) | docs/ONIA_MARCA_PERSONAL_SEMANA1.md @main | Vertical | D/C | capacidades del chatbot | — | ESCRITO | DESCARTAR para marca personal (no se vende Onia ahí; el chatbot es add-on) |  |
| S10-07 (6) | Semana1 historias-quiz 04–07 + 2 secuencias | docs/ONIA_MARCA_PERSONAL_SEMANA1.md @main + carousels/out/historias-quiz | Historias | J/D | quizzes de build-in-public y de dueño | no | RENDERIZADO | REESCRIBIR: cifras de cron del 02-sep ya cambiaron | ⏰ |
| S10-08 (3) | Semana1 textos X/LinkedIn (Video A/B/C) | docs/ONIA_MARCA_PERSONAL_SEMANA1.md @main | Post texto | D | — | no | ESCRITO | DESCARTAR (atados a A/B/C) |  |
| S10-09 | Carrusel «5 prompts» | carousels/out/carrusel-5-prompts @main | Carrusel 7 | J/D | 5 prompts copiables | no | RENDERIZADO | MANTENER |  |
| S10-10 (3) | Carruseles de venta en marca personal: chatbot-venta · sistema-venta · atender-clientes | carousels/out/carrusel-{chatbot-venta,sistema-venta,atender-clientes} @main | Carrusel ×3 | D/C | promesas del catálogo | no | RENDERIZADO | DESCARTAR en @sergiourcullo (no se vende Onia; chatbot como titular) |  |
| S10-11 (2) | Carruseles «5 tareas que te roban tiempo» y «Mi equipo no cobra» | carousels/out/carrusel-{tareas-automatizadas,equipo-no-cobra} + PARA-PUBLICAR-CARRUSEL-EQUIPO.md @main | Carrusel ×2 | J/D | tareas y 6 herramientas con el paso de hoy | no | RENDERIZADO | REESCRIBIR: cifras de cron del 02-sep | ⏰ |
| S10-12 (2) | Kit curso día 1 (post + 5 historias) y carrusel cursos gratis | docs/cola/PARA-PUBLICAR-CURSO-DIA1.md + carousels/out/{curso-dia1,carrusel-cursos-gratis} @main | Post + historias | J | prompt de asistente para pegar en claude.ai; 2 cursos gratis | no | RENDERIZADO (aprobado por Sergio Urcullo: «la mejor») | MANTENER |  |
| S10-13 | Lámina grid «El secreto no es la IA, es cómo se pide» | docs/cola/PARA-PUBLICAR-GRID-PEDIR.md + carousels/out/lamina-grid-pedir.png @main | Imagen | J/D | las 6 partes de un pedido con ejemplo copiable | no | RENDERIZADO | MANTENER |  |
| S10-14 (6) | Láminas grid ia · señales · mensajes y statements (mi oficina, 16 años/4 herramientas, atender 24/7) | carousels/out/lamina-grid-*.png, statement-*.png @main | Imagen ×6 | J/D | listas/frases | no | RENDERIZADO | DESCARTAR: no enseñan un paso (evaluado por título/cola, no lámina por lámina) | ⏰ edad |
| S10-15 | Apple «Fable 5.1» | docs/cola/PARA-PUBLICAR-APPLE-FABLE.md + carousels/out/apple-fable-inter @main | Carrusel 8 | J | 1 de cada 3 tareas de oficina | no | RENDERIZADO | DESCARTAR: caducó el 14-sep (regla propia) | ⏰ |
| S10-16 | Apple «Mi stack» (comunidad) | docs/cola/PARA-PUBLICAR-APPLE-MI-STACK.md @main | Carrusel 5 (comunidad) | J | US$200 y 5 de 7 gratis | no | ENVIADO a la comunidad el 10-sep | MANTENER (histórico) | 7 herramientas vs las 6 de la serie |
| S10-17 (3) | Apple «Founders bolivianos» · «Tu cuaderno no miente» · «Las seis respuestas» | docs/cola/PARA-PUBLICAR-APPLE-{FOUNDERS-BO,DUELO-CUADERNO,TRES-CUENTAS}.md @main | Imagen/carrusel ×3 | J/D | Stripe no acepta Bolivia · 3 preguntas que tu registro no contesta · la respuesta /cierro | no | RENDERIZADO (0 publicados al 10-sep) | MANTENER (el dato va en el caption) | ⏰ Stripe |
| S10-18 (2) | Apple «Seis archivos esta semana» y «Necesito vitamina C» | docs/cola/PARA-PUBLICAR-APPLE-{TRES-CUENTAS,VITAMINA-C}.md @main | Carrusel/imagen ×2 | J | ninguno (auditoría 10-sep) | no | RENDERIZADO | DESCARTAR: vitamina C tiene cifras inventadas («12 clientes · +3»); seis archivos quedó atado a una fecha vencida |  |
| S10-18b | Apple «Cuatro cosas a mano» (@oniahq) | docs/cola/PARA-PUBLICAR-APPLE-TRES-CUENTAS.md @main | Carrusel 7 | C/D | ninguno (auditoría 10-sep) | no | RENDERIZADO | REESCRIBIR: con el ángulo del tiempo y para el ICP dental, sólo módulos vivos |  |
| S10-19 | Apple «10 repos» | docs/cola/PARA-PUBLICAR-APPLE-REPOS.md + carousels/out/apple-repos-inter @main | Carrusel 8 | J | nombre de cada repo con mock de terminal | no; si el mock simula salida, reemplazar por captura real | RENDERIZADO | REESCRIBIR: recontar repos y revisar el mock | ⏰ repos |
| S10-20 (2) | Apple «¿Y a qué hora hacés todo?» (+ DIA-FOUNDER) | docs/cola/PARA-PUBLICAR-DIA.md + carousels/out/apple-dia*-inter @main | Imagen | J | calendario YO vs EL SISTEMA | no | RENDERIZADO | REESCRIBIR: Sergio Urcullo confirma bloques; recontar lo que «corre solo» |  |
| S10-21 | DM «STACK» | docs/cola/PARA-PUBLICAR-DM-STACK.md @main | Texto DM | J | lista de herramientas con el paso a paso | no | ESCRITO | REESCRIBIR: dice «las siete» (la serie son seis) y arrastra la PC de casa |  |

### S11 · ONIA / @oniahq — anuncios y carruseles para el cliente (clínicas)

| ID | Guion | Archivo @rama | Formato | Aud. | Qué enseña (concreto) | Pantalla real necesaria → ¿existe? | Estado (evidencia) | Veredicto | ⏰ vence · versiones/duplicados |
|---|---|---|---|---|---|---|---|---|---|
| S11-01 | UGC IA «¿Quién no volvió?» 27 s | campaigns/onia-platform-meta-2026-09-21/ugc-dental-30s.md (+README, storyboard) @main | Anuncio Reel/Story | C | dolor: tratamientos a medias; mecanismo: agenda + ficha + cobros + «Recall prepara, tu equipo decide»; CTA 14 días | UI real de ONIA (capturas del recorrido: paso-07d-cita-en-agenda.png, alta-inline…, paso-08-cobro.png, de scripts/recorrido_cliente.mjs; no están en este repo) → anclas de la presentadora IA sí (assets/*.png) | ESCRITO (video no generado: falta costo vivo y aprobación) | MANTENER: único guion alineado con la Etapa 1 (dental) y con la regla de publicidad | ⏰ «desde Bs [monto omitido]/mes», «14 días sin tarjeta» (coincide con el espejo del sitio; verificar contra subscription-plans.ts) |
| S11-02 | Carrusel dental v2 «¿Cuántos tratamientos quedaron a medias?» | carousels/briefs/ads/onia-platform-dental-meta-20260921-carousel.json + out/ads/…-carousel-v2-feed @main | Anuncio carrusel 8 | C | dolor → cobro frenado → seguimiento → agenda/ficha/cobros → Recall con control humano | UI real del tenant demo en láminas 4–6 (mirado en la hoja de contacto) | RENDERIZADO (campaña «no publicada») | MANTENER: revisar legibilidad de la UI a tamaño feed | ⏰ precio |
| S11-03 | Estático dental (feed y story, v1/v2) | briefs/ads/…-static.json + out/ads/…-static-* @main | Anuncio estático | C | pregunta + oferta 14 días | no | RENDERIZADO | MANTENER |  |
| S11-04 (8) | Estáticos A2–A8 (8: no volvieron, cuaderno, silla vacía, 8 de la noche, no faltan pacientes, cuaderno no falla, martes pasado, no reemplaza) | carousels/briefs/ads/ad-a*.json (+out/ads a2–a3) @main | Anuncio estático ×8 | C | preguntas de dolor dental, sin mecanismo | sin UI (según brief) | RENDERIZADO parcial (a2v1, a2v2, a3) | REESCRIBIR: CTA «Reservá una demo» (el alta está abierta: «Creá tu cuenta») y sin producto visible (regla 21-sep) |  |
| S11-05 | D01 @oniahq «8 de la noche» | PARA-PUBLICAR/D01-oniahq-8pm/CAPTION.txt @main | Anuncio carrusel | C/D | el asistente atiende fuera de horario | no | RENDERIZADO («HECHO» en COLA 02-sep) | REESCRIBIR: pone al chatbot como titular y habla a cualquier rubro |  |
| S11-06 (4) | D17 cuatro anuncios por rubro | PARA-PUBLICAR/D17-oniahq-ads-por-rubro/LEEME.md @claude/carril-contenido | Anuncio ×4 | D | copy por rubro | no | RENDERIZADO (rama sin mergear) | DESCARTAR para la etapa (sólo dental/estética) |  |
| S11-07 (7) | 7 carruseles @oniahq de agosto (WhatsApp a mano, R.I.P. cuaderno, 3 procesos, costo invisible, competencia IA, paradigma de escala, recibo) | contenido/ONIAHQ.md + carousels/briefs/onia-*.json + out/onia-* @main | Carrusel ×7 | D | calcular no respondidos × ticket; cuánto cobraste de menos; valor de tu hora | no | PROGRAMADO en Postiz 17-ago (publicación no confirmada; Postiz dio 502 después) | REESCRIBIR: no específicos del ICP dental; revisar CTA/promesas vs hoy (evaluado por doc, no lámina por lámina) |  |
| S11-08 (2) | onia-* «Mitos de la IA» y «5 tareas que la IA hace mejor» | carousels/briefs/onia-{mitos-ia,5-tareas-ia}*.json + out/ @main | Carrusel ×2 | G | información genérica de IA | no | RENDERIZADO | DESCARTAR para @oniahq (ya movidos a Lucía por no pasar la prueba del vendedor; Lucía está congelada) |  |
| S11-08b (5) | onia-* de 20-ago (5 preguntas de siempre, competencia mientras WhatsApp, cuaderno no avisa ×3 variantes) | carousels/briefs/onia-*-20260820.json + out/ @main | Carrusel ×5 | C/D | dolor del cuaderno/WhatsApp | no | RENDERIZADO | REESCRIBIR: pasar al ICP dental y a la regla «producto visible» (no evaluado lámina por lámina) |  |
| S11-09 | Anuncio sin cara 33 s (molde de 7 beats) | docs/ONIA_GUION_ANUNCIO_SIN_CARA_20260820.md @main | Anuncio video | D | no enseña; sin dolor de rubro ni CTA | B3: panel real en el teléfono | IDEA (0 generaciones) | DESCARTAR: intercambiable entre rubros y sin CTA (falla la regla de publicidad) |  |

### S12 · Lucía (línea congelada) y otros

| ID | Guion | Archivo @rama | Formato | Aud. | Qué enseña (concreto) | Pantalla real necesaria → ¿existe? | Estado (evidencia) | Veredicto | ⏰ vence · versiones/duplicados |
|---|---|---|---|---|---|---|---|---|---|
| S12-01 (6) | Lucía: guion de lanzamiento («No soy real») + Semana 1 piezas 1–4 + reveal | docs/ONIA_LUCIA_LANZAMIENTO_GUION_20260821.md, references/models/LUCIA_GUIONES_SEMANA1.md, briefs/lucia-reveal-20260809.json @main | Reels/carrusel | G | presentación IA; skincare/lifestyle | no aplica | ESCRITO/RENDER | DESCARTAR para esta etapa: influencer IA congelada (Etapa 1). Congelar, no borrar |  |
| S12-02 (6) | Lucía PARA-PUBLICAR D13, D14 (main) y D15, D16, D18, D19 (carril-contenido) | PARA-PUBLICAR/D1*-lucia-* @main y @claude/carril-contenido | Imagen/reel/carrusel ×6 | G | «esto no existe»; D18/D19 enseñan a pedir una foto no-catálogo | no aplica | RENDERIZADO (día 0 fijado publicado el 31-ago según Sergio Urcullo) | DESCARTAR para la etapa (congelada) |  |
| S12-03 (10) | out/guiones/20260903 (7 shorts + 3 largos autogenerados) | out/guiones/20260903/{shorts,long} @main | Reels/YT | G | genérico para «creadores» (Pika/Runway/CapCut/Synthesia) | placeholders | ESCRITO (autogenerado; archivos con bytes nulos y tildes rotas) | DESCARTAR: herramientas no probadas, sin pantalla real, encoding roto |  |
| S12-04 | Máquina Humana piloto 001 «Qué le hace el azúcar a tu cerebro» | channels/ciencia-cuerpo/pilot/001-azucar-y-el-cerebro/script.md @main | YouTube faceless 8–10 min | G | divulgación científica | no aplica | ESCRITO (bloqueado: ~360 créditos) | DESCARTAR para la etapa (línea congelada) |  |
| S12-05 | Teaser animado Onia Community | videos/onia-community-teaser (renders/video.mp4) @main | Motion | J | no enseña | no | RENDERIZADO | DESCARTAR como pieza de enseñanza |  |
| S12-06 | Reel «Fable 5.1 vs GPT-6 Astra» (Codex 14-sep) | citado en GUIONES-RODAJE-17-20-SEP.md (C:\Users\PC\Downloads\…) | Vertical 32 s | J | benchmarks | — | EDITADO sin publicar (a 17-sep) | DESCARTAR: noticia del 1–4 sep vencida |  |

### S13 · main · Serie TikTok «Convertí mi PC en un empleado que no duerme» (SERIE_TIKTOK_NODO_AGENTE)

| ID | Guion | Archivo @rama | Formato | Aud. | Qué enseña (concreto) | Pantalla real necesaria → ¿existe? | Estado (evidencia) | Veredicto | ⏰ vence · versiones/duplicados |
|---|---|---|---|---|---|---|---|---|---|
| S13-01 | EP0 «El error que no deja error» | docs/SERIE_TIKTOK_NODO_AGENTE.md @main | TikTok 45–70 s | J | una tarea no corrió sin log: buscar un testigo; zona horaria del servidor (UTC) vs PC (Caracas) | terminal real reproduciendo el error en una máquina limpia (IP inventada) → sólo hay logs/capturas de la sesión del 04-sep; ningún video | IDEA (esquema por episodio; cuenta sin decidir) | MANTENER (el mejor) | Nodo de casa hoy apagado: grabar como reproducción declarada |
| S13-02 | EP1 «Un carácter separa agregar de borrarlo todo» | docs/SERIE_TIKTOK_NODO_AGENTE.md @main | TikTok 45–70 s | J | `>>` vs `>` en authorized_keys; dejar abierta la sesión por la que entraste | terminal real reproduciendo el error en una máquina limpia (IP inventada) → sólo hay logs/capturas de la sesión del 04-sep; ningún video | IDEA (esquema por episodio; cuenta sin decidir) | MANTENER | Nodo de casa hoy apagado: grabar como reproducción declarada |
| S13-03 | EP2 «Verificar no es contar» | docs/SERIE_TIKTOK_NODO_AGENTE.md @main | TikTok 45–70 s | J | `wc -l` da 4 y dos llaves están pegadas; verificar con `ssh-keygen -lf` | terminal real reproduciendo el error en una máquina limpia (IP inventada) → sólo hay logs/capturas de la sesión del 04-sep; ningún video | IDEA (esquema por episodio; cuenta sin decidir) | MANTENER | Nodo de casa hoy apagado: grabar como reproducción declarada |
| S13-04 | EP3 «Un mensaje de Telegram podía ejecutar comandos» | docs/SERIE_TIKTOK_NODO_AGENTE.md @main | TikTok 45–70 s | J | ssh re-interpreta la cadena; comillas; bug de formato = agujero | terminal real reproduciendo el error en una máquina limpia (IP inventada) → sólo hay logs/capturas de la sesión del 04-sep; ningún video | IDEA (esquema por episodio; cuenta sin decidir) | MANTENER (mostrar sólo la versión arreglada) | Nodo de casa hoy apagado: grabar como reproducción declarada |
| S13-05 | EP4 «El cron perfecto que nunca corre» | docs/SERIE_TIKTOK_NODO_AGENTE.md @main | TikTok 45–70 s | J | la misma ruta escrita en dos archivos; leer el dato en vez de repetirlo | terminal real reproduciendo el error en una máquina limpia (IP inventada) → sólo hay logs/capturas de la sesión del 04-sep; ningún video | IDEA (esquema por episodio; cuenta sin decidir) | MANTENER | Nodo de casa hoy apagado: grabar como reproducción declarada |
| S13-06 | EP5 «5,4 GB de RAM para copiar 4 megas» | docs/SERIE_TIKTOK_NODO_AGENTE.md @main | TikTok 45–70 s | J | /tmp en WSL vive en RAM; medir antes/después | terminal real reproduciendo el error en una máquina limpia (IP inventada) → sólo hay logs/capturas de la sesión del 04-sep; ningún video | IDEA (esquema por episodio; cuenta sin decidir) | MANTENER | Nodo de casa hoy apagado: grabar como reproducción declarada |
| S13-07 | EP6 «El paracaídas que se rompía al abrirse» | docs/SERIE_TIKTOK_NODO_AGENTE.md @main | TikTok 45–70 s | J | `set -u` y el camino de rescate usando una variable que se crea más abajo (línea 54 vs 66) | terminal real reproduciendo el error en una máquina limpia (IP inventada) → sólo hay logs/capturas de la sesión del 04-sep; ningún video | IDEA (esquema por episodio; cuenta sin decidir) | MANTENER | Nodo de casa hoy apagado: grabar como reproducción declarada |
| S13-08 | EP7 «Mi PC de 16 GB veía 7» | docs/SERIE_TIKTOK_NODO_AGENTE.md @main | TikTok 45–70 s | J | .wslconfig y la mitad de RAM por defecto | terminal real reproduciendo el error en una máquina limpia (IP inventada) → sólo hay logs/capturas de la sesión del 04-sep; ningún video | IDEA (esquema por episodio; cuenta sin decidir) | MANTENER | Nodo de casa hoy apagado: grabar como reproducción declarada |
| S13-09 | EP8 «Administrador no es lo mismo que dueño» | docs/SERIE_TIKTOK_NODO_AGENTE.md @main | TikTok 45–70 s | J | root vs tu usuario: otro PATH y otras credenciales | terminal real reproduciendo el error en una máquina limpia (IP inventada) → sólo hay logs/capturas de la sesión del 04-sep; ningún video | IDEA (esquema por episodio; cuenta sin decidir) | MANTENER | Nodo de casa hoy apagado: grabar como reproducción declarada |
| S13-10 | EP9 «El 403 que no era permiso» | docs/SERIE_TIKTOK_NODO_AGENTE.md @main | TikTok 45–70 s | J | el mensaje describe el síntoma, no la causa | terminal real reproduciendo el error en una máquina limpia (IP inventada) → sólo hay logs/capturas de la sesión del 04-sep; ningún video | IDEA (esquema por episodio; cuenta sin decidir) | DESCARTAR (el propio doc lo marca flojo) | Nodo de casa hoy apagado: grabar como reproducción declarada |

---

## 4. Duplicados y versiones — cuál es la última

### Archivos con más de una versión

| Archivo | Versiones encontradas | La última |
|---|---|---|
| `docs/cola/GUIONES-RODAJE-17-20-SEP.md` | **una sola** (blob `8ddfd600`), idéntica en main y en 19 ramas | esa; su último cambio real es del **17-sep 22:23** (`c0206a14`, visible en ramas con historia). En main aparece «21-sep» sólo por el corte *shallow* |
| `carousels/out/yt-04-verificar/GUION.md` | main `5e83ab81` («doce errores en una sola sesión», dato falso) · deadab `63cd0caf` (21-sep, recontado, + `LISTO-PARA-GRABAR.md`, demo) | **deadab** |
| Guion del YT 03 | `yt-claude-code-automatizacion/GUION.md` `e05b78cc` (10-sep; ramas `g1-scholarships…`, `onia-cola-gate-precios-crece`) → main `yt-03-sin-vos/GUION.md` `27edab4b` (renombrado; conserva «PC de escritorio prendida en mi casa») → deadab `3c82aa21` (18-sep, corregido a «40 en el VPS») | **deadab** (el video ya está publicado) |
| `docs/cola/PLAN-VIDEOS-11-20-SEP.md` | 5 versiones (195–241 líneas) | **deadab** `fc3175f5` (levanta «nada de Higgsfield» el 17-sep); si no, main `99949a54` |
| `docs/cola/BRIEF-SAMUEL-VIDEOS.md` | deadab `23354024` (21-sep 15:54) · codex/samuel `269b53be` (21-sep 20:37) | **codex/samuel** (retoma de n8n/Higgsfield; ya no afirma «único método») |
| `docs/ONIA_COMUNIDAD_CONTENIDO.md` | 5 versiones | **codex/marca-comunidad-plan** `5075fb08` (22-sep: audiencia, ritual Santa Cruz, drops 22–28) |
| `docs/ONIA_MOTOR_SEMANAL_CONTENIDO.md` | 3 versiones | **codex/marca-comunidad-plan** `3d318f41` (22-sep) |
| `docs/SERIE_CLAUDE_CODE_DESCRIPCIONES.md` | 3 versiones | **deadab** `f6abfade` |
| `docs/ONIA_MARCA_PERSONAL_SEMANA1.md`, `GUIONES-SEMANA-1-MI-STACK.md`, `SERIE_TIKTOK_NODO_AGENTE.md`, drops 02–04, `PARA-PUBLICAR-APPLE-*`, `videos/claude-code-03/CAPTION-YOUTUBE.md` | las de otras ramas son **anteriores** (hasta 18-sep) | **main** (el caption del YT 03 en main ya usa `/llamada` en vez de `/30min`) |

### El mismo guion en dos formas (no son versiones)

- **Lunes 21-sep, dos planes distintos:** main `docs/cola/GUIONES-DIA-2026-09-21.md` (Codex, 19:31, tema «qué automatizar / n8n») y deadab `docs/cola/GUIONES-DIA-21-SEP.md` (Claude, ~15:30, tema verificación). Ninguno reemplaza al otro.
- **YouTube MCP/agentes/loops:** G9 con texto literal y tiempos (`GUIONES-DIA-2026-09-22.md`) y `yt-09/GUION.md`, generado por script con notas por lámina. `PAQUETE-GRABACION` cita el segundo como «guion oral» pero usa los tiempos del primero.
- **Semana 22 de carruseles:** los `sergio-*-20260921` (con datos falsos) y los `apple-*-inter` corregidos, ambos en deadab. Usar los apple.
- **GUIONES-GUARDADOS A/B/C** (18-sep) = V1, V2 y F2 del 21-sep, antes de la corrección de «días».

### Racimos: la misma enseñanza repartida en varias piezas (elegir una por día)

| Tema | Filas |
|---|---|
| Clasificar leads en n8n | S5-02, S5-03, S5-04 · S1-02 · S1-17 · S1-31 · carruseles S5-01, S5-09 · historia S2-02 |
| Loop con frenos | S5-07 → S1-04 → bloque 4 de S1-09 → lámina 5 de S5-09 · clip n8n-04 de Samuel |
| MCP | S5-06, S5-10 · S1-03, S1-14 · S2-03 · lámina 7 de yt-09 |
| Opus 5.5 | S1-08, S1-15, S1-38 + capturas |
| Verificar | YT 04 · S4-02, S4-04…08, S4-09b–e, S4-10 · S8-13 · EP0/EP2 de S13 |
| El agente que vigila | S7-09, S7-10, S7-11 · S8-07 · S9-14 · S10-04 · S8-18 |
| «Mi empleado de US$200» | S8-11 · S7-07 · lámina 5 de S6-06 · S6-10 |
| Qué automatizar primero / 6 columnas | S1-21, S1-39 · S5-01, S5-08 · S9-04 · S7-15 · S9-15 |
| Comunidad Santa Cruz | S1-10, S1-27, S1-30, S1-40 · ritual en `ONIA_COMUNIDAD_CONTENIDO` |
| Skills | S7-02 · S9-05 · S3-03 · S3-09 · YT 02 |

---

## 5. Afirmaciones que vencen — re-verificar antes de grabar o publicar

| # | Afirmación | Dónde | Estado hoy | Cómo se re-verifica |
|---|---|---|---|---|
| 1 | Opus 5.5 lanzado el 22-sep; US$4/20 por 1M, caché 0,20; Opus 5 5/25/0,50; «40 % menos *at default settings*»; «>30 % más rápido» | S1-08, S1-15, S1-38, `captures/opus-5-5/` | ✅ coincide con la captura oficial y con la referencia de `claude-api`. ⚠️ el 40 % depende del default: effort `medium` en 5.5 vs `high` en Opus 5 | re-correr `scripts/capture_opus_5_5_playwright.cjs` (falla solo si cambia el texto de precios) |
| 2 | Migración: thinking no se desactiva; `tool_choice` any/forzado no soportado | ídem | ✅. **Falta en el guion:** effort por defecto `medium`, thinking atado al modelo/conversación, computer use sólo con `computer_toolset_20260801` | guía oficial de migración |
| 3 | GPT-6 Sol US$2/10 y Luna 0,10/0,50 por 1M | S1-13, S1-11 | ❌ no verificable desde acá; noticia vencida | anuncio oficial de OpenAI |
| 4 | Fable 5.1 y GPT-6 Astra «cuestan lo mismo por token»; fechas 1/3/4-sep | S4-09, S4-15, S10-15, S12-06 | ⚠️ referencia: Fable 5.1 = US$10/50; Astra sin verificar; noticia vencida | — |
| 5 | Claude Code 2.1.277 lee AGENTS.md sólo sin CLAUDE.md; la máquina tenía 2.1.267; «5.270 reacciones / pedido #1» | S4-01, S4-03, S4-09b | ⚠️ changelog leído el 21-sep; el 5.270 no tiene fuente → cortar | changelog oficial + `claude --version` |
| 6 | Instalación (`npm -g` vs instalador nativo), «el plan gratis no incluye Claude Code», app de escritorio | S9-02, S9-12, S8-05, S4-13, S5-11 | ⚠️ verificado el 10-sep contra la doc de setup | doc oficial de setup |
| 7 | HyperFrames v0.8.62 (22-sep) / v0.8.31 (10-sep); `check --snapshots`, `present`; «render resuelve sólo la primera slide» | S1-28, S1-29, S1-33, S9-13 | ⚠️ | `npx hyperframes --version` / `--help` |
| 8 | Nodos n8n (Basic LLM Chain, Structured Output Parser, AI Agent, Call n8n Workflow Tool, Calculator Tool) y la opción «Force Tool Call» | S1-02, 04, 05, 17, 18, 19, S1-31 | ⚠️ | la versión instalada de n8n |
| 9 | Spec MCP 2025-11-25; `readOnlyHint` es una pista | S1-03, 05, 09 · S5-06, 10 | ⚠️ | modelcontextprotocol.io |
| 10 | `claude mcp add --transport http notion https://mcp.notion.com/mcp` | S5-06, S5-10 | ⚠️ | doc de Notion / Claude Code |
| 11 | WhatsApp Business: cambio de precios el 1-oct-2026; 72 h gratis desde anuncio | S4-11 | ⚠️ leído el 17-sep; **vence el 1-oct** | developers.facebook.com/docs/whatsapp/pricing |
| 12 | SIN: regularización al 31-dic-2026 (DS 5708); plazos de facturación electrónica | S1-22, S1-24, S8-17 | ❌ | impuestos.gob.bo |
| 13 | Tipo de cambio | S1-37 | vence cada día | BCB |
| 14 | Cifras propias: 40 trabajos en el VPS / 0 en casa; 4 hooks; 3 subagentes; 6 conectores; 9 plugins; US$40; US$200; 74 %; 18 anotados / 4 de una sesión; «197 piezas»; «83 muletillas»; «cientos de videos guardados» | S4-06, S4-07, S6-04…06, S7-07, S7-11, S8-11, S8-14, S8-15, S1-07 | recontadas el 18 y 21-sep salvo «197», «83» y «cientos» | `crontab -l` en VPS y casa, `settings.json`, `ls .claude/agents/`, etc. |
| 15 | «Tengo 16 años» | S6-04, S6-06, S10-14 | vence con el cumpleaños | — |
| 16 | Links: `cal.com/sergiourcullo/30min` daba 404 el 21-sep (`/20min` y `/llamada` 200); `/15min` sin verificar; `/agentes`, `/automatizar`, `/mcp` sólo en la rama vault | S3-06, S3-07, S9-08, S2-01…03 | no verificable desde acá (proxy 403) | curl + abrir y mirar |
| 17 | ONIA: «desde Bs [monto omitido]/mes», «14 días sin tarjeta», «Creá tu cuenta» | S11-01, S11-02, S11-03 | ✅ coincide con el espejo del sitio (tests citan ese monto como plan básico) | `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`) |
| 18 | «Stripe no acepta Bolivia» | S10-17 | ⚠️ | página de países de Stripe |
| 19 | Costos Higgsfield (0,12 cr, 2 cr, ~360 cr) | S10-05, S3-10, S12-04 | vence; todo gasto pide aprobación | `higgsfield generate cost` |

---

## 6. (a) Cómo están armados los guiones — y si la plantilla es consistente

**Hay nueve moldes, de dos familias que conviven sin fusionarse.**

| Molde | Estructura | Dónde |
|---|---|---|
| **Rodaje por segundos** (sesiones Claude, 12–21 sep) | `0–3 s GANCHO` (sin «hola») · `3–25 s LO CONCRETO` (qué es, qué hace, **qué NO hace**, con pantalla real) · `25–35 s CIERRE` (UN recurso + comentario o comunidad, alternados). Tabla **HABLA literal · EN PANTALLA · OVERLAY** por tramo. 30–35 s; «largos» de 60–90 s; pilar ~75 s | RODAJE 17–20, Tanda 2, GUIONES-DIA-21-SEP |
| **Mi stack** | mismo 3-tiempos, pero el cierre es siempre la comunidad y **«NUNCA una palabra clave»** | GUIONES-SEMANA-1 |
| **Guion hablado + montaje** (Codex, 21–27 sep) | Título · guion hablado en bloque (45–75 s) · «Montaje exacto» (Tiempo · Imagen · Texto) o «Pantalla que debe acompañar» / «Texto en pantalla» / «Overlay para copiar» · frase hero amarilla (2–5 palabras) · CTA **«Comentá PALABRA»** con recurso de `SISTEMAS_IA_PACKS` · control de calidad con fuentes. Reglas de plano: frontal / lateral 45° / sobre el hombro, estímulo cada 4–7 s, subtítulos de 1–4 palabras | GUIONES-DIA-2026-09-21, -22, PLAN 23–27 (éste ya sin montaje) |
| **YouTube serie Claude Code** | deck acapela con chuleta por lámina; texto hablado literal con timecodes; «Mi caso» con cifras recontadas; **«La parte honesta» penúltima**; «En una línea» última; comentario pedido hablando | yt-03…06 |
| **YouTube Codex** | GUION.md **generado** desde las notas del deck: por lámina «Lámina · Guion (instrucciones, no texto literal) · Pantalla/prueba» + tomas de seguridad; 10–14 min | yt-07, 08, 09 |
| **Drop** | qué es → qué NO hace → «Hacelo hoy — N min» con pasos → archivo del día → pregunta en General | `docs/cola/drops/` |
| **Carrusel (brief JSON)** | 7–8 láminas: cover → stakes → points (visual flow/table/contract/terminal/matrix) → save → CTA con palabra + «Soy Sergio Urcullo…»; caption, hashtags, `PUBLICAR.md` | `carousels/briefs/` |
| **TikTok de depuración** | gancho 3 s → error en pantalla 10 s → por qué 20 s → arreglo 15 s → lección 10 s; cierre = la lección, nunca «seguime» | SERIE_TIKTOK_NODO_AGENTE |
| **Anuncio** | beats con tiempos, texto quemado, shot list con «prueba» por plano, prompts de identidad/movimiento/negativo, claims seguros y prohibidos | `campaigns/…/ugc-dental-30s.md` |

**¿Consistente? No.** Lo que sí comparten los modernos: gancho sin saludo, herramienta nombrada literal, prueba en pantalla, un límite, CTA con recurso y recontar cifras. **Lo que se contradice entre moldes:**

- **Política de CTA:** Mi stack «nunca palabra clave» → 18-sep «palabra sólo con recurso» → 21/22-sep «Comentá PALABRA» siempre, con entrega manual.
- **Duración y densidad:** 30–35 s (rodaje) vs 45–75 s (Codex).
- **Qué es un guion de YouTube:** texto literal (serie Claude Code, G9) vs instrucciones generadas (yt-07/08/09).
- **Audiencia:** dueños de negocio hasta el 20-sep; jóvenes/aficionados desde el 21-sep.

**Lo que ningún molde registra y hace falta para esta regla:** una línea «**Qué aprende la persona**» (sólo la tienen G8 y los decks), un campo «**Pantalla real: fuente, archivo y si existe**», y un «**estado de toma**» (grabado → archivo → editado → publicado). Sin ese último, G1 y G2 figuran grabados y nadie sabe dónde está el archivo.

---

## 7. (b) `PAQUETE-GRABACION-2026-09-22.md`: qué le pide a Sergio Urcullo grabar y qué se grabó

| # | Lo que pide | Evidencia encontrada | Estado |
|---|---|---|---|
| 1 | **Opus 5.5 primero:** A-roll con hook, guion 8 entero con pausas en `$4 · $20 · $0.20 · $2.80 · $4.75 · 41.1 %`, pickup de seguridad («el 40 % es estimación de Anthropic; por token la rebaja es 20 %»), CTA OPUS; formato split vertical | ninguna | **no confirmado** |
| 1b | Capturas Playwright de Opus 5.5: hero con fecha, precios, disponibilidad y model ID, migración (thinking y tool choice), scroll de 8–12 s | `captures/opus-5-5/01–05.png`, `06/07.webm`, `manifest.json` (`capturedAt 2026-09-23T03:38Z` = 22-sep 23:38 en Bolivia), commiteadas 2 minutos después | **hecho** |
| 2 | Pickups de los videos 1 y 2 ya grabados (12–15 s y 15–20 s) | ninguna. Los A-roll base sí figuran grabados («falta localizar el archivo») | **no confirmado** |
| 3 | Cinco verticales, en orden G7 → G6 → G4 → G3 → G5, cada uno con su pantalla: carpeta de guardados y ejecución fallida/exitosa (G7); workflow lineal y AI Agent con 3 tools (G6); split `HTTP Request → IF → Wait → reintento → Telegram` (G4); pantalla verde con doc MCP y gestos a 5 posiciones (G3); JSON `get_lead_by_id` sobre el hombro (G5) | ninguna; **los workflows que piden no existen en el repo** | **no confirmado** |
| 4 | Biblioteca de 12 tomas de B-roll (laptop lateral, mano con n8n, sobre el hombro, error corregido, `claude mcp list`, JSON, libreta, cierre de laptop…) | ninguna | **no confirmado** |
| 5 | 8 capturas para edición (Opus, deck MCP lámina por lámina, workflow de leads, AI Agent con 3 tools, loop, JSON Schema, `get_lead_by_id`, doc MCP sin credenciales) | sólo la de Opus | **1 de 8** |
| 6 | YouTube horizontal «MCP, agentes, loops y n8n» con `npx hyperframes present hermes-content/carousels/out/yt-09-mcp-agentes-loops` y plan de edición por tramos | ninguna | **no confirmado** |
| 7 | Tres historias de 8–12 s para la comunidad | ninguna | **no confirmado** |

**Conclusión:** lo único hecho con prueba son las capturas de Opus (por script) y, antes del paquete, los A-roll de G1 y G2. La rama terminó el 22-sep a las 23:40 y **no hay un solo commit posterior, en ninguna rama, que registre grabaciones**. La rama tampoco tiene handoff, y `CLAUDE.md` lo exige al cerrar un carril. El pedido además depende de pantallas que nadie construyó (los workflows del punto 3), así que aunque la cámara se haya prendido, esas piezas no pudieron salir con pantalla real.

---

## 8. (c) Los dos scripts de la rama `codex/marca-comunidad-plan`

### `scripts/capture_opus_5_5_playwright.cjs` (324 líneas)

**Qué hace, exactamente:** abre Chrome del sistema en modo headless con `playwright-core`, a 1920×1080 y grabando video. **Bloquea toda petición que no sea GET/HEAD/OPTIONS** y la anota. Carga `anthropic.com/claude-opus-5-5`, espera «Claude Opus 5.5» y el texto exacto «September 22, 2026», y captura el hero (01). **Afirma** que el párrafo «Cost and speed.» contiene «$4 and $20 per million», «$0.20 per million» y «more than 30% faster»; si no, el script falla. Captura precios (02) y disponibilidad/model ID (03), hace scroll en 4 paradas para el video, abre la guía de migración y captura thinking (04) y tool choice (05). Verifica que cada PNG mida 1920×1080 leyendo su cabecera, recorta con ffmpeg los primeros 4 s del video (06 → 07) y escribe `manifest.json` con los textos encontrados y las peticiones bloqueadas.

**¿Reutilizable?** **Como patrón, sí; tal cual, no.**

- **A favor:** sólo lee (bloquea escrituras), deja manifest auditable y, sobre todo, **los asserts de texto convierten la captura en un chequeo «re-verificar antes de grabar»**: si Anthropic cambia el precio, el script falla en vez de capturar algo viejo.
- **En contra:**
  - está atado a un lanzamiento (URLs, textos, carpeta y nombres 01–07 fijos) y **sobrescribe** las capturas anteriores;
  - busca Chrome sólo en rutas de Windows y `playwright-core` en el caché de npx de `%LOCALAPPDATA%` (`PLAYWRIGHT_CORE_PATH` salva lo segundo, no lo primero), así que **en el VPS o en Linux falla**;
  - el patrón de respaldo `/thinking/i` de la captura 04 es demasiado amplio;
  - el hero no guarda `matchedText`, aunque sí exige la fecha;
  - necesita ffmpeg en el PATH.
- **Para generalizarlo:** `capture_official_pages.cjs --config <json>` con `{url, waitFor[], asserts[], shots[{file, patterns}]}`, carpeta fechada y el chromium propio de Playwright en Linux.

### `scripts/generate_youtube_teaching_decks.mjs` (867 líneas)

**Qué hace:** tiene **escrito adentro** el contenido de 3 decks (yt-07 HyperFrames, 9 láminas; yt-08 n8n, 10; yt-09 MCP/agentes/loops, 10). Por cada uno escribe en `carousels/out/<slug>/`:

- `index.html`: deck navegable de 1920×1080, con escenas de 8 s y atributos de HyperFrames (`data-composition-id`, `data-start`, `data-duration`, `data-track-index`), GSAP desde jsDelivr, flechas, botón y tecla N para las notas del orador. Los visuales son helpers: flow, cards, code, terminal, compare, checklist, decision, hub, cycle, bridge, stack;
- `deck.html` (redirección), `README.md` y `package.json` (present/lint/check);
- **`GUION.md`, generado:** por lámina, eyebrow y título + las notas como «Guion» + «Pantalla / prueba», que sale de un mapa fijo por slug.

**¿Reutilizable?** **Sí como generador «un origen → deck + guion + README»**, con cuatro arreglos:

1. **Sacar el contenido del script:** hoy regenera los tres decks en cada corrida y pisa cualquier edición a mano de `GUION.md` o `README.md`. Pasarlo a un JSON por deck y recibir el slug por argumento.
2. **Mapa `visualInstruction` por slug:** un deck nuevo sin entrada sale con «Pantalla / prueba: undefined».
3. **El GUION generado son instrucciones** («Abrí con…», «Mostrá…»), no texto para decir. Choca con el molde literal del resto y con el G9. Agregar un campo HABLA por lámina.
4. **Detalles fijos:** firma «@sergiourcullo · ONIA · construir, probar, documentar», 8 s por lámina y GSAP por CDN (riesgo al renderizar sin red). El resultado es para `present`, no un video lineal.

---

## 9. Huecos principales

1. **Faltan las pantallas reales de casi todo lo técnico.** No existen en el repo los workflows n8n de los guiones (clasificador con LLM Chain + parser, AI Agent con 3 tools, loop con `attempt` y Wait, proceso roto con fallback), ni capturas de `claude mcp list` / `/mcp`, ni las ejecuciones de los contratos de tool. Sin eso, la mayoría de los MANTENER de S1 no puede salir. **Primero una sesión de construir demos** (y exportarlas como hizo Samuel en `scripts/marca-personal/demos-samuel/`), **después la de rodaje**.
2. **No hay registro de tomas.** G1 y G2 figuran grabados y el archivo no está localizado; no existe «pieza → archivo → estado».
3. **Nada de la semana del 21–22 está en main:** plan, guiones, decks, capturas y recursos (`codex/marca-comunidad-plan`) y los YT 03/04 corregidos (`deadab`). Hoy **main tiene las versiones con datos falsos**.
4. **Contradicción técnica y calendarios chocados** (§1, puntos 3 y 7).
5. **Los recursos de CTA no están publicados:** `SISTEMAS_IA_PACKS` y la Bóveda viven en ramas, y el DM de @sergiourcullo no tiene palabras cableadas.
6. **El dato caído de la PC de casa** sigue en ~12 guiones.
7. **Noticias vencidas** en cola (Opus «salió hoy», GPT-6 Sol/Luna, Fable/Astra).
8. **Audiencia:** el giro del 21-sep deja desalineado lo escrito antes para dueños de negocio; y la **Etapa 1** (dental) sólo la sirven piezas de @oniahq listas pero sin publicar. El UGC sigue sin generar: falta el costo vivo y la aprobación, y la campaña pide verificar antes el evento de registro en Meta.
9. **Guiones del sábado 12** («los 7 finales»): quedaron «en el mensaje de la sesión», no en el repo. Sólo están las placas.
10. **No hay medición por pieza:** `sergio-content-patterns.json` (rama vault) define el registro pero tiene **0 observaciones**; la auditoría IG del 22-sep sólo da agregados. Por ejemplo, reels = 81 % de las vistas; carruseles/posts = 1,8 %.

---

## 10. Excluidos: son «guiones» pero no son contenido

- `sales-kit/02-GUION-DEMO.md`: guion de demo de venta 1:1.
- `docs/ONIA_META_VIDEO1_GUION_20260815.md`: screencast para el App Review de Meta.
- `docs/research/ONIA_BOX_LAS_5_CONVERSACIONES_GUION_20260812.md`: entrevistas de descubrimiento (hardware, línea congelada).
- `deploy/vps-ops/bot/guion-del-bot.mjs`: guion conversacional del chatbot.
- `scripts/content-engine/GUION-nuvia-isdin-spf50-001.md`: UGC de Nuvia (skincare).
- `deploy/n8n/workflows/onia-guiones-diarios.json` + `skills/guiones-diarios-onia.md`: generador diario por OpenAI que manda a Telegram; no guarda guiones en el repo.
- `docs/ONIA_MARCA_PERSONAL_RADAR.md`: banco de 14 ganchos, no son guiones. Los ganchos #7 («El 80 %…») y #12 («Te están cobrando [X]…») violan su propia regla de cifras.
- `docs/SERIE_CLAUDE_CODE_DESCRIPCIONES.md`: descripciones de YouTube (la última versión está en deadab).
- `docs/cola/HALLAZGOS-RODAJE-ONIA-18-SEP.md`: hallazgos de producto.
- Pilares y yaps de Samuel (sin guion por diseño) y los espacios de vlog/B-roll del PLAN 23–27 sin texto.
- Experimentos y variantes de diseño en `carousels/out/` (`experimento-*`, `VARIANTE-*`, `formato-*`, `CHEQUEO-*`).

---

## 11. Apéndice — ramas

| Rama | Commits sobre main | Última | Qué aporta al inventario |
|---|---:|---|---|
| `codex/marca-comunidad-plan` | 3 | 22-sep 23:40 | guiones 22-sep, PLAN 23–27, PAQUETE, yt-07/08/09, 3 carruseles, capturas Opus, recursos, 2 scripts |
| `codex/sergio-vault-growth` | 1 | 21-sep 19:59 | 3 historias, páginas Bóveda (`/agentes`, `/automatizar`, `/mcp`), `resource` en 3 briefs, registro de patrones vacío |
| `codex/samuel-grabaciones-20260921` | 1 | 21-sep 20:37 | BRIEF de Samuel (última), handoff de grabaciones, demos n8n y scripts de grabación |
| `claude/marca-personal-carruseles-dist-deadab` | 24 | 21-sep 16:08 | GUIONES-DIA-21-SEP, guardados, YT 03/04 corregidos + LISTO-PARA-GRABAR + demo, carruseles semana 22, `rec_*.py` / `grabar_pantalla.py` |
| `claude/carril-contenido` | sin base común (clon *shallow*) | 02-sep | Lucía D15–D19, D17 anuncios por rubro, cola `contenido.md` |
| `claude/ads-creatividades-publicos` | sin base común | 04-sep | cola `contenido.md`, `contenido/PUBLICAR.md` |
| las otras 112 (incluidas main y la rama actual) | — | — | sin archivos de guion propios fuera de main; donde un archivo difiere de main, la versión de la rama es anterior |

Los archivos intermedios del análisis (datos de la tabla, versiones divergentes por rama, las 30 rutas que sólo están en ramas y las copias de lectura de los archivos de las 4 ramas) quedaron fuera del repo y **no se archivaron**.
