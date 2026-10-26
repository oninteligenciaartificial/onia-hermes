# Handoff — carril `claude/onia-v1-servicios-98acde`

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: **2026-09-05 ~00:20 La Paz**. Horas en La Paz (UTC−4).
>
> Cierre pedido por Sergio Urcullo. **Nada quedó en vuelo y nada sin commitear.**

---

## Objetivo

Cerrar el **paso 0/1 del alcance**: que el rubro Servicios profesionales entregue lo que su
tarjeta de `/register` promete — «Agenda, citas, cobros y contabilidad» — o que el alta deje de
prometerlo.

**Hecho** = un dueño solo hace el recorrido entero, mirando la pantalla. **Cumplido**, verificado
dos veces contra producción con cuenta nueva.

Después el usuario sumó tres pedidos que no eran el objetivo. Están abajo, cada uno cerrado.

---

## Qué quedó EN PRODUCCIÓN

**Tres despliegues, todos con gates 5/5 y 0 errores en el log.**

| sha | BUILD_ID | Hora | Qué |
|---|---|---|---|
| `70d3250` | `t5-KwVFrE3FZrh0jB6mwv` | 19:06 | el arreglo de servicios + «Opciones avanzadas» |
| `3e20395` | `9X-BgT5SOWNyPCCHLUWvH` | 19:33 | 🔴 **la regresión que el primero metió** |
| `443e3e7` | `-en0j_tAYbfor2oQ0DnbB` | ~22:40 | el logo girando fuera del indicador de carga |

Rollback: `mv /opt/onia-platform/runtime-next.bak-<ts>` a `runtime-next` + `docker restart`.

**Servicios profesionales, medido MIRANDO cada pantalla en `app.onia.com.bo` con cuenta nueva:**

- **Cobrar un servicio** → `POST /api/comercio/ventas` **201**, «Venta registrada: Bs 1.200,00 en
  Efectivo». Antes: **422 «Stock insuficiente: disponible 0, solicitado 1»**.
- **«Clientes» en el menú**, con lista, alta, ficha y edición.
- **El alta del catálogo habla de servicios**: nombre y precio; SKU, unidad, stock, costo, lote y
  vencimiento detrás de «Opciones avanzadas» (cerrado).
- **El panel dejó de mentir**: «0 PRODUCTO(S) SIN STOCK», «Stock crítico 0».
- **La ficha del cliente no pide tipo de sangre** ni alertas médicas, alergias, contacto de
  emergencia, historia clínica ni tratamientos.
- **El indicador de carga son tres puntos**, no el logo girando. En el runtime vivo:
  0 archivos con `dg-logo-spin`, 34 con `dg-loading-dot`.

Suite **2958** (39 tests nuevos), typecheck limpio. Datos QA borrados; las 5 orgs reales intactas.

**Notificaciones de Hermes: APAGADAS.** 15 trabajos programados en `pause` (13 entregaban Telegram
solos) + `hermes-vigia.sh` comentado en el cron con el motivo al lado. Nada borrado:
`hermes cron resume <id>` los devuelve.
⚠️ **`hermes cron list` SIN `--all` no muestra los pausados y dice "No scheduled jobs"** — parece
que se borraron y no.

---

## Qué quedó a medias, y dónde

**Nada de este carril.** `claude/onia-v1-servicios-98acde` está mergeada a `master` por
fast-forward, desplegada, y el worktree limpio.

De otros carriles, sin tocar: **`feat/panel-tres-renglones` espera el «ok panel»** y
**`fix/venta-honesta`** (repo `onia-hermes`) sigue sin mergear.

**Sin commitear a propósito:** `capturas-servicios/` en el worktree de la plataforma (excluido en
`.git/info/exclude`). Son los scripts de Playwright del recorrido y sus PNG. **Valen**:
`BASE_URL=https://app.onia.com.bo node capturas-servicios/recorrido.mjs <sello>` hace el recorrido
entero y deja 9 capturas. Necesita `.env.local` con `DIRECT_URL` por túnel SSH (ver abajo).

---

## Archivos y cambios

- **`lib/comercio/servicios.ts`** (nuevo) — `UNIDAD_SERVICIO`, `esServicio(unit)`,
  `unidadDelAlta(...)`. **El corazón**: una fila con `unit = "servicio"` no mueve stock. Cero
  migración: `unit` ya existía y ya viajaba en todas las consultas del catálogo.
- **`lib/platform/vertical-pack.ts`** — `llevaInventario` (el rubro con stock declara
  `/comercio/inventario`) y `fichaClinica` (el rubro clínico declara `/treatments`). Los dos
  DERIVADOS del pack, misma doctrina que `usaPanelComercio`. Más `/patients` → «Clientes» en
  `SERVICIOS_NAV_ITEMS`, con el icono `group` que ya usa el pack dental.
- **`lib/comercio/ventas.ts`** — `registrarVenta` salta el kardex en líneas de servicio. **El
  control de stock de la mercadería no se toca**: un producto en cero sigue frenando la venta.
- **`lib/platform/api-route-registry.ts`** — `patients/*` a `CON_AGENDA`. La unidad del gate es el
  SEGMENTO: abrir la pantalla obliga a declarar todo lo que cuelga de `patients`.
- **`components/loading/BrandSpinner.tsx` y `BrandLoadingScreen.tsx`** — tres puntos, sin marca.
- **`hermes-content/docs/ONIA_AGENTES_Y_CONEXIONES.md`** (nuevo) — el plan de agentes y
  conexiones. **Se escribió, no se construyó.**

---

## Intentos fallidos — lo que NO hay que repetir

- 🔴 **Un grep del bundle dio VERDE sobre código que no funcionaba.** El gate post-swap confirmó
  «`esServicio` presente», «`Opciones avanzadas` presente»… y el cobro seguía dando 422. El
  símbolo estaba; la lógica no corría. **Un grep prueba que el código viajó, nunca que hace lo
  que dice.** Lo cazó correr el recorrido entero CONTRA PRODUCCIÓN después del swap.
- 🔴 **Un campo con valor por defecto le gana a un `||`.** `unit: form.unit.trim() || (…)` no
  marcaba NUNCA porque `form.unit` arranca precargado en `"unidad"`. Por eso la decisión salió
  del JSX a una función pura con tabla de verdad: **una decisión dentro de un ternario en JSX no
  tiene dónde probarse.**
- 🔴 **Verificar contra el dev server local puede mentir por los DATOS, no por el código.** El
  servicio de prueba local lo había creado la versión anterior del formulario. **Cuenta nueva o
  no es verificación.**
- 🔴 **`algo | crontab -` sin comprobar la salida del `algo` BORRA el crontab.** Un `sed` con `#`
  de delimitador Y `#` en el reemplazo falló; el pipe siguió y `crontab -` recibió vacío: **82
  líneas borradas.** Se restauró del respaldo hecho un segundo antes. La forma correcta:
  construir el crontab en un archivo, **verificar antes de instalar**, y recién `crontab archivo`.
- **El parte de entrada traía un dato vencido** («la cita abre con 0 opciones»): ya lo había
  arreglado el deploy `3606c46`, y la medición se hizo antes de ese swap. Lo que sí estaba roto
  —y no figuraba en la lista— era el **cobro**.
- **Un `required` dentro de un `<details>` cerrado** da «An invalid form control is not
  focusable»: el botón no hace nada y no se ve por qué.
- **`setsid nohup … &` sobre SSH corta la sesión antes de devolver.** El build arranca igual; se
  confirma con `pgrep -af build-<sha>` y el log, no con la salida del comando.
- **No hace falta backfill**: ninguna org real tiene productos de comercio cargados.

### Cómo se verifica contra producción sin desplegar (vale la pena copiarlo)

1. Túnel a la base: `ssh -N -L 55433:172.19.0.6:54329 root@187.77.16.63`
   (el Postgres escucha en **54329**, no en 5432, y no está publicado al host).
2. `.env.local` desde `/opt/onia-platform/app.env`, con `@db:54329` → `@127.0.0.1:55433`,
   `SUPABASE_INTERNAL_URL` y `NEXT_PUBLIC_SUPABASE_URL` → `https://app.onia.com.bo/supabase`
   (son públicos), y `NEXT_PUBLIC_APP_URL` → `http://localhost:3000`.
3. `npm run dev`. **Borrar el `.env.local` al terminar** (un build con eso hornea `127.0.0.1`).
4. El dev server **no relee `.env.local`**: hay que reiniciarlo.

---

## Qué depende de Sergio Urcullo

1. 🔴 **«ok panel»** — `feat/panel-tres-renglones` sigue esperando. Sin eso no se publica.
2. 🔴 **El número del costo por conversación del chatbot.** Al descartar BYOK, el margen depende
   entero de ese dato. Es medición, y se puede hacer sin él — pero la decisión de dónde poner el
   tope es suya.
3. Mergear y desplegar `fix/venta-honesta`, o decir que no. **Hasta entonces no se le escribe a
   ningún lead.**
4. Los 7 mensajes a leads · conectar su WhatsApp (1 clic) · credenciales del BCP · Punto de Venta 1.

---

## Próximos pasos, en orden

1. **COMERCIO: la pantalla de clientes.** Su tarjeta de `/register` promete «clientes» y no la
   tiene. **No es copiar y pegar lo de servicios**: su gente vive en `OniaCoreBusinessPartner`
   (los fiados), no en `Patient`. *Listo = el recorrido se hace solo con cuenta nueva contra
   producción, o la tarjeta deja de prometerlo.*
2. **El recibo imprimible.** `/print/receipt` lee `Payment` (dental); comercio usa
   `OniaCommercePayment`. Ruta nueva. *Listo = una venta de caja se imprime.*
3. Seguir el alcance: panel de inicio (espera el OK) → cobros → contabilidad → velocidad.
4. **Medir el costo por conversación del chatbot** — sostiene el modelo de precio entero.

---

## Decisiones que se cerraron acá (no reabrir sin dato nuevo)

- **Simple por defecto, avanzado opcional.** Esconder no es borrar. Nació de un error propio: el
  alta de servicios había ELIMINADO SKU, unidad, stock, costo y lote.
- **BYOK descartado** — el cliente NO conecta su clave de OpenAI, ni como opción. Casi nadie en
  Bolivia puede sacar cuenta (pide tarjeta internacional), y **lo que se vende es no tener que
  pensar en el modelo**. Argumento de Sergio Urcullo: *"es como ManyChat: se puede hacer gratis,
  pero ellos te cobran porque te facilitan el trabajo"*. Onia incluye el consumo y **cobra más
  por eso**; el tope por plan es el motor del precio, no una traba.
- **Los agentes no usan IA para DECIDIR**, solo para redactar. Quién debe plata lo dice el SQL.
  Un agente que alucina una deuda nos hace echar del cliente.
- **Los loops NO se apagan.** Se están ordenando desde la PC madre en la casa de Sergio Urcullo.

---

## 🔴 Lo incómodo: por qué se cambia de sesión

Sergio Urcullo lo pidió después de que **fallara el canario** — dejé de llamarlo por nombre y
apellido durante cuatro respuestas seguidas. En ese mismo tramo:

- le vacié el crontab con un comando que no verifiqué antes de correr;
- desplegué a producción un arreglo que no arreglaba nada y lo di por bueno con un grep.

Las tres son **la misma falla: dejar de comprobar lo que tengo delante**. El canario existe
porque el modelo no es buen juez de su propio estado, y funcionó — él lo vio antes que yo.

**Para la sesión nueva:** el canario no es una formalidad. Si notás que lo estás salteando,
asumí que también estás salteando la verificación, y volvé a medir lo último que diste por hecho.
