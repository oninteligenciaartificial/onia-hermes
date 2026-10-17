# Ajustes del proyecto «ONIA · Hermes» — 17-oct-2026

Recogido el 17-oct-2026 en modo solo lectura, para que la madre (que no puede leer `/mnt/project-files` y a la que los textos largos del transcript le llegan cortados) tenga los ajustes, entornos, skills, conectores, archivos e hilos en una rama. Valores secretos tapados con `***`; los nombres de variables (por ejemplo `$ONIA_VPS_SSH_KEY_B64`) no son secretos y se dejan.

## a) get_project_settings (salida completa)

Effort de la sesión de canal (jefa): xhigh, cambiado el 17-oct 04:41:54 UTC.

### JSON tal como lo devolvió la herramienta

```json
{"name":"ONIA · Hermes","instructions":"Sos parte de ONIA, la empresa de Sergio Urcullo (Santa Cruz, Bolivia). Llamalo siempre «Sergio Urcullo». Respondé en español.\n\n## Meta hasta el 31-oct-2026\n1. Onia Platform 1.0 operativa para presentar al banco (API QR del BCP), con los 5 rubros probados: dental, estética, servicios profesionales, comercio e importadora.\n2. Bs 3.000 de caja: el taller de IA del sábado 31-oct (Bs 50/60/70, 50 cupos), consultorías y prepago.\nLo que acerca la caja va primero. La orden vigente está en `hermes-content/docs/cola/loop/hermes-jefa.md`.\n\n## PASO 0 de todo hilo (antes de trabajar)\n1. Hacé `cd` al repo: `/home/user/onia-hermes` o `/home/claude/onia-hermes`. El producto está en `onia-platform`, rama `master`.\n2. Cargá con la herramienta Skill `onia-router` y la skill de tu carril. Están subidas a la cuenta: onia-ventas-pauta, diseno-contenido-onia, editor-videos, edicion-referentes, ver-videos, sacar-prompt, higgsfield-generate, anunciante-supremo, onia-backend, onia-db, onia-deploy, onia-frontend, onia-seguridad, onia-verificacion, onia-chatbot, onia-propuestas, onia-contabilidad-bolivia e hyperframes.\n3. Leé `AGENTS.md` (las reglas) y tu handoff en `hermes-content/docs/handoff/<carril>.md`.\n4. Si usás el VPS: `printf '%s' \"$ONIA_VPS_SSH_KEY_B64\" | base64 -d > ~/.ssh/onia_vps && chmod 600 ~/.ssh/onia_vps && ssh onia-vps 'echo VPS_OK'`. Entra por el túnel de Cloudflare, porque el puerto 22 directo no sale. Nunca imprimas la llave. Si el control de permisos lo frena, pedí el sí de Sergio Urcullo en tu hilo.\n\n## Subagentes: obligatorios en toda tarea\n- Cada tarea se reparte en subagentes (herramienta Agent), cada uno con `model` explícito:\n  - haiku lee, cuenta, busca y verifica; varios en paralelo;\n  - sonnet escribe, uno solo por grupo de archivos;\n  - opus decide lo riesgoso: seguridad, plata, precios, migraciones, producción.\n- La jefa también: cada vuelta la hace con subagentes, nunca sola.\n- Cada respuesta final cierra con «Subagentes: N (modelo, tarea)». Una tarea sin subagentes es la excepción y se explica en esa línea.\n\n## Quién hace qué\n- **Jefa** (coordinadora del proyecto): reparte, decide, publica y le habla a Sergio Urcullo. No hace el trabajo de los hilos.\n- **Hilos**: un carril cada uno. Al llenarse, dejan el handoff y la jefa abre uno nuevo.\n- **Madre**: la sesión de control en la PC de Sergio Urcullo (Chrome con sus sesiones, paneles, lo que exige la PC). Lo que necesites de la PC va en una línea que empiece con «PC:».\n- **Codex**: SOLO revisa cada PR. No programa ni publica.\n\n## Cómo se le habla a Sergio Urcullo\n- No es programador. Lo técnico NO se le consulta ni se le cuenta: se decide y se publica cuando pasa sus gates.\n- Pasan por él ANTES, como tarjeta de decisión (una por vez, 3 líneas, con la pieza adjunta y renderizada): diseño nuevo o rediseño de algo vivo, piezas de contenido, su cara o su voz, textos legales, precios, gasto (Higgsfield, Meta Ads, APIMART y toda API paga: primero se cotiza), contacto con clientes o terceros, datos reales de producción, borrado sin copia, SIAT y banco.\n- La jefa le escribe en cada vuelta horaria, siempre, en 3 líneas: en qué trabaja cada hilo, qué se publicó, qué le espera a él y cuántos ayudantes se usaron. Además manda un resumen a las 06:30 y otro a las 18:00 (hora de La Paz).\n- Los hilos responden en su hilo en 1 a 3 líneas; el detalle va en un archivo adjunto.\n- A los clientes se les habla de «usted».\n\n## Publicar\n- Todo cambio va por PR. Nadie pushea a `main` (en onia-platform, `master`).\n- Se mergea solo si cumple todo: no es borrador; el CI está verde; tiene la revisión de Codex del ÚLTIMO commit sin P0/P1 abiertos (si Codex no responde en 2 vueltas, revisa un Sonnet de otra sesión); no tiene conflictos. Lo mergea la jefa, respetando la ventana sin pushes de :20 a :10 en horas de publicación.\n- Después de pushear, se pide «@codex review» una sola vez y no se vuelve a pushear hasta que Codex responda.\n- No se tocan ni se mergean `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, `.github/workflows` ni `hermes-content/deploy` sin la madre.\n- Lo publicado se MIRA en producción con una captura: un HTTP 200 no alcanza.\n\n## Reglas de negocio (no se rompen)\n- Hay un solo producto, Onia Platform, que se vende con packs por rubro. El chatbot es un add-on. Cliente ideal: `hermes-content/docs/ONIA_CLIENTE_IDEAL.md`.\n- Los precios salen solo de `onia-platform/lib/subscription-plans.ts` y `lib/pricing.ts`.\n- La venta nunca exhibe obra: nada de «pronto», «beta» ni «en construcción». No se fabrican testimonios, logos ni cifras: hoy no hay clientes pagando.\n- No hay equipo de ventas: vende Sergio Urcullo.\n- Ningún secreto va en código, nodos de n8n, logs ni chat.\n- El aprendizaje de ventas, pauta y contenido nunca se congela ni se descarta.\n- Lo aprendido va a la skill del carril en el mismo commit. Los subagentes no pueden escribir en `.claude/skills/`: dejá un `.patch` y avisá con «PC:».\n\nFuentes: `AGENTS.md`, `CLAUDE.md` y `hermes-content/docs/ONIA_SISTEMA_AUTONOMO.md`.","repo_urls":["https://github.com/oninteligenciaartificial/onia-hermes","https://github.com/oninteligenciaartificial/onia-platform"],"model_id":"claude-sonnet-5-5","default_environment_id":"env_01BLwXdgpqDS3sx4rg3r2uvg","channel_session_model_id":"claude-opus-5-5","memory_enabled":true,"tasks_enabled":false,"min_routine_interval_minutes":60,"topic":"Ser la jefa de ONIA en la nube: repartir, revisar y decidir el trabajo de los carriles (Plataforma, Ventas y pauta, Marca personal, Lucía, QA) con la PC apagada. Meta hasta el 31-oct-2026: Bs 3.000 de caja (cobrar y conseguir clientes de ONIA Platform). Hilos con Sonnet; Opus solo decide. Nunca sin OK de Sergio Urcullo: gasto, publicar diseño nuevo o textos legales, contactar clientes o terceros, cambiar precios, datos de producción, portal del SIAT."}
```

### Instrucciones (campo `instructions`) con saltos de línea reales

```markdown
Sos parte de ONIA, la empresa de Sergio Urcullo (Santa Cruz, Bolivia). Llamalo siempre «Sergio Urcullo». Respondé en español.

## Meta hasta el 31-oct-2026
1. Onia Platform 1.0 operativa para presentar al banco (API QR del BCP), con los 5 rubros probados: dental, estética, servicios profesionales, comercio e importadora.
2. Bs 3.000 de caja: el taller de IA del sábado 31-oct (Bs 50/60/70, 50 cupos), consultorías y prepago.
Lo que acerca la caja va primero. La orden vigente está en `hermes-content/docs/cola/loop/hermes-jefa.md`.

## PASO 0 de todo hilo (antes de trabajar)
1. Hacé `cd` al repo: `/home/user/onia-hermes` o `/home/claude/onia-hermes`. El producto está en `onia-platform`, rama `master`.
2. Cargá con la herramienta Skill `onia-router` y la skill de tu carril. Están subidas a la cuenta: onia-ventas-pauta, diseno-contenido-onia, editor-videos, edicion-referentes, ver-videos, sacar-prompt, higgsfield-generate, anunciante-supremo, onia-backend, onia-db, onia-deploy, onia-frontend, onia-seguridad, onia-verificacion, onia-chatbot, onia-propuestas, onia-contabilidad-bolivia e hyperframes.
3. Leé `AGENTS.md` (las reglas) y tu handoff en `hermes-content/docs/handoff/<carril>.md`.
4. Si usás el VPS: `printf '%s' "$ONIA_VPS_SSH_KEY_B64" | base64 -d > ~/.ssh/onia_vps && chmod 600 ~/.ssh/onia_vps && ssh onia-vps 'echo VPS_OK'`. Entra por el túnel de Cloudflare, porque el puerto 22 directo no sale. Nunca imprimas la llave. Si el control de permisos lo frena, pedí el sí de Sergio Urcullo en tu hilo.

## Subagentes: obligatorios en toda tarea
- Cada tarea se reparte en subagentes (herramienta Agent), cada uno con `model` explícito:
  - haiku lee, cuenta, busca y verifica; varios en paralelo;
  - sonnet escribe, uno solo por grupo de archivos;
  - opus decide lo riesgoso: seguridad, plata, precios, migraciones, producción.
- La jefa también: cada vuelta la hace con subagentes, nunca sola.
- Cada respuesta final cierra con «Subagentes: N (modelo, tarea)». Una tarea sin subagentes es la excepción y se explica en esa línea.

## Quién hace qué
- **Jefa** (coordinadora del proyecto): reparte, decide, publica y le habla a Sergio Urcullo. No hace el trabajo de los hilos.
- **Hilos**: un carril cada uno. Al llenarse, dejan el handoff y la jefa abre uno nuevo.
- **Madre**: la sesión de control en la PC de Sergio Urcullo (Chrome con sus sesiones, paneles, lo que exige la PC). Lo que necesites de la PC va en una línea que empiece con «PC:».
- **Codex**: SOLO revisa cada PR. No programa ni publica.

## Cómo se le habla a Sergio Urcullo
- No es programador. Lo técnico NO se le consulta ni se le cuenta: se decide y se publica cuando pasa sus gates.
- Pasan por él ANTES, como tarjeta de decisión (una por vez, 3 líneas, con la pieza adjunta y renderizada): diseño nuevo o rediseño de algo vivo, piezas de contenido, su cara o su voz, textos legales, precios, gasto (Higgsfield, Meta Ads, APIMART y toda API paga: primero se cotiza), contacto con clientes o terceros, datos reales de producción, borrado sin copia, SIAT y banco.
- La jefa le escribe en cada vuelta horaria, siempre, en 3 líneas: en qué trabaja cada hilo, qué se publicó, qué le espera a él y cuántos ayudantes se usaron. Además manda un resumen a las 06:30 y otro a las 18:00 (hora de La Paz).
- Los hilos responden en su hilo en 1 a 3 líneas; el detalle va en un archivo adjunto.
- A los clientes se les habla de «usted».

## Publicar
- Todo cambio va por PR. Nadie pushea a `main` (en onia-platform, `master`).
- Se mergea solo si cumple todo: no es borrador; el CI está verde; tiene la revisión de Codex del ÚLTIMO commit sin P0/P1 abiertos (si Codex no responde en 2 vueltas, revisa un Sonnet de otra sesión); no tiene conflictos. Lo mergea la jefa, respetando la ventana sin pushes de :20 a :10 en horas de publicación.
- Después de pushear, se pide «@codex review» una sola vez y no se vuelve a pushear hasta que Codex responda.
- No se tocan ni se mergean `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, `.github/workflows` ni `hermes-content/deploy` sin la madre.
- Lo publicado se MIRA en producción con una captura: un HTTP 200 no alcanza.

## Reglas de negocio (no se rompen)
- Hay un solo producto, Onia Platform, que se vende con packs por rubro. El chatbot es un add-on. Cliente ideal: `hermes-content/docs/ONIA_CLIENTE_IDEAL.md`.
- Los precios salen solo de `onia-platform/lib/subscription-plans.ts` y `lib/pricing.ts`.
- La venta nunca exhibe obra: nada de «pronto», «beta» ni «en construcción». No se fabrican testimonios, logos ni cifras: hoy no hay clientes pagando.
- No hay equipo de ventas: vende Sergio Urcullo.
- Ningún secreto va en código, nodos de n8n, logs ni chat.
- El aprendizaje de ventas, pauta y contenido nunca se congela ni se descarta.
- Lo aprendido va a la skill del carril en el mismo commit. Los subagentes no pueden escribir en `.claude/skills/`: dejá un `.patch` y avisá con «PC:».

Fuentes: `AGENTS.md`, `CLAUDE.md` y `hermes-content/docs/ONIA_SISTEMA_AUTONOMO.md`.
```

## b) Entornos

Obtenidos con `list_environments` (MCP `claude-code-remote`, límite 100, `has_more: false`). Son 4 entornos, todos `state: active`, `kind: anthropic_cloud`, `description` vacía. Entorno por defecto del proyecto: `env_01BLwXdgpqDS3sx4rg3r2uvg` (Onia).

| Nombre | ID | Creado (UTC) | Política de red | Script de setup | Nombres de variables de entorno |
|---|---|---|---|---|---|
| Hermes | `env_01WtwJgfzjU7sEthiFMwubiH` | 2026-10-02 00:01:22 | No disponible en esta sesión | No disponible en esta sesión | No disponible en esta sesión |
| Onia (default del proyecto) | `env_01BLwXdgpqDS3sx4rg3r2uvg` | 2026-09-30 11:54:52 | No disponible en esta sesión | No disponible en esta sesión | No disponible en esta sesión |
| onia-higgsfield | `env_01V5EeE4VtMdw7PWVaMYywsk` | 2026-09-30 02:26:39 | No disponible en esta sesión | No disponible en esta sesión | No disponible en esta sesión |
| Default | `env_019shXjK7bU3ub7G2Ksko5CA` | 2026-04-08 17:59:11 | No disponible en esta sesión | No disponible en esta sesión | No disponible en esta sesión |

No disponible en esta sesión: política de red, script de setup y nombres de variables de entorno por entorno. Qué se buscó: `ToolSearch` con `list_environments`, y luego con «environment network setup script env vars». La única herramienta de entornos que existe es `mcp__claude-code-remote__list_environments`, y solo devuelve `environment_id`, `name`, `description`, `state`, `kind` y `created_at`; no expone red, setup ni variables. Esos tres datos están en la pantalla de ajustes de cada entorno en claude.ai (documentación del producto: páginas `environment.network`, `environment.setup_script` y `environment.secrets`), o se piden a la madre en la PC con una línea «PC:». Lo único que se sabe por las instrucciones del proyecto es que existe la variable `$ONIA_VPS_SSH_KEY_B64` (solo el nombre) y que se usa para entrar al VPS por el túnel de Cloudflare; no se sabe en cuál de los 4 entornos está definida.

## c) Skills y conectores MCP

### Skills (ListSkills de claude.ai)

`ListSkills` sin filtro devolvió todo; no hizo falta `SearchSkills`. Son 50 skills, todas `enabled: true`.

| # | Skill | Descripción en una línea |
|---|---|---|
| 1 | anunciante-supremo | Anuncios verticales 9:16 para infoproductos con 4 plantillas (B-roll + voz en off, UGC A-roll, Claymation, Zack D Films), de punta a punta con una sola llave (APIMART). |
| 2 | onia-verificacion | Cargar antes de declarar terminado un trabajo en Onia Platform: loop de verificación, qué cuenta como prueba, baseline de tests. |
| 3 | onia-seguridad | Cargar antes de tocar auth, claves, env vars, webhooks o pagos de Onia Platform. |
| 4 | onia-frontend | Cargar antes de tocar componentes, páginas o estilos de Onia Platform: dirección visual, vocabulario por rubro, planes, iconos, precios en UI. |
| 5 | onia-deploy | Cargar antes de deployar Onia Platform o tocar contenedores del VPS: build en el VPS, gates del bundle, swap con backup. |
| 6 | onia-db | Cargar antes de tocar schema, migraciones o datos: dónde vive la base real, RLS, migraciones quirúrgicas, backups, cuentas QA. |
| 7 | onia-backend | Cargar antes de tocar API routes, server actions o `lib/`: multi-tenant, planes, Zod, dayOfWeek, email propio, Prisma 7. |
| 8 | hyperframes-core | Contrato de composición de HyperFrames: estructura, atributos `data-*`, tracks, sub-composiciones, reglas de render determinista. |
| 9 | hyperframes | Entrada por defecto para crear, editar o renderizar cualquier video o motion graphic con HyperFrames; rutea al flujo especializado. |
| 10 | talking-head-recut | Empaqueta un video de cámara con tarjetas gráficas superpuestas (títulos, lower-thirds, datos, citas) sincronizadas con la transcripción. |
| 11 | seam-craft | Doctrina de render para costuras entre escenas en videos HyperFrames (guardas contra flash blanco, solapes de wrappers). |
| 12 | pricing | Decisiones de precios, empaquetado y monetización (tiers, freemium, valor, disposición a pagar). |
| 13 | hyperframes-cli | Ciclo de desarrollo con la CLI de HyperFrames: init, lint, check, preview, render local/nube, transcribe, tts y diagnóstico de fallos. |
| 14 | embedded-captions | Agrega subtítulos a un video de un solo sujeto sin editar el metraje: literales, cinematográficos detrás del sujeto o con VFX. |
| 15 | cut-the-curve | Catálogo de técnicas de costura y entrada de texto (zoom-through, cut-the-curve, waterfall, rack-focus, nudge curve). |
| 16 | copywriting | Escribir o mejorar texto de marketing para páginas (home, landing, precios, producto). |
| 17 | content-strategy | Planificar estrategia de contenido: qué crear, temas, pilares, calendario editorial. |
| 18 | competitor-profiling | Investigar y perfilar competidores a partir de sus URLs, con fichas en markdown. |
| 19 | ad-creative | Generar y escalar creatividades de anuncios (titulares, textos, variantes, estáticos, video) para plataformas de pauta. |
| 20 | onia-router | Índice maestro al inicio de cualquier trabajo en el monorepo onia-hermes: rutea la tarea a su carril, skills, subagente y docs fuente. |
| 21 | equipo-de-agentes | Método del equipo de agentes de Onia desde el 9-oct-2026: madre local, sesiones de nube en loop, Codex, verificadores Haiku. |
| 22 | aprender-de-todo | Protocolo de Claude y Codex para aprender por dimensión de todo material enviado por Sergio Urcullo. |
| 23 | ver-videos | Ver, entender y transcribir un video (link o archivo) con ffmpeg + Whisper. |
| 24 | sacar-prompt | Sacar el prompt que recrearía una imagen o un video de referencia (plantillas cine vs UGC). |
| 25 | onia-ventas-pauta | Todo el carril Ventas y pauta de Onia: prospección, mensajes 1:1, demo, objeciones, piezas de anuncio, campaña de Meta, método «anuncio que vende». |
| 26 | onia-propuestas | Crear, cotizar y enviar propuestas comerciales con el generador oficial y las reglas de pricing de Onia. |
| 27 | onia-infra | Cargar antes de tocar el VPS, Docker, n8n o SSH: diagnóstico, trampas de shell, lectura real de la carga. |
| 28 | onia-core | Tocar onia-core (contract.json, adapters, schema, módulos) o adoptar el núcleo en un pack por rubro; validador verde antes de commitear. |
| 29 | onia-contabilidad-bolivia | Temas fiscales y contables de Bolivia: SIAT, IVA/IT/IUE/RC-IVA, IUE-BE, RNDs/DS, postura fiscal propia de ONIA. |
| 30 | onia-chatbot | Todo el trabajo del chatbot de Onia: motor conversacional, guion, conocimiento, Chatwoot, WhatsApp Cloud API, modelo LLM, voz, panel. |
| 31 | higgsfield-generate | Generar imágenes, videos, 3D y audio con Higgsfield AI (GPT Image 2.5, Seedance 2.5, Nano Banana, Marketing Studio). |
| 32 | editor-videos | Editar, cortar y producir video vertical o horizontal: silencios, muletillas, subtítulos, overlays, SFX, música, censura de caras («sin editores humanos»). |
| 33 | edicion-referentes | Editar videos nuevos de Sergio Urcullo replicando por mecanismos medidos el montaje de referentes (Santiago Muñoz, Erik Taveras, Enrique Rocha, etc.). |
| 34 | diseno-contenido-onia | Índice único del diseño de contenido de la marca personal y de ONIA: carruseles, portadas, miniaturas, Higgsfield, pack referentes, control de calidad. |
| 35 | onia-web-factory | Construir o rediseñar superficies web en onia-hermes con el flujo real del generador de Web Factory y los gates antes de main. |
| 36 | onia-hermes-jarvis | Método para tocar a Hermes (asistente de Sergio Urcullo por Telegram), sus resúmenes 06:30 y 21:30, la aduana de avisos y el workflow hermes-jarvis. |
| 37 | motion-doctrine | Ley de movimiento de alto nivel para videos HyperFrames multiescena (vector, portadores, seam gate, sin vaivén ocioso). |
| 38 | docs | Documentos editables que se comparten y comentan; hay que usar su conector antes de crear. |
| 39 | google-workspace | Crear o cambiar archivos de Google Docs, Sheets o Slides en Drive. |
| 40 | computer-use | Control del escritorio de la PC (capturas, clics, teclado) vía la app de escritorio. |
| 41 | chrome-browser | Usar Claude in Chrome (la extensión) con las sesiones reales de la persona. |
| 42 | built-in-browser | Usar el navegador integrado de la app de escritorio de Claude. |
| 43 | deep-research | Investigación multi-fuente coordinada con subagentes y reporte narrativo con citas. |
| 44 | import-memory | Importar una exportación de memoria de otro asistente de IA a la memoria de Claude. |
| 45 | morning | Generar el resumen de la mañana como artefacto HTML o rutina diaria (solo si se pide). |
| 46 | skill-creator | Crear, mejorar y medir skills. |
| 47 | xlsx | Leer, editar o crear hojas de cálculo (.xlsx, .csv, .tsv). |
| 48 | pptx | Leer, editar o crear presentaciones .pptx / .potx. |
| 49 | pdf | Leer, combinar, dividir, rellenar o crear PDFs. |
| 50 | docx | Crear, leer o editar documentos Word (.docx / .dotx). |

### Conectores claude.ai de la org (ListConnectors)

Estado `connected`: Cloudflare Developer Platform, Figma, Gamma, Gmail, Google Calendar, Google Drive, higgsfield, Meta ads, Meta Developer Tools, N8N MCP, Notion, Supabase, TikTok for Business, Vercel.

Estado `needs_reconnect`: Fillout.

Todos con `enabledInChat=false` en la sesión de la jefa (no los usa ella; los hilos pueden tenerlos).

### MCP propios

- Jefa: `hearthbot`, `claude-code-remote`.
- Ayudantes (subagentes): los mismos más `github`.

## d) Archivos en /mnt/project-files (2 niveles)

`/mnt/project-files` es un symlink a `/mnt/attach/project-files` (carpeta de red). Se midió solo con `find -H ... -maxdepth 2 -printf '%y %s %p\n'` y `du -sh` por carpeta de primer nivel; no se leyó el contenido de ningún archivo.

Resumen: 13 carpetas de primer nivel, 0 archivos sueltos en la raíz. 62 entradas hasta el nivel 2 (13 de nivel 1 + 49 de nivel 2), por debajo del umbral de 300, así que se listan todas. En total, a cualquier profundidad, hay 121 entradas (archivos y carpetas). Peso total aproximado: 220 MB (casi todo en `videos`).

### Primer nivel

| Carpeta | Peso (`du -sh`) | Entradas (todas las profundidades) |
|---|---|---|
| aprendizaje | 24K | 2 |
| auditoria | 8,0K | 1 |
| calidad | 14M | 9 |
| competencia | 20K | 2 |
| diagnostico | 12K | 1 |
| estado | 28K | 7 |
| herramientas | 12K | 3 |
| marca | 1,7M | 30 |
| plataforma | 408K | 5 |
| reels | 4,0K | 1 |
| uploads | 4,2M | 8 |
| ventas | 124K | 10 |
| videos | 200M | 42 |

### Nivel 2 (tipo `d` carpeta, `f` archivo; tamaño en bytes)

```
d 0 /mnt/project-files/aprendizaje
f 17997 /mnt/project-files/aprendizaje/2026-10-16-fluna-mini-clases-y-anunciante-supremo.md
f 1689 /mnt/project-files/aprendizaje/2026-10-17-fluna-mini-clases-y-anunciante-supremo.md
d 0 /mnt/project-files/auditoria
f 5947 /mnt/project-files/auditoria/AUDITORIA_CARRILES_20261016.md
d 0 /mnt/project-files/calidad
f 5442 /mnt/project-files/calidad/INGENIERIA_INVERSA_REFERENTES_Y_INFLUENCERS_IA.md
f 8071 /mnt/project-files/calidad/PLAN_CALIDAD_CARRUSELES_LUCIA_HIGGSFIELD.md
d 0 /mnt/project-files/calidad/lucia-muestras
d 0 /mnt/project-files/competencia
f 4189 /mnt/project-files/competencia/ESTETICA_Y_SERVICIOS_FICHA.md
f 9269 /mnt/project-files/competencia/FUNCIONES_PARA_LA_1_0.md
d 0 /mnt/project-files/diagnostico
f 8489 /mnt/project-files/diagnostico/CONTEXTO_HILO_17OCT.md
d 0 /mnt/project-files/estado
f 1082 /mnt/project-files/estado/calidad-lucia-higgsfield.md
f 1195 /mnt/project-files/estado/competencia.md
f 1591 /mnt/project-files/estado/marca.md
f 1334 /mnt/project-files/estado/noticias.md
f 1359 /mnt/project-files/estado/plataforma-1-0-banco.md
f 1527 /mnt/project-files/estado/ventas-y-pauta.md
f 1311 /mnt/project-files/estado/videos-de-sergio.md
d 0 /mnt/project-files/herramientas
f 1053 /mnt/project-files/herramientas/EVALUACION_REPOS_Y_TRANSCRIPCION.md
f 3223 /mnt/project-files/herramientas/LOS_10_REPOS_REVISION.md
f 953 /mnt/project-files/herramientas/transcribe-local.py
d 0 /mnt/project-files/marca
f 9554 /mnt/project-files/marca/CAPTIONS_Y_YAPS_VIDEOS_17OCT.md
f 2417 /mnt/project-files/marca/COMUNIDAD_POSTS_DIARIOS_SEMANA_19-25.md
f 11903 /mnt/project-files/marca/FUNNELS_WEBINARS_Y_PREPAGO_REFERENTES.md
f 5378 /mnt/project-files/marca/LISTA_DE_GRABACION_SEMANA_19-25.md
f 6422 /mnt/project-files/marca/MAPA_DE_CONTENIDO_POR_APP.md
f 17816 /mnt/project-files/marca/ONIA_LANZAMIENTO_PREPAGO.md
f 15314 /mnt/project-files/marca/ONIA_WORKSHOPS_ALTERNATIVA_Bs150.md
f 4465 /mnt/project-files/marca/PREPAGO_OPCIONES_VOLUMEN_17OCT.md
d 0 /mnt/project-files/marca/carruseles
d 0 /mnt/project-files/marca/noticias
d 0 /mnt/project-files/marca/pagina-taller
d 0 /mnt/project-files/plataforma
f 3328 /mnt/project-files/plataforma/COBRO_QR_PASARELAS_BOLIVIA.md
f 5808 /mnt/project-files/plataforma/ONIA_1.0_QA_5_RUBROS_Y_DEMO.md
f 143392 /mnt/project-files/plataforma/login-1440.png
f 175688 /mnt/project-files/plataforma/register-1440.png
f 77984 /mnt/project-files/plataforma/register-390.png
d 0 /mnt/project-files/reels
f 2986 /mnt/project-files/reels/fichas-posts-claude-tokens-y-repos.md
d 0 /mnt/project-files/uploads
d 0 /mnt/project-files/uploads/hearth
d 0 /mnt/project-files/ventas
f 24553 /mnt/project-files/ventas/07-PREPAGO-LEADS-Y-PROSPECTOS.md
f 14745 /mnt/project-files/ventas/08-WEBINAR-DUENOS-DE-CLINICAS.md
f 10973 /mnt/project-files/ventas/09-FUNNEL-INSTAGRAM-A-PAGO-QR.md
f 8371 /mnt/project-files/ventas/BIBLIOTECA-REPASO-16OCT.md
f 3003 /mnt/project-files/ventas/CAPTURAS-3-ANUNCIOS-PARA-LA-PC.md
f 8715 /mnt/project-files/ventas/PLAN-PAUTA-4-GRUPOS.md
f 4974 /mnt/project-files/ventas/PREPAGO-POLITICA-DE-DEVOLUCION-PROPUESTA.md
d 0 /mnt/project-files/ventas/pausa-17oct
d 0 /mnt/project-files/videos
f 8647 /mnt/project-files/videos/VIDEOS_DE_SERGIO_ESTADO_Y_CORTES.md
d 0 /mnt/project-files/videos/cortes
d 0 /mnt/project-files/videos/previews
d 0 /mnt/project-files/videos/transcripciones
```

(El tamaño `0` que `find` muestra para una carpeta no es su peso real; ver la tabla de primer nivel.)

### Contenido de las carpetas de nivel 2 (nivel 3, solo nombres y bytes, para dimensionar)

- `calidad/lucia-muestras` (6 archivos): `PROCEDENCIA-prueba.jsonl` 320 · `kit-clips-preview.mp4` 961.045 · `kit-fotos-hoja.jpg` 350.008 · `l02-este-video-no-fue-grabado.mp4` 12.350.419 · `lucia-v5b-prueba-1.jpg` 172.863 · `lucia-v5b-prueba-2.jpg` 151.826.
- `marca/carruseles` (2): `taller-1-cuenta-hoja.png` 242.999 · `taller-2-que-sale-hoja.png` 239.641.
- `marca/noticias` (12): `2026-10-19.md` a `2026-10-25.md` (7 días, 3.901 a 6.731 bytes cada uno) · `GUIONES_FINALES_SEMANA_19-25.md` 65.663 · `_indice.md` 1.432 · `_plan-semana-19-25.md` 7.832 · `_rutina-diaria.md` 2.190 · `materia-prima-2026-10-17.md` 5.148.
- `marca/pagina-taller` (5): `auditoria-1440.png` 272.317 · `auditoria-390.png` 253.740 · `boceto-1440.png` 243.752 · `boceto-390.png` 215.890 · `boceto-auditoria.html` 8.076.
- `uploads/hearth` (7 archivos con nombre UUID, sin extensión): 4.182.555 · 6.847 · 13.221 · 87.737 · 9.906 · 76.363 · 3.500.
- `ventas/pausa-17oct` (2): `07-PREPAGO-LEADS-Y-PROSPECTOS.md` 24.553 · `09-FUNNEL-INSTAGRAM-A-PAGO-QR.md` 10.973 (mismos nombres y mismos bytes que los dos archivos homónimos de `ventas/`; no se comparó el contenido).
- `videos/cortes` (5 `.md`): `DD-A-gpt-sol-cache.md` 8.252 · `N02-sonnet-4-5.md` 9.293 · `N06-antigravity.md` 5.181 · `N07-haiku.md` 9.610 · `S2-D07-A-ventana-24h.md` 7.490.
- `videos/previews` (5 subcarpetas): `DD-A-gpt-sol-cache`, `N02-sonnet-4-5`, `N06-antigravity`, `N07-haiku`, `S2-D07-A-ventana-24h` (de aquí sale la mayor parte de los 200 MB de `videos`; no se listaron sus archivos).
- `videos/transcripciones` (7 `.txt`): de 963 a 3.637 bytes.

## e) Hilos

Modelo por defecto de los hilos: `claude-sonnet-5-5`. Jefa (sesión de canal): `claude-opus-5-5`.

| Título | cse | Modelo | Estado |
|---|---|---|---|
| Ventas y pauta | cse_01KihhsvdBhjn6biyNLySgmW | sonnet-5-5 | pausado |
| Competencia para la 1.0 | cse_01119t6HUoP59CUhLgsp8GkU | sonnet-5-5 | pausado |
| Marca, comunidad y workshops | cse_01LTCNTrLFvWwDhQHBZMXzqy | sonnet-5-5 | pausado |
| Plataforma 1.0 banco (con acceso) | cse_01GENMCjhNiPY6NvtEE13pZ9 | sonnet-5-5 | pausado |
| Videos de Sergio y posteador | cse_018ttaNxoxfUQ3dn9AGMsX7w | sonnet-5-5 | pausado |
| Calidad de carruseles, Lucía e Higgsfield | cse_011w3EuHgpuQJETHY7dzfPgb | sonnet-5-5 | pausado |
| Noticias de Bolivia y contenido automático | cse_01MWGjq2sFzDLVhtYitYsADA | sonnet-5-5 | pausado (su revisión opus seguía editando GUIONES_FINALES_SEMANA_19-25.md) |
| Diagnóstico de contexto | cse_01DXafqmvBQKPfD5oA2WV7dN | sonnet-5-5 | trabajando (único activo por la pausa) |
| Auditoría de carriles | cse_01FMdSaqpvWQkDLpYJ3yQngu | sonnet-5-5 | bloqueado, sin resolver |
| Reels y navegador (entorno Onia) | cse_01BYA9BWkWUZCHM3DTc5HwXy | sonnet-5-5 | completado, sin resolver |
| «/equipo-de-agentes» | cse_01WFHrsJ9zrsPDywDWDtiuQW | sonnet-5-5 | trabajando (no lo abrió la jefa; abierto 04:41 UTC) |

Resueltos: Plataforma 1.0 para el banco (cse_01SNfYdLjYy4F8HyRH1Duw39), Pruebas de navegador y reels (cse_01D8GsV5euyUHWWMdmwKBgkd), Transcripción (cse_01GFFkqUVig2ZhWKmH78xuvL), Aprender clase de pagos (cse_0111WayEhm9xXDVke9WZpRmV).

Rutinas de la jefa desactivadas por la pausa:

- `trig_01TkvvqkTqu6EL1PzuRseftR` (vuelta horaria)
- `trig_01HNvie3A6BhpYDc3KdXmc67` (resumen 06:30 La Paz)
- `trig_01MowrMbchsE9Gj2KNuz9ZpE` (resumen 18:00 La Paz)
