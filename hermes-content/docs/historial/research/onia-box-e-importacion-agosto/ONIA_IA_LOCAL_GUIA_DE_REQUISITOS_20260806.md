# Guía de requisitos para IA local — estado al 6 de agosto de 2026

**Para qué sirve este documento:** es la herramienta de campo. Con esto se puede entrar a la
oficina de un cliente, mirar qué tiene, y decirle en el momento qué modelo le corre y para qué
le sirve.

⚠️ **Este documento tiene fecha.** El hardware y los modelos cambian rápido. Revisar cada
3 meses.

---

## 0. Para qué sirve cada pieza — el recorrido completo

**Esta es la explicación para usar frente a un cliente.** Un LLM solo no sirve de nada: sin las
otras piezas es "ChatGPT sin internet", un chat que no conoce ni un documento de la oficina.
**Lo que se vende no es el modelo — es que sepa lo que hay adentro de esa oficina.**

### El caso: un abogado escribe

> *"¿Qué dice el contrato con Ferretería Vargas sobre la penalidad por atraso?"*

#### Antes — una sola vez, el día de la instalación

Los 3.000 archivos del estudio hay que dejarlos listos:

1. **Docling** abre los PDFs digitales y extrae el texto **con su estructura** — distingue un
   título de una cláusula y de una tabla.
2. **PaddleOCR-VL** se ocupa de lo que Docling no puede leer: los **escaneados** y las **fotos
   de documentos**. **Sin esto, todo lo digitalizado con scanner es invisible.**
3. **BGE-M3** convierte cada fragmento en números. Eso permite buscar **por significado**: que
   el abogado escriba "penalidad" y encuentre una cláusula que dice "multa por incumplimiento".
4. **Qdrant** guarda esos números para poder buscarlos rápido.

#### Cuando hace la pregunta

5. **BGE-M3** convierte la pregunta en números también.
6. **Qdrant** busca los fragmentos más parecidos y encuentra las 5 cláusulas relevantes entre
   los 3.000 archivos.
7. **Granite** (o Qwen) lee esas cláusulas y **redacta la respuesta en español, citando de dónde
   la sacó**.

Si en vez de escribir habla, **Whisper** pasa el audio a texto antes de todo lo demás.

### Cada pieza en una línea

| Modelo | Su trabajo |
|---|---|
| **Granite / Qwen** | Entiende la pregunta y redacta la respuesta |
| **BGE-M3** | Encuentra los documentos relevantes por significado |
| **Docling** | Lee los PDFs digitales |
| **PaddleOCR-VL** | Lee lo escaneado y las fotos |
| **Whisper** | Pasa audio a texto |
| **Qdrant** | Guarda y busca |

### ⚠️ No toda instalación lleva las seis

| Tanda | Qué necesita | Costo de implementación |
|---|---|---|
| **Vista** (cámaras) | Sólo visión — **ninguna de estas** | Bajo |
| **Recepción** (WhatsApp) | LLM chico + embeddings livianos. **Sin OCR** | Medio |
| **Expediente** | **Todo** — la instalación completa | **Alto** |
| **Taller** (código) | LLM de código. **Sin OCR ni embeddings de documentos** | Medio |

**Por eso Expediente se cobra 5.500–7.000 y Recepción menos:** no es el hardware lo que cambia,
es la cantidad de piezas que hay que montar y afinar.

---

## 1. Qué necesita realmente un modelo de IA local

No es sólo la placa de video. Son cinco cosas, en orden de importancia:

| # | Requisito | Por qué | Mínimo real |
|---|---|---|---|
| **1** | **VRAM** (memoria de la placa de video) | **Es el límite absoluto.** El modelo tiene que entrar entero o se arrastra | 8 GB |
| **2** | **Ancho de banda de memoria** | La inferencia es **limitada por memoria, no por cálculo** — el cuello es qué tan rápido se mueven los pesos, no qué tan rápido se calcula | — |
| **3** | **RAM del sistema** | Si el modelo no entra en la VRAM, se reparte con la RAM (y va lento) | 16 GB, mejor 32 |
| **4** | **Disco SSD NVMe** | Cada modelo pesa 8–45 GB. Un disco lento hace que cargar tarde minutos | 500 GB libres |
| **5** | **Fuente de poder** | Una GPU de gama alta pide 300–600 W sólo ella | según GPU |

> ### 🔑 El dato que cambia las decisiones de compra
> **La inferencia local es limitada por ancho de banda de memoria, no por potencia de cálculo.**
>
> Por eso **una RTX 3090 usada (24 GB, 936 GB/s) le gana a una RTX 4070 nueva (12 GB, 504 GB/s)**
> para correr modelos — aunque la 4070 sea de generación más nueva y valga más.
>
> **Al evaluar el equipo de un cliente: mirá VRAM y ancho de banda, no el número del modelo.**

### La regla de dimensionamiento

| Precisión | Memoria por cada mil millones de parámetros |
|---|---|
| FP16 (completa) | **~2 GB** |
| Q8 | **~1 GB** |
| **Q4** (la que usamos) | **~0,5 GB** |

**Más 15–20 %** para el KV cache y el framework.

**Ejemplo:** modelo de 14B en Q4 → 14 × 0,5 = 7 GB + 20 % = **~8,4 GB**. Entra justo en una
placa de 8 GB si no se le pide contexto largo; cómodo en una de 12 GB.

---

## 2. 📋 Tabla de campo — qué tiene el cliente → qué le corre

| VRAM | Placas típicas | Qué corre | Velocidad | ¿Sirve para? |
|---|---|---|---|---|
| **Sin GPU** (sólo CPU) | Cualquier PC de oficina | 3B, con esfuerzo 7B | 5–15 tok/s | Sólo demo. **No vender esto** |
| **8 GB** | **RTX 3060 8GB · 3070 · 4060** | **Modelos de 7–8B** Q4: Llama 3.1 8B, **Qwen3 8B** | **40+ tok/s** (la 3070 llega a 40–80 en 7B) | ✅ **Recepción / chatbot** |
| **12 GB** | **RTX 3060 12GB · 4070 · 5070** | **12–14B** Q4: **Gemma 3 12B, Qwen3 14B, DeepSeek-R1-Distill 14B**. Con MoE optimizado, hasta **Qwen3-35B a 58–62 tok/s** | 40–90 tok/s | ✅✅ **Recepción con RAG** |
| **16 GB** | RTX 4060 Ti 16GB · **5060 Ti** · 5080 | 14–32B Q4 | 60–130 tok/s | ✅ Recepción avanzada |
| **24 GB** ⭐ | **RTX 3090 · 4090** | **22–35B** Q4: **Gemma 3 27B, Qwen3 32B, DeepSeek R1 32B** | **60–90 tok/s** en 30B denso | ✅✅✅ **Expediente** |
| **32 GB** | RTX 5090 | 32B cómodo; 70B Q4 con dos placas | ~200 tok/s | ✅ Expediente / Taller |
| **96 GB ECC** | RTX PRO 6000 | 70B en FP16 | — | Central |
| **128 GB unificada** | **Onia Box** (AMD Ryzen AI Max+ 395) | **70B entero + el resto del stack** | 86–103 tok/s (MoE) | ✅✅ Todo el catálogo |

> **La RTX 3090 usada de 24 GB es la mejor relación precio/rendimiento del mercado** para esto,
> por sus 936 GB/s de ancho de banda. Si el cliente tiene una, ya tiene la mitad del producto.

---

## 3. Los tres niveles, con modelos concretos

### 🟢 NIVEL LIVIANO — el cliente ya lo puede correr hoy

| | |
|---|---|
| **Hardware** | 8–12 GB de VRAM (RTX 3060, 3070, 4060, 4070) |
| **Modelos** | **Qwen3 8B** (Apache 2.0) · **Phi-4 14B** (MIT) · Llama 3.1 8B · **Gemma 3 12B** |
| **Velocidad** | 40–90 tok/s — más rápido de lo que una persona lee |
| **Sirve para** | Chatbot de WhatsApp, responder preguntas frecuentes, redactar, clasificar correos |
| **No sirve para** | Analizar expedientes largos ni razonar sobre mucho contexto |
| **Costo para el cliente** | **Cero si ya tiene el equipo** |

### 🟡 NIVEL INTERMEDIO — el punto dulce

| | |
|---|---|
| **Hardware** | **24 GB de VRAM** (RTX 3090 usada, 4090) o la Onia Box |
| **Modelos** | **Qwen3 32B** · **Gemma 3 27B** · **DeepSeek R1 32B** · **Qwen3 30B-A3B MoE** ⭐ |
| **Velocidad** | 60–90 tok/s |
| **Sirve para** | **Leer y resumir documentos, RAG sobre archivos del cliente, asistente real** |
| **Costo del hardware** | RTX 3090 usada: mucho menos que una caja nueva |

### 🔴 NIVEL AVANZADO

| | |
|---|---|
| **Hardware** | **128 GB unificada** (Onia Box) · 2× RTX 5090 · RTX PRO 6000 |
| **Modelos** | **Qwen3 70B** · **Seed-OSS 36B** (512K de contexto) · **gpt-oss 120B** · Llama 4 Scout |
| **Sirve para** | Expedientes completos, contexto muy largo, varios usuarios a la vez |
| **Nota** | Arriba de **10 usuarios concurrentes** hay que pasar de Ollama a **vLLM** |

---

## 4. ⚖️ Cuáles NO dan problemas legales

**El criterio:** nosotros **vendemos** el modelo adentro de una instalación. Eso es
**redistribución comercial**, y ahí las licencias importan.

### ✅ Libres — se pueden instalar y cobrar sin condiciones

| Modelo | Licencia | Quién lo hizo |
|---|---|---|
| **Qwen3** (todos los tamaños) | **Apache 2.0** | Alibaba |
| **Mistral Small** | **Apache 2.0** | Mistral (Francia) |
| **Phi-4** | **MIT** | Microsoft |
| **DeepSeek R1 / distills** | **MIT** | DeepSeek |
| **gpt-oss 20B / 120B** | **Apache 2.0** | OpenAI |
| **Seed-OSS 36B** | **Apache 2.0** | ByteDance |
| **Hermes 4.3-36B** | **Apache 2.0** | Nous Research |
| **IBM Granite** | **Apache 2.0** | IBM |
| **GLM-5.2** | **MIT / Apache 2.0** | Zhipu |

**Qué obliga Apache/MIT:** sólo conservar el aviso de licencia. Un archivo de texto.

### ⚠️ Usables, pero arrastran condiciones al contrato del cliente

| Modelo | Problema |
|---|---|
| **Llama** (3.3, 4) | Tres restricciones que no existen en Apache. No se pueden usar sus salidas para entrenar otros modelos. Obliga a trasladar términos |
| **Gemma 3** | **Exige restricciones ejecutables en el contrato con el cliente final.** Meteríamos cláusulas de Google en nuestro contrato |

### 🔴 Prohibidos para vender

| Modelo | Problema |
|---|---|
| **MiniMax M2.7** | **Licencia de sólo investigación / no comercial** |

> **Regla del producto: instalamos únicamente Apache 2.0 o MIT.** Llama y Gemma sólo si el
> cliente los pide y acepta sus términos por escrito.

---

## 5. 🛡️ Cuáles son los más confiables

**Aclaración que resuelve el 80 % de la desconfianza:** un modelo corriendo **sin internet no
puede filtrar nada**. No hay canal. Eso no es opinión.

### El riesgo real: pesos manipulados

Está demostrado que **se convierte un modelo abierto en backdoor en 1 hora por menos de
USD 100**, y **el modelo envenenado no se distingue por benchmark** (83,5 % vs 86,6 % en
HumanEval).

**No es que el fabricante ponga backdoors — es que cualquiera puede envenenar un modelo y
volver a subirlo.**

**Mitigación obligatoria:**
- Descargar **sólo del repositorio oficial** de la organización original
- **Verificar checksums**
- **Nunca** usar pesos de cuentas anónimas ni "optimizados por" terceros
- Congelar la versión probada

### Los dos catálogos — para que el cliente elija

| Catálogo | Modelos | Para quién |
|---|---|---|
| **Rendimiento** | Qwen3 (Alibaba) · Seed-OSS (ByteDance) · Hermes (Nous) | El que quiere lo mejor y entiende que corre aislado |
| **Occidental** ✅ | **Phi-4 (Microsoft)** · **Mistral (Francia)** · **gpt-oss (OpenAI)** | Estudio jurídico grande, financiera, sector público |

**Los tres del catálogo occidental son Apache 2.0 o MIT y corren en el mismo equipo.** Cambiar
de modelo cuesta un comando.

---

## 6. 🏢 Instalar sobre la infraestructura que el cliente ya tiene

**Sí se puede, y es la vía más rápida a la primera factura.** Cero importación, cero
inventario, cero garantía de hardware.

### Paso 1 — Relevamiento (checklist para la visita)

| # | Qué preguntar / mirar | Por qué |
|---|---|---|
| 1 | ¿Tienen alguna PC con **placa de video dedicada**? ¿Cuál? | Define todo |
| 2 | ¿Cuánta **RAM**? | Mínimo 16 GB, ideal 32 |
| 3 | ¿**Disco SSD** con al menos 500 GB libres? | Los modelos pesan |
| 4 | ¿Está **encendida siempre** o la apagan de noche? | El servicio tiene que estar disponible |
| 5 | ¿Tiene **UPS**? | Cortes de luz |
| 6 | ¿Dónde está físicamente? ¿Hace calor ahí? | Térmica |
| 7 | ¿**Cuántas personas** la van a usar? | Define el modelo y si hace falta vLLM |
| 8 | ¿Qué **documentos** quieren consultar? ¿En qué formato? | Define el RAG |
| 9 | ¿Tienen internet estable para el **soporte remoto**? | Sin eso no hay mantenimiento |

**Con las respuestas 1 y 2, la tabla del §2 dice al instante qué modelo le entra.**

### Paso 2 — Qué se puede prometer según lo que tenga

| Lo que tiene | Qué se le vende |
|---|---|
| PC sin GPU dedicada | ❌ **Nada todavía.** Se le cotiza una GPU o la Onia Box |
| GPU de 8 GB | ✅ **Chatbot / Recepción**. Qwen3 8B o Phi-4 |
| GPU de 12 GB | ✅ **Recepción con búsqueda en sus documentos** |
| **GPU de 24 GB** | ✅✅ **Expediente completo**. Es el escenario ideal |
| Servidor sin GPU | ⚠️ Se le puede **agregar una GPU** — verificar fuente y espacio físico |

### Paso 3 — Lo que se instala (todo gratis)

Linux o Windows · Docker · **Ollama** · el modelo que corresponda · **Open WebUI** ·
**Qdrant + Apache Tika** si hay documentos · **Tailscale** para soporte remoto · monitoreo.

**Costo del software: cero.** Todo el precio es nuestro trabajo.

### Paso 4 — Qué se cobra

| Concepto | USD |
|---|---|
| Implementación (30–45 h la primera vez, 15–25 las siguientes) | **1.500–2.500** |
| **Soporte y actualizaciones** | **150–300/mes** |
| Si hay que agregarle una GPU | costo de la placa + margen |

---

## 7. Resumen para llevar en el bolsillo

| Si el cliente tiene… | Le corre… | Y le sirve para… |
|---|---|---|
| Nada / PC de oficina | — | Hay que venderle hardware |
| **8 GB de VRAM** | Qwen3 8B | Chatbot, redacción |
| **12 GB** | Qwen3 14B, Gemma 3 12B | Chatbot + buscar en documentos |
| **24 GB** | Qwen3 32B, Gemma 3 27B | **Analizar expedientes** |
| **Onia Box 128 GB** | Qwen3 70B, Seed-OSS 36B | Todo, y varios usuarios |

**Modelo por defecto en todos los casos: Qwen3** — Apache 2.0, fuerte en español, hay tamaño
para cada equipo.
**Si el cliente desconfía: Phi-4 de Microsoft**, misma licencia limpia.

---

## Fuentes

- [Guía de hardware para LLM local 2026 — PromptQuorum](https://www.promptquorum.com/local-llms/local-llm-hardware-guide-2026) · [Requisitos de VRAM Ollama](https://localllm.in/blog/ollama-vram-requirements-for-local-llms) · [VRAM mínima por tier](https://www.kunalganglani.com/blog/running-local-llms-2026-hardware-setup-guide)
- [Guía completa de LLM local — Medium](https://medium.com/@paulhoke/the-complete-guide-to-running-large-language-models-locally-in-2026-hardware-tools-and-da9efb3170be) · [Tu GPU determina tu LLM](https://bhavishyapandit9.substack.com/p/best-local-llm-for-every-hardware-tier) · [Guía 10 GB VRAM](https://www.sitepoint.com/10gb-vram-local-llm-the-complete-setup-guide-2026/)
- Licencias, confiabilidad y modelos: ver `ONIA_BOX_MODELOS_RESTANTES_Y_LICENCIAS_20260806.md` y `ONIA_BOX_CONFIANZA_Y_LISTA_DE_COMPRA_20260806.md`
