# Familias de modelos abiertos — panorama completo (2026-08-06)

Sergio marcó dos veces que yo venía defaulteando a Qwen. **Tenía razón**, y al abrir el
panorama apareció una familia que probablemente **le gana a Qwen para nuestro nicho exacto**.

---

## 🏆 El hallazgo: IBM Granite 4.1

Publicado el **29 de abril de 2026**. Es el mejor calce con lo que vendemos, y no por
rendimiento — por **credenciales**.

| | |
|---|---|
| **Licencia** | **Apache 2.0** ✅ |
| **Certificación** | **ISO 42001** — **primera familia de modelos de lenguaje abiertos en tenerla** |
| **Autenticidad** | **Firma criptográfica del linaje del modelo** |
| **Tamaños** | **3B · 8B · 30B**, densos |
| **Contexto** | **128K en producción**, extensión a **512K** |
| **Cubre** | Lenguaje, visión, voz, embeddings y modelos **Guardian** de seguridad |
| **Origen** | **Proveedor estadounidense** |
| **Eficiencia** | **El 8B iguala o supera al Granite 4.0 de 32B MoE**, con ~**4× menos cómputo** |

### Por qué esto importa más de lo que parece

1. **ISO 42001 es una credencial auditable.** Un estudio jurídico grande, una financiera
   regulada por ASFI o una entidad pública **pueden exigir papeles**. Ningún otro modelo
   abierto los tiene. Deja de ser "confiá en mí" y pasa a ser un certificado.

2. **La firma criptográfica resuelve el riesgo nº1 que identificamos.** Documentamos que se
   puede envenenar un modelo abierto en 1 hora por menos de USD 100 y que **no se detecta por
   benchmark**. Con Granite **se puede verificar criptográficamente que los pesos son los
   originales de IBM.** Es la única familia que cierra ese agujero.

3. **IBM es una marca que el sector bancario y corporativo boliviano respeta.** Resuelve de
   paso la objeción de "¿y esta marca quién es?" que Sergio planteó con Beelink.

4. **Los tamaños calzan perfecto:** 3B para equipos flojos, **8B para 8–12 GB de VRAM**, 30B
   para 24 GB. Y el 8B rinde como un 32B anterior — o sea que **el hardware que ya tiene el
   cliente rinde más.**

5. IBM lo posiciona explícitamente para **autohospedaje, para que el dato sensible no salga del
   perímetro de la red.** Es literalmente nuestro pitch, escrito por ellos.

[Granite 4.1 — IBM](https://www.ibm.com/granite/docs/models/granite4-1) ·
[Primera certificación ISO 42001 en open source](https://www.ibm.com/new/announcements/ibm-granite-iso-42001) ·
[Nemko sobre la certificación](https://digital.nemko.com/news/ibm-granite-40-first-iso-42001-certified-open-source-ai) ·
[Granite 4.1 y 512K de contexto](https://www.creativeainews.com/articles/ibm-granite-4-1-open-llm-512k-context-coding/)

---

## Panorama completo de familias

### 🇺🇸 Estadounidenses

| Familia | Quién | Tamaños | Licencia | Nota |
|---|---|---|---|---|
| **Granite 4.1** ⭐ | **IBM** | 3B · 8B · 30B | **Apache 2.0** | **ISO 42001 + firma criptográfica** |
| **Phi-4** | Microsoft | 14B | **MIT** | Entra en 8 GB |
| **gpt-oss** | OpenAI | 20B · 120B | **Apache 2.0** | El 120B pide 65–70 GB |
| **Llama** 3.3 / 4 | Meta | 8B → 400B | ⚠️ Llama | Scout llega a 10M de contexto (no usable local) |
| **Gemma 4 / 3n** | Google | 1B → 27B; **Gemma 4 12B Coder**; stack de 26B a **85 tok/s** en hardware de consumo. **Gemma 3n** usa MatFormer con inferencia elástica | ⚠️ Gemma | Técnicamente muy bueno, **licencia pegajosa** |
| **Nemotron 3 Nano Omni** | NVIDIA | **30B-A3B MoE**, híbrido **Mamba-Transformer**, texto + imagen + audio, 131K de contexto | ⚠️ **Licencia propia NVIDIA** | Multimodal real. Hay que leer la licencia |
| **Llama-Nemotron** | NVIDIA | Nano 8B · Super 49B · Ultra 253B | ⚠️ deriva de Llama | Afinados con HelpSteer2 |
| **OLMo / OLMo2** | AI2 | varios | abierto | **Totalmente abierto: datos, código y pesos.** El más auditable |
| **Hermes 4.3** | Nous Research | 36B | **Apache 2.0** | Sobre Seed-OSS |

### 🇪🇺 Europeas

| Familia | Quién | Nota |
|---|---|---|
| **Mistral** | Mistral AI 🇫🇷 | **Mistral Small 4** recién lanzado. Buque insignia de **123B, 128K, 80+ idiomas**. **Mistral-NeMo 12B** con 128K, hecho con NVIDIA. Miembro fundador de la Coalición Nemotron. **Apache 2.0** en los abiertos |
| **Salamandra** | BSC 🇪🇸 | 2B / 7B, **entrenado en español, catalán, gallego y euskera** |

### 🌏 Asiáticas y otras

| Familia | Quién | Licencia | Nota |
|---|---|---|---|
| **Qwen3** | Alibaba 🇨🇳 | **Apache 2.0** | Lidera en español. Tamaños de 0,6B a 235B |
| **Seed-OSS 36B** | ByteDance 🇨🇳 | **Apache 2.0** | **512K de contexto** |
| **DeepSeek R1 / V3** | DeepSeek 🇨🇳 | **MIT** | Razonamiento y matemática |
| **GLM-5.2** | Zhipu 🇨🇳 | **MIT / Apache** | Fuerte, pero **no rechazó tareas ofensivas** en evaluación |
| **Hunyuan** | Tencent 🇨🇳 | MIT / Apache | A13B: 80B totales / 13B activos |
| **Kimi K2.6** | Moonshot 🇨🇳 | MIT mod. | ❌ 1T de parámetros — **no entra** |
| **MiniMax M2.7** | MiniMax 🇨🇳 | 🔴 **no comercial** | **Prohibido vender** |
| **Falcon / Falcon-H1** | TII 🇦🇪 | ❓ sin verificar | — |
| **EXAONE** | LG 🇰🇷 | ❓ sin verificar | — |
| **Jamba** | AI21 🇮🇱 | ❓ sin verificar | Híbrido SSM |
| **LFM2.5** | Liquid AI | ❓ sin verificar | **169 tok/s medidos** en Ryzen AI Max+ |

> Las marcadas ❓ **no las verifiqué**. No voy a afirmar una licencia que no confirmé — es
> justo el dato del que depende poder venderlas.

---

## La recomendación revisada

**Ya no es "Qwen y punto". Son dos por defecto según el cliente:**

| Cliente | Modelo por defecto | Por qué |
|---|---|---|
| **Regulado o desconfiado** — estudio jurídico grande, financiera, sector público, salud | **IBM Granite 4.1** | **ISO 42001**, firma criptográfica, Apache 2.0, marca IBM |
| **Quiere el mejor rendimiento en español** — comercio, clínica chica, pyme | **Qwen3** | Lidera evaluaciones en español, más tamaños |

**Y a medir en la unidad de prueba, ahora seis:**

| Modelo | Por qué está en la lista |
|---|---|
| **Granite 4.1 8B** | Nuevo favorito para cliente regulado |
| **Granite 4.1 30B** | Versión Expediente del anterior |
| **Qwen3 30B-A3B MoE** | El más rápido medido (1.142 t/s de prefill) |
| **Seed-OSS 36B** | 512K de contexto |
| **Mistral Small 4** | Alternativa europea, Apache |
| **Phi-4 14B** | Para el hardware más flojo del cliente |

Todos **Apache 2.0 o MIT**. Ninguno mete cláusulas en nuestros contratos.

---

## Lo que cambia en la guía de campo

En `ONIA_IA_LOCAL_GUIA_DE_REQUISITOS_20260806.md`, la tabla de "qué le corre al cliente" ahora
tiene una segunda opción en cada fila:

| VRAM del cliente | Opción rendimiento | **Opción regulada** |
|---|---|---|
| 8 GB | Qwen3 8B | **Granite 4.1 8B** |
| 12 GB | Qwen3 14B | **Granite 4.1 8B** con más contexto |
| 24 GB | Qwen3 32B | **Granite 4.1 30B** |
| Onia Box | Qwen3 70B / Seed-OSS | **Granite 4.1 30B** + margen para el stack |

**Y un argumento de venta nuevo que antes no teníamos:**

> *"El modelo que le instalamos tiene certificación ISO 42001 y firma criptográfica: podemos
> demostrar que los pesos son los originales de IBM y que no fueron alterados."*

Para un estudio jurídico que tiene que responder ante sus clientes, eso vale más que veinte
tokens por segundo de diferencia.

---

## Fuentes

- [IBM Granite 4.1](https://www.ibm.com/granite/docs/models/granite4-1) · [ISO 42001 — anuncio IBM](https://www.ibm.com/new/announcements/ibm-granite-iso-42001) · [Nemko](https://digital.nemko.com/news/ibm-granite-40-first-iso-42001-certified-open-source-ai) · [Granite 4.0 anuncio](https://www.ibm.com/new/announcements/ibm-granite-4-0-hyper-efficient-high-performance-hybrid-models) · [512K de contexto](https://www.creativeainews.com/articles/ibm-granite-4-1-open-llm-512k-context-coding/)
- [Modelos omni de borde comparados 2026](https://ai-know.info/en/posts/2026-05-07-edge-omni-model-comparison-2026/) · [Comparativa 25+ modelos open source](https://till-freitag.com/en/blog/open-source-llm-comparison) · [Mejores modelos locales 2026](https://gemma4-ai.com/blog/best-local-ai-models-2026)
- [Licencia abierta Nemotron — NVIDIA](https://www.nvidia.com/en-us/agreements/enterprise-software/nvidia-nemotron-open-model-license/) · [Mistral + NVIDIA](https://mistral.ai/news/mistral-ai-and-nvidia-partner-to-accelerate-open-frontier-models/) · [OLMo2 en NeMo](https://docs.nvidia.com/nemo/automodel/model-coverage/large-language-models/allenai/olmo2)
