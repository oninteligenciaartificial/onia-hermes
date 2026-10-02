# Catálogo de venta de Onia — la 1.0

**Qué sale a la venta, qué no, y qué falta.** Fuente única de «qué se vende». Se EDITA, no se copia.

> **Sin precios acá.** Planes → `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`).
> Límites de cada plan → `onia-platform/lib/plan-catalogo.ts`. Add-ons → `onia-platform/lib/pricing.ts`.
> Si aparece un monto en este archivo, está roto.

**Medido el 2026-10-01** contra `onia-platform` `origin/master` `4dc829e` (= producción
`release-4dc829e8`), el `env` del contenedor y el crontab del VPS. Lo viejo (historia de cada
corrección) quedó en el historial de git de este archivo, antes de `2026-10-01`.

Estados: **✅ sale** (vivo en producción, se vende) · **⏸ después** (construido, se vende recién al
probarlo en real) · **❌ no se nombra** (no existe o está apagado).

---

## 1. En una frase

Un sistema de gestión para tu negocio, armado para tu rubro: lo elegís al registrarte, probás 14
días gratis sin tarjeta, y el sistema trabaja solo (recordatorios, agentes) mientras atendés.

## 2. Qué hace, por rubro (los 5 que se eligen en el alta)

| Rubro | Qué hace el dueño | Agentes (proponen, el dueño aprueba en «Pendientes») |
|---|---|---|
| **Dental** — el que se vende primero | Agenda y citas · ficha con historia clínica y odontograma · tratamientos · cobros y facturas · inventario de insumos · gastos, contabilidad, planilla · link de reserva online | Tratamiento a medias, confirmador, reprogramador, cobrador |
| **Estética** | Lo mismo que dental, con su vocabulario y sin odontograma | Igual que dental |
| **Servicios profesionales** | Agenda · clientes (sin datos clínicos) · servicios · caja y por cobrar · contabilidad, planilla | Recall, confirmador, reprogramador, cobrador |
| **Comercio** | Catálogo · inventario con kardex · caja y corte · fiados · clientes · gastos, contabilidad, planilla | Reponedor de stock, cobrador de fiados |
| **Importadora** | Catálogo · inventario · ventas y créditos · cotizaciones B2B · costeo de importación · alerta de reprecio | Seguidor de cotizaciones, reponedor, cobrador |

En todos: bandeja de conversaciones, equipo con roles (dueño, doctor, recepción, caja, asistente),
configuración y ayuda.

**Trabaja solo, sin abrir el sistema** (crontab del VPS, corriendo todos los días):
- recordatorio de cita por **correo**, 24 h y 2 h antes, en los rubros con agenda;
- los agentes, una vez al día (07:00 La Paz);
- facturas recurrentes, avisos de renovación y mensajes de la prueba.

## 3. Planes y cómo paga el cliente

- **Planes que se compran solos en `/checkout`:** Básico · Crece · Profesional · Completo.
  Empresa se cotiza.
- Mensual, semanal o anual. El anual vale 10 meses.
- **Prueba:** 14 días del plan Profesional, sin tarjeta.
- **Al vencer la prueba:** 1 día de gracia y después **solo lectura**. No se borra nada.
- **Pago:** QR del BCP (monto abierto) → el cliente sube el comprobante → **Sergio Urcullo lo aprueba**
  en `/admin/payments` → el plan se activa.
- **Crece = 4 usuarios** (decisión 1-oct). Así entra el cliente ideal: 3 profesionales + recepción.

## 4. Módulos del producto

Las pantallas que existen hoy (las lee el gate `node scripts/catalogo_modulos_vivos.mjs`). Cada rubro ve
solo las suyas (§2).

| Módulo | Pantalla | Rubros | Estado |
|---|---|---|---|
| Agenda y citas | `/agenda`, `/appointments` | dental, estética, servicios | ✅ sale |
| Clientes / pacientes | `/patients` | todos | ✅ sale |
| Servicios / tratamientos | `/treatments` | dental, estética, servicios | ✅ sale |
| Inventario de insumos | `/inventory` | dental, estética | ✅ sale |
| Cobros y facturas | `/billing` | todos | ✅ sale (la factura del SIAT, no: §7) |
| Comercio (catálogo, caja, fiados) | `/comercio/**` | comercio | ✅ sale |
| Importadora (cotizaciones, costeo) | `/importadora/cotizaciones` | importadora | ✅ sale |
| Contabilidad | `/contabilidad` | todos | ✅ sale |
| Planilla | `/rrhh` | todos | ✅ sale |
| Empresa (gastos, colaboradores) | `/empresa` | todos | ✅ sale |
| Agentes («Pendientes») | `/agents` | todos (desde Crece y en la prueba) | ✅ sale: corren solos todos los días |
| Reportes | `/reports` | desde Profesional | ✅ sale |
| Requerimientos al cliente | `/requerimientos` | todos | ✅ sale |
| Conversaciones | `/inbox` | todos | ✅ sale |

## 5. Add-ons

| Add-on | Estado |
|---|---|
| Agenda pública (link de reserva) | ✅ viene incluida desde Crece; como add-on, solo en Básico |
| Usuario extra | ✅ en Básico |
| **Agente conversacional de WhatsApp** (contesta horarios, servicios y preguntas; manda el link de reserva; deriva a una persona; entiende fotos y audios) | ⏸ **después de la prueba real** (decisión 1-oct). Está construido, pero nunca se conectó el WhatsApp de un cliente. Sale cuando el chip prepago conecte con «Conectar mi WhatsApp» y el primer mensaje real salga desde ese número. **No agenda dentro del chat y no conversa con IA libre:** nunca se promete «la IA agenda sola». |
| Chatbot a medida, self-hosted, onboarding guiado | Se cotizan |

## 6. Lo que falta para cobrar al primer cliente

1. **Probar el pago de punta a punta en producción.** Hay 0 pagos registrados: comprobante → correo →
   aprobación → plan activo.
2. **SIAT:** terminar la certificación (etapas VI y IX en el piloto) y encender la emisión. El checkout
   promete «te emitimos factura por cada pago».
3. **Titular del QR:** muestra un nombre de persona, distinto de «OniaAgency». Puede frenar el pago.
4. **Chip prepago** para la prueba real del WhatsApp del cliente. Con eso pasan a ✅ el agente
   conversacional y el recordatorio por WhatsApp.
5. ~~**Cerrar la API de alta.**~~ ✅ Hecho (PR #96, en producción desde `release-8ff1284d`). Medido en vivo el
   1-oct: `verticalTrackId` `vetgest-clinical` y `onia-interna` → 400; acepta solo los 5 que ofrece la pantalla.

## 7. Lo que NO se puede prometer (no se nombra en la venta)

- **Factura electrónica SIAT.** Está en certificación y apagada en producción (`SIAT_EMISSION` no
  está). Decisión 1-oct: **se termina el SIAT** y recién ahí se nombra.
- Recordatorio por **WhatsApp** al paciente (por ahora solo correo). Va junto con el agente.
- Veterinaria y ganadería.
- Pago con tarjeta y QR que activa el plan solo.
- Varias sucursales, modo offline, visión por computadora.
- Cualquier cifra o testimonio de clientes: hoy hay cero clientes pagando.

## 8. La IA: qué se puede decir y qué no (medido 2-oct)

Inventario completo, con pruebas: `docs/research/ONIA_INVENTARIO_IA_20261002.md`. La IA de verdad, hoy, es UNA pieza:
el **redactor de los agentes** (gpt-4.1-mini vía el LiteLLM propio): escribe UNA plantilla por agente cuando el dueño
la pide, nunca ve datos de pacientes, y el dueño la aprueba una vez. Uso real: 1 prueba interna, 0 plantillas aprobadas.
Todo lo demás (a quién escribir, la ayuda, el agente de WhatsApp) son reglas y guiones, sin LLM.

**Se puede decir** (cada una con su plan):
1. «Onia te propone con IA el texto de cada recordatorio —cobros, confirmación de citas, pacientes que no vuelven—
   con el tono de tu negocio. Vos lo revisás y lo aprobás una sola vez.» — Crece (50 textos/mes), Profesional y la
   prueba (150), Completo y Empresa (400). Básico no.
2. «La IA no ve los datos de tus pacientes: escribe el modelo del mensaje y Onia le pone el nombre, el monto o la hora
   a cada uno.» — igual que la 1.
3. «Todas las mañanas Onia revisa tu agenda y tus cobros y te deja anotado a quién escribirle —quien hace 6 meses no
   vuelve, quien te debe, quien tiene cita mañana— con el mensaje listo. Nada sale sin que vos lo apruebes.» — Crece en
   adelante y la prueba (sin IA: son reglas).
4. «Cuando un insumo baja del mínimo, Onia te deja anotada la tarea de reponerlo.» — Crece en adelante, rubros con
   inventario.
5. «Preguntale a Onia "¿cuánto me deben?", "¿cuánto cobré hoy?", "¿qué citas tengo hoy?" o "¿qué está bajo el
   mínimo?" y te contesta con tus números.» — todos (lo de plata, con permiso de finanzas).
6. «Pegá el link de tu página web y Onia te carga nombre, teléfono, dirección, horarios y servicios.» — todos (solo web
   propia, no Facebook).
Antes de publicar una frase, se abre su pantalla con sesión y se MIRA (la medición fue de código, base y logs).

**NO se puede decir:** que la IA atiende o agenda por WhatsApp (el agente es un guion, a propósito, y ningún negocio
lo tiene conectado) · que la IA escribe CADA mensaje o decide a quién escribir · «asistente con IA que responde lo que
le preguntes» (busca en 30 fichas y sabe 4 datos de hoy) · que entiende fotos, comprobantes o notas de voz · que
recupera pacientes con **tratamiento a medias** (hoy no existe: lo que corre es «no volvió hace 180 días») · que ya lo
usan clínicas (0 pagos; las 5 cuentas son internas o de prueba).
