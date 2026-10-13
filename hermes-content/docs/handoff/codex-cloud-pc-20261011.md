# Armado ONIA — plan único vigente 12-oct-2026

> **Este plan inicial manda.** Las secciones que siguen bajo HISTORIAL conservan pruebas/artefactos, pero sus etiquetas “vigente”, modelos y órdenes del 11-oct quedan reemplazadas cuando contradigan este plan. No hay relevo/loops completos por escribirlo.

## Delta — rotación de sesiones por contexto (13-oct-2026)

**Política documental solicitada; no hay automatización probada ni se ejecutó rotación.** Señal recomendada: `context_usage` verificable por runtime con su ventana efectiva; umbral `min(500000 tokens, 70% de ventana)`. 500000 es el techo solicitado únicamente con ventana efectiva confirmada ≥500000; para ventanas menores aplica 70% de la ventana. Input acumulado, cached, output y billing no sustituyen esta señal. Si no se observan ambas medidas: **UNKNOWN**, solicitar relevo manual y no prometer automatización. El handoff se hace en un punto seguro y nunca interrumpe una operación activa.

Paquete compacto obligatorio: objetivo/criterio de hecho; permisos y gates; cola/estado; evidencia/artefactos y rutas; repo/ref/SHA; modelo configurado/observado; IDs de sesión/tarea/agente; cursor y hora; ownership único; siguiente acción o bloqueo. Sin clonar/forkear historiales ni transcripciones completas. La sucesora debe confirmar lectura con SHA/ref, enviar ACK ligado al objetivo y demostrar propiedad única del carril antes de archivar la anterior o mover un heartbeat existente. Las capacidades de crear/resumir/archivar sesiones y observar telemetría deben probarse en el proveedor/runtime concreto antes de depender de ellas. No trasladar secretos ni sesiones de la PC. La madre delega/revisa/resume; el worker ejecuta. Modelos vigentes: madres Luna low, Platform Sol 6.1 medium, QA Sol low, mecánica Luna low. Esto no activa loops ni demuestra capacidad operativa.

## PLAN VIGENTE 12-oct — armado único y ejecución por evidencia

### Auditoría acotada de tokens — 12-oct, medición previa y decisión posterior

**Muestra real:** 4 JSONL locales concretos de `C:/Users/PC/.codex/sessions/2026/10/`: madres `01a12beb-7774-7c02-9931-12264158df83` y `01a12c1f-bef7-7252-a4b6-f8f8354dfc48`, subagente documentación `01a12bee-0140-7811-9211-45ed862a67e9`, inventario Luna `01a1319c-590e-7170-b00f-f1a6f21b480d`. ~39,95 MB, 1.114 eventos token_count; no scan general de logs Claude ni workers cloud. Lectura streaming solo metadatos/usage/conteos; no exportación de mensajes/secretos. **Ventana medida:** desde 12-oct 00:00 UTC (11-oct 20:00 Caracas) hasta último recibo de cada log, ~12-oct 20:21 UTC (16:21 Caracas); los archivos de madres empiezan 11-oct 17:03/18:00 UTC.

**Método:** delta entre último `total_token_usage` acumulado y último recibo anterior a medianoche; 0 descensos detectados en acumulados. NO sumar todos los acumulados ni `last_token_usage` repetidos. Cached es subconjunto de input; reasoning es subconjunto de output, no añadirlos. Desfase posible de una llamada cruzando medianoche y registros activos incompletos. No convertir tokens a dólares, consumo de cuota ni ahorro predicho.

| Log / modelo en turn_context | Input delta | Cached input incluido | Input no cached (resta) | Output delta |
|---|---:|---:|---:|---:|
| Madre Desarrollo / Astra | 54.879.025 | 53.945.728 | 933.297 | 61.773 |
| Madre Marketing / Astra | 41.163.327 | 40.442.752 | 720.575 | 54.511 |
| Documentación delegado / Sol 6.1 | 20.919.869 | 20.229.632 | 690.237 | 28.840 |
| Inventario corto / Luna | 265.978 | 247.552 | 18.426 | 1.447 |
| **Muestra total (no cuenta entera)** | **117.228.199** | **114.865.664** | **2.362.535** | **146.571** |

**Dos madres:** 96.042.352 input, 94.388.480 cached (**98,28 %**), 1.653.872 no cached, 116.284 output. Miden contexto servido/reutilizado repetidamente, no memoria única ni coste efectivo. Los modelos citados constan en turn_context local de esta muestra; no prueban el efectivo de Work ni de los cinco workers cloud.

**Señales verificadas de overhead, conteos del archivo completo 11–12 oct (no delta horario):** madre Desarrollo 640 recibos y 48 `wait` + 15 `wait_agent` + 13 `sleep`; Marketing 335 recibos y 125 `wait`. Son llamadas/esperas, no prueba de loops vacíos ni de llamadas facturadas separadas. Outputs de tools totalizan ~1,27 M y ~2,65 M caracteres; máximos ~258.705 y ~521.749. Mensajes role:user tienen máximos 21.717 caracteres en ambas madres y ambos subagentes; 13/11 repeticiones exactas extra en madres, sin atribuirlas al humano (pueden ser envolturas/steering/recibos). Contratos de tool máximos 2.908/1.874 caracteres. No afirmar que se releyó la misma skill sin análisis de paths; la muestra demuestra entrada grande/reutilizada y salida de herramienta grande.

**Autorreporte de madre Marketing, no telemetría cuantificada:** varias lecturas `read_thread` de turnos largos, waits interrumpidos, instrucciones acumuladas a Marca; adoptó delta/cursor/contrato consolidado, sin rondas vacías. Reporta modelo principal/tokens por turno no expuestos en su superficie; subagente `materiales_ventas` heredado sin override y `video_referencia` completado. Esto no invalida los recibos locales, pero no permite costear cada subagente o atribuir causalidad. Workers configurados Sol 6.1 medium, efectivos no observados.

**Tres recortes aprobados por Sergio y aplicados al contrato/skill, sin detener desarrollo:**

1. **Contexto corto de madres:** un estado por carril con contrato-ID, último SHA, entregable, gate y bloqueo; leer solo delta/cursor desde ese SHA. Cada relevo usa este estado, no conversaciones enteras. Limitar retornos de tool a campos/filas necesarios y guardar detalle en artefacto; no volcar logs enormes al contexto. Medir input/cached por lote comparable antes/después.
2. **Una coordinación por resultado:** consolidar correcciones del mismo contrato en un mensaje; esperar evento/ACK con cursor y timeout acotado, sin sondeos repetidos sobre estado igual. Una ronda local solo si hay cambio o siguiente pendiente autorizado; no wakeups vacíos. Medir número de lecturas/esperas y tiempo hasta desbloqueo, sin cancelar trabajos activos.
3. **Fanout proporcional:** análisis mecánico Luna, QA independiente Sol; usar hasta 5 frentes solo si independientes y necesarios, no como objetivo. Entregar SHA+veredicto/delta y reutilizar tests ya válidos para ese SHA; repetir solo por cambio/fallo/incertidumbre. Un escalamiento Astra para decisión difícil, sin duplicar en todos los agentes el paquete de contexto de la madre.

**¿Bajar madres sirve?** Recomiendo **Sol 6.1 medio para coordinación rutinaria** (inventario, priorización de contratos ya definidos, seguimiento y resumen), con **Astra medio para arquitectura/decisiones ambiguas, permisos de alto riesgo y arbitraje difícil**. Luna no como madre con juicio; sí extractor mecánico. Decisión posterior de Sergio: madres Sol 6.1 medio; ambos cambios fueron aceptados por `send_message_to_thread(model=gpt-6.1-sol, thinking=medium)`. Efectivo no expuesto; medición posterior comparable y validación de calidad aún pendientes. El 98,28 % cached apunta a que controlar relectura/polls/contexto puede importar más que reducir salida; bajar modelo no reduce por sí solo tokens y no sabemos su efecto en cuota. **TODO código Platform conserva Astra por orden vigente; QA Sol, mecánica Luna.**

**Cuota:** snapshot comunicado de `get_usage_limits`: 9 % usado, ventana 10.080 min, ordinaryUsageAllowed true, saldo 0. Es global de cuenta, no de sesión/modelo; NO equivale a dinero ni acredita qué causó el 9 %. No hay coeficientes de cuota/precios efectivos ni cobertura total cloud; no estimar ahorro garantizado. Fuentes de método: `hermes-content/docs/AI_MODEL_ROUTING_2026.md` (9-oct, escalamiento/contexto, subordinado a código Astra vigente) y inventario Claude del historial de este registro (conteos Agent/SendMessage/CronCreate, sin tokens por ronda). La medición precede al cambio de madres; este registro no modifica runtime, trabajo activo ni loops.

**Precedencia última orden:** ASTRA medio para TODO código Platform. Análisis acotado Sol/Luna barato, filtro QA independiente; escalar caro si hace falta. Hasta 5 frentes útiles por lote cuando capacidad/runtime y tareas independientes permitan, sin forzar slots ni duplicar archivos. Madres Sol 6.1 medio solo delegan/revisan/resumen; Desarrollo-Infra no reporta operación Marketing. Al cerrar, siguiente pendiente autorizado con prueba, sin busywork/repetir cerrado/evadir permisos; no afirmar 24/7. Fuente canónica CODEX.md y referencia AGENTS.md actualizadas; sin ejecutar Claude ni copiar skills/transcripts completos.

### Registro de encargos y aprendizaje — único intake 12-oct

**Jev, investigación 12-oct — candidato pendiente de evaluación:** identidad probable de «jev» de Sergio: Jev de TypeSafe AI, confirmada existencia en [proveedor](https://typesafe.ai/) y [docs](https://docs.typesafe.ai/introduction); estado + preguntas Choice/Score/Noul → decisiones/probabilidades, sin generación de texto. Dueño: madre Desarrollo; fuente primaria leída, ninguna API de inferencia llamada.
**Coste y límites:** tarifa oficial USD 0,042/millón de tokens de entrada (USD 42/mil millones); no garantiza coste total ONIA ni ahorro. Multiplicadores de velocidad/ahorro y «cero alucinaciones» son claims del proveedor para workflows seleccionados, no medición ONIA. Pesos/hardware local/coste de entrenamiento no verificados; no reemplaza al LLM que planifica/escribe código/usa herramientas.
**Aplicabilidad y próximo paso:** candidato para clasificar/rutear/priorizar preguntas atómicas, sin adoptar ahora. Evaluación futura: casos españoles etiquetados, falsos «permitido», abstención, latencia/coste y rendimiento por tarea aceptada frente a reglas + Luna; harness conserva cola durable, deduplicación, permisos y auditoría. Sin compra, instalación, Claude, generación pagada, producción ni cambio de modelos.
**Alternativa distinta:** [OpenAI Decisions API](https://developers.openai.com/api/docs/guides/decisions), beta `gpt-6-luna`, entrada texto/imágenes, USD 0,10/millón input y sin cargo output según docs; API especializada, no plan de ChatGPT incluido ni arquitectura no-LLM asumidos. JEPA/HRM/TRM quedan descartados provisionalmente como identidad, sin evaluación/adopción.

**Routing modo ahorro, actualización 12-oct, sustituye el routing previo:** herramienta oficial aceptó 7 cambios de modelos de carril: Platform Sol 6.1 medium; Hermes y recuperación PNG Luna low; Marca, Lucía y Ventas Sol 6.1 low; madre Marketing Luna low. Dos heartbeats existentes se actualizaron conservando frecuencia. Ambas madres configuradas Luna low, aceptado por herramienta; modelo servido no expuesto. Snapshot comunicado ahora: cuota global 54% usada / 46% restante. No prueba ahorro causado ni cuota futura; Astra solo con excepción específica de Sergio ante fallo o riesgo material evidenciado.

**Nueva decisión de producto, Sergio 12-oct:** [PRODUCT Hermes](../../../PRODUCT.md) y [estrategia](../ONIA_ESTRATEGIA_DE_EMPRESA.md) ahora fijan producto simple listo para usar, multirubro/escalable, lanzamiento dental y web IA/WhatsApp como capacidades de un único plan comercial integrado. Recorrido cliente contratar → mínimos → agenda/pacientes/cobros/WhatsApp; web datos/plantilla → preview → aprobación → publicación solo autorizada. Son criterios solicitados, no capacidades/precios/gratuidad/ilimitados entregados. Viejo veto web-servicio superado; complejidad técnica interna. Madre resume resultado/mejora/falta, no jerga Git por defecto. Worker Platform debe incorporar decisión en su PRODUCT sin pisar checkout compartido; coordinación solicitada a madre, decisión ya enviada por madre al worker Platform Astra, incorporación todavía no verificada. Último steering «todo en un solo plan» supera inferencia add-on/upsell; precio y cupos reales pendientes, sin ilimitados ni alterar facturación/producción.

**Continuidad mientras Sergio sale, 12-oct:** madre ya avisó a Marketing, Platform y Hermes que continúen tareas vigentes y notifiquen solo entregas importantes, fallos o decisiones humanas. Marketing debe dejar videos aprobados subidos/programados tres horas antes del horario acordado, comprobando calendario/cuenta/versiones; preguntar el horario solo si realmente falta. No adelantar publicación ni afirmar subida/programación sin prueba. Estado: instrucciones enviadas por madre, entregas posteriores no verificadas aquí. No duplicar mensajes, rondas o carriles.

**Revisión de referentes terminada, QA madre aceptada — 12-oct:** [informe principal](../../research/competencia/ui-referentes/empaquetado-20261012/REFERENTES-PRODUCTO-UI.md), commit `997ce814`; [secundarios](../../research/competencia/ui-referentes/empaquetado-20261012/REFERENTES-SECUNDARIOS.md), commit `1881db9e`. Según cierre revisado por madre: 47 externos, 42 con lectura/reuso de evidencia y 5 bloqueos precisos (Odoo, Calendico, ControlFacilito, MiFacturaBolivia y NativeCode por identidad); 3 PDF internos revisados visualmente solo en primera página. TuDoc contrastado en Chrome y Citalo.APP/bo corregidos. Root leyó ambos informes e inspeccionó 3 capturas Higgsfield/Lety + 3 del piso interno. No acredita webs finales, cuentas ni E2E. Criterios reutilizables aceptados: datos del negocio una vez y reutilizados; preview de configuración real; plan único con uso/límites visibles y técnica en backoffice. Ya enviados por madre a Platform para el próximo cierre, sin reiniciar ni rehacer entregas. Estado: referencia revisada con estos límites; no UI implementada ni entrenamiento del modelo.

**Inventario de referentes producto/web/UX para research (rutas localizadas, contenido histórico, no revalidación actual):**

| Grupo | Referentes / fuentes canónicas a abrir por delta |
|---|---|
| Producto clínico y brechas | Dentalink/Medilink, Doctocliq, TuDoc, AgendaPro/Citalo, Sendy/SendyPro, Lety y Dapta: `hermes-content/docs/ONIA_NIVEL_REFERENTES_BRECHA.md`; `hermes-content/research/competencia/PRODUCTO_COMPETENCIA_RESUMEN.md`. Capturas UI: `competencia/ui-referentes/README.md` y `hermes-content/docs/ONIA_UI_MEJORAS_1.0.md`; recorridos Dapta `DAPTA_COMO_FUNCIONA.md`, `dapta/app/RECORRIDO-2026-10-02.md`; Doctocliq `doctocliq/cuenta-de-prueba/DOCTOCLIQ_ADENTRO.md`. |
| Web IA / UX guiada | Durable, Hostinger AI/hPanel, Wix AI, 10Web, Squarespace/Blueprint, Tiendanube (404 históricos distinguibles): `hermes-content/research/competencia/configuradores-web-ia-2026-09-17.md`. Orbix: `hermes-content/research/orbix-2026-10-12/INFORME.md` + `EVIDENCIA-PUBLICA.json`; referencia investigada, no diseño implementado. |
| Piso interno de diseño | Bench, Garabato, HSB Engineers: `PRODUCT.md`, `.claude/skills/onia-web-factory/SKILL.md` § Piso de calidad. Método `.claude/skills/web-factory-design-research/SKILL.md`; no copiar identidad/obra. |
| Catálogo restante documentado | `hermes-content/research/competencia/MAPA_COMPETENCIA.md` y fichas/teardowns existentes: Alegra, Holded, Odoo, Siigo, Bind, ControlFacilito, EdocPyme, MiFacturaBolivia; Clinera, Calu, DtDental, Doctoralia, Huli, Eholo, Reservo, AgendaEnDía; Kommo, LeadSales, Jelou, Wati; Datec, Forges SCZ, Fluker. Abrir solo los pertinentes al contrato, sin trasladar claims/precios históricos. |
| Bot/integración y empaquetado | Lety/Dapta/SendyPro/ManyChat: fichas/teardowns anteriores y `hermes-content/docs/research/onia-1.0-29sep/COMPETENCIA_MANYCHAT.md`, `COMPETENCIA_SENDYPRO.md`, `COMPETENCIA_BOTS_WHATSAPP.md`, `VENDIBLE_VS_COMPETENCIA.md`, `PLAN_REDISENO_1_0_1.md`; Cal.com/Higgsfield forman parte del nuevo encargo de research, sin inventar evaluación actual por este inventario. |
| Analogías estratégicas, no backlog/UI adoptada | Salesforce/AppExchange, HubSpot, Mindbody, OpenTable, Toast, Vagaro/Zocdoc: referencias en estrategia; no ampliar producto ni activar integraciones por su mención. |

Fuentes de decisión/UI adicionales: `hermes-content/docs/ONIA_WEB_FACTORY_Y_PRODUCTO_UI.md`, `ONIA_AGENTE_PRODUCTO_DISENO.md` y `ONIA_RADAR_DECISIONES_PRODUCTO.md`; fuentes de arquitectura/UX internas, con Chatwoot infraestructura invisible y checkout Lety como patrones históricos, no estados vivos.

**QR pendiente:** fuente técnica canónica `hermes-content/docs/ONIA_BCP_API_QR_INTEGRACION.md` identifica BCP Api Market/OpenBanking (specs banco 2024/2025, entregadas agosto2026), generación QR + callback/consulta/reporte. Se separa QR manual documentado de confirmación automática API aún pendiente. Modelo histórico Facilitador/cuenta propia del cliente no acredita alta/API/sandbox/homologación actuales. Verificar ese estado y pendientes §7 antes de pedir accesos/credenciales; no datos secretos ni publicación automática.

**Separación media:** `competencia/LUCIA_INFLUENCERS_IA_B2B_20260930.md`, `LUCIA_CONTENIDO_COMPETENCIA_20260930.md`, `competencia/anuncios/`, docs de influencers/lipsync y edición no integran esta evaluación de UX producto. Higgsfield se evalúa aquí solo si es referencia de producto/empaquetado, no para crear media. Cobertura del inventario: paths canónicos de docs/research y skills de diseño localizados, no todos sus contenidos leídos ni cuentas/sitios auditados. No presentar la lista como catálogo exhaustivo de Internet.

**Delta operativo comunicado por madre, 12-oct:** automation oficial heartbeat **LOCAL** «ONIA Platform — supervisión y continuidad», ID `onia-platform-supervisi-n-y-continuidad`, ACTIVE cada hora, target madre `01a12beb-7774-7c02-9931-12264158df83`. Creación confirmada por herramienta; **primera ejecución programada NO probada**. Requiere PC disponible: no es scheduler cloud ni prueba PC apagada. Contrato: snapshot compacto/cursor; si worker active no encargo nuevo, si idle tomar siguiente viable autorizado sin duplicar; sin producción. Pausar cuando sustituto cloud esté validado o todo cerrado/bloqueado. Platform cerró Cobrador PR #166, commit `b963aacc`, 27 pruebas nuevas + 13 regresiones QA reportadas; siguiente Seguidor enviado y active verificado por madre. No reabrir Cobrador. Alfred continúa enviado/escalado, respuesta especialista pendiente; Hermes conserva 18/18 offline y wake cloud no validado.

META: no perder pedidos/enlaces ni rehacer cierres. PRUEBA: entradas con dueño/fecha/fuente y evidencia revisable. PARADA: permiso/dato bloqueante se pregunta concretamente, continuando lo independiente. Skill actualizada en `.claude/skills/onia-continuidad/SKILL.md`; no skill duplicada, entrenamiento ni carga cloud comprobada por este cambio.

| Pedido / objetivo | Dueño / estado | Evidencia y fuente (12-oct) | Aprendizaje y siguiente acción / bloqueo |
|---|---|---|---|
| Orbix: evaluar diseño y oferta para ONIA | worker orbix_analisis; entregado para revisión madre | [Informe](../../research/orbix-2026-10-12/INFORME.md), 7 capturas en misma carpeta; SHA256 informe `0c0cf2b00863e209376a1d35639fd2b586437feae84a5bf4a4e5ce4fa59f2b30`; fuente pública https://www.orbix.studio/ | Observado: jerarquía/CTA y oferta; inferencias/propuestas distinguidas en informe. No comparar ONIA como hecho ni adoptar precios/identidad. Siguiente: madre revisa adaptación propuesta; no implementación autorizada por el análisis. |
| Hermes/Alfred: supervisor cloud de cinco workers | cloud_architecture; bloqueado envío, lectura validada | [Auditoría canónica](../audits/SUPERVISOR-CLOUD-INVENTARIO-20261012.md), addendum 20:19 UTC; lectura 5 UUID PASS, envío Hermes NOT_FOUND sin turnId/ACK | Observado: leer no acredita envío/despertar; causa interna no confirmada. Actualización posterior autorizada por Sergio: root envió incidencia en chat oficial https://help.openai.com con cuenta ONIA autenticada; mensaje visible «You said», según evidencia UI de madre. Captura de evidencia madre: `C:/Users/PC/.codex/visualizations/2026/10/11/01a12beb-7774-7c02-9931-12264158df83/soporte-incidencia-enviada.jpg`. Primera respuesta AI soporte propuso genéricamente thread/resume → turn/start y feedback por menú, sin control exacto validado para Alfred hosted; NO aplicado. UI confirmó «Escalation requested» y escalación a especialista; respuestas por email en próximos días, sin ID numérico expuesto. Captura madre `C:/Users/PC/.codex/visualizations/2026/10/11/01a12beb-7774-7c02-9931-12264158df83/soporte-escalacion-confirmada.jpg`. Estado: enviado y escalado confirmado; respuesta del especialista pendiente. Siguiente: recuperar respuesta especialista; sin recurrencia ni cambio silencioso de arquitectura. |
| Platform/WhatsApp: enlace editor con permisos efectivos | worker Platform Astra + QA Sol; cierre #164 reportado por madre; siguiente #163 asignado | Fuente: madre Desarrollo 12-oct, PR #164 commit `dcb37f78`, 151 focales + 63 adicionales y type/lint; suite global interrumpida, no certificada. Worker `01a12c7e-97e2-7115-8561-0b7658008003` | Observado según reporte: cierre enlace sin tocar planes/canales/APIs ni producción. Siguiente: verificar contrato del Confirmador teléfono inválido en #163 y corregir solo si bug vigente independiente. No rehacer enlace cerrado; no declarar QA global. |
| Cuenta/tokens: reducir coordinación redundante | madres Sol 6.1 medio; configuración aceptada, efecto pendiente de medición | Sección «Auditoría acotada de tokens» de este mismo handoff; 4 logs/ventana/cobertura explícitos. Fuente posterior madre: send_message_to_thread aceptó ambos cambios | Observado: input/cached/output de muestra, no cuota/costo causal. Aplicado a reglas: deltas, un contrato consolidado/evento, fanout proporcional. Siguiente: comparar lote/calidad; ningún ahorro garantizado ni efectivo de modelo afirmado. |

**Hermes harness cerrado offline, 12-oct:** commit GitHub verificado `32f78538c01cc4141f32b50a56cb19905c21309a`, rama privada `codex/hermes-harness-20261012`; [README](https://github.com/oninteligenciaartificial/onia-hermes/blob/32f78538c01cc4141f32b50a56cb19905c21309a/hermes-content/docs/handoff/hermes-harness-20261012/README.md) y [QA independiente](https://github.com/oninteligenciaartificial/onia-hermes/blob/32f78538c01cc4141f32b50a56cb19905c21309a/hermes-content/docs/handoff/hermes-harness-20261012/QA.md). Inventario Luna + QA Sol, modelos solicitados/servidos no observable; 18/18 PASS y adversariales reportados en QA. Gates de duplicación, checkpoint, cuota/aprobaciones validan fixtures offline; exclusión local no distribuida. Trigger apagado, dispatches/schedulers 0; cloud wake NO validado. Los textos «incidencia no enviada» en ese snapshot y audit anterior son HISTORIA SUPERADA por el envío posterior informado arriba; respuesta especialista/ID numérico/corrección siguen pendientes; escalación ya confirmada. **Tres pasos operativos todavía NO validados:** (1) follow-up Alfred al destino existente con turnId/canario verificables; (2) conectar checkpoint durable y exclusión remota, con reconciliación de resultado incierto; (3) scheduler cloud y prueba real de despertar, incluida independencia de laptop. Son gates pendientes, no instalaciones, ejecución ni autonomía confirmadas. No se modifican artefactos del worker.
**Delta de auditoría harness/LLMs — 12-oct-2026, 22:57 Caracas (02:57 UTC), encargo root:** Estado contrastado con ramas y fuentes primarias; es propuesta/QA, no autorización de activar servicios. Hermes tiene commit [`b5a0ad44`](https://github.com/oninteligenciaartificial/onia-hermes/tree/b5a0ad442057c4859ed9dd51d3fa47f7f5a6cc06/hermes-content/docs/handoff/hermes-harness-20261012): `effect_idempotency_key` y tres tests focales nuevos; `contract.json` conserva `distributed_store=not_implemented_not_activated`, `trigger.enabled=false`, `operational_ready=false`. El baseline 18/18 offline y el test focal de clave por efecto no prueban dispatch, store remoto ni PC apagada. [PR #200 Hermes](https://github.com/oninteligenciaartificial/onia-hermes/pull/200) es referencia de trabajo, no merge/producción.
Runner y memoria: el [`scripts/codex-tarea.sh`](https://github.com/oninteligenciaartificial/onia-hermes/blob/codex/hermes-harness-20261012/scripts/codex-tarea.sh) escribe resultados/eventos/session ID bajo `~/.codex/madre-tareas/` y reanuda por CLI en la PC; no es runner PC-off ni checkpoint transaccional. La fuente canónica de identidad Hermes es [`SOUL.md`](https://github.com/oninteligenciaartificial/onia-hermes/blob/b5a0ad442057c4859ed9dd51d3fa47f7f5a6cc06/hermes-content/deploy/hermes-agent/SOUL.md), destino `/root/.hermes/SOUL.md`; `MEMORY.md` y las skills son artefactos del repo. Eso no prueba que un runtime remoto las haya leído/cargado ni entrena el modelo. El gateway local toma snapshot de skills al arrancar; modelo servido sigue no observable.
Platform: reporte del worker en el turno durable `01a1331c-bd16-7701-bafa-0f83a78f3451`: transporte local 35 tests + 24 rechazos PASS, QA independiente Sol low. Candidato [PR #170](https://github.com/oninteligenciaartificial/onia-platform/pull/170); propuesta Hermes [PR #200](https://github.com/oninteligenciaartificial/onia-hermes/pull/200). Root verificó estado/transcript, no el código, capturas ni resultados individuales de ese lote: conservar como reporte atribuible, no QA independiente madre. Schema DB y auth interna siguen pendientes; no hubo producción.
Arquitectura propuesta, aún no implementada: cola durable compartida; lease/reserva atómica por worker y evento; idempotencia por efecto downstream; executor y wake por interfaz soportada; navegador cloud dedicado y aislado; cuota/alcance/aprobaciones faltantes → hold. Autenticación de VM queda solo como opción a evaluar: [OpenAI SIWC self-hosted VMs](https://developers.openai.com/siwc/token-sharing-open-source/self-hosted-vms) describe host ID propio y transferencia segura de credenciales protegidas del flujo SIWC. Antes se debe verificar elegibilidad, consentimiento, scopes, aislamiento y atribución/revocación; aquí no se transfirió ningún secreto y la doc no acredita follow-up a chats Codex existentes. Snapshot ordinary reportado el 12-oct: 59% usado / 41% restante; es un punto observado, no un límite permanente ni saldo garantizado. No hay medición actual de autenticación del harness ni modelo servido.
Base metodológica consultada: [Anthropic, context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) trata el contexto como información curada por runtime; [Anthropic, long-running harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) recomienda handoffs/artefactos entre sesiones; [Hugging Face smolagents memory](https://huggingface.co/docs/smolagents/tutorials/memory) documenta memoria de ejecución explícita. Aplicación propuesta: registrar qué repo/ref/skills/contexto cargó cada runtime y persistir el estado fuera del prompt. No afirmar que Hermes «sabe todo» ni que repo local equivale a acceso cloud.
Prueba PC-off mínima — propuesta, no ejecutada: con almacenamiento/trigger autorizados y cuota fresca, preparar un contrato inocuo en ref/SHA fijos; apagar físicamente la laptop antes de que un único evento remoto despierte al worker; exigir recibo+turnId+canario y salida durable con hash. Desde segundo runtime restaurar checkpoint exacto y repetir el mismo evento: lease debe rechazar el duplicado y reconciliar el resultado incierto sin segundo efecto. Registrar scopes, logs y consumo. Hasta pasarla, PC-off/24×7 queda no probado.
Decisiones aún pendientes de Sergio (no se infiere consentimiento): (1) intake lo asigna siempre la madre o puede tomarlo el worker; (2) canal de notificación/aprobación; (3) política para acciones sensibles y revisión visual/UI. Mantener esos pasos en hold.

**Prueba de uso de la skill (revisión documental, no ejecución de producto):** Orbix conserva entregado/revisión y separa observado/propuesto; Alfred conserva FAIL de envío aunque lectura PASS; WhatsApp conserva cierre comunicado y siguiente independiente sin repetir tests ya cerrados. Se comprobaron existencia de informe/auditoría y hash Orbix; estado Platform/modelos proviene del reporte de madre, no verificación independiente nueva. Cloud deberá comprobar ref/lectura de skill; push no acredita instalación.

### Recuperación DELTA Claude — inventario 12-oct, sin copiar fuentes

Subagente real `/root/continuity/recovery_delta`, Luna low, solo lectura en ambos repos; entregó refs/hashes/rutas y límites. No fetch en esta pasada: refs son snapshot disponible, no estado remoto vivo. Hermes main local `ac8f2d44` limpio pero +2/-236 frente a `origin/main 2cdefca7`; no usarlo como fuente única ni mergearlo. Platform checkout `claude/f2-f3-panel 7060b7c9` con cambios ajenos sin commit (`HANDOFF_CLAUDE.md`/`error.log` entre ellos): preservados/no leídos. Base Platform es `origin/master 54eedf10`, no origin/main.

| Fuente delta | Recuperado/localizado con ref/hash | Falta / próxima verificación |
|---|---|---|
| Marca skills/cola/handoff | `origin/claude/gifted-clarke-y4vvtj 781df7d8`, +82 frente a Hermes origin/main; diseño/edición, auditorías/calendario/contratos M1-M2 | Comparar solo paths del próximo contrato; no copiar skill ni rehacer cerrados |
| Lucía skills/guiones/QA | `origin/claude/zealous-babbage-fvtjck 3566e5d5`, +158/-4; skill `lucia`, guiones/cola/QA | Reconciliar divergencia y bytes/manifest del worker; Git localizable no es transferencia completa |
| Ventas skills/cola/handoff | `origin/claude/onia-ventas-pauta-rmdv5j 1f72b73c`, +43; scripts/skills/contratos V01-V03 | Probar acceso worker/ref actual y demo; no inferir campañas actuales |
| Hermes skills/cola/QA | `origin/claude/adoring-ramanujan-7sjzwv b8d548b8`, +63; Jarvis/C1-C4/L1 | QA del checkout/lote actual, no atribuir 40/23 histórico a este delta |
| Coordinación/contratos | `origin/claude/arranque-nueva-madre-ba386e 02ff7746`, +28/-15; skills madre/cola/U8/F136 | Instrucciones Sergio prevalecen sobre routing/IDs viejos; cola codex-relevo 4-oct es incompleta |
| Platform M1c/M1d y resto | `codex/m1c-las-ultimas-cantidades 780d4d5c` (+3), `codex/m1d-dental-sobre-m1c 07f52b32` (+4); f136c remoto `b2c6146f`, U8 `e2a92375`, U10 `e911e033`, U9 `44a5b053` | HEADs locales/snapshot no prueban PR/merge/worker; refs no añaden skills/handoff/cola. No tocar dirty ajeno |
| Transcripts Claude metadatos | `.claude/projects` existe: Hermes 226 archivos (último 3-oct); Madre V2 worktrees 4/3 archivos (11-oct); observador 1064 (11-oct) | Solo nombres/fechas/conteos; NO transcript completo ni estado reconstruido. Observador no sustituye fuente original |

Registro recuperado = fuentes localizadas con trazabilidad, no copia integral ni conocimiento leído completo. Método único `.claude/skills`; esta pasada no ejecutó Claude, abrió secretos ni migró sesiones. Próxima recuperación se limita al delta del contrato independiente autorizado.

### Auditoría actual 12-oct — cinco ejecutores nativos comprobados

**Hermes, configuración posterior:** entorno **ONIA Hermes** publicado oficialmente con `chatgpt.com` y Package Managers; captura `C:/Users/PC/.codex/visualizations/2026/10/11/01a12beb-7774-7c02-9931-12264158df83/onia-hermes-chatgpt-publicado.jpg`. Runtime antiguo NO hereda la política; una CLI falló sin IDs reales. Prueba TEMPORAL nativa `01a131a1-2db7-75d3-b9a3-62a19aebd000` activa para verificar política/5 UUID, **resultado PENDIENTE**, no sexto ejecutor permanente ni autonomía validada. Sin afirmar éxito antes del resultado. Gate de cierre añadido a CODEX existente; escribirlo no garantiza cumplirlo.

`list_threads` leído en este corte confirma los 5 `kind:codex`, `hostId:durable`, cwd `/workspace`; 2 madres locales. El inventario de partida “1 Codex + 4 Work” más abajo es histórico de la preparación, sustituido por esta tabla. Madre Desarrollo habló con madre Marketing y los 5 workers; despacho no equivale a cierre de sus lotes.

| Carril | Worker nativo | Resultado / pendiente comunicado |
|---|---|---|
| Platform | `01a12c7e-97e2-7115-8561-0b7658008003` | QA de handlers M1c, precios 3000/1500 EN CURSO; no declarar validado |
| Hermes QA | `01a13170-1c7e-7224-83c1-c5f369052039` | 40 PASS/23 FAIL en checkout HISTÓRICO `2cdefca7`, NO resultados del lote actual; diagnóstico proxy asignado |
| Marca | `01a13170-b488-71d9-83f8-12663d5a0013` | 275 archivos Git con hashes y 4 originales recuperados; faltan N02 de Work y escucha DD-A |
| Lucía | `01a13171-0fdb-72c6-9fdc-81244d7e6006` | Acta JSON SHA-256 `c9885427a70c7a252573b28915012de2460d0fb2778559999ad2994f7435ba43`; NO bytes/manifiesto transferidos. 2 agentes Sol QA/Luna media |
| Ventas/pauta | `01a13171-6ac1-771e-b285-52e7284e203a` | Manifiesto/contrato demo preparados; 2 agentes Luna manifest/Sol QA; sin acceso Meta comprobado |

Madres locales: Desarrollo `01a12beb-7774-7c02-9931-12264158df83`, Marketing `01a12c1f-bef7-7252-a4b6-f8f8354dfc48`. Marketing delega transferencias y supervisa, no produce: ejecución por turnos, sin rondas automáticas activas. Work se conserva para exportación; no reactivar su oficio ni duplicar carril.

**Acceso real:** GitHub conector sí; git fetch por proxy 8080 falla. No Internet/VPS irrestricto ni “todo conectado”. La lectura/acta no sustituye transferencia de bytes: cada worker verifica ruta/hash y herramientas desde su propio entorno antes de cerrar recuperación. Modelos de agentes citados son roles/configuración comunicada; no inferir modelo de Work.

**Regla para enlaces/pedidos:** Sergio manda a madre de área **enlace + objetivo**; madre delega al trabajador existente, trabajador investiga/implementa y ejecuta QA, madre resume y presenta decisión. Registrar fuente/delta, no reenviar trabajo a Sergio ni abrir duplicado. Bloqueo específico de acceso detiene solo el paso dependiente.

**Ejecución solicitada por Sergio:** no cerrar con plan. CODEX.md implementado desde CLAUDE.md fuente `732c479e0f6fe20e93a1401e9febde086c260091`; AGENTS.md exige lectura para carga real, manifest registra alcance aislado. Esta implementación documental no prueba los 4 sustitutos, accesos ni loops pendientes.

| Comparación Claude → Codex | Conservado | Adaptación vigente / límite |
|---|---|---|
| Oficio, producto, seguridad y contenido | Base CLAUDE.md, casos y referencias trazables | Datos/precios/canales fechados son evidencia; revalidar antes de operar |
| Madre/ejecutores | Contratos, handoffs, revisión y coordinación | 2 madres SOLO delegan/revisan/resumen, 5 nativos; antiguo 1 madre/ejecución PC sustituido |
| Modelos y subagentes | Calidad por rol, QA independiente | Astra madres/difícil, Sol habitual, Luna mecánica; no heredar Opus/Haiku ni inventar observabilidad |
| Skills/contexto | `.claude/skills/` fuente única, router/equipo/aprendizaje | Sin copias; lectura por delta; enlace AGENTS→CODEX no presupone autoload de CODEX |
| Autonomía/cierre/Git | META/PRUEBA/PARADA, tests, preservación | Worker ejecuta hasta validado/bloqueo; no solo plan. Git según contrato, no implementación por madre ni main/deploy inferidos |
| Publicación/acceso/loops | Aprobación, identidad, privacidad y cuentas | Aprobadas versión/cuenta/calendario sin re-OK; nuevas/gasto con OK. IDs/crons Claude históricos, no activados |

**Contradicciones resueltas:** CLAUDE genérico 1 madre, madre hace PC/commit, Codex sin Git, routing Claude y permisos antiguos no prevalecen. CODEX bloque inicial fija adaptación; base conservada contiene historia claramente subordinada. No secretos ni IDs/triggers Claude copiadas como activos. Archivo existente CODEX.md/codex.md no encontrado antes de crear; no duplicado por case.

**META:** ordenar 2 madres locales supervisoras y 5 ejecutores Codex Cloud nativo, recuperar backlog/artefactos Claude+Work y demostrar acceso/QA por carril antes de relevar los cuatro Work. Preparar sin microconsultas ni duplicar documentos/skills. Npm fijado por lockfiles cloud ya autorizado; herramientas nuevas requieren aprobación.
**PRUEBA DE HECHO:** por fase, entregar contrato, ID real/modelo configurable, repo/ref/SHA, artefacto recuperable y resultado de prueba; estados explícitos: validado / preparado / bloqueado. No confundir tool visible, despacho o draft con ejecución terminada.
**PARADA:** sin main, producto, herramientas nuevas, secretos trasladados, compras o infraestructura. No archivar Work sin prueba de recuperación. Acceso sensible ausente detiene solo su paso; no rodear controles ni asumir permisos. Conservar diffs en vuelo; no interrumpirlos para cambiar modelo.

### Reparto y routing que mandan desde ahora

| Sesión | Responsabilidad | Modelo |
|---|---|---|
| Madre Desarrollo-Infra local | Contratos/prioridades, coordinación Platform/Hermes, QA y resumen; NO implementación | Luna low; delegar/revisar/resumir |
| Madre Marketing local | Contratos/prioridades Marca/Lucía/Ventas, revisión/versión aprobada, resumen; NO oficio del worker | Luna low; delegar/revisar/resumir |
| Platform Codex Cloud | Código del backlog vigente y pruebas; no rehacer Prisma cerrado | Sol 6.1 medium; QA focal Sol low; mecánica Luna low |
| Hermes Codex Cloud | QA, regresiones, contratos de infra/Jarvis sin aplicar producción | Luna low |
| Marca Codex Cloud | Proyectos/edición/cortes, previews y publicación autorizada | Sol 6.1 low; mecánica Luna low |
| Lucía Codex Cloud | Identidad/procedencia, montajes existentes y calendario/entregas | Sol 6.1 low; mecánica Luna low |
| Ventas/pauta Codex Cloud | Claims/demo/manifiesto, campañas dentro de permisos y evidencia | Sol 6.1 low; mecánica Luna low |

**Routing vigente Sergio Urcullo 12-oct — modo ahorro:** el selector de modelos del cuadro sustituye la orden intermedia de Astra para código. Máx. 1 ejecutor + 1 revisor focal por lote/carril; Astra requiere excepción específica de Sergio por fallo demostrado o riesgo material evidenciado. Sin fanout masivo ni ACK si no hay cambio; pruebas proporcionales, deltas sin historia/diffs enteros ni repeticiones, sin loops nuevos. No afirmar ahorro medido, cuota futura ni modelo servido si no está expuesto. Work no satisface el objetivo de ejecutores Codex Cloud.

**Inventario actual comunicado:** 64 skills Hermes en worktree audit frente a 43 en checkout main, Platform 6; inventario NO implica lectura completa. `list_threads`: Desarrollo/setup Hermes/4 Work idle; madre Marketing notLoaded. No trabajo producto iniciado por este plan. CLAUDE genérico dice 1 madre, bloque nuevo skill/handoff y Sergio establecen 2; prevalece Sergio. CronCreate histórico local: muere con sesión/vence 7 días; no es scheduler cloud 24/7.

**Estado real de partida:** 1 ejecutor Codex Cloud Platform verificado (`01a12c7e-97e2-7115-8561-0b7658008003`); 4 Work pendientes de relevo, IDs/artefactos en Preservación. Hermes setup `01a12dc0-93a3-7451-87d9-3d8d99dec036`: npm y 28 tests PASS, setup guardado; publicación aún PENDIENTE. Red a gestores de paquetes, NO acceso Meta/VPS probado. No declarar acceso total ni entorno operativo solo por este setup. No hay cinco ejecutores nativos comprobados ni loops nuevos activos. Madre Marketing local `01a12c1f-bef7-7252-a4b6-f8f8354dfc48`; madre Desarrollo es la sesión principal de coordinación. Identificar destinos vivos antes de enviar.

### Fuentes únicas y matriz de acceso

Skills propias: `.claude/skills/<nombre>/SKILL.md` en Hermes; Platform `onia-platform/.claude/skills/<nombre>/SKILL.md`. Sin copiar a `.agents`, globales ni chats. Leer router/skill pertinente y delta de cola desde último SHA; no cargar transcripts enteros. `COORDINATION_MANIFEST.md` distingue historia; `hermes-content/docs/EXECUTION_PROTOCOL.md` mantiene gates.

| Carril | Acceso probado | Verificación faltante / bloqueo |
|---|---|---|
| Platform | Checkout SHA `1c01e05f…`; Prisma Client 7.8/typecheck exit 0; 16 tests; versionados limpios | Acceso/ref actual por lote, suite pertinente/build; VPS y apagado físico no probados |
| Hermes | Work leyó 2 repos, ZIP de relevo y 4 reproducciones aisladas | Recuperar ZIP en nativo, head/bundle M1c+M1d; checkout/tests Hermes; VPS no habilitado |
| Marca | Work recuperó 4 originales decodificables y ZIP | Nativo debe recuperar proyectos/N02 nuevo con SHA; DD-A/corte N02; herramientas de render/publicación por destino |
| Lucía | Work preview viernes v2/ZIP, Higgsfield balance, identidad muestreada | SHA master/exportación/QA completa en nativo; token IG/VPS; voz y aprobación específica pendientes |
| Ventas | Work repo/spec v2/5 briefs/objeciones, JSON lote | Assets/demo C1-C7 y selección; Meta login/MFA/sin conector, campañas actuales desconocidas |

**6 grupos de skills, rutas relativas a repos y sin copias:** coordinación [onia-router](../../../.claude/skills/onia-router/SKILL.md), [onia-sesion-madre](../../../.claude/skills/onia-sesion-madre/SKILL.md), [equipo-de-agentes](../../../.claude/skills/equipo-de-agentes/SKILL.md); Platform `onia-platform/.claude/skills/onia-{frontend,backend,db,seguridad,verificacion}/SKILL.md`; infra/QA [onia-infra](../../../.claude/skills/onia-infra/SKILL.md), [onia-hermes-jarvis](../../../.claude/skills/onia-hermes-jarvis/SKILL.md); edición [editor-videos](../../../.claude/skills/editor-videos/SKILL.md), [edicion-referentes](../../../.claude/skills/edicion-referentes/SKILL.md), [ver-videos](../../../.claude/skills/ver-videos/SKILL.md); identidad/media [higgsfield-generate](../../../.claude/skills/higgsfield-generate/SKILL.md), [motion-doctrine](../../../.claude/skills/motion-doctrine/SKILL.md), [diseno-contenido-onia](../../../.claude/skills/diseno-contenido-onia/SKILL.md); ventas [onia-ventas-pauta](../../../.claude/skills/onia-ventas-pauta/SKILL.md). Leer solo grupo/camino del contrato; estos links no prueban skill disponible en cloud.

Acceso de Work o de otro worker no acredita el sustituto. No trasladar cookies/credenciales; autorización nueva concreta solo cuando el paso realmente la requiera. Higgsfield balance no autoriza generación ni prueba publicación.

### Fases, entregables y gates

1. **Consolidar inventario (este registro):** reconciliar 2 madres/5 roles, destinos actuales y modelo; conservar los 4 Work y diffs. Entrega: tabla por carril con último SHA/contrato/artefacto/pendiente. Gate: no duplicados ni cerrados reabiertos. Bloqueo: Marca API sin últimas salidas requiere recuperar desde UI disponible.
2. **Preservar antes del relevo:** recuperar ZIPs/MP4/proyectos/JSON/patch desde fuentes de Preservación; medir hashes completos, índice y decodificación. Entrega: ruta durable que el nuevo worker pueda leer, origen+versión. Gate: nueva sesión abre archivo y coincide SHA. Bloqueo: sandbox del origen no transferido; no declarar enlace sandbox como copia durable.
3. **Preparar entornos nativos por oficio:** reutilizar Platform comprobado; evaluar Hermes draft sin publicarlo/provisionarlo fuera del alcance autorizado. Preparar contratos de Marca/Lucía/Ventas con skills/ref exactos y herramientas requeridas. Entrega: setup propuesto y prueba requerida; NO instalación automática. Gate: entornos y modelos efectivos comprobados antes de asignar trabajo.
4. **Relevar 4 workers, uno por carril:** crear solo los sustitutos expresamente pedidos mediante madre y acceso UI; cada uno devuelve ACK de repo/ref/skills/artefactos y bloqueo. Entrega: ID real, modelo configurado, ruta/SHA recuperada, próximo contrato. Gate: recuperación+smoke pertinente independientes; conservar origen hasta que pase. No simular IDs ni subagentes.
5. **QA y tarea vigente:** hasta 5 frentes útiles por lote si runtime/capacidad permiten y tareas independientes, sin forzar slots ni archivos compartidos; contratos acotados con entradas/rutas/salida/prueba/parada, QA independiente del implementador. Platform: cerrar lote en vuelo y elegir siguiente pendiente funcional tras verificar PRs; Marca: DD-A/N02 sin rehacer montajes; Lucía: viernes v2; Ventas: spec v2/claims/demo; Hermes: E31/E32. Entrega: resultado+evidencia+bloqueo+próximo. No reimplementar cerrados.
6. **Cerrar relevo y ordenar sidebar:** archivar cada Work SOLO tras recuperación comprobada por su sustituto y registro de resultados. Entrega: 2 madres+5 nativos identificados, archivos durables y fuentes conservadas. Gate: ningún artefacto queda únicamente en contenedor a archivar.
7. **Rondas locales, después de validar:** propuesta de ronda cada 20 min por madre, inspección compacta por delta y sin despertar trabajo cerrado. Crear únicamente tras verificar destinatarios, exclusión de loops antiguos y autorización/configuración aplicable. Registrar ID real/primera ejecución; madres locales no coordinan con PC apagada. No afirmar ronda activa antes de esa prueba.
8. **Scheduler cloud, fase posterior:** evaluar arquitectura única sin competir con madres/loops; validar persistencia, permisos, cuota, entrega y exclusión con scheduler previo. Prueba real de PC apagada y disparo cloud requerido antes de prometer 24/7. Sin instalación/compra/secretos en esta preparación; propuesta dot cloud NO confirmada.

**Permisos posteriores al orden, sin ampliarlos:** Marketing puede publicar versión YA APROBADA en cuentas/calendario acordados después de comprobar aprobación/SHA y ausencia de duplicados. Piezas nuevas, generaciones/gasto, nueva cara/voz y decisiones comerciales requieren OK. No confundir autorización de publicación aprobada con acceso autenticado ni con permiso de deploy/secretos. Durante preparación no ejecutar publicación.

**Registro por lote:** dueño · contrato-ID · ref/SHA · herramienta/modelo observable · entregable/ruta/hash · verificación/comando/exit · bloqueo concreto · siguiente paso. Afirmar completitud solo cuando el gate pase. Este plan queda implementado documentalmente; ejecución de relevo/accesos/loops permanece preparada o bloqueada según matriz.

# HISTORIAL Y EVIDENCIA — 11-oct, no instrucciones de arranque

# Auditoría cloud ↔ PC y relevo de madres — 11-oct-2026

> **Fuente vigente de armado: PLAN VIGENTE 12-oct al principio de este archivo.** Sustituye routing y órdenes anteriores donde contradigan el plan; conservar evidencia histórica con su alcance. Preparación documental ejecutada no implica relevo, loops o accesos completados.

**META vigente:** preparar ONIA SaaS con ejecución cloud que continúe con la PC apagada, madres supervisoras y sin retomar producción ni contratar infraestructura.
**PRUEBA DE HECHO:** informe contrastado con referencias Git, observaciones de UI/CLI comunicadas por la madre y documentación oficial; piloto con resultados pendientes.
**REGLA DE PARADA vigente — PRIMERO ORDENAR:** suspensión de nuevos lotes enviada a Desarrollo, madre Marketing y setup de entorno; no publicar/provisionar mientras se ordena. Preservar avances, sin nuevas cadenas. Permisos anteriores de piezas aprobadas no habilitan ignorar esta pausa. Commit/push SOLO de este registro autorizado, sin producto.

## HISTORIAL — VIGENTE: PC APAGADA — pruebas y decisiones posteriores al piloto

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

## HISTORIAL — Decisiones y alcance

- ONIA es SaaS; el reparto vigente tiene MADRE MARKETING y MADRE DESARROLLO-INFRA locales.
- Marketing supervisa Lucía, Marca personal y Ventas/pauta; Desarrollo-Infra supervisa Plataforma, Hermes/QA e infraestructura.
- Las madres definen contratos, delegan, verifican y resumen; delegan la ejecución local a un worker local.
- Prioridad: trabajo cloud. Orquestador definitivo Claude/Codex PENDIENTE; esta auditoría no cambia el orquestador.
- Modelos solicitados: Astra medio para madres y toda programación; Sol/Luna para apoyo mecánico. Capacidad real por cuenta, entorno y herramienta se verifica antes de asignar.
- Claude quedó sin cuota disponible en la observación comunicada; no reactivar sus sesiones.

## HISTORIAL — Evidencia observada y límites

- Madre informó UI Claude: cuota al 100 %, reinicio 15-oct 04:00 Caracas; Trusted Device bloquea acceso a madres. Es snapshot, no predicción de disponibilidad.
- CLI comunicadas: Claude 2.1.288 y Codex 0.161.0. Esto supera los handoffs de 5-oct que todavía indican Codex 0.139 y gpt-5.5.
- Inventario comunicado: 43 en `onia-hermes/.claude/skills` (no todas propias de ONIA), 30 en `onia-hermes/.agents/skills`, 6 en `onia-platform/.claude/skills` y 108 en `C:/Users/PC/.claude/skills`. Conteos no demuestran paridad ni carga efectiva en cloud.
- Reusar fuentes canónicas `.claude/skills/`; registrar por ejecutor qué skill puede leer y qué versión usa. No duplicar skills para resolver diferencias aparentes.
- Se actualizaron referencias mediante fetch, sin merge de main. Checkout previo `ac8f2d44` (8-oct); `origin/main=2cdefca7` (10-oct).
- Este informe vive en `codex/cloud-pc-audit-20261011`, worktree aislado basado en PR #195. Ningún cambio al checkout principal.
- Lecturas Git del auditor confirman documentos y commits; no confirman sesiones vivas, cuotas actuales, ejecución de timers ni producción.

## HISTORIAL — Arquitectura anterior — SUPERADA por requisito PC apagada

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

## HISTORIAL — Continuidad reciente: fuentes por rama

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

## HISTORIAL — Tokens: diagnóstico acotado

Ventana aproximada comunicada: **10-oct 17:06:58 → 11-oct 17:07:19 UTC**; 421 archivos, 4.180 registros únicos, tomando el primer `usage` por `message.id`.

- Cache-read: **1.135.675.131** tokens; output: **1.218.181** tokens.
- Es una aproximación de registros locales, no dinero, cuota consumida, memoria única ni prueba causal de una estrategia fallida.
- Verificar semántica de los contadores y mensajes finales antes de estimar costos: el primer registro puede estar incompleto; cache-read puede acumular el mismo contexto reutilizado en varias llamadas.
- Hipótesis a medir: reducir relectura completa y recordatorios repetidos mediante contratos breves, cambios desde el último SHA y verificación mecánica delegada.

## HISTORIAL — Caveman: inspeccionado, no activado

Ruta exacta: `C:/Users/PC/.claude/plugins/marketplaces/caveman/skills/caveman/SKILL.md`.
Inspección de líneas 11-23: estilo persistente, nivel full por defecto y eliminación de hedging; líneas 54-67: claridad para riesgos/secuencias y escritura normal de código/commits/PRs.

Propuesta **lite**: español claro, resumen corto con hechos, incertidumbre y siguiente acción; conservar nombres, evidencias y condiciones. No eliminar incertidumbre real. No hay prueba de calidad ni activación. Comprimir salida no demuestra ahorro de input.

## HISTORIAL — Plan inicial de piloto — HISTORIAL, parcialmente superado

Linux, GitHub, conector Higgsfield, sample media y marcadores entre turnos están verificados. Del plan siguiente siguen pendientes autenticación del navegador, persistencia tras reinicio, checkout/suite de producto y cloud → VPS. El navegador no bloquea operaciones del plugin; los 8 checks aislados no sustituyen la suite.

1. Comprobar disponibilidad en UI de la cuenta/entorno: captura de función y alcance; sin activarla.
2. Solicitar aprobación concreta si requiere acceso nuevo, indicando origen, permisos y destino. No instalar nada durante esta auditoría.
3. Con aprobación, contrato de lectura con nonce inocuo: devolver ACK, nonce, SHA y ruta permitida; conservar evidencia sin secretos.
4. Probar navegador por separado: lectura de página acordada y captura inocua. Confirmar sesión reutilizada y exclusión mutua; no exportar cookies.
5. Probar VPS únicamente bajo autorización independiente y lectura restringida acordada. ACK del repo no habilita VPS.
6. Evaluar fallos, permisos, duplicación y latencia; registrar resultado por prueba. Sin generaciones pagadas en Higgsfield, publicaciones ni producción; lectura de cuenta permitida dentro del piloto autorizado.
7. Elegir arquitectura después de revisar evidencias con Sergio Urcullo. Orquestador, sesiones y modelos quedan sin cambiar hasta entonces.

## HISTORIAL — Runbook operativo cloud — media/checks aislados verificados; checkout/reinicio pendientes

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

## HISTORIAL — Contrato vigente de trabajo autorizado — 2026-10-11

Sergio autorizó poner los workers a trabajar; cada madre supervisa, autoriza su carril y resume resultados. **Primer lote: 15 minutos o entrega de resultado/bloqueo, lo que llegue primero; sin monitor perpetuo.** Mensajes a ambos destinos enviados con éxito de herramienta; acuse e inicio de ejecución todavía POR VERIFICAR. Envío exitoso no demuestra trabajo completado.

- **Desarrollo:** madre Desarrollo = sesión principal de esta coordinación; delegó a `01a12c7e-97e2-7115-8561-0b7658008003`, Sol 6.1 Medio, diagnóstico/arreglo de Prisma, dependencias por lockfile, tests y typecheck. Entrega: comandos/exit codes, diff y SHA/artefacto, distinción fallo de entorno/código y bloqueo concreto. Sin bypass, secretos, producción ni deploy.
- **Marketing:** madre `01a12c1f-bef7-7252-a4b6-f8f8354dfc48` autorizada directamente por Sergio para mensajear/delegar a Media ChatGPT `6acbce63-abc8-83e9-8422-d849d5e15aa4`: recuperar pendientes, cortes/assets y preparar **PREVIEWS privados de material existente**. Entrega: pieza/ruta/versión, evidencia de assets, decisiones de cortes pendientes y preview revisable. Sin gasto, generación de voz/cara nueva, publicación ni master sin OK.
Inicio confirmado por wait_threads: Desarrollo turno 01a12c87-d330-7196-af82-ee8db33d22b5 activo; Media turno 01a12c88-5a7f-7185-9df9-c5fe393ccf08 activo tras delegacion de madre Marketing. Esto confirma ejecucion iniciada, no resultados finales.

## HISTORIAL — Corrección vigente Sergio: 5 carriles reales bajo 2 madres

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

## HISTORIAL — Decisiones finales vigentes y despacho — 2026-10-11

- **Preferencia a largo plazo: totalmente cloud.** Dos madres/cinco carriles siguen operativos en el reparto documentado; trasladar supervisión permanente a cloud requiere arquitectura y prueba propias. Propuesta de dot cloud en evaluación por agente `cloud_architecture`, **NO confirmada**; no declarar orquestador 24/7 listo.
- **PLATAFORMA Y TODA PROGRAMACIÓN: Astra, effort medio.** Sustituye Sol como ejecutor principal de código en recomendaciones anteriores. Sol/Luna solo apoyo mecánico según contrato. `send_message` ya aplicó `model:gpt-6-astra` a Desarrollo `01a12c7e-97e2-7115-8561-0b7658008003`; configuración enviada no prueba modelo de Work Cloud. Selector Sol citado arriba pertenece al historial de onboarding/validación.
- **Marketing puede PUBLICAR PIEZAS YA APROBADAS**, exclusivamente en cuentas y calendario acordados; nuevas piezas y gasto con OK. Orden enviada a madre Marketing. Esto sustituye la restricción general de pedir autorización de nuevo para cada publicación ya aprobada; verificar versión/SHA aprobado antes de publicar.
- **Ventas, avance comprobado:** worker leyó repo, recuperó las 5 objeciones y validó manifiesto. Meta navegador bloqueado por login y sin conector disponible: no declarar acceso completo ni creación/publicación de campañas. La cifra “0 campañas” del material anterior es histórica, **NO inventario actual**.
- Lucía, Ventas y Hermes nuevos confirmados activos por listado; sus pruebas de acceso/resultados son independientes. No inferir acceso de uno por tool/balance de otro. No compras, secretos transferidos ni loops activos nuevos.
- Las instrucciones históricas Sol/4 sesiones/solo read-only/publicación siempre pendiente quedan superadas por estas decisiones donde corresponda; sus pruebas y límites técnicos conservan validez con fecha y alcance.

## HISTORIAL — Preservación para relevo Work → Codex Cloud nativo — 11-oct

Orden de Sergio: sustituir los 4 workers Work por Codex Cloud nativo. **NO archivar Work hasta que el sustituto recupere y compruebe los artefactos.** `read_thread` consultado sin enviar mensajes: Lucía/Ventas/Hermes entregan salidas; Marca devuelve solo mensajes de usuario, por lo que no se confirma desde esta API su último N02 ni equipo. Rutas `/workspace/scratch` pertenecen a cada Work: no asumir que existen en Codex ni en la laptop. Los enlaces sandbox siguientes figuran en salidas de origen; exportación a repo/almacenamiento accesible por sustituto **PENDIENTE**, no inventar entrega durable.

| Carril y fuente Claude exacta | Artefacto/version y ruta de origen | Pendiente para recuperar/continuar |
|---|---|---|
| Marca `origin/claude/gifted-clarke-y4vvtj:hermes-content/docs/cola/loop/marca-personal.md:8-11,21`; guion P1 `hermes-content/videos/moldes/niveles/P1-NIVELES-GUION-MOSAICO-TABLERO.md`, commit `781df7d87` | 4 originales Claude N06/N07/DD-A/N02 decodificados, `Borradores-originales-Claude.zip` según recuperación anterior. Ruta exacta/link y versión N02 nueva NO disponibles en read_thread actual; no fabricar SHA | UI del origen `6acbce63-abc8-83e9-8422-d849d5e15aa4` debe recuperar links/proyectos y N02 ya producido antes de rehacer. DD-A confirmación 01:01–01:09; N02 decisión 2,4 s. Masters con ok cortes; publicación solo versión aprobada |
| Lucía `origin/claude/zealous-babbage-fvtjck:hermes-content/docs/cola/loop/lucia.md:57-60`; manifest `hermes-content/videos/lucia-entrega/README.md` | Viernes v2: [preview](sandbox:/workspace/scratch/6dfdcd54b0f6/lucia-review/viernes-preview-360p.mp4), [copy/procedencia ZIP](sandbox:/workspace/scratch/6dfdcd54b0f6/Lucia-viernes-v2-revision.zip). 15 s, 24 fps, 360 cuadros, mudo; SHA comunicado parcial `d5078617…b39ad3`, idéntico a blob según worker | Medir SHA completo preview/master al recuperar; reproducción completa/interfaz IG pendientes. Calendario 16-oct/G3 30-oct/P9 6-nov y aprobación específica pendientes; voz 223 car propuesta, sin permiso. `onia-vps` no resuelve, sin conector IG |
| Ventas `origin/claude/onia-ventas-pauta-rmdv5j:hermes-content/docs/cola/loop/ventas-pauta.md:3-8`; `CAMPANA-1-LISTA-PARA-CREAR.json` y briefs G1-1…G1-5 en rama de dueño | Spec v2 Claude recuperada, propone 4 piezas SIN selección aprobada. [MADRE-MARKETING-lote-11oct.json](sandbox:/workspace/scratch/1d6889353f5b/MADRE-MARKETING-lote-11oct.json), actualizado tras detectar referencias A1 obsoletas; SHA no comunicado | Recuperar JSON y medir hash; no rehacer 5 objeciones ni A1. G-06 bloquea cuatro piezas, G-05 solo G1-2; demo/C1-C7 sin prueba. Meta login/MFA pendiente, campañas actuales desconocidas; sin gasto/contacto |
| Hermes `origin/claude/adoring-ramanujan-7sjzwv:hermes-content/docs/cola/loop/hermes-jarvis.md:604-605`; `hermes-content/docs/handoff/hermes-jarvis.md` | [hermes-jarvis-relevo-codex-cloud.zip](sandbox:/workspace/scratch/40382cfce43f/hermes-jarvis-relevo-codex-cloud.zip): íntegro/4 archivos según worker, handoff/parche/fuentes/resultados. 4/4 reproducciones aisladas; NO suite/render. SHA ZIP no comunicado | Medir hash/índice al recuperar; falta head/PR/bundle `codex/m1d-dental-sobre-m1c` (404), M1c `780d4d5c` y M1d `07f52b32` solo referencias históricas. QA dinero/regresiones E31/E32; no Q1/aplicar/Q5/VPS |

Equipos reales comunicados: Lucía `/root/lucia_continuidad` y `/root/lucia_qa`; Ventas `/root/analista_campanas` y `/root/validador_claims`, ACK/resultados. Hermes ZIP incluye límites/resultados de 2 subagentes; IDs no extraídos. Modelos Work no observables; no heredar agentes como activos en sustitutos. Máximo 2 simultáneos donde aporten, programación Astra medio, apoyo Sol/Luna mecánico configurable.

**Permisos preservados:** madres asignan/revisan/resumen, workers ejecutan. Publicar solo piezas YA aprobadas en cuentas/calendario acordados, verificando versión y evitando duplicados; nuevas piezas/gasto con OK. Este relevo no autoriza instalaciones, traslado de secretos, nuevos loops, contactos, deploy ni producción. Cada nuevo worker devuelve ACK de repo/ref/skills, artefactos recuperados con SHA y bloqueo antes de continuar; conservar Work hasta esa prueba.

## HISTORIAL 11-oct: ordenar antes de continuar — inventario y matriz

Sergio pidió **PRIMERO ORDENAR**. Suspensión de nuevos lotes enviada a Desarrollo, madre Marketing y setup; conservar entregables sin nuevas cadenas, publicación ni provisioning. Borrador de entorno Hermes creado, ID `01a12dc0-93a3-7451-87d9-3d8d99dec036`; **no provisionar/publicar todavía**. Este estado sustituye los prompts anteriores de arranque inmediato.

**Inventario Claude real comunicado:** transcript local `35353b71-e12a-46e4-834f-804cb833a7ab`, MADRE DESARROLLO-INFRA, Opus 5.5: 30 llamadas Agent, 70 SendMessage, 23 CronCreate. Madre Marketing `5a84570d-c843-4c29-9257-389aca199809`, Opus 5.5: 9 Agent, 64 SendMessage, 9 subtranscripts Sonnet 5.5, ronda cada 20 min. Son conteos de llamadas/transcripts, **no agentes simultáneos ni loops vivos**. Cuota Opus agotada en últimas rondas impide garantizar continuidad del loop; no reactivar Claude desde el inventario.

| Rol | Política vigente |
|---|---|
| Madres | Astra: coordinación, supervisión y QA; NO implementación |
| Platform y programación (política 12-oct) | Sol habitual medio; Astra solo tarea muy difícil |
| Ejecución marketing, edición y ventas | Sol 6.1, effort medio; código requerido se delega a Astra |
| Mecánica cerrada/verificable | Luna, low |
| QA independiente | Sol; escalación Astra para alto riesgo |

Es **política**, no prueba de haber cambiado modelo Work. Los cuatro Work con modelo no observable quedan candidatos a sustitución por Codex Cloud; no archivarlos hasta recuperación verificada. Único Desarrollo comprobado: Astra y subagentes reales Astra implementación/Sol QA. No asignar Astra indiscriminadamente a ventas/edición ni afirmar modelos de futuros sustitutos sin configuración/evidencia.

Los prompts de relevo entregados antes que indicaban Astra para los cuatro carriles quedan corregidos: Marca/Lucía/Ventas usan Sol 6.1 medio para su oficio, Hermes QA Sol con escalación Astra, y cualquier programación Astra medio. Sin más despachos hasta concluir orden e inventario con las madres.


## Delta Sergio + upstream Hermes — 12-oct-2026

Sergio: conservar/reutilizar reels, noticias y competencias sin perder contexto; una fuente para avisos/aprobaciones, app aún no elegida. Gates humanos declarados: gasto, nuevas publicaciones, producción, acceso a cuentas y diseño visible. Intake madre vs workers sigue sin decidir. Propuesta (no elección): Telegram del gateway Hermes como canal único si identidad/allowlist, conectividad, logs y aprobación fail-closed pasan QA.

Identidad confirmada: tercero NousResearch `hermes-agent` (README/`pyproject.toml` upstream y [registro ONIA](../HERMES_AGENT.md)); no confundirlo con este repo ONIA. Upstream documenta [gateway/sesiones Telegram](https://hermes-agent.nousresearch.com/docs/user-guide/messaging), [cron y eventos](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron) y [configuración de memoria, skills, approvals, modelos, subagentes y browser providers](https://hermes-agent.nousresearch.com/docs/user-guide/configuration); eso no acredita configuración/estado ONIA. Cron exige gateway activo; perfiles/credenciales son por máquina. Browser cloud es capacidad upstream, no navegador/cuenta de Sergio transferida.

Contexto e intake: skills, SOUL, memoria aprendida y sesiones ayudan a recordar; no prueban “sabe todo”, acceso a todos los archivos/cuentas ni actualidad del código. Cada fuente nueva de reels/noticias/competencia se registra una vez en el registro existente con URL, propósito, dueño, estado, evidencia, siguiente acción y aprendizaje; antes, consultar fuente original y ficha previa para deduplicar. No sustituir objetivo ni abrir trabajo vacío. Conservar originales/enlaces en almacenamiento canónico; memoria resume/apunta y nunca reemplaza fuente/Git. No asumir que el VPS posee archivos locales de la PC.

Futuro Claude Code: Sergio quiere trabajar junto a Claude después, pero no hay cuota Claude disponible ahora; no invocar/configurar, instalar ni abrir sesión. Reutilizar en el futuro contratos, colas, artefactos y skills fuente `.claude/skills/`, sin orquestador duplicado. Antes de activarlo, medir cuota y verificar modelo servido, autenticación y permisos del proveedor; no mapear identidades antiguas ni inferir continuidad multi-runtime/PC-off desde documentación.

Estado ONIA: [harness/README + QA](https://github.com/oninteligenciaartificial/onia-hermes/blob/codex/hermes-harness-20261012/hermes-content/docs/handoff/hermes-harness-20261012/README.md) aceptan propuesta offline; 18/18 + QA independiente Sol reportados en baseline, y [b5a0ad4](https://github.com/oninteligenciaartificial/onia-hermes/commit/b5a0ad442057c4859ed9dd51d3fa47f7f5a6cc06) agrega clave por efecto + 3 tests focales offline, sin adapter. Store/checkpoint compartido y lease/lock atómico distribuido: NO implementados; wake/dispatch PC-off: NO probado/readiness false. No confundir O_EXCL local o Git con coordinación transaccional.

Platform: reporte del worker atribuye 35 tests + 24 rechazos y QA Sol low PASS; madre no inspeccionó código/casos/capturas. Schema DB y auth interna siguen pendientes; no producción. Fuente canónica: [auditoría supervisor](../audits/SUPERVISOR-CLOUD-INVENTARIO-20261012.md); PC no se apagó físicamente para E2E. Config/README Hermes ONIA fechados 2-sep y versión VPS anotada v0.21.0 no revalidan servicio vivo. Modelo servido no observable; snapshot ordinario 59% usado/41% restante es puntual, no cuota permanente.

Prueba mínima futura (no ejecutada): crear un ítem sintético sin datos/cuentas, con repo/ref/SHA + inputSHA; en runtime ya autorizado, un trigger finito reserva atómicamente una lease en store compartido y usa una clave por efecto; apagar la PC; exigir recibo/turnId/canario, reanudar exactamente el checkpoint y enviar sólo solicitud de aprobación (sin ejecutar acción); encender PC y verificar un solo efecto, log durable, cuota/modelo observables y sin duplicado tras reconciliar. Hoy no hay store+dispatcher soportados/configurados ni canal aprobado: no se puede correr ese E2E.

Decisión pendiente mínima: elegir la app única y quién puede aprobar/intake (madre o workers). Hasta entonces, Telegram queda PROPUESTO; aprobar contenido ya revisado no cubre gasto, cuenta, producción ni diseño visible. Ningún consentimiento se infiere.

## Delta 2026-10-13 — Deep Research nativo, QA y corpus

En el [cuaderno ONIA existente](https://notebook.google.com/notebook/4976c6a9-2609-4f63-98db-514149c85f82) se seleccionó Deep Research real y se observó progreso hasta «finalizó». Informe: Arquitectura Mínima Cloud Autónoma para ONIA. Cobertura declarada por el producto: 32 citadas + 17 no citadas; **no son 49 fuentes verificadas independientemente**. Se preservaron 5 originales y se importaron 8 primarias pertinentes + informe: 14 fuentes antes de notas QA.

**QA RECHAZADO como arquitectura validada.** El informe mezcla Hermes Agent con modelos Hermes, usa fecha marzo-2026 y DeepWiki para Codex; omite API Enterprise, presenta Vertex como obligatorio, confunde créditos HF y promete idempotencia/24h. Lease necesita fencing y reconciliación de resultado ambiguo: efecto externo antes de guardar COMPLETED sigue siendo ventana de duplicación. No ejecutar sus pasos ni presupuesto.

Verificaciones originales: [Agents API hosted quickstart](https://developers.openai.com/api/docs/guides/agents-api/quickstart) requiere OPENAI_API_KEY con api.agents.read/write y api.responses.write, header beta agents=v1; [Notebook Enterprise API](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks) documenta gestión y licencias, no demuestra query/chat; [DO pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/) Free solo SQLite y exceder cuota falla; [Browser Run pricing](https://developers.cloudflare.com/browser-run/pricing/) Free 10min/día y 3 navegadores. Discrepancia CF: página comercial SQL reads 50M/día frente a pricing técnico 5M/día; presupuestar con documentación técnica y revalidar.

El informe quedó renombrado **HIPÓTESIS NO VALIDADA · QA rechazado** y deseleccionado del corpus consultable; nota QA correctiva conserva links y límites. Un clic asíncrono creó además una nota vacía accidental: deseleccionada y preservada, sin borrado irreversible. Estado final: 16 ítems guardados, 14 seleccionados (13 fuentes primarias + nota correctiva); el informe y nota vacía están excluidos. La selección no prueba que todas las afirmaciones de las primarias estén comprobadas.

Propuesta proporcional, no implementada: ensayo aislado aprovechando VPS/SQLite con mocks, estado durable, recibos por efecto y aprobaciones; comparar con DO antes de incorporar servicios. Autonomía con PC apagada no probada; sin instalaciones, compras, nuevos servicios, deploy ni inferencia pagada. Captura local: C:/Users/PC/.codex/visualizations/2026/10/11/01a12beb-7774-7c02-9931-12264158df83/notebook-dr-corpus-qa.jpg.
