# Los loops que corren en el VPS

Código de herramienta de los loops de carril mudados de Windows al VPS el 2026-09-01.
**La lista de QUÉ loops deben existir y dónde corre cada uno vive en
[`hermes-content/docs/cola/loops.md`](../../hermes-content/docs/cola/loops.md)** — este README
sólo explica cómo se instala y se apaga lo de acá.

## Por qué se mudaron

Las tareas programadas viven dentro de la app de Claude Code en Windows y **sólo disparan cuando
la app está quieta**. Medido el 2026-09-01: `web-factory-dev-loop` se saltó su horario de las
18:48 y corrió recién a las 19:48, y `onia-cola`, `chatbot-cola` y `canario-visual` tenían el
**mismo `lastRunAt` al milisegundo** (18:18:54) — la ráfaga de recuperación al abrir la app.
Desde entonces ninguno había corrido. Y con la laptop apagada no corren en absoluto.

## Qué hay acá

| Archivo | Qué es |
|---|---|
| `onia-loop.sh` | El corredor. Un solo script para todos los loops del VPS (`onia-loop.sh <id>`); ver el `case` para la lista vigente. |
| `onia-tg.sh` | El reemplazo de `PushNotification`: Telegram con `parse_mode=HTML`. |
| `pre-push` | Hook que **bloquea** un push a `main`/`master` desde el VPS. |
| `prompts/*.md` | Los prompts portados de `scheduled-tasks/<id>/SKILL.md`, con rutas Linux. |

## Las barandas

- **`flock -n`**: si la vuelta anterior sigue viva, la nueva **no arranca** (queda `SALTEADA` en
  el log). Es lo que le falta a `claude-guardia.sh` y lo que más duele en un loop horario.
- **Tope de tiempo**: 50 min `chatbot-cola` (cron horario → 10 min de colchón), 45 min
  `canario-visual`. Un `timeout` que corta cuenta como fallo y avisa.
- **`cd` verificado**: worktree presente y en la rama esperada **antes** de gastar una sesión.
  `claude-guardia.sh` no lo hace y lleva semanas diagnosticando desde `/root` porque su carpeta
  desapareció.
- **`pre-push`**: `main`/`master` bloqueados mecánicamente, no sólo por prompt — salvo el caso
  `onia-cola` (el integrador), que `onia-loop.sh` marca exportando `ONIA_LOOP_ID`.
- **Aviso a Telegram** en todo fallo, como mucho **1 cada 6 h por loop** (el ruido apaga la señal).
- **`--allowedTools` acotado**: headless no puede contestar preguntas, así que los permisos se
  deciden de antemano.
- Los prompts prohíben desplegar, mergear, gastar plata, tocar otro carril y bajar superficies
  vivas.

## Instalación en el VPS

Los scripts se **copian** a `/root/bin/` (no se enlazan al clon: un loop no debe poder romper su
propio corredor a mitad de vuelta). Desde la raíz de un checkout del repo en el VPS:

```bash
install -m 755 scripts/loops/onia-loop.sh scripts/loops/onia-tg.sh /root/bin/
install -d /root/bin/loops
install -m 644 scripts/loops/prompts/canario-visual.md /root/bin/loops/canario-visual.md
install -m 644 scripts/loops/prompts/chatbot-cola.md   /root/bin/loops/chatbot-cola.md
install -m 644 scripts/loops/prompts/marca-personal.md /root/bin/loops/marca-personal.md
install -m 644 scripts/loops/prompts/onia-cola.md      /root/bin/loops/onia-cola.md
install -m 644 scripts/loops/prompts/docs-auditoria.md /root/bin/loops/docs-auditoria.md

# el hook vale para el clon y TODOS sus worktrees de una sola vez
for r in onia-hermes onia-platform; do
  install -d /root/loops/$r/.githooks
  install -m 755 scripts/loops/pre-push /root/loops/$r/.githooks/pre-push
  git -C /root/loops/$r config core.hooksPath .githooks
done
```

**Al cambiar un prompt hay que volver a copiarlo**: el que se ejecuta es el de `/root/bin/loops/`.

## Cómo se audita

Un archivo por loop, con fecha en cada línea:

```bash
tail -n 60 /var/log/onia-loop-chatbot-cola.log
grep -E '=====' /var/log/onia-loop-canario-visual.log | tail -20   # solo el resumen
```

Cada vuelta abre con `===== ARRANCA … HEAD <sha> …` y cierra con
`===== TERMINA … <segundos>s — exit <rc> — commiteó <a>..<b> — sin pushear: <n>`.
En una línea: si corrió, cuánto tardó, qué commiteó y si falló. El log se rota solo a las 6.000
líneas (se dejan las últimas 3.000).

## Cómo se apaga

```bash
crontab -e   # y comentar la línea del loop
```

## La credencial del VPS — resuelto el 2026-09-01

`claude -p` en el VPS necesita la credencial de la suscripción
(`/root/.claude/.credentials.json`). El 2026-09-01 a la mañana estaba **vacía** (`accessToken` y
`refreshToken` de 0 bytes, `expiresAt: 0`), la última sesión real del VPS era del **15-ago**, y
las dos líneas de `crontab` quedaron **comentadas** con el motivo escrito. `claude-guardia.sh`
venía escribiendo "diagnóstico automático no disponible" desde entonces.

**Ya no.** Verificado en vivo el 2026-09-01 20:45 UTC, las dos cosas que faltaban:

```bash
ssh root@187.77.16.63 'claude -p "responde solo: OK" --allowedTools ""'   # → OK
# y el push, con un ref temporal que se borra en el acto:
cd /root/loops/onia-hermes
git push origin FETCH_HEAD:refs/heads/tmp/vps-write-test && git push origin :refs/heads/tmp/vps-write-test
```

Las dos líneas del `crontab` quedaron **descomentadas**. `canario-visual` ya había corrido a
mano a las 19:48 UTC con `exit 0` y 2 commits pusheados: la cadena entera (worktree → rama →
`claude` → commit → push) está probada, no deducida.

⚠️ **No copiar el `.credentials.json` de Windows.** Es lo que se hizo el 2026-08-15 y por eso
murió: dos máquinas compartiendo un mismo OAuth rotan el `refreshToken` entre ellas, y la que
pierde la carrera queda deslogueada en silencio. Si vuelve a caer, la salida es una sesión
interactiva **como root en el VPS** (`claude` → `/login`, o mejor `claude setup-token`, que
genera un token propio de la máquina).

Mientras la credencial esté rota, los loops arrancan, detectan `Not logged in`, avisan por
Telegram y salen sin romper nada.
