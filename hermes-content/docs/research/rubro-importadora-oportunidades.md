# Rubro importadora / distribuidora — qué falta, qué se adopta, qué diferencia

**Mercado:** Bolivia. Negocio chico que trae contenedores de China/Brasil/Chile y vende al por
mayor. **Fecha de la investigación:** 2026-08-23.

**Lo que hay hoy en producción** (verificado leyendo `onia-platform`):
`app/(dashboard)/importadora/` = **cotizaciones** + **costeo**. La lógica de costeo
(`lib/importadora/costeo.ts`) ya está bien: prorratea flete/seguro/despacho/almacenaje entre las
líneas por valor, peso o volumen; aplica el GA por línea; **deja el IVA de importación fuera del
costo porque es crédito fiscal**; guarda snapshot auditable por variante; y exige el TCO del BCB
como input en vez de inventarlo. Reusa catálogo y caja de comercio. **No hay** proveedor, orden de
compra, embarque, ni lote.

---

## A) Qué le falta de verdad — ordenado por cuánto duele

| # | Falta | El problema, en una frase | Costo |
|---|---|---|---|
| 1 | **Reprecio por tipo de cambio** | Pagó el contenedor a USD 6,96 hace 4 meses, sigue vendiendo en Bs con el margen de entonces y hoy reponer cuesta 11,50: vende con ganancia contable y pierde inventario. | Chico |
| 2 | **Entidad Embarque** (contenedor) | El costeo hoy es un formulario suelto: no existe "el contenedor que viene"; nadie sabe qué plata está flotando ni qué llega cuándo. | Medio |
| 3 | **Proveedor + Orden de compra** | El proveedor chino vive en un chat de WhatsApp y un Excel; no hay historial de qué se le compró, a qué precio ni cuánto se le adelantó. | Medio |
| 4 | **Anticipos y saldo en USD al proveedor** | El 30% se paga al confirmar y el 70% contra BL: son dos pagos en dólares, meses aparte, a dos tipos de cambio distintos, y no se registran en ninguna parte. | Chico |
| 5 | **Lista de precios B2B por cliente** | Al mayorista grande se le da otro precio que al chico, y hoy eso vive en la cabeza del dueño; cada cotización se rearma a mano. | Chico |
| 6 | **Lote / partida de ingreso** | Dos contenedores del mismo producto entraron a costo distinto; sin lote, el margen por venta es una mentira promedio. | Medio |
| 7 | **Cuenta corriente del cliente mayorista** | Vende a 30 días, cobra por QR y transferencia suelta, y no hay un estado de cuenta que mandar por WhatsApp. | Medio |
| 8 | **Costo de conseguir los dólares** | Comprar divisa arriba del oficial es un costo real del embarque y hoy no entra en el costeo: el landed cost sale más barato de lo que fue. | Chico |
| 9 | **GA sugerido por partida NANDINA** | El GA se tipea a mano por línea (0/5/10/15/20% sobre CIF); un error de tipeo cambia el precio de venta de todo el contenedor. | Medio |
| 10 | **Estado del embarque + autorizaciones previas** | ATT/IBMETRO/SENASAG se tramitan **antes de embarcar**; enterarse tarde deja el contenedor parado en aduana con la plata adentro. | Medio |
| 11 | **Reserva de stock desde la cotización** | Cotiza 500 unidades a tres clientes con el mismo stock y le vende a los tres. | Chico |

Nota fiscal que ya está bien resuelta y no hay que tocar: IVA de importación como crédito fiscal
recuperable, no como costo. Es el error de costeo más caro del rubro y ONIA ya no lo comete.

---

## B) Open source y datos públicos — qué se adopta, qué se porta, qué solo se mira

Todo verificado con `gh api` / `curl` el 2026-08-23. Estrellas y último push son de esa fecha.

### Sirve y se puede usar (licencia permisiva)

| Repo / fuente | Licencia | ★ / último push | Qué sirve | Veredicto |
|---|---|---|---|---|
| [datasets/harmonized-system](https://github.com/datasets/harmonized-system) | Sin licencia en GitHub; el `datapackage.json` declara **ODC-PDDL-1.0** (dominio público) | 191 ★ / 2026-07-27 | CSV jerárquico HS 2022 (`section,hscode,description,parent,level`), niveles 2/4/6. Los **6 primeros dígitos de NANDINA son exactamente HS**. | **Adoptar** el CSV como buscador de partidas por descripción. Los dígitos 7-10 (NANDINA + nacional) hay que sumarlos aparte. |
| [inventree/InvenTree](https://github.com/inventree/InvenTree) | **MIT** | 7.440 ★ / 2026-08-23 | Modelo de datos de Company/SupplierPart/PurchaseOrder con recepción parcial, lote y **Extra Line Items** (costos extra de la orden). Django. | **Portar el modelo**, no la app. Resuelve los faltantes 3, 6 y parte del 2. |
| [medusajs/medusa](https://github.com/medusajs/medusa) | **MIT** en el core (la Enterprise Edition está aparte, `ENTERPRISE-LICENSE.md`) | 35.972 ★ / 2026-08-23 | Modelo de **Price Lists** (precio por cliente/grupo, con vigencia). | **Portar el modelo** para el faltante 5. |
| [jkeen/tracking_number_data](https://github.com/jkeen/tracking_number_data) | **MIT** | 143 ★ / 2026-08-19 | Reglas y checksums para reconocer números de guía de couriers. | **Mirar.** Sirve para muestras aéreas (DHL/FedEx), **no** para contenedores marítimos. |
| [Arancel Aduanero de Importaciones 2022](https://siip.produccion.gob.bo/noticias/files/2023-11bf4-arancel-aduanero-2022.pdf) | Documento oficial del Estado | PDF 11,2 MB — verificado HTTP 200 | GA por partida NANDINA de 10 dígitos. | **Parsear una vez** a tabla y versionarla. Es edición 2022: hay que anotar la fecha y revisar decretos posteriores (ej. DS 4539 pone GA 0% a cargadores EV). |

### Sirve para tipo de cambio (el punto 1, que es el que más duele)

| Fuente | Estado verificado en vivo | Notas |
|---|---|---|
| `https://apibcb.cucu.bo/api/v1/tc/oficial` | **Funciona.** Devolvió `{"valor":11.5,"compra":11.5,"venta":11.6,"fecha":"2026-08-23"}` con la nota de la RD BCB 88/2026. Sin API key. 120 req/hora por IP. | Es un **tercero**, no el BCB. Publica cada día hábil 20:00, rige el siguiente. Perfecto para autocompletar el campo `tcoBcb` que hoy se tipea a mano. |
| `https://bo.dolarapi.com/v1/dolares` | **Funciona.** Devolvió `oficial 11,50` y `binance 11,61/11,64`, sin API key. | Es la única fuente verificada del **paralelo**, que es el que el importador realmente paga. Licencia y términos de uso: **NO VERIFICADO**. |
| [lineofflight/frankfurter](https://github.com/lineofflight/frankfurter) (MIT, 1.794 ★, 2026-08-21) | **Descartado.** Consulté `/v1/currencies`: **no tiene BOB.** Es BCE, y el BCE no cotiza boliviano. | No perder tiempo acá. |
| [fawazahmed0/exchange-api](https://github.com/fawazahmed0/exchange-api) | CC0-1.0, 2.597 ★, 2026-08-20 | Fallback si se cae lo anterior; no es la tasa oficial boliviana. |

### No sirve por licencia — solo se mira el modelo, no se copia una línea

- [frappe/erpnext](https://github.com/frappe/erpnext) — **GPL-3.0**, 38.421 ★, vivo. Su "Landed Cost
  Voucher" es la referencia conceptual del prorrateo; ONIA ya tiene lo equivalente.
- [odoo/odoo](https://github.com/odoo/odoo) — **LGPL-3.0** (verificado en el LICENSE), 53.890 ★,
  vivo. `stock_landed_costs`. Mirar el modelo de datos, no portar código.
- [OCA/currency](https://github.com/OCA/currency) — **AGPL-3.0**, 82 ★. Descartado.

### Lo que buscamos y NO existe gratis

- **Tracking de contenedores.** Todo lo que encontré es de pago: ShipsGo, Portcast, JSONCargo,
  MarineTraffic, SafeCube. Traqo dice regalar 4 contenedores/mes — **NO VERIFICADO**. Las búsquedas
  en GitHub de "container tracking" devuelven solo proyectos de estudiante sin licencia y muertos.
  **Conclusión: no construir tracking automático.** El estado del embarque lo pone el usuario en
  dos toques, o lo pega el despachante por WhatsApp.
- **API pública del arancel boliviano.** No existe. El portal de la ANB no expone consulta
  programática (`portal.aduana.gob.bo/...nomenclatura...` ni siquiera resolvió). Solo el PDF.
- **API oficial del propio BCB en JSON.** No la publica; `cucu.bo` es un tercero que la raspa.

---

## C) Innovación que diferencia

Cada idea contra un problema real, y ninguna necesita ERP caro ni contrato con naviera.

1. **Alerta de reprecio por devaluación.** ONIA guarda el TCO con el que se costeó cada variante
   (ya está en el snapshot). Un cron compara ese TCO contra el de hoy y avisa: *"Estos 34 productos
   se costearon a 6,96. Hoy el oficial está 11,50 y el paralelo 11,64. Reponerlos cuesta 65% más:
   estás vendiendo 12 de ellos por debajo del costo de reposición."* Un botón reprecia la lista.
   Ningún competidor local hace esto y es el dolor diario del rubro.
2. **Precio en dos monedas, con la regla del dueño.** El importador piensa en dólares y factura en
   bolivianos. Que fije "margen 35% sobre costo USD" y el sistema recalcule el precio en Bs cada vez
   que se mueve el TCO — en vez de un precio en Bs congelado que se derrite solo.
3. **El costo real del dólar entra al costeo.** Campo "tipo de cambio al que conseguí la divisa"
   separado del oficial. La diferencia contra el oficial es un costo del embarque como el flete, y
   hoy nadie la contabiliza. Es la vuelta boliviana del landed cost que Zoho/Katana no tienen porque
   no lo necesitan.
4. **Simulador antes de comprar.** Katana y Cin7 costean lo que ya llegó. Acá el momento de decidir
   es antes: pegar la proforma del proveedor, elegir la partida, y ver *precio de venta necesario y
   margen a este TCO — y a 12,50*. Convierte el costeo de trámite contable en herramienta de compra.
5. **Cotización mayorista que sale por WhatsApp y reserva stock.** WhatsApp es el canal de venta;
   la cotización debe salir como link/PDF que el cliente abre en el teléfono, con precio por su
   lista, validez con fecha (porque el TC se mueve) y stock reservado al emitirla.
6. **Embarque como línea de tiempo de 6 estados, no como integración.** Pedido → pagado anticipo →
   embarcado (BL) → en puerto → DUI → en depósito. Cada estado con fecha y con la plata comprometida
   al lado. Flexport vende visibilidad con integraciones de naviera; el importador chico se conforma
   con saber cuánta plata tiene flotando y para cuándo. Eso son seis campos, no una integración.
7. **Aviso de autorización previa por partida.** Al elegir la NANDINA, si cae en telecom/alimentos/
   reglamento técnico, cartel: *"esto requiere homologación ATT antes de embarcar"*. Es la trampa que
   deja contenedores parados y no la avisa ningún software.
8. **El costeo emite la factura correcta.** El puente que ya existe: costeo → precio → venta →
   SIAT. Con facturación obligatoria desde el 1-oct-2026 y el crédito fiscal de importación ya bien
   tratado, ONIA puede cerrar el círculo entero — que es exactamente lo que ningún Excel hace.

**Referencia de mercado:** TradeGecko / QuickBooks Commerce cerró definitivamente el 31-ago-2023
(primer apagón jun-2022). El hueco de "inventario mayorista simple y barato" sigue abierto.

---

## D) Referencias visuales

Todas verificadas con HTTP 200/202 el 2026-08-23.

| URL | Qué robar |
|---|---|
| https://dribbble.com/shots/25787745-Flows-Shipment-Tracking-Dashboard | Cómo compactar "embarques en tránsito" en una sola fila legible: estado, fecha estimada y monto en la misma línea. Es la vista del punto 6. |
| https://dribbble.com/shots/24796728-Dynamic-Map-and-List-Based-Shipment-Tracking-Dashboard | El toggle mapa/lista. **Quedarse con la lista y tirar el mapa**: para un importador boliviano el mapa es decorado, la fecha de llegada es el dato. |
| https://dribbble.com/tags/logistics_dashboard | Galería para calibrar el rubro entero antes de codear. Ojo: casi todo es tracking de última milla, no importación. |
| https://www.zoho.com/inventory/ | El competidor más directo en precio. Mirar cómo presentan landed cost y multi-moneda, y cuánto formulario le meten al usuario. |
| https://katanamrp.com/ | Cómo muestran costo por lote y trazabilidad sin verse como un ERP. Referencia de tono para el punto 6 (lote). |
| https://www.cin7.com/ | Listas de precios B2B por cliente — el patrón del faltante 5. |
| https://www.flexport.com/ | El techo del rubro. Sirve para ver qué **no** copiar: todo lo que dependa de integración con naviera. |
| https://mobbin.com/ | Patrones de producto real (tablas, filtros, estados) con capturas de apps vivas. |
| https://www.saasui.design/ | Galería curada de UI de SaaS por categoría, incluido dashboards. |

`land-book.com` devolvió **403 a curl** (bloquea bots). Probablemente vive en navegador, pero no lo
puedo confirmar desde acá: **NO VERIFICADO**.

---

## Lo que no pude verificar

- Términos de uso y licencia de `bo.dolarapi.com` y de `apibcb.cucu.bo` (ambos responden, ninguno
  publica ToS que haya podido leer). Antes de depender de ellos en producción, cachear la respuesta
  del día en base propia y no llamarlos por request.
- Si el arancel 2022 sigue vigente partida por partida en 2026.
- El tier gratis de Traqo para tracking de contenedores.
