# Drops de la comunidad · 1-oct-2026 (correcciones, EFFORT, noticias y repos)

Escritos por el workflow del 1-oct (escritor → revisor escéptico → arreglo). **No enviados.** Cada drop se pega en Avisos de Onia Community ANTES de publicar el video de su pieza (ver `plan-3-semanas/GUIONES-2-SEMANAS-1-14-OCT.md`). Si tiene «Condición», se cumple primero.

**Ya verificado por la madre el 1-oct:** los datos de WhatsApp del drop 2 (Meta, renderizado) y gitdiagram (R01). Las condiciones de esos dos se dan por cumplidas.

**Copia lista para pegar, día por día:** `cola/drops/AVISOS-POR-DIA.md` (1-oct, noche). Si corregís un drop acá, corregilo también allá.

## drop-2 · La cuenta de WhatsApp desde el 1-oct  (pieza D02-B)

**Condición:** Ya no depende de verificación: (a) misma tarifa que utilidad y (b) 1.000 mensajes de servicio gratis por mes y por número del negocio quedaron confirmados el 1-oct en la página de Meta renderizada (VERIFICACION-LAPTOP-20261001.md §1, «Updated: Sep 28, 2026»), y «Antes de grabar» (l.28) deja el guion igual. Por eso la rama de corte que le faltaba al video ya no aplica: el cierre «La planilla está en la comunidad» y el paso tres (multiplicar por la tarifa de utilidad) se sostienen. Publicar en Avisos ANTES del video (jue 1-oct). Reemplaza al drop 2 de S1-GUIONES («service cuando Meta la publique»), que no se publica. Al grabar, mirar en pantalla que la ruta «rate cards → Rates (CSV)» siga igual: VERIFICACION confirma la fila de Bolivia, pero no nombra la ruta. Opcional, para que guion y drop digan lo mismo: en el paso uno del guion, «Contá cuántas respuestas mandó tu bot el mes pasado, sin plantillas. Tres mensajes seguidos son tres.»

*La cuenta de WhatsApp desde el 1-oct*

Vale para bots en la API oficial de Meta. La app de WhatsApp Business que usás a mano no cambia.

Los mensajes de servicio (lo que tu bot contesta dentro de las 24 h desde que el cliente escribió) ahora se cobran por mensaje, *a la misma tarifa que utilidad*. Los *primeros 1.000 de cada mes*, por número de WhatsApp de tu negocio, siguen gratis.

Llenalo con tu bot:
```
A. Respuestas que mandó tu bot
   dentro de las 24 h, el mes
   pasado (sin plantillas): ____
   (3 burbujas seguidas = 3)
B. A - 1.000: ____
   (si da negativo, poné 0)
C. Tarifa utility del país de
   tu cliente, en USD: ____
D. Costo del mes = B x C: ____
```
Dónde está C: developers.facebook.com/documentation/business-messaging/whatsapp/pricing → rate cards → Rates (CSV), en USD. La fila es el país del número de tu cliente: Bolivia (+591) está en «Rest of Latin America». Si no la encontrás, no la inventes.

Si B te dio 0, estás dentro de lo gratis. Si no, tu bot habla de más: mandá una respuesta en vez de tres burbujas.

Ojo: si no cargaste un método de pago en Meta, después de los 1.000 gratis tu bot deja de entregar respuestas.

Contá en General: *¿te dio cero o te toca pagar?*

<sub>Fuentes: Guion final: hermes-content/docs/cola/plan-3-semanas/GUIONES-2-SEMANAS-1-14-OCT.md §D02-B (l.85-104) y «Antes de grabar» (l.28, confirmado el 1-oct). Confirmación primaria: VERIFICACION-LAPTOP-20261001.md §1 (l.19-53): «Meta will charge on a per-message basis for service messages» (l.30), «same as those of utility and authentication, by market» (l.38), «Each business phone number has one shared free tier of 1,000 delivered service messages per month» (l.42), sin método de pago Meta entrega los 1.000 y después deja de entregar (l.50), Bolivia en «Rest of Latin America» (l.51). Fórmula y pedido de corrección: auditoria-20260930/LOTE-A.md §D02-B (l.173-198), Pendientes l.360 («(mensajes de servicio − 1.000, mínimo 0) × tarifa utility») y Riesgo 1 l.363. Ruta de la tabla, cobro por país del destinatario y tablas CSV/PDF en USD: S1-GUIONES.md §D02-B evidencia (l.59) y drop 2 viejo (l.668-676). Cambios de esta vuelta: fila A limitada a respuestas dentro de las 24 h sin plantillas (las plantillas no entran en los 1.000, que son de mensajes de servicio); «por número de WhatsApp de tu negocio» (l.42 de VERIFICACION: «business phone number»); línea del método de pago agregada porque VERIFICACION l.45-50 la marca como útil para el drop 2. Omitido a propósito: no acumulación de los mil, reacciones gratis y ventana de anuncios (eso es del drop 4 de S2, ahora «hasta 7 días»).</sub>

## drop-14 · Qué MCP te sobran: medilo, no lo adivines  (pieza S1-D07-B)

**Condición:** Publicar en Avisos de la comunidad (no DM), ANTES del video del mié 14-oct: el guion final cierra en «Lo tenés completo en la comunidad». Reemplaza al drop 14 de S1-GUIONES (l.795, el del grep «mcp__», marcado «(DM)»), que NO se publica: su criterio mandaba a borrar servidores en uso. Antes de grabar, corregir la misma frase en el guion (l.971): «Un mes después medí el uso real: trece se usaban igual» → «Después medí treinta días de uso real: de los que tenía conectados, trece se usaban igual». Del 18-ago al 29-sep son seis semanas, y el 13 sale del inventario del 29-sep, que no es el mismo de los 24. Recomendado, porque es el mismo error que corrige este drop: en el guion, después de «El que no aparece, sobra» (l.973), agregar «Ojo: mira solo esta compu y la última semana».

*Qué MCP te sobran: medilo, no lo adivines*

Que un servidor no aparezca nombrado en tus archivos *no prueba que no lo uses*. Yo tenía 24 conectados y ninguno escrito en mis archivos. Después medí 30 días de uso real: de los que tenía conectados, 13 se usaban igual.

Así se mide:
```
EN LA TERMINAL
claude mcp list
  cuáles tenés y si están
  conectados

DENTRO DE CLAUDE CODE
/context
  anotá cuánto ocupan las
  herramientas (antes)
/usage
  apretá w (7 días): qué parte
  de tu uso va a cada servidor
  MCP
/mcp
  desactivá el que sobra
/context
  otra vez: tiene que bajar
```
El que no aparece en /usage es candidato a sobrar. *Ojo:* /usage cuenta solo esta compu y la última semana. Si lo usás en otro lado (otra compu, claude.ai) o una vez al mes, no lo apagues por esto.

Si lo agregaste vos por terminal, también lo sacás con `claude mcp remove <nombre>`. Los conectores de tu cuenta de claude.ai *no se sacan con claude mcp remove*; esos se apagan con /mcp.

El uso por servidor en /usage aparece solo en planes pagos (Pro, Max, Team, Enterprise).

Corré /usage, apretá w y contá en General: *¿cuántos de tus MCP no aparecen?*

<sub>Fuentes: Guion final: GUIONES-2-SEMANAS-1-14-OCT.md §S1-D07-B (l.960-979) y «Antes de grabar» (l.35). Texto base: auditoria-20260930/LOTE-B.md Pendientes l.372-373 y §S1-D07-B (l.320-341; los conectores de claude.ai no salen con remove, l.322). 24 servidores sin ninguna mención en archivos: hermes-content/docs/ONIA_AGENTES_MCP_AUDITORIA_ANTIPATRONES.md (18-ago) l.19-21 e inventario §3.2 l.184-193. 13 usados / 9 sin uso o caídos, medidos en 30 días: hermes-content/docs/historial/LIMPIEZA_SKILLS_20260929.md §4 l.74-75 y l.86-88. Los dos inventarios no son idénticos (el problema del revisor es cierto en parte): Chrome, computer-use, tareas programadas y visualize sí estaban entre los ~24 del 18-ago (l.186-189), pero el «navegador» figuraba como interno (Claude_Browser, l.189-190), y Claude Docs y postiz no estaban. Por eso el texto dice «de los que tenía conectados» y no «13 de esos 24». code.claude.com/docs/en/costs (versión .md, releída el 1-oct): l.58-60 (atribución por servidor MCP en Pro/Max/Team/Enterprise; cuenta solo los pedidos que consumieron un resultado de sus herramientas), l.64 (d/w alterna entre 24 h y 7 días; «computed from local session history on this machine, so usage from other devices or claude.ai is not included»), l.246 (/context), l.249 (/mcp para desactivar). claude mcp list («List configured MCP servers… approved servers are health-checked») y remove [-s local|user|project] <name>: ayuda de claude mcp en Claude Code 2.1.287 local, verificada el 1-oct (LOTE-B l.323 la había verificado con 2.1.286).</sub>

## drop-EFFORT · Mi tabla de esfuerzo para Claude Code  (pieza D02-A)

⚠️ **Corregido 1-oct (noche):** pasa a Avisos de la comunidad (pedido de Sergio Urcullo: el que comenta EFFORT recibe por DM el link a la comunidad, no el texto). El cierre «respondeme acá» pasa a «contá en General». El guion no cambia: «Comentá EFFORT y te paso mi tabla» sigue siendo cierto con el link. También lo pide el carrusel K10 (vie 2, «Comentá EFFORT»). Publicar en Avisos antes del video y del carrusel del vie 2-oct.

**Condición (vieja, ya no rige la parte del DM):** El guion final cierra con «Comentá EFFORT y te paso mi tabla»: este texto lo manda Sergio Urcullo a mano por DM a quien comente (la automatización comentario→DM no está probada) y tiene que estar listo antes del video del vie 2-oct. Por eso cierra con «respondeme acá» y no con General: quien comenta puede no estar en la comunidad. Si prefiere publicarlo en Avisos, se cambia la última línea del guion a «La tabla está en la comunidad» y el cierre del drop a «Contá en General: ¿qué tarea era y en qué nivel te quedó?», no las dos cosas. Antes de grabar, corregir en el guion lo mismo que se corrigió acá: l.111 «ahora piensa un nivel menos que antes» → «ahora arranca un nivel más abajo que antes»; l.113 «Los anteriores venían en high» → «Opus cinco y Sonnet cinco venían en high» (Opus 4.7 venía en xhigh). Recomendado (dudoso, no es error de dato): l.119 «En mi empresa hay una regla: al modelo más caro se pasa solo cuando Opus, con esfuerzo alto, no alcanzó» → «En mi empresa hay una regla: al modelo más caro se pasa solo cuando Opus no alcanzó. Y la documentación de Anthropic lo dice así: cuando Opus, con más esfuerzo, todavía no alcanza». Si antes sale otro modelo de Claude, re-leer code.claude.com/docs/en/model-config: el default medium es de los modelos 5.5.

*Mi tabla de esfuerzo para Claude Code*

En Claude Code, Opus 5.5 y Sonnet 5.5 arrancan en *medium*. Opus 5 y Sonnet 5 arrancaban en high. Si no tocaste nada, tu perilla quedó un nivel más abajo.

Ojo: la escala cambia según el modelo. En las pruebas de Anthropic, Opus 5.5 en medium iguala o supera a Opus 5 en high.

```
/effort
  ves en cuál estás y elegís
  entre los cinco niveles.
  Enter lo guarda como default;
  la tecla s, solo esta sesión
/effort auto
  borra el que guardaste
claude --effort <nivel>
  arranca una sola sesión
  en ese nivel

low         lo mecánico: renombrar,
            mover archivos
medium      el día a día
high/xhigh  cuando la primera
            respuesta no alcanzó
max         casi nunca: la doc dice
            que tiende a pensar de más
```
*Primero la perilla, después el modelo.* En mi empresa es regla: a Fable, el más caro, solo donde Opus no alcanza. La doc de Anthropic dice lo mismo: Fable cuando Opus 5.5 con más esfuerzo todavía no alcanza.

Para saber en qué nivel va una tarea, abrí una sesión con cada línea y dales la misma tarea:
```
claude --effort medium
claude --effort high
```
Si en high la corregís menos, va en high. Así probás sin dejar high guardado.

Probalo con una tarea tuya y contá en General: *¿qué tarea era y en qué nivel te quedó?*

<sub>Fuentes: Guion final: GUIONES-2-SEMANAS-1-14-OCT.md §D02-A (l.109-124). Auditoría: auditoria-20260930/LOTE-A.md §D02-A, evidencia l.155 (niveles; «Opus 5.5 & Sonnet 5.5: medium (one level below other models)»; /effort sin argumentos abre un deslizador; max «prone to overthinking»; anthropic.com/claude-sonnet-5-5 «Claude Code Default Effort: Medium») y Pendientes l.359 (pide Enter/s, --effort y la regla de Fable). code.claude.com/docs/en/model-config (versión .md, releída el 1-oct): l.583 (default high en todos los modelos con esfuerzo, salvo Opus 5.5 y Sonnet 5.5 en medium y Opus 4.7 en xhigh), l.587-590 («Enter in the /effort slider… save the level as your default and apply it in later sessions» · «s… apply the level to this session only», desde v2.1.257), l.639 (max «prone to overthinking»), l.644-646 (escala calibrada por modelo; Opus 5.5 en medium iguala o supera a Opus 5 en high; al mismo nivel piensa más por turno), l.656 (/effort abre un deslizador; «/effort auto to clear your saved level for the active model»), l.658 (--effort «for a single session»). Fable: regla 2 de hermes-content/docs/ONIA_MODELOS_CLAUDE_Y_CUOTA.md l.39-40 («Fable solo donde Opus no alcanza», regla propia de ONIA). El «con esfuerzo alto» es de la doc de Anthropic: ese doc de ONIA lo atribuye a la doc oficial y hablaba de Opus 5 (l.19-20); releída el 1-oct, platform.claude.com/docs/en/about-claude/models/overview l.25: «Use Claude Fable 5.1… when your evals on Claude Opus 5.5 at higher effort still fall short». Tabla: hermes-content/docs/cola/PRODUCCION-GUIONES-2026-09-29.md l.110. Flag: claude --help, Claude Code 2.1.287 local («--effort <level>  Effort level for the current session (low, medium, high, xhigh, max)»).</sub>

## N03 · Volver a modo manual en Claude Code  (pieza N03)

⚠️ **1-oct (noche):** la palabra de N03 es **COMUNIDAD** (Sergio Urcullo la dijo a cámara; video, carrusel y caption la usan), no MANUAL. El recurso es este drop.

**Condición:** El guion (jue 1-oct) dice «En modo auto, un segundo modelo revisa cada acción en vez de vos». Según la doc, leer y editar dentro de tu carpeta no pasa por esa revisión. Si todavía no se grabó, cambiar a «un segundo modelo revisa en vez de vos lo que Claude quiere hacer; leer y editar en tu carpeta se aprueba solo». Si ya se grabó, no hace falta regrabar: el drop lo corrige.

*Volver a modo manual en Claude Code*

Desde fines de septiembre Claude Code arranca en *modo auto*, en todos los planes: un segundo modelo revisa en vez de vos lo que Claude quiere hacer. Leer y editar archivos de tu carpeta, en general, se aprueba solo, sin esa revisión.

*Por defecto BLOQUEA* (documentación oficial, resumida):
- Bajar y ejecutar código de internet (tipo `curl | bash`)
- Deploys a producción y migraciones
- Borrar para siempre archivos que ya existían antes de la sesión
- Force push, y `git reset --hard` y parecidos, que tiran cambios sin guardar

*Por defecto DEJA PASAR:*
- Trabajar con archivos dentro de tu carpeta
- Instalar las dependencias declaradas en tus archivos lock o manifiestos
- Hacer push a cualquier rama del repo, *incluida la principal*

Si tu rama principal publica tu sitio o tu app, ese último punto es el que importa.

*En la sesión:* la barra de abajo dice en qué modo estás. *Shift+Tab* lo cambia.

*Para que arranque siempre preguntando (terminal):*
1. Abrí `~/.claude/settings.json` (`~` es la carpeta de tu usuario). Si no existe, crealo con esto:
```
{
  "permissions": {
    "defaultMode": "default"
  }
}
```
Si ya tiene contenido, no lo pises. Si tiene `"permissions"`, sumá adentro `"defaultMode": "default"`. Si no lo tiene, pegá el bloque `"permissions": {...}` de arriba dentro de las llaves de afuera, separado del resto con una coma.
2. Si tu proyecto tiene su propio `.claude/settings.json` (o `.claude/settings.local.json`) con otro `defaultMode`, ese le gana al tuyo: cambialo a `"default"` ahí también.
3. Si Claude Code te pregunta si querés pasar a modo auto, decí que no.

*Cómo sabés que quedó:* la próxima sesión que abras en la terminal dice `⏸ manual mode on`.

*En VS Code:* elegí *Manual* en el indicador de modo, abajo del cuadro de texto. Las conversaciones nuevas arrancan en el último modo que elegiste ahí.

Contame en General: *¿en qué modo te arrancó hoy Claude Code?*

<sub>Fuentes: Guion final: hermes-content/docs/cola/plan-3-semanas/GUIONES-2-SEMANAS-1-14-OCT.md §N03 (jue 1-oct). Texto base: auditoria-20260930/LOTE-D.md §N03 y «Pendientes del lote» → N03. https://code.claude.com/docs/en/permission-modes, releída completa el 1-oct: «a second model, the classifier, reviews actions instead of you»; orden de decisión («Read-only actions and file edits in your working directory are auto-approved, except writes to protected paths»; «Reads and working-directory edits outside protected paths skip the classifier»). Listas «Blocked by default» y «Allowed by default» («Installing dependencies declared in your lock files or manifests»): la de la doc es más larga, por eso dice «resumida». Bloque defaultMode en ~/.claude/settings.json y «The next session you start shows `⏸ manual mode on` in the status bar». «Claude Code asks once, in the terminal or in the VS Code extension, whether to change the setting to auto mode. If you decline, your setting stays as it is» (Pro, Max y Team). «a project or managed value outranks ~/.claude/settings.json»; un "auto" en el .claude/settings.json del proyecto hace que se ignore el de ~. Pestaña VS Code: la extensión arranca en «The mode you last picked from the mode indicator» antes de leer ~/.claude/settings.json, y «never reads a project's .claude/settings.json». Cambio a todos los planes: https://code.claude.com/docs/en/changelog 2.1.284 (28-sep). Queda AFUERA la regla `ask` para `Bash(git push *)` que sugería LOTE-D. La página de modos la nombra como ejemplo, pero se deja afuera para que el drop no se alargue.</sub>

## N02 · Checklist: de Sonnet 4.5 a Sonnet 5.5  (pieza N02)

*Checklist: de Sonnet 4.5 a Sonnet 5.5*

Sonnet 4.5 (`claude-sonnet-4-5-20250929`) se retira de la API de Claude el *30 de noviembre de 2026*. Anthropic recomienda pasar a Sonnet 5.5.

*1. Encontralo.* En la carpeta de tu proyecto, sin mirar las dependencias instaladas (o con el buscador de tu editor):
```
grep -rn --exclude-dir=node_modules --exclude-dir=.venv --exclude-dir=.git "claude-sonnet-4-5" .
```
En n8n: abrí cada nodo de Anthropic y mirá qué modelo tiene elegido.

*2. Migralo.* Abrí Claude Code en esa carpeta y escribí:
```
/claude-api migrate this project to claude-sonnet-5-5
```
Te pregunta qué archivos tocar y al final te deja una lista para revisar a mano.

*3. Solo si programás contra la API:* revisá lo que 5.5 rechaza con error 400.
- `temperature`, `top_p` o `top_k` con valores cambiados → sacalos
- `thinking` con `budget_tokens` (pensamiento extendido) → sacalo y elegí un nivel de esfuerzo: `"output_config": {"effort": "low"}` para chat, `"medium"` para agentes
- `"thinking": {"type": "disabled"}` → probá primero sin `thinking` y con esfuerzo `low`. Si lo necesitás apagado: `{"type": "between_tools"}`, sin otros campos y con esfuerzo `high` o menos
- Respuestas pre-llenadas (prefill: el último mensaje del asistente escrito por vos) → usá salidas estructuradas (`output_config.format`) o pedí el formato en el mensaje de sistema
- Obligar a usar una herramienta (`tool_choice` `any` o `tool`) → `{"type": "auto"}`, `strict: true` en la herramienta (su esquema con `additionalProperties: false` y `required`), y decí en el prompt cuándo usarla

En n8n, pasá directo al paso 4: si da error 400, compará el mensaje con esta lista.

*4. Probá.* Tu prueba corre sin error 400 y el campo `model` de la respuesta dice el modelo nuevo.

Contame en General: *¿cuántos resultados te dio la búsqueda del paso 1?*

<sub>Fuentes: Guion final: GUIONES-2-SEMANAS-1-14-OCT.md §N02 (dom 4-oct; promete «la lista completa»). Texto base: auditoria-20260930/LOTE-D.md §N02 y «Pendientes del lote» → N02. Retiro y recomendación: https://platform.claude.com/docs/en/release-notes/overview (30-sep). Comando y alcance: https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide. Lista del paso 3, releída el 1-oct en la skill claude-api de Claude Code 2.1.287. Tabla «Thinking & Effort», fila Sonnet 5.5: `budget_tokens` «Removed - 400», sampling «Non-default values - 400», `disabled` da 400 y `between_tools` va sin otros campos y solo con esfuerzo high o menos. shared/model-migration.md → «Claude Sonnet 5.5 Migration Checklist»: [BLOCKS] «replace `budget_tokens` with an effort level», «also replace assistant prefills», «try adaptive thinking at `low` effort first», «Replace `tool_choice` `any` / `tool` with `auto` plus `strict: true`». Misma sección: «Starting points: `medium` for agentic coding…; `low` for chat». «Common Pitfalls» (prefill): «Use structured outputs (`output_config.format`) or system prompt instructions». «Tool Use Patterns»: «Schema must have `additionalProperties: false` + `required`». Exclusión de node_modules, .venv y .git en el grep: corrección del revisor. Sin ella, la búsqueda podría contar las listas de modelos del propio SDK (riesgo probable, no confirmado: no se pudo abrir el paquete).</sub>

## N06 · Gemini CLI en 5 minutos  (pieza N06)

> ⛔ **NO SE PUBLICA — corregido el 1-oct (noche):** el login gratis con cuenta de Google ya no anda; Gemini CLI fue reemplazado por Antigravity CLI para el plan gratis el 18-jun-2026 (ver la nota en GUIONES §N06).

**Condición:** NO PUBLICAR hasta cumplir 1 y 2. 1) Leer los términos del login con cuenta de Google desde un entorno que no los bloquee (desde la nube están bloqueados developers.google.com y ai.google.dev): Google Terms of Service y «Gemini Code Assist for individuals Privacy Notice» (developers.google.com/gemini-code-assist/resources/privacy-notice-gemini-code-assist-individuals). Si dicen que usan lo que mandás para mejorar sus productos, o que lo leen personas, agregar esa línea de riesgo antes del cierre, con la fuente (como en G01). 2) Antes de grabar, abrir `/model` con la cuenta de Sergio Urcullo. Con login de Google, 3.8 Flash se habilita de a poco (PR 29443). Si no aparece, no hay captura ni demo con ese modelo, y quedan dos salidas. Una: grabar con clave de API (README: clave en aistudio.google.com/apikey · `export GEMINI_API_KEY="YOUR_API_KEY"` · `gemini`; gratis «1000 requests/day»). En ese caso se leen antes los «Gemini API Terms of Service - Unpaid Services» (ai.google.dev/gemini-api/terms#unpaid-services), y el drop suma esa vía con su línea de uso de datos. La otra: bajar la pieza. 3) Mandar junto al texto las 3 capturas de la grabación (instalación, `/model`, respuesta). Sin capturas, sacar la línea «Abajo van 3 capturas…» y cambiar el cierre del guion a «Los pasos están en la comunidad». 4) El guion dice «Con clave de API de Gemini, ya está», y el drop ya no enseña esa vía porque no se leyeron sus términos. Si no se grabó, cambiar a «Si no te aparece, igual podés probar el agente con el modelo que tengas». 5) Publicar antes del video del sáb 3-oct. Si el README cambió los límites o la versión, se corrige con lo que diga ese día.

*Gemini CLI en 5 minutos*

El agente de terminal de Google. Abierto (licencia Apache 2.0) y gratis con tu cuenta de Google: 60 pedidos por minuto y 1.000 por día, según su página en GitHub.

1. Instalalo (necesitás Node.js):
```
npm install -g @google/gemini-cli
```
2. En la terminal, entrá a la carpeta que querés revisar y abrilo:
```
cd nombre-de-tu-carpeta
gemini
```
3. Elegí *Sign in with Google* y entrá con tu cuenta en el navegador.
4. Escribí `/model` y elegí `gemini-3.8-flash`. Llegó en la versión 0.62.0 (29-sep), junto con `gemini-3.5-flash-lite`.
¿No te aparece? Con cuenta de Google se habilita de a poco: seguí con el modelo que tengas elegido.
5. Primer pedido:
```
resumime qué hay acá y qué falta
```
Lo que le pedís y lo que lee de la carpeta va a los servidores de Google: para esta primera prueba, usá una carpeta sin datos de clientes ni claves.

*Cómo sabés que anduvo:* `/model` muestra el modelo elegido y la respuesta nombra archivos que existen.

Abajo van 3 capturas: la instalación, `/model` y la respuesta.

Contame en General: *¿qué te dijo que faltaba en tu carpeta?*

<sub>Fuentes: Guion final: GUIONES-2-SEMANAS-1-14-OCT.md §N06 (sáb 3-oct). Texto base: auditoria-20260930/LOTE-D.md §N06 y «Pendientes del lote» → N06. README de https://github.com/google-gemini/gemini-cli, releído el 1-oct: `npm install -g @google/gemini-cli`, «60 requests/min and 1,000 requests/day with personal Google account», «Apache 2.0». Option 1: «choose Sign in with Google and follow the browser authentication flow». Quick Examples: `cd new-project/` y `gemini`. Option 2 (clave en aistudio.google.com/apikey, `export GEMINI_API_KEY`, «1000 requests/day») queda en la condición 2. Términos: docs/resources/tos-privacy.md del mismo repo, releído el 1-oct. Con cuenta de Google rigen los Google Terms of Service y la «Gemini Code Assist for individuals Privacy Notice»; con clave gratis, los «Gemini API Terms of Service - Unpaid Services». Las páginas de Google que enlaza no se pudieron abrir desde la nube. Versión: https://github.com/google-gemini/gemini-cli/releases/tag/v0.62.0 (29-sep). Habilitación de a poco con login de Google: https://github.com/google-gemini/gemini-cli/pull/29443 (lo cita LOTE-D el 30-sep; el 1-oct no se pudo reabrir desde esta sesión). La línea «va a los servidores de Google… usá una carpeta sin datos de clientes ni claves» es una precaución sobre cómo funciona un servicio en la nube. Lo que Google hace con esos datos es la condición 1.</sub>

## N04 · Plantilla: la skill verify  (pieza N04)

**Condición:** Antes de grabar (lun 5-oct): el guion dice «la corre antes de cada commit» en el título y en la primera frase, y su prueba es «pedile un commit». Pasa lo mismo que en el drop: los commits que solo tocan documentación o tests no la corren. Corregir a «antes de cada commit que toque código» y «pedile un commit que toque código». En la demo, el commit de prueba tiene que tocar código.

*Plantilla: la skill verify*

Desde el 30-sep (Claude Code 2.1.286): si tu proyecto tiene una skill llamada `verify`, a Claude se le indica correrla justo antes de commitear, *salvo en commits que solo tocan documentación o solo tests*. Vale cuando commitea Claude, no en un `git commit` que hacés vos a mano. *Es una indicación, no un candado.*

1. En tu proyecto creá el archivo `.claude/skills/verify/SKILL.md`
2. Pegá esto y poné tus chequeos:
```
---
name: verify
description: Chequeos obligatorios antes de cada commit
---
Antes de commitear, corré en orden:
1. Que compile: npx tsc --noEmit
2. Los tests del proyecto: [tu comando de tests]
3. Si algo falla: no commitees. Decí qué falló y dónde.
```
El chequeo 1 es para proyectos TypeScript. Si el tuyo es otro, poné el comando que lo compila.
3. Actualizá Claude Code: `claude update`

Ojo: tu skill reemplaza al `/verify` que trae Claude Code (el que arma y corre tu app para probar que un cambio hace lo que tiene que hacer). Y si ya usaste ese `/verify`, puede haber guardado su receta en este mismo archivo: abrilo antes de pisarlo.

*Cómo sabés que anduvo:* pedile a Claude un commit que toque código (no solo un README o un test) y fijate que antes aparezca la skill verify corriendo.

Contame en General: *¿qué chequeo le pusiste a tu verify?*

<sub>Fuentes: Guion final: GUIONES-2-SEMANAS-1-14-OCT.md §N04 (lun 5-oct). Texto base: auditoria-20260930/LOTE-D.md §N04 y «Pendientes del lote» → N04 (frontmatter y los 3 pasos del cuerpo). Changelog 2.1.286 (30-sep), releído el 1-oct en https://code.claude.com/docs/en/changelog: «when your project or user skills include one named `verify`, Claude is now told to run it right before committing, except for docs-only and tests-only commits». https://code.claude.com/docs/en/skills, releída el 1-oct. Ruta y frontmatter: `.claude/skills/<skill-name>/SKILL.md`, con `name` y `description`. Que la propia reemplaza a la incluida: tabla «Resolve skills that share a name» («Your skill replaces the bundled command, but not its aliases»). Qué hace el `/verify` incluido: «Build and run your app to confirm a code change does what it should». Aviso de que puede pisar algo: «`/verify` can also record its own recipe… writes what worked to `.claude/skills/verify/SKILL.md`». `npx tsc --noEmit` y tests: los chequeos de ONIA (CLAUDE.md §Carriles, gates) que el guion nombra como «los míos». `claude update`: paso tres del guion final.</sub>

## N01 · Sonnet 5.5 en n8n: apagá Force Tool Call  (pieza N01)

**Condición:** RESERVA. 1) Sale el día después de S2-D08-B. Si D08-B no salió el día anterior, cambiar «Ayer te mostré cómo obligar al agente de n8n a usar la herramienta» por «Si en n8n encendiste la opción que obliga al agente a usar la herramienta». 2) D08-B también es de reserva, así que sale después del 28-sep. Su drop 3 (S2-GUIONES.md «Drops de la semana») enseña a encender la opción sin avisar que choca con Sonnet 5.5. Antes de publicar ese drop, sumarle: «6. Si tu agente usa Sonnet 5.5, no la enciendas: Anthropic dice que ese modelo rechaza con error 400 que lo obliguen a usar una herramienta.» Si no se suma, N01 sale sí o sí al día siguiente de D08-B. 3) Es una conclusión leída, no probada (doc de Anthropic + código de n8n). Antes de publicar, provocar el error en una COPIA con n8n 2.40 o posterior y Sonnet 5.5 (ONIA corre 2.35.3, que no tiene la opción). Si el error no aparece (por ejemplo, porque LangChain lo traduce distinto), este drop y la pieza se reescriben o se bajan. 4) Vale como noticia hasta ~15-nov.

*Sonnet 5.5 en n8n: apagá Force Tool Call*

Ayer te mostré cómo obligar al agente de n8n a usar la herramienta. Si a ese agente le ponés *Sonnet 5.5*, juntá estas dos piezas:
- Guía de migración de Anthropic: Sonnet 5.5 rechaza con *error 400* que lo obliguen a usar una herramienta (`tool_choice` `any` o `tool`).
- Código de n8n: *Force Tool Call on First Iteration* usa por dentro `tool_choice: any`.

*Qué hacer con Sonnet 5.5:*
1. Nodo AI Agent → opciones → *Force Tool Call on First Iteration* → apagada.
2. En el mensaje de sistema, decí cuándo usar la herramienta:
```
Antes de responder sobre [tema], usá la herramienta [nombre].
```
3. Si programás vos contra la API:
```
"tool_choice": {"type": "auto"}
```
y en la definición de la herramienta, `"strict": true`. Con `strict`, el esquema de la herramienta tiene que llevar `"additionalProperties": false` y la lista `"required"`.

*Si la dejaste encendida y falla*, el error dice textual:
```
tool_choice: type "tool" and "any" are not supported for this model.
```

*Cómo comprobás el arreglo:* con la opción apagada, corré 5 mensajes reales que necesiten la herramienta. En cada ejecución, la llamada a la herramienta tiene que aparecer antes del texto. Si en alguna no la llama, hacé más concreta la frase del paso 2: con `auto`, la llamada no está garantizada.

Fuente: platform.claude.com/docs/en/models/sonnet-5-5/migration-guide

Contame en General: *¿tu agente tenía la opción encendida?*

<sub>Fuentes: La pieza no está en el calendario final: GUIONES-2-SEMANAS-1-14-OCT.md la deja en Reserva («S2-D08-B (+N01 al día siguiente)»). Guion y texto base: auditoria-20260930/LOTE-D.md §N01, «Pendientes del lote» → N01 y Riesgos 3. Rechazo de tool_choice any/tool, error textual y reemplazo (auto + strict + decir en el prompt cuándo usarla): https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide y https://platform.claude.com/docs/en/release-notes/overview (28-sep). Que la opción usa tool_choice any: github.com/n8n-io/n8n, packages/@n8n/nodes-langchain/nodes/agents/Agent/agents/ToolsAgent/V3/helpers/createAgentSequence.ts. Releído el 1-oct en la skill claude-api de Claude Code 2.1.287: mismo texto de error. «Tool Use Patterns → Strict tool use»: «Schema must have `additionalProperties: false` + `required`». shared/model-migration.md → Sonnet 5.5 → Breaking change 2: «Because `auto` does not guarantee a call, check that one was made». Ruta de la opción y criterio de comprobación (5 mensajes reales, llamada antes del texto): S2-GUIONES.md «Drops de la semana» → drop 3 (D08-B). Se sacó el ítem `thinking` disabled → `between_tools`: no está en el guion ni en el tema de la pieza. El dato completo quedó en el drop N02.</sub>

## N05 · Caché de prompts en n8n (nodo Anthropic)  (pieza N05)

**Condición:** RESERVA. 1) Solo si n8n 2.42 sale como versión ESTABLE (el 29-sep estaba marcada Pre-release). Ventana: 7 al 14-oct; si el 7-oct sigue en pre-release, se mueve a la semana siguiente. 2) ONIA corre n8n 2.35.3: la demo va en una copia y no se actualiza producción sin plan (regla ya dicha en D08-B). 3) Antes de publicar, en la copia y con Sonnet 5.5: correr «Cómo lo comprobás» y confirmar que la salida del nodo muestra `cache_creation_input_tokens` y `cache_read_input_tokens`. El PR dice que la API los informa, no que n8n los muestre. Si aparecen con otro nombre, usar ese. Si no aparecen, reescribir la comprobación con lo que sí se vea, o bajar la pieza. 4) El mínimo de 512 tokens de Sonnet 5.5 y la escritura de 1 h (USD 4,00) salen de la skill claude-api. La página de anthropic.com publicaba solo la escritura de 5 min. El día de publicar, releer anthropic.com/claude-sonnet-5-5 y la doc de prompt caching. Si no confirman el 512, dejar solo «de 512 a 4.096 según el modelo». Si no confirman los USD 4,00, sacar esa fila y el «(tabla abajo)» del paso 2.

*Caché de prompts en n8n (nodo Anthropic)*

En n8n 2.42, el nodo *Anthropic*, operación *Message*, trae una opción nueva: *Prompt Caching*. Viene en *Disabled*. Ojo: es el nodo Anthropic, no el modelo que le conectás al AI Agent.

1. Probalo en una copia, no en el n8n que está atendiendo de verdad.
2. Elegí *5 Minutes*. Cada vez que se lee la caché, los 5 minutos vuelven a empezar. *1 Hour* solo conviene si pasan más de 5 minutos (y menos de una hora) entre mensajes, y guardar cuesta más (tabla abajo).
3. Guarda lo que se repite al principio de cada pedido: herramientas, mensaje de sistema y mensajes anteriores.
4. La trampa: si esa parte es corta, no se guarda y *no te avisa*. El mínimo va de 512 a 4.096 tokens según el modelo; en Sonnet 5.5 es 512.

*Sonnet 5.5, por millón de tokens:*
```
Entrada normal            USD 2,00
Leer de la caché          USD 0,20
Guardar en caché (5 min)  USD 2,50
Guardar en caché (1 h)    USD 4,00
```

*Cómo lo comprobás:*
1. Corré el flujo dos veces, con menos de 5 minutos entre una y otra.
2. En la salida de la primera, `cache_creation_input_tokens` mayor que 0: se guardó.
3. En la salida de la segunda, `cache_read_input_tokens` mayor que 0: se leyó de la caché.
Si da 0, hay tres causas posibles: el mensaje de sistema es más corto que el mínimo, pasaron más de 5 minutos, o algo cambia entre ejecuciones (por ejemplo, la fecha y hora dentro del mensaje de sistema).

Contame en General: *¿cuántos tokens leyó de la caché tu segunda ejecución?*

<sub>Fuentes: La pieza no está en el calendario final: GUIONES-2-SEMANAS-1-14-OCT.md la deja en Reserva («N05 (si n8n 2.42 sale estable)»). Guion y texto base: auditoria-20260930/LOTE-D.md §N05 y «Pendientes del lote» → N05. Opción, operación, valor por defecto, valores y lo que se guarda: https://github.com/n8n-io/n8n/releases/tag/n8n%402.42.0 (29-sep, Pre-release) y https://github.com/n8n-io/n8n/pull/35804 («Prompt Caching», «Disabled», «5 Minutes / 1 Hour», mínimo de 512 a 4096 tokens sin error, «cached tokens are reported separately by the API»). Entrada, lectura y escritura de 5 min: https://www.anthropic.com/claude-sonnet-5-5 (USD 2 · 0,20 · 2,50). Releído el 1-oct en la skill claude-api de Claude Code 2.1.287. shared/model-migration.md → Sonnet 5.5: «5-minute cache writes $2.50, 1-hour cache writes $4, cache reads $0.20»; «the minimum cacheable prompt is 512 tokens… check the prompt caching docs before quoting the exact value». shared/prompt-caching.md: «Cache writes cost 1.25× for 5-minute TTL, 2× for 1-hour TTL»; «A cache read refreshes the entry's timer»; tabla de TTL (1 hora solo paga con 5 a 60 minutos entre pedidos); campos `cache_creation_input_tokens` y `cache_read_input_tokens`; un prefijo corto no se guarda y da `cache_creation_input_tokens: 0`, sin error; `datetime.now()` en el mensaje de sistema invalida la caché sin avisar.</sub>

## R01 · GitDiagram: cambiá hub por diagram y mirá cómo está armado un repo  (pieza R01)

**Condición:** Antes del video (mar 6-oct). La verificación ya está hecha: el 1-oct, desde la laptop, gitdiagram.com/harry0703/MoneyPrinterTurbo generó el diagrama y el clic en «Generation task [task.py]» abrió su archivo (VERIFICACION-LAPTOP-20261001.md §4, commit 647fe5bc). Opcional en el guion R01: «Cambiá dos letras» es literalmente falso (hub → diagram); el drop ya no lo repite.

*GitDiagram: cambiá hub por diagram y mirá cómo está armado un repo*

Convierte un repo público de GitHub en un diagrama con sus partes y cómo se conectan. Tocás una parte y te lleva a su archivo. Código abierto, licencia MIT.

*1. En el navegador:* en la dirección del repo cambiás _hub_ por _diagram_.
```
github.com/harry0703/MoneyPrinterTurbo
gitdiagram.com/harry0703/MoneyPrinterTurbo
```

*2. En la terminal* (servidor MCP para Claude Code, sin clave ni cuenta). Correlo dentro de la carpeta del proyecto donde lo vas a usar: por defecto queda solo ahí.
```
claude mcp add --transport http gitdiagram https://gitdiagram.com/mcp
claude mcp list
```
El segundo comando te muestra si quedó conectado. Después, dentro de Claude Code, pedile a tu agente que te explique la arquitectura de un repo público *antes* de tocarlo.

*Ojo:* para repos privados te pide un token de GitHub. Eso es darle acceso a tu código a un servicio de otra persona. Para lo privado, no.

*Mini-tarea:* abrí el diagrama de un repo que uses y contá en General qué hace su parte principal, sin abrir ningún archivo.

<sub>Fuentes: Guion final: GUIONES-2-SEMANAS-1-14-OCT.md §Mar 6-oct R01. VERIFICACION-LAPTOP-20261001.md §4 (commit 647fe5bc): diagrama generado al instante, clic en «Generation task [task.py]» abre app/services/task.py en GitHub, la barra muestra «Private Repos». Pendientes de LOTE-D.md (R01: URL, claude mcp add, aviso de repos privados). README de github.com/ahmedkhaleel2004/gitdiagram (commit 7d9aba4, 30-sep), releído el 1-oct: «replace `hub` with `diagram` in any GitHub repository URL», «Jump to the code by clicking any component's linked file or directory», «Use private repositories with a GitHub token via Private Repos», «GitDiagram is a remote MCP server at https://gitdiagram.com/mcp (no key or sign-in). Agents can read a public repository's architecture…», comando `claude mcp add --transport http gitdiagram https://gitdiagram.com/mcp`; LICENSE MIT. `claude mcp add --help` (Claude Code): «--scope … (local, user, or project) (default: "local")» → por defecto queda solo en el proyecto donde se corre. `claude mcp list`: ya usado en S1-GUIONES.md drop 14. El sponsor del README no se nombra (LOTE-D). Cambios de esta vuelta: título sin «dos letras», «En la terminal» en vez de «En Claude Code», aviso de scope local, «repo público» junto al pedido al agente, condición actualizada a la verificación del 1-oct.</sub>

## R02 · Antes de publicar un video hecho con MoneyPrinterTurbo  (pieza R02)

**Condición:** Antes del video (dom 11-oct). Releer README-en.md ese día (S4 §6): si cambió la sección «Background Music» o el comando de Docker, gana el README. Recomendado: en el guion R02 cambiar «Borrala antes de publicar y usá música con licencia.» por «No uses la que trae: usá música tuya o con licencia.», porque con Docker borrar la carpeta no saca las canciones. El drop ya funciona con cualquiera de las dos frases: dice explícitamente que borrar no alcanza y qué hacer en su lugar.

*Antes de publicar un video hecho con MoneyPrinterTurbo*

Te arma un video corto desde un tema: guion, voz, imágenes de stock, subtítulos y música. Licencia MIT. Así lo levantás, según su README en inglés. Necesitás Docker Desktop; en Windows, el README pide usarlo con WSL: corré esto dentro de WSL.
```
git clone https://github.com/harry0703/MoneyPrinterTurbo.git
cd MoneyPrinterTurbo
cp config.example.toml config.toml
docker compose -f docker-compose.release.yml up
```
Abrís localhost:8501 en el navegador y en *Configuración básica* cargás la clave de un modelo (y la de Pexels o Pixabay para el stock).

*Checklist antes de publicar*
1. *Música:* según su README, la que trae sale de videos de YouTube. No la uses. Con Docker no alcanza con borrar la carpeta resource/songs: las canciones vienen dentro de la imagen. Lo que sí sirve: en _Fuente de música de fondo_ viene elegida _Música de fondo aleatoria_, que usa esas canciones. Cambiala a _Sin música de fondo_ o a _Música de fondo personalizada_, con un tema tuyo o con licencia.
2. *Imágenes:* salen de Pexels, Pixabay o Coverr. Leé sus condiciones en su propia página.
3. *Voz:* Edge TTS (en la app figura como Azure TTS V1) es gratis y sin clave.
4. *Guion:* leelo vos. Si lo podría decir cualquier otro negocio, reescribilo.
5. *Sponsors:* algunos enlaces de los sponsors del README son de afiliado (llevan aff=). Es normal; sabelo.

*Pregunta para General:* ¿de dónde vas a sacar la música de tus videos?

<sub>Fuentes: Guion final: GUIONES-2-SEMANAS-1-14-OCT.md §Dom 11-oct R02. Pendientes de LOTE-D.md (R02: música con licencia, Pexels/Pixabay/Coverr, Edge TTS, revisión humana, sponsors con afiliado) y §R02. github.com/harry0703/MoneyPrinterTurbo (commit 2e1b303), releído el 1-oct: README-en.md «Docker Deployment» (Docker Desktop; para Windows enlaza «Install WSL» y «Use Docker containers with WSL»; `docker compose -f docker-compose.release.yml up`; «Before the first start, copy config.example.toml to config.toml»; la WebUI en el puerto 8501 de la propia máquina), «add the corresponding API keys in the WebUI basic settings», «Pexels (free), Pixabay (free), and Coverr», «Azure TTS V1 in the WebUI is powered by Edge TTS and is free to use without an API key», sección «Background Music»: «The current project includes some default music from YouTube videos. If there are copyright issues, please delete them»; LICENSE MIT. Etiquetas de webui/i18n/es.json: «Configuración básica», «Fuente de música de fondo», «Música de fondo aleatoria», «Sin música de fondo», «Música de fondo personalizada». webui/Main.py `_render_background_music_settings`: opciones sin música / aleatoria / predefinida / personalizada / Sonilo / ElevenLabs, por defecto «random». Canciones dentro de la imagen: docker-compose.release.yml usa ghcr.io/harry0703/moneyprinterturbo:latest y solo monta config.toml y storage; Dockerfile `COPY . .`; .dockerignore no excluye resource/ (29 mp3 en resource/songs). Sponsors: llevan `aff=` los enlaces de Kimi (también en la lista de proveedores) e Infistar; BytePlus y OfoxAI llevan `utm_`; OpenAI, Anthropic y Gemini enlazan directo. Cambios de esta vuelta: puente con el guion (borrar no alcanza), «algunos enlaces… (aff=)», «Configuración básica», localhost en vez de la IP, aviso de WSL para Windows (cp funciona ahí).</sub>

## R03 · PageIndex: el script del Quickstart, comentado en español  (pieza R03)

**Condición:** Antes del video (vie 9-oct). Releer el Quickstart del README ese día: si cambió el código o los nombres de modelo, gana el README.

*PageIndex: el script del Quickstart, comentado en español*

Hace que la IA lea un PDF largo por secciones: arma un índice en forma de árbol y el modelo razona por dónde entrar. Licencia MIT.

*1. Instalar, dentro de un entorno virtual* (en Mac con Homebrew y en Ubuntu o Debian recientes, pip suelto falla con «externally-managed-environment»)
```
python3 -m venv .venv
source .venv/bin/activate
pip install -U pageindex
```
En Windows: `py -m venv .venv`, después `.venv\Scripts\activate`, y el mismo pip.

*2. Guardá esto como probar.py, en la misma carpeta que tu PDF*
```
import os
from pageindex import PageIndexClient

# Tu clave de OpenAI: el texto del PDF va a OpenAI
os.environ["OPENAI_API_KEY"] = "tu-clave-de-openai"

client = PageIndexClient(
    index="gpt-5.6-luna",  # arma el índice: alcanza un modelo básico
    chat="gpt-5.6-sol",    # busca en el índice: el mejor que puedas pagar
)

# Cambiá report.pdf por tu archivo. El índice se arma una vez:
# ~USD 0,001 por página según el README (1.000 páginas, poco más de 1 dólar)
doc_id = client.submit_document("report.pdf")["doc_id"]

# Cada pregunta también se cobra en tu cuenta de OpenAI.
# Preguntá algo cuya respuesta YA sepas, y pedí dónde lo encontró
answer = client.chat("¿[tu pregunta]? Decime en qué página está.", doc_id=doc_id)
print(answer)
```

*3. Correr* (con el entorno virtual activado, en cualquier sistema)
```
python probar.py
```

*Ojo*
- No pegues probar.py en General ni en ningún chat: tiene tu clave. Si pedís ayuda, borrala antes.
- «Modo local» quiere decir que el índice se arma en tu máquina, pero el texto del PDF va a OpenAI. Probalo con un documento *sin datos de clientes*.
- En modo local es para PDFs con texto, no escaneados.

Y el 98,7 % de acierto que muestran es una medición suya en otra prueba (FinanceBench, con su sistema Mafin 2.5), no de este script.

*Mini-tarea:* correlo con un PDF tuyo y contá en General si te dijo bien la página.

<sub>Fuentes: Guion final: GUIONES-2-SEMANAS-1-14-OCT.md §Vie 9-oct R03. Pendientes de LOTE-D.md (R03: Quickstart en español, «el texto del PDF va al proveedor del modelo», «probalo con un documento sin datos de clientes») y §R03. README de github.com/VectifyAI/PageIndex releído el 1-oct (repo en 6d23caf): bloque «Quickstart» tal cual (`pip install -U pageindex`, `os.environ["OPENAI_API_KEY"]`, `PageIndexClient(index="gpt-5.6-luna", chat="gpt-5.6-sol")`, `submit_document("report.pdf")["doc_id"]`, `client.chat(..., doc_id=doc_id)`); «index=: a basic model is sufficient», «chat=: use the best model you can afford»; «about $0.001 per page… a 1,000-page textbook costs a little over a dollar… once»; tabla Local/Cloud (Local: «Text-based PDFs»); «98.7% accuracy on FinanceBench» enlazado a vectify.ai/blog/Mafin2.5 y al repo Mafin2.5-FinanceBench (el benchmark del modo local es otro: PageIndex-OSS-Benchmark); LICENSE MIT. Revisor (1-oct): pageindex 0.2.21 instalado, la API del Quickstart existe y en modo local submit_document es síncrono; `pip install` suelto falla con «externally-managed-environment» en el Python de Homebrew y de Debian/Ubuntu recientes → entorno virtual (`-m venv`, módulo estándar de Python). Comentarios en español, la línea de costo por pregunta y «decime en qué página» son míos (texto del prompt, no función de la librería). Cambios de esta vuelta: venv, `py` en Windows, `python` con el entorno activado, aviso de no compartir probar.py, costo por pregunta, 98,7 % separado de los avisos del modo local, «correlo» sin tilde.</sub>

## R04 · AI Engineering from Scratch: por dónde arrancar con agentes  (pieza R04)

**Condición:** Antes del video (mié 14-oct).

*AI Engineering from Scratch: por dónde arrancar con agentes*

Curso gratis en GitHub, licencia MIT, más de 500 lecciones. La fase 14 es de agentes. Portada en español: i18n/es/README.md

*Los tres comandos*
```
git clone https://github.com/rohitg00/ai-engineering-from-scratch.git
cd ai-engineering-from-scratch
python3 phases/14-agent-engineering/01-the-agent-loop/code/main.py
```
En Windows, cambiá python3 por python o py. Solo Python: sin instalar nada y sin clave. Al final tenés que ver _the total including 15% tax is 138.0_, _turns used: 5_ y tres herramientas (calculator, kv_get, kv_set).

*El orden que te recomiendo.* Las cinco dicen «Python (stdlib)»: solo Python estándar. Cambiá la carpeta en el tercer comando:
```
01-the-agent-loop           el bucle: observar, pensar, actuar
02-rewoo-plan-and-execute   planificar separado de ejecutar
03-reflexion-verbal-rl      después de fallar, anota qué aprendió y lo usa en el próximo intento
04-tree-of-thoughts-lats    buscar entre varios caminos antes de elegir
05-self-refine-and-critic   mejorar su propia respuesta en varias pasadas
```

*Ojo:* el inglés es el original. Las lecciones en otros idiomas son traducción a máquina (rama translations).

*Mini-tarea:* corré la 01 y contá en General, con tus palabras, qué hace el agente en cada vuelta.

<sub>Fuentes: Guion final: GUIONES-2-SEMANAS-1-14-OCT.md §Mié 14-oct R04 (línea 981 y fila del calendario del mié 14-oct). Pendientes de LOTE-D.md (R04: git clone, python3 de la lección 14-01, lecciones 14-01 a 14-05, aviso de traducción a máquina) y §R04. README de github.com/rohitg00/ai-engineering-from-scratch (último commit 29-sep, 1bafaa8): «523 lessons… Free, open source, MIT», `git clone https://github.com/rohitg00/ai-engineering-from-scratch.git`, tabla de la fase 14 (01 The Agent Loop · 02 ReWOO and Plan-and-Execute · 03 Reflexion · 04 Tree of Thoughts and LATS · 05 Self-Refine and CRITIC), «English is canonical; lesson pages are machine-translated on the `translations` branch»; carpeta i18n/es/README.md. Cada docs/en.md de 14-01 a 14-05 dice «Languages: Python (stdlib)»; títulos usados para las descripciones: «Observe, Think, Act», «Decoupled Planning», «after each failed trial, the agent writes a reflection… conditions the next trial on that memory», «Deliberate Search», «Iterative Output Improvement». Corrido el 1-oct (revisor y esta revisión, Python 3.11, sin red): 14-01 a 14-05 salen con código 0 e importan solo biblioteca estándar (dataclasses, typing, re, itertools, math, random); la 01 imprime «final answer: the total including 15% tax is 138.0», «turns used: 5», «tools used: ['calculator', 'kv_get', 'kv_set']». El drop no cita la salida de 02-05. `python`/`py` en Windows: nombre habitual del intérprete con el instalador de Python para Windows. Cambios de esta vuelta: fecha corregida (mié 14-oct, no dom 4-oct) y nota de Windows.</sub>

## R05 · claude-skills: escaneá cada skill antes de instalarla  (pieza R05)

**Condición:** BLOQUEANTE: Sergio Urcullo decide antes de publicar si se sigue recomendando el paquete entero. Medido el 1-oct (SkillSpector v2.12.0, --no-llm, claude-skills 19392f7): marketing-skill/ entero da 100/100 · CRITICAL · DO NOT INSTALL, con 3 HIGH y 22 MEDIUM; las cinco, de a una, dan Recommendation CAUTION. Si NO lo recomienda: borrar del paso 2 la viñeta «O el paquete entero» y su bloque de comandos, y en el guion R05 cambiar «En Claude Code agregás el catálogo y después instalás un solo paquete. Los dos comandos están en pantalla.» por «Clonás el repo y copiás a tu carpeta de skills solo las que escaneaste.» (el título también dice «instalá un solo paquete»). En los dos casos el guion R05 (sáb 10) cambia «escaneala antes, como te mostré con el escáner de NVIDIA» por «escaneá cada skill antes, como te mostré con el escáner de NVIDIA: el paquete entero, escaneado junto, da no instalar». Confirmar en la laptop que una skill con puntaje bajo muestra CAUTION, como pasó en el contenedor. Publicar después de G04 (mié 7-oct) y antes del video (sáb 10-oct). Releer el README de SkillSpector ese día: si cambió el comando de instalación, gana el README.

*claude-skills: escaneá cada skill antes de instalarla*

Catálogo gratis de skills para Claude Code, licencia MIT, por paquetes. No instales todo. El de marketing trae 48 skills y más de 60 scripts de Python que corren en tu máquina.

*Cinco para un negocio chico*
- page-cro: por qué tu página no convierte
- copywriting: los textos de tu web (inicio, precios, producto)
- local-seo-manager: SEO local para negocios que van a la casa del cliente (plomería, limpieza, reparaciones): perfil de Google Business y respuestas a reseñas
- cold-email: correos en frío a empresas que todavía no te conocen
- social-content: posts para Instagram, TikTok, LinkedIn o Facebook

*1. Escaneá esas cinco, de a una.* Con el escáner de NVIDIA (necesitás uv). Con --no-llm, el contenido no sale de tu computadora:
```
uv tool install git+https://github.com/NVIDIA/skillspector.git
git clone https://github.com/alirezarezvani/claude-skills.git
skillspector scan ./claude-skills/marketing-skill/skills/page-cro/ --no-llm
```
Repetí la última línea cambiando page-cro por copywriting, local-seo-manager, cold-email y social-content. De a una, no la carpeta entera: el puntaje suma todos los archivos que escanea.

*Leé la línea Recommendation, no solo el número*
- SAFE: adelante.
- CAUTION: leé los hallazgos (Issues). Si el puntaje es bajo y aun así dice CAUTION, es que el escaneo quedó parcial: lo ves en «Inspection Completeness».
- DO NOT INSTALL: esa no.

*2. Instalá*
- *Solo las que pasaron* (lo más seguro): copiá la carpeta de cada una (claude-skills/marketing-skill/skills/page-cro y las demás) a ~/.claude/skills/. Así lo indica el README, en «Manual Installation».
- *O el paquete entero*, con los dos comandos del video, dentro de Claude Code. Trae las 48, y escaneado entero da DO NOT INSTALL, por tres hallazgos HIGH en archivos de referencia de analytics-tracking y seo-audit. Leelos antes de decidir.
```
/plugin marketplace add alirezarezvani/claude-skills
/plugin install marketing-skills@claude-code-skills
```
En los dos casos comprobás con /skills: tiene que aparecer page-cro.

*Ojo*
- El README no coincide consigo mismo: 388 skills en un lado, 345 en otro. No es evidencia.
- Una parte se vende aparte: STORE.md ofrece paquetes y skills sueltas, de USD 9 a 99.
- El último cambio del repo es del 26 de agosto.

*Pregunta para General:* ¿qué Recommendation te dio page-cro, y por qué?

<sub>Fuentes: Guion final: GUIONES-2-SEMANAS-1-14-OCT.md §Sáb 10-oct R05. Pendientes de LOTE-D.md (R05: los dos comandos, SkillSpector, cinco skills de marketing, STORE.md) y §R05. github.com/alirezarezvani/claude-skills (último commit 26-ago, 19392f7): README «388 production-ready…», «Convert all 345 skills…», Quick Install (`/plugin marketplace add alirezarezvani/claude-skills`, `/plugin install marketing-skills@claude-code-skills`), «Manual Installation… Copy any skill folder to ~/.claude/skills/ (Claude Code)»; .claude-plugin/marketplace.json: marketing-skills → ./marketing-skill (no hay plugin suelto para ninguna de las cinco); 48 carpetas en marketing-skill/skills/ y 62 .py en marketing-skill/; frontmatter de las cinco (local-seo-manager: «service-area businesses — appliance repair, HVAC, plumbing, cleaning, and any business that serves customers at their location»); STORE.md: packs de $49, $49, $39 y $39, «Complete Collection — $99», «Individual Skills — $9 each»; LICENSE MIT. SkillSpector, README de github.com/NVIDIA/SkillSpector (2226747, 29-sep): `uv tool install git+https://github.com/NVIDIA/skillspector.git`, «Use --no-llm to keep contents local», «Score Calculation» (CRITICAL +50, HIGH +25, MEDIUM +10, LOW +5, scripts ×1.3), tabla 0-20 SAFE · 21-50 CAUTION · 51-100 DO NOT INSTALL, «Batch Scanning» desde contrib/batch_scan (pide clonar SkillSpector: descartado por más pasos); src/skillspector/nodes/report.py: un escaneo degradado o incompleto pasa SAFE a CAUTION («Fail closed for any incomplete/degraded scan»). Corrido el 1-oct en el contenedor (gratis, sin LLM), coincide con el revisor: marketing-skill/ entero 100/100 · CRITICAL · DO NOT INSTALL, 233 componentes, 25 hallazgos (HIGH: P1 analytics-tracking/references/debugging-playbook.md:51, MP3 analytics-tracking/references/event-taxonomy-guide.md:33, AR2 seo-audit/references/schema-types.md:38; 22 MEDIUM). De a una: page-cro 44, copywriting 44, local-seo-manager 0, cold-email 7, social-content 0, todas «Recommendation CAUTION»; las de puntaje bajo, con «Status partial» en «Inspection Completeness». Cambios de esta vuelta: escaneo skill por skill, regla de leer Recommendation, dos caminos de instalación con el resultado del paquete entero a la vista, rango de STORE.md (USD 9 a 99), local-seo-manager acotado a negocios que van a la casa del cliente, pregunta que ya no pide pegar el puntaje.</sub>

## R06 · CodeGraph: instalar, apagar la telemetría y desinstalar  (pieza R06)

**Condición:** Antes del video (jue 8-oct). Releer el README ese día (el repo se mueve a diario): si cambiaron los instaladores o la sección Uninstall, gana el README.

*CodeGraph: instalar, apagar la telemetría y desinstalar*

Le da a tu agente un mapa de tu código. Corre en tu máquina, licencia MIT. Los pasos, según su README:

*1. Instalar*
Mac/Linux: bajá el instalador y leelo antes de correrlo (de less salís con q).
```
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh -o install.sh
less install.sh
sh install.sh
```
Windows (PowerShell): abrí primero https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 en el navegador y leelo. Después:
```
irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex
```
Si tenés Node, en cualquier sistema: `npm i -g @colbymchenry/codegraph`

*2. Conectarlo a Claude Code* (en una terminal nueva)
```
codegraph install
```
Te pregunta «Share anonymous usage stats?» y viene marcado que sí: elegí No. Si ya dijiste que sí: `codegraph telemetry off`

*3. Armar el mapa, dentro de tu proyecto*
```
codegraph init
```

*Para sacarlo todo, en este orden*
```
codegraph uninit
codegraph uninstall
```
El primero, dentro de cada proyecto: borra su mapa (la carpeta .codegraph). El segundo lo saca de cada agente que configuró y borra el programa.

*Ojo*
- `codegraph install` escribe una sección en tu CLAUDE.md y deja permisos automáticos para sus herramientas en Claude Code. `codegraph uninstall` los saca.
- Su propio README avisa: al final de una sesión larga te queda *más* contexto ocupado, no menos.
- La tabla de ahorro del README (siete repos) la midió el autor.

*Mini-tarea:* hacele a tu agente una pregunta sobre tu código y contá en General si usó CodeGraph o abrió archivo por archivo.

<sub>Fuentes: Guion final: GUIONES-2-SEMANAS-1-14-OCT.md §Jue 8-oct R06. Pendientes de LOTE-D.md (R06: codegraph install, init, telemetry off, uninstall; la nota sobre contexto en sesiones largas) y §R06. README de github.com/colbymchenry/codegraph releído el 1-oct (d45edca; el revisor lo vio en 81e08b7, README sin cambios): instaladores «# macOS / Linux: curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh» y «# Windows (PowerShell): irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex» (el drop baja el .sh con -o y manda a leer el .ps1 antes, como pide el guion), `npm i -g @colbymchenry/codegraph`, «open a new terminal before the next step», `codegraph install`, `codegraph init` («creates the local .codegraph/ directory and builds the full graph»); Uninstall: «One command removes CodeGraph from every agent it configured and the CLI itself… Your project indexes (.codegraph/) are left untouched; remove those per-project with codegraph uninit»; Telemetry: «The installer asks up front; turn it off any time: codegraph telemetry off»; src/installer/index.ts: pregunta «Share anonymous usage stats?» con `initialValue: true`, una sola vez, dentro de `codegraph install`; lista del instalador: sección marcada en CLAUDE.md / AGENTS.md / GEMINI.md, «Removed cleanly by codegraph uninstall», y «Set up auto-allow permissions when Claude Code is one of the targets»; «A note on context… costs more, not less… about 80% more retrieval context resident»; tabla de siete repos (medición del autor, 2026-08); LICENSE MIT. No se instaló. Cambios de esta vuelta: uninit antes de uninstall, telemetría en el momento de la pregunta, salir de less con q, camino de Windows (install.ps1), la línea de cifras dice dónde están.</sub>

## R07 · Remotion: ¿en qué licencia caés?  (pieza R07)

**Condición:** Antes del video (lun 12-oct). Releer LICENSE.md ese día: avisa un cambio de licencia en Remotion 5.0; si ya salió, gana el texto nuevo.

*Remotion: ¿en qué licencia caés?*

Remotion hace videos con React y trae skills para que tu agente arme el video (remotion.dev/docs/ai/skills). Si tenés Node.js:
```
npx create-video@latest
```

La licencia *no es MIT*: GitHub muestra «Other». Esto dice su LICENSE.md:

*Gratis (Free License), incluso para uso comercial, si sos:*
1. una persona
2. una empresa con fines de lucro de hasta 3 empleados
3. una organización sin fines de lucro
4. alguien evaluando si le sirve, que todavía no lo usa de forma comercial

*Licencia de empresa (paga):* si no entrás en ninguno de esos cuatro grupos.

*Prohibido para todos:* copiar o modificar el código de Remotion para vender, alquilar o licenciar tu propia versión de Remotion.

Casos borde: remotion.pro/faq · Precios: remotion.pro/license
El mismo archivo avisa que en Remotion 5.0 la licencia va a cambiar un poco: releela cuando actualices.

Esto es lo que dice el texto, no un consejo legal.

*Pregunta para General:* ¿en qué grupo caés vos: 1, 2, 3, 4 o empresa? Anotalo.

<sub>Fuentes: Guion final: GUIONES-2-SEMANAS-1-14-OCT.md §Lun 12-oct R07. Pendientes de LOTE-D.md (R07: las cuatro condiciones de la Free License, prohibición de revender derivados, enlace a remotion.pro/faq, sin consejo legal) y §R07. github.com/remotion-dev/remotion leído el 1-oct (commit c320056, v4.0.532): README «Video tools for the agent era», `npx create-video@latest` («If you already have Node.JS installed»), enlace «Agent Skills» → https://www.remotion.dev/docs/ai/skills; LICENSE.md: «In Remotion 5.0, the license will slightly change», Eligibility (an individual · a for-profit organization with up to 3 employees · a non-profit or not-for-profit organization · evaluating whether Remotion is a good fit, and are not yet using it in a commercial way), «to use the software non-commercially or commercially for the purpose of creating videos and images», Disallowed («copy or modify Remotion code for the purpose of selling, renting, licensing, relicensing, or sublicensing your own derivate of Remotion»), Company License → remotion.pro/license, FAQs → remotion.pro/faq. API de GitHub: licencia NOASSERTION («Other»). No se cita precio de la licencia de empresa (no verificado). Revisor (1-oct): sin problemas; sin cambios en esta vuelta.</sub>

## G05 · Plantilla de comercial de producto (atribución corregida: CC BY 4.0, no MIT)  (pieza G05)

**Condición:** Reemplaza al drop 5 de S4-GITHUB-REPOS.md §5, que atribuía la plantilla como «MIT» (corrección obligatoria de LOTE-D). G05 está en la reserva sin día: publicar antes de su video cuando tenga fecha.

*Plantilla de comercial de producto para Seedance*

Copiás el bloque, cambiás lo que está entre [corchetes] y se lo mandás a un chat (ChatGPT, Claude, Gemini) junto con fotos de tu producto. Te devuelve un prompt listo para Seedance.
```
Quiero un comercial cinematográfico. Mi producto es [producto]; te mando las fotos. Tono: [tono]. [duración, entre 8 y 20 s], [formato 16:9 o 9:16].
Reescribí esto como UN prompt listo para Seedance, con esta estructura:
1. Apertura: categoría, duración, formato, estética de comercial, color, profundidad de campo
2. Producto: material, silueta, acabado, cómo le pega la luz
3. Tomas: "0-2s:" con tiempos, O "Toma 1:" numeradas (nunca las dos)
4. Textos: cada uno con su propia ventana de tiempo
5. Palabras de estilo: todas juntas, al final
Trampas que el prompt tiene que evitar:
- No pedirle al modelo que escriba el logo ni el eslogan: dejar un cuadro final limpio; van después, en edición.
- No mezclar luz de comercial con estética de celular: elegir una.
- Un efecto físico por toma: líquido, humo o polvo, cada uno en la suya.
- Nunca menos de un segundo por toma.
```

*Cómo sabés que salió bien:* el producto no cambia de forma entre tomas.

*Ojo:* el repo es la vidriera de un sitio (goodcase.ai): los ejemplos enlazan ahí.

_Estructura y trampas de la plantilla product-commercial-shotlist de awesome-seedance / goodcase.ai (github.com/LearnPrompt/awesome-seedance). Curaduría bajo licencia CC BY 4.0: creativecommons.org/licenses/by/4.0. Traducción y resumen propios._

*Mini-tarea:* pasale la plantilla a tu chat con fotos de un producto tuyo y pegá en General el prompt que te devolvió.

<sub>Fuentes: LOTE-D.md §G05 y «Pendientes del lote» (corrección de atribución). Plantilla releída el 1-oct (commit 35cdee9): github.com/LearnPrompt/awesome-seedance/blob/main/docs/templates/en/product-commercial-shotlist.md — «A polished 8 to 20 second ad», «send it to any AI chat (ChatGPT, Claude, Gemini) together with your reference images»; el bloque «Copy this» que se manda al chat incluye Structure de 5 partes Y Pitfalls (logo/slogan → «Reserve a clean end frame and composite the type afterwards» · «Mixing high-end commercial light with phone-UGC texture. Pick one» · «Liquid, smoke and powder each need their own shot» · «Under about one second per shot the model stops resolving individual actions»), por eso las trampas van dentro del bloque. README: insignias «code-MIT» y «curation-CC BY 4.0» (enlazada a https://creativecommons.org/licenses/by/4.0/); «Curation (selection, organization, statistics, template extraction, summaries written by us) is licensed under CC BY 4.0. Reuse it with attribution to awesome-seedance / goodcase.ai». La atribución trae crédito, enlace a la fuente, enlace a la licencia y aviso de cambios. Guion G05 en LOTE-D §G05 (en reserva, no en el calendario 1-14 oct). REVISIÓN DE COHERENCIA S4 §5 vs LOTE-D (1-oct): drop 1 (G01), drop 4 (G04), drop 10 (G10) y drop 11 (G11) siguen coherentes con LOTE-D y con los guiones finales; comandos de SkillSpector iguales en su README del 29-sep; el cambio de README de paperclip no toca el drop 11. Único detalle: el drop 11 dice «8. Si es skill: escanearla (drop 4)», y el drop 4 va por DM (ESCANEO), no en Avisos; R05 trae los comandos completos. Cambios de esta vuelta: trampas dentro del bloque y enlaces a la fuente y a la licencia CC BY 4.0.</sub>
