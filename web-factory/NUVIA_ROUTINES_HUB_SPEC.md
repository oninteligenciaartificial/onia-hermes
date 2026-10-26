# Nuvia — Spec del Hub de Rutinas y Consejos

Última actualización: 2026-07-03
Estado: definición (aún sin implementar). No fabricar contenido: la redacción real
de rutinas/consejos la provee Nuvia o se marca como borrador.

## Objetivo

Un hub editorial de skincare que cumple tres funciones a la vez:

1. **Ayuda a comprar por necesidad** (piel grasa, manchas, antiedad, sensible,
   hidratación) en vez de recorrer 315 productos sueltos.
2. **Alimenta SEO** con contenido real y honesto.
3. **Es la única fuente de verdad que también usa el chatbot.** El bot recomienda
   leyendo el mismo bloque de `nuvia.json`. Web y bot dicen exactamente lo mismo;
   no se contradicen ni se duplican.

Este es el punto clave: **una sola fuente, dos consumidores** (web + bot).

## Fundamento de diseño

`WEB_FACTORY_PATTERN_BANK_2026.md` clasifica a Nuvia como **ecommerce-beauty**:
design read = *product-first + editorial + clean media* (densidad 5, motion 5). En la
receta de ecommerce del banco, **"routine guide" es la sección 2 recomendada** — o
sea, el hub no es un extra, es parte del patrón esperado para esta vertical.

Nuvia **ya tiene base** sobre la que expandir:

- `apps/site/src/components/nuvia/nuvia-store.tsx` → `ROUTINE_STEPS` (4 pasos:
  limpiar → tratar → hidratar → proteger) renderizados en `nuvia-routine-section`.
- `NuviaUseCases` (casos de uso desde `merchandising.casosUso`).
- `PackShowcase` (packs/combos desde `merchandising.packs`).
- Cada producto ya trae `ingredientesClave`, `idealPara`, `beneficios`, `uso`,
  `ordenRutina`, `categoria`.

El hub reusa todo eso y agrega una capa editorial estructurada.

## Modelo de datos (en `data/clients/nuvia.json`)

Nuevo bloque `contenido`, hermano de `merchandising`. Cada `productSlugs[]` debe
apuntar a productos que existan en el catálogo (validar contra `productos[].titulo`
via `slugify`). Recordar: **Zod descarta campos no declarados** — agregar el schema en
`data/schema.ts` (ver `NUVIA_PAYMENT_SYSTEM.md` y la nota del gotcha de Zod).

```jsonc
"contenido": {
  "version": "nuvia-content-v1",
  "generatedAt": "2026-07-03",

  // Rutinas por necesidad de piel. La landing muestra la de 4 pasos genérica;
  // el hub /rutinas muestra estas, específicas por necesidad.
  "rutinas": [
    {
      "id": "rutina-piel-grasa",
      "necesidad": "Piel grasa y acné",      // debe matchear una categoria real
      "titulo": "Rutina para piel grasa y con tendencia acnéica",
      "resumen": "Controla brillo y brotes sin resecar la barrera.",
      "momento": "mañana y noche",           // texto libre
      "pasos": [
        {
          "orden": 1,
          "accion": "limpiar",               // limpiar|tratar|hidratar|proteger
          "titulo": "Limpieza matificante",
          "nota": "Retira grasa y suciedad sin resecar.",
          "productSlugs": ["svr-sebiaclear-gel-moussant"]
        }
        // ... resto de pasos
      ],
      "advertencia": ""                        // opcional, ver reglas
    }
  ],

  // Consejos / guías editoriales cortas.
  "consejos": [
    {
      "id": "consejo-orden-aplicacion",
      "tipo": "aplicacion",                    // aplicacion|ingredientes|mito|cuidado
      "titulo": "En qué orden se aplican los productos",
      "cuerpo": "De más líquido a más denso: ...",
      "productSlugs": [],                       // relacionados, opcional
      "disclaimer": ""                          // opcional
    }
  ],

  // Guías de ingrediente (opcional, se apoya en ingredientesClave de cada producto).
  "ingredientes": [
    {
      "id": "ingrediente-niacinamida",
      "nombre": "Niacinamida",
      "queHace": "Regula sebo y mejora textura y tono.",
      "paraQuien": "Piel grasa, poros visibles, manchas leves.",
      "productSlugs": []
    }
  ]
}
```

### Cambios en `data/schema.ts`

Declarar `contenidoSchema` (rutinas, consejos, ingredientes) y agregarlo a
`clientSchema` como opcional, igual que `merchandising`. Si no se declara, Zod lo
tira en silencio y el hub queda vacío sin error visible.

## Reglas de contenido (del pattern bank + CLAUDE.md)

1. **No fabricar.** Si falta la redacción real, marcar el ítem como borrador o
   pedirlo — nunca inventar rutinas, porcentajes ni claims. (Regla CLAUDE.md.)
2. **Nada de before/after médicos ni promesas dermatológicas.** El pattern bank lo
   prohíbe explícito para health/beauty.
3. **Disclaimer médico visible.** "La dermocosmética no reemplaza una consulta
   dermatológica" — ya está en el FAQ; repetir en el hub donde aplique.
4. **Enlazar siempre a productos reales.** Cada `productSlugs` debe resolver a un
   producto del catálogo. Rutina sin producto real = no se publica.
5. **Editorial, no plantilla.** Jerarquía por necesidad, no grilla uniforme de cards
   (regla `~/.claude/rules/web/design-quality.md`). Usar los tokens existentes.

## Dónde se renderiza (web)

| Superficie | Qué muestra | Archivo |
| --- | --- | --- |
| Landing | Expandir `nuvia-routine-section` + teaser del hub (2-3 rutinas destacadas con link a "ver todas") | `nuvia-store.tsx` (`NuviaStorefront`) |
| Ruta dedicada `/nuvia/rutinas` | Hub completo: rutinas por necesidad + consejos + guías de ingrediente | nueva `apps/site/src/app/nuvia/rutinas/page.tsx` + componente |
| PDP | Bloque "forma parte de esta rutina" que enlaza el producto a su(s) rutina(s) | `NuviaProductPage` en `nuvia-store.tsx` |
| Template estático (`store.ts`) | Versión reducida del hub para clientes generados sin Next.js (opcional, fase 2) | `packages/templates/src/store.ts` |

Nota: la app Next.js (`apps/site`) es la que ve Nuvia hoy. El template `store.ts` es
para futuros clientes del web-factory; portar el hub ahí es fase 2.

## Conexión con el chatbot (crítico)

El bot **lee el mismo bloque `contenido`** de `nuvia.json`. Ejemplos:

- Cliente: "¿qué uso para las manchas?" → el bot devuelve `rutinas[necesidad=Manchas]`
  con sus pasos y `productSlugs`, y ofrece agregarlos al carrito. Idéntico a la web.
- Cliente: "¿en qué orden me pongo las cosas?" → responde con
  `consejos[tipo=aplicacion]`.

Ventaja: cuando Nuvia edite una rutina, se actualizan **web y bot a la vez**. No hay
guión del bot separado que se desincronice del catálogo. Ver
`WEB_FACTORY_CHATBOT_MULTITENANT_ARCHITECTURE.md`.

## Pendientes (dato humano, no código)

- Redacción real de rutinas y consejos (Nuvia o experto). Sin esto, el hub arranca
  con borradores marcados, no con contenido inventado.
- Validar comercialmente qué productos entran en cada rutina (evitar recomendar
  profesional/mesoterapia al público — misma regla que el price watcher, ver
  `hermes-content/docs/historial/web-factory/NUVIA_PRICE_AUTOMATION.md`).

## Plan de implementación (cuando se apruebe)

1. Definir `contenidoSchema` en `data/schema.ts` + tipos en `nuvia-data.ts`.
2. Cargar borradores de 5 rutinas (una por necesidad principal) en `nuvia.json`.
3. Componente de hub + ruta `/nuvia/rutinas` (reusa estilos de `globals.css`).
4. Teaser en landing + bloque "rutina" en PDP.
5. Exponer el bloque `contenido` al lector del chatbot (misma fuente).
6. Tests (generación) + QA de navegador (a11y, reduced-motion, responsive).
