# Administración de cuentas de influencers AI — ONIA (2026)

Cómo operamos las cuentas de las modelos AI (Lucía, Mara, futuras) de forma **escalable,
legítima y sin riesgo de baneo**. Fuente para todo el equipo. Aplica a cada modelo nueva.

## Principio rector: NO granja de celulares

Una **granja de celulares** (phone farm: N teléfonos físicos, apps que simulan toques,
números descartables masivos) es el enfoque **black-hat de spam / engagement falso**. Meta lo
detecta (device fingerprint, IP, patrón de comportamiento) y **banea en masa**. Es caro,
frágil e **innecesario** para lo nuestro.

Nuestras modelos son **influencers AI ficticias y ETIQUETADAS como IA** (como Aitana, Lil
Miquela o la propia @soy_aria_cruz). Eso es permitido. La operación diaria se hace por **API
oficial + Meta Business Manager**, desde el servidor — no tocando teléfonos.

El teléfono solo se usa **una vez**, para la verificación SMS inicial de cada cuenta.

## Arquitectura (4 capas)

### 1. Identidad digital por modelo (setup único)
Cada modelo tiene su propia identidad, separada de las demás:
- **1 email dedicado.** SÍ, uno por modelo (separa recuperación, login e identidad).
  Recomendado: Google Workspace bajo dominio propio (ej. `lucia@<dominio-modelos>`) para
  control centralizado y aspecto profesional. Gmail gratis también sirve para arrancar.
- **1 número de teléfono para verificación** (ver "cuello de botella" abajo).
- **Perfil coherente:** nombre completo real-looking (ej. *Lucía Belén Antelo Justiniano*),
  bio, foto, y **etiqueta "creado con IA"** (obligatorio Meta + es parte de la marca híbrida).

### 2. Estructura Meta centralizada (setup único)
- **1 solo Meta Business Manager de ONIA** agrupa TODAS las cuentas (ya existe: cuenta de ads
  `act_1073680778314945`, app Marketing API `1562215408796050`).
- Por modelo: **cuenta IG Professional (Business/Creator)** ↔ vinculada a una **Página de
  Facebook** propia ↔ dentro del Business Manager de ONIA.
- Resultado: administrás N cuentas desde **un panel**, sin N teléfonos ni N logins manuales.

### 3. Publicación programática (reemplaza la granja)
- **Instagram Graph API**, permiso `instagram_business_content_publish` (app de ONIA; la app
  Marketing API existente se puede extender o crear una de content publishing).
- **n8n** (carril infra) orquesta: **cola de aprobación (OK de Sergio) → API publish**.
  Soporta Reels 9:16, 5-90s, H.264. Límite 100 posts/24h por cuenta (de sobra).
- Cero teléfonos, cero apps de automatización de granja, cero riesgo de fingerprint.
- Requiere: cuenta Business + Página FB + token (bloqueo **S6**) + app review del permiso.

### 4. Cumplimiento / anti-ban
- **Etiqueta "AI" en perfil y posts** — Meta la exige para contenido foto-realista generado por
  IA (enforced 2026). Para nosotros es coherente con "soy IA y lo muestro". Evita baneos.
- **Warm-up** de cuentas nuevas: no publicar 20 posts el día 1 por API; subir de a poco las
  primeras 2-3 semanas.
- **Sin fake engagement**: nada de comprar seguidores/comentarios/bots — ESO sí banea.
- **Sin impersonar a una persona real**: Lucía es sintética original, no un deepfake de alguien.
- Gestión estable vía Business Manager (no rotar IPs/logins raros).

## El cuello de botella real: los NÚMEROS de teléfono
IG pide verificación SMS al crear/asegurar la cuenta. Opciones y trade-offs:

| Opción | Robustez | Costo | Veredicto |
|---|---|---|---|
| **A. Número real dedicado (eSIM o SIM prepago) por modelo** | Alta (IG no lo bloquea, sirve para re-verificar) | Bajo a esta escala | **Recomendado para las modelos principales** |
| B. Servicio SMS online (número virtual de un solo uso) | Baja (IG rechaza muchos VoIP; no sirve a futuro) | Muy bajo | Solo como último recurso / escala grande |
| C. Un número real que verifica varias | Media, pero compartir número entre "personas distintas" es señal de red | — | Evitar para las cuentas principales |

**Para 2-5 modelos:** número real dedicado por modelo. Es barato y robusto. No hace falta
granja: un chip/eSIM por modelo, verificás una vez, y después todo es por API.

## Lo que NO se necesita
- ❌ Granja de celulares (phone farm).
- ❌ Un celular físico por cuenta para el día a día (la operación es por API/Business Manager).
- ❌ Apps tipo "bot de Instagram" que simulan toques (alto riesgo de ban).
- ❌ Comprar seguidores/engagement.

## Escalabilidad
- **2-5 modelos:** trivial con este esquema (emails gratis/baratos, 1 número c/u, Business
  Manager, API). 
- **10+ modelos:** se agrega gestión de un pool de eSIM para las verificaciones, pero el core
  (API + Business Manager + n8n) **no cambia**. Nunca granja física.

## Costos aproximados
- Emails: $0 (Gmail) o ~$6/mes/usuario (Workspace con dominio propio).
- Números: costo de eSIM/prepago por modelo (setup único + mantenimiento mínimo).
- Business Manager + Graph API: $0.
- Publicación/orquestación: infra que ya tenemos (n8n en el VPS).

## Conexión con infra existente (ONIA)
- Business Manager + app Marketing API + pixel ya existen (ver memoria Meta Ads engine).
- **Verificación de negocio Meta EN PAUSA esperando SEPREC/NIT** — cuando salga, desbloquea
  funciones y da confianza a las cuentas (menos fricción de verificación).
- **Token IG = bloqueo S6** (pendiente) para publicar por API.
- Carril **infra (n8n)** ya publica en otras automatizaciones → se agrega el flujo de content
  publishing con cola de aprobación.
- Regla dura: **nada se publica sin OK de Sergio** (cola de aprobación en ONIA Center / n8n).

## Decisiones pendientes de Sergio
1. **¿Cuántas modelos activamos ahora?** (Lucía sola, o Lucía + Mara + más) → define cuántos números.
2. **Emails:** ¿Gmail gratis por modelo, o Google Workspace con dominio propio (~$6/mes c/u, más pro y centralizado)?
3. **Números:** ¿eSIM/prepago real por modelo (recomendado), o probamos un servicio SMS virtual primero?
4. **Handle/nombre de Lucía** confirmados (`@lu.antelo` / *Lucía Belén Antelo Justiniano*) para arrancar el setup de la 1ª cuenta.
