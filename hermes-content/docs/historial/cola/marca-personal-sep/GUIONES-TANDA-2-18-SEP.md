# Guiones para grabar — tanda 2 · 18-sep

> Pedido de Sergio Urcullo: *"dame los nuevos para que grabe"* con el reparto del día:
> 1 carrusel (08:00) · pilar de Samuel 1 · el importante para mí 1 · trials 2 · trials v2 3.
>
> 🔴 **Los 2 "trials" NO se graban: son los RESUBIDOS del feed** (aclarado por Sergio
> Urcullo) — el pilar de Samuel ② y el importante ③ se vuelven a subir a la cuenta trial.
> **Se graban 5 piezas:** ② (Samuel) · ③ (Sergio) · ⑥⑦⑧ (trials v2, Sergio).
> Los guiones ④ y ⑤ quedan como **pool de reserva** para el próximo día.
>
> **No repiten** los 4 ya agendados (skills · CLAUDE.md 3 reglas · cómo funciona por dentro ·
> repo anthropics/skills).
>
> Estructura fija de todo corto: **0-3 s gancho** (sin "hola") · **3-25 s lo concreto con
> pantalla real** · **25-35 s cierre con UN recurso**, alternando comentario ↔ comunidad.
> Se nombra Claude, Claude Code, skill, hook, subagente, MCP — nunca "la IA" genérica.

---

## ① CARRUSEL · 08:00 — «Los 4 escalones para que trabaje sin vos»
*No se graba: se arma. Reusa el deck del YT 03 (mismas 4 láminas, ya diseñadas).*

| Lámina | Texto |
|---|---|
| 1 | **QUE TRABAJE SIN VOS** · 4 funciones de Claude Code que corren solas |
| 2 | **HOOKS** — "cada vez que pase esto, hacé aquello". No lo decide Claude: lo ejecuta tu computadora, siempre |
| 3 | **SUBAGENTES** — le das UNA tarea y la reparte. Trabajan en paralelo y cada uno abre limpio |
| 4 | **CONECTORES** — manos fuera de tu computadora: n8n, Cloudflare, Meta |
| 5 | **HORARIOS** — el único que no te necesita. Cada hora revisa; cada tres entra como cliente |
| 6 | La parte honesta: **lo que corre solo, falla solo**. 4 de mis 6 conectores estaban caídos y ninguno avisó |
| 7 | CTA: comentá **AUTOMATIZAR** y te paso el video completo |

---

## ② PILAR (Samuel) — «Le pagué 200 dólares a una IA y esto hizo en 30 días»

*Pieza fuerte del feed. Samuel a cámara, ritmo alto, b-roll de las pantallas de Sergio.*

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Doscientos dólares al mes. Ese es el sueldo de la persona que más produce en esta empresa. Y no es una persona.» | Samuel a cámara | `$200/MES` |
| 3-12 | «Es Claude Code. En 30 días construyó un sistema de gestión que hoy está en producción, la web entera, y los flujos que corren de noche sin que nadie mire.» | ráfaga: panel, web, n8n corriendo | lista apilándose |
| 12-22 | «Lo que no hace: decidir. No sabe qué vale la pena construir, no sabe a quién venderle, y cuando algo se rompe no avisa. Ejecuta. Decidir sigue siendo del humano.» | Samuel, sin pantalla | `EJECUTA ≠ DECIDE` |
| 22-32 | «Si querés ver la cuenta completa —qué herramienta, cuánto sale, qué reemplaza— está en la guía de la web de Sergio. Link en el perfil.» | `/stack` scrolleando | `sergiourcullo.vercel.app/stack` |

**Cierre:** recurso = `/stack`.

---

## ③ EL IMPORTANTE (Sergio, el serio de IA del feed) — «Mientras dormía, cuatro agentes editaron cuatro videos»

*Lo más fuerte que tenés hoy: pasó de verdad anoche. Enseña qué es un subagente EN USO REAL.*

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Anoche me fui a dormir con cuatro videos sin editar. Amanecí con los cuatro terminados.» | vos a cámara | `4 VIDEOS · 0 HORAS` |
| 3-13 | «No fue un agente haciendo los cuatro en fila. Fueron cuatro subagentes, uno por video, trabajando en paralelo: cada uno cortó silencios, quemó subtítulos, mezcló los efectos y verificó su propio resultado mirando fotogramas.» | las 4 tareas corriendo a la vez | `4 SUBAGENTES EN PARALELO` |
| 13-24 | «Y acá está lo que nadie cuenta: uno encontró que el logo tapaba un texto y movió la ventana solo. Otro encontró nueve tildes mal escritas y las corrigió antes de quemarlas. No pregunté; reportaron.» | el reporte con los ✓ | `SE CORRIGIÓ SOLO` |
| 24-34 | «Un subagente es eso: una tarea, un contexto limpio, y la obligación de verificar lo que entrega. Comentá **SUBAGENTE** y te explico cómo armar el primero.» | — | `COMENTÁ "SUBAGENTE"` |

**Cierre:** comentario.

---

## TRIALS (los 2) — resubidos, sin grabar
- **Trial A** = ② el pilar de Samuel, mismo archivo.
- **Trial B** = ③ el importante de Sergio, mismo archivo.

---

# POOL DE RESERVA (no son del día; ya escritos para cuando hagan falta)

## ④ El error que te va a pasar cuando automatices»

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Mi automatización decía "todo bien" durante tres semanas. No estaba haciendo nada.» | — | `3 SEMANAS EN CERO` |
| 3-15 | «Terminar sin error no prueba que hizo algo. El proceso arrancaba, no encontraba trabajo, y terminaba verde. Nadie se enteró porque nunca falló: simplemente no hacía nada.» | un log todo verde | `VERDE ≠ HECHO` |
| 15-26 | «La regla que uso ahora: que avise cuando falla, no cuando funciona. Y que cuente lo que SALIÓ, no lo que corrió. Un aviso que llega todos los días se vuelve invisible en una semana.» | el aviso nuevo con el número | `CONTÁ LO QUE SALIÓ` |
| 26-34 | «Esa regla vive en mi archivo de reglas. Comentá **REGLAS** y te lo paso.» | — | `COMENTÁ "REGLAS"` |

**Cierre:** comentario.

---

## ⑤ El comando que revisa tu proyecto entero antes de tocarlo»

*Enseña UNA función concreta: los hooks previos.*

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Esto corre solo antes de que Claude escriba una sola línea en mi proyecto.» | terminal con el hook disparando | `ANTES DE ESCRIBIR` |
| 3-14 | «Se llama hook. Es una regla de dos líneas: "antes de escribir un archivo, revisá que no rompa la configuración". No lo decide Claude — lo ejecuta mi computadora, siempre, aunque yo no esté.» | el `settings.json` con el hook | `settings.json` |
| 14-25 | «Los míos: revisar antes de escribir, anotar qué tocó después, y al terminar de trabajar, formatear y subir a GitHub. Tres reglas y dejé de romper cosas por distracción.» | los 3 hooks listados | `3 HOOKS · CERO DISTRACCIÓN` |
| 25-33 | «El archivo con mis hooks está en la comunidad, para copiar y pegar. Link en el perfil.» | — | `EN LA COMUNIDAD` |

**Cierre:** recurso = comunidad.

---

## ⑥ TRIAL v2 (IA) — «La palabra que tu IA no escucha»

*Sergio a cámara, cero edición. Dato técnico real y contraintuitivo.*

> «Grabé un video y el transcriptor me devolvió el texto perfecto. Demasiado perfecto.
> Los "ehh", los "este", las respiraciones — no estaban. Whisper los borra solo, y como no
> están en el texto, el corte automático nunca los saca: quedan en el audio.
> La solución no es leer el texto: es mirar la energía del audio entre palabra y palabra.
> Si hay sonido donde no hay palabra, eso es una muletilla. Ochenta y tres saqué de un
> video de diez minutos. Si automatizás edición, apuntá esto porque nadie lo dice.»

---

## ⑦ TRIAL v2 (negocio) — «Por qué no contrato a nadie todavía»

> «Me preguntan por qué no contrato si tengo todo esto andando. La cuenta: operar mi
> sistema cuesta lo mismo con un cliente que con cuarenta. El margen no es el problema.
> El problema son clientes. Un desarrollador más no me trae uno solo — me triplica el
> gasto para producir más de lo que ya sobra. Construir es lo único que no me falta.
> Cuando el cuello sea soporte, ahí sí. Antes, no.»

---

## ⑧ TRIAL v2 (Bolivia) — «Facturación electrónica: lo que nadie te dijo del plazo»

> «Si tenés NIT en Bolivia, esto te toca. La facturación en línea ya no es opcional y el
> portal gratis del SIN existe y funciona — no hace falta pagar un sistema para empezar.
> Lo que sí te va a pasar: el certificado y el punto de venta se tramitan antes, no el día
> que te obligan. Yo estoy en ese trámite ahora y te voy contando cada paso. Guardá esto
> si tenés negocio formal.»
>
> ⚠️ Verificar el plazo vigente antes de grabar (no decir "obligatorio por ley" sin la
> fuente delante) — ver `siat-pitch-portal-gratis`.

---

## Orden de rodaje sugerido (una sentada, mismo set)
**Se graban 5.** Trials v2 primero (⑥⑦⑧, cero edición, salen en 10 minutos) → el importante
③ (el más largo, con pantalla) → pilar ② lo graba Samuel aparte. El carrusel ① se arma sin
cámara y los 2 trials son resubidos de ② y ③.

**Al grabar:** cámara full-frame como pista aparte si querés clip vertical con pantalla
dividida, y llevá los tres puntos escritos a la vista — los retakes de cierre fueron lo
más caro de la tanda anterior.
