# Auditoría cloud ↔ PC y relevo de madres — 11-oct-2026

**META vigente:** preparar ONIA SaaS con ejecución cloud que continúe con la PC apagada, madres supervisoras y sin retomar producción ni contratar infraestructura.
**PRUEBA DE HECHO:** informe contrastado con referencias Git, observaciones de UI/CLI comunicadas por la madre y documentación oficial; piloto con resultados pendientes.
**REGLA DE PARADA vigente:** ejecutar los contratos autorizados de carriles; Marketing puede publicar piezas YA APROBADAS en cuentas/calendario acordados. Piezas nuevas/gasto requieren OK; no deploy, rotación de secretos, accesos/túneles nuevos ni loops por inferencia. Actualización y commit/push SOLO de este registro autorizados; sin código de producto.

## VIGENTE: PC APAGADA — pruebas y decisiones posteriores al piloto

El requisito ahora es ejecutar sin dependencia de la laptop. **Work Cloud con acceso local se descarta para satisfacer PC apagada**; las madres locales pueden revisar cuando la PC esté disponible, pero no son dependencia de ejecución. La arquitectura anterior de worker local queda como historial para operaciones opcionales de laptop.

**Recomendación:** Work Cloud ya disponible para contratos read-only y, después de verificar repo/tests, desarrollo cloud. Nueva infraestructura: **USD 0**, sujeto a cuota/capacidad de la cuenta. Codex Cloud UI no mostró entornos existentes; **Work Cloud es un producto/entorno distinto y sí ejecutó el piloto**. No inferir que ambos tienen el mismo acceso.

Alternativas evaluadas, **no contratadas**: Browserbase USD 20/mes, 100 h incluidas y USD 0,12/h adicional; VM DigitalOcean compartida USD 24/mes, 4 GiB RAM, 2 CPU y 80 GiB. Precio de infraestructura no incluye otros servicios ni demuestra compatibilidad del login. Fuentes: [Browserbase](https://www.browserbase.com/pricing), [DigitalOcean Droplets](https://www.digitalocean.com/pricing/droplets), [navegador Work](https://learn.chatgpt.com/docs/browser).

**Piloto cloud REAL, evidencia comunicada por la madre:**

- Chat `6acbce63-abc8-83e9-8422-d849d5e15aa4`, creado como **ONIA · Piloto cloud sin PC**, ahora **ONIA · Media cloud**, sección **MARKETING**; madre marketing informada. Durable `01a12c1e-48d1-7349-93ad-33210efa6025`.
- Ejecutó Linux, host `a74001b36ed4`, ruta `/workspace/scratch/786b6dabb916`. Nonce `ONIA-CLOUD-20261011-P1`; SHA-256 `f4a072815aad9f41cf56d1377bafd22b76709e8dad9d17ef859f7a98c8092ae5`. Archivo temporal eliminado.
- Navegador cloud por CDP abrió Higgsfield público: login visible, **NO autenticado**.
- Conector GitHub leyó `README.md` de Hermes, blob SHA `1628a9040ad09220e1bd14ebd0ddbdad73483496`, y `package.json` de Platform, blob SHA `d737491d7ce229f3095b1cbcb44cf593c0ec4d94`.
- Modelo real del ejecutor cloud **no observable**. Apagado físico de PC **no probado**; los comandos observados no usan Windows. Lectura del conector no prueba clone, instalación ni ejecución de tests.
- Incidencia: el piloto devolvió URLs temporales firmadas en output de herramientas. **No reproducir valores**. Contratos siguientes deben filtrar metadata a ruta/SHA antes de devolver output.

**Acceso y ejecución separados:** Higgsfield CLI local pide auth y Chrome local pide Google login; no hace falta resolverlos para el requisito PC apagada. VPS: inventario probado desde laptop con SSH estricto y BatchMode; CLI status JSON indicó plan Pro y 438,17 créditos, sin fecha de renovación. Esto **no demuestra cloud → VPS**. Generación oficial por MCP/CLI usa créditos del plan; API tiene cobro separado, no se autoriza sustituir uno por otro.

**Chats vigentes:** madre marketing local `01a12c1f-bef7-7252-a4b6-f8f8354dfc48`, Astra medium; piloto archivado **ONIA · QA Work Cloud**, ChatGPT `6acbcecb-4ee4-83e8-9f88-9a8514ea2152`, durable `01a12c1f-d94a-7183-aca9-50da8102502a`, sin checkout y modelo no observable. Nuevo **ONIA · Desarrollo Codex Cloud**, tarea `01a12c7e-97e2-7115-8561-0b7658008003`, sección vigente **Plataforma/Infra**, ahora Astra medio enviado; Sol 6.1 Medio fue el selector comprobado durante validación. No duplicar ejecutores ni reactivar Claude.

**Higgsfield, actualización vigente: conector cloud autenticado VERIFICADO.** Usuario instaló el plugin oficial; instalación/conexión ya no pendientes. Discovery anterior `installed:false / ENABLED AVAILABLE` superado. Madre y piloto cloud devolvieron plan Pro, **438,17 créditos**; `free_gens`: Genjutsu 1 (hasta 30 s, 480/720), Viral 0, AIInfluencerBuilder 5; `free_trial.unlim_available:false`. Prueba independiente: durable `01a12c1e-48d1-7349-93ad-33210efa6025`, turno `01a12c67-ddb5-71d7-8b91-7b73e1bab029`, marcador `higgsfield.balance completed`. Ejecutada sin navegador, PC ni VPS, sin generar/modificar; estado físico de PC no observable. **Navegador Higgsfield sigue NO autenticado**, pero no bloquea los flujos soportados por el plugin. Balance no valida generación ni autoriza gasto. Fuentes: [Higgsfield MCP](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-higgsfield-mcp), [Higgsfield API](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api).

**Estado vigente 11-oct:** entorno ONIA Platform publicado/reutilizado; Prisma RESUELTO, generate exit 0 (Client 7.8), typecheck exit 0/cero errores y 16 tests PASS, SHA `1c01e05ff3457692f44352de19d57768d5955bcf`, versionados limpios. Worker usó permiso de red por comando soportado pese a política enforced rev4: mantuvo proxy/TLS/checksums/allowlist. Evidencia `/workspace/work/onia-cloud-validation/report-resolved.md`, `continuity-resolved.json`, nonce `404085b5e8081d0682abd29e`. Build/suite completa, VPS, apagado físico, reinicio y modelo Work no probados.

**Contrato operativo propuesto:** madres locales supervisan y entregan contratos finitos; workers cloud ejecutan lotes ya autorizados aunque la PC se apague. Una madre local **no coordina activamente mientras la laptop está apagada**: operación 24/7 con nuevas decisiones requeriría orquestador cloud, todavía pendiente. Cada lote registra estado en repo/ref/SHA y artefacto verificable; leer deltas desde el último SHA, no documentos completos. Astra medio para madres y toda programación; Sol/Luna solo apoyo mecánico cuando sean configurables. Modelo Work Cloud no observable; selector Codex muestra GPT 6.1 Sol/Ligero, sin extender esa observación a Work. Reutilizar skills canónicas sin duplicarlas. Sin migrar credenciales/sesiones; solo dependencias npm fijadas por lockfiles según aprobación, sin instalaciones globales/apt/pip.

## Decisiones y alcance

- ONIA es SaaS; el reparto vigente tiene MADRE MARKETING y MADRE DESARROLLO-INFRA locales.
- Marketing supervisa Lucía, Marca personal y Ventas/pauta; Desarrollo-Infra supervisa Plataforma, Hermes/QA e infraestructura.
- Las madres definen contratos, delegan, verifican y resumen; delegan la ejecución local a un worker local.
- Prioridad: trabajo cloud. Orquestador definitivo Claude/Codex PENDIENTE; esta auditoría no cambia el orquestador.
- Modelos solicitados: Astra medio para madres y toda programación; Sol/Luna para apoyo mecánico. Capacidad real por cuenta, entorno y herramienta se verifica antes de asignar.
- Claude quedó sin cuota disponible en la observación comunicada; no reactivar sus sesiones.

## Evidencia observada y límites

- Madre informó UI Claude: cuota al 100 %, reinicio 15-oct 04:00 Caracas; Trusted Device bloquea acceso a madres. Es snapshot, no predicción de disponibilidad.
- CLI comunicadas: Claude 2.1.288 y Codex 0.161.0. Esto supera los handoffs de 5-oct que todavía indican Codex 0.139 y gpt-5.5.
- Inventario comunicado: 43 en `onia-hermes/.claude/skills` (no todas propias de ONIA), 30 en `onia-hermes/.agents/skills`, 6 en `onia-platform/.claude/skills` y 108 en `C:/Users/PC/.claude/skills`. Conteos no demuestran paridad ni carga efectiva en cloud.
- Reusar fuentes canónicas `.claude/skills/`; registrar por ejecutor qué skill puede leer y qué versión usa. No duplicar skills para resolver diferencias aparentes.
- Se actualizaron referencias mediante fetch, sin merge de main. Checkout previo `ac8f2d44` (8-oct); `origin/main=2cdefca7` (10-oct).
- Este informe vive en `codex/cloud-pc-audit-20261011`, worktree aislado basado en PR #195. Ningún cambio al checkout principal.
- Lecturas Git del auditor confirman documentos y commits; no confirman sesiones vivas, cuotas actuales, ejecución de timers ni producción.

## Arquitectura anterior — SUPERADA por requisito PC apagada

1. **Descartada para PC apagada:** Work Cloud con acceso local depende del dispositivo. Disponibilidad de acceso local no satisface el requisito vigente.
2. **Respaldo:** ejecutores cloud con contratos autocontenidos; un worker local reutiliza el navegador autorizado y serializa su uso entre las dos madres.
3. Las madres mantienen sus carriles. Un contrato tiene dueño, META, entradas, rutas permitidas, PRUEBA, PARADA y resultado revisable.
4. VPS es un destino separado con alcance/permiso propios; no trasladar bóveda, cookies ni sesiones personales al servidor.
5. No crear túneles, puentes, credenciales o infraestructura nueva durante la auditoría. Disponibilidad comercial no equivale a autorización ni configuración lista.

Fuentes oficiales para validar capacidades, límites y configuración:

- [Work Cloud: acceso local](https://learn.chatgpt.com/docs/enterprise/cloud-local-access).
- [Entornos cloud](https://learn.chatgpt.com/docs/environments/cloud-environments).
- [Claude Remote Control](https://code.claude.com/docs/en/remote-control).
- [Mensajería entre sesiones](https://code.claude.com/docs/en/cross-session-messaging).

La elección queda condicionada a comprobar las funciones en esta cuenta. No declarar acceso operativo a partir de esas páginas.

## Continuidad reciente: fuentes por rama

- Desarrollo: `origin/claude/arranque-nueva-madre-ba386e`, `hermes-content/docs/handoff/madre-local.md:25-47,79-115` (11-oct, PR #195).
- Marketing: `origin/claude/pagos-checkout-strategy-b40756`, `hermes-content/docs/handoff/madre-marketing.md:1-29,31-44,46-55,92-124` (11-oct).
- Main contiene handoffs anteriores: Marca hasta 8-oct; Lucía hasta 5-oct. No reconstruir el presente únicamente desde ellos.
- P1 reciente: `origin/claude/gifted-clarke-y4vvtj`, commit `781df7d87b53913ac9790fa1df88e53357408bc3`, `hermes-content/videos/moldes/niveles/P1-NIVELES-GUION-MOSAICO-TABLERO.md:1-13`.

**Desarrollo, corte documental 11-oct 12:40 UTC:** platform #147, #148/#149/#152/#153, #151, #155 y #156 registrados como mergeados. `release-fd72cd55` figura mirado a las 09:54; publicación 12:50 de parte del lote figura anunciada, no verificada por este auditor. Siete contratos estaban listos para push 13:12; U10 corriendo y #150/#154/#157 abiertos. No relanzar desde este snapshot.

**Marketing, corte documental 11-oct ~09:15 UTC:**

- Cinco brutos con tablas de cortes: N06, DD-A, N07, N02, S2-D07-A. Borradores de los cuatro primeros esperan OK; no son masters aprobados.
- S2-D07-A contiene una afirmación falsa sobre variables de plantillas: cortar o regrabar requiere decisión de Sergio Urcullo.
- G2/G3/G4/G5 y pieza 9 de Lucía: revisiones mudas mostradas, pendientes de OK y voz. G1 v2 tiene autorización de publicación registrada, bloqueada por token IG.
- Prueba 1 v2 de Ventas: réplicas y PARA-GRABAR preparados; falta aprobación, decisión 3/4 anuncios y grabación. No hay aprobación de gasto por inferencia.
- Seis teleprompters SI listos; otras piezas requieren mediciones. Guiones SI-01..SI-11 pasados a Marca.
- P1 Niveles: **guion de 40 s, sin render**; aprobación del molde, 40 frente a 30 s y ajuste del verde pendientes. Commit verificado, no video terminado.
- BA814C81: estado contradictorio entre tabla que lo sitúa en Drive y texto que dice ausente; madre observa falta de enlace utilizable. No tratarlo como recibido.
- Pedidos PC pendientes: render HyperFrames offline y música con licencia verificable. Recordatorios repetidos sin novedad no demuestran avance.
- Handoff registra K11 e historias 1-3 publicados el 10-oct; este auditor no comprobó redes.
- Créditos/voz documentados: 11/150 Higgsfield y 381 caracteres disponibles frente a ~1.800 requeridos. Refrescar antes de cualquier gasto.

**Contradicciones que no deben heredarse como órdenes:**

- El bloque viejo de madre v5 dice “única madre”, mientras el reparto posterior establece dos madres.
- El tope compartido de Codex aparece como 3 corridas y como 2 en secciones distintas; fijarlo antes de lanzar trabajo.
- **ANTIGRAVITY 20:00 UTC:** el handoff dice “sin respuesta, sale”, aunque la regla exige mostrar y OK. Estado vivo **NO VERIFICADO**. No cancelar ni publicar sin orden; señalar el riesgo a la madre.
- La nube todavía puede rechazar autorización transmitida por otra sesión. No rodear el control; obtener autorización válida para el mecanismo concreto.

## Tokens: diagnóstico acotado

Ventana aproximada comunicada: **10-oct 17:06:58 → 11-oct 17:07:19 UTC**; 421 archivos, 4.180 registros únicos, tomando el primer `usage` por `message.id`.

- Cache-read: **1.135.675.131** tokens; output: **1.218.181** tokens.
- Es una aproximación de registros locales, no dinero, cuota consumida, memoria única ni prueba causal de una estrategia fallida.
- Verificar semántica de los contadores y mensajes finales antes de estimar costos: el primer registro puede estar incompleto; cache-read puede acumular el mismo contexto reutilizado en varias llamadas.
- Hipótesis a medir: reducir relectura completa y recordatorios repetidos mediante contratos breves, cambios desde el último SHA y verificación mecánica delegada.

## Caveman: inspeccionado, no activado

Ruta exacta: `C:/Users/PC/.claude/plugins/marketplaces/caveman/skills/caveman/SKILL.md`.
Inspección de líneas 11-23: estilo persistente, nivel full por defecto y eliminación de hedging; líneas 54-67: claridad para riesgos/secuencias y escritura normal de código/commits/PRs.

Propuesta **lite**: español claro, resumen corto con hechos, incertidumbre y siguiente acción; conservar nombres, evidencias y condiciones. No eliminar incertidumbre real. No hay prueba de calidad ni activación. Comprimir salida no demuestra ahorro de input.

## Plan inicial de piloto — HISTORIAL, parcialmente superado

Linux, GitHub, conector Higgsfield, sample media y marcadores entre turnos están verificados. Del plan siguiente siguen pendientes autenticación del navegador, persistencia tras reinicio, checkout/suite de producto y cloud → VPS. El navegador no bloquea operaciones del plugin; los 8 checks aislados no sustituyen la suite.

1. Comprobar disponibilidad en UI de la cuenta/entorno: captura de función y alcance; sin activarla.
2. Solicitar aprobación concreta si requiere acceso nuevo, indicando origen, permisos y destino. No instalar nada durante esta auditoría.
3. Con aprobación, contrato de lectura con nonce inocuo: devolver ACK, nonce, SHA y ruta permitida; conservar evidencia sin secretos.
4. Probar navegador por separado: lectura de página acordada y captura inocua. Confirmar sesión reutilizada y exclusión mutua; no exportar cookies.
5. Probar VPS únicamente bajo autorización independiente y lectura restringida acordada. ACK del repo no habilita VPS.
6. Evaluar fallos, permisos, duplicación y latencia; registrar resultado por prueba. Sin generaciones pagadas en Higgsfield, publicaciones ni producción; lectura de cuenta permitida dentro del piloto autorizado.
7. Elegir arquitectura después de revisar evidencias con Sergio Urcullo. Orquestador, sesiones y modelos quedan sin cambiar hasta entonces.

## Runbook operativo cloud — media/checks aislados verificados; checkout/reinicio pendientes

**Media/cloud, resultado comunicado:** Linux host `a74001b36ed4`, cwd `/workspace/scratch/786b6dabb916`; ffmpeg/ffprobe **6.1.1**, Python **3.12.14**, Node **24.19.0**. Sin instalaciones creó MP4 azul sintético de **1 s**, H.264, **320×240**, **25 frames**, validado con ffprobe. Skills `editor-videos` y `motion-doctrine` de Hermes rama audit accesibles por conector. Evidencia `cloud-media-ready.md`, SHA-256 `e1de285b422ed9661fa86eb2d995b6d6be1336383f45b162d378c8e8c9ec820f`, nonce `ONIA-CLOUD-MEDIA-20261011-P2`. **Segundo turno confirmó SHA y nonce iguales y video de 1 s con ffprobe: persistencia ENTRE TURNOS VERIFICADA.** Persistencia tras reinicio y exportación del MP4 siguen pendientes.

**Historial combinado Codex, SUPERADO:** con npm/lockfiles autorizado, draft **ONIA Desarrollo**, 2 repos y selector GPT 6.1 Sol/Ligero; provisioning >10 min sin máquina ni error formal. Se detuvo este intento. El éxito posterior corresponde únicamente al entorno **ONIA Platform**, no al combinado; no atribuirle checkout/tests.

**Diagnóstico acotado, no causal:** `git count-objects` local comunicado mide Hermes `size-pack` **4,54 GiB** más objetos loose **~6 GiB**; Platform `size-pack` **54,66 MiB**. No equivalen al tamaño exacto que el proveedor descargará ni prueban que el tamaño cause la demora. No limpiar, correr git gc ni cambiar repos para resolver una hipótesis. Falta cierre del worker/provisioning con evidencia.

**Historial onboarding SOLO Platform — publicación pendiente SUPERADA:** combinado detenido, no activo. Chat `01a12c78-3409-7188-b22f-2b2e4f5f4015` completó onboarding en **2 min 12 s**: checkout `/workspace/onia-platform`, rama `codex/cloud-setup`, SHA `1c01e05ff3457692f44352de19d57768d5955bcf`, Node **24.19**, npm **11.9**. `npm ci --ignore-scripts` correcto y `npm test -- lib/http/client-ip.test.ts` **16/16**, sin cambios versionados. Setup/start skill estaban en borrador, nombre **ONIA Platform**. Publicación privada posteriormente CONFIRMADA abajo; no equivale a deploy de producto.

**Historial Prisma:** checksum inicialmente HTTP 403; dominio `binaries.prisma.sh` guardado. Revalidación del contenedor previo EPERM/proxy; tsc no repetido allí. El resultado definitivo del entorno publicado es el siguiente; no confundir ambos intentos.

**Publicación privada CONFIRMADA:** UI **Publicado**, ONIA Platform seleccionable. Captura `C:/Users/PC/.codex/visualizations/2026/10/11/01a12beb-7774-7c02-9931-12264158df83/onia-platform-publicado.jpg`. Tarea `01a12c7e-97e2-7115-8561-0b7658008003`, **ONIA · Desarrollo Codex Cloud**, PLATFORM, Sol 6.1 Medio UI comprobado, final **135 s**. Checkout `/workspace/onia-platform`, rama `codex/cloud-validation`, SHA `1c01e05ff3457692f44352de19d57768d5955bcf`; dependencias existentes en nueva tarea confirman snapshot setup publicado/reutilizado. Vitest client-ip **16/16 PASS**, versionados limpios.

**Resultado previo SUPERADO:** generate exit 1 EPERM/proxy y typecheck exit 1/161 diagnósticos, sin atribuirlos todos a Prisma. Posteriormente worker resolvió acceso mediante permiso de red por comando soportado, sin bypass ni desactivar proxy/TLS/checksums/allowlist. Generate exit 0 Client 7.8, typecheck exit 0/cero errores y 16 tests PASS. Resultado vigente y artefactos arriba; build/suite completa todavía no validados. Publicación de entorno no es deploy de producto.

**Contrato mínimo Platform EJECUTADO:** Node 24 compatible, `package-lock.json` v3, `npm ci --ignore-scripts` aprobado y test puro `npm test -- lib/http/client-ip.test.ts` 16/16. `postinstall=prisma generate` omitido deliberadamente; resultado no valida Prisma ni typecheck/suite completa. No build, seed ni migrate. Prisma generate/typecheck posteriormente resueltos: exit 0; 16 tests PASS. Parar ante nuevo error sin bypass ni ampliación no autorizada.

**Desarrollo Work Cloud, bloqueo comprobado:** intento de clone devolvió **exit 128**, autenticación Git no disponible aunque el conector lee archivos. No copiar credenciales para resolverlo. Esto justifica usar Codex Cloud nativo para código; no tratar lectura por conector como checkout operativo.

**Desarrollo Work Cloud, prueba acotada VERIFICADA:** módulo aislado `client-ip` de PR #154, commit `bf1e761c8af478c8ff626762c4eb93b2b78ec0b8`, **8/8 checks**, Node 24, exit 0. **NO es Vitest ni checkout de repos ni suite del producto**. Marcador dev persistió entre turnos, SHA-256 `e6d996b3c65f274a1c182647c40f4c893bf8db9e322e0bb4b4b8aa13812aaaa9`; no demuestra persistencia tras reinicio.

**Restricciones leídas:** `COORDINATION_MANIFEST.md:3-9` trata septiembre como historial, no inventario vivo ni permiso para reactivar; no reutilizar sus triggers. Fuente encontrada: `hermes-content/docs/EXECUTION_PROTOCOL.md` (no existe `HERMES_EXECUTION_PROTOCOL.md` en raíz). Exige skill/plan/validación, no atribuye permiso Git/publicación a un contrato cerrado y prohíbe un heartbeat/orquestador Codex competidor. El presente encargo excluye producción, secretos e instalaciones fuera de dependencias npm autorizadas por lockfiles; no globales/apt/pip.

**Reanudar:** leer este runbook y contrato del lote; contrastar herramientas/conectores efectivamente disponibles, rama y SHA. Pedir a la madre el delta desde el último SHA, no transcripts completos. Si falta entorno/archivo, registrar bloqueo y detener el paso dependiente; no crear otro ejecutor ni instalar para ocultar la carencia.

| Worker | Entradas y skills canónicas | Salida y prueba de hecho | Parada |
|---|---|---|---|
| Desarrollo/cloud | Repo/ref/SHA y contrato; skills `onia-platform/.claude/skills/onia-{frontend,backend,db,seguridad,verificacion}/SKILL.md` pertinentes | Work: checks aislados 8/8. Native solo Platform: checkout SHA `1c01e05f…`, npm ci y Vitest `client-ip` **16/16**, versionados sin cambios. Prisma generate Client 7.8 exit 0; typecheck exit 0/cero errores | Nuevo error, secreto o bypass requerido; instalación npm aprobada. No editar producto, commit/push, merge ni deploy |
| Media/cloud | Muestra sintética autorizada; para contenido real, fuente exacta y aprobación. `.claude/skills/onia-router/SKILL.md`, `hyperframes/SKILL.md`, `editor-videos/SKILL.md`, `motion-doctrine/SKILL.md`, `media-use/SKILL.md` cuando apliquen | ffmpeg/ffprobe 6.1.1 y sample H.264 1 s, 320×240, 25 frames; persistencia entre turnos **VERIFICADOS**. Reinicio/exportación pendientes. Balance Higgsfield ya verificado | Binario/dependencia ausente, acceso nuevo, material privado no autorizado, generación paga/publicación; sin instalar ni usar cara/voz real en el sample |

**Estado durable por lote:** contrato-ID, dueño/madre, worker/durable/turno, repo/ref/SHA inicial y final, herramientas presentes, comandos ejecutados, artefacto/ruta/SHA, resultado (validado/bloqueado) y siguiente delta. No devolver URLs firmadas ni secretos; una ruta temporal requiere exportación verificada antes de declararla entregada. Resultados de workers se incorporarán a este mismo documento sin inventarlos.

**Modelos:** registrar observable, configurado y no observable por separado. Astra medio para madres/toda programación; Sol/Luna apoyo mecánico donde el selector exista. Work Cloud actualmente no permite verificar el modelo; no etiquetar su salida como Sol/Astra por intención.

**Herramientas versus instalaciones:** shell Linux, conectores, ffmpeg y persistencia entre turnos probados. Work clone bloqueado por auth; native Platform checkout/npm ci/test puro 16/16 verificados. Prisma generate Client 7.8 exit 0; typecheck exit 0/cero errores; suite completa/reinicio pendientes. No pip/apt, plugin adicional, túnel ni migración de sesión/credencial. Workers completan solo el lote autorizado, sin afirmar continuidad 24/7.

**Cierre vigente:** Platform cloud checkout/dependencias/Prisma/typecheck/16 tests verificados, versionados limpios; media recuperó 4 originales Claude N06/N07/DD-A/N02, decodifican, empaquetados en `Borradores-originales-Claude.zip`. DD-A mantiene marcador de confirmación y N02 decisión de 2,4 s: NO nuevas versiones finales. Madre Marketing confirmó que no necesita archivos ni autorización adicional para previews; comprobará primero audio DD-A 01:01–01:09 y ajuste N02. Solo si el audio sigue ambiguo preguntará si dijo Astra o Sol. Build/suite completa, VPS, apagado físico, reinicio y modelo Work no probados. Registro documental en rama de auditoría; sin cambios en código del producto.

**Organización anterior SUPERADA:** sección única y regla de 4 visibles sustituidas por corrección explícita de Sergio: **5 carriles reales bajo 2 madres**, según registro vigente siguiente. Setup `01a12c78-3409-7188-b22f-2b2e4f5f4015`, combinado `01a12c6d-eb0f-768f-a4e6-f4e54856c017` y QA Work `6acbcecb-4ee4-83e8-9f88-9a8514ea2152` permanecen archivados; no reactivarlos. Media existente se convierte en Marca, sin duplicarla.

## Contrato vigente de trabajo autorizado — 2026-10-11

Sergio autorizó poner los workers a trabajar; cada madre supervisa, autoriza su carril y resume resultados. **Primer lote: 15 minutos o entrega de resultado/bloqueo, lo que llegue primero; sin monitor perpetuo.** Mensajes a ambos destinos enviados con éxito de herramienta; acuse e inicio de ejecución todavía POR VERIFICAR. Envío exitoso no demuestra trabajo completado.

- **Desarrollo:** madre Desarrollo = sesión principal de esta coordinación; delegó a `01a12c7e-97e2-7115-8561-0b7658008003`, Sol 6.1 Medio, diagnóstico/arreglo de Prisma, dependencias por lockfile, tests y typecheck. Entrega: comandos/exit codes, diff y SHA/artefacto, distinción fallo de entorno/código y bloqueo concreto. Sin bypass, secretos, producción ni deploy.
- **Marketing:** madre `01a12c1f-bef7-7252-a4b6-f8f8354dfc48` autorizada directamente por Sergio para mensajear/delegar a Media ChatGPT `6acbce63-abc8-83e9-8422-d849d5e15aa4`: recuperar pendientes, cortes/assets y preparar **PREVIEWS privados de material existente**. Entrega: pieza/ruta/versión, evidencia de assets, decisiones de cortes pendientes y preview revisable. Sin gasto, generación de voz/cara nueva, publicación ni master sin OK.
Inicio confirmado por wait_threads: Desarrollo turno 01a12c87-d330-7196-af82-ee8db33d22b5 activo; Media turno 01a12c88-5a7f-7185-9df9-c5fe393ccf08 activo tras delegacion de madre Marketing. Esto confirma ejecucion iniciada, no resultados finales.

## Corrección vigente Sergio: 5 carriles reales bajo 2 madres

Títulos asignados y nuevos chats Lucía/Ventas/Hermes confirmados activos por `list_threads`; tareas concretas enviadas a dueños. Esto prueba despacho/estado del chat, no acceso completo ni resultado.

| Madre | Carril y worker | Próxima tarea enviada y fuente remota |
|---|---|---|
| Desarrollo-Infra | Plataforma `01a12c7e-97e2-7115-8561-0b7658008003` | Barrido restante de usted, PR propio/tests; no repetir #157-160. `origin/claude/optimistic-ride-1sp5fe:hermes-content/docs/cola/loop/plataforma.md:142-149` |
| Desarrollo-Infra | Hermes ChatGPT `6acc36d6-40fc-83e9-8b1c-0a50b7595355` | Localizar/revisar M1c+M1d con lente dinero y regresiones, evidencia propia. `origin/claude/adoring-ramanujan-7sjzwv:hermes-content/docs/cola/loop/hermes-jarvis.md:604-605`; Q1/VPS no autorizado por inferencia |
| Marketing | Marca ChatGPT `6acbce63-abc8-83e9-8422-d849d5e15aa4` (Media reutilizada) | Cuatro originales: versiones revisables; confirmación DD-A/corte N02; masters con ok cortes y posteo según calendario/aprobación. `origin/claude/gifted-clarke-y4vvtj:hermes-content/docs/cola/loop/marca-personal.md:8-11` |
| Marketing | Lucía ChatGPT `6acc36d4-8864-83e9-a185-6745b83ed1e6` | Recuperar/exportar reel viernes v2, preview/SHA/identidad; decisiones calendario/voz/token pendientes. `origin/claude/zealous-babbage-fvtjck:hermes-content/docs/cola/loop/lucia.md:57-60`; no repetir G4/G5 cerrados |
| Marketing | Ventas/pauta ChatGPT `6acc36d5-6ed8-83e9-83e4-f8c414b6112b` | Delta manifiesto/test cuando Sergio elija 3 piezas; demo/capturas desbloquean render. `origin/claude/onia-ventas-pauta-rmdv5j:hermes-content/docs/cola/loop/ventas-pauta.md:3-8`; sin crear campaña/contactar |

**Secciones UI vigentes:** Madres `5a199cb4-3e38-4ba6-a6a0-5d96a36d279f`; Marketing `19a55402-64e8-4be0-851f-bfb0a44f4a71`; Plataforma/Infra `5705d669-5498-4e52-9d0e-8bf0fcf0d156`. Reparto fuente: `madre-local.md:25-38` en rama arranque y `madre-marketing.md:3-6` en rama pagos-checkout; las madres supervisan/resumen, carriles ejecutan.

**Acceso cloud necesario:** Sergio pide cobertura completa para las tareas; pruebas de acceso solicitadas por worker. Registrar repo/ref/lectura, checkout/tests, assets/artefactos, conectores autenticados y VPS solo si corresponde. **No declarar todo conectado** por acceso de otro worker o por tool visible. Bloqueos concretos con paso dependiente detenido, sin compras ni secretos transferidos.

**Q&A pendiente acotado:** loops cloud con PC apagada frente a ronda local cada 30 min y observabilidad del modelo Work. Routing y permiso para piezas aprobadas ya fueron definidos por Sergio en la actualización siguiente. No loops nuevos activos; conservar contratos finitos.

## Decisiones finales vigentes y despacho — 2026-10-11

- **Preferencia a largo plazo: totalmente cloud.** Dos madres/cinco carriles siguen operativos en el reparto documentado; trasladar supervisión permanente a cloud requiere arquitectura y prueba propias. Propuesta de dot cloud en evaluación por agente `cloud_architecture`, **NO confirmada**; no declarar orquestador 24/7 listo.
- **PLATAFORMA Y TODA PROGRAMACIÓN: Astra, effort medio.** Sustituye Sol como ejecutor principal de código en recomendaciones anteriores. Sol/Luna solo apoyo mecánico según contrato. `send_message` ya aplicó `model:gpt-6-astra` a Desarrollo `01a12c7e-97e2-7115-8561-0b7658008003`; configuración enviada no prueba modelo de Work Cloud. Selector Sol citado arriba pertenece al historial de onboarding/validación.
- **Marketing puede PUBLICAR PIEZAS YA APROBADAS**, exclusivamente en cuentas y calendario acordados; nuevas piezas y gasto con OK. Orden enviada a madre Marketing. Esto sustituye la restricción general de pedir autorización de nuevo para cada publicación ya aprobada; verificar versión/SHA aprobado antes de publicar.
- **Ventas, avance comprobado:** worker leyó repo, recuperó las 5 objeciones y validó manifiesto. Meta navegador bloqueado por login y sin conector disponible: no declarar acceso completo ni creación/publicación de campañas. La cifra “0 campañas” del material anterior es histórica, **NO inventario actual**.
- Lucía, Ventas y Hermes nuevos confirmados activos por listado; sus pruebas de acceso/resultados son independientes. No inferir acceso de uno por tool/balance de otro. No compras, secretos transferidos ni loops activos nuevos.
- Las instrucciones históricas Sol/4 sesiones/solo read-only/publicación siempre pendiente quedan superadas por estas decisiones donde corresponda; sus pruebas y límites técnicos conservan validez con fecha y alcance.
