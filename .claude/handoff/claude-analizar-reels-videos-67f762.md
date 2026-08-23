# Handoff — análisis de reels (video-intake)

- **Rama:** `claude/analizar-reels-videos-67f762`
- **Worktree:** `C:\dev\proyectos\onia-hermes\.claude\worktrees\laughing-heyrovsky-0b48a0`
- **Última sesión:** 2026-08-22

---

## 1 · Objetivo

Recibir los reels que manda Sergio, verlos y transcribirlos, y **repartir** lo que sirve a la
sesión que le toca como prompt copy-paste.

**Hecho =** cada item mandado tiene ficha con veredicto, y todo lo `SIRVE YA` tiene prompt en
el archivo de su sesión. **El carril no ejecuta lo que descubre: reparte.**

> Excepción registrada: el **2026-08-22** Sergio pegó el prompt N1 acá y pidió ejecutarlo. Se
> hizo. Fue instrucción explícita suya, no deriva de carril — pero conviene que el próximo
> cierre revise si el alcance del carril cambió o fue una vez sola.

---

## 2 · Qué quedó VIVO en producción

**Nada de este carril toca producción.** Es documentación y skills; el valor se realiza cuando
otra sesión pega un prompt.

Lo único encendido y verificado:

- **`.claude/skills/sacar-prompt/`** — instalada y **probada**: `preparar.sh` corrido sobre un
  video de 7,7 s dio 4 fotogramas base + 31 densos. Muestrea por densidad de texto (peso del
  jpg), no por intervalo fijo.
- **El ciclo de intake completo, corrido hoy de punta a punta** sobre `DbT8hWPsyjN`:
  descarga → 66 fotogramas → transcripción Whisper 100% (182 palabras) → ficha → prompts →
  repartidos → 125 links verificados, 0 rotos → commit `b57b6cf1` pusheado.
- **9 commits en la rama, 40 archivos**, todos pusheados a `origin`.

---

## 3 · Qué quedó a medias, y dónde exactamente

| Qué | Dónde | Estado exacto |
|---|---|---|
| **`cosechar-dm.mjs`** — cosechador de DMs | `.claude/skills/ver-videos/scripts/cosechar-dm.mjs` | **escrito y sin estrenar.** Falta que Sergio corra `--login` UNA vez. Sin eso no hay sesión y el script sale por el `if` de línea 110. **Es el único paso manual que queda para dejar de mandar links de a uno.** |
| **Los MP4 al Drive** | zip de 57 MB en el scratchpad | armado y **no arrastrado** a la carpeta. El MCP de Drive no traga archivos grandes (146k chars en base64 para el más chico) |
| **22 prompts `SIN_EVIDENCIA`** | `hermes-content/references/video-intake/ESTADO_DE_LOS_PROMPTS.md` | verificados contra el repo el 20-ago: 23 ejecutados, 12 parciales, 3 bloqueados, **22 nunca usados** |
| **Marca personal de Sergio / Lucía** | no existe archivo | Sergio pidió complementar "la propuesta que me hicieron" y **esa propuesta nunca llegó**. Sin ella no hay `SERGIO_MARCA_PERSONAL_MASTERPLAN` |

**Nada de esto está detrás de un flag: está sin arrancar, que es distinto y peor de esconder.**

---

## 4 · Archivos y cambios

Todo bajo `hermes-content/references/video-intake/` salvo lo marcado.

| Commit | Qué |
|---|---|
| `b57b6cf1` | ficha `handoff.md` + verbatim + N1–N3 repartidos |
| `819c84b9` | lote de 14 del 22-ago, M1–M5 |
| `23bab36a` | lote de 9, L1–L3 |
| `22b4c4f3` | **`.claude/skills/ver-videos/scripts/cosechar-dm.mjs`** (nuevo) |
| `17cc2af3` | el chat con `mrsatiras__` es la fuente real del carril |
| `06ae2b43` · `4214fcea` | **`.claude/skills/sacar-prompt/`** (nueva) + registrada en `CLAUDE.md` |
| `e3ceb303` · `418c1c05` | los 25 pendientes en un archivo; J5/J6; sacada la etiqueta de Arthur |

Estructura estable: `INDEX.md` (entrada) · `sesiones/` (12 archivos, uno por sesión,
autocontenidos) · `PROMPTS_LOTE_<fecha>.md` (fuente) · `BANCO_DE_REPLICABLES.md` (cola de
producción R1–R13) · `METODO_DE_ANALISIS.md` · `BANDEJA.md` · `transcripciones/`.

**Fuera del carril, tocado hoy por instrucción explícita:** `CLAUDE.md` (regla de cierre +
fila en la tabla de ubicaciones) y `hermes-content/docs/HANDOFF_DE_SESION.md` (nuevo).

---

## 5 · Intentos fallidos — no repetirlos

1. **Cosechar los DMs clickeando por coordenadas.** Repetía siempre el mismo post: los posts
   compartidos **no exponen su URL en el DOM**. Pedirle a la API de IG directamente devuelve
   500 y el navegador bloquea la manipulación de cookies/query. **Lo que sí funciona** es
   escuchar `page.on('response')` sobre `direct_v2|graphql` — leer lo que la página ya pide,
   no pedir nada. Ya está implementado así; **no volver al clic**.
2. **Lanzar el análisis antes de que termine la transcripción.** 8 de 10 items quedaron sin
   audio. Esperar siempre.
3. **Forzar el idioma en Whisper**: traduce en vez de transcribir. Va
   `ONIA_AUDIO_STT_LANGUAGE=auto`.
4. **Escribir "Seedance 2.5 no existe"** — lo repetí seis veces citando una verificación
   propia vieja. **Existe, 4–30 s.** Una verificación tiene fecha de vencimiento: se repite,
   no se cita.
5. **Trabajar contra el checkout local sin mirar `origin/main`.** El worktree estaba **494
   commits atrás** y eso hizo que un archivo mostrara la voz **descartada** de Lucía como
   oficial. Verificar contra `origin/main`.
6. **Generalizar desde una lámina.** Dije que las 8 del carrusel de agentes traían prompt;
   traía **1 de 10**. Leer todas o decir cuántas se leyeron.
7. **Heredoc de bash con markdown largo**: se rompe (`unexpected EOF`). Para documentos usar
   la herramienta de escritura; el heredoc solo para texto corto.
8. **Salirse del carril** (me fui a offboarding de Arthur). Sergio: *"aquí solo hablamos de
   reels"*.

---

## 6 · Qué depende de Sergio

| Bloqueo | Qué hace falta |
|---|---|
| **Cosecha automática de DMs** | correr **una vez**: `node .claude/skills/ver-videos/scripts/cosechar-dm.mjs --login`. Es el único paso manual que queda |
| **MP4 al Drive** | arrastrar el zip de 57 MB a la carpeta |
| **Marca personal** | mandar la propuesta que le hicieron. Sin eso no arranca |
| **3 decisiones abiertas** | % del pilar informativo de Lucía · si tiene cuenta propia o comparte `@oniahq` · si el QR dinámico es módulo del core o add-on (bloquea el pricing de L3) |
| **Todo lo 🔴 del banco** | generación paga = permiso caso por caso. R6, R7, R8 esperan |

---

## 7 · Próximos pasos

1. **Esperar el próximo lote de links** y correr el ciclo de siempre: descargar → transcribir
   (esperar a que termine) → fotogramas por densidad → ficha con las cuatro reconstrucciones →
   prompts → repartir a `sesiones/` → verificar links → commit.
2. **Cuando Sergio corra `--login`:** cosechar el hilo entero de `mrsatiras__`, cruzar contra
   `BANDEJA.md` para saltar lo ya analizado, y procesar solo lo nuevo.
3. **Revisar el alcance del carril.** Hoy se ejecutó N1 acá. Si Sergio quiere que este carril
   siga ejecutando prompts además de repartirlos, se cambia el encabezado de `INDEX.md`; si
   no, fue una excepción y se deja como está.
4. **Reconciliar `ESTADO_DE_LOS_PROMPTS.md` contra `origin/main`**, no contra este checkout.
   Los 22 `SIN_EVIDENCIA` pueden haber bajado.
