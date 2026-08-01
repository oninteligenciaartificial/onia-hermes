# Onia Import Landed Cost Module 2026

Fecha: 2026-07-04.
Estado: diseno de modulo (NO core) — producto clave del vertical importadoras.
Primer cliente objetivo: Bolivian Electric (ProveeGest).
Owner: Onia / Hermes.
Complementa: `ONIA_EXCHANGE_RATE_AUTOPRICING_2026.md` (tipo de cambio).

## Por que es EL producto del vertical (contexto 2026)

Dos shocks simultaneos golpean a toda importadora boliviana:

1. **Tipo de cambio flotante** (RM 245/2026, 26-jun): el dolar oficial cambia
   a diario (9.73 -> 9.83).
2. **Aranceles en movimiento**: Arancel Aduanero 2026 nuevo (RM 557,
   vigente 01-ene-2026) + **DS 5646: reduccion de 5 puntos del GA desde el
   06-jul-2026 hasta fines de 2027** + DS 5516 (arancel cero para lista de
   productos) + DS 5518 (tecnologia).

Consecuencia: el costo real de reposicion de CADA producto cambia por dos
variables a la vez. Quien calcula a mano (Excel + memoria) pierde margen o
pierde ventas. Esto es exactamente lo que un sistema debe hacer solo.

## Que se necesita para importar en Bolivia (columna del modulo)

| Pieza | Que es | Donde vive en el modulo |
|---|---|---|
| Subpartida NANDINA | Codigo arancelario del producto (10 digitos) | campo `nandinaCode` por producto |
| GA (Gravamen Arancelario) | 5%-40% segun subpartida; **-5 pts por DS 5646 desde 06-jul-2026** | tabla `tariff_rates` con vigencias |
| IVA importaciones | Se liquida al nacionalizar (efectivo ~14.94% sobre CIF+GA) | formula |
| ICE | Solo bienes especificos (ej. tractocamiones DS 5563) | opcional por subpartida |
| DIM + despachante | Declaracion de Importacion via agencia despachante | costo fijo/porcentual configurable |
| Logistica | Flete internacional, seguro, almacen aduana, transporte interno | coeficientes por embarque |

## Formula de costo puesto en almacen (landed cost)

```text
CIF        = FOB + flete internacional + seguro
GA         = CIF x ga% (segun NANDINA, con vigencia DS 5646)
Base IVA   = CIF + GA (+ ICE si aplica)
IVA imp    = Base IVA x ~14.94% (efectivo)
Costo USD  = CIF + GA + IVA imp + despachante + almacen + transporte interno
Costo Bs   = Costo USD x tasa_efectiva   <- modulo tipo de cambio (oficial diario + spread)
Precio     = Costo Bs x (1 + margen del producto)
```

Nota fiscal: el IVA de importacion es credito fiscal para la empresa — el
modulo lo muestra separado para que contabilidad decida como tratarlo en el
precio (config por organizacion: incluirlo o no en el costo base).

## Modelo de datos (modulo ProveeGest, fuera del core)

- `product`: nandinaCode, fobUsd, margenPct, gaOverridePct?, iceApplies
- `tariff_rate`: nandinaCode, gaPct, validFrom, validTo, source (RM 557 /
  DS 5646 / DS 5516) — permite recalcular ANTES y DESPUES del 06-jul
- `shipment_profile`: coeficientes de flete/seguro/despachante tipicos
- Piezas core que usa: `ApprovalRequest` (gate de reprecio), `ActivityEvent`
  (auditoria), `Document` (DIM/facturas del embarque), `WorkItem`
  (seguimiento de tramites de importacion como pendientes con dueno)

## Puente TR4 — CORREGIDO (decision del cliente 2026-07-04)

**No hay acceso SQL a TR4** (el proveedor del sistema no lo permite por
exposicion de codigo fuente). **SI permiten extraer planillas Excel u otros
formatos.** El puente queda:

```text
TR4 -> export Excel/CSV (catalogo con codigos, costos, precios actuales)
  -> llega por correo o carpeta compartida (Drive/OneDrive)
  -> n8n: trigger + Spreadsheet File node -> parse y normaliza
  -> calculo landed cost + tasa efectiva del dia
  -> ApprovalRequest al dueno ("GA bajo 5pts + dolar 9.83: 148 precios cambian")
  -> aprobado -> genera Excel de lista nueva para cargar en TR4
```

Ventajas: cero riesgo para el cliente, cero dependencia del proveedor TR4,
y el formato de entrada/salida es el que su equipo ya usa. Definir con Saul:
columnas exactas del export y frecuencia (semanal o ante cambio de tasa).

## Roadmap del modulo

1. **v0 (ya activable):** alerta diaria de tasa (workflow listo) + alerta
   del cambio de GA del 06-jul (one-shot manual).
2. **v1:** planilla TR4 -> calculadora landed cost en n8n -> Excel repreciado
   con resumen para aprobar (sin sistema nuevo: entra por correo).
3. **v2 (ProveeGest):** catalogo vivo con NANDINA + vigencias arancelarias,
   ApprovalRequest en el panel, historial de margen por producto.
4. **v3:** radar normativo (nuevos DS que toquen subpartidas del cliente ->
   WorkItem automatico "revisar impacto DS XXXX").

## Fuentes

- https://boliviaimpuestos.com/arancel-cero-decreto-supremo-5516/
- https://unitel.bo/noticias/economia/gobierno-aprueba-reduccion-de-aranceles-de-importacion-para-mitigar-los-efectos-del-nuevo-tipo-de-cambio-flexible-del-dolar-AN21793737
- https://www.economiayfinanzas.gob.bo/aranceles-aduaneros (AAI-2026 digital)
- https://www.aduana.gob.bo/todo-lo-que-debe-saber-sobre-el-nuevo-decreto-5518
- https://lapatria.bo/dinero-negocios/economia/reduccion-gravamen-arancelario-bolivia/
