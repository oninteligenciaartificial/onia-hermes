# Flujo diario — de 1 hora de grabación a publicar todos los días

Propuesta de Claude, 29-sep-2026, para que Sergio Urcullo la corrija. Qué grabar: `MAPA.md` y
`ORDEN-DE-PRODUCCION.md`. Cómo se publica: `hermes-content/deploy/vps-ops/publicar/README.md`.

## Qué sale de cada video

| Grabás | Sale | Dónde |
|---|---|---|
| **1 vertical** (45–70 s) | **Reel principal** | Instagram `@sergiourcullo` (feed y seguidores) · Facebook por compartido automático · TikTok y YouTube Shorts cuando esté Metricool |
| | **Yap 1** — mismo contenido, **otro gancho**: arranca por el dato más fuerte o por el resultado, 30–45 s | Instagram **Trial** (solo NO seguidores; pasa a seguidores solo si rinde) |
| | **Yap 2** — **un solo paso** del video, ≤ 30 s, con su propio gancho | Instagram **Trial** |
| **1 horizontal** (lun · mié · vie) | **Video largo** | YouTube (por Metricool; con API propia quedaría privado) |
| | **1 clip vertical** con el mejor tramo de 45 s | reel principal del día siguiente o yap Trial |

**Por qué los yaps van a Trial:** prueban ganchos distintos con gente que no te sigue, sin llenarle
el feed a tus seguidores. El que funciona, Instagram lo pasa solo (`--trial auto`).
**Por qué no a TikTok:** Trial es una función de Instagram; en TikTok van solo los principales.

## Un día normal

| Hora (La Paz) | Qué pasa |
|---|---|
| — | Grabás en tu hora de rodaje y dejás los brutos en `C:\Users\PC\Videos\ONIA-brutos\<fecha>\` |
| mismo día | Edito los 3 videos y sus 6 yaps; escribo los captions |
| 21:00 | Te llega **el paquete del día siguiente**: tabla de cortes, los 9 videos, captions, horarios. Respondés «ok» o corregís |
| 12:30 · 18:30 · 20:30 | Principales A, B y C (horarios iniciales; se ajustan con datos) |
| principal + 1 h y + 3 h | Sus 2 yaps a Trial |

**Cuenta del día: 3 principales + 6 yaps = 9, + carrusel o toma extra sin edición = 10-12.** Cumple la
regla de 10-13 de `ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md` sin grabar más de 1 hora (tope de la API:
100 publicaciones cada 24 h).
Carruseles: mar · jue · sáb, en el horario de B.
Las publicaciones con hora quedan agendadas en el VPS, una por comando (sin cola que pueda
«despertar» y publicar sola, como pasó con Postiz el 4-sep).

## Cómo se mantiene el ritmo sin quemarte

- **Grabar en lote:** los verticales de 2–3 días en una sentada cuando se pueda; el largo, aparte.
- **El yap no cuesta rodaje:** sale del mismo bruto; es trabajo de edición, que es mío.
- **Colchón:** apuntamos a tener siempre 2 días de videos editados por delante. Si un día no grabás,
  sale el colchón y el calendario no se corta.

## Cómo se mide (y qué cambia con eso)

A las 48 h de cada publicación leo las métricas por API y el domingo te paso un parte corto:
- qué gancho ganó en cada par principal/yap;
- qué yaps pasaron solos a seguidores;
- qué tema retuvo más.

Eso decide la semana siguiente: más de lo que funciona, y si un tipo de yap nunca gana, se cambia por otro ángulo.
