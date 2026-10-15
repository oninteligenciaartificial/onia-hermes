estado: pendiente
modelo: gpt-6.1-sol
carril: plataforma
origen: LOW nuevo de Hermes E34 (15-oct, segunda lectura de onia-platform #171): desde #165, #166 y #167 los agentes omiten los teléfonos inválidos sin dejar rastro. Escrita el 15-oct por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C); líneas medidas en `claude/optimistic-ride-1sp5fe` `37560f53`. Va después de que #171 entre a `master`.
decisión: lo omitido por teléfono se registra igual que lo descartado por tope: una acción `discarded` con su motivo. No se diseña pantalla nueva: el dueño ya ve las descartadas y la corrida ya las cuenta («descartadas N»).

# A1 · Un agente que no le escribe a alguien lo dice

Sos Codex. Carpeta `C:/dev/proyectos/onia-platform-codex-a1`. La madre la prepara desde `origin/master` con #171 adentro y te pasa el SHA
base. No hagas git: la madre revisa, corre `tsc` y la suite completa, commitea y abre el PR.

## META
`buildDraftsForKind` (`lib/onia-core/modules/agents-runtime.ts`) filtra con `numeroParaWhatsapp(...) !== null` antes de proponer: el
Seguidor (~:1774), el Confirmador (~:1804), el Recall (~:1835 y ~:1981) y el Cobrador (~:2021). Bien para no gastar mensajes, pero mudo:
un fiado con el teléfono mal cargado deja de cobrarse y nadie se entera. Para el Cobrador es plata. Lo descartado por tope o por
duplicado ya queda guardado como acción `discarded` con motivo (`applyActionTransition(base, "discarded", { reason })`, ~:1505-1514) y
el resumen de la corrida lo cuenta (~:2194).

## Qué hacer
1. Lo que hoy se filtra por teléfono pasa a ser una acción `discarded` con motivo «Sin teléfono válido: corríjalo en la ficha para que
   el agente pueda escribirle.» (de usted; en el rubro, con el vocabulario de `lib/onboarding/vocabulario.ts` si el texto nombra a la
   persona). No consume cupo ni el tope por corrida, igual que hoy.
2. **Sin ruido:** no se crea una nueva descartada por teléfono si ya hay una del mismo agente para la misma persona (`targetId`) en los
   últimos 7 días. Si el teléfono se corrige, el próximo día se propone normal.
3. Los cinco filtros usan una sola función común (hoy son cinco copias en línea).
4. El resumen de la corrida sigue diciendo «descartadas N»; no hace falta otro contador.

## PRUEBA DE HECHO
Primero en rojo con el código de `master`; anotá cuáles fallaron.
- Para cada uno de los cinco agentes: una persona con teléfono inválido o vacío deja UNA acción `discarded` con el motivo, no consume
  cupo, y las demás personas reciben su propuesta como hoy.
- Dos corridas seguidas (mismo día y al día siguiente) no duplican la descartada; con el teléfono corregido, la corrida siguiente propone.
- Multi-tenant: nada se cruza entre organizaciones (las pruebas de tenant de #165, #166 y #167 siguen verdes).
- `npx tsc --noEmit` 0, eslint de lo tocado 0 y `npx vitest run` completo en verde.

## REGLA DE PARADA
- **Sin migraciones:** `discarded` y `reason` ya existen.
- No cambia qué se le propone a quien sí tiene teléfono válido. Si una prueba de los agentes cambia de resultado para un teléfono válido,
  pará y anotalo.
- **Dos intentos:** si después de dos intentos algo sigue rojo por una causa fuera de esta lista, pará y anotalo.

## Entrega
Sección «PARA LA MADRE:» con los archivos, los números de tsc, eslint y vitest, las pruebas que se pusieron rojas con `master` y el texto
final del motivo.
