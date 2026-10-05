# Lucía sobre el kit de grabación de Sergio Urcullo — 3 guiones adaptados (3-oct-2026)

> Pedido de la madre (3-oct): Lucía trabaja también sobre los guiones que graba Sergio Urcullo.
> - **Fuente:** las piezas de negocio S2 de `docs/cola/plan-3-semanas/S2-GUIONES.md`. `KIT-GRABACION.md` todavía no
>   existía en `main` cuando se escribió esto.
> - **Esto no reemplaza al plan** (`docs/cola/lucia-diario/PLAN.md`): son 3 piezas listas para cuando Sergio Urcullo
>   apruebe el gasto.
> - **NO se generó nada.** Los costos son cotizaciones sin generar (`get_cost`), medidas el 3-oct.

## Por qué no son copias de los guiones de Sergio Urcullo

Las tres piezas S2 hablan de **su bot de WhatsApp** (franja horaria, IA que promete, horarios editables). Lucía no
puede vender eso: `ONIA_CATALOGO_DE_VENTA.md` §5 deja el agente de WhatsApp en ⏸ (*«nunca se promete "la IA agenda
sola"»*), y §7 prohíbe el recordatorio por WhatsApp. Por eso de cada guion se conserva **la idea** y se la lleva a
lo que Onia hace hoy y se puede decir (§2 y §8).

| Guion de Sergio Urcullo | Idea que se conserva | Versión de Lucía |
|---|---|---|
| S2-D08-A «¿La IA le promete a tu cliente algo que no confirmaste?» | La IA no decide sola | **K1 · Humo vs. real:** la IA escribe el modelo y el dueño lo aprueba |
| S2-D10-A «Tu bot no le tiene que escribir a nadie a las seis de la mañana» | La hora en que trabaja el sistema | **K2 · Recepción a las 8:** a las 7 Onia ya revisó la agenda |
| S2-D13-A «Cambiar el horario de tu bot no debería necesitar un programador» | Los datos del negocio sin programador | **K3 · Sin programador:** pegás tu web y Onia carga los datos |

## Reglas de las tres piezas (de `LUCIA.md` §0 y `PLAN.md` §3)

- **Rubro:** dental, que es el primero en el orden de empuje.
- **Formato:** Reel 9:16 de 30–36 s, **sin voz** (D4 sigue pendiente), con tarjetas de texto, sin música de cama, y se
  edita con `editor-videos` § Reels de Lucía.
- **IA declarada:**
  - rótulo «Lucía · personaje IA de Onia» desde el segundo 0;
  - el pie arranca con «Lucía es un personaje hecho con IA por @oniahq»;
  - etiqueta de IA de Instagram.
- **Ambo = vestuario.** Ninguna frase la pone en el puesto: nada de «soy», «mis pacientes» ni «mi consultorio».
- **Sin promesas de resultado:** nada de «agenda llena», porcentajes ni «cero ausencias».
- **Pantalla REAL de Onia** en el centro de cada pieza.
  - ⛔ Las tomas de pantalla son el bloqueo. *Corregido el 5-oct:* la cuenta demo «Clínica Demo Onia» SÍ existe desde
    el 2-oct, pero está a medias: sus pacientes no tienen correo y le falta `module.agents` (`PLAN.md` v4 §5).
  - Antes de publicar se abre cada pantalla con sesión y se MIRA (catálogo §8).
- **Un solo cierre:** «Mandáselo a quien contesta tu WhatsApp» y «Escribinos: link en la bio». *Corregido el 5-oct:*
  `onia.com.bo/llamada` da 404 y Onia ya no tiene Cal.com; la puerta es el WhatsApp de Onia con «vengo de Lucía»
  (`PLAN.md` v4 §2). Donde los pies de abajo dicen «Agendá tu demo: link en la bio», el link de la bio es esa puerta.

**Costos medidos el 3-oct con `get_cost`, sin generar:**

| Qué | Modelo y parámetros | Créditos |
|---|---|---:|
| Foto de Lucía con su cara y la prenda | `seedream_v4_5`, 9:16, con el ancla `abe2e6bd` y el ambo `8d138bd6` como referencias | **1** |
| Clip de 6 s desde una foto aprobada | `kling3_0`, `mode: std`, `sound: "off"`, 6 s, 9:16 | **7,5** |
| ⚠️ El mismo clip con `sound: false` | Higgsfield no acepta `false`, lo pasa a `on` | 10,5 |

---

## K1 · Humo vs. real — «¿Una IA que confirma citas sin preguntarte?»

- **Plano:** recepción de una clínica dental en una torre de Equipetrol: porcelanato claro, mostrador de madera clara
  y mármol, ventanal a una calle arbolada.
- **Vestuario:** ambo terracota (`v4/vestuario/ambo-terracota-frente-8d138bd6.jpg`), argollas y cadenita de oro.
- **Duración:** 34 s.

| # | Tiempo | Imagen | Texto en pantalla | Fuente | Cr |
|---|---|---|---|---|---:|
| 1 | 0–2,5 s | Foto: Lucía detrás del mostrador mirando un celular, con duda; acercamiento lento | «¿Una IA que confirma citas sin preguntarte?» | — | 1 |
| 2 | 2,5–5 s | La misma foto, con golpe de zoom | «Eso es humo.» | — | 0 |
| 3 | 5–20 s | **Pantalla real:** el texto de un recordatorio propuesto con IA y el botón para aprobarlo | «La IA escribe el modelo del mensaje.» → «Vos lo revisás y lo aprobás una vez.» | Catálogo §8, frase 1 | 0 |
| 4 | 20–28 s | **Pantalla real:** Pendientes con el mensaje listo y el nombre y la hora ya puestos | «La IA no ve los datos de tus pacientes. Onia le pone el nombre y la hora.» | §8, frase 2 | 0 |
| 5 | 28–34 s | Clip: Lucía levanta la vista a cámara y sonríe | «Nada sale sin que vos lo apruebes.» → cierre | §8, frase 3 | 7,5 |

**Pie:** Lucía es un personaje hecho con IA por @oniahq. En Onia la IA te propone el texto de cada recordatorio
(cobros, confirmación de citas, pacientes que no vuelven) con el tono de tu negocio. Vos lo revisás y lo aprobás una
sola vez, y la IA nunca ve los datos de tus pacientes. Desde el plan Crece y en la prueba de 14 días. Agendá tu demo:
link en la bio.

**Costo: 8,5 cr.** La foto 1 es además la prueba de ropa (D1). Si la cara no da ≥ 0,70 o el ambo no coincide con el
maniquí, se rehace antes de pagar el clip.

## K2 · Recepción a las 8 — «A las 7, Onia ya revisó tu agenda»

- **Plano:** la misma recepción a las 7:55, con luz de mañana de costado.
- **Vestuario:** ambo terracota.
- **Gancho:** su límite físico (un café que no puede tomar).
- **Duración:** 36 s.

| # | Tiempo | Imagen | Texto en pantalla | Fuente | Cr |
|---|---|---|---|---|---:|
| 1 | 0–3 s | Foto: Lucía apoyada en el mostrador vacío, con un café | «8:00. La recepción empieza a llamar uno por uno.» | — | 1 |
| 2 | 3–6 s | Foto sin Lucía: el mostrador con una agenda de papel y un teléfono | «¿Quién tiene cita hoy? ¿Quién debe?» | — | 1 |
| 3 | 6–22 s | **Pantalla real:** Pendientes del día: quien tiene cita mañana, quien debe y quien hace 6 meses no vuelve, cada uno con su mensaje listo | «A las 7, Onia ya revisó tu agenda y tus cobros.» → «Te deja anotado a quién escribirle, con el mensaje listo.» | §2 (agentes 07:00 La Paz) · §8, frase 3 | 0 |
| 4 | 22–30 s | **Pantalla real:** el correo de recordatorio que recibe el paciente | «El recordatorio por correo sale solo: 24 h y 2 h antes.» | §2 «Trabaja solo» | 0 |
| 5 | 30–36 s | Clip: Lucía mira el café, lo deja y mira a cámara | «No puedo tomarme este café. Tu recepción, sí.» → cierre | Límite físico (manual §2) | 7,5 |

**Pie:** Lucía es un personaje hecho con IA por @oniahq. Todas las mañanas Onia revisa tu agenda y tus cobros y te deja
anotado a quién escribirle, con el mensaje listo; nada sale sin que vos lo apruebes. El recordatorio de cita por correo
sale solo, 24 h y 2 h antes. Desde el plan Crece y en la prueba de 14 días. Agendá tu demo: link en la bio.

**Costo: 9,5 cr.**

⛔ **Lo que se dejó afuera a propósito:** «no escribe de madrugada» o «respeta tu horario». Sergio Urcullo lo dice de
SU bot, y el catálogo no dice que el correo de recordatorio respete una franja. Sin medirlo, no se promete.

## K3 · Sin programador — «¿Cargar tus datos te lleva una tarde?»

- **Plano:** el coworking de Equipetrol. **Es el clip ya pagado de L05** (`07b938b2`, `videos/lucia-l05/raw/`): Lucía
  tipea en la laptop, levanta la vista y sonríe.
- **Vestuario:** el del clip, su ropa de trabajo. **No lleva ambo:** no está en la clínica, muestra cómo se arma la
  cuenta.
- **Duración:** 31 s.

| # | Tiempo | Imagen | Texto en pantalla | Fuente | Cr |
|---|---|---|---|---|---:|
| 1 | 0–3 s | Clip pagado: Lucía tipeando | «¿Cargar los datos de tu clínica te lleva una tarde?» | — | 0 |
| 2 | 3–20 s | **Pantalla real:** se pega el link de la web y Onia completa nombre, teléfono, dirección, horarios y servicios | «Pegá el link de tu web.» → «Onia te carga nombre, teléfono, dirección, horarios y servicios.» | §8, frase 6 | 0 |
| 3 | 20–28 s | **Pantalla real:** los horarios ya cargados en Configuración | «Si cambian, los cambiás vos. Sin programador.» | ⚠️ **Va solo si la pantalla de Configuración lo muestra** (se MIRA con la cuenta demo); si no, la toma se saca | 0 |
| 4 | 28–31 s | El final del clip pagado: levanta la vista y sonríe | cierre | — | 0 |

**Pie:** Lucía es un personaje hecho con IA por @oniahq. Pegá el link de tu página web y Onia te carga nombre, teléfono,
dirección, horarios y servicios. Funciona con tu web propia, no con Facebook. En todos los planes. Agendá tu demo:
link en la bio.

**Costo: 0 cr.**

## K4 · Las reglas de la recepción (opción, formato «reglas → giro → CTA»)

**De dónde sale el formato:** `references/video-intake/2026-10-03-reels-genjutsu-y-fiesta-ia.md` §2, el reel de
@ugc.studio.ia «Nadie en esta fiesta es real» (89 s, 1.741 likes). Un personaje IA se ríe de los defectos de la IA
(«reglas»), viene un giro y cierra con un CTA, con un subtítulo de UNA palabra por toma.

**Qué cambia para Lucía:**
- **El humor sale de que TODOS saben que es IA.** Nada de «no le digas a nadie».
- **El giro** es la pantalla real de Onia: quien trabaja de verdad es el sistema.
- **De la fiesta universitaria no se toma nada:** se toma la estructura y pasa a la recepción.
- **La regla 3 convierte el límite de D1 en chiste:** ella no atiende a nadie; el ambo es vestuario.

**La pieza:**
- **Plano:** la recepción de K1.
- **Vestuario:** ambo terracota.
- **Duración:** 35 s, sin voz (D4). Lleva la palabra de la toma en grande y una línea corta debajo.

| # | Tiempo | Imagen | Palabra · línea | Fuente | Cr |
|---|---|---|---|---|---:|
| 1 | 0–4 s | Foto: Lucía detrás del mostrador, saluda a cámara | **REGLAS** · «Soy IA. Acá todos lo saben. Y hay reglas.» | IA declarada | 1 |
| 2 | 4–8 s | **Clip:** levanta la mano y cuenta los dedos, divertida | **CINCO** · «Regla 1: cinco dedos. Los cuento siempre.» | Defecto típico de la IA, dicho como chiste | 7,5 |
| 3 | 8–11 s | Foto: una taza de café llena junto al teclado; ella la mira | **CAFÉ** · «Regla 2: el café se queda en la taza.» | Límite físico (manual §2) | 1 |
| 4 | 11–15 s | Foto: Lucía de cuerpo entero con el ambo, mostrando la ropa | **NADIE** · «Regla 3: no atiendo a nadie. El ambo es vestuario.» | `LUCIA.md` §0 (D1) | 1 |
| 5 | 15–19 s | Foto: Lucía señala la pantalla del mostrador (acercamiento) | **GIRO** · «¿Querés ver quién trabaja de verdad acá?» | — | 1 |
| 6 | 19–31 s | **Pantalla real:** Pendientes del día, luego el correo de recordatorio | **ONIA** · «A las 7 revisó tu agenda y tus cobros.» → «Nada sale sin que vos lo apruebes.» → «El recordatorio por correo sale solo: 24 h y 2 h antes.» | §2 · §8, frase 3 | 0 |
| 7 | 31–35 s | La foto 1 otra vez, con zoom | cierre: «Mandáselo a quien contesta tu WhatsApp» · «Agendá tu demo» | — | 0 |

**Pie:** Lucía es un personaje hecho con IA por @oniahq: lo sabe ella, lo sabés vos y lo sabe la recepción. Quien
trabaja de verdad es el sistema: todas las mañanas Onia revisa tu agenda y tus cobros y te deja anotado a quién
escribirle, con el mensaje listo, y nada sale sin que vos lo apruebes. El recordatorio de cita por correo sale solo,
24 h y 2 h antes. Desde el plan Crece y en la prueba de 14 días. Agendá tu demo: link en la bio.

**Costo, cotizado con `get_cost` el 3-oct sin generar nada:**
- **Corta: 11,5 cr.** Son 4 fotos de 1 cr y 1 clip de 7,5 cr (solo los dedos, el único chiste que necesita
  movimiento).
- **Completa: 26,5 cr.** Las tomas 1 y 5 también pasan a clip: 4 fotos (4 cr: la de arranque de las tomas 1 y 2, la
  de arranque de la 5 y las tomas 3 y 4) y 3 clips (22,5 cr). En la corta, el clip 2 sale de la foto 1.
- **Recomendación: la corta.** El original rinde por la idea, no por la cantidad de planos.
- ⚠️ **Riesgo propio de este formato:** el clip de los dedos puede salir con 4 o 6 dedos. En el original eso ES el
  chiste, pero acá la línea dice «los cuento siempre». Se mira cuadro por cuadro. Si los dedos fallan, se cambia el
  texto a «a veces me sobra uno» o se rehace (7,5 cr más). No se publica con un error que contradiga el texto.

---

## ✅ Material generado (3-oct, con el OK de Sergio Urcullo)

Todo está en `references/modelos/lucia/v4/kit/` y el detalle (jobs, puntajes, veredictos) en `v4/PROCEDENCIA.jsonl`, fila
`kit_lucia_generacion`. Para revisar de un vistazo: `kit-fotos-hoja.jpg` y `kit-clips-preview.mp4`.

| Toma | Archivo | Identidad | Notas |
|---|---|---:|---|
| K1 · 1 | `k1-1-recepcion-celular-4afffb96.jpg` | 0,808 | Es además la prueba de ropa: el ambo coincide con el maniquí |
| K1 · clip | `k1-clip-mira-camara-e470ef4f.mp4` | 0,68–0,79 | Las caras son chicas (~118 px) y se miraron: es ella |
| K2 · 1 | `k2-1-cafe-mostrador-3e05cfd0.jpg` | 0,829 | — |
| K2 · 2 | `k2-2-agenda-papel-1422fa94.jpg` | — | Sin persona; la letra de la agenda no se lee |
| K2 · clip | `k2-clip-deja-cafe-83130c4a.mp4` | 0,70–0,79 | Deja el café sin tomarlo |
| K4 · 1 | `k4-1-saluda-eddca486-recorte.jpg` | 0,81 | Recortada por encima del mostrador. La primera versión se descartó por un letrero inventado en una torre |
| K4 · clip | `k4-clip-cuenta-dedos-338b751f.mp4` | 0,73–0,81 | 5 dedos en los 9 cuadros revisados del conteo |
| K4 · 3 | `k4-3-cafe-teclado-186c82f0.jpg` | 0,841 | — |
| K4 · 4 | `k4-4-cuerpo-entero-cb86ea10.jpg` | 0,851 | Hay un folleto chico con letra en el borde izquierdo: se recorta al editar |
| K4 · 5 | `k4-5-senala-342c0ab5.jpg` | 0,835 | El monitor no muestra pantalla |

- **Gasto:** 30,5 cr (29,5 aprobados más 1 por rehacer K4 · 1). Octubre va **52,5 de 150 cr**.
- **Lo que falta para armar los reels:** las pantallas REALES de Onia, que salen de la cuenta demo. Se editan con
  `editor-videos`.

## Totales y lo que falta

| Pieza | Créditos |
|---|---:|
| K1 | 8,5 |
| K2 | 9,5 |
| K3 | 0 |
| **Total K1–K3** | **18** |
| K4, opción corta (o completa) | 11,5 (26,5) |

- *(Cotización del 3-oct, antes de generar; hoy octubre va 52,5 de 150 cr.)* Octubre iba **22 de 150 cr**. Con K1–K3
  pasaba a 40; si además iba K4 corta, a 51,5.
- **El gasto lo aprueba Sergio Urcullo** viendo esta tabla. Se cotiza de nuevo en vivo antes de crear.
- **Bloqueo para las tres:** las pantallas reales de la cuenta demo (existe; le falta el correo confirmado y
  `module.agents`, y K1/K2 piden escribir en producción con OK).
- **Antes de renderizar:**
  - `grep` del guion y del pie contra las frases prohibidas de `editor-videos` § Reels de Lucía;
  - comparar con `LUCIA.md` §0;
  - mirar cada pantalla.
