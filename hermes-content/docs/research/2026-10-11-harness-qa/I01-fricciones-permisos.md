# I01 - Fricciones de permisos medidas

Fecha: 2026-10-11. Punto del QA del harness. Solo lectura: no se tocó ningún settings ni ningún archivo fuera de este entregable.
Corrección tras verificación (PARTIAL): se recontaron los eventos, se corrigieron fechas y citas, y se agregaron los eventos que faltaban.

## Estado medido

- Modo global: `~/.claude/settings.json` -> `permissions.defaultMode` = `auto`; `permissions.allow` = 0, `permissions.deny` = 0, `permissions.ask` = 0. Medido con un script de solo lectura que contó las claves; no se imprimió ningún valor.
- Proyecto (worktree `.claude/settings.json`): solo hooks (`SessionStart` nube-ssh-vps, `Stop` git-autosync). Sin bloque `permissions`. No hay `settings.local.json` en el worktree.
- Conclusión: hoy NINGUNA regla de `allow` existe. Lo que frena es el clasificador del modo auto, no una lista.

### Frenadas registradas en handoffs (32 eventos distintos)

Se contó por evento, no por mención: un mismo evento citado en dos handoffs cuenta una vez. Búsqueda por texto (`control de permisos`, `clasificador`, `frenó`, `frenad`, `Accept edits`, `Merge Without Review`, etc.) en todos los `hermes-content/docs/handoff/*.md` y en `hermes-content/docs/cola/loop/*.md`. Es cobertura de búsqueda, no de lectura completa de cada archivo.

Grupos: G1 escape o rodeo · G2 escritura o lectura de producción/VPS · G3 transacción real (publicar, gastar, crear plantillas) · G4 acción no pedida o irreversible · G5 persistencia · G6 merge sin revisión · G7 lectura local o git.

| # | Fecha | Sesión / madre | Grupo | Acción frenada | Fuente |
|---|---|---|---|---|---|
| 1 | 30-sep | Onia (sucesora de Hermes) | G1 | SSH por dentro del túnel del proxy (Containment Escape) | hermes-jarvis.md:395 (§5.11) |
| 2 | 30-sep | Onia | G1 | `create_session` con la orden de correr `aplicar` (acceso a servidor) | hermes-jarvis.md:385-390 (§5.10) |
| 3 | 29-sep | Hermes | G1 | Rodeo por rama `ops/` que dispara con push (bloqueado; no reintentar) | hermes-jarvis.md:364-366 (§5.2); fecha en :470 |
| 4 | 30-sep | Onia | G2 | `POST .../dispatches` con GH_ACTIONS_TOKEN ("modificar recursos compartidos") | hermes-jarvis.md:403-408 (§5.13) |
| 5 | 30-sep | Hermes | G2 | Lectura de `scripts/loops/sincronizar.sh` (leída como despliegue a prod) | hermes-jarvis.md:409-413 (§5.14) |
| 6 | 30-sep | Hermes / Onia | G2 | Lectura de `organizations` en prod para aviso de alta nueva (Production Reads) | hermes-jarvis.md:335, :605 |
| 7 | 1-oct | agente de documentación | G1 | Investigar cómo aflojar el clasificador (Auto-Mode Bypass) | hermes-jarvis.md:415-416 (§5.15) |
| 8 | UNKNOWN | Hermes | G7 | `cat redactar.sed` desde la sesión. El ítem no trae fecha; el 1-oct no sale de esa fuente | hermes-jarvis.md:373-374 (§5.6) |
| 9 | 1-oct de noche | Ventas y pauta | G1 | Abrir Instagram, wa.me y Maps con Chromium y la CA del proxy (Containment Escape). No se reintentó | mercado-y-pauta.md:362 |
| 10 | 1-oct ~21:40 UTC | Marca personal | G3 | Generar 4 imágenes K8/K13 (0,48 cr) sin "sí" de gasto | marca-personal.md:452 (sección 1-oct) |
| 11 | 2-oct ~01:10 (repetido en 2-oct 13:40 y 3-oct) | Marca personal | G3 | Programar 18 carruseles en Instagram (`--agendar`) aunque dijo "programalos" | marca-personal.md:431-433; :413; :362 |
| 12 | 5-oct | Marca personal | G4 | Ensayo de `ig-reel.mjs` sin publicar: "Unrequested Commit in a Connected App" | marca-personal.md:299, 306 (cierre 5-oct) |
| 13 | 8-oct noche | Marca personal | G4 | Ensayo de `ig-reel.mjs` en el VPS (la subida de archivos sí pasó) | marca-personal.md:146-147 |
| 14 | 5-oct | madre v2 (vuelta a la PC) | G6 | Merge de PRs de Codex: lo hacen Plataforma o Sergio, no la v2 | madre-v2-revision.md:53 (VIGENTE 5-oct) |
| 15 | 3-oct | madre v2 | G6 | Merge de #96 (lo mergeó Sergio) | madre-v2-revision.md:114, 117, 160 |
| 16 | 3-oct | madre v2 | G7 | Lectura de `CLAUDE.md` y `git branch -r --contains` (clasificador) | madre-v2-revision.md:161 |
| 17 | 3-5 oct (encabezado del bloque; el ítem no trae fecha propia) | Plataforma (nube) | G2 | Escribir filas en la base de prod (confirmar correo QA, dar add-on): Remote Shell Writes | onia-1.0-nube.md:106-108 (bloque :119) |
| 18 | UNKNOWN (ítem sin fecha) | Plataforma (nube) | G2 | `tail` por SSH de `/tmp/pub-*.log` en bucle (deploy a producción) | onia-1.0-nube.md:101-102 |
| 19 | 3-5 oct (bloque) | nube | G3 | Crear plantillas en Meta / WhatsApp Manager ("transacción real") | onia-1.0-nube.md:120; madre-local.md:487, 553 |
| 20 | 3-5 oct (bloque) | nube | G4 | Commitear o editar skill/plantilla "a pedido de otra sesión" (Self-Modification) | onia-1.0-nube.md:121; madre-local.md:504 |
| 21 | 3-5 oct (bloque) | nube | G6 | Mergear en onia-hermes | onia-1.0-nube.md:122 |
| 22 | 5-oct | madre local (historial 5-oct) | G2 | `ssh onia-vps` solo lectura (Production Reads) | madre-local.md:433 (sección 384-443) |
| 23 | 5-oct | madre local | G2 | `ls /root/.config/onia-publicar/` pedido por Lucía (Production Reads) | madre-local.md:407-408 |
| 24 | 10-oct (handoff v3, 14:24-20:00 UTC) | madre local v3 | G2 | Ensayo de Lucía en el VPS (copiar `ig-reel.mjs` a `/root/bin` + dry-run): Remote Shell Writes + Real-World | madre-local.md:134, 140, 161-162; cola/loop/madre.md:59 (C4) |
| 25 | 10-oct (v3) | madre local v3 | G6 | Merge del propio PR (Merge Without Review) | madre-local.md:122, 141 |
| 26 | 10-oct (v3) | Plataforma | G2 | Registrar migración #139 en `_prisma_migrations` (frenado por su control) | madre-local.md:153 (MADRE v3 EN CURSO) |
| 27 | 10-oct 20:10 a 11-oct (v4) | madre local v4 | G2 | `ls` local después de varias lecturas de prod (Production Reads) | madre-local.md:95 |
| 28 | 10-oct (v4) | madre local v4 | G6 | `git merge origin/main` en la rama de la madre | madre-local.md:94 |
| 29 | 11-oct (ESTADO AL CLEAN) | madre marketing | G5 | Unauthorized Persistence: la acción exacta no está citada | madre-local.md:75 |
| 30 | UNKNOWN (cola/loop/madre.md sin fecha; archivo 11-oct) | madre dev / infra | G4 | C5 "paridad nube = PC" (16 skills + 2 agentes + reglas a CLAUDE.md/AGENTS.md): frenado por permisos | cola/loop/madre.md:60 |
| 31 | UNKNOWN (sección "Arranque de la sesión siguiente", sin fecha) | Lucía | G3 | Cinema Studio 3.0 (20 cr) no enviado: lo bloqueó el control de permisos | higgsfield-lucia.md:258 |
| 32 | UNKNOWN (misma sección) | Lucía | G4 | Primer intento de borrado antes del OK explícito: frenado por el clasificador | higgsfield-lucia.md:394 |

### Lo que SÍ pasó (medido en handoffs)

- Mergear y publicar onia-platform desde la nube, y leer prod en solo lectura desde la nube: onia-1.0-nube.md:125.
- Leer prod por el navegador integrado, solo en páginas públicas: madre-local.md:95.
- Subir archivos al VPS: marca-personal.md:146.

### Destrabes que los handoffs dan por válidos

- Una línea textual de Sergio Urcullo en la sesión dueña: madre-local.md:526, 553; marca-personal.md:149; hermes-jarvis.md:407-408.
- Cambiar el selector de modo de "Auto" a "Accept edits" para una aprobación: marca-personal.md:415-416 (elegida por Sergio, 2-oct), madre-local.md:600, 608 (5-oct y 10-oct), y repeticiones en marca-personal.md:150, 311, 362.

## Brecha

1. Ninguna `allow` existe. Los handoffs registran lecturas git de rutina frenadas por el clasificador (#16: `git branch -r --contains` y lectura de `CLAUDE.md`, 3-oct). Por eso la regla de lectura git tiene sentido, pero no se sabe si una regla `allow` gana al clasificador en modo auto: UNKNOWN, no medido.
2. Los grupos G1 (escape o rodeo), G2 (escritura o lectura de producción), G3 (transacción real), G4 (acción no pedida o irreversible) y G6 (merge sin revisión) son frenos de seguridad. No son fricción a eliminar.
3. Los handoffs no tienen un registro único de frenadas. Algunas no tienen fecha propia (#8, #17, #18, #30, #31, #32) y otras se describen como "frenado" sin la acción exacta (#29). Cada madre las anota a su manera.
4. Cobertura: 32 eventos por búsqueda de texto. No se leyó completo cada handoff (p. ej. `chatbot.md`, `codex-continuar-1.0.md`, `codex-relevo.md`, `codex-tareas/`); en esos archivos no apareció ningún frenado con la búsqueda.

### Clasificación por grupo

| Grupo | Eventos | ¿Se resuelve con una línea de Sergio en la sesión dueña? | ¿Regla en settings? | Riesgo de abrirla | Veredicto |
|---|---|---|---|---|---|
| G1 escape o rodeo (#1, #2, #3, #7, #9) | 5 | Nunca | Nunca | Muy alto | No resolver. No reintentar por otra vía (lo piden los propios handoffs) |
| G2 escritura o lectura de prod/VPS (#4, #5, #6, #17, #18, #22, #23, #24, #26, #27) | 10 | Sí, con texto exacto en la sesión dueña | No | Alto: escritura o SSH de root | No abrir. Línea de Sergio |
| G3 transacción real (#10, #11, #19, #31) | 4 | Sí, por pieza y en la sesión dueña | No | Alto: publica o gasta | No abrir. Línea de Sergio |
| G4 acción no pedida o irreversible (#12, #13, #20, #30, #32) | 5 | Sí, en la sesión dueña | No | Medio-alto: commits o borrados sin revisar | No abrir |
| G5 persistencia (#29) | 1 | Sí | No | Medio: procesos que persisten | No abrir hasta saber la acción exacta (UNKNOWN) |
| G6 merge sin revisión (#14, #15, #21, #25, #28) | 5 | Sí, por PR ("mergeá #N") | No | Alto: rompe "main solo avanza por PR revisado" | No abrir. Sergio o el integrador |
| G7 lectura local o git (#8, #16) | 2 | No aplica | Sí, en el archivo local de Sergio (solo lectura) | Bajo: sin escritura | Abrir solo las lecturas git de la lista de abajo; #8 queda UNKNOWN |

## Configuración propuesta

No se edita ningún settings. Texto listo para pegar, para el `settings.local.json` del checkout de Sergio (`C:/dev/proyectos/onia-hermes/.claude/settings.local.json`, no el worktree). Git lo ignora. No va al repo ni a la config de usuario, porque CLAUDE.md prohíbe el permiso en `.claude/settings.json` versionado y en la config de usuario o variables de Windows.

```json
{
  "permissions": {
    "allow": [
      "Bash(git show origin/main:*)",
      "Bash(git fetch origin*)",
      "Bash(git log *)",
      "Bash(git rev-list *)",
      "Bash(git rev-parse *)",
      "Bash(git branch -r*)"
    ]
  }
}
```

Nota: `git fetch origin` escribe refs locales de remotos (`origin/*`), no escribe en GitHub. Sigue siendo lectura remota, pero no es 100 % de solo lectura local.

Lo que NO se propone: `Bash(ssh *)`, `Bash(scp *)`, `Bash(gh api *)` con `POST`, `Bash(git merge*)`, `Bash(git push*)`, ningún comando contra `onia-vps`, `publicar.sh`, `ig-reel.mjs --agendar`, ni `POST .../dispatches`. Esos quedan frenados por diseño.

## Quién la aplica

- Sergio Urcullo: es el único que escribe el `settings.local.json` de su checkout. La regla de la madre es que el permiso lo pone él: marca-personal.md:417 ("Tendría que ponerla él, no la sesión"), en línea con CLAUDE.md, que prohíbe el permiso en el settings versionado y en la config de usuario.
- Madre-dev: propone el archivo (este texto) y pide el OK de Sergio en su sesión. No lo escribe.
- Merges (G6): Sergio o el integrador, por PR ya revisado.
- Producción, redes y transacciones (G2, G3, G4): Sergio en la sesión dueña (Plataforma, Hermes, Marca, Lucía, Ventas), con texto literal. Ninguna madre los ejecuta por su cuenta.
- Escape o rodeo (G1): nadie lo resuelve. Lo decide Sergio por fuera del harness.

Por qué: la fricción de lectura git es local a la PC de Sergio; el resto son decisiones con riesgo que ya tienen dueño.

## Prueba de hecho

1. Con el archivo puesto, en una sesión de la PC: `git show origin/main:CLAUDE.md` y `git branch -r --contains HEAD` corren sin frenar. Si el clasificador de Auto los frena igual, la regla no sirvió: anotarlo en este archivo. Estado: UNKNOWN hasta medir.
2. Prueba negativa: `git merge origin/main` y `ssh onia-vps true` deben seguir pidiendo confirmación o ser bloqueados. Si no lo hacen, la regla está mal y se borra.
3. Medir en 7 días: contar en los handoffs cuántas frenadas de lectura git quedan. Objetivo: cero para los comandos de la lista. UNKNOWN hasta medir.
4. HECHO cuando: (a) la prueba 1 pasa, (b) la prueba 2 sigue frenando, y (c) este archivo tiene una fila nueva por cada frenada del periodo.
