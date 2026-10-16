---
id: plataforma-U5
carril: plataforma
estado: pendiente
modelo: gpt-6.1-sol
repo: onia-platform
rama: codex/usted-configurar-negocio
base: master
pr:
escrita: 2026-10-11 por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C)
actualizada: 2026-10-11 por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C)
nota:
---
# U5 · Configurar el negocio de usted: el alta guiada, la guía de inicio y el recorrido

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-platform` que creó la madre, en la rama
`codex/usted-configurar-negocio`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en
  el resumen final.
- Sin push, sin npm install, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.

## META
Orden de Sergio Urcullo (3-oct): **los textos al cliente van de usted**. El corte de la 1.0 pide de usted **venta,
alta y cobro**. Después de crear la cuenta, el dueño pasa por el alta guiada (`/onboarding`) y después la guía de inicio
y el recorrido le dicen qué hacer. Medido el 11-oct sobre `master` `a7d8c1ed`: **~70 formas de vos** en esos archivos
(trinquete) más el tuteo que el trinquete no cuenta. Ejemplos leídos en el código: «Cargá tus productos», «Sin catálogo
no podés vender», «Tu catálogo ya está cargado: la caja te espera», «Conectá tu WhatsApp», «Revisá tus horarios»,
«Agendá tu primera cita» (`lib/onboarding/aplicar.ts`), «Dejá listo tu asistente… revisalo y ajustalo con tus
palabras», «Armá tu asistente de WhatsApp» (`lib/onboarding/tour-pasos.ts`). Esta tarea los pasa **enteros** a usted.

Leído en el código: la guía no se guarda en la base, se calcula en el servidor en cada render
(`lib/onboarding/guia-sembrada.ts`). Un cambio de texto vale para todas las cuentas, nuevas y viejas.

## PRUEBA DE HECHO
1. Test nuevo `__tests__/configurar-negocio-de-usted.test.ts`, con el molde de
   `__tests__/pantallas-del-video-de-usted.test.ts` y `__tests__/titulos-publicos-de-usted.test.ts` (si alguno todavía
   no está en `master`, copiá su idea, no lo importes):
   - lee con el AST de `typescript` los archivos de ARCHIVOS (sin `*.test.*`) y junta el texto de los literales
     (strings, templates y `JsxText`), sin comentarios y sin los atributos `className`, `id`, `key`, `href`, `name`,
     `type` ni `data-*`;
   - falla si encuentra tuteo (`(?<!\p{L})(tú|tu|tus|te|ti|contigo|puedes|tienes|quieres)(?!\p{L})`, flag `iu`) o
     voseo (`contarVoseo` de `__tests__/voseo-ratchet.ts` más de 0);
   - falla si una pantalla de la lista usa `vocabulario.negocio` («tu clínica») en vez de `negocioSu`: mirá el caso
     `usaElNegocioDeVos` de `pantallas-del-video-de-usted.test.ts`;
   - hacelo fallar a propósito una vez con el texto de hoy y anotá en el resumen que se puso rojo.
2. Los archivos de la lista quedan en 0 en `__tests__/voseo-ratchet.linea-base.json` (el trinquete exige bajar la línea
   cuando un archivo baja: `npx vitest run __tests__/voseo-ratchet.test.ts` dice cuáles).
3. Los textos del alta siguen nombrando el rubro de cada cuenta: corré los tests de `lib/onboarding/**` y de
   `app/onboarding/**` para los 5 rubros que se venden (dental, estética, comercio, importadora, servicios
   profesionales). Si ninguno lo cubre, sumá un caso por rubro al test nuevo.
4. `npx tsc --noEmit` 0, eslint de lo tocado 0 errores, `npx vitest run` completo en verde. Si un test viejo afirmaba un
   texto de tú o de vos, se actualiza el texto esperado; nunca se borra el test.

## REGLA DE PARADA
- **No toques:** `lib/onboarding/vocabulario.ts` (lo comparten todas las pantallas), `app/(auth)/**`, `app/api/auth/**`,
  `lib/auth/**` y `components/auth/**` (son de U4), `lib/email.ts` y `lib/subscription/**` (los cambia #113),
  `app/(dashboard)/**` y `lib/resultados/**` (son de U3 y de las pantallas del video), `prisma/**`, `app/layout.tsx`.
- No cambies lógica, pasos, orden, rutas, props, claves de JSON ni nombres de archivos: solo textos y sus tests. Lo que
  el extractor le pide al modelo (prompts de `extraccion/**`) no se toca si no se le muestra al dueño.
- Vocabulario por rubro: «pacientes», «productos», «clínica» salen de `vocabulario.ts`; en pantallas de usted se usa
  `negocioSu` («su clínica»), nunca `negocio` («tu clínica»). Nada de «tus pacientes» escrito a mano.
- Usted correcto y con tildes. Ejemplos: «Cargue sus productos», «Sin catálogo no puede vender», «Su catálogo ya está
  cargado: la caja lo espera», «Conecte su WhatsApp», «Revise sus horarios», «Agende su primera cita», «Deje listo su
  asistente», «Revíselo y ajústelo con sus palabras». Títulos cortos, sin perder lo que dicen hoy.
- La venta no exhibe obra: ningún texto nuevo dice «muy pronto», «beta» ni «próximamente».
- **La línea base del trinquete** la cambian también U3, U4, #113 y #124. Si choca, la línea correcta es la base más
  los deltas de cada rama, nunca uno de los dos lados.
- Si después de dos intentos `tsc` o la suite siguen en rojo por algo fuera de ARCHIVOS, pará y anotalo en el resumen.

## ARCHIVOS
- Alta guiada: todo `app/onboarding/**` (`alta-negocio.tsx`, `page.tsx`, `layout.tsx`, `ui.tsx`, `use-extraccion.ts` y
  `pasos/*`).
- Guía de inicio: `components/onboarding/**` (`GuiaInicio.tsx`, `SembrarGuia.tsx`).
- Lo que esas pantallas muestran y viene de otro módulo: `lib/onboarding/**` **salvo `vocabulario.ts`** (`aplicar.ts`,
  `tour-pasos.ts`, `tour-del-dueno.ts`, `tour-progreso.ts`, `guia-apertura.ts`, `guia-sembrada.ts`,
  `horarios-agenda.ts`, `extraccion/**`; `ejemplo-dental.ts` y `ajustar-semilla-dental.ts` solo si muestran un texto al
  dueño), `lib/onia-core/onboarding.ts`, `app/api/onboarding/**` y `app/api/onia-core/onboarding/route.ts`.
- Sus tests (`*.test.*` de esas carpetas), `__tests__/voseo-ratchet.linea-base.json` y el test nuevo.

## Resumen final (para la madre)
Archivos tocados, números de `tsc`/eslint/vitest, el test que se puso rojo a propósito, lo que quedó en la línea base y
los textos compartidos que no tocaste. Puede correr en paralelo con U4: no comparten archivos salvo la línea base. La
revisa, la integra con `master` y la publica Plataforma: son textos de producto y salen sin esperar a Sergio Urcullo.
