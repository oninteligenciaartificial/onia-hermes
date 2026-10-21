# Skill: instagram-publicacion

## Objetivo
Publicar contenido en Instagram desde Hermes usando el script `ig-publish` instalado en el VPS.

## Estado
Historia (sin fecha): `ig-publish healthcheck` dio `ok: true` y hubo un carrusel de prueba. Hoy la via verificada de Instagram es Buffer (`hermes-content/deploy/vps-ops/publicar/ig-reel.mjs`, `ig-carrusel.mjs`), que corre Claude. Antes de cualquier comando de abajo: skill aprobaciones-onia (captura + "Apruebo publicar <pieza>").

## Comandos

### Estado IG
Ejecutar:
```bash
ig-publish healthcheck
```
Responder con estado resumido, `IG_BUSINESS_ACCOUNT_ID` y errores accionables si falla.

### Publica IG Reel: <url_video> | <caption>
Ejecutar:
```bash
ig-publish reel_publish --video-url "<url_video>" --caption "<caption>"
```
Validar antes:
- `url_video` debe ser una URL publica accesible por Instagram.
- `caption` no debe estar vacio.

Cuando Sergio diga "descripcion de IG", interpretar como `caption`.

Formato recomendado:

```text
[hook o cambio de creencia]

[problema/contexto]

[mecanismo/oferta]

[CTA unico]

[3-8 hashtags relevantes]
```

Reglas:
- primera linea fuerte;
- un solo CTA;
- no prometer resultados inventados;
- no usar datos privados de clientes;
- no usar urgencia falsa;
- si es Sergio, escribir en primera persona;
- si es ONIA, escribir educativo y orientado a sistema/conversion.

### Publica IG Carrusel: <urls_imagenes> | <caption>
Ejecutar:
```bash
ig-publish carousel_publish --image-urls "<url1,url2,url3>" --caption "<caption>"
```
Validar antes:
- Deben existir entre 2 y 10 URLs publicas.
- Las URLs deben ser directas y devolver `image/png` o `image/jpeg`.
- Usar URLs publicas HTTPS directas.
- No publicar assets copiados de Pinterest o terceros.

## Respuesta esperada
Si publica correctamente, devolver `published_id`.
Si falla, devolver el error exacto de Graph API y una recomendacion breve.
