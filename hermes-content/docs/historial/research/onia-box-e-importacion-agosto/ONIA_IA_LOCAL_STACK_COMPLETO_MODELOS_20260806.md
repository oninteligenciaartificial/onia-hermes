# El stack completo — todos los modelos, no sólo el de chat (2026-08-06)

**Tenía un hueco.** Veníamos hablando sólo del modelo de chat, pero una instalación real
necesita **cinco tipos de modelo distintos**. Este documento los cierra todos, con licencia
verificada.

---

## 1. El hueco: un LLM solo no lee documentos

Para que un estudio jurídico consulte sus expedientes hacen falta **cinco piezas**, no una:

| # | Pieza | Qué hace | ¿La tenía especificada? |
|---|---|---|---|
| 1 | **LLM de chat** | Responde y razona | ✅ Sí |
| 2 | **Modelo de embeddings** | Convierte los documentos en vectores para poder buscarlos | ❌ **Faltaba** |
| 3 | **Parseo de documentos** | Extrae texto y estructura de PDF, Word, planillas | ⚠️ Mencionado sin nombre |
| 4 | **OCR** | Lee documentos **escaneados** y fotos | ❌ **Faltaba** |
| 5 | **Transcripción** | Audio a texto | ✅ Ya lo usamos (Speaches) |

**Sin la 2 no hay búsqueda. Sin la 4, todo expediente escaneado es invisible** — y en un
estudio jurídico boliviano, buena parte del archivo está escaneado.

---

## 2. Embeddings — la pieza que faltaba

### 🔴 Trampa de licencia que casi pisamos

> **NV-Embed-v2 y jina-embeddings-v3 encabezan los rankings, pero son CC-BY-NC:
> NO se pueden usar en un RAG comercial.**

Son justo los que aparecen primeros si uno busca "mejor modelo de embeddings". **Si los
instalábamos, estábamos vendiendo algo que no podemos vender.**

### Los que sí sirven

| Modelo | Licencia | Tamaño | Fuerte en |
|---|---|---|---|
| **Qwen3-Embedding-0.6B** ⭐ | **Apache 2.0** | **~1,5 GB** | **La mejor calidad por VRAM.** 70,7 en MTEB-eng-v2. Nativo en Ollama |
| **Qwen3-Embedding-8B** | **Apache 2.0** | grande | **Encabeza el ranking multilingüe MTEB con 70,58** — supera a toda alternativa abierta |
| **BGE-M3** ⭐ | **MIT** | mediano | **El más fuerte en búsqueda híbrida multilingüe.** 8K de contexto, **100+ idiomas** |
| **Nomic Embed v2** | permisiva | **~0,3 GB** | Documentos largos. El arranque local más fácil |

**Recomendación:** **BGE-M3** para español (multilingüe + híbrido) y **Qwen3-Embedding-0.6B**
cuando el equipo del cliente es chico — pesa 1,5 GB y ya está en Ollama.

> Nota técnica: muchos modelos de embeddings abiertos alcanzan para producción **si se combinan
> con búsqueda híbrida y reranking**. La calidad del RAG no depende sólo del embedding.

[Mejores embeddings locales — PromptQuorum](https://www.promptquorum.com/power-local-llm/best-embedding-models-local-rag-2026) ·
[D-Central](https://d-central.tech/local-embedding-models/) ·
[Comparación 2026 — StackAI](https://www.stackai.com/insights/best-embedding-models-for-rag-in-2026-a-comparison-guide)

---

## 3. Documentos y OCR — la otra pieza que faltaba

### Para PDFs nativos digitales

| Herramienta | Quién | Nota |
|---|---|---|
| **Docling** ⭐ | **IBM Research** | Diseñado para **pipelines RAG de producción**. Salida `DoclingDocument` que **preserva la jerarquía semántica**. Fuerte en PDFs nativos con layout simple |
| **Marker** | — | PDF, DOCX, PPTX, XLSX, HTML y EPUB → Markdown o JSON. Usa Surya OCR. Corre en GPU, CPU y Apple. Tiene `--use_llm` para documentos críticos |
| MinerU · PyMuPDF4LLM | — | Layouts complejos |

### Para documentos escaneados y fotos ← lo crítico en Bolivia

| Herramienta | Licencia | Nota |
|---|---|---|
| **PaddleOCR-VL 1.5 / 1.6** ⭐ | **Apache 2.0** | Modelo visión-lenguaje de **enero de 2026**. **109 idiomas** (la 1.6 llega a 100+), reconoce **tablas, fórmulas y gráficos**. Funciona en **páginas escaneadas, torcidas o fotografiadas**. **120 páginas/min en GPU** |
| PaddleOCR clásico | Apache 2.0 | El motor tradicional más capaz para pipelines multilingües con layouts complejos |
| **pdf-craft** | — | **100 % local: sin red, sin claves de API, sin nube.** Usa DeepSeek OCR |
| olmOCR | — | Digitalización masiva — USD 190 por millón de páginas |

**Recomendación: Docling + PaddleOCR-VL.** Docling para lo digital, PaddleOCR-VL para lo
escaneado y fotografiado.

[OCR y VLM de documentos comparados — Spheron](https://www.spheron.network/blog/best-open-source-ocr-vlm-self-host-gpu-cloud-2026/) ·
[PDF a Markdown 2026](https://themenonlab.blog/blog/best-open-source-pdf-to-markdown-tools-2026) ·
[Mejores OCR open source](https://unstract.com/blog/best-opensource-ocr-tools/)

### 💡 Coherencia que sirve para vender

**Docling y Granite son los dos de IBM Research.** Para el cliente regulado, el pipeline
completo —**lectura de documentos + modelo de lenguaje**— es de IBM, con Apache 2.0 y el modelo
certificado ISO 42001.

Eso es un argumento redondo: *"el sistema de documentos y el modelo son ambos de IBM"*.

---

## 4. El stack de modelos, ahora completo

| Función | Cliente regulado | Mejor rendimiento en español |
|---|---|---|
| **Chat y razonamiento** | **IBM Granite 4.1** (3B/8B/30B) | **Qwen3** |
| **Embeddings** | **BGE-M3** (MIT) | **Qwen3-Embedding-0.6B** (Apache) |
| **Documentos digitales** | **Docling** (IBM) | Docling o Marker |
| **OCR / escaneados** | **PaddleOCR-VL** (Apache) | PaddleOCR-VL |
| **Transcripción** | Whisper vía Speaches | ídem |
| **Vector store** | Qdrant (Apache) | ídem |
| **Motor** | Ollama · vLLM si >10 usuarios | ídem |
| **Interfaz** | Open WebUI | ídem |

**Todo Apache 2.0 o MIT. Todo gratis. Todo corre local.**

---

## 5. Lo que dejo de buscar, y por qué

Quedaron sin verificar las licencias de **Falcon, EXAONE, Jamba, LFM2.5, Ernie, Yi y
Baichuan**. Busqué dos veces y no aparecieron en fuentes sólidas.

**No voy a seguir buscándolas**, por una razón práctica: **ya tenemos seis candidatos de chat
sólidos con licencia limpia y verificada**, más embeddings y OCR resueltos. Sumar una séptima
familia sin verificar no cambia ninguna decisión — y el tiempo rinde más midiendo los que
tenemos que leyendo sobre los que no.

Si alguno aparece con una ventaja concreta (por ejemplo, que **LFM2.5 midió 169 tok/s** en
nuestra caja), ahí sí se verifica su licencia antes de tocarlo.

---

## 6. La lista definitiva a descargar y medir

| # | Modelo | Función | Licencia | Tamaño aprox. |
|---|---|---|---|---|
| 1 | **Granite 4.1 8B** | Chat — regulado | Apache 2.0 | ~5 GB |
| 2 | **Granite 4.1 30B** | Chat — regulado, Expediente | Apache 2.0 | ~18 GB |
| 3 | **Qwen3 30B-A3B MoE** | Chat — rendimiento | Apache 2.0 | ~20 GB |
| 4 | **Seed-OSS 36B** | Chat — contexto 512K | Apache 2.0 | ~22 GB |
| 5 | **Mistral Small 4** | Chat — alternativa europea | Apache 2.0 | ~14 GB |
| 6 | **Phi-4 14B** | Chat — hardware flojo | MIT | ~8 GB |
| 7 | **BGE-M3** | Embeddings | MIT | ~2 GB |
| 8 | **Qwen3-Embedding-0.6B** | Embeddings livianos | Apache 2.0 | ~1,5 GB |
| 9 | **PaddleOCR-VL** | OCR | Apache 2.0 | — |
| 10 | **Docling** | Parseo de documentos | — | — |

**Total: ~90–110 GB.** El SSD de 2 TB de la lista de compra alcanza de sobra.

---

## Fuentes

- Embeddings: [PromptQuorum](https://www.promptquorum.com/power-local-llm/best-embedding-models-local-rag-2026) · [D-Central](https://d-central.tech/local-embedding-models/) · [StackAI](https://www.stackai.com/insights/best-embedding-models-for-rag-in-2026-a-comparison-guide) · [KnowledgeSDK](https://knowledgesdk.com/blog/open-source-embedding-models-rag-2026)
- OCR y documentos: [Spheron — OCR VLM self-host](https://www.spheron.network/blog/best-open-source-ocr-vlm-self-host-gpu-cloud-2026/) · [PDF a Markdown](https://themenonlab.blog/blog/best-open-source-pdf-to-markdown-tools-2026) · [Unstract](https://unstract.com/blog/best-opensource-ocr-tools/) · [PaddleOCR vs Tesseract](https://www.koncile.ai/en/ressources/paddleocr-analyse-avantages-alternatives-open-source)
- Modelos de chat y licencias: `ONIA_IA_LOCAL_FAMILIAS_DE_MODELOS_20260806.md`
