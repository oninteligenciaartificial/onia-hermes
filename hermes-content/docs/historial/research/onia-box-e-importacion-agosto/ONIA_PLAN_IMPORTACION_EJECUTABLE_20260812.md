# Plan de importación ejecutable — números, contactos y mensajes listos (2026-08-12)

Todo lo necesario para ejecutar. Los precios ya están corregidos por el hallazgo del DS 5518.

---

## 1. Lo que se verificó hoy y cambia los números

| Pendiente | Estado |
|---|---|
| ¿El DS 5518 alcanza al mini PC? | ✅ **SÍ. 8471.41.00.00 con GA 0 %**, leído del Anexo en la Gaceta Oficial |
| ¿Y al SSD y a las partes? | ✅ **NO.** 8471.70 y toda la 84.73 quedan afuera → **5 %** |
| Razón social de Minisforum | ✅ **Shenzhen Meigao Electronic Equipment Co., Ltd** — fábrica propia, hace OEM/ODM |
| Ancho de banda Mac Mini | ✅ **M4: 120 GB/s · M4 Pro: 273 GB/s** |
| Ancho de banda RTX 50 | ✅ **5060 Ti: 448 · 5070: 672 · 5080: 960 GB/s** |
| Homologación ATT | ⚠️ **Obligatoria** para equipos con radio · **12 semanas** · exención si ya está homologado · **exige Autorización Previa de Importación ANTES de que la carga salga del origen** |

> ⏰ **El arancel cero vence el 31 de diciembre de 2026.** Quedan poco más de cuatro meses. Es el
> único argumento de urgencia real que tenemos.

---

## 2. Los números — una unidad puesta en Santa Cruz

| Concepto | USD | Nota |
|---|---|---|
| Equipo 128 GB | **1.999-3.299** | Framework 1.999 · Beelink ~2.000 *(estimado)* · Minisforum ? · GMKtec 3.299 |
| SSD NVMe 2 TB | 120-200 | |
| **GA del equipo** | **0** | **DS 5518, hasta el 31-dic-2026** |
| GA del SSD (5 %) | 6-10 | No está en el anexo |
| IVA importación 14,94 % | — | **Crédito fiscal, no costo** |
| Flete aéreo | 200-400 | |
| Despacho courier | 150-300 | **Por ENVÍO, no por unidad** |
| **Total puesto** | **~2.360-2.530** | Con el equipo a ~2.000 |

**Complementos, en plaza:** UPS 1000-1500 VA 100-200 · Cat6 y switch 20-50.

### 💡 Consolidar los dos equipos en un solo envío

El despacho courier (150-300) **se cobra por envío**. Comprar el equipo y el Jetson por separado
lo paga **dos veces**. Si vienen de vendedores distintos, se consolidan en una dirección de
tránsito para que entren juntos. **Ahorro: 150-300.**

### Compra inicial completa

| | USD |
|---|---|
| Equipo 128 GB puesto | ~2.360-2.530 |
| Jetson Orin Nano Super (249) + su parte del flete | ~300-350 |
| UPS + cables *(plaza)* | 120-250 |
| **TOTAL** | **~2.800-3.100** |

---

## 3. Contactos — todos verificados

### Fábricas

| Fábrica | Razón social | Contacto |
|---|---|---|
| **Beelink** | Shenzhen AZW Technology (Group) Co., Ltd. | **wholesale@bee-link.com** · **+86 181 6571 0592** |
| **GMKtec** | Shenzhen GMK Technology Co., Ltd. | **Caroline Lei** — caroline@gmktec.com · **+86 134 3098 9641**<br>Richard Han — richard.han@gmktec.com · +86 136 8495 3144 |
| **Minisforum** ✅ nuevo | **Shenzhen Meigao Electronic Equipment Co., Ltd** | Portal B2B: [minisforum.com/pages/business-solutions](https://www.minisforum.com/pages/business-solutions) · Mayorista: [store.minisforum.com/pages/wholesale](https://store.minisforum.com/pages/wholesale)<br>Room 201, 2º piso, Edif. B, Baoneng Zhichuanggu, No. 6 Fukang Road, Pinghu St., Longgang, Shenzhen |
| **Framework** | Framework Computer Inc. (EE.UU.) | ⏳ Sin contacto B2B verificado — usar el formulario del sitio |

### Despachantes

| Agencia | Contacto |
|---|---|
| **Oriental S.R.L.** ⭐ | **WhatsApp +591 72030560** · info@orientalsrl.com · **Santa Cruz +591 3 332 8263** |
| Sincomex Bolivia | +591 2 281 3000 (lun-vie 09:00-16:30) |
| Procomex | Av. Beni, C/ 2 Este Pasillo 3, Santa Cruz — cotización gratuita |

---

## 4. Los mensajes, listos para copiar

### 4.1 A las fábricas — asunto: `OEM/Wholesale Inquiry – AI Mini PC (Ryzen AI Max+ 395) – Bolivia`

```
Dear [Caroline / Sales Team],

We are OniaAgency, a technology company based in Santa Cruz de la Sierra, Bolivia.
We deploy private on-premise AI systems for law firms, medical clinics and
accounting firms, and we are selecting a hardware partner for our product line.

We are interested in your mini PC with AMD Ryzen AI Max+ 395 and 128GB unified
memory.

Could you please send us:

1. PRICING
   - FOB price per unit at 1, 10, 50 and 100 units
   - Your MOQ for a first order
   - Available configurations (96GB vs 128GB, storage options)

2. OEM / BRANDING
   - Cost and MOQ for custom logo on chassis and custom packaging
   - Whether we can ship units with our own pre-installed OS image
   - Lead time for a branded order

3. QUALITY AND COMPLIANCE
   - CE and FCC certificates (issued in your company's name)
   - Business license
   - ISO certification if available

4. LINUX AND ROCm  ← agregado
   - Which Linux distributions and kernel versions you have validated
   - Whether ROCm is officially supported on this unit, and which version
   - Any known firmware issues affecting GPU compute on Linux

5. WARRANTY AND SERVICE
   - Warranty period and RMA procedure for international customers
   - Availability and pricing of spare parts (fans, PSU, mainboard)

6. LOGISTICS AND PAYMENT
   - Package weight and dimensions per unit
   - Do you hold your own export licence?
   - Payment terms, and whether you accept a payment method with buyer
     protection for a first sample order
   - Estimated production lead time

We plan to start with a sample order of 1-2 units for validation, followed by
a first commercial batch before December 2026.

Best regards,
[Nombre] — OniaAgency, Santa Cruz de la Sierra, Bolivia
```

> **Se agregó el bloque 4 (Linux y ROCm).** Es el riesgo técnico número uno del producto y la
> respuesta —o el silencio— dice mucho de con quién estás tratando.

### 4.2 A Oriental — WhatsApp al +591 72030560

**Cambió respecto de la versión anterior:** la pregunta del DS 5518 ya está resuelta, así que
ahora se **confirma**, no se pregunta. Y entra la ATT, que es el bloqueo real.

```
Buen día. Somos OniaAgency, empresa de Santa Cruz. Vamos a iniciar importaciones
de equipos de computación desde China y quisiéramos su asesoramiento.

1. CLASIFICACIÓN — necesitamos confirmación por escrito de:
   a) Mini PC completo (CPU, memoria, entradas y salidas en la misma envoltura)
      — entendemos 8471.41.00.00, alcanzado por el arancel cero del DS 5518.
      ¿Nos lo confirman?
   b) Kit de desarrollo NVIDIA Jetson (placa con procesador, entradas y salidas,
      en gabinete) — ¿entra también por 8471.41 o lo clasifican como parte
      (8473.30)?
   c) SSD NVMe — entendemos 8471.70.00.00 al 5%, fuera del DS 5518.

2. ATT — el equipo trae WiFi y Bluetooth de fábrica, aunque lo vamos a operar
   por cable. ¿Requiere homologación de la ATT y Autorización Previa de
   Importación? ¿Aplica también a una sola unidad para uso propio y demostración,
   o solo a la importación para comercialización?

3. IBMETRO — ¿existe algún reglamento técnico aplicable a estos equipos?

4. Para una primera unidad por courier, ¿nos conviene despacho de ustedes o el
   del courier? ¿Cuál sería su honorario en cada caso?

Quedamos atentos también a su tarifario general.

Muchas gracias.
[Nombre] — OniaAgency, Santa Cruz
```

### 4.3 A los bancos — el mismo día en los tres

```
Buen día. Necesito realizar una transferencia al exterior (China) por
aproximadamente USD 2.500 y quisiera saber:

1. ¿A qué tipo de cambio se ejecuta el giro hoy?
2. ¿Qué comisión cobra el banco?
3. ¿Qué comisión cobran los bancos corresponsales?
4. ¿Cuánto demora en acreditarse?

Gracias.
```

---

## 5. Cronograma con fechas

| Semana | Fechas | Qué pasa |
|---|---|---|
| **1** | **13-20 ago** | Salen los 4 RFQ, la consulta a Oriental y los 3 bancos. Leslie: SEPREC + SIN. Primera conversación de validación |
| **2** | 21-27 ago | Llegan respuestas. Se compara precio **puesto**, no FOB. Se elige proveedor |
| **3** | 28 ago-3 sep | Se paga la unidad (con protección). Producción y despacho |
| **4-5** | sep | Llega. Instalación del stack |
| **6-7** | sep-oct | **Las 2 semanas de medición** + los dos números del RAG |
| **8** | oct | Imagen congelada. **Recién acá hay producto** |
| **—** | **antes del 31-dic** | **La tanda, si hay pedidos.** Después vence el arancel cero |

---

## 6. Trámites de Leslie — en paralelo, no bloquean la unidad de demo

| # | Qué | Dónde |
|---|---|---|
| 1 | Ampliar objeto social | SEPREC, Trámite 14 — gratis |
| 2 | Agregar actividad económica | SIN → OVT → RNC → Modificación Datos — gratis |
| 3 | Certificado del Padrón (después de 1 y 2) | destinatario ADUANA NACIONAL |
| 4 | Registro OCE como Importador Habitual | portal SUMA |
| 5 | Estar presente en la verificación de domicilio | Calle Tulipanes Nro. 9 |

**Sin firma digital y sin garantía**, porque se despacha con agencia (Art. 42 del reglamento OCE).

---

## 7. Lo que sigue sin verificar, y por qué

| Qué | Por qué no se pudo |
|---|---|
| **Precio real de Beelink y Minisforum** | Solo sale de la cotización. El de Beelink es estimación nuestra |
| **Si la ATT exime a una unidad de uso propio** | El procedimiento oficial está en un PDF que no se pudo leer; el sitio no lo aclara. **Lo responde la despachante** |
| **Si Beelink/Minisforum ya están homologados** | Hay que buscar modelo por modelo en att.gob.bo/homologados, y hace falta el modelo exacto que se compre |
| **Tarifario de las despachantes** | Se pide en el mensaje |
| **Precios de plaza en Santa Cruz** | Hay que caminar |
| **Colocation Tigo DC / ITC-SERVICIOS** | Hay que llamar |

**Ninguno de estos bloquea mandar los mensajes hoy.**

---

## Fuentes de lo verificado hoy

- [D.S. 5518 — PDF oficial, Aduana Nacional](https://www.aduana.gob.bo/sites/default/files/archivos/D.S.%205518.pdf) · [Guía de la Aduana sobre el DS 5518](https://www.aduana.gob.bo/todo-lo-que-debe-saber-sobre-el-nuevo-decreto-5518)
- [Homologación ATT — procedimiento](https://www.att.gob.bo/en/homologacion) · [Equipos ya homologados](https://www.att.gob.bo/en/homologados) · [Applus sobre homologación en Bolivia](https://www.appluslaboratories.com/global/en/what-we-do/service-sheet/bolivia-radio-type-approval-(att)) · [VUCE — requisitos ATT](https://www.vuce.gob.bo/es/ATT_certificado_equipos_telecomunicaciones_requisitos)
- [Minisforum — Business Solutions](https://www.minisforum.com/pages/business-solutions) · [Minisforum en Wikipedia](https://en.wikipedia.org/wiki/Minisforum) · [Mayorista](https://store.minisforum.com/pages/wholesale)
- [Mac mini — especificaciones Apple](https://www.apple.com/mac-mini/specs/) · [Mac mini M4 Pro — tech specs](https://support.apple.com/en-us/121555)
- [RTX 5060 Ti — Tom's Hardware](https://www.tomshardware.com/pc-components/gpus/nvidia-geforce-rtx-5060-ti-16gb-review) · [RTX 5080 ancho de banda — Notebookcheck](https://www.notebookcheck.net/RTX-5080-will-boast-34-higher-memory-bandwidth-than-its-predecessor-according-to-recent-leak.933536.0.html)

## Relacionados

- Arancel verificado: `ONIA_ARANCEL_EQUIPOS_INFORMATICA_20260806.md`
- Opciones de hardware: `ONIA_BOX_OPCIONES_HARDWARE_POR_PRESUPUESTO_20260812.md`
- Cómo se compra: `ONIA_BOX_RUNBOOK_DE_COMPRA_20260812.md`
- Validación comercial: `ONIA_BOX_LAS_5_CONVERSACIONES_GUION_20260812.md`
