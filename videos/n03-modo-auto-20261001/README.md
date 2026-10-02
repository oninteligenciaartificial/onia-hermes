# N03 · El modo auto de Claude Code (grabado 1-oct, editado 2-oct)

Receta del lote del 17-sep (`videos/tiktok-20260917/README.md`). ⚠️ **No es la que Sergio Urcullo reconoce como suya:** ésa es la del reel de Codex del 14-sep (`hermes-content/references/video-intake/2026-09-14-reel-astra-fable-codex/RECETA.md`), encontrada el 2-oct después de esta edición. Este video se rehace con esa receta.
La primera versión (corte + karaoke + recuadros verdes) la rechazó: «no lo hacés como antes».

- **Bruto:** Drive, carpeta «Videos Onia Octubre» (`A0550B92-….mp4`, 67 s, HEVC 1080×1920 SDR). No se versiona.
- **Corte** (`scripts/cutplan.json`, aprobado por Sergio Urcullo el 2-oct): silencios a −27 dB (su micrófono deja el
  ruido en ~−25 dB) + 4 cortes finos de sonido sin palabra + la frase «Esto es lo que deja de pasar» y el «de» del
  segundo «deja de pasar» (decía lo contrario de lo que hace el modo auto) + la trabada «como lo puedes ver vos y vos».
- **Transcript:** Whisper medium, corregido a ojo (`segments-fixed.json`): Claude Code, deploys, force push,
  Shift+Tab, .claude, comentá COMUNIDAD.
- **Apoyos** (`assets/`, plantillas del 17-sep, contenido del drop N03 verificado contra la doc oficial): logo oficial
  de Claude Code, MODO AUTO, «otro modelo revisa», BLOQUEA, DEJA PASAR, ROMPE PRODUCCIÓN, Shift+Tab, pantalla completa
  de `.claude/settings.json`, MANUAL MODE ON, COMENTÁ «COMUNIDAD». Tiempos tomados de las palabras (sync).
- **Render:** `node scripts/build-17sep.mjs` (una pasada: corte + zoom punch + apoyos + karaoke apple, CRF 14) →
  `sfx.mjs` con `scripts/sfx-plan.json` (pop en cada apoyo, whoosh en la pantalla completa, ducking) → `master.mjs`
  (−14 LUFS). 57,9 s.
