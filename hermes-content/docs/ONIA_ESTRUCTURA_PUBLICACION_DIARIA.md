# Estructura de publicación diaria — el reparto por cuenta y la escalera a YouTube

> Dictada por Sergio Urcullo el **2026-09-17** («anota esa estructura»). Fuente única del
> reparto diario de piezas. Sin fecha en el nombre a propósito: si cambia, se EDITA acá.
> El ritmo temático semanal (tema → 6 ángulos → guía) sigue mandando desde
> [`ONIA_MOTOR_SEMANAL_CONTENIDO.md`](ONIA_MOTOR_SEMANAL_CONTENIDO.md); los lugares y
> exclusividades, desde [`ONIA_DONDE_VA_CADA_COSA.md`](ONIA_DONDE_VA_CADA_COSA.md).

## El reparto del día

| Carril | Piezas | Quién | Detalle |
|---|---|---|---|
| **Feed** | 3 | pilar: **Samuel** · b-roll: **Sergio-Samuel** · video normal: **Sergio** | cuando toca carrusel, el **carrusel REEMPLAZA al b-roll** ese día |
| **Trial** | 4 | los 3 del feed + **1 yap (Samuel)** | el yap replica un video del día con otra edición |
| **Trial v2** | 3-5 | **Sergio a cámara** | temas de IA, **cero o mínima edición** |

**La cuenta: Feed 3 + Trial 7 (4 + los v2) = 10-13 piezas al día.**

### 29-sep-2026 · cómo se cumplen 10-13 grabando 3 videos por día

Sergio Urcullo graba ~1 hora y 3 videos por día (plan de 3 semanas); el yap y la publicación los
hace el editor (Claude) y los **Trial** son los *Trial reels* de Instagram por API (solo NO
seguidores; `hermes-content/deploy/vps-ops/publicar/README.md`). La regla de 10-13 sigue viva:

| Carril | Piezas | De dónde salen |
|---|---|---|
| **Feed** | 3 | los 3 videos grabados (A tutorial · B actualidad · C negocio/historia o clip del YouTube) |
| **Trial** | 6 | **2 yaps por video**, cada uno con OTRO gancho y otro largo (no un recorte del mismo) |
| **Trial v2** | 1-3 | tomas extra de Sergio a cámara sin edición, si las graba; si no, el carrusel del día |
| **Total** | **10-12** | + los largos de YouTube (lun · mié · vie) y los carruseles (mar · jue · sáb) |

Si Samuel produce (pilar, b-roll, yap propio), suma encima; el piso de 10 ya no depende de él.

Reglas que siguen vivas del plan del 11-sep:
- Al feed va SIEMPRE **uno serio de IA** (el "normal"). Los trial v2 varían: Bolivia · IA · negocio.
- Los de IA hablan ESPECÍFICO: **Claude, Claude Code, skill, hook, agente, loop, subagente**.
- Cada pieza empuja a UN recurso de la web y cierra alternando comentario ↔ comunidad.
- **Grabar en lote**: los cortos de la semana en una sentada. Publicar diario es trivial; grabar diario te mata.

## La escalera a YouTube — confirmada el 17-sep

**Sí: los largos de YouTube son la serie «Claude Code de cero»** (6 videos,
[`SERIE_CLAUDE_CODE.md`](SERIE_CLAUDE_CODE.md)) **y los cortos son semillas**: cada corto
de IA es trailer de un largo, y **el corto que pega fuerte asciende a video largo**.

🔴 **Cadencia nueva (Sergio Urcullo, 17-sep): YouTube DIARIO.** Reemplaza el «uno por
semana» del 11-sep. Cómo se sostiene sin romperse:

1. **Primero se termina la serie** — 03 (jue 17), 04 (vie 18), 05 (sáb 19), 06 (dom 20).
   Los cuatro tienen deck + guion listos.
2. **Los largos también se graban en lote**: acapela mirando el deck, los tres restantes
   en UNA sentada. Lo único que no se adelanta son los números que se recuentan el día
   (cada GUION.md dice cuáles).
3. **Después de la serie, la escalera alimenta el diario**: los largos siguientes salen
   de los cortos que pegaron — candidatos en orden de madurez: «Qué automatizar primero»
   (7 drops de reserva), «Un agente que te avisa», «IA local», «Escribí tu primera skill».
4. Cada largo publicado se **embebe en `/claude-code` el mismo día** + drop exclusivo en
   la comunidad. Los capítulos llevan minutos reales del render.

⚠️ **El costo real del diario es la edición, no la grabación.** La receta que lo hace
posible es la de la sesión «edicion» de Codex (14-sep): deck + cara, faster-whisper,
`edit.py` — documentada en
[`cola/GUIONES-RODAJE-17-20-SEP.md`](cola/GUIONES-RODAJE-17-20-SEP.md). Si un día el
largo no llega editado, se publica igual el corto del día y el largo corre un día — la
serie no se rompe por un día, se rompe por prometer y no cumplir.
