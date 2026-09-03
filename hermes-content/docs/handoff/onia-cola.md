# Handoff — carril `onia-cola` (el integrador)

Un archivo por carril, sin fecha en el nombre: se EDITA, no se duplica.
Última vuelta reflejada: **2026-09-03 00:33–01:15 UTC**.

## Objetivo

Que las ramas de carril lleguen a `main` (soy el único que puede mergear), y después construir
la cola de plataforma. `main` alimenta el deploy del VPS, el de Vercel y —desde el 2026-09-02—
el sincronizador que despliega los prompts y el corredor de todos los loops.

## Qué quedó en producción

**Nada desplegado**: este carril no despliega, mergea. En `main` (`4dbe844df`) quedaron 6
commits nuevos esta vuelta:

- El merge de `claude/canario-visual` (4 commits): el arreglo de la captura ciega, sus 6
  capturas de evidencia y el handoff de ese carril.
- El cierre medido del 429 del widget de Chatwoot (ver abajo).

⚠️ **Mergear no es desplegar.** Lo que entró a `main` sigue valiendo cero hasta que Sergio
despliegue; el radar lleva la cuenta de lo que espera.

## Qué quedó a medias y dónde

- **El 🟠 de la captura full-page ciega sigue ABIERTO a propósito** (`COLA.md`, sección del
  canario del 2026-09-02 16:41). Es un defecto real de `scripts/canario_visual.mjs` con causa
  distinta a la del 429: el `screenshot({fullPage:true})` devuelve bandas vacías. El propio
  canario ya dejó escrito el siguiente paso (capturar por viewports sucesivos y coser) y los dos
  intentos que NO funcionan — no repetirlos.
- **12 carriles con commits sin mergear**, el mayor con 3. Se mergea **UNO por vuelta**, a
  propósito: el 2026-09-02 intentar cinco de corrido dejó un `MERGE_HEAD` abierto sobre `main`.

## Archivos

- `hermes-content/deploy/vps-ops/widget-429-de-quien.sh` — sonda nueva (¿el 429 es nuestro o del
  cliente?), probada en los dos sentidos.
- `hermes-content/docs/COLA.md` — 3 ítems cerrados con la medición; sección *"El 429 del widget
  era nuestro"*.
- `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` — ítem 32, cotizado.

## Intentos fallidos (el campo que casi nadie escribe)

- **Falsear la IP con `X-Forwarded-For` para probar que otro visitante recibe 200: NO funciona.**
  El proxy sobrescribe la cabecera con la IP real del socket y no aparece clave nueva en Redis.
  No lo repitas esperando otro resultado — pero el intento **no fue inútil**: que no se pueda
  falsear es justamente la prueba de que Chatwoot ve IPs de visitante de verdad y no una IP de
  proxy compartida, que era la hipótesis grave.
- **Buscar el contador en Redis sin autenticar falla mudo** (`NOAUTH`), y el `--scan` devuelve
  vacío como si no hubiera claves. Hay que pasar `-a "$REDIS_PASSWORD" --no-auth-warning`, si no
  se concluye "no hay throttle" que es exactamente lo contrario de la verdad.
- **No dupliqué el arreglo de la lista de carriles** aunque lo detecté en vivo: ya existe en
  `claude/docs-auditoria` (`c7a9bc3d3`) y toca el mismo archivo. Arreglarlo por mi cuenta habría
  fabricado un conflicto contra una rama que ya lo resolvió.

## Qué depende de Sergio

1. **Radar ítem 32** — OK para safelistear la IP del VPS en el contenedor de chat
   (`RACK_ATTACK_ALLOWED_IPS=187.77.16.63`). Es cambio de entorno + reinicio del chat. Sin eso el
   canario **no puede** ver el widget como lo ve un cliente.
2. **Radar ítem 26** — `claude/onia-core-adoption-sprint5` en `onia-platform`: 383 commits atrás
   con 1 propio. No la mergeo yo.
3. Lo ya anotado que sigue esperando deploy.

## Próximos pasos

1. Mergear `claude/docs-auditoria` (2 commits): trae el arreglo de la lista de carriles de **mi
   propio prompt**, que hoy enumera 7 ramas cuando hay 13 con trabajo. Es el que más se paga.
2. Seguir de a un carril por vuelta, el de más commits primero.
3. **Enumerar SIEMPRE en vivo los dos repos** (`onia-hermes` base `origin/main`, `onia-platform`
   base `origin/master`) y contrastar con `loops.md`: la lista escrita en el prompt se atrasó
   tres veces, y un carril que nadie enumera no llega nunca a `main`.
