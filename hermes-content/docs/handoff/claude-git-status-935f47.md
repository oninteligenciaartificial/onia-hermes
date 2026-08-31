# Handoff — carril `claude/git-status-935f47` (plataforma · infra · webs · chatbots)

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: **2026-08-27**.

---

## 1. Objetivo

Dejar el producto vendible y **en producción**, y ordenar el material de venta para que
deje de haber varias versiones del mismo precio.

**LISTO =** el deploy corriendo en el VPS, verificado mirándolo, y los docs de venta
diciendo lo mismo que el código.

---

## 2. Qué quedó EN PRODUCCIÓN

**Deploy `0fc7e39` vivo en `app.onia.com.bo` desde el 2026-08-25 20:43 UTC.**

| Qué | Estado |
|---|---|
| **Multi-almacén** — alta de depósitos, stock y lotes por depósito | 🟢 vivo |
| **Traspaso interno** entre depósitos (el "pedido interno" de Bolivian Electric) | 🟢 vivo |
| **Agujero cross-tenant cerrado** en `POST /api/comercio/movements` | 🟢 vivo |
| **Buscador de producto scopeado al depósito** (la caja ya no ofrece stock ajeno) | 🟢 vivo |
| Vencimientos por lote, reprecio por devaluación (deploy anterior `03b410a`) | 🟢 vivo |
| **VPS sano** — steal 95% → 9%, load 171 → ~1, login 9,3 s → 0,14 s | 🟢 |
| **`cal.onia.com.bo`** — daba 502; ahora redirige (302) a `onia.com.bo/empezar` | 🟢 vivo |
| **`forms.onia.com.bo`** — daba 502; contenedor nginx recreado, 3 formularios y sus webhooks verificados | 🟢 vivo |
| **Los 3 formularios pasan al verde de Onia** — eran azules; fondo `#EDFBF3` + tinta negra (18,57:1) | 🟢 vivo |
| **Botón de Google en el login** — llevaba a un 400 crudo; ya no se dibuja | 🟢 |
| **Add-on de inventario** — dejó de cobrarse; las funciones quedan visibles como incluidas | 🟢 |
| **Contador de uso del plan** — el tope se ve antes del 403 | 🟢 |

`BUILD_ID` en producción: `2v-oviM-B2TOEoIsxmdJW`.
Backup del runtime anterior: `/opt/onia-platform/runtime-next.prev-20260825-204330`.

**Verificado mirando:** login renderizado con Playwright headless — los iconos son glifos
(36 px y 24 px, cuadrados), no los nombres en texto. El chunk del build viejo da **404**
con cache-buster, o sea que el origen sirve el build nuevo y no es caché de Cloudflare.

---

## 3. Qué quedó a medias, y dónde

- 🟡 **La sucursal FISCAL (SIN) no existe y quedó afuera a propósito.** Lo que se hizo es
  multi-ALMACÉN. No hay entidad de sucursal con código, punto de venta ni CUF. Razón: el
  emisor SIAT sigue siendo mock, y modelarla ahora obligaría a migrar datos vivos después.
  **Consecuencia de venta:** Empresa (Bs 2.900) se vende por depósitos, **nunca** por
  "sucursales ante Impuestos".
- 🟡 **La pantalla de Almacenes no fue MIRADA logueada.** Está detrás de sesión y no puedo
  autenticarme. Verificado indirectamente: rutas compiladas presentes en el runtime, panel
  en el server bundle, `307` al login sin sesión. Falta que Sergio la abra (§6).
- 🟡 **~18 docs internos con precios viejos.** `ONIA_AGENTES_COSTO_API.md` necesita que se
  REHAGA la cuenta de margen, no un reemplazo de texto: Bs 1.490 es la base del cálculo.
- ✅ **Material de vendedores: RESUELTO el 2026-08-27.** Sergio: no hay equipo de ventas.
  Todo lo que asumía un vendedor tercero (packet, decks, runbook de acceso, CRM de
  vendedores) se archivó en `historial/`. El `sales-kit/` se queda —enseña a vender y el
  que vende es Sergio— con un README que fija el estado. Queda anotada una superficie
  huérfana: `/vendedores/cotizador` y `/vendedores/webs` siguen VIVAS en web-factory.
- 🟡 **`LEEME-PRIMERO.md`** por reescribir; `ONIA_PRICING_2026.md` por degradar y redirigir
  sus 17 enlaces entrantes.
- 🟡 **Fix de hora de silencio del bot** (`quietBeforeHour: 8`) commiteado y **sin
  desplegar** — espera el próximo despliegue del bot, no de la plataforma.
- 🟡 **Baseline de tests desactualizado** en la skill `onia-verificacion`: dice 1989, hoy
  son **2058**.
- 🟡 Pendientes de infra: `docker update --restart=no` a Temporal/Elasticsearch/Speaches, y
  **crear la skill de infra que no existe** (el conocimiento más caro vive en memorias
  sueltas).

---

## 4. Archivos

**Producto** (`onia-platform`, en `master`):
`lib/comercio/transfers.ts` · `lib/comercio/stock.ts` (`resolveWarehouse`,
`defaultWarehouseId`, `assertVariantDeLaOrganizacion`) · `lib/comercio/productos-query.ts`
· `app/api/comercio/{warehouses,transfers}/route.ts` ·
`app/(dashboard)/comercio/almacenes-panel.tsx` · `app/(dashboard)/comercio/caja/CajaPantalla.tsx`

**Docs** (`onia-hermes`): `ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md` ·
`ONIA_PLAN_DESARROLLO_Y_VENTA.md` · `ONIA_PLAN_ORDENAMIENTO.md` ·
`research/ONIA_SUCURSALES_NORMA_BOLIVIA.md`

**VPS**: `/opt/onia-platform/{build,gates,swap}-0fc7e39.sh` — los tres son la plantilla
probada para el próximo deploy; copiarlos y cambiar el `COMMIT`.

---

## 4.b Dos dominios publicados servían 502 sin que nadie lo supiera

`cal.onia.com.bo` y `forms.onia.com.bo` estaban caídos hacía días. En los dos casos el
contenedor había desaparecido y **la ruta de Traefik seguía publicada, con certificado
válido**. Un `docker rm` no borra la ruta.

- **cal**: los datos sobrevivieron pero **el `.env` no**, y Postgres ignora una contraseña
  nueva sobre un volumen ya inicializado. Resucitarlo costaba cirugía + 3 contenedores para
  correr una agenda que ya vendemos → **se redirige a `/empezar`** (302, reversible).
- **forms**: no se había perdido nada. Los 3 HTML y la config de nginx seguían en
  `/opt/onia-forms`. Faltaba **sólo volver a correr el contenedor**.

La lección quedó en la skill `onia-infra` §4.b: publicar un dominio crea una deuda de
monitoreo que no se paga sola.

## 5. Intentos fallidos (lo que NO hay que repetir)

- 🔴 **Dije "multi-sede no existe" por un `grep` de `branchId`.** El grep era cierto y la
  conclusión falsa: `OniaCommerceWarehouse` existía con el stock ya indexado por depósito.
  **Un grep descarta, nunca confirma.** Casi cotizamos semanas de trabajo por algo que era
  cableado.
- 🔴 **Dije que no existían proveedores/compras/lotes** grepeando nombres en inglés
  (`Supplier`, `Purchase`). Se llaman `OniaCommercePurchase`, `OniaCommerceStockLot`.
  Estuve a punto de sacar de la oferta un add-on vendible.
- 🔴 **`exit code 0` de `cmd | tail` es de `tail`, no del comando.** Pasó DOS veces con
  `next build`. Redirigir a un log y capturar `$?`.
- 🔴 **`pgrep -f "patrón"` se matchea a sí mismo** cuando el patrón está en tu propia línea
  de comando. Me dio un "build todavía corriendo" falso, y antes mató mi propia sesión SSH.
- 🔴 **El panel del navegador in-app no compone frames en esta sesión**: la captura falla
  siempre. La ruta que SÍ funciona es Playwright headless, y el script debe vivir DENTRO
  del repo (la resolución ESM va por la ubicación del script, no por el cwd).
- 🔴 **Backticks en un mensaje de commit** ejecutan sustitución de comandos y se comen
  texto. Usar heredoc.

---

## 5.b Lo que se midió y cambió una decisión

**El formulario de alta NO alcanza para generar una web, y el `/brief` casi sí.** Medido
contra las 39 preguntas de `web-factory/INTAKE_CLIENTE.md`: el brief cubre ~80%, y el alta
tapa varios de sus huecos (rubro, ciudad, dirección, horarios, NIT, y el repetidor de FAQ).

**✅ Cerrado el mismo día:** se agregaron **10 campos** al `/brief` (CTA con objetivo
obligatorio + texto y destino del botón, "qué NO querés", estilo visual, tagline, título
SEO, imagen OG, teléfono, quién paga el hosting). **El `/brief` ya cubre el intake
entero** — se manda el link en vez de copiar 39 preguntas a mano.

Casi lo estimo mal: por conteo de substring parecía que faltaban 15 campos y que el brief
no tenía nada. `cta` matcheaba "conectar", `estilo` matcheaba "enlaces de estilos", y el
FAQ que daba por faltante **ya existía** en el alta. **Verificar en contexto cambió el
tamaño del trabajo de "formulario nuevo" a "seis campos".**

## 6. Qué depende de Sergio

1. **Abrir `/comercio/inventario` logueado y mirar la sección "Almacenes".** Es lo único
   del deploy que no pude verificar viendo. Qué comprobar: crear un depósito, que aparezca
   en la grilla, y que "Traspasar mercadería" mueva stock entre dos.
2. **¿La sucursal FISCAL se construye?** Depende de que el emisor SIAT deje de ser mock
   (bloqueado por el NIT). Alternativa: redefinir Empresa sin ella.
3. **¿El markup de Meta es 20% o a costo?** `WHATSAPP_ADDON.meta.markupPct: 20` contradice
   la etiqueta que le promete al cliente que el excedente va al costo. Lety.ai vende
   "0% markup" como tesis central: es el ataque más fácil que nos pueden hacer.
4. **¿Se bajan las pantallas `/vendedores/*` de web-factory?** Son rutas publicadas
   hechas para un vendedor que no existe. Sacarlas es una decisión de superficie viva, no
   la tomo solo.

---

## 7. Próximos pasos

1. Los **tres movimientos de precio que no cuestan código**: mostrar Empresa como ancla,
   decir el ~17% del anual, y escribir que cobramos en bolivianos.
2. **Llenar `knowledge.json`** del chatbot — tiene UN solo hecho. Es contenido, no código.
3. **Gatear el add-on de inventario**: hoy cobra Bs 180 por cosas que ya son gratis para
   todos (`/comercio/fiados` sin gate, `addon.inventory_advanced` calculado y sin leerse).
4. Barrer los ~18 docs con precios viejos, empezando por rehacer la cuenta de
   `ONIA_AGENTES_COSTO_API.md`.
5. Desplegar el fix de hora de silencio del bot.
