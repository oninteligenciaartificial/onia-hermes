# Campaña 1 — creada en PAUSA, lista para encender

> ⚠️ **FOTO DEL 13-AGO — ya no es lo vigente (marcado el 2026-09-30 por el carril Mercado).** La campaña de
> abajo está **archivada** y no se reactiva. La campaña vigente está especificada en
> `ONIA_ADQUISICION_Y_PAUTA.md` §5: **clic a WhatsApp**, no tráfico a la web. Las piezas A2 de este doc son
> **solo tipografía** (no pasan *"producto visible o no sale"*, `CLAUDE.md` §5) y sus precios y estados están
> vencidos.

> 2026-08-13. Objetivo de la sesión: creatividades + público + campaña en pausa con tope y
> fecha de fin. **Nada encendido. Nada gastado.**

## Estado verificado por API hoy (no copiado de un doc)

| Qué | Valor |
|---|---|
| Cuenta usada | **ONIA Ads** `1073680778314945` (USD, business OniaAgency, mínimo $1/día) |
| Cuenta NO usada | `679613631427810` (BOB, **sin business**) — regla: no se usa para gasto real |
| `has_payment_method` | ❌ **false en las DOS.** Verificado hoy con `ads_get_ad_accounts` |
| Página vinculada a la cuenta | ❌ `ads_get_ad_account_pages` → `{"pages":[]}` |
| Pixel | `1012611478191231` "ONIA Web", activo pero **`last_fired_time` = epoch 0: nunca disparó** |

**Son TRES bloqueos, no uno.** El del pixel no estaba anotado en ningún lado.

## Lo creado (PAUSED las dos)

| Nivel | ID | Config |
|---|---|---|
| Campaña | `120253773124020022` | `OUTCOME_TRAFFIC` · CBO · **lifetime USD 35** · stop **2026-09-05 23:59 -04** |
| Ad set | `120253773125540022` | `LINK_CLICKS` · destino `WEBSITE` · Bolivia · 28-55 · sin intereses · A+A apagado |

### Por qué lifetime y no tope diario

Meta **rechaza un tope de gasto de campaña menor a USD 100**
(`Campaign Spending Limit Too Low`, subcode 2446307). Un tope de $35 no se puede cargar por
esa vía. El presupuesto **lifetime de $35 sí es techo duro**: pase lo que pase, la campaña no
gasta un centavo más. Con una ventana de 7 días eso pacea en ~$5/día, que era el número.

**Si querés control diario explícito:** al activar, mové el `stop_time` a activación + 7 días.
La ventana define el ritmo; el techo total ya está puesto.

### Por qué OUTCOME_TRAFFIC y no OUTCOME_LEADS

Sin página vinculada no hay formulario de leads ni destino de mensajería, y sin pixel que
haya disparado no se puede optimizar a conversión. `LINK_CLICKS` es lo único que la cuenta
puede ejecutar hoy. **No importa mucho**: los leads los cuenta nuestro propio circuito
`?src=` en el panel, no Meta. Cuando el pixel dispare, se sube a `LANDING_PAGE_VIEWS`.

### ⚠️ El público está a nivel país, hay que acotarlo a mano

El MCP **no expone búsqueda geográfica**, así que no tengo la clave de "Santa Cruz de la
Sierra" y no la voy a inventar. Quedó `countries: ["BO"]`. **Antes de activar, en Ads Manager:
cambiar a Santa Cruz de la Sierra + 25 km.** Son dos clics con el autocompletado. El nombre del
ad set lo dice en mayúsculas para que no se pase por alto.

Lo demás del público sí quedó como corresponde:
- **28-55.** Un dueño de clínica dental con consultorio propio no tiene 25.
- **Sin intereses.** Meta no tiene "dueño de clínica dental" como interés; inventar IDs está
  prohibido y el catálogo es chico — el algoritmo aprende mejor amplio.
- **Advantage+ Audience apagado** (`advantage_audience: 0`) para que el corte de edad sea duro.
  Con A+A encendido la edad es solo una sugerencia. Revisar esta decisión cuando haya señal
  de conversión: sin pixel, A+A no tiene de dónde aprender.

## Creatividades — costo CERO (render por código, no IA)

Imágenes en `hermes-content/carousels/out/ads/`, briefs en `carousels/briefs/ads/`.
Se rehacen con `npm run carousel:render -- --brief <brief> --out <dir> --account onia --pack typographic`.

### A2-v1 · el paciente que no volvió ← **la que arranca**

- **Imagen:** `ad-a2-v1-no-volvieron/slide-01.png`
- **Titular:** ¿Cuántos pacientes **no volvieron** este mes?
- **Texto principal:**
  > SOLO para clínicas dentales de Santa Cruz.
  >
  > El paciente que se hizo una limpieza en marzo y no volvió: ¿lo llamó alguien?
  >
  > En la mayoría de las clínicas esa lista no existe. Vive en la cabeza de la recepcionista y en un cuaderno.
  >
  > Onia la arma sola: quién no vuelve hace seis meses, quién dejó un tratamiento a medias, quién tiene una cuota pendiente. Y avisa.
  >
  > Te muestro cómo se ve con los datos de tu clínica, en 20 minutos.
- **Descripción:** Demo de 20 minutos, sin compromiso
- **CTA:** Más información → `https://onia.com.bo/?src=ads-a2-v1`

### A2-v2 · el cuaderno ← la segunda del par

- **Imagen:** `ad-a2-v2-cuaderno/slide-01.png`
- **Titular:** Tu clínica no puede depender de un **cuaderno**
- **Texto principal:**
  > Si tu recepcionista se toma vacaciones, ¿la clínica sabe a quién llamar?
  >
  > Las citas, los tratamientos a medias y las cuotas pendientes viven en su memoria y en un cuaderno. Eso no es un sistema: es una persona haciendo de sistema.
  >
  > Onia lo guarda y hace el seguimiento solo: recordatorios, control de tratamiento, cobros pendientes.
  >
  > Demo de 20 minutos con los datos de tu clínica.
- **Descripción:** Software para clínicas dentales en Bolivia
- **CTA:** Más información → `https://onia.com.bo/?src=ads-a2-v2`

### A3 · la silla vacía — rotación siguiente, NO va en el primer par

- **Imagen:** `ad-a3-silla-vacia/slide-01.png`
- **Titular:** ¿Sabés cuánto te cuesta una **silla vacía**?
- **Texto principal:**
  > Una hora sin paciente no aparece en ningún reporte. Por eso no duele hasta fin de mes.
  >
  > Onia te dice qué horas quedaron libres, quién canceló y quién nunca confirmó — y manda el recordatorio antes de que pase.
  >
  > Demo de 20 minutos.
- **CTA:** Más información → `https://onia.com.bo/?src=ads-a3`

**Van dos anuncios, no tres.** Con $5/día no hay volumen para repartir señal entre más de dos.
A3 entra cuando A2 se agote o pierda.

### Reglas que cumple el copy

Sin resultados prometidos · sin testimonios (no hay clientes que mostrar) · sin cifras de
terceros · sin urgencia falsa · **sin decir que el SIAT es obligatorio** (el Portal del SIN es
gratis y cumple) · nunca se menciona que usamos plantillas · cada pieza con su `?src=`.

## Lo que falta para encender, en orden

| # | Qué | Quién | Nota |
|---|---|---|---|
| 1 | Vincular la página **Onia** `1140384625819526` a la cuenta de ads dentro del BM | Sergio | Gratis, 5 min. **Sin esto no se puede crear el anuncio**, aunque haya tarjeta |
| 2 | Cargar método de pago en `1073680778314945` | Sergio | |
| 3 | Acotar el público a Santa Cruz de la Sierra + 25 km | Sergio o yo, en Ads Manager | |
| 4 | Confirmar tope diario y total | **Sergio** | Hoy: $35 total, ventana al 5-sep. Si querés otro número, decilo |
| 5 | Instalar el pixel en onia.com.bo | — | Existe pero nunca disparó. Sin él no hay optimización a conversión |
| 6 | Migrar el token USER a System User | Sergio | ⚠️ **Vence 2026-09-05** y se lleva el motor puesto |

**Regla de corte:** si a los 7 días el costo por clic al sitio no trae ni una reunión
atribuida con `?src=ads-*`, se apaga y se cambia el ángulo. No se sube el presupuesto
"para darle tiempo".

## Corregido de paso

`scripts/carousel_render.js` estampaba **`@oniahq`** en toda pieza de ONIA. Ese handle **no es
nuestro** — está por reclamar. Ahora estampa `@oniaagency`, el real. Afectaba a todos los
carruseles, no solo a estos ads.

---

Relacionado: `web-factory/docs/ADS_PATTERN_BANK_2026.md` (los 4 ángulos y qué se copia de la
Ad Library) · `docs/platform/ONIA_ENFOQUE_20260727.md` (quién es el cliente A) ·
memoria `meta-ads-engine`.
