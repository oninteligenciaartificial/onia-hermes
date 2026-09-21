# Guiones del día · lunes 21 de septiembre de 2026

## Tema de la jornada

**Cómo elegir y diseñar la primera automatización de un negocio.**

Cada pieza enseña un procedimiento que se puede aplicar hoy. No son opiniones sueltas:
el espectador debe poder copiar la plantilla, dibujar el flujo o tomar una decisión al
terminar el video.

## Producción

| Superficie | Pieza | Qué se graba |
|---|---|---|
| Feed | Pilar de Samuel | Samuel lo prepara y lo graba; no se guioniza aquí |
| Feed | Carrusel que reemplaza el b-roll | 7 láminas educativas, texto abajo |
| Feed | Video normal Sergio | Guion 1, con pantalla de un flujo real saneado |
| Trial | Reutilización | Los 3 contenidos del Feed + un yap de Samuel |
| Trial v2 | Cámara directa | Guiones 2–6, cinco microtutoriales |

Total: **3 Feed + 4 Trial + 5 Trial v2 = 12 piezas**.

---

## Feed · carrusel educativo

### Título

**La matriz para saber qué automatizar primero**

### Láminas

1. **NO ELIJAS LA HERRAMIENTA TODAVÍA**
   Primero elegí la tarea. Después elegís n8n, una skill, un agente o nada.

2. **ESCRIBÍ LA ENTRADA**
   ¿Qué dispara el proceso? Ejemplo: llega un formulario de contacto.

3. **ESCRIBÍ LA DECISIÓN**
   ¿Qué regla aplicás? Ejemplo: si faltan teléfono o servicio, pedir el dato; si está
   completo, registrar y avisar.

4. **ESCRIBÍ LA SALIDA**
   ¿Qué tiene que existir al terminar? Un registro, una alerta y una persona responsable.

5. **PUNTUÁ LA TAREA**
   Repetición · minutos · claridad de reglas · costo del error.
   Puntúa cada categoría de 1 a 5.

6. **EMPEZÁ POR ESTA COMBINACIÓN**
   Alta repetición + reglas claras + salida verificable + error controlable.
   Esa es mejor candidata que una tarea “interesante” pero ambigua.

7. **EJEMPLO DE FLUJO**
   `Formulario → validar → registrar → avisar`
   Si no podés dibujarlo así, todavía no está listo para automatizarse.

8. **REGLA DE SEGURIDAD**
   La automatización puede preparar, clasificar y avisar.
   El humano confirma dinero, precio, stock, garantías y reclamos sensibles.

9. **EJERCICIO**
   Elegí una tarea de esta semana y anotá: entrada, regla, salida y puntuación.

### Caption

La mayoría empieza preguntando qué herramienta usar. El orden correcto es otro:

`entrada → decisión → salida → verificación → herramienta`

Si no podés escribir esos cinco elementos, todavía no tenés una automatización. Tenés
una idea.

Comentá una tarea repetida de tu negocio y te digo cómo la mapearía.

---

## Guion 1 · Feed normal de Sergio

### Título

**Cómo diseñar tu primera automatización en tres nodos**

### Qué se muestra

Un workflow de prueba, sin datos reales: `Webhook → IF → Telegram`.

### Guion hablado

> Si querés diseñar tu primera automatización, no empieces conectando veinte aplicaciones.
> Dibujá tres nodos.
>
> Primero: el disparador. Por ejemplo, entra un formulario de contacto.
>
> Segundo: una decisión. Si faltan datos importantes, el flujo pide completarlos. Si el
> formulario está completo, continúa.
>
> Tercero: una salida. Guarda el registro y avisa por Telegram a la persona responsable.
>
> Eso ya es una automatización útil: entrada, regla y resultado verificable.
>
> El error es agregar IA antes de tener claro qué pasa en cada camino. Si no podés explicar
> tus tres nodos, todavía no necesitás un agente. Necesitás dibujar mejor el proceso.
>
> Comentá una tarea repetitiva y la convertimos en estos tres nodos.

### En pantalla

- Mostrar el flujo de prueba con datos ficticios.
- Abrir el nodo de decisión y enseñar las dos salidas.
- Terminar con `ENTRADA → REGLA → SALIDA`.

---

## Guion 2 · Trial v2

### Título

**Mapeá cualquier proceso con esta plantilla de 60 segundos**

### Guion hablado

> Para entender si una tarea se puede automatizar, escribí solo tres bloques.
>
> Uno: qué entra. “Un cliente manda un mensaje preguntando por un servicio”.
>
> Dos: qué decisión tomás. “Si pregunta precio, le mando la información aprobada; si
> pide algo fuera de catálogo, lo paso a una persona”.
>
> Tres: qué tiene que quedar hecho. “El mensaje registrado, la respuesta enviada y la
> excepción asignada”.
>
> Si no podés llenar esos tres bloques, no automatices todavía. Si podés, ya tenés el
> primer borrador del workflow.

### Texto en pantalla

```text
ENTRADA:
DECISIÓN:
SALIDA:
EXCEPCIÓN:
```

---

## Guion 3 · Trial v2

### Título

**El flujo de n8n que todo negocio debería entender**

### Guion hablado

> Este es el patrón más simple que tenés que entender en n8n.
>
> El primer nodo recibe el evento: un formulario, un mensaje o un archivo.
>
> El segundo valida una condición: ¿hay datos suficientes para continuar?
>
> El tercero ejecuta una acción: guardar, avisar o crear una tarea.
>
> En pseudocódigo queda así: “cuando entra X, si cumple Y, hacé Z; si no, pedí lo que
> falta”.
>
> Probalo con datos ficticios y agregá una salida visible para cada camino. Si solo
> probás el camino feliz, la primera excepción te rompe el flujo.

### En pantalla

```text
TRIGGER → VALIDAR → ACCIÓN
             ↘ FALTA DATO → PEDIR DATO
```

---

## Guion 4 · Trial v2

### Título

**Automatización, agente o loop: elegí con este árbol**

### Guion hablado

> No todo problema necesita un agente. Usá este árbol.
>
> Si las reglas son fijas y la salida es predecible, usá una automatización.
>
> Si el sistema tiene que leer lenguaje, comparar opciones y decidir entre caminos,
> evaluá un agente, pero dale herramientas limitadas y una salida estructurada.
>
> Si el trabajo se repite por horario, tiene una verificación y puede volver a intentar,
> eso es un loop.
>
> Ejemplo: registrar un formulario es automatización. Clasificar una consulta complicada
> puede usar un agente. Revisar cada hora si una web responde es un loop.
>
> Elegir la arquitectura correcta te ahorra más que elegir el modelo de moda.

### En pantalla

```text
REGLAS FIJAS       → AUTOMATIZACIÓN
DECISIÓN AMBIGUA   → AGENTE
REVISIÓN REPETIDA  → LOOP
```

---

## Guion 5 · Trial v2

### Título

**MCP: primero diseñá el contrato de la herramienta**

### Guion hablado

> Antes de conectar una herramienta con MCP, diseñá su contrato.
>
> Escribí cuatro cosas: nombre de la herramienta, entradas permitidas, salida esperada
> y permisos.
>
> Por ejemplo: `consultar_estado_pedido` recibe un `pedido_id`, devuelve estado y fecha,
> y solo puede leer. No puede cambiar el pedido ni enviar mensajes.
>
> Ese contrato te dice si realmente necesitás MCP. Si es una herramienta local para un
> solo flujo, probablemente alcanza con una integración directa. Si varios agentes o
> clientes necesitan la misma conexión gobernada, MCP empieza a tener sentido.
>
> MCP estandariza el acceso. No reemplaza el diseño del proceso.

### En pantalla

```json
{
  "tool": "consultar_estado_pedido",
  "input": { "pedido_id": "string" },
  "output": { "estado": "string", "fecha": "string" },
  "permissions": ["read"]
}
```

---

## Guion 6 · Trial v2

### Título

**Cómo construir un loop que sepa cuándo terminó**

### Guion hablado

> Un loop útil no empieza con tres agentes. Empieza escribiendo qué significa terminado.
>
> Por ejemplo: “todos los archivos pasan el test, no hay errores en consola y el reporte
> incluye los cambios realizados”. Esa frase es tu criterio de aceptación.
>
> Después separás tres funciones: el planeador propone los pasos, el ejecutador hace el
> trabajo y el evaluador revisa solo el resultado contra ese criterio.
>
> Si el evaluador rechaza, devuelve el motivo exacto al ejecutador. Poné un máximo de dos
> vueltas. Si no está verde después de eso, el loop avisa y se detiene.
>
> Sin criterio de aceptación, límite y aviso, no tenés autonomía. Tenés un proceso que
> puede gastar tokens sin saber cuándo parar.

### En pantalla

```text
PLANEAR → EJECUTAR → EVALUAR
              ↑          │
              └── corregir si falla

SALIR: aprobado | detener y avisar
TOPE: 2 vueltas
```

---

## Trial · reutilización

- Trial 1: el pilar de Samuel del día.
- Trial 2: el carrusel convertido en teaser si la plataforma acepta el formato.
- Trial 3: el video normal de Sergio.
- Trial 4: yap de Samuel: **“Antes de automatizar, escribí qué entra, qué decisión tomás
  y qué tiene que quedar hecho.”** Samuel lo desarrolla con su voz.

No vuelvas a grabar los tres contenidos del Feed para Trial.

## Drop de comunidad del día

> Hoy vamos a elegir qué automatizar primero.
>
> Copiá esta plantilla con una tarea real de tu negocio:
>
> `Entrada:` ¿qué dispara el proceso?
>
> `Decisión:` ¿qué regla aplicás?
>
> `Salida:` ¿qué tiene que quedar hecho?
>
> `Excepción:` ¿cuándo debe intervenir una persona?
>
> Ejemplo: formulario → validar datos → registrar y avisar → si falta información,
> pedirla. Compartí tu ejemplo en General y vemos si necesita automatización, agente o
> simplemente una regla mejor escrita.

## Orden de rodaje

1. Guiones 2–6, todos a cámara, sin cambiar set.
2. Guion 1 con el workflow de prueba y datos ficticios.
3. Carrusel.
4. Samuel graba su pilar y su yap.

Cada video tiene una sola enseñanza. Si no podés mostrar la plantilla, el diagrama o el
contrato en pantalla, no lo publiques todavía.
