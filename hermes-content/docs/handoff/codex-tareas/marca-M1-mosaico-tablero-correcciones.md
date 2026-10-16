# M1 · Molde mosaico-tablero: tres correcciones de render (Marca personal)

Modelo: `gpt-6.1-sol` · esfuerzo `medium`. Carril: Marca personal de Sergio Urcullo. Lo lanza la madre desde la PC.

Repo: onia-hermes. Carpeta de trabajo: `videos/moldes/mosaico-tablero/`. Antes de tocar nada leé `videos/moldes/mosaico-tablero/README.md` (qué es el molde y cómo se corre HyperFrames). No ejecutes git, ni siquiera consultas: no commitees; dejá los cambios sin commitear y el mensaje propuesto en el resumen. No publiques nada. No instales nada (HyperFrames 0.8.65 ya está; usalo con `--offline`).

## META
Corregir en `videos/moldes/mosaico-tablero/index.html` los tres defectos que dejó el render de prueba del 9-oct y que la madre midió al mirarlo:

1. **Rótulo de prueba.** La barra de marca (línea 87, `<div class="brand">`) lleva `<span>PRUEBA DE EDICIÓN</span>`. Sacá ese `<span>`; queda solo `SERGIO URCULLO`.
2. **Hueco de ~0,47 s a los 23 s (medido por la madre; en el código son 0,45 s).** El mosaico entra a los 23,00 s (la costura `tablero-mosaico` del bloque autogenerado), pero las cuatro tarjetas (`#mosaic .tile`) recién empiezan a los 23,45 s (`tl.fromTo('#mosaic .tile', … , 23.45)`), así que entre 23,00 y 23,45 la escena está vacía. Adelantá el inicio de las tarjetas a **23,05 s** para que entren con la costura. Mantené `duration:.48` y `stagger:.1`. Revisá que `#mosaic-caption` (24,55 s) y `#cta` (27,15 s) sigan después de que las tarjetas terminen (deben terminar antes de ~23,9 s).
3. **«· link en mi perfil» huérfano.** En el cierre (línea 171) la segunda línea del CTA empieza con un punto medio suelto: `<span class="cta-label">Asesoría gratis</span>· link en mi perfil`. El `.cta-label` es `display:block`, así que el `·` queda solo al inicio del renglón. Dejá el CTA como dos renglones limpios: `Asesoría gratis` / `Link en mi perfil` (sin el `·`, con «L» mayúscula). Un solo CTA, con voseo como está.

Además, en `README.md` del molde agregá al final una sección corta «Correcciones del 11-oct» con esas tres líneas y lo que NO se pudo validar (ver Regla de parada). Nada más en el README.

## PRUEBA DE HECHO
Todo esto se comprueba sin navegador (en el sandbox el navegador no arranca: `spawn EPERM`):

- `grep -c "PRUEBA DE EDICIÓN" videos/moldes/mosaico-tablero/index.html` → `0`.
- En `index.html` no queda `23.45` y existe `#mosaic .tile` con inicio `23.05`: `grep -n "23.05" videos/moldes/mosaico-tablero/index.html` muestra esa línea.
- `grep -c "</span>· link" videos/moldes/mosaico-tablero/index.html` → `0`, y `grep -c "Link en mi perfil" videos/moldes/mosaico-tablero/index.html` → `1`.
- El bloque entre `<seams:auto>` y `</seams:auto>` queda **idéntico** (no lo edites a mano) y `ledger.json` queda sin tocar.
- Desde la carpeta del molde: `npx --offline hyperframes@0.8.65 lint` → **0 errores** (las 7 advertencias de modularización que ya existían se quedan).
- Mostrá en el resumen el diff exacto de las tres líneas cambiadas.

## REGLA DE PARADA
- **No uses el molde en ninguna pieza ni lo publiques.** Muestra un «tablero» (Agenda, Clientes, Cobros, Chat) = función del producto sin la tabla «se promete / funciona»; sigue esperando la revisión de Sergio Urcullo (README del molde).
- Si el navegador no arranca, **no declares validado el render**: decí «no validado visualmente» y PARÁ. La madre renderiza en la PC y mira el cuadro a 23,2 s para confirmar que las tarjetas ya están en pantalla.
- Si para el punto 2 hace falta cambiar el `ledger.json` o regenerar las costuras, PARÁ y avisá: no es parte de esta tarea.
- No cambies textos, números ni colores fuera de lo pedido. No agregues audio, música ni íconos.

## Archivos
- Editar: `videos/moldes/mosaico-tablero/index.html`, `videos/moldes/mosaico-tablero/README.md`.
- No tocar: `videos/moldes/mosaico-tablero/ledger.json`, `hyperframes.json`, `assets/`.
