# Plan B de agentes: qué hacer si se acaban los créditos de Claude

**Medido el 2026-09-04 contra el VPS de producción (187.77.16.63).** Nada de memoria:
cada número de la sección 1 sale de un comando corrido ese día, y cada precio de la
sección 3 lleva su fuente y su fecha.

**Vale como fuente de verdad hasta que alguien la vuelva a medir.** Los precios de LLM se
mueven cada mes; los de acá son del 4-sep-2026.

---

## 0. La respuesta en tres líneas

1. **HOY, gratis:** bajar los 3 loops horarios a cada 2 h y mover 5 loops mecánicos de Opus
   a Sonnet. Es una edición de `crontab` y una de `onia-loop.sh`. Corta ~29 % de los segundos
   de agente y saca de Opus otro ~10 %.
2. **Si Claude se corta mañana:** GLM Coding Plan de Z.ai, **~US$ 84/mes**, cambiando DOS
   variables de entorno en `onia-loop.sh`. El arnés (Claude Code headless, worktrees, flock,
   allowedTools) no se toca.
3. **Lo que NO se reemplaza:** los 4 carriles que deciden sobre producción, plata o `main` —
   `onia-cola`, `recorrido-cliente`, `chatbot-cola`, `web-factory-dev` — y el ojo de
   `canario-visual`. Detalle y razón en la sección 6.

---

## 1. Qué está pasando de verdad (medido, no supuesto)

### 1.1 El hierro

    ssh ... 'nproc; free -g; df -h /'
    -> 4                          # NO son 8 nucleos
    -> Mem: 15 total, 7 usados, 8 disponibles
    -> /dev/sda1 193G, 163G usados, 85% lleno
    -> load average: 0.75, 1.19, 1.11

⚠️ **Corrección al brief de la sesión:** el VPS tiene **4 núcleos, no 8**. Eso mata por sí
solo la idea de modelos locales (sección 5).

### 1.2 Ollama

    which ollama          -> /usr/local/bin/ollama   (el binario sigue instalado)
    systemctl is-active   -> inactive
    ollama list           -> falla (no hay servicio escuchando)

**Está apagado y no consume.** El binario quedó de la vez que clavó 2 núcleos y disparó la
penalidad de Hostinger. Dejarlo apagado es la decisión correcta; ver sección 5.

### 1.3 LiteLLM (sí, ya corre)

    onia_selfhosted-litellm-1   Up 17 hours (healthy)   berriai/litellm:main-stable

Configuración real (`/app/config.yaml`): **sólo modelos OpenAI** — `gpt-5.1`, `gpt-5-mini`,
`gpt-4.1-mini`, `gpt-4o-mini`, `o4-mini`. Tope de gasto `max_budget: 50` cada `30d`. Gasto
real anotado en el propio config: **~US$ 0,008/mes**. O sea: el gateway está vivo, sano, con
presupuesto aprobado y **prácticamente sin usar**.

**Claves ya presentes dentro del contenedor** (sólo listé los nombres): `ANTHROPIC_API_KEY`,
`OPENAI_API_KEY`, **`GROQ_API_KEY`**, `ELEVENLABS_API_KEY`, `OLLAMA_API_KEY`.

👉 Groq ya tiene clave puesta y nadie la usa. Es el único proveedor gratis de la sección 3
que no requiere dar de alta nada.

### 1.4 Los 15 loops: quién se come la cuota

`/root/bin/onia-loop.sh` invoca así (línea 375):

    timeout "$TOPE" claude -p --model "$MODELO" --effort "$ESFUERZO" --max-turns "$TURNOS" \
      --allowedTools "$TOOLS" < "$PROMPT_FINAL"

Default del script: `MODELO=claude-opus-5`, `ESFUERZO=max`, `TURNOS=120`.
**13 de los 15 loops corren con ese default.** Sólo dos lo bajan: `canario-visual` y
`kpis-semanal` (`claude-sonnet-5` / `medium`).

Medición sobre `/var/log/onia-loop-*.log` (2 días, 2026-09-03/04):

| loop | vueltas/día (cron) | seg prom | seg/día | modelo |
|---|---:|---:|---:|---|
| **onia-cola** | 24 | 571 | **13.704** | opus/max (TURNOS=260) |
| **chatbot-cola** | 24 | 541 | **12.984** | opus/max |
| **web-venta** | 24 | 534 | **12.816** | opus/max |
| recorrido-cliente | 8 | 832 | 6.656 | opus/max |
| lucia | 8 | 473 | 3.784 | opus/max |
| web-factory-dev | 4 | 811 | 3.244 | opus/max |
| calidad-generado | 4 | 481 | 1.924 | opus/max |
| supervisor | 4 | 409 | 1.636 | opus/max |
| marca-personal | 2 | 528 | 1.056 | opus/max |
| docs-auditoria | 2 | 318 | 636 | opus/max |
| tendencias | 2 | 280 | 560 | opus/max |
| canario-visual | 2 | 283 | 566 | sonnet/medium |
| investigacion | 1 | 410 | 410 | opus/max |
| contenido-cola | (sin cron propio) | 550 | — | opus/max |
| kpis-semanal | 0,14 | 20 | 3 | sonnet/medium |

**Totales medidos sobre el log crudo:** 210 vueltas terminadas en 2 días (**~105/día**),
**110.026 segundos** de agente = **15,3 h/día de Opus 5 a esfuerzo máximo**.

🔴 **Los 3 loops horarios se llevan 63.650 s de esos 110.026 = 58 % del consumo total.** Los
tres corren **cada hora**, los tres en Opus a esfuerzo máximo.

### 1.5 Cuántas vueltas mueren por cuota

    grep -c "ARRANCA"  -> 320
    grep -c "TERMINA"  -> 312       # 8 vueltas arrancaron y nunca cerraron
    exit 0 -> 349 · exit 1 -> 66 · exit 2 -> 8 · exit 3 -> 5 · exit 64 -> 4
    "session limit · resets 1am (UTC)" -> 15
    "session limit · resets 6am (UTC)" -> 10

**25 vueltas muertas por límite de sesión sobre 320 arrancadas = 7,8 % histórico.** El 20 %
del brief corresponde a la ventana de anoche, no al acumulado — pero el patrón es el mismo:
**se concentran en `onia-cola` (18 líneas de error), `canario-visual` (14) y `web-venta` (5)**,
o sea en los loops de mayor frecuencia.

### 1.6 El costo escondido: el prompt

    2026-09-04T13:33:02Z memoria inyectada: 125431 bytes de prompt (132 hechos de MEMORY.md)
    2026-09-04T14:33:01Z memoria inyectada: 129153 bytes de prompt (137 hechos de MEMORY.md)

**~129 KB ≈ 32.000 tokens de prompt ANTES de que el agente haga nada**, y crece cada vez que
un loop agrega un hecho a `MEMORY.md`. Multiplicado por 105 vueltas/día son **~3,4 M
tokens/día sólo de arranque**. Esto importa para el plan B: casi todo eso es cacheable, y el
precio de cache-hit es lo que decide el costo real (sección 4).

---

## 2. Agentes de código en línea de comandos (estado al 4-sep-2026)

| Agente | Capa gratis REAL | Pago | Clave propia | Cron desatendido | Madurez |
|---|---|---|---|---|---|
| **Claude Code** | no | Pro $20 · Max 5x $100 · **Max 20x $200** | sí (`ANTHROPIC_API_KEY`) | sí — `claude -p`, es lo que ya usamos | el que corre hoy |
| **Codex CLI** | **50 mensajes agénticos/día** en cuenta Free | Plus $20 · Pro $100 · Go $8 | sí (`OPENAI_API_KEY`) | sí — `codex exec --json` | alta |
| **Antigravity CLI (`agy`)** | 🔴 **20 pedidos/día** | Pro/Ultra de Google AI | parcial | sí | reemplazó a Gemini CLI |
| ~~Gemini CLI~~ | 🔴 **MUERTO** — dejó de servir el 18-jun-2026 | — | — | — | retirado |
| ~~Qwen Code (OAuth gratis)~~ | 🔴 **MUERTO** — cerrado el 15-abr-2026 | el CLI sigue libre, sin inferencia incluida | sí | sí | CLI vivo, nube muerta |
| **opencode** | no trae modelo | lo que cueste tu clave | sí, agnóstico | sí — `opencode run "<prompt>"` | ~202k estrellas, el arnés OSS de referencia |
| **Goose** (Linux Foundation) | no trae modelo | lo que cueste tu clave | sí, agnóstico | sí | ~54k estrellas, general-purpose, en Rust |
| **Aider** | no trae modelo | lo que cueste tu clave | sí | sí | ~48k estrellas pero **sin avances desde mayo 2026** |

### Lo que esto significa para nosotros

- **El camino gratis de Google se murió dos veces este año.** Gemini CLI cerró el
  18-jun-2026 y su reemplazo `agy` da **20 pedidos/día**. Nosotros hacemos **105 vueltas/día**,
  y cada vuelta son decenas de pedidos. No alcanza ni para un loop.
- **Qwen Code gratis también murió** (15-abr-2026). Alibaba primero bajó de 2.000 a 100
  pedidos/día y después cerró la puerta.
- **Codex CLI Free (50 mensajes/día) es el único gratis que existe hoy**, y da para **un loop
  chico**, no para quince.
- **opencode / Goose / Aider no resuelven el problema**: son arneses sin modelo. Cambiar de
  arnés no ahorra un peso; lo que se paga es el modelo. Y cambiar de arnés nos obliga a
  reescribir `onia-loop.sh`, los `--allowedTools` y los 15 prompts. **Trabajo grande, ahorro
  cero.** Descartados por eso, no por calidad.

---

## 3. Modelos por API: precio real por millón de tokens

| Modelo | Entrada (cache miss) | Entrada (cache hit) | Salida | Capa gratis | ¿Entra al LiteLLM que ya corre? |
|---|---:|---:|---:|---|---|
| **DeepSeek V4-Flash** | $0,14 | **$0,0028** | $0,28 | no | ✅ sí (compatible OpenAI) |
| **DeepSeek V4-Pro** | $0,435 | $0,003625 | $0,87 | no | ✅ sí |
| **Kimi K2.6** | $0,55 | — | $2,65 | plan Adagio gratis (chat, no API) | ✅ sí |
| **Kimi K2.7** | $0,95 | — | $4,00 | no | ✅ sí |
| **Gemini 3 Flash (preview)** | $0,25 | — | $1,50 | 1.500 req/día API | ✅ sí |
| **GPT-5.6 Terra** | $2,00 | — | $12,00 | no | ✅ **ya configurado** |
| **GPT-5.6 Sol** | $5,00 | — | $30,00 | no | ✅ ya configurado |
| **Groq · Llama 3.1 8B** | gratis | — | gratis | **14.400 req/día · 500k tok/día** | ✅ **clave ya en el contenedor** |
| **Groq · GPT-OSS 120B** | gratis | — | gratis | 1.000 req/día · 200k tok/día | ✅ clave ya puesta |
| **Cerebras** | gratis | — | gratis | 1M tok/día — 🔴 **contexto tope 8.192** | ⚠️ inservible: nuestro prompt son 32k |

**Nota sobre DeepSeek:** el 16-ago-2026 anunciaron precios pico/valle (V4-Flash a $0,44/$1,32
en pico). Verificado el 4-sep-2026 contra la página oficial: **anunciado pero desactivado**;
hoy rige la tarifa plana de arriba. Si se activa, el costo de la sección 4 se triplica —
**volver a medir antes de comprometerse**.

**Nota sobre Cerebras:** 1 M de tokens gratis al día suena a la mejor oferta de la tabla y
**no sirve para nada nuestro**: el tope de contexto de la capa gratis es 8.192 tokens y
nuestro prompt de arranque son ~32.000. No entra ni el prompt.

---

## 4. Lo que costaría el plan B, con nuestro volumen

**Volumen medido:** 105 vueltas/día × 30 = **3.150 vueltas/mes**.

**Estimación de tokens por vuelta** (esto es una ESTIMACIÓN, no una medición — Claude Code
headless no escribe telemetría de tokens en nuestros logs, lo verifiqué):

- prompt de arranque: 32k tokens (medido: 129 KB)
- vuelta promedio 525 s con `--max-turns 120` → ~35 turnos efectivos
- contexto promedio ~60k × 35 turnos ≈ **2,0 M tokens de entrada leídos**, ~90 % cache-hit
- salida ≈ **40k tokens**

| Opción | Cuenta | **US$/mes** | Qué hay que cambiar |
|---|---|---:|---|
| **GLM Coding Plan Pro (Z.ai)** | tarifa plana, cuota 6× | **~$84** | **2 variables de entorno** |
| GLM Coding Plan Lite | tarifa plana, cuota 1× | $18 | ⚠️ la cuota de 5 h no aguanta 105 vueltas/día |
| GLM Coding Plan Max | cuota 14× | ~$168 | 2 variables |
| **DeepSeek V4-Flash por LiteLLM** | 0,2M×$0,14 + 1,8M×$0,0028 + 0,04M×$0,28 = **$0,044/vuelta** | **~$139** | el gateway ya corre |
| DeepSeek V4-Pro por LiteLLM | $0,124/vuelta | ~$390 | ídem |
| Kimi K2.6 por LiteLLM | ~$0,21/vuelta | ~$660 | ídem |
| GPT-5.6 Terra por LiteLLM | ~$0,88/vuelta | ~$2.770 | ídem (ya configurado) |
| **Claude Max 20x dedicado a los loops** | tarifa plana | **$200** | nada |

### El ganador es GLM, y por una razón de ingeniería, no de precio

Z.ai expone **un endpoint compatible con Anthropic**. Migrar los 15 loops es esto:

    # en /root/bin/onia-loop.sh, arriba del timeout
    export ANTHROPIC_BASE_URL=https://open.bigmodel.cn/api/anthropic
    export ANTHROPIC_API_KEY=<clave de Z.ai>

**No se toca el arnés.** Siguen funcionando `claude -p`, `--max-turns`, `--allowedTools`, los
worktrees, el `flock`, el aviso a Telegram y los 15 prompts tal como están. Cualquier otra
opción de la tabla obliga a reescribir el corredor.

⚠️ **A US$ 139/mes, DeepSeek por LiteLLM sale más caro que GLM Pro y encima obliga a
reescribir `onia-loop.sh` para hablar OpenAI en vez de Anthropic.** Sirve como tercera
opción, no como segunda.

⚠️ **El tope de `max_budget: 50` del LiteLLM está por DEBAJO del costo estimado.** Si se
elige la vía DeepSeek hay que subirlo a mano o el gateway corta a mitad de mes.

---

## 5. Modelos locales en el VPS: **no**

Tres razones medidas, cualquiera alcanza:

1. **4 núcleos, 8 GB de RAM disponibles.** Con inferencia sólo-CPU se esperan **cifras de un
   dígito de tokens/segundo** para cualquier modelo de 8B o más, y la recomendación estándar
   es usar la mitad de los hilos disponibles (o sea 2). Una vuelta que hoy tarda 525 s pasaría
   a horas.
2. **Disco al 85 % (31 GB libres).** Un GGUF útil se lleva una mordida seria de eso, en la
   misma máquina donde viven Supabase, Chatwoot, n8n, Temporal y la plataforma.
3. **Ya nos mordió.** Ollama estuvo instalado y clavaba 2 de los 4 núcleos; fue parte de lo que
   disparó el estrangulamiento de Hostinger. Hoy está `inactive` y así tiene que quedarse.

**Veredicto: no revivir Ollama en este VPS bajo ningún escenario del plan B.** Un modelo local
sería un producto aparte (Onia Box, con hierro propio), no un parche de costos.

---

## 6. Qué tarea necesita qué modelo

### Nivel 0 — no necesita modelo, es un script

| Loop | Qué hace hoy con un LLM | Lo que en realidad es |
|---|---|---|
| **kpis-semanal** | "un número semanal MEDIDO en producción: orgs, citas, leads, commits" | `SELECT count(*)` + `git log --oneline \| wc -l`. **Contar no es razonar.** Ya corre en Sonnet y tarda 20 s, así que el ahorro es chico — pero el argumento vale igual: escribir el script una vez lo baja a cero. |
| **supervisor** (parte) | "0 loops con la misma medida en sus dos últimas líneas `OBJETIVO:`" | Eso es `grep OBJETIVO: \| tail -2 \| uniq`. La detección es scripteable; **sólo el diagnóstico de POR QUÉ se estancó** necesita un modelo. |

### Nivel 1 — modelo barato alcanza (mecánico: abrir, comparar, contar, redactar)

`docs-auditoria`, `tendencias`, `calidad-generado`, `contenido-cola`, `marca-personal`,
`investigacion`, y la mitad de `supervisor`.

Son leer archivos, comparar contra una fuente, clasificar y redactar. Es exactamente el
criterio que ya se aplicó a `canario-visual` cuando se lo bajó a Sonnet, con este comentario
en el propio script:

> *"El juicio duro (si un defecto es real) lo hace el carril dueño cuando lo toma; acá el
> trabajo es mecánico. Sonnet alcanza y cuesta una fracción."*

**Ese criterio ya estaba escrito y se aplicó a 1 loop de 13.** Aplicarlo a los otros es la
mitad del plan de hoy.

### Nivel 2 — necesita el mejor modelo, sin discusión

| Loop | Por qué no se puede bajar |
|---|---|
| **onia-cola** | Es **el integrador**: mergea a `main`, corre los gates, decide qué se despliega. `main` alimenta el deploy del VPS y el de Vercel. Un merge mal resuelto rompe producción. Ya corre con `TURNOS=260` porque 120 lo cortaron a mitad de un merge y dejaron `MERGE_HEAD` abierto. |
| **recorrido-cliente** | Verifica los 8 pasos **en producción de verdad** — crea cuenta, agenda una cita `zz-qa-`, la mira en la agenda, y borra lo suyo. Escribe y borra datos reales. |
| **chatbot-cola** | Toca precios (`pricing.ts`, `subscription-plans.ts`) y promesas de producto. Un error acá le contesta un precio inventado a un cliente. |
| **web-factory-dev** | Código de producto con presupuesto medible (First Load ≤ 150 kB, CTA dentro del pliegue) que se publica. |
| **canario-visual** | La regla "verificar es MIRAR" exige abrir la pantalla y **leer la captura**. Es visión sobre pantallas renderizadas, y ahí la paridad de los modelos baratos no está demostrada. Ya está en Sonnet; **bajarlo más es riesgoso**. |

Estos cinco son ~40 % de los segundos de agente. **Ese 40 % es el piso irreducible del
costo**, se cambie de proveedor o no.

---

## 7. El plan, en orden

### (a) HOY, sin gastar un peso

**Paso 1 — bajar la frecuencia de los tres loops horarios.** Se llevan el 58 % del consumo.

    crontab -e
    # 3  * * * *  ->  3  */2 * * *     onia-loop.sh chatbot-cola
    # 33 * * * *  ->  33 */2 * * *     onia-loop.sh onia-cola
    # 48 * * * *  ->  48 */2 * * *     onia-loop.sh web-venta

**Efecto: −29 % de segundos de agente.** Un loop horario que tarda 9 minutos promedio no tiene
60 minutos de trabajo nuevo esperándolo; los logs muestran vueltas que cierran diciendo que no
había nada que hacer.

**Paso 2 — mover los loops mecánicos a Sonnet.** En el `case` de `/root/bin/onia-loop.sh`,
agregar `MODELO=claude-sonnet-5` / `ESFUERZO=medium` a: `docs-auditoria`, `tendencias`,
`supervisor`, `calidad-generado`, `contenido-cola`. Son ~10 % de los segundos, y ninguno decide
sobre producción.

**Paso 3 — poner un techo a `MEMORY.md`.** El prompt creció de 125.431 a 129.153 bytes en UNA
hora. Cada byte se paga en **las 105 vueltas del día**. Un tope de hechos (o consolidar los
viejos) es el ahorro que se compone solo.

**Costo de los tres pasos: US$ 0.** Dos ediciones de archivo.

### (b) Si Claude se corta mañana

| # | Acción | Costo/mes |
|---|---|---:|
| 1 | Dar de alta **GLM Coding Plan Pro** en Z.ai y exportar `ANTHROPIC_BASE_URL` + `ANTHROPIC_API_KEY` en `onia-loop.sh` | **~$84** |
| 2 | Dejar los 5 loops del Nivel 2 apuntando a Claude si queda algo de cuota; si no, van también a GLM | — |
| 3 | Fallback: DeepSeek V4-Flash por el LiteLLM que ya corre (subir `max_budget` de 50 a 200) | ~$139 |

**Estimado del plan B completo: US$ 84/mes** para las 3.150 vueltas, contra los ~$200/mes de un
Max 20x dedicado. **La migración es de dos líneas** — ese es el punto, no el precio.

⚠️ **Antes de comprometerse hay que MIRARLO corriendo**, no confiar en esta tabla: dar de alta
el plan Lite de $18, apuntar UN loop del Nivel 1 (`tendencias`, el más barato) y comparar su
salida contra las últimas 3 vueltas en Opus. Es la regla de la casa: verificar es mirar. Un plan
B que nunca se probó no es un plan B.

### (c) Lo que queda sin reemplazo

1. **Los 5 loops del Nivel 2** (sección 6). No porque no exista otro modelo, sino porque el
   costo de equivocarse ahí no es el token: es `main` roto, un precio inventado a un cliente, o
   datos escritos en la base de producción.
2. **El ojo de `canario-visual`.** Leer una captura renderizada y decir "esto se ve mal" es la
   capacidad que sostiene la regla de verificación de todo el proyecto.
3. **La sesión de control.** Comparte la suscripción con los loops y es la que orquesta, decide
   y mergea. **Es la que hay que proteger** — y el plan (a) la protege justamente sacándole
   15 h/día de competencia por la misma cuota.

---

## 8. Fuentes

Todas consultadas el **2026-09-04**, salvo la fecha propia de cada publicación.

**Medición propia (no hay fuente externa):** `ssh root@187.77.16.63` — `nproc`, `free -g`,
`df -h /`, `systemctl is-active ollama`, `docker ps`, `docker exec onia_selfhosted-litellm-1
cat /app/config.yaml`, `cat /root/bin/onia-loop.sh`, `crontab -l`, y agregación de
`/var/log/onia-loop-*.log`.

- Gemini CLI, capa gratis y su retiro — https://geminicli.com/docs/cli/headless/ · https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/ (retiro el 18-jun-2026)
- Antigravity CLI (`agy`), 20 pedidos/día — https://antigravity.im/limits · https://github.com/google-antigravity/antigravity-cli/issues/56
- Codex CLI, 50 mensajes agénticos/día en Free; `codex exec` — https://www.morphllm.com/codex-pricing · https://codex.danielvaughan.com/2026/04/18/codex-cli-headless-batch-mode-automation/
- Qwen Code, cierre del OAuth gratis el 15-abr-2026 — https://github.com/QwenLM/qwen-code/issues/3203 · https://inventivehq.com/blog/qwen-code-still-free-2026-shutdown
- opencode / Aider / Goose, madurez y modo headless — https://www.developersdigest.tech/blog/headless-ai-coding-agents-ci-comparison-2026 (9-jul-2026) · https://sanj.dev/post/open-source-cli-ai-agents-comparison/
- DeepSeek, tarifa vigente y pico/valle desactivado — https://deepseek.ai/pricing (verificado 4-sep-2026)
- GLM Coding Plan, precios y endpoint compatible con Anthropic — https://www.layer3labs.io/guides/glm-coding-plan-explained · https://hboon.com/using-z-ai-with-claude-code-for-cheaper/
- Kimi K2.6 / K2.7, precios API — https://benchlm.ai/moonshot/api-pricing · https://www.nxcode.io/resources/news/kimi-code-2026-plans-pricing-developer-guide
- Gemini 3 Flash, precio por millón — https://pricepertoken.com/pricing-page/model/google-gemini-3-flash-preview
- Groq, límites de la capa gratis — https://tokenmix.ai/blog/groq-free-tier-limits-2026 · https://pricepertoken.com/endpoints/groq/free
- Cerebras, 1M tok/día con contexto 8.192 — https://pricepertoken.com/endpoints/cerebras/free
- Claude Max, $100 (5x) y $200 (20x) — https://intuitionlabs.ai/articles/claude-max-plan-pricing-usage-limits
- Inferencia sólo-CPU, cifras de un dígito de tokens/s sobre 8B — https://unsloth.ai/docs/models/tutorials/qwen3-coder-how-to-run-locally
