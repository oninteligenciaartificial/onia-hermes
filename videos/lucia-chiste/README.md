# ⛔ RECHAZADO el 8-oct por Sergio Urcullo — NO SE PUBLICA
> *«No tiene el contenido estructurado, es literal un video de 10 segundos. Tienen que ser videos estructurados.»*
> Un clip suelto con tres tarjetas no es un video: sin gancho con promesa, sin desarrollo y sin nada que aprender.
> Se deja como ejemplo de lo que no se vuelve a entregar. La regla vigente: skill `lucia` §0-bis y `PLAN.md` v4 §3.
> Lo que sí sirve: el método de montaje sin dependencias (`scripts/build.mjs`) y el clip del café como plano de apoyo.
> El final se movió a `hermes-content/references/modelos/lucia/v4/feed/rechazado-20261008/`.

# Lucía · chiste de 10 s «¿Lucía Antelo es real?» (era el día 5 de la semana 1)

Reel 9:16 de **9,625 s**, sin voz, de usted (D8 del plan v4). Es el formato B, de personaje: la IA como gancho, sin vender.
**Costo: 0 créditos**: el clip del café ya estaba pagado (Kling `f79eb10e`, el de L08). Editado el 8-oct.
**Estado: RECHAZADO.**

| Qué | Ruta |
|---|---|
| Final (gen1, 1080×1920, 24 fps, 231 cuadros, CRF 14, audio en silencio) | `hermes-content/references/modelos/lucia/v4/feed/rechazado-20261008/chiste-lucia-antelo-es-real.mp4` |
| Preview y hoja de QA | se sacaron del paquete: ya no hay nada que aprobar |
| Build reproducible | `scripts/build.mjs` → `renders/` (ignorado en git); `scripts/plan.json` trae lo que queda visible |

## Tabla de cortes

| # | Me quedo con | Tiro | Por qué |
|---|---|---|---|
| 1 | Clip del café, cuadros 10–240 (9,625 s) | Cuadros 0–9 | Arranque en caliente, como en L08. No se congela ni se acelera |
| 2 | Tres tarjetas: «¿Lucía Antelo es real?» · «No: **soy IA.**» · «Lo que le muestro, **sí.**» | «Las pantallas que le muestro, sí.» | En una línea, con la letra de L02, invadía los 80 px de la derecha (lo frenó la guarda del build). «Lo que le muestro, sí» dice que lo que muestra es real, no que «funciona» |
| 3 | Rótulo «Lucía Antelo · personaje IA de Onia» de 0 a 2,4 s | — | IA declarada desde el cuadro 0, con apellido (plan v4 §3) |
| 4 | Todo el texto entre y=1194 y y=1425 | Texto sobre la cara | Mentón máximo del clip: 1148 px (YuNet, L08). El texto va desde mentón + 40 |

## Storyboard

| t (s) | Qué | Visible (x1, y1 → x2, y2) |
|---|---|---|
| 0 → 2,40 | rótulo | centrado, y=1194 |
| 0,10 → 3,00 | «¿Lucía Antelo es real?» | 171, 1262 → 910, 1425 |
| 3,00 → 5,40 | «No: soy IA.» | 327, 1222 → 754, 1385 |
| 5,40 → 9,625 | «Lo que le muestro, sí.» (Lucía levanta la vista y sonríe al final) | 175, 1222 → 905, 1385 |

Fundidos: 0,15 s de entrada y 0,22 s de salida. Palabras: 4, 3 y 5. Todas pasan el mínimo de 0,35 s por palabra + 0,3 s.

## QA (mirado el 8-oct)

- **Hoja de 8 cuadros:**
  - ninguna tarjeta toca la cara ni pasa y=1490 ni x=1000;
  - el rótulo está en el cuadro 1;
  - el cierre queda con Lucía mirando a cámara.
- **Specs** (`ffprobe`): h264 1080×1920, 24 fps, 231 cuadros, 9,625 s, 15,3 MB; aac 48 kHz en silencio.
- **Identidad:** no se volvió a medir, porque esta nube no tiene insightface. Es el mismo clip de L08, que dio 0,75–0,79
  el 1-oct, y se miró: pecas, argollas.
- **Sin SFX:** la librería de HyperFrames no está en esta nube e instalarla pide aprobación. La música la pone Sergio
  Urcullo. Si se quieren los pops de la receta, se suman con `sfx.mjs` en una máquina que los tenga.

## Pie propuesto

*«Lucía Antelo es un personaje hecho con IA por @oniahq. Lo que le muestro de Onia son pantallas reales.»*
No vende ni anuncia otra pieza.

## Comandos

```bash
node videos/lucia-chiste/scripts/build.mjs   # tarjetas (make-mockup) + montaje + preview + hoja de QA
```
