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
- **Estado al 29-sep, 23:00:** 10 listos para aprobar, 11 pendientes. Se pausó por pedido de
  Sergio Urcullo; los 11 pendientes tienen tema y guion asignados abajo (§2).

## 1. Calendario

| Fecha | Día | K# | Tema | De qué guion sale | Carpeta del render | Hora | Estado |
|---|---|---|---|---|---|---|---|
| 30-sep | mié | K10 | La perilla de esfuerzo de Claude Code | S1 D01-C YouTube (parte «esfuerzo») + D02-A (V4) | `sergio-k10v2-perilla-de-esfuerzo-20260929` | 16:00 | listo para aprobar |
| 1-oct | jue | K1 | Opus 5.5 o Sonnet 5.5: cuál usar | S1 D01-C YouTube + D01-B | `sergio-k1-opcion-b-clay-20260929` o `sergio-k1-opcion-a-acuarela-20260929` | 16:00 | listo para aprobar (elegir A o B) |
| 2-oct | vie | K11 | El hook que commitea solo, y su guarda | S1 D03-A | — | 16:00 | pendiente |
| 3-oct | sáb | K2 | Tu primera skill en 5 pasos | S1 D01-A (V6) | `sergio-k2v2-primera-skill-20260929` | 16:00 | listo para aprobar ⚠️ ver §3 |
| 4-oct | dom | K12 | Dos sesiones de Claude Code sin pisarse (worktrees) | S1 D05-A | — | 16:00 | pendiente |
| 5-oct | lun | K13 | Claude Code en un servidor: 3 barandas y 5 trampas | S1 D06-C YouTube | — | 16:00 | pendiente |
| 6-oct | mar | K3 | Un CLAUDE.md donde cada regla trae su historia | S1 D03-C YouTube | `sergio-k3v2-claude-md-historia-20260929` | 16:00 | listo para aprobar |
| 7-oct | mié | K14 | Un bot que no inventa: 3 capas | S2 D07-C YouTube | — | 16:00 | pendiente |
| 8-oct | jue | K4 | 5 pruebas antes de activar tu bot | S2 D09-A, D12-A, D11-B | `sergio-k4v2-cinco-pruebas-bot-20260929` | 16:00 | listo para aprobar |
| 9-oct | vie | K15 | El mensaje que se perdía: rescate y firma del webhook | S2 D09-C YouTube | — | 16:00 | pendiente |
| 10-oct | sáb | K5 | 4 reglas de un seguimiento que no molesta | S2 D07-A (V8), D10-A, D11-A | `sergio-k5v2-seguimiento-que-no-molesta-20260929` | 16:00 | listo para aprobar |
| 11-oct | dom | K16 | Cobrar software desde Bolivia sin Stripe | S2 D11-C | — | 16:00 | pendiente |
| 12-oct | lun | K17 | Probá el recorrido entero: del botón de la web al bot | S2 D12-C YouTube | — | 16:00 | pendiente |
| 13-oct | mar | K6 | Las 2 listas: confirmado / por confirmar | S2 D08-A (V3) | `sergio-k6v2-confirmado-por-confirmar-20260929` | 16:00 | listo para aprobar |
| 14-oct | mié | K18 | Tres arreglos medidos de un video editado por código | S3 D14-C YouTube | — | 16:00 | pendiente |
| 15-oct | jue | K7 | Carruseles por código en 5 pasos | S3 D16-A | `sergio-k7v2-carruseles-por-codigo-20260929` | 16:00 | listo para aprobar |
| 16-oct | vie | K19 | Generar con IA sin fundirte: el costo antes de crear | S3 D16-C YouTube | — | 16:00 | pendiente |
| 17-oct | sáb | K8 | Recuperar vs reconstruir el prompt de una imagen | S3 D17-B | `sergio-k8v2-recuperar-vs-reconstruir-20260929` | 16:00 | listo para aprobar ⚠️ ver §3 |
| 18-oct | dom | K20 | Que la IA «vea» tu video y te diga cuánto vio | S3 D18-A | — | 16:00 | pendiente |
| 19-oct | lun | K21 | De 443 avisos por día a un solo parte | S3 D19-C YouTube | — | 16:00 | pendiente |
| 20-oct | mar | K9 | 5 revisiones antes de publicar tu video con IA | S3 D14-A, D15-A, D17-A + V7 | `sergio-k9v2-checklist-video-ia-20260929` | 16:00 | listo para aprobar |

Por qué K10 es el del 30-sep: los tres videos de ese día (skill, Sonnet 5.5, YouTube Opus o
Sonnet) ya los cubren K1 y K2. El YouTube del día tiene una segunda parte, el esfuerzo, que
ningún carrusel cubre. Si Sergio Urcullo prefiere que cada carrusel salga el mismo día que su
video, se intercambian K1 (→ 30-sep) y K10 (→ 1-oct, el día del vertical de esfuerzo).

## 2. Los 11 pendientes: qué enseña cada uno

Mismo sistema que K1–K10 (pack `referentes`, portada verde, interiores blancos, cierre negro o
verde, 5–8 láminas). Portada sin imagen: `dato` o `logos`, nunca `ilustrado` vacío (§3, K8).
Todo número sale del guion y está verificado en su archivo fuente el 29-sep.

| K# | Portada (gancho) | Lo que enseña | Cierre | Cuidado |
|---|---|---|---|---|
| K11 | `dato` «17»: archivos con conflictos que el hook subió a main | `.claude/settings.json` → hooks → Stop → command; Stop corre al terminar el turno, no el trabajo (217 líneas de CSS antes de la página); la guarda: `git rev-parse -q --verify MERGE_HEAD` y `git diff --name-only --diff-filter=U`; comprobar con `/hooks` | comunidad (drop 3 de S1) | nada |
| K12 | `dato` «424»: commits que se movió una rama | `git worktree add -b <rama> <carpeta>` · `claude -w <nombre>` · paso crítico: todo git con `git -C <ruta>` · comprobar con `git worktree list` | `cierre` «Comentá CARRIL» (drop 12 de S1, por DM) | es el único «comentá» nuevo de la semana 1 |
| K13 | `logos` o `dato`: loop de Claude Code sin API key | las dos piezas (corredor + prompt); barandas: flock, `cd` verificado, aviso cada 6 h, tope 50 min < 1 h; trampas: `unset ANTHROPIC_API_KEY`, `--allowedTools` en una cadena, pedido desde archivo (`< prompt.md`), cron en UTC, editar con temporal + `bash -n` + `mv`; la prueba: leer 3-4 commits (apagué 2 de 6) | comunidad (drop 8 de S1) | no decir cuántos loops hay activos hoy |
| K14 | `dato` «3»: capas de un bot que no inventa | 1 cada dato en un solo lugar (horario doble hasta el 13-sep); 2 control después de la IA (normaliza, patrones, descarta entera, texto seguro; el patrón al revés dejaba pasar «Bs 999 por mes»); 3 medir (banco + control como juez); en n8n: nodo If después de la IA | comunidad (drop 2 de S2) | 62/62 ya está en K4: no repetirlo como gancho |
| K15 | `dato` «20»: segundos entre el reinicio y el mensaje que nadie contestó | la línea de tiempo del 3-sep; rescate cada 10 min (último mensaje del cliente, entre 3 min y 12 h, mismo id; el filtro de duplicados evita la doble respuesta); firma o secreto, sin secreto rechaza todo; las 3 reglas; la prueba de apagar el webhook | comunidad (drop 7 de S2) | nada |
| K16 | `ensayo` verde: cobrar software desde Bolivia sin Stripe | QR bancario + comprobante; pago pendiente hasta que una persona aprueba; aviso por cada pago nuevo (monto y espera) y recordatorio de los de más de 24 h; nunca aprobación automática | comunidad (drop 12 de S2) | sin banco, cuenta ni comprobantes; no nombrar la API del banco (en trámite) |
| K17 | `dato` «0 de 9»: campañas que funcionaban para un visitante real | por qué pasa (acuerdo invisible web ↔ bot); la planilla de 5 columnas; los 7 pasos; cierra con tres sí | comunidad (drop 14 de S2) | no mostrar el número del bot; la conversación tibia se cuenta como hallazgo, no como arreglo |
| K18 | `dato` «−14»: LUFS a los que normalizan las redes | color HDR (saturación 50 → 72); una sola pasada (5,5 → 6,6 Mbps); volumen (−20 → −14 LUFS); orden cortar → zoom → gráficos → subtítulos → sonido | comunidad (drop D3 de S3) | K9 ya cubre las revisiones a ojo: acá solo lo técnico medido |
| K19 | `dato` «54×»: la imagen más cara contra la más barata | `model list` (nombre técnico) → `generate cost` → lote aprobado → una primero → registrar y comprobar con `account transactions`; la trampa del límite diario de la cuenta | comunidad (drop D7 de S3) | precios del 29-sep: fecharlos y recotizar el día de publicar |
| K20 | `dato` «3»: niveles de «ver» un video | Gemini nativo · fotogramas + transcripción · solo la descripción; la regla de la línea de cobertura («audio completo, vi 15 de 60 cuadros») | comunidad (drop D10 de S3) | no usar el tope de «20 videos por día» (medido en julio) |
| K21 | `dato` «443»: mensajes de mis agentes en un día | un aviso es una tarea; solo lo roto ocupa lugar (borrar la negación antes: «nada roto»); un parte por día, lo grave primero y lo nuevo arriba; vigías que avisan por cambio; medir antes y después | comunidad (drop D13 de S3) | nada |

## 3. Problemas encontrados en los que ya están

- **K2 (3-oct):** se renderizó a las 07:43 del 29-sep, antes del cambio a blanco + verde + negro:
  sale con el **fondo crema** que Carlos Domínguez marca como rasgo de plantilla IA. Arreglo
  gratis: ponerle `theme` a sus láminas (portada `verde`, cierre `negro`) y re-renderizar.
- **K8 (17-oct):** la portada es `ilustrado` sin imagen: queda un bloque verde con el título
  arriba y más del 40 % vacío. O se genera su imagen (lote de abajo) o se pasa a `dato`/`logos`.
- **K1 (1-oct):** falta que Sergio Urcullo elija la opción A (acuarela) o B (arcilla).
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
