# Marca Claude / Anthropic — assets oficiales para edición

Bajados del set oficial de iconos (lobehub icons-static, sincronizado con la marca) el
2026-09-18, a pedido de Sergio: "mirá los otros logos de claude, descargalos para tenerlos".

| Archivo | Qué es | Cuándo usarlo en video |
|---|---|---|
| `claude-color--*.png` | Starburst terracota (icono oficial de Claude) | mención hablada de "Claude"; versión dark/light según fondo |
| `claude--*.png` | Starburst monocromo | fondos donde el terracota choca |
| `claude-text--*.png` | Wordmark "Claude" (serif oficial) | titulares/cierres donde va el nombre |
| `anthropic--*.png` · `anthropic-text--*.png` | Logo y wordmark Anthropic | solo si se habla de la empresa |
| `claudecode.svg` | Glifo oficial de Claude Code (la criaturita pixel) | mención de "Claude Code"; rasterizar como lockup (receta abajo) |
| `*.svg` | Vectores de todo lo anterior | cualquier tamaño; `fill=currentColor` → colorear por CSS |

**Regla dura (Sergio, 18-sep):** mención de marca → logo ORIGINAL en pantalla. NUNCA
recrear un logo a mano ("poné la original" — la recreación pixel fue rechazada).

**Receta lockup Claude Code** (ya hecho): `videos/tiktok-20260917/assets/cc-lockup.html`
incrusta `claudecode.svg` en color `#D97757` + "Claude Code" Inter 800 blanco → se
rasteriza con `make-mockup.mjs --template custom` (salida con alpha:
`videos/tiktok-20260917/assets/card-cc-wordmark.png`).

Los `_chk-*.jpg` son miniaturas de verificación, ignorables.
