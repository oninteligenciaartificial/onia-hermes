# ONIA — Tablero (2026-07-09)

Snapshot honesto de dónde está cada frente post-core. Nada flotando: cada ítem
abierto tiene DUEÑO y CONDICIÓN DE DESTRABE exacta. Reemplaza cualquier lectura
de memoria sobre "qué falta".

## ✅ Cerrado y en `main`

| Qué | Estado |
|---|---|
| **ONIA Core** | v0.7.0: 18 entidades, 6 módulos (commerce/knowledge/accounting/invoicing/payroll/dental), 11/11 rubros del roadmap definidos, capa plan-por-negocio, mecanismo anti-drift (`PORTABLE_ARTIFACTS.json`). 322 tests, 4 validadores verdes. |
| **DentaGest** | Primer producto con adopción COMPLETA del core: R2/R4/R6 cerrados (commit `96b89a9` en su repo). Su port v0.6.2 verificado vigente. |
| **Emisor SIAT (bootstrap)** | `hermes-content/integrations/siat/`: constantes + máquina de estados de emisión + contrato de payload normalizado. 32 tests. Servicio separado (external_gate del core). |
| **Trámite SIAT aclarado** | El SEPREC NO bloquea el registro del sistema; regla de 90 días documentada. Fuentes oficiales en `onia-core/ONIA_SIAT_CERTIFICACION_PLAN_2026.md`. |

## ⏳ Esperando a Sergio (acción humana, destraba lo de abajo)

| # | Ítem | Acción EXACTA | Destraba |
|---|---|---|---|
| S1 | ~~**Padrón SIAT (Fase A)**~~ | ✅ **CUMPLIDO 2026-07-09** (padrón verificado). NIT `5371375010` (empresa unipersonal, Santa Cruz II), Régimen General, ACTIVO, sin suspensiones, IVA vigente. **Actividad software CONFIRMADA y es la PRIMARIA**: 4651200 venta de programas de informática + 6209920 servicios en la nube + 6312000 portales web. Todos los requisitos del Art. 19 cumplidos. | ✅ Registro del sistema SIAT desbloqueado |
| **S1b** | **⚠️ FISCAL — calendario ya corre** | Desde 03/06/2026 hay obligaciones VIGENTES: IVA (F200) + IT (F400) + RC-IVA agente retención (F608) **primer vencimiento 13/08/2026** (día 13 = NIT termina en 0); IUE (F500) anual 30/04/2027. Aunque sea SIN MOVIMIENTO hay que declarar o es multa por deber formal. Definir quién declara (contador humano o el Contador Pack). Desbloquea el playbook `ONIA_OPTIMIZACION_FISCAL_PROPIA_2026.md` (otro carril, estaba esperando estos datos). | Evitar multas + crédito fiscal IVA |
| S2 | **Habilitar facturación en línea** | El padrón muestra "Modalidad Facturación: COMPUTARIZADA EN LÍNEA - **PENDIENTE**". Completar la habilitación de la facturación en línea del NIT en la Oficina Virtual. Es la modalidad correcta (sin cert digital). | Facturar ventas propias de ONIA |
| S3 | **SEPREC** | Solo esperar la aceptación (ya en trámite). NO bloquea nada del SIAT. | Formalización, no el SIAT |
| S4 | **GestiOS DATABASE_URL** | Conseguir la `DATABASE_URL`/`DIRECT_URL` de GestiOS (Vercel env del proyecto o su Supabase). Sin esto no se puede correr `prisma migrate status`. | GestiOS R1 (Sprint 0) |
| S5 | **Registro sistema SIAT (Proveedor)** | Con S1 ✅, abrir el registro del sistema como Proveedor / Computarizada en Línea SOLO cuando el emisor técnico esté listo para pruebas. **Arranca los 90 días** — no abrirlo antes. | Fase 1 de pruebas piloto |

## 🔜 En otra sesión (otro repo — kickoff listo, no se hace desde el carril onia-core)

| Carril | Ítem | Arranque | Gate |
|---|---|---|---|
| **D** DentaGest | **R7**: adoptar el módulo `dental` (6 entidades: perio_chart, treatment_plan, informed_consent, medical_alert, dental_lab_case, tooth_image) | Abrir sesión en `C:\dev\proyectos\DentaGest\dental-saas`, pegar sección 3 de `ONIA_SESION_KICKOFFS_20260705.md`. Portar con la receta anti-drift (guardar sha256). | typecheck + tests verdes, push master |
| **E** GestiOS | **R1**: adoptar el core como columna vertebral | Tras S3 (URL): abrir sesión en `C:\dev\proyectos\Gestios`, pegar sección 4. Sprint 0 = sanear baseline (confirmado sucio). | tests verdes en GestiOS + `validate.mjs` verde |

## 🧊 Congelado a propósito (NO es olvido — hay criterio de descongelamiento)

| Ítem | Por qué congelado | Se descongela cuando |
|---|---|---|
| **Módulos de rubro sin construir** (estética/veterinaria/gastronomía/construcción entities; ganadero) | Regla: no construir producto/entidad especulativa sin cliente real. Están DEFINIDOS (track+pack+catálogo de gaps), no construidos. | Aparece un cliente real pagando de ese rubro. |
| **SIAT: cliente SOAP + builder XML/XSD + tenant registry** | SOAP/XML necesitan los WSDLs/XSD del piloto; el tenant registry (config multi-negocio: NIT/sucursales/tokens delegados por org) depende de cómo funcione la asociación y el token delegado en el SIAT real. Los tres = especular sin ver el piloto = retrabajo. Hoy hay UN solo emisor real (ONIA), no hace falta agenda multi-tenant todavía. | Acceso al piloto → se ven WSDLs/XSD + el flujo real de asociación/token. |
| **CUF: endurecer `buildCuf`** (ancho invoiceNumber 8-vs-10, pesos mod-11) | El core (`invoicing.logic.mjs`) lo tiene con advertencias explícitas; cambiarlo sin el `GENERACION-CUF.pdf` oficial es peor que dejarlo marcado. Los anchos ya son configurables → el fix será de una línea. | Se obtiene el Anexo Técnico oficial (viene con la doc del piloto/registro). |
| **Ley 1.733 (IVA) y DS 5563 (facturas deducibles) en el seed contable** | Reformas fiscales cuya mecánica exacta / reglamento no está confirmado. No tocar fórmulas ya probadas sin el texto reglamentario. | Se confirma el reglamento con fuente oficial. |

## El único camino crítico

```
S1 (Sergio: padrón, gratis, hoy)  ─┐
                                    ├─→ S4 (registrar sistema) ─→ Fase 1 pruebas piloto ─→ ... ─→ SIAT en producción
Emisor técnico (dev, en curso)  ───┘        (arranca 90 días)      (necesita WSDLs del piloto)
```

Todo lo demás (GestiOS, DentaGest R7, módulos de rubro) es paralelo e
independiente del SIAT. El SIAT es la palanca de negocio #1 y su único cuello de
botella hoy es S1 (una verificación gratis de Sergio en la Oficina Virtual).
