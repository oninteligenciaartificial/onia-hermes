# La cola — qué se hace ahora

> **Este archivo es la memoria del trabajo.** Vive en el repo a propósito: los loops de una
> sesión mueren cuando se cierra Claude Code, y con ellos se perdía la cola entera.
> Cualquier sesión lo lee, lo ejecuta y lo actualiza. Sergio también lo puede editar.

**Objetivo vigente (Sergio, 2026-08-31):** **terminar el producto.** Textual: *"cómo querés
escribirles si ni siquiera el producto está terminado; dedicate a terminar el producto y recién
escribimos"*.

**Qué significa terminado está escrito y medido en
[`ONIA_DEFINICION_DE_TERMINADO.md`](ONIA_DEFINICION_DE_TERMINADO.md)** — cuatro puntos, **van 3
de 4**: el 3 era fantasma y el 4 ya estaba construido (los dos del carril producto, cerrados el
2026-08-31 sin escribir una línea), y el **2 cerró también en producción** — `f47d615` sacó el
"agenda" de `lib/pricing.ts` y **el deploy que le faltaba ya entró**, verificado en el contenedor
vivo el 2026-09-02: la frase falsa pasó de 5 chunks a **cero**.
*(Acá decía "le queda sólo el deploy, que decide Sergio". Era un **bloqueo vencido** —le pedía a
Sergio una decisión ya tomada—, que es peor que un fantasma: un fantasma cuesta una vuelta,
éste mantenía cerrada la puerta de los 7 leads por un motivo inexistente.)*
**Queda el 1, de chatbot.** La lista tiene sólo
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
      `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` §24 (era §16 — el radar tenía
      **dos** secciones con ese número y ésta se renumeró el 2026-09-02; la §16 que queda es la
      del deploy, que sigue abierta).

### Del canario visual — segunda pasada del 2026-09-01

- [x] **FANTASMA — "los espacios dentro de palabras" NO existen para un cliente: los dibuja el
      motor con el que sacamos las capturas.** Cerrado el 2026-09-02 por el dueño de `web-venta`,
      que es exactamente lo que este ítem pedía ("confirmarlo en un navegador de verdad antes de
      invertir tiempo"). **Nadie tiene que arreglar nada acá, ni en el login ni en el sitio.**
      **Cómo se probó, y por qué la prueba es concluyente:** se abrió **la misma URL, en el mismo
      instante, con la misma fuente ya cargada**, con los dos motores que hay en el VPS:
      - `chromium_headless_shell` (el que usa el canario): dibuja
        *"Ent regamos t u sist ema con la configuración de t u rubro puest a"*.
      - Chromium completo (`channel: 'chromium'`, headless igual): dibuja
        *"Entregamos tu sistema con la configuración de tu rubro puesta."* — **perfecto**.
      El defecto **es del rasterizador, no del sitio**: sólo cambia el motor de captura. Coincide
      con lo que el propio ítem ya había medido y no supo interpretar — `innerText` correcto,
      `document.fonts.status: loaded`, cero 404. Medido además `getClientRects()`: **una sola
      caja** por palabra en los DOS motores, o sea que ni el layout ni el DOM meten el espacio.
      **La regla del artefacto, para no volver a caer:** el corte cae **siempre después de una
      `t`** (`Client es`, `Fact uración`, `Recordat orios`, `Agent es`, `Ent regamos`, `cit as`).
      Las palabras sin `t` —`Agenda`, `Cobros`— salen limpias en los dos motores. Si un reporte
      futuro tiene TODOS los cortes pegados a una `t`, es este artefacto y no un defecto.
      **Evidencia (mismo html, dos motores, lado a lado):**
      `hermes-content/docs/historial/canario-visual/2026-09-02-artefacto-headless-shell-login.png`
      vs `…/2026-09-02-mismo-html-chromium-real-login.png`, y en el sitio de venta
      `…/2026-09-02-artefacto-headless-shell-empezar.png` vs
      `…/2026-09-02-mismo-html-chromium-real-empezar.png`.
      **Lo que sí queda por hacer, y NO es de este carril** (ver el ítem nuevo abajo): el canario
      arrastra el motor malo, así que va a seguir inventando este defecto en cada corrida.

  <details><summary>El reporte original, tal como lo dejó el canario (ya refutado)</summary>

- **El párrafo izquierdo del login de la plataforma sale con espacios metidos DENTRO de
      palabras** ("Ent regamos", "puest a", "t odo el sist ema", "cit as", "import ante"), en
      `app.onia.com.bo/login` — y por herencia en `/settings/chatbot` sin sesión, que redirige
      ahí. Reproducido 3 veces seguidas en Chromium headless del VPS (`--no-sandbox`), siempre
      en las mismas palabras. El `innerText` del párrafo es correcto (sin espacios de más) y
      `document.fonts.status` es `loaded`, sin 404 de fuentes — el glitch es sólo visual, en el
      renderizado del glifo, no en el dato. La fuente del bloque es `Archivo` (variable font).
      **No se descartó como artefacto del canario**: a diferencia del blanqueo por scroll de la
      home (que desaparece con más tiempo de scroll y por eso NO se reporta), este espaciado
      **no cambió con 3 s de espera extra** después de `networkidle`.
      **No verificado en un Chrome de escritorio normal** — puede ser una rareza de fuente
      variable + Chromium headless Linux y no algo que vea un cliente real; queda a criterio
      del dueño confirmarlo en un navegador de verdad antes de invertir tiempo.
      **Evidencia:** `hermes-content/docs/historial/canario-visual/2026-09-01-login-plataforma-texto-espaciado.png`
      (página completa) y `hermes-content/docs/historial/canario-visual/2026-09-01-login-plataforma-texto-espaciado-crop.png`
      (recorte del párrafo) · login-plataforma hoy = 967 KB
      · 147 ms hasta mirable (baseline: 1.302 KB · 1.043 ms — la baja de peso es variación de
      CDN/compresión entre corridas, no un recorte de contenido: el `innerText` completo
      coincide con la baseline).

  </details>

- [x] 🟠 **El canario saca las capturas con el motor equivocado, y por eso INVENTA defectos de
      texto.** Es la raíz del fantasma de arriba, y no es zona de `web-venta` (vive en
      `scripts/`, cuyo dueño es el carril del canario).
      **Dónde, exacto:** `scripts/canario_visual.mjs:259` llama `chromium.launch(...)` **sin
      `channel`**. Con Playwright 1.60 (el instalado) eso resuelve a `chromium_headless_shell`,
      que es el motor que mete el espacio después de cada `t`. El VPS **ya tiene los dos
      binarios** bajados (`/root/.cache/ms-playwright/chromium-1223` y
      `chromium_headless_shell-1223`): no hay que instalar nada.
      **El arreglo es una línea:** agregar `channel: 'chromium'` a ese `launch` (conservando los
      `args` de `--no-sandbox`, que siguen haciendo falta como root).
      **Por qué importa más que un falso positivo suelto:** este loop confía en las capturas del
      canario para decidir qué está roto en la cara del producto. Un motor que dibuja mal el
      texto convierte cada corrida en trabajo inventado — ya costó un ítem abierto tres días
      contra una pantalla que se veía perfecta.
      **Cómo se sabe que quedó hecho:** correr el canario sobre `login-plataforma` y que la
      captura diga "Entregamos tu sistema", no "Ent regamos t u sist ema".

      ✅ **HECHO el 2026-09-02 por el integrador, en `main`** (`scripts/canario_visual.mjs`).
      Lo tomó él y no el carril del canario porque era el primer ítem abierto de "Ahora" y
      porque cada corrida con el motor malo le fabrica trabajo inventado a los demás carriles.
      **Lo que se hizo:** el `launch` inline salió a una función `opcionesDeChromium(esRoot)`
      que pide `channel: 'chromium'` y conserva `--no-sandbox` sólo como root. Cuatro casos
      nuevos en `--self-check` (69 en total, verde) — **corridos en ROJO antes del cambio**, y
      fallaron los dos del `channel` y ninguno del sandbox, que es el rojo correcto.
      **La prueba de que arregla el defecto, hecha con el Playwright que usa el canario**
      (`/root/node_modules`, 1.60, rev 1223): misma URL, mismo instante, misma fuente cargada.
      Sin `channel` → *"Ent regamos t u sist ema … con t us dat os"*. Con `channel: 'chromium'`
      → *"Entregamos tu sistema con la configuración de tu rubro puesta."* Miradas las dos
      capturas, no leído un exit code.
      ⚠️ **Lo que NO se pudo correr, y es del carril del canario:** el canario entero desde este
      worktree revienta antes de abrir nada — `node_modules` local trae Playwright **1.62.1**,
      que pide `chromium-1234`, y en el VPS sólo está **1223**. No lo causó este cambio (pasa
      igual sin él); el canario no lo sufre porque su worktree **no tiene `node_modules`
      propio** y resuelve a `/root/node_modules` 1.60, que sí calza. Si alguna vez se le agrega
      uno, el canario deja de arrancar.
      ⚠️ **Y esto no llega solo a la próxima corrida:** el runner **no** mergea `main` en los
      worktrees de carril, y `claude/canario-visual` está 91 commits atrás. El canario tiene que
      traer `main` a su rama antes de que sus fotos salgan limpias.

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
      **Lo que sigue sin dueño real** (ver radar §24, que hasta el 2026-09-02 estaba numerada
      §16 igual que la del deploy): la ambigüedad de fondo — que
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

      ✅ **Auditado el 2026-09-02 MIRANDO el resultado, que es lo que faltaba.** Hasta hoy este
      ítem se apoyaba en `tsc` + `next build` verdes, y eso **no dice nada sobre cómo se ve** —
      la regla del carril pide una captura de la pantalla arreglada, no un commit. Se levantó el
      build de este worktree (`next start`, 32/32 páginas) y se abrieron las dos pantallas en
      1440×900:
      - **Los paneles dibujados se ven bien y cuentan cada uno su historia.** El conmutador
        recorre los cinco rubros: cada parada cambia la palabra resaltada y sube su panel
        (agenda dental → caja de comercio → cotizaciones de importadora → paquetes de estética →
        cierre de servicios), uno solo visible por vez, sin recorte ni solape.
        Captura: `hermes-content/docs/historial/canario-visual/2026-09-02-switcher-panel-dibujado-importadora.png`.
      - **Cero `<img>`/`<video>`/`<canvas>` del sistema** en las dos páginas. Las **tres**
        imágenes que quedan en la home (`/contexto/dental|comercio|estetica.webp`) se abrieron y
        se miraron una por una: son **fotos de negocios reales** —una odontóloga con su cuaderno
        de papel, un ferretero con su libro y su calculadora—, sin una sola pantalla legible.
        Es justo lo referencial que Sergio pidió, y el guard `forma.test.ts` ya las exceptúa a
        propósito. **No son un defecto y no se tocan.**
      - **Sin desborde horizontal ni errores de consola** en ninguna de las dos.
      ⚠️ **Un agujero del propio método, para no repetirlo:** esa barrida preguntó por
      `img, video, canvas, picture source` **del DOM**, así que **no miraba el `<head>`** — la
      captura que viajaba en `og:image`/`twitter:image` (la que ve cualquiera que pega el link en
      WhatsApp) le pasó por al lado. La cazó `4384f7e8` ("la última captura del sitio estaba en
      el `<head>`, que es donde nadie miró"). Reverificado tras el rebase, ya con esos commits:
      `/empezar` sirve **cero** imágenes y el `og:image` de la home es hoy una tarjeta
      **generada y dibujada** (`/opengraph-image-…`, el panel de 9 h / 15 h), no una captura del
      panel. Quien audite esto de nuevo: el barrido va sobre el **HTML servido**, no sobre el DOM.
      **Ojo con las capturas de página completa:** el conmutador es `sticky`, así que en una
      captura `fullPage` sale **en blanco** y parece roto. Se mira en viewport, parando en cada
      rubro. Quien audite esto de nuevo, que no reporte ese blanco como defecto.

### Encontrado el 2026-09-02 auditando los `[x]` del carril — ARREGLADO en la misma vuelta

- [x] **`/empezar` se compartía por WhatsApp SIN una sola imagen, y con él otras diez rutas del
      sitio. El `[x]` de ayer daba por cubiertas las doce.** Es el link que se le pasa a un lead
      para que se registre: el último clic del embudo llegaba como un renglón de texto pelado,
      justo al lado de la home, que sí muestra su tarjeta dibujada.
      **Cómo apareció:** auditando el `[x]` de la tarjeta social (el que cerró `4384f7e8`). Ese
      ítem se verificó mirando la home, y la home estaba bien. El comentario de
      `(sitio)/opengraph-image.tsx` afirmaba, textual, que por vivir en el segmento `(sitio)` "la
      heredan sus DOCE rutas". **Es falso.** `opengraph-image` de Next aplica sólo al
      `(sitio)/page.tsx` de su propio segmento y no baja a los anidados.
      **Medido sobre el build, ruta por ruta** (`curl` al HTML servido, no al DOM): `/` traía
      `og:image`; `/empezar`, `/precios`, `/chatbot`, `/agentes`, `/rubros`, `/comparativa`,
      `/contacto`, `/facturacion`, `/guia-facturacion`, `/nosotros` y `/servicios/webs` traían
      `og:title` y `og:description` pero **cero imagen**. Once de doce. Un `curl` a la home daba
      verde y tapaba las once.
      **Y el segundo medio defecto de la misma pantalla:** `src/app/layout.tsx` fijaba
      `twitter:card: "summary"` — la tarjeta chica. Aun con imagen, `/empezar` se compartía como
      si no la tuviera. Ahora es `summary_large_image` en todo el sitio.
      **Lo que se hizo:** el dibujo (el mismo, sin tocar un píxel) se movió a
      `(sitio)/tarjeta-social.tsx`, y cada una de las doce rutas tiene su `opengraph-image.tsx` de
      tres líneas que lo llama. Se corrigió además el comentario de `layout.tsx`, que todavía
      mandaba a poner "una captura REAL del sistema" — la regla de Sergio del 2026-09-01 al revés,
      y el mismo comentario que sostuvo `/og/onia-rubros.jpg` con "MUY PRONTO" impreso adentro.
      **Guard:** `(sitio)/forma.test.ts` ahora falla si una ruta de `(sitio)` no tiene su
      `opengraph-image.tsx`. Una ruta nueva sin tarjeta rompe la suite en vez de salir pelada.
      **Verificado en vivo sobre el build nuevo:** las **doce** rutas sirven
      `og:image` + `summary_large_image`. **Evidencia mirada, no supuesta:**
      `hermes-content/docs/historial/canario-visual/2026-09-02-empezar-tarjeta-social.png` — la
      tarjeta de `/empezar`, 1200×630, dibujada, cero captura, cero obra.
      **Gates:** `tsc --noEmit` 0 · `vitest run forma.test.ts` 47 pasando · `next build` exit 0
      con las 12 rutas de imagen emitidas.
      ⚠️ **Trampa que costó media vuelta, para no repetirla:** el `next start` de la verificación
      **no arrancó** —el puerto seguía tomado por el servidor del build anterior— y siguió
      sirviendo el build viejo sin decir nada. Durante varios minutos medí "arreglado" y "sin
      imagen" sobre HTML de antes del cambio. **Un `curl` a `localhost` no prueba que estés
      mirando tu build:** revisar el log del servidor (`EADDRINUSE`) antes de creerle a la
      medición.
      **Lo que falta, y no es zona de este carril:** el deploy. Contra `onia-landing`,
      `onia.com.bo/empezar` sigue sin `og:image` hoy, y la home sigue sirviendo
      `/og/onia-rubros.jpg` (la captura con "MUY PRONTO"). Publicar lo decide Sergio.

### Encontrado el 2026-09-02 auditando el `[x]` de la tarjeta social — ARREGLADO en la misma vuelta

- [x] **Otras CUATRO rutas publicadas se compartían sin imagen, y el guard que debía impedirlo
      no las miraba. El `[x]` de la vuelta anterior daba por cubierto el sitio entero.** Es el
      MISMO defecto que cerró `30484b7b` ("once de doce"), una capa más afuera: aquel arregló
      las doce rutas del grupo `(sitio)`, pero el sitio publica **dieciséis**.
      **Cómo apareció:** auditando ese `[x]`. Se volvió a medir, pero **contra el sitemap** en
      vez de contra la carpeta — el sitemap es la lista de lo que publicamos ("nunca una página
      publicada sin su entrada", dice su propio comentario). De sus 16 URLs, **4 servían
      `og:title` y `og:description` y cero imagen**: `/servicios/marketing-ia`,
      `/servicios/consultoria`, `/terminos` y `/privacidad`.
      **Por qué se escaparon, que es lo que importa:** viven FUERA del grupo `(sitio)` —en
      `src/app/servicios/…`, `src/app/terminos/`, `src/app/privacidad/`—, y `opengraph-image` de
      Next no cruza grupos de rutas. `/servicios/webs` sí tenía tarjeta **porque está adentro**:
      dos rutas hermanas bajo la misma URL `/servicios/`, una con imagen y otra sin, según en qué
      carpeta del disco quedaron.
      **El guard tenía el mismo agujero, y ese es el hallazgo real.** `(sitio)/forma.test.ts`
      enumeraba las rutas con un `readdirSync` del directorio `(sitio)`, así que era
      **estructuralmente ciego** a lo de afuera: pasaba en verde con las cuatro rotas. Un guard
      que sólo mira donde ya arreglaste no es un guard. Ahora la lista **sale del sitemap**
      (`src/app/sitemap.ts`, parseado) y resuelve cada ruta dentro o fuera de `(sitio)`: una página nueva
      entra al sitemap y el test le exige su tarjeta, esté en el grupo que esté.
      **Probado que el guard MUERDE, no que sólo pasa:** se sacó
      `terminos/opengraph-image.tsx` y la suite falló en esa ruta exacta
      (`× /terminos tiene su opengraph-image.tsx`); restaurado, verde. Un test que nunca se vio
      fallar no prueba nada.
      **Verificado sobre el HTML servido del build nuevo** (no el DOM, no `main`): las **16**
      rutas del sitemap devuelven `og:image` `200 image/png` de 40.888 B. Antes: 12.
      **Evidencia mirada, no supuesta:**
      `hermes-content/docs/historial/canario-visual/2026-09-02-tarjeta-social-rutas-fuera-de-sitio.png`
      — la tarjeta de `/servicios/consultoria`, 1200×630, dibujada, cero captura, cero obra.
      **Gates:** `tsc --noEmit` 0 · `vitest run forma.test.ts` **51 pasando** (eran 47: una por
      ruta nueva) · `next build` exit 0, **16** rutas `opengraph-image` emitidas (eran 12).
      ⚠️ **La trampa del `EADDRINUSE` volvió a morder, y avisada.** `pkill -f "next start"` mató
      **mi propia shell** (el patrón coincide con la línea de comando que lo invoca), no el
      servidor: el viejo siguió tomando el puerto y el `next start` nuevo murió con
      `EADDRINUSE`. Un `curl` ahí habría medido el build ANTERIOR y dado "arreglado" por
      casualidad. Se libera con `fuser -k 3210/tcp` y se lee el log antes de creerle a la
      medición.
      **Lo que falta, y no es zona de este carril:** el deploy. Contra `onia-landing`, las cuatro
      siguen sin imagen hoy. Publicar lo decide Sergio.

### Encontrado el 2026-09-02 auditando el `[x]` de las capturas literales — ARREGLADO en la misma vuelta

- [x] **El guard de "cero capturas del sistema" miraba SÓLO `(sitio)`: era ciego a 4 de las 16
      rutas publicadas y a TODO lo compartido (cabecera, pie, las secciones).** Es la
      **tercera** vez que este mismo guard falla, y las dos anteriores ya estaban escritas en su
      propio comentario. Peor: el agujero es el MISMO que el bloque de tarjetas sociales de ese
      archivo se había tapado horas antes leyendo el sitemap (`8ec1c9e3`) — los dos guards viven
      en `web-factory/apps/onia-platform/src/app/(sitio)/forma.test.ts`, uno arreglado y el otro
      no.
      **Cómo apareció:** auditando el `[x]` de las 6 capturas literales. Ese ítem se verificó
      mirando `/` y `/empezar`, y las dos estaban bien; lo que nadie preguntó es **qué mira el
      test que lo sostiene**. `fuentesDelSitio()` arrancaba el walk en el directorio `(sitio)`,
      así que `/servicios/marketing-ia`, `/servicios/consultoria`, `/terminos` y `/privacidad`
      —que viven fuera de ese grupo de rutas— quedaban fuera, junto con
      `web-factory/apps/onia-platform/src/components/site-header.tsx`, su pie, sus secciones y su
      carpeta legal. Una captura en la cabecera sale en las **dieciséis** páginas a la vez y el
      guard pasaba verde.
      **Gate 1, medido antes de tocar nada — el agujero es real pero HOY no tiene víctima:** las
      4 rutas de afuera sirven sólo `/brand/v2/onia-logo.svg`; el único `/og/onia-rubros.jpg` que
      queda en `web-factory/apps/onia-platform/src/app/layout.tsx` (línea 64) está **dentro de un
      comentario** (el guard ya los strippea); y la carpeta `landing-v1` es el archivo `/v1`,
      noindex, con su captura a propósito. Se arregla el guard, no una pantalla: no se desmarca
      nada.
      **Lo que se hizo:** el walk arranca ahora en la raíz de la app (rutas + todo lo compartido) y lo único
      excluido es el archivo `/v1`, por nombre y con su motivo escrito. Se da vuelta la misma
      regla que ya se había dado vuelta para las carpetas de imagen: en vez de enumerar dónde SÍ
      mirar, se mira todo y se enumera lo excluido. Una carpeta de rutas nueva queda cubierta el
      día que se crea.
      **Probado que MUERDE, dos veces, no que sólo pasa:**
      - Se inyectó `"/capturas/panel-onia.png"` en la cabecera compartida —archivo al que
        el guard viejo **no llegaba**— y la suite falló en esa línea exacta
        (`× components…site-header.tsx no sirve una captura del producto`). Restaurado, verde.
      - Se volvió a apuntar el walk a `(sitio)` y saltó el anti-regresión nuevo
        (`× mira la superficie viva entera, no sólo (sitio)` → *"el walk no llega a la página de
        términos"*), cayendo a **51** tests: exactamente el número viejo. Sin ese
        test, angostar el walk otra vez —que suena razonable, es "la carpeta del sitio"— deja la
        suite en verde con media superficie sin mirar.
      **Verificado MIRANDO, no sólo con el test**, contra el contenedor `onia-landing` (no `main`,
      no Vercel), con `channel: 'chromium'` y no `headless_shell`: `/servicios/consultoria` y
      `/terminos` en 1440×900 — cero `<img>`, `<video>` o `<canvas>` fuera del logo SVG, cero
      desborde horizontal, **cero errores de consola**, texto bien dibujado y sin una palabra de
      obra.
      **Evidencia:**
      `hermes-content/docs/historial/canario-visual/2026-09-02-fuera-de-sitio-servicios-consultoria.png`
      y `hermes-content/docs/historial/canario-visual/2026-09-02-fuera-de-sitio-terminos.png`.
      **Gates:** `tsc --noEmit` 0 · `vitest run forma.test.ts` **99 pasando** (eran 51: el walk
      pasó de 33 archivos a 81) · `npm run build` exit 0, 32/32 páginas.

### Encontrado el 2026-09-02 MIRANDO la home en TELÉFONO — ARREGLADO en la misma vuelta

- [x] **La home abría con una franja de 148px EN BLANCO en el primer scroll del iPhone más
      común, y ninguna revisión lo vio nunca porque todas se hicieron a 1440×900.** Es la
      pantalla #1 del carril y el dispositivo real del lead: el link llega por WhatsApp y se
      abre en el teléfono.
      **Cómo apareció:** ni "Ahora" ni "Después" tenían ítem abierto de esta zona, así que se
      bajó al escalón 2 (auditar los `[x]`). El `[x]` de las tarjetas sociales auditó limpio —
      las 16 rutas sirven `og:image` **y** `twitter:image` con `summary_large_image`, medido
      sobre el HTML del build. Lo que ninguna de las auditorías previas había hecho es abrir las
      dos pantallas en un viewport de teléfono.
      **El defecto, medido en tamaños reales de dispositivo** (Playwright, `channel: 'chromium'`):

      | dispositivo | franja en blanco |
      |---|---|
      | iPhone 12/13/14/15/16 (390×844) | **148px** |
      | Galaxy S20/S23 (360×800) | **53px** |
      | iPhone SE (375×667) | 0 — el panel ni asoma |
      | iPhone Pro (393×852) y todo lo más alto | 0 — entraba justo al 35% |

      **La causa, y por qué se escapó tres veces:** `src/motion/tokens.ts` definía
      `viewportOnce = { once: true, amount: 0.3 }`. El `amount` de `whileInView` se mide sobre el
      **alto del elemento**, no sobre lo que se ve. El panel del día (`s.day`) mide 512px en
      teléfono y asoma 148px = **29%**, contra un umbral de 30%: se quedaba en `opacity: 0`
      hasta que el visitante scrolleara. A 393×852 asoma 180px = 35% y dispara — por eso el
      defecto es invisible en cualquier pantalla grande, incluida la de quien revisa.
      **Y ya había mordido antes, con la causa a la vista.** `(sitio)/servicios/webs/page.tsx:180`
      tiene el diagnóstico escrito desde hace tiempo —"un Reveal más alto que ~3,3 pantallas
      nunca llega al 30% visible y se queda en opacity 0 para siempre"— y se arregló **achicando
      ese Reveal**. La causa quedó viva en el token, y de ahí llegó a la home. Es el mismo patrón
      que esta cola ya anotó para los guards: arreglar la instancia donde saltó y no la clase.
      **Lo que se hizo:** el token pasa a `amount: "some"` (cualquier píxel dentro). La
      invariante queda enunciable y no depende del alto de nada: **nada que toque la pantalla
      puede quedar invisible**. Con una fracción no se cumple para bloques altos; con `"some"`
      se cumple por definición. El estado final de cada página es idéntico —sólo cambia CUÁNDO
      dispara la entrada—, así que no es un cambio de dirección visual.
      **Probado que los guards MUERDEN, no que sólo pasan** (`src/motion/tokens.test.ts`, nuevo):
      - Se devolvió el token a `amount: 0.3` → `× no usa una fraccion como umbral`.
      - Se escribió `viewport={{ once: true, amount: 0.45 }}` a mano en `src/motion/reveal.tsx` → el guard
        lo cazó por archivo y línea. Restaurado, verde.
      - El guard mira **sólo** el `viewport={{…}}` de `whileInView`, que es la clase que
        esconde. `useInView` (`CountUp`, `AgentScene`) queda afuera **a propósito y medido**:
        renderizan su contenido igual —`CountUp` sirve el valor final desde el server— y un
        umbral ahí sólo demora una animación de pasos. La primera versión del guard los marcaba
        y era un falso positivo.
      **Verificado MIRANDO, y en las 16 rutas, no sólo donde arreglé:** barrido de
      `16 rutas × 3 tamaños = 48 pantallas` preguntando por cualquier elemento con `opacity: 0`
      que toque el viewport inicial → **cero**. Antes del cambio, ese mismo barrido marcaba la
      home a 390×844 y a 360×800.
      **Evidencia:**
      `hermes-content/docs/historial/canario-visual/2026-09-02-home-telefono-franja-en-blanco-ANTES.png`
      (la franja vacía) y `…/2026-09-02-home-telefono-panel-visible.png` (el panel del día ya
      visible en la primera pantalla).

- [x] **De paso, el gate del carril: los 115 tests de guarda NO los corría nadie.** Las suites
      que estas vueltas fueron construyendo —`(sitio)/forma.test.ts` (cero capturas del sistema, las 16
      tarjetas sociales), `(sitio)/alta.test.ts`, `(sitio)/hero.test.ts`— vivían en el repo **sin un script que
      las invocara**: `package.json` no tenía `test`, y `prebuild` era sólo `tsc --noEmit`. Se
      corrían a mano con `npx vitest run`. Una regresión de captura literal pasaba el build y
      llegaba al deploy.
      **Lo que se hizo:** `"test": "vitest run"` y `"prebuild": "tsc --noEmit && vitest run"`.
      Es el mismo hook que el deploy real ya ejecuta (`scripts/deploy-onia-landing.sh:25`,
      `pnpm --filter onia-platform build`), y el install de ese script es
      `pnpm install --frozen-lockfile` —no `--prod`—, así que `vitest` está disponible igual que
      `tsc`, que ya corría ahí.
      **Probado que MUERDE:** con el token roto a propósito, `npm run build` sale **exit 1** y
      corta **antes** de `next build`. Restaurado, `npm run build` exit 0.
      **Gates de esta vuelta:** `tsc --noEmit` 0 · `vitest run` **115 pasando** (eran 112: 3 del
      guard nuevo) · `npm run build` exit 0, 48/48 páginas.
      **Lo que sigue abierto y es de otro dueño:** las otras apps de `web-factory`
      (`dental-premium`, `dentalgest-landing`, `ferreteria-sur`, y `site` que ni script tiene) y
      el cableado en el script raíz — tocar los 4 archivos raíz de `web-factory` no es zona de
      este loop.

### Encontrado el 2026-09-02 MIRANDO el PIE en teléfono — ARREGLADO en la misma vuelta

- [x] **Las dos pantallas del carril cerraban con una franja de 73px del fondo CLARO debajo del
      pie NEGRO, en teléfono.** No era del pie ni de una página: era del `body`, así que salía
      en **todas** las páginas del sitio en móvil. Lo último que ve un lead que leyó la página
      entera era un corte de maquetación.
      **Cómo apareció:** ni el tablero ni "Ahora" daban ítem de esta zona (las 3 tareas del
      tablero son del carril chatbot; el único ítem de zona, el del gate `tsc`, ya tiene cerrado
      su residuo y lo que queda es de otros dueños). Así que se corrió la definición de hecho del
      carril: abrir las dos pantallas y MIRARLAS. Salieron 4 capturas (390×844 y 1280×900,
      `channel: 'chromium'` — el motor correcto, no el `headless_shell` que inventa defectos de
      texto): HTTP 200, cero errores de consola, cero desborde horizontal, y la franja al pie.
      **La causa, medida y no supuesta:** `src/app/globals.css` tenía
      `@media (max-width: 899px) { body { padding-bottom: calc(4.6rem + env(safe-area-inset-bottom)) } }`,
      con el comentario *"la barra de accion fija del movil no debe tapar el final de la pagina"*.
      **Esa barra ya no existe.** Medido en vivo con la página scrolleada al fondo: el único
      elemento `fixed`/`sticky` del sitio es el `header` (arriba, 61px), y `grep` de
      `position: fixed` sobre `globals.css` + `(sitio)/sitio.module.css` + todos los `.tsx` devuelve
      **cero**. El hueco quedó huérfano y pintaba del fondo del body, que es claro.
      El padding entró con `1ddba7ad` (`git log -S "4.6rem"`); la barra se fue después y el
      hueco se quedó.
      **Un falso positivo descartado en el camino, y cómo:** la misma corrida mostró una columna
      de cuadraditos pegada al borde izquierdo que parecía un grid roto (el navegador reportaba
      `grid-template-columns: 24px 316px` donde el fuente dice `repeat(24, 1fr)`). **No es un
      defecto:** `sitio.module.css:1126` rota el panel del día 90° en teléfono a propósito
      (`grid-template-rows: repeat(24, ...)` + `grid-auto-flow: column`), y los 9/15 ticks
      alinean con sus dos bloques. Leer el CSS antes de "arreglarlo" evitó romper un diseño sano.
      **Lo que se hizo:** el bloque huérfano del `body` sale, y el área segura del teléfono la
      absorbe ahora el propio pie (`.footer { padding-bottom: calc(2.4em + env(safe-area-inset-bottom)) }`).
      Es el arreglo correcto y no sólo el que borra: puesto en el `body`, el margen del notch
      pintaba igual del fondo claro; puesto en el pie, sale del negro del pie.
      **Verificado MIRÁNDOLO, no con un grep:** build local servido en `:3199`, scroll hasta el
      fondo real (`scrollY == maxScroll`) y captura de las dos pantallas — el pie negro llega al
      borde inferior. Medición: `sobra = scrollHeight - footer.bottom` pasa de **73px (home) y
      74px (/empezar)** a **0 y 0**; `body.padding-bottom` de `73.6px` a `0px`.
      **Gates:** `npm run typecheck` exit 0 · `npm run build` exit 0.
      **No se desplegó:** `onia.com.bo` la sirve el contenedor `onia-landing` y publicar es de
      Sergio — la franja sigue viva en producción hasta ese deploy.

      ✅ **Y ahora tiene gate — `web-factory/apps/onia-platform/src/app/(sitio)/cierre.test.ts`,
      2026-09-02.** El arreglo de
      arriba se fue **sólo en CSS, sin un test**: nada impedía que el `padding-bottom` volviera, y
      este defecto vivió en las 16 rutas del sitio sin que ningún gate lo viera. Corre en
      `prebuild` (`tsc --noEmit && vitest run`), que es el comando real del deploy.
      **Caza la CLASE, no la forma de ayer** — la lección que el guard de capturas de al lado ya
      había aprendido fallando tres veces: no busca el literal 4,6rem ni sólo `padding-bottom`, sino que el
      `body`/`html` reserve fondo en **cualquiera** de sus formas (`-bottom`, `-block`, y el atajo
      `padding`/`margin`, resolviendo qué valor es el lado de abajo según tenga 1, 2, 3 o 4).
      **Lleva las dos mitades del arreglo**, porque borrar el padding a secas dejaba el mismo
      defecto en un iPhone con notch: exige que `env(safe-area-inset-bottom)` lo absorba el PIE y
      no el documento.
      **Probado en ROJO antes, en las tres formas de romperlo:** (1) vuelve el `body
      { padding-bottom: 4,6rem }` original → 2 tests rojos; (2) nadie absorbe el área segura →
      *"en un iPhone con notch vuelve la franja"*; (3) la absorbe el `body` en vez del pie → 2
      rojos. Árbol restaurado y verde en las tres.
      ⚠️ **Se cazó a sí mismo un falso positivo**: la primera versión marcaba `body { margin: 0 }`
      —un reset legítimo— porque miraba la propiedad y no el VALOR. Un guard que ladra sobre
      código sano se termina apagando, así que ahora sólo cuenta el lado de abajo distinto de cero.
      **Gates:** `typecheck` exit 0 · `build` exit 0 · suite **119 pasan (5 archivos)**.

      ⚠️ **Y ese gate nacía CIEGO a doce de las catorce hojas — corregido el 2026-09-02,
      misma jornada.** Auditando el propio `[x]` de arriba: el test declaraba vigilar "las 16
      rutas del sitio", pero su lista de hojas era **fija y de dos archivos** (`globals.css` y
      `sitio.module.css`). La app tiene **14 hojas `.css`**, y un CSS module alcanza el `body`
      con `:global(body)` — `guia-facturacion` ya lo hace. Es **el mismo error que el guard de
      capturas de al lado** (`def54931`: *"miraba solo (sitio) y era ciego a 4 rutas
      publicadas"*), repetido en el gate escrito para no repetirlo.
      **Demostrado, no argumentado:** el mismo defecto (`:global(body) { padding-bottom: 4.6rem }`)
      escrito en `components/site-footer.module.css` —la hoja que cierra `/privacidad`, `/terminos`, las 8
      rutas `/v1/*` y el 404— pasaba **VERDE (4/4)** con el gate viejo y sale **ROJO** con el
      nuevo, nombrando el archivo culpable.
      **Qué cambió:** las hojas se descubren del disco (una hoja nueva queda cubierta sin que
      nadie se acuerde de agregarla); `esElDocumento` entiende `:global()` en cualquier posición
      y `body`/`html` calificados (`body:has(.hoja)`, `html.oscuro`), pero **no** cuando `body`
      es sólo el ancestro (`body main` no es el documento).
      **Y se corrigió una regla que era falsa:** el test exigía que *todo* selector con
      `env(safe-area-inset-bottom)` fuera un `footer`. Al barrer las 14 hojas apareció `.mobar`
      de `landing-v1` —**la barra de acción fija del móvil, que sí existe** en el legado `/v1`,
      con fondo propio, absorbiendo bien su área segura. La regla real no es "tiene que ser el
      pie" sino **"no puede ser el documento"**: ahí es donde el espacio se pinta del fondo claro.
      **Probado en ROJO en 4 formas** (pseudo-clase `:has()`, atajo `margin` de 4 valores, el
      documento absorbiendo el área segura, y borrar el área segura del pie de venta) **y en
      VERDE en 2 que no deben ladrar** (`body main` descendiente, y una barra fija con fondo
      propio). Árbol restaurado y verde en las seis.
      **Medido en producción hoy, con Chromium sobre el contenedor `onia-landing`:** la franja de
      **74px** sigue viva en `/` y `/empezar` en teléfono (`body.padding-bottom: 73.6px`, pie
      negro `rgb(18,16,14)`, hueco claro `rgb(249,251,250)`) — captura en `/tmp/pie-home.png`.
      El arreglo espera el deploy de Sergio; el gate ya impide que se pierda.
      **Gates:** `typecheck` exit 0 · `build` exit 0 · suite **132 pasan (5 archivos)**.

      ✅ **Cerrada la otra mitad el 2026-09-03: ahora hay un gate que ABRE las dos pantallas.**
      Los cuatro tests de al lado leen el código fuente: son rápidos, corren en cada build y
      **no abren nada** — la franja no la encontró ninguno, la encontró una captura. Y el que la
      guarda vigila la CAUSA de ese día (una barra fija que ya no existe): si vuelve por otro
      camino, pasa en verde.
      `web-factory/apps/onia-platform/scripts/mirar-venta.mjs` mide el **síntoma**: abre `/` y
      `/empezar` en 5 anchos (320 · 390 · 768 · 1440 · 1920), scrollea hasta el fondo y pregunta
      **qué elemento está pintado al pie del último viewport**. Si es `BODY`/`HTML`, lo que se ve
      abajo de todo es el fondo de la página y no el pie. También mide desborde horizontal, texto
      recortado y errores de consola.
      **Probado con el experimento que estaba servido, no con uno inventado:** el mismo comando
      contra producción (build viejo, defecto vivo) sale **ROJO, exit 1**, nombrando
      `/empezar` en móvil-390 y tablet-768 con la captura
      (`/tmp/gate-prod/empezar-tablet-768-pie.png`, mirada: franja clara de ~55px bajo el pie
      negro); contra el build de esta rama sale **VERDE, exit 0**. Mismo instrumento, resultados
      opuestos: discrimina.
      **Lo que NO se hizo, a propósito:** no se cableó en `prebuild`. El deploy real corre
      `pnpm --filter onia-platform build`, y meterle un navegador a ese camino cambia un gate por
      un riesgo. Se corre a mano cada vuelta del loop; `playwright` no se sumó al `package.json`
      (se elige el que ARRANCA entre los ya instalados — el del worktree pide un Chromium que
      nadie bajó).
      **El 429 del widget de chat sale como aviso, no como falla**, porque el ítem de abajo ya
      midió que los bloqueos vienen del propio monitoreo y el límite vive en otro carril: un gate
      rojo para siempre por algo que no puede arreglar es un gate que nadie lee.

      ✅ **Y ese gate no decía DE QUIÉN era el trabajo — cerrado el 2026-09-03, misma jornada.**
      Corriendo el gate como definición de hecho de la vuelta salió **rojo, 6 fallas**: la franja
      bajo el pie viva en `/` y `/empezar` en 320, 390 y 768. Averiguar si había que **tocar
      código** o sólo faltaba **publicar** costó **25 minutos a mano** (build, `next start` en un
      puerto libre y una segunda corrida). La respuesta era "ya está arreglado, falta el deploy":
      **cero código que tocar**. Repetir esa investigación cada vuelta es caro; el error caro de
      verdad es el otro — leer el rojo de producción y "arreglar" lo que ya estaba arreglado, que
      es el fantasma que esta misma cola mide entre el **25% y el 46%** de los pendientes
      heredados.
      **Qué cambió:** cada falla se guarda con su **clase** (`home @ movil-390 | franja`), no sólo
      con su texto — el texto lleva píxeles y rutas del día y no es comparable entre dos corridas.
      Con eso, `--comparar-con=<informe.json de la rama>` clasifica sola cada falla y **el
      veredicto lo escribe el script, no la sesión**.
      **Probado en las DOS ramas, con el experimento que estaba servido:** producción contra el
      informe de la rama sana → **exit 3**, *"6 fallas YA ARREGLADAS en la rama — falta PUBLICAR,
      no tocar código"*; producción contra **sí misma** → **exit 1**, *"6 fallas que TAMBIÉN
      fallan en la rama — esto sí es código"*. Sin esta segunda prueba el camino de "es código"
      podría no dispararse nunca y el gate sería decorativo.
      **Exit 3 y no exit 0 a propósito:** producción sigue rota para el lead, así que disfrazarlo
      de verde sería mentir; pero el trabajo no es de este carril, y el código propio lo dice sin
      esconderlo.
      **Medido hoy contra el contenedor `onia-landing`** (no Vercel, no `main`): la franja sigue
      viva en las 6 vistas, mirada en la captura (`/tmp/venta-0903/home-movil-390-pie.png`), y el
      build de esta rama sale **sin defecto medible**. Sigue esperando el deploy de Sergio
      (radar, sección 20).
      **Gates:** `typecheck` exit 0 · `vitest` **132 pasan (5 archivos)** · `build` exit 0.
      **Gates:** `typecheck` exit 0 · `build` exit 0 · suite **132 pasan (5 archivos)**.

      ⚠️ **Ese gate nació ciego en la HOME, y lo tapaba con un verde — corregido el 2026-09-03,
      con la medición.** Bajaba con **un solo** `window.scrollTo(0, scrollHeight)` + 700 ms, y
      `globals.css:194` tiene `scroll-behavior: smooth`: el scroll **anima**, y 14.569 px de
      home no entran en 700 ms. Medido contra producción en móvil-390: quedaba en
      `scrollY = 11299`, **a 2.426 px del fondo**. Ahí `elementFromPoint` devuelve el `DIV` de
      una sección cualquiera en vez de `BODY` — así que el gate **daba verde con la franja
      clara viva abajo** (73 px, exactamente el número que este mismo carril ya había medido a
      mano el día anterior). O sea: el instrumento nuevo declaraba sana la pantalla **más
      importante del sitio**, la primera que ve un lead.
      **Arreglado en `scripts/mirar-venta.mjs`**, y no sólo la causa de hoy:
      `bajarHastaElFondo()` usa `behavior: 'instant'` (mata la animación) y repite hasta que
      `scrollY` deja de moverse (cubre la página que crece al revelar contenido). Y sobre todo,
      la sonda ahora devuelve `faltaParaElFondo`: **si el gate no llegó al fondo, eso es una
      FALLA, no un verde.** Un instrumento que no pudo mirar no sabe, y "no sé" no es "está
      bien" — sin esa aserción, la próxima causa vuelve a producir un verde mentiroso.
      **Lo que destapó, en números:** contra el mismo producción de siempre pasó de **2 fallas
      a 6**. Las 4 que escondía son `home` en 320 · 390 · 768 (las tres, nunca vistas) y
      `empezar @ movil-320`. Capturas miradas: `/tmp/venta-rojo/home-movil-390-pie.png` — se ve
      el pie negro entero y **debajo la franja clara**.
      **Discrimina** (mismo comando, resultados opuestos): producción **ROJO exit 1 · 6 fallas**;
      build de esta rama **VERDE exit 0**.

      📮 **2026-09-03 — el deploy YA está pedido, con su número: `t_68671bc3` en el tablero,
      `blocked / needs_input`.** Hasta hoy el pedido vivía sólo en el radar, que es un doc que
      Sergio no lee desde el teléfono: por eso la franja llevaba **más de un día** viva en
      producción con el arreglo ya en `main` (`f0248601`, del 2026-09-02). El tablero sí le
      llega. **La próxima vuelta NO vuelve a preguntar** — mira `onia-tablero.sh list`; si
      `t_68671bc3` sigue `blocked`, el deploy sigue sin decidirse y la franja sigue viva.
      **Re-medido hoy con el instrumento arreglado, no heredado:** producción **6 fallas** en
      `home` y `empezar` × 320 · 390 · 768, mirada la captura
      (`/tmp/venta-0903/home-movil-390-pie.png`: pie negro y **debajo la franja clara**);
      el build de esta rama, servido en `127.0.0.1:3987`, **sin defecto medible**, y mirado
      también (`/tmp/venta-rama-0903/home-movil-390-pie.png`: el negro llega al borde).
      **Gates de hoy:** `tsc --noEmit` exit 0 · `vitest` 132 pasan (5 archivos) · `next build`
      exit 0, 32/32 páginas.

      ✅ **Los precios de las dos pantallas se verificaron hoy contra las DOS fuentes de verdad,
      y no hay deriva.** Se hizo porque la home imprime montos (`2.900 Bs/mes`,
      `implementación desde 3.500 Bs`) desde una copia — `src/lib/pricing.ts` de esta app — que
      vive en OTRO repo que el que manda, y nada la ataba. Contados uno por uno contra
      `onia-platform/lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`): Básico 320/89/3.200 ·
      Pro 750/199/7.500 · Full 1.500/–/15.000 · Grupo 2.900/–/29.000 — **los cuatro coinciden**.
      Add-ons contra `onia-platform/lib/pricing.ts`: chatbot 390/3.900, reservas 150, usuario
      extra 70 — **coinciden**. Ninguna pantalla define un número: la home los lee de
      `@/lib/pricing` (`page.tsx:4`).
      ⚠️ **Lo que queda sin dueño, y es un ítem para quien pueda cruzar de repo:** esa copia
      coincide **hoy, por disciplina, no por un gate**. Un cambio de precio en `onia-platform`
      no rompe nada acá: el sitio de venta seguiría publicando el número viejo mientras el
      checkout cobra el nuevo. Un test de esta app no lo puede atar (el otro repo no viaja al
      contenedor que sirve el sitio), así que el gate tiene que vivir del lado que tiene los dos
      árboles a la vista.

### Encontrado el 2026-09-02, corriendo el canario — no es zona de este carril

- [x] 🟡 ~~**El widget de chat (Chatwoot) responde 429 en `home` y `/empezar` — confirmado en vivo,
      dueño real es el carril chatbot/infra, no `web-factory/apps/onia-platform`.**~~
      **CERRADO el 2026-09-03 00:55 UTC por `onia-cola`: misma causa que el 🔴 de `/chatbot` —
      el 429 lo produce nuestro propio tráfico, no una caída.** Ver *"El 429 del widget era
      nuestro"* al final de esta cola.
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
      **↑ Re-medido en vivo el 2026-09-02 12:35 UTC por `onia-cola` (Gate 1). Sigue vivo y
      empeoró — pero la causa NO es la que dice arriba, y eso cambia cuál es el arreglo:**
      - **485 bloqueos en 24 h** (eran 262), y siguen siendo **exactamente dos IPs, las dos
        nuestras**: `192.223.122.70` (406, salida de los loops) y `187.77.16.63` (79, el VPS).
        **Cero IPs de terceros** — se confirma que ningún visitante real lo sufrió.
      - **Pero no es "el monitoreo en general": es una corrida puntual.** Repartidos por hora,
        **365 de los 485 (75%) caen en las horas 04 y 05 UTC** — la corrida del canario de las
        `04:41`. Las horas 08 y 10 tienen 7 y 9 bloqueos. `onia-mirar-cliente` corre cada 15 min
        y **no** produce ese volumen. Una sola pasada del canario genera **cientos** de pedidos a
        `/widget`: el defecto no está en el umbral de Chatwoot, sino en que nuestro canario
        martilla un endpoint de terceros.
      - **El contenedor NO tiene ninguna env var de rate limit** (`docker inspect` filtrado por
        rack/limit/throttle sale vacío): usa el default del código de Chatwoot. O sea que "subir
        el umbral" **exige reiniciar el contenedor**, el mismo que hospeda la bandeja de los 7
        leads. **Eso necesita OK de Sergio** — no es una traba, es la regla de no desplegar al
        VPS sin permiso.
      - Reproducción: con el token real, tres GET seguidos dan **200, 200, 429**. ⚠️ **No puedo
        afirmar que el umbral sea 3**: la misma IP corre `onia-mirar-cliente` cada 15 min y no
        controlé el estado de la ventana. Lo honesto es "tripa rápido", no un número.
      **Qué cambia para quien lo tome:** el arreglo barato y sin permiso es **que el canario deje
      de pedir el widget** — es nuestro repo (`scripts/canario_visual.mjs`, carril
      `canario-visual`), no producción. Tocar Chatwoot es el arreglo caro y sólo hace falta si se
      prueba que un visitante real lo sufre; hoy la evidencia dice que no.
      **No lo tomo yo:** el archivo es del carril `canario-visual`, cuyo loop corre a las 16:41 UTC.

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

### Auditoría del escalón 2 — 2026-09-02 15:35 UTC, `onia-cola`

- [x] **Los `[x]` resisten, y el defecto estaba en el MÉTODO de auditarlos — ARREGLADO en la
      misma vuelta.** La cola no tenía un ítem propio: los dos abiertos de "Ahora" son de otros
      carriles (el 429 de Chatwoot es de `canario-visual`, que corre 16:41) y "Después" está
      entero en `[x]`. Así que escalón 2.
      **Lo auditado, contra el código de HOY, y salió limpio:** las 53 citas `archivo:línea`
      únicas del archivo — ninguna pasada de fin de archivo — y **miradas** las cinco de más
      riesgo (`lib/platform/types.ts:73`, `lib/onia-core/modules/agents-runtime.ts:1188`,
      `components/layout/navigation.ts:45`, `lib/platform/vertical-pack.ts:169`,
      `app/(dashboard)/admin/organizations/[id]/capacidades/CapacidadesOrg.tsx:31`): las cinco
      caen exactamente donde el ítem dice. Ningún cierre falso.
      **El defecto real, y es de método:** este loop ya gastó **dos vueltas** comprobando a mano
      "los 24 shas citados existen y los que se declaran ancestros lo son". Esta vuelta lo hizo
      con un script de usar y tirar que **tenía un bug**: clasificaba
      `"EXISTE-PERO-NO-EN-BASE"` con `.includes("EN-BASE")`, que da **true**, y por eso dio por
      bueno `6d8b6b7` — el sha que este mismo archivo documenta como NO ancestro de
      `origin/master`. Una auditoría que se rehace a mano cada vuelta se hace mal alguna vuelta.
      **El arreglo, en el gate que este carril ya corre antes de cada ítem**
      (`scripts/verificar_cola.js`): verificaba que el **archivo** citado existiera y daba por
      buena la otra mitad de la evidencia. Ahora verifica también que el **commit** citado
      exista, con `git cat-file --batch-check` (una llamada por repo, no una por sha: el gate
      sigue en **0,12 s**).
      **Lo que lo mantiene honesto, que es el punto:** tres recíprocos. Un sha que resuelve no
      molesta; los tres duplicados locales que la cola cita a propósito van en
      `SHAS_SIN_REPO_A_PROPOSITO` con su motivo — sin esa lista el gate salía **rojo de
      fábrica**, el anti-patrón que este archivo ya documenta tres veces —; y si uno de esos
      **empieza** a resolver, se marca `excepcion-sha-vencida`, así la lista no envejece en
      silencio tapando un fantasma de verdad.
      **Y el mismo bug de substring casi entra al gate:** `git cat-file --batch-check` responde
      `6edfab6^{commit} missing`, o sea que la palabra "commit" está **también** en la línea del
      fallo. Se compara el **campo**, no el substring.
      **Descartado a propósito, y queda escrito para que nadie lo reabra:** un detector de
      deriva *semántica* (¿el símbolo que el ítem nombra sigue cerca de la línea citada?).
      Probado: marca 16 citas y **casi todas son falsas** — toma símbolos del párrafo vecino.
      Un gate que sale rojo de fábrica se saltea; se midió antes de descartarlo, no se supuso.
      **Medido:** `--self-check` **65 casos** (7 nuevos, y los tres portantes verificados en
      ROJO **por su mensaje exacto** desactivando cada regla en una copia); el gate sobre
      `hermes-content/docs/COLA.md` **exit 0, 21 ítems**; `hermes-content/docs/cola/chatbot.md` verde; las otras
      colas dan el mismo `cola-vacia` que antes (no es regresión de esto); `npm test` exit 0.

### Encontrado el 2026-09-02 16:34 UTC, `onia-cola` — ARREGLADO en la misma vuelta

- [x] **El worktree principal NO podía abrir una sola pantalla: Playwright pedía un Chromium que
      no estaba bajado. La regla nº1 del proyecto ("verificar es MIRAR") era inejecutable desde
      acá — ARREGLADO y con guarda.**
      **Cómo apareció:** no lo buscaba. Fui a medir en vivo el 429 de Chatwoot (ítem de más
      arriba) con un Playwright de usar y tirar, y murió antes de abrir el navegador:
      `browserType.launch: Executable doesn't exist at`
      `/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`.
      **La deriva, medida:** `package.json:5` declara `playwright ^1.62.1`;
      `/root/loops/onia-hermes/node_modules/playwright` tenía **1.62.1** (instalado el 2026-09-02
      02:39), que pide la revisión **`chromium-1234`**. En la caché de navegadores de Playwright del VPS sólo estaban
      bajadas `chromium-1223` y `chromium_headless_shell-1223` — las de Playwright **1.60.0**.
      **Por qué el canario seguía verde igual, y por qué eso era lo peligroso:** su worktree
      `/root/loops/onia-hermes-canario` **no tiene `node_modules` propio**, así que resolvía al
      Playwright **1.60.0** de `/root/node_modules` — un paquete instalado a mano, fuera del repo,
      que nadie versiona. El canario andaba **por accidente de resolución**: un `npm install` en
      ese worktree lo mataba en silencio. Es el mismo modo de falla que
      `hermes-content/docs/cola/loops.md` documenta dos veces (algo que corre porque hay una copia
      hand-editada en el VPS), sólo que acá la víctima era la verificación misma.
      **El arreglo:** `npx playwright install chromium` desde el repo — baja la revisión que pide
      la dependencia **declarada**, así el repo deja de depender del `/root/node_modules` global.
      114,7 MiB, sin plata, sin deploy. Quedan bajadas las dos revisiones (`chromium-1223` y
      `chromium-1234`) y las dos funcionan; disco después: 137G/193G usados.
      **Verificado, no supuesto:** el mismo comando que tiraba `Executable doesn't exist` ahora
      abre `https://onia.com.bo/` y devuelve datos.
      **La guarda, para que no vuelva en silencio** — `scripts/canario_mirable.mjs`, cableado a
      `npm test` como `test:canario-mirable` (`package.json`):
      - **Lanza y cierra Chromium de verdad** con las mismas opciones del canario, en vez de
        comparar números de revisión contra las carpetas de la caché. Un `grep` sirve para
        descartar, nunca para confirmar; y un proxy acierta el caso de ayer y falla el de mañana
        (permisos, librería del sistema, binario a medio bajar). Cuesta ~2 s: `npm test` entero
        pasó de 7 s a **9 s**, exit 0.
      - **No sale rojo de fábrica** — el anti-patrón que este archivo ya documenta tres veces. Sin
        Playwright instalado **saltea en VERDE** diciendo por qué (sin Playwright el canario no
        corre de todos modos, y eso es otro problema). Sólo se pone rojo en la condición real de
        deriva: **Playwright presente y su navegador ausente.**
      - **Recíproco que evita que el guard envejezca mintiendo:** lee `channel: 'chromium'` del
        **cuerpo** de `opcionesDeChromium` en `scripts/canario_visual.mjs` y se pone ROJO si
        desaparece — si no, estaría probando un binario que el canario ya no usa. Lee el cuerpo y
        no todo el archivo a propósito: la palabra `channel` aparece también en los comentarios
        que explican por qué NO hay que sacarla.
      - **Distingue el remedio:** `navegador-no-instalado` manda a `npx playwright install
        chromium`; un fallo de sandbox sale como `navegador-no-arranca` y **no** manda a
        reinstalar al pedo.
      **Medido:** `--self-check` **12 casos** (incluidos los tres portantes) y —lo que de verdad
      importa— **el guard probado en ROJO por la condición REAL**, no sólo en el test unitario:
      con `PLAYWRIGHT_BROWSERS_PATH` a un directorio vacío sale `exit 1` con el mensaje exacto
      `canario-mirable: ROJO (navegador-no-instalado)`. `npm test` completo **exit 0**.

- [x] **De paso quedó medida la causa del 429 de Chatwoot — y el ítem que lo reporta está
      dirigido a un carril que NO puede tomarlo.**
      **La medición que faltaba** (con el Playwright ya arreglado, contra `https://onia.com.bo/`):
      **una sola pantalla dispara 24 pedidos** a
      `onia-chatbot-chatwoot.hqdqgh.easypanel.host` — prácticamente tantos como al propio sitio
      (25). Con ~6 pantallas de `onia.com.bo` por pasada × 4 pasadas/día, dan los "cientos de
      pedidos" que el ítem de arriba dedujo por los logs, ahora contados del lado del navegador.
      En esta corrida los 24 volvieron **200**: la ventana de Rack::Attack se había reseteado, lo
      que confirma que el 429 es **autoinducido e intermitente**, no una caída del servicio.
      **Y el hallazgo que traba el ítem, verificado leyendo los prompts que corren HOY**
      (`/root/bin/loops/*.md`): el ítem cierra con *"No lo tomo yo: el archivo es del carril
      `canario-visual`"* — pero ese loop **no puede tomarlo por construcción**, por dos razones
      independientes:
      1. **No lee `hermes-content/docs/COLA.md`.** Su prompt sólo nombra `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` y
         `cola/loops.md` (los otros seis loops sí nombran su cola). Nunca va a ver el ítem.
      2. **Aunque lo viera, tiene prohibido arreglarlo.** Su propio prompt lista *"Arreglar el
         defecto que encontrás"* entre sus PROHIBICIONES: escribe ítems en la cola del dueño y
         sigue. Es un **productor puro, sin bandeja de entrada**.
      **El costo, contado:** el ítem ya consumió tres vueltas de `onia-cola` (12:35 lo re-midió,
      15:35 lo saltó, 16:34 lo saltó otra vez) esperando a un destinatario que no existe. Es la
      misma forma del agujero que este carril ya pagó dos veces —un carril que nadie enumera no
      se cuenta nunca—, sólo que al revés: un ítem que nadie puede leer no se hace nunca.
      **No lo cierro yo esta vuelta** (una vuelta cierra UN ítem, y ya cerré el de Playwright).
      Queda con su evidencia para que la próxima vuelta lo tome **sin volver a derivarlo**, y con
      una línea en el radar, porque "un loop productor sin bandeja" es diseño del sistema de loops
      y eso lo decide Sergio.

### Del canario visual — corrida del 2026-09-02 16:41 UTC (diez pantallas)

- [x] 🔴 ~~**El widget de chat de `/chatbot` está caído: devuelve 429 y ya no carga. La página que
      VENDE el chatbot es la única del sitio sin chat.**~~ **CERRADO el 2026-09-03 00:55 UTC por
      `onia-cola`: el 429 es REAL pero NO es del cliente — es nuestro.** El titular era falso en
      su mitad más cara ("la página que vende el chatbot es la única sin chat"): un visitante
      real abre el chat normal. Medición completa en la sección *"El 429 del widget era nuestro"*
      al final de esta cola.
      - **Qué se rompió:** `https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/widget?website_token=9k5i7xnAgCbSse1EZwVChZLw`
        responde **429**. El host es el Chatwoot propio, no Cloudflare de `onia.com.bo`.
      - **Esto cierra la duda que dejó abierta la pasada de las 04:41 UTC** (líneas 604-612), con
        su propio criterio: *"si un loop futuro lo ve fresco, sin haber golpeado el sitio antes,
        ahí sí es un ítem"*. Hoy lo vio la **corrida oficial única**, que fue lo PRIMERO que
        ejecutó esta vuelta — cero requests previas al sitio. Criterio cumplido.
      - **Evidencia nueva que aquella pasada no tenía — el peso:** `chatbot-landing` cayó de
        **2.232 KB (baseline de ayer, con `erroresConsola: []`) a 449 KB**, tres corridas
        seguidas. Son ~1,8 MB que faltan: es el bundle del widget que ya no baja. El widget
        cargaba ayer y hoy no. Un `-80 %` de peso **no dispara umbral** (sólo miramos subidas
        > +40 %) — se ve mirando, que es de lo que se trata.
      - **Confirmado fuera del navegador:** tres `curl` planos seguidos al endpoint → `429`,
        `429`, `429`. No es artefacto de Playwright ni de mis corridas repetidas.
      - **Por qué importa comercialmente:** el visitante que llega a la página del chatbot para
        preguntar por el chatbot no encuentra dónde escribir. Es la burbuja de chat ausente en la
        esquina inferior derecha de la captura.
      - **Sospecha para el que lo tome (no verificada, no la reporto como hecho):** un 429 propio
        del Chatwoot huele a rate-limit del contenedor. El VPS le pega cada hora con
        `hermes-content/deploy/vps-ops/chatwoot-brand-onia.sh` (cron minuto 17, desplegado en
        `/root/bin/`) además del motor del bot. **No lo toqué**:
        contenedores y crons ajenos no son de este carril.
      **Evidencia:** `hermes-content/docs/historial/canario-visual/2026-09-02-chatbot-landing.png`
      — 449 KB / 684 ms / status 200 / `erroresConsola: ["…status of 429"]`.

- [ ] 🟠 **La captura full-page de este canario es CIEGA en bandas enteras, y hoy se comió la
      banda de precio de `/chatbot`.** Defecto de la herramienta propia
      (`scripts/canario_visual.mjs`), no del sitio. Lo dejo escrito, no arreglado: se me acabó
      la vuelta.
      - La pasada de las 04:41 UTC ya lo había visto en `rubros` y `contacto` (líneas 593-599) y
        lo cerró como "artefacto conocido". **Hoy demuestra ser peor que un artefacto cosmético:**
        en `/chatbot` la banda verde que salió vacía es la que dice **"Bs 390/mes, sin
        instalación"** — el precio publicado, en el proyecto cuyo fallo mejor documentado es
        "cuatro precios vivos del mismo chatbot". El canario existe para MIRAR precios y
        justamente ahí no ve.
      - **Verificado que el sitio está sano:** el `<h2>` "Lo que necesitás vos" mide
        `opacity: 1`, `visibility: visible`, 542×25 px en `top: 2083`. Llevado al viewport y
        capturado sin `fullPage`, todo el contenido aparece perfecto.
        Prueba: `…/2026-09-02-chatbot-landing-viewport-precio.png`.
      - **Intento fallido (para no repetirlo):** el commit `bed8b9a1` agregó un scroll por tramos
        antes de capturar y **no alcanza**. También probé inyectar
        `*{content-visibility:visible !important; contain-intrinsic-size:auto !important}`
        antes del `screenshot({fullPage:true})` — **tampoco**: las bandas siguen vacías. La causa
        no es `content-visibility` ni la falta de scroll.
      - **Siguiente paso sugerido:** abandonar `fullPage` y capturar por viewports sucesivos,
        cosiendo las imágenes. Es el método que ya se sabe que funciona (es como se sacaron las
        dos capturas de prueba de hoy y la de ayer).
      - **Mientras tanto, una banda vacía en una captura de este canario NO prueba nada** — ni que
        el sitio esté roto ni que esté bien. Hay que ir al viewport.

- [ ] 🟢 **Las otras nueve pantallas: sin disparo mecánico y sin defecto nuevo a la vista.**
      Pesos/tiempos de hoy: home 2.857 KB/367 ms · precios 2.108 KB/803 ms · empezar 2.253 KB/464 ms ·
      rubros 2.587 KB/377 ms · contacto 322 KB/429 ms · register 704 KB/456 ms ·
      login-plataforma 699 KB/457 ms · login-chat 3.499 KB/1.249 ms.
      `panel-chatbot` 702 KB/440 ms **redirige a `/login` sin sesión: queda "no medida", no "OK"**.
      **Ninguna baseline se actualizó esta vuelta.** La de `chatbot-landing` (2.232 KB) se deja
      intacta a propósito: pisarla con los 449 KB de hoy taparía el ítem del widget caído.
      **Evidencia:** `hermes-content/docs/historial/canario-visual/2026-09-02-home.png` ·
      `hermes-content/docs/historial/canario-visual/2026-09-02-rubros.png`; baselines sin tocar en
      `hermes-content/references/canario-visual/chatbot-landing/baseline.json`.

### Del canario visual — corrida del 2026-09-02 21:41 UTC (diez pantallas, sin ítems nuevos)

- [x] 🔴 ~~**Los dos ítems 🔴/🟠 de arriba (widget de `/chatbot` caído y captura full-page ciega)
      siguen exactamente igual, 5 horas después.**~~ **La mitad del widget quedó CERRADA el
      2026-09-03 (era nuestro propio tráfico); la mitad de la captura full-page ciega SIGUE
      ABIERTA y es un defecto real — está en el 🟠 de arriba.** Confirmación de entonces, que
      ahora se lee como lo que era (el canario fotografiando su propia huella):
      - `chatbot-landing` sigue en **331 KB / status 200 / `429`** (era 449 KB a las 16:41 UTC —
        sigue faltando el bundle del widget, no hay burbuja de chat visible en la captura). Tres
        pantallas más (`precios`, `rubros`) SÍ muestran la burbuja verde flotante del widget
        propio del sitio — el 429 es específico de `/chatbot`, no del sitio entero.
      - La banda de precio "Bs 390/mes" de `/chatbot` sigue vacía en la captura full-page (mismo
        artefacto ciego, no arreglado).
      - Home y `/empezar` siguen mostrando el rediseño *"Cerrás vos. El negocio no."* / "Creá tu
        cuenta" en vez del copy de la baseline vieja ("Pedí tu acceso"). Sigue sin dueño.
      **Las otras siete pantallas, sin novedad.** Pesos de hoy: home 2.362 KB/486 ms · precios
      2.109 KB/317 ms · empezar 2.104 KB/300 ms · rubros 2.362 KB/329 ms · contacto 322 KB/160 ms ·
      register 704 KB/161 ms · login-plataforma 696 KB/119 ms · login-chat 3.500 KB/954 ms ·
      panel-chatbot 702 KB/215 ms (redirige a `/login`, sigue "no medida"). Ninguna baseline
      tocada.
      **Evidencia:**
      `hermes-content/docs/historial/canario-visual/2026-09-02-chatbot-landing-2141utc.png`
      (331 KB, la esquina inferior derecha sigue sin burbuja de chat) ·
      `hermes-content/docs/historial/canario-visual/2026-09-02-chatbot-landing-viewport-precio.png`
      (la misma banda de precio, capturada por viewport, SÍ se ve).

### El 429 del widget era nuestro — 2026-09-03 00:55 UTC, `onia-cola`

- [x] **El 429 del widget de Chatwoot es REAL, y NO es una caída: se lo hace el VPS a sí mismo.
      Cerró tres ítems (🟡 de `home`/`empezar`, 🔴 de `/chatbot`, 🔴 de confirmación) que juntos
      consumieron cuatro vueltas.**
      **La causa, leída del código que corre** — el initializer de Rack::Attack, línea 176,
      **dentro del contenedor `onia-chatbot_chatwoot` (no en este repo)**: Chatwoot limita
      `/widget` **sin**
      `cw_conversation` a **5 cargas por hora POR IP**. No tiene variable de entorno propia — el
      único interruptor es `ENABLE_RACK_ATTACK_WIDGET_API`, que apaga el grupo entero.
      **Por qué el titular era falso.** El ítem decía *"la página que VENDE el chatbot es la
      única del sitio sin chat"*, y eso vale sólo para nosotros:
      - El servicio **no está caído**: `/`, `/api` y `/packs/js/sdk.js` responden **200**; sólo
        `/widget` da 429. Un host sano con una regla puntual, no un contenedor muerto.
      - **El contador está a nombre de UNA sola IP: `187.77.16.63`, la del propio VPS**, con 21→34
        cargas contra un límite de 5. Leído en Redis, que es donde Rack::Attack lo guarda (una
        clave por IP): `velma:rack::attack:<ventana>:widget?...:187.77.16.63`.
      - **En 6 h hubo 222 peticiones a `/widget` y las 222 son de esa misma IP.** Cero visitantes
        reales. 207 de 232 iban sin `cw_conversation`, o sea que **gastaban cupo**. Los picos
        caen en las corridas de nuestros loops (el de 21:41 es el canario).
      - Cada visitante real cuenta con **su** IP y **su** cupo, así que su chat abre normal.
      **Instrumento verificado, no supuesto** (la trampa que este archivo ya documenta): probé
      falsear la IP con `X-Forwarded-For: 203.0.113.77` y **no** apareció una clave nueva — el
      proxy sobrescribe la cabecera con la IP real del socket. Eso prueba justamente lo que hacía
      falta: Chatwoot ve IPs de visitante de verdad, no una IP de proxy compartida. Si las
      colapsara, ahí sí un cliente podría comerse el 429 de otro.
      **Es el mismo modo de falla que el canario ya pagó con el rasterizador:** el instrumento
      mide su propia huella y la reporta como una caída del producto. La diferencia es que esta
      vez el 429 existía — lo falso era de quién.
      **El arreglo, para que no se re-derive nunca más:**
      `hermes-content/deploy/vps-ops/widget-429-de-quien.sh` — contesta en segundos con el
      contador y el desglose de IPs a la vista. **Probado en los dos sentidos**, que es lo que lo
      hace confiable: con la IP real da `AUTOINDUCIDO`; forzando `ONIA_VPS_IP=10.0.0.99` las 234
      peticiones pasan a ajenas y sale `OJO: … puede haber clientes afectados`. Una sonda que
      sólo sabe decir "es nuestro" no sirve para el día en que no lo sea.
      **Lo que NO hice y es de Sergio:** safelistear la IP del VPS
      (`RACK_ATTACK_ALLOWED_IPS=187.77.16.63`) es un cambio de entorno del contenedor de chat en
      producción, con reinicio — no se toca sin su OK. Cotizado en
      `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md`.
      **Queda ABIERTO y no lo toqué:** el 🟠 de la captura full-page ciega. Ese sí es un defecto
      real de `scripts/canario_visual.mjs`, con causa distinta y dueño distinto.

### Del canario visual — corrida del 2026-09-03 00:43 UTC (diez pantallas)

- [ ] 🔴 **El widget de chat de Chatwoot sigue caído (429), y hoy la corrida oficial lo vio en
      LAS CINCO pantallas de `onia.com.bo`, no solo en `/chatbot`. Corrige el ítem de las 21:41
      UTC de ayer, que decía "el 429 es específico de `/chatbot`, no del sitio entero" — hoy ya
      no es así, si es que alguna vez lo fue.**
      - **Evidencia de la corrida oficial única** (`node scripts/canario_visual.mjs`, primer
        comando de la vuelta, cero requests previos al sitio): `home`, `precios`, `empezar`,
        `rubros` y `chatbot-landing` — las cinco — dispararon `ITEM` por
        `error de consola nuevo: Failed to load resource: the server responded with a status of
        429 ()`.
      - **Confirmado sin ambigüedad de "corrida propia repetida"** (la duda que dejó abierta la
        pasada de las 04:41 UTC de ayer, líneas 604-612): corrí `home` y `precios` cada una SOLA,
        en procesos Playwright nuevos, con 15-20 s de espera antes, escuchando el evento
        `response` en vez de la consola. Las dos pegan al mismo endpoint y las dos dan 429:
        `https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/widget?website_token=9k5i7xnAgCbSse1EZwVChZLw`.
        Un `curl` plano y frío al mismo endpoint, aislado de cualquier corrida: también 429.
      - **Evidencia de peso — hoy es mucho más claro que ayer:** las cuatro páginas con
        baseline de peso comparable cayeron **todas** más del 75 % contra su baseline (ninguna
        dispara umbral: sólo miramos subidas > +40 %, se ve mirando):
        home 2.366→**580 KB**, precios 2.159→**327 KB**, empezar 2.497→**323 KB**,
        rubros 2.650→**495 KB**. Es el mismo patrón que ya se había visto en `chatbot-landing`
        (2.232 KB → 324 KB hoy): falta el bundle del widget en las cinco, no en una.
      - **Mirado en las capturas:** ninguna de las cinco muestra la burbuja de chat flotante
        (verde) en la esquina inferior derecha. El resto del contenido de las cinco está sano —
        home, precios, empezar y rubros con su copy y sus precios (`Bs 390/mes` visible completo
        en `/precios`) correctos a la vista.
      - **No lo toqué**: contenedor y cron del widget son ajenos a este carril (ver la sospecha
        de rate-limit del contenedor, ya anotada ayer 16:41 UTC).
      - **Van ~8 horas de caída** (primera detección 2026-09-02 16:41 UTC, confirmada 21:41 UTC,
        confirmada de nuevo y ampliada ahora 2026-09-03 00:43 UTC). Sin dueño declarado (vive en
        `web-factory/apps/onia-platform/`).
      **Evidencia:** capturas de hoy (foto de un día, no baseline) en
      `hermes-content/docs/historial/canario-visual/2026-09-03-{home,precios,empezar,rubros,chatbot-landing}.png`.

- [ ] 🟠 **La captura full-page ciega (ya reportada 2026-09-02) sigue igual en `rubros`.** Banda
      completa en blanco entre el hero y la sección oscura, y la sección oscura sin texto visible
      en la captura full-page. Mismo artefacto conocido de la herramienta propia
      (`scripts/canario_visual.mjs`), no del sitio — no lo duplico como ítem nuevo, lo confirmo
      vivo. Nadie lo tomó todavía.

- [ ] 🟢 **Las otras cinco pantallas: sin disparo mecánico y sin defecto nuevo a la vista.**
      Miradas una por una: `contacto` (322 KB/104 ms, formulario y CTAs completos),
      `register` (705 KB/153 ms, asistente de 2 pasos con 5 rubros, íconos legibles),
      `login-plataforma` (696 KB/128 ms, íconos legibles, "Pedí tu acceso" presente),
      `login-chat` (3.499 KB/925 ms, formulario Chatwoot normal — este SÍ es el chat propio de
      Onia, no el widget embebido del sitio, y no está caído),
      `panel-chatbot` (702 KB/228 ms, redirige a `/login` sin sesión: queda "no medida", no "OK",
      como corresponde). **Ninguna baseline se tocó esta vuelta** — pisar la de las cinco páginas
      afectadas taparía el ítem del widget caído, igual que ayer con `chatbot-landing`.

### Del canario visual — corrida del 2026-09-03 ~03:41 UTC (diez pantallas)

- [x] 🟠 **El ítem de "captura full-page ciega" (abierto 2026-09-02, confirmado vivo en
      `rubros` a las 00:43 UTC) tenía causa raíz en la propia herramienta, y ya está
      arreglada.** `scripts/canario_visual.mjs` scrolleaba con 120 ms por paso y 400 ms de
      espera final antes de la captura — insuficiente para las animaciones "aparece al
      entrar en vista" del sitio (framer-motion `whileInView` con `delay`).
      - **Reproducido aislado:** con esos mismos tiempos, la tarjeta de add-on de WhatsApp
        de `/precios` ("No pierdo al que escribe", Bs 390/mes) salía completamente en
        blanco en la captura — la sección entera parecía vacía. Con 300 ms/800 ms la misma
        tarjeta aparece completa, con precio, nota de IVA y CTA.
      - **Confirmado que el DOM SÍ tenía el contenido** con los tiempos viejos
        (`opacity:1`, `w:1184 h:344` medido con `getComputedStyle`+`getBoundingClientRect`):
        no era el sitio devolviendo menos HTML, era la captura tomada antes de que la
        animación terminara.
      - **Arreglé el script** (`scripts/canario_visual.mjs`, scroll a 300 ms/paso + 800 ms
        final) y corrí `--self-check`: **13 casos en verde**.
      - **Re-corrida completa después del arreglo:** `rubros` ahora muestra las 5 filas de
        "La misma base, con las palabras de tu negocio" (antes: banda vacía) y `precios`
        muestra la tarjeta de WhatsApp completa. El resto del contenido de las 10 pantallas
        sigue sano.
      - **No toqué las baselines de `home`, `precios`, `empezar`, `rubros`:** la única
        diferencia visible ahora contra esas baselines es que el widget de Chatwoot (429,
        ítem de abajo) sigue sin aparecer — pisar la baseline ahora horneraría "sin widget"
        como el estado normal, exactamente lo que ya se evitó con `chatbot-landing` el
        2026-09-02. Se retoman cuando ese ítem cierre.

- [x] 🔴 ~~**El widget de Chatwoot sigue caído (429) en las 5 páginas de `onia.com.bo`, y la
      sonda oficial confirma que NO es sólo tráfico propio: hay IPs ajenas pegándole.**~~
      **FALSO, y la culpa era de la sonda — ARREGLADA 2026-09-03 05:35 UTC, `onia-cola`.**
      El titular se apoyaba en *2 peticiones ajenas de 288*, y ninguna de esas dos IPs llegó
      nunca al límite. Medido en vivo hoy: `/widget` responde **HTTP 200**, contador en 2 de 5,
      y **287 de 289 peticiones (99 %) salen del propio VPS**. Un visitante real abre el chat
      sin problema — Rack::Attack cuenta **una clave por IP**, así que la única forma de que
      un cliente vea el 429 es que **su propia IP** llegue a 5/hora. Nunca pasó.
      **De quién es la huella, medido por minuto** (`docker logs` del contenedor de chat):
      ráfagas en `:48–:56` de **cada** hora, de 10 a 14 cargas — el loop `web-venta`, que abre
      las 5 páginas cada hora — y en `:41`, el canario. Con 5/hora por IP, **cada corrida se
      autolimita sola** y deja el cupo quemado para el loop siguiente.
      **La causa de que esto se reabriera cinco veces era el instrumento, no el sitio.**
      `hermes-content/deploy/vps-ops/widget-429-de-quien.sh` decidía por el código HTTP
      **del instante**, y el throttle es
      intermitente (ventana de 1 h): contestaba distinto según el minuto en que se la corriera.
      Dos defectos, los dos empujando al mismo error caro:
      - **falso negativo** — widget en 200 ⇒ *"nada que diagnosticar"*, tirando a la basura las
        286 peticiones propias que ya estaba mostrando dos líneas más arriba;
      - **falso positivo** — contaba **peticiones** ajenas en vez de **IPs ajenas que llegaran
        al límite**, así que 2 visitas legítimas gritaban *"puede haber clientes afectados"*.
        De ahí salió, textual, este ítem.
      **El arreglo:** la decisión se mudó a `scripts/veredicto_widget.mjs` — función pura, con
      `--self-check` y **dentro de `npm test`** (`test:veredicto-widget`). Los tres casos que
      importan fallaban en ROJO contra la lógica vieja (3 de 4) y pasan con la nueva. Sigue
      sabiendo salir positivo: una IP ajena que llega al límite da `CLIENTES-AFECTADOS` y la
      nombra — una sonda que sólo sabe decir "es nuestro" no sirve para el día en que no lo sea.
      **Lo que NO cambió y sigue siendo de Sergio:** safelistear la IP del VPS
      (`RACK_ATTACK_ALLOWED_IPS=187.77.16.63`) para que el canario vuelva a ver lo que ve un
      cliente. Es un cambio de entorno del contenedor de chat en producción, con reinicio.

- [x] ~~🔴 **Titular original, conservado para no perder de dónde salió:**~~
      Corrida oficial (`node scripts/canario_visual.mjs`): `home`, `precios`, `empezar`,
      `rubros`, `chatbot-landing` — las cinco — con `error de consola nuevo: ... status of
      429 ()`. Mismo patrón de peso que ayer (bundle del widget ausente): home 580 KB,
      precios 327 KB, empezar 325 KB, rubros 746 KB, chatbot-landing 326 KB.
      - **Corrí la sonda que pide el CLAUDE.md antes de escribir esto**
        (`sh /root/loops/onia-hermes/hermes-content/deploy/vps-ops/widget-429-de-quien.sh`),
        para no repetir el error de la vuelta anterior que dio este mismo 🔴 por AUTOINDUCIDO
        sin poder salir negativo. Esta vez el veredicto es distinto:
        ```
        == 2. ¿A nombre de QUÉ IP está el contador del throttle? ==
           190.180.28.134     1 cargas (el límite es 5/hora)
           187.77.16.63       15 cargas (el límite es 5/hora)
        == 3. ¿Quién pidió /widget en las últimas 6 h? ==
           187.77.16.63       284 peticiones
           192.223.122.70     1 peticiones
           190.180.28.134     1 peticiones
        VEREDICTO: OJO: 2 peticiones vinieron de IPs ajenas.
        ```
      - Lectura: el throttle de la hora actual lo agota casi entero nuestro propio VPS
        (187.77.16.63, con 15 de las 5 permitidas — las corridas repetidas del canario y de
        otros carriles lo saturan), pero en las últimas 6 h hubo 2 peticiones de IPs que no
        son nuestras ni conocidas. Ninguna de esas 2 IPs ajenas llegó sola a las 5 cargas/hora
        que dispararían SU propio 429 — así que hoy el 429 que ve un visitante real depende de
        si comparte ventana de una hora con nuestro propio tráfico, no de que el visitante
        mismo se autolimite.
      - **No lo toqué**: contenedor y cron del widget son ajenos a este carril, sigue sin
        dueño declarado (vive en `web-factory/apps/onia-platform/`). Van ~11 horas de caída
        (primera detección 2026-09-02 16:41 UTC).
      **Evidencia:** capturas de hoy en
      `hermes-content/docs/historial/canario-visual/2026-09-03-{home,precios,empezar,rubros,chatbot-landing}.png`.

- [ ] 🟢 **Las otras cinco pantallas: sin disparo mecánico y sin defecto nuevo a la vista.**
      `contacto` (322 KB/158 ms), `register` (707 KB/178 ms, 5 rubros con íconos legibles),
      `login-plataforma` (696 KB/98 ms, "Pedí tu acceso" presente), `login-chat`
      (3.500 KB/928 ms, formulario Chatwoot propio, no está caído), `panel-chatbot`
      (699 KB/114 ms, redirige a `/login` sin sesión: "no medida", no "OK"). Ninguna
      baseline tocada.

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

      **↑ Auditado el 2026-09-02 15:00 UTC por `onia-cola` (escalón 2): este `[x]` estaba FALSO
      contra el código de hoy — RE-ARREGLADO en la misma vuelta.** El cierre decía "sale
      **verde, exit 0, 16 ítems**"; corrido hoy salía **exit 1 con 12 ERROR**, y los doce eran
      falsos otra vez. **No se revirtió nada: el ítem envejeció.** Los carve-outs de la tanda
      anterior siguen intactos; lo que cambió es la cola, que sumó tres formas de citar que el
      detector no conocía. Es la misma lección que este archivo ya guarda dos veces: **un cierre
      describe el repo del día en que se escribió.** Un gate que vuelve a salir rojo de fábrica
      se vuelve a saltear, y el prompt de este carril manda correrlo antes de tomar cada ítem.
      **Las tres caras nuevas, cada una con su recíproco en el `--self-check`:**
      - **Cita abreviada con elipsis** (`…/2026-09-02-mismo-html-chromium-real-login.png`, 3 de
        los 12): el archivo **existe** —en `hermes-content/docs/historial/canario-visual/`—; lo
        que no existe es esa forma de escribirlo. Medido: ningún archivo de los dos repos tiene
        `…` ni `...` en el nombre. Recíproco: sin la elipsis, la ruta se sigue verificando.
      - **Nombre de rama** (`claude/canario-visual`, 1 de los 12): una rama no es un archivo.
        Medido: no hay ninguna carpeta `claude/` en los dos repos.
      - **Ruta parcial con barra** (`(sitio)/opengraph-image.tsx` y 5 más, 6 de los 12): el sitio
        de venta cita relativo a `src/app/`, y ni el repo ni `APPS_DEL_REPO` lo resolvían porque
        **el prefijo que falta es intermedio**. Ahora cuenta si algún archivo del repo *termina*
        en esa ruta, cortando en límite de segmento. **No afloja el gate**: sigue exigiendo que
        el archivo exista, sólo deja de exigir el prefijo entero.
      **Lo que NO se aflojó, a propósito:** la resolución por sufijo se aplica **sólo con barra**.
      Los otros 2 de los 12 eran `page.tsx` y `sitemap.ts` **sueltos**, y entre los cientos que
      hay en el repo esa cita no identifica ningún archivo. Se arregló **la cita**, no el
      detector: ahora dicen `(sitio)/page.tsx` y `src/app/sitemap.ts`.
      **Medido:** `--self-check` **58 casos** (9 nuevos, los 9 en ROJO antes del cambio y el
      primero verificado por su mensaje exacto); el gate sobre `COLA.md` **exit 0, 20 ítems**;
      un ítem inventado que cita `lib/esto-no-existe-jamas.ts` **sigue saliendo fantasma**;
      `npm test` exit 0.
      **Un defecto de test cazado de paso, que valía la pena:** el índice de archivos se cachea
      por carpeta la primera vez que un sufijo lo necesita, así que un fixture creado *después*
      en esa misma carpeta no se veía y el caso nuevo daba rojo con el detector ya correcto.
      Se le dio árbol propio al bloque, en vez de agregarle al script una API de reset que sólo
      usarían los tests.

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

- [x] **Movido a "Bloqueado — necesita a Sergio" el 2026-09-02** (`DELETE /api/payments/[id]`
      sobre un mes ya declarado). Está medido y espera una línea de Sergio, así que vivía en la
      sección equivocada: en "Después" hacía que cada vuelta lo releyera como si fuera trabajo
      tomable. **Y al reverificarlo antes de moverlo apareció que una de sus premisas ya era
      falsa** — el detalle, con la cotización corregida, va con el ítem en su nueva sección.
      El texto completo NO se copió acá: se movió entero, para no dejar la copia que este mismo
      archivo ya se cansó de cazar.

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

- 🔴 **`DELETE /api/payments/[id]` sobre un mes ya declarado** (movido acá el 2026-09-02 desde
  "Después", donde cada vuelta lo releía como trabajo tomable). El hueco es real y verificado el
  2026-08-30: borrar el último pago devuelve la factura a BORRADOR
  (`app/api/payments/[id]/route.ts`), BORRADOR está en `RCV_EXCLUDED_STATUSES`, y ese mes pierde
  la venta del CSV sin nota de crédito de por medio.
  **⚠️ Reverificado hoy antes de moverlo, y una premisa ya era FALSA — por eso la cotización
  cambia.** El ítem decía: *"No existe NINGÚN concepto de cierre de período en el repo — cero
  `fiscal_period`, cero tabla de cierre"*. Hoy eso no se sostiene, medido en los dos sistemas:
  - **El modelo existe en `master`** (`prisma/schema.prisma`, `model OniaAccountingFiscalPeriod`
    → tabla `onia_accounting_fiscal_periods`) y trae **exactamente** los campos que la opción (b)
    pedía inventar: `organizationId`, `startDate`/`endDate`, `status` (default `open`), `closedAt`,
    y `@@unique([organizationId, name])`.
  - **Y ya está aplicado en la base de PRODUCCIÓN** — contenedor `supabase-db`, no la nube:
    `to_regclass('public.onia_accounting_fiscal_periods')` devuelve la tabla, con **0 filas**.
  - **Pero no lo llama NADIE**: cero referencias a `OniaAccountingFiscalPeriod` /
    `fiscalPeriod` en todo el `.ts`/`.tsx` del repo. Es *construido ≠ terminado* con todas las
    letras — un módulo que nadie llama, valor cero.
  **Qué cambia para Sergio: (b) ya no cuesta 3-4 días.** Lo caro de (b) era modelar la tabla,
  migrarla y aplicarla; las tres cosas están hechas. Lo que falta es **cablear el RCV a leerla**
  y exigir nota de crédito sobre un período cerrado. La decisión sigue siendo suya, pero ya no es
  entre "barato y torcido" (a) y "correcto y caro" (b): (b) es hoy bastante más barata de lo que
  este ítem venía diciendo, y ese número mal puesto empujaba a elegir (a).
  **Las tres salidas, con (b) re-cotizada:**
  - **(a) Guarda barata** — bloquear la salida del RCV si el mes de la factura no es el corriente.
    ~1 día. Pero **inventa la política**: "mes corriente" no es "mes declarado", y bloquea la
    corrección legítima del día 2 del mes siguiente. **Hoy tiene menos sentido que nunca**: la
    tabla que evitaba ya existe.
  - **(b) Cierre de período de verdad** — usar la tabla que YA está: el RCV la lee, y toda salida
    sobre un período cerrado exige nota de crédito. **Ya no son 3-4 días**: el schema y la
    migración están en `master` y aplicados en producción. Queda el cableado. Es lo contablemente
    correcto y lo que el SIN asume.
  - **(c) No hacer nada todavía.** Reverificado EN VIVO hoy en el contenedor `onia-platform`:
    `SIAT_EMISSION` **sigue sin estar seteada** (`docker inspect` no devuelve ninguna `SIAT_*`),
    o sea la emisión ante el SIN está apagada (`lib/fiscal/flags.ts` exige `=== "1"`). Con eso y
    cero clientes pagando, el costo real de hoy sigue siendo **cero**.
  **Recomendación: (c) ahora, (b) el día que se encienda el emisor** — igual que antes, pero (b)
  entra más barata de lo que estaba escrito.
  **Cómo apareció esto, que es la lección:** no se buscó. Salió de contar la rama
  `claude/onia-core-adoption-sprint5` de `onia-platform` (radar 26), que trae ese modelo entre
  otros diez. **Un bloqueo se pudre solo**: nadie tocó este ítem, y aun así envejeció mal porque
  otro carril construyó por debajo lo que él declaraba inexistente. Por eso la regla es
  reverificar ANTES de mover, no al escribirlo.

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

- ~~🔴 **El párrafo del login sale con espacios metidos DENTRO de palabras**~~ — **BLOQUEO
  VENCIDO, sacado de acá el 2026-09-02 por el integrador. Sergio NO tiene que decidir nada:
  el defecto no existe para un cliente.** Pedía elegir entre tres salidas que cambiaban cómo
  se ve `/login` y `/register`, y ninguna hace falta. Ver el ítem cerrado en *"Del canario
  visual — segunda pasada del 2026-09-01"*, más arriba en este mismo archivo.
  **Reverificado por el integrador antes de sacarlo, sin creerle a nadie** (misma URL, mismo
  instante, misma fuente cargada, los dos binarios que ya están en el VPS, apuntados por
  `executablePath`): `chrome-headless-shell-1223` dibuja *"Ent regamos t u sist ema … puest a …
  con t us dat os"*; `chromium-1223` completo dibuja *"Entregamos tu sistema con la
  configuración de tu rubro puesta."* — **impecable**. El `innerText` es idéntico en los dos.
  **Por qué la bisección de antes no contradice esto:** aislar el gap a "Archivo en pesos ≤500"
  y que se vaya con `font-weight: 700` es exactamente lo que hace un bug de rasterizado en los
  trazos finos. Esa prueba nunca podía distinguir sitio de motor, porque **no cambió el motor**.
  La única variable que apaga el defecto sin tocar una línea del sitio es cuál de los dos
  Chromium saca la foto.
  **Lo que sí sigue abierto, y no es de Sergio:** el canario captura con el motor malo — está
  como ítem del carril del canario, arriba.

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
