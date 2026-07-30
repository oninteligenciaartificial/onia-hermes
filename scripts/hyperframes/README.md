# scripts/hyperframes — apoyos visuales ANIMADOS de ONIA

Las 5 composiciones de apoyo (Stat, Browser, Phone, Quote, LowerThird) sobre
**HyperFrames** (HTML + GSAP), el motor de video de la casa.

Reemplazan al PNG estático de `make-mockup.mjs` y al porte anterior en Remotion
(`scripts/remotion/`, ver "Relación con scripts/remotion" abajo).

Fondo transparente · render local · costo cero · determinista.

---

## Uso

```bash
# lista de composiciones
node scripts/hyperframes/render.mjs --list

# secuencia PNG con alpha (el camino del pipeline)
node scripts/hyperframes/render.mjs --comp Stat --out assets/stat \
  --props '{"value":"6","label":"DOCTORES"}'

# con captura y tamaño propio
node scripts/hyperframes/render.mjs --comp Browser --out assets/web \
  --props '{"urlLabel":"dentalgest.com","image":"capturas/panel.png"}' \
  --width 1400 --duration 4

# props desde archivo
node scripts/hyperframes/render.mjs --comp Quote --out assets/cita \
  --props-file props/cita.json
```

| Flag | Default | Notas |
| ---- | ------- | ----- |
| `--comp` | — | `Stat` · `Browser` · `Phone` · `Quote` · `LowerThird` |
| `--out` | — | carpeta si `png-sequence`; archivo si no |
| `--props` / `--props-file` | `{}` | mismo objeto que los `defaultProps` de antes |
| `--width` `--height` `--duration` `--fps` | los del HTML | `--duration` en segundos; `--fps` sólo 24/30/60 |
| `--accent` `--theme` | `#FF7A00` · `dark` | overrides sueltos, ganan sobre `--props` |
| `--format` | `png-sequence` | `png-sequence` · `webm` · `mov` · `mp4` |
| `--quality` | `high` | `draft` para iterar |
| `--keep-build` | off | conserva el proyecto temporal en `.build/` |
| `--dry-run` | off | resuelve y sale sin renderizar |

### Por qué `png-sequence` es el default

El ffmpeg local de esta máquina (gyan.dev 8.1.1) **no decodifica el alpha de
WebM VP8/VP9**: al leerlo de vuelta el canal vuelve siempre opaco (verificado
encodeando a mano, sin motor de video de por medio). La secuencia PNG lleva alpha
real y `overlay-visuals.mjs` ya sabe consumir una carpeta de PNGs numerados.

Verificado en este porte (`frame_000045.png` de Stat): `pix_fmt=rgba`, alpha
`min=0 / max=255`. El frame 1 sale `min=0 / max=0` (totalmente transparente),
que es correcto: la tarjeta arranca en opacidad 0.

---

## Editar una composición

Cada composición es un **proyecto HyperFrames standalone** en
`compositions/<slug>/index.html`. Se puede trabajar directo con el CLI:

```bash
cd scripts/hyperframes/compositions/stat
npx hyperframes check                    # gate: lint + runtime + layout + motion + contraste
npx hyperframes snapshot --at 0.1,0.5,1.5  # frames sueltos para revisar
npx hyperframes preview                  # Studio
```

`render.mjs` no edita estos archivos: copia la composición a `.build/`, inyecta
la geometría y renderiza. La fuente de verdad es el `index.html`.

### Reglas al tocar el HTML

1. **Ningún token CSS puede llamarse igual que una variable declarada.**
   HyperFrames aplica cada variable escalar como custom property `--{id}` en el
   root. Quote declara `text` → `--text`, que pisaba el token de color `--text` y
   dejaba el texto ilegible. Por eso los tokens de color se llaman `--ink-text`,
   no `--text`. (`--accent` sí es intencional: la variable `accent` alimenta el token.)
2. **`box-sizing: border-box` global es obligatorio** — es lo que hace Remotion de
   fábrica y lo que mantiene anchos y paddings donde corresponde.
3. **La geometría del root (`data-duration`/`data-width`/`data-height`) se congela
   en compilación.** No se puede cambiar por `--variables`; por eso existe el paso
   de build en `render.mjs`.
4. Las curvas `oniaOutExpo` / `oniaOutQuart` son **marca** (las mismas
   `--ease-out-expo` de web-factory). No sustituir por `power4.out`.
5. El acento de las tarjetas es una **regla horizontal corta al pie**, nunca una
   franja vertical en el borde izquierdo (patrón prohibido por diseño).
6. **La tipografía es la de marca y se autohospeda.** El trío
   (`ONIA_BRAND_IDENTITY_2026.md` §2) es Bricolage Grotesque para titulares y
   etiquetas, DM Sans para texto de apoyo y Spline Sans Mono para cifras y URLs.
   Se usan por token (`var(--font-display)` / `--font-body` / `--font-mono`),
   nunca escribiendo el nombre de la familia suelto, y **jamás** una fuente del
   sistema (`system-ui`, `Segoe UI`): el renderer las aliasea a Roboto y el frame
   pasa a depender de la máquina.
   - Los `.woff2` viven en `compositions/<slug>/fonts/` y **no se editan a
     mano**: los reparte `hermes-content/brand/fonts/build-onia-fonts.py`, que es
     la fuente única. Tienen que estar adentro de la composición porque
     HyperFrames sirve cada una con su carpeta como raíz y rechaza por lint los
     assets con `../` por encima.
   - Peso máximo de Bricolage: **700**. El 800 está prohibido por marca y ni
     siquiera existe en el archivo (los ejes vienen recortados).
   - `render.mjs` copia `fonts/` al proyecto temporal. Si algún día se toca esa
     copia, el render **no falla**: el file server tira 404 y el frame sale con
     una fuente del sistema, en silencio. Se detecta mirando el log del
     compilador — tiene que decir `Embedded local font file: fonts/…`.
     `hyperframes check` NO lo detecta (corre dentro de la composición, donde
     `fonts/` sí existe).

---

## Relación con `scripts/remotion/`

`scripts/remotion/` **sigue en pie a propósito**, como baseline de comparación.
No se dio de baja todavía. El detalle del porte, las desviaciones deliberadas y
los números de SSIM contra esa baseline están en
[`TRANSLATION_NOTES.md`](TRANSLATION_NOTES.md).

---

## Estructura

```
scripts/hyperframes/
├── render.mjs                 CLI (paridad con scripts/remotion/render.mjs)
├── TRANSLATION_NOTES.md       qué se perdió, qué se desvió y por qué
├── compositions/
│   ├── stat/index.html        tarjeta de dato con contador
│   ├── browser/index.html     ventana de navegador con wipe de captura
│   ├── phone/index.html       mockup de celular con deriva de pantalla
│   ├── quote/index.html       revelado tipográfico palabra por palabra
│   └── lower-third/index.html placa inferior que entra y sale
└── .build/                    proyecto temporal por render (gitignored)
```
