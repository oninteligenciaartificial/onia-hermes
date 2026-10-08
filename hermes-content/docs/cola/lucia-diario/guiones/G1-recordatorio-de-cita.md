# G1 · «Recordatorio de cita: 3 datos» — guion para validar (8-oct-2026)

> **Estado: PARA VALIDAR por la madre. No se edita hasta su OK.**
> Pedido de Sergio Urcullo (8-oct, por la madre): *«no tiene el contenido estructurado, es literal un video de 10
> segundos. Tienen que ser videos estructurados.»* Cada video de Lucía lleva gancho en los primeros 3 s, desarrollo con
> contenido de valor y cierre con CTA, dura de 30 a 60 s y deja algo aprendido.
> **Costo: 0 cr.** Todo el material de Lucía ya está pagado. Plan: `../PLAN.md` v4.

## Qué aprende quien lo ve

**Un recordatorio de cita tiene que llevar tres datos: el nombre, el día y la hora exactos, y una sola pregunta.** Y que
Onia le deja ese mensaje listo cada mañana para que usted lo apruebe.

## Molde

`hermes-content/references/marca-personal/FORMULAS-REFERENTES.md`:
- **F7**, receta en N pasos: se promete el número y se muestran todos. Ingeniero Binario prometía 7 y mostraba 5: no se
  infla.
- **F4**, «así no / así sí»: el mensaje crece frente al espectador, como el documento de Ian (PRD).
- **Regla común:** la unidad de enseñanza se entrega completa **antes** del CTA.

## Estructura (53 s, 24 fps)

| t (s) | Bloque | Imagen | Texto en pantalla (de usted; ≤ 6 palabras) | Qué se aprende / de dónde sale |
|---|---|---|---|---|
| 0 – 3 | **GANCHO** | Clip K1 (Lucía mira el celular, levanta la vista y sonríe). Rótulo «Lucía Antelo · personaje IA de Onia» de 0 a 2,4 s | «Recordatorio de cita: 3 datos.» | La promesa con número, en los primeros 3 s |
| 3 – 6 | Gancho | Sigue el clip K1 | «¿Cuántos tiene el suyo?» | Pregunta al dueño |
| 6 – 9 | **DESARROLLO · el caso** | Lucía arriba (foto K4·5), panel de ejemplo abajo. Rótulo **EJEMPLO** | «Partamos de este mensaje.» · ejemplo: *«Hola, le recordamos que tiene una cita.»* | El punto de partida, con un mensaje genérico |
| 9 – 17 | Dato 1 | Lucía: foto K4·3. El ejemplo se completa con el nombre, en acento | «1 · Su nombre.» → «Así sabe que es para él.» · ejemplo: *«Sra. Ríos, le recordamos que tiene una cita.»* | Dato 1 |
| 17 – 26 | Dato 2 | Lucía: foto K4·1. El ejemplo suma el día y la hora, en acento | «2 · Día y hora exactos.» → «No tiene que buscarlo.» · ejemplo: *«Sra. Ríos, su cita es el martes 14, a las 15:30.»* | Dato 2 |
| 26 – 35 | Dato 3 | Lucía: foto K4·5. El ejemplo cierra con la pregunta, en acento | «3 · Una sola pregunta.» → «Así puede contestar.» · ejemplo: *«… ¿Confirma que asistirá?»* | Dato 3 |
| 35 – 47 | **DESARROLLO · la demostración** | **Pantalla REAL de Onia: Pendientes**, en tarjeta de 0,78 del ancho sobre la foto K4·5. Crédito «pantalla real de Onia» | «Cada mañana, Onia revisa su agenda.» → «Le anota a quién escribirle,» → «con el mensaje listo.» → «Nada sale sin su aprobación.» | Catálogo §8, frase 3 |
| 47 – 53 | **CIERRE** | Clip K2 (Lucía deja el café y mira a cámara) | «Nombre, día y una pregunta.» (la regla en una placa) → «Escríbale a Onia desde la bio.» | Un solo CTA |

- **Tiempos de las tarjetas** (todas pasan 0,35 s por palabra + 0,3 s; se verificaron con un script):
  0,1–3 · 3–6 · 6–9 · 9–13 · 13–17 · 17–21,5 · 21,5–26 · 26–30,5 · 30,5–35 · 35–38,5 · 38,5–41,5 · 41,5–44 · 44–47 ·
  47,1–50,2 · 50,2–53.
- **Clips ya pagados:** K1 `e470ef4f` y K2 `83130c4a` (Kling, 6 s). **Fotos ya pagadas:** K4·1 `eddca486` (recorte),
  K4·3 `186c82f0` y K4·5 `342c0ab5`. **No se usa K4·4**: tiene un folleto con letra en el borde.
- **Ritmo:** cambia la foto de Lucía en cada dato, cada ~9 s. En la demostración, el foco de la pantalla cambia cada
  1,5-3 s (nombre → hora → mensaje).
- **Sin voz** (D4), sin música: la pone Sergio Urcullo.

## Lo que falta para editar

**La captura REAL de Pendientes** (P2 de `v4/kit/estado-montaje.json`). Sin ella el video queda PREPARADO/BLOQUEADO.
- **Qué mostrar:** la cuenta «Clínica Demo Onia», con una fila de **cita de mañana sin confirmar**, su nombre, la hora y
  el mensaje listo. Datos ficticios. Con fecha y versión como evidencia.
- **Qué NO mostrar:** ninguna fila de «tratamiento a medias» ni la pestaña «A medias» (la demo trae 2 sembradas y el
  catálogo §8 lo prohíbe). No se aprueba ni se envía nada.
- **Quién y cuándo:** la madre o Plataforma. Antes, Sergio Urcullo tiene que confirmar el correo de la demo y darle
  `module.agents`.
- **Si Pendientes sale vacío:** no se inventa. La demostración pasa al correo de recordatorio (captura CORREO: pide un
  paciente con correo propio, una escritura en producción con su OK) o el video espera.

## Pie

*«Lucía Antelo es un personaje hecho con IA por @oniahq. Un recordatorio de cita necesita tres datos: el nombre del
paciente, el día y la hora exactos, y una sola pregunta. Cada mañana Onia le deja anotado a quién escribirle, con el
mensaje listo, y nada sale sin su aprobación. Desde el plan Crece y en la prueba de 14 días. Escríbale a Onia desde el
enlace de la bio.»* `#odontología #santacruz #clínicadental #bolivia`

## Control de reglas

- **IA declarada:** rótulo desde el cuadro 0, con apellido, y el pie. Etiqueta «Información de IA» por API.
- **No la pone en el puesto:** ninguna frase en primera persona sobre la clínica. El ambo es vestuario. No dice que
  estuvo en un lugar real. No da consejo clínico: el consejo es sobre cómo escribir un mensaje.
- **Sin resultados:** ninguna cifra ni «reduce ausencias». Cada «así…» explica el porqué del dato, no promete nada.
- **Solo catálogo:** §8 frase 3 (Crece en adelante y la prueba). No usa la IA, WhatsApp, factura ni tratamiento a
  medias. El mensaje de ejemplo está rotulado EJEMPLO y no parece una pantalla de Onia ni de WhatsApp.
- **Antes de renderizar:** `grep` de este guion y del pie contra la lista de `editor-videos` § «Reels de Lucía».
- **La pantalla se MIRA** antes de usar la frase (condición del catálogo §8).

## Otras dos ideas con la misma estructura (si la madre prefiere otra)

- **G2 · «El link de reserva: 3 cosas»** (demostración: la página pública de reserva, sin reservar). Pide el `slug` de la
  demo.
- **G3 · «Quién escribe hoy: así se ordena la mañana»** (demostración: Pendientes). Mismo bloqueo que G1.
