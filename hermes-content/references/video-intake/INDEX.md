# Video Intake — reels/TikToks que manda Sergio

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

➡️ **Lo que hay que hacer con esto vive en [PENDIENTES.md](PENDIENTES.md)** — un ítem por
acción, con el prompt listo para abrir la sesión del carril que corresponda. Las fichas
analizan; PENDIENTES es la cola de trabajo.

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
