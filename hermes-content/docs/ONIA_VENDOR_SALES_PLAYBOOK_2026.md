# Onia Vendor Sales Playbook 2026

> 🔴 **PRECIOS DE PLATAFORMA DESACTUALIZADOS — leer antes de cotizar (2026-08-27).**
>
> Las tablas de abajo son de junio y **no son fuente**. Los precios de la plataforma se LEEN de
> `onia-platform/lib/subscription-plans.ts` (planes) y `onia-platform/lib/pricing.ts` (add-ons);
> la versión vendible, con las funciones al lado, está en
> **`ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md`**.
>
> Lo que hay que saber antes de abrir la boca con un cliente:
> - Los planes son **Básico Bs 320 · Profesional Bs 750 · Completo Bs 1.500 · Empresa Bs 2.900**
>   (mensual; anual = 10 meses). **Ya no se llaman DentalGest Basico/Profesional/Clinica**: Onia
>   vende 7 rubros y el pack dental es uno.
> - El **chatbot de WhatsApp** es **Bs 390/mes o Bs 3.900/año, sin cargo inicial**. Los mensajes se
>   los cobra **Meta directamente al cliente** en su cuenta: nosotros no los facturamos ni los
>   marcamos.
> - **`GestiOS` no existe como producto.** Es un rubro de Onia Platform; sus repos son legado.
> - Las líneas de **web, consultoría y automatización no llevan lista de precios**: se cotizan caso
>   por caso (decisión 2026-08-24). Las cifras de abajo son rango histórico, no tarifario, y **no se
>   corrigen contra `pricing.ts`** — ese archivo no cubre esa línea.

## Veredicto

Onia vende sistemas de crecimiento, no piezas sueltas. El vendedor debe detectar
perdida de oportunidades, ofrecer una demo o auditoria corta y cerrar una
primera compra rentable.

Politica comercial:

- Una venta = una comision.
- La comision se paga una sola vez sobre monto neto cobrado.
- Este es el plan inicial para vendedores nuevos.
- DentalGest mensual paga 35% del primer pago neto cobrado.
- GestiOS mensual paga 35% del primer pago neto cobrado.
- Cuidado web mensual paga 10% del primer mes solo si se vende aparte.
- Las comisiones pueden subir por buen desempeno, rol o aprobacion comercial.
- No se comisionan impuestos, pauta, dominios, hosting, pasarelas ni
  herramientas de terceros.
- Si hay reembolso, chargeback o cancelacion antes de 30 dias, la comision se
  descuenta de la siguiente liquidacion.
- No contactar prospectos ni publicar contenido sin aprobacion explicita.

## Oferta de arranque para vender ahora

Usar esta tabla cuando el objetivo sea cerrar clientes reales rapido. Es una
oferta limitada, no una rebaja permanente de Onia.

Condiciones:

- Vigente hasta 2026-07-31 o hasta 20 clientes cobrados.
- El precio se reserva solo con pago confirmado.
- DentalGest y GestiOS mantienen su precio actual. No se descuentan por ahora.
- En servicios mensuales no SaaS, el precio de arranque cubre los primeros 3
  meses; desde el mes 4 se puede pasar al precio vigente avisando antes.
- La comision se calcula sobre el monto neto realmente cobrado.
- No incluye gastos externos ni promesas de resultado garantizado.

| Producto | Precio de arranque | Premio vendedor |
|---|---:|---:|
| Plan Básico | Bs. 320/mes | Bs. 112 |
| Plan Profesional | Bs. 750/mes | Bs. 262,50 |
| Plan Completo | Bs. 1.500/mes | Bs. 525 |
| GestiOS Basico | Bs. 350/mes | Bs. 122,50 |
| GestiOS Crecer | Bs. 530/mes | Bs. 185,50 |
| GestiOS Pro | Bs. 800/mes | Bs. 280 |
| GestiOS Empresarial | Bs. 1.250/mes | Bs. 437,50 |
| Landing Express | Bs. 790 | Bs. 79 |
| Web Negocio | Bs. 1.500 | Bs. 180 |
| Web Pro Onia | Bs. 2.900 | Bs. 348 |
| Portal / sistema web mini | desde Bs. 6.500 | desde Bs. 650 |
| Auditoria Express Onia | Bs. 250 | Bs. 25 |
| Diagnostico + Plan de Accion | Bs. 690 | Bs. 69 |
| Instalacion de Flujo Simple | Bs. 1.500 | Bs. 150 |
| Implementacion Operativa | desde Bs. 3.900 | desde Bs. 390 |
| Conexion de canal social | Bs. 690 setup | Bs. 69 |
| Automatizacion simple n8n | Bs. 790 setup | Bs. 79 |
| n8n aprobaciones | Bs. 1.200 setup | Bs. 120 |

Frase de cierre:

```text
Tenemos cupos de arranque para implementar casos reales con ONIA. Si confirma
con pago, se reserva este precio por el periodo indicado; despues aplica el
precio vigente.
```

## Premios por venta

| Producto | Precio | Premio vendedor |
|---|---:|---:|
| Plan Básico | Bs. 320/mes | Bs. 112 |
| Plan Profesional | Bs. 750/mes | Bs. 262,50 |
| Plan Completo | Bs. 1.500/mes | Bs. 525 |
| Onboarding express DentalGest | Bs. 290 | Bs. 29 |
| Configuracion asistida DentalGest | Bs. 690 | Bs. 69 |
| Migracion + capacitacion (onboarding guiado) | **cotizado por alcance** (`pricing.ts`) | 10% de lo cobrado |
| Agenda publica en el plan Básico | Bs. 150/mes (incluida en Profesional y Completo) | Bs. 52,50 |
| Usuario extra DentalGest | Bs. 70/usuario/mes | Bs. 24,50 |
| ~~Insumos dentales en Básico~~ | 🔴 **NO EXISTE en `pricing.ts` — no cobrarlo (2026-08-27).** El inventario está incluido en todos los planes y **no tiene versión paga**: compras a crédito, proveedores, vencimientos por lote y alertas de stock bajo no las gatea ningún archivo del producto. El add-on "Inventario avanzado" se retiró el 2026-08-27. Vender un "módulo de insumos" a Bs 80 es cobrar por algo que ya es gratis. | — |
| ~~Inventario avanzado~~ | ⛔ **RETIRADO de la oferta (Sergio, 2026-08-27: "no se cobra").** Las funciones siguen encendidas y gratis para todos | — |
| Chatbot WhatsApp con IA (add-on) | **Bs 390/mes o Bs 3.900/año, sin cargo inicial**; los mensajes los cobra Meta al cliente | requiere aprobacion |
| GestiOS Basico | Bs. 350/mes | Bs. 122,50 |
| GestiOS Crecer | Bs. 530/mes | Bs. 185,50 |
| GestiOS Pro | Bs. 800/mes | Bs. 280 |
| GestiOS Empresarial | Bs. 1.250/mes | Bs. 437,50 |
| Landing Express | Bs. 790 | Bs. 79 |
| Web Negocio | Bs. 1.500 | Bs. 180 |
| Web Pro Onia | Bs. 2.900 | Bs. 348 |
| Portal / sistema web | desde Bs. 6.500 | desde Bs. 650 |
| Auditoria Express Onia | Bs. 250 | Bs. 25 |
| Diagnostico + Plan de Accion | Bs. 690 | Bs. 69 |
| Instalacion de Flujo Simple | Bs. 1.900 | Bs. 190 |
| Implementacion Operativa | Bs. 4.900-6.500 | Bs. 490-650 |
| Conexion de canal social | Bs. 690 setup | Bs. 69 |
| Automatizacion simple n8n | Bs. 790 setup | Bs. 79 |
| n8n aprobaciones | Bs. 1.200 setup | Bs. 120 |

## Crecimiento del vendedor

La tabla anterior es inicial. A medida que empecemos a vender, cobrar y validar
clientes sanos, Onia puede mejorar comisiones, bonos o rol por tramos cuando el
vendedor demuestra:

- datos completos en Notion;
- seguimiento puntual;
- cierres cobrados;
- clientes de buena calidad;
- cero promesas falsas;
- capacidad de vender upsells;
- bajo nivel de cancelaciones o reclamos.

La mejora no es automatica. Se aprueba segun ventas reales cobradas, margen,
calidad del cliente, bajo nivel de reclamos y resultado real.

## Como vender DentalGest

Cliente ideal:

- Clinicas dentales con Facebook/Instagram activo.
- Clinicas con web pero sin evidencia de CRM o seguimiento.
- Clinicas multi-sede o con tratamientos de alto valor.

Dolores a escuchar:

- "Nos escriben por varias redes".
- "A veces no sabemos si se respondio".
- "Los presupuestos quedan pendientes".
- "Las citas y consultas se manejan por telefono o mensajes".

Palabras clave para buscar:

- clinica dental Bolivia
- odontologia Santa Cruz
- ortodoncia La Paz
- implantes dentales Cochabamba
- estetica dental Bolivia
- odontopediatria Bolivia
- clinica dental Facebook Bolivia

Oferta recomendada:

- Basico para consultorio pequeno.
- Profesional para clinica en crecimiento.
- Clinica para multiples sedes o equipo grande.
- Add-on real: WhatsApp operativo solo si Onia valida Meta, numero, plantillas
  y costos por mensaje.

Mensaje base:

```text
Hola, soy Sergio de ONIA. Vi que su clinica recibe consultas por redes/web y
creo que hay una oportunidad simple: ordenar consultas, seguimiento de pacientes
potenciales, citas y presupuestos pendientes en un solo sistema.

No quiero venderles algo generico. Si les sirve, les muestro una demo corta de
DentalGest y vemos si encaja con su proceso actual.
```

Como cerrar:

1. Pedir permiso para demo corta.
2. Mostrar perdida: consulta entra, queda sin estado, no hay seguimiento.
3. Mostrar solucion: lead, paciente, cita, presupuesto y recordatorio.
4. Ofrecer suscripcion mensual segun necesidad real.
5. Cerrar mensualidad o demo agendada.

## Como vender GestiOS

Cliente ideal:

- Pymes con tareas, pedidos, clientes o reportes manuales.
- Empresas que usan Excel y WhatsApp para operar.
- Negocios con responsables poco claros.

Palabras clave para buscar:

- empresa servicios Bolivia
- distribuidora Bolivia
- constructora pequeña Bolivia
- taller automotriz Santa Cruz
- inmobiliaria Bolivia
- centro estetico Bolivia
- empresa con sucursales Bolivia

Oferta recomendada:

- Basico para POS, inventario, pedidos y caja.
- Crecer para mas productos, clientes, usuarios y reportes.
- Pro para tienda online y pagos QR solo cuando el proveedor este validado.
- Empresarial para sucursales, roles, auditoria y soporte prioritario.
- SIAT no se vende por ahora.

Mensaje base:

```text
Hola, soy Sergio de ONIA. Estamos trabajando con sistemas para que negocios con
tareas, clientes, pedidos o reportes dejen de depender de Excel y mensajes
sueltos.

Si te sirve, te muestro como se veria tu operacion en un tablero simple:
responsables, estados y reportes en un solo lugar.
```

## Como vender paginas web Onia

Cliente ideal:

- Negocios que dependen solo de redes.
- Webs antiguas, lentas o sin formulario claro.
- Profesionales con oferta de alto ticket.

Palabras clave para buscar:

- no tiene pagina web Bolivia
- clinica estetica Bolivia Instagram
- inmobiliaria Bolivia Facebook
- abogado Bolivia Facebook
- restaurante Santa Cruz Instagram
- centro medico Bolivia
- servicios profesionales Bolivia

Oferta recomendada:

- Landing Express para validar rapido.
- Web Negocio para presencia seria.
- Web Pro Onia para presencia completa + copy + formulario + seguimiento basico.
- Portal/SaaS para productos propios o procesos internos.

Mensaje base:

```text
Hola, soy Sergio de ONIA. Vi su presencia digital y creo que hay una oportunidad
simple: una pagina que explique mejor la oferta, capture consultas y deje el
seguimiento ordenado.

Si quieres, te preparo una auditoria corta con 2 mejoras puntuales.
```

## Oferta pausada: Videos IA / Higgsfield

Pausado como producto comercial independiente. No ofrecer videos IA, packs
Higgsfield ni promesas de contenido con IA. Si un prospecto pide contenido,
llevarlo primero a auditoria, web, diagnostico o automatizacion simple.

## Como vender conectores y n8n

Cliente ideal:

- Clientes que reciben leads por formulario, redes o WhatsApp y los pierden.
- Equipos que necesitan avisos y seguimiento sin depender de memoria manual.
- Negocios que quieren registrar solicitudes en Notion, Sheets o CRM.
- Equipos que quieren aprobacion antes de publicar o enviar algo.

Regla:

- Se vende setup cerrado; soporte recurrente se cotiza aparte segun alcance.
- Onia vende la implementacion del flujo, no acceso a n8n como plataforma.
- No se promete aprobacion de plataforma.
- WhatsApp queda fuera hasta verificacion de negocio Meta.
- La automatizacion simple n8n cuesta Bs. 790 y cubre un flujo: entrada ->
  registro -> aviso -> tarea.
- El flujo n8n de aprobaciones cuesta Bs. 1.200 y cubre estados: recibido,
  pendiente, aprobado, rechazado y notificado.
- APIs pagadas, scraping masivo, WhatsApp, logins de terceros o reglas complejas
  se cotizan aparte.

Mensaje base:

```text
Podemos dejar un flujo simple: cuando entra una consulta, se registra en una
tabla/CRM y llega un aviso para hacer seguimiento. Si necesitan aprobacion,
tambien podemos armar pasos de revisar, aprobar y notificar.
```

## Como vender Consultoria Onia

Cliente ideal:

- Negocio que sabe que tiene desorden, pero no sabe si necesita web, CRM,
  automatizacion, contenido o sistema.
- Empresa que ya usa varias herramientas, pero no tiene proceso.
- Profesional o pyme que quiere instalar IA sin perder control.
- Cliente que quiere "que le armen todo" y no solo recibir recomendaciones.

Oferta recomendada:

- Auditoria Express para abrir confianza.
- Diagnostico + Plan de Accion si necesita direccion antes de decidir.
- Instalacion de Flujo Simple si hay un flujo claro.
- Implementacion Operativa si hay equipo, responsables y varios pasos.

Mensaje base:

```text
Hola, soy Sergio de ONIA. Podemos revisar tu proceso y decirte que conviene
instalar primero: CRM, web, seguimiento, automatizacion, contenido o reportes.

La idea no es venderte una herramienta suelta, sino dejarte un flujo funcionando.
Si quieres, empezamos con una auditoria express.
```

La Auditoria Express cuesta Bs. 250 e incluye revision de web/redes/oferta,
canal de contacto y seguimiento. Entrega 3 problemas concretos, 3 acciones
recomendadas y una oferta sugerida de Onia. No incluye implementacion.

El Diagnostico + Plan cuesta Bs. 690 e incluye sesion, mapa simple del proceso,
prioridades, presupuesto recomendado y siguiente propuesta.

Regla para vendedores:

- El vendedor puede ofrecer auditoria o diagnostico.
- No debe prometer una arquitectura tecnica cerrada sin revision de Onia.
- No debe incluir herramientas, dominios, hosting, pauta, creditos IA o APIs en
  el precio salvo que la propuesta lo diga.
- Sergio lidera la parte consultiva cuando el ticket o la complejidad lo amerita.

## Objeciones y respuestas

| Objecion | Respuesta |
|---|---|
| "Ya usamos WhatsApp" | Perfecto. Onia no reemplaza al equipo; ordena lo que entra y evita que se pierda seguimiento. WhatsApp automatico se activa solo cuando Meta lo permita. |
| "No necesito sistema" | Entonces empecemos por una auditoria: vemos donde se pierden consultas y si hay suficiente dolor para justificarlo. |
| "Esta caro" | Lo caro es perder consultas de alto valor sin saberlo. Podemos empezar por el plan minimo o una landing/auditoria. |
| "No tengo tiempo" | Justamente por eso la demo dura poco: mostramos flujo actual vs flujo ordenado. |
| "Quiero resultados garantizados" | No prometemos ventas garantizadas. Prometemos sistema, contenido y seguimiento para mejorar conversion y visibilidad. |
| "Solo necesito que me instalen algo" | Perfecto. Primero definimos el flujo exacto y lo instalamos con prueba, mini SOP y entrega. |
| "Eso lo puedo hacer yo" | Si, pero Onia cobra por decidir bien, instalar ordenado y dejar el proceso usable para el equipo. |

## Secuencia de venta

1. Investigar senales publicas.
2. Elegir producto primario.
3. Escribir mensaje con dolor especifico.
4. Pedir aprobacion interna.
5. Contactar por canal permitido.
6. Si responde, agendar demo o auditoria.
7. Si compra, registrar monto neto cobrado y calcular comision.
8. No entregar ni publicar nada sin aprobacion y pago segun politica.

## Prioridad de venta

1. DentalGest con clinicas de prioridad alta.
2. Web + DentalGest para clinicas con web debil o solo Facebook.
3. Web Onia para negocios sin presencia clara.
4. Auditoria Express para negocios que no saben por donde empezar.
5. GestiOS para pymes fuera del rubro dental.
6. Automatizacion simple n8n como upsell despues de web, formulario o CRM.
