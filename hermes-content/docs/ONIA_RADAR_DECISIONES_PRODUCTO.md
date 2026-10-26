# Radar de decisiones de producto — las ideas que no se pueden perder

> Doc VIVO sin fecha (se edita, no se duplica). Nace 2026-08-17 de un volcado de
> Sergio: "estas son ideas que no puedo olvidar; luego vamos a desglosar una por
> una". Cada frente lleva su estado REAL verificado y la pregunta que falta decidir.

## Cerradas — vencidas, verificadas contra el sistema en vivo (última: 2026-09-04)

Estas **diez** (A–J) dejaron de necesitar una decisión de Sergio: el propio sistema (u otra
sesión) ya las resolvió. Se cierran acá con la medición, no se borran del historial de
"Para decidir" — ese punto queda con una nota que apunta para acá.

> **Cómo se cierra una.** No alcanza con que "parezca hecha": se vuelve a medir **con el mismo
> instrumento que la denunció** y tiene que dar lo inverso. Si el punto acusó con `md5sum`, se
> cierra con `md5sum`; si acusó con un `grep` dentro del contenedor, se cierra con ese `grep`.
> Un instrumento distinto puede estar dando la razón por otro motivo — ya pasó con el canario.

> ⚠️ **Y hay un segundo modo de cerrar, que no es "venció" sino "estaba dos veces":** la §20 y la
> §34 le pedían a Sergio el MISMO deploy con tres números distintos. Eso no se cuenta acá porque
> no venció nada — se fusionó en la §34 y la §20 quedó tachada. Una decisión duplicada le cuesta
> a Sergio lo mismo que una fantasma.

**A. ¿Publicamos `onia.com.bo`?** Ya está publicado. `/opt/onia-landing/runtime-next`
se desplegó el **2026-09-01 21:42 UTC** (`stat` del directorio), con `BUILD_ID`
`qinaKbiNJ_V9rh9loH5MO` — distinto del `Ega1b2zc6I30Rblyyl2Fv` que el punto daba por
vivo. Verificado MIRANDO las dos páginas que el punto señalaba como rotas:
`curl -s https://onia.com.bo/precios | grep -c "Inventario avanzado"` → **0** (ya no
cobra el addon retirado) y el `<h1>` de `https://onia.com.bo/` es
`"Cerrás vos.<br/>El negocio no."` — el hero de PR #35, no el de la v3. Los dos commits
que el punto pedía (`eec7d0f3` precio, `c8dfe249` hero) son ancestros de `origin/main`
Y ya están sirviéndose.

**B. ¿El chatbot AGENDA? (la rama `fix/bot-manda-link-de-reserva`)** Ya se mergeó —
commit `fbe106be` (2026-09-01 20:28 -04:00), y trae la decisión tomada adentro del
propio mensaje: *"El catalogo de venta NO se toca: no promete agendar hasta que el bot
desplegado lo haga."* Verificado que se cumplió: `ONIA_CATALOGO_DE_VENTA.md:126` sigue
diciendo que un pedido de cita "lo ESCALA a una persona", y
`scripts/venta-honestidad.test.mjs` (test *"el catalogo de venta no vende que el
chatbot agenda"*) sigue en el repo verificando exactamente eso. No hay pregunta
pendiente: se decidió mergear el código y dejar la promesa de venta como estaba hasta
el deploy al VPS — que ya es parte del punto 16(a) de este mismo radar, no una decisión
nueva.

**C. "El canario mira 10 pantallas en el repo, pero el VPS sigue corriendo la versión
de 3."** Ya no. `diff scripts/loops/prompts/canario-visual.md /root/bin/loops/canario-visual.md`
→ sin salida, archivos idénticos (18.371 bytes los dos, el del VPS fechado
`2026-09-02 02:25`). El comando de un renglón que el punto pedía ya se corrió.

**D. "Dos ramas quedaron fuera de la integración" — una de las dos ya no.**
`git rev-list --left-right --count origin/main...origin/claude/chatbots-platform-review-0d1d09`
→ `388 0`: cero commits propios sin mergear (confirmado con
`git log origin/claude/chatbots-platform-review-0d1d09 --not origin/main`, vacío). Ya
está adentro de `main` — no hace falta rebasar ni archivar. Sigue viva sólo
`claude/onia-web-architecture-b37eca` (401/2, aumentó desde el 371/6 de la última
medición: sigue divergiendo, no se achica sola).

**E. §9 — "la frase falsa sigue viva en producción". Ya no: se desplegó.** El punto pedía
elegir entre (a) desplegar `master`, (b) esperar al punto 1, o (c) no desplegar. Se hizo (a).
Medido **dentro del contenedor de producción**, con el mismo comando que el punto usó para
denunciarlo — y da lo inverso:

```
docker exec onia-platform grep -rl "califica, agenda"  /app/.next | wc -l  →  0   (antes: 5)
docker exec onia-platform grep -rl "deriva al humano"  /app/.next | wc -l  →  21  (antes: 0)
```

El `BUILD_ID` vivo es `lNDdVgrRvP1mizzu3BVXc` y el contenedor arrancó el **2026-09-01
22:28:26 UTC** (`docker inspect onia-platform`). Y lo que ahora lee el cliente en la pantalla
del add-on —la de Bs 390, que el punto llamaba "el peor lugar posible para una promesa que el
motor no cumple"— es la frase corregida de `f47d615`, extraída del bundle servido:

```
tagline:"Contesta, califica, deriva al humano y hace seguimiento 24/7, con tu aprobacion."
```

**Ojo con lo que esto NO cierra:** el punto 16 sigue vivo en su parte **(a)**, que es otro
deploy y **otro sistema** —el motor del bot en `/opt/onia/bot`, no el bundle de la plataforma—.
Medido hoy, `node hermes-content/deploy/vps-ops/bot/espejo-check.mjs` sale **DESINCRONIZADO**:
11 archivos distintos (`bot-engine.test.mjs`, `campanas-web.test.mjs`, `config.mjs`,
`espejo-check.mjs`, `espejo-check.test.mjs`, `intents.mjs`, `knowledge.mjs`,
`knowledge.test.mjs`, `preview-route.mjs`, `recepcionista.mjs`, `recepcionista.test.mjs`) y
**falta** `evals-contrato.test.mjs`. El rezago del motor no se achica solo.

> ⚠️ **Ese párrafo caducó el 2026-09-03 a las 01:58 UTC: el deploy del motor SÍ se hizo.**
> Ver **F**, acá abajo.

**F. §16(a) — "el motor del bot no está desplegado". Ya lo está.** El punto pedía el deploy del
motor al VPS y lo justificaba con el arreglo más caro de la semana: `3c2f4ef89`, *"el bot no se
callaba, estaba **muerto** cuando llegaba el mensaje"*. **Ese arreglo está vivo.** Medido con el
mismo instrumento que el punto usó para denunciarlo —`md5sum`, no fechas— y da lo inverso:

| archivo | vivo (contenedor `onia-center`) | `origin/main` (`5f7ba430e`) | |
|---|---|---|---|
| `bot-engine.mjs` | `ab0181ed…` | `ab0181ed…` | ✅ igual (antes vivo era `afe24f58…`) |
| `persistence.mjs` | `ada07d4d…` | `ada07d4d…` | ✅ igual |
| `knowledge.mjs` | `02f0db8e…` | `02f0db8e…` | ✅ igual |
| `recepcionista.mjs` | `dcd753d8…` | `dcd753d8…` | ✅ igual |
| `intents.mjs` | `a463089c…` | `a463089c…` | ✅ igual |
| `rescate-run.mjs` | presente | presente | ✅ ya no falta |

El `.stamp` de `/tmp/onia-bot/` es del **2026-09-03 01:58**, y `/var/log/onia-bot-watchdog.log`
cierra con `[2026-09-03T00:04:01+00:00] OK: webhook de vuelta arriba`. **Las campañas, el CTA de
`/v1/empezar` y que el bot mande el link de la agenda ya están encendidos**, y un lead que
escriba hoy ya no le habla a un proceso muerto.

**Lo que queda NO es una decisión de Sergio, y es diez veces más chico.** Barrido completo de los
77 archivos que `main` publica al bot contra los 75 vivos: **9 difieren, y sólo 3 son código que
corre**.

```
docker exec onia-center sh -c 'cd /tmp/onia-bot && md5sum *.mjs *.sh *.json' | sort -k2
# contra: git archive origin/main hermes-content/deploy/vps-ops/bot
config.mjs              main=6869c705  vivo=35dc9d8f   <- codigo vivo
reply-builder.mjs       main=8c336a82  vivo=b2ff1fa9   <- codigo vivo
rescate-run.mjs         main=1c5add2e  vivo=e3a4e5e8   <- codigo vivo
knowledge.onia.json     main=cfc36ae9  vivo=AUSENTE    <- dato
knowledge.example.json  main=cca04ff1  vivo=dac450d3   <- dato de ejemplo
deploy-bot.sh           main=23d35ddc  vivo=AUSENTE    <- el instalador mismo
config.test.mjs · knowledge.test.mjs · rescate-run.test.mjs      <- tests, no corren en prod
```

**Y ya tiene dueño y herramienta**: `hermes-content/deploy/vps-ops/bot/deploy-bot.sh` se escribió
hoy justo para esto (copia por lista blanca, nunca `rsync --delete`, para no pisar
`knowledge.json` ni `webhook.env`, que no están en git). Es el ítem `t_8f88919e` del tablero —
que lo llama *"los dos arreglos"* y **son nueve archivos**, seis más de los que la tarjeta dice.

⚠️ **Lo que quedó afuera no es cosmético: `config.mjs` y `reply-builder.mjs` arreglan un defecto
que el cliente del cliente YA VIO hoy** (conversación 51), textual: *"fuera de horario de
oficina. **l**a encargada te confirma"* — el cargo en minúscula a mitad de frase. Y `config.mjs`
trae `PENDING_HORARIO_SIN_HORARIOS`, que evita el *"¿Te reservo HORARIO A (pendiente de definir)
o HORARIO B (pendiente de definir)?"* que ya salió a producción. O sea: **el deploy grande se
hizo, y el que falta es el que arregla lo que se está leyendo en una conversación real.**

**G. §8 — "Disco C: al 100%, frena TODOS los gates". Ya no frena nada: los gates se mudaron
de máquina.** El punto pedía tres permisos de limpieza (borrar 7 copias de un zip, el mp4 del
temporal, `codex-runtimes`) porque con `C:` lleno *"`tsc`, `vitest` y `lint` no pueden escribir
sus temporales y fallan sin poder correr"*. Esa cadena se cortó sola: **los 15 loops corren hoy
en el VPS, no en Windows.** Medido el 2026-09-03:

```
crontab -l | grep "onia-loop.sh\|lucia-ugc"     # 16 líneas: los 15 de loops.md, todos en el VPS
ls -l /var/log/onia-loop-contenido-cola.log     # 15:14 de HOY — y es la ÚNICA fila que
                                                # loops.md todavía llama "Windows"
git -C /root/loops/onia-hermes log origin/main --since=2026-09-01 | wc -l   # 401 commits
```

Cuatrocientos un commits entraron a `main` desde la mudanza, con `node v20.20.2` en el VPS: los
gates que el punto daba por bloqueados vienen corriendo hace días **en otro disco**.

⚠️ **Cómo se cerró, porque no fue con el mismo instrumento y hay que decirlo.** La regla de arriba
pide re-medir con el instrumento que denunció. Acá es **imposible**: el punto acusó con un `df`
sobre `C:`, y desde el VPS no se ve esa máquina. **No sé cuánto espacio tiene hoy el disco de
Sergio, y no lo estoy afirmando.** Lo que se midió es otra cosa —que ninguna de las tres cosas
que el punto decía que se rompían ocurre ya en esa máquina— y eso alcanza para cerrar, porque
**la premisa no era "el disco está lleno" sino "por eso el carril producto no pasa sus gates"**.
La segunda es falsa hoy, se mida como se mida.

**Lo que queda para Sergio ya no es una decisión, es un minuto opcional.** Los 7,4 GB de las
7 copias del zip y el mp4 siguen ahí hasta que él los borre, pero **no bloquean ningún carril**:
si nunca los toca, no pasa nada. Se saca de "para decidir" y no vuelve.

**Y el riesgo no desapareció: cambió de dirección, y allá ya está atendido.** El mismo modo de
falla —un worktree nuevo se lleva otra copia entera de `hermes-content`— vive ahora en el VPS,
donde Docker comparte disco con `onia.com.bo`, la base y n8n. Medido hoy: **80% de uso, 41 GB
libres**, `/root/loops` = 70 GB en 18 worktrees. Tiene dueño y automatización desde el 2026-09-02
(`/root/bin/onia-aligerar-worktrees.sh`, cron `51 */4`, `git sparse-checkout`).

⚠️ **Y acá casi escribo un hallazgo falso, que es la parte que vale.** Conté 7 de 13 worktrees con
`sparse-checkout` aplicado y los 6 sin aplicar eran justo los más gordos (~5,5 GB c/u) — parecía
la automatización a medio andar, el clásico "construido ≠ terminado". **Leí el script antes de
escribirlo y era al revés**: esos 6 (`calidad`, `canario`, `lucia`, `marca-personal`,
`tendencias`, `contenido-cola`, más el integrador) están en una lista `NO_TOCAR` explícita, con
el motivo al lado — **son los carriles que SÍ miran `hermes-content/references`**, y aligerarlos
les sacaría los archivos que su trabajo necesita. La cuenta daba "6 rotos" y la respuesta correcta
era "6 exentos a propósito". **Contar no es diagnosticar: el número era cierto y la conclusión,
falsa.**

---

### ⚠️ Un tercer modo de cerrar, y es el que más le costó a Sergio: **nunca fue una decisión**

**Los puntos §1 a §7 no son decisiones: son un PARTE DE ESTADO del 2026-08-18.** Tres se titulan
literalmente *"— estado"*. Ninguno le pregunta nada a Sergio. Pero están numerados `## N.` igual
que las decisiones de verdad, así que **cualquiera que cuente el radar reporta siete pendientes
que no existen** — 17 días seguidos.

**Y el contador de este loop estaba roto en la otra dirección**, lo que hacía imposible verlo:
mide "cotizada" buscando el literal `| opción |` en el encabezado de la tabla. Las secciones que
cotizan con `| | Qué se hace | Cuesta | Qué queda |` —que son casi todas, incluidas §35, §38,
§39, §41 y §42, que tienen tabla de costos **y** recomendación— salían **SIN COTIZAR para
siempre**. Medido hoy: el comando viejo decía **22 sin cotizar**; contando por *"¿tiene tabla de
costos Y recomendación?"* son **8**, y de esas 8, siete son este parte de estado.

> **La lección, que es la de siempre acá:** el instrumento que te da un número grande y estable
> es sospechoso. Un objetivo que nunca llega a 0 casi nunca es un backlog que no baja — es un
> contador que no sabe leer lo que ya está hecho.

**H. §3 Bots de llamadas — no hay decisión, y se verificó que sigue sin haberla.** El punto
declara *"diseño listo, CERO construcción… queda para cuando haya clientes pagando el chat"*.
Verificado **contra el motor que corre**, no contra el repo:
`docker exec onia-center sh -c "grep -ril 'calling\|voice_call\|twilio\|call_webhook' /tmp/onia-bot/*.mjs"`
→ **vacío**. Cero construcción, tal como dice. Con 0 clientes pagando el chat, la condición que
el propio punto se puso para reabrirse **no se cumplió**. No hay nada que decidir: hay que
esperar. La arquitectura y la regla F1 (separar llamadas de mensajes ANTES de encender nada)
quedan en `ONIA_VOZ_WHATSAPP_ARQUITECTURA_20260802.md`, que existe y no se toca.

**I. §5 Requisitos del chatbot — se cerró solo, y lo dice en su propio texto.** El punto ya fue
corregido el 2026-09-02: de las cuatro capacidades "a investigar", **tres están vivas en
producción** (botones/listas, recibir imágenes, enviar imágenes) y la cuarta —el carrito— el
propio punto la manda a la **§27**, que está cotizada con tabla y recomendación. O sea: la única
pregunta viva de la §5 **ya está preguntada en otro lado**. Es el mismo caso de la §20/§34 —
duplicada, no vencida—, y le cuesta a Sergio exactamente lo mismo que una fantasma.
Queda **un solo dato sin medir**, y no es una decisión sino un dato: si Bolivia está habilitada
para el catálogo nativo de WhatsApp. Se mira en `business.facebook.com` → Commerce Manager con
la cuenta de Meta de Onia; ningún loop se loguea a servicios, así que sigue esperando a Sergio
**como dato**, no como decisión.

**J. §7 ¿Factura de verdad? — la auditoría NO está "en curso": terminó hace 17 días.** El punto
dice *"auditoría corriendo… sale en `ONIA_FACTURACION_ESTADO_REAL.md` con una respuesta clara
para la venta"*. Ese archivo existe, está commiteado **el mismo 2026-08-18**
(`git log -1 --format=%ad -- hermes-content/docs/ONIA_FACTURACION_ESTADO_REAL.md` → `2026-08-18`)
y tiene la respuesta como título de sección propia:

> **`## ¿Se le puede decir a un cliente "Onia te factura"?`**
> **`# NO — pero SÍ "Onia te cobra, te lleva la cuenta y te deja lista la declaración"`**

Eso es exactamente el *"SÍ/NO/con qué asterisco"* que el radar seguía esperando. **El radar
estuvo 17 días pidiendo una respuesta que ya estaba escrita el mismo día que se pidió.** Lo que
el doc sí deja abierto son cosas del producto (la emisión SIAT apagada y con un mock debajo), y
eso es trabajo del carril dueño, no una decisión de Sergio en el radar.

## 1. ¿Chatwoot o plataforma de chat PROPIA hecha por Onia?

**La regla de Sergio**: "tiene que ser hecho por nosotros — usar otra plataforma no
tiene sentido".

**Lo que YA es nuestro (construido y probado):**
- El MOTOR conversacional entero: `bot-engine` propio, 508 tests, guardrails,
  etapas, LLM gateado. Chatwoot NO piensa nada — solo transporta.
- El conocimiento por organización + editor + probador (producto, en prod).
- La cara: widget con "Desarrollado por Onia" verificado en píxeles (branding de
  Chatwoot pisado vía `installation_configs`; vigilar el reconcile).

**Lo que Chatwoot aporta hoy (y costaría construir):** bandeja humana multi-agente,
canales (WhatsApp/Website/API), Embedded Signup ya soportado, historial. Decisión
previa vigente: "encender, no construir" (memoria plataforma-canales-decision).

**Camino recomendado (a ratificar):** Chatwoot queda como INFRAESTRUCTURA invisible
(el cliente jamás lo ve — ya logrado), y la bandeja que el cliente usa se construye
DENTRO del panel Onia cuando un cliente real la pida (`/communications` ya existe
como base de solo-lectura). Reemplazar Chatwoot entero = proyecto grande sin cliente
que lo pague todavía; taparlo = hecho.

**Autochecking**: no depende de la plataforma — depende del App Review de Meta (EN
CURSO, ~20 días) + prueba de coexistencia con +591. Hasta qué punto es self-service:
popup conecta número y el formulario A-D arma el bot; lo único no-self-service que
queda es la plantilla utility para fríos y el alta del inbox (automatizable después).

## 2. ~~Páginas web~~ — PARTE DE ESTADO, no hay decisión (2026-09-04)

> Sus tres pendientes (portar v5 al producto · portafolio publicado · pipeline intake→web) son
> **trabajo del carril `web-factory-dev`**, no decisiones de Sergio. No se cuentan acá.

**Avanzado, es el frente más maduro:** Web Factory con 22 bloques + templates
(dashboard canon v4/v5 elegido, landing-realestate generada desde learned model),
pattern banks + DESIGN_LEARNED (15 fuentes + galerías), checklist de pre-entrega de
17 items como gate, mapa de conocimiento ordenado en DESIGN_STACK.
**Falta:** portar v5 al producto (espera OK) · portafolio publicado (3 videos listos
sin publicar) · pipeline intake→web a escala con clientes reales.

## 3. ~~Bots de LLAMADAS~~ — PARTE DE ESTADO, no hay decisión — CERRADO 2026-09-04, ver **H** arriba

- Arquitectura YA escrita: `ONIA_VOZ_WHATSAPP_ARQUITECTURA_20260802.md` (1.058
  líneas). Bolivia NO está excluida de la Calling API de Meta (verificado 15-ago).
- **Regla F1 antes de encender NADA**: separar llamadas de mensajes — si se habilita
  `calls` en la misma app, los webhooks de llamada caen en Chatwoot, responde 200 y
  los descarta: el que llama escucha silencio y el diagnóstico falso cuesta días.
- Estado real: diseño listo, CERO construcción. Cola: detrás del chatbot de texto
  completo (que está a un paso). El benchmark de agentes descartó recepcionista de
  voz como próximo paso por esfuerzo/retorno — la arquitectura queda para cuando
  haya clientes pagando el chat.

## 4. ~~Landing con precios~~ — PARTE DE ESTADO, no hay decisión (2026-09-04)

> **El "checkpoint 1-sep para la tarifa exacta" que este punto dejaba abierto ya pasó y el precio
> está ratificado.** Verificado en la fuente única, no en un doc:
> `lib/pricing.ts:3` → *"PRECIO VIGENTE (ratificado 2026-08-21): Bs 390/mes, Bs 3.900/año"*,
> y `entryMonthly: 390` / `annualTotal: 3900` en las líneas 28-30. Coincide con lo que este punto
> decía, así que no hay nada que ratificar. El resto (hero nuevo · portar precios del catálogo)
> es trabajo del carril `web-venta`.

- Landing viva en onia.com.bo (139 kB, deployada; /comparativa arriba).
- Precios: `onia-platform/lib/pricing.ts` ÚNICA fuente (regla dura). Chatbot:
  **Bs 390/mes o Bs 3.900/año, sin cargo inicial**, con 500 conversaciones + "a medida"
  cotizado. El consumo de Meta lo paga el cliente en su cuenta (por eso el abono cierra a
  este precio — ver `ONIA_FECHAS_CRITICAS_PLAN.md`). Checkpoint 1-sep para la tarifa exacta.
- Promesa SIAT RETIRADA de la bio hasta que el NIT (S2) destrabe — al volver, es el
  argumento del 30-sep (RND 102600000007, grupos 9-12 por NIT, verificable). ⚠️ *Ya no existe:
  la RND 102600000038, 30-sep-2026, dejó sin efecto ese plazo (corregido el 3-oct).*
- Pendiente: hero nuevo (queued de sesión anterior) · portar los precios nuevos del
  catálogo de venta a la landing cuando Sergio ratifique la lista.

## Orden sugerido para desglosar (cuando Sergio quiera)

1. Cerrar chatbot texto (inbox→org en curso · plantillas por rubro · esperar Meta).
2. Ratificar el camino Chatwoot-invisible + bandeja propia gradual.
3. Portar dashboard v5 + hero/precios de landing.
4. Llamadas: recién con clientes de chat pagando (F1 primero, siempre).


## 5. ~~Requisitos de Sergio para el chatbot del cliente (2026-08-18)~~ — 3 de 4 vivas en producción, la 4ª es la §27 — CERRADO 2026-09-04, ver **I** arriba

1. **Self-service TOTAL**: el cliente configura TODO desde su panel — sin tocarnos
   la puerta. Simple por diseño (el formulario A-D es la base; lo que no sea
   simple, se simplifica).
2. **Fácil para los clientes DEL cliente**: el que chatea con el bot debe poder
   usar y COMPRAR sin fricción — el bot no es solo informativo, es un canal de
   venta del negocio.
3. **Capacidades ricas a investigar (factibilidad en curso)**: enviar/recibir
   imágenes (catálogo con fotos, comprobantes), botones/listas interactivas,
   carrito/pedido por chat, y qué permite cada canal (widget web vs WhatsApp
   Cloud API — catálogo nativo de WhatsApp incluido).

⚠️ **Corregido el 2026-09-02: TRES de las cuatro ya no son "a investigar" — están construidas
y CORRIENDO en producción.** El punto lleva desde el 18-ago mandando a investigar la
factibilidad de cosas que el motor ya hace, y eso vale plata: es la lista que se mira para
decidir qué se puede vender.

Medido contra **el motor que de verdad corre**, no contra el repo. El proceso vivo es
`node /tmp/onia-bot/webhook-server.mjs` (pid 915791), y ese `/tmp` no se ve desde el disco del
VPS —es la vista del contenedor—, así que se leyó por `/proc/915791/root/tmp/onia-bot/`
(59 `.mjs`). Es la misma trampa que el §12 documentó: mirar `/opt/onia/bot` **no** es mirar lo
que atiende.

| capacidad | estado real | la prueba, en el motor que corre |
|---|---|---|
| **Botones / listas interactivas** | ✅ **vivo** | `input_select` ×6 en `chatwoot-adapter.mjs`; `botonesRecepcion` ×5 en `recepcionista.mjs` |
| **Recibir imágenes** (comprobantes) | ✅ **vivo** | `vision.mjs` presente en el motor que corre; describe la imagen entrante |
| **Enviar imágenes** (catálogo con fotos) | ✅ **vivo** | `sendAttachment` ×2 en `chatwoot-adapter.mjs` (multipart a la API de Chatwoot) |
| **Carrito / pedido por chat** | ❌ **no existe** | `grep -ric 'carrito\|checkout\|shopping.cart'` sobre **los 59 `.mjs`** del motor que corre → **0** |

**Lo único que queda abierto de este punto es el carrito** — y como toca el requisito 2 ("que
pueda COMPRAR sin fricción"), va cotizado abajo como **decisión 27**.

⚠️ **Lo que sigue sin medir, y dónde se mira:** el **catálogo nativo de WhatsApp**
(Single/Multi-Product Message) no se pudo confirmar — el dato que falta es si Bolivia está
habilitada para catálogo de WhatsApp Business, y se mira en `business.facebook.com` →
Commerce Manager, con la cuenta de Meta de Onia. Este loop no se loguea a servicios.


## 6. La prueba de "web conectada al sistema" lleva 17 días parada porque el laboratorio está en un disco que ningún loop alcanza (2026-08-18, medido 2026-09-04) — decisión de Sergio

**Qué se decide.** Sergio pidió el 18-ago: *"quiero que toques cómo podemos conectar páginas webs
a los sistemas; hacé la prueba con Bolivian Electric"*. **La tarea nunca arrancó, y ahora se sabe
por qué:** el laboratorio que él eligió vive en `C:\dev\clientes\Bolivian Electric` — su laptop.
Los 15 loops se mudaron al VPS, así que **ninguno puede abrir ese repo**. Medido hoy:
`find /root/loops -iname "*bolivian*"` → **vacío**. No es un pendiente mal escrito ni falta de
tiempo: está pedido contra un disco que el que tiene que ejecutarlo no ve.

Mientras no se decida, queda bloqueado el argumento de venta *"tu web alimenta el sistema"* —
terreno que el propio doc marca como no ocupado ni por Forges ni por las agencias.

**Lo que sí está vivo y no hay que rehacer:** el circuito 1 (formulario → lead) ya tiene
precedente en producción — `https://forms.onia.com.bo/alta` responde **HTTP 200 en 0,086 s**
(medido hoy) y escribe en `onia_center.leads`. Los 4 circuitos están en
`ONIA_WEB_CONECTADA_AL_SISTEMA.md`.

| opción | qué cuesta | cuánto tarda | qué se pierde |
|---|---|---|---|
| **A. Sergio sube Bolivian Electric a un remoto que el VPS lea** (el mismo GitHub donde ya vive `onia-hermes`) | **0 Bs.** Su tiempo: un `git push`, minutos | La prueba arranca la vuelta siguiente | Nada. Es el cliente que él eligió y el que da el caso real |
| **B. Cambiar el laboratorio a una app que el VPS ya tiene** (`ferreteria-sur` o `dental-premium`, en `web-factory/apps/`) | **0 Bs, 0 de su tiempo** | Arranca hoy | Es una web de demo, no de un cliente real: la prueba no demuestra el circuito con datos de verdad |
| **C. Nada** | 0 | — | Lo que viene pasando: 17 días quieto, y sigue apareciendo como pendiente en cada conteo del radar |

**Recomendación: A**, porque el valor de la prueba está justamente en que sea un cliente real —
con B se prueba la cañería pero no se puede vender el resultado. Y cuesta un `git push`.

**Lo que NO es opción, y por qué:** que un loop "se conecte igual" a la laptop. El VPS no ve ese
disco y ningún loop se loguea a nada; pedirlo otra vez sin mover el repo repite los 17 días.

---

### El texto original del 18-ago, que sigue siendo la fuente de la tarea

Sergio: "quiero que toques cómo podemos conectar páginas webs a los sistemas; hacé la
prueba con Bolivian Electric". Doc con los 4 circuitos y el plan de prueba:
`ONIA_WEB_CONECTADA_AL_SISTEMA.md`. Resumen: el circuito 1 (formulario→lead) ya tiene
precedente vivo (forms.onia.com.bo/alta → onia_center.leads); Bolivian Electric está
HOY desconectado del sistema (verificado) y es el laboratorio ideal. Vender "web que
alimenta el sistema" es terreno que ni Forges ni las agencias ocupan.

## 7. ~~¿Factura de verdad? (2026-08-18)~~ — la auditoría terminó el mismo día — CERRADO 2026-09-04, ver **J** arriba

Sergio pidió verificar si el sistema factura realmente. Auditoría corriendo que separa
tres cosas que no son lo mismo: factura interna del negocio (documento de cobro) ·
factura FISCAL SIAT (bloqueada por NIT, a confirmar) · cobro de Onia a sus clientes
(hoy comprobante manual). Sale en `ONIA_FACTURACION_ESTADO_REAL.md` con una respuesta
clara para la venta: se puede decir "Onia te factura" SÍ/NO/con qué asterisco.

## 8. ~~Disco C: al 100% — frena TODOS los gates~~ — CERRADO 2026-09-03, ver **G** arriba

> **Ya no hay decisión.** Los 15 loops corren en el VPS desde el 2026-09-01: los gates que este
> punto daba por bloqueados llevan **401 commits** a `main` corriendo en otro disco. Borrar los
> 7,4 GB del temporal sigue siendo cosa de Sergio, pero **no bloquea ningún carril**. La medición
> completa —y el falso hallazgo que casi escribo sobre el disco del VPS— están en la entrada
> **G** de *Cerradas*. Lo de abajo queda como historia del 2026-08-31.

**Encontrado en vivo:** `C:` tenía **0 bytes libres**. No es una molestia de fondo: con el disco
lleno `tsc`, `vitest` y `lint` no pueden escribir sus temporales y **fallan sin poder correr**, y
hasta `sed` cortó con *"No space left on device"*. O sea: el carril producto no puede pasar sus
propios gates. Se liberó lo que no necesita permiso —caché de npm, 2,8 GB, se regenera sola— y
quedó en **4,8 GB libres (99%)**. Eso destraba hoy, pero se vuelve a llenar.

**Lo grande NO se tocó porque son archivos de Sergio, no basura de build:**

| Qué | Cuánto | Nota |
|---|---|---|
| 7 copias del MISMO zip `clase the chosen 1 producto por dia` en `%TEMP%` | **6,5 GB** | descargas a medias, mismo archivo repetido 7 veces |
| `2026-08-29 17-05-35.mp4` en `%TEMP%` | 0,93 GB | grabación de pantalla |
| `~/.cache/puppeteer` + `ms-playwright` | 4,0 GB | **no borrar**: son los navegadores que exige la regla de "verificar MIRANDO la pantalla" |
| `~/.cache/torch` + `huggingface` | 1,15 GB | modelos de Speaches (transcripción) |
| `~/.cache/codex-runtimes` | 1,3 GB | se re-descarga |

**Decide Sergio — las tres salidas:**
- **(a) Borrar las 7 copias del zip y el mp4 del temporal.** Recupera **7,4 GB** en un minuto y
  cero riesgo para el repo. Son archivos suyos: no los borro yo.
- **(b) Sumar `~/.cache/codex-runtimes`** (+1,3 GB). Se re-descarga solo cuando haga falta.
- **(c) Mover los ~12 `node_modules` de los worktrees de `onia-platform` a un disco con espacio,
  o borrar los worktrees ya mergeados.** Es lo único que ataca la causa —30 worktrees vivos— pero
  toca carriles de otras sesiones, así que **no es de este loop**.

**Recomendación: (a) ya, (c) cuando se cierren los carriles abiertos.** `E:` tiene 84 GB libres.

---

## 9. ~~El deploy que falta — la frase falsa sigue viva en producción~~ — CERRADO, se desplegó (2026-09-02)

> ✅ **Ya no hay decisión: se hizo la opción (a).** Verificado dentro del contenedor de
> producción el 2026-09-02 — `"califica, agenda"` da **0** chunks (eran 5) y
> `"deriva al humano"` da **21** (era 0). La medición completa está en **"Cerradas → E"** arriba.
> **Lo que este cierre NO arrastra:** el punto 16(a) —el deploy del **motor del bot** a
> `/opt/onia/bot`— sigue abierto y es otro sistema. Lo que sigue es el texto original.

**Medido, no supuesto.** El punto 2 de `ONIA_DEFINICION_DE_TERMINADO.md` está cerrado en
`master` (commit `f47d615`) pero **el contenedor `onia-platform` del VPS sirve el bundle
anterior**. Verificado hoy dentro del contenedor, no por ancestría de git:

- `grep -rl "califica, agenda" /app/.next` → **5 chunks** la traen viva
  (`2r69hfvyqgu11.js`, `0y0ll2ez_8ibn.js`, `0i_c69j3x7kp7.js`, `21bxtovtcih3y.js`,
  `1-eua0_n1sbcf.js`).
- `grep -rl "deriva al humano" /app/.next` → **cero**. El arreglo no llegó.

**Dónde la lee un cliente:** el tagline tiene **un solo** sitio de render,
`app/(dashboard)/settings/addon-chatbot/AddonChatbotClient.tsx:275` — la pantalla del add-on,
detrás de login. O sea: la ve el cliente que ya entró y está por pagar **Bs 390**. Es el peor
lugar posible para una promesa que el motor no cumple.

**El resto del rezago:** `master` está **11 commits adelante** de lo desplegado (`e5c1ad3`),
con la bandeja marcando leído, el CSP del websocket de realtime y el panel del día adentro.

**Decide Sergio — las salidas:**
- **(a) Desplegar `master` (`f47d615`) con `deploy-gates-swap.sh`.** Cierra el punto 2 de verdad
  y arrastra los otros 10 commits. Costo: una ventana de swap; el runbook ya tiene sus 5 gates y
  el backup previo. **Este loop no despliega sin OK explícito.**
- **(b) Desplegar sólo cuando cierre el punto 1** (vincular la org al inbox). Junta las dos
  cosas en una ventana, pero deja la frase falsa viva mientras tanto.
- **(c) No desplegar.** El punto 2 queda cerrado en el repo y **falso donde el cliente mira**,
  que es exactamente lo que la definición de terminado llama 🟠.

**Recomendación: (a).** Los tres gates están verdes sobre `master` hoy —`tsc` 0,
**2362 tests**, lint 0 errores— así que el riesgo del swap es el de siempre, no uno nuevo.

## 10. Las propuestas ya enviadas venden que el bot "agenda solo" (2026-08-31)

**El generador YA está corregido (2026-09-01). Lo que queda para vos es una sola cosa: qué se
le dice a AW Climatización, que ya recibió la versión vieja.**

Estaban en tres clientes de `hermes-content/propuestas/generador/clientes.json` —
`lia-albertengo`, `aw-climatizacion`, `aw-climatizacion-chatbot` — con **22 frases**, no las 6
que este punto contaba. Corregidas a lo que el bot sí hace (**responde, califica y deriva el
caso listo**), los 3 HTML regenerados, y queda una guarda que impide que vuelva:
`ningun cliente le promete al cliente que el bot agenda solo`
(`hermes-content/propuestas/generador/generar-propuestas.test.js`).

**Las dos objeciones que este punto tenía escritas, respondidas — no ignoradas:**

- **(1) *"Lo ya enviado es un artefacto histórico; corregirlo cambia lo que se cotizó"*.** El
  repo ya había decidido lo contrario y con motivo: la guarda `el HTML commiteado es exactamente
  lo que produce el generador` existe desde el arreglo de las 7 propuestas con producto pausado
  (`9649dc75`), y `CLAUDE.md` dice que **historia es lo que lleva fecha en el nombre** — estos no
  la llevan, son salida del generador. Dejar la mentira en el repo para "no tocar el histórico"
  garantiza que la próxima propuesta la vuelva a copiar. **Lo que el archivo no puede arreglar es
  lo que AW ya tiene en la mano.**
- **(2) *"Puede que NO sea falso: el chatbot a medida se cotiza por alcance"*.** Es la objeción
  buena y por eso se verificó antes de tocar, no después. Hoy es falsa igual: el motor único es
  `hermes-content/deploy/vps-ops/bot/recepcionista.mjs`, que en la línea 232 dice *"Pedido / cita /
  compra: se toma y se ESCALA. El bot no agenda ni vende solo"* y lo repite como regla dura en la
  16. **No existe flujo de agenda para construir "aparte": habría que escribirlo.** Y el propio
  precio lo delata — el paquete se llamaba **"Bot + Agenda"** y costaba Bs 1.600 más que el
  calificador, que no paga ni cerca un desarrollo nuevo. Si algún día se construye de verdad, la
  frase vuelve; hoy vender eso es vender lo que no se entrega, que es justo lo que
  `f47d615` sacó de `lib/pricing.ts`.

**Lo que decidís vos, dos cosas:**

1. **AW ya tiene la versión vieja.** ¿Se le manda la corregida antes de que firme, o se deja y se
   aclara de palabra? Es un cliente activo, no un borrador. Recomendación: mandarla — llegar con
   la corrección propia antes de que la descubra él juega a favor.
2. **El 3er paquete perdió su diferenciador.** Era "Bot + Agenda" a **Bs 4.800**; quedó como
   **"Bot + Reportes"** con el mismo precio, y los reportes avanzados también se ofrecen como
   add-on dos filas más abajo en la misma propuesta. **El precio no se tocó** — bajarlo, fusionarlo
   con el calificador o darle contenido real es decisión comercial.

**Pendiente que este punto ya traía y sigue abierto:** las dos propuestas con nombre de epoch
(`dental-smile`, `epic-motion-group`) no tienen entrada en `clientes.json`, así que ni se
regeneran ni las mira ninguna guarda. Nadie sabe qué prometen.

---

## ¿La prueba de 14 días pide tarjeta o no?

**Origen:** Sergio abrió el checkout real de Lety el **2026-08-31** y lo mandó a anotar.

**Lo que hace el referente:** *"7 días gratis — a continuación, 3665,23 BOB por mes a partir del
7 de septiembre"*, con formulario de tarjeta **obligatorio para empezar**. Captura el dato de
pago en el minuto de máximo interés y **auto-cobra al día 7**. El trial no es una invitación:
es un cobro programado con ventana de cancelación.

**Lo que hace Onia hoy:** 14 días, **sin tarjeta**. Verificado vivo en el hero (`PRUEBA.dias`),
y es un diferenciador cierto — el doble de días y sin pedir plata por adelantado.

**Lo que cuesta:** sin tarjeta **no hay auto-cobro**. Al día 14 alguien tiene que cobrar a mano,
cliente por cliente. Lety convierte sola; nosotros convertimos con una gestión. Con 1 cliente no
se nota; con 20 es un trabajo fijo todas las semanas.

### Lo que NO es una opción, para cerrar la puerta antes de que alguien la abra

⚠️ **Stripe no está "pendiente": no acepta Bolivia como comercio.** Stripe Connect no paga a
cuentas bolivianas. Lety puede usarlo porque **la empresa es de afuera y sólo la tarjeta es
boliviana** — el sentido inverso no existe. Habilitarlo exigiría una LLC en EE.UU. (~USD 500 +
100/año, Form 5472), y rutear cobros bolivianos por ahí ya está descartado por doble carga
fiscal y escasez de dólares. Fuente:
`hermes-content/docs/research/ONIA_PASARELAS_PAGO_MULTITENANT_BOLIVIA_2026.md`.

**El camino ya decidido** es QR Simple de BNB/BCP + webhook de confirmación que activa el
`OrganizationEntitlement` solo, bajo modelo **Facilitador** (ONIA nunca toca la plata del cliente
final). El trámite bancario avanza en paralelo.

### La decisión, y son tres caminos

| | Qué implica |
|---|---|
| **A — seguir sin tarjeta** | Se mantiene el diferenciador y el cobro sigue a mano hasta que el QR + webhook estén vivos. Es lo que pasa hoy si nadie decide nada |
| **B — pedir tarjeta al empezar** | Copia la mecánica de Lety, pero **hoy es imposible**: hace falta la pasarela funcionando primero. No se puede elegir todavía |
| **C — sin tarjeta para entrar, y método de cobro al día 12** | Guarda el diferenciador del arranque y ataca la conversión donde duele. Requiere el QR igual, pero no rompe la promesa del hero |

**Depende de Sergio.** No la toma un loop: cambia lo que promete la superficie de venta.

**Y ojo con la comparación de precios:** Lety Standard son 3.665 Bs/mes, más caro que el plan
Grupo de Onia (2.900 Bs), pero **no compiten de frente** — Lety es infraestructura white-label
para agencias (B2B2B) y el negocio final no le compra. Usar ese número como "somos más baratos"
es comparar cosas distintas.

---

## 11. Cuatro desconocidos escribieron y nadie les contestó (2026-08-31) — decisión de Sergio

Medido contra las dos bases (Chatwoot cuenta 2 + `onia_center.bot_messages`), no contra
un doc. **Cinco desconocidos escribieron al bot entre el 24 y el 29 de agosto.** A cuatro
nunca les contestó nadie: sus mensajes cayeron dentro de la caída de motor del 24 al 28-ago
(cero filas en `bot_messages` para las conversaciones 34, 35, 36 y 37). La causa ya está
auto-curada; lo que queda abierto son las personas.

Tres de los cuatro son alcanzables HOY:

| Quién | Canal | Cuándo | Qué dijo |
|---|---|---|---|
| +591 73232758 | WhatsApp | 25-ago | *"estoy evaluando un sistema de gestión para una clínica odontológica de 4 doctores…"* |
| +591 73021804 | WhatsApp | 28-ago | *"vengo de la web de Onia. Quiero saber si me sirve para mi negocio."* |
| `Saguilera@ds-santacruz.bo` | widget web | 27-ago | "Quiero información" + dejó su correo |
| (sin contacto) | widget web | 24-ago | "hola" — no dejó forma de responder |

**Las tres opciones, cotizadas:**

1. **Sergio les escribe a mano, hoy.** Costo: 0 Bs y ~15 minutos. Es la única que puede
   recuperar al prospecto de la clínica dental de 4 doctores — el lead más calificado que
   el bot recibió nunca. Riesgo: ninguno; disculparse por la demora es normal.
2. **El bot los retoma solo.** Costo: 0 Bs de API, pero hay que construir el barrido de
   reenganche (~medio día) y suena a spam retomar en frío una conversación de hace 6 días.
   Además, a partir del **1-oct-2026** reabrir una ventana de WhatsApp cerrada cuesta
   plantilla aprobada + costo por mensaje.
3. **No hacer nada.** Costo: 0 Bs y los cuatro leads. También borra la evidencia de para
   qué sirve el carril.

**Recomendación: opción 1.** El carril entero existe para que un desconocido sea atendido;
dejar cuatro sin respuesta mientras se construye la pieza catorce es exactamente el error
que el objetivo de la cola quiere evitar. Detalle y evidencia: `hermes-content/docs/cola/chatbot.md`
(ítem 1 de Cerrado, y S7 en Bloqueado).

## 12. ¿De qué org son los inboxes 4 y 5? (2026-08-31) — decisión de Sergio

**Por qué aparece ahora.** Hasta hoy el vínculo org → inbox de Chatwoot sólo se escribía al
dar de alta la organización y **no había forma de corregirlo**: ninguna pantalla lo editaba
y el resto del código devuelve `created:false` si ya hay valor. Eso ya está resuelto en
código (commit `88c1d56` de `onia-platform`: el PATCH de superadmin acepta el inbox, con 409
si otra org lo usa, y la pantalla `/admin/organizations/<id>` ahora tiene input y botón).
Lo que el código **no** puede decidir es a quién apuntar.

**El dato.** Los dos inboxes donde escribió gente de verdad — **4 (Onia Web)** y
**5 (Onia WhatsApp, el +591 75414930)** — no son de ninguna org, así que `/inbox` no puede
mostrar ninguna de las cinco conversaciones de desconocidos. De las cuatro orgs que existen,
la única con inbox es la de QA.

**Las tres opciones, cotizadas:**

1. **`Onia (interna)` se queda con el 5 (WhatsApp).** Costo: 0 Bs, un deploy y dos clicks.
   Es la que cierra el objetivo del carril: el número que la web ya publica pasa a verse en
   `/inbox`. Límite conocido: una org = un inbox, así que la web (4) queda afuera hasta que
   haga falta la tabla de N inboxes por org — que hoy no hace falta.
2. **Una org nueva "Onia Bandeja" que reciba los inboxes.** Costo: 0 Bs y ~10 minutos, pero
   agrega una org fantasma a la base y un usuario más que mantener, para separar lo que hoy
   nadie necesita separado.
3. **No apuntar nada hasta que haya un cliente real.** Costo: 0 Bs — y el carril sigue sin
   poder demostrar que sirve. El día del Embedded Signup (S1) el inbox del cliente nace
   huérfano igual, y ahí la decisión vuelve con un cliente esperando del otro lado.

**Recomendación: opción 1**, y el 4 (web) se deja sin dueño hasta que la limitación moleste.
Es la más barata, es reversible desde la misma pantalla (vaciar el campo desvincula), y es
la única que convierte el objetivo del carril en una captura.

⚠️ **Requiere un deploy del producto**, que por regla es de Sergio. Detalle y estado:
`hermes-content/docs/cola/chatbot.md` (ítem 1 de Ahora, y S8 en Bloqueado).

**2026-08-31 — esta decisión vale MÁS de lo que decía arriba: también destraba las frases de
campaña.** Medido, no supuesto. `campanaExacta` vive dentro de `recepcionistaStep`
(`hermes-content/deploy/vps-ops/bot/recepcionista.mjs:192`), y el modo recepcionista lo enciende
**sólo** `asRecepcionista`, que `withKnowledge` llama **únicamente cuando la fuente es `"db"`** —
o sea, la fila publicada de una **org**, resuelta por `clinic_settings.chatwootInboxId`
(`knowledge.mjs:851`). El archivo del VPS (`/opt/onia/bot/knowledge.json`), que es lo que hoy
atiende el +591 75414930, corre en **modo venta**, donde las campañas ni se miran. Corrido con la
misma frase que la web precarga en todas sus páginas: fuente archivo devuelve `M0_SIN_HORARIOS`
(el saludo genérico), fuente db devuelve `R_CAMPANA` con su respuesta propia. **Consecuencia
práctica:** cargar las campañas a mano en el archivo del VPS **no serviría de nada**; el único
camino es que el inbox 5 sea de una org. La opción 1 no cierra un objetivo, cierra dos.

⚠️ **CORREGIDO el 2026-08-31, más tarde el mismo día: el párrafo de arriba ya no vale, y la
decisión vuelve a valer lo que decía al principio — una cosa, no dos.** El diagnóstico era
correcto pero la conclusión era una limitación del código, no una ley: se arregló en el commit
`994eb42d` de `onia-hermes`. `applyKnowledge` ahora lleva `campanas` a la config de **los dos**
modos, y `bot-engine.mjs` resuelve la frase en el router del modo venta, saliendo por
`composeWithFunnel` — el mismo camino que ya usaban precio y SIAT, que pone la respuesta
**detrás** de la bienvenida en vez de reemplazarla. Eso importa: `R_CAMPANA` es sólo
`{{respuesta_campana}}` y no dispara ningún efecto, así que hacer lo que este párrafo proponía
—mover el número de Onia a modo recepcionista— habría cambiado la única línea que produce
`lead_upsert` por un texto enlatado. Probado con las 5 campañas del documento real: las cinco
contestan lo suyo y las cinco conservan el lead. Suite del bot 626/626.

**Lo que queda de las campañas NO es esta decisión:** es copiar
`hermes-content/docs/chatbot/campanas-onia.knowledge.json` a `/opt/onia/bot/knowledge.json` del
VPS (hoy 904 bytes, sin `campanas`). Es un `scp` con OK de Sergio, anotado como **S9** en
`hermes-content/docs/cola/chatbot.md`, y **no depende de a qué org vaya el inbox 5**. La decisión
9 sigue en pie por su motivo original —que los desconocidos se vean en `/inbox`— y esa sigue
siendo la recomendación: **opción 1**.

🔴 **Corregido el 2026-08-31 (más tarde el mismo día): el párrafo de arriba subestima S9, y
hacerlo tal como dice no enciende nada.** Daba el motor por desplegado. Medido con md5 contra el
VPS, no leyendo el repo: `/opt/onia/bot/bot-engine.mjs` es el commit `3e3841aa`, no `994eb42d` —
le falta exactamente el cambio que hace visibles las campañas en modo venta, y el motor que CORRE
(contenedor `onia-center`, `/tmp/onia-bot/`) tiene **cero apariciones de `campanaExacta`**.
Copiar sólo `knowledge.json` habría dejado las 5 campañas en un archivo que el motor viejo ni
mira: las 4 frases vivas seguirían con el saludo genérico y el ítem se habría dado por cerrado.
**S9 son tres archivos** (`bot-engine.mjs`, `knowledge.mjs`, `knowledge.json`) **más un
reinicio**.
⚠️ **Corregido otra vez el 2026-08-31 (4ª vuelta del carril): son CUATRO.** Se suma
`run-turn.mjs`, que volvió a exportar `LLM_SYSTEM_PROMPT` — sin ese export
`evals/evals.test.mjs` no carga y los 12 evals del bot no corren (llevaban muertos desde
`d334d776`, con la suite reportando "634 verde" porque `node --test` cuenta un módulo que no
carga como un solo test roto). El arreglo no cambia el comportamiento del bot: es el mismo
texto de prompt, exportado en vez de inlineado. Suite del bot **647/647**.
Corrido hoy contra producción, `espejo-check.mjs` sale **1**: DISTINTOS `bot-engine.mjs`,
`bot-engine.test.mjs`, `knowledge.mjs`, `run-turn.mjs`, `run-turn.test.mjs`; FALTAN
`campanas-web.test.mjs`, `espejo-check.mjs`, `espejo-check.test.mjs`, `recepcionista.test.mjs`.
**Sigue sin cambiar la decisión 9**: sólo corrige la lista de lo que hay que copiar. Queda verificable en un comando, sin tocar el VPS:
`node hermes-content/deploy/vps-ops/bot/espejo-check.mjs` — sale 0 si el código del VPS es el del
espejo, 1 nombrando los archivos si no. Esto **no cambia la decisión 9**, que sigue siendo
opción 1: sólo corrige lo que hay que hacer cuando se ejecute S9.

🔴 **Corregido otra vez el 2026-08-31 (9ª vuelta) — y ahora la instrucción vieja no sólo "no
enciende nada": EMPEORA producción.** El código ya viajó (`espejo-check.mjs` salió 0 el 31-ago),
así que S9 había quedado escrito como "un solo archivo de datos". Desde hoy eso es falso: el
documento trae la campaña de **prefijo** del CTA de `/v1/empezar` (`prefijo: true`), y el esquema
del validador **rechaza claves desconocidas**. `parseKnowledge` devuelve `data: null` cuando el
veredicto no es `ok`, o sea que un documento rechazado **no carga a medias: no carga nada**.
Medido con el `knowledge.mjs` que HOY corre en el VPS, bajado por `scp` (41.423 bytes, cero
`prefijo`), corriendo su propio `validateKnowledge` contra el documento nuevo:
`ok=false`, `["campanas[4].prefijo: clave desconocida (el esquema no la acepta)"]`.
Copiando sólo el JSON no quedan 5 campañas de 6 — quedan **cero**, y encima se pierden la FAQ
`siat` y el horario que hoy sí están vivos en el archivo del número.
**S9 hoy = `knowledge.mjs` + `recepcionista.mjs` + el documento a `/opt/onia/bot/knowledge.json`,
y reiniciar.** Verificable antes y después sin tocar nada:
`node hermes-content/deploy/vps-ops/bot/espejo-check.mjs` (hoy sale 1 nombrando esos dos; después
del `scp` tiene que salir 0). **La decisión 9 no cambia**: sigue siendo opción 1, esto sólo
corrige la lista y su orden.

⚠️ **Recontado el 2026-09-02: aparece el dato que a la opción 1 le faltaba para "hasta que la
limitación moleste".** El inbox 4 pasó de 3 a **6** conversaciones reales (`docker exec` contra
la base de Chatwoot en el propio VPS), dos nuevas del 01-sep ("tengo una ferretería" y "clínica
dental en Santa Cruz, somos 4 personas"). **Cinco de las seis no dejaron teléfono ni correo**:
sólo se les puede contestar desde el widget mismo, así que un inbox sin dueño no es una demora,
es una pérdida. El límite de una org = un inbox sigue siendo real
(`clinic_settings.chatwootInboxId` es `Int?` único). Anotado como **S14** en
`hermes-content/docs/cola/chatbot.md`, sin tocar la decisión: sigue esperando que Sergio elija
entre la opción 2 (org "Onia Bandeja", ~10 min) o extender el schema a N inboxes.

## 13. La marca de Chatwoot se está filtrando por tres puertas sin vigilancia (2026-08-31) — acción de Sergio

**Por qué aparece.** La decisión 1 dice que Chatwoot queda como infraestructura invisible y
que eso "ya está logrado". Es cierto en la cara que ve el cliente, y falso en el fuente.

**Lo medido, contra el contenedor y contra la URL pública.** El job interno
`Internal::ReconcilePlanConfigService` restaura **diez** `installation_configs` desde
`enterprise/config/premium_installation_config.yml`. El cron que las defiende
(`/root/bin/chatwoot-brand-onia.sh`, cada hora al :17) re-aplicaba **tres**. De las siete
descubiertas, tres ya se perdieron: `BRAND_URL`, `TERMS_URL` y `PRIVACY_URL` apuntan a
`www.chatwoot.com` desde el **16-ago**, y salen en texto plano en el HTML de
`https://chat.onia.com.bo/app/login`, porque el front embebe ahí su objeto de config.
Los tres `LOGO` no los defendía nadie: sobrevivían por suerte.

**Lo que NO está roto**, y se dice porque es la mitad que importa: el login renderiza el logo
`onia`, y el widget muestra al pie "Desarrollado por Onia" con link a `onia.com.bo`. MIRADO.

**Las dos opciones, cotizadas:**

1. **Aplicar el script ya ampliado.** Costo: 0 Bs y dos comandos — `scp` de
   `hermes-content/deploy/vps-ops/chatwoot-brand-onia.sh` a `/root/bin/` y una corrida. Cubre
   las nueve claves de marca, trae un modo `--check` que no escribe, y arregla un `| tail -1`
   que se comía la salida (por eso el log nunca pudo avisar de una reversión). Ya probado
   contra producción en sólo-lectura: `REVERTIDAS 3/9`, sin escribir nada. Reversible: el
   script viejo está en git.
2. **Dejarlo.** Costo: 0 Bs. Nadie se ha quejado en quince días y no se ve renderizado. El
   riesgo es el del 18-ago: cuando el reconcile vuelva a atacar, las seis que hoy están bien
   sólo tienen tres defendidas, y el pie del widget es una de las que **sí** defiende — pero
   los logos no.

**Recomendación: opción 1.** Es el mismo mecanismo que ya se aprobó y ya corre; lo único que
cambia es que cubra todo lo que el reconcile toca en vez de un tercio. Anotado como **S10** en
`hermes-content/docs/cola/chatbot.md`.

---

## 14. ~~En la bandeja, lo que dice el bot aparece firmado "Vos"~~ — RESUELTO, no hay decisión (2026-08-31)

> 🔴 **CORREGIDO el 2026-08-31: esta sección diagnosticó mal y mandaba a Sergio a tocar un bot
> vivo para nada.** El bot **ya postea como el agente 3 ("Onia Bot") desde el 18-ago** y la
> bandeja **ya rotula "Tu asistente"**. No hay opción que elegir: la 1 ya está aplicada.
>
> **Dónde falló la medición, que es lo que vale.** Abajo dice *"de los mensajes salientes de
> las conversaciones 11, 35 y 37, los 8 tienen `sender_id = 2`"*. Es **cierto** y **no prueba
> lo que se le hizo probar**: los 8 son todos de la conv 11 y van del **6-ago al 15-ago** —
> las convs 35 y 37 aportan **cero** salientes. Se juzgó el comportamiento de hoy con una
> conversación cuyo último mensaje es anterior al día del cambio. Lo mismo el síntoma
> "MIRADO": la conv 11 sí se pinta "Vos" y va a seguir así para siempre, porque esos mensajes
> de verdad los posteó la cuenta 2.
>
> **El estado real, medido en producción** (base de Chatwoot + el env del proceso que CORRE —
> `/proc/<pid>/environ`, no `docker exec printenv`, que arranca un proceso nuevo con el env
> base del contenedor y no el del `docker exec -d` que levantó el bot):
> `CHATWOOT_BOT_AGENT_ID=3` en el proceso y persistido en `/opt/onia/bot/webhook.env`;
> **13 salientes con `sender_id = 3` del 18-ago al 31-ago**; `CHATWOOT_BOT_USER_ID` sin setear
> en `onia-platform`, o sea el default **3**. Bot postea 3, bandeja busca 3 ⇒ "Tu asistente".
>
> ⚠️ **Lo único que sigue vivo de esta sección** es la trampa de los defaults **distintos**:
> el bot cae a **2** (`webhook-server.sh:149`) y la plataforma a **3**. Si alguien borra la
> línea de `webhook.env`, la bandeja se re-rotula "Vos" en silencio y se apaga la detección de
> traspaso. **No se cambió el fallback a 3**: toca un servicio vivo (deploy ⇒ Sergio) y el
> riesgo del inbox 3 de más abajo sigue sin verificar.
>
> Detalle completo y la prueba en `hermes-content/docs/cola/chatbot.md`, § "Cerrado".
> Lo que sigue es el texto original, que se deja como historia de cómo se midió mal.


**El síntoma, MIRADO.** Se abrió `/inbox` con la sesión del dueño y se leyó la conversación
del +591 71606892: **todos** los mensajes salientes están rotulados **"Vos"**, incluidos los
que escribió el bot solo (los recordatorios de la demo, la insistencia, el aviso técnico). El
dueño no tiene forma de saber qué dijo su asistente y qué dijo él.

**La causa, medida en la base de Chatwoot y en el entorno de producción — no leída del código.**

- El adapter postea con el agente `CHATWOOT_BOT_AGENT_ID`, **y si no está seteado cae al 2**
  (`/opt/onia/bot/webhook-server.sh:149`). No está seteado: de los mensajes salientes de las
  conversaciones 11, 35 y 37, **los 8 tienen `sender_id = 2`** y ninguno el 3.
- El agente 2 es `OnIA <oninteligenciaartificial@gmail.com>` — la cuenta de Sergio. El agente
  **3 es "Onia Bot"** (`business+bot@onia.com.bo`).
- La bandeja clasifica por id: `bot` si el remitente es `CHATWOOT_BOT_USER_ID` (default **3**,
  `lib/chatbot/bandeja.ts:119`), y `negocio` = "Vos" en cualquier otro caso. En producción esa
  variable **no está definida** (`docker inspect onia-platform` → sólo 4 variables `CHATWOOT_`,
  y no es una de ellas). Bot postea como 2, la bandeja busca 3: todo cae en "Vos".

**Lo que YA está listo y nadie encendió** — es el patrón "construido y apagado" otra vez: el
agente 3 **tiene su access token** (creado el 11-ago) y **es miembro de los inboxes 4, 5 y 7**.
El propio motor lo avisa desde adentro: `usage-run.mjs:218` dice que "sin
`CHATWOOT_BOT_AGENT_ID` configurado el adapter no puede distinguir al humano del bot".

⚠️ **El detalle que hay que mirar antes de apretar:** el agente 3 **no** es miembro del
**inbox 3**; ahí sólo está el 2. Si algún cliente vive en ese inbox, el bot dejaría de poder
postear. Hoy el inbox 3 no es el `chatwootInboxId` de ninguna org, así que no atiende a nadie
— pero se verifica antes, no después.

**Las dos opciones, cotizadas:**

1. **Setear `CHATWOOT_BOT_AGENT_ID=3` en el servicio del bot del VPS** y recargarlo. Costo:
   0 Bs, una variable. Efecto: el bot pasa a firmar como "Onia Bot", la bandeja lo rotula
   **"Tu asistente"** en vez de "Vos", y el traspaso ("cuando contestás vos, tu asistente se
   hace a un lado") por fin se puede ver en pantalla. Reversible borrando la variable.
   Riesgo: el inbox 3, arriba.
2. **Dejarlo.** Costo: 0 Bs. El dueño sigue sin poder distinguir su voz de la del bot en su
   propia bandeja — que es justo lo que la pantalla promete al pie de cada conversación.

**Recomendación: opción 1.** Todo lo caro (usuario, token, membresías) ya existe desde el
11-ago; falta la variable. Anotado como **S11** en `hermes-content/docs/cola/chatbot.md`.

---

## 15. ~~El espejo del bot se desincroniza solo con un `git checkout`~~ — CERRADO, no hay decisión (2026-09-01)

**El síntoma, encontrado por las malas.** Después de mutar y restaurar
`hermes-content/deploy/vps-ops/bot/recepcionista.mjs` con `git checkout --`,
`espejo-check.mjs` lo reportó **DISTINTOS** contra el VPS. `git status --porcelain` daba
**vacío**: git no veía un solo cambio, y el gate de drift estaba rojo.

**La causa, medida — no leída.** `core.autocrlf=true` y **no hay `.gitattributes`** en
`onia-hermes`. Git guarda el blob en LF y lo materializa en CRLF al hacer checkout:

| | bytes |
|---|---|
| `/opt/onia/bot/recepcionista.mjs` (lo que corre) | **14110** |
| en disco, antes del checkout | **14110** |
| en disco, después del `git checkout --` | **14375** (+265, una por línea) |

Contenido idéntico: `diff` normalizando `\r` contra el archivo del VPS sale **vacío**.

**Por qué importa acá y no en otro carril.** `espejo-check.mjs` compara **md5 de bytes**, y
tiene que hacerlo: en un `.sh` un CRLF no es cosmético — `#!/bin/bash\r` no arranca. O sea que
el gate **no puede perdonar** el line ending, y entonces cualquiera que haga `git checkout`
sobre el espejo fabrica un "deploy pendiente" que nadie pidió. Es el molde exacto del fantasma
que este carril mide: un rojo que no corresponde a ningún cambio se termina apagando, o
"arreglando" con un deploy inútil.

⚠️ **El espejo hoy es una MEZCLA, y eso es lo que encarece el arreglo.** No está todo en LF:
`knowledge.mjs` es LF en disco y en git, mientras `guardrails.mjs` (+130 bytes) e `intents.mjs`
(+754) son CRLF de los **dos** lados. Un `.gitattributes` con `eol=lf` los renormalizaría a
todos y desincronizaría contra el VPS todos los que hoy coinciden en CRLF — el gate quedaría
rojo hasta un redeploy del directorio entero.

**Las tres opciones, cotizadas:**

1. **`.gitattributes` con `* text eol=lf` en el espejo + `scp` del directorio entero al VPS.**
   Costo: 0 Bs, un commit de renormalización (~60 archivos, sin cambio de contenido) y **un
   deploy del bot**. Efecto: los dos lados quedan en LF para siempre y `git checkout` deja de
   mentir. Es la única que cierra la clase entera. Riesgo: el commit toca 60 archivos, así que
   el diff de esa vuelta no sirve para revisar nada más — conviene que vaya solo.
2. **Dejar el repo como está y parchear a mano cuando pase** (`perl -pi -e 's/\r\n/\n/g'`
   sobre el archivo tocado). Costo: 0 Bs, 0 deploy. Es lo que se hizo esta vuelta. Efecto: cada
   vuelta futura que haga `git checkout` sobre el espejo vuelve a ver el gate rojo y tiene que
   acordarse de esto. Depende de la memoria, que es justo lo que falla.
3. **Que `espejo-check.mjs` compare normalizando `\r` sólo en `.mjs`** (y siga byte-exacto en
   `.sh`, donde el CRLF sí rompe). Costo: 0 Bs, 0 deploy, ~5 líneas. Efecto: el gate deja de
   dar rojos falsos sin tocar 60 archivos. **Pero deja los dos lados distintos de verdad**, y
   el día que haga falta un `scp` selectivo por md5, el md5 sigue sin coincidir.

✅ **La opción 3 YA SE EJECUTÓ (2026-08-31), y con eso el ruido se terminó: lo que queda en
esta sección es sólo la opción 1.** `espejo-check.mjs` ahora hashea el `.mjs` sin el `
` de
los dos lados — local con `Buffer.filter`, remoto con `tr -d` (y no `sed`, que agrega un salto
final si el archivo no lo tenía: sin esa simetría exacta los dos hashes no comparan). El `.sh`
sigue byte-exacto, porque ahí `#!/bin/bash
` no arranca.
**Probado contra producción, no con un fixture:** se pasó `guardrails.mjs` a LF (5636 → 5506
bytes, md5 crudo distinto) con el VPS en CRLF, y el gate **no lo nombró**. Antes de esto ese
era un rojo falso. Los tres rojos que quedan son honestos: `recepcionista.test.mjs` (0 bytes
en el VPS, drift real de S9) y los dos archivos de este mismo cambio. 4 tests nuevos, uno de
ellos el guardia de que normalizar **no** tapa el drift real; suite del bot **658/658**.

**Lo que sigue siendo decisión de Sergio: la opción 1.** La 3 baja el ruido pero, como decía
su propia cotización, **deja los dos lados distintos de verdad** — el día que haga falta un
`scp` selectivo por md5, el md5 crudo sigue sin coincidir. Sólo el `.gitattributes` + redeploy
hace que el espejo sea un espejo.

**Recomendación: opción 1, y sola en su commit** — es la única que hace que el espejo sea de
verdad un espejo. Si no hay ventana para un deploy del bot, la 3 es el paliativo honesto: baja
el ruido sin fingir que los archivos son iguales. Anotado en la sección "Después" de
`hermes-content/docs/cola/chatbot.md`.

✅ **CERRADO el 2026-09-01: la opción 1 se hizo, y SIN el redeploy que la encarecía — ya no
hay nada que decidir acá.** La cotización de arriba daba por atado el `.gitattributes` a un
`scp` del directorio entero, porque renormalizar habría desincronizado contra el VPS los
archivos que hoy coinciden en CRLF de los dos lados. **Eso dejó de ser cierto con la opción 3:**
desde que `espejo-check.mjs` hashea los `.mjs` sin el `\r` de los dos lados, forzar LF en el
repo **no puede** mover un solo hash. Se midió antes de tocar nada, y después.

**Lo que se hizo:** `hermes-content/deploy/vps-ops/.gitattributes` suma `bot/*.mjs text eol=lf`
al `*.sh text eol=lf` que ya tenía — alcance exacto del espejo, sin arrastrar los 40+ `.mjs`
sueltos de `vps-ops/` ni `evals/` (que el gate tampoco mira: `md5Local` no baja de `maxdepth 1`).
Los `.sh` siguen forzados a LF por el motivo de siempre.

**Medido con un checkout real:** `guardrails.mjs` borrado y restaurado con `git checkout --`
sale ahora en **5506 bytes con 0 `\r`**; antes de la política el mismo checkout lo dejaba en
**5636**. Renormalizados además los **21 `.mjs` que estaban en CRLF en disco** con el blob en
LF — coincidían con el VPS por casualidad. Un test nuevo en
`hermes-content/deploy/vps-ops/bot/espejo-check.test.mjs` corre `git check-attr eol` y se pone
rojo si alguien deja el directorio sin política; suite del bot **683/683**.

**Y no agregó un rojo al gate**, que era la única prueba de que no desincronizaba: los 8 que
`espejo-check.mjs` nombra hoy son drift honesto de **S9** —verificado abriendo los archivos
contra el VPS, no creyéndole al hash: `recepcionista.mjs` y `knowledge.mjs` difieren por el
opt-in `prefijo` del commit `ba970f4a`, contenido y no fin de línea.

---

## 16. Treinta y un commits verificados ya están en `main` y NINGUNO está desplegado (2026-08-31) — decisión de Sergio

> ⚠️ **Añadido el 2026-09-02 por el integrador — antes de decidir CUÁNDO desplegar, hay que
> saber que hasta hoy el deploy ni siquiera arrancaba.** `web-factory/pnpm-lock.yaml` estaba
> desincronizado con `web-factory/apps/onia-platform/package.json`, y los dos scripts de deploy
> instalan con `pnpm install --frozen-lockfile` (`scripts/deploy-onia-landing.sh:24`,
> `scripts/deploy-onia-center.sh:31`) — un modo que **falla** si el lockfile no coincide.
> Reproducido con el lockfile de `main`: `ERR_PNPM_OUTDATED_LOCKFILE`, *"1 dependencies were
> added: vitest@^4.1.8"*, exit 1. **El deploy de `onia.com.bo` moría en la línea 24, antes de
> compilar una sola línea.** Ya está arreglado y verificado en `main` (`9d57be50`): con el
> lockfile sincronizado, `pnpm install --frozen-lockfile` sale exit 0.
> **Lo que cambia para la decisión:** nada de esta lista se movía aunque Sergio hubiera dicho
> "desplegá" — habría fallado en el install y parecido un problema del servidor. Ahora sí
> depende sólo de la decisión.

**Qué pasó.** Dos carriles trabajaron días y su trabajo nunca llegó a `main`: `chatbot` estaba
**245 commits atrás** y `web-factory` **251**. Lo único que le entraba a `main` eran auto-syncs.
Mientras tanto la definición de hecho de este proyecto dice *"encendido en producción y
verificado ahí"* — o sea que 31 commits verdes estaban valiendo cero.

Integrados hoy en `main` (`f3061524` chatbot, `5d47f465` web-factory, `ac57e2b4` el cableado de
los gates). **Los tres gates pasaron sobre `main` ya mergeada**: `tsc --noEmit` 0 errores,
`vitest run` 277/277, `npm run lint` 0 errores, y la suite raíz 728 tests en verde.

**Ahora están en el repo y NO en producción.** Lo que sigue no se arregló solo por mergear:

| Qué arregla | Dónde vive el arreglo | Qué falta para que valga |
|---|---|---|
| **Los 12 evals estaban muertos y la suite los contaba como "634 verde"** | `bot/evals-contrato.test.mjs` | nada: es un gate, ya corre |
| **`recepcionista.test.mjs` estaba en 0 bytes** y sumaba silencio a los verdes | `bot/recepcionista.test.mjs` | nada: ya corre |
| **La marca de Onia sobre Chatwoot lleva 15 días revertida** en `chat.onia.com.bo/app/login` | `chatwoot-marca-publica.mjs` + `chatwoot-brand-onia.sh` | **correr el script contra el VPS.** Hasta entonces la pantalla pública sigue diciendo `www.chatwoot.com` |
| **El CTA de `/v1/empezar` no podía tener campaña nunca** — habría dejado **cero campañas** en producción | `bot/bot-engine.mjs`, `bot/run-turn.mjs` | **deploy del motor al VPS** |
| **Las frases de campaña no las podía ver el número de Onia** | `docs/chatbot/campanas-onia.knowledge.json`, `bot/knowledge.mjs` | **deploy del motor al VPS** |
| El gate del espejo daba rojo por un CRLF (un rojo que se paga con un deploy inútil) | `bot/espejo-check.mjs` | nada, pero ver la sección 15 |
| **La suite E2E de web-factory llevaba roja desde W7 sin que nadie lo viera** | `tests/e2e/*`, `playwright.config.ts` | nada: es un gate |
| El KPI spark seguía estirado y `pending` no llegaba nunca al template | `packages/templates/src/dashboard.ts` | **regenerar los sitios** que usan el template dashboard |
| Bloques nuevos: medidor radial, estados carga/error/vacío, cinta infinita, bandas por feature, statement a pantalla completa | `packages/blocks/src/*` | **regenerar los sitios** que los quieran |
| Cuatro rubros se recetaban de memoria y dos reglas del playbook estaban mal; la skill mandaba correr un script inexistente | `data/references/*`, `docs/LOOP_COLA.md` | nada: son docs |
| **El bot AGENDA: manda el link de la agenda de su org en vez de derivar** (mergeado el 2026-09-01) | `bot/recepcionista.mjs`, `bot/intents.mjs`, `bot/config.mjs`, `bot/knowledge.mjs` | **deploy del motor al VPS** — el mismo deploy (a) de abajo. La agenda ya está viva y verificada MIRÁNDOLA (`/book/zz-qa-clinica-chatbot-9k651` muestra el asistente de 4 pasos con profesionales reales); lo que falta es el motor que mande el link |
| La tarjeta de clínica se movía aunque el visitante pidiera menos movimiento; se borró la primitiva `.wf-hover-lift` que nadie usaba (mergeado el 2026-09-01) | `packages/templates/src/clinic-css.ts`, `packages/blocks/src/motion.ts` | **regenerar los sitios** que usen el template de clínica |

**La decisión que queda.** Desplegar no lo decide un carril de integración. Los dos deploys que
mueven la aguja son distintos y se pueden hacer por separado:

- ~~**(a) El motor del bot al VPS.**~~ ⚠️ **VENCIDA — el deploy se hizo. Medido en vivo el
  2026-09-03 05:30 UTC, cuatro horas después de la nota de abajo. No le pidan a Sergio esta
  decisión.** Ver **F** en *Cerradas*. Enciende las campañas, el CTA de `/v1/empezar` **y ahora
  también que el bot agende** (mergeado el 2026-09-01). Sin esto, un desconocido que llega desde
  la web sigue recibiendo la respuesta genérica, y una cita sigue derivándose a mano — que es
  justo lo que `pricing.ts` cobra como resuelto.

  > 🔴 **Medido en vivo el 2026-09-03 01:40 UTC por el integrador, y ahora incluye el arreglo más
  > caro de la semana.** Esta opción (a) dejó de ser "campañas y agenda": **el bot que atiende
  > leads AHORA MISMO no tiene el fix de que se moría al llegar el mensaje.**
  >
  > **Dónde corre de verdad, que no es donde parecía.** El proceso es
  > `node /tmp/onia-bot/webhook-server.mjs` (PID 869520, arrancado 00:04:04Z) y **corre DENTRO del
  > contenedor `onia-center`**, no en el host: `/tmp/onia-bot/` está vacío visto desde el VPS y el
  > cwd del proceso es `/app/apps/site`. La cadena de deploy es
  > `repo → /opt/onia/bot/ (staging) → /tmp/onia-bot/ del contenedor`.
  >
  > **La prueba de que está atrás**, por `md5sum`, no por fecha:
  >
  > | archivo | vivo (contenedor) | `main` de hoy |
  > |---|---|---|
  > | `bot-engine.mjs` | `afe24f58…` | `ab0181ed…` |
  > | `config.mjs` | `cfabb292…` | `35dc9d8f…` |
  > | `persistence.mjs` | `555ff62c…` | `ada07d4d…` |
  > | `knowledge.onia.json` | **no existe** | presente |
  > | `rescate-run.mjs` | **no existe** | presente |
  >
  > `/opt/onia/bot/bot-engine.mjs` da el **mismo** `afe24f58…` que la copia viva: el staging
  > también está atrás, así que no alcanza con reiniciar el contenedor.
  >
  > **Cuánto hay parado:** la copia viva es del **2026-09-02 17:19**; desde esa marca `main`
  > acumuló **10 commits que tocan `bot/`**, incluidos los 4 mergeados hoy (`51057fb9e`,
  > `3c2f4ef89`, `f22f47bcb` y su merge). El más caro es **`3c2f4ef89`**: el bot no se callaba,
  > estaba **muerto** cuando llegaba el mensaje, y Chatwoot no reintenta — o sea que hoy un lead
  > real todavía puede escribir al vacío.
  >
  > ⚠️ **Y hay un segundo motivo, independiente de qué versión sea la buena:** el código vivo
  > está en **`/tmp` de un contenedor**. Cuando `onia-center` reinicia, se lo lleva puesto — es
  > exactamente el reinicio de las 00:03:32Z que `3c2f4ef89` diagnosticó. El `webhook-watchdog.sh`
  > (cron cada 2 min) lo vuelve a levantar, pero **desde el staging viejo**.
  >
  > **Lo que este carril NO puede hacer:** el deploy. Sigue siendo tuyo. Lo que sí queda listo es
  > la cuenta: son 10 commits, el instalador es `/opt/onia/bot/webhook-server.sh knowledge` para
  > el conocimiento, y el motor se copia por la misma cadena de arriba.
- ~~**(b) El script de marca de Chatwoot.** Cinco minutos, sin riesgo de motor, y saca el logo
  ajeno de una pantalla que ven los clientes desde el 16-ago.~~ ⚠️ **VENCIDA — verificada en vivo
  el 2026-09-02. No le pidan a Sergio esta decisión: ya está tomada y automatizada.** El script
  corre solo cada hora (`17 * * * * /root/bin/chatwoot-brand-onia.sh` en el crontab del VPS, con
  corridas limpias hasta las 06:17 UTC de hoy), y `chat.onia.com.bo/app/login` sirve hoy
  `"INSTALLATION_NAME":"Onia"` y `"WIDGET_BRAND_URL":"https://onia.com.bo"`. La pantalla pública
  **ya no se presenta como Chatwoot**.

  Lo que queda es mucho más chico y **no es lo que decía la fila**: sobreviven dos claves de URL
  sin pisar, `TERMS_URL` y `BRAND_URL`, las dos apuntando a `https://www.chatwoot.com`. Es un
  ítem de cola del carril chatbot, no una decisión de Sergio.

  Se deja tachada y no borrada porque el resto de esta sección sigue vigente: **(a) el deploy del
  motor del bot no se hizo**, y la tabla de arriba sigue midiendo bien lo que ese deploy enciende.

Se pueden hacer los dos, uno, o ninguno — pero mientras no se haga, este radar dice la verdad:
está en el repo, no está encendido.

**Un hallazgo colateral, para que no muerda después:** `web-factory/pnpm-lock.yaml` está
**desactualizado en `main` desde `470a2140`** — `apps/dental-premium/package.json` declara nueve
dependencias que el lockfile no tiene, así que `pnpm install --frozen-lockfile` (lo que corre un
CI) **falla**. No se tocó acá porque regenerar un lockfile no es trabajo de un merge, pero es una
bomba con temporizador para el primer pipeline que instale en limpio.

## 24. ~~`/` y `/empezar` no tienen dueño~~ — RESUELTO 2026-09-02, no hay decisión

> ⚠️ **Era la SEGUNDA sección numerada `16` de este archivo, y por eso quedó fuera de secuencia.**
> Renumerada a 24 el 2026-09-02. El `16` legítimo es el de arriba (*"Treinta y un commits… NINGUNO
> está desplegado"*, creado en `d1826f48` el 08-31 23:09); esta nació después, en `84ad6628`, y
> reusó el número. **El choque no era cosmético: las DOS tenían una opción `(a)`**, así que las
> tres citas de *"punto 16(a)"* / *"la §16"* que viven en este mismo archivo (grep `16(a)`)
> resolvían a dos cosas distintas — el deploy del motor del bot, o "que `onia-cola` adopte la
> home". Se renumeró ésta y no aquélla porque aquélla estaba primero, **sigue abierta**, y es la
> que se lleva las tres citas. Se deja acá, en su lugar cronológico, en vez de moverla al final:
> mover el texto perdería el contexto de las secciones que la rodean.

La home y la página de acceso viven en `web-factory/apps/onia-platform/`: **ninguna cola las
nombra**, y la zona de `web-factory-dev-loop` las excluye explícitamente. Son la puerta de
entrada del producto y hoy sus defectos caen en `COLA.md` por descarte, no porque ese carril
sea el dueño. Ya hay uno abierto ahí (la maqueta cortada de "Elegís tu rubro").

Las dos opciones cuestan lo mismo — una línea en un archivo, cero bolivianos:

- **a)** `onia-cola` las adopta: se agrega esa ruta a su zona en `COLA.md`. Es donde ya caen
  hoy, y el carril ya toca `app.onia.com.bo`.
- **b)** `web-factory-dev-loop` levanta su prohibición para esa carpeta y se las queda. Es el
  carril que sabe de superficies web, pero hoy tiene la puerta cerrada por decisión previa.

**Resuelto el 2026-09-02, con las dos preguntas que dejó abiertas contestadas — no por
elección entre (a)/(b), sino porque el propio loop `web-venta` ya nació dueño de esta zona**
(su prompt: "Vos sos ese dueño", zona `web-factory/apps/onia-platform/**`). Y la duda de fondo
—¿el redeploy del 2026-09-01 con `/register` como CTA era legítimo o el bug de agosto había
vuelto?— también se cerró: es legítimo. `ONIA_ALTA_AUTOMATICA=abierta` se reabrió en
`onia-platform` el 29-ago, el sitio se puso al día con `alta.ts` (commit `37ab9e92`,
2026-09-01) y hoy (verificado contra el contenedor `onia-landing`, no `main`) las dos páginas
dicen "Creá tu cuenta" en consistencia total — cero "Pedí tu acceso" residual. Detalle en
`COLA.md`, el ítem que cerraba esa duda.
**Lo que sigue siendo cierto y no cambia con esto:** `app.onia.com.bo/register` sigue siendo
del repo `onia-platform`, otro carril (`onia-cola`) — este carril no toca ese flujo, sólo lo
enlaza.

# Para decidir — al abrir el 1 de septiembre

Diez cosas esperan a Sergio — la 2 se resolvió el 1-sep y queda tachada. Están ordenadas por lo
que desbloquean, no por urgencia
aparente. Cada una tiene su detalle arriba en este archivo o en
`hermes-content/docs/handoff/claude-git-status-935f47.md`.

**1. ~~¿Publicamos `onia.com.bo`?~~ ✅ CERRADO — ya está publicado.** Ver "Cerradas → A"
arriba: build `qinaKbiNJ_V9rh9loH5MO` del 2026-09-01 21:42 UTC, sin la promesa vieja.

<details><summary>Texto original (historia de cómo se venía posponiendo)</summary>

**Ya no son 77 commits: son OCHO.**

⚠️ **Corregido el 2026-09-01 midiendo, no leyendo.** Esta decisión decía "77 commits" y esa
cifra es de antes del despliegue a mano del 24-ago. Lo vivo hoy es el build
`Ega1b2zc6I30Rblyyl2Fv`, del **24-ago 21:01 La Paz** (`/opt/onia-landing/runtime-next` por SSH;
el mismo id aparece en el HTML servido). Desde ese build,
`git log origin/main --since=2026-08-24 -- web-factory/apps/onia-platform` da **8 commits**, y
son todos de copy y precio de la landing. Mirarlos es media hora, no un día — que era justo la
razón por la que esta decisión se venía posponiendo.

Lo que está publicado y no debería, medido con `curl` sobre las páginas vivas:
**/precios sigue cobrando "Inventario avanzado — Bs 180"**, que Sergio sacó de la oferta el
27-ago y que `eec7d0f3` ya borró en `main`; y **el hero aprobado el 1-sep no está** — el h1 vivo
sigue siendo el de la v3.

Publicar: `workflow_dispatch` con `swap=false` (build en ubuntu, no toca producción) y, si sale
verde, `swap=true`. ⚠️ **El paso del landing sigue colgado del de center**
(`.github/workflows/deploy-onia-center.yml:78`, mismo job, sin `if:`), y center.onia.com.bo está
muerto a propósito desde el 29-ago (404 medido). PR #30 arregló el lockfile, **no** desacopló los
dos pasos: si el de center vuelve a morir, el sitio de venta vuelve a no publicarse.

</details>

**2. ✅ RESUELTA — el hero es `resultado`.** Sergio eligió el 2026-09-01 (*"esta bien el hero…
pero esta bien usa ese"*) y ya está mergeado en `main` (PR #35, `c8dfe249`). Lo único que falta
es la decisión 1: **está en `main` y no en el sitio**.

**3. ¿La prueba de 14 días pide tarjeta?**
Ver la sección propia arriba. Hoy Onia da 14 días sin tarjeta y **cobra a mano al día 14**;
Lety pide tarjeta y auto-cobra al día 7. El camino B (copiar a Lety) **hoy no es elegible**:
necesita la pasarela viva.

**4. ¿Aplico las 8 `GOTRUE_MAILER_*` al contenedor?**
Las plantillas en castellano ya están en `master` y probadas (200 con el placeholder adentro).
Falta encenderlas. Exige recrear `supabase-auth2` **conservando el alias de red `auth`** o el
stack se cae. Runbook en `onia-platform/docs/CORREOS_AUTH_MARCA.md`.

**5. ¿La máquina se apaga de noche o queda trabajando?**
Apagada, **los loops no corren** (viven en la app de Windows). Los 18 crons del VPS sí siguen.

**6. ¿Qué hacemos con ONIA Center?**
El panel está bajado a propósito desde el 29-ago y su deploy ya pasó a manual. Falta decidir si
se saca el paso del workflow. ⚠️ **El contenedor NO se apaga**: el auditor diario lo usa como
runtime. Y sus **seis memorias** quedan marcadas como sospechosas hasta medir qué sigue vivo.

**7. 🔴 SIETE personas escribieron y nadie les contestó. Es lo único que CADUCA.**

⚠️ **Corregido el 2026-09-01 — acá decían tres, y son siete.** Al mergear apareció el §11 de
este mismo archivo, medido contra las dos bases: **cuatro desconocidos más le escribieron al
bot entre el 24 y el 29-ago** y sus mensajes cayeron dentro de la caída de motor del 24 al 28.

- **Por el bot** (§11): +591 73232758 — *"estoy evaluando un sistema de gestión para una
  clínica odontológica de 4 doctores…"* · +591 73021804 — *"vengo de la web de Onia"* ·
  `Saguilera@ds-santacruz.bo` — dejó su correo · y uno sin forma de contacto.
- **Por el formulario de acceso**: Máximo (21-ago), Leonardo (23-ago), Edwin (28-ago).

El primero es **el lead más calificado que el bot recibió nunca** y lleva una semana esperando.
El peligro de la versión vieja de este punto era justamente ése: decía "tres" y hacía parecer
que el más valioso no existía.

**8. Los worktrees.**
19 vivos; el disco llegó al 100% y frenó el trabajo. Se liberó a 12 GB, pero un worktree con
dependencias pesa 6,4 GB y se vuelve a llenar solo. Hay que decidir cuáles se archivan.
⚠️ **Sigue vivo el 2026-09-01**: 24 worktrees y `df` marca **99%** (5,1 GB libres de 465 GB).
Crear un worktree normal del repo **falla con "No space left on device"** — medido hoy al
intentarlo; hubo que armarlo con `sparse-checkout`. El disco ya no es una molestia: bloquea.

**9. ~~¿El chatbot AGENDA?~~ ✅ CERRADO — ya se mergeó y la decisión ya está tomada.** Ver
"Cerradas → B" arriba: commit `fbe106be` (2026-09-01 20:28), y el propio mensaje del merge
elige "no tocar el catálogo hasta el deploy" — no queda pregunta para vos, salvo el deploy
al VPS que ya cubre el punto 16(a).

<details><summary>Texto original</summary>

La rama que lo hace está lista y no se puede mergear sin tu decisión.

`fix/bot-manda-link-de-reserva` (1 commit, `ad16b8ce`, con sus tests) hace que el recepcionista
mande el link de la agenda pública de SU organización (`app.onia.com.bo/book/<slug>`) en vez de
derivar toda intención de cita a un humano. Está bien hecho: fail-closed — sin slug limpio vuelve
a derivar exactamente como antes.

**Medido en vivo hoy (2026-09-01), no deducido:**
- La ruta existe y responde: `app/(public)/book/[orgSlug]/page.tsx`, y `GET /book` → 200.
- Un slug inexistente NO explota: renderiza "no encontrada" (eso sí, con status 200).

**Por qué no se mergeó igual:** pone en ROJO la guarda de honestidad
`scripts/venta-honestidad.test.mjs`, que ata la copia de venta al motor y dice, en su propio
comentario, qué hacer: *"Si esto se pone rojo el bot APRENDIÓ a agendar: no hay que borrar el
test sin más, hay que verificarlo en vivo y recién ahí cambiar la copia."* La verificación en
vivo está arriba; **cambiar la copia es tuyo**: `ONIA_CATALOGO_DE_VENTA.md` hoy declara que el
chatbot NO agenda, y la guarda lo exige en las dos puntas.

**Lo que hay que decidir (una sola cosa):** ¿el chatbot se vende como que AGENDA?
- **Sí** → se mergea la rama, se reescribe la guarda al nuevo invariante y la fila del chatbot
  del catálogo pasa a decir "agenda". Costo: nada de plata; ~1 vuelta de loop.
- **No** → la rama se archiva y el bot sigue derivando la cita a una persona. Costo: cero, pero
  `pricing.ts` ya no lo vende así, o sea que nadie está prometiendo de más.

**Ojo con el borde real, que no es de copy:** una org puede tener slug y NO tener la agenda
configurada. Ahí el cliente final recibe un link a una página vacía. Si la respuesta es "sí",
esto se cierra antes de encender.

</details>

**10. ¿Para qué sirve `web-factory/packages/`?**
Los tres paquetes que el carril de Web Factory viene puliendo hace diez días —`@onia/blocks`,
`@onia/templates`, `@onia/tokens`— **no aparecen en una sola línea** de la app que sirve
onia.com.bo: `grep -rn "@onia/" web-factory/apps/onia-platform/src` devuelve **0**. Y la cola de
ese carril le **prohíbe** tocar `apps/onia-platform`, o sea que el destino cero es por diseño,
no por olvido. Diez días de trabajo cuidadoso —dashboard, bloques, tokens, 265 tests— que hoy no
tocan ninguna superficie que venda.

Las tres salidas cuestan lo mismo, **Bs 0**; lo que cambia es qué se deja de esperar:

- **a)** Se declaran **producto interno** (la galería + las webs de cliente) y se acepta que la
  landing no los use. Cero trabajo — pero hay que dejar de medir ese carril por lo que le llega
  al sitio de venta, que es como se lo viene mirando.
- **b)** Se le **abre la zona** sobre `apps/onia-platform` para portar de a un bloque. Choca con
  `onia-cola`, que ya toca esa app: habría que turnarse el archivo.
- **c)** Las **webs de cliente** pasan a ser el único consumidor y `packages/` deja de crecer
  hasta que haya un cliente que las pague. Es la que ata el trabajo a plata que entra.

Detalle y evidencia en `web-factory/docs/LOOP_COLA.md`, sección *Bloqueado*.

**11. ¿Dónde se publican `dental-premium` y `ferreteria-sur`?**
Dos webs de cliente **terminadas, miradas y con gates verdes**, y **cero URL**: no hay proyecto
en Vercel (medido con la API: 15 proyectos, ninguno es estos dos), no hay workflow, y el
`vercel.json` de la raíz tiene el deploy por git apagado para todo el repo. El add-on se cierra
mandando un link por WhatsApp y ese link no existe. Las dos opciones cuestan **Bs 0**:

- **a) Subdominio en el VPS** (recomendada). El comodín de DNS ya resuelve —cualquier subdominio
  de la marca devuelve las IPs de Cloudflare y responde **404**, o sea que falta el vhost, no el
  DNS— y las dos apps ya son `output: standalone`, el mismo modelo que
  `scripts/deploy-onia-landing.sh`. Cuesta un contenedor por sitio.
- **b) Vercel por CLI.** Cuenta hobby, y el deploy por git está apagado justamente porque cinco
  loops pusheando agotaban la cuota diaria (`37f9ac88`). Competiría con la cuota que necesita la
  landing.

Lo único que hace falta de Sergio es **el nombre del subdominio**.

**12. ~~El canario mira 10 pantallas en el repo, pero el VPS sigue corriendo la versión de
3.~~ ✅ CERRADO — ya se copió.** Ver "Cerradas → C": el prompt del VPS y el del repo son
idénticos byte a byte hoy.

<details><summary>Texto original</summary>

Se mergeó a `main` hoy (`52e359c1`): diez pantallas de cliente, umbrales medidos y el peso deja
de ser una lotería. Pero el prompt que EJECUTA el canario vive en `/root/bin/loops/` del VPS, y
`scripts/loops/README.md` lo dice literal: *"Al cambiar un prompt hay que volver a copiarlo"*.
Hasta que se copie, la mejora está commiteada y **no mira nada nuevo** — construido ≠ terminado.

Es **un solo comando** y cuesta **Bs 0**; no se corrió porque tocar el VPS necesita tu OK:

```bash
install -m 644 scripts/loops/prompts/canario-visual.md /root/bin/loops/canario-visual.md
```

</details>

**13. DOS ramas quedaron fuera de la integración por divergencia, no por conflicto — ahora es
UNA sola.** Ver "Cerradas → D": `claude/chatbots-platform-review-0d1d09` ya tiene **cero**
commits propios sin mergear, ya está adentro de `main`. Sigue viva sólo
`claude/onia-web-architecture-b37eca` (**401 commits atrás de `main`, 2 propios sin mergear**,
medido hoy — venía divergiendo, no se achica sola).

La decisión sigue siendo la misma para la que queda: **rebasar y mergear** (alguien tiene que
mirar el rebase) o **archivarla** y perder ese trabajo, Bs 0 cualquiera de las dos.
`claude/ads-creatividades-publicos` (146 commits) queda afuera a propósito: es tu carril de
contenido y lo cerrás vos.

## 17. ~~El loop `docs-auditoria` está construido y probado, pero apagado~~ — RESUELTO, ya corre (2026-09-02)

> 🔴 **CORREGIDO el 2026-09-02: esta sección quedó vieja en horas.** Esta misma vuelta del
> carril `docs-auditoria` está corriendo **porque el cron ya está prendido** —
> `crontab -l` en el VPS tiene `18 1,5,9,13,17,21 * * * /root/bin/onia-loop.sh docs-auditoria`
> (6×/día), y `hermes-content/docs/cola/loops.md` ya lo lista en la tabla "Deben existir y
> estar activos". No queda ninguna opción por elegir: la cadencia ya se decidió y se aplicó.
> Lo que sigue es el texto original, que se deja como historia de la decisión pendiente.

El carril que audita ESTE archivo (worktree, rama, prompt, `case` en `onia-loop.sh`) ya existe en
el VPS y corrió una vez a mano el 2026-09-02T02:21 UTC con `exit 0`. **No tiene línea en
`crontab -l`**: sin ella, no se repite solo — cada vuelta futura necesita que alguien lo dispare
a mano. El `TOPE` ya está puesto en 2400 s (40 min), calcado del resto de los loops del VPS.

Lo que falta decidir es la **cadencia**, porque prender el cron es correr una sesión de Claude
cada vez que dispara (cuesta el consumo de la suscripción, no plata directa, pero sí corre sin que
nadie mire). Comparado con los otros tres del VPS:

| loop | cadencia | por qué |
|---|---|---|
| `chatbot-cola` | horaria | cola viva, hay que verla en la bandeja rápido |
| `canario-visual` | 4×/día | mira pantallas de cliente, barato y de bajo riesgo |
| `marca-personal` | 2×/día | drop de contenido con horario fijo (19:00 La Paz) |
| `docs-auditoria` | **sin decidir** | auditoría de docs — no depende de un reloj externo |

**Opciones cotizadas (todas Bs 0, sólo consumo de sesión Claude):**
- **2×/día** (ej. `11 8,20 * * *` UTC — mismo patrón que `marca-personal`, corrido 8 h después
  para no competir por CPU/disco en el mismo minuto): ritmo parejo con el resto de los loops de
  carril.
- **1×/día**: alcanza si los docs no cambian tan rápido como para que un hallazgo dure medio día
  sin corregirse.
- **Dejarlo apagado y disparar a mano** cuando se sospeche drift: cuesta cero sesiones de más,
  pero vuelve a depender de que alguien se acuerde — el mismo problema que esta doc existe para
  resolver en los otros loops.

Con el OK de Sergio, la línea a agregar en `crontab -e` es:
```
<minuto> <horas> * * * /root/bin/onia-loop.sh docs-auditoria >> /var/log/onia-loop-docs-auditoria.log 2>&1
```
y después se suma la fila a la tabla "Deben existir y estar activos" de arriba.

## 18. Home y `/empezar` tienen 6 screenshots reales del producto — la regla del 1-sep las prohíbe (2026-09-02) — decisión de Sergio

Regla vigente, tuya, del 2026-09-01: *"no coloques capturas literales del sistema, se ve mal,
coloca cosas referenciales"* — cero `<img>`/`<video>`/`<canvas>` que fotografíen el software,
sólo piezas que DIBUJEN el resultado del cliente. Encontrado midiendo el HTML servido de
`onia.com.bo/` y `/empezar` (contenedor `onia-landing`, no un grep de repo): **6 imágenes son
screenshots reales del panel de Onia**, de antes de esta regla (commit `65201c20`,
2026-08-21 — el propio mensaje dice *"la landing muestra el producto real... capturas
cableadas en sus ranuras"*, con datos de un tenant de demo sembrado por los circuitos reales).

**Dónde están:**
- Home: `/v2/capturas/agentes.webp` (pantalla de agentes) y `/v2/capturas/whatsapp.webp`
  (editor del chatbot) — el bloque "Trabajan de noche. No *deciden* solos."
- `/empezar`: `/v2/capturas/panel.webp` (dashboard con "Bs 4.633,40 cobrados") — la imagen del
  hero, al lado del CTA principal.
- Las 5 de `/rubros/*.webp` en la banda "Elegís tu rubro" — mismo tipo de captura; tienen
  además un bug de recorte propio ya anotado en `COLA.md` (item de la maqueta cortada), que es
  independiente de éste.

**Por qué no lo cerré solo esta vuelta:** sacar 3 imágenes centrales del hero de las dos
páginas que más lead reciben es la clase de cambio visual que la otra regla de esta cola frena
— *"un rediseño no se publica sin que Sergio VEA la pieza terminada"* — con el precedente caro
del 2026-08-20 (landing v2 rechazada entera, revertida en producción). No hay un reemplazo
"obvio" de bajo riesgo: un hueco en blanco tampoco vende.

**Tres caminos, ninguno cuesta plata en efectivo salvo el marcado:**
- **a) Ilustración/diagrama referencial** (lo que la regla pide al pie de la letra): redibujar
  cada captura como pieza gráfica — no fotografía del software, sí su resultado (montos,
  agenda, WhatsApp). Costo: diseño, ~1 vuelta por imagen bien hecha, cero plata si se hace con
  CSS/SVG; con generación de imagen (Higgsfield) es gasto trivial de crédito, ya autorizado por
  `CLAUDE.md` para lotes chicos — pero igual necesita el visto bueno de la pieza terminada.
- **b) Blur/recorte fuerte** que deje reconocible sólo la forma (bloque de color + contorno),
  no el contenido — es lo que la ranura `shapeShot` ya sabía hacer ANTES de cablear estas
  capturas (`65201c20` lo dice: "sin `src` sigue siendo la ranura de forma+color"). Revertir a
  ese estado es la opción más barata y ya probada, aunque pierde el "se ve real" que buscaba el
  commit original.
- **c) Excepción explícita para estas 3**: si Sergio decide que la regla del 1-sep era para
  otro contexto (video/referente) y no para las capturas ya ganadas del producto, se anota acá
  como excepción y el ítem de `COLA.md` se cierra sin tocar código.

Mientras no haya decisión, el ítem queda abierto en `COLA.md` con la medición completa para
que la próxima vuelta no la repita.

## 19. ~~El espaciado roto del login~~ — CERRADA el 2026-09-02, Sergio NO decide nada

> ✅ **Era el motor de captura, no el sitio. Las tres opciones de abajo quedan sin objeto: ninguna
> hay que ejecutar, y el párrafo de `/login` NO se toca.**
>
> **Cómo se resolvió sin Sergio.** El camino **(c)** de esta misma sección —*"que Sergio abra
> `app.onia.com.bo/login` en su Chrome de escritorio; si no lo ve, se cierra como
> fantasma-de-headless"*— era la respuesta correcta con el instrumento equivocado: no hacía falta
> un humano con GUI, hacía falta **el otro Chromium, que ya estaba bajado en el VPS**. Se cambió
> el motor en vez de la persona.
>
> **La medición, hecha dos veces por dos carriles distintos** (el dueño de `web-venta` y después
> el integrador, sin creerle al primero): misma URL, mismo instante, misma fuente ya cargada,
> los dos binarios apuntados por `executablePath`.
> - `chrome-headless-shell-1223` → *"Ent regamos t u sist ema … puest a … con t us dat os"*.
> - `chromium-1223` completo → *"Entregamos tu sistema con la configuración de tu rubro puesta."*
>
> El `innerText` es idéntico en los dos, y **la única variable que cambió fue el rasterizador**.
>
> **Por qué la bisección de abajo no contradice esto — importa, porque es lo que hizo perder tres
> días.** "Roto en pesos ≤500, limpio en 600+, limpio con Arial" es exactamente la firma de un bug
> de rasterizado en trazos finos: describe *cuándo* se ve, no *quién* lo dibuja. Ninguna de esas
> pruebas cambió de motor, así que **ninguna podía distinguir sitio de captura** — por eso todas
> apuntaron con confianza al lugar equivocado. Cuando una investigación no puede refutar su propia
> hipótesis, acumular evidencia dentro de ella sólo la vuelve más convincente, no más cierta.
>
> **Lo único que queda, y no es de Sergio:** el canario visual saca sus fotos con el motor malo
> (`scripts/canario_visual.mjs`, `chromium.launch` sin `channel`), así que va a seguir inventando
> este defecto en cada corrida. Está como ítem abierto del carril del canario en `COLA.md`.

<details><summary>La investigación original, tal como quedó (ya explicada por lo de arriba)</summary>

`COLA.md` tenía el ítem del párrafo de `app.onia.com.bo/login` con espacios metidos DENTRO de
palabras ("Ent regamos", "puest a") marcado como *"queda a criterio del dueño confirmarlo en un
navegador de verdad antes de invertir tiempo"* — podía ser un artefacto de Chromium headless en
Linux y no algo que viera un cliente real. Se invirtió el tiempo: **es un bug real y aislado, no
un artefacto de captura**, pero cerrarlo cambia el peso visual del texto.

**Lo nuevo, verificado hoy, que el ítem original no tenía:**
- Se reproduce igual en DPR 1 (el mismo que usa `canario_visual.mjs`) y en DPR 3, y con zoom por
  `transform: scale()` en vez de supersampling del screenshot — descarta que sea un artefacto de
  cómo se capturó la imagen.
- **Es específico de la fuente Archivo en pesos ≤500.** El mismo párrafo con `font-family: Arial`
  (DOM override, sin tocar código) sale perfecto — cero gap. Con `font-weight: 700` sale perfecto
  también. Bisecado: **400/450/500 rotos, 600 y para arriba limpios.**
- **No es kerning ni ligaduras**: `font-kerning: none` y `font-feature-settings: "kern" 0, "liga"
  0, "calt" 0` no cambian nada — el gap sigue. Tampoco es el eje `wght` sin fijar: pinearlo
  explícito a `'wght' 400` con `font-variation-settings` no lo arregla.
  → Es un problema del propio archivo variable de Archivo (Google Fonts, servido por
  `next/font/google` sin `weight` fijo — `app/layout.tsx:25-29` en `onia-platform`) al
  interpolar el eje de peso en pesos bajos/medios bajo el shaping de Chromium/Linux (HarfBuzz o
  FreeType), no de nuestro CSS.

**Por qué no lo cerré con un `font-weight: 600` esta vuelta:** el párrafo (`text-white/55`, texto
secundario deliberadamente liviano — `components/auth/AuthShell.tsx:105`) está pensado para
verse discreto al lado del título en `font-extrabold`. Subirlo a 600 lo saca de ese lugar visual
— cambia cómo se ve la pantalla que comparten `/login` y `/register`, la misma clase de cambio
que la regla *"un rediseño no se publica sin que Sergio VEA la pieza terminada"* frena (precedente
del 2026-08-20). No es un bug de una línea con un arreglo obvio: es un trade-off entre "se ve
roto a veces" y "se ve más pesado siempre".

**No verificado, y sigue sin poder verificarse desde acá:** un Chrome de escritorio real
(Windows/Mac, no headless) — esta máquina no tiene GUI. Sigue siendo posible que el bug sólo
exista en Chromium headless de Linux y ningún cliente real lo vea nunca.

**Tres caminos, cotizados:**
- **a) Subir el peso del texto secundario del panel a 600** (o el valor bisecado más bajo que
  salga limpio — no se afinó más allá de escalones de 50). Cierra el bug con certeza, cambia el
  peso visual de TODO el texto `detalle` del panel de auth (3 bullets, 2 pantallas). Costo: una
  línea de CSS + gates + captura para que Sergio la mire antes de mergear. ~15 min.
  - Es el mismo bug reportado en el `titulo` en `font-extrabold` (~800): a ese peso nunca se vio,
    consistente con que arriba de 600 esté limpio.
- **b) Servir Archivo como fuente ESTÁTICA (no variable) para los pesos que usa el body**, en vez
  del archivo variable completo 100–900 que pide `layout.tsx` hoy. Sin interpolación de eje no
  debería haber nada que HarfBuzz calcule mal. Mantiene el peso visual actual. Costo mayor: tocar
  cómo se cargan las DOS familias de marca (el comentario de `layout.tsx:19-23` dice que la
  variable es a propósito, para que el numeral fino de 300 y el titular de 800 salgan del mismo
  archivo) — un cambio de infraestructura de fuente, no de una pantalla. No probado si de verdad
  esquiva el bug: es hipótesis, no medición. ~1-2 vueltas.
- **c) No tocar nada todavía** y pedirle a Sergio que abra `app.onia.com.bo/login` en su propio
  Chrome de escritorio. Si no lo ve, el ítem se cierra como fantasma-de-headless sin gastar más
  tiempo; si lo ve, elige entre (a) y (b) con la certeza de que es real para un cliente.

**Recomendación: (c) primero — es gratis y resuelve la duda de fondo —, y si confirma, (a)**: es
reversible, rápido, y el texto sigue siendo perfectamente legible a 600; (b) sólo si (a) no
alcanza o Sergio prefiere no tocar el peso visual.

Mientras no haya decisión, el ítem sigue abierto en `COLA.md`, con este hallazgo referenciado
para que la próxima vuelta no rehaga la bisección.

</details>

## 20. ~~OCHO commits arreglan la plataforma y NINGUNO está en producción~~ (2026-09-02) — FUSIONADA en la §34 el 2026-09-03, Sergio decide UNA vez

> 🔴 **Esta sección y la §34 le pedían a Sergio LA MISMA decisión —desplegar `onia-platform`—
> desde la misma base (`8a3b5a6`), con tres números distintos y ninguno correcto.** §20 dice
> "OCHO" en el título y `= 7` cuatro párrafos más abajo (se contradice sola); §34 dice "Siete".
> **Contado en vivo el 2026-09-03 05:30 UTC: son NUEVE.**
>
> ```
> cat /opt/onia-platform/runtime-next/.next/BUILD_ID   →  lNDdVgrRvP1mizzu3BVXc
> cat /opt/onia-platform/build-8a3b5a6/.next/BUILD_ID  →  lNDdVgrRvP1mizzu3BVXc   (producción = 8a3b5a6)
> git rev-list --count 8a3b5a6..origin/master          →  9
> git diff --shortstat 8a3b5a6 origin/master           →  29 files changed, 1162 insertions(+), 45 deletions(-)
> ```
>
> **Manda la §34**, porque trae lo único que hace peligroso este deploy y §20 no menciona: el
> **orden** (migración → env vars → build+swap). Al revés, `3523c79` selecciona una columna que
> no existe y Prisma tumba la pantalla de chatbot para todos.
>
> **Lo que se mudó a la §34 antes de cerrar esto**, porque sólo vivía acá: el matiz de que
> `15e3910` **toca código de plata**, y los dos huecos que el deploy NO cierra.
>
> Se deja tachada y no borrada porque la tabla de abajo sigue siendo la mejor explicación de
> **qué sufre el cliente** con cada commit. Para el número, la cuenta y el orden: §34.

**No confundir con la §16**: aquella es el deploy del **motor del bot** y de `web-factory`. Esta
es el deploy de **`onia-platform`**, el contenedor que sirve `app.onia.com.bo`. Son dos deploys
distintos, con riesgos distintos, y se pueden hacer por separado.

**Medido en vivo el 2026-09-02, no deducido.** El contenedor `onia-platform` monta
`/opt/onia-platform/runtime-next`, cuyo `.next/BUILD_ID` es `lNDdVgrRvP1mizzu3BVXc` — el mismo
que `/opt/onia-platform/build-8a3b5a6`. O sea: **producción corre `8a3b5a6`**.

⚠️ **Este ítem decía "tres commits" y hoy son OCHO.** Recontado en vivo a las 22:45 UTC
(`git log --oneline 8a3b5a6..master | wc -l` = 8), no releído del párrafo anterior. La pila crece
sola cada vez que el integrador mergea y nadie despliega: **el número envejece más rápido que el
resto del ítem**, así que se cuenta de nuevo antes de citarlo. Es la misma trampa que ya costó
una vuelta con los horarios de `loops.md`.

### Lo que está vivo en producción AHORA — medido, no deducido

Producción corre `8a3b5a6` (el contenedor bind-montea `/opt/onia-platform/runtime-next`, cuyo
`BUILD_ID` es `lNDdVgrRvP1mizzu3BVXc`, igual al de `build-8a3b5a6`). `git rev-list --count
8a3b5a6..master` = **7**.

| Commit | Qué arregla | Prueba de que NO está en producción (hoy 17:36 UTC) |
|---|---|---|
| `22fd088` + `d62beeb` | **El menú dibuja `ASSIGNMENT_TURNED_IN` en letras gigantes en TODA pantalla del dashboard** — el bug más caro de la pila: lo ve cualquier cliente que entre, en cada pantalla | Producción corre `8a3b5a6`, anterior a los dos commits |
| `bdf0935` + `5888a13` (merge) | **El login le deletrea los nombres de los iconos al lector de pantalla**, y si la fuente tarda más de 12 s se los muestra como texto a cualquiera (`bolt`, `credit_card_off`, `smart_toy`) | El HTML servido hoy trae los tres `<span>` **sin `aria-hidden`**, y el script del `<head>` sigue cerrando con `setTimeout(ok,12000)` en vez de la guarda `d.fonts.status` |
| `675541b` | **Una ferretería lee "La cita" y "en el consultorio"** en el editor de su propio chatbot | Producción corre `8a3b5a6`, anterior al commit |
| `15e3910` | **El cliente que paga el add-on del chatbot (Bs 390) queda sin bandeja** hasta que descubre y aprieta un botón: aprobar el pago encendía el booleano y no creaba el inbox de Chatwoot. Ahora la aprobación enciende el canal web sola, fuera de la transacción del cobro y sin poder tumbarlo | Medido en la base: **cero orgs de cliente** con `chatwootInboxId`. El commit es de hoy y no hay build posterior a `8a3b5a6` |
| `efaffe8` | **La CSP bloqueaba el beacon de Cloudflare Web Analytics en toda la plataforma** | La cabecera `content-security-policy` servida hoy no menciona `cloudflareinsights` en ningún lado |

Tocan **21 archivos, +647/−44**, y **9 de los 21 son tests o snapshots** (recontado en vivo el
2026-09-02 22:45 UTC junto con el número de commits). La superficie de riesgo real sigue siendo
chica y sin migraciones: `components/auth/AuthShell.tsx`, `lib/iconos-script.ts`,
`next.config.ts`, `components/layout/navigation.ts`, `lib/onboarding/vocabulario.ts` y
`app/api/admin/subscription-payments/route.ts`. **Ninguno toca base de datos ni sesiones**; el de
`subscription-payments` toca el cobro, pero sólo agrega un efecto posterior a la transacción que
no puede hacerla fallar (probado con Chatwoot caído).

⚠️ **Dos huecos que este deploy NO cierra** (quedan como ítems del carril producto, no decisión
de Sergio): `scripts/subset-iconos.mjs` **se rinde en silencio y sale 0** si falta `pyftsubset`
—el build publica la fuente vieja sin avisar—, y `e2e/iconos.spec.ts` sólo mira `/`, `/login` y
`/register`, así que el sidebar (que exige sesión) no aparece en ninguna de las tres. Por eso
nadie lo atajó.

### Qué cuesta desplegarlo — medido sobre el último build real

**Recomendación: hacerlo.** Sigue siendo de los deploys baratos del radar: seis archivos de
código, **ninguno toca base de datos ni sesiones**, y cierra ítems que ya están verdes en código y
valen cero hasta que se enciendan.

⚠️ **Un matiz que antes no existía y hay que decir en voz alta.** Hasta el 2026-09-02 acá decía
"ninguno toca base de datos, **pagos** ni sesiones". Con `15e3910` eso dejó de ser cierto: ese
commit sí toca la ruta que aprueba pagos. Lo que agrega es un efecto **posterior** a la
transacción del cobro —crear el inbox de Chatwoot— envuelto en `try/catch`, así que no puede
hacer fallar ni revertir una aprobación; hay un test que lo prueba con Chatwoot caído, y otro que
fija que aprobar un plan normal **no** cree inbox (regalarlo sería entregar gratis un add-on de
Bs 390). Aun así, **es código de plata y merece que Sergio lo sepa antes de desplegar**, no que
quede tapado por una frase escrita cuando la pila era otra.

## 21. Nadie mira nunca el panel del chatbot del cliente — falta una credencial de sólo lectura (2026-09-02) — decisión de Sergio

**Qué pasa.** `app.onia.com.bo/settings/chatbot` es la pantalla donde un cliente edita el
conocimiento de su bot. Está detrás de sesión, así que el canario visual —el único que abre y
MIRA las pantallas de cliente— nunca la vio. Hasta hoy, encima, **la reportaba verde**: medía
el `/login` al que redirige y lo comparaba contra una baseline que también era el login.
Arreglado hoy (`scripts/canario_visual.mjs`): ahora dice `NO MEDIDA` con el motivo. Pero
"no miente" no es "se mira": la pantalla sigue sin que nadie le pase el ojo nunca.

**Qué falta, y es una sola cosa.** Un usuario del producto que sólo mire, puesto como
`ONIA_CANARIO_USER` / `ONIA_CANARIO_PASS` en el entorno del loop `canario-visual`. **Cero
código pendiente**: `requiereSesion` y `iniciarSesion()` ya están escritos y entran por el
formulario real de `/login`. Enchufarla es un `env`.

**Las opciones, cotizadas:**

1. **Crear un usuario de sólo lectura en una org existente** (~5 min de Sergio, cero código).
   Es la recomendada. Riesgo: la credencial vive en el entorno del VPS — no en el repo.
2. **Reusar una cuenta que ya exista** (0 min). Más barato, pero si es una cuenta con permisos
   de escritura, un canario que se equivoque de click toca datos reales. No recomendada.
3. **Una ruta de vista previa pública** — la que proponía el ítem original. **Se descarta:**
   expone configuración de cliente sin sesión y agrega una superficie viva. Se anota para
   cerrar la puerta, no para elegirla.

**Recomendación: (1).** **Desbloquea:** que `/settings/chatbot` entre a la ronda del canario
como las otras diez pantallas. Es **S15** en `hermes-content/docs/cola/chatbot.md`.

## 22. ¿Quién avisa cuando un loop se muere? (2026-09-02, re-medido 2026-09-03)

> ✅ **La pregunta original ya no existe.** Esta entrada preguntaba si blindar el corredor
> porque *"el `.sh` que corre se edita a mano y el del repo queda atrás"*. **Hoy es al revés y
> está medido**: `main` es la fuente y el VPS es el destino de un despliegue automático.
>
> ```
> md5sum /root/bin/onia-loop.sh                     → 1214e0122a986eba1baa9b7a19fc6044
> git show origin/main:scripts/loops/onia-loop.sh   → 1214e0122a986eba1baa9b7a19fc6044
> ```
>
> Byte por byte iguales, y **los 14 `case` son los mismos en los dos** (`canario-visual`,
> `chatbot-cola`, `marca-personal`, `onia-cola`, `docs-auditoria`, `kpis-semanal`, `web-venta`,
> `investigacion`, `lucia`, `recorrido-cliente`, `tendencias`, `web-factory-dev`,
> `calidad-generado`, `supervisor`). Lo mismo el sincronizador contra
> `origin/main:scripts/loops/sincronizar.sh` (`cmp -s` → idénticos).
>
> Lo que cerró la puerta es `/root/bin/onia-loops-sync.sh`, por cron al minuto 44: copia
> corredor, prompts, tablero y lector de Telegram **desde `main`**, con `bash -n` antes de pisar
> nada, `mv` atómico, y **se despliega a sí mismo**. Su log de esta madrugada lo muestra
> haciéndolo, 42 minutos antes de esta vuelta:
> ```
> 2026-09-03T02:44:02Z actualizado /root/bin/onia-loop.sh
> 2026-09-03T02:44:02Z actualizado /root/bin/onia-loops-sync.sh
> ```
> Su repo fuente (`/root/loops/onia-hermes`) está en `main` con **0 commits atrás** de
> `origin/main` — o sea que despliega lo vigente, no una foto.
>
> **La opción C también está hecha.** `tg()` ahora se define en la línea 32, **arriba del
> `case`**, y la rama `*)` manda un Telegram nombrando el loop y los ids conocidos —que además
> lee del propio `case` en vez de una lista a mano. El fallo mudo que originó la entrada
> (`exit 64` antes de que existiera la función que avisa) ya no puede repetirse.
>
> **A y D quedan sin sentido:** avisar de una diferencia que un cron borra dentro de la hora es
> ruido, y "no hacer nada" ya no es el estado actual.
>
> ⚠️ **El riesgo nuevo es el espejo del viejo, y es el diseño buscado, no un bug:** una edición
> a mano en `/root/bin` ahora se **borra** dentro de la hora. Se arregla en el repo y se mergea
> a `main`, o no se arregla.

**Lo único que sigue vivo es la opción B, y sigue sin construirse.** Medido hoy: ningún script
del VPS mira si un loop dejó de arrancar. `grep -l "ARRANCA" /root/bin/*.sh` devuelve **un solo
archivo, `onia-loop.sh`** — el que lo escribe. Los tres vigías que existen miran otra cosa:
`claude-guardia.sh` mira Sentry y contenedores, `hermes-vigia.sh` mira los trabajos de Hermes,
`onia-vigia-embudo.sh` mira el embudo de venta.

**Qué se decide.** Si se pone un vigía que compare cada loop del cron contra su propio log. La
rama `*)` del corredor cubre **una sola** causa de muerte (nombre sin `case`); un loop que
arranca y se cuelga, que se queda sin turnos, o cuyo worktree desapareció, sigue muriendo en
silencio con el cron perfecto. Mientras no se decida, el único detector es que alguien note la
ausencia de mensajes en Telegram.

**El chequeo cuesta 2 segundos y ya está escrito — lo corrí en esta vuelta** (lee `crontab -l`,
y por cada `onia-loop.sh <id>` busca el último `ARRANCA` de `/var/log/onia-loop-<id>.log`).
Resultado del 2026-09-03 03:30 UTC: **los 15 vivos**, ninguno con más de 5 h sin arrancar
(`marca-personal` 5 h es su horario normal de `56 9,13,17,21`).

| opción | qué cuesta | cuánto tarda | qué se pierde |
|---|---|---|---|
| **B — vigía diario de `ARRANCA`** | Bs 0. Un script en `/root/bin` + una línea de cron + un archivo de estado para no repetir el aviso. El comando que hace el trabajo ya está probado acá arriba | Una vuelta del carril dueño (docs/infra). No hay nada que investigar: falta empaquetarlo | Nada. Un mensaje de Telegram sólo cuando un loop se pasa de su horario |
| **D — dejarlo** | Bs 0 hoy | ya está | El próximo loop que muera por una causa distinta a "sin `case`" no lo dice nadie. Ya pasó una vez y costó **un día entero** de `investigacion` |

**Recomendación: B.** El costo es empaquetar un comando de 2 segundos que ya funciona, y es el
único que cubre las causas de muerte que el corredor no puede ver desde adentro.

**Lo que NO es opción, y por qué:** ampliar la rama `*)` del corredor. Un loop que se cuelga o
se queda sin turnos **nunca llega a ejecutar el corredor hasta el final** — el aviso tiene que
venir de afuera del proceso que puede morir. Es la misma razón por la que `hermes-vigia.sh` no
vive adentro de Hermes.

**Sigue abierto aparte, y no lo tocó nadie: el chequeo de arranque mira en una sola dirección.**
El bloque pegado en todos los prompts busca filas de `loops.md` que falten en el cron — nunca al
revés. Arreglarlo toca **los 14 prompts** —contados en `origin/main`, los 14 llevan el bloque— y
el bloque dice explícitamente "no lo optimices", así que **decidilo vos**. Ver la §25, que hoy
mide una consecuencia peor de lo mismo.

## 23. ~~Los arreglos del carril chatbot al producto nunca llegan a `master`~~ — RESUELTO 2026-09-02, Sergio NO decide nada

> ✅ **Cerrado el 2026-09-02 12:39 UTC por el integrador (`onia-cola`), por el camino (a).** Se
> tomaron las dos acciones que pedía esta entrada, en la misma vuelta:
>
> 1. **Mergeados los 3 commits a `origin/master`** (`503af44`, merge `--no-ff`). Eran 3, no 2:
>    se sumó `d62beeb`, que cablea el gate de iconos a `ci`. Guarda dura pasada (0 archivos
>    borrados, 13 archivos, +373/−28) y **los tres gates de `onia-platform` en verde**:
>    `tsc` 0 · `vitest` **2494 pasan / 204 archivos** · `npm run lint` **0 errores**
>    (100 warnings preexistentes). Los snapshots NO se reescribieron esta vuelta — se verificó
>    con `git status` después de vitest, por la trampa de CRLF que la cola ya tenía anotada.
> 2. **Tapado el agujero que lo causaba** (recomendación (a)): `scripts/loops/prompts/onia-cola.md`
>    ahora hace `fetch` y cuenta en **los dos repos**, cada uno contra su base (`main` en
>    `onia-hermes`, `master` en `onia-platform`), y trae el comando para enumerar en vivo las
>    ramas del segundo repo en vez de confiar en una lista escrita a mano.
>
> **Verificado por el gate que este mismo carril construyó, no por lectura:**
> `npm run deploy:alcanzable` pasó de **exit 1** nombrando los commits inalcanzables a **exit 0**
> — *"4 commit(s) declarado(s), los 4 llegan a origin/master"*. Es la clase de prueba que esta
> entrada pedía: una que discrimina en vez de gritar a todo.
>
> ⚠️ **Lo que NO cambia: esto era el escalón `rama → master`. El deploy sigue abierto.** Los tres
> arreglos ahora existen en `master` y **el cliente todavía no los ve**: falta el deploy, que
> decide Sergio. Cerrar ésta no destraba aquélla — la hace posible.

**Es un escalón ANTES del deploy, no la misma cosa.** El deploy mide `master` → producción.
Ésta mide **rama de carril → `master`**: dos commits que ni siquiera llegaron a la rama de la
que se buildea. Si mañana se aprueba el deploy, el swap buildea `master` y **estos dos siguen
sin estar**.

> 🔁 **Actualizado 2026-09-03:** acá decía "la §20" y "tres commits". La §20 se fusionó en la
> **§34** (única sección del deploy de plataforma) y la cuenta viva es **9**, no 3. Se saca el
> número de esta sección a propósito: **el que cita una cuenta que no mide, la envejece.**

**Medido el 2026-09-02, no deducido** (`git merge-base --is-ancestor` en el clon del VPS):

| Commit | Qué arregla | ¿en `origin/master`? |
|---|---|---|
| `22fd088` | El menú del dashboard dibuja `ASSIGNMENT_TURNED_IN` en letras gigantes en vez de un icono | **NO** |
| `675541b` | El editor del chatbot le dice "La cita" y "en el consultorio" a una ferretería | **NO** |

Los dos están commiteados **y pusheados** a `origin/claude/chatbots-platform-review-0d1d09` de
`onia-platform`. Esa rama está **2 commits adelante y 17 atrás** de `origin/master`, y nada la
mergea.

**Por qué nadie la mergea, que es la causa y no el síntoma.** El integrador (`onia-cola`) tiene
el merge a `master` **pre-autorizado** por su propio prompt. Pero su Paso 1 hace
`cd /root/loops/onia-hermes` y recorre una lista de ramas de **ese** repo. La rama
`claude/chatbots-platform-review-0d1d09` está en esa lista — sólo que la cuenta contra el `main`
de `onia-hermes`, donde da **0**, y concluye "no hay nada que hacer con esa rama". El mismo
nombre de rama existe en los DOS repos, y el que tiene trabajo sin mergear es el que nadie mira.

**El costo ya cobrado: es la tercera vez que la misma instrucción falla, cada vez un escalón más
adentro.** (1) `S11` mandaba desplegar un commit inexistente — el trabajo había quedado en el
disco de Windows. (2) Se rehizo y se pusheó, y `S11` quedó escrito "commiteado y pusheado, NO
desplegado", como si sólo faltara el OK. (3) Medido hoy: falta el merge. **Un bloqueo que le pide
a Sergio desplegar algo que el deploy no alcanza no se destraba nunca.**

**Ya no depende de un párrafo:** `npm run deploy:alcanzable` lee la cola, saca los commits de
`onia-platform` que declara y le pregunta a git si `origin/master` los alcanza. Hoy sale **exit
1** nombrando los dos; `e644c85` (de un ítem viejo) sale **OK**, que es la prueba de que
discrimina en vez de gritar a todo.

**Tres caminos, cotizados:**

- **(a) `onia-cola` extiende su Paso 1 a las ramas de `onia-platform`.** Su prompt ya autoriza el
  merge a `master` y ya tiene escritos los tres gates de ese repo (`tsc`, `vitest`, `npm run
  lint`). Lo que falta es que enumere el segundo repo. Toca
  `scripts/loops/prompts/onia-cola.md` — es del carril de integración, **no del chatbot**.
  Costo: una vuelta de ese loop. **Es el único que no se vuelve a romper el mes que viene.**
- **(b) Sergio mergea la rama a mano**, o por PR como llegaron los últimos (`Merge pull request
  #77`). Costo: minutos. Arregla estos dos commits y ninguno de los próximos.
- **(c) Dejarlo.** Cada arreglo que este carril haga sobre el producto queda en una rama muerta,
  y `S11` no se destraba nunca.

**Recomendación: (a)**, y (b) ahora mismo si se quiere el icono arreglado en el próximo swap.

---

## 25. Los carriles auditan un árbol viejo: nadie sincroniza el worktree con `main` (2026-09-02)

**Qué pasó, medido.** La vuelta de `docs-auditoria` de las 13:18 UTC arrancó en `HEAD 8a83eea7`
—su propio último commit— y `git rev-list --count HEAD..origin/main` daba **96**. Noventa y seis
commits de `main` que el carril no veía.

**Por qué importa, con el caso concreto de esa misma vuelta.** El carril leyó `COLA.md` y el
radar de su copia vieja, encontró el ítem *"Nadie es dueño de `/` ni de `/empezar`"* pidiéndole a
Sergio elegir entre dos opciones, verificó en vivo que el bloqueo estaba **vencido** (el carril
`web-venta` es el dueño desde el 2026-09-02, corre 5 veces al día y commitea arreglos reales en
`web-factory/apps/onia-platform/`) y **estuvo a punto de escribir la corrección**. En `origin/main`
esa sección ya decía `RESUELTO` hacía horas. Se salvó por casualidad: al ir a editar, comparó
contra `origin/main` primero.

Ese es el modo de falla exacto: **un carril cuyo trabajo es "que lo escrito sea cierto" auditando
una copia que ya no es lo escrito.** Gasta la vuelta entera re-corrigiendo lo corregido, y peor,
puede "arreglar" hacia atrás algo que otro carril ya dejó bien.

**No es sólo de este carril.** `/root/bin/onia-loop.sh` no tiene un solo `git fetch` ni
`git merge --ff-only` antes de trabajar (`grep -n "fetch\|pull\|rebase" /root/bin/onia-loop.sh`
sólo devuelve comentarios). Los siete carriles arrancan donde los dejó su vuelta anterior.

### 🔴 Re-medido el 2026-09-03: ahora se comió a la auto-cura

Un día después la distancia **creció** y el daño dejó de ser hipotético. Medido por el carril
`investigacion` sobre su propio árbol al arrancar la vuelta de las 03:26 UTC:

```
git rev-parse --short HEAD          → 287af2775
git rev-list --count HEAD..origin/main → 109      (eran 96 ayer)
git rev-list --count origin/main..HEAD →   2      (sigue siendo fast-forward puro)
```

**Y esta vez la copia vieja envenenó el chequeo de arranque**, que es justo el mecanismo que
existe para que el conjunto de loops se recomponga solo. Ese bloque manda comparar `crontab -l`
contra la tabla de `hermes-content/docs/cola/loops.md` — y la tabla que el carril leyó era la de
hace 109 commits:

| dónde | loops en la tabla |
|---|---|
| la copia del carril (`HEAD`) | 8 |
| `origin/main` (commit `1444125d5`, 2026-09-02 20:40) | **14** |

Los **siete invisibles** son `lucia`, `kpis-semanal`, `recorrido-cliente`, `web-factory-dev`,
`tendencias`, `calidad-generado` y `supervisor` — **los siete tienen su línea viva en
`crontab -l` ahora mismo**. Si a cualquiera de ellos se le hubiera caído el cron, el chequeo
habría mirado su tabla vieja, no lo habría encontrado, y habría reportado *"todo bien"* sin
rearmarlo. **La auto-cura no falla ruidosamente: informa salud.**

Es un escalón peor que el caso de `docs-auditoria`. Aquél gastaba una vuelta re-corrigiendo lo
corregido; éste **rompe la única red que protege a los otros trece loops**, y lo hace en silencio.

**Y casi se cobra una segunda víctima en la misma vuelta.** El carril iba a commitear su edición
del radar sobre esa base vieja. `git diff --stat HEAD origin/main` sobre este archivo daba
**+396/−123** y **nueve commits de otros carriles** que no veía (los ítems 28 a 31, y el §20
recontado en vivo de 3 → 8 commits). Commitear ahí no era "quedar atrás": era **pisar el trabajo
de tres carriles en el archivo que este loop existe para cuidar.** Se detectó por comparar contra
`origin/main` antes de escribir — la misma casualidad que salvó a `docs-auditoria`, que no es un
método.

**Arreglado a mano en esta vuelta, y eso es justamente el problema.** Se mergeó `origin/main` a
`claude/investigacion` (merge `c89fd4e3c`) con **5 bloques en conflicto, los 5 en este archivo**,
resueltos a favor de `origin/main` por ser la medición más nueva (01:40 y 02:49 UTC de hoy contra
17:36 y 21:40 de ayer). Eso arregla **un** carril, **una** vez. Los otros trece siguen arrancando
donde los dejó su vuelta anterior.

**No cambia la recomendación — la endurece.** Sigue siendo **(a)**, y los dos números de arriba
dicen por qué es segura acá: `origin/main..HEAD` = 2 con `HEAD..origin/main` = 109 es exactamente
el caso que `--ff-only` resuelve sin poder abrir un conflicto. Con la salvedad que esta vuelta
midió en carne propia: cuando **no** es fast-forward, `--ff-only` falla y avisa sin tocar nada —
que es el comportamiento correcto, porque el merge de verdad exigió cinco decisiones de contenido
que ningún automatismo puede tomar.

⚠️ **Daño colateral del rewrite del §20, que conviene mirar y no arreglo yo porque no es mi zona:**
la versión de `origin/main` que quedó —la buena, la recontada— **perdió la tabla de opciones
cotizadas** (A desplegar `master` · B cherry-pick sólo del icono · C no desplegar, con sus ~3 min
de build y el rollback por copia) y la reemplazó por *"Recomendación: hacerlo"*. La medición mejoró
y **la decisión quedó peor**: Sergio vuelve a tener un ítem sin costo ni alternativas. El texto
está en el historial (`git show 16816a03c`), listo para que la próxima vuelta lo reponga sobre los
números nuevos.

**Por qué no lo arreglo solo:** tocar el corredor cambia el comportamiento de **los siete
carriles a la vez**, y el prompt de este carril prohíbe tocar otro carril. Además hay un motivo
real para no sincronizar a ciegas: un `merge` automático puede abrir conflictos sin nadie que los
resuelva, y `CLAUDE.md` prohíbe soltar el turno con un merge abierto.

**Opciones cotizadas (todas Bs 0, trabajo de una vuelta):**

- **(a) `git merge --ff-only origin/main` al arrancar, y si NO es fast-forward, seguir igual y
  avisar por Telegram.** El `--ff-only` es la clave: nunca abre un conflicto — o adelanta limpio,
  o falla sin tocar nada. Cubre el caso de esta vuelta (el carril no tenía commits propios sin
  mergear: `git rev-list --count origin/main..HEAD` = 0). Toca `scripts/loops/onia-loop.sh` + su
  copia del VPS. **Recomendada.**
- **(b) Sólo `git fetch` + avisar la distancia**, sin mover el árbol. El carril decide qué hacer.
  Más conservador, pero deja el trabajo de decidir en cada vuelta.
- **(c) Que cada prompt lo haga por su cuenta.** Toca los 7 prompts en vez de 1 archivo, y se
  desincroniza igual que todo lo demás. No recomendada.
- **(d) Dejarlo.** Cada carril sigue auditando su foto vieja. El costo no es hipotético: ya
  quemó parte de una vuelta.

**Recomendación: (a).** Es la única que no depende de que alguien se acuerde, y por ser
`--ff-only` no puede dejar un merge abierto — que es justo lo que `CLAUDE.md` prohíbe.

---

## 26. Una rama de `onia-platform` lleva dos meses varada, y 10 de sus 11 modelos ya llegaron por otro lado (2026-09-02) — decisión de Sergio

**Cómo apareció:** contando ramas del segundo repo, que es lo que este loop hace cada vuelta.
`claude/onia-core-adoption-sprint5` es la **única** rama sin mergear a `origin/master` hoy
(`git branch -r --no-merged origin/master`). No estaba en la lista de carriles del integrador
porque **no es un carril**: no tiene loop.

**Lo medido, no supuesto:**

- **1 commit propio, 382 commits atrás de `master`.** El commit es `aa8f211`
  (*"feat(onia-core): add area + accounting + invoicing schema (Sprint 5)"*), del **2026-07-06** —
  casi dos meses. Toca 2 archivos: `prisma/schema.prisma` (+810) y una migración nueva
  (`20260706000000_add_onia_accounting_invoicing_area/migration.sql`, +340).
- **Mergearla a ciegas es pedir conflicto sobre el archivo más caro del repo.** Desde la base
  común, `master` movió `prisma/schema.prisma` en **+1.018 líneas**. Es el schema de la base de
  producción: un merge mal resuelto ahí no rompe un build, rompe datos.
- **Y sobre todo: casi todo su contenido YA ESTÁ en `master`.** De los 11 modelos que agrega,
  **10 ya existen** (`OniaAccountingAccount`, `FiscalPeriod`, `JournalEntry`, `JournalEntryLine`,
  `TaxRate`, `TaxDeclaration`, `RcvRecord`, `WithholdingRecord`, `FixedAsset`,
  `OniaInvoicingCreditDebitNote`). **El único que falta es `OniaCoreArea`.**

**O sea que la rama no es trabajo varado: es trabajo ya entregado por otro camino, con un
residuo de un modelo.** Mergearla entera para rescatar `OniaCoreArea` es pagar un conflicto de
schema de 1.000 líneas por una tabla.

**Las opciones, cotizadas (todas Bs 0):**

- **(a) Borrar la rama y, si `OniaCoreArea` hace falta, escribirlo como migración nueva sobre
  `master`.** Es lo barato y lo limpio: una migración chica, sin tocar las 1.018 líneas que
  `master` movió. Hay que confirmar antes que `OniaCoreArea` se use para algo — hoy no lo llama
  nadie. **Recomendada.**
- **(b) Dejar la rama como está.** Cuesta cero hoy, pero cada vuelta del integrador la vuelve a
  contar, y en dos meses más nadie va a saber qué tenía adentro. Es cómo nace un fantasma.
- **(c) Mergearla.** No la recomiendo y no la hago sin orden explícita: conflicto garantizado en
  `prisma/schema.prisma`, sobre el schema de producción, para traer 1 modelo de 11.

**Recomendación: (a).** Y mientras no se decida, el integrador **no la mergea** — queda anotado
en su propio prompt para que ninguna vuelta futura la levante por parecer "la única pendiente".

**Efecto colateral que ya se cobró solo, y vale más que la rama:** contar esta rama destapó que
el ítem bloqueado del `DELETE /api/payments/[id]` tenía una premisa falsa. Declaraba *"cero
`fiscal_period`, cero tabla de cierre en el repo"*, y `OniaAccountingFiscalPeriod` no sólo está
en `master`: **está aplicado en la base de producción** (`supabase-db`, tabla
`onia_accounting_fiscal_periods`, 0 filas) y **no lo llama nadie**. Su opción (b) estaba cotizada
en 3-4 días contando el modelado y la migración, que ya están hechos. Corregido en `COLA.md`,
sección "Bloqueado — necesita a Sergio".

---

## 27. ¿El bot toma el pedido, o lo sigue pasando a una persona? (2026-09-02)

**Qué se decide.** El requisito 2 del §5 dice que el cliente del cliente tiene que poder
**comprar** por chat sin fricción. Hoy el bot **detecta** la intención de compra y la pasa a un
humano. Mientras no se decida, el add-on de chatbot (Bs 390/mes, `lib/pricing.ts`) se vende como
canal de **atención** y no como canal de **venta** — que es lo que el requisito pedía.

> ⚠️ Ojo al citar archivos acá: el `intents.mjs` del VPS y el del repo **no son el mismo**
> (`espejo-check.mjs` lo lista entre los distintos). Todo lo de esta sección está medido sobre
> **el que corre** (`/proc/915791/root/tmp/onia-bot/`), donde la regex se llama
> `RE_INTERES_PEDIDO` (línea 155) y la expone `wantsToOrder` (línea 173).

**Lo que ya está puesto y no hay que pagar de nuevo** (todo medido hoy, no supuesto):

- Los **botones interactivos ya corren** (§5 arriba): un menú de hasta 3 opciones por mensaje es
  capacidad instalada, no trabajo nuevo.
- La base de producción **ya tiene las tablas de comercio**, contadas hoy con
  `docker exec supabase-db psql -U postgres -tAc "select count(*) from public.<t>"`:
  `onia_commerce_products` **3**, `onia_commerce_product_variants` **3**,
  `onia_commerce_orders` **0**, `onia_commerce_order_lines` **0**, `inventory_items` **0**.
  O sea: hay dónde guardar un pedido y **nunca se guardó ninguno**.
- El **cobro por QR del BCP ya está escrito y cableado**: `bcp-qr.mjs` (15.138 bytes) vive en el
  motor que corre y `webhook-server.mjs` lo referencia 4 veces.

**El detalle que decide todo, y es el que nadie tiene anotado:** ese módulo corre en
**`BCP_MODE=mock`** — leído del entorno del proceso vivo (`/proc/915791/environ`), no de un doc.
Está ejercitando el circuito entero contra un banco falso. Y su propia regla 1, escrita en la
cabecera del archivo, es: *"EL BOT JAMAS COBRA SOLO. `/bcp/cobrar` lo llama una persona"*.

| opción | qué cuesta | cuánto tarda | qué se pierde |
|---|---|---|---|
| **A — seguir derivando** (lo de hoy) | Bs 0, cero trabajo | ya está | El requisito 2 queda sin cumplir: el chatbot se vende como atención, no como venta |
| **B — el bot arma el pedido, el cobro lo dispara una persona** | Bs 0 de proveedores. Trabajo: escribir el flujo de pedido y llenar `onia_commerce_orders` (hoy 0 filas). **NO depende del banco** | No acotable en esta vuelta — ver "qué falta medir" | Nada externo. Pero obliga a mover la copia de venta en el mismo paso (abajo) |
| **C — el bot toma el pedido Y cobra solo por QR** | Bs 0 de código nuevo de cobro (ya escrito), pero **bloqueado**: exige `BCP_MODE=real` + credenciales del BCP, que el banco no entregó | **No elegible hoy** | — |

**Recomendación: B.** Es la única que avanza sin depender de un tercero: los botones y las tablas
ya están, y `onia_commerce_orders` en **0 filas** es la medida exacta de lo que falta — no falta
infraestructura, falta el flujo que la use. C no se puede elegir aunque se quiera, porque el riel
de cobro real no existe todavía.

**Lo que NO es opción, y por qué:**

- **C no es "casi C".** Que `bcp-qr.mjs` esté escrito y pase sus tests **no** significa que pueda
  cobrar: `BCP_MODE=mock` es un banco simulado. Darlo por listo es exactamente el error que
  `CLAUDE.md` llama *construido ≠ terminado*.
- **B no se puede encender en silencio.** Es el mismo caso que la agenda (ver "Cerradas → B"): el
  día que el bot tome pedidos, `ONIA_CATALOGO_DE_VENTA.md` —que hoy dice que un pedido *"lo
  ESCALA a una persona"*— pasa a estar **mintiendo al revés**, y la guarda
  `scripts/venta-honestidad.test.mjs` se pone roja a propósito. Copia y motor se mueven **en el
  mismo paso**, o no se mueve ninguno.
- **Y ojo con el borde real:** hay **3 productos** cargados y **0 items de inventario**. Un bot
  que toma pedidos sin stock detrás promete lo que el negocio no sabe si tiene.

**Qué falta medir para poner el "cuánto tarda"** (no se inventa acá): el flujo de pedido no
existe en ninguna forma —0 apariciones de carrito/checkout en los 59 `.mjs` del motor—, así que
estimarlo exige que el carril dueño del bot lo diseñe primero. Este loop no toca código.

---

## 28. Un loop escribe ítems y NINGUNO tiene bandeja de entrada: `canario-visual` no puede recibir trabajo (2026-09-02) — decisión de Sergio

**Qué se midió, leyendo los prompts que corren HOY** (`/root/bin/loops/*.md`, no de memoria):

- De los siete loops del VPS, **seis nombran la cola de la que sacan trabajo**. `canario-visual`
  **no nombra ninguna**: su prompt sólo cita `ONIA_RADAR_DECISIONES_PRODUCTO.md` y
  `cola/loops.md`.
- Y su prompt lista *"Arreglar el defecto que encontrás"* entre sus **PROHIBICIONES** — junto con
  *"Tocar otro carril más allá de escribir el ítem en su cola"*. Está diseñado como **productor
  puro**: mira pantallas, escribe ítems en la cola del dueño, no arregla nada.

**Por qué importa, con el costo contado.** El 2026-09-02 una vuelta de `onia-cola` escribió en
`COLA.md` el ítem del 429 de Chatwoot y lo cerró con *"No lo tomo yo: el archivo es del carril
`canario-visual`, cuyo loop corre a las 16:41 UTC"*. Ese destinatario **no puede tomarlo por
construcción**: ni lo ve (no lee `COLA.md`) ni podría arreglarlo (lo tiene prohibido). El ítem
quedó de carta muerta al tope de "Ahora" y **consumió tres vueltas** del integrador —12:35 lo
re-midió, 15:35 y 16:34 lo saltaron—, cada una gastando su Gate 1 en un ítem que nadie iba a
hacer nunca.

Es la forma espejo del agujero que este carril ya pagó dos veces (*"un carril que el integrador
no enumera no se cuenta nunca"*): acá **un ítem que su destinatario no puede leer no se hace
nunca**, y encima tapa la cola.

**Las tres opciones, cotizadas:**

| | Qué se hace | Cuesta | Qué queda |
|---|---|---|---|
| **A** | Al que escribe un ítem se le prohíbe derivarlo a `canario-visual`: si el arreglo cae en un archivo sin dueño con loop propio, **lo toma quien lo encontró**. Sólo se toca el prompt de `onia-cola`. | ~15 min, 1 archivo | El más barato. Pero deja intacta la asimetría: el canario sigue sin bandeja, y otro loop puede volver a derivarle |
| **B** | `canario-visual` estrena cola propia (`hermes-content/docs/cola/canario.md`) y su prompt la lee. Deja de ser productor puro. | ~40 min, prompt + cola + `loops.md` | Simétrico con los otros seis. **Contra:** su prompt prohíbe arreglar a propósito —"si lo arreglás vos, dos manos tocan el mismo archivo y el dueño pierde su cola"— así que esto **reabre una decisión ya tomada**, no la ejecuta |
| **C** | Se le da dueño explícito a `scripts/canario_visual.mjs` en `COORDINATION_MANIFEST.md` y ese dueño es `onia-cola` (el integrador), no el canario. | ~20 min, 1 tabla | Resuelve el caso concreto y todos los futuros del mismo archivo, sin tocar el diseño del canario |

**Lo que este loop recomienda: C.** El canario fue diseñado a propósito para no arreglar —esa
regla tiene su historia escrita y no hay que reabrirla—, así que el defecto no es que le falte
bandeja: es que **su propio script no figura como de nadie**, y por eso cada quien se lo deriva
al otro. Poner el dueño en la tabla cierra la causa sin discutir el diseño.

**Lo que NO hace falta decidir para avanzar:** el 429 en sí. Es autoinducido (24 pedidos al host
de Chatwoot por pantalla, medidos del lado del navegador, todos 200 en la última corrida) y
ningún visitante real lo sufrió — cero IPs de terceros bloqueadas en 24 h, medido dos veces. No
corre riesgo mientras esto se decide.

---

## 29. Tres packs de carrusel quedaron fuera del motor porque sus archivos viven en el carril de contenido (2026-09-02) — decisión de Sergio

**Qué se midió, ejecutando el render (no leyendo la lista).** El merge del carril de Lucía a
`main` agregó cuatro packs a `PACKS` de `scripts/carousel_render.js`, que es **la lista blanca
del CLI**. De los cuatro, sólo `bloque-solido` trajo su módulo:

| pack | ¿en `PACKS`? | ¿su archivo en `main`? | qué pasaba al renderar |
|---|---|---|---|
| `bloque-solido` | sí | sí (`carousel_pack_solido.js`) | **renderiza** |
| `papel-subrayado` | sí | **no** | `Pack no disponible (./carousel_pack_papel falta en el repo)` |
| `dato-ilustrado` | sí | **no** | `Pack no disponible (./carousel_pack_dato falta en el repo)` |
| `tarjeta-empleado` | sí | **no** | `Pack no disponible (./carousel_pack_empleado falta en el repo)` |

Los tres archivos **sí existen**, commiteados el 27 y 28 de agosto — pero **sólo en
`claude/ads-creatividades-publicos`**, el carril de contenido, que el integrador tiene prohibido
mergear (*"el de contenido lo maneja su sesión"*, Sergio 2026-09-01). Nunca llegaron a `main`.

**Por qué importaba.** Como los packs se cargan perezoso, el CLI **aceptaba** `--pack
dato-ilustrado` y reventaba después, al renderar: una entrada de menú para un plato que la cocina
no puede hacer. Y el test que debía cazarlo comparaba `PACKS` contra un literal —la constante del
motor contra una copia de sí misma—, así que pasaba con el nombre puesto sin mirar nunca el
render. Ya había rotado igual el 2026-08-20 con `editorial-clean`.

**Qué se hizo en la misma vuelta** (commit `032ca24e`): los tres salen del registro con el
comentario que los devuelve en una línea, y se agrega el test `todo pack listado RENDERIZA`, que
llama a cada renderer y exige HTML completo. `main` volvió a verde.

**Lo que queda para Sergio, y es una sola pregunta:** los tres packs son trabajo terminado que
está varado en el carril de contenido. Vuelven solos cuando ese carril cierre y sus archivos
entren a `main` — no hay nada que construir.

| | Qué se hace | Cuesta | Qué queda |
|---|---|---|---|
| **A** | Nada ahora: entran cuando Sergio cierre el carril de contenido. | 0 | Los tres packs siguen sin poder usarse hasta ese día. Es el estado de hoy |
| **B** | Sergio autoriza traer **sólo esos 3 archivos** del carril de contenido (cherry-pick de `5e8d66cd`, `8c7638b6`, `12c8b3f0`, que tocan un archivo nuevo cada uno). | ~15 min, 3 archivos nuevos, cero borrados | Los packs quedan usables ya. Requiere permiso explícito: hoy ese carril es intocable para los loops |

**Lo que este loop recomienda: B**, si Sergio va a querer esos packs antes de cerrar contenido —
son tres archivos nuevos que no pisan nada, y el guard nuevo verifica solo que rendericen al
volver a listarlos. Si no hay apuro, **A** no cuesta nada.
---

## 30. La home dice "5 rubros vivos en producción hoy" y el catálogo dice que vivo = un cliente real lo usó (2026-09-02) — decisión de Sergio

**Está vivo en producción ahora**, verificado con `curl https://onia.com.bo/` contra el
contenedor `onia-landing` (no `main`, no Vercel): la primera banda debajo del hero —la que el
código rotula *"BANDA DE PRUEBA — solo hechos verificables, cero logos/testimonios"*
(`web-factory/apps/onia-platform/src/app/(sitio)/page.tsx:492-499`)— abre con
**`5` · "rubros vivos en producción hoy"**.

**El choque, y por qué no es una discusión de palabras.** El catálogo es la fuente de verdad
de qué se vende y **define su propio vocabulario** (`ONIA_CATALOGO_DE_VENTA.md`, tabla "Los
tres estados"):

- 🟢 **Vivo** = *"tiene tablas, pantallas y **un cliente real lo usó**"*.
- Y dos líneas después, el mismo archivo: *"La base de producción sigue con **0 organizaciones
  de cliente**, así que 🟡 es el estado por defecto de casi todo"*.
- En la tabla de rubros, sólo Clínica dental lleva *"el único con recorrido real"*.

O sea: por el diccionario que nos escribimos nosotros, **cero rubros están "vivos"**, y la home
declara cinco. Lo que el catálogo sí respalda es otra frase: *"desde el 2026-08-30 los CINCO
ofrecidos **se pueden vender**"*. La cifra `5` es correcta; el que no calza es el adjetivo.

**Por qué lo traigo acá en vez de arreglarlo yo**, que es lo que este carril hace con un
defecto:
1. **No es un defecto, es una promesa** — y la regla de `CLAUDE.md` dice que una promesa que
   cambia *"se barre en TODA la superficie, no solo donde la estabas tocando"*. `/rubros` dice
   **"Cinco rubros vivos y vendibles hoy"** (verificado en producción y en
   `(sitio)/rubros/page.tsx:164`). Tocar sólo la home deja las dos páginas discrepando, que es
   exactamente el bug que esa regla existe para evitar.
2. **El que vende sos vos.** Cuál de las dos lecturas querés que reciba un lead —"cinco rubros
   ya andando" vs "cinco rubros que puedo venderte hoy"— es decisión comercial, no un typo.

**Tres caminos, ninguno cuesta plata y ninguno toca el diseño:**
- **a) Alinear con el catálogo (barato y seguro).** `5` → *"rubros que se venden hoy"* en la
  home, y `/rubros` a la frase equivalente. Una vuelta, dos archivos, cero píxeles movidos, y
  la banda vuelve a cumplir lo que su propio comentario promete ("hechos verificables"). Es lo
  que yo elegiría.
- **b) Cambiar la palabra, no el marco.** *"rubros encendidos en producción hoy"*: es
  literalmente cierto (los cinco tracks están activos en el `app.env` de producción) y conserva
  el peso de "producción". Mismo costo que (a).
- **c) Dejarlo.** Si tu lectura de "vivo" es "el software del rubro funciona", no hay nada roto
  y se anota acá como excepción para que ninguna vuelta futura lo vuelva a levantar. Costo
  cero — el riesgo es que "en producción hoy" le suene a un lead como "ya hay cinco rubros de
  clientes usándolo", que es la prueba social que no tenemos.

**Lo que NO pude contar yo:** cuántas organizaciones de cliente hay hoy en la base. Ese dato
vive en la base self-hosted del VPS y es del carril `onia-db`; el "0" de arriba es del catálogo,
no un `SELECT` de hoy. Si ese número cambió, cambia el color del ítem —pero no la opción (a),
que es correcta con cualquier número.

## 31. Falta un TERCER deploy que la sección 16 no nombra: el del sitio de venta (2026-09-02) — decisión de Sergio

**El agujero.** La sección 16 de este mismo radar pide dos deploys —(a) el motor del bot y (b) el
script de marca de Chatwoot— y **ninguno de los dos publica `onia.com.bo`**. Esa la sirve el
contenedor `onia-landing`, que es un tercer deploy que nadie estaba pidiendo. Resultado: los
arreglos de la cara del producto se verifican, se commitean, y se quedan.

**Medido hoy, mirando producción con Chromium real (no `headless_shell`) en iPhone 390×844:**

- `onia.com.bo/` cierra con **73 px** de franja clara debajo del pie negro; `/empezar`, con
  **74 px**. Son los mismos dos números que el commit `f0248601` midió y arregló.
- El contenedor arrancó **16:53 UTC**; el arreglo se commiteó **19:59 UTC**. Sirve código de
  antes: no es que el arreglo falle, es que nunca se publicó.

**Lo que está listo y esperando** (rama `claude/web-venta`, gates verdes, mirado renderizado):

| Commit | Qué arregla en la pantalla que ve el lead |
|---|---|
| `36d2576d` | La home abría con una franja en blanco en el iPhone más común |
| `f0248601` | Las dos pantallas cerraban con una franja clara bajo el pie negro |
| `2dbb3acf` | El test que impide que esa franja vuelva |
| `def54931` | El guard de capturas era ciego a 4 rutas publicadas y a la cabecera |

**Por qué no lo decido yo.** Publicar `onia.com.bo` es tuyo, y con razón: el 2026-08-20 se
publicó una landing que no habías visto y hubo que revertir en producción. Esto **no es** ese
caso —son cuatro arreglos de defecto, cero cambio de dirección visual, cero copy nuevo— pero el
permiso de publicar sigue siendo tuyo.

> ✅ **La mitad que dependía de un loop ya está hecha (2026-09-02, `onia-cola`).** Los 7 commits
> de este carril están en `main` (merge `d700da8`, `npm test` exit 0). Lo que queda **no es un
> merge: es el deploy**, y ese sigue siendo de Sergio. El camino (a) de abajo ya no espera nada.

**Tres caminos, ninguno cuesta plata:**
- **a) Desplegar `onia-landing`** (`scripts/deploy-onia-landing.sh`, que ya corre `tsc --noEmit`
  antes del build). ~~cuando `onia-cola` mergee a `main`~~ — ya mergeado, la condición se cumplió.
  Es lo que yo elegiría: son defectos, no diseño.
- **b) Mirar primero.** Te mando las capturas del build local (pie al borde, sin franja) y
  desplegás después. Cuesta una vuelta más y cero riesgo.
- **c) Esperar y juntar.** Cada vuelta de este carril suma arreglos que valen cero hasta el
  deploy; la deuda crece pero el sitio no empeora.

**Lo que este carril NO puede hacer:** el deploy en sí, ni el merge a `main` (es de `onia-cola`).
Mientras tanto, la definición de hecho de `CLAUDE.md` —*"encendido en producción y verificado
ahí"*— dice que estos cuatro commits valen **cero**.

### ⚠️ Ya no hay nada que esperar: la condición de la opción (a) se cumplió (2026-09-03)

La opción (a) decía *"desplegar **cuando** `onia-cola` mergee a `main`"*. **Ya mergeó.** Los
cuatro commits son ancestros de `origin/main` (`git merge-base --is-ancestor`, verificado uno por
uno). Esto deja de ser una espera y pasa a ser **un comando**: `scripts/deploy-onia-landing.sh`.

Se reverifica porque un bloqueo vencido es peor que un pendiente fantasma: le pide a Sergio una
decisión que las condiciones ya tomaron por él.

**Y un reinicio NO alcanza — medido hoy, no supuesto.** El contenedor `onia-landing` se levantó
de nuevo anoche (~3 h de `Up`) y **sigue sirviendo la franja**: su `.next/BUILD_ID` es del
**2026-09-02 16:52 UTC** y el arreglo se commiteó a las **19:59 UTC** del mismo día. Reiniciar
vuelve a servir el mismo bundle; hay que **rebuildear**. Quien lo intente por el camino corto va
a ver el contenedor sano y la franja viva, y no es una contradicción.

**La prueba de que no hay código que tocar la escribe el gate, no esta sesión:**
`node scripts/mirar-venta.mjs --comparar-con=<informe de la rama>` sale **exit 3** —
*"6 fallas YA ARREGLADAS en la rama — falta PUBLICAR, no tocar código"*. El build de la rama sale
sin defecto medible en las 10 vistas; producción falla en 6 (320 · 390 · 768, las dos pantallas).
Capturas miradas: `/tmp/venta-0903/` (producción, franja viva) y `/tmp/venta-rama/` (pie al borde).

### ✅ Opción (b) EJECUTADA — las capturas ya están en tu Telegram (2026-09-03 04:5x UTC)

La opción (b) decía *"te mando las capturas del build local y desplegás después"*. Estaba escrita
como oferta y nunca se hizo: las capturas vivían en `/tmp` del VPS, donde no las ves. **Ya te
llegaron las dos** (`pie-hoy.png` y `pie-arreglado.png`, home en teléfono 390 px) por el mismo bot
de Telegram, vía `sendPhoto`. La decisión ya no te pide imaginar el resultado.

**Y el remedio dejó de ser una hipótesis.** Hasta hoy el radar decía que publicar cierra la franja
porque el gate compara informes. Esta vuelta se probó por el camino que importa: `next build` +
`next start` del código de la rama, servido de verdad, medido con el mismo instrumento que midió
producción. **6 de 6 combinaciones** (320 · 390 · 768 × `/` y `/empezar`) pasan de franja a cero, y
se ve la causa exacta en el DOM: `body.paddingBottom` **73,6 px → 0 px**. Producción, medida en la
misma corrida, sigue en 73–74 px en las 6.

Importa la distinción porque el 2026-09-03 ya se anunció un arreglo del bot que no arreglaba nada:
**una hipótesis no probada no se anuncia como arreglo**. Ésta se probó antes de contarla.

**Verificado de paso, sin hallazgos** (para que la próxima vuelta no lo re-mida): las dos pantallas
no exhiben obra —el `borrador` que aparece en la home es vocabulario del producto, *"te espera el
borrador de a quién llamar, para que lo apruebes"*, no estado de construcción— y los precios
publicados (320 · 750 · 1.500) coinciden **exacto** con `DEFAULT_PLAN_AMOUNTS` de
`onia-platform/lib/subscription-plans.ts`, sin `SUBSCRIPTION_PRICE_*` pisando nada en el
contenedor de producción. El sitio publica lo que el checkout cobra.

---

## 32. Nuestros propios loops agotan el cupo del widget de chat, y el canario lo reporta como caída (2026-09-03) — decisión de Sergio

**Lo medido, en vivo, no heredado.** El widget de Chatwoot devuelve **429** en `/chatbot`,
`home` y `/empezar`. Es real: `curl` plano, cinco de cinco, "Retry later". Pero **no es una
caída y no afecta a ningún cliente**:

- El servicio está sano: `/`, `/api` y el SDK dan **200**; sólo `/widget` da 429.
- Chatwoot limita `/widget` sin `cw_conversation` a **5 cargas por hora POR IP** (initializer de
  Rack::Attack, línea 176, dentro del contenedor). Ese límite **no tiene variable de entorno
  propia**.
- El contador de Redis está a nombre de **una sola IP: `187.77.16.63`, la del propio VPS**, con
  34 cargas contra un límite de 5. **En 6 h, las 222 peticiones al widget salieron de esa misma
  IP.** Cero visitantes reales.
- Cada visitante real cuenta con su IP y su cupo: **su chat abre normal.** Verificado que el
  proxy sobrescribe `X-Forwarded-For`, así que Chatwoot ve IPs de visitante de verdad y no una
  IP compartida — si las colapsara, ahí sí un cliente se comería el 429 de otro.

**El costo, contado:** el ítem ya consumió **cuatro vueltas** de `onia-cola` como 🔴 "la página
que VENDE el chatbot es la única del sitio sin chat". Y se va a repetir: el canario corre 8×/día
y cada pasada vuelve a gastar el cupo, fotografía el 429 y lo reporta de nuevo.

**El daño que sí es real, y es de medición:** mientras nuestra IP esté limitada, **el canario es
estructuralmente incapaz de ver el widget como lo ve un cliente** en cualquier pantalla que lo
lleve. Es la regla nº4 del prompt (medí con el instrumento correcto) con otro disfraz.

**Las opciones, cotizadas:**

- **a) Safelistear la IP del VPS** — `RACK_ATTACK_ALLOWED_IPS=187.77.16.63` en el contenedor
  `onia-chatbot_chatwoot`, más reinicio. El initializer ya lo soporta de fábrica
  (`Rack::Attack.safelist('trusted IPs')`), así que es **encender, no construir**. Nuestro
  monitoreo deja de gastar cupo y vuelve a ver lo que ve el cliente; **el cliente conserva su
  protección de 5/hora** contra bombardeo de conversaciones. Costo: un cambio de env + un
  reinicio del chat (corta conversaciones vivas unos segundos). **Es la que recomiendo.**
- **b) Apagar el throttle del widget entero** — `ENABLE_RACK_ATTACK_WIDGET_API=false`. Más
  simple, pero se lleva puesta también la protección anti-bombardeo de conversaciones y de
  contactos. **No la recomiendo:** desprotege al cliente para arreglar un problema nuestro.
- **c) No tocar producción y bajarle la mano al monitoreo** — que los loops dejen de cargar el
  widget. Cero riesgo y cero permiso, pero no arregla la ceguera: el canario seguiría sin poder
  mirar el chat, que es justo lo que tiene que mirar.

**Lo que ya está hecho y no espera a nadie:** la sonda
`hermes-content/deploy/vps-ops/widget-429-de-quien.sh` contesta "¿es nuestro o del cliente?" en
segundos, con el contador y el desglose de IPs a la vista, y está probada en los **dos** sentidos
(con la IP real dice `AUTOINDUCIDO`; forzando otra IP alerta `puede haber clientes afectados`).
Con eso, la próxima vuelta que vea un 429 no vuelve a gastar una sesión derivándolo.

**Lo que depende de Sergio:** sólo el OK para (a) — es un cambio de entorno en el contenedor de
chat de producción, con reinicio, y eso no se toca sin su palabra.

⚠️ **Corregido el 2026-09-03 ~12:50 UTC por el carril `web-venta`, que es el dueño de las
pantallas: la premisa "cada visitante real cuenta con su IP y su cupo: su chat abre normal" es
FALSA a partir de la tercera pantalla, y con eso (a) deja de alcanzar.** El diagnóstico de arriba
es correcto en todo lo demás — el 429 es autoinducido y el servicio está sano —, pero le falta un
factor de 2 que cambia la conclusión:

- **Cada página vista cuesta DOS cargas del cupo, no una.** El sitio usa `<a>` planos a propósito
  (`web-factory/apps/onia-platform/src/app/(sitio)/nav.ts:11`: *"una navegación completa cierra
  cualquier menú abierto sola"*), así que **cada clic del header recarga el sitio entero** y
  vuelve a pedir el SDK. Medido con clics reales: 4 clics → `RECARGA` las 4 veces → **10
  peticiones** al endpoint del widget.
- **Contra un límite de 5/hora/IP, eso agota el cupo del visitante en la 3.ª pantalla.** Medido
  en una corrida limpia de 5 páginas: `home` y `precios` con burbuja (200); `empezar`, `rubros` y
  `chatbot-landing` **sin burbuja** (429). Ese es el recorrido de alguien interesado, no un
  bombardeo — y pierde el chat justo cuando más lo iba a usar.
- **La ventana no perdona:** tras ~15 peticiones, **3 minutos de espera no la recuperaron**.
- **Lo que NO pude medir, y no lo adivino:** en qué página exacta cae un lead con IP fresca. Haría
  falta una segunda IP y desde el VPS no hay (`WebFetch` no está autorizado en sesión no
  interactiva). Sostengo el número por el límite documentado (5/hora) × 2 cargas por página, no
  por haberlo visto desde fuera.

**Qué cambia para la decisión:** (a) sigue siendo correcta y **sigue siendo la que recomiendo**,
pero ahora hay que saber que **arregla nuestra ceguera de medición, no el chat del lead**. Para el
lead, las salidas son subir el límite del throttle del widget (no tiene env propia: es el
initializer línea 176) o dejar de recargar el SDK en cada página — y esto último **no se hace con
`next/link`**: rompería el cierre del menú de teléfono, que es el motivo por el que los `<a>` son
planos. Cotizar eso es trabajo de otra vuelta; lo que no se puede es aprobar (a) creyendo que con
eso el visitante recupera el chat.

---

## 33. El bot NO puede decir un precio, y los precios están publicados en la web (2026-09-02) — decisión de Sergio

**Medido, no supuesto.** El motor tiene un candado explícito: el guardrail `declara_precio`
(`/opt/onia/bot/guardrails.mjs:27`) rechaza **todo string con una cifra de plata**
(`/\d+\s*bs\b/`), y el allowlist de la capa de conocimiento
(`/opt/onia/bot/knowledge.mjs:74`) no tiene ningún campo `precio`, `planes`, `desde` ni
`tarifa` — textual: *"no hay dónde escribir una cifra"*. Su razón, también textual:

> `N1 — el bot no cotiza: el precio depende del plan y de los módulos que use el negocio`

Se descubrió al intentar cargar el conocimiento real de Onia: el borrador con los planes
**lo rechazaba el validador entero** (40 errores, `node knowledge.mjs --check`). Las cifras
estaban bien —320/750/1500/2900 y 390/150/70, verificadas contra
`lib/subscription-plans.ts` y `lib/pricing.ts`—; el problema es que **no hay dónde ponerlas**.

**Lo que hace que la decisión valga la pena mirarla hoy:** el candado se escribió cuando el
precio dependía de una demo. Hoy los planes están **publicados en la web** con esos mismos
números. O sea que el bot le contesta *"eso lo ve Sergio"* a alguien que puede leer el precio
en `onia.com.bo` dos clics antes. La pregunta de precio es, además, la más frecuente de un
desconocido que escribe por WhatsApp.

**Las dos opciones, cotizadas:**

| | Qué se hace | Costo | Riesgo |
|---|---|---|---|
| **A. Se queda como está** | Nada. La pregunta de precio ya cae al embudo de demo desde el commit `f22f47bcb` (9 disparadores nuevos: "planes", "cuánto sería", "qué incluye", "quiero contratar") | **Cero** — ya está hecho y commiteado | El lead que sólo quería un número se va a buscarlo a la web, o no lo busca |
| **B. El bot dice el precio de lista** | Un campo `planes` en el allowlist, alimentado desde `subscription-plans.ts` (no escrito a mano), y afinar `declara_precio` para que permita SÓLO ese campo | ~1 vuelta de carril, con test en rojo primero | Un precio desactualizado en un canal que no se mira. Se mitiga leyendo de la fuente, no copiando |

**Lo que NO se hizo a propósito:** meter los precios por la ventana (el nombre de un producto
sí pasa el guardrail — `productos[].nombre` no lo dispara). Sería esquivar un candado
deliberado con una decisión de producto adentro, que es de Sergio y no de una vuelta de loop.

**Dónde está el trabajo hecho:** `hermes-content/deploy/vps-ops/bot/knowledge.onia.json`,
verde contra el validador. **Commiteado, NO desplegado**: se instala con
`/opt/onia/bot/webhook-server.sh knowledge` y eso cambia lo que oye un lead real.

---

## 34. NUEVE commits de plataforma sin desplegar, y el próximo despliegue tiene un ORDEN que no se puede invertir (2026-09-03) — ✅ RESUELTO 2026-09-04 03:45 UTC, ya no hay decisión

> ✅ **Los 9 commits YA ESTÁN DESPLEGADOS y la migración YA está aplicada. Esta sección no pide
> nada.** Recontado en vivo el 2026-09-04 03:45 UTC, no releído: los nueve
> (`22fd088`, `15e3910`, `675541b`, `3523c79`, `503af44`, `d62beeb`, `efaffe8`, `bdf0935`,
> `5888a13`) son ancestros del build que corre —`git merge-base --is-ancestor <sha> 858752a`
> devuelve 0 en los nueve— y la columna que exigía el orden existe:
> `select count(*) from information_schema.columns where column_name='chatwootWhatsappInboxId'`
> → **1**. Producción pasó por tres swaps desde entonces (`1f0b221` → `b84811d` → `858752a`).
>
> **Por qué se cierra y no se actualiza el número:** el ítem estaba anclado a `8a3b5a6`, que dejó
> de ser lo desplegado hace días. Reescribirle la cifra lo dejaba pidiendo el mismo deploy por
> cuarta vez con un cuarto número. **Un bloqueo vencido es peor que un fantasma: le pide a Sergio
> una decisión que ya tomó.**
>
> 🔴 **El deploy pendiente de HOY vive en el tablero, no acá: `t_ad4ff5b2`** — 21 commits,
> `70b6ed3` ya buildeado y montado (`BUILD_ID HV_nkT9A09xv6XzBeNjVC`), falta el swap. El más caro
> es la reescritura del login con bloqueo por intentos y 2FA. **Un solo lugar pide el deploy, y es
> el tablero** — que es donde Sergio contesta `ok <id>`.

**Lo que sigue es la HISTORIA de ese despliegue, ya ejecutado. No es un pedido.**

**Lo desplegado ENTONCES (2026-09-03) era `8a3b5a6`** —hoy corre `858752a`—, verificado por
`BUILD_ID` y no por fecha: tanto
`/opt/onia-platform/runtime-next/.next/BUILD_ID` como `/opt/onia-platform/build-8a3b5a6/.next/BUILD_ID`
dan `lNDdVgrRvP1mizzu3BVXc`. (El contenedor arrancó de nuevo el 2026-09-03 00:03:32 UTC, pero
**reiniciar no es desplegar**: monta el mismo `runtime-next`.) Todo lo que entró a `master`
después sigue sin llegar al cliente — **29 archivos, +1162/−45**, de los cuales 9 son tests o
snapshots:

| commit | qué arregla | quién lo sufre hoy |
|---|---|---|
| `22fd088` | el menú dibujaba `ASSIGNMENT_TURNED_IN` en letras gigantes | **todo el que abre el dashboard**, en cada pantalla |
| `15e3910` | el que PAGA el add-on quedaba sin bandeja hasta encontrar un botón | el cliente que ya pagó |
| `675541b` | el editor le decía "La cita" y "en el consultorio" a una ferretería | los rubros que no son dental |
| `3523c79` | el cliente puede conectar SU WhatsApp (mitad servidor) | el add-on de WhatsApp, hoy inentregable |
| `503af44`, `d62beeb` | merge + cablear el gate de iconos al CI | nadie (interno) |
| `efaffe8` | CSP para el beacon de Cloudflare Analytics | la medición |
| `bdf0935` + `5888a13` | **el login le deletrea los nombres de los iconos al lector de pantalla**, y si la fuente tarda más de 12 s se los muestra como texto (`bolt`, `credit_card_off`) | quien entra con lector de pantalla, y cualquiera con red lenta |

*(las dos últimas filas venían de la §20 y faltaban acá: son los dos commits que completan los 9.)*

El más caro es `22fd088`: no es sutil ni intermitente, es una palabra en mayúsculas gigantes en
**toda** pantalla del dashboard, y lleva así desde el 09-02.

### 🔴 El orden importa, y al revés rompe la plataforma entera

`3523c79` agrega la columna `clinic_settings.chatwootWhatsappInboxId` y la **selecciona** en
`/api/chatbot-canal-whatsapp` y en el `include` del perfil. Prisma no degrada: si el código sale
antes que la columna, revienta la consulta y se cae la pantalla de chatbot **para todos**, no sólo
para el que intenta conectar WhatsApp. O sea: un despliegue en el orden equivocado convierte un
add-on nuevo en una caída general.

1. `prisma/migrations/20260903000000_add_chatwoot_whatsapp_inbox` (runbook quirúrgico —
   `ALTER TABLE ... ADD COLUMN` nullable, no toca ni una fila de las 4 orgs vivas).
2. `META_APP_ID=1078962684709749` y `META_CONFIG_ID=1824225392073753` en el `app.env`.
   Son los IDs **públicos** de la app "Onia Bot"; el `APP_SECRET` no va acá y no debe: vive sólo
   en Chatwoot, que es quien canjea el código.
3. Recién ahí, el build y el swap.

**Por qué es de Sergio y no de una vuelta de loop:** desplegar al VPS necesita su OK explícito, y
tocar la base de producción va por el runbook. Lo que sí es nuestro —el código, los tests, la
migración escrita y la nota de orden— ya está hecho.

**Lo que se destraba al desplegar:** el punto 3 del tablero `t_43947a6a` (la tarjeta del panel con
el Embedded Signup de Meta) no se puede construir antes, porque es una pantalla de cliente y la
regla es abrirla y MIRARLA renderizada — imposible mientras la columna no exista.

### Lo que Sergio tiene que saber antes de decir que sí (venía de la §20)

⚠️ **`15e3910` es código de plata.** El resto de la pila no toca base, pagos ni sesiones; ése sí
toca `app/api/admin/subscription-payments/route.ts`, la ruta que aprueba pagos. Lo que agrega es
un efecto **posterior** a la transacción del cobro —crear el inbox de Chatwoot— envuelto en
`try/catch`: no puede hacer fallar ni revertir una aprobación. Hay un test que lo prueba con
Chatwoot caído, y otro que fija que aprobar un plan normal **no** cree inbox (regalarlo sería
entregar gratis un add-on de Bs 390). Aun así merece decirse en voz alta, no quedar tapado.

⚠️ **Dos huecos que este deploy NO cierra** (ítems del carril producto, no decisión de Sergio):
`scripts/subset-iconos.mjs` **se rinde en silencio y sale 0** si falta `pyftsubset` —el build
publica la fuente vieja sin avisar—, y `e2e/iconos.spec.ts` sólo mira `/`, `/login` y `/register`,
así que el sidebar (que exige sesión) no aparece en ninguna de las tres. **Por eso nadie atajó el
`ASSIGNMENT_TURNED_IN` gigante**: el gate que debía verlo no abre ninguna pantalla con sesión.

## 35. El carril de contenido puede estar corriendo DOS veces: se montó en el VPS "en pausa" y su cron quedó activo (2026-09-03) — decisión de Sergio

**Lo medido en el VPS**, no deducido:

- `crontab -l | grep onia-loop.sh` → `11 */3 * * * /root/bin/onia-loop.sh contenido-cola`.
  **Activa, sin comentar.**
- Worktree `/root/loops/onia-hermes-contenido-cola` existe, parado en
  `claude/ads-creatividades-publicos` (no en `claude/carril-contenido`, la de Sergio — eso está
  bien y es deliberado).
- Prompt en `/root/bin/loops/contenido-cola.md`.

**La contradicción:** el commit que lo montó (`c43b04a24`, sesión de control) dice textual *"en
pausa hasta que Sergio apague el de Windows"*. Pero *en pausa* no se implementó en ningún lado: la
línea de cron está viva y el loop se dispara cada 3 horas. Lo único que lo venía frenando era un
**accidente** — el corredor no tenía su `case` y moría con `exit 64`. Ese accidente se arregló hoy
al mergear esa misma rama a `main`, así que **a partir del próximo sync el loop arranca de
verdad.**

**Por qué es de Sergio:** desde el VPS no se puede ver si la tarea de Windows sigue registrada —
`list_scheduled_tasks` vive en la app de Claude Code de su laptop, y este loop no la alcanza. Sólo
él puede mirarlo.

**Las dos opciones, cotizadas:**

| | qué pasa | costo si se elige mal |
|---|---|---|
| **A. El de Windows ya está apagado** | El del VPS es el único: corre con la laptop apagada, que era el objetivo de la mudanza | Ninguno. Es el estado buscado |
| **B. El de Windows sigue registrado** | **Dos loops sobre el mismo carril.** El de Windows escribe `claude/carril-contenido` y el del VPS `claude/ads-creatividades-publicos`: no comparten rama, así que no se pisan el árbol — pero duplican el gasto de tokens y publican contenido dos veces | Gasto doble y trabajo repetido, silencioso: ninguno de los dos se entera del otro |

**Lo que hace falta de Sergio:** una sola mirada a `list_scheduled_tasks` en su laptop y decir si
`contenido-cola` sigue ahí. Si sigue, se apaga ese y queda el del VPS.

**Lo que ya es nuestro y está hecho:** el `case` del corredor, el prompt versionado, el worktree en
la rama que no invade la suya, y la fila de `loops.md` alineada al cron real.

---

## 36. Dos carriles escribieron los MISMOS tres documentos de Lucía, y ninguno es dueño (2026-09-03) — decisión de Sergio

**Lo que pasa.** `lucia` y `calidad-generado` crearon por separado, en la misma carpeta
`hermes-content/references/modelos/lucia/`, los **mismos tres archivos** con el mismo propósito y
contenido distinto:

| archivo | versión de `lucia` (ya en `main`) | versión de `calidad-generado` |
|---|---|---|
| `RUBRICA-IMPOLUTO.md` | 45 líneas | 118 líneas |
| `BANCO-OFICIAL.md` | 176 líneas | 146 líneas |
| `BITACORA-PERFECCION.md` | 582 líneas | 176 líneas |

**Ninguno es superconjunto del otro**: no se resuelve quedándose con el más largo.

**Cómo se descubrió.** Al integrar el 2026-09-03: `lucia` mergeó limpio y, cuarenta segundos
después, `calidad-generado` chocó `add/add` en los tres archivos. El merge se **abortó** —abortar
es gratis— y sus 2 commits quedan sin mergear a propósito.

**Por qué NO lo resuelve el integrador.** Elegir cuál rúbrica manda es decidir **con qué vara se
mide la cara de Lucía**, y eso es contenido, no integración. Peor: fusionar las dos crearía
*"dos fuentes de verdad del mismo tema"*, que es exactamente lo que `CLAUDE.md` prohíbe. La regla
de ese archivo es explícita: *"Si hay dos versiones, no elegir la más linda: preguntar."*

**La causa de fondo, que va a repetirse.** `COORDINATION_MANIFEST.md` **no nombra**
`hermes-content/references/modelos/lucia/`. Sin dueño declarado, los dos carriles siguen
escribiendo ahí y el choque vuelve en cada vuelta. Los dos loops están vivos y corren cada 3 h
(`lucia` en `37 0,3,6,…`, `calidad-generado` en `5 3,9,15,21`).

**Las dos opciones, cotizadas:**

| | quién queda dueño | costo |
|---|---|---|
| **A. `calidad-generado`** | Es literalmente su oficio según `loops.md`: *"que Lucía sea SIEMPRE la misma cara"*. Su rúbrica es 2,6× más detallada | Hay que rehacer/portar lo que `lucia` ya dejó en `main`, incluida una bitácora de 582 líneas |
| **B. `lucia`** | La carpeta lleva su nombre y su versión ya está viva en `main` | Se descarta la rúbrica más detallada y `calidad-generado` queda sin la herramienta de su propio trabajo |

**Lo que hace falta de Sergio:** una línea — quién manda sobre `references/modelos/lucia/`. Con
eso se anota en `COORDINATION_MANIFEST.md`, el otro carril deja de escribir ahí, y los 2 commits
varados se mergean o se descartan según corresponda.

⚠️ **Y no es un carril: son DOS, por la misma causa.** En la misma vuelta,
`claude/git-status-935f47` (la sesión de control) chocó en
`references/modelos/lucia/LUCIA.md` — el archivo canónico de la identidad de Lucía— con un
conflicto de **118 KB**. También se abortó. Elegir mal ahí no es un detalle de formato: `LUCIA.md`
es de donde se copia el UUID de la cara, y el propio archivo documenta que ya mandó **seis veces**
al Element jubilado. Un merge a ojo ahí produce fotos con la cara equivocada.

**Los dos conflictos tienen la misma raíz**, y por eso van juntos: `references/modelos/lucia/` lo
escriben `lucia`, `calidad-generado` y la sesión de control, **sin dueño declarado**. Mientras eso
siga así, el integrador va a abortar estos dos merges en cada vuelta, para siempre.

**Lo que ya es nuestro y está hecho:** **once** de los trece carriles están en `main` (25 commits
integrados esta vuelta), y los dos merges conflictivos quedaron **abortados y limpios**, no a
medias. Ninguna rama perdió trabajo: siguen pusheadas en `origin`.

---
## 37. El carril de Lucia no lo enumeraba nadie (2026-09-02) — RESUELTO 2026-09-03, ya no hay decisión
> ⚠️ **Corregido al integrar, 2026-09-03 04:45 UTC. La decisión que pedía abajo ya no existe:
> las condiciones la tomaron solas, y dejarla escrita le pedía a Sergio elegir sobre un mundo
> que no es el de hoy.** Lo medido en vivo, no heredado:
>
> - **`claude/lucia-vps` está mergeada a `main`.** Tenía **4** commits sin mergear, no 17.
> - **El merge trajo 1,3 MB en 14 archivos**, no +88,2 MB en 59 binarios.
> - **Porque el álbum ya estaba en `main` desde ANTES de que se escribiera esta entrada:** el
>   commit `89c692072` (2026-09-02 **03:24** UTC, *"banco completo"*) lo metió directo, catorce
>   horas antes de la medición de las 17:30. La opción A cobraba un costo **ya pagado**, y la C
>   proponía blindar una puerta con el caballo adentro.
> - Hoy `hermes-content/references/modelos/lucia` pesa **761,7 MB** en `main` — 8,6× lo que esta
>   entrada temía. Eso sí sigue vivo y es de Sergio: está separado abajo, en el ítem 38.
>
> **Lo que esta entrada acertó y sigue valiendo** es el diagnóstico de POR QUÉ nadie la
> enumeraba: los dos filtros que la excluían por construcción. Los dos están corregidos en el
> prompt del integrador. Se conserva por eso.


**Qué se midió, el 2026-09-02 17:30 UTC.** `origin/claude/lucia-vps` tiene **17 commits sin
mergear** a `main` (90 archivos, +4780/−894). Lo último de Lucia que sí llegó a `main` fue
`12ea2219`, del **2026-08-30** — tres días. La rama está pusheada y su árbol limpio, así que
**no hay nada perdido**: hay trabajo que no se integra.

**Por qué nadie lo vio.** Es el mismo agujero que ya se pagó con el chatbot (7 commits varados) y
con `web-venta`/`investigacion`, pero por una puerta nueva, y por eso las dos defensas que
existían fallaron las dos:

- **El integrador no la enumeraba.** Su lista de ramas de carril tenía siete; ésta es la octava.
- **La regla de rescate tampoco la agarraba:** decía que una rama sin listar es carril *"si su
  loop existe en `loops.md`"*. Lucia **no tiene loop**: la mueven `lucia-ugc.sh` (`37 */3 * * *`)
  y `lucia-cierre.sh` (`10 11 * * *`), dos crons pelados que no son `onia-loop.sh` y que
  `loops.md` no lista ni va a listar nunca. El filtro la excluía por construcción.
- Y su árbol `/root/loops/lucia-contenido` es un **clon aparte**, no un worktree: no sale en
  `git worktree list`, así que ninguna enumeración por árboles la ve tampoco.

Las dos primeras ya están corregidas en el prompt del integrador, en el mismo commit que esta
entrada. Lo que queda para vos es qué hacer con la rama.

**Las tres opciones, cotizadas:**

| | Qué se hace | Cuesta | Qué queda |
|---|---|---|---|
| **A** | Mergear `lucia-vps` entera, como un carril más | **Cero conflictos** — medido: no hay un solo archivo tocado por los dos lados. ~10 min de una vuelta del integrador | `main` engorda **+88,2 MB** (59 binarios: los mp4 y jpg del banco de Lucia). Esos assets no se despliegan, pero **todo clon del repo se los lleva para siempre** |
| **B** | Mergear sólo la **herramienta compartida** (`scripts/carousel_render.js` +329 y `scripts/carousel_pack_solido.js`, nuevo). El álbum se queda en la rama | ~20 min, cherry-pick. `main` no engorda | Cierra lo único que de verdad duele: hoy hay **dos versiones vivas** del render de carruseles. **Contra:** hay que repetirlo cada vez que Lucia toque `scripts/` |
| **C** | Declararla fuera del juego a propósito, como `carril-contenido` y `ads-creatividades-publicos`: no se mergea nunca, y queda escrito | ~10 min, ya está medio hecho | Cero ambigüedad. **Contra:** deja el render de carruseles bifurcado a perpetuidad — justo lo que prohíbe *"una sola fuente de verdad por tema"* |

**Lo que este loop recomienda: B.** El banco de videos de Lucia es material de trabajo, no fuente
de verdad de nada, y 88 MB en `main` se pagan una vez y se cargan para siempre; pero la
herramienta que lo produce sí tiene que ser única. B separa las dos cosas. Y su única debilidad
—"hay que acordarse cada vez"— ya quedó cubierta: desde este commit el integrador **enumera la
rama**, así que la próxima divergencia de `scripts/` la ve alguien.

**Lo que sí es tuyo y no puedo decidir por vos:** Lucia/@oniahq roza el límite que pusiste el
2026-09-01 (*"el de contenido lo maneja su sesión"*). Ninguna de las tres toca lo que Lucia
publica; las tres son sobre dónde vive su código. Pero si para vos ese carril es contenido y no
se toca, la respuesta es **C** y se cierra acá.

---

## 38. `main` carga 761,7 MB de assets de Lucía, y todo clon se los lleva (2026-09-03) — decisión de Sergio

**Lo medido hoy, no heredado.** `hermes-content/references/modelos/lucia` pesa **761,7 MB** en
`main`, con **87 videos** `.mp4`. No se despliegan ni los ve un cliente: son material de trabajo
del carril de contenido, versionado en un repo que **todo clon se lleva entero**.

**Cómo llegó.** No fue un merge del integrador. El commit `89c692072` (2026-09-02 03:24 UTC,
*"ventana de perfeccionamiento … + banco completo"*) lo empujó **directo**. La advertencia que
existía para frenar exactamente esto —*"no mergees `lucia-vps`, arrastra +88,2 MB"*— se escribió
**catorce horas después**, contra una puerta que ya estaba abierta. Hoy hay 8,6× lo que esa
advertencia temía.

**Por qué importa y no es cosmético.** Se conecta con algo ya medido en este repo: el vigía de
disco encontró que **60 de 97 GB del VPS eran `hermes-content` copiado 14 veces**. Cada worktree,
cada clon de loop y cada checkout paga estos 761,7 MB otra vez. Los loops crean árboles solos.

**Por qué es de Sergio.** Sacar assets del historial es **destructivo e irreversible** (reescribe
`main`, invalida todo clon y worktree existente, y los loops tienen 14 árboles vivos). Ningún loop
debería hacerlo por su cuenta, y este no lo va a hacer.

**Las tres opciones, cotizadas:**

| | Qué se hace | Cuesta | Qué queda |
|---|---|---|---|
| **A. Nada** | Se acepta el peso. Es el estado de hoy | 0 | Sigue creciendo: el carril de Lucía produce video cada 3 h. El disco del VPS ya dio un susto |
| **B. Dejar de agregar** | `.gitignore` para `*.mp4` bajo `references/modelos/`, y los videos nuevos viven fuera de git (disco del VPS o almacenamiento externo) | ~20 min, cero riesgo, reversible | Frena la hemorragia. **No** achica lo que ya está: los 761,7 MB siguen en el historial |
| **C. B + reescribir el historial** | Además, sacar los 87 videos del historial con `git filter-repo` | ~1 h y **coordinación**: hay que rehacer TODOS los clones y worktrees de los loops, o quedan rotos | El repo vuelve a pesar poco. **Irreversible**, y si un loop tiene trabajo sin pushear cuando se hace, se pierde |

**Lo que este loop recomienda: B ahora, y C sólo si el disco vuelve a apretar.** B es reversible,
cuesta 20 minutos y frena lo que crece; C es la única que achica, pero su costo real no es la hora
de trabajo sino coordinar catorce árboles vivos sin perder nada.

**Lo que hace falta de Sergio:** una línea. Si es B, este carril lo hace en la vuelta siguiente.

---

## 39. Los 13 worktrees de los loops nunca se sincronizan con `main`: auditan y editan sobre un repo viejo (2026-09-03) — decisión de Sergio

**El corredor `onia-loop.sh` no trae `main` al worktree del carril.** El `case` fija carpeta, rama
y tope y arranca; no hay `fetch` ni `merge` de `origin/main` en ninguna parte del script. El sync
del minuto 44 despliega **el corredor y los prompts** desde `main` — o sea lo que el loop
*ejecuta*, nunca los archivos que el loop *lee y edita*.

**Medido hoy 05:30 UTC** (`git rev-list --count HEAD..origin/main` en cada árbol): `contenido-cola`
**788** commits atrás · `canario-visual` 268 · `web-venta` 235 · `lucia` 233 · `calidad-generado` y
`tendencias` 126 · `web-factory-dev` 124 · `marca-personal` 93 · `recorrido-cliente` 92 ·
`chatbot-cola` 78 · `supervisor` 72 · `investigacion` 49. Ninguno en 0.

**Qué rompe, con el caso de hoy.** `docs-auditoria` estaba 113 atrás y el tablero le pidió arreglar
la fila de `contenido-cola` en `loops.md`. En su checkout la fila decía `Windows` y
`npm run loops:registrados` salía **rojo**; en `main` el integrador ya la había corregido a las
03:33 y contra `origin/main` el gate estaba **verde**. Un paso más y reescribía la línea sobre una
base de 113 commits: conflicto, o peor, **el merge devuelve la fila mentirosa y deshace el arreglo
del integrador**. El daño escala con lo que el carril toca: `canario-visual` compara pantallas
contra archivos del repo 268 commits viejos, y `web-venta` es dueño de `onia.com.bo/` con 235.

**Es el generador estructural de ítems fantasma** — parte del 25–46 % de pendientes que las colas
declaraban y no existían no eran ítems mal escritos: ya estaban hechos en `main` y el carril no
podía verlos.

**Por qué es de Sergio.** El arreglo de raíz es una línea en `scripts/loops/onia-loop.sh`, que es
**el archivo compartido por los 15 loops** — y el propio `loops.md` lo marca como "el frágil": ya
falló dos veces en un día y una reinstalación desde el repo estuvo a punto de borrar dos carriles
y bajarle el modelo a todos. Un cambio ahí lo tiene que decidir una persona, no un loop.

**Las tres opciones, cotizadas:**

| | Qué se hace | Cuesta | Qué queda |
|---|---|---|---|
| **A. Nada** | Cada carril sigue como está | 0 | Los atrasos crecen solos. `contenido-cola` ya va por 788: a ese atraso, casi cualquier hallazgo suyo es sobre un repo que no existe |
| **B. Sólo en los prompts** | Cada prompt arranca con `fetch` + `merge --ff-only origin/main`. **Ya está hecho en `docs-auditoria`** (esta vuelta) | ~10 min por carril, cero riesgo compartido, reversible | Arregla uno por uno y **sólo los que se editen**. Un prompt que nadie toca queda viejo para siempre |
| **C. En el corredor, una vez** | `fetch` + `merge --ff-only origin/main` en `onia-loop.sh`, antes de invocar a Claude. Si el carril tiene trabajo sin mergear, `--ff-only` **falla sin tocar nada** y el loop sigue con el árbol como está | ~20 min + gates. Riesgo: toca los 15 loops de una vez | Lo arregla de raíz y para los que vengan. Es el único que no hay que acordarse de repetir |

**Lo que este loop recomienda: C**, con `--ff-only` (nunca un merge que invente commits) y avisando
por Telegram cuando un carril no pueda avanzar. B ya quedó aplicado en `docs-auditoria` como
paliativo, pero pedirle a trece prompts que se acuerden de lo mismo es exactamente lo que este
repo llama "una regla sin su historia".

**Lo que hace falta de Sergio:** una línea. Si es C, este carril lo escribe y lo deja pasar por los
gates del integrador.

---

## 40. El carril Web Factory corre en Windows y sus 12 commits no llegan a `main` (2026-09-03) — ✅ RESUELTO 11:58 UTC, ya no hay decisión

> ⚠️ **La opción A ya se ejecutó: no hace falta que Sergio decida nada acá.** Recontado en vivo a
> las 11:58 UTC del mismo día: `origin/main...origin/claude/onia-web-architecture-b37eca` da
> **0 commits adelante**, y la punta de la rama (`d80ab6b88`) **es ancestro de `main`** — o sea,
> entró entera. Se deja el análisis de abajo porque su parte útil no venció: **el umbral de "100
> commits atrás" mide tráfico de `main`, no antigüedad de la rama**, y eso sigue escalando ramas
> vivas por error (opción B, sin ejecutar).
>
> Lo cerró el integrador aplicando la regla que este mismo ítem pedía: *un `NO mergees` es una
> medición con fecha de vencimiento y el que lo obedece tiene que recontarlo antes*. Un bloqueo
> vencido es peor que un fantasma — le pide a Sergio una decisión que ya tomó.

**Lo medido, en vivo, hoy 07:40 UTC** (no heredado): la rama `claude/onia-web-architecture-b37eca`
tiene **12 commits** que `main` no tiene, el último de las **01:53 UTC de hoy** — o sea que el
carril **está vivo y trabajando**. El integrador no la enumeraba, y por eso nunca los mergeó.

**Por qué se escapó de las tres enumeraciones a la vez, que es lo que hace a este caso distinto:**
su worktree vive en `C:\dev\proyectos\onia-hermes\.claude\worktrees\hyperframes-onia-export-formats-053cf9`,
en **Windows**. Entonces:

- no tiene `case` ni `RAMA=` en `scripts/loops/onia-loop.sh` — el corredor sólo mueve loops del VPS;
- no sale en `git worktree list` del VPS — su árbol no está en esta máquina;
- no está en la tabla VPS de `hermes-content/docs/cola/loops.md` — y **no debe estarlo**: esa tabla
  es de crons, y `npm test` (`loops_registrados`) fallaría si se la agregara.

Las seis ramas que se colaron el 2026-09-03 04:40 UTC eran loops del VPS que la lista no había
alcanzado a nombrar; **contra un carril de Windows, el `--no-merged` no es un respaldo de la lista:
es el único instrumento que lo ve.** Ya está corregido en el prompt del integrador.

**Su cola ya lo nombraba hace días** (`web-factory/docs/LOOP_COLA.md:46`,
`hermes-content/docs/cola/README.md:31`, `COORDINATION_MANIFEST.md`): el dato no faltaba en el
repo, faltaba en la lista del que integra.

**Lo que trae, contado:** 14 archivos, **+478 / −7**, **cero borrados** (guarda dura pasada con
holgura: el tope es 200 borrados). Toca sólo `web-factory/` — `docs/`, `packages/templates/src/`,
`tests/e2e/` y sus snapshots visuales—, que es **su zona propia** según `COORDINATION_MANIFEST.md`
y que ningún otro carril posee. Contenido: el gate visual del carril y arreglos de sus propios
servidores de prueba.

**Por qué NO lo mergeé solo, y la duda honesta que deja.** La regla del integrador dice que una
rama **>100 commits atrás de `main`** la decide Sergio, y ésta está **667 atrás**. Obedecí.
Pero conviene decir que el umbral **está mal calibrado y esta rama lo demuestra**: 667 no mide
antigüedad de la rama sino **tráfico de `main`**, y con 15 loops mergeando cada hora `main` avanza
cientos de commits por día. Una rama que commiteó hace **cinco horas** aparece "divergida hace
semanas" sin estarlo. El umbral en commits mide la máquina, no el riesgo.

**Las tres opciones, cotizadas:**

| | Qué se hace | Cuesta | Qué queda |
|---|---|---|---|
| **A. Mergearla** (lo que este loop recomienda) | El integrador la toma en su próxima vuelta como un carril más | Una vuelta. Riesgo bajo medido: 0 borrados, zona propia sin dueño rival, gates del repo verdes | Los 12 commits entran y el carril deja de acumular. No arregla el umbral |
| **B. Cambiar el umbral a días** | `>100 commits atrás` pasa a `sin commits propios hace >14 días` | ~15 min, toca sólo el prompt del integrador | Deja de escalarte ramas vivas por tráfico ajeno. Hay que elegir el número de días |
| **C. Dejarlo como está** | Cada vuelta vuelve a escalarte esta rama | 0 hoy | Los 12 commits crecen y te llega la misma decisión cada hora |

**Lo que hace falta de Sergio:** una línea — A, B, o las dos. Si es A, el integrador la mergea en
la vuelta siguiente sin volver a preguntar.

---

## 41. El arreglo del alta está en `master` y el cliente sigue perdiendo la cuenta (2026-09-03) — decisión de Sergio

**Qué se arregló.** Un cliente que se registraba dos veces con el mismo correo sin confirmar —lo
más normal del mundo si no le llegó el mail o cerró la pestaña— veía **el botón no hacer nada**, y
encima **perdía la cuenta que ya tenía**. Quedaban organizaciones huérfanas en la base de
producción. Commit `38a0c8a` en `onia-platform` (`master`), con los tres gates verdes: `tsc` 0
errores, `lint` 0 errores, `vitest` 2519 pasando.

**Por qué te llega igual.** Está **commiteado y NO desplegado**. El contenedor `onia-platform`
corre el build anterior, así que **para el cliente el bug sigue vivo ahora mismo**. Desplegar al
VPS necesita tu OK explícito: no lo hace un loop.

**Cuánto vale esperar.** Es el último clic de la puerta de entrada del producto, y de los que hay
—7 personas esperando— cualquiera que se registre dos veces cae en esto. No es un caso raro: la
causa más común de un segundo intento es justamente que el primer correo no llegó.

| | Qué se hace | Cuesta | Qué queda |
|---|---|---|---|
| **A. Desplegar ya** (lo que este loop recomienda) | Build + swap del contenedor con el runbook de `onia-deploy` | ~10 min, ventana corta de corte | El alta deja de comerse cuentas hoy |
| **B. Esperar y juntarlo con lo próximo** | Queda para el siguiente despliegue | 0 hoy | Cada alta repetida sigue borrando una cuenta y dejando una organización huérfana |

**Lo que hace falta de Sergio:** una línea — A o B.

**Dato que conviene saber para el despliegue.** Al medir esto se vio que el SMTP **rechaza los
dominios sin MX** (`example.com` → `556 Recipient address rejected ... (nullMX)`) y GoTrue devuelve
**500** ahí, además de un **rate limit de ~60 s** entre altas del mismo correo. Las dos cosas son
correctas, pero significan que un correo mal tipeado por el cliente da error 500, no un mensaje
claro. No se tocó: es otro ítem, y este loop cierra uno por vuelta.

---

## 42. La cara de Lucía deriva porque el ancla vigente es la equivocada — el arreglo es gratis (2026-09-03) — decisión de Sergio

**Qué se midió.** Se abrieron uno por uno los cuadros sueltos de
`references/modelos/lucia/prueba-motor-20260813/` y se compararon contra el banco canónico
(`INVENTARIO-caras.jpg`). Evidencia en
`hermes-content/docs/research/calidad-generado/evidencia-anclas-20260903/`.

**El test del 13/08 se reportó como un A/B de dos métodos y en realidad tiene TRES brazos:**

| Fuente | Cara que sostiene | Micro-detalle |
|---|---|---|
| Soul `36305a9b…` (`LUCIA-REAL-v2-clean`) | Familia A | ✗ pastosa, piel manchada de rojo |
| Element **`452d8375…`** (`lucia-ancla-2026-08`) ← **la vigente** | **la que deriva** | ✓ |
| Element `902eeebb…` (`lucia-surgical-anchor`) | **la del banco** | ✓ **la mejor de las tres** |

**Por qué importa.** `ORDEN-DE-DISPARO-L3-L4-L7-L8.md` fijó `452d8375…` como ancla vigente el
23/08. Con esa se generó `G06-peluqueria.jpg` el 28/08, cuya cara no es la del banco. **La deriva
no es azar del modelo ni culpa del método: es un UUID mal elegido.** Se eligió bien la familia
(Element) y mal el miembro, porque la pregunta binaria *"¿Soul o Element?"* metía a los dos
Elements en la misma bolsa.

**Lo que hay que romper, y por eso decide Sergio: dos papeles se contradicen.**

- `ONIA_MODELOS_RAIZ.md` — **sin fecha, así que manda por la regla de `CLAUDE.md`** — rotula
  `452d8375…` como *"Element (PRIMER PLANO)"* y `902eeebb…` como *"Element (photoshoot)"*.
- `historial/ONIA_MODELOS_PERFILES_ALTA_20260806.md` prescribe lo inverso y con motivo: `nano_banana_2 +
  <<<902eeebb…>>>` **para primer plano**, porque es el ancla que resolvió el *"se ve muy IA"*
  después de 11 avatares malos.

**Los píxeles le dan la razón al segundo; la regla de precedencia, al primero.** Este loop no
rompe ese empate solo.

**Las opciones, cotizadas en créditos:**

| | Qué se hace | Cuesta | Qué queda |
|---|---|---|---|
| **A — recomendada** | Cambiar el ancla vigente a `902eeebb…` en `ORDEN-DE-DISPARO`, y corregir `ONIA_MODELOS_RAIZ.md` para que su rótulo coincida. Después, **una** imagen de confirmación con el prompt de G06. | **0 cr** el cambio · **2 cr** la confirmación | La cara vuelve al banco **y** se gana nitidez. Cierra la contradicción de los dos papeles |
| **B** | Sólo cambiar el UUID, sin confirmar con una imagen. | **0 cr** | Gratis, pero queda como hipótesis: la próxima pieza es la prueba, y si falla se descubre con la pieza ya hecha |
| **C** | No tocar nada y seguir con `452d8375…`. | 0 cr | La cara sigue corriéndose pieza a pieza. Hoy hay **0 piezas publicadas**, así que el costo de arreglarlo nunca va a ser más bajo que ahora |

**Lo que este loop recomienda: A.** Es la única que además deja los dos documentos diciendo lo
mismo, que es la causa por la que cada sesión nueva venía eligiendo mal.

⚠️ **Nada de esto lo ejecuta el loop de calidad**: `ORDEN-DE-DISPARO` y `ONIA_MODELOS_RAIZ.md`
están fuera de su zona, y los 2 cr de la confirmación son permiso de gasto de Sergio.

---

## 43. Una rama tuya con un video terminado lleva horas sin llegar a `main` (2026-09-08) — decisión de Sergio Urcullo

**Qué es.** `claude/video-editing-silence-removal-073acb` — **4 commits**, **34 archivos,
+12.315 líneas, cero borrados**: el plan de cortes, la intro animada, las fuentes, el end-card,
los SFX, la miniatura y los scripts de transcripción y render bajo `videos/claude-vs-claudecode/`.

> **Recontado el 2026-09-08 11:47 La Paz.** Cuando se escribió este ítem la rama tenía **1 commit,
> 20 archivos, +11.932**; siguió creciendo tres commits más (`4cd8282e` título centrado,
> `2727c454` retakes fuera + CTA + SFX + miniatura, `18f541d7` miniatura rehecha). **La decisión
> no cambia** —sigue siendo A o B— pero el número sí, y un ítem que te pide decidir con datos
> muertos es exactamente lo que esta carpeta existe para evitar. Se ve con:
> `git diff --shortstat origin/main...origin/claude/video-editing-silence-removal-073acb`

**Por qué no la mergeé yo.** No es un carril de loop: no tiene `case` en el corredor, no tiene
línea en `crontab -l` ni fila en `loops.md`. Es trabajo de una sesión interactiva tuya, igual
que el carril de contenido — y el carril de contenido lo cerrás vos, por regla escrita.
La guarda dura la pasa sin problema (cero archivos borrados), así que **no hay riesgo técnico
en mergearla**: lo que falta es que vos digas que ese video ya está como querés.

**Lo que cambia según qué elijas:**

| | Qué se hace | Qué pasa después |
|---|---|---|
| **A** | La mergeo a `main` en la próxima vuelta | El video y sus scripts quedan respaldados en `main` y cualquier sesión los ve. Ojo: son ~12 mil líneas y assets, y `main` ya carga 761,7 MB de Lucía (ítem 38) |
| **B** | La dejo donde está | Sigue viva y respaldada en GitHub (`origin/claude/video-editing-silence-removal-073acb`), pero fuera de `main`: ninguna otra sesión la encuentra sola |

**No hay urgencia ni nada roto**: la rama está pusheada, así que no se pierde si muere una
sesión. Se anota para que no quede invisible, que es como se varan las ramas.

---

## 44. 23 ramas viejas con 131 commits que nunca llegaron a `main` — y mi propio objetivo las contaba como CERO (2026-09-10) — decisión de Sergio Urcullo

**Lo primero es un error mío, no tuyo.** Mis tres vueltas anteriores cerraron con la línea
`OBJETIVO: ramas varadas 0`, y una de ellas escribió textualmente **"(las dos repos vacías)"**.
Eso era falso. El comando que este carril tiene mandado correr —el `--no-merged` de los dos
repos— devuelve **23 ramas** en `onia-hermes`, y las devolvía también entonces: no apareció
nada nuevo. Lo que hice fue leer esa salida, descartar a mano todo lo que no reconocía como
carril activo, y reportar el resto como si fuera el total. **El instrumento estaba bien; el
que falló fue el reporte** — y el falso verde tapaba justo a los sujetos que nadie mira.

**Se descartó que fuera un clon ciego.** Los dos clones (casa y VPS) tienen el refspec completo
`+refs/heads/*:refs/remotes/origin/*` y exactamente los mismos refs (94 en `onia-hermes`, 53 en
`onia-platform`), así que ninguna de las dos máquinas ve de menos.

**Y se descartó que fuera trabajo ya integrado por otra vía.** No se contó el vehículo (commits),
se midió el efecto: `git cherry origin/main <rama>` marca **129 de los 131** como pendientes por
patch-id, y en las tres ramas más grandes los archivos que tocan **no existen en `main`**
(`git cat-file -e origin/main:<ruta>` falla). Ejemplos: `web-factory/WEB_FACTORY_DASHBOARD_SYSTEM.md`,
`web-factory/WEB_FACTORY_HERO_VARIANTS.md`, `.../onia-center/components/views/hoy/TodayScheduleCard.tsx`,
`.claude/skills/editor-videos/assets/html/captura-apoyo.html`. Es trabajo real que nunca llegó.

**Por qué no las mergeo yo, y esta vez no es una traba inventada:** las 23 divergen entre
**2.531 y 3.390 commits** de `main` —de 4 a 10 semanas—, así que no es un merge, es una
reconstrucción archivo por archivo. Y son todas de tu cuenta: es trabajo de sesiones
interactivas tuyas, igual que el carril de contenido.

De los 131 commits, **32 son `chore: auto-sync`** (el hook commiteando lo que encontró en el
árbol) y **99 tienen mensaje propio**. Cinco ramas son 100 % auto-sync y ninguna tiene un solo
commit con mensaje real: `cool-lovelace-ad8d0e`, `clever-turing-39406c`,
`blissful-sutherland-af44a7`, `lucid-kilby-35336b`, `chatbot-requirements-progress-73545f`.

Las cuatro que concentran el trabajo:

| Rama | Commits reales | Tamaño | Qué es |
|---|---|---|---|
| `sad-nash-373003` | 47 | 80 arch., +9.710 | Web Factory: sistema de diseño, variantes de hero, receta Apple |
| `vibrant-ritchie-9304f8` | 23 | 51 arch., +6.261 | `onia-center`: shell y vistas del panel |
| `cool-blackwell-7e66b2` | 4 | — | Handoff consolidado de pendientes |
| `lucid-greider-6683fd` | 4 | — | Meta Ads: plan post-SEPREC |

**Lo que cambia según qué elijas:**

| | Qué se hace | Qué cuesta | Qué pasa después |
|---|---|---|---|
| **A** | Nada: se marcan como legado y salen del conteo del integrador con su motivo escrito | 0 | El objetivo de este carril vuelve a poder dar cero **de verdad**. Las ramas siguen respaldadas en GitHub; no se pierde nada. Ese trabajo no vuelve a `main` |
| **B** | Rescato sólo `sad-nash` y `vibrant-ritchie` portando sus archivos a mano sobre `main` | 2-3 vueltas mías, sin gasto | Vuelve el sistema de diseño de Web Factory y el shell de `onia-center`. Ojo: son de julio y hay 3.200 commits encima — puede estar vencido contra el código de hoy |
| **C** | Se borran las 23 del remoto | 0 | Irreversible. **No lo recomiendo**: no destraba nada que A no destrabe |

**Recomiendo A**, y por un motivo concreto: el costo de tenerlas ahí no es el disco, es que
**vuelven ciego al único instrumento que caza un carril varado de verdad**. Este archivo ya
registra seis veces que un carril vivo se varó porque la lista escrita a mano no lo nombraba
(ítems 23, 40 y los seis casos del prompt del integrador). Con 23 ramas de ruido permanente en
esa salida, la 24ª —que sí puede ser un carril vivo— se pierde entre ellas, que es exactamente
como se varó Web Factory doce commits.

**Nada está roto y nada corre riesgo**: las 23 están pusheadas en GitHub, así que sobreviven
aunque muera el disco. Se ve con:
`git -C /root/loops/onia-hermes branch -r --list 'origin/claude/*' --no-merged origin/main`

---

## 45. Tu rama de carruseles de marca personal lleva 6 h sin llegar a `main` (2026-09-18) — decisión de Sergio Urcullo

**Qué es.** `claude/marca-personal-carruseles-dist-deadab` — **7 commits**, **63 archivos,
+948/−11, cero borrados**. Medido el 2026-09-18 05:40 La Paz: **52 de los 63 archivos son
carruseles ya generados** (`hermes-content/carousels/out`), 6 son scripts nuevos de screencast
(`scripts/marca-personal/rec_*.py`) y 3 son notas de cola. Último commit: anoche 23:35 La Paz.

**Por qué no la mergeé yo — es el mismo motivo del ítem 43.** No es un carril de loop: no tiene
línea en el `crontab` de nodo-casa ni fila propia en la tabla de activos de `loops.md`. Son
láminas con tu cara y tu guion, y **el carril de contenido lo cerrás vos, por regla escrita**
(`CLAUDE.md`). La guarda dura la pasa sin problema —**cero archivos borrados**—, así que **no hay
riesgo técnico en mergearla**: lo que falta es que vos digas que esos carruseles ya están como
los querés.

| | Qué se hace | Qué pasa después |
|---|---|---|
| **A** | La mergeo a `main` en la próxima vuelta | Los carruseles y los scripts de screencast quedan en `main` y cualquier sesión los ve. Son +948 líneas y 52 imágenes: liviano al lado de los 761,7 MB de Lucía (ítem 38) |
| **B** | La dejo donde está | Sigue viva y respaldada en GitHub, pero fuera de `main`: ninguna otra sesión la encuentra sola |

**No hay urgencia ni nada roto**: está pusheada, así que no se pierde si muere una sesión. Se
anota para que no quede invisible, que es como se varan las ramas. Se ve con:
`git -C /root/loops/onia-hermes diff --shortstat origin/main...origin/claude/marca-personal-carruseles-dist-deadab`

---

## La recarga del chatbot caduca a fin de mes: ¿se arrastra lo no usado?

**Decidido el 2026-09-11 lo que era técnico; esto es lo que queda y es plata.** El add-on del
chatbot trae 500 conversaciones/mes y la recarga suma 200 por Bs 190. Lo comprado **caduca el
día 1**: `ChatbotUsoMensual.recargadas` es por `(organizationId, mes)`. Hasta hoy la venta no lo
decía en ninguna de sus tres superficies — ya está arreglado (`e6adb19`), así que **el cliente
ya no se entera después de pagar**. Lo que sigue abierto es si esa regla es la que queremos.

**Por qué importa ahora y no antes:** el bloque de compra aparece **recién al 80 % del cupo**,
que naturalmente cae avanzado el mes. El que cruza el umbral un 28 paga Bs 190 y tiene dos días
para usar 200 conversaciones. Es el cliente que MÁS usa el producto, y es al que peor le sale.

| | Qué se hace | Qué cuesta | Qué pasa después |
|---|---|---|---|
| **A** | Nada: caduca, y la venta ya lo dice claro | 0 — hecho | Honesto y simple. El que recarga tarde paga casi en vano y lo sabe de antemano; puede elegir subir de nivel, que sí queda |
| **B** | Lo no usado se arrastra al mes siguiente (una sola vez) | ~1 vuelta mía: `recargadas` deja de leerse sólo de la fila del mes y arrastra el saldo | Desaparece el castigo por recargar tarde. Margen intacto (la conversación nos cuesta Bs 0,002-0,011: el 99 % es margen). Hace la recarga más atractiva que subir de nivel, que es lo contrario de lo que busca el precio |
| **C** | La recarga se prorratea: si quedan N días del mes, cuesta proporcional | ~2 vueltas + explicarlo en la venta | Lo más justo y lo más difícil de entender. Con 0 clientes pagando, complejidad sin evidencia |

**Recomiendo A por ahora, y revisarlo con el primer cliente que recargue.** El precio está
puesto a propósito para que recargar dos veces en el mismo mes salga más caro que subir de
nivel (`pricing.ts`: Bs 0,95 contra Bs 0,78 por conversación), y **B rompe ese incentivo**
justo cuando todavía no sabemos si alguien llega a 500. La objeción real —el que recarga un 28—
hoy queda cubierta porque la pantalla se lo dice antes de que gaste.

**No bloquea nada ni corre prisa:** con cero clientes pagando, nadie ha recargado nunca.
Se ve con: `docker exec supabase-db psql -U postgres -d postgres -tAc "select \"organizationId\", mes, recargadas from public.chatbot_uso_mensual where recargadas > 0;"`

---

## 46. Las pruebas automáticas no corren: una decisión de plata que se pidió TRES veces y se anuló a sí misma (2026-09-27) — decisión de Sergio Urcullo

**La decisión vive en UNA sola tarea: `t_e667b4c8`.** Si llegaste acá pensando en abrir otra,
no la abras — es la cuarta.

Desde el 2026-09-27 02:49 UTC GitHub no le da máquina a ningún workflow: los jobs arrancan y
mueren en 3 segundos con `steps=[]` y `runner_name` vacío. **Medido, es de la CUENTA y no de un
repo**: las tres corridas programadas de `onia-hermes` de hoy fallaron con el mismo síntoma
exacto, y las mismas tres de ayer salieron verdes. **No es un incidente de GitHub** (Actions
`operational`, 0 incidentes). **No es el código**: los cinco pasos de `ci.yml` se corrieron a
mano sobre `3448d37c` y los cinco dan exit 0.

**Lo que esta entrada existe para evitar no es el bloqueo: es cómo se pidió.** En una hora se
crearon **tres** tareas del mismo tema (`t_0d3ed46e` 05:50, `t_78360823` 04:47, `t_95d4a01a`
05:07). Dos le pedían a Sergio Urcullo la misma decisión **con letras distintas** (`A–D` contra
`1–5`, donde "correr en el VPS" era `D` en una y `5` en la otra) y **con recomendaciones
opuestas**: una recomendaba el VPS, la otra pagar Pro. El parte de las 09:00 le mandó las dos
juntas y **no contestó ninguna** — que es el resultado esperable, no una omisión suya. Un `ok`
suelto ahí no habría tenido a qué referirse.

> **La lección, que es más general que este caso:** duplicar una decisión no hace ruido, hace
> **parálisis**. Dos hojas del mismo tema con distinta numeración no son dos recordatorios: son
> una pregunta que se anula a sí misma. Por eso el canal es **UNA hoja con `ok <id>`**, y el
> que encuentra la segunda **consolida y archiva en la misma vuelta** en vez de sumar la tercera.

**Y un dato falso que sobrevivió a las dos hojas:** `t_95d4a01a` afirmaba como medición
"2.028 minutos consumidos contra los 2.000 incluidos", y sobre ese número apoyaba su
recomendación de plan. **Ningún instrumento de acá puede dar ese número**: la API de facturación
responde 403, y el endpoint de minutos facturables devuelve `total_ms=0` — validado contra la
corrida **verde** de ayer (`run 36248269781`), que sí gastó minutos. O sea que el 0 significa
"no te lo digo", no "no consumió". Si el consumo real fuera el doble, la opción "Pro" no alcanza.

**Por eso la bifurcación real no es cuánto pagar, y es la que la hoja pone primero:** en
`Settings → Billing and plans`, *minutos agotados* y *pago rechazado* llevan a remedios
opuestos — en el segundo caso, pagar más no devuelve nada hasta arreglar el medio de pago.
Dos de las cinco opciones cuestan **Bs 0** (esperar el reinicio; correr las pruebas en el VPS
que ya está pagado).

Se ve con:
`/root/bin/onia-tablero.sh show t_e667b4c8`
