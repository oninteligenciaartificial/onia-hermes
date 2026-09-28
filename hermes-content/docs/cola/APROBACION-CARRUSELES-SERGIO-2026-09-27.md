# Paquete de aprobación · carruseles Sergio v2

> Estado: **listo para decisión editorial, no autorizado para publicar**. Revisión
> cerrada sobre `codex/marca-sergio-guiones-20260927` en el commit fuente
> `7c68b07e`. Las 22 láminas y tres captions pasaron QA factual y visual. Son
> esquemas educativos; no son workflows ejecutados ni casos reales de ONIA.

## Recomendación

**Actualización 28-sep:** Sergio confirma «no hemos posteado nada». Este lote
sigue sin publicación y sin autorización final. Conservar los tres artes v2;
primero Matriz n8n, después agente/loop y por último MCP. El
[handoff vigente](../handoff/marca-sergio-guiones-20260927.md) propone un video
y un carrusel por semana como tanda inicial, no como cambio automático de la
cadencia acordada. Horarios de abajo son propuestas históricas, no cola activa.
El caption de Matriz se simplifica a una única CTA, sin alterar sus PNG.

Publicar esta serie primero sólo en Instagram `@sergiourcullo`, una pieza por
semana. Es el destino natural del arte 4:5 y evita convertir seis cuentas en
copias del mismo post. LinkedIn y Facebook requieren adaptación propia; ONIA
requiere decidir si el tema representa producto; YouTube no recibe este paquete
de imágenes.

| ID de aprobación | Pieza exacta | Láminas | Destino propuesto | Horario propuesto (Bolivia, UTC-4) |
|---|---|---:|---|---|
| `SERGIO-CAR-01-V2` | Matriz n8n | 8 | Instagram `@sergiourcullo` | martes 29-sep-2026 · 19:30 |
| `SERGIO-CAR-02-V2` | Automatización, AI Agent o loop | 7 | Instagram `@sergiourcullo` | martes 06-oct-2026 · 19:30 |
| `SERGIO-CAR-03-V2` | MCP en Claude Code | 7 | Instagram `@sergiourcullo` | martes 13-oct-2026 · 19:30 |

Las fechas son propuesta, no programación. Si una fecha vence antes de la
aprobación, debe proponerse otra fecha exacta y aprobarse de nuevo.

## `SERGIO-CAR-01-V2` · Matriz n8n

- Brief: `hermes-content/carousels/briefs/marca-personal/sergio-matriz-n8n-20260921-v2.json`
- SHA-256 brief, caption actualizado el 28-sep: `39fa26f14aea1d37ab9db0e70ecec48565c6d25538c53e2b7b1ba6610a6c62cb`
- Assets: `hermes-content/carousels/out/sergio-matriz-n8n-20260921-v2/slide-01.png` a `slide-08.png`
- Todas las láminas: PNG, 1080×1350.
- Hoja de contacto: [`_contactsheet.png`](../../carousels/out/sergio-matriz-n8n-20260921-v2/_contactsheet.png)
- SHA-256 hoja de contacto: `df868eee6503c024e5a397e84a32a8f0c2ef8472f0588dd64f937203ea004d9d`

Caption final propuesto:

```text
Antes de abrir n8n, dibujá cuatro cosas: entrada, regla, salida y excepción.

Ejemplo de arquitectura para una consulta: Webhook recibe nombre, teléfono, servicio y origen. IF comprueba los campos mínimos. La rama válida puede registrar en Google Sheets y avisar por Telegram. Para que la rama incompleta diga qué dato falta, hay que construir ese mensaje y configurar Webhook para responder con Respond to Webhook. Es un mapa de diseño, no un flujo ejecutado: configurá credenciales, mapeos, respuesta y pruebas con datos de ejemplo.

¿Qué tarea repetís en tu negocio? Contala con su entrada, regla y salida.

#n8n #automatizacion #negocios #pymes #bolivia
```

## `SERGIO-CAR-02-V2` · Automatización, AI Agent o loop

- Brief: `hermes-content/carousels/briefs/marca-personal/sergio-agente-loop-20260921-v2.json`
- SHA-256 brief: `cd9f4739cdbd3539439eeeff4f225d507007d7202a40a6af944862410ea84d74`
- Assets: `hermes-content/carousels/out/sergio-agente-loop-20260921-v2/slide-01.png` a `slide-07.png`
- Todas las láminas: PNG, 1080×1350.
- Hoja de contacto: [`_contactsheet.png`](../../carousels/out/sergio-agente-loop-20260921-v2/_contactsheet.png)
- SHA-256 hoja de contacto: `50119fe07f09a013848d3709a9e1e82a5bc4023d5a2254fd48ef66e46b89e7b8`

Caption final propuesto:

```text
Elegí la arquitectura según el trabajo.

Regla fija: IF valida y enruta. Lenguaje ambiguo: Text Classifier o Basic LLM Chain puede clasificar sin agente; validá el resultado. AI Agent tiene sentido si debe elegir y usar una herramienta conectada. Estado que cambia: consultá la API, esperá y reintentá con un contador y un límite; configurá timeout y ruta de error para avisar a una persona. Wait solo pausa: no limita intentos por sí mismo.

Los diagramas son esquemas de diseño, no workflows ejecutados ni listos para importar. ¿Qué proceso querés ordenar? Describilo en comentarios: ¿regla, herramienta o espera?

#n8n #agentesia #automatizacion #ia #negocios
```

## `SERGIO-CAR-03-V2` · MCP en Claude Code

- Brief: `hermes-content/carousels/briefs/marca-personal/sergio-mcp-claude-code-20260921-v2.json`
- SHA-256 brief: `48656365b16f2c132f595cd1709a46f5f125aca24d16566086a9add7914fbcf3`
- Assets: `hermes-content/carousels/out/sergio-mcp-claude-code-20260921-v2/slide-01.png` a `slide-07.png`
- Todas las láminas: PNG, 1080×1350.
- Hoja de contacto: [`_contactsheet.png`](../../carousels/out/sergio-mcp-claude-code-20260921-v2/_contactsheet.png)
- SHA-256 hoja de contacto: `3c3007c6475b7c5c6a1e5d1d0f044c8e8ef5a6f4aa3cf341f1649ba442546ce2`

Caption final propuesto:

```text
MCP no es un modelo: es un protocolo para que Claude Code descubra herramientas de un servidor externo.

La documentación de Claude Code muestra este comando de ejemplo para registrar el servidor HTTP de Notion: claude mcp add --transport http notion https://mcp.notion.com/mcp. Después, claude mcp list muestra los servidores configurados y un estado de conexión; /mcp permite revisar estado y autenticación dentro de Claude Code. Ni aparecer en la lista ni figurar como conectado prueban que una operación concreta haya funcionado: comprobalo en tu entorno con una lectura permitida.

El contrato get_lead_by_id del carrusel es hipotético, no una herramienta confirmada de Notion. Empezá con permisos mínimos y aprobación humana para acciones sensibles. ¿Qué integración querés entender antes de conectarla?

#mcp #claudecode #notion #agentesia #desarrollosoftware
```

## Gate de aprobación

La aprobación debe nombrar piezas, captions, destino y horarios. Una respuesta
cerrada posible es:

```text
Apruebo SERGIO-CAR-01-V2, SERGIO-CAR-02-V2 y SERGIO-CAR-03-V2 con los captions exactos de este paquete, sólo para Instagram @sergiourcullo, en los horarios propuestos.
```

Ese texto autoriza el lote descrito, no Postiz, una recuperación de servicios,
ni cambios posteriores de arte/copy. Publicar o programar sigue siendo un paso
separado y debe ejecutarse sólo por una ruta con acceso verificado.
