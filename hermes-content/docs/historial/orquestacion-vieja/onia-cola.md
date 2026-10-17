# Handoff — carril `onia-cola` (el integrador)

**Última vuelta: 2026-09-03 05:33–06:10 UTC.**

## Objetivo de la vuelta

Integrar el carril con más commits varados, y después construir. **Los dos, cerrados.**

## Qué quedó EN PRODUCCIÓN (`main`, pusheado)

**1. Integrado `claude/docs-auditoria`** (`00a0ae5d0`, 1 commit, 3 archivos, +125/−0): los 13
worktrees de carril nunca ven `main`, así que auditan sobre un repo viejo y **pueden revertir
arreglos ajenos**. Gate `npm test` verde. Quedó en el radar como ítem 39 con las tres opciones
cotizadas — la de raíz toca `onia-loop.sh`, el archivo compartido por los 15 loops, y es de Sergio.

**2. Arreglada la sonda del 429 del widget** (`c6b031aaf`). Es el ítem 🔴 que llevaba **cinco
vueltas** reabriéndose. **El sitio nunca estuvo roto: mentía el instrumento.**

- Medido en vivo: `/widget` responde **200**, contador en 2 de 5, y **287 de 289 peticiones
  (99 %) salen del propio VPS**. Ráfagas en `:48–:56` de cada hora (el loop `web-venta` abriendo
  sus 5 páginas) y en `:41` (canario). Con 5/hora por IP, **cada corrida se autolimita sola**.
- Los dos defectos de `widget-429-de-quien.sh`, que empujaban al mismo error: **falso negativo**
  (widget en 200 ⇒ "nada que diagnosticar", tirando las 286 peticiones que mostraba dos líneas
  antes) y **falso positivo** (contaba *peticiones* ajenas, no *IPs ajenas que llegaran al
  límite*: 2 visitas legítimas gritaban "clientes afectados" — de ahí salió el ítem, textual).
- La decisión se mudó a `scripts/veredicto_widget.mjs`: función pura, `--self-check`, **dentro de
  `npm test`** (`test:veredicto-widget`, cableado verificado por `guards-cableados`).

## Qué quedó a medias, y dónde

**Nada abierto de esta vuelta.** Sin `MERGE_HEAD`, sin paths en conflicto, árbol limpio.

**Siguen sin mergear los dos de siempre, y se recontó en vez de obedecer la nota vieja**
(la lección #1 del handoff anterior): `git merge-tree` confirma que **el conflicto sigue vivo**,
no venció. Es el mismo choque de `references/modelos/lucia/` — radar ítem 36.

| rama | commits | choca en |
|---|---|---|
| `claude/calidad-generado` | 2 | `RUBRICA-IMPOLUTO.md`, `BANCO-OFICIAL.md`, `BITACORA-PERFECCION.md` |
| `claude/git-status-935f47` | 2 | `LUCIA.md` |
| `claude/web-venta` | 1 | **nuevo**: `ONIA_RADAR_DECISIONES_PRODUCTO.md` |

**Limpia y lista para la vuelta que viene:** `claude/chatbots-platform-review-0d1d09` (1 commit,
arregla una sonda del bot que daba verde falso). No se mergeó por la regla de **un carril por
vuelta**.

## Archivos tocados

- `scripts/veredicto_widget.mjs` — **nuevo**, la lógica del veredicto con su self-check.
- `hermes-content/deploy/vps-ops/widget-429-de-quien.sh` — delega el veredicto; ya no decide.
- `package.json` — `test:veredicto-widget` dentro de `npm test`.
- `hermes-content/docs/COLA.md` — el 🔴 cerrado con la medición y el porqué era falso.

## Intentos fallidos y trampas (lo que casi cuesta caro)

1. **Casi arreglo el sitio en vez del instrumento.** El ítem decía "el widget sigue caído en las
   5 páginas" con capturas reales. La primera medición en vivo lo desarmó: **HTTP 200**. Si me
   hubiera saltado el Gate 1, habría ido a buscar un bug de producto que no existe — y es la
   **tercera** vez que este repo paga el mismo modo de falla (el rasterizador del canario, la
   sonda del bot, y ahora esta). **El instrumento se mide a sí mismo y reporta su huella como
   una caída del producto.**
2. **La sonda anterior era MÍA, escrita hace 5 horas, y estaba mal.** La escribí en esta misma
   vuelta anterior "para que no se re-derive nunca más" — y su veredicto dependía del minuto en
   que se la corriera. Una sonda sin test es una opinión con horario.
3. **El rojo se verificó de verdad, no se asumió.** Reimplementé la lógica vieja en `/tmp` y le
   pasé los mismos casos: **3 de 4 fallan**. Sin eso, "el test pasa" no prueba que arregle nada.
4. **`verificar_cola.js` tiene 9 errores preexistentes** (`pricing.ts`, rutas con llaves
   `{home,precios,…}`). Se contó antes y después del cambio: **9 = 9**. No es gate de `npm test`;
   ojo con leerlo como una regresión propia.

## Qué depende de Sergio

1. **Radar 36 — quién es dueño de `references/modelos/lucia/`.** Una línea. Destraba 4 commits y
   deja de romper dos merges por vuelta. **Ya va un día entero.**
2. **Radar 39 (nuevo) — los 13 worktrees nunca ven `main`.** El loop recomienda **C** (`fetch` +
   `merge --ff-only` en el corredor, ~20 min). Toca el archivo compartido por los 15 loops.
3. **Safelistear la IP del VPS en Chatwoot** (`RACK_ATTACK_ALLOWED_IPS=187.77.16.63`). Con eso el
   canario vuelve a ver lo que ve un cliente en vez de su propia huella. Cambio de entorno del
   contenedor de chat, con reinicio.
4. **Radar 31 — `onia.com.bo` se puede publicar ya.** Sigue pendiente. Un reinicio NO alcanza:
   hay que rebuildear.

## Próximos pasos

- Mergear `claude/chatbots-platform-review-0d1d09` (limpia, 1 commit).
- Con la respuesta al 36: `calidad-generado` y `git-status-935f47`. Sin ella, **abortan por
  diseño** — pero **recontá con `git merge-tree` antes de obedecer esta nota**: es una medición
  con vencimiento, y así se destrabó `lucia-vps`.
- `claude/onia-core-adoption-sprint5` (onia-platform) sigue siendo decisión de Sergio (radar 26).

---

## Vuelta 2026-09-03 ~13:00 UTC — el alta borra la cuenta del cliente (t_a906491b, EN CURSO)

**Estado: diagnosticado y PROBADO, sin arreglar.** La tarea sigue reclamada por `onia-cola` a
propósito: no está hecha. La próxima vuelta arranca desde acá, no desde cero.

**Qué pasa (lo reportó `recorrido-cliente`, lo confirmé yo leyendo el código y el env de producción):**
registrarse dos veces con un correo que ya existe y **sin confirmar** no muestra nada en pantalla
**y le borra al cliente la cuenta que ya tenía**, dejando su organización huérfana.

**El mecanismo, ya no es hipótesis:**

1. Producción corre el camino `signUp()`, no el camino admin. Medido en vivo:
   `docker exec onia-platform env` → `ONIA_REGISTRO_CONFIRMA_CORREO=si`, y
   `docker exec supabase-auth2 env` → `GOTRUE_MAILER_AUTOCONFIRM=false`.
2. `app/api/auth/register/route.ts:180-187` confía en que GoTrue delata al correo repetido
   devolviendo `identities: []`. **GoTrue sólo ofusca así a los correos CONFIRMADOS.** Con uno
   sin confirmar hace un *resend* legítimo: manda de nuevo el mail (`user_confirmation_requested`
   en los logs, que es justo lo que se observó) y devuelve el user **con `identities` lleno**.
   Por eso el 409 "Este correo ya está registrado" nunca dispara.
3. Entonces `route.ts:189-190` hace `userId = signUpData.user.id` — que es el id del usuario
   **que ya existía** — y marca `createdAuthUser = true`, que es **falso**: no lo creamos nosotros.
4. `provisionOrganization` choca con el negocio duplicado y tira `ProvisioningError`.
5. El `catch` de `route.ts:317-321` ve `createdAuthUser === true` y ejecuta
   `supabaseAdmin.auth.admin.deleteUser(userId)` → **borra al usuario del cliente**.
   La organización del alta ORIGINAL queda sin dueño: exactamente las filas huérfanas que se
   encontraron (`organizations` + `profiles` + `organization_entitlements` sin usuario en `auth.users`).

Eso explica las tres observaciones a la vez: el `/signup` de GoTrue en 200, la fila de `auth.users`
desaparecida, y la organización que quedó.

**Intento fallido / callejón que la próxima NO tiene que repetir:** la primera lectura fue "la ruta
ya maneja el duplicado, esto debe ser el formulario que no pinta el error". Es falso y cuesta una
vuelta: el 409 existe en el código pero es **inalcanzable** en el camino que corre producción. El
bug no es de pintura, es que se borra una cuenta.

### ✅ Cerrado en la vuelta de las 11:33 UTC — commit `38a0c8a` de `onia-platform` (`master`)

La hipótesis de arriba **se probó antes de contarse**, midiendo contra producción (11:41 UTC):
repetir el alta con un correo sin confirmar devuelve **HTTP 200 con el user entero** — mismo `id`
que el alta original, `identities` con 1 elemento y **`created_at` con la fecha ORIGINAL**. Eso
confirma las dos mitades: el 409 por `identities` vacío nunca dispara, y `createdAuthUser=true` es
falso.

- **La señal es `created_at`**: anterior a la petición ⇒ la cuenta ya existía y no es nuestra ⇒ 409
  con mensaje, sin provisionar y sin borrar. Margen de 60 s por desfase de reloj.
- **Cuatro tests, en ROJO antes por los motivos correctos**: `expected 200 to be 409`, provisioning
  sobre cuenta ajena, y `deleteUser` *"been called 1 times"* — el borrado de la cuenta reproducido
  en un test. El cuarto (alta legítima con `created_at` de ahora ⇒ 200) es la guardia de regresión.
- El test que ya existía cubría el correo **confirmado**, que es el caso que **funciona**: otra vez
  el patrón de "el test mira el primer paso y el sistema muere en el segundo".
- Gates: `tsc` 0 errores, `lint` 0 errores, `vitest` 2519 pasando.
- Usuario de prueba borrado de `auth.users`; cero organizaciones huérfanas.

⚠️ **Está en `master`, NO desplegado: para el cliente el bug SIGUE VIVO.** El contenedor
`onia-platform` corre el build anterior. Desplegar es de Sergio → radar ítem 41.
