# Handoff — stack-skills

Actualizado: 2026-10-20.

**Objetivo**
Stack de skills y agentes por área de ONIA (pedido de Sergio Urcullo, 20-oct). Hecho cuando: lo aprobado instalado
y verificado, cada área con su apartado escrito donde se lee, y el parche del 19-oct y la regla de relevo en un PR.
Cumplido salvo dos pasos que dependen de él (abajo).

**Qué quedó EN PRODUCCIÓN**
En la PC de Sergio Urcullo (fuera de Git), verificado el 20-oct:
- Disco: el clon huérfano de Orca pasó a `E:/archivo/orca-onia-hermes` (8,1 GB). C: subió de 8,4 a 17 GB libres.
  `~/.claude/rules/zh` pasó a `~/.claude/rules-archivadas/zh`.
- `agent-browser` 0.39.1 (`npm -g`), `agent-browser doctor`: 8 pass, 0 fail.
- MCP `exa` (http, usuario): conectado.
- Plugin `claude-security` 0.12.0. Actualizados: ponytail 5.3.2, superpowers 7.0.0, document-skills dbd4588f9e10,
  frontend-design a0b04d9ddcca. Requieren reiniciar Claude Code.
- Skills en `~/.claude/skills/`: `code-review-spec`, `diagnosing-bugs`, `next-dev-loop`, `prisma-cli`, `diagram-design`.
- ZIP `E:/onia-skills-zip/ver-videos.zip` (de `origin/main` 9f4a8f14, 17 archivos).

**Qué quedó a medias, y dónde**
Nada en el código. El PR de este carril lleva el parche del 19-oct, los apartados y la regla de relevo.

**Archivos y cambios**
- `.claude/skills/onia-router/SKILL.md`: § «Apartados por área» (7 áreas) y cómo instalar una skill sin romper nada.
- `.claude/agents/README.md`: qué agente sirve a qué área y cuáles no usar.
- `scripts/orquesta/carriles.json`: plataforma lee `next-dev-loop`, `prisma-cli` y `diagnosing-bugs`;
  investigación lee `aprender-de-todo`. Test nuevo en `orquesta.test.mjs`; regla y riesgo en `cuartitos/README.md`.
- `CLAUDE.md` § «Objetivo por sesión»: relevo al 80 % de contexto.
- Parche del 19-oct aplicado a `equipo-de-agentes`, `onia-router` y `onia-sesion-madre`.

**Intentos fallidos**
- `Move-Item` entre discos copia y después borra: el borrado de `.git` falló por permisos, pero la copia ya estaba
  completa y el `.git` de origen quedó vacío. Se borraron las carpetas vacías con `rmdir`.
- `npx skills add -g` sin `-a claude-code --copy` escribe en `~/.agents/skills`, que es un enlace al repo.
- `code-review` de mattpocock choca con el comando `/code-review` de ECC: se renombró a `code-review-spec`.
- Apagar el registro de ponytail (`claude plugin configure ... --values-stdin` y `~/.claude/.ponytail-band`)
  lo frenó el control de permisos («tocar auditoría»). No se forzó.
- El inventario con ★ del 19-oct no quedó guardado en ningún archivo ni transcript buscable: los apartados se
  armaron desde lo instalado y verificado hoy.

**Qué depende de Sergio**
1. Apagar el registro por turno de ponytail (PowerShell, en su PC):
   `'{"ledger":"false"}' | claude plugin configure ponytail@ponytail --values-stdin; Set-Content -Path "$HOME\.claude\.ponytail-band" -Value off -NoNewline`
2. Subir `E:/onia-skills-zip/ver-videos.zip` en claude.ai → Personalización → Skills, reemplazando la `ver-videos` vieja.
3. Reiniciar Claude Code para cargar los plugins actualizados.

**Próximos pasos**
- Copiar la regla de relevo a `AGENTS.md` si Codex también debe cumplirla. Listo cuando lo diga ahí.
- Carriles `ventas` e `infra` en la orquesta solo si se decide repartirles issues (entrada en `carriles.json` +
  `gh label create`). Hoy esas dos áreas trabajan en sesión.
- Exa en GitHub Actions: el MCP está solo en la PC; el carril investigación de la nube sigue sin buscador.
