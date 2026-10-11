# LISTA PARA MOSTRAR: primer mensaje 8 clínicas

> **11-oct-2026 · Ventas y pauta · encargo de la MADRE MARKETING.** **BORRADORES: no se envió nada, nadie fue contactado. Enviarlos lo decide Sergio Urcullo, con el mensaje y el canal exactos de cada uno** (`ONIA_ADQUISICION_Y_PAUTA.md` §3). De usted. Ninguno menciona el tratamiento a medias (§5.4), precio, minutos de llamada, «clínica de ejemplo» ni IA.
> Los datos que cada mensaje cita salen de `research/competencia/anuncios/CLINICAS-SCZ-CON-PAUTA-11OCT.json`; este archivo lo genera `.claude/skills/onia-ventas-pauta/scripts/primer-mensaje-8-clinicas.mjs`.

## 0. Cambio respecto del pedido: no son «las 8 de encaje Alto»

La madre pidió mensajes para las 8 clínicas de «encaje Alto» de la lista de las 12:40 UTC. **Esa lista estaba mal**: puntuó «Alta» a las clínicas con varias sedes o muchos anuncios, y **seis de esas ocho ya estaban descartadas con evidencia** en `ONIA_PROSPECTOS_DENTAL_SCZ.md`: Imagina (cadena de 4 sucursales, §6.2), Cortez (multi-sede, §6.6), MUN y Boquita Sana (2 sedes, §6.7 y §6.9), Ortobom (red de sedes, §6.9) y Europea (Cochabamba, §6.9). Un mensaje a cualquiera de ellas sería escribirle a quien no es el cliente ideal (2 a 6 profesionales), o a otra ciudad. La lista se corrigió (ya no hay «Alta») y **estos 8 son los que sobreviven**: 6 **candidatas** (la verificación previa dice SIGUE, pautan hoy y tienen Santa Cruz verificada) y 2 **condicionales** (Santa Cruz por el nombre o un fragmento, tamaño sin dato).

## 1. La compuerta: no se envía mientras las promesas del mensaje no estén en ✅

Los 8 mensajes dicen lo mismo del producto: agenda, ficha del paciente y cobros, y que cada mañana deja anotado a quién escribirle (por ejemplo quién tiene cita mañana y no confirmó) con el mensaje listo, sin que nada salga sin aprobación. Eso descansa en estas filas de `ONIA_PROMESA_VS_PRODUCTO.md`, leídas del archivo al generar este borrador:

| Fila | Qué se dice | Estado hoy |
|---|---|---|
| B-01 | agenda del día con paciente, hora y profesional | ⬜ sin verificar: falta la cuenta |
| B-02 | cada cita muestra si está confirmada o sin confirmar | ⬜ sin verificar: falta la cuenta |
| C-01 | ficha del paciente | ⬜ sin verificar: falta la cuenta |
| E-01 | cobros con saldo | ⬜ sin verificar: falta la cuenta |
| G-01 | nada sale sin que usted lo apruebe | ⬜ sin verificar: falta la cuenta |
| G-04 | cada mañana le deja anotado a quién escribirle | ⬜ sin verificar: corre solo, falta el log del VPS |
| G-06 | quién tiene cita mañana y no confirmó | ⬜ sin verificar: falta la cuenta |

**Compuerta abierta: no enviar.** Con la cuenta demo de Plataforma (12-oct) se verifican y esta tabla se actualiza sola al regenerar. **Tensión entre documentos:** `ONIA_ADQUISICION_Y_PAUTA.md` §7 dice que producción no «confirma citas desde el panel» hasta publicar la 1.0, y estos mensajes hablan de «quién tiene cita mañana y no confirmó» (G-06, que descansa en B-02): hasta verlo en producción, no se envía. Además, para mostrar «cómo se ve» hace falta esa cuenta demo con datos (L-05); el mensaje no promete una duración (L-04) ni una «clínica de ejemplo».

## 2. Antes de enviar cada uno (unos 3 minutos por clínica, desde la PC)

1. Abrir su Facebook o el anuncio y confirmar que sigue activo y que el número abre WhatsApp. Los números salen de los docs del 1 al 8-oct, no de hoy.
2. Contar profesionales (pregunta 1). Si pasa de 6, o es uno solo, sale.
3. Releer la línea «Vi que…» contra lo que se ve ese día; si cambió, se corrige esa línea y no se envía con un dato viejo.
4. Si la clínica ya respondió antes (`ONIA_LEADS_ESPERANDO.md`), no se le escribe dos veces.

## 3. Los 8 borradores

### 1. Clínica Dental Hurtado · candidata

- **Dato de su pauta** (Biblioteca, `page_id` 284462084761388, leído el 11-oct): 6 anuncios activos en BOB, el más viejo del 2026-04-13. 6 anuncios activos, el más viejo del 13-abr.
- **Canal propuesto:** WhatsApp de reservas 77349396. Fuente: ONIA_PROSPECTOS_DENTAL_SCZ.md §6.9 #2 (post del 14-sep). Alternativa: llamada al mismo número. **Lo envía Sergio Urcullo desde su WhatsApp**, no desde el número del bot (fuera de las 24 h no sale texto libre).
- **Pregunta de calificación:** 1 de `ONIA_CLIENTE_IDEAL.md` §9 — ¿Cuántos odontólogos atienden hoy en la clínica?
- **Condición de salida:** si pasa de 6 profesionales, sale (laboratorio propio y centro radiológico: riesgo de pasar).
- **Línea opcional**, solo si se confirma hoy desde la PC (no está en el mensaje porque no sale de la Biblioteca): «y que la valoración sin costo se reserva por WhatsApp (post del 14-sep, leído el 8-oct: confirmarlo hoy en su Facebook antes de agregarlo)».

> Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de la Clínica Dental Hurtado.
>
> Vi que tienen anuncios activos desde abril.
>
> Cuando una clínica pauta para traer pacientes nuevos, el paciente de mañana que no confirmó suele quedar sin que nadie le escriba.
>
> Onia es un sistema de gestión para clínicas dentales: agenda, ficha del paciente y cobros. Cada mañana le deja anotado a quién escribirle, por ejemplo quién tiene cita mañana y no confirmó, con el mensaje listo; nada sale sin que usted lo apruebe.
>
> Para mostrarle algo que le sirva: ¿Cuántos odontólogos atienden hoy en la clínica? Si le interesa, le muestro cómo se ve.

### 2. COYR DENT · candidata

- **Dato de su pauta** (Biblioteca, `page_id` 2042184532678966, leído el 11-oct): 4 anuncios activos en USD, el más viejo del 2026-08-21. 4 anuncios activos (USD), el más viejo del 21-ago.
- **Canal propuesto:** WhatsApp 78597900. Fuente: ONIA_PROSPECTOS_DENTAL_SCZ.md §6.9 #6 (post del 17-sep, «agenda con nuestro especialista»). Alternativa: otra línea 62217290. **Lo envía Sergio Urcullo desde su WhatsApp**, no desde el número del bot (fuera de las 24 h no sale texto libre).
- **Pregunta de calificación:** 1 de `ONIA_CLIENTE_IDEAL.md` §9 — ¿Cuántos odontólogos atienden hoy en la clínica?
- **Condición de salida:** riesgo alto de ser un solo profesional («nuestro especialista», en singular): si atiende uno solo, sale.
- **Línea opcional**, solo si se confirma hoy desde la PC (no está en el mensaje porque no sale de la Biblioteca): «y que ofrecen ortodoncia con planes de pago (post del 17-sep, leído el 8-oct: confirmarlo hoy antes de agregarlo)».

> Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de COYR DENT.
>
> Vi que tienen anuncios activos desde agosto.
>
> Cuando una clínica pauta para traer pacientes nuevos, el paciente de mañana que no confirmó suele quedar sin que nadie le escriba.
>
> Onia es un sistema de gestión para clínicas dentales: agenda, ficha del paciente y cobros. Cada mañana le deja anotado a quién escribirle, por ejemplo quién tiene cita mañana y no confirmó, con el mensaje listo; nada sale sin que usted lo apruebe.
>
> Para mostrarle algo que le sirva: ¿Cuántos odontólogos atienden hoy en la clínica? Si le interesa, le muestro cómo se ve.

### 3. Clarident Plus · candidata

- **Dato de su pauta** (Biblioteca, `page_id` 339088019578381, leído el 11-oct): 3 anuncios activos en BOB, el más viejo del 2026-10-07. 3 anuncios activos, el más viejo del 7-oct.
- **Canal propuesto:** WhatsApp 70846705. Fuente: ONIA_PROSPECTOS_DENTAL_SCZ.md §6.9 #1 (posts del 14-sep, «agenda por wa.me/70846705»). Alternativa: segunda línea 76363029. **Lo envía Sergio Urcullo desde su WhatsApp**, no desde el número del bot (fuera de las 24 h no sale texto libre).
- **Pregunta de calificación:** 2 de `ONIA_CLIENTE_IDEAL.md` §9 — ¿Quién agenda las citas que llegan por ese chat?
- **Condición de salida:** mirar desde la PC si la página «Clarident Duo» es otra sede: si lo es, sale por multi-sede.
- **Línea opcional**, solo si se confirma hoy desde la PC (no está en el mensaje porque no sale de la Biblioteca): «y que sus promociones se agendan por WhatsApp (posts del 14-sep, leídos el 8-oct: confirmarlo hoy antes de agregarlo)».

> Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de Clarident Plus.
>
> Vi que desde el 7 de octubre tienen anuncios nuevos.
>
> Cuando una clínica pauta para traer pacientes nuevos, el paciente de mañana que no confirmó suele quedar sin que nadie le escriba.
>
> Onia es un sistema de gestión para clínicas dentales: agenda, ficha del paciente y cobros. Cada mañana le deja anotado a quién escribirle, por ejemplo quién tiene cita mañana y no confirmó, con el mensaje listo; nada sale sin que usted lo apruebe.
>
> Para mostrarle algo que le sirva: ¿Quién agenda las citas en la clínica? Si le interesa, le muestro cómo se ve.

### 4. Smile Dental · candidata

- **Dato de su pauta** (Biblioteca, `page_id` 1099790733394902, leído el 11-oct): 3 anuncios activos en BOB, el más viejo del 2026-10-07. 3 anuncios activos con el botón «Chatea con nosotros», del 7 y el 8-oct.
- **Canal propuesto:** teléfono 60482017 (confirmar que tiene WhatsApp). Fuente: ONIA_PROSPECTOS_DENTAL_SCZ.md §6.9 #3 (ficha del directorio). Alternativa: llamada al mismo número. **Lo envía Sergio Urcullo desde su WhatsApp**, no desde el número del bot (fuera de las 24 h no sale texto libre).
- **Pregunta de calificación:** 2 de `ONIA_CLIENTE_IDEAL.md` §9 — ¿Quién agenda las citas que llegan por ese chat?
- **Condición de salida:** preguntar el tamaño; «profesionales altamente capacitados» y «amplios box» pueden ser texto genérico.

> Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de Smile Dental.
>
> Vi sus anuncios con el botón «Chatea con nosotros», que empezaron el 7 y el 8 de octubre.
>
> Con anuncios que traen consultas por chat, el paciente de mañana que no confirmó suele quedar sin que nadie le escriba.
>
> Onia es un sistema de gestión para clínicas dentales: agenda, ficha del paciente y cobros. Cada mañana le deja anotado a quién escribirle, por ejemplo quién tiene cita mañana y no confirmó, con el mensaje listo; nada sale sin que usted lo apruebe.
>
> Para mostrarle algo que le sirva: ¿Quién agenda las citas que llegan por ese chat? Si le interesa, le muestro cómo se ve.

### 5. Clínica Dental Innova Kids · candidata

- **Dato de su pauta** (Biblioteca, `page_id` 105982241767033, leído el 11-oct): 3 anuncios activos en BOB, el más viejo del 2026-02-03. 3 anuncios activos: «Cuidado dental para niños en Santa Cruz» desde febrero y «Agenda tu cita ahora» desde julio.
- **Canal propuesto:** WhatsApp 76341626. Fuente: ONIA_PROSPECTOS_DENTAL_SCZ.md §6.9 #5 (posts del 13-jul, «Agenda su valoración · WhatsApp 76341626»). Alternativa: llamada al mismo número. **Lo envía Sergio Urcullo desde su WhatsApp**, no desde el número del bot (fuera de las 24 h no sale texto libre).
- **Pregunta de calificación:** 1 de `ONIA_CLIENTE_IDEAL.md` §9 — ¿Cuántos odontólogos atienden hoy en la clínica?
- **Condición de salida:** solo odontopediatría: la cita la confirma el padre o la madre; preguntar el tamaño.

> Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de la Clínica Dental Innova Kids.
>
> Vi que tienen un anuncio de «Cuidado dental para niños en Santa Cruz» desde febrero, y otro de «Agenda tu cita ahora» desde julio.
>
> Con niños, la cita la confirma el papá o la mamá, y la de mañana sin confirmar suele quedar sin que nadie les escriba.
>
> Onia es un sistema de gestión para clínicas dentales: agenda, ficha del paciente y cobros. Cada mañana le deja anotado a quién escribirle, por ejemplo quién tiene cita mañana y no confirmó, con el mensaje listo; nada sale sin que usted lo apruebe.
>
> Para mostrarle algo que le sirva: ¿Cuántos odontólogos atienden hoy en la clínica? Si le interesa, le muestro cómo se ve.

### 6. Clínica Dental Ezequiel - Spadental · candidata

- **Dato de su pauta** (Biblioteca, `page_id` 758264870991469, leído el 11-oct): 2 anuncios activos en BOB, el más viejo del 2026-08-08. 2 anuncios activos: «Recupera tu sonrisa» desde septiembre y uno de blanqueamiento con precio propio desde agosto.
- **Canal propuesto:** teléfono 70805007 (que sea WhatsApp es inferencia). Fuente: ONIA_PROSPECTOS_DENTAL_SCZ.md §6.6 #9 (Waze). Alternativa: el chat del propio anuncio, se ve al abrirlo desde la PC. **Lo envía Sergio Urcullo desde su WhatsApp**, no desde el número del bot (fuera de las 24 h no sale texto libre).
- **Pregunta de calificación:** 1 de `ONIA_CLIENTE_IDEAL.md` §9 — ¿Cuántos odontólogos atienden hoy en la clínica?
- **Condición de salida:** marca con nombre propio: si es un solo doctor, sale.

> Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de la Clínica Dental Ezequiel - Spadental.
>
> Vi sus anuncios «Recupera tu sonrisa» y uno de blanqueamiento, activo desde agosto.
>
> Cuando una promoción trae pacientes nuevos, el de mañana que no confirmó suele quedar sin que nadie le escriba.
>
> Onia es un sistema de gestión para clínicas dentales: agenda, ficha del paciente y cobros. Cada mañana le deja anotado a quién escribirle, por ejemplo quién tiene cita mañana y no confirmó, con el mensaje listo; nada sale sin que usted lo apruebe.
>
> Para mostrarle algo que le sirva: ¿Cuántos odontólogos atienden hoy en la clínica? Si le interesa, le muestro cómo se ve.

### 7. Natural Smile Santa Cruz · **condicional: no se envía hasta confirmar**

- **Dato de su pauta** (Biblioteca, `page_id` 100193878311097, leído el 11-oct): 3 anuncios activos en BOB, el más viejo del 2026-08-06. 3 anuncios activos, el más viejo del 6-ago.
- **Canal propuesto:** WhatsApp +591 77603420 (fragmento de buscador, sin confirmar). Fuente: ONIA_PROSPECTOS_DENTAL_SCZ.md §6.6, reserva (fragmento). Alternativa: llamada al mismo número. **Lo envía Sergio Urcullo desde su WhatsApp**, no desde el número del bot (fuera de las 24 h no sale texto libre).
- **Pregunta de calificación:** 1 de `ONIA_CLIENTE_IDEAL.md` §9 — ¿Cuántos odontólogos atienden hoy en la clínica?
- **Condición de salida:** tamaño sin dato; hay otra página «Natural Smile Dra. Carrazana» en Alto de las Sierras: si es una segunda sede, sale. NO se envía hasta confirmarlo desde la PC.

> Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de Natural Smile Santa Cruz.
>
> Vi que tienen anuncios activos desde agosto.
>
> Cuando una clínica pauta para traer pacientes nuevos, el de mañana que no confirmó suele quedar sin que nadie le escriba.
>
> Onia es un sistema de gestión para clínicas dentales: agenda, ficha del paciente y cobros. Cada mañana le deja anotado a quién escribirle, por ejemplo quién tiene cita mañana y no confirmó, con el mensaje listo; nada sale sin que usted lo apruebe.
>
> Para mostrarle algo que le sirva: ¿Cuántos odontólogos atienden hoy en la clínica? Si le interesa, le muestro cómo se ve.

### 8. Clínica Dental ROCHA · **condicional: no se envía hasta confirmar**

- **Dato de su pauta** (Biblioteca, `page_id` 113481741822891, leído el 11-oct): 2 anuncios activos en BOB, el más viejo del 2026-08-25. 2 anuncios activos, ambos «Agenda tu cita», del 25-ago.
- **Canal propuesto:** WhatsApp +591 72102945 (fragmento de buscador, sin confirmar). Fuente: ONIA_PROSPECTOS_DENTAL_SCZ.md §6.6, reserva (fragmento). Alternativa: el botón del propio anuncio, se ve al abrirlo desde la PC. **Lo envía Sergio Urcullo desde su WhatsApp**, no desde el número del bot (fuera de las 24 h no sale texto libre).
- **Pregunta de calificación:** 2 de `ONIA_CLIENTE_IDEAL.md` §9 — ¿Quién agenda las citas que llegan por ese chat?
- **Condición de salida:** tamaño sin dato; ¿es la misma que «Consultorio Dental Rocha» (169289006270602)? Si es un consultorio de una persona, sale. NO se envía hasta confirmarlo desde la PC.

> Buen día, soy Sergio Urcullo, de Onia, aquí en Santa Cruz. Este mensaje es para el dueño o la dueña de la Clínica Dental ROCHA.
>
> Vi sus anuncios «Agenda tu cita», activos desde fines de agosto.
>
> Con anuncios que traen citas nuevas, el paciente de mañana que no confirmó suele quedar sin que nadie le escriba.
>
> Onia es un sistema de gestión para clínicas dentales: agenda, ficha del paciente y cobros. Cada mañana le deja anotado a quién escribirle, por ejemplo quién tiene cita mañana y no confirmó, con el mensaje listo; nada sale sin que usted lo apruebe.
>
> Para mostrarle algo que le sirva: ¿Quién agenda esas citas? Si le interesa, le muestro cómo se ve.

## 4. Verificación

- **Detector de promesas de la web** (`promesa-que-el-producto-cumple.mjs`): 0 promesas en los 8 mensajes (lo exige scripts/primer-mensaje-8-clinicas.test.mjs).
- **Revisor independiente (`haiku`, 11-oct):** primera pasada: 4 problemas reales y 1 choque entre documentos. (1) Hurtado, COYR DENT y Clarident Plus afirmaban cosas de posts viejos (WhatsApp, planes de pago, promociones) que la Biblioteca no trae → pasaron a una «línea opcional» que se confirma hoy desde la PC. (2) La frase de COYR sobre la cuota que se atrasa rozaba el tratamiento a medias (§5.4) → se cambió. (3) ROCHA tiene dos anuncios, no uno → plural. (4) Choque entre `ONIA_ADQUISICION_Y_PAUTA.md` §7 («confirmar citas desde el panel» no lo hace producción hoy) y «quién tiene cita mañana y no confirmó» → se sumó B-02 a la compuerta y se dejó dicho. Segunda pasada sobre los 5 corregidos: OK, salvo la pregunta de Clarident Plus, que daba por hecho un chat que ya no se menciona → se cambió a «¿Quién agenda las citas en la clínica?». Los otros 3 (Smile Dental, Innova Kids, Natural Smile) salieron OK en la primera. **Lo que el revisor NO pudo cerrar:** ninguno de los 8 pasa la compuerta de `ONIA_PROMESA_VS_PRODUCTO.md` §1 (0 de las 11 promesas verificadas, sin cuenta demo): revisó documentos, no el producto en vivo.
- **Pruebas automáticas** (`scripts/primer-mensaje-8-clinicas.test.mjs`): cada dato citado (anuncios, fechas, titulares) coincide con la Biblioteca transcripta; de usted; una sola pregunta; sin precio, minutos, «ejemplo», IA ni tratamiento a medias.

## 5. Qué depende de quién

| Qué | Quién |
|---|---|
| Elegir a cuáles enviar y aprobar mensaje y canal de cada uno | Sergio Urcullo |
| Abrir los anuncios y páginas desde la PC (número que abre WhatsApp, cuántos profesionales, «Clarident Duo», Natural Smile y ROCHA) | La madre en la PC |
| Cuenta demo con datos y verificar B-01, C-01, E-01, G-01, G-04, G-06 | Plataforma (12-oct) y Ventas y pauta |
| Decidir 20 o 30 minutos (L-04) antes de nombrar una duración en cualquier mensaje | Sergio Urcullo |
