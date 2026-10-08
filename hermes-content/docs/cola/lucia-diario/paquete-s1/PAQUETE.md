# Paquete semana 1 de Lucía — para el OK de Sergio Urcullo (corregido el 8-oct)

> Plan: `../PLAN.md` v4. Sale de material ya pagado: **0 créditos**.
> **Cambio del 8-oct (Sergio Urcullo):** el chiste de 10 s y L02 se **rechazaron**: un clip suelto con tarjetas no es un
> video. Cada video lleva gancho en 3 s, desarrollo con valor y cierre con CTA, de 30 a 60 s, y deja algo aprendido.
> Nada se publica sin el «ok» de Sergio Urcullo. El trato va de usted si se confirma D8.

## Qué hay en la semana 1

| Pieza | Estado |
|---|---|
| **G1** «Recordatorio de cita: 3 datos» (video de 53 s) | **Guion para validar por la madre** (`../guiones/G1-recordatorio-de-cita.md`). Bloqueado por la captura de Pendientes |
| **L01** «Hola, soy Lucía. No existo.» (carrusel de presentación) | Hecho. **No es un video y no enseña nada**: va fijado después de G1, no abre la cuenta. Decide Sergio Urcullo |
| ~~L02~~ y ~~el chiste de 10 s~~ | Retirados. Sus clips (calle y café) quedan de plano de apoyo |

## Perfil (una vez, desde el celular de Lucía)

| Campo | Texto |
|---|---|
| Nombre | `Lucía Antelo · IA de Onia` (25 caracteres) |
| Bio | `Personaje IA creado por @oniahq` / `Le muestro cómo se trabaja en una clínica con Onia.` / `Escríbale a Onia por WhatsApp 👇` |
| Link | la puerta de D7. Si es (a): `https://wa.me/59175414930?text=Hola%2C%20vengo%20de%20Luc%C3%ADa.%20Quiero%20ver%20Onia%20en%20mi%20cl%C3%ADnica.` |
| Etiqueta de perfil IA | encendida. Según el repo se activó el 31-ago; la madre lo confirma mirando |

## L01 · «Hola, soy Lucía. No existo.» (carrusel, fijado)

- **Láminas:** `hermes-content/carousels/out/lucia-l01-hola-no-existo-foto/slide-01..05.png`. Hoja: `l01-hoja.jpg`.
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
- **Veredicto con el criterio del 8-oct:** tiene gancho (la portada), desarrollo (quién es y qué no hace) y CTA, pero no
  deja nada aprendido. Por eso no abre la cuenta: la abre G1.

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
