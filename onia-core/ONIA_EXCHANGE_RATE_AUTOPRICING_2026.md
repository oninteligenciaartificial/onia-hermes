# Onia Exchange Rate Autopricing 2026

Fecha: 2026-07-03.
Estado: diseno de modulo (NO core) para importadoras/distribuidoras.
Primer cliente objetivo: Bolivian Electric (ProveeGest).
Owner: Onia / Hermes.

## ACTUALIZACION CRITICA (investigada 2026-07-03)

**Resolucion Ministerial 245/2026 (26-jun-2026): Bolivia ABANDONO el tipo de
cambio fijo** tras ~15 anos. Desde el 29-jun el oficial FLOTA a diario:
9.73 (29-jun) -> 9.80 (hoy) -> 9.83 (anunciado lunes 06-jul). Esto es
exactamente lo que reporta el dueno de BE. Consecuencias:

- La tabla de abajo queda historica: el "oficial fijo 6.96" murio el 26-jun.
- La fuente canonica ahora es **el tipo de cambio oficial diario del BCB**
  (ya no hace falta distinguir VRD vs oficial: convergieron en el regimen
  flotante). El scraper del workflow apunta al valor diario del BCB.
- La formula NO cambia: `tasa_efectiva = oficial_diario_BCB + spread_bancario
  (~0.10)`. Binance sigue siendo solo referencia.
- Implicacion comercial enorme: TODAS las importadoras de Bolivia ahora
  necesitan repreciar seguido — el modulo de autopricing pasa de "nice to
  have" a dolor urgente y vendible del rubro completo.

## El problema real (contexto historico, investigado 2026-07-03)

Bolivia opera con TRES tipos de cambio simultaneos:

| Tasa | Valor hoy | Cambia | Fuente |
|---|---|---|---|
| Oficial BCB | 6.86 compra / 6.96 venta | NO (fija desde nov-2011) | bcb.gob.bo |
| **VRD** (Valor Referencial del Dolar) | variable diario | SI, diario desde dic-2025 | BCB (promedio ponderado del mercado bancario mayorista real) |
| Paralelo / Binance USDT | ~9.90-9.98 | SI, cada minuto | Binance P2P y trackers |

Brecha oficial vs paralelo: ~42%. Los bancos restringen venta de dolares
(30-125 USD/mes), asi que **los importadores compran dolares al paralelo o via
USDT**: su costo real sigue al paralelo/VRD, no al oficial.

Trampa evitada: "conectarse a la web del Banco Central" por el oficial daria
un numero que NUNCA cambia. Lo que sirve es el **VRD** (legal, publicado por
el BCB) y/o **Binance P2P** (mercado real). La factura fiscal (SIAT) sigue al
oficial; el costo de reposicion sigue al paralelo. Por eso el modulo maneja
las tres.

### Realidad operativa Bolivian Electric (dato del dueno, 2026-07-03)

- El VRD del BCB hoy: **9.80**; anunciado 9.83 desde el lunes — cambia a
  diario y ES la referencia que la empresa mira.
- **Los bancos agregan ~0.10 Bs** sobre el VRD al vender dolares reales:
  tasa efectiva = VRD + spread (9.83 -> 9.93).
- **Los bancos NO aceptan fondos provenientes de Binance/USDT** ("dolares de
  otro lado"): para una importadora que paga por banca formal, Binance NO es
  canal de compra, solo termometro del mercado.

**Decision de diseno (aprobada por Sergio):**

```text
tasa_efectiva = VRD_BCB_diario + spread_bancario (config por org, default 0.10)
Binance P2P   = solo linea de referencia en la alerta (no mueve precios)
Repricing     = SIEMPRE con ApprovalRequest del dueno (nunca auto por defecto)
```

## Diseno del modulo (fuera del core, patron vertical factory)

```text
n8n diario 07:30 (VPS ONIA)
  -> fetch Binance P2P (API publica, mediana de ofertas USDT/BOB SELL)
  -> fetch BCB VRD (scrape con fallback "no disponible")
  -> calcula variacion vs dia anterior
  -> ALERTA Telegram a Sergio (v1, ya activo como patron)
  -> (v2, con catalogo en ProveeGest) POST /api/onia-core/intake o endpoint
     de repricing del producto
```

### v2 con el catalogo real de BE: puente TR4 (ACTUALIZADO 2026-07-04)

El catalogo vive en el ERP local **TR4** (PowerBuilder + SQL Server).
**Decision del cliente: NO dan acceso SQL** (el proveedor de TR4 no lo
permite por exposicion de codigo fuente). **SI permiten extraer planillas
Excel u otros formatos.** El puente definitivo:

1. TR4 exporta planilla (catalogo: codigo, descripcion, costo, precio) —
   manual o programada; llega por correo o carpeta compartida.
2. n8n la lee (Spreadsheet File node), normaliza y calcula la lista sugerida
   (landed cost + tasa_efectiva x margen). Ver
   `ONIA_IMPORT_LANDED_COST_MODULE_2026.md`.
3. `ApprovalRequest` con resumen para el dueno.
4. Aprobado: n8n genera el Excel de lista nueva para cargar en TR4 (mismo
   formato que su equipo ya usa).

Cero riesgo para el cliente, cero dependencia del proveedor TR4. Pendiente
con Saul: columnas exactas del export y frecuencia.

### Politica de repricing (v2, cuando el catalogo viva en ProveeGest)

1. Cada producto guarda `costUsd` (costo de reposicion en USD) y
   `pricingRule` (margen % sobre costo, tasa de referencia elegida).
2. Al cambiar la tasa mas de un umbral configurable (ej. 1%), el sistema
   recalcula precios sugeridos.
3. **Gate de aprobacion**: los cambios NO se aplican solos por defecto —
   generan un `ApprovalRequest` (ya existe en el core) con el resumen
   ("tasa subio 2.3%, 148 productos suben en promedio 2.1%"). El dueno
   aprueba con un click y ahi se aplican, todo auditado.
4. Modo `auto_apply` opcional por organizacion para quien lo prefiera
   (con ActivityEvent de cada cambio).
5. Doble lista de precios opcional: "precio oficial/factura" vs "precio
   reposicion" — decision comercial por cliente.

### Encaje en el contrato

- Este modulo es `layer: module` (como catalog_inventory) — NO entra al core.
- Lo que SI usa del core: `ApprovalRequest` (gate), `ActivityEvent`
  (auditoria), `Notification`/Telegram (alerta), `WorkItem` si se prefiere
  cola en vez de auto.
- Cuando ProveeGest se separe, el modulo entra a su adapter como
  `exchange_autopricing`.

## Que hacer con los bancos (opciones para BE, validar con su banco/contador)

El cuadro: bancos venden dolares a oficial+spread (~0.10) para operaciones
documentadas, limitan montos, y **rechazan fondos provenientes de Binance**
(cripto es legal en Bolivia, pero los bancos no aceptan ese origen en sus
canales). Opciones reales:

1. **Operativa de precios (lo que Onia automatiza ya):** tasa efectiva
   diaria + repricing con aprobacion + **cotizaciones con vencimiento corto
   (24-48h)** usando el SLA de WorkItem — en regimen flotante, una cotizacion
   sin fecha de validez es perdida asegurada.
2. **Pago directo a proveedores en USDT:** legal desde la legalizacion
   cripto; NO pasa por el banco local (billetera -> proveedor). Comun con
   proveedores chinos. El rechazo bancario aplica al convertir via banco,
   no al pago directo. Requiere que el proveedor acepte y contabilidad
   ordenada.
3. **Instrumentos bancarios para importacion:** transferencias SWIFT
   documentadas, cartas de credito y avales internacionales (tarifarios
   publicos, ej. BNB) — acceso a divisas al oficial para importacion
   registrada, con tramite y cola.
4. **Multi-banco:** los cupos mensuales son por banco; operar con 2-3
   bancos multiplica el cupo formal.
5. **Cobertura natural:** stock como refugio de valor + lista dual
   (precio factura al oficial / precio reposicion a efectiva) — decision
   comercial del dueno.

## Respuesta: se necesita Linux para conectarse a bases de datos?

**No hace falta Linux en tu escritorio.** Como funciona de verdad:

1. Las bases de datos (Postgres/Supabase, MySQL) se conectan **por red**
   (host, puerto, usuario, password, SSL) — desde Windows, Mac o Linux por
   igual. Hoy ya lo hacemos: Prisma desde Windows a Supabase, MCP a prod.
2. **Tu VPS YA es Linux** (Ubuntu): ahi corren n8n, Chatwoot, Supabase
   selfhosted, Onia Center. Cuando algo debe correr 24/7 o "cerca" de los
   datos, va al VPS — eso ya lo tenes resuelto.
3. Para bases de datos **dentro de la red de una empresa** (ej. un ERP local
   viejo de un cliente), no se expone el puerto a internet: se instala un
   tunel (Tailscale o tunel SSH) en una maquina de la empresa, y n8n/el VPS
   consulta por ese tunel. Mismo patron que ya usamos con SSH al VPS.
4. Cuando el cliente no da acceso directo (comun), la via es **intake
   normalizado**: exportes CSV/Excel programados o su API -> n8n -> nuestro
   endpoint. Exactamente el patron `external_gate` del contrato (asi entra
   TR4 de Bolivian Electric).

Regla practica Onia: **desarrollas en Windows, ejecutas en el VPS Linux, y a
las empresas se entra por tunel o por intake — nunca exponiendo su base.**

## Fuentes

- https://www.bcb.gob.bo/ (oficial + VRD)
- https://dolarparalelobolivia.net/ y https://dolarboliviahoy.com/ (paralelo)
- https://bolivianblue.net/ (tracker Binance)
- Binance P2P API publica: p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search
