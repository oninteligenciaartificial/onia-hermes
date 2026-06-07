# Sergio Face + Teeth Lock Workflow

Estado: interno, no publicado.
Fecha: 2026-06-05.

## Diagnostico

El video anterior se veia con filtro porque el flujo estaba generando un avatar desde un still ya procesado y despues el modelo de video inventaba boca, dientes, piel y microexpresiones. Para hablar a camara, los dientes no pueden quedar como texto de prompt: tienen que estar anclados con fotos reales de sonrisa.

## Assets canonicos creados

- Shooting Nano Banana Pro 4K:
  `hermes-content/references/sergio-approved-media/identity-shoots/20260605-nano-banana-face-teeth-lock/nano-banana-face-teeth-lock.png`
- Prompt del shooting:
  `nano-banana-face-teeth-lock-prompt.txt`
- Soul ID entrenado:
  `aeaa74af-5243-4dc0-8101-09b25e98a7d7`
- Nombre Soul ID:
  `Sergio ONIA Face Teeth Lock 20260605`

## Skills/frentes recomendados

1. `video-lab-higgsfield`
   - Uso: render, aprobaciones, QA, trazabilidad.
   - Prioridad: alta.
   - Error a evitar: generar videos con cara real sin lock de identidad ni revision manual.

2. `radar-creativo-onia`
   - Uso: revisar modelos actuales y decidir stack premium antes de gastar creditos.
   - Prioridad: alta cuando el modelo/herramienta cambia.
   - Error a evitar: asumir que Seedance, Kling, Veo o Nano Banana se comportan igual semana a semana.

3. `marca-personal-sergio`
   - Uso: tono y contenido de Sergio como fundador/operador.
   - Prioridad: media-alta.
   - Error a evitar: hacer un avatar demasiado publicitario, viejo, guru o stock.

4. `seguridad-credenciales`
   - Uso: evitar exponer claves, assets privados, voz o cara sin aprobacion.
   - Prioridad: alta para publicacion/voz.
   - Error a evitar: publicar o entregar un deepfake propio sin revision explicita.

## Stack premium recomendado

1. Nano Banana Pro / Gemini 3 Pro Image
   - Rol: shooting maestro, variantes estaticas, correccion de ropa/peinado/fondo.
   - Regla: usar 4K y multiples referencias reales, no solo el avatar generado.

2. Higgsfield Soul ID
   - Rol: identidad fija de Sergio, especialmente cara y sonrisa.
   - Regla: entrenar con fotos reales, no con imagenes demasiado retocadas.

3. Kling 3.0
   - Rol: video premium image-to-video / reference-to-video.
   - Regla: usar modo `4k` o `pro`, `sound off` si no hay aprobacion de voz, y referencias de cara/dientes como elementos.

4. Veo 3.1
   - Rol: backup premium si Kling falla en naturalidad.
   - Regla: usarlo para tomas con menos lip-sync y mas narrativa visual.

5. Edicion local con FFmpeg/CapCut
   - Rol: subtitulos, reencuadre, color y compresion.
   - Regla: no quemar subtitulos encima de boca/cara; evitar filtros agresivos.

## Prompt maestro Nano Banana Pro

Usar el archivo:

```text
nano-banana-face-teeth-lock-prompt.txt
```

Reglas clave:
- Las fotos de sonrisa real son el dental lock.
- No blanquear, enderezar, agrandar ni reemplazar dientes.
- No piel plastica, no look cinematico, no beauty filter.
- Contact sheet 16:9 con neutral, leve sonrisa, sonrisa completa, 3/4 y perfil.

## Prompt maestro Kling 3.0

```text
Generate a premium 9:16 talking-head video of Sergio for an internal avatar test.

Use the provided Sergio Face Teeth Lock references as strict identity elements. Preserve Sergio's exact young face, real brow shape, eye spacing, eye size, nose, lips, jaw, cheeks, ears, hairline, side-part black hair, skin tone, neck length, and natural asymmetry.

Dental lock: when the mouth opens or smiles, preserve the same real teeth from the dental reference photos: same upper front teeth shape, spacing, width, gum visibility, smile arc, lip shape and mouth corners. Do not invent new teeth. Do not whiten, straighten, resize, replace, add, remove or perfect the teeth.

Scene: realistic phone-camera creator video in a simple modern workspace. Sergio wears a clean black crewneck or black shirt with a black blazer, no logos. Natural soft light, neutral color, no cinematic filter, no heavy contrast, no wax skin, no beauty filter.

Action: Sergio looks at camera and calmly says in Spanish: La IA no es magia. Es ejecucion con sistemas. Keep delivery natural, founder/operator tone, short and practical.

Camera: locked vertical portrait, chest-up framing, eye-level lens, no zoom, no pan, no dramatic movement.

Motion: subtle natural head movement, realistic breathing, natural blink, controlled mouth movement, slight friendly expression. Keep shoulders stable and not skinny.

Sound: off unless explicit voice approval is given. If sound is off, generate only visual mouth movement and add subtitles in post.

Avoid: AI filter, plastic skin, glossy cinematic grade, older face, different person, face morphing, one eye bigger, eyes moving apart, new teeth, perfect Hollywood teeth, teeth glitches, warped mouth, tongue artifacts, long thin neck, skinny shoulders, hair falling forward, side-part collapsing, distorted blazer, fake text, watermark, UI overlay.
```

## Comando base Kling 3.0 en Higgsfield CLI

```powershell
$prompt = Get-Content -LiteralPath "<prompt-file>" -Raw
npx -y -p @higgsfield/cli higgsfield generate create kling3_0 `
  --prompt $prompt `
  --image "<identity-contact-sheet.png>" `
  --image "<real-smile-teeth-front.jpg>" `
  --image "<real-smile-teeth-side.jpg>" `
  --aspect_ratio 9:16 `
  --duration 5 `
  --mode 4k `
  --sound off `
  --json
```

## QA obligatorio antes de aprobar

- Cara parece Sergio real, no un modelo generico.
- Piel sin filtro plastico.
- Pelo side part estable.
- Dientes comparados contra referencias reales, no contra el avatar generado.
- Boca no deforma labios/dientes.
- Cuello y hombros naturales.
- Sin audio/voz clonada salvo aprobacion explicita.
- No publicar ni entregar hasta aprobacion manual.

## Decision actual

Usar desde ahora:

1. Soul ID `aeaa74af-5243-4dc0-8101-09b25e98a7d7`
2. Shooting `nano-banana-face-teeth-lock.png`
3. Kling 3.0 `kling3_0` en `mode 4k` o `pro`
4. `sound off` hasta aprobacion de voz
5. Subtitulos en postproduccion

