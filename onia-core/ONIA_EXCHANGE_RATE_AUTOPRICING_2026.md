# ONIA Exchange Rate Autopricing 2026

Fecha: 2026-07-03.
Estado: diseno de modulo (NO core) para importadoras/distribuidoras.
Primer cliente objetivo: Bolivian Electric (ProveeGest).
Owner: ONIA / Hermes.

## El problema real (investigado 2026-07-03)

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

## Respuesta: se necesita Linux para conectarse a bases de datos?

**No hace falta Linux en tu escritorio.** Como funciona de verdad:

1. Las bases de datos (Postgres/Supabase, MySQL) se conectan **por red**
   (host, puerto, usuario, password, SSL) — desde Windows, Mac o Linux por
   igual. Hoy ya lo hacemos: Prisma desde Windows a Supabase, MCP a prod.
2. **Tu VPS YA es Linux** (Ubuntu): ahi corren n8n, Chatwoot, Supabase
   selfhosted, ONIA Center. Cuando algo debe correr 24/7 o "cerca" de los
   datos, va al VPS — eso ya lo tenes resuelto.
3. Para bases de datos **dentro de la red de una empresa** (ej. un ERP local
   viejo de un cliente), no se expone el puerto a internet: se instala un
   tunel (Tailscale o tunel SSH) en una maquina de la empresa, y n8n/el VPS
   consulta por ese tunel. Mismo patron que ya usamos con SSH al VPS.
4. Cuando el cliente no da acceso directo (comun), la via es **intake
   normalizado**: exportes CSV/Excel programados o su API -> n8n -> nuestro
   endpoint. Exactamente el patron `external_gate` del contrato (asi entra
   TR4 de Bolivian Electric).

Regla practica ONIA: **desarrollas en Windows, ejecutas en el VPS Linux, y a
las empresas se entra por tunel o por intake — nunca exponiendo su base.**

## Fuentes

- https://www.bcb.gob.bo/ (oficial + VRD)
- https://dolarparalelobolivia.net/ y https://dolarboliviahoy.com/ (paralelo)
- https://bolivianblue.net/ (tracker Binance)
- Binance P2P API publica: p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search
