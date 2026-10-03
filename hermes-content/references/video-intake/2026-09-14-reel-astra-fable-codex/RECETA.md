# Receta del reel «GPT-6 Astra vs Fable 5.1» — la edición que Sergio Urcullo reconoce como suya

> Editado por **Codex el 14-sep-2026** (32,0 s). El 17-sep Sergio Urcullo se lo mostró a Claude como el ejemplo a
> seguir: *«tenés un ejemplo de un video que editó codex, revisalo»*. Los 4 TikToks del 17/18-sep
> (`videos/tiktok-20260917/`) copiaron su look y él los agendó. Hasta el 2-oct la receta vivía solo en
> `C:\Users\PC\Downloads\astra-fable-social-edit\` (fuera de git): por eso ninguna sesión la tenía y el 2-oct
> salió la edición básica «corte + karaoke + recuadros» que él rechazó («no lo hacés como antes»).
> Rescatada por la sesión madre el 2-oct. Acá: `edit.py` (el script real), `README.md` de Codex,
> `build/filtergraph.txt`, `build/captions.ass`, las 6 tarjetas y las hojas de control. El MP4 no se sube.

## Lo que la hace buena (en orden de importancia)

1. **Un panel por bloque hablado, y el panel cambia justo en el corte.** El salto de corte queda escondido
   detrás del cambio de pantalla. Es el movimiento clave (`edit.py:283-302`).
2. **Layout partido sin barras:** arriba un panel oscuro de 720 px con el mockup; abajo la cara a lo ancho
   (`crop=1080:1200:0:250`, desde y=720). Entre los dos, una banda #111219 al 92 % (y 720-830) que lleva el
   subtítulo (`edit.py:280`).
3. **Mockups dibujados por código, uno por dato** (`edit.py:60-191`): ventana con los tres puntos (rojo,
   amarillo, verde), título en mono mayúsculas, contador «NN / 06» y pie de sección. Fondo #090A0F, panel
   #161820. Azul #78A9F8 contra naranja #E6A47B para los dos modelos; píldoras, barras, editor de código,
   escudo. Cada mockup muestra la cifra real de lo que se está diciendo.
4. **Entrada lateral de 340 ms**, alternando derecha e izquierda, con el panel anterior todavía debajo. **Sin
   zooms.**
5. **Subtítulos como frases, no karaoke:** 1-5 palabras en mayúsculas, Segoe UI Bold 54, #F4F1EA, borde de
   2 px, centrados en (540, 775) dentro de la banda (`edit.py:213-254`).
6. **Corte:** 6 bloques elegidos a mano sobre la transcripción local (`edit.py:31-38`), recorte suave de
   pausas: 35,4 s → 32,0 s.
7. **Audio:** solo voz, sin SFX ni música. Pasa-altos 80 Hz, compresor suave, −14 LUFS (`edit.py:281`).
   Exporta H.264 CRF 19 veryfast, 30 fps, AAC 192k.

Versión 3 del reel: Sergio Urcullo pidió sacar las barras laterales y después *«transiciones… mockups y
pantallas grandes mientras hable»*.

## Cómo grabar para que esta receta funcione

- iPhone vertical 1080×1920, **SDR** (el original era SDR; si la cámara graba HDR, apagarlo).
- Cara y hombros en la franja central del cuadro: se usa la zona y 250-1450 y el resto se recorta.
- **Hablar por bloques:** una idea por bloque, con una pausa clara entre bloques. Cada bloque va a tener su
  propio panel, y el corte cae en esa pausa.
- Decir datos concretos (cifra, nombre, paso): cada bloque se ilustra con el mockup de ese dato.
- Largo de referencia: 30-40 s por reel.

## Lo que sumaron los TikToks del 17/18-sep (Claude, sobre esta base)

Corte por silencios ≥0,4 s a −32 dB con 0,06 s de aire + muletillas por energía + microcirugía de trabas;
zoom-punch por bloque [1, 1,06, 1,03, 1,09]; tarjetas oscuras calcadas de Codex (`card-dark.html`); palabras
clave grandes Inter 900 con subrayado naranja; logo oficial al nombrar la herramienta; ortografía revisada
antes de quemar; karaoke `--style apple`; pop/whoosh con la voz a −5 dB; CRF 14 slow. Detalle:
`videos/tiktok-20260917/README.md`. **Ojo:** el reel de Codex NO tenía zooms, karaoke ni SFX; son dos estilos
emparentados. Ante la duda, gana el de Codex, que es el que Sergio Urcullo señaló.
