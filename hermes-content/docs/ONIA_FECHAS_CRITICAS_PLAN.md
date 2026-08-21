# ONIA — Fechas críticas que corren solas

> Fuente de verdad (sin fecha en el nombre): se EDITA este archivo cuando algo cambie.
> Última verificación contra fuentes externas: **2026-08-17** · trámites de Meta
> re-verificados el **2026-08-21** (panel logueado + Graph API).
> Regla de la skill fiscal: toda obligación con RND/DS citado; sin fuente = "sin verificar".

---

## 1. La tabla

| Fecha | Qué se cae | Quién destraba | Qué se hace ANTES |
|---|---|---|---|
| **1-sep-2026** | Meta publica las tarifas que rigen desde el 1-oct (incl. la tarifa de service, hoy NO publicada). Hasta entonces todo costeo post-octubre es estimado | Nadie externo — es un checkpoint nuestro | Ese día: re-descargar el CSV oficial de rates y recalcular §3 de este doc. [Fuente Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages) |
| **30-sep-2026** | Vence la prórroga de **facturación en línea** para los grupos **9°, 10°, 11° y 12°** de contribuyentes (**RND 102600000007**, 25-mar-2026). Desde el **1-oct-2026** esos NITs solo pueden emitir por Electrónica en Línea, Computarizada en Línea o **Portal Web en Línea** | El SIN. Del lado ONIA: Sergio decide el pitch de venta; cada cliente verifica su NIT | (a) Verificar el NIT de cada prospecto contra los anexos de los grupos (RND 102400000004 / 05 / 12 / 25) antes de vender "obligatorio por ley" — **prohibido venderlo como obligación universal** (regla vigente). (b) ONIA propio ya cumple: emite por SIAT Portal Web, que ES modalidad en línea |
| **1-oct-2026** | Se acaba la ventana gratis de WhatsApp: Meta empieza a cobrar **por mensaje** los service messages (gratis desde nov-2024) y las plantillas utility dentro de la ventana de 24 h (gratis desde 1-jul-2025). La promesa pública *"Responder es gratis"* de onia.com.bo/chatbot se vuelve falsa | Sergio (aprueba textos) + quien edite `web-factory/apps/onia-platform/src/content/chatbot-precios.ts` | (1) Sacar la frase "Responder es gratis" de `chatbot-precios.ts` — 10 min. (2) Que el contador de cupo cuente también las respuestas (hoy no descuenta y desde oct son facturables sin tope). (3) Corregir `utilityBob: 0.113` en `onia-platform/lib/pricing.ts` (implica TC 10,0; el TCO BCB es 12,08). Detalle: `historial/ONIA_PRICING_CHATBOT_20260815.md` §3.6 |
| **~mediados de octubre 2026** | **Runway.** Última cifra en el repo: caja Bs 15.000 − deuda Bs 4.000 = **Bs 11.000 netos al 2026-07-26** (≈11 semanas desde esa fecha). Cae casi el mismo día que la ventana SIAT | Sergio (solo clientes pagando lo mueven) | **Sin dato financiero actualizado a agosto en el repo** — la cifra vigente es la del 26-jul. Actualizar caja/deuda en este doc cuando haya número nuevo |
| **20-oct-2026** | **Access Verification de Meta.** Si no se completa el formulario, Meta **restringe la app "Onia Bot"** (1078962684709749) — así lo dice el panel, textual. Con la app restringida se cae el Embedded Signup, y con él la WABA propia del cliente, la coexistencia y el alta en minutos: el alta vuelve a ser manual bajo NUESTRA WABA, con techo de 20 números y la factura de Meta a nuestro nombre | Sergio (es un formulario de la empresa) | Presentarla **ya**: tarda ~5 días y al **2026-08-21 está NO INICIADA** (verificado en el panel de Meta). El App Review salió **aprobado ese mismo día** con los 3 permisos en acceso avanzado, así que este es el único trámite abierto. Detalle: `ONIA_CHATBOT_LINEA_DE_ENTREGA.md` §1.1 |

---

## 2. FISCAL — 30-sep-2026: qué dice exactamente la norma

- **RND 102600000007** (SIN, 25-mar-2026): amplía hasta el **30-sep-2026** el plazo de
  implementación de la facturación en línea para los grupos **Noveno, Décimo, Décimo
  Primero y Décimo Segundo**; desde el **1-oct-2026** emiten exclusivamente por la
  modalidad asignada. Verificado en la
  [nota de prensa del SIN](https://www.impuestos.gob.bo/index.php/nota_prensa/el-sin-amplia-hasta-el-30-de-septiembre-el-plazo-para-la-implementacion-de-la-facturacion-en-linea/)
  el 2026-08-17. Marco: RND 102100000011, Ley 843, DS 21530.
- **Los grupos son listas nominales de NITs**, definidas por las RND **102400000004,
  102400000005, 102400000012 y 102400000025** (anexos publicados por el SIN; solo el 12°
  grupo tiene **19.268 NITs**).
- **¿Alcanza a clínicas dentales y comercios chicos (nuestros clientes)?** Solo a los que
  **figuran en esos anexos**. NO es una obligación universal del padrón: un contribuyente
  no clasificado en ningún grupo sigue sin obligación hasta que el SIN emita una nueva RND
  que lo incluya. **Sin verificar**: si existe una RND que declare a los grupos 9°–12°
  como "último tramo" del padrón — no afirmar que "todos quedan obligados el 1-oct".
- **Consecuencia comercial:** el pitch correcto sigue siendo el ya decidido
  (`siat-pitch-portal-gratis`): se vende el ahorro de tipeo, no el miedo. Antes de decirle
  a un prospecto "estás obligado", se verifica su NIT contra el anexo.

## 3. WHATSAPP — 1-oct-2026: qué cambia exactamente y qué costo queda

Fuente primaria, verificada 2026-08-17:
[Upcoming pricing updates — Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages).

- Desde el **1-oct-2026** Meta cobra los **service messages por mensaje** ("consistent
  with how Meta charges for template messages") y las **plantillas utility dentro de la
  ventana de 24 h** dejan de ser gratis.
- **La tarifa exacta NO está publicada**: Meta la publica **a más tardar el 1-sep-2026**.
  La documentación dice que será consistente con las tarifas utility/authentication del
  mercado.
- Tarifa utility vigente (desde 1-jul-2026) para **"Rest of Latin America"** (incluye
  Bolivia): **USD 0,0113/mensaje = Bs 0,137** (TC BCB 12,08). Procedencia: CSV oficial de
  Meta descargado el 2026-08-08 (`ONIA_META_WHATSAPP_CLIENTES_20260808.md`). La página
  pública solo ofrece el CSV descargable, no tabla inline — **re-descargar el 1-sep**.

### ¿El add-on chatbot de Bs 1.490/mes con 500 conversaciones incluidas costea?

**Sí, con margen amplio en ambos regímenes.** Conversación típica = 1 plantilla utility +
2 respuestas service + 10 turnos de IA propia (modelo de `ONIA_PRICING_CHATBOT_20260815.md` §2.4):

| Régimen | Costo/conv post-oct | 500 conversaciones | % del abono Bs 1.490 | Margen bruto |
|---|---:|---:|---:|---:|
| **B — cliente paga Meta directo** (el modelo elegido: cada cliente su WABA) | Bs 0,036 (solo IA) | **Bs 18/mes** | 1,2% | Bs 1.472 |
| A — Onia absorbe Meta, plantilla **utility** | Bs 0,45 | **Bs 225/mes** | 15% | Bs 1.265 |
| A — peor caso: plantilla recategorizada a **marketing** | Bs 1,20 | **Bs 600/mes** | 40% | Bs 890 |

Punto de equilibrio del régimen A a Bs 1.490: ~1.485 mensajes/mes en marketing — con 500
conversaciones incluidas no se toca. **Caveats:** (1) la tarifa service post-oct puede
subir cuando Meta la publique (recalcular el 1-sep); (2) el tope real del régimen B es
soporte humano: >15 h/mes de atención humana = cliente a pérdida (Bs 1.490 ÷ Bs 100/h).

## 4. RUNWAY

**Dato disponible en el repo, desactualizado:** caja Bs 15.000 − deuda Bs 4.000 =
**Bs 11.000 netos al 2026-07-26** (`historial/ONIA_ESTADO_Y_RUMBO_20260726.md`), ≈11
semanas → agotamiento **~mediados de octubre** (`ONIA_BITACORA_155_DIAS.md` §2).
**No hay cifra de caja posterior al 26-jul en el repo** — dato actualizado no disponible.
El choque runway + fin de ventana SIAT en la misma quincena es el pico de riesgo del año.

---

## Fuentes

- [SIN — nota de prensa, ampliación al 30-sep-2026 (RND 102600000007)](https://www.impuestos.gob.bo/index.php/nota_prensa/el-sin-amplia-hasta-el-30-de-septiembre-el-plazo-para-la-implementacion-de-la-facturacion-en-linea/)
- [SIN — índice RND 2026](https://www.impuestos.gob.bo/index.php/rnd-2026/)
- [Meta — Pricing on the WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing)
- [Meta — Upcoming pricing updates (service/utility, 1-oct-2026)](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)
- [Meta — Access Verification (deadline 20-oct-2026 para la app "Onia Bot")](https://developers.facebook.com/docs/development/release/access-verification)
- Internos: `ONIA_SIAT_HABILITAR_FACTURACION_CHECKLIST_2026.md` · `historial/ONIA_PRICING_CHATBOT_20260815.md` · `historial/ONIA_META_WHATSAPP_CLIENTES_20260808.md` · `historial/ONIA_ESTADO_Y_RUMBO_20260726.md` · `ONIA_BITACORA_155_DIAS.md`
