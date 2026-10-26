# Onia — Sistema de Producción de Videos con Modelos IA

**Versión:** 1.0  
**Actualizado:** 2026-06-09  
**Responsable:** Hermes / Onia  

---

## 1. PRINCIPIO FUNDAMENTAL

Los videos con la modelo NO usan cara de Sergio ni voz clonada de Sergio.  
La modelo es un personaje ficticio adulto que representa UGC de marca.  
Todo video debe pasar revisión antes de publicarse.

---

## 2. IDENTIDAD DE LA MODELO — MARA VALE

**Nombre del personaje:** Mara Vale  
**Tipo:** Personaje ficticio adulto, no es una persona real  
**Uso:** UGC de skincare, belleza, bienestar, lifestyle  

### Descripción visual

```json
{
  "character": "Mara Vale",
  "type": "fictional_adult_ugc_model",
  "appearance": {
    "hair": "copper-red wavy, natural volume, mid-length",
    "eyes": "green-hazel",
    "skin": "fair with light freckles",
    "smile": "warm, genuine, approachable",
    "proportions": "healthy adult, natural",
    "energy": "authentic, relatable, premium but accessible"
  },
  "brand_safe_outfits": [
    "cream ribbed top",
    "soft ivory linen shirt",
    "relaxed cream blazer",
    "white fitted tee",
    "beige or neutral tones"
  ],
  "forbidden": [
    "deep cleavage",
    "revealing outfits",
    "third-party logos",
    "fake testimonials",
    "medical claims",
    "before/after exaggerated results"
  ]
}
```

### Imágenes de referencia disponibles (Higgsfield)

```json
{
  "mara_vale_images": [
    {
      "media_id": "8dc5726b-32a5-4da5-bfdb-74a5f342409c",
      "url": "https://d2ol7oe51mr4n9.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/8dc5726b-32a5-4da5-bfdb-74a5f342409c.png",
      "description": "Mara close-up UGC style, last used in skincare video 2026-06-06",
      "best_for": ["UGC skincare", "close-up face", "product hold"],
      "used_in_videos": ["5166dcf2-fba5-40d5-8bf0-31bf915ce58d"]
    },
    {
      "media_id": "5966a501-03ea-47f6-914e-10e07e17c254",
      "url": "https://d2ol7oe51mr4n9.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/5966a501-03ea-47f6-914e-10e07e17c254.png",
      "description": "Mara full-body apartment",
      "best_for": ["full body movement", "apartment lifestyle", "storytime standing"],
      "used_in_videos": ["62308425-625f-48ce-a49e-307e9eeb4387"]
    },
    {
      "media_id": "7af6b46d-0240-4083-8828-3f8dc7b78772",
      "url": "https://d2ol7oe51mr4n9.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/7af6b46d-0240-4083-8828-3f8dc7b78772.png",
      "description": "Mara storytime close-up, warm apartment",
      "best_for": ["storytime", "talking head", "lifestyle", "warmth"],
      "used_in_videos": ["f841a708-fbd5-4cc0-be75-a64c3d3fadc6"]
    }
  ],
  "sergio_reference_images": [
    {
      "media_id": "074fe6b1-9752-4d4f-91b3-04b6a7400349",
      "description": "Sergio approved avatar, black outfit, founder energy",
      "best_for": ["Sergio founder videos", "tech/AI content"],
      "souls": [
        "aeaa74af-5243-4dc0-8101-09b25e98a7d7",
        "1238064e-1295-4cbf-9a41-861d4106e0e8",
        "05cebe09-5672-4d50-90b2-d92c680957f7"
      ]
    }
  ]
}
```

---

## 3. MODELOS DE GENERACIÓN Y CUÁNDO USARLOS

### Comparativa

| Modelo | Costo test (5s) | Fidelidad identidad | Movimiento | Audio | Mejor para |
|--------|----------------|---------------------|------------|-------|-----------|
| `kling3_0` std | 7.5 créditos | Media-alta | Natural, multi-shot | Opcional | Test rápido, storytime, lifestyle |
| `kling3_0` pro | ~15 créditos | Alta | Premium | Opcional | Producción final |
| `seedance_2_0` fast | ~8 créditos | Alta | Consistente | No (vía medias) | Fidelidad de identidad, e-commerce |
| `seedance_2_0` std | ~15 créditos | Muy alta | Premium | No | Producción final skincare |
| `seedance_2_0` std + reference video | ~20 créditos | Muy alta | Copia referencia | No | Replicar movimientos exactos |

### Regla de uso

```
Test/validación → kling3_0 std, sin audio, 5s = ~7.5 créditos
Producción skincare → seedance_2_0 std + imagen referencia = ~15 créditos
Producción premium → seedance_2_0 std + video referencia = ~20 créditos
```

---

## 4. ESCENARIOS APROBADOS PARA MARA

### 4.1 Bathroom/Tocador (skincare)

```json
{
  "scene": "bathroom_vanity",
  "description": "Bright clean bathroom, warm soft lighting, minimal decor",
  "lighting": "warm, natural, soft diffused",
  "camera": "phone-first, eye-level, slight handheld",
  "outfit": "cream ribbed top or soft robe",
  "props": ["cream jar", "serum bottle", "clean towel"],
  "mood": "morning routine, authentic, refreshed"
}
```

### 4.2 Apartment Lifestyle

```json
{
  "scene": "warm_apartment",
  "description": "Cozy living room at sunset, lamp, sofa, side table, plant",
  "lighting": "golden hour, warm lamp, shallow depth of field",
  "camera": "phone-first, close-up to medium, subtle push-in",
  "outfit": "relaxed ivory linen or cream blazer",
  "props": ["product on table", "minimal decor"],
  "mood": "storytime, confidential recommendation, friend-to-friend"
}
```

### 4.3 Unboxing / Reveal

```json
{
  "scene": "clean_table_neutral",
  "description": "White or light wood table, neutral background, minimal",
  "lighting": "clean studio or bright natural window",
  "camera": "overhead or eye-level, product-focused",
  "outfit": "brand-safe neutral",
  "props": ["product packaging", "tissue paper"],
  "mood": "first impression, excited, genuine discovery"
}
```

---

## 5. GUIONES BASE — CREMA / SKINCARE

### 5.1 UGC Hook 1 — "Descubrimiento"

```
TIPO: UGC storytime 15-30s
ESCENA: Apartment living room, warm lighting
MOVIMIENTO: Lean in, producto en mano, mira a cámara

GUION (español neutro):
[HOOK — 0-3s]
"Llevo tres semanas usando esto y tengo que contártelo."

[PROBLEMA — 3-8s]
"Mi piel estaba apagada. Probé de todo. Nada funcionaba bien."

[SOLUCIÓN — 8-18s]
"Esta crema cambia todo. La textura, el olor, y en una semana ya se nota diferencia."

[CTA — 18-25s]
"Está en el link. Te va a sorprender."

PROMPT HIGGSFIELD:
"Mara Vale [exact identity: fair freckled skin, copper-red wavy hair, green-hazel eyes].
Warm apartment storytime. She holds a small white cream jar, leans toward camera on hook line, 
tilts product to show it at 8s mark, touches her own cheek gently at 18s, ends with direct 
confident eye contact and small smile. UGC authentic energy, no text, no watermark."
```

### 5.2 UGC Hook 2 — "Antes/Después" (solo visual, sin claims médicos)

```
TIPO: UGC review 10-20s
ESCENA: Bathroom vanity, morning light
MOVIMIENTO: Face close-up, product demonstration

GUION:
[HOOK — 0-3s]
"Este es mi nuevo favorito de skincare."

[DEMOSTRACIÓN — 3-12s]
[Mara aplica/sostiene crema, muestra textura]
"Mira la textura. Absorbe al instante. Sin residuo."

[RESULTADO — 12-18s]
"Mi piel se ve diferente. Genuinamente diferente."

[CTA — 18-20s]
"Link en bio."

PROMPT HIGGSFIELD:
"Mara Vale [exact identity]. Bathroom vanity, warm soft lighting. She opens cream jar,
scoops tiny amount with fingertip, holds toward camera showing texture, smooths on back
of hand. Expression: genuinely impressed, small satisfied smile. Close-up hands and face
alternating. UGC natural demo style, realistic hands, no text, no watermark."
```

### 5.3 UGC Hook 3 — "Recomendación directa"

```
TIPO: UGC rápido 8-12s
ESCENA: Cualquier ambiente premium
MOVIMIENTO: Directo, energético, una sola toma

GUION:
[0-3s] "Si buscas una crema que realmente funcione—"
[3-8s] [muestra producto] "Esta. Sin dudas."
[8-10s] "Link abajo."

PROMPT HIGGSFIELD:
"Mara Vale [exact identity]. Clean bright bathroom. Direct to camera, confident, 
holds cream jar up at 3s mark with both hands, nods, slight forward lean. 
Fast UGC energy, 8 seconds. Realistic hands, no text, no watermark."
```

---

## 6. FLUJO DE PRODUCCIÓN COMPLETO

### Fase 1 — Brief y aprobación

```
1. Hermes genera brief del video (tipo, guion, escena, duración)
2. Brief enviado a Telegram para revisión
3. Sergio aprueba: "Aprobar video <job_id>"
4. Solo después de aprobación se genera
```

### Fase 2 — Generación (Higgsfield MCP)

```
1. Seleccionar imagen de Mara correcta según escena
2. Seleccionar modelo según presupuesto:
   - Test: kling3_0 std, 5s, sin audio
   - Producción: seedance_2_0 std, 10-15s
3. Escribir prompt con:
   - Identidad exacta de Mara (siempre incluir en prompt)
   - Escena y lighting
   - Movimientos específicos por segundo
   - Outfit brand-safe
   - Negativos: no text, no watermark, no identity drift
4. get_cost: true primero si >20 créditos
5. Generar
```

### Fase 3 — Revisión y aprobación

```
1. URL del video enviada a Telegram
2. Sergio revisa: identidad, movimiento, outfit, claim
3. Aprobación: "Aprobar video <job_id>"
4. Si necesita cambio: "Rehacer video <job_id>: <cambio>"
```

### Fase 4 — Edición (post-producción)

Ver sección 7.

### Fase 5 — Publicación

```
1. Solo con "Publicar video <job_id>"
2. Hermes usa ig-publish con caption final aprobada
3. Registra published_id en Video Lab
```

---

## 7. EDICIÓN REQUERIDA

### Edición mínima (para contenido rápido)

```
- Captions/subtítulos: si hay audio, añadir con CapCut o Descript
- Trim: cortar primeros/últimos frames si hay glitch
- Música de fondo: opcional, baja, sin letra (royalty-free)
- Sin otros cambios
```

### Edición estándar

```
1. CAPTIONS
   - Fuente: bold sans-serif, blanca con sombra o fondo negro 70%
   - Tamaño: legible en móvil
   - Posición: centrado inferior o tercio inferior
   - Herramienta: CapCut (auto-captions) o Descript

2. MÚSICA
   - Tipo: lo-fi, ambient, trending instrumental sin letra
   - Volumen: -15 a -20dB bajo voz
   - Fuentes: CapCut library, Epidemic Sound

3. INTRO/HOOK visual
   - Primer frame limpio (sin glitch)
   - Puede añadir texto hook overlay: bold, 2-3 palabras max
   - Duración overlay: 0.5-1s

4. OUTRO/CTA
   - Texto overlay: "Link en bio" o "↓ Link"
   - Último segundo o fade out

5. COLOR GRADE (opcional, producción)
   - Warm tones para skincare (+10 warm, +5 saturation)
   - Sin filtros que cambien piel de Mara
```

### Edición premium (clientes)

```
1. Todo lo de edición estándar
2. Logo del cliente: esquina inferior, pequeño, último 3 segundos
3. Sound design: foley de producto (click del frasco, textura)
4. B-roll intercalado: close-up de producto (generar imagen separada)
5. Motion graphics: precio o claim key en tarjeta final
6. Color brand: ajustar palette según colores del cliente
```

---

## 8. PARÁMETROS TÉCNICOS HIGGSFIELD

### Config de producción

```json
{
  "test_config": {
    "model": "kling3_0",
    "mode": "std",
    "aspect_ratio": "9:16",
    "duration": 5,
    "resolution": "720p",
    "sound": "off",
    "credits_approx": 7.5
  },
  "production_config": {
    "model": "seedance_2_0",
    "mode": "std",
    "aspect_ratio": "9:16",
    "duration": 10,
    "resolution": "720p",
    "genre": "auto",
    "generate_audio": false,
    "credits_approx": 15
  },
  "premium_config": {
    "model": "seedance_2_0",
    "mode": "std",
    "aspect_ratio": "9:16",
    "duration": 15,
    "resolution": "1080p",
    "genre": "drama",
    "generate_audio": false,
    "reference_video": true,
    "credits_approx": 25
  }
}
```

### Prompt base (siempre incluir)

```
IDENTIDAD FIJA (copiar siempre en prompt):
"Mara Vale, fictional adult red-haired woman. 
Exact same identity: fair freckled skin, copper-red wavy hair, 
green-hazel eyes, warm smile, healthy adult proportions.
No identity drift, no different face, no text, no watermark, no logos."
```

### Negativos siempre incluir

```
"no identity drift, no different face, no text, no watermark, 
no logos, no bad hands, no deformed anatomy, no plastic skin, 
no fake testimonials, no medical claims"
```

---

## 9. BIBLIOTECA DE PROMPTS PROBADOS

### UGC Skincare (kling3_0, funciona)

```
"Mara Vale, fictional adult red-haired woman. Exact same identity: fair freckled skin, 
copper-red wavy hair, green-hazel eyes, warm smile. Vertical 9:16 UGC skincare ad. 
She is in a bright clean bathroom vanity, warm soft lighting. She holds a small white 
luxury cream jar toward the camera with both hands, looks at it with a genuine smile, 
then directly at camera. Natural UGC movement: leans slightly in, tilts product for 
camera, taps product gently, looks back at camera with a satisfied nod. Brand-safe 
outfit: soft cream ribbed top. Casual premium storytime energy. Realistic hands, 
no identity drift, no text, no watermark, no logos."
```

### Storytime Apartment (kling3_0, funciona)

```
"Same fictional adult red-haired woman from the Mara Vale identity bank, exact same 
identity: freckles, green-hazel eyes, copper-red wavy hair, fair skin, soft warm smile. 
Vertical 9:16 intimate storytime video in a warm modern apartment at sunset, cozy 
lived-in room with lamp, neutral sofa, side table, curtains, plants, shallow depth of 
field, premium luxury aesthetic. Eye-level close-up/medium close-up, direct to camera. 
Natural TikTok storytime movement. No text, no watermark, no logos."
```

### Full Body Movement (kling3_0, funciona)

```
"Animate this full-body image of Mara Vale into a vertical 9:16 premium UGC video. 
Preserve exact identity, face, freckles, green-hazel eyes, copper-red wavy hair, 
fair skin, body proportions. She starts standing full body, takes two natural small 
steps toward camera, stops in medium-full shot, smiles warmly, lightly adjusts hair 
with one hand, gestures with other hand near chest as if beginning storytime, then 
leans slightly forward looking directly into camera. Camera: phone-first, subtle 
handheld, premium apartment lighting. No text, no logos, no watermark."
```

---

## 10. REGLAS DE CONTENIDO

```
✅ PERMITIDO:
- Mostrar producto visualmente
- Claims de textura, olor, sensación (subjetivos)
- "Me encanta", "mi favorito", "lo recomiendo"
- Demostración visual de aplicación
- Lifestyle premium de la modelo

❌ PROHIBIDO:
- Claims médicos: "cura", "trata", "elimina acné", "dermatológico"
- Claims garantizados: "funciona al 100%", "resultados garantizados"
- Antes/después con implicación médica
- Cara o voz de Sergio sin aprobación
- Datos falsos de clientes reales
- Logos de terceros sin permiso
- Menores de edad en contenido
- Contenido engañoso de cualquier tipo
```

---

## 11. COSTOS ESTIMADOS POR TIPO DE CAMPAÑA

```
Test unitario (5s, kling std):        ~7.5 créditos
Video base (10s, seedance std):        ~15 créditos
Video premium (15s, seedance std):     ~25 créditos
Campaña 5 videos test:                ~37.5 créditos
Campaña 5 videos producción:          ~75 créditos
Campaña mensual (30 videos base):    ~450 créditos

Balance actual: 1,223 créditos (Ultra plan)
Capacidad: ~80 videos de producción o ~160 videos test
```

---

## 12. COMANDOS HERMES PARA VIDEO CON MODELO

```bash
# Generar brief + test rápido
"Genera video Mara: UGC crema hidratante, 5s, test"

# Producir video final
"Genera video Mara: UGC crema hidratante, 15s, producción"

# Ver videos generados
"Muestra últimas generaciones Higgsfield"

# Aprobar y pasar a edición
"Aprobar video <job_id>"

# Solicitar revisión
"Rehacer video <job_id>: <cambio específico>"
```

---

## 13. PRÓXIMOS PASOS PARA ESCALAR

### Fase 1 (ahora) — Test y calibración
- [ ] Generar 3-5 videos test con diferentes prompts
- [ ] Identificar qué escenas funcionan mejor
- [ ] Documentar qué imágenes de Mara dan mejor resultado
- [ ] Crear 3 prompts base validados

### Fase 2 — Producción básica
- [ ] Crear element de referencia para Mara en Higgsfield
- [ ] Generar primer lote de 10 videos para cliente
- [ ] Definir pipeline de edición (CapCut + captions)
- [ ] Establecer precio por video producido

### Fase 3 — Automatización
- [ ] n8n workflow: brief → aprobación → generación → revisión → edición → publicación
- [ ] Soul training de Mara (5-20 imágenes) para máxima consistencia
- [ ] Integración con ElevenLabs para audio UGC natural
- [ ] Dashboard de tracking de videos por cliente
