# CRM real de Bolivian Electric — análisis y qué significa para Onia Platform

> Fecha: 2026-07-26. Fuente: `CRM BE GERENCIA COMERCIAL MODELO.xlsm` (enviado por un
> usuario real de la Gerencia Comercial de Bolivian Electric — "es el que uso por el momento").
> Análisis estático completo: 161 hojas, fórmulas, catálogos y macros extraídos sin ejecutar VBA.
> **Regla que motiva este doc (Sergio):** el CRM de Onia se diseña desde un negocio REAL
> boliviano, no genérico; y el mismo producto debe servir al negocio chico que no necesita
> nada de esto y a la empresa grande que sí.

---

## 1. Qué es (anatomía del Excel)

Un CRM comercial completo hecho a mano en Excel + macros de navegación. 161 hojas:

| Familia | Hojas | Qué es |
|---|---|---|
| `CO0–CO40` | 41 | **Ficha de contacto** (1 hoja por contacto): nombre, empresa, dirección, ciudad, país, teléfono/celular, email, web, motivo de contacto, ¿es cliente?, proveedor asociado, sucursal, vendedor, recomendaciones, observaciones |
| `OP0–OP50` | 51 | **Ficha de oportunidad** (1 hoja por oportunidad): fecha, título, contacto, empresa, vendedor, ingreso estimado, etapa, % éxito (lookup automático), observaciones + **hasta 10 acciones comerciales** (tipo, fecha, estado, descripción) |
| `PC0–PC50` | 51 | **Cotizador / presupuesto** (1 hoja por presupuesto): cliente, proveedor, vendedor, moneda, transporte, validez, tiempo de entrega compuesto + **motor de costeo de importación completo** (ver §2) |
| Maestras | 6 | `Contactos`, `Oportunidades`, `Presupuestos`, `Conproc` (contactos en proceso) = índices que agregan las fichas con `INDIRECT()`; `Inicio` = menú; `Productos` (catálogo con código, descripción, UM, precio, impuesto) |
| Catálogos | 12 | `EtapaOport` (15 etapas con % éxito), `EtapaPres` (5), `Acciones` (9 tipos), `EstAcc` (11 estados), `Vend` (21 vendedores), `Proveed` (~49 proveedores internacionales con código), `Mon` (Bs/$us/€), `Sucursal` (Central/SCZ/CBBA/LPZ), `UM` (PZA/KG/MT/KIT/CJA), `FP` (4 formas de pago), `PP` (13 plazos de pago), `Tip` (SI/NO/TODAVIA) |

Escala real del negocio: 21 vendedores, 4 sucursales, ~49 proveedores de 10+ países
(Brasil, Alemania, China, España, Turquía, Argentina, Colombia, USA…), cotizaciones
de 6 dígitos en Bs (ejemplo vivo: equipos Siemens ≈ Bs 336.000 a un cliente industrial).

## 2. Las joyas — lo que un CRM genérico NO tiene y este sí

Esto es lo que Salesforce/HubSpot/Pipedrive NO le resuelven a una empresa boliviana,
y por lo que este señor mantiene un Excel:

1. **Doble tipo de cambio institucionalizado.** Cada cotización carga `T/C OFICIAL 6,96`,
   `T/C BLUE 9,8` y `COM. BANK 4%`, y calcula un **"GASTO FINANCIERO (TC – PARALELO)"**
   como línea de costo explícita. La devaluación vive DENTRO del cotizador. Ningún CRM
   global modela esto; en Bolivia post-flotación es LA diferencia entre ganar y perder plata.
2. **Costeo de importación (landed cost) dentro de la cotización.** Cadena completa:
   FOB unitario → FOB total → gastos de internación (prorrateados por peso del ítem en el
   total) → CIF → precio de venta con **márgenes escalonados 5/10/12/15/20%** → precio
   final en $us y Bs (con el famoso factor `×100/84` que embebe IVA+IT bolivianos: cotizar
   "adentro del impuesto"). El vendedor VE en una fila qué margen puede ofrecer.
3. **Tiempo de entrega compuesto**: entrega en fábrica + trámites en fábrica + transporte +
   trámites en Bolivia = "70 DÍAS DESPUÉS DE CONFIRMAR EL PEDIDO" generado automático.
   La aduana boliviana es parte del producto.
4. **Plazos de pago a la boliviana**: no solo "30/60/90 días" — `20% ANTICIPO 80%
   CONTRAENTREGA`, `50% CONTRAENTREGA 50% A 45 DÍAS`, cheque a fecha… El catálogo `PP`
   es un censo del crédito comercial real del país.
5. **Pipeline con causa de pérdida separada**: no un solo "perdido" — `Perdida por Precio`,
   `Perdida por Tiempo Entrega`, `Perdida por Forma de Pago`, `Rechazada sin Argumentos`,
   `Sin Respuesta del Cliente`, `Postergada con posibilidad futura`. Eso es inteligencia
   comercial: te dice QUÉ arreglar (precio vs logística vs crédito).
6. **% de éxito por etapa** (EtapaOport: En Evaluación 60%, En Proceso de Compra 50%,
   Presupuestaria 20%, Contacto 15%…) → ingreso ponderado del pipeline. Forecast simple
   pero real.
7. **Acciones comerciales con memoria**: "Solicitud a Fábrica", "Contactar a cliente en
   7 días", "Contactar en 30 días", visita, Zoom, email recordatorio — cada una con estado
   (Nueva/Recordatorio/En proceso/Respondida/…/Cerrada-Ganada). Es el seguimiento que
   hoy depende de la disciplina del vendedor.
8. **El trío Contacto → Oportunidad → Presupuesto vinculado**, con proveedor y vendedor
   en cada nivel, y sucursal como dimensión (pipeline por sucursal).

## 3. Los dolores — dónde el Excel se rompe (nuestro pitch, literal)

1. **Capacidad fija**: 41 contactos / 51 oportunidades / 51 presupuestos. Se acabaron los
   slots → aparecen `#REF!` (ya visibles en el archivo: filas OP41+, CO41+ ROTAS hoy).
2. **Un archivo, 21 vendedores**: sin concurrencia, sin permisos, sin saber quién cambió qué.
   El "CRM de la gerencia" vive en el mailbox/pendrive.
3. **Las acciones no avisan**: "Contactar a cliente en 7 días" es una celda de texto. Nadie
   dispara el recordatorio. (Exactamente el hueco del agente comercial de Onia: el agente
   REPROGRAMA y ejecuta, no "recuerda".)
4. **Sin historial ni auditoría**: pisar una celda borra el pasado. Sin timeline por cliente.
5. **T/C hardcodeado**: 6,96/9,8 escritos a mano en cada hoja — hoy el oficial está ~11,4.
   Cada cotización nueva arrastra tipos de cambio viejos si nadie los edita.
6. **Todo manual**: numeración de presupuestos, clonado de hojas, índices con `INDIRECT`
   frágiles, cero conexión con facturación/SIAT, cero WhatsApp (el canal donde el cliente
   boliviano REALMENTE cotiza).
7. **Sin móvil**: los vendedores están en la calle; el Excel está en una PC.

## 4. Validación del contrato ONIA Core (esto ya estaba previsto)

El hallazgo grande: **el Excel de BE valida 1:1 el diseño que ya está congelado en
`onia-core/contract.json`** — no hay que inventar nada nuevo, hay que ejecutar lo previsto:

| Lo que el Excel hace | Lo que el core YA tiene |
|---|---|
| Fichas CO* (contactos/empresas) | Entidades `contact` + `business_partner` (con partnerTypes por track) |
| Oportunidades + etapas + acciones | `work_item` (workItemTypes del track proveegest: `cotizacion`, `pedido`, `cobro_pendiente`…) + `next_action` + `schedule_event` |
| Presupuestos PC* | Extensión vertical `quotes_b2b` — "Cotizaciones B2B", **fase 4, ya en el contrato** |
| Costeo de importación FOB→CIF→precio | Módulo `import_costing` — "landed cost / costo de importación Bolivia (DS 5646)", **ya en el contrato** |
| Descuentos / márgenes 5–20% | `approval_request` ("aprobación por monto, descuento, compra, cotización…") |
| Índices Contactos/Oportunidades/Presupuestos | `saved_view` + read-models del core |
| KPIs implícitos (pipeline, vencidas) | KPIs del track proveegest-electrico: "cotizaciones abiertas por vendedor", "cotizaciones vencidas (SLA)", "pipeline por sucursal", "clientes sin actividad 30 días" — **textual en el contrato** |
| Vendedores / sucursales | `member` + `role_assignment` + `area` |

**Lo ÚNICO que el contrato no tenía explícito** y este Excel enseña:
- El **doble T/C + gasto financiero** como campo de primera clase en la cotización
  (hoy es cultura de `import_costing`, hay que asegurar que el spec lo incluya con T/C
  del día automático — BCB oficial + paralelo de referencia).
- El **catálogo de causas de pérdida** como taxonomía estándar del pipeline (barato, oro
  para reportes).
- El **tiempo de entrega compuesto** (fábrica + trámites + transporte + aduana) como
  estructura, no texto libre.

## 5. La regla de escala: un solo CRM, del kiosco a la industrial (decisión de diseño)

Pedido explícito de Sergio: que sirva al negocio pequeño que NO necesita esto y a la
empresa grande que SÍ. La respuesta NO es dos productos ni un CRM "configurable infinito":
es **el mismo modelo de datos siempre, con capas que se encienden por entitlements**
(exactamente la arquitectura C1 que ya está construida):

| Capa | Quién la ve | Qué enciende |
|---|---|---|
| **Base (todos)** | El consultorio, la tienda | Contactos + "en qué estamos con este cliente" (work_item simple: nuevo → en conversación → ganado/perdido) + siguiente acción con recordatorio. TRES conceptos, cero jerga CRM |
| **`module.crm_pipeline`** | Negocio con vendedores | Etapas configurables por rubro con % éxito, causas de pérdida, forecast ponderado, pipeline por vendedor/sucursal, SLA de cotizaciones |
| **`module.quotes_b2b`** | Distribuidores/importadores (BE) | Cotizador con catálogo de productos, márgenes escalonados, validez, PDF/WhatsApp de la cotización, aprobación de descuentos |
| **`module.import_costing`** | Importadores | FOB→CIF→landed cost, doble T/C automático del día, gasto financiero, tiempo de entrega compuesto |
| **`module.agents`** (ya construido) | Cualquiera que pague el add-on | El agente ejecuta las "acciones comerciales": reprograma, redacta el WhatsApp de seguimiento a los 7/30 días, avisa cotización por vencer — TODO en `/pending` con aprobación humana |

Principios duros:
1. **El chico nunca ve la complejidad del grande** (progressive disclosure por entitlement,
   no por "configuración" que el usuario debe entender).
2. **El grande nunca siente que es un juguete**: los defaults del track vienen del censo
   real (este Excel = el seed del track distribución/importadores: etapas, causas de
   pérdida, plazos de pago bolivianos, acciones comerciales — se precargan tal cual).
3. **Mismo dato, misma tabla**: la "oportunidad" del kiosco y la de BE son el mismo
   `work_item`; lo que cambia es cuántos campos y vistas están encendidos. Cero forks.

## 6. Qué se hace con esto (y qué NO se hace todavía)

- **NO se arranca a construir el CRM B2B ahora.** El gate sigue intacto: 2º vertical
  (comercio/distribución) recién con 3–5 clínicas dentales pagando. Este doc CAPTURA el
  conocimiento para no perderlo.
- **SÍ entra ya (barato, sirve a dental también):** al diseñar cualquier pantalla de
  clientes/seguimiento en Onia, respetar la capa Base de §5 (contacto + estado + siguiente
  acción con recordatorio). Es lo que DentalGest ya hace con pacientes; nomenclatura común.
- **SÍ se guarda como seed:** los catálogos de este Excel (15 etapas + % éxito, 9 acciones,
  11 estados, 13 plazos de pago, causas de pérdida) = valores por defecto del futuro track
  `proveegest/comercio B2B`. Ya extraídos en este doc (§1–§2).
- **BE = cliente candidato #1 del vertical distribución** cuando se abra: hay usuario real
  con dolor (los `#REF!` ya lo alcanzaron), relación viva (nos mandó su herramienta), el
  chatbot de BE ya es nuestro (rama `claude/bolivian-electric-chatbot-1e39da`), y su rubro
  es EXACTAMENTE el track `proveegest-electrico` del contrato. La secuencia natural:
  chatbot (ya) → CRM/cotizador (fase 4) → SIAT.
- **Spec pendiente (cuando se abra el carril):** incorporar al spec de `import_costing`
  el doble T/C automático + gasto financiero (§4), y al de `quotes_b2b` la taxonomía de
  causas de pérdida y el tiempo de entrega compuesto.

## 7. Datos sensibles

El archivo contiene datos reales de BE (clientes, vendedores, proveedores, precios).
El `.xlsm` NO se commitea al repo; queda en Downloads de Sergio. Este doc solo conserva
estructura y catálogos (sin nombres de personas). Tratar el archivo como confidencial
de BE.
