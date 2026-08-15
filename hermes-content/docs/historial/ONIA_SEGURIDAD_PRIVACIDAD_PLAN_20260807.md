# ONIA — Seguridad, privacidad, 2FA y borde

**Fecha:** 2026-08-07 · **Alcance:** auditoría + plan. No se editó código del producto ni se tocó producción.
**Pedido de Sergio:** *"analiza también las políticas de privacidad y el tema de seguridad de datos, 2fa, cloudflare, todo lo necesario"*.

**Fuentes de la auditoría (4 carriles, todos verificados hoy):** código del producto `C:\dev\proyectos\onia-platform` (branch `master`, HEAD `6b8f152`, solo lectura) · producción por SSH y `psql` (solo `SELECT`, `docker inspect`, `curl GET`) · borde medido desde red externa (`curl`, `openssl s_client`, `nslookup`, TCP connect) · normativa boliviana con norma citada.

**Convención:** `[VERIFICADO]` = evidencia citada (archivo:línea, comando corrido o fuente con URL). `[INFERENCIA]` = razonamiento propio, no probado. `[ABOGADO]` = decisión jurídica que no puedo tomar. `[VERIFICAR]` = pendiente, no afirmar hasta comprobarlo.

---

## 1. Veredicto en 8 líneas

1. Onia hoy es sólido en el código y frágil en el borde: el producto filtra por tenant de forma consistente en las 102 rutas API, pero el panel que controla todo el VPS está publicado en internet sobre HTTP sin cifrar.
2. El aislamiento entre clínicas es de **una sola capa**: cero RLS en las tablas del producto, así que un `where` olvidado en una PR filtra historias clínicas sin que nada abajo lo detenga.
3. No está verificado si las tablas de producción quedaron en `public` con grants a `anon`; si quedaron, la fuga **ya está activa** y se lee con un `curl`. Ese es el primer comando a correr, no el primer plan a escribir.
4. Los backups son una copia en el mismo disco que respaldan y nunca se restauraron: hoy perder el VPS es perder el negocio, no sufrir un incidente.
5. No hay segundo factor en ninguna parte — ni en el producto ni auditado en nuestras cuentas — y el login pega directo a GoTrue, sin CAPTCHA, sin WAF y con piso real de 6 caracteres en el servidor.
6. La política de privacidad publicada afirma cifrado en reposo, backups cifrados y una ubicación de datos que no coinciden con la infraestructura real; además hay dos juegos de documentos legales vivos y contradictorios.
7. Nada de esto es un incidente conocido: no encontré evidencia de compromiso, ni secretos hardcodeados, ni logging de datos clínicos, y las firmas de webhook, los crons y el flujo de aprobación de pagos están bien hechos.
8. El plan entero cabe en una semana de trabajo y menos de USD 25/mes; lo caro no es arreglarlo, es seguir posponiéndolo con seis rubros vendibles ya en producción.

---

## 2. Top 5 riesgos reales, por daño esperado

| # | Riesgo | Qué pasa concretamente | Evidencia | Fix | Tamaño |
|---|---|---|---|---|---|
| **1** | **Panel Easypanel publicado en internet** | Un escaneo de puertos encuentra `187.77.16.63:3000` y hace fuerza bruta sobre **HTTP sin cifrar** (la contraseña viaja en claro), sin bloqueo por intentos y sin WAF. Quien entra obtiene shell en todos los contenedores y **todas las variables de entorno**: `SERVICE_ROLE_KEY`, `JWT_SECRET`, password de Postgres. Eso es la base entera: historias clínicas, alergias, tipo de sangre, recetas, CI/NIT y el bucket `payment-proofs`. Un solo credencial entre un atacante y todo. | `curl http://187.77.16.63:3000/` → `<title>Easypanel</title>`; `/api/auth/session` → 200 sin autenticar. También por `https://187.77.16.63/` con cert autofirmado `CN=Easypanel` (backend por defecto de Traefik cuando el Host es la IP). | **Hoy:** cerrar 3000 en firewall (y 8091, landing directa sin TLS; y 8099, ver §2.1). **Después:** publicarlo por Cloudflare Tunnel + Access con MFA, nunca por IP. | 30 min el cierre · 4 h el Tunnel+Access |
| **2** | **Backups solo locales y nunca restaurados** | `/opt/onia/vps-backup.sh`, rotación 7 días, **en el mismo disco del servidor que respalda**. Protege contra un solo escenario ("borré una tabla y el server sigue vivo"). No protege contra falla de disco, incidente del proveedor, suspensión de cuenta, ni ransomware — que **borra los backups primero, porque están ahí nomás**. RPO efectivo: 24 h si el server sobrevive; **pérdida total si no**. Y un backup nunca restaurado es una hipótesis: dump truncado, dump sin roles/extensiones o llave de cifrado perdida solo aparecen el día que lo necesitás. | Contexto verificado de sesión (script, rotación, sin off-site). No lo corroboré por SSH porque el encargo prohíbe tocar producción. | Off-site cifrado a Cloudflare R2 con `rclone` + alerta a Telegram si falla + **una restauración probada** (§6). | 4 h el script · 3 h el primer restore · **< USD 1/mes** |
| **3** | **Aislamiento de tenants sin red de contención (RLS)** — *y posible fuga activa por PostgREST* | El aislamiento depende 100% de que cada consulta lleve `where: { organizationId }`. Hoy están todos puestos y correctos (revisé las 102 rutas), pero `tsconfig.json:5-6` tiene `"strict": false` y no hay tests de aislamiento cross-tenant: **una PR con un `where` incompleto filtra historias clínicas de todas las clínicas, sin backstop y sin alerta.** Y si producción quedó con las tablas en `public`, el init estándar de Supabase self-hosted da grant a `anon` → **cualquiera con la anon key (que viaja en el bundle del navegador) lee todo con un `curl`**. | `grep -riE "ENABLE ROW LEVEL SECURITY\|CREATE POLICY" prisma/migrations/` → **0**. Única RLS del repo: `supabase/migrations/20260502_enable_realtime_appointments.sql:21-35`, y su comentario dice que es para Realtime, no para aislamiento. Prisma se conecta con rol dueño (`lib/prisma.ts:6-14`), y `postgres` tiene `BYPASSRLS`. Anon key pública en `lib/supabase/client.ts:5`. | **Primero verificar** (§2.2, 10 min, read-only). Si da 200 → **incidente, no hallazgo**. Después: rol de app sin `BYPASSRLS` + RLS + `SET LOCAL app.organization_id` + suite de tests cross-tenant. | 10 min verificar · 1 semana RLS + tests |
| **4** | **Login sin segundo factor, sin freno y con piso de 6 caracteres** | Credential stuffing contra `app.onia.com.bo` desde cualquier IP: el login es **navegador → GoTrue directo** (`app/(auth)/login/page.tsx:115`), así que **nunca pasa por nuestro rate limit** (`authLimiter` solo protege `/api/auth/register`). Sin CAPTCHA, sin bloqueo de cuenta, sin fail2ban, sin ufw, sin WAF. Una contraseña de ADMIN adivinada o phisheada = la clínica entera; una de SUPERADMIN = la plataforma entera. Agravante: el correo del producto está roto, así que no hay aviso de login nuevo. | `grep -rniE "\bmfa\b\|two.?factor\|2fa\|totp"` sobre `app lib supabase prisma docs` → **0**. `GOTRUE_PASSWORD_MIN_LENGTH` no seteado → default **6** ([README supabase/auth](https://raw.githubusercontent.com/supabase/auth/master/README.md)). `systemctl is-active fail2ban` → `inactive`; `ufw status` → `inactive`. `nslookup app.onia.com.bo` → IP del VPS, sin proxy. | `GOTRUE_PASSWORD_MIN_LENGTH=12` (env var, sin código) + fail2ban + ufw + Cloudflare Bot Fight Mode. Después: MFA de GoTrue en el producto, **empezando por el enforcement server-side** (§4.2). | 1 h lo de env/infra · 1 día el MFA del producto |
| **5** | **La política publicada afirma controles que no existen** | `privacidad.md` promete cifrado en reposo, backups cifrados, retención de 30 días y describe Supabase como servicio cloud. La realidad: sin evidencia de cifrado en reposo, backups locales, rotación de 7 días y Supabase **self-hosted en un VPS de Hostinger fuera de Bolivia**. Además hay **dos juegos de documentos legales vivos y contradictorios**, con razón social y email distintos, y el que el cliente realmente acepta al registrarse **no** es el que está mejor escrito. Ante un reclamo con datos de salud, eso convierte una falla técnica en incumplimiento contractual documentado, y roza publicidad engañosa (Ley 453 arts. 13-14). | `privacidad.md:117,122,138,96` vs. el único cifrado del producto: `lib/encryption.ts`, usado **solo** para credenciales de pasarela (`GatewayConfig.apiKeyEnc`). Historia clínica en texto plano. Dos sets: `src/content/legal/*` (landing) vs. `app/privacy|terms|data-processing` + `lib/legal.ts` (producto); `register/page.tsx:613-625` linkea los del **producto**. | Unificar en un solo juego canónico y **borrar toda afirmación de seguridad no verificada** (§3). | 1 día Sergio · + revisión `[ABOGADO]` |

### 2.1 Menciones honorables (no entran al top 5, pero son reales y baratas)

- **Directorio abierto en `:8099` sin autenticación** `[VERIFICADO]` — `python3 -m http.server 8099 --bind 0.0.0.0` sobre `/var/www/html/hermes-assets`, con listado navegable de `actas/`, `propuestas/`, `videos/`. Documentación comercial y de clientes accesible por cualquiera que escanee el puerto. **Es la exposición más barata de cerrar de todo el VPS.**
- **`ENCRYPTION_KEY` nunca rotada tras una exposición documentada** `[VERIFICADO]` — `docs/ROTATION_STATUS_2026-06-01.md:44-53` lista lo que **no** se rotó: `ENCRYPTION_KEY`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_APP_SECRET`, `CHATWOOT_API_TOKEN`, `UPSTASH_REDIS_REST_TOKEN`, `SENTRY_AUTH_TOKEN`, `OPENAI_API_KEY`. La primera protege las credenciales de cobro de **cada cliente**. El doc explica por qué no se rotó ("no rotar sin script de re-encriptado") — ese script sigue sin existir en `scripts/`.
- **Sin SPF ni DMARC en `onia.com.bo`** `[VERIFICADO]` — `nslookup -type=TXT` no devuelve `v=spf1`; `_dmarc.onia.com.bo` es NXDOMAIN. Cualquiera puede mandar correo firmando como `@onia.com.bo`. Un phishing "verifique su cuenta de Onia" es trivial de montar, y hoy Onia ni manda su propio correo ni impide que otro lo mande por ella.
- **Páginas `/print` sin permiso fino** `[VERIFICADO]` — `app/print/prescription/[id]/page.tsx:11-30` y `app/print/invoice/[id]/page.tsx:32-46` verifican sesión y org pero **no** llaman `hasPermissionForProfile`. Un `STAFF` (rol `recepcion`, sin `clinical.read`) está bloqueado en `/patients/[id]/prescriptions` pero lee la receta completa en `/print/prescription/<id>`. Fix de 4 líneas.
- **Cero auditoría de acceso concedido a historia clínica** `[VERIFICADO]` — `lib/audit.ts:4-28` define 24 acciones; la única clínica es `CLINICAL_ACCESS_DENIED`. `app/api/patients/[id]/records/route.ts` no llama `logAudit` en ningún lado. Un empleado que lee 400 historias no deja rastro. Con **CP art. 302** de por medio (§3.3), eso no es solo higiene: es la prueba que necesitás el día del reclamo.
- **`admin/global-users` borra con el cliente equivocado** `[VERIFICADO]` — `app/api/admin/global-users/[id]/route.ts:38-43` usa `createClient()` (anon) y llama `auth.admin.deleteUser` dentro de un `catch {}` vacío. El perfil se borra, la cuenta de Auth queda viva con su contraseña. Debe ser `createAdminClient()`. Fix de 5 min, y contradice el borrado que promete la política.
- **No existe ningún SUPERADMIN en producción** `[VERIFICADO]` — `select role, count(*) from public.profiles group by role` → `ADMIN 6, DOCTOR 5, STAFF 1`. Consecuencia operativa: `/admin/**` es inalcanzable y **hoy no se pueden aprobar pagos de suscripción de clientes** (`app/api/admin/subscription-payments/route.ts:15`). Es un bug de negocio, no solo de seguridad.
- **Verificación de correo desactivada por partida doble** `[VERIFICADO]` — `mailer_autoconfirm: true` en `/auth/v1/settings` **y** `email_confirm: true` en `app/api/auth/register/route.ts:145`. Cualquiera puede registrar un tenant con el correo de otro negocio y quedar como ADMIN. La compuerta `proxy.ts:104` es código muerto.

### 2.2 Los tres comandos que hay que correr antes de escribir una línea de plan

Read-only, sin traer datos de pacientes al contexto. Contra la URL real de producción.

```bash
# 1) ¿en qué schema están las tablas y tienen RLS?
psql "$DATABASE_URL" -c "select schemaname, tablename, rowsecurity from pg_tables
  where tablename in ('patients','clinical_records','prescriptions','invoices','subscription_payments');"

# 2) ¿anon o authenticated tienen grant?
psql "$DATABASE_URL" -c "select table_schema, table_name, grantee, privilege_type
  from information_schema.role_table_grants where grantee in ('anon','authenticated') and table_name='patients';"

# 3) prueba viva SIN leer filas (solo cuenta; 200 = expuesto, 401/404 = ok)
curl -sS -o /dev/null -w '%{http_code}\n' \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" -H "Prefer: count=exact" -H "Range: 0-0" \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/patients?select=id&limit=0"
```

Si (3) devuelve **200**, esto deja de ser una auditoría y pasa a ser un incidente: cerrar grants, rotar la anon key y el `JWT_SECRET`, y recién después seguir con el plan.

---

## 3. Privacidad legal

### 3.0 El hallazgo estructural: hay dos juegos de documentos vivos y divergentes

`[VERIFICADO]` Dos sets publicados al mismo tiempo, escritos por separado:

| | Landing (`onia.com.bo`) | Producto (`app.onia.com.bo`) |
|---|---|---|
| Rutas | `/privacidad`, `/terminos` | `/privacy`, `/terms`, `/data-processing` |
| Fuente | `web-factory/apps/onia-platform/src/content/legal/privacidad.md` (v0.3, 2026-08-06) y `terminos.md` (v0.2) | `C:\dev\proyectos\onia-platform\app\{privacy,terms,data-processing}\page.tsx` + `lib\legal.ts` (v `2026.06.03`) |
| Operador declarado | "OniaAgency" (`privacidad.md:13-14`) | "OnIA / On Inteligencia Artificial" (`lib/legal.ts:5`) |
| Contacto de derechos | `business@onia.com.bo` | `oninteligenciaartificial@gmail.com` |
| Alcance | 6 rubros | solo dental ("clínica", "odontograma") |
| Subencargados | Supabase, IA, WhatsApp | Supabase, Vercel/Coolify, Resend, Sentry, n8n, Meta/Chatwoot |

**Lo que el cliente firma al registrarse es el del producto** (`app/(auth)/register/page.tsx:613-625`), no el de la landing. Es decir: la política mejor trabajada es la que **nadie acepta**.

`[INFERENCIA]` Y la razón social declarada en el producto ("OnIA / On Inteligencia Artificial") **no coincide con la registrada en SEPREC**: `OniaAgency`, matrícula 5371375010, titular Leslie Mercado Moreno. Un contrato a nombre de una entidad que no existe es el primer punto que ataca cualquier abogado contrario.

**P0: un solo juego canónico, una sola razón social, un solo email. El resto redirige.** Recomendación `[INFERENCIA]`: el del producto es el que se acepta contractualmente, pero el de la landing es mejor texto → portar el texto de la landing al producto, borrar el duplicado, y que la landing sirva el mismo contenido desde una sola fuente.

### 3.1 Cambios exactos a la política actual

**Bloque A — `src/content/legal/privacidad.md`**

| # | Línea | Cambio | Quién |
|---|---|---|---|
| A1 | `:13-14` | Razón social exacta: **OniaAgency**, empresa unipersonal, matrícula SEPREC **5371375010**, titular **Leslie Mercado Moreno**, NIT y domicilio legal. Quitar el `[REVISAR ABOGADO]`: el dato ya se tiene. Idéntica en los 5 documentos. | Sergio + `[ABOGADO]` |
| A2 | `:23-26` | Conservar la tabla de roles (es correcta) y anclarla en norma: citar **Ley 3131 art. 10** (custodia del expediente = establecimiento de salud) para el vertical salud. | `[ABOGADO]` |
| A3 | `:32-33` | Reemplazar *"[REVISAR ABOGADO: conveniencia de un anexo de tratamiento de datos]"* por el hecho: **existe** un Acuerdo de Tratamiento de Datos, se acepta al registrarse, con link. | Sergio |
| A4 | `:53-55` | §2.4 dice que Onia *"no solicita ni necesita"* datos sensibles. **Falso en salud**: alergias, tipo de sangre y recetas son sensibles por definición y el producto los pide. Reescribir: Onia **sí** trata categorías sensibles por instrucción del cliente; enumerarlas; declarar el régimen reforzado. | Sergio + `[ABOGADO]` |
| A5 | `:77-80` | **Reescribir §4.1 entero.** Hoy: *"Supabase, servicio en la nube"*. Real: Supabase **autoalojado** en un servidor contratado a **Hostinger**, ubicado fuera de Bolivia. `[VERIFICAR]` el país con Hostinger antes de escribirlo (dos geoIP coinciden en EEUU, pero geoIP no prueba datacenter). Declarar el bucket privado con URLs firmadas. | Sergio (dato) + `[ABOGADO]` (redacción) |
| A6 | `:82` | §4.2 *"servidor privado administrado por Onia"*: aclarar que la **administración** es de Onia y la **infraestructura** de un IaaS externo. | Sergio |
| A7 | `:89-101` | **Rehacer §5.** Lista real y única: Hostinger (IaaS), Supabase self-hosted, Meta/WhatsApp, **LiteLLM + los proveedores de modelo detrás (nombrarlos)**, Cal.com, Chatwoot self-hosted, SMTP cuando se arregle, Cloudflare si se pone. Para cada uno: finalidad, país, si accede a datos de pacientes. Fijar plazo de aviso previo ante alta de subencargado (30 días). | Sergio + `[ABOGADO]` |
| A8 | `:96` | La tabla afirma *"cifrado en tránsito y en reposo"* y *"aislamiento por cliente"*. **No hay evidencia de ninguno de los dos.** O se implementan o **se borra la afirmación**. Una afirmación de seguridad falsa es publicidad engañosa (Ley 453 arts. 13-14). | Sergio |
| A9 | `:97` | *"Solo modalidades que no entrenan"*: `[VERIFICAR]` contra los ToS reales del proveedor detrás de LiteLLM. | Sergio |
| A10 | `:113-127` | **§7 debe listar solo lo implementado.** Corregir "copias cifradas". Agregar 2FA solo cuando exista. Separar el párrafo de brecha en compromiso concreto: **notificación al cliente dentro de 72 h de la detección**, con contenido mínimo. | Sergio + `[ABOGADO]` |
| A11 | `:134-140` | **§8 plazos: rehacer.** (a) *"30 días para exportar / 90 y borramos"* choca con la conservación fiscal de **8 años** (Ley 2492 art. 70 num. 8 + art. 59 mod. **Ley 812**) y con los plazos de archivo del expediente clínico. (b) La rotación real es **7 días**, no 30. Propuesta: exportación 90 días, borrado a 180, y **custodia extendida como servicio** para respaldo fiscal. | `[ABOGADO]` + Sergio |
| A12 | `:143-145` | Eliminar *"Onia te lo recordará antes de eliminar"* hasta que el correo funcione, o cambiar el canal por uno que sí funcione (WhatsApp / aviso dentro de la plataforma). | Sergio |
| A13 | `:149-152` | El plazo de **15 días hábiles** es autoimpuesto y **hoy incumplible** (SMTP roto). O se arregla el correo antes de publicar, o se cambia el canal declarado. | Sergio |
| A14 | `:154-158` | Agregar el procedimiento cuando el titular escribe a Onia directo (derivar al cliente en X días y avisarle) y que Onia lleva registro de esas derivaciones. | `[ABOGADO]` |
| A15 | `:160-173` | §9.3 **conservar** — es correcto y verificado. Agregar **CPE art. 131** junto al 130, y **DS 1793 arts. 4 y 56** como estándar adoptado (con la salvedad de alcance de §3.3). | `[ABOGADO]` |
| A16 | **nueva** | **§ Cookies y medición.** Hoy no existe. La landing no usa cookies de terceros (`grep gtag\|fbq\|googletagmanager` → 0); el producto usa cookies de sesión y **Google Analytics activo**, limitado a páginas públicas. Explicar cómo desactivarlo. | Sergio |
| A17 | **nueva** | **§ Dónde están los datos y transferencia internacional.** Declarar que la infraestructura está fuera de Bolivia, que no hay restricción legal boliviana por ausencia de ley, y que Onia se obliga por contrato a un estándar equivalente. Base: DS 1793 art. 56 inc. d) vía cadena de consentimiento + DPA. | `[ABOGADO]` |
| A18 | `:175-181` | §10 menores: hoy traslada todo al cliente. Agregar modelo de consentimiento parental provisto por Onia y campo en el producto para registrarlo. Norma aplicable: Ley 548 `[ABOGADO: confirmar artículo]`. | `[ABOGADO]` |
| A19 | `:191` | **Un solo email** (`business@onia.com.bo`) en los cinco documentos. Eliminar `oninteligenciaartificial@gmail.com` de `lib/legal.ts:6`: **un gmail personal como canal de derechos sobre datos de salud es indefendible.** | Sergio |
| A20 | `:210-212` | Resolver el `[REVISAR]` de las notas de voz: decir si el audio se descarta tras transcribir o se conserva y por cuánto. Es un dato de hecho, se responde mirando el código. | Sergio |
| A21 | `:218-220` | Corregir *"servidor propio de Onia — no es un proveedor externo"*: **sí** hay proveedor externo (el IaaS). La frase, tal cual, es falsa. | Sergio |
| A22 | `:4-6, 251-257` | **Decisión de publicación:** hoy `status: "borrador"` y el banner dice *"pendiente de revisión por abogado"*. Un documento que dice de sí mismo que no está revisado, publicado en producción sobre datos de salud, es peor que uno breve y firme. Cerrar la revisión y pasar a `vigente`, o bajar la página. | Sergio + `[ABOGADO]` |

**Bloque B — `src/content/legal/terminos.md`**

| # | Línea | Cambio | Quién |
|---|---|---|---|
| B1 | `:14-15` | Misma razón social que A1. | Sergio |
| B2 | `:49-57` | §1.4: cerrar el `[REVISAR ABOGADO: estado de homologación]` con el estado real ante el SIN. La facturación en línea es obligatoria desde **30-sep-2026**: sin homologación a esa fecha, la cláusula pasa de cautela a promesa incumplida. | Sergio + `[ABOGADO]` |
| B3 | `:100-110` | §3.5 ajuste unilateral de precios vs. **Ley 453 art. 22 num. 2**. Mitigantes ya presentes: aviso 30 días, rige en la renovación siguiente, no renovar sin penalidad, indexación objetiva BCB/INE. ¿Alcanzan? | `[ABOGADO]` |
| B4 | `:194-213` | §9 limitación de responsabilidad (tope 12 meses) vs. **Ley 453 art. 22 num. 1 y 3**. | `[ABOGADO]` |
| B5 | `:117-131` | §4: agregar que en salud la custodia legal del expediente es del **establecimiento** (Ley 3131 art. 10) y que Onia garantiza exportación completa **en cualquier momento**, no solo al terminar. | `[ABOGADO]` |
| B6 | `:164-177` | §7 sin SLA: **conservar**, es coherente con la realidad. Agregar explícitamente que no hay redundancia geográfica ni failover. Es honesto y hoy es cierto. | Sergio |
| B7 | `:250-253` | §14 contacto **está vacío**. Completar con lo de A19. | Sergio |
| B8 | **nueva** | Cláusula de subencargados enlazada al DPA + cláusula de confidencialidad del personal referenciando **CP art. 302**. | `[ABOGADO]` |

**Bloque C — producto (`C:\dev\proyectos\onia-platform`), NO editar ahora**

| # | Ubicación | Cambio |
|---|---|---|
| C1 | `app/{privacy,terms,data-processing}` | Una sola fuente de documentos (§3.0). |
| C2 | `lib/legal.ts:5-6` | Razón social y email correctos. |
| C3 | `lib/legal.ts:8-16` | Lista de subencargados real. Hoy nombra Vercel, Coolify, Resend y Sentry — `[VERIFICAR]` cuáles están realmente activos. **Declarar un subencargado que no se usa es tan malo como omitir uno que sí.** |
| C4 | `app/privacy/page.tsx:11,26,52` | Quitar el sesgo dental: hay 6 rubros. |
| C5 | `app/privacy/page.tsx:109-113` | GA en afirmativo, no en condicional (`[VERIFICADO]` activo en `app/layout.tsx:109`). |
| C6 | `app/api/auth/register/route.ts:210-212` | Persistir **la versión** del documento aceptado (`legalConfig.version`), no solo la fecha. Sin eso no se puede probar qué texto se aceptó cuando la política cambie. Fix de una línea. |
| C7 | `app/data-processing/page.tsx` | Completar el DPA (§3.2). |
| C8 | producto | Campo de consentimiento del paciente (§3.2). |

### 3.2 Documentos que faltan

**(a) DPA con clientes — existe a medias.** `[VERIFICADO]` Ya hay un Acuerdo de Tratamiento de Datos en `app/data-processing/page.tsx`, con roles (§1), instrucciones (§2), obligaciones (§3-4), subencargados (§5), incidentes (§6) y eliminación (§7). Buen esqueleto, se acepta al registrarse. Le falta, para servir en salud:

- **Plazo concreto de notificación de brecha.** Hoy dice *"cuando sea necesario y posible"* — eso es una intención, no una obligación. Proponer **72 h desde la detección**.
- Lista **cerrada y versionada** de subencargados + derecho de objeción del cliente y aviso previo al alta de uno nuevo.
- **Compromiso de confidencialidad del personal** con acceso, referenciando CP art. 302.
- **Acceso de soporte a datos clínicos**: cuándo procede, quién autoriza, qué queda logueado.
- Devolución/eliminación al terminar con **plazo cierto y formato**, coordinado con la retención fiscal de 8 años.
- **Ubicación de los datos** (país del servidor) y compromiso de aviso si cambia.
- Anexo de **medidas de seguridad reales** (lista, no adjetivos).
- `[ABOGADO]` Hoy es click-through. Para clientes de salud, evaluar anexo firmado en la orden de servicio.

**(b) Consentimiento del paciente — no existe y es el hueco más grande.** `[VERIFICADO]` Onia le traslada la obligación al cliente (`privacidad.md:29-31`, DPA §3) pero **no le da la herramienta**. `[INFERENCIA]` Una clínica de Santa Cruz no va a redactar un consentimiento informado de tratamiento de datos por su cuenta: nadie lo obtiene, y la cadena de consentimiento del DS 1793 art. 56 incs. b) y d) queda rota **justo en el punto donde Onia más la necesita** (transferencia a subencargados y a un servidor fuera de Bolivia). Hay que entregar:

- **Modelo de consentimiento informado** (1 página, castellano llano — Ley 453 art. 21): finalidad, que el negocio usa un sistema de gestión de terceros, que los datos se alojan fuera de Bolivia, derechos y cómo ejercerlos, contacto del negocio.
- **Modelo para menores** con firma de padre/madre/tutor.
- **Captura del consentimiento en el producto**: campo por paciente con fecha, versión y quién lo tomó. `[VERIFICAR]` no lo encontré en el schema; confirmar antes de afirmarlo. Sin esto el cliente no puede probar nada y Onia no puede demostrar que instruyó.
- `[INFERENCIA]` Esto es **producto vendible**, no solo cumplimiento: *"te dejamos legalmente ordenado"* diferencia frente al cuaderno y al Excel.

**(c) Aviso del chatbot — casi bien, falta un renglón.** `[VERIFICADO]` `privacidad.md:195-232` es la mejor sección del documento: declara que es un bot, qué recoge, para qué, quién participa (Meta, Supabase, Cal.com), retención de 24 meses y opt-out con "BAJA"/"STOP" — que **ya cumple** el DS 1793 art. 57 inc. d). Falta:

- **Identificación de la persona jurídica en el primer mensaje** (art. 57 inc. e): hoy el bot dice que es automático, no dice a nombre de quién. Un renglón.
- Link a la política en el primer mensaje.
- Resolver el `[REVISAR]` de las notas de voz (A20) y corregir la frase del "servidor propio" (A21).
- `[ABOGADO]` validar los 24 meses de retención.

**(d) Lo demás que no existe:** registro de solicitudes de titulares (sin él no se puede probar el plazo de 15 días) · procedimiento de brecha escrito (hoy se promete el resultado sin tener el proceso) · acuerdos de confidencialidad firmados por todo el que toque producción · registro de subencargados versionado en un archivo con fecha, no una tabla incrustada en dos documentos distintos.

### 3.3 Marco boliviano vigente, con norma citada

**No hay ley de protección de datos. Sigue sin haberla.** `[VERIFICADO]` A agosto 2026 Bolivia continúa sin ley nacional integral. Existen dos anteproyectos socializados y no promulgados (**AGETIC 2024** e **InternetBolivia.org**) y la primera ley **municipal** sobre gestión de datos personales (Municipio de Coroico). El texto de `privacidad.md:160-173` que dice esto es **correcto y honesto** — es de lo mejor del documento y hay que conservarlo.

**Lo que sí rige hoy:**

- **CPE art. 21 num. 2** — privacidad, intimidad, honra, propia imagen y dignidad. **arts. 130 y 131** — Acción de Protección de Privacidad: conocer, objetar y obtener eliminación o rectificación de datos en bancos públicos **o privados**. La política cita el 130; **falta el 131** (procedimiento y efectos).
- **DS 1793 de 13-nov-2013** (Reglamento a la Ley 164), **art. 56 — el anclaje que falta**: inc. b) el tratamiento requiere *"conocimiento previo y consentimiento expreso del titular... por escrito u otro medio equiparable"*, revocable sin efecto retroactivo; inc. c) deber de informar finalidad, destinatarios, identidad y domicilio del responsable, y los derechos de acceso, rectificación, actualización, cancelación, objeción y revocación; **inc. d)** *"solo podrán ser utilizados, comunicados o transferidos a un tercero, previo consentimiento del titular u orden escrita de autoridad judicial competente"* ← esto gobierna subencargados y transferencia internacional; inc. e) medidas técnicas y organizativas ajustadas al estado de la tecnología. **art. 4:** finalidad, veracidad, transparencia, seguridad, confidencialidad.
  - `[ABOGADO — punto crítico]` El art. 56 está **sistemáticamente ubicado** en el Título V ("Titular del certificado digital"), Cap. II, pero su **texto** es expresamente general (*"sector público y privado en todas sus modalidades"*) y AGETIC y la doctrina lo tratan como regla general de facto. Un contrario puede argumentar que su alcance se limita a certificación digital. **Recomendación `[INFERENCIA]`: adoptarlo por contrato explícitamente** — así es exigible pase lo que pase con el debate de alcance.
- **DS 1793 art. 57** (marketing y chatbot) `[VERIFICADO]` — comunicaciones por correo *"u otro medio de comunicación digital equivalente"* con finalidad de promoción deben indicar cómo aceptar o rechazar envíos futuros (inc. d) e identificar al remitente y a la persona jurídica en cuyo nombre se realizan (inc. e). `[INFERENCIA]` WhatsApp es medio equivalente.
- **Ley 164 de 8-ago-2011, art. 56** — inviolabilidad y secreto de comunicaciones, obliga a operadores y proveedores de telecomunicaciones/TIC. `[INFERENCIA]` Onia es un SaaS, no un operador registrado ante la ATT: probablemente **no le aplica directamente**. `[ABOGADO]` confirmar, porque al operar un chatbot de mensajería el límite se pone borroso.
- **Ley 1080 de 2018 (Ciudadanía Digital) art. 12** — ámbito: entidades que prestan servicios públicos delegados. `[INFERENCIA]` no aplica hoy; aplicaría si Onia vendiera al Estado.

**Salud — acá está el riesgo real:**

- **Ley 3131 de 8-ago-2005** `[VERIFICADO]` — art. 3: *"el secreto médico es inviolable salvo las excepciones previstas"*. art. 4: define el secreto. **art. 10**: enumera los documentos médicos oficiales (expediente, historia clínica, consentimiento informado, recetas, epicrisis…) y establece que están *"bajo el resguardo y custodia del **establecimiento de salud**"*.
  - **Consecuencia directa `[INFERENCIA]`:** la custodia legal es del **establecimiento**, no de Onia. Onia es infraestructura de custodia por cuenta ajena. Esto **confirma** el encuadre encargado/responsable de `privacidad.md:23-26`, pero exige que el contrato lo diga con esta norma citada y que el cliente pueda recuperar el expediente completo **en cualquier momento**.
- **DS 28562 de 22-dic-2005** (reglamento a la Ley 3131) `[VERIFICADO]` — art. 12 define expediente médico e historia clínica; art. 14 obligación de registro.
- **Norma Técnica N° 64 (Ministerio de Salud)** `[PARCIALMENTE VERIFICADO]` — art. 23 regula la entrega al paciente (solicitud notariada al director si no está internado; copia magnética o fotostática firmada y sellada en cada folio). **Honestidad sobre la fuente:** el PDF oficial está **escaneado como imagen** (`pdftotext` devuelve 46 bytes); el art. 23 se tomó de un análisis publicado que lo cita textual. **`[ABOGADO]` validar contra el texto oficial** y traer de ahí el dato que no pude conseguir: **los plazos de conservación de archivo activo y pasivo del expediente clínico**. Ese número define la retención y contradice o no el borrado a 90 días (A11).
- **SCP 0575/2016-S3** `[VERIFICADO vía cita secundaria]` — los médicos deben entregar el historial actualizado con el último diagnóstico. `[ABOGADO]` verificar cita.
- **Código Penal art. 302 (Revelación de secreto profesional)** `[VERIFICADO]` — quien por razón de su estado, ministerio, profesión, **empleo, oficio** o comisión conozca secretos y los revele sin justa causa, o los use en beneficio propio o ajeno, si de ello resulta perjuicio: **privación de libertad de 3 meses a 1 año y multa de 30 a 100 días**.
  - **Esto es lo más serio del informe `[INFERENCIA]`:** el personal de soporte de Onia que accede a datos clínicos entra en *"empleo u oficio"*. Una filtración no es solo un problema contractual de la empresa: es **exposición penal personal** de quien acceda. Justifica sin discusión (a) acuerdos de confidencialidad firmados por todo el que tenga acceso, (b) log de acceso de soporte a datos clínicos, (c) que el acceso de soporte requiera autorización del cliente y quede registrado. Y explica por qué el punto de auditoría clínica (§2.1) no es higiene: es la prueba.

**Consumidor — Ley 453 de 4-dic-2013** `[VERIFICADO]` — art. 19 contratos de adhesión; art. 21 términos claros, comprensibles y **en castellano**; **art. 22 cláusulas abusivas**: num. 1 excluir o limitar derechos del consumidor, num. 2 **facultad unilateral de modificar el contrato**, num. 3 **exonerar de responsabilidad al proveedor**, num. 5 **compartir información personal sin consentimiento**. Reglamento: DS 2130. Impacta B3 y B4. `[ABOGADO — pregunta previa]` **¿un cliente B2B (una clínica) califica como "consumidor"?** De eso depende todo el análisis.

**Conservación documental fiscal** `[VERIFICADO]` — **Ley 2492 art. 70 num. 8**: conservar libros, registros, comprobantes, *"medios de almacenamiento, datos e información computarizada"* **mientras el tributo no prescriba**. Prescripción: **8 años** (art. 59 modificado por **Ley 812 de 30-jun-2016**) `[ABOGADO]` confirmar redacción vigente y ampliaciones. **Código de Comercio art. 52**: mínimo **5 años**. → **Choque directo** con el borrado a 90 días (A11).

**NB/ISO/IEC 27001:2023** `[VERIFICADO]` — IBNORCA publica la norma boliviana (corresponde a ISO/IEC 27001:2022) y certifica SGSI. `[INFERENCIA]` **Ninguna norma boliviana obliga a un SaaS privado a certificar.** Es voluntaria. Ver §7.

### 3.4 Preguntas para el abogado (llevar estas, no "revisá esto")

1. **Ley 453**: ¿un cliente B2B que contrata SaaS es "consumidor"? De eso dependen B3 y B4.
2. **DS 1793 art. 56**: ¿norma general vinculante para un SaaS privado, o limitada a certificación digital por su ubicación en el Título V? ¿Lo invocamos como ley o lo adoptamos por contrato?
3. **Norma Técnica 64**: plazos de conservación de archivo activo y pasivo del expediente clínico. Sin ese número no se puede fijar la retención.
4. **Transferencia internacional de datos de salud** a un servidor fuera de Bolivia sin ley nacional: ¿basta consentimiento del paciente al cliente + DPA? ¿Hay que declararlo al paciente expresamente?
5. **Ley 3131 art. 10**: ¿tercerizar la custodia en un SaaS extranjero requiere autorización o notificación adicional?
6. **CP art. 302**: alcance sobre personal técnico no sanitario que accede por soporte. ¿Qué documento firmado reduce la exposición?
7. ¿DPA click-through alcanza para salud, o se necesita anexo firmado en la orden de servicio?
8. Notificación de brecha: ¿fijamos 72 h por contrato aunque ninguna ley boliviana lo exija? (recomendación `[INFERENCIA]`: sí — es diferenciador y es el estándar que va a traer la ley cuando salga).
9. `terminos.md:234-239`: ¿conciliación previa o arbitraje en vez de jueces de Santa Cruz?
10. Menores: artículo aplicable de la Ley 548 para el consentimiento parental (A18).

---

## 4. 2FA

### 4.1 Nuestras cuentas — qué activamos ya

**Antes de tocar un botón, dos reglas que cambian el orden de todo.**

`[VERIFICADO]` `GOTRUE_SMTP_ADMIN_EMAIL=oninteligenciaartificial@gmail.com`: **un Gmail personal es la identidad raíz de todo el stack.** `[INFERENCIA — verificar]` de ahí cuelgan GitHub, Vercel, Supabase, Meta, Brevo y Easypanel. Si cae ese Gmail, cae todo, incluida la recuperación de lo demás.

Y el agravante estructural, ya en memoria: **Sergio es menor de edad y la titular legal de OniaAgency es Leslie Mercado Moreno.** Eso obliga a:

1. **Los contactos de recuperación (teléfono y correo alterno) de TODAS las cuentas críticas deben ser de Leslie, no de Sergio.** Si la recuperación cuelga del mismo teléfono que se perdió, no hay recuperación.
2. **Titularidad legal:** banco y Meta Business a nombre de Leslie. Sergio opera; Leslie es titular y recuperadora. No mezclar.

**Regla base para las 9 cuentas:** TOTP en app (**no SMS** — SIM swap), **el mismo TOTP guardado también en el gestor de contraseñas de escritorio** (así el teléfono perdido no bloquea nada), y **códigos de respaldo impresos en papel** guardados físicamente donde vive Leslie. Nada de códigos de respaldo dentro del mismo teléfono que puede perderse.

| # | Cuenta | Por qué es crítica | Método | Recuperación |
|---|---|---|---|---|
| 1 | **Google** `oninteligenciaartificial@gmail.com` | Identidad raíz; es el `GOTRUE_SMTP_ADMIN_EMAIL` | Passkey + TOTP + códigos de respaldo | Passkey en 2º dispositivo + 10 códigos impresos + teléfono/correo **de Leslie** |
| 2 | **VPS / SSH** 187.77.16.63 | Producto y base con historias clínicas | Ya es **key-only** | 3ª llave offline en USB en casa de Leslie |
| 3 | **Easypanel** `:3000` | Panel de infra **expuesto a internet** | 2FA del panel **+ cerrar el puerto** | Códigos impresos |
| 4 | **GitHub** | Todo el código; 2FA **obligatorio desde 2-sep-2026** | TOTP + passkey | 16 códigos de recuperación + SSH key verificada |
| 5 | **Meta Business** | Pauta y activos comerciales | 2FA personal + exigencia "Solo admins" en el portafolio | **Leslie como segundo admin** del portafolio |
| 6 | **Banco (BCP/BNB)** | Plata. Titular = Leslie | Token digital del banco | Presencial en sucursal, **solo la titular** |
| 7 | **Vercel** | Deploy de `onia-center` + DNS autoritativo | TOTP o passkey | Recovery codes |
| 8 | **Supabase (supabase.com)** | Cuenta de plataforma + proyecto legacy | TOTP | **Segundo factor TOTP** (Supabase NO da códigos) |
| 9 | **n8n** (VPS) | Automatizaciones con credenciales de terceros dentro | 2FA nativo | Códigos de recuperación |

**Paso a paso:**

1. **Google** — `myaccount.google.com` → Seguridad → Verificación en 2 pasos → Comenzar → **app de autenticación** (no SMS como principal) → crear **passkey** en un segundo dispositivo (cubre contraseña y 2FA a la vez) → Códigos de respaldo → generar 10 → **imprimir** → poner teléfono y correo de recuperación **de Leslie**.
2. **VPS / SSH** — ya está bien. `sshd -T` `[VERIFICADO]`: `passwordauthentication no`, `pubkeyauthentication yes`, `kbdinteractiveauthentication no`, 3 llaves autorizadas. Contraseña deshabilitada = el SSH ya es "algo que tenés", no hace falta TOTP encima. **Pendientes:** `permitrootlogin yes` → `prohibit-password`, **fail2ban inactivo**, **ufw inactivo**, y una 3ª llave offline.
3. **Easypanel** — Authentication → activar 2FA, **y además cerrar el 3000 al público** (que se llegue por Traefik con dominio + TLS, o por túnel SSH). Un panel que controla todos los contenedores no debería estar en la internet abierta.
4. **GitHub** — Settings → Password and authentication → Enable 2FA → TOTP + **passkey** → **descargar los 16 códigos e imprimirlos**. Fecha dura: **después del 2-sep-2026 a las 00:00 UTC ya no se puede desactivar**; si está desactivado en esa fecha, el acceso queda restringido hasta reactivarlo.
5. **Meta Business** — cuenta personal: Seguridad e inicio de sesión → Autenticación en dos pasos → app. Portafolio: Configuración del negocio → Centro de seguridad → exigir 2FA → **"Solo administradores"**. **Agregar a Leslie como segundo administrador** — es la única recuperación real; Meta no restituye por soporte con facilidad.
6. **Banco (BCP)** — token digital integrado en la Banca Móvil; el rol Preparador pide además PIN del token y número aleatorio de un minuto. **Titular = Leslie.** Recuperación presencial con CI de la titular. Único caso donde no aplican los códigos impresos.
7. **Vercel** — Account Settings → Authentication → Two-Factor Authentication → TOTP o passkey → **guardar los recovery codes**. Con equipo: Team Settings → Security & Privacy → enforce 2FA.
8. **Supabase** — Account Settings → Multi-Factor Authentication → TOTP. **Ojo: al activarlo se cierran todas las demás sesiones** — hacerlo en un momento tranquilo. **Supabase NO entrega códigos de recuperación**; su recomendación explícita es **registrar un segundo factor TOTP de respaldo**, en el mismo acto, no "después".
9. **n8n** — Settings → Personal → activar 2FA → escanear QR → **guardar los códigos de recuperación**. Sin ellos y sin el autenticador, el bloqueo es permanente.

### 4.2 2FA para los clientes en el producto — qué cuesta

**El backend ya lo soporta. Lo que falta es 100% producto.** `[VERIFICADO]`

| Capa | Estado | Evidencia |
|---|---|---|
| Código del producto | **Cero MFA** | `grep "mfa\|totp\|factor\|aal2\|enroll"` sobre `app/ lib/ components/` → 0 coincidencias reales |
| GoTrue self-hosted | `supabase/gotrue:v2.189.0`, sano | `curl https://app.onia.com.bo/supabase/auth/v1/health` → `{"version":"v2.189.0"}` |
| Config MFA en el contenedor | **Ninguna `GOTRUE_MFA_*` definida** | `docker inspect dentalgest-staging-supabase-auth` |
| Default de GoTrue | `MFA_TOTP_ENROLL_ENABLED` = **true** por defecto; hasta 10 factores | docs Supabase / DeepWiki env reference |
| Endpoint vivo | `POST /auth/v1/factors` → `401 no_authorization` (existe y está ruteado, solo falta el Bearer) | `curl -X POST .../auth/v1/factors -H "apikey: <anon>"` |
| Enrolamientos reales | **0** | `psql -c "select count(*) from auth.mfa_factors"` → `0` |

**Conclusión dura: no hay nada que "encender" en GoTrue. La API TOTP ya responde.**

| Pieza | Archivo | Esfuerzo | Riesgo |
|---|---|---|---|
| **(a) UI de enrolamiento** | nuevo `app/(dashboard)/settings/security/MfaEnroll.tsx`, montado en `SettingsClient.tsx`. Flujo: `mfa.enroll({factorType:'totp'})` → QR + secret → `challenge` → `verify` → la sesión sube a **aal2** | 1 componente + 1 server action | Bajo |
| **(b) Paso de verificación en login** | `app/(auth)/login/page.tsx:115` hoy hace `signInWithPassword` y salta a `router.push("/dashboard")` (`:127`). Insertar `getAuthenticatorAssuranceLevel()`: si `aal1 → aal2` pendiente, pedir los 6 dígitos antes de navegar | Medio, misma pantalla | Bajo |
| **(c) Enforcement server-side — NO se puede saltear** | `proxy.ts:63` y `lib/auth.ts:51` usan `supabase.auth.getUser()`, que **devuelve el usuario igual si la sesión es aal1**. Un usuario con TOTP enrolado que no completa el segundo paso **ya tiene sesión válida**. Sin (c), el 2FA es puramente cosmético. Fix: leer el claim `aal` (o `getAuthenticatorAssuranceLevel()` server-side) y redirigir a `/login/mfa` | Pocas líneas | **ALTO** — `proxy.ts` es la puerta de todo el producto; un bug ahí deja a todos afuera. **Exige test E2E antes de mergear** |
| **(d) Códigos de respaldo** | **Supabase no los da.** Su recomendación oficial es registrar un **segundo factor TOTP**. Opción perezosa (recomendada): no construirlos — segundo TOTP + reset asistido por SUPERADMIN vía `service_role` (borrar la fila en `auth.mfa_factors`). Opción completa solo si un cliente la exige: tabla `mfa_recovery_codes` con 10 códigos **hasheados** y `used_at` | 0 (perezosa) / 1 día (completa) | La completa es código de seguridad propio: exige tests |
| **(e) Google OAuth** | Google está activo (`"google": true` en `/auth/v1/settings`). Supabase trata el login social como **aal1** igual que email+password: **sí se puede enrolar TOTP y sí se puede forzar aal2**, sin excepción que programar. La decisión es de producto: no podemos leer el AAL de Google, así que "confiar en que Google ya lo hizo" es un supuesto no verificable. **Con historias clínicas: exigir TOTP también a los de Google** | 0 | — |

**Total realista: 1 día de desarrollo + medio día de E2E**, si se hace en el orden (c) → (b) → (a). Al revés se shippea teatro.

**Alcance recomendado `[INFERENCIA]`:** obligatorio para `ADMIN` y `SUPERADMIN`; opcional para `DOCTOR` y `STAFF` en la primera versión, obligatorio para todo el que tenga `clinical.read` en la segunda. Forzar 2FA a una recepcionista el día 1 mata la adopción; forzarlo al dueño de la clínica es vendible como garantía.

### 4.3 Lo que se arregla sin escribir código (env vars y roles)

- `GOTRUE_PASSWORD_MIN_LENGTH=12` — hoy el piso real del servidor es **6**. La UI valida 8 solo en el navegador (`app/update-password/page.tsx:37`) y `updateUser({password})` pega **directo a GoTrue**, así que con `curl` el piso vuelve a 6.
- Apagar `GOTRUE_EXTERNAL_PHONE_ENABLED` y `GOTRUE_SMS_AUTOCONFIRM` — hoy `phone_autoconfirm: true` con `sms_provider: ""` permite crear cuentas confirmadas contra números arbitrarios sin OTP. **En prod hay 0 usuarios con teléfono**: apagarlo es gratis.
- Limpiar `GOTRUE_URI_ALLOW_LIST` — todavía permite `https://dentalgest.app`, `https://www.dentalgest.app` y `http://127.0.0.1:55321`. Superficie de redirect innecesaria.
- **Crear el SUPERADMIN que no existe** — hoy `/admin/**` es inalcanzable y no se pueden aprobar pagos de clientes.
- **`[VERIFICAR] a mano:** que la recuperación de contraseña funciona. Corrijo un supuesto de entrada: **son dos SMTP distintos.** El roto es el de la app (nodemailer, `SMTP_*` en el contenedor `onia-platform`). La recuperación la manda **GoTrue** con su propio `GOTRUE_SMTP_*`, y ese apunta a `smtp-relay.brevo.com:587` con user `a7e058001@smtp-brevo.com` y un pass de 30 caracteres que **no** es placeholder. Probablemente funciona — pero probarlo exige mandar un correo real, o sea escritura en producción. **Probarlo con una cuenta de prueba antes de asumirlo.** Todo el orden de §2.1 (verificación de correo) depende de ese dato.

---

## 5. Cloudflare

### 5.1 Recomendación

**Sí, y ya.** Plan **Free (USD 0)** ahora; **Pro (USD 20/mes anual)** recién cuando haya clínicas pagando con datos clínicos en producción; **Business (USD 200/mes) no se justifica** — nada de lo que agrega resuelve un problema que Onia tenga hoy.

Pero el valor real **no es el WAF**: es **Zero Trust Access + Tunnel**, que es la solución al riesgo #1 (poner el panel Easypanel detrás de login corporativo con MFA sin exponerlo). Y hay una condición sin la cual todo esto es cosmético: **mientras no se cierre el firewall del origen, cualquiera esquiva Cloudflare pegándole directo a `187.77.16.63`.** Ese es el paso que casi todos saltean.

### 5.2 Qué resuelve realmente

| Capacidad | Plan | Qué problema de Onia resuelve HOY |
|---|---|---|
| **Zero Trust / Access** | **Gratis hasta 50 usuarios** | **Panel Easypanel detrás de login + MFA sin exponerlo. Es la solución al riesgo #1.** |
| **Cloudflare Tunnel** (`cloudflared`) | Gratis | Cierra 22/80/443/3000/8091/8099: el VPS solo hace conexiones **salientes**. Sin puertos de entrada no hay superficie que escanear |
| DDoS unmetered | Gratis | Un VPS único no aguanta un L7 de 5.000 rps; hoy no hay nada delante |
| **Free Managed Ruleset** (WAF) | Gratis | Reglas contra vulnerabilidades de alto impacto. El ruleset Cloudflare + OWASP CRS completos son **solo Pro+** |
| Bot Fight Mode | Gratis | Frena credential stuffing básico contra `/login` (riesgo #4) |
| Rate limiting | Gratis: **1 regla**, solo por IP, período mínimo 10 s | Alcanza para exactamente una cosa: limitar POST a `/login`. Nada más |
| Cache / CDN | Gratis | Marginal: el tráfico es bajo y la landing ya cachea en Next |

**Lo que Cloudflare NO resuelve, y conviene decirlo:** no arregla el correo, no hace backups, y **no elimina el punto único de falla** — con el VPS muerto, Cloudflare sirve un error 5xx con mejor diseño. Es defensa, no continuidad.

### 5.3 Migración sin romper el TLS actual

**⚠️ La trampa Full vs Flexible, primero, porque es la que rompe todo.** Cloudflare recomienda **Full** o **Full (strict)**. Con **Flexible**, Cloudflare habla HTTP con el origen y Traefik responde `308 → https://…`, que Cloudflare vuelve a servir por HTTP: **bucle de redirección infinito**. Y aunque no hiciera bucle, el tramo Cloudflare→VPS iría **en texto plano por internet**: historias clínicas sin cifrar. **Flexible está prohibido en este caso. Fijar Full (strict) ANTES de encender la nube naranja.**

**Estado de partida `[VERIFICADO]`:** `onia.com.bo` y `app.onia.com.bo` → A directo a `187.77.16.63`, sin `CF-Ray` ni proxy. NS = `ns1/ns2.vercel-dns.com`. Certs Let's Encrypt (CN=YR2) válidos 1-ago → 30-oct-2026. TLS 1.2/1.3 aceptan, 1.0/1.1 rechazan. HTTP→HTTPS `308`. Sin AAAA. CAA `[VERIFICAR]` (el resolver de Windows no devolvió el tipo).

**Orden de ejecución:**

1. **Crear la zona `onia.com.bo` en Cloudflare (Free).** Cloudflare importa los registros. **Auditar la importación registro por registro contra el DNS actual de Vercel antes de tocar nada**: A `onia`, A `app`, los 5 MX de Google, los 2 TXT de verificación (Facebook/Google), y cualquier CNAME. **Un MX perdido = correo caído.**
2. **Aprovechar para agregar lo que falta** (§2.1): `v=spf1 include:_spf.google.com ~all`, DKIM de Google Workspace, y `_dmarc` en `p=none` con `rua=` — arrancar en `none`, medir 2 semanas, después subir a `quarantine`.
3. **SSL/TLS → Full (strict)** en el dashboard, **antes** de proxear nada.
4. **Dejar TODOS los registros en gris (DNS only)** en esta etapa.
5. **Cambiar los NS en el registrador `.com.bo` (NIC Bolivia)** a los dos de Cloudflare. TTL del SOA = 600 s, pero la delegación de `.bo` puede tardar horas. **Ventana de baja actividad.**
6. **Verificar en gris**: curl a ambos hosts, mandar y recibir un correo de prueba.
7. **Recién ahí, nube naranja de a un host por vez**: primero `onia.com.bo`, verificar, después `app.onia.com.bo`.
8. **Resolver Let's Encrypt.** Con proxy encendido, el desafío HTTP-01 de Traefik puede seguir andando (Cloudflare pasa `/.well-known/acme-challenge/`), pero **es frágil**: se rompe con "Always Use HTTPS", con reglas del WAF, o si mañana se cierra el 80. Dos salidas, en orden de preferencia:
   - **(a) Traefik a DNS-01 con el proveedor Cloudflare**, con API token **acotado** (`Zone:DNS:Edit` solo sobre `onia.com.bo`). Bonus: habilita wildcard.
   - **(b) Cloudflare Origin CA** — certificado de 15 años válido solo para el tramo Cloudflare→origen, combinado con Full (strict). Elimina la renovación del origen.
   - ⚠️ `[VERIFICAR]` Easypanel administra Traefik y su config ACME. El cambio hay que hacerlo **por Easypanel** o se sobrescribe en el próximo deploy.
9. **Cerrar el origen — el paso que hace que todo lo anterior sirva.** `ufw`: permitir 80/443 **solo desde los rangos de Cloudflare** (`cloudflare.com/ips`, con job de actualización). **Cerrar 3000, 8091 y 8099.** **SSH fuera de internet:** Tunnel + Access (`cloudflared access ssh`), o como mínimo solo clave pública, `PermitRootLogin prohibit-password`, fail2ban y allow-list de IP.
10. **Panel Easypanel detrás de Access:** publicarlo con hostname propio (`panel.onia.com.bo`) vía Tunnel, con política que exija identidad + MFA y limite a Sergio y Leslie. Nunca más expuesto por IP.
11. **Restaurar la IP real en Traefik** (`CF-Connecting-IP` / trusted IPs de Cloudflare), o todos los logs, rate limits y auditorías van a ver IPs de Cloudflare en vez del cliente. Detalle chico que arruina cualquier investigación posterior.

**Reversión:** volver los NS a Vercel. **Guardar un export completo del DNS actual antes de empezar.**

**Bonus mientras se está adentro:** borrar el comodín DNS (`zzz-noexiste-test.onia.com.bo` resuelve y devuelve 404 de Vercel — riesgo teórico de subdomain takeover, `[INFERENCIA]` moderado porque Vercel exige verificación por TXT) y portar a la landing el bloque `headers()` que el producto sí tiene (`onia-platform/next.config.ts:56-95`): `web-factory/apps/onia-platform/next.config.ts` tiene 40 líneas y **cero** `headers` `[VERIFICADO]`, así que `onia.com.bo` sirve sin HSTS, sin CSP, sin `X-Frame-Options` y sin `nosniff`.

---

## 6. Backups y continuidad

### 6.1 El plan, con costo

**Off-site cifrado a Cloudflare R2, con `rclone`, todas las noches.** Reemplaza al script actual, no lo duplica.

Precios oficiales R2: almacenamiento Standard **USD 0.015/GB-mes** (10 GB-mes gratis), Clase A USD 4.50/millón (1 M gratis), Clase B USD 0.36/millón (10 M gratis), **egress GRATIS**.

| Tamaño del dump | Total almacenado (30 copias) | Costo mensual |
|---|---|---|
| 500 MB | 15 GB | **USD 0.08** |
| 2 GB | 60 GB | **USD 0.75** |
| 5 GB | 150 GB | **USD 2.10** |

Un backup nocturno queda muy por debajo del millón de operaciones Clase A gratis.

**Alternativa evaluada — Backblaze B2:** USD 6.95/TB-mes, 10 GB gratis, egress gratis hasta 3× lo almacenado. Para 60 GB sale ~USD 0.42/mes: **más barato en almacenamiento, pero R2 gana igual** — el egress de R2 es gratis *sin techo*, y el día que restaurás querés bajar todo sin pensar en la factura; además ya vas a tener cuenta Cloudflare por §5, o sea un proveedor menos, una factura menos, un secreto menos.

**Descartado:** S3/GCS/Azure (egress caro justo en el momento del desastre) y depender solo de snapshots del proveedor del VPS (mismo dominio de falla ante un problema de cuenta).

**Cifrado, no negociable.** Los dumps traen historias clínicas, alergias, tipo de sangre y comprobantes bancarios. Subir eso en claro a un tercero es cambiar un riesgo por otro. `rclone crypt` o `age`/`gpg --symmetric` antes de subir, con **la llave guardada FUERA del VPS** (gestor de contraseñas de Leslie + copia física). Una llave que solo vive en el servidor que se quemó es una llave perdida.

```
pg_dump → gzip → age -r <clave-pública> → rclone copy a r2:onia-backups/YYYY-MM-DD/
        → rclone delete --min-age 30d
        → verificar exit code y avisar a Telegram si falla
```

**El aviso de falla es parte del backup.** Un cron que falla en silencio durante semanas ya pasó en este repo (`sync-onia-core.mjs`, documentado en CLAUDE.md). Mismo patrón, consecuencia mucho peor.

### 6.2 La prueba de restauración — obligatoria, mensual

Sin esto, todo lo anterior es teatro.

1. Levantar un Postgres descartable (contenedor local o VPS temporal), **nunca contra producción**.
2. Bajar el backup de anoche desde R2, descifrar, `pg_restore`.
3. **Verificación con canarios**: contar filas de 3 tablas clave (pacientes, citas, facturas) y comparar contra un `SELECT count(*)` de solo lectura en producción. Que restaure sin error **no** prueba que restauró completo.
4. Probar que la app arranca contra esa DB (una consulta de login).
5. **Cronometrar.** Ese número es el RTO real, no el que gustaría tener.
6. Anotar fecha, tamaño, duración y resultado en un log versionado. **Destruir la copia de prueba** (contiene datos clínicos reales).

**Meta a fijar: RPO ≤ 24 h, RTO ≤ 4 h**, revisado el primer lunes de cada mes.

### 6.3 Punto único de falla — respuesta honesta

En un solo servidor conviven: producto Next, Supabase self-hosted (Postgres + GoTrue + Storage), landing, n8n, Chatwoot, LiteLLM, Traefik y Easypanel. No hay réplica, ni failover de DNS, ni segunda región.

- **Se cae un servicio** (Traefik, un contenedor, OOM): producto caído hasta intervención manual. Minutos u horas.
- **Se cae el host** (kernel, disco, red del proveedor): todo caído. Recuperación = esperar al proveedor. **Sin control sobre el tiempo.**
- **Se pierde el host** (disco muerto, cuenta suspendida, ransomware): **hoy es pérdida total del negocio.** Los backups mueren con él. Esta es la frase importante del informe.

Agravante: **Uptime Kuma corre en el mismo VPS**. El monitor muere con lo monitoreado. Hoy Onia se entera de una caída porque llama un cliente.

**Plan mínimo viable, por retorno sobre esfuerzo:**

**Nivel 1 — esta semana (~USD 1/mes, medio día).** Convierte "pérdida total" en "caída de unas horas". Es el único nivel realmente urgente:
1. Backup off-site cifrado a R2 + alerta si falla (§6.1).
2. **Una restauración probada** (§6.2). Sin esto el nivel 1 **no está hecho**.
3. **Infra como código**: `docker-compose` / export de la config de Easypanel versionado en git, y **todas las variables de entorno en un gestor de contraseñas fuera del VPS**. Sin esto, "restaurar" significa reconstruir 15 servicios de memoria a las 3 de la mañana.
4. **Runbook escrito de reconstrucción**: VPS nuevo → Docker → restore → DNS → verificar. Una página. Probado una vez.

**Nivel 2 — este mes (USD 0–20/mes):** monitoreo **externo** al VPS (health checks de Cloudflare o Better Stack free) · página de estado fuera del VPS (Cloudflare Pages, gratis) — sobrevive a la caída y es lo que mirás a un cliente a la cara · snapshots del proveedor como **complemento**, no reemplazo.

**Nivel 3 — NO hacer todavía:** réplica caliente, segundo VPS, standby de Postgres, multi-región. Duplica costo y complejidad operativa para atacar el escenario menos probable, mientras el garantizado (nivel 1) sigue abierto. Reevaluar con ~10 clínicas pagando o un contrato con SLA escrito.

---

## 7. Lo que NO hay que hacer

Seguridad de teatro: gasta tiempo y plata sin bajar el riesgo real.

1. **No certificar ISO 27001 ahora.** `[VERIFICADO]` NB/ISO/IEC 27001:2023 (IBNORCA) es **voluntaria**; ninguna norma boliviana obliga a un SaaS privado. Cuesta miles de dólares y meses, y **no tapa ninguno de los 5 riesgos del top**. Su valor es comercial frente a clínicas grandes, no de cumplimiento. Retomarlo cuando un cliente lo pida por escrito en una licitación.
2. **No contratar Cloudflare Business (USD 200/mes).** Nada de lo que agrega (5 reglas de rate limit, SLA 100%) resuelve un problema actual. Free primero, Pro cuando haya clínicas pagando.
3. **No poner el WAF en modo bloqueo agresivo antes de cerrar el firewall del origen.** Mientras `187.77.16.63` responda desde cualquier IP, el WAF se esquiva pegándole directo. Es la definición de teatro.
4. **No construir códigos de respaldo MFA propios.** Supabase recomienda un segundo factor TOTP; construir tabla, hashing y flujo de consumo es código de seguridad propio que hay que testear, para reemplazar algo que se resuelve registrando un segundo autenticador.
5. **No banner de cookies bloqueante tipo GDPR.** `[INFERENCIA]` Bolivia no tiene ley de datos y el DS 1793 no regula cookies. Lo exigible es el **deber de información** (art. 56 inc. c): alcanza una sección de cookies clara y un enlace de opt-out. Un banner molesta al usuario, baja la conversión y no agrega cumplimiento.
6. **No cifrado a nivel de campo (columna por columna) en la base todavía.** Es caro, rompe búsquedas y ordenamientos, complica los backups — y **no protege contra el vector real**, que es una credencial del panel con acceso a la app entera. Primero cifrado de volumen y backups cifrados; el cifrado de campo se evalúa después, si un cliente lo exige.
7. **No réplica multi-región ni segundo VPS.** Ver §6.3 nivel 3.
8. **No rotación forzada de contraseñas cada 90 días.** NIST desaconseja la caducidad periódica desde SP 800-63B: produce `Password2026!` y contraseñas anotadas. Lo que baja el riesgo es **mínimo de 12 caracteres + 2FA + chequeo contra filtraciones**, no el calendario.
9. **No SMS como segundo factor.** SIM swap. TOTP en app, y passkey donde exista.
10. **No pentest externo pagado antes de cerrar los P0 conocidos.** Un pentest hoy devolvería exactamente lo que dice este informe (panel abierto, sin WAF, sin 2FA) y cobraría por decirlo. Contratarlo **después**, para validar que quedó bien cerrado.
11. **No publicar "cumplimos ISO / GDPR / estándares internacionales" en la landing.** Además de falso hoy, agrega una afirmación más que corregir. La honestidad de `terminos.md:164-177` (declarar que no hay SLA ni redundancia) es mejor argumento comercial que un sello inventado.
12. **No arreglar la política antes de arreglar la infraestructura que describe** — al revés se arregla dos veces. Excepción: **borrar** las afirmaciones falsas se hace ya (A8), porque una promesa falsa es peor que una omisión.

---

## 8. Fuentes

**Normativa boliviana:** [DS 1793 texto oficial (oopp.gob.bo)](https://www.oopp.gob.bo/wp-content/uploads/2021/07/2013-DS1793-Reglamento-Ley-164.pdf) · [DS 1793 (Lexivox)](https://www.lexivox.org/norms/BO-RE-DSN1793.html) · [Ley 164 art. 56 (Infoleyes)](https://bolivia.infoleyes.com/articulo/55665) · [Ley 3131 (Lexivox)](https://www.lexivox.org/norms/BO-L-3131.html) · [DS 28562 (Lexivox)](https://www.lexivox.org/norms/BO-DS-28562.html) · [Norma Técnica 64 (minsalud.gob.bo, PDF escaneado)](https://www.minsalud.gob.bo/images/Documentacion/dgss/Area_de_Calidad/64%20Norma%20expediente%20clinico.pdf) · [Análisis art. 23 Norma Técnica](https://medium.com/@mrduranch/expediente-clinico-bolivia-3282020fa4ae) · [Ley 453 (Lexivox)](https://www.lexivox.org/norms/BO-L-N453.html) · [DS 2130](https://www.lexivox.org/norms/BO-RE-DSN2130.html) · [Ley 2492 Código Tributario](https://www.ait.gob.bo/wp-content/uploads/2023/04/Ley-2492-Codigo_Tributario_Boliviano.pdf) · [Código de Comercio](https://www.lexivox.org/norms/BO-COD-DL14379.html) · [Código Penal art. 302](https://bolivia.infoleyes.com/articulo/32639) · [Ley 1080](https://www.lexivox.org/norms/BO-L-N1080.html) · [Anteproyecto AGETIC 2024](https://agetic.gob.bo/sites/default/files/2025-06/DATOS-PERSONALES-PRESENTACION-ANTEPROYECTO-DE-LEY-2024-firmado.pdf) · [Anteproyecto InternetBolivia](https://misdatos.internetbolivia.org/docs/anteproyecto_ley_de_proteccion_datos_personales_InternetBolivia.pdf) · [Primera ley municipal de datos, Coroico (Ferrere)](https://www.ferrere.com/en/news/se-promulga-la-primera-ley-municipal-sobre-el-gestion-de-datos-personales-en-bolivia/) · [IBNORCA NB/ISO/IEC 27001:2023](https://www.ibnorca.org/tienda/catalogo/detalle-norma/nb/iso/iec-27001:2023-nid=3801-5)

**2FA y auth:** [Supabase MFA TOTP](https://supabase.com/docs/guides/auth/auth-mfa/totp) · [Supabase auth-mfa (AAL)](https://supabase.com/docs/guides/auth/auth-mfa) · [Supabase platform MFA](https://supabase.com/docs/guides/platform/multi-factor-authentication) · [Supabase self-hosted phone/MFA](https://supabase.com/docs/guides/self-hosting/self-hosted-phone-mfa) · [DeepWiki supabase/auth env reference](https://deepwiki.com/supabase/auth/2.1-environment-variables-reference) · [README supabase/auth](https://raw.githubusercontent.com/supabase/auth/master/README.md) · [GitHub 2FA obligatorio](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/about-mandatory-two-factor-authentication) · [GitHub recuperación 2FA](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/recovering-your-account-if-you-lose-your-2fa-credentials) · [Vercel 2FA](https://vercel.com/docs/two-factor-authentication) · [Vercel 2FA team enforcement](https://vercel.com/changelog/2fa-team-enforcement) · [n8n 2FA](https://docs.n8n.io/user-management/two-factor-auth/) · [Meta Business 2FA](https://www.facebook.com/business/help/280940009201586) · [Google verificación en 2 pasos](https://support.google.com/accounts/answer/185839?hl=es-419) · [Google códigos de respaldo](https://support.google.com/accounts/answer/1187538?hl=es-419) · [BCP Bolivia Seguridad Empresas](https://www.bcp.com.bo/Empresas/SeguridadEmpresas/Seguridad) · [BCP Creditoken Virtual](https://www.bcp.com.bo/Personas/CanalesAtencion/CreditokenVirtual) · [Easypanel 2FA](https://easypanel.io/docs/templates/2fauth)

**Borde e infra:** [R2 Pricing](https://developers.cloudflare.com/r2/pricing/) · [Cloudflare SSL/TLS modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/) · [Rate limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/) · [WAF Managed Rules](https://developers.cloudflare.com/waf/managed-rules/) · [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) · [Cloudflare plans](https://www.cloudflare.com/plans/) · [Zero Trust free 50 usuarios](https://blog.cloudflare.com/teams-plans/) · [Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/) · [Traefik ACME challenges](https://doc.traefik.io/traefik/reference/install-configuration/tls/certificate-resolvers/acme/) · [Backblaze B2 pricing](https://www.backblaze.com/cloud-storage/pricing) · [Next.js GHSA-955p-x3mx-jcvp](https://github.com/advisories/GHSA-955p-x3mx-jcvp)

**Código y producción (verificado hoy):** repo producto `C:\dev\proyectos\onia-platform` @ `6b8f152` · `prisma/migrations/**` · `supabase/migrations/20260502_enable_realtime_appointments.sql` · `supabase/migrations/20260629_dentalgest_namespace.sql` · `lib/{prisma,encryption,audit,n8n-auth,auth,rate-limit-redis}.ts` · `lib/onia-core/{roles,access-control,agents-auth}.ts` · `proxy.ts` · `next.config.ts` · `app/api/**` · `app/print/**` · `docs/ROTATION_STATUS_2026-06-01.md` · worktree docs `web-factory/apps/onia-platform/{next.config.ts,src/content/legal/*}` · SSH/psql/curl contra `187.77.16.63` y `app.onia.com.bo`.

---

## Anexo — orden de ataque consolidado

**Hoy (sin escribir código de producto):**
1. Correr los 3 comandos de §2.2. Si el tercero da 200 → **incidente**, parar todo lo demás.
2. Cerrar `:3000`, `:8091` y `:8099` en firewall. Matar el `http.server` de hermes-assets.
3. `GOTRUE_PASSWORD_MIN_LENGTH=12` + apagar `GOTRUE_EXTERNAL_PHONE_ENABLED` y `GOTRUE_SMS_AUTOCONFIRM`.
4. Probar a mano que el SMTP de GoTrue manda la recuperación.
5. Crear el SUPERADMIN que no existe (hoy no se pueden aprobar pagos de clientes).
6. Borrar de la política toda afirmación de seguridad no verificada (A8, A5, A21).

**Esta semana:**
7. Backup off-site R2 cifrado + alerta + **una restauración probada**.
8. `npm audit fix` (sin `--force`) → cierra GHSA-955p-x3mx-jcvp de Next.
9. Permission gate en las 2 páginas `/print`. `createClient()` → `createAdminClient()` en `admin/global-users`.
10. fail2ban + ufw + `permitrootlogin prohibit-password`.
11. 2FA en las 9 cuentas propias, con recuperación a nombre de **Leslie**.
12. Cloudflare Free: zona, Full (strict), SPF+DKIM+DMARC, NS, naranja, cerrar origen, Access para el panel.

**Este mes:**
13. MFA del producto para ADMIN/SUPERADMIN, **empezando por el enforcement server-side**.
14. Auditoría de acceso **concedido** a historia clínica.
15. Rotar `ENCRYPTION_KEY` (requiere escribir el script de re-encriptado) + los 6 secretos pendientes.
16. Documentos legales: una sola fuente, DPA completo, consentimiento del paciente, sesión con abogado sobre las 10 preguntas de §3.4.

**Después:** RLS + rol de app sin `BYPASSRLS` + suite de tests cross-tenant + `strict: true` en tsconfig.
