# Runbook de compra — de hoy hasta tener la caja en la mesa (2026-08-12)

Cómo se sigue para comprar. Lo primero, porque cambia todo lo demás:

> **La unidad de demo y la tanda de venta se compran de forma distinta.**
> Para **una** unidad, importar formalmente es la vía más cara. Los costos fijos del despacho
> (despachante, DUI, verificación, almacenaje) no se dividen entre diez: caen enteros sobre esa
> única máquina.

---

## 1. El orden real

| Fase | Qué | Sale plata | Cuándo |
|---|---|---|---|
| **0** | Pedir números: RFQ, despachante, banco, plaza | **No** | Esta semana |
| **1** | **Una** unidad de demo | **Sí** — la única antes de validar | Semana 1-3 |
| **2** | Medición + imagen congelada | No | 2 semanas |
| **3** | La tanda de venta | Sí, fuerte | **Solo con pedidos** |

**Fase 0 no compromete nada.** Cotizar no es comprar: pedir precio, MOQ, plazo y arancel no te
obliga a nada y es lo que convierte todas las estimaciones de estos documentos en números reales.

---

## 2. Fase 0 — los cuatro pedidos de esta semana

| # | A quién | Qué devuelve | Estado |
|---|---|---|---|
| 1 | **Beelink** (wholesale@bee-link.com), **GMKtec** (Caroline Lei, caroline@gmktec.com) y **Framework** | Precio FOB a 1 / 10 / 50 / 100, MOQ, plazo, peso y medidas, CE y licencia — y a Framework: si envía a Bolivia, a cuánto puesto, y si hace OEM | **RFQ redactado, sin enviar** |
| 2 | **Oriental** (WhatsApp +591 72030560) | Clasificación por escrito, si el DS 5518 llega a 8471.41, GA efectivo desde Brasil, su tarifario | Consulta redactada |
| 3 | **Tres bancos**, el mismo día | Tipo de cambio de giro + comisiones, incluidas las del corresponsal | — |
| 4 | **Plaza Santa Cruz** | Si acá se consigue algo equivalente y a cuánto | — |

**El 1 es el que destraba la compra.** Sin la respuesta de fábrica no hay precio, y sin precio no
hay decisión de vía. Los correos están escritos y **no fueron enviados**: mandarlos es una
decisión tuya.

> El pedido 4 puede sorprender. Un mini PC con Ryzen AI Max+ 395 y 128 GB es equipo de nicho y es
> probable que no esté en Santa Cruz — **pero eso hay que verificarlo, no suponerlo**. Si aparece
> algo equivalente en plaza, aunque salga 30 % más caro, para **una** unidad de demo puede ganar:
> cero trámite, cero flete, cero espera, y garantía que se reclama caminando.

---

## 2-bis. Qué se compra exactamente — y por qué a fábrica china

### Dos equipos, no uno. Caminos técnicos distintos

| # | Qué | Precio | Para qué |
|---|---|---|---|
| 1 | **Ryzen AI Max+ 395, 128 GB** | ~2.000 | El producto: gamas Recepción, Expediente y Taller |
| 2 | **NVIDIA Jetson Orin Nano Super 8 GB** | **249** | El seguro: camino CUDA **+ es la gama Vista** (visión) |

Una **segunda AMD idéntica no enseña nada nuevo**. El mejor segundo dólar es el Jetson: cubre el
riesgo ROCm de `ONIA_BOX_MARCA_PROPIA_VIABILIDAD_20260806.md` §3 —ROCm en ese chip se estabilizó
recién en enero de 2026 y un firmware conocido lo rompe—, abre un producto de entrada con otro
comprador, y entra en el bolsillo para llevarlo a una reunión.

### Tres proveedores, no dos

| Proveedor | Precio 128 GB | OEM / marca propia |
|---|---|---|
| **Framework Desktop** | **~USD 1.999** | ⏳ a confirmar — su modelo es venta directa, no fabricación para terceros |
| **Beelink GTR9 Pro** | ~2.000 *(estimado, a cotizar)* | ✅ **OEM y ODM confirmados** |
| **GMKtec EVO-X2** | ~3.299 | ✅ **OEM/ODM desde su fundación**, ya lo hacen para banca y salud |

> **La lista de compra original decía solo Beelink.** El Framework a USD 1.999 estaba en el doc
> de equipos y no se había cruzado: **USD 1.300 de diferencia** contra el EVO-X2 por la misma
> clase de chip.

### 🔑 Por qué igual se va a fábrica china

**No es por precio** — Framework sale lo mismo o menos. Es por **OEM**: logo en el chasis,
packaging propio y **la imagen del sistema preinstalada de fábrica**. Sin eso no hay Onia Box,
hay una Beelink con un sticker.

Eso parte la compra en dos decisiones distintas, en momentos distintos:

| Momento | Qué gana | Por qué |
|---|---|---|
| **Unidad de demo** (1, ahora) | **El que llegue más rápido y más barato puesto acá** | Nadie le mira la marca a la máquina de demo. Framework suma soporte real y hardware reparable |
| **Tanda con marca** (después) | **Beelink o GMKtec** | Son los que hacen OEM/ODM. La marca propia se decide con volumen, no con una unidad |

### Y por qué AMD y no NVIDIA para la gama principal

**Decide la memoria, no el cómputo.** 128 GB unificados a ~USD 2.000 **no existen en NVIDIA**: la
DGX Spark cuesta 4.699 y genera 38,55 t/s contra los 86-103 del AMD, y una RTX 5090 son 32 GB a
USD 3.000-5.000 de calle con 600 W sólo la GPU en un país de 220 V. **El riesgo de ROCm se cubre
con el Jetson de 249, no cambiando de arquitectura principal.**

---

## 3. Las tres vías para la primera unidad

| Vía | Costo extra sobre el equipo | Tiempo | Cuándo gana |
|---|---|---|---|
| **Plaza local** | 0 (ya viene nacionalizado) | Hoy | Si existe algo equivalente. Sobreprecio a cambio de tiempo y garantía local |
| **Courier DDP** ⭐ | Flete USD 200-400 + despacho courier USD 150-300 + **GA 10 %** + IVA 14,94 % (recuperable) | 1-2 semanas | **La vía normal para 1-2 unidades** |
| **Importación formal** | Despachante 0,5-2 % + DUI + verificación + almacenaje + flete | 3-6 semanas | **A partir de varias unidades**, cuando los fijos se reparten |

**Puesta acá, una unidad por courier ≈ USD 2.500-2.750** con el equipo a ~USD 2.000 más SSD y el
GA al 10 % (`ONIA_ARANCEL_EQUIPOS_INFORMATICA_20260806.md`). Si Oriental confirma que el DS 5518
la alcanza, baja a ~2.350-2.520.

⏳ **A qué cantidad conviene el despacho formal:** sale de cruzar el tarifario de Oriental con el
flete que cotice la fábrica. **Es una división, no una opinión** — se resuelve el día que lleguen
esas dos respuestas.

> **El IVA de importación no es costo.** Es crédito fiscal, y OniaAgency está en régimen general y
> emite factura. Lo que no vuelve nunca es el GA.

---

## 4. Cómo se paga la primera compra

Con una fábrica con la que nunca operaste, y por un monto chico, **la vía con protección gana
aunque cobre comisión** — es el mismo razonamiento que con la despachante: el seguro sale más
barato que el siniestro.

| Vía | Comisión | Protección |
|---|---|---|
| **T/T (transferencia)** | USD 50-130 + spread | **Ninguna.** Si no mandan, perdiste |
| **Alibaba Trade Assurance** | va en el precio | Retiene el pago hasta que recibís |
| **Tarjeta / PayPal**, si aceptan | ~3-4,4 % | Contracargo posible |

**Sobre USD 2.000, un 4 % son USD 80.** Es barato contra girar a ciegas a una cuenta en Shenzhen.
**A partir de la tanda**, con la fábrica ya probada, se pasa a T/T y se agrupan los giros —
dos pagos, no cinco (`ONIA_IMPORTACION_ELIMINAR_COMISIONES_20260806.md`).

Y antes de pagar cualquier cosa: **licencia comercial + CE a nombre de la fábrica**, que ya están
pedidos dentro del RFQ.

---

## 5. Lo que NO bloquea a lo que

- **El registro de importador NO bloquea la unidad de demo.** Por courier entra a nombre de la
  empresa con el NIT que ya existe. Los trámites de Leslie (SEPREC, SIN, SUMA) corren **en
  paralelo** y hacen falta para la **tanda**, no para la primera máquina.
- **La caja NO bloquea las 5 conversaciones.** En la primera reunión no se muestra producto
  (`ONIA_BOX_LAS_5_CONVERSACIONES_GUION_20260812.md`). La máquina se necesita para la **segunda**
  reunión, la de la demo con los 20 documentos del cliente.
- **El hardware NO bloquea armar el software.** El stack se puede montar y probar con documentos
  reales sobre una GPU alquilada por horas antes de que exista la caja.
  ⚠️ **Eso es gasto en plataforma externa: necesita tu OK explícito** ([[gasto-plataformas-validar-primero]]).
  Y sirve para dejar el stack listo y medir el RAG, **no** para prometer velocidad: la arquitectura
  es distinta y los tok/s de la caja se miden en la caja.

---

## 6. El punto donde sale plata

Es uno solo: **pagar la unidad de demo**. Antes de apretar ese botón, lo que debería ser cierto:

- ✅ Precio de fábrica **por escrito**, con plazo y peso — no una estimación nuestra
- ✅ Arancel confirmado por Oriental (cambia el costo puesto en ~USD 200)
- ✅ Sabés qué vas a demostrar con ella: **encontrar** documentos, y **estado** solo si el cliente
  los escribe (`ONIA_BOX_PREGUNTAR_A_LOS_DOCUMENTOS_20260812.md`)
- ⚠️ **Al menos una conversación hecha.** No las cinco — una. Alcanza para no comprar la gama
  equivocada: el corte entre gamas lo da el **volumen de documentos** del cliente, y ese dato sale
  de preguntar, no de suponer

> **Comprar una unidad para demostrar es defendible aunque las 5 conversaciones no estén hechas.**
> Comprar **una tanda** antes de tener un piloto pagado, no: ahí se van 19.000 y el runway con
> ellos. La diferencia entre las dos decisiones es 10×.

---

## 7. Después de la unidad

1. **Medición, 2 semanas** — protocolo en `ONIA_BOX_GAMAS_POR_MODELO_20260806.md`, más los dos
   números del RAG que faltan: páginas por minuto de ingesta y tiempo de respuesta con citas.
2. **Congelar la imagen** — versiones fijas de kernel, firmware, ROCm, Ollama y modelos. Es lo que
   baja la instalación de 30-45 h a 15-25 h desde la segunda unidad. **Sin esto no hay producto,
   hay una PC.**
3. **Recién ahí la tanda**, con el registro terminado, despachante elegido entre tres y giros
   agrupados.

---

## 8. Checklist de esta semana

- [ ] Enviar el RFQ a Beelink y a GMKtec *(escrito, esperando tu OK)*
- [ ] Enviar la consulta a Oriental por WhatsApp *(escrita)*
- [ ] Cotizar TC de giro en tres bancos el mismo día
- [ ] Preguntar en plaza si hay equivalente y a cuánto
- [ ] Leslie: SEPREC objeto social + SIN actividad *(en paralelo, no bloquea)*
- [ ] Agendar la primera conversación

**Las seis son gratis.** La primera plata sale recién cuando contesten fábrica y despachante.

---

## Relacionados

- Contactos y RFQ: `ONIA_BOX_CONTACTOS_FABRICA_Y_RFQ_20260806.md`
- Arancel real: `ONIA_ARANCEL_EQUIPOS_INFORMATICA_20260806.md`
- Costos y precio: `ONIA_BOX_MODELO_DE_COSTOS_Y_PRECIO_20260806.md`
- Dónde se va la plata: `ONIA_IMPORTACION_ELIMINAR_COMISIONES_20260806.md`
- Vías sin importar: `ONIA_BOX_ALTERNATIVAS_AL_MINIPC_20260806.md`
- Memoria: [[onia-box-ia-local-producto]] · [[feedback-comprar-siempre-de-fabrica]] · [[gasto-plataformas-validar-primero]]
