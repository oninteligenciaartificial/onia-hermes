# Skills del carril — cuál cargar y cuándo

> ⚠️ **Historia desde el 27-oct-2026.** Muchas skills de abajo ya no existen: se sacaron el 29-sep y el 27-oct,
> por no usarse. Para aprender de una referencia manda `aprender-de-todo`, que lleva cada dimensión a su skill. Para
> hacer el trabajo mandan `onia-router` y `.claude/skills/onia-router/STACK-POR-DOMINIO.md`. Se conserva por los
> errores de la tabla del final, que siguen valiendo.

Hay **196 skills globales** instaladas + 33 propias del repo. En ~70 videos analizados usé dos.
Eso es el problema que este documento arregla: no falta capacidad, falta ruteo.

**Regla:** antes de escribir la ficha de un video, mirar la tabla del tema y **cargar la skill
que corresponde**. No opinar sobre UI sin `ui-ux-pro-max`, ni sobre seguridad sin
`security-review`, ni sobre pauta sin `ads`.

---

## Base — se cargan siempre en este carril

| Skill | Para qué, acá |
|---|---|
| **`ver-videos`** (propia) | bajar, ver y transcribir. Es el motor del carril |
| **`onia-router`** (propia) | ubicar a qué carril pertenece lo que salga del video |
| **`verification-loop`** | el Gate 3: auto-evaluación antes de entregar. **La que más falta me hizo** |
| `caveman-review` | fichas comprimidas sin perder sustancia |

---

## Por tema del video

### El video muestra una INTERFAZ (web, app, componente)

| Skill | Cuándo |
|---|---|
| **`ui-ux-pro-max`** | juicio de UI/UX. Antes de decir si un patrón es bueno |
| **`impeccable`** | el listón de calidad. Exige ≥4 Required Qualities |
| **`taste-design`** · `emil-design-eng` | criterio estético, micro-detalle, por qué algo "se siente" bien |
| **`design-review`** | revisar una interfaz con checklist, no con opinión |
| **`image-to-code`** | reconstruir un componente desde los fotogramas — **esto es exactamente lo que hicimos a mano** |
| `frontend-patterns` · `react-components` · `shadcn-ui` · `ui-styling` | al portar el patrón al producto |
| `web-design-guidelines` · `minimalist-ui` · `industrial-brutalist-ui` | direcciones visuales concretas |
| `design-md` · `stitch-extract-design-md` | extraer el sistema de diseño de una web que aparece en el video |

### El video habla de SEGURIDAD o backend

| Skill | Cuándo |
|---|---|
| **`security-review`** | cualquier video sobre vulnerabilidades. El de los 10 errores debió pasar por acá |
| `backend-patterns` · `api-design` | arquitectura mencionada en el video |
| `postgres-patterns` · `supabase` · `supabase-postgres-best-practices` | si toca base de datos o RLS |
| `database-migrations` · `schema` | si propone cambios de modelo |
| `deployment-patterns` · `docker-patterns` | si es de infra |
| `e2e-testing` · `qa` | si el video habla de pruebas |

### El video es de MARKETING, contenido o venta

| Skill | Cuándo |
|---|---|
| **`marketing-psychology`** | por qué un gancho funciona. El molde de la pastelera pasa por acá |
| **`copywriting`** · `copy-editing` | los moldes de copy (los "4 dolores + 1 agente") |
| **`ads`** | pauta, formatos de anuncio, la biblioteca de anuncios |
| `content-strategy` · `social` | plan de contenido y formatos por red |
| `offers` · `pricing` | si el video toca oferta o precio |
| `marketing-loops` · `marketing-ideas` | mecánicas de crecimiento — el CTA comentario→DM cae acá |
| `cold-email` · `prospecting` · `lead-magnets` | prospección y captación |
| `competitor-profiling` · `competitors` | espiar la pauta o el posicionamiento de otro |
| `brand` · `brandkit` | identidad, y si algo choca con la nuestra |

### El video está HECHO con IA (carril A del método)

| Skill | Cuándo |
|---|---|
| **`ver-videos`** | ingeniería inversa: qué se ve, qué se dice, qué rótulos hay |
| **`editor-videos`** (propia) | qué se hizo FUERA del generador: cortes, subtítulos, SFX |
| **`hyperframes`** + sus hermanas (propias) | si el efecto se puede hacer con HTML→MP4 en vez de generar |
| **`motion-doctrine`** · `cut-the-curve` · `seam-craft` (propias) | juzgar el movimiento y la continuidad entre planos |
| `video` · `remotion-video-creation` | producción programática |
| `image` · `imagegen-frontend-web` | si el insumo es imagen generada |
| Higgsfield MCP (`models_explore`, `balance`, `presets_show`) | **verificar la cuenta antes de creerle al video** |

### El video afirma algo que hay que VERIFICAR

| Skill | Cuándo |
|---|---|
| **`deep-research`** | comprobar una afirmación con fuentes citadas |
| `exa-search` · `documentation-lookup` | doc oficial de una herramienta que el video nombra |
| **`onia-contabilidad-bolivia`** (propia) | **cualquier** cosa fiscal o legal boliviana. El video del chatbot citaba una ley chilena |
| `investigate` | si algo no cuadra y hay que encontrar la causa raíz |

### Lo que salga del video se convierte en trabajo

| Skill | Cuándo |
|---|---|
| **`onia-web-factory`** (propia) | si toca web de cliente o el panel |
| **`onia-propuestas`** (propia) | si toca propuestas o pricing |
| **`onia-core`** (propia) | si toca el núcleo del producto |
| `make-plan` · `writing-plans` | si el hallazgo necesita plan antes que código |
| `dispatching-parallel-agents` | varias fichas a la vez |

---

## Lo que este documento corrige

Errores concretos de la sesión que una skill habría evitado:

| Lo que pasó | La skill que faltó |
|---|---|
| Juzgué patrones de UI a ojo, y descarté uno bueno por "no muestra el código" | `ui-ux-pro-max` + `impeccable` |
| Reconstruí 6 componentes a mano desde fotogramas | `image-to-code` hace exactamente eso |
| Analicé el video de los 10 errores de seguridad sin checklist | `security-review` |
| Escribí sobre el CTA comentario→DM sin marco | `marketing-loops` · `marketing-psychology` |
| Entregué cinco veces sin auto-verificar | **`verification-loop`** |
| Casi repito una ley chilena como si aplicara en Bolivia | `onia-contabilidad-bolivia` |

## Cómo se usa, en una línea

```
Antes de escribir la ficha: identificá el tema → cargá la skill de la tabla → recién ahí opiná.
```

Y si no hay skill para el tema: **`find-skills`** busca entre las instaladas, y `skill-stocktake`
audita si alguna quedó vieja. No inventar criterio propio cuando hay una skill que ya lo tiene.
