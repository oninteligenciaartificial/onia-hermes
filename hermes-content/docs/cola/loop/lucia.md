# Cola · Lucía

## Práctica de Higgsfield (orden de Sergio Urcullo 16-oct, escrita por la jefa Hermes) — ESTA TAREA VA PRIMERO

Objetivo: que la rutina de los :47 aprenda a manejar Higgsfield con lotes chicos de IMAGEN. Es práctica, no producción: nada se publica y no es una pieza de Lucía.
**Regla de Sergio Urcullo (16-oct, tarde), tal como la transcribió la sesión de la auditoría (#212; no consta en otra fuente y falta que él la confirme):** para PRACTICAR, Lucía no espera un «mostrada, publicá». Lo que sí se le muestra antes de subir son las PIEZAS y los PLANES; se controla la calidad juntos. Esto **aclara** el freno del 10-oct («mostrame antes de subir o hacer Lucía»): ese freno es para lo que se ve afuera, no para practicar. No lo reemplaza: ninguna pieza ni plan de Lucía sale ni se produce sin mostrárselo. Practicar no es publicar: nada de esta tarea sale a ninguna red.
Límites (`CLAUDE.md` § Higgsfield, «Gasto — actualización 8-oct, consolidada 2026-10-09»: cotizar y registrar brief, costo/cap y cantidad; imágenes de práctica de menos de ~5 créditos por lote tienen autorización previa, sin fraccionar un lote mayor). Este bloque P1-P3 es ese brief; tope de esta tarea 12 créditos en total (saldo medido 16-oct: 438,17). **Sin cara ni voz** (ni Lucía ni Sergio Urcullo ni personas reales), **sin video, sin Soul, sin lotes grandes**: eso pide el sí escrito de Sergio Urcullo.

- [ ] **P1 · Lote 1: un mismo sujeto, tres modelos.** Sujeto sin personas (un escritorio de recepción de clínica, o una tablet con agenda). Mismo prompt en tres modelos de imagen. NO usar nombres de memoria: resolver los IDs técnicos vigentes en vivo (`higgsfield model list` en la CLI o `models_explore` en el conector; ej. `gpt_image_2_5`, `nano_banana_2` o `nano_banana_pro`) y anotarlos en la tabla de P4. 1 imagen por modelo, calidad media. Antes de generar: cotizar (`generate cost` en la CLI o `get_cost` en el conector) y anotar costo y cap. Después: mirar las 3 y anotar cuál obedece mejor el prompt, el texto en imagen y la luz.
- [ ] **P2 · Lote 2: el prompt manda.** Con el modelo ganador de P1: 3 variantes del mismo sujeto cambiando UNA sola cosa por vez (lente/encuadre, luz, estilo B/N con un objeto verde como el de `diseno-contenido-onia`). Registrar qué palabra cambió qué.
- [ ] **P3 · Lote 3: formatos.** El mejor prompt de P2 en 4:5 (feed), 9:16 (historia) y 1:1. Anotar si el modelo recompone o recorta y cuánto cuesta cada formato.
- [ ] **P4 · Cierre.** Escribir lo aprendido (modelo ↔ para qué sirve, trampas, costos reales, prompts que funcionaron) en `hermes-content/references/modelos/lucia/TECNICA-HIGGSFIELD.md`, sección «Práctica 16-oct», con la tabla: lote, modelo, parámetros, costo cotizado vs cobrado, aprendizaje. Dejar las imágenes y una hoja de contactos en `hermes-content/references/modelos/lucia/practica-20261016/` (sin subirlas a ninguna red). Verificar el saldo con `balance` al final y anotar la diferencia.
- **Presupuesto que cierra con el tope de 12 cr (cotizar antes de cada lote):** P1 = 3 imágenes (una por modelo). Si el ganador cuesta más de 1 cr por imagen, P2 pasa a 2 variantes y P3 a 2 formatos (4:5 y 9:16, el 1:1 solo si sobra); si aun así el lote pasa de ~4 cr, repetir P2/P3 con el modelo más barato de P1. Reservar siempre lo necesario para P4. Ningún lote ≥ 5 cr.
- **Hecho =** 3 lotes con cada imagen mirada, tabla escrita, saldo final medido, gasto total ≤ 12 cr. Si algún lote cotiza ≥ 5 cr, se achica; no se parte para esquivar la regla.
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
