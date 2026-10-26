# Lista de equipos — infraestructura para IA local (2026-08-06)

Paso 0 del `ONIA_REGISTRO_IMPORTADOR_PAQUETE_20260806.md`. Rango completo, de lo más chico a
lo más grande, con precio de referencia de **agosto 2026**, qué modelo corre cada tier, y qué
implica para importar a Bolivia.

⚠️ **Precios referenciales de mercado internacional, no cotizaciones.** Todos suben: hay
escasez global de GDDR7 y de RAM (ver §4).

---

## 1. Los tiers

### T0 — Edge / demo · USD 250–600
| | |
|---|---|
| Equipo | **NVIDIA Jetson Orin Nano Super** 8 GB — 67 TOPS INT8, 102 GB/s, 7–15 W, tamaño tarjeta de crédito |
| Precio | **USD 249** (bajó desde 499) |
| Corre | Modelos de **3B y menores**, cuantizados. Visión, agentes visuales, robótica |
| Peso | < 1 kg |
| Partida probable | 84.71 |
| Para quién | Demos, kioscos, visión en planta, prototipos. **No corre un LLM serio** |

Alternativas: Radxa Fogwise Airbox, Firefly AIO-1684XQ. El ecosistema de software de NVIDIA es
la ventaja real, no el hardware.

### T1 — Escritorio básico · USD 800–2.000
| | |
|---|---|
| Equipo | **Mac Mini M4** base 16 GB (USD 799) · **Mac Mini M4 Pro 48 GB** (~USD 1.999) |
| Corre | Base: hasta ~14B · M4 Pro 48 GB: **32B cómodo**, 70B en cuantización baja |
| Nota | Apple discontinuó el Mini de USD 599 en mayo 2026; la base subió a 799 |

### T2 — La caja de 70B · USD 2.000–3.300 ← **el sweet spot**
| | |
|---|---|
| Equipo | **AMD Ryzen AI Max+ 395 "Strix Halo"**, 128 GB LPDDR5X unificada, ~256 GB/s, 16 núcleos Zen 5 + Radeon 8060S |
| Precios | **Framework Desktop 128 GB ~USD 1.999** · Nimo ~USD 2.999 · GMKtec EVO-X2 ~USD 3.299 · AMD Dev Kit USD 3.999 |
| Corre | **Modelos de 70B enteros en memoria**, sin offload. En Linux se asignan 96–100 GB a la GPU vía GTT. ~100 tok/s en modelos de 30B |
| Tamaño | Chasis de **2 litros** |
| Partida probable | 84.71 |

### T3 — Workstation con GPU discreta · USD 3.000–5.000 (sólo la GPU)
| | |
|---|---|
| Equipo | **RTX 5090** 32 GB GDDR7, **1.792 GB/s** |
| Precio real | USD 3.000–5.000 en calle — **nunca se vendió cerca del MSRP de 2.000** |
| Corre | 32B Q4 en una sola tarjeta · 70B Q4 con dos · ~200 tok/s |
| Trade-off | Mucho más rápida que T2, pero **menos memoria** (32 vs 128 GB) |

Escalones menores: RTX 5060 Ti 16 GB ~USD 394 (7–13B) · RTX 5070 12 GB ~USD 609 (14B) ·
RTX 5080 16 GB ~USD 1.249 (14–32B).

### T3.5 — NVIDIA DGX Spark · USD 4.699
128 GB, 273 GB/s. ⚠️ **Rendimiento en disputa entre fuentes:** una reporta **2,7 tok/s** en
Llama 3.1 70B (contra 25–30 del M3 Ultra), otra reporta **35–45 tok/s**. **No comprarlo sin
probarlo.** La diferencia es demasiado grande para ignorarla.

### T4 — Mac Studio M3 Ultra · USD 4.000–5.300
96 GB unificados, **819 GB/s** — la mejor relación tokens/s por dólar para modelos grandes en
formato de escritorio. ⚠️ La configuración de 512 GB **fue retirada en 2026** por la escasez
de RAM.

### T5 — Estación profesional · USD 18.000–22.000 (sistema)
| | |
|---|---|
| GPU | **RTX PRO 6000 Blackwell**, 96 GB GDDR7 **con ECC**, 24.064 CUDA cores, 600 W |
| Precio GPU | **USD 13.250** — subió **55 % en 16 meses** (lanzó a 8.565 en marzo 2025) |
| Corre | **Llama 3.3 70B en FP16** o MoE de clase 109B en Q4 |
| Contra H200 | H200 tiene 141 GB y 2× FP16, pero cuesta **USD 30.000–40.000 por GPU** |

### T6 — Servidor multi-GPU · USD 30.000–80.000
2–4 × RTX PRO 6000 en chasis 4U, con CPU, NVLink donde aplique, red y almacenamiento. El
"alrededor de las GPUs" agrega **USD 75.000–90.000** en sistemas grandes.

### T7 — HGX de 8 GPUs · USD 300.000–500.000
HGX H200 8× **USD 320–420 k** · HGX B200 8× **USD 400–500 k** · DGX B300 **USD 300–350 k**.

> **Fuera del mercado boliviano.** Además, la producción Blackwell la absorben los
> hiperescaladores y los compradores institucionales enfrentan listas de espera y canales
> enterprise. **Descartar este tier.**

---

## 2. Lo que realmente conviene importar

| Tier | ¿Compra directa de fábrica? | ¿Hay comprador en Bolivia? | Veredicto |
|---|---|---|---|
| **T0 Jetson** | Parcial — NVIDIA vende por OEM/distribución; sí se puede ir a fabricantes chinos de carrier boards | Sí: demos, visión, kioscos. Ticket bajo | ✅ **Sí**, como producto de entrada y demo |
| T1 Mac Mini | ❌ Apple no vende de fábrica | Sí | ❌ Viola la regla de fábrica |
| **T2 Strix Halo** | ✅ **GMKtec, Nimo, Beelink son fabricantes chinos** | Sí: el negocio que quiere IA privada | ✅✅ **El mejor candidato** |
| T3 RTX 5090 | Parcial — vía AIB (ASUS, Gigabyte, MSI, PNY) | Sí, pero compite con gamers | ⚠️ Allocation difícil en escasez |
| T3.5 DGX Spark | ❌ canal NVIDIA | Dudoso | ⚠️ Rendimiento en disputa |
| T4 Mac Studio | ❌ Apple | Sí | ❌ Viola la regla |
| T5 RTX PRO 6000 | Parcial | Muy pocos | ⚠️ Ticket alto, allocation difícil |
| T6 Servidor | ✅ ODM chinos/taiwaneses | Muy pocos | ⚠️ Bajo volumen |
| T7 HGX | ❌ | **No** | ❌ Descartado |

**Recomendación: T2 como producto principal, T0 como entrada.**

T2 cumple **todas** las condiciones a la vez: se compra directo de fábrica china (cumple
[[feedback-comprar-siempre-de-fabrica]]), corre modelos de 70B enteros, cuesta lo que un
negocio mediano puede pagar, pesa poco y ocupa 2 litros (excelente valor/kg para flete), y es
el tier donde ONIA puede diferenciarse **entregándolo con el software ya corriendo** en vez de
vender una caja pelada.

---

## 3. Capa boliviana — lo que nadie del exterior te va a decir

**Energía.** Bolivia es 220 V. Una RTX 5090 o una RTX PRO 6000 son **600 W sólo la GPU**; el
equipo completo pide circuito propio. Un T6 necesita instalación dedicada.

**Calor.** Santa Cruz es caliente y húmeda. Una caja con GPU en una oficina sin aire
acondicionado va a throttlear o fallar. **Esto no es un detalle, es parte del producto:** UPS,
gabinete y ventilación adecuada dejan de ser accesorios y pasan a ser parte de la venta.

**Y de ahí sale el argumento comercial:** no se vende un equipo, se vende **la instalación
funcionando**. Eso además justifica el servicio recurrente, que es lo único que no se
commoditiza.

**ATT.** Los servidores y mini PCs rara vez traen radio, pero **los switches y access points
sí**. Si el embarque los mezcla, el equipo con radio puede frenar todo. Separar o pedir
variantes sólo-Ethernet.

**DS 5518.** Cubre "línea negra" — laptops, tablets, monitores, smartphones. **No menciona
servidores, GPUs ni componentes.** No dar por hecha la exención: pedir clasificación por
escrito a la despachante.

---

## 4. Riesgo de mercado — la escasez corta en dos direcciones

Hay **escasez global de GDDR7 y de RAM** en 2026, verificable en tres señales independientes:
la RTX PRO 6000 subió **55 % en 16 meses**, Apple **retiró** la Mac Studio de 512 GB, y el Mac
Mini base **subió** de 599 a 799 dólares.

- **A favor:** el inventario se aprecia mientras está en tránsito, y el que tiene stock manda.
- **En contra:** conseguir **allocation de fábrica siendo un comprador nuevo y chico es
  difícil** justo cuando hay escasez. Es la razón principal por la que T2 (fabricantes chinos
  de mini PC, no NVIDIA ni Apple) es más realista que T3/T5.

---

## 5. Qué sigue

1. Elegir **1 modelo de T2 y 1 de T0** para cotizar — no cinco.
2. Aplicar el checklist fábrica-vs-trader (`playbook §4.6`) a GMKtec, Nimo y Beelink:
   licencia comercial en GSXT, **CE a nombre de la fábrica**, licencia de exportación propia.
3. Muestra pagada de 2 unidades por courier aéreo, probadas con nuestro stack antes de
   cualquier volumen.
4. Pedir a la despachante **clasificación arancelaria por escrito** de las dos categorías.

---

## Fuentes

- [Guía de hardware para LLM local 2026 — DigitalApplied](https://www.digitalapplied.com/blog/best-hardware-run-local-ai-models-2026-price-brackets-guide) ·
  [Compute Market](https://www.compute-market.com/blog/best-gpu-for-ai-2026) ·
  [PromptQuorum](https://www.promptquorum.com/local-llms/local-llm-hardware-guide-2026)
- [Strix Halo para LLM local — RunAIHome](https://runaihome.com/blog/ryzen-ai-max-395-strix-halo-local-llm-2026/) ·
  [TerminalBytes mini PCs](https://terminalbytes.com/best-mini-pc-for-local-llm-2026/) ·
  [Nimo AI Mini PC](https://www.nimopc.com/products/nimo-ai-mini-pc-amd-ryzen-ai-max-395-128gb-ram)
- [RTX PRO 6000 a USD 13.250 — VideoCardz](https://videocardz.com/newz/nvidia-now-lists-rtx-pro-6000-blackwell-96gb-gpu-at-13250) ·
  [Thunder Compute (ago-2026)](https://www.thundercompute.com/blog/nvidia-rtx-pro-6000-pricing) ·
  [RTX PRO 6000 vs H200](https://shadeform.com/directory/gpus/compare/H200/RTXPro6000)
- [Jetson Orin Nano Super USD 249 — NVIDIA](https://blogs.nvidia.com/blog/jetson-generative-ai-supercomputer)
- [Mac para IA local — LocalAIMaster](https://localaimaster.com/blog/apple-silicon-ai-buying-guide) ·
  [Codersera](https://codersera.com/blog/mac-as-a-local-llm-server-2026/)
- [Precio servidor 8× H200 — Mercatus](https://www.mercatus-ai.com/blog/h200-server-price) ·
  [8× B200](https://www.mercatus-ai.com/blog/b200-server-price) ·
  [Blackwell pricing 2026](https://tech-insider.org/nvidia-blackwell-gpu-pricing/)
