# Guion de grabación · Agentes que trabajan de noche: de 443 avisos a un parte por día

**Título público:** Agentes que trabajan de noche: de 443 avisos a un parte por día

**Miniatura:** 443 → 1

**Resultado prometido:** Al terminar, la persona podrá convertir los avisos de sus automatizaciones en tareas, armar un parte diario y vigías que avisan solo cuando algo cambia.

**Duración objetivo:** 10–14 minutos. No acelerar para meter más conceptos; cortar lo
que no contribuya al resultado prometido.

## 01 · El caso

**Lámina:** De 443 mensajes en un día a un parte por día.

**Guion:** Hoy te escriben una vez por día, más las preguntas que sí son tuyas. Prometé cómo se pasó de uno a otro, las dos veces que el arreglo nuevo mintió y las reglas para copiar si tenés automatizaciones que te escriben.

**Pantalla / prueba:** Conteo de mensajes por día sacado del registro del script.

## 02 · Por qué importa

**Lámina:** Un aviso cada tres minutos no es un aviso: es ruido.

**Guion:** Cuando llegaste a un techo de gasto, la tentación era subir el tope. Hiciste lo contrario: bajar el consumo. Los mensajes sin sentido eran el gasto.

**Pantalla / prueba:** Lámina a pantalla completa.

## 03 · Regla uno

**Lámina:** Un aviso no es un mensaje: es una tarea.

**Guion:** Un CI roto o un loop caído ahora se arregla, no se avisa. El registro guarda todo igual: nada se pierde, solo deja de interrumpir.

**Pantalla / prueba:** El tablero de tareas, sin datos sensibles.

## 04 · Regla dos

**Lámina:** Solo lo roto ocupa lugar.

**Guion:** A las horas de encenderlo, habías mudado el ruido de Telegram al tablero, donde molesta más porque compite con el trabajo real. Un aviso que dice «rescaté un mensaje perdido» nombra el error en el cuerpo: mirando el cuerpo entero, todo relato se vuelve tarea.

**Pantalla / prueba:** Lámina a pantalla completa.

## 05 · Donde el filtro mintió

**Lámina:** El filtro leyó «nada roto» y creó una tarea.

**Guion:** Dos días después entraron cuatro tareas de éxito. Un loop al que le fue bien escribe «nada roto»: la palabra roto está, negada, pero está. Resultado: una tarea que dice que algo está roto porque el loop dijo que no.

**Pantalla / prueba:** El fragmento del filtro que borra la negación.

## 06 · Regla tres

**Lámina:** Un solo parte por día.

**Guion:** Una tarea recién creada no se reporta: el loop todavía no tuvo su vuelta. Lo que se cuenta es lo que el sistema ya intentó y no pudo.

**Pantalla / prueba:** Un parte diario de ejemplo.

## 07 · Donde el parte mintió

**Lámina:** El parte escondía justo lo que se acababa de romper.

**Guion:** El 19 de septiembre se cayeron cuatro loops de una máquina y el vigía lo detectó bien. Pero dos mañanas seguidas el único mensaje del día nombró pendientes de más de diez días. Un recorte por antigüedad esconde, por diseño, lo que se acaba de romper.

**Pantalla / prueba:** Lámina a pantalla completa.

## 08 · Regla cuatro

**Lámina:** Vigías que avisan por cambio, no por estado.

**Guion:** Un ícono con un formato de color que el framework no aceptaba tumbó el build; se enteraron diez minutos después. El vigía nuevo es tonto a propósito: lee, compara con el estado anterior y avisa; no reintenta ni arregla. Treinta mensajes iguales hacen que nadie lea el treinta y uno. Y un token válido no es un token con permisos: hace falta lectura de Actions.

**Pantalla / prueba:** Lámina a pantalla completa.

## 09 · Lo que no hay que hacer

**Lámina:** Sumar un aviso a un canal saturado es apagarlo.

**Guion:** Un agente midió mal porque entraron otros cambios mientras medía. Avisar cada merge era volver al principio. Antes de sacar una conclusión, dos comandos de git dicen cuántos commits entraron y qué archivos tocaron.

**Pantalla / prueba:** Lámina a pantalla completa.

## 10 · Cómo lo armás vos

**Lámina:** Tres pedidos a Claude Code.

**Guion:** Uno: que tus scripts anoten en una lista de tareas en vez de mandarte un mensaje, y que solo lo que empieza como problema cree tarea, borrando antes las negaciones. Dos: un parte diario, un solo mensaje. Tres: vigías que guardan el último estado y avisan solo cuando cambia.

**Pantalla / prueba:** Los tres pedidos, legibles.

## 11 · Cierre

**Lámina:** Contá: mensajes por día, antes y después.

**Guion:** Para saber si funcionó, contá. Los tres pedidos están en la comunidad de WhatsApp.

**Pantalla / prueba:** Link de la comunidad en la web.

## Tomas de seguridad

- Repetir hook, frase de transición y CTA en una segunda toma.
- Capturar 8–12 segundos limpios de cada pantalla importante.
- Grabar un error real si aparece y explicar cómo se detectó.
- Mantener fuera de cuadro tokens, correos, nombres de clientes y notificaciones.
