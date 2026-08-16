# Cinco plugins para Claude Code — cuatro ya los tenemos, uno no (y es el de seguridad)

- **Video:** https://www.instagram.com/p/Db9TebcvW51/ · 48 s
- **Carril:** B
- **Cobertura real:** audio 100% ([verbatim](transcripciones/Instagram-Db9TebcvW51.txt)) · 2 de 12 fotogramas
- **Veredicto: SIRVE — 1 hallazgo real de 5, verificado con fuente**

---

## Los cinco, contra lo que ya tenemos

| # | El video dice | ¿Lo tenemos? |
|---|---|---|
| 1 | **Playwright CLI** — *"abrir navegadores, tomar capturas... y ver errores antes de que vos los veas"* | **SÍ.** Playwright ya es el motor de `fetch-video.mjs`, y hay dos navegadores por MCP |
| 2 | **Supabase** — *"construir bases de datos completas... sin salir de tu terminal"* | **SÍ.** MCP de Supabase conectado |
| 3 | **Strix** — *"atacar tu aplicación creada con vibe coding como si fuese un hacker real"* | **NO** ← el único hallazgo |
| 4 | **Skill UI** — *"le pegas el link de cualquier sitio... aplica ingeniería inversa a todo el sistema de diseño... en un archivo .md"* | **SÍ.** `stitch-extract-design-md` + `design-md` hacen exactamente eso |
| 5 | **Context7** — *"la versión más reciente de las librerías y dependencias"* | **SÍ.** MCP de Context7 + el subagente `docs-lookup` |

## El hallazgo: Strix

**Verificado con fuente, no repetido del video.** Existe, es real y es abierto:

- Repo: [github.com/usestrix/strix](https://github.com/usestrix/strix), licencia Apache 2.0.
- Qué hace: agentes autónomos que **corren la app**, la exploran, explotan fallas y **validan
  cada hallazgo con una prueba de concepto real** — no un listado de "posibles vulnerabilidades".
- Herramientas del agente: proxy HTTP para manipular request/response, navegador para caminos de
  cliente (XSS, CSRF), terminal, y entorno Python para exploits propios.
- Costo: la CLI abierta es gratis; **se paga el consumo de LLM**.

Fuentes: [GitHub](https://github.com/usestrix/strix) ·
[Help Net Security](https://www.helpnetsecurity.com/2025/11/17/strix-open-source-ai-agents-penetration-testing/)

## Por qué nos importa a nosotros en particular

No es curiosidad. Es que **lo que exponemos ya es sensible**: la plataforma maneja registro de
clientes, datos de pacientes en el pack dental, y hay carrito y checkout en construcción. La
seguridad de producción se cerró y se verificó el 2026-08-11 — pero eso fue una **revisión**,
no un ataque. Un agente que valida con prueba de concepto encuentra otra clase de cosa.

**El bloqueo real, dicho antes de que alguien lo intente:** Strix consume LLM y necesita **API
key propia**. Las keys del `.env` están inválidas (memoria `claude-guardia-vps`), y la
suscripción de Claude Code **no sirve** para esto: no es una API. O sea, **hoy no se puede
correr sin gasto nuevo**, y gasto nuevo = permiso explícito de Sergio. No lanzarlo por las
dudas.

## Filtro 1

Cierra con *"comenta ya y te los paso"* — cebo; los cinco nombres están dichos en cámara, no
hace falta comentar. Los 5 se verificaron uno por uno contra lo que tenemos instalado: **4 de 5
eran ruido para nosotros**. Ese es exactamente el trabajo del filtro.

## A dónde va

| Sesión | Qué |
|---|---|
| **`pendiente`** | evaluar Strix contra un entorno de prueba — **con el costo estimado ANTES de correrlo** (prompt E5) |
