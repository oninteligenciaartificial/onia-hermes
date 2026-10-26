# Propuesta de clasificación de skills — 2026-10-25

**Alcance.** Se clasifican los 60 manifiestos físicos de `Hermes default`. Las categorías son una propuesta de organización; no describen el estado de activación ni autorizan cambios.

**Criterio.** Mantener en `nucleo` lo transversal de proceso, QA e investigación; conservar `por_tarea` bajo demanda; `ocultar_en_windows` solo cambia visibilidad; `candidata_desactivar` exige decisión posterior. Recuento: núcleo 12, por tarea 39, ocultar en Windows 4, candidatas 5.

**Windows.** `apple-notes`, `apple-reminders`, `findmy` e `imessage` declaran `platforms: [macos]`. El coordinador verificó que ya quedan fuera del catálogo Windows observado: conservar el filtro, no borrar ni afirmar un ahorro nuevo.

**Candidatas de baja prioridad.** Revisar `ascii-video`, `manim-video`, `p5js`, `songsee` y `songwriting-and-ai-music`: son formatos/dominios especializados de arte, animación o audio, fuera de la prioridad actual. La categoría no se basa en falta de registro y no implica desactivación automática.

**No confundir inventarios.** El inventario ampliado cuenta 1.546 entradas con aliases, 1.514 manifiestos físicos únicos y 445 nombres; no son 1.546 skills activas. Los 1.268 `SKILL.md` recursivos de Claude incluyen, entre otros, `gstack` (525), `everything-claude-code` (429), `.trash` (127) y `synced` (75); solo 113 están directamente bajo esa raíz. `C:/Users/PC/.agents/skills` resuelve al `.agents/skills` del repo y no es una copia adicional. El conteo de 53 del filtro nativo enabled-only proviene del contexto de auditoría; no se pudo revalidar porque `hermes` no está en PATH.

**Uso observado.** El ledger contiene registros de 20 nombres y cuenta eventos `skill_view`; no acredita lectura del skill del repo, aplicación exitosa ni resultado. Ausencia de registro no significa cero uso. No recomiendo desactivar/borrar por falta de lecturas.

**Consolidación del repo.** El JSON determinista compara los 30 nombres compartidos: 29 manifiestos son iguales normalizando LF y 13 carpetas completas (soportes incluidos; excluye `.git`, `node_modules` y `__pycache__`) son idénticas. Quedan como candidatos condicionados, no para borrar: `AGENTS.md` hace canónica `.claude/skills` para skills ONIA/Codex; `CLAUDE.md` documenta HyperFrames en ambas raíces locales y dice que el repo gana sobre la copia global; `CODEX_SKILL_ROUTING.md` conserva una ruta previa distinta. La precedencia entre raíces locales y sus consumers/imports no queda cerrada; mantener ambas hasta reconciliarla. Las seis skills de producto siguen protegidas. Nada se activa ni borra.

El detalle verificable por manifiesto, evidencia y registro del ledger está en `clasificacion-skills-hermes-20261025.json`.

**Verificación del coordinador:** los 60 nombres coinciden exactamente con el inventario, sin omisiones o repeticiones, todas las categorías tienen motivo/evidencia y las cantidades coinciden con las filas. Se cotejaron las cuatro plataformas macOS y los13pares de carpetas con la prueba determinista. El conteo nativo de53 sí fue medido por Hermes en la PC y está guardado en `discovery-nativo-20261025.json`; la limitación PATH del hijo solo afecta su propia revalidación. Validación: `validacion-clasificacion-20261025.json`.
