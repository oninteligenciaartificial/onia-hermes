# Onia Center AI Assistant Runbook 2026

## Decision actual

Sergio confirma el 2026-06-26 que Onia no puede operar modelos locales por
ahora. El proveedor inmediato del bot interno sera OpenAI API. Dify queda como
fase posterior para RAG, knowledge base y workflows cuando tenga despliegue
protegido.

Modo actual recomendado:

```env
ONIA_ASSISTANT_PROVIDER=openai
OPENAI_ONIA_CENTER_API_KEY=...
OPENAI_ONIA_CENTER_MODEL=gpt-5.4-mini
ONIA_ASSISTANT_MAX_OUTPUT_TOKENS=900
```

`OPENAI_API_KEY` tambien funciona como fallback, pero para Onia Center es mejor
usar `OPENAI_ONIA_CENTER_API_KEY` y separar gastos/rotacion por sistema.

El endpoint usa OpenAI Responses API con `store:false`, contexto filtrado por
rol y limite de salida. No usar modelos locales hasta tener servidor local/GPU,
VPN/tunnel privado y presupuesto de energia/operacion.

## Que es Dify

Dify es una plataforma open-source para construir aplicaciones de IA, agentes,
workflows y RAG. En vez de programar todo el comportamiento del asistente dentro
del frontend, Dify permite configurar una app de chat con instrucciones, modelo,
herramientas, knowledge base, logs y API.

Para Onia, Dify debe usarse como capa de orquestacion del asistente, no como
base de datos privada. Onia Center sigue siendo el sistema operativo; Supabase
guarda datos operativos; Hermes conserva memoria privada.

Fuentes oficiales:

- Dify: https://dify.ai/
- Dify GitHub: https://github.com/langgenius/dify
- Dify API docs: https://docs.dify.ai/en/use-dify/publish/developing-with-apis
- Dify self-host Docker Compose: https://docs.dify.ai/en/self-host/quick-start/docker-compose

## Estado implementado

Onia Center ya tiene el endpoint:

```txt
POST /api/onia-center/assistant
```

El frontend de `ONIA Bot interno` intenta consultar ese endpoint. Si OpenAI o
Dify no estan configurados, el bot mantiene la respuesta local deterministica con
los datos visibles para el rol.

## Variables Dify

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

El endpoint no envia todo Onia a Dify. Primero autentica al usuario, obtiene el
rol real y arma un snapshot filtrado:

- Sergio: vista completa permitida por Onia Center.
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

1. Iniciar Onia Center.
2. Iniciar sesion.
3. Abrir `/onia-center?view=asistente`.
4. Preguntar: `Que vendo primero?`
5. Si OpenAI esta configurado, la respuesta termina con:

```txt
Fuente: OpenAI API (modelo) por ONIA Center.
```

6. Si Dify esta configurado, la respuesta termina con:

```txt
Fuente: Dify conectado por ONIA Center.
```

Si el proveedor IA no esta configurado, debe responder en modo local y explicar
el faltante.

## Decision operativa

No arrancar Dify en el VPS saturado sin revisar recursos. Primero puede quedar
conectado a una instancia local o a un VPS mejorado. Para produccion interna,
proteger Dify con VPN, tunnel privado o auth fuerte antes de cargar knowledge
base.
