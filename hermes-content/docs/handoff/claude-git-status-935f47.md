# Handoff — carril `claude/git-status-935f47` (la web de venta)

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: 2026-08-23.

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
