# Web Factory VPS Automation - 2026-06-30

## Decision

La automatizacion productiva de Web Factory no debe depender de la laptop de
Sergio. Debe correr en el VPS aunque la computadora este apagada.

Arquitectura recomendada:

```text
n8n en VPS
-> SSH al mismo VPS o worker privado
-> web-factory/scripts/web-factory-vps-automation.mjs
-> logs/reporte JSON en /var/log/onia/web-factory
-> Telegram/ONIA Center para visibilidad
```

n8n orquesta horarios, alertas y aprobaciones. El worker del VPS ejecuta Node,
pnpm, Playwright, scraping y checks de Nuvia. No conviene meter Playwright,
repos y builds dentro del contenedor de n8n porque aumenta memoria, dependencias
y riesgo de romper la instancia de automatizaciones.

## Evidencia revisada

- `n8n-sergio_n8n` existe como instancia activa documentada en el VPS.
- El workflow diario de ONIA Center ya funciona como patron: n8n agenda, llama
  endpoint interno y notifica.
- `center.onia.com.bo/onia-center/login` responde `200`.
- En esta sesion, `center.onia.com.bo/api/onia-center/auth/status` respondio
  `configuration_pending` desde Vercel, sin Supabase server-side. Por eso no se
  debe asumir que el dominio publico actual es el runner operativo.
- En esta sesion, SSH directo al VPS fallo por falta de llave en la sesion:
  `Permission denied (publickey)`. Queda bloqueada solo la prueba remota real,
  no el diseno ni el runner.

## Runner canonico

Archivo:

```text
web-factory/scripts/web-factory-vps-automation.mjs
```

Comandos:

```bash
cd /opt/onia-hermes/web-factory
pnpm automation:vps:dry
pnpm automation:vps:daily
pnpm automation:vps:references
pnpm automation:vps:nuvia-check
pnpm automation:vps:nuvia-watch
pnpm automation:vps:smoke
```

`automation:vps:daily` ejecuta:

1. `pnpm references:harvest:daily`
2. `pnpm references:intelligence`
3. `pnpm nuvia:prices:check`

Por defecto Nuvia queda en `check-only`. Para aplicar cambios de catalogo o
precio, usar `automation:vps:nuvia-watch` solo cuando el reporte no muestre
productos agregados/removidos, scrape inseguro ni cambios estructurales.

El runner usa lock file por modo para evitar ejecuciones solapadas.

Reporte por defecto en Linux:

```text
/var/log/onia/web-factory/latest-web-factory-vps-automation.json
/var/log/onia/web-factory/<timestamp>-<mode>.json
```

Variables opcionales:

```bash
WEB_FACTORY_ROOT=/opt/onia-hermes/web-factory
WEB_FACTORY_AUTOMATION_STATE_DIR=/var/log/onia/web-factory
```

## Preparacion del VPS

Requisitos minimos en el VPS o worker:

```bash
node --version
corepack --version
git --version
```

Setup recomendado:

```bash
cd /opt
git clone <repo-onia-hermes> /opt/onia-hermes
cd /opt/onia-hermes/web-factory
corepack enable
corepack prepare pnpm@10.33.3 --activate
pnpm install --frozen-lockfile
pnpm references:playwright:install
pnpm automation:vps:dry
```

Si Playwright falla por dependencias del sistema:

```bash
pnpm exec playwright install --with-deps chromium
```

No guardar secretos en Markdown ni en Git. Si el worker necesita variables,
ponerlas en `/root/.hermes/.env` o en el entorno seguro de n8n.

## Workflow n8n recomendado

Nombre:

```text
ONIA - Web Factory VPS Radar
```

Fuente validada con n8n Workflow SDK:

```text
hermes-content/deploy/n8n/workflows/web-factory-vps-radar.workflow.js
```

Schedule:

```text
Lunes a sabado 07:10 America/La_Paz
```

Flujo:

1. `Schedule Trigger`.
2. `SSH Execute Command` contra el VPS.
3. Comando:

```bash
cd /opt/onia-hermes/web-factory && pnpm automation:vps:daily
```

4. `Code` normaliza `stdout`, `stderr`, `exitCode` y detecta `ok`.
5. `IF ok`.
6. Si ok: enviar resumen corto a Telegram/ONIA Center.
7. Si falla: enviar alerta con `exitCode`, paso fallido y ruta del reporte.

Reglas:

- No publicar ni hacer deploy automatico de webs.
- No auto-aplicar Nuvia si el reporte indica productos agregados/removidos,
  `unsafe_scrape` o cambios estructurales.
- No correr el mismo job desde laptop y VPS al mismo tiempo.
- No hacer `git push` automatico desde n8n hasta definir estrategia de revision.

## Alternativas

### Opcion A: n8n + worker VPS

Recomendada para ONIA ahora.

Ventajas:

- funciona con la laptop apagada;
- queda visible en n8n;
- permite Telegram, aprobaciones y logs;
- separa orquestacion de ejecucion pesada.

Riesgo:

- requiere credencial SSH correcta dentro de n8n;
- si el VPS se queda sin memoria, el scraping puede fallar.

### Opcion B: systemd timer en VPS

Mas robusta para ejecucion pura.

Uso recomendado si n8n falla o si queremos maxima estabilidad:

```text
systemd timer -> pnpm automation:vps:daily -> logs JSON
```

n8n puede quedar solo como notificador revisando el reporte.

### Opcion C: cron clasico

Aceptable para una primera version, pero menos observable que systemd timer y
menos integrable que n8n.

### Opcion D: laptop/Codex local

No usar para produccion. Sirve solo para desarrollo, dry-runs y debugging.

## Validacion antes de activar

Desde el VPS:

```bash
cd /opt/onia-hermes/web-factory
pnpm automation:vps:dry
pnpm automation:vps:references
pnpm automation:vps:nuvia-check
```

Desde n8n:

1. Crear credencial SSH al VPS.
2. Ejecutar workflow manual con `pnpm automation:vps:dry`.
3. Revisar que `stdout` devuelva JSON con `ok=true`.
4. Cambiar a `pnpm automation:vps:daily`.
5. Mantener workflow inactivo hasta que una ejecucion manual real pase.

## Bloqueos actuales

- Falta validar SSH remoto desde esta sesion. La prueba local devolvio
  `Permission denied (publickey)`.
- Falta confirmar si el checkout canonico del repo ya existe en el VPS bajo
  `/opt/onia-hermes` o si se debe usar otra ruta.
- Falta confirmar credencial SSH dentro de n8n para el workflow nuevo.

Estos bloqueos no impiden que el runner y el workflow queden preparados; solo
impiden declarar que ya esta activo en produccion.
