# Handoff — madre Codex

Estado: relevo autorizado por Sergio, 5-oct-2026; base Hermes `672d78e8`, desarrollo Platform `5102535c` tras fetch.
Producción Platform `97fe3061` es el release reportado por handoff, sin comprobación nueva propia.
Este archivo es el estado Codex; `madre-local.md` conserva el relevo Claude. No reconstruir transcripts completos.

**Estado vigente 6-oct-2026:** seis órdenes enviadas mediante `send_message_to_thread` y seis chats confirmados activos mediante `wait_threads`. La cola anterior de CI estaba desactualizada; se corrigió el seguimiento, no hay pausa general por fecha.
Cuota compartida: consulta6-oct09:40UTC:30% usada /70% restante; no atribuible exclusivamente a este frente.

| Dueño | Trabajo despachado | Cierre esperado |
|---|---|---|
| Platform C13 · Astra | PR #113: cuatro fixtures CI corregidos (plan-limits/tratamientos y select del callback). Revisión anterior favorable sobre7d97f2f3, CI falló después. | Autor subió2f2b0743,88tests/lint reportados PASS; V2 revisión favorable y88tests independientes PASS; CI y Secret scan SUCCESS sobre2f2b0743, comprobados6-oct05:07UTC. |
| Platform C15 · Astra | PR #114: corregir TS2322 Payment en fixture addon-chatbot. Autor ya subió54c6ada8, lint y19tests reportados PASS. | Delta54c6ada8 revisado favorable; CI luego falló matriz/ratchet. Autor corrigió37c08ba5,82tests reportados PASS; review favorable independiente76matriz+6ratchet PASS; CI37413926922 ySecret scan SUCCESS sobre37c08ba5. |
| Marca · Sol | Reconciliar AVISOS desde6oct y claims DD-A/N04/N06; seis brutos de cámara identificados. Reel entregado con análisis visual; audio pendiente HTTP503. | HECHO: AVISOS actualizado6–16oct; cambios de cámara integrados GUIONES→GRABAR→KIT; página externa pendiente; seis brutos faltan. |
| Ventas · Sol | Verificar cinco leads concretos con fuentes públicas actuales. | HECHO: cinco fichas integradas en prospectos§6.8; cero plenamente calificadas, sin contacto. |
| Lucía · Sol | Cutlist K1 con assets existentes, usted y tiempos legibles. | HECHO: cutlist34s integrado en GUIONES-LUCIA-KIT.md; P1/P2 y claims bloquean master. |
| Hermes · Sol | Reconciliar tres docs de runtime/deploy con fuentes y fechas. | HECHO: cuatro sustituciones aplicadas a tres docs; runtime no verificado. |
| V2 · Astra | Revisar nuevos SHA de113/114 una PR a la vez; detenerse si no cambió head. | Revisión independiente del delta sin repetir suite anterior. |

Cuatro carriles documentales entregan propuestas en `C:/Users/PC/.codex/tmp/`; no editan el checkout compartido. Madre aplica cambios a los canónicos bajo su lease y PR143. Estos artefactos no son publicaciones terminadas.
C13/C15 ya cerraron sus P2 anteriores por revisión independiente: renovación tras baja efectiva y exención fiscal por email mutable. C15 usa marca verificada default false, sólo SUPERADMIN; migración NO aplicada. Único solape de ambas ramas: `app/api/admin/subscription-payments/route.test.ts`.
Siguiente desarrollo tras cerrar ambas correcciones: C11a o Caja#110 según dependencia; C14 espera prueba de pago/decisión legal, C11b espera C11a. Sin merge/deploy/migraciones/publicación autorizados.

**META:** llevar ONIA a las primeras cinco clínicas que pagan; continuar los cinco carriles sin doble dueño.
**PRUEBA DE HECHO:** cada ítem termina ejecutado y validado, con runbook verificable, o bloqueado por dato/permiso
concreto; siempre SHA, paths, pruebas y revisión. **REGLA DE PARADA:** sin cambio accionable no hay ronda ni mensaje;
publicación, producción, migración, gasto y terceros conservan aprobación específica.

## Dueños y leases

Una madre ordena. La v2 no ordena a carriles ni abre tareas: revisa y respalda. Lease de madre se transfiere SOLO
por entrega explícita registrada (origen, destino, hora, tarea) o Sergio; ni silencio ni límite lo transfieren.
Sergio autorizó mensajes a estos chats Codex. Leer/esperar sus resultados no requiere recrearlos.

| Rol | Chat local Codex | Modelo/lease inicial |
|---|---|---|
| Madre | `01a10f44-2bb7-73c0-8769-8bbe5000b32f` | Astra medium para todas sus tareas, instrucción Sergio6-oct; override enviado para próximas continuaciones |
| V2 | `01a10f47-3d92-7bb1-b9f4-6979e258a6dc` | #138 histórica Sol entregada; Astra medium para todas sus tareas desde6-oct, sin volver a Sol |
| Marca | `01a10f47-f110-7131-b14f-9de1d3241406` | Sol 6.1; tarea acotada despachada 6-oct |
| Ventas | `01a10f48-047d-79b2-9bb6-f7addd70c4c7` | Sol 6.1; tarea acotada despachada 6-oct |
| Lucía | `01a10f48-8d90-7103-8c17-612244fd5dd5` | Sol 6.1; tarea acotada despachada 6-oct |
| Hermes | `01a10f48-99eb-7d43-927f-83c4eebc8d1c` | Sol 6.1; tarea acotada despachada 6-oct; no duplicar #138 |
| Platform C13 | `01a10f46-c910-79a3-9670-7e990fcb1257` | Astra medium; draft #113, corrige CI; `codex/punto-13-gracia-y-no-renovar` |
| Platform C15 | `01a10f4a-5dd1-76c3-844e-45b1c360adad` | Astra medium corrige CI; `codex/punto-15-factura-al-aprobar` |

Lease documental madre: `COORDINATION_MANIFEST.md`, `AI_MODEL_ROUTING_2026.md`, skill `onia-sesion-madre` y este archivo,
en rama `codex/madre-orquestacion-20261005`, worktree `C:/Users/PC/.codex/worktrees/madre-codex/onia-hermes`.
Los carriles read-only todavía NO tienen lease para editar. Al asignarla: paths, rama, worktree y SHA base por escrito.
La carpeta raíz Platform `claude/f2-f3-panel` es histórica y sucia: no desarrollar ni limpiar ahí.

## Asignaciones posteriores — investigación Datec y continuidad 6-oct

- Madre conserva el lease; v2 sólo revisa. Todas las órdenes se enviaron por chat, no requieren que Sergio las copie.
- Ventas Sol: dossier Datec público con evidencia/claims/precios; madre inspecciona registro. Subagente Astra `brecha_datec` entregó matriz técnica por SHA, sin cambios de producto.
- Hermes Sol: runbook permisos cloud/Higgsfield/VPS y modelos verificados, sin crear acceso ni migrar secretos.
- Marca Sol: patch de sincronización DD-A/N04/N06 entre fuente, GRABAR, kit y página; reutiliza evidencia, no nueva investigación.
- Lucía Sol: QA visual/ffprobe A1/A2 y zona segura del K1 sin render/gasto.
- Platform Astra C13: C11a en worktree/rama separados,348tests reportados PASS, draftPR1156f940cfc, reviewindependiente/CI pendientes; no tocar tokens/contadores de consumo fuera del contrato. CI11337412917110 ySecret scan37412917164 SUCCESS sobre2f2b0743; comprobación6-oct05:07UTC.
- Platform Astra C15: integración QA local C13+C15 entregada5cdd6b9d,202tests reportados PASS, review pendiente; sin producción. CI11437413926922 ySecret scan37413927006 SUCCESS sobre37c08ba5; revisión independiente favorable.
- V2 Sol: reviewdocsPR143 hallóHOOK/auto corregibles ystaleestado; ahoraAstra revisa37c08ba5 yQA5cdd6b9d.
- Datec cuenta: no creada. Lucy tiene configurador hacia compra, con contradicción$0→$150/mes y términos404. No se accionó Finaliza tu compra ni se contactó a terceros. Acceso de evaluación pendiente de vía legítima/condiciones.

## Cola finita y revisión

Máximo **dos implementaciones de código y una revisión técnica** simultáneas. Los demás carriles pueden preparar entregas documentales cerradas, sin nuevos subagentes ni investigación abierta. No iniciar trabajo por mantener chats ocupados.
Una tarea por turno, contrato cerrado; cada resultado pasa a revisión sobre SHA exacto. Tras dos intentos del mismo
fallo, registrar evidencia, causa y alternativa segura o dato necesario; no insistir con llamadas idénticas. Un bloqueo
técnico no obliga a parar los demás frentes. La madre toma el siguiente ítem seguro y cierra el resto con dueño.

1. V2 entregó #138 sobre `d479d3aa`: sin bloqueantes nuevos; CI run `37376490476`; autosync22/22 Windows
   (primera pasada21: fixture sin `.git`; dos casos repetidos tras corregir fixture), sintaxis4Bash PASS.
   No pruebas Node Linux locales, ni merge. Conservar este límite de la revisión.
2. C13 PR113: revisión favorable sobre2f2b0743 con88tests independientes PASS; CI ySecret scan SUCCESS comprobados6-oct05:07UTC. No merge/deploy.
3. C15 PR114:37c08ba5 revisado favorable,76matriz+6ratchet independientes PASS; CI37413926922 ySecret scan37413927006 SUCCESS comprobados6-oct05:07UTC. Migración y capacidad fiscal real siguen pendientes; no merge/deploy.
4. C14 después de prueba de pago y aprobación casilla legal. C11a siguiente tanda; C11b recién con C11a mergeado.

Plataforma se revisa con Astra; finanzas, permisos y autosync con dos lentes independientes. Docs triviales: una
pasada. No contar comentario de autor o CI solo como revisión de lógica. Gates en checkout propio, evidencia por SHA;
no repetir toda la suite si no hubo cambio o duda nueva. Nada entra a main/master sin revisión.

## Estado contrastado de los cinco carriles

Consulta GitHub y documentos remotos 5-oct; producción/timers abajo son reportes del carril, no medición nueva propia.

| Carril | Estado confirmado y siguiente acción segura |
|---|---|
| Platform | Base desarrollo tras fetch `5102535c`; handoff producción `97fe3061` reporta #108/#109/#111 publicados. Falta QA visual con cuenta. #110 head `83f93948`: CI FAILURE por TS2339 `app/api/caja-diaria/route.ts:254`, `openingFund` en unión; Security SUCCESS. Arreglo/capturas/OK y migración antes swap pendientes. |
| Marca | Handoff 5-oct noche: 11 IG agendados 6–16oct; auditoría **B elegida**, renombrar `/20min`. PR #140 draft `031d8bfc` declara 33 timers IG/LinkedIn/TikTok y control 6oct20:10UTC, sin checks CI. Revisar, no reagendar a ciegas. |
| Ventas | Bot usted #114 en repo, seguimiento #117, mapa #122. D1 debe sacar claim “La IA escribe el mensaje”; D4 congelado hasta detector visto+catálogo. Sin nuevos mensajes/envíos/gasto. |
| Lucía | #118 kit7fotos3clips, D1 ambo decidido sin identificarse odontóloga, consumo reportado52,5/150cr. L02 editado sin publicar. Preparar montaje con pantalla real; no generar más. |
| Hermes | #88/#91/#96/#94 en main. #138 CI SUCCESS, aprobación autosync/3MEDIUM y revisión v2 sin bloqueantes nuevos; no merge. Rutina/llave/aplicar no activados según último handoff; no afirmar salud VPS actual. |

Fuentes: `onia-1.0-nube.md`, `codex-relevo.md`, `marca-personal.md`, `mercado-y-pauta.md`, `higgsfield-lucia.md`,
`hermes-jarvis.md` y PRs abiertos. Auditoría inicial externa: `C:/Users/PC/.codex/tmp/onia-continuidad-audit.md`.
Correcciones necesarias: madre-local todavía dice carruseles sin agendar/A-B sin decidir/autosync esperando sí;
son históricos superados por fuentes anteriores. Plan§5 reserva vieja contradice§2; no cambiar caja como decisión nueva.

## Gates y bloqueos que no se inventan

### Contenido: siguiente entrega para Sergio

Reporte de continuidad: `C:/Users/PC/.codex/tmp/onia-contenido-continuidad.md`. Carril reporta11carruseles del6al16oct,
IG16:00, LinkedIn16:01 y TikTok16:02 Caracas (UTC-4),33timers; publicación real todavía sin probar. Control histórico
Claude6oct16:10 no verificable con tools actuales: no duplicar/reagendar. Próxima verificación registra IDs/URLs publicados.
Sergio solo hace cámara; editor prepara pantallas. Seis guiones canónicos en `cola/plan-3-semanas/GRABAR-2-14-OCT.md`:
DD-A/CACHE, N04/VERIFY, N06/ANTIGRAVITY, D03-A/HOOK, D01-A/SKILL, S2-D08-A/PROMESA. Sus seis brutos faltan;
no sustituir por21sep. Revalidar los tres claims señalados en el reporte antes de pedir grabación. Próxima tarea documental:
actualizar canónicamente `AVISOS-POR-DIA.md` con fechas6oct; propuesta solicitada al carril 6-oct. La calificación “SSH autorizado”
del reporte Marca no amplía permiso: ese turno tenía restricción sinSSH y no se toma como autorización.

- Platform: confirmación correo QA de pago y aprobación comprobante PRUEBA; OK textual SQL B22; R2 bucket/token;
  P2 y caja diseño/capturas; capacidad facturar PortalSIN y CAFC del piloto. SIAT exclusivamente manual para Sergio.
- Ventas: control total/tarjeta ONIA Ads y número bot vinculado página; firma respuesta pauta; OK mensajes, plantillas,
  audio/imagen y decisión MUN. Bot deploy frenado por11 tests de firma según carril. No contacto sin permiso.
- Marca: siete carruseles esperan diez láminas (gasto1,20cr/tope1,50 o quitar), N03 aprobación publicación, brutos
  nuevos no disponibles en último inventario. Calendario/AVISOS debe reconciliarse; persistencia de timers tras
  reinicio VPS por verificar (no se comprobó si son transient).
- Lucía: D2–D6, kit/L02 y conexiónIG/etiquetaIA; demo existe pero falta acceso/capturas de este carril.
- Hermes: revisión/merge#138 primero, después rutina/llave/aplicar con alcance aprobado; protegermain es decisión aparte.
- No invocar autosync heredado: `codex/*` puede FFmain igualmente. `claude/*` además tiene integrador histórico.
  Merge Platform master dispara cron cada3hmin50 sin comprobar migraciones: backup/migración antes swap bajo dueño.

Protocolo: `hermes-content/docs/EXECUTION_PROTOCOL.md`; la referencia raíz `HERMES_EXECUTION_PROTOCOL.md` no existe.
Skills ONIA únicas `.claude/skills/`; skills producto en Platform. Cobertura en [`codex-skills-auditoria.md`](codex-skills-auditoria.md):
737 skills leídas mecánicamente,23propias comprendidas completas,714indexadas;232memorias indexadas. Indexar no es
comprender. Leer cuerpos/recetas restantes bajo demanda de cada tarea para preservar cuota, sin afirmar cobertura semántica total.

## Local/cloud y seguimiento

Sergio pide TODO cloud y dedicarse solo a grabar; es el destino, todavía no está validado. Local funciona como fallback.
CLI cloud autenticada y entornos enumerados:
Hermes `6abad782eba0819196ca234dc3abc327`, Platform `6abad6a0aae081919f0b315818becb21`.
Esto NO demuestra ejecución, modelo, repo ni permisos. Login navegador IAB falló; CLI0.139 no permite selección de
modelo verificable. No afirmar cloud listo. Verificar sesión sin duplicar login ni imprimir secretos; ninguna
instalación/actualización sin aprobación. No migrar bóveda/cookies al VPS o cloud.

Comunicación Codex: `send_message_to_thread`; espera compacta `wait_threads` con cursor; inspección `list_threads`/
`read_thread`. No asumir que herramientas Claude miden chats Codex. Navegador autenticado: serializado por madre.
Heartbeat **`madre-onia-continuidad` ACTIVE cada seis horas LOCAL**, creado con herramientas del app. Silencio sin
cambio accionable; solo novedades relevantes. Reserva20% semanal: consumo >=80% no inicia nuevos trabajos, sin
créditos/reset. Consumo cuenta18% frente3% inicial, no atribuible exclusivamente al agente. Compactar reportes y cerrar;
no rondas vacías30min ni cron como sustituto. El heartbeat aún no ejecuta trabajo cloud verificado.

## Cierre de este relevo documental

Archivos preparados para revisión de madre, sin commit/push por el agente documental. Validar `git diff --check`, ids,
enlaces internos y que no existan afirmaciones cloud/producción sin prueba. Guardar commit/PR/SHA al aprobar; este
documento no habilita autosync ni publica cambios por sí mismo.

## Cierre de investigación Datec6-oct

Dossier/observaciones ybrecha técnica en `competitor-profiles/datec.md` y `datec-onia-brecha-tecnica.md`. SAP/IBM/cliente corroborados; performanceLucy/preciofinal/rankingIA noverificados. Cuenta no creada; solicitud de acceso de evaluación pendiente de autorización de contacto enviada a Sergio. Runbookcloud/modelosguardado; sesiónCLIcloudlectura funciona pero modelo remoto/Higgsfield/Chrome siguen sinvalidar. EffortCLIlocal corregido a medium, no configuracióncloud. AVISOSreviewP2HOOK/auto corregidos; GUIONES/GRABAR/KIT sincronizados. PáginaexternaClaude ycaptions/videoN03/K11 necesitan revisión porpieza, no modificados/publicados.

## Siguiente entrega por carril tras dossierDatec

Mensajes enviados6-oct: Ventas prepara battlecard interna sin investigación nueva; Marca audita versiones/captions N03/K11 contra correcciones ya verificadas; Lucía prepara preview360p explícitamente BORRADOR con P1/P2pendientes, sin UIinventada/master/publicación. V2Astra revisa37c08ba5/QA5cdd6b9d ydespuésC11a6f940cfc, una revisión a la vez. Hermes cerró runbook: espera mecanismo de acceso/verificacióncloud, sin tocar VPS.
Último chequeoGitHub6-oct05:07UTC:1132f2b0743 y11437c08ba5 CI/Secret scan SUCCESS;1156f940cfc CI37414218141 SUCCESS (completada05:25UTC) ySecret scan37414218235 SUCCESS. SupabasePreview SKIPPED enlas3, no evidencia deBDreal. Sin merge/despliegue; no polls vacíos.

Re-reviewv2Astra:37c08ba5 favorable,76matriz+6ratchet independientesPASS; QA5cdd6b9d favorable con3regresiones propiasPASS. CI113/114 verde alchequeo05:07UTC; authsimulado/PGnofueprobado. RevisiónC11a6f940cfc favorable. BattlecardDatec integradaencompetitor-profiles/datec-battlecard-onia.md ycontrastada con catálogo actual; no enviada.

C11a6f940cfc re-reviewv2Astra favorable:14casos independientesPASS/4files,52previosomitidos; runtimePATCH/helper/booking reales, authPrisma/canalesmock. No reinicia marcas/cuotas/confirmTokenExpiresAt; auditoríaestadoimplícito yefectosindependientes comprobados. CI/Secret scanSUCCESS alchequeo6-oct09:40UTC; sinBDreal/pushUI/merge/deploy.

ReglaSergio6-oct reels: objetivo todo-cloud; si video/acceso falla, madre local analiza yreportabloqueoexacto. Dosreelsanteriores fueronlocales; Gemini503 no demuestraincapacidadcloud. Prueba de habilitaciónyregladecoberturaguardadasencloud-permisos-modelos.md.

## Tanda heartbeat6-oct09:40UTC — Caja

META: cerrar TS2339 dePR110 sin modificar comportamiento financiero ni schema. Dueño nuevo: chatPlatformDesarrolloAstra `01a10f46-c910-79a3-9670-7e990fcb1257`; revisiónv2Astra solo sobre nuevoSHA, no repetirC11a. Lease exclusivo `app/api/caja-diaria/route.ts`, tests focales asociados yCHANGELOG si requerido; worktree existente limpio `C:/dev/proyectos/onia-platform-codex-caja`, rama `codex/punto-8-caja-diaria`, base83f939482e2d6494a9b35b599b6930f5736b9a84. Ningún otro dueñoCodex activo detectado paraCaja. VerificarHEADremoto/limpieza anteseditar; parar ante cambio concurrente.
PRUEBA DE HECHO: narrowing discriminado conservaopeningFund dentrocallbacktransacción, types/tests focales/lint/diff, commit/push aPR110 existente ySHA parareview; no castsany ni debilitartipos/tests. REGLA DE PARADA: máximo2intentos mismo fallo; no instalación, migration/BDreal/merge/deploy/autosync/master ni tocarárbol históricoClaude. Cuota30%usada/70%restante, reserva20%; unaimplementación nueva, sinfanout. C13/C15/C11a ci+review cerrados; gates sensibles conservados.

### Entrega CajaPR110 —6-oct09:44UTC

Autor completó8865d69a47c0998ffd7ccb0f3ee7111a9d1033dd, verificadoMadre local/GitHub. Delta exclusivo route.ts: capturaopeningFund dentrocorrectOpeningFund yreutiliza transacción/auditoría; sinany/casts/schema. Autor10/10testsAPI yESLintPASS, worktreelimpio. Typeslocal no reporta TS2339openingFund pero falla porPrismacompartidodesactualizado: gateglobalNOaprobado,noregenerado. CI37444905976 IN_PROGRESS; Secret scan37444905986SUCCESS; PreviewSKIPPED. V2Astra revisiónFAVORABLE sobre8865d69a,10/10pruebasAPI independientesPASS (corrección50→90,auditoría,autorización,conflictocierre); inspecciónnarrowing sincasts/supresiones,tenant/closedAt/count/schema intactos; HEAD/árbollimpios. CIconsultadotrasreview sigueIN_PROGRESS; tscglobal/BDreal/concurrenciaPG no probados. SinrepetirC13/C15/C11a. Sinmerge/deploy/migración.

## Estado alpedir resumen6-oct — CajaCI fallo nuevo

PR110SHA8865d69a CI37444905976 terminóFAILURE09:56:28UTC:10tests fallidos/5files,9522PASS,3snapshots fallidos (navegaciónCajaobservadaenvertical-pack). SecuritySUCCESS. Reviewdelta8865d69a favorable NOequivaleCIverde. Madre renuevaúnicolease autorAstra para inspeccionar5files ycorregir incompatibilidadescausadasporCaja, tests/snapshots asociados másCHANGELOGsiobligatorio; rutasexactasdesdelog registradasporautoranteseditar. No actualizar snapshots a ciegas ni omitirpruebas; máximo2intentosmismofallo. Nuevodelta pasa v2una vez. No schema/deps/migración/master/deploy. Otrasentregas cerradas; no tareas abiertasparaocuparsesiones.

### Entrega Caja34daf14e —6-oct13:10UTC

NuevoHEADlocal/remoto34daf14e02c85bc611cf3caae11ef0c76ce010fa comprobadoMadre, worktree limpio. Autorreporta258testsPASS/6files,ESLint5TS ydiffPASS. Ocho paths: route+route.test, navigation.test+snapshot, vertical-pack.snapshot, pantallas-compartidas-cubiertas.test, rol-en-la-ruta.test, docs/CHANGELOG. Runtimeadelanta autorizaciónantesJSON conservando permisosporacción; tres snapshotsmanuales incorporanCaja. Madre inspeccionódelta runtime; v2Astra revisiónFAVORABLE8865d69a..34daf14e:223tests independientesPASS/5suites más5pruebaspropias externas con handler/access-control reales. Separaciónfinance.write/approvals.decide comprobada (corregir200,otrasacciones403 sinDBcaja cuando soloapprovals); auth403antesbody/permisos/caja. Precisión: usuarioautenticado sinpermisos síconsultaDBautorización, noDBcaja ni body. Snapshots solo7insercionesCaja/fixtures22→23, sineliminarasserts. Tenant/closedAt/count/auditoría intactos. Evidenciaexterna C:/Users/PC/AppData/Local/Temp/caja-review-a34d796905944f059fde51dc05402d08/review.test.ts. CI sigueenprogreso trasreview; sinBDreal/tscglobal. CI37468652936 IN_PROGRESS,Secret scan37468653156QUEUED,PreviewSKIPPED. Typechecklocalglobalnoaprobado porPrismadesactualizado; nogeneración/deps. Sinmerge/deploy/migración.
