# Variables de entorno — onia-platform

`.env*` esta ignorado por git, asi que la documentacion de las variables vive aca.

| Variable | Obligatoria | Que hace |
|---|---|---|
| `NEXT_PUBLIC_WA_PHONE` | No (tiene default) | Numero de WhatsApp al que apuntan TODOS los CTA (`wa.me`), incluidas las paginas de servicios. Solo digitos, con codigo de pais. Si no se define, `src/lib/site.ts` cae a `59175414930` — el numero que esta en WhatsApp Cloud API con el chatbot atendiendo. Definirla sirve para apuntar a otro numero (staging) sin tocar codigo. **Es build-time: cambiarla exige reconstruir y redesplegar, no alcanza con reiniciar el contenedor.** |

Ejemplo de `.env.local`:

```
NEXT_PUBLIC_WA_PHONE=59175414930
```

Pendiente conocido (no es una variable todavia): **no hay destino de agenda
conectado**. El formulario de reunion de la seccion "Dos formas de arrancar"
arma el mensaje y abre WhatsApp; cuando exista una herramienta de agenda
(Cal.com u otra) o un endpoint propio, hay que agregar su variable aca y
cambiar el submit de `src/components/sections/agenda-form.tsx`.
