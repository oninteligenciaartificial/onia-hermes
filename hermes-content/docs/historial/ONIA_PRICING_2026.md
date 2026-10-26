# Onia Pricing 2026 — DEGRADADO, ya no es fuente

> 🔴 **Este documento NO define ningún precio. Degradado el 2026-08-27.**
>
> **Los precios se LEEN del código:**
> - **Planes de suscripción → `onia-platform/lib/subscription-plans.ts`** (`DEFAULT_PLAN_AMOUNTS`).
>   Es lo que **valida el cobro**: si un doc dice otro monto, el pago se rechaza.
> - **Add-ons → `onia-platform/lib/pricing.ts`** (ahí también viven los nombres visibles de los
>   planes, en `PLAN_LABELS`).
>
> **Para vender, andá a `ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md`:** una sola tabla con precio y
> función, cruzada contra el código.
>
> **Por qué se degradó.** Este archivo se autodeclaraba *documento canónico de precios* — contra
> `CLAUDE.md`, que dice que mandan los dos archivos de código. Tenía cifras de **junio** y era **el
> doc más enlazado del repo (17 archivos entrantes)**, con su tabla clonada literal en otros dos.
> Con eso, cualquier sesión elegía mal: así llegamos a tener **cuatro precios vivos del mismo
> chatbot al mismo tiempo**, y un one-pager que citaba `pricing.ts` como fuente mientras escribía
> otro número.
>
> **Qué sigue sirviendo acá:** las REGLAS comerciales (comisión sobre lo realmente cobrado, costos
> de terceros excluidos, el precio se reserva solo con pago confirmado) y la línea de **webs,
> consultoría y automatización**, que `pricing.ts` NO cubre.
>
> ⚠️ **Esa línea, por decisión del 2026-08-24, no lleva lista de precios: se cotiza caso por
> caso** (`ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md` §4.5). Las cifras de web y consultoría de abajo son
> referencia histórica de rango, **no un tarifario**. 🔴 **Nadie debe corregirlas contra
> `pricing.ts`: ese archivo no cubre esta línea.** Un barrido que las toque está rompiendo, no
> ordenando.
>
> **Qué está MUERTO acá:** `GestiOS` no es un producto (es un rubro de Onia Platform; sus repos son
> legado) · los nombres `DentalGest Basico / Profesional / Clinica` (hoy **Básico · Profesional ·
> Completo · Empresa**, de `PLAN_LABELS`) · la vigencia *hasta 2026-07-31*.

Ultima actualizacion como fuente: 2026-06-22 · **Degradado: 2026-08-27**

## Veredicto contable

Onia no vende "posts" ni "software barato". Onia vende sistemas, seguimiento,
captacion y automatizacion para que los negocios tengan mas orden y mejores
conversaciones comerciales.

Reglas actuales:

- SaaS self-service: sin setup obligatorio.
- Onboarding: opcional y vendido como acelerador.
- Webs y sistemas: precio cerrado, normalmente mitad de anticipo y mitad contra
  entrega.
- Videos IA / Higgsfield: pausado como oferta comercial independiente.
- Consultoria: vender diagnostico, instalacion, capacitacion y acompanamiento
  como linea propia.
- Comision: una venta cobrada, una comision.
- Sergio y Onia deben quedar por delante del vendedor por entrega, soporte,
  direccion, herramientas, mantenimiento y riesgo.

## Oferta de arranque comercial - junio/julio 2026

Decision operativa: Onia necesita cerrar ventas rapido, pero sin posicionarse
como proveedor barato permanente. Por eso estos son precios de arranque con
cupo y fecha, no nuevos precios definitivos.

Vigencia:

- Valida hasta 2026-07-31 o hasta 20 clientes cobrados, lo que ocurra primero.
- El precio se reserva solo con pago confirmado.
- DentalGest y GestiOS mantienen su precio actual. No se descuentan por ahora
  porque ya son el producto SaaS que debe sostener margen y soporte.
- En servicios mensuales no SaaS, el precio de arranque cubre los primeros 3
  meses. Desde el mes 4 se puede pasar al precio vigente avisando antes.
- Si el cliente paga 3 meses adelantados, se respeta ese periodo completo.
- No incluye impuestos, pauta, dominios, hosting, pasarelas, herramientas,
  creditos IA, APIs, SMS, WhatsApp, servidores ni gastos de terceros.
- La comision del vendedor se calcula sobre el monto neto realmente cobrado, no
  sobre el precio de lista.
- No prometer ventas garantizadas, viralidad ni automatizacion de WhatsApp.

### Precios para vender ahora

| Oferta | Precio de arranque | Comision vendedor |
|---|---:|---:|
| Plan Básico | Bs. 320/mes | Bs. 112.00 |
| Plan Profesional | Bs. 750/mes | Bs. 262.50 |
| Plan Completo | Bs. 1.500/mes | Bs. 525.00 |
| GestiOS Basico | Bs. 350/mes | Bs. 122.50 |
| GestiOS Crecer | Bs. 530/mes | Bs. 185.50 |
| GestiOS Pro | Bs. 800/mes | Bs. 280.00 |
| GestiOS Empresarial | Bs. 1,250/mes | Bs. 437.50 |
| Landing de Captacion | Bs. 790 | Bs. 79.00 |
| Web Profesional | Bs. 1,500 | Bs. 180.00 |
| Web Pro Onia | Bs. 2,900 | Bs. 348.00 |
| Portal o Sistema Web mini | desde Bs. 6,500 | desde Bs. 650.00 |
| Auditoria Express | Bs. 250 | Bs. 25.00 |
| Diagnostico + Plan de Accion | Bs. 690 | Bs. 69.00 |
| Instalacion de Flujo Simple | Bs. 1,500 | Bs. 150.00 |
| Implementacion Operativa | desde Bs. 3,900 | desde Bs. 390.00 |
| Conexion de canal social | Bs. 690 setup | Bs. 69.00 |
| Automatizacion simple n8n | Bs. 790 setup | Bs. 79.00 |
| Flujo de aprobacion n8n | Bs. 1,200 setup | Bs. 120.00 |
| Onia Motor Local Starter | Bs. 1,500 setup + Bs. 790/mes | Bs. 150 setup + Bs. 79 primer mes |
| Onia Motor Local Growth | Bs. 2,900 setup + Bs. 1,900/mes | Bs. 290 setup + Bs. 190 primer mes |
| Onia Motor Local Pro | Bs. 4,900 setup + Bs. 3,900/mes | Requiere aprobacion |

Frase comercial:

```text
Estamos abriendo cupos de arranque para implementar casos reales con ONIA. Este
precio queda reservado hasta [FECHA] solo con pago confirmado. Luego se aplica
el precio vigente.
```

## Caballito de batalla: Onia Motor Local

Onia Motor Local es la oferta recurrente principal para sostener caja mensual.
No se vende como "posts" ni como "IA"; se vende como captacion, presencia,
CRM simple, seguimiento y mejora mensual para negocios locales.

| Plan | Precio | Uso |
|---|---:|---|
| Starter | Bs. 1,500 setup + Bs. 790/mes | Entrada para negocios pequenos. |
| Growth | Bs. 2,900 setup + Bs. 1,900/mes | Paquete principal que Onia debe empujar. |
| Pro | Bs. 4,900 setup + Bs. 3,900/mes | Solo con aprobacion y capacidad de entrega. |

Growth es el paquete recomendado. Cinco clientes Growth activos producen
Bs. 9.500/mes y aportan Bs. 3.800 al Fondo Onia si se aplica 40%.

Incluye segun plan: auditoria, Google Business Profile, landing o mejora de
captacion, CRM simple, aviso/seguimiento n8n, reporte y mejora mensual. Pauta,
dominios, hosting, WhatsApp, APIs, herramientas externas, produccion externa y
gastos de terceros se cobran aparte.

Fuente operativa completa:

```text
hermes-content/docs/ONIA_CASH_ENGINE_SERVICE_CATALOG_2026.md
```

## Costos excluidos de comision

Nunca se calcula comision sobre:

- impuestos;
- pauta publicitaria;
- dominios;
- hosting;
- pasarelas de pago;
- herramientas externas;
- creditos IA;
- APIs;
- SMS, WhatsApp o mensajeria pagada;
- servidores;
- gastos de terceros.

## Topes iniciales de comision

Estos topes son para vendedores nuevos. Pueden subir por buen trabajo, rol,
calidad de clientes, volumen y margen aprobado.

| Categoria | Comision inicial |
|---|---:|
| DentalGest mensual | 35% del primer pago neto |
| GestiOS mensual | 35% del primer pago neto |
| Add-on mensual aprobado | 35% del primer pago neto |
| Paginas web | 10% a 12% del pago neto |
| Conectores y n8n | 10% del setup neto |
| Sistemas personalizados | 10% del primer pago neto |
| Consultoria Onia | 10% a 15% segun paquete |
| Cuidado/soporte mensual aprobado | 10% del primer mes si se vende aparte |

## DentalGest

Sistema por suscripcion para clinicas dentales que necesitan ordenar pacientes,
citas, presupuestos y seguimiento.

Por ahora DentalGest se vende solo como suscripcion mensual. No vender carga
inicial, migracion, capacitacion, plan anual ni descuentos especiales hasta
aprobacion de Onia.

| Plan | Precio | Comision vendedor |
|---|---:|---:|
| Plan Básico | Bs. 320/mes | Bs. 112.00 |
| Plan Profesional | Bs. 750/mes | Bs. 262.50 |
| Plan Completo | Bs. 1.500/mes | Bs. 525.00 |
| Onboarding express | Bs. 290 | Bs. 29.00 |
| Configuracion asistida | Bs. 690 | Bs. 69.00 |
| Migracion + capacitacion equipo (onboarding guiado) | **cotizado por alcance** (`pricing.ts`) | 10% de lo cobrado |
| Agenda publica en el plan Básico | Bs. 150/mes (incluida en Profesional y Completo) | Bs. 52.50 |
| Usuario extra | Bs. 70/usuario/mes | Bs. 24.50 |
| ~~Insumos dentales en Basico~~ | 🔴 **NO EXISTE en `pricing.ts` — no cobrarlo (2026-08-27).** El inventario está incluido en todos los planes y **no tiene versión paga**: compras a crédito, proveedores, vencimientos por lote y alertas de stock bajo no las gatea ningún archivo del producto. El add-on "Inventario avanzado" se retiró el 2026-08-27. Vender un "módulo de insumos" a Bs 80 es cobrar por algo que ya es gratis. | — |
| ~~Inventario avanzado~~ | ⛔ **RETIRADO de la oferta (Sergio, 2026-08-27: "no se cobra").** Las funciones siguen encendidas y gratis para todos; no hay gate que las cobre | — |
| Chatbot WhatsApp con IA (add-on de plataforma) | **Bs 390/mes o Bs 3.900/año, sin cargo inicial** — se lee de `pricing.ts` | Requiere aprobacion |

⚠️ **Corregido 2026-08-27.** Acá decía `instalacion Bs. 650 + mensualidad Bs. 350 + tarifas
Meta variables`. Eso murió el 2026-08-21: el add-on es **Bs 390/mes o Bs 3.900/año, SIN
instalación**, y **el cliente le paga a Meta directo** con su propia tarjeta en su cuenta de
WhatsApp Business — Onia sale de esa cadena de pago, y ningún texto puede decir que nosotros
facturamos los mensajes. Fuente: `onia-platform/lib/pricing.ts`, `WHATSAPP_ADDON`.
Se eliminó el cobro de instalación porque un pago de entrada de Bs 2.990 para PROBAR un
chatbot frenaba la venta.

## GestiOS

Sistema operativo para pymes que necesitan ordenar clientes, tareas,
responsables, estados y reportes.

| Plan | Precio | Comision vendedor |
|---|---:|---:|
| GestiOS Basico | Bs. 350/mes | Bs. 122.50 |
| GestiOS Crecer | Bs. 530/mes | Bs. 185.50 |
| GestiOS Pro | Bs. 800/mes | Bs. 280.00 |
| GestiOS Empresarial | Bs. 1,250/mes | Bs. 437.50 |

## Paginas web y portales

| Servicio | Precio | Comision vendedor |
|---|---:|---:|
| Landing de Captacion | Bs. 790 | Bs. 79.00 |
| Web Profesional | Bs. 1,500 | Bs. 180.00 |
| Web Pro Onia | Bs. 2,900 | Bs. 348.00 |
| Portal o Sistema Web | desde Bs. 6,500 | desde Bs. 650.00 |
| Cuidado Web Basico | Bs. 190/mes | Bs. 19.00 |
| Cuidado Web Crecimiento | Bs. 390/mes | Bs. 39.00 |
| Cuidado Web Pro | Bs. 690/mes | Bs. 69.00 |

## Oferta pausada: Videos IA / Higgsfield

Pausado como producto comercial independiente. Por ahora el vendedor no debe
ofrecer videos IA, packs Higgsfield ni promesas de contenido con IA. Si un
cliente pregunta por contenido, llevarlo primero a web, auditoria o diagnostico.

## Conectores Cross-Platform

| Servicio | Precio | Comision vendedor |
|---|---:|---:|
| Conexion Instagram/Meta | Bs. 690 | Bs. 69.00 |
| Conexion TikTok | Bs. 690 | Bs. 69.00 |
| Conexion YouTube Shorts | Bs. 690 | Bs. 69.00 |
| Conexion LinkedIn | Bs. 690 | Bs. 69.00 |
| Automatizacion simple n8n | Bs. 790 | Bs. 79.00 |
| Flujo de aprobacion n8n | Bs. 1,200 | Bs. 120.00 |
| Soporte/cuidado de integracion | Cotizado aparte | Segun acuerdo |

WhatsApp automatico queda pendiente hasta verificacion Meta. Onia vende la
implementacion del flujo, no acceso a n8n como producto independiente del
cliente. Si el cliente necesita su propia instancia, editor, credenciales,
retencion de logs o operacion 24/7, se cotiza infraestructura y soporte aparte.

Una automatizacion simple n8n incluye un flujo cerrado, por ejemplo: formulario
web o Typeform -> registro en Notion/Google Sheets -> aviso por Telegram/email
-> tarea de seguimiento. No incluye integraciones pagadas, WhatsApp automatico,
publicacion automatica, scraping masivo ni mantenimiento mensual.

Un flujo de aprobacion n8n incluye estados como recibido, pendiente, aprobado,
rechazado y notificado, con registro simple de quien aprueba. Sirve para
formularios, propuestas, contenido o leads. Si requiere APIs especiales,
login de terceros o reglas complejas, se cotiza aparte.

## Consultoria e implementaciones Onia

| Servicio | Precio | Comision vendedor |
|---|---:|---:|
| Auditoria Express | Bs. 250 | Bs. 25.00 |
| Diagnostico + Plan de Accion | Bs. 690 | Bs. 69.00 |
| Instalacion de Flujo Simple | Bs. 1,900 | Bs. 190.00 |
| Implementacion Operativa | Bs. 4,900 a 6,500 | Bs. 490 a 650 |

Auditoria Express incluye revision de presencia digital, oferta, web/redes,
canal de contacto y seguimiento comercial. Entrega 3 problemas concretos, 3
acciones recomendadas y una oferta sugerida de Onia. No incluye implementacion.

Diagnostico + Plan de Accion incluye una sesion mas profunda, mapa del proceso
actual, prioridades, presupuesto recomendado y siguiente propuesta. Conviene
cuando el cliente no sabe si necesita web, CRM, automatizacion o sistema.

## Sistemas personalizados

| Servicio | Precio | Comision vendedor |
|---|---:|---:|
| Discovery Pagado | Bs. 990 | Bs. 99.00 |
| Dashboard o CRM Personalizado | desde Bs. 5,000 | desde Bs. 500 |
| Portal Cliente o MVP SaaS | desde Bs. 9,500 | desde Bs. 950 |
| Integracion Extra | desde Bs. 1,900 | desde Bs. 190 |

## Reglas para subir precios al cliente

- Una cotizacion reserva precio solo hasta la fecha escrita.
- Si el cliente no pago, no tiene precio congelado.
- Si pago mensual, se respeta el mes pagado.
- Si pago anual, se respeta hasta terminar el periodo anual.
- Upgrades, add-ons y nuevos servicios usan precio vigente.
- Todo descuento especial debe tener limite de clientes, fecha o meses.
- Cambios a clientes activos se avisan antes de la siguiente renovacion.

Frase de cotizacion:

```text
Este precio queda reservado hasta [FECHA] si se confirma con pago. Si se confirma
despues, se aplica el precio vigente de ONIA.
```

## Reglas comerciales

- No prometer ventas garantizadas.
- No prometer viralidad garantizada.
- No prometer funciones no confirmadas.
- No prometer WhatsApp automatico antes de verificacion Meta.
- No contactar clientes sin aprobacion cuando la lista sea asignada.
- No cobrar en cuentas personales.
- No pagar comisiones sin CRM completo.
- No publicar contenido client-facing sin aprobacion.
