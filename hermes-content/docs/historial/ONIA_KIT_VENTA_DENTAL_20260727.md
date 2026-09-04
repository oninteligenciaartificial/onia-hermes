# ONIA — Kit de venta DentalGest, listo para ejecutar (2026-07-27)

> Contexto real, sin adornos: **0 clientes pagando**, runway ≈11 semanas. El producto
> (DentalGest / módulo dental de la plataforma Onia) está ~90% vendible y **EN VIVO**
> en `www.dentalgest.app`. El objetivo único de la empresa es **3-5 clínicas dentales
> pagando antes de mediados de octubre de 2026**. La razón por la que hoy no hay
> ventas no es el producto: es que no se mandó el mensaje.
>
> Este documento consolida y deja **accionable** lo que ya existía disperso en
> `hermes-content/sales-kit/` (01 a 05, escrito 2026-07-25) y `ONIA_LEADS_PRIORITY_2026.md`
> + `prospectos-clinicas-bolivia-2026.csv` (50 leads investigados, 2026-06). No inventa
> nada nuevo — reordena y completa lo que faltaba para que Sergio solo tenga que
> **aprobar y apretar enviar**.
>
> Fuentes usadas: `hermes-content/docs/ONIA_ENFOQUE_20260727.md`,
> `ONIA_CATALOGO_DE_IDEAS.md`, `ONIA_ESTADO_Y_RUMBO_20260726.md`,
> `sales-kit/01..05`, `ONIA_LEADS_PRIORITY_2026.md`,
> `references/prospectos-clinicas-bolivia-2026.csv`, `CRM_PROSPECTING.md`,
> `BCP_PASARELA_CREDENCIALES_INTERNO.md`.

---

## 0. Regla de oro antes de usar esto

- **Nada de esto se envía solo.** Cada mensaje es un borrador. Antes de mandarlo,
  Sergio aprueba con la frase literal `Apruebo contactar: <clínica>` — así lo pide
  la skill `prospeccion-onia` y `crm-prospeccion-onia`.
- **El envío es 100% manual, uno por uno, desde el WhatsApp de Sergio.** El canal
  bloqueado es el WhatsApp **automático** (bot / API de Meta, pendiente de
  verificación — S5/S6). Mandar un mensaje a mano, con aprobación previa, está
  permitido y es exactamente lo que ya se hizo en `OUTREACH_TANDA1_LAPAZ.md`.
- **Los números de teléfono de la lista §4 son los que figuran públicos en
  directorios/webs de cada clínica** (fuente citada en cada fila) — no están
  verificados como WhatsApp activo. Antes de escribir, confirmar en 10 segundos
  que el número tiene WhatsApp (foto de perfil / última conexión visible).
- **Registrar todo en el CRM del repo** (`ONIA_LEADS_PRIORITY_2026.md` +
  `prospectos-clinicas-bolivia-2026.csv`, o Notion si ya está migrado — ver
  `CRM_PROSPECTING.md`) apenas se envíe un mensaje: cambiar `estado_pipeline` a
  `Aprobado para contactar` → `Contactado` con fecha. Sin esto no hay comisión ni
  trazabilidad.
- **No prometer nada que el producto no hace hoy.** Todo lo que aparece en el
  guion de demo (§2) está verificado contra `sales-kit/02-GUION-DEMO.md` y el
  estado real del producto en `ONIA_ESTADO_Y_RUMBO_20260726.md`.

---

## 1. Mensajes de WhatsApp — listos para copiar y pegar

Regla transversal: un mensaje = una idea + **una** pregunta concreta (pedir la
demo de 15 min), nunca "contame si te interesa". Reemplazar `[Nombre]` /
`[Clínica]` antes de enviar. Español boliviano, directo, de dueño a dueño, sin
emojis de más, sin "estimado cliente".

### 1.1 Primer contacto en frío — ESTE es el que aplica HOY

Los 50 leads del CSV son **contacto frío por investigación pública** (directorios,
webs, Facebook), no referidos. Tres variantes según la señal que tiene la clínica
(usar la que corresponda de la lista en §4):

**(a) Clínica con web propia y tratamientos de alto valor** (ortodoncia, estética,
implantes — ej. CEO Dra. Bianca Zambrana, Paz Dental, Estetic Dent):

```
Hola, ¿hablo con [Clínica]? Soy Sergio, de ONIA, acá en Santa Cruz.

Vi su web y que trabajan [ortodoncia/estética/implantes]. Trabajo con clínicas
dentales en una sola cosa: los pacientes que faltan sin avisar y el hueco que
dejan en la agenda — con tratamientos como los suyos, cada hueco pesa bastante.

Una pregunta corta: ¿más o menos cuántos pacientes les faltaron sin avisar el
mes pasado? Si la respuesta es "no sé exacto, pero varios", tengo algo para
mostrarles en 15 minutos.
```

**(b) Clínica que solo usa Facebook/Instagram** (sin web propia — ej. ASISTA, Bio
Odontología, Odontología Morales):

```
Hola, ¿hablo con [Clínica]? Soy Sergio, de ONIA, acá en Santa Cruz.

Vi su Facebook — están activos ahí. Trabajo con clínicas dentales en un problema
puntual: los mensajes y consultas de redes se dispersan y terminan sin
seguimiento, y los pacientes que faltan a su cita nadie los vuelve a llamar.

¿Cuántos pacientes les faltaron sin avisar el mes pasado, más o menos? Si no
llevan ese número, ya es una señal. Les muestro en 15 minutos cómo lo resuelvo.
```

**(c) Clínica multi-sede o con varios teléfonos** (ej. CRO, Ortodoncia y Estética
Dental):

```
Hola, ¿hablo con [Clínica]? Soy Sergio, de ONIA, acá en Santa Cruz.

Vi que manejan más de una sede/línea de contacto. Con varios puntos de atención
es común perder de vista qué consulta respondió cada sede o qué paciente quedó
sin reprogramar.

¿Tienen forma hoy de saber, sin preguntar en cada sede, cuántos pacientes les
faltaron el mes pasado? Les muestro en 15 minutos un sistema que sí lo sabe.
```

### 1.2 Primer contacto vía referido (plantilla — sin uso real todavía)

**No hay ningún referido activo registrado en el repo hoy.** El canal de
contadores como puerta B2B2B (catálogo §8.1) está en plan, no ejecutado. Dejar
esta plantilla lista para el día que aparezca un referido real (un contador, un
colega dentista, un paciente):

```
Hola [Nombre], soy Sergio, de ONIA. Le hablo de parte de [quién refirió] — me
comentó que a veces se les complica el seguimiento de pacientes que faltan a
sus citas en [Clínica].

Trabajo justo en eso con clínicas dentales acá en [ciudad]. ¿Le muestro en 15
minutos cómo lo resuelvo? Sin compromiso, con los números de su propia clínica.
```

### 1.3 Reapertura de lead tibio ("ya habló con nosotros") (plantilla — sin uso real todavía)

**Tampoco hay ningún lead registrado en el CRM que haya hablado antes con
nosotros y no haya cerrado.** Los 50 leads del CSV están en estado `Nuevo` /
`Investigado`: cero contactados. Esta plantilla (ya redactada en
`sales-kit/03-SCRIPTS-WHATSAPP.md`) queda lista para el día que exista un caso
real — no aplicarla a un lead que nunca habló con nosotros:

```
Hola [Nombre], soy Sergio de ONIA — hablamos hace un tiempo por el sistema para
[Clínica].

En ese momento me dijiste que te quedaba corto, y tenías razón. Te escribo
porque cambió bastante: ahora tiene un agente que trabaja solo — cuando un
paciente falta, detecta el hueco y te propone reprogramarlo por WhatsApp, vos
aprobás con un click y recién ahí sale el mensaje. Y sobre facturar: nuestro
emisor está en homologación ante el SIN. Hasta que lo aprueben, el sistema te
deja la venta lista y facturás por el Portal Web, que es gratis — sin tipear
dos veces. Apenas se apruebe, sale directo de acá.

¿Te muestro en 15 minutos lo que cambió? La cuenta la hacemos con los números
de tu clínica.
```

### 1.4 Seguimiento a los 3 días (sin respuesta al primer mensaje, o post-demo)

**Variante A — sin respuesta al primer contacto (§1.1), 3 días después:**

```
[Nombre], le escribí hace unos días por lo de los pacientes que faltan sin
avisar en [Clínica]. Sé que el día a día de una clínica no deja mucho tiempo
para el celular.

Le dejo la idea en una línea: en 15 minutos le muestro cómo recuperar esas
citas solas, con los números de SU clínica. ¿Le queda bien esta semana?
```

**Variante B — después de una demo, 24-72h sin decisión:**

```
[Nombre], gracias por el tiempo del [día].

Le dejo la cuenta que hicimos, por escrito:
• [N] faltas al mes × Bs [ticket] = Bs [total] que se van en huecos
• DentalGest Pro: Bs 750/mes — se paga solo recuperando 2 de esas citas
• Cerrando esta semana: implementación y carga de sus pacientes GRATIS

¿Arrancamos el [día concreto]? Ese día cargamos sus pacientes y activamos el
primer trimestre.
```

### 1.5 Seguimiento final (último intento antes de pasar a nutrición)

A los 7-10 días del primer mensaje, o 4-5 días después del seguimiento de §1.4.
Es el ÚLTIMO mensaje de venta activa — si no responde, pasa a nutrición (dato
útil cada 3-4 semanas, sin vender).

```
[Nombre], último mensaje y no le insisto más.

Sé que la clínica no deja tiempo ni para almorzar. Le dejo lo esencial en una
línea: DentalGest recupera las citas que hoy se pierden solas, y desde el 1 de
octubre solo se factura en línea — puede cumplir gratis tipeando en el portal
del SIN, o hacer que la factura salga sola del mismo sistema donde ya está la
cita y el paciente.

Si quiere retomarlo, responda DEMO y coordinamos. Si no es el momento, todo
bien — le voy a escribir cada tanto algo útil del rubro, sin venderle nada.
```

### 1.6 Respuesta al que escribe "DEMO" (calificación en 3 mensajes, ya validada)

```
1) ¡Buenísimo! Para prepararle la demo con datos que le sirvan, 2 preguntas
   rápidas: ¿cómo se llama su clínica y cuántos profesionales/sillones son?

2) Perfecto. ¿Y hoy cómo manejan la agenda y las fichas: cuaderno, Excel o
   algún sistema? ¿Ya están facturando en línea o todavía con talonario?

3) Listo, con eso armo la demo para su caso. Son 15 minutos y hacemos la cuenta
   con SUS números de citas perdidas. ¿Le queda mejor [día 1] a las [hora] o
   [día 2] a las [hora]? Puede ser en su clínica o por videollamada.
```

---

## 2. Guion de la demo — 15 minutos, minuto a minuto

Verificado contra `sales-kit/02-GUION-DEMO.md` y el estado real del producto
(`ONIA_ESTADO_Y_RUMBO_20260726.md`: DentalGest en vivo, core 9/9 entidades,
fiscal SIAT en mock por homologación pendiente, agentes Recall/Cobrador generan
borradores human-in-the-loop). Nada acá promete algo que el sistema no hace hoy.
Antes de arrancar: ambiente demo cargado con datos **ficticios** (nunca
pacientes reales) — ver checklist §5.

### Min 0-2 — La pregunta, no el producto

No abrir con el sistema. Abrir con:

> "Antes de mostrarle nada, una pregunta: ¿cuántos pacientes le faltaron sin
> avisar el mes pasado? … A Bs 300-350 el ajuste de ortodoncia, ¿cuánto es eso
> al mes?"

Si duda del problema (dato SIEMPRE marcado como regional, nunca boliviano):

> "En odontología de la región se pierde entre 10% y 30% de las citas — datos de
> Colombia y Chile, en Bolivia no hay estudio publicado. Por eso lo primero que
> hace DentalGest en su clínica es medir SU número real."

### Min 2-4 — La agenda

Mostrar la agenda de la semana: citas por sillón, colores por estado, y **un
hueco visible** (paciente que faltó).

> "La agenda no es para anotar — es para que el sistema sepa cuándo se le
> escapa plata."

### Min 4-7 — La ficha del paciente

Odontograma, historial de atenciones, documentos/consentimientos digitales
(Pro), roles (recepción ve agenda y caja, no la historia clínica — Pro).

> "Cuando el paciente vuelve a los 8 meses, no empieza de cero: abre la ficha y
> sigue donde quedó."

### Min 7-11 — EL MOMENTO: el agente en /pending (ir despacio acá)

Esto es lo que ningún cuaderno, Excel ni competidor local hace.

> "¿Se acuerda del hueco de la agenda? Mire: el agente ya lo detectó y le está
> proponiendo esto — mandarle a ese paciente un WhatsApp con dos horarios
> libres de esta semana para reprogramar. **El agente no manda nada solo — se
> lo propone acá, usted lo mira y aprueba con un click.** Recién ahí sale el
> mensaje."

Aprobar en vivo, mostrar el WhatsApp saliendo al celular demo.

> "Ojo: esto no es un recordatorio. Los recordatorios el paciente los ignora.
> Esto REPROGRAMA — llena el hueco con una cita nueva. El hueco lleno es la
> plata."

Mostrar el panel del dueño (pendientes del día, 15 segundos):
"esto es lo que ve cada mañana."

### Min 11-13 — La factura (honestidad primero, textual)

> "Punto factura. Primero lo que le corresponde saber: desde el 1 de octubre
> solo se emite factura en línea — plazo vigente del SIN. Y puede cumplir
> gratis: el SIN tiene un Portal Web donde tipea cada factura a mano, sin
> comprar nada. Eso se lo digo yo antes de que lo googlee.
>
> Lo que hace DentalGest es que no tenga que tipear: cierra la atención acá, y
> la factura sale del mismo sistema — mismo paciente, mismo monto, cero doble
> digitación.
>
> Estado real hoy: nuestro emisor está en homologación ante el SIN. Hasta que
> esté aprobado, DentalGest le deja la venta lista y factura por el Portal Web.
> Apenas se apruebe, factura directo desde acá."

### Min 13-15 — La cuenta y el cierre

Volver a los números que dio en el min 0-2:

> "[N] faltas al mes × Bs [ticket] = Bs [total] que se van en huecos.
> DentalGest Pro cuesta Bs 750. Si el agente le recupera dos de esas citas, ya
> se pagó — todo lo demás del mes es ganancia."

**Cotizar SOLO el Pro (Bs 750/mes).** No abrir con tres precios.

> "Y por cerrar en esta fase de lanzamiento, la implementación va regalada:
> cargamos sus pacientes, configuramos todo y capacitamos a su equipo — eso la
> competencia lo cobra entre Bs 2.274 y 9.096. El precio de lista no lo toco.
>
> ¿Le parece que el [día concreto de esta semana] coordinamos la carga de sus
> pacientes y arrancamos?"

**Pedir el cierre explícito con fecha — nunca dejarlo en "lo pienso" sin fecha
de vuelta** (si dice "déjame pensarlo", usar la respuesta de §3.6).

---

## 3. Objeciones — con respuesta lista (10)

Regla transversal: nunca discutir, nunca inventar datos ni clientes, **nunca
bajar la tarifa de lista.**

### 3.1 "Ya uso el portal gratis del SIN, no necesito nada más"

> "Tiene razón, es gratis y cumple. La pregunta no es el SIAT — es cuánto
> tiempo pierde tipeando cada factura a mano, paciente por paciente. DentalGest
> no le cobra nada extra por facturar: nuestro emisor está en homologación ante
> el SIN, así que por ahora el sistema le deja la venta lista y usted factura
> por el Portal Web, que es gratis, sin tipear dos veces. Apenas se apruebe, la
> factura sale directo del sistema y no cambia nada de su lado. El portal del
> SIN sigue ahí de respaldo si algún día lo necesita."

### 3.2 "Es caro"

> "El plan que le calza es el Pro: Bs 750 al mes, precio de lanzamiento. Para
> que el número le diga algo: es lo que cobra por
> **dos ajustes de ortodoncia**. Si el sistema le recupera dos citas al mes,
> sale gratis — y todo lo que recupere de ahí para arriba es suyo. ¿Cuántas
> citas se le pierden hoy al mes?"
>
> (Si insiste y es consultorio de 1 sillón, downsell: "Hay un plan Básico a Bs
> 320 — lo que cobra por tres consultas — que le ordena la clínica. Sin el
> agente de WhatsApp, eso sí." **Nunca bajar el precio
> del Pro** — el descuento real vive en la implementación regalada.)

### 3.3 "No sé usar sistemas" / "soy de la vieja escuela"

> "Entiendo, y es justo por eso que la implementación va regalada: yo cargo sus
> pacientes, configuro todo y capacito a su equipo — usted no arranca de cero
> solo. Si sabe usar WhatsApp, ya sabe usar la parte que más importa: el
> agente le manda una propuesta, usted la mira y aprueba con un click. Nada
> más complicado que eso del lado suyo."

### 3.4 "Mi secretaria lo hace en Excel/cuaderno y nos va bien"

> "Y seguro le funciona para anotar. La pregunta es otra: ¿cuántos pacientes le
> faltaron sin avisar el mes pasado? El cuaderno no se lo dice, y tampoco le
> escribe al paciente para llenar el hueco. En la región se pierde entre 10% y
> 30% de las citas (Colombia y Chile; en Bolivia no hay estudio). Eso en su
> clínica, ¿cuántos bolivianos son al mes? Además, desde el 1 de octubre la
> factura es en línea sí o sí — el cuaderno no factura."

### 3.5 "¿Y si se cae internet?"

> "DentalGest anda en la nube: si se corta el wifi de la clínica, sigue desde
> el celular con datos — la agenda y las fichas están ahí igual. Y lo
> importante: no pierde nada. Los datos no viven en su computadora — si se le
> quema la máquina o se corta la luz, su información está intacta y la ve
> desde otro aparato. Lo que no puede hacer sin ninguna conexión es trabajar en
> ese rato — igual que con cualquier sistema en línea, incluido el portal del
> SIN."

### 3.6 "Déjame pensarlo"

> "Claro, es una decisión de su clínica. Ayúdeme con una cosa para no hacerle
> perder tiempo: ¿qué es lo que le falta ver o saber? [escuchar y resolver
> ESO]. Le propongo algo concreto: le llamo el [día concreto, máx. 3-4 días] y
> me dice sí o no, sin vueltas. Solo tenga en cuenta que la implementación
> regalada es de esta fase de lanzamiento — cuando tengamos las primeras
> clínicas andando, vuelve a precio de mercado."

### 3.7 "Somos muy chicos para esto"

> "Al revés — cuanto más chica la clínica, más duele cada silla vacía. Hagamos
> la cuenta: el Pro cuesta Bs 750, lo mismo que dos ajustes de ortodoncia. Si
> el agente le recupera dos citas al mes, ya se pagó. Y si aun así le queda
> grande, hay un plan de entrada a Bs 320 que le ordena la clínica."

### 3.8 "¿Quién más lo usa? / Sos muy nuevo"

> "Se lo contesto derecho: estamos arrancando — sería de las primeras clínicas
> de Santa Cruz. Y justo por eso le conviene: uno, la implementación va
> regalada (la competencia la cobra Bs 2.274-9.096); dos, el precio es de
> lanzamiento y se lo respeto 12 meses; tres, me tiene a mí directo, no a un
> call center. Y sus datos son suyos: si un día se quiere ir, se los lleva
> exportados. El riesgo lo saco yo, no usted."

### 3.9 "¿Mis datos están seguros?" (historia clínica = dato sensible)

> "Tres cosas concretas. Uno: los datos viajan cifrados y viven en
> infraestructura de nube profesional con respaldos, no en una PC que se puede
> quemar o robar. Dos: acceso por roles — su recepcionista ve la agenda y la
> caja, no la historia clínica. Tres: los datos son suyos, los exporta cuando
> quiera, y si se va, se los lleva. Nada de quedar rehén del sistema."

### 3.10 "El SIAT no me corre todavía a mí"

> "Puede ser — el grupo depende de su NIT, no del rubro, así que mírelo en su
> Oficina Virtual o pregúntele a su contador; no se lo voy a afirmar yo. Lo que
> sí es dato duro: el plazo vigente del SIN es el 30 de septiembre. Ya se
> prorrogó dos veces y puede que se prorrogue otra vez, o no — no se lo puedo
> prometer. Y algo que le digo yo antes de que lo googlee: puede cumplir gratis
> tipeando en el Portal Web del SIN. Mi consejo: déjelo resuelto antes, no en
> la última semana con todo el país haciendo el trámite a la vez."

**Prohibido en cualquier objeción:** "por ley tiene que comprarnos" (el portal
del SIN es gratis, lo decimos NOSOTROS primero) · afirmar el grupo SIAT del
prospecto · presentar el dato de no-show como boliviano · inventar clientes,
testimonios o SLA · bajar la tarifa de lista (el descuento vive en la
implementación regalada).

---

## 4. A quién contactar primero, en orden

**Hoy hay 50 leads dentales registrados** en
`hermes-content/references/prospectos-clinicas-bolivia-2026.csv` (investigados
2026-06, fuentes públicas: webs propias, Facebook, directorios
dancefree.com.co / todosnegocios.com / aiyellow.com). **Cero fueron
contactados** — todos están en estado `Nuevo`/`Investigado`. Existe además un
CSV hermano de 100 leads repartido en 3 "personas"
(`prospectos-dentalgest-bolivia-100-20260602-persona-{1,2,3}.csv`, mismo estado
`Investigado`) para cuando se sumen más manos a la prospección — no hace falta
tocarlo todavía, es la ola 2-3.

**Por qué este orden:** Santa Cruz primero porque es donde Sergio puede
demostrar en persona (mayor tasa de cierre, y es el "cliente #1 concreto" del
`ONIA_ENFOQUE_20260727.md`: clínica de 1-5 odontólogos en Santa Cruz). Dentro
de Santa Cruz, primero las de mayor señal de dolor + capacidad de pago
(multi-sede, zona premium, tratamientos de alto valor), después las de marca
establecida, y al final las que solo tienen Facebook (piden más educación antes
de cerrar). La Paz entra como segunda ola, por videollamada, con el mismo
criterio de señal.

| # | Clínica | Ciudad | Por qué este lugar | Contacto público | Fuente |
|---:|---|---|---|---|---|
| 1 | CRO — Clínica de Rehabilitación Odontológica | Santa Cruz | Multi-sede (2 sedes, 2 teléfonos, 2 emails) = mayor dolor operativo, mejor candidato a Full | `cro.com.bo` · 3-3559173 / 3-3575146 / info@cro.com.bo | dancefree.com.co |
| 2 | Odontolaser | Santa Cruz | Servicios con tecnología/láser = clínica moderna, más abierta a adoptar SaaS | `odontolaser.com.bo` · 3-3220325 / 79079302 / odontolaserboliviasc@gmail.com | dancefree.com.co |
| 3 | Paz Dental | Santa Cruz | Zona Equipetrol (premium) = alto ticket por paciente, la cuenta del §2 pega más fuerte | `dentalforhealth.com` · 3-3413226 / 79078485 | dancefree.com.co |
| 4 | CEO Clínica de Odontología Especializada — Dra. Bianca Zambrana | Santa Cruz | Ortodoncia/odontopediatría = consultas repetitivas, el agente de reprogramación es el pitch exacto | `drabiancazambrana.com` · 3-3223161 / 76046276 / drabiancazambrana@hotmail.com | dancefree.com.co |
| 5 | Odontoking Clínica Dental | Santa Cruz | Marca establecida + web propia + email, demo consultiva estándar | `odontoking.com` · 3-3362669 / 71017179 / clinica.odontoking.srl@gmail.com | dancefree.com.co |
| 6 | Estetic Dent Santa Cruz | Santa Cruz | Enfoque estético = embudo por tratamiento, encaja con upsell futuro de contenido | `esteticdent-santacruz.com` (contacto en sitio) | esteticdent-santacruz.com |
| 7 | ASISTA — Clínica Dental | Santa Cruz | Facebook activo + doble teléfono + email; sin web (mensaje variante b, foco en centralizar leads dispersos) | 70732925 / 75000568 / asista.dental@gmail.com | dancefree.com.co |
| 8 | Bio Odontología | Santa Cruz | Perfil social como canal principal; agenda probablemente manual (mensaje variante b) | 3-3498981 / 60009498 | dancefree.com.co |
| 9 | Clínica Dental Cortez | La Paz | Web propia + email; 2da ola por videollamada, buena señal de captación y seguimiento de citas | `clinicadentalcortez.com.bo` · 2-2771052 / 72509231 / dentalcortezclinica@gmail.com | dancefree.com.co |
| 10 | Reino Dental | La Paz | Web propia + marca reconocible en La Paz | `reinodental.com` · 2-2900756 / 75871389 / elreinodental@gmail.com | dancefree.com.co |
| 11 | Clínica Dental Love | La Paz | Marca clara + email con dominio propio | Facebook `clinicadentallovebo` · 2-2431746 / 73574353 / hola@clinicadentallove.com | dancefree.com.co |
| 12 | GiSmile | La Paz | Omnicanal (Linktree con TikTok/IG/FB/WhatsApp) = alto volumen social, buen fit para "no perder mensajes" | `linktr.ee/gismile` | linktr.ee/gismile |

**Antes de escribir a cualquiera de estos 12:** confirmar que el teléfono
público tiene WhatsApp activo, y pedir la aprobación literal
(`Apruebo contactar: <clínica>`) uno por uno — no se manda por lote.

---

## 5. Qué necesita Sergio de sí mismo para poder mandar esto mañana

1. **Un WhatsApp para enviar a mano.** El envío es manual (no bot), así que
   alcanza con el número personal o el WhatsApp Business de ONIA que ya use
   Sergio hoy. `[FALTA: confirmar cuál número usar de forma consistente para
   que el CRM y el historial queden en un solo lugar]`.
2. **El ambiente demo cargado con datos ficticios**, según
   `sales-kit/05-CHECKLIST-CAPTURAS.md`: clínica demo con ~15 citas de la
   semana (mínimo 1 en estado "faltó"), un paciente con odontograma e
   historial completos, y **una propuesta viva del agente en `/pending`**
   (la pieza que sostiene todo el minuto 7-11 de la demo). `[FALTA: confirmar
   si este ambiente ya está cargado hoy 2026-07-27 o si hay que armarlo antes
   de la primera demo]`.
3. **Una forma de cobrar el primer trimestre el mismo día del cierre.** El
   guion de cierre (§2, min 13-15) promete activar por QR el mismo día. La
   integración QR Simple de BCP es **por cliente** (cada clínica abre su
   propia cuenta/API — ver `BCP_PASARELA_CREDENCIALES_INTERNO.md`) y eso no
   está listo para el primer cliente. Para cerrar mañana alcanza con **un QR
   de cobro manual** (personal o de la cuenta de ONIA) para el primer pago,
   sin esperar la integración completa. `[FALTA: confirmar qué QR/cuenta se
   usa para cobrar el primer trimestre de forma manual]`.
4. **Decidir, mensaje por mensaje, a quién de la lista del §4 se aprueba
   contactar primero** — este documento no manda nada solo.
5. **Capturas de respaldo del sistema** (checklist completo en
   `sales-kit/05-CHECKLIST-CAPTURAS.md`) por si falla el internet durante una
   demo en la clínica. Hoy el guion de demo real (`02-GUION-DEMO.md`) todavía
   tiene marcas `[PENDIENTE: captura]` sin reemplazar — no bloquea la demo en
   vivo, pero si falla la conexión no hay respaldo. `[FALTA: 30 minutos para
   tomar las 12 capturas listadas]`.

---

Relacionado: `sales-kit/01-ONE-PAGER-OFERTA.md` (oferta completa a imprimir) ·
`sales-kit/02-GUION-DEMO.md` (versión 15-20 min con el detalle completo) ·
`sales-kit/03-SCRIPTS-WHATSAPP.md` · `sales-kit/04-OBJECIONES.md` ·
`ONIA_LEADS_PRIORITY_2026.md` (universo completo de 50 leads) ·
`ONIA_ENFOQUE_20260727.md` (por qué dental, por qué Santa Cruz primero).
