# Onia Box — marca propia, casos de uso y viabilidad real (2026-08-06)

Tercera parte de la serie de importación. Responde cuatro preguntas de Sergio: **qué marcas
aguantan en uso real**, **qué cuesta venderlo con marca propia**, **qué modelos de IA entran en
cada equipo**, y **qué tan viable es como producto**.

Antecedentes: `ONIA_LISTA_EQUIPOS_IA_LOCAL_20260806.md` · `ONIA_SOURCING_ARMADO_IA_LOCAL_20260806.md`

---

## 1. Las marcas, según uso real (no folletos)

Todas montan el **mismo** Ryzen AI Max+ 395. Lo que las diferencia es chasis, disipación,
red y firmware.

| Equipo | Precio | Lo que dice el uso real | Veredicto |
|---|---|---|---|
| **GMKtec EVO-X2** | USD 2.349 (96 GB) – 3.299 (128 GB) | **Es el que más compró r/LocalLLaMA.** Contra: **ruidoso bajo carga sostenida** | Referencia del mercado, pero el ruido molesta en oficina |
| **Beelink GTR9 Pro** | ~USD 1.985 preventa · 2.399 lista | Mismo chip, **mejores térmicas**, chasis más grande, **dual 10 GbE**. Reseñado por ServeTheHome | ✅ **El mejor candidato para oficina** |
| **Minisforum MS-S1 Max** | — | Llegando; además **saca placa Mini-ITX suelta** | ✅ Interesante por la placa suelta |
| **Framework Desktop** | USD 1.999 (128 GB) · ~2.500 completo | **Vende el mainboard suelto**, se envía como kit DIY | ✅ Para la vía "importar sólo la placa" |
| Morefine H1 · Sixunited AXB88 · AOOSTAR | — | Alternativas; AXB88 destaca por chasis muy chico | Segunda vuelta |

**Dato de capacidad que importa para el pricing:** el SKU de **96 GB** maneja hasta **30B Q8 y
70B Q4**; el de **128 GB** da **headroom completo de 70B más el sistema operativo y media
docena de contenedores Docker**. Esa diferencia — poder correr el modelo *y* la plataforma en
la misma caja — justifica ir a 128 GB y no ahorrar en el SKU chico.

[ServeTheHome — Beelink GTR9 Pro](https://www.servethehome.com/beelink-gtr9-pro-review-amd-ryzen-ai-max-395-system-with-128gb-and-dual-10gbe/) ·
[TerminalBytes — mejores mini PC para LLM local](https://terminalbytes.com/best-mini-pc-for-local-llm-2026/) ·
[Comparativa ComputingForGeeks](https://computingforgeeks.com/ryzen-ai-max-395-mini-pc-comparison/)

---

## 2. Marca propia — es más barato de lo que parece

El mercado ya funciona así: en 2025 se despacharon **28 millones de mini PCs** (+23 % interanual)
y **más del 70 % los diseñan y fabrican ODM chinos**. Las marcas que ves en la góndola son, en
su mayoría, marca puesta sobre diseño ajeno.

### Qué se puede personalizar

Hardware, **BIOS, sistema operativo, logo, packaging** — incluido el **logo de arranque del
BIOS**, grabado láser en el chasis y diseño de caja.

### Lo que cuesta

| Nivel | Qué incluye | MOQ | Costo |
|---|---|---|---|
| **Marca ligera** ✅ | Logo grabado, packaging propio, imagen de sistema propia | **Algunos proveedores arrancan en 5 unidades** y dan muestras | Marginal |
| Marca completa | + **BIOS custom** (logo de arranque, PXE, watchdog, encendido programado) | 500–1.000 típico | **USD 2.800–11.000**, 3–5 semanas |

> **La decisión correcta al inicio es la marca ligera.** El BIOS custom no aporta nada que el
> cliente perciba, y cuesta más que el primer embarque entero. Logo + packaging + **la imagen
> de sistema con el stack de ONIA preinstalado** ya convierte una caja genérica en producto
> propio.

ODM profesionales mencionados como primera opción para marcas: **Adreamer, Giada, JWIPC,
Norco** — con líneas desde Intel N100 hasta Core Ultra y AMD Ryzen.

[Top ODM mini PC China](https://www.adreamertech.com/NewsDetail/6994904.html) ·
[Consideraciones OEM/ODM](https://www.adreamertech.com/NewsDetail/7115273.html) ·
[MOQ bajo](https://www.odmminipc.com/news/why-oem-odm-mini-pcs-from-china-are-a-smart-choice-for-global-buy/)

---

## 3. 🔴 El riesgo técnico que ningún vendedor te va a contar

Esto es lo más importante de todo el documento.

- **ROCm + Linux en Strix Halo recién se estabilizó en enero de 2026.**
- Requiere **kernel 6.18.4 o superior**. Los kernels anteriores **tienen inestabilidad en
  gfx1151**.
- **`linux-firmware-20251125` rompe ROCm en Strix Halo** y provoca inestabilidad y crashes.
- Donde ROCm todavía no cubre, se usa la ruta **Vulkan — que deja ~56 % del rendimiento en la
  mesa** frente a llama.cpp upstream.
- Del lado Windows, una actualización de driver subió el soporte de **70B a 128B parámetros**
  en Vulkan llama.cpp.

[ROCm estable ene-2026 — Framework Community](https://community.frame.work/t/linux-rocm-january-2026-stable-configurations-update/79876) ·
[Optimización Strix Halo — docs oficiales ROCm](https://rocm.docs.amd.com/en/docs-7.2.0/how-to/system-optimization/strixhalo.html) ·
[Brecha Vulkan ~56 % — issue ollama](https://github.com/ollama/ollama/issues/15601) ·
[toolboxes kyuz0](https://github.com/kyuz0/amd-strix-halo-toolboxes)

### Qué significa para el negocio

**Malo:** si vendés 20 cajas y una actualización de firmware rompe ROCm, tenés 20 clientes
caídos el mismo día. El soporte de esto no es trivial.

**Bueno — y es la clave del producto:** exactamente por eso el cliente **no puede hacerlo
solo**. La combinación kernel + firmware + toolbox + modelo, congelada, probada y actualizada
por nosotros, **es el producto**. El fierro es el envase.

**Regla operativa:** una imagen de sistema **congelada y versionada**, con actualizaciones
controladas por ONIA. Nunca `apt upgrade` libre en la caja de un cliente.

---

## 4. Qué modelos entran en cada equipo

**Regla de dimensionamiento:** ~**2 GB por cada mil millones de parámetros en FP16**, o
~**0,5 GB por cada mil millones en INT4**, más **15–20 %** para KV cache, activaciones y
overhead del framework.

| Equipo | Memoria | Qué corre bien |
|---|---|---|
| **Jetson Orin Nano Super** | 8 GB | Modelos de **3B y menores** cuantizados · visión · agentes visuales |
| RTX 5060 Ti / 5070 | 12–16 GB | **7–14B** (Phi-4 14B entra en 8 GB) |
| RTX 5080 | 16 GB | **14–32B** · **Gemma 3 27B** es el más fácil de autohospedar |
| **RTX 5090** | 32 GB | **32B Q4 en una tarjeta** · 70B Q4 con dos · ~200 tok/s |
| **Strix Halo 96 GB** | 96 GB unif. | **30B Q8** · **70B Q4** |
| **Strix Halo 128 GB** ⭐ | 128 GB unif. | **70B completo + SO + contenedores** · MoE de ~120B en Q4 (65–70 GB) |
| RTX PRO 6000 | 96 GB ECC | **Llama 3.3 70B en FP16** · MoE clase 109B en Q4 |

### Los modelos que valen en 2026

| Necesidad | Modelo | Nota |
|---|---|---|
| **Uso general local** | **Qwen3** | *La mejor familia para local*: calidad, tamaños variados, multilingüe (importa para español) y **licencia Apache 2.0** |
| Razonamiento tope | Qwen3 235B-A22B · GLM-5.1 · DeepSeek V4 Pro | Fuera del alcance de una caja sola |
| Matemática / razonamiento profundo | DeepSeek R1 | |
| Contexto largo | **Llama 4 Scout** | Hasta 10M tokens de contexto |
| **Código** | **Qwen3-Coder-480B** (69,6 % SWE-bench, Apache-2.0) | El grande no entra; sí las variantes chicas |
| GPU única, fácil | **Gemma 3 27B** (16 GB) · **Phi-4 14B** (8 GB) | |
| Clase 120B | gpt-oss-120B · Devstral-2 123B | **65–70 GB** → entra en 128 GB unificados |

**Para Bolivia, Qwen3 es la apuesta**: multilingüe fuerte en español y Apache 2.0, o sea que
se puede empaquetar y vender sin fricción de licencia.

[Mejores LLM open-weight 2026](https://www.buildfastwithai.com/blogs/collection/open-source-llms) ·
[Modelos para correr local](https://huggingface.co/blog/daya-shankar/open-source-llm-models-to-run-locally) ·
[Cheat sheet de VRAM](https://insiderllm.com/guides/vram-requirements-local-llms/) ·
[Calculadora de requisitos](https://llm-stats.com/blog/research/hardware-requirements-running-llms-locally)

---

## 5. Las tandas — vender caso de uso, no especificaciones

Nadie compra "128 GB de memoria unificada". Compran "que atienda WhatsApp sola".

| Tanda | Para quién | Qué hace | Modelo | Equipo | Precio objetivo |
|---|---|---|---|---|---|
| **Onia Vista** | Ferretería, depósito, planta, retail | Conteo, control de calidad, seguridad, cámaras | 3B + visión | Jetson | USD 900–1.400 |
| **Onia Recepción** | Clínica, estudio, comercio | Atiende WhatsApp 24/7, agenda, responde, deriva | 8–14B | Strix Halo 96 GB | USD 3.500–4.500 |
| **Onia Expediente** ⭐ | **Clínica, estudio jurídico, contable, financiera** | Lee y resume expedientes, contratos, historias clínicas — **sin que el dato salga del edificio** | 30–70B | **Strix Halo 128 GB** | USD 5.500–7.000 |
| **Onia Taller** | Software factory, dpto. de sistemas | Asistente de código privado sobre repo propio | Qwen3-Coder | RTX 5090 | USD 6.000–8.000 |
| **Onia Central** | Empresa con varias sucursales | Sirve a toda la red, multiusuario | 70B FP16 | RTX PRO 6000 | USD 22.000+ |

Precios objetivo **a validar contra costeo real** — todavía no hay cotización de fábrica.

**La tanda estrella es Onia Expediente**, y no por potencia: es la única donde el argumento de
compra **no es el precio sino la obligación**. Un estudio jurídico o una clínica **no puede**
mandar sus expedientes a un servidor extranjero. Ahí no competís contra ChatGPT: competís
contra "no poder hacerlo".

---

## 6. Viabilidad — la parte honesta

### Lo que juega a favor

1. **Nadie lo vende en Bolivia.** No encontré competencia local en IA on-premise.
2. **Privacidad como obligación, no preferencia** — salud, legal, contable. Es el único
   argumento que no depende del precio.
3. **La escasez de dólares** hace doler el gasto recurrente en APIs extranjeras. Un capex en
   bolivianos, una vez, es más fácil de aprobar que un gasto mensual en USD.
4. **ONIA ya tiene el software.** La caja es el vehículo de algo que ya existe, no un producto
   nuevo desde cero.
5. **Ticket de USD 3.000–7.000** contra un SaaS de Bs 300/mes: cambia la escala del negocio.

### Lo que juega en contra

1. **El argumento de ahorro casi nunca cierra.** Una caja de USD 3.000 equivale a **años** de
   API al volumen de una PYME boliviana. **Si vendés "ahorrás en tokens", perdés** — el
   cliente hace la cuenta y no da.
2. **El comprador real es de nicho**, no cualquier PYME. Es el que tiene datos que no pueden
   salir, o volumen alto de inferencia.
3. **Riesgo de soporte alto** — ver §3. Frágil de un modo que el cliente no entiende y te va a
   reclamar a vos.
4. **Los modelos avanzan rápido.** La caja de hoy corre los modelos de hoy; en 18 meses puede
   quedar corta. Hay que decirlo en la venta, no esconderlo.
5. **El cliente boliviano típico no tiene quién administre un servidor.** El soporte remoto es
   obligatorio, y eso es costo fijo.

### Veredicto

**Viable como producto de nicho y alto ticket. No viable como producto masivo.**

Y eso está bien: 20 clientes de USD 5.000 con mensual de soporte es mejor negocio que 200 de
Bs 300. **Pero exige elegir el nicho y no intentar venderle a todos.**

**El nicho es: quien tiene una obligación de confidencialidad.** Clínicas, estudios jurídicos,
contables, financieras. El pitch no es "IA más barata" — es **"IA sin que tus datos salgan de
tu oficina"**.

---

## 7. Recomendación

1. **Producto principal: Onia Expediente** sobre Strix Halo **128 GB** con marca propia ligera.
2. **Equipo base a cotizar: Beelink GTR9 Pro** (mejores térmicas para oficina) y **Minisforum /
   Framework** por la vía de placa suelta. Al **EVO-X2** tenerlo como referencia de precio, pero
   el ruido bajo carga es un problema real en oficina.
3. **Marca ligera, no BIOS custom.** Logo, packaging e **imagen de sistema con el stack de ONIA**
   preinstalado. MOQ bajo y costo marginal.
4. **Modelo por defecto: Qwen3** — multilingüe fuerte en español y Apache 2.0.
5. **Congelar la configuración** (kernel ≥ 6.18.4 + firmware validado + toolbox) y versionarla.
   **Nunca dejar que el cliente actualice solo.**
6. **Antes de cualquier embarque: una unidad de prueba** corriendo el stack real durante dos
   semanas. El riesgo de §3 no se evalúa leyendo, se evalúa usando.
7. **Validación comercial: 5 conversaciones** con estudios jurídicos y clínicas de Santa Cruz.
   Una pregunta: *"¿hay información de tus clientes que no podrías subir a un servicio
   extranjero?"* Si la respuesta es sí y les duele, hay producto.

---

## Fuentes

- [ServeTheHome — Beelink GTR9 Pro](https://www.servethehome.com/beelink-gtr9-pro-review-amd-ryzen-ai-max-395-system-with-128gb-and-dual-10gbe/)
- [TerminalBytes — mini PC para LLM local 2026](https://terminalbytes.com/best-mini-pc-for-local-llm-2026/)
- [ComputingForGeeks — comparativa Ryzen AI Max+ 395](https://computingforgeeks.com/ryzen-ai-max-395-mini-pc-comparison/)
- [Adreamer — ODM mini PC y customización](https://www.adreamertech.com/NewsDetail/7115273.html) · [Top 10 ODM](https://www.adreamertech.com/NewsDetail/6994904.html)
- [Framework Community — ROCm estable ene-2026](https://community.frame.work/t/linux-rocm-january-2026-stable-configurations-update/79876)
- [ROCm docs — optimización Strix Halo](https://rocm.docs.amd.com/en/docs-7.2.0/how-to/system-optimization/strixhalo.html)
- [Issue ollama — brecha Vulkan ~56 %](https://github.com/ollama/ollama/issues/15601)
- [Mejores LLM open source 2026](https://www.buildfastwithai.com/blogs/collection/open-source-llms) · [para correr local](https://huggingface.co/blog/daya-shankar/open-source-llm-models-to-run-locally)
- [InsiderLLM — VRAM por modelo](https://insiderllm.com/guides/vram-requirements-local-llms/) · [llm-stats — cálculo de hardware](https://llm-stats.com/blog/research/hardware-requirements-running-llms-locally)
