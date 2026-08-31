# Handoff — carril `claude/git-status-935f47` (plataforma · infra · integración)

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: **2026-08-31 ~19:50 UTC**.
> ⚠️ La escritura anterior era del **2026-08-27** — cuatro días. Su objetivo era exactamente
> lo que esta sesión pasó el día redescubriendo. Es el caso que originó la skill
> `onia-continuidad`.

---

## 1. Objetivo

Que el trabajo de todos los carriles **converja y llegue a producción**. Nace de un dato
medido: 349 commits repartidos en 5 ramas y **cero en `main`**.

**LISTO =** `main` con todo integrado y gates verdes, y `app.onia.com.bo` sirviendo ese `main`,
verificado **mirando la pantalla**.

**Estado: CUMPLIDO.**

## 2. Qué quedó EN PRODUCCIÓN

- **`main` integrada: 242 commits.** Gates verdes: `tsc` 0 · **217 tests** · 28 archivos.
- **Deploy hecho** (`e5c1ad3`), con los 5 gates de `deploy-gates-swap.sh` en OK.
  `BUILD_ID` viejo `evS4ROA0…` → nuevo `DV21HNOnTZtVJaQlSccs7`.
  Backup del runtime anterior: `/opt/onia-platform/runtime-next.prev-20260831-194424`.
- Verificado **mirando**: login renderizado (captura), `/register` sirviendo el texto de la
  demo (PR #56). Único error de consola: Cloudflare intentando inyectar **su propio** beacon
  contra nuestra CSP — ajeno al deploy.
- **Los 2 crons que sólo vivían en `vercel.json`**, instalados en el crontab del VPS y
  **corridos a mano**: `recurring-invoices` (`0 6`) y `onia-core-workitems` (`0 10`), los dos
  exit 0 / http 200. Crontab respaldado en
  `/root/crontab-backup-antes-de-2-crons-20260831.txt` (29 → 36 líneas).
- **3 cuentas de más dadas de baja** en `onia_center.user_profiles`: `arthur`, `seller_001`
  (Camila), `seller_002` (Jerónimo) → `status='blocked'`. Queda sólo `sergio`.
- **El auto-deploy de Vercel, cortado** (`git.deploymentEnabled.master=false`). Sergio sacó
  los dominios: `dentalgest.app` y `www` responden **404**.
- **El aviso de pedido de acceso: PROBADO en vivo.** Se creó un pedido de prueba en
  producción → `201` → **cero** `[aviso-acceso] Telegram falló` en los logs, o sea que
  Telegram aceptó el mensaje. Fila de prueba borrada; los 3 leads reales intactos.

## 3. Qué quedó a medias, y dónde

- **Barrido de los ~200 docs**: apenas empezado. Se corrigieron 6 puntos del catálogo de
  venta, el doc de salida de Vercel y el de DentalGest. Falta el resto.
- **El carril `chatbot` no tiene cola** — tiene handoff, que es estado y no plan. Sin cola no
  puede tener loop. Lo tiene que escribir su propia sesión.
- **`n8n-mcp-server/node_modules` está commiteado** en `onia-platform` (4045 archivos del
  tarball). Bloat, no rompe nada. Sin decidir.

## 4. Archivos y cambios

| Qué | Dónde |
|---|---|
| Skill de continuidad (nueva) | `.claude/skills/onia-continuidad/SKILL.md` |
| Índice de colas por carril | `hermes-content/docs/cola/README.md` |
| Verificador de colas, ahora bi-repo | `scripts/verificar_cola.js` (self-check 9 → 15 → 26; ahora tambien caza duplicados) |
| Scripts de los 2 crons + runbook | `hermes-content/infra/vps-ops/crons/` |
| Fix del gate de acceso al Center | `web-factory/apps/site/src/lib/onia-center-perfil.ts` |
| Fix de `page_location` en GA | `onia-platform` PR #59 |
| Nav de `/requerimientos` + guarda anti-huérfano | `onia-platform` PR #57 |

## 5. Intentos fallidos — lo que NO hay que repetir

1. **Build con `NODE_ENV=production` en el `docker run`.** `npm ci` se saltea las
   devDependencies: 480 paquetes contra los 684 que necesita, sin Tailwind ni lightningcss, y
   PostCSS revienta. **`npm ci` va sin esa var; sólo el `npm run build` la lleva.**
2. **Sumar `/patients` al nav de servicios profesionales.** Le da la ficha clínica a un estudio
   contable con sus APIs en 403. Dos guardas del repo lo cazaron. El arreglo real ya existía:
   alta inline en el modal de citas.
3. **Commitear en el checkout principal** (`C:\dev\proyectos\onia-hermes`): está en la rama de
   OTRA sesión. Se resolvió con revert aditivo + cherry-pick, **sin reescribir su historia**
   (estaba recibiendo commits). Y un `git push origin HEAD` desde ahí iba a publicar **115
   commits ajenos sin pushear** — se alcanzó a frenar.
4. **Usar el alias `@/` en `middleware.ts`.** Next lo resuelve, **vitest no**, y tiró la suite
   entera del carril web-factory. Sólo apareció al integrar.
5. **Mergear `claude/pending-tasks-review-fb0694`.** Su único commit es un auto-sync del 10 de
   agosto y sus 3 archivos son versiones **más viejas** de lo que `main` ya tiene. Descartada.
6. **Usar `grep` para CONFIRMAR.** Pasó **cinco veces** en el día. La última: afirmé que el
   aviso de leads no existía porque busqué en `app/api` y vive en `lib/aviso-acceso.ts`.

## 6. Qué depende de Sergio

| # | Qué | Por qué no lo puedo hacer yo |
|---|---|---|
| S1 | **Borrar el proyecto `dental-gest` de Vercel** | sin token, CLI deslogueado, el MCP da **403** y no expone borrado |
| S2 | **Credenciales del BCP** | son del banco |
| S3 | **Recorrer el circuito en producción** — cuenta real, correo real, pago | sólo lo prueba una persona |
| S4 | **Contestarle a Máximo (21-ago), Leonardo (23-ago) y Edwin (28-ago)** | pidieron acceso y siguen sin respuesta |

## 7. Próximos pasos

1. **Terminar el barrido de docs** con el criterio de `onia-continuidad`: corregir en su
   archivo, dejar la marca ⚠️, nunca crear uno al lado.
2. **Separar el canal del aviso de leads** del canal del guardián del VPS. El mecanismo
   funciona; el problema es que un lead se pierde entre los avisos de infra.
3. Que el carril chatbot escriba su cola, para poder darle loop.
4. Decidir el bloat de `n8n-mcp-server/node_modules`.
