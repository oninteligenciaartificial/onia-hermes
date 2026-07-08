# Handoff a n8n/infra — La Ciencia de tu Cuerpo

Para el carril `infra-deploy-n8n` (G). Este doc describe qué parte del pipeline
puede volverse workflow autónomo y qué parte **nunca** se automatiza, con los
nodos n8n concretos ya verificados contra la instancia real (no genéricos).

## Qué se automatiza vs. qué pasa siempre por Sergio

| Etapa | Automatizable | Por qué |
|-------|----------------|---------|
| Elegir próximo tema del backlog (`pipeline/topics-backlog.json`) | Sí | Solo lectura, sin riesgo |
| Generar borrador de research brief + guion (LLM) | Sí, como **borrador** | El guion **SIEMPRE** pasa por revisión humana antes de seguir — nunca se auto-aprueba |
| Fact-check / gate YMYL de temas sensibles | No (revisión humana obligatoria) | Regla dura del canal, ver `PLAN.md` §4 y `pipeline/approval-matrix.json` |
| Generar assets pagos (Higgsfield: imágenes/clips) | Sí, **solo tras aprobación de presupuesto** | Regla GASTO — nunca sin OK explícito de Sergio |
| Generar voz narrada paga | Sí, **solo tras aprobación de presupuesto** | Igual que arriba |
| Ensamblado (ffmpeg concat + pan/zoom + narración) | Sí, sin gate adicional | No gasta dinero, no publica nada |
| `--dry-run` de la subida | Sí, sin gate | No llama a la API real, solo valida el payload |
| Subida privada real a YouTube | Sí, **solo tras aprobación explícita** | Ver texto de aprobación en `approval-matrix.json` |
| Publicación pública | **Nunca automática** | Gate crítico, siempre manual/explícito |

## Arquitectura sugerida del workflow

```
[Schedule Trigger, semanal]
  -> [Code: elegir proximo topic de topics-backlog.json con status=backlog]
  -> [LLM: draft research-brief.json + script.md]
  -> [Telegram sendAndWait: aprobar guion? (Approve/Decline)]
       -> Decline: marcar needs_revision, terminar
       -> Approve: continuar
  -> [Code: armar shot-list.json + costo estimado]
  -> [Telegram sendAndWait: aprobar gasto de N creditos? (Approve/Decline)]
       -> Decline: terminar, dejar en espera
       -> Approve: continuar
  -> [Higgsfield MCP / API: generar assets segun shot-list]
  -> [ffmpeg: ensamblar video final]
  -> [YouTube node: dry-run/validacion de metadata]
  -> [Telegram sendAndWait: aprobar subida privada? adjuntar preview]
       -> Approve: [YouTube node: upload, privacyStatus=private]
  -> [Telegram: notificar listo para revision final en YouTube Studio]
  -> FIN — publicar sigue siendo 100% manual, fuera de este workflow
```

## Nodos n8n verificados (no genéricos — confirmados contra esta instancia)

- **`n8n-nodes-base.youTube`** (resource `video`, operation `upload`). Usa
  credencial nativa **`youTubeOAuth2Api`** (se configura una vez en n8n →
  Credentials, no en `$env` — ver nota de plan abajo). Parámetros relevantes:
  `title`, `categoryId` (25=Education vía `getVideoCategories` load-option, o
  hardcodear `"27"` si el load-option no la lista), `binaryProperty` (el
  archivo de video), y dentro de `options`: `description`, `tags`,
  `defaultLanguage`, `selfDeclaredMadeForKids` (**debe ir siempre `false`**),
  `privacyStatus` (**debe ir siempre `"private"` en este workflow** — nunca
  `"public"` acá).
  - **Atención — hueco detectado:** la definición de parámetros de este nodo
    (v1) **no expone `containsSyntheticMedia`** (el campo de disclosure IA
    agregado a la API en oct-2024, ver `PLAN.md` §1). Antes de confiar en el
    nodo nativo para esa regla dura, confirmar si una versión más nueva del
    nodo ya lo soporta. Si no, hacer un `videos.update` con part=`status`
    inmediatamente después del upload usando un nodo **HTTP Request**
    autenticado con la misma credencial OAuth2 (`youTubeOAuth2Api` se puede
    reusar como Generic OAuth2 credential en HTTP Request), seteando
    `status.containsSyntheticMedia: true` a mano. No omitir este paso — es
    una regla dura del canal, no opcional.
- **`n8n-nodes-base.telegram`** (resource `message`, operation `sendAndWait`,
  `responseType: "approval"`). Es el mecanismo nativo de n8n para pausar el
  workflow y esperar Approve/Decline de Sergio por Telegram — **usar esto en
  vez de un polling casero** para los 3 gates de aprobación (guion, gasto,
  subida). Trae `limitWaitTime` configurable (por defecto 45 min; para este
  canal conviene subirlo a horas/días ya que Sergio revisa guiones en batch,
  no al instante).

## Credenciales — regla del plan VPS (sin `$env`)

Este plan de n8n (self-hosted Easypanel) **no tiene `$env.VARIABLE`
disponible**. Todo secreto va como n8n Credential, nunca hardcodeado en nodos
ni en variables de entorno del workflow:

- YouTube: credencial nativa `youTubeOAuth2Api` (n8n maneja el refresh de
  token solo). El `client_secret`/`client_id` de Google Cloud se cargan UNA
  VEZ en la UI de credenciales de n8n, no en un archivo ni en un nodo.
- Higgsfield: si se llama por HTTP en vez de MCP, credencial "Header Auth".
- El script local `scripts/upload-youtube.mjs` de este repo (Node, OAuth
  installed-app con servidor local en `localhost:53682`) es para correr el
  pipeline **a mano/en dry-run desde una máquina de desarrollo** — no es lo
  que corre en n8n. n8n usa su propia credencial nativa, con su propio flujo
  de autorización (independiente del script local).

## Reuso con el canal hermano (`onia-automatiza`, carril K)

Ambos canales (`ciencia-cuerpo` y `onia-automatiza`) necesitan exactamente el
mismo esqueleto: elegir tema → guion con aprobación → generar con gate de
gasto → ensamblar → `dry-run` → aprobación de subida → subida privada →
publicar manual. La recomendación es **un solo sub-workflow n8n parametrizado
por carpeta de canal** (recibe `channel_folder` como input: `channels/ciencia-cuerpo`
o `channels/onia-automatiza`) en vez de duplicar el workflow entero — evita
mantener dos copias casi idénticas cuando cambie un gate o un nodo.

## Gates que nunca se saltan, aunque todo lo demás sea autónomo

1. Ningún guion se aprueba solo — siempre pasa por Telegram `sendAndWait`
   humano, sin excepción, ni siquiera para temas ya marcados `ymyl_sensitive_topic: false`.
2. Ningún gasto real (Higgsfield, voz) ocurre sin aprobación explícita previa
   con el texto exacto de `pipeline/approval-matrix.json`.
3. Ninguna subida real omite `containsSyntheticMedia: true` (ver hueco
   detectado arriba).
4. Ninguna subida sale con `privacyStatus` distinto de `"private"` desde este
   workflow.
5. Publicar (`public`) es SIEMPRE un paso manual fuera de n8n — no existe un
   nodo "publicar" en este workflow a propósito.

## Estado a la fecha de este handoff (2026-07-08)

- No existe ninguna credencial de YouTube en n8n todavía (`list_credentials`
  solo devuelve Google Sheets/Calendar/Drive). Bloqueo real: Sergio debe crear
  el proyecto de Google Cloud + OAuth y pasar la auditoría de compliance
  antes de que este workflow pueda hacer nada más que `dry-run` (ver
  `PLAN.md` §9).
- El pipeline (`pipeline/`) y el piloto (`pilot/001-azucar-y-el-cerebro/`) ya
  están listos y validados (`node pipeline/validate.mjs pilot/001-azucar-y-el-cerebro`)
  — este handoff describe el paso SIGUIENTE (automatizar), no reemplaza la
  revisión humana del primer piloto.
