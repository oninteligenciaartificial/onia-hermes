# Skill: flujo-completo-carrusel

## Objetivo
Guiar a Hermes para convertir una idea en un carrusel publicado en Instagram.

## Comandos de usuario
- `Genera carrusel ONIA: <tema> | <objetivo> | <audiencia>`
- `Publica IG Carrusel: <urls_imagenes> | <caption>`
- `Haz carrusel completo: <tema> | <objetivo> | <audiencia>`

## Flujo
1. Si el usuario entrega referencias, convertirlas a notas de estilo con `referencias-pinterest`.
2. Crear el brief JSON en `hermes-content/carousels/briefs/` siguiendo la skill `carruseles-onia` (reglas de diseno, packs y estructura narrativa).
3. Presentar slides, caption y CTA a Sergio Urcullo con captura de cada lamina.
4. Renderizar con `node scripts/carousel_render.js` (PNG 1080x1350).
5. Verificar que cada imagen final es `image/png` o `image/jpeg`.
6. Con aprobacion `Apruebo publicar <carrusel>` (ver `aprobaciones-onia`), publicar con `node scripts/carousel_publish.js` (sube los PNG al VPS y postea via `ig-publish`).
7. Devolver `published_id` y avisar a Sergio Urcullo por Telegram con el enlace.

## Comandos internos

```bash
node scripts/carousel_render.js
node scripts/carousel_publish.js
```

Nota: `scripts/carousel_generator.py` requiere Python + OPENAI_API_KEY; el brief se
redacta a mano o lo escribe Hermes/Claude (ver carruseles-onia).

## Criterios
- No publicar sin assets publicos reales.
- No usar placeholders.
- No copiar assets de Pinterest.
- Mostrar error exacto si Graph API falla.
- Separar claramente referencia, adaptacion ONIA y resultado final.
