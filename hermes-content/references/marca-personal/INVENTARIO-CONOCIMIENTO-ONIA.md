# Inventario de conocimiento enseñable de ONIA

Qué hizo ONIA de verdad y se puede enseñar con pasos replicables. Banco para ~60 videos
educativos de Sergio Urcullo sobre IA aplicada.

- **Armado:** 2026-09-29, rama `claude/marca-personal-contenido-ae658c`. Leído del repo
  (`CLAUDE.md`, `.claude/`, `scripts/`, `hermes-content/docs/`, `hermes-content/deploy/vps-ops/`,
  `hermes-content/sitio-sergiourcullo/`), de `onia-platform` (solo lectura) y de la memoria de
  Claude (`~/.claude/projects/C--dev-proyectos-onia-hermes/memory/`). Lo que viene solo de la
  memoria está marcado `(memoria)`: se re-verifica antes de grabar.
- **Regla de entrada:** sin evidencia no entra. Cada unidad nombra el archivo o el incidente con
  fecha. Cero secretos: no hay IPs, teléfonos, cuentas, NIT, IDs ni claves en este archivo, y
  ninguna unidad los necesita para enseñarse.
- **ONIA tiene 0 clientes pagando** (todas las cuentas de la plataforma son de prueba, dicho por
  Sergio Urcullo el 2026-09-24). Ninguna unidad habla de "mis clientes".
- **Ya guionado** = ya tiene guion en `hermes-content/docs/cola/GUIONES-PARA-GRABAR-2026-09-29.md`
  (V = vertical, YT = YouTube). No repetir el tema; usar la unidad para una segunda pieza o
  para el largo.

Leyenda: **Nivel** P = principiante, I = intermedio, A = avanzado. **Formato** V60 = vertical
60 s, HL = horizontal largo, CAR = carrusel. **Riesgo** Bajo / Medio / Alto, con cómo contarlo.

---

## Pilar 1 - Claude Code

### C-01 - El archivo de reglas que le cuenta a Claude por qué existe cada regla
- **Replica:** escribir un `CLAUDE.md` donde cada regla lleva el caso real que la originó
  ("una regla sin su historia se desobedece") y ordenarlo por cuándo se necesita.
- **Evidencia:** `CLAUDE.md` raíz (secciones "Al arrancar", "Las tres que más se rompen", cada
  regla con fecha e incidente).
- **Nivel:** P - **Formato:** V60 + HL - **Riesgo:** Bajo. Mostrar solo reglas genéricas; no
  hacer scroll por la parte de precios ni de VPS.

### C-02 - El canario: una regla tonta que te avisa que la sesión se degradó
- **Replica:** poner en `CLAUDE.md` una regla de forma fácil de ver (que te llame por nombre y
  apellido) y usarla como alarma: si deja de cumplirla, dejó de leer sus instrucciones.
- **Evidencia:** `CLAUDE.md` "Canario: se le dice Sergio Urcullo" (2026-09-04), con su límite
  explicado.
- **Nivel:** P - **Formato:** V60 - **Riesgo:** Bajo.

### C-03 - Hook Stop: que Claude haga commit y push solo al terminar
- **Replica:** `.claude/settings.json` con un hook `Stop` que corre un script de auto-sync;
  el script se niega si hay un merge a medias y compila antes de avanzar `main`.
- **Evidencia:** `.claude/settings.json`; `scripts/git-autosync.js` (guarda `MERGE_HEAD`,
  `tsc --noEmit` antes de avanzar main).
- **Nivel:** I - **Formato:** V60 (ya guionado: V5) + HL con las dos trampas (C-04) -
  **Riesgo:** Bajo.

### C-04 - Lo que el hook Stop te puede romper (y la guarda que lo evita)
- **Replica:** entender que el hook corre cuando termina el turno, no cuando termina el
  trabajo; dejar el árbol compilable en cada turno; no soltar un turno con conflictos abiertos.
- **Evidencia:** `CLAUDE.md` "Git - auto-sync": 17 archivos con marcadores `<<<<<<<` commiteados
  como resueltos (2026-08-20); 217 líneas de CSS publicadas antes que el markup (2026-08-23).
- **Nivel:** I - **Formato:** HL o CAR - **Riesgo:** Bajo.

### C-05 - Tu primera skill, y cuándo una skill es solo un puntero
- **Replica:** crear `.claude/skills/<nombre>/SKILL.md` con una `description` que diga cuándo
  se invoca; mantener el detalle en la fuente y la skill como "puntero + reglas + cuándo".
- **Evidencia:** `.claude/skills/README.md` (principio "punteros + reglas"); `.claude/skills/onia-router/SKILL.md`.
- **Nivel:** P - **Formato:** V60 (ya guionado: V6) + HL - **Riesgo:** Bajo.

### C-06 - Un router de skills: que la primera skill de la sesión elija las demás
- **Replica:** una skill índice que se invoca al arrancar y mapea tarea -> carril -> skills ->
  docs fuente, para no depender de que el modelo adivine entre cientos de skills instaladas.
- **Evidencia:** `.claude/skills/onia-router/SKILL.md` (196 skills globales + 9 plugins
  instalados según el propio archivo); `CLAUDE.md` "Skills del proyecto".
- **Nivel:** I - **Formato:** HL - **Riesgo:** Bajo.

### C-07 - Skill de continuidad: 4 minutos de lectura antes de decidir
- **Replica:** una skill que obliga a leer handoff, cola y docs del tema antes de planificar,
  y dice qué hacer cuando un doc resulta falso.
- **Evidencia:** `.claude/skills/onia-continuidad/SKILL.md`: el 2026-08-31, de 6 features
  planificadas 4 ya existían; de 10 "bloqueados", 4 no lo eran.
- **Nivel:** I - **Formato:** V60 - **Riesgo:** Bajo.

### C-08 - Handoff de siete campos para no perder el hilo entre sesiones
- **Replica:** al cerrar, escribir un archivo por carril con objetivo, qué quedó en
  producción, qué quedó a medias y dónde, archivos, intentos fallidos, qué depende de vos,
  próximos pasos; un disparador verbal ("cambio de sesión") lo activa.
- **Evidencia:** `hermes-content/docs/handoff/README.md`; `handoff/marca-personal.md`;
  `CLAUDE.md` "Cambio de sesión -> handoff completo".
- **Nivel:** P - **Formato:** V60 + CAR con la plantilla - **Riesgo:** Medio: los handoffs
  reales nombran rutas del VPS y estados de pagos; mostrar la plantilla, no un handoff real.

### C-09 - Subagentes: cuándo sí y cuándo retirarlos
- **Replica:** usar subagente solo para mucho trabajo en paralelo o para una revisión "con
  mente fresca"; retirar los que duplican lo que ya dice una skill.
- **Evidencia:** `.claude/agents/README.md` (3 vivos); `.claude/skills/onia-router/SKILL.md`
  (6 subagentes retirados el 2026-08-18 por duplicar skills); `hermes-content/docs/ONIA_AGENTES_MCP_AUDITORIA_ANTIPATRONES.md`.
- **Nivel:** I - **Formato:** HL - **Riesgo:** Bajo.

### C-10 - Auditoría de MCP: 24 servidores conectados, cero usados por escrito
- **Replica:** listar tus MCP, buscar cuántos se referencian en tus skills/agentes/docs, y
  desconectar los que nadie usa; revisar los tres antipatrones (volcar contexto, subagente
  que devuelve prosa, tool trivial).
- **Evidencia:** `hermes-content/docs/ONIA_AGENTES_MCP_AUDITORIA_ANTIPATRONES.md` (2026-08-18:
  68 agentes auditados, ~24 MCP, ~560 tools diferidas, 0 referencias `mcp__`).
- **Nivel:** A - **Formato:** HL - **Riesgo:** Bajo.

### C-11 - Worktrees y carriles: varias sesiones sin pisarse
- **Replica:** 1 carril = 1 sesión = 1 worktree = 1 rama; comandos git con `git -C <ruta>`;
  al despachar un subagente, darle la ruta exacta y que verifique la rama primero.
- **Evidencia:** `CLAUDE.md` "Carriles" y "Objetivo por sesión"; memoria
  `git-en-worktree-usar-git-C.md` y `feedback-subagentes-worktree-explicito.md`; 8 worktrees
  simultáneos medidos el 2026-09-05 (`CLAUDE.md`).
- **Nivel:** A - **Formato:** HL - **Riesgo:** Bajo.

### C-12 - Elegir modelo y esfuerzo por tarea, y no quemar la cuota de la semana
- **Replica:** modelo caro solo para escribir código o decidir; modelo barato para medir y
  redactar; no lanzar 3+ subagentes del modelo caro en paralelo; prompts estables para
  aprovechar el cache.
- **Evidencia:** `hermes-content/docs/ONIA_MODELOS_CLAUDE_Y_CUOTA.md` (límite semanal agotado
  el 2026-09-10, pool compartido entre web, Code y loops); `CONOCIMIENTO_DE_LOS_LOOPS.md` §1
  (04-sep: 13 de 15 loops en el modelo caro, 3 horarios se llevaban el 58 % de la cuota);
  `AI_MODEL_ROUTING_2026.md` (misma idea aplicada a Codex).
- **Nivel:** I - **Formato:** YT (ya guionado: YT Opus vs Sonnet, V1, V4) + V60 sobre la cuota -
  **Riesgo:** Medio: nombres y precios de modelos cambian; verificar en la doc oficial el día de
  grabar.

---

## Pilar 2 - Agentes y loops que trabajan solos

### A-01 - Cómo se arma un loop: un corredor para todos, un prompt por carril
- **Replica:** separar el script (lock, log, timeout, aviso) del prompt (qué hace y qué tiene
  prohibido); un loop nuevo = un `.md` + una línea de cron.
- **Evidencia:** `hermes-content/docs/COMO_SE_ARMA_UN_LOOP.md`; `scripts/loops/onia-loop.sh`.
- **Nivel:** A - **Formato:** HL - **Riesgo:** Medio: el doc cita rutas del servidor; mostrar
  el diagrama, no la terminal del VPS.

### A-02 - Las tres barandas que casi nadie pone: flock, cd verificado, aviso al morir
- **Replica:** `flock -n` para que una vuelta no se pise con la anterior; verificar el `cd`
  antes de trabajar; avisar una vez cada 6 h cuando falla.
- **Evidencia:** `COMO_SE_ARMA_UN_LOOP.md` (el guardián pasó semanas "diagnosticando" desde el
  directorio equivocado); `scripts/loops/onia-loop.sh` (bloque flock).
- **Nivel:** A - **Formato:** V60 - **Riesgo:** Bajo.

### A-03 - Claude Code en un servidor, sin API key: las trampas del modo headless
- **Replica:** correr `claude -p` con la suscripción; `unset ANTHROPIC_API_KEY`; tools en una
  sola cadena; prompt por stdin (`< prompt.md`).
- **Evidencia:** `COMO_SE_ARMA_UN_LOOP.md` "Las cinco trampas"; `hermes-content/deploy/vps-ops/claude-guardia.sh`.
- **Nivel:** A - **Formato:** HL - **Riesgo:** Medio: no mostrar archivos de credenciales ni
  el `.env`; contar la trampa con un ejemplo vacío.

### A-04 - El guardián: errores de producción diagnosticados por IA, parche aprobado por humano
- **Replica:** cron cada 10 min que lee errores nuevos de Sentry, corre Claude en modo solo
  lectura sobre logs y código, y manda diagnóstico + parche propuesto a Telegram; nunca aplica.
- **Evidencia:** `hermes-content/deploy/vps-ops/claude-guardia.sh`; memoria `claude-guardia-vps.md`
  (montado 2026-08-15/16).
- **Nivel:** A - **Formato:** HL - **Riesgo:** Medio: no mostrar tokens ni nombres de
  contenedores; mostrar un diagnóstico de ejemplo sin datos de usuarios.

### A-05 - Aprobaciones desde el celular: el loop pregunta, vos contestás "ok"
- **Replica:** el agente bloquea una tarea con motivo; un vigía cada 2 min la manda a Telegram
  (con foto o álbum si hay imagen); se contesta `ok <id>` / `no <id> motivo`.
- **Evidencia:** `scripts/loops/vigia-aprobaciones.sh` (2026-09-03: 11 tareas esperaban y
  nada le llegaba); memoria `onia-circuito-aprobaciones-telegram.md` (la forma de `block` que
  falla).
- **Nivel:** I - **Formato:** V60 + HL - **Riesgo:** Medio: el chat real tiene piezas y
  tareas internas; grabar con una tarea de prueba.

### A-06 - De 443 mensajes por día a un parte diario
- **Replica:** por defecto un aviso se convierte en tarea, no en mensaje; solo lo que requiere
  decisión humana sale directo; un solo resumen diario ("todo en orden" o lo que no se pudo
  arreglar).
- **Evidencia:** `scripts/loops/onia-tg.sh` (2026-09-04: 443 mensajes; 09-07: 226);
  `scripts/loops/parte-diario.sh`; memoria `hermes-gasto-bajar-no-subir.md` (el ruido era el
  gasto).
- **Nivel:** I - **Formato:** V60 - **Riesgo:** Bajo.

### A-07 - Vigías tontos: avisar por cambio, no por estado
- **Replica:** un vigía que lee, compara con la vez anterior y avisa solo al ponerse rojo y al
  recuperarse; no arregla solo.
- **Evidencia:** `scripts/loops/vigia-ci.sh` (2026-09-06: el CI rompió y se enteraron 10 min
  después, de casualidad); `scripts/loops/vigia-disco.sh`.
- **Nivel:** I - **Formato:** V60 - **Riesgo:** Bajo.

### A-08 - Canarios que prueban el camino, no el contenedor
- **Replica:** un chequeo cada 5 min que recorre el flujo real (pantalla de login + servicio
  de auth) en vez de mirar si el contenedor está "Up".
- **Evidencia:** `hermes-content/deploy/vps-ops/auth-canary.sh` (2026-08-16: el registro estuvo
  caído ~10 h con todos los contenedores "Up").
- **Nivel:** I - **Formato:** V60 - **Riesgo:** Bajo.

### A-09 - Memoria compartida para muchos agentes sin corromperla
- **Replica:** cada agente deja su aprendizaje en una bandeja; un solo consolidador con cerrojo
  lo mete en la memoria; tope por bytes y archivo para lo que no cabe.
- **Evidencia:** `scripts/loops/aprender.sh`; `scripts/loops/consolidar-memoria.sh`;
  `CONOCIMIENTO_DE_LOS_LOOPS.md` §1 (corregido 2026-09-26: 278 lecciones desviadas sin aviso
  porque el aviso medía la variable equivocada).
- **Nivel:** A - **Formato:** HL - **Riesgo:** Bajo.

### A-10 - Que el sistema no repita errores: extractor de fallos sin modelo
- **Replica:** un script sin IA que cuenta en los logs lo que se repite (umbral 2: una vez es
  mala suerte, dos es patrón) y un agente supervisor que escribe la lección.
- **Evidencia:** `scripts/loops/extraer-fallos.sh` (2026-09-04); `hermes-content/docs/handoff/supervisor.md`.
- **Nivel:** A - **Formato:** HL - **Riesgo:** Bajo.

### A-11 - Un loop sin cola inventa trabajo
- **Replica:** antes de automatizar un carril, tener una cola de ítems reales y verificables;
  medir contra producción al arrancar cada vuelta.
- **Evidencia:** `COMO_SE_ARMA_UN_LOOP.md` (entre 25 % y 46 % de lo declarado pendiente no
  existía); memoria `loops-objetivo-medible-leer-lo-real.md` (2026-09-03).
- **Nivel:** I - **Formato:** V60 - **Riesgo:** Bajo.

---

## Pilar 3 - Automatización n8n y WhatsApp

### W-01 - La ventana de 24 h de WhatsApp y la plantilla aprobada
- **Replica:** dentro de 24 h desde el último mensaje del cliente, texto libre; fuera,
  plantilla aprobada por Meta; apuntar el seguimiento a las 20 h para tener colchón.
- **Evidencia:** `hermes-content/deploy/vps-ops/bot/followup-run.mjs` (reglas duras, error
  131047 fuera de ventana).
- **Nivel:** I - **Formato:** V60 (ya guionado: V8) + HL - **Riesgo:** Medio: costos por
  mensaje de Meta cambian; el cambio del 1-oct no está confirmado para LatAm (handoff
  marca-personal §5.8). No citar tarifas sin fuente del día.

### W-02 - Barridos que no escriben de madrugada
- **Replica:** todo envío automático pasa por una ventana horaria en tu zona, y un test que
  falla si algún barrido decide la hora por su cuenta.
- **Evidencia:** `bot/barridos-no-escriben-de-madrugada.test.mjs`; `bot/ventanas-de-atencion.mjs`
  (hasta 2026-09-13 el bot ofrecía un horario y prometía otro).
- **Nivel:** I - **Formato:** V60 - **Riesgo:** Bajo.

### W-03 - El mensaje que llega cuando tu webhook está caído
- **Replica:** asumir que el proveedor no reintenta; un barrido de rescate busca mensajes
  entrantes sin respuesta y los contesta.
- **Evidencia:** `bot/rescate-run.mjs` (medido 2026-09-03: 20 reinicios del webhook entre el
  28-ago y el 3-sep; cada uno podía dejar a alguien colgado).
- **Nivel:** A - **Formato:** HL - **Riesgo:** Bajo (no mostrar números de conversación).

### W-04 - Deduplicar mensajes: por qué tu bot contesta dos veces
- **Replica:** filtro en memoria por id de mensaje al entrar + dedup durable en base; los dos,
  en ese orden.
- **Evidencia:** `bot/message-dedup.mjs` (Chatwoot reentrega el mismo evento ante timeout).
- **Nivel:** I - **Formato:** V60 - **Riesgo:** Bajo.

### W-05 - Asegurar el webhook: firma HMAC + secreto en la ruta
- **Replica:** verificar la firma del proveedor y, por si no firma, poner un secreto largo en
  la URL; sin eso cualquiera le hace decir cosas a tu bot.
- **Evidencia:** `bot/webhook-security.mjs`; `bot/webhook-security.test.mjs`.
- **Nivel:** A - **Formato:** V60 - **Riesgo:** Medio: nunca mostrar la URL real ni el
  secreto; usar placeholders.

### W-06 - Guardrails deterministas sobre lo que dice el LLM
- **Replica:** normalizar el texto, probar regex de lo prohibido (precios, diagnósticos,
  promesas) y, si matchea, descartar la respuesta entera por un texto seguro; regex sin `/g`.
- **Evidencia:** `bot/guardrails.mjs` (tres detalles que son test).
- **Nivel:** I - **Formato:** V60 + HL - **Riesgo:** Bajo.

### W-07 - Separar lógica de hechos: el bot que se edita sin redeploy
- **Replica:** lo que puede hacer mentir o cotizar al bot queda en código con tests; horarios,
  FAQ y datos del negocio en un JSON validado "todo o nada".
- **Evidencia:** `bot/knowledge.mjs` (la frontera lógica/hecho); `bot/knowledge.example.json`.
- **Nivel:** I - **Formato:** HL - **Riesgo:** Bajo (usar el `.example`, no el vivo).

### W-08 - Notas de voz y fotos en el bot
- **Replica:** transcribir el audio y meterlo al mismo guion como si fuera texto; describir
  fotos con un modelo barato y pasar la descripción por los guardrails.
- **Evidencia:** `bot/audio-transcribe.mjs` (los modelos distil solo-inglés TRADUCEN en vez de
  transcribir); `bot/vision.mjs` (medido US$ 0,0007 por foto). Ojo: la auditoría del 24-sep
  (memoria `agentes-ia-sin-llm-auditoria-24-sep.md`) dice que el audio hoy va por un modelo de
  OpenAI directo, no por Speaches; confirmar el camino vivo antes de grabar.
- **Nivel:** I - **Formato:** V60 - **Riesgo:** Medio: grabar con audios y fotos propios, nunca
  de un prospecto.

### W-09 - Medir si tu bot entiende (no "me parece que mejoró")
- **Replica:** un banco de casos reales ("¿cuánto sale?", "somos 3") que llama a la misma
  función de producción y reporta aciertos.
- **Evidencia:** `bot/bench.mjs`, `bot/bench-cases.mjs`, `bot/evals/`.
- **Nivel:** A - **Formato:** HL - **Riesgo:** Bajo.

### W-10 - No te escribas a vos mismo: excluir contactos de prueba de los barridos
- **Replica:** marcar qué contactos son tuyos (sondas, QA, tu número) y excluirlos antes de
  cualquier envío masivo.
- **Evidencia:** `bot/es-nuestra.mjs` (2026-09-18: de 3 filas a contactar, 2 eran propias).
- **Nivel:** P - **Formato:** V60 - **Riesgo:** Medio: el archivo contiene números reales; no
  mostrarlo en pantalla, contar el caso.

### W-11 - n8n sin secretos en los nodos, y los 44 activos que casi se borran
- **Replica:** secretos en credenciales de n8n o variables de entorno, nunca en el nodo;
  redactar el export antes de commitear; contar en vivo antes de borrar.
- **Evidencia:** `CLAUDE.md` "Verificar es MIRAR" (2026-08-20: "quedan 2" eran 44 activos);
  regla n8n de `~/.claude/CLAUDE.md` (2026-08-22: 7 workflows con claves en el JSON).
- **Nivel:** I - **Formato:** V60 (ya guionado: V9) + CAR sobre secretos - **Riesgo:** Alto:
  la regla registra que una clave terminó publicada en GitHub. Contarlo solo como "una clave
  terminó en un repo", sin proveedor ni repo, y después de confirmar que se rotó.

---

## Pilar 4 - Contenido con IA

### V-01 - Editar un video sin editor: cortar silencios y muletillas por código
- **Replica:** transcribir con timestamps por palabra, generar un plan de cortes, revisarlo en
  una tabla antes de cortar, y cortar con ffmpeg.
- **Evidencia:** `.claude/skills/editor-videos/SKILL.md`; `.claude/skills/editor-videos/scripts/cut-plan.mjs`
  (+ test); `CLAUDE.md` "tabla de cortes + preview 360p SIEMPRE a Sergio antes de cortar".
- **Nivel:** I - **Formato:** V60 (ya guionado: V7) + HL paso a paso - **Riesgo:** Bajo.

### V-02 - Subtítulos karaoke y zooms sincronizados con lo que decís
- **Replica:** subtítulos por palabra con la persona recortada adelante; zoom en la palabra
  clave; sincronía palabra -> elemento.
- **Evidencia:** `.claude/skills/embedded-captions/SKILL.md`; `editor-videos/scripts/karaoke-captions.mjs`,
  `zoom-punch.mjs`, `sync-plan.mjs`.
- **Nivel:** I - **Formato:** V60 - **Riesgo:** Bajo.

### V-03 - Difuminar caras de terceros antes de publicar
- **Replica:** detectar caras y difuminar las de quien no dio permiso.
- **Evidencia:** `editor-videos/scripts/blur-faces.mjs`, `blur-faces-detect.py`.
- **Nivel:** P - **Formato:** V60 - **Riesgo:** Bajo.

### V-04 - Que la IA "vea" un video, y cómo decir cuánto vio de verdad
- **Replica:** modelo que mira el video nativo (imagen + audio); sin él, fotogramas +
  transcripción, reportando la cobertura real ("vi N de M fotogramas").
- **Evidencia:** `.claude/skills/ver-videos/SKILL.md`; `scripts/video-intake.mjs` (link ->
  escenas -> transcripción -> ficha).
- **Nivel:** I - **Formato:** V60 + HL - **Riesgo:** Bajo.

### V-05 - Sacar el prompt de una imagen o un video: recuperar vs reconstruir
- **Replica:** primero buscar si el prompt está en pantalla (muchos lo muestran); si no, escribir
  uno parecido y decir que es una reconstrucción.
- **Evidencia:** `.claude/skills/sacar-prompt/SKILL.md` (método salido de ~58 reels analizados).
- **Nivel:** P - **Formato:** V60 + CAR - **Riesgo:** Bajo (no mostrar el contenido ajeno más
  que en cita breve).

### V-06 - Carruseles por código: de un JSON a las láminas
- **Replica:** un brief JSON con roles de lámina (portada, lo que está en juego, una idea por
  lámina, cierre) que se renderiza a PNG con un navegador headless en 3 formatos.
- **Evidencia:** `scripts/carousel_render.js` (+ `carousel_render.test.js`); `scripts/marca-personal/generar-carrusel-*.py`.
- **Nivel:** I - **Formato:** HL + CAR (hecho con el propio motor) - **Riesgo:** Bajo.

### V-07 - El verde de marca que no se puede leer: contraste medido
- **Replica:** medir el contraste del color de marca; usarlo como superficie y bajar su
  luminosidad para texto (1,7:1 contra 5,4:1).
- **Evidencia:** `hermes-content/sitio-sergiourcullo/README.md` "El verde va en dos tonos";
  `scripts/marca-personal/experimento-verde-marca.py`.
- **Nivel:** P - **Formato:** V60 o CAR - **Riesgo:** Bajo.

### V-08 - Video desde HTML: HyperFrames
- **Replica:** escribir la escena como HTML con tiempos y renderizarla a MP4; decks de YouTube
  generados por código.
- **Evidencia:** `.claude/skills/hyperframes/`; `scripts/generate_youtube_teaching_decks.mjs`;
  `SERIE_CLAUDE_CODE.md` (decks en `hermes-content/carousels/out/yt-*/`).
- **Nivel:** A - **Formato:** HL - **Riesgo:** Bajo. HyperFrames es de terceros: decir que se
  usa, no que se hizo.

### V-09 - Generar con IA sin fundirte: costo antes de crear, aprobación por lote
- **Replica:** consultar el costo antes de cada generación, guardar modelo/parámetros/costo,
  aprobar por lote; video siempre con aprobación específica.
- **Evidencia:** `CLAUDE.md` "Higgsfield - superficie, identidad y gasto" y "Gasto - regla vigente
  2026-09-22"; `hermes-content/docs/HIGGSFIELD_VIDEO_SYSTEM.md`; memoria
  `higgsfield-cobro-anual-no-deseado.md` (2026-09-01: plan anual cobrado sin querer, sin botón de
  bajar de plan).
- **Nivel:** I - **Formato:** V60 - **Riesgo:** Medio: el reclamo del cobro anual estaba
  pendiente; no nombrar montos ni la cuenta; contarlo como "leé cómo se baja de plan antes de
  suscribirte".

### V-10 - Grabar con el iPhone como cámara, y la miniatura que se busca puntuando
- **Replica:** iPhone por USB como cámara en OBS, perfil y nivel de audio verificados con una
  grabación de prueba; la miniatura sale de puntuar todos los fotogramas, no de elegir a ojo.
- **Evidencia:** `hermes-content/docs/handoff/yt-canal.md` (2026-09-06); memoria
  `miniatura-youtube-metodo.md` (detalle en la skill editor-videos).
- **Nivel:** P - **Formato:** V60 + HL - **Riesgo:** Bajo.

---

## Pilar 5 - Construir y vender un SaaS desde Bolivia

### S-01 - Un producto, muchos rubros: el vocabulario cambia, el sistema no
- **Replica:** un solo producto con packs por rubro y una capa de vocabulario ("pacientes" en
  una clínica, "clientes" en una importadora) en vez de un producto por rubro.
- **Evidencia:** `onia-platform/lib/onboarding/vocabulario.ts`; `onia-platform/lib/platform/rubros-activos.ts`;
  `CLAUDE.md` "Hay UN solo producto".
- **Nivel:** I - **Formato:** HL - **Riesgo:** Bajo.

### S-02 - El precio vive en un solo archivo (y tests que lo defienden)
- **Replica:** una fuente única de montos que valida el pago y alimenta la UI; tests que fallan
  si la copia de venta promete algo que el producto no hace.
- **Evidencia:** `onia-platform/lib/subscription-plans.ts`, `lib/pricing.ts`,
  `lib/pricing-honestidad.test.ts`; `scripts/venta-honestidad.test.mjs` (2026-08-31: "el bot
  agenda" era falso); `CLAUDE.md` (2026-08-15: cuatro precios vivos del mismo chatbot).
- **Nivel:** I - **Formato:** V60 + HL - **Riesgo:** Medio: se puede decir el precio público
  vigente leído de `lib/pricing.ts` el día de grabar; no mostrar márgenes ni costos internos.

### S-03 - ¿Necesito inversión? La cuenta del punto de equilibrio
- **Replica:** `gasto mensual / precio del plan` = clientes para no perder plata; separar
  "problema de rentabilidad" de "problema de clientes".
- **Evidencia:** `hermes-content/docs/ONIA_ESTRATEGIA_DE_EMPRESA.md` §0, §4 y §8 (≈5 clientes,
  medido 2026-09-05).
- **Nivel:** P - **Formato:** V60 + HL - **Riesgo:** Medio: es aritmética sobre costos, no
  ingresos; no es consejo financiero para el espectador. No citar márgenes internos.

### S-04 - El test de tres preguntas antes de agregar algo a tu producto
- **Replica:** ¿se le vende al mismo cliente que ya paga? ¿deja de tener sentido sin el núcleo?
  ¿se entrega sin horas tuyas por cliente? Si falla una, es un negocio nuevo disfrazado.
- **Evidencia:** `ONIA_ESTRATEGIA_DE_EMPRESA.md` §10 y §14; `CLAUDE.md` (nueve líneas de negocio
  activas con una persona, 2026-09-05).
- **Nivel:** P - **Formato:** V60 + CAR - **Riesgo:** Bajo.

### S-05 - Definir a tu cliente con criterios que se preguntan en dos minutos
- **Replica:** 6 criterios verificables (tamaño, recepción, ciudad, régimen fiscal, tipo de
  servicio, cómo agenda hoy) y el dolor de entrada, en vez de adjetivos.
- **Evidencia:** `hermes-content/docs/ONIA_CLIENTE_IDEAL.md` (2026-09-18: la única definición
  estuvo 7 semanas archivada).
- **Nivel:** P - **Formato:** V60 + CAR - **Riesgo:** Medio: el doc cita una conversación real
  del 25-ago; no mostrar datos de esa clínica.

### S-06 - Cobrar en Bolivia sin Stripe: QR, comprobante y un vigía que no deja pagos colgados
- **Replica:** el cliente paga por QR bancario y sube el comprobante; el pago queda pendiente y
  un vigía avisa hasta que alguien lo aprueba; el cobro por API del banco se arma primero en modo
  simulado con la misma forma que la API real.
- **Evidencia:** `onia-platform/components/billing/QRPaymentModal.tsx`; `hermes-content/deploy/vps-ops/vigia-comprobantes.sh`
  (2026-09-24); `bot/bcp-qr.mjs` (modo mock, "el bot jamás cobra solo"); `handoff/cobro-e2e.md`
  (cobro probado E2E el 10-sep). Que Stripe no opera para comercios bolivianos viene de memoria
  (`lety-cobra-tarjeta-antes-del-trial.md`): confirmar en fuente de Stripe.
- **Nivel:** I - **Formato:** HL - **Riesgo:** Alto: nunca mostrar la cuenta de cobro, el
  contacto del banco ni documentos; la integración por API del banco está en trámite.

### S-07 - Facturación electrónica SIAT: lo que el SIN cuenta de verdad
- **Replica:** entender que la homologación mide cobertura (combinaciones de punto de venta x
  documento) y no volumen; firma digital por modalidad; leer el avance en el portal, no en tu
  archivo de estado.
- **Evidencia:** `hermes-content/docs/handoff/fiscal.md` (2026-09-13: etapa de firma 690/690
  validada en piloto); memoria `siat-sistema-9473-trabado-modalidad.md` (2026-08-27: el archivo
  decía "fase completa" y el portal 24,8 %); `.claude/skills/onia-contabilidad-bolivia/`.
- **Nivel:** A - **Formato:** HL - **Riesgo:** Alto: no mostrar NIT, códigos del sistema ni el
  portal con sesión; ONIA no está homologada (límite 04-11-2026).

### S-08 - Catálogo honesto: vivo, sin estrenar, futuro, bloqueado
- **Replica:** clasificar cada cosa que vendés en cuatro estados y nombrar al cliente solo lo que
  existe; "construido no es terminado".
- **Evidencia:** `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` "Los tres estados"; `CLAUDE.md`
  "Nada a medias".
- **Nivel:** P - **Formato:** V60 - **Riesgo:** Bajo.

### S-09 - Agentes de negocio sin LLM: reglas + plantillas, costo de API cero
- **Replica:** muchos "agentes" (recordatorio, cobranza, seguimiento) se resuelven con reglas y
  plantillas; usar LLM solo donde el texto libre lo exige.
- **Evidencia:** memoria `onia-agentes-costo-api-cero.md` y `agentes-ia-sin-llm-auditoria-24-sep.md`
  (auditoría 24-sep: los 6 agentes no llaman a ningún modelo; el bot usa IA en muy pocos turnos);
  `onia-platform/lib/onia-core/modules/`.
- **Nivel:** I - **Formato:** V60 + HL - **Riesgo:** Alto: el producto los vende como "Agentes
  con IA" y la corrección estaba pendiente de Sergio Urcullo. Contarlo como lección ("no todo
  necesita IA"), nunca como "mis agentes de IA".

---

## Pilar 6 - Errores reales y lecciones

### E-01 - "Verificado" con un 200 y un grep, y la pantalla mostraba texto roto
- **Replica:** abrir y mirar la pantalla renderizada (captura headless) antes de dar algo por
  verificado; medir peso y tiempo.
- **Evidencia:** `CLAUDE.md` "Verificar es MIRAR" (login mostraba nombres de iconos como texto;
  la fuente de iconos pesaba 3,9 MB y tardaba 117 s); `scripts/canario_visual.mjs`.
- **Nivel:** P - **Formato:** V60 + HL - **Riesgo:** Bajo.

### E-02 - Arreglaste el botón, pero la home seguía prometiendo lo viejo
- **Replica:** cuando cambia una promesa, `grep` de la frase vieja en toda la superficie y en
  las reglas que la citan.
- **Evidencia:** `CLAUDE.md` (2026-08-23: cuatro botones y una FAQ prometían "Probá 14 días"
  con el alta cerrada; corregido 2026-09-03 cuando se reabrió).
- **Nivel:** P - **Formato:** V60 - **Riesgo:** Bajo.

### E-03 - Publicar un rediseño sin que el dueño lo vea terminado
- **Replica:** construir y publicar son dos permisos distintos; mostrar la pieza renderizada y
  esperar el OK sobre esa pieza.
- **Evidencia:** `CLAUDE.md` "Velocidad" (2026-08-20: landing v2 publicada, rechazada y
  revertida en producción).
- **Nivel:** P - **Formato:** V60 - **Riesgo:** Bajo.

### E-04 - "La venta nunca exhibe obra"
- **Replica:** quitar de toda pantalla de venta los "muy pronto", "beta" y listas de lo que
  falta; capturar la demanda sin admitir ("¿Otro rubro? Escribinos").
- **Evidencia:** `CLAUDE.md` (2026-08-20: cinco "muy pronto" en la landing).
- **Nivel:** P - **Formato:** V60 + CAR - **Riesgo:** Bajo.

### E-05 - Tu repo se mueve debajo tuyo mientras medís
- **Replica:** anotar `origin/main` antes de medir; antes de concluir, contar commits nuevos y
  qué archivos tocaron; si tocaron lo medido, se rehace.
- **Evidencia:** `CLAUDE.md` "`main` se mueve DEBAJO tuyo" (2026-09-06: 28 commits en un día
  tocaron los tres componentes que se estaban midiendo).
- **Nivel:** A - **Formato:** V60 - **Riesgo:** Bajo.

### E-06 - El documento archivado que se seguía leyendo como presente
- **Replica:** un tema = un archivo sin fecha; fecha en el nombre = historia; si se contradicen,
  gana el sin fecha.
- **Evidencia:** `CLAUDE.md` "Una sola fuente de verdad" (2026-09-18: 7 semanas);
  `ONIA_CLIENTE_IDEAL.md` (reemplazo).
- **Nivel:** P - **Formato:** V60 - **Riesgo:** Bajo.

### E-07 - El vigía que gritaba vacío: 41 días ciego
- **Replica:** un monitor que falla en silencio es peor que ninguno: que el error del chequeo
  no vaya a `/dev/null`, que mire una clase de problema y no una lista fija.
- **Evidencia:** `hermes-content/deploy/vps-ops/security-watch.sh` (reescrito 2026-09-24);
  `vigia-credito-ia.sh` (del 9 al 17-sep el proveedor de IA se quedó sin crédito, 194 llamadas
  fallidas, y el bot respondió con texto fijo sin que nadie lo notara).
- **Nivel:** I - **Formato:** V60 + HL - **Riesgo:** Alto: `security-watch.sh` describe una
  exposición de tablas de base. Contar solo el patrón "el vigía miraba un contenedor que ya no
  existía", sin tablas, esquemas ni roles, y después de confirmar que está cerrado.

### E-08 - El servidor estrangulado por un modelo local
- **Replica:** un modelo local sin GPU en un VPS compartido puede hacer que el proveedor te
  penalice; medir el "steal" de CPU, no solo la carga.
- **Evidencia:** memoria `n8n-webhook-meta-tormenta-reintentos.md` y `vps-saturado-deploy-bloqueado.md`
  (2026-08-24: carga 158, steal 93 %; recuperado 28-ago); `bot/vision.mjs` (modelo local
  descartado por eso).
- **Nivel:** I - **Formato:** V60 - **Riesgo:** Medio: no nombrar la IP ni el plan; confirmar
  cifras en el log antes de grabar.

### E-09 - Construido y apagado vale cero
- **Replica:** "hecho" = encendido en producción y verificado ahí; prohibido reportar como hecho
  lo que está detrás de un flag apagado.
- **Evidencia:** `CLAUDE.md` "Nada a medias" (2026-08-01: capa multi-rubro construida y
  apagada); `hermes-content/docs/CONOCIMIENTO_DE_LOS_LOOPS.md` §2 (las tres medidas: mergeado,
  construido, vivo).
- **Nivel:** P - **Formato:** V60 - **Riesgo:** Bajo.

---

## Pilar 7 - Web y landing con IA

### L-01 - Un generador de webs: JSON del cliente -> template -> HTML estático
- **Replica:** perfil del negocio en JSON, bloques y templates reutilizables, salida HTML+CSS
  estática; no escribir cada web a mano.
- **Evidencia:** `.claude/skills/onia-web-factory/SKILL.md`; `web-factory/FACTORY.md`,
  `web-factory/INTAKE_CLIENTE.md`.
- **Nivel:** I - **Formato:** HL - **Riesgo:** Medio: generar con un negocio ficticio marcado
  como ejemplo; hoy las webs generadas no tienen camino de publicación (ver sección final).

### L-02 - Una web personal sin build ni dependencias
- **Replica:** HTML + un CSS, rutas absolutas, servido tal cual en un hosting estático; páginas
  "solo comunidad" con `noindex` sabiendo que eso no es seguridad.
- **Evidencia:** `hermes-content/sitio-sergiourcullo/README.md`; guías `/stack`, `/vps`,
  `/homelab`, `/claude-code`.
- **Nivel:** P - **Formato:** V60 + HL - **Riesgo:** Bajo.

### L-03 - Canario visual: capturas por viewport, peso y tiempo de cada pantalla
- **Replica:** script con navegador headless que abre N pantallas, captura por viewport (no
  `fullPage`: rompe headers sticky) y compara peso contra la corrida anterior.
- **Evidencia:** `scripts/canario_visual.mjs`; `hermes-content/docs/handoff/canario-visual.md`
  (2026-09-02: una página cayó de 2.231 KB a 449 KB, el widget dejó de cargar).
- **Nivel:** I - **Formato:** V60 + HL - **Riesgo:** Bajo.

### L-04 - Propuestas comerciales generadas, nunca HTML a mano
- **Replica:** un generador que arma la propuesta desde datos + precios de la fuente única y la
  exporta a PDF (`node generar-propuestas.js <slug> --pdf`).
- **Evidencia:** `hermes-content/propuestas/generador/generar-propuestas.js` (+ test);
  `.claude/skills/onia-propuestas/SKILL.md`.
- **Nivel:** I - **Formato:** HL - **Riesgo:** Alto: `clientes.json` tiene datos de prospectos;
  grabar con un slug de ejemplo y no abrir ese archivo.

### L-05 - Probá el recorrido entero: del botón de la web a lo que contesta el bot
- **Replica:** seguir el camino de un visitante de punta a punta (formulario -> WhatsApp -> bot)
  y verificar qué recibe al final.
- **Evidencia:** memoria `web-lead-bot-lo-trata-como-pregunta-precio.md` (2026-09-17: el pedido
  de web llegaba al bot como pregunta de precio de la plataforma); `handoff/web-creator.md`.
- **Nivel:** P - **Formato:** V60 - **Riesgo:** Medio: confirmar si ya se corrigió antes de
  contarlo en presente.

---

## Conteo

| Pilar | Unidades |
|---|---|
| 1 Claude Code | 12 |
| 2 Agentes y loops | 11 |
| 3 n8n y WhatsApp | 11 |
| 4 Contenido con IA | 10 |
| 5 SaaS desde Bolivia | 9 |
| 6 Errores y lecciones | 9 |
| 7 Web y landing | 5 |
| **Total** | **67** |

---

## Lo que NO se puede afirmar en cámara

1. **Clientes.** ONIA tiene 0 clientes pagando; todas las cuentas de la plataforma son de
   prueba (Sergio Urcullo, 2026-09-24). Nada de "mis clientes", testimonios, logos, casos de
   éxito ni "le ahorré X a un negocio". La clínica que escribió el 25-ago es un prospecto.
2. **Resultados de marketing.** No hay conversiones medidas: la campaña de anuncios quedó
   archivada y vacía, y el circuito comentario -> DM de Instagram no está probado (0 leads;
   memoria `ig-comentario-dm-vivo.md`). No decir "esto me trae leads".
3. **"Mis agentes de IA".** Los 6 agentes del producto funcionan con reglas y plantillas, sin
   LLM; el bot de ventas responde casi siempre por guion (auditoría 24-sep). Tampoco decir que
   el bot "agenda y hace seguimiento solo" sin probarlo ese día: la frase se retiró el 31-ago
   porque las citas se escalaban a un humano.
4. **Autoría de terceros.** Hermes Agent es de NousResearch; HyperFrames, las skills públicas y
   los plugins son de sus autores. Se dice "lo uso", no "lo construí".
5. **Estados que no están cerrados.** Facturación SIAT: no homologada (límite 04-11-2026). Cobro
   por API del banco: en trámite, el circuito del bot está en modo simulado. Webs generadas:
   no tienen camino de publicación (medido 18-sep). WhatsApp propio para cada cliente: diseñado,
   no en uso por clientes.
6. **Cifras internas o proyectadas.** Márgenes, costo operativo mensual y "punto de equilibrio en
   5 clientes" son cuentas sobre costos, no ingresos: se presentan como aritmética de ejemplo y
   nunca como consejo financiero. Gasto de IA medido (24-sep) solo con su fecha.
7. **Cifras que envejecen.** Nombres, precios y límites de modelos; tarifas de Meta (el cambio
   del 1-oct no está confirmado para LatAm); cantidad de loops activos (eran 15 el 04-sep, con 8
   pausados). Se recuentan el día de grabar o no se dicen.
8. **Datos legales y de cuentas.** Sergio Urcullo es menor de edad; los actos legales de la
   empresa los firma la titular registrada. No mostrar NIT, matrícula, cuentas bancarias,
   contactos del banco, números de WhatsApp, IPs, nombres de contenedores con credenciales, ni
   pantallas con sesión iniciada en portales (SIN, banco, Meta, Higgsfield).
9. **Vulnerabilidades.** Incidentes de seguridad (tablas expuestas, clave publicada en un repo)
   se cuentan solo como patrón, sin detalles explotables, y solo después de confirmar que están
   cerrados y la clave rotada.
10. **Competencia.** La regla de ONIA prohíbe hablar de competidores en material de venta. En
    contenido educativo, un dato de un competidor (p. ej. tarjeta antes de la prueba, 31-ago) va
    con captura pública y fecha, o no va.
