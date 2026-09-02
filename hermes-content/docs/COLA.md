# La cola — qué se hace ahora

> **Este archivo es la memoria del trabajo.** Vive en el repo a propósito: los loops de una
> sesión mueren cuando se cierra Claude Code, y con ellos se perdía la cola entera.
> Cualquier sesión lo lee, lo ejecuta y lo actualiza. Sergio también lo puede editar.

**Objetivo vigente (Sergio, 2026-08-31):** **terminar el producto.** Textual: *"cómo querés
escribirles si ni siquiera el producto está terminado; dedicate a terminar el producto y recién
escribimos"*.

**Qué significa terminado está escrito y medido en
[`ONIA_DEFINICION_DE_TERMINADO.md`](ONIA_DEFINICION_DE_TERMINADO.md)** — cuatro puntos (**los dos del carril producto —3 y 4— cerraron el 2026-08-31 sin escribir
una línea: el 3 era fantasma y el 4 ya estaba construido. El 2 también cerró ese día, por la
salida honesta: `f47d615` sacó el "agenda" de `lib/pricing.ts` y le queda sólo el deploy, que
decide Sergio. Queda el 1, de chatbot**), sólo
cosas **rotas** (el cliente las compra y no funcionan) o **falsas** (se las vendemos y no son
ciertas). Nada de "sería lindo".

⚠️ **Hay 7 personas reales esperando y NO se les contesta hasta cerrar esa lista.** Un lead
bueno se quema una sola vez. Quiénes son, qué dijeron y dónde vive cada uno:
[`ONIA_LEADS_ESPERANDO.md`](ONIA_LEADS_ESPERANDO.md).
*(Acá decía que estaban en `ONIA_RADAR_DECISIONES_PRODUCTO.md` §8 y en la cola del chatbot.
**Era falso** —verificado el 2026-08-31: esa §8 habla de una rama de git y no hay cola del
chatbot en el repo—, y es la peor clase de dato falso: hace creer que están guardados.)*

**Estado (medido en la base de PRODUCCIÓN el 2026-09-01):** el circuito **ya corrió en producción**,
no sólo en local. La organización `ZZ QA Circuito Completo` (`cmtj22i3q000001khaxefs8ft`) tiene
`onboardingCompletedAt = 2026-09-01 19:31`, **1 cita**, **3 productos** y un `subscription_payments`
en **`APPROVED` por Bs 320,00** (`TRX-20260901-QA01`, revisado 19:40 UTC).
*(Acá decía "verificado de punta a punta **en local**". Quedó viejo el mismo día: hasta esta
mañana los contadores de producción eran 0 citas / 0 productos / 0 pagos, y el LISTO del punto
era justamente que dejaran de serlo.)*

---

## Cómo se trabaja esta cola

1. Se toma **el primer ítem no bloqueado**. Uno por vuelta.
2. Se **analiza antes de desarrollar**: Gate 1 — ¿ya está hecho? ¿el bloqueo existe de verdad?
   ¿el dato sigue vigente? ¿ya vive en el repo? Un "ya está hecho" heredado es hipótesis.
3. Se **desarrolla** con test primero, verificado en ROJO por el motivo correcto.
4. **Gates completos: `npx tsc --noEmit` + `npx vitest run` + `npm run lint`.** Los tres.
   ⚠️ **El lint se corre por `npm run lint`, NO por `npx eslint .`** — el script trae el
   `--ignore-pattern` que deja afuera los ~30 worktrees; sin él son **20 minutos en vez de 39
   segundos** y el gate se termina salteando (medido y arreglado el 2026-08-31). El 2026-08-29 se rompió
   CI dos veces por correr sólo los dos primeros: lint es lo que CI verifica y lo que caza
   `react/no-children-prop`.
5. Si toca pantalla, **se abre y se MIRA** con captura. Un 200 no es verificación.
6. Se marca acá con `[x]` y una línea de qué quedó. **Lo tachado no se rehace.**
7. Si algo se bloquea con una decisión de Sergio: `PushNotification` de una línea **y seguir con
   lo desbloqueado**. Un ítem trabado no frena la cola.

**Nunca:** desplegar al VPS, tocar worktrees o ramas de otras sesiones, gastar plata, ni bajar una
superficie viva. Mergear a master **sí** está pre-autorizado con gates verdes (Sergio, 2026-08-29)
— avisar después, no antes.

---

## Ahora — plan de features (revisado 2026-08-30, con Gate 1 corrido)

> **Cuatro de los seis ítems del plan de la mañana murieron al verificarlos.** No estaban
> hechos "más o menos": estaban hechos, o estaban decididos, o el costo era otro. Queda
> escrito acá para que ninguna sesión los vuelva a abrir.

- [x] **P3 · "El agente que trae clientes no se puede encender nunca" — FANTASMA, y el motivo
      vale más que el ítem.** Era el punto 3 de `hermes-content/docs/ONIA_DEFINICION_DE_TERMINADO.md`, el **único**
      de esa lista en el carril producto. Su premisa — *"`addon.inmobiliaria`, una clave que no
      está en el catálogo de add-ons"* — es **falsa desde el 2026-08-13** (commit `4077f2c`).
      Verificada la cadena entera, eslabón por eslabón: la clave está en `ADDON_IDS`
      (`lib/platform/types.ts:73`); el `POST` de `app/api/admin/organizations/[id]/entitlements/route.ts:101`
      la acepta validando con `isFeatureKey` (catálogo cerrado, fail-closed); la pantalla
      `app/(dashboard)/admin/organizations/[id]/capacidades/CapacidadesOrg.tsx:56` lista **todos** los `ADDON_IDS`
      y le escribe su propia descripción; y el runtime
      (`lib/onia-core/modules/agents-runtime.ts:1188`) lee **la misma fila** que esa pantalla
      escribe — `organization_entitlements` es `@@unique([organizationId, featureKey])`
      (`prisma/schema.prisma:1929`), así que no hay fila vieja que pueda ganarle a la nueva.
      Probado en los dos sentidos en `lib/onia-core/modules/agents-runtime.test.ts:613`. **Cero líneas de código
      tocadas: no había nada roto.** El `kind_not_enabled` de las 14 corridas es la respuesta
      correcta — nadie lo compró — y coincide con el rechazo de **F4** que ya estaba escrito
      en este mismo archivo.
      **La lección, que es lo que se lleva la vuelta: hay DOS catálogos y el punto los mezcló.**
      `lib/pricing.ts` es el **comercial** (lo que se cobra) y ahí `inmobiliaria` no está;
      `lib/platform/types.ts` es el de **feature keys** (lo que se puede otorgar) y ahí sí está.
      Buscar la clave en el archivo que CLAUDE.md declara "fuente única de add-ons" y no
      encontrarla lleva derecho a la conclusión falsa. Es **verificar contra el sistema
      equivocado** otra vez, la cuarta anotada en esta cola.
      **Residuo real, y NO es roto ni falso:** sin precio en `lib/pricing.ts` el add-on **no se puede
      comprar**, sólo otorgar a mano. El catálogo de venta no lo ofrece — lo nombra en su
      sección de lo que falta (`hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md:249`), así que no le miente a nadie.
      Ponerle precio es decisión de Sergio.

- [x] **P4 · El cobro por QR — FANTASMA: el circuito entero ya está construido y verde.**
      Gate 1 lo cazó antes de escribir una línea. El ítem describe el repo de **antes** del
      commit `753718f` (*"feat(pagos): enchufe listo del QR dinamico del BCP"*), que ya está
      en `master`. Verificado eslabón por eslabón, no por grep:
      - **Cliente del banco:** `lib/gateway/bcp-qr.ts` — generación (`/api/v4/Qr/Generated`),
        consulta (`/api/v3/Qr/Consult`), mTLS por `BCP_QR_CERT_PATH` y TLS 1.2 forzado, y el contrato de
        respuesta del callback (`buildBcpCallbackAck` / `buildBcpCallbackError`).
      - **Genera el QR:** `app/api/subscription-payment/bcp-qr/route.ts` — crea la fila
        `subscription_payments` PENDING marcada con `BCP_QR_BANK_MARKER`, así una referencia
        tipeada a mano en el flujo manual no puede colisionar con la del banco.
      - **Webhook con auth validada:** `app/api/webhooks/bcp/route.ts:55` —
        `validateBcpCallbackAuth` compara en tiempo constante y es **fail-closed** (sin
        `BCP_QR_CALLBACK_*` responde 503 y no activa nada).
      - **Activación automática:** el mismo webhook (`app/api/webhooks/bcp/route.ts:120`) confirma contra
        `/Qr/Consult` **antes** de activar —el callback del BCP no viene firmado, sólo Basic—
        y activa por el circuito compartido (`evaluateAutoApproval` + `claimPendingPayment` +
        `buildPlanActivation`), idempotente ante los 3 reintentos del banco.
      - **Pantalla:** `app/checkout/page.tsx:84` pasa `bcpQrDisponible={isBcpQrConfigured()}` y
        `app/checkout/CheckoutClient.tsx:573` muestra el QR real o cae al flujo manual.
      - **Flag apagado:** el flag son las env vars. Sin ellas `getBcpQrConfig()` devuelve
        `null`, el checkout sigue manual y **nada revienta** (test explícito).
      **Y el "proveedor simulado" que pedía el LISTO existe de verdad:**
      `lib/gateway/bcp-qr.test.ts:96` levanta un servidor HTTP local ("servidor local de
      mentira") y verifica la forma del request contra la spec — no es un mock del propio
      módulo. **32 tests verdes** en los tres archivos (`lib/gateway/bcp-qr.test.ts`,
      `app/api/webhooks/bcp/route.test.ts`, `app/api/subscription-payment/bcp-qr/route.test.ts`),
      corridos hoy en el worktree `cobro-qr`. **Cero líneas de código tocadas: no había nada roto.**
      **Lo que falta es exactamente lo que el propio ítem decía que faltaba: la credencial del
      BCP** (P1 URL de producción, el set Username/Password/AppUserId/PublicToken/BusinessCode
      y el certificado de `BCP_QR_CERT_PATH`). Encender = cargar env vars. Depende de Sergio y del banco, no del código.
      **Lección:** el ítem no mentía cuando se escribió — **envejeció**. Un pendiente heredado
      describe el repo del día en que se redactó, no el de hoy. Por eso el Gate 1 corre **antes**
      de tocar una línea, no después.

- [x] **Paso 3 otra vez, y esta vez el defecto NO era un `[x]` mal citado: `master` estaba ROJO
      — ARREGLADO y mergeado.** Vuelta del 2026-08-31, con la cola sin un solo ítem desbloqueado
      en "Ahora" (F2, F5, los 4 números de WhatsApp y el `DELETE` de pagos siguen esperando **una
      línea de Sergio**). El paso 3 pide reverificar los cierres *contra el código de hoy*, y hoy
      no es el de la auditoría anterior: `origin/master` pasó de `0711ff6` a `3c339a6` con commits
      del carril chatbot. **Los 12 shas citados siguen siendo ancestros reales** de la punta de
      hoy — ningún cierre falso.
      **Lo que apareció al correr los tres gates sobre esa punta nueva:**
      `__tests__/eslint-no-lintea-worktrees.test.ts` **falló** con `Test timed out in 5000ms` a
      los **8.159 ms**… y **la corrida siguiente, sobre el MISMO commit, salió verde**. Nadie
      había roto nada: la primera llamada a `isPathIgnored` carga el flat config **entero** del
      proyecto (parser de TS y plugins) — medido, **1.670 ms con la máquina en reposo**, ~8 s con
      la suite en paralelo — y el default de vitest son 5 s. **El tope estaba medido como si la
      máquina estuviera libre.**
      **Por qué es más grave que un test lento, y es la misma lección que este archivo ya
      guarda con otra cara:** ese test existe para que el gate de lint no se abandone, y **un
      gate que falla al azar se ignora igual que uno que tarda 20 minutos**. Peor: rompe CI sin
      que nadie haya tocado nada, y el próximo que lo vea en rojo va a buscar el bug en su
      propio cambio. El 2026-08-31 se arregló que el gate **mintiera** y que **tardara**; faltaba
      que fuera **determinista**.
      **El arreglo, dos cambios chicos:** una sola instancia de `ESLint` para los dos casos que
      preguntan por rutas (la carga en frío se paga una vez, y queda **un** test expuesto en vez
      de dos) y tope explícito de 30 s en esos dos casos.
      **Descartado el camino que parecía mejor, y queda escrito para que nadie lo reabra:**
      `overrideConfigFile: true` lo vuelve hermético y baja el costo a **6 ms** — pero sin el
      config del proyecto eslint se queda sin patrones `files`, no matchea nada y da **TODO** por
      ignorado. El cuarto caso ("y el código de ESTE árbol se sigue linteando") pasaría en verde
      **afirmando lo contrario de lo que mide**. Medido antes de descartarlo, no supuesto.
      Gates sobre `3c339a6`: tsc **0** · lint **0 errores** (101 warnings preexistentes) ·
      **2359 pasan + 5 skip (192 archivos)**. Commit **`e644c85`**, **ya en `origin/master`** por
      fast-forward.
      **Dos apuntes de método que costaron tiempo en esta vuelta:**
      (1) **El árbol principal de `onia-platform` se movió mientras trabajaba** (`b3adffc` →
      `3c339a6`, otra sesión). Estaba limpio y por eso casi edito ahí; se hizo worktree propio,
      que es lo que la regla pedía. **"El árbol está limpio" no significa "nadie más lo está
      usando".**
      (2) **La trampa de CRLF de los snapshots es real y saltó**: `vitest` reescribió
      `components/layout/__snapshots__/navigation.test.ts.snap` y
      `lib/platform/__snapshots__/vertical-pack.test.ts.snap`. `git diff --ignore-all-space` dio
      vacío (sólo fin de línea) y se restauraron; **no entraron al commit**.
      **Y una cita que la auditoría dejó falsa, corregida en los dos archivos:** el add-on
      **`addon.inmobiliaria` ya no existe — se renombró a `addon.captador` hoy mismo**
      (`lib/platform/types.ts:75`, carril ajeno), justo por el motivo que esta cola había
      escrito: era un add-on nombrado por un rubro que Onia no vende. El pipeline es genérico y
      **el copy inmobiliario ya está corregido**, así que el motivo del rechazo de **F4** cambió:
      hoy sigue apagado por no estar otorgado, no por su copy. **El residuo real no se movió:**
      `captador` **tampoco está en `lib/pricing.ts`** (verificado hoy), así que se otorga a mano
      pero **no se puede comprar**. Ponerle precio sigue siendo decisión de Sergio.
      *(Deriva de línea corregida de paso: `lib/onia-core/modules/agents-runtime.ts` pasó de la
      línea 1157 a la **1188**.)*

- [x] **F3 · `/requerimientos` ya es alcanzable.** Estaba en `COMMON_SEGMENTS` —el gate la
      dejaba pasar para todos los packs— y no tenía **un solo `href`** en `app/`,
      `components/` ni `lib/`. El arreglo no fue sólo el enlace: **que el gate deje pasar un
      segmento no significa que exista un camino para entrar**, y esa brecha no la cubría
      ninguna guarda. Ahora hay un test que hace imposible el próximo huérfano — cada segmento
      común o entra a algún nav, o se declara en `SIN_NAV_A_PROPOSITO` **con el motivo**. La
      guarda tiene su recíproco (un segmento ya enlazado no puede quedarse en la lista de
      excepciones), y eso cazó **dos entradas mías de más** en el mismo commit en que las
      escribí. Entró a los 4 navs porque es transversal, con roles SUPERADMIN/ADMIN/STAFF:
      perseguir papeles es de recepción, no del profesional. Gates: tsc 0, eslint 0 errores,
      **2282 tests verdes**. Commit **`ab9e0de`** (*"feat(nav): /requerimientos existia sin un
      solo enlace en todo el repo (#57)"*), **ya en origin/master**.
      *(Corregido el 2026-08-31: acá decía `6d8b6b7`, que es el sha **local de la rama antes
      del squash** y no existe en origin/master. El trabajo sí llegó —
      `components/layout/navigation.ts:45`, `lib/platform/vertical-pack.ts:169` y la guarda
      `SIN_NAV_A_PROPOSITO` de `lib/platform/route-access.test.ts` están en master. Citar el sha
      de la rama y no el del merge hace que la próxima auditoría lea "no llegó" sobre trabajo
      que sí llegó.)*

- [x] **F6 · Frase corrida en la pantalla del portal del cliente — ARREGLADO.** El diagnóstico
      heredado era correcto y se confirmó en vivo: la API
      (`app/api/portal/requerimientos/route.ts:21`) manda *"El enlace no es válido o venció"*
      **sin punto** y la pantalla lo concatena con " Pedí un enlace nuevo…". El fallback del
      literal **sí** traía el punto, así que leyendo el código el bug se veía arreglado y en
      vivo no lo estaba. Se puntúa **en el borde** con `frasePuntuada()` (`lib/utils.ts`, junto
      al resto de helpers de texto, con su test en `lib/utils.test.ts`) y no mensaje por
      mensaje: los otros dos errores de esa misma ruta ("No pudimos cargar tus requerimientos",
      "Error interno") tenían el mismo defecto y quedan cubiertos, igual que el próximo que se
      agregue. **Verificado MIRANDO la pantalla renderizada** con un token inventado — se lee
      *"El enlace no es válido o venció. Pedí un enlace nuevo a la persona que te lo envió."*
      Gates: tsc 0, eslint 0 errores, **2331 tests verdes**. Commit `0711ff6` en `master`.
      *(Nota de entorno: `next dev` con Turbopack no arranca en esta máquina — falla al
      spawnear el proceso de PostCSS con `0xc0000142`. Con `next dev --webpack` levanta en
      segundos. No es del producto; sirve para la próxima verificación visual.)*

- [x] **Los 7 leads que esperan NO estaban anotados en ningún lado — y el punto 1 ya no está
      bloqueado.** Vuelta del 2026-08-31, con la cola sin un solo ítem desbloqueado en "Ahora"
      (F2, F5, los 4 números de WhatsApp y el `DELETE` de pagos esperan una línea de Sergio).
      **El defecto lo destapó leer la cola misma:** este archivo y
      `hermes-content/docs/ONIA_DEFINICION_DE_TERMINADO.md` decían, los dos, que las 7 personas
      estaban *"anotadas en `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` §8 y en la cola del chatbot: no
      se pierden"*. **Falso**: la §8 de ese archivo habla de una rama de git, no hay cola del
      chatbot en el repo, y la frase "7 personas" no aparecía en **ningún otro archivo**. Es la
      peor clase de dato falso — hace creer que el activo más caro del negocio está guardado.
      - **Recuperados de los sistemas donde viven de verdad, no de un doc**, y escritos en
        `hermes-content/docs/ONIA_LEADS_ESPERANDO.md`: los **3 pedidos de acceso** de
        `public.access_requests` (los tres con `contactedAt` NULL) y las **4 conversaciones**
        reales de Chatwoot, separadas de las de QA, de las del inbox "ONIA Demo" y de las de
        Sergio.
      - **Lo que sólo se ve mirando la base:** a los **dos leads de WhatsApp no les llegó ni
        una plantilla** — cero mensajes salientes. El de la clínica de 4 doctores escribió el
        25-ago **6 preguntas concretas** y recibió silencio absoluto. Y el correo de otro lead
        (Saguilera@ds-santacruz.bo) vive **dentro del texto del mensaje**, no en el campo
        `email` del contacto: si nadie abre esa conversación, ese dato no existe.
      - 🟢 **El hallazgo que destraba: el punto 1 de la definición de terminado ya tiene su
        herramienta VIVA en producción.** Ese punto decía que *"la única pantalla que lo muestra
        es de sólo lectura"* — y esa pantalla es
        `app/(dashboard)/admin/organizations/[id]/WhatsAppOrgConfig.tsx`. Es falso: el commit `88c1d56` le puso
        el formulario editable (`handleSaveInbox` → `patchWhatsApp({ chatwootInboxId })`).
        **Y está desplegado** — verificado contra el contenedor `onia-platform` del VPS, no
        contra el repo: el string `"Org vinculada al inbox"` está en el bundle que sirve hoy.
        Lo mínimo que ese punto pedía **ya existe**; falta **usarlo una vez**.
      - ⚠️ **Y acá casi me equivoco, así que queda escrito:** `git merge-base --is-ancestor
        88c1d56 e5c1ad3` da **NO**, o sea "no está desplegado" — y es la respuesta equivocada,
        porque **`e5c1ad3` ya no es lo que corre**. Preguntarle la ancestría a un sha que esta
        misma cola anotó como "lo desplegado" es **verificar contra el sistema equivocado** una
        vez más, con la cara nueva de un dato propio que envejeció. Lo que zanjó la pregunta fue
        **grepear el bundle del contenedor**.
      - **Corregidas las 3 afirmaciones falsas** (la cita del §8 en los dos archivos, y el
        "sólo lectura" del punto 1), cada una con la medición al lado.
      **Cero líneas de producto tocadas: el defecto era de datos y de docs, no de código.**
      **Lo que NO se hizo, a propósito:** vincular una org al inbox 5 para que los leads se vean.
      Es una **escritura en producción** sobre un ítem del carril chatbot, y este loop no escribe
      en la base de producción. Es 1 minuto para Sergio o para el dueño de ese carril.

- [x] **El punto 2 de la definicion de terminado — "vendemos que el bot agenda y el bot no
      agenda" — ARREGLADO, y el defecto de verdad era que la frase estaba escrita DOS veces.**
      La vuelta empezo en el paso 3 (la cola no tenia un solo item desbloqueado en "Ahora": F2,
      F5, los 4 numeros de WhatsApp y el `DELETE` de pagos siguen esperando **una linea de
      Sergio**) y termino arreglando el unico item 🟠 **falso** que quedaba en el carril producto.
      **Auditoria del paso 3, primero, y salio limpia:** los 24 shas citados en este archivo
      existen y los que se declaran ancestros de `origin/master` lo son; los 4 que no
      (`6edfab6`, `a15c82f`, `e46e9ee`, `6d8b6b7`) son los duplicados locales que este mismo
      archivo ya documenta. Los tres gates sobre la punta de hoy (`e644c85`): **tsc 0 · 2359
      tests + 5 skip · lint 0 errores**. `master` verde, ningun cierre falso.
      **Un cierre SI envejecio en 24 h, y no era falso: era una cita.** P3 cita
      `addon.inmobiliaria` en `ADDON_IDS`, y hoy esa clave **no existe**: el commit `f27bc9d`
      (PR #64) la renombro a `addon.captador` porque estaba gateada por un rubro que Onia no
      vende. Verificado que el rename no dejo hueco: la pantalla de capacidades tiene su
      descripcion (`app/(dashboard)/admin/organizations/[id]/capacidades/CapacidadesOrg.tsx:31`), no quedan referencias sueltas, y — lo que de verdad
      importaba, porque `isFeatureKey` es fail-closed y una fila vieja dejaria de ser feature en
      silencio — **la base de PRODUCCION no tiene ni una fila `addon.inmobiliaria`**
      (contenedor `supabase-db` del VPS: solo `addon.whatsapp` x2 y `module.agents` x3). Nadie
      perdio un add-on. El `[x]` de P3 queda: su conclusion sigue siendo cierta, envejecio la cita.
      **El item que se arreglo:** `lib/pricing.ts` vendia el chatbot de Bs 390/mes como que
      *"contesta, califica, **agenda** y hace seguimiento"*, y el motor dice lo contrario en una
      linea (`hermes-content/deploy/vps-ops/bot/recepcionista.mjs:153` — *"El bot no agenda ni
      vende solo"*): un pedido de cita se **escala a un humano**. Verificado hoy en los dos
      lados antes de tocar nada.
      **Y el hallazgo que justifica la vuelta: la frase falsa estaba duplicada.** Vivia en
      `lib/pricing.ts` (3 strings) **y hardcodeada** en
      `app/(dashboard)/settings/addon-chatbot/AddonChatbotClient.tsx:275`, que es la pantalla que
      el cliente lee **antes de pagar**. Arreglar la "fuente unica" y parar ahi dejaba la mentira
      viva en el unico lugar donde se mira — el mismo error de fondo que este archivo ya tiene
      anotado cuatro veces con otra cara: **arreglar el sistema equivocado**. La pantalla ahora
      deriva el tagline de la lista `tiers` de `WHATSAPP_ADDON`, asi que no hay segunda copia que corregir.
      **Guarda,** en `lib/pricing-honestidad.test.ts` (el archivo que ya ata la copia de venta al
      codigo que la sostiene, en vez de crear uno nuevo al lado): ninguna linea de venta del
      chatbot puede decir `agend*`, y la pantalla no puede volver a escribirla a mano. **Vista en
      ROJO por el motivo correcto en los dos casos** antes de traerla. La agenda publica queda
      intacta — esa SI reserva sola y es otro producto de la misma lista (`key: "agenda"`), por
      eso el guard mira solo la copia del chatbot y no la palabra en todo el archivo.
      Gates: **tsc 0 · 2362 tests + 5 skip · lint 0 errores**. Commit `f47d615`, **ya en
      `origin/master`**.
      ⚠️ **No lo mire renderizado y digo por que:** la pantalla es del dashboard (pide sesion) y
      el cambio es un literal reemplazado por `{tierChatbot?.tagline}` dentro del mismo `<li>` —
      `tsc` prueba el tipo y el guard prueba el texto. No hay markup nuevo que se pueda romper.
      ⚠️ **Y falta el deploy para que sea cierto donde el cliente mira:** el contenedor
      `onia-platform` del VPS sirve el bundle anterior, asi que **en produccion la frase falsa
      sigue viva hasta el proximo deploy**, y eso lo decide Sergio.

- [x] **La frase falsa del chatbot tenia una TERCERA copia — en el catalogo de venta, que es
      la fuente unica de "que se vende".** Vuelta del 2026-08-31 (segunda del dia). "Ahora" no
      tenia un solo item desbloqueado (F2, F5, los 4 numeros de WhatsApp y el `DELETE` de pagos
      siguen esperando **una linea de Sergio**), asi que se audito el cierre mas reciente — el de
      `f47d615`, que corrigio la copia del chatbot en `lib/pricing.ts` y en la pantalla del add-on.
      **El cierre aguanta**: `f47d615` es ancestro de `origin/master`, el arbol de `onia-platform`
      esta limpio y en `0 0`, y el barrido del repo del producto no encuentra **ninguna** otra
      linea de venta que diga que el bot agenda.
      **Pero el defecto que ese item habia diagnosticado —la frase duplicada— tenia una copia mas,
      y en el peor archivo posible:** `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md:126` vendia el
      chatbot como *"asistente 24/7 que contesta, califica, **agenda** y hace seguimiento"*. CLAUDE.md
      declara ese archivo la fuente unica de que se vende: toda propuesta, one-pager y cotizacion
      LEEN de ahi. Arreglar el codigo y dejar la mentira en la fuente de la que copia el material
      comercial es, otra vez, **arreglar el sistema equivocado**.
      **Verificado contra el motor antes de tocar nada**, no contra un doc:
      `hermes-content/deploy/vps-ops/bot/recepcionista.mjs:232` — *"Pedido / cita / compra: se toma y se ESCALA.
      El bot no agenda ni vende solo"*. La fila ahora dice *"contesta, califica, **deriva a un
      humano** y hace seguimiento"*, la misma redaccion que el tagline ya corregido de
      `lib/pricing.ts:69`, para que no queden dos verdades distintas.
      **Y de paso, la misma fila de add-ons prescribia una clave MUERTA:** el catalogo mandaba
      gatear `/inbox` con `requiresFeature: "addon.chatbot"`, y `addon.chatbot` **no la lee nadie**
      (verificado hoy: aparece solo en tests; la viva es `addon.whatsapp`). Quien tomara esa
      recomendacion literal habria escrito un gate que no gatea nada. Corregida con el estado real
      —medio chatbot YA esta gateado desde el 2026-08-18— y remitida a **F2**, que es de Sergio.
      **Guarda,** `scripts/venta-honestidad.test.mjs` (`npm run test:venta-honestidad`): ata la copia
      de venta al motor. Dos tests — el motor tiene que seguir diciendo que no agenda, y ninguna
      linea del catalogo que hable del chatbot puede decir `agend*`. **Vista en ROJO por el motivo
      correcto** antes del arreglo: fallo con exactamente una linea, la fila del chatbot. La agenda
      publica (`key: "agenda"`) SI reserva sola y es otro producto, por eso el filtro mira solo las
      lineas del chatbot y no la palabra suelta.
      **Lo que NO se toco, a proposito:** las propuestas ya entregadas — queda anotado abajo en
      "Despues" porque tiene una trampa que no es de copy.

### Del canario visual — corrida del 2026-09-01 (abiertas y MIRADAS, no un 200)

- [x] **La maqueta de "Elegís tu rubro" se ve CORTADA en la home, en desktop 1440 — ARREGLADO
      EN CÓDIGO el 2026-09-02 (commit `c98543e2`, de Sergio), falta el deploy.** El defecto
      original (medido el 2026-09-01) era que el corte venía HORNEADO en las cinco imágenes
      webp de rubros — no lo arreglaba ni un CSS ni un recorte, y cerrarlo de verdad necesitaba
      recapturar esas cinco pantallas contra el dashboard real corriendo con datos de demo, algo
      que este carril no podía hacer sin cruzar al repo `onia-platform` (otro carril).
      **Ya no aplica: dejó de existir el archivo que tenía el corte.** Verificado hoy en el
      worktree, tras el rebase que trajo el commit de Sergio: la carpeta pública de rubros con
      esas cinco imágenes fue borrada, y
      `web-factory/apps/onia-platform/src/app/(sitio)/switcher.tsx` ahora dibuja cada rubro con
      divs (componente `Shape` en modo `panel`) en vez de servir una captura. Gates verdes en
      este worktree: `tsc --noEmit` 0 · `next build` 32/32 páginas.
      **Lo que falta, y no es zona de este carril:** el deploy. Medido contra el contenedor que
      sirve el dominio: `curl https://onia.com.bo/` todavía trae esas cinco rutas de imagen —
      `onia-landing` sigue sirviendo el build viejo. Deploy es de Sergio.

- [x] **La CSP de producción bloqueaba el beacon de Cloudflare en TODA la plataforma — ARREGLADO
      EN CÓDIGO el 2026-09-02, `onia-platform` `efaffe8`, en `master`. Falta SÓLO el deploy, que
      decide Sergio.** Se agregó `https://static.cloudflareinsights.com` a `script-src` y
      `https://cloudflareinsights.com` a `connect-src` en `next.config.ts` — la opción que no
      apaga métrica: si Sergio no quiere Web Analytics, apagarlo en Cloudflare sigue siendo válido
      y no requiere código.
      Se extrajo `buildContentSecurityPolicy()` (antes la directiva vivía inline dentro de
      `headers()` y no había forma de testearla sin levantar Next). Test nuevo
      `__tests__/csp-cloudflare-beacon.test.ts`: falló en ROJO antes del cambio
      (`buildContentSecurityPolicy is not a function`) y pasa en VERDE después, verificando
      `script-src` y `connect-src` por separado.
      Gates verdes: `tsc --noEmit` 0 · `npm run lint` 0 errores (100 warnings preexistentes) ·
      `vitest run --no-file-parallelism` 203 archivos, 2.482 pasan + 5 skip.
      **Píxeles sin cambio** (es una cabecera HTTP, no hay captura que mirar). **Cómo se sabe que
      quedó hecho en producción:** después del deploy, abrir `app.onia.com.bo/login` y que la
      consola no traiga la violación de CSP.

- [x] **Nadie es dueño de `/` ni de `/empezar` — RESUELTO 2026-09-02: el carril `web-venta`
      (este) es el dueño declarado.** Su propio prompt de loop lo dice desde el 2026-09-02:
      "`onia.com.bo/` y `/empezar` no tenían dueño... Vos sos ese dueño", con zona exclusiva
      `web-factory/apps/onia-platform/**`. Actualizado en
      `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` §16.

### Del canario visual — segunda pasada del 2026-09-01

### Medido el 2026-09-01 — el sitio de venta no lo cubre ningún gate

- [x] 🟠 **Decir "`main` compila" no dice NADA sobre `onia.com.bo`: ningún gate corre `tsc`
      sobre las apps de `web-factory`.** El único typecheck cableado del repo mira **cero
      líneas de código de app**.
      **Evidencia, medida hoy y en tres lugares distintos:**
      - `web-factory/tsconfig.packages.json` es exactamente `{"extends": "./tsconfig.json",
        "include": ["packages/**/*.ts"]}` — ni un archivo de `web-factory/apps/`. Y es el único que se
        corre: en `web-factory/package.json` el solo script de tipos es
        `"typecheck:packages": "tsc --noEmit -p tsconfig.packages.json"`.
      - **Ninguna CI lo suple.** `$ git grep -nE "tsc|typecheck|pnpm.*(build|test)|npm run (build|test)" origin/main -- .github/workflows`
        devuelve **cero líneas**. Los 6 workflows de `.github/workflows` son deploy, higiene,
        auditoría, pulso y video-intake: **no hay un solo job que compile o testee nada**.
      - **Y esto no es teórico: la app sin gate es la que sirve la venta.** El contenedor
        `onia-landing` del VPS corre `next-server (v15.5.19)` sobre `/app/apps/onia-platform`
        — o sea `web-factory/apps/onia-platform/`, la app de `onia.com.bo` y `/empezar`.
        Medido por `docker exec`, no leído de un doc.
      **El estado app por app** (todas en `web-factory/apps/`): `dental-premium`,
      `dentalgest-landing`, `ferreteria-sur` y `onia-platform` **sí tienen** script `typecheck`
      (`tsc --noEmit`) en su `package.json` y **no lo llama nadie**; `site` **ni siquiera lo
      tiene** (su único script de calidad es `lint`). Son cinco líneas de trabajo, no un
      proyecto.
      **Cómo se sabe que quedó hecho:** correr `$ pnpm --filter <app> typecheck` para las cinco
      y que el resultado quede **cableado en el script raíz** que un carril corre antes de
      mergear — con la corrida de `onia-platform` verde pegada, porque es la que publica el
      sitio de venta. Si alguna sale roja hoy, ese error **ya está en producción**.
      **Sin bloqueo:** no toca producción, no gasta, no baja ninguna superficie.
      ⚠️ **Ojo de carril:** `web-factory/apps/onia-platform/` es la app que esta misma cola
      anota como huérfana cuatro ítems más arriba. El gate se puede cablear sin tocar su
      código — y justamente por eso conviene que exista antes de que alguien lo toque.

      ✅ **Cerrado el residuo más urgente el 2026-09-02, sin tocar la raíz de `web-factory`:**
      `web-factory/apps/onia-platform/package.json` ahora tiene `"prebuild": "tsc --noEmit"`. Verificado que
      es exactamente el comando que corre el deploy real
      (`scripts/deploy-onia-landing.sh:25`, `pnpm --filter onia-platform build`) — no un script
      paralelo que nadie llama: `pnpm run build` en ese filtro ejecuta el hook automáticamente
      (probado en vivo con `prebuild: echo`), y con un error de tipos inyectado a propósito
      (en el layout de la app, un `number` asignado a un `string`) el build **corta antes de
      `next build`** con `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL`. Revertido el error de prueba,
      gates limpios: `tsc --noEmit` 0 · `next build` 32/32 páginas.
      **Por qué no bastaba con que el `node_modules` faltara:** al arrancar esa vuelta
      `npm run typecheck` en `onia-platform` fallaba con `Cannot find module 'vitest'` — no era
      un bug de código, era que este worktree nunca corrió `pnpm install` (root `node_modules`
      no existía). Con el install hecho, tsc y build salen limpios; quedó anotado para que la
      próxima vuelta no lo reporte como regresión.

      ✅ **CERRADO el 2026-09-02 por el integrador: las cinco apps tienen el gate, y de paso
      apareció que el deploy del sitio de venta estaba ROTO.** Las cuatro que faltaban
      (`dental-premium`, `dentalgest-landing`, `ferreteria-sur`, `site`) llevan ahora
      `"prebuild": "tsc --noEmit"`, y `site` estrena además el `typecheck` que no tenía.
      **Se corrió el typecheck de las cuatro ANTES de cablear el gate**, que es el orden que
      importa: si alguna hubiera salido roja, cablearla habría roto su deploy en vez de
      protegerlo. Las cuatro salieron en **exit 0** — o sea que no había ningún error de tipos
      viviendo en producción, y el gate entra sin deuda que pagar.
      **`site` NO era una app de adorno:** `scripts/deploy-onia-center.sh:32` la publica con
      `pnpm --filter site build`, y el `build` raíz de `web-factory` es esa misma app. Era la
      única de las cinco sin **ningún** chequeo de tipos, y la que menos podía darse el lujo.
      **El gate se probó cortando, no suponiendo:** con una sonda temporal (un `number` asignado
      a un `string`) `pnpm --filter site build` murió en `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL` con
      `error TS2322` y **`next build` nunca llegó a correr**. Sonda borrada; build limpio
      después: exit 0. Las otras tres, `prebuild` en exit 0.
      **🔴 El hallazgo que no estaba en el ítem, y vale más que el ítem:**
      `web-factory/pnpm-lock.yaml` estaba **desincronizado con
      `web-factory/apps/onia-platform/package.json`**, y los DOS scripts de deploy instalan con
      `pnpm install --frozen-lockfile` (`scripts/deploy-onia-landing.sh:24`,
      `scripts/deploy-onia-center.sh:31`) — que es un modo que **falla**
      cuando el lockfile no coincide. Reproducido con el lockfile de `main`:
      `ERR_PNPM_OUTDATED_LOCKFILE … 1 dependencies were added: vitest@^4.1.8`, exit 1.
      **O sea: el deploy de `onia.com.bo` moría en la línea 24, antes de compilar nada.** Lo
      dejó así `ae8de266` (*"el gate de tipos del sitio de venta no corría en el VPS"*), que
      agregó `vitest` al `package.json` y no commiteó el lockfile. Sincronizado (3 líneas) y
      verificado: `pnpm install --frozen-lockfile` ahora sale **exit 0**, *"Lockfile is up to
      date"*.
      ⚠️ **Se tocó `web-factory/pnpm-lock.yaml`, que es archivo raíz de `web-factory`** — la
      regla pide avisar, y se avisó por Telegram. Es una sincronización mecánica (sólo agrega la
      entrada de `vitest` que ya estaba declarada en el `package.json`), no un cambio de
      versiones. Los `tsconfig.tsbuildinfo` que el typecheck ensució se restauraron: no entraron
      al commit.
      **Lo único que queda de este ítem, y ya no es un agujero:** cablear los cinco typecheck en
      un script raíz de `web-factory`. Con `prebuild` en las cinco apps el agujero está tapado
      donde importa —el camino del deploy—, así que el script raíz pasa a ser comodidad, no
      protección. Sigue sin dueño porque toca los 4 archivos raíz.

### Del canario visual — corrida del 2026-09-01 22:41 UTC (tercera pasada)

- [x] **`onia.com.bo/` y `/empezar` cambiaron de diseño y de copy ENTERO desde la baseline de
      hace 3 h, y el CTA de `/empezar` ahora manda a `app.onia.com.bo/register` — RESUELTO
      2026-09-02: es un cambio legítimo, no una regresión, y ya no hay contradicción en el
      sitio.** Gate 1 (mirar el código y la producción de HOY, no la duda de ayer): el propio
      worktree ya tiene la respuesta escrita en
      `web-factory/apps/onia-platform/src/app/(sitio)/alta.ts` (commit `37ab9e92`, del
      2026-09-01): `ONIA_ALTA_AUTOMATICA=abierta` se verificó en vivo en el contenedor
      `onia-platform` ese mismo día, así que `ALTA_ABIERTA = true` y **todo** el sitio debe
      decir "Creá tu cuenta", no "Pedí tu acceso" — la duda que este ítem dejaba abierta (¿es
      un redeploy legítimo o volvió el bug de agosto con el registro roto?) ya estaba
      contestada en el propio código, sólo faltaba publicarla y reverificar en vivo.
      **Verificado HOY contra el contenedor que sirve el dominio** (`onia-landing`, no Vercel,
      no `main`):
      - `curl https://onia.com.bo/` y `/empezar`: **cero** apariciones de "Pedí tu acceso" en
        ninguna de las dos páginas; "Creá tu cuenta" aparece 15 veces en `/empezar`, consistente
        en cabecera, footer y banda final — ya no quedan las dos frases mezcladas.
      - `https://app.onia.com.bo/register` responde `200` y arma el wizard de 2 pasos descrito.
        No se envió el formulario (no se crea cuenta de prueba en producción).
      - **Mirado renderizado**, no sólo `grep`: `scripts/canario_visual.mjs home empezar` sin
        disparo mecánico, y capturas propias en viewport 1440×900 de la cabecera de las dos
        páginas — texto y botones alineados, sin overlap, sin corte.
      **Por qué no era un fantasma barato de cerrar sin mirar:** el ítem original tenía razón en
      dudar — la promesa que cambia SÍ hay que barrerla en toda la superficie (regla de
      `CLAUDE.md`), y hasta ayer nadie había confirmado que la barrida terminó. Confirmado hoy:
      terminó, cero superficie con el vocabulario viejo.
      **Lo que sigue sin dueño real** (ver radar §16): la ambigüedad de fondo — que
      `app.onia.com.bo/register` es del repo `onia-platform`, otro carril — sigue viva para la
      PRÓXIMA vez que ese flag cambie. Ese archivo (`alta.ts`) ya deja el runbook de los dos
      pasos escrito para cuando pase.
      **Lo que se verificó en su momento, mirando y sin enviar el formulario (no se creó
      ninguna cuenta):**
      - Home: título pasó de *"Onia · Tu negocio no pierde citas ni cobros | Bolivia"* a
        *"Onia · Cerrás vos, el negocio no | Software de gestión Bolivia"*, y el CTA de *"Pedí tu
        acceso"* pasó a *"Creá tu cuenta"* en cabecera, footer y banda final. Todo el copy central
        cambió (de "Onia agenda las citas..." a "Un negocio abre 9 horas / Cerrás vos. El negocio
        no."). **Es un redeploy real, no una regresión de datos**: HTML válido, sin errores de
        consola nuevos, `msMirable` bajó de 933 a 495 ms.
      - `/empezar`: 4 botones "Creá tu cuenta". El de la barra de navegación apunta a `/empezar`
        (self, correcto, ya estás ahí). **Los otros dos** (el de la sección hero y el de la banda
        verde final) apuntan a `https://app.onia.com.bo/register` (`href` verificado en el DOM,
        no un grep de texto).
      - `app.onia.com.bo/register` responde 200. Paso 1 es un selector de rubro (los 5 packs +
        "otro rubro, escribinos"). Clic en "Empezar aquí" (Clínica dental) llega a un Paso 2 con
        `<form>` real: nombre, correo, contraseña, nombre del negocio, "¿cómo nos conociste?",
        checkbox de novedades y botón **"Crear mi cuenta — 14 días gratis"**. **No hice submit**:
        crear una cuenta de prueba es una escritura en producción y no es lo que este loop hace.
      **Evidencia:**
      `hermes-content/docs/historial/canario-visual/2026-09-01-home-rediseno.png`
      (home hoy 1.585 KB · 495 ms; baseline 2.310 KB · 933 ms) ·
      `hermes-content/docs/historial/canario-visual/2026-09-01-empezar-rediseno.png` (empezar hoy 2.168 KB · 573 ms; baseline 2.497 KB · 711 ms) ·
      `hermes-content/docs/historial/canario-visual/2026-09-01-register-paso1.png` y `hermes-content/docs/historial/canario-visual/2026-09-01-register-paso2.png`.
      **La baseline de `home` y `empezar` NO se tocó** — sigue siendo la de la mañana, a propósito:
      la regla es que se actualiza recién cuando la diferencia ya se explicó o el ítem que la
      reportó cierra. Si esto es un deploy legítimo y esperado, el dueño que lo cierre actualiza
      la baseline con estas capturas.
      **Efecto colateral, ya visible en el monitor propio del VPS:** `/root/bin/onia-mirar-cliente.sh`
      viene avisando `ROTO` cada 15 min desde hace horas por texto ausente ("Pedí tu acceso" en
      `/empezar`, "Tu negocio no pierde" en `web`) — su lista de textos esperados quedó
      desactualizada por este mismo cambio en su momento — a reverificar por quien tenga
      `/root/bin/onia-mirar-cliente.sh`, no es zona de este carril.

### Encontrado el 2026-09-02, dueño del carril — sin cerrar, necesita la vista de Sergio

- [x] **`onia.com.bo/` y `/empezar` tienen 6 capturas LITERALES del sistema — ARREGLADO EN
      CÓDIGO el 2026-09-02 (commits `bba1c76e` y `c98543e2`, de Sergio mismo — la vista que este
      ítem esperaba), falta el deploy.** El hallazgo original (2026-09-02, mirando el HTML
      servido): 6 screenshots reales del panel de Onia en las dos pantallas — 2 en home
      (agentes, editor de WhatsApp) y 1 en `/empezar` (dashboard con montos reales), más las 5
      de la banda de rubros. Violaba la regla de Sergio del 2026-09-01 ("cero capturas
      literales, coloca cosas referenciales"), y no se reemplazaba sin que él viera antes la
      pieza terminada — mismo precedente que la landing v2 revertida en producción.
      **Verificado hoy en el worktree, tras el rebase que trajo el commit de Sergio:** las 6
      imágenes están borradas del repo, `web-factory/apps/onia-platform/src/app/(sitio)/ui.tsx`
      ya no acepta una imagen como fuente para el componente que las mostraba (sólo dibuja con
      divs) y `web-factory/apps/onia-platform/src/app/(sitio)/forma.test.ts` falla si vuelve a
      aparecer una captura. Gates verdes en este worktree: `tsc --noEmit` 0 · `next build`
      32/32 páginas.
      **Lo que falta, y no es zona de este carril:** el deploy — medido contra `onia-landing`,
      `curl https://onia.com.bo/` y `/empezar` siguen sirviendo las 6 capturas viejas hoy.

### Encontrado el 2026-09-02, corriendo el canario — no es zona de este carril

- [ ] 🟡 **El widget de chat (Chatwoot) responde 429 en `home` y `/empezar` — confirmado en vivo,
      dueño real es el carril chatbot/infra, no `web-factory/apps/onia-platform`.**
      `node scripts/canario_visual.mjs home empezar` salió con un error de consola NUEVO en las
      dos: `Failed to load resource: ...429`. Rastreado con un script propio a
      `https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/widget?website_token=...` — confirmado
      también con `curl` directo (`HTTP/2 429`, body `Retry later`).
      **Causa medida, no supuesta:** `docker logs onia-chatbot_chatwoot...` muestra
      `[Rack::Attack][Blocked]` sobre `path: "/widget"`, **262 bloqueos en las últimas 24 h**,
      **todos** desde dos direcciones IP: la del VPS mismo (61 bloqueos) y la salida de los
      loops/sandboxes (189 bloqueos). **Cero IPs distintas bloqueadas en 24 h** — no hay evidencia
      de que un visitante real haya pegado contra el límite hoy: el propio ecosistema de
      monitoreo (`onia-mirar-cliente` cada 15 min, `canario-visual` 4×/día, este loop cada 2 h,
      más el `chatbot-cola`) es quien agota la cuota de Rack::Attack contra sí mismo.
      **No lo arreglo yo:** el límite vive en la config de Chatwoot (contenedor
      `onia-chatbot_chatwoot`, servicio Docker en el VPS), no en `web-factory/apps/onia-platform`
      — cruzar a tocarlo es cruzar de carril/servicio, prohibido por `CLAUDE.md`. El embed del
      widget en mi zona
      (`web-factory/apps/onia-platform/src/app/layout.tsx:87`) ya está bien: una sola carga por
      visita, sin reintentos.
      **Lo que hace falta, para quien tenga ese contenedor:** subir el umbral de
      `Rack::Attack` para `/widget` o dejar pasar sin límite las dos IPs de monitoreo propio (ver
      el log citado arriba) — hoy el efecto medible es ruido falso-positivo en cada corrida del
      canario, y el riesgo no medible es que un visitante real detrás de la misma IP compartida
      (NAT de oficina, VPN) sí lo sufra.
      **Cómo se sabe que quedó hecho:** `docker logs onia-chatbot_chatwoot... | grep Rack::Attack`
      sin bloqueos de las IPs de monitoreo, y una corrida del canario sin el 429 en
      `erroresConsola`.

### Del canario visual — corrida del 2026-09-02 04:41 UTC (diez pantallas, sin ítems nuevos)

- [ ] 🟢 **Pasada completa de las diez pantallas, mirando cada captura. No encontré defecto
      nuevo.** Detalle de lo que sí toqué:
      - **Cinco baselines nuevas creadas** (no existían): `precios`, `rubros`,
        `chatbot-landing`, `contacto`, `register`. Es el punto de partida, no una verificación.
      - **Tres baselines retomadas** (`login-plataforma`, `login-chat`, `panel-chatbot`): mismo
        contenido exacto (`visto.texto` idéntico, diffeado), sólo se actualizó peso/tiempo con
        el contador de peso ya corregido (`52e359c1`). **`home` y `empezar` quedaron SIN tocar
        a propósito**: siguen mostrando hoy el mismo rediseño que abrió el ítem de la pasada
        de ayer 22:41 UTC (título todavía *"Cerrás vos, el negocio no"*, no el de la baseline
        vieja) — ese ítem sigue abierto y sin dueño, así que pisar la baseline lo daría por
        cerrado sin que nadie decidió nada. Confirmo que sigue vigente, no lo duplico.
      - **`rubros` y el bloque verde final de `contacto` parecen vacíos en la captura full-page
        pero NO lo están**: son secciones de scroll-reveal/sticky (el listado de rubros
        Dental/Comercio/Importadora/Estética/Servicios, y el CTA final "¿Preferís probarlo
        solo?"). Lo confirmé haciendo scroll real por tramos y volviendo a capturar — el
        contenido aparece correcto. Es un artefacto del método de captura de página completa
        contra animaciones ligadas al scroll, no un bug del sitio. Lo anoto acá para que el
        próximo loop no lo vuelva a investigar desde cero.
      - Los íconos (`bolt`, `credit_card_off`, `smart_toy` en `login-plataforma`) siguen
        apareciendo como texto en `visto.texto` (extracción de DOM) pero se VEN como íconos
        reales en la captura — es la trampa que originó la regla de mirar, y hoy la pantalla
        está bien.
      - **Duda sin resolver, no reportada como ítem:** el endpoint del widget de chat del sitio
        (`onia-chatbot-chatwoot.hqdqgh.easypanel.host/widget`) devolvió 429 en varias de mis
        pasadas manuales de esta misma vuelta (incluida una corrida sola después de 150 s de
        espera). No lo escribo como ítem porque no lo puedo descartar como autoinducido: esta
        misma vuelta ya le pegó a ese endpoint muchas veces seguidas investigando otras cosas,
        y la corrida OFICIAL única (`node scripts/canario_visual.mjs`, la que se compara y
        basea) sólo lo vio en `contacto` — ninguna de las otras cinco pantallas de
        `onia.com.bo` en esa misma pasada. Si un loop futuro lo ve fresco, sin haber
        golpeado el sitio antes, ahí sí es un ítem.
      **Evidencia (capturas de hoy):**
      `hermes-content/references/canario-visual/precios/baseline.png` ·
      `hermes-content/references/canario-visual/rubros/baseline.png` ·
      `hermes-content/references/canario-visual/chatbot-landing/baseline.png` ·
      `hermes-content/references/canario-visual/contacto/baseline.png` ·
      `hermes-content/references/canario-visual/register/baseline.png` ·
      `hermes-content/references/canario-visual/login-plataforma/baseline.png` ·
      `hermes-content/references/canario-visual/login-chat/baseline.png` ·
      `hermes-content/references/canario-visual/panel-chatbot/baseline.png`.
      Pesos de hoy: home 2.859 KB/325 ms · precios 2.108 KB/174 ms · empezar 2.253 KB/141 ms ·
      rubros 2.588 KB/216 ms · chatbot-landing 2.232 KB/134 ms · contacto 322 KB/185 ms ·
      register 704 KB/100 ms · login-plataforma 699 KB/135 ms · login-chat 3.501 KB/1.365 ms ·
      panel-chatbot 699 KB/140 ms (redirige a `/login`, sin sesión — "no medida", no "OK").

## Rechazado hoy con motivo (2026-08-30) — no volver a abrirlo

- **F1 · Sumar `/patients` al nav de servicios profesionales.** Lo intenté, escribí el test,
  lo vi en rojo, hice el cambio — y **dos guardas del repo lo cazaron como regresión.**
  El bug YA estaba arreglado el 2026-08-30, y **a propósito de otra forma**: la ficha
  (`patients/[id]`, `medical-alerts`, `records`) es de los packs **clínicos**, así que abrir
  el segmento le daba la ficha clínica a un estudio contable con sus APIs en 403. El arreglo
  real es **alta inline del cliente en el modal de nueva cita** contra `/api/patients`
  (`app/(dashboard)/appointments/page.tsx:129-143`). Revertido, árbol limpio.
  **Lección:** hice grep del nav —que es estructura— y concluí sobre la capacidad. Es el
  mismo error de "contar menciones de archivo en vez de capacidad" que ya me marcaron.
- **F2 · Gatear `addon.inventory_advanced`.** Sergio ya lo decidió el 2026-08-27: *"no se
  cobra"*. El add-on se retiró de la oferta y las funciones quedaron gratis para todos. Que
  la clave no la lea nadie es ahora **lo correcto**. Está escrito en `lib/pricing.ts:120`.
- **F2 · Gatear `addon.web`.** La web del cliente la entrega **web-factory**, otro repo. No
  tiene ni debería tener pantalla en la plataforma. La clave es decorativa.
- **F4 · Encender el agente `captador`.** Está apagado **por diseño**, no por olvido.
  `agents-runtime.ts:1152` lo dice: *"Sin esto, cada clínica dental y cada veterinaria
  estrenaría una fila 'captador inmobiliario'"*. Es un add-on con `requiresFeature`, y su
  copy es **inmobiliario** ("nunca inventa datos del inmueble") — un rubro que ni siquiera
  se ofrece. `kind_not_enabled` en 14 días de log = nadie lo compró. Funciona como debe.

### Arrastre de la cola anterior

- [x] **Paso 3 corrido: auditados los 11 shas que esta cola declara cerrados. 10 ciertos, 1 mal
      citado — y `master` está verde.** Hecho el 2026-08-31, con la cola sin un solo ítem
      desbloqueado en "Ahora" (F2, F5, los 4 WhatsApp y el `DELETE` de pagos esperan **una línea
      de Sergio**, no código). **Cero líneas de producto tocadas: no había nada roto.**
      - **Método, que es lo que se hereda:** `git fetch` y después
        `git merge-base --is-ancestor <sha> origin/master` — la lección que esta misma cola
        escribió el 2026-08-31 sobre `git branch --contains`, aplicada por primera vez a todos
        los cierres a la vez en lugar de a uno.
      - **10 de 11 son ancestros reales de `origin/master`:** `0711ff6`, `34e3d29`, `2849be0`,
        `1fc4354`, `14abb9a`, `88c1d56`, `753718f`, `4077f2c`, `3e43c93`, `4dce75e`.
      - **El que falló fue F3 (`6d8b6b7`) y NO era un cierre falso: era una cita falsa.** El sha
        no está en `origin/master` porque el PR entró **squasheado** como `ab9e0de` (#57).
        Corregido arriba. **La diferencia importa:** un sha ausente parece trabajo perdido y
        dispara que alguien lo rehaga — que es exactamente el costo que el Gate 1 existe para
        evitar. **Regla nueva: se cita el sha del MERGE, no el de la rama.**
      - **Las citas `archivo:línea` de los ítems cerrados se resolvieron una por una** contra el
        árbol de hoy (`types.ts:73`, `plan-limits.ts:396`, `clinics/route.ts:99`, `pricing.ts:64`,
        `webhooks/bcp/route.ts:55`, `agents-runtime.ts:1157`, `navigation.ts:45`,
        `portal/requerimientos/route.ts:21`): **ninguna derivó**.
      - **Gates sobre `origin/master` (= `0711ff6`, la punta):** `tsc --noEmit` **0 errores** ·
        **2342 pasan + 5 skip (2347) en 190 archivos**. El árbol quedó limpio — esta vez `vitest`
        **no** reescribió los `.snap` con CRLF, la trampa anotada el 2026-08-30.
      - **El tercer gate estaba ROTO, y la auditoría lo destapó de casualidad: ARREGLADO en la
        misma vuelta.** `eslint` sobre la raíz **pasó de 20 minutos** y reventó **dos topes de
        10 min seguidos**; terminó en segundo plano con **exit 0**, y su salida delató la causa:
        estaba linteando `.claude/worktrees/*/.next/...`. **No era el tamaño del repo.** El
        `".next/**"` de `eslint.config.mjs` ignora sólo el `.next` de la **raíz**, y este repo
        tiene **~30 git worktrees vivos** bajo `.claude/worktrees/`, cada uno con una copia
        entera del código de **otra rama** y su propio `.next`. El gate revisaba 30 árboles
        ajenos. **Con el arreglo: 39 segundos contra el mismo árbol. ~30x.**
        **Por qué era grave siendo sólo lentitud:** el síntoma es **silencioso** — eslint sale
        en verde igual, sólo que tarda tanto que la sesión lo saltea. Es exactamente lo que me
        pasó a mí en esta vuelta, y el paso 4 de esta cola exige los tres gates porque **ya se
        rompió CI dos veces** por correr sólo los dos primeros. Un gate que nadie puede correr
        no es un gate. **CI nunca lo sufrió**: allá no hay worktrees. Era un defecto **sólo
        local**, que es la peor clase — el que hace que el gate se abandone justo donde debería
        atajar antes de CI.
        Va en el script `lint` de `package.json` (el que invoca `npm run ci`) con su guarda en
        `__tests__/eslint-no-lintea-worktrees.test.ts`, vista en ROJO antes.
        Gates del arreglo: tsc 0 · lint **0 errores** (101 warnings preexistentes, todos en
        `.agents/skills`) · **2346 pasan + 5 skip (191 archivos)**. Commit `149e2a9`, **ya en
        `origin/master`** por fast-forward.
        📌 **Para Sergio, y NO bloquea nada:** el arreglo de raíz iba en `globalIgnores` de
        `eslint.config.mjs`, pero el hook `config-protection` de `~/.claude/scripts/hooks/`
        **prohíbe editar ese archivo** (existe para que nadie afloje reglas de lint, y hace
        bien). Se arregló en la capa que sí se puede tocar y **el resultado es el mismo**;
        mover la ignore al config es cosmética. Si algún día se quiere, hay que habilitar el
        hook a mano.
        **Verificado por segunda vez, en paralelo y sin saberlo, el 2026-08-31 — y lo que
        agrega la revisión independiente son tres datos que el arreglo no tenía:**
        (1) **No es sólo lentitud: el gate MIENTE.** Con **un solo** worktree anidado el
        conteo pasa de **101 a 202 warnings** (A/B controlado en un árbol aislado, 41,0 s vs
        52,1 s) — o sea le atribuye a esta rama los warnings de las otras. Con 30, el número
        que reporta no es de este árbol.
        (2) **El comando pelado no sólo tarda: se cae.** `npx eslint .` sobre la raíz abortó
        con `ENOENT ... scandir '.claude/worktrees/lint-worktrees'` porque **otra sesión creó
        y borró un worktree mientras eslint lo recorría**. Es no determinista: a veces sale
        verde en 20 min, a veces revienta. Una razón más para que el paso 4 mande a
        `npm run lint`.
        (3) **`tsc` NO tiene este problema — comprobado, para que nadie lo "arregle".**
        `tsconfig.json` no excluye `.claude`, así que parece vulnerable; no lo es:
        `npx tsc -p tsconfig.json --listFilesOnly | grep .claude/worktrees` da **0**, porque
        TypeScript salta los directorios que empiezan con punto en sus patrones wildcard.
        Tocar el `exclude` del tsconfig sería una vuelta perdida.
        ⚠️ **Y la lección de proceso, que costó una vuelta entera:** **dos sesiones tomaron
        este mismo ítem a la vez**, y la segunda escribió un arreglo equivalente en
        `eslint.config.mjs` que hubo que **tirar a la basura** al descubrir, recién al mergear,
        que `master` ya lo traía. El Gate 1 pregunta *"¿ya está hecho?"* contra el repo del
        **inicio** de la vuelta; no protege de lo que se hace **durante**. **Regla nueva:
        `git fetch` y mirar la punta de `origin/master` ANTES de escribir la primera línea, no
        al mergear** — y si el worktree propio recibió commits ajenos, es que hay otra sesión
        en el mismo carril: parar y avisar.
      - **Lo que la auditoría NO cambió, a propósito:** el punto 1 de
        `ONIA_DEFINICION_DE_TERMINADO.md` ("la bandeja queda vacía") sigue 🔴 aunque su código ya
        esté en master (`88c1d56`, carril chatbot). Su LISTO no es "el commit existe", es *"un
        mensaje aparece en su bandeja, **mirado con captura**"*, y eso pide desplegar al VPS —
        que está en la lista de "nunca" de este loop. **Marcarlo verde por el commit sería
        reportar como hecho algo que nadie miró.**

- [x] **Paso 3 otra vez, y esta vez el defecto NO estaba en los `[x]` sino en la lista de
      bloqueos: 6 de 10 entradas de "Bloqueado — necesita a Sergio" ya no eran bloqueos.**
      Hecho el 2026-08-31 con la cola sin un solo ítem desbloqueado en "Ahora" (F2, F5, los 4
      números de WhatsApp y el `DELETE` de pagos esperan **una línea de Sergio**, no código).
      **Cero líneas de producto tocadas: no había nada roto en el código.**
      **Por qué esta lista importa más que la de cerrados:** los `[x]` los audita alguien de vez
      en cuando; la lista de bloqueos es la que una sesión lee para decidir **qué preguntarle a
      Sergio**. Una entrada vencida ahí no es desprolijidad — **fabrica trabajo**: hace que
      alguien le pida una decisión sobre algo ya hecho. Y el lead bueno se quema una sola vez.
      - **El hallazgo grande: `dentalgest.app` ya no sirve nada.** La entrada más alarmante de la
        lista decía que el MISMO `onia-platform` seguía publicado en Vercel contra el Supabase de
        la nube. Medido hoy, `/` y `/login` dan **404 con `X-Vercel-Error: DEPLOYMENT_NOT_FOUND`**:
        Vercel conserva el dominio, pero **no hay deployment detrás**. No existe la segunda copia
        expuesta. Queda sólo decidir qué se hace con el dominio, que es cosmético.
        **La lección: "el dominio resuelve" y "hay una app viva ahí" no son lo mismo**, y la
        entrada las mezclaba en una sola frase. El propio código de error de Vercel es lo que
        separa una cosa de la otra — un 404 de la app diría lo contrario.
      - **Otras cinco bajas, cada una con su medición y no con un renglón leído:** los 2 crons del
        VPS (crontab de **36 líneas**, ambos presentes, scripts `700` — cerrado como **D1**);
        `arthur`/`seller_001` (**D2**, y `center.onia.com.bo` responde **404**); el rate limit de
        Vercel (su propia entrada decía "hasta el 2026-08-30"); el rename del schema de producción
        (figuraba **como bloqueo y como rechazo a la vez**); y GA4 y la UI del dashboard, que ya
        estaban desmentidos el 2026-08-30 y nadie había sacado de la lista.
      - **Lo que la auditoría CONFIRMÓ, para que nadie lo rehaga:** la consolidación de
        `handoff/` (existe la singular, no la plural, y `origin/main` la cita bien en sus dos
        lugares — el plural sobrevive sólo en la rama `claude/ads-creatividades-publicos`, otro
        carril); y el test de carrusel, que corre verde (`node --test
        scripts/carousel_render.test.js`, 1 pasa / 0 falla) con `FORMATS.square` tras el renombre.
      - **Deriva menor anotada, no es un cierre falso:** `master` local de `onia-platform` quedó
        `0 1` contra `origin/master` — le falta `149e2a9`, el arreglo del gate de lint que se
        pusheó **después** de aquella nota. El cierre "quedó `0 0`" era cierto cuando se escribió.
      - **Regla que se lleva la vuelta: la lista de bloqueos se reverifica igual que los cerrados.**
        Un bloqueo no caduca solo, pero el mundo sí se mueve — dos de estos seis los desbloqueó
        esta misma cola en una vuelta anterior y nadie volvió a tachar la copia.

- [x] **`ONIA_PRECIOS_COMPETENCIA_Y_DECISION.md` corregido en los 4 lugares** donde decía que
      Emizor no publica precio — uno de ellos lo llamaba *"el dato que más falta en todo el
      relevamiento"*. Verificado en vivo el 2026-08-30 contra dos capturas de archive.org
      (29-nov-2022 y 27-abr-2025, **idénticas**): PYME USD 49 · EMPRESA USD 99 · CORPORATIVO
      USD 299 = **Bs 580 / 1.171 / 3.537** a 11,83. Nuestros números se leyeron de
      `subscription-plans.ts` (320/750/1.500/2.900), no de un doc.
      **Tres cosas que la nota de la cola no tenía y sí cambian el pitch:**
      (1) los tramos de Emizor son **por facturación anual del cliente**, no por usuarios;
      (2) el plan PYME **sólo se vende semestral** — USD 294 ≈ **Bs 3.478 por adelantado**
      contra Bs 320/mes, y ésa es la barrera real para el negocio chico, no los Bs 260 de
      diferencia mensual; (3) Emizor da facturas, sucursales **y usuarios ilimitados** sin
      costo de alta, así que contra ellos **no se compite por el precio de la facturación**,
      se compite por todo lo demás que viene en el mismo plan.
      **Queda abierto (menor):** `/precios-2` da 404 en vivo y la última captura es de
      abr-2025 — es el mejor dato disponible, no el precio de hoy confirmado. Se cierra con
      una cotización por su formulario. **Lección anotada en el doc:** un 404 en `/precios`
      no prueba que no publiquen precio, prueba que esa ruta no responde.
- [x] **Organizaciones de prueba limpiadas en la base LOCAL — y el ítem escondía una trampa.**
      Hecho el 2026-08-30: eran **10**, no 9. Se borraron **8** con un solo
      `DELETE FROM organizations` (los 42 FK que apuntan a `organizations` son `ON DELETE
      CASCADE`, verificado en `pg_constraint`), y con ellas sus 8 `profiles` y sus 8
      `auth.users`. Quedan **2 a propósito**, porque son la evidencia que esta cola cita en su
      propio "Estado": `fiscal-local` (la única factura, la del circuito fiscal con CUF/QR/RCV)
      y `ferreteria-circuito-completo-exu53` (el único `subscription_payment`, los **Bs 320**).
      Borrarlas dejaba la cola afirmando un resultado sin nada que lo reproduzca.
      Backup previo del schema `public` en el scratchpad de la sesión (218 KB).

      **La trampa, y por qué importa más que la limpieza:** el ítem decía *"sólo local —
      producción no se toca"*, pero **la base local NO es la que configura `.env.local`.**
      - `.env.local` → `postgresql://…@127.0.0.1:54329/postgres?schema=dentalgest`. Ese 54329
        **no es una base local**: lo escucha un `ssh.exe` (PID 17716) con
        `-L 54329:127.0.0.1:54329 root@187.77.16.63`. Es un **túnel al VPS**, y del otro lado
        está `supabase-db`, que efectivamente **corre en el puerto 54329** (`show port`) y
        responde al alias de red `db` — el mismo `DATABASE_URL` que tiene adentro el contenedor
        `onia-platform` **en producción**.
      - O sea: una sesión que hubiera corrido "la limpieza local" cargando `.env.local`
        **borraba producción**. Hoy no lo hizo por accidente: el túnel está muerto (en el VPS
        el 54329 no está publicado al host, sólo 54321 y 54322), así que la conexión da
        `ECONNRESET`. La próxima vez que alguien reviva el túnel, no falla.
      - **La base local de verdad** es el stack `fiscal-mock` de Supabase CLI:
        `supabase_db_fiscal-mock`, puerto **55322**, tablas en `public`.
      - Producción, leída sin tocar nada, tiene **3** organizaciones: `zz-qa-ferreteria-tornillo`,
        `zz-qa-clinica-chatbot` y `onia-interna`. **Ninguna** se llama "Prueba". El ítem nunca
        habló de producción, pero su config sí.
      **Dos errores míos, anotados porque los dos son de método:** busqué la tabla como
      `"Organization"` (PascalCase, el nombre del modelo Prisma) y concluí "no existe base
      local" — en la base se llama `organizations`, y el `@@map` no se ve en el nombre del
      modelo. Y corrí el `DELETE` con `docker exec` **sin `-i`**: el heredoc nunca entró, psql
      no recibió nada, y salió sin una sola línea de output. **Un comando que no imprime nada
      no es un comando que funcionó** — se vio sólo porque después conté las filas.
- [x] **Los dos agujeros de `chore/sacar-dentalgest` — y debajo había uno peor, vivo en
      producción.** Leí el journal `wf_7449df59-54c` antes de tocar, como pedía el ítem.
      **El agujero grande no era ninguno de los dos:** el carril declaró haber arreglado que
      dos pantallas ofrecieran WhatsApp contra el placeholder `59177000000`, y el bug siguió
      vivo. Verificado EN VIVO contra el bundle que sirve el contenedor `onia-platform` del
      VPS (no contra Vercel): `NEXT_PUBLIC_DENTALGEST_WA=59177000000` — **la env var de
      producción TRAE el placeholder**, y el número real de `lib/contact.ts` (59178491375) no
      aparece **en ni un solo chunk**. Mover el placeholder de dos componentes a un módulo
      compartido no arregla nada mientras el valor que gana siga siendo el inventado.
      **Por qué los tests no lo vieron, que es la lección:** `lib/contact.test.ts` cubría la
      AUSENCIA de la env var, nunca una env var **presente-y-basura**. Tenía hasta un test
      llamado "cae al nombre VIEJO, que es el que hoy está cargado en producción" — y pasaba
      en verde justamente con el valor roto. **Un `??` distingue undefined, no distingue basura.**
      - **Agujero 2 (real, cerrado):** `admin/plans/PlansClient.tsx` escribía un CUARTO número a
        mano (`wa.me/59177711991`), lo que hacía FALSA la frase "lib/contact.ts queda como fuente
        única". Ahora pasa por `oniaWaHref()`, con una guarda nueva que prohíbe cualquier
        `wa.me/<dígitos>` literal fuera de `lib/contact.ts` (los `wa.me/${telefono}` del despacho,
        las solicitudes y las reservas son el número DEL CLIENTE y siguen permitidos).
      - **Agujero 3 (NO se toca, y está bien así):** los `contacto@dentaGest.bo` de
        `FaqAyuda.tsx` y `lib/ayuda/faq.ts` viven **dentro de comentarios** que explican por qué
        ese contacto falso se retiró. Borrar esa historia es lo que hace que la regla se vuelva
        a desobedecer. El `dentagest-clinical` es el trackId del rubro: renombrarlo es migración
        de datos, y el escéptico ya había dictaminado que dejarlo es correcto.
      - De paso: `__tests__/escanear-fuente.ts` sólo miraba la línea que ABRE un `{/* ... */}`,
        así que las del medio pasaban como código vivo. Lo delató la guarda nueva señalando ese
        comentario de `FaqAyuda.tsx`. Arreglado para las guardas que usan el escáner.
      **Las dos cifras:** no estaban escritas en ningún lado del repo (murieron con el reporte
      del subagente), así que no había nada que corregir — se deja acá el número verdadero para
      que nadie vuelva a citar una base vieja: **origin/master corría 2283**; con esta rama,
      **2291 pasan + 5 skip (2296) en 184 archivos**. Las cifras del reporte (2136 / 2134) medían
      el commit del que ramificó, no master.
      Gates: tsc 0 · eslint 0 errores · 2291 verdes. Commit `34e3d29`, **ya en master**.

- [x] **Los CUATRO números de WhatsApp — CERRADO: Sergio eligió, otro carril lo shippeó, y esta
      vuelta encontró los tres que quedaron afuera.** El ítem seguía abierto acá como 🔴 DECIDE
      SERGIO **pidiendo una decisión que ya estaba tomada** — es el mismo defecto que esta cola
      cerró hace horas (*"la copia vieja fabricaba trabajo para Sergio"*), ahora con la cara de un
      ítem que envejeció en vez de una sección duplicada. Gana **`59175414930`, el de la calle**
      (`197f7a1`, *"habia CUATRO numeros de Onia y ahora hay uno"*, verificado ancestro de
      `origin/master`): es el que publica onia.com.bo y el que está en Cloud API con el bot
      atendiendo.
      **Y el "ahora hay uno" no era cierto todavía: quedaban TRES `wa.me/59177711991` vivos**, y
      no en un lugar interno — en el HTML de los correos que se le mandan al cliente:
      `n8n/workflows/WF-01-trial-warnings.json` (*"Tu trial termina en 3 días"* y *"Último día de
      tu trial"*) y `n8n/workflows/WF-04-dunning.json` (aviso final de mora al paciente). Los tres
      momentos en que más importa que conteste alguien.
      **La raíz, que es lo que se lleva la vuelta: la guarda que existe para impedir exactamente
      esto miraba la carpeta equivocada.** `__tests__/whatsapp-fuente-unica.test.ts` se apoya en
      `__tests__/escanear-fuente.ts`, que lee `.ts`/`.tsx` de `app/`, `components/` y `lib/` — los
      workflows son **JSON en `n8n/`**, o sea fuera del barrido. La guarda afirmaba *"el número se
      escribe UNA vez"* **sin poder verlos**. Es el mismo defecto que la creó el 2026-08-29, un
      nivel más arriba: entonces se escapó un archivo, ahora una **extensión** entera.
      Se le agregó el barrido de `n8n/workflows/*.json` comparando contra `ONIA_WA_NUMBER` —no
      contra un literal—, así el día que el número vuelva a cambiar estos tres fallan hasta
      acompañarlo, con su recíproco para que no pase en verde leyendo una carpeta vacía. **No** se
      extendió `escanear-fuente.ts` a JSON: lo comparten otras guardas de copy de pantalla y
      meterles los workflows adentro les cambia lo que miden.
      Visto en ROJO nombrando los tres antes del arreglo. Gates sobre `f0a6f9e`: **tsc 0 · 2367
      pasan + 5 skip (192 archivos) · lint 0 errores** (101 warnings preexistentes). Commit
      **`40d8dc2`**, **ya en `origin/master`** por fast-forward.
      **Medido, no supuesto:** WF-01 y WF-04 **no están hoy en la instancia viva de n8n** —
      buscados por nombre, sólo corren WF-02, WF-07, WF-08, WF-09 y WF-SENTRY-01—, así que ese
      correo no le llegó a nadie con el número malo. Se arregla en el origen para que no salga mal
      el día que se importen.
      **Residuo, y es de Sergio, no del código:** falta cargar `NEXT_PUBLIC_ONIA_WA=59175414930`
      en el `app.env` del VPS. Se hornea en el build, así que entra con el próximo deploy; hasta
      entonces manda el fallback de `lib/contact.ts`, que ya es el correcto. Producción tiene hoy
      el placeholder muerto (`59177000000`) en la env var, y `sinPlaceholder()` lo filtra — por eso
      no rompe nada mientras tanto.
      *(Anotado de paso, NO perseguido — es de otro carril: `WF-09: Trial Expired Alert`, que sí
      está activo, consulta `https://kvepqgikokjlacxngkiw.supabase.co`, o sea el Supabase de la
      nube. La base de producción es la self-hosted del VPS.)*

      ⚠️ **Trampa de método que me costó romper el repo, y por eso queda escrita:** un worktree de
      `onia-platform` no trae `node_modules`, y linkearlo con una **junction** de Windows
      (`New-Item -ItemType Junction`) parece gratis… hasta que `git worktree remove --force`
      **sigue la junction y vacía el `node_modules` de verdad** — el del árbol principal, que
      comparten los ~30 worktrees. Se detectó al verificar y se restauró con `npm ci` (682
      paquetes, `tsc` verde, árbol limpio), pero el agujero estuvo abierto. **Para la próxima:
      `npm ci` dentro del worktree, o borrar la junction ANTES del `worktree remove`.** Y la
      lección de fondo es la de siempre con otra cara: **limpiar también es una acción que hay
      que verificar**, no sólo construir.

## Después

- [x] 🟡 **El gate de la cola (`scripts/verificar_cola.js`) ladraba 4 "fantasmas" que no lo son
      — ARREGLADO el 2026-09-02, y eran TRES defectos distintos, no uno.** El diagnóstico
      heredado era correcto en los tres síntomas pero los trataba como un solo "detector
      demasiado suelto"; cada uno necesitó su propia carve-out **y su recíproco**, que es lo que
      impide que arreglar el ruido afloje el gate:
      - **Glob** (`*`): una zona no es un archivo. Ningún archivo del repo tiene `*`.
      - **Identificador punteado sin barra** (`visto.texto`, `d.fonts`): el patrón viejo
        `\.[a-z0-9]{2,5}$` tomaba por archivo cualquier expresión de código que la cola cita.
        Ahora un nombre **sin barra** sólo es ruta si su extensión está en `EXTENSIONES` (lista
        explícita, no patrón). **Con barra se sigue verificando siempre**, así que no puede
        tapar un archivo dentro de una carpeta.
      - **Nombre corto de un archivo ya citado entero** (`alta.ts`, después de
        `web-factory/apps/onia-platform/src/app/(sitio)/alta.ts` en el mismo ítem): no es
        fantasma, es el mismo archivo. Se descarta **sólo** si el propio ítem trae una ruta que
        termina en ese nombre — sin la ruta larga, sigue siendo fantasma.
      - **Y la repetición**: la misma ruta citada dos veces en un ítem se reporta una vez.
      **Cómo se sabe que quedó hecho, medido:** `--self-check` pasa **49 casos** (los 9 nuevos
      fallaron en ROJO antes del cambio, por el motivo correcto); `node scripts/verificar_cola.js
      hermes-content/docs/COLA.md` sale **verde, exit 0, 16 ítems**; y un ítem inventado que cita
      `lib/esto-no-existe-jamas.ts` **sigue saliendo fantasma**. `npm test` exit 0. Las otras
      colas de `hermes-content/docs/cola/` dan el mismo `cola-vacia` que antes del cambio
      (verificado con `git stash`): no tienen sección "Ahora", y eso no es regresión de esto.

      *(Texto original del ítem, para que se vea contra qué se midió.)* Medido el 2026-09-02 corriendo
      `node scripts/verificar_cola.js hermes-content/docs/COLA.md`: sale con 4 ERROR y **los
      cuatro son falsos positivos**, porque el detector de rutas toma por nombre de archivo cosas
      que no lo son:
      - `web-factory/apps/onia-platform/**` — es un **glob** de zona, no un archivo (por eso "no
        existe").
      - `alta.ts` — palabra suelta dentro de una frase en prosa.
      - `visto.texto` — una **expresión de JavaScript** citada en el ítem (cuenta doble: el mismo
        renglón se reporta dos veces).
      **Por qué importa y no es cosmético:** el prompt de este carril manda correr este script
      *antes* de tomar un ítem. Un gate que siempre sale rojo por motivos falsos entrena a que se
      lo saltee — es exactamente cómo `CLAUDE.md` cuenta que se rompió el CI dos veces.
      **Cómo se sabe que quedó hecho:** el script sale en verde sobre `COLA.md` sin haber
      aflojado la detección — o sea, sigue cazando un ítem que cite un archivo inexistente de
      verdad (probarlo con uno inventado). Ignorar globs (`*`/`**`), expresiones con `.texto`/
      punto sin extensión conocida, y no contar dos veces el mismo renglón.
      **No lo tomé en esta vuelta** (2026-09-02): la vuelta ya había cerrado su ítem — mover F5 a
      bloqueados — y la regla es un ítem por vuelta.

- [x] 🟡 **`ONIA_WEB_IMAGENES_DE_CONTEXTO.md` daba por publicable una carpeta que ya no existe —
      ARREGLADO el 2026-09-02, y no era UNA línea sino TRES.** La §10 se recontó carpeta por
      carpeta con `ls` contra `web-factory/apps/onia-platform/public/` (`brand · capturas ·
      contexto · fotos · og · recursos`), no de memoria:
      - `public/rubros/*.webp` — el renglón que abrió el ítem. Borrado: la carpeta no existe.
      - `public/v2/capturas/**` y `public/v2/*.webp` — **el mismo defecto, sin reportar**:
        `public/v2/` tampoco existe. Los dos renglones se caían por el mismo motivo, así que
        arreglar sólo el citado dejaba el bug vivo dos renglones más arriba.
      - `components/landing-v2/rubros.tsx`, citado como responsable de las fotos viejas — **ese
        archivo tampoco existe** (murió con la landing v2 rechazada). Hoy `ferreteria.webp` lo
        sirve `components/landing-v1/how-it-works.tsx`, el archivo `/v1`; `dentista.webp` no lo
        usa nadie (verificado con grep sobre todo `src/`, incluida construcción dinámica de ruta).
      La tabla ahora cubre las **seis** carpetas reales — antes listaba tres inexistentes y
      omitía `brand/` y `recursos/`, así que "no está en la tabla" no significaba nada.
      Y queda dicho que `/fotos/` pasa el guard por **forma**, no por estética: `forma.test.ts`
      es el gate de "no servir capturas literales", no el gate visual de §8. Que el test pase no
      hace publicable a una foto.
      **Nada de código tocado** — el ítem es del doc, y `web-factory/apps/onia-platform/` es zona
      del carril `web-venta`.
      **Lo que estaba en juego:** una sesión que leyera "✅ publicable" iba a buscar cinco
      archivos que no están y, al no encontrarlos, a **recapturarlos** — reponiendo justo las
      capturas literales que Sergio mandó sacar el 2026-09-01. Un doc que declara publicable lo
      inexistente no confunde: fabrica trabajo prohibido.

      Texto original del ítem, para no perder la medición que lo abrió:
      **Línea 347**, verificada tal cual: `| public/rubros/*.webp | ✅ publicable | Los 5
      recortes del conmutador, ya cableados y esperando el OK de Sergio. |`. Esa carpeta se
      borró: el conmutador dibuja los cinco rubros con divs desde `c98543e2`. Una sesión que
      lea esa tabla va a buscar cinco archivos que no están, o peor, a recapturarlos.
      **Es lo único que quedó desactualizado de esto**: los dos ítems de esta misma cola que
      describían el recorte horneado ya los cerró el carril dueño en `ffb9e62d`.
      **De paso, para el mismo doc:** el 2026-09-02 cayó también la última captura de la
      superficie de venta, la tarjeta social `/og/onia-rubros.jpg` — tenía **"MUY PRONTO"
      impreso adentro** y era lo primero que veía un lead al recibir el link por WhatsApp.
      Ahora la dibuja `src/app/(sitio)/opengraph-image.tsx`. El `.jpg` sigue en `public/og/`
      **a propósito**: lo usa `/v1`, que es el archivo de la web publicada hasta el 2026-08-21
      y conserva sus capturas tal cual se publicaron (noindex + disallow, cero links entrantes).
      El guard `src/app/(sitio)/forma.test.ts` ahora enumera las carpetas PERMITIDAS
      (`/contexto/`, `/fotos/`) en vez de las prohibidas, así que cualquier captura nueva en la
      superficie de venta rompe la suite.

- [ ] 🔴 **DECIDE SERGIO — `DELETE /api/payments/[id]` sobre un mes ya declarado.** El hueco es
      real y verificado el 2026-08-30: borrar el último pago devuelve la factura a BORRADOR
      (`app/api/payments/[id]/route.ts`), BORRADOR está en `RCV_EXCLUDED_STATUSES`, y ese mes
      pierde la venta del CSV sin nota de crédito de por medio. **No existe NINGÚN concepto de
      cierre de período** en el repo — cero `fiscal_period`, cero tabla de cierre — y el RCV se
      regenera on demand para cualquier mes. No es un bug suelto: falta el modelo, y por eso no
      lo elijo yo.
      **Las tres salidas, cotizadas:**
      - **(a) Guarda barata** — bloquear la salida del RCV si el mes de la factura no es el
        corriente. ~1 día, un guard dentro del helper que ya existe. Pero **inventa la
        política**: "mes corriente" no es "mes declarado", y de paso bloquea la corrección
        legítima del día 2 del mes siguiente.
      - **(b) Cierre de período de verdad** — tabla `fiscal_periods` (org, año, mes, cerradoEn);
        el RCV la lee, y toda salida del RCV sobre un período cerrado exige nota de crédito.
        ~3-4 días. Es lo contablemente correcto y lo que el SIN asume.
      - **(c) No hacer nada todavía.** Verificado EN VIVO en el contenedor `onia-platform` del
        VPS: `SIAT_EMISSION` **no está seteada**, o sea la emisión ante el SIN está apagada
        (`lib/fiscal/flags.ts` exige `=== "1"`). Con eso y cero clientes pagando, el costo real
        de hoy es **cero**; aparece el día que se enciendan los gates fiscales.
      **Recomendación: (c) ahora, (b) el día que se encienda el emisor.** (a) cuesta casi lo
      mismo que (b) en discusión y deja escrita una política que después hay que desandar.
      **Deduplicado el 2026-08-31:** este mismo hueco estaba escrito DOS veces y abierto en las
      dos — acá con sus tres salidas cotizadas, y cien líneas más abajo, en la otra sección
      "Después", sin analizar. Se borró la copia cruda: dos entradas del mismo hueco hacen que la
      próxima sesión lo cotice de nuevo creyendo que es un problema distinto, que es trabajo
      fantasma con otra cara. **Es la tercera vez que esta cola se duplica** — las dos anteriores
      están escritas unas líneas más abajo, en el ítem del guardia de `invoice-status`, que ya
      había dejado la lección por escrito (*"cerrar un ítem no cierra su copia"*) y aun así volvió
      a pasar. Por eso esta vez no queda como lección sino como gate: `scripts/verificar_cola.js`
      falla con `duplicado` si un ítem **abierto** repite el título de otro, en cualquier sección
      y aunque el otro esté cerrado. El verificador miraba sólo "Ahora" y sólo pedía evidencia —
      y una copia sin analizar tiene exactamente la misma evidencia que el original, así que
      pasaba en verde. Una lección escrita se desobedece; un exit 1 no.
- [x] **El guardia de `invoice-status` ya caza lo que prometía.** Las dos evasiones eran reales
      —`const facturas = tx.invoice` y `data: { invoices: { update: … } }` son Prisma normal, no
      rebusques— y **ninguna de las tres existe hoy en el repo** (verificado el 2026-08-30: las
      tres formas dan 0 resultados). Así que esto no cerró un agujero abierto: cerró la puerta
      por la que iba a entrar la séptima, que es como volvió tres veces este mismo defecto.
      **Lo que más importa del arreglo:** los casos se prueban contra código **sintético**, no
      contra el repo. Un guardia nuevo probado sólo contra un árbol limpio pasa en verde sin
      detectar nada — que es exactamente cómo se escribe un guardia que no guarda. Van 5 patrones
      con **4 casos negativos** (leer una factura, incluirla en un `select`, una FILA llamada
      `invoice`, y crearla), porque un guardia que ladra sobre código legítimo se termina
      desactivando y ahí vuelve la séptima.
      **`invoice.create` NO se prohibió, y ésa es la decisión del ítem:** los 5 `create` del repo
      son NACIMIENTOS, y un documento que acaba de nacer no puede tener una NC apuntándole (la NC
      se busca por `notes contains #<número>`, y ese número no existía hasta el INSERT).
      Prohibirlo obligaba a una **lista de excepciones**, que es justo lo que este guardia se
      prohíbe tener. Lo que el nacimiento SÍ puede romper —una NC que nace fuera del RCV, el
      PRIMER bug de la serie— dejó de ser un literal suelto dentro de la ruta y pasó a ser un
      invariante con nombre: `ESTADO_INICIAL_NC` en `lib/fiscal/credit-note.ts`, con su test de
      que no está en `RCV_EXCLUDED_STATUSES`.
      **Una trampa anotada:** ese test pasaba en VERDE con la constante todavía sin exportar,
      porque `not.toContain(undefined)` es cierto y no afirma nada. Lleva un `typeof === "string"`
      para que no pueda pasar vacío. Es la misma forma del test que cubría la AUSENCIA de una env
      var y se tragaba la basura.
      Gates: tsc 0 · eslint 0 errores sobre los archivos tocados · **2301 pasan + 5 skip (2306)**,
      contra 2291 de la medición anterior. Commit `2849be0`, **ya en master**.

      ⚠️ **Ojo para la próxima sesión:** mientras corría esto, **otra sesión estaba escribiendo en
      el MISMO árbol** `onia-platform` (master): aparecieron solos `InboxClient.tsx`,
      `lib/chatbot/push-te-escribieron.ts`, el webhook de Chatwoot y `public/sw.js`. El commit se
      hizo **con rutas explícitas** para no llevarse trabajo ajeno a medias. Y `npx vitest run`
      reescribió dos `.snap` **sólo con CRLF** (diff vacío): se revirtieron, no se commitearon.
- [x] **Las organizaciones de prueba de la base LOCAL: no eran ~9, eran 2 — y las dos son
      evidencia.** Contadas en vivo el 2026-08-31. Primero hubo que dar con la base correcta:
      el `DIRECT_URL` de `.env.local` apunta a `127.0.0.1:54329`, que **acepta TCP y no habla
      Postgres** (ECONNRESET) — la que responde es el contenedor `supabase_db_fiscal-mock`,
      puerto 55322, schema `public`. Ahí hay **dos** organizaciones, ninguna sobrante:
      `Clinica Prueba Fiscal` sostiene la única factura ENVIADA (Bs 500), que es el circuito
      fiscal mock declarado cerrado el 2026-08-29; y `Ferreteria Circuito Completo` sostiene
      el pago **Bs 320,00 APPROVED** en `subscription_payments` — literalmente la cifra que el
      encabezado de este archivo cita como prueba de que el circuito cierra.
      **Borrarlas borraba la evidencia de dos ítems ya cerrados.** No se tocó nada.
      **Lección:** el ítem heredaba un número ("~9") que nadie había contado. Contarlo costó
      cinco minutos y el ítem se dio vuelta entero.
- [x] **El "el bot agenda" no estaba sólo en `lib/pricing.ts`: sobrevivió en tres docs de venta,
      y en uno era el argumento que sostiene el precio — ARREGLADO.** Vuelta del 2026-08-31, con
      la cola sin un ítem desbloqueado en "Ahora" (F2, F5, los 4 números de WhatsApp y el `DELETE`
      de pagos siguen esperando **una línea de Sergio**). Paso 3: se auditaron los `[x]`.
      **Los cierres están sanos** — los 24 shas citados en este archivo se preguntaron con
      `git merge-base --is-ancestor` contra `origin/master` (no con `git branch --contains`, que
      es el error ya escrito acá): **19 son ancestros reales** y los 4 que no (`6edfab6`,
      `a15c82f`, `e46e9ee`, `6d8b6b7`) son exactamente los que este archivo **ya declara**
      locales o pre-squash. Los artefactos que cada cierre promete existen en `origin/master`:
      `__tests__/url-cruda-fuera-de-analytics.test.ts`, `__tests__/eslint-no-lintea-worktrees.test.ts`,
      `lib/gateway/bcp-qr.ts`, `app/api/webhooks/bcp/route.ts`, `CREDIT_NOTE_CREATED` en
      `lib/audit.ts` + `app/(dashboard)/admin/audit/page.tsx`, `SIN_NAV_A_PROPOSITO` en
      `lib/platform/route-access.test.ts` y `frasePuntuada` en `lib/utils.ts`.
      **Lo que apareció al verificar el punto 2 de `hermes-content/docs/ONIA_DEFINICION_DE_TERMINADO.md`:**
      el punto está bien cerrado en el código (`f47d615`), pero **la frase falsa siguió viva en
      el material que la lee**. El punto 2 arregló la fuente y la pantalla del add-on; nadie
      buscó la copia fuera del repo del producto. Encontradas y corregidas, las tres en
      `hermes-content/docs/**` (mi carril):
      - `hermes-content/docs/ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md:51` — la tabla de add-ons vendía
        *"contesta, califica, **agenda** y hace seguimiento"* a Bs 390. Ahora dice "deriva a una
        persona" y nombra el ESCALA de `bot/recepcionista.mjs`.
      - `hermes-content/docs/ONIA_PRICING_CHATBOT_PROPUESTA.md` — **el peor de los tres, y no es
        una frase suelta: es el diferenciador entero.** Decía *"es el único donde la cita cae en
        la agenda y el cobro en la caja del mismo sistema"* (§1), lo repetía como fila de tabla
        contra la competencia (*"La cita queda en la agenda del sistema, el cliente en la ficha"*)
        y **cerraba con eso el pitch de una frase contra Sendy**. Es el argumento por el que
        alguien pagaría Bs 390 en vez de Bs 240, y es falso: el bot escala
        (`bot/recepcionista.mjs:232`), el canal `whatsapp_chatwoot → lead_conversacion` de
        `lib/onia-core/intake.ts:15` no lo llama nadie y `bot_conversations` no está en el schema.
        Reescrito al diferenciador que **sí** es cierto —la bandeja vive dentro del sistema que ya
        tiene agenda, ficha y caja, sin una segunda suscripción— con la nota de qué decía antes.
      - `hermes-content/docs/ONIA_NIVEL_REFERENTES_BRECHA.md:192` — citaba `lib/pricing.ts:64` en
        presente como prueba de que "lo prometemos en la superficie de venta". Ese texto ya no
        existe; la brecha de PRODUCTO sigue abierta y se deja escrita como tal.
      **La lección, que es lo que se lleva la vuelta: arreglar la fuente única no arregla lo que
      ya la copió.** Es la misma forma del defecto que el propio punto 2 había encontrado un
      escalón más adentro (la frase hardcodeada en `AddonChatbotClient.tsx`), y la misma que este
      archivo tiene escrita como *"cerrar un ítem no cierra su copia"*. Un `grep` de la frase
      completa por todo el repo cuesta un minuto y es lo que faltó las dos veces.
      Sin gates de código: son tres markdown, cero líneas de producto. `node scripts/verificar_cola.js` verde.

- [x] **La misma frase falsa vivía en `hermes-content/propuestas/generador/clientes.json` — ARREGLADA,
      y el carril NO era ajeno.** La vuelta anterior la dejó pasar citando el carril C de
      `COORDINATION_MANIFEST.md:94`. Ese modelo está rotulado **"HISTÓRICO, superado"** en el propio
      archivo (`:80`): la autoridad actual es la tabla de carriles vivos del 2026-08-23, que **no
      nombra `propuestas` en ningún carril**, y la sesión `propuestas-v2` que lo poseía ya no existe.
      Encima **esta misma rama ya había commiteado ahí** (`9649dc75`, el arreglo de las 7 propuestas
      con producto pausado). Verificado además que nadie tiene cambios sin commitear en esa carpeta.
      **Un dueño citado de una sección marcada como superada no es un dueño: es una traba inventada,**
      y la traba costó que la promesa falsa siguiera viva un día más en el único material que el
      cliente se lleva por escrito.
      **Gate 1 contra el sistema correcto, no contra un doc:** `hermes-content/deploy/vps-ops/bot/recepcionista.mjs:232`
      — *"Pedido / cita / compra: se toma y se ESCALA. El bot no agenda ni vende solo"*. La línea 16
      del mismo archivo lo repite como regla dura. La promesa es falsa, confirmado en la fuente.
      **22 frases en 3 clientes**, no las 6 que el ítem contaba —contaba sólo AW web y se le escapaban
      la propuesta `aw-climatizacion-chatbot` entera y el add-on de `lia-albertengo`
      (*"agenda y responde pacientes solo"*)—. Corregidas a lo que el bot **sí** hace: responde,
      califica y **deriva el caso listo**. Los 3 HTML regenerados con el generador (nunca a mano),
      que es lo que exige la guarda `el HTML commiteado es exactamente lo que produce el generador`.
      **La guarda nueva es el aporte que sobrevive al ítem:** `ningun cliente le promete al cliente
      que el bot agenda solo` (`hermes-content/propuestas/generador/generar-propuestas.test.js`) recorre
      **todos** los strings de `clientes.json` con 7 patrones + la regla de proximidad (si el string
      nombra al bot, no puede decir "agenda"). Vista en **ROJO** listando las 22, y con **cero falsos
      positivos**: la agenda **real** del sistema en Onia Dental (*"Agenda, pacientes e historial"*) y
      la de la web de Lia (*"Agenda / contacto directo"*) no ladran. Eso importa tanto como cazar el
      defecto — la cola ya tiene escrito que *una guarda que ladra sobre código legítimo se termina
      desactivando*. Tiene lista `PERMITIDO` vacía, con el molde por si algún día hace falta una
      excepción con su motivo.
      **Verificado MIRANDO la propuesta renderizada**, no por grep: el título lee *"responde y deriva
      la visita ya calificada"* y la tabla de paquetes cierra sin una sola promesa de agenda.
      **24 tests OK** en el generador. `node scripts/verificar_cola.js` verde.
      **Residuo que decide Sergio, anotado en el radar:** el 3er paquete de la propuesta de chatbot
      era **"Bot + Agenda" a Bs 4.800** y su único diferenciador era justo lo que el bot no hace.
      Quedó como **"Bot + Reportes"** con el mismo precio — y los reportes avanzados también se
      venden como add-on dos filas más abajo. **El precio no se tocó: no es mi decisión.**

- [x] **Los otros dos agujeros del escéptico — CERRADO como irreconstruible, y por eso deja de
      ocupar un renglón abierto.** El ítem mandaba leer el journal del workflow
      `wf_7449df59-54c` antes de tocar, y ese journal **no existe**. Rebuscado el 2026-09-01 en
      los tres lugares donde podría estar: `find` bajo el `.claude` del usuario, `find` bajo el
      repo, y `$ git grep -l 7449df59 origin/main` — el **único** archivo del repo que menciona
      ese id es `hermes-content/docs/COLA.md`, o sea este mismo renglón citándose a sí mismo.
      Los journals mueren con su sesión.
      **Por qué se cierra en vez de dejarse abierto:** un ítem que nadie puede tomar no es un
      pendiente, es un fantasma con buena letra — el próximo que lea la cola gasta la vuelta
      buscando la fuente y llega adonde llegaron las dos vueltas anteriores. Reconstruirlos de
      memoria sería inventar, que es justo lo que esta cola persigue.
      **Se reabre sólo si alguien vuelve a encontrar el journal**, con su ruta escrita acá.

- [x] 🔒 **La mina de `page_location` en GA — ya estaba cerrada, y de paso quedó su guarda.**
      El ítem seguía abierto acá diciendo *"en arreglo ahora"*, pero el arreglo (PR #59,
      `4dce75e`) **está en `origin/master` y es ancestro de `e5c1ad3`, que es lo que sirve el
      contenedor `onia-platform` del VPS**: el fix ya estaba en producción. Cerrado correcto.
      **Lo que sí faltaba, y es el aporte de esta vuelta:** #59 estrecha el tipo del parámetro a
      `{ origin }`, así que `tsc` frena el regreso **en ese consumidor** — no en el próximo
      archivo que quiera leer la URL completa. El defecto no era del componente, era de forma:
      filtrar los query params en un campo y mandar la URL entera en el de al lado. Ahora hay
      guarda: `__tests__/url-cruda-fuera-de-analytics.test.ts` persigue la LECTURA
      (`location.href`, `document.URL`) en `app/`, `components/` y `lib/` y **permite la
      asignación** — redirigir es idioma normal, y una guarda que ladra sobre código legítimo se
      termina desactivando, que es cuando vuelve el defecto. Se vio en ROJO señalando la línea 64
      contra un árbol con el bug antes de traerla. Reusa `escanear-fuente.ts`, el escáner que ya
      comparten las otras guardas.
      Gates sobre `origin/master`: tsc 0 · eslint 0 · **2323 pasan + 5 skip** (188 archivos).
      Commit `1fc4354`, **ya en `master`**.

      ⚠️ **La lección de esta vuelta es un error MÍO de método, y vale más que el ítem.**
      Diagnostiqué *"el PR nunca llegó a master"* y era **falso**. Dos fallas encadenadas:
      1. **`git branch --contains <sha>` lista sólo ramas LOCALES.** Para saber si algo llegó
         hace falta **`git branch -a --contains`**, o mejor `git merge-base --is-ancestor <sha>
         <lo-desplegado>`, que responde la pregunta que de verdad importa.
      2. **Leí un `master` local desactualizado sin `git fetch` antes.** El `master` local de
         `onia-platform` está **divergido** de `origin/master` (tiene `e46e9ee`, el mismo
         trabajo que `e5c1ad3` con otro sha) y le faltaban 2 commits.
      Es el mismo error que esta cola ya tiene escrito dos veces con otras caras: **verificar
      contra el sistema equivocado**. Un repo local sin `fetch` no es la rama que se despliega,
      igual que Vercel no es el host y un 200 no es una pantalla.
      **Para la próxima:** antes de declarar que algo falta en `master`, `git fetch` y preguntar
      por ancestría contra el sha desplegado. Los 2 commits que escribí sobre esa premisa falsa
      (`6edfab6`, `a15c82f`) quedaron **sólo en el `master` local** y no se pushearon: duplican
      trabajo que ya estaba. No se limpiaron porque ese árbol tiene cambios sin commitear de
      otra sesión (`admin/audit`, `credit-note`, `lib/audit.ts`) y resetearlo se los llevaba.

- [x] **El guardia de repo de `invoice-status` es evadible** — **fantasma: ya estaba cerrado en
      este mismo archivo.** El commit `2849be0` (verificado el 2026-08-31 como ancestro de
      `origin/master`) agregó los 5 patrones con 4 casos negativos, y su cierre está escrito 40
      líneas más arriba. La entrada quedó duplicada en "Después" cuando se cerró en "Ahora".
      **Lección de cola, no de código:** cerrar un ítem no cierra su copia.
- [x] **La nota de crédito no pasa por `maybeEmitFiscalInvoice` — y no se cierra cableándolo.**
      Verificado el 2026-08-31: el validador del emisor BO rechaza una NC por **tres** reglas
      distintas (`total > 0`, `cantidad > 0`, precio unitario negativo — `lib/fiscal/siat-client.ts`),
      así que llamar al helper sólo dejaría un espejo en `rejected`. En el SIAT la NC es un
      **documento de ajuste**: otro servicio y el CUF de la original, y el emisor compartido expone
      hoy un único endpoint (`POST /api/fiscal/invoices`). Cerrarlo de verdad **toca el otro repo**
      (`hermes-content/integrations/siat`), y eso no es este carril.
      **Lo que sí se cerró: que el agujero fuera SILENCIOSO.** La NC es el único documento que
      RESTA del débito fiscal y era el único que no escribía una línea de auditoría — con los
      gates encendidos bajaba la venta del CSV interno sin existir para el SIN y nadie podía
      enterarse. Ahora hay `CREDIT_NOTE_CREATED` con `newValue.siatPendiente`, consultable desde
      `/admin/audit` (con su color ámbar y su filtro). Es el mismo remedio que ya había elegido
      `PATCH /api/invoices/[id]` para su fallo fiscal, en vez de un `console.error` que no
      sobrevive a un reinicio del contenedor.
      **Se miran sólo los dos flags globales** (lectura de env, cero queries): pedir el
      entitlement `module.invoicing` por org costaba un viaje a la base por cada NC, y
      sobre-reportar es el lado seguro de una alarma.
      Gates: tsc 0 · eslint 0 · **2326 pasan + 5 skip**. Commit `14abb9a`, **ya en `origin/master`**.
      **El trabajo estaba sin commitear en el árbol** desde antes de esta vuelta: sin este commit
      se perdía en el próximo `reset` de cualquier sesión.
- [x] **I1 y E1: los DOS eran fantasmas — y el ítem se decidió sin necesitar una sesión.**
      Verificado el 2026-08-31.
      - **I1 (portal de onboarding del cliente): fase 1 VIVA EN PRODUCCIÓN.** Existe
        `app/(public)/portal/[token]` + `/requerimientos` + 7 rutas de API. **Mirado
        renderizado** en `app.onia.com.bo/portal/<token-inventado>`: 200 con la pantalla
        "Enlace no disponible" del propio portal (una ruta inventada da 308, así que no es el
        atrapa-todo). Y está **desplegado**, no sólo en `master`: `3e43c93` es ancestro de
        `e5c1ad3`, el commit que sirve el contenedor del VPS, con los artefactos en su `.next`.
        Hizo lo que su propio PASO 1 mandaba: **encender, no construir** — cero modelos Prisma
        nuevos, la máquina de estados corre sobre `onia_core_work_items`.
      - **E1 (checklist de completitud de rubro): existe** en
        `onia-core/ONIA_RUBRO_COMPLETITUD_CHECKLIST.md`, con su tabla rubro × 7 pasos. Su LISTO
        estaba cumplido desde el 2026-08-20.
      **Lo que sí había que arreglar, y es el aporte de la vuelta:** el checklist de E1 estaba
      **vencido en la fila exacta que declaraba el único hueco**. Cita el commit `b1aa4ec`
      (19:56) y el portal entró en `3e43c93` (20:52) — **56 minutos después**. O sea que decía
      "🔴 FALTA EN EL CORE: no existe el cliente externo autenticado" y "los archivos los carga
      el EQUIPO, no el cliente" mientras el portal donde el cliente sube sus documentos ya
      estaba escrito. Corregidas las 4 celdas (paso 2 y 3, tabla del core y tabla por rubro),
      la lectura honesta #2 y la sección "construir en el core", que baja de bloqueante a deuda.
      **Los conteos "Encendidos plenos" NO se tocaron**: el portal entra por enlace de un solo
      uso, no por sesión propia — pasa de ❌ a 🟡, nunca a ✅. Inflarlos habría sido el error que
      esta cola persigue.
      **Lección:** un doc de verificación fechado envejece en HORAS cuando el carril que mide es
      el mismo que construye. No basta con que exista: hay que preguntarle contra qué commit se
      escribió.

- [x] **Las propuestas ya entregadas venden que el bot "agenda solo" — y el miedo a regenerar
      estaba AL REVES: lo corrido era el HTML, no `clientes.json`. ARREGLADO.**
      Este item, tal como estaba escrito, prescribia **exactamente el arreglo equivocado**:
      *"sincronizar `clientes.json` con los HTML antes de volver a generar nada"*. Hacerlo
      habria devuelto al generador un producto **PAUSADO**.
      **Lo que decia el item:** al regenerar, `propuesta-lia-albertengo.html` *"perdio una fila
      entera"* del cuadro de add-ons (*"Videos con IA para promocionar el libro"*), y de ahi
      concluia que *"el HTML se edito a mano en algun momento, o `clientes.json` se recorto
      despues"*. La medicion existia y no se leyo: `git log -S"Videos con IA"` da el commit
      **`b0c9c931`** (2026-08-15), cuyo mensaje lo dice con todas las letras — *"Videos IA salen
      del generador de propuestas (6 clientes lo tenian a 2.200/mes) **porque estan pausados como
      producto**: seguir cotizandolos vende algo que no se entrega"*. **`clientes.json` es lo
      correcto; el HTML es lo viejo.** Confirmado contra la fuente unica de que se vende:
      `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` **no nombra video ni una vez**.
      **Y no eran 4 propuestas corridas, eran 7 de las 11** — el item solo habia mirado las que
      tenian la frase del chatbot. Comparados `buildHtml(cliente)` contra el archivo en disco,
      uno por uno: `bench`, `garabato`, `hsb-engineers`, `lia-albertengo`, `aw-climatizacion`,
      `aw-climatizacion-web`, `franco-marin`. Dos clases de deriva, **ninguna otra**:
      - **Seis** seguian cotizando "Videos con IA" a **Bs 2.200 (8/mes)**, un producto pausado.
      - **`franco-marin`** escribia la marca **`ONIA`** en mayusculas (3 veces); el generador ya
        produce `Onia`, que es lo que manda CLAUDE.md.
      **Cero precios movidos, cero contenido perdido:** el diff completo son 9 lineas y no toca
      un solo numero de paquete. Lo unico que sale es el add-on que Sergio retiro hace 16 dias.
      **Guarda,** en `hermes-content/propuestas/generador/generar-propuestas.test.js` (el test que
      ya existia, no uno nuevo al lado) y cableada como **`npm run test:propuestas`**: ningun
      `propuesta-<slug>.html` puede diferir de lo que produce el generador con `clientes.json`.
      **Vista en ROJO por el motivo correcto** — listo los 7 slugs por nombre — antes de
      regenerar. Su caso negativo es gratis y real: los 4 que ya coincidian
      (`aw-climatizacion-chatbot`, `dentalgest`, `onia-empresarial`, `premium-cars`) no la
      disparan. Normaliza CRLF, que es la trampa que este archivo ya tiene anotada dos veces.
      **La leccion, que es lo que se lleva la vuelta:** el item **diagnostico al reves y su
      prescripcion era el dano**. Habia corrido el generador y visto desaparecer una fila, pero
      no pregunto **por que** se habia ido — y un `git log -S` de treinta segundos tenia la
      respuesta firmada. Es la misma forma de "verificar contra el sistema equivocado" que esta
      cola ya guarda cinco veces, con la cara nueva de **tomar el artefacto viejo por fuente de
      verdad porque tiene mas contenido**. Mas contenido no es mas verdad.
      **Lo que NO se toco, y con motivo:**
      - **Las dos propuestas con epoch en el nombre** (`propuesta-dental-smile-1781042414583.html`,
        `propuesta-epic-motion-group-1781041181355.html`) tambien cotizan "Videos con IA", pero
        **no tienen entrada en `clientes.json`**: son artefactos sueltos, no regenerables, y la
        guarda no los mira. Corregir un documento ya entregado sigue siendo decision de Sergio.
      - **Los `.pdf`** quedan como estaban (22-jul): son lo que se envio, o sea el registro
        historico. El `.html` es artefacto generado y ahora coincide con su fuente.
      - **`cuestionario-cliente.html:181`** ofrece "Videos con IA" como casilla de **interes**,
        no como precio. No es una cotizacion y hay otras casillas fuera del catalogo, asi que
        sacar solo esa es decision de copy, no un arreglo. Queda anotado, no tocado.
      - **La frase del chatbot que "agenda"** sigue en `clientes.json` y por lo tanto en el HTML
        regenerado: **eso si es de Sergio** y son las dos decisiones que este item ya tenia
        escritas — (1) que se hace con lo ya enviado y (2) si el **chatbot a medida** (sin precio
        de lista) puede agendar cuando se cotiza el flujo aparte, porque entonces la frase no es
        falsa en esas propuestas y si lo es en el add-on de lista de Bs 390.

## Bloqueado — necesita a Sergio

> ⚠️ **Acá había un conteo en prosa ("Estaban 10… hoy quedan 2") y se pudrió**: decía 2 cuando
> había 4, y el 2026-09-02 entraron F2 y F5. **No lo repongas.** El conteo vigente son las
> viñetas de abajo, y se cuenta mirándolas — mismo motivo por el que
> `hermes-content/docs/cola/loops.md` dejó de contar loops en prosa. La fecha de reverificación
> tampoco va en el título: cada entrada trae la suya, que es la que importa.
>
> Esta lista es la que una sesión lee para
> decidir qué preguntarle a Sergio, así que una entrada vencida **fabrica trabajo** — hace que
> alguien le pida una decisión sobre algo ya hecho, y quema el único recurso que no se recupera.
> Es el mismo defecto que esta cola ya bautizó: *"cerrar un ítem no cierra su copia"*. Cada baja
> lleva la evidencia con la que se dio, medida hoy, no leída de otro renglón.

- 🔴 **Los nombres de los iconos se leen como texto en el login de la plataforma — ARREGLADO
  EN CÓDIGO, falta SÓLO el deploy** (movida acá el 2026-09-02 desde "Ahora"; vivía abierta
  arriba de todo mientras el código ya estaba en `master`). El arreglo son `aria-hidden` en los
  tres glifos de `components/auth/AuthShell.tsx` y la guarda del `setTimeout(ok,12000)` de
  `lib/iconos-script.ts`, con sus dos tests (`components/auth/AuthShell.test.ts`,
  `lib/iconos-script.test.ts`).
  **Reverificado en vivo el 2026-09-02, MIRANDO lo servido, no el repo:** producción sigue en
  `BUILD_ID lNDdVgrRvP1mizzu3BVXc` (= `build-8a3b5a6`), el HTML de `app.onia.com.bo/login`
  todavía trae `bolt`, `credit_card_off` y `smart_toy` como nodos de texto **sin
  `aria-hidden`**, y el script del `<head>` sigue cerrando con `setTimeout(ok,12000)`. El
  bloqueo NO venció.
  **Lo que falta es un deploy, no una línea:** `8a3b5a6..origin/master` son exactamente **3
  commits** — `bdf0935` + `5888a13` (este ítem) y `efaffe8` (la CSP del beacon de Cloudflare).
  **Decide Sergio**, con el runbook y el costo en `ONIA_RADAR_DECISIONES_PRODUCTO.md` §20.

- 🔴 **El párrafo del login sale con espacios metidos DENTRO de palabras ("Ent regamos",
  "cit as") — la causa está aislada, pero el arreglo cambia cómo se ve la pantalla** (movida
  acá el 2026-09-02 desde "Ahora"). No es artefacto del canario: reproducido en DPR 1 y DPR 3
  y aislado por bisección a **la fuente Archivo en pesos ≤500** — con `font-weight: 700` o con
  Arial el gap desaparece; `font-kerning`, `font-feature-settings` y pinear `wght` no cambian
  nada. **Evidencia:** `hermes-content/docs/historial/canario-visual/2026-09-01-login-plataforma-texto-espaciado-crop.png`.
  **Por qué no se cerró solo:** la salida directa —subir el peso del texto `detalle` del panel—
  cambia el peso visual de `/login` y `/register`, y una superficie viva no se cambia sin que
  Sergio VEA la pieza. Tampoco puede confirmarse en un Chrome de escritorio real desde el VPS
  (sin GUI). **Las tres salidas, cotizadas, en `ONIA_RADAR_DECISIONES_PRODUCTO.md` §19.**

- 🔴 **F2 · El chatbot se cobra y medio chatbot es gratis** (movida acá el 2026-09-02 desde
  "Ahora"; vivía como el primer ítem no bloqueado y venía sin moverse desde el 2026-08-30).
  **Reverificado en vivo contra `onia-platform` `origin/master` (`efaffe8`, 2026-09-02):** la
  bandeja sigue abierta para todos. `app/(dashboard)/inbox/page.tsx` sigue sin
  `requiresFeature`, y `app/api/admin/clinics/route.ts` sigue creando el inbox de Chatwoot
  (`createInbox` + `addAgentToInbox`) para **toda** org nueva sin mirar `whatsappAddon`. El
  bloqueo no venció: sigue siendo el mismo hoy que el 2026-08-30.
  **Las dos opciones, sin cerrar solo porque las dos bajan una superficie viva:**
  - **(a)** Gatear `/inbox` con `requiresFeature: "addon.whatsapp"` — una línea, pero hoy
    ninguna org tiene el add-on: todas pierden la bandeja de golpe.
  - **(b)** Dejar de crear el inbox salvo que el add-on esté activo — ataca la raíz sin apagar
    nada existente, pero cambia lo que ve un cliente el día uno (la bandeja vacía es gancho hoy).
  **Decide Sergio.** Con cero clientes pagando el costo real de hoy sigue siendo cero.

- 🔴 **F5 · Veterinaria, el 6to rubro** (movida acá el 2026-09-02 desde "Ahora"; era el primer
  ítem abierto y llevaba sin moverse desde el 2026-08-30, cotizada). **El bloqueo es real pero
  el costo estaba inflado**: no es "migrar datos vivos".
  - La factura toma el CI del paciente en **un solo lugar**: `lib/fiscal/rcv-export.ts:148`
    (hoy el campo intermedio se llama `patientCi`, y sale al RCV como `nitCliente` —
    `lib/fiscal/rcv-export.test.ts:143`; la cita vieja del ítem saltaba ese paso).
  - El arreglo mínimo son **columnas anulables** de responsable en `Patient` + una lectura con
    fallback (`responsable?.ci ?? patient.ci`). **Cero backfill**: las filas que ya existen se
    comportan igual que hoy.
  - Superficie: `patientId` aparece 24 veces en `schema.prisma` y 49 archivos lo tocan, **pero
    ninguno se toca en esta versión** — el fallback los deja intactos.
  - Falta: el bloque "responsable / quién paga" en el alta de paciente, mostrado por vocabulario
    sólo en el track veterinaria.
  **Reverificado en vivo contra `onia-platform` `origin/master` (`efaffe8`, 2026-09-02): el
  bloqueo NO venció, y el trabajo no se hizo.** `Patient` sigue sin columnas de responsable — lo
  único que hay en `prisma/schema.prisma:1831` es `ownerProfileId`, que es otra cosa (el humano
  que aprueba en la cola) — y `rcv-export.ts:148` sigue leyendo `invoice.patient?.ci` sin
  fallback. El vocabulario, en cambio, **ya nombra el rubro** (`lib/onboarding/vocabulario.ts:130`,
  "tu veterinaria"): lo que falta es el modelo de datos, no el idioma.
  **Riesgo real: bajo.** Es una migración aditiva. **Decide Sergio**, y lo que decide no es el
  riesgo: es si el 6to rubro vale la semana antes de estrenar los cinco que ya se venden.

- 🔴 **Decidir el dominio `dentalgest.app`**: redirigirlo a `app.onia.com.bo` o dejarlo morir. El
  DNS vive en Vercel (`ns1/ns2.vercel-dns.com`) y no lo puedo tocar (sin token, CLI deslogueado,
  MCP con 403). **Ya no es urgente** — ver la baja de abajo: hoy no sirve nada.
- **Credenciales del BCP.** Sin ellas no hay QR. El checkout ya no lo promete (PR #54), pero el
  cobro sigue siendo manual: el cliente transfiere y alguien aprueba. **Remedido el 2026-09-01:**
  `grep -c 'BCP_QR' /opt/onia-platform/app.env` en el VPS devuelve **0** — no hay ni una de las
  seis variables. El bloqueo es real y no se movió.
- **Deploy de `home`/`empezar`: dos ítems (la maqueta de rubro recortada y las 6 capturas
  literales) están ARREGLADOS EN CÓDIGO desde el 2026-09-02** (`bba1c76e`, `c98543e2`, ya en
  esta rama) y sólo falta publicarlos — medido contra `onia-landing`: `onia.com.bo` sigue
  sirviendo el build viejo con las capturas. Deploy es de Sergio.

> **Deduplicado el 2026-09-01: había DOS listas de bloqueos y la vieja pedía trabajo que ya no
> existe.** Convivían esta y una `## Bloqueado — recontado el 2026-08-30` cien líneas más abajo.
> Sus entradas S2/S3/S4/D3 son las mismas cuatro de arriba, pero su **S1** — *"bajar el
> deployment de Vercel que sigue sirviendo `dentalgest.app`"* — ya estaba dado de baja acá con la
> medición, y **remedido hoy**: `https://dentalgest.app/` y `/login` responden **404 con
> `X-Vercel-Error: DEPLOYMENT_NOT_FOUND`**. No hay deployment que bajar.
> **Por qué esto era peor que un item duplicado:** un item duplicado hace rehacer trabajo; una
> entrada vencida en la lista de bloqueos hace **pedirle a Sergio una decisión sobre algo ya
> resuelto**, y su tiempo es el único recurso que no se recupera. El gate `duplicado` de
> `scripts/verificar_cola.js` no lo podía ver — mira items `- [ ]`, y estas listas se escriben con
> viñetas y filas de tabla. Por eso la vuelta dejó la guarda que sí lo caza: **`seccion-duplicada`**,
> que falla si dos `##` repiten título. De paso destapó otras dos copias, ya fusionadas: había
> **dos `## Después`** y **dos `## Cerrado (2026-08-30)`** (la segunda, vacía).

### Ya NO son bloqueos — dados de baja el 2026-09-01, con la medición

- ~~**Recorrer el circuito en producción**~~ — **corrido hoy, y es el hecho más importante del
  día.** La entrada decía *"crear una cuenta real, que mande un correo real, pagar; es la única
  verificación que no se puede simular"*. Contado en la base de producción (contenedor
  `supabase-db`, schema `public`), no leído de un doc: la organización `ZZ QA Circuito Completo`
  (`cmtj22i3q000001khaxefs8ft`) tiene `onboardingCompletedAt = 2026-09-01 19:31`, **1 fila en
  `appointments`**, **3 en `onia_commerce_products`** y **1 en `subscription_payments` con
  `status = APPROVED`, `amount = 320.00`** (`transactionRef = TRX-20260901-QA01`, `bankName = BNB`,
  `reviewedAt = 19:40`). Los contadores globales pasaron de **0 citas / 0 productos / 0 pagos**
  a **1 / 6 / 1** en el día. El trabajo entró por los PRs **#71 a #75** de la rama
  `fix/circuito-completo` en `onia-platform`.
- ~~**Desplegar al VPS**~~ — **producción está EXACTAMENTE en `origin/master`: cero commits
  pendientes.** La entrada avisaba que `master` tenía commits sin desplegar, *"entre ellos
  `f47d615`, el que saca la promesa falsa de «agenda»"*. Medido hoy contra el clon del VPS
  (`/root/loops/onia-platform`, con `git fetch` antes): lo desplegado es **`55e8d8a`** (build
  `/opt/onia-platform/build-55e8d8a`, contenedor levantado 20:59 UTC), `origin/master` es
  **`55e8d8a`**, y `git log 55e8d8a..origin/master` sale **vacío**. Confirmado además contra el
  bundle servido, que es lo que de verdad lee el cliente: `grep` dentro de `/app/.next` devuelve
  *"contesta, califica, **deriva al humano** y hace seguimiento"* — la frase falsa ya no está en
  producción. Hubo **tres** deploys hoy (`02b9558`, `88a38fd`, `55e8d8a`).
  ⚠️ **Esto no significa "no hay que volver a desplegar nunca":** significa que **hoy** no hay
  nada esperando, y que la próxima vuelta tiene que **remedir** en vez de heredar este renglón.
  Preguntarle a un sha viejo cuál es el desplegado es el error que esta cola ya tiene anotado
  tres veces.

### Ya NO son bloqueos — dados de baja el 2026-08-31, con la medición

- ~~**Bajar el deployment de Vercel que todavía sirve `dentalgest.app`**~~ — **ya no sirve nada, y
  éste era el que más asustaba de la lista.** La entrada decía que el MISMO `onia-platform` seguía
  publicado contra el Supabase de la nube. Medido hoy: `https://dentalgest.app/` y `/login`
  responden **404 con `X-Vercel-Error: DEPLOYMENT_NOT_FOUND`** — Vercel todavía tiene el dominio,
  pero **no hay deployment detrás**. No hay una segunda copia de la app expuesta. Lo único que
  queda es cosmético y es la entrada de arriba (qué se hace con el dominio).
  **Por qué importa la distinción:** "el dominio resuelve" y "hay una app viva ahí" no son lo
  mismo, y la entrada las mezclaba. Un 404 de Vercel con `DEPLOYMENT_NOT_FOUND` es la prueba de
  que no hay nada corriendo; un 404 de la app sería lo contrario.
- ~~**Crear `recurring-invoices` y `onia-core-workitems` en el crontab del VPS**~~ — **hechos y
  probados**, cerrado como **D1** más abajo en este mismo archivo. Verificado hoy por SSH contra
  el VPS: crontab de **36 líneas**, las dos entradas presentes (`0 6` y `0 10`) junto a
  `appointment-reminders` (`*/15`), y los scripts en `/root/bin/` con permisos `700`.
  La entrada afirmaba *"nunca corrieron contra producción"* — falso desde el 2026-08-31.
- ~~**Dar de baja a `arthur` y `seller_001` en `onia_center.user_profiles`**~~ — hecho, cerrado
  como **D2** (los tres, más `seller_002`, en `status='blocked'`). Confirmado por la segunda vía:
  `center.onia.com.bo` responde **404** medido hoy — la superficie ya no está en pie.
- ~~**Vercel al tope (rate limit)**~~ — la propia entrada decía *"hasta el 2026-08-30"*: **venció**,
  y además ya no publicamos por ahí. Muerta por dos vías, ya anotado el 2026-08-30.
- ~~**El schema de producción, que sigue llamándose `dentalgest`**~~ — **está rechazado con motivo**
  en este mismo archivo (migración de datos vivos a cambio de prolijidad que ningún cliente ve).
  Figuraba como bloqueo y como rechazo a la vez.
- ~~**GA4: encenderlo o sacar el código muerto**~~ — cerrado el 2026-08-30: no hay código muerto que
  sacar, es una perilla apagada bien, y encenderla es **una env var**. La entrada estaba mal
  planteada.
- ~~**UI/UX del dashboard**~~ — no es un bloqueo, es una **asignación de carril**: lo lleva
  web-factory. Estar en otra sesión no es estar bloqueado.

## Cerrado (2026-09-01) — no rehacer

- [x] **Paso 3 otra vez: los `[x]` resisten, y el defecto aparecio en la pantalla que decide QUE
      SE PUEDE VENDER.** Vuelta con "Ahora" sin un solo item desbloqueado (F2, F5, el `DELETE` de
      pagos y el item del esceptico esperan **una linea de Sergio**). Se audito contra la punta de
      hoy, que **no** es la de la auditoria anterior: `origin/master` paso de `3c339a6` a `40d8dc2`.
      **La auditoria dio limpia:** los **11 shas citados** (`4077f2c`, `753718f`, `e644c85`,
      `ab9e0de`, `0711ff6`, `2849be0`, `1fc4354`, `4dce75e`, `f47d615`, `3c339a6`, `e5c1ad3`) son
      ancestros reales de esa punta, los archivos y las lineas citadas siguen existiendo, y los
      tres gates dieron **verde** sobre `40d8dc2` (tsc 0 · **2367 pasan + 5 skip** · lint 0 errores,
      101 warnings preexistentes). Ningun cierre falso.
      **El primer candidato a arreglo era FANTASMA, y vale escribirlo:** F2 dejo anotado que
      `addon.chatbot` es "una llave duplicada y muerta". Es **cierto** —confirmado: `lib/pricing.ts:61`
      es un **tier** de `WHATSAPP_ADDON`, no la feature key, y la entitlement `addon.chatbot` no la
      lee **nadie**— pero **no es roto ni falso**: la pantalla de `/admin/organizations/[id]/capacidades`
      ya la muestra con el badge *"Sin efecto todavia · Ninguna pantalla ni API lee esta capacidad"*.
      Es honesta. Borrarla habria sido trabajo fabricado. **Gate 1 sirve tambien para no arreglar.**
      **El defecto real estaba un nivel mas arriba: ese badge se decidia con un mapa mantenido A
      MANO.** `CON_EFECTO_REAL` venia de una auditoria del **2026-08-13** y su propio comentario
      avisaba del riesgo (*"al cablear una capacidad nueva, sumala aca — si no, la pantalla la
      seguira marcando como sin efecto y estaras subestimando tu propio producto"*). **Miente en
      las DOS direcciones y las dos cuestan plata:** una clave prometida sin consumidor le vende a
      Sergio un efecto que no existe; una clave ya cableada fuera del mapa le dice que algo que
      **si** funciona no sirve, y no lo vende. Verificado hoy: el mapa esta **correcto**, pero
      nada lo sostenia.
      **Lo que se hizo:** el mapa sale del client component a `lib/platform/capacidades-con-efecto.ts`
      (el test no puede importar la pantalla sin arrastrar React) y lo guarda
      `lib/platform/capacidades-con-efecto.test.ts`. **Otorgar no es consumir:** los archivos que
      declaran el catalogo o lo derivan (`types.ts`, `entitlements.ts`, `demo-provisioning.ts`, el
      `register`) quedan fuera — si contaran, toda clave derivada de un plan se daria por cableada
      y el mapa se llenaria de promesas falsas, que es justo la mentira que persigue. Casos
      **sinteticos** en las dos direcciones (un guard probado solo contra el arbol limpio de hoy
      pasa en verde sin detectar nada) mas el caso real contra el repo. **Visto en ROJO** sacando
      `addon.captador` del mapa: `{ clave: 'addon.captador', tipo: 'consumidor-sin-nota' }`.
      **Y la pantalla no tenia UNA sola prueba de render**, siendo la que le dice a Sergio que se
      puede vender: sin ella, mover el mapa pasaba en verde aunque la pantalla dejara de leerlo.
      Vista en ROJO con `nota = undefined`, y **mirada renderizada de verdad** — se lee
      *"module.agents · Completa: nav, pantalla y runtime de agentes"* junto a
      *"module.accounting · Sin efecto todavia"*.
      **Un dato falso corregido en el catalogo canonico:** `lib/platform/types.ts` afirmaba que
      `public_booking` *"gatea un item de la nav"*. **No lo gatea nadie** — el unico
      `requiresFeature` de la nav es `module.agents` (`components/layout/navigation.ts:40`). La
      agenda publica **si** esta gateada, pero por las **tres** rutas de `/api/booking`
      (appointments, doctors, slots) con `!org.publicBookingAddon && !canUsePublicBooking(plan)`,
      no por la feature key. Es la misma trampa que ya costo una conclusion falsa en **P3** —
      buscar la clave en el archivo equivocado — asi que se corrige donde se lee.
      **Anotado sin arreglar (no es roto ni falso HOY):** la lista de planes con agenda incluida
      esta escrita **tres veces a mano** (`PAID_PUBLIC_BOOKING_PLANS` en `app/(dashboard)/admin/page.tsx:40`
      y dos literales en `admin/plans/`), y hoy **coincide** exacto con `getLimits().publicBookingIncluded`
      (professional, clinic, enterprise). Se rompe el dia que cambie un plan.
      Gates sobre la punta rebaseada `0532659`: tsc **0** · **2432 pasan + 5 skip (197 archivos)** ·
      lint **0 errores**. Commit **`7bf8a79`**, **ya en `origin/master`**.
      **Apunte de metodo:** el push se rechazo porque `origin/master` se movio entre el `fetch` y
      el `push` (dos merges de otros carriles). Se rebaseo y se **re-corrieron los tres gates
      sobre la punta nueva** antes de pushear: gates verdes sobre una punta vieja no dicen nada de
      la punta que se publica.

- [x] **La lista de bloqueos estaba duplicada y la copia vieja fabricaba trabajo para Sergio.**
      Vuelta con "Ahora" sin un solo ítem desbloqueado (F2 y F5 esperan a Sergio; la frase falsa de
      `hermes-content/propuestas/generador/clientes.json` es del carril C; el ítem del escéptico
      perdió su fuente). Auditando los `[x]` apareció el defecto: convivían **dos** secciones
      `## Bloqueado`, y la del 2026-08-30 seguía pidiendo **bajar un deployment de Vercel que ya
      no existe**. Remedido en vivo antes de tocar nada: `https://dentalgest.app/` y `/login`
      responden **404 `X-Vercel-Error: DEPLOYMENT_NOT_FOUND`**.
      **Lo que se hizo:** se borró la sección vencida (sus otras cuatro entradas ya estaban, con
      medición, en la lista del 31-ago) y se le pasó a la que queda el único dato que sólo tenía
      la vieja — que `master` tiene commits sin desplegar. De paso se fusionaron las otras dos
      copias estructurales que el mismo barrido destapó: **dos `## Después`** y **dos
      `## Cerrado (2026-08-30)`**, la segunda vacía.
      **Y la guarda, que es lo que impide la próxima:** `scripts/verificar_cola.js` ahora falla con
      **`seccion-duplicada`** si dos `##` repiten título. El gate `duplicado` que ya existía **no
      podía ver esto**: mira items `- [ ]`, y las listas de bloqueos se escriben con viñetas y
      filas de tabla — así que una sección entera vencida pasaba en verde. Test primero, en rojo
      por el motivo correcto (`dos secciones con el mismo titulo se marcan`), con su recíproco
      para que no grite en falso sobre las secciones fechadas. **28 casos** en el self-check.
      **La lección: un ítem duplicado hace rehacer trabajo; una SECCIÓN duplicada hace pedirle a
      Sergio una decisión ya tomada.** Es el mismo defecto que esta cola bautizó *"cerrar un ítem
      no cierra su copia"*, un nivel más arriba — y la cuarta vez que se duplica.

## Cerrado (2026-08-31) — no rehacer

- [x] **Paso 3 (auditoría de los `[x]`): la cola resiste, y el hallazgo es que el punto 2 está
      cerrado en el repo y FALSO en producción.** Vuelta del 2026-08-31 con "Ahora" sin un solo
      ítem desbloqueado (F2, F5, los 4 números de WhatsApp y el `DELETE` de pagos esperan a
      Sergio). Cero líneas de producto tocadas: no había nada roto que este loop pueda arreglar.
      **Lo que se auditó y aguantó:**
      - Los **7 shas citados** en esta cola (`0711ff6`, `ab9e0de`, `1fc4354`, `4dce75e`,
        `e5c1ad3`, `753718f`, `4077f2c`) están en `origin/master`, preguntado con
        `git merge-base --is-ancestor` y no con `git branch --contains` — que es la falla de
        método que esta misma cola ya se había anotado.
      - La divergencia `3 3` que se arregló hoy **quedó en `0 0`** y el árbol de
        `onia-platform` está **limpio**. *(La guía del loop dice que ese árbol está "SUCIO con
        trabajo ajeno": hoy es falso.)*
      - **`master` verde de verdad, corriendo los tres gates**: `tsc` 0 · **2362 tests**
        (191 archivos, 5 skip) · `npm run lint` **0 errores** (101 warnings, ninguno nuevo).
      - Las rutas y guardas que la cola declara vivas existen y siguen ahí: `frasePuntuada`
        (`lib/utils.ts:167`), `/requerimientos` en el nav (`navigation.ts:45`),
        `SIN_NAV_A_PROPOSITO`, `__tests__/url-cruda-fuera-de-analytics.test.ts`, y los 3
        archivos del QR del BCP.
      - **Falsa alarma descartada, y vale anotarla:** los **tres** caminos que aprueban un pago
        parecían no contemplar el add-on. Se siguieron los tres y son **fail-closed**: el manual
        sí lo enciende (`admin/subscription-payments/route.ts:93` → `whatsappAddon: true`), el QR
        del BCP lo rechaza antes de crear la fila (`isSubscriptionPlan`) y el callback de n8n
        corta con 422 (`evaluateAutoApproval` → *"Plan invalido"*). Nadie paga el add-on y se
        queda sin él.
      **El hallazgo, que es lo que se lleva la vuelta:** la definición de terminado decía
      *"falta el deploy"* como **suposición**. Se midió DENTRO del contenedor del VPS —única
      forma válida, porque `e5c1ad3` ya no es lo desplegado—: `grep -rl "califica, agenda"
      /app/.next` da **5 chunks vivos** y `"deriva al humano"` da **cero**. Y el tagline se
      renderiza en **un solo** lugar, `AddonChatbotClient.tsx:275`, la pantalla del add-on detrás
      de login: **la frase falsa la lee el cliente que está por pagar Bs 390**. `master` está
      **11 commits** adelante de lo desplegado. Opciones cotizadas en
      `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` §9 — **decide Sergio**, este loop no despliega.

- [x] **El `master` local de `onia-platform` estaba divergido de `origin` — 3 commits contra 3, y
      el mismo árbol.** Es exactamente el objetivo de este carril ("`main` integrado") fallando en
      silencio: `git rev-list --left-right` daba `3 3`, así que ningún push entraba sin merge, y
      la cola ya había anotado que `6edfab6` y `a15c82f` duplicaban trabajo que ya estaba en
      `origin`. **La prueba de que eran duplicados no es leer los mensajes: es el `^{tree}`.** Los
      dos lados daban `06252c6e…` idéntico — mismo contenido, distinta historia.
      Por eso el arreglo fue `git reset --soft origin/master` y no `--hard`: el árbol tenía 4
      archivos sin commitear (`admin/audit`, `credit-note`, `lib/audit.ts`) y un `--hard` se los
      llevaba — que es justamente el motivo por el que la vuelta anterior no lo había limpiado.
      Con los trees iguales el soft reset no movió ni un byte del working tree. Quedó `0 0`.

- [x] 🚀 **`main` INTEGRADA y DESPLEGADA.** 242 commits de 4 carriles (`onia-web-architecture`,
      `chatbots-platform-review`, `ads-creatividades-publicos`, `git-status`). Gates: `tsc` 0,
      **217 tests**, 28 archivos. Deploy de `e5c1ad3` con los 5 gates de
      `deploy-gates-swap.sh` (en el VPS) en OK.
      Backup: `runtime-next.prev-20260831-194424`. Verificado **mirando** el login y `/register`.
- [x] **`claude/pending-tasks-review-fb0694` descartada, no mergeada.** Su único commit es un
      auto-sync del 10-ago y sus 3 archivos son **más viejos** que los de `main`: mergearla
      hacía retroceder los tres. Una rama no es un carril por tener commits.
- [x] **`main` estaba ROJA y nadie lo sabía.** `scripts/carousel_render.test.js` fallaba: el
      renderer dice `square`, el test decía `cuadrado`. No está en ningún CI. El merge trajo el
      arreglo desde el carril de contenido.
- [x] **Había DOS carpetas de handoff** (`handoff/` y `handoffs/`). Consolidadas en la singular,
      que es la que usa el README y los otros 5 carriles.
- [x] **El aviso de pedidos de acceso: PROBADO en vivo, y mi diagnóstico anterior era falso.**
      Dije que "no suena nada" — existe desde el 21-ago (`lib/aviso-acceso.ts`), está cableado
      en `app/api/access-requests/route.ts` y **funciona**: pedido de prueba → 201 → cero
      `[aviso-acceso] Telegram falló` en los logs. Lo había buscado con grep en `app/api`.
      **Lo que sí falla es la señal**: el aviso va al MISMO chat que el guardián del VPS.

- [x] **D2 · Cuentas de más dadas de baja en `onia_center`.** `arthur`, `seller_001` (Camila)
      y `seller_002` (Jerónimo) → `status='blocked'`. Queda **sólo `sergio`** activo. Respaldo
      del estado previo tomado antes del `UPDATE`; se revierte poniendo `'active'`.
      **Cerrado por dos vías**: además del flag, `center.onia.com.bo` responde **404** — la
      superficie ya estaba dada de baja.
- [x] **D1 · Los 2 crons instalados en el VPS y PROBADOS.** Pre-chequeos del runbook en verde
      (`CRON_SECRET` presente, `NEXT_PUBLIC_APP_URL=https://app.onia.com.bo` — no localhost,
      `N8N_API_KEY` presente, sin duplicados). Crontab respaldado en
      `/root/crontab-backup-antes-de-2-crons-20260831.txt` (29 líneas → 36). Scripts en
      `/root/bin/` con permisos `700` y shebang sin CRLF. **Corridos a mano, los dos exit 0:**
      - `recurring-invoices` → `{"ok":true,"processed":0,"failed":0,"total":0}` (hay **0 filas**
        en `recurring_invoices`, así que era no-op garantizado — por eso se pudo probar sin
        riesgo)
      - `onia-core-workitems` → `{"ok":true,"organizations":3,"created":0,"deduped":0,"errors":0}`

## Cerrado (2026-08-30) — no rehacer

- [x] 🔒 **Dar de baja una cuenta del ONIA Center NO cerraba la puerta.** Apareció yendo a
      verificar que D2 sirviera de algo. El middleware hacía `find(active) ?? profiles[0]` y la
      consulta **no filtraba por status**: una cuenta dada de baja caía en el fallback, devolvía
      su rol, y como el normalizador hace `role ?? ""` salía *truthy* — el guard `if (!role)` la
      dejaba pasar. Test en rojo: `expected 'seller' to be ''`. Del otro lado
      `onia-center-auth.ts:252` **sí** filtraba: dos caminos, uno solo cerrado. La decisión salió
      a `lib/onia-center-perfil.ts` con 7 tests y es **fail-closed** (sin `status` no se asume
      activo). Commit `3cccbe67`.
- [x] 🔒 **La mina de `page_location`** — GA mandaba la URL entera y anulaba el allowlist que la
      línea de arriba aplicaba a `page_path`. Dormida (GA apagado) pero **a una env var de
      encenderse**. PR #59: se arma del mismo path ya filtrado, y **el tipo se estrechó
      a `{ origin }`** para que `tsc` frene el regreso.
      ✅ **Verificado el 2026-08-31: esta entrada era correcta.** `4dce75e` está en
      `origin/master` y es **ancestro de `e5c1ad3`**, el commit desplegado en el VPS — o sea el
      fix ya estaba en producción. (Una sesión lo declaró abierto por leer un `master` local sin
      `fetch`; el detalle del error, en la entrada de "Después".) Le falta sólo la guarda, que
      es lo que se agregó.
- [x] **GA4: no era código muerto.** Early-return antes de montar el script, allowlist de 6 rutas
      públicas, política de privacidad ya escrita en condicional. Encenderlo es 1 env var.

- [x] **Corregido el catálogo de venta en 5 puntos** — todos porque estaba viejo, y cuatro de
      los cinco **subvendían** el producto: los cinco rubros ofrecidos ya se venden (decía
      tres), servicios profesionales está arreglado (decía "en arreglo"), el add-on de
      inventario está retirado por decisión de Sergio (decía "en revisión"), veterinaria es
      mucho más barata de lo que decía, y los agentes corren solos (decía que no).

- [x] **PR #56 mergeado** (`14fa528`): el registro ofrece demo al que no sabe configurarlo.
      Lint/Typecheck/Tests/Build y Secret scan en verde; el check de Vercel falló por
      `build-rate-limit`, que no es del código. Cero PRs abiertos en `onia-platform`.
- [x] **Corregido el catálogo de venta: los agentes SÍ corren solos.** Decía que "nadie los
      dispara" mirando `vercel.json` — pero la plataforma la sirve el VPS, no Vercel. El
      crontab del host los corre todos los días a las 07:00 La Paz, con 14 días de `http=200`
      en el log. Se estaba **subvendiendo** una capacidad que funciona.

## Cerrado (2026-08-29) — no rehacer

- [x] Circuito fiscal en mock, verificado en pantalla: CUF, QR, leyenda, RCV.
- [x] **La nota de crédito**, en 5 vueltas y 4 escépticos. Cerró con un invariante escrito, un
      punto compartido para las 6 rutas que escriben estado, y un test que caza cualquier
      escritura nueva sin guarda.
- [x] El 403 que la caja se tragaba en silencio.
- [x] **Métricas del panel** — no existía ni una agregación de plata en todo `/admin`.
- [x] Los dos bugs de alcance que le mentían al superadmin (`/admin/audit` y `/admin/users`).
- [x] `/vendedores` fuera de circulación en los dos hosts, sin reiniciar el chatbot.
- [x] **El alta self-service abierta en producción**, con verificación de correo **probada**
      (GoTrue nunca había enviado un correo: 0 envíos en 7 días).
- [x] El checkout ya no promete un QR que no existe ni una activación que no ocurre.
- [x] DentalGest fuera del código, y el WhatsApp que apuntaba a un número inventado.
- [x] CI de master destrabada: venía roja hacía más de un día.

## Rechazado, con motivo — no volver a proponerlo

- **Graphify / grafo de conocimiento.** El grafo de este repo proyecta ~1,2 M tokens: no es caro
  leerlo, es imposible. Y su detector de obsolescencia miente. Ver
  `ONIA_GRAFO_DE_CONOCIMIENTO_DECISION.md`.
- **Sumar veterinaria al registro.** `Invoice.patientId` es obligatorio y la factura toma los
  datos **del paciente**: una veterinaria no puede facturarle al dueño. Es el modelo, no un texto.
- **Sumar ganadería.** No hay entidades de hacienda ni sanidad — es el catálogo de comercio con
  otro nombre. El core la marca `pending_adoption`.
- **Renombrar el schema de producción.** Migración de datos vivos a cambio de prolijidad que
  ningún cliente ve.
- **Borrar el contenedor `onia-center`.** Adentro corre el motor del chatbot, que es el único
  webhook que Chatwoot tiene configurado.
