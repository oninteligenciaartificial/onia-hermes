# Odontograma de cinco caras (PR #119) — para el OK de Sergio Urcullo

Capturas de 390 y 1440 px del banco `/dev/odontograma` (componente real `Odontogram`, sin red). En la captura están ocultos los chips de escenarios y el párrafo de ayuda del banco, sólo con CSS: el banco no cambió en eso. Letra Instrument Sans verificada.

**PR #119** · código en `da3820ea` · cambios de banco en `wip/cap119`: `c3f00c00` (nombre del plan, sin efecto aquí) y `a968db91` (escenario nuevo `?caso=varias`: caries y restaurado repartidos en varias caras).

Qué mirar, en este orden:
1. `odontograma-caras-marcadas-*.png`: pieza 36 abierta. Mesial restaurado, Oclusal y Distal con caries, Vestibular restaurado, Lingual sano. El arco muestra además 16 y 46 restaurados, 25 y 36 con caries.
2. `odontograma-cara-oclusal-abierta-*.png`: se toca «Oclusal»; el panel edita sólo esa cara (condición y nota «Caries profunda; pendiente de tratamiento.»).
3. `odontograma-diente-superior-11-*.png`: pieza superior, con «Incisal» y «Palatina / lingual»; Distal a la izquierda y Mesial a la derecha (cuadrante 1).
4. `odontograma-vacio-arco-*.png` y `odontograma-vacio-diente-36-*.png`: paciente sin registros; todas las caras dicen «Sin registro».

Datos de ejemplo: escenario `varias` (arco y caras arriba) y `vacio` (sin nada); paciente ficticio.
En las capturas de 390 las piezas se abrieron por script (ver el primer problema).

Lo raro que se ve en el producto (no lo arreglé):
- **A 390 px el arco no funciona.** Las piezas salen aplastadas (unos 14 px de ancho), encimadas y cortadas a los lados; tocar una pieza no es fiable (en la prueba, el dibujo de la 37 interceptó el clic sobre la 36 y hubo que disparar el clic por script). Se ve en `odontograma-vacio-arco-390.png` y `odontograma-caras-marcadas-390.png`. A 1440 está bien. Causa: `app/globals.css:615` tiene `*, *::before, *::after { min-width: 0 }` fuera de capa y le gana a `min-w-11` (cada pieza) y `min-w-[800px]` (el arco) de Tailwind. Esa regla viene de antes de este PR (está al menos desde el commit `10e6bc42`, 29-sep), y apaga todos los `min-w-*` del producto. Es lo único que impediría usarlo desde el celular.
- Caries (ámbar) y Corona (amarillo) casi no se distinguen en el arco ni en la leyenda (`odontograma-caras-marcadas-1440.png`).
- Las caras se distinguen sólo por el texto chico («Caries», «Restaurado»): los botones de caras no llevan color y el arco muestra sólo el estado general.
- Consola: sin errores propios.

Con el OK: Plataforma sigue con CI, merge y publicación; después se MIRA en producción. El problema de `min-width` conviene resolverlo antes o junto con esto.
