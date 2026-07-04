# ONIA Catalogo Comercial 2026 — EL MAPA UNICO DE VENTA

Fecha: 2026-07-04.
Estado: documento maestro de empaquetado. Si hay conflicto con otros docs,
ESTE manda para lo comercial (respaldos: PLAN_VENTAS_90D, VERTICAL_FACTORY,
FISCAL_CONTABILIDAD, registry de precios).
Owner: ONIA / Sergio.

## 0. La regla que ordena todo

```text
ONIA Core NO SE VENDE. Es el motor.
El cliente compra EL SISTEMA DE SU RUBRO (nunca "un CRM" ni "un ERP").
Cada producto tiene LOS MISMOS 4 PLANES.
Los add-ons son UN SOLO catalogo transversal.
Enterprise = el modelo Bolivian Electric, formalizado para todos.
```

"Como vendemos los CRMs": NO existe el producto "CRM" en el catalogo. El CRM
es una capacidad que vive dentro de cada vertical. BE no compro "un CRM":
compro gestion de vendedores + WhatsApp + cotizaciones. Esa es la formula.

## 1. El portfolio (que proyectos hacemos y vendemos)

| # | Producto | Rubro | Estado | Se vende hoy? |
|---|---|---|---|---|
| 1 | **DentalGest** | Clinicas dentales | Core 9/9 + wizard + intake + Contador Pack | ✅ SI (prioridad 1) |
| 2 | **ProveeGest** | Importadoras/distribuidoras B2B | Validacion con Bolivian Electric | ✅ SI via proyecto enterprise (BE) |
| 3 | **GestiOS** | Pymes de servicios/comercio | Produccion (411 tests) | ✅ SI (prioridad 3) |
| 4 | Ganadero OS | Agro | 🔴 pausado (decision pendiente) | ❌ No hasta decidir |
| 5 | Web ONIA / Webs | Todos | Produccion | ✅ SI — puerta de entrada, no SaaS |
| — | ONIA Core | (motor interno) | v0.5.0 congelado | ❌ NUNCA se vende solo |

Rubros futuros (farmacias, ferreterias, estetica...) = packs sobre estos 3
motores segun vertical factory. NO se abren sin 1 cliente pagando.

## 2. Los 4 planes (MISMO esqueleto en todos los productos)

La columna vertebral (10 piezas del core) se reparte asi:

| Plan | Promesa | Que incluye (capabilities del core) | Precio referencia |
|---|---|---|---|
| **1. Ordenado** | "Sabes que pasa en tu negocio" | Panel del dueno + pendientes con responsable + agenda + 1 sucursal + N usuarios base | Dental 320 / GestiOS 350 (vigentes) |
| **2. Profesional** | "Ningun cliente se te escapa" | Todo lo anterior + canales registrados (correos/tel/WhatsApp boton) + intake automatico + roles finos + comentarios/documentos | Dental 750 / GestiOS 530-800 (vigentes) |
| **3. Empresa** | "Controlas sin estar encima" | Todo + aprobaciones (descuentos/anulaciones) + multi-area + SLA + vistas por rol + Contador Pack basico incluido | Dental 1500 / GestiOS 1250 (vigentes) |
| **4. ONIA EMPRESARIAL** (enterprise) | "Vemos ABSOLUTAMENTE TODO por vos" | Ver seccion 3 | Setup 3.500-9.000 + 1.500-3.500/mes (PROPUESTA, ajustar por alcance) |

Regla de venta: se entra por el dolor del rubro, se DEMUESTRA con la org
demo, se cierra en plan 1 o 2, y se sube con add-ons. El plan 3 se vende al
dueno con sucursales o equipo grande. El 4 se vende por consultoria.

## 3. ONIA EMPRESARIAL — el plan robusto "viendo absolutamente todo"

Es el modelo Bolivian Electric convertido en producto estandar. Para
empresas con sistemas propios, sucursales y gerencia exigente:

**Incluye TODO lo de Empresa, mas:**

1. **Infraestructura dedicada**: su VPS gestionado (Modelo B) o instalacion
   on-premise en su servidor (Modelo C, stack Docker ya probado con
   backup/restore verificado 24/24).
2. **Puentes a sus sistemas**: integracion con su ERP/base existente via
   planillas o tunel de solo-lectura (patron TR4/SQL Server ya disenado);
   nada de su sistema se toca.
3. **Automatizaciones a medida en n8n**: tipo de cambio + reprecios con
   aprobacion del dueno (importadoras), radar normativo aplicado a SU rubro,
   correos multi-sucursal -> pendientes ruteados.
4. **Hermes ejecutivo**: la gerencia consulta y ordena por Telegram
   (/pendientes, /crm, /tarea "...") — el "ver absolutamente todo" en el
   bolsillo del dueno.
5. **SLA de vendedores con escalamiento**: vendedor no responde -> gerencia
   avisada automaticamente (ya construido para BE).
6. **Gestion mensual ONIA**: nosotros operamos, monitoreamos y actualizamos
   (el margen recurrente vive aca).
7. Onboarding dedicado: cuestionario guiado + ImportBatch + capacitacion
   por rol.

Precio: por alcance, con piso setup Bs 3.500 + Bs 1.500/mes (PROPUESTA —
BE es la referencia real; documentar su ticket cuando cierre fase 1).

## 4. Add-ons (UN catalogo transversal, mismo en todos los productos)

| Add-on | Que hace | Precio | Estado |
|---|---|---|---|
| **Contador Pack** | Export RCV mensual + vencimientos por NIT como pendientes + alertas normativas | **Bs 90-150/mes (PROPUESTA — decidir Sergio)**; incluido en plan Empresa+ | ✅ Construido |
| Chatbot WhatsApp IA | Responde, califica, deriva (el boton simple es gratis en todos) | 690 setup + mensual segun registry | ✅ Patron BE |
| **Facturacion SIAT** | Emitir factura en linea legal desde el sistema | A definir post-certificacion — EL add-on del Q3 (deadline 30-sep) | 🔨 Requiere certificacion proveedor |
| Reprecios / Landed cost | Tasa efectiva diaria + recalculo con aprobacion + aranceles NANDINA | Parte de ProveeGest plan 2+; add-on en otros | 🔨 Disenado, motor FX vivo |
| Web + Cuidado Web | Landing/web del negocio + mantenimiento | 790-2.900 + care 190-690/mes (vigentes) | ✅ Web factory |
| Usuarios extra / sucursal extra | Crecimiento | segun registry | ✅ |

## 5. Como se vende (el proceso, simple)

```text
1. ENTRADA por dolor del rubro (prospeccion skill / contador aliado / web)
   "Los mensajes se te pierden entre correos?" / "El dolar te come el margen?"
2. DEMO con org demo del rubro (10 min, datos realistas)
3. CIERRE en plan 1 o 2 + implementacion unica (wizard 7 preguntas)
4. MES 2-3: subir con add-ons (Contador Pack, WhatsApp)
5. EMPRESAS GRANDES: saltan directo a ONIA Empresarial via consultoria
   (auditoria express pagada -> propuesta con generador oficial)
```

Canales: prospeccion directa por rubro + CONTADORES aliados (35% primera
mensualidad + Contador Pack gratis) + webs como puerta + referidos BE.

## 6. Orden de ejecucion comercial (que hacemos primero)

1. **DentalGest**: unico con todo listo — venta directa YA (cuota plan 90d).
2. **BE fase 1**: cerrarlo y documentar ticket -> nace "ONIA Empresarial"
   con caso real y precio ancla.
3. **GestiOS**: venta a pymes con el gancho del contador.
4. **SIAT certificacion** (Q3): al lograrla, TODO el catalogo gana el
   add-on mas vendible del pais antes del deadline 30-sep.
5. Rubros nuevos: solo con cliente fundador pagando (regla factory).

## Decisiones abiertas (Sergio)

- [ ] Precio de lista Contador Pack (propuesta: Bs 90-150/mes).
- [ ] Piso y estructura de ONIA Empresarial (validar con ticket real de BE).
- [ ] Ganadero OS: pausar formalmente o sprint de recuperacion.
