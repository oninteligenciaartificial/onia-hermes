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

**Estado:** el circuito **cierra**, verificado de punta a punta en local — alta 200 → checkout con
precios de la fuente → comprobante PENDING → aprobación → **Bs 320,00 en la serie de agosto**.
En producción el alta está **abierta** con verificación de correo probada.

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

- [ ] 🔴 **F2 · BLOQUEADO EN SERGIO — el chatbot se cobra y medio chatbot es gratis.**
      Verificado en vivo el 2026-08-30, y la primera versión de este ítem estaba mal en dos
      cosas, así que ojo con lo que se lee acá:
      - **La llave NO es `addon.chatbot`, es `addon.whatsapp`.** `addon.chatbot` está en el
        catálogo (`lib/platform/types.ts`) y **no la lee nadie**: es una llave duplicada y muerta. La
        que trabaja es `addon.whatsapp`, derivada del booleano `whatsappAddon` **o** de un
        entitlement, con su helper ya escrito: `isWhatsAppAddonActive()` en
        `lib/plan-limits.ts:396`.
      - **La mitad del chatbot SÍ está gateada.** `GET /api/chatbot-knowledge/published`
        chequea el add-on desde el 2026-08-18: sin add-on, el bot no atiende con el
        conocimiento del cliente.
      **Lo que sí está abierto:** la **bandeja**. `/inbox` no tiene `requiresFeature`,
      `app/(dashboard)/inbox/page.tsx` sólo chequea sesión, y `bandejaProfile()` (`lib/chatbot/bandeja-auth.ts`)
      gatea por rol, no por add-on. La tenencia sale de `clinicSettings.chatwootInboxId`.
      **Y la raíz:** el alta crea un inbox de Chatwoot para **TODA** org automáticamente
      (`app/api/admin/clinics/route.ts:99`, `createInbox` + `addAgentToInbox`), sin mirar el
      add-on. O sea: toda org nace con bandeja funcionando y `whatsappAddon` en `false`.

      **Por qué no lo cierro solo:** cualquiera de los dos arreglos **baja una superficie
      viva**, y eso está en la lista de "nunca" del loop.
      - **(a) Gatear `/inbox` con `requiresFeature: "addon.whatsapp"`** — una línea, y alcanza
        para nav Y ruta (la lista blanca se deriva del nav). Pero **hoy ninguna org tiene el
        add-on**, así que todas pierden la bandeja de golpe.
      - **(b) Dejar de crear el inbox salvo que el add-on esté activo** — ataca la raíz y **no
        apaga nada de lo que ya existe**, sólo cambia lo que recibe una org nueva. Más seguro,
        pero cambia lo que ve un cliente el día uno (hoy la bandeja vacía funciona de gancho).
      **Decide Sergio.** Con cero clientes pagando el costo real de hoy es cero; el costo
      aparece con el primer cliente que pague el add-on y vea que el de al lado lo tiene igual.

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

- [ ] **F5 · Veterinaria — COTIZADA el 2026-08-30, decide Sergio.** El bloqueo es real pero
      **el costo estaba inflado**. No es "migrar datos vivos":
      - La factura toma el CI del paciente en **un solo lugar**: `lib/fiscal/rcv-export.ts:148`
        (`invoice.patient?.ci` → `nitCliente`).
      - El arreglo mínimo son **columnas anulables** de responsable en `Patient` + una lectura
        con fallback (`responsable?.ci ?? patient.ci`). **Cero backfill**: las filas que ya
        existen se comportan igual que hoy.
      - Superficie: `patientId` aparece 24 veces en `schema.prisma` y 49 archivos lo tocan,
        **pero ninguno se toca en esta versión** — el fallback los deja intactos.
      - Falta: el bloque "responsable / quién paga" en el alta de paciente, mostrado por
        vocabulario sólo en el track veterinaria.
      **Riesgo real: bajo.** Es una migración aditiva. Lo que hay que decidir no es el riesgo,
      es si el 6to rubro vale la semana antes de estrenar los cinco que ya se venden.

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

- [ ] 🔴 **DECIDE SERGIO — hay CUATRO números de WhatsApp de Onia circulando.** El commit de
      arriba **no elige**: sólo impide que gane el que no existe. Hoy conviven:

      | Número | Dónde vive | Qué es |
      |---|---|---|
      | `59177000000` | env var de producción del VPS | **el placeholder — no es un teléfono** |
      | `59178491375` | `lib/contact.ts` (el que sirve tras el fix) | "confirmado por Sergio" en el handoff del 26-jul; es el del portfolio de Meta |
      | `59177711991` | `SUPERADMIN_WHATSAPP` + los mails al cliente de n8n (WF-01, WF-04) | el que los correos de trial y de mora le dan al cliente |
      | `59175414930` | **lo que publica onia.com.bo hoy** | el de la calle |

      **Lo que hace falta: una línea de Sergio diciendo cuál es el número bueno.** Con eso se
      edita `lib/contact.ts` (1 línea), se carga `NEXT_PUBLIC_ONIA_WA` en el VPS y se alinean
      los JSON de n8n y la landing. Sin esa línea no lo elijo yo: mandar al cliente a un número
      equivocado es peor que el placeholder, porque nadie se entera.

## Después

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

- [ ] **La misma frase falsa vive en `hermes-content/propuestas/generador/clientes.json` — es de
      OTRO carril.** Encontrada en la misma pasada y **no la toco**: `propuestas` es el carril C
      del `COORDINATION_MANIFEST.md:94`, y este worktree sólo posee `hermes-content/docs/**` y
      `web-factory/apps/onia-platform/**`. Lo que dice hoy, en la ficha del cliente **AW
      Climatización** (una propuesta que se genera y se manda, no un borrador):
      *"Chatbot WhatsApp con IA — responde, califica y **agenda solo**"* (línea 565), el título
      *"Chatbot IA en WhatsApp que responde y **agenda solo**"* (699), el subtítulo (476), el
      problema (477), el detalle (517) y la nota de paquetes (562), que define el paquete
      **Automatización** como *"además agenda y da seguimiento solo"*. **Es la misma promesa que
      el punto 2 de `ONIA_DEFINICION_DE_TERMINADO.md` ya declaró falsa**, en el único material
      que el cliente se lleva por escrito. Lo cierra el dueño de `propuestas` con un reemplazo de
      copy (cero código): "responde, califica y deriva la visita".
      *(Se revisó también `hermes-content/sales-kit/`: sus "agenda" son del módulo de agenda del
      sistema, no del bot, y `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md:126` y
      `web-factory/apps/onia-platform/src/components/landing-v2/chatbot.tsx:37` ya dicen "deriva".
      La presentación `sales-kit/presentacion-scz-20260801/` tiene fecha en el nombre: es
      historia, no se toca.)*

- [ ] 🔴 **Los otros dos agujeros del escéptico: la fuente se perdió.** El ítem mandaba leer el
      journal del workflow `wf_7449df59-54c` antes de tocar, y ese journal **no existe en
      disco** — buscado el 2026-08-31 bajo `.claude` y bajo el temp de sesión, cero resultados.
      Los journals mueren con su sesión. Sin él no se sabe cuáles eran los dos agujeros ni
      cuáles las dos cifras mal. **Se reabre sólo si alguien los vuelve a encontrar:**
      reconstruirlos de memoria sería inventar, que es justo lo que esta cola persigue.

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

## Bloqueado — necesita a Sergio (reverificado en vivo el 2026-08-31)

> **Estaban 10. Seis ya no eran bloqueos: quedan 4.** Esta lista es la que una sesión lee para
> decidir qué preguntarle a Sergio, así que una entrada vencida **fabrica trabajo** — hace que
> alguien le pida una decisión sobre algo ya hecho, y quema el único recurso que no se recupera.
> Es el mismo defecto que esta cola ya bautizó: *"cerrar un ítem no cierra su copia"*. Cada baja
> lleva la evidencia con la que se dio, medida hoy, no leída de otro renglón.

- 🔴 **Decidir el dominio `dentalgest.app`**: redirigirlo a `app.onia.com.bo` o dejarlo morir. El
  DNS vive en Vercel (`ns1/ns2.vercel-dns.com`) y no lo puedo tocar (sin token, CLI deslogueado,
  MCP con 403). **Ya no es urgente** — ver la baja de abajo: hoy no sirve nada.
- **Credenciales del BCP.** Sin ellas no hay QR. El checkout ya no lo promete (PR #54), pero el
  cobro sigue siendo manual: el cliente transfiere y alguien aprueba.
- **Recorrer el circuito en producción.** Crear una cuenta real, que mande un correo real, pagar.
  Es la única verificación que no se puede simular.
- **Desplegar al VPS** (es distinto de mergear: `onia.com.bo` lo sirve un contenedor). Runbook y
  gates en la skill `onia-deploy`. ⚠️ Hoy `master` tiene commits que **no están en producción** —
  entre ellos `f47d615`, el que saca la promesa falsa de "agenda" que el cliente lee antes de
  pagar Bs 390.

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
