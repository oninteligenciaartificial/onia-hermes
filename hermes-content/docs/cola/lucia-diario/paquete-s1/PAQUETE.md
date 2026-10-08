# Paquete semana 1 de Lucía — para el OK de Sergio Urcullo (5-oct-2026, corregido el 8-oct)

> Plan: `../PLAN.md` v4 §5. Sale de material ya pagado: **0 créditos**.
> Nada se publica sin el «ok» de Sergio Urcullo sobre este paquete.
> El trato va **de usted** si se confirma D8. Si queda en vos, valen los textos del 1-oct.

## Perfil (una vez, desde el celular de Lucía)

| Campo | Texto |
|---|---|
| Nombre | `Lucía Antelo · IA de Onia` (25 caracteres) |
| Bio | `Personaje IA creado por @oniahq` / `Le muestro cómo se trabaja en una clínica con Onia.` / `Escríbale a Onia por WhatsApp 👇` |
| Link | la puerta de D7. Si es (a): `https://wa.me/59175414930?text=Hola%2C%20vengo%20de%20Luc%C3%ADa.%20Quiero%20ver%20Onia%20en%20mi%20cl%C3%ADnica.` |
| Etiqueta de perfil IA | encendida. Según el repo se activó el 31-ago; la madre lo confirma mirando |

## Día 1 · L01 «Hola, soy Lucía. No existo.» (carrusel, fijado)

- **Láminas:** `hermes-content/carousels/out/lucia-l01-hola-no-existo-foto/slide-01..05.png`. Hoja: `l01-hoja.jpg`
  (mirada el 5-oct).
- **Con usted** (D8), se re-renderizan a 0 cr las láminas con estos textos (sacados del brief
  `carousels/briefs/lucia/l01-hola-no-existo.json`):
  - lámina 1: «Y te lo digo en la primera lámina» → «Y se lo digo en la primera lámina»;
  - lámina 3: «Mostrarte» → «Mostrarle»; «tu negocio» → «su negocio»; «Nada que no puedas ver andando» → «Nada que no
    pueda ver andando»;
  - lámina 4: «Prometerte» → «Prometerle»;
  - lámina 5: «Seguime» → «Sígame»; «Si tenés un negocio, seguime» → «Si tiene un negocio, sígame»;
  - CTA del brief: «Seguí a @lucia.antelo.oficial» → «Siga a @lucia.antelo.oficial».
- **Pie** (con usted): *«Lucía Antelo es un personaje hecho con IA por @oniahq. Se lo digo en la primera línea porque es
  justamente el punto. No tengo consultorio, ni clientes, ni horario. Tengo una tarea: mostrarle, una vez por semana,
  una cosa real que un negocio chico puede dejar de hacer a mano. Solo cosas que ya funcionan y que puede ver andando. Si
  tiene un negocio, sígame.»* `#santacruz #bolivia #negocios #pymes #inteligenciaartificial`
- **Estado:** el contenido está aprobado desde el 1-oct; falta el trato.

## Día 3 · L02 «Este video no fue grabado» (reel de 6 s, sin voz)

- **Archivo:** `hermes-content/references/modelos/lucia/v4/feed/l02-este-video-no-fue-grabado.mp4` (1080×1920, 24 fps).
  Tira: `l02-tira.jpg` (mirada el 5-oct). Tabla de cortes: `videos/lucia-l02/README.md`.
- **Con usted**, se re-renderiza a 0 cr el sello «SEGUIME.» → «SÍGAME.».
- **Pie:** *«Lucía Antelo es un personaje hecho con IA por @oniahq. No existo; las pantallas que le muestro, sí. Sígame.»*
  Se sacó «sistemas que trabajan solos para tu negocio», una promesa general que la pieza no muestra.
- **Estado:** falta el OK.

## Día 5 · Chiste de 10 s (editado el 8-oct, 0 cr; falta el OK)

- **Archivo:** `hermes-content/references/modelos/lucia/v4/feed/chiste-lucia-antelo-es-real.mp4` (9,6 s, sin voz).
  - Preview: `chiste-preview-360.mp4`. Hoja de QA: `chiste-qa-hoja.jpg`.
  - Proyecto, tabla de cortes y QA: `videos/lucia-chiste/README.md`.
- **Clip:** el del café, ya pagado (`v4/feed/l08-cafe-src.mp4`).
- **Tarjetas:** rótulo «Lucía Antelo · personaje IA de Onia» desde el cuadro 0 → «¿Lucía Antelo es real?» → «No: soy IA.» →
  «Lo que le muestro, sí.» («Las pantallas que le muestro, sí» no entraba en una línea).
- **Pie:** *«Lucía Antelo es un personaje hecho con IA por @oniahq. Lo que le muestro de Onia son pantallas reales.»*
  - No vende ni anuncia otra pieza.
  - Si para el día 5 ya está grabada la página de reserva, se suma: «La próxima: cómo un paciente reserva solo».

## Cómo sale cada una (lo corre la madre en el VPS)

1. **Antes de la primera:**
   - `ig-lucia.env` con el token de Lucía;
   - `ig-reel.mjs` e `ig-carrusel.mjs` nuevos copiados **juntos** a `/root/bin`, con `--selftest` en los dos.
2. **Ensayo, que no publica:**
   `node /root/bin/ig-carrusel.mjs --cuenta lucia --dir /root/publicar/lucia-l01 --caption /root/publicar/lucia-l01/caption.txt`
   tiene que decir «listo en Instagram … etiqueta IA». Para un reel, `ig-reel.mjs --cuenta lucia --video … --caption …`
   tiene que decir FINISHED.
   - «etiqueta IA» solo confirma que se mandó el parámetro.
3. **Se agenda a las 19:00 de La Paz** (23:00 UTC) con `agendar-publicacion.sh` y `--publicar`.
4. **Se mira la pieza publicada:**
   - `is_ai_generated` tiene que quedar en `true` en `publicado.jsonl`;
   - tiene que verse «Información de IA»;
   - el link de la bio tiene que abrir la puerta.
