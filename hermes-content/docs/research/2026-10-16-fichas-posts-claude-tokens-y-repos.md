# Fichas de aprendizaje — dos posts de Instagram (16-oct-2026)

Enviados por Sergio Urcullo sin instrucción = aprender (`aprender-de-todo`). Nada se publica ni se gasta.
Capturas vistas renderizadas en la sesión; método de descarga en `.claude/skills/ver-videos/SKILL.md`.

## 1. `/p/DedkCc6olmo/` — @aiagently «10 best GitHub repos for Claude» (imagen única, 2.566 likes)
**Qué enseña:** lista de 10 repos de skills/plugins para Claude: REA (ingeniería inversa con agentes), Ponytail
(DietrichGebert/ponytail, código mínimo), Hallmark (nutlope, diseño no genérico), Humanizer (blader), Onyx/taste-skill
(senlindesign), **Impeccable** (pbakaus), **UI/UX Pro Max** (nextlevelbuilder), Last 30 Days (mvanhorn), Scrapling (D4Vinci),
Diagram Design (cathrynlavery).
**Patrón de formato:** portada de afiche con logos + titular «Don't use X without…», rejilla 5x2 de tarjetas iguales (número en
círculo rojo, ícono, nombre, una línea de beneficio, ruta del repo), «Follow» abajo. Rinde en guardados por ser lista.
**Qué se implementa:**
- ONIA: Impeccable y UI/UX Pro Max **ya están instaladas** (skills `impeccable`, `ui-ux-pro-max`): nada nuevo. Candidatos a
  evaluar, no instalar sin OK (regla de descargas): `Ponytail` (código corto), `Diagram Design`, `Scrapling` (investigación de competencia).
- Marca de Sergio Urcullo: el formato «lista de N herramientas para X» es válido para un carrusel de **su** nicho; NO copiar
  titular ni rejilla. Tiene que pasar `diseno-contenido-onia`; ONIA Platform no usa este estilo (pauta ≠ marca personal).

## 2. `/p/DecFE1oDNd3/` — @mindshft.ai «8 comandos para ahorrar tokens en Claude Code» (carrusel 10 láminas, 237 likes)
**Qué enseña (caption + láminas):** el límite se acaba por el **contexto** (cada mensaje recarga conversación + skills + MCP +
plugins activos). Comandos: `/doctor` (qué cuesta tokens sin usarse), `/compact`, `/rewind`, `/plan`, `/effort`, `/model`, y dos
plugins de terceros (`/ponytail`, `/handoff`; «revisa el código antes de instalar»). 1-6 vienen de serie.
**Patrón de formato:** portada foto + titular grande + botón «DESLIZA →»; láminas de fondo liso con «Primero/Segundo…
<comando en naranja>», 3 líneas de texto, captura real del producto y una línea «úsalo cuando…»; CTA «Comenta TOKENS y te paso
la guía» (mecanismo comentario→DM, que en ONIA tiene 2 rechazos de Meta: no copiarlo como CTA).
**Qué se implementa:**
- ONIA (cuidado de tokens, ya es regla): reforzar en las sesiones de la nube `/compact` al cambiar de subtarea y `/effort` bajo
  en tareas mecánicas; el router ya manda modelo por rol. Nota: «ONIA ya tiene `handoff` propio» (regla «cambio de sesión»).
- Marca de Sergio Urcullo: la estructura «cada lámina = un comando + cuándo usarlo + captura real» es buena receta de carrusel
  educativo; hacerlo con SU interfaz y su tema, no el fondo arena/naranja de ellos.
- Faltó ver: lámina 10 (imagen, CTA final).
