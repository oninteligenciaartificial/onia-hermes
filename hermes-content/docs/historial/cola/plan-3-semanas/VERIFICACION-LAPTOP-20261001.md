# Verificación desde la laptop · 1-oct-2026

Responde a `PEDIDO-LAPTOP-20261001.md`. Todo consultado el **1-oct-2026** desde la PC de Sergio Urcullo.
Sin publicar, sin gastar créditos, sin escribirle a nadie. Este archivo no edita guiones: dice qué frase cambia
y la integra la sesión de la nube.

| # | Ítem | Veredicto | Toca guion |
|---|---|---|---|
| 1 | Precios de WhatsApp (D02-B) | Confirmado (a, b, c) | D02-B queda igual |
| 1 | Ventana gratis de anuncios (S2-D08-C) | **Refutado: 72 h ya no figura; Meta dice «hasta 7 días»** | **S2-D08-C cambia** (y el drop 4) |
| 2 | OpenAI DevDay 29-sep | Confirmado, GPT-6.1 Sol incluido | Guion nuevo abajo |
| 3 | `sergiourcullo.vercel.app` | Las 4 guías vivas (200) | **La web** todavía dice «3 subagentes» |
| 4 | gitdiagram | Confirmado: genera el diagrama y el clic abre el archivo | R01 queda igual |
| 5 | Memoria: 424 commits | Confirmado, la cifra está | D05-A queda igual |
| 6 | n8n activos | Filtro OK: **38 activos de 96** hoy | D05-C queda igual (ojo con el número en pantalla) |

---

## 1. Precios de WhatsApp de Meta

**Fuentes** (abiertas en el navegador integrado, en español y en inglés; las dos páginas dicen *Updated: Sep 28, 2026*):
- https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing
- https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages

> ⚠️ **No te fíes de WebFetch para esta página.** Devolvió una versión vieja («All non-template messages are free»
> y «72 hours»). La página renderizada en el navegador dice otra cosa. Lo que sigue es lo renderizado.

### (a) Desde el 1-oct los mensajes de servicio se cobran por mensaje — CONFIRMADO

> «Effective October 1, 2026 – Meta will charge on a per-message basis for service messages.»
> (pricing, sección *2. Service rates, effective October 1, 2026*)

> «Effective October 1, 2026 - Meta will charge on a per-message basis for all service messages, consistent with how
> Meta charges for template messages. These messages have not been charged since November 1, 2024.» (non-template-messages)

### (b) A la tarifa de utilidad — CONFIRMADO

> «As announced July 1, 2026, rates for service messages will be the same as those of utility and authentication, by market.»

### (c) 1.000 gratis por mes por número — CONFIRMADO

> «Each business phone number has one shared free tier of 1,000 delivered service messages per month.»
> «Unused service messages in the free tier do not roll over.»

**D02-B queda igual.** Las tres afirmaciones están literalmente en la página. Lo que la página agrega y el guion no
necesita decir (sirve para el drop 2):
- Desde el 1-oct también se cobran las **plantillas de utilidad que se mandan como respuesta** dentro de las 24 h
  («Charging for utility messages in response to users… which have not been charged since July 1, 2025»).
- Las **reacciones** siguen gratis y no descuentan de los 1.000.
- Sin método de pago cargado, Meta entrega los 1.000 gratis y **después deja de entregar** los mensajes de servicio.
- El paso 3 del guion se sostiene: en la hoja de tarifas, **Bolivia figura dentro de «Rest of Latin America»**, y no
  está entre los 9 mercados que pasan a tener tarifa propia el 1-oct (Bangladés, Irak, Nepal, Sri Lanka, Kazajistán,
  Kuwait, Marruecos, Omán, Ucrania).

### Ventana gratis de anuncios Click-to-WhatsApp (S2-D08-C) — REFUTADO: ya no son 72 h

Página de pricing, sección *Free entry point windows (FEP)*:

> «If a WhatsApp user messages you via a Click to WhatsApp ad using a device running our Android or iOS app
> (our web and desktop apps are not supported)…»
> «FEP windows may remain open for up to 7 days. While open, you can send any type of message to the user at no charge.»

Y arriba de todo: «Free entry point window - All messages are free within the free entry point window that may
extend up to 7 days.» La página en español dice lo mismo («pueden permanecer abiertos hasta 7 días»). La página de
non-template-messages confirma que sigue vigente desde el 1-oct: «The free entry point window is unchanged for
message delivery».

Captura de la sección: guardada fuera del repo (resultados de herramienta de la sesión madre).

**Frases exactas de S2-D08-C que hay que cambiar:**

| Hoy dice | Cambiar por |
|---|---|
| «Pero hay una puerta por donde no se paga nada durante tres días.» | «Pero hay una puerta por donde no se paga nada hasta por siete días.» |
| «…y le contestás dentro de las veinticuatro horas, durante setenta y dos horas no se te cobra ningún mensaje.» | «…y le contestás dentro de las veinticuatro horas, se abre una ventana de hasta siete días en la que no se te cobra ningún mensaje.» |
| «Contá cuántos mensajes le mandás a un cliente nuevo en sus primeros tres días.» | «Contá cuántos mensajes le mandás a un cliente nuevo en su primera semana.» |
| (falta) | Tercera condición, si entra: «Y tiene que escribirte desde la app del celular: desde la computadora no cuenta.» |
| Línea **Demuestra:** «la regla de las setenta y dos horas» | «la ventana de hasta siete días» |

El **drop 4** («ya trae la línea de las 72 h») también hay que corregirlo. Es «hasta 7 días», no 7 días fijos: no
prometer una semana entera.

---

## 2. OpenAI DevDay 29-sep-2026

**Fuentes primarias** (navegador integrado, 1-oct-2026):
- Resumen oficial: https://openai.com/index/devday-2026-recap/ (fechado 29 de septiembre de 2026; «más de 20 anuncios»)
- https://openai.com/index/introducing-gpt-6-1-sol/ (29-sep-2026)
- Precios API: https://developers.openai.com/api/docs/pricing
- Caché: https://developers.openai.com/api/docs/guides/prompt-caching
- Changelog oficial (developers.openai.com/codex/changelog redirige a https://learn.chatgpt.com/docs/changelog):
  entrada 2026-09-29 «GPT-6.1 Sol in Codex and ChatGPT Work… Use gpt-6.1-sol».

**«GPT-6.1 Sol»: CONFIRMADO.** El anuncio oficial dice que es una mejora de GPT-6 Sol que acerca su rendimiento al
de Astra «por una quinta parte de las tarifas estándar de Astra para tokens de entrada y salida». En la API se llama
`gpt-6.1-sol`. Precios: 2 USD por millón de tokens de entrada, 0,10 de entrada en caché y 10 de salida. En la tabla
de precios, Astra figura con 10 / 1 / 50 y la escritura en caché de 6.1 Sol con 2,50. Está en ChatGPT Work y Codex
para Plus, Pro, Business, Enterprise y Edu; el anuncio aclara que «aún no están disponibles en Chat».

**Elegido para el público (construir/vender con IA):** el precio de GPT-6.1 Sol y la caché. Se ve en pantalla, se
calcula y se aplica hoy. **Descartados:** los dots (solo Pro, Business Premium y Enterprise), la API de decisiones
(vista previa con acceso limitado), Ultrafast (plan de 500 USD) y Private Intelligence (empresas). La «CLI de Codex
renovada» (chat de voz, vista `/agents`, worktrees nativos) le serviría al público, pero hoy **no encontré el comando
`/agents` en la referencia oficial de comandos** (learn.chatgpt.com/docs/developer-commands) ni en las notas de
release de `openai/codex`. Solo aparece en el resumen. No escribí ese guion; queda pendiente hasta que la doc lo traiga.

### DD-A · Vertical · El modelo nuevo de OpenAI cuesta un quinto, y una parte sale casi gratis
**Fórmula:** dato + cuenta · **Pilar:** construir · **Destino:** comunidad de WhatsApp (falta escribir el drop: tabla Sol vs Astra y la cuenta de caché)
**Evidencia:** openai.com/index/introducing-gpt-6-1-sol/ · developers.openai.com/api/docs/pricing · developers.openai.com/api/docs/guides/prompt-caching

OpenAI sacó un modelo que, según su anuncio, se acerca a su mejor modelo por la quinta parte del precio. Y una parte sale casi gratis.

Se llama GPT seis punto uno Sol. Lo presentaron el veintinueve de septiembre, en su DevDay.

En la página de precios, lo que ves en pantalla: dos dólares el millón de tokens que entran y diez los que salen. El grande, Astra, cobra diez y cincuenta. Un quinto.

Lo que casi nadie aprovecha: lo que entra desde la caché cuesta diez centavos el millón. Es lo que repetís igual al principio de cada pedido: las instrucciones de tu agente, tu lista de precios. Ponelo primero y no lo toques. La primera vez cuesta un poco más; después, veinte veces menos. Tiene que pasar de mil veinticuatro tokens.

Cómo sabés que funcionó: la respuesta de la API trae cuántos tokens salieron de caché. Si dice cero, cambiaste algo del principio.

La cuenta para tu agente está en la comunidad.

*(164 palabras.)* Cómo se respalda cada dato:
- «Quinta parte»: palabras del anuncio, y la cuenta coincide (2 contra 10 de entrada; 10 contra 50 de salida).
- «Veinte veces menos»: 0,10 contra 2,00.
- «La primera vez cuesta un poco más»: la escritura en caché cuesta 2,50 contra 2,00. La guía aclara que no es un
  cargo adicional: el token se cobra a una sola de las tres tarifas.
- «Mil veinticuatro tokens»: «The minimum cacheable prompt length is 1,024 tokens for GPT-5.6 and later».
- «Al principio»: «the unchanged tokens at the beginning of a prompt».
- «La respuesta trae los tokens de caché»: la guía muestra «Reported cached tokens» en el uso de la respuesta.

---

## 3. `sergiourcullo.vercel.app`

Consultado con `curl -sL`, 1-oct-2026:

| Ruta | HTTP | `<title>` |
|---|---|---|
| `/` | 200 | Sergio Urcullo — automatización para negocios bolivianos |
| `/claude-code` | 200 | Claude Code, de cero — Sergio Urcullo |
| `/stack` | 200 | El stack de $200 — Sergio Urcullo |
| `/vps` | 200 | Qué es un VPS — Sergio Urcullo |
| `/homelab` | 200 | El homelab — Sergio Urcullo |

**Los cuatro cierres existen**, así que los guiones que cierran ahí no cambian.

**`/claude-code` todavía dice «3 subagentes».** Bloque «Mi caso, con números»:

> «4 hooks que se disparan solos · 3 subagentes con su tarea · 6 conectores hacia afuera · 4 trabajos por horario.»

Lo que hay que corregir es **la web**, no un guion: debería decir «1 subagente». La regla de la memoria
`web-personal-buzon-no-es-fuente` dice que se edita en el espejo antes de publicar. No lo toqué.

---

## 4. gitdiagram.com/harry0703/MoneyPrinterTurbo

Abierto en el navegador integrado el 1-oct-2026. La URL queda en minúsculas: `gitdiagram.com/harry0703/moneyprinterturbo`.

- **Genera el diagrama: CONFIRMADO.** Salió al instante, sin esperar generación. Muestra «User interfaces» (Streamlit UI
  `Main.py`, API router `router.py`, CLI `cli.py`), «Task system» (Generation task `task.py`, Task scheduler, colas
  Redis y en memoria) y «Creative workflow» (video, footage, subtítulos, voz, música, guion).
- **Clic en un componente abre su archivo: CONFIRMADO.** Hice clic en «Generation task [task.py]» y la misma pestaña
  fue a `github.com/harry0703/moneyprinterturbo/blob/main/app/services/task.py`. El SVG tiene 45 enlaces, cada uno a
  su archivo en GitHub.
- La barra superior muestra «API Key» y «Private Repos», lo que encaja con el aviso del guion sobre repos privados.
- Capturas (diagrama y el archivo abierto): guardadas fuera del repo (resultados de herramienta de la sesión madre).

**R01 queda igual.**

---

## 5. Memoria local: el caso de los 424 commits

Archivo: `C:/Users/PC/.claude/projects/C--dev-proyectos-onia-hermes/memory/git-en-worktree-usar-git-C.md`,
línea 15. **La cifra está:**

> «Un `git reset --hard origin/main` pensado para el worktree `integracion-main` movió la rama de contenido
> 424 commits»

El contexto también respalda lo demás del guion. Fue el 2026-09-01. El shell volvió solo al repo raíz («Shell cwd
was reset»). Se recuperó por reflog. Y «el destrozo fue silencioso: ningún comando falló».

**D05-A queda igual**, con la cifra.

---

## 6. n8n: workflows activos (solo lectura)

- Antes de entrar, `pgrep -af "[n]pm install|[n]ext build"` en el VPS dio vacío: no había otro dueño de infra.
- Key `N8N_MANAGEMENT_API_KEY` leída de `/opt/onia-platform/app.env` sin imprimirla. Tiene forma de JWT.
- `GET /api/v1/workflows?active=true&limit=250` → **HTTP 200, 38 workflows**, todos con `active: true`, sin
  `nextCursor` (no hay más páginas).
- Para contrastar, `GET /api/v1/workflows?limit=250` → **96 en total, 38 activos**. Los dos números coinciden.

**El filtro por activos funciona y muestra solo los activos.** Lo verifiqué por la API. La pantalla de n8n pide
login y no la abrí.

**D05-C queda igual** como historia: 136, «quedan 2» y 44 activos fueron los números del 20-ago. **El cuidado está en
la grabación:** hoy el filtro en pantalla va a mostrar **38**, no 44. Que el número en pantalla no se presente como
el de aquel día. Si se quiere usar a favor de la regla del guion, una línea posible: «Hoy, contadas de nuevo, son
treinta y ocho».
