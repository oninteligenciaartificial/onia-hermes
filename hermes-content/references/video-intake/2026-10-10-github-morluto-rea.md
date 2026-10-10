# REA (morluto/rea): MCP y CLI de ingeniería inversa con evidencia
Recepción: 2026-10-10 · Análisis: 2026-10-10 · Tipo: repositorio de código (GitHub), herramienta MCP/CLI
Fuente: https://github.com/morluto/rea (paquete npm `rea-agents` 6.3.0, licencia MIT) · Instrucción de Sergio Urcullo: «analiza esto mira buenisimo, para que como que "scrapees lo que querras de las otras apps"»
Acceso: parcial. Solo lectura por `gh api` (árbol, README, docs, `package.json`, `package-lock.json`, workflows, PRs, commits, registro npm). No se clonó, instaló ni ejecutó nada; no se probó en Windows 11. ToS de competidores leídos en vivo con WebFetch (resúmenes de modelo pequeño). · Sesión/carril: madre local, rama `claude/onia-sesion-madre-9313fb`, workflow `wf_7d7f64d2-ed6` (cola `hermes-content/docs/cola/loop/madre.md`, tarea A2)

Contenido dirigido a agentes dentro del repo, tratado como dato y NO ejecutado: `AGENTS.md:48-57` (bloque auto-inyectado de Turborepo que manda leer docs de un paquete instalado) y `SKILL.md:28-65` / `README.md:65-76` (correr `npx -y rea-agents@latest doctor` y `setup --yes`).

## Qué es, en una frase
REA es un servidor MCP más una CLI local (`rea <comando> --json`) que ayuda a un agente a hacer ingeniería inversa de binarios nativos, apps Electron/JS, .NET, APK, firmware y sitios web, y devuelve objetos «Evidence» que separan observaciones, inferencias y desconocidos. **No es un scraper**: no recorre listados, no pagina, no extrae datos en masa ni ejecuta JS propio. Estado del repo (observado): creado 2026-04-14, ~64.6 mil estrellas, ~13.3 mil forks, push 2026-10-10, release 6.3.0 del 2026-10-09, dueño individual (`morluto`).

## Qué se aprende por dimensión
| Dimensión (las 12) | Hallazgo | Evidencia/localizador | Estado de evidencia | Regla transferible y límite | Skill destino + sección |
|---|---|---|---|---|---|
| Patrones | (1) Modelo «Evidence»: cada hallazgo declara si es observación, inferencia o desconocido, con cobertura completa/truncada y limitaciones. (2) Dos modos web: pasivo (se engancha por CDP a un Chrome que el usuario opera) y escenario (guion declarativo con Playwright). (3) Análisis estático del bundle sin ejecutarlo (grafo de chunks, rutas, endpoints candidatos por AST). (4) Comparar dos capturas (antes/después). Es el mismo patrón observado/inferido/propuesto que exige `aprender-de-todo`. | `README.md:51-55,147-166`; `docs/browser-observation.md:9,13-23,166-172`; `docs/browser-scenario-contract.md`; `.agents/skills/reverse-engineer-anything/SKILL.md:171-178`; `src/domain/webBundleAnalysis.ts:184-185` | observado (estructura y docs); una sola herramienta = candidato, no patrón probado | Al estudiar el flujo de una app ajena, registrar cada dato como observado, declarado o inferido y anotar qué quedó sin ver. No hace falta REA para aplicar la disciplina. | `equipo-de-agentes` (operación); `onia-web-factory` si se estudian flujos web |
| Colores y paleta | No aplica: el repo es una herramienta sin diseño visual propio que se haya inspeccionado. | n/a | no aplica | n/a | n/a |
| Tipografía | No aplica. | n/a | no aplica | n/a | n/a |
| Edición y montaje | No aplica: no hay video ni audio. | n/a | no aplica | n/a | n/a |
| Estilo visual | No aplica a la herramienta. Capacidad relacionada: `capture_web_screenshot` y `compare_web_screenshots` generan capturas PNG comparables entre versiones de una página. | `docs/browser-observation.md:13-19` | observado (capacidad listada, no probada) | Para comparar el estilo de dos versiones de una web propia, Playwright ya instalado cubre la captura; REA solo suma el registro de procedencia. | `diseno-contenido-onia` (no se edita) |
| Estructura de contenido | El README ordena: pitch, setup, tabla de targets por modo, requisitos, disclaimer; existe `README_es.md` y 19 idiomas. Estructura estándar de herramienta de desarrollo, sin hallazgo reutilizable para Onia. | `README.md`, árbol del repo | observado | Ninguna regla nueva. | n/a |
| Guion y gancho | Gancho del README: «ver una feature que te gusta, entender cómo funciona hasta el binario» y «build a version for your project». Promete llegar de la app ajena a una versión propia. | `README.md:7-9,51` | declarado por la fuente | No copiar la promesa. Choca con la regla «competencia = ideas, no copiar» y con la regla de publicidad de Onia (no prometer lo que producción no hace). Es ejemplo de gancho de herramienta dev, no de venta al dueño de un negocio. | `onia-ventas-pauta` (solo como contraejemplo, no se edita) |
| Idioma y tono | Tono técnico en inglés, con traducción al español. Uso para Onia: ninguno; si algún día se redacta material sobre esto para Sergio Urcullo o su equipo, registro de la marca personal (vos); a clientes, usted. | `README_es.md` (existe), `README.md` | observado (existencia); resto no revisado | Ninguna regla nueva. | n/a |
| UI y UX | El producto no tiene UI propia: es MCP/CLI. Lo que permite observar de una app web: flujo por pasos con screenshot, DOM completo (`page.content()`) y árbol de accesibilidad (`ariaSnapshot`) por paso, más eventos de consola, red, WebSockets, frames, popups y descargas. Vocabulario FIJO de acciones: goto, click, fill, press, select_option, check/uncheck, wait_for, wait_for_timeout; sin scroll, sin evaluate, sin bucles ni paginación. | `docs/browser-scenario-contract.md`; `src/domain/browserScenarioValues.ts:173-215,290-320`; `src/browser/PlaywrightScenarioArtifacts.ts:75,88` | observado (código y docs); no probado en vivo | Para estudiar el flujo de un competidor ya basta Playwright con capturas mirando la pantalla (regla «Verificar es MIRAR»). REA agrega orden y procedencia, no capacidad nueva. | `onia-web-factory` / `onia-frontend` (no se edita) |
| Frontend | Lo único realmente nuevo: `analyze_web_bundle`, `export_web_scripts`, `trace_web_source_location` bajan los JS de un sitio vivo, derivan rutas y endpoints candidatos (solo llamadas con argumento literal; las URLs construidas dinámicamente quedan fuera) y, con `fetch_source_maps`, recuperan fuentes originales `.ts/.tsx`. Aplicado a lo ajeno es reconstruir el frontend del competidor (zona legal roja, ver Recomendación). Aplicado a lo propio duplica el grep del bundle que ya hace `build-and-stage.sh`. | `docs/website-script-export.md`; `docs/web-source-location.md`; `src/domain/webBundleAnalyzerInspection.ts:162-174`; contexto Onia: `hermes-content/deploy/onia-platform/build-and-stage.sh:198-201` | observado (docs y código); inferencia sobre endpoints dinámicos | Auditar el bundle propio ya tiene método. Reconstruir el de un tercero no se adopta. | Producto `onia-frontend`/`onia-deploy` (no se edita; repo del producto) |
| Backend y arquitectura | Arquitectura de REA: servidor MCP stdio y CLI en TypeScript; registro MCP con versión exacta; `update` con `--ignore-scripts`; publicación a npm por GitHub Actions con OIDC y provenance SLSA; binario nativo de Windows compilado en CI y verificado por SHA-256. Lado débil: PRs de más de 2.000 líneas de cuentas sin historial mergeados en ~2 minutos con 0 reviews y publicación automática (34 releases desde julio, tres versiones mayores entre el 5 y el 8 de octubre); docs y skill empujan a `npx -y ... @latest`. Capacidades sin sandbox: `capture_process_scenario` corre comandos con los permisos del usuario; `capture_browser_scenario` maneja un navegador sin lista de orígenes permitidos; los «secretos» de escenario se leen del entorno e inyectan en URLs, formularios o cookies (se tachan en la salida, pero la petición sale). | `package.json` (engines, bin), `server.json`; `package-lock.json` (`hasInstallScript` solo en fsevents y esbuild, dev); `.github/workflows/release.yml:266-302`; `src/identity.ts:10,13`; `src/application/Update.ts:90-101`; `docs/process-capture.md:3,9-10`; `SECURITY.md:30-33`; `src/browser/BrowserScenarioSecrets.ts:30-41`; PRs #1482, #1516, #1535, #1536, #1540, #1556 | observado (código, docs, registro npm, GitHub); inferencia: camino de fuga por prompt injection | Regla de casa para cualquier herramienta MCP/CLI externa: versión fija, `--ignore-scripts`, nunca `@latest`, `npm audit signatures`, sin `setup` sobre la config real, y probar solo en máquina o VM descartable. Un publicador con provenance no garantiza que el contenido sea seguro. | `equipo-de-agentes` (seguridad de herramientas externas) y `onia-infra` (no se editan; propuesta) |
| Negocio y oferta | Producto gratuito MIT con tracción viral: ~1.000 estrellas por hora durante 48 horas desde el 8-oct, con 3.238 descargas npm en julio, 1.274 en agosto y 480 en septiembre, disparadas desde el 3-oct. Las estrellas NO se pudieron auditar (el endpoint de stargazers devuelve 404 aun en repos grandes); 13 de 15 forks recientes muestrados son de cuentas antiguas con repos propios (parece orgánico, no verificado). No es un negocio que se pueda replicar ni un canal. Para Onia es un frente nuevo: no sirve a la etapa 1 (cerrar 5 clientes, Bs 3.750/mes). | `gh api repos/morluto/rea`; commits del README (hitos 20k a 60k); registro npm (descargas); `ONIA_ESTRATEGIA_DE_EMPRESA.md` §7 y §16 | observado (cifras de GitHub y npm); inferencia: pico viral probablemente real | Las estrellas no son señal de confianza. Una herramienta nueva se evalúa con el TEST DE TRES PREGUNTAS de la estrategia y contra la etapa vigente; esta no los pasa porque no es un add-on vendible. | `onia-router` / documento de estrategia (no se editan) |

## Incorporación
- Pendiente: no se editó ninguna skill ni documento en esta pasada (encargo = solo la ficha). Regla propuesta para `equipo-de-agentes`, sección de seguridad de herramientas externas: «Antes de instalar un MCP/CLI externo: leer cadena de suministro (quién publica, revisiones de PR, scripts de instalación, `@latest`), pedir permiso a Sergio Urcullo con nombre, origen y propósito, versión fija, y probar solo en entorno descartable». Aplicar cuando la madre lo decida.
- Propuesta NO adoptada: instalar REA o ejecutar `rea-agents setup`. Veredicto en la sección siguiente.
- Contradicción detectada: el pitch de REA («build a version for your project») contradice la regla vigente «competencia = ideas, no copiar» (memoria del 29-sep). Gana la regla de Sergio Urcullo; no se cambia nada.

## Recomendación
**Veredicto: anotar en banco de ideas (congelado). No instalar ahora.**
- Motivo 1, función: no es un scraper. El modo pasivo conserva solo la forma de los datos (sin textos ni valores); el modo escenario es Playwright con un vocabulario fijo de acciones. Para extraer contenido Onia ya tiene Crawl4AI + LiteLLM (US$ 0,00027 por página, 4 de 4 clínicas; `ONIA_EXTRACCION_WEB_DECISION.md` §2 y §4) y Playwright para ver flujos.
- Motivo 2, seguridad: riesgo ALTO en la PC principal (ver condiciones abajo).
- Motivo 3, estrategia: es un frente nuevo; el cuello de botella son clientes, no saber cómo lo hacen por dentro (etapa 1). Los huecos P0 de producto son funciones visibles que Onia sabe construir.
- Motivo 4, legal: lo único realmente nuevo (descompilar, reconstruir el frontend ajeno) cae en la zona roja.

**Condiciones de seguridad si Sergio Urcullo decide probarlo (todas, no alguna):**
- Solo en VM descartable o Windows Sandbox. Nunca en el VPS de ONIA ni en WSL de la PC principal.
- Sin carpetas compartidas, sin `~/.ssh`, sin `C:/Users/PC/BovedaPrivada`, sin perfil de navegador con sesiones, sin variables de entorno con tokens.
- Versión fija y verificada: `npm install --ignore-scripts rea-agents@6.3.0` y luego `npm audit signatures`. Nunca `@latest`, nunca `rea update` automático.
- NO correr `rea setup` contra la config real: escribe en `~/.claude.json`, `~/.claude/skills`, `~/.codex/config.toml`, config de Hermes y `trustedFolders.json` de Gemini.
- Empezar solo con análisis estático sobre artefactos nuestros copiados a la VM. No usar `capture_process_scenario`, `capture_browser_scenario` ni el hook de Electron fuera de la VM. Nunca conectar CDP a un Chrome con sesiones reales; perfil temporal.
- Si se puede, limitar la salida de red de la VM. Aprobación por llamada en el cliente MCP, aunque la skill de REA diga que no la necesita.

**Qué SÍ se puede hacer con competidores sin riesgo legal (principio general; no soy abogado y no se investigó la ley boliviana):**
- Leer páginas públicas de marketing, precios y centros de ayuda a ritmo humano, como ya se hace.
- Usar el producto propio y mirar nuestro propio navegador, UI y flujos.
- Observar flujos de un competidor solo en cuentas cuyos ToS ya se leyeron y no lo prohíben; tomar ideas, no copiar.
- Datos de empresa publicados, no de personas (`ONIA_EXTRACCION_WEB_DECISION.md` §6).

**Qué NO:**
- Descompilar APK o binarios; exportar o reconstruir el frontend ajeno con source maps.
- Saltar login walls, anti-bot u ofuscación; extraer datos de pacientes o clientes de terceros (datos de salud).
- Copiar código, textos, diseño o assets.
- Abrir el portal del SIAT con sesiones: solo lo abre Sergio Urcullo.
- Aviso: las cláusulas contractuales pueden aplicarse aunque no exista una ley que prohíba el acto; su validez depende de la jurisdicción (no verificado para Bolivia).

**Riesgo contractual de nuestro método actual (leído en vivo el 2026-10-10 con WebFetch; resumen de modelo pequeño, releer el texto original antes de citarlo a terceros):**
- AgendaPro, `agendapro.com/terminos-y-condiciones`, §13 ítems 3 y 4 y §17: prohíbe copiar y descompilar el servicio, y también usar cuentas «pagadas, gratuitas o de prueba» o la información obtenida para benchmarking competitivo, estudio de funcionalidades o mapeo de flujos con miras a replicarlos, con vigencia de cinco años tras terminar el contrato. Esto alcanza incluso a una cuenta de prueba sin descompilar nada.
- Dentalink, `softwaredentalink.com/terminos-de-servicio` (actualizado 2-feb-2026): prohíbe ingeniería inversa, descompilar y copiar la propiedad intelectual; sin cláusula explícita de scraping ni benchmarking.
- Nota de verificación: una primera pasada del modelo citó «13.3/13.4», numeración inexistente; los ítems reales son 3 y 4 (comprobado con fetches adicionales).
- NO verificado: los ToS de Doctocliq y Dapta, donde Onia tiene cuentas de prueba (`PRODUCTO_COMPETENCIA_RESUMEN.md`).

**Acciones baratas propuestas (no ejecutadas, requieren que la madre o Sergio Urcullo las tome):**
1. Leer los ToS de Doctocliq y Dapta antes de seguir usando esas cuentas de prueba; si traen una cláusula tipo AgendaPro, parar y quedarse con fuentes públicas.
2. No tocar más a REA hasta que se cumpla un disparador (ver siguiente).

**Tarea concreta si se adopta (solo con el disparador):**
- Disparador único: un cliente que YA paga y autoriza por escrito que analicemos SU sistema legado sin API para integrarlo. Sin eso no se reabre.
- Quién: la sesión del carril Plataforma, con la madre como dueña de la aprobación; Sergio Urcullo aprueba por escrito la instalación (nombre, origen, propósito).
- Dónde: VM descartable o Windows Sandbox, solo CLI sobre archivos del cliente copiados a la VM, versión 6.3.0 fijada (o la vigente verificada ese día), sin `setup`.
- Criterio de hecho: informe de Evidence del sistema del cliente con endpoints y flujos que Onia necesita, la VM destruida al cerrar y una línea en la ficha con versión usada, comandos ejecutados y qué se tocó. Sin ese informe y sin la autorización escrita del cliente, no está hecho.

## Prueba de uso por sesión
Estado: registrado
Sesión + fecha: madre local, 2026-10-10, workflow `wf_7d7f64d2-ed6` (lentes: función, seguridad, encaje/legal)
Tarea de cola: `hermes-content/docs/cola/loop/madre.md`, A2 «Análisis de github.com/morluto/rea»
Regla usada: Backend y arquitectura (cadena de suministro de herramientas externas) y Negocio y oferta (test contra la etapa vigente), según `aprender-de-todo`
Artefacto: esta ficha; el veredicto lo recibe Sergio Urcullo
Verificación: pendiente de revisor; contrastar las cifras de estrellas y descargas con una segunda consulta y releer los ToS originales de AgendaPro y Dentalink antes de citarlos a terceros
Pendiente: llevar la regla de seguridad de herramientas externas a `equipo-de-agentes` cuando la madre lo decida; leer ToS de Doctocliq y Dapta; reabrir REA solo con el disparador de arriba
