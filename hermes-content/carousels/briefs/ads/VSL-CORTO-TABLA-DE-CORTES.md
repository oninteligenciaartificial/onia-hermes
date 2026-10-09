# VSL dental · corto de 60 s · tabla de cortes y preview (9-oct)

> Cola de Ventas y pauta, tarea 2. **El video no existe todavía**: faltan las capturas C1-C7 (Plataforma) y las tomas a cámara (Sergio Urcullo).
> Esto es lo que se puede dejar listo ya, y lo que Sergio Urcullo ve **antes** de cortar (regla de oro de `editor-videos`).
> Guion fuente: `hermes-content/sales-kit/06-VSL-DENTAL.md` §3 (está en la rama de la madre, **no en `main`** al 9-oct). Datos: `vsl-corto-tabla.json`.

## Qué mirar

**`hermes-content/carousels/out/ads/vsl-corto-animatic/vsl-corto-preview-360p.mp4`** (60 s, 360×640): una lámina por tramo, con la voz
que va en cada uno, qué falta y qué fila lo destraba. **No es el video**: no tiene cámara ni pantalla. Sirve para decidir el ritmo y ver qué toma
o captura falta. Las láminas están al lado en PNG.

## Tabla de cortes (la que se rehace con el bruto real)

| Tramo | Tipo | Voz | Fuente | Estado hoy |
|---|---|---|---|---|
| 0-3 s | cámara | «Mañana a las diez tiene un paciente que no confirmó.» | T9 | se graba ya |
| 3-8 s | cámara | «Si nadie le escribe, ese sillón queda vacío…» | T12 | se graba ya |
| 8-16 s | pantalla | «Onia junta su agenda, sus fichas y sus cobros…» | C1 `/agenda` + T13 | **espera C1** · A-03, B-01, B-02, C-01, E-01, G-04 ⬜ |
| 16-30 s | pantalla | «Usted lo lee y lo aprueba. Si no lo aprueba, no sale.» | C2 `/pending` + T13 | **espera C2** · G-06, G-01 ⬜ |
| 30-40 s | pantalla | «Y en Cobros ve quién le debe y desde cuándo.» | C5 `/billing` + T13 | **espera C5** · E-03 ⬜ |
| 40-50 s | cámara | «Lo prueba 14 días, sin tarjeta…» | T12 | se graba ya · A-04, A-08 ✅ |
| 50-57 s | cámara | «Escríbame por WhatsApp: en 20 minutos…» | T10 | espera a Sergio Urcullo: la web dice 30 min (L-04 🟡) |
| 57-60 s | cartela | — | HyperFrames | se arma ya |

Tres de los ocho tramos son pantalla: suman **32 de los 60 s** y dependen de la cuenta demo. Sin ella el corto no se publica.

## Para grabar las capturas: `grabar-captura.mjs` (nuevo, 9-oct)

El guion del VSL decía «el script de grabación no existe todavía». Ya existe: `.claude/skills/onia-ventas-pauta/scripts/grabar-captura.mjs`
(plan en JSON → `.mp4` con cursor grande y anillos + fotos). Probado contra una página de prueba local; **no probado contra la app real**.

- Planes listos como esqueleto: `…/scripts/grabar-captura.vsl-dental-C1-C7.plan.json` (sin clics, no envía nada) y `…-C2-clic.plan.json` (el clic en «Aprobar»).
  **Los selectores son los textos de las capturas viejas: se ajustan mirando la cuenta demo.**
- **Frenos:** solo entra con un correo de cuenta de prueba (`qa`, `demo`, `prueba`, `test`); un clic en algo que diga aprobar, enviar, confirmar, pagar,
  cobrar, eliminar, borrar o guardar tiene que declarar `"envio": true` **y** correr con `ONIA_GRABAR_PERMITE_ENVIO=1`, que se pone solo
  **después** de verificar G-01 (a quién le llega «Aprobar»). No escribe en formularios.
- Hace falta `ONIA_QA_EMAIL` y `ONIA_QA_PASSWORD` en el entorno de Ventas: **hoy no están** (bloqueado de Sergio Urcullo, igual que la tarjeta en ONIA Ads).

## Qué falta y de quién

| Falta | De quién |
|---|---|
| Cuenta demo con la misma persona en agenda y Pendientes, y teléfono/correo de prueba propios | Plataforma |
| `ONIA_QA_EMAIL` y `ONIA_QA_PASSWORD` en el entorno de Ventas | Sergio Urcullo |
| Verificar G-01 (qué hace «Aprobar») antes del clic de C2 | Plataforma con la cuenta de prueba |
| Las tomas T9, T10, T12 (y T13 después de las capturas) | Sergio Urcullo |
| Ver este preview y decidir el ritmo; luego, con el bruto, la tabla de cortes real + preview 360p antes de cortar | Sergio Urcullo |
| Publicar: es diseño nuevo (lo ve renderizado) y el «usted» en anuncios lo decide él | Sergio Urcullo |
