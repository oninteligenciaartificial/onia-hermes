# Banco del 2026-09-01

Generadas con `lucia-skin-v1` (`58bbd635-…`) desde el navegador, Nano Banana Pro, 2K,
1792×2400, 2 créditos. Técnica en [`../TECNICA-HIGGSFIELD.md`](../TECNICA-HIGGSFIELD.md).

| Archivo | Qué es | Asset id | Estado |
|---|---|---|---|
| `B06-consultorio-dental.jpg` | Mostrador de un consultorio dental, entregando la tarjeta de turno a una paciente mayor | `bc3db11b-9e82-47ae-a312-ebecac69e189` | ✅ **La mejor del banco** |
| `B07-ferreteria-9x16.jpg` | Ferretería de barrio, entregando una bolsa de tornillos a un cliente | `4eb429ec-c734-4e5e-a263-895d9b7f315a` | ✅ **La PRIMERA en 9:16** |

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

## ✅ V06 — el video de B06, bajado y verificado

`V06-dental-animate-kling3.mp4` · asset `7dcf2c0a-9635-4f50-bc16-f325467cfa4d` · 5,04 s · 121 frames · **sin pista de audio** · 6,25 cr.

**Funciona.** Mirado con `_V06-TIRA.jpg` (4 frames): el traspaso se COMPLETA — ella suelta la tarjeta, la paciente la toma y baja la vista, ella retira la mano al mostrador. La cara aguanta los 5 s, no inventa habla ni gira de más. Confirma otra vez la regla: con acción a medias clara el modelo continúa en vez de actuar.

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


## 🔴 El 9:16 de la interfaz NO es el 9:16 del archivo

La pregunta que el loop arrastraba desde el 31-ago tiene respuesta, y es la mala.

El historial de Higgsfield mostraba **`720p · 5.0s · 9:16`** junto a esta generación. El archivo
bajado mide **828×1108** — exactamente lo mismo que los cinco videos del 28-ago. **No es 9:16,
es ~3:4.**

O sea que **la etiqueta de la interfaz no describe el archivo**. Seguimos sin un solo video
vertical, y Meta Ads lo pide para Reels y Stories. Las salidas siguen siendo dos: re-encuadrar
con el editor, o encontrar dónde se fija de verdad el aspecto antes de generar — el selector del
workspace, no el que muestra el historial.

## ⚠️ En el workspace de VIDEO, `Download` está escondido

No hay botón visible. Está **dentro del menú `…`** de la pieza, junto a Virality Predictor,
Regenerate, Publish y Delete. Distinto del panel de detalle de una IMAGEN, donde `Download` sí es
un botón a la vista.


## ✅ B07 — la primera imagen vertical del banco

**1536×2752 · ratio 0,558**, contra 0,563 que sería 9:16 exacto. **Es vertical de verdad**, y las
16 anteriores eran 3:4 (0,750).

**Cierra el bloqueo del formato para Meta Ads.** La cadena quedó probada de punta a punta:
poner **9:16 en el selector de aspecto del workspace de IMAGEN** — que estuvo ahí todo el tiempo,
en 3:4 por defecto — y el resto sale solo. **El precio no cambia: siguió en ✦ 2.**

La escena también sirve: estantes de madera atiborrados, sogas colgadas, latas de pintura,
tornillos sueltos, piso de concreto, cortina metálica al fondo. Bombilla colgante más luz cálida
de la puerta abierta. Y la acción a medias es de las más claras del banco: **cuatro manos sobre
la misma bolsa de papel**, que es el patrón que dio `V05` y `V06`.

**Lo próximo:** animarla con `Turn to video`. Si el video hereda el aspecto del frame —que es lo
que dice §7 de la técnica—, este va a ser **el primer video vertical**, listo para Reels y ads.
