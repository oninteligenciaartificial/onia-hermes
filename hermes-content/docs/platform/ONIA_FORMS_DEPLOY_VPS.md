# Onia Forms — Deploy VPS (runbook)

> ⚠️ **2026-08-27 — se cayo y se revivio.** El contenedor `onia-forms` DESAPARECIO
> (probablemente en la limpieza del VPS durante la crisis de CPU). `forms.onia.com.bo`
> quedo devolviendo **502 durante dias** y nadie se entero: la ruta de Traefik sigue
> viva aunque el contenedor detras no exista.
>
> **Nada se habia perdido**: los 3 HTML seguian en `/opt/onia-forms/html`, la config de
> nginx en `/opt/onia-forms/nginx/default.conf`, y la ruta en Traefik. Faltaba SOLO
> volver a correr el contenedor. Comando exacto en "Como se levanta" abajo.
>
> **Cambio al revivirlo: ya NO se publica el puerto `8189`.** El firewall solo deja
> 80/443, asi que ese puerto nunca sirvio para verificar y era exposicion al pedo.
> Traefik llega por la red `easypanel`.

## Que cubre cada formulario, y que falta para construir una web (2026-08-27)

Sergio pregunto si lo que se pide alcanza para generar la web. **Medido contra las 39
preguntas de `web-factory/INTAKE_CLIENTE.md`**, que es lo que el Lab necesita para
construir sin idas y vueltas:

| Formulario | Campos | Para que sirve DE VERDAD |
|---|---|---|
| `/alta` | 34 | **Alta en el sistema + configurar el bot.** Su seccion "para tu web" es superficial |
| `/brief` | 41 | **Este SI es el levantamiento de web.** Cubre ~80% del intake |
| `/cuestionario` | 40 | descubrimiento comercial |

**El `/alta` solo NO alcanza para una web.** El `/brief` casi si — y los dos juntos se
tapan huecos entre ellos: el brief no pide rubro, ciudad, direccion, horarios ni NIT, y
el alta si.

### Lo que NO tiene NINGUNO de los dos

Verificado en contexto, no por conteo de substring (`cta` matcheaba "conectar", `estilo`
matcheaba "enlaces de estilos"):

| Falta | Mapea a | Gravedad |
|---|---|---|
| **Que debe hacer el visitante + texto y destino del boton** | `cta.label`, `cta.url` | 🔴 **critico**: sin CTA la web informa pero no convierte |
| **Que NO quieren** (colores, estilos, elementos) | — | 🔴 es lo que evita rehacer el trabajo entero |
| Estilo visual explicito (minimalista / premium / calido…) | — | 🟡 parcialmente suplido por las referencias |
| Tagline / eslogan | `tagline` | 🟡 |
| Titulo SEO (tiene `seo_desc` y `keywords`, falta el title) | `seo.title` | 🟡 |
| Imagen OG | `seo.ogImage` | 🟡 |
| Telefono fijo (solo pide WhatsApp) | `contacto.tel` | 🟢 |
| Quien paga dominio + hosting | — | 🟢 operativo |

⚠️ **FAQ SI existe** — esta en el `/alta`, con repetidor de pregunta/respuesta (pensado
para el bot, sirve igual para la seccion FAQ de la web). Se listaba como faltante por
error.

### La decision que sale de esto

**NO hay que construir un formulario nuevo.** Hay que agregarle ~6 campos al `/brief`, y
el CTA es el unico que no puede faltar. Inflar el `/alta` seria el error opuesto: ya
tarda 10 minutos y es la puerta de entrada — subirle la friccion cuesta altas.

Pendiente de decision de Sergio: agregar esos campos al `/brief`.

---

## Como se levanta (probado 2026-08-27)

```bash
docker run -d --name onia-forms --network easypanel --restart unless-stopped   -v /opt/onia-forms/html:/usr/share/nginx/html:ro   -v /opt/onia-forms/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro   nginx:alpine
```

**Verificacion que SI cuenta** (un 200 no alcanza — el form puede renderizar y postear
al vacio):

```bash
# 1. las 3 rutas responden
for p in /cuestionario /brief /alta; do curl -s -o /dev/null -w "%{http_code}
" https://forms.onia.com.bo$p; done

# 2. el webhook de n8n sigue REGISTRADO (sin escribir datos):
curl -s https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/alta-cliente
# "not registered for GET ... did you mean POST?"  => el POST esta ACTIVO
# "The requested webhook is not registered"        => el workflow esta APAGADO
```

Los 3 webhooks se verificaron activos el 2026-08-27.

⚠️ **Ojo de marca:** el formulario es AZUL y la marca de Onia es verde. Queda anotado,
no se toco: es decision de diseno, no un bug.

---

Cuestionario, brief y alta de clientes (`/cuestionario`, `/brief`, `/alta`),
autohospedados en el VPS (`187.77.16.63`, Easypanel). Verificado en vivo
2026-08-01; `/alta` agregado y verificado 2026-08-16.

**2026-08-16 — el dominio YA está vivo:** `forms.onia.com.bo` resuelve a
`187.77.16.63` y Traefik emitió el certificado. Las URLs canónicas son
`https://forms.onia.com.bo/cuestionario|/brief|/alta`. El puerto de prueba
`8189` quedó **cerrado por el firewall** (ufw solo permite 80/443) — ya no
sirve para verificar; usar el dominio directo.

**Sigue vivo en Vercel.** `onia-forms.vercel.app` NO se tocó ni se apagó — los
links viejos siguen sirviendo hasta que Sergio apruebe el apagado (ver "Pendiente
de Sergio" abajo).

---

## Fuente

No había repo/git conectado al proyecto Vercel `onia-forms`
(`prj_4PrgbPXsNrio8fCj94fg3a3lTKfR`, team `team_BqCitl3qx1WiekYzomhFbBUP`) — se
deployó en su día con `vercel deploy` directo desde una carpeta suelta (sin
`framework`, sin `buildCommand`, `meta.actor: claude-code_2-1-170_agent`). Se
verificó byte a byte (diff ignorando CRLF) que el HTML servido en
`onia-forms.vercel.app/cuestionario` y `/brief` es idéntico al que ya vive en
este repo:

- `hermes-content/propuestas/cuestionario-cliente.html` → `/cuestionario`
- `hermes-content/propuestas/brief-produccion.html` → `/brief`
- `hermes-content/propuestas/alta-cliente.html` → `/alta` (Formulario de Alta de
  Cliente, 2026-08-16: identidad + datos para el bot + datos para la web +
  operación. Postea a `webhook/alta-cliente` → workflow n8n
  `Alta de Cliente ONIA → CRM + Correo` [`O0NHmyqP6Fyk4f0b`], que inserta el
  alta como lead `Ganado` en `onia_center.leads` vía SSH
  `/opt/onia/lead-insert.mjs` — payload completo en `raw.alta`,
  `source=alta-form` — y manda el resumen por Gmail. A diferencia de sus
  hermanos, este SÍ persiste en base, no solo manda correo.)

Estos dos archivos son la fuente de verdad — a partir de ahora, editar acá y
redeployar (no hay build: son HTML/CSS/JS planos, el form postea directo por
`fetch()` al webhook n8n hardcodeado en el `<script>`).

---

## Estado verificado (2026-08-01)

- Contenedor: `onia-forms`, imagen `nginx:alpine`, sirve estático desde
  `/opt/onia-forms/html` (bind mount `ro`).
- Puerto publicado: `8189:80` (mientras no hay DNS, se prueba por IP+puerto).
- Ruta Traefik agregada (archivo, no labels): `forms.onia.com.bo` → servicio
  `onia-forms-manual` → `http://onia-forms:80/`.
- **DNS de `forms.onia.com.bo` todavía no existe** (dominio a crear por
  Sergio). Por eso Let's Encrypt no puede emitir certificado todavía — esperado,
  no requiere acción; Traefik reintenta solo apenas el DNS apunte a
  `187.77.16.63`.
- Backend sin cambios: el HTML postea a
  `https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/cuestionario-cliente`
  (ya vive en este VPS, workflow n8n existente — no se tocó).

### URL que funciona HOY

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://187.77.16.63:8189/cuestionario   # 200
curl -s -o /dev/null -w "%{http_code}\n" http://187.77.16.63:8189/brief          # 200
```

### URL que va a funcionar cuando Sergio cree el DNS (sin tocar nada más)

```
https://forms.onia.com.bo/cuestionario
https://forms.onia.com.bo/brief
```

Verificable ya mismo con Host header (bypassea DNS, prueba que la ruta Traefik
está bien armada):

```bash
curl -sk -H "Host: forms.onia.com.bo" -o /dev/null -w "%{http_code}\n" https://187.77.16.63/cuestionario
# 200
```

### Verificación de contenido real (título, no placeholder)

```bash
curl -s http://187.77.16.63:8189/cuestionario | grep -o '<title>[^<]*</title>'
# <title>Cuestionario ONIA — Conozcamos tu negocio</title>
curl -s http://187.77.16.63:8189/brief | grep -o '<title>[^<]*</title>'
# <title>Brief de Producción ONIA — Datos para construir tu proyecto</title>
```

### Prueba de integración con el webhook (2026-08-01, payload 100% TEST)

Se envió un POST directo al webhook con **todos los campos marcados `TEST`**
(nombre, empresa, extra, etc. con texto explícito "NO ES UN LEAD REAL" /
"BORRAR / IGNORAR") — no se usó la UI del form para no depender de un browser
headless, se replicó el mismo `fetch()` que hace el HTML:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  -X POST "https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/cuestionario-cliente" \
  -H "Content-Type: application/json" \
  --data '{"nombre":"TEST TEST - NO ES UN LEAD REAL", ...}'
# 200  "ok"
```

Resultado: `HTTP 200`, body `ok`. Confirma que el webhook n8n sigue vivo y
acepta el payload del form nuevo servido desde el VPS. **Si aparece un lead
"TEST TEST - NO ES UN LEAD REAL" / empresa "TEST EMPRESA (verificacion
despliegue VPS onia-forms)" en cualquier lado (n8n, Supabase, WhatsApp,
Chatwoot), es este test — descartar, no es un cliente real.**

---

## Deploy — pasos exactos (para redeploy tras editar el HTML)

No hay build. Es copiar archivos.

```bash
scp -i ~/.ssh/onia_hermes_vps_ed25519 \
  hermes-content/propuestas/cuestionario-cliente.html \
  hermes-content/propuestas/brief-produccion.html \
  hermes-content/propuestas/alta-cliente.html \
  root@187.77.16.63:/opt/onia-forms/html/

ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 "docker exec onia-forms nginx -s reload"
```

⚠️ **Si editás `/opt/onia-forms/nginx/default.conf`: NO alcanza el reload.** Es
un bind mount de archivo único; `sed -i` (y la mayoría de los editores)
reemplazan el inode y el contenedor sigue viendo el archivo viejo. Después de
tocar la config: `docker restart onia-forms` (re-resuelve el path). Pasó el
2026-08-16 al agregar `/alta` — el 404 persistía con la config "correcta".

nginx sirve directo desde el bind mount — no hace falta recrear el
contenedor, ni siquiera el reload es estrictamente necesario para archivos
estáticos (nginx no cachea el contenido en memoria para `try_files`), pero no
está de más.

Si hay que tocar el contenedor (imagen, config, puerto):

```bash
docker rm -f onia-forms
docker run -d --name onia-forms \
  --restart unless-stopped \
  --network easypanel \
  -p 8189:80 \
  -v /opt/onia-forms/html:/usr/share/nginx/html:ro \
  -v /opt/onia-forms/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro \
  nginx:alpine
```

`/opt/onia-forms/nginx/default.conf` mapea las rutas sin extensión
(`/cuestionario` → `cuestionario-cliente.html`, `/brief` →
`brief-produccion.html`, `/alta` → `alta-cliente.html`) vía `try_files`; `/`
sirve un `index.html` de redirect a `/cuestionario` (mismo comportamiento que
tenía en Vercel).

---

## Ruta Traefik — dónde vive y qué se agregó

Archivo (edición por archivo, **NO labels de Docker**):
`/etc/easypanel/traefik/config/onia-manual-routes.yaml`

Se agregó, sin tocar las rutas existentes (`cal.`, `center.`, `app.`,
`/supabase`, `onia.com.bo`/`www.`):

- Routers: `http-forms-onia-com-bo-manual`, `https-forms-onia-com-bo-manual`
- Service: `onia-forms-manual` → `http://onia-forms:80/`

Edición hecha con script Python que parsea el JSON (el archivo es JSON válido
con extensión `.yaml`), no a mano — con backup previo
(`onia-manual-routes.yaml.bak-onia-forms-20260801143620`). Traefik vigila el
archivo y aplica cambios solo (no hizo falta reiniciar el contenedor de
Traefik); se confirmó en `docker logs` del traefik que el router nuevo quedó
activo (`https-forms-onia-com-bo-manual@file` sirviendo 200 desde
`http://onia-forms:80/`) y se re-verificaron `cal.`, `center.`, `app.`,
`onia.com.bo` y `/supabase` con Host header — todas responden igual que antes
(200/307/401 según corresponda, ninguna 502).

---

## Rollback

```bash
docker rm -f onia-forms
```

Para la ruta Traefik: restaurar
`/etc/easypanel/traefik/config/onia-manual-routes.yaml.bak-onia-forms-20260801143620`.

---

## Pendiente de Sergio

- ~~**DNS**: crear `forms.onia.com.bo`~~ **HECHO** (verificado 2026-08-16: el
  dominio resuelve, HTTPS con certificado válido, las 3 rutas responden 200).
- **Apagado de Vercel**: `onia-forms.vercel.app` sigue activo a propósito
  (regla dura: no tocar mientras clientes puedan tener el link viejo en
  manos). Cuando Sergio apruebe migrar los links compartidos a la URL del VPS
  (o al dominio `forms.onia.com.bo` una vez tenga DNS+HTTPS), recién ahí se
  puede evaluar despublicar el proyecto Vercel — no antes, y no sin su OK
  explícito.
- El puerto `8189` es temporal para prueba pre-DNS; se puede dejar o cerrar
  una vez el dominio esté migrado.
