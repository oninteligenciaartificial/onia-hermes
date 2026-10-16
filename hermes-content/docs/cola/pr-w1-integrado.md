# PR: widget de chat propio integrado (W1 + W1b) — cuerpo para pegar

**Cómo se abre (madre, en la PC, 3 comandos desde el clon de `onia-platform` al día con `master`):**

```bash
git fetch <ruta-onia-hermes>/hermes-content/docs/cola/ramas-locales/plataforma-w1-integrado-20261009.bundle 'refs/heads/integ/w1-w1b:refs/heads/integ/w1-w1b'
git push -u origin integ/w1-w1b
# PR draft contra master con el título y el cuerpo de abajo
```

Después de abrirlo, cerrar #131 y #137 con una línea: «Integrados en el PR nuevo, contra el master de hoy».

---

**Título:** `feat(chat): widget de chat propio, seguro e integrado con master — W1 + W1b`

**Cuerpo:**

Integra en un solo PR contra `master` (`ef3e2325`) el widget propio (W1, #131) y su endurecimiento (W1b, #137).
W1b estaba apilado sobre W1, así que su rama ya traía los dos; se mergeó `master` y se resolvieron tres conflictos:

- `CanalWebCard.tsx`: queda el caso «chat anterior» de W1b, con los textos en usted (master ya había pasado el aviso).
- `lib/chatbot/apagar-canal.test.ts`: el mock conserva lo de master y suma `createApiInbox`.
- `docs/PROJECT_BACKLOG.md`: quedan las entradas de los dos lados.

El error nuevo de W1 al encender el chat pasa a usted (el gate de voseo lo marcaba) y su test de render también.

**Gates (Plataforma, nube, 9-oct):** `npx tsc --noEmit` 0 · eslint de los 26 archivos tocados 0 · `npx vitest run`
completo **9.934 en verde, 0 rojos** (la primera corrida dio 1 rojo: el test que fijaba el texto en tú, ya corregido).

**Revisión de seguridad (una lente, sobre el diff):** el diseño es correcto — rutas en lista cerrada y sin query,
inbox resuelto desde la propia organización, identidad del visitante firmada con HMAC en el servidor (token que nunca
sale), respuestas reducidas a `source_id` / `id` / mensajes públicos verificados contra la API administrativa, Redis
que falla cerrado, sin redirecciones, widget en shadow DOM con `textContent`. Exención de sesión exacta
(`/api/chat-publico/*` y `/onia-chat.js`). Quedan:

1. **Medio, código — tarea `codex-tareas/W1c`:** los mensajes solo tienen tope por IP; falta tope por organización y
   por conversación (cada mensaje despierta al bot).
2. **Medio, infraestructura, de TODA la plataforma — decisión de Sergio Urcullo:** el VPS contesta directo como
   `app.onia.com.bo` sin pasar por Cloudflare (medido: 200 en `187.77.16.63`), así que `cf-connecting-ip` se puede
   inventar y ningún límite por IP frena (widget, altas, pedidos de acceso). Arreglo: que el origen acepte solo las IPs
   de Cloudflare (o un túnel de Cloudflare para la app).
3. **Bajo — en W1c:** `data-color` sin validar dentro del CSS del widget.

**No publicar** hasta: W1c mergeado, el origen cerrado a Cloudflare, `/public/api/` bloqueado en `chat.onia.com.bo`
(Traefik) y `hmac_mandatory` en el inbox API — los tres pasos de infraestructura con el OK de Sergio Urcullo.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
