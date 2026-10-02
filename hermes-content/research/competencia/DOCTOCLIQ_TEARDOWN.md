# Doctocliq: cómo funciona el producto por dentro

Medido el 2026-10-01 desde las páginas públicas (Playwright + Chromium headless). Capturas en `doctocliq/`. **Límites:** no se creó cuenta. El centro de ayuda (Zendesk) devuelve 403 sin login. YouTube bloquea esta IP
(«Sign in to confirm you're not a bot» en yt-dlp, página `/sorry` en Chromium), así que **no se vio ningún
tutorial**: todo sale del texto y las imágenes de UI del sitio. Inferencia = *(inf.)*. Fuentes [n] al final.

## 1. Módulo por módulo

**Agenda.** Vista diaria, semanal o mensual, por doctor y por sillón o cabina. Cada doctor ve solo su agenda y el
dueño ve todas [2]. Para reprogramar se arrastra la cita [3]. Estados: pendiente, confirmada, cancelada, atendida
y no se presentó [2][3]. Hay citas repetidas: la opción «Frecuencia» crea toda la serie hasta una fecha [3]. Importa
desde Google Calendar [1]. Con «Agrupación de agendas por equipo» se juntan agendas; solo en Avanzado [1].
**Las cancelaciones no desaparecen:** van a una «lista de citas canceladas pendientes de recuperación», con
tareas de seguimiento para el equipo [2][3]. *Clics (inf.):* crear una cita, 2-3; reprogramar, 1 arrastre.

**Ficha y odontograma.** Ficha con anamnesis, notas de evolución, recetas, etiquetas, alertas de alergia siempre
visibles y archivos (de 1 a 20 GB según el plan) [1][4]. Odontograma y periodontograma para adulto, mixto y niño,
en FDI o ADA, con vistas de diagnóstico, progreso y alta, ajustado a la norma de cada país (MINSA en Perú) [4][5].
Ortodoncia y estética facial van como módulos aparte, en Básico y Avanzado [1]. En Perú, el DNI se valida contra
RENIEC (de pago, por paquetes) [5]. Los menores pueden tener «apoderado», que recibe los avisos [5]. Formatos de
historia a medida: «adicional» [1].

**Plan de tratamiento y presupuesto.** El presupuesto y el plan se arman **desde los hallazgos del
odontograma** [4][5]. Desde el menú ⋮ se puede «Agrupar» el presupuesto en fases y descargarlo en PDF (fases solo en
Avanzado) [1][5]. El presupuesto tiene estados (creado, aceptado, rechazado, abandonado, terminado) [6] y cobros
registrados encima, incluidas las cuotas [4][7]. Cuando el doctor marca un ítem «terminado», **se descuenta solo el
stock** de los insumos asociados [5]. El presupuesto impreso puede llevar un QR de pago (solo en Perú) [5].

**Recordatorios.** Canales: WhatsApp (API oficial, Meta Business Partner), email y SMS (este solo en México) [2][8][9].
Son **automáticos**: se configuran en Marketing > Automatizaciones con reglas y plantillas, sin IA [6]. Se eligen
3 días antes, 1 día antes o los dos [2]. El WhatsApp se cobra por créditos: 50/mes en Individual y 100/mes en Básico
y Avanzado, y solo en planes semestrales o anuales. Gratis = sin WhatsApp [1]. El plan gratis puede comprar
paquetes sueltos de mensajes [10].

**Confirmación.** El mensaje trae botones: Confirmar, No podré asistir y Chatear con la clínica (se ve en la imagen
de la UI, [2]). Si el paciente responde, la cita cambia de estado sola y el doctor recibe un aviso [2]. Si cancela,
la cita pasa a la lista de recuperación [2].

**Inactivos, tratamiento a medias, recall** → ver §2.

**Caja y cobros.** Ingresos y egresos, cierre diario, multicaja con permisos y responsable de caja, medios de pago,
reportes en Excel y **comisión por doctor** con varias modalidades [7][11]. Un presupuesto acepta varias monedas
(testimonio, [12]). Los links de pago y el pago anticipado de la cita (Yape, Plin, tarjeta) son solo para Perú [1][5].
Básico trae caja «básica»; los permisos, la multicaja y el link de pago son de Avanzado [1].

**Facturación.** Es un add-on, solo en Básico y Avanzado [1]. Cubre Perú (SUNAT), México (SAT), Ecuador (SRI),
Colombia (DIAN, también vía Alegra) y República Dominicana, a través de proveedores autorizados [1][9].
Flujo: se cargan los datos fiscales del paciente, se elige «Factura» al cobrar y la factura sale por correo, PDF o
WhatsApp [9]. **Bolivia no figura.**
**Inventario.** Stock, órdenes de compra, vencimientos y avisos de faltante o de vencimiento [11]. El consumo se
descuenta solo al terminar un tratamiento [5]. Las órdenes de laboratorio van con trazabilidad [1][12]. Inventario y
laboratorio son solo de Avanzado [1].

**Reportes.** Demografía (edad, ubicación, canal de origen), tratamientos más vendidos, productividad por doctor,
ausentismo, ingresos y egresos mes a mes y año a año, con descarga [11][13]. Hay un embudo Lead → Nuevo →
Convertido con el ingreso de cada etapa [6]. Solo en Avanzado [1].

**Reserva online.** Link por doctor para la web, Instagram o WhatsApp. El paciente elige doctor y motivo (cada
motivo tiene su duración) y ve el precio. Se puede **exigir el pago previo** (solo Perú) [2][3][5]. Viene en todos
los planes, incluso el gratis [1]. Hay además un formulario de registro del paciente por QR o link, solo en
Avanzado [1].

**IA.** (a) **Soyla IA** (add-on, solo con plan semestral o anual). Es un agente sobre la API oficial de WhatsApp
que usa el número actual de la clínica. **Consulta y bloquea horarios reales**, agenda, reprograma, reconoce al
paciente existente, crea la ficha del lead nuevo y pasa a una persona cuando hace falta. La instalación tarda de 3
a 7 días hábiles y la entrena Doctocliq [8]. (b) Su soporte usa IA de primer nivel y después un humano [14].
(c) Soyla también redacta mensajes de cobranza [15].

**App móvil.** «Doctocliq», de Zolupro S.A.C., en iOS y Android. En Play Store: 3,4★ con 46 reseñas y más de
10 mil descargas [16]. Viene en todos los planes [1]. Según la web, sirve sobre todo para manejar la agenda desde el
celular [9].

**Onboarding y alta.** Landing → «Crea tu cuenta gratis» → `/registro` con correo + contraseña, o Google, o Apple [17]
→ código de verificación por WhatsApp (lo vivió Sergio Urcullo; no es público) → sistema. Son unos 3 pasos y no
piden tarjeta. Al entrar arranca la **prueba de 7 días del plan Avanzado** sin add-ons [9]. Después se paga o se
**baja al plan Gratis «cuando quieras, incluso el primer día»**, sin perder datos [10]. Hay importación de
pacientes con una plantilla Excel, que valida duplicados [3]. La migración asistida es gratis en los planes de
pago [1][10]. La demo con un asesor (20-30 min) es opcional [2].

**Plan gratis.** Incluye 1 doctor, **30 pacientes o citas por mes**, agenda, historia clínica con odontograma,
presupuestos y pagos, recetas, reserva online, app y 8 usuarios gratuitos (administrativos o invitados) [1].
**No incluye:** WhatsApp, caja, consentimientos, archivos, reportes, inventario ni marketing [1]. Solo da centro de
ayuda y videos, sin acompañamiento [10]. Al llegar a las 30, se espera al mes siguiente o se pasa a un plan de
pago [10]. **Si la cuenta pasa 2 meses sin uso, se inhabilita** [9].
Planes pagos: Individual USD 19, Básico 29 y Avanzado 49 por mes, **por doctor**. En Perú cada doctor extra cuesta
S/ 30 [1][5]. El anual trae 2 meses gratis [1].

## 2. Pregunta central: ¿hay recall del tratamiento a medias?

**Sí, pero como segmento + campaña, no como agente.** Así funciona:
1. **Segmentar.** En el CRM/Marketing se filtran pacientes por «abandonaron el tratamiento» [11], por **estado del
   presupuesto (creado / aceptado / rechazado / abandonado / terminado)**, por última visita (por ejemplo, «inactivos
   hace 6 meses»), por tratamiento, edad, sexo y fuente [6]. Trae segmentos de ejemplo: «Primera cita sin
   retorno», «Tratamiento recurrente» y «Cancelaron sin reagendar» [6].
2. **Actuar sobre el segmento** de tres maneras: campaña de WhatsApp (plantilla aprobada por Meta, cobra créditos) o
   de email, programada y con métricas de aperturas, respuestas y citas generadas; **tarea masiva** asignada a una
   persona del equipo («contactá a estos»); o cobranza directa [6].
3. **Automatizaciones con reglas**: control semestral, post-consulta, cumpleaños, reseña de Google, deuda [9][15].
**Lo que NO hace (según lo público):** no detecta un paciente a medias para proponer el mensaje; alguien tiene que
armar el segmento y la campaña. Tampoco está en el plan base: **Marketing es un add-on de Básico y Avanzado y
solo con contrato semestral o anual** [1]. No se pudo ver dentro de la app si el estado «abandonado» se marca solo o
a mano *(sin verificar)*.

## 3. Ellos vs. Onia

Fuente de lo de Onia: `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` (2026-10-01).

| Tema | Ellos tienen | Onia tiene | Quién lo hace mejor |
|---|---|---|---|
| Agenda | Por sillón, arrastrar, serie, lista de canceladas, Google Cal | Agenda y citas | Ellos |
| Ficha y odontograma | FDI/ADA, 3 denticiones, periodontograma, ortodoncia | Historia clínica + odontograma | Ellos (más profundo) |
| Plan y presupuesto | Desde el odontograma, fases, estados, QR de pago | Tratamientos + cobros | Ellos |
| Recordatorio | WhatsApp/email/SMS automático, 3d/1d | Solo **correo**, 24 h y 2 h, automático | Ellos |
| Confirmación | Botón en WhatsApp que actualiza la cita | Agente «confirmador» (propone, el dueño aprueba) | Ellos (sin intervención) |
| Tratamiento a medias | Segmento + campaña manual, add-on semestral | **Agente diario que lo detecta y propone**, desde Crece | **Onia** |
| Caja y cobros | Multicaja, comisiones por doctor, link de pago (Perú) | Cobros, caja, «cobrador», contabilidad, planilla | Empate (Onia: contabilidad; ellos: comisiones) |
| Facturación | 5 países, sin Bolivia | SIAT en certificación, apagado | Nadie en Bolivia hoy |
| Inventario | Stock, vencimientos, OC, descuento al terminar un tratamiento | Inventario de insumos | Ellos |
| Reportes | Demografía, productividad, embudo | `/reports` desde Profesional | Ellos |
| Reserva online | Link por doctor, pago previo, también en el gratis | Link desde Crece | Ellos |
| IA | Soyla: agenda dentro de WhatsApp | Agentes que proponen; el bot WhatsApp no sale todavía | Ellos en el chat; Onia en el back-office |
| App móvil | iOS/Android (3,4★) | No figura | Ellos |
| Alta | Unos 3 pasos, código por WhatsApp, 7 días | 2 pasos con rubro elegido, 14 días sin tarjeta | Onia (menos fricción, más días) |
| Plan gratis | Para siempre, 30/mes | No hay; solo lectura al vencer | Ellos (embudo) |
| Equipo | 8 usuarios gratis, cobran por doctor | Crece = 4 usuarios | Ellos para 2-6 doctores *(revisar precio)* |
| Contabilidad y planilla | No | Sí | **Onia** |
| Bolivia (Bs, QR BCP, SIAT) | No | Sí (SIAT en camino) | **Onia** |

## 4. Top 5 que tienen y a Onia le falta (para una clínica de 2-6 profesionales en Santa Cruz)

1. **Recordatorio y confirmación por WhatsApp con botón** que cambia el estado de la cita solo. Es el dolor diario
   de la recepción, y Onia hoy solo manda correo.
2. **Presupuesto desde el odontograma, por fases y con estados** (aceptado / abandonado). Es la venta del
   tratamiento y alimenta el recall.
3. **Agenda por sillón y la lista de «canceladas pendientes de recuperar»**: con 2-6 profesionales comparten sillones.
4. **Comisiones por doctor dentro de caja.** Con varios profesionales es la cuenta de fin de mes.
5. **App móvil** para que el dueño vea la agenda y la caja desde afuera.
(Quedan afuera a propósito: el plan gratis y Soyla, que son modelo comercial o add-on, no gestión de la clínica.)

## 5. Top 3 que Onia hace mejor

1. **Tratamiento a medias como agente diario:** lo detecta, propone y el dueño aprueba en «Pendientes». En
   Doctocliq es un segmento que alguien tiene que armar, en un add-on que solo se vende semestral o anual.
2. **Hecho para Bolivia:** bolivianos, QR del BCP y SIAT (cuando salga). Doctocliq no factura en Bolivia.
3. **Back-office completo en el plan:** contabilidad, planilla, gastos y agentes cobrador y reprogramador. Además, el
   alta es más corta y la prueba dura 14 días contra 7.

## Fuentes

[1] doctocliq.com/planes-y-precios (tabla y FAQ) · [2] /funcionalidades/agenda-medica-digital · [3] /agenda-medica-y-recordatorios · [4] /funcionalidades/historia-clinica-dental · [5] /pe/software-dental (FAQ) · [6] /funcionalidades/marketing (FAQ) · [7] /software-de-gestion/caja-y-facturacion-electronica · [8] /soyla-ia · [9] /preguntas-frecuentes · [10] /software-de-gestion-clinica-gratis · [11] /funcionalidades · [12] home doctocliq.com (FAQ, testimonios) · [13] /funcionalidades/estadisticas-y-reportes · [14] /soporte-tecnico-doctocliq · [15] /blog/seguimiento-de-pacientes-clave-consultorio-rentable · [16] Play Store, búsqueda «doctocliq» (com.doctocliq.android) · [17] doctocliq.com/registro (solo se miró, no se llenó).
