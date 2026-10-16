---
id: ventas-V01
carril: ventas
estado: pendiente
modelo: gpt-6.1-sol
repo: onia-hermes
rama: codex/ventas-v01-tabla-evidencia-codigo
base: main
pr:
escrita: 2026-10-11 por Ventas y pauta (sesión de la nube, Sonnet 5.5), a pedido de la madre (S05)
actualizada: 2026-10-11 por Ventas y pauta
nota:
---
# V01 · En qué archivo y línea del código vive cada fila ⬜ del VSL y de la decisión

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-hermes` que creó la madre, en la rama `codex/ventas-v01-tabla-evidencia-codigo`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin npm install, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.
- Necesitás **leer** el repo `onia-platform` (rama `master`, solo lectura). Si el entorno no lo trae, PARÁ y decilo: no adivines rutas.

## META
Que cada fila ⬜ de `hermes-content/docs/ONIA_PROMESA_VS_PRODUCTO.md` que usan el VSL dental y la decisión del 13-oct diga **en qué archivo y línea del código de `onia-platform` vive esa pantalla o esa regla**. Así, cuando Plataforma refresque la cuenta demo, mirar cada fila lleva minutos y no una búsqueda. No cambia ningún estado: leer el código **no** es mirar la pantalla.

Filas (las de la tabla del §2, columnas `# | Capacidad | Dónde aparece | Estado | Prueba | Qué hace falta`):
- VSL: `A-03`, `B-01`, `B-02`, `C-01`, `E-01`, `G-04`.
- Decisión del 13-oct: `G-01`, `G-06`, `G-11`, `E-03`, `D-03`.
- La que necesita la pieza G1-2 de la prueba 1 v2: `G-05` (agente «Vuelve a citar»: umbral de meses sin visita y sin cita futura).

## PRUEBA DE HECHO
La corre la madre (Codex no hace git ni consultas git):
1. En cada una de esas 12 filas, la **última columna** («Qué hace falta») termina con `Código: <archivo>:<línea>` (rutas relativas a `onia-platform`, línea de la función o constante que decide el comportamiento; más de una si hace falta, separadas por « · »). Si no se encuentra, termina con `Código: no encontrado (buscado: <patrones>)`.
2. **Ningún estado cambió:** los conteos de ✅, ❌, 🟡 y ⬜ del archivo son idénticos antes y después, y las columnas «Estado» y «Prueba» de las 12 filas no cambiaron ni un carácter.
3. Para `G-05` y `G-06` se anota además el umbral real del código (por ejemplo, «6 meses», «mañana»), porque la pieza y el bot lo repiten.
4. `node --test scripts/venta-honestidad.test.mjs scripts/docs-hygiene.test.mjs` y `node --test scripts/replica-grupo1.test.mjs` salen con código 0.

## REGLA DE PARADA
- Si `onia-platform` no está disponible en el entorno: parar y reportar. No inventes archivos ni líneas.
- Si una fila necesita **mirar la pantalla** para saber si está bien (no solo leer código), dejá «Código:» y no escribas más: esa verificación es de Plataforma con la cuenta demo.
- No toques `ONIA_PROMESA_VS_PRODUCTO_INVENTARIO.md`, los briefs, el catálogo ni ninguna otra fila. No pases ninguna fila a ✅ ni a ❌.
- Nada de textos para clientes en este contrato.

## ARCHIVOS
- Edita: `hermes-content/docs/ONIA_PROMESA_VS_PRODUCTO.md` (solo la última celda de las 12 filas).
- Lee: el código de `onia-platform` (solo lectura).
- Todo lo demás, prohibido.
