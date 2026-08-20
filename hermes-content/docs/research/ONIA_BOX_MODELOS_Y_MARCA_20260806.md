# Onia Box — catálogo de modelos y el problema de la marca (2026-08-06)

Séptima parte. Dos correcciones que pidió Sergio: **no todo es Qwen**, y **"Strix Halo" no es
una marca que nadie reconozca**.

---

## 1. Aclaración: "Strix Halo" es jerga, no producto

| Lo que veníamos diciendo | Lo que hay que decir |
|---|---|
| "Strix Halo" | **Nombre clave interno de AMD.** No aparece en ninguna caja ni en ninguna factura |
| — | **Nombre comercial real: AMD Ryzen AI Max+ 395** |
| — | Las cajas se llaman **Beelink GTR9 Pro**, **GMKtec EVO-X2**, **Framework Desktop** |

**Nunca usar "Strix Halo" frente a un cliente.** Es vocabulario de foro.

### Y el problema comercial de fondo, que es real

Un socio de un estudio jurídico en Santa Cruz **ha oído hablar de** NVIDIA, Dell, HP, Lenovo,
ASUS, Apple, AMD. **No ha oído hablar de** Beelink ni GMKtec.

Tres formas de resolverlo:

| Salida | Cómo | Costo |
|---|---|---|
| **A. Marca propia** ✅ | La caja es **"Onia Box"**. El fabricante no aparece. El cliente compra nuestra reputación, no la de Beelink | Marginal (logo + packaging) |
| **B. Decir el chip, no la caja** ✅ | En la ficha técnica: *"procesador **AMD Ryzen AI Max+ 395**"*. AMD sí es marca conocida | Cero |
| **C. Ir a OEM reconocido** | GB10 de **ASUS, Dell, HP o Lenovo** | +USD 1.000/unidad y se rompe la regla de comprar de fábrica |

**Recomendación: A + B.** Marca propia y ficha técnica con el nombre de AMD. Reservar C para el
cliente corporativo que exija logo conocido — y ahí el sobreprecio se le traslada.

> Esto **refuerza** que la marca propia no es un capricho de margen: es lo que resuelve la
> objeción de "¿y esta marca quién es?".

---

## 2. El catálogo de modelos — no sólo Qwen

### ⚠️ Primero, lo que decide: la licencia

**Vender una caja con el modelo preinstalado es redistribución comercial.** Ahí las licencias
sí muerden.

| Licencia | Qué implica para nosotros |
|---|---|
| **Apache 2.0 / MIT** ✅ | Licencias OSI reales: uso comercial, modificación y **redistribución sin restricciones de campo de uso**. **Las más simples para vender** |
| **Llama** ⚠️ | Comercialmente usable (el umbral es 700 M de usuarios activos — irrelevante para nosotros), pero **mete tres restricciones que no existen en Apache/MIT**, y **no se pueden usar sus salidas para entrenar otros modelos** que no sean Llama |
| **Gemma** ⚠️⚠️ | Sin umbral de ingresos, pero **retiene un derecho de restricción remota**, los derivados deben arrastrar sus términos, y es **la más explícita en exigir restricciones ejecutables en los contratos con el cliente final** |

**Consecuencia práctica:** si preinstalamos Gemma, tendríamos que meter cláusulas de Google en
nuestro contrato con el estudio jurídico. Si preinstalamos Apache 2.0, no.

**Regla del producto: preinstalar sólo Apache 2.0 o MIT.** Llama y Gemma quedan como opción a
pedido del cliente, con su licencia aceptada por él.

[La trampa de las licencias open-weight — Promise Legal](https://blog.promise.legal/open-weight-ai-license-trap-startups/) ·
[Monetizar LLM open source — WCR Legal](https://wcr.legal/monetizing-open-source-llms-licensing-guide/) ·
[Licencias clásicas vs de modelo](https://wcr.legal/oss-licenses-vs-ai-model-licenses/) ·
[Lista de LLM de uso comercial](https://github.com/eugeneyan/open-llms)

### Los candidatos reales

| Modelo | Licencia | Tamaños | Fuerte en | ¿Para nosotros? |
|---|---|---|---|---|
| **Qwen3** | **Apache 2.0** | 0,6B → 235B | General, multilingüe, código. **Lidera en español** | ✅ **Base del catálogo** |
| **Mistral Small 3.x** | **Apache 2.0** | ~24B | Eficiencia, europeo, buen español | ✅ **Alternativa principal** |
| **DeepSeek R1 / V3** | **MIT** | distills desde 7B | **Razonamiento y matemática** | ✅ Para tareas de análisis |
| **Phi-4** | **MIT** | 14B | **Cabe en 8 GB** — el más fácil de hospedar | ✅ Para la gama chica |
| **gpt-oss 20B / 120B** | **Apache 2.0** | 20B / 120B | Pesos abiertos de OpenAI. El de 120B pide 65–70 GB | ✅ El 120B entra en 128 GB |
| **IBM Granite** | **Apache 2.0** | varios | Orientado a empresa, uso de herramientas | ✅ Vale probarlo |
| **Salamandra** (BSC) | abierta | 2B / 7B | **Entrenado en español, catalán, gallego y euskera** | ✅ Probar para español puro |
| Llama 3.3 70B / Llama 4 Scout | Llama | 70B / — | **Contexto largo (hasta 10 M tokens)** | ⚠️ Sólo a pedido |
| Gemma 3 | Gemma | 27B y otros | **140+ idiomas** | ⚠️ Licencia pegajosa |
| GLM-5.x | variable | grande | Razonamiento tope | ⚠️ No entra en una caja |

### Lo que dicen las evaluaciones en español

Los mejores open source para español en 2026: **Qwen3-235B-A22B**, **Llama-3.1-8B-Instruct** y
**Qwen3-14B**.

O sea: **Qwen sí lidera en español** — la recomendación no estaba mal, pero ahora está
comparada, y hay alternativas Apache 2.0 reales (Mistral, DeepSeek, Phi-4) para no depender de
un solo proveedor.

[Mejor LLM open source para español — SiliconFlow](https://www.siliconflow.com/articles/en/best-open-source-llm-for-spanish) ·
[Modelos para correr local](https://huggingface.co/blog/daya-shankar/open-source-llm-models-to-run-locally) ·
[Leaderboard abierto](https://llm-stats.com/leaderboards/open-llm-leaderboard)

### 🇧🇴 Latam-GPT — a seguir, todavía no a usar

Modelo regional entrenado con **más de 8 TB** de información latinoamericana, con corpus en
**español, portugués y lenguas indígenas: quechua, guaraní y mapudungun**, respetando sus
estructuras gramaticales propias.

**Pero:** *no es un chat interactivo, es una base de datos entrenada* pensada como cimiento para
que otros construyan aplicaciones.

**Relevancia para Bolivia:** quechua, aymara y guaraní son idiomas oficiales. Si Latam-GPT
madura a versión conversacional, es **el modelo obvio para sector público y salud rural**.
Anotarlo y revisarlo en 6 meses, no construir sobre él ahora.

[Latam-GPT](https://www.latamgpt.org/en) · [Euronews](https://www.euronews.com/next/2026/02/12/what-is-latam-gpt-latin-americas-spanish-and-portuguese-ai-model) · [Brookings](https://www.brookings.edu/articles/latam-gpt-and-the-search-for-ai-sovereignty/) · [GitHub](https://github.com/latam-gpt)

---

## 3. Modelo por gama — con alternativa, no uno solo

| Gama | Primera opción | Alternativa a medir | Por qué la alternativa |
|---|---|---|---|
| **Vista** | Modelo de visión ≤ 3B | — | — |
| **Recepción** | **Qwen3 8B** | **Phi-4 14B** (MIT) · **LFM2.5 8B-A1B** (169 t/s medidos) | Phi-4 es más liviano; LFM es el más rápido |
| **Expediente** | **Qwen3 30B-A3B MoE** | **Mistral Small 3.x** · **gpt-oss 120B** si el cliente paga los 128 GB | Mistral es Apache y muy eficiente |
| **Taller** | **Qwen3-Coder** (101 t/s medidos) | **DeepSeek R1 distill** | DeepSeek es MIT y fuerte en razonamiento |
| **Central** | Qwen3 70B | **Llama 3.3 70B** si el cliente necesita contexto larguísimo | Llama 4 Scout llega a 10 M tokens |

**Regla:** el catálogo lleva **dos modelos por gama**, se miden los dos en la unidad de prueba,
y se instala el que gane. Depender de un solo proveedor de modelos es un riesgo innecesario
cuando cambiarlo cuesta un `ollama pull`.

---

## 4. Qué cambia

1. **Dejar de decir "Strix Halo".** Es **AMD Ryzen AI Max+ 395**, y la caja es **Onia Box**.
2. **La marca propia resuelve una objeción comercial real**, no sólo margen.
3. **Preinstalar sólo Apache 2.0 o MIT.** Gemma obligaría a meter cláusulas de Google en
   nuestros contratos.
4. **Qwen sigue siendo la base** — lidera en español — **pero con alternativa medida en cada
   gama**: Mistral, DeepSeek, Phi-4, gpt-oss.
5. **Latam-GPT en el radar** por quechua, aymara y guaraní — revisar en 6 meses.

---

## Fuentes

- [Trampa de licencias open-weight — Promise Legal](https://blog.promise.legal/open-weight-ai-license-trap-startups/) · [WCR Legal — monetizar](https://wcr.legal/monetizing-open-source-llms-licensing-guide/) · [WCR Legal — licencias comparadas](https://wcr.legal/oss-licenses-vs-ai-model-licenses/) · [TechCrunch — restricciones en licencias "abiertas"](https://techcrunch.com/2025/03/14/open-ai-model-licenses-often-carry-concerning-restrictions/)
- [Mejor LLM open source para español](https://www.siliconflow.com/articles/en/best-open-source-llm-for-spanish) · [Modelos locales 2026](https://huggingface.co/blog/daya-shankar/open-source-llm-models-to-run-locally) · [open-llms (GitHub)](https://github.com/eugeneyan/open-llms)
- [Latam-GPT](https://www.latamgpt.org/en) · [Euronews](https://www.euronews.com/next/2026/02/12/what-is-latam-gpt-latin-americas-spanish-and-portuguese-ai-model) · [Brookings](https://www.brookings.edu/articles/latam-gpt-and-the-search-for-ai-sovereignty/)
