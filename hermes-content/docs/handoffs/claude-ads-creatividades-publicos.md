# Handoff — carril `claude/ads-creatividades-publicos`

> Última actualización: 2026-08-23, cierre de la sesión de contenido y lanzamiento de Lucía.
> Formato: los 6 campos de `README.md` de esta carpeta.

## 1. Objetivo

Dejar a Lucía lista para publicar (reel + carrusel fijado aprobables) y el sistema de
marketing de las tres cuentas escrito como fuente de verdad.

## 2. Estado en que terminó

**EN PRODUCCIÓN — encendido y verificado ahí:**

- **Palabra HUMO viva** en la cuenta de Lucía (workflow v10 publicado). Entrega el PDF
  *"5 herramientas de IA que sí sirven en un negocio boliviano"*, verificado con HTTP 200 en
  `onia.com.bo/recursos/5-herramientas-ia-bolivia.pdf`.
- **Cuenta de Sergio cableada** al comentario→DM: `entry_id 17841441395192146` mapeado,
  webhook de comentarios suscrito. Palabras vacías a propósito (falta la comunidad).
- **Postiz reparado.** Su backend estaba caído: pm2 lo daba "online" con 64 MB pero no
  escuchaba el 3000 (el VPS se había reiniciado 6 h antes). `pm2 restart backend` → `/api/user/self`
  responde 401, que es lo correcto sin sesión.
- **Bug latente arreglado:** el PDF de la palabra LISTA vivía SOLO dentro del contenedor, sin
  versionar. El próximo deploy lo borraba y esa palabra empezaba a dar 404. Rescatado y
  commiteado en `onia-platform` (commit `06242bb` de ese repo).
- **Cola de @oniahq** corriendo sola: 2 publicados + 8 en cola hasta el 9-sep.

**A MEDIAS — con el dónde exacto:**

- `reel-lanzamiento-20260822/final/lucia-lanzamiento.mp4` (v6, 22 s, master −14.33 LUFS):
  **renderizado, esperando el OK de Sergio.** Nada se publica sin eso.
- `posts-20260807/render-fijado/slide-01..07.png` — carrusel fijado renderizado, mismo estado.
- Soul `LUCIA-SINTETICA-v3` (`e6d8703c-…`): entrenado y **probado**. Ver campo 4: no ganó.
- **MCP de Postiz agregado** a la config del proyecto — aparece al reiniciar Claude Code.
- **Facebook en Postiz: cerrado como no-viable por API**, con salida elegida (cross-post
  nativo). No requiere más trabajo técnico, solo dos toques de Sergio en el celular.
- Limpieza de versiones viejas de Lucía en Higgsfield: **imposible por API** (el MCP lista y
  crea, no borra). Queda para la interfaz web; la lista de qué se va está en `LUCIA.md §14`.

## 3. Archivos y cambios

**Sistema y decisiones**
- `docs/ONIA_ARQUITECTURA_CUENTAS_Y_MODELOS.md` — 1 modelo, 3 personas, destino del tráfico,
  §7 Facebook, §8 receta para publicar recursos.
- `docs/ONIA_SISTEMA_MARKETING_LUCIA_ONIA.md` — la escalera + §10 moldes con cronómetro.
- `docs/ONIA_AUDITORIA_LUCIA_Y_PLAN_DIARIO.md` — la cuenta medida por API + §7 música de IG.
- `docs/handoffs/` — este sistema (README con el formato + este archivo).
- `CLAUDE.md` línea 97 — editada para apuntar al handoff.

**Lucía**
- `references/modelos/lucia/LUCIA.md` — §12 prompt por bloques, §13 guion multi-escena,
  §14 inventario de Higgsfield + veredicto del Soul.
- `references/modelos/lucia/PRODUCCION_MES_1.md` — las 8 piezas guionizadas.
- `references/modelos/lucia/reel-lanzamiento-20260822/` — el reel completo con sus scripts.
- `references/modelos/lucia/posts-20260807/render-fijado/` — el carrusel fijado.
- `hermes-content/recursos/humo/` — el PDF, su HTML fuente y los dos scripts que lo generan.

**Motor**
- `.claude/skills/editor-videos/scripts/karaoke-captions.mjs` — verde de marca, sin sombra,
  fuente 0.042, fix del color crudo.
- `.claude/skills/editor-videos/scripts/tts-elevenlabs.mjs` — sin `voice_settings` forzados.
- `.claude/skills/editor-videos/SKILL.md` — whip pan, `video_edit`, reparto de segundos.
- `references/marca-personal-sergio/` — foto de perfil, 3 fondos.

## 4. Intentos fallidos

*El campo que más vale: cada uno de estos costó tiempo y no hay que repetirlo.*

- **Voz de Lucía, rechazada dos veces.** Primero usé la voz element de Higgsfield, que Sergio
  había descartado el 25-jul — la memoria la titulaba "la voz de Lucía" e invitaba al error.
  Después, ya con la Marcela correcta, seguía sonando mal: la causa eran los `voice_settings`
  que el script forzaba (stability .45 / style .35). **La voz aprobada sale con los defaults.**
- **Narración en 4 llamadas separadas** → 4 prosodias pegadas. Va en UNA sola llamada.
- **Borde engrosado en la palabra activa del karaoke** (`\bord ×1.35`): a 81 px el trazo negro
  se come el glifo y sale un bloque negro. El énfasis va solo por color.
- **`toAssColor` con el hex como fallback**: devuelve el fallback SIN convertir, libass no lo
  entiende y pinta de negro. El default va como VALOR del flag.
- **Sombra en el karaoke** (`Shadow 2`): con outline grueso se lee como un segundo subtítulo
  fantasma detrás. Va en 0.
- **Apoyos visuales al 80% del ancho**: tapaban la pieza entera. Van a 52/46%, y el tercero
  pasó a ser la captura real de la web dentro de un marco de navegador.
- **Foto: convertir P3→sRGB.** Correcto en teoría, pero sube el rojo de 168 a 178 y empeora en
  visores sin gestión de color. Va: píxeles originales + perfil P3 original embebido.
- **Detección del logo por `r-g>45`**: 34.318 falsos positivos (toda la piel, que tiene matiz
  26). El logo es rojo puro, matiz <12 → 587 px exactos.
- **Máscara dura + erosión para el pelo**: destruye los mechones, que son píxeles
  semitransparentes. Va alpha matting + decontaminación de color.
- **`sfx.mjs` con rutas estilo Git Bash** (`/c/...`): no las resuelve. Rutas `C:\`.
- **Speaches en el VPS** se colgó tras el reinicio. Se instaló Whisper local; ya no dependemos
  del VPS para transcribir.
- **Soul `LUCIA-SINTETICA-v3` NO le gana al Element ancla.** Probado A/B con el mismo prompt:
  ignora el "mirando a cámara", atenúa las pecas y corre la estructura de la cara. Mejora al
  Soul viejo (sin piel roja, sin deuda de consentimiento) pero **queda de respaldo**.
  Confirma la regla: la identidad se sostiene en LA REFERENCIA, no en el entrenamiento.
- **Facebook en Postiz: el App Secret no era el problema.** Leído en
  `facebook.provider.js:184`, Postiz arma el OAuth **clásico** (`client_id` + `scope`); la app
  "OnIA Social API" tiene **Login for Business** (`config_id`), que ni muestra el campo de
  redirect URIs. Incompatibles. Cargar credenciales no habría servido.
- **Música de Instagram por API**: Postiz **sí** la soporta, pero exige
  `type === 'graph.facebook.com'` y nuestras cuentas usan `instagram-standalone`. Además nunca
  funciona en carruseles. Las piezas mudas con música se publican a mano.
- **Copiar un PDF al contenedor NO alcanza.** Next cachea el índice de `public/` al arrancar:
  medido al segundo (contenedor 01:31, PDF que funciona 01:23, PDF nuevo 02:55). Descartados
  permisos (`chown`) y caché de Cloudflare (`cf-cache-status: BYPASS`). Hay que reiniciar.

## 5. Próximos pasos

1. **OK de Sergio al reel** → publicar el lanzamiento y disparar el calendario 23-30 ago.
2. Piezas que faltan del mes 1: **L6** (carrusel "5 señales", ~4 cr) y **L5** (demo de producto
   en 17 s con capturas reales, 0 cr). Después L3, L4, L7, L8.
3. Palabra clave en 5 de los 8 posts en cola de @oniahq + horario 19:00 → 20:00 Bolivia.
   *(Propuesto y sin respuesta explícita — no se tocó nada.)*
4. Historias automatizadas: extender `postiz_schedule.mjs` con `post_type: story` + cron.
5. Limpiar versiones viejas de Lucía en Higgsfield, por la interfaz web.
6. Cuando el MCP de Postiz esté activo (tras reiniciar), programar directo sin SSH.

## 6. Qué depende de Sergio

- 🔴 **OK al reel** — es lo único que bloquea todo el calendario de Lucía.
- 🔴 **Rotar el token de Postiz**: se pegó en el chat y quedó en el transcript. Da acceso
  completo a la API.
- 🟡 **Tarjeta en ONIA Ads** — bloqueo de amplificación desde hace días.
- 🟡 **Dos toques en el celular**: activar *Compartir en otras apps → Facebook* en @oniahq, y
  poner el link en la bio de Lucía (hoy dice 👇 y no apunta a nada).
- 🟡 **Calentar la cuenta de Lucía**: seguir 50-70 cuentas del nicho.
- 🟡 Conectar **TikTok de Lucía** en Postiz.
- ⚪ Precio del curso (fase 3, sin apuro).
