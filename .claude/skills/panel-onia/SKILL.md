---
name: panel-onia
description: Invocar antes de cambiar, depurar o explicar el Panel ONIA, el mod de la app de escritorio de Claude que muestra en vivo las sesiones de Claude, la cola de la orquesta, las corridas en la nube, la PC, Hermes (solo lectura) y el uso. Dónde vive el mod, cómo se publica un cambio, de dónde lee cada sección y las trampas medidas.
---

# Panel ONIA: el método

> Creada el 20-oct-2026. Sergio Urcullo pidió un panel vivo dentro de la app de Claude para ver todas las
> sesiones, la cola de la orquesta (issues `orquesta`), las corridas en la nube, la PC y Hermes. Ese día
> quedó instalado para todas las sesiones como plugin `panel-onia@onia-mods` y él lo vio funcionando con
> datos reales. El mod vive fuera del repo a propósito; acá queda el método. Lo que se aprenda nuevo se
> agrega acá, con su caso y su fecha.

## Dónde vive

| Qué | Dónde |
|---|---|
| Código del mod (lo que se edita) | `C:/Users/PC/.claude/onia-mods/panel-onia` |
| Marketplace de carpeta `onia-mods` | `C:/Users/PC/.claude/onia-mods/.claude-plugin/marketplace.json` |
| Versión | `version` de `panel-onia/.claude-plugin/plugin.json` (0.1.1 el 20-oct) |
| **Lo que la app corre** | la COPIA de `~/.claude/plugins/cache/onia-mods/panel-onia/<versión>` |
| Recolector (node, solo lee, imprime un JSON) | `bin/recolectar.mjs` (`--hermes` suma el VPS) |
| Panel, línea de estado, aviso al 80 % | `hooks/register.tsx` |
| Logos (Hermes y Claude, #D97757) | `assets/{hermes,claude}.svg`: se leen del disco, nunca de la red |

Se instaló con `claude plugin install panel-onia@onia-mods`, alcance usuario: lo cargan todas las sesiones
de la PC. **Editar la carpeta no cambia nada** hasta publicarlo (abajo): la app sigue corriendo la copia
del cache, y en el cache conviven las versiones (`0.1.0/` y `0.1.1/` el 20-oct).

## Publicar un cambio (4 pasos)

1. Subir `version` en `.claude-plugin/plugin.json` (la copia del cache se guarda por versión).
2. `claude plugin marketplace update onia-mods`
3. `claude plugin update panel-onia@onia-mods`
4. `/reload-plugins` en cada sesión abierta. Las sesiones nuevas lo cargan solas.

Antes de publicar: `claude plugin test C:/Users/PC/.claude/onia-mods/panel-onia` (5 pruebas, en
`tests/panel.test.ts`) y `node bin/recolectar.check.mjs`.

## De dónde lee cada sección

Todo lo junta `bin/recolectar.mjs`. Cada fuente tiene su tope de tiempo; la que falla vuelve como
`{ error }`, se pinta «Sin conexión» y las demás siguen. Nunca imprime tokens, prompts ni un `.env`.

| Sección | Fuente |
|---|---|
| **Sesiones** | Los archivos de sesiones de la app: `%LOCALAPPDATA%/Claude-Data/<perfil>/claude-code-sessions/<cuenta>/<org>/local_*.json`. **El 20-oct la app los mudó ahí desde `%APPDATA%/Claude/claude-code-sessions`**: se leen las dos raíces y se descartan duplicados por `sessionId` y archivadas (`isArchived`). |
| Estado de cada sesión | `interruptedAwaitingPerson` → espera. Si no, el final del transcript `~/.claude/projects/*/<cliSessionId>.jsonl`: turno sin terminar → «trabajando» si el archivo cambió hace menos de 10 min, si no «quieta». Turno terminado → `postTurnSummary` (`status_category`, `needs_action`) decide entre «lista» y «espera tu respuesta», y `needs_action` es la línea «→ qué necesita». |
| Contexto % | Cada sesión con el plugin escribe `~/.onia-panel/sesiones/<cliSessionId>.json` al terminar cada turno, con `$.session.usage()` (porcentaje, ventana, cupo de Max). Opus 5.5 = ventana de 1.000.000. Las sesiones sin reporte se estiman con el `usage` de la última respuesta del transcript y la ventana que reportó otra sesión del mismo modelo. Verde < 60 %, amarillo 60-80 %, rojo > 80 % («hacé el relevo»). |
| Cola de la orquesta | `gh issue list -R oninteligenciaartificial/onia-hermes --label orquesta --state all`; agrupa por las etiquetas `espera-ok`, `bloqueada`, `en-curso` (sin ninguna = pendiente) y suma las cerradas hoy en La Paz. |
| Nube | `gh run list --workflow orquesta.yml --limit 5`. |
| PC | `~/.onia-orquesta/registro.jsonl` (última tarea) y `~/.onia-orquesta/candado` (pasada corriendo si el PID está vivo; candado sin proceso = rojo). |
| **Hermes** | SSH con `~/.ssh/onia_hermes_vps_ed25519` y `python3 -` por stdin: `systemctl --user show hermes-gateway`, `/root/.hermes/cron/jobs.json`, dos claves de `config.yaml` (proveedor y modelo) y el tablero SQLite con `?mode=ro`. **Solo corre después de que Sergio Urcullo aprieta «Conectar Hermes»**; su OK queda en `$.store` (`hermesOk`) y cada sesión lo lee al arrancar. |
| Uso | Cupo de Max del último reporte de sesión, minutos de Actions del mes estimados por duración de cada corrida (cache 30 min en `~/.onia-panel/actions-mes.json`), US$ equivalentes de la orquesta en la PC (`usd` del registro) y el enlace a `claude.ai/settings/usage`. |

Cada sesión, además, pone en su línea de estado «🟢 Contexto N %» y, la primera vez que pasa el 80 %, un
aviso: «decí "cambio de sesión"». El panel se refresca cada 60 s **solo mientras se ve**; cerrado, no
consulta nada.

## Reglas

- **Solo lectura, siempre.** El panel no reinicia, no edita y no despacha nada.
- **El VPS se mira con el clic de Sergio Urcullo**, no por defecto: leer el VPS pide su OK en esa sesión
  (skill `onia-hermes-jarvis`). Lo que se le sume a la parte remota sigue la tabla «Medir en SOLO
  LECTURA» de esa skill: nada de `hermes cron list` ni del CLI del tablero, que escriben al arrancar.
- **Las horas, en La Paz (UTC-4 todo el año).** `gh` y systemd devuelven UTC.

## Trampas medidas (20-oct-2026)

| Trampa | Qué pasó | Cómo se resolvió |
|---|---|---|
| **La API de mods no lista otras sesiones** | `$.session` da la sesión propia; la lista de las demás no está en la API. | Se leen los archivos de sesiones de la app y los transcripts del disco. |
| **La app mudó sus archivos de sesiones** | El 20-oct pasaron de `%APPDATA%/Claude` a `%LOCALAPPDATA%/Claude-Data/<perfil>`; un lector con una sola ruta pierde las sesiones de la otra. | Se miran las dos raíces. Si la sección queda vacía, buscar dónde está ahora `claude-code-sessions` antes de tocar otra cosa. |
| **`Text` rechaza `size` y `weight`** | En la versión 2.1.299, en terminal y en escritorio. | El texto grande sale de los títulos de `Markdown` (`# Panel ONIA`, `## Sección`); `Text` solo con `bold`, `color` y `dimColor`. |
| **La facturación de Actions pide el scope `user`** | El token de `gh` de la PC tiene `gist`, `read:org`, `repo` y `workflow`, sin `user`. | Los minutos se estiman sumando la duración de cada corrida del mes (`gh api --paginate .../actions/runs`) y se rotulan «estimado». |
| **Claude no puede capturar su propia ventana** | Ni controlarla ni sacarle captura. | La captura del panel la toma Sergio Urcullo. Verificar = abrir el panel en OTRA sesión y mirar su captura; un JSON del recolector no prueba que se vea bien. |
| Transcripts de decenas de MB | Leerlos enteros cada 60 s pesa. | Solo los últimos 64 KB (`cola()` en el recolector). |
