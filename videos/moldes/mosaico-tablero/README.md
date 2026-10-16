# Mosaico / tablero — prueba, 9-oct-2026

META: probar la gramática del reel DePBfHouarG con contenido propio.
PRUEBA DE HECHO: composición completa de 30 s, 1080×1920, sin audio.
REGLA DE PARADA: revisión de Sergio antes de usar el molde. No publicar. No tocar git.

## Receta

| Prueba | Qué hace | Cuadro fuente del reel |
|---|---|---|
| 0–2,5 s | Contexto → «contestás» → LO → **MISMO?**, palabra dominante verde. | 2,5 s: palabra dominante en el gancho. |
| 2,5–9 s | Chat que acumula preguntas en tres pares; pausa y ×40 con «ejemplo». | 8,3 s: repetición + ×40. |
| 9–16 s | Mismas consultas en «A mano» y «Ordenado»; respuesta y reserva cambian de estado. Blanco: pendiente; verde: respondido/agendado. | 14,5–16,3 s: comparación del mismo proceso. |
| 16–23 s | Un tablero reúne agenda, clientes, cobros y chat. El borde activo guía la lectura de cada módulo. Sin montos, contadores ni curvas de resultados. | 28,4–31,9 s: centralización en tablero. |
| 23–26 s | Mosaico 2×2 recupera el chat, ×40, comparación y tablero; no introduce nuevos claims. | 45,3 s: recapitulación en mosaico. |
| 26–30 s | El mosaico sale y queda un CTA: «Asesoría gratis · link en mi perfil». | 47,0 s: cierre después del mosaico. |

Fuente: [ficha local](../../../hermes-content/references/video-intake/2026-10-09-reel-DePBfHouarG.md). Los segundos fuente son muestras observadas, **no tiempos de cortes medidos**. Los tiempos de esta prueba son propios. Interfaces ilustrativas; no representan funciones verificadas de un producto ni resultados reales. ×40 es un ejemplo explícito, no una métrica. Español de Bolivia con vos.

## Composición y movimiento

`index.html` contiene seis clips y un timeline GSAP pausado registrado como `main`. Los tres grupos del mosaico se clonan antes de construir el timeline, eliminando IDs y atributos de tiempo. El multiplicador se recupera como cuarto grupo. Paleta #10C26B / blanco / negro, tipografía Archivo variable y GSAP locales copiados de assets existentes del repo; no hay solicitudes externas, música, voz, logos ajenos, robots ni íconos de IA.

`ledger.json` define cinco transiciones LEFT. Generadas con `motion-doctrine/scripts/seam-stamp.mjs`, sobre wrappers internos: HyperFrames conserva el control de `.clip`. Movimiento por revelación progresiva, cambios de estado y foco del tablero; pausa de 0,55 s entre respuesta y resultado. Sin loops decorativos. Se mantiene lectura fija al final del CTA.

## Verificación y revisión por la madre

- QA estático independiente: contrato, seis tramos, voseo, estados y único CTA revisados. Assets locales presentes. Se amplió el chat a 630 px para incluir las seis preguntas.
- HyperFrames **0.8.65**, copia ya instalada: `lint` da **0 errores y 7 advertencias** de modularización (seis escenas monolíticas). Se conserva un HTML para esta prueba corta y reutilización de sus gráficos.
- `check` ejecutó lint, pero el navegador no arrancó: **`spawn EPERM`** del sandbox. No se validaron visualmente la composición final, el movimiento ni el contraste en navegador. No hay MP4 renderizado ni Seam Gate numérico aprobado.

Desde esta carpeta, con HyperFrames 0.8.65 disponible (no instalar otra versión sin aprobación):

```powershell
npx --offline hyperframes@0.8.65 lint
npx --offline hyperframes@0.8.65 check --snapshots
npx --offline hyperframes@0.8.65 preview
# Validar seams con la herramienta canónica y el preview ya abierto:
node ../../../.claude/skills/motion-doctrine/scripts/seam-gate.mjs verify --ledger ledger.json --url <URL-local-del-preview>
# Render de PRUEBA local para Sergio; no publicar:
npx --offline hyperframes@0.8.65 render --quality draft --output prueba.mp4
```

Revisar los seis tramos y los límites 2,5 / 9 / 16 / 23 / 26 s en preview antes de dar por aprobado el molde. La carpeta está lista para ese paso; no se operó git ni se publicó.

## Correcciones del 11-oct

- Se retiró el rótulo «PRUEBA DE EDICIÓN»; queda solo SERGIO URCULLO.
- Las tarjetas del mosaico empiezan a los 23,05 s; duración 0,48 s y stagger 0,1 s sin cambios. Terminan a los 23,83 s, antes del caption (24,55 s) y del CTA (27,15 s).
- CTA en dos renglones: «Asesoría gratis» / «Link en mi perfil», sin punto medio.

Lint offline no validado: `npx --offline hyperframes@0.8.65 lint` falló con `ENOTCACHED`; la caché local consultada contiene 0.8.58 y 0.8.143, sin 0.8.65. No se instaló ni descargó nada. Render no validado visualmente: el navegador del sandbox no arranca (`spawn EPERM`). La madre debe renderizar en la PC y revisar el cuadro a 23,2 s para confirmar que las tarjetas ya están en pantalla. El molde sigue esperando la revisión de Sergio Urcullo; no usar en piezas ni publicar.

## Revisión en la nube, 11-oct (Marca)

Sin CLI de HyperFrames (no está en la nube y no se instaló): se abrió `index.html` en Chromium con Playwright, se movió el timeline GSAP `main` (27,63 s) y se midió la luz media del cuerpo de la pantalla a 30 cuadros por segundo. Hoja con los cuadros del corte de los 23 s: `revision-11-oct-corte-23s.png`.

- **Rótulo «PRUEBA DE EDICIÓN»:** ya no está. **CTA:** «Asesoría gratis» / «Link en mi perfil», dos renglones, sin punto suelto.
- **Hueco de los 23 s:** con el mosaico a los 23,05 s quedaban ~0,13 s casi vacíos (luz 0,1-2,2 entre 23,00 y 23,10; antes eran 0,47 s). Se movió el mosaico a **22,95 s**: el tablero sale a los 23,00 y el mínimo es 0,94 en UN cuadro (23,00), 2,2 en el siguiente y 5,2 a los 23,07. Se lee como corte, no como hueco. Las tarjetas terminan a los 23,73 s, antes del caption (24,55 s).
- **Sigue sin validarse:** el lint de HyperFrames, el Seam Gate numérico y el MP4 (no hay render, solo cuadros). El timeline dura 27,63 s y `data-duration` dice 30: el último cuadro (CTA) se sostiene en los cuadros de 29,5 s, pero falta confirmarlo en un render de HyperFrames.
- **Antes de usar el molde en una pieza:** muestra un «tablero» con Agenda, Clientes, Cobros y Chat, rotulado «Esquema propio · no es una captura del producto». Mientras no exista la tabla «se promete / funciona», una pieza con esto pasa por Sergio Urcullo (`CLAUDE.md`, contenido en redes).
