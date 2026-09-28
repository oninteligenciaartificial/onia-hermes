# Video 04 — "Cómo saber que no te mintió"

Serie **Claude Code de cero**. Mapa y reglas: `hermes-content/docs/SERIE_CLAUDE_CODE.md`.
Fuente de verdad: [`deck.html`](deck.html), autocontenido, 11 láminas. Los PNG salen de
ahí; no se editan a mano.

▶ **Para grabar hoy: [`LISTO-PARA-GRABAR.md`](LISTO-PARA-GRABAR.md)** — guion en formato
rodaje, orden de láminas, dónde entra la demo, y cada cifra con el comando que la mide.

**El más importante de la serie, y el que ningún canal hace porque no vende.**

Carga tres temas del plan viejo: **verificación + reglas que se cumplen + los errores del
primer mes**. Repara el hueco que deja el 03: ahí ya se enseñó a soltarlo, y soltar algo
que no sabés verificar es el error caro.

## De dónde sale cada cosa

| En pantalla | Fuente |
|---|---|
| La pantalla con los íconos como texto | `CLAUDE.md` §*Verificar es MIRAR* — caso real de producción |
| **18 errores, los 18 los encontró él, en CINCO DÍAS** | 🔴 **RECONTADO 21-sep, y cambió otra vez.** `handoff/onia-dev-node-setup.md` §5 tiene **18** ítems numerados (4 en §5.1 + 9 en §5.2 + 5 en §5.3) y **ninguno** atribuido a Sergio Urcullo — eso se confirma. Lo que NO se sostuvo: (a) los 18 **no son de una sola sesión** — §5.1 se titula *«De esta sesión»* y tiene 4; los commits del archivo van del **04 al 08-sep** y **10 de los 18** ya estaban el 06-sep; (b) el «12» **sí** salía de algún lado: la versión del 06-sep abre §5 con *«Doce. Once los agarré verificando; el primero lo agarró Sergio Urcullo»*; (c) no son «seis versiones», son **25 commits**. Detalle y comandos en la cabecera del `GUION.md` |
| **«Lo di por bueno dos veces»** (no tres) | `CLAUDE.md` §*Verificar es MIRAR*: *«lo había "verificado" varias veces con HTTP 200 y grep»* — **dos** instrumentos. La tercera comprobación («pregunté si estaba bien») no salía de ninguna fuente, y contradecía al remate de la propia lámina 2 y a la demo, que dicen «dos» |
| «Si el instrumento puede dar verde con la cosa rota, el instrumento está roto» | mismo handoff, §5.4 — **la mejor frase del material y no estaba en el guion**. Ahora cierra el tramo 9 |
| **Demo del falso verde** (`demo-falso-verde/`) | **RE-CORRIDA el 21-sep, sale 0**: los 4 textos aparecen ✅, `HTTP 200 - 1417 bytes` ✅, y `prueba3-mirala.png` muestra `verified_user` y `credit_card_off` dibujados como texto donde van los íconos. Reproduce el bug real de producción |
| "Una regla sin su historia se desobedece" | `CLAUDE.md`, encabezado |
| "Un verde que no mide enseña a ignorar el rojo" | mismo handoff — hoy es el ítem **#10** de §5 (*«un chequeo que miente enseña a ignorar el rojo»*); era el #12 en la versión del 06-sep, de ahí la referencia vieja |

## Decisiones

- **La parte honesta no repite el tema.** El video entero habla de errores, así que la
  penúltima lámina es otra cosa: *yo tampoco lo hago siempre, y cuando no lo hago, pago*.
  Repetir hubiera sido relleno con nombre de sección.
- **Cero frameworks de testing.** Es un video sobre el hábito, no sobre herramientas.
- **La lámina 4 es la que se pausa.** La comparativa "parece / lo está" es lo guardable.
- 🔴 **El video ahora PRUEBA, no sólo cuenta.** Hasta el 18-sep el 04 enseñaba la actitud
  («abrila y mirala») sin mostrar nunca el gesto: era una anécdota bien contada. La demo de
  `demo-falso-verde/` hace los tres verdes en pantalla en 40 segundos — el grep encuentra los
  cuatro textos, la página responde 200, y al abrirla dice `credit_card_off` donde va un
  candado. En un video sobre verificación, contar sin mostrar era el mismo error que denuncia.
- **La lección de recontar se la aplicó el propio video.** Su cabecera decía *"los números de
  este video NO cambian, no hace falta recontarlos"*. Por no recontarlos, el dato central era
  falso. Eso queda escrito arriba del guion, no se borra.

## Rehacer los PNG

```bash
python rehacer-png.py          # las 11
python rehacer-png.py 9        # sólo la 9
```

⚠️ **NO uses el `chrome --headless --screenshot` que documentan los decks hermanos.** En
esta máquina no escribe el archivo: deja el PNG anterior en su lugar, sin error y sin
aviso — el falso verde exacto del que habla este video. `rehacer-png.py` usa Playwright y
además comprueba el tamaño del archivo escrito.

Si editás el texto del deck y hace falta reincrustar los assets: `python incrustar-assets.py`.
