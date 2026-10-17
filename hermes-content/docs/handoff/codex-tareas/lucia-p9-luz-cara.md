---
id: LUCIA-P9
carril: lucia
estado: pendiente
modelo: gpt-6.1-sol  # esfuerzo medium; composición HyperFrames con el método de G5 v2
repo: onia-hermes
rama: codex/lucia-p9  # la crea la madre al lanzar
base: main
pr:
escrita: 2026-10-11 por Lucía (nube, session_01XSzFcs1k18ijqjSHGjnzD4)
actualizada: 2026-10-11 por Lucía (nube, session_01XSzFcs1k18ijqjSHGjnzD4)
nota: Pedido de la madre marketing el 11-oct. Render y gates que usan Chromium/ffmpeg los corre quien tenga el entorno; si Codex no puede renderizar, escribe la composición y lo dice.
---
# P9 · Lucía «La cara o la escena» (pieza 9: la luz cambia cuando la cara se sostiene)

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-hermes` que creó la madre, en la rama `codex/lucia-p9`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin `npm install`, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.

Contrato pedido por la madre marketing el 11-oct. Modelo: `gpt-6.1-sol` medium. La madre lo lanza desde la PC y recibe el diff.
**Codex no ejecuta Git** (ni consultas): la madre verifica la rama, commitea e integra. Fuente: `hermes-content/docs/cola/lucia-diario/PLAN.md` §4-bis y §5 (fila 9).

## META
Un reel corto MUDO de **18 a 20 s**, 1080×1920, 24 fps, HyperFrames, con el mismo método y las mismas reglas que **G5 v2**
(`videos/lucia-g5-v2/`). Muestra con dos clips ya pagados que **sostener la cara tiene un costo en la imagen**: el clip atado a la
foto mantiene el brillo y pierde la cara; el clip con referencias gana la cara y oscurece y reencuadra. Gancho en pantalla:
**«La cara o la escena.»** (4 palabras). **0 créditos**: solo se montan clips y datos que ya existen.

⚠️ **El nombre de trabajo «La luz cambia cuando la cara se sostiene» NO puede salir como afirmación general.** Con los seis clips
medidos no se sostiene: Kling O3 con 5 referencias sostiene la cara (0,80 → 0,82) y el brillo casi no se mueve (+2,1), aunque inventa
el cuarto; Cinema Studio 3.0 sostiene la cara dentro del ruido (0,785 → 0,771) y baja el brillo 13,4. Por eso el video habla **solo de
los dos clips que muestra, una toma cada uno**, y lo dice en pantalla. Tampoco vale «la foto sola pierde la cara»: Cinematic Studio 3.0, con foto
sola, dio 0,785 → 0,771 (dentro del ruido de ±0,03; lo marcó la revisión de G2 v2). Si la madre quiere otro título, lo cambia antes de lanzar.

## DATOS (única fuente; no se escribe ninguna otra cifra)
Brillo («luma», 0 a 255): `hermes-content/references/modelos/lucia/v4/prueba-motores-20261008/medicion-luz-movimiento-20261011.txt`.
Parecido de cara (ArcFace, 8 fotos oficiales, 0 a 1, primer → último punto medido): `hermes-content/references/modelos/lucia/v4/PROCEDENCIA.jsonl`,
línea 97, clave `video_misma_foto_K1_misma_orden`. Créditos de Higgsfield, precios del 8-oct (misma línea).

| Clip | Qué es | Brillo ini → fin (Δ) | Parecido ini → fin | Créditos | Va en el video |
|---|---|---|---|---:|---|
| m1 | **Kling 3.0 std**, foto de inicio | 156,0 → 155,1 (−1,0) | 0,79 → 0,72 | 7,5 | **sí** |
| m4 | **Seedance 2.0 Mini + referencias** (foto + 3 refs) | 145,5 → 111,8 (−33,7) | 0,71 → 0,80 | 6 | **sí** (la cara pasa de 139 a 347 px: reencuadra; inventó un letrero) |
| m2 | Kling 3.0 pro | −0,4 | 0,81 → 0,74 | 9 | no |
| m3 | Seedance 2.0 Mini | −12,2 | 0,69 → 0,64 | 6 | no |
| m5 | Kling O3 (5 refs, sin foto de inicio) | +2,1 | 0,80 → 0,82 | 6 | no (cara de 89 a 168 px; inventa cuarto y plano) |
| m6 | Cinema Studio 3.0 | −13,4 | 0,79 → 0,77 | 20 | no |

Clips fuente (ya en el repo, no se descargan ni se generan): m1 `v4/kit/k1-clip-mira-camara-e470ef4f.mp4`; m4
`v4/prueba-motores-20261008/seedance-mini-refs-dd2d7c91.mp4`. La ruta y el copiado a `assets/` se hacen como en
`videos/lucia-g2-v2/scripts/build.mjs` (constantes `V4`, `KIT`, `PM`).

**Límites que el video DEBE decir** (en pantalla y en el pie, sin esconderlos):
- **Una toma cada uno: es una prueba, no una regla.**
- **El brillo es el promedio del cuadro entero: mezcla luz con encuadre y con lo que entra al plano.** Mide «cuánto cambia la imagen», no luz pura.
- **Las caras de estos clips (720p) miden menos de 200 px: el parecido es indicativo** y el ruido es de ±0,03. (0,79 → 0,72 y 0,71 → 0,80 salen de ese ruido; las diferencias son de 0,07 y 0,09.)

## Guion propuesto (la madre puede cambiarlo antes de lanzar)

Voz (SOLO texto en `guion-voz.txt`; **no se genera**). 298 caracteres, 304 con saltos de línea, ≈ 17,5 s a 17 car/s (la voz se mide en
caracteres, no en palabras); cupo `PLAN.md` §4: ≈ 305 para 18 s:

```
La cara o la escena.
Dos clips, misma foto y misma orden.
Kling 3.0 std: brillo casi igual, cara de 0,79 a 0,72.
Seedance Mini con referencias: cara a 0,80, pero la imagen se oscurece.
Una toma cada uno: prueba, no regla.
Brillo del cuadro entero: mezcla luz y encuadre.
Seguime: cada semana, una prueba.
```

En pantalla (nombres reales de D-N1, toda cifra de la tabla de arriba, redondeada a 2 decimales el parecido):
1. **Cuadro 0:** rótulo «Lucía Antelo · personaje IA de Onia» (40 px) + título **«La cara o la escena.»** sobre el clip m1, ya en movimiento.
2. **Antes de los 3 s:** pastilla «Kling 3.0 std · brillo −1,0 · parecido 0,79 → 0,72» (el resultado va antes de los 3 s).
3. **Clip m4** a pantalla completa, con pastilla «Seedance 2.0 Mini + referencias · brillo −34 · parecido 0,71 → 0,80» y el reencuadre visible (cara 139 → 347 px).
4. **Placa comparativa** de los dos clips (brillo y parecido, una barra por cada uno) con «Una toma cada uno: es una prueba, no una regla.»
5. **Nota del límite:** «El brillo es el promedio del cuadro entero: mezcla luz y encuadre.»
6. **CTA exacto** «Seguime: cada semana, una prueba.» en los últimos ≥ 2,4 s.

Pie (`pie.txt`, abre literal con «Personaje hecho con IA»):
> Personaje hecho con IA: Lucía Antelo, de @oniahq. Hice dos clips con la misma foto y la misma orden en Higgsfield y medí dos cosas en cada uno: cuánto cambia el brillo del cuadro (de 0 a 255) y cuánto se parece la cara a la de ella (ArcFace contra ocho fotos oficiales, de 0 a 1). Kling 3.0 std (7,5 créditos): el brillo casi no cambia (−1) y la cara baja de 0,79 a 0,72. Seedance 2.0 Mini con referencias (6 créditos): la cara sube de 0,71 a 0,80, pero el brillo baja 34 puntos y el encuadre cambia. Una toma cada uno: es una prueba, no una regla. El brillo es el promedio del cuadro entero y mezcla luz con lo que entra al plano; las caras de estos clips miden menos de 200 px y el parecido es indicativo. Nombro lo que uso; no es una recomendación pagada. Cada semana hago una prueba. Seguime. #inteligenciaartificial #ia #santacruz #bolivia

## Lo que se hace
1. Crear `videos/lucia-p9-luz-cara/` **copiando la estructura de `videos/lucia-g5-v2/`** (solo leer esa carpeta; no modificarla): `package.json`, `hyperframes.json`,
   `.gitignore`, `scripts/` (`build.mjs`, `timeline.js`, `estilos.css`, `voz.mjs`, `retemporizar.mjs`, `medir-dom.mjs`, `ventanas.mjs`, `hueco-tarjetas.mjs`, `eventos.mjs`,
   `aire.mjs`, `costuras.mjs`, `grep-prohibidas.mjs`, `pixeles.mjs`), `assets-fijos/` y la plantilla de `plan.json`. Leer antes `.claude/skills/lucia/SKILL.md`,
   `.claude/skills/lucia/montaje-hyperframes.md` y el README de G5 v2.
2. Adaptar `plan.json` y `build.mjs` a estos dos clips. **`build.mjs` debe cortar el build si una cifra mostrada o escrita en el pie no coincide**, redondeada, con
   `PROCEDENCIA.jsonl` l.97 (parecido, créditos) o con `medicion-luz-movimiento-20261011.txt` (brillo); y si el pie no abre con «Personaje hecho con IA».
3. Tiempos: tramos de voz por **caracteres a 17 car/s** (`voz.mjs`), pausa entre frases ≤ 0,25-0,3 s, sin acelerar. Tarjetas con su tiempo de lectura (`ventanas.mjs`).
   Costuras rígidas de 6 cuadros. **Regla 15:** ningún tramo quieto > 0,3 s fuera de una tarjeta en lectura; un evento visible nuevo cada ≤ 2 s.
4. Renderizar el master (`flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4`), muxar audio AAC **en silencio**
   y guardar `out/p9-final-1080x1920.mp4` (`out/` y `renders/` no van a git). Preview 360p en `qa/`.
   **Si Codex no puede renderizar** (en la PC de la madre dio `EPERM` el 9-oct; Chromium y ffmpeg pueden estar bloqueados), NO es motivo de parada: escribe la composición, corre
   `build.mjs` y todo lo que sí pueda, y deja en el `README.md` de la carpeta el comando exacto de render y de cada gate pendiente. El render, el master y los gates que miden píxeles o
   abren Chromium los corre entonces la madre, y dice en el resumen cuáles quedaron para ella.
5. `README.md` de la carpeta: qué es, SHA-256 del master, cada decisión tomada con cómo revertirla, y **«Lo que no se pudo cerrar»** (sin disfrazarlo).

## ARCHIVOS QUE TOCA
- **Crea** solo `videos/lucia-p9-luz-cara/**` (más `qa/*` de esa carpeta).
- **No toca:** `videos/lucia-g1-v2`, `g2-v2`, `g3-v2`, `g4-v2`, `g5-v2` (hay otros agentes trabajando ahí), `videos/lucia-entrega/` (la madre lo actualiza), la cola, `PLAN.md`,
  `.claude/skills/**`, nada de `onia-platform`.

## PRUEBA DE HECHO
Todo con exit 0 y el resultado pegado en `qa/` (los puntos que exigen render o Chromium: los corre Codex si puede; si no, la madre, según el punto 4 de «Lo que se hace»):
- `hyperframes check`: 0 errores (los avisos de estilo se listan).
- `eventos.mjs` + `aire.mjs`: la regla 15 con su exención de lectura y los números medidos; `ventanas.mjs`: todas las tarjetas alcanzan su tiempo de lectura;
  `hueco-tarjetas.mjs`: 0 cuadros sin tarjeta; `costuras.mjs`: costuras rígidas; `grep-prohibidas.mjs`: 0 coincidencias.
- `medir-dom.mjs`: nada sobre y = 292, nada cortado, nada sobre la cara.
- Master: H.264 1080×1920 24 fps, AAC en silencio (≈ −91 dB), duración 18-20 s, CTA ≥ 2,4 s, rótulo de IA a 40 px **desde el cuadro 0**, título legible en el cuadro 0,
  una cifra en pantalla **antes de los 3 s**.
- `build.mjs` verde (cifras y pie contra las dos fuentes) y `index.html` idempotente (dos builds, mismo md5).
- Cuadros alineados con su clip fuente (PSNR ≥ 35 dB contra el cuadro fuente escalado, como `psnr-clips` de G2 v2) y el reencuadre del clip m4 visible.
- Una hoja de contacto a 2 fps **mirada** (el resumen dice qué se vio), no solo medida.

## REGLA DE PARADA
- **Sin gasto:** ni Higgsfield, ni voz (ElevenLabs), ni ningún servicio pago. **No generar voz**: `guion-voz.txt` es texto; la voz la decide la madre.
- **Sin publicar** nada, ni subir el reel a ningún lado. Nada sale sin «mostrada, publicá <pieza>» de la madre.
- **Sin instalar ni descargar** nada sin pedir; no usar red.
- **No fabricar:** ninguna cifra fuera de las dos fuentes; ninguna afirmación general («la luz cambia cuando la cara se sostiene»); ninguna herramienta que no esté en la lista
  de nombres de D-N1; sin «el mejor», sin logos ni capturas de terceros, sin producto de Onia, sin profesión, sin cara ni voz de Sergio Urcullo.
- Si algo del contrato choca con los datos o con el código, **parar y devolverlo** en vez de forzarlo.
- **Git:** ninguno. La madre verifica la rama y commitea.

## QUÉ DEVUELVE
Resumen de máximo 25 líneas: qué se hizo, SHA-256 y specs del master, cada gate con su exit code, qué cuadros se miraron y qué se vio, lo que no se pudo cerrar y lo que
necesita decisión de la madre. Revisión independiente (sonnet) y verificador (haiku) las pone la madre después, igual que en G2-G5.
