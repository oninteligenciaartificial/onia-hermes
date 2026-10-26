# Lucía · Semana 1 — piezas (v2, 1-oct-2026)

> ⛔ **Reemplazado el 2-oct por [`PLAN.md`](PLAN.md)** (Sergio Urcullo: «organizá primero qué idea vas a subir… recién generá»). Esto queda como historia del 1-oct.


Aprobado por Sergio Urcullo el 1-oct: Kling 3.0 para b-roll y tope de **150 cr/mes**. Flujo y reglas:
[`FLUJO.md`](FLUJO.md). Mismo formato que `../plan-3-semanas/` (`### LNN-X · Formato · Título`).

**El día 1 es el primer día con `@lucia.antelo.oficial` conectada.** Hora: 19:00 La Paz.
Reglas de toda pieza (de `research/competencia/LUCIA_INFLUENCERS_IA_B2B_20260930.md`):
el pie arranca con «Lucía es un personaje hecho con IA por @oniahq»; lo que vende muestra pantalla
REAL de Onia y solo funciones vivas (link de reserva 🟢, recordatorios por correo 24 h / 2 h 🟡);
nunca testimonio; nada «anti-humano».

| Día | Pieza | Formato | Estado | Costo |
|---|---|---|---|---:|
| 1 | L01 · Hola, soy Lucía. No existo. (fijado) | Carrusel 5 fotos | ✅ aprobado por Sergio Urcullo 1-oct | 0 |
| 2 | L02 · Este video no fue grabado | Reel b-roll (Kling, calle) + texto | ✅ editado con `editor-videos` (`videos/lucia-l02/`, final en `v4/feed/`); espera OK | 0 |
| 3 | L03 · Sábado | Foto (cocina a la mañana) | foto lista | 0 |
| 4 | L04 · Tu agenda, sin llamadas | Carrusel con captura real del link de reserva | falta la captura | ~1 |
| 5 | L05 · Lunes: cero llamadas para agendar | Reel b-roll (Kling, coworking) + texto | ✅ editado con `editor-videos` (`videos/lucia-l05/`); espera OK + captura real del link | 7,5 |
| 6 | L06 · Noche de lámpara | Foto | foto lista | 0 |
| 7 | L07 · El recordatorio que llega solo | Carrusel con captura real del correo 24 h / 2 h | falta la captura | ~1 |
| extra | L08 · ¿Cuántos pacientes se olvidan de su cita? | Reel b-roll (Kling, café) + voz de Marcela | ✅ editado con `editor-videos` (`videos/lucia-l08/`); espera OK + captura real del correo | 12,5 |

**Gasto de octubre: 20 / 150 cr** (L05 7,5 + L08 12,5). Guiones: [`S1-GUIONES.md`](S1-GUIONES.md). **Los reels se editan
con la skill `editor-videos`** (regla de Sergio Urcullo, 1-oct). Voz de Marcela: resuelta (ElevenLabs desde la nube).

## Archivos

- L01: brief `hermes-content/carousels/briefs/lucia/l01-hola-no-existo.json` · láminas
  `hermes-content/carousels/out/lucia-l01-hola-no-existo-foto/` (pack `editorial-photo`, cuenta `lucia`).
  Render: `CAROUSEL_BROWSER=<chrome> node scripts/carousel_render.js --brief <brief> --out <dir> --account lucia --pack editorial-photo`.
- L02: clip Kling `1d2b5631-cc50-4a17-a472-cf6bb78c1098` (6 s, parecido 0,70→0,72).
- L03 foto `ed096c60…` · L06 foto `761df099…` (ids completos en `v4/PROCEDENCIA.jsonl`, lote_publicar).
- Fotos del feed en `hermes-content/references/modelos/lucia/v4/feed/`.
