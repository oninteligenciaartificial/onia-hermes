# Lo que se promete contra lo que funciona

> **Doc vivo, sin fecha: se EDITA.** Decide cuándo se vuelve a contactar a prospectos y leads. Nace del 8-oct:
> Sergio Urcullo, por la madre: *«no vamos a escribirle a nadie aún porque no sé si el producto ya es funcional ni si
> prometemos lo que vamos a vender»*. Fuentes de las promesas: la web renderizada el 8-oct (`onia.com.bo`, 13
> páginas), `/login` y `/register` de la app, `ONIA_CATALOGO_DE_VENTA.md` y los 7 mensajes de
> `ONIA_PROSPECTOS_DENTAL_SCZ.md` §6.9. El código se leyó en `onia-platform` `master` `b2d9d31` (8-oct). El código no
> prueba que algo funcione: solo dice qué buscar.

## 1. Veredicto (8-oct)

**Hoy no se contacta a nadie.** Hay tres condiciones, en este orden:

1. **Sacar de la web lo que el catálogo no deja prometer** (§3). Es texto, lo publica Plataforma.
2. **Ver con una cuenta de prueba las 11 promesas que usan los mensajes** (§2). Hoy no hay cuenta, así que todas
   están sin verificar.
3. **La cuenta demo con datos** (plan 1.0, punto 9). Sin ella no se puede ofrecer «20 minutos con una clínica de
   ejemplo».

Con las tres en verde, se contacta con los mensajes de la §6.9 tal como están.

**Estado de las 101 promesas:** ✅ visto: 19 · 🟡 a medias: 7 · ❌ no se puede prometer hoy: 13 · 🚫 fuera de la oferta: 7 · ⬜ sin verificar: falta la cuenta: 48 · ⬜ sin verificar: corre solo, falta el log del VPS: 7.

## 2. La compuerta: lo que prometen los mensajes de la §6.9

| # | Promesa | Estado | Qué hace falta |
|---|---|---|---|
| B-01 | Agenda del día con paciente, hora, tratamiento, teléfono y profesional | ⬜ sin verificar: falta la cuenta | Mirarlo con la cuenta: `/agenda` → crear cita (paciente, tratamiento, profesional, hora) → aparece en la agenda del día en la columna del profesional con hora, tratamiento y teléfono; en comercio e importadora no hay agenda |
| B-02 | Cada cita muestra su estado de confirmación (confirmada / sin confirmar / llamar) | ⬜ sin verificar: falta la cuenta | Mirarlo con la cuenta: `/agenda` → una cita nueva queda sin confirmar → marcarla confirmada cambia el estado visible; cancelar y «no asistió» también quedan registrados |
| C-02 | Odontograma en la ficha | ⬜ sin verificar: falta la cuenta | Mirarlo con la cuenta: Ficha de un paciente dental → odontograma → marcar una pieza con estado/tratamiento → guardar y recargar: persiste; en cuenta estética o servicios no aparece |
| D-01 | Catálogo de tratamientos/servicios con precio | ⬜ sin verificar: falta la cuenta | Mirarlo con la cuenta: `/treatments` → crear tratamiento con precio → disponible al crear una cita y al cobrar |
| E-01 | Registrar cobros por paciente o venta, con saldo | ⬜ sin verificar: falta la cuenta | Mirarlo con la cuenta: `/billing/new` → cobro (paciente, concepto, monto, método) → pago parcial → queda saldo → aparece en el listado |
| G-01 | Los agentes proponen y nada sale sin tu aprobación | ⬜ sin verificar: falta la cuenta | Mirarlo con la cuenta: `/pending` → propuesta con Aprobar/Descartar; sin aprobar, comprobar que no sale ningún correo ni se abre WhatsApp ni queda registro de envío; al aprobar queda lista para enviar |
| G-06 | Agente «Confirma citas»: citas de mañana sin confirmar, y avisa con un día de margen | ⬜ sin verificar: falta la cuenta | Mirarlo con la cuenta: Cita de mañana sin confirmar → propuesta en `/pending`; una ya confirmada no genera propuesta |
| G-07 | Agente «Reprograma»: quien faltó o canceló y no tiene otra cita (no reserva) | ⬜ sin verificar: falta la cuenta | Mirarlo con la cuenta: Cita cancelada o «no asistió» sin cita posterior → propuesta; el texto no fija horario y no crea ninguna cita |
| G-08 | Agente «Recuerda cobros»: saldos vencidos, sin cobrar por vos | ⬜ sin verificar: falta la cuenta | Mirarlo con la cuenta: Cobro con saldo vencido → propuesta en `/pending` con el monto reemplazado; al aprobar no se cobra nada |
| G-11 | La IA propone el texto de cada recordatorio; el dueño lo aprueba una sola vez | ⬜ sin verificar: falta la cuenta | Mirarlo con la cuenta: `/agents` → plantilla de un agente → pedir texto con IA → aparece un texto en el tono del negocio → aprobarlo una vez → `/pending` usa esa plantilla; el contador de cupo baja; en Básico no está el botón |
| L-05 | Demo de 20 minutos con una clínica de ejemplo | ❌ no se puede prometer hoy | La cuenta demo con datos |

## 3. Lo que la web promete y el catálogo no deja (arreglo de texto, Plataforma)

> **Vuelto a mirar el 11-oct (05:20-05:45 UTC), renderizado, sin sesión:** las 14 páginas de `onia.com.bo` a 390 y 1440 px y
> `/login` y `/register` (paso 1 y paso 2, sin enviar nada) de la app. Barrido completo con el texto de cada página:
> `research/promesas-web/2026-10-11/barrido-onia-com-bo.json` y `barrido-app-register-login.json`. Script: `research/qa-publicacion/2026-10-11/mirar-publico.mjs`.
> Resultado: **8 de las 9 filas siguen igual; 1 cambió** (`/register` paso 1 ya es de usted). El catálogo no se tocó desde el 2-oct.

| Dónde | Qué dice la web | Por qué no se puede | Arreglo | **11-oct** |
|---|---|---|---|---|
| `/chatbot`, `/precios`, `/`, `/contacto` | Agente de WhatsApp que «responde las 24 horas», Bs 390/mes e incluido en Completo | Catálogo §5: ⏸, nunca se conectó el WhatsApp de un cliente | Sacarlo de la venta hasta la prueba real (catálogo §6.4), o dejarlo como «a pedido» sin promesa de funcionamiento. Lo decide Sergio Urcullo | **Sigue.** `/chatbot`: «Tu WhatsApp responde las 24 horas.»; `/`: «Tu agente conversacional responde por WhatsApp…»; `/precios`: Bs 390/mes e incluido en Completo; `/contacto` solo lo enlaza en el pie. [`chatbot-1440.png`](research/promesas-web/2026-10-11/chatbot-1440.png), [`home-1440.png`](research/promesas-web/2026-10-11/home-1440.png) |
| `/rubros`, tarjeta Estética | «La clienta que dejó el tratamiento a medias: te queda el mensaje escrito…» | Catálogo §8 (2-oct): el detector existe pero no encuentra a nadie. El gate de la web (3-oct) sí deja decir el mecanismo, así que **las dos fuentes se contradicen**. #108 (4-oct) cargó «A medias», pero nadie lo vio encontrar a un paciente en producción | Sacar esa línea hasta que Plataforma lo vea funcionar en la cuenta demo; después, alinear el catálogo §8 y el gate | **Sigue.** Aparece tres veces en `/rubros`: dos tarjetas de Estética («…para que reserve» y «…para que vuelva a reservar») y una línea de «Al día» («Sabés qué clienta dejó el tratamiento a medias.»). [`rubros-1440.png`](research/promesas-web/2026-10-11/rubros-1440.png) |
| `/precios`, plan Completo | Completo = Profesional + el agente de WhatsApp | Lo mismo que la primera fila | Mientras el agente esté en pausa, Completo se vende por «sin topes» | **Sigue.** «Agente conversacional de WhatsApp incluido (500 conversaciones/mes)». [`precios-1440.png`](research/promesas-web/2026-10-11/precios-1440.png) |
| `/comparativa` | Nombra competidores y sus precios | `CLAUDE.md` (Sergio Urcullo, 3-sep): cero autobombo, nada sobre la competencia | Decidir si se baja | **Sigue.** Nombra Dentiqa, Doctocliq y Clinera.io con sus precios al 30-jul. [`comparativa-1440.png`](research/promesas-web/2026-10-11/comparativa-1440.png) |
| `/servicios/webs` | Webs a medida desde Bs 2.000 | No es parte del producto: falla el test de tres preguntas (estrategia §10) | Decidir si se baja | **Sigue.** Bs 2.000 y 4.500 pago único, y planes de Bs 190, 390 y 690 al mes. [`servicios-webs-1440.jpg`](research/promesas-web/2026-10-11/servicios-webs-1440.jpg) |
| `/precios` | Usuarios extra «en Crece y Profesional» | El código lo permite en todos los planes, pero lo carga un superadmin a mano | Decir «a pedido» | **Sigue.** «En Básico se pueden sumar hasta 3; en Crece y Profesional, las que necesites.» |
| `/contacto` contra los mensajes | Demo de 30 min contra 20 min | Dos duraciones | Unificar | **Sigue.** `/contacto`: «30 MINUTOS · SIN COMPROMISO»; `ONIA_PROSPECTOS_DENTAL_SCZ.md` §6.9: «demo de 20 minutos». [`contacto-1440.png`](research/promesas-web/2026-10-11/contacto-1440.png) |
| `/register` | Paso 1 de vos («tenés»); paso 2 de usted («Cree su cuenta»), pero con «Nombre de tu clínica» | Mezcla de vos y usted en el mismo flujo | Elegir uno (decide Sergio Urcullo: los mensajes ya van de usted) | **Cambió, queda un resto.** El paso 1 ya es de usted («¿Qué tipo de negocio tiene?», «Escríbanos»). El paso 2 sigue con «Nombre de tu clínica». Causa: `SignupForm.tsx:630` usa `voc.negocio` en vez de `voc.negocioSu` (y lo mismo en `:362` y `:403`, las pantallas de carga). Contrato Codex: `handoff/codex-tareas/Q9-alta-de-usted.md`. [`register-paso1-390.png`](research/promesas-web/2026-10-11/register-paso1-390.png), [`register-paso2-390.png`](research/promesas-web/2026-10-11/register-paso2-390.png) |
| `ONIA_CATALOGO_DE_VENTA.md` §5 contra §8 | §5: el agente de WhatsApp «entiende fotos y audios»; §8: no se puede decir | El catálogo se contradice | Corregir el §5 | **Sigue** (línea 80 contra línea 131; el archivo no cambia desde el 2-oct) |

**Filas nuevas del 11-oct**

| Dónde | Qué pasa | Dueño |
|---|---|---|
| Las 13 páginas de `onia.com.bo` contra el alta de la app | La web habla de vos o de tú de punta a punta («Creá tu cuenta», «tu negocio», «vos aprobás») y el clic lleva a un alta de usted («Su negocio completo, en un solo sistema», «Pruebe el plan Profesional»). Es el mismo flujo con dos tratos. `CLAUDE.md`: «si la web y los anuncios pasan a usted, lo decide él». `/terminos` y `/privacidad` también están en vos, y los textos legales van por Leslie Mercado Moreno | Sergio Urcullo decide; después, web-factory |
| `public/manifest.json:4` | La descripción de la app instalable dice «El sistema con IA que maneja tu negocio». La corrección de títulos (onia-platform#146) no lo toca, y su gate solo mira `app/layout.tsx` y el portal. #136 reescribe ese archivo y deja la línea igual | Plataforma (una línea más en #146) |
| Pestaña de `/login` y `/register` | Hasta que se publique onia-platform#146, la pestaña dice «…que maneja tu negocio en Bolivia». Medido a las 05:18 UTC en producción, con el build `webpack-2a706587264c6b91.js` | Plataforma (ya tiene el PR) |

**Lo que no sigue en la lista.** Ninguna página pública dice «muy pronto», «próximamente», «beta» ni «en construcción». Las palabras «borrador» que aparecen en `/privacidad` y `/terminos` hablan de los borradores que propone la IA, no de obra. `/login`, `/register` y `/book` tampoco.

### 3.1 Los precios de la web contra los del código (11-oct)

Fuentes del código: `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`) y `lib/pricing.ts`, de `master` `d8ca5a32`. Web: `/precios`, `/` y `/chatbot` renderizados. **No hay ninguna diferencia.**

| Plan | Mensual (web / código) | Anual (web / código) | Semanal (web / código) |
|---|---|---|---|
| Básico | 320 / 320 | 3.200 / 3.200 | 89 / 89 |
| Crece | 550 / 550 | 5.500 / 5.500 | 145 / 145 |
| Profesional | 890 / 890 | 8.900 / 8.900 | 229 / 229 |
| Completo (`clinic`) | 1.290 / 1.290 | 12.900 / 12.900 | no existe / no existe |
| Grupo (`enterprise`) | 2.900 / 2.900, implementación desde 3.500 / `setupFrom: 3500` | no se vende en línea / 29.000 | no existe |

| Add-on | Web / código |
|---|---|
| Agente de WhatsApp | Bs 390/mes y Bs 3.900/año / `entryMonthly: 390`, `annualTotal: 3900` |
| 200 conversaciones más | Bs 190, valen hasta fin de mes / `precio: 190` |
| Reservas online en Básico | Bs 150/mes / `BOOKING_ADDON_PRICE.monthly: 150` |
| Usuario extra | Bs 70/mes / `EXTRA_USER_ADDON_PRICE.monthly: 70` |

Topes que la web escribe y el código confirma (`lib/plan-catalogo.ts`): Básico 300 fichas, 2 usuarios, 200 recordatorios; Crece 800 · 4 · 400; Profesional 1.500 · 5 · 800; Completo sin tope. Capturas: [`precios-1440.png`](research/promesas-web/2026-10-11/precios-1440.png), [`chatbot-1440.png`](research/promesas-web/2026-10-11/chatbot-1440.png), [`home-1440.png`](research/promesas-web/2026-10-11/home-1440.png).
Fuera de estas dos fuentes quedan las webs a medida de `/servicios/webs` (Bs 2.000, 4.500, 190, 390, 690): no están en `subscription-plans.ts` ni en `pricing.ts`, y ya figuran arriba como «decidir si se baja».
No se pudo comparar `/checkout` (pide sesión): lo hace Q5 (#194) cuando entre.

## 4. Cómo se verifica lo que falta

- **Con cuenta de prueba:** `node .claude/skills/onia-ventas-pauta/scripts/auditar-app.mjs <carpeta>`, con
  `ONIA_QA_EMAIL` y `ONIA_QA_PASSWORD` en el entorno. Es solo lectura: captura cada pantalla y deja la URL final,
  el tiempo de carga y los errores de consola. Con eso se completa la columna «Estado» de las filas ⬜ «falta la
  cuenta».
- **Lo que corre solo** (⬜ «falta el log»): lo mide la PC en el VPS, con los logs del cron de agentes,
  recordatorios y facturas recurrentes.
- **Público, ya visto el 8-oct:** las 13 páginas de la web, `/login`, `/register` (paso 1 y paso 2, sin enviar) y
  `/book`. Todas respondieron 200 en menos de 5 s, y los iconos se ven bien.

## 5. Las {len(rows)} promesas

Estados: ✅ visto (en pantalla o en el código, cuando es un dato comercial) · 🟡 a medias · ❌ no se puede prometer
hoy · 🚫 fuera de la oferta · ⬜ sin verificar. El inventario completo, con la frase textual y el paso de
verificación de cada una, está en `ONIA_PROMESA_VS_PRODUCTO_INVENTARIO.md`.

| # | Capacidad | Dónde aparece | Estado | Prueba | Qué hace falta |
|---|---|---|---|---|---|
| A-01 | Alta autoservicio: la cuenta se crea sola, sin hablar con nadie | /empezar, /, /precios, /nosotros, /contacto, APP /register, APP /login, CAT §1 | 🟡 a medias | `/register`: los 2 pasos se ven (8-oct). No se creó cuenta | Crear una cuenta de prueba y mirar que entra al panel del rubro (Plataforma) |
| A-02 | Se elige entre exactamente 5 rubros en el primer paso | /empezar, /rubros ("Cinco rubros vivos y vendibles hoy."), /nosotros, APP /register, CAT §2 | ✅ visto | `/register` paso 1: los 5 rubros | — |
| A-03 | La cuenta viene armada con pantallas, palabras y agentes del rubro | /rubros, /empezar ("pantallas, vocabulario y agentes a tu medida"), /, APP /register ("Pantallas, palabras y agentes de tu rubro."), CAT §2 y §4 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Crear una cuenta por rubro → menú lateral y etiquetas: dental «Pacientes», estética «Clientas», comercio sin `/agenda`, importadora con `/importadora/cotizaciones`, servicios sin datos clínicos |
| A-04 | Prueba de 14 días sin tarjeta | /, /precios, /empezar, /nosotros, /agentes, APP /login, APP /register, CAT §1 y §3 | ✅ visto | `/register` paso 2: el formulario no pide tarjeta | — |
| A-05 | La prueba es el plan Profesional completo, cuenta real, todo encendido | /empezar ("Todo encendido: caja, contabilidad, la cola de agentes, el inventario si manejás stock y la agenda si trabajás con citas."), /, /precios, APP /login, CAT §3 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Cuenta nueva → abrir `/billing`, `/contabilidad`, `/rrhh`, `/reports`, `/agents`, `/inventory`, `/agenda`, reservas online: ninguno bloqueado; topes = Profesional (1.500 fichas, 5 usuarios, 800 recordatorios) |
| A-06 | Al vencer la prueba: 1 día de gracia y luego solo lectura, sin borrar nada | /precios, /empezar, CAT §3 | ⬜ sin verificar: corre solo, falta el log del VPS | — | Una cuenta con la prueba vencida |
| A-07 | 30 días para llevarse los datos en CSV después de la prueba | /empezar, /precios, /nosotros | ⬜ sin verificar: corre solo, falta el log del VPS | — | Una cuenta con la prueba vencida |
| A-08 | Si la prueba no sirve, no se paga nada | /empezar, /nosotros, APP /login ("Si no te sirve, no pagás nada."), CAT §1 | ✅ visto | Sin tarjeta no hay cobro posible | — |
| A-09 | La cuenta llega con la configuración del rubro y el sistema guía la puesta en marcha paso a paso | /empezar, APP /login ("Activación acompañada"), APP /register | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Primera entrada a la cuenta nueva → `/setup`: pasos del rubro con progreso, defaults del rubro ya cargados |
| A-10 | Sin instalación: se usa desde el navegador | /empezar, /chatbot ("sin instalación", se refiere al agente) | ✅ visto | App web, abre en el navegador | — |
| A-11 | Cargar los datos del negocio pegando el link de la web propia | CAT §8 (frase 6) | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/setup` (o `/settings`) → pegar URL de una web propia → campos nombre, teléfono, dirección, horarios y servicios precargados; con URL de Facebook no |
| A-12 | Correos automáticos de la prueba y avisos de renovación | CAT §2 | ⬜ sin verificar: corre solo, falta el log del VPS | — | Log del cron |
| B-01 | Agenda del día con paciente, hora, tratamiento, teléfono y profesional | /rubros, /precios ("agenda si trabajás con citas"), /agentes, APP /register, CAT §2 y §4 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/agenda` → crear cita (paciente, tratamiento, profesional, hora) → aparece en la agenda del día en la columna del profesional con hora, tratamiento y teléfono; en comercio e importadora no hay agenda |
| B-02 | Cada cita muestra su estado de confirmación (confirmada / sin confirmar / llamar) | /agentes, /rubros (maqueta con «Confirmada» y «Llamar»), CAT §2 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/agenda` → una cita nueva queda sin confirmar → marcarla confirmada cambia el estado visible; cancelar y «no asistió» también quedan registrados |
| B-03 | Recordatorio de cita por correo 24 h y 2 h antes, automático | CAT §2, /precios (tope de «recordatorios por email/mes»), /rubros Estética ("agenda y recordatorios") | ⬜ sin verificar: corre solo, falta el log del VPS | — | Log del cron de recordatorios por correo |
| C-01 | Ficha de paciente/cliente | /precios (Básico), /, /rubros, APP /register, CAT §4 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/patients` → Nuevo → nombre, teléfono, correo → guardar → aparece en el listado y la ficha abre con sus citas y cobros |
| C-02 | Odontograma en la ficha | PRO §6.9, /rubros ("Pacientes, tratamientos, odontograma y agenda con el profesional de cada cita."), CAT §2 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Ficha de un paciente dental → odontograma → marcar una pieza con estado/tratamiento → guardar y recargar: persiste; en cuenta estética o servicios no aparece |
| C-03 | Historia clínica en la ficha | CAT §2 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Ficha → historia clínica → agregar antecedente o nota → persiste; en cuenta de servicios no hay campos clínicos |
| D-01 | Catálogo de tratamientos/servicios con precio | PRO §6.9, /rubros, APP /register (dental, estética, servicios), CAT §4 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/treatments` → crear tratamiento con precio → disponible al crear una cita y al cobrar |
| D-02 | Seguimiento de tratamientos en curso por clienta (Al día / No volvió) | /rubros Estética (maqueta «Tratamientos en curso»: «Al día», «No volvió») | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Ficha → asignar un tratamiento de varias sesiones y dejarlo «En progreso» → vista de tratamientos en curso muestra «Al día» o «No volvió» según la última sesión. **Ver contradicción 1.** |
| D-03 | Mensaje listo con link de reserva para la clienta que dejó el tratamiento a medias | /rubros (tarjeta Estética y vocabulario), CAT §2 (agente «Tratamiento a medias» en dental y estética) | ❌ no se puede prometer hoy | Catálogo §8: el detector no encuentra a nadie | Sacarlo de `/rubros` (Estética) o arreglar el detector y verlo en la cuenta demo |
| E-01 | Registrar cobros por paciente o venta, con saldo | /precios, /, PRO §6.9 ("tratamientos y cobros"), CAT §4 (`/billing`) | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/billing/new` → cobro (paciente, concepto, monto, método) → pago parcial → queda saldo → aparece en el listado |
| E-02 | Panel del día con clientes, caja y cobros juntos | / | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/dashboard` → tarjetas del día (citas, caja, cobros) cuadran con lo cargado en `/agenda` y `/billing` |
| E-03 | Cuentas por cobrar / saldos pendientes visibles | /, CAT §2 (servicios: "caja y por cobrar") | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Cobro con saldo y fecha vencida → aparece en por cobrar / vencidos con monto y cliente |
| E-04 | Caja del día cortada por método de pago | /rubros (maqueta: Efectivo, QR, Tarjeta, Fiado), /, CAT §2 ("caja y corte") | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/comercio` caja → vender con efectivo, QR, tarjeta y fiado → el corte del día muestra el total por método y cuadra con las ventas |
| E-05 | Fiados: quién te debe, fuera del cuaderno | /rubros, CAT §2 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Venta a fiado → el cliente figura con saldo en fiados → registrar un pago baja el saldo |
| E-06 | Cotizaciones B2B con estado (enviada / aprobada / esperando respuesta) | /rubros, APP /register ("cotizaciones B2B"), CAT §2 y §4 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/importadora/cotizaciones` → crear cotización → marcarla Enviada → Aprobada; los estados se ven en el listado |
| E-07 | Costeo de importación por lote y alerta de reprecio | /rubros ("Sabés cuánto te costó cada lote puesto en depósito"), APP /register, CAT §2 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Cargar un lote con costos (precio de origen, flete, aranceles) → costo unitario puesto en depósito; subir el costo de un lote → aparece la alerta de reprecio |
| E-08 | Facturas recurrentes que se generan solas | /precios (Profesional), CAT §2 (cron) | ⬜ sin verificar: corre solo, falta el log del VPS | — | Log del cron de facturas recurrentes |
| E-09 | Resumen de IVA e IT del mes armado con lo que se cobra en Onia | /facturacion, /rubros (Servicios: "el IVA y el IT ya armados"), /, /comparativa, /guia-facturacion, /precios | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Cargar ventas y compras del mes → `/contabilidad` → resumen de IVA (13%) e IT (3%) coincide con el cálculo manual |
| E-10 | Registro de ventas y compras con detalle, exportable (insumo para el contador) | /precios, /facturacion ("El registro exportable de Onia es un insumo para tu contador"), /rubros ("Ventas y compras del mes al día") | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Venta en `/billing` o caja → aparece en el libro de ventas; gasto en `/empresa/gastos` → libro de compras; exportar y abrir el archivo |
| E-11 | Calendario de vencimientos impositivos por NIT | /nosotros, /facturacion | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/contabilidad` → calendario con las fechas según el último dígito del NIT cargado en el negocio |
| E-12 | Contabilidad completa (RCV, balance y export) | /precios (Profesional), CAT §4 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: En Profesional/prueba: `/contabilidad` muestra RCV, balance y botón exportar; en Básico y Crece no |
| E-13 | Planilla del mes | /precios (Profesional), CAT §2 y §4 (`/rrhh`) | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/rrhh` → cargar colaboradores → calcular la planilla del mes → resumen con totales; en Básico/Crece bloqueada |
| E-14 | Gastos y colaboradores de la empresa | CAT §2 y §4 (`/empresa`) | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/empresa/gastos` → registrar un gasto → aparece en el libro de compras; `/empresa/colaboradores` → alta de colaborador |
| E-15 | Onia emite factura por cada pago de la suscripción | CAT §6 punto 2 (checkout); pie de toda página: "Onia · NIT 5371375010 · EMITE FACTURA" | 🟡 a medias | El pie dice «EMITE FACTURA»: es el dato fiscal de la empresa | Que cada cobro lleve factura manual (plan 1.0, punto 15). Mirar que el checkout no prometa factura automática (punto 2) |
| F-01 | Inventario con existencias, costo, proveedor y aviso de stock mínimo | /precios (Básico), APP /register (comercio), CAT §2 y §4 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/inventory` → crear ítem con existencia, costo, proveedor y mínimo → descontar hasta quedar bajo el mínimo → aparece el aviso de stock mínimo |
| F-02 | Comercio: catálogo de productos con stock y kardex | /rubros, APP /register ("Catálogo, inventario, caja y clientes"), CAT §2 ("inventario con kardex") | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/comercio/**` → producto → entrada y venta → el kardex muestra cada movimiento con su saldo |
| G-01 | Los agentes proponen y nada sale sin tu aprobación | /, /agentes ("ninguna sale sola"), /nosotros ("Los agentes proponen, vos aprobás"), APP /login ("cada mensaje de un agente sale solo cuando lo aprobás"), PRO §6.9 ("nada sale sin que usted lo apruebe"), CAT §2 y §8 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/pending` → propuesta con Aprobar/Descartar; sin aprobar, comprobar que no sale ningún correo ni se abre WhatsApp ni queda registro de envío; al aprobar queda lista para enviar |
| G-02 | Se puede descartar una propuesta sin dar motivo | /agentes | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/pending` → Descartar → la propuesta desaparece sin pedir motivo |
| G-03 | Enviar el mensaje aprobado por tu WhatsApp con un toque | /agentes | 🟡 a medias | `wa.me` en `pending-client.tsx` (master `b2d9d31`); plan 1.0 punto 10: «a medias» | Verlo en producción con la cuenta |
| G-04 | Los agentes corren solos cada mañana, antes de abrir | /agentes, /nosotros, /, /precios ("Cada mañana los agentes te dejan anotado a quién escribirle, con el mensaje listo; vos aprobás."), PRO §6.9, CAT §2 ("una vez al día (07:00 La Paz)") y §8 (frase 3) | ⬜ sin verificar: corre solo, falta el log del VPS | Medido el 1-oct: cron `0 11 * * *`, log «OK» | Log de hoy |
| G-05 | Agente «Vuelve a citar»: quien no vuelve hace meses y no tiene próxima cita | /agentes, /precios (Crece), CAT §2 y §8 (frase 3: "quien hace 6 meses no vuelve") | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Paciente con última cita de hace más de 6 meses y sin cita futura → aparece en `/pending`; uno con cita futura no aparece; en comercio el agente no existe |
| G-06 | Agente «Confirma citas»: citas de mañana sin confirmar, y avisa con un día de margen | /agentes, /precios, /, PRO §6.9 ("quién tiene cita mañana y no confirmó"), CAT §8 (frase 3) | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Cita de mañana sin confirmar → propuesta en `/pending`; una ya confirmada no genera propuesta |
| G-07 | Agente «Reprograma»: quien faltó o canceló y no tiene otra cita (no reserva) | /agentes, /precios, /, PRO §6.9 ("quién canceló o faltó y no volvió a agendar") | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Cita cancelada o «no asistió» sin cita posterior → propuesta; el texto no fija horario y no crea ninguna cita |
| G-08 | Agente «Recuerda cobros»: saldos vencidos, sin cobrar por vos | /agentes, /precios, /, PRO §6.9 ("quién le debe"), CAT §8 (frase 3) | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Cobro con saldo vencido → propuesta en `/pending` con el monto reemplazado; al aprobar no se cobra nada |
| G-09 | Agente «Avisa stock bajo»: tarea de pedir al proveedor, sin comprar ni escribir | /agentes, /precios, CAT §8 (frase 4: "Cuando un insumo baja del mínimo, Onia te deja anotada la tarea de reponerlo.") | ⬜ sin verificar: falta la cuenta | La web lo limita a comercio e importadora; el catálogo §8.4, a los rubros con inventario | Unificar el texto y verlo con la cuenta |
| G-10 | Agente «Sigue cotizaciones»: cotizaciones enviadas sin respuesta | /agentes, /precios | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Cotización Enviada sin respuesta → propuesta; una vencida no genera propuesta |
| G-11 | La IA propone el texto de cada recordatorio; el dueño lo aprueba una sola vez | PRO §6.9, /agentes ("La IA redacta el texto de cada agente y vos lo aprobás una vez"), CAT §8 (frases 1 y 2) | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/agents` → plantilla de un agente → pedir texto con IA → aparece un texto en el tono del negocio → aprobarlo una vez → `/pending` usa esa plantilla; el contador de cupo baja; en Básico no está el botón |
| G-12 | La IA no ve los datos de los pacientes: escribe el modelo y Onia pone nombre, monto u hora | CAT §8 (frase 2) | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: La plantilla se ve con variables (nombre, monto, hora) y el mensaje en `/pending` las trae reemplazadas; revisar el log o petición al modelo (LiteLLM) sin datos personales |
| G-13 | Preguntarle a Onia por tus números y obtener respuesta | CAT §8 (frase 5) | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Asistente de ayuda (barra del asistente) → las 4 preguntas → las cifras coinciden con `/billing`, `/agenda`, `/inventory`; un usuario sin permiso de finanzas no recibe montos |
| G-14 | «Sistema de gestión con IA» (lema del pie de toda página) | Pie de todas las páginas, /agentes (etiqueta «AGENTES CON IA») | ✅ visto | La skill lo permite: «Sistema de gestión con IA» ✅ (hay IA en los agentes) | — |
| H-01 | Reporte básico | /precios (Básico), CAT §4 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: En cuenta Básico: `/reports` muestra el reporte básico y no los completos |
| H-02 | Reportes completos | /precios (Profesional), CAT §4 ("desde Profesional") | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: En Profesional/prueba: `/reports` y `/reports/clinical-balance` completos; en Crece solo lo básico |
| H-03 | Exportar tus datos en CSV cuando quieras, en cualquier plan y durante la prueba | /precios, /precios (Básico: "Exportás tus datos en CSV cuando quieras"), /empezar, /nosotros | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: En cuenta Básico y en prueba: `/patients` (y `/billing`, `/inventory`) → Exportar CSV → el archivo abre con columnas y filas correctas y tildes bien |
| I-01 | Link público para que el cliente pida su cita | /precios (Crece), /precios (add-on), CAT §2 ("link de reserva online") y §5 | 🟡 a medias | `/book` público, visto el 8-oct | Abrir el enlace de un negocio y pedir una cita en la cuenta de prueba |
| J-01 | Agente conversacional de WhatsApp que contesta al instante las 24 h, domingos y feriados | /chatbot, /, /precios, /contacto ("El mismo WhatsApp que atiende a los clientes."), CAT §5 | ❌ no se puede prometer hoy | Catálogo §5: ⏸ hasta conectar el WhatsApp de un cliente real | Sacarlo de la venta o hacer la prueba real (chip prepago, catálogo §6.4) |
| J-02 | Responde solo con lo que el negocio cargó; no inventa ni cotiza | /chatbot ("Responde con la información real que vos publicaste: horarios, servicios y los datos de la cita"), /, CAT §5 | ❌ no se puede prometer hoy | Catálogo §5: ⏸ hasta conectar el WhatsApp de un cliente real | Sacarlo de la venta o hacer la prueba real (chip prepago, catálogo §6.4) |
| J-03 | Lo que no sabe lo pasa a una persona con la conversación completa | /chatbot, CAT §5 ("deriva a una persona") | ❌ no se puede prometer hoy | Catálogo §5: ⏸ hasta conectar el WhatsApp de un cliente real | Sacarlo de la venta o hacer la prueba real (chip prepago, catálogo §6.4) |
| J-04 | Manda el link de reserva (si hay Reservas online) o pasa el pedido al equipo | /chatbot, CAT §5 ("manda el link de reserva") | ❌ no se puede prometer hoy | Catálogo §5: ⏸ hasta conectar el WhatsApp de un cliente real | Sacarlo de la venta o hacer la prueba real (chip prepago, catálogo §6.4) |
| J-05 | Tope de 500 conversaciones/mes y recarga de 200 por Bs 190 | /chatbot, /precios (Completo: 500/mes) | ❌ no se puede prometer hoy | Catálogo §5: ⏸ hasta conectar el WhatsApp de un cliente real | Sacarlo de la venta o hacer la prueba real (chip prepago, catálogo §6.4) |
| J-06 | Configuración del número y de las plantillas que Meta aprueba, incluida | /chatbot | ❌ no se puede prometer hoy | Catálogo §5: ⏸ hasta conectar el WhatsApp de un cliente real | Sacarlo de la venta o hacer la prueba real (chip prepago, catálogo §6.4) |
| J-07 | Precio del agente: Bs 390/mes sin instalación, o Bs 3.900/año | /chatbot, /precios, CAT §5 | ❌ no se puede prometer hoy | Catálogo §5: ⏸ hasta conectar el WhatsApp de un cliente real | Sacarlo de la venta o hacer la prueba real (chip prepago, catálogo §6.4) |
| J-08 | Los mensajes de WhatsApp que cobra Meta los paga el cliente directo a Meta | /chatbot, /precios ("desde el 1 de octubre de 2026 también las respuestas") | ❌ no se puede prometer hoy | Catálogo §5: ⏸ hasta conectar el WhatsApp de un cliente real | Sacarlo de la venta o hacer la prueba real (chip prepago, catálogo §6.4) |
| J-09 | Bandeja de conversaciones | CAT §2 y §4 (`/inbox`) | ⬜ sin verificar: falta la cuenta | — | Ver `/inbox` con la cuenta |
| K-01 | Cuatro planes y su precio mensual: Básico Bs 320, Crece Bs 550, Profesional Bs 890, Completo Bs 1.290 | /, /precios, /comparativa ("Bs 320 – 1.290 / mes"), CAT §3 | ✅ visto | Montos = `DEFAULT_PLAN_AMOUNTS` (master `b2d9d31`) | Releer el día del envío: una variable de entorno puede pisarlos |
| K-02 | Se paga semanal, mensual o anual; el anual cobra 10 meses | /precios, /chatbot, CAT §3 | ✅ visto | Semanal 89/145/229 y anual ×10 = código | — |
| K-03 | Precios finales en bolivianos, impuestos incluidos | /precios | ✅ visto | Texto de `/precios` | — |
| K-04 | Sin implementación ni migración en los cuatro planes | /precios ("Sin implementación, sin permanencia."), /empezar | ✅ visto | Texto de `/precios` | — |
| K-05 | Sin contrato de permanencia | /nosotros, /precios ("sin permanencia") | ✅ visto | Texto de `/precios` y `/nosotros` | — |
| K-06 | Tope de fichas por plan: 300 / 800 / 1.500 / sin tope | /precios (Básico, Crece, Profesional, Completo) | ✅ visto | Fichas 300/800/1.500/sin tope = `plan-catalogo.ts` | — |
| K-07 | Tope de usuarios por plan: 2 (hasta 3 más pagos) / 4 / 5 / sin tope | /precios, CAT §3 (Crece = 4 usuarios) | ✅ visto | Usuarios 2/4/5/sin tope = `plan-catalogo.ts` | — |
| K-08 | Usuario adicional por Bs 70/mes | /precios, CAT §5 ("Usuario extra ✅ en Básico"). Ver contradicción 5 | 🟡 a medias | `extraUserSeats` existe en todos los planes, pero lo carga un superadmin a mano | Decir «a pedido», no «se compra», o hacerlo autoservicio |
| K-09 | Tope de recordatorios por email al mes: 200 / 400 / 800 / sin tope | /precios | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: Enviar recordatorios hasta el tope (contador en `/settings`) → al pasarlo ya no salen más (ver B-03) |
| K-10 | Un solo administrador; más de uno solo en Completo | /precios (Básico, Crece, Profesional), /precios (Completo: "más de un administrador") | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/team` → intentar crear un segundo administrador: bloqueado en Básico, Crece y Profesional, permitido en Completo |
| K-11 | Los agentes vienen incluidos desde Crece, sin cobro extra | /agentes ("No es un cobro extra: está adentro del plan."), /precios (Básico: "Agentes de IA (vienen desde Crece)"), /, CAT §4 | ✅ visto | `agentsIncluded` desde Crece = código | — |
| K-12 | Reservas online como add-on de Bs 150/mes en Básico; incluidas desde Crece | /precios, CAT §5 | ✅ visto | Precio del add-on = `pricing.ts` | — |
| K-13 | Completo = Profesional con el agente de WhatsApp incluido, por solo Bs 10 más | /precios (Completo), CAT §5 | ❌ no se puede prometer hoy | Depende del agente de WhatsApp (⏸ catálogo §5) | Igual que J |
| K-14 | Completo se entrega configurado para el rubro | /precios (Completo) | ❌ no se puede prometer hoy | Depende del agente de WhatsApp | Igual que J |
| K-15 | Plan Grupo / Empresarial: Bs 2.900/mes, implementación desde Bs 3.500, se cotiza | /precios ("Para varias razones sociales o un grupo de negocios: mismos límites del Completo más una implementación acompañada."), CAT §3 ("Empresa se cotiza") | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/checkout` no ofrece Grupo; «Cotizar Grupo» lleva a contacto; límites iguales a Completo; probar si una cuenta soporta varias razones sociales |
| K-16 | Pago de la suscripción con QR, comprobante y activación al aprobarlo | /empezar, /nosotros ("QR bancario"), CAT §3 ("QR del BCP (monto abierto) → el cliente sube el comprobante → Sergio Urcullo lo aprueba en /admin/payments → el plan se activa.") | 🟡 a medias | Catálogo §6: 0 pagos registrados | Un pago completo de prueba (plan 1.0, punto 1) |
| L-01 | Equipo con roles y acceso limitado | CAT §2, /precios ("el resto del equipo entra con acceso limitado"), APP /login ("pedí acceso al administrador") | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/team` → invitar un usuario con rol Recepción → inicia sesión → no ve `/contabilidad`, finanzas ni ajustes de administrador; el menú cambia por permiso |
| L-02 | Los datos son del cliente: no se venden ni se entrena IA con ellos | /nosotros ("Está en la política de privacidad, con nombre y apellido.") | ✅ visto | Lo dice la política de privacidad | — |
| L-03 | Empresa registrada: OniaAgency, SEPREC, NIT vigente; el sistema ya corre en producción | /nosotros, pie de toda página (NIT 5371375010) | ✅ visto | Pie y `/nosotros` | — |
| L-04 | Consulta comercial y demo de 30 minutos, sin compromiso, con una persona que conoce el sistema | /contacto ("Si no te sirve, te lo decimos ahí."), /, /empezar | 🟡 a medias | La web dice demo de 30 min; los mensajes, 20 min | Unificar la duración |
| L-05 | Demo de 20 minutos con una clínica de ejemplo | PRO §6.9 (los 7 mensajes) | ❌ no se puede prometer hoy | No hay cuenta demo en producción (plan 1.0, punto 9) | La cuenta demo con datos |
| L-06 | Si el cliente se traba al activar, hay demo y guía | APP /login, APP /register | ⬜ sin verificar: falta la cuenta | — | Cuesta horas de Sergio Urcullo por cliente (estrategia §9): decidir si se promete |
| L-07 | Ayuda dentro de la app | CAT §2 | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/help` abre la ayuda con contenido; la configuración está en `/settings` |
| L-08 | Guía gratuita de 6 pasos para habilitar la facturación en línea, y la hoja por correo | /guia-facturacion ("Quiero la hoja"), /facturacion | ⬜ sin verificar: corre solo, falta el log del VPS | — | Probar el formulario de la guía |
| L-09 | El correo/WhatsApp dejado en la guía solo se usa para hablar del caso | /guia-facturacion | ✅ visto | Texto legal | — |
| L-10 | Información normativa del SIN verificada contra el texto de cada norma | /facturacion, /guia-facturacion ("No estás obligado por ley a comprar un sistema privado.") | ✅ visto | Texto | — |
| L-11 | Afirmaciones sobre competidores y precios ajenos (consultados el 30-jul-2026) | /comparativa | ❌ no se puede prometer hoy | `/comparativa` nombra a la competencia | Regla de `CLAUDE.md` (Sergio Urcullo, 3-sep): cero autobombo, nada sobre la competencia. Decidir si se baja |
| L-12 | Costos de terceros nunca incluidos en la tarifa (dominio, hosting, mensajes de Meta, pauta, fotos, pasarela, créditos de IA) | /precios, /servicios/webs, /chatbot | ✅ visto | Texto | — |
| L-13 | Web del negocio: niveles y precios, con pago 50/50 | /servicios/webs ("Landing de Captación Bs 2.000", "Web Profesional Bs 4.500", «Estimado de construcción»), /precios ("Desde Bs 2.000 · pago único") | 🚫 fuera de la oferta | Web a medida: no está en el catálogo | Test de tres preguntas (estrategia §10): falla. Decidir si se baja `/servicios/webs` |
| L-14 | Preview de la web antes de dejar datos; nada se guarda hasta pedirla | /servicios/webs ("nada se guarda hasta que la pedís"), /servicios/webs ("Nada se guarda mientras probás.") | 🚫 fuera de la oferta | Web a medida: no está en el catálogo | Test de tres preguntas (estrategia §10): falla. Decidir si se baja `/servicios/webs` |
| L-15 | Qué lleva la entrega de la web: diseño propio, textos, SEO básico, claro/oscuro, accesibilidad y velocidad verificadas, preview aprobable desde el celular, publicación y botón de WhatsApp | /servicios/webs, /precios ("con el botón de WhatsApp cableado") | 🚫 fuera de la oferta | Web a medida: no está en el catálogo | Test de tres preguntas (estrategia §10): falla. Decidir si se baja `/servicios/webs` |
| L-16 | Dominio y hosting siempre a nombre del cliente; permiso limitado y revocable | /servicios/webs, /precios | 🚫 fuera de la oferta | Web a medida: no está en el catálogo | Test de tres preguntas (estrategia §10): falla. Decidir si se baja `/servicios/webs` |
| L-17 | Plazo de la web: el reloj arranca al recibir todo el contenido; rondas de ajuste escritas en la propuesta | /servicios/webs | 🚫 fuera de la oferta | Web a medida: no está en el catálogo | Test de tres preguntas (estrategia §10): falla. Decidir si se baja `/servicios/webs` |
| L-18 | Registro de contactos del formulario en CRM / n8n por Bs 790 de setup único | /servicios/webs ("+ Bs 790") | 🚫 fuera de la oferta | Web a medida: no está en el catálogo | Test de tres preguntas (estrategia §10): falla. Decidir si se baja `/servicios/webs` |
| L-19 | Mantenimiento mensual de la web: Básico Bs 190, Crecimiento Bs 390, Pro Bs 690 | /servicios/webs ("Mantenimiento después de publicar", "plan mensual de Cuidado Web") | 🚫 fuera de la oferta | Web a medida: no está en el catálogo | Test de tres preguntas (estrategia §10): falla. Decidir si se baja `/servicios/webs` |
| L-20 | Requerimientos al cliente (módulo) | CAT §4 (`/requerimientos`, todos los rubros) | ⬜ sin verificar: falta la cuenta | — | Mirarlo con la cuenta: `/requerimientos` → crear un requerimiento para un cliente y seguir su estado |
