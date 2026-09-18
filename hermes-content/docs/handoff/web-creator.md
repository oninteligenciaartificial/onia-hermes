# Handoff — carril `web-creator` (configurador de webs + web personal)

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: **2026-09-17 (2ª pasada, con el asistente)**, rama `claude/web-creator-personal-site-eed2f3`, worktree
> `.claude/worktrees/web-creator-personal-site-eed2f3`. Puertos locales: 3011 (sitio Onia),
> 8099 (web personal).
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
- `main` = `05b67ad1` (fast-forward a la rama después de mergear el commit ajeno que entró).

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

## 3 · Qué quedó a medias, y dónde (todo en esta rama, SIN pushear al cerrar el turno — el
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

## 6 · Qué depende de Sergio Urcullo

| | Bloquea |
|---|---|
| ✅ ~~Precio de las webs~~ **Decidido 17-sep**: básicos con precio (Landing 2.000, Profesional 4.500), Pro y Tienda en una llamada. Aplicado en código y doc. | — |
| 🟡 **Mirar el asistente** (`localhost:3011/servicios/webs`, o las capturas `flow/asistente-*.png`) y decir si los rubros y sus defaults (dirección, paleta, titular) son los que querés. Las fotos del preview son por dirección visual, no por rubro: una dental «premium» sale con foto de boutique. | pulir antes de publicar |
| ✅ ~~Tarjetas + configurador o sólo configurador~~ **Decidido 17-sep: sólo configurador; las especificaciones en la pestaña «Más información».** Hecho. | — |
| 🟡 La propuesta de Codex «Página Base Conectada» incluida en planes ANUALES (Profesional/Completo) — es una decisión de packaging; no se implementó. | nada hoy |
| 🟡 Confirmar que `WA_PHONE` de `src/lib/site.ts` es el WhatsApp comercial definitivo. | el envío real |

## 7 · Próximos pasos (en orden)

1. ~~Precio~~ hecho. Fotos del preview por rubro (hoy por dirección) si Sergio Urcullo lo pide.
2. ~~Tarjetas vs sólo configurador~~ hecho (pestaña «Más información»). Quitar los bloques `stacks` y
   `cuidado` de la página y ajustar los tests que los miran.
3. Correr la suite en Linux. **El 17-sep no se pudo**: WSL Ubuntu no tiene Node, Docker
   Desktop estaba apagado. Con Docker encendido:
   `docker run --rm -v "<ruta al worktree>/web-factory/apps/onia-platform:/app" -w /app node:22-alpine node node_modules/vitest/vitest.mjs run`.
   Las opciones «Básico, Bs 190/mes» que Codex tipeó en `WebConfigurator.tsx` ya se derivan
   de `CUIDADO_WEB` (17-sep); igual mirar `precios*.test.ts` y `montos-en-pantalla`.
4. Merge a `main` (gates verdes) → deploy VPS `scripts/deploy-onia-landing.sh` → MIRAR
   `onia.com.bo/servicios/webs`.
5. `python scripts/publicar-sitio.py -m "..."` → MIRAR `sergiourcullo.vercel.app/webs`.
6. Borrar `PedirWeb.tsx` + `webs.module.css` cuando los tests dejen de nombrarlos.
