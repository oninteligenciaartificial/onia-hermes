# Guion de grabación · Un bot que no inventa: datos en un solo lugar, control después de la IA y medición

**Título público:** Un bot que no inventa: datos en un solo lugar, control después de la IA y medición

**Miniatura:** NO INVENTA PRECIOS

**Resultado prometido:** Al terminar, la persona podrá armar en su bot las tres capas —datos en un lugar, control después de la IA y medición—, aunque use n8n.

**Duración objetivo:** 10–14 minutos. No acelerar para meter más conceptos; cortar lo
que no contribuya al resultado prometido.

## 01 · Resultado

**Lámina:** Aunque la IA escriba un precio inventado, ese mensaje no sale.

**Guion:** No es porque se lo pediste por favor en el prompt: si la IA escribe un precio que no existe, sale otro mensaje. Prometé las tres capas del bot de ONIA y cómo armarlas aunque uses n8n y no escribas código.

**Pantalla / prueba:** Diagrama de las tres capas.

## 02 · Por qué importa

**Lámina:** Un prompt es un pedido. Un control en el código es una pared.

**Guion:** Una recepcionista que no sabe un precio dice «déjeme consultar». Un modelo, a veces, completa. Un precio inventado es un precio que tenés que respetar o discutir; una función prometida por escrito es un reclamo. Las dos cosas sirven, pero solo la pared se puede probar.

**Pantalla / prueba:** Lámina a pantalla completa.

## 03 · Capa uno

**Lámina:** Cada dato vive en un solo lugar.

**Guion:** Las dos cosas no podían ser ciertas a la vez, y nadie lo había visto. Hoy la frase de horario se genera sola desde las mismas franjas que ofrecen turnos. En tu bot: una planilla, una fila por dato, y el bot lee de ahí. Prueba: cambiá el horario en ese lugar y preguntale al bot; si contesta el nuevo sin tocar nada más, está bien.

**Pantalla / prueba:** Plantilla de datos: una fila por dato.

## 04 · Capa dos

**Lámina:** Un control después de la IA.

**Guion:** La mayoría de las respuestas salen de un guion; la IA entra cuando alguien se sale y ese texto pasa por el control. Cinco familias que sirven a cualquiera: precio, función que no existe, fingir ser persona, cifras inventadas y consejo clínico o legal. El error: el patrón buscaba «320 Bs» y los precios se escriben «Bs 320». En n8n: nodo If después de la IA. Sin bandera g, y probá tu texto seguro contra tus propios patrones.

**Pantalla / prueba:** El patrón que cubre las dos formas; después, el nodo If en n8n.

## 05 · Capa tres

**Lámina:** Medir con un número, no con una sensación.

**Guion:** Los casos están escritos como escribe un dueño de negocio por WhatsApp, y cada uno dice qué debería hacer el bot. Se corren contra la misma función de producción, no contra una copia: si cambia el bot, cambia la medición. Corrido el 29 de septiembre: 62 de 62.

**Pantalla / prueba:** Salida del banco de casos: 62/62.

## 06 · Demostración

**Lámina:** Frases de prueba contra el control de mi bot.

**Guion:** Leé cada frase y su motivo: precio, fingir ser una persona, cifra inventada, promesa. «Te lo confirma una persona» pasa. «Cuesta poco» se bloquea aunque no tenga número: preferís un mensaje genérico de más a que el bot improvise sobre plata.

**Pantalla / prueba:** El control corrido con las frases de prueba.

## 07 · El error común

**Lámina:** Querer resolver todo en el prompt.

**Guion:** El prompt ayuda y lo seguís usando. Pero lo que no se puede equivocar va en un control que se prueba.

**Pantalla / prueba:** Lámina a pantalla completa.

## 08 · Cierre

**Lámina:** Hacé esto hoy: diez frases prohibidas y diez que sí.

**Guion:** En la comunidad de WhatsApp están las tres capas en una hoja: la plantilla de datos, el patrón de precios y las frases de prueba. Nos vemos en el próximo.

**Pantalla / prueba:** Link de la comunidad en la web.

## Tomas de seguridad

- Repetir hook, frase de transición y CTA en una segunda toma.
- Capturar 8–12 segundos limpios de cada pantalla importante.
- Grabar un error real si aparece y explicar cómo se detectó.
- Mantener fuera de cuadro tokens, correos, nombres de clientes y notificaciones.
