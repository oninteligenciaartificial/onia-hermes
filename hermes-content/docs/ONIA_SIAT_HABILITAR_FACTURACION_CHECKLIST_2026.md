# Onia — Cómo seguir: habilitar la facturación en línea (checklist Oficina Virtual) 2026-07-10

Objetivo: poder **emitir facturas de las ventas de Onia**. Es la acción #1 de Sergio (gratis,
online). El SEPREC NO bloquea esto (solo es la matrícula de comercio). Complementa
`ONIA_OPTIMIZACION_FISCAL_PROPIA_2026.md` y el trámite técnico de emisor propio
`onia-core/ONIA_SIAT_CERTIFICACION_PLAN_2026.md`.

## Estado (ya cumplido ✅)
- **NIT `5371375010` ACTIVO**, Régimen General, IVA vigente. Razón social **LESLIE MERCADO MORENO**
  (empresa unipersonal, Santa Cruz II).
- Actividad software confirmada y primaria: 4651200 (venta de programas), 6209920 (servicios en
  la nube), 6312000 (portales web).
- Falta solo: **habilitar una modalidad de facturación** y emitir.

## Decisión de camino (elegí uno)

| Camino | Qué es | Tiempo | Cuándo |
|---|---|---|---|
| **A. Portal Web en Línea** (recomendado YA) | Emitís facturas **manuales** desde la web del SIN. Sin sistema propio, sin certificado digital. | Inmediato | Para las primeras ventas de Onia |
| **B. Computarizada en Línea** (el producto de Onia) | Tu **propio sistema** emite (CUIS/CUFD/CUF). Es lo que el padrón registró (PENDIENTE). | Necesita el emisor listo + **90 días de pruebas** | Cuando el emisor SIAT esté para piloto |

**Recomendación de contador:** arrancá con **A (Portal Web)** para poder facturar ya; el camino B
sigue en desarrollo (dev) en paralelo y es el producto que después vendés.

## Checklist — Portal Web en Línea (camino A)

1. **Entrar a la Oficina Virtual** del SIN (impuestos.gob.bo → "SIAT en Línea") con las
   credenciales del NIT de Onia.
2. **Revisar que no haya marcas de riesgo tributario** activas (requisito Art. 19.d). Si hay
   alguna observación, resolverla primero.
3. **Solicitar autorización de la modalidad "Portal Web en Línea"** en la opción correspondiente
   del portal. El SIN valida y autoriza. ⚠️ El padrón hoy figura como *"Computarizada en Línea –
   PENDIENTE"*; confirmá en pantalla si habilitás **Portal Web** (para manual ya) o completás la
   Computarizada. Para facturar rápido, Portal Web es lo práctico.
4. **Configurar Casa Matriz / sucursal (0)** y **al menos un Punto de Venta**.
5. **Registrar productos/servicios y clientes**, y **sincronizar catálogos** (actividades,
   leyendas, unidades). Homologar tus servicios (ej. "desarrollo de software / servicios en la nube").
6. **Emitir una factura de prueba** (a un cliente real o a Onia misma) y verificar que **valida**,
   que llega el **PDF** y que el **XML** queda registrado en el SIN.

Datos a tener a mano: NIT 5371375010 · razón social LESLIE MERCADO MORENO · actividades arriba ·
correo del negocio · datos del cliente (NIT/CI + razón social).

## Qué falta EXACTAMENTE para facturar (verificado 2026-08-15)

> Regla de la casa: no se dice "no está disponible" — se dice qué falta. Esto es
> lo que falta, en dos carriles que no se bloquean entre sí.

### Carril A — facturar las ventas DE ONIA (todo de Sergio, cero dev)

| # | Paso | Dónde | Estado |
|---|---|---|---|
| 1 | Entrar a la Oficina Virtual con el NIT 5371375010 | impuestos.gob.bo | NIT **ACTIVO**, IVA vigente ✅ |
| 2 | Habilitar modalidad **Portal Web en Línea** | Oficina Virtual | ⬜ pendiente (el padrón figura "Computarizada — PENDIENTE") |
| 3 | Configurar casa matriz + 1 punto de venta | Oficina Virtual | ⬜ |
| 4 | Registrar servicios y sincronizar catálogos | Oficina Virtual | ⬜ |
| 5 | Emitir una factura de prueba y validar PDF/XML | Oficina Virtual | ⬜ |

Con esto Onia **factura sus propias ventas ya**, a mano desde el portal del SIN.
Ningún paso depende de código.

### Carril B — que EL PRODUCTO emita para los clientes (dev + trámite)

Estado real del código (verificado en `onia-platform/lib/fiscal/`):

- `emission-service.ts` — el enchufe por país existe y está probado ✅
- `siat-client.ts` — **es un MOCK deliberado**: cero llamadas de red, CUFD/CUF
  simulados y marcados `mock: true`. **La integración SOAP real no existe todavía.**
- Los WSDL reales del SIN ya están bajados y estudiados (2026-08-06):
  `FacturacionCodigos`, `FacturacionSincronizacion` y servicios asociados.

**Y lo que YA está hecho, que es mucho más de lo que el mock del producto sugiere**
(fuente: memoria `siat-emitter`, verificado el 2026-08-06 contra el SIN):

- ✅ **Sistema REGISTRADO ante el SIN** como PROVEEDOR (solicitud N° 9473, código
  `228474DC226A215DD26BF`, 2026-08-06). El reloj del Art. 18.III corre:
  **fecha límite de pruebas 04/11/2026**.
- ✅ **Fase 1 COMPLETA la misma noche: 1.968 operaciones reales contra el piloto
  del SIN, cero bloqueadas** (emisiones, anulaciones, reversiones, paramétricas).
  CUIS obtenido, CUF verificado contra el algoritmo oficial, transporte SOAP real.
- ✅ El emisor compartido (`hermes-content/integrations/siat/`, 262+ tests) tiene
  la API pública `emitInvoice`: un producto lo llama y listo.

Lo que falta de verdad, en orden:

| # | Qué | Quién | Notas |
|---|---|---|---|
| 1 | **Fase 2: inspección del SIN** (la agenda el SIN) | Sergio agenda, dev acompaña | límite duro **04/11/2026** |
| 2 | **Conectar el PRODUCTO al emisor compartido** — hoy `onia-platform/lib/fiscal/siat-client.ts` es un mock deliberado; el emisor real vive aparte y el producto no lo llama | dev | el enchufe por país (`emission-service`) ya existe |
| 3 | Fase 3: **piloto por cliente** (token delegado que genera cada cliente) | ambos | runbook ya escrito: `integrations/siat/ONBOARDING_CLIENTE.md` |
| 4 | Encender emisión real por organización y verificar la primera factura | dev | recién acá se puede prometer "emitimos" |

(La etapa VIII —firma digital— es solo de la modalidad Electrónica; la
Computarizada elegida no la necesita.)

**La fecha que mandaba ya no corre** ⚠️ *(corregido el 2026-10-03)*. Decía: «RND 102600000007 — el
último tramo del padrón queda obligado a facturar en línea el 30-sep-2026». Ese mismo 30-sep la
**RND 102600000038** abrogó las designaciones de los grupos 9° a 12° y dejó sin efecto sus plazos;
el SIN asignará periódicamente una modalidad en línea a quien no tenga ninguna, sin fecha. El
reloj que importa ahora para el carril B es otro: la **RND 102600000034** (pruebas y autorización
con el anexo de la Ley 1733, del 1-oct al 16-nov-2026) y el vencimiento del trámite 9473
(`ONIA_FACTURACION_ESTADO_REAL.md` §2.6).

## Y después (cómo se conecta con nuestro sistema)

- **Avisame cuando quede habilitado.** Ahí cambio `siat_emitting = true` en el Agente Finanzas y el
  sistema empieza a calcular **IVA débito (13%) + IT (3%)** sobre tus ventas (hoy está en `false`
  porque no emitías: el crédito de compras se acumulaba como saldo a favor).
- **Registrá cada factura emitida** como ingreso con `income-insert` (ya está el mecanismo) para
  que la caja y la postura fiscal queden completas.
- **Vencimientos:** con último dígito de NIT **0**, el estándar del calendario SIN es el **día 13
  del mes siguiente** para las declaraciones mensuales (IVA F-200 / IT F-400). ⚠️ CONFIRMAR contra
  el calendario/RND vigente antes de fijarlo como recordatorio automático.
- **Ojo (contador):** como el NIT ya está activo, Onia **ya tiene obligación de declarar mensual
  aunque sea en cero** — no depende de emitir. Confirmá desde qué período estás obligado para no
  acumular multas por omisión.

## Caveats
- La UI exacta de la Oficina Virtual puede variar; los pasos siguen la modalidad oficial "Portal
  Web en Línea" del SIAT. Confirmá cada opción en pantalla.
- No es asesoría contable definitiva: la elección de modalidad y el alta se validan en la Oficina
  Virtual / con contador matriculado. Onia deja el camino y el tracking listos.

## Fuentes
- SIAT — Portal Web en Línea: https://siatinfo.impuestos.gob.bo/index.php/informacion/modalidades-facturacion/facturacion-portal-web
- SIAT — Modalidades / SIAT en Línea: https://www.impuestos.gob.bo/index.php/siat-en-linea/
- SIAT — Proceso de autorización: https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/autorizacion-de-sistemas/proceso-de-autorizacion
- Interno: `onia-core/ONIA_SIAT_CERTIFICACION_PLAN_2026.md` (camino B, emisor propio), `hermes-content/docs/ONIA_TABLERO_20260709.md` (S1–S5).
