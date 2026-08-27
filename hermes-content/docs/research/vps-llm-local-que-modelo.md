# LLM local en el VPS: qué modelo y con qué configuración

Investigación 2026-08-23. Hardware medido: Hostinger, 4 vCPU / 15 GB / sin GPU, **steal time
93-95%** (la VM recibe 5-7% de su CPU), 3,9 GB en swap, compartida con Supabase, n8n, Chatwoot,
4 Next.js, Temporal+Elasticsearch y transcripción. Todo verificado contra código fuente o docs
oficiales, con URL; lo que no pude verificar dice **NO VERIFICADO**.

## Veredicto

1. **No correr ningún LLM local en esta máquina.** Con 5-7% de CPU real, una API cuesta ~58x
   menos que los dos núcleos que se comía, y entrega un modelo mucho mejor (§D).
2. **`qwen2.5:3b`, el que corría, es de licencia NO COMERCIAL.** Borrarlo (§C).
3. Si igual se enciende, las dos config que importan son `CPUQuota=100%` **y** un Modelfile con
   `num_thread 1`. La primera sin la segunda **empeora** el problema (§B2).

---

## A) Por qué quemaba CPU "estando ocioso"

**Lo más probable es que NO estuviera ocioso.** Un cliente HTTP bloqueado esperando respuesta
figura al 0,6% de CPU. Con 93-95% de steal, una generación que en una máquina sana toma 30 s acá
tarda horas. 193% de CPU del guest con avance casi nulo es el síntoma esperado.

| Sospecha | Veredicto | Evidencia |
|---|---|---|
| Busy-wait de hilos | **VERIFICADO, acotado** | `--poll` default **50**: `ggml_graph_compute_poll_for_work()` gira `1024*128*poll` = **6.553.600 rondas** de `ggml_thread_cpu_relax()` antes de dormir, **entre cada grafo (cada token)**. Ollama **no pasa `--poll`** (0 coincidencias en `llm/llama_server.go`). Fuente: `ggml/src/ggml-cpu/ggml-cpu.c` |
| Busy-wait **en reposo** | **NO VERIFICADO** | Sin issue en `ggml-org/llama.cpp` ni `ollama/ollama` (busqué idle, busy wait, spin, cpu usage no requests). El código dice lo contrario: agotado el poll, el hilo entra en `ggml_cond_wait` (bloqueo real) |
| `--log-verbosity 4` | **VERIFICADO: no es config de ustedes** | Lo hardcodea ollama en `appendLlamaServerLogArgs()`, `llm/llama_server.go:573-579`. Default de llama.cpp = 3; 4 = "trace". Issue **abierto** [ollama#16897](https://github.com/ollama/ollama/issues/16897) (2026-06-25). Cuesta I/O por token, no explica 193% |
| `--context-shift` | **NO VERIFICADO como causa** | Hay [#27515](https://github.com/ggml-org/llama.cpp/issues/27515) (abierto, crash con `--no-kv-offload`) y #25437 (`prompt_clear()` no libera checkpoints), nada de busy-wait. Ollama lo agrega solo si `config.ContextShift` está activo (`llama_server.go:794`) |
| `--no-mmap` | **NO VERIFICADO como causa de CPU** | **Deprecado** en favor de `--load-mode`. Sin mmap el modelo va a RAM anónima y no se puede descartar: empeora RAM/swap (ya hay 3,9 GB), no CPU |
| keep-alive residente | **VERIFICADO que no gasta CPU** | Mantiene el modelo en RAM (default 5m), pero los hilos duermen en `cond_wait`. Ocupa RAM, no CPU |

**El issue que explica el caso entero:** [ollama#17916](https://github.com/ollama/ollama/issues/17916),
**ABIERTO, creado 2026-08-21** (dos días antes de esto): *"Default n_threads ignores cgroup CPU
quota and cpuset: ~45x throughput collapse in CPU-limited containers"*. Textual: *"llama.cpp's
spin-wait barriers convoy against CFS throttling and generation throughput collapses by roughly
45x"*. Misma máquina y modelo, variando solo `num_thread`: **8 hilos = 0,27 tok/s · 4 = 12,07
tok/s · 2 = 9,09 tok/s**. Es el patrón del VPS: CPU capada + hilos de más = quemar CPU sin
avanzar. El autor lo resume: *"nothing errors, the model just runs ~3 seconds per token"*.

---

## B) La configuración que lo evita, con cualquier modelo

### B1. Techo duro (systemd)

Archivo **`/etc/systemd/system/ollama.service.d/override.conf`** (ruta confirmada en
`docs/linux.mdx:131` de ollama; o `sudo systemctl edit ollama`):

```ini
[Service]
# CPUQuota se mide sobre UN núcleo: 100% = 1 núcleo, 200% = 2. Con 93-95% de steal, uno.
CPUQuota=100%
CPUWeight=20
MemoryMax=3G
Environment="OLLAMA_KEEP_ALIVE=0"
Environment="OLLAMA_MAX_LOADED_MODELS=1"
Environment="OLLAMA_NUM_PARALLEL=1"
Environment="OLLAMA_MAX_QUEUE=8"
Environment="OLLAMA_CONTEXT_LENGTH=2048"
```
```bash
sudo systemctl daemon-reload && sudo systemctl restart ollama
```

`CPUQuota=` textual del man de systemd: *"The percentage specifies how much CPU time the unit
shall get at maximum, relative to the total CPU time available on one CPU"*, con el ejemplo
*"CPUQuota=20% ensures that the executed processes will never get more than 20% CPU time on one
CPU"*. Va en `[Service]`; viene sin default. Defaults reales leídos de `ollama/envconfig/config.go`
y `docs/faq.mdx`:

| Variable | Default real | Qué poner y por qué |
|---|---|---|
| `OLLAMA_KEEP_ALIVE` | `5m` | **`0`** = descarga el modelo apenas responde (`sched.go:386`: con `sessionDuration <= 0` va a `expiredCh` sin timer). Negativo = infinito, nunca acá |
| `OLLAMA_MAX_LOADED_MODELS` | **3 en CPU** | **`1`**. El default de 3 puede meter 3 modelos en RAM sobre una máquina que ya swappea |
| `OLLAMA_NUM_PARALLEL` | `1` | Dejar en `1`. La RAM escala con `NUM_PARALLEL * CONTEXT_LENGTH` |
| `OLLAMA_MAX_QUEUE` | `512` | **`8`**. Fallar rápido con 503 en vez de acumular horas de cola |
| `OLLAMA_CONTEXT_LENGTH` | 4k/32k/256k según memoria | **`2048`**. Menos KV cache, menos RAM |

### B2. La trampa: `CPUQuota` SOLO puede EMPEORARLO

**`OLLAMA_NUM_THREADS` NO EXISTE.** Verificado leyendo la lista completa de env vars en
`ollama/envconfig/config.go`. El issue #17916 lo dice textual: *"There is no environment variable
for this; `num_thread` only comes from request options or a Modelfile."* Con el quota puesto pero
ollama eligiendo hilos por los núcleos del host, caés justo en el colapso de 45x. Hay que fijarlos
por Modelfile, y llamar **siempre** al derivado (repetir en cada `pull`):

```
FROM qwen2.5:0.5b
PARAMETER num_thread 1
PARAMETER num_ctx 2048
```
```bash
ollama create onia-cpu -f ./Modelfile
```

> **Regla: `num_thread` <= `CPUQuota / 100%`.** Con `CPUQuota=100%`, `num_thread 1`.

Si alguna vez corren `llama-server` directo (sin ollama): **`--poll 0`** apaga el spin y manda los
hilos a dormir de inmediato. Ollama no expone ese flag.

---

## C) Qué modelo

Tamaños tirados en vivo de `registry.ollama.ai`; licencias del model card de HF. RAM en uso ≈
**disco + 0,3 GB** (a 2048 de contexto el KV da 25-70 MB calculado, más ~0,3 GB del proceso;
estimado, no medido en el VPS).

| Modelo | Disco | Cuant. | Licencia exacta | ¿Comercial? | Alcanza para / NO |
|---|---|---|---|---|---|
| `qwen2.5:0.5b` | 0,37 GiB | Q4_K_M | `apache-2.0` | **Sí, libre** | Clasificar, extraer campos, rutear. NO redactar para cliente |
| `qwen3:0.6b` | 0,49 GiB | Q4_K_M | `apache-2.0` | **Sí, libre** | Ídem, pero ver aviso de *thinking* |
| `qwen2.5:1.5b` | 0,92 GiB | Q4_K_M | `apache-2.0` | **Sí, libre** | Resúmenes cortos. NO razonamiento ni fiscal boliviano |
| `llama3.2:1b` | 1,23 GiB | Q8_0 | `llama3.2` | Con condiciones | Ídem, con letra chica |
| `qwen3:1.7b` | 1,27 GiB | Q4_K_M | `apache-2.0` | **Sí, libre** | Mejor calidad, ya inviable a 5% de CPU |
| `granite3.3:2b` | 1,44 GiB | Q4_K_M | `apache-2.0` | **Sí, libre** | Ídem |
| `gemma2:2b` | 1,52 GiB | Q4_0 | `gemma` | Con condiciones | Ídem, con política mutable |
| `smollm2:1.7b` | 1,70 GiB | Q8_0 | `apache-2.0` | **Sí, libre** | Q8 pesa el doble sin ganar tanto |
| `llama3.2:3b` | 1,88 GiB | Q4_K_M | `llama3.2` | Con condiciones | Fuera de presupuesto de CPU |
| **`qwen2.5:3b`** (el que corría) | 1,80 GiB | Q4_K_M | `qwen-research` | 🔴 **NO** | **Borrar** |
| `phi3.5:3.8b` | 2,03 GiB | Q4_0 | `mit` | **Sí, libre** | Fuera de presupuesto de CPU |

**🔴 El modelo que corría es de licencia NO COMERCIAL.** El propio blob de licencia que ollama
distribuye con `qwen2.5:3b` empieza con *"Qwen RESEARCH LICENSE AGREEMENT"* (bajado del registry,
no inferido). En HF es `license: other` / `license_name: qwen-research`. Textual: §1.i *"'Non-
Commercial' shall mean for research or evaluation purposes only"*; §2.a licencia *"FOR NON-
COMMERCIAL PURPOSES ONLY"*; §2.b *"If you are commercially using the Materials, you shall request
a license from us"*. Es la excepción dentro de su familia: 0.5B y 1.5B **sí** son Apache-2.0. No
asumir licencia por familia, verificar por tamaño.

**Los "con condiciones".** *Llama 3.2*: cláusula 700M MAU, atribución visible *"Built with Llama"*,
todo derivado distribuido debe llamarse empezando con "Llama"; repos gated. *Gemma 2*: permite
comercial pero incorpora la Prohibited Use Policy, que dice *"Google reserves the right to update
this Gemma Prohibited Use Policy from time to time"* - puede cambiar después de desplegado, y si se
redistribuye (Onia Box) hay que trasladar esas restricciones al contrato del cliente. NO VERIFICADO:
el frontmatter crudo de Gemma dio 401 por repo gated. *Qwen3*: licencia limpia, pero **el modo
"thinking" viene activado por defecto** (*"By default, Qwen3 has thinking capabilities enabled"*) y
el model card recomienda **32.768 tokens** de generación en ese modo: descalificante a 5% de CPU.
Solo con `enable_thinking=False`.

**Recomendación: ninguno.** La máquina recibe 5-7% de su CPU y ya swappea 3,9 GB; lo que corre ahí
es lo que factura y un LLM local compite por el mismo núcleo; Hostinger ya avisó que se agotaron los
reinicios de CPU. El mejor caso realista de `qwen2.5:0.5b` acá es del orden de **1-2 tok/s**
(extrapolado de los 12 tok/s de #17916 en máquina sana, escalado por el steal - **estimación, no
medición**): una respuesta de 200 tokens = 2-3 minutos. **Si igual se enciende:** `qwen2.5:0.5b`
(Apache-2.0, 0,37 GiB, sin thinking), `num_thread 1`, `CPUQuota=100%`, y **solo para clasificar,
extraer o rutear** - jamás para generar texto que vea un cliente.

---

## D) La alternativa de API

Precios leídos en vivo de las páginas oficiales el 2026-08-23. USD por 1M tokens:

| Proveedor | Modelo | Input | Output | Free tier | Fuente |
|---|---|---|---|---|---|
| OpenAI | gpt-5-nano | **0,05** | 0,40 | No hay | developers.openai.com/api/docs/pricing |
| Groq | gpt-oss-20b | 0,075 | 0,30 | Sí, límites no publicados | console.groq.com/docs/models |
| Google | gemini-2.5-flash-lite | 0,10 | 0,40 | **Sí, "Sin costo"** | ai.google.dev/gemini-api/docs/pricing (pág. fechada 2026-08-13) |
| Mistral | ministral-3b-latest | 0,10 | 0,10 | Plan Free: USD 10/mes en créditos | mistral.ai/pricing/api |
| Together | LFM2.5-8B-A1B | 0,03 | 0,12 | "Start for free", sin monto | together.ai/pricing |
| Anthropic | Claude Haiku 4.5 | 1,00 | 5,00 | Créditos, sin cifra | platform.claude.com/docs/en/docs/about-claude/pricing |

**NO VERIFICADO:** los límites numéricos (RPM/TPM/RPD) del free tier de Gemini y de Groq; las
páginas confirman que existe pero ya no publican cifras (Gemini redirige a AI Studio, que exige
login). **Obsoleto:** Gemini 2.0 Flash-Lite, retirado el 1-jun-2026.

**El cálculo.** El VPS cuesta **USD 21/mes** (`FINANCE_LOG_2026.md`, línea del 2026-05-30) por
4 vCPU, o sea ~5,25 USD por vCPU/mes: **los dos núcleos que se comía llama-server = ~10,50 USD/mes.**
Contra un uso esporádico realista de 1M tokens de input + 200K de output al mes:

| Opción | Costo/mes |
|---|---|
| **2 núcleos del VPS ocupados por el LLM local** | **~10,50 USD** |
| Gemini 2.5 Flash-Lite | 0,18 USD |
| gpt-5-nano | 0,13 USD |
| Together LFM2.5-8B-A1B | 0,05 USD |
| Gemini free tier, si el volumen entra | 0,00 USD |

**~58x más caro local**, y el modelo local es 0,5B contra uno de clase Flash. El punto de equilibrio
contra Gemini Flash-Lite está en ~58M tokens de input al mes: dos órdenes de magnitud por encima de
lo que ONIA consume hoy. **El único argumento que sobrevive a favor de local es que los datos no
salgan de la máquina** (caso Onia Box on-premise, que es otro hardware). El costo no lo es.

---

## Checklist para el día que se reactive

- [ ] `override.conf` (§B1) aplicado + `daemon-reload`; Modelfile derivado con `num_thread 1` y
      el servicio llamando al derivado, no al base
- [ ] `qwen2.5:3b` borrado del disco (licencia no comercial)
- [ ] `systemd-cgtop` mirado 10 minutos con carga real, no un `curl` que devuelve 200
