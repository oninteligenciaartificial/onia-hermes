# Skill: flujo-completo-carrusel

## Objetivo
Guiar a Hermes para convertir una idea en un carrusel publicado en Instagram.

## Comandos de usuario
- `Genera carrusel ONIA: <tema> | <objetivo> | <audiencia>`
- `Publica IG Carrusel: <urls_imagenes> | <caption>`
- `Haz carrusel completo: <tema> | <objetivo> | <audiencia>`

## Flujo
1. Si el usuario entrega referencias, convertirlas a notas de estilo con `referencias-pinterest`.
2. Crear brief con `carousel-generator`, incluyendo las notas en `--references`.
3. Presentar slides, caption y CTA al usuario.
4. Si ya existen imagenes publicas, publicar con `ig-publish carousel_publish`.
5. Si no existen imagenes, pedir o generar assets originales y subirlos al asset server.
6. Verificar que cada URL devuelve `image/png` o `image/jpeg`.
7. Publicar y devolver `published_id`.

## Comandos internos

```bash
carousel-generator --topic "<tema>" --objective "<objetivo>" --audience "<audiencia>" --slides 6
ig-publish carousel_publish --image-urls "URL_1,URL_2" --caption "<caption>"
```

## Criterios
- No publicar sin assets publicos reales.
- No usar placeholders.
- No copiar assets de Pinterest.
- Mostrar error exacto si Graph API falla.
- Separar claramente referencia, adaptacion ONIA y resultado final.
