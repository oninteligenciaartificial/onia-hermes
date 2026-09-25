# Publicar — Automatización, AI Agent o loop

Cuenta: `@sergiourcullo`
Formato: 1080 × 1350 px · PNG
Orden: `slide-01.png` → `slide-07.png`
Agendado: sábado 26-sep (`docs/cola/ENTREGA-CARRUSELES-23-27-SEP-2026.md`)

## Corregido el 25-sep — qué cambió y por qué

Sergio Urcullo pidió corregirlo antes de publicarlo. La versión del 21-sep enseñaba lo
contrario del G2 del 22-sep («No uses un AI Agent para clasificar leads»,
`docs/cola/GUIONES-DIA-2026-09-22.md`, Guion 2).

- **Lámina 3:** para clasificar se usa `Basic LLM Chain` + `OpenAI Chat Model` y
  `Structured Output Parser`, no un `AI Agent`. La ruta ya está definida.
- **Lámina 4:** el `AI Agent` va sólo cuando el modelo elige herramientas: el CRM,
  documentos o pedir un dato que falta.
- **Lámina 6:** la matriz pasa a cuatro filas, con la pregunta del G2: ¿quién decide el
  próximo paso?
- **Láminas 2 y 5:** sin backticks. El pack los imprimía literales.
- **Cierre:** «GUARDALO» con firma, **sin palabra para comentar**.
  - La palabra `ARQUITECTURA` llevaba a `sergiourcullo.vercel.app/agentes`, que **dio 404 en
    producción el 25-sep** (medido con la página del sitio: `/stack` sí responde 200).
  - Una palabra que lleva a una página inexistente es una promesa vacía.
  - Para volver a la palabra, primero hay que desplegar `/agentes`. La página ya está
    corregida en `hermes-content/sitio-sergiourcullo/agentes/`. Después se verifica el 200 y
    se re-renderiza con `comment_trigger` y `resource` en el brief.
- **La hoja de contacto anterior** era la captura de un error de Microsoft Edge («No se
  encuentra el archivo»). Se rehízo con las láminas reales.

## Caption

No todo problema de IA necesita un agente. La pregunta es quién decide el próximo paso:

Tus reglas → IF o Switch, con Google Sheets y Telegram.
Leer y clasificar un mensaje → Basic LLM Chain + OpenAI Chat Model, con Structured Output Parser validando el JSON.
El modelo elige entre herramientas (el CRM, documentos, pedir un dato que falta) → AI Agent.
Un estado que cambia con el tiempo → Schedule Trigger + HTTP Request + IF + Wait.

Clasificar un lead no necesita un agente: la ruta ya está definida. Guardalo para tu próximo workflow.

## Hashtags

#n8n #agentesia #loops #automatizacion #ia #negocios

## Antes de publicar

- [ ] Mirar las 7 láminas en el teléfono (`_contactsheet.png` es sólo la vista previa: no se sube).
- [ ] Subir el zip nuevo, `sergio-agente-loop-20260921-para-publicar.zip`, regenerado el 25-sep.
      Si hay una copia bajada antes, es la versión que enseña al revés.

## Cómo se renderizó

```bash
CAROUSEL_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell \
node scripts/carousel_render.js --brief hermes-content/carousels/briefs/marca-personal/sergio-agente-loop-20260921.json \
  --out hermes-content/carousels/out/sergio-agente-loop-20260921 --account sergio --pack community-editorial
```

En Linux se usa `headless_shell`: con el Chromium completo y `--headless=new`, el pie sale
cortado por 88 px.
