# Handoff — limpieza-skills

**Objetivo**
Borrar las skills y agentes sin uso real en los últimos 30 días, con evidencia y sin dejar
referencias rotas. Sergio Urcullo lo amplió a las globales (`~/.claude/skills`) y a Codex
(`~/.codex/skills`), y al final pidió revisar —sin cambios— agentes, comandos, reglas, plugins y
MCP globales. Hecho = inventario con evidencia + borrado/archivado + índices al día + en `main`.
**Cumplido.**

**Qué quedó EN PRODUCCIÓN** (para este carril, producción = `main`: los índices que leen todas las sesiones)
- En `main`: `2ff1c207` (repo), `896a3f2e` (mapa por dominio), `7b4b417f` (restaurado lo que usaba
  Codex + limpieza de Codex), `a12a1c12` (4 de marketing reinstaladas), `398d72bb` (nota para Codex
  en `CODEX_SKILL_ROUTING.md`).
- Repo: quedan 19 en `.claude/skills`, 12 en `.agents/skills`, 32 en `hermes-content/skills` y 1
  agente (`onia-crm-prospeccion`). Borradas 52.
- Fuera del repo (no versionado, verificado en disco): `~/.claude/skills` 215 → 110 ·
  `~/.codex/skills` 61 → 38 (+ `.system`).
- Verificado: tests `guards-cableados` 9/9 y `editor-videos` 65/65; ningún índice (router, mapa por
  dominio, skills ONIA, CLAUDE.md, ruteo de Codex) nombra algo que no exista.

**Qué quedó a medias, y dónde**
- Nada. Rama `claude/cleanup-unused-skills-02587f` (worktree `gallant-bouman-f18476`) = `main` + este
  handoff.
- Respaldo vivo: `~/.codex/skills-archivadas-20260929/` (23 skills de Codex, lista en
  `_ARCHIVADAS.txt`). **No borrar antes del ~13-oct.**
- `~/.claude/skills-archivadas-20260929/` ya no existe (se borró con `Remove-Item`); lo que se usaba
  se recuperó de copias locales o se reinstaló.

**Archivos y cambios**
- `hermes-content/docs/historial/LIMPIEZA_SKILLS_20260929.md` — registro completo: qué salió, por
  qué, qué lo reemplaza y cómo recuperar cada cosa.
- `hermes-content/docs/historial/skills-codex-congeladas-20260929/` — las 4 skills propias de ONIA
  que salieron de Codex (web congelada, no borrada).
- Índices: `.claude/skills/onia-router/SKILL.md` y `STACK-POR-DOMINIO.md`, `.claude/skills/README.md`,
  `.claude/agents/README.md`, `CLAUDE.md` (línea de HyperFrames), `CODEX_SKILL_ROUTING.md`,
  `COORDINATION_MANIFEST.md`, `hermes-content/docs/ONIA_SKILLS_STACK_Y_SUBAGENTES.md`,
  `hermes-content/docs/EXECUTION_PROTOCOL.md`, `skills-lock.json`.
- Fuera del repo: `~/.agents/.skill-lock.json` (42 entradas).

**Intentos fallidos**
1. **El primer escaneo de Codex leyó solo `~/.codex/sessions` (23 sesiones)** y no
   `~/.codex/archived_sessions` (117 en total). Hizo sacar skills que Codex sí usaba:
   `motion-doctrine` y su familia en `.agents`, 4 docs del bot, 20 globales. Se detectó al revisar
   Codex y se restauró todo. **Codex guarda sesiones en DOS carpetas.**
2. **Los transcripts no ven dependencias por ruta dentro de scripts**: `media-use` (librería de SFX
   de `editor-videos/scripts/sfx.mjs`) casi se borra; lo avisó la sesión de marca personal. Hace
   falta `git grep` de rutas + preguntar a las sesiones vivas.
3. **Filtro de "referenciada" demasiado blando**: `STACK-POR-DOMINIO.md` es un catálogo que nombra
   casi todo. Solo cuentan las fuentes curadas (tabla de carriles, stacks de skills ONIA, CLAUDE.md).
4. **Regex**: `.agents\skills\X` se leía como carpeta de agentes y se perdía el nombre. Corregido con
   un self-check antes de escanear.
5. **Mis propios comandos (`git rm`, greps) contaban como "uso"**: hay que excluir la sesión en curso.
6. **Comando bash para una terminal PowerShell**: `rm -rf` falló. La terminal de Sergio es PowerShell.
7. Ofrecí un comando de borrado definitivo antes de terminar de medir; se usó y después apareció la
   evidencia que faltaba. No ofrecerlo hasta cerrar toda la medición.

**Qué depende de Sergio**
- **Decidido:** agentes, comandos, reglas, plugins y MCP globales **se dejan** (revisión hecha, sin
  cambios; números en el historial). No volver a proponerlo sin un motivo nuevo.
- Conectores de claude.ai sin uso (Figma, Gamma, Google Drive, Claude Docs): solo él puede apagarlos.
- Borrar `~/.codex/skills-archivadas-20260929/` después del ~13-oct:
  `Remove-Item -Recurse -Force "$HOME\.codex\skills-archivadas-20260929"`.
- Copias de las docs del bot en el VPS: decidió dejarlas.

**Próximos pasos**
1. Nada obligatorio. Si una sesión extraña una skill, el historial dice cómo recuperarla.
2. Si Sergio lo pide: la revisión global está lista para ejecutar. Lo de más peso son las reglas
   `zh/` + `README.md` (~22 KB que se cargan en cada sesión sin aportar).
3. Fuera de este carril, anotado: `scripts/genera-propuesta.js` / `scripts/webhook-propuestas.js`
   (generador viejo de propuestas) y docs narrativos que citan agentes borrados.
