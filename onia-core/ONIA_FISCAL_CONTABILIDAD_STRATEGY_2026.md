# ONIA Fiscal y Contabilidad Bolivia — Estrategia 2026

Fecha: 2026-07-04.
Estado: estrategia canonica — responde "el sistema necesita contabilidad
super amplia?" y define la mejor salida (no la mas facil) + modelo de cobro.
Owner: ONIA / Hermes.

## 1. El momento historico (por que AHORA)

Tres shocks simultaneos obligan a TODA empresa boliviana a digitalizarse:

| Shock | Fecha | Consecuencia |
|---|---|---|
| **Facturacion EN LINEA obligatoria para todos** (grupos 9-12, los ultimos) | **30-sep-2026** (RND-102600000007 prorrogo el plazo original de abril; detectado por el Radar Normativo 04-jul) | Toda empresa necesita software autorizado SIN — la cuenta regresiva del Q3 ES el pitch |
| Tipo de cambio flotante (RM 245/2026) | 26-jun-2026 | Reprecios constantes, margen en riesgo |
| Arancel nuevo + GA -5pts (DS 5646) | 06-jul-2026 | Costos de importacion cambian |

No hay mejor momento en decadas para vender sistemas a pymes bolivianas.

## 2. Como funciona la contabilidad/impuestos en Bolivia (mapa)

### Impuestos principales (regimen general)

| Impuesto | Alicuota | Frecuencia | Nota |
|---|---|---|---|
| IVA | 13% | mensual | debito/credito fiscal; el credito viene de COMPRAS con factura -> registrar compras es oro |
| IT (transacciones) | 3% | mensual | sobre ingresos brutos; se compensa con IUE pagado |
| IUE (utilidades) | 25% | anual | requiere estados financieros; balance ante SIN |
| RC-IVA | 13% | mensual | dependientes/alquileres; retenciones |

- Vencimientos mensuales **por ultimo digito del NIT** (calendario oficial SIN).
- **Libros de compras y ventas**: hoy se registran en el **RCV del SIAT** (ya no libros fisicos).
- Bancarizacion: pagos >= Bs 50.000 deben tener respaldo bancario.
- UFV: unidad indexada para actualizaciones/multas.
- Laboral (si hay empleados): planillas Ministerio de Trabajo, Gestora
  Publica (pensiones), CNS (salud) — aportes patronales y laborales.
- Estados financieros anuales; ciertos contribuyentes (PRICOS/GRACOS)
  requieren auditoria externa. Normas: Ley 843, DS 21530, RNDs del SIN.

### El actor clave: EL CONTADOR EXTERNO

La pyme boliviana promedio NO lleva su contabilidad: la lleva un contador
externo con sus propias herramientas. El dueno quiere VENDER, COBRAR y
CUMPLIR sin multas. Quien dice "se necesita contabilidad super amplia"
describe la necesidad DEL CONTADOR, no la del dueno que nos compra.

## 3. La decision: que construye ONIA y que NO

### NO construir (trampa de la contabilidad generica)

Libro diario/mayor, plan de cuentas completo, EEFF, activos fijos con
revalorizacion, consolidaciones = 2+ anos de desarrollo, dominio del
contador (no del dueno), mercado ocupado por herramientas de contador y
Excel. Construirlo PRIMERO mataria la factory.

### SI construir (4 capas, en orden)

```text
Capa 1 — FINANZAS OPERATIVAS (ya existe por vertical)
  ventas, cobros, caja del dia, cuentas por cobrar/pagar, margen.
  Lo que el dueno mira a diario. DentalGest ya lo tiene.

Capa 2 — FACTURACION SIAT COMO PROVEEDOR (la apuesta grande)
  ONIA se certifica ante el SIN como SISTEMA PROVEEDOR de facturacion
  en linea (RND 102100000011): UNA certificacion habilita facturar a
  TODOS los clientes de TODOS los verticales. Es la mas dificil y la
  mejor: infraestructura fiscal = barrera de entrada + obligatoria por
  ley desde abril 2026 para cada empresa del pais.

Capa 3 — CONTADOR PACK (el puente, no el reemplazo)
  export mensual estandar para el contador: RCV compras/ventas, resumen
  IVA/IT, respaldos de bancarizacion + calendario tributario por digito
  de NIT (vencimiento -> WorkItem con dueno) + radar normativo (nueva
  RND -> pendiente "revisar impacto"). Convierte al contador en ALIADO
  que recomienda ONIA en vez de competidor.

Capa 4 — CONTABILIDAD PLENA (diferida, por demanda)
  solo cuando un vertical la exija con ingresos que la paguen; via
  partnership con estudio contable o contratacion de dominio. Nunca
  antes de que las capas 1-3 facturen.
```

### Encaje en el contrato (sin romper nada)

- El core sigue congelado: nada fiscal entra al core.
- Capa 2 y 3 son **modulos** (`layer: module` como catalog_inventory) +
  `external_gate siat` ya existente. Se activan por organizacion.
- Lo que SI usa del core: WorkItem (vencimientos), ApprovalRequest,
  Document (facturas/respaldos), ActivityEvent, CommunicationChannel.

## 4. Como cobrar (doctrina de pricing)

**Decision: suscripcion mensual por PLANES. Nunca pago unico. No
per-usuario puro.**

| Modelo | Veredicto | Por que |
|---|---|---|
| Pago unico (estilo TR4) | ❌ NUNCA | La normativa boliviana cambia cada mes (RNDs, prorrogas, codigos SIN). Un sistema de pago unico queda desactualizado/ilegal en meses y sin ingresos para mantenerlo. El mantenimiento fiscal permanente ES el argumento del cobro recurrente: "pagas mensual porque el pais cambia mensual". |
| Por usuario puro | ❌ | En Bolivia castiga crecer (comparten logins, resisten agregar staff). |
| **Planes mensuales con N usuarios incluidos + add-ons** | ✅ | Ya es el modelo DentalGest/GestiOS (Bs 320-1500; extraUserSeats como add-on). Se formaliza como doctrina. |

Estructura estandar por vertical:

1. **Plan base mensual** (por sucursal, N usuarios incluidos, uso razonable).
2. **Add-ons mensuales**: modulo SIAT facturacion, WhatsApp bot, landed
   cost/reprecios, usuarios extra.
3. **Implementacion unica** (setup + carga guiada + capacitacion) — ya definida.
4. **Anual con descuento** (2 meses gratis) — caja anticipada.
5. **Enterprise (modelo BE)**: setup + gestion mensual en su VPS.

## 5. Fuentes de actualizacion normativa (y su automatizacion)

| Fuente | Que da | Automatizacion |
|---|---|---|
| siatinfo.impuestos.gob.bo | modalidades, autorizacion de sistemas, homologacion | consulta manual + radar |
| impuestos.gob.bo (RNDs) | resoluciones normativas del SIN | **radar n8n semanal: nueva RND -> WorkItem "revisar impacto"** |
| impuestos.com.bo/normativa | agregador de normativa | radar |
| boliviaimpuestos.com | analisis en espanol claro | lectura |
| Gaceta Oficial | leyes y DS | radar por keywords (IVA, arancel, facturacion) |
| Colegio de Auditores (CAUB) | normas contables | consulta |

El patron radar ya esta disenado (landed-cost v3): scrape -> deteccion de
novedad -> WorkItem con dueno. Mismo motor para RNDs.

## 6. Prerequisitos reales para la Capa 2 (certificacion SIAT)

1. **ONIA formalizada**: NIT propio, actividad economica correcta
   (desarrollo de software), registro SEPREC. Sin esto no hay
   certificacion de sistema proveedor. [accion de Sergio]
2. Estudio tecnico de la RND 102100000011: requisitos del sistema
   (XML firmado, CUIS/CUFD, codigos SIN homologados, contingencias,
   pruebas funcionales y de carga ante el SIN).
3. Piloto con 1 NIT amigo (una clinica DentalGest real) en modalidad
   "computarizada en linea" antes de escalar.
4. Presupuestar 2-3 meses de ingenieria + tramite.

## 7. Roadmap (la mejor salida, secuenciada)

| Fase | Que | Cuando |
|---|---|---|
| A | Contador Pack v1 (exports RCV + calendario por NIT + radar RND) — vendible YA como add-on en DentalGest | semanas |
| B | Estudio tecnico certificacion SIAT proveedor + formalizacion ONIA | paralelo |
| C | Piloto facturacion en linea con 1 cliente real | al pasar B |
| D | Modulo SIAT como add-on en toda la factory (cada vertical factura legal) | tras piloto |
| E | Evaluar contabilidad plena SOLO si un segmento la paga | 2027+ |

## Fuentes

- https://siatinfo.impuestos.gob.bo/index.php/sistema-facturacion
- https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/autorizacion-de-sistemas/proceso-de-autorizacion
- https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/requerimientos/homologacion-de-productos-servicios
- https://impuestos.com.bo/normativa-2025/
- https://ivacalculator.com/bolivia/factura-electronica-sin/
