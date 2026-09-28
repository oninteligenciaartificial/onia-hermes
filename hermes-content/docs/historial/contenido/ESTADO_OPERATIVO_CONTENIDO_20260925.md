> 🔴 **Foto del 2026-09-25, NO es fuente de verdad; las fuentes vivas son
> `contenido/PUBLICACION.md` (cómo se publica hoy en cada red), `contenido/MARCA_ONIA.md`
> (@oniahq y la pauta de ONIA) y el índice `ONIA_CIRCUITO_DE_CONTENIDO.md`** (rutas bajo
> `hermes-content/docs/`). No se edita más: si algo de acá cambia, se cambia en la fuente viva.
>
> **Qué es.** El informe «A2» que un subagente de la sesión CONTENIDO midió el 2026-09-25,
> en sólo lectura, con piso `origin/main` = `ea6e6677`. Se archiva **tal cual**. Cita
> ramas sin integrar (marcadas «rama» o «(rama X)»): lo que vive en una rama **no está en
> `main` y no manda** hasta que se integre.
>
> **Lo único que se tocó al archivarlo:** (1) se quitaron las rutas del scratchpad de la
> sesión, que no existe fuera de ella; (2) el link de invitación de la comunidad quedó
> `[redactado]`: un link de invitación es una credencial —cualquiera que lo tenga entra—
> (`ONIA_CIRCUITO_COMENTARIO_DM.md:313-316`); (3) el ID interno de un proyecto de Vercel
> quedó `[redactado]`; (4) los montos de precio de ONIA se reemplazaron por
> `[monto omitido]` (CLAUDE.md §2: se leen de `subscription-plans.ts` / `pricing.ts`). El
> informe no contenía ningún token ni contraseña: menciona que un token de Postiz quedó
> pegado en un chat, pero no lo copia.

# A2 · Estado operativo REAL del carril contenido

Medido el **2026-09-25** entre ~14:05 y ~15:10 UTC. Solo lectura sobre el repo.

- **Piso de la medición:** `origin/main` = `ea6e6677` (2026-09-25 13:48 UTC). Re-chequeado al
  cerrar: **0 commits nuevos** en `origin/main` (nada se movió mientras medía).
- **Cómo se leyó:** el checkout local es un clon superficial (arranca el 2026-09-11), así que
  la historia se leyó en un **clon blobless completo, fuera del repo** (4.993
  commits de `main` + las ramas del carril). Ramas leídas con `git show` / `git diff`.
- **Conectores usados, sólo lectura:** Vercel (proyecto `sergiourcullo`), Google Calendar
  (cuenta conectada), Notion (Biblioteca), Meta Ads (listar cuentas), Higgsfield
  (`tiktok_accounts`). No se escribió, publicó ni gastó nada.
- **Lo que NO se pudo medir** (y por qué) está en §13. Lo más importante: la política de red
  de esta sesión **deniega** `sergiourcullo.vercel.app`, `cal.com`, `youtube.com` y
  `rdap.verisign.com` (proxy 403; no se reintentó ni se rodeó). Nada se "miró renderizado".

Convención: `archivo:línea` es de `main` salvo que diga **(rama X)**. Las fechas de los
números van al lado de cada número. Un dato heredado se marca como tal.

---

## 0 · Lo esencial

1. **La comunidad existe y está muda desde el 20-sep.** Onia Community (WhatsApp, canal
   Announcements + grupo General) arrancó el 02-sep. Hay drops escritos del 02 al 19-sep; la
   **única evidencia de envío** son dos líneas escritas por sesiones el 10/11-sep (D0-D6
   "cumplida" y el carrusel «Mi stack» "ya enviado el 10-sep"). Del 13 al 19-sep no hay
   ninguna evidencia de que se hayan pegado. Desde el 20-sep **no existe ni un archivo de
   drop**. **Cantidad de miembros: no hay ningún dato en el repo.**
2. **La "Bóveda" no es Obsidian**: es una página web nueva (`/boveda`) del sitio personal, en
   la rama `codex/sergio-vault-growth`, **sin mergear y sin desplegar** (el último deploy del
   sitio es del 19-sep).
3. **El piloto presencial "IA Lab Santa Cruz"** (encuentros semanales, 4 pilotos → taller/curso
   pago → membresía) vive sólo en `codex/marca-comunidad-plan`, sin mergear. Es una **línea de
   negocio nueva** según las reglas de la casa.
4. **Llamadas 1 a 1:** Cal.com cloud (`cal.com/sergiourcullo`): `/20min` público (la web
   enlaza `/llamada`) y `/15min` oculto, exclusivo de la comunidad. **No hay proceso en `main`**
   (ni preparación, ni notas, ni seguimiento, ni grabación). **No hay evidencia de ninguna
   llamada hecha**; sólo un indicio de una agendada para el miércoles 23-sep.
5. **Publicación hoy = a mano.** Instagram de Sergio Urcullo desde el teléfono; TikTok y
   YouTube subidos a mano (sin credenciales de API; 0 cuentas de TikTok en el publicador de
   Higgsfield); Postiz existe pero se cayó varias veces (502 el 18-sep, lo último registrado);
   LinkedIn sólo tiene textos para copiar, **ninguna evidencia de un post**.
6. **Samuel Aguilera** es el productor externo de la marca personal (pilar diario + "yap").
   Acuerdo Etapa 2 **aceptado el 31-ago, sin firma registrada**, pero operando desde ~11-sep.
7. **Métricas (IG de Sergio Urcullo, 22-sep, rama sin mergear):** 81 publicaciones, 503
   seguidores; 30 días: 101.934 visualizaciones, 76 % no seguidores, 45 clics externos. El 31-ago
   eran 45 publicaciones y 427 seguidores.
8. **`sergiourcullo.com`: no hay evidencia de compra y NO está conectado** al proyecto de Vercel
   (sólo `sergiourcullo.vercel.app`, medido hoy).
9. **B2B (la etapa vigente): nada publicado.** La campaña Meta "ONIA Platform Dental" (21-sep)
   tiene creatividades listas y **no publicadas**; la cuenta ONIA Ads tiene 4 bloqueos (sin
   medio de pago, página sin vincular, campaña 1 archivada con 0 anuncios, píxel no
   instalado — medido el 17-sep, no re-medible desde acá). @oniahq no publica desde agosto.
10. **Desde el 21-sep el carril trabaja en Codex y nada de eso llegó a `main`**: 3 ramas codex
    + 24 commits de `claude/marca-personal-carruseles-dist-deadab` + la cola declarada del
    carril (`cola/contenido.md`) viven fuera de `main`. `main` no refleja las decisiones
    vigentes del carril (audiencia nueva, 10-13 piezas/día, Bóveda, piloto presencial).

---

## 1 · Comunidad

### 1.1 Qué existe (en `main`)

| Pieza | Estado | Evidencia |
|---|---|---|
| WhatsApp **Onia Community**: canal **Announcements** (sólo publica Sergio Urcullo) + grupo **General** | existe desde el 02-sep | `comunidad/ESTADO_COMUNIDAD.md:15-17`; commit `f10502ce` (07-sep): "arrancada el 02-sep … cinco días de funcionamiento" |
| Link de invitación | `chat.whatsapp.com/[redactado]` (un link de invitación es una credencial) | `ONIA_COMUNIDAD_CONTENIDO.md:3`; `ONIA_MARCA_PERSONAL_ETAPA2_ACUERDO.md:31` |
| `ESTADO_COMUNIDAD.md` — se declara "fuente de verdad … qué se publicó cada día" (`:3-4`) | **no registra ningún envío**: su §3 sólo tiene el 02-sep "(planificado)" con las casillas sin marcar | `ESTADO_COMUNIDAD.md:117-128`; último commit `d80b48d7` 11-sep |
| `ONIA_COMUNIDAD_CONTENIDO.md` — plan, calendario, drops genéricos | vigente en `main` (11-sep) | último commit `4fe06eb9` |
| `ONIA_COMUNIDAD_BIBLIOTECA.md` + página Notion "Onia Community · Biblioteca" | **congelada el 01-sep**: la página de Notion se editó por última vez el **2026-09-01 21:25 UTC** (leída hoy por el conector), tiene los 7 drops del plan original y dice "Se agrega un drop nuevo cada día" — falso desde hace 24 días. No se pudo saber si está publicada en la web | Notion `3ce2eb20…`; `ONIA_COMUNIDAD_BIBLIOTECA.md:70` |
| `ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md` — por qué vale + **registro de videos con promesa** | el registro tiene **2 filas** (HOMELAB, STACK) | `:94-97` (ver §9, contradicción C11) |
| Archivos exclusivos | `/stack/archivos` (5 archivos) y `/homelab/archivos` (3), `noindex`, link sólo en Announcements | `sitio-sergiourcullo/stack/archivos/index.html`, `homelab/archivos/index.html`, `vercel.json:5-24` |

### 1.2 Drops: qué se escribió y qué hay de evidencia de envío

| Fecha | Drop | Escrito | Evidencia de envío |
|---|---|---|---|
| mié 02 | D0 bienvenida + cursos | `cola/PARA-PUBLICAR-2026-09-02.md:5-21` (01-sep) | **indirecta**: `ONIA_COMUNIDAD_CONTENIDO.md:36` "✅ serie D0-D6 completa … cumplida" (línea escrita el 10-sep, `b0a7e66d`). Contradice `cola/marca-personal.md:88` (05-sep): "D0 … ⬜ SERGIO pega" |
| jue 03 | D1 Claude Code | `cola/drops/2026-09-03.md` (`88907ac0`, 02-sep) | misma línea `:36` |
| vie 04 | D2 5 prompts | `2026-09-04.md` (03-sep, `cola/marca-personal.md:61`) | ídem |
| sáb 05 | D3 primera automatización | `2026-09-05.md` (04-sep, `cola/marca-personal.md:67`) | ídem |
| dom 06 | D4 habilidades — **escrito con un día de atraso** | `2026-09-06.md` (`f10502ce`, 07-sep) | ídem |
| lun 07 | D5 fotos con Higgsfield — **con el hueco `[TU EJEMPLO]` sin llenar** | `2026-09-07.md:26,67-70` | ídem; no se sabe si salió con el hueco |
| mar 08 | D6 "contame tu negocio" — cierra la serie | `2026-09-08.md` | ídem |
| jue 10 | Carrusel «Mi stack» (5 láminas) a Announcements | ZIP `2-COMUNIDAD-MI-STACK` | `ONIA_COMUNIDAD_CONTENIDO.md:38` "YA ENVIADO por Sergio Urcullo el 10-sep" (`900e91fb`, 11-sep). **Es la última pieza con evidencia de envío** |
| dom 13 | Beneficio: 15 min 1 a 1 (`cal.com/sergiourcullo/15min`) | `2026-09-13.md` (`4fe06eb9`, 11-sep) | **ninguna** |
| lun 14 → sáb 19 | Semana 1 del motor, «Mi stack», 6 drops con su archivo | `2026-09-14.md` … `2026-09-19.md` (`bec51b7b`, 10-sep) | **ninguna** (sin ✅, `ESTADO_COMUNIDAD` y Biblioteca sin tocar) |
| dom 20 | Cierre: los archivos juntos | **no se escribió** (plan en `ONIA_COMUNIDAD_CONTENIDO.md:41`) | — |
| dom 21 | "Drop de comunidad del día" (plantilla Entrada/Herramienta/Decisión/Salida/Excepción) | dentro de `cola/GUIONES-DIA-2026-09-21.md:344-364`, **no** en `cola/drops/` | ninguna |
| 22 → 28 | "Activación inmediata" (7 drops como filas de tabla, sin texto) | **(rama `codex/marca-comunidad-plan`)** `ONIA_COMUNIDAD_CONTENIDO.md:112-127` | — |

**Último drop con evidencia de envío:** el carrusel «Mi stack» (10-sep). **Último drop escrito
en la carpeta de drops:** `2026-09-19.md` (S1·D6, Hermes / `SOUL.md`).

**Cómo llega un drop a la comunidad:** a mano. El cron del VPS `onia-drop-recordatorio.sh`
(`45 22 * * *` UTC = 18:45 La Paz) manda por Telegram a Sergio Urcullo el archivo
`cola/drops/<hoy>.md`; si no existe, manda "⚠️ No hay drop escrito para hoy … El loop
marca-personal no lo dejó" (`scripts/loops/extras/onia-drop-recordatorio.sh:1-22`;
`cola/loops.md:778`). **Riesgo no verificado:** si ese cron sigue vivo, desde el 20-sep le llega
todos los días un aviso de "no hay drop", que encima culpa a un loop pausado desde el 04-sep
(`cola/loops.md:491`). No pude mirar el `crontab` del VPS.

**Defectos dentro de drops que pudieron haber salido:**
- D1, D2 y D3 terminan con "Comenta COMUNIDAD y te paso el enlace para unirte"
  (`2026-09-03.md:17`, `2026-09-04.md:33`, `2026-09-05.md:44`) — un CTA para **entrar** a la
  comunidad, enviado **dentro** de la comunidad.
- D5 lleva `[TU EJEMPLO]` (`2026-09-07.md:26`).
- El D6 de la semana 1 promete "el link de los seis archivos en un solo lugar"
  (`2026-09-19.md:54-55`), pero `/stack/archivos` tiene 5 y el sexto (`primer-arranque.sh`) vive
  en `/homelab/archivos`.

### 1.3 Qué hay en cola para la comunidad

- **Nada en `cola/drops/`** después del 19-sep.
- **Reserva escrita** en `main`: 7 drops "qué automatizar primero" (lun-dom) en
  `ONIA_COMUNIDAD_CONTENIDO.md:154-214`, con corchetes sin llenar (`[ejemplo real de Sergio]`,
  `[Sergio elige …]`, `[audio de Sergio de 5 min …]`).
- El drop del 21-sep metido en `cola/GUIONES-DIA-2026-09-21.md:344-364`.
- **(rama `codex/marca-comunidad-plan`)** la tabla "Activación inmediata 22–28 sep"
  (`ONIA_COMUNIDAD_CONTENIDO.md:112-127`), que cierra el lun 28 con la encuesta del piloto
  presencial.

### 1.4 La "Bóveda" — rama `codex/sergio-vault-growth` (1 commit `e8796f4f`, 21-sep, sin mergear)

- **No es Obsidian** (no hay `.obsidian` en el repo ni en la rama). Es una **página web pública**
  nueva, `sitio-sergiourcullo/boveda/index.html`: "Bóveda de recursos · gratuita", buscador y
  filtros, 7 tarjetas — 3 recursos nuevos (`/automatizar` = palabra `MAPA`, `/agentes` =
  `ARQUITECTURA`, `/mcp` = `MCP`) más `/vps`, `/homelab`, `/claude-code`, `/stack`
  (`boveda/index.html:21-48`). También agrega "Bóveda" a la barra de la home.
- El doc `hermes-content/docs/OPERACION_SERGIO_BOVEDA_Y_COMUNIDAD.md` (rama) define el ciclo
  reel → carrusel → historias (3 frames) → comunidad → Bóveda (`:16-24`), las 3 "puertas"
  (`:26-32`) y aclara que Postiz es sólo calendario/publicador y que su UI "no fue auditable"
  porque el navegador bloqueó `postiz.onia.com.bo` (`:80-84`). Referentes declarados: Enrique
  Rocha (bóveda pública) y Erik Taveras (`:9-14`).
- **No está desplegada:** Vercel (medido hoy) — último deploy de producción del proyecto
  `sergiourcullo` el **2026-09-19 12:38 La Paz**, ninguno después.
- Integrarla choca en 4 archivos que `main` cambió después de su base (`e9b80e22`):
  `hermes-content/carousels/CAROUSEL_SYSTEM.md`, `hermes-content/skills/carruseles-onia.md`,
  `scripts/carousel_pack_editorial.js`, `scripts/carousel_render.test.js` (los tocó `3f38fa3e`,
  campaña Meta, 21-sep).

### 1.5 Piloto presencial "IA Lab Santa Cruz" — rama `codex/marca-comunidad-plan` (3 commits, 21-22 sep, sin mergear)

- Nueva audiencia de la comunidad: "**jóvenes y aficionados a la IA** que quieren aprender a
  construir o aprender a vender soluciones"; la comunidad pasa a ser "parte de la marca personal
  de Sergio Urcullo; Onia aparece como laboratorio y caso real" (rama,
  `ONIA_COMUNIDAD_CONTENIDO.md:26-33`).
- Encuentro semanal de 120 min en Santa Cruz; sedes candidatas: sala de Bolivian Electric
  (sujeta a autorización), cafeterías, coworks (`:52-67`); "Nombre de trabajo interno: `IA Lab
  Santa Cruz`" (`:67`); escala: 4 pilotos → 8 encuentros → **primer producto pago (taller o
  curso)** → membresía (`:93-101`).
- 24 preguntas abiertas para Sergio Urcullo (nombre, día, sede, cupo, presupuesto, menores,
  KPI principal, etc.) en `MARCA_PERSONAL_OPERACION_DIARIA.md:146-196` (rama). Un carrusel
  "Laboratorio de IA en Santa Cruz" con palabra `SANTA CRUZ` está en la entrega del dom 27
  (`cola/ENTREGA-CARRUSELES-23-27-SEP-2026.md:13`, rama).
- ⚠️ Es una línea nueva (eventos + producto pago). `CLAUDE.md` §1: "No se abre una línea de
  negocio nueva" y exige el test de 3 preguntas; `ONIA_ESTRATEGIA_DE_EMPRESA.md:219` congela todo
  lo que no sea Platform + chatbot.

### 1.6 Cantidad de miembros

**No hay ningún dato**, con fecha o sin ella. Buscado en todos los docs de `main` y de las 3
ramas codex. El tablero de KPIs de la marca personal está vacío: "(arranque) … esperando día 1"
(`ONIA_MARCA_PERSONAL_ETAPA2_OPERACION.md:65-67`), y el loop `kpis-semanal` está congelado desde
el 05-sep (`cola/loops.md`, tabla "Congelados el 2026-09-05"). La meta escrita era "30+ miembros"
en la semana 1 (`ONIA_MARCA_PERSONAL_PLAN_MENSUAL.md:24`). El número sólo lo tiene Sergio Urcullo
(el WhatsApp).

---

## 2 · Llamadas 1 a 1

**Dónde está documentado y cómo funciona**

| Evento | Qué es | Evidencia |
|---|---|---|
| `cal.com/sergiourcullo/15min` "Pregunta puntual" | beneficio de comunidad: **oculto** de la página pública, reservable por link directo, link sólo en Announcements | `comunidad/ESTADO_COMUNIDAD.md:40-43`; drop `cola/drops/2026-09-13.md:6-18`; commit `900e91fb` ("oculto … reservable por link directo, verificado en vivo", 11-sep) |
| `cal.com/sergiourcullo/20min` "Llamada 1 a 1" | público, 20 min, Google Meet; la web enlaza **`/llamada`** (redirect 307) | `sitio-sergiourcullo/vercel.json:26-30`; `handoff/web-creator.md:72-79` (medido 18-sep); commit `c47d3a78` (19-sep) |
| `/30min` | **devuelve 404** desde ~18-sep (el evento pasó a `/20min`) | `handoff/web-creator.md:74-75`; brief de Samuel (rama `codex/samuel-grabaciones-20260921`) `BRIEF-SAMUEL-VIDEOS.md:46-49` (curl del 21-sep) |

- **Quién reserva:** cualquiera desde la web (20 min); los miembros de la comunidad, el de 15 min.
- **Horarios:** lun-vie 14:00-16:00 y 19:00-22:00; sáb 10:00-17:00 (La Paz); aviso mínimo 3 h
  (`ESTADO_COMUNIDAD.md:35-39`; verificados contra cal.com el 18-sep, `web-creator.md:78-79`).
- **Proceso (preparación, notas, seguimiento, grabación): en `main` no existe.** El único
  protocolo escrito está en la rama `codex/marca-comunidad-plan`,
  `MARCA_PERSONAL_OPERACION_DIARIA.md:79-102`: 15 min antes (quién es, 3 preguntas, nota
  SITUACIÓN / PROBLEMA / IMPACTO / PROCESO ACTUAL / SIGUIENTE PASO), durante (4 preguntas, un
  siguiente paso con dueño y fecha), 20 min después (resumen privado, registrar objeción y
  vocabulario sin datos identificables, convertir el patrón en pieza; nada se publica sin
  consentimiento). Y una agenda 5/25/10/5 (= 45 min) en `cola/PLAN-CONTENIDO-23-27-SEP-2026.md:53,81`
  (rama).
- `ONIA_MEETING_INTELLIGENCE_SYSTEM_2026.md` (último cambio 30-jul) es para **reuniones
  comerciales de Onia**: grabar con OBS/Audacity con consentimiento → Speakr/Speaches → "Audio IA"
  de Onia Center → propuesta (`:105-150`, reglas `:402-410`). **No está conectado a
  `cal.com/sergiourcullo`.** Su salud es dudosa: Speaches "no responde" (handoff
  `yt-serie-claude-code.md` §5.6, rama `claude/marca-personal-carruseles-dist-deadab`, 21-sep) y
  Onia Center tiene CI rojo desde el 23-ago (`cola/marca-personal.md:122`).
- `ONIA_CALCOM_SELF_HOST_RUNBOOK_2026.md:3-14`: el Cal propio (`cal.onia.com.bo`) está **APAGADO
  desde el 2026-08-29** (redirige a `onia.com.bo/empezar`; el webhook n8n se despublicó). O sea:
  **las reservas de 1 a 1 no disparan ningún aviso ni registro en Onia**; sólo lo que Cal.com
  cloud mande por su cuenta.

**¿Se hizo alguna llamada?** Sin evidencia.
- Indicio: la rama codex del 22-sep titula "Llamada 1:1 de mañana · protocolo"
  (`MARCA_PERSONAL_OPERACION_DIARIA.md:79`) y deja como dato pendiente "Hora, duración y tipo de
  la llamada 1:1 del miércoles" (`PLAN-CONTENIDO-23-27-SEP-2026.md:478`) → había una agendada
  para el mié 23-sep. No hay notas, resultado ni seguimiento escritos.
- El calendario conectado a esta sesión (`oninteligenciaartificial@gmail.com`) tiene **0 eventos
  entre el 11 y el 26-sep** (consultado hoy); Cal.com probablemente escribe en otra cuenta. Gmail
  del conector respondió "Precondition check failed". **No verificable desde acá.**

---

## 3 · Cómo se publica hoy

| Plataforma | Cómo se publica | Evidencia |
|---|---|---|
| **Instagram `@sergiourcullo`** | **a mano, desde el teléfono, por Sergio Urcullo** | `ONIA_AVISO_AUTOMATIZACION_IG.md:42-53` (desde el aviso de automatización del 24-ago); `cola/PARA-PUBLICAR-CARRUSELES-2026-09-21.md:7` ("La publicación queda manual; no se activó publicación automática"); rama `codex/marca-comunidad-plan` `cola/ENTREGA-CARRUSELES-23-27-SEP-2026.md:24-26` |
| ídem, circuito automático | existe `ok <id>` por Telegram → `scripts/kanban/publicar-aprobado.mjs` → Postiz, con `sergio` en la lista blanca (`:52`); **sólo se corrió en seco** el 05-sep | `cola/marca-personal.md:87,90`; commit `5c457af1` (04-sep) |
| **Postiz** (`postiz.onia.com.bo`) | programador/publicador; no lee ni responde comentarios ni DM | `ONIA_POSTIZ_COMENTARIOS_DM_20260817.md:33-45`. Caídas: 22 y 24-ago; backend muerto ~3 semanas hasta el 04-sep (`5c457af1`); "caído (502)" el 18-sep (handoff `yt-serie-claude-code.md` §5.3, rama); UI no auditable el 21-sep (rama vault, `:80-84`). **Estado de hoy: no verificado** |
| **Comentario → DM** | n8n `1jS4jwmNmvcQpqqH`: @oniahq (SISTEMA, LISTA) y Lucía (SISTEMA, HUMO); primera entrega real a un tercero el 28-ago. **Cuenta de Sergio Urcullo: `palabras: {}` → una palabra clave no dispara nada; se contesta a mano** | `ONIA_CIRCUITO_COMENTARIO_DM.md:12-20`; `ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md:104-106`; `ONIA_CIRCUITO_DE_CONTENIDO.md:67`. Auditoría del 22-sep (rama): "Los CTA por palabra clave revisados todavía tuvieron cero comentarios visibles" (`auditorias/AUDITORIA_INSTAGRAM_2026-09-22.md:35-36`) |
| **IG Graph API `ig-publish`** (VPS) | sólo `@oniahq`; validado en julio (`published_id=18126144559620893`) | `ONIA_INSTAGRAM_PUBLISHING.md:9-27`. Token de página **vencido el 17-ago** según la medición del 04-sep (`cola/contenido.md:94`, rama `claude/ads-creatividades-publicos`). No re-verificado |
| **TikTok** | **a mano** (los 4 TikToks del 17-18 sep: "falta solo ponerles música antes de subir") | `videos/tiktok-20260917/PUBLICAR.md:3`, `README.md:23`. `social-publish` sin credenciales (`CROSS_PLATFORM_PUBLISHING.md:33-56`). Publicador TikTok de Higgsfield: **0 cuentas conectadas** (consultado hoy). Sin comentario→DM (`ONIA_MARCA_PERSONAL_ETAPA2_OPERACION.md:88-89`) |
| **YouTube** | **a mano**: Sergio Urcullo arrastra el archivo (el `file_upload` corta a 10 MB; no hay credenciales de YouTube Data API) | handoff `yt-serie-claude-code.md` §5.1-5.2 (rama, 21-sep); `CROSS_PLATFORM_PUBLISHING.md:70-98` |
| **LinkedIn** | **sólo textos para copiar**; conectarlo a Postiz sigue pendiente; `social-publish` sin credenciales. **Ninguna evidencia de un post publicado** | `cola/PARA-PUBLICAR-2026-09-02.md:55-73` y los bloques "Versión X / LinkedIn" de 6 `PARA-PUBLICAR-APPLE-*`; `ONIA_MARCA_PERSONAL_ETAPA2_OPERACION.md:23` (⬜); `CROSS_PLATFORM_PUBLISHING.md:100-125`. Perfil completo desde el 30-ago (`OPERACION:80`) |
| **X** | perfil `@sergiourcullo`; banner pendiente; textos a mano | `ETAPA2_OPERACION.md:81`; `cola/marca-personal.md:95` |
| **Facebook** | no viable por Postiz (OAuth clásico vs Login for Business) → cross-post nativo desde IG | `handoff/claude-ads-creatividades-publicos.md:184-187` |

⚠️ **Trampa de nombre:** `handoff/publicacion-y-nodo-casa.md` **no es de redes sociales**: es el
publicador automático de **código** (`/root/bin/onia-publicar-solo.sh`, cron `50 */3`) y la vía
al nodo de casa (`:24-27`).

Hecho real, sin registro de qué pieza salió: el IG de Sergio Urcullo pasó de **45 publicaciones
(31-ago, `ONIA_COMUNIDAD_CONTENIDO.md:9`) a 81 (22-sep, auditoría en rama)** → hubo ~36
publicaciones en 22 días, pero ningún doc del repo dice cuáles.

---

## 4 · Equipo

**Samuel Aguilera — productor externo de la marca personal** (no de Onia):
- **Etapa 1 (agosto):** 8 videos guionizados, 2/semana; Bs 800 pagados; **sin cierre con
  números** (`ONIA_MARCA_PERSONAL_ETAPA2_EVALUACION.md:139-148,165-170`;
  `ONIA_CUENTAS_Y_MODELOS_SEPARACION_20260821.md:57-60`).
- **Etapa 2:** "ACEPTADO POR AMBAS PARTES el 2026-08-31"; faltaban números de la Etapa 1, fechas
  de grabación y la firma (`ONIA_MARCA_PERSONAL_ETAPA2_ACUERDO.md:5-8`). Hace: estrategia, guiones
  (5 días antes), dirige 2 medias jornadas/mes, edita y sube **30 videos/mes (20 pilar + 10
  B-roll)** + variantes de yapping + 8 secuencias de historias a IG / TikTok / Facebook / YouTube
  Shorts; sube a diario a la comunidad lo prometido (`:18-54`). Paga Bs 2.000/mes fijo + CPM
  (Bs 7,5 pilar, Bs 6 B-roll, la mitad para yapping), tope variable Bs 3.500/mes (`:66-99`). Pago
  directo sin factura; firma **Leslie Mercado Moreno por OniaAgency** porque Sergio Urcullo es
  menor (`:95-99, 133-139`; `ONIA_MARCA_PERSONAL_ETAPA2_CONTRATO.md:5,97`).
- **Firma: no registrada.** El último estado escrito es "Contrato: mandar
  `Acuerdo_Etapa2_Version_Firma.pdf` a Samuel ⬜ SERGIO" (`cola/marca-personal.md:94`, 05-sep).
  **Pero opera:** "los pilares los define Samuel (se hicieron el día de grabación) y los yaps son
  carril de Samuel" (`cola/PLAN-VIDEOS-11-20-SEP.md:14-15`, 11-sep); pilar del 18-sep
  (`cola/GUIONES-TANDA-2-18-SEP.md:35-37`); 10 videos pedidos por él el 17-sep (rama,
  `BRIEF-SAMUEL-VIDEOS.md:1`).

**Glosario del reparto diario** (`ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md:11-17`, 17-sep):
- **"El pilar de Samuel"** = la pieza fuerte del Feed, que Samuel define y graba ("Samuel decide y
  graba; esta cola no le pone palabras en la boca", `cola/GUIONES-DIA-2026-09-21.md:31`). Son los
  "20 pilares" del acuerdo.
- **"YAPS" / "yap"** = la variante de *yapping*: un video del día re-editado por Samuel para el
  carril Trial ("el yap replica un video del día con otra edición", `ESTRUCTURA:14`). En el
  acuerdo cobra la mitad del CPM y suma contra el tope de 50.000 vistas de su video madre
  (`ACUERDO:73-74, 89-91`).
- **Feed** = 3/día: pilar (Samuel) + B-roll (Sergio Urcullo y Samuel; los días de carrusel, el
  carrusel lo reemplaza) + video "normal" de Sergio Urcullo (`ESTRUCTURA:13`).
- **Trial** = 4/día: **re-subidas** de los 3 del Feed + 1 yap; "NO se graban … se vuelven a subir
  a la cuenta trial" (`cola/GUIONES-TANDA-2-18-SEP.md:6-8, 64-66`).
- **Trial V2** = 3-5/día: Sergio Urcullo a cámara, cero o mínima edición (`ESTRUCTURA:15`); en la
  rama codex: "2 de valor técnico · 1 personal/criterio · 1 polémico … · 1 opcional"
  (`ONIA_MARCA_PERSONAL_TRES_CARRILES.md:77`, rama).
- ⚠️ **"Trial" no está definido en ningún doc.** Todo apunta a los *Trial Reels* de Instagram
  ("trial reels activado en IG", `ETAPA2_EVALUACION.md:335`; "variantes de yapping para trial
  reels", `ETAPA2_ACUERDO.md:26-27`), pero `GUIONES-TANDA-2-18-SEP.md:7` habla de "la cuenta
  trial" y `ONIA_AUDITORIA_LUCIA_Y_PLAN_DIARIO.md:92,132` anota que los Trial Reels requieren
  ≥1.000 seguidores (IG de Sergio Urcullo: 503 el 22-sep). **Confirmar con Sergio Urcullo** si es
  la función de IG o una segunda cuenta.

**Rama `codex/samuel-grabaciones-20260921`** (1 commit `87cb02e8`, 21-sep, sin mergear): 7 clips
de pantalla (5 min 59 s, n8n y Higgsfield) para Samuel en
`E:/ONIA-YouTube/grabaciones/samuel/ENTREGA-20260921/` (fuera del repo); **no se enviaron a
Samuel**; la generación en Higgsfield quedó bloqueada por Cloudflare; el mensaje de prueba a
Telegram espera autorización (`handoff/grabaciones-samuel.md:13-77`, rama).

**Otros:** Leslie Mercado Moreno (firma y cobros por OniaAgency). Arthur Fuentes **ya no colabora**
desde el 23-ago (`ONIA_ACUERDO_ARTHUR_FUENTES_60_DIAS_2026.md:3-6`). No hay equipo de ventas
(`CLAUDE.md`). Lucía es una influencer IA sintética, no una persona. En agosto, "el equipo de
Samuel" publicaba en la cuenta de Sergio Urcullo (`ONIA_AVISO_AUTOMATIZACION_IG.md:24`).

---

## 5 · Cuentas y métricas

| Cuenta | Handle | Números (fecha · fuente) |
|---|---|---|
| Instagram Sergio Urcullo | **`@sergiourcullo`** (renombrada desde `@sergio_urcullo` después del 23-ago; confirmado el 06-sep, commit `2ee86efb`) | 410 seg. (21-ago, `SEPARACION_20260821.md:58`) · 411 (24-ago, `AVISO_AUTOMATIZACION_IG.md:7`) · **45 posts / 427 seg.** (31-ago, `ONIA_COMUNIDAD_CONTENIDO.md:7-9`) · **81 posts / 503 seg. / 428 seguidos** (22-sep, rama `codex/marca-comunidad-plan`, `auditorias/AUDITORIA_INSTAGRAM_2026-09-22.md:7`) |
| ídem, últimos 30 días al 22-sep | — | 101.934 visualizaciones (76 % no seguidores) · 37.242 espectadores · 4.275 interacciones · 1.872 visitas al perfil · 45 clics externos (~2,4 %) · Reels = 81 % de las vistas y 90,2 % de las interacciones · carruseles/posts = 1,8 % / 1,5 % (`AUDITORIA:15-21`). Mejor pieza reciente: vlog de emprendedor, 2.440 vis., 21 compartidos, 9 seguidores (`:25-28`) |
| TikTok | **sin resolver:** `@sergiourcullom` (21-ago, `SEPARACION_20260821.md:58`) vs `tiktok.com/@sergiourcullo` en la web (`sitio-sergiourcullo/index.html:228`) | 574 seg. (21-ago, mismo doc). Nada posterior |
| YouTube | `@sergiourcullo` ("mismo handle que Instagram, X y LinkedIn", `SERIE_CLAUDE_CODE_DESCRIPCIONES.md:3`; commit `21661d1e`) | 3 videos públicos al 21-sep: 01 `kAsAhGe6zyA`, 02 `oXaqV-HDufA`, 03 `8iMRBo7ppac` (publicado 18-sep), verificados por oEmbed el 21-sep (handoff `yt-serie-claude-code.md:25-31`, rama). Sin datos de suscriptores ni vistas. El canal ya existía con playlists personales ("ropa, Fútbol, Boxeo…", `:50`) |
| LinkedIn | `linkedin.com/in/sergiourcullo` | perfil terminado y público el 30-ago (`ETAPA2_OPERACION.md:80`); sin métricas |
| X | `@sergiourcullo` (may-2021) | sin métricas; banner pendiente (`ETAPA2_OPERACION.md:81`) |
| @oniahq (empresa) | `@oniahq` | **22 seg. medido el 16-ago** (el "25" que circula no tiene medición — `cola/contenido.md:167`, rama `claude/ads-creatividades-publicos`). Feed **no medible desde el 17-ago** (token vencido; `:94`) |
| Lucía | `@lucia.antelo.oficial` | 0 seg. (24-ago, `ONIA_PLAN_DE_CONTENIDO_3_FRENTES.md:14`); feed = 1 publicación al 03-sep (`hermes-content/PARA-PUBLICAR/COLA.md:8,88`) |

**`handoff/yt-canal.md` (06-sep):** es el setup de grabación (OBS + iPhone con Camo + micrófono
DJI) del **canal personal de Sergio Urcullo**; dejaba pendiente "si el canal va a su nombre o de
Onia" (`:136`). **No está congelado**: el canal quedó como `@sergiourcullo` con 3 videos y el
17-sep pasó a "YouTube DIARIO" (`ESTRUCTURA_PUBLICACION_DIARIA.md:31`). El handoff sí está
**vencido** (dice "El video 1 no está grabado", `:79`). Otro canal distinto, **"Máquina Humana"**
(ex "La Ciencia de tu Cuerpo", carril L, `COORDINATION_MANIFEST.md:124-133`), está dormido: último
commit 09-jul (`d8155fbf`) y su subida "apagada" (`ONIA_CORREO_SEGUNDA_IDENTIDAD_20260816.md:167`).

---

## 6 · `sergiourcullo.com`

- **¿Comprado? Sin evidencia de compra.** Se pidió el 07-sep ("Ahora: Comprar `sergiourcullo.com`
  … ~$12 al año … lo hace Sergio Urcullo: ningún agente ejecuta compras",
  `ONIA_MARCA_PERSONAL_TRES_CARRILES.md:104`; libre según RDAP el 07-sep, `:88-89`); el 10-sep
  seguía pendiente (`handoff/marca-personal-carruseles.md:247`); el README del sitio dice "El día
  que se compre" / "Cuando se compre" (`sitio-sergiourcullo/README.md:28,54`). **Medido hoy en Vercel:** el proyecto
  `sergiourcullo` tiene **un solo dominio, `sergiourcullo.vercel.app`** → el `.com` **no está
  conectado**. No pude consultar el registro (RDAP bloqueado por la red).
- **¿Desplegado? Sí, en `sergiourcullo.vercel.app`.** Proyecto creado el 2026-09-08 01:12 La Paz;
  **último deploy de producción: 2026-09-19 12:38 La Paz** (commit del buzón `74128141` "la
  llamada se enlaza por /llamada"); cero deploys después (Vercel, hoy). Se publica con
  `python scripts/publicar-sitio.py` → repo buzón `oninteligenciaartificial/sergiourcullo` →
  Vercel (`handoff/marca-personal-carruseles.md:83-93`; `handoff/web-creator.md:334-336`).
  ⚠️ `sitio-sergiourcullo/README.md:44-46` y `ONIA_RECURSOS_UN_RECURSO_TRES_PUERTAS.md:96-98`
  todavía dicen "deploy manual por MCP / `deploy_to_vercel`" — desactualizado.
- **Qué contiene** (fuente en `main` = lo desplegado el 19-sep): `/` (presentación, guías, agenda
  1 a 1, redes, entrada al configurador de webs de Onia) · `/stack` + `/stack/archivos` (5
  archivos) · `/homelab` + `/homelab/archivos` (3) · `/vps` (17-sep) · `/claude-code` (videos 01 y
  02 embebidos; **el 03 sigue comentado con `VIDEO03_ID`**, `claude-code/index.html:194-200`,
  aunque se publicó el 18-sep) · redirects `/llamada` → `cal.com/sergiourcullo/20min` y `/webs` →
  `onia.com.bo/servicios/webs?origen=sergio` (`vercel.json:25-36`).
- **No desplegado:** `/boveda`, `/automatizar`, `/agentes`, `/mcp` (sólo en la rama vault).
- **No lo pude abrir** (proxy 403): hoy no hay verificación visual.

---

## 7 · Handoffs del carril

| Handoff (último commit) | Objetivo | En producción | A medias y dónde | Depende de Sergio Urcullo |
|---|---|---|---|---|
| `marca-personal-carruseles.md` (`62fdb461`, **10-sep**) | repartir los 8 carruseles apple-editorial: qué se publica y dónde | web `sergiourcullo.vercel.app` (`/stack`, `/homelab` + archivos); generador `generar-apple-editorial.py`; 5 ZIP listos | "Publicado en Instagram: NADA" (`:64`); 2 carruseles a rehacer; `[TU EJEMPLO]` del D5. **Vencido:** su rama tiene 24 commits más (17-21 sep) sin mergear, con otro handoff (`yt-serie-claude-code.md`) | publicar los 5 paquetes (Fable "vence el dom 14"), grabar, link de YouTube, cablear `palabras` en n8n, comprar el `.com` (`:237-247`) |
| `EDICION-MARCA-PERSONAL-2026-09-21.md` (`f7bcc9d7`, **21-sep**) | editar la primera pieza de la tanda diaria: `01-feed-3-nodos` (n8n Webhook → IF → Sheets → Telegram, 9:16, 30-40 s) | nada ("Estado: esperando material bruto", `:3`) | brutos esperados en `C:\dev\…\videos\marca-personal\2026-09-21\raw\` (fuera del repo); la rama codex del 22-sep dice "Guion 1 grabado; falta localizar el archivo" (`GUIONES-DIA-2026-09-22.md:27`). No tiene el formato de 7 campos | entregar o ubicar los brutos; validar el lenguaje visual del primer corte (`:68-72`) |
| `HIGGSFIELD-LUCIA-SYSTEM-2026-09-22.md` (`76b98ef9`, **22-sep**; más `59cb759d` plan v4 del 23-sep) | arquitectura Higgsfield/Lucía con identidad, costo y tokens controlados | **nada** (sin deploy, generación, gasto ni publicación, `:15-16`) | Fases 1-3; el gate de derechos no es ejecutable; `video-factory` es un esqueleto (`:78-82`) | procedencia/consentimiento de las referencias de Lucía; OAuth de la CLI; cap del entrenamiento Soul v4 y del A/B; aprobar toda publicación (`:31-33, 215-219`). ⚠️ El loop `lucia` está congelado desde el 05-sep |
| `claude-analizar-reels-videos-67f762.md` (`d2e6c280`, **23-ago**) | recibir los reels que manda Sergio Urcullo, analizarlos y repartir prompts | nada (docs + skill `sacar-prompt`) | 17 de 32 ítems de la cosecha sin analizar; `cosechar-dm.mjs` sin estrenar; 18 prompts repartidos sin ejecutar (`:35-45`) | correr `cosechar-dm.mjs --login`; subir MP4 a Drive; `CALCOM_WEBHOOK_SECRET` (hoy moot: el Cal propio está apagado) (`:103-114`). **Vencido (un mes)** |
| `claude-ads-creatividades-publicos.md` (contenido del **23-ago**; último cambio real `d5f4bddf` 31-ago; el commit del 22-sep sólo tocó una línea) | Lucía lista para publicar + sistema de marketing de las 3 cuentas | Postiz revivido el 24-ago; comentario→DM verificado; arreglo del chat de `onia.com.bo` (`inbox_members` id 9) | reel v6/v7, L6, 8 historias, L5 sin montar (`:100-126`). Su cola (`cola/contenido.md`) y 166 commits viven sólo en la rama | OK al reel; **rotar el token de Postiz** que quedó pegado en un chat; tarjeta en ONIA Ads; dos toques de celular (`:234-248`). **Vencido** |
| `yt-canal.md` (`61ecefb0`, **06-sep**) | dejar lista la grabación del primer video de YouTube | setup de OBS verificado | prueba del audio corregido sin hacer; "video 1 no grabado" (superado: 3 videos publicados al 18-sep) | ganancia del DJI, tamaño del círculo, luz, "¿canal a su nombre o de Onia?" (resuelto de hecho: `@sergiourcullo`). **Vencido** |
| `publicacion-y-nodo-casa.md` (`f82e5a6b`, **08-sep**) | **no es de contenido**: se abrió para "usuarios y pricing de la 1.0", terminó en el publicador automático de código y la vía al nodo de casa | `onia.com.bo`, 2 deploys de `app.onia.com.bo`, bot; `onia-publicar-solo.sh` (cron `50 */3`) | rama `claude/usuarios-pricing-v1-cierre-db1230` sin mergear; arreglo de landing que toca `pricing.ts` frenado | cuenta bancaria de OniaAgency, clave de `superadmin@onia.com.bo`, firma del cambio de precios, merge de la rama (`:82-89`) |
| `meta-ads-prospeccion.md` (`bdfdfb04`, **21-sep**; llegó a `main` el 25-sep con `dc443322`) | ¿pautar Meta ahora? → **no todavía**; y dejar una fuente de "a quién le vendemos" | `ONIA_CLIENTE_IDEAL.md` + línea en `CLAUDE.md` §2 (`:22-31`) | pauta: nada creado, 4 bloqueos (`:43-57`); `?src=` cortado en la landing (`:64-72`); one-pager que vende "DentalGest" (`:74-83`) | **contestar a los 5 leads que esperan desde agosto**; tarjeta y vincular la página; OK para encender la pauta; ver el one-pager nuevo (`:116-140`) |
| `web-creator.md` (`2dc61598`, **21-sep**) | configurador de webs en `onia.com.bo/servicios/webs` + web personal que lo enlaza | configurador (4 deploys, 17-18 sep); web personal con `/llamada` (19-sep) | nada en vuelo; pero la **entrega** de una web generada no existe, la tienda sale con copy de otra marca y "dirección/estructura" son decorado (`:242-270`). El carril sigue en Codex desde el 21-sep (`:8-10`) | subir las 3 historias de la llamada con sticker a `/llamada`; revisar el 2º link de la bio de IG; decidir dirección/estructura; `WA_PHONE` (`:366-374`). ⚠️ La web falla el test de 3 preguntas (`:37-41`) |

**Handoffs del carril que sólo existen en ramas sin mergear:**
`yt-serie-claude-code.md` (rama `claude/marca-personal-carruseles-dist-deadab`, 21-sep: video 03
publicado, 04 listo sin grabar, 05-06 sin guion; desliz "cuatro/tres subagentes" en 2:31 del 03;
sin playlist) y `grabaciones-samuel.md` (rama `codex/samuel-grabaciones-20260921`). Ninguna
sesión que lea `main` los ve.

---

## 8 · Contenido B2B de ONIA (lo que sirve a la etapa vigente)

**La etapa vigente:** Etapa 1, vender sólo dental/estética (`ONIA_ESTRATEGIA_DE_EMPRESA.md:218-224`);
cliente = "la clínica de Santa Cruz … 2 a 6 profesionales atendiendo, con recepción"
(`ONIA_CLIENTE_IDEAL.md:22-23`).

| Pieza B2B | Estado | Evidencia |
|---|---|---|
| **Campaña Meta "ONIA Platform Dental"** (21-sep) | **creatividades preparadas; no publicadas** | `hermes-content/campaigns/onia-platform-meta-2026-09-21/README.md:5` |
| · carrusel 8 láminas (v2) + estáticos feed/story (v2) | renderizados | `carousels/out/ads/onia-platform-dental-meta-20260921-*`; commits `5dd85e6d` y `3f38fa3e` (21-sep; la v1 negra/verde fue rechazada, `README:124-129`) |
| · UGC con presentadora IA, 27 s | guion + 2 imágenes; **video no generado** (no se pudo cotizar en vivo) | `README:113-115, 131-133` |
| · oferta | 14 días del plan Profesional sin tarjeta; "desde Bs [monto omitido]/mes"; destino `app.onia.com.bo/register?utm_…` | `README:25-28`. Ese monto coincide con el plan `basic` del espejo `web-factory/apps/onia-platform/src/lib/pricing.ts:29-30` (la fuente `onia-platform/lib/subscription-plans.ts` no está en esta sesión) |
| **Cuenta ONIA Ads** `act_1073680778314945` | **nada creado**: sin medio de pago; página "Onia" no vinculada; campaña 1 ARCHIVED desde el 1-sep con 0 anuncios; píxel no instalado (medido el 17-sep por Graph API desde el VPS) | `handoff/meta-ads-prospeccion.md:43-57`. **Re-medición imposible hoy:** el conector de Meta de esta sesión sólo ve "NUVO 1usd" y "Arthur Fuentes" (consultado hoy) — no usar esas cuentas |
| Atribución | la landing no propaga `?src=` (`meta-ads-prospeccion.md:64-72`) y la campaña usa `utm_*` (`README:28`). **A verificar** si el producto lee `utm` | — |
| Creativos viejos | 8 ángulos dentales (ad-a2…a8) + copy de `ONIA_ADS_CAMPANA_1_LISTA_20260813.md` con cifras vencidas | `PLAN_DE_CONTENIDO.md:55-76`; `meta-ads-prospeccion.md:173-179` |
| **@oniahq orgánico** | 9-10 carruseles + 2 reels "listos", publicado "—" (30-ago); D01 "8 de la noche" listo y no publicado (03-sep); la "cola llena hasta 09-sep" en Postiz era un fantasma; «Cuatro cosas a mano» ⏸ rehacer | rama `claude/ads-creatividades-publicos` `cola/contenido.md:77-80,163`; `PARA-PUBLICAR/COLA.md:139-155`; `cola/PARA-PUBLICAR-APPLE-ORDEN.md:31` |
| Videos de Onia Platform que pidió Samuel | 2 videos para @oniahq; los clips se grabaron con una **demo de comercio** ("Tienda La Esquina"), no dental; el recorrido se trabó (onboarding con stock 0 → "Stock insuficiente"; SKU obligatorio sin marcar) | rama `codex/samuel-grabaciones-20260921` `BRIEF-SAMUEL-VIDEOS.md:8-20,95-114,148-154`; los hallazgos están **sólo** en la rama sin mergear `claude/marca-personal-carruseles-dist-deadab` (`cola/HALLAZGOS-RODAJE-ONIA-18-SEP.md`) — el carril de producto puede no haberlos visto |
| Lucía (UGC para vender Onia) | carril congelado el 05-sep; sistema Higgsfield en Fase 0; gate legal de consentimiento abierto | `cola/loops.md` (congelados); handoff Higgsfield `:103-114` |

**El número que ordena todo** (21-sep): **5 leads llegaron solos y esperan respuesta** (el más
viejo desde el 21-ago) y `subscription_payments` tiene **0 filas** (`meta-ads-prospeccion.md:118-143`).
El propio handoff pone "contestar a los cinco" antes que pautar (`:151-159`).

**Separación marca personal ↔ venta de Onia:** todo lo producido en septiembre (drops, web,
YouTube, TikToks, 10-13 piezas/día) es **marca personal**, y el repo lo dice de frente: el que mira
un tutorial de Claude Code "es un dev del mundo … Son audiencias casi disjuntas" y Sergio Urcullo
decidió que "ése no es el objetivo de la serie" (`SERIE_CLAUDE_CODE.md:13-20`). La rama codex
formaliza la audiencia como "jóvenes y aficionados a la IA" y "ONIA … se gestiona en un frente
separado" (`MARCA_PERSONAL_OPERACION_DIARIA.md:3-5`, rama). **Lo B2B publicado en septiembre:
nada.**

---

## 9 · Documentos rectores

### 9.1 Vigencia

| Doc (último commit) | Estado |
|---|---|
| `ONIA_CIRCUITO_DE_CONTENIDO.md` (10-sep) | **índice declarado**, pero vencido: no lista `ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md` ni `SERIE_CLAUDE_CODE.md`, apunta a `cola/ARRANQUE-MOTOR-SEMANAL.md` "vence el 21-sep" (`:42`) — ese archivo dice "Cuando termine el 21-sep, este archivo se borra" y sigue ahí |
| `ONIA_MARCA_PERSONAL_MADRE.md` (02-sep) | **segundo "punto de entrada"** del mismo carril (`:3`); su tabla de estado es del 01-sep. Superado por el índice |
| `ONIA_DONDE_VA_CADA_COSA.md` (10-sep) | vigente como **desempate de lugares**, pero sin TikTok, LinkedIn, X, Facebook ni Shorts (`:48-54`) |
| `ONIA_MOTOR_SEMANAL_CONTENIDO.md` (10-sep) | vigente para el ritmo temático semanal; su volumen (6 videos/semana) quedó superado por `ESTRUCTURA` |
| `ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md` (17-sep) | **el más nuevo de `main`** para el reparto diario (10-13 piezas; YouTube diario) |
| `ONIA_MARCA_PERSONAL_TRES_CARRILES.md` (10-sep) | parcialmente vencido (horarios, "semana 2", link de artifact, "formato: carruseles"); la rama codex reescribe la sección pública (sin mergear) |
| `ONIA_RECURSOS_UN_RECURSO_TRES_PUERTAS.md` (17-sep) | vigente (catálogo `/vps`, `/homelab`, `/stack`); método de deploy desactualizado (`:96-98`) |
| `MODELO_DE_CONTENIDO_DOS_CUENTAS.md` (02-sep) | @oniahq + Lucía; carril Lucía congelado; cita `scripts/recompensas.json`, **que no existe en `main`** (`:46`) |
| `PLAN_DE_CONTENIDO.md` (02-sep) | foto del 01-sep ("Publicado: 1 post") — superado; también cita `recompensas.json` (`:30,107`) |
| `ONIA_PLAN_DE_CONTENIDO_3_FRENTES.md` (24-ago) | superado (cadencia, handles `@sergio_urcullo`) |
| `ONIA_PLAN_CONTENIDO_Y_ADS_20260820.md` (21-ago) | historia (tiene fecha; su horizonte era el 15-sep) |
| `PERSONAL_BRAND_SERGIO.md` (30-jul) | principios generales; la mezcla 70/20/10 superada; la regla "cara IA sólo con aprobación" sigue |
| `ONIA_MARCA_PERSONAL_PLAN_MENSUAL.md` (02-sep) | plan de septiembre; ritmo semanal superado por el motor |
| `ONIA_MARCA_PERSONAL_BASE_CONTENIDO.md` (05-sep) | inventario útil; su "CTA estándar" y la tipografía de marca chocan con docs posteriores |
| `SERGIO_ONIA_CONTENT_PRODUCTION_KIT_2026.md` (02-sep; nacido 06-jun) | se declara "canónico interno" pero describe a Onia como "empresa de automatizacion, IA y consultoria" (`:12`) — choca con `CLAUDE.md` §3 (un solo producto) |

### 9.2 Contradicciones (cita + archivo:línea)

**C1 · Audiencia.**
- Etapa vigente: vender sólo dental/estética (`ONIA_ESTRATEGIA_DE_EMPRESA.md:219-220`); clínica de
  Santa Cruz, 2-6 profesionales (`ONIA_CLIENTE_IDEAL.md:22-23`).
- La comunidad "es donde viven los que van a comprar Onia" (`ONIA_MARCA_PERSONAL_TRES_CARRILES.md:170-171`).
- "La mitad de los 20 pilares apuntados a dueños de negocio en Bolivia; el resto, autoridad amplia
  en IA" (`ONIA_MARCA_PERSONAL_ETAPA2_ACUERDO.md:129-130`).
- Serie de YouTube: "audiencias casi disjuntas" del cliente de Onia (`SERIE_CLAUDE_CODE.md:18`).
- Rama codex: "La audiencia prioritaria son jóvenes y aficionados a la IA"
  (`ONIA_MARCA_PERSONAL_TRES_CARRILES.md:40` y `ONIA_COMUNIDAD_CONTENIDO.md:26`, rama); la comunidad
  "forma parte de la marca personal … Onia aparece como laboratorio" (`:32-33`, rama).
- Lucía: "Aterriza en la comunidad, y de ahí a Onia" (`MODELO_DE_CONTENIDO_DOS_CUENTAS.md:27`).

**C2 · Piezas por día / cadencia.**
- "2/día marca personal · 1/día @oniahq · 1/día Lucía" (`ONIA_PLAN_DE_CONTENIDO_3_FRENTES.md:7`).
- 6 videos diarios + 1 de la semana; "si hay que recortar, recortá videos, no drops"
  (`ONIA_MOTOR_SEMANAL_CONTENIDO.md:31-36, 198-200`).
- "Feed 3 + Trial 7 … = 10-13 piezas al día" (`ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md:17`).
- Rama codex: "13 publicaciones" (`cola/GUIONES-DIA-2026-09-22.md:20`) vs "11 piezas"
  (`cola/PLAN-CONTENIDO-23-27-SEP-2026.md:22`).
- Cuenta advertida por automatización: "la cadencia sube gradual, no arranca en 2/día"
  (`ONIA_AVISO_AUTOMATIZACION_IG.md:45-47`).
- 70 % videos / 20 % historias / 10 % carruseles (`PERSONAL_BRAND_SERGIO.md:20-22`).

**C3 · YouTube.** "largo, uno por semana o cada dos" (`ONIA_MAPA_DE_TEMAS.md:57`) vs "YouTube
DIARIO" (`ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md:31`) vs la pregunta abierta "¿uno o dos por
semana?" (`MARCA_PERSONAL_OPERACION_DIARIA.md:189`, rama).

**C4 · Cuándo se elige el tema de la semana.** "El viernes, no el lunes"
(`ONIA_CIRCUITO_DE_CONTENIDO.md:52`) vs "el domingo anterior" (`ONIA_MOTOR_SEMANAL_CONTENIDO.md:186`).

**C5 · Estructura de la semana de la comunidad.** Lun herramienta / mar receta / mié reto / jue
caso / vie recurso / sáb la más pedida / dom cierre (`ONIA_MARCA_PERSONAL_PLAN_MENSUAL.md:12-20`) vs
un solo tema en 6 ángulos (repo / skill / error / segundo paso / curiosidad / preguntas) y guía el
domingo (`ONIA_MOTOR_SEMANAL_CONTENIDO.md:49-64`).

**C6 · Plataformas.** El doc que "manda" en lugares lista IG `@sergiourcullo`, IG `@oniahq`,
YouTube, web y comunidad (`ONIA_DONDE_VA_CADA_COSA.md:48-54`) vs el acuerdo con Samuel: IG, TikTok,
Facebook, YouTube Shorts, y LinkedIn/X "vía Postiz" (`ETAPA2_ACUERDO.md:20-25`) vs la rama codex:
"Instagram, TikTok, YouTube, historias y Postiz" (`MARCA_PERSONAL_OPERACION_DIARIA.md:35-36`, rama).

**C7 · CTA.** "CTA estándar: 'Comentá COMUNIDAD y te paso el enlace'"
(`ONIA_MARCA_PERSONAL_BASE_CONTENIDO.md:39`) vs diario = "entrá a la comunidad" / semanal = "comentá
PALABRA" (`ONIA_MOTOR_SEMANAL_CONTENIDO.md:35`) vs "siempre cerrá obligando a que comenten" con
pregunta de elección y sin palabra automática (`cola/PARA-PUBLICAR-APPLE-ORDEN.md:36-50`) vs "cierra
alternando comentario ↔ comunidad" (`ESTRUCTURA:22`) vs rama codex "Todo carrusel termina invitando
a comentar una palabra" (`TRES_CARRILES.md:86`, rama). Y la cuenta de Sergio Urcullo tiene
`palabras: {}` (`QUE_LA_HACE_VALER.md:105-106`).

**C8 · Qué va en la comunidad / quién publica en Announcements.** Exclusivo: drop, archivos, lo que
salió mal, respuestas, carrusel de la semana vigente (`ONIA_DONDE_VA_CADA_COSA.md:62-69`) vs "El
video explicando … no va a la web" (`QUE_LA_HACE_VALER.md:48`) vs "llega 2-3 días antes"
(`ONIA_RECURSOS_UN_RECURSO_TRES_PUERTAS.md:55`) vs rama codex: Bóveda pública completa + encuentros
presenciales. Y "Announcements (solo publica Sergio)" (`ESTADO_COMUNIDAD.md:16`) vs Samuel "sube a
diario a la comunidad lo prometido en cada video" (`ETAPA2_ACUERDO.md:46`).

**C9 · Llamada 1 a 1: duración y enlace.** `/30min` "Llamada 1 a 1" público
(`ESTADO_COMUNIDAD.md:41`) vs `/30min` da 404, el vivo es `/20min` de 20 min (`web-creator.md:74-75`;
`vercel.json:28`) vs "la oferta real: 30 min … `/20min`" (`BRIEF-SAMUEL-VIDEOS.md:43-44`, rama) vs
"15 minutos conmigo, uno a uno" (`cola/drops/2026-09-13.md:8`) vs agenda 5/25/10/5 = 45 min
(`PLAN-CONTENIDO-23-27-SEP-2026.md:53`, rama) vs slot 15:30-15:50 (`MARCA_PERSONAL_OPERACION_DIARIA.md:191`, rama).
Horarios: "lun-vie 14–17 y 20–22 · sáb 9–15 … 1 día de anticipación"
(`TRES_CARRILES.md:162`) vs "14:00–16:00 y 19:00–22:00 … sáb 10:00–17:00 … 3 horas"
(`ESTADO_COMUNIDAD.md:35-39`).

**C10 · Cómo se publica en la cuenta de Sergio Urcullo.** "A mano, desde el teléfono" y "una sola
herramienta de publicación por cuenta" (`ONIA_AVISO_AUTOMATIZACION_IG.md:51, 60`) vs "Su ok la
publica sola en @sergiourcullo" (`cola/marca-personal.md:90`) y `sergio` en la lista blanca de
`scripts/kanban/publicar-aprobado.mjs:52` vs "La publicación queda manual"
(`PARA-PUBLICAR-CARRUSELES-2026-09-21.md:7`). En la rama `claude/ads-creatividades-publicos`,
`scripts/postiz_schedule.mjs:19-27` se niega a publicar en la cuenta personal — en `main` ese
guard no está.

**C11 · Registro de promesas.** "Cada video que promete algo entra acá antes de publicarse. Sin fila
en esta tabla, no sale" y el registro tiene 2 filas (`QUE_LA_HACE_VALER.md:89-97`) vs palabras
usadas o guionadas después: SKILL, COMUNIDAD, VIDEO (`videos/tiktok-20260917/PUBLICAR.md:8,21,36`),
AUTOMATIZAR, SUBAGENTE (`cola/GUIONES-TANDA-2-18-SEP.md:31,59`), MAPA, ARQUITECTURA, MCP
(`cola/PARA-PUBLICAR-CARRUSELES-2026-09-21.md:14,21,28`), y en la rama codex OPUS, 1A1, MODELO,
N8N, TOOL, PROCESO, BOLIVIA, SANTA CRUZ (`PLAN-CONTENIDO-23-27-SEP-2026.md`).

**C12 · "Nadie externo".** "No hay nadie externo operando contenido" (`ONIA_CLIENTE_IDEAL.md:189`,
18-sep) vs Samuel produce el pilar y el yap todos los días (`ESTRUCTURA:13-14`, 17-sep).

**C13 · Qué es Onia.** "Onia como empresa de automatizacion, IA y consultoria"
(`SERGIO_ONIA_CONTENT_PRODUCTION_KIT_2026.md:12`) vs `CLAUDE.md` §3 "Hay UN solo producto".

**C14 · Biblioteca de drops.** Notion "Se agrega un drop nuevo cada día" (sin tocar desde el 01-sep)
vs `/tema/archivos` en la web (`ONIA_DONDE_VA_CADA_COSA.md:79-82`) vs la Bóveda pública (rama
vault). Y dentro del mismo tema: "2 cursos" (`ONIA_COMUNIDAD_BIBLIOTECA.md:14`) vs "los 3 cursos"
(`ONIA_COMUNIDAD_CONTENIDO.md:83`).

**C15 · Identidad visual.** "Verde Onia (#00C661) y tipografía de marca (Archivo + Geist Mono)
SIEMPRE" (`ONIA_MARCA_PERSONAL_BASE_CONTENIDO.md:380`) vs serie YouTube "apple-editorial — Inter +
Instrument Serif, acento terracota" (`SERIE_CLAUDE_CODE.md:145`).

**C16 · Handles.** `@sergio_urcullo` como vigente (`ONIA_MARCA_PERSONAL_ETAPA2_OPERACION.md:76`;
`ONIA_PLAN_DE_CONTENIDO_3_FRENTES.md:12`) vs `@sergiourcullo` confirmado el 06-sep (`2ee86efb`).
TikTok `@sergiourcullom` (`SEPARACION_20260821.md:58`) vs `@sergiourcullo` en la web (`index.html:228`).

**C17 · Meta Ads, quién bloquea.** "Meta está trabado del lado de Meta … Ticket abierto"
(`PLAN_DE_CONTENIDO.md:76,106`) vs "Método de pago … ausente — lo destraba Sergio Urcullo / Leslie"
(`meta-ads-prospeccion.md:49`).

---

## 10 · Colas

- **La cola declarada del carril Contenido** es `hermes-content/docs/cola/contenido.md`, "rama
  `claude/ads-creatividades-publicos`" (`cola/README.md:30`). **No existe en `main`.** Esa rama
  está **166 commits por delante y 2.270 por detrás** de `main`, último commit 04-sep (medido en el
  clon completo). Su sección "Ahora" tiene **0 ítems abiertos** (todos `[x]`); quedan 3 `[ ]` en
  Después/Bloqueado.
- En `main`, la cola que cubre marca personal + comunidad + Samuel es
  `cola/marca-personal.md` (último commit `c20d5ade`, 05-sep). Su tabla "HOY" tiene pendientes
  vencidos: D0 "⬜ SERGIO pega" (`:88`), decidir la semana 2 (`:92`, ya resuelto por P33 `:67`),
  contrato de Samuel ⬜ (`:94`), banner de X (`:95`), bios (`:96`), statement a publicar con `ok
  t_d4a7c724` (`:90`).
- También de contenido: `cola/tendencias.md` (04-sep).
- **Loops:** `contenido-cola`, `marca-personal` y `tendencias` **pausados el 04-sep**; `lucia` y
  `kpis-semanal` **congelados el 05-sep** (`cola/loops.md:473-497` y tabla del 05-sep). Los 4 loops
  activos son todos de producto (`chatbot-cola`, `onia-cola`, `web-venta`, `recorrido-cliente`,
  `cola/loops.md:199-204`). **El carril contenido no tiene ningún loop corriendo.**

**`node scripts/verificar_cola.js` (normal, sin `--self-check`):**

| Cola | Resultado |
|---|---|
| `cola/marca-personal.md` | `ERROR cola-vacia`: no tiene sección `## Ahora` (usa una tabla "HOY") — exit 1 |
| `cola/tendencias.md` | `ERROR cola-vacia`: su "Ahora" usa ítems numerados, no casillas — exit 1 |
| `cola/contenido.md` (copia de la rama fuera del repo, medida contra el árbol de `main`) | **34 errores "fantasma" sobre 25 rutas + 5 "sha-fantasma"** — exit 1 |

**Lectura correcta de esos "fantasmas":** medidas contra **su propia rama**, **24 de las 25 rutas
existen** (Lucía, `scripts/caption_kit.js`, `scripts/recompensas.json`,
`scripts/verificar_recompensas.js`, `scripts/entregar_pieza.js`, `hermes-content/contenido/PUBLICAR.md`,
renders de ads…); la única que no se resuelve es un nombre suelto (`CAPTION.md`). Los 5
"sha-fantasma" son prefijos sha256 de PDFs, no commits → falso positivo del verificador. **El
hallazgo real no es un fantasma: es que todo ese trabajo nunca llegó a `main`**, y `main` ya lo
cita: `scripts/recompensas.json` (`MODELO_DE_CONTENIDO_DOS_CUENTAS.md:46`; `PLAN_DE_CONTENIDO.md:30,107`)
y `cola/contenido.md` (`cola/README.md:30`; `cola/marca-personal.md:78`) son **punteros rotos en
`main`**.

---

## 11 · Las contradicciones más peligrosas

1. **El carril produce para una audiencia que no es la de la etapa vigente, sin que eso esté
   decidido contra la estrategia.** Etapa 1 = clínicas dentales; todo septiembre fue marca personal
   para "jóvenes y aficionados a la IA" (C1). Sergio Urcullo sí lo decidió para la serie de YouTube
   (`SERIE_CLAUDE_CODE.md:13-20`), pero la estrategia de empresa no lo contempla y lo B2B publicado
   es cero.
2. **Se está por abrir una línea nueva** (piloto presencial IA Lab → taller/curso → membresía) en
   una rama sin mergear, contra `CLAUDE.md` §1 y `ESTRATEGIA:219`.
3. **Las decisiones vigentes del carril no están en `main`.** 3 ramas codex, 24 commits de
   `claude/marca-personal-carruseles-dist-deadab` y la cola declarada viven afuera; cualquier sesión
   nueva que lea `main` va a trabajar sobre un carril de hace 2-3 semanas.
4. **La comunidad no tiene registro de lo que recibió y lleva 5 días sin drop.** `ESTADO_COMUNIDAD`
   (la "fuente de verdad" de envíos) y la Biblioteca de Notion no se actualizan desde el 02 y el
   01-sep; no hay archivo de drop desde el 20-sep; el recordatorio del VPS (si sigue vivo) avisa
   "no hay drop" todos los días culpando a un loop pausado.
5. **Promesas sin registro y sin entrega automática.** 8+ palabras clave usadas o guionadas desde
   el 17-sep, el registro tiene 2 filas (C11), `palabras: {}` en la cuenta de Sergio Urcullo y la
   Bóveda que las cumpliría no está desplegada.
6. **La llamada 1 a 1 se anuncia con cuatro duraciones distintas** (15/20/30/45 min, C9) y
   `ESTADO_COMUNIDAD` todavía publica el `/30min` que da 404.
7. **Dos índices del carril** (`MADRE` y `CIRCUITO`) y ninguno lista el doc más nuevo
   (`ESTRUCTURA_PUBLICACION_DIARIA`) — la regla "una fuente de verdad por tema" está rota adentro
   del propio carril.
8. **Samuel opera sin firma registrada** y con un "Etapa 1/Etapa 2" que se confunde con la Etapa 1
   de la empresa (son cosas distintas).

---

## 12 · Lo que depende de Sergio Urcullo

**Para la etapa vigente (B2B):**
1. Contestar a los 5 leads que esperan desde agosto (`meta-ads-prospeccion.md:118-159`).
2. Medio de pago en ONIA Ads + vincular la página + OK explícito para encender la pauta
   (`:138-140`). Decidir si la campaña dental del 21-sep sale.
3. Ver el one-pager corregido antes de reemplazar el actual (vende "DentalGest").

**Para la comunidad:**
4. Confirmar qué drops se pegaron de verdad (13-19 sep) y **cuántos miembros hay** (el dato no existe
   en el repo).
5. Decidir qué recibe la comunidad desde el 20-sep (reserva de `ONIA_COMUNIDAD_CONTENIDO.md:154-214`,
   el drop del 21 o la activación codex 22-28).
6. Decidir el piloto presencial (las 24 preguntas de `MARCA_PERSONAL_OPERACION_DIARIA.md:146-196`,
   rama) — y si pasa el test de 3 preguntas.
7. Publicar o descartar la Biblioteca de Notion (congelada desde el 01-sep).

**Para la marca personal:**
8. Qué es "Trial" (Trial Reels de IG o una segunda cuenta).
9. Firma del acuerdo con Samuel (Leslie) o confirmación de que opera sin firma.
10. Aprobar integrar (o no) las ramas codex: audiencia nueva, Bóveda, 10-13 piezas/día.
11. Desplegar la Bóveda **antes** de publicar carruseles que la prometan.
12. Comprar `sergiourcullo.com` (si sigue en pie) y conectarlo al mismo proyecto de Vercel.
13. Llamadas: duración única del evento público; qué pasó con la llamada del mié 23-sep.
14. Pegar el ID del video 03 en `/claude-code`, playlist de la serie y el desliz de 2:31 del 03.
15. Rotar el token de Postiz que quedó pegado en un chat (pendiente desde el 23-ago).
16. Cablear `palabras` para su cuenta en n8n o seguir contestando a mano.

---

## 13 · Qué NO se pudo verificar, y por qué

| Qué | Por qué | Cómo se verifica |
|---|---|---|
| Que el sitio sirve lo que dice el repo; `/llamada`, `/15min`, `/20min` vivos; videos de YouTube públicos; `sergiourcullo.com` en el registro | la política de red de la sesión deniega `sergiourcullo.vercel.app`, `cal.com`, `youtube.com`, `rdap.verisign.com` (proxy 403). Se reporta y no se rodea | ampliar el acceso de red del entorno, o abrirlos desde un navegador y MIRARLOS |
| Código desplegado en el buzón `oninteligenciaartificial/sergiourcullo` | el repo no está adjunto a la sesión; no se agregó sin pedido | adjuntarlo (lectura) si Sergio Urcullo lo pide |
| Envíos a WhatsApp y cantidad de miembros | viven en el WhatsApp de Sergio Urcullo | él |
| Llamadas hechas | el calendario conectado no tiene eventos; Gmail del conector falló ("Precondition check failed") | la cuenta donde escribe Cal.com |
| Estado de ONIA Ads | el conector de Meta ve otra identidad (NUVO / Arthur Fuentes) | Graph API desde el VPS con `META_SYSTEM_USER_TOKEN` (comando en `meta-ads-prospeccion.md:197-205`) |
| Postiz, `onia-drop-recordatorio.sh`, n8n `palabras` | viven en el VPS; no se entró (infra tiene un solo dueño a la vez) | `docker ps -a \| grep postiz`, `crontab -l`, sqlite de n8n |
| Si el producto lee `utm_*` | `onia-platform` no está en esta sesión | `grep` de `utm_` en `onia-platform` |

---

## Anexo · Comandos y consultas usados (todos de lectura)

```bash
git -C /home/user/onia-hermes fetch origin --quiet
git clone --bare --filter=blob:none --single-branch --branch main <origin> <clon-fuera-del-repo>.git
git -C <clon-fuera-del-repo>.git fetch --filter=blob:none origin <ramas del carril>
git rev-list --count main..origin/<rama>   # ahead/behind en el clon completo
git show origin/<rama>:<ruta> ; git diff origin/main...origin/<rama>
node scripts/verificar_cola.js hermes-content/docs/cola/marca-personal.md
node scripts/verificar_cola.js hermes-content/docs/cola/tendencias.md
node scripts/verificar_cola.js <copia-de-cola/contenido.md-de-la-rama>
git cat-file -e origin/claude/ads-creatividades-publicos:<ruta>   # 25 rutas
BASE=ea6e6677; git rev-list --count $BASE..origin/main   # 0 al cerrar
```

Conectores: Vercel `list_projects` / `list_project_domains` / `list_deployments` (proyecto
`sergiourcullo`, ID [redactado]); Google Calendar `list_events` 11→26-sep y `search_events`;
Notion `search` + `fetch` de la Biblioteca; Meta Ads `ads_get_ad_accounts`; Higgsfield
`tiktok_accounts`. Gmail `search_threads` falló.
