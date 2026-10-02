# Onia como SaaS real: revisión antes de publicar la 1.0

Para Sergio Urcullo. 29-sep-2026. Revisión **solo de lectura**: no se editó ni se instaló nada, no hubo gasto y no se tocó producción. En producción solo se hicieron lecturas HTTP públicas.

- Candidato app: `C:/dev/proyectos/onia-platform-v1-integracion-20260927` (rama `codex/v1-integracion-20260927`, commit `6656e76c`).
- Candidato web: `C:/dev/proyectos/onia-hermes-v1-remoto-20260928/web-factory/apps/onia-platform` (rama `codex/v1-hermes-20260928`, commit `36be25bb`).
- Core: `C:/dev/proyectos/onia-hermes-v1-remoto-20260928/onia-core`.
- Etiquetas: **MEDIDO** = lo corrí, lo leí o lo vi. **SUPUESTO** = lo deduzco y no lo verifiqué en vivo.

---

## 1. En 8 líneas

1. Onia ya se comporta como SaaS: te registrás solo en 2 clics sin tarjeta, tenés 14 días de prueba, onboarding de 4 pasos, planes con precio público y el core validado (521/521 tests del core, 986/986 tests de integración en la app).
2. Donde más se nota que no está terminado es al **pagar**. El QR es estático, el comprobante se sube a mano y alguien tiene que verificarlo. El plan no se activa solo y hay unos 17 clics desde la home.
3. Para **entrar** solo existe correo y contraseña. Google está programado pero apagado en producción. Microsoft, Apple y SSO corporativo no existen (MEDIDO en `/supabase/auth/v1/settings`).
4. El **SEO de onia.com.bo** tiene buena base: metadatos, JSON-LD con precios y sitemap. En cambio **app.onia.com.bo** se ofrece a Google como indexable y su robots.txt redirige al login.
5. En la **interfaz** quedan señales de "hecho con IA": orbes de fondo, rayas largas (—) en el copy, íconos de chispitas, grillas de tarjetas iguales, sombras sueltas y "Cargando..." sin skeleton.
6. Las **animaciones** no molestan, pero faltan donde ayudan: no hay confirmación de "guardado", los modales aparecen de golpe y los pasos cambian sin transición. Además son inconsistentes (5 escalas distintas al presionar un botón).
7. El **core** funciona como contrato, pero la lógica está copiada a mano y ya divergió. Sumar un rubro implica tocar 12 a 24 archivos, y el aislamiento entre empresas depende de que cada consulta filtre bien.
8. Nada de esto impide publicar la 1.0 con 5 rubros. Lo que falta para que se sienta un SaaS de verdad es: **cobro automático, entrar con Google/Microsoft y una app que Google no indexe**.

---

## 2. Por frente

### 2.1 Core ("¿funciona para el futuro?")

**Estado.** MEDIDO:
- Los 4 validadores del core dan verde: 21 capacidades, 12 tracks, 4 adapters, 9 módulos, 6 niveles.
- `npm run check:onia-core` da OK y los dos `contract.json` son idénticos.
- La plataforma solo sincroniza los **datos** de los packs (`scripts/sync-onia-core.mjs:1-20`). La lógica está copiada a mano.

| # | Sev | Hallazgo | Evidencia | Arreglo | Esfuerzo |
|---|---|---|---|---|---|
| C1 | ALTO | La lógica del core está copiada a mano y ya divergió | 4 ports vienen de la v0.6.2 (`lib/onia-core/modules/accounting-logic.ts:2` y otros). El core exporta 39 funciones de contabilidad y la plataforma 31: faltan cierre de período, flujo de caja y estado de patrimonio. Hay 8 modelos Prisma de contabilidad formal sin uso. `/contabilidad` arma el balance desde tablas operativas (`lib/fiscal/balance-comprobacion.ts:156-202`) | Elegir UNA fuente para la lógica: o `lib/onia-core/` de la plataforma pasa a ser la viva y el core queda solo como contrato, o la plataforma consume `@onia/core` como paquete. No vender cierre de período ni flujo de caja | S para decidir, M para consumir el paquete |
| C2 | ALTO | Un rubro nuevo es código repartido, no configuración | El id del rubro está escrito a mano en 12 archivos (estética), 18 (servicios) y 24 (eléctrico). La definición vive en 6 lugares (`lib/platform/types.ts:17`, `vertical-pack.ts:579`, `rubros-activos.ts`, `vocabulario.ts`, `agents-por-rubro.ts`, espejo del contrato). El contrato tiene 12 tracks y la plataforma 8 | Un test que falle si un track no está en todos los registros, más la lista real de archivos en `ONIA_RUBRO_COMPLETITUD_CHECKLIST.md`. Un registro único por rubro recién cuando llegue el 6º rubro que pague | S (test + checklist) / L |
| C3 | ALTO | El aislamiento entre empresas depende de la disciplina | 215 archivos consultan Prisma directo y solo 22 usan `tenantWhere` (`lib/onia-core/tenant-guard.ts:21-33`). No hay `$extends`. Solo 9 de 39 migraciones activan RLS. No encontré ningún cruce hoy. SUPUESTO: Prisma entra como el rol `postgres`, que salta RLS (`.claude/skills/onia-db/SKILL.md:26`) | Una extensión Prisma en `lib/prisma.ts` que rechace `findMany/updateMany/deleteMany` sin `organizationId`, con lista blanca para `/api/admin` y los webhooks | M |
| C4 | MEDIO | Si falta `PLATFORM_LAYER`, se apaga la separación por rubro | `.env.example:270` la trae vacía, y en ese caso `lib/platform/api-guard.ts:37` deja pasar todo. Hay 13 archivos que se bifurcan por esta variable. SUPUESTO: en producción vale 1 (`Dockerfile:32`) | Borrar la variable y el camino dental viejo | S |
| C5 | MEDIO | El contrato apunta a repos legados | `contract.json` no menciona `onia-platform` ni una vez. Sus targets son Gestios, DentaGest y Ganaderos-Os | Agregar un adapter `onia-platform` y marcar los legados como `archived` | S-M |
| C6 | MEDIO | `business-tiers.json` es una 5ª lista de precios, y está vieja | Dice 390/890/1.990, mientras `lib/subscription-plans.ts:39-45` dice 320/550/890/1290/2900. La plataforma no la lee | Marcarla como historia. "Adaptarse a la empresa" ya existe: rubro + plan + `OrganizationEntitlement` (`lib/platform/entitlements.ts:40-72`) | S |
| C7 | MEDIO | El modelo de datos base sigue siendo dental | `Invoice.patientId` es obligatorio (`prisma/schema.prisma`). Todos los ajustes cuelgan de `ClinicSettings` (`:1168`). Conviven 2 modelos de factura | No tocar en la 1.0. Es prerequisito para veterinaria y para B2B | L |
| C8 | MEDIO | Archivos gigantes y `node_modules` versionado | 13 archivos pasan las 800 líneas (`agents-runtime.ts` tiene 2.179). Hay 3.501 archivos de `n8n-mcp-server/node_modules` en git | `git rm --cached` más `.gitignore`. Partir archivos solo cuando se toquen | S |
| C9 | BAJO | En CI, el control de desvío no corre | `ci.yml:44-49` usa `--allow-missing-contract` y la comparación se saltea (`sync-onia-core.mjs:304-316`) | Hacer sparse-checkout de `onia-core/` en CI | S |
| C10 | BAJO | Un rubro desconocido cae en el pack dental; la documentación está vieja | `vertical-pack.ts:822-827` solo emite un `console.warn`. La skill dice 352 tests y hoy son 521 | Mandar ese caso a Sentry como error y corregir las cifras | S |

### 2.2 Recorrido del usuario hasta pagar

**Estado (MEDIDO):** home, luego `/register` (el alta está abierta, 2 clics y 4 campos, `SignupForm.tsx:492-547`), luego `/onboarding` de 4 pasos (`alta-negocio.tsx:27`), luego el modal "Primeros pasos", la barra de "prueba: 14 días" y el checkout con QR estático BCP más comprobante (`CheckoutClient.tsx:649-681`, `:350-356`). Son unos **17 clics y 10 campos**, sin contar la app del banco, y la activación es **manual**.

Comparación del 29-sep: Dapta tiene el registro directo en su app. Lety cobra con tarjeta vía Stripe antes del trial. Onia está igual o mejor para crear la cuenta y muy por detrás para pagar.

| # | Sev | Hallazgo | Evidencia | Arreglo | Esfuerzo |
|---|---|---|---|---|---|
| J1 | ALTO | Pagar no activa el plan | `CheckoutClient.tsx:653` dice "No se activa solo". Hay 5 campos más la imagen. La captura `capturas2/a-checkout-375.png` muestra que se pide sacar captura del QR en el mismo celular | Encender el QR dinámico del BCP, que ya está programado (`CheckoutClient.tsx:578-648`, `lib/gateway/bcp-qr.ts:95`). Mientras tanto, dejar 1 campo más el archivo | Horas una vez que haya credenciales; menos de 1 h para el formulario |
| J2 | ALTO | Solo se entra con correo y contraseña | En el HTML de `/login` aparecen 0 "Continuar con Google". El flag está en `lib/auth-providers.ts:19` | Ver 2.3 | Ver 2.3 |
| J3 | ALTO | El plan elegido en la web se pierde | Los 4 botones "Empezar con el X" van a `/register` sin `?plan=` (curl a `/` y `/precios`). El checkout sí lee `?plan=` (`app/checkout/page.tsx:79-81`) | Agregar `?plan=<key>` en la web, guardarlo en el registro y hacer que "Ver mi plan" lleve a `/checkout?plan=` | ~2 h |
| J4 | MEDIO | "Ver mi plan" abre Configuración en la sección Negocio | `BarraEstado.tsx:106` apunta a `/settings`, y "plan" es la 6ª sección (`secciones.ts:60-104`) | Que lleve a `/checkout` o a `/settings#plan` (`SettingsClient.tsx:131` ya lee el hash) | menos de 30 min |
| J5 | MEDIO | Con el QR dinámico encendido, igual se pide el comprobante | La tarjeta de comprobante no tiene condición (`CheckoutClient.tsx:712-867`) aunque en `:641-644` dice "se activa solo" | Mostrarla solo si `!bcpQrDisponible`, con test | ~1 h |
| J6 | MEDIO | Con la sesión vencida, `/checkout` termina en el panel | `lib/web-requests/visual-return.ts:16` solo acepta `/mi-web`, y `:35-38` devuelve `/dashboard` | Lista blanca: `/checkout` (validando `plan` y `cycle`) y `/settings` | ~1 h |
| J7 | MEDIO | La barra "Preguntá por tu negocio" tapa contenido | Capturas `b-dashboard.png`, `b-dashboard-375.png` y `d-pending-375-envio.png`: hay 3 capas fijas a la vez | Reservar espacio al pie, ocultarla en los asistentes paso a paso y colapsarla al hacer scroll | medio día |
| J8 | MEDIO | El titular del pago no dice "Onia" | Figura "Oniaagency De Mercado Moreno Leslie" (`lib/checkout/qr-estatico.ts:34`) y "OniaAgency" (`CheckoutClient.tsx:93`) | Agregar una línea de contexto: "Cuenta de la empresa que opera Onia, NIT ...". El dato bancario no se toca | menos de 1 h |
| J9 | BAJO | No sé si está encendida la confirmación de correo | SUPUESTO. `lib/registration.ts:24-38` requiere dos cambios juntos. GoTrue `/settings` dice `mailer_autoconfirm=false` (MEDIDO en 2.3); falta leer `ONIA_REGISTRO_CONFIRMA_CORREO` en la app | Leer la variable en el VPS | minutos |
| J10 | BAJO | Un comentario dice que el alta está apagada, y está abierta | `SignupForm.tsx:3-6` | Actualizar el comentario | 5 min |

### 2.3 Registro con Google, Microsoft, Apple y correo corporativo

**Estado (MEDIDO en producción):** GoTrue v2.189.0 (`/supabase/auth/v1/health`). En `/settings`: `google:false`, `azure:false`, `apple:false`, `saml_enabled:false`, `phone:true`, `phone_autoconfirm:true`, `sms_provider:""`, `mailer_autoconfirm:false`. `authorize?provider=google` responde 400 "provider is not enabled".

En el código, Google está completo pero apagado: botones en `LoginForm.tsx:255` y `SignupForm.tsx:454`, callback en `app/auth/callback/route.ts:24-51`, alta en `app/api/auth/register/route.ts:161-195` y rescate de `/?code=` en `proxy.ts:42-58`. No hay nada para Microsoft, Apple, SAML ni enlace mágico.

Orden recomendado para el cliente ideal (clínica de 2 a 6 profesionales): **Google, Microsoft (tenant `common`, que también cubre el correo corporativo de M365), enlace mágico, Apple y, al final, SAML.**

| # | Sev | Hallazgo | Evidencia | Arreglo | Esfuerzo |
|---|---|---|---|---|---|
| A1 | ALTO | No hay ningún proveedor social encendido | Ver el estado de arriba | GoTrue: `GOTRUE_EXTERNAL_GOOGLE_ENABLED/_CLIENT_ID/_SECRET/_REDIRECT_URI=https://app.onia.com.bo/supabase/auth/v1/callback`, y agregar `https://app.onia.com.bo/auth/callback**` a `GOTRUE_URI_ALLOW_LIST` (SUPUESTO: hoy falta, por eso existe `proxy.ts:42-58`). App: `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` y rebuild en el VPS con `app.env`. Hacer la QA mirando la pantalla | 0,5 día, más la verificación de marca de Google (días o semanas) |
| A2 | ALTO | El flujo OAuth está atado a Google | `provider:'google'` fijo en `LoginForm.tsx:173` y `SignupForm.tsx:201`. `from=google` en `callback/route.ts:45,51` y en `proxy.ts:112-113`. Hay mensajes de "Google" en `register/route.ts:171,178` | Crear `NEXT_PUBLIC_AUTH_PROVIDERS=google,azure,apple` con un componente de botones y parámetros neutros (`from=oauth`, `error=oauth_failed`) | 1 día con tests |
| A3 | ALTO | Quien abandona el alta OAuth queda como usuario huérfano | `disable_signup=false`. La org se crea recién al completar el formulario (`register/route.ts:33-57`). La limpieza no cubre OAuth (`:195`, `:405-415`) | Ocultar los botones OAuth si `altaAutomaticaAbierta()` es false, y un barrido de `auth.users` sin Profile de más de N días | 0,5 día |
| A4 | MEDIO | El proveedor phone está encendido, con autoconfirmación y sin SMS | `/settings`. SUPUESTO, no lo probé: un POST público a `/signup` con teléfono crea un usuario ya confirmado, sin honeypot ni rate limit | `GOTRUE_EXTERNAL_PHONE_ENABLED=false`, recrear el contenedor y volver a medir | 15 min |
| A5 | MEDIO | Microsoft (Entra) | `azure:false` y `authorize` da 400 | Crear una app multitenant en Entra con el redirect de arriba, configurar `GOTRUE_EXTERNAL_AZURE_*` y los claims `xms_edov` y `email`. SUPUESTO: el secret vence, hay que anotar cuándo rotarlo | 0,5 día más A2 |
| A6 | MEDIO | Apple no rinde para la 1.0 | Cuesta USD 99 al año, el titular debe ser mayor de edad, hay que rotar la clave cada 6 meses y no entrega el nombre en web (doc de Apple y de Supabase) | Dejarlo para después de la 1.0. Titular: Leslie. Si se hace, registrar `onia.com.bo` en el Private Email Relay de Apple | 1 día más mantenimiento cada 6 meses |
| A7 | MEDIO | Correo corporativo: SAML está apagado y sobra para este segmento; el enlace mágico está a medias | `saml_enabled:false`. `/auth/confirm` ya maneja magiclink (`app/auth/confirm/route.ts:30`), pero no hay `signInWithOtp` ni plantilla `magic-link.html` | No hacer SAML. Enlace mágico: plantilla con la marca más `signInWithOtp({shouldCreateUser:false})` | 0,5 a 1 día |
| A8 | MEDIO | Vinculación de cuentas: duplicados o identidad perdida | GoTrue vincula por email y descarta identidades sin confirmar (doc de Supabase). El callback manda al alta y puede crear una 2ª org | `xms_edov` en Entra, aviso "Ya tenés cuenta" por email y un E2E con cuenta confirmada y sin confirmar | 0,5 día |
| A9 | BAJO | Falta probar en vivo la 2FA del SUPERADMIN con OAuth | Por código se exige aal2 (`proxy.ts:213-227`, `lib/mfa/policy.ts:26`) | Probarlo en la QA de Google. El SUPERADMIN entra solo con contraseña y TOTP | 1 h |
| A10 | BAJO | La documentación OAuth apunta a la nube y a dentalgest.app | `docs/GOOGLE_OAUTH_SETUP.md:11-22`, `docs/CREDENTIALS_GUIDE.md:104-119` | Reescribirla con las `GOTRUE_EXTERNAL_*` reales | 1-2 h |

### 2.4 Animaciones

**Estado (MEDIDO):**
- **Plataforma:** no usa librería de animación, solo `tw-animate-css` (`package.json:51`) y CSS propio. Los keyframes respetan reduced-motion (`globals.css:581,702,1260,1288`). El loader es un único componente de tres puntos (`BrandSpinner.tsx`).
- **Web:** `motion` con `LazyMotion` y `reducedMotion="user"` (`src/app/layout.tsx:131`). El hero es CSS sin JS y el h1 no sale con `opacity:0` (curl).
- SUPUESTO: cómo se sienten al ojo, porque no lo abrí en el navegador.

| # | Sev | Hallazgo | Evidencia | Arreglo | Esfuerzo |
|---|---|---|---|---|---|
| M1 | ALTO | No hay feedback consistente de "guardado" | Hay 29 `.tsx` con "Guardando…" y solo 3 confirman al terminar. El único toast es casero (`agenda/AgendaClient.tsx:61-68`). Los tokens `--text-swap-*` existen pero no se usan (`globals.css:208-212`) | Un componente `EstadoGuardado` (`role=status`) que muestre "Guardando…", luego "Guardado ✓" y vuelva al reposo a los 2 s | M (~3-4 h) |
| M2 | MEDIO | No hay skeletons | Solo hay 2 `loading.tsx` y ambos muestran los tres puntos | Skeleton estático en dashboard, agenda, clientes y checkout | M (~3 h) |
| M3 | MEDIO | La presión de botón y las transiciones son inconsistentes | 5 valores distintos de `active:scale-*` y 216 `transition-all` | Una clase `.press` (`scale(.97)` en 160 ms) y cambiar `transition-all` por propiedades explícitas | S-M (~2 h) |
| M4 | MEDIO | Hay loops infinitos sin reduced-motion | `animate-ping` en `book/confirm/[token]/page.tsx:188` y `book/[orgSlug]/page.tsx:239`, `paso-buscando.tsx:28,96`, `RealtimeBadge.tsx:29` | Prefijo `motion-safe:`. En las pantallas de éxito, un check que se dibuja una sola vez | S (~20 min) |
| M5 | MEDIO | Solo 2 de 12 modales animan | `AccessibleDialog.tsx` no tiene motion | Meter `useModalTransition` en `AccessibleDialog` | S (~1 h) |
| M6 | MEDIO | Los pasos cambian sin transición y la barra de progreso anima `width` | `alta-negocio.tsx:221-302`, `SignupForm.tsx:95-114`, `progreso.tsx:42-44` (prohibido en `MOTION_PATTERN_BANK_2026.md:26`) | `key={paso}` con fade y subida de 180 ms. La barra pasa a `scaleX` | S (~1-1,5 h) |
| M7 | BAJO | El momento de "pago enviado" es estático y con colores sueltos | `QRPaymentModal.tsx:397-401`. Los tokens `--check-*` no se usan | Un check SVG que se dibuja una vez, con tokens | S (~1 h) |
| M8 | BAJO | ~90 líneas de tokens de motion muertos | `globals.css:183-273` | Quedarse con modal, shake, text-swap y check | S |
| M9 | BAJO | Hay count-up en precios en `/v1`, que sigue vivo | `landing-v1/pricing.tsx:62`. `/v1` responde 200 en producción aunque `next.config.ts:233-234` lo redirige | Publicar la web actual | deploy |

Set mínimo propuesto (todo en CSS, sin instalar nada): presión de botón única, cambio de texto a "Guardado", skeleton estático, fade de 180 ms entre pasos, modal de .96 a 1, check que se dibuja una vez. Nada de count-up en montos de dinero ni loops sin `motion-safe`. Son 1 a 1,5 días en total.

### 2.5 Reglas anti-vibe-coded

**Lo que ya está bien (MEDIDO):**
- Tipografía Archivo, no Inter ni Geist (`app/layout.tsx:3`).
- 0 íconos Lucide.
- Paleta verde y petróleo.
- Sin testimonios falsos ni texto con degradado (`DESIGN.md:63`).
- Un solo h1 por página y 0 errores de consola.

**Reglas propuestas para fijar en `DESIGN.md` y en tests:**
1. **Fondo plano.** Nada de orbes ni `radial-gradient` fuera del hero público. Un test que falle si aparece.
2. **Sin raya larga (—) en el copy.** Ya está en `DESIGN.md:62-65`. Falta el test, copiando `obra-literal.test.ts` de la web.
3. **Sin íconos "de magia".** Nada de `auto_awesome` ni chispitas; el ícono dice lo que pasa.
4. **Sombras: solo 2 tokens** (`shadow-card`, `shadow-raised`). Prohibir `shadow-[` y `rounded-2xl` sueltos fuera de `components/ui`.
5. **Pill solo para chips y estados.** Los botones usan `--radius`.
6. **Nada de grillas de tarjetas iguales con huérfanas.** Jerarquía: se destaca uno y el resto va compacto.
7. **Cada carga con skeleton y cada vacío con su siguiente acción.**
8. **Nada de datos crudos:** ni plurales "(s)", ni fechas con segundos, ni contadores internos.
9. **Encabezados sin molde:** kicker solo donde orienta, alineado a la izquierda, una sola itálica y nada de "no es X, es Y".
10. **Ninguna página interna pública** (regla "la venta nunca exhibe obra").

| # | Sev | Hallazgo | Evidencia | Arreglo | Esfuerzo |
|---|---|---|---|---|---|
| V1 | ALTO | Orbes radiales en toda la app, en el hero y en el registro | `.app-lienzo` con 5 `radial-gradient` (`app/globals.css:1309-1339`). Web: `portada.module.css:357-379`. Visibles en `b-dashboard.png` y `app-register-1280.png` | App con fondo plano. Web con un solo halo en el hero | 1-2 h más QA visual |
| V2 | ALTO | Rayas largas en el copy | 232 líneas en `.tsx`. Ejemplos: `CheckoutClient.tsx:525,855`, `approval-labels.ts:25`. 10 en la home en vivo | Reemplazarlas por dos puntos, "·" o punto, más el test | 3-4 h |
| V3 | ALTO | Chispitas como ícono de "agente" | `panel-hoy.tsx:280`, `dashboard/page.tsx:549`, `ChatbotClient.tsx:607`, `EnsenaleConversando.tsx:78` | `pending_actions` / `how_to_reg`, verificando el subset de íconos | 30-60 min |
| V4 | MEDIO | Grillas uniformes con huérfanas | Checkout: 4 planes en 3 columnas. Registro: 5 rubros en 3 columnas. 4 tarjetas de agentes. Trío en la web | Checkout en 4 columnas o tabla. Dental destacado. Agentes como lista densa. Trío asimétrico | 4-6 h |
| V5 | MEDIO | Radios y sombras fuera de los tokens | `shadow-[…]` arbitrario ×70 contra `shadow-raised` ×8. `999px` ×29 en la web | Codemod más una regla de lint | 1 día |
| V6 | MEDIO | "Cargando..." y vacíos pobres | `PatientCollab.tsx:362`, `patients/[id]/page.tsx:476`, `dashboard/page.tsx:638` | Skeleton y vacío con acción, al estilo de comercio "Registrá la primera desde Caja" | 3-4 h |
| V7 | MEDIO | Datos crudos | "cita(s)" (`appointments/page.tsx:672`), `toLocaleString` con segundos (`agents-view.tsx:217,307`) | `Intl.PluralRules('es-BO')` y fechas relativas | 2-3 h |
| V8 | MEDIO | La web no muestra el producto real | Maquetas con un verde que no es el del panel (`web-s1..6.png` contra `b-dashboard.png`) | A: maquetas con los tokens del panel. B: clip de 10-15 s | A 3-4 h, B 1 día |
| V9 | MEDIO | Capas flotantes tapan el botón primario | `f-chatbot.png`: la barra tapa "Continuar" | Igual que J7 | 2-3 h |
| V10 | BAJO | Viñetas con check en los planes | `a-checkout-pagina-completa.png` | Lista simple, "Plan elegido" | 30 min |
| V11 | BAJO | Encabezados en molde repetido en la web | kicker mono + h2 centrado + itálica + "no es X, es Y" | Ver regla 9 | 1-2 h |
| V12 | BAJO | `/patrones` es pública | `https://onia.com.bo/patrones` responde 200 (tiene noindex) | `notFound()` en producción | 15 min |

### 2.6 SEO y robots

**onia.com.bo (MEDIDO), base buena:**
- robots y sitemap responden 200.
- 12 páginas con title, description, canonical, OG y Twitter.
- JSON-LD Organization + SoftwareApplication con 4 Offers en BOB que salen de datos.
- `/terminos` es noindex.
- http redirige 301 a https.
- Search Console verificado por DNS TXT.
- Home: 23 KB de HTML comprimido, ~212 KB de JS+CSS, TTFB 0,70 s. El LCP no está medido.

**app.onia.com.bo (MEDIDO), mal:** robots y sitemap redirigen 307 al login, y `/login` y `/register` salen con `index, follow` y canonical a la raíz.

**Indexación:** WebSearch `site:onia.com.bo` dio 0 resultados, y en "software para clínica dental Santa Cruz Bolivia" Onia no aparece; aparecen Citalo y Turnito. Esto es un indicio, no una prueba: esa herramienta no es Google. El dato real está en Search Console.

| # | Sev | Hallazgo | Evidencia | Arreglo | Esfuerzo |
|---|---|---|---|---|---|
| S1 | ALTO | robots y sitemap de la app redirigen al login | curl `/robots.txt` da 307 a `/login`. `proxy.ts:118-154` no los deja pasar y el matcher (`:293-296`) no excluye `.txt` | Agregar `/robots.txt` en `isPublicRoute`, reemplazar `app/robots.ts` y borrar `app/sitemap.ts` | 30 min más deploy |
| S2 | ALTO | Login y registro se ofrecen como indexables, con canonical a la raíz | `app/layout.tsx:77-78` (canonical `/`) y `:111-121` (`index:true`). `app/sitemap.ts:33-36` | `robots:{index:false,follow:false}` y quitar el canonical. Opcional: `X-Robots-Tag: noindex` | 20 min más deploy |
| S3 | ALTO | `/v1`, `/servicios/consultoria` y `/servicios/marketing-ia` responden 200 | curl. El 308 está en `next.config.ts:233-238` pero no está publicado | Publicar la web 1.0 y verificar el 308 con curl | deploy |
| S4 | MEDIO | robots.txt bloquea las URLs que tienen noindex | `src/app/robots.ts:46-51`. Google no ve ni el noindex ni el 308 | En el mismo deploy, dejar el disallow solo en `/patrones` y `/api/` | 10 min |
| S5 | MEDIO | No hay páginas por rubro ni presencia local | `(sitio)/rubros` es una sola página | `/rubros/dental` primero ("Software para clínica dental en Santa Cruz"), luego perfil de Google Business y artículos sobre el dolor de entrada | 1 día la página dental |
| S6 | MEDIO | JSON-LD incompleto | Organization sin logo, sameAs ni contactPoint. 0 JSON-LD en `/agentes`, `/rubros`, `/comparativa` y `/contacto` | Completarlo. sameAs solo a perfiles propios verificados: el LinkedIn "onia-llc" no parece ser de Onia. Nunca AggregateRating sin reseñas reales | 2 h |
| S7 | MEDIO | `www` responde 200 en vez de 301 | curl a `https://www.onia.com.bo/` | Regla de redirección en Cloudflare: `www/*` con 301 a `onia.com.bo/$1` | 10 min |
| S8 | BAJO | Sitemap sin lastmod y todo en weekly | `src/app/sitemap.ts:99-103` | `lastModified` real y sin changefreq ni priority | 30 min |
| S9 | BAJO | Títulos largos y facturación atada al 1-oct | El title de `/facturacion` tiene ~95 caracteres y el de `/guia-facturacion` ~85 | 60 caracteres o menos. El 1-oct pasar el texto a tiempo presente, sin prometer emisión | 30 min |
| S10 | BAJO | Tarjeta social de la app pobre | `app/layout.tsx:104-110` usa `summary` sin og:image | og:image de marca 1200x630 y correr Lighthouse móvil sobre `/` y `/precios` | 1 h |

**Plan SEO local, sin prometer posiciones:**
- Google Business Profile como empresa de software con área de servicio Santa Cruz/Bolivia, con los mismos datos que el SEPREC y el WhatsApp de `src/lib/site.ts`. Reseñas solo de clientes reales (hoy 0).
- Una página por rubro vivo, empezando por dental.
- Keywords: "software para clínica dental Santa Cruz", "sistema para consultorio odontológico Bolivia", "recordatorio de citas por WhatsApp", "sistema de inventario para tienda Santa Cruz", "punto de venta Bolivia QR", "chatbot de WhatsApp para negocios Bolivia".
- En Search Console: enviar el sitemap, pedir la retirada de `/v1` y `/servicios/*` después del 308 y revisar la cobertura.

---

## 3. Qué entra, cuándo y quién

### 3.1 Antes de publicar la 1.0 (bajo riesgo, alto impacto en cómo se percibe)

Todo esto es código o configuración reversible. Ninguna decisión es tuya, salvo el OK de ver las piezas renderizadas y el deploy.

**SEO y robots**
- S1, S2, S4, S8: robots, sitemap y metadatos de la app y de la web (ver sección 4).
- S3: publicar la web 1.0 para que salgan los 308.
- S6: JSON-LD en las 4 páginas que no tienen y Organization completa.
- S9: títulos de 60 caracteres o menos.
- V12: ocultar `/patrones`.

**Recorrido**
- J3: `?plan=` desde la web.
- J4: "Ver mi plan" lleva al checkout.
- J5: ocultar el comprobante cuando hay QR dinámico.
- J6: volver al checkout después del login.
- J1b: achicar el formulario del comprobante a 1 campo más el archivo.
- J7/V9: la barra flotante deja de tapar botones.
- J10: corregir el comentario.

**Anti-vibe**
- V2: rayas largas, con test.
- V3: chispitas.
- V6: vacíos con acción.
- V7: plurales y fechas.
- V10: checks en los planes.
- V5: sombras a tokens (codemod).

**Animaciones**
- M1: guardado.
- M3: presión de botón.
- M4: `motion-safe`.
- M5: modales.
- M6: pasos y barra de progreso.
- M7: check de éxito.

**Seguridad barata**
- A4: apagar el proveedor phone de GoTrue.
- C4: borrar `PLATFORM_LAYER`.
- C8: sacar `node_modules` del índice.

Estimación: unas 5 a 7 jornadas de agente en total, repartibles en paralelo. Web y app son carriles distintos.

### 3.2 Versión 1.1

- **Google** (A1), en cuanto existan las credenciales, más la **generalización OAuth** (A2), los **huérfanos** (A3) y la **vinculación** (A8), con la QA de 2FA del SUPERADMIN (A9).
- **Microsoft / Entra** (A5) con tenant `common`: cubre el correo corporativo de M365 y Workspace sin SAML.
- **Enlace mágico** (A7), si lo querés.
- **QR dinámico BCP** (J1): el plan se activa solo. Entra en la 1.0 si llegan antes las credenciales del BCP.
- Skeletons (M2), grillas (V4), orbes (V1, requiere tu OK), molde de encabezados (V11).
- `/rubros/dental` (S5), redirección `www` (S7), og:image de la app (S10).
- Core: test de completitud por rubro (C2), extensión Prisma de tenant (C3), adapter `onia-platform` (C5), marcar `business-tiers.json` como historia (C6) y control de desvío en CI (C9).
- Más adelante: Apple (A6). SAML solo si un cliente real lo pide. Modelo de datos no dental (C7). Registro único por rubro (C2-L).

### 3.3 Depende de vos, Sergio Urcullo

| Tema | Qué hace falta de tu lado |
|---|---|
| Google | Proyecto en Google Cloud con OAuth client Web y pantalla de consentimiento "In production". Brand verification: home y política de privacidad en el dominio verificado. Todo a nombre de Leslie u Onia, **fuera del Workspace** que vas a cancelar (`ONIA_SALIR_DE_WORKSPACE_PASO_A_PASO.md:22,33`) |
| Microsoft | App registration en entra.microsoft.com (gratis) con una cuenta de Leslie u Onia. La publisher verification es opcional |
| Apple | Aprobar el **gasto de USD 99 al año**. Titular: Leslie (mayor de edad), como individual o como organización con D-U-N-S. Vos no podés ser el titular |
| BCP | Credenciales de la API QR (el trámite está en curso) y aprobar que el QR estático quede solo como respaldo |
| Titular del cobro | Confirmar el texto legal "Cuenta de la empresa que opera Onia..." (J8) |
| Confirmación de correo | Decidir si la 1.0 exige confirmar el correo (J9) |
| Google Business Profile | Crearlo y verificarlo con tu cuenta, entrar a Search Console y decirme qué perfiles sociales son oficiales (S6) |
| Decisiones visuales ya aprobadas | Orbes y burbujas (V1), maquetas o clip en la web (V8, que choca con "nunca capturas"), hero y titulares (V11), checkout y registro (V4). Hay que ver el antes y el después renderizados |
| Core | Decidir si el core queda como paquete compartido o solo como contrato (C1). Decidir el próximo rubro y si entra veterinaria o B2B (C2, C7). Decidir el destino de Gestios y Ganaderos-Os (C5) |
| Indexar `/login` | Mi recomendación es que no (S2) |
| Deploys | OK para publicar la web 1.0 y la app, para la regla de `www` en Cloudflare y para apagar phone en GoTrue |

---

## 4. robots.txt y sitemap propuestos

### 4.1 onia.com.bo

Publicar el **mismo día** que salga el 308 de `next.config.ts:233-238`. En `src/app/robots.ts`, el `disallow` queda solo en `["/patrones", "/api/"]`. `ruta-citada.test.ts` sigue en verde porque las dos rutas existen en disco.

```
User-agent: *
Allow: /
Disallow: /patrones
Disallow: /api/

Sitemap: https://onia.com.bo/sitemap.xml
```

Por qué se sacan `/v1`, `/servicios/marketing-ia` y `/servicios/consultoria`: si están bloqueadas, Google no puede leer su noindex ni seguir el 308, y pueden quedar como "indexada aunque bloqueada".

`sitemap.xml`: son las mismas 13 URLs de hoy. `lastmod` = fecha real del último cambio de cada `page.tsx` (sale de git en el build). No lleva `changefreq` ni `priority`, porque Google los ignora. En `src/app/sitemap.ts` se devuelve `{ url, lastModified }`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://onia.com.bo</loc><lastmod>AAAA-MM-DD</lastmod></url>
<url><loc>https://onia.com.bo/precios</loc><lastmod>AAAA-MM-DD</lastmod></url>
<url><loc>https://onia.com.bo/empezar</loc><lastmod>AAAA-MM-DD</lastmod></url>
<url><loc>https://onia.com.bo/rubros</loc><lastmod>AAAA-MM-DD</lastmod></url>
<url><loc>https://onia.com.bo/chatbot</loc><lastmod>AAAA-MM-DD</lastmod></url>
<url><loc>https://onia.com.bo/agentes</loc><lastmod>AAAA-MM-DD</lastmod></url>
<url><loc>https://onia.com.bo/facturacion</loc><lastmod>AAAA-MM-DD</lastmod></url>
<url><loc>https://onia.com.bo/guia-facturacion</loc><lastmod>AAAA-MM-DD</lastmod></url>
<url><loc>https://onia.com.bo/servicios/webs</loc><lastmod>AAAA-MM-DD</lastmod></url>
<url><loc>https://onia.com.bo/comparativa</loc><lastmod>AAAA-MM-DD</lastmod></url>
<url><loc>https://onia.com.bo/contacto</loc><lastmod>AAAA-MM-DD</lastmod></url>
<url><loc>https://onia.com.bo/nosotros</loc><lastmod>AAAA-MM-DD</lastmod></url>
<url><loc>https://onia.com.bo/privacidad</loc><lastmod>AAAA-MM-DD</lastmod></url>
</urlset>
```

Cuando existan `/rubros/dental`, `/rubros/comercio`, etc., cada una entra con su `lastmod`. `/terminos` sigue fuera y con noindex.

### 4.2 app.onia.com.bo

El producto es privado y no se indexa nada. Se permite **rastrear** para que Google pueda **leer** el noindex. Con `Disallow: /` no lo vería y podría indexar solo la URL si alguien la enlaza.

```
# app.onia.com.bo es el producto (privado). La vidriera es https://onia.com.bo
User-agent: *
Disallow: /api/
```

- **Sitemap: ninguno.** Borrar `app/sitemap.ts` (debe dar 404). El robots.txt no lleva línea `Sitemap`.
- Para que se sirva de verdad:
  1. `proxy.ts`: agregar `pathname === "/robots.txt"` en `isPublicRoute` (`:118-154`), o excluir `robots\.txt` en el matcher (`:293-296`).
  2. `app/layout.tsx`: `robots: { index: false, follow: false, googleBot: { index: false, follow: false } }` y quitar `alternates.canonical: "/"` (`:77-78`, `:111-121`).
  3. Opcional: header `X-Robots-Tag: noindex` en todas las respuestas del proxy.
- Verificación después del deploy: `curl -D - https://app.onia.com.bo/robots.txt` debe dar `200 text/plain`, y el HTML de `/login` debe traer `noindex, nofollow` sin canonical.
- Si preferís que la búsqueda "Onia login" caiga en la app, solo `/login` queda `index` con canonical `/login`. Mi recomendación es que no: la búsqueda de marca debería caer en onia.com.bo, que ya enlaza al login.
