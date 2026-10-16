# Cola · Lucía

## Práctica de Higgsfield (orden de Sergio Urcullo 16-oct, escrita por la jefa Hermes) — ESTA TAREA VA PRIMERO

Objetivo: que la rutina de los :47 aprenda a manejar Higgsfield con lotes chicos de IMAGEN. Es práctica, no producción: nada se publica y no es una pieza de Lucía.
Límites (CLAUDE.md, gasto 8-oct): menos de ~5 créditos por lote, sin fraccionar un lote mayor; tope de esta tarea 12 créditos en total (saldo medido 16-oct: 438,17). **Sin cara ni voz** (ni Lucía ni Sergio Urcullo ni personas reales), **sin video, sin Soul, sin lotes grandes**: eso pide el sí escrito de Sergio Urcullo.

- [ ] **P1 · Lote 1: un mismo sujeto, tres modelos.** Sujeto sin personas (un escritorio de recepción de clínica, o una tablet con agenda). Mismo prompt en `gpt_image_2_5`, `nano_banana` y un tercero de `models_explore` (action `recommend`). 1 imagen por modelo, calidad media. Antes de generar: cotizar (`generate cost` en la CLI o `get_cost` en el conector) y anotar costo y cap. Después: mirar las 3 y anotar cuál obedece mejor el prompt, el texto en imagen y la luz.
- [ ] **P2 · Lote 2: el prompt manda.** Con el modelo ganador de P1: 3 variantes del mismo sujeto cambiando UNA sola cosa por vez (lente/encuadre, luz, estilo B/N con un objeto verde como el de `diseno-contenido-onia`). Registrar qué palabra cambió qué.
- [ ] **P3 · Lote 3: formatos.** El mejor prompt de P2 en 4:5 (feed), 9:16 (historia) y 1:1. Anotar si el modelo recompone o recorta y cuánto cuesta cada formato.
- [ ] **P4 · Cierre.** Escribir lo aprendido (modelo ↔ para qué sirve, trampas, costos reales, prompts que funcionaron) en `hermes-content/references/modelos/lucia/TECNICA-HIGGSFIELD.md`, sección «Práctica 16-oct», con la tabla: lote, modelo, parámetros, costo cotizado vs cobrado, aprendizaje. Dejar las imágenes y una hoja de contactos en `hermes-content/references/modelos/lucia/practica-20261016/` (sin subirlas a ninguna red). Verificar el saldo con `balance` al final y anotar la diferencia.
- **Hecho =** 3 lotes miradas una por una, tabla escrita, saldo final medido, gasto total ≤ 12 cr. Si algún lote cotiza ≥ 5 cr, se achica; no se parte para esquivar la regla.
- Si el conector o el permiso frena un gasto (pasó el 11-oct), registrar el bloqueo y seguir con lo que no gasta: leer `models_explore` y `get_preset_instructions` y anotar qué modelo usar para qué.
- Después de P4, la rutina mira la cola de abajo; no abre trabajo nuevo con créditos.

## Cola anterior (sin cambios)

- [ ] G1 con la captura real de Pendientes de la demo (cuando Plataforma la refresque)
- [ ] G2 y G3 según el plan v5 (#144), cada video estructurado (no clips sueltos)
- [ ] Publicar en la cuenta de Lucía lo que pase el control de identidad

## Bloqueado (solo Sergio Urcullo)
- Generaciones pagas de video: con su sí, por lote.

## Verificación de aprendizaje · 2026-10-09
- [ ] En la próxima pieza ya encargada, cargar `equipo-de-agentes` y `aprender-de-todo`; aplicar la referencia pertinente de la ficha `2026-10-04-reels-para-lucia.md` y registrar sesión, regla, artefacto y revisión de identidad/prueba. No generar ni gastar solo para cerrar esta casilla.
