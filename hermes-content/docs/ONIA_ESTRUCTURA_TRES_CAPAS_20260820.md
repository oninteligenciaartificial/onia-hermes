# Las tres capas: Onia · Lucía · Sergio — mapa y lo que falta

**2026-08-20.** Sergio pidió armar la estructura para Lucía y complementarla con una propuesta
que le hicieron, "para mi marca personal". **La propuesta todavía no la tengo** — este documento
es lo que se puede decidir sin ella, y deja marcado exactamente dónde encaja cuando llegue.

---

# 1 · Las tres capas son tres cosas distintas, y hoy están mezcladas

| Capa | Quién es | Qué vende | Moneda |
|---|---|---|---|
| **@oniahq** | la empresa | el software | **reuniones** |
| **Lucía** | influencer IA **declarada** | atrae y deriva a Onia | **alcance** |
| **Sergio** | persona real | autoridad: el que construye | **credibilidad** |

Esa separación **ya está decidida y escrita** para las dos primeras, y es buena:
`@oniahq` es el **vendedor**, Lucía es el **medio**. La "prueba del vendedor" decide dónde va
cada pieza, y a Lucía le está permitido el informativo genérico que a Onia le hace daño.

**La tercera capa es la que no existe.**

## Lo que Lucía puede y lo que no

- **Puede:** mostrar el producto, explicar, opinar sobre el desorden de un negocio, derivar.
- **No puede:** testimoniar. Es IA declarada — no puede decir "yo tenía una panadería". Ya está
  escrito en su ficha: *nunca testimonia, no promete números, no habla de salud ni de dinero.*
- **Y por eso Sergio importa:** es el único de los tres que puede decir **"esto lo construí yo"**.
  Eso es lo que Lucía no tiene y no puede comprar.

---

# 2 · Tres cosas que están costando plata o calidad AHORA

## 2.1 · La voz estaba invertida en este worktree — **corregido hoy**

El archivo que manda sobre Lucía decía, en la copia local, que la voz oficial era
`wrXs6GqcC7X03dDKMoeT` y marcaba la correcta como *"⛔ Truncado = Voice not found. No usarlo"*.
**Es exactamente al revés de lo vigente:** la oficial es **Marcela — `86V9x9hrQds83qf7zaGn`**,
decidida por Sergio el 15-ago y cargada en el VPS.

Quien generara audio leyendo el worktree usaba **la voz descartada**.

**Causa raíz:** el worktree estaba **494 commits** atrás de `main`. Se mergeó hoy y quedó
corregido. Y explica varias cosas que en fichas anteriores di por faltantes y sí existían.

> **Regla que sale de esto:** antes de leer un doc de decisión, verificar contra `origin/main`,
> no contra el checkout local. Un worktree viejo no es una fuente de verdad.

## 2.2 · 12 piezas generadas en Higgsfield y nunca descargadas

Detectado en la auditoría del 12-ago y **sin evidencia de que se hayan bajado**. Los créditos ya
se gastaron y el archivo vive en el CDN de un tercero. **Si caduca, se paga dos veces.**

Es la punta suelta más cara del carril y se resuelve bajando archivos. No necesita decisión.

## 2.3 · Lucía está cableada y publica CERO

Saltó de "no existe" a "cableada" el 20-ago:

| | |
|---|---|
| Cuenta | `@lucia.antelo.oficial`, IG id `28357585133845376`, tipo Creador |
| Conectada a | **Postiz** (integración `cmt1sv4eh001alq9cl3y6q7es`) **y** a la app de Meta, con `messages`+`comments` suscritos |
| Publicaciones | **0** |
| Seguidores | **0** |
| Piezas listas en disco | **6** (P1–P6, renderizadas con captions) |
| Biblioteca | 50 imágenes · voz cargada · identidad visual cerrada |

**Nada la publica.** No hay una sola pieza en la cola de Postiz, y su ruteo en n8n está
*deliberadamente mudo* hasta que tenga contenido. El plan dice 3 reels/semana y **no hay un solo
reel producido**.

Su plan editorial ya está escrito y es bueno: 4 pilares 30/30/30/10, cadencia 3×/semana,
70% reel / 30% carrusel.

---

# 3 · La contradicción de dirección de arte, resuelta

Dos documentos vigentes decían cosas opuestas. **Manda `LUCIA.md`** por ser posterior y
declararse supremo:

| Tema | La "biblia estética" (11-ago) | `LUCIA.md` (15-ago) — **manda** |
|---|---|---|
| Grano | *"la tanda anterior fue en la dirección equivocada… pulido y cálido, impecables, no crudas"* | pide **grano, exposición despareja, aberración cromática, foco blando** y lo llama lo que más mueve la aguja |
| Negaciones | *"Cero negaciones. Escribir 'sin logos' produce logos"* | usa negaciones y aclara que **funcionan** por la vía `nano_banana_2` + Element; fallan solo con `text2image_soul_v2` |
| Vestuario | 3 atuendos A/B/C | los 3 fijados con Element ID |

**La biblia estética sigue sirviendo** para props ancla, reglas de luz, composición, el benchmark
de las influencers virtuales famosas y las 12 escenas. **Su §7 y §8 quedaron viejos.**

---

# 4 · El hueco principal: no existe masterplan de marca personal de Sergio

Para **Arthur** existe `ARTHUR_MARCA_PERSONAL_MASTERPLAN_20260730.md` — **2.028 líneas, 20
secciones**, con fuentes citadas y separación explícita entre dato, observación y juicio.

Para **Sergio** hay cuatro documentos sueltos, **todos de junio y uno en inglés**:
`PERSONAL_BRAND_SERGIO.md` (100 líneas), el kit de producción, la guía de cara y voz, y el
calendario. Producción de activos, no estrategia.

**Y hay un detalle que importa:** el doc de Arthur **define el rol de Sergio** —
*constructor/operador, pantalla y dashboards, público técnico, CTA "mirá cómo lo armamos",
produce talento y credibilidad*. **El doc de Sergio no lo sabe**: se escribió ocho semanas antes
y nunca se actualizó.

## Lo que le falta a Sergio, contra el molde de Arthur

| § | Sección | Sergio |
|---|---|---|
| 6.2 | frase de posicionamiento | ❌ |
| 6.3 | meta geográfica por fase | ❌ |
| 7.2 | **pilares con porcentajes** | ❌ (solo tiene formatos) |
| 7.5 | lista negra | ❌ |
| 7.7 | orden de escalado de canales | ❌ |
| 8 | series con nombre y prioridad | ❌ (Arthur tiene 26) |
| 9 | plantillas de reel segundo a segundo | ❌ |
| 10 | banco de hooks para SU ángulo | ❌ (tiene 6 familias genéricas) |
| 12.1 | frecuencia numérica por formato | ❌ |
| 14 | embudo y CTAs por temperatura | ❌ |
| 14.4 | guion de DM | ❌ |
| 15 | roadmap de 12 meses | ❌ |
| 16 | **tablero de 7 KPIs con metas** | ❌ |
| 19 | sistema semanal con horas | ❌ |
| 20 | anexos de plantillas | ❌ |

Lo único que Sergio sí tiene: la mezcla de formatos (70/20/10) y la lista de temas.

---

# 5 · Qué sigue, separando ENCENDER de CONSTRUIR

## Encender (existe, no está andando)

1. **Bajar las 12 piezas de Higgsfield.** Plata ya gastada en riesgo. Sin decisión.
2. **Publicar las 6 piezas de Lucía que están en disco.** La cuenta está conectada a Postiz.
   Bloqueo real: falta que Sergio fije **el % del pilar informativo genérico** — sin ese número
   no se produce en volumen, y si crece de más deja de ser influencer y pasa a ser un medio que
   no deriva a nada.
3. **Fusionar la biblia estética dentro de `LUCIA.md`** y marcar superados su §7 y §8. Es una
   pasada de edición.

## Construir (no existe)

4. **`SERGIO_MARCA_PERSONAL_MASTERPLAN`**, con el mismo índice de 20 secciones que el de Arthur.
   **Acá encaja la propuesta que te hicieron** — ver abajo.

---

# 6 · Dónde encaja la propuesta cuando llegue

No la tengo, así que no invento qué dice. Lo que sí puedo dejar listo es **dónde entra cada cosa
según qué traiga**:

| Si la propuesta trae… | Va a la sección | Y hay que cruzarla con |
|---|---|---|
| posicionamiento / promesa | §6.2 | el rol que el doc de Arthur ya le asignó a Sergio |
| pilares o mezcla de contenido | §7.2 | la mezcla 70/20/10 de junio, que puede estar vieja |
| formatos y frecuencia | §12.1 | la capacidad real de producción del carril |
| canales | §7.7 | la regla de Arthur: no abrir uno nuevo hasta que el anterior tenga ritmo |
| métricas | §16 | los 7 KPIs de Arthur, para no inventar otro tablero |
| precio de un servicio | — | `PRICING_RATIONALE_INTERNO.md`; el precio lo decide Sergio |
| promesas de resultado | — | **no se copian.** No afirmamos cifras que no tengamos |

**Tres cosas que hay que mirar de la propuesta antes de adoptarla**, y salen del filtro que ya
usamos con los reels:

1. **¿Trae cifras sin fuente?** Si promete alcance o resultados, esos números son de ellos, no
   nuestros. No se repiten.
2. **¿Pide cambiar algo que ya está fijado?** La identidad de Lucía, su ancla, su paleta y su voz
   están cerradas. Si la propuesta las contradice, gana lo nuestro salvo que haya un motivo mejor.
3. **¿Quién firma?** Sergio es menor de edad; todo acto legal va por Leslie Mercado Moreno.

---

# 7 · Lo que hace falta de Sergio para avanzar

| # | Decisión | Bloquea |
|---|---|---|
| 1 | **La propuesta** — PDF, link, capturas o texto | todo el §4 |
| 2 | **% del pilar informativo genérico de Lucía** | que Lucía produzca en volumen |
| 3 | **¿Sergio tiene cuenta propia o comparte con @oniahq?** | la estructura entera de la capa 3 |
| 4 | OK de gasto por pieza de video | cada reel de Lucía |

**Fuentes de este mapa:** `hermes-content/references/modelos/lucia/LUCIA.md` (manda) ·
`hermes-content/contenido/LUCIA.md` (qué se publica y cuándo) ·
`hermes-content/docs/ARTHUR_MARCA_PERSONAL_MASTERPLAN_20260730.md` (el molde) ·
`hermes-content/docs/ONIA_AUDITORIA_MARKETING_LUCIA_20260812.md` ·
`hermes-content/docs/ONIA_LUCIA_DIRECCION_ESTETICA_20260811.md` (vigente parcial).
