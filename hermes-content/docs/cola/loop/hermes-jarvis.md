# Cola · Hermes-Jarvis

- [ ] P2 de #173: el aviso de rechazo se reintenta si Telegram falla (test fallo → recuperación → segunda corrida)
- [ ] Runbook de `aplicar` (#174) listo para que la madre lo corra desde la PC
- [ ] Pruebas P2-P5 de `ASISTENTE_CODEX_VS_HERMES.md` (día completo, pedido a Claude, calendario, ok/block)

## Verificación de aprendizaje · 2026-10-09
- [ ] En la próxima tarea del carril, cargar `equipo-de-agentes` y `aprender-de-todo`; aplicar los checkpoints de la ficha `2026-10-08-orquestacion-e-ingresos-5-posts.md` y registrar allí sesión, contrato, artefacto y verificación. No instalar Foreman ni activar otro orquestador.
- [x] P2 de #173: el aviso de rechazo se reintenta si Telegram falla (test fallo → recuperación → segunda corrida) — `31aebd95`, en `main` con el #173
- [x] Runbook de `aplicar` (#174) listo para que la madre lo corra desde la PC — `fecb4813` (§8 de `TELEGRAM_COMMAND_CENTER.md`)
- [x] Formato corto (Pasó · Necesito · Sigue) en lo que Hermes le manda: regla en el SOUL y en el resumen/cierre (`jarvis-resumen.sh`). Inerte hasta `aplicar` — `fa7702ef`
- [x] `diagnostico` muestra el log del recolector de respuestas (pendiente 6 del handoff) — `c0175671`
- [x] `herramientas-desplegadas` lee la fuente del `poner`, no la adivina por el nombre del archivo (pendiente 4 del handoff) — `aa3b6756`
- [x] `parte-diario.sh` fija UTF-8 él mismo: con el cron sin `LANG` (POSIX) su prueba da 5 rojos y se rompe el orden «🔴 primero». Hecho = la prueba verde corrida sin `LANG` ni `LC_ALL` — `2966e768`
- [x] Pendiente 5 del handoff: otras pruebas que miran «proceso vivo» con `kill(pid, 0)` o `kill -0` y darían el rojo falso del zombi en la nube. Hecho = barrido con el resultado anotado en el handoff, y arreglada la que aparezca — barrido del 9-oct: la única es `tandas-v1.test.mjs`, ya arreglada; nada más que arreglar
- [x] El resumen de las 06:30 lee qué sale y qué se graba hoy del plan VIGENTE (`CALENDARIO-PUBLICACION-*.md`, `GRABAR-*.md`), no solo de los `S*-GUIONES.md` (GOAL 8-oct: sale contenido todos los días). Hecho = mañana del 10-oct impresa con lo que dice el calendario, con prueba — `e6f0f970` (y los arreglos de la revisión del formato, `7b3250a9`)
- [x] La respuesta de la rutina de pedidos le llega en Pasó · Necesito · Sigue: prompt de §5 de `TELEGRAM_COMMAND_CENTER.md` y tabla «Qué mirar» de §8 al día (5c con la regla del formato; sección 0 exige el resumen en tres bloques). Hecho = mergeado; inerte hasta que exista la rutina — `f7f891e2`
- [x] El cierre dice qué salió de verdad hoy (los «PUBLICADO <link>» de `ig-reel`/`ig-carrusel`/Buffer), si esa fuente vive en el VPS; si no, anotar dónde vive y qué falta. Hecho = sección con prueba, o el hallazgo anotado en el handoff — `62e7abe1` (la fuente vive en el VPS: `/root/publicar/publicado.jsonl`)
- [x] Handoff del carril con el ESTADO del 9-oct (lo mergeado hoy, lo inerte hasta `aplicar`, lo que depende de Sergio Urcullo) y la skill al día — `bad81c5f`
- [x] Mergear el #176 con el CI en verde (criterio de hecho de todo lo de arriba) y reportar PUBLICADO — `a1aa6246` (CI verde, dos revisiones adversariales arregladas)
- [x] Después del último calendario (16-oct), la mañana no vuelve a los guiones del 29-sep: si hay calendarios y ninguno cubre el día, dice que no hay calendario para hoy. Hecho = prueba con el 17-oct — `5e177b43`
- [x] Las skills de Hermes (`pedir-a-claude`, `agenda-calendario`): los mensajes que le proponen a Sergio Urcullo en Pasó · Necesito · Sigue, sin perder el texto exacto que él aprueba. Inerte hasta `aplicar` — medido el 9-oct: ya cumplen. Sus mensajes son de UN bloque (el sí/no o el código, con el texto exacto) y el de `pedido-claude.sh` también; ponerles títulos sería ruido. Sin cambio
- [x] Diagnóstico: las publicaciones de la ventana (`/root/publicar/publicado.jsonl`, por día y con link) y los timers `pub-*` agendados, para ver desde GitHub si sale una pieza por día (GOAL 8-oct). Solo lectura, con prueba — `c182cbd0`
- [x] Diagnóstico: los títulos `##` del SOUL del VPS contra los del repo (qué secciones le faltan a Hermes), para decidir qué más copia `aplicar`. Solo lectura, con prueba — `2d1b13c4`
- [x] Handoff: ESTADO con el #176 en `main` (qué llega solo al VPS por el sincronizador y qué espera `aplicar`) — `c3dbf081`
- [x] Mergear el PR del diagnóstico 13 y 14 con el CI en verde y reportar PUBLICADO — `fce76971` (#177)

**Cola sin tareas desbloqueadas (9-oct, tarde).** Lo que sigue del carril depende de `aplicar` o de una decisión de Sergio Urcullo (abajo). No invento trabajo que no sirva a la etapa: si la madre tiene algo para este carril, va acá.

## Verificación de aprendizaje · 2026-10-09
- [x] En la próxima tarea del carril, cargar `equipo-de-agentes` y `aprender-de-todo`; aplicar los checkpoints de la ficha `2026-10-08-orquestacion-e-ingresos-5-posts.md` y registrar allí sesión, contrato, artefacto y verificación. No instalar Foreman ni activar otro orquestador. — aplicado sobre el runbook de `aplicar` (§8: correr `diagnostico` antes); registro en la ficha, «Prueba de uso por sesión», commit de esta línea

## Bloqueado
- Pruebas P2-P5 (`TELEGRAM_COMMAND_CENTER.md` §8): necesitan `aplicar` en el VPS, que corre la madre desde la PC con el «sí» de Sergio Urcullo. Desde esta sesión no se toca el VPS sin su «sí» acá.
- Correr `diagnostico` (lee el VPS, aunque no cambie nada): la regla del carril pide el «sí» de Sergio Urcullo en esta sesión, o que lo corra la madre. Sirve para ver qué secciones del SOUL le faltan a Hermes antes de `aplicar`.
- «Hoy salió» que vea también lo que Sergio Urcullo sube a mano: leer los medios del día de la API de Instagram con el token de publicar (`/root/.config/onia-publicar/ig-<cuenta>.env`), solo lectura. Usa una credencial fuera de su tarea original: necesita su OK.
