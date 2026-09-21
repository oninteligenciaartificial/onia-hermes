# Handoff — carril `web-creator` (configurador de webs + web personal)

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: **2026-09-21**, rama `claude/web-creator-personal-site-eed2f3`, worktree
> `.claude/worktrees/web-creator-personal-site-eed2f3`. Puertos locales: 3011/3320 (sitio Onia),
> 8099 (web personal).
>
> 🔁 **El carril SIGUE EN CODEX desde el 21-sep** (se acabaron los créditos de Claude). Entrada
> para quien llega: **§8**, que es lo único que hace falta leer para empezar a trabajar. El
> resto es historia y evidencia.
>
> **Estado al cerrar, medido el 21-sep:** la rama está **0 ahead / 27 behind** de `origin/main`
> — o sea que **todo lo de este carril ya está en `main`** y no hay nada en vuelo ni sin
> commitear. Producción verificada: `sergiourcullo.vercel.app` 200, `/llamada` → 307 a
> `cal.com/sergiourcullo/20min`, y `onia.com.bo/servicios/webs` sirve las seis ideas.
>
> Nace de la sesión de Codex «Ubica y ajusta llamadas 1:1» (14-sep, id `01a0a1ab…`), que dejó
> el configurador SIN commitear (lo commiteó el auto-sync del 17-sep en la rama
> `claude/ads-creatividades-publicos`, mezclado con 38 archivos ajenos) y la web personal
> editada DIRECTO en el buzón de deploy.

---

## 1 · Objetivo

**El configurador de webs vive en `onia.com.bo/servicios/webs` y la web personal lo enlaza
desde `/webs`, ambos publicados desde el repo canónico.**

Definición de hecho:
1. `onia.com.bo/servicios/webs` responde 200 con el configurador y el mensaje de WhatsApp
   sale con la selección escrita (probado en vivo, mirado).
2. `sergiourcullo.vercel.app/webs` redirige (302, `vercel.json`) al configurador de Onia; la web personal es sólo entrada.
3. `python scripts/publicar-sitio.py --dry` lista lo mismo que sirve Vercel (el buzón sin
   «ahead» ni modificados).
4. `tsc --noEmit` verde en `apps/onia-platform` y la suite del sitio verde en Linux.

⚠️ **Tensión con la etapa vigente**, dicha de frente: `ONIA_ESTRATEGIA_DE_EMPRESA.md` §7 fija
Etapa 1 = Onia Platform + chatbot, y §10 dice que **la web falla el test de las tres
preguntas** (no se entrega sin horas de Sergio Urcullo por cliente). Este carril existe porque
Sergio Urcullo lo pidió el 17-sep y hay un prospecto real (ABDES, vía Codex). No cambia la
etapa: el configurador vende y ordena; no se construye nada de entrega automática.

## 2 · Qué quedó EN PRODUCCIÓN

✅ **Las dos superficies, publicadas el 17-sep ~17:10 La Paz y verificadas por texto exacto:**
- `onia.com.bo/servicios/webs` → configurador con asistente (paso 00), pestañas «Armá tu web» /
  «Más información», cinco alcances (Ecommerce sobre Shopify/Hotmart/Whop incluido), Pro y
  Tienda «Lo vemos en una llamada». BUILD_ID `sDG3TshBsw1rXdpKvgdDF`, ref `f04af0a4`;
  backup previo en `/opt/onia-landing/runtime-next.bak-deploy-20260917210756`.
  Verificado: `curl … | grep -c "Armá tu web en un minuto"` → 1; `"Cuatro stacks"` → 0.
- `sergiourcullo.vercel.app` → home con CTAs al configurador y «Agendar 1 a 1» en la barra;
  `/webs` → **307** a `onia.com.bo/servicios/webs?origen=sergio`. Publicado con
  `publicar-sitio.py` (commit `fdd4f19` del buzón).
- **2º deploy, 17-sep ~22:33 La Paz:** preview con tres ejes (alcance / vibe / objetivo) y pasos
  reordenados. Run `35299301003` (89/89 archivos de test en Linux), stage
  `runtime-next.new-20260918023044`, backup `runtime-next.bak-deploy-20260918023314`.
  Verificado por texto: «La vibe: cómo se siente», «¿Cuánta web?», «Pago con tarjeta, seguro».
- **3er deploy, 17-sep ~22:42 La Paz:** burbuja de WhatsApp legible en Impacto. Run `35299917788`
  (89/89), stage `runtime-next.new-20260918023915`, backup `runtime-next.bak-deploy-20260918024157`.
- **4º deploy, 18-sep ~16:17 La Paz — las seis ideas de la competencia** (Sergio Urcullo:
  «copiá las ideas que viste»): frase de entrada que elige rubro y ciudad, titular «Ves tu web
  antes de dejar un solo dato», brief «Entendí: …» con «Corregir», diferencial del alcance
  nombrado en el paso 03, «¿Ya tenés web? Pegá el link» (viaja como «Web actual:» y el puente lo
  vuelve referencia del intake), «Pago único: la web es tuya» en «Más información». Commit
  `302586f1` + merge `0edd8b83` (trae 13 commits de otros carriles, ninguno toca el
  configurador). Run `35389946389` (95/95 en Linux), stage `runtime-next.new-20260918201403`,
  BUILD_ID `dnyLOPPyKA0mSd3yVy3yK`, backup `runtime-next.bak-deploy-20260918201708`. Verificado
  en prod por texto exacto (los seis, más el BUILD_ID en el HTML) y con Playwright a 1440 y 390:
  la frase selecciona el chip, el brief aparece y «Corregir» lo saca, «Web actual» llega al
  mensaje, la pestaña muestra el pago único, 0 errores de consola. La web personal se publicó con
  `publicar-sitio.py` y sirve el mismo titular en el teaser (mirado a 390 y 1440).
- **5º entrega, 18-sep ~20:10 La Paz — la llamada 1 a 1** (Sergio Urcullo: «quiero publicar la
  nueva función de llamada a mis historias»). Antes de publicar se midió el destino: el botón
  apuntaba a `cal.com/sergiourcullo/30min`, que devuelve **404**. El evento vivo es `/20min`
  («Llamada 1 a 1», 20 minutos, Google Meet). Estaba roto en **7 enlaces de 5 páginas** y la
  tarjeta anunciaba 30 minutos. Arreglado (commit `9fc910a2`), publicado con `publicar-sitio.py`
  y verificado APRETANDO el botón en prod a 390px: cae en el calendario reservable. La tabla de
  horarios no se tocó: medida contra cal.com con timezone La Paz, coincide exacto (sáb 10:00-17:00
  con 21 cupos, lun-vie 14:00-16:00 y 19:00-22:00 con 15, domingo cerrado).
  Piezas: 3 historias 9:16 en `hermes-content/carousels/out/historias-llamada/`, generador
  `scripts/marca-personal/generar-historia-llamada.py`, gate de banda segura en verde.
  **Falta sólo el paso de Sergio Urcullo**: subirlas y pegar el sticker de link a
  `cal.com/sergiourcullo/20min` (el sticker no se puede poner por API).
- `main` sigue a la rama por fast-forward (último: `0edd8b83`).

**Receta que FUNCIONÓ para publicar la landing (la primera vez que el workflow da verde
desde el 1-sep):**
1. `gh workflow run deploy-onia-center.yml --ref <rama> -f swap=false` → builda en Ubuntu,
   corre `tsc` + la suite (prebuild) en Linux, y deja el runtime en stage en el VPS.
   Es el gate de Linux que no se puede correr en Windows.
2. Con el run verde: FF de `main` a ese commit.
3. `scp` de `hermes-content/deploy/onia-landing/swap-and-verify.sh` al VPS + `sed` CRLF, y
   `bash /opt/onia-landing/_deploy/swap-and-verify.sh /opt/onia-landing/runtime-next.new-<TS>`
   (la ruta sale del log del run: `STAGED_ONLY=`). Backup + restart + healthcheck + rollback.
4. Verificar por TEXTO exacto del cambio, nunca por 200.

## 3 · Qué quedó a medias (histórico del 17-sep; al 21-sep NO queda nada a medias — el
auto-sync lo pushea)

| Qué | Dónde | Estado |
|---|---|---|
| **Configurador integrado en la página v3** | `apps/onia-platform/src/app/(sitio)/servicios/webs/page.tsx` | `<WebConfigurator />` reemplaza a `<PedirWeb />`. **Decidido 17-sep**: la página muestra SOLO el configurador; las tarjetas «Los stacks» + Cuidado Web pasaron a la pestaña **«Más información»** (`Especificaciones.tsx`, prop `especificaciones`; panel siempre en el HTML servido, oculto con `hidden`). Móvil: 12.172 px (antes 17.878) |
| Los 5 archivos del configurador + `web-configurator.ts` + `web-intake.ts` | `src/components/web-configurator/`, `src/content/` | traídos del commit `91c1d9fc` SOLO esos (no los 38 ajenos). `tsc` verde salvo `vitest.config.ts` (entorno) |
| `webs.ts` | `src/content/webs.ts` | **restaurado a `main`** (Codex venía de una rama vieja con 790/1.500/2.900); se le re-agregó `WEB_ADDONS` (CRM/n8n Bs 790, catálogo §4) |
| `requisitos-gate.tsx` | `src/components/` | versión de Codex: props `ready/blockedHint/blockedTargetId`, compatibles hacia atrás |
| `PedirWeb.tsx` + `webs.module.css` | `(sitio)/servicios/webs/` | **muertos** (nadie los importa) pero 9 tests los nombran por ruta; no se borraron |
| **Web personal portada al repo** | `hermes-content/sitio-sergiourcullo/**` | `abcbb7f` (catálogo `/webs`, sin pushear) + diff sin commitear de Codex (CTAs en hero, «Agendar 1 a 1» en la barra, cifras como franja, links al configurador, swipe horizontal en móvil). Renderizada y MIRADA a 390 y 1440, sin desborde |
| **Asistente (paso 00)** — cuestionario nombre · rubro · objetivo · sentir · color → arma toda la selección y salta al preview | `src/content/web-assistant.ts` (reglas puras, 5 rubros del alta + ecommerce + otro; restaurante/construcción/educación/salud salieron por `rubros-del-alta.test.ts`) · `src/components/web-configurator/WebAssistant.tsx` · CSS al pie del módulo · `web-assistant.test.ts` (4 casos) | **Recorrido con Playwright a 390 y 1440**: «Clínica Amanecer» + Clínica dental + Premium → Portada editorial · Editorial, titular del rubro, CTA «Reservar un turno», 0 errores de consola. Son REGLAS, no un modelo (costo de API cero); un LLM entraría después sólo para copy |
| **Preview con tres ejes reales** (Sergio Urcullo, 17-sep: «la vibe sólo cambia las imágenes; el pricing debería verse más noob, más pro y más mejor; ordenalo bien») | `WebsitePreview.tsx` + `website-preview.module.css` reescritos; `WebConfigurator.tsx` reordenado | **Alcance** = cuánta web (landing: una pantalla sin menú · profesional: menú, servicios, confianza, proceso, FAQ, contacto · pro: + foto en tarjetas, «sobre nosotros», galería, lugar para testimonio, pie completo · tienda: categorías + grilla + pedido por WhatsApp · ecommerce: + carrito, «Ingresar», pago con tarjeta/envío/suscripciones, sello Shopify·Hotmart·Whop). **Vibe** = `data-direction` → aire, radios, peso y caja del titular, tarjetas, botones, fondos (Impacto en mayúsculas con bloques de tinta; Cercano redondeado y cálido; Editorial con reglas y kickers en itálica; Empresarial con tarjetas y superficies). Elegir una vibe fija su estructura por defecto. **Objetivo** = bloque de acción (agenda / WhatsApp / formulario / opciones). Orden nuevo: 01 datos · 02 objetivo · 03 alcance · 04 vibe · 05 estructura · 06 colores · 07 tipografía · 08 enviar. Sin cifras ni testimonios inventados (los lugares dicen «acá va…», «Tu producto 04», «Precio a confirmar»). Matriz de 15 capturas a 1440 + 4 combos a 390: 0 errores, 0 desborde. Trampa: el sprite de fotos es de celdas cuadradas; un tile ancho necesita `300% auto` o muestra dos fotos pegadas |
| **Precios aplicados (decisión 17-sep), EN PROD** | `webs.ts`: Landing 2.000 · Profesional 4.500 con precio; **Pro → `precio: null`**, `precioWeb()` dice «Lo vemos en una llamada»; configurador y WhatsApp piden la llamada cuando no hay precio. `sitio-sergiourcullo/webs/index.html` alineado (2.000 / 4.500 / «En una llamada» ×2). Doc: `ONIA_WEB_COMO_SE_VENDE.md` §8 | hecho, sin publicar |
| **Catálogo estático `/webs` de la web personal: ELIMINADO** (Sergio Urcullo, 17-sep: «esa UI habíamos quedado que no; la función es para onia.com.bo»). `/webs` → redirect a `onia.com.bo/servicios/webs?origen=sergio`; barra, hero y teaser de la home apuntan directo al configurador | `sitio-sergiourcullo/{vercel.json,index.html,*/index.html}` | hecho |
| **Quinto alcance: Ecommerce sobre Shopify / Hotmart / Whop** (pedido 17-sep) | `webs.ts` (entrada `ecommerce`, `precio: null`) · `isWebStackId` · `SCOPE_COPY` · rubro `ecommerce` en el asistente (fuerza alcance ecommerce aunque el objetivo sea catálogo) · tarjeta en `sitio-sergiourcullo/webs/` (grilla 2+3) · copy «Cinco stacks / Cinco paquetes» · doc §8 | hecho, mirado a 1440 en las dos superficies; test unitario agregado |
| `PRODUCT.md` + `web-layout-examples.png` (2,5 MB) | `apps/onia-platform/` | de Codex; el PNG lo usa `website-preview.module.css` |

Capturas de esta sesión: scratchpad `…/4efc96b0…/scratchpad/{personal,onia}/*.png`.

## 3b · Revisión funcional en producción (17-sep, después del deploy)

**Recorrido con Playwright sobre `onia.com.bo/servicios/webs?origen=sergio`, a 1440 y 390:**
asistente → «Clínica Amanecer» + dental + reservas → preview armado → botón bloqueado
(`aria-disabled`, `href=#datos-solicitud`) hasta completar nombre + WhatsApp y aceptar
requisitos → `wa.me/59175414930` con el mensaje completo (datos, alcance, Bs 4.500, 50/50,
diseño, requisitos). 0 errores de consola. **Funciona.** Corregido el punto doble de la oferta.

**Cómo se conecta HOY con Onia Platform: NO se conecta.** El único circuito vivo es
WhatsApp → inbox de Chatwoot del bot de Onia. Nada se guarda en la plataforma ni en n8n.
- Medido con `step()` de `bot-engine.mjs` (la misma función de producción, config del bench): el
  mensaje «Hola, vengo del configurador de webs…» se enruta como **`pregunta_precio`** y el bot
  contesta el pitch del chatbot («esto que estás viendo es justo lo que vendemos…») + oferta de
  demo + «el número exacto te lo pasa Sergio en la demo». **Ni una palabra sobre la web.**
  Califica `industry: dental` y lo mete en el embudo de la plataforma.
- No existe intent de «lead de web» en `intents.mjs`, ni FAQ en `knowledge`, ni workflow n8n
  `web-lead`, ni endpoint `/api/n8n/web-leads` en el producto (el blueprint está en
  `web-factory/docs/CONEXION_WEB_SISTEMA_API.md`). Lo más cercano en la plataforma es
  `AccessRequest` (`access_requests`: name, businessName, verticalTrackId, whatsapp, email,
  city, src) — un lead de web podría entrar ahí con `src=configurador-web`, pero
  `verticalTrackId` es enum de rubros activos (ecommerce/otro no mapean).

**✅ Cómo se DESARROLLA una web a partir del pedido (hecho 17-sep, «¿y vos cómo desarrollarías
una?»):** `pnpm from-configurador <mensaje.txt> --build` en `web-factory/`. Parsea el mensaje
del configurador (formato nuestro), escribe `data/intakes/<slug>.intake.json`, corre el mismo
`factory:build` de cualquier cliente y deja `out/<slug>/`. Probado con el mensaje REAL del
recorrido de producción → `out/clinica-amanecer/` (template `landing-clinic`, paleta azul
elegida, CTA «Reservar un turno» → `wa.me/59170000000`), mirado a 1440. Test
`generate/from-configurador.test.ts` (5 casos, incluye validar el intake contra el schema del
motor). Los pendientes que imprime (fotos, dominio, una frase por servicio) son el checklist
que se le pide al cliente. Demo commiteada en `data/{intakes,clients}/clinica-amanecer.*`.

**Del carrusel «Stop AI slop» (17-sep, IG `p/DdXM8-Nmxey`):** instaladas `humanizer` y `stop-slop`
(MIT, globales); el motor ahora escribe `data/clients/<slug>.DESIGN.md` (formato Stitch/VoltAgent,
contraste WCAG medido) en cada `factory:build`; `generate/slop.test.ts` = gate en español para el
copy generado (hoy 0 hallazgos). Inventario completo en `web-factory/DESIGN_STACK.md`.

**Competencia mirada (17-sep, con el navegador):** Durable, Hostinger AI, Wix AI, 10Web, Squarespace.
Informe y tabla en `hermes-content/research/competencia/configuradores-web-ia-2026-09-17.md`.
Lo que pesa: todos arrancan con UNA frase (no un formulario); todos esconden el resultado detrás
de crear cuenta (nosotros no, y no lo decimos); nadie cambia la web según el plan (nuestro alcance
es único); Wix muestra «el brief» antes de personalizar; 10Web arranca desde una URL. Seis cambios
propuestos con costo, ninguno hecho (esperan decisión).

**Reel «Arma tu stack de galerías» (18-sep, IG `reel/DdZZmsQtr2-`):** cinco sitios leídos de los
frames (Watermelon UI, deck.gallery, Swishy.ai, Replit, motion.dev). Cruce contra las 28 fuentes de
`gallery-reference-sources.json`: dos ya estaban (Watermelon, motion.dev como librería), dos entran
a la cosecha (`deck-gallery` para tipografía/jerarquía de propuestas y OG; `motion-dev-examples`,
450+ snippets), dos no son galerías (Swishy = motion por IA, diferida; Replit = builder, descartada).
Tabla en `web-factory/DESIGN_STACK.md` y §8 de `web-factory/SOURCES.md`; fichas en
`data/references/design-sources/{motion-y-3d,herramientas-builders,inspiracion-landings}.md`.

**Qué falta para que sea un circuito, en orden de valor/costo:**
1. 🔴 **Bot: intent `lead_web`** (carril chatbot, ~30 líneas + test + `deploy-bot.sh`): si el
   texto empieza con «vengo del configurador de webs» → confirmar recepción nombrando el
   negocio y el alcance, avisar que Sergio Urcullo escribe en <N> horas, **handoff a humano** y
   etiqueta `web` en Chatwoot. Sin esto, cada lead de web recibe una demo de otro producto.
2. 🟡 **Registro del pedido antes de abrir WhatsApp**: `POST /api/web-intake` (server-side,
   best-effort, sin bloquear) → hoy no hay tabla; o reusar `access_requests` con `src`. Da
   trazabilidad aunque el lead no mande el WhatsApp.
3. 🟡 **Link compartible del preview** (`?nombre=&rubro=&estilo=…`): Sergio le manda a un
   prospecto (ABDES) «mirá cómo quedaría tu web» ya armado. Barato: los params `estilo`,
   `estructura`, `paquete` ya existen; faltan nombre/rubro.
4. 🟡 Fotos del preview por rubro (hoy por dirección visual).
5. 🟢 Copy con modelo de lenguaje (titular/bajada desde las respuestas): costo de API, decisión
   de Sergio Urcullo; el asistente hoy es reglas, costo cero.
6. 🟢 Barrido del embudo (`followup-run`) también para leads de web.

## 4 · Archivos que toca este carril

```
web-factory/apps/onia-platform/src/app/(sitio)/servicios/webs/**
web-factory/apps/onia-platform/src/components/web-configurator/**
web-factory/apps/onia-platform/src/components/requisitos-gate.tsx
web-factory/apps/onia-platform/src/content/{webs,web-configurator,web-intake}.ts
web-factory/apps/onia-platform/PRODUCT.md · public/web-layout-examples.png
web-factory/docs/WEB_CONFIGURATOR_SALES_FLOW_2026.md
hermes-content/sitio-sergiourcullo/**          (+ scripts/publicar-sitio.py, sin cambios)
```

## 5 · Intentos fallidos y trampas (no repetir)

- **`git checkout <commit> -- src/app/servicios/webs/page.tsx` creó una ruta DUPLICADA**:
  `main` ya movió el sitio al grupo `(sitio)/` y Codex trabajó en la ruta vieja. Next se
  rompe con dos `page.tsx` para `/servicios/webs`. Y al borrar `src/app/servicios` de un
  `rm -rf` me llevé `consultoria` y `marketing-ia` (vivas en prod) — restauradas de `HEAD`.
- **El checkout pisó `webs.ts` de `main` con precios vencidos.** Un archivo compartido que
  Codex tocó desde una rama vieja NO se trae entero: se aplica su diff (`git diff c^ c -- f`)
  sobre `main`.
- **La suite del sitio no corre en Windows**: arma rutas `C:\C:\…`, espera
  `node_modules/.bin/vitest` con barras, y 9 archivos dan `SyntaxError`. Correr en WSL/VPS.
- **`pnpm install --offline --filter ./apps/onia-platform` en el worktree escribe a través de
  la unión** `apps/onia-platform/node_modules → checkout principal`. Salió bien (agregó
  `vitest` que faltaba), pero es un efecto sobre OTRO árbol.
- **Playwright desde Git Bash**: el argumento `/` se convierte en `C:/Program Files/Git/`.
  `MSYS_NO_PATHCONV=1`.
- Codex reportó «Validación 18/20» y «build 22/22 rutas» sobre la rama VIEJA; nada de eso
  vale para `main`.
- **El runner de GitHub se quedó sin disco dos veces el 18-sep** (runs `35387801812` y
  `35388443587`, «No space left on device» al llegar al segundo build, sin log del job). No era
  el código: `.git` pesa **11 GB** (videos, capturas, renders) y el `fetch-depth: 0` que se puso
  el 17-sep para `deploy-vivo.test.ts` lo baja entero. Arreglo: `filter: blob:none` en el
  checkout (commit `652358d1`): todos los commits y árboles, blobs sólo del HEAD; el gate sigue
  contestando y la corrida siguiente salió verde en 6 min. Si vuelve a pasar, lo siguiente es
  `df -h` como primer paso del job.
- **`main` se movió DOS veces mientras corría el CI** (13 commits y luego 2). El build de stage
  es del commit que se disparó, no del `main` de después: se mergeó `origin/main`, se rebuildeó
  y se promovió ESE build, así prod quedó igual a `main`. Antes de promover: `git rev-list
  --count HEAD..origin/main` y `git diff --name-only HEAD...origin/main` (tres puntos; con dos
  puntos el diff lista tus propios archivos y asusta al pedo).
- **Vitest SÍ corre en Windows si se lo llama directo** (`npx vitest run <archivos>` dentro de
  `apps/onia-platform`, con `MSYS_NO_PATHCONV=1`): los tests unitarios y los gates de copy dan
  verde local. Lo que no corre acá son los `scripts/*-vivo` y los que recorren `src/` con rutas
  POSIX (20 archivos en rojo por `\` vs `/`), o sea que **la suite entera sigue siendo del CI**.
- **El gate `rubros-del-alta` lee las PALABRAS del código, no sólo los chips**: «farmacia» en
  una regex de palabras clave del asistente lo puso en rojo. Los rubros ajenos (veterinaria,
  farmacia, restaurante, hotel, gimnasio, inmobiliaria) no pueden aparecer ni como sinónimo.
- **Ver un reel de IG desde esta sesión (18-sep)**: `fetch-video.mjs` bajó el MP4 (desde el
  checkout principal, donde vive la sesión de IG), pero `gemini-see-video.mjs`, el caption y
  `transcribe.sh` (Speaches por SSH) fallaron con `fetch failed`; `text-frames.mjs` no existe.
  Lo que sirvió: `ffmpeg -vf "fps=1,scale=720:-1"` y leer los frames con el Read tool (los
  subtítulos quemados alcanzan). Además, el shell de esta sesión **mangla los escapes de barra**
  (`\r\n` en un `node -e` llegó como saltos de línea reales): los scripts se escriben con el
  Write tool y el CR/LF se arma con `String.fromCharCode`. Los .md y .json del stack son CRLF.

## 5b · ¿Ya se pueden VENDER las webs? (auditoría 18-sep, motor corrido de verdad)

**No todavía, y lo que traba no es el generador.** El motor anda: `from-configurador.ts
<mensaje.txt> --build` sale exit 0 y produce el sitio en segundos (HTML estático, una página,
4 archivos). El configurador está vivo en prod con los precios publicados.

| Tramo | Estado |
|---|---|
| Configurador en producción | **VIVO** (200, 104 KB, 0,98 s) |
| Mensaje de WhatsApp → intake | **VIVO** (corrido, exit 0, template `landing-clinic`) |
| Intake → sitio generado | **VIVO**, HTML estático de una página |
| Sitio generado → **publicado** | 🔴 **NO EXISTE**: el único consumidor de `out/<slug>` es un server que se declara «Not for production» (`web-factory/scripts/serve-out.mjs:2`); `deploy-web-cliente.sh` sólo acepta dos apps Next escritas a mano |
| Cobro | VIVO pero manual (50/50 escrito en el mensaje; sin checkout). Factura: no medido |
| Contenido del cliente | PARCIAL: el mensaje trae sólo el NOMBRE de cada servicio; beneficios, proceso, FAQs y productos quedan vacíos |

**Configurabilidad: 28.800 combinaciones en el preview, 480 salidas distintas. 1,7%.**
Llegan al entregable paleta, color, tipografía y objetivo. **Dirección y estructura NO**
(mueren en `from-configurador.ts:209`): Minimalista/Esencial e Impacto/Gran impacto dan
archivos byte-idénticos. **Landing, Profesional y Pro dan el MISMO archivo** para un rubro que
no sea clínica. El motor tiene 7 plantillas; el configurador alcanza 3.

**Los tres huecos, en orden de lo que cuesta no tenerlos:**
1. **Publicar.** Es lo único entre «generado» y «vendido». nginx + el vhost de traefik que el
   script ya imprime, o Cloudflare Pages. Media jornada.
2. **La tienda sale con copy de otra marca**: `packages/templates/src/store.ts:81` hardcodea
   `<h1>SKINCARE SIMPLE PARA COMPRAR MEJOR</h1>` en toda tienda generada, y el puente manda
   `products: []` → 0 productos. Un par de horas.
3. **Dirección y estructura son decorado**: 12 opciones que el cliente elige y no llegan al
   entregable. Mapearlas cuesta un día; sacarlas del configurador, una hora.

## 6 · Qué depende de Sergio Urcullo

| | Bloquea |
|---|---|
| ✅ ~~Precio de las webs~~ **Decidido 17-sep**: básicos con precio (Landing 2.000, Profesional 4.500), Pro y Tienda en una llamada. Aplicado en código y doc. | — |
| 🟡 **Mirar el asistente** (`localhost:3011/servicios/webs`, o las capturas `flow/asistente-*.png`) y decir si los rubros y sus defaults (dirección, paleta, titular) son los que querés. Las fotos del preview son por dirección visual, no por rubro: una dental «premium» sale con foto de boutique. | pulir antes de publicar |
| ✅ ~~Tarjetas + configurador o sólo configurador~~ **Decidido 17-sep: sólo configurador; las especificaciones en la pestaña «Más información».** Hecho. | — |
| 🟡 La propuesta de Codex «Página Base Conectada» incluida en planes ANUALES (Profesional/Completo) — es una decisión de packaging; no se implementó. | nada hoy |
| 🟡 Confirmar que `WA_PHONE` de `src/lib/site.ts` es el WhatsApp comercial definitivo. | el envío real |

## 7 · Próximos pasos, ordenados por lo que cuesta NO tenerlos

Hecho y en producción: precio · tarjetas vs configurador · suite en Linux · deploy · web
personal · las seis ideas de la competencia · la llamada 1 a 1. Queda esto:

| # | Qué | Por qué está acá arriba | Costo |
|---|---|---|---|
| **1** | **Publicar lo que el motor genera** (§5b hueco 1) | 🔴 **El configurador YA vende con precios publicados y no hay cómo entregar.** Si entra un pedido real, el sitio se genera y muere en `out/<slug>`: su único consumidor se declara «Not for production». Es el único tramo que separa «generado» de «vendido» | media jornada |
| **2** | **La tienda sale con el titular de otra marca** (§5b hueco 2) | 🔴 `packages/templates/src/store.ts:81` hardcodea `<h1>SKINCARE SIMPLE PARA COMPRAR MEJOR</h1>` en TODA tienda generada, y el puente manda `products: []` → 0 productos. Entregar eso a un cliente es peor que no entregar | 2 h |
| **3** | **Decidir qué pasa con dirección y estructura** (§5b hueco 3) | 🟡 12 opciones que el cliente elige y **no llegan al entregable**: minimalista e impacto dan archivos byte-idénticos. Hoy el configurador promete una elección que no existe. **Es una decisión de Sergio Urcullo**: mapearlas (1 día) o sacarlas del configurador (1 h) | 1 h ó 1 día |
| **4** | **Intent `lead_web` en el bot** | 🟡 El pedido del configurador llega a WhatsApp y el bot responde con el pitch del chatbot, no con el de la web. **Es del carril chatbot, que tiene dueño activo: coordinar, NO tocar desde acá** | del otro carril |
| **5** | Registrar el pedido en la plataforma antes de abrir WhatsApp (server-side) | Desbloquea el link compartible del preview y el prellenado desde «Web actual» con `scripts/alta-por-extraccion.py`. Hoy el link viaja en el mensaje y lo corre una persona | 1 día |
| **6** | Fotos del preview por rubro (hoy por dirección visual) | Una dental «premium» sale con foto de boutique. Regla: la interfaz nunca la dibuja la IA; la foto de contexto sí puede | 3 h |
| **7** | Borrar `PedirWeb.tsx` + `webs.module.css` | Muertos: nadie los importa. Bloqueado porque 9 tests los nombran por ruta | 1 h |

⚠️ **Lo de arriba sirve al carril, no necesariamente a la etapa vigente.** `ONIA_ESTRATEGIA_DE_EMPRESA.md`
§10 dice que la web **falla el test de las tres preguntas** (no se entrega sin horas de Sergio
Urcullo por cliente). Si hay que elegir entre esto y mover Onia Platform + chatbot, gana el
producto. Este carril existe porque hay un prospecto real y el configurador ya está publicado.

## 8 · Para quien sigue en Codex — EMPEZAR ACÁ

**El carril en una frase:** el configurador de webs vive en `onia.com.bo/servicios/webs`, vende
con precios publicados, y la web personal de Sergio Urcullo lo enlaza. Lo que **no** existe es
la entrega: ver §5b.

### Dónde y cómo entrar

```bash
cd C:/dev/proyectos/onia-hermes/.claude/worktrees/web-creator-personal-site-eed2f3
git branch --show-current          # claude/web-creator-personal-site-eed2f3
git fetch origin && git merge --no-edit origin/main   # al 21-sep estaba 27 behind
```

Todo lo del carril ya está en `main`. **No hay nada a medias.** Si algo no compila, vino de otro
carril, no de acá.

### Los comandos que FUNCIONAN (probados, no copiados de un README)

```bash
# tipos del sitio de venta
cd web-factory/apps/onia-platform && npx tsc --noEmit -p tsconfig.json

# tests: en Windows corren SOLO llamando a vitest directo, y sólo los unitarios
MSYS_NO_PATHCONV=1 npx vitest run src/content/web-assistant.test.ts

# el sitio local, para mirarlo
pnpm --dir web-factory/apps/onia-platform dev --port 3320

# mensaje de WhatsApp del configurador -> intake -> sitio generado
cd web-factory && npx tsx generate/from-configurador.ts <mensaje.txt> --build

# publicar la web personal (canónico -> buzón -> Vercel)
python scripts/publicar-sitio.py -m "mensaje"
```

**Deploy de `onia.com.bo` (la receta que funciona, §2):** `gh workflow run
deploy-onia-center.yml --ref <rama> -f swap=false` → con el run verde, FF de `main` → `ssh` y
`bash /opt/onia-landing/_deploy/swap-and-verify.sh /opt/onia-landing/runtime-next.new-<TS>`
(el TS sale del log, línea `STAGED_ONLY=`). Verificar por TEXTO exacto, nunca por 200.

### Las cinco trampas que ya se pagaron acá

1. **La suite completa NO corre en Windows**: 20 archivos en rojo por rutas POSIX (`\` vs `/`).
   Los unitarios sí, llamando a `npx vitest run <archivo>`. La suite entera es del CI.
2. **`main` se mueve DEBAJO tuyo**: entraron 28 commits en un día y 27 en dos. Antes de
   promover un build: `git rev-list --count HEAD..origin/main` y
   `git diff --name-only HEAD...origin/main` (TRES puntos; con dos lista tus propios archivos).
3. **El runner de GitHub se quedó sin disco dos veces**: `.git` pesa 11 GB. Ya está el
   `filter: blob:none` en el checkout; si vuelve, `df -h` como primer paso del job.
4. **Un CTA se verifica APRETÁNDOLO.** El botón de la llamada tenía el `href` bien escrito y
   apuntaba a un 404 durante días. Ahora la web enlaza `/llamada`, un redirect propio en
   `sitio-sergiourcullo/vercel.json`: **si el evento de cal.com cambia, se edita UNA línea**.
5. **El gate `rubros-del-alta` lee las PALABRAS del código**, no sólo los chips: «farmacia» en
   una regex de sinónimos lo puso en rojo. Los rubros ajenos (veterinaria, farmacia,
   restaurante, hotel, gimnasio, inmobiliaria) no pueden aparecer ni como sinónimo.

### Qué NO tocar desde este carril

- El **bot / chatbot** (tiene dueño activo). El `lead_web` del paso 4 se coordina, no se toca.
- Los **4 archivos raíz de `web-factory`** sin avisar (`COORDINATION_MANIFEST.md`).
- El **buzón de deploy** `C:/dev/proyectos/sergiourcullo-deploy`: **no es fuente**, el script de
  publicación lo sobrescribe. Editar siempre `hermes-content/sitio-sergiourcullo/`.

### Lo que está esperando a Sergio Urcullo (§6 + lo nuevo)

- **Subir las 3 historias** de `hermes-content/carousels/out/historias-llamada/` y pegarles el
  sticker de link a `sergiourcullo.vercel.app/llamada` (sólo la tercera lo lleva).
- **Revisar el 2º enlace de su bio de Instagram**: no se ve sin login y es el último candidato a
  «el enlace que no funciona» del 19-sep. Que apunte a `sergiourcullo.vercel.app/llamada`.
- **Decidir el punto 3** de §7 (dirección y estructura: mapearlas o sacarlas).
- Mirar el asistente y aprobar rubros y defaults · confirmar `WA_PHONE` de `src/lib/site.ts` ·
  pasar el link del video para `/vps`.
