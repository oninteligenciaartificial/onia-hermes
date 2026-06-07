# Round 18 - Mara motion control production system

Fecha: 2026-06-06
Estado: sistema interno, no publicado
Objetivo: corregir el flujo de video de Mara para producir movimiento real de
cuerpo completo, no solo talking-head, y dejar defaults fijos para futuras
generaciones.

## Decision principal

Mara necesita dos capas separadas:

1. Identidad fija: rostro, cuerpo, sonrisa, pelo, pecas, piel y estilo.
2. Movimiento real: cuerpo completo, caminata, manos, cambios de postura,
   acciones con producto y camara con ritmo social.

El error del Round 17 fue usar una imagen frontal como ancla principal y pedir
movimiento tipo storytime. El resultado hizo hablar la imagen, pero no creo una
accion corporal fuerte. Para motion control real, el input debe ser un video de
movimiento autorizado o un prompt full-body desde el primer frame.

## Frontera legal y creativa

No se debe descargar, copiar exactamente ni redistribuir un TikTok de una
creadora real sin permiso.

Permitido:

- analizar estructura, ritmo, encuadre, duracion, tipos de gestos y energia;
- recrear una version original con Mara;
- usar un video propio o licenciado como driving video;
- buscar referencias para inspiracion estructural.

No permitido sin permiso:

- rippear el video de una creadora;
- copiar exactamente su performance;
- clonar su voz, identidad, guion, musica, gestos reconocibles o branding;
- entregar una pieza que parezca reemplazo directo del video original.

## Investigacion Higgsfield

Fuentes revisadas:

- Higgsfield Motion Control:
  `https://higgsfield.ai/create/motion-control`
- Higgsfield MCP:
  `https://higgsfield.ai/mcp`
- Higgsfield CLI local con `@higgsfield/cli`
- TikTok Creative Center / Trends:
  `https://ads.us.tiktok.com/help/article/how-to-use-trends`
  `https://ads.us.tiktok.com/help/article/creative-center`

### Modelos disponibles en CLI local

Video:

- `seedance_2_0`
- `kling3_0`
- `cinematic_studio_3_0`
- `cinematic_studio_video`
- `cinematic_studio_video_v2`
- `marketing_studio_video`
- `veo3_1_lite`
- `veo3_1`
- `veo3`
- `reframe`
- `soul_cast`
- `draw_to_video`
- `wan2_6`
- `wan2_7`
- `minimax_hailuo`

Imagen/identidad:

- `nano_banana_2`
- `nano_banana_flash`
- `text2image_soul_v2`
- `soul_cinematic`
- `soul_location`
- `marketing_studio_image`
- `gpt_image_2`
- `flux_2`
- `kling_omni_image`

### Rutas practicas

#### Ruta A - Motion control exacto autorizado

Usar cuando Sergio pase un video propio, licenciado o con permiso.

Flujo:

```text
video driving autorizado
-> analizar movimiento y recortar 5-12s
-> crear full-body still de Mara con outfit/escena equivalentes
-> Higgsfield Motion Control / modelo con video reference
-> generar Mara copiando trayectoria general del cuerpo
-> revisar identidad, manos, piernas y boca
-> aplicar voz/lipsync si hace falta
-> subtitulos y edicion
```

Uso:

- caminar hacia camara;
- GRWM con cuerpo completo;
- entrar a cuadro, agarrar producto y hablar;
- transiciones de outfit;
- videos de moda/accesorios.

#### Ruta B - TikTok no autorizado como referencia estructural

Usar cuando solo existe un link publico de TikTok.

Flujo:

```text
link TikTok
-> extraer patron: encuadre, ritmo, gestos, hooks, cantidad de cortes
-> escribir motion blueprint original
-> generar Mara con full-body prompt y outfit propio
-> no copiar guion ni movimientos exactos
```

Uso:

- inspiracion viral segura;
- ads y organico sin riesgo de copia;
- investigar tendencias.

#### Ruta C - Prompt full-body sin driving video

Usar si se necesita producir rapido.

Flujo:

```text
Mara full-body still
-> Kling 3.0 / Seedance 2.0 / Veo
-> prompt exige accion corporal desde primer frame
-> audio/lipsync despues
```

Uso:

- previews internos;
- caminatas simples;
- lifestyle;
- producto en mano.

Limitacion:

No copia movimiento exacto. Genera movimiento original.

## Configuracion fija de Mara

Archivo canonico:

`mara-motion-control-config-20260606.json`

Imagen principal para video:

`identity-bank-50/photos/mara_identity_02.jpg`

Master sheet:

`20260605-higgsfield-luxury-identity-contact-sheet-4k-v1.png`

Prompt fijo:

```text
Same fictional adult red-haired woman from the Mara Vale identity sheet.
Preserve the same face, freckles, green-hazel eyes, nose, lips, jawline,
copper-red wavy hair, fair skin, body proportions and soft warm smile.
Do not create a similar person. Keep the exact documented identity.
```

## Vestuarios fijos

### Apartment luxury UGC

Cream fitted tank or ribbed top, relaxed linen shirt, high-waist tailored pants,
small gold hoops, no logos.

### City lifestyle

White fitted tee or bodysuit, oversized beige blazer, straight-leg denim, simple
belt, neutral sneakers or sandals, no logos.

### Premium beauty

Ivory silk blouse or minimal dress, subtle gold jewelry, polished hair, soft
natural makeup, no logos.

### Athleisure safe

Neutral fitted long-sleeve top, high-waist leggings or joggers, clean sneakers,
brand-safe and non-sexualized.

## Presets de movimiento

### Full body walk to camera

Mara starts full body in an apartment hallway or living room, walks naturally
toward camera, stops at medium shot, smiles, raises product or gestures with one
hand.

### Apartment storytime active

Mara sits or stands, leans forward on the hook, gestures with both hands, turns
head slightly, smiles, looks away briefly, then back to camera.

### GRWM mirror walk

Mara enters frame, adjusts blazer or hair in mirror, walks to table, picks up
product, speaks to camera.

### Product pickup demo

Mara walks from sofa to side table, picks up product, holds it near camera,
demonstrates one simple action.

### Street lifestyle walk

Mara walks on a clean city sidewalk or boutique street, natural arm swing,
product visible, quick glance to camera.

## Prompt base full-body motion

```text
Same fictional adult red-haired woman from the Mara Vale identity sheet.
Preserve exact face, freckles, green-hazel eyes, nose, lips, jawline,
copper-red wavy hair, very fair skin, body proportions and soft warm smile.
Full-body vertical 9:16 video in a warm modern apartment. Outfit:
{wardrobe}. Motion: {motion}. She moves naturally with real body movement,
visible arms and legs, natural walking weight shift, relaxed hand gestures,
subtle head turns, micro-smiles, realistic blinking. Camera: phone-first but
premium, slight handheld realism, no static talking head. Keep identity locked
and body consistent. Scene: {setting}. No logos, no text, no watermark.
```

Negative:

```text
No copied real person likeness, no exact copied creator performance, no
identity drift, no different face, no frozen body, no only mouth movement, no
stiff pose, no robotic expression, no distorted hands, no broken walking, no
warped legs, no sexualized pose, no plastic skin, no flicker, no fake logos, no
unreadable text.
```

## Workflow de busqueda de referencias TikTok

Cuando se busquen videos:

1. Usar TikTok Creative Center, TikTok search o referencias publicas.
2. Guardar solo metadata: URL, tema, hook, duracion, encuadre, movimientos,
   cortes, energia y riesgo legal.
3. No descargar ni copiar exacto salvo permiso.
4. Convertir cada referencia a un blueprint original para Mara.
5. Rankear por utilidad: movimiento real, cuerpo completo, producto claro,
   viralidad, conversion y bajo riesgo de copia.

Plantilla de analisis:

```json
{
  "url": "",
  "platform": "TikTok",
  "category": "storytime | grwm | walking | product_demo | outfit_transition",
  "usable_as": "structure_only | licensed_driving_video",
  "hook_pattern": "",
  "camera": "",
  "movement_blueprint": "",
  "wardrobe_direction": "",
  "mara_adaptation": "",
  "risk": "low | medium | high"
}
```

## Reglas para proximas generaciones

- Si el objetivo es caminar o cuerpo completo, no usar solo retrato close-up.
- Generar primero full-body still de Mara con outfit y escena.
- El primer frame debe mostrar cuerpo completo si la accion depende de piernas.
- Usar video driving autorizado si se requiere copiar movimiento.
- Si no hay permiso, usar motion blueprint original.
- Para speech, generar movimiento visual primero y lipsync despues.
- No gastar creditos altos hasta que el still full-body pase QA.

## Proxima accion recomendada

Crear una toma nueva de Mara full-body en departamento, sin depender del TikTok
exacto:

```text
Mara entra caminando desde el fondo del departamento, se acerca a la camara,
se sienta en el borde del sofa, mira a camara, sonrie, levanta el producto y
hace dos gestos naturales de storytime.
```

Si Sergio quiere motion-control exacto, debe usarse un driving video propio o
licenciado. Con eso si se puede intentar copiar trayectoria corporal de forma
mucho mas cercana sin riesgo de plataforma o derechos.
