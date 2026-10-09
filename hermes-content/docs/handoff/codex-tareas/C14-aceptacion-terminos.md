# C14 · Guardar la aceptación de los términos en cada alta (punto 14 de la 1.0 de Onia)

Lanzada por la madre Claude el 8-oct en Codex en la nube (entorno «ONIA Platform — QA y desarrollo», rama base `master`).
Modelo pedido: `gpt-6-astra`. El modelo que corrió de verdad se verifica en la metadata de la tarea.

Sos Codex, ejecutor de la madre Claude. Trabajás SOLO en el repo `onia-platform`. Nadie te va a contestar preguntas
mientras corrés: decidí con este texto y con el código, y lo que no puedas decidir, anotalo en el resumen final.

## META
Que cada alta nueva de una cuenta deje registrada la aceptación de los términos con:
- la versión de los términos;
- la fecha y hora;
- la cuenta (perfil y organización);
- la IP.
Lo pide la Ley 164 (arts. 86-87): sin firma digital, la aceptación en línea vale como indicio solo si queda registrada.

## PRUEBA DE HECHO
Tests verdes que prueban:
1. Un registro exitoso crea UNA fila de aceptación con la versión vigente, la fecha, los ids de perfil y organización, y
   la IP (el primer valor de `x-forwarded-for`, o `null` si no viene).
2. La versión sale de UNA constante (por ejemplo `TERMINOS_VERSION` en `lib/legal/`), que coincide con la fecha o versión
   que muestra hoy la página de términos.
3. Si el alta falla, no queda ninguna aceptación guardada (todo en la misma transacción o en el mismo camino de error).
4. Si existe alta con Google, también guarda su aceptación. Si no existe, decilo en el resumen.
Migración de Prisma ADITIVA (tabla o columnas nuevas, nada que borre o renombre). NO se aplica: la aplica Plataforma con
backup.
Todo en UN commit.

## REGLA DE PARADA
- **No cambies ningún texto legal** (términos, privacidad) ni la página de términos: eso pasa por Sergio Urcullo.
- Si el registro NO muestra hoy ninguna leyenda o casilla del tipo «acepto los términos», no inventes una pantalla nueva:
  PARÁ y reportalo. Agregar la leyenda es diseño y legal, y lo decide él.
- No toques cobros, planes, `lib/pricing.ts` ni `lib/subscription-plans.ts`.
- Nada de `npm install`, dependencias nuevas, `prisma migrate deploy` ni `db push`.
- Textos nuevos que lea un cliente: de USTED.

## Contexto mínimo
- Onia Platform: Next.js 16 (App Router), React 19, Prisma 7 sobre Postgres (Supabase self-hosted), vitest. Es
  multi-tenant: todo se filtra por `organizationId`.
- El alta vive en `app/register` y en su ruta de API (buscala con `rg -n "register" app/api lib`). Antes de tocar
  nada, leé `.claude/skills/onia-backend/SKILL.md` y `.claude/skills/onia-db/SKILL.md`.
- `master` es producción: no empujás nada; la madre revisa el diff.

## Cierre
1. Corré los tests de lo que tocaste: tienen que estar verdes. Si falla algo que no tocaste, verificá que también
   falla sin tus cambios y anotalo.
2. Hacé un solo commit: `feat(legal): guardar la aceptación de los términos en cada alta — punto 14 de la 1.0`, con 2 a
   4 líneas que expliquen el porqué.
3. Resumen final:
   - qué hiciste y en qué archivos;
   - la migración;
   - los tests que corriste y su resultado;
   - si había leyenda de aceptación o no;
   - qué quedó afuera.
