# Confiabilidad de los modelos + lista de compra final (2026-08-06)

Décima parte. Dos preguntas de Sergio: **¿son confiables estos modelos que no conozco?** y
**¿qué compramos exactamente para que funcione?**

---

## PARTE 1 — ¿Son confiables?

### 🔑 La distinción que resuelve el 80 % de la preocupación

**Correr un modelo chino OFFLINE no es lo mismo que usar una API china.**

| | API china (DeepSeek app, etc.) | Modelo abierto corriendo local |
|---|---|---|
| ¿A dónde van los datos? | **A sus servidores** | **A ningún lado. No hay red** |
| ¿Puede "llamar a casa"? | Sí | **No. Son archivos de números** |
| Riesgo principal | Fuga de datos | Otro — ver abajo |

Un modelo local sin internet **no puede filtrar nada**. No es una opinión: no hay canal. Ese es
el argumento que le das al estudio jurídico, y es cierto.

**Pero eso no significa "cero riesgo".** Los riesgos reales son otros tres.

### Riesgo 1 — Pesos manipulados (el más concreto) 🔴

Está demostrado que **se puede convertir un modelo abierto en un backdoor en 1 hora y por menos
de USD 100**. Tras el afinado, la salida del modelo pasó de **0 % a 99 % de código vulnerable a
ejecución remota**, en dominios en los que nunca se entrenó.

Y lo peor: **el modelo con backdoor mantuvo 83,5 % en HumanEval contra 86,6 % del limpio — sin
diferencia estadísticamente significativa.** O sea: **el backdoor no se detecta por benchmark.**

> **Ojo: esto NO es "el fabricante puso un backdoor". Es que cualquiera puede agarrar un modelo,
> envenenarlo y volver a subirlo.** Es un riesgo de cadena de suministro, igual que descargar
> software de un sitio pirata.

**Mitigación — y es simple:**
- Descargar **sólo del repositorio oficial de la organización original** en Hugging Face.
- **Verificar checksums** de cada archivo.
- **Nunca** usar pesos subidos por cuentas anónimas o "optimizados por" terceros.
- Congelar la versión exacta que probamos y no cambiarla sola.

[Demostración del backdoor — Katie Paxton-Fear](https://x.com/InsiderPhD/status/2077037121869664410)

### Riesgo 2 — Alineamiento y seguridad de las respuestas

**GLM-5.2 no rechazó ninguna de las tareas ofensivas de ciberseguridad ni de biología que se le
dieron** en una evaluación reciente. Y los salvaguardas de un modelo abierto **se pueden quitar
modificando los pesos**.

**Qué significa para nosotros:**
- Para **Onia Expediente** (resumir contratos internos): prácticamente irrelevante.
- Para **Onia Recepción** (chatbot de cara al público): **sí importa** — no querés que el bot de
  una clínica responda cualquier cosa. Ahí hay que poner filtros nuestros arriba del modelo.

### Riesgo 3 — Sesgos y comportamientos difíciles de detectar

Es una **pregunta legítima y abierta**: si un modelo entrenado en China, con datos chinos y por
ingenieros chinos, puede contener sesgos o comportamientos sutiles difíciles de detectar. No
está probado, pero tampoco descartado.

El consenso corporativo es razonable: **un despliegue aislado con controles fuertes puede ser
aceptable, pero después de una revisión formal de riesgo.** O sea: no se prohíbe, se evalúa.

[Riesgos y beneficios de modelos chinos — F5 Labs](https://www.f5.com/labs/articles/chinese-open-weight-ai-models-cybersecurity-risks-and-rewards) ·
[¿Son seguros para empresas? — Layer3Labs](https://www.layer3labs.io/guides/chinese-ai-models-security-risks) ·
[La brecha de seguridad — TechCrunch](https://techcrunch.com/2026/08/04/open-weight-ai-models-are-catching-up-to-the-frontier-the-safety-gap-remains/)

### Quién está detrás de cada uno

| Modelo | Quién lo hizo | Respaldo | Reconocimiento |
|---|---|---|---|
| **Qwen3** | **Alibaba** | Empresa que cotiza en bolsa, gigante | ✅ Alto |
| **Seed-OSS 36B** | **ByteDance** | Dueños de TikTok | ✅ Alto (por TikTok) |
| **Mistral Small** | **Mistral AI** 🇫🇷 | Francesa, muy financiada, europea | ✅ Alto en Europa |
| **Phi-4** | **Microsoft** | — | ✅✅ Máximo |
| **gpt-oss** | **OpenAI** | — | ✅✅ Máximo |
| **Hermes 4.3** | **Nous Research** 🇺🇸 | Colectivo chico, pero construido sobre Seed | ⚠️ Bajo fuera del nicho |
| GLM | Zhipu / Z.ai | China | ⚠️ Bajo |
| Hunyuan | Tencent | China, gigante | Medio |
| DeepSeek | DeepSeek | China | Medio-alto (por prensa) |

### 🎯 La jugada comercial: dos catálogos

En vez de discutir con el cliente que desconfía, **le das a elegir**:

| Catálogo | Modelos | Para quién |
|---|---|---|
| **Rendimiento** | Qwen3 · Seed-OSS · Hermes | El que quiere lo mejor y entiende que corre offline |
| **Occidental** | **Phi-4 (Microsoft)** · **Mistral (Francia)** · **gpt-oss (OpenAI)** | El cliente conservador: estudio jurídico grande, financiera, sector público |

**Los tres del catálogo occidental son Apache 2.0 o MIT y corren en la misma caja.** Cambiar de
modelo cuesta un comando.

Eso convierte una objeción en una opción de venta — y no te obliga a defender nada.

---

## PARTE 2 — La lista de compra completa

### A. Hardware

| # | Qué | Por qué | USD aprox. | Dónde |
|---|---|---|---|---|
| 1 | **Beelink GTR9 Pro 128 GB** | El equipo. Mejores térmicas de su categoría, dual 10 GbE | **~2.000** | Fábrica (China) |
| 2 | **SSD NVMe 2 TB** (mínimo) | **Cinco modelos a medir son ~120 GB sólo en pesos**, más sistema, contenedores y documentos del cliente | 120–200 | China o plaza |
| 3 | **UPS 1000–1500 VA** | Santa Cruz tiene cortes. Un corte durante una carga de modelo corrompe archivos | 100–200 | **Plaza** |
| 4 | Cable de red Cat6 + switch si hace falta | Ethernet antes que WiFi: más estable y **esquiva el tema ATT** | 20–50 | Plaza |
| 5 | Monitor, teclado y mouse | Sólo para la instalación inicial; después es todo remoto | ya lo tenés | — |
| 6 | *(opcional)* Ventilación o gabinete ventilado | Si va a un lugar caluroso sin aire | 50–150 | Plaza |

**Total de la unidad de prueba: ~USD 2.300–2.500 puesta y funcionando.**

> **Regla del embarque:** el equipo y el SSD vienen de fábrica. **UPS, cables y ventilación se
> compran en Santa Cruz** — es lo voluminoso y barato, no se paga flete por eso.

### B. Software — **todo gratis**

| Capa | Qué | Licencia | Costo |
|---|---|---|---|
| Sistema | Linux, **kernel ≥ 6.18.4** | GPL | **0** |
| Contenedores | Docker o Podman | Apache 2.0 | **0** |
| Motor | Ollama o llama.cpp | MIT | **0** |
| Interfaz | Open WebUI | MIT | **0** |
| Vector store | Qdrant | Apache 2.0 | **0** |
| Parseo de documentos | Apache Tika | Apache 2.0 | **0** |
| Automatización | n8n autohospedado | Sustainable Use | **0** |
| Acceso remoto | Tailscale (plan gratuito) o WireGuard | — | **0** |
| **Modelos** | Qwen3 · Seed-OSS · Hermes · Mistral · Phi-4 | **Apache 2.0 / MIT** | **0** |

**El stack de software cuesta cero.** Todo el costo del producto es hardware más nuestro
trabajo — que es exactamente donde queremos que esté el margen.

### C. Los cinco modelos a descargar y medir

~120 GB en total. **Descargar sólo de los repositorios oficiales y verificar checksums.**

| Modelo | Tamaño Q4 aprox. | Repositorio oficial |
|---|---|---|
| Qwen3 30B-A3B | ~20 GB | Alibaba / Qwen en Hugging Face |
| Seed-OSS 36B Instruct | ~22 GB | `ByteDance-Seed/Seed-OSS-36B-Instruct` |
| Hermes 4.3-36B (GGUF) | ~22 GB | `NousResearch/Hermes-4.3-36B-GGUF` |
| Mistral Small 3.x | ~14 GB | Mistral AI |
| Phi-4 14B | ~8 GB | Microsoft |

---

## PARTE 3 — Qué queda por decidir antes de comprar

1. **Cotizar el Beelink a fábrica** y verificar que sea fábrica real (checklist de `playbook §4.6`).
2. **Confirmar si el SSD conviene traerlo o comprarlo acá** — depende del precio en plaza con la
   escasez de memoria actual.
3. **Definir dónde vive la caja de prueba** — necesita enchufe estable, red y un lugar no muy
   caluroso.

---

## Resumen en tres líneas

- **Confiabilidad:** offline no hay fuga de datos; el riesgo real es descargar pesos
  manipulados, y se resuelve bajando sólo de repositorios oficiales y verificando checksums.
- **La objeción del cliente desconfiado se responde con un catálogo occidental** (Microsoft,
  Mistral, OpenAI), no discutiendo.
- **Compra total de arranque: ~USD 2.300–2.500.** El software es gratis; el margen está en el
  hardware y en nuestro trabajo.

---

## Fuentes

- [Modelos chinos: riesgos y beneficios — F5 Labs](https://www.f5.com/labs/articles/chinese-open-weight-ai-models-cybersecurity-risks-and-rewards)
- [¿Son seguros para empresas? — Layer3Labs](https://www.layer3labs.io/guides/chinese-ai-models-security-risks)
- [La brecha de seguridad de los modelos abiertos — TechCrunch](https://techcrunch.com/2026/08/04/open-weight-ai-models-are-catching-up-to-the-frontier-the-safety-gap-remains/)
- [Demostración de backdoor por <USD 100](https://x.com/InsiderPhD/status/2077037121869664410)
- [Lawfare — presión regulatoria sobre pesos abiertos](https://www.lawfaremedia.org/article/knives-are-out-for-open-weight-ai-models)
- Modelos y licencias: `ONIA_BOX_MODELOS_RESTANTES_Y_LICENCIAS_20260806.md`
