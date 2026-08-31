# La cola — carril `chatbot`

> **Por qué existe este archivo.** El carril chatbot era el único sin cola: tenía
> `hermes-content/docs/handoff/chatbot.md`, que es **estado**, no plan. Y sin cola no puede
> tener loop — un loop sin cola no tiene qué comer, así que el carril sólo avanza cuando
> alguien abre su sesión a mano.
>
> Su plan SÍ existía: estaba enterrado dentro del handoff como backlogs sucesivos (v2, v3, v4,
> v5, v6, v6.5, v6.6, v6.7). Esto lo saca a la superficie. Doctrina y formato:
> `hermes-content/docs/cola/README.md`.

**Extraído del handoff el 2026-08-31, con Gate 1 corrido ítem por ítem.** De 15 pendientes
heredados, **7 eran fantasma** (46%): ya estaban hechos y el handoff los seguía arrastrando.
Están abajo en "Cerrado", cada uno con el archivo y la línea que lo prueba.

---

## Objetivo único

**Que un desconocido escriba y esa conversación se vea en la bandeja.**

**Hecho =** se abre `/inbox` con la sesión del dueño y hay una conversación de una persona
que no somos nosotros — ni una org QA, ni el probador, ni Sergio desde su celular.

**Por qué éste y no otro.** El producto está construido: bandeja nativa, editor conversacional,
multimedia, visión, comprobantes, insistencia, campañas, push. Trece piezas en tres días. Lo
que NO existe es la única prueba de que sirve: alguien de afuera usándolo. Un objetivo que
fuera "cerrar v6.8" o "difusiones masivas" agregaría la pieza catorce a un producto que
todavía no atendió a nadie.

**El estado de arranque, medido hoy:** el enlace de WhatsApp de onia.com.bo YA manda
desconocidos al +591 75414930, que está en Cloud API con el bot atendiendo
(`web-factory/apps/onia-platform/src/lib/site.ts:30-49`). O sea que la distribución existe
hace semanas. Lo que falta es la última cuadra: que esa conversación **aparezca en la
bandeja**, y que la respuesta sea la que corresponde a lo que la persona clickeó.

**Medido el 2026-08-31 (ítem 1, cerrado): la mitad del objetivo YA ocurrió.** Cinco
desconocidos escribieron — dos por WhatsApp con número real, tres por el widget de la web,
uno de ellos entrando desde Instagram. Ninguna de las cinco se puede ver en `/inbox`, porque
sus inboxes (4 y 5) no son de ninguna org. **El objetivo no está a media construcción: está a
una pieza**, y esa pieza es el ítem 1 de Ahora.

---

## Cómo se trabaja esta cola

Igual que las otras cuatro — el detalle está en `hermes-content/docs/cola/README.md`. El
resumen: un ítem por vuelta, Gate 1 antes de tocar nada (¿ya está hecho? verificar EN VIVO,
un grep sirve para descartar y nunca para confirmar), gates completos donde haya código
(`tsc --noEmit` + tests + `eslint`, los tres), y si toca pantalla **se abre y se MIRA**.

**Nada entra a "Ahora" sin evidencia de que existe**, y se verifica solo:

```bash
node scripts/verificar_cola.js hermes-content/docs/cola/chatbot.md
```

**Nunca:** desplegar al VPS sin OK de Sergio · tocar otro carril (web-factory es dueño de
`web-factory/`, producto de la cola de plataforma) · gastar plata · bajar una superficie viva.

---

## Ahora

- [ ] **1 · Una org sólo puede tener UN inbox, y nadie puede cambiarlo — así ningún WhatsApp
      llega nunca a la bandeja.** Éste es el hueco que hace inalcanzable el objetivo, y no
      estaba escrito en ninguna parte. Verificado hoy, en cuatro archivos:
      - Al crear la org se le crea un inbox **web** y ése se guarda:
        `app/api/admin/clinics/route.ts:97` (`createInbox` + `update chatwootInboxId`).
      - Una vez puesto, **nunca se pisa**: `lib/chatbot/canal-web.ts:27` devuelve
        `created:false` y se va; `app/api/admin/chatbots/route.ts:53` hace lo mismo.
      - La única pantalla que lo muestra es **de sólo lectura**:
        `app/(dashboard)/admin/organizations/[id]/WhatsAppOrgConfig.tsx:215` lo pinta en un
        `<dd>`, sin input ni PATCH.
      - Y no hay nada del otro lado: **cero apariciones** de `embedded` en todo `app/` y
        `lib/` de la plataforma.
      **Medido en la base el 2026-08-31 (ya no es una lectura de código, es el estado real):**
      de las cuatro orgs que existen, **una sola tiene inbox — y es la org QA**
      (`ZZ QA Clinica Chatbot` → inbox 7). Las otras tres (`Onia (interna)`,
      `Bolivian electricidad`, `ZZ QA Ferreteria Tornillo`) tienen `chatwootInboxId` en NULL.
      Los dos inboxes donde escribió gente de verdad — **4 (Onia Web)** y **5 (Onia WhatsApp)** —
      no son de ninguna org. La tenencia la da esa columna y sólo esa
      (`lib/chatbot/bandeja-auth.ts:22`), así que hoy `/inbox` sólo puede mostrar conversaciones
      QA: las nuestras.
      **La consecuencia hoy:** el inbox de WhatsApp del +591 75414930 existe en Chatwoot
      (alta manual, hecha dos veces) pero no es el `chatwootInboxId` de ninguna org, así que
      `lib/chatbot/bandeja.ts` no lo puede mostrar. **Y ya costó:** las cinco conversaciones de
      desconocidos que se contaron hoy están todas en los inboxes 4 y 5 — ninguna se ve. Este
      ítem dejó de ser un riesgo futuro: es la única pieza entre el objetivo y estar cumplido. **La consecuencia mañana:** el día que
      Sergio corra la prueba del popup de Embedded Signup, nace un inbox de WhatsApp que la
      plataforma **va a ignorar** — el cliente conecta su número y su bandeja sigue vacía. La
      pieza que gatea todo el carril entrega un inbox huérfano.
      **Hecho =** un mensaje enviado al +591 75414930 aparece en `/inbox`, MIRADO con captura.
      **Lo mínimo que lo logra** (elegir al construir, no ahora): un PATCH de superadmin que
      apunte una org a un inbox existente. Lo caro sería una tabla de N inboxes por org —
      no hace falta hasta que un cliente tenga web **y** WhatsApp a la vez.

      ⚙️ **El código está construido y con gates verdes (2026-08-31, commit `88c1d56` del repo
      `onia-platform`), pero el ítem NO se cierra: sigue sin haber una conversación de un
      desconocido visible en `/inbox`, que es el objetivo.** Lo que se hizo: se extendió el
      PATCH de superadmin que YA existía (`app/api/admin/organizations/[id]/whatsapp/route.ts`)
      en vez de agregar una ruta nueva — acepta `chatwootInboxId` entero positivo o `null` para
      desvincular, y devuelve **409 si otra org ya usa ese inbox** (sin ese guardia dos orgs
      se ven las conversaciones entre sí: la tenencia la da esa sola columna). La pantalla
      `app/(dashboard)/admin/organizations/[id]/WhatsAppOrgConfig.tsx` dejó de ser un `<dd>`
      de sólo lectura: ahora es input + botón "Vincular". 11 tests nuevos; `tsc --noEmit`,
      `eslint` y los 2342 tests de la suite, verdes.
      ⚠️ **Falta lo que no depende de código, y son las dos cosas que lo cierran:** (1) el
      deploy del producto, que es de Sergio, y (2) decidir qué org se queda con los inboxes 4
      y 5 — anotado como **S8**, y cotizado en
      `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md`.
      ⚠️ **La pantalla NO se pudo MIRAR, y se dice en vez de simularlo:** es superadmin, así
      que necesita base + sesión. El `DATABASE_URL` de `.env.local` apunta a
      `127.0.0.1:54329`, que está cerrado (de los puertos de Supabase local sólo 54322 acepta
      conexión TCP, y ahí el handshake de Postgres expira). Producción sí responde pero
      todavía sirve la versión vieja. **La captura se toma en el primer deploy** — es lo
      primero que hay que hacer al retomar, antes que cualquier ítem nuevo.

      ✅ **Vuelta del 2026-08-31 (tercera) — la pantalla YA SE MIRÓ, y no hizo falta ningún
      deploy: lo que estaba roto era el entorno local, no la base.** El diagnóstico de arriba
      era correcto en el síntoma y equivocado en la causa, y por eso el ítem quedó tres
      vueltas esperando a Sergio para algo que no dependía de él.
      **La causa real.** El stack de Supabase local **está corriendo hace 31 h**
      (`docker ps` → `supabase_db_fiscal-mock`, healthy). Lo que no existe son los puertos que
      `.env.local` pedía: `supabase/config.toml` del propio repo declara API `55321` y
      Postgres `55322`, mientras el env apuntaba a `54321`/`54329`. Y `54329` no era "un
      puerto cerrado" cualquiera: es el del **pooler, que el config tiene `enabled = false`**,
      con un usuario ("postgres" con sufijo "onia") que ni figura en `pg_user`. Las claves anon y
      service_role tampoco eran las del stack — firmadas con otro secreto, daban 403 contra
      `/auth/v1/admin/*`. Tres datos mal, ninguno de ellos la base.
      **Lo que se hizo:** se corrigió `.env.local` (puertos reales, `postgres:postgres`,
      `?schema=public` como producción, claves firmadas con el `GOTRUE_JWT_SECRET` del
      contenedor), se creó un superadmin local (usuario por `/auth/v1/admin/users` + su fila
      en `profiles` con `role='SUPERADMIN'`), y se levantó el producto con
      `npm run build` + `node .next/standalone/server.js`.
      **Lo verificado MIRANDO, en la pantalla real** (`/admin/organizations/<id>`, sesión de
      superadmin, captura leída):
      1. La tarjeta **ESTADO TÉCNICO** ya no es un `<dd>`: muestra *"Chatwoot Inbox ID · De la
         tenencia de la bandeja. Vaciar para desvincular."* con input numérico (`No vinculado`)
         y botón **Vincular**.
      2. Vincular el inbox 5 a `Ferreteria Circuito Completo` → banner verde
         **"Org vinculada al inbox 5."**, y la fila queda persistida en la base
         (`clinic_settings.chatwootInboxId = 5`, releída por SQL después del click).
      3. **El guardia de tenencia funciona:** el mismo inbox 5 sobre la otra org devuelve el
         409 con su mensaje en pantalla — *"El inbox 5 ya es de «Ferreteria Circuito
         Completo»"* — y la base sigue con una sola org vinculada. Sin ese guardia dos orgs se
         leerían las conversaciones entre sí, así que era la parte frágil y es la que se probó.
      **La receta completa quedó en la skill que corresponde**, no en un doc suelto:
      `.claude/skills/onia-verificacion/SKILL.md` del repo onia-platform, § "Levantar el entorno LOCAL
      para poder MIRAR" — incluye las trampas que costaron esta vuelta (Prisma no lee
      `.env.local`; `?schema=dentalgest` hace fallar una migración que en `public` está bien;
      `onboardingCompletedAt` en NULL redirige todo a `/onboarding`; `next dev` en Windows
      panickea con Turbopack y recarga en loop con `--webpack`).
      🔗 **Hermano del mismo agujero, arreglado hoy por el carril de plataforma** (commit
      `7791ea3`, `onia-platform`): `encenderCanalWeb()` adoptaba un inbox de Chatwoot buscándolo
      **por nombre**, y el inbox se llama igual que la org — con dos "Clínica Dental" la
      segunda se quedaba con la bandeja de la primera. Es la misma llave de tenencia que este
      ítem: el PATCH ya tenía su 409, y ahora el alta automática también filtra los inboxes ya
      tomados. Se anota para que no se lo cuente dos veces: **no destraba nada de S8**.
      ⚠️ **Esto NO cierra el ítem** — el "Hecho =" sigue siendo un mensaje de un desconocido
      visible en `/inbox`, y para eso falta **S8** (deploy + dueño de los inboxes 4 y 5). Lo
      que cierra es la duda sobre el código: la pieza que S8 va a encender está mirada y
      probada, incluido su caso de error.

      ✅ **Gate 1 del 2026-08-31 (cuarta vuelta): EL DEPLOY YA ESTÁ HECHO. S8 se achicó a la
      mitad — queda la decisión y dos clicks, nada más.** Medido en producción, no leído:
      - **El build del producto trae el PATCH.** `onia-platform` buildeó a las 22:59 y el
        contenedor arrancó 23:00 (UTC). En sus chunks del servidor están las dos cadenas
        exactas de `88c1d56`: `` El inbox ${d} ya es de "${e.organization?.name…`` (el 409 de
        tenencia) y `chatwootInboxId debe ser un entero positivo o null` (el 400).
        ⚠️ **Y acá casi escribo el fantasma al revés:** el primer `grep` acotado a
        `.next/server/app/api/admin/organizations/` dio **cero** y parecía probar que el deploy
        no traía nada. Era falso — `route.js` son 648 bytes de loader y el código vive en
        `chunks/[root-of-the-server]__*.js`. Un grep que no encuentra descarta un lugar, no
        el hecho.
      - **La base sigue sin vincular.** Consultada en vivo (`supabase-db`, schema `public`): de
        las cuatro orgs, la única con `chatwootInboxId` es `ZZ QA Clinica Chatbot` → 7.
        `Onia (interna)`, `Bolivian electricidad` y `ZZ QA Ferreteria Tornillo` en NULL. Los
        inboxes 4 y 5 siguen huérfanos, así que las cinco conversaciones de desconocidos
        siguen invisibles.
      **Lo que queda de S8, entero:** entrar a `/admin/organizations/<id>` de `Onia (interna)`,
      escribir `5` y apretar Vincular. La pantalla ya está desplegada y ya fue mirada.

- [ ] **2 · Las frases que la web YA manda no están registradas como campañas: el desconocido
      pregunta una cosa y el bot le contesta el saludo genérico.** Las frases de campaña se
      construyeron ayer (`hermes-content/deploy/vps-ops/bot/recepcionista.mjs:117`
      `campanaExacta`, espejo en `lib/chatbot/knowledge.ts:101`, deployadas en el commit
      `e5c1ad3`) y **no las usa nadie**: cero campañas publicadas en ningún documento.
      Mientras tanto onia.com.bo manda **seis frases fijas distintas** al mismo número, todas
      desde `web-factory/apps/onia-platform/src/lib/site.ts` — "Hola, quiero conocer Onia"
      (línea 41), "Hola, vengo de la web de Onia. Quiero saber si me sirve para mi negocio."
      (49), y las tres de comercio/servicios/importadoras (52-58), más las de los
      configuradores de servicios. Cada una es una intención declarada — la persona ya dijo
      qué quiere antes de escribir — y el bot la trata a todas igual.
      **Por qué es el ítem barato de mayor valor:** no hay que construir nada. La capacidad
      existe, la distribución existe, el número atiende. Falta escribir el documento.
      **Hecho =** las frases cargadas como campañas desde el panel
      (`app/(dashboard)/settings/chatbot/EnsenaleConversando.tsx` las crea hablando),
      publicadas, y las seis contestadas con su respuesta propia — probado por el probador
      real y MIRADO.
      ⚠️ **No se toca `web-factory/apps/onia-platform/src/lib/site.ts`**: es del carril
      web-factory. Las frases se copian tal cual están hoy; si alguna cambia allá, la campaña
      deja de matchear y hay que re-copiarla.

      ⚙️ **Vuelta del 2026-08-31 — el documento está escrito, validado y con su guardia; lo que
      falta NO es escribirlo.** Gate 1 primero, en vivo: `/opt/onia/bot/knowledge.json` del VPS
      (leído por SSH, 904 bytes, del 6-ago) **no tiene `campanas`** — el hueco existe hoy.
      **Corrección al ítem: no son seis frases vivas, son CINCO — y sólo cuatro las manda la web
      de verdad.** Medido contra producción con `curl`, no leyendo el repo:
      | frase | dónde | ¿la manda la web hoy? |
      |---|---|---|
      | "Hola, vengo de la web de Onia. Quiero saber si me sirve para mi negocio." | `WA_URL_LANDING` | **sí** — portada, /precios, /empezar, /contacto, /nosotros, /facturacion, /chatbot |
      | "…Quiero consultoría/capacitación en IA para mi empresa." | `/servicios/consultoria` | **sí** |
      | "…Quiero una propuesta de marketing con IA para mi negocio." | `/servicios/marketing-ia` | **sí** |
      | "Hola, vengo de la página del chatbot de Onia. Tengo una consulta antes de elegir el stack." | `/v1/chatbot` | **sí** |
      | "Hola, quiero conocer Onia" | `WA_URL`, `web-factory/apps/onia-platform/src/lib/site.ts:41` | **no**: export sin un solo consumidor |
      | "Hola, quiero que me avisen cuando Onia para comercio/servicios/importadoras esté listo" | `WA_TEXT_*`, `web-factory/apps/onia-platform/src/lib/site.ts:52` | **no**: los tres son exports muertos, nadie los importa |
      | "Hola, mi rubro no está en la lista de Onia. Mi negocio es: " | `/v1/empezar` | sí, pero es un **prefijo** — la persona escribe su rubro atrás, así que jamás puede ser match exacto |
      Las tres "avisen cuando esté listo" además chocan con `MODULOS_LISTOS`
      (`hermes-content/deploy/vps-ops/bot/config.mjs:408`): comercio y proveedores **ya están listos**. Que sean código muerto
      refuerza la 📌 de abajo — no hay que corregir el texto, hay que borrarlo.
      **Lo que se hizo:** `hermes-content/docs/chatbot/campanas-onia.knowledge.json` — el
      documento de Onia (copia del vivo del VPS) con **5 campañas** (las 4 vivas + `WA_URL`, que
      está a un import de volver). Pasa la **compuerta real de publicación**
      (`node hermes-content/deploy/vps-ops/bot/knowledge.mjs --check <ruta>` → `OK`, exit 0) y las
      cinco respuestas pasan los guardrails. Y su guardia:
      `hermes-content/deploy/vps-ops/bot/campanas-web.test.mjs` **extrae las frases del código de
      la web** en vez de hardcodearlas, así que el día que web-factory cambie una coma el test se
      pone rojo en vez de morir en silencio. Suite del bot **619/619** verde (614 antes).
      🔴 **Y apareció el motivo REAL de por qué el ítem no se puede cerrar, que no es el
      documento.** `campanaExacta` vive dentro de `recepcionistaStep` (`hermes-content/deploy/vps-ops/bot/recepcionista.mjs:192`), y
      el modo recepcionista lo enciende sólo `asRecepcionista`, al que `withKnowledge` llama
      **únicamente si la fuente es `"db"`** — la fila publicada de una **org**, resuelta por
      `clinic_settings.chatwootInboxId` (`hermes-content/deploy/vps-ops/bot/knowledge.mjs:851`). El +591 75414930 hoy se atiende
      desde el **archivo** del VPS, o sea **modo venta, donde las campañas ni se miran**. Corrido
      con la misma frase por los dos caminos: archivo → `M0_SIN_HORARIOS` (el saludo genérico que
      el ítem describe), db → `R_CAMPANA` con la respuesta propia y `guardrail.ok: true`.
      **Cargar las campañas a mano en el VPS no serviría de nada.** El ítem 2 estaba mal
      diagnosticado: no le faltaba un documento, le falta **el mismo vínculo org→inbox del ítem
      1**. Los dos ítems de Ahora son el mismo bloqueo, y es **S8**. Anotado en
      `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` §9.
      **Lo que queda del ítem, cuando S8 se destrabe:** cargar estas 5 campañas en el editor de la
      org dueña del inbox 5, publicar, y probar las 4 frases vivas MIRANDO la pantalla.

      ⚙️ **Vuelta del 2026-08-31 (segunda) — el ítem YA NO depende de S8, y el plan de arriba
      estaba equivocado.** Gate 1 sobre el propio diagnóstico, leyendo el motor: `campanaExacta`
      se llamaba **sólo** desde `hermes-content/deploy/vps-ops/bot/recepcionista.mjs:192`, y `hermes-content/deploy/vps-ops/bot/bot-engine.mjs:448` corta el modo
      recepcionista antes de todo el guion de venta. O sea que el plan escrito arriba —"cargar
      las campañas en la org dueña del inbox 5"— **metía el número de Onia en modo recepcionista**,
      que es la config del bot de un CLIENTE. Ahí el embudo de leads no existe: lo dice el test
      `recepcionista: 'DEMO' NO dispara el funnel — el guion de leads queda exclusivo del modo
      venta`. Y `R_CAMPANA` es literalmente `{{respuesta_campana}}` (`hermes-content/deploy/vps-ops/bot/config.mjs:317`), sin un solo
      efecto: **se habría cambiado la única línea que produce leads por un texto enlatado.**
      **Lo que se hizo en su lugar** — que las campañas también se vean desde el modo venta, que es
      donde caen los wa.me?text= de onia.com.bo:
      - `hermes-content/deploy/vps-ops/bot/knowledge.mjs` (`applyKnowledge`) ahora lleva `campanas` a la config de los DOS modos.
        `campanaExacta(config, norm)` lee `.campanas`, así que la misma función sirve a ambos sin
        tocarla (el recepcionista le sigue pasando `config.conocimiento`).
      - `hermes-content/deploy/vps-ops/bot/bot-engine.mjs`: la frase de campaña se resuelve en el router **antes** de los intents
        difusos (es un match del mensaje ENTERO, la señal más específica que puede llegar) y sale
        por `composeWithFunnel`, el mismo camino que ya usan precio y SIAT. Efecto: la respuesta va
        **detrás** de la bienvenida, no en lugar de ella — se conservan M0 (el bot se declara bot,
        D2), la oferta de horarios y el `lead_upsert`.
      - `composeWithFunnel` acepta `vars` (R_CAMPANA es la única plantilla de ese camino cuyo texto
        no está en el guion: lo trae el documento publicado).
      **Probado con el documento real, no con un fixture** (las 5 campañas de
      `hermes-content/docs/chatbot/campanas-onia.knowledge.json` corridas por el motor en modo venta): las cinco contestan su
      propia respuesta y las cinco conservan `lead_upsert` + `notify_sergio`. Antes de este cambio
      las cinco daban `M0_SIN_HORARIOS` solo — exactamente el saludo genérico que el ítem denuncia.
      **7 tests nuevos** (incluido el guardia de no-regresión "sin campañas publicadas el motor no
      cambia" y "el opt-out le gana a la campaña"). Suite del bot **626/626** verde (619 antes).
      La compuerta de publicación sigue en `OK` sobre el documento.
      ⚠️ **Lo único que queda, y es MUCHO más barato que S8:** copiar
      `hermes-content/docs/chatbot/campanas-onia.knowledge.json` a `/opt/onia/bot/knowledge.json`
      del VPS (hoy tiene 904 bytes y no trae `campanas`) y probar las 4 frases vivas MIRANDO. Eso
      es un deploy al VPS ⇒ **OK de Sergio**, pero ya no hace falta decidir dueño de inbox ni
      desplegar el producto. **Corrección a S8:** el ítem 2 sale de su lista de desbloqueos.

      🔴 **Vuelta del 2026-08-31 (tercera) — S9 estaba MAL ESCRITO, y hacerlo tal como decía no
      habría encendido nada.** El párrafo de arriba afirma *"El motor ya las lee en modo venta
      (626/626 verde)"*. Eso es cierto **en el espejo del repo** y falso en el VPS: el motor se
      verificó localmente y se dio por desplegado sin mirarlo. Medido con md5, los dos lados:
      | archivo | espejo del repo | VPS `/opt/onia/bot/` |
      |---|---|---|
      | `hermes-content/deploy/vps-ops/bot/bot-engine.mjs` | `b5a5c878…` = commit `994eb42d` (campañas) | `7f50f1a9…` = commit `3e3841aa` (comprobantes) |
      | `hermes-content/deploy/vps-ops/bot/knowledge.mjs` | `4ba53652…` | `d00a3c1f…` |
      | `hermes-content/deploy/vps-ops/bot/campanas-web.test.mjs` | existe | **no existe** |
      El VPS quedó **exactamente un commit atrás**: `994eb42d` nunca viajó. Confirmado sin
      grep de descarte sino contando en el motor que CORRE (contenedor `onia-center`,
      `/tmp/onia-bot/bot-engine.mjs`): **cero apariciones de `campanaExacta`**.
      **La consecuencia si Sergio hacía S9 tal como estaba escrito:** copiaba las 5 campañas a
      `/opt/onia/bot/knowledge.json`, el motor viejo las ignoraba —no tiene el código que las
      lee—, las 4 frases vivas seguían recibiendo el saludo genérico, y el ítem se daba por
      cerrado. Un fantasma más, y del tipo caro: uno que se escribe DESPUÉS de que alguien puso
      las manos en producción.
      **S9 corregido:** no es sólo el documento. Tienen que viajar **`hermes-content/deploy/vps-ops/bot/bot-engine.mjs`,
      `hermes-content/deploy/vps-ops/bot/knowledge.mjs`** y el documento a `/opt/onia/bot/knowledge.json`, y hay que **reiniciar** (`hermes-content/deploy/vps-ops/bot/webhook-server.sh`
      recopia al contenedor sólo cuando cambia su STAMP).
      **Lo construido para que esto no vuelva a pasar** — porque ya pasó dos veces, las dos
      descubiertas de casualidad y en direcciones opuestas (`d334d776`: el espejo quedó 25
      archivos atrás del VPS; hoy: el VPS quedó atrás del espejo):
      `hermes-content/deploy/vps-ops/bot/espejo-check.mjs` — un md5 por lado, sólo lectura, sin
      tocar el VPS. Sale 0 si el código coincide y 1 nombrando los archivos si no.
      El documento publicado y los `webhook.env*` quedan fuera del veredicto **a propósito**: son dato
      vivo, no código, y un gate que siempre está rojo lo apaga alguien.
      **Corrido contra producción**, que es la prueba de que sirve:
      ```
      ESPEJO DESINCRONIZADO — …/vps-ops/bot/ vs root@187.77.16.63:/opt/onia/bot
        DISTINTOS (el VPS corre otra version): bot-engine.mjs, bot-engine.test.mjs, knowledge.mjs
        FALTAN EN EL VPS (deploy a medias):    campanas-web.test.mjs, recepcionista.test.mjs
      ```
      8 tests nuevos (`hermes-content/deploy/vps-ops/bot/espejo-check.test.mjs`), uno de ellos con los md5 REALES de hoy: si ese
      caso pasara en verde, el gate no serviría. Suite del bot **634/634** (626 antes).
      📎 **Trampa que costó tres consultas y queda escrita en el encabezado del script:** el
      motor vive en TRES lugares —espejo, `/opt/onia/bot` del host, y `/tmp/onia-bot` **dentro
      del contenedor `onia-center`**, que es el que corre—. `ps` en el host muestra
      `node /tmp/onia-bot/webhook-server.mjs` y ese directorio **no existe en el host**: es el
      `/tmp` del contenedor. El 3 se rehace solo del 2 por el STAMP de `hermes-content/deploy/vps-ops/bot/webhook-server.sh`, así
      que alinear el 2 es lo que el próximo restart lleva al bot vivo.

---

## Después

- [ ] **"La cita" le habla de consultorio a una ferretería — y esta vez NO es el flag.**
      Encontrado en la recorrida v6.8, con `PLATFORM_LAYER=1` puesto, o sea que es el texto y
      no el entorno: en `/settings/chatbot` de `Ferreteria Circuito Completo` la tarjeta se
      titula **"La cita"**, pide **"Cuánto dura (minutos)"** y ofrece de ejemplo
      **"en el consultorio, o por videollamada"**. Una ferretería no agenda citas ni tiene
      consultorio. Son literales en `onia-platform/app/(dashboard)/settings/chatbot/ChatbotClient.tsx`
      — la pantalla sí usa el vocabulario del rubro, pero sólo para dos placeholders de ejemplo
      (`page.tsx:47`, `voc.ejemploNombre` y `voc.ejemploMiembro`), no para estos rótulos.
      **Lo barato que lo arregla:** `lib/onboarding/vocabulario.ts` no tiene todavía una palabra
      para "la cita" por rubro. Es un campo nuevo en un módulo que consumen muchas pantallas
      (Sidebar, Header, alta), así que **lo decide el carril de plataforma, no éste** — se
      anota con su prueba y se deja.

- [ ] **El disco de la máquina de Sergio se llenó al 100% y bloqueó el build.**
      No es una molestia: `next build` murió con `ENOSPC: no space left on device` y con
      **0 bytes libres** de 465 GB no se puede mirar ninguna pantalla. Se liberó lo
      inequívocamente muerto — la caché de npm, 308 carpetas `HeadlessChrome*` de Playwright en
      `%TEMP%`, y los `.next` de los **12 worktrees de `onia-platform` que ni siquiera tienen
      `node_modules`** (build sin con qué reconstruirse: basura por definición). Quedaron 5,9 GB
      y el build pasó. **La causa de fondo sigue ahí y no la arregla este carril:**
      `onia-platform` tiene **30 worktrees**, 13 con su propio `node_modules`. Cerrar los
      worktrees de ramas ya mergeadas es de cada carril; el de plataforma es el que lleva la
      cuenta.

- [ ] **Arrastrado del ítem 1: dos huecos de plataforma encontrados al levantar el entorno.**
      Ninguno bloquea el objetivo del carril; se dejan escritos con su prueba.
      1. ✅ **Arreglado en la misma vuelta:** el `connect-src` de la CSP
         (`onia-platform/next.config.ts`) sólo agregaba `wss://<host>` cuando la URL de
         Supabase era `https:`. Con un Supabase servido por `http` — el stack local, y
         cualquier self-host on-premise tipo Onia Box — el `ws://<host>` quedaba fuera y el
         navegador **bloqueaba el websocket de realtime en silencio**: se ve en consola
         (*"violates the following Content Security Policy directive"*). Lo usan la campana de
         notificaciones, la agenda y las citas (no `/inbox`, que no abre canal). Ahora el
         esquema del websocket se deriva del de la URL.
      2. ↔️ **Encontrado por las malas y YA arreglado por otro carril, media hora antes:**
         `npx eslint .` entra a `.claude/worktrees/*/.next/**` — el build de OTRO worktree —
         porque el `globalIgnores` de `eslint.config.mjs` sólo lista `.next/**` de la raíz.
         Acá costó dos intentos abortados antes de correr el lint acotado a mano; el commit
         `149e2a9` del repo `onia-platform` ya lo había resuelto moviendo el patrón al script
         `npm run lint` (20 min → 39 s). **La lección para esta cola: correr `npm run lint`,
         no `npx eslint .`** — y hacer `git pull` antes de pelearse con un gate lento, porque
         el arreglo puede estar en origin. La raíz de verdad (`globalIgnores`) sigue esperando
         a Sergio: el hook `config-protection` bloquea editar `eslint.config.mjs`.
      3. ⚠️ **El test nuevo de ese mismo arreglo es INESTABLE**, y un gate que parpadea no es
         un gate: `__tests__/eslint-no-lintea-worktrees.test.ts > "con ese patron, ni el build
         ni el codigo de otra rama entran"` falló en una corrida de la suite completa
         (2355 passed | 1 failed) y pasó solo y en la corrida siguiente (2356 passed). Se
         anota sin tocarlo — es de otro carril — pero el que lo escribió tiene que saberlo:
         lanza eslint de verdad desde el test, así que compite por CPU con los otros 190
         archivos.
- [ ] **Limpieza de la data QA NUEVA.** La del 29-ago ya se ejecutó; después se generó más:
      org `zzqa-horario-0001` ("ZZ QA Horario") con su usuario y su inbox, y las
      conversaciones QA 39, 43 y 44 (bandeja, insistencia, comprobante). **No borrar todavía**:
      son la evidencia de cuatro ítems cerrados, igual que las dos orgs que el carril de
      producto decidió NO borrar por el mismo motivo. Se limpia cuando haya conversaciones
      reales que las reemplacen como prueba.
- [ ] **Vigilar que el reconcile nocturno de Chatwoot no revierta el branding.** Son SEIS
      `installation_configs` (BRAND_NAME, INSTALLATION_NAME, WIDGET_BRAND_URL, LOGO,
      LOGO_DARK, LOGO_THUMBNAIL). El loop de orden (cron `63ae20ad`) los re-aplica, pero
      nunca se verificó que gane la carrera contra el reconcile. Si aparece el logo de
      Chatwoot en `chat.onia.com.bo`, re-aplicar LOS SEIS y limpiar caché
      (`GlobalConfig.clear_cache`).

      ⚙️ **Vigilado el 2026-08-31, y el ítem estaba mal escrito en tres puntos.** No son seis
      configs, la defensa no cubría lo que decía cubrir, y tres ya se habían perdido hace
      quince días sin que nadie lo viera.
      **1 · Son DIEZ, no seis.** Leído el YML del propio contenedor
      (`enterprise/config/premium_installation_config.yml`), `Internal::ReconcilePlanConfigService`
      restaura: INSTALLATION_NAME, BRAND_NAME, BRAND_URL, WIDGET_BRAND_URL, TERMS_URL,
      PRIVACY_URL, LOGO, LOGO_DARK, LOGO_THUMBNAIL y DISPLAY_MANIFEST.
      **2 · La defensa cubría TRES.** El cron real no es `63ae20ad` (ése es un loop de sesión):
      es `/root/bin/chatwoot-brand-onia.sh`, cada hora al minuto :17, y corre bien —
      328 ejecuciones, la última al cierre de esta vuelta. Pero re-aplicaba sólo
      INSTALLATION_NAME, BRAND_NAME y WIDGET_BRAND_URL. Los tres LOGO sobrevivían **por
      suerte, no por diseño**. Su copia versionada
      (`hermes-content/deploy/vps-ops/chatwoot-brand-onia.sh`) era idéntica al VPS por md5,
      así que el repo no mentía: la defensa estaba corta en los dos lados.
      **3 · Tres YA estaban revertidas, y se ven desde la calle.** `BRAND_URL`, `TERMS_URL` y
      `PRIVACY_URL` apuntan a `www.chatwoot.com` desde el **16-ago**. No es teoría: el HTML
      público de `https://chat.onia.com.bo/app/login` embebe el objeto de config del front y
      las tres salen ahí en texto plano. La regla dura del carril es que Chatwoot no se vea.
      **Lo que sí está bien, MIRADO y no supuesto:** el login renderiza el logo `onia` y
      "Iniciar sesión en Onia", y el widget del inbox 4 muestra al pie **"Desarrollado por
      Onia"**, con link a `https://onia.com.bo/?utm_medium=survey&utm_campaign=branding` e
      icono `https://onia.com.bo/apple-icon.png`. La cara que ve el desconocido está limpia.
      **La carrera, respondida con fechas:** los tres del script tienen `updated_at` del
      **24-ago** y los tres LOGO del **29-ago**. Como el script sólo escribe si el valor
      difiere, siete días sin que se muevan significa que **hoy el reconcile no está
      revirtiendo nada** — pero cuando atacó (18-ago, y el 16-ago con estas tres) ganó.
      **Lo construido:** `hermes-content/deploy/vps-ops/chatwoot-brand-onia.sh` ampliado a las
      **nueve** de marca (DISPLAY_MANIFEST queda afuera: su valor de fábrica es el que
      queremos) y con modo **`--check`** que no escribe y sale 1 si falta alguna. Corregido
      además un `| tail -1` que se comía la salida entera: por eso
      `/var/log/chatwoot-brand-onia.log` nunca pudo mostrar una reversión. Probado **contra
      producción en modo sólo-lectura**: `REVERTIDAS 3/9`, exit 1, y los `updated_at` de las
      tres siguen en 16-ago — no escribió.
      ⚠️ **No se aplicó al VPS: reemplazar un cron que corre solo cada hora es infra, y eso
      es de Sergio.** Son dos comandos y es reversible. Anotado como **S10**, cotizado en
      `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md`.
- [ ] **Botón "Cobrar con QR" dentro de la conversación** (pieza 5 del backlog v5). El
      circuito está completo en mock y verificado mirando (`/bcp/cobrar` + `/bcp/callback`,
      contrato del banco calcado); el código no cambia para el modo real. Espera las
      credenciales del BCP — ver Bloqueado.
- 📌 **Nota para el carril web-factory (no la ejecuta este carril):** tres de las frases de
  `site.ts` dicen *"avisen cuando Onia para comercio/servicios/importadoras esté listo"*, y
  eso es **exhibir obra en la superficie de venta** — prohibido por CLAUDE.md §3. Además los
  tres rubros ya se venden. Anotado acá para que no se pierda; lo decide su dueño.
  **2026-08-31, dato nuevo que simplifica la decisión:** los cuatro exports —
  `WA_TEXT_COMERCIO`, `WA_TEXT_SERVICIOS`, `WA_TEXT_PROVEEDORES` y `WA_URL`— **no los importa
  nadie** en todo `web-factory/` (verificado por grep en el repo y por `curl` contra las páginas
  vivas: ninguna los renderiza). No hay texto que corregir: es código muerto, y `WA_URL` dice de
  sí mismo ser "el CTA general de toda la página", así que probablemente se desconectó sin
  querer. Dos caminos, los dos baratos: borrarlos, o volver a conectar `WA_URL`.

---

## Bloqueado en Sergio

> Ninguno de estos frena la cola: se anota, se avisa y se sigue con el próximo desbloqueado.

| # | Qué | Por qué sólo él | Qué desbloquea |
|---|---|---|---|
| S1 | **Probar el popup de Embedded Signup con un +591 real** (`chat.onia.com.bo` → Add Inbox → WhatsApp → Connect with WhatsApp Business) | Necesita su sesión de Meta y un chip. Todo lo nuestro está hecho desde el 28-ago: Access Verification ✅, Configuration ID `1824225392073753`, dominio JS SDK autorizado, las 3 InstallationConfigs cargadas | Que un CLIENTE conecte su propio WhatsApp solo. ⚠️ Hoy el inbox que nazca queda huérfano — ver ítem 2 de Ahora |
| S2 | **Credenciales del BCP + certificado mTLS (`.pfx`)** | Trámite bancario | El botón "Cobrar con QR" en la conversación. Sin banco no hay código que lo destrabe |
| S3 | **Traslado del 75414930 a coexistencia** — OK explícito ("vamos con A") + ventana acordada + el PIN de dos pasos a mano | El número queda MUDO 30-60 min y el rollback depende de un PIN que sólo él tiene. Runbook completo: `hermes-content/docs/ONIA_RUNBOOK_COEXISTENCIA_75414930.md` | Que Sergio siga usando su app de WhatsApp en el mismo número que atiende el bot |
| S4 | **Verificar el push "te escribieron" en su celular** (suscribirse y recibir) | Hace falta un dispositivo real | El circuito está testeado 95/95 y deployado; sólo falta la prueba física |
| S5 | **¿Silenciar el Telegram de los agentes n8n que sí trabajan?** (Vendedor, Contenido, Finanzas, Prospector, Radar IA, Web Factory Radar) + los recordatorios de agenda cada 30 min | Es su canal y su umbral de ruido. No se apagan los workflows: hacen trabajo — hay que editar el nodo de aviso de cada uno | Que Telegram vuelva a ser sólo errores, que es la regla que ya se aplicó al resto |
| S7 | **Contestar (o descartar) a los cuatro desconocidos que escribieron y nadie respondió** — conv 35 (+591 73232758, clínica dental de 4 doctores, 25-ago), 37 (+591 73021804, 28-ago), 36 (`Saguilera@ds-santacruz.bo`, 27-ago) y 34 (widget, sin dato de contacto) | Vende Sergio, y son personas reales esperando desde hace 3-6 días. Un bot no puede retomar una conversación fría de hace una semana sin que suene a spam | El primer lead atendido del carril. Dos tienen número de WhatsApp y uno correo: tres de los cuatro son alcanzables hoy |
| S8 | **Decidir qué org se queda con los inboxes 4 (Onia Web) y 5 (Onia WhatsApp)** — y hacer los dos clicks. ✅ **El deploy YA NO es parte: se hizo el 31-ago 22:59** (verificado en el build de producción, que trae el 409 de tenencia y la validación de `88c1d56`) | Los dos inboxes son de Onia misma, así que elegir dueño es decidir en qué bandeja aterrizan los desconocidos. Opciones cotizadas en `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` §9 (recomendación: opción 1, `Onia (interna)` → inbox 5) | **El objetivo del carril entero, y ya no falta código ni deploy: faltan dos clicks.** Entrar a `/admin/organizations/<id>` de `Onia (interna)`, escribir `5`, Vincular. Base verificada en vivo el 31-ago: las cuatro orgs siguen sin vínculo salvo la de QA (inbox 7). ⚠️ **Corregido el 31-ago (2ª vuelta): el ítem 2 ya NO cuelga de acá.** Decía que las campañas sólo existían en modo recepcionista — era cierto y ya no lo es: ahora también se leen en modo venta, así que las frases de la web se destraban con S9, sin decidir dueño de inbox |
| S9 | **Publicar las campañas en el VPS — y son TRES archivos, no uno.** 🔴 **Corregido el 31-ago (3ª vuelta): tal como estaba escrito, esto NO encendía nada.** Decía copiar sólo `campanas-onia.knowledge.json` a `/opt/onia/bot/knowledge.json` porque daba el motor por desplegado; medido con md5, el VPS está **un commit atrás** (`3e3841aa`, sin `994eb42d`) y su `bot-engine.mjs` tiene **cero `campanaExacta`** — habría ignorado las campañas en silencio. Lo que tiene que viajar: **`bot-engine.mjs` + `knowledge.mjs`** (del espejo `hermes-content/deploy/vps-ops/bot/`) **+ `knowledge.json`** (desde `hermes-content/docs/chatbot/campanas-onia.knowledge.json`), y después **reiniciar** — `webhook-server.sh` sólo recopia al contenedor si cambia su STAMP. Verificar con `node hermes-content/deploy/vps-ops/bot/espejo-check.mjs` (tiene que salir 0) | Escribe en el VPS, y la regla dice que ningún deploy sale sin su OK | **El ítem 2 entero.** El motor del repo ya las lee en modo venta (634/634 verde, probado con este mismo documento); falta que el VPS TENGA ese motor y que el archivo del número traiga las campañas. Sin esto las 4 frases vivas de onia.com.bo siguen recibiendo el saludo genérico |
| S10 | **Aplicar al VPS la defensa ampliada de la marca de Chatwoot** — `scp` de `hermes-content/deploy/vps-ops/chatwoot-brand-onia.sh` a `/root/bin/` y una corrida manual | Reemplaza un cron que corre solo cada hora: es infra, y la regla del carril dice que el VPS es suyo | Que `BRAND_URL`, `TERMS_URL` y `PRIVACY_URL` dejen de decir `www.chatwoot.com` en el HTML público del login. Ya probado en modo `--check` contra producción: 3 de 9 revertidas |
| S11 | **Setear `CHATWOOT_BOT_AGENT_ID=3` en el servicio del bot del VPS** y recargarlo | Escribe en el VPS y cambia con qué identidad postea un bot vivo | Que la bandeja rotule **"Tu asistente"** en vez de **"Vos"** los mensajes del bot: hoy el dueño no puede distinguir su voz de la del asistente en su propia pantalla (MIRADO). Todo lo caro ya existe desde el 11-ago — el agente 3 "Onia Bot" tiene token y es miembro de los inboxes 4, 5 y 7. Opciones y el detalle del inbox 3 en `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` §11 |
| S6 | **Proyecto Supabase cloud `Dental-gest` (`kvepqgikokjlacxngkiw`) sigue ACTIVE_HEALTHY** — decidir pausar o borrar. Y si algún día se reactiva `Gesti-Os` (`jafxylfocvvlflpqfsix`), **rotar su `service_role` primero**: estuvo expuesto en los JSON de n8n que se redactaron el 29-ago | Es plata y es borrado de datos | Cerrar la cola del saneamiento de secretos |

---

## Cerrado — no rehacer

> **Siete de estos eran pendientes vivos en el handoff y ya estaban hechos.** Se verificaron
> uno por uno contra el código de hoy, no contra el handoff. Cada uno lleva su prueba: si
> alguien los vuelve a abrir, que sea contra el archivo, no contra la memoria.

**Cerrado en esta vuelta (2026-08-31):**

- [x] **Los 12 evals del bot estaban MUERTOS hace días y la cola reportaba "634/634 verde".**
      Encontrado en el Gate 1 de esta vuelta corriendo la suite, no leyéndola: `node --test`
      daba **635 tests, 634 pass, 1 fail**. El que fallaba era
      `hermes-content/deploy/vps-ops/bot/evals/evals.test.mjs`, y no fallaba un caso: **no
      cargaba el módulo**. `SyntaxError: The requested module '../run-turn.mjs' does not
      provide an export named 'LLM_SYSTEM_PROMPT'`.
      **La causa, con su commit.** `git log -S` lo señala solo: el export desapareció en
      **`d334d776`** — *"el espejo del motor quedó 25 archivos atrás del VPS"*—, la
      sincronización que trajo al repo la versión del VPS, donde el prompt estaba **inlineado**
      dentro de `askLiteLLM`. El texto nunca se perdió (es byte a byte el mismo); lo que se
      perdió fue el `export`, y con él la única forma que tenían los evals de importarlo.
      **Por qué nadie lo vio en tres vueltas.** Un archivo que no carga lo reporta `node --test`
      como **UN test roto entre 634 verdes**. Tres vueltas seguidas escribieron "634/634",
      "626/626", "619/619" leyendo el `pass` y no el `fail`. El costo real: los 12 evals que
      miden que el bot **no cotiza precios, no promete y deriva al humano** no corrían desde
      `d334d776` — justo los graders que cuidan la parte cara.
      **Lo que se hizo** — lo mínimo, sin cambiar una coma del comportamiento:
      `run-turn.mjs` vuelve a exportar `LLM_SYSTEM_PROMPT` como constante y `askLiteLLM` la
      usa (`const system = LLM_SYSTEM_PROMPT`), exactamente como antes de `d334d776`.
      **La prueba de que sirve, corrida:** los 12 evals ahora CORREN y dan
      **PASS 11/11 · 1 no corrida** — E12 (`modelo_real`) queda sin correr a propósito, porque
      llama al modelo pago y **ese gasto lo aprueba Sergio**.
      **Su guardia, y por qué no es un test de adorno:** el primer intento importaba la
      constante por nombre en `run-turn.test.mjs`, y al quitar el export **fallaba igual de
      silencioso** — se caía el módulo entero. Se cambió a `import * as runTurnModule`, así que
      ahora rompe **por su nombre**, con el motivo escrito, y los otros 8 tests del archivo
      siguen pasando. Verificado en los dos sentidos: con el export → verde; revirtiendo
      `run-turn.mjs` a `HEAD` → `✖ el prompt del LLM sigue exportado — si se inlinea, los evals
      dejan de correr en silencio`, `pass 8 · fail 1`.
      **Suite del bot: 647/647, `fail 0`** (antes: 635 con 1 en rojo).
      🔗 Es el **tercer** episodio del mismo agujero — espejo del repo vs `/opt/onia/bot` — y
      el primero descubierto por un gate y no de casualidad. Por eso en esta misma vuelta se
      commitea `hermes-content/deploy/vps-ops/bot/espejo-check.mjs`, que la vuelta anterior
      dejó **sin commitear** (estaba `??` en `git status`).

- [x] **v6.8 — recorrida de fricción completa.** Hecha el 2026-08-31 sobre las dos pantallas
      que el ítem nombra, con la sesión del dueño de `Ferreteria Circuito Completo` (la org
      vinculada al inbox 5), en escritorio **y** en móvil (375×812), MIRANDO capturas. La
      recorrida encontró **una cosa rota de verdad, que se arregló en la misma vuelta**, y
      corrigió dos de los tres roces que el propio ítem traía anotados.
      **Lo roto, y arreglado** (`onia-platform`, commit `fdcb3df`, mergeado a `master` y
      pusheado): **el globo verde de no-leídos no bajaba nunca.** `unread_count` sale de
      `agent_last_seen_at` de Chatwoot, y lo único que movía esa columna era la UI de Chatwoot
      — que el dueño no usa. Medido en la base de producción ANTES de tocar: de las 8
      conversaciones de los inboxes 4 y 5, **siete tenían `agent_last_seen_at` en NULL**.
      Ahora abrir la conversación llama a `update_last_seen` (después del guard de tenencia, y
      en `try/catch`: leer es lo que no puede romperse) y el cliente relee la lista una vez para
      que el globo baje sin esperar los 15 s del poll. Verificado MIRANDO contra el Chatwoot de
      producción: abrir la conversación 11 le sacó el globo en pantalla **mientras las otras dos
      lo conservan**, y su `agent_last_seen_at` quedó con la hora del click. Las de desconocidos
      (35 y 37) no se tocaron a propósito: S7 las espera sin leer.
      **Corrección al roce 2 del propio ítem — era fantasma, y de los caros.** Decía que "el
      buscador dice *Buscar pacientes…* en una ferretería" y sonaba a texto dental hardcodeado.
      No lo es: `Header.tsx:28` y `Sidebar.tsx:53` YA leen `vocabularioDeTrack(...)`, y lo que
      faltaba era el flag. Con `PLATFORM_LAYER=1` — que es **el valor de producción**, leído con
      `docker inspect onia-platform` — la misma pantalla dice **"Buscar productos…"** y el menú
      pasa de `Pacientes · Cobros · Reportes` a **`Catálogo · Inventario · Caja`**. MIRADO en las
      dos configuraciones. El roce existía sólo en local, por una variable que faltaba en
      `.env.local`. **El roce 1 (la barra del admin encimada) NO se re-verificó**: vive en
      `/admin/organizations/<id>`, que no es ninguna de las dos pantallas que este ítem nombra.
      Queda como estaba — pero ojo, nació con el mismo entorno sin flag que produjo el roce 2, así
      que antes de perseguirlo conviene volver a mirarlo con `PLATFORM_LAYER=1`.
      **Un roce nuevo, MIRADO:** al entrar a `/inbox` el modal **"Primeros pasos"** se abre encima
      y tapa la lista entera de conversaciones; hay que cerrarlo para ver quién escribió. Es el
      checklist de alta (`components/onboarding/GuiaInicio`), y aparece incluso con conversaciones
      esperando.
      **Lo que la recorrida NO pudo cerrar, y quedó anotado en su lugar:** "La cita" le habla de
      consultorio a una ferretería incluso con el flag puesto (ficha nueva en "Después", es del
      carril de plataforma), y el bot firma **"Vos"** en vez de "Tu asistente" (**S11** + radar §11).
      **Dos trampas nuevas del entorno**, que van a costar una vuelta a quien las repita y por eso
      se escriben: `npm run build` usa Turbopack y **no emite `.next/standalone`** — para poder
      levantar el producto hay que correr `next build --webpack`, que es además lo que
      `next.config.ts` declara como build de deploy; y ese build **exige `ENCRYPTION_KEY`** o
      muere en "Failed to collect page data for /api/gateway-config/test". Las dos van a la skill
      `onia-verificacion`.

- [x] **1 · Contar si un desconocido YA escribió.** Contado contra las dos bases, no contra el
      handoff. **La respuesta es SÍ: cinco desconocidos, y ninguno se ve en `/inbox`.**
      **El número.** La cuenta 2 de Chatwoot tiene hoy **22 conversaciones**, no 26 — el
      handoff (`hermes-content/docs/handoff/chatbot.md:142`) traía un número viejo. Repartidas
      en cuatro inboxes: 3 `ONIA Demo` (8, todas pruebas nuestras de julio), 4 `Onia Web` (5),
      5 `Onia WhatsApp` (3), 7 `ZZ QA Clinica Chatbot` (6, todas QA).
      **Los cinco desconocidos**, con la evidencia que los distingue de una prueba nuestra —
      `additional_attributes` de cada conversación, que guarda dispositivo y referer:
      | conv | inbox | quién | cuándo | qué escribió | ¿le contestaron? |
      |---|---|---|---|---|---|
      | 34 | 4 web | iPhone/Safari, referer `onia.com.bo/comparativa` | 24-ago | "hola" | no |
      | 35 | 5 WhatsApp | +591 73232758 | 25-ago | *"estoy evaluando un sistema de gestión para una clínica odontológica de 4 doctores…"* | **no** |
      | 36 | 4 web | iPad/Google Search App, referer `onia.com.bo` | 27-ago | "Quiero información" + dejó su correo `Saguilera@ds-santacruz.bo` | no |
      | 37 | 5 WhatsApp | +591 73021804 | 28-ago | *"Hola, vengo de la web de Onia. Quiero saber si me sirve para mi negocio."* | **no** |
      | 40 | 4 web | iPhone/**Instagram**, referer `onia.com.bo` | 29-ago | "Ajajajajaj" → *"0 ni una reunión"* | sí |
      **Por qué cuatro de cinco quedaron sin respuesta, y por qué NO es un bug nuevo.** Los
      cuatro (34, 35, 36, 37) tienen **cero filas** en `onia_center.bot_messages`: el motor
      nunca los vio. Sus fechas — 24, 25, 27 y 28 de agosto — caen exactamente dentro de la
      caída de cuatro días que ya está cerrada más abajo. Desde el 29-ago el motor procesa
      normal (conv 38 y 40 sí tienen sus filas). **La caída ya tiene su precio medido: cuatro
      personas reales.** No se abre ítem por esto; la causa está auto-curada en
      `hermes-content/deploy/vps-ops/bot/webhook-watchdog.sh`.
      **Y el inbox.** Ninguno de los dos inboxes donde escribieron (4 y 5) es el
      `chatwootInboxId` de ninguna org — la única org con inbox es la de QA. O sea que **aunque
      el motor hubiera estado vivo, esas conversaciones tampoco se habrían visto en `/inbox`**.
      Eso es el ítem 1 de Ahora, y esta medición es su prueba.
      ⚠️ Sólo lectura, como pedía el ítem: no se borró ni se respondió nada. Contestarles es
      decisión de Sergio — anotado como S7 en Bloqueado.

**Los siete fantasmas** (el handoff los seguía listando como pendientes):

- [x] **Los DOS "fixes de fondo del motor" del 23-ago** que el handoff decía que "siguen
      esperando su sesión". Los dos están puestos: el timestamp en el arranque vive en
      `hermes-content/deploy/vps-ops/bot/webhook-server.mjs:542-545` (con el comentario que
      cita el pedido de los dos handoffs), y `markMessageDelivered` en el turno normal está
      en `hermes-content/deploy/vps-ops/bot/chatwoot-adapter.mjs:733-737` — se cerró como
      PIEZA 4 el 29-ago y el handoff lo arrastró igual en "Próximos pasos".
- [x] **"Decisión: FAQ genérica por cliente (`id:"negocio"`)"**, listada como pendiente de
      Sergio. Está viva y contestando desde el 28-ago:
      `hermes-content/deploy/vps-ops/bot/knowledge.mjs:66` mapea `negocio → R_FAQ_NEGOCIO`,
      con su guardarraíl de palabras disparadoras en la línea 394.
- [x] **"¿Cablear la alerta del watchdog a Telegram?"**, listada como decisión pendiente.
      Ya está cableada: `hermes-content/deploy/vps-ops/bot/webhook-watchdog.sh` avisa bot
      caído y BOT MUDO hacia Chatwoot (1 aviso por incidente + recuperación).
- [x] **"Pantalla del dueño para su canal, sin pasar por el superadmin"** (Próximos pasos 2).
      Es la pieza 3 del 29-ago: `app/(dashboard)/settings/chatbot/CanalWebCard.tsx` con el
      botón de encendido y el snippet, sobre `lib/chatbot/canal-web.ts`.
- [x] **"Siembra con datos reales + bench de humo"** (Próximos pasos 1). El bench existe y da
      6/6: `hermes-content/deploy/vps-ops/bot/humo-plantillas.mjs` con su fixture
      `hermes-content/deploy/vps-ops/bot/plantillas-humo.json`; la plantilla bebe el horario
      real de la org desde `lib/chatbot/plantillas.ts`.
- [x] **"Limpieza de data QA (conversaciones 29/31/32/33, inbox 6, filas sintéticas)"**,
      listada como pendiente de coordinar con Sergio. **Ejecutada el 29-ago 00:40 con su
      aprobación**: 10 conversaciones + el inbox 6 huérfano destruidos por rails, 12
      `bot_conversations` y 52 `bot_messages` sintéticos borrados, backups CSV en
      `/opt/onia/backups/db/qa-limpieza-20260829-003953/`. La data QA que quedó es
      **posterior** — está en Después.
- [x] **"Pricing: ¿existe un escalón más barato sólo widget web, sin WhatsApp?"**. Sergio lo
      decidió el 30-ago: **OPCIÓN A, Bs 390 plano todo incluido**, ratificado y sin cambio de
      código porque `lib/pricing.ts:23` ya lo tenía (`entryMonthly: 390`, `annualTotal: 3900`).
      La comparativa que sostiene la decisión: `hermes-content/docs/ONIA_PRICING_CHATBOT_PROPUESTA.md`.

**Lo construido y verificado en producción** (resumen; el detalle largo vive en el handoff):

- [x] Editor del chatbot **pre-armado por rubro** (`lib/chatbot/plantillas.ts`, 19 tests) +
      el bug de UI que dejaba el nombre del servicio en 26px.
- [x] **Bandeja nativa `/inbox`** viva: backend (`lib/chatbot/bandeja.ts`,
      `lib/chatbot/bandeja-auth.ts`, `app/api/bandeja/route.ts`), pantalla
      (`app/(dashboard)/inbox/InboxClient.tsx`), tenencia revalidada fila por fila, y el
      **candado bot-humano** con armado y desarme.
- [x] **Multimedia** en la bandeja, **visión LLM** (`hermes-content/deploy/vps-ops/bot/vision.mjs`,
      US$ 0,0007 por imagen) y **detector de comprobantes** — que jamás confirma un pago.
- [x] **Editor conversacional** "Enséñale conversando"
      (`app/(dashboard)/settings/chatbot/EnsenaleConversando.tsx` +
      `lib/chatbot/editor-conversacional.ts` + `hermes-content/deploy/vps-ops/bot/editor-sugerir.mjs`).
- [x] **Insistencia** con perilla en el panel y barrido por cron
      (`hermes-content/deploy/vps-ops/bot/insistencia-run.mjs`), **push "te escribieron"**
      (`lib/chatbot/push-te-escribieron.ts`) y **frases de campaña** (deploy `e5c1ad3`).
- [x] **El motor estuvo caído 4 días** (24 al 28-ago) y volvió: `/tmp/onia-bot` a medias +
      la excepción de firewall perdida en el reboot. Las dos causas están auto-curadas desde
      `hermes-content/deploy/vps-ops/bot/webhook-watchdog.sh`.
- [x] **Branding de Chatwoot completo** (seis configs), **canario de auth** cada 5 min,
      **n8n saneado** (4 workflows con claves vivas redactados y archivados, 27 inactivos
      archivados) y el **webhook de Cal.com despublicado** — estaba huérfano y aceptaba POSTs
      forjados.

---

## Rechazado, con motivo — no volver a proponerlo

- **Difusiones masivas** (el último hueco contra Sendy). Necesita plantillas de Meta
  **aprobadas por cada org** y tiene costo por mensaje a partir del 1-oct-2026, cuando se
  cierra la ventana gratis de 24 h. Construirlo sin un cliente que lo pida es especificar a
  ciegas un flujo cuyo costo todavía no conocemos. **Se reabre el día que un cliente lo pida**,
  y ahí se especifica con su caso.
- **Un escalón de precio más barato "sólo widget web"**. Ya decidido: Bs 390 plano todo
  incluido (`lib/pricing.ts:23`). Reabrirlo es desandar una decisión de Sergio del 30-ago
  tomada con la comparativa de mercado en la mano.
- **Apagar los workflows de n8n que avisan por Telegram.** Hacen trabajo real: apagarlos para
  bajar ruido rompe la automatización para arreglar una notificación. Lo que corresponde es
  editar el nodo de aviso de cada uno — y eso espera la decisión S5.
- **Un modelo local para la visión del bot.** Sergio ya lo descartó el 30-ago con el motivo
  escrito: *"pagamos api nomás de modelo barato"* — ollama ya estranguló el VPS una vez
  (steal 93%, load 158). El costo medido de la API es US$ 0,0007 por imagen.
