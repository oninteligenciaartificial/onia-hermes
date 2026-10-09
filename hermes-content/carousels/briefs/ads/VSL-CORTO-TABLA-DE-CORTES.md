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

## Prueba de uso · `aprender-de-todo` (9-oct)

Por pedido de la madre, aplicado a **esta** tarea de oferta (cola de Ventas y pauta, tarea 2). Las fichas y `aprender-de-todo` viven en la rama de la madre
(commit `ca1fde0a`), **no en `main`**: las leí con `git show`, no mezclé su rama. La fila de uso de las fichas **no la puedo escribir desde acá**: queda para
pegar este bloque cuando entren a `main`.

- **Sesión y fecha:** `session_0143C5fMXVs8eWEf7uBpC9SF` (Ventas y pauta), 9-oct-2026.
- **Regla 1 · Ramiro Cubría** (`video-intake/2026-10-04-reels-para-lucia.md` §4; destino `onia-ventas-pauta`, «Aprendizajes incorporados 9-oct»): auditar con los cuatro
  ángulos. Resultado sobre el corto:

| Ángulo | Dónde está en el corto | Estado |
|---|---|---|
| Problema | 0-8 s: el paciente de las 10:00 sin confirmar, el sillón vacío, el saldo (dolor del dueño dicho en los primeros 3 s, sin insultos) | ✅ se graba ya |
| Solución | 8-30 s: agenda y Pendientes | ⬜ espera las capturas C1/C2 y las filas de la tabla |
| Producto como «casos de éxito» | **Vacío a propósito.** Hay 0 clientes pagando: sin testimonio, sin cifra, sin logo | ✅ el corto no inventa ninguno; se dice así |
| Mentalidad / objeciones | «Usted lo lee y lo aprueba. Si no lo aprueba, no sale» (miedo a perder el control) y «Si no le sirve, no paga nada» (miedo a pagar por nada) | ✅ |
| Descubrimiento | 50-57 s: WhatsApp y 20 minutos | 🟡 la web dice 30 min (L-04); lo decide Sergio Urcullo |

- **Regla 2 · Marco Machado** (`2026-10-08-orquestacion-e-ingresos-5-posts.md` §2): no prometer una respuesta que no está probada. El corto **no dice en cuánto se contesta**
  (la fila 6 del go/no-go, «quién contesta y en cuánto», sigue ❌) y lo que dice la voz sale de las filas del catálogo. Diagnóstico → plan → llamada: el corto lleva
  a la llamada de 20 minutos, no a un cuestionario que no existe.
- **Revisión de claims y de «usted»:** el detector de promesas del repo (`promesa-que-el-producto-cumple.mjs`, el que usa `venta-honestidad`) sobre las 7 líneas de voz:
  **0 hallazgos**; control con «La IA escribe los mensajes y sale por tu WhatsApp con un toque»: **2** (anda en las dos direcciones). **0 voseo o tuteo** en la voz. **Límite:**
  el detector mira formas, no que el producto cumpla: «cada mañana le deja anotado…» sigue dependiendo de G-04 ⬜ y de las filas de la tabla.
- **Estado:** *aplicado*, **sin revisor independiente**. No pasa a «aplicado y verificado» hasta que otra sesión (la madre o un verificador) lo revise contra la ficha.

## Para grabar las capturas: `grabar-captura.mjs` (nuevo, 9-oct)

El guion del VSL decía «el script de grabación no existe todavía». Ya existe: `.claude/skills/onia-ventas-pauta/scripts/grabar-captura.mjs`
(plan en JSON → `.mp4` con cursor grande y anillos + fotos). Probado contra una página de prueba local; **no probado contra la app real**.

- Planes listos como esqueleto: `…/scripts/grabar-captura.vsl-dental-C1-C7.plan.json` (sin clics, no envía nada) y `…-C2-clic.plan.json` (el clic en «Aprobar»).
  **Los selectores son los textos de las capturas viejas: se ajustan mirando la cuenta demo.**
- **Frenos (revisados por un subagente independiente el 9-oct, que encontró seis saltos reales; arreglados y vueltos a probar):** **todo clic** declara `"envio": true` y corre solo con
  `ONIA_GRABAR_PERMITE_ENVIO=1`, que se pone **después** de verificar G-01 (a quién le llega «Aprobar»); el selector tiene que dar exactamente un elemento; solo entra con un correo de
  cuenta de prueba (`qa`, `demo`, `prueba` o `test` como palabra); solo navega a rutas del sitio (sin `//host`, `@` ni `/api/`); `--base` solo acepta `app.onia.com.bo`, `127.0.0.1` y
  `localhost`. No escribe en formularios.
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
