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
| **Mara Vale** — cuenta sin crear | **Modelo for hire**: aparece en los productos y anuncios **de los clientes**. Su cuenta sería portfolio, no canal de venta |
| **MÉTRICA ÚNICA** | **Demos agendadas con `src=lucia-*`.** Seguidores, likes y vistas son ruido |

**El corte entre las dos:** Lucía vende lo nuestro, Mara modela lo de otros.

## 2. Estado hoy

| | Lucía | Mara |
|---|---|---|
| Cuenta IG | ✅ **creada** — nombre, bio, foto y cuenta profesional cargados | ❌ sin crear |
| Identidad | ✅ congelada | ✅ Soul boliviano nuevo (`Mara BO v2`) |
| Contenido listo | Carrusel de 7 slides + 3 posts de foto | Set de perfil de 7 imágenes |
| Publicado | ❌ **nada todavía** | — |

## 3. Los IDs que hay que usar (copiar de acá, nunca elegir por nombre)

```
Lucía · Element (PRIMER PLANO)   452d8375-fb67-4df7-9ae0-8f1b257aa51f   lucia-ancla-2026-08
Lucía · Element (photoshoot)     902eeebb-89e9-4477-8426-c555b20f7ecc   lucia-surgical-anchor
Lucía · Soul  (cuerpo/escena)    36305a9b-af24-4390-959b-885082dddd5d   LUCIA-REAL-v2-clean
Mara  · Soul                     6c94bbf0-bc71-4fe1-841e-f366bdb00b6e   Mara BO v2
Mara  · Soul JUBILADO            b8f5c353-…  (pelirroja — NO USAR)
```

## 4. Las 4 reglas de producción que costaron caro aprender

1. **Primer plano de cara → `nano_banana_2` + Element (~2 cr). Cuerpo y escena → `text2image_soul_v2` (0,12 cr).**
   El Soul se rompe en plano cerrado: inventa la zona media y sale cara de IA. Se generaron
   11 avatares malos antes de descubrirlo.
2. **Antes de generar, revisar `references/models/`.** Ya existen photoshoot aprobado de 9
   ángulos, 5 outfits y 5 lugares como Elements. Generar de cero es tirar créditos.
3. **Nada de negaciones en el prompt.** Escribir *"sin texto, sin logos"* PRODUCE texto y
   logos. Solo afirmaciones. Y **"Santa Cruz" sola arrastra a California** — siempre
   *"Santa Cruz de la Sierra, Bolivia"*.
4. **QA obligatoria antes de aprobar**: comparar contra `references/models/pecas-clean-v2/`
   (frames del video real). Saltearla fue lo que dejó pasar los avatares deformados.

## 5. Dónde vive cada cosa

| Qué | Dónde |
|---|---|
| Perfil, bio, handle, checklist de alta | `docs/historial/ONIA_MODELOS_PERFILES_ALTA_20260806.md` |
| Pilares, ganchos, molde de pieza, los 6 captions | `docs/historial/ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md` |
| Qué se sube, en qué orden, destacadas, historias, primer video | `docs/historial/ONIA_LUCIA_ARRANQUE_CUENTA_20260808.md` |
| Los 4 frentes de Lucía y sus gates | `docs/historial/ONIA_LUCIA_FRENTES_ANALISIS_20260806.md` |
| Receta visual: bloques de identidad, atuendos, 4 recetas de prompt | `docs/ONIA_MODELOS_RECETA_VISUAL_20260806.md` |
| Fichas: chips, costos, precios | `docs/historial/ONIA_MODELOS_IA_FICHAS_20260801.md` |
| Reglas de identidad y QA | `references/models/AVATAR-CONSISTENCY-SCHEME.md` |
| Molde de carrusel de 8 slides | `web-factory/docs/CAROUSEL_PATTERN_BANK_2026.md` |
| Benchmark medido (4 cuentas) | `references/benchmarks/anora-creators-20260806/ANALISIS.md` |
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

## 7. Lo que depende de Sergio

| | |
|---|---|
| Reclamar **`@oniahq`** | Hoy ONIA es `@oniaagency` y la bio de Lucía menciona `@oniahq` |
| Confirmar el enlace con `?src=lucia-bio` | Sin el parámetro no hay atribución, y esa es LA métrica |
| Activar la **etiqueta de IA** en la cuenta | Obligatoria, va junto con la bio |
| Publicar (manual, ~15 min/día) | Hasta que esté el token de IG (S6) |
| Crear la cuenta de **Mara** | No el mismo día que la de Lucía |
| **PVP + stock + envío** | Destraba el frente de e-commerce propio |
| **OK de gasto del primer video** | ~17 cr. Las imágenes ya están validadas como triviales; el video no |

## 8. Cosas rotas o pendientes, dichas de frente

- **La biblioteca de 12 imágenes del 2026-08-08 no se pudo descargar.** El CDN de Higgsfield
  devuelve `AccessDenied` para esos objetos (las generadas otros días bajan bien). Los 12 job
  IDs y el comando para recuperarlas están en
  `references/modelos/lucia/biblioteca-20260808/LEEME.md`. **No hay que regenerarlas.**
- **Ningún post está publicado.** Todo el contenido existe y está aprobado, pero la cuenta
  sigue en cero. Construido ≠ terminado.
- **Falta decidir si Mara se queda con la cara actual** o se le entrena una latina distinta.
  Entrenar un Soul cuesta **25 cr**, no es gratis.

---

*Regla de este doc: si algo cambia, se edita ACÁ y en su fuente — no se crea otro índice.*
