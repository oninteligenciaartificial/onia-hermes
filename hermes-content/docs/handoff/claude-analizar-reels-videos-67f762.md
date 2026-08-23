# Handoff — análisis de reels (video-intake)

- **Rama:** `claude/analizar-reels-videos-67f762`
- **Worktree:** `C:\dev\proyectos\onia-hermes\.claude\worktrees\laughing-heyrovsky-0b48a0`
- **Última sesión:** 2026-08-23

---

**Objetivo**

Recibir los reels que manda Sergio, verlos, y **repartir** lo que sirve a la sesión que le
toca como prompt copy-paste.

**Hecho =** cada item mandado tiene ficha con veredicto, y todo lo `SIRVE YA` tiene prompt en
el archivo de su sesión. El carril no ejecuta lo que descubre: reparte.

> **Alcance ampliado el 2026-08-23 por Sergio:** *"los reels también son estilos y diseños,
> agarralos como conocimientos, no solo este, todos, agarralos y aprende"*. La ficha ya no
> extrae solo el prompt replicable: extrae también el **estilo/diseño** (tipografía, paleta,
> ritmo de corte, composición, mecánica de motion) y lo rutea a los bancos que ya existen
> — `hermes-content/references/ui-patterns/` y `web-factory/docs/MOTION_PATTERN_BANK_2026.md`
> — en vez de crear carpeta nueva.

**Qué quedó EN PRODUCCIÓN**

Nada de este carril toca producción: es documentación y skills. El valor se realiza cuando
otra sesión pega un prompt.

Encendido y verificado:

- **`.claude/skills/sacar-prompt/`** — instalada y probada (`preparar.sh` sobre un video de
  7,7 s → 4 fotogramas base + 31 densos, muestreo por densidad de texto, no por intervalo).
- **El ciclo de intake completo**, corrido de punta a punta sobre `DbT8hWPsyjN` el 22-ago:
  descarga → 66 fotogramas → transcripción → ficha → prompts → repartidos → 125 links
  verificados, 0 rotos.

**Qué quedó a medias, y dónde**

| Qué | Dónde | Estado exacto |
|---|---|---|
| **Lote del 23-ago — 18 posts** | scratchpad `lote-0823/` | media capturado (15 MP4 + 5 carruseles / 38 láminas + captions), análisis Gemini corriendo. **Fichas sin escribir todavía.** |
| **`cosechar-dm.mjs`** | `.claude/skills/ver-videos/scripts/cosechar-dm.mjs` | escrito y **sin estrenar**. Falta que Sergio corra `--login` una vez. Único paso manual que queda para dejar de mandar links de a uno. |
| **Los MP4 al Drive** | zip de 57 MB en el scratchpad | armado y no arrastrado. El MCP de Drive no traga archivos grandes. |
| **22 prompts SIN EVIDENCIA** | `hermes-content/references/video-intake/ESTADO_DE_LOS_PROMPTS.md` | verificados contra el repo el 20-ago. **Sin reconciliar contra `origin/main`** — pueden haber bajado. |
| **Marca personal de Sergio / Lucía** | no existe archivo | Sergio pidió complementar "la propuesta que me hicieron" y esa propuesta nunca llegó. |

Nada de esto está detrás de un flag: está sin arrancar, que es distinto y peor de esconder.

**Archivos y cambios**

Todo bajo `hermes-content/references/video-intake/` salvo lo marcado.

| Commit | Qué |
|---|---|
| *(esta sesión)* | **retira el estándar de handoff rival** — ver "intentos fallidos" #1 |
| `b57b6cf1` | ficha `handoff.md` + verbatim + N1–N3 repartidos |
| `819c84b9` | lote de 14 del 22-ago, M1–M5 |
| `23bab36a` | lote de 9, L1–L3 |
| `22b4c4f3` | `.claude/skills/ver-videos/scripts/cosechar-dm.mjs` (nuevo) |
| `17cc2af3` | el chat con `mrsatiras__` es la fuente real del carril |
| `06ae2b43` · `4214fcea` | `.claude/skills/sacar-prompt/` (nueva) + registrada en `CLAUDE.md` |
| `e3ceb303` · `418c1c05` | los 25 pendientes en un archivo; J5/J6 |

Estructura estable: `INDEX.md` (entrada) · `sesiones/` (13 archivos, uno por sesión,
autocontenidos) · `PROMPTS_LOTE_<fecha>.md` (fuente) · `BANCO_DE_REPLICABLES.md` (cola R1–R13)
· `METODO_DE_ANALISIS.md` · `BANDEJA.md` · `transcripciones/`.

**Intentos fallidos**

1. **Inventar un estándar de handoff sin mirar `main` primero.** El 22-ago escribí
   `hermes-content/docs/HANDOFF_DE_SESION.md` + `.claude/handoff/<rama>.md` y una regla nueva
   en `CLAUDE.md`. Otro carril ya había resuelto lo MISMO y ya estaba mergeado en `main`
   (`dd4ab68d`, adoptado por `b55e41e9`), en `hermes-content/docs/handoff/<carril>.md`.
   Dos estándares rivales del mismo tema — justo lo que la regla §2 existe para evitar.
   **Se retiró el mío y se adoptó el de main.** Antes de escribir una regla en un archivo
   raíz: mirar `origin/main`, no el worktree.
2. **Cosechar los DMs clickeando por coordenadas.** Los posts compartidos no exponen su URL en
   el DOM. Lo que sí funciona: escuchar `page.on('response')` sobre `direct_v2|graphql`.
   No volver al clic.
3. **Lanzar el análisis antes de que termine la transcripción.** 8 de 10 items quedaron sin
   audio. Esperar siempre.
4. **Asumir que "0 palabras" es transcripción rota.** El 23-ago, 12 de 13 videos dieron 0
   segmentos con audio a −17 dB: son reels de **música + texto en pantalla, sin voz**. Y el
   único que devolvió texto devolvió francés inventado (alucinación de Whisper sobre música).
   Para este tipo de reel la fuente es el **fotograma y el caption**, no el audio.
5. **Dar por vencida la falta de `GEMINI_API_KEY`.** La memoria decía que faltaba; el 23-ago
   estaba puesta en el `.env` raíz y en el entorno. Eso habilita el camino PRIMARIO
   (`gemini-see-video.mjs`, mira video+audio+texto en pantalla nativo). Verificar la
   credencial antes de repetir el fallback.
6. **`source` del `.env` raíz en bash**: tiene BOM UTF-8 y rompe con
   `syntax error near unexpected token '('`. Las vars ya están exportadas en el entorno; no
   hace falta sourcearlo.
7. **Forzar el idioma en Whisper**: traduce en vez de transcribir. Va
   `ONIA_AUDIO_STT_LANGUAGE=auto`.
8. **Escribir "Seedance 2.5 no existe"** — repetido seis veces citando una verificación propia
   vieja. Existe, 4–30 s. Una verificación tiene fecha de vencimiento.
9. **Trabajar contra el checkout local sin mirar `origin/main`.** El worktree estaba 494
   commits atrás y un archivo mostraba la voz **descartada** de Lucía como oficial.
10. **Generalizar desde una lámina.** Dije que las 8 del carrusel de agentes traían prompt;
    traía 1 de 10. Leer todas o decir cuántas se leyeron.
11. **Heredoc de bash con markdown largo**: se rompe (`unexpected EOF`). Para documentos usar
    la herramienta de escritura.
12. **Salirse del carril** (me fui a offboarding de Arthur). Sergio: *"aquí solo hablamos de
    reels"*.

**Qué depende de Sergio**

| Bloqueo | Qué hace falta |
|---|---|
| **Cosecha automática de DMs** | correr una vez: `node .claude/skills/ver-videos/scripts/cosechar-dm.mjs --login` |
| **MP4 al Drive** | arrastrar el zip de 57 MB a la carpeta |
| **Marca personal** | mandar la propuesta que le hicieron |
| **3 decisiones abiertas** | % del pilar informativo de Lucía · si tiene cuenta propia o comparte `@oniahq` · si el QR dinámico es módulo del core o add-on (bloquea el pricing de L3) |
| **Todo lo 🔴 del banco** | generación paga = permiso caso por caso. R6, R7, R8 esperan |

**Próximos pasos**

1. **Cerrar el lote del 23-ago:** 18 fichas con veredicto + extracción de estilo/diseño,
   prompts repartidos a `sesiones/`, patrones ruteados a `ui-patterns/` y al banco de motion.
2. **Cuando Sergio corra `--login`:** cosechar el hilo entero de `mrsatiras__`, cruzar contra
   `BANDEJA.md` y procesar solo lo nuevo.
3. **Reconciliar `ESTADO_DE_LOS_PROMPTS.md` contra `origin/main`**, no contra este checkout.
4. **Bajar la rama a `main`.** Son 11 commits de docs + skills; `main` corrió 69 commits por
   delante. Cuanto más espera, más caro el merge.
