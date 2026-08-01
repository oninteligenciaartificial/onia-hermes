# Variables de entorno — onia-platform

`.env*` esta ignorado por git, asi que la documentacion de las variables vive aca.

| Variable | Obligatoria | Que hace |
|---|---|---|
| `NEXT_PUBLIC_WA_PHONE` | No (tiene default) | Numero de WhatsApp al que apuntan todos los CTA (`wa.me`). Solo digitos, con codigo de pais: `59178491375`. Si no se define, `src/lib/site.ts` cae al numero confirmado por Sergio el 2026-07-26 — el mismo del portfolio de Meta y del pie legal. Definirla sirve para apuntar a otro numero (staging, o el numero del chatbot) sin tocar codigo. |

Ejemplo de `.env.local`:

```
NEXT_PUBLIC_WA_PHONE=59178491375
```

Pendiente conocido (no es una variable todavia): **no hay destino de agenda
conectado**. El formulario de reunion de la seccion "Dos formas de arrancar"
arma el mensaje y abre WhatsApp; cuando exista una herramienta de agenda
(Cal.com u otra) o un endpoint propio, hay que agregar su variable aca y
cambiar el submit de `src/components/sections/agenda-form.tsx`.
