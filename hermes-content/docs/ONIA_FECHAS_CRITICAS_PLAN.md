# ONIA — Fechas críticas que corren solas

> Fuente de verdad (sin fecha en el nombre): se EDITA este archivo cuando algo cambie.
> Última verificación contra fuentes externas: **2026-08-17** · trámites de Meta
> re-verificados el **2026-08-21** (panel logueado + Graph API).
> Fiscal re-verificado el **2026-10-03** contra el PDF de la **RND 102600000038** (ver §2).
> Regla de la skill fiscal: toda obligación con RND/DS citado; sin fuente = "sin verificar".

---

## 1. La tabla

| Fecha | Qué se cae | Quién destraba | Qué se hace ANTES |
|---|---|---|---|
| **1-sep-2026** | Meta publica las tarifas que rigen desde el 1-oct (incl. la tarifa de service, hoy NO publicada). Hasta entonces todo costeo post-octubre es estimado | Nadie externo — es un checkpoint nuestro | Ese día: re-descargar el CSV oficial de rates y recalcular §3 de este doc. [Fuente Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages) |
| **30-sep-2026** | ⚠️ **Ya no corre: quedó sin efecto.** Acá decía que ese día vencía la prórroga de los grupos 9° a 12° (RND 102600000007) y que desde el 1-oct esos NITs solo emitían en línea. **La RND 102600000038 (30-sep-2026) abrogó las RND que designaban a esos grupos** (102400000004, 005, 012 y 025) y dejó sin efecto sus plazos de incorporación. Ahora el SIN asignará periódicamente una modalidad en línea a los contribuyentes del IVA que no tengan ninguna, **sin fecha** | El SIN (la RND no fija calendario) | Nada con fecha. Onia propio ya cumple: emite por el Portal Web, que ES modalidad en línea. **Prohibido** decirle a un prospecto que está obligado «desde el 1-oct». La web (`/facturacion`, `/guia-facturacion`) se corrigió el 3-oct; detalle en `ONIA_FACTURACION_ESTADO_REAL.md` §2.6 |
| **1-oct-2026** | Se acaba la ventana gratis de WhatsApp: Meta empieza a cobrar **por mensaje** los service messages (gratis desde nov-2024) y las plantillas utility dentro de la ventana de 24 h (gratis desde 1-jul-2025). La promesa pública *"Responder es gratis"* de onia.com.bo/chatbot se vuelve falsa | Sergio (aprueba textos) + quien edite `web-factory/apps/onia-platform/src/content/chatbot-precios.ts` | (1) ✅ **HECHO el 2026-09-11 (`b00fd80f`), y NO se hizo sacando la frase: NO LA SAQUES.** Sacarla le quita al lead un dato de su plata. Las dos copias vivas —`META_NOTA` y el ítem de `REQUISITOS_CHATBOT`, que va dentro del gate de aceptación— se reescribieron con la redacción que **no caduca** (la condición con su fecha: *"no te cuesta hasta el 30 de septiembre de 2026, y desde el 1 de octubre de 2026 Meta también cobra esas respuestas"*), verdadera antes y después del cambio. Las dos fechas salen de `META_VENTANA_24H` en `chatbot-precios.ts` y las vigila `(sitio)/condicion-de-tercero.test.ts`, que pone en rojo toda frase que niegue un cargo de un tercero sin decir hasta cuándo vale. Ese día no hay nada que editar en el sitio; queda pendiente (2) y (3). (2) Que el contador de cupo cuente también las respuestas (hoy no descuenta y desde oct son facturables sin tope). (3) Corregir `utilityBob: 0.113` en `onia-platform/lib/pricing.ts` (implica TC 10,0; el TCO BCB es 12,08). Detalle: `historial/ONIA_PRICING_CHATBOT_20260815.md` §3.6 |
| **~mediados de octubre 2026** | **Runway.** Última cifra en el repo: caja Bs 15.000 − deuda Bs 4.000 = **Bs 11.000 netos al 2026-07-26** (≈11 semanas desde esa fecha). *(Decía «cae casi el mismo día que la ventana SIAT»: esa ventana quedó sin efecto el 30-sep, RND 102600000038)* | Sergio (solo clientes pagando lo mueven) | **Sin dato financiero actualizado a agosto en el repo** — la cifra vigente es la del 26-jul. Actualizar caja/deuda en este doc cuando haya número nuevo |
| **20-oct-2026** | **Access Verification de Meta.** Si no se completa el formulario, Meta **restringe la app "Onia Bot"** (1078962684709749) — así lo dice el panel, textual. Con la app restringida se cae el Embedded Signup, y con él la WABA propia del cliente, la coexistencia y el alta en minutos: el alta vuelve a ser manual bajo NUESTRA WABA, con techo de 20 números y la factura de Meta a nuestro nombre | Sergio (es un formulario de la empresa) | Presentarla **ya**: tarda ~5 días y al **2026-08-21 está NO INICIADA** (verificado en el panel de Meta). El App Review salió **aprobado ese mismo día** con los 3 permisos en acceso avanzado, así que este es el único trámite abierto. Detalle: `ONIA_CHATBOT_LINEA_DE_ENTREGA.md` §1.1 |

---

## 2. FISCAL — la obligación del 1-oct-2026 quedó sin efecto

⚠️ **Corregido el 2026-10-03.** Esta sección decía que la RND 102600000007 cerraba la
transición el 30-sep y que desde el 1-oct los grupos 9° a 12° emitían solo en línea. Ya no es así.

- **RND 102600000038** (SIN, 30-sep-2026, «Abrogación de las RND 102400000004, 102400000005,
  102400000012 y 102400000025»). Artículo Único, I: abroga las cuatro RND que designaban a los
  grupos **Noveno, Décimo, Décimo Primero y Décimo Segundo** «y sus modificaciones». Su
  considerando: es necesario «dejar sin efecto los plazos de incorporación» de esos grupos.
  Par. II: el SIN «asignará periódicamente una modalidad de facturación en línea» a los sujetos
  pasivos del IVA que, a la fecha de publicación, no hayan implementado ninguna. **No fija fecha.**
  Texto leído en el PDF del SIN el 2026-10-03 (ojo: la URL lleva la «ó» descompuesta,
  `Abrogacio%CC%81n`; ver Fuentes).
- **Por qué** (considerando de la misma RND): que la **Ley 1733** (27-may-2026: IVA sobre el
  precio neto y expuesto aparte en el documento fiscal) se aplique de forma «automatizada,
  uniforme y verificable». Esa parte de la ley rige desde el primer día del mes siguiente a la
  publicación de su decreto reglamentario.
- **Lo que quedó sin efecto:** la **RND 102600000007** (23-mar-2026) llevaba la transición de
  esos grupos al 30-sep-2026; antes la RND 102500000036 la había llevado a marzo de 2026. Eran
  listas nominales de NITs (solo el 12° grupo tenía 19.268); con las designaciones abrogadas, ya
  no hay a quién aplicarles ese plazo.
- **¿Alcanza a clínicas y comercios chicos?** Hoy nadie queda obligado «el 1-oct». El que no
  tenga ninguna modalidad en línea la recibe cuando el SIN se la asigne, y la ve en su Oficina
  Virtual. **Sin verificar:** con qué criterio y a qué ritmo asigna; no se afirma ninguno.
- **Consecuencia comercial:** el pitch sigue siendo el ya decidido (`siat-pitch-portal-gratis`):
  se vende el orden, no el miedo, y nunca «estás obligado por ley a comprarme». El Portal Web del
  SIN sigue siendo gratis.
- Para Onia propio no cambia nada (ya factura por el Portal Web). Para el plan del emisor, la
  norma que pesa ahora es la **RND 102600000034** (anexo de la Ley 1733, pruebas y autorización
  del 1-oct al 16-nov-2026): `ONIA_FACTURACION_ESTADO_REAL.md` §2.6.

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

### ¿El add-on chatbot de Bs 390/mes con 500 conversaciones incluidas costea?

**Sí en el régimen elegido (B). NO en el peor caso del régimen A** — y esa es la
diferencia que apareció al bajar el abono. Conversación típica = 1 plantilla utility +
2 respuestas service + 10 turnos de IA propia (modelo de `ONIA_PRICING_CHATBOT_20260815.md` §2.4):

| Régimen | Costo/conv post-oct | 500 conversaciones | % del abono Bs 390 | Margen bruto |
|---|---:|---:|---:|---:|
| **B — cliente paga Meta directo** (el modelo elegido: cada cliente su WABA) | Bs 0,036 (solo IA) | **Bs 18/mes** | 4,6% | **Bs 372** |
| A — Onia absorbe Meta, plantilla **utility** | Bs 0,45 | **Bs 225/mes** | 57,7% | Bs 165 |
| A — peor caso: plantilla recategorizada a **marketing** | Bs 1,20 | **Bs 600/mes** | **154%** | **−Bs 210** |

⚠️ **Cuenta rehecha el 2026-08-27, y una conclusión cambió de signo.** Estas cifras se
calcularon contra un abono de Bs 1.490, que dejó de existir el 2026-08-21 (`pricing.ts`,
`WHATSAPP_ADDON`: **Bs 390/mes sin cargo inicial**). Con el abono viejo el régimen A
toleraba el peor caso con Bs 890 de margen; **con Bs 390 pierde Bs 210 por cliente**. El
punto de equilibrio del régimen A cayó de ~1.240 a **325 conversaciones/mes** — por debajo
de las 500 que el add-on incluye, o sea que **pierde plata dentro de su propio cupo**.

**Lo que esto significa:** absorber el transporte de Meta dejó de ser una opción cara y
pasó a ser una opción inviable. Bajar el abono a Bs 390 y sacar a Onia de la cadena de
pago de Meta **no son dos decisiones separables**.

**Caveats:** (1) la tarifa service post-oct puede subir cuando Meta la publique
(recalcular el 1-sep) — ahora eso encarece la factura DEL CLIENTE, no la nuestra, así que
el riesgo es de churn y hay que avisarle antes; (2) el tope real del régimen B es soporte
humano, y se apretó 4×: **>3,9 h/mes de atención humana = cliente a pérdida**
(Bs 390 ÷ Bs 100/h), contra las ~15 h que daba el abono viejo.

## 4. RUNWAY

**Dato disponible en el repo, desactualizado:** caja Bs 15.000 − deuda Bs 4.000 =
**Bs 11.000 netos al 2026-07-26** (`historial/ONIA_ESTADO_Y_RUMBO_20260726.md`), ≈11
semanas → agotamiento **~mediados de octubre** (`ONIA_BITACORA_155_DIAS.md` §2).
**No hay cifra de caja posterior al 26-jul en el repo** — dato actualizado no disponible.
*(Decía «el choque runway + fin de ventana SIAT en la misma quincena es el pico de riesgo del año»:
la ventana SIAT del 1-oct quedó sin efecto el 30-sep, RND 102600000038. El runway sigue.)*

---

## Fuentes

- [SIN — RND 102600000038, 30-sep-2026: abroga las designaciones de los grupos 9° a 12°](https://www.impuestos.gob.bo/wp-content/uploads/2026/09/RND-102600000038-Abrogacio%CC%81n.pdf)
- [SIN — nota de prensa, ampliación al 30-sep-2026 (RND 102600000007, sin efecto desde el 30-sep)](https://www.impuestos.gob.bo/index.php/nota_prensa/el-sin-amplia-hasta-el-30-de-septiembre-el-plazo-para-la-implementacion-de-la-facturacion-en-linea/)
- [SIN — índice RND 2026](https://www.impuestos.gob.bo/index.php/rnd-2026/)
- [Meta — Pricing on the WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing)
- [Meta — Upcoming pricing updates (service/utility, 1-oct-2026)](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)
- [Meta — Access Verification (deadline 20-oct-2026 para la app "Onia Bot")](https://developers.facebook.com/docs/development/release/access-verification)
- Internos: `ONIA_SIAT_HABILITAR_FACTURACION_CHECKLIST_2026.md` · `historial/ONIA_PRICING_CHATBOT_20260815.md` · `historial/ONIA_META_WHATSAPP_CLIENTES_20260808.md` · `historial/ONIA_ESTADO_Y_RUMBO_20260726.md` · `ONIA_BITACORA_155_DIAS.md`
