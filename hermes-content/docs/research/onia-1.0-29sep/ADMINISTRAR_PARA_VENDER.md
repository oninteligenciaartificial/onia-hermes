# Cómo administrar Onia para empezar a vender

Para Sergio Urcullo · 29-sep-2026 · solo lectura: no toqué ningún repo, no entré a producción ni a QA, no creé cuentas y no gasté nada.

**Qué código se miró.** Producción corre `onia-platform:release-c3b92067`. El candidato 1.0 está en `C:/dev/proyectos/onia-platform-v1-integracion-20260927`, rama `codex/v1-integracion-20260927`. La auditoría se hizo sobre `1756ef90` y `314b992a`, y al escribir esto el HEAD ya es `a76e7bf8`, 142 commits por delante de producción. Algunas líneas citadas del candidato pueden haberse corrido. **"solo 1.0"** = está en el candidato y no en producción.

**Cómo leer la evidencia:**
- **[T]** hay test.
- **[E]** lo recorre un e2e.
- **[P]** lo medí en producción hoy.
- **[C]** solo está cableado en el código.
- **[X]** no existe o está roto.
- **[I]** es inferencia o estimación mía, no una medición.

**Minutos de Sergio Urcullo.** Todos los minutos que aparecen acá son **[I]**, estimados por la cantidad de pasos y campos. Nadie los midió, y medirlos es justo el hueco #4 (§4).

**Precios.** Salen solo de `lib/subscription-plans.ts` (planes) y de `lib/pricing.ts` (add-ons) del candidato. Si difieren de otro material, manda el código.

---

## 1. A quién le vendemos primero y por qué

### 1.1 La etapa vigente, con los números de hoy

| Qué | Valor | Fuente |
|---|---|---|
| Etapa vigente | **Etapa 1: producto único, hasta 5 clientes**, decidida por Sergio Urcullo el 5-sep | `ONIA_ESTRATEGIA_DE_EMPRESA.md:218-224`, `:680-692` |
| Criterio de salida | **Bs 3.750/mes recurrente cobrado** | idem `:224` |
| Rubro que se persigue | dental y estética. Los demás se atienden si llegan, sin buscarlos | ESTRATEGIA `:220`; `ONIA_CLIENTE_IDEAL.md:143-150` |
| Break-even | gasto mensual ÷ precio del plan. Con el gasto de Bs 3.650/mes (ESTRATEGIA `:153`, no re-medido hoy) salen **5 clientes en Profesional (Bs 890), 7 en Crece (Bs 550) y 12 en Básico (Bs 320)** [D] | `subscription-plans.ts:40-42` |
| Pagos recibidos | **0**: `subscription_payments` no tiene ninguna fila | [P] SQL de solo lectura en `supabase-db`, 29-sep |
| Organizaciones en producción | 4, y ninguna es un cliente: `onia-interna`, `clinica-sergio-p2ljs` (dental, prueba hasta el 18-oct), `tienda-la-esquina-bf9kq` (comercio, prueba hasta el 2-oct) y `bolivian-electricidad-e6t21` (importadora, prueba vencida el 14-sep) | [P] mismo SQL |
| Pedidos de acceso sin contestar | **3 de 3** (`access_requests.contactedAt` NULL) | [P] mismo SQL |

⚠️ **El número de salida quedó calculado con un precio viejo.** Los Bs 3.750 salen de 5 × 750, el precio anterior de Profesional (ESTRATEGIA `:153`). Hoy Profesional cuesta Bs 890 (`subscription-plans.ts:42`), así que 5 clientes Profesional son Bs 4.450. El criterio lo fija Sergio Urcullo y no lo cambio acá: lo dejo señalado para que decida si se recalcula.

✅ **Una traba de la estrategia ya está resuelta.** ESTRATEGIA `:203` dice que `app.onia.com.bo/privacy` declara una entidad que no existe. Hoy esa ruta redirige a `onia.com.bo/privacidad` (OniaAgency) tanto en producción como en el candidato (`app/privacy/page.tsx:6-8`, `git show c3b92067:app/privacy/page.tsx`). El checkout cobra a nombre de OniaAgency, NIT 5371375010 (`CheckoutClient.tsx:103`).

### 1.2 El cliente ideal (resumen de `ONIA_CLIENTE_IDEAL.md`)

- **Una clínica de Santa Cruz con 2 a 6 profesionales y recepción,** que hace tratamientos de varias sesiones y hoy agenda en cuaderno, Excel o WhatsApp (`:22-24`, `:34-41`).
- **El dolor que abre la venta es el paciente con el tratamiento a medias que no volvió.** La facturación no abre la venta, y el SIAT **no** se usa como argumento de urgencia (`:104-117`).
- **Se le vende desde Crece:** ahí empiezan los agentes y la reserva pública. A quien puede pagar Crece no se le vende Básico (`:57-62`).
- **Cinco preguntas para calificarlo.** La que vende es la 4: "¿cuántos pacientes tienen un tratamiento empezado y no volvieron?" (`:202-215`).

### 1.3 Qué rubro está listo para vender hoy (sin maquillaje)

| Rubro | ¿Se vende hoy? | Por qué |
|---|---|---|
| **Dental** | **Sí.** Se muestra, pero no se promete "probado", porque nadie lo usó con un cliente | Agenda, citas, fichas, odontograma, cobros con nota de venta, importación CSV, recordatorio por correo y agentes que proponen. Los e2e de los cinco rubros pasaron (`e2e/v1/cinco-rubros.spec.ts`) [E]. Le faltan cosas de todos los días: **no hay botón para "Confirmar" una cita ni para marcar "No asistió"**, aunque la API los acepta (`app/api/appointments/[id]/route.ts:18`) [X] |
| **Estética** | **Piloto**, en las mismas condiciones que dental | Usa la misma pantalla dental y solo cambia el rótulo "Clientas". No tiene paquetes de sesiones. La cuenta de prueba nace vacía (`demo-provisioning.ts:87`). **El titular de la web** ("la clienta que dejó el tratamiento a medias…", `switcher.tsx:70`) **depende del Plan de tratamiento y del agente Tratamiento a medias, que son solo 1.0**: con producción de hoy esa promesa no se cumple |
| **Importadora** | **Piloto acotado**: solo costeo y cotizaciones | El costeo y la alerta de reprecio son lo más fuerte del rubro [E]. Pero la cotización no sale del sistema (no hay PDF ni envío), "Convertir en pedido" es un callejón sin salida y "Sigue cotizaciones" no tiene a qué teléfono escribir (`cotizaciones.ts:109-113`, `channels.ts:162-166`) [X] |
| **Servicios profesionales** | **No** | El Inicio es el panel de mostrador y no muestra ninguna cita (`vertical-pack.ts:483`, `633-635`). Los servicios no se pueden editar (`api/comercio/products/route.ts:49,83`). En Básico, Crece y Profesional nadie más que el dueño puede tener agenda (`roles-agenda.ts:22` + `coadministradores.ts:34-35`). No hay SIAT |
| **Comercio** | **No** | No se puede editar un producto ni su precio, no se puede reponer stock de un producto que ya existe (la API `movements` no tiene pantalla) y "Avisa stock bajo" nunca se dispara porque no hay dónde cargar el punto de reorden (`agents-runtime.ts:707-712`). No hay SIAT, y tuGerente factura desde ≈ Bs 171/mes (`VENDIBLE_OTROS_RUBROS.md:14`) |
| Veterinaria, ganadería | **No se ofrecen** | `rubros-activos.ts`; `ONIA_CATALOGO_DE_VENTA.md:68-69` |

### 1.4 Qué se puede decir en la venta y en la campaña de dental/estética, y qué no

| Se puede decir (existe en producción) | No se puede decir hoy |
|---|---|
| Agenda del día y calendario por profesional, con alta rápida de la persona dentro de la cita [E] | Factura electrónica SIAT. `SIAT_EMISSION` está vacío en el contenedor [P]. Lo honesto es "cada venta queda lista para el portal gratuito del SIN" (sales-kit `README.md:27-28`) |
| Recordatorio **por correo** 24 h y 2 h antes. Medido de punta a punta el 24-sep (`ONIA_CATALOGO_DE_VENTA.md:154`) [P] | Recordatorio por WhatsApp. Ninguna organización tiene credenciales propias de WhatsApp [P] |
| Reserva pública con link, incluida desde Crece (`pricing.ts:290-297`) [T] | "Confirma y marca faltas desde el panel" [X] |
| Agentes que **proponen** y el dueño aprueba cada mensaje: Vuelve a citar, Recuerda cobros, Confirma citas. Corren todos los días a las 07:00 La Paz [P] | Reprograma, Tratamiento a medias, Plan de tratamiento y "Lo que te dejó Onia" son **solo 1.0** (sales-kit `README.md:41-42`, `:75-77`) |
| Importar los pacientes desde CSV, con archivo de ejemplo [T] | Que el agente "agenda solo", "califica" o "cotiza". El agente conversacional contesta lo que el dueño cargó y deriva lo demás (`pricing.ts:68-75`) |
| Odontograma y recetas (dental) [E]/[C] | Resultados, testimonios o cifras de clientes: hay 0 clientes |
| 14 días de prueba en plan Profesional, con agentes desde el día 1 (`plan-state.ts:22,29`) | "IA que responde" al paciente. Las respuestas salen por reglas; la IA solo redacta plantillas y entiende fotos (`pricing.ts:77-83`) |

### 1.5 Precios que se cotizan (leídos del código)

| Plan | Mensual | Semanal | Anual (10 meses) | Para quién (CLIENTE_IDEAL `:50-55`) |
|---|---|---|---|---|
| Básico | Bs 320 | Bs 89 | Bs 3.200 | 1 profesional, sin agentes |
| **Crece** | **Bs 550** | Bs 145 | Bs 5.500 | **2-3 profesionales + recepción: acá arranca el cliente ideal** |
| Profesional | Bs 890 | Bs 229 | Bs 8.900 | 4-5 profesionales |
| Completo | Bs 1.290 | no hay | Bs 12.900 | 6+; el agente conversacional viene incluido (`subscription-plans.ts:35-38`) |
| Empresa | desde Bs 2.900 | no hay | desde Bs 29.000 | + implementación desde Bs 3.500 (`pricing.ts:348-354`) |

Fuente: `subscription-plans.ts:39-45`.

| Add-on | Precio | Fuente |
|---|---|---|
| Agente conversacional de WhatsApp | Bs 390/mes o Bs 3.900/año, sin cargo inicial. Atiende 500 conversaciones/mes. Los mensajes los cobra Meta directo al cliente | `pricing.ts:86-95,124` |
| Recarga de conversaciones | 200 por Bs 190, valen hasta fin de mes. ⚠️ El monto espera tu confirmación (`pricing.ts:188-191`) | `pricing.ts:217-234` |
| Agenda pública en Básico | Bs 150/mes (incluida desde Crece) | `pricing.ts:293-298` |
| Usuario extra | Bs 70/mes | `pricing.ts:300-313` |

⚠️ **Desde el 1-oct-2026 Meta cobra cada mensaje de servicio y no hay tramo gratis.** Hay que decírselo al cliente antes de venderle el agente conversacional (`pricing.ts:121-123,129-134`).

---

## 2. El recorrido del cliente, paso a paso

**Resumen:** lead → conversación → demo → alta (14 días) → configuración → primer valor → pago por QR → aprobación del comprobante → renovación → soporte.

### Paso 0 · Lead (de dónde llega)

| | |
|---|---|
| Cliente | Ve un anuncio o la web y toca "Creá tu cuenta" o escribe al WhatsApp de Onia |
| Sergio Urcullo | Nada en el momento |
| Dónde | Los botones de la web van a `app.onia.com.bo/register` (`web-factory/.../(sitio)/nav.ts:134`). El WhatsApp de Onia lo contesta el **bot de ventas** (Chatwoot, inbox 5 de la org `onia-interna`) |
| Automático / manual | Automático |
| Hueco | **No hay forma de saber de qué anuncio vino un alta.** No hay píxel de Meta, ni Conversions API, ni captura de `utm`/`src`/`fbclid` en `/register` [X]. Lo único que queda es el desplegable autodeclarado "¿Cómo nos conociste?", que se guarda en `organizations.discoverySource` (`schema.prisma:25`) y **no se muestra en ninguna pantalla de `/admin`** (grep sin resultados). Se lee con el SQL de §3 |

### Paso 1 · Conversación

| | |
|---|---|
| Cliente | Chatea con el bot de ventas de Onia |
| Sergio Urcullo | Contesta cuando el bot deriva. Te llega por Telegram (`bot/aviso-telegram.mjs`), y cada 2 h te avisa de conversaciones sin respuesta (cron `39 */2`, `onia-vigia-sin-respuesta.sh`). Se contesta desde `/inbox` en tu organización |
| Dónde | `/inbox` de `onia-interna`; Telegram |
| Tiempo de Sergio | 5-15 min por lead calificado [I] |
| Automático / manual | El bot responde solo. Lo que deriva lo contestás vos |
| Hueco | Para saber de qué anuncio vino una conversación, hay que cargar la frase de cada campaña en el conocimiento del bot (campo `campanas`, máximo 10, con 9 usados según el `knowledge.onia.json` local; lo vivo puede diferir) |

### Paso 2 · Demo

| | |
|---|---|
| Cliente | Elige uno de los dos horarios que le ofrece el bot, con al menos 24 h de anticipación (`bot/config.mjs:44`; los horarios se renuevan con el cron `41 11 * * *` `slots-run.sh`) |
| Sergio Urcullo | Hace la llamada con `sales-kit/02-GUION-DEMO.md` y muestra una cuenta de demo |
| Dónde | Cuenta demo por `/api/onia-core/demo` → `lib/platform/demo-provisioning.ts` |
| Tiempo de Sergio | 30-45 min por demo, más 5 min de preparación [I] |
| Automático / manual | Manual |
| Hueco | La demo **dental** trae datos de ejemplo. La de **estética** y la de servicios nacen vacías (`demo-provisioning.ts:87,114`) [X]. Las capturas del kit de las pantallas 1.0 siguen pendientes (sales-kit `README.md:78-79`) |

### Paso 3 · Alta (prueba de 14 días)

| | |
|---|---|
| Cliente | Se registra solo en `/register`: elige el rubro, pone nombre, correo, contraseña y negocio, y confirma el correo. Después pasa por el onboarding del negocio: datos (o "Traer mis datos" desde su web), horarios, servicios y equipo |
| Sergio Urcullo | **Nada, y ese es el problema: no se entera.** `api/auth/register/route.ts` solo le manda la bienvenida al cliente (`:384`) y no le avisa a Onia [C] |
| Dónde | `app/(auth)/register` + `/onboarding`. En producción `ONIA_ALTA_AUTOMATICA=abierta` [P] |
| Tiempo de Sergio | 0 |
| Automático / manual | Automático. La prueba corre en plan Profesional con agentes (`plan-state.ts:22,29`) |
| Hueco | Sin aviso de alta nueva (hueco #1 de §4). "Traer mis datos" no lee webs hechas con JavaScript, porque Crawl4AI y SearXNG no están en el VPS [P] |

Durante la prueba, **el cliente recibe correos automáticos** los días 3, 7, 12, 14 y 15 (cron `0 13 * * *` = 09:00 La Paz, `app/api/cron/trial-drip/route.ts:21-22`).

Al vencer, tiene **1 día de gracia** (`plan-state.ts:32`). Después, la cuenta queda en solo lectura y aparece el modal "Pagar y reactivar mi plan" (`app/(dashboard)/layout.tsx:203-213,334`).

### Paso 4 · Configuración

| | |
|---|---|
| Cliente (siempre) | Carga el horario de cada profesional (Configuración → Horarios), el catálogo de tratamientos (`/treatments`) y sus pacientes por CSV (`/patients/import`, con archivo de ejemplo) |
| Sergio Urcullo (**configuración por Onia, D3 aprobada el 28-sep**) | Entra una **lista cerrada**, recién **después del primer pago** y con **tope de horas: 3 h en el tamaño de 2-3 profesionales y 5 h en el de 4-6**. La lista es: registro de WhatsApp en Meta (Embedded Signup), plantillas, carga del conocimiento del agente desde un formulario de 1 página y migración solo desde la plantilla de Onia. El cliente aporta cuatro cosas: tarjeta para Meta, aprobación en Meta, el formulario y su Excel en la plantilla (`PAQUETE_LLM_CONCLUSION.md:143,208-209`; memoria `decisiones-sergio-28-sep-traspaso-codex.md` punto 12) |
| Dónde | Credenciales de WhatsApp e inbox: `/admin/organizations/[id]` (1 clic desde `/admin`). Canal web: `/admin/chatbots` → "Crear inbox web + vincular". Conocimiento del agente: **solo desde la cuenta del cliente**, en `/settings/chatbot` |
| Tiempo de Sergio | Hasta el tope: 3-5 h [I, lo fijó D3] |
| Automático / manual | Manual |
| Hueco | **No hay forma limpia de configurar la cuenta de un cliente desde Onia.** `/admin` no permite editar su conocimiento ni "entrar como el cliente" (no hay impersonación; grep sin resultados). Hoy quedan dos caminos: una videollamada donde el cliente toca los botones, o `scripts/onia-mirar.js`, que abre sesión con un enlace mágico, pero está pensado para mirar y no para operar (hueco #3). **El "formulario de 1 página" todavía no existe**: lo más parecido es "Responder 6 preguntas" dentro de `/settings/chatbot` [T]. La plantilla de pacientes sí existe: es el CSV de ejemplo de `/patients/import` [T] |

### Paso 5 · Primer valor

| | |
|---|---|
| Cliente | Agenda su primera cita y le llega el recordatorio por correo. A la mañana siguiente, los agentes dejan sus propuestas en **Pendientes** (`/pending`) y el cliente aprueba o las envía él mismo por WhatsApp |
| Sergio Urcullo | Mira que la cuenta tenga actividad (SQL de §3). Si no tiene, escribe él |
| Dónde | Correo: cron `*/15` `appointment-reminders` [P]. Agentes: cron `0 11` UTC = 07:00 La Paz, `http=200` entre el 27 y el 29-sep con `proposed:0` porque no hay datos [P]. Propuestas: `/pending` |
| Tiempo de Sergio | 5 min por cliente por semana [I] |
| Automático / manual | Automático |
| Hueco | **Pendientes no aparece en el menú de ningún rubro.** Se llega desde el Inicio, desde Agentes o desde la campana. El globo "N esperando" abre la ayuda y no Pendientes (`BarraAsistente.tsx:116-127`) [X]. El link de reserva pública está a 4-5 clics, sin botón "Copiar" (`PlanClient.tsx:1054`) |

### Paso 6 · Pago por QR

| | |
|---|---|
| Cliente | Toca "Pagar y reactivar", "Contratar" o "Renovar" y llega a `/checkout`. Elige plan y ciclo, paga con el **QR estático del BCP de Onia** por el monto que muestra la pantalla ("Copiar monto"), sube la captura y completa: quién paga, CI/NIT, teléfono, negocio, banco y número de transacción (`CheckoutClient.tsx:655-668,722-831`) [E] |
| Sergio Urcullo | Nada en ese momento |
| Dónde | `/checkout` (producción). La preselección del plan que viene de la web con `?plan=` es solo 1.0 |
| Automático / manual | El pago lo hace el cliente. **La activación no es automática** |
| Hueco | El QR dinámico del BCP, que activaría solo, está escrito y **apagado**: no hay variables `BCP_*` en el contenedor [P] (`lib/gateway/bcp-qr.ts:95`). Depende del trámite del BCP en curso |

### Paso 7 · Aprobación del comprobante

| | |
|---|---|
| Cliente | Espera. Cuando aprobás, le llega el aviso |
| Sergio Urcullo | Le llega un Telegram del vigía (cron `*/10`, `onia-vigia-comprobantes.sh`) y un correo a `ADMIN_NOTIFICATION_EMAIL` (`subscription-payment/route.ts:217`). Abre **`/admin/payments`**, filtra "Pendiente", toca "Ver comprobante", **compara contra el extracto del BCP** y aprieta "Aprobar" (o "Rechazar" con motivo) |
| Dónde | `/admin/payments`. Al aprobar se extiende `planEnd` desde el vencimiento vigente y se avisa al dueño; no permite aprobar dos veces (`api/admin/subscription-payments/route.ts:73-208`) [T] |
| Tiempo de Sergio | 3-5 min por pago, más el tiempo de abrir el extracto del banco [I] |
| Automático / manual | **Manual**: el aviso es automático y la decisión es tuya |
| Hueco | No hay verificación contra el banco. Desde `/admin` se llega así: Configuración → "Administración de ONIA" (3 clics), o desde tu Inicio interno con "Métricas completas" → pestaña Pagos |

### Paso 7b · La factura de Onia al cliente

| | |
|---|---|
| Sergio Urcullo | La emite **a mano en el portal gratuito del SIN** por cada pago aprobado. El sistema no la emite |
| Tiempo de Sergio | 5-10 min por pago [I] |
| Hueco | No hay nada que una "pago aprobado" con "factura emitida". Confirmá con el contador si el precio incluye IVA (`PAQUETE_LLM_CONCLUSION.md:212`) |

### Paso 8 · Renovación

| | |
|---|---|
| Cliente | Recibe avisos D-7, D-3, D-1 y vencido por correo, en la app y por push (cron `5 12 * * *` = 08:05 La Paz, `run-onia-renewal-reminders.sh`; `lib/subscription/aviso-de-pago-resuelto.ts:4`). Ve la banda de renovación y paga en `/checkout` → "Renovar" |
| Sergio Urcullo | Aprueba el comprobante igual que en el paso 7 |
| Dónde | `/admin/payments`. Las suscripciones pagas que vencen en 30 días están en `/admin/metricas` → "Suscripciones por vencer" |
| Automático / manual | El aviso es automático y el cobro es manual. No hay débito ni tarjeta |
| Hueco | "Suscripciones por vencer" **solo mira `planEnd`** (`lib/admin/metricas.ts:215-229`). **Las pruebas que vencen no aparecen ahí**: se ven en `/admin/plans` ("Prueba: fecha", `PlansClient.tsx:330-332`) o con el SQL de §3 |

### Paso 9 · Soporte

| | |
|---|---|
| Cliente | Pregunta al asistente "Preguntá por tu negocio" (sin IA, 30 temas, `app/api/ayuda/route.ts:1-5`), lee `/help` o escribe al WhatsApp de Onia |
| Sergio Urcullo | Contesta por WhatsApp. Si hace falta ver lo que ve el cliente, `scripts/onia-mirar.js` (magic link) o una videollamada |
| Dónde | `/help`, la barra del asistente, WhatsApp de Onia |
| Tiempo de Sergio | ? No se mide. Es **el techo del negocio** (ESTRATEGIA §9, `:307-326`) |
| Automático / manual | El asistente es automático y el resto manual |
| Hueco | Falta `SOPORTE_CONTACTO` en el contenedor [P]: cuando el asistente no sabe algo, no ofrece un humano. Tampoco se registran los minutos de soporte por cliente (ESTRATEGIA `:438-443`) |

### Total de horas de Sergio Urcullo por cliente nuevo [I]

**El primer mes: 5-7 h.** Sale de:
- lead y conversación: 0,25 h;
- demo: 0,75 h;
- configuración con tope: 3-5 h;
- pago y factura: 0,25 h;
- seguimiento del primer valor: 0,5 h.

**Cada mes siguiente: ≈ 0,25 h + soporte.** Se va en aprobar el comprobante y emitir la factura.

La estrategia fija que el soporte no pase de ≈ 3,9 h/mes por cliente para que el add-on no pierda plata (ESTRATEGIA `:307-309`). **Si el promedio pasa de 3 h/mes con los primeros 3 clientes, se revisa el precio** (`PAQUETE_LLM_CONCLUSION.md:209`).

---

## 3. Tu tablero diario

**Orden sugerido: 10-15 min por la mañana [I].** Horas en La Paz. El VPS corre en UTC (medido: `date` = UTC, `/etc/timezone` = Etc/UTC), así que a los crons se les restan 4 horas para leerlos en hora de La Paz.

| # | Qué mirar | Dónde | Qué te dice que algo anda mal |
|---|---|---|---|
| 1 | **Parte diario** (05:00 La Paz, `0 9 * * *` `onia-parte-diario.sh`) | Telegram | Es el único mensaje diario. Si no dice "todo en orden", abrí lo que nombra |
| 2 | **Comprobantes por aprobar** | Telegram del vigía (cada 10 min) + `/admin/payments` → filtro "Pendiente" | Cualquier pendiente. **Aprobar el mismo día**: un cliente que pagó y no tiene plan es la peor primera impresión (cabecera de `onia-vigia-comprobantes.sh`) |
| 3 | **Pruebas que vencen esta semana** | `/admin/plans` (columna "Prueba") o el SQL de abajo | Una prueba que vence en ≤ 3 días sin actividad: escribile antes de que se enfríe |
| 4 | **Cuentas sin actividad** | SQL de abajo (no hay pantalla) | Una prueba de más de 2 días sin ninguna cita, ningún pago y ninguna venta: escribile y ofrecé una llamada corta |
| 5 | **Altas nuevas y de dónde vinieron** | SQL de abajo (`discoverySource`). No hay aviso | Un alta de ayer que no contactaste |
| 6 | **Fallas de crons de clientes** | Telegram: `onia-cron-vigilado.sh` avisa si falla (recordatorios, prueba, renovaciones, agentes, facturas recurrentes, core). Logs en `/var/log/onia-*.log` | Cualquier aviso de falla. El parte diario las resume |
| 7 | **Bandeja de ventas** | `/inbox` de tu organización + los Telegram de derivación y de "sin respuesta" (cada 2 h) | Conversaciones derivadas sin contestar |
| 8 | **Pedidos de acceso** | `/admin/solicitudes` + Telegram del vigía de leads (cada 2 h) | Hoy hay **3 sin contactar** [P]. Con el alta abierta ya no entran nuevos por ahí |
| 9 | **Métricas del mes** (1 vez por semana) | `/admin/metricas`: ingreso, organizaciones por estado ("En prueba"), altas y bajas por mes, por vencer y cobros pendientes | Es tu medición de la campaña, aunque no dice de dónde vino cada alta |

### Horario de los crons (VPS en UTC; hora de La Paz = UTC − 4)

| Hora La Paz | Qué corre | Log |
|---|---|---|
| 02:00 | facturas recurrentes | `/var/log/onia-recurring-invoices-cron.log` |
| 03:00 | respaldo de Postgres | `/var/log/onia-db-backup.log` |
| 05:00 | parte diario | `/var/log/onia-parte-diario.log` |
| 06:00 | tareas del core (faltas, facturas vencidas, presupuestos) | `/var/log/onia-core-workitems-cron.log` |
| 07:00 | agentes | `/var/log/onia-agents-cron.log` |
| 08:05 | avisos de renovación | `/var/log/onia-renewal-reminders.log` |
| 09:00 | correos de la prueba gratis | `/var/log/onia-trial-drip.log` |
| cada 15 min | recordatorios de cita | `/var/log/onia-appointment-reminders.log` |
| cada 10 min | vigía de comprobantes | `/var/log/onia-vigia-comprobantes.log` |
| cada 5 min | canario del login | `/var/log/onia-auth-canary.log` |

Todos salen del `crontab -l` del VPS, leído el 29-sep [P].

### El SQL de las cuentas (probado hoy, solo lectura)

Muestra rubro, origen, fin de la prueba y la última cita, el último pago y la última venta de cada organización:

```bash
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 \
 'docker exec -i supabase-db psql -U postgres -d postgres -At' <<'SQL'
SELECT o.slug, o."verticalTrackId", coalesce(o."discoverySource",'-'),
 to_char(o."trialEnd",'YYYY-MM-DD'), to_char(o."planEnd",'YYYY-MM-DD'),
 to_char((SELECT max(a."createdAt") FROM appointments a WHERE a."organizationId"=o.id),'YYYY-MM-DD'),
 to_char((SELECT max(p."createdAt") FROM payments p WHERE p."organizationId"=o.id),'YYYY-MM-DD'),
 to_char((SELECT max(c."createdAt") FROM onia_commerce_orders c WHERE c."organizationId"=o.id),'YYYY-MM-DD')
FROM organizations o ORDER BY o."createdAt";
SQL
```

Resultado del 29-sep: 4 organizaciones, ninguna con citas ni pagos, y la de comercio con una venta del 18-sep. El único `discoverySource` cargado es "YouTube", de la importadora. La consulta exacta de arriba la corrí por stdin, con la misma salida.

---

## 4. Huecos de administración que conviene cerrar antes de pasar de 1-2 clientes

Ordenados por horas de Sergio Urcullo ahorradas y por riesgo de perder un cliente. **Todos los tiempos son [I].** Esto es una lista para que decidas; no la estoy abriendo como frente.

| # | Hueco | Qué pasa hoy | Qué ahorra | Esfuerzo | Evidencia |
|---|---|---|---|---|---|
| 1 | **Aviso de alta nueva, con rubro y origen** (Telegram) | Te enterás mirando `/admin` o con SQL. Con una campaña encendida, el lead se enfría | 5 min diarios de revisión, y sobre todo no perder el primer día de cada prueba | horas: el patrón ya existe (`lib/aviso-acceso.ts`, `onia-leads-vigia.sh`) | `api/auth/register/route.ts:384` (solo bienvenida) [C] |
| 2 | **Origen del alta** (`utm`/`src`/`fbclid` en `/register` + columna "origen" en `/admin`) | Solo existe el desplegable autodeclarado y no se ve en ninguna pantalla | Sin esto no se puede medir qué anuncio trae clientes: es la condición para administrar Meta Ads | 1-2 días | grep de `fbq`/`utm` sin resultados en la web y en la app [X]; `schema.prisma:25` |
| 3 | **Configurar la cuenta de un cliente desde Onia** (conocimiento del agente, carga de datos) sin su clave | Videollamada o magic link | 30-60 min por cliente dentro del tope de D3, y el riesgo de operar con una sesión ajena | 2-4 días | inventario transversal: no hay impersonación ni edición de conocimiento en `/admin` [X] |
| 4 | **Registrar los minutos de soporte por organización** | No se mide | Es el dato que decide si el tope de 3 h alcanza y si el precio sirve (ESTRATEGIA `:438-443`; D3) | 0 código: una planilla desde el cliente 1 | [X] |
| 5 | **Activación automática del pago** (QR dinámico del BCP) | Cada pago lo aprobás a mano | 5-10 min por pago, más la espera del cliente | configuración, cuando salga el trámite del BCP. El código existe | `lib/gateway/bcp-qr.ts:95`, sin `BCP_*` [P] |
| 6 | **Lista de clientes en `/admin` con rubro, prueba, última actividad y origen** | La lista no tiene rubro ni prueba (`admin/page.tsx:420-470`) | Reemplaza el SQL diario | 1 día | inventario transversal |
| 7 | **Pendientes en el menú y el globo "N esperando" que lleve a `/pending`** | Solo se encuentra por enlaces contextuales | Consultas de "¿dónde apruebo?". Es el corazón de la venta ("vos aprobás") | horas | `BarraAsistente.tsx:116-127` [X] |
| 8 | **Link de reserva visible y con "Copiar"** | 4-5 clics dentro de "Mi plan" | Consultas de "¿cuál es mi link?" | horas | `PlanClient.tsx:1054` |
| 9 | **"Confirmar" y "No asistió" en Citas** (dental y estética) | La API los acepta y no hay botón. Las reservas de `/book` nacen PENDIENTE y nadie las puede confirmar | Consultas + que los agentes Reprograma y el core de faltas tengan datos | 1 día | `app/api/appointments/[id]/route.ts:18`; `api/booking/appointments/route.ts:332` [X] |
| 10 | **`SOPORTE_CONTACTO`** en el contenedor | El asistente no ofrece un humano cuando no sabe | Clientes trabados en silencio | 1 variable + recrear el contenedor | [P] ausente; `app/api/ayuda/route.ts:43` |
| 11 | **Datos de ejemplo en la demo de estética** | Nace vacía | 15-20 min de armar datos antes de cada demo de estética | 1 día | `demo-provisioning.ts:87` |
| 12 | **Factura de Onia ligada al pago aprobado** | Manual en el portal del SIN | 5-10 min por pago | depende del SIAT (Fase 1 autorizada el 29-sep) | memoria `decisiones-sergio-28-sep-traspaso-codex.md` punto 13 |

**Seguridad (no ahorra horas, pero va antes de tener clientes con WhatsApp):** `/admin/organizations/[id]` le manda al navegador el token de Meta de cada cliente en claro (`page.tsx:36`) [C].

**Menor:** "Nueva clínica" en `/admin` siempre crea una organización dental en plan free. Dice que la contraseña tiene mínimo 6 caracteres cuando la API exige 8 (`admin/page.tsx:271` contra `api/admin/clinics/route.ts:28`).

---

## 5. Checklist de lanzamiento (lo que tiene que estar el día 1)

**Estado hoy:** ✅ listo · ❌ falta · ? no verificado.

### Decisiones que son tuyas, Sergio Urcullo

- [ ] **¿Se vende sobre producción de hoy o sobre la 1.0 publicada?** Si la campaña o la web prometen el tratamiento a medias, Reprograma o "Lo que te dejó Onia", hay que publicar la 1.0 antes. Publicar exige tu OK sobre la página de revisión, 3 migraciones aditivas con respaldo y `ONIA_WHATSAPP_INBOX_ID=5` en `app.env` antes del swap. Esa variable **hoy no está** en el contenedor [P]
- [ ] **Qué rubro va en la campaña:** dental (y estética como piloto), según la etapa vigente. Comercio y servicios **no**
- [ ] **El número de salida de la etapa 1** (Bs 3.750, calculado con el precio viejo de Profesional; ver §1.1)
- [ ] **Qué plan se ofrece primero:** Crece, según `ONIA_CLIENTE_IDEAL.md:57-62`
- [ ] **Monto de la recarga de conversaciones** (Bs 190, "espera confirmación", `pricing.ts:188-191`)
- [ ] **Contestar los 3 pedidos de acceso que esperan** antes de pagar tráfico nuevo [P]

### Producto y promesa

- [x] Alta abierta en autoservicio: `ONIA_ALTA_AUTOMATICA=abierta` [P]
- [x] Recordatorio de cita por correo funcionando (medido el 24-sep, `ONIA_CATALOGO_DE_VENTA.md:154`) [P]
- [x] Agentes corriendo todos los días (log `http=200` del 27 al 29-sep) [P]
- [ ] ❌ La web de estética promete el tratamiento a medias. Con producción de hoy no se cumple (`switcher.tsx:70`). Se corrige la frase o se publica la 1.0
- [ ] ❌ La web de importadora promete "lotes/costo por lote" (`rubros/page.tsx:87-88`). Se corrige antes de pagar tráfico, aunque no sea el rubro de la campaña
- [ ] ❌ La cuenta demo de estética está vacía (`demo-provisioning.ts:87`)
- [ ] ? Capturas del kit para las pantallas 1.0 (sales-kit `README.md:78-79`)

### Cobro

- [x] Checkout con QR estático del BCP a nombre de OniaAgency (`CheckoutClient.tsx:103`, producción)
- [x] Vigía de comprobantes cada 10 min, más correo a `ADMIN_NOTIFICATION_EMAIL` (la variable existe) [P]
- [x] `/admin/payments` con Aprobar/Rechazar y protección contra aprobar dos veces [T]
- [ ] ? Tu 2FA como SUPERADMIN activo. Es obligatorio solo para ese rol (`lib/mfa/policy.ts:25`): sin él, `/admin` y `/checkout` te piden activarlo
- [ ] ❌ Circuito de la factura de Onia en el portal del SIN, y la consulta con el contador sobre el IVA en el precio
- [ ] ❌ QR dinámico del BCP (trámite en curso). Mientras tanto, la aprobación es manual y aceptable para 5 clientes

### Medición para Meta Ads

- [ ] ❌ Píxel / Conversions API / captura de `utm` en la web y en `/register` (hueco #2)
- [ ] ❌ Aviso de alta nueva (hueco #1)
- [x] Camino que ya se puede medir sin píxel: **anuncios de clic a WhatsApp que llevan al WhatsApp de Onia**. El bot de ventas contesta, ofrece la demo con los horarios que se renuevan solos, y la frase de la campaña cargada en el conocimiento del bot marca de dónde vino. Queda 1 lugar libre de 10 según el archivo local (?)
- [ ] ? Qué cuenta publicitaria se usa. La memoria del 17-sep dice que el MCP de Meta ve NUVO/Arthur y no ONIA Ads, y que la campaña 1 está archivada. No lo re-medí

### Operación y soporte

- [x] Parte diario y vigías por Telegram en el crontab [P]
- [ ] ❌ `SOPORTE_CONTACTO` en el contenedor [P]
- [ ] ❌ Planilla de minutos de soporte por cliente (hueco #4)
- [ ] ❌ Lista cerrada de la configuración por Onia escrita y enviable, con su tope de 3 h / 5 h y "después del primer pago". También el formulario de 1 página para el conocimiento del agente, que no existe
- [ ] ❌ Aviso al cliente sobre Meta: desde el 1-oct cobra cada mensaje de servicio (`pricing.ts:121-123`)
- [ ] ? `/admin` a mano: hoy se llega por Configuración → "Administración de ONIA" (3 clics) o por "Métricas completas" en tu Inicio interno (`interna-hoy.tsx:148-153`)

---

**Lo que no verifiqué:**
- No abrí ninguna pantalla renderizada.
- No corrí la suite ni los e2e hoy: [T] y [E] significan que el test existe, no que pase hoy.
- No leí el contenido vivo del conocimiento del bot de ventas.
- No sé si el correo a `ADMIN_NOTIFICATION_EMAIL` llega de verdad.
- No sé en qué cuenta publicitaria está Onia.
- No sé cuánto tarda de verdad cada paso: todos los minutos son estimaciones.
