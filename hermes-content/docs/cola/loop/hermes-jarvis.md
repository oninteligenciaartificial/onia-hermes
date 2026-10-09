# Cola · Hermes-Jarvis

- [x] P2 de #173: el aviso de rechazo se reintenta si Telegram falla (test fallo → recuperación → segunda corrida) — `31aebd95`, en `main` con el #173
- [x] Runbook de `aplicar` (#174) listo para que la madre lo corra desde la PC — `fecb4813` (§8 de `TELEGRAM_COMMAND_CENTER.md`)
- [x] Formato corto (Pasó · Necesito · Sigue) en lo que Hermes le manda: regla en el SOUL y en el resumen/cierre (`jarvis-resumen.sh`). Inerte hasta `aplicar` — `fa7702ef`
- [x] `diagnostico` muestra el log del recolector de respuestas (pendiente 6 del handoff) — `c0175671`
- [x] `herramientas-desplegadas` lee la fuente del `poner`, no la adivina por el nombre del archivo (pendiente 4 del handoff) — `aa3b6756`
- [x] `parte-diario.sh` fija UTF-8 él mismo: con el cron sin `LANG` (POSIX) su prueba da 5 rojos y se rompe el orden «🔴 primero». Hecho = la prueba verde corrida sin `LANG` ni `LC_ALL` — `2966e768`
- [x] Pendiente 5 del handoff: otras pruebas que miran «proceso vivo» con `kill(pid, 0)` o `kill -0` y darían el rojo falso del zombi en la nube. Hecho = barrido con el resultado anotado en el handoff, y arreglada la que aparezca — barrido del 9-oct: la única es `tandas-v1.test.mjs`, ya arreglada; nada más que arreglar
- [ ] El resumen de las 06:30 lee qué sale y qué se graba hoy del plan VIGENTE (`CALENDARIO-PUBLICACION-*.md`, `GRABAR-*.md`), no solo de los `S*-GUIONES.md` (GOAL 8-oct: sale contenido todos los días). Hecho = mañana del 10-oct impresa con lo que dice el calendario, con prueba

## Bloqueado
- Pruebas P2-P5 (`TELEGRAM_COMMAND_CENTER.md` §8): necesitan `aplicar` en el VPS, que corre la madre desde la PC con el «sí» de Sergio Urcullo. Desde esta sesión no se toca el VPS sin su «sí» acá.
