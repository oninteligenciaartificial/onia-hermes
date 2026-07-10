# Administración de cuentas de influencers AI — ONIA (2026)

Cómo operamos las cuentas de las modelos AI (Lucía, y **un roster de muchas más** por venir)
de forma **escalable, legítima y sin baneo**. Fuente para todo el equipo. Aplica a cada modelo.

## Principio rector: NO granja de celulares (pero SÍ SIM bank)

Una **granja de celulares de engagement** (N teléfonos + apps que simulan toques + likes/follows
falsos) es black-hat: Meta la detecta y **banea en masa**. Eso NO lo hacemos.

PERO lo que viste — "varios dispositivos manejados desde una computadora" — tiene una versión
**profesional y legítima**: un **SIM bank / GSM modem pool**. Es hardware de telecom que aloja
decenas o cientos de SIMs (sin celulares) y **recibe los SMS de verificación (OTP) de todos
los números desde un solo dashboard**. Se usa legítimamente para OTP/alertas. Esa es la pieza
que reemplaza "muchos celulares" cuando escalemos el roster.

Regla de oro: **el SIM bank es solo para recibir el OTP de alta (una vez por cuenta). La
operación diaria —publicar— es 100% por API oficial**, nunca simulando toques en la app.

## Arquitectura (4 capas)

### 1. Identidad digital por modelo
- **Email:** ver "Email a escala" abajo. Resumen: para el roster, **dominio propio + catch-all**
  (no Gmail individual).
- **Número de teléfono:** non-VoIP real (ver "Números a escala"). VoIP está **muerto** para IG.
- **Perfil coherente:** nombre completo real-looking (ej. *Lucía Belén Antelo Justiniano*),
  bio, foto y **etiqueta "creado con IA"** (obligatorio Meta + parte de la marca híbrida).

### 2. Estructura Meta centralizada
- **1 solo Meta Business Manager de ONIA** agrupa TODAS las cuentas (ya existe: ads
  `act_1073680778314945`, app `1562215408796050`).
- Por modelo: **cuenta IG Professional (Business/Creator)** ↔ **Página de Facebook** ↔ dentro
  del Business Manager. Administrás N cuentas desde un panel, sin N teléfonos.

### 3. Publicación programática (reemplaza la granja)
- **Instagram Graph API**, permiso `instagram_business_content_publish`.
- **n8n** (carril infra): cola de aprobación (OK de Sergio) → API publish. Reels 9:16, 5-90s.
  100 posts/24h por cuenta.
- Cero teléfonos, cero apps de granja. Requiere token (bloqueo **S6**) + app review.

### 4. Cumplimiento / anti-ban
- **Etiqueta "AI"** en perfil y posts (Meta la exige, enforced 2026; a nosotros nos conviene).
- **Warm-up** de cuentas nuevas (no 20 posts el día 1).
- **Sin fake engagement**, **sin impersonar personas reales** (Lucía es sintética original).

## Email a escala (respuesta: NO Gmail gratis para masa)

| Opción | Escala | Veredicto |
|---|---|---|
| Gmail gratis, 1 por modelo | Mala: cada uno pide teléfono, Google limita por número/IP y en 2025-26 **bloquea tenants** de creación masiva | Solo para 1-2 cuentas de prueba |
| **Dominio propio + catch-all (Zoho Mail)** | **Excelente:** `lucia@`, `mara@`, `<n>@` **infinitos**, sin verificación por número, catch-all nativo, admin console | **Recomendado para el roster** |
| Google Workspace + routing | Catch-all solo por routing de admin; Google reprime cuentas de envío masivo (riesgo de lockout de todo el tenant) | Evitar para esto |

→ **Montamos un dominio dedicado a las modelos + Zoho Mail con catch-all.** Un email por modelo,
ilimitados, profesionales, controlados desde un panel. Esto se arma **desde ya** para no rehacer.

## Números a escala (el verdadero cuello de botella)

VoIP está bloqueado por IG (80%+ de plataformas lo filtran). Solo sirven **números non-VoIP
carrier-grade**. Opciones:

| Opción | Cómo | Pro / Contra | Cuándo |
|---|---|---|---|
| **SIM bank / GSM modem pool + SIMs prepago reales** | Hardware 8→512 SIMs por USB/Ethernet a 1 PC; software (SMSgate open-source u Ozeki) recibe todos los OTP | ✅ Robusto, re-verificable, barato por número a escala, control total. ❌ Hardware + gestionar SIMs activas | **Roster (muchas modelos)** |
| Servicio non-VoIP OTP (NumberOTP, BloomSMS, TextVerified) | Número por dashboard/API, sin hardware | ✅ Cero hardware, rápido para arrancar. ❌ Número **descartable** (no re-verificable), calidad variable, costo por uso | Pruebas / puente |
| SIM real suelta (eSIM/prepago) | 1 chip por cuenta en un teléfono normal | ✅ Simple para 1-3 cuentas. ❌ No escala (1 cel por SIM) | **Lucía sola, ahora** |

**Celulares físicos a una compu (lo que viste) vs SIM bank:**
- Celulares + USB + software (ADB/scrcpy / "phone farm managers"): 1 cel por número → caro,
  frágil, y si automatiza engagement = señal de granja → ban. Sirve para operar apps a mano.
- **SIM bank (sin celulares) + API para publicar:** más barato por número, escala a cientos,
  más limpio. **Este es el camino.** No necesitás un celular por modelo.

## Escala sin que Meta te marque como "red coordinada" (crítico)

Crear **muchas** influencers AI puede verse como red coordinada si se hace mal. Para escalar sano:
- **Calidad > cantidad:** un roster de influencers de MARCA con contenido y audiencia real, NO
  miles de cuentas vacías (eso es spam y se banea).
- **Independencia por cuenta:** email propio, número propio, identidad y contenido propios.
- **Etiqueta IA en todas** + sin fake engagement + sin cross-spam entre ellas.
- **Business Manager agrupa legítimamente** (una agencia con muchas cuentas es normal).
- **API > 50 logins manuales:** publicar por API es más limpio que operar navegadores; si algún
  día hay gestión manual masiva, recién ahí se evalúan perfiles antidetect (GoLogin/Multilogin).

## Plan por fases

**FASE 1 — Lucía (ahora, 1 modelo):**
- Email: montar ya el **dominio propio + Zoho catch-all** → `lucia@…` (no rehacer después).
- Número: **1 SIM prepago real** (Tigo/Entel/Viva) para verificar. Con una no hace falta SIM bank.
- Cuenta IG Business ↔ Página FB ↔ Business Manager ONIA. Publicación por API (n8n, tras token).

**FASE 2 — Roster (muchas modelos):**
- Email: mismo dominio + catch-all, un alias por modelo (infinito).
- Números: **SIM bank / modem pool** (empezar 8-32 puertos) + lote de SIMs prepago, software
  para recibir OTPs desde un dashboard.
- Gestión: Business Manager + publicación 100% por API. Warm-up y etiqueta IA por cuenta.

## Costos aproximados
- Email: dominio ~$10-15/año + Zoho (plan gratuito para pocos buzones, o ~$1/buzón/mes).
- Números Fase 1: 1 SIM prepago (barato). Fase 2: SIM bank (hardware, cientos de USD según
  puertos) + SIMs prepago (chip + saldo mínimo para mantenerlas activas).
- Business Manager + Graph API + n8n: $0 (infra que ya tenemos).

## Conexión con infra ONIA
- Business Manager + app Marketing API + pixel ya existen (memoria Meta Ads engine).
- **Verificación de negocio Meta EN PAUSA esperando SEPREC/NIT** → al salir, da confianza a las cuentas.
- **Token IG = bloqueo S6** para publicar por API.
- Carril **infra (n8n)** agrega el flujo de content publishing con cola de aprobación.
- Regla dura: **nada se publica sin OK de Sergio**.

## Definiciones tomadas (2026-07-09)
- **Modelos:** arrancamos con Lucía; diseño pensado para **roster grande** desde ya.
- **Email:** **dominio propio + Zoho catch-all** (mejor que Gmail para masa). Se monta ya.
- **Números:** SIM real suelta para Lucía; **SIM bank/modem pool** para el roster (no celulares, no VoIP).
- **Handle/nombre Lucía:** `@lu.antelo` / *Lucía Belén Antelo Justiniano* (pendiente OK final de Sergio).

## Pendiente de decidir/hacer
- Comprar dominio para las modelos (nombre del dominio) — humano/Sergio.
- Fase 2: comprar SIM bank cuando sumemos modelos (gasto → OK de Sergio).
- Conseguir token IG (S6) para encender la publicación por API.
