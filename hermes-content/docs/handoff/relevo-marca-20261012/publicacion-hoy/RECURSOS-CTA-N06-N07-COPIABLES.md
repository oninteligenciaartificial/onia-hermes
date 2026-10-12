# Recursos y CTA recuperados — N06 ANTIGRAVITY / N07 HAIKU

**Recuperación literal, corte 2026-10-12.** No se redactaron los otros 17 mensajes, no se creó oferta nueva y no se publicó, instaló ni contactó a nadie. Los bloques de fuente se conservaron sin corregir; las notas de mínima corrección editorial van separadas para que el artefacto original siga identificable.

## Contexto de uso y estado

- N06 corresponde a la pieza «De Gemini CLI a Antigravity CLI»; CTA comunitario exacto: «Buscá ANTIGRAVITY en Avisos · link en mi perfil». Su recurso completa la mudanza de skills, no invita a migrar cuentas ni a comprar.
- N07 corresponde a «Haiku 5.5: clasificar mil mensajes, de US$3 a US$0,39»; CTA comunitario exacto: «Buscá HAIKU en Avisos · link en mi perfil». El recurso expone precios, cuenta y condiciones de API.
- Son avisos/recursos preparados en Git. Este paquete no comprueba su publicación efectiva en WhatsApp ni el estado actual de los videos. Los archivos incluyen fechas de publicación planeadas que ya pasaron; son historia del origen, no calendario vigente.
- Hipótesis de la madre, no resultado medido aquí: el video entrega el gancho y la demostración; el aviso aporta el recurso con pasos/datos que el CTA promete. La madre integrará estos bloques en el artefacto madre al reconocer el source ID.

## Fuentes e identificación

Snapshot requerido: commit completo `781df7d87b53913ac9790fa1df88e53357408bc3` (`claude/gifted-clarke-y4vvtj`, según refs locales). Blobs:

| Ruta | Blob |
|---|---|
| `hermes-content/docs/cola/plan-3-semanas/AVISOS-COMUNIDAD-8-16-OCT.md` | `1d83f66189a061a5d6b0b1f4e1e325f13e5221e6` |
| `hermes-content/docs/cola/plan-3-semanas/GRABAR-10-16-OCT.md` | `fe0ad22a7110aeb2002e3e284feb790bb5de0258` |
| `hermes-content/docs/cola/drops/AVISOS-POR-DIA.md` | `a66b8051be18d01f683550159b8ac1a09ef026ce` |
| `hermes-content/docs/cola/drops/2026-10-01-drops-noticias-repos.md` | `832e39f349b956ca4ccd2ccc6a8fe36bdd4c7c8a` |
| `hermes-content/carousels/briefs/marca-personal/sergio-n06-antigravity-cli-20261002.json` | `158354a92c3ee80b98f470106343c464843a9597` |

El checkout actual está en main `2cdefca738ed85d87f50e6dc3dc6c31a5aa698f9`; `GRABAR-10-16-OCT.md` conserva el blob citado. La tabla editorial de `GRABAR` en el master actual enumera como comprobados el cálculo de N07, sus condiciones y la ruta de Antigravity, con las salvedades transcritas abajo. El archivo está versionado en master con el mismo blob que el snapshot pedido; esto identifica la revisión editorial de fuente, no una revalidación independiente de documentación web hoy ni una comprobación de publicación real.

## N07 — HAIKU: aviso y recurso originales de AVISOS (transcripción literal)

Fuente: `AVISOS-COMUNIDAD-8-16-OCT.md`, sección HAIKU. **Este es el original recuperado**. El bloque ya dice 0,39 USD, igual que la versión posterior de `GRABAR`; el propio `GRABAR` incluye una nota que dice que este aviso aún decía 0,30, pero esa nota de control no coincide con el blob del aviso que se recuperó. La versión posterior sí hace explícito que +30% de tokens de salida es un supuesto nuestro.

````markdown
## HAIKU · Haiku 5.5: el precio y la cuenta para tu bot

**Para Sergio Urcullo:** Anthropic sacó Haiku 5.5, su modelo más barato. Muestra cuánto cuesta clasificar 1.000 mensajes con un bot (de 3 a 0,39 dólares) y la letra chica: viene con el «pensamiento» prendido y se cobra.

**Aviso** (se pega primero):

```
🧮 *HAIKU* · *Clasificar 1.000 mensajes: de 3 a 0,39 dólares*

Anthropic sacó Haiku 5.5, su modelo más barato. Para clasificar y repartir mensajes de un bot, la cuenta baja casi 8 veces.

Ojo con la letra chica: viene con el «pensamiento» prendido y eso se cobra. Hay que apagarlo para clasificar.

Abajo está la tabla y la cuenta completa.
```

**Recurso** (se pega después, en otro mensaje):

~~~
*HAIKU* · *Haiku 5.5: la tabla y la cuenta para tu bot*

Precios de Anthropic por millón de tokens (página oficial):
• Haiku 5.5, prompts de hasta 100.000 tokens: entra 0,10 USD · sale 0,50 USD
• Haiku 5.5, prompts de más de 100.000 tokens: entra 0,50 · sale 2,50
• Haiku 4.5: entra 1 · sale 5

Para qué sirve: clasificar, sacar datos y repartir mensajes. Lo difícil, Sonnet.

La cuenta (clasificar 1.000 mensajes, 2.000 tokens de entrada y 200 de salida cada uno en Haiku 4.5, sin pensamiento):
• Haiku 4.5: 3 USD
• Haiku 5.5: el mismo texto da ~30 % más tokens → 2.600 y 260 → 0,39 USD (casi 8 veces menos). El +30 % en la salida es un supuesto nuestro: la doc no da un porcentaje propio para la salida.

Ojo:
• Viene con el pensamiento prendido y se cobra como salida. Para clasificar: thinking: {type: "disabled"} (vale con esfuerzo high o menor), y medilo. Con el pensamiento prendido, la cuenta de arriba sube.
• No mandes temperature, top_p ni top_k: temperature distinta de 1, top_p distinta de 0,99 o cualquier top_k dan error 400.
• Si el prompt pasa de 100.000 tokens, cobra 5 veces más por token.

Cómo cambiarlo: model: "claude-haiku-5-5".
~~~
````

## N07 — Recurso corregido guardado en GRABAR-10-16-OCT (transcripción literal)

El bloque siguiente es la versión posterior del recurso que acompaña N07; incluye la cuenta de 0,39 USD y su caveat de que el +30% de tokens de salida es supuesto nuestro.

````markdown
## Avisos nuevos para la comunidad (pegarlos antes de publicar el video de cada uno)

**HAIKU** (va con N07):
```
*HAIKU* · *Haiku 5.5: la tabla y la cuenta para tu bot*

Precios de Anthropic por millón de tokens (página oficial):
• Haiku 5.5, prompts de hasta 100.000 tokens: entra 0,10 USD · sale 0,50 USD
• Haiku 5.5, prompts de más de 100.000 tokens: entra 0,50 · sale 2,50
• Haiku 4.5: entra 1 · sale 5

La cuenta (1.000 mensajes, 2.000 tokens de entrada y 200 de salida cada uno en Haiku 4.5, sin pensamiento):
• Haiku 4.5: 3 USD
• Haiku 5.5: el mismo texto da ~30 % más tokens → 2.600 y 260 → 0,39 USD (casi 8 veces menos)

Ojo:
• Viene con el pensamiento prendido y se cobra como salida. Para clasificar: thinking: {type: "disabled"} (vale con esfuerzo high o menor), y medilo. Con el pensamiento prendido, la cuenta de arriba sube.
• No mandes temperature, top_p ni top_k: temperature distinta de 1, top_p distinta de 0,99 o cualquier top_k dan error 400.
• Si el prompt pasa de 100.000 tokens, cobra 5 veces más por token.

Cómo cambiarlo: model: "claude-haiku-5-5".
```

**SKILL** (va con D01-A; antes SKILL mandaba directo a la web y no tenía aviso):
```
*SKILL* · *Tu primera skill de Claude Code*

El paso a paso en video, desde instalar Claude Code hasta tu primera skill:
https://sergiourcullo.vercel.app/claude-code (video 02)
Cuando la tengas andando, contame en General qué hace la tuya.
```

**Fuentes de HAIKU (leídas el 8-oct):**
- `platform.claude.com/docs/en/about-claude/pricing`: tabla de precios. Haiku 5.5 en dos tramos, con el corte en
  100.000 tokens de prompt; Haiku 4.5 a 1 / 5.
- `platform.claude.com/docs/en/models/overview` (la dirección vieja `about-claude/models/overview` redirige acá):
  Haiku 5.5 «para clasificación, extracción y ruteo», con 1M de contexto.
- `platform.claude.com/docs/en/models/haiku-5-5/overview` y su `migration-guide`: ~30 % más tokens por el mismo texto,
  pensamiento prendido de fábrica, `temperature` solo vale 1.
- `platform.claude.com/docs/en/build-with-claude/thinking`: el pensamiento se cobra como salida.
- Changelog de Claude Code 2.1.293 (7-oct): «Added Claude Haiku 5.5… now the default Haiku model on the Anthropic API».

**Avisos que la v2 obliga a reescribir o completar** (viven en `AVISOS-COMUNIDAD-8-16-OCT.md`; cada uno, pegado antes de su video). El detalle de cada uno está en su pieza:
- **HAIKU** (N07, sáb 10, 12:30): el texto de arriba. `AVISOS-COMUNIDAD-8-16-OCT.md` línea 82 todavía dice 0,30.
- **HOOK** (D03-A, sáb 10, 18:30): la guarda del drop tiene que existir y frenar el conflicto antes de grabar C6.
- **ANTIGRAVITY** (N06, dom 11, 12:30): pasa de «instalarlo en 3 pasos» a la mudanza de skills con la ruta global.
- **CACHE** (DD-A, dom 11, 18:30): plantilla con la marca (`prompt_cache_breakpoint`), chequeo de `cached_tokens` y la hoja con la cuenta. Sin eso no se publica.
- **VERIFY** (N04, lun 12, 18:30): plantilla con lint y la línea de `disable-model-invocation`.
- **EFFORT** (D02-A, mié 14): lo pega Sergio Urcullo el 13-oct, con la tabla, la prueba paso a paso y el resultado propio.
- **MIGRAR** (N02, jue 15, 18:30): los 5 ajustes, `between_tools`, el grep con exclusiones y la nota de Bedrock y Google Cloud.
- **MIRAR** (D04-C, vie 16, 12:30): cuándo hace falta `npx playwright install chromium` y cuándo no (MCP).
- **WORKTREE** (D05-A, vie 16, 18:30): sumar al drop 12 el `.gitignore`, la confianza y la base `fresh`.
- **Nuevos:** NIVELES (P1, texto en la pieza) y HERRAMIENTAS (P2).
````

## N06 — ANTIGRAVITY: aviso y guía de migración en AVISOS (transcripción literal)

Fuente: `AVISOS-COMUNIDAD-8-16-OCT.md`, sección ANTIGRAVITY. El propio encabezado la marca como borrador que debía revisarse antes de usar.

````markdown
## ANTIGRAVITY · De Gemini CLI a Antigravity CLI

**Para Sergio Urcullo:** BORRADOR: la madre lo verifica el sáb 10 (10:00-12:00) con capturas y lo pegás antes de las 18:00. Google cerró Gemini CLI gratis y lo reemplazó por Antigravity. El video ya muestra cómo instalarlo; este aviso trae lo que el video no da: dónde van tus skills y qué se muda solo.

**Aviso** (se pega primero):

```
🚀 *ANTIGRAVITY* · *Gemini CLI gratis se apagó. Ahora es Antigravity*

Desde el 18 de junio, Google reemplazó Gemini CLI por Antigravity CLI. Sigue siendo gratis con una cuenta personal de Google, con un límite que se renueva cada semana.

Si venías de Gemini CLI, algo no se mudó solo: tus skills. Abajo: a dónde van y qué se convierte solo la primera vez.

Contame en General: ¿usabas Gemini CLI? ¿Qué tuviste que mover a mano?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*ANTIGRAVITY* · *Qué se muda solo y qué no, de Gemini CLI a Antigravity CLI*

La instalación está en antigravity.google/download. Esto es lo que el video no muestra:

1. *Dónde van las skills globales:* la ruta nueva es `~/.gemini/antigravity-cli/skills/` (antes, `~/.gemini/skills/`). La documentación no dice si las de la carpeta vieja hay que moverlas a mano. [CONFIRMAR el sáb 10: escribir lo que pasó en la prueba, o dejar solo la ruta]
2. *Qué convierte la lista de la primera vez:* extensiones y configuración global, tokens de sesión (los pasa al llavero del sistema) y ajustes visuales. Las skills del proyecto no figuran en esa lista.
3. *Las skills del proyecto no se mudan solas:* pasá la carpeta `.gemini/skills/` a `.agents/skills/`.
4. *Cómo sabés que quedó:* escribí «/» y el nombre de tu skill; tiene que aparecer. [CONFIRMAR el sáb 10: si `/skills` también las lista]

Lo que le pedís y lo que lee de tu carpeta va a los servidores de Google. Para la primera prueba, usá una carpeta sin datos de clientes ni claves.

Contá en General: ¿qué tuviste que mover a mano?
~~~
````

## N06 — Recurso largo del drop (transcripción literal)

Fuente: `docs/cola/drops/2026-10-01-drops-noticias-repos.md`, sección N06. Este texto es el recurso histórico completo; conserva comandos y claims fechados, por lo que debe leerse junto con la nota editorial y las fechas del origen.

````markdown
## N06 · De Gemini CLI a Antigravity CLI  (pieza N06 y su carrusel, sáb 3) · rehecho 2-oct

⚠️ **Rehecho el 2-oct** (pedido de Sergio Urcullo): el drop viejo, «Gemini CLI en 5 minutos», enseñaba el login gratis con cuenta de Google, que no anda desde el 18-jun-2026. Este cuenta el cambio y cómo mudarse. Cada dato sale de una página oficial leída el 2-oct (fuentes abajo).

**Condición:** publicar antes del video y del carrusel del sáb 3-oct. Si Google cambió la descarga o los planes, se corrige con lo que diga ese día.

*De Gemini CLI a Antigravity CLI*

Desde el *18 de junio de 2026*, Gemini CLI dejó de atender a quien lo usaba gratis con su cuenta de Google (Gemini Code Assist for individuals) y a los planes Google AI Pro y Ultra. Lo reemplazó *Antigravity CLI*, el agente de terminal de Google Antigravity.

*Lo que cambia para vos*
- Es gratis para cuentas personales, con un límite que se renueva cada semana. Pro y Ultra tienen más.
- Trae Gemini 3.8 Flash y Gemini 3.1 Pro.
- Está disponible en Bolivia, para mayores de 18.
- Conserva skills, hooks, subagentes y extensiones (ahora se llaman plugins).

*1. Instalalo*
Mac o Linux:
```
curl -fsSL https://antigravity.google/cli/install.sh | bash
```
Windows (PowerShell):
```
irm https://antigravity.google/cli/install.ps1 | iex
```
*2. Abrilo* en la carpeta de tu proyecto:
```
agy
```
Se abre el navegador: entrá con tu cuenta de Google.

*3. Si venías de Gemini CLI*
- La primera vez encuentra tu configuración vieja y te pregunta qué traer.
- Para convertir tus extensiones a mano: `agy plugin import gemini`
- *La trampa:* las skills del proyecto no se mudan solas. Mové la carpeta `.gemini/skills/` a `.agents/skills/`.
- `GEMINI.md` y `AGENTS.md` los sigue leyendo igual.
- Servidores MCP: ya no van en `settings.json`. Van en `.agents/mcp_config.json` (los del proyecto) o en `~/.gemini/config/mcp_config.json` (los globales). Si uno remoto usaba `url` o `httpUrl`, ahora es `serverUrl`.

*Cómo sabés que quedó:* escribí `/skills` y tienen que aparecer tus skills. Con `/usage` ves cuánto te queda de cuota.

*¿Y si te quedás en Gemini CLI?* Sigue andando con una clave de API paga de Gemini. Con la cuenta gratis, ya no.

Lo que le pedís y lo que lee de tu carpeta va a los servidores de Google. Según su FAQ, la recolección de datos se puede desactivar desde Settings. Para la primera prueba, usá una carpeta sin datos de clientes ni claves.

Contá en General: *¿usabas Gemini CLI? ¿Qué tuviste que mover a mano?*

<sub>Fuentes, todas leídas el 2-oct desde la nube: guion final GUIONES-2-SEMANAS-1-14-OCT.md §N06 (sáb 3-oct, rehecho el 2-oct). Banner de https://geminicli.com/ (sale igual en /plans y /docs): «Unpaid tier and Google One users: Gemini CLI was replaced by Antigravity CLI on June 18th, 2026». Blog de Google Developers del 19-may-2026, https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/: «On June 18, 2026, Gemini CLI and Gemini Code Assist IDE extensions will stop serving requests for Google AI Pro and Ultra, as well as those using it free of charge using Gemini Code Assist for individuals»; «Antigravity CLI keeps the most critical features of Gemini CLI: Agent Skills, Hooks, Subagents, and Extensions (now as Antigravity plugins)»; «Gemini CLI will remain accessible via paid Gemini and Gemini Enterprise Agent Platform API keys». Gratis y modelos: https://antigravity.google/pricing («For Individuals $0/month», «Basic weekly rate limits») y https://antigravity.google/docs/plans/ (todos los planes: «Gemini 3.1 Pro, Gemini 3.8 Flash» y «Access to all product features, such as scheduled tasks and the CLI»; sin Pro ni Ultra: «A meaningful quota, refreshed weekly»; Pro y Ultra, cuota más alta). Comandos: https://antigravity.google/download (Antigravity CLI v1.2.12; macOS y Linux `curl -fsSL https://antigravity.google/cli/install.sh | bash`; Windows PowerShell `irm https://antigravity.google/cli/install.ps1 | iex`) y https://antigravity.google/docs/cli/install/ (binario `agy`; sin sesión guardada, «The CLI automatically launches your local default web browser»). Abrirlo en la carpeta del proyecto: la skill `antigravity-support` que trae Gemini CLI v0.62.0 (repo google-gemini/gemini-cli, clonado; packages/core/src/skills/builtin/antigravity-support/SKILL.md: «navigate to any project or workspace directory and run: agy»). Migración: https://antigravity.google/docs/cli/gcli-migration/ (checklist en el primer `agy`; `agy plugin import gemini`; skills de proyecto `.gemini/skills/` → `.agents/skills/`, «you must manually rename or relocate the folder»; «GEMINI.md and AGENTS.md»; MCP en `~/.gemini/config/mcp_config.json` y `.agents/mcp_config.json`; `url` o `httpUrl` → `serverUrl`). `/skills` y `/usage`: https://antigravity.google/docs/cli/reference/. Bolivia, 18 años y datos: https://antigravity.google/docs/faq/ («You can opt out of data collection at any point from the Settings panel»). Afuera a propósito: la página de precios lista «Claude Sonnet & Opus 4.6» en el plan gratis, pero /docs/plans dice que los modelos de terceros son de Ultra (contradicción, no se menciona); y /plans de geminicli.com todavía ofrece «Free… Authenticate instantly with your Google Account» debajo del banner que dice lo contrario: mandan el banner y el blog.</sub>
````

## N06 — CTA/guía del aviso por día (transcripción literal)

Fuente: `docs/cola/drops/AVISOS-POR-DIA.md`, hilo 3-2. Se preserva como recurso histórico exacto; no confundir el bloque de October 3 con un aviso actual publicado.

````markdown
#### 3-2 · ANTIGRAVITY (noticia N06 y su carrusel)
Origen: `N06` de `drops/2026-10-01-drops-noticias-repos.md` (rehecho el 2-oct).

~~~~
*ANTIGRAVITY* · *De Gemini CLI a Antigravity CLI*

Desde el *18 de junio de 2026*, Gemini CLI dejó de atender a quien lo usaba gratis con su cuenta de Google (Gemini Code Assist for individuals) y a los planes Google AI Pro y Ultra. Lo reemplazó *Antigravity CLI*, el agente de terminal de Google Antigravity.

*Lo que cambia para vos*
- Es gratis para cuentas personales, con un límite que se renueva cada semana. Pro y Ultra tienen más.
- Trae Gemini 3.8 Flash y Gemini 3.1 Pro.
- Está disponible en Bolivia, para mayores de 18.
- Conserva skills, hooks, subagentes y extensiones (ahora se llaman plugins).

*1. Instalalo*
Mac o Linux:
```
curl -fsSL https://antigravity.google/cli/install.sh | bash
```
Windows (PowerShell):
```
irm https://antigravity.google/cli/install.ps1 | iex
```
*2. Abrilo* en la carpeta de tu proyecto:
```
agy
```
Se abre el navegador: entrá con tu cuenta de Google.

*3. Si venías de Gemini CLI*
- La primera vez encuentra tu configuración vieja y te pregunta qué traer.
- Para convertir tus extensiones a mano: `agy plugin import gemini`
- *La trampa:* las skills del proyecto no se mudan solas. Mové la carpeta `.gemini/skills/` a `.agents/skills/`.
- `GEMINI.md` y `AGENTS.md` los sigue leyendo igual.
- Servidores MCP: ya no van en `settings.json`. Van en `.agents/mcp_config.json` (los del proyecto) o en `~/.gemini/config/mcp_config.json` (los globales). Si uno remoto usaba `url` o `httpUrl`, ahora es `serverUrl`.

*Cómo sabés que quedó:* escribí `/skills` y tienen que aparecer tus skills. Con `/usage` ves cuánto te queda de cuota.

*¿Y si te quedás en Gemini CLI?* Sigue andando con una clave de API paga de Gemini. Con la cuenta gratis, ya no.

Lo que le pedís y lo que lee de tu carpeta va a los servidores de Google. Según su FAQ, la recolección de datos se puede desactivar desde Settings. Para la primera prueba, usá una carpeta sin datos de clientes ni claves.

Contá en General: *¿usabas Gemini CLI? ¿Qué tuviste que mover a mano?*
~~~~
````

## N06/N07 — CTA exacto para el editor

Los CTA que figuran en `GRABAR-10-16-OCT.md`:

- N06: `Buscá ANTIGRAVITY en Avisos · link en mi perfil` (8 palabras).
- N07: `Buscá HAIKU en Avisos · link en mi perfil` (8 palabras).

El CTA se debe usar solo si el recurso correspondiente está disponible en Avisos antes del video. No se comprobó esa condición de publicación desde este encargo.

## Nota separada — corrección mínima factual, no aplicada al texto recuperado

**HAIKU / límite API vs CLI.** El recurso original mezcla contenido para quienes llaman a la API (`thinking: {type: "disabled"}` y `model: "claude-haiku-5-5"`) con lenguaje general «para clasificar». El propio `GRABAR` verifica que el parámetro `thinking: disabled` es aceptado por Haiku 5.5 con esfuerzo `high` o menor y da error 400 con `xhigh`/`max`; eso describe la solicitud API. No presentar el fragmento JSON como un comando/configuración de Claude Code CLI. Si se mantiene, rotularlo «configuración de la API de Anthropic» y no dar un paso CLI implícito. La cifra **US$0,39** aplica el supuesto editorial de +30% también a tokens de salida; la fuente solo da explícitamente el aumento aproximado para el texto de entrada/same text y advierte que la salida equivalente puede truncarse. Mantener ese caveat junto a la cifra. También: el encabezado de control de `GRABAR` dice que el aviso todavía tenía 0,30 USD, mientras que el aviso literal recuperado de ese mismo snapshot ya imprime 0,39 USD; tratar esa nota de control como desactualizada. No sustituirlo por una cifra de precio aprobada ni ampliar el claim.

**ANTIGRAVITY / rutas globales y de proyecto.** Separar tres afirmaciones del origen:

1. Ruta global documentada en el snapshot editorial: `~/.gemini/antigravity-cli/skills/` (también indicada por `https://antigravity.google/docs/skills`).
2. Migración de skills del proyecto: la guía exige mover/renombrar `.gemini/skills/` a `.agents/skills/` manualmente. Esta es la instrucción migratoria que el recurso puede afirmar.
3. No afirmar que la carpeta global anterior `~/.gemini/skills/` hay que moverla manualmente. La tabla editorial dice que no encontró esa indicación; la guía dice que las skills globales compartidas «remain in your user home directory». No convertir el nuevo path en un paso de migración sin prueba.

La tabla del `GRABAR` también advierte que `/docs/skills` y `/docs/cli/reference/` describen de forma distinta el comando para ver skills (`/nombre` vs `/skills`). El CTA/recurso no debe asegurar que ambas comprobaciones son idénticas; la guía original pide confirmar el comportamiento grabado.

## Estado de publicación y límite

Estado de este paquete: **recuperado para integración/QA, no publicado ni enviado**. Las líneas de calendario de 10–11 oct son metadatos históricos. No se comprobó Avisos de WhatsApp, entrega del video, cuenta conectada, permisos, CTA visible o publicación. No se descargaron ni ejecutaron comandos; los enlaces/commands quedan como parte de la fuente literal.
