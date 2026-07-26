# ONIA Imports Module 2026 — Costo de Importacion / Landed Cost (Bolivia)

Fecha: 2026-07-21.
Estado: modulo `imports` v0.1.0 (draft), activable SOBRE ONIA Core. NO core.
`installInProductRepos = false`.
Primer consumidor objetivo: ProveeGest / Bolivian Electric (rubro importacion/distribucion).
Superficies: `modules/imports.json` + `imports.schema.sql` + `imports.logic.mjs` + `imports.logic.test.mjs`.
Complementa (no reemplaza): `ONIA_IMPORT_LANDED_COST_MODULE_2026.md` (diseno/roadmap del
producto, 2026-07-04, puente TR4) y `ONIA_EXCHANGE_RATE_AUTOPRICING_2026.md` (tipo de cambio).

Este documento describe la IMPLEMENTACION del modulo (contrato, schema y logica pura),
las formulas con su fuente, y las incertidumbres a validar contra una DUI real de
Bolivian Electric. NADA aca es asesoria fiscal ni aduanera: todas las tasas son DEFAULT
configurables con vigencia.

## 1. Por que es un modulo y no core

El core responde: quien existe, quien es responsable, que esta pendiente, que evidencia
hay, que actividad ocurrio, que requiere gerencia. Inventario, costos, aranceles e
impuestos NO son core. Por eso el costo de importacion vive como MODULO activable
(`providesCapabilities: ["import_costing"]`, mismo patron que `accounting`/`invoicing`),
fuera del `contract.json` congelado. El contrato no se toca.

Reusa lo que ya existe en el core (no reconstruye):
- **accounting**: `buildImportJournalEntry` usa `assertBalanced` (unica dependencia
  cruzada, direccion imports -> accounting); el IVA de importacion es credito fiscal
  (cuenta 1.1.5 del plan Bolivia); el asiento usa los codigos de `accounting.seed.bolivia.json`.
- **commerce**: `import_shipment_line.variantId` enlaza a la `product_variant` del catalogo
  para escribir el costo unitario en el kardex (referencia modulo-a-modulo, opcional).
- **fx**: el TCO diario del BCB entra por `logic/fx.logic.mjs` `officialRate()` (external_gate).

`import_shipment` NO es la entidad core `import_batch` (esa es carga de DATOS con dry-run;
esta es una importacion fisica con DUI).

## 2. Entidades (namespace `onia_imports_*`)

| Entidad | Tabla | Scope | Rol |
|---|---|---|---|
| `tariff_rate` | `onia_imports_tariff_rates` | root (nacional) | Alicuota NANDINA con vigencia (gaBasePct, reductionPts, zeroRated, iceApplies) |
| `import_shipment` | `onia_imports_shipments` | tenant | DUI/embarque: fecha de validacion, modo, costos de nivel embarque (USD) |
| `import_shipment_line` | `onia_imports_shipment_lines` | tenant | Item del embarque: NANDINA, FOB, cantidad, peso; variantId al kardex |
| `landed_cost_calculation` | `onia_imports_landed_cost_calculations` | tenant | Snapshot auditable de un calculo (parametros + totales + desglose) |

`tariff_rate` es ROOT (no tenant-scoped): el arancel es nacional, mismo para todos.
El resto es tenant-scoped (organizationId obligatorio).

## 3. Formulas (con fuente)

Representacion: `gaBasePct` y `reductionPts` son FRACCION (0.10 = 10%, 0.05 = 5 puntos),
consistente con las alicuotas de IVA/IT/IUE del modulo accounting. Todo redondea a 2
decimales (`round2`), convencion de los `*.logic.mjs`.

### 3.1 Valor en aduana — `computeCustomsValue`  [DS 5646]

```
valor_aduana = FOB + carga_descarga + freightInsuranceFactor x (flete + seguro)
```

`freightInsuranceFactor` = 0.10 por default, CONFIGURABLE. Fuente: **DS 5646** (vigente
06-jul-2026), reforma del Art. 20 del **DS 25870**. Este es el valor para la BASE
IMPONIBLE (GA/IVA), deliberadamente menor que el costo real — el costo de inventario si
carga el flete/seguro COMPLETOS (ver 3.5).

### 3.2 Arancel efectivo — `resolveTariffRate` / `resolveEffectiveGaPct`

```
GA_efectivo = zeroRated ? 0 : max(0, gaBasePct - reductionPts)
```

- `reductionPts` = 0.05: reduccion de **5 puntos** del **DS 5646** (06-jul-2026 a fin 2027),
  con piso 0 (un GA de 4% no baja a -1%, baja a 0%).
- `zeroRated`: arancel cero por lista de productos (**DS 5516**) / tecnologia (**DS 5518**).
- Base: **Arancel Aduanero de Importacion 2026 (AAI-2026)**. Las alicuotas por subpartida se
  cargan como `tariff_rate` con vigencia; el modulo NO trae la tabla NANDINA completa.
- `resolveTariffRate` elige la tasa vigente a la fecha; ante varias, gana la de `validFrom`
  mas reciente (la ultima reforma).

### 3.3 Gravamen Arancelario — `computeTariff`

```
GA = valor_aduana x GA_efectivo
```

### 3.4 IVA de importacion — `computeImportVat`

```
base_IVA = valor_aduana + GA + ICE
IVA_imp  = base_IVA x tasa(vatMode)
```

- `inside_1494` = **0.1494** (IVA por dentro, efectivo, regimen historico): **VIGENTE HOY**.
- `outside_13` = **0.13** (desagregado de la **Ley 1733**): promulgada 27-may-2026 pero **AUN
  NO RIGE** (falta su DS reglamentario; al 2026-07-21 solo se reglamento la condonacion por
  **RND 102600000019**, vig. 10-jun-2026). Conmutable por config para el dia que salga el DS,
  sin tocar codigo probado. Ver `accounting.json` `ivaReformWarning`.
- El IVA de importacion es **CREDITO FISCAL recuperable**: NO capitaliza al inventario salvo
  `includeVatInCost=true` (decision por organizacion del contador).

### 3.5 Costo puesto en almacen — `computeLandedCostUsd`

Reparte los costos de nivel embarque (flete, seguro, carga/descarga, despacho, almacenaje,
transporte interno) entre las lineas por VALOR (`distributeBy='value'`, por FOB) o por PESO
(`'weight'`, por weightKg), y suma los cargos por linea (GA, ICE, verificacion):

```
share            = value ? fob_linea / fob_total : peso_linea / peso_total
<cada costo embarque>_linea = costo_embarque x share
verificacion     = verificacionPct x fob_linea            (aprox. FOB x 1%)
inventario       = fob + flete + seguro + carga_descarga + despacho + almacenaje
                   + transporte_interno + verificacion + GA + ICE
                   ( + IVA_imp solo si includeVatInCost=true )
costo_unitario   = inventario / cantidad
```

El **IVA de importacion se EXCLUYE del costo** (credito fiscal recuperable), salvo
`includeVatInCost=true`. El costo de inventario carga el flete/seguro **completos** (100%),
no el 10% de la base imponible: la reduccion del DS 5646 baja el impuesto, no el costo real.
Devuelve el desglose auditable para `landed_cost_calculation.snapshotJson`.

`computeIce` (Impuesto a los Consumos Especificos) es ad-valorem sobre el valor en aduana,
CONFIGURABLE y APAGADO por default (N/A para material electrico; se activa por subpartida).

### 3.6 Valuacion de inventario — `weightedAverageCost` (CPP) / `fifoCogs` (PEPS)  [NC 2]

- `weightedAverageCost(qty, unitCost, inQty, inLandedUnitCost)`: Costo Promedio Ponderado
  tras una entrada.
- `fifoCogs(layers, outQty)`: costo de ventas PEPS + capas restantes.
- **UEPS (LIFO) esta PROHIBIDO en Bolivia** (**Norma de Contabilidad 2**): solo PEPS o CPP.
  Por eso no existe una variante LIFO.

### 3.7 Puente a contabilidad — `buildImportJournalEntry` / `mapImportToRcvRecord`

Asiento de nacionalizacion (CUADRADO, verificado con `assertBalanced` de accounting):

```
Debe  Inventarios (1.1.4)         costo puesto en almacen (sin IVA recuperable)
Debe  Credito Fiscal IVA (1.1.5)  IVA de importacion recuperable
  Haber  CxP (2.1.1) / Bancos (1.1.2) / Anticipos (1.1.6)   como se financio
```

`settlement { bankUsd, advanceUsd, payableUsd }` reparte el haber; si falta `payableUsd` se
calcula por diferencia. Si el IVA se capitalizo (`includeVatInCost`), no hay linea de credito
fiscal y el asiento igual cuadra.

`mapImportToRcvRecord(dui)` genera un `rcv_record` de COMPRA con `authorizationCode = nro DUI`
y `date = validationDate`, para que el credito fiscal caiga en el PERIODO correcto.

### 3.8 Diferencia de cambio — `exchangeDifference`  [NC 6]

Sobre partidas MONETARIAS en USD (CxP del exterior, prestamos USD, caja/CxC USD):

```
delta_Bs   = usd x tasa_cierre - usd x tasa_origen
resultado  = liability ? -delta_Bs : delta_Bs      (>0 ganancia, <0 perdida)
```

- Pasivo (CxP/prestamo) con dolar que sube = **perdida**; activo con dolar que sube = ganancia.
- Distingue **realizada** (al pagar/cobrar) de **no realizada** (al cierre, partida abierta).
- Base: **Norma de Contabilidad 6**. El TCO del cierre entra por `officialRate()` (external_gate).

## 4. Tipo de cambio (correccion en `logic/fx.logic.mjs`)

El dolar oficial YA NO es fijo: **FLOTA** con el TCO diario del BCB (**RM 245/2026** +
**RD BCB 88/2026**; ~Bs 10.90 al 20-jul-2026). El SIAT EXIGE ese TCO diario del BCB incluso
para facturar en moneda extranjera (**RND 102600000026**). `OFFICIAL_RATE_BOB_PER_USD` (6.96)
queda SOLO como FALLBACK historico; el helper nuevo `officialRate(dailyTco, fallback)` usa el
TCO del dia (external_gate) y cae al fallback si no hay dato. Los ~Bs 10.90 son referencia
ilustrativa, NO se hardcodean.

## 5. Incertidumbres a validar con Bolivian Electric (regla no-fabricar)

1. **Alcance del 10% flete/seguro (DS 5646)** a la base del GA vs del IVA: `freightInsuranceFactor`
   es configurable (default 0.10). Validar contra una DUI real post-06-jul del despachante de BE.
2. **vatMode**: default `inside_1494` hasta que se publique el DS reglamentario de la Ley 1733.
3. **Verificacion aduanera (FOB x 1%)**: coeficiente `verificacionPct` configurable; confirmar
   el valor real con el despachante.
4. **Homologacion tecnica (IBMETRO)**: solo LED confirmado regulado; falta la lista real de
   subpartidas con homologacion obligatoria. NO se modelo `technical_catalog` ni IBMETRO como
   obligatorios; `product_homologation` (codigo/registro SIN) queda como validacion SIMPLE
   OPCIONAL a futuro. No construir catalogo tecnico especulativo sin la lista oficial.
5. **Tabla NANDINA**: el modulo NO trae las subpartidas del cliente; se cargan como `tariff_rate`
   con vigencia a partir del catalogo real de BE.

## 6. Fuentes

- **DS 5646** — valor en aduana (reforma Art. 20 del DS 25870) + reduccion GA 5 puntos, vig. 06-jul-2026.
- **DS 5516 / DS 5518** — arancel cero por lista de productos / tecnologia.
- **Arancel Aduanero de Importacion 2026 (AAI-2026)** — https://www.economiayfinanzas.gob.bo/aranceles-aduaneros
- **Ley N 1.733** 'Ley de Alivio Tributario' — promulgada 27-may-2026 (IVA desagregado, aun sin reglamentar).
- **RND 102600000019** — reglamenta la condonacion de la Ley 1733, vig. 10-jun-2026.
- **RM 245/2026** + **RD BCB 88/2026** — tipo de cambio oficial flotante / TCO diario del BCB.
- **RND 102600000026** — el SIAT exige el TCO diario del BCB para facturar en moneda extranjera.
- **Norma de Contabilidad 2 (NC 2)** — valuacion de inventarios: PEPS/CPP; UEPS prohibido.
- **Norma de Contabilidad 6 (NC 6)** — diferencia de cambio sobre partidas monetarias.
- **DS 25870** (Reglamento a la Ley General de Aduanas) — base del valor en aduana reformada por DS 5646.
