# Auditoría cloud ↔ PC y relevo de madres — 11-oct-2026

**META vigente:** preparar ONIA SaaS con ejecución cloud que continúe con la PC apagada, madres supervisoras y sin retomar producción ni contratar infraestructura.
**PRUEBA DE HECHO:** informe contrastado con referencias Git, observaciones de UI/CLI comunicadas por la madre y documentación oficial; piloto con resultados pendientes.
**REGLA DE PARADA:** fuera de los chats read-only autorizados y pruebas descritas abajo, no activar sesiones, instalar, generar, publicar, desplegar, rotar secretos ni crear accesos/túneles; cualquier acceso nuevo requiere aprobación específica. La madre revisa este documento antes de commit/push.

## VIGENTE: PC APAGADA — pruebas y decisiones posteriores al piloto

El requisito ahora es ejecutar sin dependencia de la laptop. **Work Cloud con acceso local se descarta para satisfacer PC apagada**; las madres locales pueden revisar cuando la PC esté disponible, pero no son dependencia de ejecución. La arquitectura anterior de worker local queda como historial para operaciones opcionales de laptop.

**Recomendación:** Work Cloud ya disponible para contratos read-only y, después de verificar repo/tests, desarrollo cloud. Nueva infraestructura: **USD 0**, sujeto a cuota/capacidad de la cuenta. Codex Cloud UI no mostró entornos existentes; **Work Cloud es un producto/entorno distinto y sí ejecutó el piloto**. No inferir que ambos tienen el mismo acceso.

Alternativas evaluadas, **no contratadas**: Browserbase USD 20/mes, 100 h incluidas y USD 0,12/h adicional; VM DigitalOcean compartida USD 24/mes, 4 GiB RAM, 2 CPU y 80 GiB. Precio de infraestructura no incluye otros servicios ni demuestra compatibilidad del login. Fuentes: [Browserbase](https://www.browserbase.com/pricing), [DigitalOcean Droplets](https://www.digitalocean.com/pricing/droplets), [navegador Work](https://learn.chatgpt.com/docs/browser).

**Piloto cloud REAL, evidencia comunicada por la madre:**

- Chat `6acbce63-abc8-83e9-8422-d849d5e15aa4`, título **ONIA · Piloto cloud sin PC**, durable `01a12c1e-48d1-7349-93ad-33210efa6025`.
- Ejecutó Linux, host `a74001b36ed4`, ruta `/workspace/scratch/786b6dabb916`. Nonce `ONIA-CLOUD-20261011-P1`; SHA-256 `f4a072815aad9f41cf56d1377bafd22b76709e8dad9d17ef859f7a98c8092ae5`. Archivo temporal eliminado.
- Navegador cloud por CDP abrió Higgsfield público: login visible, **NO autenticado**.
- Conector GitHub leyó `README.md` de Hermes, blob SHA `1628a9040ad09220e1bd14ebd0ddbdad73483496`, y `package.json` de Platform, blob SHA `d737491d7ce229f3095b1cbcb44cf593c0ec4d94`.
- Modelo real del ejecutor cloud **no observable**. Apagado físico de PC **no probado**; los comandos observados no usan Windows. Lectura del conector no prueba clone, instalación ni ejecución de tests.
- Incidencia: el piloto devolvió URLs temporales firmadas en output de herramientas. **No reproducir valores**. Contratos siguientes deben filtrar metadata a ruta/SHA antes de devolver output.

**Acceso y ejecución separados:** Higgsfield CLI local pide auth y Chrome local pide Google login; no hace falta resolverlos para el requisito PC apagada. VPS: inventario probado desde laptop con SSH estricto y BatchMode; CLI status JSON indicó plan Pro y 438,17 créditos, sin fecha de renovación. Esto **no demuestra cloud → VPS**. Generación oficial por MCP/CLI usa créditos del plan; API tiene cobro separado, no se autoriza sustituir uno por otro.

**Chats nuevos read-only autorizados:** madre marketing local `01a12c1f-bef7-7252-a4b6-f8f8354dfc48`, creada con Astra medium; Desarrollo cloud `6acbcecb-4ee4-83e8-9f88-9a8514ea2152`, durable `01a12c1f-d94a-7183-aca9-50da8102502a` (client previo `local-chatgpt:f3aed11e-2adb-4e0d-9bd0-d3fa44e51521`). Modelo cloud sin control verificable. No duplicar ejecutores ni reactivar Claude desde estos IDs.

**Higgsfield, actualización vigente: conector cloud autenticado VERIFICADO.** Usuario instaló el plugin oficial; instalación/conexión ya no pendientes. Discovery anterior `installed:false / ENABLED AVAILABLE` superado. Madre y piloto cloud devolvieron plan Pro, **438,17 créditos**; `free_gens`: Genjutsu 1 (hasta 30 s, 480/720), Viral 0, AIInfluencerBuilder 5; `free_trial.unlim_available:false`. Prueba independiente: durable `01a12c1e-48d1-7349-93ad-33210efa6025`, turno `01a12c67-ddb5-71d7-8b91-7b73e1bab029`, marcador `higgsfield.balance completed`. Ejecutada sin navegador, PC ni VPS, sin generar/modificar; estado físico de PC no observable. **Navegador Higgsfield sigue NO autenticado**, pero no bloquea los flujos soportados por el plugin. Balance no valida generación ni autoriza gasto. Fuentes: [Higgsfield MCP](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-higgsfield-mcp), [Higgsfield API](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api).

**PENDIENTE, sin afirmar éxito:** persistencia entre turnos/reinicio; acceso cloud → VPS bajo permiso independiente; clone de repos y tests en cloud; observabilidad/control del modelo cloud; prueba real con laptop físicamente apagada. Login de navegador sigue pendiente solo para operaciones que lo requieran; conector Higgsfield autenticado ya verificado. Sin compras, generaciones ni secretos trasladados; plugin instalado por el usuario.

**Contrato operativo propuesto:** madres locales supervisan y entregan contratos finitos; workers cloud ejecutan lotes ya autorizados aunque la PC se apague. Una madre local **no coordina activamente mientras la laptop está apagada**: operación 24/7 con nuevas decisiones requeriría orquestador cloud, todavía pendiente. Cada lote registra estado en repo/ref/SHA y artefacto verificable; leer deltas desde el último SHA, no documentos completos. Astra para madres/escalamientos; Sol 6.1 para workers y Luna para mecánica cuando sean configurables; modelo cloud no verificable. Reutilizar skills canónicas sin duplicarlas. Sin migrar credenciales/sesiones ni instalar componentes adicionales.

## Decisiones y alcance

- ONIA es SaaS; el reparto vigente tiene MADRE MARKETING y MADRE DESARROLLO-INFRA locales.
- Marketing supervisa Lucía, Marca personal y Ventas/pauta; Desarrollo-Infra supervisa Plataforma, Hermes/QA e infraestructura.
- Las madres definen contratos, delegan, verifican y resumen; delegan la ejecución local a un worker local.
- Prioridad: trabajo cloud. Orquestador definitivo Claude/Codex PENDIENTE; esta auditoría no cambia el orquestador.
- Modelos solicitados: Astra para decisiones difíciles de madres; Sol 6.1 para ejecución; Luna para mecánica. Capacidad real por cuenta, entorno y herramienta se verifica antes de asignar.
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

La prueba Linux y lectura de GitHub se ejecutaron como consta en la sección vigente. Los pasos siguientes no deben interpretarse como completos; acceso autenticado, persistencia, clone/tests y cloud → VPS siguen pendientes.

1. Comprobar disponibilidad en UI de la cuenta/entorno: captura de función y alcance; sin activarla.
2. Solicitar aprobación concreta si requiere acceso nuevo, indicando origen, permisos y destino. No instalar nada durante esta auditoría.
3. Con aprobación, contrato de lectura con nonce inocuo: devolver ACK, nonce, SHA y ruta permitida; conservar evidencia sin secretos.
4. Probar navegador por separado: lectura de página acordada y captura inocua. Confirmar sesión reutilizada y exclusión mutua; no exportar cookies.
5. Probar VPS únicamente bajo autorización independiente y lectura restringida acordada. ACK del repo no habilita VPS.
6. Evaluar fallos, permisos, duplicación y latencia; registrar resultado por prueba. Sin generaciones pagadas en Higgsfield, publicaciones ni producción; lectura de cuenta permitida dentro del piloto autorizado.
7. Elegir arquitectura después de revisar evidencias con Sergio Urcullo. Orquestador, sesiones y modelos quedan sin cambiar hasta entonces.

**Cierre vigente:** piloto Linux, lectura GitHub y balance Higgsfield cloud autenticado verificados; persistencia, clone/tests, cloud → VPS, modelo cloud y apagado físico pendientes. Navegador no autenticado no bloquea los flujos del plugin. Arquitectura depende de cloud, no de acceso local. Sin commit/push ni otros archivos modificados por este auditor.
