# Guion de grabación · n8n paso a paso: clasificá leads sin construir un agente

**Título público:** n8n paso a paso: clasificá leads sin construir un agente

**Miniatura:** NO USES AGENTE

**Resultado prometido:** Al terminar, la persona podrá construir un workflow determinista que clasifica un lead, valida JSON y deriva casos sensibles a una persona.

**Duración objetivo:** 10–14 minutos. No acelerar para meter más conceptos; cortar lo
que no contribuya al resultado prometido.

## 01 · La decisión correcta

**Lámina:** Clasificar un lead no necesita un agente si la ruta ya está definida.

**Guion:** Abrí con la polémica: usar AI Agent para todo añade libertad donde no hace falta. En este caso conocemos la entrada, el formato de salida y las rutas. Eso es exactamente lo que un workflow determinista hace bien.

**Pantalla / prueba:** Canvas completo del workflow.

## 02 · Entrada de prueba

**Lámina:** Una demo segura empieza con datos ficticios y un contrato pequeño.

**Guion:** Mandá este JSON al Webhook de prueba. Explicá por qué no usamos información real: una grabación se copia, se recorta y se distribuye. El contrato mínimo también reduce errores posteriores.

**Pantalla / prueba:** Enviar el payload ficticio al Webhook de prueba.

## 03 · Los nodos exactos

**Lámina:** Siete nodos separan entrada, interpretación, validación, registro y aviso.

**Guion:** Construí el canvas en vivo. Conectá OpenAI Chat Model y Structured Output Parser como subnodos de Basic LLM Chain. Después Google Sheets registra, Switch distribuye y Telegram avisa sólo en la ruta humana. Si tu versión de n8n cambia una etiqueta, mostrala como aparece en tu pantalla.

**Pantalla / prueba:** Construir los nodos en el canvas y hacer zoom suficiente.

## 04 · Prompt operativo

**Lámina:** El modelo recibe una tarea cerrada, no permiso para inventar el proceso.

**Guion:** Pegá el prompt y explicá los límites. No le pedimos responder al cliente ni fijar precio. Sólo clasifica. Separar análisis de acción evita que una salida creativa se convierta directamente en una promesa comercial.

**Pantalla / prueba:** Abrir el prompt dentro de Basic LLM Chain.

## 05 · Salida obligatoria

**Lámina:** Structured Output Parser convierte texto libre en datos verificables.

**Guion:** Pegá este JSON Schema en el parser. Si la salida no cumple la estructura, el nodo falla; si cumple, todavía puede estar mal clasificada. Ejecutá una vez y abrí la salida. Un error visible enseña más que una demo fingidamente perfecta.

**Pantalla / prueba:** Abrir la configuración y salida de Structured Output Parser.

## 06 · Reglas del Switch

**Lámina:** La ruta la decide una regla auditable, no otra respuesta del modelo.

**Guion:** Mostrá el orden de las reglas. Los casos sensibles salen antes de cualquier automatización comercial. En producción, agregá una ruta default; nunca dejes caer una categoría nueva silenciosamente.

**Pantalla / prueba:** Mostrar las reglas y ramas del nodo Switch.

## 07 · Cuándo sí usar AI Agent

**Lámina:** El agente aparece cuando el modelo debe elegir la próxima herramienta.

**Guion:** Cambiá el problema: ahora el sistema no sabe de antemano qué información falta. Ahí AI Agent puede elegir entre tools pequeñas. Mantené fuera fijar precios, enviar propuestas o prometer disponibilidad sin revisión humana.

**Pantalla / prueba:** Mostrar AI Agent con tres tools ficticias o saneadas.

## 08 · Prueba mínima

**Lámina:** Tres casos revelan más que veinte ejecuciones idénticas.

**Guion:** Prepará tres payloads antes de grabar. Mostrá la ejecución completa de cada uno o al menos el resultado y la ruta iluminada. No presentes una sola ejecución exitosa como prueba suficiente.

**Pantalla / prueba:** Ejecutar tres casos de prueba y mostrar la ruta tomada.

## 09 · La parte honesta

**Lámina:** Un JSON válido todavía puede contener una decisión equivocada.

**Guion:** Esta es la limitación central. Structured Output Parser evita formatos rotos, pero no garantiza que la categoría sea correcta. La calidad se mide con casos reales anonimizados y una revisión periódica, no sólo con ejecuciones verdes.

**Pantalla / prueba:** Comparar salida válida con revisión de negocio.

## 10 · En una línea

**Lámina:** Usá IA para interpretar y reglas para controlar lo que ocurre después.

**Guion:** Cerrá con la pregunta de arquitectura: ¿quién decide el próximo paso, una regla o el modelo? Recordá que el recurso es el mapa y el schema, no un workflow importable todavía.

**Pantalla / prueba:** Cerrar con la palabra N8N visible.

## Tomas de seguridad

- Repetir hook, frase de transición y CTA en una segunda toma.
- Capturar 8–12 segundos limpios de cada pantalla importante.
- Grabar un error real si aparece y explicar cómo se detectó.
- Mantener fuera de cuadro tokens, correos, nombres de clientes y notificaciones.
