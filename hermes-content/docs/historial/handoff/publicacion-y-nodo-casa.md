# Handoff — publicación automática y nodo de casa

> Rama `claude/usuarios-pricing-v1-cierre-db1230`, worktree
> `.claude/worktrees/bolivian-community-manager-search-d2ffb2`. Cerrado 2026-09-08 ~19:30 La Paz.

**Objetivo**

⚠️ **El objetivo declarado NO fue el que se trabajó, y hay que decirlo.** La rama se abrió para
*«cerrar usuarios y pricing de la 1.0»*. Eso **no se hizo**: no se tocó una línea de
`onia-platform`. Lo que sí se hizo, pedido por Sergio Urcullo a mitad de sesión, fue otro carril:
**medir los loops, abrir la vía de vuelta al nodo de casa, publicar los 45 arreglos varados y
automatizar la publicación.** Ese carril sí está terminado y verificado. Quien retome
«usuarios y pricing» arranca de cero.

**Qué quedó EN PRODUCCIÓN**

- **`onia.com.bo`** — build `RUEBXXkPtGVaU5C9X0MS9`, swap 17:25 UTC. Respaldo
  `runtime-next.bak-deploy-20260908172505`. Verificada MIRÁNDOLA: hero, rubros, precios, FAQ.
- **`app.onia.com.bo`** — dos publicaciones. La primera a mano (`b54a148`, BUILD_ID
  `sNMW9rcT8D15GNP2qKYlm`, 17:31 UTC, respaldo `runtime-next.prev-20260908-173105`), los 5 gates
  en verde. La segunda **por el publicador automático** (`6b7af9a`, 19:11 La Paz), 11 arreglos.
- **Bot de WhatsApp** — 18 archivos, `/health` ok, respaldo `deploy-20260908T173350Z`. El
  `knowledge.json` vivo SOBREVIVIÓ (mismo md5 `6b74d58c…`, 2 FAQ, 9 disparadores).
- **`/root/bin/onia-publicar-solo.sh` + cron `50 */3 * * *`** — encendido, con una corrida real
  hecha. Respaldo del crontab anterior en `/root/crontab.bak-*`.
- **`/root/bin/casa.sh`** — la vía VPS → nodo de casa. Probado: entra como
  `compu_pc_casa_sergio@DESKTOP-0GGGNMF` sin argumentos.

**Qué quedó a medias, y dónde**

- **Nada sin commitear.** Árbol limpio, 4 commits pusheados a
  `origin/claude/usuarios-pricing-v1-cierre-db1230`: `966a95ee`, `5984e4ac`, `de65f682`, `9850e9a1`.
  **La rama NO está mergeada a `main`.**
- **La landing tiene un arreglo FRENADO a propósito**: toca
  `web-factory/apps/onia-platform/src/lib/pricing.ts`. La guarda de precio no lo publica sin firma.
  Sigue esperando y seguirá esperando: no es un fallo.
- **`sergio@onia.com.bo` no ve el panel interno.** El panel existe y la org `onia-interna` también,
  pero su cuenta es ADMIN en `clinica-sergio-p2ljs` (rubro dental) y la puerta exige que la ORG
  sea `onia-interna`. La cuenta de la casa es `superadmin@onia.com.bo`; **su clave no se encontró
  en ningún archivo de credenciales** — sólo se la nombra en tres docs de `investigacion`.

**Archivos y cambios**

| archivo | qué es |
|---|---|
| `scripts/loops/extras/casa.sh` | entra al nodo de casa por el túnel inverso (`127.0.0.1:2222`) |
| `scripts/loops/extras/publicar-solo.sh` | publica lo que pasa los gates; frena lo que toca precio |
| memoria `nodo-casa-via-de-vuelta.md` | para que la próxima sesión no diga «no tengo acceso» |

**Intentos fallidos** — el campo que más vale

1. 🔴 **Dije que 4 loops se habían caído. ERA FALSO.** `lucia`, `marca-personal`, `tendencias` y
   `web-factory-dev` están **apagados a propósito**, en las tablas «Pausados 2026-09-04» y
   «Congelados 2026-09-05» de `cola/loops.md`, con «NO rearmar» escrito. Leí la fila 625 —que es
   HISTORIA del loop viejo de Windows y lo dice en su propio texto— como si fuera el estado de hoy.
   **El sistema de loops está bien configurado. No hay nada que revivir.**
2. 🔴 **Dije que el vigía de loops estaba «mudo» porque sus logs pesan 0 bytes. ERA FALSO.**
   Pesan 0 porque no tiene nada que avisar: los 4 loops que vigila están sanos. Deja estado en
   `/var/lib/onia-vigia-remotos/*.alta`. Funciona.
3. 🔴 **`publicar-solo.sh` nació roto de la forma más peligrosa: decía «al día» con ONCE arreglos
   varados delante.** Causa exacta: la detección era `publicar.sh --dry-run | head -1 | grep -q`,
   y con `set -o pipefail` el `head` cierra el caño, el publicador muere con SIGPIPE (141) y ese
   141 pasa a ser el estado de todo el `if`. **Un falso negativo que se ve igual que la salud.**
   Se encontró comparando contra el publicador directo, no creyéndole a la propia salida.
   Arreglado capturando la salida entera y comparando con `case`.
4. **Tres falsas alarmas que tendió mi propio instrumento**, todas descartadas midiendo:
   el «hueco blanco» de la landing (es scrollytelling `position: sticky`, la sección mide 4.895 px
   a propósito) · el **429 del widget de chat** (lo causé yo: Rack::Attack bloqueó a
   `HeadlessChrome` desde mi IP; desde el VPS da 200) · los nombres de iconos (`bolt`, `spa`,
   `dentistry`) en `/register` (**`innerText` devuelve la ligadura aunque el icono se vea bien** —
   sirve para descartar, jamás para confirmar).
5. **Tailscale no hizo falta.** `PLAN_HOMELAB.md` lo eligió (paso 4, sigue pendiente), pero la PC
   ya mantenía un túnel inverso; sólo faltaba autorizar una llave.
6. **El primer comando para autorizar la llave escribía en `/root/.ssh` y falló**: en WSL la cuenta
   por defecto no es root. Y **el usuario del otro lado no es adivinable** — probé 8 candidatos, ninguno
   entró; es `compu_pc_casa_sergio`, lo dio Sergio Urcullo.
7. **Dos esperas en segundo plano fallaron por umbral mal puesto**: conté 23 vueltas sobre la copia
   del VPS y en casa ya eran 24 — **son dos fuentes distintas**, la del VPS lleva el sello del rsync.

**Qué depende de Sergio Urcullo**

- 🔴 **¿Existe cuenta bancaria de OniaAgency?** Hoy sólo hay una personal suya. Es lo único que
  separa «el cliente te escribe y le pasás los datos» de «el cliente se cobra solo». No es código.
- 🔴 **La clave de `superadmin@onia.com.bo`**, o la decisión de mudar su cuenta a `onia-interna`.
  Sin eso no ve el panel del negocio. Se ofreció restablecerla; no se hizo.
- **El arreglo de la landing que toca `pricing.ts`** espera su firma.
- **SIAT**: decidir si se vuelve a medir el portal. El dato vigente es del **27-ago** (Fase 1 al
  24,8 %, límite **04/11/2026**) y tiene doce días.
- **Mergear esta rama a `main`.**

**Próximos pasos**

1. **Probar el circuito de cobro con Bs 1 reales.** `subscription_payments` tiene **CERO filas**:
   nunca pasó un pago de verdad. Listo cuando una fila llegue a `APPROVED` y el plan se active solo.
2. **Resolver el acceso al panel interno** (clave o mudanza de cuenta). Listo cuando Sergio Urcullo
   entre y vea las cifras de la plataforma, no las citas de una clínica.
3. **Volver a medir SIAT** en `fman.impuestos.gob.bo`. Listo con el porcentaje de hoy escrito.
4. **Mirar dos vueltas del cron de las 20:50 y 23:50 UTC** para confirmar que el publicador
   automático sigue publicando solo. Listo si `/var/log/onia-publicar-solo.log` muestra dos
   corridas sin intervención.
5. **Recién entonces, retomar «usuarios y pricing de la 1.0»**, que es de lo que esta rama nunca
   se ocupó.
