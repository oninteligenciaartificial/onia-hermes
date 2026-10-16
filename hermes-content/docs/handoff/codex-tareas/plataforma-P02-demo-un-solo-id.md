---
id: plataforma-P02
carril: plataforma
estado: hecha (onia-platform #151, `codex/p02-demo-un-solo-id` 05dd4ecc). Hermes E9: OK con notas LOW; se mergea después de #152
modelo: gpt-6.1-sol
repo: onia-platform
rama: codex/p02-demo-un-solo-id
base: master
pr: oninteligenciaartificial/onia-platform#151
escrita: 2026-10-11 por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C)
actualizada: 2026-10-11 por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C)
nota:
---
# P-02 · La demo se refresca sobre una sola org: el id sale del correo, y si no hay exactamente una, no sigue

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-platform` que creó la madre, en la rama
`codex/p02-demo-un-solo-id`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en
  el resumen final.
- Sin push, sin npm install, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.

## META
El refresco de la demo de venta (`scripts/demo-venta/seed-demo.sql`, con `reset=2`) escribe en la base de producción,
solo en la org demo «Clínica Demo Onia». El paso 1 busca su id; el 11-oct se buscaba por un slug que ya no existía y
daba 0 filas. La regla buena es la de la guarda del seed: **por el correo de la demo**
(`oninteligenciaartificial+demo@gmail.com`), y **solo si sale exactamente una org**. Esta tarea la convierte en un
script, así el id nunca se copia a mano:

`scripts/demo-venta/resolver-org.sh`:
- arma la consulta `SELECT id, name, slug FROM public.organizations WHERE lower(email) = lower(:'correo')` y se la pasa
  a psql **por la entrada estándar**, con `-X -A -t -v ON_ERROR_STOP=1 -v correo=<correo>` (psql no interpola variables
  en `-c`; `:'correo'` las cita bien y evita inyección);
- el comando de psql sale de la variable `ONIA_PSQL` (por defecto `psql`). En producción se corre con
  `ONIA_PSQL="ssh onia-vps docker exec -i supabase-db psql -U postgres -d postgres"`; en el test, con un psql falso;
- el correo es el de la demo; se puede cambiar con `ONIA_DEMO_CORREO`, validado contra `^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$`;
- con **exactamente una** fila y un id con forma de cuid (`^c[a-z0-9]{24}$`): imprime SOLO el id en la salida estándar y
  sale con 0; el nombre y el slug van a la salida de error, para que quien lo corre vea qué org es;
- con 0 filas: sale con 1 y dice «no hay ninguna org con el correo de la demo»; con 2 o más: sale con 1 y dice cuántas
  hay, sin elegir ninguna; si psql falla: sale con 2 y lo dice; si el id no tiene forma de cuid: sale con 1.

## PRUEBA DE HECHO
1. `bash scripts/demo-venta/resolver-org.test.sh` en verde. El test arma en un directorio temporal un `psql` falso
   (un script de bash) y lo pasa por `ONIA_PSQL`. El falso guarda sus argumentos y su entrada estándar en archivos y
   devuelve las filas que le dice una variable del test. Casos:
   1. 1 fila (`cmur09d75000601mz12vg59qn|Clínica Demo Onia|clinica-demo-onia-2eet4`) → salida estándar exactamente
      `cmur09d75000601mz12vg59qn`, código 0;
   2. 0 filas → código 1, salida estándar vacía;
   3. 2 filas → código 1, salida estándar vacía, y el mensaje dice «2»;
   4. el falso sale con error → código 2;
   5. un id sin forma de cuid → código 1;
   6. la consulta llegó por la entrada estándar con `:'correo'`, los argumentos traen `-v correo=oninteligenciaartificial+demo@gmail.com`
      y `ON_ERROR_STOP=1`, y el correo no aparece pegado dentro del texto de la consulta;
   7. `ONIA_DEMO_CORREO="x' OR '1'='1"` → código 1 por correo inválido, sin llamar al psql falso.
   El test sale con 0 solo si pasan todos e imprime una línea por caso.
2. `shellcheck` sobre los dos `.sh` si está instalado (si no está, anotalo: no lo instales).
3. `npx vitest run` completo en verde (no debería cambiar nada: es un script de shell).

## REGLA DE PARADA
- **No te conectes a ninguna base real**: ni `psql` de verdad, ni `ssh`, ni `docker`. Todo el test va contra el falso.
- **No toques `scripts/demo-venta/seed-demo.sql` ni `verify-demo.sql`**.
- No escribas datos en ningún lado fuera del directorio temporal del test, y borralo al terminar (`trap`).
- Si después de dos intentos la suite sigue en rojo por algo fuera de ARCHIVOS, pará y anotalo en el resumen.

## ARCHIVOS
- `scripts/demo-venta/resolver-org.sh` (nuevo, con `#!/usr/bin/env bash` y `set -euo pipefail`, en LF).
- `scripts/demo-venta/resolver-org.test.sh` (nuevo, en LF).
- Si el repo no fija `*.sh text eol=lf` en `.gitattributes`, anotalo en el resumen (no lo cambies): un `.sh` en CRLF no
  arranca en el VPS.

## Resumen final (para la madre)
Archivos, la salida de `bash scripts/demo-venta/resolver-org.test.sh`, shellcheck si corrió y el número de vitest.
Plataforma lo integra y cambia el paso 1 de `hermes-content/docs/cola/demo-venta-refresco.md` (en onia-hermes) para
usarlo. El refresco de la demo sigue pidiendo el sí de Sergio Urcullo en la sesión de Plataforma.
