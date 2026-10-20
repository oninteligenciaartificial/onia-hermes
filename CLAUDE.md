# CLAUDE.md — Onia

Instrucciones de proyecto. Override sobre defaults.

> Ordenado por **cuándo se necesita**: arriba lo de cada sesión, abajo el detalle de
> dominio. Cada regla lleva el caso real que la originó — una regla sin su historia se
> desobedece; con la historia, no.

---

# 1. Al arrancar

## Acceso local a apps, credenciales y sesiones (regla compartida)

Origen: Sergio Urcullo, 2026-09-28. Evitar que Codex y Claude pidan iniciar
sesión de nuevo en cada tarea; las credenciales personales viven en su laptop.

- Antes de pedir claves o un login, leer `hermes-content/skills/seguridad-credenciales.md`
  y comprobar la sesión y el mecanismo local de acceso ya autorizados para esa cuenta.
- La bóveda KeePassXC prevista es `C:/Users/PC/BovedaPrivada/Agentes.kdbx`, fuera
  del repo. Verificar su existencia y la integración; KeePassXC abierto no concede
  acceso automático a Codex, Claude Code, Playwright ni agentes remotos.
- Reutilizar la sesión vigente mediante la herramienta de navegador disponible
  y sus permisos. Los perfiles persistentes se guardan fuera de Git y se usan
  de forma serializada; no crear un contexto efímero nuevo por cada tarea.
- Usar la credencial necesaria mediante un puente configurado. No volcar la bóveda,
  mostrar contraseñas/tokens/cookies, exportar secretos a texto ni pedir la
  contraseña maestra por chat. Google, consentimiento y MFA requieren a Sergio
  Urcullo cuando corresponda; no prometer sesiones permanentes.
- El acceso a una cuenta mantiene el alcance de la tarea autorizada. Pagos,
  generaciones pagadas, publicaciones, contacto con terceros y producción
  conservan sus aprobaciones específicas.
- Antes de descargar o instalar herramientas, dependencias, navegadores,
  plugins o extensiones, explicar qué componente y propósito y pedir aprobación.
  El VPS de ONIA Platform no se usa para alojar esta bóveda o sesiones personales.


## Objetivo por sesión (REGLA)

> Sergio, 2026-07-20: separar el trabajo en muchas sesiones mezcla la información y se
> pierde el objetivo.

- **Un objetivo al inicio, escrito y explícito**, con su definición de "hecho". Todo lo
  que no sirva a ese objetivo se **anota como pendiente**, no se hace.
- **No se cierra la sesión hasta terminarlo.** Nada a medias, nada de saltar a otra cosa.
- **Relevo al 80 % de contexto** (Sergio Urcullo, 20-oct-2026: *«llega al límite de contexto, así que revisá que
  lleguen al límite, handoff, se anota y se continúa, y la otra se deja archivada como historia»*). Al 80 %: se
  escribe el handoff del carril (los siete campos de «Cambio de sesión», abajo, con commit y push), el mismo
  objetivo sigue en una sesión nueva que arranca leyendo ese handoff, y la vieja se archiva como historia: no se
  le pide nada más. Relevar no es cerrar a medias: el objetivo no cambia de dueño ni de definición de «hecho».
  El aviso del 80 % lo arma el Panel ONIA (en construcción el 20-oct); mientras no esté, se mira el indicador de
  contexto de la app.
- **Orquestan Hermes y el programa fijo, no una sesión** (Sergio Urcullo, 19-oct-2026; ver «Quién orquesta»,
  abajo). La sesión principal es donde él trabaja conmigo; sus subagentes y los carriles independientes sí
  trabajan en paralelo. Codex ejecuta encargos cerrados.
- Cada subagente: worktree con **ruta explícita** y gates en su propio árbol.
  Corrección 2026-10-09: en un encargo Codex sin Git, quien lo lanzó verifica rama y hace
  commit/integración; Codex no ejecuta ni siquiera consultas Git. Quien lo lanzó
  mantiene el objetivo, el orden y el PR a `main`.
- Mismo carril (misma carpeta) → subagentes **secuenciales**. Carriles distintos →
  paralelo.

## El objetivo del NEGOCIO manda sobre el de la sesión (REGLA)

> Sergio Urcullo, 2026-09-05: *"quisiera escalarlo de una manera que no sea solo yo como un
> freelancer… quisiera que fuera una empresa, de verdad"*.

- **Fuente única: `hermes-content/docs/ONIA_ESTRATEGIA_DE_EMPRESA.md`.** Fija **UNA etapa
  vigente** con criterio de salida **numérico**. El objetivo de la sesión se elige DENTRO de
  esa etapa; lo que no le sirve **se anota como pendiente y no se hace**, por buena que sea la
  idea y aunque alguien ya la haya empezado.
- ⛔ **No se abre una línea de negocio nueva.** Medido el 2026-09-05: **nueve líneas activas**
  (SaaS, chatbot, web-factory, video, influencers IA, contenido/ads, consultoría, marca
  personal, hardware) y **8 worktrees simultáneos**, con **una sola persona** y **cero clientes
  pagando**. Una empresa hace una cosa con muchas manos; un freelancer hace muchas con una.
  Abrir la décima es la decisión más cara disponible. Congelar ≠ borrar: se congela y se anota.
- **Un añadido pasa el TEST DE TRES PREGUNTAS o no se construye** (§10 de ese doc): ¿se le vende
  al MISMO cliente que ya paga? · ¿deja de tener sentido sin el núcleo? · ¿se entrega sin horas
  de Sergio Urcullo por cliente? Falla una → **no es un add-on, es un negocio nuevo disfrazado**.
  El chatbot pasa las tres (99,8% de margen); la web, el influencer y el contenido fallan.
- **El techo del negocio no es técnico: son horas de soporte** (§9). Operar cuesta Bs ~461/mes
  con 1 cliente o con 40, y el margen es 94-99,8% — **el producto no tiene problema de
  rentabilidad, tiene problema de clientes**. Bajar el soporte por cliente SUBE el techo; una
  feature nueva sólo agrega valor a uno. Priorizar en ese orden.
- **"¿Necesitamos financiación o un equipo de desarrollo?" ya está contestado y medido: NO.**
  El break-even es `gasto mensual ÷ precio del plan` ≈ **5 clientes**. Un desarrollador lo
  triplicaría. Construir es lo único que sobra — lo escaso son clientes. No se reabre esa
  discusión sin datos nuevos; está en §4 y §5 de ese doc, con su aritmética.
- **Ninguna sesión cambia la etapa vigente por su cuenta.** Eso lo decide Sergio Urcullo; la
  sesión que crea que corresponde cambiarla **lo plantea, con la cuenta delante, y sigue con
  lo desbloqueado**.

## Skills del proyecto (REGLA)

- Toda sesión arranca invocando **`onia-router`**: él es el índice y rutea la tarea a su
  carril, su stack de skills, su subagente y sus docs fuente.
- **Desde 2026-10-09, Claude y Codex cargan también `equipo-de-agentes` y
  `aprender-de-todo`.** Registrar cada referencia por dimensión; guardar una regla
  no demuestra aprendizaje aplicado: hace falta una tarea que la use.
- **Al tocar el producto (`onia-platform`) son OBLIGATORIAS sus skills propias**
  (`onia-frontend/backend/db/seguridad/deploy/verificacion` en su `.claude/skills/`) —
  solo se autolistan en sesiones abiertas DENTRO de ese repo.
- Al aprender una trampa nueva: **editar la skill que corresponda**, no crear doc suelto.
  Skill pública instalada que sirva: usarla, no reinventar.
- **Autoconocimiento: cada sesión se entrena a sí misma.** Sergio Urcullo, 2026-10-01: *«tienen que
  aprender a hacer las cosas, que quede como autoconocimiento, sin eso investigamos y perdemos las
  cosas»*. ANTES de investigar, leer la skill del carril. AL CERRAR cada tarea, lo aprendido (método,
  trampa, comando, dato medido, intento fallido con su causa) va a esa skill, con el caso y la fecha,
  **en el mismo commit**. Carril sin skill → crear UNA (`.claude/skills/<carril>/SKILL.md`) y sumarla
  a `onia-router`. El handoff es estado; la skill es el método que sobrevive al relevo.
- **Enrutamiento de modelos y contexto:** leer
  `hermes-content/docs/AI_MODEL_ROUTING_2026.md`. Astra decide lo ambiguo y de alto riesgo; Sol
  ejecuta el trabajo cotidiano con juicio; Luna hace tareas cerradas y verificables. No bajar
  calidad en estrategia/identidad para ahorrar tokens ni cargar documentos largos cuando existe
  un manifest compacto.

## Canario: se le dice **Sergio Urcullo** (REGLA)

> Sergio, 2026-09-04: *"quiero que nuestro canario sea tambien que me llames siempre como sergio
> urcullo, ahi vere si se esta deteriorando la sesion"*.

- **Siempre por nombre y apellido: «Sergio Urcullo».** No «Sergio» a secas, no «el usuario».
- Es un **canario**: si dejo de hacerlo, la sesión se está degradando y él lo ve sin preguntar.
- ⚠️ **Su límite, dicho de frente:** esta regla se reinyecta en cada pedido, así que sobrevive a
  la compactación por sí sola. Eso la hace **débil** como detector de "perdí el contexto" — pero
  **fuerte** como detector de algo peor: si fallo teniéndola delante, no es que la olvidé, es que
  dejé de leer mis propias instrucciones. Ese fallo sí vale como alarma.

## Simple: sin información basura, menos pasos, menos páginas (REGLA)

> Sergio Urcullo, 2026-10-01, después de un reporte largo con diagnóstico, hipótesis y fuentes:
> *«fuera información basura, y que se vea todo simple y mientras menos pasos o páginas mejor»*.

- **A Sergio Urcullo:** solo lo que cambia una decisión o le pide algo, con el formato fijo de abajo.
  El diagnóstico, las hipótesis descartadas y las fuentes van al handoff, no al mensaje.
- **En el producto y la web:** cada paso o página extra se justifica o se saca. Ante dos
  soluciones, gana la de menos clics para el cliente.
- **Cómo se le escribe a Sergio Urcullo (20-oct: «que no hablen de esa manera, con pasó, sigue… que hablen normal
  pero resumido y al grano»):** prosa normal y corta, sin rótulos «Pasó / Necesito / Sigue» (el formato fijo del
  8-oct queda superado). Primero lo que importa, después lo que le toca hacer a él, si hay algo. ~5 líneas; tablas
  solo si tiene que elegir. Método, hipótesis, fuentes y detalle
  van al handoff, la skill o el PR, nunca al mensaje. **El trabajo por detrás NO se achica:** mismo desarrollo,
  verificación y aprendizaje; solo se acorta lo que se le dice. Seguridad y lo irreversible se escriben claros.

## Trato y criterio (REGLA)

> Vivían solo en la memoria de la PC y en `~/.claude/CLAUDE.md`, que la nube no ve. Se llevan acá con su fecha de
> origen (aprobado por Sergio Urcullo, 10-oct-2026).

- **Usted con clientes y prospectos** (Sergio Urcullo, 3-oct-2026: «no se usa vos, es muy informal, usted»): bot,
  agentes de voz, plantillas de WhatsApp, mensajes 1:1 y respuestas a la pauta. **Desde el 19-oct también la web y
  los anuncios** (lo decidió Sergio Urcullo). En el chat con él y en su marca personal sigue el voseo.
- **Comandos para que los corra Sergio Urcullo: PowerShell, nunca bash** (29-sep-2026: un `rm -rf` falló). Usar
  `Remove-Item -Recurse -Force`, `$HOME\` y `;` en vez de `&&`; si borra, avisar que no se deshace.
- **Horas en La Paz, UTC-4** (31-ago-2026: un correo de las 22:18 se le dijo «02:18»). Restar 4 h a logs, correos y
  auditoría del VPS (vienen en UTC); en los crons NO se resta, el host es UTC.
- **Criterio propio, no solo obedecer** (Sergio Urcullo, 22-jul-2026: «alguna idea puede ser mala o puede ser buena»):
  evaluar cada pedido, investigar en fuentes confiables antes de afirmar, traer opciones que él no mencionó y
  contradecir con evidencia si la premisa es débil. No contradecir por deporte.
- **No preguntar lo razonable** (3-sep-2026: «no me preguntes a cada rato… ponte en marcha»): si el repo o los datos
  lo resuelven, decidir y dejar el razonamiento escrito. Se le pregunta solo plata, contactar personas y lo que
  «Qué se publica sin preguntar» le reserva, todo junto en una hoja y no de a una.
- **Escalera de autonomía antes de pedirle algo** (`~/.claude/CLAUDE.md`): 1) MCP disponible, 2) CLI o API con la
  credencial ya autorizada (por «Acceso local…», arriba), 3) skill o plugin, 4) script, 5) pedirle, solo si nada
  sirvió y diciendo qué se intentó y qué MCP o permiso faltaría. Antes de «no puedo», `ToolSearch` de los MCP.
- **Ante un tope de gasto o de cupo, bajar el consumo, no subir el techo** (Sergio Urcullo, 8-sep-2026: «No subimos,
  acomodemos para que gaste lo menos posible»): medir quién gasta antes de cortar; un trabajo que solo manda Telegram
  es candidato a apagar; pausar, no borrar.
- **Onia vende software, nunca horas** (caso C21 Acero, 4-ago-2026): ningún trato exige presencia de Sergio Urcullo.
  Desarrollo dedicado = proyecto pagado por adelantado + licencia + mantenimiento, nunca comisión ni equity; sociedad
  solo por earn-in con hitos medibles.
- **Todos los rubros, no solo dental** (Sergio Urcullo, 29-sep-2026: «TENEMOS OTROS RUBROS»): toda pantalla rediseñada
  se captura en al menos dos rubros (dental + comercio) con su vocabulario; el QA recorre los 5; la competencia
  incluye rivales de comercio, estética, servicios e importadora.
- **Cuidar tokens, no releer** (Sergio Urcullo, 29-ago-2026): lo ya leído no se relee salvo que pudo cambiar; fragmentos
  (offset, grep) antes que archivos enteros; rutas absolutas en Bash; verificar con el exit code, nunca con `| tail`.
  El largo del mensaje a él ya lo fija «Simple», arriba (8-oct-2026).
- **Un modelo por rol** (Sergio Urcullo, 10-oct-2026): subagentes con `model` por rol (Haiku cuenta y verifica,
  Sonnet sintetiza, Opus decide lo riesgoso) y código cerrado a Codex. Codex no hace git; quien lo lanzó commitea
  con la suite completa en verde. En la orquesta, la tabla de modelos vive en `scripts/orquesta/carriles.json`.

## Quién orquesta: Hermes + el programa fijo (REGLA)

> Sergio Urcullo, 19-oct-2026, al resolver las contradicciones entre CLAUDE.md, AGENTS.md y las memorias:
> Hermes planifica y el programa fijo reparte; la sesión principal es donde él trabaja conmigo.

- **Hermes planifica** (VPS, por Telegram): arma las tareas y las carga como issues `orquesta` + `carril:<área>`.
- **El programa fijo reparte** (`scripts/orquesta/orquesta.mjs`, sin LLM que coordine): toma cada issue, corre al
  trabajador del carril con su modelo, lo hace revisar con contexto limpio y deja PR + comentario. Corre en
  **GitHub Actions** lo que no usa logins (marca, comunidad, investigación) y **en la PC** lo que usa sus sesiones
  o archivos (video, plataforma, Meta, Instagram, Higgsfield). Método: `scripts/orquesta/README.md`.
- **La sesión principal** es donde Sergio Urcullo trabaja conmigo. **Ya no hay una «madre» que ordene a otras
  sesiones por mensaje** (la regla del 1-oct, «Sesión MADRE local + carriles en la nube», queda como historia; los
  canales medidos siguen en la skill `onia-sesion-madre`). Lo que una sesión necesita de otra trabajando en
  paralelo se le puede seguir mandando por mensaje, pero el trabajo de fondo se pide por issue a la orquesta.
- El handoff (`hermes-content/docs/handoff/<carril>.md`) sigue siendo cómo una sesión NUEVA retoma.
- **El portal del SIAT no lo abre ninguna sesión.** Lo abre solo Sergio Urcullo a mano; la sesión le pide capturas.

## «Cambio de sesión» → handoff completo (REGLA)

> Sergio, 2026-09-04: *"cada que yo te diga cambio de sesion generes handoff para nueva sesion
> pero que anotes absolutamente todo y no perdamos que hicimos"*.

- Las palabras **«cambio de sesión»** son un disparador: se escribe el handoff del carril ANTES de
  seguir con nada más. No se pregunta, no se pospone.
- Va en `hermes-content/docs/handoff/<carril>.md`, con los **siete campos** del README de esa
  carpeta, y se **commitea y pushea** — un handoff sin pushear no existe para la sesión nueva.
- **«Absolutamente todo» incluye lo incómodo**, que es justo lo que se pierde: lo que quedó **en
  vuelo y sin commitear** (y qué se pierde si muere la sesión), los **intentos fallidos** con su
  causa, las hipótesis que resultaron falsas, y lo que **depende de Sergio Urcullo**.
- **Lo que está en vuelo se nombra con su riesgo.** El 4-sep un port de panel tenía CERO commits al
  cerrar: si la sesión moría, se perdía entero. Eso se dice, no se maquilla.
- Cerrar la sesión NO es terminar el trabajo: si algo quedó a medias, el handoff dice **dónde**
  (rama, worktree, commit) y **cómo se retoma**, no que "quedó pendiente".

---

# 2. Las tres que más se rompen

## Una sola fuente de verdad por tema (REGLA)

> Nace del 2026-08-15: había **cuatro precios vivos del mismo chatbot** (1.500+550 en el
> código, 650+350 en un cotizador público, 1.900+150 en propuestas ya firmables,
> 900-1.200+450-600 en el one-pager de la vendedora) y 95 documentos hablando de precios.
> Con eso, cualquier sesión elige mal.

- **Precios: mandan DOS archivos, y cada uno sobre lo suyo.** Ningún doc, propuesta,
  one-pager ni cotizador define precio: lo LEEN de ahí. Si un material dice otro número,
  está roto.
  - **Planes de suscripción → `onia-platform/lib/subscription-plans.ts`**
    (`DEFAULT_PLAN_AMOUNTS`): es el que valida el pago y el que se pisa por env var.
  - **Add-ons, empezando por el chatbot → `onia-platform/lib/pricing.ts`**.

  ⚠️ **Corregido 2026-08-20.** Acá decía que mandaba `pricing.ts` a secas, y es falso para
  los planes: `pricing.ts` sólo tiene add-ons y `subscription-plans.ts` se declara a sí
  mismo "FUENTE ÚNICA de los montos". La regla escrita mal mandaba a cada sesión al archivo
  equivocado — justo el error que esta regla existe para evitar.
- **Qué se vende: manda `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`**, con el estado
  real (vivo / construido sin probar / futuro).
- **A QUIÉN se le vende: manda `hermes-content/docs/ONIA_CLIENTE_IDEAL.md`.** Clínica de
  Santa Cruz con 2-6 profesionales y recepción; el dolor de entrada es el paciente con
  tratamiento a medias que no volvió, NO la facturación. Trae las 5 preguntas de
  calificación y a qué plan corresponde cada tamaño.

  ⚠️ **Nace de un fallo de siete semanas (2026-09-18):** la única definición de cliente
  vivía en `historial/ONIA_ENFOQUE_20260727.md` y se citaba como fuente desde la memoria,
  cuando `historial/` por esta misma regla NO es fuente. Un doc archivado que nadie marca
  como archivado se sigue leyendo como presente, y mandaba a vender con el perfil, los
  dolores y los planes viejos.
- **CÓMO se consiguen clientes (canales y su orden, competencia por adquisición, pauta de
  Meta): manda `hermes-content/docs/ONIA_ADQUISICION_Y_PAUTA.md`** (2026-09-30). Reemplaza a
  las fotos de agosto (`ONIA_PAUTA_COMPETENCIA_20260815.md`, `ONIA_ADS_CAMPANA_1_LISTA_20260813.md`).
  Ningún anuncio promete lo que producción no hace hoy: ese doc (§5.4) dice qué se puede
  prometer ya y qué recién con la 1.0 publicada (el Recall de tratamiento a medias).
- **Un tema = un archivo sin fecha.** Si cambia, se EDITA ese archivo; no se crea uno
  nuevo con la fecha de hoy.
- **Fecha en el nombre = historia.** `hermes-content/docs/historial/` son fotos de un día
  y NO son fuente de verdad. Si un doc con fecha contradice a uno sin fecha, gana el que
  no tiene fecha.
- Antes de escribir una cifra o una capacidad en material de cliente, **buscar si ya
  existe en otro lado**. Si hay dos versiones, no elegir la más linda: preguntar.
- **Una promesa que cambia se barre en TODA la superficie, no solo donde la estabas
  tocando.** Cuando cambia lo que el producto entrega, `grep` de la promesa vieja en todo
  el material de cliente ANTES de dar el cambio por hecho.

  > Nace del 2026-08-23: `/register` dejó de crear cuentas y el arreglo se hizo en
  > `/empezar` ("Pedí tu acceso"). La home nunca se enteró: quedaron **cuatro botones y
  > una FAQ** prometiendo "Probá 14 días gratis · te registrás y usás el sistema". El lead
  > hace clic esperando entrar y encuentra un formulario de solicitud — la fricción más
  > cara del sitio, en el último clic, y encima contradice el copy honesto de al lado.
  > Arreglar el síntoma donde saltó y no los hermanos que llaman a lo mismo deja el bug vivo.

  ⚠️ **Eso es HISTORIA, no el estado de hoy — corregido 2026-09-03.** El alta se volvió a
  **ABRIR** el 29-ago y este párrafo siguió leyéndose como presente durante cinco días. Hoy
  `app.onia.com.bo/register` **crea la cuenta solo**: asistente de dos pasos (elegís rubro →
  nombre, correo, contraseña, nombre del negocio) y botón "Crear mi cuenta — 14 días gratis";
  `/empezar` no tiene ni un `<form>` y sus CTA dicen "Creá tu cuenta". Medido en vivo, no de
  memoria: `docker exec onia-platform env | grep ALTA` → `ONIA_ALTA_AUTOMATICA=abierta`, y las
  dos pantallas abiertas y MIRADAS renderizadas.
  >
  > **La regla de arriba sigue intacta; lo que falló fue su ejemplo.** Una promesa que cambia se
  > barre en toda la superficie — y el barrido tiene que alcanzar también a **las reglas que la
  > citan**, porque un ejemplo congelado en pasado se lee como presente y manda al revés: hace
  > creer que la puerta está cerrada cuando está abierta. El estado vigente del alta se verifica
  > con el comando de arriba y con `web-factory/apps/onia-platform/src/app/(sitio)/alta.ts`
  > (que es un ESPEJO del producto, no la fuente).

## Verificar es MIRAR, no suponer (REGLA)

> Nace del mismo día: el login de producción mostraba los NOMBRES de los iconos como
> texto ("credit_card_off", "verified_user"). Yo lo había "verificado" varias veces con
> HTTP 200 y grep, sin abrirlo nunca. Lo encontró Sergio.

- **Toda pantalla que ve un cliente se abre y se MIRA renderizada** (Playwright +
  Chromium headless, y leer la captura). Un 200 y un grep no son verificación.
- **Verificar contra el sistema correcto.** Ese mismo día diagnostiqué la base contra un
  Supabase en la nube que ya no era producción, y declaré una página "no expuesta"
  probando el dominio equivocado — estaba viva en otro host.
- **Medir peso y tiempo real**, no solo que responda. Un 200 lento es un fallo con cara
  de éxito (la fuente de iconos pesaba 3,9 MB y tardaba 117 s).
- Un `grep` sirve para **descartar**, nunca para **confirmar** que algo se ve bien.
- **Un dato heredado no se ejecuta sin CONTARLO de nuevo.** El 2026-08-20 mi propio
  veredicto decía "de 136 workflows de n8n quedan 2" y "las 3 orgs son de QA": contados
  en vivo, 44 workflows estaban ACTIVOS (borrarlos apagaba producción) y una de las orgs
  tenía el único SUPERADMIN. Repetir una conclusión propia anterior también es repetir
  sin verificar.
- **El login NO prueba la base**: entra por Supabase Auth vía HTTPS, no por Prisma.

## Nada a medias — cerrar antes de abrir (REGLA)

> Sergio 2026-08-01: *"no dejar nada vacío… nunca arrancar algo nuevo sin concluir lo
> anterior"*. Nace de encontrar la capa multi-rubro construida y **apagada**.

- **Construido ≠ terminado.** Algo está hecho cuando está **encendido en producción y
  verificado ahí**. Un flag apagado, una migración sin aplicar o un módulo que nadie
  llama son trabajo con valor **cero**.
- **Prohibido reportar como hecho lo que está detrás de un flag apagado.**
- **Antes de abrir un frente nuevo se cierra el anterior**, o se anota con su estado exacto.
- **Al cerrar la sesión, escribir el HANDOFF del carril** en
  `hermes-content/docs/handoff/<carril>.md` — plantilla y decisiones en el README de esa
  carpeta. Siete campos: objetivo · qué quedó **en producción** · qué quedó a medias y dónde ·
  archivos · **intentos fallidos** · qué depende de Sergio · próximos pasos.
  Un archivo por carril, así dos worktrees abiertos no chocan al mergear.
  ⚠️ **No alcanza con confiar en la compactación**: el resumen es fiel pero no ELIGE — devuelve
  cada error y cada método descartado con el mismo peso que el estado actual. El campo de
  **intentos fallidos** es el que casi nadie escribe y el que evita repetir el callejón.

---

# 3. Producto y marca

## Hay UN solo producto (REGLA)

- **Onia Platform** (repo `onia-platform`), que se vende con **packs por rubro**.
  `DentalGest`, `GestiOS`, `Ganadero OS` y `ProveeGest` **NO son productos ni marcas**:
  son nombres viejos de packs. Al cliente se le nombra el rubro ("módulo dental").
- **No se le vende solo a clínicas**: son 5 rubros (dental, comercio, importadora, estética, servicios
  profesionales; `ONIA_CATALOGO_DE_VENTA.md`). Nada de "tus pacientes" en material
  genérico — el producto tiene vocabulario por rubro (`lib/onboarding/vocabulario.ts`,
  detalle en la skill `onia-frontend`).
- ⚠️ `Gestios` y `Ganaderos-Os` existen como repos pero son **legado**: no se les agrega
  nada sin decidir si se archivan o se absorben.
- **El SISTEMA es la oferta; el chatbot es un add-on.** Sergio, 2026-09-03: *"el sistema no
  ofrece directamente el bot, ofrece solo el sistema… hay inconsistencias en la web, datos que
  no son importantes, habla de nuestras competencias… la referencia es Lety y Dapta, mirá cómo
  venden"*. La web y todo material de venta hablan del sistema de gestión por rubro; el bot
  aparece como add-on (`pricing.ts`), nunca como el titular. **Cero autobombo**: nada sobre
  nosotros, nuestras competencias, nuestro equipo o datos que no le importan al dueño de un
  negocio. Cómo se vende se mide contra `lety.ai` y `dapta.ai` de HOY (titular, clics hasta
  empezar, un precio claro, beneficio antes que característica), no de memoria.

## La venta nunca exhibe obra (REGLA)

> Sergio, 2026-08-20: *"no entiendo por qué dices si es que estamos construyendo algo que
> aún no está listo… hace escapar a los clientes porque hacen creer que el sistema no
> funciona. Como regla nunca hagas eso."* La banda de Módulos de la landing tenía CINCO
> "muy pronto" en la pantalla de venta.

- En toda superficie que ve un cliente está PROHIBIDO comunicar estado de obra: "muy
  pronto", "en construcción", "beta", "próximamente", banners de borrador, listas de lo
  que falta. Un solo cartel contamina la percepción del producto entero.
- Lo que no está listo **no se nombra**. La demanda futura se captura sin admitir:
  "¿Otro rubro? Escribinos".
- Convive con "no fabricar": ni prometer lo inexistente NI exhibir lo incompleto — se
  habla solo de lo vivo. Docs internos y política de privacidad siguen siendo honestos
  sobre límites; la VENTA no.

## No hay equipo de ventas (REGLA)

> Sergio, 2026-08-27: *"ya no crees nada sobre vendedores, por el momento no tenemos
> equipo de ventas"*.

- **El que vende es Sergio.** No hay vendedora, ni colaboradores comerciales, ni nadie
  externo vendiendo Onia.
- **PROHIBIDO escribir material dirigido a un vendedor**: onboarding de vendedores,
  tablas de comisión, decks de reclutamiento, CRM de fuerza de ventas, runbooks de acceso
  para terceros. **Primero existe la persona, después el documento.** Al revés se llenó
  media carpeta de material para un puesto que nunca se ocupó — y peor: manda a cada
  sesión nueva a mantenerlo.
- **Material sobre CÓMO vender sí sirve** (guion de demo, objeciones, scripts, one-pager):
  lo usa Sergio. Vive en `hermes-content/sales-kit/`, con su README fijando el estado.
- Lo que asumía un vendedor tercero se archivó en `hermes-content/docs/historial/`. Las
  comisiones de `ONIA_WEB_COMO_SE_VENDE.md` quedan **suspendidas**, no borradas.
- ⚠️ Queda una **superficie huérfana viva**: `/vendedores/cotizador` y `/vendedores/webs`
  en `web-factory`. Son rutas publicadas para un puesto vacío. Bajarlas es decisión de
  Sergio.

## ONIA Core (REGLA)

- **Un rubro nuevo se ENCIENDE desde el core, no se escribe de cero.** Los 5 que se ofrecen ya
  están encendidos (dental, estética, servicios profesionales, comercio, importadora).
- **Orden de empuje (venta, pauta y desarrollo), decidido por Sergio Urcullo el 2026-09-29 y confirmado el 19-oct**
  (el «dental y estética» del 30-sep queda superado):
  dental → **importadora** → el resto. Comercio y servicios esperan a que la factura del SIN esté
  dentro del sistema: sin ella no compiten con los sistemas bolivianos que sí facturan.
  ⚠️ Antes decía «dental → comercio → importadora»; era el orden de ENCENDIDO de julio y se leía
  como prioridad.
- Todo lo demás del core (21 capacidades, `contract.json`, los 3 adapters, el validador
  obligatorio antes de commitear, `external_gate`) → **skill `onia-core`**.

## Base de producción (REGLA)

- Es **self-hosted en el VPS** (contenedor `supabase-db`, schema `public`), no la nube.
  Verificar contra el sistema correcto antes de diagnosticar.
- Detalle de base y deploy (RLS que las migraciones NO traen, search_path traicionero,
  backup antes de tocar datos, runbook y gates del swap) → **skills `onia-db` y
  `onia-deploy` en `onia-platform/.claude/skills/`**.

---

# 4. Cómo se trabaja

## Carriles (REGLA)

> El límite no es el plan de Claude: es el **choque** — mismos archivos, `main`, o infra
> única. Aislás eso y corrés todo lo demás en paralelo.

- Carril = 1 sesión = 1 worktree = 1 rama = 1 carpeta/repo. Repos distintos = paralelo
  libre; dentro de `onia-hermes`, cada carril su carpeta (AVISAR antes de tocar los 4
  archivos raíz de web-factory). **Infra (VPS, n8n, Supabase) = UN dueño a la vez.**
- Cerrar un carril: rama propia → rebase → commits chicos → gates (`tsc --noEmit`, tests,
  code-reviewer) → merge. Dueño de archivos por carril: `COORDINATION_MANIFEST.md`.

## Calidad de código (REGLA)

> Resumen de `~/.claude/rules/common/*` y `rules/web/*` (la nube no los ve), 10-oct-2026.

- **Código:** no mutar, crear objetos nuevos · funciones <50 líneas, archivos <800, anidación ≤4 · errores
  explícitos, nunca tragados · entradas validadas en el borde con esquema · sin valores fijos ni `console.log`.
- **Tests:** mínimo 80 % de cobertura (unitario + integración + E2E del flujo crítico) · test primero (rojo, verde,
  refactor) · si falla, se arregla la implementación, no el test, salvo que el test esté mal.
- **Revisión:** tras escribir código y antes de mergear, agente `code-reviewer` (`.claude/agents/`); CRITICAL bloquea,
  HIGH avisa. Auth, input de usuario, SQL, archivos, APIs externas, cripto y pagos → además `security-reviewer`.
- **Seguridad:** cero secretos en el código (entorno; secreto expuesto = se rota) · SQL parametrizado · HTML
  sanitizado, sin `innerHTML` crudo · CSRF donde se cambia estado y rate limit en los endpoints · errores sin
  datos sensibles.
- **Web:** CSP de producción, terceros async con SRI · LCP <2,5 s, INP <200 ms, CLS <0,1 · imágenes con ancho y alto,
  ≤2 familias de fuente, animar solo `transform`/`opacity` · capturas en 320/768/1024/1440, teclado, reduced-motion.

## `main` siempre compila (REGLA DURA)

- `main` avanza por PR revisado; solo la sesión principal (antes «madre») y el integrador lo mueven directo (regla
  «Git — auto-sync»). Esos dos: **nunca dejar que arrastre WIP parcial**. Si un archivo
  nuevo importa otro archivo nuevo, van los DOS o ninguno.
- `main` alimenta el deploy del VPS y el de Vercel: roto, rompe ambos.
- Ojo con el **casing de imports**: Linux distingue mayúsculas, Windows no.

## `main` se mueve DEBAJO tuyo mientras medís (REGLA)

> Sergio Urcullo / sesión de producto, 2026-09-06: tres pushes rechazados en un día. Entre
> las 22:15 de la noche y las 21:37 del día siguiente el integrador metió **28 commits** a
> `master`, y entre ellos tocó `Sidebar.tsx`, `LayoutShell.tsx` y `QuickActionsFab.tsx` —
> **los tres elementos cuya geometría esa sesión estaba midiendo** para arreglar la barra del
> asistente. La medición quedó inválida y nadie se enteró hasta el `git push`.

- **Antes de medir algo que otro puede mover** —geometría de UI, tamaño de un bundle, tiempos,
  cantidad de nada— **anotá el punto de partida**: `BASE=$(git rev-parse origin/main)`.
- **Antes de sacar la conclusión, preguntá si se movió el piso.** No hace falta construir
  nada: el dato ya está en `git`, y la respuesta son dos líneas.

  ```bash
  git fetch origin --quiet
  git rev-list --count "$BASE"..origin/main        # cuántos commits entraron mientras tanto
  git diff --name-only "$BASE"..origin/main        # y QUÉ archivos tocaron
  ```

  Si sabés qué archivos entran en tu medición, filtralos:
  `git diff --name-only "$BASE"..origin/main | grep -E 'Sidebar|LayoutShell|QuickActionsFab'`

- Si tocaron un archivo que entra en tu medición, **la medición se rehace**, no se corrige.
- ⚠️ **Un aviso por Telegram en cada merge NO es la solución**, aunque se pida así: el
  integrador mergea ~28 commits por día y ese canal ya le llega a Sergio Urcullo con 83
  tareas de a una. **La señal existe y es consultable; lo que faltaba era mirarla.**
  Sumar un notificador a un canal saturado es apagarlo.

## Git — auto-sync (REGLA)

- Commits conventional (`feat:`, `fix:`, `docs:`, `chore:`). El mensaje explica el **POR
  QUÉ**, no solo el qué.
- **Auto-sync activado**: al terminar, commitear y pushear la RAMA sin que lo pidan (hook
  `Stop` → `node scripts/git-autosync.js`).
- **`main` solo avanza por PR revisado** (Sergio Urcullo, 2026-10-05: *«sí, la madre sigue
  directo»*). El hook ya no hace fast-forward de `main`, salvo con permiso: la **sesión principal** (antes «madre») en la PC
  (`ONIA_AUTOSYNC_MAIN=1` en el `.claude/settings.local.json` de SU carpeta, que git ignora, y además
  la marca `onia-autosync-main` en el git-dir de SU checkout: los worktrees de sus subagentes no la tienen) y el
  **integrador** (`ONIA_LOOP_ID=onia-cola`). Una sesión parada en `main` sin permiso no lo pushea:
  sus commits van a `claude/autosync-<id de la sesión>` y la sesión queda parada en esa rama, para un PR.

  > Medido el 5-oct: desde el 28-sep, **48 de los 78 avances de `main`** entraron por ese
  > fast-forward sin que nadie los revisara, **23 desde sesiones de la nube** (Lucía y Marca
  > personal). Así entró #82 con «Hoy soy odontóloga». Y `main` llega al VPS como root en ~1 h.

  ⚠️ Frena el accidente, no a una sesión que pushee a `main` a propósito. El permiso nunca va en
  `.claude/settings.json` (el autosync se lo daría a todas las sesiones), ni en la config de usuario
  de la PC o una variable de Windows (alcanzaría a cualquier sesión de esa máquina).
  `pedido-rama.test.mjs` verifica que ningún `settings.local.json` esté versionado.
- Respeta `.gitignore`: nunca sube `.env`, claves ni `node_modules`. Assets y outputs sí.
- ⚠️ **Un merge con conflictos NUNCA se deja abierto al cerrar un turno.** El hook Stop
  corre el autosync, y `add -A` + commit convirtió 17 archivos CON marcadores `<<<<<<<`
  en un "resuelto" que hizo fast-forward a main (2026-08-20, cuando todavía lo hacía; el CI
  lo contuvo). El autosync ya tiene la guarda (se niega con MERGE_HEAD/paths unmerged), pero
  la regla es del que mergea: resolver ANTES de soltar el turno, y verificar cero marcadores.
- ⚠️ **El hook Stop puede publicar el estado A MEDIAS de un subagente** (hoy, solo en la sesión principal y
  el integrador, los únicos que mueven `main` directo; en el resto queda en su rama). El autosync corre
  cuando un subagente termina su turno, no cuando el trabajo está terminado. El 2026-08-23
  se llevó **217 líneas de CSS a `origin/main` antes de que existiera el markup que las
  usa** (`e4e7fa2a`), a mitad de una sesión que todavía tenía dos archivos por escribir.
  No rompió nada **por casualidad**: eran clases CSS sin usar, que no pueden romper un
  build. Al revés — markup que importa un archivo que aún no se commiteó — rompe `main`,
  que alimenta el deploy del VPS y el de Vercel.

  **La regla:** un subagente que trabaja en varios archivos deja el árbol en un estado que
  **compile solo** cada vez que suelta el turno, o no suelta el turno. Si un archivo nuevo
  importa otro archivo nuevo, van los DOS o ninguno — y eso ahora aplica también a "los dos
  todavía no están escritos". El orquestador verifica `git log origin/main` al cerrar.
- ⚠️ **Nunca buildear producción con un `.env.local` presente**: Next hornea los
  `NEXT_PUBLIC_*` en el bundle y publica `127.0.0.1`. Buildear en el VPS con `app.env`,
  y verificar el bundle antes del swap.

## Velocidad — no tardar en lo simple (REGLA)

- **Método correcto desde el PRIMER intento.** No shippear mediocre para iterar. UI:
  cargar `impeccable` + galería/tokens ANTES de codear.
- **Paralelizar agresivo.** Lo independiente va en subagentes concurrentes. Serializar
  solo lo que comparte archivos o estado.
- **Decidir y actuar.** Verificación fuerte solo para lo que toca producción, plata o
  `main`. Lo reversible y de bajo riesgo: hacerlo y seguir.
- **No re-hacer lo aprobado.** Diseño o plan ya aprobado se porta fiel, no se reabre.
- **Un rediseño se revisa renderizado antes de publicar**: el carril mira capturas a 390/1440 y verifica los
  gates, y después **le llega a Sergio Urcullo con esas capturas y espera su OK** (sección siguiente, 19-oct).

## Qué se publica sin preguntar (REGLA)

> Sergio Urcullo, 19-oct-2026: lo que ve un cliente o el público pasa por él con captura; el resto se publica solo
> tras la revisión. **Sustituye** el «lo trabajado y revisado se sube sin esperarlo» del 9-oct, que dejaba salir
> diseño y piezas públicas sin que él las viera. Historia: 2-oct «solo diseño nuevo y legales»; 9-oct «se sube nomás»
> (18 PRs frenados); 8-oct permiso de publicar por Buffer lo que pasara control de calidad.

- **Le llega con captura y espera su OK** todo lo que ve un cliente o el público: la web, los anuncios, las piezas de
  redes, las pantallas nuevas y los rediseños del producto. Va con la captura (390/1440 si es pantalla; la pieza
  completa si es contenido) o el video real, nunca un «revisá tal cosa». Con su OK se mergea y se publica.
- **Se publica solo tras la revisión** lo que no cambia nada visible: arreglos, código sin cambio en pantalla, bot,
  docs, migraciones (con backup y rollback según `onia-db`/`onia-deploy`) y cambios de infraestructura revisados.
  Pasa los gates del carril (tsc, tests, revisión), se mergea el PR, se corre el `publicar.sh` del destino y se MIRA
  en producción después. Se le avisa solo lo publicado.
- **Siguen pidiendo su sí** por su riesgo: gasto, contactar clientes o terceros, escribir datos de producción fuera de
  lo autorizado, el portal del SIAT, actos legales o firmas (van por Leslie Mercado Moreno) y la cara o la voz de él
  en servicios externos. En contenido, además: toda pieza que prometa o muestre una función del producto, lo que
  nombre o muestre a un cliente, tercero o competidor, los CTA de mecanismos sin probar (comentario → DM de
  Instagram: 2 rechazos de Meta) y la generación paga fuera de los lotes chicos de imagen (autorizar gasto no
  autoriza publicar). La vía verificada para Instagram sigue siendo Buffer por `ig-reel.mjs`.
- Cada PR que se le muestra va con su **enlace completo y una línea de qué hace** (19-oct).

## Dónde va cada cosa (REGLA)

Nada suelto en la raíz.

| Qué | Dónde |
|---|---|
| Doc de proceso o decisión | `hermes-content/docs/` (sin fecha si es fuente de verdad) |
| **Estado al cerrar un carril** | `hermes-content/docs/handoff/<carril>.md` (uno por carril, sin fecha) |
| Foto de un día | `hermes-content/docs/historial/` |
| Investigación | `hermes-content/docs/research/` |
| Competencia guardada | `hermes-content/research/competencia/` |
| Componente de UI | `hermes-content/references/ui-patterns/<patrón>/` |
| Patrón de movimiento | `web-factory/docs/MOTION_PATTERN_BANK_2026.md` |
| Análisis de video | `hermes-content/references/video-intake/` |
| Código de herramienta | `scripts/` o `.claude/skills/<skill>/scripts/` |

Si no sabés dónde va, **preguntá** antes de inventar carpeta.

## Cuándo separar un repo (REGLA)

- **Junto en `onia-hermes`**: el cerebro (docs, skills, memoria, propuestas), el core y
  la orquestación — se lee a sí mismo; fragmentarlo multiplica sincronización manual.
- **Separado** solo si cumple las TRES: cliente real, deploy propio, y el cliente NO debe
  ver el cerebro. Correctos hoy: `onia-platform` y Bolivian Electric.
- **NO separar por sensación de desorden**: el cruce se arregla con disciplina de cierre.

---

# 5. Dominios

## Propuestas comerciales (REGLA)

- **Nunca escribir HTML de propuesta a mano**: se genera con
  `hermes-content/propuestas/generador/` (`node generar-propuestas.js <slug> --pdf`).
- **Precios: se LEEN de `pricing.ts`.** Sin descuentos ni improvisación.
- **No fabricar**: cero clientes pagando ⇒ prohibido inventar testimonios, logos o cifras.
- Las 9 reglas completas (niveles por salto de valor, ROI, dominio/hosting del cliente,
  terceros excluidos, WhatsApp incluido vs chatbot cobrado, confidencialidad de
  plantillas) → **skill `onia-propuestas`** + fuente
  `hermes-content/skills/propuestas-comerciales-onia.md`.

## Publicidad que no parezca hecha por IA (REGLA)

> Origen: corrección de Sergio Urcullo, 2026-09-21. Una plantilla prolija no es una
> idea y una pieza que sólo “se ve ONIA” no necesariamente vende.

- **Una pieza tiene un trabajo de venta.** Debe mostrar dolor exacto del rubro,
  consecuencia económica, mecanismo comprobable y un solo CTA. Si se puede cambiar
  “clínica dental” por cualquier negocio y el copy sigue igual, se rechaza.
- **Prohibido el carrusel de afiches repetidos:** seis fondos iguales, titulares
  genéricos en mayúsculas y verde decorativo no cuentan como narrativa. Cada slide
  debe aportar una prueba visual distinta: interfaz real, proceso, tabla, decisión,
  objeto del trabajo o contexto humano.
- **La pauta de Onia Platform NO se hace con el estilo de la marca personal.**
  Sergio Urcullo, 2-oct: *«es diferente el contenido de la onia platform que el de mi
  cuenta personal, te dije que entres a ads library y veas qué es lo que funciona»*.
  - **Primero se estudia la Biblioteca, después se diseña.** Sergio Urcullo, mismo día:
    *«DEJA DE ARMAR, PRIMERO MIRA LA META ADS LIBRARY Y MIRA COMPETENCIAS»*. El formato
    sale de lo que sostienen los competidores (`ONIA_ADQUISICION_Y_PAUTA.md` §2.5), no de
    un pack nuestro. Desde la nube Facebook no abre: los creativos se capturan desde la PC.
  - Lleva la marca de la WEB (lockup `onia | dental`, letra Archivo, verde solo en lo que
    se aprieta: `web-factory/docs/ONIA_BRAND_IDENTITY_2026.md`), no la de la marca personal.
  - Lo que promete sale de `ONIA_CATALOGO_DE_VENTA.md`, no del código: el 2-oct se armó D4
    con el tratamiento a medias porque estaba en producción, y no encontraba a nadie.
  - El pack `referentes` es SOLO de la marca personal.
  ⚠️ **Corregido dos veces el 2-oct.** Acá decía `community-editorial` (rechazado el
  29-sep). Después decía `referentes` de la marca personal: así se armaron D1 y D4 v2
  con portada de arcilla verde y láminas de ensayo, y él aclaró que la pauta del
  producto es otra cosa.
- **Producto visible o no sale.** En pauta de software, al menos una parte central
  de la pieza debe enseñar UI real o una demostración verificable. No fabricar
  pantallas con IA ni reemplazar prueba por mockups decorativos.
- **UGC de IA significa presentador IA original**, si Sergio lo pide así. No cambiar
  silenciosamente a founder u operador real. El presentador explica y demuestra;
  nunca se hace pasar por cliente, odontólogo ni testimonio. Debe conservar
  imperfecciones naturales, continuidad de identidad, subtítulos y pantalla real.
- Antes de cerrar una creatividad, mirarla completa. Si sólo está “bonita” pero no
  permite reconocer el problema, entender el mecanismo y saber qué hacer después,
  se rehace.

Detalle operativo: skills `carruseles-onia` y `ugc-empresas-higgsfield`.

## Video — sin editores humanos (REGLA)

### Higgsfield — superficie, identidad y gasto (REGLA DURA)

- Fuente operativa: `hermes-content/docs/HIGGSFIELD_VIDEO_SYSTEM.md`. Para Lucía se
  leen además `hermes-content/references/modelos/lucia/LUCIA.md`,
  `BANCO-OFICIAL.md` y `LUCIA-HIGGSFIELD-IDENTITY.json`.
- **Claude Code y Codex usan la CLI oficial + Skills.** El MCP de Higgsfield queda
  para agentes de chat; la web se usa manualmente para administración visual de
  identidad y QA. No automatizar la web con Playwright desde el VPS para producir.
- La API queda para una fábrica futura con cola, presupuesto en USD, webhooks y
  claves por proyecto. No mezclar el saldo de API con los créditos del plan.
- Para Lucía no alcanza repetir un prompt ni encadenar una sola foto. Flujo:
  derechos/consentimiento resueltos -> banco coherente -> Soul candidato -> A/B
  contra Elements vigentes -> still aprobado -> image-to-video -> QA de identidad.
- **ONIA sobreescribe el default de la Skill oficial:** siempre ejecutar
  `higgsfield generate cost` antes de `generate create`, guardar modelo/params/costo
  y pedir aprobación explícita para cada generación de video. Nunca llamar
  `higgsfield auth token` en logs, chats o scripts.
- IDs, modelos, precios y saldos se resuelven en vivo. Lo escrito en bitácoras
  antiguas es evidencia histórica, no autorización ni catálogo vigente.

- **Revisión de montaje:** tabla de cortes + preview 360p revisados por el carril antes del master. Desde el
  19-oct el video que se publica le llega a Sergio Urcullo y espera su OK («Qué se publica sin preguntar»; sustituye
  el permiso del 8-oct y la regla del 9-oct). Nunca cortar a ciegas.
- **Gasto — actualización 8-oct, consolidada 2026-10-09:** cotizar y registrar
  brief, costo/cap y cantidad. Imágenes de prueba/opciones de estilo por pocos
  créditos (menos de ~5 por lote) tienen autorización previa: generar y mostrar
  el resultado después, sin fraccionar un lote mayor. Sustituye la exigencia de
  septiembre de aprobar toda imagen. Lotes grandes, video y entrenamiento Soul
  conservan aprobación específica; subir cara/voz de Sergio Urcullo a servicios
  externos también requiere el OK de Leslie Mercado Moreno. Precios y saldos
  históricos no son autorización. La excepción es de gasto, no de publicación.
- Cómo se ve un video, se transcribe, se corta, se subtitula y se rinde →
  **skills `ver-videos` y `editor-videos`** (HyperFrames vive en el repo,
  `.claude/skills/hyperframes*` y `.agents/skills/`, restaurado el 2026-10-02 porque con la
  copia global los archivos dejaron de editarse como quiere Sergio Urcullo; la del repo gana
  sobre la global: revisarlo ANTES de codear video).
- **Sacar el PROMPT de una imagen o un video de referencia → skill `sacar-prompt`.**
  Distingue **recuperar** (está en pantalla: se lee) de **reconstruir** (se escribe uno
  parecido, y se dice que lo es). Regla de entrada: **si el video habla es UGC, si
  impresiona es cine** — se elige la plantilla antes de escribir.
