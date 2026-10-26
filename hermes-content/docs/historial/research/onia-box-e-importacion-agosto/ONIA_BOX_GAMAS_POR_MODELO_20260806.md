# Onia Box — gamas por modelo, para quién, y qué tan funcional es cada una (2026-08-06)

Sexta parte. Define las gamas medibles, a quién van, y **el hallazgo que parte el producto en
dos**.

---

## 1. Primero: hay DOS velocidades, no una

Todo el mundo mira "tokens por segundo" como si fuera un número. Son dos, y miden cosas
opuestas:

| Métrica | Qué mide | Cuándo importa |
|---|---|---|
| **Prefill / prompt processing** (`pp`) | Qué tan rápido **lee** el contexto que le das | **Documentos largos, RAG, agentes.** Define el tiempo hasta la primera palabra |
| **Generación** (`tg`) | Qué tan rápido **escribe** la respuesta | **Chat.** Define si se siente ágil |

**Prefill es compute-bound. Generación es bandwidth-bound.** Por eso una máquina puede ser
excelente en una y mala en la otra.

---

## 2. 🔴 El hallazgo que cambia el producto

| | **Strix Halo** | **DGX Spark / GB10** |
|---|---|---|
| **Prefill** | **340 t/s** | **1.723 t/s** (otra medición: 2.817) |
| **Generación** | **86–103 t/s** (Qwen3 30B-A3B) | 38,55 t/s |
| Ancho de banda | 256 GB/s | 273 GB/s |
| Precio | ~USD 2.000 | 2.999–4.699 |

**Son ~5× de diferencia en prefill, y ~2,5× al revés en generación.**

> *"Una ventaja de 5× en prefill es la diferencia entre esperar 3 segundos y esperar 15, en
> cada turno."*

Y el titular de Notebookcheck lo resume: *"supercomputadora de IA de USD 4.000 desafiada por
mini PC de USD 2.199 con mejor rendimiento en tiempo real"*.

### La conclusión

**No hay una caja mejor. Hay dos cajas para dos trabajos distintos.**

- **Strix Halo = conversar.** Escribe rapidísimo, lee lento.
- **GB10 = leer.** Digiere documentos largos, escribe más lento.

Eso mapea exactamente sobre nuestras tandas, y **es la razón por la que el catálogo tiene que
tener las dos**.

[DGX Spark vs Strix Halo — Remio](https://www.remio.ai/post/nvidia-dgx-spark-vs-amd-strix-halo-the-128gb-local-ai-showdown) ·
[El problema del prefill — Medium](https://medium.com/@Micheal-Lanham/a-1-500-box-generates-as-fast-as-the-4-699-dgx-spark-then-the-agent-hits-prefill-749afe944ee0) ·
[Primeros benchmarks DGX Spark](https://www.hardware-corner.net/first-dgx-spark-llm-benchmarks/) ·
[Notebookcheck](https://www.notebookcheck.net/Nvidia-DGX-Spark-vs-AMD-Strix-Halo-4-000-AI-supercomputer-challenged-by-2-199-mini-PC-with-better-real-time-performance.1159829.0.html)

---

## 3. El truco que hace funcionar al Strix Halo: modelos MoE

Un modelo **MoE** (mezcla de expertos) tiene muchos parámetros pero **activa sólo una
fracción** en cada token. Eso lo hace rápido en hardware con poco cómputo — exactamente el
perfil del Strix Halo.

**Números medidos en Strix Halo:**

| Modelo | pp512 | tg128 | Lectura |
|---|---|---|---|
| **Qwen3 30B-A3B MoE Q4_K_M** | **1.142 t/s** | **86,1 t/s** | ⭐ **El sweet spot.** 30B de conocimiento, sólo 3B activos |
| Qwen3-30B-A3B-Instruct | — | 100–103 t/s | Confirmado en otra build |
| LFM2.5 8B-A1B Q4_K_M | — | **169–170 t/s** | Modelo chico, velocísimo |
| Qwen3-Coder | — | **101 t/s** | Para la tanda Taller |

> Fijate la diferencia: el mismo Strix Halo hace **1.142 t/s de prefill con un MoE de 3B
> activos**, y **340 t/s con modelos densos**. **La elección del modelo importa más que la
> elección de la máquina.**

**Y el backend también:** *Vulkan AMDVLK es el campeón en generación; ROCm 7.x nightlies sigue
siendo el mejor en prompt processing.* O sea: **se elige backend según la tanda**, no uno para
todo.

[Strix Halo Wiki — rendimiento llama.cpp](https://strixhalo.wiki/AI/llamacpp-performance) ·
[llm-tracker — Strix Halo GPU performance](https://llm-tracker.info/AMD-Strix-Halo-(Ryzen-AI-Max+-395)-GPU-Performance) ·
[strix-halo-guide](https://github.com/hogeheer499-commits/strix-halo-guide) ·
[strix-halo-llm-perf](https://github.com/visorcraft/strix-halo-llm-perf)

---

## 4. Las gamas — modelo, máquina, para quién, y qué tan funcional

### Gama 1 — **Onia Vista**
| | |
|---|---|
| **Modelo** | Visión ≤ 3B cuantizado |
| **Máquina** | Jetson Orin Nano Super 8 GB — **USD 249** |
| **Métrica objetivo** | Cuadros por segundo, no tok/s |
| **Para quién** | Ferretería, depósito, planta, retail, parqueos |
| **Caso de uso** | Conteo de stock, control de calidad, seguridad, lectura de placas |
| **Funcionalidad** | ✅ **Alta para lo que hace.** No intentes chat serio acá |
| **Precio** | USD 900–1.400 |

### Gama 2 — **Onia Recepción** ⭐ la más vendible
| | |
|---|---|
| **Modelo** | **Qwen3 8–14B**, o **LFM2.5 8B-A1B** para velocidad extrema |
| **Máquina** | **Strix Halo 96–128 GB** |
| **Métrica esperada** | **generación 100–170 t/s** · prefill suficiente (contextos cortos) |
| **Para quién** | Clínica, consultorio, comercio, estudio chico, inmobiliaria |
| **Caso de uso** | Atiende WhatsApp 24/7, agenda, responde precios y horarios, deriva |
| **Funcionalidad** | ✅✅ **Muy alta.** El chat es generación-dominante y acá el Strix Halo brilla. **Escribe más rápido de lo que el cliente lee** |
| **Precio** | USD 3.500–4.500 |

### Gama 3 — **Onia Expediente**
| | |
|---|---|
| **Modelo** | **Qwen3 30B-A3B MoE** (no denso — el MoE es lo que lo hace viable) |
| **Máquina** | **Strix Halo 128 GB** si los documentos son medianos · **GB10** si son largos |
| **Métrica crítica** | **PREFILL.** Con MoE en Strix Halo: 1.142 t/s. Con modelo denso: 340 t/s |
| **Para quién** | **Estudio jurídico, clínica, contable, notaría** |
| **Caso de uso** | Lee y resume expedientes, contratos, historias clínicas — sin que salgan del edificio |
| **Funcionalidad** | ⚠️ **Alta con MoE, mediocre con modelo denso.** Y si el cliente sube 200 páginas por consulta, el GB10 gana claramente |
| **Precio** | USD 5.500–7.000 (Strix) · 7.000–9.000 (GB10) |

### Gama 4 — **Onia Taller**
| | |
|---|---|
| **Modelo** | **Qwen3-Coder** — 101 t/s medidos en Strix Halo |
| **Máquina** | Strix Halo 128 GB · o RTX 5090 si se quiere más velocidad |
| **Para quién** | Software factory, departamento de sistemas, agencias |
| **Caso de uso** | Asistente de código privado sobre repositorio propio |
| **Funcionalidad** | ✅ **Alta.** 101 t/s es cómodo para asistencia de código |
| **Precio** | USD 6.000–8.000 |

### Gama 5 — **Onia Central**
| | |
|---|---|
| **Modelo** | 70B denso en FP16, o MoE clase 120B |
| **Máquina** | RTX PRO 6000 96 GB, o multi-GPU |
| **Nota** | **Arriba de 10 usuarios concurrentes hay que pasar de Ollama a vLLM** |
| **Para quién** | Empresa con varias sucursales, cooperativa, financiera |
| **Funcionalidad** | ✅ Alta, pero ticket de USD 22.000+ y mercado muy chico en Bolivia |

---

## 5. Resumen: quién compra qué

| Perfil | Gama | Por qué |
|---|---|---|
| **Estudio jurídico** | Expediente (GB10 si son expedientes largos) | Secreto profesional + documentos pesados |
| **Clínica / consultorio** | Recepción, después Expediente | Ya les vendemos software; historia clínica es dato sensible |
| **Contable / auditora** | Expediente | Volumen alto de documentos de terceros |
| **Comercio / ferretería** | Recepción + Vista | Atención y control de stock |
| **Software factory** | Taller | Código privado |
| **Financiera / cooperativa** | Central | Regulación ASFI, multiusuario |
| **Depósito / planta** | Vista | Sólo visión |

---

## 6. Cómo lo medimos — protocolo de las dos semanas

Cuando llegue la unidad, esto es lo que hay que correr y anotar. **Sin estos números no hay
argumento de venta.**

### Banco de pruebas
`llama-bench` genera **pp512** y **tg128** por defecto, corriendo **5 veces** cada test. Ese es
el estándar contra el cual comparar los números publicados de arriba.

### Matriz a completar

| Modelo | Backend | pp512 | tg128 | ¿Coincide con lo publicado? |
|---|---|---|---|---|
| Qwen3 8B | Vulkan AMDVLK | | | |
| Qwen3 8B | ROCm | | | |
| **Qwen3 30B-A3B MoE** | Vulkan AMDVLK | | | esperado ~1.142 / ~86 |
| **Qwen3 30B-A3B MoE** | ROCm | | | |
| Qwen3-Coder | mejor de los dos | | | esperado ~101 tg |
| Qwen3 70B denso | mejor de los dos | | | esperado prefill bajo |

### Prueba de mundo real (más importante que el benchmark)

1. **Documento de 20 páginas** → cuántos segundos hasta la primera palabra. Ese número **es**
   la experiencia del cliente en la gama Expediente.
2. **Documento de 200 páginas** → ¿aguanta o se cae?
3. **Conversación de WhatsApp** de 30 turnos → ¿se mantiene ágil?
4. **Prueba de estrés térmico**: carga sostenida 4 horas. Medir temperatura, ruido y si
   throttlea. **Santa Cruz es caliente — esto no es opcional.**
5. **Prueba de rotura**: actualizar firmware a propósito, romper ROCm, y **medir cuánto tardás
   en revertir**. Si no podés revertir en menos de 30 minutos, no está listo para vender.

---

## 7. Lo que decide

**El catálogo necesita dos máquinas, no una:**

- **Strix Halo** para las gamas **Recepción, Taller** y **Expediente con documentos medianos**
  — más barata y se compra directo de fábrica.
- **GB10** para **Expediente con documentos largos y agentes** — más cara, canal OEM, pero 5×
  en prefill.

**Y el modelo pesa más que la máquina:** el mismo Strix Halo pasa de 340 a 1.142 t/s de prefill
según se use denso o MoE. **Qwen3 30B-A3B es la pieza clave del producto.**

---

## Fuentes

- [Strix Halo Wiki — llama.cpp performance](https://strixhalo.wiki/AI/llamacpp-performance) · [llm-tracker](https://llm-tracker.info/AMD-Strix-Halo-(Ryzen-AI-Max+-395)-GPU-Performance)
- [strix-halo-guide (GitHub)](https://github.com/hogeheer499-commits/strix-halo-guide) · [strix-halo-llm-perf (GitHub)](https://github.com/visorcraft/strix-halo-llm-perf)
- [DGX Spark vs Strix Halo — Remio](https://www.remio.ai/post/nvidia-dgx-spark-vs-amd-strix-halo-the-128gb-local-ai-showdown) · [Hardware-Corner](https://www.hardware-corner.net/first-dgx-spark-llm-benchmarks/) · [The Register](https://www.theregister.com/2025/12/25/amd_strix_halo_nvidia_spark/)
- [El muro del prefill — Medium](https://medium.com/@Micheal-Lanham/a-1-500-box-generates-as-fast-as-the-4-699-dgx-spark-then-the-agent-hits-prefill-749afe944ee0) · [Notebookcheck](https://www.notebookcheck.net/Nvidia-DGX-Spark-vs-AMD-Strix-Halo-4-000-AI-supercomputer-challenged-by-2-199-mini-PC-with-better-real-time-performance.1159829.0.html)
- [DGX Spark alternatives — AIMultiple](https://aimultiple.com/dgx-spark-alternatives)
