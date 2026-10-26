# Onia Plan de Ventas 90 Dias — H2 2026 (jul-sep)

Fecha: 2026-07-04. Vigencia: 06-jul-2026 al 03-oct-2026.
Estado: plan comercial canonico de 90 dias, fase sin portafolio.
Owner: Sergio / Onia. Copiloto: Hermes.
Fuentes: `hermes-content/references/onia-projects-registry.json` (precios y
comisiones — NO se inventan otros), `ONIA_FISCAL_CONTABILIDAD_STRATEGY_2026.md`,
`ONIA_COMPANY_BACKBONE_AND_SELF_SERVICE_2026.md`,
`ONIA_VERTICAL_FACTORY_STRATEGY_2026.md`, `ONIA_CORE_CLIENT_ADOPTION_MAP_2026.md`,
`CRM_AND_PROSPECTING.md`.

## 1. Tesis comercial: el gancho universal 2026

Tres shocks golpean a TODA empresa boliviana al mismo tiempo:

| Shock | Desde | Lo que le pasa al negocio |
|---|---|---|
| Facturacion EN LINEA obligatoria para todos (grupos 9-12, los ultimos) | 01-abr-2026 | Necesita software autorizado y registros ordenados; el contador se los exige |
| Dolar flotante (RM 245/2026) | 26-jun-2026 | Reprecios constantes; cotizacion vieja = margen perdido |
| Arancel nuevo + GA -5pts (DS 5646) | 06-jul-2026 | Costos de importacion cambian; hay que recalcular |

El caos es el gancho. Onia no vende "software": vende el orden para
sobrevivir 2026. Pitch madre (columna vertebral):

> "Ningun mensaje de tu empresa vuelve a quedar sin responsable. Todo lo que
> entra por cualquier correo, WhatsApp o telefono se convierte en un pendiente
> con dueno, y vos lo ves en una sola pantalla — con tus vencimientos de
> impuestos incluidos."

Pitch de 2 frases por producto:

- **DentalGest**: "Cada presupuesto sin respuesta y cada cita olvidada es plata
  que tu clinica pierde. DentalGest ordena pacientes, citas y cobros en un
  panel, y te deja listo para las exigencias de facturacion de este ano."
- **GestiOS**: "Tu operacion vive en Excel y WhatsApp, y nadie sabe quien debia
  responder que. GestiOS convierte cada pedido en una tarea con responsable y
  te da los numeros que tu contador te pide cada mes."
- **ProveeGest**: "Con el dolar flotando y arancel nuevo desde julio, cada
  cotizacion vieja es margen regalado. ProveeGest ordena catalogo, cotizaciones
  y seguimiento por vendedor y sucursal para que repreciar no sea adivinar."
- **Web Onia**: "Si no apareces en Google con una oferta clara, el cliente
  compra donde si aparece. Una web Onia captura consultas y las convierte en
  pendientes con responsable desde el dia uno."
- **Consultoria Onia**: "Te llueven obligaciones nuevas y no sabes que sistema
  comprar. Una auditoria de Bs. 250 te dice que instalar primero y que NO
  comprar."
- **Contador Pack** (add-on, para el contador): "Tus clientes te mandan fotos y
  carpetas; Onia te manda el RCV listo. Exports mensuales estandar y calendario
  por digito de NIT de cada cliente."

Honestidad dura: Onia todavia NO emite facturacion en linea (certificacion
SIAT proveedor en estudio, piloto por venir). El gancho fiscal se vende como
orden + Contador Pack + roadmap; el modulo SIAT se menciona "en piloto", nunca
como incluido.

## 2. Segmentos objetivo priorizados (6, no mas)

| # | Rubro | Producto / vertical | Dolor #1 | Mercado eje LP+CBBA+SCZ | Precio de entrada (registry) | Por que AHORA |
|---|---|---|---|---|---|---|
| 1 | Clinicas dentales | DentalGest (beta activa) | Presupuestos sin seguimiento, citas olvidadas | Estimacion: 1.500-3.000 consultorios privados; direccionable ano 1: 300-500 | Bs. 320/mes (+ carga guiada Bs. 290) | Producto listo; facturacion en linea ya los alcanza; unico vertical con SaaS operable hoy |
| 2 | Importadoras / distribuidoras B2B | ProveeGest (BE como caso en curso) | Cotizaciones sin seguimiento con dolar flotante | Estimacion: 400-800 formales medianas (SCZ concentra); direccionable: 100-200 | Auditoria Bs. 250 o Diagnostico Bs. 690 → Implementacion desde Bs. 3.900 | Dolar flotante + DS 5646 les cambia costos cada semana; BE valida el pack |
| 3 | Pymes de servicios | GestiOS | Operacion en Excel, gerencia sin visibilidad | Estimacion: decenas de miles; foco con dolor visible: 1.000+ | Bs. 350/mes (+ kickstart Bs. 790) | Obligadas a facturar en linea desde abril; el contador les exige orden ya |
| 4 | Farmacias independientes | GestiOS hoy → pack ProveeGest Farma despues | Vencimientos, inventario y reprecios por dolar | Estimacion: varios miles en el eje; foco independientes 1-3 sucursales: 500-1.000 | Auditoria Bs. 250 → GestiOS Bs. 350/mes | Facturan al publico todos los dias: la obligacion en linea les pega directo |
| 5 | Ferreterias / materiales | GestiOS hoy → pack ProveeGest Ferreteria | Catalogo amplio + precios que cambian con el dolar | Estimacion: cientos en el eje (semi-mayoristas foco: 200-400) | Auditoria Bs. 250 → Implementacion o GestiOS | A un paso del pack distribucion (regla de adyacencia de la factory) |
| 6 | Consultorios medicos / estetica | DentalGest como base → pack estetica | Citas, recalls y cobros sin sistema | Estimacion: 1.000-2.000 en el eje | Web Bs. 790 o DentalGest adaptado Bs. 320/mes | A un paso del pack dental; misma urgencia de facturacion |

Reglas del foco:

- Los rubros 4-6 se atacan con oferta de ENTRADA (auditoria, web, GestiOS).
  El pack vertical propio se construye recien con 1 cliente real que pague
  (regla de la vertical factory). Cero desarrollo especulativo.
- Todo tamano de mercado de la tabla es **estimacion** interna, no censo.
  Sirve para priorizar, no para prometer.
- La web (Bs. 790-2.900) es puerta de entrada universal: cuando el cliente
  pide "seguimiento, cotizaciones o reportes", se escala al SaaS con core.

## 3. Canales y motor semanal

### 3.1 Prospeccion por rubro (skill `prospeccion-onia` + agente CRM)

- Ritmo semanal: 20 prospectos investigados (fuentes publicas, con URL),
  10 mensajes preparados y aprobados por Sergio, 3-4 demos agendadas.
- Mix semanal sugerido: 8 dental, 5 importadoras/distribuidoras, 4 pymes
  servicios, 3 del rubro exploratorio del mes (farmacias jul, ferreterias ago,
  consultorios sep).
- Regla de siempre: pocos prospectos buenos > listas largas. Nada se contacta
  sin aprobacion explicita. Todo entra al CRM Notion con `vendedor_origen`.

### 3.2 Contadores como canal de referidos (la palanca nueva)

El contador externo lleva la contabilidad de la pyme boliviana promedio y hoy
esta saturado por la facturacion en linea. El Contador Pack lo convierte en
aliado, no competidor.

Incentivo del contador aliado (usa reglas de comision YA vigentes):

1. **Comision de vendedor origen**: el contador se registra como
   `vendedor_origen` en el CRM. Por cada cliente referido que paga, cobra la
   comision de la tabla del registry (ej. DentalGest Basico Bs. 112, GestiOS
   Basico Bs. 122,50 — 35% de la primera mensualidad neta, una sola vez).
2. **Contador Pack gratis**: acceso sin costo a exports RCV, resumen IVA/IT y
   calendario por NIT de TODOS sus clientes que usen Onia, mientras tenga al
   menos 1 referido activo. Su herramienta de trabajo queda atada a Onia.
3. **Upsells**: si luego vende web o implementacion al mismo cliente, cobra la
   comision de esa nueva venta (regla CRM existente). Sin comision recurrente
   por mensualidades futuras.

Pendiente semana 1-2: Sergio define precio de lista del Contador Pack como
add-on (hoy no existe en el registry; hasta entonces se pilotea con clinicas
DentalGest sin publicar precio).

Metas del canal: 3-5 contadores contactados/semana desde S2; 2-3 aliados
activos a los 30 dias; 8-10 activos a los 90 dias con 4-6 clientes referidos
cobrados dentro de la cuota total.

### 3.3 Landings web-factory por vertical

- S3 julio: landing DentalGest viva (keywords de dolor: "sistema para clinica
  dental Bolivia", "agenda y presupuestos dental").
- Agosto: landing ProveeGest ("sistema de cotizaciones para importadoras",
  "reprecios por dolar") + pagina "ONIA para contadores" (canal 3.2).
- Toda landing captura a formulario → intake normalizado → WorkItem → CRM.
  Self-service (checkout) NO se abre en un vertical sin 1 caso de exito
  operando; hasta entonces las landings generan demos, no ventas automaticas.

### 3.4 Hermes copiloto comercial

- Briefing diario por Telegram: pipeline por estado, seguimientos vencidos y
  de hoy, demos agendadas, leads nuevos de landings (flujos n8n diario y
  semanal ya disenados en `CRM_AND_PROSPECTING.md`).
- Comandos en uso: `Resumen CRM ONIA`, `Seguimientos ONIA hoy`,
  `Busca prospectos ONIA: <rubro> | <ciudad>`, `Prepara venta <producto>: <empresa>`,
  `Genera propuesta: <empresa> | <industria> | <necesidad>`.
- Recordatorio automatico: prospecto con `proximo_seguimiento` vencido > 48h
  sube al tope del briefing hasta que alguien lo toque.

## 4. Cuotas 90 dias (fase sin portafolio)

Meta acumulada a 90 dias: **15-18 clientes cobrados** (piso 15, estirar a 20)
entre todos los productos. Un "cliente cobrado" = primer pago neto confirmado
(regla del registry: precio reservado solo con pago confirmado).

| Periodo | Foco | Actividad minima | Cobrados (acumulado) |
|---|---|---|---|
| S1 (06-12 jul) | Arranque + dental | 20 prospectos investigados, 10 contactos aprobados, 3 demos | 1 |
| S2 (13-19 jul) | Dental + primeros contadores | +20 prospectos, 4 demos, 3 contadores contactados | 2-3 |
| S3 (20-26 jul) | Landing dental viva + importadoras | +20 prospectos, 4 demos, 1 diagnostico ProveeGest vendido | 4 |
| S4 (27 jul-02 ago) | Cierre oferta de arranque (vence 31-jul) | Empuje de cierre a todo el pipeline tibio | 6 |
| Agosto | ProveeGest (BE referencia) + farmacias | 80 prospectos, 14 demos, landing ProveeGest, 1 implementacion cobrada | 11 |
| Septiembre (al 03-oct) | Volumen + contadores maduros | 80 prospectos, 14 demos, 4-6 cierres via contadores | 15-18 |

Mix esperado a 90 dias (estimacion, no promesa): 6-7 DentalGest, 3-4 GestiOS,
3-4 webs, 2 auditorias/diagnosticos, 1-2 ProveeGest (diagnostico →
implementacion). Ingreso estimado: MRR Bs. 3.500-5.500 + pagos unicos
Bs. 9.000-15.000 (estimacion con precios del registry; el margen vive en lo
recurrente).

Decisiones calendarizadas para Sergio:

- Antes del 31-jul: extender, ajustar o cerrar la oferta de arranque (limite
  20 clientes cobrados). El plan asume que la decision existe, no la inventa.
- Fin de agosto: si hay 1 caso de exito dental feliz, aprobar apertura del
  self-service DentalGest (checkout + trial 14 dias).

## 5. Guiones de apertura

**Clinica dental** (IG/WhatsApp manual, tras aprobar contacto):

> "Hola, Dra. [nombre]. Vi que [senal concreta: responden consultas por IG /
> agenda por telefono]. Trabajamos con clinicas dentales en Bolivia: DentalGest
> registra cada consulta y presupuesto como pendiente con responsable, y avisa
> las citas solo. Con lo de facturacion en linea de este ano, varias clinicas
> nos buscan para ordenar eso primero. Le muestro una demo corta de 15 minutos
> esta semana?"

**Importadora / distribuidora** (LinkedIn/correo publico):

> "Hola [nombre]. Con el dolar flotante desde junio y el arancel nuevo del 6 de
> julio, muchas importadoras estan repreciando a mano y perdiendo cotizaciones
> por el camino. Estamos implementando ProveeGest con una distribuidora
> electrica de 13 vendedores y 3 sucursales: cotizaciones con seguimiento,
> catalogo consultable y tablero por vendedor. Empezamos con un diagnostico
> corto (Bs. 690) que le dice exactamente que ordenar primero. Le interesa
> verlo con sus numeros?"

**Contador aliado** (WhatsApp/presencial):

> "Hola [nombre]. Se que la facturacion en linea te tiene tapado de clientes
> desordenados. Tenemos algo pensado para vos, no para reemplazarte: nuestros
> sistemas exportan el RCV de compras/ventas y el resumen IVA/IT listos cada
> mes, con calendario por digito de NIT. Para contadores aliados el pack es
> gratis, y por cada cliente tuyo que active un sistema Onia cobras la comision
> de esa venta (ej. Bs. 112-525 segun plan). Te muestro un export de ejemplo?"

Reglas de guion: senal real verificada antes de escribir; nada de "ventas
garantizadas", WhatsApp automatico ni SIAT incluido; CTA siempre a demo,
auditoria o ejemplo concreto.

## 6. Metricas y ritual del lunes (Sergio + Hermes, 30 min)

Panel del lunes (Hermes lo arma con `Resumen CRM ONIA` + Notion):

| Metrica | Pregunta que responde | Alarma |
|---|---|---|
| Cobrados acumulados vs cuota | Vamos al 15-18? | 2 semanas seguidas bajo cuota → revisar mix de rubros |
| Pipeline por estado (12 etapas CRM) | Donde se atasca? | >30% estancado en "Contactado" → mensajes no conectan |
| Demos agendadas/realizadas | El motor genera reuniones? | <3 demos/semana → subir prospeccion aprobada |
| Conversion demo → cobrado | Cerramos o paseamos? | <1 de 4 → revisar oferta de entrada y precio ancla |
| Seguimientos vencidos | Algo quedo sin responsable? | Debe cerrar el lunes en 0 |
| Contadores: contactados / activos / referidos cobrados | El canal nuevo camina? | 0 referidos a los 45 dias → revisar incentivo |
| Leads por landing (web_form) | Las landings capturan? | Landing viva con 0 leads en 2 semanas → revisar keywords |
| Cupo oferta de arranque (X/20) y comisiones (calculadas/pendientes/pagadas) | Estamos al dia con vendedores? | Regla: sin datos completos, no hay comision aprobada |
| Radar normativo (nueva RND/DS) | Cambio el terreno de juego? | Nueva norma → WorkItem "revisar impacto" + ajustar guiones |

Cierre del ritual: 3 decisiones maximo para la semana (que rubro empuja, que
se corrige, que se abandona). Todo lo demas es ejecucion del motor.

## Reglas duras (no negociables)

1. No contactar, publicar ni enviar entregables sin aprobacion explicita.
2. WhatsApp automatico bloqueado hasta verificacion Meta; SIAT y TR4 son
   integraciones gated — se venden como piloto/roadmap, nunca como incluidas.
3. Precios y comisiones: solo los del registry. Descuentos fuera de oferta
   requieren aprobacion de Onia.
4. Dominio, hosting y costos de terceros a cargo del cliente, a su nombre.
5. Plantillas internas = confidencial. No fabricar datos: donde no hay dato,
   se pide o se marca "estimacion".
6. Un vertical nuevo no se abre sin 1 caso de exito cobrado del anterior.
