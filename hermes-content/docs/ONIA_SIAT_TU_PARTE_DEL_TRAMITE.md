<!-- Guia accionable del tramite SIAT para Sergio Urcullo (12-sep-2026). Se EDITA
al avanzar; el estado del portal solo se ve con su login. Fuentes: docs del repo
(ONIA_SIAT_ESTADO_HOMOLOGACION.md, handoff/fiscal.md) + siatinfo.impuestos.gob.bo. -->

# TU PARTE DEL TRÁMITE SIAT — pasos exactos

**Sistema 9473 · Onia Platform v1.00 · NIT 5371375010 · límite de pruebas: 04/11/2026**

Contexto corregido: de los tres bloqueos medidos el 27-ago, **dos ya los resolvió el
código** — el SOAP por sector (cada documento con su propio servicio; probado el 3-sep,
sectores 17 y 24 emiten/anulan/revierten con 908/905/907) y el CUFD de 24 h
(`ensureCufd()` lo renueva solo; el 8-sep se cableó también en las etapas VI y IX). Lo
único trabado de verdad es **lo que solo vos podés hacer logueado**. El 24,8 % es la
lectura del 27-ago; desde entonces corrieron ~777 casos más — el marcador real solo se
ve con tu login.

## Pasos (en orden)

**1. Leé el marcador real de la Fase 1 — 10 min**
`fman.impuestos.gob.bo/facturacionv2/` (o `siat.impuestos.gob.bo/v2/launcher/` →
"Gestión de Autorización de Sistemas (PILOTO)") → **Seguimiento de Sistemas
Informáticos** → solicitud 9473 → **Listado de Etapas**. Anotá el % general y el avance
por etapa (sobre todo IV, VII, XI, VI y IX) y pasalo tal cual. *Solo se ve logueado.*
**Desbloquea:** saber cuánto falta de verdad — el checkpoint local dice 125/125 en los 3
combos del PdV 0, pero el árbitro es el portal.

**2. Creá el Punto de Venta 1 (bajo la sucursal 0) — 10-20 min**
Es EL bloqueo confirmado por el SIN (`933 · EL PUNTO DE VENTA ES INEXISTENTE O
INVALIDO`). Los puntos de venta se registran por servicio web **o por el Portal Web**
([sucursales y puntos de venta](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/requerimientos/sucursales-y-puntos-de-venta)).
En el módulo de facturación del portal buscá **"Registro / Administración de Puntos de
Venta"** (ambiente **piloto**): sucursal **0** (casa matriz), tipo de punto de venta,
nombre (ej. "Punto de Venta 1") y descripción. *La ruta exacta del menú solo se ve
logueado.* Si NO encontrás la opción: avisá y listo — existe la operación SOAP
[`registroPuntoVenta`](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/implementacion-servicios-facturacion/operaciones/registro-punto-de-venta)
(usa el token delegado que ya tenemos) y el código lo puede crear solo.
**Desbloquea:** la mitad de la matriz — los 3 combos `pv1-*` y la mitad de las etapas
I, II, III, V, VI y IX. En cuanto exista, el runner sigue solo.

**3. Etapa VIII (firma digital, 690 casos): DECIDIDA y en marcha — lo tuyo es el
certificado de PRODUCCIÓN (~30 min, no urgente)**
Decidiste el 12-sep **no quitar** la modalidad "Electrónica en línea": la etapa VIII se
completa. El código ya la corre solo (`--etapa VIII` del runner; firma XMLDSig
implementada y verificada). **Medido contra el piloto el 13-sep de madrugada:** el
piloto NO valida la cadena del certificado — acepta uno **autofirmado** siempre que el
`serialNumber` del subject lleve el NIT `5371375010` (sin él responde `902/922 LA FIRMA
DEL XML NO CORRESPONDE AL CONTRIBUYENTE`). El humo devolvió **908 VALIDADA en los 6
combos** (sectores 1, 17 y 24, PdV 0 y 1) y el volumen de los 690 quedó corriendo. O
sea: **la Fase 1 ya no espera ningún trámite tuyo.**
Lo que SÍ es de ustedes — y todo acto legal lo firma **Leslie** (titular SEPREC):
- **Certificado de PRODUCCIÓN** (obligatorio recién para emitir facturas reales; NO
  bloquea la Fase 1): en [solicitud.firmadigital.bo](https://solicitud.firmadigital.bo)
  (AGETIC; alternativa: DigiCert SRL, digicert.bo). Se pide como **persona natural /
  empresa unipersonal** a nombre de Leslie. ⚠️ El campo **NIT** del formulario va con
  **5371375010**: el procedimiento oficial dice que "debe ser llenado con el Número de
  Identificación Tributaria que se utilizará para reportar las facturas"
  ([procedimiento AGETIC](https://facturacion.firmadigital.bo/procedimientos/solicitar-certificado/)).
  Requisitos del [trámite](https://tramitesv2-revision.agetic.gob.bo/tramites/certificado-digital-para-firma-digital):
  CI vigente (anverso/reverso a color) + última factura de luz o agua; costo **Bs 70**.
  El CSR se genera con **Jacobitus Total** (el portal te guía).
- **(Plan B, gratis, por si el SIN endurece las pruebas)** Certificado de PRUEBA
  oficial en [desarrollo.adsib.gob.bo/desa_solicitudes](https://desarrollo.adsib.gob.bo/desa_solicitudes)
  — "el servicio no tiene ningún costo"
  ([facturacion.firmadigital.bo](https://facturacion.firmadigital.bo/procedimientos/solicitar-certificado/)).
  Hoy, medido, el piloto no lo exige, aunque su doc de [firma inválida](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/firma-digital/firma-invalida)
  hable de "el certificado otorgado por nosotros para pruebas".
**Desbloquea:** emitir facturas electrónicas REALES el día de la autorización.

**4. Cuando la Fase 1 marque 100 %: solicitá la Fase 2 (inspección) — 15 min + agenda**
En el mismo módulo. El SIN verifica funcionalidades (nominatividad, sin monto cero,
leyendas, offline/online, plazos 48/72 h); puede ser **presencial o virtual** — pedí
virtual ([proceso de autorización](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/autorizacion-de-sistemas/proceso-de-autorizacion)).
Solicitala apenas cierre la Fase 1: la agenda se satura con el rush del deadline.

**5. Si se acerca el 4-nov sin 100 %: pedí la prórroga — 5 min**
Autorización de Sistemas → **"Solicitud de Prórroga"** → elegís el sistema → motivo. Da
**60 días adicionales**
([guía oficial](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/autorizacion-de-sistemas/guia-de-usuario-prorroga)).
Pedila ANTES de que venza el plazo.

## Lo que el código avanza solo mientras tanto

- **Ya corrido:** los 3 combos del PdV 0 al tope en IV/VII/XI (125/125 c/u); VI y IX
  destrabadas el 8-sep (+320 casos posibles sin PdV 1); 371/371 tests verdes.
- **Apenas exista el PdV 1:** el runner corre `--etapa I` → gate → volumen y recorre los
  3 combos nuevos sin intervención tuya.
- **Pendiente de dev (no te bloquea):** el wrapper HTTP del emisor
  (`POST /fiscal/invoices` → `emitInvoice()`) y su deploy — hoy Onia Platform sigue en
  mock con `SIAT_SERVICE_URL` vacía. Se hace en paralelo para que el día de la
  autorización el cambio sea una variable de entorno.

## Los 2 riesgos de plazo

1. **04/11/2026 — vencen los 90 días de pruebas (Art. 18.III).** Faltan ~7,5 semanas.
   Hay red: la prórroga da +60 días (hasta ~inicios de enero 2027), pero si vence
   prórroga incluida sin completar, **la solicitud se cancela automáticamente** y el
   trámite arranca de cero, con otro código de sistema y re-corriendo todo.
2. **~~La etapa VIII sin decidir hace el plazo incumplible~~ — RESUELTO el 12/13-sep.**
   Decidiste completar la electrónica, y medido en el piloto: la VIII corre con un
   certificado autofirmado (el piloto solo valida el NIT del subject), así que los 690
   casos ya no dependen de ningún trámite. El certificado AGETIC queda solo para
   producción (paso 3). Bonus comercial (sigue vigente): el **01/10/2026** el último
   tramo del padrón queda obligado a facturar en línea — la autorización no llega para
   ese rush; lo que se vende para esa fecha es lo que la landing ya dice (portal
   gratuito + datos listos), que no depende de este trámite.
