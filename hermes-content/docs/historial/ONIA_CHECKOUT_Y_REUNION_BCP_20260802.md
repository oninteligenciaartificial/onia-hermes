# El checkout de Onia + guion de la reunión BCP (miércoles 5-ago)

> **2026-08-02.** Pedido de Sergio: estructurar QUÉ hablar en la reunión y que el
> ámbito del checkout esté pensado y construido — check-in de entrada, checkout de
> pago, empezando por lo visual. Bs por ahora; LLC + Stripe para USD después.
> Complementa `ONIA_BCP_REUNION_20260805.md` (§0-bis: QR dinámico + API movimientos)
> y las 7 preguntas de [[onia-pasarelas-pago-bolivia]].

## 1. El proceso completo — CÓMO DEBERÍA SER vs CÓMO ESTÁ

### Check-in (entrar al sistema) — ✅ YA ES ASÍ
```
Landing → Probar gratis → ¿Qué tipo de negocio tenés? → datos → onboarding
por pasos → dashboard con SUS datos cargados → 14 días sin tarjeta
```
Vivo en producción, verificado con la cuenta demo. A las 3am funciona solo.

### Checkout (pagar y activar) — la brecha honesta

| Paso | DEBERÍA (visión) | ESTÁ HOY | Falta |
|---|---|---|---|
| 1. Elegir plan | Página visual: Básico/Pro/Full · mensual/**semanal**/anual · resumen claro | Tab "Mi Plan" en settings, copy dental, sin semanal | **Checkout visual dedicado** (construible YA) + ciclo weekly en código |
| 2. Pagar | **QR dinámico del monto exacto**, generado al momento, expira | El cliente paga al QR estático nuestro y sube foto del comprobante | **El banco** (reunión): API de generación de QR |
| 3. Confirmar | El sistema LEE el movimiento bancario y concilia solo, al instante | Auto-aprobación exige verificación bancaria → sin feed, cae a revisión humana | **El banco**: API de extracto/notificación de abono (webhook) |
| 4. Activar | Plan activo en segundos, recibo, a las 3am sin manos | La activación YA es automática y correcta (extiende sin robar días) cuando el pago se verifica | nada — esta parte ya está bien |

**La lectura estratégica:** de los 4 pasos, **el 1 es nuestro y se construye ya**; el
2 y el 3 son EXACTAMENTE lo que se negocia el miércoles; el 4 ya está resuelto.
Con el trial vigente, nada de esto bloquea vender — el banco convierte el cobro de
"subir una foto" a "instantáneo".

### Construir AHORA (cola del producto, tras el dashboard C1):
1. **Página de checkout visual** `/checkout`: cards de plan con toggle
   mensual/semanal/anual (precios del catálogo, semanal 89/199), resumen, paso de
   pago con el QR + comprobante actual, estado en vivo ("esperando confirmación →
   activo"). El slot del QR dinámico queda listo para enchufar la API del banco.
2. **Ciclo `weekly`** en la suscripción (extensión de plan-state/activación, B3).
3. Copy neutro multirubro en "Mi Plan" (hoy dental).

## 2. Guion de la reunión BCP — punto por punto

**Quiénes somos (30 seg):** Onia, SaaS boliviano de gestión con IA para clínicas,
comercios e importadoras. Sistema EN PRODUCCIÓN (mostrar onia.com.bo y el registro
en vivo — se registra una cuenta demo delante de ellos). SEPREC + NIT vigentes.

**Qué necesitamos del banco (el pedido concreto):**
1. **Generación de QR dinámico por API** — monto exacto por cobro, con vencimiento
   y referencia nuestra (para conciliar).
2. **Lectura de abonos por API o webhook** — saber QUÉ pago entró, de qué cuenta,
   con qué referencia, en cuasi-tiempo-real. (Extracto diario nos sirve de mínimo;
   webhook es el ideal.)
3. **Sandbox** para desarrollar sin plata real.
4. Modelo **facilitador**: cada cliente NUESTRO cobra en SU cuenta — nosotros solo
   pedimos esto para NUESTRA cuenta recaudadora de suscripciones (y a futuro,
   ofrecer al banco: cada cliente de Onia es un candidato a cuenta PyME de ellos —
   nosotros les traemos negocios formalizándose. Ese es el win-win a plantear.)

**Las 7 preguntas** (de [[onia-pasarelas-pago-bolivia]]): requisitos de alta ·
costos/comisiones por QR · límites de monto/frecuencia · tiempos de acreditación ·
formato de la referencia · sandbox y documentación técnica · SLA del API.

**Lo que NO negociamos el miércoles:** custodia de fondos de terceros (no somos
agregador), ni USD (eso va por la LLC + Stripe, aparte).

**Cierre de la reunión:** llevarse la documentación técnica del API + un contacto
técnico + fecha de acceso al sandbox. Si el BCP no tiene API de QR dinámico,
preguntar por el roadmap y activar plan B (BNB ya tiene sandbox — memoria).

## 3. Notas registradas para DESPUÉS (pedido de Sergio, no se ejecutan aún)

- **N1 — Meta y los números de los clientes:** el camino es Tech Provider verificado
  (D3) → embedded signup → cada cliente conecta SU número en minutos. Mientras: alta
  manual por cliente en su propio Business Manager (lento pero funciona). Detalle a
  desarrollar cuando D3 destrabe.
- **N2 — Webs de clientes (operativa):** B1 ya ratificado (3 niveles). La mini-web
  automática sale del onboarding; la web completa entra por el flujo de la
  web-factory con brief → plantilla interna → deploy. Productizar el pedido desde el
  panel ("Quiero mi web") como work item.
- **N3 — Más funciones:** ver `ONIA_EMPRESA_BOLIVIANA_FRENTES_20260802.md` §4-5
  (RRHH, fiados/CxP, carpeta del contador, documentos con vencimiento, reuniones,
  notas). Orden propuesto pendiente de ratificación.
- **N4 — Internacional:** la arquitectura YA lo anticipa — `tax_bolivia` es un
  MÓDULO del contrato, no un hardcode: país nuevo = pack fiscal nuevo (tax_argentina
  con AFIP/ARCA, tax_colombia con DIAN) sobre el mismo core, igual que un rubro
  nuevo. Y una **versión genérica** sin módulo fiscal (solo operación + caja) para
  cualquier país. NO se arranca hasta dominar Bolivia — nota, no plan.
- **N5 — Planes por tamaño + configuración:** no todos necesitan IVA y contabilidad
  — un negocio chico quiere agenda y caja y ya. La capa de features por plan YA
  gatea módulos; falta exponerlo como "elegí tus funciones": modo simple (sin
  fiscal) vs completo, configurable por el dueño. Conecta con la matriz de planes
  (`ONIA_PLANES_REQUISITOS_20260801.md`) — el plan define el techo, la config define
  qué de eso se muestra.

---
Ejecución: checkout visual + weekly entran a la cola del producto tras C1
(dashboard). El guion se repasa con Sergio antes del miércoles.
