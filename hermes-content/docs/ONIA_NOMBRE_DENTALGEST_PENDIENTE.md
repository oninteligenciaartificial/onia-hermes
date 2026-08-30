# Pendiente — sacar "DentalGest" de la superficie

**Sergio, 2026-08-29:**

> *"dentalgest.app, recuerda que ya no lo usamos, pasó a ser un módulo, todo es Onia
> Platform."*

Es la regla que ya está en CLAUDE.md ("Hay UN solo producto"), pero **el nombre viejo sigue
vivo en producción** y nadie lo había contado. Esto es el inventario.

---

## ⚠️ Medido de nuevo el 2026-08-30 — es peor que "un nombre viejo"

Sergio pidió que dejaran de llegar los mails de Vercel, diciendo *"ya no usamos vercel"*.
**Usamos.** Verificado en vivo, no de memoria:

| Comprobación | Resultado |
|---|---|
| `curl -sI https://www.dentalgest.app` | `HTTP 200`, `Server: Vercel` |
| `curl -sI https://www.dentalgest.app/login` | `HTTP 200` |
| Proyecto Vercel `dental-gest` | último deploy `target=production`, `readyState=READY`, **del mismo día** |
| Dominios del proyecto | `www.dentalgest.app`, `dentalgest.app`, `dental-gest-git-master-*` |
| Pantalla **abierta y mirada** | login completo de Onia: "14 días gratis", **"Pedí tu acceso"** |

**Y no es una copia inocente: apunta a OTRA base.** Su bundle referencia
`kvepqgikokjlacxngkiw.supabase.co` — el Supabase **en la nube**. El bundle de
`app.onia.com.bo` **no lo referencia**. La base de producción es la **self-hosted del
VPS**.

**Entonces hay dos producciones vivas del mismo producto, y la de Vercel se publica sola
en cada push a `master`, conectada a un backend que no es producción.** Un lead que entre
por `dentalgest.app` y toque "Pedí tu acceso" deja su solicitud en una base que nadie mira.

Y hay un segundo efecto que nadie contó: **`vercel.json` agenda tres crons**
(`appointment-reminders`, `recurring-invoices`, `onia-core-workitems`). En el VPS los
mismos trabajos ya corren por el crontab del host. O sea que esos tres corren **en los dos
lados**, cada uno contra su base.

**Lo hecho:** `github.silent` en `vercel.json` (PR #58) corta los comentarios del bot —
los mails— **sin tocar los deploys**. Es el arreglo del síntoma, a propósito: bajar
`dentalgest.app` apaga una superficie viva y es decisión de Sergio.

**Lo que falta decidir (Sergio):** desconectar el proyecto de Vercel y dejar
`dentalgest.app` redirigiendo a `app.onia.com.bo`, o mantenerlo apuntado a la base correcta.
Hoy es lo peor de los dos mundos: vendible y desconectado.

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
