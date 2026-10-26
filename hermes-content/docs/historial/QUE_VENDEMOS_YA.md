# Qué vendemos ya — la semana del 4 de septiembre de 2026

> **Doc vivo, sin fecha en el nombre: se EDITA.** Responde una sola pregunta de Sergio
> (*"ya quiero facturar… hay que vender de una vez, también mirá temas de infoproductos"*):
> **qué se puede cobrar esta semana con lo que ya funciona, a quién, y a qué precio.**
>
> **Los precios no se escriben acá, se LEEN.** Planes en
> `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`) · add-ons en
> `onia-platform/lib/pricing.ts`. Si un número de este archivo no coincide con esos dos,
> **el roto es este archivo**.
>
> **Nadie fue contactado.** Los guiones de abajo son borradores para Sergio, no mensajes
> enviados.

---

## Medido antes de escribir (4-sep-2026, producción)

No es memoria heredada: se contó en vivo.

| Qué | Medido | Cómo |
|---|---|---|
| Clientes pagando | **0** | `subscription_payments` = 0, `gateway_configs` = 0 |
| Organizaciones | 5 — todas internas (2 QA, `onia-interna`, Bolivian Electric, la de Sergio) | tabla `organizations` |
| Alta automática | **ABIERTA** | `docker exec onia-platform env` → `ONIA_ALTA_AUTOMATICA=abierta`; `/register` = 200 |
| Agenda pública | **funciona y se ve bien** — abierta y MIRADA renderizada hoy: `app.onia.com.bo/book/clinica-sergio-p2ljs` muestra el asistente de 4 pasos (Profesional → Fecha → Horario → Datos) con los iconos como iconos | navegador, captura leída |
| Cobros | **arreglados y verificados el 3-sep** (ítem manual 201, pago 200, recibo "NOTA DE VENTA", QR por archivo) | álbum de verificación con la cuenta de Sergio |
| Agentes IA | corren solos todos los días 07:00 La Paz (`/root/bin/run-onia-agents-cron.sh`), 14 días de `http=200` | crontab del host + `/var/log/onia-agents-cron.log` |
| Emisión fiscal SIAT | **apagada** — el contenedor no tiene ninguna var `SIAT_*`; el emisor es mock | `docker exec onia-platform env \| grep SIAT` → vacío |
| WhatsApp del cliente | **sin conectar** — `WHATSAPP_PHONE_NUMBER_ID`, `_ACCESS_TOKEN`, `_APP_SECRET` y `_WEBHOOK_VERIFY_TOKEN` = `SIN_CONFIGURAR` | mismo comando |
| Leads esperando | **7, ninguno contactado** — 3 pedidos de acceso (`contactedAt` NULL en los tres) + 4 conversaciones del bot | `access_requests` y base `onia-chatbot` de Chatwoot |

🔴 **Hallazgo que frena antes de escribirle a nadie:** el kit de ventas
(`hermes-content/sales-kit/03-SCRIPTS-WHATSAPP.md`, del 25-jul) promete en dos guiones
*"Factura SIAT incluida en los 3 planes, sin costo aparte"*, y la landing de onia.com.bo
dice *"no existe un software vendido en Bolivia que cruce agenda + ficha del cliente +
factura SIAT"*. **Hoy eso es falso**: la emisión está apagada. Usar esos guiones tal cual
es vender lo que no se entrega. Los de este archivo ya están corregidos; **la landing y el
kit hay que barrerlos** (carril aparte, anotado en §E).

---

## A. Lo vendible esta semana

Tres ofertas. La primera es para los siete que ya escribieron.

---

### Oferta 1 · El sistema, plan Profesional — **para los leads que ya escribieron**

**Precio (leído de `subscription-plans.ts`):** Bs **750**/mes · Bs **199**/semana ·
Bs **7.500**/año (el anual son 10 meses: dos gratis).
**Prueba:** 14 días, sin tarjeta, el propio cliente se da de alta en `app.onia.com.bo/register`.

**A quién:** clínicas dentales y de estética de Santa Cruz de 2 a 5 profesionales, que ya
facturan y llevan la agenda en cuaderno o en WhatsApp. Es exactamente el perfil de los
tres pedidos de acceso y de la clínica de 4 doctores del bot.

**Qué incluye, exacto** (verificado contra `lib/plan-limits.ts`, no contra un folleto):

- Agenda y citas, ficha del cliente/paciente con historial, y **odontograma** en dental.
- **Agenda pública de reservas** (link propio; el paciente reserva solo, sin llamar) — incluida en Profesional.
- Tratamientos y servicios, inventario simple.
- Cobros con recibo imprimible, ítems libres y factura interna; QR de cobro por archivo.
- Contabilidad con **libro de compras** y exportación CSV.
- **Agentes con IA que corren de noche y dejan un borrador para aprobar**: el de
  reactivación (quién no vuelve y no tiene próxima cita) y el de cobranza (a quién se le
  venció la factura). No mandan nada solos.
- Hasta **5 usuarios** y **1.500 pacientes**, 800 correos/mes.

**Qué NO incluye — se dice antes de que lo pregunten:**

- **La factura fiscal la emite el cliente en el Portal Web del SIN**, que es gratis. El
  sistema todavía no la emite por él. *(Nunca decir "obligatorio por ley, comprame": el
  portal del SIN es gratuito y decir lo contrario se refuta con un Google.)*
- El chatbot **no viene en el plan**: es add-on (Oferta 2).
- No hay multi-sede, no hay modo sin internet, y el cobro con tarjeta todavía no es automático:
  la suscripción se paga por transferencia o QR.

**Cómo entra la plata:** el cliente se registra solo hoy y arranca los 14 días. Al día 14
paga por transferencia. **Si Sergio quiere caja esta misma semana**, el camino corto es el
**semanal de Bs 199**: se cobra por adelantado y no espera al trial.

**Guion de WhatsApp — para los 3 pedidos de acceso (Maximo, Leonardo, Edwin):**

```
Hola [Nombre], soy Sergio de Onia. Pediste acceso al sistema para [Negocio] el [fecha] y te debo la respuesta — perdón la demora.

Ya podés entrar solo: creás la cuenta en dos pasos y tenés 14 días completos, sin tarjeta.

Con lo que te importa andando desde el primer día: la agenda, la ficha de cada paciente, los cobros con recibo, y un link tuyo para que reserven sin llamarte.

La factura fiscal la seguís emitiendo en el portal del SIN (es gratis); lo nuestro es que no tengas que volver a tipear los datos.

¿Te lo abro yo en 20 minutos por videollamada, o preferís entrar y mirarlo vos?
```

**Guion para la clínica de 4 doctores (conv 35, +59173232758) — es distinto: pidió capacidades, no demo.**
Hizo 6 preguntas concretas y dijo que todavía no quiere abrir cuenta. **Contestarle de
memoria es la forma de quemarlo.** Esto ya está verificado una por una en el código
(`lib/onia-core/modules/agents-runtime.ts` y `agents-logic.ts`):

| Su pregunta | La respuesta verdadera |
|---|---|
| 1. ¿Lista de pacientes con tratamiento pendiente **y sin próxima cita**? | **Sí, con un matiz que hay que decirle:** el sistema arma la lista de *quien no volvió y no tiene próxima cita agendada*. El filtro es "última visita hace N días", **no** "tiene un tratamiento a medio terminar" |
| 2. ¿Por períodos (15/30/60+ días)? | El motor toma el período como parámetro, pero **hoy está fijo en 180 días y no hay pantalla para cambiarlo**. Se puede ajustar por organización; que no se lo prometa como botón |
| 3. ¿Alerta o reporte automático? | **Sí:** corre **todos los días** a las 07:00 y deja el borrador en la cola de aprobación. No es semanal ni mensual: es diario |
| 4. ¿Si cancela y no reprograma, lo identifica solo? | **Sí, si ya vino alguna vez.** Toma la última cita COMPLETADA. Quien canceló y nunca asistió no entra en la lista |
| 5. ¿Plan normal o módulo aparte? | **Viene en Profesional y superiores, sin costo aparte.** No es add-on |
| 6. ¿Exportar a Excel/PDF? | **CSV sí** (abre en Excel) para facturación y contabilidad. La lista de reactivación **todavía no tiene botón de exportar** |

**Costo total para 4 doctores:** Profesional, Bs 750/mes o Bs 7.500/año — entran los 4
doctores más la recepcionista (5 usuarios) y 1.500 pacientes. No hay costo de instalación.

```
Hola, soy Sergio de Onia. Me escribiste el 25 de agosto por el sistema para tu clínica y te contesto recién ahora — mal de mi parte, y prefiero decírtelo así.

Fui a verificar tus 6 preguntas una por una en el sistema antes de responderte, porque las de este tipo se contestan mirando, no de memoria. Te las paso con el matiz de cada una, incluidas las dos donde la respuesta no es un sí redondo.

[pegar la tabla de las 6, en limpio]

Costo total para 4 doctores: Bs 750 al mes, o Bs 7.500 al año (dos meses gratis). Entran los 4 doctores más la recepcionista y 1.500 pacientes, sin costo de instalación.

Si querés, te lo muestro con la lista de reactivación funcionando sobre datos de ejemplo — 20 minutos y decidís con eso a la vista.
```

---

### Oferta 2 · Asistente con IA que contesta 24/7 — add-on

**Precio (leído de `pricing.ts`):** Bs **390**/mes o Bs **3.900**/año. **Cero instalación.**

**A quién:** cualquier negocio que ya tenga web o Instagram y pierda consultas fuera de
horario. No exige tener el sistema: es la venta más barata de entrar y la que más rápido
factura, porque se cobra el mes por adelantado.

**Qué incluye:** asistente que contesta en el widget de la web del cliente, califica,
**deriva a una persona** y hace seguimiento; el dueño **edita el guion conversando** y ve
su bandeja propia (cuando contesta él, el bot se aparta); entiende fotos y audios; IA
incluida, hasta 500 conversaciones/mes.

**Qué NO incluye:**

- **Todavía no atiende en el número de WhatsApp del cliente.** Medido hoy: las cuatro
  credenciales de WhatsApp del contenedor dicen `SIN_CONFIGURAR`. Vive en el widget web.
- **El bot no agenda.** Cuando alguien pide cita, **la escala a una persona**. Quien
  quiera que la reserva se cierre sola, eso es la agenda pública del sistema (Oferta 1).
- Integrarlo con el sistema del cliente o con flujos propios se cotiza aparte.

```
Hola [Nombre], soy Sergio de Onia, acá en Santa Cruz.

Una pregunta sola: de las consultas que te llegan después de las 6 de la tarde y los domingos, ¿cuántas se te enfrían hasta el otro día?

Tenemos un asistente con IA que contesta en tu página al instante, responde precios y horarios con tus palabras, y cuando el que pregunta va en serio te lo pasa a vos.

Bs 390 al mes, sin instalación y sin permanencia. El guion lo corregís vos conversando con él, como si le explicaras a un empleado nuevo.

¿Te lo dejo andando en tu página esta semana para que lo veas contestar?
```

---

### Oferta 3 · Página web + Cuidado Web mensual — la que paga más rápido

**Precio: se cotiza caso por caso.** Decidido el 2026-08-24: **esta línea no tiene lista
de precios** y nadie debe "corregirla" contra `pricing.ts`, que no la cubre.
**Rango interno de referencia** (de las propuestas ya emitidas, `ONIA_WEB_COMO_SE_VENDE.md`
§8.2): landing ≈ Bs 2.000 · web profesional ≈ Bs 4.500 · tienda desde Bs 6.900 · mensual
de Cuidado Web Bs 190–890.

**A quién:** el comprador puente — el negocio formal que hoy solo quiere estar online
(inmobiliaria, climatización, taller, consultorio chico). No necesita sistema todavía,
paga rápido, y después sube.

**Qué incluye:** una de las plantillas vivas del motor (`landing`, `landing-focus`,
`landing-clinic`, `landing-realestate`, `landing-logistics`, `store`, `dashboard`),
construcción en 4–6 h para una landing, más el mensual de hosting gestionado, respaldos y
cambios de contenido.

**Qué NO incluye — regla de la casa, va en toda propuesta:** dominio y hosting los compra
el cliente **a su nombre**, correo profesional, comisión de la pasarela, créditos de IA,
pauta publicitaria, fotografía y migración masiva.

**Frontera que no se cruza:** apenas aparezca base de datos de clientes/pedidos/citas,
usuarios con permisos, integración con WhatsApp/API, o reportes y facturación — **ya no es
web, es sistema**. Cotizar como web algo que es sistema es la forma más cara de perder
plata en este carril.

**Cómo entra la plata:** 50 % a la firma. En una landing eso es ≈ Bs 1.000 **esta semana**.

```
Hola [Nombre], soy Sergio de Onia.

Vi que [señal concreta: no tienen web / la web no abre en celular / los pedidos les llegan sueltos por DM].

Hacemos páginas que sirven para una sola cosa: que el que te busca te encuentre y te escriba. Se entrega en días, no en meses, y el dominio queda a tu nombre.

Después queda un mensual chico que cubre hosting, respaldos y los cambios de contenido, así no dependés de nadie para actualizar un precio.

¿Te paso una propuesta con alcance y plazo cerrados? Necesito 10 minutos para entender qué vendés.
```

---

## B. La demo que no falla — 5 minutos, paso por paso

**Regla: no se improvisa y no se muestra nada que no esté en esta lista.**

### Preparación (una vez, el día ANTES — 20 minutos)

1. **No demostrar sobre la organización de Sergio con sus 2 pacientes reales.** Una lista
   de dos filas no vende nada, y el agente de reactivación no propondría nada.
2. Pedirle a la sesión de control que **provisione una clínica demo**:
   `POST /api/onia-core/demo` (requiere admin, y `PLATFORM_LAYER=1`, que está encendido).
   Deja sembrado exactamente lo que la demo necesita: pacientes con tratamientos, 2 citas,
   2 facturas, **un paciente frío con visita completada hace 220 días y sin cita futura**
   (lo levanta el agente de reactivación) y **una factura vencida hace 45 días** (lo
   levanta el de cobranza). Fuente: `lib/onia-core/demo-seed.ts`.
   ⚠️ **Ojo:** un usuario pertenece a una sola organización (`Profile.userId` es único), así
   que la demo se abre con su propio acceso, no con la cuenta de Sergio.
3. Disparar el agente una vez para que la cola tenga qué mostrar:
   `/root/bin/run-onia-agents-cron.sh` en el VPS. (Si no, esperar al cron de las 07:00.)
4. Dejar **dos pestañas abiertas y cargadas** antes de llamar: el panel y la agenda pública.

### El recorrido (5 minutos)

1. **(0:00 — desde el celular, y que lo toque el cliente)** Abrir la **agenda pública** de
   la clínica demo y reservar una cita como si fuera el paciente: elegir profesional →
   fecha → horario → dejar los datos. *Frase: "así te reserva tu paciente un domingo a las
   11 de la noche, sin llamarte".* **Verificado renderizado hoy.**
2. **(1:00 — pasar a la laptop)** La cita que acaba de crear **ya está en la agenda del
   panel**, con hora, motivo y teléfono. Ese salto de pantalla es el momento que vende.
3. **(2:00)** Abrir la **ficha del paciente**: historial, y en dental el **odontograma**.
   *Frase: "esto reemplaza el cuaderno, no le suma otro".*
4. **(3:00)** **Cobros**: cargar el tratamiento como ítem, registrar el pago, e **imprimir
   el recibo**. Decirlo antes de que pregunte: *"la factura fiscal la seguís emitiendo en
   el portal del SIN, que es gratis; esto es tu recibo interno y tu caja"*.
5. **(4:00)** **La cola de aprobaciones** con la propuesta del agente esperando: *"a quién
   llamar" y "a quién cobrarle"*, con el botón de aprobar. *Frase: "trabajó a las 3 de la
   mañana y no mandó nada: te dejó el borrador. Vos aprobás".*
6. **(4:30)** Cerrar en el celular del cliente: abrir `app.onia.com.bo/register` y mostrar
   que **crea la cuenta él solo en dos pasos, 14 días sin tarjeta**. No pedir la tarjeta.

### Lo que NO se abre durante la demo

`/requerimientos` (existe pero no está enlazada en ninguna nav: no se le puede decir
"entrá y la ves") · cualquier pestaña de emisión fiscal SIAT · el canal de WhatsApp ·
el agente **captador** (nunca se enciende: da `kind_not_enabled` todos los días) ·
los rubros veterinaria y ganadería.

---

## C. Infoproductos

Dos candidatos reales, y los descartados con su motivo. **No se inventa un tercero para
llenar la lista.**

### C1 · Guía "Facturación en línea del SIN, resuelta" — PDF

- **Qué se entrega:** un PDF de ~15 páginas con el camino completo de la Oficina Virtual:
  qué modalidad te toca y cómo confirmarlo en tu propio padrón, cómo habilitar **Portal
  Web en Línea**, configurar casa matriz y punto de venta, sincronizar catálogos,
  homologar tus servicios, emitir la primera factura y verificar que el XML quedó
  registrado. Más una plantilla de datos fijos y los errores que traban el trámite.
- **De dónde sale:** ya está escrito y verificado — 1.036 líneas repartidas en cinco
  documentos (`ONIA_SIAT_HABILITAR_FACTURACION_CHECKLIST_2026.md`,
  `ONIA_SIAT_ESTADO_HOMOLOGACION.md`, `ONIA_FACTURACION_ESTADO_REAL.md`,
  `ONIA_GASTOS_CAPTURA_CREDITO_FISCAL_2026.md`, `ONIA_OPTIMIZACION_FISCAL_PROPIA_2026.md`).
  **Y no es teoría: nuestro propio NIT tiene el Portal Web en Línea HABILITADO**, mirado
  en vivo en la Oficina Virtual el 27-ago. Escribimos lo que ya hicimos.
- **Trabajo que falta: 8 h.** 6 h de curar los cinco documentos en un solo hilo y maquetar
  el PDF (la skill `make-pdf` ya lo hace), 2 h de página de venta y entrega.
- **Precio sugerido: Bs 149.** Lógica: es el monto que un dueño decide solo, sin consultar
  a nadie, y es un quinto de la mensualidad del plan Básico — así que **no compite con el
  sistema, lo antecede**. No se ancla contra tarifas de contador porque **no tenemos una
  fuente verificada de esas tarifas** y no se inventan cifras.
- **Dónde se vende:** una página en el sitio propio, cobro por QR/transferencia y entrega
  del PDF por correo a mano. **Cero infraestructura nueva y cero mantenimiento**: si el
  SIN cambia una pantalla, se edita el PDF.
- **Por qué alguien pagaría:** ~~el plazo de la facturación en línea es el **30-sep-2026** —
  faltan 26 días —~~ ⚠️ *(corregido el 3-oct: ese plazo quedó sin efecto, RND 102600000038, 30-sep-2026; el SIN
  asignará periódicamente una modalidad en línea a los contribuyentes del IVA sin ninguna, sin fecha)* el trámite es un laberinto de pantallas
  donde el que se equivoca pierde una semana.
- 🔴 **La objeción honesta, dicha acá y no descubierta en tres semanas:** un infoproducto
  sin audiencia no se vende solo. Hoy no tenemos lista de correos ni tráfico medido. Su
  valor más grande **no es la caja: es que califica** — el que paga Bs 149 por esto tiene
  NIT, factura, y es exactamente el comprador del sistema. Tratarlo como filtro de leads,
  no como línea de ingresos.

### C2 · "Habilitación acompañada" — servicio empaquetado del mismo conocimiento

- **Qué se entrega:** una videollamada de 60–90 minutos donde **el cliente entra a SU
  propia Oficina Virtual** (las credenciales las tipea él, nunca nosotros) y salimos de
  ahí con la modalidad habilitada, casa matriz y punto de venta configurados, catálogos
  sincronizados y **una factura de prueba emitida y validada**. Se cierra con el PDF de C1
  incluido.
- **Trabajo que falta: 1 h** — la página de venta. El checklist ya está escrito y probado
  sobre nuestro propio NIT.
- **Precio sugerido: Bs 490.** Lógica: se cobra el resultado (facturando hoy), no la hora.
  Margen ~100 % porque no hay costo de producción, y es la conversación más natural del
  mundo hacia la Oferta 1 (*"ya que estás emitiendo, esto lo puede tirar tu sistema"*).
- **Por qué alguien pagaría:** el portal del SIN es gratis — **y hay que decírselo
  nosotros primero, que es lo que da credibilidad**. Lo que no es gratis es el laberinto.
- **Es el que recomiendo empezar**: cero producción, margen alto, y cada venta deja un
  prospecto calificado sentado enfrente.

### Descartados, con motivo

- **El emisor SIAT como servicio para otros desarrolladores.** Nuestra propia homologación
  está al **24,8 %** con tres bloqueos abiertos y fecha límite 04/11/2026. Vender una API
  fiscal a terceros es sostener para otros lo que todavía no corre para nosotros, con la
  responsabilidad de que un cliente no pueda facturar. **Se revisa cuando cierre la Fase 1.**
- **Plantillas de automatización de n8n.** Nuestros workflows llevan credenciales dentro y
  el producto real que se compraría es el soporte ("no me anda el nodo"). Es mantenimiento
  que no podemos sostener con una persona vendiendo.
- **Curso o formación sobre IA.** No es nuestro conocimiento diferencial, el mercado está
  saturado, y compite por el mismo tiempo que la venta del sistema.

---

## D. Lo que NO conviene vender todavía

**Todo lo que depende de un tercero que aún no respondió:** emisión de factura fiscal por
el sistema (emisor mock, Fase 1 al 24,8 %, sin Punto de Venta 1), el chatbot en el número
propio del cliente (las cuatro credenciales de WhatsApp siguen en `SIN_CONFIGURAR`), y el
cobro automático con tarjeta o QR (sin cuenta empresa abierta en el BCP, sin credenciales
ni sandbox).

**Y todo lo que el producto no tiene aunque el nombre lo sugiera:** multi-sede (`branchId`
no existe en el repo), modo sin internet, visión por computadora, y los rubros veterinaria
y ganadería. Prometer cualquiera de estos hoy es vender una devolución.

---

## E. Lo que queda anotado (no se hace en esta sesión)

1. 🔴 **Barrer la promesa de SIAT en toda la superficie de venta**: los dos guiones del
   kit (`sales-kit/03-SCRIPTS-WHATSAPP.md`) y el bloque "EL HUECO" de onia.com.bo dicen
   que Onia cruza la factura SIAT. Hasta que el emisor esté encendido, es fabricar.
2. Los inboxes **4 y 5 de Chatwoot siguen huérfanos**: los leads del bot no aparecen en
   ninguna bandeja. Mientras tanto, `ONIA_LEADS_ESPERANDO.md` es la única copia legible.
3. La lista de reactivación **no tiene botón de exportar** (la pregunta 6 de la clínica de
   4 doctores). Es un CSV: trabajo chico, valor de venta directo.
4. El período de reactivación está **fijo en 180 días sin pantalla para cambiarlo**
   (pregunta 2 del mismo lead).

---

Fuentes: `ONIA_CATALOGO_DE_VENTA.md` · `ONIA_LEADS_ESPERANDO.md` ·
`ONIA_WEB_COMO_SE_VENDE.md` · `onia-platform/lib/subscription-plans.ts` ·
`onia-platform/lib/pricing.ts` · `onia-platform/lib/plan-limits.ts` ·
`onia-platform/lib/onia-core/modules/agents-runtime.ts` · producción (VPS + base
`supabase-db` + Chatwoot), medida el 2026-09-04.
