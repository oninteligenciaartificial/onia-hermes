# Guion de grabación · MCP, agentes, loops y n8n: cómo se conectan de verdad

**Título público:** MCP, agentes, loops y n8n: cómo se conectan de verdad

**Miniatura:** NO ES LO MISMO

**Resultado prometido:** Al terminar, la persona podrá decidir si su caso necesita un workflow, una llamada a un modelo, un agente o MCP, y dibujar límites seguros.

**Duración objetivo:** 10–14 minutos. No acelerar para meter más conceptos; cortar lo
que no contribuya al resultado prometido.

## 01 · El problema

**Lámina:** Llamar “agente” a todo produce sistemas más caros y menos controlables.

**Guion:** Abrí diciendo que la diferencia no es semántica. Si elegís una arquitectura con más autonomía de la necesaria, aumentás costo, permisos y superficie de error. El objetivo del video es decidir con un mapa simple.

**Pantalla / prueba:** Mapa completo de los cinco conceptos.

## 02 · Workflow

**Lámina:** Un workflow sigue un camino que existe antes de ejecutarse.

**Guion:** Usá el ejemplo de n8n: Webhook, modelo, parser y Switch. La IA puede interpretar lenguaje, pero el Switch conserva la decisión de ruta. Eso no lo hace inferior; lo hace más fácil de probar.

**Pantalla / prueba:** Workflow lineal en n8n.

## 03 · Agente

**Lámina:** Un agente recibe un objetivo y el modelo elige la siguiente herramienta.

**Guion:** Marcá la diferencia: el modelo decide entre herramientas. No alcanza con poner un nodo llamado AI Agent; las tools deben representar capacidades reales y tener contratos claros.

**Pantalla / prueba:** AI Agent con tools pequeñas y saneadas.

## 04 · Loop

**Lámina:** Repetir una ruta no convierte un workflow en agente.

**Guion:** Explicá la distinción con una consulta de pago. Si reglas fijas revisan status, esperan y vuelven a consultar, es un loop determinista. Es agentivo sólo si el modelo observa el resultado y decide qué herramienta usar después.

**Pantalla / prueba:** Diagrama circular del loop.

## 05 · Frenos obligatorios

**Lámina:** Todo loop necesita éxito, máximo de pasos, timeout, presupuesto y salida humana.

**Guion:** En n8n mostrá HTTP Request, IF, Wait y Telegram. Aclarar que los números son un ejemplo, no una regla universal. Lo permanente es definir éxito, pasos máximos, timeout, presupuesto, aprobación para escrituras y salida humana.

**Pantalla / prueba:** Workflow HTTP Request → IF → Wait → Telegram.

## 06 · Contrato de una tool

**Lámina:** Una herramienta bien nombrada reduce decisiones ambiguas del agente.

**Guion:** Compará get_lead_by_id con una tool genérica llamada buscar. Explicá que readOnlyHint describe intención, no impone seguridad. Actualizar debe ser otra tool y los permisos reales viven en host, credenciales y servidor.

**Pantalla / prueba:** Contrato JSON de get_lead_by_id.

## 07 · MCP

**Lámina:** MCP estandariza la conexión; no decide la arquitectura ni los permisos.

**Guion:** Mostrá la documentación oficial o una lista saneada de tools. No enseñes tokens. Aclarar: MCP no es un agente, no es memoria y no reemplaza n8n. Es el puente estándar de conexión.

**Pantalla / prueba:** Documentación oficial de MCP y lista de tools sin tokens.

## 08 · Mapa de decisión

**Lámina:** La pregunta clave es quién decide el próximo paso.

**Guion:** Recorré cuatro preguntas: ¿la ruta ya está definida?, ¿sólo necesito convertir lenguaje en datos?, ¿el modelo debe elegir la próxima tool?, ¿necesito compartir tools, resources o prompts mediante un protocolo? Podés combinar piezas, pero la combinación no borra responsabilidades.

**Pantalla / prueba:** Árbol de decisión a pantalla completa.

## 09 · La parte honesta

**Lámina:** Más autonomía también significa más permisos, costo y formas de fallar.

**Guion:** No conviertas el video en una defensa contra agentes. Hay problemas que sí los necesitan. La parte honesta es reconocer que autonomía es un costo que se justifica con valor, no una característica que siempre hay que maximizar.

**Pantalla / prueba:** Comparativa control/autonomía.

## 10 · En una línea

**Lámina:** Workflow define la ruta; agente decide; loop repite; MCP conecta.

**Guion:** Cerrá pidiendo un caso concreto: clasificación de leads, soporte o investigación con fuentes. Esa respuesta alimenta el siguiente video y el próximo encuentro de la comunidad.

**Pantalla / prueba:** Cerrar con la palabra MAPA visible.

## Tomas de seguridad

- Repetir hook, frase de transición y CTA en una segunda toma.
- Capturar 8–12 segundos limpios de cada pantalla importante.
- Grabar un error real si aparece y explicar cómo se detectó.
- Mantener fuera de cuadro tokens, correos, nombres de clientes y notificaciones.
