# Preparado, NO enviado · Un loop que sabe parar

> Borrador para Onia Community. Publicar sólo después de confirmar el último drop recibido, probar el ejemplo con datos ficticios y obtener OK de Sergio. **No** es un JSON importable de n8n ni se promete como tal.

## Texto para Avisos (borrador)

Hoy no te paso «un agente autónomo». Te paso una ficha para evitar que una tarea se repita para siempre.

Elegí una tarea que hoy revisás manualmente, por ejemplo comprobar si una solicitud cambió de `pending` a `paid`. Antes de conectar herramientas, completá esto:

```text
Tarea:
Qué evento la inicia:
Qué dato consulto:
Condición exacta de éxito:
Cada cuánto vuelvo a consultar:
Máximo de consultas:
Tiempo máximo total:
Qué hago al tener éxito:
Qué hago al llegar al límite:
Persona responsable del caso que no terminó:
Dónde registro el resultado:
```

Ejemplo de **diseño, todavía no workflow exportado**:

```text
Inicio: una solicitud ficticia con status=pending
Consulta: HTTP Request
Decisión: IF status=paid
Espera: 10 minutos sólo si sigue pending y quedan intentos
Límite: máximo 3 consultas, máximo 2 esperas
Éxito: aviso de terminado
Sin éxito tras tercera consulta: aviso a una persona y fin
```

Para comprobarlo, ensayá dos secuencias: `pending → pending → paid` debe terminar con éxito; `pending → pending → pending` debe producir una sola alerta humana y no una cuarta consulta. Si usás n8n, revisá que el contador sobreviva al `HTTP Request`; el diagrama, por sí solo, no demuestra que lo haga.

Compartí en General la ficha con una tarea de tu negocio (sin datos de clientes). Te decimos si necesita un loop o si basta un recordatorio manual. Si implica pagos, cobros o decisiones sensibles, una persona confirma el resultado.

## Gate de entrega

- [ ] Confirmado el último drop de la comunidad para no duplicarlo.
- [ ] Ejemplo implementado y probado con ambas secuencias ficticias, o rotulado explícitamente como ficha conceptual.
- [ ] Texto revisado por Sergio; aprobación antes de enviarlo.
- [ ] Si se promete archivo, enlace existente y acceso verificado para miembros.
- [ ] Tras envío, registrar fecha y enlace/captura saneada en `comunidad/ESTADO_COMUNIDAD.md` y sólo entonces agregar a la biblioteca pública de miembros.
