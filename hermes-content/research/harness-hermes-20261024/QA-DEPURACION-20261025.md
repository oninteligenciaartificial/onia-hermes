# QA de depuración — 25 de octubre de 2026

**Veredicto:** `aprobado`

Revisión puntual y de solo lectura contra el respaldo indicado. No se editaron instrucciones ni configuración. Los archivos históricos se cotejaron por contenido/orden, sin volcar ni generar diffs extensos.

## Evidencia

- Integridad del manifest: 7/7 respaldos con SHA-256 y bytes correctos.
- Cambios verificados:
  - `C:\dev\proyectos\onia-hermes\AGENTS.md`: +57/−297 líneas; respaldo verificado.
  - `C:\dev\proyectos\onia-hermes\CLAUDE.md`: +14/−30 líneas; respaldo verificado.
  - `C:\dev\proyectos\onia-hermes\COORDINATION_MANIFEST.md`: +24/−1062 líneas; respaldo verificado.
  - `C:\dev\proyectos\onia-hermes\hermes-content\docs\EXECUTION_PROTOCOL.md`: +7/−142 líneas; respaldo verificado.
  - `C:\dev\proyectos\onia-hermes\.claude\skills\equipo-de-agentes\SKILL.md`: +32/−145 líneas; respaldo verificado.
  - `C:\dev\proyectos\onia-hermes\.claude\skills\onia-router\SKILL.md`: +7/−10 líneas; respaldo verificado.
  - `C:\Users\PC\.claude\CLAUDE.md`: +2/−2 líneas; respaldo verificado.
  - `.claude/skills/aprender-de-todo/SKILL.md`: +2/−2 líneas; sin entrada de respaldo.
  - `.claude/skills/ver-videos/SKILL.md`: +29/−19 líneas; sin entrada de respaldo.
- Archivos históricos (comparación de contenido):
  - `hermes-content/docs/historial/coordination-manifest-hasta-20261025.md` ↔ `COORDINATION_MANIFEST.md`: contenido del archivo en original 99.7%; contenido original conservado en archivo 100.0%; OK.
  - `hermes-content/docs/historial/equipo-agentes-anterior-20261025.md` ↔ `.claude\skills\equipo-de-agentes\SKILL.md`: contenido del archivo en original 97.9%; contenido original conservado en archivo 100.0%; OK.
  - `hermes-content/docs/historial/protocolo-telegram-anterior-20261025.md` ↔ `EXECUTION_PROTOCOL.md`: conserva en orden el sufijo completo del original desde el primer elemento de ruteo Telegram bajo `## Skill Routing` hasta el final (117/117 líneas fuente); el prefijo general queda fuera del archivo Telegram. OK.
  - El archivo del equipo conserva el 100% del original en orden; sus tres líneas adicionales son título, aviso de archivo histórico y separador.
- Anclas de seguridad/autoridad presentes: 12/12.
- Pruebas reportadas en el contexto: 27 dispatcher, 18 documentación y 25 fixtures inertes. No se reejecutaron y no son E2E.

## Resguardos preservados

- [x] SIAT/impuestos manual.
- [x] Google/MFA/CAPTCHA humano.
- [x] Instalaciones con aprobación.
- [x] Gastos/terceros/producción/cara-voz con aprobación.
- [x] Clientes usted/marca vos.
- [x] Client-facing con captura/video y OK.
- [x] Codex sin Git/merge/push fuera de encargo.
- [x] Worktree no aísla credenciales/permisos.
- [x] Preservar WIP/originales/evidencia.
- [x] Una sola vía de despacho.
- [x] Criterio de parada.
- [x] Hook no autoriza commit/push.

## Hallazgos y límites

- No se reprodujeron regresiones en los resguardos documentales dentro del alcance revisado.
- `.codex/hooks.json` aparece modificado en `git status`; se dejó intacto y no se inspeccionó. No consta en el manifest, así que su origen queda sin atribuir.
- No se verificó comportamiento E2E ni que esta revisión actualice el prompt de la sesión.

## Salidas

- `hermes-content/research/harness-hermes-20261024/QA-DEPURACION-20261025.md`
- `hermes-content/research/harness-hermes-20261024/qa-depuracion-20261025.json`
