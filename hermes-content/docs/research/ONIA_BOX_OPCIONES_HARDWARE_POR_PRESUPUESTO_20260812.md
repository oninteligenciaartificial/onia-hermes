# Opciones de hardware — Mac, NVIDIA y AMD, por presupuesto y por modelo (2026-08-12)

Qué equipo comprar según cuánta plata hay y qué modelo se quiere correr. Ordenado por
**plataforma** y por **capacidad de razonamiento**, que es lo que preguntó Sergio.

> **La frase que ordena todo el documento:**
> **NVIDIA vende velocidad cara. Apple y AMD venden memoria barata. Razonar necesita memoria.**
> Por eso el mejor equipo para este producto **no es una placa de video**.

---

## 0. La respuesta corta

| Si querés… | Comprá | USD |
|---|---|---|
| Lo más barato que hace algo útil | **Jetson Orin Nano Super 8 GB** | **249** |
| Modelos chicos (8-14B), chat y recepción | **RTX 5070 12 GB** o **Mac Mini M4 16 GB** | 609 / 799 |
| **El producto real — razonamiento sobre documentos** | **Ryzen AI Max+ 395, 128 GB** | **1.999-3.299** |
| Máxima velocidad en modelos grandes, sin venderlo | **Mac Studio M3 Ultra 96 GB** | 4.000-5.300 |
| Razonamiento tope de gama | **RTX PRO 6000, 96 GB ECC** | 13.250 |

---

## 1. La regla que decide todo

**Un modelo corre si entra en la memoria. Punto.** Si no entra, no anda — no anda "más lento".
Recién cuando entra, el **ancho de banda** define qué tan rápido escribe.

### La cuenta

| Cuantización | Memoria por cada mil millones de parámetros |
|---|---|
| **Q4** (la que usamos) | **~0,5 GB** |

Más 15-20 % de sobrecarga. **Modelo de 14B → 14 × 0,5 = 7 GB + 20 % = ~8,4 GB.**

### Qué modelo necesita cuánto

| Modelo | Memoria Q4 | Qué tan bien razona |
|---|---|---|
| **Granite 4.1 3B** | ~1,8 GB | Tareas simples, clasificar, extraer |
| **Granite 4.1 8B · Qwen3 8B** | ~4,8 GB | Chat, recepción, respuestas cortas |
| **Qwen3 14B** | ~8,4 GB | Recepción con RAG |
| **Qwen3 30B-A3B MoE · Granite 4.1 30B** ⭐ | **~18 GB** | **Acá empieza el razonamiento serio sobre documentos** |
| Qwen3 32B denso | ~19 GB | Ídem, más lento en leer |
| **70B** | ~42 GB | Razonamiento alto |
| MoE clase 120B | ~72 GB | Tope de lo que corre en escritorio |

> **Sumale siempre ~3-4 GB** del resto del stack: embeddings (BGE-M3 ~2 GB), Qdrant y el OCR.
> **Y ojo con el MoE:** da velocidad, **no** ahorra memoria. Un 30B-A3B carga los 30B enteros
> aunque active sólo 3B por token.

---

## 2. Las tres plataformas — qué vende cada una

### 🟩 NVIDIA — velocidad cara, cero sorpresas

- **Lo mejor:** CUDA. Todo funciona a la primera, todo el software lo soporta.
- **Lo peor:** la memoria es carísima. Una RTX 5090 son **32 GB por USD 3.000-5.000**.
- **Consumo:** 5090 y PRO 6000 son **600 W sólo la GPU**, en un país de 220 V.
- **Dónde gana de verdad:** abajo del todo (**Jetson 249**) y arriba del todo (**PRO 6000 96 GB con ECC**).

### 🟥 AMD — memoria barata, con un riesgo real

- **Lo mejor:** **128 GB unificados por ~USD 2.000.** No existe equivalente. Corre 70B entero sin
  offload y hace ~100 tok/s en 30B.
- **Lo peor:** **ROCm.** Se estabilizó recién en enero de 2026, `linux-firmware-20251125` lo rompe,
  y donde ROCm no llega se cae a Vulkan, que deja **~56 % del rendimiento**.
- **Y lo decisivo para nosotros:** **Beelink y GMKtec hacen OEM/ODM** — logo, packaging e imagen
  preinstalada. Es lo único que convierte una máquina en un Onia Box.

### 🍎 Apple — rapidísimo, pero no es vendible como producto

- **Lo mejor:** el Mac Studio M3 Ultra tiene **96 GB a 819 GB/s** — la mejor relación tokens/s por
  dólar en modelos grandes de escritorio. **3× el ancho de banda del AMD.**
- **Lo peor, y es un límite duro:** **no le podés poner tu marca.** Apple no te vende 50 con tu
  logo ni te deja preinstalar tu imagen. **Un Mac no puede ser un Onia Box.**
- **Para qué sí sirve:** para desarrollar y medir acá adentro, o para un cliente que **ya tiene** un
  Mac y le instalás el stack encima (una de las vías sin importar nada).

---

## 3. La escalera completa

| USD | Equipo | Plat. | Memoria | Ancho de banda | Modelo que entra | Para qué sirve | ¿Onia Box? |
|---|---|---|---|---|---|---|---|
| **249** | **Jetson Orin Nano Super** | NVIDIA | 8 GB | 102 GB/s | 3B visión | **Gama Vista**: conteo de stock, calidad, placas, seguridad | ✅ vía carrier boards |
| 394 | RTX 5060 Ti 16 GB *(sólo GPU)* | NVIDIA | 16 GB | — | 14-32B Q4 | Recepción avanzada | ⚠️ hay que armar la PC |
| 609 | RTX 5070 12 GB *(sólo GPU)* | NVIDIA | 12 GB | — | 12-14B | Recepción con RAG | ⚠️ ídem |
| 799 | Mac Mini M4 16 GB | Apple | 16 GB | — | 8B | Desarrollo | ❌ sin OEM |
| 1.249 | RTX 5080 16 GB *(sólo GPU)* | NVIDIA | 16 GB | — | 14-32B | Recepción / Taller chico | ⚠️ |
| 1.999 | Mac Mini M4 Pro 48 GB | Apple | 48 GB | — | 30B cómodo | Desarrollo, o cliente que ya tiene Mac | ❌ sin OEM |
| **1.999-3.299** ⭐ | **Ryzen AI Max+ 395 128 GB**<br>Framework 1.999 · Beelink ~2.000 · EVO-X2 3.299 | AMD | **128 GB** | ~256 GB/s | **70B entero** · ~100 t/s en 30B | **Recepción, Expediente y Taller — el producto** | ✅✅ **OEM** |
| 3.000-5.000 | RTX 5090 32 GB | NVIDIA | 32 GB | **1.792 GB/s** | 32B cómodo, ~200 t/s | Taller veloz | ⚠️ 600 W |
| 4.000-5.300 | Mac Studio M3 Ultra 96 GB | Apple | 96 GB | **819 GB/s** | 70B a 25-30 t/s | Lo más rápido en grandes, de escritorio | ❌ sin OEM |
| 4.699 | DGX Spark 128 GB | NVIDIA | 128 GB | 273 GB/s | 70B — ⚠️ **rendimiento en disputa** | — | ❌ canal NVIDIA |
| 13.250 | RTX PRO 6000 Blackwell 96 GB **ECC** | NVIDIA | 96 GB | — | **70B en FP16** o MoE 109B Q4 | **Gama Central** | ⚠️ sistema 18-22k |
| 30-80k | Servidor 2-4× PRO 6000 | NVIDIA | 192-384 GB | — | Varios modelos a la vez | Corporativo | — |
| 300-500k | HGX 8× H200/B200 | NVIDIA | — | — | Todo | Fuera de nuestro alcance | — |

---

## 4. Barato para modelos baratos · caro para razonar

### Lo barato

| USD | Qué corre | Qué NO puede hacer |
|---|---|---|
| **249** Jetson | 3B, visión | **No razona.** Clasifica y detecta |
| **609** RTX 5070 | 14B con RAG | Se queda corto en expedientes largos |
| **799** Mac Mini M4 | 8B | No llega a los 30B del Expediente |

### Lo que razona

**La escalera de razonamiento es la escalera de memoria.** Por eso el orden por precio se rompe:

| USD | Memoria | Razonamiento |
|---|---|---|
| **1.999** Ryzen AI Max+ 395 | **128 GB** | **30B MoE cómodo, 70B entero.** La mejor relación razonamiento/dólar que existe hoy |
| 3.000-5.000 RTX 5090 | 32 GB | 32B **muy rápido** — pero **menos modelo** que el AMD de 2.000 |
| 4.000-5.300 Mac Studio | 96 GB | 70B a buena velocidad. No vendible con marca |
| 13.250 RTX PRO 6000 | 96 GB ECC | 70B en **FP16** (sin pérdida por cuantización) |

> **Una RTX 5090 de USD 5.000 corre modelos MÁS CHICOS que un AMD de USD 2.000.** Va 2× más
> rápido en lo que le entra, pero lo que no entra, no entra. Para razonar sobre documentos, gana
> memoria.

---

## 5. Lo que no compraría, y por qué

| Equipo | Por qué no |
|---|---|
| **DGX Spark, 4.699** | **Rendimiento en disputa entre fuentes**: una reporta 2,7 tok/s en 70B, otra 35-45. La diferencia es demasiado grande. **No comprarlo sin probarlo** |
| **RTX 5090 como equipo principal** | 32 GB por 3.000-5.000, 600 W sólo la GPU, y nunca se vendió cerca del precio de lista |
| **Mac como producto** | Sin OEM no hay marca propia. Sirve adentro, no para vender |
| **Mac Studio 512 GB** | **Retirado en 2026** por la escasez de RAM |

---

## 6. Recomendación por presupuesto

| Presupuesto | Qué comprar | Qué demuestra |
|---|---|---|
| **~250** | Jetson | Sólo visión. **No alcanza para el producto principal** |
| **~2.400** | Ryzen AI Max+ 395 128 GB + SSD 2 TB + UPS + cables | Todo el producto |
| **~2.650** ⭐ | Lo anterior **+ Jetson** | Todo + gama Vista + cubierto el riesgo ROCm |
| **~4.700** | **Dos** equipos de 128 GB de **proveedores distintos** + Jetson | Verificás dos fábricas, comparás calidad, dos demos a la vez |
| **13.000+** | PRO 6000 | Sólo **contra pedido de un cliente que lo pague** |

---

## 7. Aviso sobre los precios

Son **precios de mercado de agosto de 2026 tomados del research** —
`ONIA_LISTA_EQUIPOS_IA_LOCAL_20260806.md`— **no cotizaciones que nos hayan dado**. El de Beelink
es estimación nuestra. Los tres proveedores de la fila del AMD van a cambiar de orden cuando
lleguen las respuestas al RFQ, y el precio **puesto en Santa Cruz** suma GA 10 %, flete y despacho
(`ONIA_ARANCEL_EQUIPOS_INFORMATICA_20260806.md`).

✅ **Verificado el 2026-08-12** — los anchos de banda que faltaban:

| Equipo | Ancho de banda |
|---|---|
| Mac Mini **M4** | **120 GB/s** |
| Mac Mini **M4 Pro** | **273 GB/s** |
| RTX **5060 Ti** | **448 GB/s** |
| RTX **5070** | **672 GB/s** |
| RTX **5080** | **960 GB/s** |

> Dato que ordena la tabla: el **Mac Mini M4 Pro (273 GB/s) tiene más ancho de banda que el
> Ryzen AI Max+ 395 (256 GB/s)** — pero **48 GB contra 128 GB de memoria**. Otra vez lo mismo:
> escribe un poco más rápido, pero le entran modelos más chicos.

[Apple — especificaciones Mac mini](https://www.apple.com/mac-mini/specs/) ·
[Tom's Hardware — RTX 5060 Ti](https://www.tomshardware.com/pc-components/gpus/nvidia-geforce-rtx-5060-ti-16gb-review) ·
[Notebookcheck — RTX 5080](https://www.notebookcheck.net/RTX-5080-will-boast-34-higher-memory-bandwidth-than-its-predecessor-according-to-recent-leak.933536.0.html)

---

## Relacionados

- Catálogo completo de 8 tiers: `ONIA_LISTA_EQUIPOS_IA_LOCAL_20260806.md`
- Gamas por caso de uso: `ONIA_BOX_GAMAS_POR_MODELO_20260806.md`
- Riesgo ROCm y marca propia: `ONIA_BOX_MARCA_PROPIA_VIABILIDAD_20260806.md`
- Modelos, licencias y stack: `ONIA_IA_LOCAL_STACK_COMPLETO_MODELOS_20260806.md`
- Cómo se compra: `ONIA_BOX_RUNBOOK_DE_COMPRA_20260812.md`
