# Guion de demo Onia — 15 a 20 minutos

> Para Sergio. La demo real dura 15–20 min (no 5–7): el dentista necesita VER su clínica adentro del sistema.
> Regla de oro: la demo se hace con SUS números, no con los nuestros. Antes de arrancar, conseguí 3 datos (ver §0).
> **Doc vivo, sin fecha: se EDITA.**
>
> ⚠️ **Corregido el 2026-09-04.** El §5 se llamaba «La factura» y mandaba a mostrar una
> pantalla de facturación y a decir textual «la factura sale del mismo sistema… apenas se
> apruebe, facturás directo desde acá». **Onia todavía no emite factura fiscal** — el trámite
> ante el SIN está en curso y sin fecha (`hermes-content/docs/ONIA_SIAT_ESTADO_HOMOLOGACION.md`).
> Era la promesa más cara del kit, dicha en vivo y frente a la pantalla, al cliente que más
> factura. Ahora el §5 demuestra **cobro y contabilidad**, que sí existen, y la factura del SIN
> tiene su propio bloque de respuesta honesta.

---

## §0 — Antes de la demo (2 min de charla, no es demo todavía)

Conseguí estos 3 datos conversando. Sin ellos la cuenta del final no funciona:

1. **¿Cuántas citas atendés por semana, más o menos?**
2. **¿Cuántos pacientes te faltaron sin avisar el mes pasado?** (si no sabe, es un punto a favor nuestro: "eso es exactamente lo que Onia te mide solo")
3. **¿Qué tratamiento es el que más te deja?** (ortodoncia / endodoncia / implantes — anotá su ticket)

Preparación técnica: ambiente demo cargado con datos ficticios (nunca datos de pacientes reales), notebook + celular con WhatsApp a mano, conexión verificada. Capturas de respaldo por si falla el internet (ver 05-CHECKLIST-CAPTURAS.md).

---

## §1 — Apertura con LA pregunta (min 0–2)

No abras con el producto. Abrí con:

> "Antes de mostrarte nada, una pregunta: **¿cuántos pacientes te faltaron sin avisar el mes pasado?** … A Bs 300–350 el ajuste de ortodoncia, ¿cuánto es eso al mes?"

Dejá que él haga la cuenta. Si duda del problema, dato regional (SIEMPRE marcado como regional):

> "En odontología de la región se pierde entre 10% y 30% de las citas, y hasta 1 de cada 4 pacientes no termina el tratamiento — datos de Colombia y Chile; en Bolivia no hay estudio publicado. Por eso lo primero que hace Onia en tu clínica es medir TU número real."

Transición: "Te muestro cómo se ve tu clínica adentro. Son 15 minutos."

---

## §2 — La agenda (min 2–5)

**Pantalla: agenda de la semana.** [PENDIENTE: captura — agenda semanal con citas y un hueco visible]

- Mostrá un día cargado: citas por sillón, colores por estado (confirmada / pendiente / faltó).
- Señalá UN hueco: "Este espacio en blanco es un paciente que faltó. En el cuaderno, ese hueco queda mudo. Acá, mirá lo que pasa" → (puente al §4, el agente).
- Agendar una cita nueva en vivo: 10 segundos, desde el celular también.

Frase clave: **"La agenda no es para anotar — es para que el sistema sepa cuándo se te escapa plata."**

## §3 — El paciente y el odontograma (min 5–9)

**Pantalla: ficha de paciente.** [PENDIENTE: captura — ficha con odontograma, historial de tratamientos y documentos]

- Odontograma: el estado de cada pieza, el plan de tratamiento, lo hecho y lo pendiente.
- Historial completo: quién lo atendió, cuándo, qué se le hizo, cuánto pagó y cuánto debe.
- Documentos y consentimientos digitales colgados en la ficha (Pro).
- Roles: "tu recepcionista ve la agenda y la caja, no la historia clínica" (Pro).

Frase clave: **"Cuando el paciente vuelve a los 8 meses, no empezás de cero: abrís la ficha y seguís donde quedaste."**

## §4 — EL MOMENTO: el agente proponiendo en /pending (min 9–13)

Esta es la parte que ningún cuaderno, Excel ni competidor local hace. Andá despacio acá.

**Pantalla: cola de pendientes (/pending) con una propuesta del agente.** [PENDIENTE: captura — /pending mostrando la propuesta de reprogramación del agente con botón de aprobar]

Guion:

> "¿Te acordás del hueco de la agenda? El paciente que faltó. Mirá: el agente ya lo detectó y **te está proponiendo esto**: mandarle a ese paciente un WhatsApp con dos horarios libres de esta semana para reprogramar. **El agente no manda nada solo — te lo propone acá, vos lo mirás y aprobás con un click.** Recién ahí sale el mensaje."

- Aprobá la propuesta en vivo y mostrá el WhatsApp saliendo al celular demo. [PENDIENTE: captura — chat de WhatsApp con el mensaje de reprogramación recibido]
- Remarcá la diferencia: **"Ojo: esto no es un recordatorio. Los recorditos el paciente los ignora. Esto REPROGRAMA — llena el hueco con una cita nueva. El hueco lleno es la plata."**
- Mostrá el panel del dueño: pendientes del día con responsable — "esto es lo que ves vos cada mañana en 30 segundos". [PENDIENTE: captura — panel del dueño con pendientes del día]

## §5 — El cobro y la contabilidad (min 13–16)

**Pantalla: cierre de atención → cobro → recibo, y el resumen del mes para el contador.**
[PENDIENTE: captura — cierre de atención con el pago registrado y el recibo]
[PENDIENTE: captura — libro de compras y ventas / resumen de IVA del mes]

Guion:

> "Cerrás la atención y en la misma pantalla registrás el pago: efectivo, QR o tarjeta. Sale el recibo y el paciente se va. **Al final del día no sacás la calculadora**: el total ya viene cortado por método de pago.
>
> Y esto es lo que a tu contador le cambia el mes: tu registro de compras y ventas y el IVA se van armando solos con cada cobro. En vez de juntar papeles el día 12, se lo exportás hecho."

**⚠️ Esta sección NO demuestra la factura fiscal. No existe pantalla que mostrar y no se simula ninguna.** Si en la demo aparece cualquier cosa que se parezca a una factura del SIN emitida, se corta: es exactamente lo que la regla de capturas prohíbe (`05-CHECKLIST-CAPTURAS.md`).

### Si pregunta por la factura del SIN (va a preguntar)

No se esquiva, no se adorna y **no se promete fecha**:

> "Te lo digo antes de que lo googlees: **podés cumplir gratis**. El SIN tiene un Portal Web donde tipeás cada factura a mano, sin comprarle nada a nadie, y cumple la norma al 100%. Cualquiera que te diga que estás obligado a comprar un sistema te está mintiendo.
>
> **Onia hoy no emite la factura fiscal.** Estamos registrados ante el SIN como proveedor y el trámite está en curso, pero **no tengo fecha y no te la voy a inventar**. Tampoco te la cobro: no está incluida en ningún plan ni se paga aparte.
>
> Lo que ganás igual es que al portal entrás con los números ya hechos —el paciente, el monto, el detalle— en vez de rearmarlos de memoria. Y si tu decisión de compra depende de facturar desde el sistema, mi consejo es que **compres cuando esté, no ahora**."

Contexto de la norma, como dato y nunca como amenaza: desde el **1 de octubre de 2026** los grupos 9° al 12° emiten únicamente por su modalidad en línea (RND 102600000007). Ya se prorrogó dos veces y puede haber otra — nadie lo sabe.

Si pregunta por su grupo de facturación: **nunca afirmarlo nosotros** → "Eso depende de tu NIT, no del rubro. Miralo en tu Oficina Virtual o preguntale a tu contador — te acompaño a verlo si querés."

## §6 — La cuenta con SUS números (min 16–18)

Volvé a los 3 datos del §0 y hacé la cuenta EN VOZ ALTA con él:

> "Vos me dijiste: [N] faltas al mes, y tu ajuste/tratamiento promedio vale Bs [X].
> [N] × [X] = **Bs [total] que se te van por mes en huecos**.
> Onia Pro cuesta **Bs 750**. Si el agente te recupera **dos** de esas citas, ya se pagó — todo lo demás del mes es ganancia."

Referencias si no dio números (siempre como referencia de mercado de Santa Cruz): ajuste de ortodoncia Bs 300–350 · endodoncia Bs 1.200–2.100 · implante Bs 3.000. **Un implante recuperado paga dos meses del plan Full.**

## §7 — Precio y cierre (min 18–20)

**Regla dura: cotizá SOLO el Pro. No abras con tres precios.**

> "El plan que va con tu clínica es el **Pro: Bs 750 al mes** — precio de lanzamiento. Incluye todo lo que viste: agenda, fichas con odontograma, caja y cobros, la contabilidad armada, y el agente que reprograma por WhatsApp."

**El cierre — implementación regalada:**

> "Y por cerrar en esta fase de lanzamiento, la **implementación va regalada**: cargamos tus pacientes, configuramos todo y capacitamos a tu equipo. Eso la competencia lo cobra entre Bs 2.274 y Bs 9.096. El precio de lista no lo toco — lo que te regalo es todo el arranque."

**Forma de pago:** "El cobro es **trimestral adelantado por QR** — un pago cada 3 meses, sin trámite. El precio de lanzamiento te lo respeto 12 meses; después se ajusta semestral indexado al TC del BCB o al IPC, lo que sea mayor — te lo digo de entrada, en este país nadie serio promete precio congelado de por vida."

**Pedí el siguiente paso concreto, con fecha:**

> "¿Te parece que el [día concreto de esta semana] venga/coordinemos la carga de tus pacientes y arrancamos? El primer trimestre lo activamos con el QR ese mismo día."

### Manejo de precio fuera de guion

- **Pide precio antes de la demo** → "Bs 750 el plan que le calza a la mayoría de las clínicas — pero el número solo no te dice nada; dame 15 minutos y hacemos la cuenta con TUS citas perdidas."
- **"Está caro"** → volver a §6 (la cuenta), NUNCA bajar la lista. Si insiste y es consultorio de 1 sillón → downsell: "Hay un plan Básico a Bs 320 — lo que cobrás por tres consultas — que te ordena la clínica: agenda, fichas, caja e inventario. Sin los agentes, eso sí. Podés arrancar ahí y subir cuando quieras."
- **"Hacéme descuento"** → "El descuento ya te lo estoy dando: la implementación regalada vale hasta Bs 9.096 a precio de mercado. La tarifa de lista no se mueve — es la garantía de que a tu colega de la otra cuadra no le cobré distinto."

### Lo que está PROHIBIDO decir en la demo

- ❌ "Por ley tenés que comprar un sistema" (falso — el Portal Web del SIN es gratis; lo decimos NOSOTROS primero).
- ❌ "Vos sos grupo X del SIAT" (depende del NIT; que lo mire en su Oficina Virtual).
- ❌ "En Bolivia se pierde el 30% de las citas" (el dato es de Colombia/Chile; SIEMPRE decir que es regional).
- ❌ Prometer que no habrá prórroga del SIAT, o usarla como amenaza (el gancho es timing: "dejalo resuelto antes, no en la última semana").
- ❌ Clientes o testimonios que no existen; tiempos de respuesta garantizados (SLA).
- ❌ Mencionar plantillas o herramientas internas.
- ❌ **Decir o insinuar que la factura fiscal «va incluida», «viene con el plan» o «sale del sistema».** Onia todavía no la emite (`hermes-content/docs/ONIA_SIAT_ESTADO_HOMOLOGACION.md`). Hasta el 2026-09-04 este guion mandaba a decirlo textual, en tres lugares.
- ❌ Dar una fecha de homologación del SIAT, aunque la pida.
- ❌ Hablar de nosotros: el equipo, la tecnología, «somos chicos pero», premios, con qué está hecho. Al dueño de la clínica le importa su agenda, no nuestro stack.
