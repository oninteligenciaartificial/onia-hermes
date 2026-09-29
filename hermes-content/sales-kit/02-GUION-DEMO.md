# Guion de demo de Onia para clínicas — 20 minutos

> Para Sergio Urcullo. La demo se hace con SUS números, no con los nuestros: antes de
> arrancar conseguí los 3 datos del §0.
> Kit de venta 1.0 · 2026-09-28. Lo que se muestra acá es lo que hace la 1.0 de
> onia-platform (candidato `ed163e26`). El agente Reprograma (§4) entra con la 1.0: hasta que
> esté en producción, no lo muestres en vivo ni lo prometas como disponible hoy.

---

## §0 — Antes de la demo (2 min de charla, no es demo todavía)

Tres datos, conversando. Sin ellos la cuenta del final no funciona:

1. **¿Cuántos profesionales atienden y quién agenda?** Define el plan (tabla de
   `hermes-content/docs/ONIA_CLIENTE_IDEAL.md` §2).
2. **¿Cuántos pacientes tenés con un tratamiento empezado que no volvieron a agendar?** Si
   no lo sabe, acaba de decir el problema.
3. **¿Cuánto vale lo que le falta a uno de esos tratamientos?** Anotá SU ticket. No uses
   tickets de mercado: los que teníamos son de julio, anteriores a la devaluación.

**Preparación técnica (el día anterior):**

- Cuenta demo con datos 100 % ficticios, nunca pacientes reales.
- Cargá los casos que el §4 necesita: una cita reciente en «no asistió» sin otra cita por
  delante, una cita cancelada para los próximos 3 días, un paciente que no vuelve hace más
  de 6 meses, y citas de mañana sin confirmar.
- **Los agentes corren una vez por día, a las 7 de la mañana.** No hay botón para correrlos
  en el momento: si cargás los casos el mismo día, la bandeja está vacía.
- Notebook + celular con WhatsApp. Capturas de respaldo por si falla internet
  (`05-CHECKLIST-CAPTURAS.md`).

---

## §1 — Apertura con LA pregunta (min 0-2)

No abras con el producto. Abrí con:

> "Antes de mostrarte nada, una pregunta: **¿cuántos pacientes tenés con un tratamiento
> empezado que no volvieron a agendar?** … ¿Y cuánto vale lo que le faltaba a cada uno?"

Dejá que él haga la cuenta. Si duda del problema, el dato regional, SIEMPRE marcado como
regional:

> "En odontología de la región se pierde entre 10 % y 30 % de las citas, y hasta 1 de cada
> 4 pacientes no termina el tratamiento. Son datos de Colombia y Chile; en Bolivia no hay
> estudio publicado."

Transición: "Te muestro cómo se ve tu clínica adentro. Son 15 minutos."

---

## §2 — La agenda (min 2-5)

**Pantalla: agenda de la semana.** [PENDIENTE: captura 1]

- Un día cargado: citas por profesional, con su estado (confirmada, pendiente, no asistió,
  cancelada).
- Señalá la cita en «no asistió»: "Este paciente faltó. En el cuaderno, eso queda mudo.
  Acá, mirá lo que pasa mañana a la mañana" → puente al §4.
- La agenda online: el link que le pasás a tus pacientes para que reserven solos, sin
  llamar.

Frase clave: **"La agenda no es para anotar: es para que el sistema sepa a quién se te está
yendo."**

## §3 — El paciente (min 5-8)

**Pantalla: ficha de paciente.** [PENDIENTE: captura 3]

- Odontograma, historial de atenciones, recetas y documentos colgados en la ficha.
- Lo que pagó y lo que debe.
- Roles: "tu recepcionista agenda y cobra, pero no ve la historia clínica".

Frase clave: **"Cuando el paciente vuelve a los 8 meses, no empezás de cero: abrís la ficha
y seguís donde quedaste."**

## §4 — EL MOMENTO: lo que Onia te dejó listo esta mañana (min 8-13)

Andá despacio acá. Es lo que el cliente ideal pidió con sus palabras: identificar al
paciente que canceló o dejó de venir y no volvió a programar.

**Pantalla: Pendientes, con las propuestas de los agentes.** [PENDIENTE: captura 6]

> "¿Te acordás del paciente que faltó? Esta mañana el sistema vio que no tiene otra cita y
> **te dejó escrito el mensaje para ofrecerle reprogramar**, con el link de tu agenda. No
> manda nada solo: lo leés, lo aprobás con un toque, y recién ahí sale. Y el turno lo elige
> el paciente."

- Aprobá la propuesta en vivo. Si la cuenta demo tiene WhatsApp conectado, mostrá el
  mensaje llegando al celular [PENDIENTE: captura 8]. Si no, mostrá que queda listo para
  mandarlo con un toque desde el celular.
- **El turno que se liberó** [PENDIENTE: captura 7]: "Esta cita de pasado mañana se
  canceló. Onia te propone ofrecérsela a hasta tres pacientes sin cita. El primero que la
  quiere la toma en tu agenda online; los demás la ven ocupada. Vos no hacés de central
  telefónica."
- Recorré rápido las otras propuestas: quien hace más de 6 meses no vuelve (Vuelve a
  citar), las citas de mañana sin confirmar (Confirma citas), los saldos vencidos
  (Recuerda cobros).
- "La IA escribe los mensajes con el tono de tu clínica. A quién y cuándo lo decide el
  sistema con tus datos. **Y vos aprobás cada uno.**"

Frase clave: **"No es un recordatorio que el paciente ignora: es el mensaje justo, a la
persona justa, esperando tu OK."**

## §5 — El agente conversacional (min 13-15; solo si le interesa o si le calza Completo)

**Pantalla: una conversación en WhatsApp o en el chat de la web.** [PENDIENTE: captura 9]

> "Esto contesta al instante, a cualquier hora, con lo que vos le cargaste: horarios,
> servicios, tus respuestas. Entiende las fotos que le mandan. **Nunca da precios.** A quien
> pide turno le manda el link de tu agenda. Y lo que no sabe te lo pasa a vos, con la
> conversación completa."

Decí el costo de Meta ANTES de que lo pregunte: "Los mensajes de WhatsApp los cobra Meta
directo en tu cuenta, no nosotros: unos Bs 0,13 cada uno, también las respuestas."

## §6 — Facturación (1 min; solo si factura con NIT o si pregunta)

Guion, textual:

> "Onia no emite la factura electrónica. Lo que hace es dejarte cada venta con su detalle y
> su monto, lista para cargarla en el Portal Web del SIN, que es gratis."

Si pregunta si la va a emitir: "Nuestro emisor está en trámite ante el SIN. Cuando esté
aprobado te lo cuento; hoy no te lo vendo."

Si pregunta por su grupo de facturación: **nunca afirmarlo nosotros** → "Eso depende de tu
NIT, no del rubro. Miralo en tu Oficina Virtual o preguntale a tu contador."

## §7 — La cuenta con SUS números (min 15-17)

Volvé a los datos del §0 y hacé la cuenta EN VOZ ALTA con él:

> "Me dijiste: [N] pacientes con el tratamiento a medias, y a cada uno le faltaba Bs [X].
> [N] × [X] = **Bs [total] que están parados**.
> El plan que te calza cuesta Bs [precio del plan]. Si Onia te ayuda a recuperar
> [cuántos hacen falta] de esos al mes, se pagó. Lo que recuperes de ahí para arriba es tuyo."

## §8 — Precio y cierre (min 17-20)

**Regla dura: cotizá UN solo plan, el que le calza por tamaño. No abras con cinco precios.**

| Si tiene… | Cotizá |
|---|---|
| 2-3 profesionales + recepción | **Crece — Bs 550/mes** |
| 4-5 profesionales + recepción | **Profesional — Bs 890/mes** |
| 6 o más, o varios consultorios | **Completo — Bs 1.290/mes** (trae el agente conversacional) |

> "El plan que va con tu clínica es el **[plan]: Bs [precio] al mes**. Incluye todo lo que
> viste: agenda, fichas, los agentes que te preparan el seguimiento, y cada venta lista
> para el portal del SIN. Si pagás el año, pagás 10 meses."

**Cómo se arranca:**

> "Tenés 14 días de prueba gratis, sin tarjeta. No cobramos implementación: tus pacientes
> los importás desde un Excel con un asistente, y la cuenta ya viene armada para tu rubro.
> Para seguir, pagás con el QR del BCP desde el sistema. Sin contratos."

**Pedí el siguiente paso concreto, con fecha:**

> "¿Abrimos tu cuenta ahora y arrancás los 14 días de prueba? El [día concreto de esta
> semana] te escribo para ver cómo va."

### Manejo de precio fuera de guion

- **Pide precio antes de la demo** → "Según el tamaño, entre Bs 550 y Bs 1.290 al mes.
  Pero el número solo no te dice nada: dame 15 minutos y hacemos la cuenta con tus
  pacientes a medias."
- **"Está caro"** → volvé al §7 (la cuenta). NUNCA bajes la lista. Si es un consultorio de 1
  profesional: "Hay un plan Básico a Bs 320 que te ordena la clínica y deja cada venta lista
  para el portal del SIN. No trae los agentes: ésos arrancan en Crece."
- **"Hacéme descuento"** → "La lista es la misma para todos: es la garantía de que a tu
  colega de la otra cuadra no le cobré distinto. Lo que sí: si pagás el año, pagás 10
  meses."

### Lo que está PROHIBIDO decir en la demo

- ❌ "Onia emite tu factura" / "no vas a tener que tipear" (la emisión está apagada: la
  venta queda lista para el portal gratuito del SIN).
- ❌ "Por ley tenés que comprar un sistema" (falso: el Portal Web del SIN es gratis). El SIAT
  no se usa como urgencia.
- ❌ "Vos sos grupo X del SIAT" (depende del NIT).
- ❌ "Detecta los tratamientos a medias". No lee el plan de tratamiento: mira quién faltó o
  canceló en las últimas 2 semanas y no tiene otra cita (Reprograma), y quién no vuelve
  hace más de 6 meses (Vuelve a citar). Entre medio, ningún agente lo marca.
- ❌ "Reserva el turno solo" / "manda los mensajes solo". Propone; vos aprobás; el paciente
  elige su turno.
- ❌ "El agente conversacional agenda, cotiza o califica". Contesta lo cargado, manda el link
  de la agenda y pasa lo demás.
- ❌ "En Bolivia se pierde el 30 % de las citas" (el dato es de Colombia y Chile).
- ❌ Clientes o testimonios que no existen, cifras de resultados, tiempos de respuesta
  garantizados.
- ❌ Hablar de nosotros, de otros sistemas o de herramientas internas.
