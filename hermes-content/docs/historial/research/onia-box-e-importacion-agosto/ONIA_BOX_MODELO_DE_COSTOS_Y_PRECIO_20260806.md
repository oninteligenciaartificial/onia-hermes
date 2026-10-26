# Onia Box — modelo de costos, tipo de cambio y precio contra la competencia (2026-08-06)

Decimotercera parte. Cuánto cuesta realmente, contando todo lo que hay que hacerle, el tipo de
cambio, y contra qué compite de verdad.

---

## 0. Dos correcciones a estimaciones anteriores

| Dije antes | Real | Por qué |
|---|---|---|
| Flete aéreo **USD 150–250**/unidad | **USD 200–400** | El flete en sí es barato (~6–8 USD/kg); **lo que domina es el despacho aduanero courier: USD 150–300** |
| Implementación **20–30 horas** | **30–45 horas** | Al desglosarlo capa por capa da más (ver §3) |

Ninguna rompe el negocio, pero el margen real es algo menor que lo que te dije.

---

## 1. Tipo de cambio — la variable que puede comerse el margen

**TC oficial BCB al 6-ago-2026: ~Bs 11,86/USD.** El paralelo está en ~11,62, o sea que **la
brecha prácticamente se cerró** tras la flotación de junio.

### Lo que eso implica

| | |
|---|---|
| **Comprás en USD** | El costo del equipo sube con cada devaluación |
| **Si cotizás en Bs a precio fijo** | Cada punto de devaluación entre la cotización y el pago **te lo comés vos** |
| Referencia del daño | El dólar pasó de 6,96 a 11,86 en poco más de un año: **+70 %** |

**Regla dura: cotizar en USD y cobrar al TC del día de pago.** Si el cliente exige precio en
bolivianos, la cotización vence en **7 días** y lleva cláusula de ajuste. No es capricho — con
un salto del 10 % desaparece un tercio del margen.

[BCB — tipo de cambio oficial](https://www.bcb.gob.bo/tco_reporte_detalle_historico.php)

---

## 2. Costo del equipo puesto en Santa Cruz, por vía

### Vía A — Mini PC importado, **1 unidad por courier**

| Concepto | USD |
|---|---|
| Beelink GTR9 Pro 128 GB (FOB, a confirmar con RFQ) | 2.000 |
| SSD NVMe 2 TB | 150 |
| Flete express (~4 kg × 6–8/kg + recargo combustible 15–25 % + seguridad y terminal) | 45–70 |
| **Despacho aduanero courier** ← el que duele | **150–300** |
| GA — **a confirmar** con clasificación escrita | 0 – 10 % |
| IVA 14,94 % | **crédito fiscal, no costo** |
| **TOTAL** | **~2.350–2.520** |

### Vía B — Mini PC importado, **10 unidades por marítimo consolidado**

| Concepto | USD/unidad |
|---|---|
| Equipo (FOB con descuento de volumen) | 1.700–1.800 |
| SSD | 130 |
| Flete marítimo consolidado | 30–60 |
| Despachante y gastos prorrateados | 50–80 |
| **TOTAL** | **~1.910–2.070** |

**El volumen ahorra ~USD 400 por unidad**, casi todo por dejar de pagar despacho courier por
cada caja.

### Vía C — **Hardware del cliente** (no se importa nada)

| Concepto | USD |
|---|---|
| Equipo | **0** |
| **TOTAL** | **0** |

### Vía D — Colocation en datacenter boliviano

Equipo (A o B) + cuota mensual del datacenter. **A cotizar con Tigo DC e ITC-SERVICIOS** — no
tengo el número y no lo voy a inventar.

---

## 3. Lo que hay que hacerle — el costo real del trabajo

| Tarea | Horas |
|---|---|
| Sistema base, kernel ≥ 6.18.4, firmware validado | 4–6 |
| Contenedores, Ollama, descarga y prueba de modelos | 4–6 |
| RAG: Qdrant + Tika + carga de los documentos del cliente | 6–10 |
| Integración con ONIA Platform / Chatwoot / n8n | 6–10 |
| Acceso remoto, monitoreo y alertas | 2–3 |
| Capacitación al cliente | 3–4 |
| Pruebas, ajuste y entrega | 4–6 |
| **TOTAL** | **30–45 h** |

> **Ojo con esto:** a partir de la segunda instalación, con la **imagen congelada** las tareas
> 1 y 2 pasan a ser **clonar el disco**. La implementación real cae a **15–25 horas**.
> **El trabajo de la primera unidad es la inversión que abarata todas las siguientes.**

No encontré tarifas horarias publicadas de servicios TI en Bolivia (Get Server, Intecsa,
TICSYS, Tu Consultor TI no las publican). **Hay que preguntarlo o estimarlo internamente.**

---

## 4. Contra qué compite de verdad

**No compite contra otro proveedor de cajas — en Bolivia no hay.** Compite contra tres cosas:

| Competidor | Precio | Debilidad que le explotamos |
|---|---|---|
| **ChatGPT Business** | **USD 20/usuario/mes** anual (25 mensual), mínimo 2 asientos. Bajó de 25/30 el 2-abr-2026 | **Los datos salen.** Y **se paga por asiento** |
| **Microsoft 365 Copilot Business** | **USD 18/usuario/mes** promocional (21 estándar) hasta 31-dic-2026 — **y no se puede comprar solo**, exige licencia base M365 | Costo real ≈ **USD 30/usuario/mes**. Los datos salen |
| **No hacer nada** | 0 | **Es el competidor más difícil de todos** |
| Servidor privado importado del exterior | **USD 8.000–12.000** (piso internacional) | Sin soporte local ni instalación |

### 🎯 La matemática que cierra la venta

Estudio jurídico de **10 personas**:

| | Año 1 | Año 2 | **2 años** |
|---|---|---|---|
| ChatGPT Business (10 × 20 × 12) | 2.400 | 2.400 | **4.800** |
| Copilot con licencia base (10 × ~30 × 12) | 3.600 | 3.600 | **7.200** |
| **Onia Box** (6.000 + soporte 200/mes) | 8.400 | 2.400 | **10.800** |

A dos años la caja sale más cara. **Pero:**

1. **La nube cobra por asiento; la caja no.** Un estudio de **25 personas** paga 25 licencias —
   ChatGPT le cuesta **USD 6.000/año**, y la caja **exactamente lo mismo que a uno de 5**.
   **A partir de ~20 usuarios, la caja gana también en plata.**
2. **A los expedientes confidenciales no los podés subir a ninguno de los dos.** Ese trabajo
   hoy simplemente **no se hace**.
3. **La caja corre además** ONIA Platform, el chatbot, las automatizaciones y el backup — que el
   cliente paga aparte hoy.
4. **El precio en la nube sube y se cobra en USD**; la caja es un capex único.

> **Conclusión de pricing: no vender contra ChatGPT en oficinas chicas — ahí perdés.
> Vender a partir de ~15–20 usuarios, o a quien tiene datos que no puede subir.**

[ChatGPT Business — precio 2026](https://www.eesel.ai/blog/chatgpt-work-pricing) ·
[Copilot pricing 2026](https://www.eesel.ai/blog/copilot-pricing) ·
[Copilot Business SMB](https://bondconsultingservices.com/blog/microsoft-365-copilot-business-pricing-smb-2026/)

---

## 5. Precio recomendado y margen por vía

| Vía | Costo equipo | Precio sugerido | Margen bruto | Horas |
|---|---|---|---|---|
| **C — Hardware del cliente** | **0** | **1.500–2.500** (implementación + 1er año soporte) | **1.500–2.500** | 30–45 (1ª) · 15–25 (siguientes) |
| **A — Importado, 1 unidad** | 2.350–2.520 | **6.000–7.000** | **3.500–4.650** | ídem |
| **B — Importado, 10 unidades** | 1.910–2.070 | **6.000–7.000** | **3.930–5.090** | ídem |
| **D — Colocation** | equipo + cuota DC | 4.000–5.000 + mensual | menor único, **mayor recurrente** | ídem |

**En todas: soporte y actualizaciones USD 150–300/mes.** Ahí está el negocio real.

### El dato que ordena la estrategia

> **La vía C tiene margen de USD 1.500–2.500 con costo de hardware CERO y sin trámites.
> La vía A tiene margen de 3.500–4.650 pero inmoviliza 2.400 y necesita registro de importador.**

**Por unidad se gana más importando. Por peso invertido y por tiempo hasta la primera factura,
gana la vía C por lejos.** Por eso la secuencia es C primero, A después.

---

## 6. Lo que falta para cerrar el precio

| # | Dato | Cómo se consigue |
|---|---|---|
| 1 | **FOB real de fábrica a 1/10/50/100 unidades** | El RFQ ya está redactado |
| 2 | **GA de las partidas 84.71 y 8473.30** | Clasificación escrita de la despachante |
| 3 | Costo real del despacho courier en Santa Cruz | Cotizar con DHL/FedEx local |
| 4 | Cuota mensual de Tigo DC / ITC-SERVICIOS | Llamada |
| 5 | Nuestra tarifa horaria de referencia | Decisión interna |

**Con 1 y 2 el modelo queda cerrado.** Los demás afinan.

---

## Resumen

- **Equipo puesto: ~USD 2.350–2.520** a una unidad, **~1.910–2.070** a diez.
- **Trabajo: 30–45 h la primera, 15–25 h las siguientes** gracias a la imagen congelada.
- **Cotizar SIEMPRE en USD**, o con vencimiento a 7 días y cláusula de ajuste.
- **El competidor real es la nube por asiento** — y la caja gana **a partir de ~15–20
  usuarios**, o cuando el dato no puede salir.
- **Precio: USD 6.000–7.000** importando · **1.500–2.500** sobre hardware del cliente ·
  **150–300/mes** de soporte en ambos casos.

---

## Fuentes

- [BCB — tipo de cambio](https://www.bcb.gob.bo/tco_reporte_detalle_historico.php)
- [Costos de envío China→Bolivia — Gerudo](https://www.gerudologistics.com/shipping-from-china-to-bolivia) · [Goodhope Freight](https://goodhopefreight.com/freight/freight-price-list-from-china-to-bolivia.html) · [FedEx Bolivia](https://www.fedex.com/en-bo/shipping/rates.html)
- [ChatGPT Business/Enterprise 2026](https://www.eesel.ai/blog/chatgpt-work-pricing) · [Microsoft Copilot pricing 2026](https://www.eesel.ai/blog/copilot-pricing) · [Copilot Business SMB](https://bondconsultingservices.com/blog/microsoft-365-copilot-business-pricing-smb-2026/)
- Proveedores TI locales (sin precios publicados): [Get Server Bolivia](https://getserver.com.bo/) · [Intecsa](https://intecsa.com.bo/) · [Tu Consultor TI](https://www.tuconsultorti.com/ubicaciones/santa-cruz-de-la-sierra/)
