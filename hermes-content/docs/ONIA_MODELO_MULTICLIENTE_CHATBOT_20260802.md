# Onia — Modelo multi-cliente del chatbot (cómo operamos N clientes)

> Research 2026-08-02 (agente con verificación en el código de Chatwoot,
> tag `v4.12.0` — la versión que corre en nuestro VPS). Responde: ¿podemos
> vender el chatbot a muchos clientes con UNA instalación, sin que cada uno
> pierda su número ni su independencia?
>
> **Estado: research CERRADO en las dos mitades.** Respuesta corta: sí se
> puede, el cliente conserva su número y su app (§5), y una sola instalación
> de Chatwoot opera N clientes (§1) — con la marca blanca como única baja
> (§2).

## 1. Veredicto Chatwoot: sirve, con una excepción

Un solo Chatwoot self-hosted opera N clientes. Multi-cuenta nativo,
aislamiento real, webhooks por cuenta. **Lo único que NO se puede es la marca
blanca.**

| Qué | Estado |
|---|---|
| Varias cuentas aisladas (una por cliente) | ✔ nativo, se crean desde `/super_admin` o por Platform API |
| Límite de cuentas/agentes/inboxes en Community | ✔ **sin límite real** (tope de código 100.000; el techo es el hardware) |
| Aislamiento de datos | ✔ todo scopeado por `account_id`; un agente del cliente solo ve su cuenta |
| Webhooks | ✔ **por cuenta**, y el payload trae `account.id` → nuestro bot sabe de qué cliente es cada mensaje |
| Canales (WhatsApp, IG, web, API) | ✔ todos en Community, no son de pago |
| API y webhooks | ✔ gratis (`api_and_webhooks` no es premium) |
| **Marca blanca** | ✘ ver §2 |
| Roles | ✘ solo `agent` y `administrator` (roles personalizados = pago) |
| Captain AI, SLA, audit logs, SSO, voz | ✘ premium (USD 19/agente/mes) |

Capacidad: los requisitos oficiales miden **conversaciones/día**, no clientes.
4 cores/4 GB cubren 10.000 conv/día. Nuestro VPS aguanta cómodo **8–10
clientes pyme**; el cuello sería convivir con n8n/Postgres/panel, no Chatwoot.

## 2. El hallazgo que cambia el plan: la marca blanca NO es viable

Verificado en el código de la versión que corremos: en plan `community` hay un
**job diario** (`ReconcilePlanConfigService`, encadenado al cron de las 00:00)
que restaura el branding a los valores de Chatwoot y apaga `disable_branding`
en TODAS las cuentas. O sea: si renombramos la instalación a "Onia", en ≤24 h
vuelve a decir "Chatwoot". Además el branding es **installation-wide**: no
existe marca por cliente aunque se pagara.

Y hay un techo aún más duro que nadie esquiva: **la app móvil oficial se llama
"Chatwoot" en las tiendas.** Como el cliente atiende desde el celular (es todo
el punto del producto), su equipo va a ver esa marca sí o sí, salvo compilar
una app propia — lo que exige Firebase y builds propias para iOS y Android.

> ✅ **DECIDIDO POR SERGIO — 2026-08-16: se acepta. Vendemos el agente, no la bandeja.**
> Confirmado contra producción ese mismo día: el rebranding a "Onia" aplicado el 15-ago **ya
> se había revertido solo** (`INSTALLATION_NAME=Chatwoot`, `BRAND_NAME=Chatwoot`). Este doc
> lo había predicho con la causa exacta. **Consecuencia:** no se vuelve a tocar el branding,
> y el kit de venta dice que la bandeja es una herramienta open source de terceros.

**Decisión recomendada: no pelear con esto. Posicionamiento honesto.** Lo que
Onia vende es el **agente** (el bot que califica, agenda y deriva) y la
integración, no la bandeja. La bandeja es "la herramienta profesional que
usamos, open source, y tus datos son tuyos" — que además es un argumento de
venta contra el lock-in. Pagar USD 19/agente/mes por quitar un logo, con el
móvil igual marcado, no tiene retorno.

## 3. Cómo se implementa (decisiones a tomar hoy, no después)

1. **Una cuenta de Chatwoot por cliente**, en nuestra instalación. Su equipo
   entra solo a la suya.
2. **Provisionar SIEMPRE por Platform API, desde el primer cliente.** Trampa
   verificada: la Platform API **no ve** lo creado a mano por la UI; mezclar
   deja objetos invisibles a la automatización y arreglarlo después exige
   consola Rails objeto por objeto. Decisión de día uno.
3. **Bot por cliente vía Agent Bots** (mejor que webhook crudo): se crean por
   cuenta, Chatwoot da un secret para verificar HMAC, y el bot puede pasar la
   conversación de `pending` a `open` — que es exactamente nuestro handoff a
   humano. Se provisionan por API (`POST /platform/api/v1/agent_bots`).
4. **Routing:** URL de webhook distinta por cliente (`/hook/<cliente>`) y
   validar además `account.id` del payload. Descartar el evento si falta
   (hay un bug reportado donde no venía en mensajes solo-media). El endpoint
   único es más cómodo pero un bug de routing cruza datos entre clientes.
5. **Contrato:** el super admin (nosotros) **puede impersonar** al usuario de
   cualquier cuenta — es capacidad real de entrar sin su contraseña. Sirve
   para soporte, pero **tiene que estar declarado en el contrato** antes de
   que lo descubran ellos.

## 4. Cuándo NO alcanza la instancia compartida

Instancia propia para ese cliente si: exige su marca en el dashboard · exige
aislamiento físico de base de datos (el de Chatwoot es lógico: una sola DB,
un Redis, un Sidekiq) · supera ~10.000 conversaciones/día · o hay riesgo real
de que se vaya y haya que exportarle sus datos (sacar una cuenta de una DB
compartida es trabajo manual).

Riesgo operativo a tener presente: **no hay rate limiting por cuenta en
Community** — un cliente con una importación masiva degrada a todos.

## 5. El número del cliente: SÍ lo conserva (coexistencia) — CONFIRMADO

**La respuesta a la pregunta de Sergio es sí.** Existe, es oficial, y el
pitch "tu número, tu app, tus chats — y además un empleado que no duerme" es
literalmente cierto. Meta lo llama *"Onboard WhatsApp Business app users"*;
en soporte y partners se lo conoce como **coexistencia**.

**Qué conserva el cliente:**
- Su número, su app y su forma de trabajar de siempre.
- **Se sincronizan 180 días de historial de chats 1:1 + sus contactos**, y los
  mensajes nuevos van en tiempo real hacia los dos lados: si el dueño contesta
  del celular, el bot lo ve; si contesta el bot, aparece en su app.

**Lo que se apaga en su app** (hay que decírselo ANTES, no después): mensajes
temporales, "ver una vez", ubicación en vivo y **listas de difusión**; y los
clientes de escritorio Windows y WearOS se desvinculan. **Los grupos NO se
sincronizan** (siguen funcionando en su app, pero el bot no los ve), y la
media de más de 14 días no se puede descargar. Las llamadas, el catálogo y
los estados siguen siendo solo de su app.

**Quién es dueño de qué — y esto es argumento de venta, no problema:** desde
octubre 2025 Meta mató el modelo donde la agencia era dueña de la cuenta del
cliente. Hoy **el cliente es dueño de su portfolio y su cuenta de WhatsApp**,
y nosotros entramos como socio con acceso compartido (máximo 2 socios por
cuenta). El cliente incluso puede desconectarnos solo desde su app
(Ajustes → Cuenta → Plataforma de negocios → Desconectar). Se vende así: *"el
número y la cuenta son tuyos; si mañana no te servimos, nos desconectás vos
sin pedirle permiso a nadie"*. Es la única arquitectura soportada y encima es
la que el cliente quiere oír.

**Quién paga qué:** el cliente pone su propia tarjeta en su propia cuenta y le
paga las conversaciones directo a Meta, a tarifa de lista. Nosotros
facturamos software y servicio aparte. Billing separado por diseño, sin que
nos pasen por caja los costos de Meta.

### Lo que tenemos que construir: ser Tech Provider

No hay atajo — **sin nuestro propio Embedded Signup no hay coexistencia**.
La buena noticia: **Tech Provider es auto-servicio**, no hay que entrar a un
programa de partners ni negociar con Meta. Requisitos:

| Gate | Estado |
|---|---|
| Business Verification de la agencia | ✔ **ya aprobada** (31-jul-2026) — era el trámite más lento |
| App de Meta propia con el caso de uso WhatsApp | pendiente |
| App Review con **2 videos** (enviar un mensaje desde la app; crear una plantilla) | pendiente |
| Advanced Access a `whatsapp_business_messaging` y `whatsapp_business_management` | pendiente |
| Embedded Signup **v4** con session logging | pendiente |

**Deadline duro: 15-oct-2026** se depreca Embedded Signup v2 → implementar v4
directo, nunca v2.

**Techo de alta:** 10 clientes nuevos cada 7 días hasta completar los gates;
después sube a 200. Irrelevante a nuestra escala, pero conviene saberlo.

### Trampas confirmadas (presupuestar soporte)

1. **El portfolio dueño de nuestra app NO se puede elegir** en el flujo de
   coexistencia. O sea: nuestro propio número no puede entrar a coexistencia
   con nuestra propia app. No afecta a los clientes (cada uno usa su
   portfolio), pero descarta el dogfooding directo salvo que la app viva en
   un portfolio aparte.
2. **El cliente debe usar la app WhatsApp *Business*** (la de negocios), no el
   WhatsApp normal. Si usa el normal, el paso 0 de la venta es migrarlo
   (gratis, conserva los chats) y dejarlo usar unos días: hay un requisito de
   actividad mínima que Meta no publica en número, pero el error existe
   (`3441045`, "más actividad en la app").
3. **Desconexión automática**: cambio de teléfono, reinstalación de la app o
   re-registro del número **desconectan el bot solos**. Hay webhooks
   (`account_offboarded` / `account_reconnected`) y guía de reconexión — hay
   que implementarlos o cada cliente que cambie de celular queda mudo sin
   avisar. **Esto es costo de soporte real, hay que preciarlo.**
4. **Ventana de 24 h** para sincronizar el historial tras el alta; si se pasa,
   hay que rehacer el flujo completo.
5. Que el dueño conteste desde su celular **no abre** la ventana gratuita de
   24 h del bot: son mundos separados a efectos de facturación.
6. Chatwoot self-hosted soporta Embedded Signup con coexistencia, pero hay
   **discusiones abiertas de fallas específicas del self-hosted** (el popup de
   Meta no abre, error al parear Cloud API) que en Chatwoot Cloud no pasan.
   Presupuestar tiempo de depuración.

### Bolivia: probable, sin confirmar en papel

Meta **no publica lista de países** para coexistencia. Los partners grandes
reportan que a mediados de 2026 la cobertura es global (Nigeria y Sudáfrica
fueron las últimas exclusiones) y un tracker de terceros lista Bolivia como
soportada, pero **ninguna fuente oficial lo dice**.

**La prueba real cuesta 20 minutos** y hay que hacerla antes de prometérselo a
un cliente: correr el Embedded Signup con un +591 real que esté en la app
WhatsApp Business y ver si devuelve `3441042` (región no soportada) o
`3441045` (falta actividad). **Nunca vender coexistencia a un cliente
boliviano sin haber pasado esta prueba.**

## 6. Qué significa para la venta

El chatbot se vende con la promesa correcta: **"tu número, tu app, tus chats
— y un empleado que no duerme"**. No hay que pedirle a nadie que sacrifique
su WhatsApp, que era la objeción que mataba la venta (y la que Sergio mismo
puso cuando le tocó a él).

Orden natural del roadmap: (1) nuestro número por Cloud API directo — funciona
esta semana, sin depender de aprobaciones; (2) Tech Provider + Embedded Signup
v4 — habilita vender a clientes conservando su número; (3) probar coexistencia
con un +591 real; (4) recién ahí prometerlo comercialmente.

Nota: nuestro propio número queda en Cloud API directo (sin app), no en
coexistencia, por la trampa #1 y porque no vamos a esperar semanas de App
Review para encender el bot. Cuando Tech Provider esté aprobado se puede
reevaluar si migrarlo, pero no bloquea nada.
