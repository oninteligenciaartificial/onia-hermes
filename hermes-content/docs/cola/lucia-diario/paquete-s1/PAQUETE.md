# Paquete semana 1 de Lucía — v5 (8-oct-2026)

> Plan: `../PLAN.md` v5. **Premisa de Sergio Urcullo, 8-oct:** Lucía es una influencer; no muestra el producto; su tarea es
> grabar videos estructurados y aprender Higgsfield. La semana 1 sale de material **ya pagado: 0 créditos**.
> Cada video lleva gancho en 3 s, desarrollo con valor y cierre con CTA, de 30 a 60 s, y deja algo aprendido.
> Publicación (`CLAUDE.md`, 8-oct): una pieza que pasa el QA, se miró completa y no toca el producto ni nombra a terceros
> sale sin el OK pieza por pieza, y después se le avisa a Sergio Urcullo con el enlace.

## Qué hay en la semana 1

| Pieza | Costo | Estado |
|---|---:|---|
| **G1** «Este video no fue grabado: así se hace, en 3 pasos» (56 s) | 0 | **Montado** (`videos/lucia-g1/`, preview 360p en `qa/`); guion en `../guiones/G1-de-una-foto-a-un-video.md`; para la mirada de la madre |
| **G3** «Tres errores de la IA que atrapé antes de publicar» (58 s) | 0 | **Montado** (`videos/lucia-g3/`, preview 360p en `qa/`); guion en `../guiones/G3-tres-errores-de-la-ia.md`; decisiones de la madre en el README del proyecto |
| **G2** «La misma foto, seis clips: ¿quién pierde la cara?» (58 s) | 0 más | **Montado** (`videos/lucia-g2/`, preview 360p en `qa/`); guion en `../guiones/G2-la-misma-foto-seis-clips.md`; los clips ya estaban pagados y medidos |
| **L01** «Hola, soy Lucía. No existo.» (carrusel de presentación) | 0 | **Reescrito a la v5 (9-oct)** y renderizado sin franja blanca; las láminas están en `hermes-content/carousels/out/lucia-l01-hola-no-existo-foto/`. Va fijado después de G1 |
| ~~G-producto-1~~ «Recordatorio de cita: 3 datos» | — | **En pausa** (`../guiones/G-producto-1-recordatorio-de-cita.md`): muestra el producto |
| ~~L02~~ y ~~el chiste de 10 s~~ | — | Retirados el 8-oct. Sus clips (calle y café) quedan de plano de apoyo |

## Perfil (una vez, desde el celular de Lucía)

| Campo | Texto |
|---|---|
| Nombre | `Lucía Antelo · IA de Onia` (25 caracteres) |
| Bio | `Personaje IA creado por @oniahq` / `Pruebas con IA, cada semana.` |
| Link | ninguno. La puerta de demo está en pausa y no hay nada que vender desde esta cuenta |
| Etiqueta de perfil IA | encendida. Según el repo se activó el 31-ago; la madre lo confirma mirando |

## L01 · «Hola, soy Lucía. No existo.» (carrusel de presentación) — reescrito a la v5 el 9-oct

- **Láminas:** `hermes-content/carousels/out/lucia-l01-hola-no-existo-foto/slide-01..05.png` (1080×1350, pack `editorial-photo`,
  cuenta `lucia`). Hoja: `l01-hoja.jpg`. Brief y pie: `hermes-content/carousels/briefs/lucia/l01-hola-no-existo.json`.
- **Qué dice ahora:** 1 «Hola, soy Lucía. No existo.» · 2 «Un personaje hecho con IA» (la crea @oniahq; nada de lo que se ve
  pasó) · 3 «Una prueba con IA por semana» (mide si le conserva la cara; una foto 1 crédito, un clip de 6 s 7,5) ·
  4 «Lo que nunca voy a hacer» (hacerse pasar por persona real, consejos de salud o de plata, testimonios o cifras) ·
  5 «Cada semana, una prueba. Seguime para no perdértela.» Un solo CTA, voseo, sin marcas de terceros, sin producto.
- **Antes (v4):** prometía «una cosa real que un negocio chico puede dejar de hacer a mano» y pedía «Si tenés un negocio,
  seguime». Eso era la premisa de venta y ya no es la de Lucía.
- **Control hecho el 9-oct:** grep de frases prohibidas sobre pie y láminas (limpio), las 5 láminas MIRADAS completas, sin franja
  blanca (ver abajo), cara coherente con las fotos del kit v4/feed.
- **Veredicto con el criterio del 8-oct:** tiene gancho (la portada) y cierre, y deja un dato aprendido (qué cuesta una foto y
  un clip). Va fijado **después** de G1.
- **Render:** `CAROUSEL_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell node scripts/carousel_render.js --brief … --out … --account lucia --pack editorial-photo`.
  ⚠️ Con el Chromium normal en la nube (`--headless=new`) cada lámina sale con una **franja blanca de 88 px abajo** (la ventana
  mide 1350 y el visor 1262): la del 8-oct tenía el defecto. El `headless_shell` mide exacto.

## Cómo sale cada una (lo corre la madre en el VPS)

1. **Antes de la primera:**
   - `ig-lucia.env` con el token de Lucía;
   - `ig-reel.mjs` e `ig-carrusel.mjs` nuevos copiados **juntos** a `/root/bin`, con `--selftest` en los dos.
2. **Ensayo, que no publica:**
   `node /root/bin/ig-reel.mjs --cuenta lucia --video … --caption …` tiene que decir FINISHED. Para un carrusel,
   `ig-carrusel.mjs --cuenta lucia --dir … --caption …` tiene que decir «listo en Instagram … etiqueta IA».
   - «etiqueta IA» solo confirma que se mandó el parámetro.
3. **Se agenda a las 19:00 de La Paz** (23:00 UTC) con `agendar-publicacion.sh` y `--publicar`.
4. **Se mira la pieza publicada:**
   - `is_ai_generated` tiene que quedar en `true` en `publicado.jsonl`;
   - tiene que verse «Información de IA».
