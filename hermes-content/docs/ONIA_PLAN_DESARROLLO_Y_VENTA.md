# Plan de desarrollo y venta — qué construir, en qué orden, y cómo se vende

**Un solo plan por frente.** Cada función sale de un problema verificado, no de una lista de
deseos. Estado del producto y del código medido el **2026-08-24**, y **re-verificado ítem
por ítem contra el código el 2026-08-31** — los cerrados llevan su commit al lado.

> **No duplica** lo que ya está escrito. La psicología de precios de la competencia vive en
> `ONIA_PSICOLOGIA_PRECIOS_COMPETENCIA.md` (6 mecanismos leídos de las páginas reales) y el
> método para subir precios sin perder clientes en
> `propuestas/ONIA_PRICING_ESTRATEGIA_ESCALADA_2026.md`. Los precios y funciones actuales
> están en `ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md`. **Este doc los ATA en un orden ejecutable.**

---

## 1. La pieza que desbloqueaba dos cosas — ✅ EN PRODUCCIÓN (2026-08-25, `0fc7e39`)

**Multi-almacén.** Encendido en producción. Desbloqueaba dos cosas y las desbloqueó:

- **El plan Empresa (Bs 2.900).** Ya tiene con qué diferenciarse de Completo por el lado
  operativo: varios depósitos y traspaso entre ellos. ⚠️ La **sucursal fiscal ante el
  SIN** sigue sin existir — Empresa se vende por depósitos, nunca por "sucursales ante
  Impuestos" (detalle en `ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md` §4.2).
- **Bolivian Electric.** El "pedido interno" que trababa su venta ya existe: sale del
  origen al promedio vigente y entra al destino **al mismo costo**, con los lotes y sus
  vencimientos viajando con la mercadería.

**Qué se encontró al construirlo:** el motor estaba entero y desconectado. El stock ya
era por depósito (`@@unique(organización, almacén, variante)`) y `applyTransfer` vivía
probado en `kardex.ts` **sin un solo llamador**. El producto resolvía siempre el primer
almacén activo porque no había pantalla ni API. Faltaba el cableado, no la funcionalidad
— el mismo patrón de "construido y apagado" que ya nos mordió tres veces.

**Lo que se llevó puesto de paso:** el buscador de producto sumaba el stock de TODOS los
depósitos. Con uno solo daba igual; con varios, la **caja** ofrecía mercadería que está
en otro lado y la venta rebotaba recién al confirmar. Corregido en la raíz.

---

## 2. Por frente

### Plataforma

| # | Función | Por qué | Costo |
|---|---|---|---|
| ~~1~~ | ~~**Multi-almacén**~~ | §1 | ✅ **en producción 2026-08-25** |
| ~~2~~ | ~~**Gatear lo que el add-on de inventario cobra**~~ | Se resolvió al revés: **no se gatea, se deja de cobrar** (Sergio, 2026-08-27: *"no se cobra"*). Compras, proveedores, vencimientos y alertas siguen encendidas para todos y ahora se cuentan como valor **incluido** en el plan | 🚫 **retirado 2026-08-27** (`317745d`) |
| ~~3~~ | ~~**Contador de uso visible**~~ | `calcularUsoDelPlan` (`lib/plan-limits.ts`) + `MedidorDelPlan` al lado del botón de alta: el cliente ve cuánto le queda y se le avisa al 80 % (`UMBRAL_AVISO_USO`) antes del 403 | ✅ **cerrado 2026-08-27** (`66f49d4`) |
| 4 | **Techo blando** | el aviso al 80 % ya salió con el #3. **Queda solo el mes de tolerancia**: `checkPatientLimit` sigue devolviendo `allowed: false` en el tope y el alta rebota igual | medio |
| 5 | **Buscar cliente por NIT** | Bolivian Electric no puede copiar NIT y nombre de alguien ya registrado | chico |
| 6 | **Archivo digital por factura** | cuando el SIN pide papeles de años atrás, *"a veces no lo pillamos"* | medio |

**5 y 6 se re-verificaron el 2026-08-31 y siguen abiertos**, para que la próxima sesión no
los vuelva a medir: cero búsquedas por `taxId` en `app/api` (el #5 no existe), y
`oniaCoreDocument` guarda documentos **clínicos** con su propio control de visibilidad, sin
un solo llamador que los cuelgue de una factura (el #6 tampoco). El #3 se cerró leyendo el
código, no la pantalla: el medidor vive detrás del login y no se abrió renderizado.

### Chatbot

| # | Función | Por qué | Costo |
|---|---|---|---|
| 1 | **Llenar `knowledge.json`** | Tiene **un solo hecho**. El motor está perfecto y el bot no sabe nada del negocio. **Es contenido, no código** | chico |
| 2 | **Embedded Signup en el panel** | Somos Tech Provider con App Review aprobado. Es la ruta ya decidida (17-ago) | medio |
| 3 | **Formulario de alta del bot** | el cliente arma el suyo; se prueba primero con el bot propio de Onia | medio |
| 4 | **Que el bot lea el conocimiento por org** | el editor está en producción; falta que el bot de WhatsApp lea la fila | chico |

**Los cuatro se re-verificaron el 2026-08-31 y ninguno se pudo cerrar**, con el motivo
exacto para que la próxima sesión no repita la medición:

- **#1** no es medible desde el repo: la copia viva del conocimiento vive en el VPS
  (`/opt/onia/bot/knowledge.json`), y en el repo solo hay `knowledge.example.json` — que
  sigue teniendo **un solo hecho**, pero es el ejemplo, no lo que contesta.
- **#2** no está: `WhatsAppOrgConfig.tsx` sigue pidiendo `phoneNumberId` y `accessToken`
  pegados a mano por un admin; el Embedded Signup solo aparece nombrado en un comentario.
- **#3** quedó ambiguo y por eso NO se cerró: el editor del conocimiento existe desde el
  2026-08-16 (`58f2bab`), o sea antes de que este doc lo midiera, así que este ítem pide
  otra cosa. **Hay que decir qué formulario es antes de poder cerrarlo.**
- **#4** tiene la mitad probada: `knowledge.mjs` resuelve `inbox → org` contra
  `/api/chatbot-knowledge/published` (fuente `"db"`, `5efa06a6`), enciende el modo
  recepcionista y `webhook-server.sh` pasa `ONIA_BOT_KNOWLEDGE_URL` por defecto. Lo que el
  ítem pide es el bot de **WhatsApp**, y eso no se miró en un WhatsApp real: queda abierto
  hasta verlo.

🔴 **Access Verification de Meta vence el 20-oct-2026.** Es la única fecha dura del frente.

### Webs

Lead magnet vivo. Sigue la cola con veredicto: **P03** (el que trae plata) → **P01**
`motion-design-skill` → **P02** → **P04**. `genjutsu` al final y solo `cast`.

### Infra

Sana: steal 9%, load 1,2, webs bajo 1 s. Queda `docker update --restart=no` a
Temporal/Elasticsearch/Speaches. ~~Crear la skill de infra que no existe~~ ✅ **hecha el
2026-08-27**: `.claude/skills/onia-infra/SKILL.md` (`193a7f1d`, en `origin/main`) — el carril
del conocimiento más caro ya no vive solo en memorias sueltas.

---

## 3. Cómo se vende, con la psicología aplicada a NUESTRA escalera

Los mecanismos están en `ONIA_PSICOLOGIA_PRECIOS_COMPETENCIA.md`. Acá van aterrizados.

### 3.1 Los tres movimientos que no cuestan código nuevo

~~**Mostrar el ancla.**~~ ✅ **hecho** (verificado 2026-08-31). Grupo / Empresarial (Bs 2.900)
se publica hoy en las DOS superficies: bloque verde propio en `/precios`
(`precios/page.tsx:297`) y pie de la banda de add-ons en la portada (`page.tsx` → `offerFoot`).
Sigue fuera del checkout, que es lo correcto — se cotiza, no se compra en línea. Bs 1.500 ya
se lee contra 2.900 sin que se haya tocado un solo precio.
⚠️ **Mostrarlo NO es venderlo.** Desde el 2026-08-25 Empresa ya tiene diferencia real
(varios depósitos + traspaso). Lo que sigue sin existir es la sucursal FISCAL: el ancla
se muestra, y se vende por depósitos, nunca por "sucursales ante Impuestos".

~~**El anual como número grande.**~~ ✅ **hecho** (verificado 2026-08-31). Ya no vive como
comentario: cada tarjeta de plan publica su `Bs/año` (`precios/page.tsx:137`) y `CONDICIONES`
lo dice con todas las letras — *"El anual cobra 10 meses: dos van de regalo"* —, renderizado
al pie de `/precios`.

**Cobrar en bolivianos, y decirlo.** Los siete comparables cotizan en dólares. Con la
devaluación, un precio atado al dólar **subió 63% sin entregar nada nuevo**. Que el precio
no se mueva solo es una ventaja concreta contra Wix, Shopify y Squarespace acá — pero hay
que **escribirlo en la página de precios**, no dejarlo implícito.
⚠️ **Es el único de los tres que sigue abierto** (2026-08-31): `/precios` ya se titula
*"planes en bolivianos, publicados"*, pero en ninguna parte del cuerpo dice que por eso el
precio **no se mueve con el dólar**, que es el argumento entero.

### 3.2 El salto que hay que vender

**Básico → Profesional es el único escalón con diferencia funcional real.** Ahí entran
reportes completos, agenda pública, facturas recurrentes y agentes. De Completo para arriba
solo se levantan topes.

Consecuencia para el discurso: **todo el argumento vive en Profesional.** Básico es la
puerta barata de probar; Completo se ofrece cuando los topes molestan de verdad, nunca como
"el plan bueno".

### 3.3 Marca de agua en vez de recorte

Hoy la agenda pública **no existe** en Básico. Un techo invisible no vende nada.
Mejor: dejarla disponible con un *"Powered by Onia"* visible, y que los Bs 150 compren
**quitar la marca**. El cliente ve lo que se pierde en vez de chocar con una puerta cerrada.

### 3.4 Lo que NO hacemos, y conviene tenerlo dicho

- **Nada de acantilado de renovación.** Hostinger sube 3,67x al renovar. Con la devaluación,
  el cliente boliviano ya vive con que todo sube solo: eso quema lo único que todavía no
  tenemos, que es reputación. Y contradice el precio fundador congelado, que ya está decidido.
- **Nada de % sobre la facturación del cliente.** No es ejecutable: `gatewayEnabled: false`
  en los cinco planes — no procesamos pagos, no hay dónde retener. Venderlo sería prometer
  lo que no podemos cobrar.
- **Nada de créditos como unidad.** El dueño de una ferretería no sabe cuántos créditos
  cuesta agendar. Nuestra unidad ya está bien: **la conversación** (500/mes).
- **Nada de prepago largo.** El plazo se **premia con descuento**, no se exige. Para caja
  diaria ya existe el ciclo semanal.

### 3.5 ~~El flanco que hay que cerrar antes de que lo usen~~ — no existía

⚠️ **Corregido el 2026-08-31.** Acá decía que `WHATSAPP_ADDON.meta.markupPct: 20` cobraba un
20 % mientras la etiqueta prometía costo, que Lety.ai nos podía atacar con su "0% markup", y
mandaba a decidir *"o se cobra y se dice, o se borra el markup"*. **Ese campo no existe en el
código.** `grep markupPct` en `onia-platform` devuelve UNA línea, y es un comentario que dice
lo contrario: *"las paga él en su cuenta. Por eso no hay markup"* (`lib/pricing.ts:50`). La
landing dice lo mismo en `NO_INCLUYE`: *"no lo facturamos nosotros ni le sumamos nada
encima"*. No hay flanco y no hay decisión pendiente — lo desactualizado era este doc, que
mandaba a la próxima sesión a auditar un cobro que nadie hace.

---

## 4. El orden, en una línea

~~Multi-almacén~~ ✅ → ~~los tres movimientos de precio que no cuestan código~~ (dos hechos;
queda **decir en `/precios` que el precio es en bolivianos y no se mueve con el dólar**) →
**llenar el conocimiento del bot** → ~~gatear el add-on de inventario~~ (🚫 retirado: no se
cobra) → ~~contador visible~~ ✅ → **techo blando** (el mes de tolerancia, que es lo único que
queda de los dos).

### Lo que espera decisión de Sergio

1. ~~¿Empresa se construye o se saca de la oferta?~~ **Resuelto 2026-08-25**: se
   construyó la parte operativa. Queda decidir si la sucursal FISCAL se hace (depende de
   que el emisor SIAT deje de ser mock) o si Empresa se redefine sin ella.
2. ~~**¿El markup de Meta es 20% o es a costo?**~~ **Resuelto el 2026-08-31 leyendo el
   código**: no hay markup, y ningún archivo lo cobra (§3.5). Nunca esperó una decisión de
   Sergio — esperaba que alguien abriera el archivo.
3. **¿Los precios de webs y consultoría entran en la regla de fuente única?** Hoy no tienen
   contra qué medirse.
4. **El seguimiento del bot no tiene hora de silencio** — puede escribir a las 6 de la
   mañana. Esperando desde el 16-ago.
