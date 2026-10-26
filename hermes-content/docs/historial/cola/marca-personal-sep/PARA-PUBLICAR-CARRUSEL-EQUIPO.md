# CARRUSEL "Mi equipo no cobra" — listo para pegar

**Piezas:** `carousels/out/carrusel-equipo-no-cobra/lamina-01..08.png` (8 láminas, 1080×1350).
Hoja para mirarlas juntas antes de subir: `CONTACTO-8-laminas.png` en la misma carpeta.

Es el **carrusel 5** del plan mensual (§2). Serie **"Mi equipo no cobra"** — el molde del
video de 5.407. Objetivo: autoridad + guardable. **No se vende nada: cero precio.**

## Caption (IG · copiar tal cual)

Mi equipo son 6 herramientas. Ninguna cobra sueldo y las 6 se pueden copiar.

Cada lámina tiene el puesto, lo que hace por mí, y **el paso concreto para
arrancar hoy** — no la teoría.

01 La recepcionista · 02 El de operaciones · 03 El constructor
04 El diseñador · 05 El vigilante · 06 El de contenido

Guardalo y hacé el paso 01 hoy: son 10 minutos.

¿Querés el paso a paso completo cada día? Comentá COMUNIDAD y te paso el
enlace para unirte.

## Versión X / LinkedIn (mismo contenido, sin carrusel)

Tengo 16 años, una empresa en Bolivia y mi equipo son 6 herramientas.

La recepcionista contesta y hace seguimiento sola. El de operaciones dispara
los seguimientos cada hora. El constructor arma el sistema. El diseñador saca
los artes por terminal. El vigilante revisa el servidor cada 10 minutos y me
avisa al teléfono. El de contenido escribe lo de mañana mientras duermo.

Ninguna cobra sueldo. Las 6 se pueden copiar.

## De dónde sale cada cosa que afirma (para revisar antes de publicar)

| Lámina | Afirmación | Fuente |
|---|---|---|
| 02 | contesta, califica y hace seguimiento sola | `ONIA_CATALOGO_DE_VENTA.md`, fila "Chatbot con IA (web + WhatsApp)", estado vivo — **sin precio**, el catálogo no le pone precio de lista |
| 03 | seguimientos **cada hora** | `crontab -l` del VPS: `17 * * * * followup-run.sh` — contado en vivo esta corrida |
| 05 | cada imagen **0,12 créditos** | `higgsfield generate cost text2image_soul_v2` corrido esta corrida (consulta gratis, no se generó nada) |
| 06 | revisa **cada 10 minutos** | `crontab -l`: `*/10 * * * * claude-guardia.sh` — contado en vivo |
| 07 | el servidor escribe **4 veces al día** | `crontab -l`: `56 9,13,17,21 onia-loop.sh marca-personal` — contado en vivo |

⚠️ **Lo que NO dice y por qué.** El plan mensual titulaba este carrusel *"16 años, 0
empleados…"*. **"0 empleados" no se escribió**: no hay fuente para esa cifra en el carril
y es una afirmación sobre la empresa que el loop no puede verificar. Se usó el nombre de
la serie ya validada, que habla de las herramientas y no de una nómina. Mismo criterio que
con los "30 segundos" que se le quitaron al carrusel 4.

Si Sergio confirma que hoy no hay empleados, el remate de la portada puede volver a
"16 AÑOS · 0 EMPLEADOS" cambiando una línea en `scripts/marca-personal/generar-carrusel-equipo.py`.
