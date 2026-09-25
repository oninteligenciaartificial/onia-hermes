# Operación Sergio: contenido → comunidad → Bóveda

## Decisión

Sergio no necesita “publicar más” como fin. Necesita convertir cada explicación útil en un
activo recuperable: un recurso de la Bóveda, una conversación con contexto y, cuando haya
caso real, una llamada. El recurso existe **antes** de pedir una palabra en comentarios.

## Patrón que se toma, sin copiar identidad

De Enrique Rocha se toma la arquitectura: tutorial frecuente → archivo encontrable →
comunidad con acceso temprano. De Erik Taveras se toma el principio de documentar sistemas
reales y convertir el video en una guía concreta para volver a consultar. No se copian su
voz, estética, afirmaciones, números, nombres de comunidad ni guiones.

## Ciclo diario de una idea

| Momento | Pieza | Trabajo que hace | CTA permitido |
|---|---|---|---|
| 1 | Reel/TikTok/Short | Enseña una acción concreta en 30–90 s | `Comentá <PALABRA>` + recurso real de la Bóveda |
| 2 | Carrusel | Deja el mapa, tabla o checklist guardable | Misma palabra; URL visible y firma de Sergio |
| 3 | Historias (3 frames) | Prueba humana + mini lección + interacción | encuesta/pregunta o “abrí el recurso” |
| 4 | Comunidad | Publica primero el recurso, archivo o ejemplo | pregunta de implementación, no venta forzada |
| 5 | Bóveda | Conserva el método y lo hace buscable | siguiente recurso relacionado |

## Las primeras tres puertas ya preparadas

| Palabra | Recurso | Qué recibe alguien | Pregunta que abre conversación |
|---|---|---|---|
| `MAPA` | `/automatizar` ⚠️ 404 al 25-sep, sin desplegar | matriz repetición × tiempo × error + workflow n8n mínimo | “¿Qué tarea repetís y qué dato se pierde?” |
| `ARQUITECTURA` | `/agentes` ⚠️ 404 al 25-sep, sin desplegar | matriz `IF` o `Switch` / modelo que clasifica / AI Agent / loop (corregida el 25-sep: clasificar no pide agente) | “¿Quién decide el próximo paso: tus reglas o el modelo?” |
| `MCP` | `/mcp` ⚠️ 404 al 25-sep, sin desplegar | contrato de herramienta + permisos mínimos | “¿Qué herramienta querés conectar y qué jamás debería poder hacer sola?” |

Si el circuito de DM está sano para la cuenta de Sergio, el privado puede entregar una frase
corta con el enlace. Si no, la pieza sigue siendo honesta: el recurso se abre directamente
en la Bóveda y el comentario avisa a Sergio para responder el caso. No usar “te mando” sin
haber validado esa entrega de punta a punta para esa palabra y cuenta.

## Historias: tres secuencias listas para producción

### Día MAPA — qué automatizar

1. **Prueba:** video vertical de pantalla con un workflow real abierto, sin datos de cliente.
   Texto: `Antes de abrir n8n, hago esto.`
2. **Lección:** captura anotada de `Entrada → Regla → Salida`.
   Texto: `Si no podés nombrar estas 3 piezas, todavía no hay workflow.`
3. **Interacción:** fondo limpio + sticker encuesta.
   Texto: `¿Qué repetís más: leads, cobros o turnos?` · sticker: `Leads / Otra cosa`.
   Remate: `El mapa completo está en la Bóveda.`

### Día ARQUITECTURA — agente o loop

1. **Prueba:** Sergio hablando a cámara, 8 s.
   Texto: `No todo lo que tiene IA necesita un agente.`
2. **Lección:** tabla de tres filas: `IF / Agent / Loop`.
   Texto: `Regla fija / lenguaje ambiguo / estado que cambia.`
3. **Interacción:** caja de pregunta.
   Texto: `Mandame el proceso y te digo cuál de las 3 usaría.`
   Remate: `Guía completa en la Bóveda.`

### Día MCP — permisos

1. **Prueba:** grabación de terminal sin tokens ni nombres de clientes.
   Texto: `MCP conecta herramientas. No te da criterio.`
2. **Lección:** tarjeta: `input → output → permiso`.
   Texto: `Una tool segura empieza en modo lectura.`
3. **Interacción:** encuesta.
   Texto: `¿Conectarías un agente que pueda borrar registros?` · sticker: `Nunca / sólo con aprobación`.
   Remate: `El contrato está en la Bóveda.`

## Flujo de edición y publicación

1. Sergio graba el frame de prueba o entrega captura real.
2. Edición usa formato 1080×1920 y deja zona segura arriba/abajo; no recrea dashboards ni
   muestra secretos, leads o conversaciones privadas.
3. Se genera borrador y copy con URL de la Bóveda.
4. Se verifica la cuenta destino y el asset final.
5. Se publica/programa sólo la pieza exacta aprobada para la cuenta indicada.

Postiz es el calendario/publicador. No es una bandeja para leer o responder comentarios. El
repositorio tiene automatización de comentario→DM por n8n/Graph API, pero cualquier palabra
de Sergio debe verificarse en vivo antes de confiarle una entrega. La UI de Postiz no fue
auditable desde este equipo porque el navegador bloqueó `postiz.onia.com.bo`; el script local
también requiere confirmar la integración de Sergio, que no se debe suponer.

## Aprendizaje de patrones: sin humo de “machine learning”

No hay que entrenar una red neuronal inventada. El sistema correcto empieza con evidencia:

1. Cada publicación entra al registro con tema, formato, hook, recurso, palabra, fecha y CTA.
2. A los 7 y 30 días se agregan métricas reales: reproducciones, retención, guardados,
   compartidos, comentarios de intención, visitas a la Bóveda y conversaciones iniciadas.
3. Se comparan sólo piezas comparables (reel educativo vs reel educativo), no likes absolutos.
4. El siguiente lote duplica el mecanismo ganador y descarta el ángulo débil.

El archivo `sergio-content-patterns.json` deja la estructura inicial. Sólo se le agregan
observaciones verificadas; no lleva métricas de referencia ni predicciones disfrazadas de datos.
