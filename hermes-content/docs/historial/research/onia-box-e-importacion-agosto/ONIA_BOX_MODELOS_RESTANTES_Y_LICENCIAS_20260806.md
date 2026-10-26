# Los modelos restantes + qué significa "Apache" (2026-08-06)

Novena parte. Analiza Hunyuan, MiniMax, Hermes, GLM, Yi, Baichuan, Ernie y Seed-OSS con el
filtro de correr local, y explica de una vez qué es la licencia Apache y por qué la vengo
repitiendo.

---

## PARTE 1 — Qué es "Apache" y por qué decide

### El problema concreto

Los pesos de un modelo son la creación de alguien. **Nosotros no los vamos a usar: los vamos a
vender adentro de una caja.** Eso se llama **redistribución comercial**, y es el caso donde las
licencias importan de verdad. Usar un modelo para vos mismo es fácil; **venderlo adentro de un
producto es donde aparecen las condiciones**.

### Apache 2.0 y MIT — las libres de verdad

Son licencias **open source reconocidas por la OSI**. Lo que te dejan hacer:

| Podés | ¿Con condiciones? |
|---|---|
| Usarlo comercialmente | No |
| Modificarlo, afinarlo, cuantizarlo | No |
| **Venderlo adentro de un producto** | No |
| Usarlo en cualquier industria | **Sin restricciones de campo de uso** |
| Sin importar cuánto factures ni cuántos usuarios tengas | Sin umbrales |

**Lo único que tenés que hacer:** conservar el aviso de licencia y la atribución. Un archivo de
texto adentro del producto.

**Diferencia entre las dos:** MIT es más corta y simple. **Apache 2.0 agrega una concesión
explícita de patentes** — o sea, el autor se compromete a no demandarte por patentes sobre ese
modelo — y pide que declares si hiciste cambios. **Para un negocio, Apache 2.0 protege un poco
más.**

### Traducido a nuestro caso

> **Vendemos la Onia Box con Qwen3 adentro. Con Apache 2.0: es legal, no pagamos regalías, no
> metemos ninguna cláusula ajena en el contrato con el estudio jurídico, y nadie puede
> aparecer después a decir "esto no se puede usar para X".**

### Las otras — "pesos abiertos", que no es lo mismo que libre

Llama, Gemma y varias chinas usan **licencias propias**. No son open source: son *pesos
abiertos con condiciones*. Pueden traer topes de usuarios, restricciones geográficas, límites
de facturación, prohibiciones de uso, y **obligación de trasladarle esas reglas a tu cliente**.

**Analogía justa:** Apache/MIT es comprar una herramienta y que sea tuya. Una licencia propia
es más como una franquicia: la usás, pero venís con reglas — y tenés que hacérselas cumplir a
tu cliente también.

**Regla del producto: preinstalamos sólo Apache 2.0 o MIT.**

---

## PARTE 2 — Los modelos que faltaban

Recordatorio del filtro: techo de **128 GB** en la Onia Box.

### ✅ Seed-OSS 36B (ByteDance) — **el hallazgo del día**

| | |
|---|---|
| Tamaño | **36B** → ~20–24 GB en Q4 |
| Licencia | **Apache 2.0** ✅ |
| **Contexto** | **512.000 tokens** — cuatro veces el estándar de mercado |
| Publicado | 20-ago-2025, en GitHub y Hugging Face, con variantes Base e Instruct |
| Pensado para | **Razonamiento sobre documentos largos, bases de código y flujos multi-documento** |

**Por qué importa:** la gama **Onia Expediente** vive de leer documentos largos. Un contexto de
512K con licencia Apache y que entra cómodo en la caja **es exactamente el perfil que
necesitamos**. Entrenado con sólo 12T de tokens y aun así rinde bien en los benchmarks abiertos.

**Va directo a la lista de medición.**

[Seed-OSS — blog oficial ByteDance](https://seed.bytedance.com/en/blog/seed-oss-open-source-models-release) ·
[GitHub](https://github.com/ByteDance-Seed/seed-oss) ·
[Hugging Face](https://huggingface.co/ByteDance-Seed/Seed-OSS-36B-Instruct) ·
[MLQ](https://mlq.ai/news/bytedance-unleashes-seed-oss-36b-a-major-open-source-ai-model-family/)

### ✅ Hermes 4.3-36B (Nous Research) — y sí, se llama como nuestro bot

| | |
|---|---|
| Base | **Construido sobre el Seed-36B de ByteDance**, afinado por Nous |
| Tamaño | 36B → entra cómodo |
| Licencia | **Apache 2.0** ✅ |
| Tipo | Razonamiento **híbrido** (modo pensar / modo directo) |
| Dato | La variante entrenada de forma descentralizada (red Psyche) **iguala o supera** a su gemela centralizada — AIME25 69,3 vs 66,8; MMLU-Pro 80,7 vs 79,7 |

**Candidato real para la gama Expediente y Taller.** Hereda el contexto largo de Seed y suma
razonamiento.

[Hermes-4.3-36B — Hugging Face](https://huggingface.co/NousResearch/Hermes-4.3-36B) ·
[GGUF](https://huggingface.co/NousResearch/Hermes-4.3-36B-GGUF)

### ✅ GLM (Zhipu)

**GLM-5.2 sale bajo MIT o Apache 2.0, sin restricciones comerciales.** Licencia limpia.
Las versiones tope son demasiado grandes para la caja, pero **las variantes Air/chicas hay que
medirlas**. Es de los modelos chinos más fuertes en razonamiento.

### ✅ Hunyuan (Tencent)

**Hunyuan-A13B: MoE de 80B totales con 13B activos**, pesos abiertos desde el 27-jun-2025.
**Hunyuan Hy3 sale bajo MIT/Apache**, sin restricciones comerciales.

A 80B totales en Q4 ronda los **45–50 GB** → **entra en 128 GB**, aunque deja menos margen que
un 36B para el resto del stack. Vale medirlo.

### ⚠️ MiniMax — **alerta de licencia**

**MiniMax-M2.7 se publicó en marzo de 2026 bajo licencia de sólo investigación / no
comercial.** Hubo reacción de la comunidad y **MiniMax pasó a una licencia comunitaria más
amigable recién para el M3 siguiente**.

**Traducción: el M2.7 no se puede vender adentro de un producto.** Si algún día se usa MiniMax,
hay que verificar la licencia **de esa versión puntual**, no de la familia. Es el ejemplo
perfecto de por qué la licencia se lee antes de instalar.

### ❓ Ernie (Baidu), Yi (01.AI), Baichuan — sin confirmar

**Baidu liberó la serie ERNIE 4.5 en 2025**, pero **no pude confirmar sus términos de
licencia**. De Yi y Baichuan tampoco encontré confirmación de licencia y tamaños en fuentes
sólidas.

**No los descarto — los dejo sin verificar.** No voy a afirmar una licencia que no confirmé,
justamente porque es el dato del que depende poder venderlos.

---

## PARTE 3 — Tabla final, con el filtro aplicado

| Modelo | Origen | Params | Q4 aprox. | ¿Entra en 128 GB? | Licencia | Veredicto |
|---|---|---|---|---|---|---|
| **Qwen3 30B-A3B** | Alibaba | 30B / 3B act. | ~20 GB | ✅ y sobra | **Apache 2.0** | **1ª opción** |
| **Seed-OSS 36B** | ByteDance | 36B | ~20–24 GB | ✅ | **Apache 2.0** | ⭐ **medir — contexto 512K** |
| **Hermes 4.3-36B** | Nous | 36B | ~20–24 GB | ✅ | **Apache 2.0** | ⭐ **medir — razonamiento** |
| **Mistral Small 3.x** | Mistral | ~24B | ~14 GB | ✅ | **Apache 2.0** | medir |
| **Phi-4** | Microsoft | 14B | ~8 GB | ✅ | **MIT** | gama chica |
| **DeepSeek R1 distill** | DeepSeek | varios | varía | ✅ | **MIT** | razonamiento |
| **GLM (Air/chico)** | Zhipu | varios | varía | ✅ | **MIT/Apache** | medir |
| **Hunyuan-A13B** | Tencent | 80B / 13B act. | ~45–50 GB | ✅ ajustado | MIT/Apache | medir |
| **gpt-oss 120B** | OpenAI | 120B | 65–70 GB | ✅ ajustado | **Apache 2.0** | tope de la caja |
| Llama 4 Scout | Meta | 109B / 17B act. | 55–60 GB | ✅ | ⚠️ Llama | 2ª opción |
| Gemma 3 | Google | 27B | ~16 GB | ✅ | ⚠️ Gemma | sólo a pedido |
| **MiniMax M2.7** | MiniMax | 230B | — | — | ❌ **no comercial** | **prohibido vender** |
| **Kimi K2.6** | Moonshot | 1T | ~600 GB | ❌ **No** | MIT mod. | datacenter |
| Ernie 4.5 · Yi · Baichuan | Baidu · 01.AI · Baichuan | — | — | — | ❓ sin verificar | pendiente |

---

## PARTE 4 — Qué cambia

1. **Apareció un candidato mejor para Expediente:** **Seed-OSS 36B**, Apache 2.0, **512K de
   contexto** y entra cómodo. Documentos largos es justo lo que esa gama necesita.
2. **Hermes 4.3-36B** entra a la lista por razonamiento, también Apache 2.0.
3. **MiniMax queda prohibido** para venderlo preinstalado — licencia no comercial en M2.7.
4. **Kimi confirmado afuera.** 600 GB contra 128.
5. **La lista de medición pasa a cinco:** Qwen3 30B-A3B · Seed-OSS 36B · Hermes 4.3-36B ·
   Mistral Small · Phi-4. **Todos Apache 2.0 o MIT** — ninguno mete cláusulas en nuestros
   contratos.

---

## Fuentes

- [Seed-OSS — ByteDance](https://seed.bytedance.com/en/blog/seed-oss-open-source-models-release) · [GitHub](https://github.com/ByteDance-Seed/seed-oss) · [Hugging Face](https://huggingface.co/ByteDance-Seed/Seed-OSS-36B-Instruct) · [MLQ](https://mlq.ai/news/bytedance-unleashes-seed-oss-36b-a-major-open-source-ai-model-family/)
- [Hermes 4.3-36B — Nous Research](https://huggingface.co/NousResearch/Hermes-4.3-36B)
- [Modelos chinos comparados — GEO Toolbox](https://geotoolbox.ai/blog/chinese-ai-models-compared) · [TokenMix](https://tokenmix.ai/blog/best-chinese-ai-models-2026-comparison-guide) · [IntuitionLabs](https://intuitionlabs.ai/articles/chinese-open-source-llms-2025)
- [Modelos de pesos abiertos con licencia explotable comercialmente (GitHub)](https://github.com/xigh/open-weight-models) · [Tabla de 33 modelos open source](https://www.opencurious.com/open-source-ai-models)
- Licencias: [Promise Legal](https://blog.promise.legal/open-weight-ai-license-trap-startups/) · [WCR Legal](https://wcr.legal/oss-licenses-vs-ai-model-licenses/)
