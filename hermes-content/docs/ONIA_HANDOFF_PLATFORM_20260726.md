# Handoff → Sesión ONIA Platform (2026-07-26)

> De: sesión **ONIA System** (rama `claude/onia-colaboradores-sin-inversion-d69b19`).
> Para: sesión **ONIA Platform** (rama `claude/git-status-935f47`).
> Motivo: hoy tocamos **un archivo de su carril** porque bloqueaba la verificación de Meta.

---

## 1. Qué tocamos de su carril y por qué

**Commit `2792ea1c` en `main`** — `fix(onia-platform): identidad legal en el pie + numero real de WhatsApp`.
3 archivos, +37/−3, sin tocar layout ni rutas.

| Archivo | Cambio | Por qué |
|---|---|---|
| `src/lib/site.ts` | `WA_PHONE: "PLACEHOLDER"` → `"59178491375"` | **Todos los CTAs de WhatsApp del sitio estaban rotos** (caían en `wa.me/PLACEHOLDER`). Número confirmado por Sergio; es el mismo del portfolio de Meta. |
| `src/components/site-footer.tsx` | `<address className={styles.legalId}>` al final del bloque `.legal`: OniaAgency · NIT 5371375010 · Santa Cruz de la Sierra · tel · business@onia.com.bo | El revisor de Meta cruza el sitio contra el certificado SEPREC; la web no mostraba identidad legal. |
| `src/components/site-footer.module.css` | Bloque nuevo `.legalId` (+ `.legalId a`, hover/focus) | Estilo atenuado: 0.75rem, `--ink-faint`, links con borde inferior. |

**Conflicto de merge resuelto conservando ambos bloques:** `.legalNav` (suyo, línea ~92) y `.legalId` (nuevo, ~110) conviven; no se pisó nada.

**El domicilio exacto NO se publica** — es particular. Va solo en el formulario privado de Meta.

### Pedido explícito
**Corran `tsc --noEmit` / `pnpm build` en `apps/onia-platform` y confírmenlo.** Nosotros **no** pudimos: la app no tiene `node_modules` en este entorno. El cambio es JSX + CSS + una constante string, riesgo bajo, pero no está verificado por compilador.

Si algo no les cierra (naming, ubicación en el pie, formato del NIT), es su carril: cámbienlo sin pedir permiso. Lo único que pedimos que **no** vuelva atrás es `WA_PHONE` — si vuelve a `PLACEHOLDER`, el sitio deja de convertir.

---

## 2. Pendiente de ustedes

**a) QA visual del pie** — no lo verificamos en navegador: móvil (≤480px, que el `<address>` no desborde) y **ambos temas** (usa `--ink-faint`, en claro puede quedar bajo de contraste; mínimo 4.5:1).

**b) Decidir el JSON-LD `Organization`** — hay un parche preparado que **no aplicamos** (toca `src/app/layout.tsx`, archivo suyo y de más riesgo). Hoy `layout.tsx` no tiene ni `metadataBase` ni `ld+json`.

Qué hace el parche:
- Agrega `metadataBase: new URL("https://onia.com.bo")` — **hoy falta**, y sin él las URLs OG/canonical se resuelven relativas (Next avisa en build).
- Inyecta un `<script type="application/ld+json">` con `Organization`: `name: "Onia"`, `legalName: "OniaAgency"`, `url`, `taxID: "5371375010"`, `telephone: "+591 78491375"`, `address` (PostalAddress).

Dos avisos antes de aplicarlo:
1. **Sacar `streetAddress`** del `PostalAddress`. El parche se escribió antes de la regla "el domicilio no se publica": dejar solo `addressLocality`, `addressRegion`, `addressCountry`.
2. Si lo aplican, el dato legal queda en **dos** lugares (footer + layout). Elijan fuente única o dejen el comentario que ya trae el parche.

Ruta del parche: `…/scratchpad/legal/02-jsonld-organization.patch` (scratchpad de sesión, efímero — si ya no está, con los bullets de arriba se reescribe en 5 minutos). Junto a él quedaron `01-footer-legal.patch` (ya aplicado, es el commit) y `03-wa-phone-GATED.patch` (también aplicado).

---

## 3. Acuerdo de carriles vigente

Resumen de `hermes-content/docs/ONIA_CARRILES_ACTIVOS_20260726.md` (esa es la fuente de verdad):

| | ONIA System (nosotros) | ONIA Platform (ustedes) |
|---|---|---|
| Rama | `claude/onia-colaboradores-sin-inversion-d69b19` | `claude/git-status-935f47` |
| Suyo | `.claude/skills/**` · `.agents/skills/**` · `apps/site/src/app/onia-center/**` · `hermes-content/deploy/vps-ops/**` · `supabase/migrations/**` (schema `onia_center`) | `web-factory/apps/onia-platform/**` · `web-factory/docs/ONIA_BRAND_*` · `hermes-content/infra/vps-db/**` |
| Frentes | V video · C chatbot · M Meta/cuentas | Plataforma unificada · marca/logo · migración DentalGest Cloud→VPS |

Verificado con `git diff --name-only main...rama`: **las dos ramas no comparten un solo archivo** (salvo esta intrusión puntual, ya en `main`). Se mergean en cualquier orden.

**VPS = un solo dueño a la vez. Hoy lo tienen ustedes**, mientras dure la migración de DentalGest. Nosotros no levantamos contenedores ni aplicamos migraciones ahí (swap 100% lleno, la caja ya tocó techo). Nuestro chatbot corre dentro del n8n existente (0 GiB nuevos) y el render de video corre local, nunca en el VPS. Si necesitamos infra, avisamos y esperamos su ventana de corte.

---

## 4. Qué necesitamos de ustedes

**Nada bloqueante hoy.** Dos cosas menores:

1. **Avisar antes de crear archivos en `hermes-content/docs/**` con nombre que pueda chocar.** Es la única carpeta compartida de facto; el `docs-hygiene` diario borra duplicados idénticos y flaggea divergentes, así que dos archivos "casi iguales" generan ruido. Convención: fecha en el nombre y prefijo de carril (`ONIA_PLATFORM_*` vs `ONIA_*`).
2. **Confirmar el resultado de `tsc`/build** de §1 — si falla, avisen y lo arreglamos nosotros, el cambio es nuestro.
