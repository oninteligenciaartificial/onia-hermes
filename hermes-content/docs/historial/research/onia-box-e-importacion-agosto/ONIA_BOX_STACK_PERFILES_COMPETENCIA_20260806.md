# Onia Box — stack, qué más corre, perfiles de comprador y competencia (2026-08-06)

Quinta parte. Cuatro respuestas: **el stack completo**, **qué más se puede correr en la caja**
(que resulta ser lo más importante), **quién compra IA privada**, y **qué productos ya existen**.

---

## 1. El stack — capa por capa, con nombres concretos

Buena noticia del estado del arte: *"correr tu propio stack de IA ya no es un proyecto sólo
para equipos de investigación; con Ollama, Open WebUI, n8n y Qdrant maduros, un equipo con
DevOps básico lo levanta en un fin de semana"*.

| # | Capa | Qué se usa | Nota |
|---|---|---|---|
| 1 | **Sistema base** | Linux, **kernel ≥ 6.18.4** | Los anteriores rompen en gfx1151 |
| 2 | **Firmware** | Versión validada — **evitar `linux-firmware-20251125`** | Rompe ROCm en Strix Halo |
| 3 | **Cómputo** | ROCm donde rinda; Vulkan de respaldo | Medir, no asumir |
| 4 | **Contenedores** | Docker / Podman | Base para poder revertir |
| 5 | **Servidor de modelos** | **Ollama** (API compatible OpenAI) · **vLLM** si hay **más de 10 usuarios concurrentes** | Ollama maneja descarga, cuantización y servicio |
| 6 | **Modelo** | **Qwen3** (8–14B / 30B / 70B según tanda) | Apache 2.0, fuerte en español |
| 7 | **Vector store (RAG)** | **Qdrant** | Donde viven los documentos del cliente |
| 8 | **Parseo de documentos** | **Apache Tika** | Extrae texto de PDF, Word y planillas para embeber |
| 9 | **Interfaz** | **Open WebUI** (o AnythingLLM) | Trae RAG integrado |
| 10 | **Automatización** | **n8n** autohospedado, con nodos LLM nativos | **Ya lo usamos** |
| 11 | **Acceso remoto** | Tailscale / WireGuard | **Sin esto no hay soporte, y sin soporte no hay recurrente** |
| 12 | **Monitoreo** | Temperatura, disco, uso, alertas **hacia nosotros** | Enterarnos antes que el cliente |
| 13 | **Imagen** | **Congelada y versionada por ONIA** | Nunca `apt upgrade` libre |

[Stack autohospedado 2026 — MeshWorld](https://meshworld.in/blog/ai/self-hosted-ai-stack-2026/) ·
[Deep dive James Kilby](https://jameskilby.co.uk/2026/03/my-self-hosted-ai-stack-a-technical-deep-dive/) ·
[Open WebUI vs AnythingLLM](https://wz-it.com/en/blog/open-webui-vs-anythingllm-comparison/)

---

## 2. 🎯 Qué MÁS corre en la caja — esto cambia el producto entero

La caja tiene **16 núcleos Zen 5, 128 GB y almacenamiento propio**. Dedicarla sólo a un LLM es
desperdiciar el 70 % de la máquina.

**Y acá está lo importante: cada pieza de abajo ya la tenemos corriendo en otro lado.**

| Qué corre | Qué resuelve al cliente | ¿Ya lo tenemos? |
|---|---|---|
| **ONIA Platform** (on-premise) | Su sistema de gestión completo, en su oficina | ✅ en producción |
| **Chatwoot** | Canal del chatbot, atención unificada | ✅ corre en el VPS |
| **n8n** | Todas sus automatizaciones internas | ✅ 11 workflows en vivo |
| **PostgreSQL / Supabase** | Su base de datos | ✅ |
| **Speaches / Whisper** | Transcripción de audio y llamadas | ✅ ya lo usamos |
| **TTS local** (Piper, Kokoro) | Voz sintética sin API paga | — |
| **Qdrant + Tika** | Buscar dentro de todos sus documentos | — |
| **Visión** (YOLO) | Cámaras, conteo, control de calidad | — |
| **Backup / NAS** | Copia de seguridad local | — |
| **Facturación SIAT** | Emisión electrónica local | ✅ integrations/siat |

### La consecuencia comercial

**Vender "una caja de IA" por USD 6.000 es una venta difícil.** El cliente compara contra
ChatGPT a 20 dólares al mes y pierde.

**Vender "toda tu infraestructura digital, en tu oficina, tuya" por USD 6.000 es otra venta.**
Ahí compite contra: el sistema de gestión que paga por mes + el chatbot + el hosting + el
backup + las APIs de IA. Todo junto, y sin que nada salga del edificio.

**Ese es el pitch.** Y no requiere construir nada nuevo: es empaquetar lo que ONIA ya tiene
corriendo, en un fierro que el cliente es dueño.

---

## 3. Perfiles — quién compra IA privada

### Lo que dicen los datos globales

Los cuatro verticales que traccionan IA soberana son **banca y servicios financieros, seguros,
gobierno y salud**. Se suman **servicios jurídicos** y **administración pública**.

El dato que más pesa:

> **El 55 % de las empresas evita ciertos casos de uso de IA por preocupaciones de seguridad
> de datos en la nube** — no porque la tecnología falle, sino porque **no pueden demostrarle
> control suficiente al regulador**.

Eso no es una objeción de precio. Es demanda reprimida esperando una solución que puedan
auditar.

[Guía de IA soberana 2026 — Lyzr](https://www.lyzr.ai/blog/sovereign-ai/) ·
[IA on-premise en industrias reguladas — Visure](https://visuresolutions.com/ai-engineering/on-premise-ai-regulated-industries/) ·
[Cuándo tiene sentido on-premise](https://aihive.global/blog/on-premise-ai/)

### Mapeado a Santa Cruz — por prioridad

| # | Perfil | Por qué compra | Tamaño de mercado local |
|---|---|---|---|
| **1** | **Estudios jurídicos** | Secreto profesional. **No pueden** subir expedientes a un servidor extranjero | Alto — Santa Cruz concentra los grandes |
| **2** | **Clínicas y consultorios** | Historia clínica = dato sensible. Ya les vendemos software | Alto — **y ya tenemos el producto dental** |
| **3** | **Estudios contables y auditoras** | Datos fiscales de terceros. Volumen alto de documentos | Alto |
| **4** | **Financieras, cooperativas, casas de cambio** | Regulación ASFI, datos de clientes | Medio — ciclo de venta largo |
| **5** | **Notarías** | Documentos de fe pública | Medio |
| **6** | **Empresas con I+D o fórmulas propias** | Propiedad intelectual | Bajo pero alto ticket |
| **7** | **Importadoras y despachantes** | Volumen de documentos, datos de proveedores | Medio — **y lo vamos a conocer desde adentro** |

**El nº7 es interesante:** al hacer nuestra propia importación vamos a vivir el problema de
procesar facturas, DUIs y packing lists. Ese dolor propio es el mejor prototipo de producto.

---

## 4. Qué productos ya existen — la competencia real

### Turnkey "IA en una caja" (ya existe como categoría)

| Producto | Qué ofrece |
|---|---|
| **LLM.co — "LLM-in-a-Box"** | Appliance preconfigurado y preentrenado, on-premise, offline, detrás del firewall |
| **Zanus AI** | Servidores locales llave en mano, RAG sobre documentos internos, costos predecibles |
| **Petronella** | Modelos open-weights dentro de perímetros regulados |
| **AAEON BOXER** | Jetson AGX Orin, fuerte en **verticales médico y seguridad** |
| **IEI · OnLogic** | Appliances industriales de inferencia en el borde |
| Microsoft **Azure Stack Edge** · Google **Distributed Cloud** · **NVIDIA Equinix Private AI** | Versión corporativa grande |

### 💰 El dato de pricing que valida el nuestro

> **Un servidor privado de LLM de gama de entrada arranca en USD 8.000–12.000.**

Nuestro **Onia Expediente a USD 5.500–7.000 queda por debajo del piso de mercado
internacional** — y con instalación, configuración y soporte local incluidos, que ningún
proveedor extranjero da en Bolivia.

**No hay que inventar el precio: hay que entrar por abajo del piso conocido.**

[11 mejores appliances de IA privada — Iternal](https://iternal.ai/best-private-ai-appliances) ·
[LLM.co Box](https://llm.co/box) · [Zanus AI](https://zanusai.com/collections/private-ai-servers) ·
[Guía de despliegue privado — Petronella](https://petronellatech.com/blog/private-ai-deployment-guide-enterprise/)

---

## 5. ⚠️ Apareció un competidor directo del Strix Halo: el ecosistema GB10

**Ocho fabricantes venden esencialmente la misma máquina** con el superchip NVIDIA GB10:
NVIDIA (DGX Spark FE), **ASUS (Ascent GX10)**, Dell (Pro Max GB10), HP (ZGX Nano G1n), Lenovo
(ThinkStation PGX), MSI (EdgeXpert MS-C931), Gigabyte (AI TOP Atom) y Acer (Veriton GN100).

| Equipo | Precio |
|---|---|
| **MSI / ASUS / Dell (1 TB)** | **desde USD 2.999** |
| NVIDIA DGX Spark Founders | **4.699** (subió 18 % por escasez de memoria) |
| HP ZGX Nano G1n | ~6.030 |
| Lenovo ThinkStation PGX | S$ 7.555–9.900 |

**El ASUS Ascent GX10 corre el mismo silicio GB10 por USD 1.700 menos que el DGX Spark.**

### La comparación honesta

| | **Strix Halo 128 GB** | **GB10 (ASUS GX10)** |
|---|---|---|
| Precio | **~USD 2.000** | ~USD 2.999 |
| Memoria | 128 GB unif. · ~256 GB/s | 128 GB unif. · ~273 GB/s |
| Ecosistema | **ROCm — frágil**, Vulkan deja ~56 % | **CUDA — maduro** |
| Compra directa de fábrica | ✅ Beelink, GMKtec, Minisforum | ❌ canal OEM |
| Modelos | 70B completo | hasta 200B según NVIDIA |

**Strix Halo gana en precio y en cumplir la regla de comprar de fábrica.
GB10 gana en madurez de software, que es exactamente donde está nuestro riesgo (§ ROCm).**

**No lo resuelvo en papel.** Es la pregunta que la unidad de prueba tiene que contestar: si el
stack en Strix Halo aguanta dos semanas sin romperse, la diferencia de USD 1.000 por unidad
justifica quedarse. Si no aguanta, GB10 es más caro pero vendible — y ahí habría que revisar la
regla de compra directa para este producto puntual.

---

## 6. Lo que cambia de todo esto

1. **El producto no es una caja de IA. Es la infraestructura digital del cliente, on-premise.**
   Y ya tenemos casi todas las piezas corriendo.
2. **El precio está validado por abajo**: el piso internacional es USD 8.000–12.000; entramos a
   5.500–7.000 con soporte local.
3. **El comprador nº1 son los estudios jurídicos**, seguidos de clínicas — donde ya tenemos
   producto.
4. **La categoría ya existe afuera** (LLM.co, Zanus, AAEON), lo que prueba mercado — **y no
   está en Bolivia**.
5. **La decisión Strix Halo vs GB10 la define la unidad de prueba**, no más investigación.

---

## Fuentes

- [Stack autohospedado 2026 — MeshWorld](https://meshworld.in/blog/ai/self-hosted-ai-stack-2026/) · [James Kilby deep dive](https://jameskilby.co.uk/2026/03/my-self-hosted-ai-stack-a-technical-deep-dive/) · [Open WebUI vs AnythingLLM](https://wz-it.com/en/blog/open-webui-vs-anythingllm-comparison/)
- [IA soberana — Lyzr](https://www.lyzr.ai/blog/sovereign-ai/) · [Industrias reguladas — Visure](https://visuresolutions.com/ai-engineering/on-premise-ai-regulated-industries/) · [On-premise: costos y tradeoffs](https://aihive.global/blog/on-premise-ai/)
- [Appliances de IA privada — Iternal](https://iternal.ai/best-private-ai-appliances) · [LLM.co Box](https://llm.co/box) · [Zanus AI](https://zanusai.com/collections/private-ai-servers) · [Petronella](https://petronellatech.com/blog/private-ai-deployment-guide-enterprise/)
- [Guía GB10 — SourceIT](https://sourceit.com.sg/blogs/news/nvidia-gb10-dgx-spark-buyers-guide-singapore) · [GB10 vs Strix Halo — InsiderLLM](https://insiderllm.com/guides/gb10-boxes-compared/) · [ASUS GX10](https://kernelsparks.com/posts/why-asus-gx10-best-gb10/) · [Dell Pro Max GB10 — ITPro](https://www.itpro.com/hardware/desktops/the-dell-pro-max-with-gb10-is-the-most-sophisticated-mini-ai-workstation-you-can-get-but-also-the-most-pricy)
