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
- ~~**Deadline normativo clave:** facturación en línea obligatoria **30-sep-2026**.~~ ⚠️ **Falso dos veces**
  (corregido el 3-oct-2026): nunca fue para todos (solo los NIT de los grupos 9° a 12°, y el de Onia
  no figura en esos anexos) y desde el 30-sep ni eso — ver «Normas que cambiaron el plan». Onia ya
  cumple facturando por el **Portal Web**, que es una modalidad en línea.

## Normas que cambiaron el plan (leídas en el texto del SIN el 3-oct-2026)
Fuente interna con el detalle y las citas: `hermes-content/docs/ONIA_FACTURACION_ESTADO_REAL.md` §2.
- **RND 102600000038 (30-sep-2026) — la obligación del 1-oct ya no existe.** Abroga las RND
  102400000004, 005, 012 y 025, que designaban a los grupos 9° a 12°, y deja «sin efecto los plazos de
  incorporación» (con eso cae el 1-oct que fijaba la **RND 102600000007**). Par. II: el SIN «asignará
  periódicamente» una modalidad en línea a los sujetos pasivos del IVA que todavía no tengan ninguna.
  **No fija fecha: no se inventa una.** Motivo declarado: aplicar la Ley 1733 (IVA sobre el precio neto,
  expuesto aparte en la factura). Nadie le dice a un prospecto «estás obligado desde el 1-oct».
  - **Gate:** `web-factory/apps/onia-platform/src/app/(sitio)/plazo-sin-efecto.test.ts` pone en rojo
    toda superficie servida (texto, JSON-LD, metadata y `lib/siat.ts`) que afirme el plazo viejo como vigente.
  - **Trampa de la URL:** el PDF se llama `RND-102600000038-Abrogacio%CC%81n.pdf` (la «ó» va
    descompuesta, NFD). Escrita con «ó» compuesta da 404 y parece que la norma no existe.
  - **Por qué se perdió tres días** (caso 3-oct): la web afirmaba la obligación en PRESENTE, que era lo
    que pedía el gate de tiempo verbal; una norma de un tercero cambió sin tocar el código. Al llegar una
    RND (Radar Normativo), barrer `102600000007`, «1 de octubre», «grupos 9» en la web, el kit, los docs,
    el bot (`hermes-content/deploy/vps-ops/bot/knowledge.onia.json`) y el generador de propuestas.
- **RND 102600000034 (01-sep-2026):** los sistemas propios y de proveedor hacen pruebas y autorización
  con el Anexo Técnico Ley 1733 del 1-oct al 16-nov-2026. Puede alcanzar al sistema 9473 aunque se
  autorice con los XSD de 2021: se confirma con el SIN antes de invertir en el bloque C. El Portal Web
  no depende de esto.
- **RND 102500000018 + RND 102600000028:** homologar los productos al clasificador nuevo del RNC hasta el
  **30-oct-2026**.
- **Se factura al acreditarse el cobro:** en una suscripción la obligación nace al cobrar (Ley 843 Art. 4 b;
  DS 21530 Art. 4 con los párrafos del DS 4541) y no se pasa a otro mes (RND 102100000011 Art. 25.XIV).
- **Trampa de método:** siatinfo falla la verificación TLS (no manda el intermedio de RapidSSL) y
  WebFetch da 503. Se lee con `curl --cacert <bundle + intermedio>`; nunca apagando la verificación.

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
