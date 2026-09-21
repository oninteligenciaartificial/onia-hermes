# Handoff — continuar la 1.0 en Codex

> Escrito el **2026-09-21** por la sesión de Claude Code que venía del bloque de UI
> (patrón Hostinger) y del deploy del 18/19-sep. **Se escribió porque se acaban los
> créditos de esta cuenta**: lo que sigue lo continúa Codex.
>
> Todo lo que dice este documento fue **verificado en vivo el 21-sep**, no recordado.
> Donde no se pudo verificar, dice NO VERIFICADO.

---

## 1. Objetivo

**Dejar la versión 1.0 vendible**: que un dueño de negocio boliviano se registre, pague,
y use el sistema por rubro + el chatbot de WhatsApp, sin que Sergio Urcullo tenga que
tocar nada por cada cliente.

**Definición de "hecho"**: el circuito registro → prueba → cobro → activación →
sistema + chatbot funciona punta a punta en producción, y un cliente puede conectar su
propio WhatsApp sin intervención nuestra.

**Estado: NO cumplido todavía.** Faltan las dos cosas del §6 (lo que depende de Sergio
Urcullo) y la cola del §7. Todo lo demás del circuito está vivo.

---

## 2. Qué quedó EN PRODUCCIÓN (verificado el 21-sep)

| Qué | Evidencia |
|---|---|
| **Panel vivo** en `app.onia.com.bo` | login HTTP 200; BUILD_ID vivo `9tuk1Qk2BjQ2j2HdJcL8u` (build `251f64c`) |
| **Navegación de secciones estilo Hostinger** en `/settings` y `/settings/chatbot` | commit `c51a33de`; `data-seccion` presente en el bundle vivo (`runtime-next/.next/static/chunks/`) y mirado renderizado con cuenta real |
| **Motor del chatbot** en `onia-center:3020` | `/health` → `ok:true`, `db.ok:true`, knowledge `v4` desde el panel (`source:"panel"`, 6 productos, 3 FAQ) |
| **14 commits del carril `chatbots-platform-review`** posteriores al mío, ya deployados | `git log c51a33de..origin/master` = 14; incluyen fixes de cupo, inbox, portal del paciente, equipo/coadmins y horarios que el motor rechazaba |
| 2FA obligatoria solo para SUPERADMIN; `/settings` sin venta para cuentas internas | desplegado el 18-sep, sigue vivo |

**Árboles limpios**: `onia-platform-v1-candidate` en `master` sin cambios sin commitear y
0 commits sin pushear. El worktree de `onia-hermes` (`claude/cobro-e2e-punto-1-25ba65`)
también limpio. **Nada en vuelo, nada se pierde.**

---

## 3. 🔴 Lo que se encontró CAÍDO hoy (y se arregló, pero la causa sigue viva)

**El motor del chatbot estaba MUERTO desde el 19-sep ~19:00 UTC.** Dos días sin
contestar WhatsApp. `webhook-server.sh status` devolvía `{"ok":false,"reason":"no responde"}`
y el puerto 3020 no escuchaba.

**Causa raíz**: un sync dejó los archivos del bot **anidados un nivel de más** dentro del
contenedor — `/tmp/onia-bot/bot/webhook-server.mjs` en vez de `/tmp/onia-bot/webhook-server.mjs`.
El arranque moría con `MODULE_NOT_FOUND` y, peor, el `.stamp` del 19-sep hacía creer al
script que ya estaba sincronizado, así que **no se volvía a copiar solo**.

**Arreglo aplicado hoy** (paliativo, el servicio está vivo):
```
docker exec onia-center sh -c "cp -a /tmp/onia-bot/bot/. /tmp/onia-bot/ && rm -rf /tmp/onia-bot/bot"
/opt/onia/bot/webhook-server.sh start
```

**⚠️ LO QUE FALTA — TAREA PARA CODEX (alta prioridad):**
1. **Encontrar qué sync anidó la carpeta** y arreglarlo en la fuente. Sospechoso principal:
   `deploy-bot.sh` o el bloque de sync de `webhook-server.sh` (usa `docker cp` con `$DEST`;
   `docker cp origen/. destino` vs `docker cp origen destino` es exactamente la diferencia
   que produce el anidamiento). Fuente del bot: `hermes-content/deploy/vps-ops/bot/` en
   `onia-hermes`, se deploya desde el checkout `/root/loops/onia-hermes`.
2. **Poner una sonda que avise**: el bot puede morir y nadie se entera. Hay n8n con Telegram
   a Sergio Urcullo ya funcionando (workflow `AooUOwSMSAaFLQnA`): agregarle un check horario
   de `webhook-server.sh status` que avise SOLO si `ok:false`. Sin esto, el próximo silencio
   de dos días se repite.

---

## 4. Archivos y cambios que importan para retomar

**Producto** (`onia-platform`, branch `master`):
- `app/(dashboard)/settings/secciones.ts` — modelo puro de las 6 secciones de `/settings`.
  **Reemplazó a `avanzado.ts`** (borrado). Si agregás un ajuste, va acá y su bloque en el
  `switch` de `SettingsClient.tsx`; el test lo exige.
- `app/(dashboard)/settings/SettingsClient.tsx` — nav lateral (desktop) + chips (móvil),
  una sección visible por vez, deep-link `#hash`.
- `app/(dashboard)/settings/secciones.test.ts` — los guards de que nada se perdió.
- `app/(dashboard)/settings/chatbot/ChatbotClient.tsx` — barra 01/02/03 navegable.
  ⚠️ Las secciones quedan **montadas y ocultas por CSS** a propósito: `bloque-cita.test.ts`
  renderiza el HTML estático completo y desmontarlas lo rompe.

**Runbooks que se usaron y funcionan** (no reinventar):
- Deploy del panel: `/opt/onia-platform/build-and-stage.sh <ref>` (lanzar con
  `setsid nohup … </dev/null &`; log `build-<sha7>.log`) → gate del CI verde **verificado por
  RUN ID** (`gh run view <id> --json conclusion`; `gh run list --limit 1` agarra el run viejo
  y da falsos rojos) → `/opt/onia-platform/deploy-gates-swap.sh <sha7>` (5 gates + backup) →
  smoke (login 200, chunk viejo 404 con cache-buster contra el origen, `docker logs`).
- Bot: `/opt/onia/bot/webhook-server.sh start|stop|status|logs|knowledge`.
- Mirar el panel sin contraseñas: magic link por la Admin API de GoTrue **desde dentro del
  VPS** (`docker exec onia-platform sh -c "wget … http://auth:9999/admin/generate_link"`),
  luego `https://app.onia.com.bo/auth/confirm?token_hash=<X>&type=magiclink&next=/settings`.
  El link es de **un solo uso**: si se venció, se genera otro.

---

## 5. Intentos fallidos (para no repetir el callejón)

- **`next dev` con Turbopack no arranca en `onia-platform-v1-candidate`**: muere con
  *"Symlink [project]/node_modules is invalid, it points out of the filesystem root"* porque
  `node_modules` es un junction a `onia-platform`. **Se levanta con `npx next dev --webpack`**,
  y además hay que pasarle `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  (valores placeholder alcanzan) o `proxy.ts` tira 500 en toda ruta.
- **`setState` dentro de un `useEffect` lo rechaza el lint del CI** (`react-hooks/set-state-in-effect`).
  El salto automático a la sección con error se resolvió en el handler que recibe el rechazo,
  no en un efecto. Mismo espíritu que el bug de `useRef` leído en render de la semana pasada.
- **Los selectores de Playwright con `[data-seccion="x"]` agarran DOS elementos** (el chip móvil
  y el botón de la nav lateral). Hay que usar `.last()` o el móvil oculto rompe el click.
- **El SSH al VPS se corta solo en comandos largos** (`Connection reset`, exit 255). El comando
  suele haber corrido igual: **verificar el efecto antes de reintentar**, no relanzar a ciegas.
- **`docker exec -i` se traga el stdin de un heredoc por SSH** — usar sin `-i` y cerrar con
  `</dev/null`.

---

## 6. Qué depende de Sergio Urcullo (bloquea la venta)

1. 🔴 **RENOVAR EL VPS — vence el 24-sep-2026.** Visto en su hPanel (`srv1360183`, botón
   "Renovar"). Si cae, se apaga TODO: panel, base, bot, n8n, correo. Es lo más urgente de
   esta lista y no lo puede hacer nadie más.
2. 🔴 **Credenciales del API QR del BCP** (trámite con Jassir Chahin, pedido el 17-sep): usuario,
   contraseña, token público, `APP_USER_ID`, certificado `.pfx` y **la URL de producción**
   (hoy el banco solo publica sandbox). También sigue trabado su login de Credinet. Nuestro
   lado del cobro automático está construido y probado con mock (`lib/gateway/bcp-qr.ts`,
   `app/api/subscription-payment/bcp-qr/`, callback en `app/api/webhooks/bcp`): el día que
   lleguen, se cargan en `app.env` del VPS, **se RECREA el contenedor** (un `docker restart`
   no relee el env-file) y el checkout enciende solo.
   ⚠️ Sergio Urcullo **NO quiere la capacitación** que ofrece el banco: declinarla si insisten.
3. 🟡 **Conectar un número de WhatsApp de prueba** con el popup de Meta desde su cuenta, para
   vivir el flujo tal como lo verá un cliente. Es el único tramo del alta que exige un humano
   con navegador; después de eso se puede verificar el circuito entero E2E.

---

## 7. Próximos pasos, en orden (cola para Codex)

Cada uno con su criterio de "listo". **No abrir el siguiente sin cerrar el anterior.**

1. **Arreglar la causa del bot caído** (§3). *Listo cuando*: un `deploy-bot.sh --aplicar`
   desde cero deja los archivos en `/tmp/onia-bot/` sin anidar, y `webhook-server.sh status`
   da `ok:true` después.
2. **Sonda del bot en n8n con aviso a Telegram** (§3). *Listo cuando*: se apaga el bot a
   propósito y llega el aviso en la hora siguiente.
3. **Limpiar el VPS**: hay un contenedor `onia-platform-qa` (staging) levantado hace 3 días y
   builds/tarballs viejos; el disco está al **75% (144G de 193G)**. *Listo cuando*: el disco
   baja de 70% y solo quedan el build vivo + 2 backups.
4. **Portar WF-05 y WF-11 al patrón SSH e importarlos a n8n** (hoy sus nodos de Postgres
   apuntan a hosts muertos; los JSON del repo ya llevan `idempotencyKey` y los nodos de Resend
   deshabilitados, commit `51328d91`). *Listo cuando*: importados y **dejados INACTIVOS** hasta
   que exista el primer cliente con `whatsappPhoneNumberId`.
5. **Tandas de UI que siguen abiertas** (del doc comparativo): form kit (Input/Field/Select —
   la mayor inconsistencia que queda), skeletons, DataTable, y breadcrumbs en las pantallas
   hondas del panel.
6. **Flakies locales de vitest en Windows** (rotativas: backup-onia-postgres, rango-gitleaks,
   cuentas-que-no-son-clientes, fechas-de-calendario). Verdes aisladas; **el CI de Linux es el
   árbitro**. No perseguirlas sin datos nuevos.

---

## 8. Reglas de esta casa que Codex debe respetar

- **Verificar es MIRAR**: una pantalla de cliente se abre renderizada y se lee la captura. Un
  200 y un `grep` no son verificación.
- **Construido ≠ terminado**: solo cuenta lo encendido en producción y verificado ahí.
- **Nada de precios escritos a mano**: planes desde `lib/subscription-plans.ts`, add-ons desde
  `lib/pricing.ts`.
- **Nada de sustantivos de dominio hardcodeados**: el producto vende 7 rubros; todo sale de
  `lib/onboarding/vocabulario.ts`. "Paciente" en una pantalla genérica rompe la venta a comercio.
- **La venta nunca exhibe obra**: prohibido "muy pronto", "beta", "en construcción" en cualquier
  superficie que vea un cliente.
- **Los secretos no salen del VPS**: se leen dentro de la shell remota y nunca se imprimen.
- **Un solo dueño a la vez** para VPS, n8n y Supabase.
