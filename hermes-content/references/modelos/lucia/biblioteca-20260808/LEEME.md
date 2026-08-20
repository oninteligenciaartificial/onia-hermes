# Biblioteca de contenido de Lucía — tanda 1 (2026-08-08)

> Pedido de Sergio: *"usando la foto de perfil que quedó perfecta, creá más imágenes… que
> tengamos una biblioteca de distintas imágenes para la página y después crear los videos"*.

## ⚠️ Estado: generadas en Higgsfield, NO descargadas todavía

Las 12 imágenes **existen y están completas** en la cuenta de Higgsfield (se pueden ver en la
galería). **No pudieron bajarse al repo**: el CDN de Higgsfield
(`d8j0ntlcm91z4.cloudfront.net`) devuelve `AccessDenied` de forma persistente para estos
objetos nuevos — 111 bytes de XML en vez del PNG. Se reintentó ~40 veces durante varios
minutos; una sola vez respondió bien (6,6 MB) y después volvió a negar.

**No es un problema de la generación ni del prompt.** Abajo están todos los IDs para
recuperarlas cuando el CDN se normalice, sin volver a gastar créditos.

**Costo ya gastado: ~18 créditos** (12 imágenes × ~1,5 cr con `nano_banana_2` + Element).

## El activo permanente que sí quedó: el ancla nueva

| | |
|---|---|
| **Element** | `lucia-ancla-2026-08` |
| **ID** | `452d8375-fb67-4df7-9ae0-8f1b257aa51f` |
| **Origen** | `references/models/lucia-pieza1-20260717/escena-A-bano-reveal.png` — la selfie de espejo que Sergio aprobó como la mejor calidad lograda |
| **Para qué** | Todo primer plano y toda la biblioteca. Es el reemplazo de generar con el Soul, que en plano cerrado produce cara de IA |

Este Element es lo más valioso de la tanda: **fija la calidad aprobada como punto de partida
de todo lo que se genere de acá en adelante.**

## Las 12 piezas (job IDs para recuperar)

Prefijo de URL: `https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260808_171713_<job_id>.png`

| # | Archivo | Formato | Escena | job_id |
|---|---|---|---|---|
| 01 | cafe-laptop | 4:5 | Café tropical SCZ, trabajando con laptop | `59182dac-0190-4a60-b365-422b63221d56` |
| 02 | calle-scz | 4:5 | Vereda de ladrillo, paredes ocre/turquesa, moto | `be999e8c-5ddc-4030-9a20-2e533a7fb9fe` |
| 03 | mercado | 4:5 | Mercado boliviano, toldos, cajas de papaya | `f98de84f-1952-4d92-9a64-45d989e9095a` |
| 04 | coworking | 4:5 | Coworking con plantas, explicando algo | `d3fbe939-6ffb-4dd4-bad5-c367c4da4cf7` |
| 05 | casa-mate | 4:5 | Sillón, taza en las manos, mañana | `c28a6b4c-a8da-4637-b085-7434852675a9` |
| 06 | espejo-bano | 9:16 | Selfie de espejo, baño luminoso | `ba1a3e85-49ea-4dee-8d30-c63629ca97eb` |
| 07 | auto-habla | 9:16 | Hablando a cámara en el auto | `b1d86147-ce0b-40b7-89c8-791311174c65` |
| 08 | cocina-risa | 4:5 | Cocina soleada, riendo, haciendo café | `3c254533-4103-4372-9f02-f7988c77be79` |
| 09 | escritorio-cenital | 1:1 | Cenital de escritorio con sus manos (base de carrusel) | `124dd393-f2c5-4659-a7b4-a0db56e610fd` |
| 10 | pared-copyspace | 9:16 | Pared lisa con el tercio superior vacío para texto | `43e9ea42-1885-4636-975c-78122c157e0a` |
| 11 | restaurante-noche | 4:5 | Restaurante cálido de noche | `85191b68-0a94-40df-8db5-63328e52a841` |
| 12 | gym-espejo | 9:16 | Selfie de espejo en el gym | `31e3faa3-0524-4012-9ac6-5a6f60ef3582` |

**Cobertura:** los 5 lugares definidos de Lucía (baño, casa, café, calle, bar/restaurante) +
mercado, coworking, cocina y gym · sus 4 outfits (cleangirl, streetwear, loungewear, gym) ·
los 3 formatos (4:5 feed, 9:16 reel/story, 1:1 carrusel) · y dos piezas de utilidad (copyspace
para texto, cenital para carrusel).

## Tanda 2 (2026-08-11) — también bloqueada

4 imágenes generadas con el Element buscando el registro de **foto de celular real** (foco
imperfecto, grano, luz disponible, encuadre descentrado) para los slides del carrusel que
todavía se veían IA. Mismo problema de CDN: `AccessDenied` sostenido durante ~4 minutos de
reintentos.

Prefijo: `https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260811_030750_<job_id>.png`

| Archivo | Escena | job_id |
|---|---|---|
| 15-piso-casa | Sentada en el piso contra la pared, luz de ventana | `8e9755fb-08fd-4d67-ac12-4b50e35e1993` |
| 16-mostrador-tienda | Detrás del mostrador de una tienda en SCZ, hablando con alguien | `6876dd73-af83-430d-aeaa-644d05a8155b` |
| 17-calle-noche | Calle al anochecer, girando hacia la cámara, con ruido y movimiento | `364d43a1-7fb3-4118-b15c-321235de65ac` |
| 18-cafe-risa | Riendo fuerte en un café, luz quemada en un borde | `beb2da82-464c-4aa5-a2ec-f50cb34b5871` |

> ⚠️ **REGLA NUEVA: no generar más hasta que el CDN se destrabe.** Van **16 imágenes pagadas
> (~24 cr) que no se pueden bajar.** Cada tanda nueva es plata gastada en archivos
> irrecuperables desde acá. La vía que sí funciona: **descargarlas a mano desde la galería de
> Higgsfield** y dejarlas en la carpeta.

## Cómo recuperarlas

```bash
curl -o 01-cafe-laptop.png "https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260808_171713_59182dac-0190-4a60-b365-422b63221d56.png"
```

Verificar que el archivo empiece con la firma `89504e47` (PNG). Si pesa 111 bytes, el CDN
sigue negando y hay que reintentar más tarde.

También se pueden ver y descargar desde la galería de Higgsfield, filtrando por la fecha.

## Siguiente paso: video

Con la biblioteca lista, las piezas 06, 07 y 12 (vertical, cara grande, gesto natural) son las
mejores candidatas para animar. Modelos y costos en
`hermes-content/docs/HIGGSFIELD_FULL_CAPABILITIES_MAP.md`. **El video se cotiza con `get_cost`
y necesita OK de Sergio por lote** — las imágenes ya están validadas como triviales, el video no.

---

Relacionado: `hermes-content/docs/ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md` (los 4 pilares y
el molde de cada pieza) · `references/models/AVATAR-CONSISTENCY-SCHEME.md` (la QA obligatoria).
