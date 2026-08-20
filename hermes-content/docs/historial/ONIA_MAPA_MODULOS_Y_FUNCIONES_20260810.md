# Onia Platform — Mapa de módulos, funciones reales y las que faltan

**Fecha:** 2026-08-10
**Repo auditado:** `C:\dev\proyectos\onia-platform` rama `master` @ `5bbae68` (solo lectura, no se editó nada)
**Método:** lectura de código + `npx vitest run` sobre los módulos (comercio/importadora 194 tests verdes · fiscal/rrhh/empresa/platform 416 verdes · agentes 160 verdes) + 2 probes HTTP a producción.
**Regla del documento:** cada afirmación tiene `archivo:línea` o comando verificado. Nada inventado. Si algo no se pudo verificar, se dice.

**Contexto de negocio que ordena las prioridades:** cero clientes pagando, runway corto. Este doc prioriza **lo que cierra una venta**, no lo que completa una funcionalidad.

**Los 4 estados:**

| Estado | Qué significa |
|---|---|
| **ANDA** | Existe y funciona punta a punta. Se puede demostrar sin miedo. |
| **A MEDIAS** | Existe pero le falta algo concreto para ser útil. Se dice exactamente qué. |
| **VITRINA** | Se ve en la pantalla y no hace nada real. Hace quedar mal. |
| **NO EXISTE** | No está en el código. Punto. |

---

## 0. El resumen en 6 líneas (si solo leés esto)

1. **El motor de agendar, cobrar y llevar el kardex está SÓLIDO.** Eso es un producto real.
2. **El diferencial que vendemos — los agentes que trabajan solos — está apagado en los dos extremos:** nadie los ejecuta (el cron no está declarado) y no tienen por dónde salir (un solo canal, WhatsApp, bloqueado por Meta).
3. **Estética y veterinaria hoy son la app dental con el odontograma escondido.** No tienen lo que define a su rubro (paquete de sesiones · mascota y vacunas).
4. **Servicios profesionales no puede cobrar un servicio.** No es opinión: el código lanza "Stock insuficiente".
5. **Tres módulos terminados — Contabilidad, Planilla y Empresa — son invisibles para casi todos los rubros** porque falta el link en el menú. Eso es plata regalada.
6. **Lo boliviano es de verdad y es el mejor argumento de venta que tenemos hoy:** vencimiento por dígito del NIT, bono de antigüedad, kardex sin saldo negativo, TCO obligatorio.

---

## 1. EL MAPA — qué funciona en cada rubro

### 1.1 El corazón del producto, rubro por rubro

Leer así: la fila es la función, la columna es el rubro. Lo que está en **ANDA** se puede demostrar mañana.

| Función (en criollo) | Dental | Comercio | Importadora | Estética | Veterinaria | Servicios prof. |
|---|---|---|---|---|---|---|
| **Ficha del cliente/paciente + buscador** | ANDA | — | — | ANDA | ANDA | **NO EXISTE la puerta de alta** |
| **Agenda de citas con horarios libres y anti-doble-reserva** | ANDA | — | — | ANDA | ANDA | A MEDIAS (sin clientes que agendar) |
| **Reserva online pública (el cliente se agenda solo)** | ANDA | — | — | ANDA | ANDA | — |
| **Catálogo de servicios/tratamientos con precio** | ANDA | ANDA | ANDA | ANDA | ANDA | ANDA |
| **Caja: cobrar y ver cuánto entró hoy** | ANDA (facturas) | A MEDIAS | A MEDIAS | ANDA (facturas) | ANDA (facturas) | **NO EXISTE** |
| **Inventario / kardex valorado** | — | ANDA | ANDA | — | — | — |
| **Fiados (a quién le fío y quién me debe)** | — | ANDA | ANDA | — | — | ANDA |
| **Historia clínica / evoluciones** | A MEDIAS | — | — | A MEDIAS | A MEDIAS | — |
| **Importar la base desde Excel/CSV** | A MEDIAS | ANDA | ANDA | A MEDIAS | A MEDIAS | — |
| **Panel "Hoy" con números reales** | ANDA | ANDA | ANDA | ANDA | ANDA | ANDA |
| **Lo propio del rubro** | Odontograma: **ANDA** | Código de barras: **NO EXISTE** | Costeo de importación: **ANDA** | Paquete de sesiones: **NO EXISTE** | Mascota y vacunas: **NO EXISTE** | Nada propio: **VITRINA** |

**Las celdas que hay que leer dos veces:**

- **Servicios profesionales no puede cobrar.** Toda venta pasa obligatoriamente por el kardex (`lib/comercio/ventas.ts:180`, sin condicional) y una salida sin saldo lanza `InsufficientStockError` (`lib/comercio/kardex.ts:106-110`) → la API devuelve 422. Un servicio no tiene stock. Al intentar cobrar la primera consulta el sistema responde literalmente: **"Stock insuficiente: disponible 0, solicitado 1"**. Además no tiene pantalla de alta de cliente: el segmento `patients` no está en su menú y el gate lo redirige (`lib/platform/route-access.ts:136-146`), así que la agenda arranca con un selector vacío que no hay forma de llenar.
- **Estética y veterinaria no tienen pantallas propias.** Sus packs reusan el objeto de navegación dental por referencia: `ESTETICA_PACK.nav = sidebarNavItems` (`lib/platform/vertical-pack.ts:296`) y `VET_PACK.nav = sidebarNavItems` (`:318`). Lo único que se les apaga es el odontograma (`app/(dashboard)/patients/[id]/page.tsx:60`).
- **Caja de comercio: una venta = UN producto.** `RegistrarVentaArgs` tiene un solo `variantId`+`qty` (`lib/comercio/ventas.ts:39-48`) y el formulario tiene un solo selector (`caja/VentaForm.tsx:135`). No hay carrito, no hay descuento, no hay anulación, no hay ticket impreso.
- **Costeo de importación: calcula perfecto y no entra al inventario.** El prorrateo multilínea al centavo por valor/peso/volumen es excelente (`lib/importadora/costeo.ts:184,219`) y el servidor nunca confía al navegador (`app/api/importadora/costeo/route.ts:60`). Pero `costeo.ts` **no llama a `registerStockMovement` en ninguna línea**: se costea el contenedor, se fija el precio, y el stock sigue en cero.

### 1.2 Lo transversal (sirve a los 6 rubros)

| Función | Estado | Evidencia y qué le falta | ¿A qué rubros les llega hoy? |
|---|---|---|---|
| **Contabilidad Bolivia (IVA 13% / IT 3%, vencimiento por dígito del NIT, RCV de ventas en CSV)** | **A MEDIAS** | Vencimiento DS 25619 correcto (`lib/fiscal/tax-calendar.ts:15-26`) + recordatorio automático a 5 días. El **débito** es real; el **crédito fiscal casi siempre da 0** porque solo se alimenta de compras a crédito de comercio (`lib/comercio/compras.ts:89`) o gastos con factura del módulo Empresa (`lib/empresa/gastos.ts:117`). **No hay libro de compras** (`rcv-export.ts` solo tiene `buildRcvVentasCsv`). | comercio, importadora, servicios. **Dental/estética/vet no la ven en el menú** (`components/layout/navigation.ts:40` apunta a `/accounting`) |
| **Planilla de sueldos (bono de antigüedad DS 21060, aporte laboral 12,71% Ley 065, RC-IVA, CSV al contador)** | **ANDA** | Es la pieza más terminada de todo el producto: cada alícuota con su norma citada, salario mínimo configurable por org, y lo que no sabe lo declara en vez de inventarlo (`lib/rrhh/planilla.ts:113-173` + `:12-18`). No liquida aportes patronales **a propósito**. | comercio, importadora, servicios. **Invisible para los 3 rubros clínicos** |
| **Empresa: gastos con factura → crédito fiscal automático** | **ANDA** | Lo más útil del módulo nuevo: con número de factura + NIT crea el proveedor y la fila de crédito fiscal **en la misma transacción** (`lib/empresa/gastos.ts:89-133`). Sin factura no hay crédito (Ley 843 art. 8) y el gasto igual se controla. | **Solo servicios profesionales** lo tiene en el menú (`vertical-pack.ts:346`) |
| **Empresa: colaboradores y comisiones** | **A MEDIAS** | La matemática es sólida (se paga contra lo cobrado, mes vencido, candado UNIQUE en la base contra doble pago). **Pero los cobros los tipea el usuario a mano** — la caja del producto no los alimenta (`app/api/empresa/commissions/route.ts:10-12`). Es una calculadora con historial, no automatización. | ídem |
| **Empresa: reuniones** | **A MEDIAS** | Sin calendario propio y sin tabla nueva: son eventos del core más un link externo a Cal.com/Calendly, cargados a mano (`app/(dashboard)/empresa/reuniones/page.tsx:1-6`). Sirve de bitácora. | ídem |
| **Equipo, usuarios y roles** | **ANDA en dental / A MEDIAS en el resto** | El alta crea el usuario en Supabase con la contraseña puesta y `email_confirm: true` (`app/api/team/route.ts:82-102`) — por eso funciona pese al correo roto. Pero la tabla de permisos finos es **solo dental** (`lib/onia-core/roles.ts`): en comercio/importadora/servicios el rol es una etiqueta sin permisos resueltos (admitido en `vertical-pack.ts:113-118`). | los 6 |
| **Facturación electrónica SIAT** | **A MEDIAS — hoy es SIMULACIÓN y ni siquiera está encendida** | Tres candados verificados: (1) el flag `SIAT_EMISSION` **no está definido en ningún archivo de entorno del repo**, solo en `.env.example:136` vacío; (2) sin `SIAT_SERVICE_URL` el cliente devuelve un CUF falso con `codigoEstado: 908` "validado" y **cero llamadas de red** (`lib/fiscal/siat-client.ts:85-100,122-125`); (3) doble gate por `PLATFORM_LAYER` y entitlement. Además **solo emite desde el flujo de facturas dentales** — la caja de comercio no emite nada. | ninguno, hoy |
| **Cola de aprobación (el humano aprueba antes de que salga)** | **A MEDIAS** | La cola muestra el mensaje EXACTO antes del botón, con el motivo si el canal no puede ejecutar (`app/(dashboard)/pending/page.tsx:53-68`). Aprobar es atómico e idempotente. **Pero el despachador tiene un solo adapter: WhatsApp** (`lib/onia-core/dispatch/channels.ts:86-88`, verificado). Con Meta bloqueado, aprobar solo puede fallar. | los 6 |
| **Correo del producto** | **VITRINA / roto** | `.env.prod` trae `RESEND_API_KEY=""`, `RESEND_FROM_EMAIL=""` literalmente vacías. El aviso de comprobante de pago se salta en silencio (`app/api/subscription-payment/route.ts:132-146`). Nunca envió nada. | los 6 |
| **Pasarela de pagos** | **VITRINA** | `gatewayEnabled: false` en **los 5 planes** (`lib/plan-limits.ts:63,76,91,104,117`, verificado). Ningún cliente puede activarla. El cobro real es QR + comprobante + aprobación manual de SUPERADMIN, y eso sí funciona. | ninguno |
| **Reportes** | **A MEDIAS — dental-only** | `/reports` consulta solo `invoice`, `appointment`, `patient` y **no está declarada en el menú de comercio/importadora/servicios**, así que el gate se la bloquea. Esos 3 rubros no tienen pantalla de reportes. | dental (y estética/vet por herencia) |

### 1.3 Los agentes IA — el diferencial, medido con honestidad

Hay **3 agentes** en el catálogo (`lib/onia-core/modules/agents-runtime.ts:81-119`). No hay más.

| Agente | Qué propone | Estado |
|---|---|---|
| **Recall** | Al paciente que no vuelve hace ≥180 días y no tiene próxima cita, le redacta "tu última visita fue hace N meses, ¿te agendamos un control?" | **A MEDIAS** — propone bien, no puede enviar |
| **Cobrador** | Factura vencida (dental) o fiado vencido (comercio/importadora/servicios): redacta el reclamo con número, saldo y días de atraso | **A MEDIAS** — ídem |
| **Captador inmobiliario** | Califica leads que entran por formulario o correo, hace hasta 3 toques y abre tarea cuando el lead está caliente | **NO EXISTE en la práctica** |

**Dónde se corta el circuito — los 3 candados, verificados uno por uno:**

1. **Nadie los ejecuta.** El único disparador es `GET /api/cron/onia-agents`, y ese path **no está en `vercel.json`** (verificado: el archivo declara exactamente 3 crons — `appointment-reminders`, `recurring-invoices`, `onia-core-workitems`). Tampoco lo llama ningún workflow n8n de los 71 en vivo, ni ningún script. Los agentes solo corren si alguien hace `curl` a mano.
2. **El interruptor global no está puesto en ningún entorno del repo.** `AGENTS_RUNTIME` solo aparece en `.env.example:151` con valor `""` (verificado). Sin `=== "1"` el cron responde `{ok:true, skipped:"flags_off"}`.
3. **No hay por dónde salir.** Un solo adapter (WhatsApp). Con Meta bloqueado, aprobar deja el envío en `failed` con el error a la vista — **no finge que mandó**, que está muy bien hecho — pero no sale nada.

🔴 **Efecto colateral no manejado:** al aprobar, la acción queda en `approved` para siempre y el dedupe la cuenta como "ya contactado" (`agents-runtime.ts:140-141`). Con Meta bloqueado, **cada aprobación quema un paciente o una factura sin que salga un solo mensaje**, y ese objetivo no vuelve a aparecer nunca. Un reintento exitoso lo arregla; si no, se perdió.

**Probes a producción (dentalgest.app, hoy):** `GET /api/cron/onia-agents` sin auth → **401** (la ruta vive y tiene secreto, solo falta quien la llame). `GET /api/onia-core/agents/feed` → **503 "Service not configured"** (la API externa de agentes está muerta en prod: falta `AGENT_RUNTIME_SECRET`).

**Traducción comercial: el diferencial que más vendemos vale hoy exactamente cero, y lo que lo separa de valer algo no es Meta — son 4 líneas en `vercel.json` y una variable de entorno.**

---

## 2. LOS 5 HUECOS QUE MÁS DUELEN PARA VENDER

Ordenados por cuánto frenan una venta, no por cuánto cuesta arreglarlos.

### Hueco 1 — El sistema no puede mandar un solo mensaje, y eso es literalmente lo que vendemos
**Rubros afectados: los 6.**
Es la demo: "te recuerda la cita solo", "te cobra los vencidos solo". Hoy: los agentes no corren (cron no declarado + flag sin poner), el recordatorio de citas corre **una sola vez al día a las 12:00 UTC** contra ventanas de ±1 hora (`vercel.json` + `app/api/cron/appointment-reminders/route.ts:114-190`) — así que la mayoría de las citas nunca dispara nada aunque se arregle el correo —, WhatsApp está bloqueado por Meta y el correo nunca funcionó. **Un prospecto que pide ver esto en vivo no lo ve.**

### Hueco 2 — Servicios profesionales no puede cobrar ni cargar un cliente: es un rubro entero no vendible
**Rubro afectado: servicios profesionales (1 de los 6 que estamos ofreciendo).**
Dos bloqueos duros de código, no de configuración: la venta exige kardex (`ventas.ts:180`) y el alta de cliente está fuera de su menú (`route-access.ts:136-146`). Encima es el único rubro **sin demo sembrada** (`lib/platform/demo-provisioning.ts:95-101`, `seed: null`): un prospecto entra a un tenant vacío. Vender esto hoy es vender algo que se rompe en la primera consulta cobrada.

### Hueco 3 — Veterinaria: no existe la mascota, y "vacunas" está escrito en la página de registro
**Rubro afectado: veterinaria.**
Hoy la veterinaria carga al **dueño** como paciente y la mascota no existe en ninguna parte: no hay modelo `Pet`, y `Patient` es una persona con CI, género y tipo de sangre humano (`prisma/schema.prisma:578-614`). Dos perros del mismo dueño se pisan (el booking público hace match por teléfono). Especie, raza, peso, chip: cero coincidencias en todo el repo. **Y el carnet de vacunas — que es exactamente el motor de recurrencia por el que una veterinaria paga un software — no existe, pero está prometido en la tarjeta de registro:** *"Agenda, pacientes, **vacunas** y cobros"* (`app/(auth)/register/page.tsx:81`). La palabra "vacuna" aparece **una sola vez en todo el código: en esa promesa comercial.**

### Hueco 4 — Estética: no existe el paquete de sesiones
**Rubro afectado: estética.**
"Vendo 10 sesiones, llevo 4, quedan 6, vencen tal fecha" es LA pregunta de una estética y **no existe** (grep de `paquete|sesion` fuera de "iniciar sesión": cero). Se factura como tratamiento suelto sin saldo de sesiones. Tampoco hay ficha por sesión (zona, equipo, producto) ni comparador de fotos antes/después — hay un adjuntador de archivos genérico sin tipo "foto clínica" (`lib/onia-core/collab.ts:101`). De las tres cosas que definen a una estética, **ninguna está**.

### Hueco 5 — Comercio: la caja se cae en la primera prueba de 5 minutos
**Rubros afectados: comercio minorista e importadora.**
Cuatro cosas que un comerciante prueba en los primeros cinco minutos y no encuentra: **(1)** el lector de código de barras no sirve — la columna `barcode` está en la base y **ningún archivo del código la lee ni la escribe** (verificado con grep: cero resultados), y el buscador exige clic con el mouse; **(2)** una venta = un producto, sin carrito ni descuento; **(3)** no se puede corregir un precio ni editar un producto — **no existe ningún PATCH, PUT ni DELETE en toda la API de comercio** (verificado); **(4)** no se puede anular una venta mal cargada. Y del lado importadora: **lo que se costea no entra al stock**.

**El sexto que casi entra:** el crédito fiscal de la contabilidad da 0 para todo cliente que no cargue gastos por el módulo Empresa. El contador recibe el libro de ventas y no el de compras.

---

## 3. LO QUE YO CONSTRUIRÍA (y lo que no)

### (a) LAS BARATAS QUE RINDEN YA — reusan algo que ya existe

Ordenadas por retorno sobre horas. Todas reutilizan código ya escrito y probado.

| # | Qué | Archivo a tocar | Tamaño honesto | Por qué rinde |
|---|---|---|---|---|
| **1** | **Encender los agentes**: agregar `/api/cron/onia-agents` a los crons y poner `AGENTS_RUNTIME=1` en producción | `vercel.json` (4 líneas) + variable de entorno | **1 hora** | Enciende el diferencial. Aunque WhatsApp siga bloqueado, el sistema empieza a **proponer**: la cola `/pending` y el bloque "El sistema trabajó por vos" del dashboard (`dashboard/page.tsx:583-667`) se llenan de trabajo real. Eso ya se demuestra en una venta. |
| **2** | **Poner Contabilidad, Planilla y Empresa en el menú de los 6 rubros** | `lib/platform/vertical-pack.ts` + `components/layout/navigation.ts` | **30 minutos** | Verificado: `contabilidad`, `rrhh` y `empresa` **ya son rutas comunes a todos los packs** (`lib/platform/route-access.ts:51-86`, `COMMON_SEGMENTS`) — están accesibles y solo falta el link. Son **tres módulos terminados** que hoy no ve casi nadie. Es la mejor relación plata/hora de toda la lista. |
| **3** | **Enlazar Recetas desde la ficha del paciente** | `app/(dashboard)/patients/[id]/page.tsx` | **15 minutos** | La pantalla de recetas está completa (varios medicamentos, dosis, frecuencia, impresión con membrete) y **nada la enlaza** — verificado: no hay una sola referencia entrante fuera de su propia carpeta. Solo se llega tecleando la URL. Es una feature entera regalada. |
| **4** | **Botón "No asistió" en la cita** | `app/(dashboard)/appointments/page.tsx` | **1 hora** | Verificado: el estado existe en la API, tiene colores y etiqueta en 6 pantallas, y **el dashboard y Operaciones ya muestran el KPI "no asistencias del mes"**… que siempre marca 0 porque ningún botón lo escribe. Es apagar una vitrina construyendo casi nada. |
| **5** | **Destapar la pestaña Doctores para estética y veterinaria** | `app/(dashboard)/settings/page.tsx:26` | **30 minutos** | Verificado: el flag que la esconde es `esComercio = trackId !== "dentagest-clinical"`, que mete a una veterinaria en la misma bolsa que una ferretería. Hoy una veterinaria **no puede cambiar el horario de su veterinario** (queda clavado 08-18). La API ya los autoriza: es solo la UI la que está tapada. |
| **6** | **Cerrar el agujero del export contable** (agregar el gate de plan) | `app/api/fiscal/rcv-export/route.ts:12` | **15 minutos** | Verificado: la UI esconde el botón en plan Básico pero el endpoint solo pide `requireAdmin()`. Un cliente de 320 descarga por URL lo que se cobra en el plan de 750. |
| **7** | **Subir el recordatorio de citas a cada hora** | `vercel.json` (`0 12 * * *` → `0 * * * *`) | **15 minutos** | Sin esto, arreglar el correo **no alcanza**: hoy la ventana de 24 h solo alcanza citas del día siguiente entre 07:00 y 09:00 Bolivia. El resto nunca dispara. |
| **8** | **Adapter de correo en el despachador** + poner la clave de Resend | `lib/onia-core/dispatch/channels.ts` (~30 líneas) | **1 día** | Verificado: hoy hay **un solo adapter** en el `Record` de canales. Con esto la cola de aprobación empieza a **enviar de verdad sin depender de Meta**, y de paso se arregla el correo del producto. Es el desbloqueo más grande por peso. |
| **9** | **Arreglar el plan de tratamiento (bug `uuid` vs `cuid`) + botón "Agregar tratamiento"** | `app/api/patients/[id]/treatments/route.ts:9,11` + `patients/[id]/page.tsx:370` | **1 día** | Verificado: el endpoint valida `z.string().uuid()` mientras Prisma genera **cuid** → con ids reales devuelve 400 "Datos inválidos". No hay forma de asignarle un tratamiento a un paciente. Arreglarlo enciende además el **reporte de balance clínico**, que hoy siempre muestra 0 producción. |
| **10** | **Sacar el Confirmador de citas del add-on inmobiliario** | `lib/onia-core/modules/agents-runtime.ts` (~25 líneas) | **1 día** | La lógica ya existe y está testeada (cita a menos de 6 h que no confirmó → abre tarea), pero está **encerrada dentro del captador inmobiliario**, o sea detrás de un add-on **que nadie puede comprar** (verificado: el feature `addon.inmobiliaria` no lo otorga ningún checkout). Sirve igual a dental, estética y veterinaria. Y como genera tareas y no mensajes, **funciona con Meta bloqueado**. |
| **11** | **Hacer vendible Servicios Profesionales**: marcar el producto como "servicio" para que saltee el kardex + darle la puerta de alta de cliente | `lib/comercio/ventas.ts:180` + nav del pack en `vertical-pack.ts:334` | **2-3 días** | Es el único ítem de esta lista que cuesta días, y desbloquea **un rubro entero de los 6** que hoy no se puede vender. Contadores, abogados, consultoras: el mercado más grande y el más fácil de explicar. |

**Total del bloque 1-7: menos de un día de trabajo junto.** Ese día enciende el diferencial, revela tres módulos terminados, mata dos vitrinas y tapa un agujero de plata.

### (b) LAS QUE VALEN SI HAY CLIENTE QUE PAGUE

Regla: **no se construyen antes de la firma.** Cada una es un rubro específico y sin ese cliente es adivinar.

| Qué | Rubro | Tamaño honesto | Condición para arrancar |
|---|---|---|---|
| **Ficha de mascota + carnet de vacunas con vencimientos** (un dueño, N mascotas; la cita y la historia son de la mascota; recordatorio de vacuna) | Veterinaria | **1,5 - 2 semanas** (toca el modelo de datos, la agenda y la historia clínica) | Una veterinaria firmando. Es el motor de recurrencia del rubro — sin esto no hay veterinaria, con esto hay una razón para pagar todos los meses. |
| **Paquete de sesiones** (vendo 10, consumo 4, quedan 6, vence; alerta de "te toca la sesión 5") | Estética | **1 semana** | Una estética firmando. Es la pregunta #1 del rubro. |
| **Embarque como entidad + que lo costeado entre al inventario** | Importadora | **1,5 semanas** | Un importador firmando. Hoy el costeo se calcula perfecto y el resultado se pierde: no hay dónde reabrirlo ni corregirlo, y el stock queda en cero. |
| **Caja de verdad: carrito multi-ítem, código de barras por teclado, anular venta, editar producto/precio** | Comercio | **1,5 - 2 semanas** | Una ferretería/tienda firmando. Son las 4 cosas que se prueban en los primeros 5 minutos. |
| **Carga de facturas de compra + libro de compras en CSV** | Transversal | **1 semana** | Un cliente que declare IVA en serio (o sea, casi cualquiera al segundo mes). Convierte el resumen de IVA de decorativo en declarable. Reusa la tabla de crédito fiscal que ya escribe el módulo Empresa. |
| **Emisión SIAT real** | Transversal | El código está; **el bloqueo es el NIT y la homologación**, no programar | Bloqueo de Sergio (S2). Antes de encenderlo hay que resolver dos cosas o sale incompleto: las notas de crédito fiscales y las ventas de los rubros que no facturan por el flujo dental. |
| **Alimentar las comisiones desde los cobros reales** | Transversal | **3-4 días** | Cuando haya colaboradores comerciales cobrando. La firma de la función ya está pensada para eso. |

### (c) LAS QUE NO HARÍA — y por qué

Esto está acá para frenar el impulso de construir de más. Con cero clientes, cada semana gastada en esto es una semana sin vender.

| Qué NO haría | Por qué no |
|---|---|
| **Agente con LLM** | El captador está escrito a propósito con un parser determinista, y las llamadas a modelo están declaradas como salida externa controlada en la config de guardrails. Meter un LLM rompe el diseño, agrega gasto por cliente y **no vende nada más** que el agente determinista que ya existe y no corre. |
| **Pasarela de pagos automática** | `gatewayEnabled: false` en los 5 planes. El cobro por QR + comprobante + aprobación manual **ya funciona** y con menos de 20 clientes se opera a mano en 5 minutos por mes. Integrar una pasarela es semanas de trabajo y comisión regalada para resolver un problema que no tenemos. |
| **Contabilidad plena** (plan de cuentas, libro diario, asientos, mayor, activos fijos, depreciación, ajuste por inflación, cierre de gestión) | Son meses y es competir con software contable establecido. El propio código ya lo declara fuera de alcance. El cliente no nos compra para reemplazar a su contador — nos compra para **no tipear dos veces**. |
| **Un 7mo rubro** | Hay 6 y **ninguno tiene un cliente pagando**. Sumar el 7mo es multiplicar superficie sin validar ninguna. Antes de abrir otro rubro, cerrar servicios profesionales que ya está a medio construir. |
| **Módulos `automation` y `knowledge` del core** | El core los declara y el producto no los implementa. Construirlos ahora es **completar el catálogo, no vender**. La "automatización" que importa ya está escrita (los agentes) y está apagada — encenderla cuesta 1 hora, construir el módulo cuesta semanas. |
| **Reportes avanzados / BI / dashboards nuevos** | Nadie compra por reportes cuando todavía no hay datos cargados. El panel "Hoy" ya cubre lo que un dueño mira todos los días. |
| **Un 4to agente que apunte al mismo objetivo que uno existente** | Hay un choque real: dos agentes que propongan sobre el mismo paciente o factura colisionan en el dedupe y el segundo hereda la aprobación del primero. Es un arreglo de una línea — **hay que hacerlo antes** de sumar agentes, no después. |
| **Rediseño de la UI** | La UI no es el problema. El problema es que tres módulos terminados no están en el menú y el diferencial no corre. |
| **Onia Box / servidor privado / centros de costo** | Están anunciados como tarjetas dentro del producto (ver sección 5). Son venta enterprise sin un solo cliente pyme cerrado. |

---

## 4. EL DIFERENCIAL — qué tiene Onia que un competidor no

**La frase vendible (respaldada por el código, no por el marketing):**

> **"Onia no le escribe a tu cliente sin tu permiso, y está hecho para Bolivia de verdad: sabe cuándo vence tu IVA según tu NIT, calcula el bono de antigüedad con la norma en la mano y no te deja el stock en negativo."**

Las tres patas, y cuál está lista:

**1. El humano aprueba antes de que salga — construido, correcto, y hoy apagado.**
No es un chatbot que manda solo. El sistema te muestra **el mensaje exacto, el canal y el destinatario ANTES del botón** (`app/(dashboard)/pending/page.tsx:53-68`), aprobar es atómico y a prueba de doble clic (candado UNIQUE en la base), lo desconocido va a aprobación humana por diseño en vez de auto-ejecutarse, hay tope de 20 mensajes por día por cliente, y cuando **no puede enviar te lo dice en la cara con el error en vez de simular que mandó**. 160 tests verdes. Es un diseño mejor que el de la competencia — y hoy no corre. **Encenderlo cuesta 1 hora.**

**2. Bolivia de verdad — esto SÍ está listo y es lo que vende hoy.** Ningún competidor genérico ni extranjero tiene:
- Vencimiento de IVA/IT **según el último dígito de tu NIT** (DS 25619) + recordatorio automático 5 días antes (`lib/fiscal/tax-calendar.ts:15-26`).
- **Bono de antigüedad DS 21060**, aporte laboral 12,71% Ley 065 y RC-IVA, con el salario mínimo como configuración (no una constante que caduca con el próximo decreto) — `lib/rrhh/planilla.ts:113-173`.
- **Kardex boliviano**: promedio ponderado y **prohibido el saldo negativo** (`lib/comercio/kardex.ts:106-114`).
- **Tipo de cambio obligatorio, nunca hardcodeado**, porque la RND 102600000026 exige el total en bolivianos (`lib/importadora/costeo.ts:65`).
- Y cuando el sistema no sabe algo (aportes patronales, retenciones), **lo declara y lo deriva al contador** en vez de inventar un número. Eso, para un contador boliviano, es confianza.

**3. Costeo de importación al centavo — nadie más lo tiene en este segmento.**
Prorrateo multilínea por valor, peso o volumen que cierra exacto al centavo, con el servidor recalculando siempre (nunca confía en lo que manda el navegador) y dejando un rastro auditable en cada producto (`lib/importadora/costeo.ts:184,219,317-401`). Para un importador esto reemplaza una planilla de Excel que arrastra desde hace años.

**La honestidad del diferencial:** la pata 1 está apagada, así que **hoy vendemos con las patas 2 y 3**, que son reales y demostrables. Después de la primera hora de trabajo (bloque 3a), la pata 1 entra a la demo.

---

## 5. LO QUE HAY QUE APAGAR O ESCONDER YA

Todo esto se ve en la pantalla y hoy hace quedar mal. Sacarlo cuesta minutos y no rompe nada.

| # | Qué esconder | Dónde | Por qué duele |
|---|---|---|---|
| **1** | **La palabra "vacunas"** en la tarjeta de veterinaria del registro | `app/(auth)/register/page.tsx:81` | Promete lo único que una veterinaria realmente busca y **no existe una sola línea de código que lo implemente**. Es la promesa más rompible del producto. |
| **2** | **Las 6 tarjetas de "módulos avanzados"** en la pantalla de Contabilidad dental ("Libro de ventas — Operativo interno", "Centros de costo — Enterprise", "SIAT — Cotizado", "Servidor privado — Enterprise") | `app/(dashboard)/accounting/page.tsx:110-143` (render `:299-312`) | Es **material de venta metido adentro del producto que el cliente ya pagó**. Se lee como "lo que compraste no incluye nada de esto". Y una de ellas anuncia SIAT, que hoy no emite. |
| **3** | **El bloque de horarios de solo lectura** en Configuración (apertura, cierre, duración de turno, zona horaria: cuatro valores en texto plano, sin campos y sin botón de guardar) | `SettingsClient.tsx:330-344` | El cliente ve la configuración de su negocio y no la puede tocar. La API para guardarla **existe y no la llama nadie** (`app/api/clinic-settings/route.ts:42`) — o se le ponen los campos (medio día) o se saca la sección. |
| **4** | **El texto "corre cada N horas"** en la pantalla de Agentes | `app/(dashboard)/agents/page.tsx:114` | Hoy no corre nunca. Además no hay ningún botón para pausar o activar un agente: el campo `enabled` solo se escribe al crearlo y **nunca se actualiza**. |
| **5** | **La sección "Tratamientos" de la ficha del paciente sin botón para agregar**, y el reporte de Balance Clínico que siempre muestra 0 | `patients/[id]/page.tsx:370-373` · `reports/clinical-balance/page.tsx:62-68` | Una sección vacía que no se puede llenar y un reporte de producción que da cero en una clínica que factura. Se arregla con el ítem 9 del bloque (a); mientras tanto, esconder el reporte. |
| **6** | 🔴 **El directorio público `/book` que lista TODAS las organizaciones de la plataforma** — nombre, teléfono y email — bajo el título *"Reserva tu cita dental"* | `app/(public)/book/page.tsx:12-21,30` (verificado) | Dos problemas: **(a)** es una página sin login que publica la lista completa de clientes de Onia con sus datos de contacto; **(b)** una veterinaria o una estética aparecen bajo un título que dice "cita dental". Hoy con 0 clientes no duele; con 10 es un problema serio. La reserva por link directo (`/book/<negocio>`) funciona perfecto y es la que hay que usar — **el índice general hay que sacarlo o poner detrás de login**. |
| **7** | **Servicios profesionales, del checkout**, hasta arreglar el kardex | `lib/platform/vertical-pack.ts:334` + checkout | Vender un rubro que **no puede cobrar** es la peor venta posible: el cliente descubre el problema el primer día. O se arregla (ítem 11 del bloque a, 2-3 días) o se saca de la vitrina. |
| **8** | **La pasarela de pagos**, si aparece en la comparación de planes | `lib/plan-limits.ts:63-117` | `gatewayEnabled` es `false` en los 5 planes: ningún cliente puede activarla, en ningún plan. |
| **9** | **El nombre "Módulo gerencial"** para la pantalla de contabilidad dental | `app/(dashboard)/accounting/page.tsx` | Nombre que promete más de lo que hay. La pantalla buena es `/contabilidad` — a la que además el cliente dental no llega desde el menú. |

---

## 6. Lo que NO se pudo verificar (para no mentirle a nadie)

- **Si las migraciones están aplicadas en la base de producción.** El repo tiene `20260804000000_add_onia_commerce_purchases` y `20260810000000_add_onia_empresa`; el código es fail-soft y avisa "pendiente de activación" si las tablas no están. La suite de tests corre hoy contra una base **sin** la tabla de compras. No se consultó la base de prod.
- **El valor real de `SIAT_EMISSION`, `AGENTS_RUNTIME` y las claves de correo en el contenedor de producción.** No aparecen en ningún archivo del repositorio. `PLATFORM_LAYER=1` sí tiene que estar puesto (sin él los 6 rubros no existirían). Los dos probes HTTP que sí se hicieron confirman que `CRON_SECRET` está configurado y que `AGENT_RUNTIME_SECRET` **no** lo está.
- **No se abrió la aplicación corriendo.** Todo lo de arriba es lectura de código, ejecución de la suite de tests y dos llamadas HTTP a producción.

---

## 7. Qué haría el lunes a la mañana (si hay que elegir)

1. **Una hora:** encender los agentes (cron + flag), poner Contabilidad/Planilla/Empresa en el menú de los 6 rubros, enlazar Recetas, cerrar el agujero del export contable, subir el recordatorio a cada hora.
2. **Ese mismo día:** sacar de la vista las 9 vitrinas de la sección 5. Empezando por "vacunas" y por el directorio público `/book`.
3. **Esa semana:** el adapter de correo (1 día) + el bug del plan de tratamiento (1 día) + el Confirmador de citas fuera del add-on (1 día). Con eso el sistema **propone y envía** sin depender de Meta.
4. **La siguiente:** hacer vendible Servicios Profesionales (2-3 días) — un rubro entero de los 6 pasa de no vendible a vendible.
5. **Nada de la lista (b) hasta que alguien firme.** Y nada de la lista (c) nunca, salvo que un cliente lo pague por adelantado.
