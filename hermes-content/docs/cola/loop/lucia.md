# Cola · Lucía

- [~] ~~G1 con la captura real de Pendientes de la demo~~ — **reemplazada por la premisa v5** (Sergio Urcullo, 8-oct: *«Lucía no
  es necesario que muestres el producto… grabar y aprender a usar Higgsfield es tu tarea»*). G1 salió sin producto:
  `videos/lucia-g1/` (`e35bb77d1`, `ec26f3bb6`). La captura de Pendientes queda para Marca, no para Lucía.
- [x] G2 y G3 según el plan v5, cada video estructurado — G3 `4ce62301c`, G2 `192b4f5a9`, G1 `ec26f3bb6`; PR #144; finales y
  SHA-256 en `videos/lucia-entrega/`; previews 360p en `videos/lucia-gN/qa/`. 0 créditos más.
- [ ] Publicar en la cuenta de Lucía lo que pase el control de identidad — **pasa a Bloqueado** (abajo): corre en el VPS.

## Verificación de aprendizaje · 2026-10-09 (pedida por la madre)

- [x] **Prueba de uso de `equipo-de-agentes` y `aprender-de-todo`** (leídas del commit `ca1fde0a`, sin fusionar su rama):
  - **Sesión + fecha:** `session_01XSzFcs1k18ijqjSHGjnzD4` (Lucía, nube), 9-oct-2026.
  - **Tarea de cola:** G5 «Cómo mido si una cara es la de Lucía» (`videos/lucia-g5/`).
  - **Regla usada:** ficha `2026-10-04-reels-para-lucia.md` §2 (otro avatar IA se llama «Lucía» y esconde que es IA) → siempre «Lucía Antelo», con apellido,
    y rótulo «personaje IA de Onia» desde el cuadro 0 (`LUCIA.md` §0-canon dato 2), dimensión «Negocio y oferta / Idioma y tono». De `equipo-de-agentes` §9: contrato →
    resultado → verificación (prompt del editor con META/PRUEBA, informe del editor, revisión independiente 1 y 2).
  - **Artefacto:** `videos/lucia-g5/index.html` (rótulo «Lucía Antelo · personaje IA de Onia» a 40 px, cuadro 0) y `pie.txt`.
  - **Verificación:** `videos/lucia-g5/qa/revision-1.md` y `revision-2.md` (rótulo ≥ 40 px desde el cuadro 0 sin tapar la cara; sin marcas de terceros ni profesión).
    Revisión de identidad: face-gate de A, F, B café y K4·5 (`qa/face-gate*.txt`).
  - **Lo que NO aplica y no se adoptó:** la micro-interacción «clic → hecho» y el «Comentá X» (premisa v5: Lucía no muestra el producto; CTA de mecanismo sin probar).
  - **Costos (§7):** el juicio fue de Sonnet (editor y revisor); no se usaron verificadores Haiku porque los chequeos eran de juicio, no de conteo.

## Siguientes 3 (sacadas del plan v5 y del GOAL de `handoff/madre-local.md`; todas 0 créditos y sin VPS)

- [x] L01 «Hola, soy Lucía. No existo.» reescrito a la premisa v5 — láminas en `hermes-content/carousels/out/lucia-l01-hola-no-existo-foto/`,
  brief en `briefs/lucia/l01-hola-no-existo.json`, 5 láminas miradas completas y grep limpio (commit de esta tanda). Sale por
  `ig-carrusel.mjs --cuenta lucia` en el VPS (receta en `videos/lucia-entrega/README.md`); no hay otra pieza que lo bloquee.
- [x] G4 «Seis motores de imagen, una cara: ¿cuál la conserva?» — montado en tres pasadas con revisor independiente
  (`videos/lucia-g4/`, revisiones 1 y 2 en `qa/`; 59,75 s; copia en `videos/lucia-entrega/`, SHA en su README). Corregidos: consultorio
  dental y logos de monitor (fotos limpias en `v4/prueba-motores-20261008/fotos-limpias/`), nota de ruido, tabla de A y B. **Falta solo la
  validación del guion por la madre** (decide también el sello rojo de E/F, R2-1 de la revisión 2).
- [x] Carrusel C1 «Un video sin grabar, en 3 pasos» — versión carrusel de G1 con fotos y un cuadro real del clip: láminas en
  `hermes-content/carousels/out/lucia-c1-un-video-sin-grabar/`, brief en `briefs/lucia/c1-un-video-sin-grabar.json`. 5 láminas miradas
  completas, grep limpio, 1080×1350 sin franja. Sale por `ig-carrusel.mjs --cuenta lucia` (receta en `videos/lucia-entrega/README.md`).

## Siguientes (cuando G4 cierre) — todas 0 créditos y sin VPS

- [x] G5 «Cómo mido si una cara es la de Lucía (y cuándo no creerle al número)» — montado en tres pasadas con revisor independiente (`videos/lucia-g5/`,
  revisiones 1 y 2 en `qa/`; 57,5 s; copia en `videos/lucia-entrega/`, SHA en su README). Corrigió el guion mismo: «una cara chica baja sola» exageraba (se midió: −0,004 a −0,010)
  y «0,79 y 0,77 difieren 0,03» eran 0,02. **Falta la validación del guion por la madre**, que decide también si G2 difumina el letrero inventado como G5.
- [x] C2 carrusel «Seis motores de imagen: cuánto cuesta y cuánto se parece» — láminas en
  `hermes-content/carousels/out/lucia-c2-seis-motores-de-imagen/`, brief en `briefs/lucia/c2-seis-motores-de-imagen.json`; 5 láminas miradas
  completas, grep limpio. Mismos números que el guion de G4 (que la madre valida).
- [ ] Rotar el token de Lucía (13-18-oct) y confirmar `is_ai_generated` en la primera pieza: lo hace quien corra el VPS; esta sesión
  deja la receta en `videos/lucia-entrega/README.md`.

## Bloqueado

- **El desbloqueo más corto, y es de Sergio Urcullo:** el OK para instalar el cliente `ssh` (paquete `openssh-client`) en esta nube, solo para
  correr la receta de `videos/lucia-entrega/README.md` por el túnel que el hook de arranque ya deja configurado (llave en el entorno, `ssh onia-vps`).
  Sin ese OK, o sin que la madre/«Onia» corra la receta, nada se publica. Antes de pedirlo se validó offline: los dos publicadores pasan `--selftest`.

- **Publicar G1 / G3 / G2 (y lo que siga)** — necesita (a) la llave del VPS, que por decisión de la madre vive solo en la
  sesión «Onia» (esta sesión de nube no tiene cliente `ssh` y no se instala sin aprobación), (b) el token de Lucía en
  `ig-lucia.env` (vence entre el 13 y el 18-oct), (c) la mirada de la madre a los previews 360p. Receta lista en
  `videos/lucia-entrega/README.md`; **quien la corra reporta `PUBLICADO:`**.
- Generaciones pagas de video: con el sí de Sergio Urcullo, por lote. Tope vigente que me fijé: 97 cr (quedan 10,5); falta que
  Sergio Urcullo lo confirme o lo corrija.
- Voz (L2, D4) y Motion Control (L3, requiere que Sergio Urcullo grabe 10 s): dependen de él.
