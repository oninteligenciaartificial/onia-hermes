# Odontograma de cinco caras: capturas v3 (rediseño)

Rediseño del odontograma con el lenguaje de la referencia aprobada (burbujas, pastillas con color, cifras que resaltan). Código en la rama `wip/c119` (worktree `/home/user/wt-119`), commit `3c05cde0`, sin push. Banco `/dev/odontograma` con el componente real y la cabecera real de la ruta (`EncabezadoOdontograma`, la misma de `/patients/[id]/odontogram`); paciente y datos ficticios. 11 PNG, todos abiertos y mirados.

Cómo se tomaron: Chromium sin cabeza, 390×844 y 1440×900, página completa, tipografía de la marca cargada (`document.fonts.ready`), puntero apartado antes de cada foto. Con CSS se ocultó **sólo** el botón «N» de Next. El banco ya no necesita ocultar nada: sus escenarios quedan plegados al pie en una línea («Banco local con datos ficticios · escenario …»), que se ve en las capturas y no es producto.

## Clic real y ancho de página

- **Clic real (`locator.click()`, sin `dispatchEvent` ni `force`) sobre la pieza 36 a 390: abre la 36.** Título «Pieza 36», sólo la 36 queda presionada (`aria-pressed`), el arco se desliza solo hasta su tope (scrollLeft 462 de 462: la 36 queda 33 px a la derecha del centro porque el arco no da para más) y la ficha de la pieza, que caía fuera de la pantalla, se trae a la vista.
- `document.documentElement.scrollWidth` a 390: **390** en el arco, tras abrir la 36, la cara oclusal, la 11 y el vacío. A 1440: **1440** en todas (el arco entra entero: 998 de 998).
- Barrido con clic real sobre las 32 piezas: **32 de 32 abren su propia pieza** a 390 y a 1440. Botón de pieza mínimo 44×77 (390) y 44×81 (1440). Ningún elemento tocable de la pantalla (piezas, chips, caras, cerrar, guardar, volver, leyenda) mide menos de 44 px.
- El e2e `e2e/odontograma-c6c.spec.ts` (renombrado a «Pieza») pasa 4 de 4: 390 y 1440, claro y oscuro.

## Lo que pedía la v3 y cómo quedó

| | Pedido | Hecho | PNG |
|---|---|---|---|
| 1 | Pieza como burbuja con relleno, número debajo en la mono, la abierta con anillo y elevación; cuadrantes legibles sin letras cortadas a 390 | Burbujas rellenas del color del estado, molares más anchos que incisivos y la corona mirando al plano de oclusión; número en IBM Plex Mono; la abierta con anillo verde de acción y 4 px de elevación. Línea media y plano de oclusión como separadores; «Superior / Inferior» pegados a la izquierda del arco (no se cortan al deslizar) y «◀ Derecha · del paciente · Izquierda ▶» fuera de la caja que desliza | `arco-390`, `arco-1440`, `pieza-11-390` (arco a mitad de camino) |
| 2 | Leyenda en chips con color y conteo, sólo lo presente, tocar resalta | Chips «Caries 2», «Fractura 1»… «Sin registro 24», en el orden de lo que hay que tratar; tocar uno apaga las demás piezas (`aria-pressed`, otro toque lo quita) | `arco-1440`, `arco-390` |
| 3 | Caries y fractura distintas | Caries rojo, fractura naranja: ΔE2000 25,5 (en v2, 5,6 con el mismo método). Segunda señal: mancha (caries) y grieta (fractura); también corona, tornillo (implante), obturación (restaurado) y cruz (ausente). Caries contra corona: ΔE 38 | `arco-1440` (24 fractura junto a 25 caries) |
| 4 | Título «Pieza 36» grande, pastilla de estado y cuadrante; cruz de burbujas con la oclusal redonda; chips de 44 px | «Primer molar» + «Pieza 36» (32 px en el celular, 36 en escritorio, peso 600), «Estado general: Caries» en pastilla y «Cuadrante 3 · inferior izquierdo». Cruz de burbujas con el color y el texto de cada cara, oclusal/incisal redonda; chips con su muestra y tilde | `pieza-36-*`, `cara-oclusal-*` |
| 5 | Escritorio sin hueco bajo las caras | Dos columnas 5/6: caras a la izquierda, edición a la derecha con la nota y Guardar; chips en 3 columnas cuando la columna da. Diferencia de alto entre columnas: de 0 a ~50 px | `pieza-36-1440`, `cara-oclusal-1440`, `pieza-11-1440` |
| 6 | Celular: desliza con pista, centra la abierta, 44 px, sin scroll lateral | Borde difuminado del lado que tiene más piezas y «Deslice el arco para ver las 32 piezas.» sólo si desborda; centra la abierta; 44 px; 390 | `arco-390`, `pieza-36-390` |
| 7 | Vacío que no parezca roto | Arco entero «Sin registro» (burbuja gris de borde punteado), «Este paciente todavía no tiene registros. Elija una pieza del arco o empiece por la 18.» y «Empezar por la pieza 18» | `vacio-390`, `vacio-1440` |

Modo oscuro de la pieza 36 a 1440: `pieza-36-oscuro-1440`.

## Decisiones (para que no se reabran sin motivo)

- «Pieza» en vez de «Diente» en toda la pantalla (título, nombres accesibles, `title`). El plan de tratamiento de la ficha sigue diciendo «Diente 46»: queda anotado abajo.
- El color del arco sigue siendo el estado GENERAL; las caras se ven al abrir la pieza (decisión de C6). La leyenda cuenta piezas por estado general.
- «Sin registro» no es «Sano»: burbuja gris con borde punteado contra verde lleno.
- Al abrir una pieza, si su ficha no se alcanza a ver (celular, laptop de 768), la página baja hasta ella.
- La cabecera de la ruta (volver de 44 px, iniciales en burbuja) es un componente compartido con el banco, para que la captura sea la pantalla real.

## Lo raro o pendiente

- A 390 la leyenda ocupa 4 filas cuando hay 7 estados (está debajo del arco, no lo empuja).
- En escritorio el rótulo «◀ Derecha del paciente» va al borde de la hoja y el arco centrado, ~50 px más adentro.
- Fuera de esta pantalla: el plan de tratamiento de la ficha rotula «Diente 46» (`FichaVista.tsx`, `rotuloPieza`); conviene alinearlo a «Pieza».
- El arnés opt-in `e2e/v1/operaciones.ts` estaba desactualizado desde C6 («Diente 11», «Notas del diente», «Guardar cambio»); se actualizó a la pantalla actual y se probó contra el banco, no contra una base real.

## Archivos

`odontograma-arco`, `odontograma-pieza-36`, `odontograma-cara-oclusal`, `odontograma-pieza-11`, `odontograma-vacio` a 390 y 1440, y `odontograma-pieza-36-oscuro-1440`. Total 11.
