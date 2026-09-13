# Handoff — carril fiscal

> ⚡ **ACTUALIZACIÓN 2026-09-13 (sesión de control):** el **Punto de Venta 1 YA EXISTE** —
> creado por SOAP `registroPuntoVenta` (tipo 5 · CAJEROS, `transaccion:true`, verificado con
> `consultaPuntoVenta`; CUIS del PdV 1: `35B2967A`). El runner corre la matriz completa
> (`/opt/onia-siat/run-fase1-pdv1.sh`, log `/var/log/onia-siat-runner-20260912.log`): IX pv0
> cerró 80/80 y la pasada 2 recorre los combos pv1. Todo párrafo de abajo que diga «el PdV 1
> lo crea Sergio» o «bloquea la mitad de la matriz» es HISTORIA. Quedan: la decisión de la
> etapa VIII (llamada de Sergio al 800 10 3444) y leer el marcador del portal al terminar.

**Repo:** `onia-hermes` · **carpeta:** `hermes-content/integrations/siat/` · **rama:** `claude/git-status-935f47`
**Copia desplegada:** `/opt/onia-siat/emisor/` en el VPS (piloto del SIN, `codigoAmbiente=2`)
**Última sesión:** 2026-09-03 (noche, La Paz)

> Fuente de verdad del trámite: `hermes-content/docs/ONIA_SIAT_ESTADO_HOMOLOGACION.md`.
> Este archivo es el estado del carril al cerrar; se EDITA, no se duplica.

---

## 1. Objetivo

Avanzar la Fase 1 del trámite SIAT (solicitud 9473) en lo que NO depende de Sergio ni del
SIN: (1) que el sector 17 (hospitales/clínicas) emita contra el piloto, (2) mapear las
operaciones del servicio de documento de ajuste para que el sector 24 (nota de
crédito-débito) emita, anule y revierta. Hecho = `codigoEstado 908` del SIN para ambos
combos, o el rechazo textual exacto.

**Cumplido, con evidencia del SIN, no del checkpoint:**

| Combo | Etapa IV (emisión) | Etapa VII (anulación) | Etapa XI (reversión) |
|---|---|---|---|
| `pv0-ds17-tf1` | `recepcionFactura` → **908 VALIDADA** (nº 786053470, recepción `ac2f9f81-…`) | `anulacionFactura` → **905** | `reversionAnulacionFactura` → **907** |
| `pv0-ds24-tf3` | `recepcionDocumentoAjuste` → **908 VALIDADA** (nº 786053476, recepción `d0c310fa-…`) | `anulacionDocumentoAjuste` → **905** | `reversionAnulacionDocumentoAjuste` → **907** |

Log: `/opt/onia-siat/fase1-log.ndjson`, entradas del 2026-09-04T02:38Z al 02:46Z.

## 2. Qué quedó en producción (= corriendo contra el piloto)

- **La copia del VPS es idéntica al repo** (md5 verificado de `src/*.mjs`) y pasa
  **368/368 tests** ahí (Node 20) y acá (Node 24).
- **Corrida de volumen lanzada** a las 02:47Z (22:47 La Paz) con
  `/opt/onia-siat/run-fase1-volumen.sh` (nuevo, fuera del repo): etapas IV → VII → XI con los
  targets del SIN (125 por combo). `pv0-ds1` ya está en 125 y se salta; `pv1-*` sigue
  bloqueado por falta de PdV y se salta solo. Estimado: sector 17 en minutos; sector 24 en
  ~1,5 h, porque **el servicio de ajuste tarda 36-43 s por respuesta** (ver §5).
  - Ver si sigue viva: `pgrep -af fase1-runner`.
  - Avance: `tail -5 /opt/onia-siat/fase1-volumen.log` (al terminar cada etapa imprime
    `summary()` con `porCaso`); o
    `grep -c '"op":"recepcionDocumentoAjuste".*"codigoEstado":908' /opt/onia-siat/fase1-log.ndjson`.
  - Si se cortó: relanzar el mismo script; el estado es checkpoint y retoma.
- Backups previos a tocar nada: `fase1-state.backup-20260904-0237.json` y
  `emisor.backup-20260904-0237/` en `/opt/onia-siat/`.

**Avance medido en el checkpoint** (`summary().general`, cuenta contra el total del SIN sin
la etapa VIII): **1.424 → 1.430** tras el gate (+6: IV/VII/XI × 2 combos), y subiendo con la
corrida de volumen. Si completa, suma **hasta 777 casos** (250 por etapa IV/VII/XI en los dos
combos nuevos + 27 reversiones que faltaban en `pv0-ds1`): **de 24,8 % a ~38 % de la Fase 1**.
**El porcentaje del portal `fman` NO se midió** (requiere login de Sergio); el 24,8 % es la
última lectura del portal (2026-08-27).

**Qué NO se tocó:** producción del SIN (nunca), puntos de venta (el PdV 1 lo crea Sergio),
`onia-platform` (sigue en mock, `SIAT_SERVICE_URL` vacía).

## 3. Qué quedó a medias, y dónde

- 🔶 **La corrida de volumen estaba en curso al cerrar.** Verificar con los comandos de §2.
  Si el SIN empieza a rechazar notas (p.ej. por tope de notas sobre una misma factura), el
  texto queda en `fase1-log.ndjson` y el caso en `blockedCases` del estado.
- 🔶 **La nota de ajuste siempre devuelve la factura ENTERA** (`montoTotalDevuelto =
  montoTotalOriginal`). Alcanza para la homologación; para un cliente real hará falta la
  devolución parcial y el prorrateo de `montoDescuentoCreditoDebito`.
- 🔶 **Onia Platform sigue sin tener un servicio HTTP que hable con este emisor** (punto 9 del
  doc de estado). Sin cambios en esta sesión.
- Lo que quedó a medias en el carril mock de `onia-platform` (2026-08-29) sigue igual:
  `InvoiceActions.tsx:changeStatus` descarta la respuesta (el fallo fiscal es invisible en la
  UI) y el detalle de la factura no muestra el CUF.

## 4. Archivos

| Archivo | Qué es |
|---|---|
| `hermes-content/integrations/siat/xsd/*.xsd` | Los 6 XSD oficiales del SIN (ver. 23/08/2021): compra-venta, hospital/clínica y nota crédito-débito, computarizada y electrónica. **Nuevos en el repo.** |
| `src/xml-builder.mjs` | `DOC_SECTOR_SCHEMAS`: raíz + campos + mínimo de detalles por sector (1, 17, 24). `buildInvoiceXml` elige el esquema por `codigoDocumentoSector`; ningún caller sabe el nombre de la raíz |
| `src/soap-client.mjs` | 3 operaciones nuevas: `recepcionDocumentoAjuste`, `anulacionDocumentoAjuste`, `reversionAnulacionDocumentoAjuste` (wrappers leídos del WSDL del piloto) |
| `src/emission.mjs` | `assembleDetalle` deja pasar los campos propios del sector (quirófano/médico) |
| `src/fase1-runner.mjs` | `OPS_FACTURA`/`OPS_AJUSTE` por sector; `buildNotaMaterial` + `originalParaNota` (la nota referencia una compra-venta del mismo PdV y la marca `ajustada`); `buildTestInvoice` con sector y campos del médico; `TIMEOUT_MS_POR_SERVICIO`; `DOC_SECTOR_SIN_SOPORTE` vacío |
| `test/xml-builder.test.mjs` | Coteja los campos, el ORDEN, los nillables, la raíz y el `minOccurs` **leyendo los XSD** — no listas tipeadas a mano |
| `test/fase1-runner.test.mjs`, `test/soap-client.test.mjs` | +23 tests (345 → 368): la nota por su servicio, la original del mismo PdV, anular/revertir con las operaciones de ajuste, sector 17 con médico |
| `/opt/onia-siat/run-fase1-volumen.sh` | (VPS, fuera del repo) la corrida de volumen IV → VII → XI |

Validación real contra los XSD con `lxml` (local, Python): los XML de los tres sectores
generados por el builder dan **VÁLIDO** contra su XSD oficial. `lxml` no está en el VPS, por
eso el test del repo lee los XSD con regex en vez de validar con un parser.

## 5. Intentos fallidos — lo que NO hay que repetir

- **El servicio de ajuste "colgaba": era el timeout, no el SIN.** Las 3 primeras
  `recepcionDocumentoAjuste` murieron en `network` a los 91 s (3 reintentos × 30 s del
  transporte). El diferencial lo aclaró: un archivo BASURA al mismo servicio tarda **42,8 s**
  en volver con `920 · EL PARAMETRO ARCHIVO ES INVALIDO`, y la nota real **36,2 s** en volver
  con 908. El servicio responde; tarda más que el default. `TIMEOUT_MS_POR_SERVICIO` lo lleva
  a 120 s solo para ese servicio. Antes de culpar al SIN por un timeout, medir con un
  request que SEGURO rechaza.
- **`siatinfo.impuestos.gob.bo` no se adivina.** Cuatro URLs "razonables" dieron 404. La ruta
  real de los formatos es
  `…/index.php/facturacion-en-linea/archivos-xml-xsd-de-facturas-electronicas/<documento>` y
  las validaciones por sector están en `…/validaciones-documentos-sector/validaciones`.
  Buscar primero, no adivinar.
- **Las 500 facturas viejas del estado no sirven de original para una nota**: no guardan
  fecha, receptor ni items. El runner emite una compra-venta nueva cuando no hay original con
  `datos` (el SIN topea ese caso en 125, no molesta). Reconstruir la fecha desde el CUF era
  frágil (el largo del código de control varía): se descartó.
- **La sonda `/tmp/probe-nota.mjs` emitió una nota real con una COPIA del estado.** Quedó en
  el SIN pero no en `fase1-state.json`; se marcó a mano la original 786053471 como `ajustada`
  para no emitirle dos notas. Una sonda que toca al SIN tiene que escribir en el estado real o
  no tocar al SIN.
- **`nohup … &` dentro de un `ssh '…'` deja el ssh colgado** si no se redirige stdin
  (`< /dev/null`). La corrida arrancó igual; el ssh quedó pegado hasta el timeout.
- Del carril mock de `onia-platform` (2026-08-29), siguen vigentes: entrar por `localhost`
  y no por `127.0.0.1` (mata la hidratación); `supabase start` explota con
  `supabase/migrations/` (Prisma primero); un script fuera del repo no resuelve `playwright`.

## 6. Qué depende de Sergio

1. 🔴 **Crear el Punto de Venta 1** bajo la sucursal 0 en SIAT. Bloquea `pv1-ds1-tf1`,
   `pv1-ds17-tf1` y `pv1-ds24-tf3` (la mitad de la matriz) y la mitad de las etapas I, II,
   III, V, VI y IX. El código ya los recorre: en cuanto exista, `--etapa I` obtiene su CUIS y
   todo lo demás sigue solo. *Listo = el log deja de decir `sin CUIS para el punto de venta 1`.*
2. **Leer el marcador del portal** (`fman.impuestos.gob.bo/facturacionv2/` → Seguimiento →
   Listado de Etapas) después de que termine la corrida de volumen, y pegar el porcentaje en el
   doc de estado. El checkpoint local no es evidencia del lado del SIN.
3. Etapa VIII (690 casos, firma digital): certificado AGETIC vs. reducir la solicitud a
   computarizada. Sin decisión no hay 100 %.

## 7. Próximos pasos

1. Confirmar que la corrida de volumen terminó (§2) y anotar `porCaso` de IV/VII/XI en
   `ONIA_SIAT_ESTADO_HOMOLOGACION.md` §4. Si algún caso quedó `blocked`, leer el texto del SIN
   antes de tocar código.
2. Cuando exista el PdV 1: `--etapa I`, luego `--etapa gate --retry-blocked`, luego
   `run-fase1-volumen.sh` otra vez (retoma).
3. Etapas II, III, V, VI y IX para el PdV 1 (hoy al 50 % por el mismo motivo).
4. Sin depender del SIN: el wrapper HTTP del emisor + deploy contra el piloto, para que el
   día de la autorización el cambio en `onia-platform` sea una variable de entorno.
