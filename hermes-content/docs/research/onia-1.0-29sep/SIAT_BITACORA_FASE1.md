# Bitacora SIAT Fase 1 - VI/IX (privada, sin credenciales)

Carpeta: /opt/onia-siat/runner-20260929 (chmod 700). Autorizacion: Sergio Urcullo 29-sep-2026
(sesion orquestadora) para trafico al PILOTO por SOAP. Portal SIAT: solo Sergio Urcullo.

## 2026-09-29 - preparacion SIN trafico SOAP

- 11:19Z inventario /opt/onia-siat: checkpoint activo fase1-state.json (mtime 2026-09-13T01:05Z),
  VIII aparte en fase1-state-viii.json (02:29Z). Ningun fase1-runner corriendo.
  OJO: /opt/onia-siat/run-fase1-pdv1.sh y run-fase1-volumen.sh (raiz) son las versiones VIEJAS,
  NO abortan (barren etapas con el runner viejo de emisor/). No tocados. No usarlos.
- Tests locales (Windows, Node 24.13): 446/446 suite, 114/114 fase1-runner.
- 11:22Z runner subido: emisor/ = git archive d3be0b4a:hermes-content/integrations/siat
  (core.autocrlf=false; HEAD 36be25bb identico). sha256 src/fase1-runner.mjs =
  ae5c2f4d9e7baf9bd675e977d31a5b85f9fbaa89f9053e96378eb7fa5ed1eca3 (= blob git).
  Runner viejo /opt/onia-siat/emisor intacto (cae5eb6e...).
- 11:25Z tests en VPS (Node 20.20.2, unshare -n + lo up): 446/446. logs/tests-vps-20260929.txt
- 11:26Z respaldo checkpoints (chmod 400):
  state/fase1-state.orig-20260929T1126Z.json       sha256 55b0d853...5979 (= original)
  state/fase1-state-viii.orig-20260929T1126Z.json  sha256 ae0adaab...4159 (= original)
  copia de trabajo: state/fase1-state.work.json
- 11:26Z --portal-snapshot emisor/portal-fase1-20260927.json sobre la copia (sin env, unshare -n).
  Respaldo automatico: state/fase1-state.work.json.pre-portal-1790681202347. Salida: logs/conciliacion-0927.json
  Legacy VI {pv0:280,pv1:280} / IX {pv0:80,pv1:80} quedan en legacyCases, no cuentan.
- 11:27Z merge-viii.mjs: SOLO contadores etapas.VIII (6 x 115 = 690) a la copia, con respaldo
  .pre-viii-<ts> y campo viiiOrigen (sha256 del checkpoint VIII). Facturas VIII no se copian.
- 11:27Z --solo-informe: logs/informe-20260929.json + informe-20260929-resumen.txt
  general 5222/5732. I,II,III,IV,V,VII,VIII,XI 100%. VI 150/560 (29 filas pend, faltan 410).
  IX 60/160 (8 filas pend, faltan 100). sha256 copia: d9d2e084...3cd5
- 11:28Z simulacion offline (sim.mjs: post() stub, fetch bloqueado, unshare -n, copias en /tmp):
  logs/simulacion-20260929.ndjson. Resultado:
  * VI recepcion-ds1-motivo2-pv0-menor500 --count 1, 1a invocacion: 1 SOAP (cufd_refresh PdV0),
    sale por TransitorioError (ventana de evento exige CUFD con >~61 s). Caso sigue en 0.
  * misma orden >=2 min despues: registroEventoSignificativo + recepcionPaqueteFactura(2 XML). Caso -> 1.
  * repetir --count 1: 0 SOAP. --count 2: exactamente 1 evento + 1 paquete mas.
  * I,II,III,IV,V,VII,XI,VIII completas: 0 SOAP. Filas VI/IX completas (con su meta): 0 SOAP.
  * motivo 5 sin CAFC: se BLOQUEA el caso sin SOAP (luego requiere --retry-blocked).
  * IX recepcion-ds17-pv0-menor1000 --count 1: cufd (si vencido) + 1 recepcionMasiva(2 XML).
  Copia de trabajo no modificada por la simulacion.
- siat-piloto.env define SIAT_ENV, SIAT_CODIGO_SISTEMA, SIAT_NIT, SIAT_PILOT_TOKEN (solo nombres).
  NO define SIAT_PILOT_CAFC ni SIAT_FIRMA_*. Runner fijo a piloto (codigoAmbiente 2).
- ESTADO: detenido. Sin trafico SOAP. Esperando lectura fresca del portal de la orquestadora.

## Plantilla por corrida
| hora UTC | caso | meta | antes | despues | SOAP | codigoEvento | codigoRecepcion | estado | nota |
|---|---|---|---|---|---|---|---|---|---|
