# Seguimiento de los leads de agosto — qué contestar y qué mandar si no contestan

**Estado (3-oct-2026): borrador para Sergio Urcullo. No se mandó nada.** Cada mensaje sale solo con su OK sobre
el texto y el canal, y lo manda él. Todo va **de usted**.

Quiénes son y su historia: `hermes-content/docs/ONIA_LEADS_ESPERANDO.md`. Precios: leídos de
`onia-platform/lib/subscription-plans.ts` y `lib/plan-catalogo.ts` (`origin/master` `13b67dd`). Qué se puede
decir: `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` (la tabla del final dice de dónde sale cada frase).

| Plantilla (la crea Plataforma en Meta) | Para | Qué abre |
|---|---|---|
| **A** — disculpa + demo de 20 min | Maximo (dental), Leonardo (estética), Edwin (dental) | Botones «Sí, coordinemos» / «Ahora no» |
| **B** — disculpa + las respuestas en pantalla en 20 min | «F» (dental, 4 doctores), Mario (rubro sin saber) | Los mismos botones |

El sexto lead (conv 36, `Saguilera@…`) solo dejó correo: sin WhatsApp, sin plantillas. Se le escribe una vez por
correo (borrador en `ONIA_LEADS_ESPERANDO.md` §3.3) y, si contesta, se usan las respuestas de la §2.

---

## 0. Revisión del 10-oct: ¿son prospectos?, los borradores listos y qué falta

> Pedido de la madre con la aprobación de Sergio Urcullo del 10-oct («todo lo que esté revisado está aprobado»). **Eso cubre el texto; no cubre
> el envío**: contactar a un tercero sigue necesitando su sí aparte. Los textos de abajo quedan **listos para copiar**, y no se mandó nada.
> **Lo que no pude ver desde la nube:** Chatwoot, el registro del vigía (`onia-vigia-sin-respuesta.log`) y la lista de plantillas aprobadas viven en el VPS,
> y esta sesión no tiene llave. Las «8 colgadas, 5 sin respuesta» de hoy las ve la madre; abajo está lo que hace falta para clasificarlas.

### 0.1 ¿Son prospectos? Tres preguntas, aplicadas a los que ya conocemos

Es **lead** si (1) lo escribió una persona por su cuenta, no una prueba nuestra, no Sergio y no el bot; (2) habla de un negocio de los rubros que se
venden, o lo pide; (3) hay un canal para contestarle. Falla la 1 → no es lead. Falla la 2 (es un paciente que busca turno) → no se le escribe, y si
ya habló con el bot, la salida cortés de §2. Falla la 3 → no se puede.

| Quién | Entró | Días desde que entró (10-oct)* | ¿Prospecto? | Por qué | Qué se le manda |
|---|---|---|---|---|---|
| «F», conv 35, WhatsApp | 25-ago | **46 días** | **Sí, el más calificado** | Clínica odontológica de 4 doctores; pidió 6 funciones y el costo | Plantilla **B** → llamada. Sus 6 preguntas, contra el catálogo, en `ONIA_LEADS_ESPERANDO.md` §3.1 |
| Maximo Romano, `clinica klein` (dental) | 21-ago | 50 días | **Sí** | Pidió acceso por el formulario | Plantilla **A** (dental) |
| Leonardo Chuquimia, `Clinica Leonardo` (estética) | 23-ago | 48 días | **Sí**, segundo rubro | Pidió acceso por el formulario | Plantilla **A** (estética) |
| Edwin Benavidez, `consultorio dental sonrisa feliz` | 28-ago | 43 días | **Sí** | Pidió acceso; si atiende solo le calza Básico | Plantilla **A** (dental) |
| Mario, conv 37, WhatsApp | 28-ago | 43 días | **Probable** | «Quiero saber si me sirve para mi negocio»: no dijo el rubro | Plantilla **B′** (sin rubro); en la respuesta se le pregunta qué negocio tiene |
| Conv 36, widget, `Saguilera@ds-santacruz.bo` | 27-ago | 44 días | **Probable** | Solo dejó un correo | Un correo, una vez (`ONIA_LEADS_ESPERANDO.md` §3.3); sin WhatsApp no hay plantilla |
| Conv 34, widget, «hola» | 24-ago | 47 días | **No** | Sin ningún dato de contacto: falla la pregunta 3 | Nada |
| Conv 58, bot, 17-sep | 17-sep | 23 días | **Sin leer** | La auditoría del 2-oct dice que «quedó esperando horario» | Se clasifica con los datos de abajo |
| **El nuevo** y las **8 colgadas** del vigía | — | — | **Sin datos** | Solo existen en Chatwoot | Plantilla **N** (§0.2), cuando la madre pase los datos |

\* *Se supone que nadie les contestó después: los pedidos de acceso, la conv 34 y la 36 se leyeron el 31-ago (`contactedAt` vacío) y «F» y Mario se confirmaron hasta el 2-oct. El bloque «Conteo de hoy» lo verifica antes de escribir, y si alguien les contestó, el texto se ajusta.*

**Cómo se clasifican las que no vi** (le toca a quien tenga el VPS, solo lectura): correr el bloque «Conteo de hoy» de `ONIA_LEADS_ESPERANDO.md` y pasarme, **por cada
conversación colgada, solo esto**: id, canal, nombre o negocio si lo dio, qué escribió (una línea), hace cuánto, si hubo mensaje saliente de una persona. Con eso las pongo
en la tabla de arriba y les dejo su borrador. Dato que no está en ese bloque y hace falta: **si el último mensaje entrante tiene menos de 24 h**, porque cambia plantilla por texto libre.

### 0.2 Los textos (de usted, sin precio, sin nada que el catálogo §7 y §8 no deje decir)

Las cuatro plantillas (A, A estética, B y B′) son de **MARKETING, sin variables** (Meta rechaza un cuerpo que empieza o termina en variable) y llevan los botones **«Sí, coordinemos» / «Ahora no»**.
**Se dice la verdad sobre el retraso, porque son 43 a 50 días:** callarlo sería lo peor que se puede hacer con alguien que escribió hace mes y medio.

**Plantilla A — pedidos de acceso (dental): `seguimiento_a_acceso`**
> Hola, le escribe Sergio Urcullo, de Onia. En agosto usted pidió acceso a nuestro sistema y no le respondí a tiempo: le pido disculpas, fue mi falla. Onia es un sistema de gestión para clínicas dentales: agenda, ficha del paciente con historia clínica y odontograma, tratamientos, cobros e inventario, todo en un lugar. Si todavía le interesa, se lo muestro en una videollamada de 20 minutos para ver si le sirve. ¿Coordinamos?

**Plantilla A (estética), para Leonardo: `seguimiento_a_acceso_estetica`** — igual, con «para centros de estética: agenda, ficha de cada clienta, tratamientos, cobros e inventario» (sin odontograma).

**Plantilla B — escribió al bot con preguntas, «F»: `seguimiento_b_pregunta`**
> Hola, le escribe Sergio Urcullo, de Onia. En agosto usted nos escribió por un sistema de gestión para su clínica y no le respondí a tiempo: le pido disculpas. Prefiero contestarle mirando el sistema y no por mensaje: en una videollamada de 20 minutos le muestro el sistema en pantalla y le digo qué plan le corresponde. ¿Coordinamos?

**Plantilla B′ — Mario, sin rubro: `seguimiento_b_negocio`** — igual, con «para su negocio» en vez de «para su clínica». (Mario escribió una sola frase: por eso no dice «con preguntas».)

**Por qué B no dice «le muestro lo que preguntó»:** «F» pidió, entre otras cosas, la lista de pacientes con tratamiento pendiente y sin cita (el catálogo §8 la prohíbe y en la llamada no se muestra), períodos de 15/30/60 días (no se eligen) y PDF (no consta en el catálogo): prometerle «lo que preguntó» sería prometerle eso.

**Qué NO dicen, a propósito:** el tratamiento a medias (§8: el detector no encuentra a nadie); precios (se dan solo si preguntan, §2); «con una clínica de ejemplo» (**no hay cuenta demo** y
la llamada no lo promete, L-05); la factura del SIAT; el agente de WhatsApp; «otras clínicas lo usan» (cero clientes).

**Plantilla N — lead nuevo, con la ventana abierta (menos de 24 h desde su último mensaje): texto libre, sin plantilla**
> Buen día, soy Sergio Urcullo, de Onia. Gracias por escribirnos. Para decirle si Onia le sirve y qué plan le corresponde, cuénteme dos cosas: ¿qué negocio tiene y cuántas personas atienden?, ¿y quién agenda hoy las citas: recepción, usted, WhatsApp o un cuaderno? Con eso se lo muestro en 20 minutos.

**Con la ventana cerrada:** la plantilla A o B según haya pedido acceso o haya escrito con una pregunta. **Si es un paciente que busca turno:** «Gracias por escribir. Onia es un sistema para que las clínicas lleven su agenda y no damos turnos: para atención dental, escríbale directo a su clínica.»

**Si contesta «Sí, coordinemos»:** la respuesta de §2, ya sin «con una clínica de ejemplo». **Si no contesta:** la secuencia de la §3 (días 3, 7 y 14).

### 0.3 Lo que falta para poder mandarlos, en orden

1. **Hay un choque de minutos que Sergio Urcullo debe ver:** el primer mensaje del bot (publicado desde el 25-sep) y la página `/contacto` ofrecen una demo de **30 minutos**; la agenda de Cal.com es de **20** y este playbook dice 20 (L-04, `ONIA_PROMESA_VS_PRODUCTO.md`). Estos textos dicen 20.
2. **No consta que las plantillas A, A (estética), B y B′ existan aprobadas en Meta** (no vi la lista). La última con nombres es del **3-sep** y tenía 3 (`confirmacion_cita`, `seguimiento_demo`, `recordatorio_demo`);
   la auditoría del 2-oct contó **7 aprobadas, sin nombres registrados**, y dice que **ninguna sirve como primer mensaje ni para retomar a estos leads** (`research/ONIA_AUDITORIA_20261002.md`).
   Hay que crearlas con los textos de arriba (WhatsApp Manager, a cargo de Plataforma o la madre). **El tiempo de aprobación no está medido.**
3. **El método de pago de la cuenta de WhatsApp: el repo se contradice.** Los docs de agosto lo dan por cargado y el 131042 por resuelto; el 19-sep se previó que desde el 1-oct, sin método de pago, los
   envíos vuelven `failed` (`cola/chatbot.md`, sin medir). **No es** lo que dice el tablero `t_ac3aa802`, que habla de crédito de OpenAI. Se mira en WhatsApp Manager antes del primer envío y después se mira el estado de
   cada saliente en Chatwoot: un 2xx no dice que llegó.
4. **Alternativa sin plantilla: el celular personal de Sergio Urcullo**, con estos mismos textos como mensaje libre. Es lo que pedía la auditoría del 2-oct («hoy se escribe 1:1 desde tu teléfono»). **El 75414930 no consta en
   coexistencia** (el runbook del 28-ago sigue sin ejecutarse según `cola/chatbot.md`), así que no se escribe desde la app del número de ventas. Evita las plantillas y el punto 3.
5. **Sale desde la bandeja de Chatwoot (inbox 5) con el usuario de Sergio Urcullo** (o desde el teléfono), para que el bot se calle en esa conversación (§1, punto 1).
6. **Su sí** sobre el texto y el canal de cada mensaje. Una sola respuesta alcanza: «mandá A y B».

---

## 1. Antes del primer envío (tres cosas que cambian el resultado)

1. **Mandar las plantillas desde la bandeja de Chatwoot (inbox 5, «Onia WhatsApp») con el usuario de Sergio
   Urcullo.** Así el bot se calla en esa conversación (regla de traspaso de `hermes-content/deploy/vps-ops/bot/chatwoot-adapter.mjs`: un mensaje
   saliente de un usuario humano apaga el bot). Si salen por un envío automático, el botón «Sí, coordinemos» le
   llega al bot y contesta con su guion de venta. El carril del chatbot confirma que `CHATWOOT_BOT_AGENT_ID` está
   cargado en el VPS antes del primer envío.
2. **A «F» no se le dice que Onia encuentra los tratamientos a medias**, y en la llamada no se muestra esa lista.
   El catálogo (§8) lo prohíbe: el detector existe pero hoy no encuentra a nadie. El borrador del 1-oct que
   contestaba «Sí» se sacó el 5-oct. `ONIA_LEADS_ESPERANDO.md` §3.1 tiene sus seis preguntas contra el catálogo,
   para la llamada. Se le dice lo que sí hace
   (§2, «¿qué es Onia?») y que su pregunta 1 se la contesta Sergio Urcullo en la llamada, mirando el sistema.
3. **Maximo, Leonardo y Edwin:** mirar en `/admin/solicitudes` si ya crearon la cuenta después del 29-ago. Si la
   crearon, se les pregunta cómo les fue y no se les ofrece la demo.

---

## 2. Qué se contesta a cada respuesta (dentro de las 24 h: texto, imagen o audio libres)

Cuando el lead toca un botón o escribe, se abre la ventana de 24 h desde ese mensaje. Ahí todo sale como mensaje
normal, sin plantilla.

**«Sí, coordinemos»**
> ¡Gracias! Le propongo dos horarios: **{día y hora 1}** o **{día y hora 2}**. Son 20 minutos por videollamada
> para ver si le sirve. Si prefiere elegir usted, esta es mi agenda: https://cal.com/sergiourcullo/20min

- Grupo B: se suma «Ahí le muestro el sistema en pantalla.»
- Los dos horarios son reales, de la agenda de Sergio Urcullo de esa semana. El link existe: «Llamada 1 a 1», de
  20 min, medido el 3-oct.

**«Ahora no»**
> Entendido, gracias por decírmelo. ¿Le parece bien que le escriba en un mes, por si cambia el momento? Si prefiere
> que no, no le escribo más.

- Si dice que sí: un solo mensaje a los 30 días, con la plantilla **R30** (§3).
- Si dice que no, o no contesta: se termina. Callar no es permiso.

**Pregunta de precio**
> Se los paso derecho: el plan Básico cuesta Bs 320 al mes (2 usuarios); el Crece, Bs 550 (4 usuarios y la lista
> diaria de pendientes); el Profesional, Bs 890 (5 usuarios y reportes); y el Completo, Bs 1.290 (usuarios sin
> límite). Se prueba 14 días gratis, sin tarjeta. {Para su caso: …}. En 20 minutos se lo muestro con sus números.

{Para su caso}, según cuántas personas usan el sistema:

| Lead | Caso | Plan |
|---|---|---|
| «F» | 4 doctores + asistente = 5 usuarios | Profesional, Bs 890 |
| «F» | Solo los 4 doctores | Crece, Bs 550 |
| Edwin, si atiende solo | — | Básico. Ojo: no trae la lista de pendientes. No se le promete; en la llamada no se le muestra como incluida |
| Mario | Rubro y tamaño sin saber | Se le pregunta antes de nombrar un plan |

**«¿Qué es Onia?»**
> Es un sistema de gestión para su clínica: agenda y citas, la ficha del paciente con historia clínica y
> odontograma, tratamientos, cobros, inventario de insumos y gastos, todo en un lugar. Y cada mañana le deja
> anotado a quién escribirle —quién tiene cita mañana y no confirmó, quién le debe, quién canceló o faltó y no
> volvió a agendar— con el mensaje listo. Nada sale sin que usted lo apruebe. Se prueba 14 días gratis, sin
> tarjeta.

- Leonardo (estética): «la ficha del paciente con historia clínica y odontograma» → «la ficha de cada clienta».
- Mario, hasta saber su rubro: «Es un sistema de gestión armado para cada rubro: clínicas, estética, servicios,
  comercios e importadoras. ¿Qué negocio tiene y cuántas personas trabajan con usted? Con eso le digo qué le sirve.»

**Si pregunta por la factura del SIN**
> La factura fiscal se emite aparte, en el portal gratuito del SIN. Onia le ordena las ventas y los cobros. Cómo le
> aplica según su NIT lo vemos en la llamada.

**Una pregunta que no está acá**

Contesta Sergio Urcullo. Si es una capacidad, se busca en el catálogo antes de decir que sí. Si no figura como
«✅ sale», la respuesta es «eso se lo confirmo en la llamada, mirándolo en el sistema».

**Silencio:** no se contesta nada; corre la secuencia de la §3, contada desde el envío de A o B (día 0).

---

## 3. Si no contesta: días 3, 7 y 14

Pasadas 24 h sin respuesta, la ventana está cerrada: **cada toque es una plantilla aprobada en Meta.** Hacen
falta **cuatro plantillas nuevas, de MARKETING**, sin variables (Meta rechaza un cuerpo que empieza o termina en
variable, y así se aprueban más rápido). Todas llevan los botones «Sí, coordinemos» / «Ahora no».

| Día | Plantilla nueva | Encabezado | Cuerpo |
|---|---|---|---|
| **3** | `seguimiento_d3_imagen` | IMAGEN: captura real de Pendientes (abajo) | Hola, le escribe Sergio Urcullo, de Onia. Le dejo cómo se ve: cada mañana, la lista de a quién escribirle —quién no confirmó la cita de mañana, quién debe, quién hace meses no viene— con el mensaje ya escrito. Nada sale sin su aprobación. Viene desde el plan Crece y en la prueba de 14 días. ¿Se lo muestro en 20 minutos? |
| **7** | `seguimiento_d7_audio` | VIDEO: el audio de Sergio Urcullo sobre la misma captura (abajo) | Hola, le grabé un audio corto para explicarle en 30 segundos qué hace Onia por una clínica. Si le sirve, coordinamos una llamada de 20 minutos. |
| **14** | `seguimiento_d14_cierre` | — | Hola, es mi último mensaje sobre esto: no quiero llenarle el WhatsApp. Si más adelante quiere ver Onia funcionando con su clínica, toque «Sí, coordinemos» o escríbame por acá. ¡Éxitos con su trabajo! |
| +30 (solo con permiso) | `seguimiento_30d` | — | Hola, le escribe Sergio Urcullo, de Onia. Hace un mes me dijo «ahora no» y quedamos en que le escribía. ¿Ahora le sirve verlo en 20 minutos? |

Mario: en los días 7 y 14, «una clínica» / «su clínica» va como «un negocio» / «su negocio»; son dos plantillas
más, o se lo saca de la secuencia en el día 3 si su rubro no tiene agenda.

**Imagen del día 3:** `hermes-content/carousels/briefs/assets/onia-1.0-dental-ads/candidato-20260930/pendientes-confirmador.png`
(PNG, 1440×1000, 171 KB; WhatsApp acepta hasta 5 MB). Muestra tres propuestas reales de la pantalla Pendientes:
- el paciente que hace 7 meses no viene;
- el saldo vencido;
- la cita de mañana sin confirmar.

Cada una trae el mensaje escrito y «No se envía hasta que lo apruebes».

- Es del **candidato 1.0 con datos ficticios** (README de esa carpeta), no de la cuenta de producción. Sus textos
  sí están en producción, `release-8f07e537`, según las fuentes del brief D1 v3.
- **Falta el OK de Sergio Urcullo a la imagen.** Si prefiere una de producción: la saca en su cuenta demo, en
  `/pending`, y se reemplaza esta ruta.
- Los mensajes de la captura están de vos porque es el tono de la clínica de ejemplo, y se editan.

**El audio del día 7:** una plantilla no puede llevar audio solo (Meta acepta encabezados de texto, imagen,
video, documento o ubicación). El audio va dentro de un video: la voz de Sergio Urcullo sobre la captura fija.
- Formato: MP4, H.264 + AAC, hasta 16 MB.
- Se arma con un comando, a partir de la nota de voz que él grabe:

```bash
ffmpeg -loop 1 -i hermes-content/carousels/briefs/assets/onia-1.0-dental-ads/candidato-20260930/pendientes-confirmador.png \
  -i audio-sergio.m4a -c:v libx264 -tune stillimage -pix_fmt yuv420p -c:a aac -b:a 128k -shortest seguimiento_d7.mp4
```

Si el lead ya contestó y la ventana está abierta, la nota de voz va sola, sin video.

**Guion del audio** (25-30 s; lo graba Sergio Urcullo con su voz, sin leer de corrido):
> Hola, le habla Sergio Urcullo, de Onia. Le escribí hace unos días y quería explicárselo en corto. Lo que ve en la
> imagen es lo que Onia le deja cada mañana: a quién escribirle —quién no confirmó la cita de mañana, quién le
> debe, quién hace meses no viene— con el mensaje ya escrito. Usted lo revisa y lo envía; nada sale sin su
> aprobación. Si le sirve verlo con su clínica, son 20 minutos. Me dice cuándo le queda bien.

**Cuándo se corta la secuencia:**
- Contesta cualquier cosa → sale de la secuencia y se sigue con la §2.
- «Ahora no» o «no me escriba» → no recibe más plantillas.
- Una plantilla que no llegó (estado «fallido» en Chatwoot; Meta puede frenar marketing a quien recibe mucho)
  → no se manda la siguiente hasta mirar por qué.
- Tope: A/B + 3 toques. Más que eso arriesga reportes de spam, y el número es el mismo del bot de ventas.

**Costo estimado:** como máximo 5 personas × 4 plantillas de marketing = 20 envíos × USD 0,074 ≈ **USD 1,5**
(en bolivianos depende del cambio del banco, sin medir: `ONIA_PLAN_1.0_Y_CAJA.md` §2). Es la tarifa estimada de `hermes-content/deploy/vps-ops/bot/usage-run.mjs` (`TARIFAS_USD.marketing`); se confirma en WhatsApp
Manager. Las respuestas dentro de la ventana no son plantilla.

---

## 4. Remarketing barato

**El público personalizado con estos teléfonos no sirve, y no se arma.**
- **Tamaño:** son 5 teléfonos y 1 correo. Meta avisa que un público chico afecta la entrega y recomienda **al
  menos 1.000** personas ([cómo usar públicos personalizados](https://www.facebook.com/business/help/572787736078838)).
  Guías de terceros ponen el piso técnico en 100. Con 6, el anuncio no sale o sale carísimo.
- **Permiso:** Meta exige base legal para subir la lista ([crear un público de lista de
  clientes](https://www.facebook.com/business/help/170456843145568)). Ni el formulario de acceso ni el WhatsApp
  pidieron permiso para publicidad.
- Para hacerlo bien harían falta dos cosas, y hoy no hay ninguna:
  1. Un «¿le puedo mostrar anuncios de Onia?» respondido por escrito.
  2. Más de 1.000 contactos así.

**Lo que sí sirve, a costo cero:**
1. **La secuencia de la §3 es el remarketing:** tres toques con producto real, a USD 1,5 en total.
2. **Visitantes de onia.com.bo:** recién cuando la web tenga el píxel. Hoy no lo tiene en producción
   (`ONIA_ADQUISICION_Y_PAUTA.md` §5.9, bloqueo 7). Con el píxel, el público «visitó la web en 180 días» se arma
   solo.
3. **Marca personal de Sergio Urcullo** (`@sergiourcullo`). Para un dueño de clínica sirve lo que muestra la
   pantalla real y el problema del día:
   - un reel de 30 s grabando Pendientes (el mismo material del día 7);
   - «Tu cuaderno no miente, pero tampoco avisa» (brief `hermes-content/carousels/briefs/onia-cuaderno-no-avisa-20260820.json`).
     Al usarlo con estos leads, su frase «quién dejó de venir» no se convierte en promesa de tratamiento a medias.

   Según `hermes-content/docs/handoff/marca-personal-carruseles.md` todavía no hay nada publicado en Instagram: se verifica antes de
   mandarle un link a un lead.

---

## 5. De dónde sale cada frase

| Lo que se dice | Respaldo |
|---|---|
| Sistema de gestión para su clínica / armado para cada rubro | Catálogo §1 y §2 |
| Agenda, ficha con historia clínica y odontograma, tratamientos, cobros, inventario, gastos | Catálogo §2, fila Dental (estética: sin odontograma) |
| Cada mañana, a quién escribirle (no confirmó / debe / hace meses no viene) con el mensaje listo; nada sale sin su aprobación | Catálogo §8, frase 3 |
| Quién canceló o faltó y no volvió a agendar | Catálogo §2, agente reprogramador (✅ en §4, Agentes) |
| Desde el plan Crece y en la prueba | Catálogo §4 (Agentes) y §8, frase 3 |
| Reportes desde Profesional | Catálogo §4 |
| 14 días gratis, sin tarjeta | Catálogo §3 |
| Bs 320 / 550 / 890 / 1.290 al mes | `subscription-plans.ts` `DEFAULT_PLAN_AMOUNTS` (`origin/master` `13b67dd`) |
| 2 / 4 / 5 / sin límite de usuarios | `plan-catalogo.ts` `users` (Crece = 4: catálogo §3) |
| Factura fiscal aparte, en el portal del SIN | Catálogo §7 + FAQ `siat` publicada del bot |
| Llamada de 20 minutos | `cal.com/sergiourcullo/20min`, «Llamada 1 a 1», 20 min (medido 3-oct) |

**No se dice, a propósito:**
- que encuentra los tratamientos a medias (§8);
- nada de IA (no hace falta para vender esto);
- el agente o chatbot de WhatsApp (§5, «después»);
- recordatorios por WhatsApp (§7);
- la factura del SIAT dentro de Onia (§7);
- que otras clínicas ya lo usan (§7: cero clientes).
