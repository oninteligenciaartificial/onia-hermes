# Publicación — cómo se publica hoy en cada red

> **Fuente sin fecha: se EDITA, no se duplica.** Dice **cómo** se aprieta el botón en cada
> red **hoy**: con qué, quién lo hace y qué falta para automatizarlo.
>
> **Nace de un hueco medido.** Hasta el 2026-09-25 ningún doc vigente decía cómo se publica:
> los dos que describen publicación automática son de junio y describen un sistema que hoy no
> corre (§5), y el mapa de docs del 25-sep lo marcó como hueco
> (`historial/MAPA_DOCS_20260925.md` §3.2). Mientras tanto, el Instagram de Sergio Urcullo
> pasó de 45 publicaciones (31-ago) a 81 (22-sep) y **ningún archivo del repo dice cuáles
> salieron** (`historial/contenido/ESTADO_OPERATIVO_CONTENIDO_20260925.md` §3; el 81 sale de
> una auditoría que vive en una rama sin integrar).
>
> ⛔ **No manda sobre:** dónde va cada pieza (`ONIA_DONDE_VA_CADA_COSA.md`) · cuántas por día y
> de quién (`ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md`) · qué publica `@oniahq` y la pauta
> (`contenido/MARCA_ONIA.md`) · el circuito comentario→DM (`ONIA_CIRCUITO_COMENTARIO_DM.md` y
> `ONIA_IG_COMENTARIO_A_DM.md`). Los cita; no los repite.
>
> **Rutas:** las que empiezan con `hermes-content/`, `scripts/`, `videos/` o `web-factory/` son
> desde la raíz del repo, igual que `CLAUDE.md` y el `README.md` marcado «raíz»; el resto
> cuelga de `hermes-content/docs/`. Cada dato lleva fecha y fuente; **lo marcado «no
> verificado» no se miró el 25-sep.** Métricas: ninguna nueva; las que aparecen son las
> medidas, con su fecha.

---

## 0. La respuesta corta

**Hoy todo se publica a mano.** Ninguna red tiene publicación automática funcionando y
verificada:

- **Postiz**, el publicador del VPS: último estado registrado, **caído (502) el 18-sep**. Hoy
  no verificado.
- **TikTok:** **0 cuentas conectadas** al publicador de TikTok de Higgsfield (consultado el
  25-sep) y ninguna credencial de la API de TikTok.
- **YouTube:** Sergio Urcullo **arrastra el archivo** en YouTube Studio; no hay credenciales
  de la YouTube Data API.
- **LinkedIn:** sólo textos para copiar; **ninguna publicación registrada**.
- **«Comentá X»** en la cuenta de Sergio Urcullo **no dispara nada** (`palabras: {}`): se
  contesta a mano (§2).

Fuente de las cinco: estado operativo del 25-sep, §3 (varias de sus pruebas viven en ramas sin
integrar: están citadas ahí).

### Por qué a mano — la regla con su caso

El **2026-08-24** Instagram le avisó a la cuenta de Sergio Urcullo *«We suspect automated
behavior on your account»* (`ONIA_AVISO_AUTOMATIZACION_IG.md:3-5`). Había **tres partes**
operándola a la vez: Postiz, la app de Meta suscrita a sus comentarios y el equipo de Samuel
publicando 8 videos en una semana (`:18-27`, `:31-33`). De ahí salieron tres reglas que siguen
vigentes (`:55-63`):

1. **Una sola herramienta de publicación conectada por cuenta.** No dos.
2. **La cadencia se sube gradual**, no se arranca en el objetivo.
3. **Parte del volumen se publica a mano**, sobre todo al principio.

El plan era «a mano las próximas dos semanas» (`:42-43`). Un mes después seguía igual: *«La
publicación queda manual; no se activó publicación automática»*
(`cola/PARA-PUBLICAR-CARRUSELES-2026-09-21.md:7`, 21-sep).

---

## 1. Red por red

| Red · cuenta | Handle | Cómo se publica hoy | Quién | Qué falta para automatizar |
|---|---|---|---|---|
| **Instagram** · marca personal | `@sergiourcullo` | **a mano, desde el teléfono** | Sergio Urcullo; Samuel, lo suyo, según el acuerdo | Postiz vivo, una sola herramienta en la cuenta y la decisión de Sergio Urcullo |
| **Instagram** · empresa | `@oniahq` | **no publica desde agosto** | — | Postiz vivo o el token de `ig-publish` (no verificado) |
| **TikTok** | **sin resolver:** `@sergiourcullom` vs `@sergiourcullo` | **a mano** | Sergio Urcullo; Samuel según el acuerdo | resolver el handle; app, OAuth y revisión de TikTok; 0 cuentas en el publicador de Higgsfield |
| **YouTube** | `@sergiourcullo` | **a mano:** se arrastra el archivo | Sergio Urcullo | OAuth y refresh token de la YouTube Data API (nunca cargados) |
| **LinkedIn** | `linkedin.com/in/sergiourcullo` | **textos para copiar; ninguna publicación registrada** | Sergio Urcullo | conectarlo a Postiz (⬜ desde el 30-ago) o credenciales de `social-publish` |
| **Comunidad de WhatsApp** | Onia Community: canal Announcements + grupo General | **a mano: Sergio Urcullo pega el drop** | Sergio Urcullo | nada del lado de WhatsApp: falta **registrar** lo enviado y escribir drops (no hay desde el 20-sep) |

### Instagram · `@sergiourcullo` (marca personal)

- **Handle:** renombrada desde `@sergio_urcullo`; lo confirmó Sergio Urcullo el 06-sep
  (`hermes-content/references/ui-patterns/apple-editorial/FICHA.md:119-123`). Varios docs
  viejos siguen con el handle anterior (mapa de docs 25-sep, C4).
- **Cómo:** a mano, desde el teléfono (`ONIA_AVISO_AUTOMATIZACION_IG.md:49-51`).
- **Quién:** Sergio Urcullo. Según el acuerdo Etapa 2, Samuel sube pilares y B-roll a
  Instagram, TikTok, Facebook y YouTube Shorts **con acceso por rol**
  (`ONIA_MARCA_PERSONAL_ETAPA2_ACUERDO.md:20-21`, `:42-43`). La firma de ese acuerdo no está
  registrada (estado operativo §4).
- **Qué existe para automatizar, y en qué estado:** un circuito `ok <id>` por Telegram →
  `scripts/kanban/publicar-aprobado.mjs` → Postiz, con `sergio` en la lista blanca de cuentas
  (`scripts/kanban/publicar-aprobado.mjs:50-54`), **corrido sólo en seco** el 05-sep
  (`cola/marca-personal.md:87`, `:90`). En `main`, `scripts/postiz_schedule.mjs` no tiene una
  guarda que impida publicar en la cuenta personal (estado operativo §9, C10).
- **Qué falta:** Postiz vivo y verificado; que sea **la única** herramienta conectada a la
  cuenta —si Samuel publica con otra, es ésa— (`ONIA_AVISO_AUTOMATIZACION_IG.md:60`, `:68`); y
  la decisión de Sergio Urcullo de volver a publicar por API en una cuenta ya advertida.

### Instagram · `@oniahq` (empresa)

- **Estado:** no publica desde agosto; el detalle vive en `contenido/MARCA_ONIA.md` §7.
- **Vías que existieron:** Postiz con `instagram-standalone`
  (`hermes-content/contenido/ONIAHQ.md:226`) e `ig-publish` en el VPS (§5).
- **Qué falta:** Postiz vivo, o el token de `ig-publish`, que figura vencido desde el 17-ago
  según una medición del 04-sep que vive en una rama sin integrar (estado operativo §3).
  **No verificado.**

### TikTok

- **Handle sin resolver:** `@sergiourcullom` (574 seguidores el 21-ago,
  `ONIA_CUENTAS_Y_MODELOS_SEPARACION_20260821.md:58`) contra `@sergiourcullo`, que es el que
  enlaza la web (`hermes-content/sitio-sergiourcullo/index.html:228`). Nada posterior mide
  ninguno de los dos.
- **Cómo:** a mano. El lote de 4 TikToks del 17-sep dice *«falta solo ponerles música antes de
  subir»* (`videos/tiktok-20260917/PUBLICAR.md:3`); que se hayan publicado **no consta**.
- **Qué falta:** resolver el handle primero. Después, **0 cuentas** conectadas en el publicador
  de TikTok de Higgsfield (25-sep) y la API oficial pide app de desarrollador, OAuth, permiso de
  publicación y revisión de la app (`CROSS_PLATFORM_PUBLISHING.md:37-44`): nada de eso se cargó.
- **Sin comentario→DM en TikTok:** el único embudo es el link de la bio
  (`ONIA_MARCA_PERSONAL_ETAPA2_OPERACION.md:88-89`).

### YouTube

- **Handle:** `@sergiourcullo`, *«mismo handle que Instagram, X y LinkedIn»*
  (`SERIE_CLAUDE_CODE_DESCRIPCIONES.md:3`).
- **Cómo:** a mano. Sergio Urcullo arrastra el archivo en YouTube Studio; la subida desde las
  sesiones corta a 10 MB (estado operativo §3).
- **Qué falta:** proyecto de Google Cloud, OAuth del canal y refresh token de la YouTube Data
  API (`CROSS_PLATFORM_PUBLISHING.md:74-82`), nunca cargados. Ojo: un proyecto sin verificar
  sube los videos **como privados** (`:81-82`).

### LinkedIn

- **Perfil:** `linkedin.com/in/sergiourcullo`, público y completo desde el 30-ago
  (`ONIA_MARCA_PERSONAL_ETAPA2_OPERACION.md:80`).
- **Cómo:** sólo textos para copiar —los bloques «LinkedIn» de los paquetes
  `cola/PARA-PUBLICAR-*`—. **Ninguna publicación registrada.**
- **Quién:** el acuerdo dice que LinkedIn y X los publica *«la máquina Onia vía Postiz»*
  (`ONIA_MARCA_PERSONAL_ETAPA2_ACUERDO.md:22-25`). **Nunca se conectó**: la tarea sigue ⬜
  desde el 30-ago (`ONIA_MARCA_PERSONAL_ETAPA2_OPERACION.md:23`). Hoy, si sale, sale a mano.
- **Qué falta:** conectarlo a Postiz, o credenciales de `social-publish`
  (`CROSS_PLATFORM_PUBLISHING.md:102-113`).

### Comunidad de WhatsApp — Onia Community

- **Estructura:** canal **Announcements** (sólo publica Sergio Urcullo) + grupo **General**
  (`comunidad/ESTADO_COMUNIDAD.md:15-17`). El link de invitación **no se escribe en un doc**: es
  una credencial, cualquiera que lo tenga entra (`ONIA_CIRCUITO_COMENTARIO_DM.md:313-316`).
- **Cómo:** a mano. Un cron del VPS (18:45 La Paz) le manda a Sergio Urcullo por Telegram el
  drop del día, `cola/drops/<hoy>.md`, o un aviso de que no hay
  (`scripts/loops/extras/onia-drop-recordatorio.sh:1-22`). **No verificado** si sigue vivo: si
  lo está, desde el 20-sep avisa todos los días que no hay drop (estado operativo §1.2).
- **Quién — contradicción anotada:** en Announcements publica sólo Sergio Urcullo
  (`ESTADO_COMUNIDAD.md:16`), pero el acuerdo le pide a Samuel subir a diario a la comunidad lo
  prometido en cada video (`ONIA_MARCA_PERSONAL_ETAPA2_ACUERDO.md:46`).
- **Qué falta:** registro. `ESTADO_COMUNIDAD.md` se declara el lugar de *«qué se publicó cada
  día»* (`:3-4`) y su §3 **no tiene ni un envío marcado** (`:112-128`). La última pieza con
  evidencia de envío es el carrusel «Mi stack», el 10-sep (estado operativo §1.2).

### Fuera de las seis

- **X** (`@sergiourcullo`): textos a mano; banner pendiente
  (`ONIA_MARCA_PERSONAL_ETAPA2_OPERACION.md:81`).
- **Facebook:** no se puede por Postiz —Postiz arma el OAuth clásico y la app de Meta usa
  Login for Business— → cross-post nativo desde Instagram
  (`handoff/claude-ads-creatividades-publicos.md:184-187`).

---

## 2. Las palabras clave: «comentá X»

| Cuenta | Palabras activas | Qué pasa si alguien comenta | Fuente |
|---|---|---|---|
| `@sergiourcullo` | **ninguna** (`palabras: {}`), a propósito | **Nada automático:** no llega DM, y —medido el 27-ago— tampoco un aviso, porque la alerta sólo salta para cuentas sin mapear. **Se contesta a mano** | `ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md:105-106`; `cola/marca-personal.md:91` (sqlite de n8n, 05-sep); `ONIA_IG_COMENTARIO_A_DM.md:144-149`; `ONIA_CIRCUITO_COMENTARIO_DM.md:225-232` |
| `@oniahq` | `SISTEMA`, `LISTA` | DM automático con el recurso; primera entrega a un tercero verificada el 28-ago | `ONIA_IG_COMENTARIO_A_DM.md:146`; `ONIA_CIRCUITO_COMENTARIO_DM.md:14-17` |
| Por video (capa `VIDEOS`) | **ninguna cargada**: la capa existe desde el 08-sep | — | `ONIA_IG_COMENTARIO_A_DM.md:88-99`, `:149` |
| TikTok · YouTube · LinkedIn · X | no hay comentario→DM | el embudo es el link de la bio | `ONIA_MARCA_PERSONAL_ETAPA2_OPERACION.md:88-89` |

**No re-verificado el 25-sep:** el mapa de palabras vive en el workflow activo de n8n.

**Los casos que lo hacen regla, no teoría:**
- **26-ago:** una persona real comentó «Ranking» en un post de Sergio Urcullo. No recibió nada y
  nadie se enteró (`ONIA_CIRCUITO_COMENTARIO_DM.md:225-232`).
- **07-sep:** otra persona comentó `Video` en un reel. El sistema lo recibió, lo entendió y no le
  mandó nada — `motivo: sin_palabra_clave`, con la ejecución en `success`
  (`ONIA_IG_COMENTARIO_A_DM.md:97-99`).
- **Desde el 17-sep** se usaron o guionaron 8+ palabras (SKILL, COMUNIDAD, VIDEO, AUTOMATIZAR,
  SUBAGENTE, MAPA, ARQUITECTURA, MCP…) y el registro de promesas tiene **2 filas** (estado
  operativo §9, C11).

**Lo que se hace mientras tanto** (reglas que ya existen; acá sólo se juntan):
1. **Primero existe el recurso, después la promesa** (`ONIA_CIRCUITO_DE_CONTENIDO.md:49-50`).
   Un video con promesa no se publica hasta que el recurso está en la web y el link funciona
   (`ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md:86-87`).
2. **Cada promesa entra al registro antes de publicarse: sin fila, no sale**
   (`ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md:91-92`).
3. **Se contesta a mano, con el link y no con el contenido**; el molde está en
   `cola/PARA-PUBLICAR-DM-STACK.md` (`ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md:108-111`).
4. **Para cablear una palabra**: los tres datos por video y el checklist de
   `ONIA_IG_COMENTARIO_A_DM.md:101-127` —recurso que responde 200, firma del webhook validada y
   prueba con un comentario real **mirando el DM en la bandeja**—. Es tocar n8n (infra: un
   dueño a la vez) y lo decide Sergio Urcullo.

### Qué palabra lleva a qué guía

> **Regla de Sergio Urcullo, 25-sep:** *«si hablás de n8n: comentá N8N y te enseño cómo
> instalarlo… eso iría a la Bóveda»*. Cada pieza que enseña una herramienta cierra con «Comentá
> PALABRA y te <acción concreta>», y la palabra lleva a una guía de su sitio
> (`sergiourcullo.vercel.app`).

**Sólo se usa una palabra cuya guía responde 200 el día de publicar**, y sigue valiendo lo de
arriba: una palabra activa por vez, con su fila en el registro, contestada a mano con el link.
Estado medido el 25-sep con el conector de Vercel (20:48 y 21:20 UTC); el último deploy de
producción del sitio es del 19-sep.

| Palabra | Guía | Estado | Qué recibe quien comenta |
|---|---|---|---|
| `N8N` | `/stack`, paso 03 | ✅ 200 | cómo instalar n8n con un comando, con la hora de Bolivia |
| `STACK` | `/stack` | ✅ 200 | las seis herramientas, qué NO hace cada una y cómo instalarlas |
| `HOMELAB` | `/homelab` | ✅ 200 | cómo armar un servidor en casa |
| `VPS` | `/vps` | ✅ 200 | qué es, cuánto cuesta el suyo, cuándo conviene contra el de casa y los cinco pasos para armarlo |
| `CLAUDE` | `/claude-code` | ✅ 200 | la serie en video «Claude Code, de cero»: qué es y cómo se instala |
| `MAPA` | `/automatizar` | ⛔ 404: la Bóveda no está publicada | la matriz para elegir qué automatizar |
| `ARQUITECTURA` | `/agentes` | ⛔ 404: la Bóveda no está publicada | cuándo alcanza un `IF`, un modelo que clasifica, un AI Agent o un loop |
| `MCP` | `/mcp` | ⛔ 404: la Bóveda no está publicada | contrato de herramienta y permisos mínimos |
| `SANTA CRUZ` | sin guía: se contesta con la agenda del IA Lab | manual | la fecha y el formulario del laboratorio |

Cuando se publique la Bóveda, las tres ⛔ se vuelven a medir antes de usarlas.

---

## 3. Checklist de publicación manual

Antes de apretar «Publicar», en cualquier red:

- [ ] **Se miró la pieza entera**, renderizada y en el formato del destino. Un archivo que
      existe no es una pieza que se ve bien (`CLAUDE.md` §2, «Verificar es MIRAR»).
- [ ] **Subtítulos** quemados y leídos palabra por palabra (el pipeline de video tiene un gate
      de ortografía antes de quemar: `videos/tiktok-20260917/README.md`, paso 4).
- [ ] **Portada** elegida a propósito y legible en la grilla, no el cuadro que tocó.
- [ ] **Música**, si lleva, puesta en la app: por API no se puede en las cuentas
      `instagram-standalone` ni en carruseles (`handoff/claude-ads-creatividades-publicos.md:188-190`).
- [ ] **Caption pegado tal cual** del paquete de la pieza, con **un solo CTA**.
- [ ] **CTA con recurso YA publicado:** si pide «comentá PALABRA», el recurso responde 200, abre
      en el teléfono y tiene su fila en el registro de promesas (§2). Si falla uno, se saca el
      CTA. La palabra se contesta a mano.
- [ ] **Nada privado en pantalla:** tokens, contraseñas, datos de clientes o pacientes
      (`cola/PARA-PUBLICAR-CARRUSELES-2026-09-21.md:35`).
- [ ] **Cuenta correcta**, con la única herramienta conectada a esa cuenta (§0).
- [ ] **Registrar la URL publicada, el mismo día.** En el paquete de la pieza (su
      `cola/PARA-PUBLICAR-*.md` o el `PUBLICAR.md` de su carpeta), debajo de su checklist:
      `Publicado: <URL> · <fecha> · <cuenta>`. Los drops, con `[x]` en
      `comunidad/ESTADO_COMUNIDAD.md` §3. **Sin este paso pasó lo del 31-ago al 22-sep:** ~36
      publicaciones que ningún archivo registra (estado operativo §3).

---

## 4. Postiz: qué es y qué no

- **Qué es:** un programador de publicaciones, self-hosted en el VPS (`postiz.onia.com.bo`).
  Publica hacia afuera y puede comentar en el post propio. **No lee ni responde comentarios ni
  manda DMs, en ninguna red** — verificado leyendo su código
  (`ONIA_POSTIZ_COMENTARIOS_DM_20260817.md:33-45`); esa parte del doc sigue vigente (`:19`).
- **Historial de caídas:** 22 y 24-ago; backend muerto ~3 semanas hasta el 04-sep; «caído
  (502)» el 18-sep; interfaz no auditable el 21-sep (estado operativo §3, con sus fuentes).
  **Estado hoy: no verificado.**
- **Scripts que lo usan:** `scripts/postiz_schedule.mjs` (programa, publica ya o deja
  borrador) y `scripts/kanban/publicar-aprobado.mjs` (el circuito `ok <id>`).
- ⚠️ **Antes de reconectar nada:** rotar el token de Postiz que quedó pegado en un chat,
  pendiente desde el 23-ago (estado operativo §12, ítem 15). Depende de Sergio Urcullo.

---

## 5. Docs que describen publicación automática que HOY no corre

No se tocaron en el commit que creó este archivo (no edita archivos existentes). **Si uno de
éstos dice otra cosa sobre cómo se publica hoy, gana éste.**

| Doc | Qué dice | Qué pasa hoy |
|---|---|---|
| `ONIA_INSTAGRAM_PUBLISHING.md` (contenido de junio; último commit 30-jul según el mapa de docs) | `ig-publish` en el VPS, validado con un carrusel real, sólo para `@oniahq` (`:9-13`, `:27`) | `@oniahq` no publica desde agosto; el token de esa vía figura vencido desde el 17-ago (medición del 04-sep, rama sin integrar). **No re-verificado** |
| `CROSS_PLATFORM_PUBLISHING.md` (ídem) | Instagram *«connected and validated»* vía Video Lab → `ig-publish` (`:10-18`); TikTok, YouTube y LinkedIn *«credentials pending»* (`:35`, `:72`, `:102`) | Video Lab es de la era Hermes (obsoleto, mapa de docs §3.4); nada indica que las credenciales se hayan cargado; todo sale a mano |
| `hermes-content/skills/descripciones-sociales-onia.md` (skill-doc del bot Hermes) | publicar con `ig-publish reel_publish` (`:12-15`), con `CROSS_PLATFORM_PUBLISHING.md` como fuente (`:123`) | **Riesgo:** quien siga esa skill cree que Instagram publica solo |
| `hermes-content/carousels/CAROUSEL_SYSTEM.md` | el motor «publica vía `ig-publish` en el VPS» (`:5`, `:166`) | el motor renderiza; publicar es a mano |
| `README.md` (raíz del repo) | «Hermes VPS Tools for Onia»: la capa de publicación es `ig-publish` (`:1`, `:22`) | describe el repo de junio |
| `hermes-content/contenido/ONIAHQ.md` §4 | 7 carruseles de `@oniahq` programados en Postiz el 17-ago | cuántos salieron no consta (`contenido/MARCA_ONIA.md` §7) |
| `ONIA_RECORRIDO_24_7_20260820.md` | la ruta de publicación al 20-ago | foto de un día (mapa de docs: HISTORIA) |

**Pendiente:** poner en cada uno un aviso que apunte acá. `CROSS_PLATFORM_PUBLISHING.md` lo lee
un skill-doc del bot Hermes: no se mueve sin coordinar (mapa de docs §3.1 y §4.5).

---

## 6. ¿Vale la pena automatizar ahora?

**Para la Etapa 1, no es la prioridad.** La etapa vigente vende a clínicas
(`ONIA_ESTRATEGIA_DE_EMPRESA.md:218-224`) y la marca personal le habla a otra audiencia
(`SERIE_CLAUDE_CODE.md:16-18`; `contenido/MARCA_ONIA.md` §1). Automatizar su publicación **se
anota y no se prioriza**. Lo que sí es barato y sirve a cualquier cuenta: registrar las URLs
(§3) y no prometer una palabra sin recurso (§2).

---

## 7. Qué depende de Sergio Urcullo

| # | Qué | Fuente |
|---|---|---|
| 1 | **Resolver el handle de TikTok**: `@sergiourcullom` o `@sergiourcullo` | §1 |
| 2 | Decidir si su cuenta vuelve a publicar por API (Postiz) o sigue a mano, con el aviso del 24-ago delante | `ONIA_AVISO_AUTOMATIZACION_IG.md:40-63` |
| 3 | Confirmar con qué publica Samuel, y que sea la única herramienta conectada | `ONIA_AVISO_AUTOMATIZACION_IG.md:68` |
| 4 | **Rotar el token de Postiz** pegado en un chat (desde el 23-ago) | estado operativo §12.15 |
| 5 | Cablear las palabras de su cuenta en n8n, o seguir contestando a mano | estado operativo §12.16 |
| 6 | Qué es «Trial» (`ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md:14-15`): la función Trial Reels de Instagram —que pide ≥1.000 seguidores (`ONIA_AUDITORIA_LUCIA_Y_PLAN_DIARIO.md:92`) y la cuenta tenía 503 el 22-sep— o una «cuenta trial» aparte (`cola/GUIONES-TANDA-2-18-SEP.md:6-7`). No está definido en ningún doc | estado operativo §4 |
| 7 | Confirmar qué drops se enviaron del 13 al 19-sep y cuántos miembros tiene la comunidad: el dato no está en el repo | estado operativo §1.6, §12.4 |

---

## 8. Cómo se re-verifica

- **Postiz:** `docker ps -a | grep postiz` en el VPS (infra: un dueño a la vez) y abrir la
  interfaz. Un 200 del dominio no prueba la API: la API está bajo `/api`
  (`hermes-content/contenido/ONIAHQ.md:175-177`).
- **TikTok:** `tiktok_accounts` del conector de Higgsfield.
- **Palabras clave:** nodo `Parsear comentario` del workflow activo de comentario→DM
  (`ONIA_IG_COMENTARIO_A_DM.md:107-117`).
- **El cron del drop:** `crontab -l` en el VPS y su log, `/var/log/onia-drop-recordatorio.log`.
- **Lo publicado:** abrir cada perfil y **mirarlo**; comparar contra las líneas `Publicado:` de
  los paquetes (§3).
