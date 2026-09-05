# Recetas de formato — qué está funcionando, en concreto

**Qué vive acá:** recetas ejecutables de carrusel, gancho y formato, sacadas de piezas públicas
reales. **Las escribe el carril `tendencias`; las ejecutan los carriles de contenido y ads.**

**Qué NO vive acá:** informes de tendencias. "El video corto crece" o "usá ganchos fuertes" no se
puede ejecutar y no se guarda. Si no se puede nombrar y linkear la pieza concreta que se miró,
no se escribe.

## El contrato — una receta no se guarda sin las cuatro

1. **Qué formato es** y para qué carril sirve.
2. **La estructura**, lámina por lámina o segundo por segundo. Copiable sin interpretar.
3. **`Fuente:`** — la URL pública, más **qué se miró exactamente** ahí y **qué no se pudo ver**.
   Sin esta línea la receta no se guarda: se borra o se le busca la fuente.
4. **Por qué se cree que funciona**, separando *lo que dice la fuente* de *lo que infiere quien
   escribe*.

Nombre de archivo **sin fecha** — la fecha es historia, no fuente de verdad.

⚠️ **Números que no se ven, no se escriben.** "Este formato retiene 3× más" es inventado salvo
que la fuente lo muestre. Sin métrica: se describe la estructura y se dice que no se mide el
resultado. Sirve igual y es honesto.

⚠️ **Sólo fuentes públicas.** Nada de loguearse a ninguna red — la cuenta que scrapea logueada
es la que se banea, y es la que usamos para vender.

## Lo que hay

| Receta | Formato | Fuente |
|---|---|---|
| [`carrusel-indice-en-portada.md`](carrusel-indice-en-portada.md) | Carrusel IG 4:5 | @josecarlosttb, post `Db6VZKVlNp9` |
| [`gancho-ad-nombrar-la-herramienta-vieja.md`](gancho-ad-nombrar-la-herramienta-vieja.md) | Texto de ad Meta, del **producto** | Biblioteca de Anuncios de Meta — 30 anuncios activos del rubro |
| [`video-ad-primeros-3-segundos.md`](video-ad-primeros-3-segundos.md) | Video 9:16 del **producto** — arranque | Biblioteca de Anuncios de Meta — 6 videos activos, medidos con `ffmpeg` |

Las dos de ad se usan **juntas**: la de gancho dice *qué se dice*, la de video dice *cómo se ve
mientras se dice*.

## La fuente que sí se puede leer sin cuenta

**La Biblioteca de Anuncios de Meta es pública y se lee entera desde el VPS** (verificado el
2026-09-03). Es la única fuente encontrada hasta hoy que muestra piezas del rubro que alguien
**está pagando ahora mismo**, con anunciante, texto completo, fecha de alta y estado activo.
Comando exacto y URLs: dentro de la receta de gancho.

Lo que **no** trae: impresiones, clics, CTR ni gasto (Meta sólo los publica para anuncios
políticos). Por eso ninguna receta de acá lleva números de rendimiento.

**El video de la Biblioteca se puede bajar y medir.** Los `.mp4` salen del mismo DOM y se miden
con `ffprobe`/`ffmpeg` (duración, resolución, tiempo exacto de cada corte) y con fotogramas
extraídos y **mirados**. Comandos exactos y la trampa del `-v error`: dentro de la receta de video.

## Huecos abiertos

- **Nadie miró el CIERRE de un video.** La receta de video cubre sólo los primeros 3,6 s
  fotograma por fotograma, así que **no hay receta de CTA**: qué se pide, cómo se muestra y en
  qué segundo. Es el hueco más grande y el más barato de cerrar — los 6 videos ya están medidos.
- **No hay ninguna receta de pieza ORGÁNICA en video** (un reel que no sea un ad pago). La vía
  oficial —Graph API por hashtag— está **bloqueada**: el token de Meta del VPS venció el
  2026-08-17 y renovarlo pide un login de Sergio (tablero `t_ad2df41f`, `needs_input`).
- **Ninguna receta tiene métricas de resultado**, y con las fuentes públicas de hoy no las va
  a tener. Lo más cercano que existe es *cuánto tiempo lleva un anuncio pagándose*.
- **Dos veces ya, la variante más fuerte del rubro fue una que Onia no puede usar** (testimonio
  con nombre y empresa; muro de logos de clientes). Sin clientes pagando, ese carril de creativo
  queda cerrado — es lo que desbloquea el primer cliente.

## ⚠️ El chequeo de fuentes vivas estaba roto

El comando que audita que las `Fuente:` sigan abriendo exigía la URL **pegada** a `Fuente:`:

```sh
grep -rhoE "Fuente: *https?://[^ )]+" *.md      # ← devuelve 0 URLs, y se lee como "todo bien"
```

`carrusel-indice-en-portada.md` escribe `` ## `Fuente:` https://… `` (con comillas invertidas), así
que **no matcheaba ninguna** y el chequeo salía vacío = verde. Falla **abierto**. El que sirve:

```sh
grep -rhoE 'https?://[^ )`"]+' *.md | sort -u   # todas las URLs, sin importar cómo se escribió la etiqueta
```

**Y el resultado no se juzga con `curl` a secas.** Corrido el 2026-09-04, `curl` devolvió **403**
en las tres URLs de la Biblioteca de Anuncios — *las mismas que chromium headless había leído
enteras diez minutos antes, en esta misma vuelta*. Facebook bloquea al cliente sin huella de
navegador; **no es una fuente muerta**. Si una `Fuente:` de `facebook.com` da 403, se re-chequea
con el chromium de Playwright antes de tocarla. Borrar una fuente viva por un 403 de `curl` es
exactamente el error que este chequeo tiene que evitar, no cometer.

El comando de arriba también levanta basura de los bloques de código (`https://[^`, `https://…`):
son ejemplos escritos, no fuentes. Se descartan a ojo; todavía no hay filtro.
