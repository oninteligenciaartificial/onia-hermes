# ONIA — Estado real al 2026-08-13

> **Este documento manda.** Si otro doc del repo contradice algo de acá, gana este y el otro
> está viejo. Todo lo que sigue fue **verificado el 13-ago-2026** contra producción, la base
> o el código — no es lo que planeamos, es lo que hay.
>
> Se escribió porque el repo tiene **267 documentos** de distinta época y eso hace que cada
> sesión arranque creyendo cosas que ya no son ciertas.

---

## 1. Qué corre en producción, de verdad

| Superficie | Dónde | Estado |
|---|---|---|
| Producto | `app.onia.com.bo` | Vivo. Registro y login **funcionan** (se arreglaron hoy). |
| Web pública | `onia.com.bo` | Viva. Wizard `/empezar` corregido, indexabilidad completa. |
| Panel interno | `center.onia.com.bo` | Vivo. |
| Formularios | `forms.onia.com.bo` | Vivo. |
| Postiz (publicador) | `postiz.onia.com.bo` | Vivo con TLS válido. **Sin credenciales de red: no publica.** |
| Assets de Hermes | `onia.com.bo/hermes-assets` | Vivo, nginx solo-lectura, sin listado de directorio. |
| Base de datos | VPS 187.77.16.63 | Supabase **auto-hospedado**, contenedor `dentalgest-staging-supabase-db` (el nombre engaña: **es producción**). |

**El VPS es la infraestructura, no Supabase cloud.** Esto importa legalmente: el proveedor
presta el servidor, no administra la base.

---

## 2. El negocio, sin maquillaje

- **0 clientes reales. 0 pagos acreditados. 0 mensajes despachados.**
- Todas las organizaciones en la base son demos y pruebas internas (varias creadas por QA hoy).
- `subscription_payments` = 0 filas: nadie pagó nunca por ese camino.
- Los agentes tienen **90 corridas y 5 aprobaciones pendientes, con 0 despachos**.

---

## 3. Qué es producto y qué es cascarón

| Rubro | Realidad |
|---|---|
| **Dental** | **Producto de verdad.** 8 páginas propias (ficha, odontograma, recetas), agenda, citas, tratamientos, facturación. Datos vivos. |
| **Comercio** | **Producto de verdad.** Catálogo, inventario, caja, fiados (CxC/CxP), kardex al promedio ponderado. |
| **Importadora** | Cotizaciones B2B y costeo de importación propios, sobre el motor de comercio. |
| **Estética / Veterinaria** | ⚠️ **Cascarón.** Son la app dental con rótulos cambiados. El modelo `Patient` es humano (CI, género M/F/Otro, sangre ABO/Rh); no hay especie, dueño ni raza. **`Invoice.patientId` es obligatorio y la factura toma nombre y NIT del paciente: una veterinaria NO puede facturarle al dueño.** |
| **Servicios profesionales** | Reusa comercio + agenda. |
| **Ganadería** | ⚠️ **Cascarón.** Encendido hoy reusando el core; sin entidades de hacienda ni sanidad. El core la marca `pending_adoption`. El nombre dice "offline" pero **esa capacidad no existe**. |

**De 16 capacidades (módulos + add-ons), sólo 3 las lee alguna línea de código:**
`module.agents` (completa), `module.invoicing` (con gate, pero SIAT apagado) y
`addon.inmobiliaria` (enciende sólo el agente captador, sin nav ni rutas).
Para las otras 13, **prender el módulo no cambia un pixel.**

---

## 4. Qué está roto o apagado

| Cosa | Estado | Quién destraba |
|---|---|---|
| Correo del producto | `535 Authentication failed` contra `smtp-relay.brevo.com`. **Un pago entra y nadie se entera.** | Sergio (credencial) |
| Despacho de agentes | Doble candado: el cupo lee el booleano viejo `whatsappAddon` (ninguna org lo tiene) + credenciales de Meta = literal `SIN_CONFIGURAR` | Sergio + código |
| Facturación SIAT | `SIAT_EMISSION` y `SIAT_SERVICE_URL` vacíos. **No se puede emitir factura real**; devolvería CUF simulado | Sergio (NIT + homologación) |
| Postiz | 11 variables de proveedor vacías. No conecta ninguna red | Sergio |
| Pantalla de capacidades | Existe, **no está en producción**: vive en `feat/importar-catalogo-dropzone` | equipo (deploy) |
| Drip de trial | 0 correos enviados nunca | depende del correo |
| `/help` | Dice "odontograma" a **todos** los rubros | equipo |

---

## 5. Seguridad — cerrado y verificado (2026-08-11 al 13)

- **RLS activo en las 71 tablas** de datos de cliente; el rol público `anon` sin permisos.
- **Cortafuegos** activo; puertos de contenedores cerrados; panel de Easypanel sólo por TLS.
- **fail2ban** + **vigilante diario** que comprueba que las defensas sigan puestas y avisa
  por Telegram si alguna se cae.
- **Log de conexiones de la base** funcionando (se resolvió con `ALTER ROLE ALL SET
  log_min_messages='warning'`, sin recrear el contenedor).
- Respaldos **diarios locales, retención 7 días**, con verificación de que no salgan vacíos.

**Lo que NO hay** (y por eso la política de privacidad ya no lo promete): cifrado de disco
en reposo, respaldos cifrados, respaldo fuera del servidor (R2), 2FA, ISO 27001 / SOC 2.

---

## 6. Reglas de despliegue que se pagaron caro

1. **El producto se buildea EN EL VPS con su `app.env`.** Nunca en Windows: `NEXT_PUBLIC_*`
   se **hornea en el bundle** al compilar, y un build local con `.env.local` deja producción
   pidiéndole auth al `localhost` del visitante. Pasó hoy.
2. **Antes de dar un deploy por bueno:** `grep -rl '127.0.0.1' <runtime>` tiene que dar **0**.
3. **Guardar siempre el runtime anterior** (`mv runtime-next runtime-next.bak-<ts>`): permite
   comparar y restaurar en segundos.
4. `next build --webpack` es obligatorio en el producto (Next 16). En la landing **no existe**
   ese flag (Next 15.5).
5. **`tar` fusiona, no borra**: sincronizar fuente sobre un árbol viejo deja archivos fantasma
   que rompen el build. Borrar la carpeta antes de extraer.
6. Al agregar una ruta al archivo manual de Traefik, **reiniciar Traefik**: el reload rutea
   pero no dispara la emisión del certificado.
7. La UI del producto **no sale de web-factory**. Los bloques de web-factory son
   `render*(client): string` — HTML como texto para landings. El panel es React y usa
   `components/ui/`. Lo único portable es `motion.ts`.

---

## 7. Mercado y precio (verificado con fuente)

| Competidor boliviano | Precio | Emite factura |
|---|---|---|
| Growing Cloud | Bs 100/mes (hasta 700 facturas) | sí |
| Sintic MonoBusiness | Bs 150/mes | sí |
| Codex (Sinergya) | Bs 1.000/año | sí |
| CUCU (Odoo) | Bs 1.080/mes + Bs 4.500 setup | sí |

**Consecuencia:** todos emiten y Onia no. Cualquier plan de Onia **debajo de Bs 200** compite
sin diferencia visible y pierde. El precio de entrada se justifica con **operación**
(agenda, recall, cobranza, caja), **nunca con emisión**.

---

## 8. La apuesta vigente

**Odontólogos de Santa Cruz, vendidos a mano, cobrando la operación, NO la factura.**

Detalle completo, con las 3 movidas de 90 días y sus métricas:
`docs/platform/ONIA_DECISION_SAAS_CONSULTORIA_20260813.md`.

---

## 9. Qué documentos están viejos

**El repo tiene 267 documentos.** De los 10 más viejos que revisé, **8 siguen referenciados**
desde `CLAUDE.md` u otros docs, así que **borrar en masa rompe el punto de entrada**.

**Borrar (sin referencias, superados por completo):**
- `ONIA_PLAN_MAESTRO_30_60_90_20260705.md` — reemplazado por las 3 movidas de la decisión de hoy.
- `ONIA_PROPUESTAS_V3_PLAN_20260705.md` — el generador de propuestas ya lo superó en código.

**NO borrar aunque parezcan viejos** (los referencia `CLAUDE.md` y son el punto de entrada):
`ONIA_SKILLS_STACK_Y_SUBAGENTES_20260705.md` · `ONIA_PROXIMA_SESION_PLAN_20260705.md` ·
`ONIA_SESION_KICKOFFS_20260705.md` · `ONIA_TABLERO_20260709.md` ·
`ONIA_ECOSYSTEM_INVENTORY_20260704.md` · `ONIA_CENTER_SANEAMIENTO_HANDOFF_20260705.md` ·
los planes de canales de YouTube (carriles K y L).

**Marcar como superado, no borrar** — todo doc anterior al 2026-08-01 que hable de: DentalGest
o GestiOS como **productos separados** (hoy son packs de una sola plataforma), precios previos
a la revisión de agosto, o el estado de rubros (cambió hoy). Lo correcto es una línea al
principio de cada uno: `> SUPERADO por ONIA_ESTADO_REAL_20260813.md`.

**La regla que evita repetir esto:** un doc de estado nace con fecha y muere cuando aparece el
siguiente. Los docs de *decisión* y de *runbook* se conservan; los de *estado* y *plan de
sesión* se marcan superados apenas hay uno nuevo.
