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
> ¡Gracias! Le propongo dos horarios: **{día y hora 1}** o **{día y hora 2}**. Son 20 minutos por videollamada, con
> una clínica de ejemplo. Si prefiere elegir usted, esta es mi agenda: https://cal.com/sergiourcullo/20min

- Grupo B: se suma «Ahí le muestro en pantalla lo que nos preguntó.»
- Mario: «con una clínica de ejemplo» → «con un negocio de ejemplo».
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
