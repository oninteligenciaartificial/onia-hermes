# Receta Santiago Muñoz — talking head editado con código

`santiago.py` toma **bruto + cutplan + transcript (en tiempo de salida) + storyboard** y devuelve el MP4
1080×1920 a 30 fps con la receta medida en 4 reels de @sanmunoz.ia (Forja, Animaciones, Jev y Sonnet 5.5).
Los tiempos salen de las **palabras** del transcript, no se escriben a mano.

```bash
cd .claude/skills/edicion-referentes/scripts/santiago
python3 santiago.py \
  --bruto bruto.mp4 --cutplan cutplan.json --transcript segments-cut.json \
  --storyboard storyboard-n03.json --out salida/video.mp4
#   --plan        solo imprime la línea de tiempo, el aire y el control contra la receta (no renderiza)
#   --fotos 0.5,12,30   renderiza esos segundos a PNG para mirar antes del render completo
#   --solo-hoja   rehace la hoja de control de --out
#   --sin-aire    deja el ritmo del corte tal cual (no abre las uniones de frase)
```

Sale: `video.mp4`, `sheets/sheet-NN.jpg` (2 fps, 216 px, segundo impreso, 5×4) y `work/` (análisis del bruto en
caché, transcript en el tiempo NUEVO, voz cortada / limpia / masterizada). 65 s tardan ≈2 min (+30 s la primera
vez, que analiza el bruto). Necesita ffmpeg, Python con Pillow/numpy/scipy/opencv, Inter y JetBrains Mono
instaladas, y Node + Playwright solo si faltan capturas (`capturar.mjs` las saca solo).

## Entradas

| Entrada | Formato |
|---|---|
| `--cutplan` | `{"keep": [{"start","end"}…]}` en segundos del bruto (el corte ya aprobado por Sergio Urcullo) |
| `--transcript` | `{"words": [{"word","start","end"}…]}` **en tiempo de salida** del cutplan, corregido |
| `--storyboard` | JSON: `camara` (opcional, pisa la receta), `capturas`, `logos_svg`, `zooms`, `escenas` (ver `storyboard-n03.json`) |

**Storyboard.** Cada escena tiene `layout` (`split` panel arriba / `full` cara completa / `pip` persona reducida:
lámina con la toma en una ventana del 40 % del ancho / `lamina` sin cara), `fondo` (`oscuro` | `papel`), `desde` y
`elementos`. Un disparador es una frase del transcript (`"todos los planes"`, `"claude#2"` = segunda vez) o un objeto
`{"frase", "n", "offset", "fin", "corte": true}`; `"corte": true` lo pega al corte del cutplan **o al salto interno
del bruto** que caiga en la pausa de antes de la palabra, para que el cambio de apoyo tape el salto de la cara.
Tipos de elemento: `captura` (página oficial en marco de navegador, con `marcas` sobre frases reales), `clip`
(grabación oficial, congelada o en `play`), `texto` (`*acento*` en verde), `pildora`, `pildoras`, `sello` (lado largo
≤320 px, se achica solo), `logo`, `caja`, `flecha`, `fila` (`alto` opcional), `teclas`, `tarjeta` (CTA), `credito`.
`zooms`: `golpe` (+3 %, vuelve en 0,13 s) o `punch` (×1,10-1,22 sostenido; si su `hasta` cae en un corte, vuelve en
seco y el salto se lee como punch-out). Las transiciones se deducen del layout (fundido 0,2 s entre paneles y entre
lámina y persona reducida, cámara que sube 0,33 s / baja 0,27 s, barrido 0,3 s con `"entrada": "barrido"`).

## Lo que fija el script (receta verificada con QA, 3-oct)

- **Encuadre por toma.** El bruto puede traer tomas pegadas: el script detecta los saltos internos (pico aislado de
  diferencia entre cuadros) y mide la cara de cada toma con Haar. Cada toma se normaliza (mismo ancho de cara, misma
  x) con escala base 1,08. Ojos al 67,5 % en el split y al 46 % en cara completa; entre layouts solo traslada
  (≈400 px, escala 1,00). Si a una toma le falta bruto abajo para subir la cara, sube su escala (tope 1,18; el cambio
  cae en el corte de toma) y lo que quede se rellena en espejo (≤40 px).
- **Aire.** Abre puntos y comas hasta 3,0 palabras/s (receta 2,65-3,2) con pausas de 0,34-0,52 s, nunca más de 0,56.
  En un corte del cutplan corre el borde sobre el silencio que el corte había sacado (video real); adentro de una
  toma estira el silencio (≤0,12 s de video a cada lado, cuadros fundidos) y mete tono de sala del bruto. Va primero
  donde no se ve la cara (lámina), después cortes, ventana reducida y, al final, cara visible solo si la pausa real ya
  tenía ≥0,05 s. Las pausas de más de 0,56 en un corte o salto se recortan.
- **Sonido.** Solo voz: puerta espectral (−15 dB a la sala) → compresión 2:1 → −13 LUFS → limitador (TP ≤ −1,5) →
  puerta por habla (−14 dB fuera de la voz, abre 50 ms antes). Piso de las pausas p1 ≈ −53 dBFS (referentes −41/−55).
- Split con costura en y=900 (46,9 %) · subtítulo sin caja, Inter Black en minúsculas, blanco con contorno y sombra,
  palabra activa amarilla `#FDC82F` (1 cuadro translúcida), bloques de 1-3 palabras, en la costura (split), al 77 %
  (cara) o al 80 % (lámina y ventana), y acompaña a la cámara cuando sube o baja · acento de marca verde ONIA
  `#10C26B` (su naranja no se copia) · sellos amarillos rotados −8°, 1-2 palabras.
- Al final imprime el control contra la receta: duración, reparto de layouts, tramo sin cara más largo, ojos y paso
  split→cara, escala por toma, cortes y saltos a la vista, elementos por 10 s, pausas reales (de la voz, no de
  Whisper), palabras/s con el método del QA (palabras ÷ duración), gancho, cola; y después del render, LUFS/LRA/TP,
  pausas medidas en el audio final y el piso p1.

## Para un video nuevo

1. Corte aprobado (`editor-videos/scripts/cut-plan.mjs`) y transcript corregido en tiempo de salida.
2. Copiá `storyboard-n03.json`, cambiá `capturas` (URL oficial + frases a marcar) y escribí una escena por idea, cada
   una disparada por su frase; los cambios de escena con `"corte": true` siempre que haya un corte en la pausa.
3. `--plan` hasta que el control dé verde, `--fotos` en los cambios, render, y mirar `sheets/` antes de entregar.

## Trampas ya pagadas (prueba N03, 3-oct)

- **Los finales de palabra de Whisper mienten hasta 0,4 s.** «completamente.» terminaba a 37,31 según Whisper y la voz
  seguía sonora hasta 37,75 (energía 80-1000 Hz, espectro no plano). Las pausas se miden con la energía del bruto; las
  de Whisper solo orientan. Dos palabras de duración 0 (`'por' 12,52-12,52`) comparten la misma pausa: se cuenta una.
- **El bruto ya venía editado:** 5 saltos internos (13,33 · 19,60 · 34,10 · 43,93 · 61,57). El de 34,10 caía en medio
  de un split y el control decía «a la vista: ninguno» porque solo miraba el cutplan.
- **afftdn no limpia esta sala:** nr=15:nf=-45 bajó el piso 2 dB; el ruido es de 50-800 Hz y no estacionario. Tampoco
  un expansor por nivel: tras normalizar, la sala queda a −27 y una sílaba suave a −25. Funciona puerta espectral +
  puerta llaveada por la máscara de habla del bruto (0 % de voz fuerte atenuada, medido).
- **El tono de sala se elige por el máximo, no por el promedio:** con el promedio entró la cola de una palabra y sonaba
  un golpe a −19 dBFS en medio de la pausa nueva.
- **No hay cierre que se pueda inventar:** el remate de 3-4 s antes del CTA y la despedida necesitan una toma nueva de
  Sergio Urcullo; no se arman con palabras recortadas de otra frase.
