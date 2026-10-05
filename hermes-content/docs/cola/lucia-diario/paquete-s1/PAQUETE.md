# Paquete semana 1 de Lucía — para el OK de Sergio Urcullo (5-oct-2026)

> Plan: `../PLAN.md` v4 §5. Sale de material ya pagado: **0 créditos**.
> Nada se publica sin el «ok» de Sergio Urcullo sobre este paquete.

## Perfil (una vez, desde el celular de Lucía)

| Campo | Texto |
|---|---|
| Nombre | `Lucía Antelo · IA de Onia` (25 caracteres) |
| Bio | `Personaje IA creado por @oniahq` / `Te muestro cómo trabaja una clínica de Santa Cruz con Onia.` / `Escribinos por WhatsApp 👇` |
| Link | `https://wa.me/59175414930?text=Hola%2C%20vengo%20de%20Luc%C3%ADa.%20Quiero%20ver%20Onia%20en%20mi%20cl%C3%ADnica.` |
| Etiqueta de perfil IA | encendida. Según el repo, se activó el 31-ago; la madre lo confirma mirando |

## Día 1 · L01 «Hola, soy Lucía. No existo.» (carrusel, fijado)

- **Láminas:** `hermes-content/carousels/out/lucia-l01-hola-no-existo-foto/slide-01..05.png`. Hoja: `l01-hoja.jpg`
  (mirada el 5-oct).
- **Pie** (del brief, sin cambios): *«Lucía es un personaje hecho con IA por @oniahq. Te lo digo en la primera línea
  porque es justamente el punto. No tengo consultorio, ni clientes, ni horario. Tengo una tarea: mostrarte, una vez por
  semana, una cosa real que un negocio chico de Santa Cruz puede dejar de hacer a mano. Solo cosas que ya funcionan y que
  podés ver andando. Si tenés un negocio, seguime.»* `#santacruz #bolivia #negocios #pymes #inteligenciaartificial`
- **Estado:** ✅ aprobado el 1-oct.

## Día 3 · L02 «Este video no fue grabado» (reel de 6 s, sin voz)

- **Archivo:** `hermes-content/references/modelos/lucia/v4/feed/l02-este-video-no-fue-grabado.mp4` (1080×1920, 24 fps).
  Tira: `l02-tira.jpg` (mirada el 5-oct). Tabla de cortes: `videos/lucia-l02/README.md`.
- **Pie:** *«Lucía es un personaje hecho con IA por @oniahq. No existo, pero lo que te muestro sí funciona. Seguime.»*
  - Se recortó del pie del 1-oct la frase «sistemas que trabajan solos para tu negocio»: es una promesa general que la
    pieza no muestra.
- **Estado:** falta el OK.

## Día 5 · Chiste de 10 s (a editar después del OK, 0 cr)

- **Clip:** el del café, ya pagado (`v4/feed/l08-cafe-src.mp4`, 10 s, sin voz).
- **Tarjetas:** «¿Lucía es real?» → «No: soy IA.» → «Lo que te muestro, sí funciona.»
- **Pie:** *«Lucía es un personaje hecho con IA por @oniahq. Esta semana te muestro cómo un paciente reserva solo, sin
  llamar. Escribinos: link en la bio.»*
  - El pie anuncia lo que viene el día 8. Si la pantalla de reserva no está grabada para entonces, se cambia el pie.

## Cómo sale cada una (lo corre la madre en el VPS)

1. **Ensayo, que no publica:**
   `node /root/bin/ig-carrusel.mjs --cuenta lucia --dir /root/publicar/lucia-l01 --caption /root/publicar/lucia-l01/caption.txt`
   o `ig-reel.mjs --cuenta lucia --video … --caption …`. Tiene que decir FINISHED y «etiqueta IA».
2. **Se agenda a las 19:00 de La Paz** (23:00 UTC) con `agendar-publicacion.sh` y `--publicar`.
3. **Se mira la pieza publicada:** que tenga «Información de IA» y que el link de la bio abra el WhatsApp con el texto.

**Requisito previo:** `ig-lucia.env` en el VPS, con el token de Lucía que vive en Postiz (vence entre el 13 y el 18-oct,
según un dato del 4-sep) y los dos publicadores nuevos copiados a `/root/bin`.
