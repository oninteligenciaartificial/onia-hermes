# ONIA Carruseles — Opciones de generación de imágenes/objetos

Qué necesitan los packs visuales (ver `references/style-references-batch-2026-06-16.json`):
fondos, objetos cutout, productos/objetos 3D, halftone, mascota, curvas/formas, mockups UI.
Acá las opciones por tipo, **locales** (gratis, sin API) y **no-locales** (API/MCP, cuestan créditos).

## 1. Formas, curvas, pills, grid, glow, halftone — **LOCAL (recomendado)**
No necesitan IA. Se generan con SVG/CSS en el render engine actual (zero costo, exacto, on-brand):
- Curva verde continua (estilo Solaris), pills/badges outline, callout-cards, grid de fondo, glow → **SVG + CSS** dentro de las plantillas.
- Halftone B/N de una foto → filtro CSS/SVG (`feImage`+dither) o **Sharp** (Node) / **Pillow** (Python) local.
- Recorte de fondo de fotos propias (Sergio/Arthur/producto) → **rembg** (local, modelo u2net, gratis) o `@imgly/background-removal` (Node, local).
**Veredicto:** todo el "sistema visual" (no fotos/objetos realistas) se hace local. Cero dependencia externa.

## 2. Fotos realistas / objetos cutout / producto / escenas — generativo
Cuando hace falta una imagen que no tenemos (objeto simbólico, producto, escena):

### No-local (API/MCP) — calidad alta, texto-en-imagen
| Opción | Fuerte en | Acceso | Costo aprox |
|--------|-----------|--------|-------------|
| **Nano Banana 2 / Gemini 3 Image** | texto-en-imagen nítido, edición, consistencia de marca | API Google / fal.ai | bajo, rápido |
| **fal.ai (FLUX.1, Recraft V3)** | fotorealismo, **Recraft = vector/SVG + estilo de marca consistente** | MCP `fal-ai-media` / API | medio |
| **Ideogram 2** | tipografía dentro de la imagen | API | bajo |
| **Higgsfield (suite creativa)** | imagen/video/3D, ya integrado en Hermes | MCP `db06be76__generate_image / generate_3d / remove_background / outpaint` | créditos workspace |
| **OpenAI gpt-image-1** | edición precisa, ya tenemos OPENAI_API_KEY | API | medio |

> Ya disponibles como MCP en esta sesión: **Higgsfield** (`generate_image`, `generate_3d`,
> `remove_background`, `outpaint_image`, `upscale_image`) y **fal-ai-media**. Recomendado para
> objetos 3D (paneles/dashboard/mascota) y recortes.

### Local (sin API) — gratis, requiere GPU/tiempo
| Opción | Para | Nota |
|--------|------|------|
| **Stable Diffusion / FLUX schnell** (ComfyUI/Automatic1111) | fotos y objetos | corre en VPS/PC con GPU; setup pesado |
| **Blender** (headless, script Python) | objetos/productos 3D exactos (paneles, dashboard, mascota) | determinista, on-brand, sin créditos; curva de aprendizaje |
| **rembg / imgly** | quitar fondo a fotos propias | rápido, local, ya cubre cutouts |

## Recomendación ONIA
1. **Sistema visual (curvas, pills, glow, halftone, grid, mockups UI) → 100% local SVG/CSS.** Es el 70% del look y queda perfecto on-brand.
2. **Fotos propias (Sergio/Arthur/producto) → recorte local (rembg).** Ya tenemos fotos en `tmp-assets/higgsfield/`.
3. **Objetos 3D / mascota / escenas que no tenemos → Higgsfield MCP o fal.ai (Recraft para consistencia).** Generar 1 vez, guardar en `hermes-content/assets/`, reusar (no regenerar por slide → ahorra créditos).
4. **Mockups de dashboard/WhatsApp/n8n → screenshots reales** (prueba > render) estilo Boletinhos.

Mockup de objeto 3D vale generarlo una vez por tema y cachearlo. Texto-en-imagen casi nunca: el texto lo pone el render engine (más nítido y editable).
