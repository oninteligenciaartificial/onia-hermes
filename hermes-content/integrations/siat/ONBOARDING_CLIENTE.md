# Onboarding de cliente — Facturación SIAT con el sistema PROVEEDOR de ONIA

Runbook operativo de los pasos EXACTOS que hace un **cliente** (contribuyente con
su propio NIT) para empezar a facturar con el sistema de ONIA, **una vez que ONIA
tiene el sistema certificado como Proveedor** ante el SIN.

- Pieza técnica: `hermes-content/integrations/siat/` (emisor multi-tenant).
- Diseño completo del trámite: `onia-core/ONIA_SIAT_CERTIFICACION_PLAN_2026.md`
  (Fase 3 y sección 3, arquitectura).
- Esto **NO es asesoría fiscal**. Los labels marcados `[VERIFICAR en el portal]`
  deben confirmarse en pantalla contra el portal SIAT vigente
  (`siatinfo.impuestos.gob.bo`) al ejecutar el primer onboarding real.

> Precondición dura: este runbook aplica SOLO después de que ONIA obtuvo su
> **código de sistema** como Proveedor y pasó las Fases 1-3. Antes de eso no hay
> sistema que asociar. Estado del trámite ONIA: ver el plan citado, sección 4.

---

## 1. El modelo Proveedor en una frase

**Una sola certificación de ONIA habilita a N clientes.** ONIA registró UN sistema
ante el SIN como **Sistema Informático de Facturación de Proveedor**
(RND 102100000011, Art. 17). Cada cliente NO tramita su propio sistema: se
**asocia** al sistema ya certificado de ONIA y genera un **token delegado** que
autoriza a ONIA a emitir en su nombre.

Reparto de roles (RND Art. 34):

| Rol | Quién | Responsabilidad |
|---|---|---|
| **Emisor legal / sujeto pasivo** | El **cliente** (su NIT) | Responde por el tributo. La factura sale a su nombre, con su NIT. |
| **Proveedor del sistema** | **ONIA** | Responde por fallas de emisión del sistema. Emite técnicamente por cuenta del cliente. |

Consecuencia práctica: el cliente hace unos pocos pasos en el portal SIAT (asociar,
confirmar, generar token, configurar) y entrega a ONIA los datos abajo. ONIA hace
el resto (emisión, cola, contingencia, anulación).

---

## 2. Prerequisitos del cliente

Antes de empezar el onboarding, el cliente necesita:

1. **NIT activo en Régimen General.** El modelo Proveedor requiere que el emisor
   sea un contribuyente del Régimen General con obligación IVA vigente. (Régimen
   Simplificado / otros no emiten factura en línea de este modo.)
2. **Credenciales de SIAT en Línea** (usuario y contraseña de la Oficina Virtual /
   portal SIAT del NIT). El mismo login sirve para producción y piloto.
3. **Sin marcas de riesgo tributario activas** en su padrón (si las hay, el portal
   puede bloquear la asociación). `[VERIFICAR en el portal]` el mensaje exacto.

ONIA le pasa al cliente, para los pasos del portal:

- El **Nombre del Sistema** de ONIA (nombre comercial registrado ante el SIN).
- El **Código del Sistema** de ONIA (lo devolvió el SIN al certificar; es el que
  el cliente selecciona al generar el token).
- El **NIT Delegado** = el NIT de ONIA como proveedor (`5371375010`), que aparece
  como delegado del token. `[VERIFICAR en el portal]` que la columna use el NIT del
  proveedor y no otro identificador.

---

## 3. Pasos del cliente en el portal SIAT

Ruta en el portal (con el cliente logueado con SU NIT):

**Sistema de Facturación → Gestión de Autorización de Sistemas Informáticos de
Facturación → Gestor Token Delegado.**

`[VERIFICAR en el portal]` los textos exactos de menú (pueden variar por versión
del portal).

### Paso 1 — Asociar el sistema de ONIA al NIT del cliente

En **Asociación de Sistemas**, el cliente asocia el sistema de ONIA a su NIT y
**declara el tipo de servicio** de la relación contractual con ONIA:

- Opciones típicas de tipo de servicio: **licencia de uso**, **alquiler**,
  **servicio web (SaaS)** o **facturación por terceros**. `[VERIFICAR en el portal]`
  la lista exacta y cuál corresponde al contrato ONIA↔cliente (por defecto:
  servicio web / facturación por terceros).
- El cliente selecciona el sistema por su **Nombre del Sistema** / **Código del
  Sistema** de ONIA (datos que ONIA le entregó).

Resultado: queda registrada la relación proveedor-cliente.

### Paso 2 — Confirmar la asociación

El cliente **confirma** la asociación en el portal. Sin la confirmación, el token
delegado no puede generarse. `[VERIFICAR en el portal]` si la confirmación es un
paso aparte (botón "Confirmar") o queda implícita al asociar.

### Paso 3 — Generar el Token Delegado

En **Gestor Token Delegado** se abre la pantalla **"Token Delegados"**, con la
tabla de tokens existentes y estas columnas:

| Columna | Qué es |
|---|---|
| **NIT Delegado** | NIT de ONIA (el proveedor delegado). |
| **Nombre del Sistema** | Nombre del sistema de ONIA. |
| **Versión** | Versión del sistema de ONIA. |
| **Código del Sistema** | Código de sistema de ONIA (el que el cliente elige). |
| **Desde** | Inicio de vigencia del token. |
| **Hasta** | Fin de vigencia del token. |
| **Estado del Token** | Estado (activo / vencido / etc.). |

El cliente pulsa **"Generar Nuevo Token"** y:

1. Elige el **Código del Sistema** de ONIA (el que corresponde al sistema asociado
   en el Paso 1).
2. Define la **vigencia** (Desde / Hasta). `[VERIFICAR en el portal]` el plazo
   máximo permitido y si es renovable antes de vencer; ONIA debe agendar la
   renovación antes de la fecha "Hasta" para que no se corte la emisión.
3. Genera el token. **El valor del token se muestra una sola vez** (o se descarga):
   el cliente debe copiarlo y entregárselo a ONIA por un canal seguro (ver §5).
   `[VERIFICAR en el portal]` el mecanismo exacto de entrega del valor (pantalla,
   descarga, correo).

### Paso 4 — Configurar sucursales y puntos de venta

El cliente (o ONIA con los datos del cliente) registra en el portal las
**sucursales** y **puntos de venta** desde los que se emitirá:

- Convención SIAT: la **casa matriz** suele ser **sucursal código 0**.
- Cada punto de venta pertenece a una sucursal. `[VERIFICAR en el portal]` el
  catálogo de tipos de punto de venta (comisionista, ventanilla de cobranza, etc.).

Estos códigos alimentan el emisor de ONIA (`addSucursal` / `addPuntoVenta` en el
tenant registry) y viajan en el CUF de cada factura.

### Paso 5 — Homologar el catálogo de productos/servicios del cliente

El cliente entrega a ONIA su lista de productos/servicios. ONIA descarga el
**catálogo de productos/servicios del SIN** (por servicio web) y **homologa** cada
código interno del cliente a un **código genérico del SIN** (el catálogo distingue
nacional vs importado). El código SIN homologado viaja en el XML de cada factura.

- Sin homologación, la factura del ítem no valida.
- En el emisor: `registerHomologation` mapea
  `codigoInterno → { codigoProductoSin, unidadMedida, actividadEconomica }`.

---

## 4. Qué dato pide ONIA al cliente y quién hace cada cosa

Datos que ONIA recolecta del cliente (formulario de alta) y dónde caen en el emisor
(`src/tenant-registry.mjs`):

| Dato | Lo entrega | Lo usa ONIA para | Cae en |
|---|---|---|---|
| **NIT** y razón social | Cliente | Identidad del emisor legal en el CUF/XML | `buildTenant` (`emisor.nit`, `emisor.razonSocial`) |
| **Domicilio / municipio** | Cliente | Cabecera de la factura | `buildTenant` (`emisor.direccion`, `emisor.municipio`) |
| **Código del Sistema** (el de ONIA) | ONIA lo da; se confirma tras asociar | Ligar al sistema certificado | `setCodigoSistema` |
| **Token delegado (valor)** | Cliente (lo generó en el portal) | Autorización de emisión ante el SIN | Vault del VPS (ver §5); en el registry solo va la **metadata** vía `setTokenDelegado` |
| **Vigencia del token (Desde/Hasta)** | Cliente / portal | Agendar renovación; validar emisión | `setTokenDelegado` (`vigenciaDesde`, `vigenciaHasta`) |
| **Sucursales** (códigos, nombres, dirección) | Cliente | Emisión por sucursal; CUF | `addSucursal` |
| **Puntos de venta** (código, sucursal, tipo) | Cliente | Emisión por PdV; CUF | `addPuntoVenta` |
| **Catálogo de productos/servicios** | Cliente | Homologación contra catálogo SIN | `registerHomologation` |

Reparto de tareas:

| Tarea | Cliente | ONIA |
|---|---|---|
| Asociar el sistema al NIT (Paso 1) | **Sí** (en su portal) | Acompaña / instruye |
| Confirmar la asociación (Paso 2) | **Sí** | — |
| Generar el token delegado (Paso 3) | **Sí** | Da el Código del Sistema; recibe el valor |
| Registrar sucursales / puntos de venta (Paso 4) | Sí (o los datos) | Puede cargarlos y los replica en el registry |
| Homologar catálogo (Paso 5) | Entrega su lista | **Sí** (descarga catálogo SIN y mapea) |
| Emitir, cola, contingencia, anulación | — | **Sí** (todo automático) |

**Regla:** ONIA nunca le pide al cliente que ingrese credenciales en un sistema de
ONIA. El token lo genera el cliente en el portal oficial del SIN y solo comparte el
**valor resultante** por canal seguro.

Cuando el registry cumple NIT válido + código de sistema + ≥1 sucursal + ≥1 punto
de venta + token vigente, `validateTenantReady` marca el tenant **listo para
emitir**. Hasta entonces devuelve la lista de lo que falta.

---

## 5. Dónde se guarda el token (secreto)

El **valor** del token delegado (y las credenciales SIAT) viven **SOLO en el vault
del VPS**, **cifrados** y **por organización** (`orgId`). Reglas:

- **Nunca** en git, nunca en el core, nunca en el tenant registry en claro. El
  registry guarda solo **metadata**: `{ referencia, estado, vigenciaDesde,
  vigenciaHasta }`, donde `referencia` es el id del secreto en el vault
  (`setTokenDelegado` rechaza cualquier clave que parezca el secreto en claro —
  `valor`, `token`, `secret`, etc.).
- Variables de entorno del servicio: ver `.env.example` (`SIAT_TOKEN_DELEGADO`,
  `SIAT_USUARIO`, `SIAT_CODIGO_SISTEMA`) — se resuelven por organización desde el
  vault, no se hardcodean.
- Canal de entrega recomendado del valor del token: gestor de secretos / mensaje
  cifrado de un solo uso. Evitar correo/chat en claro.

---

## 6. Modalidad recomendada: Computarizada en Línea

ONIA arranca a los clientes en **Computarizada en Línea**:

- El XML lleva **hash/huella SHA-256** (más CUIS/CUFD/CUF), **NO exige certificado
  de firma digital** del cliente (RND Art. 7). Menos fricción: el cliente NO tiene
  que sacar certificado en AGETIC.
- La modalidad **Electrónica en Línea** (que sí requiere firma digital del sujeto
  pasivo, emitida por AGETIC) queda como fase 2, solo para clientes que la
  necesiten.

Por eso el onboarding de un cliente típico es solo: asociar → confirmar → token →
configurar → homologar. Sin trámite de firma digital.

---

## Checklist rápido de onboarding

- [ ] Cliente con NIT activo en Régimen General y credenciales SIAT en Línea.
- [ ] ONIA le pasó Nombre del Sistema + Código del Sistema + NIT Delegado.
- [ ] Paso 1: sistema de ONIA **asociado** al NIT (tipo de servicio declarado).
- [ ] Paso 2: asociación **confirmada**.
- [ ] Paso 3: **token delegado generado** (código de sistema correcto + vigencia);
      valor entregado a ONIA por canal seguro.
- [ ] Paso 4: **sucursales y puntos de venta** cargados (matriz = sucursal 0).
- [ ] Paso 5: **catálogo homologado** contra el catálogo del SIN.
- [ ] Token guardado **cifrado en el vault** (solo metadata en el registry).
- [ ] `validateTenantReady` = **listo** (sin faltantes) → emisión habilitada.
- [ ] Renovación del token agendada antes de la fecha "Hasta".
