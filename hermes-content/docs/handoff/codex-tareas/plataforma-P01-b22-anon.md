---
id: plataforma-P01
carril: plataforma
estado: hecha (onia-platform #150, `codex/p01-b22-anon` 52d77b0d). Hermes E9: HIGH (symlink: sale con 0 sin medir) → se arregla en P-01b sobre la misma rama; no se mergea antes
modelo: gpt-6.1-sol
repo: onia-platform
rama: codex/p01-b22-anon
base: master
pr: oninteligenciaartificial/onia-platform#150
escrita: 2026-10-11 por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C)
actualizada: 2026-10-11 por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C)
nota:
---
# P-01 · Prueba de que la clave pública ya no lee las tablas del B22

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-platform` que creó la madre, en la rama
`codex/p01-b22-anon`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en
  el resumen final.
- Sin push, sin npm install, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.

## META
La migración del B22 (`prisma/migrations/20261003230000_revoke_anon_onia_sends/migration.sql`) le saca a la clave
pública (`anon`) los permisos sobre `public.onia_renewal_reminder_sends` y `public.onia_whatsapp_sends`. Medido el
9-oct: en producción todavía **no está aplicada**. Se aplica solo con el sí de Sergio Urcullo; esta tarea deja lista la
prueba que dice, desde afuera y con la clave pública, si quedó cerrada. La consulta pasa por la API REST de Supabase
(PostgREST): mide el permiso de lectura, que es el que se ve desde internet (TRUNCATE no se alcanza por esa API).

Un script `scripts/verificacion/b22-anon.mjs` que, para cada una de las dos tablas, hace
`GET <URL>/rest/v1/<tabla>?select=*&limit=1` con los encabezados `apikey` y `Authorization: Bearer` de la clave pública
y da un veredicto por tabla:

| Respuesta | Veredicto |
|---|---|
| 401 o 403 | `PASA` (la clave pública no tiene permiso) |
| 200 con al menos una fila | `FALLA` (la clave pública lee datos) |
| 200 con `[]` | `SIN APLICAR` (tiene permiso; la RLS no devuelve filas: el B22 no corrió) |
| otro código, JSON roto, error de red o más de 15 s | `NO MEDIDO` |

Código de salida: `1` si alguna tabla da `FALLA`; si no, `2` si alguna da `SIN APLICAR`; si no, `3` si alguna da
`NO MEDIDO`; `0` solo si las dos dan `PASA`.

## PRUEBA DE HECHO
1. `node --test scripts/verificacion/` en verde, con el test `scripts/verificacion/b22-anon.test.mjs` (`node:test` y
   `node:assert`, sin dependencias nuevas) y un `fetch` falso inyectado (nada sale a la red). Casos:
   1. 401 → `PASA`; 2. 403 → `PASA`; 3. 200 con una fila → `FALLA`; 4. 200 con `[]` → `SIN APLICAR`;
   5. 500 → `NO MEDIDO`; 6. el `fetch` lanza → `NO MEDIDO`; 7. cuerpo que no es JSON → `NO MEDIDO`;
   8. el código de salida con mezclas (`FALLA` + `PASA` = 1, `SIN APLICAR` + `PASA` = 2, `NO MEDIDO` + `PASA` = 3,
      `PASA` + `PASA` = 0);
   9. sin `NEXT_PUBLIC_SUPABASE_URL` o sin `NEXT_PUBLIC_SUPABASE_ANON_KEY`: sale con un mensaje que nombra la variable
      que falta y código 3, sin hacer ninguna consulta;
   10. con la clave falsa `clave-falsa-de-prueba-123`, ni la salida estándar ni la de error la contienen: el informe
       nombra la tabla, el código HTTP, el veredicto y el host de la URL, nunca la clave.
2. El script exporta la lógica pura (`veredicto(status, cuerpo)` y `revisar({ url, clave, fetch })`) y solo corre la
   consulta real cuando se lo invoca como programa (`import.meta.url` contra `process.argv[1]`), para que el test no
   toque la red.
3. `npx tsc --noEmit` 0 y `npx vitest run` completo en verde (vitest de este repo toma solo `*.test.ts`: el test nuevo
   corre con `node --test`; anotalo en el resumen para sumarlo al CI después).

## REGLA DE PARADA
- **Si la clave pública (o cualquier clave real) aparece en un archivo versionado, pará** y anotalo sin copiarla. El
  test usa solo claves falsas; la clave real se lee del entorno al correr, nunca de un `.env*` del repo.
- No corras el script contra producción ni contra ninguna URL real: esta tarea no tiene red.
- No toques la migración del B22, ni `prisma/**`, ni otra migración. No apliques nada.
- Nada de `console.log` del objeto de encabezados, de la URL con parámetros de autenticación ni de la respuesta entera:
  solo el informe por tabla.
- Si después de dos intentos `tsc` o la suite siguen en rojo por algo fuera de ARCHIVOS, pará y anotalo en el resumen.

## ARCHIVOS
- `scripts/verificacion/b22-anon.mjs` (nuevo).
- `scripts/verificacion/b22-anon.test.mjs` (nuevo).
- Una sección corta en `docs/RUNBOOK.md`: cómo se corre después de aplicar el B22
  (`NEXT_PUBLIC_SUPABASE_URL=… NEXT_PUBLIC_SUPABASE_ANON_KEY=… node scripts/verificacion/b22-anon.mjs`) y qué significa
  cada veredicto. La clave se pone en el entorno de quien corre, no en el documento.

## Resumen final (para la madre)
Archivos, la salida de `node --test scripts/verificacion/`, números de `tsc` y vitest, y que el test nuevo no está en
el CI. El B22 se aplica solo con el sí de Sergio Urcullo en la sesión de Plataforma; después, Plataforma corre esta
prueba contra producción y la anota en `cola/loop/plataforma.md`.
