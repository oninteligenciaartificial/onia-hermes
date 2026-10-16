estado: en curso (Codex, lanzada por la madre el 11-oct ~07:30 UTC; sobre la rama de #150)
modelo: gpt-6.1-sol
carril: plataforma
origen: revisión E9 de Hermes sobre #150 = P-01 (onia-hermes `claude/adoring-ramanujan-7sjzwv` 687266e5, docs/cola/loop/hermes-jarvis.md §E9): un HIGH verificado y dos MEDIUM. Escrita el 11-oct por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C); líneas medidas en `codex/p01-b22-anon` `52d77b0d`.

# P-01b · La prueba anónima de B22 nunca da PASA sin haber medido

Sos Codex. Carpeta `C:/dev/proyectos/onia-platform-codex-p01`, la misma rama `codex/p01-b22-anon` de P-01 (#150). La madre
te pasa el SHA. No hagas git: la madre revisa, corre la suite completa, commitea y empuja a la rama del PR.

## META
`scripts/verificacion/b22-anon.mjs` decide si el REVOKE de B22 quedó aplicado. El RUNBOOK define el código 0 como «las dos
tablas PASA». Hoy hay tres maneras de llegar a PASA, o a 0, sin haber medido:
1. **HIGH: un enlace simbólico lo deja mudo.** La guarda del punto de entrada (`b22-anon.mjs:76`,
   `import.meta.url === pathToFileURL(process.argv[1]).href`) no coincide cuando el script se llama por un symlink. Entonces
   no corre nada, no imprime nada y sale con 0. Hermes lo reprodujo: `node enlace/b22.mjs` y `node enlace/dir/b22-anon.mjs`
   → silencio y exit 0.
2. **MEDIUM: una clave rota da PASA.** `veredicto` toma 401/403 como PASA (`:7`), pero una clave vencida, rotada o mal
   copiada también recibe 401.
3. **MEDIUM: no exige la clave anónima.** Con la `service_role` la tabla responde con filas. El script da FALLA y, peor,
   baja una fila real con `select=*` (`:42`).

## Qué hacer
1. **Separar la lógica del punto de entrada.**
   - `veredicto`, `codigoSalida`, `revisar` y `ejecutar` pasan a `scripts/verificacion/b22-anon-lib.mjs`.
   - `b22-anon.mjs` queda como punto de entrada SIN guarda: importa y hace `process.exitCode = await ejecutar()`.
   - Los tests importan de `-lib`.
2. **Control positivo con la misma clave, antes de las tablas:** `GET {url}/auth/v1/settings` con `apikey`.
   - Kong valida la clave en esa ruta: con una clave válida da 200; con una inválida, 401. Medido por Plataforma el 11-oct
     en el VPS: el `kong.yml` de producción pone `key-auth` y `acl` (admin, anon) en `auth-v1-all` (`/auth/v1/`, líneas
     102-128). Las rutas abiertas son otras: `verify`, `callback`, `authorize`, `jwks` y `sso`.
   - Si no da 200, las dos tablas quedan NO MEDIDO (exit 3) y no se pide ninguna tabla.
   - Se imprime «control: HTTP {status}», sin el cuerpo.
3. **Solo la clave anónima.**
   - Se decodifica el payload del JWT (segundo segmento, base64url) sin verificar la firma.
   - Si no es un JWT, o si `role !== "anon"`, el resultado es NO MEDIDO con «la clave no es la anónima», sin ningún pedido.
   - Nunca se imprime la clave ni el payload.
4. **Pedir lo mínimo:** `select=id&limit=1` en vez de `select=*`.
   - Antes, comprobá en `prisma/` o en las migraciones que las dos tablas tienen la columna `id`, y anotá dónde lo viste.
   - Si una no la tiene, pará y anotalo.
5. **Solo `https:`** salvo `localhost` y `127.0.0.1`, que necesitan los tests.
6. **El RUNBOOK cuenta lo mismo que el código.**
   - `docs/RUNBOOK.md`: lista vacía = SIN APLICAR (exit 2), no PASA.
   - Se agrega el control positivo y qué hacer con cada código.
   - La cita a `cola/loop/plataforma.md` pasa a «onia-hermes: `hermes-content/docs/cola/loop/plataforma.md`».

## PRUEBA DE HECHO
Primero en rojo con el código de hoy; anotá cuáles fallaron.
- Un test que corre el punto de entrada de verdad (`child_process.spawnSync(process.execPath, [enlace])`) a través de un
  symlink creado en un directorio temporal:
  - sin variables de entorno, sale con 3 y escribe «NO MEDIDO»;
  - nunca sale con 0 en silencio.
  - En Windows, si el symlink no se puede crear sin permisos, el test se salta con el motivo escrito. No se borra.
- Con un `fetch` doble:
  - control 401 → las dos NO MEDIDO y ningún pedido a `/rest/v1/`;
  - control 200 y tablas 401 → PASA (exit 0);
  - clave con `role: "service_role"` → NO MEDIDO y cero pedidos.
- La URL pedida lleva `select=id&limit=1`.
- `node --test scripts/verificacion/` en verde.
- Si el repo ya corre otros `scripts/**/*.test.mjs` en el CI, sumá este de la misma manera; si no, no toques el CI y anotalo.

## REGLA DE PARADA
- Solo `scripts/verificacion/b22-anon*.mjs`, su test y la sección de B22 en `docs/RUNBOOK.md`.
- Sin dependencias nuevas, sin red real y sin claves reales en los tests (claves armadas a mano con `role` en el payload).
- Si después de dos intentos algo sigue rojo por una causa fuera de esta lista, pará y anotalo.

## Entrega
Sección «PARA LA MADRE:» con:
- los archivos tocados;
- la salida de `node --test`;
- los tests que se pusieron rojos con el código viejo;
- dónde viste la columna `id` de cada tabla.
