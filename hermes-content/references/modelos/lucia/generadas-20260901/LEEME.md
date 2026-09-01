# Banco del 2026-09-01

Generadas con `lucia-skin-v1` (`58bbd635-…`) desde el navegador, Nano Banana Pro, 2K,
1792×2400, 2 créditos. Técnica en [`../TECNICA-HIGGSFIELD.md`](../TECNICA-HIGGSFIELD.md).

| Archivo | Qué es | Asset id | Estado |
|---|---|---|---|
| `B06-consultorio-dental.jpg` | Mostrador de un consultorio dental, entregando la tarjeta de turno a una paciente mayor | `bc3db11b-9e82-47ae-a312-ebecac69e189` | ✅ **La mejor del banco** |

## B06 — por qué es la mejor

**Llena el hueco que rompía los creativos.** Los 8 anuncios hablan de clínica dental y el banco
no tenía ni una foto de consultorio: quedaba *«tu clínica no puede depender de un cuaderno»*
sobre la foto de un almacén. Ahora el copy dental tiene su escena.

**Y tiene la acción a medias más clara que se generó hasta ahora:** cuatro manos sobre la misma
tarjeta. Es el mismo patrón de `G05-oficina-de-tramites`, que dio `V05`, el mejor video del banco.
Por eso **es la primera candidata a animar**.

Lo demás que sale bien: pecas visibles y pelo suelto (cara fiel al ancla), dos tubos fluorescentes
con cast verde sobre la pared descascarada, sillas de plástico, vitrina con cajas, esterilizador,
calendario. Luz real del lugar, no luz de estudio.

## 🔴 El hallazgo: por qué acá SÍ funcionó la regla de los carteles

En `B05-micro` la línea `no legible text anywhere in frame` **falló** — el modelo escribió
`CARHEDA BIT. 20` igual. Acá funcionó: no hay un solo texto inventado legible.

**La diferencia no es la instrucción, es el resto del prompt.** El de B05 pedía explícitamente
*«a handwritten fare sign taped to the wall»*. O sea que yo mismo le pedía el cartel, y después
le pedía que no fuera legible. **Gana la instrucción que pone el objeto.**

**La regla corregida:** no alcanza con pedir «sin texto legible». Hay que **no pedir el cartel**.
Si la escena necesita uno, se nombra como superficie y no como cartel — «una pared con papeles
pegados», no «un cartel de tarifas escrito a mano».
