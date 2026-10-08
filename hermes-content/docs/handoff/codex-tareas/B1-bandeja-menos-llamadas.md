# B1 · Bandeja: menos llamadas a Chatwoot (velocidad)

Lanzada por la madre el 8-oct. Fuente: `hermes-content/docs/ONIA_BANDEJA_CHATBOT.md` (T1). Rama `codex/bandeja-velocidad`,
creada desde `codex/c16b-bandeja` (PR #127), porque toca los mismos archivos.

## META
Sergio Urcullo quiere que la bandeja propia (`/inbox`) vaya rápida. Hoy hace unas 40-45 llamadas por minuto a Chatwoot con
una conversación abierta (estimado leyendo el código): sondea cada 5 y 15 s aunque la pestaña esté oculta, marca como
leído en cada vuelta y vuelve a averiguar de qué organización es cada conversación.

## Lo que se hace
1. `InboxClient.tsx`: pausar el sondeo con la pestaña oculta (`document.visibilityState`) y retomarlo al volver, con una
   consulta inmediata.
2. Marcar como leído SOLO al abrir una conversación, no en cada sondeo.
3. `app/api/bandeja/[id]/route.ts`: cachear unos 30 s qué organización es dueña de cada conversación, en memoria del
   proceso y con la clave conversación → org. Nunca servir datos de otra organización: si el caché no tiene la entrada o
   venció, se consulta.

## PRUEBA DE HECHO
- Tests:
  - con la pestaña oculta no hay llamadas;
  - al volver hay una consulta;
  - marcar como leído ocurre una vez por apertura;
  - el caché respeta `organizationId` y vence a los 30 s.
- En el resumen, el conteo de llamadas por minuto antes y después (contadas en los tests o con un contador en
  desarrollo). Tiene que bajar al menos a la mitad y llegar a 0 con la pestaña oculta.

## REGLA DE PARADA
- No cambies el protocolo con Chatwoot ni agregues tiempo real (eso es de Plataforma, T2).
- Nada de dependencias nuevas.
- Textos al cliente, de USTED.
