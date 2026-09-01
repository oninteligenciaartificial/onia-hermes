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


---

## ⏳ PENDIENTE DE BAJAR — video de B06 (pagado, 6,25 cr)

Lanzado el 01-sep desde `Turn to video` sobre B06. **Quedó generando al cerrar la vuelta.**
Está en la cuenta; lo primero de la próxima vuelta es bajarlo, mirarlo con frames y anotarlo acá.

**Ajustes usados y verificados en pantalla:** Kling 3.0 · 5 s · **720p** · botón **✦ 6,25**.

**El prompt se reescribió, y eso casi cuesta 6,25 créditos tirados.** `Turn to video` **arrastra
el prompt de la generación anterior**: al abrirlo traía el de `V05-oficina` —*«the clerk lets go
of the stamped form»*, *«scratched glass»*— con el frame dental cargado. O sea que el frame es
nuevo y el texto es viejo. Si se aprieta Generate sin mirar, Kling anima la escena equivocada.

🔴 **Regla nueva: `Turn to video` NO limpia el prompt. Leerlo y reescribirlo SIEMPRE antes de
generar.**

⚠️ Y una trampa de UI: `ctrl+a` dentro del campo de prompt del workspace de VIDEO selecciona la
**página entera**, no el campo — pasó dos veces. Lo que sí funciona es **`triple_click` sobre el
`ref` del textarea** y después escribir.

**Dato a confirmar al bajarlo:** el historial mostró **9:16** junto a 720p y 5 s. Si el MP4 sale
vertical de verdad, se acabó el problema de formato para Meta Ads, donde todo el banco venía en
828×1108.
