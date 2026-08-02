# Publicación de contenido: open source vs construirlo — costos reales (2026-08-01)

> Sergio: *"busca sistemas open source o nosotros los construimos para usarlos y dime costos."*
> Contexto: la investigación de la granja de contenido cerró en que las herramientas SaaS
> cuestan US$650–950/mes (granja) o US$79/mes (API oficial). Esta es la alternativa self-hosted.

---

## 1. El hallazgo que vale más que cualquier herramienta

**El bloqueo S6 ("falta token IG para publicar") NO existe para las cuentas propias de Onia.**

La documentación oficial de Meta es explícita: con **Standard Access** se puede publicar
**hoy mismo**, sin App Review y sin verificación de negocio, en cuentas de Instagram y Páginas
de Facebook **que administra tu propio negocio**, más hasta 25 cuentas agregadas como *testers*
([Access Levels](https://developers.facebook.com/docs/graph-api/overview/access-levels),
[Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing)).

El App Review de ~20 días y la verificación de negocio son obligatorios **solo para publicar en
cuentas de clientes externos** — algo que Onia no necesita hoy y que está gateado por la regla
"nunca agencia-para-terceros antes de validar la plataforma".

**Traducción:** la cuenta de Onia y la de Lucía pueden estar publicando por API esta semana.
Los requisitos son cuenta Instagram Business o Creator, y una app propia en Meta Developer.
Hay incluso un camino nuevo (Instagram Login con `instagram_business_content_publish`) que
**ni siquiera exige Página de Facebook vinculada**.

Esto se venía tratando como bloqueo de semanas en `ONIA_AI_INFLUENCERS_ACCOUNT_OPS_2026.md`
y en el plan de Arthur (G2). **Hay que corregirlo: para cuentas propias es trabajo de horas.**

---

## 2. Qué se puede publicar hoy y qué requiere trámite

| Plataforma | Publicación automática hoy | Trámite pendiente | Límite |
|---|---|---|---|
| **Instagram** (cuenta propia) | ✅ **Sí, sin trámite** | — | 100 posts/24h · 50 carruseles/24h · soporta Reels, Stories y carruseles |
| **Facebook Page** (propia) | ✅ **Sí, sin trámite** | — | Rate limit general de Graph API |
| **YouTube** (canal propio) | ✅ **Sí, sin trámite** | — | **Hasta 100 subidas/día gratis** (mejoró el 4-dic-2025: antes ~6/día) |
| **TikTok** — borrador al inbox | ✅ Sí, sin trámite | — | Llega como borrador; se publica con un tap desde el celular |
| **TikTok** — post público directo | ❌ No | Auditoría de cliente, "semanas", gratis | Sin auditoría todo sale **privado** (`SELF_ONLY`) |
| **LinkedIn** — perfil personal | ✅ Sí, autoservicio | — | — |
| **LinkedIn** — Página de empresa | ❌ No | Marketing Developer Platform: partnership discrecional, reportes de 3-6 meses | No vale la pena perseguirlo |

**Las cuatro APIs son gratis.** No hay costo por llamada en ninguna. Lo único que cuesta es
tiempo de trámite, y solo para los casos que Onia no necesita ahora.

---

## 3. Las opciones open source

| Herramienta | Licencia | Redes | Veredicto |
|---|---|---|---|
| **Postiz** | **AGPL-3.0 real**, sin funciones pagas ocultas | 30+ (IG, TikTok, YT, FB, LinkedIn, X…) | ✅ La mejor del rubro. 34k estrellas, release v2.22.1 del 23-jul-2026 |
| **Mixpost Lite** | MIT | **Solo Facebook, X y Mastodon** | ❌ Sin Instagram ni TikTok en la versión gratis. El Pro son US$299 y no es open source |
| **Socioboard** | No verificable | No verificado | ❌ Último commit sep-2025, solo bumps de dependencias |
| **Bulkit.dev** | Apache 2.0 | Varias | ❌ **Archivado** por su autor en abril 2026 |
| **Ayrshare** | Propietaria | 13 | ❌ Es SaaS de pago, no self-hosted |

**Postiz es la única opción open source seria.** Pero tiene un costo que no es dinero: su stack
son PostgreSQL + Redis + **Temporal + Elasticsearch**, y la documentación recomienda **4-6 GB
de RAM dedicados**.

---

## 4. El estado real del VPS (medido hoy, no estimado)

| Recurso | Estado |
|---|---|
| Costo | **US$21/mes** (Hostinger) — ya pagado, sin costo marginal por instalar |
| RAM | 15 GB · 5,7 GB en uso · **swap usado 4,4 de 8 GB (55%)** |
| Disco | 193 GB · 89 GB libres |
| Carga | 1,05 sobre 4 cores — CPU tranquila |
| Contenedores | **43 corriendo** |

**El swap al 55% es la señal que importa:** el sistema ya movió memoria a disco. Sumar
Elasticsearch + Temporal ahí es pedir problemas.

**Margen gratis disponible:** el stack `dentalgest-staging-supabase` son 12 contenedores
(kong 313 MB, studio 136 MB, storage 113 MB, db 83 MB, meta 75 MB y más) que suman
**cerca de 1 GB**. Si staging no se usa, apagarlo libera más RAM de la que consumiría
cualquier cosa que instalemos. Es la optimización más barata que existe: cero pesos, un comando.

---

## 5. Lo que YA está construido (y por eso Postiz duplicaría trabajo)

Antes de instalar nada, esto ya existe en el repo y en el VPS:

| Pieza | Dónde | Estado |
|---|---|---|
| **Estudio de Contenido** con cola y aprobación | `onia-center/components/views/estudio/` (`EstudioView.tsx`, `GuionesPanel.tsx`) | Construido |
| **n8n** corriendo | VPS, 402 MB de RAM | Vivo, 11 workflows |
| Workflow de referencia de publicación | n8n: *"Generate AI Viral Videos with VEO 3 and Upload to TikTok"* | Ya existe el patrón |
| Motor de video por código | HyperFrames + `editor-videos` | Probado |
| Atribución por `?src=` | Landing + Cal.com | Pendiente de cablear (media hora) |

**Postiz traería su propio calendario y su propia cola de aprobación — que es exactamente lo
que el Estudio ya hace.** Instalarlo significa mantener dos colas y decidir cuál manda.

---

## 6. Los costos, comparados

| Opción | Costo mensual | RAM extra | Horas de setup | Qué obtenés |
|---|---:|---|---:|---|
| **A. SaaS** (SocialBu Growth, 20 cuentas) | **US$79** = Bs ~960 | 0 | 1 h | Todo listo, sin mantenimiento |
| **B. Postiz self-hosted** | **US$0** | **+4-6 GB** ⚠️ (obliga a apagar staging, o a subir de plan el VPS: +US$20-30/mes) | 2-4 h | UI completa, 30+ redes |
| **C. n8n + Graph API** (lo que ya corre) | **US$0** | **~0** | 4-8 h | Publicación IG/FB/YT desde el Estudio que ya existe |
| **D. Granja multi-cuenta** (comparación) | US$650-950 | — | 23-47 h/**semana** | Descartada — ver investigación aparte |

**El ahorro de C contra A es de Bs ~11.500 al año.** Contra la granja, es de Bs ~115.000 al año.

---

## 7. Recomendación

**Opción C: n8n + Graph API, publicando desde el Estudio que ya existe.** No instalar Postiz
todavía.

Por qué, en orden de peso:

1. **Destraba lo urgente sin pedir nada a nadie.** Instagram, Facebook y YouTube propios
   publican hoy con Standard Access. Ese era el bloqueo que tenía a Lucía y a la cuenta de
   Onia en cola desde hace semanas.
2. **Cero RAM nueva** en un VPS con el swap al 55%. n8n ya corre y ya hace HTTP requests.
3. **No duplica la cola de aprobación** que el Estudio ya implementa — y la aprobación de
   Sergio antes de publicar es regla vigente, no un detalle.
4. **TikTok arranca en modo borrador**: el video llega al inbox del celular y se publica con un
   tap. Cubre el 100% del caso mientras corre la auditoría, que es gratis y se puede tramitar en
   paralelo.

**Cuándo sí instalar Postiz:** si se necesitan más de tres redes con calendario visual propio,
o si el Estudio se queda corto. Para entonces el VPS debería tener staging apagado. La decisión
se puede tomar después sin perder nada — n8n y Postiz no son excluyentes.

**Lo que NO vale la pena perseguir:** el acceso de LinkedIn para Páginas de empresa (partnership
discrecional, meses, sin garantía) y el App Review de Meta (solo sirve para publicar en cuentas
de clientes, que está gateado por la regla de la habitación #1).

### Orden de trabajo sugerido

| # | Tarea | Costo | Tiempo |
|---|---|---|---|
| 1 | Verificar si `dentalgest-staging-supabase` se usa; si no, apagarlo | Bs 0 | 10 min |
| 2 | Crear app en Meta Developer + cuenta IG como Business, sacar token de página larga | Bs 0 | 1-2 h |
| 3 | Workflow n8n: Estudio (aprobado) → Graph API → publica en IG/FB | Bs 0 | 3-4 h |
| 4 | Links `?src=` por pieza para atribución (ya pendiente del plan de Arthur) | Bs 0 | 30 min |
| 5 | Tramitar auditoría de TikTok en paralelo; mientras, borrador al inbox | Bs 0 | trámite |
| 6 | Corregir los docs que dan S6 por bloqueante para cuentas propias | Bs 0 | 15 min |

**Costo total del plan: Bs 0.** Todo corre en infraestructura ya pagada y APIs gratis.

---

Relacionado: `ONIA_GRANJA_CONTENIDO_MULTICUENTA_INVESTIGACION_20260801.md` (por qué no la granja) ·
`ONIA_ARTHUR_CARRIL_CONTENIDO_Y_PAGO_20260801.md` §G2 (el bloqueo S6 que esto corrige) ·
`ONIA_AI_INFLUENCERS_ACCOUNT_OPS_2026.md` (operación de cuentas y etiqueta de IA) ·
`ONIA_SELF_HOSTED_STACK_RUNBOOK_2026.md` (estado del VPS).
