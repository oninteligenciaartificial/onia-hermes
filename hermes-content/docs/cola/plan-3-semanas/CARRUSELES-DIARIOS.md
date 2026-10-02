# Carruseles diarios — 30-sep → 20-oct-2026 (21 días)

Pedido de Sergio Urcullo (29-sep): **un carrusel de Instagram por día**. Este archivo es el
calendario de carruseles; amplía la tabla de `ORDEN-DE-PRODUCCION.md` §3 (mar · jue · sáb), que
sigue valiendo para K1–K9 con las mismas fechas.

- **Hora propuesta:** 16:00 La Paz, todos los días.
- **Brief (caption y láminas):** `hermes-content/carousels/briefs/marca-personal/<carpeta>.json`.
- **Láminas:** `hermes-content/carousels/out/<carpeta>/slide-NN.png` · hoja de contacto:
  `hermes-content/carousels/out/<carpeta>/_contactsheet.png`.
- **Render:** `node scripts/carousel_render.js --brief <brief> --out hermes-content/carousels/out/<carpeta> --account sergio --pack referentes --format feed`
  y `node scripts/carousel_contactsheet.js --dir hermes-content/carousels/out/<carpeta>`.
- **Estado al 1-oct, noche:** 13 listos para aprobar (K1–K13; K2 y K8 en v3), 8 pendientes (K14–K21). Al 29-sep se pausó por pedido de
  Sergio Urcullo; los pendientes tienen tema y guion asignados abajo (§2).

## 1. Calendario (re-alineado con los videos el 1-oct — falta el «ok» de Sergio Urcullo)

Cada carrusel sale el mismo día que su video cuando lo hay (`GUIONES-2-SEMANAS-1-14-OCT.md`). **Nada agendado.**
Antes de cada uno, el recurso que promete su cierre tiene que estar publicado; si no, el cierre miente.
**Qué pegar en la comunidad y cuándo: `cola/drops/AVISOS-POR-DIA.md`** (fuente, 2-oct). La columna «Lo que tiene que estar antes» de abajo es del 1-oct y quedó vieja donde cambió la palabra.

| Fecha | K# | Tema | Carpeta del render | Lo que tiene que estar antes | Estado |
|---|---|---|---|---|---|
| vie 2-oct | K10 | La perilla de esfuerzo | `sergio-k10v2-perilla-de-esfuerzo-20260929` | la web (existe) | listo para aprobar |
| sáb 3-oct | K1 | Opus 5.5 o Sonnet 5.5 | `sergio-k1-opcion-b-clay-20260929` | el reto en la comunidad (`cola/drops/2026-10-01.md`) | ✅ B elegida 30-sep |
| dom 4-oct | K2 | Tu primera skill en 5 pasos | `sergio-k2v3-primera-skill-20261001` | la web `/claude-code` (responde 200; falta mirarla renderizada) | listo para aprobar |
| lun 5-oct | K6 | Las 2 listas | `sergio-k6v2-confirmado-por-confirmar-20260929` | la plantilla de las dos listas | listo para aprobar |
| mar 6-oct | K3 | CLAUDE.md con historia | `sergio-k3v2-claude-md-historia-20260929` | la web (existe) | listo para aprobar |
| mié 7-oct | K11 | El hook que commitea solo | `sergio-k11-hook-stop-guarda-20261001` | drop 3 de S1 (escrito, sin publicar; sumarle la prueba del conflicto, LOTE-A) | listo para aprobar |
| jue 8-oct | K4 | 5 pruebas antes de activar tu bot | `sergio-k4v2-cinco-pruebas-bot-20260929` | su drop en la comunidad | listo para aprobar |
| vie 9-oct | K9 | 5 revisiones antes de publicar | `sergio-k9v2-checklist-video-ia-20260929` | su drop en la comunidad | listo para aprobar |
| sáb 10-oct | K12 | Dos sesiones sin pisarse | `sergio-k12-worktrees-sin-pisarse-20261001` | drop 12 de S1 (escrito «por DM»: pasarlo a comunidad) | listo para aprobar |
| dom 11-oct | K5 | Seguimiento que no molesta | `sergio-k5v2-seguimiento-que-no-molesta-20260929` | su drop en la comunidad | listo para aprobar |
| lun 12-oct | K13 | Loop sin API key, con barandas | `sergio-k13-loop-sin-api-key-20261001` | drop 8 de S1 (escrito, sin publicar) | listo para aprobar |
| mar 13-oct | K7 | Carruseles por código | `sergio-k7v2-carruseles-por-codigo-20260929` | el JSON que se manda por DM | listo para aprobar |
| mié 14-oct | K8 | Recuperar vs reconstruir | `sergio-k8v3-recuperar-vs-reconstruir-20261001` | drop D9 de S3 (escrito «por DM»: pasarlo a comunidad) | listo para aprobar |

**Palabra de cada carrusel (cierre `cierre`, 2-oct):** K10 EFFORT · K1 TRAMPA · K2 SKILL · K6 PROMESA · K3 HISTORIA ·
K11 HOOK · K4 PRUEBAS · K9 REVISAR · K12 WORKTREE · K5 VENTANA · K13 ESQUELETO · K7 BRIEF · K8 PROMPT. Es la misma
palabra que su video, para que el DM mande al mismo recurso.

**Carruseles de noticia (2-oct, mismo día que su video, 12:00 La Paz — la noticia se vence):**

| Fecha | Pieza | Carpeta | Palabra | Estado |
|---|---|---|---|---|
| con el video V2 | N03 modo auto | `sergio-n03-modo-auto-20261001` | COMUNIDAD (la que dijo en el video) | listo para aprobar |
| vie 2-oct | DD-A OpenAI Sol | `sergio-dda-openai-sol-20261001` | CACHE | listo; falta escribir su drop |
| dom 4-oct | N02 Sonnet 4.5 se apaga | `sergio-n02-sonnet45-se-apaga-20261001` | MIGRAR | listo para aprobar |
| lun 5-oct | N04 skill verify | `sergio-n04-skill-verify-20261001` | VERIFY | listo para aprobar |
| ~~sáb 3-oct~~ | ~~N06 Gemini CLI~~ | — | — | ⛔ premisa falsa (Antigravity CLI reemplazó el plan gratis el 18-jun); se reemplaza por un repo de la reserva |

Hora: **16:00 La Paz** (20:00 UTC) todos. K14–K21 quedan para después del 14-oct (§2).
Se agendan con `deploy/vps-ops/publicar/ig-carrusel.mjs` + `agendar-publicacion.sh`, recién con el «ok» de Sergio
Urcullo sobre cada uno.

## 2. Los 11 pendientes: qué enseña cada uno

Mismo sistema que K1–K10 (pack `referentes`, portada verde, interiores blancos, cierre negro o
verde, 5–8 láminas). Portada sin imagen: `dato` o `logos`, nunca `ilustrado` vacío (§3, K8).
Todo número sale del guion y está verificado en su archivo fuente el 29-sep.

| K# | Portada (gancho) | Lo que enseña | Cierre | Cuidado |
|---|---|---|---|---|
| K11 ✅ 1-oct | `dato` «17»: archivos con conflictos que el hook subió a main | `.claude/settings.json` → hooks → Stop → command; Stop corre al terminar el turno, no el trabajo (217 líneas de estilos antes que el código que las usaba — corregido por LOTE-A; decía «antes de la página»); la guarda: `git rev-parse -q --verify MERGE_HEAD` y `git diff --name-only --diff-filter=U`; comprobar con `/hooks` | comunidad (drop 3 de S1) | nada |
| K12 ✅ 1-oct | `dato` «424»: commits que se movió una rama (confirmado por la madre, `VERIFICACION-LAPTOP-20261001.md` §5) | `git worktree add -b <rama> <carpeta>` · `claude -w <nombre>` · paso crítico: todo git con `git -C <ruta>` · comprobar con `git worktree list` | comunidad (drop 12 de S1; LOTE-B unificó a comunidad, ya no «Comentá CARRIL») | nada |
| K13 ✅ 1-oct | `logos` o `dato`: loop de Claude Code sin API key | las dos piezas (corredor + prompt); barandas: flock, `cd` verificado, aviso cada 6 h, tope 50 min < 1 h; trampas: `unset ANTHROPIC_API_KEY`, `--allowedTools` en una cadena, pedido desde archivo (`< prompt.md`), cron en UTC, editar con temporal + `bash -n` + `mv`; la prueba: leer 3-4 commits (apagué 2 de 6) | comunidad (drop 8 de S1) | no decir cuántos loops hay activos hoy |
| K14 | `dato` «3»: capas de un bot que no inventa | 1 cada dato en un solo lugar (horario doble hasta el 13-sep); 2 control después de la IA (normaliza, patrones, descarta entera, texto seguro; el patrón al revés dejaba pasar «Bs 999 por mes»); 3 medir (banco + control como juez); en n8n: nodo If después de la IA | comunidad (drop 2 de S2) | 62/62 ya está en K4: no repetirlo como gancho |
| K15 | `dato` «20»: segundos entre el reinicio y el mensaje que nadie contestó | la línea de tiempo del 3-sep; rescate cada 10 min (último mensaje del cliente, entre 3 min y 12 h, mismo id; el filtro de duplicados evita la doble respuesta); firma o secreto, sin secreto rechaza todo; las 3 reglas; la prueba de apagar el webhook | comunidad (drop 7 de S2) | nada |
| K16 | `ensayo` verde: cobrar software desde Bolivia sin Stripe | QR bancario + comprobante; pago pendiente hasta que una persona aprueba; aviso por cada pago nuevo (monto y espera) y recordatorio de los de más de 24 h; nunca aprobación automática | comunidad (drop 12 de S2) | sin banco, cuenta ni comprobantes; no nombrar la API del banco (en trámite) |
| K17 | `dato` «0 de 9»: campañas que funcionaban para un visitante real | por qué pasa (acuerdo invisible web ↔ bot); la planilla de 5 columnas; los 7 pasos; cierra con tres sí | comunidad (drop 14 de S2) | no mostrar el número del bot; la conversación tibia se cuenta como hallazgo, no como arreglo |
| K18 | `dato` «−14»: LUFS a los que normalizan las redes | color HDR (saturación 50 → 72); una sola pasada (5,5 → 6,6 Mbps); volumen (−20 → −14 LUFS); orden cortar → zoom → gráficos → subtítulos → sonido | comunidad (drop D3 de S3) | K9 ya cubre las revisiones a ojo: acá solo lo técnico medido |
| K19 | `dato` «54×»: la imagen más cara contra la más barata | `model list` (nombre técnico) → `generate cost` → lote aprobado → una primero → registrar y comprobar con `account transactions`; la trampa del límite diario de la cuenta | comunidad (drop D7 de S3) | precios del 29-sep: fecharlos y recotizar el día de publicar |
| K20 | `dato` «3»: niveles de «ver» un video | Gemini nativo · fotogramas + transcripción · solo la descripción; la regla de la línea de cobertura («audio completo, vi 15 de 60 cuadros») | comunidad (drop D10 de S3) | no usar el tope de «20 videos por día» (medido en julio) |
| K21 | `dato` «443»: mensajes de mis agentes en un día | un aviso es una tarea; solo lo roto ocupa lugar (borrar la negación antes: «nada roto»); un parte por día, lo grave primero y lo nuevo arriba; vigías que avisan por cambio; medir antes y después | comunidad (drop D13 de S3) | nada |

## 3. Problemas encontrados en los que ya están

- ✅ **K2 → `k2v3` (1-oct):** fondo crema arreglado con `theme` por lámina; el ejemplo pasó a la skill de continuidad
  (LOTE-A) y el cierre manda a la web, como el guion D01-A.
- ✅ **K8 → `k8v3` (1-oct):** portada `dato` «2» en vez del `ilustrado` vacío; se corrigieron «decí que es tuyo» (la
  regla es decir que NO es el original) y «cuadro por cuadro» (el guion dice no mirar a intervalo fijo).
- ⚠️ **K8, K11, K12 y K13 no llevan imagen** (no había lote aprobado). K1-B, el elegido, vende por sus dos imágenes de
  arcilla. Propuesta a Sergio Urcullo el 1-oct: lote de portada + 1 interior para esos cuatro (8 × 0,12 cr).
- **K1 (1-oct):** ✅ opción B (arcilla), elegida por Sergio Urcullo el 30-sep. El intercambio K1↔K10 ya no aplica: no hay video grabado todavía, sale K1 primero.
- **Referencias viejas:** `MAPA.md` (líneas 4-5), `S2-GUIONES.md` y `S3-GUIONES.md` citan
  `CARRUSELES.md`, que no existe; `MAPA.md` §3 y `FLUJO-DIARIO.md` dicen «carrusel mar · jue ·
  sáb». Hay que apuntarlos a este archivo.

## 4. Lote Higgsfield propuesto (no generado: necesita aprobación)

Todas las portadas de §2 funcionan sin imagen. Estas son opcionales, con el estilo `clay` (el que
mejor rinde con Soul 2.0) y objetos sin nada impreso. Costo cotizado el 29-sep:
`text2image_soul_v2` 0,12 cr por imagen; recotizar gratis antes con
`node scripts/carousel_images.mjs --brief <brief> --out <dir>` (sin `--yes`).

| Para | Prompt (va en `image_prompt` de la portada) | Costo |
|---|---|---|
| K8 portada | el que ya está en su brief | 0,12 cr |
| K13 portada | A small closed padlock in green clay on a short matte black chain, resting on a white surface. | 0,12 cr |
| K14 portada | Three flat round clay discs stacked slightly offset, one green, one white, one matte black. | 0,12 cr |
| K20 portada | A pair of round eyeglasses with matte black clay frames lying folded on a white surface. | 0,12 cr |
| **Total** | 4 imágenes | **0,48 cr** |
