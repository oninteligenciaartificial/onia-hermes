# Handoff — sesión de control (madre local en la PC) · 17-oct-2026, 01:00 La Paz

> Lo retoma la próxima madre en la PC de Sergio Urcullo. Estado medido, no de memoria. Reemplaza el del 16-oct
> (queda en git). Memoria local: `nube-proyectos-aprendizajes-17-oct.md`, `feedback-tecnico-no-consultar.md`,
> `feedback-decisiones-visibles.md`. Cómo funciona todo: `hermes-content/docs/ONIA_SISTEMA_AUTONOMO.md`.

## 1. Objetivo vigente (Sergio Urcullo, 16-oct)
1.0 de Onia Platform para el banco (API QR del BCP), con los 5 rubros probados, y Bs 3.000 al 31-oct (taller de IA del
sáb 31-oct, Bs 50/60/70, 50 cupos, sin devolución; consultorías; prepago). Orden: `hermes-content/docs/cola/loop/hermes-jefa.md`.
El objetivo no cambia: la madre lo empuja controlando a la jefa, no haciendo el trabajo de los hilos.

## 2. Qué quedó en producción / encendido (17-oct)
- **La jefa publica** (orden de Sergio Urcullo: «Sí, que publique la jefa»): mergea lo que tenga la revisión de Codex
  del último commit sin P0/P1, el CI verde y ningún conflicto. Ya publicó #212. La rutina QA :57 no puede mergear ni
  comentar (su control de permisos lo frena).
- **Vuelta horaria de la jefa: APAGADA** desde el 17-oct (el recordatorio de los :07 y los resúmenes de 06:30 y 18:00
  quedaron con enabled:false). El proyecto avanza por eventos: la jefa despierta cuando un hilo termina o Sergio Urcullo
  contesta una tarjeta (sección «El loop: por eventos, sin esperas» de las instrucciones). No se re-arma ningún recordatorio por hora.
- **Cómo hablarle:** lo técnico no se le consulta ni se le cuenta. Lo visual y lo serio van por tarjeta, de a una
  (memoria `feedback-tecnico-no-consultar`). Las decisiones van en AskUserQuestion o en el mensaje final, nunca a
  mitad de turno (memoria `feedback-decisiones-visibles`).
- **Entorno «Onia»:** red Completo. Script de configuración nuevo (lo pegó Sergio Urcullo): cloudflared + alias
  `ssh onia-vps` por `ssh.onia.com.bo`. La llave NO llega al script: el hilo la escribe en su PASO 0. Probado el 17-oct
  04:01 UTC: túnel OK, web 200; falta el sí de Sergio Urcullo en el hilo Plataforma para escribir la llave.
- **Skills de la cuenta:** Sergio Urcullo subió 36 + anunciante-supremo (ZIP en `Descargas\onia-skills` y `tanda-2`).
  Si cambia una skill del repo, hay que volver a subir su ZIP.
- **Instrucciones del proyecto** (Configuración → Memoria): estaban VACÍAS. Texto fuente en
  `hermes-content/docs/PROYECTO_ONIA_HERMES_INSTRUCCIONES.md`; se le dejó en el portapapeles a Sergio Urcullo para
  pegarlo. Verificar que quedó pegado y que un hilo NUEVO lo sigue.
- **Mods locales** (`~/.claude/dev-mods/f9748e74-…/`): `/codex` (estado de Codex en los PRs) y `/subagentes` («Equipo
  ONIA», ayudantes por sesión). Solo cargan en la sesión que los creó. En la madre nueva: copiar esas dos carpetas a su
  carpeta de mods (cargar la skill plugin-authoring para que la cree) o abrirla con `--plugin-dir`.
- **GitHub sin correos:** Watching, Participating, Actions y Agent sessions quedaron solo «on GitHub».
- **Correo al BCP** del 16-oct: sin respuesta medida todavía.

## 3. Qué quedó a medias y dónde
- **PR #226 (reglas unificadas):** rama `claude/reglas-unificadas-20261017` (worktree `E:/onia-wt/reglas-unificadas`).
  7 rondas de Codex resueltas; última `fc2a8fdf` (QA también exige Codex). Esperando a Codex. Toca CLAUDE.md, AGENTS.md
  y git-autosync.js: lo mergea la MADRE (no la jefa) cuando Codex dé 👍 o no queden P0/P1. Después del merge, todo
  checkout vivo debe traer el `scripts/git-autosync.js` nuevo (el viejo todavía empuja `main`).
- **PR #227 (aprendizajes de la nube):** rama `claude/learning-nube-20261017`. Esperando a Codex; lo publica la jefa.
- **PR #224 (FLUNA + anunciante-supremo):** lo había congelado por error; reabierto el 17-oct. Esperando a Codex.
- **PR #228 (este handoff + instrucciones del proyecto):** rama `claude/madre-relevo-20261017`.
- **PRs de la jefa:** #207 (ventas; precios y textos pasan por Sergio Urcullo), #209, #221 y onia-platform #185 (semilla
  por rubro) siguen en el ciclo de Codex.
- **Diagnóstico** `trig_01NWcLV1tHDpTP2XjH2bKVqE`: deshabilitado; no hace falta borrarlo.

## 4. Archivos tocados
#226: AGENTS.md, CLAUDE.md, scripts/git-autosync.js, scripts/loops/pedido-rama.test.mjs y 7 skills (por patch).
#227: `ONIA_SISTEMA_AUTONOMO.md` §10 y onia-sesion-madre. #228: este handoff y `PROYECTO_ONIA_HERMES_INSTRUCCIONES.md`.
Memoria local: 4 archivos nuevos y el índice MEMORY.md.

## 5. Intentos fallidos y su causa
- El control de permisos de la madre frena leer la base de producción, aprobar por Sergio Urcullo un cambio de
  producción (plantilla de login), editar la config del entorno («Unauthorized Persistence») y mandarle a la jefa la
  orden de crear cuentas en producción. No se rodea: lo hace Sergio Urcullo o va por tarjeta.
- Los subagentes no pueden escribir en `.claude/skills/`: dejan un `.patch` y lo aplica la madre.
- `RemoteTrigger update` del prompt no cambia el evento de un trigger ya creado: se crea uno nuevo.
- El reset de contraseña de superadmin falló: lo pedí desde el navegador de la app y Sergio Urcullo abrió el correo en
  Chrome (PKCE). Tiene que repetirlo todo en Chrome. La falla de producto quedó como tarea para Plataforma.
- Congelé #224 (aprendizaje) junto con el tooling de video. Error: el aprendizaje de ventas nunca se congela.
- Las órdenes por `claude -p --cloud` no se ven en el chat del proyecto: la jefa tiene que publicar «📥 De la madre».

## 6. Qué depende de Sergio Urcullo
1. Pegar las instrucciones del proyecto (ya están en su portapapeles).
2. En el hilo Plataforma 1.0: «Autorizo: escribí la llave y probá ssh onia-vps» (QA con login de la 1.0).
3. Tarjetas del proyecto: carruseles y página del taller; plantilla de recuperación de contraseña; cortes de 5 videos.
4. Leslie: a nombre de quién va el QR del taller.
5. ¿Se crean cuentas de prueba de estética, comercio y servicios en producción? (hoy hay 3 dental + 1 importadora).
6. Su acceso de admin: repetir «Olvidé mi contraseña» desde Chrome con superadmin@onia.com.bo.
7. Confirmar o no la regla «Lucía autónoma» que entró con #212 (sin fuente; mientras tanto, «mostrar antes»).
8. Rotar el token de n8n de `~/.codex/config.toml` (pendiente desde el 16-oct).

## 7. Próximos pasos de la madre nueva
1. Arrancar con la skill `onia-sesion-madre`, este handoff y la memoria `nube-proyectos-aprendizajes-17-oct`.
2. Ronda cada 20 min con la cadencia de la skill `onia-sesion-madre` (CronCreate `7,27,47 * * * *`; una sola ronda, no dos): `RemoteTrigger get_run_log cse_011cQSargj5qz516CNpPQEko`; buscar
   «PC:»; comprobar que avanza por eventos (cada hilo que termina recibe su siguiente tarea de la cola), que avisa al instante los permisos pendientes y que usa subagentes reales. Que no haya mensajes por hora es lo correcto.
3. Mergear #226 cuando Codex lo apruebe y actualizar `git-autosync.js` en los checkouts vivos.
4. Verificar que un hilo NUEVO siguió las instrucciones del proyecto (PASO 0, subagentes, «Subagentes: N»).
5. Prueba con la PC apagada: a la mañana, mirar el resumen de las 06:30 y el log de la jefa de la noche.
6. Relevo antes de ~150 k tokens (esta madre llegó a ~400 k: demasiado).
