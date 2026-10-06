# Kit de grabación · bloque vigente desde el 6-oct-2026

Para el bloque de seis cámaras vigente desde el 6-oct. Cada ficha enseña el tema antes de grabarlo:
- qué es, en 3 líneas;
- por qué le importa a quien mira;
- qué tener abierto;
- el guion por tomas;
- qué te pueden preguntar.

Los guiones salen de `GUIONES-2-SEMANAS-1-14-OCT.md`. Si una frase cambia acá, se cambia también allá.
Registro original de fuentes: 3-oct. DD-A, N04 y N06 usan la corrección editorial del 6-oct documentada en sus fichas; no se revalidó el resto en esta pasada.

## Bloque vigente desde el 6-oct

DD-A → N04 → N06 → D03-A → D01-A → S2-D08-A. Seis cámaras, sin verde; pantallas del editor. Las fechas y formatos del plan del 3-oct que se conservan abajo son históricos para ese plan, no instrucciones diarias actuales. Las fichas A/B/2 usan el texto corregido; la página externa todavía no está actualizada por este patch.

## Antes de cualquier toma (sirve para todas)

1. **Teléfono en trípode**, vertical, a la altura de los ojos, plano medio (de la cintura para arriba). Sin moverlo en toda la
   pieza.
2. **Micrófono de solapa prendido a la remera**, no en la mano: en la mano tapa la cara y mete ruido de roce.
3. **Una idea por toma.** Decí la toma entera; si te trabás, pausa de 2 segundos y repetí la frase completa. Los cortes caen en
   esas pausas.
4. **Toma de cierre aparte**, de unos 4 segundos: el remate y la despedida. Sin ella, el video termina en seco.
5. **Las pantallas las prepara el editor.** Sergio graba sólo cámara; las demos se ejecutan en un entorno de prueba autorizado y su resultado se revisa antes del master.
6. Al terminar: el bruto a Drive, carpeta «Videos Onia Octubre».

**Formato vigente de las seis piezas:** cámara vertical sin verde; el editor elige el montaje y prepara pantallas según prueba y guion. Los formatos del plan del 3-oct quedan sólo en el apartado histórico.

## Orden histórico por bloques del plan del 3-oct (fuera del bloque vigente)

Esta tabla documenta el plan anterior. Para la tarea actual manda el bloque de seis cámaras de arriba: sin verde, sin B-roll obligatorio y con pantallas a cargo del editor.

| Bloque | Escena | Piezas, en orden | Fichas acá |
|---|---|---|---|
| **1 · Pantalla verde** (~2 h 10) | tela verde planchada a 1-1,5 m, una luz para la tela y otra para vos, nada verde en la ropa; cabeza en la mitad de abajo del cuadro | D02-B, D02-A, DD-A, N06, N02, D03-B, R01, G04, R06, R03, R05, R02, S2-D08-C, R07, G10, R04 | 1 D02-A · 2 N06 |
| **2 · Cámara vertical, Erik y Rocha** (~2 h 20) | sin tela, misma luz; cabeza al 30 % del alto, pecho libre para las tarjetas | D04-C, D01-A, S2-D07-A, N04, S2-D08-A, D03-A, D04-A, D04-B, S2-D12-B, D05-A, S2-D09-A, D05-B, D06-A, D05-C, S1-D07-B, S2-D13-C | 3 D04-C · 4 D01-A · 5 D03-A · 6 D05-A · 7 D06-A |
| **3 · B-roll** (~20 min) | planos de 5-8 s, sin hablar | la lista del plan | - |
| **4 · YouTube horizontal** (~2 h 30) | celular a 16:9 | D01-C, D03-C, G11, S2-D07-C | - |
| **5 · Pantalla de tu PC** (~90 min) | OBS a 1920x1080, notificaciones apagadas | las demos de cada pieza | «Qué tener abierto» de cada ficha |

- **Repos** (R01-R07, G04, G10, G11): el mismo día se mira que el repo siga igual (README, comandos, licencia).
- **Repos, formato nuevo (madre, 3-oct): molde @pabloinpublic** (skill `edicion-referentes`, «Receta Pablo»). Abre a
  cámara con tres dolores en una frase, sigue en pantalla partida (GitHub arriba, tu cara abajo) cambiando de
  pantalla cada ~4 s, y cierra a cámara con «comentá N». Se graban igual en el bloque 1: la cabeza en la mitad de
  abajo ya sirve para la partida. En el bloque 5, **GitHub en modo oscuro**, con el cursor visible y scroll lento.
  G11 es YouTube horizontal: el molde vale solo para un corte vertical que salga de él.
- **D05-C:** la historia es del 20-ago y hoy n8n tiene otro número: decí la fecha. **D05-B:** ese día se mira qué incluye el
  plan Free. **D04-B:** ese día se prueba el comando.
- **La pantalla verde ya tiene paso de edición** (`editor-videos/scripts/fondo-verde.mjs`, probado el 3-oct con una toma
  de prueba). Con tu primera toma se mira el recorte antes de grabar las otras 15: si la tela no queda limpia, esas
  piezas van en pantalla partida. Por eso la cabeza va en la mitad de abajo.
- **Lucía:** en este plan las piezas de negocio (S2-D07-A, S2-D08-A, S2-D09-A, S2-D08-C, S2-D13-C) las grabás vos. Si la
  madre se las pasa a Lucía, salen de tus bloques.

## Registro de verificación: 3-oct, con correcciones vigentes del 6-oct

D02-A y N06 están en sus fichas (1 y 2). El resto:

- **D02-B · TARIFA (bloque 1). Sigue.** developers.facebook.com/documentation/business-messaging/whatsapp/pricing
  («Updated: Sep 30, 2026»): desde el 1-oct los mensajes de servicio se cobran, a la misma tarifa que los de utilidad
  (resto de Latinoamérica, Bolivia incluida: USD 0,0113); los primeros 1.000 por número y por mes, gratis.
  **Al guion se sumó:** esos 1.000 son solo de servicio; las plantillas se cobran desde la primera.
  En pantalla, esa página: business.whatsapp.com sigue diciendo que el servicio es gratis y está vieja.
- **DD-A · CACHE · CORREGIDO 6-oct.** [Precios](https://developers.openai.com/api/docs/pricing) y [caché](https://developers.openai.com/api/docs/guides/prompt-caching), revisados 6-oct: estándar/contexto corto; prefijo mínimo 1.024 tokens visibles; retención mínima 30 min desde escritura/reuso. El enrutamiento también puede producir misses. Sin claim de calidad ni fecha de lanzamiento. Editor: precios oficiales en modalidad estándar/contexto corto y campos de usage; si se muestran valores propios, deben provenir de una respuesta real sanitizada. No presentar una tabla como demo ejecutada.
- **N02 · MIGRAR (bloque 1). Sigue.** platform.claude.com/docs/en/about-claude/model-deprecations:
  `claude-sonnet-4-5-20250929`, «Deprecated», se retira el 30-nov-2026; lo anuncian las release notes del 30-sep.
  `/claude-api migrate` existe (code.claude.com/docs/en/skills) y pregunta qué archivos tocar antes de editar.
  **Cambió en el guion:** son cinco los ajustes que el 5.5 rechaza con error, no tres: a temperatura, respuesta
  pre-llenada y herramienta forzada se suman dos del modo de pensamiento.
- **D03-B · AGENTS (bloque 1). Sigue, con un matiz.** code.claude.com/docs/en/memory, sección «AGENTS.md» (Claude Code
  2.1.277 o más nuevo): con los dos archivos lee solo CLAUDE.md; con `@AGENTS.md` en CLAUDE.md lee los dos, primero el
  importado. En Windows, el import y no un enlace simbólico. **Cambió en el guion:** «por defecto» lee solo CLAUDE: el
  ajuste «Project instructions» (`claude-md-and-agents-md`) hace que lea los dos. Otra forma de comprobar: `/context`
  muestra CLAUDE.md en «Memory files».
- **S2-D08-C · ANUNCIO (bloque 1). Sigue, con dos correcciones.** Misma página de Meta: después de un anuncio de clic a
  WhatsApp, si contestás dentro de la ventana de atención, se abre una ventana gratis de hasta 7 días; solo API oficial;
  el cliente escribe desde la app del celular. **Cambió en el guion:** «se pagan, después de las primeras mil del mes»
  (decía «cada respuesta se paga» y contradecía a D02-B) y «hasta siete días desde tu respuesta». Si preguntan: los
  mensajes del agente de IA de Meta se cobran igual dentro de esa ventana. business.whatsapp.com sigue diciendo 72 horas:
  no es la fuente.
- **N04 · VERIFY · CORREGIDO 6-oct.** [Skills](https://code.claude.com/docs/en/skills), sección Run your checks before each commit, revisada 6-oct: indicación desde v2.1.286, no candado de Git. Las skills empaquetadas/plugins no cuentan; docs/tests solos se exceptúan. Editor: versión 2.1.286+, skill propia disponible al inicio, invocación habilitada e includeGitInstructions activo. Demo con cambio de código en repo aislado, no sólo docs/tests; resultado sin verificar hasta ejecutar.
- **D01-C · TRAMPA (bloque 4). Cambió: le faltaba Fable 5.1.** platform.claude.com/docs/en/about-claude/pricing:
  Fable 5.1 10 / 50, Opus 5.5 4 / 20, Sonnet 5.5 2 / 10 (USD por millón, entrada / salida). Salieron el 1-sep, el
  22-sep y el 28-sep. code.claude.com/docs/en/model-config: `/model fable` o `claude --model fable`; los alias apuntan a
  lo más nuevo con tu cuenta de Anthropic (en Bedrock y Google Cloud, no); según el plan, Fable se cobra de los créditos
  de uso. **Cambió en el guion:** Fable entra en las fechas, los precios, los comandos, el límite y la regla.
- **G11 · REPOS (bloque 4). Sigue lo fechado; dos cifras se movieron.** Trending semanal de GitHub al 3-oct: paperclip
  sigue primero (+12.825). Hoy tiene 2.718 issues y 3.617 pedidos de cambio abiertos; el guion dice «el 30 de
  septiembre, unos 2.600 y 3.500», cierto para esa fecha. Licencias, `onboard --yes`, telemetría activada, Context Mode
  (Elastic 2.0, logos con `href="#"`) y Hindsight (MIT, paper) siguen igual. El repo de Cloudflare hoy tiene 20 abiertos
  y 3 cerrados (el guion dice 19 «esa misma semana»). **Cambió en el guion:** «más de dos mil seiscientos abiertos». El
  día de grabar se vuelve a mirar.

# Fichas de aprendizaje (7, en el orden de los bloques)

**Referencia de formato:** los dos reels que mandó Sergio Urcullo el 3-oct
(`hermes-content/references/video-intake/2026-10-03-reels-genjutsu-y-fiesta-ia.md`):
- **@by.shlabu** es el molde de los tutoriales: el resultado en los primeros 3 s, después 13 s de pantalla real con el
  cómo, y al final la palabra para comentar.
- **@ugc.studio.ia**, el sketch de un personaje IA, es para Lucía, no para estas fichas.

⚠️ **El «comentá PALABRA» necesita el mensaje directo automático armado antes de publicar.** Hoy da 0 leads
(`ig-comentario-dm-vivo`). Grabá igual; antes de publicar, se confirma que el DM le llega a quien comenta.

## A · DD-A · GPT-6.1 Sol: precio y caché en contexto corto

**Producción vigente:** cámara vertical sin verde; Sergio sólo voz/cámara, editor hace pantallas.

**Palabra:** CACHE · **Fuente y límite:** [Precios](https://developers.openai.com/api/docs/pricing) y [caché](https://developers.openai.com/api/docs/guides/prompt-caching), revisados 6-oct: estándar/contexto corto; prefijo mínimo 1.024 tokens visibles; retención mínima 30 min desde escritura/reuso. El enrutamiento también puede producir misses. Sin claim de calidad ni fecha de lanzamiento.

**Qué demuestra:** Editor: precios oficiales en modalidad estándar/contexto corto y campos de usage; si se muestran valores propios, deben provenir de una respuesta real sanitizada. No presentar una tabla como demo ejecutada.

**Guion por tomas (mismo texto de GUIONES/GRABAR)**
- **T1:** «Si usás la API de OpenAI, mirá la tarifa antes de elegir modelo. En modalidad estándar y contexto corto, Sol cobra dos dólares por millón de tokens de entrada y diez de salida; Astra, diez y cincuenta. La entrada normal y la salida de Sol cuestan un quinto.»
- **T2:** «Cuando repetís el mismo prefijo, una lectura desde caché de Sol cuesta diez centavos por millón. Guardarlo cuesta más la primera vez. Poné lo estable primero y comprobá los campos de uso. Si la lectura sigue en cero, revisá también el enrutamiento.»
- **T3:** «Comentá CACHE y te paso la cuenta de la comunidad.»

**Antes del master:** recurso accesible y pantallas/demos verificadas; tabla de cortes y preview360p para aprobación. No hacer instalaciones ni login para este patch.

## B · N04 · La skill verify antes del commit: cuándo se indica y qué no garantiza

**Producción vigente:** cámara vertical sin verde; Sergio sólo voz/cámara, editor hace pantallas.

**Palabra:** VERIFY · **Fuente y límite:** [Skills](https://code.claude.com/docs/en/skills), sección Run your checks before each commit, revisada 6-oct: indicación desde v2.1.286, no candado de Git. Las skills empaquetadas/plugins no cuentan; docs/tests solos se exceptúan.

**Qué demuestra:** Editor: versión 2.1.286+, skill propia disponible al inicio, invocación habilitada e includeGitInstructions activo. Demo con cambio de código en repo aislado, no sólo docs/tests; resultado sin verificar hasta ejecutar.

**Guion por tomas (mismo texto de GUIONES/GRABAR)**
- **T1:** «Antes de pedir un commit, dale a Claude Code una skill propia llamada verify con los chequeos de tu proyecto.»
- **T2:** «Desde la versión dos punto uno punto doscientos ochenta y seis, recibe la indicación de correrla antes de commitear. Es una indicación, no un candado de Git.»
- **T3:** «Debe estar disponible cuando arrancás la sesión, permitir invocación y tener activas las instrucciones de Git. Las de plugins y la que viene empaquetada no cuentan. Reiniciá tras crearla; probá con un cambio de código, porque documentación o tests solos se exceptúan.»
- **T4:** «Comentá VERIFY y te paso la plantilla.»

**Antes del master:** recurso accesible y pantallas/demos verificadas; tabla de cortes y preview360p para aprobación. No hacer instalaciones ni login para este patch.

## 1 · D02-A · La perilla de Claude Code que casi nadie toca

**Formato (bloque 1):** pantalla verde con la doc de Claude Code detrás, más la demo de `/effort` (bloque 5) · **Grabación:** ~15 min.

**Palabra:** EFFORT · **Molde:** Verde (la doc oficial detrás, con la línea marcada; si el recorte falla, Santiago) · **Largo:** ~60 s · **Grabar esta semana** ·
**Verificado el 3-oct:**
- code.claude.com/docs/en/model-config, «Adjust effort level»: Opus 5.5 y Sonnet 5.5 aceptan `low`, `medium`, `high`, `xhigh`
  y `max`. La línea: «The model's default effort: `high` on every model that supports effort, except that Opus 5.5 and
  Sonnet 5.5 default to `medium`».
- La tabla de niveles de esa misma página: «`max` may show diminishing returns and is prone to overthinking».
- Los modelos de hoy: Fable 5.1, Opus 5.5, Sonnet 5.5 y Haiku 4.5. Claude Code arranca por defecto en Opus 5.5 en los planes
  Pro, Max, Team y Enterprise.

**(a) Qué es, como a un amigo.** El esfuerzo es cuánto piensa Claude antes de contestar. Tiene cinco niveles, de low a max.
Con los modelos 5.5, Claude Code arranca en medium; antes arrancaba en high.

**(b) Por qué le importa a quien mira.** Si siente que Claude Code «se puso más vago», puede ser la perilla, no el modelo. Y
subirla es más barato que pasarse al modelo más caro.

**(c) Qué tener abierto antes de grabar**
1. La página code.claude.com/docs/en/model-config, sección **Adjust effort level**, con la línea del default marcada.
2. Una terminal con `claude` y `/effort`, mostrando los cinco niveles.
3. Tu tabla en una tarjeta:
   - **low:** lo mecánico (renombrar, mover);
   - **medium:** el día a día;
   - **high / xhigh:** cuando la primera respuesta no alcanzó;
   - **max:** casi nunca.

**(d) Guion por tomas**
- **T1, gancho:** «Si tu Claude Code ya usa los modelos cinco punto cinco, ahora arranca un nivel más abajo que antes. Y casi
  nadie se dio cuenta.»
- **T2:** «La perilla se llama esfuerzo: cuánto razona antes de responder. La documentación de Anthropic, lo que ves en
  pantalla, dice que Opus y Sonnet cinco punto cinco vienen en medium. Opus cinco y Sonnet cinco venían en high.» [arriba, la
  línea de la doc]
- **T3:** «Para ver en cuál estás, escribí barra effort. Te abre cinco niveles: low, medium, high, xhigh y max.»
  [grabación de pantalla de `/effort`]
- **T4:** «Mi tabla. Low, para lo mecánico: renombrar, mover archivos. Medium, para el día a día. High o xhigh, cuando la
  primera respuesta no alcanzó. Max, casi nunca: la documentación dice que tiende a pensar de más.» [la tabla se arma]
- **T5:** «En mi empresa hay una regla: al modelo más caro se pasa solo cuando Opus, con esfuerzo alto, no alcanzó. Primero la
  perilla, después el modelo.»
- **T6:** «¿Cómo sabés si te conviene? Misma tarea, en medium y en high. Si en high la corregís menos, esa tarea va en
  high.»
- **T7, cierre:** «Comentá EFFORT y te paso mi tabla.» Más la toma de despedida.

**(e) Lo que te pueden preguntar**
- *«¿Cuál es el modelo más caro?»* Hoy, Fable 5.1. Por arriba de Opus 5.5.
- *«¿Y en la API pasa lo mismo?»* No del todo. En la API sólo Opus 5.5 arranca en medium; Sonnet 5.5 sigue en high. El
  default de Sonnet 5.5 en medium es de Claude Code.
- *«¿Se puede dejar fijo?»* Sí: `/effort` en la sesión, al abrir con `claude --effort high`, o la variable
  `CLAUDE_CODE_EFFORT_LEVEL`.

## 2 · N06 · De Gemini CLI a Antigravity CLI: conservá tus skills

**Producción vigente:** cámara vertical sin verde; Sergio sólo voz/cámara, editor hace pantallas.

**Palabra:** ANTIGRAVITY · **Fuente y límite:** [Migración](https://antigravity.google/docs/cli/gcli-migration/), revisada 6-oct: onboarding y rutas confirmados. [Anuncio](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) y [planes Gemini CLI](https://geminicli.com/plans/) se contradicen sobre acceso individual: no afirmar apagado universal. No se verificó una cuenta de usuario.

**Qué demuestra:** Editor: documentación oficial de migración, tabla .gemini/skills/ → .agents/skills/ y reglas GEMINI.md/AGENTS.md. Demo sólo con runtime ya disponible y autorizado; no instalar ni iniciar sesión para este patch.

**Guion por tomas (mismo texto de GUIONES/GRABAR)**
- **T1:** «Si pasás de Gemini CLI a Antigravity CLI, revisá tus skills antes de seguir.»
- **T2:** «Google documenta que agy encuentra tu configuración anterior y ofrece importarla. Pero las skills de tu proyecto cambian de punto gemini barra skills a punto agents barra skills. Reubicá las tuyas sin pisar las que ya tenés. GEMINI punto md y AGENTS punto md siguen como reglas.»
- **T3:** «Comentá ANTIGRAVITY y te paso la guía con la documentación oficial.»

**Antes del master:** recurso accesible y pantallas/demos verificadas; tabla de cortes y preview360p para aprobación. No hacer instalaciones ni login para este patch.

## 3 · D04-C · «Verificado» con un 200, y el login mostraba texto roto

**Formato (bloque 2):** Rocha, cabeza parlante con tres capas de texto, y el antes/después: la captura del login roto y la del sano · **Grabación:** ~15 min, más 5 para reproducir la captura rota.

**Palabra:** MIRAR · **Molde:** Rocha (el antes/después de las dos capturas) · **Largo:** ~65 s · **Verificado el 3-oct** con
CLAUDE.md, regla «Verificar es MIRAR»: los nombres de iconos («credit_card_off», «verified_user») y la fuente de 3,9 MB
que tardaba 117 s.

**(a) Qué es, como a un amigo.** Un «200» es la respuesta del servidor que dice «la página contestó». No dice que se
vea bien. Mi agente daba el login por verificado con eso y buscando texto en el código, y la página mostraba palabras
donde iban los iconos.

**(b) Por qué le importa a quien mira.** Si usás un agente para programar, te va a decir «funciona» con pruebas que no
miran la pantalla. Esta pieza le da un prompt para que el agente verifique como lo haría una persona: abriendo la página.

**(c) Qué tener abierto antes de grabar**
1. **La captura sana:** `web-factory/apps/onia-platform/UsersPCAppDataLocalTemplogin-prod.png` (login con los iconos
   bien).
2. **La rota NO está guardada.** Hay que reproducirla y ponerle «reproducción» en pantalla:
   - abrí `app.onia.com.bo/login` en Chrome;
   - DevTools → Network → clic derecho en la fuente de iconos → «Block request URL» → recargá;
   - se ven los nombres en vez de los iconos. Sacá la captura.
3. El prompt, en un archivo de texto grande para que se lea en pantalla:
   *«No me digas que funciona por el código de respuesta. Abrí la página con un navegador, sacá una captura, mirala, y
   decime qué texto ves, cuánto pesó y cuánto tardó.»*

**(d) Guion por tomas**
- **T1, gancho:** «Mi agente me dijo varias veces que el login de mi sistema estaba verificado. Lo abrí yo, y en vez de
  iconos había palabras: credit card off, verified user.» [arriba, la captura rota]
- **T2:** «¿Cómo lo había verificado? Con un código doscientos, que solo dice "la página respondió", y buscando texto en el
  código. Nunca la abrió.» [sello «200 ≠ se ve bien»]
- **T3:** «La causa: la fuente de los iconos pesaba tres coma nueve megas y tardaba ciento diecisiete segundos. Mientras no
  carga, ves el nombre del icono. Y ese nombre está en el código siempre, se vea bien o no. Buscar texto no lo distingue.»
  [contador 3,9 MB · 117 s]
- **T4:** «Desde ese día, verificar es mirar. Cuando Claude Code te diga que algo funciona, pedile esto:» [el prompt]
- **T5:** lee el prompt entero a cámara.
- **T6:** «Salió bien cuando en la captura ves iconos dibujados, no palabras, y la página carga en segundos, no en minutos.»
  [captura sana al lado de la rota]
- **T7, cierre:** «El prompt completo está en la comunidad: comentá MIRAR y te paso el link.» Más la toma de despedida.

**(e) Lo que te pueden preguntar**
- *«¿Qué es un 200?»* El código con que el servidor dice «te contesté». Puede venir con la página rota, vacía o a medio
  cargar.
- *«¿Cómo saca la captura el agente?»* Con un navegador sin ventana (Playwright o Chromium headless). Claude Code lo
  puede instalar y usar si se lo pedís.
- *«¿Por qué tardaba tanto la fuente?»* Porque se bajaba entera, con miles de iconos, para usar unos pocos. Se arregla
  cargando sólo los que usás.

## 4 · D01-A · Tu primera skill de Claude Code en un minuto

**Formato (bloque 2):** Erik, tu cara a lo ancho con las tarjetas que arman la ruta, más la demo de `/skills` (bloque 5). Arranca con el resultado, como el reel de @by.shlabu · **Grabación:** ~20 min.

**Palabra:** SKILL · **Molde:** Erik (las tarjetas arman la ruta y el archivo de a un pedazo) · **Largo:** ~60 s · **Verificado
el 3-oct:**
- code.claude.com/docs/en/skills: «Project | `.claude/skills/<skill-name>/SKILL.md`»; «`description` … How Claude decides
  when to invoke the skill»; «Run `/skills` to see all loaded skills».
- La historia de la skill de continuidad: `.claude/skills/onia-continuidad/SKILL.md`, «Planifiqué 6 features. 4 no
  existían — ya estaban hechos o ya estaban decididos».
- sergiourcullo.vercel.app/claude-code (la serie en video).

**(a) Qué es, como a un amigo.** Una skill es un archivo de instrucciones que le enseña a Claude Code a hacer una tarea a tu
manera. No se carga siempre: Claude lee su descripción y la usa sólo cuando el pedido coincide. Es como darle un manual que
abre cuando lo necesita.

**(b) Por qué le importa a quien mira.** Deja de repetirle lo mismo en cada sesión: lo escribe una vez y Claude lo aplica
solo. Y aprende la parte que casi nadie sabe: si la descripción es vaga, la skill nunca se usa.

**(c) Qué tener abierto antes de grabar**
1. Un proyecto de prueba en el editor, con la carpeta `.claude/skills/continuidad/` y su `SKILL.md`. Arriba van
   `name: continuidad` y `description: Invocar al arrancar cualquier sesión…`; abajo, tres renglones de instrucciones.
2. Una terminal en ese proyecto con `claude` abierto, para escribir `/skills` y que aparezca «continuidad».
3. Un pedido que coincida con la descripción, para mostrar que la usa, por ejemplo *«arrancamos: ¿qué hay pendiente?»*.

**(d) Guion por tomas**
- **T1, gancho:** «Una skill es un archivo que le enseña a Claude Code a hacer algo. Y lo usa solo cuando hace falta.
  Armemos una.»
- **T2:** «En tu proyecto creá la ruta que ves en pantalla: punto claude, barra skills, barra el nombre de tu skill. Adentro,
  un archivo SKILL punto md, en mayúsculas.» [la ruta se escribe de a un pedazo]
- **T3:** «Arriba van dos datos. Name, el nombre. Description, cuándo usarla.» [el frontmatter]
- **T4:** «Esa descripción es lo más importante: Claude la lee para decidir si la skill aplica. Si es vaga, no la usa nunca.»
  [sello sobre «description»]
- **T5:** «Abajo, las instrucciones, como se las explicarías a alguien nuevo.»
- **T6:** «La mía se llama continuidad. La descripción dice: invocar al arrancar cualquier sesión. Obliga a leer lo que ya
  sabemos antes de decidir. Nació el día en que mi agente planificó seis cosas, y cuatro ya estaban hechas o decididas.»
  [contador 6 → 4]
- **T7:** «Para comprobar la tuya, escribí barra skills: tiene que aparecer. Después pedile algo que coincida con la
  descripción, y fijate si la usa.» [grabación de pantalla con `/skills`]
- **T8, cierre:** «El video para instalar Claude Code y armar tu primera skill está en mi web: comentá SKILL y te paso el
  link.» Más la toma de despedida.

**(e) Lo que te pueden preguntar**
- *«¿Necesito pagar?»* Para Claude Code, sí: el plan gratis de Claude alcanza para el chat, no para Claude Code. Lo dice tu
  web arriba de todo.
- *«¿Y si la quiero en todos mis proyectos?»* Ponela en tu carpeta de usuario, `~/.claude/skills/<nombre>/SKILL.md`, en vez
  de la del proyecto.
- *«No me aparece en /skills.»* Revisá la ruta exacta y el nombre del archivo (`SKILL.md`, en mayúsculas), y que arriba estén
  `name` y `description` entre las dos líneas de `---`.

## 5 · D03-A · El hook que commitea solo, y la guarda que le puse después de romperlo

**Formato (bloque 2):** Rocha, cabeza parlante con tres capas de texto: abre la historia de los 17 archivos y cierra el cómo. La demo (el JSON y la guarda frenando el conflicto) va en el bloque 5 · **Grabación:** ~25 min: armar el conflicto de prueba lleva 10.

**Palabra:** HOOK · **Molde:** Rocha (tres capas de texto; los tres pasos y el JSON entran como texto) · **Largo:** ~60 s · **Verificado el 3-oct:**
- code.claude.com/docs/en/hooks: «The Stop event fires when Claude finishes responding»; «The `/hooks` command opens a
  read-only browser for viewing all your configured hooks».
- El bloque real de `.claude/settings.json`: `"Stop": [{ "hooks": [{ "type": "command", "command": "node
  scripts/git-autosync.js" }] }]`.
- La guarda real, en `scripts/git-autosync.js`: `git rev-parse -q --verify MERGE_HEAD` y `git diff --name-only
  --diff-filter=U`.
- CLAUDE.md: 17 archivos con conflictos (20-ago) y 217 líneas de estilos (23-ago).

**(a) Qué es, como a un amigo.** Un hook es una orden que Claude Code ejecuta solo en un momento fijo. El «Stop» corre cada
vez que Claude termina de contestar. Yo lo uso para guardar y subir el trabajo sin acordarme, y le puse una guarda para
que no suba cosas rotas.

**(b) Por qué le importa a quien mira.** Automatizar el commit ahorra trabajo, pero sin guarda sube lo que haya, también
un merge a medias. Con dos comandos de git se evita.

**(c) Qué tener abierto antes de grabar**
1. `.claude/settings.json` con el bloque `hooks` → `Stop` → `type: "command"` (el de arriba).
2. Un script de ejemplo con la guarda, sólo las líneas que importan:
   ```
   git rev-parse -q --verify MERGE_HEAD      # ¿hay un merge a medias?
   git diff --name-only --diff-filter=U      # ¿hay archivos en conflicto?
   ```
   Si cualquiera devuelve algo, el script avisa y sale sin commitear.
3. Una terminal con `claude` y `/hooks` mostrando el Stop.
4. Un repo de prueba con un conflicto armado a propósito. Así se arma: dos ramas que cambian la misma línea, y `git merge`
   que choca. Ahí corrés el script y avisa.

**(d) Guion por tomas**
- **T1, gancho:** «Mi hook de Claude Code tomó diecisiete archivos con conflictos, los dio por resueltos y los subió a mi
  rama principal. Así se arma bien.» [sello «17 archivos»]
- **T2:** «Paso uno. En punto claude, barra, settings punto json, copiá lo que ves en pantalla: hooks, adentro Stop, y un hook
  de tipo command con tu script de commit.» [el JSON]
- **T3:** «Paso dos. Stop corre cuando Claude termina su turno, no cuando terminó el trabajo. Por eso otro día me publicó
  doscientas diecisiete líneas de estilos antes que el código que las usaba.» [contador 217]
- **T4:** «Paso tres, el que decide todo: la guarda. Antes de commitear, tu script corre dos comandos de git, en pantalla. Uno
  pregunta si hay un merge a medias. El otro lista archivos en conflicto. Si cualquiera devuelve algo, no toca nada.» [los
  dos comandos]
- **T5:** «Para comprobarlo: barra hooks en Claude Code, y tu Stop tiene que aparecer. Después, en un repo de prueba, armá
  un conflicto a propósito y corré tu script: tiene que avisar y no commitear.» [grabación de pantalla de la prueba]
- **T6, cierre:** «El JSON y la guarda están en la comunidad: comentá HOOK y te paso el link.» Más la toma de despedida.

**(e) Lo que te pueden preguntar**
- *«¿El hook también hace push?»* El mío sí, porque así lo escribí en el script. El hook sólo ejecuta tu comando: lo que
  haga depende de vos.
- *«¿Por qué no un hook de git (pre-commit)?»* Porque el de git corre cuando vos commiteás. El Stop de Claude Code corre
  cuando Claude termina de contestar, aunque nadie commitee.
- *«¿Funciona en Windows?»* Sí, si el comando del hook corre en tu terminal. Yo uso Node para que sea el mismo en Windows y
  Linux.

## 6 · D05-A · Dos sesiones de Claude Code en el mismo proyecto, sin pisarse

**Formato (bloque 2):** Erik, con la tarjeta de los tres pasos, más la demo de los comandos de git (bloque 5) · **Grabación:** ~20 min.

**Palabra:** WORKTREE · **Molde:** Erik (tarjeta con los tres pasos) · **Largo:** ~60 s · **Verificado el 3-oct:**
- code.claude.com/docs/en/worktrees: «Pass `--worktree` or `-w` with a name to create an isolated worktree and start Claude
  in it».
- La historia de los 424 commits, confirmada por la madre (handoff de marca personal).

**(a) Qué es, como a un amigo.** Un worktree es una segunda carpeta del mismo proyecto, con su propia rama. Dos sesiones de
Claude Code, cada una en su carpeta, trabajan a la vez sin tocarse los archivos.

**(b) Por qué le importa a quien mira.** Si abre dos sesiones en la misma carpeta, una pisa lo de la otra. Y el error que
nadie avisa: la terminal puede volver sola a la carpeta principal, y un comando de git cae donde no iba.

**(c) Qué tener abierto antes de grabar**
1. Un repo de prueba (nada real) en la terminal.
2. Los comandos, de a uno:
   ```
   git worktree add -b prueba-a ../proyecto-a     # carpeta nueva con su rama
   claude -w prueba-b                              # o más corto: la crea y abre Claude ahí
   git -C ../proyecto-a status                     # git siempre con -C y la ruta
   git worktree list                               # cada carpeta con su rama
   ```

**(d) Guion por tomas**
- **T1, gancho:** «Dos sesiones de Claude Code en la misma carpeta tocan los mismos archivos. Y a mí un comando que iba para
  una carpeta cayó en otra, y movió una rama cuatrocientos veinticuatro commits.» [contador 424]
- **T2:** «La solución se llama worktree: otra carpeta del mismo repositorio, con su propia rama.»
- **T3:** «Uno. Desde tu proyecto: git worktree add, guion b, el nombre de la rama y la carpeta nueva. Lo que ves en
  pantalla.»
- **T4:** «Dos. Abrí Claude Code en esa carpeta. O más corto: claude guion w y un nombre, que la crea por vos.»
- **T5:** «Tres, el paso crítico. Todo comando de git, con git guion C y la ruta de la carpeta. No confíes en que la terminal
  sigue donde la dejaste.» [sello «-C siempre»]
- **T6:** «A mi agente la terminal le volvió sola a la carpeta principal. Se recuperó con el historial de git, pero nada
  avisó.»
- **T7:** «Para comprobar: git worktree list. Cada carpeta, con su rama. Una sesión, una carpeta, una rama.» [la lista]
- **T8, cierre:** «Los comandos están en la comunidad: comentá WORKTREE y te paso el link.» Más la toma de despedida.

**(e) Lo que te pueden preguntar**
- *«¿Cómo junto después el trabajo de las dos?»* Cada rama se mergea a la principal como siempre. Después borrás la carpeta
  con `git worktree remove <carpeta>`.
- *«¿Ocupa el doble de espacio?»* No duplica el historial de git: comparte el mismo repositorio. Sí duplica los archivos
  de trabajo, y las dependencias si las instalás de nuevo.
- *«¿Cómo recuperaste la rama movida?»* Con el historial de git (`git reflog`), que guarda dónde estaba cada rama antes de
  moverse.

## 7 · D06-A · Antes de cerrar la sesión: el handoff de siete campos

**Formato (bloque 2):** Erik con lista: los siete campos se arman de a uno en tarjetas. La pantalla es opcional: solo la sesión nueva respondiendo · **Grabación:** ~10 min, la más rápida.

**Palabra:** HANDOFF · **Molde:** Erik (la tarjeta de siete campos se arma de a uno) · **Largo:** ~60 s · **Verificado el 3-oct**
con `hermes-content/docs/handoff/README.md` (los siete campos, y la compactación del 22-ago en «Por qué esto y no confiar
en la compactación») y con CLAUDE.md (el trabajo sin commit del 4-sep).

**(a) Qué es, como a un amigo.** Un handoff es una nota que la sesión de Claude Code escribe antes de cerrarse, con siete
campos fijos. La sesión siguiente la lee y arranca donde quedó la otra, sin preguntarte nada. Es lo mismo que dejarle el
parte al que entra al turno siguiente.

**(b) Por qué le importa a quien mira.** Cada sesión nueva de Claude Code arranca de cero, y el resumen automático no
sirve de puente: guarda todo con el mismo peso, el estado de hoy y cada idea descartada. Con la nota, la sesión siguiente
no repite los errores de la anterior.

**(c) Qué tener abierto antes de grabar**
1. Un archivo de ejemplo `handoff-ejemplo.md` con los siete títulos y un renglón inventado en cada uno, para no mostrar
   datos reales. Los siete:
   - Objetivo;
   - Qué quedó en producción;
   - Qué quedó a medias, y dónde;
   - Archivos y cambios;
   - Intentos fallidos;
   - Qué depende de vos;
   - Próximos pasos.
2. Una terminal en esa carpeta para la prueba: `claude`, y el mensaje *«Leé solo handoff-ejemplo.md y decime qué hacés
   ahora»*.

**(d) Guion por tomas** (cada toma a cámara; entre corchetes, lo que va en pantalla)
- **T1, gancho:** «Cuando cerrás una sesión, lo que aprendió se va con ella. La próxima arranca de cero.»
- **T2:** «Probé confiar en el resumen automático. El veintidós de agosto una sesión se compactó, y el resumen era fiel pero
  larguísimo: cada error y cada idea descartada, con el mismo peso que el estado actual. Un resumen no elige.»
- **T3:** «Ahora, al cerrar, Claude escribe un archivo con siete campos.» [tarjeta vacía con 7 renglones]
- **T4:** «Uno, el objetivo y si se cumplió. Dos, qué quedó funcionando. Tres, qué quedó a medias: rama y commit. Cuatro, los
  archivos que importan. Cinco, los intentos fallidos y por qué. Seis, qué depende de vos. Siete, los próximos pasos.»
  [cada campo entra cuando lo nombrás]
- **T5:** «El cinco es el que nadie escribe y el que más vale: evita repetir callejones.» [sello sobre el campo 5]
- **T6:** «Lo que no se commiteó se nombra con su riesgo: el cuatro de septiembre una sesión llegó al cierre con un trabajo
  entero sin commit.»
- **T7:** «Para comprobar, pasale solo ese archivo a una sesión nueva. Si sigue sin preguntarte nada, está bien escrito.»
  [grabación de pantalla: la sesión nueva respondiendo]
- **T8, cierre:** «La plantilla está en la comunidad: comentá HANDOFF y te paso el link.» Después, la toma aparte de
  despedida (~4 s).

**(e) Lo que te pueden preguntar**
- *«¿No alcanza con /compact?»* No. Compactar resume la conversación, pero no elige qué importa. El handoff lo escribís
  pensando en quien sigue: qué está vivo, qué está a medias y qué no hay que volver a probar.
- *«¿Dónde lo guardo?»* En el repo, un archivo por tema o proyecto, y commiteado. Si no está en git, la sesión nueva no lo
  ve.
- *«¿Se lo pido yo o lo hace solo?»* Lo podés pedir con un prompt fijo al cerrar («escribí el handoff con los siete
  campos») o dejarlo como regla en tu CLAUDE.md.
