# Onia Platform — estructura, estado real y plan al miércoles 5 de agosto

> **2026-07-30 (jueves).** Objetivo único de sesión declarado por Sergio: **Onia Platform**.
> Fecha ancla: **miércoles 5 de agosto** — reunión con el BCP y sus ingenieros de La Paz para
> integrar la pasarela de pago del banco. **Quedan 6 días.**
>
> Todo lo demás está parqueado en `ONIA_PARQUEADO_20260730.md`.
>
> Todo lo que dice este doc está verificado contra el código o la base. Donde no pude
> verificar, lo digo.

---

## 1. Qué es Onia Platform, en concreto

**No es un proyecto nuevo. Ya existe y corre.** Es el código del repo `DentaGest/dental-saas`
(el nombre es histórico), que **ya tiene una capa de plataforma multi-rubro construida**:

```
C:\dev\proyectos\DentaGest\dental-saas
├── lib/platform/          ← LA CAPA DE PLATAFORMA (existe, con tests)
│   ├── vertical-pack.ts     packs por rubro: qué módulos, menú, vocabulario, roles
│   ├── entitlements.ts      qué features tiene encendidas cada cuenta
│   ├── provisioning.ts      alta de una organización nueva
│   ├── demo-provisioning.ts alta de un ambiente demo
│   ├── context.ts           el contexto de cuenta (incluye verticalTrackId)
│   └── flags.ts             todo detrás del flag PLATFORM_LAYER=1
├── lib/onia-core/         ← el núcleo compartido, sincronizado desde onia-hermes
├── app/(dashboard)/       ← 40 rutas de producto
├── app/(public)/book/     ← reserva pública de citas
├── lib/gateway.ts         ← pasarela de pago (abstracción de proveedor)
└── prisma/                ← 13 migraciones
```

Y el **núcleo** vive aparte, congelado en v1.0.0:

```
onia-hermes/onia-core/   18 entidades · 9 módulos · 11 tracks verticales · 503 tests
```

**La consecuencia práctica:** para tener una plataforma con dos rubros **no hay que construir
una plataforma**. Hay que **encender la que está** y darle el segundo pack.

## 2. Los dos rubros del miércoles

| | Track del core | Estado en la app |
|---|---|---|
| **Dental** | `dentagest-clinical` | 🟢 Completo: 40 rutas, agenda, ficha, odontograma, pagos, reportes |
| **Importadora eléctrica** | `proveegest-electrico` | 🟡 Pack **recién declarado** en la capa de plataforma (98 tests verdes). **Sin UI propia** |

De los 11 tracks que declara el core, estos son los dos que importan ahora. Los otros 9
(estética, veterinaria, gastronomía, educación, turismo, construcción, ganadero, servicios
profesionales, general) están declarados en el contrato y **no** tienen pack en la app.

## 3. Estado real, módulo por módulo

Verificado contra código y contra la base de producción el 2026-07-30.

### 🟢 Construido y funcionando

| Módulo | Evidencia |
|---|---|
| **Capa de plataforma** | `lib/platform/**`, 98 tests verdes |
| **Producto dental** | 40 rutas; en prod: 24 pacientes, 24 citas, 15 facturas |
| **Núcleo Onia** | 9 de las tablas `onia_core_*` desplegadas en la base de producción |
| **Chatbot de WhatsApp entrante** | Menú que confirma y cancela citas de verdad, `gpt-4o-mini`, escalado a Chatwoot |
| **Reserva pública de citas** | `/book`, con confirmación por token |
| **Pasarela — abstracción** | `lib/gateway.ts`, tabla `gateway_configs`, modal de QR |
| **Landing** | Marca v2, planes, add-ons, ambos temas |

### 🟡 A medias — existe pero no sirve todavía

| Módulo | Qué le falta |
|---|---|
| **Pack importadora** | Declarado y provisiona, pero **sin pantallas, sin permisos por rol y sin entidades del rubro**. Un tenant eléctrico entra a un shell con menú vacío |
| **Aislamiento entre rubros** | Solo **2 de 40 rutas** validan vertical. El menú se filtra, la URL no → *en arreglo* |
| **Módulos del core sin portar** | `imports` (costeo de importación), `payroll` y `automation` **no están** en el repo del producto. El pack eléctrico los enciende como feature y detrás no hay lógica |
| **Cola de aprobación** | En producción: **1 work item, 0 aprobaciones**. Y aprobar **no dispara nada** |
| **Pasarela** | Tiene PagosNet y Circle. **BCP no existe** |

### 🔴 No construido, o bloqueado fuera del código

| Módulo | Estado |
|---|---|
| **Facturación fiscal SIAT** | **Mock.** Imprime *SIMULACIÓN — SIN VALOR FISCAL*. Bloqueado por NIT + homologación (caduca 1-oct-2026). **No se destraba programando** |
| **WhatsApp — conexión** | `WHATSAPP_PHONE_NUMBER_ID = SIN_CONFIGURAR`, tokens de 14 caracteres. El código está; el número no |
| **Módulo `agents`** | La tabla **no existe** en la base de producción |
| **Deploy** | **31 commits sin llegar a `master`**, que es lo que Vercel publica. `origin/master` es del 8-jul |
| **Entorno de desarrollo** | Apunta a producción. WSL y Docker sin instalar → `docs/DEV_LOCAL_SETUP.md` |

## 4. Cómo se conecta todo (lo que preguntó Sergio)

### 4.1 El pago y el alta automática — el eje del miércoles

```
Cliente elige plan en la landing
  → se crea la suscripción en estado PENDIENTE
  → se genera el cobro en la pasarela (QR o botón)
  → el cliente paga
  → [ ¿webhook del banco? ]  ← LA PREGUNTA QUE DEFINE TODO
  → se verifica la firma + se descarta si es repetido (idempotencia)
  → la suscripción pasa a PAGADA
  → provisionOrganization() da de alta el tenant con su pack vertical
  → el cliente entra a su cuenta ya lista
```

**El único eslabón que no existe es el webhook del BCP.** Todo lo demás —el provisioning con
pack, los entitlements, la config de pasarela por tenant— ya está construido.

**Si el banco no da webhook**, el alta no puede ser automática: hay que consultar por polling
(lento) o confirmar a mano. Eso cambia la promesa del producto y hay que decidirlo el
miércoles, no después.

### 4.2 El chatbot y WhatsApp

El chatbot entrante **está construido**: recibe, entiende con `gpt-4o-mini`, confirma y
cancela citas contra la base, y escala a un humano por Chatwoot.

Lo que falta es **enchufarlo**, y no es código:
1. Número de WhatsApp Business definitivo (bloqueo S3, depende de Sergio).
2. Alta en Meta Business + verificación del negocio.
3. `WHATSAPP_PHONE_NUMBER_ID` y `WHATSAPP_ACCESS_TOKEN` reales.
4. Cuenta de Chatwoot con `CHATWOOT_ACCOUNT_ID`.

**Para el pack eléctrico el chatbot sirve igual**, pero responde otra cosa: cotizaciones y
disponibilidad de stock en vez de citas. Eso sí es desarrollo, y no entra antes del miércoles.

### 4.3 La facturación

Hay **dos cosas distintas** que se venían mezclando:

- **Cobrarle a nuestro cliente** (la suscripción de Onia) → es lo del BCP. **Esto sí puede
  quedar listo.**
- **Que nuestro cliente le facture a los suyos** (factura fiscal al SIN) → necesita NIT y
  homologación. **Esto no depende de nosotros.**

Se puede lanzar cobrando y operando. Facturando fiscalmente, no.

⚠️ **Y antes de facturar en moneda extranjera hay que arreglar esto:**
`onia-core/logic/fx.logic.mjs:31` cae en silencio al tipo de cambio **6,96** si no le inyectan
el TCO del día. Con el oficial en **11,89**, emite una factura **41,5% subvaluada sin avisar**.

## 5. El plan a 6 días

### Lo que SÍ llega al miércoles

| # | Qué | Depende de |
|---|---|---|
| 1 | **Kit técnico de la reunión BCP** — qué pedir, qué preguntar, 3 escenarios | Nadie. *En curso* |
| 2 | **Aislamiento por vertical a nivel de ruta** | Nadie. *En curso* |
| 3 | **Pack importadora declarado y provisionando** | ✅ Hecho |
| 4 | **Entorno de desarrollo separado de producción** | **Sergio**: instalar WSL + Docker (reinicio) |
| 5 | **Arquitectura de cobro lista para enchufar el BCP** | Nadie |
| 6 | **Los 31 commits en `master` y desplegados** | Que 2 y 4 estén verdes |
| 7 | **Gate de roles arreglado** (recepción ve historia y no ve caja) | Nadie |

### Lo que NO llega, y por qué

| Qué | Por qué |
|---|---|
| **Facturación fiscal real** | NIT + homologación SIAT. Trámite, no código |
| **WhatsApp conectado** | Número + verificación de Meta. Depende de Sergio y de Meta |
| **Pantallas del rubro eléctrico** | Necesitan entidades nuevas y migraciones. No entra en 6 días con calidad |
| **Integración BCP terminada** | El miércoles recién se sabe qué expone el banco |

**Dicho claro:** el miércoles se puede llegar con la plataforma **operativa y cobrando**, con
dos rubros dados de alta y aislados. **No** con facturación fiscal ni con el pack eléctrico
usable por Bolivian Electric en su operación diaria. Eso es el paso siguiente, no este.

## 6. Lo que depende de Sergio, ordenado por urgencia

| # | Qué | Traba |
|---|---|---|
| **1** | **WSL + Docker** (`wsl --install`, reiniciar, luego Docker Desktop) | Todo lo que sea probar sin ensuciar producción |
| **2** | Confirmar quién firma con el banco — la titular legal es **Leslie Mercado Moreno**, no Sergio (`OniaAgency`, NIT 5371375010) | Si el BCP pide firma del titular, es mejor saberlo antes de la reunión |
| **3** | Número de WhatsApp Business definitivo | El chatbot y los mensajes de venta |
| **4** | NIT + homologación SIAT | Facturación real. **Caduca 1-oct-2026** |

---

Relacionado: `ONIA_PARQUEADO_20260730.md` (todo lo congelado) ·
`ONIA_DENTAL_ESTADO_REAL_20260727.md` (auditoría del producto dental) ·
`ONIA_TIPOS_DE_CAMBIO_BOLIVIA_20260730.md` (el bug del 6,96) ·
`DentaGest/dental-saas/docs/DEV_LOCAL_SETUP.md` (cómo separar dev de producción).
