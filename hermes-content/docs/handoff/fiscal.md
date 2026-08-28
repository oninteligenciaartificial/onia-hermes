# Handoff — carril fiscal

**Repo:** `onia-platform` · **worktree:** `.claude/worktrees/fiscal-mock` · **rama:** `carril/fiscal-mock`
**Última sesión:** 2026-08-28

---

## 1. Objetivo

Verificar **mirando** que el circuito fiscal completo funciona en modo mock, de punta a
punta. Hecho = abrir una factura en el navegador, confirmarla, y VER el CUF, el QR y la
leyenda en pantalla y en la vista de impresión.

**Cumplido.** Con captura, no con un 200.

## 2. Qué quedó en producción

**NADA, y es a propósito.** Todo esto es local. Los tres gates (`SIAT_EMISSION=1`,
`PLATFORM_LAYER=1`, entitlement `module.invoicing`) están encendidos SOLO en el
`.env.local` de ese worktree, que no se commitea. En producción siguen apagados.

El sistema **no está autorizado ante el SIN** (Fase 1 al 24,8%, límite 04/11/2026), así
que `SIAT_SERVICE_URL` va vacío a propósito: con eso `siat-client` corre en mock y no
puede tocar al SIN ni por error.

## 3. Qué quedó a medias, y dónde

🔶 **El detalle de la factura no muestra la emisión.** `app/(dashboard)/billing/[id]/`
emite, guarda el CUF y en la pantalla donde el usuario está parado no aparece ninguna
señal. Hay que entrar a "Imprimir / PDF" para verlo. No es un bug de la emisión: es que
nadie lo dibujó.

🔶 **El arreglo del fallo silencioso está a mitad de camino.**
`app/(dashboard)/billing/[id]/InvoiceActions.tsx:changeStatus` hace el `fetch` y
**descarta la respuesta entera** — ni la lee. El bloque `fiscal: { estado: "error" }` que
se agregó esta semana en `app/api/invoices/[id]/route.ts` para que un fallo dejara de ser
invisible, **sigue siendo invisible en la UI**. Del lado del server ya está resuelto
(queda auditado como `INVOICE_FISCAL_FAILED` y ya no se confunde con éxito); del lado del
usuario, ve el mismo cambio de estado de siempre. Es la misma familia que el `neverError`
de n8n.

## 4. Archivos

| Archivo | Qué es |
|---|---|
| `docs/DESARROLLO_LOCAL.md` | Cómo levantar la base local y cómo saber contra cuál estás |
| `supabase/config.toml` | Puertos 553xx + `db.migrations` apagado (el esquema es de Prisma) |
| `scripts/seed-fiscal-local.mjs` | Org + perfil + paciente + factura + entitlement |
| `scripts/mint-session-local.mjs` | Cookie de sesión con `@supabase/ssr`, la librería de la app |
| `scripts/verificar-fiscal-local.mjs` | La verificación completa en un comando |

## 5. Intentos fallidos — lo que NO hay que repetir

- **`127.0.0.1` mata la hidratación.** Next bloquea los recursos dev cross-origin: la
  página carga, devuelve 200, se ve entera… y los botones están MUERTOS. El click no
  dispara ni una petición y no hay ningún error visible. Estuve por reportarlo como bug
  del producto. **Entrar por `localhost`.**
- **`supabase start` explota aplicando `supabase/migrations/`.** El esquema lo maneja
  Prisma; ese SQL agrega `appointments` a Realtime y la tabla todavía no existe. Solución:
  `db.migrations enabled = false`, Prisma primero, ese SQL después.
- **Un script en `/tmp` no encuentra `playwright`.** ESM resuelve desde la ubicación del
  script, no desde el cwd. Van adentro del repo.
- **`/tmp` de bash y `/tmp` de node NO son el mismo lugar.** Node escribe en `C:\tmp`.
- **El checklist de onboarding se abre solo** y tapa la pantalla entera con un overlay que
  intercepta los clicks. `Escape` antes de tocar nada.
- **La org recién sembrada redirige a `/onboarding`** hasta que tenga `onboardingCompletedAt`.

## 6. Qué depende de Sergio

**Nada para seguir en local.** Lo que sí depende de él y bloquea el paso siguiente:

- 🔴 **La autorización ante el SIN.** Hasta que exista, `SIAT_EMISSION` no se enciende en
  producción y el emisor real no se prueba contra nada. Límite 04/11/2026.
- Decidir si el CUF debe verse en el detalle además de en la impresión (punto 3).

## 7. Próximos pasos

1. Que `changeStatus` lea la respuesta y muestre el fallo fiscal — cierra el arreglo que
   hoy está a medias.
2. Dibujar el bloque fiscal en el detalle de la factura.
3. Probar los caminos feos, que hoy no se probaron: emisión que falla, reintento sobre una
   factura ya emitida (la idempotencia tiene tests, pero no se miró en pantalla), y anulación.
