# Evaluación de Strix — pentest con agentes autónomos, con el costo sobre la mesa

> Decisión pendiente para Sergio. **Esto es SOLO una estimación: nada se corrió, nada se
> instaló, no se gastó un centavo.** Correr Strix consume LLM con API key propia y hoy eso
> es gasto nuevo → permiso explícito. Este doc existe para decidir *antes* de gastar, no
> después.
>
> Ficha previa verificada: `hermes-content/references/video-intake/2026-08-16-cinco-plugins-strix.md`.
> Qué es Strix: [github.com/usestrix/strix](https://github.com/usestrix/strix) (Apache 2.0) —
> agentes autónomos que **corren la app, la atacan y validan cada hallazgo con una prueba de
> concepto real** (proxy HTTP, navegador, terminal, Python para exploits propios).

---

## Lo primero: el número

**Una corrida `quick` contra un blanco chico nuestro, en entorno de prueba, con Claude
Sonnet: ~US$10–25.**

| Escenario (mismo blanco, entorno de prueba) | Rango estimado | De dónde sale |
|---|---|---|
| `--scan-mode quick`, foco dirigido con `--instruction` | **US$10–25** | Ancla real Protego (~$17) ajustada a menos endpoints |
| `--scan-mode standard`, exploración completa | **US$25–70** | 2–4× las iteraciones de quick |
| Desbocado (thrash / sin foco / agentes en paralelo) | **>US$100** | No hay tope de gasto (issue #438) |

El número honesto de titular es **un rango, no un punto**, porque el costo de Strix lo
manda el tiempo de exploración del agente, no la cantidad de endpoints — y **Strix NO tiene
límite de gasto configurable** (ver caveats). El ancla más sólida es una corrida real medida
por un tercero, abajo.

### Ancla real (citada y fechada)

Protego corrió Strix en modo `quick` contra su propio sitio (2026-07-06):

- **5.716.615 tokens de input**, **105 requests al modelo**, **~US$17**, modelo **Claude
  Sonnet**, ~10 minutos.
- Dato revelador: de ~1.350 requests HTTP que mandó el agente, **más de 1.300 fueron 404** —
  el agente "tantea" muchísimo aunque el sitio sea chico. Eso es exactamente lo que infla el
  costo y por qué no hay un número fijo.
- Fuente: [protego.me/blog/strix-ai-pentester-honest-review](https://protego.me/blog/strix-ai-pentester-honest-review) (2026-07-06).

### Supuestos de la estimación (todos escritos)

1. **Modelo:** Strix **no trae modelo por defecto** — hay que declarar `STRIX_LLM`. Recomendados
   por el repo: Claude Sonnet 4.6, GPT-5.4, Gemini 3 Pro. Asumo **Claude Sonnet** para poder
   comparar con el ancla de Protego. Fuente: README de Strix (verificado 2026-08-20).
2. **Precio asumido:** Claude Sonnet ~**US$3 / millón de tokens de input**. Cruza con el ancla:
   5,7M × $3/M ≈ $17 (el output de un agente de pentest es chico frente al input, que crece
   arrastrando transcripts del proxy y cuerpos de páginas). Si se usa GPT-5.4 u otro, el número
   se mueve.
3. **Tokens por iteración:** ~40–55K input/request (promedio del ancla: 5,7M / 105 ≈ 54K).
4. **Iteraciones por corrida:** quick ≈ 60–120 requests al modelo; standard 2–4×.
5. **Endpoints del blanco (el bot):** **2 rutas HTTP** — `POST /webhook/chatwoot/<secreto>` y
   `GET /health` (verificado en `webhook-server.mjs`). Menos superficie que un sitio web →
   por eso el piso queda por debajo del $17 de Protego, no por encima.

Cross-check desde cero: 60–120 requests × ~40–55K tokens ≈ 2,5M–6,6M tokens input × $3/M
(+ ~20% por output) ≈ **US$9–24** en quick. Consistente con el piso anclado.

---

## Qué app se atacaría y por qué

**Blanco elegido: el bot del webhook** (`hermes-content/deploy/vps-ops/bot/`), levantado en
una **instancia de prueba aislada**.

Por qué este y no otro:

| Candidato | Superficie | Veredicto |
|---|---|---|
| **Bot del webhook** | 2 rutas, pero profundas: webhook con firma HMAC + secreto en ruta, descarga de audio (SSRF), input de desconocidos | **ELEGIDO** — chico, acotado, barato, y toca las 3 superficies que importan |
| `dentalgest-landing` | 0 rutas API, 1 página, sin formularios POST | Descartado: no hay nada que atacar, pagaría por cero hallazgos |
| `site` (ONIA Center / Nuvia) | 17 rutas API (auth, pagos, webhooks, leads) | Rico pero más caro y parte está en prod |
| `onia-platform` (el producto) | La superficie más rica | **Prohibido**: es producción; jamás contra prod |

El bot cumple justo las tres superficies que pediste evaluar, y son reales en el código:

- **Webhook** — `webhook-security.mjs`: firma HMAC (`x-chatwoot-signature`) + secreto en la
  ruta, ventana anti-replay de 5 min, diseño fail-closed (503 sin secreto). Un agente que
  ataca prueba: **forjar la firma, reusar un request viejo dentro de la ventana, filtrar el
  secreto de la ruta, o degradar a `allowUnsigned`.**
- **Subida de archivo** — `audio-transcribe.mjs`: descarga el audio desde el `data_url` de un
  adjunto de Chatwoot. Ya hay defensa contra SSRF (reescribe el host, solo http(s)). Un agente
  intenta **evadirla con un `data_url` manipulado (SSRF a la red interna), colgar la descarga
  (timeout/DoS), o meter un archivo gigante.**
- **Input no confiable** — mensajes de desconocidos entran a `bot-engine` / `intents` /
  `knowledge`: **inyección de prompt, bypass de guardrails**, hacer que el bot le diga
  cualquier cosa a un prospecto real.

Ventaja operativa: es un servicio Node autocontenido → una instancia de prueba se levanta
fácil, con almacenamiento scratch, radio de daño limpio.

---

## Qué se rompe si sale mal (por eso NUNCA contra producción)

Strix **no es un lector, es un atacante**: manda payloads reales, explota de verdad y ejecuta
sus propios exploits. Contra un sistema vivo eso significa:

- **Datos corruptos o borrados** en la base que toque el bot (conversaciones, follow-ups).
- **El bot posteando basura a un prospecto real** — el webhook publica la respuesta en la
  conversación de Chatwoot; un ataque exitoso hace que le escriba cualquier cosa a un cliente.
- **SSRF real** golpeando la red interna del VPS si logra evadir la defensa de descarga.
- **DoS**: el agente manda >1.000 requests (Protego vio 1.350); un servicio de prod se satura.
- **Ruido en n8n / integraciones** aguas abajo del webhook.

**Regla dura: solo entorno de prueba aislado, con datos de mentira, apuntando a un almacén
scratch, nunca al Chatwoot ni a la base de producción, y con `--scope` acotado.** El costo
en plata es recuperable; los datos de un cliente y una conversación arruinada, no.

---

## Qué encontraría que la revisión de seguridad ya hecha NO encontró

La seguridad de prod se cerró y verificó (revisión estática + checklist: RLS, ufw, fail2ban,
skill `security-review`, agente `security-reviewer`). Eso es **revisar**. Strix **ataca**. La
diferencia no es de grado, es de tipo:

| Revisión (lo que ya tenemos) | Ataque con PoC (Strix) |
|---|---|
| Lee el código y marca "esto *podría* ser vulnerable" | Corre la app y **demuestra** que lo es, con el exploit |
| Ve un archivo a la vez | Encadena pasos: firma débil → replay → post al cliente |
| No sabe si la defensa realmente aguanta en runtime | Prueba si la evasión de SSRF **funciona de verdad** |
| Cero falsos negativos por diseño… y muchos falsos positivos | Valida cada hallazgo → **casi cero falsos positivos** |
| No ve fallas de lógica de negocio ni de configuración viva | Encuentra bugs de flujo/estado que solo aparecen ejecutando |

En concreto para el bot, Strix podría probar cosas que un grep no ve: que la ventana
anti-replay realmente corta un request reenviado, que la firma HMAC no se puede forjar con un
timestamp jugado, que la reescritura de host del `data_url` no se evade con una redirección.
**El valor de Strix es el "sí, funciona el exploit", no la lista de sospechas.**

---

## La alternativa gratis (parcial) — qué cubrimos sin LLM extra

Antes de gastar en Strix, esto ya lo tenemos y cuesta $0 en LLM nuevo:

- **Skill `security-review`** (`~/.claude/.agents/skills/security-review`) + agente
  **`security-reviewer`**: checklist OWASP Top 10, secretos hardcodeados, SSRF, inyección,
  cripto insegura — **revisión estática del código**, corre con la suscripción de Claude Code
  (sin API key aparte).
- **Tests propios del bot ya escritos**: `webhook-security.test.mjs`, `audio-transcribe.test.mjs`,
  `guardrails`… cubren firma, replay, descarga de audio y guardrails con casos concretos.
  **Ampliar estos tests con casos de abuso es la vía más barata** para lo predecible.
- **Verificación mirando** (regla del proyecto): levantar el bot en local y probar a mano un
  webhook forjado, un replay, un `data_url` interno.

**Qué cubre esta vía:** todo lo estático — firma, secreto, SSRF evidente, secretos filtrados,
patrones OWASP conocidos, y cualquier caso de abuso que se te ocurra escribir como test.

**Qué NO cubre (y solo Strix da):** el **descubrimiento autónomo** de cadenas de ataque que
nadie pensó en testear, y la **prueba de concepto ejecutada** que demuestra explotabilidad
real en runtime. La revisión te dice dónde mirar; Strix te dice qué revienta.

**Recomendación de secuencia:** primero agotar la vía gratis (endurecer tests de abuso +
pasar `security-reviewer` sobre el bot). Si después de eso Sergio quiere la validación con
exploit real, recién ahí una corrida `quick` acotada (~US$10–25) contra la instancia de
prueba, con `--instruction` enfocado en webhook + descarga de audio, y **matando el proceso
si supera los ~10 min** (no hay tope automático).

---

## Caveats — qué NO se pudo fundamentar

- **Strix no publica ningún costo por scan.** El README y la doc tienen **cero** menciones de
  precio o consumo (verificado 2026-08-20). Todo número acá es inferido de terceros + cálculo.
- **NO existe tope de gasto configurable.** Issue [#438](https://github.com/usestrix/strix/issues/438)
  (abierto 2026-04-12) pide "presupuesto máximo por corrida, corte al llegar al límite, avisos
  al 80/90%". Hoy no está; hay un PR #576 relacionado, **sin confirmar que se haya mergeado**.
  Por eso el escenario ">US$100" es real, no alarmista.
- **Cifras secundarias sin verificar en fuente primaria:** rangos que circulan ("app mediana
  a fondo US$10–50", "quick US$3–5", "monolito grande cientos de US$") vienen de agregación de
  búsqueda; el artículo de Medium sobre "costo <US$1 por PR" con modo diff dio **HTTP 403**, no
  se pudo leer directo. Se citan como referencia, no como ancla.
- **El benchmark XBEN** (100/104 retos, ~US$3,37/reto) es de retos CTF de **una** vulnerabilidad
  cada uno — no es comparable a escanear una app entera; no se usó para el número.
- **El costo exacto para NUESTRO bot no se puede saber sin correrlo** (y no se corre). El ratio
  de tokens de output es un supuesto. El número real depende del modelo elegido, del modo, y de
  cuánto "tantee" el agente.

---

## Estado

**LISTO = estimación escrita y presentada. Nada se corrió, ni "para probar".** La decisión de
gastar (permiso + entorno de prueba + modelo + tope de tiempo manual) queda para Sergio.
