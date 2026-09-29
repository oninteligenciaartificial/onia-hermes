# Handoff — carril `hermes-jarvis` (sesión de control: Hermes y el cerebro de Sergio Urcullo)

Rama `claude/hermes-jarvis`. Sesión en la nube «Hermes y Sergio management system», abierta el
2026-09-29 desde el teléfono. Sin llave del VPS: todo lo que toca el servidor pasa por el
workflow manual `hermes-jarvis.yml`, que Sergio Urcullo dispara con un toque.

## 1. Objetivo

Hermes como jefe de gabinete de Sergio Urcullo por Telegram: **06:30** un resumen, **22:00** un
cierre, y en el medio **solo cuatro interrupciones** (prospecto sin respuesta · reunión en 30 min
o cambio de agenda · algo espera su OK · producto caído para clientes >30 min). Más su calendario
manejado desde el chat. Regla escrita: `ONIA_CEREBRO.md` §«La regla de entrega».

**Hecho =** (1) 24 h medidas en su Telegram sin nada fuera de eso; (2) el resumen de las 06:30
llega con su agenda real y los guiones del día; (3) el cierre de las 22:00 llega; (4) agendar /
mover / cancelar probado en su calendario real. **Hoy: ninguno de los cuatro cumplido.**

## 2. Qué quedó EN PRODUCCIÓN

**Nada que él vea.** En `main`: el workflow manual
`.github/workflows/hermes-jarvis.yml` y `hermes-content/deploy/hermes-jarvis/diagnostico.sh`
(solo lectura, salida redactada dos veces). **Nunca se corrió**: espera el toque de Sergio Urcullo.

## 3. Qué quedó a medias, y dónde

- **En `main` desde el 29-sep (`721ba43a`), APAGADO detrás del interruptor
  `/var/lib/onia-aviso/activo`:** la aduana (`scripts/loops/onia-tg.sh`:
  `ONIA_AVISO=interrumpe|resumen|sistema`, silencio 22:00-06:30, enfriamiento 6 h, `ESPERA`,
  `RECUPERADO`), el resumen/cierre (`scripts/loops/jarvis-resumen.sh`), la voz leyendo el
  resumen, el cableado en `sincronizar.sh`, 33 pruebas nuevas y la regla en `ONIA_CEREBRO.md`.
  El sincronizador lo copia solo a `/root/bin` (≈1-2 h después del merge), pero **no cambia nada
  en su Telegram** hasta que `aplicar.sh` cree el interruptor e instale los crons.
- **`aplicar.sh` / `revertir.sh`: NO existen.** Se escriben con el diagnóstico delante (crontab
  vivo, ids reales de los jobs de Hermes, workflows de n8n activos). Plan: crons 06:30 (`30 10`
  UTC) y 22:00 (`0 2` UTC), voz a 06:33, sacar el cron del parte diario (el resumen lo llama),
  pausar `hermes-weekday-work-agenda`, `hermes-daily-content-video-plan`, `onia-veredicto-sergio`,
  quitar `ONIA_TG_DIRECTO=1` de `vigia-loops-remotos`, apagar los monitores de n8n que solo
  mandan errores, crear el interruptor. Todo con respaldo en `/root/backups/hermes-jarvis-<fecha>/`.
- **Calendario:** su calendario real es el PERSONAL; el conectado (oninteligenciaartificial@gmail.com,
  credencial n8n `a3FResZHqQ32ptyt`) no tiene eventos desde el 12-ago. Se le pidió compartir el
  personal con esa cuenta («Realizar cambios en eventos»). El lector `onia-agenda.sh` no existe:
  el resumen lo dice honestamente hasta que exista.

## 4. Archivos

`hermes-content/docs/ONIA_CEREBRO.md` (la regla) · `COORDINATION_MANIFEST.md` §«EL HILO» ·
`.github/workflows/hermes-jarvis.yml` · `hermes-content/deploy/hermes-jarvis/` ·
`scripts/loops/onia-tg.sh` + `onia-tg-aduana.test.mjs` · `scripts/loops/jarvis-resumen.sh` +
`.test.mjs` · `scripts/loops/extras/jarvis-voz.sh` · `scripts/loops/sincronizar.sh`.
Inventario de los ~30 emisores de Telegram: se hizo el 29-sep (subagente), las conclusiones
están en la regla; los emisores directos más ruidosos: monitores de n8n (Salud cada hora,
Healthcheck cada 2 h, Integraciones, Backup), `claude-guardia` (Sentry cada 10 min si falla la
API), `onia-mirar-cliente.mjs` (bug: cada 15 min después de 6 h caído, líneas ~242/258).

## 5. Intentos fallidos

1. **Despachar el workflow desde la sesión:** `actions_run_trigger` → `403 Resource not
   accessible by integration`. La integración LEE logs de Actions pero no despacha.
2. **Rodeo por una rama `ops/` que dispara con un push: BLOQUEADO por el control de seguridad, y
   con razón**: habría dejado a la sesión tocar producción sin el toque de Sergio Urcullo. **No
   reintentar.** El diseño correcto es el que quedó: cada acción en el VPS = un toque suyo.
3. `test:parte-diario` da 5 rojos en este contenedor (locale POSIX) y verde con `LC_ALL=C.UTF-8`:
   no es de este carril. Por eso `jarvis-resumen.sh` exporta UTF-8 (el cron también corre en POSIX).
4. `git worktree add` de `main` en el contenedor tarda >2 min y ocupa GB (árbol de 6 GB): no usar
   para comparar; alcanza con `git show origin/main:<archivo>`.

## 6. Qué depende de Sergio Urcullo

- **Un toque:** GitHub → Actions → «Hermes Jarvis — acceso controlado al VPS» → Run workflow
  (`diagnostico`).
- **Compartir su calendario personal** con oninteligenciaartificial@gmail.com.
- Después: OK a la lista de lo que se silencia + un toque en `aplicar`.
- Hallazgos para decidir más adelante: `agendar` crea eventos a la 01:30 / 02:30 cuando se escribe
  «1:30» sin am/pm (dos casos en junio) · el webhook `agendar-create` de n8n no pide clave.

## 7. Próximos pasos

1. Leer el diagnóstico (`get_job_logs`) → escribir `aplicar.sh`/`revertir.sh` con los datos vivos.
2. Mostrarle a Sergio Urcullo la lista exacta de lo que se silencia y un ejemplo renderizado del
   resumen; con su OK, mergear `claude/hermes-jarvis` y pedir el toque en `aplicar`.
   Listo = el resumen de las 06:30 del día siguiente llega, y 24 h de `onia-tg.log` lo prueban.
3. Calendario: lector del día (n8n, con clave) + mover/cancelar con confirmación + arreglo del
   «1:30» → probado contra su calendario real.
