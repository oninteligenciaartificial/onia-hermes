# Handoff — carril `claude/git-status-935f47` (la web de venta)

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: 2026-08-23.


---

# SEGUNDO OBJETIVO de la sesión (2026-08-23, tarde) — el producto a `main` y a producción

> Cambio de objetivo pedido explícitamente por Sergio: *"deja el producto en main, ya es
> vendible? que funciones tenemos y que funciones le arreglamos a una empresa… y ya
> dejemos en produccion."*

**Qué quedó EN PRODUCCIÓN (de este objetivo)**

🔴 **NADA nuevo desplegado, y esta vez no fue una decisión: está BLOQUEADO por infra.**
El código sí quedó en `master` de `onia-platform` (`8dc76c1`, pusheado, `0 0` contra
`origin`). Pero el deploy no se puede ejecutar — ver abajo.

**Gates corridos por mí, no heredados del subagente**

| Gate | Resultado |
|---|---|
| `tsc --noEmit` | exit 0 |
| Suite | 1991 passed, 5 skipped, 154 archivos, exit 0 |
| `next build` | exit 0 (con `ENCRYPTION_KEY`; ver intentos fallidos) |
| Marcadores de conflicto | cero |

## 🔴 El VPS está siendo estrangulado por el proveedor

Medido, no supuesto:

- **4 vCPU, load average 110-120** sostenido.
- **`st` = 93-96%** en `vmstat`. El hipervisor se queda con ~95% del CPU; la VM recibe ~5%.
- TTFB de producción: `app.onia.com.bo/login` **6,3-9,3 s**; `onia.com.bo` **3,0-4,1 s**.
  El objetivo de LCP es 2,5 s — acá el *primer byte* tarda más del triple.
- **`docker` NO RESPONDE.** `docker ps` colgado en 4 intentos (60 s, 90 s, 240 s, 280 s),
  cero salida. **Sin `docker`, no hay deploy ni swap posible.** Los contenedores siguen
  corriendo (las webs responden), pero el daemon no atiende.

**Lo que sí arreglé:** un `llama-server` (modelo `qwen2.5:3b` de Hermes, en CPU) llevaba
**7h39m colgado quemando un núcleo entero**, con su único cliente —Hermes, pid 926— al
0,6% de CPU. No respondía al `keep_alive:0` de la API de ollama ni a SIGTERM. SIGKILL
liberó **2,1 GB** (memoria usada 10 Gi → 8,9 Gi) y bajó el login de 9,3 s a 5,4 s.
`ollama serve` sigue vivo y lo respawnea en la próxima llamada de Hermes.

**Ganó 2 segundos y ahí se acabó lo que se puede hacer desde adentro:** el steal siguió en
95% DESPUÉS de liberar ese núcleo y esa memoria. La causa no es nuestra carga.

## Verificado en producción (cierra el punto que la auditoría no pudo)

`/opt/onia-platform/app.env`:

- `PLATFORM_LAYER=1` ✅ y `AGENTS_RUNTIME=1` ✅ — el peor escenario que planteaba la
  auditoría (capa multi-rubro apagada ⇒ todos los rubros viendo el menú dental ⇒ la capa
  entera valiendo cero) **NO ocurre**.
- `SIAT_EMISSION` ausente ⇒ el emisor fiscal es mock. Confirma el catálogo.
- Hay dos `app.env`: `/opt/onia-landing/app.env` y `/opt/onia-platform/app.env`.

## 🔴 Intentos FALLIDOS (el campo que nadie escribe)

1. **Creí que el build estaba roto por la rama.** Falló con
   `ENCRYPTION_KEY env var is required`. NO era la rama: `lib/encryption` ni figura en el
   diff. Rebuildeando con una clave dummy pasa. **Antes de culpar a un diff, aislar el env.**
2. **Un `awk` me dio un falso negativo y casi lo reporto.** Usé
   `awk '/SERVICIOS_NAV_ITEMS/,/^]/'` para contar `/patients` y dio 1 — pero `awk` REABRE
   el rango en cada mención, y la segunda (`nav: SERVICIOS_NAV_ITEMS`, línea 373) arrastró
   otro bloque. El conteo real acotado a las líneas 340-357 es **0**. Un rango de `awk`
   sobre un nombre que aparece dos veces no es un rango.
3. **⚠️ ARREGLÉ MAL el defecto de servicios profesionales y lo tuve que revertir.**
   Agregué `{ href: "/patients", label: "Clientes" }` al `SERVICIOS_NAV_ITEMS`. `tsc`
   pasaba y mi guard nuevo pasaba — pero **rompió un test existente**:
   `api-route-registry.test.ts` ("si el pack expone la pantalla, es dueño de su API").
   **Por qué estaba mal:** `api-route-registry.ts:98-105` es deliberado — la *colección*
   `patients` ya es de `CON_AGENDA` (incluye servicios, justo para alimentar el selector
   de Citas), y la *ficha* `patients/[id]` + `medical-alerts` + `records` + `treatments` +
   `import` son de `CLINICOS`. Exponer el segmento entero le da a un estudio contable la
   ficha clínica con alertas médicas, y sus APIs le devolverían 403. **El gate de rutas
   trabaja por `topSegment`, así que no se puede permitir la lista y bloquear la ficha por
   esa vía.** Revertido; `master` quedó verde e intacto.

## El defecto que queda vivo, con la evidencia

**Servicios profesionales se vende y NO se puede usar.** Verificado tres veces:

1. `lib/platform/vertical-pack.ts:340-357` — el nav tiene `/appointments` ("Citas") y
   **cero** `/patients`.
2. `lib/platform/route-access.ts:143-151` — `allowedSegmentsForPack` arma la lista blanca
   desde `nav + quickActions + COMMON_SEGMENTS`, y `patients` no está en
   `COMMON_SEGMENTS` (líneas 51-91). O sea la pantalla queda **BLOQUEADA**, no escondida.
3. `app/(dashboard)/appointments/page.tsx:640-652` — el modal pinta
   `<select required>` con los pacientes existentes y **no ofrece alta inline**.

Cruzado contra los otros packs: solo servicios tiene Citas sin Clientes. `ELECTRICO` y
`GESTIOS` no tienen ninguna de las dos (coherente); dental usa `navigation.ts`, que tiene
ambas. **Es un defecto de un solo rubro.**

Bug menor del mismo modal: los rótulos dicen **"Paciente *"** y **"Doctor *"** fijos, sin
pasar por el vocabulario del rubro — un estudio contable ve "Paciente".

**No lo arreglé porque la solución correcta es una decisión de producto, no una línea:**
o se le da al modal un alta inline de cliente, o se le da a servicios una pantalla de
clientes propia que no enlace la ficha clínica, o se saca "Citas" del rubro (lo que lo
gutea). Las tres tocan una superficie viva.

## Qué depende de Sergio

1. **El VPS.** Steal del 95% con Docker caído no se arregla desde adentro. Ticket a
   Hostinger o plan más grande. **Hasta que eso se resuelva no hay deploy.**
2. **Servicios profesionales:** ¿se arregla o se saca de la oferta? Hoy se vende roto.
3. **Moneda:** el producto escribe `Bs 390,00/mes` y la landing `Bs 390/mes`.
   Mi recomendación: centavos DENTRO del producto (caja, factura), sin centavos en los
   precios de venta. Son dos contextos, no una inconsistencia a unificar.
4. **Add-on "Inventario avanzado":** `lib/platform/entitlements.ts:55` lo calcula y
   **ningún archivo lo lee**. Cobrarlo hoy es cobrar un toggle.

## Próximos pasos

1. Destrabar el VPS (bloquea todo lo demás).
2. Deploy de `onia-platform` con el runbook de la skill `onia-deploy` — ojo trampa 7:
   `pgrep -af "npm install|next build"` antes, y `nohup … &` con log.
3. Decidir servicios profesionales.
4. Actualizar `ONIA_CATALOGO_DE_VENTA.md`: quedó desactualizado en varios puntos (el alta
   automática está CERRADA y el §6 describe un embudo que no existe; multi-sede sigue sin
   `branchId`, cero avance en 8 días).

**Objetivo**

Que la web de venta **muestre el uso real y deje de contradecirse**. *Hecho* = fotos de
contexto que pasan el gate + las fugas ALTO de conversión cerradas + render mirado a 390 y
1440 + docs y reglas actualizadas. **Publicar NO era parte del objetivo**: construir y
publicar son dos permisos distintos.

Cumplido, con una excepción declarada abajo (`mostrador.webp`).

---

**Qué quedó EN PRODUCCIÓN**

🔴 **NADA de esta sesión.** Todo está commiteado en la rama y **sin deployar**.
`onia.com.bo` lo sirve el contenedor `onia-landing` del VPS: **pushear a `main` no publica
nada**, hay que buildear y hacer swap.

Lo que SÍ cambió en producción hoy es de otro carril (el del chatbot): una fila en
`inbox_members` de Chatwoot — ver `handoff/chatbot.md`.

---

**Qué quedó a medias, y dónde**

### 1. 🔴 Dos piezas esperando el OK de Sergio (bloquean el swap)
- **El conmutador de rubros con las fotos reales** — de la sesión anterior. Se le mandaron las
  capturas (5 paradas a 1440 + apilado a 390) y no llegó a responder. `switcher.tsx` quedó
  **intacto a propósito** en toda esta sesión, para que esas capturas sigan siendo válidas.
- **La banda "un día con Onia" + `/rubros` + `/facturacion`** — de hoy. Capturas mandadas a 390
  y 1440.

### 2. `mostrador.webp` generada, aprobada y SIN USAR
Es la única de las 6 sin cara, y el doc de imágenes la asigna al **hero** (§7, fila 6). No se
cableó porque el hero es un `<Shape>` de `(sitio)/ui.tsx`, y ese archivo era de otro carril
durante la sesión. **Necesita el carril dueño de `ui.tsx`**, que ahora está libre.

### 2-bis. ✅ CERRADO — la sección de add-ons SÍ se ve; no había bug

Se había anotado como "construida y no verificada" porque un envoltorio `Reveal` medía
`opacity: 0` con el elemento en pantalla. **Era artefacto del entorno de medición**, no un
defecto: una página que no compone frames no dispara `IntersectionObserver`, así que
`whileInView` nunca corre.

Verificado con Playwright en contexto real, forzando las dos preferencias de movimiento:

| `reducedMotion` | bloques invisibles tras recorrer la página | envoltorio de `.offerStar` | desborde |
|---|---|---|---|
| `no-preference` | **0** | `opacity: 1` | no |
| `reduce` | **0** | `opacity: 1` | no |

`motion-provider.tsx` usa `reducedMotion="user"`, que apaga transform y **mantiene la opacidad
animando** — se comporta como está documentado. **No tocar nada acá.**

⚠️ **La lección de método, que es lo que hay que conservar:** un `opacity: 0` medido en un
navegador oculto/headless **no prueba nada**. Antes de reportar un `Reveal` roto, reproducirlo
en un contexto que componga frames. El caso de `/servicios/webs` SÍ era real y determinista
(el `Reveal` medía ~5.000 px y `viewportOnce` exige 30% visible): ese se demuestra por
geometría, sin depender del render. **No confundir los dos.**

### 3. Bugs pre-existentes encontrados y NO arreglados (fuera de carril)
- **`ui.tsx:72` fuerza `loading="lazy"` siempre.** Las ranuras de hero deberían cargar eager.
  Falta una prop `eager`/`priority`. Afecta también a la home.
- **`(sitio)/layout.tsx:12-14`: el comentario miente.** Dice que el layout "NO toca a
  `/nosotros` ni `/servicios/*`" — las dos ya viven adentro desde hoy.
- **`lib/pricing.ts:201-206`: el comentario justifica publicar Bs 790** "porque es el que
  `/servicios/webs` ya muestra en producción hoy". Esa razón está muerta: hoy da 2.000.
- **`content/webs.ts`, tienda → `noIncluye`:** *"Esto no existe en el sistema **todavía**"*.
  Declarar la exclusión es honesto; el "todavía" **exhibe obra en superficie de venta**.
- **`components/requisitos-gate.tsx:73`** usa la clase global `btn` de la v1, no `s.btn` de la
  v3. Renderiza bien, pero es la píldora vieja. Compartido con `/servicios/consultoria` y
  `/servicios/marketing-ia`.
- Siguen en cromo v1: `not-found.tsx`, `/privacidad`, `/terminos`,
  `/servicios/consultoria`, `/servicios/marketing-ia`.

### 4. Abierto de antes, no tocado
- **Login visual**: diagnosticado, sin tocar. Panel izquierdo con un tercio vacío, verde de un
  solo tono, aviso de Supabase **azul** que rompe la paleta, tarjeta blanca sin presencia.
- 🔴 **Switcher de rubros: apila también en ESCRITORIO** — diagnóstico corregido 2026-08-23.

  Estaba anotado como "apila **en móvil**". **Es más grave.** Medido en vivo sobre el
  componente renderizado:

  ```
  viewport 1394x918 · bp767 false · bp1023 false
  prefers-reduced-motion: reduce → TRUE     ← el disparador real
  stage.position static · stage.display flex · marks.display none
  ```

  No es el ancho. `sitio.module.css` apila con
  `@media (max-width: 767px), (prefers-reduced-motion: reduce)`, y el comentario lo declara:
  *"mismo apilado sirve para reduced-motion"*. **Cualquiera con las animaciones desactivadas en
  su sistema operativo ve la sección estrella convertida en una lista** — en Windows ese check
  es común. Se pierde justo el argumento de que el sistema cambia por rubro.

  **El error de concepto:** `reduced-motion` significa *no me animes*, no *mostrame una versión
  pobre*. Hoy se tira la función entera para evitar una animación.

  🔴 **Corregido tras MIRARLO: no es "apila", es un layout ROTO.** Reproducido con
  Playwright a 1440 px con `reducedMotion: 'reduce'` (`position: static`, `display: flex`
  contra `sticky`/`grid` del caso sano). En la captura: la tarjeta **conserva ancho de
  teléfono** en medio de una pantalla de escritorio, las capturas de producto quedan
  **cortadas por la derecha**, las etiquetas de rubro **pisan** las imágenes y **media
  pantalla queda vacía**. Estaba anotado como "fallback digno". No lo es.
  Capturas: `scratchpad/verif/switcher-{normal,reduce}.png`.

  ### Comportamiento DEFINIDO (esto es lo que hay que construir)

  | Contexto | Layout | Cambio de rubro | Transición |
  |---|---|---|---|
  | Escritorio (≥768px), movimiento normal | dos columnas, `.stage` pegado | por scroll, discreto por umbral | rodillo animado (`--niche-dur .5s`) |
  | **Escritorio, `reduced-motion`** | **igual: dos columnas y pegado** | **igual: por scroll** | **`transition: none`** — el rubro cambia de golpe |
  | Teléfono (<768px) | apilado | — | — |

  O sea: `reduced-motion` **sale** del selector de apilado y pasa a apagar **solo la
  transición** de `.roll`, `.slotNombre` y la píldora. El apilado queda **únicamente** para
  `max-width: 767px`, donde sí es cierto que la tarjeta no entra al lado.

  ⚠️ Verificar el resultado **con reduced-motion activado a propósito** (Playwright:
  `reducedMotion: 'reduce'` en el contexto). Con la preferencia apagada el bug es invisible —
  por eso sobrevivió: todas las capturas anteriores se sacaron sin ella.

  ⚠️ Al tocarlo se toca `switcher.tsx` / `sitio.module.css`, que están **esperando el OK de
  Sergio sobre la pieza**. Coordinar: o entra en la misma revisión, o espera.
- **Telegram para pedidos de acceso**: las variables están en `app.env` pero el contenedor no
  las tomó (`docker restart` no relee `--env-file`). Requiere recrear el contenedor (3 redes,
  hay datos de clientes). Hoy el aviso sale por correo, que funciona.
- **Commits de `onia-platform` master sin deployar**: `2a2b77b` `a5ee33f` `6d34e62` `78ac58c`
  `78d549e` (fix de `/contact` + guard 20 + seed de 5 inquilinos + skill).

---

**Archivos y cambios**

Todo en `web-factory/apps/onia-platform/` salvo donde se diga.

- **`public/contexto/*.webp`** — 6 fotos nuevas, **512 KB en total**. Ver
  `hermes-content/docs/ONIA_WEB_IMAGENES_DE_CONTEXTO.md`.
- **`(sitio)/page.tsx`** — banda "un día con Onia" (3 escenas); `sinEsto` en la tarjeta de plan;
  4 FAQ nuevas con su fuente en comentario; verbos de CTA alineados.
- **`(sitio)/rubros/page.tsx`** — celda a 3 columnas: nombre · resultado + features · foto.
- **`(sitio)/facturacion/page.tsx`** — bloque del dolor a dos columnas con `servicios.webp`.
  **Cero copy nuevo**: el texto sigue saliendo de `lib/siat.ts` y la nota honesta quedó intacta.
- **`(sitio)/precios/page.tsx`** — `sinEsto` renderizado con jerarquía menor y viñeta `—`.
- **`(sitio)/chatbot/page.tsx`** — anclaje de precio **derivado** de `CHATBOT_PLAN.mensual`
  (no escrito a mano) + ranura cableada con `capturas/whatsapp.webp`.
- **`(sitio)/empezar/page.tsx`** — ranura cableada con `capturas/panel.webp`.
- **`(sitio)/nav.ts`** — `/nosotros` entra en `NAV_DECIDIR`.
- **`app/nosotros/` y `app/servicios/webs/` → dentro de `(sitio)/`** — portadas al cromo v3.
  URLs sin cambios (grupo de rutas), `sitemap.ts` no se tocó.
- **`(sitio)/ui.tsx` `menu.tsx` `agentes/` `comparativa/` `contacto/`** — verbo del CTA.
- **`(sitio)/sitio.module.css`** — clases nuevas (`.foto` `.scenes` `.cellFoto` …) y
  **`z-index: 1` en `.shapeShot` (línea ~1448)**: el bug del rectángulo verde.
- **`CLAUDE.md`** — dos reglas corregidas (gasto imagen vs video; barrer toda la superficie).
- **`.claude/skills/onia-web-factory/SKILL.md`** — sección de imágenes generadas.
- **`hermes-content/docs/ONIA_CATALOGO_DE_IDEAS.md`** — promovido desde `historial/` (git mv,
  historia intacta, 8 referencias reapuntadas) + los 3 candidatos anotados.

**Bugs vivos que se arreglaron de paso:**
1. **Rectángulo verde tapando las capturas** (`.shapeShot` sin `z-index`) — estaba **en
   producción** en la home y `/agentes`.
2. **Google mostraba precios que nadie cobraba**: `/servicios/webs` anunciaba en su meta
   "Bs 790 / 1.500 / 2.900", oferta vencida el 31-jul. Ahora se deriva de `WEB_STACKS`.
3. **Bloque de compra invisible en teléfono**: el `Reveal` de "Pedila" medía ~5.000 px y
   `viewportOnce` exige 30% visible — nunca disparaba, quedaba en `opacity: 0` para siempre.
4. **La promesa rota del CTA en 11 superficies** (ver intentos fallidos).

---

**Intentos fallidos**

- 🔴 **La lista de "evitar" del prompt INVOCA lo que nombra.** `soul_2` no tiene
  `negative_prompt`; todo cae en el mismo campo de texto. Un lote de 6 con sección
  `Avoid: dashboards, blue neon, candlestick charts, man in a suit pointing at a whiteboard`
  devolvió **exactamente eso**. 6/6 rechazadas, ~0,7 cr perdidos. La solución fue reescribir
  **100% afirmativo**. Detalle en `ONIA_WEB_IMAGENES_DE_CONTEXTO.md` §4.
- **Si el prompt describe ropa, el modelo le pone marca.** Tercer caso del mismo tropiezo: una
  MacBook con logo de Apple, y un uniforme bordado **"BOLVIA"** (marca inventada y con falta de
  ortografía). Mirar pecho, gorra y taza antes de aprobar.
- **Los `public/fotos/*.webp` que ya estaban en disco parecían material aprovechable y no lo
  son**: sonrisa a cámara, bata blanca, grade teal-naranja. Casi se cablean. Por eso ahora hay
  una tabla de qué es publicable (§10 del mismo doc).
- **`public/v2/*.webp` (raíz) es material de QA**, no producto: inquilinos cruzados ("ZZ QA
  Clinica" con mensajes de "ZZ QA Ferreteria"), el nombre de Sergio, y texto de debug
  "(aud 11:52)". Se ve bien de lejos; por eso es peligroso. El lote limpio es `v2/capturas/`.
- 🔴 **Tres `next dev` contra el mismo worktree** (3210/3287/3288) pisándose los manifests de
  `.next` → 404 y 500 intermitentes y `__webpack_modules__ is not a function`. Un agente borró
  `.next/` bajo otro. **Un carril = un puerto = un `.next`.**
- 🔴 **`git add -A` en worktree compartido stageó 12 archivos ajenos.** Se deshizo a tiempo.
  **Rutas explícitas, siempre.**
- **`npx tsc --noEmit` puede tirar `TS2307` en `.next/types/validator.ts`** cuando otro carril
  mueve rutas. Es artefacto generado y gitignoreado: se regenera `.next` y desaparece. **No
  "arreglarlo" tocando código.**
- **`next build` de la landing falla en Windows** con `EPERM: symlink` al armar el standalone.
  No es del cambio: compila y genera las 31 páginas; en Linux (VPS/CI) el symlink funciona.
- **Arreglar la promesa del CTA sólo donde saltó.** `/register` dejó de crear cuentas, se
  arregló en `/empezar`, y quedaron **once** superficies prometiendo alta instantánea. Regla
  nueva en `CLAUDE.md` §2.

---

**Qué depende de Sergio**

1. 🔴 **Mirar la pieza y dar el OK** — la banda "un día con Onia", `/rubros` y `/facturacion`
   (capturas mandadas a 390 y 1440), **y** el conmutador de rubros que quedó pendiente de la
   sesión anterior. **Sin eso no hay swap.**
2. **Decidir el turno de infra**: el deploy de la landing y el del producto pelean el mismo
   turno que el carril del chatbot, que está activo.
3. **El clic de prueba del Embedded Signup** — `chat.onia.com.bo` → Ajustes → Entradas → Nueva
   → WhatsApp → "Connect with WhatsApp Business". Es lo único que prueba el handshake con Meta.
4. **Mirar el panel dental en producción** — nadie lo vio renderizado; vive tras el login.
5. **Decisión**: ¿el botón de Google se habilita (necesita credenciales de Google Cloud) o se
   esconde? Hoy está visible y roto.
6. **Access Verification de Meta** — enviada, vence el **20/10/2026**.
7. **Rotaciones** cuando tenga su laptop: password de Postgres, tokens de Meta del historial,
   claves de Supabase en 4 workflows dormidos de n8n.
8. **¿Se actualiza `COORDINATION_MANIFEST.md`?** Es del 30-jul y no nombra ninguna de las 8
   ramas vivas. Un manifiesto que no nombra los carriles vivos no previene nada.

---

**Próximos pasos**

1. **Esperar el OK y hacer el swap** de la landing. *Listo* = `onia.com.bo` sirviendo esto,
   mirado renderizado en producción.
2. **Cablear `mostrador.webp` en el hero** (necesita el carril de `ui.tsx`, hoy libre), y de
   paso la prop `eager`/`priority` que falta ahí.
3. **Deployar `onia-platform`** (contact + guard + seed), cuando el turno de infra esté libre.
4. **Rediseñar el visual del login**. *Listo* = capturas a 390 y 1440 leídas, sin el vacío del
   medio ni el azul ajeno.
5. **Switcher móvil**: que cambie de rubro al scrollear en vez de apilar.
6. Los 5 bugs pre-existentes del punto 3 de "a medias".

**Pendientes anotados y NO perseguidos**

- **`/v1` sigue pública** sirviendo la landing vieja con las fotos que no pasan el gate, y
  `components/landing-v2/**` es código muerto que además nombra **veterinaria**, rubro cerrado.
  Verificado hoy: producción es `(sitio)`, no `landing-v2` — el HTML vivo trae
  `class="sitio_display__0Ivyr"`. **El diseño que le gusta a Sergio no lo toca nadie.**
- Dental, estética y servicios cierran el día en el mismo **Bs 942,50**: comparten el fixture
  de cobros. No se ve en las fotos elegidas.
- La foto de servicios del conmutador muestra "Crédito fiscal Bs 0,00 · 0 compras
  registradas". Es honesto pero un cero en una foto de venta no ayuda: sembrar compras.
- El hero convive `Bs 1.806` con `Bs 1.147,50` — inconsistencia de formato **dentro de la
  captura**, así que arreglarla obliga a re-fotografiar el panel.
- El `h2` del manifiesto ("Onia es un solo sistema de gestión con IA…") ocupa 5 renglones a
  tamaño display y pesa como un muro arriba de la banda. Es copy aprobado: **no se tocó**.

---

# TERCER OBJETIVO (2026-08-23, noche) — cerrar los frentes de producto

Sergio: *"Esta bien, arregla esos frentes"* + *"para cada rubro que funciones se necesitan
realmente y que innovaciónes podes colocar"*. El del VPS lo toma él.

**En `master` de `onia-platform` y pusheado** (`73398cc`). Gates: `tsc` 0 · **2007 tests**
(1991 base + 16 nuevos) · `next build` exit 0 real.

| Frente | Qué se hizo |
|---|---|
| Servicios profesionales invendible | Alta inline de cliente en el modal de Citas (`ae2273d`) |
| Rótulos fijos en dental | `vocabularioDeTrack` / `nombreDeRol` en el mismo modal |
| Add-on inventario | Se sacaron de la copia las 2 promesas sin cablear (`73398cc`) |
| Moneda | `formatPrecioVenta` (lista, sin centavos) vs `formatBs` (plata que se mueve) |

## Intentos fallidos de esta tanda

1. **Dije "las tablas de proveedores/compras/lotes no existen" y era FALSO.** Grepeé
   `model (Supplier|Purchase|InventoryBatch)` — nombres en inglés — y me comí
   `OniaCommercePurchase`, `OniaCommerceStockLot` y `OniaCoreBusinessPartner`. **En un repo
   con nombres de dominio propios, un grep por nombre en inglés no descarta nada.**
2. **`exit code 0` de un pipe NO es el exit del build.** `npx next build | tail -6` reporta
   el exit de `tail`. Pasó DOS veces el mismo día. Redirigir a un log y capturar `$?`.
3. **El build no corre en un worktree nuevo**: turbopack infiere mal la raíz (toma
   `<worktree>/app`). El gate se corre en el checkout principal.
4. **El checkout principal tiene `.env.local`** — hay que apartarlo antes de buildear y
   restaurarlo después, o Next hornea `127.0.0.1` (el bug que rompió el login de prod).

## Falsos positivos del gate del bundle (para no volver a asustarse)

`grep 127.0.0.1` da 3 hits en `.map` de `node_modules` y 2 `localhost:8969/9999` que son
defaults de Sentry Spotlight; el `127.0.0.1` del chunk de servidor es un fallback de
`hostname()` de una librería. Ninguno es un valor de entorno horneado. La URL de Supabase
en la nube que aparece sale de `.env` LOCAL, que está en `.gitignore` y **no versionado**:
no llega al VPS. El build de producción usa `app.env` en el VPS.

## Investigación por rubro

Cuatro docs en `hermes-content/docs/research/rubro-*.md` (`a814fdde`). El patrón que se
repite en tres de los cuatro: **está construido y apagado**, no falta.

## Pendiente COMERCIAL de Sergio (no es un bug)

El add-on "Inventario avanzado" cobra Bs 180/mes por tres funciones que hoy son **gratis**:
`addon.inventory_advanced` se calcula en `entitlements.ts:55` y no lo lee nadie, y
`/comercio/fiados` no tiene gate de plan ni de add-on. O se gatean, o no se cobra.
