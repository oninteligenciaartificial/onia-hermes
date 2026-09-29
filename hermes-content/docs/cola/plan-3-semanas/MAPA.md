# Plan de 3 semanas — el mapa: qué sé, hacia dónde va cada pieza

Propuesta de Claude, 29-sep-2026, **para que Sergio Urcullo la corrija**. Los guiones están en
`S1-GUIONES.md`, `S2-GUIONES.md`, `S3-GUIONES.md`; los carruseles en
`CARRUSELES.md` (esta carpeta).

**Estado 29-sep:** 63 piezas para 21 días (56 escritas hoy + 7 del 28-sep), 9 carruseles
(K1–K3 renderizados con portada de Higgsfield; K4–K9 con brief y vista previa, imagen pendiente
de aprobación). Cada guion pasó la vara de 7 condiciones (`BRIEF-ESCRITOR.md`) y un chequeo
automático (largo, frases prohibidas, datos sensibles). «Comentá PALABRA» quedó en 2 piezas por
semana; el resto cierra en la comunidad (regla del motor semanal).

**Fuentes que usé** (en `hermes-content/references/marca-personal/`): `INVENTARIO-CONOCIMIENTO-ONIA.md`
(67 cosas reales de ONIA que se pueden enseñar), `FORMULAS-REFERENTES.md` (8 fórmulas de tus 6
referentes), `RADAR-ACTUALIDAD-2026-09-29.md` (16 novedades con fuente oficial),
`SANTIAGO-CARRUSELES-POR-CODIGO.md` (su método, del video del 4-mar y su repo público).

## 1. Hacia dónde va todo (el recorrido)

```
  VIDEO / CARRUSEL (público)            →  WEB (guía, público)            →  COMUNIDAD (adentro)          →  ONIA
  IG @sergiourcullo · TikTok ·             sergiourcullo.vercel.app          Onia Community (WhatsApp)       llamada 1:1 (cal.com)
  YouTube (Shorts + largo)                 /claude-code · /vps · /stack      drops diarios · archivos ·      → Onia Platform / chatbot
  enseña UNA cosa completa                 el tema entero, por escrito       preguntas · llamada de 15 min   (quien tiene negocio)
```

- **El video enseña algo completo.** No esconde el cómo para forzar un clic.
- **La web junta la semana** en una guía (regla del motor semanal: «la semana construye la guía»).
- **La comunidad** recibe lo exclusivo: el archivo listo, el prompt completo, lo que salió mal, y
  las respuestas a tu caso.
- **ONIA** aparece como prueba de que lo que enseñás funciona en una empresa real. El que tiene
  un negocio y no quiere hacerlo solo, pide la llamada.

## 2. Mi opinión: el choque que hay que resolver

La **etapa vigente de ONIA** (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §7) es vender Onia Platform a
**clínicas dentales/estéticas** hasta 5 clientes. La audiencia de tu marca personal son **jóvenes
que quieren aprender IA**. No son el mismo comprador.

Mi propuesta: **2 de cada 3 videos para la marca personal (enseñar IA)**, y **1 de cada 3 para
dueños de negocio** (bots, seguimiento, clientes que no vuelven, cuánto cuesta automatizar). Ese
tercio es el que puede traer un lead a ONIA. Si preferís 100 % marca personal, se cambia el
slot C y listo.

## 3. La estructura diaria (3 videos + carruseles)

| Slot | Qué es | Formato | Para quién |
|---|---|---|---|
| **A** | Tutorial del tema de la semana | Vertical 45–70 s | aprende IA |
| **B** | Actualidad o herramienta nueva, probada | Vertical 45–70 s | aprende IA |
| **C** | YouTube largo (lun · mié · vie) · o negocio / historia / criterio (resto) | Horizontal 6–9 min · o vertical | dueños de negocio + marca |

- **Carrusel:** mar · jue · sáb (3 por semana), portada con imagen de Higgsfield y el resto por
  código (`scripts/carousel_render.js`).
- **Grabación:** una hora por día alcanza para 1 horizontal + 2 verticales. Grabar en lote los
  verticales de 2–3 días juntos si hace falta.
- Estos 3 son **los tuyos, a cámara**. El reparto del 17-sep (10–13 piezas con el pilar y el yap
  de Samuel, `ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md`) queda igual si Samuel está produciendo;
  si no, 3 por día es el piso que pediste.

## 4. Las tres semanas

Cada semana tiene UN tema (el slot A lo desarrolla día a día y el domingo se junta en una guía
de la web). El slot B trae lo nuevo de la semana, con fuente oficial. El slot C alterna YouTube
largo con historias reales y negocio.

- **Semana 1 · 30-sep → 6-oct · «Claude Code: que trabaje para vos».** Guía: ya existe
  (`/claude-code`).
- **Semana 2 · 7 → 13-oct · «Un bot de WhatsApp que atiende sin mentir».** Guía: hay que
  escribirla (`/whatsapp-bot`) para el domingo 11. Es la semana que más le habla al dueño de
  negocio: puente directo al chatbot de ONIA.
- **Semana 3 · 14 → 20-oct · «Contenido con IA sin editor (y agentes que te avisan)».** Guía:
  hay que escribirla (`/contenido-ia`) para el domingo 18.

Códigos: los del inventario (`references/marca-personal/INVENTARIO-CONOCIMIENTO-ONIA.md`),
`R#` = fila del radar (`RADAR-ACTUALIDAD-2026-09-29.md`), `✅` = guion ya escrito el 28-sep.

### Semana 1 — Claude Code: que trabaje para vos

| Día | A · tutorial (vertical) | B · actualidad (vertical) | C · YouTube / negocio / historia | Carrusel |
|---|---|---|---|---|
| mié 30 | C-05 primera skill ✅ | Sonnet 5.5 salió (R4) ✅→mejorar | **YT** Opus 5.5 o Sonnet 5.5 ✅ | — |
| jue 1 | C-12 esfuerzo ✅ | WhatsApp cobra desde el 1-oct (R1) | negocio: costo escondido de un presupuesto ✅ | K1 Opus o Sonnet: la tabla |
| vie 2 | C-03/C-04 hook Stop + su guarda ✅→mejorar | Claude Code lee AGENTS.md (R7) | **YT** Un CLAUDE.md donde cada regla trae su historia (C-01, C-02) | — |
| sáb 3 | C-09 subagentes: cuándo sí y cuándo no | /skill-doctor (R8) | historia: «verificado» con un 200 (E-01) | K2 Tu primera skill en 5 pasos |
| dom 4 | C-11 worktrees y carriles | Claude Design/Slides gratis (R3) | historia: los 44 workflows ✅ | — |
| lun 5 | C-08 handoff de siete campos | Fable, Opus o Sonnet: cuál y cuánto (R15) | **YT** Claude Code en un servidor, sin API key, con barandas (A-01, A-02, A-03) | — |
| mar 6 | C-06 router de skills | C-10 24 MCP conectados, cero usados | negocio: ¿necesito inversión? la cuenta (S-03) | K3 CLAUDE.md con historia |

### Semana 2 — Un bot de WhatsApp que atiende sin mentir

| Día | A · tutorial | B · actualidad | C | Carrusel |
|---|---|---|---|---|
| mié 7 | W-01 ventana de 24 h ✅ | WhatsApp Business Tools MCP (R2) | **YT** Un bot que no inventa: hechos aparte, guardrails y medición (W-06, W-07, W-09) | — |
| jue 8 | bot con dos listas ✅ (W-06) | n8n 2.40: forzar la herramienta (R9) | negocio: cuánto cuesta tu bot desde octubre (R1) | K4 5 pruebas antes de activar tu bot |
| vie 9 | W-04 el bot que contesta dos veces | voz para tu bot: Gemini TTS (R11) | **YT** El mensaje que se perdía: webhook caído, rescate y firma (W-03, W-05) | — |
| sáb 10 | W-02 barridos que no escriben de madrugada | Gemini 2.5 se retira: migrar en n8n (R10) | historia: el vigía ciego 41 días (E-07) | K5 Seguimiento que no molesta |
| dom 11 | W-10 no te escribas a vos mismo | W-08 notas de voz y fotos | negocio: cobrar en Bolivia sin Stripe (S-06) | — |
| lun 12 | W-09 medir si tu bot entiende | W-11 n8n sin secretos en los nodos | **YT** Probá el recorrido entero: del botón de la web a la respuesta del bot (L-05) | — |
| mar 13 | W-07 el bot que se edita sin redeploy | A-07 vigías: avisar por cambio | negocio: tu cliente en 5 preguntas (S-05) | K6 Confirmado / por confirmar |

### Semana 3 — Contenido con IA sin editor (y agentes que te avisan)

| Día | A · tutorial | B · actualidad | C | Carrusel |
|---|---|---|---|---|
| mié 14 | V-01 cortar silencios por código (reemplaza al V7 flojo) | borrador 480p antes del render: gastar menos (R14, V-09) | **YT** Grabo, la IA edita: mi sistema paso a paso (V-01, V-02, V-06) | — |
| jue 15 | V-02 subtítulos karaoke + lectura a ojo | GPT Image 2.5 para fotos de producto (R6) | historia: arreglé el botón y la home prometía lo viejo (E-02) | K7 Carruseles por código |
| vie 16 | V-06 carruseles: de un JSON a las láminas | Sora sale de la API: qué usar (R16) | **YT** Generar con IA sin fundirte: costo antes de crear (V-09, R13) | — |
| sáb 17 | V-03 difuminar caras de terceros | V-05 sacar el prompt de una imagen | historia: publicar un rediseño sin que el dueño lo vea (E-03) | K8 Recuperar vs reconstruir un prompt |
| dom 18 | V-04 que la IA «vea» un video | V-08 video desde HTML (HyperFrames) | A-05 aprobaciones desde el celular | — |
| lun 19 | V-10 la miniatura se busca puntuando | V-07 el verde que no se lee | **YT** Agentes que trabajan de noche: de 443 avisos a 1 parte (A-05, A-06, A-07) | — |
| mar 20 | A-10 que no repita errores | A-11 un loop sin cola inventa trabajo | negocio: construido y apagado vale cero (E-09) | K9 Checklist antes de publicar con IA |

**Total:** 63 videos (9 YouTube horizontales + 54 verticales) · 9 carruseles. 9 guiones ya
estaban del 28-sep; 54 son nuevos o reescritos.

## 5. Antes de grabar cada pieza (lo que no se pudo probar hoy)

| Pieza | Qué falta |
|---|---|
| D05-B Slides gratis | Hacer la demo en una cuenta Free. Si no sale, no se publica |
| D04-B /skill-doctor | Contadas el 29-sep: 215 skills globales. Recontar el día de grabar y mirar la pantalla real de `/skills` |
| D08-B n8n 2.40 | ONIA corre n8n 2.35.3: la opción nueva se muestra desde la doc, no desde nuestro n8n |
| D09-B voz con Gemini | Grabar la prueba en AI Studio antes; ONIA no tiene voz construida |
| D11-B audios del bot | Los logs del bot no muestran ningún audio en 10 días: mandale un audio de prueba desde el WhatsApp de Onia antes de grabar |
| D14-B borrador 480p | ✅ Resuelto 29-sep: existe (`--draft true`), cotizado 15 cr contra 60 en 1080p |
| D15-B GPT Image 2.5 | Hacer la prueba de foto de producto antes de grabar |
| D16-C costos | Recotizar con `higgsfield generate cost` el día de grabar |
| D19-B contraste | El README de la web dice 1,7:1; recalculado sobre el fondo real da 2,2:1 (el guion usa 2,2) |

Regla general: **toda cifra que envejece se recuenta el día de grabar** (skills, precios, versiones).

## 6. Lo que queda fuera a propósito

- **GPT-6 (R5):** las páginas de OpenAI dieron 403; solo hay foro. No entra hasta tener fuente.
- **S-09 agentes sin LLM:** es buena lección, pero contradice cómo se vende el producto
  («Agentes con IA»). Decisión tuya antes de grabarla.
- **SIAT, cobro por API del banco, webs generadas:** no están terminados; la venta no exhibe obra.
- **Genjutsu (R12):** para enseñarlo hay que generar video (permiso de gasto aparte).
