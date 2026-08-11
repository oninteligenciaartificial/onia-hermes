# RAÍZ — Modelos IA de ONIA (empezar acá)

> **Este es el punto de entrada.** Si vas a trabajar en Lucía o Mara, leé esto primero y
> seguí los enlaces. No abras otro doc "maestro": este índice manda.
>
> Última actualización: 2026-08-10.

---

## 1. Para qué existen (si esto se pierde, todo lo demás da igual)

| | |
|---|---|
| **Lucía Antelo** — `@lucia.antelo.oficial` | Vende **la plataforma ONIA**. Y es la vitrina viva del producto de ticket alto *"te creamos tu influencer IA"*: cada post suyo es un demo funcionando |
| **Mara Vale** — cuenta sin crear | **Modelo for hire**: aparece en los productos y anuncios **de los clientes**. Su cuenta es portfolio **y** canal propio: CTA *"Escribime MODELO"* → `?src=mara-*` |
| **MÉTRICA ÚNICA** | **Demos agendadas con `src=lucia-*`.** Seguidores, likes y vistas son ruido |

**El corte entre las dos:** Lucía vende lo nuestro, Mara modela lo de otros.

> ⛔ **Handle jubilado: `@lu.antelo`.** Está **ocupado por una persona real** — no es nuestro y
> nunca lo fue. Sigue escrito como instrucción ejecutable en
> `ONIA_META_CIERRE_VERIFICACION_20260726.md` §370/375 (el procedimiento del token S6 manda
> loguearse con él) y en `references/models/lucia-onia-identity-bible.md:23`, donde además dice
> "verificado LIBRE", que es falso. Donde diga `@lu.antelo`, leer `@lucia.antelo.oficial`.
>
> 🟡 **Decisión abierta (Sergio):** este doc bajaba a Mara a "portfolio, no canal de venta",
> pero `ONIA_MODELOS_PERFILES_ALTA_20260806.md:45` ya le tiene CTA, enlace `?src=mara-bio` y
> métrica propia, y los 6 posts cierran en *"Escribime MODELO"*. Arriba quedó la versión con
> canal. Si la querés puramente portfolio, hay que borrarle el CTA a las 6 piezas.

## 2. Estado hoy

| | Lucía | Mara |
|---|---|---|
| Cuenta IG | ⚠️ **sin confirmar** — el perfil está 100% escrito y espera el alta manual (~15 min, teléfono de Sergio). Ninguna fuente del repo registra que se haya creado; la más reciente (`ARRANQUE_CUENTA` del 08-08) la sigue listando como pendiente. **Sergio: si ya la creaste, poné acá la fecha** | ❌ sin crear |
| Identidad | ✅ congelada | ✅ Soul boliviano nuevo (`Mara BO v2`) |
| Contenido listo | Carrusel de 7 slides (`carousels/out/lucia-reveal-foto/`) + **6 posts de foto** en `references/modelos/lucia/posts-20260807/` (P1 ya lo reemplaza el carrusel → quedan 5 fotos + carrusel = 8 días de cola) + **biblioteca de 12 escenas** ya en el repo | Set de perfil de 7 imágenes |
| Publicado | ❌ **nada todavía** | — |

> ⚠️ En `carousels/out/` hay **dos** carpetas de Lucía con 7 slides. La buena es
> **`lucia-reveal-foto/`** (pack `editorial-photo`, acento terracota). `lucia-reveal-20260809/`
> es la versión tipográfica que Sergio rechazó — no publicarla.

## 3. Los IDs que hay que usar (copiar de acá, nunca elegir por nombre)

```
Lucía · Element (PRIMER PLANO)   452d8375-fb67-4df7-9ae0-8f1b257aa51f   lucia-ancla-2026-08
Lucía · Element (photoshoot)     902eeebb-89e9-4477-8426-c555b20f7ecc   lucia-surgical-anchor
Lucía · Soul  (cuerpo/escena)    36305a9b-af24-4390-959b-885082dddd5d   LUCIA-REAL-v2-clean
Mara  · Soul                     6c94bbf0-bc71-4fe1-841e-f366bdb00b6e   Mara BO v2
Mara  · Soul JUBILADO            b8f5c353-faaf-44eb-ae5a-4e0bacfd333f   (pelirroja — NO USAR)
```

⚠️ **Por qué el nombre no alcanza:** los mismos nombres existen a la vez como **Soul** y como
**Element**, con UUID distinto — `LUCIA-REAL-v2-clean` es Soul `36305a9b` *y* Element
`d5e323ef-4d0e-41bf-863e-ec30aede20ae`; `Mara BO v2` es Soul `6c94bbf0` *y* Element
`221b3ca8-…`. Elegir por nombre en la UI es una moneda al aire. Por eso el UUID del jubilado
también va completo: truncado no se puede comparar, y para descartarlo habría que elegir por
nombre, justo lo que esta sección prohíbe.

**Outfits y lugares** (los que manda reusar la regla 2) tienen sus 10 UUIDs en
`references/models/` — usar el catálogo con sufijo **`-v2`**. Los 4 outfits viejos sin sufijo
siguen vivos en la cuenta y aparecen al buscar por nombre.

## 4. Las reglas de producción que costaron caro aprender

0. **El bloque de identidad se pega SIEMPRE, sin editar, en todo prompt.** Es lo que fija la
   cara; sin él el ID solo no alcanza. Está congelado en
   `ONIA_MODELOS_RECETA_VISUAL_20260806.md` §2. Lucía:
   *"Bolivian woman, 26, warm tan skin with light freckles, long dark wavy hair, brown eyes,
   natural minimal makeup, real skin texture with visible pores."*
   Mara: *"Bolivian mestiza woman, 27, light olive-tan skin, oval face, expressive dark brown
   eyes, natural thick eyebrows, dark brown hair in a soft blunt shoulder-length cut with a
   middle part, real skin texture with visible pores."*
1. **Primer plano de cara → `nano_banana_2` + Element (~2 cr). Cuerpo y escena → `soul_2` (0,12 cr).**
   El Soul se rompe en plano cerrado: inventa la zona media y sale cara de IA. Se generaron
   11 avatares malos antes de descubrirlo.
2. **Antes de generar, revisar `references/models/`.** Ya existen photoshoot aprobado de 9
   ángulos, 5 outfits y 5 lugares como Elements. Generar de cero es tirar créditos.
3. **Nada de negaciones — pero solo en la vía Soul.** Con `soul_2`, escribir *"sin texto, sin
   logos"* PRODUCE texto y logos: ahí van solo afirmaciones. En la vía `nano_banana_2` +
   Element pasa lo contrario y todos los prompts validados terminan con negaciones. Y
   **"Santa Cruz" sola arrastra a California** — siempre *"Santa Cruz de la Sierra, Bolivia"*.
4. **QA obligatoria antes de aprobar**: comparar contra `references/models/pecas-clean-v2/`
   (18 frames del video real). Saltearla fue lo que dejó pasar los avatares deformados.
   Para carruseles, `node scripts/carousel_contactsheet.js` arma los 7 slides en una grilla.

## 5. Dónde vive cada cosa

| Qué | Dónde |
|---|---|
| Perfil, bio, handle, checklist de alta | `docs/ONIA_MODELOS_PERFILES_ALTA_20260806.md` |
| Pilares, ganchos, molde de pieza, los 6 captions | `docs/ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md` |
| Qué se sube, en qué orden, destacadas, historias, primer video | `docs/ONIA_LUCIA_ARRANQUE_CUENTA_20260808.md` |
| Los 4 frentes de Lucía y sus gates | `docs/ONIA_LUCIA_FRENTES_ANALISIS_20260806.md` |
| Receta visual: bloques de identidad, atuendos, 4 recetas de prompt | `docs/ONIA_MODELOS_RECETA_VISUAL_20260806.md` |
| Fichas: chips, costos, precios | `docs/ONIA_MODELOS_IA_FICHAS_20260801.md` |
| Reglas de identidad y QA | `references/models/AVATAR-CONSISTENCY-SCHEME.md` — ⛔ **desactualizado**: sigue diciendo que `soul_2` es el DEFAULT y los Elements el "último recurso", al revés de la regla 1. Sirve el método de QA; **la elección de motor la manda §4** |
| Molde de carrusel de 8 slides | `web-factory/docs/CAROUSEL_PATTERN_BANK_2026.md` |
| Benchmark medido (3 cuentas) | `references/benchmarks/anora-creators-20260806/ANALISIS.md` |
| **Fotos de Lucía** | `references/models/` (banco viejo + photoshoot) · `references/modelos/lucia/` (avatar, posts, biblioteca) |
| **Fotos de Mara** | `references/modelos/mara-bo/` |
| Briefs de carrusel | `hermes-content/carousels/briefs/` |
| Carruseles renderizados | `hermes-content/carousels/out/` |

## 6. Comandos

```bash
# Renderizar un carrusel de Lucia (costo CERO, todo por codigo)
npm run carousel:render -- --brief hermes-content/carousels/briefs/lucia-reveal-20260809.json --out hermes-content/carousels/out/lucia-reveal-foto --account lucia --pack editorial-photo --accent "#E4714E"
```

**Packs:** `editorial-photo` = la foto manda, para las modelos · `typographic` = ONIA, marca
corporativa. **No usar el tipográfico en las cuentas de modelo: las hace ver como una empresa
de software.**

**Acento de Lucía: `#E4714E`** (terracota, uno de los colores de su vestuario). El verde
`#00D26A` es de ONIA y no va en sus piezas.

```bash
# Revisar los 7 slides de un vistazo ANTES de aprobar (regla 4)
node scripts/carousel_contactsheet.js hermes-content/carousels/out/lucia-reveal-foto

# Gate del motor de carruseles — correrlo si tocaste scripts/carousel_render.js
npm run test:carousel
```

⚠️ El render **no es determinista**: correr el ejemplo de arriba sobre un árbol limpio deja
3 de los 7 PNG modificados byte a byte. Con el autosync activo eso se commitea solo. Si solo
querés mirar, mandá el `--out` a una carpeta temporal, no a la versionada.

## 7. Quién hace qué

> **El operador de las modelos es Arthur** desde el 2026-08-06 (decisión de Sergio). Sergio
> crea cuentas, aprueba piezas y autoriza gasto de video. Detalle:
> `ONIA_ARTHUR_CARRIL_CONTENIDO_Y_PAGO_20260801.md` §5-ter.

**Bloquea el post 1** (sin esto no se publica nada):

| | Dueño |
|---|---|
| Crear la cuenta de Lucía (manual, ~15 min desde el teléfono) | Sergio |
| Activar la **etiqueta de IA** — obligatoria, va junto con la bio | Sergio |
| Confirmar el enlace con `?src=lucia-bio` — sin el parámetro no hay atribución, y esa es LA métrica | Sergio |
| Cargar avatar, bio, destacadas y subir la cola ya armada | Arthur |

**No bloquea el post 1** (se hace en paralelo o después):

| | Dueño |
|---|---|
| Reclamar **`@oniahq`** — hoy ONIA es `@oniaagency` y la bio de Lucía lo menciona | Sergio |
| **Token de IG (S6)** — trámite ~1 h, sin App Review por ser cuenta propia. Requiere antes vincular la cuenta al BM OniaAgency `1451773736711697`. Destraba la publicación automática | Sergio |
| Publicar manual (~15 min/día) mientras no esté el token | Arthur |
| Crear la cuenta de **Mara** — no el mismo día que la de Lucía | Sergio |
| **PVP + stock + envío** — destraba el frente de e-commerce propio | Sergio |
| **OK de gasto del primer video** (~17 cr sobre un saldo de ~2.860 en plan ULTRA). Las imágenes ya están validadas como triviales; el video no | Sergio |
| Registrar cada lote de Higgsfield y reportar leads con `src=` | Arthur |

## 8. Cosas rotas o pendientes, dichas de frente

- ~~La biblioteca de 12 imágenes del 2026-08-08 no se pudo descargar.~~ **RESUELTO el
  2026-08-10:** el CDN se normalizó y las 12 bajaron completas (100 MB) a
  `references/modelos/lucia/biblioteca-20260808/`. No costó ni un crédito. Los ~18 cr de la
  generación original no se perdieron.
- **Ningún post está publicado.** Todo el contenido existe y está aprobado, pero la cuenta
  sigue en cero. Construido ≠ terminado.
- **Falta decidir si Mara se queda con la cara actual** o se le entrena una latina distinta.
  Entrenar un Soul cuesta **25 cr**, no es gratis.

## 9. Deuda viva en otros docs (auditado el 2026-08-10)

Este índice manda, pero no puede borrar lo que ya está escrito en otro lado. Lo que sigue
contradice a este doc y **hay que corregir en la fuente**:

| Dónde | Qué dice mal |
|---|---|
| `references/models/mara-onia-identity-bible.md` | Lleva el Soul nuevo (`6c94bbf0`) pero describe el face lock de la **jubilada** ("pelirroja, pelo cobrizo"). Genera la cara descartada |
| `references/models/AVATAR-CONSISTENCY-SCHEME.md` | `soul_2` como DEFAULT y Elements como "último recurso" — al revés de la regla 1 |
| `ONIA_META_CIERRE_VERIFICACION_20260726.md` §370/375 | Manda loguearse con `@lu.antelo`, que es de otra persona |
| `ONIA_EJERCITO_INFLUENCERS_IA_PLAN_20260806.md` y el plan automatizado | Nombran `b8f5c353` como Soul aprobado de Mara, y a Lucía vendiendo "webs y servicios" en vez de la plataforma |

Y los cuatro docs con reglas operativas que este índice **no reemplaza** (los complementa):
el plan del ejército (fases y gatillos) · el plan automatizado (circuito comentario→DM→`?src=`)
· el carril de Arthur §5-ter (qué es suyo, reglas de gasto) · `AI_INFLUENCERS_ACCOUNT_OPS`
(SIMs, emails, BM).

---

*Regla de este doc: si algo cambia, se edita ACÁ y en su fuente — no se crea otro índice.*
