# sergiourcullo — sitio de guías

Sitio estático de las guías de marca personal. **Sin build, sin dependencias, sin CDN
propio**: HTML y un CSS. Se sirve tal cual está.

## Qué hay

| Ruta | Qué es | Quién la ve |
|---|---|---|
| `/` | Presentación corta + lista de guías | Todos |
| `/stack` | «El stack de $200» — las 6 herramientas, qué hace cada una, qué NO hace, cómo instalarla | Todos |
| `/stack/archivos` | Los archivos listos: `docker-compose` de n8n, las 6 respuestas de WhatsApp, la plantilla del `SOUL.md` | **Sólo Onia Community** |

`/stack/archivos` **no está enlazada desde ninguna página**, lleva `noindex` y está en el
`robots.txt`. ⚠️ Eso NO es seguridad: quien tenga el link entra, y quien lo reciba lo puede
reenviar. Es higiene, y alcanza para lo que hay adentro. Si algún día hay que cerrarlo de
verdad, hace falta autenticación y esto no la tiene.

## Decisiones que no hay que deshacer

- **El verde va en dos tonos.** `#00C661` es el de marca y da ~1,7:1 sobre fondo claro —
  ilegible como texto. Va como **superficie** (chips, casillas, botones, la cinta). Para
  **texto** sobre claro va `#007A44`, el mismo verde bajado de luminosidad, que da 5,4:1.
  En modo oscuro se invierte. Está explicado arriba del `estilo.css`.
- **Rutas absolutas** (`/estilo.css`, `/stack`). Rompen si abrís el HTML con doble clic
  (`file://`) y funcionan bien servido. Para mirarlo local:
  `python -m http.server 8099` dentro de esta carpeta.
- **Los slugs no se tocan.** El día que se compre `sergiourcullo.com` se apunta al mismo
  proyecto y las URLs siguen siendo las mismas. Cambiar un slug rompe links ya repartidos
  por DM.
- **Nada de venta de Onia.** Estas páginas son contenido. El sistema propio se nombra una
  sola vez, en la lista de lo que la guía NO cubre.

## Deploy — 🟢 EN EL AIRE

**https://sergiourcullo.vercel.app**

| Ruta | |
|---|---|
| `https://sergiourcullo.vercel.app/` | índice |
| `https://sergiourcullo.vercel.app/stack` | la guía |
| `https://sergiourcullo.vercel.app/stack/archivos` | **el link de la comunidad** — no enlazado, `noindex` verificado en la respuesta HTTP |

Proyecto `sergiourcullo` en Vercel, plan hobby, deploy manual por MCP (no por git).
**Para volver a desplegar** hay que mandar los archivos de esta carpeta otra vez con
`deploy_to_vercel` — el proyecto está linkeado a un repo `oninteligenciaartificial/sergiourcullo`
que **no es éste**, así que un push acá no publica nada.

⚠️ **El alias largo `sergiourcullo-oninteligenciaartificial-8139s-projects.vercel.app` está
detrás del SSO de Vercel** y devuelve 302 a un login. **El que se reparte es el corto**, que
responde 200 público. Si alguna vez el corto empieza a pedir login, es Deployment Protection:
Vercel → proyecto → Settings → Deployment Protection → Vercel Authentication en *Disabled*.

Cuando se compre `sergiourcullo.com`, se agrega como dominio a este mismo proyecto y **los
slugs no cambian**: los links repartidos por DM siguen sirviendo.

## Cómo se agrega una guía nueva

1. `mkdir <slug>` y un `index.html` copiando la cabeza de `stack/index.html`.
2. Sumar el bloque `<a class="guia">` en `index.html`, arriba de los anteriores.
3. Si tiene archivos para la comunidad: `<slug>/archivos/index.html` con `noindex`, y
   sumar la ruta al `robots.txt`.
4. Anotarla en `docs/ONIA_RECURSOS_UN_RECURSO_TRES_PUERTAS.md` con su estado.
