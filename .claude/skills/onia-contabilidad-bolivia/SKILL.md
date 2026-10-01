---
name: onia-contabilidad-bolivia
description: Invocar para cualquier tema fiscal o contable de Bolivia — facturación electrónica SIAT, IVA/IT/IUE/RC-IVA, IUE-BE por servicios del exterior, RNDs/DS, la postura fiscal PROPIA de ONIA, o al construir features contables/de facturación en los ERPs (los packs por rubro de Onia Platform) para clientes bolivianos. Todo acomodado a Bolivia, específico y vigente, con fuentes citadas.
---

# ONIA — Contaduría boliviana (propia + features ERP)

Cubre dos usos: (a) la fiscalidad **propia** de ONIA, y (b) **construir** módulos
contables/de facturación en los ERPs para clientes bolivianos.

## Regla dura (Sergio 2026-07-21)
Todo desarrollo (core + ERPs) se acomoda a Bolivia con contaduría boliviana **super
específica y VIGENTE a la fecha**, citando leyes/RND/DS. **Validar con research
(fuente oficial citada) ANTES de codear** temas de Bolivia. **No inventar cifras ni
fechas.** Elusión legal SÍ, evasión NO. No dar asesoría contable definitiva (validar
con contador matriculado).

## Leer primero
- `hermes-content/skills/impuestos-bolivia-operaciones.md`
- `hermes-content/skills/recordatorios-fiscales-bolivia.md`
- `hermes-content/docs/ONIA_OPTIMIZACION_FISCAL_PROPIA_2026.md` (playbook fiscal propio)
- `hermes-content/integrations/siat/` (motor de facturación electrónica, external_gate del core)

## Datos ONIA confirmados (no re-preguntar)
- **NIT 5371375010** (unipersonal). Dígito de NIT → **vencimiento día 13**; recordatorio cableado.
- **Régimen General.** Sin planilla (RC-IVA N/A hoy). Sin contador matriculado (ONIA prepara, valida un tercero).
- **SIAT Portal Web ACTIVO** (facturación manual lista; `siat_emitting=true`, verificado en Oficina Virtual).
- **Herramientas del exterior** (Claude/ElevenLabs/Higgsfield): NO dan crédito fiscal IVA; deducibles del IUE
  solo reteniendo **IUE-BE 12,5%**.
- **Deadline normativo clave:** facturación en línea obligatoria **30-sep-2026**.

## Obligaciones (confirmar tasa/plazo VIGENTE con fuente antes de hardcodear)
IVA mensual · IT mensual · IUE anual · RC-IVA mensual si aplica. No asumir terminación de NIT,
régimen, ni fechas sin confirmación. Si faltan datos → responder "configuración incompleta" con la lista.

## Al construir features contables en un ERP
- No hardcodear tasas/plazos sin fuente citada (RND/DS). Parametrizar por tenant/vertical.
- Facturación electrónica entra por `external_gate` del core (SIAT fuera del core; intake normalizado).
- El CUF/CUFD y el XML/SOAP del SIAT dependen del Anexo oficial: no fabricar el algoritmo, verificar contra doc oficial.

## 🔴 El PORTAL del SIAT (fman.impuestos.gob.bo) lo abre SOLO Sergio Urcullo, a mano (REGLA)
> Sergio Urcullo, 30-sep-2026: «no inicies sesión del SIAT por Claude, detecta que sos un robot… me mandó
> un aviso la otra vez».
- Ninguna sesión inicia sesión en el portal ni lo navega con Playwright, Chrome automatizado ni
  Claude in Chrome. Un aviso del SIN a la cuenta del contribuyente es un riesgo sobre el trámite entero.
- Lo que el portal muestra (Listado de Pruebas, % general, CAFC) se lo pide a Sergio Urcullo
  **como capturas**. El tráfico SOAP al PILOTO (codigoAmbiente=2) desde el runner del VPS sí está autorizado.
- ⚠️ El % del portal es la verdad, pero **fijate de QUÉ lista es**. El 30-sep la captura del «Listado de
  Pruebas» decía 26 %, y casi seguro era el % de la **etapa VI** (150/560 = 26,8 %; 32 filas = las de VI),
  no el general del sistema (80 % el 27-sep). Antes de concluir, pedir también la captura del «Listado de
  Etapas». Por la misma razón, el «general» del informe local del runner no se compara con una lista suelta.
- Mantener trazabilidad y postura fiscal legible por ONIA Center (tabla `tax_posture`).

## Estar al día
Radar Normativo n8n (`OovRU4r0o7pvglJP`, L-V 08:00) capta las RNDs. Al llegar alerta:
evaluar impacto en ONIA + clientes y documentar. Para novedades usar `deep-research` con fuente oficial (SIN/SIAT).
