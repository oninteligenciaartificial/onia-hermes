# Video Intake — reels/TikToks que manda Sergio

> ## Alcance de esta sesion (Sergio, 2026-08-13)
>
> **Aca SOLO se analizan reels y se reparten a su sesion.** Nada mas.
>
> El ciclo completo y unico: recibir link -> bajar -> ver -> transcribir -> ficha con veredicto
> -> asignar la sesion que le toca -> prompt para esa sesion.
>
> **NO se hace aca:** construir lo que el video sugiere, arreglar lo que aparezca roto,
> auditar frentes, verificar cuentas, escribir manuales de produccion. Si algo de eso hace
> falta, se anota en la ficha y se manda a su sesion. Esta sesion no ejecuta: reparte.

> **Cómo se analiza:** [METODO_DE_ANALISIS.md](METODO_DE_ANALISIS.md) — dos carriles (video
> hecho con IA / video que cuenta una idea) y dos filtros (calidad de la fuente, calidad de mi
> entrega). Antes de escribir una ficha se carga la skill del tema:
> [SKILLS_DEL_CARRIL.md](SKILLS_DEL_CARRIL.md).
>
> **Prompts que salen de acá — para pegar:** [`sesiones/`](sesiones/README.md) tiene **un
> archivo por sesión**, autocontenido (preámbulo + gates + todos sus prompts, en orden). Es lo
> que se abre para trabajar.
>
> **La fuente de esos prompts:** [PROMPTS_POR_SESION.md](PROMPTS_POR_SESION.md) (lotes hasta el
> 15-ago) · [PROMPTS_LOTE_2026-08-16.md](PROMPTS_LOTE_2026-08-16.md) (E1–E11) · [PROMPTS_LOTE_2026-08-17.md](PROMPTS_LOTE_2026-08-17.md) (F1–F3) · [PROMPTS_LOTE_2026-08-18.md](PROMPTS_LOTE_2026-08-18.md) (G1–G6) · [PROMPTS_LOTE_2026-08-19.md](PROMPTS_LOTE_2026-08-19.md) (H1–H3, I1–I2). Si cambia una
> regla, se edita acá, no la copia de `sesiones/`.

Bandeja de entrada de videos para **extraer información y decidir si sirve**. Distinta de
`../creator-video-references/`, que estudia patrones creativos (hook, ritmo, CTA); acá el
eje es **¿nos sirve, mejora algo nuestro, o es humo?**

**Cómo se procesa** (cada video deja SIEMPRE dos archivos, no solo el análisis):

1. `fetch-video.mjs <url>` — baja el MP4 sin abrir navegador. El MP4 no se versiona.
2. `gemini-see-video.mjs` — lo ve nativo (imagen + audio + timeline + texto en pantalla).
3. `transcribe.sh` — verbatim palabra por palabra con timestamps (Speaches, gratis). Solo
   si el video tiene locución.
4. **`transcripciones/<slug>.md`** — la lectura completa + el verbatim, tal cual salieron.
   Es la fuente; se guarda aunque el veredicto sea HUMO.
5. **`<slug>.md`** — la ficha: qué dice, veredicto, a qué frente aplica, riesgo.

Gemini da la lectura estructurada con citas; Whisper da el verbatim literal. Los dos, porque
sirven para cosas distintas: uno para entender, el otro para citar sin deformar.

**Veredictos:** `SIRVE YA` · `MEJORA LO ACTUAL` · `FUTURO` · `HUMO`.

➡️ **Lo que hay que hacer con esto vive en dos archivos.** Las fichas analizan; estos dos
reparten el trabajo:

- **[PROMPTS_POR_SESION.md](PROMPTS_POR_SESION.md)** — un prompt copy-paste por sesión
  abierta (`chatbot`, `INFLUENCERS IA`, `onia-plattform`, `Carrito de compra`,
  `Estructura de pagos`, `editor de videos`, `web-factory`…). **Empezar acá.**
- **[PENDIENTES.md](PENDIENTES.md)** — la cola V-1..V-7 de la primera tanda, con el filtro
  de "¿ayuda a vender o cobrar?".

## Tanda 2026-08-11 — 20 fichas

De 24 links: 16 procesados con Gemini nativo, 4 por el camino alternativo (audio + muestra
de fotogramas) porque se agotó la cuota diaria del free tier, 6 eran carruseles de imágenes
sin video y 1 era un link de mensajes directos.

**9 de 20 salieron `HUMO`** y no se repartieron a ninguna sesión. La lista de descartes y su
motivo está al final de [PROMPTS_POR_SESION.md](PROMPTS_POR_SESION.md).

Lo que sí sirve, por orden de valor:

| Ficha | Veredicto | Sesión |
|---|---|---|
| [Seedance: prompt por escenas](2026-08-11-seedance-prompt-por-escenas-timestamps.md) | SIRVE YA | INFLUENCERS IA |
| [Chatbot y dato sensible](2026-08-11-chatbot-dato-sensible-ley-21719-chile.md) | SIRVE YA | chatbot |
| [5 herramientas con Claude](2026-08-11-cinco-herramientas-contenido-claude.md) | SIRVE YA | pendiente (Apify) |
| [Handy — dictado por voz](2026-08-11-handy-dictado-voz-alternativa-wispr-flow.md) | SIRVE YA | pendiente |
| [32 plantillas HyperFrames](2026-08-11-hyperframes-32-plantillas-microanimacion.md) | MEJORA | editor de videos |
| [Carrito flotante](2026-08-11-carrito-flotante-react-ecommerce.md) | MEJORA | Carrito de compra |
| [Checkout tarjeta animada](2026-08-11-checkout-tarjeta-animada-3d.md) | MEJORA | Estructura de pagos |
| [PostHog → agente de producto](2026-08-11-posthog-agentes-producto.md) | MEJORA | onia-plattform |
| [Portafolio agrupado](2026-08-11-portafolio-emails-preventa-curso.md) | MEJORA | web-factory |
| [Dropzone con progreso](2026-08-11-dropzone-progreso-clip-path.md) | FUTURO | Importación de productos |
| [Web 3D scrollytelling](2026-08-11-web-3d-scrollytelling-united-carriers.md) | FUTURO | web-factory (techo) |

### Carruseles (6, recuperados el 11-ago)

`yt-dlp` no puede con carruseles de imagenes. Se agregó `ig-carousel.mjs` y se recuperaron
los 6: **55 láminas + los 6 captions**, leídos sin Gemini. Traían lo mejor de la tanda.

| Ficha | Veredicto | Sesión |
|---|---|---|
| [Mapa de 42 skills de diseño](2026-08-11-mapa-42-skills-diseno-claude.md) | SIRVE YA | web-factory |
| [7 agentes de venta](2026-08-11-ejercito-7-agentes-ventas.md) | MEJORA | CRM / agentes |
| [Los otros 4 carruseles](2026-08-11-carruseles-menores.md) | 1 SIRVE YA · 1 FUTURO · 2 HUMO | varios |

## Tanda 2026-08-09 — 6 fichas

## Índice

| Fecha | Ficha | Veredicto | Frente |
|---|---|---|---|
| 2026-08-09 | [SOUL 2.0 + Seedance 2.5 + skills](2026-08-09-higgsfield-soul2-seedance25.md) | SIRVE YA* | Influencers IA / skills video |
| 2026-08-09 | [Panel LIVE OPS en la pared](2026-08-09-live-ops-dashboard-maria-wendt.md) | MEJORA LO ACTUAL | ONIA Center / ventas |
| 2026-08-09 | [Web antes/después (FIND Real Estate)](2026-08-09-web-antes-despues-find-real-estate.md) | SIRVE YA | Web Factory / portafolio |
| 2026-08-09 | [10 errores de seguridad en apps IA](2026-08-09-10-errores-seguridad-apps-ia.md) | SIRVE YA | Infra / release ONIA Platform |
| 2026-08-09 | [Visión computacional sobre ganado](2026-08-09-supra-vision-ganado-vision-computacional.md) | FUTURO + formato | Ganadero OS / demos |
| 2026-08-09 | [AI Loops + /code-review](2026-08-09-ai-loops-code-review.md) | HUMO PARCIAL | Harness / contenido |

\* condicionado a verificar que SOUL 2.0 y Seedance 2.5 estén en la cuenta y a qué costo.

---

## Hallazgo transversal de la tanda 2026-08-09 — el CTA comentario→DM

**Cuatro de los seis** videos cierran igual: *"comenta `Workflow`"*, *"comenta `seguridad`"*,
*"comenta `loop`"* → el creador manda un recurso por DM. No es una coincidencia de nicho:
es **un motor de captación de leads**, y es la pieza más vendible de toda la tanda.

Por qué importa para ONIA más que cualquiera de los seis temas:

- Convierte contenido educativo en **lead con nombre y conversación abierta**, no en un like.
- El recurso prometido (guía, plantilla, checklist) es material que en varios casos **ya
  tenemos escrito** — los 10 puntos de seguridad, el checklist de release, el pipeline de video.
- Encaja con la infraestructura ya montada: Chatwoot corriendo en el VPS, atribución de
  leads `?src=` viva en producción, pipeline de CRM.

**El bloqueo honesto:** automatizar comentario→DM en Instagram exige permisos de mensajería
de la Graph API, y el token de IG sigue pendiente (bloqueo S6). Además la ventana gratuita
de 24 h de WhatsApp se cierra el **1-oct-2026**, lo que cambia el costeo de cualquier
embudo que termine en WhatsApp. Manual (responder los DMs a mano) funciona desde el primer
día y no depende de nada.

**Propuesta de orden**, si Sergio quiere convertir esto en trabajo:

1. Piezas antes/después de las webs ya entregadas → portafolio → sube el precio. Cero costo,
   cero dependencias, ataca un bloqueo comercial real.
2. Cerrar los 3 agujeros de seguridad que el video #4 nombra y que tenemos abiertos en prod.
3. Verificar SOUL 2.0 / Seedance 2.5 en la cuenta (consulta gratis) antes de decidir gasto.
4. Tiles LTV:CAC + ROAS en ONIA Center — condición previa para escalar pauta con criterio.
5. Comentario→DM: empezar manual; automatizar cuando se destrabe el token de IG.
