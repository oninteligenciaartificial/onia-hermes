> ---
> # 🔴 SUPERADO EN LA PARTE DE IDENTIDAD — 2026-08-28
>
> Este documento manda a usar el **Soul `36305a9b`** y/o el ancla de una sola foto
> `452d8375`. **Las dos cosas están mal hoy:**
>
> - El Soul `36305a9b` está **PROHIBIDO**: sale con la piel roja, ignora el atuendo pedido y
>   se entrenó con frames de una persona real sin permiso documentado.
> - El ancla `452d8375` tenía **una sola foto**, así que el modelo inventaba el perfil y las
>   proporciones. La reemplaza **`lucia-skin-v1` (`58bbd635-9b90-4bd2-b08a-1cd4915bd563`)**,
>   con 7 ángulos.
>
> **Para cualquier decisión sobre qué cara usar y con qué generar, manda
> [`references/modelos/lucia/BANCO-OFICIAL.md`](../modelos/lucia/BANCO-OFICIAL.md).**
> Lo de acá abajo se conserva por su método y su historia, no como instrucción.
> ---

# Sistema de Contenido — Lucia (2026-07-07)

Plan repetible de produccion de contenido para Lucia, ahora que la identidad esta
cerrada y aprobada (`LUCIA_SURGICAL_FACE_LOCK.md`). Es tambien la plantilla para
cualquier modelo futuro (Mara, etc.) — cambiar solo los IDs.

## 0. Estado (lo que YA existe y funciona)

- **Identidad definitiva:** shoot quirurgico de 10 tomas fondo blanco, aprobado por
  Sergio. Element de combos `902eeebb-...`, avatar Marketing Studio `a1e334f3-...`,
  ground-truth QA `ced20cc2-...` (frame de video real).
- **Guardarropa:** 4 looks como Elements (cleangirl, streetwear, nightout, loungewear).
- **Lugares:** 5 como Elements (bano, dormitorio, cafe, calle, bar).
- **Voz:** `seed_audio` Isabella en español (validada).
- **Estructura b-roll+lipsync:** definida y probada (`avatar-lab/20260707-broll-lipsync-structure/`).

## 1. Decision de cuenta (definida)

**Cuenta PROPIA para Lucia** (IG/TikTok con handle y personalidad propios). Nuvia es un
CLIENTE que usa su contenido, no su casa exclusiva. Razon: una cuenta propia es un
activo reutilizable entre clientes; atarla a Nuvia la encierra en un solo catalogo y no
compone audiencia propia. (Ya estaba en la bible; confirmado.)

**Secuencia de arranque:** una cuenta desde 0 seguidores NO abre con un ad de producto
duro — no convierte. Primero contenido ORGANICO que construye el personaje y la
audiencia (lifestyle, rutina, relatable), y recien con audiencia se intercalan piezas de
producto (Nuvia). Regla 80/20: ~80% organico/personaje, ~20% producto.

## 2. Pilares de contenido (rotar)

| Pilar | Que es | Nivel produccion | Modelo | Costo aprox | Cadencia |
|---|---|---|---|---|---|
| **Feed lifestyle** | Foto/carrusel de ella en escena (rutina, salida, gym) | Nivel 1 imagen | `nano_banana_pro` + `902eeebb` + outfit/lugar | ~2cr/img | 3-4/sem |
| **Reel movimiento** | B-roll de ella haciendo algo (camina, rie, gym) + VO o musica | b-roll video | `kling2_6` (10cr) o `minimax_hailuo` (6cr, mejor emocion) | 6-10cr/clip | 2-3/sem |
| **Reel hablando** | Ella habla a camara contando algo (tip, storytime) | lipsync real | Marketing Studio `ugc_direct_to_camera` (mejor) o `wan2_7` (barato) | 42cr / 15cr | 1-2/sem |
| **Producto (Nuvia)** | UGC con producto real en mano | UGC producto | Marketing Studio avatar+producto | 42-75cr | 1-2/mes |

## 3. Modelo por tarea (refinado con todos los tests de hoy)

| Necesito | Herramienta | Nota |
|---|---|---|
| Foto calma/sonrisa suave | `text2image_soul_v2` + soul_id `36305a9b` (0.12cr) | barato, OK para expresiones calmas |
| Foto expresion fuerte (cejas arriba, sorpresa, risa grande) | `nano_banana_pro` + Element `902eeebb` (2cr) | `text2image_soul_v2` mete arrugas de forehead aca |
| **Contenido original (feed, variedad)** | `nano_banana_pro` + SOLO `902eeebb` (cara) + outfit/lugar/accion EN TEXTO (2cr) | escena nueva cada vez, identidad lockeada. SIEMPRE "no brand logos". Ver `lucia-content-bank-20260709/` |
| Match EXACTO de producto/lugar real | `nano_banana_pro` + `902eeebb` + Element del producto/lugar (2cr) | SOLO cuando el objeto tiene que verse identico (producto cliente). Combinar outfit+lugar Elements copia las fotos 1:1 (no usar para variedad) |
| B-roll movimiento simple | `kling2_6` (10cr) | cinematico |
| B-roll con reaccion/emocion marcada | `minimax_hailuo` (6cr) | mas barato, mejor cara en emocion, forehead liso |
| Hablando a camara (premium) | Marketing Studio `ugc_direct_to_camera` + avatar `a1e334f3` (42cr) | mejor lipsync disponible; guion entre comillas en el prompt fuerza español |
| Hablando a camara (barato) | `wan2_7` + still con dientes visibles + audio (15cr) | el still DEBE tener sonrisa abierta (ancla de dientes) |
| Voz (VO y lipsync) | `seed_audio` + voice_type='element' + **`8de5db95-e898-46a6-bb68-26d02f311686`** ("Lucia-voz", asset clonado propio) | voz canonica lockeada de Lucia, español. Fallback: preset Isabella `80924413`. B-roll NO lleva lipsync — voz va como VO en edicion |
| Producto real en mano | Marketing Studio avatar+producto (42-75cr) | Nivel 2 |
| EVITAR | Seedance 2.0 (45-135cr) | salvo bikini/swimwear donde otros bloquean |

## 4. Estructura de pieza "reel hablando" (formato validado)

1. **Hook b-roll** (Kling/minimax, movimiento, VO arriba, sin lipsync).
2. **Corte a ella hablando** (Marketing Studio/`wan2_7`, lipsync real) — dice el punto.
3. **Cierre b-roll** (otra escena) + CTA hablado o texto.

B-roll = voz como VO (nunca forzar lipsync ahi, falla). Lipsync real solo en el segmento
de "hablando a camara".

## 4b. ESTANDAR DE REALISMO (2026-07-09, Sergio eligió — resuelve el "se ve muy AI")

**Para fotos de Lucia que parezcan REALES, el estandar es:**
1. **Ancla `ced20cc2`** (frame REAL, no `902eeebb` que era generada — esa era la causa del look AI).
2. **Prompt de realismo agresivo** (ojos con catchlights/vida, cejas con pelos individuales
   despeinadas, poros/peach fuzz, asimetria, "not AI-looking / not plastic / not doll-like").
3. **Resolucion 2k.**
4. **Outfit + lugar EN TEXTO** (la ficha-Element no combina con `ced20cc2`; fichas solo
   para match exacto con `902eeebb`).

Formula completa en `lucia-onia-identity-bible.md`. Ejemplos del salto de calidad:
`lucia-content-bank-20260709/realism-v2-REAL-*` (la de la derecha que eligió Sergio) vs
los selfies planos anteriores.

## 4c. Acciones creativas / "random" (verificado 2026-07-09)

Veo3.1 maneja acciones dinámicas y transformaciones mágicas (saltar, girar,
**convertirse en un ave y volar**). Ejemplo: `lucia-demos-20260709/transform-bird-veo31.mp4`
(mujer → ave, morph limpio, 9:16). Para estas cosas usar `veo3_1` (force `aspect_ratio:9:16`,
mutear su audio). Es EL modelo para contenido creativo/viral con acción o VFX.

## 5. Pipeline de produccion (de idea a publicable)

1. Guion corto en español (hook + valor + CTA).
2. Generar assets segun pilar (tabla arriba), barato primero.
3. QA visual: comparar contra el shoot quirurgico (10 fotos) — pecas/cejas/ojos/nariz/pelo/forehead.
4. Voz `seed_audio` español para VO/segmentos.
5. Edicion: ffmpeg o template Remotion (content-engine) — normalizar resolucion, concatenar,
   mezclar VO, agregar subtitulos/marca/CTA si es branded.
6. `virality_predictor` (opcional) antes de publicar.
7. Cola de aprobacion (nada se publica sin OK de Sergio).
8. Publicar en cuenta propia (pendiente: crear cuenta + token IG).

## 6. Bloqueos humanos (Sergio, no puedo hacerlos yo)

- **Crear la cuenta de IG/TikTok de Lucia** (usuario/contraseña, verificacion telefono) —
  no puedo registrar cuentas ni ingresar credenciales por vos.
- **Etiqueta "contenido generado con IA"** en el perfil (Meta/TikTok lo exigen para
  personaje digital) — definir el texto, va en bio.
- Aprobar handle + bio final.

## 7. Proximos pasos concretos

1. ✅ Identidad cerrada.
2. ⏳ Producir pieza #1 (organica, lifestyle) como prueba del pipeline completo -> .mp4 publicable.
3. Definir handle + bio (borrador listo para que Sergio cree la cuenta).
4. Armar template Remotion del formato "reel hablando" (repetible, 1 JSON -> N videos).
5. Recien con audiencia: primera pieza de producto Nuvia.
