# Pendiente — sacar "DentalGest" de la superficie

**Sergio, 2026-08-29:**

> *"dentalgest.app, recuerda que ya no lo usamos, pasó a ser un módulo, todo es Onia
> Platform."*

Es la regla que ya está en CLAUDE.md ("Hay UN solo producto"), pero **el nombre viejo sigue
vivo en producción** y nadie lo había contado. Esto es el inventario.

---

## ⚠️ Corregido el 2026-08-30 — no es "otro producto", es UN producto en DOS lados

**Sergio:** *"NO USAMOS DENTALGEST, ES TODO ONIA PLATFORM Y ESTÁ TODO EN EL VPS."* Tiene
razón, y este doc estaba escrito de una forma que empujaba a leerlo mal.

**No hay un producto DentalGest.** Hay **un repo** (`onia-platform`) que se publica en **dos
lados**. El proyecto de Vercel se llama `dental-gest` por herencia del nombre viejo, pero lo
que sirve es **el mismo `master`** que va al VPS.

| Dónde | Quién lo sirve | Contra qué base |
|---|---|---|
| `app.onia.com.bo` | contenedor `onia-platform` del VPS, detrás de Cloudflare | la self-hosted del VPS ✅ **producción** |
| `dentalgest.app` / `www` | proyecto Vercel `dental-gest`, NS `ns1/ns2.vercel-dns.com` | `kvepqgikokjlacxngkiw.supabase.co` — el Supabase **de la nube** |

La segunda se publicaba sola en cada push a `master` y servía el login completo con **"Pedí
tu acceso"**, apuntado a una base que no es producción. Un lead que entrara por ahí dejaba
la solicitud donde nadie mira.

**Y la decisión ya estaba tomada hace un mes**, en `historial/ONIA_SALIDA_DE_VERCEL_20260801.md`:
*"Decisión de Sergio: ya no usamos Vercel. Todo se va al VPS"*, con `dental-gest` como ítem
**B1** — el más barato de todos, *"solo mover el DNS"*. El plan existía; nadie lo ejecutó.

### Hecho (PR #58)

`git.deploymentEnabled.master=false` en `vercel.json`: **`master` deja de publicar la segunda
producción**, se termina el rate limit diario, y los mails se cortan en la **raíz**. Es lo
único ejecutable desde el repo — no hay token de Vercel en el sistema, el CLI está
deslogueado y el MCP da **403** al pausar el proyecto.

### Falta, y necesita a Sergio (2 minutos en el panel de Vercel)

1. Bajar el deployment que **sigue vivo** sirviendo `dentalgest.app`.
2. Decidir el dominio: redirigir a `app.onia.com.bo`, o dejarlo morir. El DNS también se
   maneja en Vercel (`ns1/ns2.vercel-dns.com`).

### ⚠️ Antes de borrar el proyecto: dos crons se quedan sin casa

Contado en el crontab del host el 2026-08-30:

| Cron de `vercel.json` | ¿En el VPS? |
|---|---|
| `appointment-reminders` | ✅ sí — `*/15 * * * *`, **más seguido** que en Vercel |
| `recurring-invoices` | 🔴 **no** — sólo Vercel |
| `onia-core-workitems` | 🔴 **no** — sólo Vercel |

**El matiz que cambia la lectura:** como el deploy de Vercel apunta a la base de la nube,
esos dos crons **nunca corrieron contra producción**. No se pierde una capacidad que
funcionaba — se descubre que nunca estuvo cableada. Hay que crearlos en el crontab del VPS,
al lado de los que ya están.

---

## Dónde sigue vivo, medido el 2026-08-29

| Superficie | Qué dice | Costo de cambiarlo | Riesgo |
|---|---|---|---|
| 🔴 **Dominio público** `dentalgest.app` + `www` | Es la URL que sirve el producto. Responde 200 y muestra la marca Onia | Comprar/apuntar un dominio Onia + redirigir el viejo | **Alto**: romperlo deja el producto sin URL |
| 🔴 **Schema de la base de producción** | `?schema=dentalgest` en el `DATABASE_URL` del VPS | Migración de schema, con backup y ventana | **El más caro.** No es un rename: es mover datos vivos |
| 🔶 Proyecto de Vercel | se llama `dental-gest` | Renombrar en el panel | Bajo, pero cambia URLs de preview |
| 🔶 `public/sw.js` | el service worker lleva el nombre en el cache | 1 línea + invalidar cache | Medio: un cache viejo puede quedar servido |
| 🔶 14 archivos `.ts`/`.tsx` | referencias al nombre | grep y reemplazo | Bajo |
| 🔶 `package.json` | `docker build -t dentalgest:selfhost`, `DentalGestDemo` | 2 líneas | Bajo |

## Lo que hay que entender antes de tocar nada

**El dominio y el schema NO son lo mismo que un nombre en el código.**

- Los 14 archivos, el `package.json` y el service worker son **cosméticos**: se cambian en
  una tarde y no rompen nada que no se vea enseguida.
- El **dominio** es la puerta del producto. Cambiarlo sin redirección deja clientes afuera.
- El **schema de producción** es el más caro de todos y **no da ningún beneficio visible al
  cliente**: nadie ve el nombre del schema. Cambiarlo es riesgo puro a cambio de prolijidad
  interna.

**Recomendación: separar las tres cosas y no hacerlas juntas.**

## Orden propuesto

1. **Lo cosmético primero** (código, `package.json`, service worker): barato, sin riesgo,
   y saca el nombre de donde un cliente podría verlo.
2. **El dominio después**, como decisión comercial de Sergio: qué URL queda como oficial y
   si `dentalgest.app` redirige o se deja morir. Ojo: hay material de venta y propuestas
   que pueden apuntar ahí — hay que barrer la superficie ANTES de apagarlo, que es la regla
   de "una promesa que cambia se barre en TODA la superficie".
3. **El schema, por último o nunca.** Si no aporta nada al cliente, la respuesta honesta
   puede ser dejarlo: un nombre interno feo no le cuesta plata a nadie, y la migración sí
   puede costarla. Anotarlo como deuda consciente en vez de tocarlo por prolijidad.

## Lo que NO hay que hacer

- Renombrar el schema "de paso" mientras se toca otra cosa.
- Apagar `dentalgest.app` antes de saber quién le apunta.
- Suponer que porque el nombre es viejo, nadie lo usa: **responde 200 y sirve el producto
  hoy**.
