# Video 04 — "Cómo saber que no te mintió"

Serie **Claude Code de cero**. Mapa y reglas: `hermes-content/docs/SERIE_CLAUDE_CODE.md`.
Fuente de verdad: [`deck.html`](deck.html), autocontenido, 11 láminas.

**El más importante de la serie, y el que ningún canal hace porque no vende.**

Carga tres temas del plan viejo: **verificación + reglas que se cumplen + los errores del
primer mes**. Repara el hueco que deja el 03: ahí ya se enseñó a soltarlo, y soltar algo
que no sabés verificar es el error caro.

## De dónde sale cada cosa

| En pantalla | Fuente |
|---|---|
| La pantalla con los íconos como texto | `CLAUDE.md` §*Verificar es MIRAR* — caso real de producción |
| ~~12 errores, 11 revisando~~ → **18, y los 18 los encontró él** | 🔴 **CORREGIDO 18-sep.** `handoff/onia-dev-node-setup.md` §5 tiene **18** ítems numerados (4 en §5.1 + 9 en §5.2 + 5 en §5.3), y son 18 en las **seis** versiones del archivo en git. El «12» no sale de ninguna parte. En §5 **no hay ni un error atribuido a Sergio Urcullo**: el que él encontró es el de la pantalla de entrar, de otra sesión |
| «Si el instrumento puede dar verde con la cosa rota, el instrumento está roto» | mismo handoff, §5.4 — **la mejor frase del material y no estaba en el guion**. Ahora cierra el tramo 9 |
| **Demo del falso verde** (`demo-falso-verde/`) | construida y CORRIDA el 18-sep: grep verde ✅, HTTP 200 ✅, y la pantalla renderizada mostrando `credit_card_off` como texto. Reproduce el bug real de producción |
| "Una regla sin su historia se desobedece" | `CLAUDE.md`, encabezado |
| "Un verde que no mide enseña a ignorar el rojo" | mismo handoff, error #12 |

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
