# Dejar de pagar Google Workspace — paso a paso

> 2026-08-18. Sergio: *"¿cómo hacemos lo del correo? Dejalo como un paso a paso, no quiero
> pagar más Workspace."*
>
> **Regla de oro: la cancelación va ÚLTIMA.** Cancelar Workspace borra la cuenta de Google, y
> con ella todo lo que cuelgue de esa identidad. Los pasos 1 a 5 son reversibles; el 6 no.

---

## Lo que se verificó antes de escribir esto

| Dato | Estado real |
|---|---|
| Nameservers de `onia.com.bo` | **Cloudflare** (`arely` / `randy`.ns.cloudflare.com) → Email Routing es viable |
| MX actual | **Google** (`aspmx.l.google.com` + 4 alt) → el correo entra por Workspace |
| SPF | `v=spf1 include:_spf.google.com ip4:187.77.16.63 ~all` → **ya envía desde el VPS también** |
| Google en producción | **cero** variables `GOOGLE_*` en `onia-platform`, `onia-landing`, `onia-center`, Chatwoot |
| Lo único con Google | Cal.com (`GOOGLE_API_CREDENTIALS`) y Postiz (`YOUTUBE_CLIENT_*`, sin usar) |

Y lo que dijo Sergio: **`business@` se usa como buzón**, tiene vinculada la cuenta de
Instagram y lo de Meta, y hay **credenciales de Google Cloud (OAuth)**.

---

## El punto que casi nadie separa

Son **dos cosas distintas** y solo una se reemplaza gratis:

| | Qué es | ¿Se reemplaza? |
|---|---|---|
| **La dirección** `business@onia.com.bo` | un buzón que recibe |✅ **sí, gratis** con Cloudflare Email Routing |
| **La cuenta de Google** | una identidad: dueña del proyecto de Google Cloud, y posible login de Meta | ❌ **no.** Si se cancela, se va con todo adentro |

**Se puede conservar la dirección y perder la cuenta.** Lo que NO se puede es cancelar sin
antes sacar de adentro lo que importa. De ahí el orden.

---

## Paso 1 · Ver qué cuelga de la cuenta (5 min, no cambia nada)

`myaccount.google.com` → **Seguridad y acceso** → **Apps vinculadas** (menú izquierdo).

Buscás una cosa concreta:

> ¿Hay algún servicio donde entrás con **"Continuar con Google"** en vez de usuario y
> contraseña propios?

- **Meta / Facebook / Instagram** ← el más importante: ahí está la cuenta que vende
- Cloudflare · Vercel · Supabase · Higgsfield · el banco

**Si Meta aparece como "Iniciar sesión con Google": frená acá.** Cancelar te deja sin la llave
de la cuenta de Instagram. Primero se cambia el método de acceso de Meta a un correo con
contraseña propia, y recién después se sigue.

**Si Meta solo tiene `business@` como dirección de contacto o recuperación:** seguí, el reenvío
lo cubre.

## Paso 2 · Salvar el proyecto de Google Cloud (antes que nada más)

Las credenciales OAuth viven en un **proyecto de Google Cloud**, y el proyecto pertenece a la
cuenta. Si la cuenta se va, el proyecto se va.

1. `console.cloud.google.com` → **IAM y administración** → **IAM**
2. **Otorgar acceso** → una cuenta de Gmail personal que no vayas a cancelar nunca
3. Rol: **Propietario**
4. Aceptar la invitación desde esa otra cuenta

Ahora el proyecto tiene dos dueños. Al cancelar Workspace sobrevive en la otra cuenta, y **las
credenciales de Cal.com siguen funcionando sin tocarlas**.

⚠️ Sin este paso, cancelar rompe la integración de calendario de Cal.com.

## Paso 3 · Crear el buzón de destino

Cloudflare Email Routing **no guarda correo: lo reenvía.** Hace falta una casilla real.

Crear un **Gmail común** (gratis) como buzón nuevo de ONIA. Puede ser el mismo del paso 2.

## Paso 4 · Montar Email Routing en Cloudflare

`dash.cloudflare.com` → `onia.com.bo` → **Email** → **Email Routing** → Habilitar.

1. Cloudflare pide reemplazar los MX. **Aceptar** — es el momento del corte.
2. Crear las direcciones:

| Dirección | Reenvía a |
|---|---|
| `business@onia.com.bo` | el Gmail del paso 3 |
| `lucia@onia.com.bo` | el Gmail de Lucía |
| **catch-all** | el Gmail del paso 3 |

El **catch-all** evita perder correo de una dirección que nadie recordaba.

3. Verificar el destino: Cloudflare manda un correo de confirmación. Hay que abrirlo.

**Costo: 0. Direcciones: ilimitadas.**

## Paso 5 · Arreglar el SPF y probar que llega

El SPF actual dice:

```
v=spf1 include:_spf.google.com ip4:187.77.16.63 ~all
```

Al salir de Workspace, `include:_spf.google.com` sobra. **Pero no lo saques hasta después de
cancelar** — mientras el buzón viejo siga vivo, se necesita. Al final queda:

```
v=spf1 ip4:187.77.16.63 ~all
```

### La prueba, y tiene que ser desde afuera

Mandar un correo a `business@onia.com.bo` **desde una cuenta ajena a ONIA** y confirmar que
llega al Gmail nuevo.

⚠️ **Que llegue no prueba que el reenvío funciona si el buzón viejo sigue activo** — puede
estar entrando por Google todavía. Hay que mirar la **cabecera** del correo recibido: tiene que
haber pasado por Cloudflare, no por `aspmx.l.google.com`.

*(Esta advertencia sale de un error real: en agosto se dio por buena una dirección porque
"llegaba el correo", y era el mismo buzón de siempre con otro nombre.)*

## Paso 6 · Recién ahora, cancelar

Solo si los pasos 1 a 5 dieron todos verde:

`admin.google.com` → **Facturación** → **Suscripciones** → cancelar.

⚠️ Antes de apretar: exportar el correo histórico con **Google Takeout** si te importa
conservarlo. Después no hay vuelta.

---

## Qué se pierde y qué no

| | Después de cancelar |
|---|---|
| `business@onia.com.bo` recibe | ✅ sí, por Cloudflare |
| Enviar **desde** `business@` | ✅ sí — el Postfix del VPS ya lo hace y el SPF ya lo autoriza |
| Las 8 propuestas de cliente que la mencionan | ✅ siguen válidas, la dirección no cambia |
| Cal.com ↔ Google Calendar | ✅ **si se hizo el paso 2.** ❌ si no |
| Google Drive / Docs de esa cuenta | ❌ **se pierden** — exportar antes |
| "Iniciar sesión con Google" en cualquier lado | ❌ se pierde — por eso el paso 1 |

## El orden importa

```
1. mirar qué cuelga        <- sin esto, todo lo demás es a ciegas
2. salvar Google Cloud     <- irreversible si se saltea
3. crear el Gmail destino
4. Email Routing + MX      <- acá corta el correo viejo
5. probar desde afuera     <- la única prueba que vale
6. cancelar                <- irreversible
```

**Los pasos 1 y 2 se pueden hacer hoy sin comprometerse a nada.** Recién el 4 cambia algo real.
