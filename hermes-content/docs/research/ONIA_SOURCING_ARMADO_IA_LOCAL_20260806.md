# Sourcing y armado propio — todas las fuentes y posibilidades (2026-08-06)

Continuación de `ONIA_LISTA_EQUIPOS_IA_LOCAL_20260806.md`. Sergio propone **armar los equipos
en vez de importarlos terminados**, para mejor rendimiento por peso de dinero. Acá está el
mapa completo de qué se puede armar, qué no, y de dónde sale cada cosa.

---

## 1. Corrección: qué se puede armar y qué no

### ❌ El T2 (Strix Halo) NO se puede armar desde componentes

La memoria **LPDDR5X de 128 GB va soldada y no es actualizable** — y no es una decisión
comercial: *"la LPDDR5X soldada no es un compromiso, es lo que hace posible el bus de 256
bits"*. Un arreglo con DIMMs socketeados a ese ancho de banda **no existe** con las
tolerancias de fabricación actuales en ese sobre térmico.

Lo mismo aplica a los Mac: memoria unificada soldada al SoC.

**Conclusión: los tiers de memoria unificada se compran, no se arman.**

### ✅ Pero hay una vía intermedia que es mejor que ambas

**Framework vende el mainboard suelto**, y el Desktop **se envía como kit que vos armás**.
Minisforum ya mostró una **placa Mini-ITX con Ryzen AI Max+ 395 y 128 GB**.

Eso habilita la jugada real:

> **Importar sólo la placa con SoC + memoria (densa, chica, cara) y conseguir localmente lo
> voluminoso: gabinete, fuente, ventilación, almacenamiento.**

[Framework Desktop review — ServeTheHome](https://www.servethehome.com/framework-desktop-review-a-solid-amd-strix-halo/4/) ·
[Minisforum Mini-ITX Strix Halo](https://videocardz.com/newz/minisforum-shows-desktop-mini-itx-board-with-ryzen-ai-max-395-strix-halo-and-128gb-lpddr5x-memory)

### ✅ Los tiers con GPU discreta (T3, T5, T6) sí se arman

Es práctica estándar de la industria. Ahí el armado propio es donde más margen se captura.

---

## 2. El principio que ordena todo: **no importar aire**

| Componente | Peso | Volumen | ¿Importar? |
|---|---|---|---|
| GPU | ~2 kg | ~3 L | ✅ densísimo en valor |
| Placa + SoC + memoria soldada | ~1 kg | ~2 L | ✅ |
| CPU, RAM, SSD | gramos | ~0 | ✅ |
| Fuente 1000 W+ | ~2 kg | ~3 L | ✅ vale la pena |
| Disipación / ventiladores | ~1 kg | ~4 L | ⚠️ evaluar |
| **Gabinete torre / rack** | **8–12 kg** | **~60 L** | ❌ **es aire caro** |

Un gabinete ocupa **veinte veces** el volumen de una GPU y vale una fracción. Traerlo desde
China es pagar flete por espacio vacío.

**Alternativas para el gabinete:** comprarlo en plaza en Santa Cruz · mandarlo a fabricar en
metalmecánica local (Bolivia tiene capacidad de sobra para chapa plegada) · importarlo
*flat-pack* si alguna fábrica lo ofrece desarmado.

Esto solo puede cambiar el costo de flete de un embarque más que cualquier negociación de
precio unitario.

---

## 3. Las seis vías de compra — todas las posibilidades

| # | Vía | Qué es | Margen | Complejidad | Veredicto |
|---|---|---|---|---|---|
| 1 | **Equipo terminado** | Importás el mini PC listo y lo revendés | Bajo | Baja | Para el T0/T2 de arranque |
| 2 | **Componentes + armado propio** | Importás las piezas y armás acá | **Alto** | Media | ✅ **La vía de Sergio, correcta para T3/T5** |
| 3 | **Barebones** | Chasis + placa + fuente de fábrica; CPU/RAM/SSD se completan local | Medio-alto | Media | ✅ Muy buen punto medio |
| 4 | **Sólo la placa/módulo** | Traés el mainboard Strix Halo y el resto local | **Alto** | Media | ✅ **La jugada para el T2** |
| 5 | **ODM / marca blanca** | Una fábrica china produce con marca ONIA | Alto | Alta — MOQ 100–500 u | 🔮 A futuro, no ahora |
| 6 | **Refurb / ex-datacenter** | GPUs A100, V100, RTX 3090/4090 usadas | **Altísimo** | Alta | ⚠️ Ver §6 — hay que verificar |

---

## 4. Mapa de fuentes por geografía

| Origen | Qué se consigue | Ruta a Bolivia | Nota |
|---|---|---|---|
| **China — Guangdong** (Shenzhen, Dongguan) | Mini PCs, fuentes, disipación, gabinetes, RAM/SSD de marca china | Arica/Iquique · 35–45 días | El grueso. Feria de Cantón oct-2026 |
| **China — Jiangsu/Zhejiang** | Placas, componentes industriales | ídem | |
| **Taiwán** | **Gigabyte, ASRock (Rack), ASUS, MSI** — placas, GPU AIB, barebones de servidor | ídem | **Computex Taipei** es LA feria de componentes |
| **Brasil** | Poco competitivo en electrónica | Corumbá → Puerto Suárez · corto | **ACE-36** da preferencia arancelaria, pero el precio no compensa acá |
| **Chile — ZOFRI Iquique** | Consolidación y almacenaje | Terrestre | Son **distribuidores** → viola la regla de fábrica. Sirve como bodega, no como proveedor |
| **Paraguay — Ciudad del Este** | Hub electrónico regional | Terrestre | Mercado gris, trazabilidad dudosa. **Descartar** |
| **EE.UU. / Miami** | Retail y canal | Aéreo | No hay fábrica. Sólo si falta algo puntual y urgente |
| **Hong Kong** | Hub de trading | — | Son traders. **Descartar** por la regla |

---

## 5. Fábricas reales por componente (candidatas a verificar)

Ninguna verificada todavía — hay que pasarles el checklist de `playbook §4.6`
(GSXT, CE a nombre de la fábrica, licencia de exportación propia).

| Componente | Fábricas chinas (compra directa más viable) | Taiwanesas |
|---|---|---|
| **Placa + SoC Strix Halo** | Minisforum, GMKtec, Beelink, Nimo | Framework (EE.UU./ODM) |
| **GPU (AIB)** | **Colorful, Maxsun, Gainward, Galax, Soyo** | Palit, Zotac, MSI, Gigabyte, ASUS |
| **Placas madre** | Colorful, Maxsun, Onda, Soyo | ASRock, Gigabyte, ASUS, MSI |
| **Fuentes** | **Great Wall, Segotep, Huntkey** | Seasonic, FSP, Super Flower |
| **RAM / SSD** | Netac, KingBank, Gloway, Lexar, KingSpec | — |
| **Disipación** | **Deepcool, ID-Cooling, Thermalright** | — |
| **Barebones de servidor** | Inspur, H3C, whitebox de Shenzhen | **ASRock Rack, Gigabyte, Supermicro (canal)** |
| **Gabinetes** | — | — | → **local** |

**Las marcas chinas de GPU y fuentes son las más accesibles para compra directa**: las
taiwanesas y las occidentales operan por canal de distribución, y en plena escasez no le dan
allocation a un comprador nuevo.

---

## 6. Refurb / ex-datacenter — la posibilidad de mayor margen y mayor riesgo

GPUs usadas de datacenter o de minería (A100 40 GB, V100, RTX 3090 24 GB, 4090) tienen la
mejor relación rendimiento/precio que existe para inferencia local.

**Riesgos reales:**
- **Cero garantía.** Tarjetas potencialmente abusadas por minería 24/7.
- **Valoración aduanera de usados** — la ANB puede aplicar criterios distintos al valor de
  factura.
- ⚠️ **Bolivia sí restringe la importación de usados en algunas categorías** (ropa usada
  prohibida; vehículos siniestrados prohibidos). **No encontré prohibición para electrónica
  usada**, pero *ausencia de evidencia no es evidencia de ausencia*. **Consultar a la
  despachante antes de considerarlo.**
  [Importaciones prohibidas y restringidas — trade.gov](https://www.trade.gov/country-commercial-guides/bolivia-prohibited-and-restricted-imports)

**Postura sugerida:** no en el primer embarque. Es una vía para cuando ya tengas operación,
proveedor de confianza y capacidad de testear antes de vender.

---

## 7. La receta — no armar a medida, armar 3 configuraciones fijas

El error clásico del que arma PCs es configurar distinto para cada cliente. Eso hace el
soporte imposible y mata el margen.

| Producto | Qué lleva | Corre | Uso |
|---|---|---|---|
| **Onia Edge** | Jetson Orin Nano Super | 3B, visión | Demo, kiosco, planta |
| **Onia Box** | Placa Strix Halo 128 GB + SSD + gabinete y fuente locales | **70B enteros** | El caballo de batalla |
| **Onia Pro** | Placa + RTX 5090 32 GB + 128 GB DDR5 + fuente 1000 W + gabinete local | 32B Q4 rápido, 70B con 2 GPUs | Cliente que necesita velocidad |

Tres SKUs, repuestos comunes, un solo manual de soporte. **Se puede escalar; una configuración
por cliente, no.**

---

## 8. Los tres riesgos del armado propio

**Garantía.** Si armás, la garantía al cliente la das vos, y el RMA de cada componente viaja
por separado a China. **Presupuestar 3–5 % de repuestos en cada embarque** — no es opcional.

**Calidad.** ESD, testeo de quemado, control de temperatura. Una falla en sitio cuesta más que
todo el margen que ahorraste armando.

**Y el conceptual: armar PCs es vender horas** — justo lo que dice
[[onia-vende-software-nunca-horas]]. La forma de que no lo sea: **el armado es medio, no
producto.** Lo que se vende es la caja **llegando con el stack de IA corriendo y con soporte**.
Si el cliente percibe que compra "una PC armada", ya perdiste; compite contra cualquier local
de la Ramada.

---

## 9. Recomendación

1. **Arrancar con la vía 4** (importar la placa Strix Halo, gabinete y fuente locales) para el
   **Onia Box**, y **vía 1** (terminado) para el **Onia Edge**. Es el mejor equilibrio entre
   margen, flete y complejidad.
2. **Vía 2 (armado completo)** para el **Onia Pro**, donde el armado sí es estándar y el
   margen lo justifica.
3. **Cotizar en paralelo China y Taiwán** para GPU y placas — la diferencia de precio y de
   disposición a venderle a un comprador nuevo va a ser grande.
4. **Descartar por ahora:** ODM marca blanca (MOQ demasiado alto), refurb (verificar
   normativa), Paraguay y Hong Kong (mercado gris / traders).
5. **Verificar la capacidad local de gabinetes en Santa Cruz** antes del primer embarque — de
   eso depende cuánto flete te ahorrás.

---

## Fuentes

- [Framework Desktop review — ServeTheHome](https://www.servethehome.com/framework-desktop-review-a-solid-amd-strix-halo/4/)
- [Minisforum Mini-ITX con Strix Halo — VideoCardz](https://videocardz.com/newz/minisforum-shows-desktop-mini-itx-board-with-ryzen-ai-max-395-strix-halo-and-128gb-lpddr5x-memory)
- [Comparativa mini PCs Ryzen AI Max+ 395](https://computingforgeeks.com/ryzen-ai-max-395-mini-pc-comparison/)
- [Importaciones prohibidas y restringidas en Bolivia — trade.gov](https://www.trade.gov/country-commercial-guides/bolivia-prohibited-and-restricted-imports)
- [Artículos prohibidos — FedEx Bolivia](https://www.fedex.com/es-bo/shipping/prohibited-items.html)
