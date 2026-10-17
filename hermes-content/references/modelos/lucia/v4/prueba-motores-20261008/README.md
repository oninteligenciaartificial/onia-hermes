# Prueba de motores de Higgsfield con la cara de Lucía — 8-oct-2026

Misma foto de arranque (K1 `4afffb96`) y misma orden en 5 motores de video, 6 motores de imagen (7 fotos nuevas, Kling Omni Image en 3 escenas) con el mismo prompt y
referencias, y 2 vías de labios. Resultados, costos y lectura: `.claude/skills/lucia/higgsfield-mapa.md` §1 y
`../PROCEDENCIA.jsonl` (últimas 3 líneas, con los ids de cada job y los puntajes ArcFace).

- `hojas/`: hojas comparativas (cuadros 0, 1, 3, 4,5 y 6 s de cada clip; fotos lado a lado; cafés; boca del clip con audio).
- `proxies/`: los clips a 360p, sin audio, para verlos sin gastar espacio.
- `fotos/`: las fotos de prueba a 1080 px.
- **Los originales (mp4 de 720p y 1080p, PNG de 1536×2752) no van a git.** Se recuperan a 0 créditos con `job_display <id>` →
  `results.rawUrl` y `curl`. Los ids están en `PROCEDENCIA.jsonl`.
- El audio de los labios es `d0eacead…` (voz Marcela, acento colombiano): **solo evaluación interna, no se publica**.
