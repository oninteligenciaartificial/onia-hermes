# ONIA Center Dify Assistant Runbook 2026

## Que es Dify

Dify es una plataforma open-source para construir aplicaciones de IA, agentes,
workflows y RAG. En vez de programar todo el comportamiento del asistente dentro
del frontend, Dify permite configurar una app de chat con instrucciones, modelo,
herramientas, knowledge base, logs y API.

Para ONIA, Dify debe usarse como capa de orquestacion del asistente, no como
base de datos privada. ONIA Center sigue siendo el sistema operativo; Supabase
guarda datos operativos; Hermes conserva memoria privada.

Fuentes oficiales:

- Dify: https://dify.ai/
- Dify GitHub: https://github.com/langgenius/dify
- Dify API docs: https://docs.dify.ai/en/use-dify/publish/developing-with-apis
- Dify self-host Docker Compose: https://docs.dify.ai/en/self-host/quick-start/docker-compose

## Estado implementado

ONIA Center ya tiene el endpoint:

```txt
POST /api/onia-center/assistant
```

El frontend de `ONIA Bot interno` intenta consultar ese endpoint. Si Dify no
esta configurado, el bot mantiene la respuesta local deterministica con los datos
visibles para el rol.

## Variables requeridas

```env
ONIA_ASSISTANT_PROVIDER=dify
DIFY_BASE_URL=https://dify.onia.internal
DIFY_ONIA_CENTER_API_KEY=...
```

Fallback aceptado:

```env
DIFY_API_KEY=...
```

`DIFY_BASE_URL` puede apuntar a una instancia self-hosted. El endpoint agrega
`/v1/chat-messages` automaticamente si la URL no termina en `/v1`.

## Regla de privacidad

El endpoint no envia todo ONIA a Dify. Primero autentica al usuario, obtiene el
rol real y arma un snapshot filtrado:

- Sergio: vista completa permitida por ONIA Center.
- Arthur: solo operacion asignada, servicios, tareas, leads y aportes seguros.
- Vendedor: solo leads/tareas/notas visibles, catalogo vendedor y comisiones
  propias estimadas.
- Freelancer: solo tareas, evidencias e ideas visibles.

No se debe enviar a Dify:

- capital Sergio;
- deuda exacta;
- caja real completa;
- utilidad personal;
- estrategia familiar;
- credenciales;
- llaves SSH;
- tokens;
- acuerdos sensibles.

## Como debe configurarse la app en Dify

Crear una app tipo chat/conversational con estas reglas base:

```txt
Eres ONIA Bot interno.
Responde en espanol.
Usa solo el contexto recibido en onia_context_json.
Si un dato no esta visible o no esta registrado, dilo.
No inventes estados de clientes.
No apruebes pagos, descuentos, gastos, comisiones ni contacto sensible.
No reveles capital, deuda, caja real, utilidad privada, credenciales ni estrategia sensible.
Si el usuario pide algo privado fuera de su rol, responde que debe pedir aprobacion a Sergio.
```

Variables que recibira Dify:

- `onia_role`
- `onia_policy`
- `onia_context_json`

## Prueba esperada

1. Iniciar ONIA Center.
2. Iniciar sesion.
3. Abrir `/onia-center?view=asistente`.
4. Preguntar: `Que vendo primero?`
5. Si Dify esta configurado, la respuesta termina con:

```txt
Fuente: Dify conectado por ONIA Center.
```

Si Dify no esta configurado, debe responder en modo local y explicar el faltante.

## Decision operativa

No arrancar Dify en el VPS saturado sin revisar recursos. Primero puede quedar
conectado a una instancia local o a un VPS mejorado. Para produccion interna,
proteger Dify con VPN, tunnel privado o auth fuerte antes de cargar knowledge
base.
