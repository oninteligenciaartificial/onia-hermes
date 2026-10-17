# CAMBIOS - unificación de reglas (16-oct-2026)

Fuentes leídas en `origin/main` (`cef4a28f`): `CLAUDE.md` (CL), `AGENTS.md` (AG), `CODEX_SKILL_ROUTING.md` (CSR), `COORDINATION_MANIFEST.md` (CM), `hermes-content/docs/AI_MODEL_ROUTING_2026.md` (MR), `hermes-content/docs/EXECUTION_PROTOCOL.md` (EP); `CODEX.md` de `origin/codex/hermes-controller-hardening-20261013` (CX). Contexto vigente: `hermes-content/docs/cola/loop/hermes-jefa.md` (16-oct) y skills `onia-sesion-madre`, `orca`.

Destino: A§n = `AGENTS.md` nuevo, sección n · C = `CLAUDE.md` nuevo · "doc X" = la regla ya vive en ese archivo, que no se mueve.

Tipos: **igual** · **condensada** (misma regla, sin la historia larga) · **actualizada** (cambia por una orden posterior) · **movida** (sale de las reglas, vive en un doc o skill que ya existe) · **eliminada** (con motivo).

| # | Regla | Estaba en | Queda en | Cambio |
|---|---|---|---|---|
| 1 | Credenciales y sesiones locales (bóveda, reusar sesión, no volcar secretos, MFA, instalar con OK, acceso no amplía alcance) | CL, AG, CX | A§1 | condensada; 17-oct (2.ª ronda): restituidas las prohibiciones duras (no volcar la bóveda ni exportar secretos a texto; no pedir ni guardar la clave maestra; Google, consentimiento, MFA, desbloqueo y sesión caducada son de él; sin sesiones permanentes; perfiles fuera de Git y serializados; el VPS no aloja la bóveda). Detalle en `hermes-content/skills/seguridad-credenciales.md` |
| 2 | Nuevos accesos a cuentas con OK previo | CX (12-oct) | A§1 | condensada en «cuenta nueva o descargar/instalar (herramientas, dependencias, navegadores, plugins, extensiones): qué, de dónde y para qué, con OK» (17-oct (2.ª ronda)) |
| 3 | Un objetivo por sesión, con «hecho»; lo demás a pendientes | CL, CX | A§1 | condensada |
| 4 | «UNA madre local, varios carriles; Codex ejecuta el encargo de la madre» | CL | A§1 Quién hace qué | actualizada: 16-oct la jefa es el proyecto «ONIA · Hermes»; la madre instala y vigila |
| 5 | Codex sin Git; la madre commitea por él | CL (9-oct) | - | eliminada: obsoleta, Codex pasó a revisor de PR (16-oct); Git queda «según contrato» (A§1 Arranque) |
| 6 | Mismo carril en serie, carriles distintos en paralelo | CL, CX | A§4 Carriles | igual |
| 7 | Subagente: worktree con ruta explícita, `git branch --show-current` | CL, CX | C | movida a C (mecánica de Claude Code) |
| 8 | El negocio manda: etapa vigente de ONIA_ESTRATEGIA_DE_EMPRESA.md | CL, CX | A§1 | condensada |
| 9 | No abrir línea de negocio nueva; congelar no es borrar | CL, CX | A§1 | condensada (sin el conteo del 5-sep) |
| 10 | Test de 3 preguntas para un añadido | CL, CX | A§1 | condensada (sin el ejemplo del chatbot) |
| 11 | El techo son horas de soporte | CL, CX | A§1 | condensada (sin cifras de costo) |
| 12 | Financiación o equipo de desarrollo: no | CL, CX | A§1 | condensada |
| 13 | La etapa la cambia solo Sergio Urcullo | CL, CX | A§1 | condensada |
| 14 | `onia-router` al arrancar | CL, AG, CX | A§1 Arranque + C (cómo se invoca) | igual |
| 15 | Cargar `equipo-de-agentes` y `aprender-de-todo` | CL, AG, CX | A§1 Arranque | condensada; «registrar por dimensión» queda en la skill `aprender-de-todo` |
| 16 | Skills de `onia-platform` obligatorias al tocar el producto | CL, AG, CX | C | movida a C por pedido. Ojo: Codex ya no ve la lista de 6 en AGENTS; A§3 nombra `onia-db` y `onia-deploy` |
| 17 | Trampa nueva: editar la skill, no doc suelto; skill pública que sirve se usa | CL, CX | A§1 Skills | condensada |
| 18 | Autoconocimiento: leer la skill antes, escribir lo aprendido en el mismo commit; carril sin skill crea una | CL, CX | A§1 Skills | condensada |
| 19 | Skills fuente única en `.claude/skills/`, no copiar a `.agents/` | AG, CX | A§1 Skills | corregida 17-oct (2.ª ronda): `.agents/skills/` SÍ existe en origin/main (30 carpetas, copias para Codex de `.claude/skills/`; verificado con `git ls-tree`). AGENTS §1: la fuente es `.claude/skills/` y las copias no se editan. Sin resolver: no se halló ningún script que las sincronice; decidir quién |
| 20 | Modelo por rol (Haiku/Sonnet/Opus; Codex Astra/Sol/Luna) | CL, AG, CX, MR | A§1 + C (`model` explícito) + doc MR | condensada |
| 21 | Presupuesto de contexto (manifest corto, subagente con pregunta cerrada, una generación paga antes de variantes) | MR | doc MR | movida: sigue en MR, que no se mueve |
| 22 | Routing «modo ahorro» 12-oct (madres Luna low, etc.) | CX | - | eliminada: obsoleta, era para las 2 madres del 12-oct |
| 23 | Canario «Sergio Urcullo» | CL, CX | A§1 | condensada (el límite del canario queda en media línea) |
| 24 | Simple: 3 bloques Pasó/Necesito/Sigue, sin PRs ni hipótesis | CL, AG, CX | A§1 | condensada |
| 25 | Lo que necesita a Sergio Urcullo, junto | CL («en una hoja») | A§1 | actualizada: «UNA lista diaria» (hermes-jefa.md 16-oct) |
| 26 | En producto, menos pasos/clics | CL | A§1 Simple | condensada |
| 27 | Usted con clientes y prospectos; vos con él | CL, AG, CX | A§1 | condensada |
| 28 | Comandos para él en PowerShell | CL, AG, CX | A§1 | condensada (sin ejemplos de sintaxis) |
| 29 | Horas de La Paz; en crons no se resta | CL, AG, CX | A§1 | condensada |
| 30 | Criterio propio, contradecir con evidencia | CL, AG, CX | A§1 | condensada |
| 31 | No preguntar lo razonable | CL, CX | A§1 | condensada |
| 32 | Escalera de autonomía (MCP, CLI, skill, script, recién preguntar) | CL, AG, CX | A§1 + C (`ToolSearch`) | condensada |
| 33 | Bajar el consumo ante un tope; pausar, no borrar | CL, AG, CX | A§1 | condensada |
| 34 | Onia vende software, nunca horas | CL, AG, CX | A§1 | actualizada: excepción 16-oct, workshops y consultorías pagas para la caja de octubre. 17-oct (2.ª ronda): se restituye «ningún trato exige presencia de Sergio Urcullo; nunca comisión ni equity; sociedad solo por earn-in con hitos» y la excepción queda acotada (hasta el 31-oct, solo para eso, el producto sigue siendo Onia Platform) |
| 35 | 5 rubros, no solo dental | CL, AG, CX | A§1 + A§3 | condensada |
| 36 | Cuidar tokens, no releer | CL, AG, CX | A§1 + C (Bash: rutas absolutas, exit code) | condensada |
| 37 | La madre orquesta: ronda, lee transcripts, una línea por sesión | CL | - | eliminada: obsoleta, coordina la jefa (16-oct) |
| 38 | Madre local + carriles en la nube; ordena por mensaje | CL | A§1 Quién hace qué | actualizada: madre le habla a la nube con `claude -p --cloud <cse_id>`; las órdenes se anotan en hermes-jefa.md |
| 39 | Solo la madre manda con `SendMessage`; la nube no puede mandar | CL | - | eliminada: obsoleta (16-oct); el detalle de canales sigue en la skill `onia-sesion-madre` |
| 40 | Nada de mensajes programados (`create_trigger`) entre sesiones | CL, CM | A§1 («nada de otro scheduler, cola ni puente») | condensada |
| 41 | El canal es el mensaje; el handoff solo para retomar | CL | A§1 | condensada en Quién hace qué y Cambio de sesión |
| 42 | El portal del SIAT solo lo abre Sergio Urcullo | CL, CX | A§1 | ampliada 17-oct (2.ª ronda): «nunca en la nube ni en ninguna sesión, tampoco la madre»: SIAT, BCP Credinet, bóveda, cookies de la PC, login de Google y códigos de verificación (SISTEMA §7) |
| 43 | «Cambio de sesión» → handoff de 7 campos, commit y push, con lo incómodo | CL, CX | A§1 | condensada |
| 44 | Precios: subscription-plans.ts (planes) y pricing.ts (add-ons) | CL, CX | A§2 | condensada; se nombra el repo `onia-platform` (esas rutas no están en origin/main de onia-hermes). 17-oct (2.ª ronda): restituido «ningún doc, propuesta, one-pager ni cotizador define precio: lo LEE de ahí; otro número = roto»; A§5 Propuestas apunta a `subscription-plans.ts` (planes) y `pricing.ts` (add-ons), no solo a `pricing.ts` |
| 45 | Qué se vende: ONIA_CATALOGO_DE_VENTA.md | CL | A§2 | igual |
| 46 | A quién: ONIA_CLIENTE_IDEAL.md | CL | A§2 | condensada (el perfil vive en el doc) |
| 47 | Cómo se consiguen clientes: ONIA_ADQUISICION_Y_PAUTA.md; ningún anuncio promete lo que prod no hace | CL | A§2 | condensada |
| 48 | Un tema = un archivo sin fecha; no crear `-v2`/`-new` | CL, CM | A§2 | condensada, unidas |
| 49 | Fecha en el nombre = historia; gana el sin fecha | CL | A§2 | igual |
| 50 | Antes de una cifra, buscarla; si hay dos, preguntar | CL | A§2 | igual |
| 51 | Una promesa que cambia se barre en toda la superficie, también en las reglas | CL | A§2 | condensada; sale la historia del `/register` (ejemplo de agosto, ya corregido) |
| 52 | Verificar es mirar el render | CL | A§2 | condensada |
| 53 | Verificar contra el sistema correcto; peso y tiempo; grep solo descarta | CL | A§2 | condensada |
| 54 | Un dato heredado se recuenta | CL, CX | A§2 | condensada |
| 55 | El login no prueba la base | CL | A§2 | igual |
| 56 | Herramienta visible, hash o plan no prueban ejecución; marcar observado/inferido/desconocido | CX | A§2 | condensada |
| 57 | Construido ≠ terminado; flag apagado no se reporta como hecho | CL | A§2 | condensada |
| 58 | Cerrar antes de abrir; handoff al cerrar | CL, CM | A§2 | condensada |
| 59 | Gate de cierre: probada / delegada / bloqueada con causa | CX, AG, EP | A§2 | condensada |
| 60 | Un solo producto con packs por rubro; nombres viejos | CL, CX | A§3 | condensada |
| 61 | Vocabulario por rubro | CL | A§3 | condensada (la ruta del vocabulario es del repo onia-platform) |
| 62 | Gestios y Ganaderos-Os son legado | CL | A§3 | igual |
| 63 | Se vende el sistema; bot add-on; cero autobombo; medir contra lety/dapta | CL | A§3 | condensada |
| 64 | La venta nunca exhibe obra | CL | A§3 | condensada; 17-oct (2.ª ronda): restituidos la lista completa («en construcción», «próximamente»), «¿Otro rubro? Escribinos» y el contrapeso: solo rige para la venta; docs internos, privacidad, textos legales y lo que se presenta al banco son honestos sobre límites |
| 65 | No fabricar testimonios, logos ni cifras | CL | A§3 | condensada (unida a la anterior) |
| 66 | No hay equipo de ventas; sales-kit; comisiones suspendidas; /vendedores lo baja él | CL | A§3 | condensada |
| 67 | ONIA Core: encender rubro desde el core; orden dental → importadora → resto | CL | A§3 | condensada |
| 68 | Base de producción self-hosted en el VPS | CL | A§3 | igual |
| 69 | Dirección visual: Bench, Garabato, HSB Engineers; solo info relevante | AG | A§3 | condensada |
| 70 | Ejecución cerrada por defecto | AG, EP | A§4 | condensada; el protocolo completo sigue en EP |
| 71 | Data-first antes de preguntar | AG, EP | A§4 | condensada; fuentes de Notion siguen en EP |
| 72 | Completitud: «todo» es todo, muestras marcadas | AG | A§4 | condensada |
| 73 | Autonomía y bloqueos: pedir el permiso que falta ya, agrupado; silencio no es sí | CX | A§4 | condensada |
| 74 | Ejecutar hasta cierre; un bloqueo no frena los otros frentes | CX, AG | A§4 | condensada |
| 75 | No fingir 24/7, no inventar tareas, no decir «activo» sin medirlo | CX | A§4 | condensada |
| 76 | Plan breve antes de deploy, secretos, infra o publicar | AG, EP | A§4 | condensada |
| 77 | Máx. 1 implementador + 1 revisor por lote | CX | A§4 | igual |
| 78 | Carril = 1 sesión/worktree/rama/carpeta | CL, CM | A§4 | igual |
| 79 | Avisar antes de tocar los 4 archivos raíz de web-factory | CL, CM | A§4 | igual |
| 80 | Dueño de archivos de cada carril en COORDINATION_MANIFEST | CL, CM | A§4 | actualizada: se declara en el handoff del carril (el manifest pasa al historial) |
| 81 | Trabajo de otro carril: nota, nunca implementación duplicada | CM | A§4 | condensada |
| 82 | Un carril = un puerto = un `.next`; apagar server al cerrar | CM | A§4 | condensada |
| 83 | Infra tiene turno, uno por vez | CL, CM | A§4 | condensada |
| 84 | `git add` con rutas explícitas, nunca `-A` | CM | A§4 | igual |
| 85 | Calidad de código (inmutable, <50/<800, errores, validación, tests 80 %, revisión, seguridad) | CL | A§4 + C (agentes code-reviewer/security-reviewer) | condensada; sale el detalle web (CSP/SRI, CLS, INP, fuentes, animación, breakpoints): queda LCP. Si hace falta en la nube, va a `onia-frontend`/`onia-verificacion` |
| 86 | `main` siempre compila; entra por PR revisado | CL, CM, CX | A§4 | actualizada: sale «la madre y el integrador lo mueven directo» (integrador muerto); el permiso de la madre queda en C |
| 87 | Si un archivo nuevo importa otro nuevo, van los dos | CL, CM | A§4 | igual |
| 88 | Casing de imports | CL, CM | A§4 | igual |
| 89 | `main` alimenta VPS y Vercel | CL, CM | A§4 | igual |
| 90 | `main` se mueve debajo: BASE + diff antes de concluir | CL | A§4 | condensada |
| 91 | Un aviso por Telegram en cada merge no es la solución | CL | - | eliminada: hablaba del integrador de ~28 commits/día, que ya no existe |
| 92 | Conventional commits con el porqué | CL | A§4 | igual |
| 93 | Autosync hook Stop pushea la rama | CL, CX | C | movida a C |
| 94 | Permiso de fast-forward a main: madre (`ONIA_AUTOSYNC_MAIN` + marca) e integrador (`ONIA_LOOP_ID=onia-cola`) | CL | C | actualizada: queda solo la madre; el integrador onia-cola está muerto |
| 95 | Merge con conflictos nunca abierto al soltar el turno | CL, CM | A§4 | condensada |
| 96 | El hook puede publicar estado a medias: el árbol compila en cada turno | CL | A§4 + C | condensada |
| 97 | El hook no autoriza publicar | CX | C | igual |
| 98 | Nunca buildear producción con `.env.local` | CL | A§4 | condensada |
| 99 | Velocidad: método correcto, `impeccable` antes de UI | CL | A§4 | condensada |
| 100 | Paralelizar lo independiente | CL, AG | A§4 | igual |
| 101 | Verificación fuerte solo en prod, plata o `main` | CL | A§4 | condensada |
| 102 | Lo aprobado no se reabre | CL | A§4 | igual |
| 103 | Publicar sin preguntar lo que pasa los gates (código, migraciones con backup, infra) | CL, AG, EP | A§4 | actualizada: suma «revisión de Codex» (16-oct) |
| 104 | Diseño nuevo/rediseño se publica sin OK de él (9-oct) | CL | A§4 | actualizada: vuelve a pasar por Sergio Urcullo con capturas (corrección suya del 10-oct en CX; hermes-jefa.md 16-oct lo lista) |
| 105 | Textos legales pasan por él | CL (2-oct, sacado el 9-oct), CX | A§4 | actualizada: restituida (hermes-jefa.md 16-oct: «texto legal») |
| 106 | Contenido en redes sale por Buffer sin OK pieza por pieza si pasa control de calidad (8-oct) | CL | A§4 | actualizada: contenido nuevo pasa por él y lo aprobado sale sin re-OK (gates del 12-oct en CX). 17-oct (2.ª ronda): «sin re-OK» rige solo para esa versión, cuenta y calendario; un cambio, otra cuenta, función prometida sin tabla, tercero o competidor nombrado o CTA sin probar (comentario a DM de Instagram, 2 rechazos de Meta) vuelve a él (A§4 «lo visual»). La vía (Buffer, ig-reel.mjs) es operativa: skills de contenido |
| 107 | Gate 12-oct de Codex: «cambios en producción y publicaciones nuevas con OK previo» | CX | A§4 | actualizada: para código manda la regla del 9-oct, confirmada por la orden del 16-oct (latidos publican); queda para contenido, diseño, gasto y accesos. **Resuelta el 17-oct** por decisión de Sergio Urcullo (ver «Decisión del 17-oct» al final) |
| 108 | Siguen con su OK: gasto, contactar, SIAT, cara/voz; actos legales y firmas por Leslie Mercado Moreno | CL, CX | A§4 | condensada |
| 109 | A Sergio Urcullo no se le habla de PRs | CL | A§1 Simple | condensada |
| 110 | Preservar conocimiento en el repo y pushear | AG, CM | A§4 | condensada |
| 111 | «commit all» primero revisa secretos; nunca `.env`, llaves, tokens; solo el nombre de la variable | AG, CM, CL | A§4 | condensada; 17-oct (2.ª ronda): se restablece la lista de lo que nunca se sube (contraseñas, dumps sin limpiar, archivos personales sensibles, datos personales de clientes y de la titular: CI, documentos) |
| 112 | Dónde va cada cosa (tabla) | CL | A§4 | condensada a una línea |
| 113 | Skills de Hermes con nombre en español | CM | A§4 | igual |
| 114 | Docs operativos de repo en inglés y mayúsculas; references para datos máquina | CM | - | eliminada: regla de nombres de junio, contradicha por los docs vigentes (en español) |
| 115 | Si no sabés dónde va, preguntar | CL | A§4 | igual |
| 116 | Cuándo separar un repo | CL | A§4 | condensada |
| 117 | Propuestas: generador, nunca HTML a mano, precios de pricing.ts, no fabricar | CL | A§5 | condensada; las 9 reglas siguen en la skill `onia-propuestas` |
| 118 | Publicidad: trabajo de venta, sin afiches repetidos, UI real, UGC IA sin falso cliente, mirar la pieza completa | CL | A§5 | condensada |
| 119 | Pauta de Onia Platform con la marca de la web, no la personal; pack `referentes` solo para la marca personal | CL | A§5 | condensada; sale la historia de las dos correcciones del 2-oct |
| 120 | Primero la Biblioteca de anuncios, después el diseño; prometer solo lo del catálogo | CL | A§5 | condensada |
| 121 | Desde la nube Facebook no abre: los creativos los captura la madre | CL | A§1 (la madre hace lo de la PC) | condensada |
| 122 | Radar creativo: fuentes actuales antes de contenido; referencias por estructura, no copiar | AG, EP | A§5 | condensada; el flujo sigue en EP y `radar-creativo-onia.md` |
| 123 | Aprendizaje aplicado (X, Hugging Face, NotebookLM: fuentes primarias, licencia, costo) | CX | A§5 Radar | condensada |
| 124 | Intake por evento: cada link nuevo se indexa una vez | CX | A§5 | actualizada: el registro citado (`codex-cloud-pc-20261011.md`) no existe en origin/main; se usa la skill `onia-continuidad`/`aprender-de-todo` |
| 125 | Higgsfield: fuente operativa y docs de Lucía | CL | A§5 | condensada a la carpeta de Lucía |
| 126 | CLI oficial + skills; web solo identidad y QA; no automatizar la web desde el VPS | CL | A§5 | condensada (el «MCP para agentes de chat» sale: no aplica a Codex ni a Claude Code) |
| 127 | API de Higgsfield para una fábrica futura; no mezclar saldo API con créditos del plan | CL | - | eliminada: describe algo que no existe; se escribe cuando exista |
| 128 | Flujo de Lucía (derechos → banco → Soul → A/B → still → video → QA) | CL | doc HIGGSFIELD_VIDEO_SYSTEM.md | eliminada de las reglas: el propio doc dice que el A/B contra los Elements «quedó sin objeto»; manda el doc |
| 129 | `generate cost` antes de `create`; nunca `auth token` en logs, chats o scripts | CL | A§5 | condensada (antes decía «igual»); 17-oct (3.ª ronda): restituidos «en logs, chats o scripts», «guardar modelo, params y costo» y «bitácoras y saldos antiguos no autorizan gasto» |
| 130 | IDs, modelos y saldos se resuelven en vivo | CL | A§5 | igual |
| 131 | Gasto Higgsfield: lotes chicos autorizados; grandes, video y Soul con su sí; cara/voz también con Leslie | CL | A§5 | condensada |
| 132 | Tabla de cortes + preview 360p antes del master | CL | A§5 | condensada |
| 133 | ver-videos/editor-videos; HyperFrames del repo gana sobre la global | CL | A§5 | condensada; corregida 17-oct (2.ª ronda): AGENTS dice «HyperFrames del repo gana sobre la global»; la ruta `.claude/skills/hyperframes*` y su copia `.agents/skills/` sí existen en origin/main |
| 134 | sacar-prompt: recuperar vs reconstruir; UGC vs cine | CL | skill `sacar-prompt` | movida: el método vive en la skill; A§5 la nombra |
| 135 | Rostro de Sergio generado no se publica sin aprobación | EP | A§5 + EP | igual |
| 136 | Puntero «¿Venís a continuar la 1.0 (Codex)?» | AG | - | eliminada: estado de un día, no regla; la 1.0 se sigue por hermes-jefa.md |
| 137 | «Empujar una rama `claude/*` la publica» | AG | - | eliminada: lo hacía el integrador onia-cola, muerto |
| 138 | Codex = ejecutor de la madre vía `scripts/codex-tarea.sh`; «PARA LA MADRE: …» | AG | A§1 | actualizada: 16-oct Codex revisa PRs. 17-oct (2.ª ronda): sale «respaldo de cupo» y las ramas `codex/*`; Codex solo revisa (no orquesta, no abre sesiones, no mergea ni empuja; no revisa borradores) y a `main` une solo la jefa con CI verde y revisión de Codex (SISTEMA §3, §5, §9) |
| 139 | Cola de tareas de Codex en `codex-relevo.md` | AG | - | eliminada: Codex dejó de ser ejecutor con cola propia |
| 140 | Effort medio, sesiones cortas | AG | doc MR | movida: es parámetro de modelo, vive en MR |
| 141 | Flujo obligatorio (leer COORDINATION_MANIFEST primero, etc.) | AG, CSR, CX | A§1 Arranque | actualizada: el manifest pasa al historial; se lee cola + handoff del carril |
| 142 | Agentes por frente (checklist de 10 frentes) | AG | - | eliminada: duplicaba `equipo-de-agentes` |
| 143 | Sin subagentes, simular la delegación en pasadas | AG | - | eliminada: hoy hay hilos y subagentes siempre |
| 144 | Mínimo para tareas pequeñas (plan de una línea) | AG | A§4 Plan breve | condensada (el plan solo se exige en deploy, secretos, infra o publicar) |
| 145 | Límites (no imprimir secretos, no duplicar, no deploy sin validar) | AG | A§1, A§2, A§4 | condensada |
| 146 | Cierre de cada tarea: qué, frentes, validación, pendiente | AG | A§2 gate de cierre + A§1 Simple | condensada |
| 147 | Tabla de skills de ONIA para Codex | AG | skill `onia-router` | eliminada: duplicaba el índice de `onia-router` |
| 148 | Hermes orquesta una sola cola; no segundo controlador | CX | A§1 | condensada |
| 149 | Ruta preferida: Codex Cloud y Claude Code Cloud; PC apagada preferida | CX | A§1 | condensada («todo sigue con la PC apagada», hermes-jefa.md 16-oct) |
| 150 | No sustituir por ChatGPT Work, VPS ni API facturada de Claude sin decisión | CX | A§1 «Descartado» | corregida 17-oct (2.ª ronda): no es solo gasto sino términos de servicio. AGENTS lista lo descartado (SISTEMA §9: harness propio de Codex, Hermes Agent como jefe, Warp Oz, dots, Grok Bot, Muse), prohíbe la suscripción de Claude desde otro programa y la API facturada, y manda preguntar a Sergio Urcullo si algo vuelve a proponerse |
| 151 | Warp visor pasivo; Orca «para después» | CX | A§1 | actualizada: Orca ya es el tablero de la PC (skill `orca`, 16-oct). 17-oct (2.ª ronda): sale «Warp: visor» (sin fuente del 16-oct; Warp Oz está descartado en SISTEMA §9) |
| 152 | Reusar `pedido-claude.sh`/`respuestas-pedidos.sh`; no crear otro puente | CX | A§1 | actualizada 17-oct (2.ª ronda): sale el nombre del script (el pedido por Telegram está apagado, SISTEMA §8); queda `scripts/hermes/jefa.sh` y «nada de otro scheduler, cola ni puente». Horas y estado de las rutinas salen de las reglas: viven en `docs/handoff/madre-control.md` |
| 153 | Distinguir herramienta ausente de capacidad de producto | CX | A§2 | condensada |
| 154 | Estados del día van al handoff, no a la política; recibos inmutables | CX | A§1 Skills («el handoff es estado») | condensada; «recibos inmutables» sale: era de la fase de recuperación Codex Cloud |
| 155 | 2 madres locales + 5 ejecutores Codex Cloud (12-oct) | CX | - | eliminada: obsoleta (16-oct, jefa en la nube + una madre) |
| 156 | Canal único de avisos = Telegram como PROPUESTA; no usar Claude Code por falta de cuota | CX | - | eliminada: obsoleta, la jefa es Claude Code y Hermes Agent es el teléfono |
| 157 | Git del worker según contrato; no inferir main/merge/deploy | CX | A§4 | condensada |
| 158 | npm por lockfile ya autorizado; nada de apt/pip globales por inferencia | CX | A§1 (instalar con OK) | condensada |
| 159 | Loops: no crear nuevos ni reactivar históricos; IDs viejos no son activos | CX, CM | A§1 | condensada |
| 160 | Plan de recuperación en `codex-cloud-pc-20261011.md` | CX | - | eliminada: la ruta no existe en origin/main y la fase cerró |
| 161 | PR, docs o tests no prueban el resultado de negocio | CX | A§2 Nada a medias | condensada |
| 162 | Elegir la skill nombrada o la más específica; conjunto mínimo | CSR | skill `onia-router` | movida |
| 163 | Limpieza de skills del 29-sep | CSR | - | eliminada: revertida el 2-oct |
| 164 | Lista de skills globales de openai/skills y matriz de uso | CSR | EP (skill routing de Codex) | eliminada de las reglas: inventario de máquina; EP conserva su lista |
| 165 | Session A / Session B | CSR, CM | - | eliminada: modelo de junio |
| 166 | Ruta `HERMES_EXECUTION_PROTOCOL.md` | CSR | A§4/A§5 → `docs/EXECUTION_PROTOCOL.md` | actualizada: ruta corregida |
| 167 | Skills locales de Hermes (lista) | CSR | skill `onia-router` | eliminada: índice duplicado |
| 168 | Avisar si hay que reiniciar Codex para cargar skills | CSR | - | eliminada: detalle de runtime, no regla |
| 169 | EL HILO: sesiones vivas, IDs y mensajes pendientes (29-30 sep) | CM | - | eliminada: el propio manifest la marcó historia el 9-oct |
| 170 | Telegram a Sergio Urcullo solo por `onia-tg.sh` (silencio 22-06:30, bloques del calendario) | CM | skill `onia-hermes-jarvis` + `scripts/loops/onia-tg.sh` | movida: vive en la skill; verificar si sigue vigente con Hermes Agent como teléfono |
| 171 | Agendar en su calendario con `onia-agenda.sh --si` | CM | - | corregida 17-oct (2.ª ronda): sí existen `scripts/loops/agenda.sh` y `hermes-content/skills/agenda-calendario.md` en origin/main (verificado con `git cat-file`). Queda en A§1 «Conectores»: su calendario cambia solo con su sí a ese cambio. La eliminación anterior era falsa |
| 172 | Declaraciones de carriles 21-28 sep (marca personal, guiones, tandas, infra) | CM | - | eliminada: carriles cerrados, historia |
| 173 | Tabla de 8 ramas del 23-ago | CM | - | eliminada: historia |
| 174 | Modelo de carriles A-H del 5-jul y carril L | CM | - | eliminada: histórico, ya superado en el propio manifest |
| 175 | Listas de archivos canónicos de Session A/B | CM | - | eliminada: inventario de junio |
| 176 | Rutas de Nuvia y del design stack | CM | - | eliminada: índice de un cliente y ruta de máquina, no regla |
| 177 | Comandos de deploy (`npm run deploy:*`, video-lab, hermes-command) | CM, CSR | `package.json` + EP | movida: son comandos, no reglas |
| 178 | Estado validado de junio (asset server, crons, Supabase, LiteLLM) | CM | - | eliminada: foto de junio vencida |
| 179 | Rotar la clave del VPS y el token de Meta pegados en el chat | CM | - | reabierta 17-oct (2.ª ronda): la rotación sí consta como pendiente abierto (ONIA_PENDIENTES_PARA_LANZAR.md, ONIA_N8N_AUTOMATIONS_LIVE_2026.md, ONIA_INFRA_LIMPIEZA_Y_ORDEN.md y handoff/madre-control.md §6.6, según la revisión; líneas no recontadas aquí). AGENTS §4 Seguridad: las rotaciones abiertas se listan en un handoff y no se pegan secretos en chat ni docs; rotar en un panel con su login es de él (A§4 «Qué se le dice») |
| 180 | Secretos solo en `/root/.hermes/.env`; verificar por presencia o largo | CM | A§1 (presencia o largo) | condensada; la ubicación del VPS sale (dato de junio, sin verificar hoy) |
| 181 | Protocolo de trabajo paralelo (abrir, editar, cerrar carril) | CM | A§4 Carriles + A§2 + C | condensada |
| 182 | Colas en loop con `/loop`; cola vacía → sacar las 3 siguientes | doc cola/loop/README.md | C (`/loop`) + README | condensada; el README sigue |
| 183 | Plan visible en la app con estado y criterio de hecho | skill onia-sesion-madre | C | movida a C |
| 184 | Workflows solo si Sergio Urcullo optó, con `workflow-authoring` | (nueva, pedido) | C | nueva |

## Para integrar (no lo hace este paso)

- `hermes-content/docs/EXECUTION_PROTOCOL.md`, `hermes-content/docs/cola/loop/README.md` y varias skills citan `CLAUDE.md` §«Qué se publica sin preguntar» o «§1 Sesión MADRE»: apuntarlas a `AGENTS.md` §4 y §1.
- El README de colas dice «también el diseño» se publica sin esperar (9-oct): contradice la fila 104.
- Fila 107: resuelta el 17-oct (ver «Decisión del 17-oct» al final).
- Fila 16: si Codex necesita la lista de las 6 skills de `onia-platform`, va en `AGENTS.md` y sale de `CLAUDE.md`.
- (17-oct, 2.ª ronda) Editar `hermes-content/docs/EXECUTION_PROTOCOL.md` L33-37 en el MISMO PR que las reglas: hoy dice que diseño, infra y migraciones no esperan otro OK y contradice AGENTS §4 «Quién decide»; debe citarlo. Hasta entonces AGENTS §5 limita el puntero a comandos y fuentes.
- (17-oct, 2.ª ronda) `docs/ONIA_SISTEMA_AUTONOMO.md` §3 dice «Opus 5.5, esfuerzo medio» y `handoff/madre-control.md` §6.3 dice «coordinador en Sonnet 5.5»: corregir §3. Si Sergio Urcullo confirma Higgsfield/Meta Ads en rutinas (ver abajo), cambiar también §7 «Cuidado» y la fila de §8 «Una rutina gasta sin preguntar».
- (17-oct, 2.ª ronda) `.agents/skills/` (30 copias) sin dueño de sincronización: decidir quién las regenera o dejar de versionarlas.

## Correcciones del 17-oct (antes de mostrárselo a Sergio Urcullo)

Salen de `REVISION.md` (P0 1-4) y de 3 reglas medidas el 17-oct. Los originales quedan en `AGENTS.antes.md` y `CLAUDE.antes.md`.

- **P0-1** Higgsfield: CLI o conector MCP; cotizar siempre; mismas reglas de gasto. Higgsfield y Meta Ads nunca en rutinas automáticas; Meta Ads sin OK no crea ni gasta (AGENTS §5, CLAUDE).
- **P0-2** «Antes, a Sergio Urcullo» suma datos reales de producción, precios/cifras de venta y borrado destructivo sin copia (AGENTS §4).
- **P0-3** La cola `hermes-jefa.md` registra la orden de él; no afloja Credenciales ni «Antes, a Sergio Urcullo» (AGENTS, línea 3).
- **P0-4** Nueva viñeta «Seguridad» (secretos, `service_role`, SQL parametrizado, HTML sanitizado, CSRF, rate limit, CSP/SRI, rotar lo expuesto, redactar exports de n8n, revisión antes de mergear) y métricas web (AGENTS §4).
- **Nueva** A él le habla solo la jefa o la madre: máx. 3 líneas, lo PUBLICADO o UNA decisión por vez. Reemplaza «UNA lista diaria» (16-oct) y el formato de 3 bloques.
- **Nueva** Subagentes con `model` explícito: haiku lee/cuenta/verifica, sonnet escribe (uno por grupo de archivos), opus decide lo riesgoso (AGENTS «Modelo por rol»; CLAUDE).
- **Nueva** PASO 0 en la nube: `cd` al repo y cargar `onia-router` con la herramienta Skill (AGENTS «PASO 0»; CLAUDE).

Siguen abiertos (no tocados): P1 #5-#12, P2 (referencias colgantes) y P3 de `REVISION.md`; filas #19, #133 y #171 de esta tabla (falsas según la revisión).

## Decisión del 17-oct (Sergio Urcullo, textual)

«Quiero que todo lo que sea visual o cosas serias yo decido, pero si tiene cosas técnicas no me lo digas y aceptalo, porque sabes que no lo entiendo, solo hago vibe coding».

- **Resuelve la fila #107:** el código revisado y probado se publica sin su OK y sin avisarle. El gate del 12-oct de Codex queda superado para lo técnico.
- **Una sola regla:** `AGENTS.md` §4 «Quién decide» reemplaza a «Publicar sin preguntar» + «Antes, a Sergio Urcullo». Técnico (código, infraestructura, revisiones, merges, migraciones con backup, configuración, herramientas) = se decide y se publica sin consultarle ni contárselo, si pasa los gates y se mira en producción. Visual (diseño nuevo, rediseño de algo vivo, piezas de contenido, su cara o voz) y serio (legales, precios o cifras, gasto, clientes o terceros, datos reales de producción, borrado sin copia, SIAT y banco) = antes a él.
- **Citas ajustadas para no contradecir:** `AGENTS.md` línea 3 (apunta a «Quién decide»), §1 Simple (lo técnico no se le cuenta; solo lo publicado que él ve o una decisión por vez), §4 Ejecución cerrada (preguntas y permisos solo los que le tocan a él; los técnicos los resuelve la jefa o la madre), §4 «Dónde va cada cosa» (si dudás, a la jefa). `CLAUDE.md`: puntero a esa regla y fuera «así sigue el avance Sergio Urcullo». `RESUMEN_PARA_SERGIO.md`: línea 3 ajustada y última línea reemplazada.
- **Lo que NO se aflojó:** Credenciales (§1) sigue pidiendo su OK para cuenta nueva o instalar/descargar una herramienta; la decisión dice «herramientas» pero esa regla es suya y de seguridad. Si quiere que instalar también sea técnico, lo dice y se cambia en una línea.
- **Sin tocar:** `REVISION.md` (línea 124 aún menciona #107 como pendiente: es el informe previo, queda como historia) y `AGENTS.antes.md`/`CLAUDE.antes.md`.

## Correcciones del 17-oct, 2.ª ronda (hallazgos de la revisión)

AGENTS.md pasa de 15.014 a 16.916 bytes (con CRLF; unos 90 menos con LF), por encima del objetivo de ~16 KB. Para volver a ~16 KB hay que sacar otro bloque entero; ver «Recortes por tamaño». CLAUDE.md y RESUMEN_PARA_SERGIO.md se ajustan para no contradecir.

**Credenciales (AGENTS §1)**
- Restituidas las prohibiciones duras (volcar/exportar, clave maestra, Google/consentimiento/MFA/desbloqueo/sesión caducada, sesiones permanentes, perfiles, VPS no aloja la bóveda) y «descargar o instalar» con qué, de dónde y para qué. La ruta de la bóveda queda en la skill (no en AGENTS).

**Quién decide (AGENTS §4)**
- Frontera técnico/visual: técnico = arreglo, texto o feature que no cambia composición, jerarquía ni flujo de una pantalla viva; visual = pantalla o sección nueva, composición o jerarquía distinta, cambio de marca, pieza de contenido. «Ante la duda, es visual.» Reemplaza «si cambia lo que ve un cliente o él, es visual».
- «Qué se le dice»: excepciones aunque sean técnicas, en 1 línea: incidente de seguridad (secreto expuesto, acceso indebido, caída de producción con clientes, riesgo legal) y lo que solo él puede ejecutar (rotar una clave en un panel con su login, MFA, pagos, SIAT, banco), como UNA decisión con los pasos mínimos. Se aclara que «lo irreversible» es lo que se le pide aprobar. Esto matiza su frase del 17-oct («lo técnico no me lo digas»): **pendiente que Sergio Urcullo confirme el alcance**; RESUMEN_PARA_SERGIO.md se lo pregunta.
- Una sola regla: se quita «Lo técnico no se le cuenta» de §1 Simple y la duplicación de §4 Ejecución cerrada; CLAUDE.md queda con punteros (Subagentes, Revisión, Conectores y rutinas, Qué se le consulta).
- Contenido aprobado: «sin re-OK» solo para esa versión, cuenta y calendario (ver fila 106).

**Higgsfield y Meta Ads en rutinas (contradicción AGENTS/CLAUDE/CAMBIOS)**
- Se deja la postura estricta en todos lados: **no se conectan a rutinas automáticas** (SISTEMA §7: «sacar esos conectores de la rutina»; una rutina sin humano no puede pedir su sí). AGENTS §5 deja de decir «pueden quedar conectados»; CLAUDE.md apunta a AGENTS; RESUMEN_PARA_SERGIO.md cambia «siguen conectados (lo decidiste hoy)» por la postura estricta.
- Motivo: la supuesta decisión del 17-oct solo figuraba en RESUMEN, sin frase textual en CAMBIOS ni en el handoff. **Pendiente:** si Sergio Urcullo confirma con sus palabras que sí quiere los conectores en rutinas, registrar su frase aquí, volver a la versión permisiva en AGENTS §5 y corregir SISTEMA §7 y §8.

**Codex, rutinas y proveedor (AGENTS §1)**
- Codex solo revisa (filas 138 y 150); a `main` une solo la jefa (también en §4 Git). Rutinas sin horas ni nombre de script; sin «Opus coordina» (el modelo del coordinador vive en SISTEMA §3); sin «Warp: visor»; «Descartado» con la lista de SISTEMA §9; «Nunca en la nube ni en ninguna sesión» y «Conectores que sí llegan» con reglas por conector.
- Skills: `.agents/skills/` existe; AGENTS dice que son copias para Codex y no se editan.

**Dominios y otros**
- Onia vende software (fila 34), precios (fila 44), venta no exhibe obra (fila 64), preservar (fila 111), rotación de claves (fila 179) y las filas 19, 133, 150, 151, 152 y 171, corregidas en la tabla.
- AGENTS §5 «Telegram, Video Lab, Notion»: el puntero a `EXECUTION_PROTOCOL.md` se limita a comandos y fuentes; en aprobaciones manda §4 (ver «Para integrar»).

**Recortes por tamaño (para entrar en ~16 KB)**
- Sacados de AGENTS: «Velocidad» pasa a una frase dentro de «Calidad»; «Base de producción» se une a «ONIA Core»; «Separar un repo» se une a «Dónde va cada cosa»; «Plan breve» se une a «Ejecución cerrada»; fuera la ruta de la bóveda, el comando del generador de propuestas, `habla a la nube con "msg"`, la ruta `.claude/skills/hyperframes*` y dos frases históricas («Mezclar metas pierde el hilo», «Lo escaso son clientes»). Ninguna regla se eliminó.
- Si hace falta bajar más: mover «Radar creativo» y «Telegram, Video Lab, Notion» a `EXECUTION_PROTOCOL.md`.

## Correcciones del 17-oct, 3.ª ronda (hallazgos de la revisión de las dos primeras)

AGENTS.md pasa de 16.834 a 22.989 bytes (límite de lectura de Codex: 32 KiB). CLAUDE.md, de 2.320 a 3.286. El objetivo de ~16 KB de la 2.ª ronda cedió ante restituir lo que la revisión probó perdido; cada regla mantiene una línea de porqué.

**Quién mueve `main` (AGENTS §4 «Quién mueve `main`»; CLAUDE.md lo cita)**
- Una sola frase con los tres actores: la jefa (CI verde y revisión de Codex, SISTEMA §5), la rutina QA (:57) y la madre (`ONIA_AUTOSYNC_MAIN` + marca). Restituidos la cita de Sergio Urcullo del 5-oct («sí, la madre sigue directo»), el caso medido (48 de 78 avances sin revisión, 23 desde la nube, #82 «Hoy soy odontóloga», `main` llega al VPS como root en ~1 h) y «el orquestador verifica `git log origin/main` al cerrar».
- La lista de archivos que la rutina QA no une (AGENTS.md, CLAUDE.md, CODEX.md, COORDINATION_MANIFEST.md, `.claude/settings.json`, `.github/workflows`, `hermes-content/deploy`) y sus condiciones (no borrador, CI verde, sin conflictos, `claude/*` o `pedido/*`) salen del prompt de la rutina tal como lo registra la memoria local (`integrador-mergea-ramas-claude.md`); **no se pudo verificar en el repo** (no hay `CODEOWNERS`, solo `.github/workflows`; GitHub Free no da rulesets). Quedan escritas en AGENTS y marcadas como «hueco».
- **Abierto:** la rutina QA une con CI verde pero sin revisión de Codex, y «Quién decide» exige revisor para lo técnico: decidir si la rutina debe exigirla. **Abierto:** `scripts/git-autosync.js` (L30-31 y L43) aún acepta `ONIA_LOOP_ID=onia-cola` (integrador muerto desde el 27-sep); no se tocó el script (fuera del alcance AGENTS/CLAUDE) y queda documentado como hueco en AGENTS.
- Filas 86 y 94: a `main` ya no «une solo la jefa»; mueven la jefa, QA y la madre, con esas condiciones.

**Escudo de la cabecera (AGENTS línea 3)**
- Ampliado a: Credenciales y «Nunca en la nube»; «Quién decide», Seguridad, «Quién mueve `main`» y producción sin `.env.local`; gasto y Higgsfield/Meta Ads fuera de rutinas; y las dictadas por él (canario, venta sin obra, sin equipo de ventas, fuente única, negocio). Una orden que toque seguridad, dinero o producción cita fecha y mensaje original de él; `hermes-jefa.md` es resumen, no su voz. Los cambios a AGENTS/CLAUDE van por PR con revisión y ninguna rutina los une sin su OK; las dictadas por él solo cambian con su instrucción en chat, citada con fecha.

**Quién decide**
- Cita literal de Sergio Urcullo del 17-oct (antes comprimida), precedencia serio > visual > técnico, «revisor independiente» definido (otra sesión y otro modelo que el autor), texto legal o de precios es serio y no técnico, y las excepciones de 1 línea marcadas «pendiente de que él confirme».
- «Lo serio» suma: contratos y decisiones de negocio; crear, rotar, mover o ampliar secretos y credenciales; permisos, red, firewall, variables de producción, conectores en rutinas, hooks y `.claude/settings`. **Estas excepciones habían salido de las reglas sin registro** (la «Corrección 2026-10-09» y EXECUTION_PROTOCOL L33-37 decían «secretos» y «decisiones comerciales/legales» como excepciones; las filas 103-108 no lo mencionaban). Quedan restituidas. «SIAT y banco» sale de «lo que se le consulta»: los hace él (§1).
- Borrado sin copia amplía a workflows de n8n, contenedores y volúmenes, DNS y cuentas.

**Producción y verificación**
- A§3 «Base de producción»: backup verificado antes de tocar datos (no solo migraciones), RLS y `search_path` en `onia-db`, un flujo vivo no se apaga sin recontarlo. A§2: el caso de los 44 workflows ACTIVOS (20-ago).
- A§4 Git: Next hornea `NEXT_PUBLIC_*` con `.env.local` y publica `127.0.0.1`; el hook Stop puede publicar estado a medias.

**Credenciales y conectores**
- A§1: «Nunca en la nube» (sin «ni en ninguna sesión, tampoco la madre»); en la PC la madre usa solo el puente y las sesiones autorizadas, sin leer ni volcar. Restituidos reutilizar el navegador y el perfil persistente, usar la credencial por el puente sin imprimirla, verificar bóveda y puente antes de afirmar acceso y no crear un contexto efímero por tarea. Fila 42: «ampliada» deja de ser exacta; ahora distingue nube y PC.
- Conectores: «leer es libre» pasa a «leer solo lo que la tarea necesita; no copiar contenido personal, de clientes o bancario a repo, chats ni handoffs» (caso: el clasificador frenó el borrador del BCP, `madre-control.md` §5). n8n y Vercel son técnicos salvo secretos, permisos y variables de producción.
- «Madre instala» pasa a «instala el sistema ya aprobado; un componente nuevo, con OK».

**Higgsfield, video y publicidad**
- Higgsfield (fila 129): ver arriba. Aclarado que los lotes chicos de imagen no piden sí; la web, manual y sin Playwright desde el VPS.
- Tabla de cortes + preview 360p: vuelve «a Sergio Urcullo ANTES de aplicar el corte» (alinea con `editor-videos` L87-88 y L263). Ya estaba aflojada en `origin/main` con «revisados por el carril» (9-oct); no se restituye esa versión.
- Publicidad: restituidos el pack `referentes` solo para la marca personal (D1 y D4 v2), el test de cambiar el rubro, producto visible con UI real, presentador IA sin cambio silencioso ni falso cliente u odontólogo, y mirar la pieza completa. `hermes-content/skills/carruseles-onia.md` **no** contiene estos puntos (solo nombra el pack en la línea 4): quedaron en AGENTS.
- Promesas: «no se promete lo inexistente; solo lo que el catálogo marca vivo y verificado»; el catálogo trae su estado (vivo / construido sin probar / futuro). Caso: `handoff/madre-v2-revision.md` (D4).

**Calidad y seguridad (fila 85)**
- Añadidos: entrada de usuario como disparador de revisión de seguridad, «si un test falla se arregla la implementación», HIGH avisa, integración y E2E del flujo crítico, y el detalle web (≤2 fuentes, solo `transform`/`opacity`, capturas 320/768/1024/1440, teclado, reduced-motion). Las skills `onia-frontend`/`onia-verificacion` viven en el repo `onia-platform` y no se verificaron aquí: el detalle queda en AGENTS.

**Simple (fila 24)**
- Reescrita: contesta el hilo al que él escribe; los demás no le inician mensajes. Formato único de 3 bloques (Pasó, Necesito, Sigue) como `equipo-de-agentes` §6, que suma «seguridad y lo irreversible, claros». Se quita la atribución del «me pierdo» a la regla de voces (esa regla es de la 2.ª ronda, sin cita suya). Restituidos «el trabajo por detrás NO se achica» y la cita del 1-oct.

**Historias restituidas (cabecera «una regla sin su porqué se desobedece»)**
- Objetivo por sesión (20-jul), el negocio (5-sep: «una empresa, de verdad»; 9 líneas, 8 worktrees, 0 clientes), venta sin obra (20-ago, cita y los cinco «muy pronto»), sin equipo de ventas («primero existe la persona, después el documento» y la lista prohibida), autoconocimiento (1-oct), cambio de sesión (4-sep, «absolutamente todo», lo en vuelo con su riesgo), canario (cita del 4-sep y «ni el usuario»).

**Contradicciones entre archivos**
- `.claude/skills/equipo-de-agentes/SKILL.md` §5 y §6, `.claude/skills/onia-ventas-pauta/SKILL.md` L689, `.claude/skills/diseno-contenido-onia/SKILL.md` L12 y `hermes-content/docs/cola/loop/README.md` L20 y L31: dejan de decir «se sube sin esperar, incluido el diseño» y remiten a «Quién decide». `hermes-content/docs/EXECUTION_PROTOCOL.md` punto 5 suma secretos, permisos, red y decisiones de negocio a lo serio y la precedencia. Barrido de «sin esperar», «se sube nomás», «sin otro OK» y «sin re-OK» en `.claude/skills`, `.agents/skills`, `hermes-content/docs/cola`, `hermes-content/skills` y `scripts/loops`: sin más coincidencias vigentes (quedan dos menciones históricas en `cola/loop/hermes-jarvis.md` L493 y L986, que cuentan la contradicción). `.agents/skills/` no tenía copias de estas cuatro skills.
- CLAUDE.md: `/loop` queda como temporizador de la sesión (no crea triggers, rutinas ni colas; gasta cupo; ante un tope se baja el consumo), coherente con «Nada de otro scheduler».

**Referencias a CLAUDE.md**
- `scripts/loops/BLOQUE_MEMORIA_COMPARTIDA.md` y 15 prompts de `scripts/loops/prompts/` mandaban a guardar reglas nuevas «en `CLAUDE.md` del repo»: ahora `AGENTS.md`. También `hermes-content/deploy/hermes-agent/SOUL.md` L136, `.claude/skills/onia-router/SKILL.md` (L32, cabecera de reglas duras, bullet de auto-sync y gasto), `hermes-content/docs/TELEGRAM_COMMAND_CENTER.md` §7 y las cinco pantallas del deck `scripts/decks/yt-octubre-2026.mjs` (título y slug del video siguen igual: es el concepto).
- CLAUDE.md suma un índice «Citas viejas»: las secciones §1-§5 coinciden en número con AGENTS y cada nombre de regla viejo apunta a su sección nueva. Quedan sin tocar unos 300 archivos (docs de cola, handoffs, historial) que citan «CLAUDE.md §N» o un nombre de regla; el índice los cubre.
- **Sin tocar, a decidir:** `.claude/skills/onia-router/SKILL.md` aún dice «Codex entrega a la madre; no ejecuta Git» y «La madre integra» (obsoleto desde el 16-oct); `COORDINATION_MANIFEST.md` sigue en la raíz aunque la fila 80 dice que pasa al historial.

## Correcciones del 17-oct, 4.ª ronda: hallazgos de Codex (commit b02a8dc, PR #226)

Codex marcó tres hallazgos; se corrigen en un solo commit, sin pushear todavía.

**P1 - `scripts/git-autosync.js` empujaba `main` aunque la regla nueva dice «solo por PR con CI verde y revisión de Codex»**
- Quitados: el push directo a `main` (con `ONIA_AUTOSYNC_MAIN=1` + marca `onia-autosync-main`, es decir, también el de la madre en la PC), la identidad retirada `ONIA_LOOP_ID=onia-cola`, el fast-forward de la rama actual a `main` (paso 5) y, con ellos, el `tsc` de `compilaParaMain` que solo servía a ese camino. `puedeMoverMain`, `MARCA_MAIN`, `appCompiles` y `compilaParaMain` ya no existen; el script no lee ninguna de las dos variables.
- Conservado: commit + push de la RAMA actual, todas las guardas (merge sin resolver, rutas sin mergear, `.gitignore`, comandos de git sin shell, HEAD desacoplado, sin remoto), la rama de rescate `claude/autosync-<id>` para una sesión parada en `main` (el trabajo no se pierde ni va a `main`) y la salida con código 0.
- Parada en `main`, el hook dice en una línea «main solo por PR». Decisión a revisar: sigue empujando la rama de rescate (no `main`), porque sin ella una sesión de la nube que suelta el turno en `main` perdería el trabajo; si Sergio Urcullo o Codex prefieren «no pushear nada en `main`», se quita `rescatar()` y se pierde esa red.
- `scripts/loops/pedido-rama.test.mjs`: de 24 a 28 pruebas. Prueban que (a) parado en `main` no se pushea `main` (con y sin variables), (b) una rama `claude/*` sí pushea su rama, (c) ni `ONIA_LOOP_ID=onia-cola`, ni `ONIA_AUTOSYNC_MAIN=1` con la marca puesta, ni valores parecidos habilitan algo, (d) no hay fast-forward de otra rama (ni de `main` ni de una rama ajena). Contra el script anterior fallan 12; contra el nuevo pasan las 28.
- `AGENTS.md` §4 «Quién mueve `main`» y `CLAUDE.md` (mecánica): la madre ya no empuja `main`; el hueco de `onia-cola` queda solo en `.githooks/pre-push` de los clones del VPS. **A confirmar con Sergio Urcullo:** el 5-oct dijo «sí, la madre sigue directo»; esta ronda quita esa excepción por el hallazgo de Codex. `.gitignore`: comentario de `settings.local.json` puesto al día.

**P2 - skills obligatorias contradecían el modelo nuevo (jefa coordina, madre = control de la PC, Codex = revisor)**
- `.claude/skills/equipo-de-agentes/SKILL.md`: descripción, tabla §1 (filas Jefa, Madre, Sesiones, Codex), §3 (ronda de vigilancia; PR «listo» sin revisión de Codex pide `@codex review`) y §4/§4 bis (el despacho a Codex y «Codex al máximo» pasan a «Codex revisa»; lo del 9-oct queda marcado como histórico). §5 ya remitía a «Quién decide» (17-oct) y se dejó como estaba.
- `.claude/skills/onia-router/SKILL.md`: paso 4 de «Cómo usar», stack común (sin «encargo de la madre»), fila de referencia recibida (sin Codex como subagente), reglas duras de carriles, `main` y Git (sin «Codex entrega a la madre», sin «La madre integra», sin «FF de `main`»), nota del autosync y las dos líneas del índice de skills.
- **Estado: NO aplicado en el repo** (ver «5.ª ronda»: el parche ya viaja en el PR). Esta sesión no puede escribir en `.claude/skills/` (la herramienta lo rechaza como configuración del proyecto). No hay copias de estas dos skills en `.agents/skills/`.
- Las notas históricas de `onia-hermes-jarvis/SKILL.md` (L120-134, L376-382) y el permiso de `onia-sesion-madre/SKILL.md` (L192-212, la marca del git-dir) siguen describiendo el permiso de `main` que ya no existe: mismo bloqueo; en la 5.ª ronda entran en el parche.

**P2 - protocolos de publicación**
- Verificado: `hermes-content/docs/cola/loop/README.md`, `hermes-content/docs/EXECUTION_PROTOCOL.md` y `.claude/skills/equipo-de-agentes/SKILL.md` §5 ya no dicen que el diseño o lo visual se publica sin esperar.
- Completados los huecos: la lista de lo visual suma «rediseño de algo vivo» y «su cara o su voz» (README de colas y protocolo de ejecución); el README de colas ya no dice «mergeada» (a `main` solo por PR) y la línea «Codex ejecuta solo el encargo cerrado» pasa a «Codex solo revisa»; el protocolo de ejecución cambia «mother's review loop» por la coordinación de la jefa.

## Correcciones del 17-oct, 5.ª ronda: la revisión de las 4 primeras (PR #226)

La revisión pidió alinear todo lo que un arranque normal todavía lee. Se corrigió en este commit; lo único que no se pudo
escribir en el repo son las skills (ver «Parche de skills»).

**Docs y colas alineados con `AGENTS.md` §1/§4** (banner «HISTÓRICO» o «Superado en parte» y corrección de las líneas vivas):
- `cola/README.md`, `cola/loops.md`, `cola/EQUIPO.md`, `COLA.md`: fuera la pre-autorización de mergear a `main` (29-ago) y
  `onia-cola` marcado MUERTO desde el 27-sep (no se rearma; ningún loop se compara contra esa lista).
- `LUCIA_COMO_SE_USA.md` §1 y §3, `cola/loop/lucia.md`, `cola/loop/marca-personal.md`, `handoff/marca-personal.md`: «lo revisado ya
  está aprobado» y «publicar sin OK pieza por pieza» pasan a «el control de identidad y el QA son gates previos; sale lo que
  Sergio Urcullo aprobó (versión, cuenta y calendario)».
- `cola/loop/plataforma.md`: el hilo deja el PR en «listo»; lo une la jefa o QA; #124 (texto legal) va antes a Sergio Urcullo.
- `cola/loop/madre.md` (D, J, C1/C2, I1 y la ronda), `cola/loop/hermes-jarvis.md` y `handoff/hermes-jarvis.md` (lo une la jefa o QA;
  el permiso de autosync, histórico y sin efecto), `handoff/madre-local.md`, `handoff/onia-1.0-nube.md` (regla vigente completa
  de «lo visual» y «lo serio»), `ONIA_EQUIPO_DE_AGENTES.md`, `ONIA_HARNESS.md`, `ONIA_EQUIPOS_POR_SESION.md`, `HERMES_ROL_QA.md`,
  `TELEGRAM_COMMAND_CENTER.md` (el pedido «mergeá el PR N» exige la revisión de Codex y la lista que QA no une),
  `AI_MODEL_ROUTING_2026.md` (Codex solo revisa).
- `handoff/ARRANQUE-SESIONES.md` regenerado: PASO 0, jefa y madre de `AGENTS.md` §1; fuera la «madre v2» y el pendiente del autosync.
- `scripts/loops/README.md`: el hueco de `ONIA_LOOP_ID=onia-cola` en el `pre-push` queda como hueco conocido, no como camino.
- `AGENTS.md` §4 «Hueco»: la PC no tiene `pre-push`; checkouts con el script viejo (hash de blob) y qué hacer tras el merge.

**Parche de skills (no escribible desde esta sesión).** La herramienta rechaza cualquier escritura en `.claude/skills/` del
worktree (es configuración del proyecto del checkout principal). Las siete skills quedaron como un único parche,
`PARCHE_SKILLS_REGLAS_20261017.patch` (esta carpeta), probado con `git apply --check`:
`onia-sesion-madre` (control de la PC en vez de «única que ordena»; fuera el permiso de mover `main` y el despacho a Codex;
Codex solo revisa), `equipo-de-agentes` (tabla de roles, ronda de vigilancia sin empuje y §4 «Revisión por Codex»; §4 y
§4 bis a historial), `onia-router` (Git por rol, sin «La madre integra»), `edicion-referentes` (el control de calidad es un
gate previo al OK, no su reemplazo), `onia-hermes-jarvis` y `editor-videos` (permiso de `main` e integrador, retirados) y `onia-continuidad` (apunta a `cola/loop/README.md`, no al índice histórico).
El texto retirado de las dos primeras está en `METODO_MADRE_CODEX_RETIRADO_20261017.md`. **Para aplicarlo (desde el checkout
principal, con quien puede escribir `.claude/`):** `git apply --ignore-whitespace hermes-content/docs/historial/PARCHE_SKILLS_REGLAS_20261017.patch`
(`--ignore-whitespace` porque con `core.autocrlf` el parche llega con CRLF), commit y borrar el parche. Hasta entonces las skills obligatorias de arranque siguen con el modelo viejo.

**Fuera de este repo (no se resuelven con un commit):**
- 16 de 17 checkouts de la PC con `scripts/git-autosync.js` siguen con una versión que empuja `main` (medido por hash de blob; hoy
  ninguno puede hacer fast-forward porque todos están divergidos de `origin/main`). Tras el merge, actualizar cada checkout vivo y
  comparar `git hash-object scripts/git-autosync.js`. El `main` local del checkout primario trae 3 commits «chore: auto-sync» del
  hook viejo; no llegaron a `origin/main` solo porque este divergió.
- La PC no tiene `pre-push`: instalar `scripts/loops/pre-push` (`core.hooksPath`) pide el OK de Sergio Urcullo (instalación, §1),
  o GitHub Pro / repo público para rulesets. Mientras tanto el script es la única barrera.

## Correcciones del 17-oct, 6.ª ronda: hallazgo P2 de Codex sobre `add -A` en el hook Stop (PR #226)

**P2 - `scripts/git-autosync.js` hacía `git add -A` en el checkout compartido de la PC, contra «`git add` con rutas explícitas» (AGENTS.md §4 «Carriles»)**
- En la PC (`CLAUDE_CODE_REMOTE` distinto de `true`), si el checkout es el PRINCIPAL (`git rev-parse --git-dir` igual a `--git-common-dir`; lo comparten varias sesiones), el hook ya no hace `add -A`: commitea y pushea solo lo que la sesión dejó en el índice. Con el índice vacío imprime `[autosync] checkout compartido, sin staging automático` y no commitea.
- Sin cambio: un worktree enlazado de la PC y la nube (`CLAUDE_CODE_REMOTE=true`, un contenedor por sesión) siguen con `add -A`; también todas las guardas y que el hook nunca salga distinto de 0.
- Decisión de implementación a revisar: con el índice vacío el hook NO sale ahí; solo se salta el commit y sigue con el push de lo que la sesión ya commiteó a mano (y la rama de rescate si está parada en `main`). Cortar antes dejaría sin pushear commits explícitos, que es lo contrario de lo que pide la regla.
- `scripts/loops/pedido-rama.test.mjs`: de 28 a 32 pruebas. Las existentes simulan la nube por defecto (`CLAUDE_CODE_REMOTE=true`); las nuevas fijan (a) PC + principal + archivo sin agregar: no se commitea; (b) PC + principal + archivo agregado: se commitea solo ese; (c) PC + worktree enlazado: `add -A`; (d) nube: `add -A`.
- `AGENTS.md` §4 «Carriles»: una línea tras «`git add` con rutas explícitas».
- Pendiente de la sección «Fuera de este repo» (checkouts vivos con el script viejo) sigue igual: tras el merge, actualizar cada checkout y comparar `git hash-object scripts/git-autosync.js`.

## 7.ª ronda (17-oct): QA también exige la revisión de Codex

Codex (P1, comment 4301367209) marcó que AGENTS.md dejaba a la rutina QA unir con solo CI. Ahora QA exige la revisión de Codex del último commit sin P0/P1 abiertos, con el mismo respaldo Sonnet que la jefa. El prompt de la rutina ya lo pedía; la regla escrita quedó igual.

## 8.ª ronda (17-oct): integrador retirado, QA en la skill y deck

- `onia-loop.sh onia-cola` sale sin hacer nada; el README ya no instala su prompt y el prompt queda marcado RETIRADO (P1 4301418656).
- `equipo-de-agentes`: la fila de QA exige la revisión de Codex del último commit (P1 4301418658).
- `scripts/decks/yt-octubre-2026.mjs` vuelve a filmar CLAUDE.md, como su título y su narración (P2 4301418663).

## 9.ª ronda (17-oct)

- La ronda de la madre (cron de su sesión, solo lee) queda aclarada como no-scheduler en AGENTS.md §1 y equipo-de-agentes §3; §2 bis vale solo para QA y Plataforma (P1 4301453160).
- El arranque obligatorio es para sesiones de Claude; Codex solo revisa (P1 4301453161).
- edicion-referentes y onia-ventas-pauta dejan de decir «no esperar OK de diseño» (P2 4301453164).

## 10.ª ronda (17-oct)

- Loops del VPS: el crontab los tiene comentados desde el 4 y 5-sep (medido el 17-oct: solo `onia-loops-sync.sh`). AGENTS.md §1 lo dice y prohíbe reactivarlos; el README de loops marca su instalación como RETIRADA (P1 4301484980).
