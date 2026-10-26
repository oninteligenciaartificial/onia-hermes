# Lucía: cómo se usa (para la madre)

> Una página para operar. Personaje y reglas finas: `references/modelos/lucia/LUCIA.md` (§0 manda). Higgsfield: `docs/HIGGSFIELD_VIDEO_SYSTEM.md`. Plan: `docs/cola/lucia-diario/PLAN.md`. Medido en el repo el 10-oct-2026; lo que no pude verificar (VPS, saldo) lo digo. No existía un doc equivalente: `historial/ONIA_LUCIA_USO_PRACTICO_Y_FUNCIONES.md` (23-ago) trata de funciones, no de operar.

## 1. Qué es y para qué (Sergio Urcullo, 10-oct)
- **Laboratorio de Higgsfield:** cada pieza prueba un método (identidad, motor, clip, QA). Lo aprendido se anota en este doc, `HIGGSFIELD_VIDEO_SYSTEM.md` o la skill, en el mismo commit.
- **Cuenta a facturar después:** `@lucia.antelo.oficial`, vitrina de lo que el sistema produce. Métrica única: demos con `src=lucia-*` (`onia.com.bo/llamada?src=lucia-<pieza>`).
- **No se pausa.** Se ajusta con datos (la regla «pausar el día 14» de PLAN §4 queda superada). El cron viejo de video (38 cr/día) sigue apagado: rompe el tope. Se avanza por piezas, ordenadas por la madre.

## 2. Flujo, paso a paso
| # | Paso | Herramienta / comando exacto |
|---|---|---|
| 1 | **Identidad** | Ancla espejo `abe2e6bd-0d39-49be-9d87-1126d4ed07b0` PRIMERA, más `a7cfb766`, `d7d6d36a`, `df491c87`, `8ce2f65c`. Respaldo: Element `lucia-skin-v1` `58bbd635-9b90-4bd2-b08a-1cd4915bd563`; Soul v5 `cd42c065-e18c-4176-b9ad-e2de075fe362` (0,803, contra 0,838 del método Seedream). Se elige por ID, nunca por nombre |
| 2 | **Still** | `seedream_v4_5` 9:16 basic, 1 cr. Prompt: escena + «Same face, skin and freckles as the first reference image» + `v4.prompt_clausula_belleza` del IDENTITY.json; menos de 200 tokens, sin redescribir la cara, sin «sheet» ni hex. CLI (VPS): `$VPS 'higgsfield generate cost seedream_v4_5 --prompt "…" --image <media_id> …'` (flags: `model get seedream_v4_5`). Por MCP: `generate_image` con `medias[]` rol `image_references` (así se midió) |
| 3 | **QA de identidad** | `scripts/face_identity_qa.py` (ArcFace, en `sandbox_exec` de Higgsfield, 0 cr): ≥ 0,70 en caras frontales/3-4 de 200 px o más. Perfiles y caras chicas se MIRAN. Después a ojo: piel roja = mal, pecas contables, 5 dedos, letreros inventados |
| 4 | **Image-to-video** | `$VPS 'higgsfield generate cost kling3_0 --prompt "<una acción simple>. Looks up at the camera. Keep her face exactly as in the image." --start-image <job_id del still> --mode std --sound off --aspect_ratio 9:16 --duration 6'`. `--sound off` va como texto (con `false` cobra 10,5). Leer los `adjustments`; QA en primer, medio y último frame |
| 5 | **Edición** | Skill `editor-videos` § «Reels de Lucía»: clip LIMPIO (`rawUrl`), 1080×1920 a 24 fps, texto entre mentón+40 px y y=1490, karaoke, SFX, master. Sin voz (D4: Marcela tiene acento colombiano). Higgsfield no edita ni publica |
| 6 | **Publicación** | VPS. Ensayo: `node /root/bin/ig-reel.mjs --cuenta lucia --video X.mp4 --caption pie.txt` (debe decir FINISHED). Real: `agendar-publicacion.sh lucia-g1 "AAAA-MM-DD 23:00:00" node /root/bin/ig-reel.mjs --cuenta lucia --video X.mp4 --caption pie.txt --publicar`. Carrusel: `node /root/bin/ig-carrusel.mjs --cuenta lucia --dir <5 láminas> --caption <pie>`. Copiar los dos .mjs JUNTOS a `/root/bin` y correr `--selftest`. TikTok/Shorts: Buffer (canal de Lucía por crear) |
| 7 | **Después** | Abrir el permalink, confirmar «Información de IA» y `is_ai_generated: true` en `/root/publicar/publicado.jsonl`. A las 48 h: demos con `src`, clics, preguntas, guardados |

## 3. Qué cuesta y qué se aprueba
- **Tope Lucía: 150 cr/mes** (Sergio Urcullo, 1-oct); octubre llevaba 52,5 al 5-oct. Semana tipo ≈ 35 cr. Saldo: NO lo leí (era ~438 el 8-oct, plan Pro, 4 jobs a la vez); se lee con `higgsfield account status` al empezar.
- **Medido:** Soul 2k 0,12 · still Seedream 1 · Nano Banana Pro 2 · GPT Image 2.5 1 a 2,75 · Kling std sin sonido 6 s 7,5 y 10 s 12,5 · entrenar Soul 25 · `sync_so` 18,15 (FLUJO.md estima ~22, sin medir).
- **Siempre** `generate cost` antes de `create`; job, modelo, costo y decisión de QA a `v4/PROCEDENCIA.jsonl`. Lo caro se avisa, no se lanza.
- **Sin preguntar:** imágenes y lotes chicos (menos de ~5 cr) dentro del tope; se avisa después con la lámina. **Lo revisado ya está aprobado** (10-oct): pasa el QA, se publica y se avisa con el enlace.
- **Con aprobación específica:** lote de video, entrenar un Soul, y todo lo que suba la cara o la voz de Sergio Urcullo (es menor de edad: además el OK de Leslie Mercado Moreno).

## 4. Listo para publicar hoy, orden y ritmo
Entrega verificada en la rama `origin/claude/zealous-babbage-fvtjck` (NO está en `main`): `videos/lucia-entrega/` (+ `videos/lucia-gN/pie.txt` y `qa/` con el preview 360p). L01 sí está en `main`.
| Orden | Pieza | Qué es | Cuándo |
|---|---|---|---|
| 1 | **G1** reel 56 s | «Este video no fue grabado: así se hace, en 3 pasos» | sem 1 día 1 |
| 2 | **L01** carrusel | «Hola, soy Lucía. No existo.» (se fija, va después de G1) | sem 1 día 1-2 |
| 3 | **G3** reel 58 s | «Tres errores de la IA que atrapé antes de publicar» | sem 1 día 3-4 |
| 4 | **C1** carrusel | «Un video sin grabar, en 3 pasos» | sem 2 día 1 |
| 5 | **G2** reel 58 s | «La misma foto, seis clips: ¿quién pierde la cara?» | sem 2 día 3 |
- G4, G5 y C2 salen después, solo cuando la madre valide sus guiones. Hasta 3 piezas por semana, 19:00 La Paz (23:00 UTC).
- Estado de G1: el ensayo en el VPS lo frenó el permiso «Remote Shell Writes» de la madre (`handoff/madre-local.md`).

## 5. Token de Instagram de Lucía (vence 13 a 18-oct)
- Postiz leyó 13/17/18-oct para las tres cuentas y no dice cuál es la de Lucía: **asumir el 13**. Hoy es 10, quedan 3 días.
- **No verificado** (sin acceso al VPS): `FLUJO.md` (30-sep) dice que solo existen `ig-sergio.env` e `ig-oniahq.env`; `ig-lucia.env` puede no existir.
- Dura 60 días y se refresca sin login si tiene más de 24 h y NO venció. `ig-refrescar.sh` (cron lunes 09:00 La Paz; el próximo es el 12-oct) recorre todos los `ig-*.env` y avisa solo si falla.
- **Renovar:** (1) cargar el token de Lucía en `/root/.config/onia-publicar/ig-lucia.env` (`IG_USER_ID=`, `IG_TOKEN=`, modo 600), como se hizo con sergio y oniahq el 29-sep desde Postiz; (2) correr `/root/bin/ig-refrescar.sh` a mano: debe decir «ig-lucia renovado»; (3) ensayo de G1.
- Si ya venció o no hay token: login de Instagram de Lucía en la app `OnIA Social API`, una vez, lo hace Sergio Urcullo; infra guarda el token. Con el 13 pasado no hay atajo.
- A cargo de Sergio Urcullo (30-sep): cuenta profesional conectada y «Perfil generado con IA» activado.

## 6. Reglas (no se negocian)
- **Es IA y lo dice:** bio «IA creada por @oniahq · equipo humano en Santa Cruz», etiqueta de Instagram y sobreimpreso «Lucía · personaje IA de Onia» desde el segundo 0.
- **Nunca se hace pasar por una persona real:** ni testimonio, ni clienta, ni profesional de salud (el ambo es vestuario; jamás «soy odontóloga», «mis pacientes», «mi consultorio»). Sin promesas de resultado. Solo funciones vivas hoy (link de reserva, recordatorio 24 h y 2 h).
- **Prohibido usar la cara o la voz de Sergio Urcullo.** Lucía es 100 % IA; su cara es la original (ancla espejo), y las caras retiradas están en `DEPRECATIONS.md` y la lista negra de `BANCO-OFICIAL.md`.
- **`@lu.antelo` es de una persona real: nunca.** Siempre «Lucía Antelo». Sin marcas de terceros (motores como «Motor 1 a 6»), sin música sin licencia.
- Higgsfield genera y no publica. Pieza de venta = pantalla REAL de Onia (falta la cuenta demo dental: bloquea las piezas de venta #5 a #8 del plan).

## 7. Abierto (decide Sergio Urcullo)
- ¿Los clips de Kling dentro del tope de 150 cr salen sin pedir cada vez? Hoy piden aprobación de lote (CLAUDE.md, regla de gasto del 22-sep).
