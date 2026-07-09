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
| Foto calma/sonrisa suave | `soul_2` + soul_id `36305a9b` (0.12cr) | barato, OK para expresiones calmas |
| Foto expresion fuerte (cejas arriba, sorpresa, risa grande) | `nano_banana_pro` + Element `902eeebb` (2cr) | `soul_2` mete arrugas de forehead aca |
| Combo cara+outfit+lugar exacto | `nano_banana_pro` + `902eeebb` + outfit + lugar (2cr) | SIEMPRE "no brand logos" en el prompt (mete Nike/NY solo) |
| B-roll movimiento simple | `kling2_6` (10cr) | cinematico |
| B-roll con reaccion/emocion marcada | `minimax_hailuo` (6cr) | mas barato, mejor cara en emocion, forehead liso |
| Hablando a camara (premium) | Marketing Studio `ugc_direct_to_camera` + avatar `a1e334f3` (42cr) | mejor lipsync disponible; guion entre comillas en el prompt fuerza español |
| Hablando a camara (barato) | `wan2_7` + still con dientes visibles + audio (15cr) | el still DEBE tener sonrisa abierta (ancla de dientes) |
| Voz para VO de b-roll | `seed_audio` Isabella español | b-roll NO lleva lipsync — voz va como VO en edicion |
| Producto real en mano | Marketing Studio avatar+producto (42-75cr) | Nivel 2 |
| EVITAR | Seedance 2.0 (45-135cr) | salvo bikini/swimwear donde otros bloquean |

## 4. Estructura de pieza "reel hablando" (formato validado)

1. **Hook b-roll** (Kling/minimax, movimiento, VO arriba, sin lipsync).
2. **Corte a ella hablando** (Marketing Studio/`wan2_7`, lipsync real) — dice el punto.
3. **Cierre b-roll** (otra escena) + CTA hablado o texto.

B-roll = voz como VO (nunca forzar lipsync ahi, falla). Lipsync real solo en el segmento
de "hablando a camara".

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
