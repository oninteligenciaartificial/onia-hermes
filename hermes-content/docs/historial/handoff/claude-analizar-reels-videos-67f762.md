# Handoff — análisis de reels (video-intake)

- **Rama:** `claude/analizar-reels-videos-67f762`
- **Worktree:** `C:\dev\proyectos\onia-hermes\.claude\worktrees\laughing-heyrovsky-0b48a0`
- **Última sesión:** 2026-08-23

---

**Objetivo**

Recibir los reels que manda Sergio, verlos, y **repartir** lo que sirve a la sesión que le toca
como prompt copy-paste.

**Hecho =** cada item mandado tiene ficha con veredicto, y todo lo `SIRVE YA` tiene prompt en el
archivo de su sesión. El carril no ejecuta lo que descubre: reparte.

**Cumplido en esta sesión:** sí, para los 18 posts del lote del 23-ago.

> **Alcance ampliado el 2026-08-23 por Sergio:** *"los reels también son estilos y diseños,
> agarralos como conocimientos, no solo este, todos, agarralos y aprende"*. La ficha ya no extrae
> solo el prompt replicable: extrae también el **estilo/diseño** (tipografía, paleta con hex,
> composición, ritmo de corte, motion, textura) y dice a qué banco nuestro se porta — sin crear
> carpeta nueva: van a `hermes-content/references/ui-patterns/` y a
> `web-factory/docs/MOTION_PATTERN_BANK_2026.md`.

**Qué quedó EN PRODUCCIÓN**

Nada de este carril toca producción: es documentación y skills. El valor se realiza cuando otra
sesión pega un prompt. Encendido y verificado: la skill `.claude/skills/sacar-prompt/` y el ciclo
de intake completo, corrido de punta a punta dos veces (22-ago sobre `DbT8hWPsyjN`, 23-ago sobre
18 posts).

**Qué quedó a medias, y dónde**

| Qué | Dónde | Estado exacto |
|---|---|---|
| **Cosecha del DM — 32 items** | `PENDIENTE_COSECHA.md` | **15 con ficha (P1–P15), 17 sin analizar.** Se corto por COSTO, no por error. El material pesado ya esta bajado y medido. |
| **Los 18 prompts O1–O18** | `PROMPTS_LOTE_2026-08-23.md` + copias en `sesiones/` | **repartidos, sin ejecutar.** Es lo correcto: este carril reparte. |
| **~25 entradas al banco de motion** | `2026-08-23-patrones-de-motion-deduplicados.md` | deduplicadas a **7 patrones** y dejadas como propuesta. **Nadie escribió en `MOTION_PATTERN_BANK_2026.md`** — ese archivo es de la sesión web-factory. |
| **Conflicto con `motion-doctrine`** | ver síntesis §4 | **9 de 14 videos contradicen la doctrina** (el texto no se anima, entra por corte duro). Anotado, no resuelto: es decisión del dueño de esa skill. |
| **"Comentario → DM vivo desde el 18-ago"** | 8 fichas dependen de ese dato | **NO re-verificado.** El propio lote se contradice: 5 fichas lo afirman en presente, 3 lo marcan como no verificado. Se cuenta antes de ejecutar. |
| **`cosechar-dm.mjs`** | `.claude/skills/ver-videos/scripts/cosechar-dm.mjs` | escrito y **sin estrenar**. Falta que Sergio corra `--login` una vez. |
| **Los MP4 al Drive** | zip de 57 MB en el scratchpad | armado y no arrastrado. El MCP de Drive no traga archivos grandes. |
| **22 prompts SIN EVIDENCIA** | `ESTADO_DE_LOS_PROMPTS.md` | verificados el 20-ago contra el worktree. **Sin reconciliar contra `origin/main`.** |
| **Marca personal de Sergio / Lucía** | no existe archivo | la propuesta que Sergio pidió complementar nunca llegó. |

**Archivos y cambios**

| Commit | Qué |
|---|---|
| `38a00f27` | **retira el estándar de handoff rival** y adopta el de `main` (ver intento fallido #1) |
| *(esta sesión)* | lote del 23-ago: 18 fichas + síntesis + patrones deduplicados + `PROMPTS_LOTE_2026-08-23.md` + reparto a 4 `sesiones/` |
| `b57b6cf1` · `819c84b9` · `23bab36a` | lotes del 21 y 22-ago (L1–L3, M1–M5, N1–N3) |
| `22b4c4f3` | `cosechar-dm.mjs` (nuevo) |
| `06ae2b43` · `4214fcea` | skill `sacar-prompt` (nueva) + registrada en `CLAUDE.md` |

**Intentos fallidos**

0. **Analizar sin mirar lo que cuesta.** Cada agente lee 30-50 fotogramas JPEG a 1080px, y una
   imagen asi cuesta ~1.000-1.500 tokens: **~50.000 tokens por agente solo en mirar**. Dos tandas
   gastaron 3,20 M y 2,00 M, y la tercera iba a 4-5 M cuando Sergio la corto. Arreglado en
   `preparar.sh`: 640px y 3 ventanas densas en vez de 5 → ~1/5 del costo, y el texto en pantalla
   se lee igual. Detalle en `2026-08-23-costo-del-analisis.md`.

1. **Inventar un estándar de handoff sin mirar `main` primero.** El 22-ago escribí
   `hermes-content/docs/HANDOFF_DE_SESION.md` + `.claude/handoff/<rama>.md` y una regla nueva en
   `CLAUDE.md`. Otro carril ya lo había resuelto y ya estaba en `main` (`dd4ab68d`, adoptado por
   `b55e41e9`), en `hermes-content/docs/handoff/<carril>.md`. Dos estándares rivales del mismo
   tema. **Se retiró el mío.** Antes de escribir una regla en un archivo raíz: mirar `origin/main`.
2. **Copiar un archivo compartido de `main` ENTERO en vez de mergear.** Reemplacé `CLAUDE.md` con
   la version de `main` y la congele en ese instante; `main` agrego despues dos reglas y mi rama
   las habria borrado al mergear. Un reemplazo se ve como un diff limpio y esconde un borrado.
   **Se re-sincroniza contra `origin/main` justo antes de commitear, y se mira el diff completo.**
3. **`ffmpeg -v error` para contar cortes.** `-v error` **silencia la salida de `showinfo`**, así
   que *cualquier* video devuelve cero cortes. Publiqué "cero cortes, medido" y era falso; se lo
   pasé a los agentes rotulado como "ya medido". Un agente lo re-midió y encontró el corte real.
   **Va `-hide_banner`, nunca `-v error`.** Y una cifra "ya medida" que te pasan sigue siendo un
   dato heredado: se re-mide.
4. **Tener las transcripciones y no pasárselas a los agentes.** Se les dio caption + fotogramas y
   nada más. **Seis videos tenían voz** (503, 234, 199, 93, 74 y 62 palabras) y se analizaron
   mudos; hubo que rehacer 8 fichas. Verificar qué insumos **llegan** al agente, no solo que
   existan en disco.
5. **Concluir "el lote no tiene voz" desde una corrida parcial.** Los 3 videos que faltaban
   transcribir eran justamente de los que más hablaban.
6. **Cosechar los DMs clickeando por coordenadas.** Los posts compartidos no exponen su URL en el
   DOM. Lo que funciona: escuchar `page.on('response')` sobre `direct_v2|graphql`.
7. **`source` del `.env` raíz en bash**: tiene BOM UTF-8 y rompe con
   `syntax error near unexpected token '('`. Las vars ya están exportadas en el entorno.
8. **Dar por vencida la falta de `GEMINI_API_KEY`.** La memoria decía que faltaba; estaba puesta.
   Alcanzó para 3 videos antes del 429 de cuota gratis.
9. **Dejar archivos `.md` vacíos cuando Gemini falla.** Los agentes los leen como si tuvieran
   contenido. Borrarlos (`find -size 0 -delete`).
10. **Forzar el idioma en Whisper**: traduce en vez de transcribir. Va `ONIA_AUDIO_STT_LANGUAGE=auto`.
    Y sobre música alucina: devolvió francés inventado en un reel sin voz.
11. **`git add -A <path>` con un pathspec que ya no existe**: falla entero y deja un commit
    incompleto que no coincide con su mensaje.
12. **Trabajar contra el checkout local sin mirar `origin/main`.**
13. **Generalizar desde una lámina** — y su gemelo de este lote: afirmar "jitter fotograma a
    fotograma" desde **7 de 406 fotogramas**.
14. **Heredoc de bash con markdown largo**: se rompe. Para documentos, herramienta de escritura.
15. **Salirse del carril.** Sergio: *"aquí solo hablamos de reels"*.

**Qué depende de Sergio**

| Bloqueo | Qué hace falta |
|---|---|
| ✅ **El lead magnet** | **RESUELTO el 2026-08-23: es agendar una demo.** El DM manda el link de `cal.onia.com.bo`, no un PDF. Desbloquea O1, O4, O6, O8, O9, O10, O14 y O15. Falta **mirar** la página renderizada y reservar una vez de punta a punta — hoy sólo se verificó HTTP 200, y eso no es verificación. Va a la sesión de infra/marketing, no a este carril. |
| 🔴 **`CALCOM_WEBHOOK_SECRET`** | el webhook `calcom-booking` corre con la validación HMAC **apagada** por falta de esa variable en el contenedor de n8n. Con 8 posts mandando tráfico a la reserva, deja de ser un pendiente menor. |
| 🟡 **Permiso de gasto en Higgsfield — solo VIDEO** | 6 fichas lo pedían contra la regla vieja. `main` (`f794ac6c`) separó imagen de video: **imagen en lote chico ya está autorizada**. Queda 1 ficha y media, las que generan video. Ver síntesis §3. |
| **Prueba de tercero** | 6 moldes de alta conversión se apoyan en un hito verificable declarado por un tercero, que Onia no tiene. No es técnico. |
| **Cosecha automática de DMs** | correr una vez: `node .claude/skills/ver-videos/scripts/cosechar-dm.mjs --login`, **con la cuenta personal de Sergio** — ahí es donde viven los DMs con los reels (el chat con `mrsatiras__`). NO `@oniahq` ni la de Lucía: esas no reciben los links. |
| **MP4 al Drive** | arrastrar el zip de 57 MB |
| **Marca personal** | mandar la propuesta que le hicieron |
| **3 decisiones abiertas** | % del pilar informativo de Lucía · cuenta propia vs `@oniahq` · QR dinámico core o add-on |

**Próximos pasos**

1. ✅ **Bajada a `main`** el 2026-08-23 (`4e0d654c`). Único conflicto: `BANDEJA.md`, y era de unión
   (los dos lados sólo agregaron al final) — se quedaron las dos partes. Cero marcadores, verificado.
2. **Terminar los 17 de la cosecha** con el `preparar.sh` ya abaratado. Lista y contexto en
   [`PENDIENTE_COSECHA.md`](../../references/video-intake/PENDIENTE_COSECHA.md).
3. **Arreglar la transcripcion**: Speaches devolvio `fetch failed` para los 26 videos, en paralelo
   y de a uno, aunque `/v1/models` responde OK. Todo el lote se analizo sin audio.
4. **Contar de nuevo si comentario→DM sigue vivo** antes de ejecutar cualquier O que dependa de él.
3. **La sesión web-factory** toma `2026-08-23-patrones-de-motion-deduplicados.md` y decide qué
   entra al banco. **No lo escribe este carril.**
4. **El dueño de `motion-doctrine`** declara qué régimen gobierna montaje UGC vs motion graphics
   autoral.
5. **Cuando Sergio corra `--login`:** cosechar el hilo entero de `mrsatiras__`, cruzar contra
   `BANDEJA.md`, procesar solo lo nuevo.
6. **Reconciliar `ESTADO_DE_LOS_PROMPTS.md` contra `origin/main`.**
