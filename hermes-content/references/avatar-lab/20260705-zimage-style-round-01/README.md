# Avatar Lab — Ronda 1: exploracion de estilo barata (z_image)

- **Fecha:** 2026-07-05
- **Objetivo:** perfeccionar ESTILO + PROMPT del avatar operador ONIA (tipo Sergio) con modelo barato, antes de gastar en modelos caros de identidad.
- **Regla (Sergio 2026-07-05):** solo modelos baratos; validar direccion antes de seguir generando. Ver [[gasto-plataformas-validar-primero]].
- **Modelo:** `z_image` (Tongyi-MAI), text-to-image, 9:16, **0.15 creditos/img**. Total ronda: ~0.9 creditos.
- **Contraste de costo:** la corrida de avatar Sergio del 2026-06-04 gasto ~72 creditos y quedo `identity_ok: false`.

## Importante sobre identidad

`z_image` es **text-only, no acepta imagen de referencia** → no reproduce la cara real de Sergio; cada imagen es una persona distinta del mismo "tipo". Esta ronda sirve para fijar el **recipe visual** (encuadre, luz, wardrobe, escena, nivel de realismo, expresion), NO la identidad. La identidad se aplica despues, en UNA sola pasada, con el modelo bueno + las fotos reales aprobadas (`hermes-content/references/sergio-approved-media/`). Ver [[radar-ia-content-production]] para la parte de video.

## Tests

| # | Archivo | Direccion | Camara/Luz | QA |
|---|---|---|---|---|
| 01 | `zimage-01-studio-pro.png` | Studio pro, fondo gris | 85mm, luz de estudio suave | Limpia, base para still maestro de identidad |
| 02 | `zimage-02-operator-desk.png` | Operador en escritorio, laptops | 35mm, luz de ventana | Building-in-public, muy ONIA |
| 03 | `zimage-03-ugc-selfie.png` | Selfie UGC, cuarto | frontal handheld | Organico, nativo Reels/TikTok |
| 04 | `zimage-04-cinematic.png` | Cinematografico, bokeh | 50mm, side-light | Mejor realismo de piel de la ronda |
| 05 | `zimage-05-presenter-blazer.png` | Presentador, blazer gris | 50mm, oficina editorial | Autoridad B2B/propuestas |
| 06 | `zimage-06-lifestyle-walk.png` | Lifestyle caminando | 35mm, pasillo urbano | Walking-hooks; salio con arito (quitar en prompt) |

## Ranking sugerido

1. **04 cinematografico** — mayor realismo, mejor piso de calidad.
2. **05 presentador** — autoridad para B2B / propuestas.
3. **02 operator desk** — building-in-public ONIA.
4. **01 studio** — mejor base para el still maestro de identidad (fondo neutro, cara nitida).
5. **03 ugc / 06 lifestyle** — para contenido organico y hooks.

## Aprendizajes de prompt (z_image)

- Responde muy bien a: "hyperrealistic", "real photograph", "natural skin, visible pores", "no beauty filter", lente explicito (35/50/85mm), y descripcion fisica corta.
- Cumple negativos escritos en el prompt (sin logos, sin texto) aunque el modelo no expone campo `negative_prompt`.
- Riesgos: mete accesorios (arito) si no se prohiben; la cara varia por generacion (esperado, es text-only).

## Siguiente (todo barato, pendiente de validar con Sergio)

- Fijar 1-2 direcciones ganadoras y hacer Ronda 2: variar solo expresion / encuadre / luz sobre esa direccion.
- Afinar el prompt fisico para acercarlo al tipo de Sergio (referencia: `avatar-realism-lab-20260604.json` visual_description).
- Cuando el recipe este perfecto: recien ahi aplicar identidad real con modelo bueno (1 pasada).
