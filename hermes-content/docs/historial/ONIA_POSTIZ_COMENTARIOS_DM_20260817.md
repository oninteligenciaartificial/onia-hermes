# Postiz: qué puede y qué no con comentarios, DM y flujos

> 🔴 **DESACTUALIZADO EN LO QUE SIGUE — corregido el 2026-08-20, RE-CORREGIDO el 2026-08-27.**
> **Sigue siendo cierto:** este doc dice que el ciclo comentario→DM está bloqueado por **S6**, y
> eso es falso desde el 2026-08-18. S6 nunca bloqueó nuestras propias cuentas: `@oniahq` tiene
> rol en nuestra app y opera con **Standard Access**, que no pasa por App Review. S6 bloquea las
> cuentas de **clientes**, que es otra cosa.
>
> ⚠️ **Lo que decía acá y era falso:** que el ciclo estaba *"vivo y probado en producción"* en el
> workflow `gWrVHU8OxI9yugc4`. Contado en vivo el 2026-08-27: **ese workflow está APAGADO** desde
> el 21-ago (lo reemplazó `1jS4jwmNmvcQpqqH`), y el único DM que Meta aceptó en toda la historia
> fue **para Sergio mismo**, no para un lead. Esta frase se copió sin re-contar a cuatro docs y a
> un lote de prompts de contenido. **Es exactamente el error que la regla "verificar es MIRAR"
> existe para evitar.**
>
> **Fuente vigente y única del tema: `ONIA_CIRCUITO_COMENTARIO_DM.md`** (sin fecha, se edita).
> Contexto histórico: `ONIA_AUTOMATIZACION_MENSAJES_20260818.md` §10 y §14 ·
> `ONIA_RECORRIDO_24_7_20260820.md`.
> Lo demás de este doc (qué puede y qué no puede Postiz) sigue vigente.


> 2026-08-17. Pregunta de Sergio: *"¿en Postiz podés responder comentarios y hacer flujos de
> mensajes y enviar videos a DMs en IG, o en qué redes se puede?"*
>
> Verificado **leyendo el código de la instancia que corre en el VPS**
> (`ghcr.io/gitroomhq/postiz-app:latest`), no la documentación. Cada respuesta abajo tiene la
> ruta del archivo donde se comprobó.
>
> Relacionado: `ONIA_CICLO_COMENTARIO_DM_20260815.md` — el ciclo manual que hoy sí funciona.

---

## 1. Las respuestas, cortas

| Lo que se preguntó | Postiz | Dónde se verificó |
|---|---|---|
| **Responder comentarios de otros** | ❌ **No, en ninguna red** | no existe `replies` en ningún provider |
| **Enviar DM** | ❌ **No, en ninguna red** | cero endpoints de mensajería en los 23 providers |
| **Mandar video por DM de IG** | ❌ No | consecuencia de lo anterior |
| **Flujos de mensajes / autoresponder** | ❌ No existe el motor | no hay controlador de flujos |
| **Comentar en el post propio** | ✅ **Sí, y en 23 redes** | `comment()` implementado — §3 |
| **Webhooks al publicar** | ✅ Sí | `webhooks.controller.ts` |

**Postiz es un programador de publicaciones. No es una bandeja de entrada.** Publica hacia
afuera; no lee ni responde lo que llega.

---

## 2. Por qué no, con la prueba

### 2.1 — El modelo `Comments` de Postiz NO son los comentarios de Instagram

Es lo que más confunde, porque la tabla se llama igual. El esquema
(`libraries/nestjs-libraries/src/database/prisma/schema.prisma`):

```prisma
model Comments {
  id             String
  content        String
  organizationId String
  postId         String
  userId         String        ← usuario de POSTIZ, no de Instagram
  user           User   @relation(fields: [userId], references: [id])
}
```

El `userId` apunta a la tabla `User` de Postiz. **Son notas internas del equipo sobre un post
programado** — para que dos personas discutan un borrador antes de publicarlo. No tiene
ninguna relación con la gente que comenta en Instagram.

### 2.2 — No hay mensajería en ninguno de los 23 providers

Primera búsqueda: cinco archivos (`discord`, `slack`, `telegram`, `tiktok`, `twitch`) contenían
la palabra "message". Parecía haber DM ahí.

**No lo había.** Al buscar el endpoint real —una URL de `/messages`, `/conversations` o
`direct`— los cinco dieron **cero**. La coincidencia era el campo `message` del cuerpo de la
publicación, que es el texto del post.

*(Y aunque lo hubiera: en Discord, Slack y Telegram "publicar" ES mandar un mensaje a un canal.
Nunca habría sido un DM a un prospecto.)*

### 2.3 — Instagram: el bloqueo no es de Postiz, es de Meta

Automatizar comentario→DM en Instagram exige permisos de mensajería de la Graph API de Meta,
que siguen bloqueados (**S6**). Está documentado desde el 2026-08-15 en
`ONIA_CICLO_COMENTARIO_DM_20260815.md` §4.

**Ninguna herramienta de programación de contenido puede saltarse eso**, porque el permiso lo
da Meta a la app, no a la herramienta. Cambiar Postiz por otro programador no destraba nada.

---

## 3. ✅ Lo que SÍ se puede, y no lo estábamos usando

### El comentario automático en el post propio

`comment()` está implementado en **23 providers**, incluido `instagram.standalone` — el que
usa `@oniahq`. Publica un comentario **en nuestra propia publicación**, apenas sale.

Verificado en `instagram.provider.ts`:

```
POST https://graph.instagram.com/v20.0/{postId}/comments?message=...
```

Y el disparador, en `apps/orchestrator/src/activities/post.activity.ts` (`postComment`): toma
**los elementos 2 y siguientes del arreglo `value[]`** del post y los publica como comentarios
del primero.

**O sea que ya está disponible por la API pública, sin tocar nada:**

```json
"value": [
  { "content": "<el caption>", "image": [...] },
  { "content": "<el primer comentario>" }
]
```

### Para qué sirve de verdad

| Uso | Por qué |
|---|---|
| **Sacar los hashtags del caption** | El caption queda limpio y legible; los hashtags viven abajo sin ensuciar las primeras dos líneas, que son las que deciden si alguien abre el post |
| **Repetir el CTA** | El banco de carruseles (§7.5) ya dice que *el CTA aparece 3 veces*. El primer comentario es el cuarto lugar, gratis |
| **Poner el link `?src=`** | Instagram no hace clicable el link del caption. En el comentario tampoco, pero al menos se puede copiar |

⚠️ **Lo que NO es:** no responde a nadie. Es un comentario nuestro sobre nuestro propio post.
No sustituye el ciclo manual comentario→DM.

---

## 4. Qué se hace mientras tanto

**El ciclo manual de `ONIA_CICLO_COMENTARIO_DM_20260815.md` §4 es la respuesta**, y ya está
escrito paso a paso: alguien comenta la palabra → se abre el DM a mano desde el comentario →
se pega el bloque del recurso → se anota el lead.

Ese doc lo dice con todas las letras: *"cuando se resuelva S6, este mismo guion es el que se
convierte en respuesta automática — no cambia el contenido, cambia quién lo envía."*

### Si algún día se quiere automatizar de verdad

No es con Postiz. Las dos vías reales:

| Vía | Qué haría falta |
|---|---|
| **Chatwoot** (ya corre en el VPS) | Es una bandeja de entrada real y soporta Embedded Signup de Meta. Necesita igual el permiso de mensajería de Meta (S6) |
| **n8n + Graph API directa** | Mismo bloqueo de permisos, más trabajo de construcción |

**El bloqueo es siempre el mismo: S6.** No hay herramienta que lo evite.

---

## 5. Estado

- ❌ Responder comentarios, DM, flujos, video por DM: **imposible con Postiz, en cualquier red**
- ✅ Comentario automático en el post propio: **disponible hoy**, 23 redes, ya por la API pública
- ⏸️ Automatizar comentario→DM en Instagram: bloqueado por **S6** (permiso de Meta), no por la herramienta
- 📋 Mientras tanto: el ciclo manual de `ONIA_CICLO_COMENTARIO_DM_20260815.md`
