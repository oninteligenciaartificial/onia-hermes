# Eliminar comisiones e intermediarios — dónde se va la plata de verdad (2026-08-06)

Sergio pidió no pagar comisiones y hacer todo nosotros. **El instinto es correcto**, pero al
mapear todos los intermediarios aparece algo incómodo: **el que más visible es —la agencia
despachante— es el que MENOS cuesta y el MÁS caro de eliminar.**

---

## 1. Mapa completo de intermediarios y comisiones

Sobre un embarque de **10 unidades, FOB USD 18.000, CIF ~19.000**:

| # | Intermediario | Qué cobra | En este embarque | ¿Eliminable? |
|---|---|---|---|---|
| 1 | **Distribuidor** (comprar a revendedor) | **15–30 %** del equipo | **USD 2.700–5.400** | ✅ **YA ELIMINADO** — compramos de fábrica |
| 2 | **Trading company** disfrazada de fábrica | 5–15 % invisible | 900–2.700 | ✅ **YA CUBIERTO** — checklist de verificación |
| 3 | **Agente de exportación chino** | 1–3 % | 180–540 | ✅ **YA EN EL RFQ** — exigimos licencia de exportación propia |
| 4 | **Spread cambiario del banco** | 1–2 % sobre el giro | **USD 180–360** | ⚠️ **Reducible** cotizando bancos |
| 5 | **Comisión de giro internacional** + corresponsales | USD 50–130 **por giro** | 50–130 | ⚠️ **Reducible** agrupando pagos |
| 6 | **Agencia despachante** | **0,5–2 % del CIF** | **USD 95–380** | ⚠️ Sí, pero ver §3 |
| 7 | **Freight forwarder** | margen sobre el flete | variable | ⚠️ A veces conviene: consigue mejor tarifa que vos solo |
| 8 | **Despacho courier "puerta a puerta"** | **USD 150–300 por envío** | alto en envíos chicos | ✅ Se evita despachando con ADA local en envíos grandes |
| 9 | **Almacenaje en depósito aduanero** | por día | **0 … cientos** | ✅ Se evita despachando rápido |
| 10 | **Pasarela de pago** al cobrarle al cliente | 3–5 % | **USD 180–350 por venta** | ✅ **Se elimina con QR Simple: comisión 0** |

---

## 2. Lo que ya eliminamos — y es lo grande

**Las tres primeras filas suman entre USD 3.780 y 8.640 en este embarque.** Ya están cubiertas
por decisiones que tomamos:

- **Comprar directo de fábrica** ([[feedback-comprar-siempre-de-fabrica]])
- **Verificar que sea fábrica y no trader** (licencia en GSXT, CE a nombre de la fábrica)
- **Exigir licencia de exportación propia** en el RFQ

> **Ahí estaba el 90 % de la fuga, y ya está tapada.** Lo que queda son montos de otro orden.

---

## 3. La despachante — el análisis honesto

### Sí se puede eliminar: existe el despacho directo

El reglamento de la ANB contempla **importación de mercancías de manera directa** — sin
agencia despachante. **Pero tiene requisitos que la vía normal no tiene:**

| Requisito | Costo |
|---|---|
| **Garantía de actuación: 2.000 UFV** (si el FOB anual ≤ USD 85.000) | **UFV = Bs 3,32868** al 10-ago-2026 → **Bs 6.657 ≈ USD 561** inmovilizados, o la prima de una póliza |
| **Firma digital ADSIB** (con ADA no hace falta — Art. 42) | Certificado Bs 70–80 + token ~Bs 175 |
| Registro específico de despacho directo | trámite |
| **Responsabilidad legal plena de la declaración** | **el riesgo** |

[Valor UFV — BCB](https://www.bcb.gob.bo/?q=content/valor-actual-de-la-ufv-unidad-de-fomento-de-vivienda-ufv-cotizaciones-y-tipos-de-cambio) ·
[Cotización UFV — Aduana](https://www.aduana.gob.bo/OPE_ufv)

### La cuenta

| | USD |
|---|---|
| Lo que ahorrás en un embarque de 19.000 CIF | **95–380** |
| Menos garantía inmovilizada | −561 (o prima anual) |
| Menos firma digital | −25 |
| **Ahorro neto en el primer embarque** | **negativo o casi cero** |

**Y el riesgo:** si clasificás mal una partida, la multa es tuya. Con agencia despachante,
**la agencia responde**. Eso es una cobertura real que estás comprando por 0,5–2 %.

### 🔴 El costo escondido de hacerlo solo la primera vez

**Si la mercadería queda parada en depósito aduanero por papeles mal hechos, el almacenaje se
come varias veces la comisión de la despachante.** Y en la primera operación, sin experiencia,
la probabilidad de un error es alta.

**Un despachante no es un peaje. En las primeras operaciones es un seguro que sale más barato
que el siniestro.**

### Recomendación

| Cuándo | Qué hacer |
|---|---|
| **Ahora — operaciones 1 a 5** | **Usar despachante.** El 0,5–2 % es barato contra aprender con multas y almacenaje |
| **Después, con experiencia** | **Evaluar despacho directo.** Ahí el ahorro es puro y ya sabés clasificar |

**Y mientras tanto: cotizar tres agencias y negociar.** Oriental, Sincomex y Procomex. La
diferencia entre 0,5 % y 2 % es 4×, y se negocia — sobre todo prometiendo volumen recurrente.

---

## 4. Dónde SÍ hay que apretar — por orden de impacto

### 🥇 El spread cambiario — USD 180–360 por embarque

Transferir USD 18.000 al exterior tiene un **spread del banco sobre el tipo de cambio**, más
comisiones. **Es igual o mayor que la despachante y nadie lo mira.**

**Qué hacer:**
- **Cotizar el TC de giro en 3 bancos** el mismo día. La diferencia entre bancos es real.
- Preguntar explícitamente: *"¿a qué tipo de cambio se ejecuta el giro y qué comisiones se
  cobran, incluidas las del banco corresponsal?"*
- Negociar cuando el volumen sea recurrente.

### 🥈 Agrupar giros — USD 50–130 cada uno

Cada transferencia internacional cuesta lo mismo, mande USD 2.000 o 20.000. **Tres pagos
chicos cuestan el triple que uno grande.**

**Qué hacer:** pagar 30 % de anticipo y 70 % contra copia de BL — **dos giros, no cinco.**

### 🥉 Almacenaje — de 0 a cientos

Se paga por día en depósito aduanero. **Cero si los papeles están completos y el pago listo.**

**Qué hacer:** tener el dinero de los tributos disponible **antes** de que llegue la
mercadería. Recordá: **3 días hábiles para pagar en Banco Unión** desde que se acepta la DUI.

### 🏅 Del lado de la venta: QR Simple — 3 a 5 % por venta

Cobrarle al cliente con tarjeta cuesta 3–5 %. Sobre una venta de USD 6.000, son **USD 180–300
regalados**.

**QR Simple no tiene comisión ni para el comercio ni para el cliente.**
**Es la fuga más fácil de tapar de toda la lista y es plata directa.**

---

## 5. Lo que NO conviene hacer solos

| Función | Por qué no |
|---|---|
| **Clasificación arancelaria** (primeras veces) | Un error se paga con multa e intereses |
| **Freight forwarding en volúmenes chicos** | Un forwarder consigue tarifas que vos solo no. Recién con volumen propio conviene ir directo a la naviera |
| **Certificación de producto** (si aplica ATT o IBMETRO) | Es trámite técnico especializado |

---

## 6. Resumen: el ranking real de la fuga

| Puesto | Fuga | Monto en un embarque de 19.000 | Estado |
|---|---|---|---|
| 1 | Comprar a distribuidor | **2.700–5.400** | ✅ eliminado |
| 2 | Trader disfrazado de fábrica | 900–2.700 | ✅ cubierto |
| 3 | **Pasarela de pago en la venta** | **180–350 por venta** | ⏳ **usar QR Simple** |
| 4 | **Spread cambiario** | **180–360** | ⏳ **cotizar 3 bancos** |
| 5 | Agente de exportación chino | 180–540 | ✅ en el RFQ |
| 6 | Comisiones de giro | 50–130 | ⏳ agrupar pagos |
| 7 | **Despachante** | **95–380** | ⚠️ **conviene pagarla al principio** |

> **Conclusión incómoda pero honesta: la despachante está séptima.** El instinto de eliminar
> intermediarios es correcto, pero apuntado al lugar equivocado te ahorra USD 200 y te expone a
> una multa.
>
> **Las tres acciones que más plata dejan hoy, en orden: cobrar por QR Simple, cotizar el
> tipo de cambio en tres bancos, y agrupar los giros.** Las tres son gratis y ninguna tiene
> riesgo.

---

## Fuentes

- [Valor actual de la UFV — BCB](https://www.bcb.gob.bo/?q=content/valor-actual-de-la-ufv-unidad-de-fomento-de-vivienda-ufv-cotizaciones-y-tipos-de-cambio) · [UFV — Aduana Nacional](https://www.aduana.gob.bo/OPE_ufv) · [UFV histórico](https://boliviaimpuestos.com/ufvs/)
- Garantía de despacho directo y Art. 42 (excepción de firma digital): Reglamento GNOA-REG-19, RD 01-085-24 — ver `ONIA_REGISTRO_IMPORTADOR_PAQUETE_20260806.md`
- QR Simple sin comisión: ver [[onia-pasarelas-pago-bolivia]]
