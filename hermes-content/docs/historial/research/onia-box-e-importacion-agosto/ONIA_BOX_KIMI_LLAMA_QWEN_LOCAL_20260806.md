# Kimi vs Llama vs Alibaba (Qwen) — con el filtro de que corra local (2026-08-06)

Octava parte. Sergio pidió analizar **Kimi, Llama y Alibaba**, con una condición: **todo tiene
que ser local**.

**El filtro:** nuestras cajas tienen como techo **128 GB de memoria unificada** (Onia Box) o
**32 GB de VRAM** (RTX 5090). Todo lo que pida más, no existe para nosotros.

---

## 0. El concepto que hay que entender primero: MoE no ahorra memoria

Un modelo MoE (mezcla de expertos) **activa** pocos parámetros por token, pero
**hay que cargar TODOS en memoria igual**.

> *"Los modelos MoE deben cargar TODOS los parámetros en memoria, aunque sólo 17B estén activos
> por token. Por eso los requisitos de VRAM son mucho más altos que los de un modelo denso de
> 17B."*

**Consecuencia:** el MoE te da **velocidad**, no te da **memoria barata**. Es la razón por la
que Kimi queda afuera y Llama 4 Scout entra justo.

---

## 1. Kimi (Moonshot AI) — ❌ **No corre local en nuestras cajas**

| | |
|---|---|
| **Kimi K2.6** | **1 billón (1T) de parámetros totales**, 32B activos, 384 expertos, contexto 256K |
| Licencia | **MIT Modificada** (buena) |
| Q4 | **~584–600 GB** de RAM+VRAM |
| 2-bit dinámico (Unsloth UD-Q2_K_XL) | **~325–350 GB** — 48 % menos y aun así imposible |
| Precisión completa | **610 GB** sólo de disco |
| INT4 QAT nativo | 2× más rápido y ~50 % menos memoria que FP16, con pérdida mínima |

**Veredicto: descartado.** El objetivo práctico para despliegue local es el Q4 a ~600 GB.
Tenemos 128. **Ni con la cuantización de 2 bits entra** — faltarían 200 GB.

Es un modelo excelente (líder en coding agéntico) pero **de escala datacenter**. Correrlo
implicaría un servidor de USD 100.000+, que no es nuestro mercado.

> Si algún día Moonshot saca una variante chica de la familia, se revisa. Hoy no aplica.

[Kimi K2.6 — cómo correrlo local (Unsloth)](https://unsloth.ai/docs/models/kimi-k2.6) ·
[Requisitos de hardware Kimi K2](https://runaihome.com/blog/kimi-k2-local-inference-hardware-guide-2026/) ·
[Guía completa K2.6](https://www.aimadetools.com/blog/kimi-k2-6-complete-guide/)

---

## 2. Llama (Meta) — ⚠️ **Sí, pero con dos asteriscos**

| Modelo | Params | Q4 | ¿Entra en 128 GB? |
|---|---|---|---|
| **Llama 3.3 70B** | 70B denso | ~40 GB | ✅ **Sí, cómodo** |
| **Llama 4 Scout** | 109B totales / **17B activos** (MoE) | **55–60 GB** | ✅ **Sí, con margen** |
| Llama 4 Maverick | 400B | ~200 GB+ | ❌ No |

### ⚠️ Asterisco 1 — el "contexto de 10 millones" no es usable local

Es el número que todo el mundo repite de Llama 4 Scout. La realidad:

> A contexto completo de 10 M en Q4, los pesos son 61 GB **pero el KV cache es de 2.062 GB** —
> hardware de escala datacenter.

**A contexto práctico sí funciona con 55–60 GB.** Pero vender "10 millones de tokens de
contexto" sería mentir. **No usar ese argumento.**

### ⚠️ Asterisco 2 — la licencia

Licencia Llama, no Apache. Comercialmente usable (el umbral de 700 M de usuarios no nos toca),
pero mete **tres restricciones que no existen en Apache/MIT** y exige *pass-through* al cliente
final. Ver `ONIA_BOX_MODELOS_Y_MARCA_20260806.md` §2.

**Veredicto: sirve, y Llama 4 Scout es una alternativa real para la gama Expediente.** Pero
como **segunda opción**, no preinstalado por defecto — la licencia obliga a arrastrar términos
al contrato del cliente.

[Llama 4 Scout — specs y VRAM (APXML)](https://apxml.com/models/llama-4-scout) ·
[Guía Scout y Maverick local — InsiderLLM](https://insiderllm.com/guides/llama-4-guide-scout-maverick/) ·
[Requisitos Llama 4 — GPUSmith](https://gpusmith.com/articles/en/llama-4-hardware-requirements)

---

## 3. Alibaba (Qwen) — ✅ **La única familia que cubre todo el catálogo**

| Variante | Tamaño | Dónde corre | Medido |
|---|---|---|---|
| Qwen3 0,6B – 4B | chico | **Jetson** (gama Vista) | — |
| Qwen3 8B – 14B | mediano | Onia Box (gama Recepción) | — |
| **Qwen3 30B-A3B MoE** ⭐ | 30B tot. / 3B act. | Onia Box (gama Expediente) | **1.142 t/s prefill · 86 t/s gen** |
| **Qwen3-Coder** | varias | Onia Box / RTX (gama Taller) | **101 t/s** |
| Qwen3 70B | 70B | Onia Box / Central | — |
| Qwen3 235B-A22B | 235B | ❌ fuera de nuestras cajas | — |

**Licencia: Apache 2.0** — redistribución comercial sin restricciones de campo de uso.
**Lidera las evaluaciones en español** de 2026.

**Veredicto: la base del catálogo — y no por preferencia, por aritmética.** Es la única familia
que va **desde un Jetson de USD 249 hasta la caja grande con una sola licencia limpia**. Eso
significa un solo contrato, un solo manual, un solo flujo de soporte.

---

## 4. Comparación con el filtro aplicado

| | **Kimi K2.6** | **Llama 4 Scout** | **Qwen3 30B-A3B** |
|---|---|---|---|
| Parámetros | 1T / 32B act. | 109B / 17B act. | 30B / 3B act. |
| Memoria Q4 | **~600 GB** | **55–60 GB** | **~20 GB** |
| ¿Entra en Onia Box (128 GB)? | ❌ **No** | ✅ Sí, con margen | ✅ Sí, y sobra para el resto del stack |
| Licencia | MIT Modificada | **Llama** (pass-through) | **Apache 2.0** ✅ |
| Rendimiento medido en nuestra caja | — | — | **1.142 pp / 86 tg** |
| Veredicto | Datacenter | **2ª opción** | **1ª opción** |

**Y un detalle que decide:** Qwen3 30B-A3B usa ~20 GB, dejando **más de 100 GB libres** para
ONIA Platform, Chatwoot, n8n, Postgres y el vector store — que es exactamente el argumento de
venta de la caja. Llama 4 Scout usa 55–60 GB y deja bastante menos margen para todo lo demás.

---

## 5. Sobre "horse" — no lo identifico

No encuentro una familia de modelos con ese nombre. Candidatos probables, todos con versiones
que corren local:

| Si te referías a… | Quién | Nota |
|---|---|---|
| **Hunyuan** | Tencent | Familia abierta, versiones chicas locales |
| **MiniMax** (M2) | MiniMax | MoE, fuerte en agentes |
| **Hermes** | Nous Research | Fine-tunes sobre Llama/Qwen — ojo que coincide con el nombre de nuestro bot |
| **GLM** | Zhipu | GLM-5.x, potente pero grande |
| **Yi** / **Baichuan** / **Ernie** / **Doubao** | 01.AI / Baichuan / Baidu / ByteDance | Familias chinas menos difundidas fuera de China |

Decime cuál era y lo analizo con el mismo filtro.

---

## 6. Conclusión

1. **Kimi: fuera.** 600 GB contra nuestros 128. No es cuestión de optimizar, es un orden de
   magnitud.
2. **Llama: adentro como segunda opción.** Llama 4 Scout entra en 55–60 GB, pero la licencia
   obliga a arrastrar términos al contrato del cliente. Y **el contexto de 10 M no es usable
   local** — no venderlo.
3. **Qwen (Alibaba): la base.** Única familia que cubre de Jetson a caja grande con Apache 2.0,
   lidera en español, y deja el 80 % de la memoria libre para el resto del stack.
4. **Lo que no cambió:** dos modelos por gama, medidos en la unidad de prueba, y se instala el
   que gane.

---

## Fuentes

- [Kimi K2.6 local (Unsloth)](https://unsloth.ai/docs/models/kimi-k2.6) · [K2 Thinking local](https://unsloth.ai/docs/models/tutorials/kimi-k2-thinking-how-to-run-locally) · [Hardware K2 — RunAIHome](https://runaihome.com/blog/kimi-k2-local-inference-hardware-guide-2026/) · [Guía K2.6](https://www.aimadetools.com/blog/kimi-k2-6-complete-guide/)
- [Llama 4 Scout — APXML](https://apxml.com/models/llama-4-scout) · [Scout y Maverick local — InsiderLLM](https://insiderllm.com/guides/llama-4-guide-scout-maverick/) · [Hardware Llama 4 — GPUSmith](https://gpusmith.com/articles/en/llama-4-hardware-requirements) · [VRAM Llama 4 — WillItRunAI](https://willitrunai.com/blog/llama-4-gpu-requirements)
- [Cheat sheet de GPU 2026 — Spheron](https://www.spheron.network/blog/gpu-requirements-cheat-sheet-2026/) · [VRAM por modelo — VRLA Tech](https://vrlatech.com/llm-vram-requirements-2026/)
