# I04 - MCP y conectores caidos

Fecha: 2026-10-11. Punto del QA del harness. Solo lectura: no se reinicio ni se cambio ningun servidor.
Correccion del verificador aplicada el 2026-10-11: dueños por nombre real, claude-mem y uso marcados UNKNOWN, mapeo de Meta marcado como inferido, dos claves de proyecto aclaradas.

## Estado medido

1. Nombres de MCP en `%USERPROFILE%\.claude.json` (solo nombres, sin valores). Comando: `node -e` que lee `mcpServers` de la raiz y de cada `projects[...]`. Salida relevante:
   - raiz (usuario, todas las sesiones): `image-gen`, `stitch`
   - proyecto `C:/dev/proyectos/onia-hermes` (con barras normales): `meta_developer_tools`, `cloudflare`, `cloudflare-docs`, `postiz`
   - proyecto `C:\dev\proyectos\onia-hermes` (con barras invertidas): existe, SIN servidores. Es una clave duplicada vacia; no editarla.
   - proyecto `C:/dev/experimentos/CREADOR DE WORKFLOWS`: `n8n-mcp`
   - proyecto `C:/dev/experimentos/demo-epicmotion-v2`: `stitch`
2. `.mcp.json`: no existe en `C:/dev/proyectos/onia-hermes/.mcp.json` ni en el worktree `onia-madre-v2-pr-review-2d85bb`. Comando: `ls -la`. Salida: `No such file or directory` en ambas.
3. Estado en esta sesion (aviso del host, no re-medido con `claude mcp list` para no disparar arranques de servidores):
   - CONNECTION_CLOSED: `image-gen`, `plugin:claude-mem:mcp-search`
   - 502: `postiz`
   - Requieren autenticacion OAuth: `cloudflare`, `meta_developer_tools`, `plugin:cloudflare:cloudflare-bindings`, `plugin:cloudflare:cloudflare-builds`, `plugin:cloudflare:cloudflare-observability`
   - `cloudflare-docs`, `stitch`, `n8n-mcp`: no aparecen en el aviso de fallo.
4. Alcance de `claude mcp remove`: `claude mcp remove --help` dice: "-s, --scope ... if not specified, removes from whichever scope it exists in". Sin `--scope` quita el servidor del ambito donde exista.
5. Evidencia del repo:
   - `hermes-content/docs/ONIA_AGENTES_MCP_AUDITORIA_ANTIPATRONES.md:178`: `meta_developer_tools` (http, sin autenticar) en onia-hermes.
   - `hermes-content/docs/ONIA_AGENTES_MCP_AUDITORIA_ANTIPATRONES.md:206`: el conector devtools de Meta esta vivo.
   - `hermes-content/docs/ONIA_AGENTES_MCP_AUDITORIA_ANTIPATRONES.md:250`: `cloudflare` (proyecto, sin auth) y `meta_developer_tools` marcados "peso muerto: borrar de .claude.json".
   - `hermes-content/docs/ONIA_HARNESS.md:171` (punto 10): "apagar el MCP de Higgsfield y claude-mem; autorizar o quitar los 5 MCP pendientes". Dueño en esa fila: "la madre prepara; Sergio Urcullo aplica".
   - Memoria de proyecto `publicacion-postiz-temporal`: Postiz apagado. Hoy la publicacion va por `ig-reel.mjs` y Buffer (`publicador-instagram-sin-postiz`).
6. Uso real por sesion de `image-gen`, `claude-mem` y `cloudflare`: UNKNOWN. No hay registro en `hermes-content/docs` que lo mida.
7. Mapeo de herramientas Meta: `mcp__363fd73c...__devtools_*` (conector devtools) existe en la lista de herramientas. `mcp__f6ee6776...__ads_*` corresponde a ads por el NOMBRE de sus herramientas. No hay fuente escrita para ese mapeo: inferido por nombre.

## Brecha

| MCP | Estado | Quien lo necesita | Impacto | Causa conocida |
|---|---|---|---|---|
| image-gen (usuario, stdio) | CONNECTION_CLOSED | UNKNOWN (sin registro de uso) | Sin generacion de imagen por MCP. Higgsfield va por CLI, no por este MCP | Proceso stdio que no arranco o murio. Causa exacta UNKNOWN |
| claude-mem mcp-search (plugin) | CONNECTION_CLOSED | UNKNOWN de uso. ONIA_HARNESS punto 10 pide apagarlo | Ruido: herramientas de memoria fallan al arrancar | Plugin roto o desactivacion pendiente |
| postiz (proyecto onia-hermes) | 502 | Ninguna activa medida: Postiz esta apagado segun memoria | Bajo. Ruido y error en arranque | Servicio apagado; el MCP sigue configurado |
| cloudflare (proyecto) | Sin autenticar | UNKNOWN de uso. El DNS de Onia es Cloudflare (`onia-dns-cloudflare-no-vercel`) | Sesiones que quieran tocar DNS por MCP no pueden | OAuth nunca completado |
| cloudflare-docs (proyecto) | No aparece en el aviso de fallo | Documentacion Cloudflare, lectura | Sin brecha medida | Conexion: UNKNOWN |
| meta_developer_tools (proyecto) | Sin autenticar | Duplicado: el conector devtools de Meta esta vivo; ads llega por el mapeo inferido por nombre (ver punto 7) | Ninguno medido | Peso muerto segun auditoria (`:250`) |
| plugin cloudflare (3 servidores) | Sin autenticar | UNKNOWN de uso | Igual que cloudflare | OAuth pendiente |
| stitch (usuario y demo-epicmotion-v2) | No fallo en el aviso | Diseno (Stitch) | Sin brecha medida | - |
| n8n-mcp (CREADOR DE WORKFLOWS) | No fallo en el aviso | Fuera de onia-hermes | Fuera de alcance | - |

No re-verificado: el contenido de las claves de `n8n-mcp` y `stitch` (no se leyeron, por ser secretos potenciales). Sin medir: si `cloudflare-docs` conecta de verdad.

## Configuracion propuesta

Ninguno de estos cambios se hizo. Son pasos para aplicar, no se ejecutaron. No editar `~/.claude.json` a mano: tiene claves de proyecto duplicadas (`C:/dev/proyectos/AlfredHQ` y `c:/dev/proyectos/AlfredHQ`) que hacen fallar `ConvertFrom-Json` de PowerShell 5.1. Si hace falta tocarlo, usar `node` (`JSON.parse` lo acepta) o `claude mcp`.

Regla de clave: los servidores de onia-hermes viven en la clave `C:/dev/proyectos/onia-hermes` (barras normales). La clave `C:\dev\proyectos\onia-hermes` esta vacia: no tocarla.

1. Quitar el peso muerto de onia-hermes (PowerShell, desde la carpeta del repo):

```powershell
cd C:\dev\proyectos\onia-hermes
claude mcp list
claude mcp remove meta_developer_tools
claude mcp remove postiz
```

Sin `--scope`, `remove` quita el servidor del ambito donde exista (ver Estado medido, punto 4).

2. Cloudflare: decidir una sola via.
   - Si las sesiones necesitan DNS por MCP: autorizar `cloudflare` con `/mcp` en una sesion y verificar.
   - Si no: `claude mcp remove cloudflare`. Los plugins `cloudflare:*` se desactivan con `/plugin`. La clave exacta en settings: UNKNOWN; confirmar en `/plugin`.

3. claude-mem: desactivar el plugin con `/plugin` (lo pide ONIA_HARNESS punto 10). Clave exacta: UNKNOWN.

4. image-gen: diagnostico antes de tocar nada.

```powershell
claude mcp get image-gen
```

   Si el comando no existe o el ejecutable falla, quitarlo con `claude mcp remove image-gen`. Si una sesion lo usa, reiniciar esa sesion despues.

5. No tocar `stitch`, `cloudflare-docs` ni `n8n-mcp`: sin fallo medido.

## Quien la aplica

- **Sergio Urcullo**: pasos 1, 2, 3 y 4. Son cambios de configuracion persistente que afectan a todas las sesiones de la PC. ONIA_HARNESS punto 10 dice "la madre prepara; Sergio Urcullo aplica". La autorizacion OAuth la hace el usuario. Tambien decide si Cloudflare se autoriza o se quita.
- **MADRE DESARROLLO-INFRA** (nombre real, `hermes-content/docs/handoff/madre-local.md:27`): prepara la verificacion de que nadie use `postiz`, `cloudflare` ni `image-gen` en las nubes Plataforma y Hermes-Jarvis antes del paso 1. Es la madre dueña del harness y de VPS e infra.
- **MADRE MARKETING** (nombre real, `handoff/madre-local.md:28`): confirma si Lucia, Marca personal o Ventas usan `image-gen` o `meta_developer_tools`. Meta ya tiene conector vivo. Si no lo usan, avala la baja.
- **Integrador**: no aplica. No toca configuracion de MCP.

Razon: los cambios son persistentes y los aplica Sergio Urcullo, no una sesion. Las madres solo verifican el uso antes.

## Prueba de hecho

- `claude mcp list` desde `C:\dev\proyectos\onia-hermes` ya no muestra `meta_developer_tools` ni `postiz`.
- En una sesion nueva, el aviso de inicio no lista `image-gen`, `claude-mem mcp-search` ni `postiz` como caidos (o se listan solo si Sergio Urcullo decidio mantenerlos).
- `cloudflare`: o aparece autenticado en `/mcp`, o ya no existe en `claude mcp list`.
- Registro: una linea en el handoff del harness con la salida de `claude mcp list` antes y despues.
