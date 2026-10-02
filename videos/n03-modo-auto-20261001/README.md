# N03 · El modo auto de Claude Code (grabado 1-oct, editado 2-oct)

## ▶ Versión vigente: receta de Codex (`scripts/edit-codex.py`, 2-oct)

Es la edición que Sergio Urcullo reconoce como suya: el reel «GPT-6 Astra vs Fable 5.1» que Codex editó el 14-sep
(`hermes-content/references/video-intake/2026-09-14-reel-astra-fable-codex/`). Se portó su `edit.py` casi línea por línea:
- **9 paneles oscuros** arriba (720 px), uno por idea, dibujados con Pillow y con los datos del drop N03.
- **Entrada lateral de 340 ms** alternada, con el panel anterior debajo.
- **La cara a lo ancho** abajo (`crop=1080:1200:0:430`).
- **Subtítulo en frases** en mayúsculas, en la banda.
- **Sin zoom, sin karaoke y sin SFX**; voz con pasa-altos y compresor, a −14 LUFS.

Cambios contra Codex:
- **Corte:** el plan aprobado (14 tramos con fundido de 12 ms).
- **Momento del cambio de panel:** cambia en el corte si la idea cambia ahí; si no, en la palabra que abre la idea
  (`SWITCH`).
- **Fuentes:** Inter y JetBrains Mono en vez de Segoe y Consolas.
- **Íconos:** la ✕ y la ⏸ se dibujan, porque esas fuentes no las tienen y salían como rectángulos.

Rehacer: `N03_DIR=<carpeta con raw/bruto.mp4 y scripts/cutplan.json> python3 scripts/edit-codex.py`. Con `--cards` sólo
saca los paneles, para mirarlos antes del render. El render de 58 s tarda unos 2 min y sale a −14,5 LUFS.

## Historia: la versión con la receta del 17-sep (rechazada)

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
