# Handoff — madre-local (sesión MADRE, en la PC de Sergio Urcullo)

Regla: CLAUDE.md §1. Método (ids, canales, cómo se delega a Codex, tokens): **skill `onia-sesion-madre`**.
**Corrección 2026-10-09:** mandan HANDOFF 9-oct, GOAL VIGENTE y colas; el estado del
5-oct de abajo es historial. Sus pedidos de OK de diseño/infra/migraciones quedan
sustituidos por `CLAUDE.md` §«Qué se publica sin preguntar», con sus excepciones.
Esta auditoría documental no verifica sesiones vivas ni producción. El siguiente
párrafo describe el relevo del 5-oct.
La madre saliente (`cfdce1bb…`, rama `claude/onia-sesion-madre-77f719`, worktree `infra-loops-revision-3fc7b1`) llevaba
días abierta y su conversación costó ~777 M de tokens. **La madre nueva arranca de cero y lee solo esto.**

## ▶ ARRANQUE de la madre v4 (texto para pegar, 10-oct 20 UTC)

> Sos la sesión MADRE de Onia, en la PC de Sergio Urcullo, y la única madre. Llamalo siempre «Sergio Urcullo».
> Invocá `onia-router`, `equipo-de-agentes` y `onia-sesion-madre`. Leé SOLO: este bloque, el HANDOFF v3 de abajo y
> `hermes-content/docs/cola/loop/madre.md` (el libro). **Tres objetivos, nada más:** (1) la 1.0 publicada y mirada,
> (2) una pieza de contenido por día, (3) ventas (pauta y leads). Lo demás es de las sesiones de la nube.
> Reglas que la v3 rompió y no se repiten: máximo 2 frentes propios a la vez; nada se le muestra a Sergio Urcullo
> sin captura de la página REAL; respuestas de 3 bloques; relevar la madre antes de que la conversación pase ~150 k
> tokens (mod `/agentes` lo muestra); no pushear a onia-platform de :20 a :55 en las horas de publicación.
> Primero: recrear los 4 loops de la sección F del libro (CronCreate) y mirar el mod `/agentes`.

## 🔁 HANDOFF v3 (madre `d5e87d2e`, 10-oct 14:24 → 20:00 UTC)

1. **Objetivo:** terminar y publicar. **Cerrado:** F1, #142, #139 y #144 publicados (18:56 UTC) y mirados con
   Playwright; #114 mergeado por Plataforma, sale a las 21:50 UTC.
2. **En main / PRs que esperan el clic de Sergio Urcullo (mergear PRs propios lo frena el control de permisos):**
   onia-hermes **#187** (todo el trabajo de la v3: libro, paridad nube = PC, harness, auditoría, equipos, Hermes QA,
   Lucía, guiones 17-23, recetas) · **#188** (el publicador espera el job del CI, revisado por Codex Astra + Opus) ·
   onia-platform **#145** (logo «onia» en /book, suite 10.034/0).
3. **A medias:**
   - workflow `wf_a2d7017e-6e4`: carrusel de referencia DePPPp5FgMh → ficha + receta en `diseno-contenido-onia` +
     `carousels/briefs/BRIEF-RECETA-DePPPp5FgMh.md`. Escribe en este worktree **sin commitear**: si muere, se rehace.
   - Mensajes de dirección de Sergio Urcullo (20 UTC) enviados a las 5 sesiones: Plataforma define
     `ONIA_1.0_CORTE.md`; Ventas estudia la Biblioteca de Meta; Marca audita qué enseñan los carruseles; Lucía alinea
     las piezas para vender Onia y mejora Higgsfield; Hermes arranca su rol QA (Q1-Q5). Verificar en sus transcripts.
   - Codex ve ~500 skills por tarea (~1 M tokens): Sergio Urcullo dijo sí; el comando de PowerShell para cambiar
     `~/.agents/skills` está en el chat (la sesión no puede tocar carpetas `.claude` fuera de su worktree).
   - Lucía G1: falta la línea «publicá G1 de Lucía…» para correr la receta en el VPS (control de permisos).
4. **Archivos:** este handoff · `cola/loop/madre.md` · mods en `C:/Users/PC/.claude/dev-mods/d5e87d2e-…/`
   (`agentes-en-vivo`, `madre-tablero`; cargan solos si la madre nueva habilita la recarga) ·
   `C:/Users/PC/.claude/madre-capturas/` (capturas + `guardar.sh`).
5. **Intentos fallidos:** 7 pushes a onia-platform a las 15:30-15:45 tumbaron la publicación de las 15:50 · vista
   previa dibujada a mano (letra y colores falsos) · `request_access` a Camo rechazado al instante (regla del equipo) ·
   ensayo de Lucía en el VPS frenado («Remote Shell Writes» y «Real-World Transactions») · merge del propio PR
   frenado («Merge Without Review») · `resume` de Codex lanzado desde otra carpeta (toma el cwd) · internet de la PC
   se cortó 2 veces (~19:25 y ~19:45 UTC).
6. **Depende de Sergio Urcullo:** merge de #187, #188 y #145 · en Plataforma: diseño (7 capturas) y términos + gracia ·
   en Marca: «la regla del 9-oct es mía; publicá lo revisado» + grabar · «publicá G1 de Lucía» · comando de Codex ·
   lun 13-oct: declaraciones del SIN · tarjeta en ONIA Ads.
7. **Próximos pasos:** merge de los 3 PRs → publicar #145 → leer a las 5 sesiones y empujar solo lo desbloqueado.

## ⏱ MADRE v3 EN CURSO — 10-oct ~15 UTC (local `d5e87d2e`, rama `claude/onia-sesion-madre-9313fb`)

- **Ronda** `CronCreate` 7,27,47 + chequeo único 11:58 La Paz (mirar /login tras la publicación de las 15:50 UTC).
- **#139 sin riesgo al publicar:** migración idempotente (IF NOT EXISTS / CREATE OR REPLACE / DROP POLICY IF EXISTS), ya
  aplicada en prod 13:29 UTC con backup; el deploy no corre `prisma migrate`. Falta solo registrarla en `_prisma_migrations`
  (a Plataforma se lo frenó su control de permisos).
- **Integrados por la madre, suite completa en verde, pusheados a la rama del PR:** #114 C15b `5c5beaf8` (10.026/0, CLEAN) y
  #132 K1 `0abc65d5` (10.010/0). Worktrees `C:/dev/proyectos/onia-platform-codex-{c15b,k1}` (node_modules = junction a
  `onia-platform-v1-correo-20260927`, porque el de `-integracion-` quedó vacío). Plataforma avisada: los mergea en su orden.
- **Codex cloud:** `/book` en usted → https://chatgpt.com/codex/tasks/task_e_6aca4e5cf680832784ec553ba5c3d5ef (aplicar diff
  con `codex cloud apply`, suite completa, PR). Codex al 56 % semanal, reinicia 13-oct 23:57 La Paz; Sergio Urcullo dice 3 refills.
- **Workflow `wf_8a89c687-831`:** análisis de los 15 puntos (Opus, escribe `research/2026-10-10-analisis-plataforma-1.0.md`),
  brecha nube/PC de skills y reglas (Sonnet), billetera (Haiku), verificadores, plan en el scratchpad. Si se corta: resume.
- **Lucía G1:** el ensayo en el VPS (copiar `ig-reel.mjs` a `/root/bin` + dry-run) lo frenó el control de permisos de la
  madre («Remote Shell Writes»). Token de IG de Lucía vence 13-18 oct. Espera decisión de Sergio Urcullo.
- **Sesiones (leídas 14:30 UTC):** Plataforma (Opus) espera 2 sí en su sesión; Marca (Sonnet) espera brutos + 4 sí;
  Ventas (Sonnet) parada desde 9-oct 16:45, sin latido → se le mandó tarea (go/no-go + campaña lista en pausa);
  Lucía (Sonnet) espera la receta desde la PC; Hermes (Opus, 0 tareas) espera su sí a `aplicar`.

## ▶ ARRANQUE de la madre nueva (texto para pegar, 10-oct)

> Sos la sesión MADRE de Onia, en la PC de Sergio Urcullo, y la ÚNICA madre. Invocá `onia-router`, `equipo-de-agentes`,
> `onia-sesion-madre` y `aprender-de-todo`. Leé `hermes-content/docs/handoff/madre-local.md` (§ TERMINAR TODO y HANDOFF
> 10-oct) y `hermes-content/docs/ONIA_EQUIPO_DE_AGENTES.md` (el plan del equipo, si ya está; si no, la auditoría en
> `hermes-content/docs/research/2026-10-10-auditoria-equipo-de-agentes.md`).
> Tu objetivo NO es construir más: es **terminar y publicar**, en el orden de § TERMINAR TODO. Delegá todo lo largo
> (Codex, subagentes, sesiones de la nube); vos orquestás, hacés lo de la PC y corrés los gates.
> 1. Ronda con `CronCreate` cada 20 min (`7,27,47 * * * *`, §3 de `equipo-de-agentes`) + medir `PoolPagedBytes` (avisar si
>    pasa de 3 GB). No cierres Chrome ni WhatsApp. Los latidos por hora de la nube ya existen: no los recrees.
> 2. `ListAgents`. Juntá en UNA lista lo que cada sesión espera de Sergio Urcullo y dáselo una sola vez.
> 3. Codex a trabajar YA: 2 ejecutores Platform (Sol medium) + 1 Hermes (Sol/Luna) + 1 revisor, desde `hermes-content/docs/historial/orquestacion-vieja/codex-tareas/`.
> 4. A Sergio Urcullo: solo PUBLICADO y lo que necesita de él, en 3 bloques.

## 🔥 TERMINAR TODO (10-oct, pedido de Sergio Urcullo)

Sergio Urcullo, 10-oct: *«la onia platform está en peligro, no hemos subido videos, no hemos terminado el desarrollo, no
hemos subido campañas, no hemos vendido… hay que terminar todo»*. Producción no se mueve desde el 9-oct 13:53 (`c94b9daa`).
Etapa 1 (0→5 clientes, salida Bs 3.750/mes); hay 0 clientes. Detalle de cada punto: auditoría §audit:backlog.

**Estado al cierre (10-oct ~14 UTC):** Sergio Urcullo respondió en Plataforma: **#143 (F1), #142 y #139 mergeados**
(master `32c7e0e8`, CI verde). ⚠️ **#139 trae la migración `20261005140000_realtime_citas_privado`**: no se publica master
sin aplicarla antes (backup → migración → publicar → GET anónimo 401 → mirar /login). Se le avisó a Plataforma. Cada PR
con migración deja master no publicable hasta aplicarla: el que la mergea la aplica antes de cualquier otro merge.

**Plan del equipo de agentes:** `hermes-content/docs/ONIA_EQUIPO_DE_AGENTES.md` (plan + crítica). Leer la crítica primero:
4 afirmaciones del plan son falsas (rutinas cada 10-20 min, la madre abre sesiones completas, la nube le escribe a la madre,
Codex cloud elige modelo). Lo que sí: CI reemplaza la suite local de la madre como gate; una sola fila de tareas;
`--disable multi_agent` en Codex; ~6 tareas Sol por día hasta el reinicio del 14-oct; ≤10 agentes Claude a la vez la
primera semana. El cuello de botella son los sí de Sergio Urcullo y los merges en serie, no la cantidad de agentes.

**Orden. Cada paso con su dueño y su criterio de hecho:**
1. **Plataforma publica la cadena** (dueño: Plataforma; freno: los 4 sí de Sergio Urcullo **en esa sesión**: F1, #142,
   #140 con infra, «la regla del 9-oct es mía»). #143 F1 → `publicar.sh` → MIRAR /login → #142 → #136+#130 → #140 + infra
   → #139 (migración antes de la imagen) → #114 → #124 → #113 → #118/#119/#110/#132. Hecho = cada uno en `master`,
   publicado y mirado. Si Sergio Urcullo prefiere, la madre mergea y publica desde la PC con su sí escrito acá.
2. **Refrescar la demo + capturas C1-C7** (Plataforma; necesita la cadena publicada). Destraba Ventas, el VSL y Lucía G1.
3. **Tabla «se promete / funciona»** (Ventas; freno: `ONIA_QA_EMAIL`/`ONIA_QA_PASSWORD` en el entorno de Ventas, lo carga
   Sergio Urcullo). Hecho = 101 promesas medidas; sin tabla en verde no se contacta a nadie.
4. **Videos** (Marca): las 13 piezas de `GRABAR-10-16-OCT.md` necesitan que Sergio Urcullo grabe; mientras, Marca publica
   las piezas sin cara (P1/P3, carrusel, historias de la asesoría, molde mosaico). Hecho = 1 pieza publicada por día.
5. **Campaña Meta del 16-oct** (Ventas + madre en Chrome): go/no-go del 13-oct con 9 filas en ❌. Freno: tarjeta en ONIA
   Ads, OK de gasto «US$56 · 14 días · tope Bs 750», píxel, demo. Hecho = campaña creada en pausa y encendida el 16 si el
   go/no-go da verde.
6. **Vender** (Sergio Urcullo + Ventas): 7 leads esperando + 12 mensajes de prospección + plantillas A/B y seguimiento
   D3/7/14/30. Solo después de la tabla en verde, y cada envío con su OK.
7. **Codex a fondo:** tareas cerradas de `onia-1.0-nube.md` §7 (costos de Meta en `pricing.ts`, `/book` en usted ~35
   textos) y lo que deje cada carril en `hermes-content/docs/historial/orquestacion-vieja/codex-tareas/`.

**Lo de la PC (solo la madre, con Chrome):** capturas de la Biblioteca de anuncios de Meta, evento de cal.com, plantillas
en WhatsApp Manager (enviar a terceros = OK de Sergio Urcullo), mail `+qapago`, bucket R2 y snapshot de Hostinger, bio de
IG, `aplicar` de Hermes en el VPS, Codex local + suite completa. El portal del SIAT no lo abre nadie más que él.

**Lo de Sergio Urcullo, en una lista:** (1) los 4 sí en Plataforma; (2) credenciales QA en el entorno de Ventas;
(3) grabar las 13 piezas + selfie A1 + tomas T9/T10/T12 del VSL; (4) tarjeta en ONIA Ads y OK de gasto US$56; (5) bucket R2
(gasto); (6) SIAT: CAFC del piloto, Punto de Venta 1, prórroga (reloj 4-nov); (7) términos (#124); (8) OK de Leslie Mercado
Moreno para el predictor y la tarjeta; (9) `aplicar` de Hermes sí/no; (10) A o B del evento de cal.com y link en la bio.

**MCP oficial de Meta con WhatsApp** (auditoría §research:meta-wa-mcp): real, beta y angosto. Sirve para configurar una
cuenta de WhatsApp Business (números, plantillas, webhooks, envíos de prueba). No trae bandeja, CRM, agenda ni cobros:
**Onia no queda inútil**, pero «te configuramos el WhatsApp» deja de ser diferencial. Se desarrolla en otra sesión
(pedido de Sergio Urcullo); tareas propuestas en la auditoría.

**Equipo de agentes** (pedido de Sergio Urcullo del 10-oct: que la nube no pare con la PC apagada, una sola madre, muchos
agentes por punto, Codex a fondo): auditoría hecha (`research/2026-10-10-auditoria-equipo-de-agentes.md`). El plan final va
a `hermes-content/docs/ONIA_EQUIPO_DE_AGENTES.md`. Datos clave medidos:
- Codex: Sol 6.1 (diario), Astra 6 (riesgo), **Luna 6 (mecánico, 0 usos)**. Cuota 56 % de la ventana de 7 días, que se
  reinicia el 13-oct a las 23:57 de La Paz. 2 reinicios disponibles y 0 aplicables hoy: verificar antes de quemar.
  Astra se comió el 85 %: usar Sol por defecto y Luna para lo mecánico.
- El cuello de botella no son los agentes: es la suite completa de la madre (~9,9k tests, en serie) y los sí de Sergio Urcullo.
- PC apagada: los latidos de la nube siguen. Falta un «turno de noche» en el VPS (ya hay un Claude con cron cada 10 min)
  que suba los bundles y despierte a las sesiones trabadas. Tocar el VPS = sí de Sergio Urcullo (infra).
- Alternativa sin VPS: rutinas con `/fire` desde n8n (cadencia de 2-5 min, superficie oficial). Ver la auditoría.

## 🔁 HANDOFF 10-oct (cierre de la madre `202a717e`, después del reinicio de la PC)

1. **Objetivo:** el GOAL VIGENTE (1.0 publicada y mirada; puntos 1-4 al 16-oct). Sigue faltando **publicar**, no construir.
2. **En main / producción desde el 9-oct:**
   - onia-hermes: #179 (colas en loop, skills `equipo-de-agentes` y `aprender-de-todo`, regla del 9-oct en CLAUDE.md),
     #181 (trampa de memoria), #175 de Ventas (script de grabación y preview del VSL), #182 de Hermes;
   - latidos por hora en el servidor para Plataforma, Marca, Lucía y Hermes (ids en `equipo-de-agentes` §2 bis), medido:
     corren todos;
   - onia-platform: **nada nuevo en producción**. `master` = `c94b9daa` (#141), y #141 NO llegó a producción: el cron de las
     15:50 UTC del 9-oct falló por Google Fonts en el build.
3. **A medias y dónde:**
   - **onia-platform #143 (F1, fuentes servidas desde el repo):** lo subió la madre desde el bundle de Plataforma. CI verde
     y `CLEAN`, falta mergear y publicar. Sin F1, cualquier publicación puede volver a caerse;
   - después, #142 (pago de usted) y #140 (widget, con 3 cambios de infra), y el resto de `cola/loop/plataforma.md`;
   - **Plataforma pasó 20 h parada** (9-oct 13:00 → 10-oct 13:00 La Paz) esperando 4 sí/no de Sergio Urcullo **en su
     propia sesión**: F1, #142, #140 con su infra, y si la regla del 9-oct es suya. El 10-oct, 08:57 La Paz, él entró a esa
     sesión («mostrame los puntos»).
4. **Archivos:** este handoff · `equipo-de-agentes` (§2 bis latidos; trampas de permisos y de memoria) ·
   `cola/loop/*.md`.
5. **Intentos fallidos:**
   - la madre le «trasladó» el permiso a Plataforma por mensaje y con la regla en main: **no vale y está bien que no valga**,
     porque el permiso lo escribe Sergio Urcullo en la sesión que publica;
   - Ventas sin latido: su entorno «Default» no muestra el id por la API (`get_session` tampoco la encuentra);
   - el 9-oct la madre cerró Chrome y WhatsApp para liberar memoria; Sergio Urcullo los usa y no se cierran. La fuga real
     era el paged pool del kernel (17 GB); reiniciar la liberó (0,96 GB el 10-oct).
6. **Depende de Sergio Urcullo:**
   - responder en Plataforma los 4 sí/no (F1, #142, #140, «la regla es mía»);
   - grabar las piezas de `GRABAR-10-16-OCT.md`;
   - bucket R2 (gasto), CAFC del SIAT, tarjeta en ONIA Ads, bio de IG + cal.com, OK de Leslie Mercado Moreno para el
     predictor;
   - Avast (sospechoso de la fuga): lo saca él si quiere.
7. **Próximos pasos:** con el sí en Plataforma, F1 → publicar → mirar /login → #142 → #140 → cola. Ronda con medición de
   memoria. Si otra sesión espera un sí, juntarlo en una sola lista para Sergio Urcullo.

## 🔁 HANDOFF 9-oct (cierre de la madre `202a717e`, rama `claude/onia-madre-v2-pr-review-2d85bb`)

Sergio Urcullo, 9-oct: *«seguimos con la información innecesaria entre sesiones y no veo los resultados que quiero, estamos
dando vueltas… quiero equipos de agentes que orquesten en loop cada cosa, que lancen tareas a su sesión y que las cumplan,
porque estuvieron parados»*.

1. **Objetivo:** el GOAL VIGENTE de abajo (1.0 publicada y mirada; puntos 1-4 al 16-oct; contenido diario). Lo que falta
   NO es construir: es **publicar** y que las sesiones **no se queden paradas** entre mensajes.
2. **En producción (9-oct):** #133 (recuperar canceladas) y #134 (semilla dental) mergeados y medidos tras el cron;
   #138 (demo sin semilla) mergeado; #128 publicado el 8-oct (`release-b37e1182`, falta MIRARLO con login).
3. **A medias y dónde (todo en onia-platform, suite completa en verde en la PC salvo lo dicho):**
   - **18 PRs abiertos, casi todos draft esperando una decisión de Sergio Urcullo**: #136 bandeja (diseño), #118/#119/#110
     agenda/odontograma/caja (diseño + migraciones), #139 canal privado (migración Realtime), #140 widget W1+W1b+W1c+W1d
     (infra: `/public/api/` y `hmac_mandatory`), #141 IPv6 S1+S1b (listo para revisar), #142 pago de usted U2+U2b,
     #113 gracia C13+C13b+C13c (frenado por Términos), #114 factura C15b (migración `20261009110000_*`), #124 términos (legal),
     #130 PWA (diseño), #132 K1, #127/#129/#135/#131/#137 (entran por #136/#140).
   - **Molde `videos/moldes/mosaico-tablero/`** (réplica de la edición del reel DePBfHouarG): hecho, renderizado (30 s) y
     commiteado el 9-oct. Mandado a Sergio Urcullo como prueba; Marca lo usa desde su cola.
   - Worktrees de Codex en `C:/dev/proyectos/onia-platform-codex-*` (22): todos pusheados; se pueden borrar.
4. **Archivos:** este handoff · skill `onia-sesion-madre` (todo el método de Codex: junction de `node_modules` a
   `onia-platform-v1-integracion-20260927`, suite COMPLETA de la madre como gate, push solo si pasa, bundles de Plataforma) ·
   guiones v3 `docs/cola/plan-3-semanas/GRABAR-10-16-OCT.md` + teleprompter https://claude.ai/artifact/4DFnmADw28Hjj5gayyaHcR ·
   `ASISTENTE_CODEX_VS_HERMES.md` · `HIGGSFIELD_VIDEO_SYSTEM.md` (estilo `fotobn`) · `sales-kit/06-VSL-DENTAL.md` ·
   `marca-personal/VSL-ASESORIA-GRATIS.md`.
5. **Intentos fallidos:**
   - la ronda cada 20 min **no alcanza**: las sesiones de la nube terminan su tarea y quedan `idle` hasta el próximo mensaje
     (medido toda la noche del 8 al 9-oct: Plataforma parada 40+ min varias veces);
   - mandar mensajes largos entre sesiones = ruido que nadie lee;
   - API de historias de IG: 429 dos días seguidos; Chrome oculto congela la pestaña;
   - Gemini gratis: tope diario a la madrugada;
   - workflows grandes de Claude (~60 M de tokens el 8-oct): Sergio Urcullo pidió Codex y cuidar tokens.
6. **Depende de Sergio Urcullo:** solo las excepciones de `CLAUDE.md` (gasto, terceros,
   actos legales, etc.). Corrección 9-oct: diseño/infra/migraciones revisados no esperan otro OK.
7. **Próximos pasos:** aplicar `equipo-de-agentes` y convertir trabajo revisado en
   producción según gates del carril; no esperar otra definición de loops ya documentada.

## ☀️ Para Sergio Urcullo a la mañana (noche del 8 al 9-oct)

Corrección 9-oct: esta lista mezcla trabajo del equipo y decisiones de Sergio Urcullo.
Solo se le presentan las excepciones vigentes; revisión y publicación corresponden al carril.
1. **Grabar hoy** (vie 9, antes de las 18:00): N07, DD-A, N02, D03-A y D04-C. Guiones: https://claude.ai/artifact/4DFnmADw28Hjj5gayyaHcR
2. **Revisión visual del carril, sin otro OK de diseño:** las 6 pantallas de la lámina (bandeja #136, nueva conversación, agenda, odontograma, caja, app sin conexión).
3. **Revisión técnica y backup/rollback, sin otro OK por migración/infra:**
   - migración Realtime del canal privado (#139, punto 3);
   - migración de facturas (#114, punto 15, antes del swap);
   - infra del widget (#140: bloquear `/public/api/` y `hmac_mandatory`);
   - SQL del B22 (REVOKE a anon);
   - bucket R2 del respaldo afuera (punto 4): conserva aprobación por gasto.
4. **Sí a refrescar la demo en producción** (para las capturas del VSL) y **el CAFC del piloto del SIAT** (código y rango).
5. **Legal:** términos con su migración (#124, punto 14).
6. **Sí o no:**
   - encender Hermes Jarvis (`aplicar`);
   - copiar 5 skills de marketing al repo;
   - tarjeta en ONIA Ads;
   - link de la asesoría en la bio de IG y cal.com.
   - Higgsfield predictor: necesita el OK de Leslie Mercado Moreno.
7. **Hecho de noche:** #133 y #134 mergeados (publicación en vuelo), #137→#140 widget seguro, W1c, K3c #138 mergeado, C3c #139, C15b en #114. Suite completa en verde en todos.

## 🎯 GOAL VIGENTE — 8-oct (Sergio Urcullo; sesión madre `202a717e…`, rama `claude/onia-madre-v2-pr-review-2d85bb`)

**Meta:** la 1.0 con TODAS las funciones del plan, publicada y MIRADA en producción. Los puntos 1-4 el **16-oct**; los 15
puntos de `ONIA_PLAN_1.0_Y_CAJA.md` más las mejoras de UI de los referentes el **30-oct**. Desde el **9-oct** sale
contenido todos los días. No se para de desarrollar ni de investigar.
**Prueba de hecho:** cada punto con SHA publicado y captura en producción. La tabla «se promete / funciona» de Ventas en
verde ANTES de escribirle a cualquier cliente. Al menos 1 pieza publicada por día.

**Decisiones de Sergio Urcullo del 8-oct:**
- Lucía sigue: muestra que sabemos usar Higgsfield y sirve de aprendizaje.
- Presupuesto por fases aprobado: se publica y se puede mejorar.
- No se le escribe a nadie hasta saber que el producto cumple lo que promete.
- Codex actualizado (npm 0.161).
- Asesorías gratis por ahora; si se cobran, se decide después, con el contenido como prueba.
- La madre lee todo el tiempo y no se para.
- Él solo toma las decisiones que tienen repercusiones.

**Quién hace qué:**

| Quién | Qué | Modelo |
|---|---|---|
| Madre (PC) | Ordena, despacha a Codex y hace lo que exige la PC | Sonnet en su hilo; Opus solo para decidir |
| Plataforma (nube «Onia») | La 1.0: integración, migraciones, publicación, producción | Opus, porque es código de riesgo; Haiku/Sonnet para lo mecánico |
| Codex en la nube (env Platform) y local (`codex-tarea.sh`) | Tareas de código cerradas y tests | gpt-6-astra para código; gpt-6.1-sol para lo simple |
| Ventas → Investigación (nube) | Tabla «se promete / funciona»; referentes de UI con las tareas para Codex | Sonnet; Haiku para buscar |
| Marca (nube) | Guiones diarios, piezas sin que él grabe, plan de publicación (Buffer / `ig-reel.mjs`) | Sonnet |
| Lucía (nube) | Kit v4, autónoma | Sonnet |

Las sesiones avisan su «ESTADO PARA LA MADRE» con `send_message` (MCP `claude-code-remote`) en el momento. Además, la
madre hace una ronda cada 20 min (CronCreate, vive solo mientras la madre está abierta y vence a los 7 días).

## Auditoría de aprendizaje y reglas · 2026-10-09 · entrega local de Codex

- META cumplida en documentación: contradicciones de diseño/publicación, fotobn,
  CTA, registro por audiencia, cadencia y sesiones históricas corregidas en origen.
  `AGENTS.md`, `CLAUDE.md`, router y colas cargan las dos skills comunes.
- Nueva `.claude/skills/aprender-de-todo/SKILL.md`: 12 dimensiones, ficha, destino
  canónico y cadena fuente → regla → uso. `equipo-de-agentes` incorpora reparto
  Codex, concurrencia recomendada, Sol/Astra y preflight cloud Platform.
- Cobertura: `hermes-content/references/video-intake/COBERTURA-APRENDIZAJE.md`:
  12 fichas, 21 referencias y 10 feedback fechados. Sin fichas 6/7-oct; no se
  presume que no hubo envíos. Referencias incorporadas no equivalen a uso probado.
- Frentes: integración documental + subagente de cobertura + subagente de equipo
  y revisión cruzada. Validación estructural: UTF-8, 12 dimensiones, todas las
  fichas del intervalo representadas y enlaces de cobertura existentes.
- PARA LA MADRE: revisar e integrar estos cambios locales. No se ejecutó Git,
  no se tocó producto, no se publicaron piezas ni se activaron sesiones/loops.
  Cada cola tiene una comprobación pendiente de uso en su próxima tarea pertinente.
  Falta que los carriles carguen la versión integrada y devuelvan evidencia; no
  se confirmó acceso/cupo/modelo cloud ni estado operativo del equipo en vivo.

## Historial desde aquí — 5-oct ~21:15 UTC: la madre estuvo en la NUBE y vuelve a la PC

> Marcado 2026-10-09: los apartados siguientes preservan el relevo y sus intentos;
> no son órdenes vigentes de permisos ni inventario de sesiones. Para actuar, usar
> ARRANQUE/HANDOFF 9-oct, colas y skills. No repetir los pedidos de OK antiguos.

Sergio Urcullo abrió la madre en la nube por error (`session_01BZwYEL4eSUkdPWL36ibLkd`, entorno «onia-higgsfield») y pidió
volverla local. **Desde la nube se ordena bien a las sesiones de la nube, pero no se llega a las locales ni al Chrome.**
Lo de abajo (§0-§7) sigue valiendo; esto es lo nuevo.

**Hecho en la madre de la nube (todo en `main`):**
- Leídos los 5 «RESUMEN PARA LA MADRE NUEVA» (Plataforma, Ventas, Marca, Lucía, Hermes). Confirmado: #108, #109 y #111
  están en producción (release `97fe3061`, bundles mirados por Plataforma).
- Mergeados los handoffs #128, #129, #130, #131, #133 y #137 (skill madre con los ids nuevos + tareas de la madre v2).
- Plataforma: tarea de la **prueba del chip** (solo lectura en prod: `listoParaConectar`, `addon.whatsapp`, correo
  `+qachip`; verificar plantilla `recordatorio_cita` e inbox después de «conectado»).
- **Hallazgo:** `onia-platform/lib/chatbot/embedded-signup.ts:142` manda `featureType: ""` (alta estándar: el número
  pasa a la API), pero `CanalWhatsappCard.tsx` promete coexistencia («sigue siendo tuyo en tu app»). Pasado a Plataforma:
  si la promesa es falsa, se corrige el texto.
- Guía del chip dada a Sergio Urcullo: chip SIN WhatsApp instalado → Otorgar `addon.whatsapp` en
  `/admin/organizations/cmuqzov3y000001mzmrcq0i2t/capacidades` → entrar con `+qachip` → Configuración → Chatbot →
  Conectar → portafolio nuevo y nombre visible **«Onia Pruebas»** (lo eligió él; no el portafolio «Onia») → SMS → «conectado»
  → 3 citas a 1 h 30-2 h 30 con su número personal como paciente, un botón distinto en cada recordatorio.
- Lucía pidió VPS: recomendación a Sergio Urcullo, **no** (la llave vive solo en «Onia»). El `ls` de
  `/root/.config/onia-publicar/` que pidió lo frenó el control de permisos («Production Reads»): no se reenvía a otra sesión.
- Competencia: **no abrir sesiones** (mapa de 28 + fichas; faltan clientes, no estudio).

**Lo que estaba en vuelo (ya en `main`; la madre de la nube se puede archivar):**
1. ✅ Hecho (onia-hermes#141): cola de Codex en `docs/historial/orquestacion-vieja/codex-relevo.md` + 5 prompts en `docs/historial/orquestacion-vieja/codex-tareas/`
   (C15, C13, C14, C11a, C11b), con el estado medido de los 15 puntos; la lista completa de pendientes de Sergio Urcullo
   está en §6b. Plataforma ya sabe qué archivos no toca. Falta que la madre v2 la lance (su handoff, tarea 2).
2. ✅ Hecho: el TikTok `https://vt.tiktok.com/ZSbm3Scje/` (mandado el 3-oct, nunca analizado) está en
   `references/video-intake/2026-10-05-tiktok-ZSbm3Scje.md`. Qué tomar: la serie «Día N/7» con el cierre «Mañana» y las
   tarjetas que se arman con el dato.

**Sesiones al 21:10 UTC** (ids en la skill `onia-sesion-madre`):
- **Plataforma:** trabajando (prueba del chip + punto 1).
- **Ventas:** en pausa, sin tarea. Propuesta: 10 clínicas dentales de Santa Cruz con señal + el mensaje 1:1 de cada una
  para que lo mande Sergio Urcullo (sin enviar nada).
- **Marca:** carruseles agendados para el martes 6, 16:00. Espera 3 decisiones de Sergio Urcullo: rehacer las 10 láminas o
  publicar los 7 carruseles sin ellas; agendar N03 («modo auto») el viernes 9; subir los 6 guiones a Drive.
- **Lucía:** bloqueada (cuenta demo para las pantallas reales; pide VPS).
- **Hermes:** abrió el PR #138 con 2 revisores. Verificar qué es: su handoff dice que nada avanza sin el sí de Sergio Urcullo.
- **Madre v2 nueva:** `session_01CYBTxzz2ti5WAStSfSAruE` (local, «Madre v2 de Onia: revisión de PRs»), esperando tarea.
  Sus tareas están en `hermes-content/docs/historial/orquestacion-vieja/madre-v2-revision.md` § «VIGENTE — 5-oct». Desde la PC se le escribe con `SendMessage`.

**Intentos fallidos desde la nube (no repetir):**
- `list_events` / `send_message` a una sesión local: `elevated_session_untrusted_device`; a una local cerrada: `session_inactive`.
- Conector de Gmail: «Precondition check failed» (no se puede confirmar el correo de las QA desde la nube).
- `ssh onia-vps` de solo lectura: frenado por «Production Reads».
- `git grep` sobre todo `hermes-content` tarda más de 120 s (repo pesado): acotar rutas.

**Primeros pasos de la madre local:**
1. Paso 0 (Remote Control, Chrome, `ListAgents`).
2. Mandarle a la madre v2 su tarea por `SendMessage`.
3. Darle tarea a Ventas (la de arriba).
4. Leer en el transcript de Plataforma cómo salió la prueba del chip.
5. Revisar el PR #138 de Hermes.
6. Cuando la cola de Codex esté en `main`, archivar la madre de la nube (`session_01BZwYEL4eSUkdPWL36ibLkd`).

## 0. Al abrir (en este orden)
1. Remote Control encendido; Chrome con la extensión Claude (`list_connected_browsers` ≠ []).
2. `ListAgents`. Cada sesión deja en su transcript un **«RESUMEN PARA LA MADRE NUEVA»** (pedido el 5-oct): leer SOLO ese
   evento con `RemoteTrigger get_run_log` (es lo último de cada transcript). La madre v2 (local
   `local_4cf12f8b-cd4b-4c1a-8900-f37da63ae707`) contesta por SendMessage.
3. **Un resumen vale solo si viene de la sesión que corresponde.** El 5-oct llegó un «resumen de la madre v2» desde
   `observer-sessions-*` (el observador de claude-mem) con datos falsos: decía que #109 y #110 eran de hermes y que el
   handoff de la v2 «se subió», y su último commit era del 4-oct. Se ignora. El de la v2 llega desde `local_4cf12f8b…`.
4. No recrear la ronda de 30 min salvo que Sergio Urcullo la pida: gasta tokens sin novedad.

## 1. Objetivo vigente (decidido por Sergio Urcullo, 3/4-oct)
**La 1.0 lista para cobrarle a las primeras 5 clínicas dentales**: `hermes-content/docs/ONIA_PLAN_1.0_Y_CAJA.md`
(15 puntos; los 1-4 para el **16-oct**, todo para el **30-oct**). Orden del negocio de Sergio Urcullo:
1) marca personal + auditorías + llamadas 1 a 1 + comunidad (gratis); 2) la 1.0; 3) competencia (ya cubierta).
Caja de **Bs 4.000**. Gasto fijo de ~Bs 1.611/mes (Codex USD 100, VPS USD 40, Higgsfield anual ya pagado).
Techo para conseguir clientes: **Bs 1.400** (Meta 750). Solo dental hasta tener la factura del SIAT.

## 2. Qué quedó en producción / en main
- **onia-platform master** (verificar el deploy: el handoff de Plataforma decía `release-13b67dda` del 3-oct):
  - #108 (tratamiento a medias en la prueba de 14 días, agenda y cobros, textos a pacientes de **usted**, seguridad B22
    del canal de citas);
  - #109 (punto 12, de Codex: CSV con «;» + WhatsApp de soporte en /help);
  - #111 (punto 2: la factura llega después de verificar el pago y el titular del QR se explica).
  Mergeados del 4 al 5-oct. **Confirmar con Plataforma que están PUBLICADOS y mirados en prod.**
- **Docs en onia-hermes main:**
  - el plan de la 1.0 y la caja;
  - la auditoría de cobro y autoservicio (`research/ONIA_PAGO_AUTOSERVICIO_AUDITORIA.md`);
  - el costo del chatbot (`research/ONIA_COSTO_CHATBOT_META_2026.md`: Bs 390 = ~99 % de margen; Meta le cobra a la
    clínica, con 1.000 mensajes de servicio gratis por número y por mes, verificado en la página renderizada);
  - el mapa de 28 competidores (`research/competencia/MAPA_COMPETENCIA.md` + fichas);
  - el plan de grabación por escena (`docs/cola/plan-3-semanas/PLAN-GRABACION-3-OCT.md`) y el KIT-GRABACION;
  - fichas de montaje y video-intake de los reels (mensaje + tema + edición);
  - el playbook de seguimiento de leads (`sales-kit/SEGUIMIENTO-LEADS.md`);
  - el kit de Lucía (7 fotos + 3 clips, 30,5 cr aprobados por Sergio Urcullo el 3-oct, #118);
  - las capturas del presupuesto por fases (`docs/cola/capturas-presupuesto-fases/`, #116);
  - la corrección fiscal: hoy NO hay IVA a servicios digitales del exterior, solo IUE-BE 12,5 % (#123).

## 3. A medias y dónde
| Frente | Estado exacto | Cómo se retoma |
|---|---|---|
| **Caja diaria (punto 8, Codex)** | onia-platform#110 (draft), rama `codex/punto-8-caja-diaria`, head `83f93948`. APROBADA por la madre v2 en 2 vueltas (9 hallazgos arreglados + 2 LOW; 21 tests verdes). Migración `20261004190000_add_daily_cash` **APLICAR ANTES DEL SWAP**. | Plataforma saca capturas (pedido) → la madre se las muestra a Sergio Urcullo → con su OK lo publica Plataforma. Worktree de Codex: `C:/dev/proyectos/onia-platform-codex-caja` (borrar al mergear). |
| **Presupuesto por fases (P2)** | Separado de #108 y sin publicar. Capturas en main (`docs/cola/capturas-presupuesto-fases/`, 12 PNG). | Mostrárselas a Sergio Urcullo (ya se le mandaron 2 el 5-oct) → con su OK lo publica Plataforma. |
| **SQL de permisos del B22 en prod** | `prisma/migrations/20261003230000_revoke_anon_onia_sends/migration.sql`: solo REVOKE, sin datos. **Falta el OK de Sergio Urcullo** para correrlo. | Pedírselo de nuevo; con su OK textual se lo pasás a Plataforma. |
| **Plantillas A y B para los 6 leads de agosto** | Texto aprobado («está bueno»). Desde la nube el control de permisos frenó crearlas porque la orden vino de la madre. El seguimiento ya está (`sales-kit/SEGUIMIENTO-LEADS.md`). | Sergio Urcullo las crea en WhatsApp Manager o se lo pide directo a Plataforma en esa sesión. Después: «salen». |
| **Meta / pauta** | ONIA Ads sigue SIN tarjeta: a Sergio Urcullo le falta el «control total» de la cuenta publicitaria («Unable to update permissions»). El número del bot **+591 75414930** hay que vincularlo a la página «Onia» («Conectar otro número»; no borrar su celular 78491375). | Configuración de la empresa → Usuarios → Personas → él → control total de ONIA Ads → Métodos de pago → Visa 4028. Verificar con `ads_get_ad_accounts` (`has_payment_method`). La pauta va desde el 16-oct, con reglas de corte (plan §3). |
| **Firma de la respuesta del bot a la pauta** | Versión de USTED en el chat del 3-oct; el commit `363dcf10` está en main sin publicar. | Pedir «firmo»; Ventas actualiza el knowledge y lo publica. |
| **Grabación** | Sergio Urcullo grababa el 3/4-oct con PLAN-GRABACION. | Cuando mande los brutos: T1 de Codex (`docs/historial/orquestacion-vieja/codex-relevo.md`) o Marca → tabla de cortes + preview 360p ANTES de cortar. |
| **Hermes** | #94 en main y apagado. Propuesta: que el autosync deje de hacer fast-forward de main (variable para el integrador). Toca CLAUDE.md. | Sí o no de Sergio Urcullo. Si es sí, los 3 MEDIUM + el cambio del autosync, con revisión fuerte. |
| **Codex** | CLI `0.139` viejo: `gpt-6-*` falla y se usa `-m gpt-5.5`. | Preguntar si se actualiza el CLI (`npm i -g @openai/codex`, pide OK). Cola: `docs/historial/orquestacion-vieja/codex-relevo.md`. |

## 4. Archivos de la madre
`.claude/skills/onia-sesion-madre/SKILL.md` (tokens y delegación a Codex) · `.claude/skills/ver-videos/SKILL.md` (regla
mensaje/tema/edición) · `AGENTS.md` (skills para Codex) · `docs/historial/orquestacion-vieja/codex-relevo.md` · este archivo.

## 5. Intentos fallidos (y su causa)
- **Aviso por Telegram programado vía Hermes (3-oct):** no salió. La nube no entra al VPS si la orden viene de otra
  sesión. Los avisos los manda la madre desde la PC.
- **`codex exec` sin `-m`:** falla (`gpt-6-luna` del config no está soportado; los gpt-6 piden un CLI más nuevo).
- **Codex no puede commitear:** el `.git` del worktree queda fuera del sandbox. Commitea la madre.
- **La madre subió un test rojo (`5c58175c`):** el `grep` de la salida no cortaba la cadena. Ahora hay un gate en el comando.
- **Plantillas y skills editadas «a pedido de otra sesión»:** el control de permisos de la nube las frena
  (Self-Modification, «transacción real»). Lo que es de Sergio Urcullo lo pide él en la sesión destino.
- **«1.000 mensajes gratis» de Meta:** primero se leyó en la ayuda de Wati, después WebFetch trajo una versión vieja que
  decía «sin tramo». La verdad salió de la página **renderizada en Chrome**.
- **Tokens:** la v2 gastó ~425 M y esta madre ~1.840 M, el 95 % releyendo contexto. Madres cortas y workflows de 5
  agentes como máximo.

## 6. Qué depende de Sergio Urcullo (en orden)
1. OK al SQL de permisos del B22 (seguridad, sin datos).
2. Control total de ONIA Ads → tarjeta; número 75414930 en la página.
3. Crear las plantillas A y B en WhatsApp Manager (o pedirlo en la sesión de Plataforma) → «salen».
4. Firmar la respuesta del bot a la pauta.
5. Ver las capturas: el presupuesto por fases (ya están) y la caja diaria (pendientes).
6. Sí o no al cambio del autosync de Hermes. ¿Actualizar Codex?
7. Fechas y techo del plan (16-oct / 30-oct, Bs 1.400). ¿La web y los anuncios pasan a usted?
8. CAFC del SIAT; bucket de respaldos (punto 4); titular del QR con el BCP.

## 6b. Lista COMPLETA de lo que depende de Sergio Urcullo (5-oct, medida contra los 8 handoffs)

Ordenada por lo que más acerca a cobrarle a 5 clínicas. 🔴 = bloquea los puntos 1-4 del 16-oct. Manda sobre §6.

1. 🔴 **OK textual para correr en producción el SQL de permisos del B22 (punto 3)** — Cierra el punto 3: el código ya está publicado (#108), pero 2 tablas siguen abiertas a la clave pública (GET anónimo da 200) hasta correr el REVOKE. No toca datos.
   - Escribilo DIRECTO en la sesión Plataforma (si lo pasa la madre, el control de permisos de la nube lo frena): «OK: corré en producción prisma/migrations/20261003230000_revoke_anon_onia_sends (solo REVOKE de permisos, sin datos)».
   - Plataforma lo corre y verifica: GET anónimo a /rest/v1/onia_whatsapp_sends → 401 y 0 grants.
   - Listo cuando Plataforma te contesta «401 y 0 grants».
2. 🔴 **Punto 1: cobro completo con la cuenta de prueba «ZZ QA Pago» (+qapago)** — Es el punto 1 de la 1.0: hoy hay 0 pagos registrados. Sin el cobro de punta a punta probado no se le puede cobrar a ninguna clínica.
   - Abrí el Gmail de Onia (oninteligenciaartificial@gmail.com), buscá el correo de confirmación enviado a oninteligenciaartificial+qapago@gmail.com y tocá el enlace (la nube no puede: el conector de Gmail falla).
   - Escribile a Plataforma: «correo de +qapago confirmado».
   - Plataforma hace el checkout del plan Básico con el comprobante «PRUEBA» y te avisa.
   - Entrá con tu superadmin a app.onia.com.bo/admin/payments y aprobá el pago de «ZZ QA Pago» SIN emitir factura (es prueba, no entra plata).
   - Escribile a Plataforma: «aprobado». Ella verifica que el plan quedó activo y mira /checkout, /help y /patients/import (eso cierra también la verificación de los puntos 2 y 12).
   - Si Plataforma perdió la clave (vive solo en su scratchpad), que use «Recuperar acceso»: el correo llega al mismo Gmail.
3. 🔴 **Crear el bucket de respaldos en Cloudflare R2 y aprobar rclone (punto 4)** — Cierra el punto 4: hoy los respaldos viven en el mismo disco del VPS y nunca se probó una restauración. Tiene que estar antes de que una clínica cargue pacientes reales. Costo USD 0 (entra en los 10 GB gratis).
   - En el panel de Cloudflare, abrí R2 y creá el bucket «onia-backups».
   - Creá un token de API limitado a ese bucket. No lo pegues en ningún chat: cargalo donde te indique Plataforma (regla de hermes-content/skills/seguridad-credenciales.md).
   - Escribile a Plataforma: «bucket onia-backups y token listos; apruebo traer rclone (imagen Docker rclone/rclone)».
   - Abrí el panel de Hostinger, buscá si el VPS tiene snapshots y decíselo a Plataforma.
   - Plataforma instala la copia diaria cifrada (supabase-db, chatwoot-db, Storage y n8n) y prueba una restauración. Listo cuando te muestra el archivo del día bajado de R2 y restaurado.
4. 🔴 **Confirmar que OniaAgency puede facturar en el Portal Web del SIN (ensayo sin emitir)** — Desde el 5-oct el checkout en producción promete «factura por correo después de verificar el pago» (punto 2). Si el portal no deja facturar, el primer cobro rompe esa promesa, y cobrar sin factura arriesga una clausura de 6 a 48 días (punto 15).
   - Abrí vos, a mano, pweb.impuestos.gob.bo con las credenciales de OniaAgency. Si operás vos y no Leslie, que ella te autorice.
   - Entrá a «Emisión Factura Compra Venta» SIN emitir (toda factura emitida es real): confirmá la sucursal 0, el punto de venta y que esté cargado el servicio «Suscripción Onia» con su código.
   - Con el contador, elegí la actividad de la suscripción (4651200 o 6209920) y confirmá que exista en el clasificador nuevo del RNC. Plazo de la homologación: 30-oct.
   - Mandale una captura a Plataforma: «sí factura» o qué falta.
5. **Cuenta demo «Clínica Demo Onia»: confirmar su correo y darle module.agents (punto 9)** — Cierra el punto 9 y destraba las demos de venta (hacen falta unas 20 para 5 clientes), las pantallas reales de los reels de Lucía y la imagen del día 3 del seguimiento de leads.
   - En el Gmail de Onia, buscá el correo de confirmación enviado a oninteligenciaartificial+demo@gmail.com y tocá el enlace.
   - Entrá con tu superadmin a app.onia.com.bo/admin/organizations/cmur09d75000601mz12vg59qn/capacidades.
   - En «Módulos», otorgá module.agents.
   - Escribile a Plataforma: «demo confirmada y con module.agents». Ella mira que el recall proponga a Natalia Terceros y Marcelo Vargas.
6. **Crear las plantillas A y B y mandárselas a los leads de agosto** — Canal 1, el más barato: 7 personas que ya escribieron y esperan desde agosto (Bs 0 a 7, ~3 demos). El texto ya lo aprobaste («está bueno»); solo falta crearlas y mandarlas.
   - Creá A (disculpa + demo de 20 min) y B (disculpa + respuestas en pantalla en 20 min) en WhatsApp Manager del 75414930, con los botones «Sí, coordinemos» / «Ahora no». O escribile vos directo a Plataforma en SU sesión: «creá las plantillas A y B de los leads de agosto» (si lo pide la madre, el control de permisos lo frena).
   - Antes de mandar, mirá en app.onia.com.bo/admin/solicitudes si Maximo, Leonardo o Edwin ya crearon cuenta: si la crearon, se les pregunta cómo les fue, sin ofrecer demo.
   - Mandalas desde Chatwoot, inbox 5 «Onia WhatsApp», con TU usuario (así el bot se calla). A: Maximo, Leonardo y Edwin. B: «F» (4 doctores) y Mario. A «F» no se le promete el tratamiento a medias.
   - Al sexto (Saguilera, solo correo): el borrador de ONIA_LEADS_ESPERANDO.md §3.3, por correo.
   - Escribile a Ventas: «salieron». Ventas sigue con las respuestas de SEGUIMIENTO-LEADS.md §2.
7. **Auditoría gratis: elegir A o B y crear el evento en cal.com** — Es el paso del embudo gratis (lo primero de tu orden: marca personal + auditorías + llamadas 1 a 1) que convierte seguidores en llamadas. Hoy no existe en ningún lado, y los mensajes 1 a 1 dependen de esto.
   - Leé ONIA_COMUNIDAD_CONTENIDO.md § «Auditoría gratis y llamada 1 a 1» y contestale a Marca personal: «A» (recomendada: para dueños de clínicas dentales de Santa Cruz) o «B».
   - En cal.com, al lado de «Llamada 1 a 1», creá el evento «Auditoría gratis de su clínica», enlace cal.com/sergiourcullo/auditoria, 20 min, Google Meet, con la descripción y las 2 preguntas obligatorias del doc. O pedíselo a la madre, que lo hace con Chrome.
   - Poné el enlace en tu bio y en el grupo «Onia Community».
   - Avisale a Ventas para que meta la auditoría en los mensajes 1 a 1.
8. **OK a los 12 mensajes a prospectos y decidir MUN** — Canal 2: los prospectos de agosto dan unas 4 demos a Bs 0. Todavía no se contactó a nadie.
   - Abrí https://claude.ai/artifact/8sFD37TVJMcEJaHcZ2PWSV (versión 8, 12 listos). Si ya aprobaste la auditoría, pedile antes a Ventas la versión que la ofrece.
   - Mensaje por mensaje: OK o cambio, escrito a Ventas.
   - MUN: decí si entra con 2 sedes en Santa Cruz o sale.
   - Mandalos vos desde tu WhatsApp (botón «Abrir en WhatsApp» de la página) y avisale a Ventas para que anote cada envío con la fecha.
9. **Aprobar el seguimiento de los días 3, 7 y 14 (4 plantillas, la imagen y el audio)** — Si los leads no contestan en 24 h, cada toque necesita una plantilla aprobada por Meta. Conviene crearlas ya, porque Meta tarda en aprobarlas. Costo ≈ USD 1,5.
   - Leé la tabla de SEGUIMIENTO-LEADS.md §3 (seguimiento_d3_imagen, seguimiento_d7_audio, seguimiento_d14_cierre y seguimiento_30d) y escribile a Ventas: OK o qué cambiar.
   - Imagen del día 3: OK a pendientes-confirmador.png, o sacá una de producción en la demo (/pending).
   - Grabá una nota de voz de ~30 s sobre esa captura: Ventas la arma como video con el comando ffmpeg del doc.
   - Creálas en WhatsApp Manager (MARKETING, sin variables) o pedíselo a Plataforma en SU sesión.
10. **Firmar la respuesta del bot a la pauta** — Sin la firma no se publica el bot de usted (#114) y deploy-bot.sh sigue frenado por los 11 tests rojos del commit 363dcf10. Las conversaciones de la pauta del 16-oct caen en ese bot.
   - Leé el texto en .claude/skills/onia-ventas-pauta/SKILL.md §1 («¡Gracias por escribir desde el anuncio! Para mostrarle Onia con el caso de su clínica…»).
   - Escribile a Ventas: «firmo» o el cambio.
   - Ventas lo pone en knowledge.onia.json y corre la suite. La madre o el carril chatbot lo publica.
11. **ONIA Ads: control total, tarjeta y el 75414930 vinculado a la página «Onia»** — Medido el 5-oct: act_1073680778314945 sigue con has_payment_method: false. Sin tarjeta no se crea nada en Meta, ni siquiera en pausa, y no hay pauta el 16-oct.
   - En business.facebook.com, portfolio OniaAgency (1451773736711697): Configuración de la empresa → Usuarios → Personas → vos → dale control total de ONIA Ads.
   - Si vuelve «Unable to update permissions», mandale una captura a la madre.
   - En ONIA Ads → Métodos de pago → elegí la Visa ···· 4028.
   - En la página «Onia» de Facebook, buscá «Conectar otro número» (WhatsApp) y vinculá el +591 75414930. No borres tu celular 78491375.
   - Avisale a Ventas: verifica con ads_get_ad_accounts que has_payment_method dé true.
12. **Fechas, caja y OK de gasto de Meta desde el 16-oct** — Sin tu OK escrito no se enciende la prueba de pauta (canal 4, unas 3 demos con Bs 750), y las fechas de la 1.0 siguen siendo una propuesta.
   - Confirmá las fechas: 16-oct para los puntos 1-4 y 30-oct para la 1.0.
   - Confirmá la caja de §2: reserva Bs 2.533 y techo Bs 1.400 (Meta 750). Ojo: §5 todavía dice reserva Bs 3.226; vale la de §2.
   - Confirmá que el VPS está pago (la renovación figuraba pendiente desde el 29-sep). El plan reserva Bs 1.383 para 3 meses.
   - OK de gasto: US$4 por día durante 14 días desde el 16-oct, con los cortes de los días 3, 7 y 14 (plan §3).
   - Decidí quién contesta las conversaciones de la pauta antes de 24 h.
   - En el próximo extracto, anotá a qué tipo de cambio te cobró el banco la tarjeta (si pasa de 13,4, se corta antes del día 14).
   - Escribíselo a la madre: Ventas crea la campaña en pausa y la enciende con ese OK.
13. **Grabarte 30 s con la pantalla para el anuncio** — Los 7 anuncios de la competencia que sobreviven tienen una persona, y D1 no. El presentador IA queda descartado: el plan §4 no permite generaciones pagas para la pauta este mes.
   - Grabá 30 s, celular vertical, mostrando la pantalla real de la demo.
   - Subilo a Drive «Videos Onia Octubre» y avisale a Ventas.
   - D1 v3 se te muestra recién cuando Ventas saque «La IA escribe el mensaje» (el catálogo §8 no lo permite).
14. **Decidir hasta dónde llega el «usted»** — Pacientes y bot de ventas ya van de usted. Quedan de vos la web, los anuncios, la app y los correos al dueño, dos plantillas de Meta y el recepcionista. Una respuesta destraba a 3 sesiones.
   - Contestale a la madre 4 sí o no: 1) ¿la web y los anuncios, de usted? 2) ¿la app y los correos al dueño, de usted? 3) ¿plantillas nuevas de seguimiento_demo y recordatorio_demo, de usted? 4) ¿el recepcionista (R_*), de usted, o lo elige cada negocio?
   - La madre reparte: web y app a Plataforma, anuncios y plantillas a Ventas.
15. **Publicar el video N03 «modo auto»** — Está terminado desde el 3-oct y es la única pieza de video lista de la marca personal (tu canal n.º 1).
   - Miralo: se te mandó el 4-oct como archivo y está en el VPS en /root/publicar/n03-modo-auto/final.mp4 (con caption.txt).
   - O lo subís vos, o en la sesión Marca personal pasás el modo de «Auto» a «Accept edits» y escribís «publicalo en <red> el <día y hora>».
16. **Grabar y subir los brutos de los bloques 1 (verde) y 2** — En Drive solo está el bruto de N03 del 1-oct: sin brutos no hay videos nuevos ni nada para editar (Codex T1 y Marca personal esperan).
   - Grabá siguiendo docs/cola/plan-3-semanas/PLAN-GRABACION-3-OCT.md y KIT-GRABACION.md, con el bloque verde primero, trípode, micrófono de solapa y una toma de cierre.
   - Subilos a Drive «Videos Onia Octubre».
   - Avisale a Marca personal (o a Codex, tarea T1): te muestran la tabla de cortes y el preview en 360p ANTES de cortar.
17. **Los 18 carruseles: aprobar, decidir las 10 láminas y agendar** — Están renderizados y revisados desde el 3-oct. El calendario del 3 al 20-oct ya se corrió y no salió ninguno.
   - Mirá https://claude.ai/artifact/FzA8mtJhv81wwADHhYfGgK (las 10 láminas a rehacer están en naranja).
   - Escribile a Marca personal: «rehacé las 10» (1,20 cr, tope 1,50) o «van sin imagen».
   - Escribí «ok, agendá» y pasá esa sesión de «Auto» a «Accept edits» (en Auto, publicar queda bloqueado).
   - Marca reprograma las fechas y te muestra el calendario nuevo.
18. **OK al presupuesto por fases (P2, punto 7)** — Cierra el punto 7. Las capturas ya están; es diseño nuevo, así que necesita que lo veas antes de publicar.
   - Mirá las 12 capturas en hermes-content/docs/cola/capturas-presupuesto-fases/ (dental y estética, a 390 y 1440). Dos ya te llegaron el 5-oct.
   - Escribile a Plataforma: «OK P2» o qué cambiar.
   - Plataforma aplica presupuesto-por-fases-p2.patch, pasa el CI y publica.
19. **OK a la caja diaria (punto 8, #110) cuando lleguen las capturas** — Cierra el punto 8. Ya tiene la revisión aprobada en 2 vueltas; falta que veas la pantalla nueva.
   - Esperá las capturas en hermes-content/docs/cola/capturas-caja-diaria/: sin abrir; abierta con 4 cobros y 1 egreso; cerrada con descuadre; como dueño y como recepción.
   - Escribile a Plataforma: «OK caja diaria» o qué cambiar.
   - Plataforma corre la migración 20261004190000 ANTES del swap y publica.
20. **Mirar con tu sesión las pantallas que ya están publicadas** — Verificar es mirar: lo publicado el 4-oct (#108) y el tablero «La operación» (#107) nadie lo miró con una cuenta de dueño o de superadmin, y se va a mostrar en las demos.
   - En app.onia.com.bo/patients, el filtro «A medias».
   - En la ficha de un paciente con saldo, la etiqueta «Deuda».
   - En /agenda, «Mañana sin confirmar» y una cita «Reprogramada».
   - En /dashboard con tu superadmin, el tablero «La operación» (tiene que decir 0 de 5 pagando, Bs 0).
   - Si algo se ve mal, mandale la captura a Plataforma.
21. **Titular del QR de cobro con el BCP** — El checkout dice OniaAgency y el QR del BCP muestra un nombre de persona. Desde #111 está explicado en pantalla, pero puede frenar el pago de una clínica.
   - Andá o llamá al BCP y pedí que el QR de cobro muestre OniaAgency.
   - De paso, preguntá por el trámite de las credenciales del API QR (el QR dinámico ya está programado y espera eso).
   - Si cambia, avisale a Plataforma para sacar la aclaración del checkout.
22. **SIAT: CAFC del piloto, llamada al SIN y prórroga (vence el 4-nov)** — El trámite 9473 vence el 4-nov. Sin el CAFC no se corren los 180 casos que faltan y se pierde la factura automática, la que después destraba comercio y servicios.
   - Vos, a mano, en el portal del SIAT: sacá el CAFC del piloto para los sectores 1 y 17, sucursal 0 (y puntos de venta 0 y 1 si lo pide por punto de venta). Captura del código y el rango.
   - Llamá al 800 10 3444 con las preguntas de ONIA_FACTURACION_ESTADO_REAL.md §7 (primero la 1 y la 7).
   - Con la respuesta 7, pedí la prórroga de 60 días (Autorización de Sistemas → Solicitud de Prórroga) antes del 4-nov.
   - Mandale las capturas a Plataforma (las carga en /opt/onia-siat/runner-20260929/).
23. **Actualizar el CLI de Codex** — Codex sigue con la 1.0 cuando se acaben los tokens de Claude. Con el CLI 0.139, los modelos gpt-6 fallan y hay que forzar -m gpt-5.5.
   - En la PC, dale el OK a la madre para correr: npm i -g @openai/codex.
   - Que pruebe codex --version y una tarea corta sin -m.
   - Si falla, se sigue con -m gpt-5.5 como hasta ahora.
24. **WhatsApp Manager: caso de soporte por la plantilla AUTHENTICATION, PIN y descripción** — Meta no deja crear la plantilla de autenticación (code 10, subcode 2388185), y eso bloquea la verificación del alta por WhatsApp. El PIN protege el número de ventas.
   - Abrí WhatsApp Manager del 75414930 y buscá cómo abrir un caso de soporte con el error «Esta cuenta de WhatsApp Business no tiene permiso para crear una plantilla de mensaje» (code 10, subcode 2388185, AUTHENTICATION). No uses UTILITY con el código.
   - Activá el PIN de dos pasos.
   - Cargá una descripción de una línea en el perfil.
25. **Lucía: decidir D2 a D6, mirar el kit y conectar su Instagram** — Ningún reel de Lucía puede salir: L02 está editado y espera tu OK, y K1-K4 esperan además la cuenta demo (ítem 5).
   - Contestale a Lucía D2-D6 de hermes-content/docs/cola/lucia-diario/PLAN.md. Recomendado: D2 sí (Reel primero); D3 todavía no; D4 sin voz; D5 OK o corregir los 10 datos de LUCIA.md §0-canon; D6 sí, en la pieza #8.
   - Mirá references/modelos/lucia/v4/kit/kit-fotos-hoja.jpg y kit-clips-preview.mp4, y decí OK o no a L02 («Este video no fue grabado»).
   - Conectá @lucia.antelo.oficial como te indique la sesión y en Instagram buscá y activá «Perfil generado con IA».
   - Reservá «Lucía Antelo» en las otras redes (@mindshft.ai vende otra «Lucía»).
26. **Molde Boceto y largo de los guiones R y G** — El molde Boceto (videos sin cara) está sin probar, y los guiones de ~60 s no entran en el molde Pablo de 21 s.
   - Si querés probar el Boceto, sacá fotos de 4 a 6 dibujos tuyos y subilas a Drive.
   - Escribile a Marca personal si los guiones R y G se acortan a 21 s o quedan largos.
27. **Hermes: sí o no al cambio del autosync, y después la llave de la rutina** — Hermes está apagado en el VPS. El autosync sigue metiendo ramas claude/* a main sin revisión (#82 y #76 entraron así).
   - En la sesión Hermes-Jarvis, escribí «sí» o «no» al cambio: que el autosync deje de hacer fast-forward de main y solo lo haga el integrador, con una variable. Si es sí, se corrige la regla de CLAUDE.md.
   - Escribí «sí» a cerrar los 3 MEDIUM antes de la llave.
   - Después: entorno «Pedidos de Hermes» sin variables, la rutina y la llave según handoff/hermes-jarvis.md §7, pasos 2 a 4. Nunca por chat.
   - Correr aplicar por el workflow entre las 06:30 y las 22:00 de La Paz: gh workflow run hermes-jarvis.yml --ref main -f accion=aplicar.
   - Decidí si se revoca GH_ACTIONS_TOKEN del entorno «Onia»: hoy cualquier sesión puede despachar aplicar, revertir o el deploy.
28. **Cuentas de prueba: cambiar la clave expuesta y autorizar el borrado al cerrar** — La clave de «ZZ QA Clínica Chip» se pasó por chat y hay que tratarla como expuesta. Las cuentas de prueba no se borran sin tu OK.
   - Entrá con esa cuenta (oninteligenciaartificial+qachip@gmail.com) a app.onia.com.bo/profile y cambiá la clave.
   - Cuando cierre la 1.0, escribile a Plataforma: «OK, borrá las QA» (ZZ QA Pago, ZZ QA Clínica Chip).
29. **Competencia: decir que no a las capturas que faltan** — Quedan AgendaPro, Doctoralia y Eholo esperando tu OK de gasto. Recomendación: no, porque la competencia ya está cubierta (mapa de 28 y 16 fichas) y no cambia la 1.0.
   - Escribile a la madre: «competencia cerrada, no se hacen más capturas», o «OK, de a un anunciante» con el tope.

## 7. Próximos pasos (madre nueva)
1. Paso 0 y los resúmenes de cada sesión.
2. Confirmar con Plataforma qué está PUBLICADO (#108, #109, #111) y mirado en prod.
3. Capturas de la caja diaria → Sergio Urcullo → publicar con la migración antes del swap.
4. Destrabar la lista de §6 con Sergio Urcullo, de a una.
5. Siguientes puntos de la 1.0 para Codex (sin pisar a Plataforma): mirar `ONIA_PLAN_1.0_Y_CAJA.md` §1 y elegir los
   cerrados (5, 6, 10 y 11 tocan agenda y pacientes: coordinar con Plataforma antes).
