# Handoff — carril `serie Claude Code` (YouTube + piezas diarias)

Última actualización: **2026-09-21**. Rama: `claude/marca-personal-carruseles-dist-deadab`
(limpia, todo pusheado). Escrito para que **Codex** lo tome sin haber visto la sesión.

> ⚠️ `origin/main` está **863 commits por delante** de esta rama (medido el 21-sep). Antes
> de tocar código, rebasar. Para trabajo de contenido (docs, guiones, decks) no hace falta.

---

## 1. Objetivo

Publicar la serie **«Claude Code de cero»** (6 videos) en YouTube y alimentar las piezas
diarias de redes. Mapa de la serie: `hermes-content/docs/SERIE_CLAUDE_CODE.md`.

**Definición de "hecho" de esta tanda:** video 03 publicado y verificado vivo, y el 04
con deck y guion **verificados contra la fuente** (no heredados).

**Estado: cumplido.** Lo que sigue abierto está en §3.

---

## 2. Qué quedó EN PRODUCCIÓN

Verificado el **21-sep** con `curl .../oembed` (no de memoria):

| Video | URL | Estado |
|---|---|---|
| 01 · Claude y Claude Code no son lo mismo | `youtu.be/kAsAhGe6zyA` | 🟢 público |
| 02 · Instalarlo y tu primera skill | `youtu.be/oXaqV-HDufA` | 🟢 público |
| **03 · Hago que la IA trabaje mientras duermo** | **`youtu.be/8iMRBo7ppac`** | 🟢 **público, publicado 18-sep** |

Del 03, puesto por esta sesión: descripción completa con **capítulos de tiempos reales**
(sacados de transcribir el render, no del guion), miniatura propia, «no es contenido para
niños», visibilidad pública, y la web `sergiourcullo.vercel.app` en la descripción.
Las verificaciones de copyright terminaron con **«no se encontraron problemas»**.

---

## 3. Qué quedó a medias, y dónde

1. 🔴 **Video 04 — deck y guion LISTOS Y CORREGIDOS, sin grabar.**
   `hermes-content/carousels/out/yt-04-verificar/`. Es el siguiente a grabar.
2. **Videos 05 y 06** — deck listo, guion NO. Carpetas `yt-05-no-construyas/` y
   `yt-06-mi-empresa/`.
3. **Desliz sin resolver en el 03 ya publicado**: en **2:31** dice *«yo tengo cuatro»*
   subagentes y en **4:44** dice *«tres»*. El correcto es **3** (el 4 cuenta el
   `README.md` de `.claude/agents/` como si fuera un agente). Se arregla con un corte de
   2 s en CapCut y resubida, o se deja. **Decisión de Sergio Urcullo, pendiente.**
4. **No existe playlist de la serie.** El canal solo tiene: ropa, Fútbol, Boxeo, Mainca,
   olimpiadas, Salva el mundo. Con 3 videos ya conviene crearla. Pendiente de su OK.
5. **Falta elegir el plugin prometido en cámara.** En **3:29** del 03 dice *«te puedo
   dejar un plugin en la descripción»*. Hoy la descripción linkea
   `anthropics/claude-plugins-official` como default anunciado, no elegido por él.

---

## 4. Archivos

| Qué | Dónde |
|---|---|
| Guion y deck del 04 (corregidos) | `hermes-content/carousels/out/yt-04-verificar/{GUION,README}.md`, `deck.html` |
| **Demo del falso verde** (corre y funciona) | `hermes-content/carousels/out/yt-04-verificar/demo-falso-verde/demo.sh` |
| Guion y deck del 03 | `hermes-content/carousels/out/yt-claude-code-automatizacion/` |
| Descripciones de los 6, listas para pegar | `hermes-content/docs/SERIE_CLAUDE_CODE_DESCRIPCIONES.md` |
| Mapa y reglas de la serie | `hermes-content/docs/SERIE_CLAUDE_CODE.md` |
| **Guiones encolados para el día siguiente** | `hermes-content/docs/cola/GUIONES-GUARDADOS-PROXIMO-DIA.md` |
| Grabador de pantalla sin mano humana | `scripts/marca-personal/grabar_pantalla.py` (acepta `perfil=`) |
| Login persistente para sitios con sesión | `scripts/marca-personal/abrir_sesion.py` |
| Clips ya grabados | `E:\ONIA-YouTube\grabaciones\samuel\` |
| Video editado del 03 | `E:\ONIA-YouTube\editado\video 03 claude editado por capcut sergio.mp4` |

---

## 5. Intentos fallidos — no los repitas

1. 🔴 **`file_upload` del navegador NO sube videos: corta en 10 MB.** El 03 pesa 307 MB.
   El archivo lo tuvo que arrastrar Sergio Urcullo a mano; todo el resto del formulario sí
   se automatiza. **No hay vuelta a esto salvo credenciales de YouTube Data API v3.**
2. **No hay credenciales de YouTube en el sistema.** Solo `GOOGLE_CALENDAR_*`, que no
   sirven. Sin `youtube-upload`, sin `gcloud`, sin `rclone`.
3. **Postiz está caído (502)** — verificado varias veces el 18-sep y sigue así.
4. **La API key de n8n en `~/.claude.json` está VENCIDA** (`{"message":"Unauthorized"}`),
   aunque el MCP de n8n sí responde. No sirve para curl directo.
5. **Playwright con `headless=False` falla en este entorno**: `BrowserType.launch: spawn
   UNKNOWN`. El sandbox no abre ventanas con interfaz. Headless funciona perfecto.
   Por eso `abrir_sesion.py` lo tiene que correr Sergio Urcullo en SU terminal.
6. **Speaches (127.0.0.1:3108) no responde.** Para transcribir se usó `faster_whisper`
   local, que sí está instalado. Modelo `base` se equivoca con números y nombres propios
   — para verificar un dato hay que usar `small`.
7. **Chrome headless con `--screenshot` no escribió el PNG** del deck; Playwright sí.

---

## 6. Qué depende de Sergio Urcullo

| # | Qué | Por qué no puedo yo | Criterio de listo |
|---|---|---|---|
| 1 | **Arrastrar el archivo** al subir cada video | límite de 10 MB del puente | el archivo empieza a subir |
| 2 | Correr `python scripts/marca-personal/abrir_sesion.py n8n` (y `higgsfield`) | el login es suyo; yo no escribo contraseñas | la sesión queda en `E:\ONIA-YouTube\grabaciones\_perfiles\` |
| 3 | Decidir el **desliz de 2:31** del 03 | es su video publicado | cortado y resubido, o decidido dejarlo |
| 4 | Decidir la **playlist** de la serie | es su canal | creada, o descartada |
| 5 | Elegir el **plugin** a linkear | es su recomendación | nombre exacto |

---

## 7. Próximos pasos, en orden

1. **Grabar el video 04.** Deck y guion están listos y verificados. Lleva demo en vivo
   (`demo-falso-verde/demo.sh`) — probarla antes de grabar.
2. Publicarlo con el mismo circuito: Sergio arrastra, el resto se automatiza. Los
   capítulos se sacan transcribiendo el render, **nunca del guion** (los tiempos difieren:
   el guion del 03 decía 8:10 y el render dura 6:36).
3. Escribir los guiones del **05** y el **06**.
4. Resolver los cuatro pendientes de §6.

---

## 🔑 Datos verificados — úsalos, no los recalcules ni los inventes

Todo esto se midió el 18-sep. Si un material dice otra cosa, **el material está mal**.

| Dato | Valor | Cómo se verificó |
|---|---|---|
| Hooks | **4** | 3 en `~/.claude/settings.json` + 1 en `.claude/settings.json` del repo |
| Subagentes | **3** | `.claude/agents/`: core-guardian, creative-radar, crm-prospeccion. ⚠️ `ls *.md \| wc -l` da 4 porque cuenta el `README.md` |
| Conectores MCP | **6** en este proyecto | `~/.claude.json`: image-gen, stitch + meta, cloudflare, cloudflare-docs, postiz. Hay un 7º (`n8n-mcp`) pero vive en OTRO proyecto |
| Conectores caídos | **4** | image-gen y postiz caídos; cloudflare y meta sin autorizar |
| Plugins | **9** | `ls -d ~/.claude/plugins/cache/*/` |
| Trabajos por horario | **40 en el VPS**, `0` en casa | `crontab -l` en `187.77.16.63` (uptime 25 días). El nodo-casa: `no crontab for compu_pc_casa_sergio`. ⚠️ La lámina vieja decía «4, en una PC de escritorio en mi casa» y era **falso** |
| Errores en una sesión | **18**, los 18 autodetectados | `handoff/onia-dev-node-setup.md` §5 (4+9+5), contado en las **6** versiones del archivo. ⚠️ El material decía «12, y 11 los encontró él»: el 12 no sale de ningún lado |

**Noticias de IA verificadas el 18-sep** (para guiones; el changelog es la fuente):
- **Claude Code 2.1.277 lee `AGENTS.md`** — *pero solo si el proyecto no tiene `CLAUDE.md`*.
  Era el pedido #1 del repo (5.270 reacciones).
- **Fable 5.1** (Anthropic, 1-sep) y **GPT-6 Astra** (OpenAI, 3-sep; default en Codex el
  4-sep) cuestan **lo mismo por token**.
- `claude plugin eval` — corre la suite de un plugin y da reporte JSON/HTML.

---

## ⚠️ La lección cara de esta tanda

**Los dos videos tenían un dato central falso, y los dos venían de heredar un número sin
recontarlo.** El 03 decía «4 trabajos por horario en una PC de mi casa» (son 40, en un VPS
pagado, y el de casa está muerto). El 04 decía «12 errores» (son 18) — y su guion tenía
escrito arriba *«los números de este video NO cambian, no hace falta recontarlos»*.

**Antes de grabar cualquier video de esta serie, recontar los números contra la fuente.**
Está en las reglas de producción de `SERIE_CLAUDE_CODE.md` y se saltó dos veces.
