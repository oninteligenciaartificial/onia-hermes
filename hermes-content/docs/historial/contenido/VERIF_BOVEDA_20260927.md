# Verificación de la Bóveda antes de publicar — 2026-09-27

> Foto del día (no fuente). Hecha por un subagente de la sesión de contenido sobre
> `hermes-content/sitio-sergiourcullo/` contra producción (`oninteligenciaartificial/sergiourcullo`
> @ `7412814`). Capturas y mediciones quedaron en el scratchpad de esa sesión (efímero).

**Veredicto: no se publica tal cual.** Se publica después de B1 (decide Sergio Urcullo) y C1–C7
(reemplazos listos; C2 y C4 probados a 390 px). Los 17 menores no bloquean.

## Lo que está bien (medido)
- 0 links internos rotos (con `cleanUrls`; `/llamada` es redirect válido de `vercel.json`).
- 0 errores de JS y 0 scroll horizontal a 390 y 1280 px, claro y oscuro. 0 backticks visibles. 0 «muy
  pronto / beta / próximamente». Ninguna mención ni precio de Onia en las 4 páginas nuevas (el único
  precio es «$200», el plan de Claude). Ningún testimonio. HTML sin IDs duplicados; `og:url` bien.
- Buscador y filtros de la Bóveda funcionan (Automatización 1, Agentes 1, MCP 2, Servidor 2, Todo 7).
- Regresión: `/stack`, `/homelab`, `/vps`, `/claude-code` y las dos `/archivos` quedan idénticas a
  producción (390 y 1280, claro y oscuro).
- Nombres técnicos confirmados contra fuentes reales: nodos de **n8n 2.40** (npm): Webhook, If,
  Google Sheets «Append Row», Telegram «Send Message», Switch, HTTP Request, Wait, Schedule Trigger,
  Basic LLM Chain, OpenAI Chat Model, Structured Output Parser, AI Agent, Respond to Webhook. Switch
  manda cada ítem a la primera regla que cumple. Sin Auto-Fix, el parser falla con «Model output
  doesn't fit required format». **Claude Code 2.1.283:** `claude mcp add --transport http <nombre>
  <url>`, `claude mcp list` y `/mcp` existen.

## BLOQUEA
**B1 · Portada, `index.html:70-72` contra `:125-126`.** El hero dice «6 herramientas en producción ·
5 de ellas gratis · $200 al mes todo el stack», y el pilar nuevo dice «Un VPS alquilado». Pero
`/vps` dice «El mío: Bs 220 al mes» (`vps/index.html:153`) y `/stack` dice que la llave de Hermes «se
paga por uso» (`stack/index.html:415`): «$200 al mes todo el stack» no es el costo real. Pendiente
de Sergio Urcullo desde `a36d9b28`. Reemplazo por defecto:
- `:71` → `<p class="q">pueden ser<br>gratis</p>`
- `:72` → `<p class="q">al mes<br>la que piensa</p>`
- `:70`: si las seis no corren hoy → `<p class="q">herramientas<br>en la guía</p>` (sólo lo sabe Sergio).

## CORREGIR
**C1 · Tiempos de lectura inflados** (`index.html:154`, `:165`, `:176` dicen 10, 8 y 7 min; las páginas
tienen 505, 598 y 411 palabras). → `4 min`, `5 min`, `4 min de lectura`.

**C2 · `/mcp` en el teléfono corta el comando** (`mcp/index.html:14-22`; entran 38 caracteres, el
comando tiene 46). Reemplazo probado:
```html
<pre><span class="c"># agregá el servidor (-t: transporte)</span>
<span class="k">claude</span> mcp add -t http &lt;nombre&gt; &lt;url&gt;

<span class="c"># mirá qué quedó conectado</span>
<span class="k">claude</span> mcp list

<span class="c"># dentro de Claude Code:</span>
<span class="k">/mcp</span>
<span class="c"># estado, autenticación, herramientas</span></pre>
```
Diagrama (`:8-12`), probado:
```html
<pre>Claude Code
  ↓ solicita una herramienta
Servidor MCP
  ↓ ejecuta con los permisos
    que le diste
Notion / CRM / base de datos</pre>
```

**C3 · `/mcp` atribuye los permisos a `/mcp`** (`mcp/index.html:22`). En Claude Code, `/mcp` gestiona
servidores (ver herramientas, autenticar, reconectar, activar); los permisos van en `/permissions`.
Agregar después del `</pre>` de C2:
```html
<p>Los permisos no se ven en <code>/mcp</code>: se fijan con <code>/permissions</code>. Dejá permitida sólo la herramienta de lectura, por ejemplo <code>mcp__crm__get_lead_by_id</code>, y que todo lo que escribe, borra o envía te pida aprobación.</p>
```

**C4 · `/automatizar`: el flujo se corta en el teléfono y la rama falsa no puede contestar**
(`automatizar/index.html:16-23`). En n8n 2.40 el Webhook responde por defecto «Immediately»; hace
falta «Using 'Respond to Webhook' Node». Reemplazo probado (de `<pre>` a `</pre>` + párrafo):
```html
<pre><span class="c"># lead de formulario</span>
<span class="k">Webhook</span>  POST /webhook/demo-lead
  ↓
<span class="k">IF</span>  phone is not empty
    AND service is not empty
  ├─ true  → <span class="k">Google Sheets</span>
  │          / Append Row
  │          ↓
  │          <span class="k">Telegram</span>
  │          / Send Message
  │          al responsable
  └─ false → <span class="k">Respond to Webhook</span>
             “falta teléfono
              o servicio”</pre><p>Para que la rama falsa le conteste al formulario, en el <code>Webhook</code> elegí <strong>Respond: Using 'Respond to Webhook' Node</strong>. Con el valor por defecto, <em>Immediately</em>, n8n contesta apenas llega el pedido y ese mensaje nunca sale.</p>
```

**C5 · «Los archivos salen primero en la comunidad»: el repo no lo sostiene** (`boveda/index.html:25`,
`:32`; `automatizar:11`; `agentes:6`; `mcp:6`; `index.html:235`). No hay drops desde el 20-sep
(`PUBLICACION.md:72`) y estos recursos no tienen `/archivos`. Salvo que Sergio confirme que los mandó:
- cintas (boveda `:25`, automatizar `:11`, agentes `:6`, mcp `:6`): `<span>¿Dudas con tu caso? Preguntalas en la comunidad</span>`
- boveda `:32`: `<span class="catalogo-note">Ahí podés preguntar con tu caso delante.</span>`
- `index.html:235`: `<strong>¿Buscás algo concreto?</strong> Entrá a la <a href="/boveda">Bóveda</a>: buscá n8n o filtrá por agentes, Claude Code o servidor propio. Si te trabás, en la comunidad podés preguntar con tu caso delante.`

**C6 · «Cada reel, video o carrusel útil termina en un recurso»** (`index.html:148`): hay casos
documentados sin recurso (`PUBLICACION.md:176-183`). →
`<p class="intro">Acá quedan los recursos que prometo en reels, videos y carruseles, para que los puedas volver a abrir. No es una lista de links: cada uno trae el método y lo que no hace.</p>`

**C7 · `/agentes`, modo oscuro: el `IF` de la caja verde no se lee** (contraste 1,16:1,
`agentes/index.html:27`). → cambiar `…un <code>IF</code>, te sirve…` por `…un IF, te sirve…`.

## MENOR (no bloquean)
1. `automatizar:15` → `Ejemplo: tu formulario manda un <code>POST</code> a <code>/webhook/demo-lead</code> de tu n8n.`
2. `agentes:9`: el bloque es un ejemplo, no un JSON Schema → mencionar *Require Specific Output Format* y *Generate From JSON Example*.
3. `mcp:8`: lo que devuelve una herramienta es opcional en MCP; la integración es por aplicación, no por modelo.
4. `mcp:7` → `MCP no es un modelo. Es un protocolo estándar para que una aplicación como Claude Code use herramientas, datos y prompts que publica un servidor, local o remoto, con una interfaz clara.`
5. `agentes:13`: `automatización` → `automatizacion` (valor del pack `SISTEMAS_IA_PACKS_2026-09-22.md`).
6. `boveda:54`: sacar la primera persona → `Seis herramientas para montar tu propio sistema y el orden en que conviene instalarlas.`
7. Etiquetas cruzadas: `boveda:54` (stack) `data-tags="stack n8n whatsapp ubuntu docker claude code hyperframes hermes herramientas"`; `boveda:51` (vps) `data-tags="vps servidor docker ubuntu hostinger chatwoot supabase postiz infraestructura infra"`.
8. `boveda:58` → `Cuando te pido que comentes una palabra, es porque el recurso ya está publicado: te contesto con el link. No te voy a hacer comentar para inflar números ni prometer un archivo que no existe.`
9. Las 4 páginas usan el `og.png` genérico con «SERGIOURCULLO.COM» (dominio sin comprar). Mínimo: `og:image:alt` real en `boveda:13`, `automatizar:7`, `agentes:3`, `mcp:3`.
10. Fechas «25·09·2026» → «actualizado 25·09·2026».
11. `estilo.css:637` y `:642`: `color:var(--faint)` → `var(--muted)` (3,0:1 → 5,8:1; sólo lo usa la Bóveda).
12. `boveda:56` búsqueda vacía → `No hay un recurso con ese tema. Preguntalo en la comunidad con tu caso delante.`
13. `boveda:62` búsqueda sin tildes (probado): `const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();` y usarlo en `apply()` para la consulta y para `card.innerText + card.dataset.tags`.
14. `boveda:39-43`, `:63`: `aria-pressed` en los filtros.
15. Opcional: `pre,code{font-variant-ligatures:none}` (cambia también las guías publicadas).
16. «Flujo exacto» (`index.html:158`, `automatizar:5`) se sostiene sólo con C4.
17. El README del sitio está viejo («deploy por MCP»; es por push) y falta anotar las guías en `ONIA_RECURSOS_UN_RECURSO_TRES_PUERTAS.md`.

## Palabras clave (`PUBLICACION.md` §2)
MAPA → `/automatizar`: sí (ojo: el plan 23–27 usó MAPA también para «Switch o agente» y «Postiz»).
ARQUITECTURA → `/agentes`: sí. MCP → `/mcp`: a medias hasta aplicar C3.

## No verificado
Links externos (403 del proxy: WhatsApp, Instagram, onia.com.bo, YouTube, TikTok, cal.com,
sergiourcullo.vercel.app); que `7412814` sea exactamente lo que está en el aire; envíos a la comunidad;
datos en primera persona («16 años», «6 en producción»); Safari de iPhone.

## Ya en el aire (no lo cambia este deploy)
«Cada día subo un recurso a Onia Community» (mismo problema que C5); handle de TikTok sin resolver;
`og.png` con dominio sin conectar; `/vps` dice «Bs 220 (unos 21 dólares)» y con 11,37 Bs/US$ de
`pricing.ts` son ~US$19; `/homelab/archivos` titula «va a ir apareciendo»; gris de notas 3,0:1.
