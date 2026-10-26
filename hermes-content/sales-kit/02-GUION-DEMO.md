# Guion de demo — 20 minutos, por rubro

> Para Sergio Urcullo, que es el único que vende. Un guion por rubro, con lo que la 1.0 hace hoy.
> **Leído en el código** de `onia-platform`, `origin/master` `a7f228c` (1-oct). Cada pantalla que se muestra
> lleva su prueba en la tabla de su rubro. **Lo que no está en el código no está en el guion.**
> Reemplaza al guion dental de julio (con la marca vieja DentalGest, planes y precios viejos, factura): quedó en el historial de git.
> Un tema, un archivo: esto se EDITA.

§0 vale para todos · §1 Dental y estética · §2 Importadora · §3 Comercio y servicios · §4 Después de la demo.

---

## 0. Antes de cualquier demo

### 0.1 La cuenta demo — hoy NO existe en producción

- El 30-sep no había demo dental en producción (`historial/handoff/onia-1.0-nube.md` §2).
- Se arma con `prisma/seed-demo.ts` + `prisma/seed-demo-datos.ts`: cinco negocios inventados, nombres y
  teléfonos ficticios. **Solo corre contra una base local desechable**: aborta si apunta a producción.
  La levanta Plataforma, con los usuarios para entrar (el seed crea perfiles, no logins).
- **Se siembra la mañana de la demo.** «Hoy», «mañana» y los días sin venir se cuentan desde la hora en que corre.
- **El seed no carga horarios.** Sin horario, la página de reserva no muestra a nadie
  (`app/api/booking/doctors/route.ts` lista solo profesionales con horario activo). Si vas a abrir el link de
  reserva, cargá antes los horarios de cada profesional en Configuración → Horarios.
- Antes de la llamada, mirá `/pending`: tienen que estar las propuestas que dice el rubro.

| Rubro | Negocio de la cuenta demo | Plan de la cuenta |
|---|---|---|
| Dental | Clínica Dental Sonrisa Norte | Completo |
| Estética | Estética Lumina | Completo |
| Importadora | Importadora Eléctrica Andina | Profesional |
| Comercio | Ferretería El Carmen | Profesional |
| Servicios | Estudio Contable Ribera | Profesional |

- **La cuenta muestra más que el plan que vas a cotizar.** Mostrá solo lo que trae ese plan (§0.2).
- **Ojo: no aprietes «Enviar yo mismo por WhatsApp».** Abre WhatsApp con el teléfono del cliente de ejemplo:
  es inventado y puede ser de una persona real. Mostrá el texto y explicá el botón.

### 0.2 Planes y precios — se re-leen el día de la demo

Fuente: `lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`) y `lib/plan-catalogo.ts` (`PLAN_LIMITS`), en
`origin/master` `a7f228c`. El nombre que ve el cliente sale de `lib/pricing.ts` (`PLAN_LABELS`).

| Plan | Bs/mes | Usuarios | Pacientes / clientes | Qué suma |
|---|---|---|---|---|
| Básico | 320 | 2 | 300 | sin agentes ni link de reserva |
| Crece | 550 | 4 | 800 | Pendientes (agentes) y link de reserva |
| Profesional | 890 | 5 | 1.500 | + reportes completos y cobros recurrentes |
| Completo | 1.290 | sin tope | sin tope | sin topes |

- El anual vale 10 meses. Básico, Crece y Profesional también se pagan por semana.
- **Ojo: Crece = 4 usuarios entró en `a7f228c` (PR #95, 1-oct).** El release de producción que anota
  `ONIA_CATALOGO_DE_VENTA.md` (`4dc829e`) dice 3. Antes de cotizar Crece para 4 personas, confirmar que
  `a7f228c` esté publicado.
- Prueba: 14 días del plan Profesional, sin tarjeta (`lib/subscription/plan-state.ts`: `TRIAL_DAYS`,
  `TRIAL_PLAN`). Al vencer queda en solo lectura; no se borra nada (catálogo §3).
- **Usuarios = profesionales que usan el sistema + recepción.** Se cotiza UN plan: el más chico que alcanza.
  No se abre con la lista.
- Re-leer el día de la demo. Si producción pisa el monto (`SUBSCRIPTION_PRICE_<PLAN>_<CICLO>`), manda producción:

```bash
git -C onia-platform fetch origin --quiet
git -C onia-platform show origin/master:lib/subscription-plans.ts | grep -A6 'DEFAULT_PLAN_AMOUNTS:'
git -C onia-platform show origin/master:lib/plan-catalogo.ts | grep -E '^  [a-z]+: \{|users:|patients:|agentsIncluded'
```

### 0.3 Lo que no se dice en ningún rubro

- **Factura o SIAT.** No se nombra (catálogo §7). Si preguntan: «Onia te deja cada cobro registrado, con su
  recibo. La factura la seguís emitiendo como hoy.»
- **Que algo se manda solo por WhatsApp**, ni que «la IA agenda». El mensaje lo manda una persona, desde su WhatsApp.
- **El agente de WhatsApp (chatbot).** Es add-on y no se ofrece hasta su prueba real (catálogo §5). Tampoco al
  cotizar Completo, aunque lo incluya.
- Recordatorio por WhatsApp (hoy es por correo), varias sucursales, uso sin internet, pago con tarjeta.
- Clientes, testimonios o cifras de resultados: hoy hay cero clientes pagando.
- La competencia, ni para compararse. Nada sobre nosotros.
- «Muy pronto», «beta», «próximamente», «estamos trabajando en…». Lo que no está, no se nombra.
- «Por ley tenés que…».

Las capturas de respaldo, por si se cae internet, salen de la misma cuenta demo.

---

## 1. Dental (y estética)

Vocabulario: **pacientes** (estética: **clientas**). A quién: `ONIA_CLIENTE_IDEAL.md` §2, de 2 a 6
profesionales, con recepción.

### 1.1 Lo que trae la cuenta demo (Clínica Dental Sonrisa Norte)

- **Dos profesionales:** Dra. Ana Ríos Peñaranda (dueña) y Dr. Rodrigo Justiniano Vaca, cada uno con su agenda
  de hoy (5 y 3 citas).
- **Mañana a las 10:00:** Martín Arteaga Rojas, «Colocación de corona», sin confirmar.
- **Valeria Montaño Suárez:** endodoncia **en curso** en la pieza 36 («Primera sesión hecha; falta la
  obturación»), corona pendiente, limpieza hecha. Última visita hace 33 días, sin cita por delante.
- **Jorge Quispe:** última visita hace 220 días y un cobro vencido.
- **Cobros de hoy:** los que ya pasaron a la hora del seed (QR, efectivo, uno parcial con saldo).
- **En `/pending`, 4 propuestas:** el de mañana sin confirmar (Martín), el tratamiento a medias (Valeria), la
  reactivación y el cobro (Jorge).

Fuente: `prisma/seed-demo.ts` (`demoDental`, `diaDeClinica`) y `prisma/seed-demo-datos.ts` (`DEMO_DENTAL`,
`TEXTOS_POR_TRACK`). `prisma/seed-demo-datos.test.ts` pasa estos datos por los agentes reales.

### 1.2 Minuto a minuto

**0–3 · Apertura y calificación.** Sin pantalla todavía. Preguntas 1, 2 y 4 de `ONIA_CLIENTE_IDEAL.md` §9:
1. «¿Cuántos profesionales atienden?»
2. «¿Quién agenda las citas?»
3. «¿Cuántos pacientes tienen un tratamiento empezado y no volvieron?»

Anotá los tres números. Si no sabe el tercero, acaba de decir el problema.

**3–5 · El dolor**
- «¿Cuánto cobrás por terminar ese tratamiento?» Anotá el monto.
- «Ese paciente no se fue a otro lado: quedó a la mitad y nadie lo llamó. Te muestro cómo lo ves en Onia.»

**5–8 · La agenda** — `/agenda` (Agenda de hoy)
- Los dos profesionales, cada cita con su nombre. Lo que ya pasó baja a «Ya pasaron».
- En `/appointments` (Citas): **Confirmar**, **Completada**, **No asistió**.
- «Al paciente le llega un correo 24 h y 2 h antes, con un link para confirmar.»

**8–11 · La ficha** — `/patients/[id]` de Valeria Montaño Suárez
- El plan de tratamiento: endodoncia **en curso**, corona pendiente.
- Odontograma, cobros y notas, en sus pestañas.
- «La recepción ve la agenda y la caja, no la historia clínica.»

**11–15 · El momento** — `/pending` (Pendientes). Despacio acá.
- La propuesta de Valeria: dice por qué («a medias, sin venir hace 33 días») y trae el mensaje ya escrito, que
  nombra la endodoncia y lleva el link para que elija horario.
- «Todas las mañanas Onia arma esta lista: el que tiene un tratamiento en curso, lleva tres semanas sin venir y
  no tiene cita.»
- La de Martín: «el de mañana que no confirmó, con el mensaje listo».
- «El que falta o cancela también aparece acá, para reprogramarlo.»
- **Control humano:** «Nada sale sin tu OK. Tocás *Enviar yo mismo por WhatsApp*, se abre el WhatsApp de la
  clínica con el texto y lo mandás vos. Si no te gusta, *Rechazar*.» (No lo aprietes: §0.1.)
- El link de reserva, en otra pestaña: `/book/demo-clinica-sonrisa-norte`. El paciente elige profesional, día y
  hora. Solo con horarios cargados (§0.1); si no, se dice y no se abre.

**15–18 · Plan y precio** (§0.2)
- La cuenta con SUS números, en voz alta: «[N] pacientes a medias × Bs [monto] = Bs [total] parados».
- Un solo plan: hasta 4 usuarios → **Crece**; 5 → **Profesional**; 6 o más → **Completo**.
- «Crece cuesta Bs 550 al mes y trae Pendientes y el link de reserva. ¿Cuántos de esos [N] tienen que volver
  para que se pague?» Que conteste él.
- Si atiende un solo profesional, sin recepción: **Básico**, Bs 320, **sin** Pendientes. No le muestres lo que
  su plan no trae.

**18–20 · Cierre: un próximo paso, con fecha**
- «Creamos tu cuenta ahora: dos minutos en `app.onia.com.bo/register`, 14 días gratis, sin tarjeta.»
- «Si tenés tus pacientes en Excel, los subís guardados como CSV en Pacientes → Importar.»
- «Quedamos el [día, máximo en 7 días] a las [hora], 15 minutos, para mirar juntos tus Pendientes.»
- Lo primero que va a ver: **a la mañana siguiente**, los de mañana sin confirmar; el que falte o cancele,
  para reprogramar.
- **Ojo:** el aviso de tratamiento a medias sale **21 días** después de la última actividad del paciente, y un
  tratamiento cargado hoy cuenta como actividad de hoy. En 14 días de prueba no lo llega a ver: si carga
  tratamientos en curso, podés alargarle la prueba en `/admin/plans` (`ONIA_ADQUISICION_Y_PAUTA.md` §5.4).
- El pago llega al final de la prueba: QR del BCP → comprobante → lo aprobás en `/admin/payments`. Antes del
  primer cobro, mirar `ONIA_CATALOGO_DE_VENTA.md` §6.

### 1.3 Si pregunta

| Pregunta | Respuesta |
|---|---|
| ¿Cuánto cuesta? (antes de la demo) | «Depende de cuántos lo usan. Para [N] profesionales con recepción es Crece, Bs 550 al mes. Dame 20 minutos y te muestro qué hace.» |
| «Está caro» | Volvé a su cuenta. La tarifa no se baja. |
| ¿La lista sale por 15, 30 o 60 días? | «No. El corte es a las tres semanas, y la lista va ordenada por días sin venir.» |
| ¿Me manda un reporte semanal? | «No es un reporte: es la lista de Pendientes, todos los días, con el mensaje escrito.» |
| ¿Exporta a Excel? | «Pacientes y citas en CSV, que se abre en Excel. En PDF, no.» |
| ¿Y si se corta internet? | «Está en la nube: si se cae el wifi, seguís desde el celular con datos. Sin ninguna conexión no se puede usar.» |
| ¿Mis datos? | «Cada uno ve lo suyo: la recepción no ve la historia clínica. Tus datos los exportás cuando quieras.» |
| ¿Factura? | §0.3. |

### 1.4 Pruebas en el código

| Lo que se muestra | Dónde está (`origin/master` `a7f228c`) |
|---|---|
| Agenda de hoy con varios profesionales y «Ya pasaron» | `app/(dashboard)/agenda/AgendaClient.tsx` (`variosProfesionales`) |
| Confirmar · Completada · No asistió | `app/(dashboard)/appointments/AgendaClient.tsx` (`cambiarEstado`) |
| Correo 24 h y 2 h antes, con link para confirmar | `app/api/cron/appointment-reminders/route.ts` (`ensureConfirmToken`) |
| Ficha: plan de tratamiento, odontograma (solo dental), cobros, notas | `app/(dashboard)/patients/[id]/FichaVista.tsx`; `patients/[id]/odontogram` |
| Recepción sin historia clínica | `lib/onia-core/roles.ts` (`recepcion` sin `clinical.read`) |
| Tratamiento a medias: en curso, 21 días sin venir, sin cita por delante; dental y estética | `lib/onia-core/modules/agents-tratamiento-a-medias.ts` (`TRATAMIENTO_A_MEDIAS_DIAS = 21`, `RUBROS`) |
| El que canceló o no vino en los últimos 14 días, sin otra cita | `lib/onia-core/modules/agents-reprogramador.ts` (`REPROGRAMAR_VENTANA_DIAS = 14`) |
| Citas de mañana sin confirmar | `lib/onia-core/modules/agents-logic.ts` (`evaluateConfirmacionCandidates`) |
| Reactivación a los 180 días; cobro vencido | `agents-runtime.ts` (`AGENT_KINDS.recall.recallAfterDays = 180`); `agents-logic.ts` (`evaluateCollectorCandidates`) |
| Corren solos, una vez al día, 07:00 de La Paz | `agents-runtime.ts` (`intervalMinutes: 1440` y la nota del Reprogramador) |
| Nada sale sin OK humano | `lib/onia-core/modules/agents-config.ts` (`draft_message`, `send_message`: `requiresApproval: true`) |
| Sale desde el WhatsApp de la clínica: link + «Ya lo envié» | `lib/onia-core/dispatch/envio-manual.ts`; `app/(dashboard)/pending/pending-client.tsx` |
| Link de reserva: profesional, día y hora (con horario cargado) | `app/(public)/book/[orgSlug]/page.tsx`; `app/api/booking/doctors/route.ts` |
| Agentes y reserva desde Crece; usuarios por plan; CSV desde Básico | `lib/plan-catalogo.ts` (`agentsIncluded`, `publicBookingIncluded`, `users`, `csvExportEnabled`); `app/api/settings/export/route.ts` |
| Importar pacientes por CSV | `app/(dashboard)/patients/import/page.tsx` |
| Prueba de 14 días, y alargarla | `lib/subscription/plan-state.ts`; `app/(dashboard)/admin/plans/PlansClient.tsx` |

### 1.5 Estética: lo que cambia

- **Clientas** y **tratamientos**; sin odontograma (`lib/onboarding/vocabulario.ts`; `FichaVista.tsx`).
- El tratamiento a medias aplica igual (`RUBROS` incluye estética).
- **Ojo: la cuenta demo «Estética Lumina» no trae** tratamiento a medias, segundo profesional ni cita de mañana:
  eso lo siembra solo la demo dental (`demoDental`). En su `/pending` salen la reactivación y el cobro de
  Andrea Terceros Vaca. **Antes de la primera demo de estética, pedirle a Plataforma** que el seed le sume esas
  tres cosas. Mientras tanto, el momento de `/pending` se cuenta con la ficha y la lista, sin la tarjeta.
- No se promete: paquetes o bonos de sesiones, fotos de antes y después, comisión por profesional, cabinas.

---

## 2. Importadora

Solo **costeo de importación** y **alerta de reprecio**. **Las cotizaciones no salen del sistema: no se muestran
ni se prometen.** Vocabulario: **clientes**. A quién: la PYME de Santa Cruz que compra en dólares, vende en
bolivianos y costea en Excel (`ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md` §2.1).

### 2.1 Lo que trae la cuenta demo (Importadora Eléctrica Andina)

- 4 productos: cable THW 12 AWG, breaker de 20 A, luminaria LED de 150 W, tablero de 12 polos. Depósito Central.
- **Un costeo aplicado al cable:** FOB USD 1.000, 80 rollos, flete 100, seguro 20, despacho 80, GA 10 %, TCO 11,37.
- También trae cotizaciones, y el Inicio las muestra: **dejá abierto `/importadora/costeo` antes de compartir pantalla.**

Fuente: `lib/importadora/demo-seed.ts` (`PRODUCTS`, `COSTEO_DEMO`), llamado desde `prisma/seed-demo.ts`.

### 2.2 Minuto a minuto

**0–3 · Calificación**
1. «¿Compran en dólares y venden en bolivianos?»
2. «¿Cómo sacan hoy el costo de cada producto?» Excel es la señal buena.
3. «Cuando se mueve el dólar, ¿cada cuánto rehacen los precios?»

Dicho de frente: si vende en dólares, cotiza con PDF o precio por cliente, o factura cada venta, **hoy no le calza**.

**3–5 · El dolor**
- «El precio que pusiste con el dólar de hace tres meses puede estar hoy debajo de lo que te cuesta reponerlo.
  ¿Cómo te enterás?»

**5–12 · El costeo** — `/importadora/costeo`
- Un embarque en vivo con un producto suyo (o con el cable): FOB, cantidad, flete, seguro, despacho, el GA de su
  subpartida y **el TCO del BCB del día, que lo escribe él**.
- «+ Agregar línea»: un contenedor trae productos distintos. Los gastos comunes se reparten por FOB, peso o volumen.
- Sale el costo unitario en Bs. El IVA de importación va aparte, como crédito fiscal: no entra al costo.
- «Aplicar al catálogo» guarda el costo de cada producto y, si ponés uno, el precio de venta.

**12–15 · La alerta de reprecio** — `/importadora/reprecio`
- Escribí un TCO (el del día, o el que él espera) y mirá qué productos quedan **debajo de lo que cuesta reponerlos**.
- «Es una alerta: no cambia ningún precio. Para repreciar, rehacés el costeo.»

**15–16 · Control humano**
- «El tipo de cambio lo ponés vos: el sistema no lo inventa ni te propone precios. Y el precio de venta lo
  cambia solo quien tiene el permiso de cambiar precios.»

**16–18 · Plan y precio** (§0.2)
- El costeo y la alerta vienen en **todos los planes**. El plan lo decide cuántas personas usan el sistema:
  hasta 2 → Básico; 3 o 4 → Crece; 5 → Profesional; 6 o más → Completo.

**18–20 · Cierre**
- «Creamos tu cuenta ahora, 14 días gratis. Subís tu catálogo por CSV en Importar catálogo y costeás tu próximo
  embarque con el TCO del día.»
- «Te llamo el [día] a las [hora] para mirar juntos ese primer costeo.»

### 2.3 Si pregunta

| Pregunta | Respuesta |
|---|---|
| ¿Mando la cotización desde el sistema? | «No. La cotización se arma y se lleva su estado, pero no sale del sistema.» |
| ¿Precio por cliente? ¿Vender en dólares? | «No: una lista de precios, en bolivianos.» |
| ¿El costeo carga el stock? ¿Costo por lote? | «No. Es el costo por producto del último embarque. El stock se carga aparte.» |
| ¿Factura? | §0.3. |

### 2.4 Pruebas en el código

| Lo que se muestra | Dónde está |
|---|---|
| Costeo: valor en aduana (DS 5646), GA, IVA de importación como crédito, TCO escrito a mano | `lib/importadora/costeo.ts` (`computeCosteo`, `importVatBob`); `lib/onia-core/modules/imports-logic.ts` |
| Varias líneas; reparto por FOB, peso o volumen | `app/(dashboard)/importadora/costeo/CosteoForm.tsx` («+ Agregar línea», peso, volumen) |
| «Aplicar al catálogo»: costo y precio de venta | `CosteoForm.tsx`; `costeo.ts` (`metadata.landedCost`) |
| Precio de venta solo con «Cambiar precios» | `CosteoForm.tsx` (`prices.write`) |
| La alerta: solo lectura, no propone precio, TCO escrito | `app/(dashboard)/importadora/reprecio/page.tsx` |
| En todos los planes | `app/api/importadora/costeo/route.ts` (solo pide plan vigente) |
| Importar catálogo por CSV | `lib/platform/vertical-pack.ts` (acción «Importar catálogo» → `/comercio/importar`) |

---

## 3. Comercio y servicios

> **No se agenda demo hasta que Plataforma confirme que la 1.0 deja editar producto, precio y stock (comercio)
> y que la agenda es de más de un profesional en los planes bajos (servicios).**
>
> **Lo que dice el código (1-oct, `origin/master` `a7f228c`):** las dos cosas están, también en `4dc829e`, el
> release de producción que anota el catálogo. Es lectura de código, **no se miró en pantalla**: la confirmación
> de Plataforma sigue haciendo falta.
> - **Comercio:** «Editar» (nombre, SKU, precio, punto de reorden, activo) en
>   `app/(dashboard)/comercio/EditarProducto.tsx` → `PATCH app/api/comercio/products/[id]/route.ts`. «Ajustar
>   stock» (entrada, salida, corrección por conteo) en `app/(dashboard)/comercio/AjustarStock.tsx` →
>   `POST app/api/comercio/movements/route.ts`. Están en Catálogo y en Inventario (`CatalogoLista.tsx`,
>   `inventario/StockFilas.tsx`). Commits `30f6fd3`, `4fd669f` y `eeefcc5`, del 29-sep.
> - **Servicios:** el equipo ofrece el rol «Profesional», con agenda propia, en todos los planes
>   (`lib/onboarding/vocabulario.ts`, `ROLES_SERVICIOS`; `lib/agenda/roles-agenda.ts`; test
>   `lib/agenda/profesional-con-agenda-por-rubro.test.ts`). Commit `aa5ec96`, del 29-sep.

En comercio y servicios la factura se pregunta antes. Si factura cada venta o cada servicio: §0.3, y muchas
veces **hoy no le calza**.

### 3.1 Comercio

Vocabulario: **clientes**.

**La cuenta demo (Ferretería El Carmen):** 6 productos (cemento, clavos, tubo PVC, taladro, pintura, guantes),
ventas de los últimos 8 días y las de hoy hasta la hora del seed, dos fiados (Doña Carmen Flores, al día; Maestro
Julio Choque, vencido hace 10 días) y una compra a crédito. En `/pending`, el cobro del fiado vencido. Fuente:
`lib/comercio/demo-seed.ts` y `prisma/seed-demo.ts` (`diaDeMostrador`).

**0–3 · Calificación**
1. «¿Cuántas personas atienden el mostrador?»
2. «¿Venden fiado? ¿Cómo lo anotan?»
3. «¿Cómo saben hoy cuánto stock les queda?»
4. «¿Facturan cada venta?» Si dice que sí: §0.3.

**3–5 · El dolor**
- «El fiado que nadie cobra, y el stock que no cuadra a fin de mes.»

**5–13 · Las pantallas**
- `/comercio/caja`: una venta en vivo. Descuenta el stock y deja el recibo.
- `/comercio` (Catálogo): «Editar» un precio y «Ajustar stock» con una entrada.
- `/comercio/inventario`: el stock, lo que vale y sus movimientos.
- `/comercio/fiados`: el de Maestro Julio Choque, vencido.

**13–15 · Control humano** — `/pending`
- El cobro del fiado vencido, con el mensaje escrito. «Nada sale sin tu OK.» (No lo aprietes: §0.1.)
- «Tu empleado cobra y carga stock; el precio lo cambia solo quien tiene el permiso.»

**15–18 · Plan y precio** (§0.2): por personas que usan el sistema. Desde Crece, el cobro de fiados vencidos
aparece en Pendientes.

**18–20 · Cierre:** cuenta hoy; catálogo por CSV en `/comercio/importar`; llamada con fecha.

| Lo que se muestra | Dónde está |
|---|---|
| Editar producto y precio; el precio pide «Cambiar precios» | `app/(dashboard)/comercio/EditarProducto.tsx`; `app/api/comercio/products/[id]/route.ts` (`prices.write`) |
| Ajustar stock | `app/(dashboard)/comercio/AjustarStock.tsx`; `app/api/comercio/movements/route.ts` |
| Venta que descuenta stock, y su recibo | `lib/comercio/ventas.ts` (`registrarVenta`); `lib/comercio/recibo.ts`; `app/print/recibo-venta/[paymentId]` |
| Fiados y su cobro en Pendientes | `app/(dashboard)/comercio/fiados`; `agents-runtime.ts` (`COMERCIO_TRACKS`: el agente de cobros cobra fiados) |

### 3.2 Servicios profesionales

Vocabulario: **clientes** (empresas) y **reuniones**.

**La cuenta demo (Estudio Contable Ribera):** clientes que son empresas (Ferretería San Jorge SRL, Transportes
Yacuma SRL, Panadería La Espiga, Import. Andina del Este SRL), 5 reuniones hoy, servicios (declaración mensual de
IVA, estados financieros, trámite de NIT, asesoría por hora), cobros de hoy y un pendiente «Pedir documentación
del mes». En `/pending`, la reactivación y el cobro de Transportes Yacuma SRL. **Ojo: trae un solo profesional y
ninguna reunión de mañana**; para mostrar al segundo profesional, pedirle a Plataforma que lo sume al seed.
Fuente: `prisma/seed-demo-datos.ts` (`TEXTOS_POR_TRACK`, `CLIENTES_POR_TRACK`, `CATALOGO_POR_TRACK`).

**0–3 · Calificación**
1. «¿Cuántos profesionales atienden con reunión?»
2. «¿Quién agenda?»
3. «¿Cómo le piden los papeles del mes a cada cliente?»
4. «¿Facturan cada servicio?» Si dice que sí: §0.3.

**3–5 · El dolor**
- «El cliente que no manda los papeles a tiempo, y perseguirlo por WhatsApp.»

**5–13 · Las pantallas**
- `/agenda`: las reuniones de hoy. `/team`: el rol «Profesional», con agenda propia.
- `/requerimientos`: pedile un documento a un cliente → «Copiar link del portal». El cliente lo sube desde ese
  link, sin crear cuenta.
- La ficha del cliente: lo que se le cobró.

**13–15 · Control humano** — `/pending`: la reactivación y el cobro, con el mensaje escrito. «Nada sale sin tu OK.»

**15–18 · Plan y precio** (§0.2): por personas. Desde Crece, Pendientes y el link de reserva. En servicios no hay
Reportes ni Cobros recurrentes en ningún plan: no los nombres.

**18–20 · Cierre:** cuenta hoy; llamada con fecha.

| Lo que se muestra | Dónde está |
|---|---|
| Profesional con agenda propia, en todos los planes | `lib/onboarding/vocabulario.ts` (`ROLES_SERVICIOS`); `lib/agenda/roles-agenda.ts` |
| Pedir documentos con un portal, sin cuenta | `app/(dashboard)/requerimientos/requerimientos-client.tsx` («Copiar link del portal»); `app/(public)/portal/[token]/page.tsx` |
| Cobros en la ficha del cliente | `app/(dashboard)/patients/[id]/page.tsx` (`cobrosDeLaFicha`) |
| Qué agentes corren en servicios | `lib/onia-core/modules/agents-por-rubro.ts` (`rolCorreEnTrack`) |
| Sin Reportes ni Recurrentes | `lib/platform/vertical-pack.ts` (`SERVICIOS_NAV_ITEMS`) |

---

## 4. Después de la demo

- **El mismo día**, una fila en el registro de objeciones, con sus palabras textuales:
  - dental → `hermes-content/docs/ONIA_PROSPECTOS_DENTAL_SCZ.md` §7;
  - estética, importadora, comercio y servicios → `hermes-content/docs/ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md`,
    «Registro de objeciones de las demos» (al final del archivo).
- Lo que pidió y la 1.0 no hace va a esa fila, no a una promesa.
- La regla del registro: si tras 10 demos nadie quiere pagar, se cambia el producto, no el discurso.
