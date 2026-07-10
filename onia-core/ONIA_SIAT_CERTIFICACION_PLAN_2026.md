# ONIA — Plan Ejecutable: Certificación SIAT como Sistema PROVEEDOR (2026)

Fecha: 2026-07-05. Estado: plan ejecutable de la Capa 2 de
`ONIA_FISCAL_CONTABILIDAD_STRATEGY_2026.md`.
Deadline de mercado: **30-sep-2026** — RND 102600000007 (25-mar-2026) prorroga
hasta esa fecha la obligación de facturar EN LÍNEA para los grupos 9º-12º
(el último tramo del padrón). Cada semana que pasa, miles de NITs buscan
sistema autorizado: la cuenta regresiva ES el pitch.
Owner: Sergio (legal/trámite) + dev ONIA (ingeniería).

## 1. Resumen ejecutivo

Certificar UN sistema ONIA ante el SIN como **Sistema Informático de
Facturación de PROVEEDOR** (RND 102100000011, Art. 17: "sistema desarrollado
por un tercero y autorizado por la Administración Tributaria" para uso de
otros contribuyentes vía relación contractual).

| | Proveedor (elegido) | Por-cliente (sistema propio de cada NIT) |
|---|---|---|
| Trámites | 1 certificación ONIA | 1 trámite completo POR cliente (fases 1-3) |
| Alta de cliente | Asociación + confirmación + token delegado (días) | Semanas de pruebas por NIT |
| Escala | N clientes, todos los verticales | No escala |
| Titular ante el SIN | ONIA (sistema); el cliente sigue siendo el emisor | Cada cliente |

El SIN contempla explícitamente el escenario SaaS: "el proveedor factura por
el contribuyente" con credenciales/token delegado (siatanexo, Sistema
Proveedor, escenario 2) — exactamente el modelo multi-tenant de la factory.

**Decisión de modalidad**: arrancar con **Computarizada en Línea** (el XML
lleva hash/huella digital, NO exige certificado de firma digital por cliente
— Art. 7) y sumar **Electrónica en Línea** (firma digital del sujeto pasivo)
como fase 2 para clientes que la requieran. Menos fricción de onboarding: el
cliente solo entrega credenciales SIAT + token delegado.

Por qué conviene: una certificación habilita a TODOS los clientes de TODOS
los verticales (DentalGest, GestiOS, ProveeGest); es barrera de entrada
(pocos proveedores locales serios); la autorización dura 3 años (Art. 20); y
el add-on "Facturación SIAT" ya está preciado en el catálogo (+Bs 190/mes en
Profesional, incluido en Empresa).

## 2. Requisitos exactos (fuente citada; lo no confirmado = [VERIFICAR])

### 2.1 Legales — ONIA como empresa proveedora

> **CONFIRMADO 2026-07-08 (subagente, fuentes oficiales): el SEPREC NO es
> requisito para registrar el sistema de facturación.** La RND 102100000011
> **Art. 19** (requisitos de acreditación del proveedor) exige 4 cosas y
> ninguna es la matrícula de comercio: (a) inscrito en el RNC/Padrón y en
> **Régimen General**; (b) **domicilio fiscal** en el país; (c) información
> actualizada en el RNC; (d) sin marcas de riesgo tributario activas. ONIA,
> con el NIT activo, **puede iniciar el registro del sistema YA**, con el
> SEPREC en trámite. Fuente: [PDF RND compilada 16/06/2025](https://www.impuestos.gob.bo/wp-content/uploads/2025/10/RND11.pdf)
> Art. 19 + [Proceso de autorización SIAT](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/autorizacion-de-sistemas/proceso-de-autorizacion).
>
> **Plazo crítico (Art. 18.III): 90 días** (prorrogables 60 por única vez) para
> concluir la autorización —incluidas pruebas e inspección— desde que se abre
> la solicitud; si no, se cancela de oficio. **Implicación de secuencia: no
> abrir el registro del sistema hasta tener el emisor técnico listo para
> sostener la Fase 1 de pruebas** (el reloj corre desde el registro).
>
> ADSIB→AGETIC (DS 5519, competencias trasladadas 15-ene-2026): solo afecta la
> modalidad **Electrónica en Línea** (firma digital). La modalidad recomendada
> **Computarizada en Línea** usa CUIS/CUFD + hash SHA-256, sin firma digital →
> el reordenamiento institucional NO bloquea a ONIA.

| # | Requisito | Estado / Fuente |
|---|---|---|
| 1 | **NIT activo** en Régimen General (Art. 19.a) | ✅ ONIA lo tiene · [PDF RND Art.19](https://www.impuestos.gob.bo/wp-content/uploads/2025/10/RND11.pdf) |
| 2 | **Domicilio fiscal** en el país (Art. 19.b) | Art. 19.b |
| 3 | **Información actualizada en el RNC** (Art. 19.c) | Art. 19.c |
| 4 | **Sin marcas de riesgo tributario activas** (Art. 19.d) | Art. 19.d — verificar en Oficina Virtual |
| 5 | **Obligación tributaria IVA vigente** (operativo del portal) | siatinfo/proceso-de-autorizacion |
| 6 | Tipo de autorización = **Proveedor** (no "propio"); "propio" y "proveedor" son autorizaciones DISTINTAS (Art. 19.II) | Art. 18/19.II |
| 7 | Autorización del sistema: vigencia 3 años; renovar con pruebas vigentes | RND Art. 20 |
| 8 | Relación contractual con cada cliente + tipo de servicio declarado al asociar (licencia/alquiler/servicio web/facturación por terceros) | siatinfo/asociacion-de-sistemas |
| 9 | Responsabilidad: el cliente responde por el tributo; el proveedor por fallas de emisión del sistema | RND Art. 34 |
| 10 | Actividad económica "software/servicios informáticos" en el padrón del NIT | **RECOMENDADO, no requisito formal**: Art. 19 NO lo exige para sistemas (sí para imprentas, Art. 61) — pero refuerza "info actualizada en RNC" y evita observación. Cargarla igual por la propia obligación IVA de ONIA. Flujo exacto de alta de actividad 2026: NO CONFIRMADO, verificar en Oficina Virtual del SIN |
| 11 | ~~Inscripción SEPREC~~ | **NO bloquea el registro del sistema** (Art. 19 no la pide). SEPREC y NIT se tramitan en cualquier orden; ONIA con NIT + SEPREC en trámite es situación normal y permitida |

### 2.2 Técnicos — el sistema

**Solicitud** (en SIAT producción → "Gestión de Autorización de Sistemas
(PILOTO)"): nombre comercial del sistema, tipo = **proveedor**, versión,
marca de proceso masivo (activa pruebas extra), modalidad, tipos de
documento sector, datos de contacto. Devuelve **código de sistema** +
parámetros constantes + URLs del ambiente de pruebas. OJO: **sistema WEB y
API se autorizan POR SEPARADO** (siatinfo/proceso-de-autorizacion).

**Fase 1 — Pruebas** en ambiente piloto (`pilotosiat.impuestos.gob.bo`;
servicios SOAP `pilotosiatservicios.impuestos.gob.bo/v1/...?wsdl`), volúmenes
mínimos por etapa (siatinfo/fase-i-pruebas):

| Etapa | Prueba | Volumen |
|---|---|---|
| I | Obtención CUIS | 2 por caso |
| II | Sincronización de catálogos (leyendas, eventos, monedas, productos...) | 50 por caso |
| III | Obtención CUFD | 100 por caso |
| IV | Emisión individual online y offline, todos los tipos doc sector, hash SHA-256 | 500 facturas |
| V | Eventos significativos (inicio/fin) | 5 por caso |
| VI | Emisión por paquetes (≤500/paquete) | 10 |
| VII | Anulación | 250 |
| VIII | Emisión con firma digital (solo modalidad electrónica) | 250 |
| IX | Emisión masiva (≤2.000/paquete; solo si marca masiva) | 10 |
| XI | Reversión de anulación | 98 |

**Fase 2 — Inspección** funcional del SIN (presencial o virtual;
siatinfo/fase-ii-inspeccion): nominatividad en toda transacción; sin
facturas de monto cero (salvo gift card); medios de pago combinados con
tarjeta enmascarada (ceros centrales); tipo de cambio en moneda extranjera;
leyendas aleatorias al pie; transición automática en línea ↔ fuera de línea;
plazos de envío 48h (offline) y 72h (contingencia manual con CAFC); entrega
al comprador de XML + representación gráfica por medio electrónico seguro.

**Fase 3 — Pruebas Piloto** (responsabilidad del proveedor, no supervisada):
funcionales y de carga integrando clientes reales: asociación → confirmación
del cliente en SIAT → **token delegado** generado por el cliente →
configuración (sucursales, puntos de venta, productos homologados) → pruebas
(emisión, anulación, reversión, eventos, offline, masiva ≤1.000). Iniciar
operaciones = **declaración jurada** de que todo se cumplió
(siatinfo/fase-iii-pruebas-piloto).

**Técnica de emisión**:
- **CUIS**: código de inicio por NIT/sistema/sucursal/PdV; renovable desde 5 días antes de vencer.
- **CUFD**: código diario (24h) por sucursal/PdV; incluye "código de control".
- **CUF**: concatenar NIT(13) + fechaHora yyyyMMddHHmmssSSS(17) + sucursal(4) + modalidad(1) + tipoEmisión(1) + tipoFactura(1) + tipoDocSector(2) + nroFactura(10) + PdV(4) → dígito módulo 11 → base 16 → + código de control del CUFD (siatinfo/generacion-cuf).
- **Homologación de productos**: descargar catálogo SIN por servicio web y mapear códigos internos → códigos genéricos (distingue nacional vs importado); el código SIN viaja en el XML (siatinfo/homologacion).
- **Contingencia**: evento significativo registrado hasta 48h después de finalizado; facturas offline en paquetes ≤500; estados 901 pendiente / 904 observada / 908 validado; CAFC para contingencia en papel.
- **Anulación**: hasta el día 9 del mes siguiente, con motivo del catálogo y notificación al comprador; no anulable si está confirmada en RCV o declarada (F110/111); reversión de anulación por única vez (RND 1021-11 Art. 38; siatinfo/anulacion).
- **Firma digital** (modalidad electrónica): certificado del SUJETO PASIVO emitido por **AGETIC** — ADSIB fue CERRADA por DS 5519 y sus competencias pasaron a AGETIC el 15-ene-2026 — o por DIGICERT SRL (privada, autorizada ATT) [VERIFICAR vigencia post-DS 5519]. Para las pruebas: generar CSR según campos AGETIC → enviarlo al SIN por correo → reciben certificados de prueba firmados por SIN/AGETIC.

## 3. Arquitectura: emisor fiscal como SERVICIO COMPARTIDO de la factory

Un solo servicio en el VPS (`onia-siat-emitter`), consumido por todos los
verticales vía API interna. Nada entra al core (`external_gate: siat`,
`layer: module`); lo persistente usa entidades existentes del core.

```text
 DentalGest / GestiOS / ProveeGest (por organización, add-on activado)
        │  POST /api/fiscal/invoices  (payload normalizado)
        ▼
 ┌─ onia-siat-emitter (VPS, multi-tenant) ─────────────────────────┐
 │ API interna (auth por servicio + orgId)                         │
 │ ├─ Tenant registry: NIT, tokens delegados (vault), sucursales,  │
 │ │  puntos de venta, catálogo homologado por org                 │
 │ ├─ Scheduler: CUFD diario por sucursal/PdV; renovación CUIS     │
 │ ├─ Builder: XML por tipo doc sector → validación XSD →          │
 │ │  hash SHA-256 (computarizada) / firma XMLDSig (electrónica)   │
 │ ├─ COLA (reintentos + backoff): DRAFT→QUEUED→SENT→VALIDATED     │
 │ │  /OBSERVED/REJECTED→(ANULADA/REVERTIDA)                       │
 │ ├─ Contingencia: detector de caída SIN → evento significativo   │
 │ │  → acumulación en paquetes ≤500 → reenvío ≤48h                │
 │ └─ Auditoría: request/response SIN completos                    │
 └───────────────┬─────────────────────────────────────────────────┘
                 │ SOAP (piloto: pilotosiatservicios… / prod: siatservicios…)
                 ▼
        SIN — SIAT (CUIS, CUFD, recepción, validación, anulación)

 Persistencia en el producto (core): XML emitido + respuesta SIN + CUF
 → Document adjunto a la venta; factura observada (904) → WorkItem con
 dueño; anulación → ApprovalRequest; todo → ActivityEvent.
```

Reglas: una versión de sistema = un código de sistema del SIN (los cambios
mayores versionan y pueden requerir re-pruebas [VERIFICAR criterio de
versionamiento]); la API interna NO se expone a terceros (evita la segunda
autorización "API" del SIN hasta que haga falta).

## 4. Checklist del trámite (orden, responsable, duración estimada)

> **Estado 2026-07-09 — Fase A CUMPLIDA (padrón verificado):** NIT `5371375010`
> (empresa unipersonal, Gerencia Distrital Santa Cruz II), Régimen General,
> ACTIVO, sin marcas de suspensión, IVA vigente. **Actividad económica de
> software CONFIRMADA y es la PRIMARIA** (4651200 venta de programas de
> informática; complementarias 6209920 servicios en la nube, 6312000 portales
> web, 8549100 enseñanza informática, 7310100 publicidad digital). Todos los
> requisitos del Art. 19 cumplidos → el registro del sistema como Proveedor está
> desbloqueado. Modalidad de facturación ya seleccionada: COMPUTARIZADA EN LÍNEA
> (estado PENDIENTE de habilitar). El emisor técnico avanza en
> `hermes-content/integrations/siat/` (constantes + máquina de estados +
> contrato de payload, 32 tests). SEPREC ⏳ en trámite (NO bloquea).
>
> **Reloj de 90 días (Art. 18.III):** el registro del sistema (paso 5) se abre
> SOLO cuando el emisor pueda sostener la Fase 1 de pruebas — no antes.
>
> **⚠️ Nota del contador:** desde 03/06/2026 las obligaciones IVA/IT/RC-IVA
> corren; primera declaración vence 13/08/2026 (aunque sea sin movimiento).

**Fase A — sin arrancar el reloj de 90 días (se puede YA, con el NIT):**

| # | Paso | Resp. | Nota |
|---|---|---|---|
| 0 | NIT activo en Régimen General | Sergio | ✅ obtenido |
| 1 | Verificar en Oficina Virtual: sin marcas de riesgo tributario + actividad "software" cargada en el padrón (recomendado, no requisito formal) | Sergio | mitiga observaciones; no arranca reloj |
| 2 | Obtener/validar credenciales SIAT en Línea del NIT | Sergio | login unificado prod↔piloto |
| 3 | Leer RND 1021-11 compilada + anexos técnicos (XSD/WSDL/GENERACION-CUF.pdf) | dev | en paralelo |
| 4 | Construir emisor: CUIS/CUFD/CUF, catálogos, XML+XSD, hash | dev | 🟡 arrancado (constantes + state machine, 19 tests); falta SOAP/XML/CUF real. **Cerrar ANTES de abrir el registro (paso 5).** |

**Fase B — arranca el reloj de 90 días (abrir solo cuando el emisor esté listo):**

| # | Paso | Resp. | Nota |
|---|---|---|---|
| 5 | Registrar sistema en "Gestión de Autorización de Sistemas": tipo **Proveedor**, modalidad **Computarizada en Línea**, doc sector compra-venta (+salud para dental [VERIFICAR doc sector clínicas]). Devuelve código de sistema + parámetros | Sergio+dev | **arranca los 90 días** |
| 6 | Fase 1 en piloto: etapas I-VII y XI (≈1.200 operaciones) | dev | 2 sem, requiere 5 |
| 7 | Funcionalidades de inspección (leyendas, medios pago, contingencia auto) | dev | 1 sem, solapa con 6 |
| 8 | Solicitar y pasar Fase 2 inspección (SIN, presencial o virtual) | Sergio+dev | 1-3 sem [agenda del SIN no publicada] |
| 9 | Fase 3 piloto con 1 clínica DentalGest real (asociación + token + homologación + carga) | dev+cliente | 2 sem |
| 10 | Declaración jurada de inicio de operaciones → PRODUCCIÓN | Sergio | 1 día |
| 11 | Onboarding runbook por cliente (asociación, token, homologación) | dev | continuo |

No hay SLA oficial publicado por fase; el total 2-3 meses coincide con lo
presupuestado en la estrategia fiscal. La agenda de inspección del SIN cerca
del deadline es el riesgo de calendario más real.

## 5. Cronograma semana a semana (07-jul → 30-sep-2026)

| Semana | Fechas | Entregable |
|---|---|---|
| S1 | 07-12 jul | Sergio: inicia SEPREC+NIT. Dev: RND+XSD/WSDL leídos; diseño emitter + contrato API interna |
| S2 | 13-19 jul | Cliente SOAP piloto: CUIS/CUFD; generador CUF con tests (mod 11/base 16); schema multi-tenant |
| S3 | 20-26 jul | Sincronización catálogos; builder XML compra-venta + validación XSD + hash; **NIT ONIA emitido** |
| S4 | 27 jul-02 ago | Registro del sistema (código de sistema piloto); Fase 1 etapas I-III (CUIS 2, catálogos 50, CUFD 100) |
| S5 | 03-09 ago | Fase 1 etapa IV: 500 emisiones online/offline; representación gráfica (PDF + rollo) |
| S6 | 10-16 ago | Fase 1 etapas V-VII y XI: eventos, paquetes, 250 anulaciones, 98 reversiones; contingencia automática |
| S7 | 17-23 ago | Checklist de inspección completo (nominatividad, monto cero, medios de pago, leyendas, 48/72h, CAFC); solicitar Fase 2 |
| S8 | 24-30 ago | **Fase 2 inspección** (ventana SIN) + correcciones |
| S9 | 31 ago-06 sep | Fase 3: asociación clínica piloto, token delegado, homologación de su catálogo, pruebas funcionales |
| S10 | 07-13 sep | Fase 3: pruebas de carga; declaración jurada; **primera factura real en producción** |
| S11 | 14-20 sep | Onboarding clientes 2-3; alertas (CUFD vencido, 904, cola atascada); runbook contingencia |
| S12 | 21-27 sep | Campaña "última semana": onboarding express para NITs del grupo 9º-12º sin sistema |
| S13 | 28-30 sep | Colchón final; soporte de aluvión del deadline |

Colchón real: si la inspección (S8) se corre 2-3 semanas, aún se llega
con producción en S12-S13. Si se corre más, opera el plan B.

## 6. Riesgos y plan B

| Riesgo | Prob. | Mitigación |
|---|---|---|
| NIT ONIA demora (bloqueo #1) | media | iniciar S1; TODO el desarrollo (pasos 2,4,6) avanza sin NIT; plan B-a |
| Agenda de inspección del SIN saturada por el rush del deadline | alta | solicitar Fase 2 apenas termine Fase 1; pedir modalidad virtual |
| Cambios normativos (nueva RND, versionamiento de servicios) | media | radar RND semanal ya vivo en n8n → WorkItem |
| Carga/estabilidad del piloto SIN en agosto-sep | media | reintentos+cola; ventanas nocturnas para lotes de prueba |
| Doble trámite si exponemos API a terceros | baja | solo superficie WEB propia en 2026; API de terceros = 2027 |
| Renovación trianual olvidada | baja | WorkItem recurrente a los 30 meses |

**Plan B (puente si la certificación proveedor se atrasa):**
- **B-a. Sistema PROPIO del cliente piloto (computarizada en línea)**: la
  clínica (titular NIT) registra NUESTRO software como sistema de uso propio
  y pasa las mismas fases 1-3 con nuestro acompañamiento. SÍ aplica: no
  requiere NIT ONIA, valida el motor completo con un NIT real y deja un
  cliente facturando legal. NO escala (cada cliente repetiría su trámite):
  usarlo solo con 1-2 clientes fundadores, migrarlos por asociación cuando
  salga la certificación proveedor.
- **B-b. Portal Web en Línea (gratuito del SIN)**: puente operativo para
  clientes de muy bajo volumen — facturan manual en el portal mientras
  esperan el onboarding; ONIA les da el resto del sistema (agenda, cobros,
  RCV del Contador Pack).
- **B-c. Reventa/white-label de un proveedor ya autorizado** (Emizor,
  GuruSoft, Sintic…): último recurso para no perder ventas del deadline;
  margen bajo y dependencia [VERIFICAR condiciones comerciales].

Competencia (proveedores activos visibles): Emizor, Gosocket, GuruSoft,
EDICOM, Sintic, EERPBO, YoFacturo, Facturación Fácil, NWC, Growing Cloud.
La "Lista de Proveedores v2.0" oficial se consulta dentro del portal SIAT
(con login); precios públicos escasos — ventaja ONIA: la facturación viene
DENTRO del sistema de gestión del rubro, no como app suelta.

## 7. Fuentes

- https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/autorizacion-de-sistemas/proceso-de-autorizacion
- https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/autorizacion-de-sistemas/pruebas-para-la-autorizacion-del-sistema-de-facturacion/fase-i-pruebas
- https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/autorizacion-de-sistemas/pruebas-para-la-autorizacion-del-sistema-de-facturacion/fase-ii-inspeccion
- https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/autorizacion-de-sistemas/pruebas-para-la-autorizacion-del-sistema-de-facturacion/fase-iii-pruebas-piloto
- https://siatanexo.impuestos.gob.bo/index.php/sistema-proveedor
- https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/caracteristicas-sfvl/asociacion-de-sistemas
- https://siatanexo.impuestos.gob.bo/index.php/informacion-gral/requisitos-sfvl
- https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/algoritmos-utilizados/generacion-cuf
- https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/requerimientos/homologacion-de-productos-servicios
- https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/emision-y-envio-de-facturas/contingencia-y-eventos-significativos
- https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/emision-y-envio-de-facturas/anulacion-de-documentos-fiscales
- https://www.lexivox.org/norms/BO_SIN-RND-R-0011-01.xhtml (RND 102100000011, texto completo)
- https://unumlex.impuestos.gob.bo/2022/02/10/rnd-no-102100000011-de-11-de-agosto-de-2021-sistema-de-facturacion-compilada/
- https://www.impuestos.gob.bo/index.php/nota_prensa/el-sin-amplia-hasta-el-30-de-septiembre-el-plazo-para-la-implementacion-de-la-facturacion-en-linea/ (RND 102600000007)
- https://www.gob.bo/tramites/certificado-digital-para-facturacion-electronica (AGETIC; cierre ADSIB por DS 5519)
- https://facturacion.firmadigital.bo/que-necesito/
- https://www.seprec.gob.bo/index.php/tramite1/ y https://boliviaimpuestos.com/como-sacar-nit-bolivia-o-crear-una-empresa/
- https://pilotosiat.impuestos.gob.bo/Autenticacion/index.xhtml (ambiente piloto)
