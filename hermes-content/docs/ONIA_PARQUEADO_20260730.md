# Parqueado — todo lo que NO se toca hasta cerrar Onia Platform

> **2026-07-30.** Sergio declaró objetivo único: **Onia Platform**, con fecha al
> **miércoles 5 de agosto** (reunión BCP). Todo lo de abajo queda congelado a propósito.
>
> **Esto no es un backlog de deseos: es trabajo real, verificado, que quedó a mitad.**
> Cada ítem dice dónde está y qué falta, para poder retomarlo sin re-investigar.
>
> Regla: nada de acá se retoma hasta que Onia Platform esté operativa. Si aparece algo
> nuevo, se anota acá y se sigue.

---

## 1. Dental — venta (lo más caro de dejar parado)

**50 clínicas investigadas, con contacto público, las 50 sin contactar.**
`hermes-content/references/prospectos-clinicas-bolivia-2026.csv` — verificado 2026-07-27:
50 filas, todas en estado `Nuevo`. Cochabamba 20 · La Paz 13 · Santa Cruz 12 · resto 5.

**Kit de venta listo para ejecutar:** `hermes-content/docs/ONIA_KIT_VENTA_DENTAL_20260727.md`
— mensajes de WhatsApp copiar-pegar, guion de demo de 15 min, 10 objeciones con respuesta,
12 clínicas ordenadas para arrancar.

**⚠️ El kit necesita una corrección antes de usarse.** Cuatro respuestas a objeciones
(§1.3, §3.1, §3.2, §3.7) afirman *"la factura SIAT incluida en los 3 planes"* en presente,
cuando hoy es un mock que imprime *SIMULACIÓN — SIN VALOR FISCAL*. Corregir antes de mandar
un solo mensaje.

**5 leads tibios REALES que el kit no conoce.** Están en la base de producción, no en el
repo: **Ianclinic** (1 paciente, 1 cita, 2 usuarios) · **Mila dent** · **clinica uwu** ·
**Dr. Manzanillo** · **CLINICA CAMILA (DENTALGEST)**. Se registraron, cargaron 0-1 pacientes
y no volvieron. **Valen más que las 50 frías** — y saber por qué se fueron es lo más barato
que se puede aprender. Escribirles primero.

**Bloqueo de cobro:** no hay forma de cobrarle la suscripción a una clínica. La pasarela QR
del roadmap es para que *la clínica le cobre a sus pacientes*, no para cobrarle a la clínica.
→ Esto se resuelve solo si la reunión BCP también cubre el cobro de Onia.

## 2. Dental — producto

Informe completo: `hermes-content/docs/ONIA_DENTAL_ESTADO_REAL_20260727.md`.

- **31 commits sin llegar a `master`.** `origin/master` es del 8-jul-2026. Vercel despliega
  `master`, así que agentes, capa fiscal, tenant demo y alertas médicas **no están en prod**.
- **`localhost` escribe en la base de PRODUCCIÓN** (`kvepqgikokjlacxngkiw`). No se puede
  ensayar la demo sin ensuciar datos reales. *(Si Onia Platform sale del mismo repo, esto
  deja de estar parqueado y pasa a ser bloqueante — ver el plan del miércoles.)*
- **Gate de roles invertido:** `/patients` es `ALL_ROLES` y `/billing` es `ADMIN_ROLES`.
  Recepción ve la historia clínica y no ve la caja — al revés de lo que promete el guion.
  `components/layout/navigation.ts:24`.
- **Cola de aprobación vacía en prod:** 1 work item, 0 solicitudes. `/pending` sale en blanco.
- **Aprobar no envía nada:** `decideApproval` solo escribe estado, sin efectos externos.
- **Módulo `agents` no desplegado:** la tabla no existe en la base de producción.

## 3. Marca y web

- **Logo CERRADO:** tile 1:1 = fondo verde `#00D26A` + logo negro `#12100E`. Publicado en
  Instagram. `ONIA_MARCA_ESTRATEGIA_20260727.md` §2.4 — **no re-litigar**.
- **Marca v2 aplicada** a la web (header, footer, favicon, `/empezar`), en ambos temas.
- **Tipografía cerrada:** clase `.display` con Archivo variable.
  `web-factory/docs/TIPOGRAFIA_SISTEMA_20260727.md`.
- **4 patrones de scroll nuevos** (P15-P18) construidos y documentados, viven solo en la
  ruta demo `/patrones`. **Falta integrarlos a las secciones reales de la home.**
- **Pendiente de Sergio:** búsqueda SENAPI PI-112 (Bs 75, clase 42) — frena todo gasto de
  marca. Comprar `onia.co` mientras esté libre.

## 4. Bolivian Electric

- **Plan hasta diciembre 2026 listo:** `docs/product/plan-be-hasta-diciembre-2026.md` en el
  repo de BE. 3 capas, Bs 95.800 el escenario recomendado (capas 1+2).
  Pisos de negociación en archivo separado `INTERNO-plan-be-pisos-negociacion.md` —
  **nunca se manda al cliente**.
- **Material de CAINCO transcrito:** `hermes-content/docs/ONIA_REUNION_CAINCO_20260727.md`
  (18 fotos, 16 completas) y `docs/context/reunion-cainco-riesgo-cambiario-20260727.md` en BE.
- **Bloqueantes para presentar:** contraparte gerencial (hoy el interlocutor es el Jefe de
  Ventas y el plan es gerencial) · TC oficial del BCB del día de la firma · CxC y ventas a
  crédito reales (sin eso el argumento del DSO queda en estimación).
- **Pregunta gratis que hay que hacerle al despachante de BE:** qué TC de venta usó una DUI
  posterior al 4-jul. Cierra el único hueco fiscal grande (ver §5).

## 5. Fiscal — tipos de cambio

Doc: `hermes-content/docs/ONIA_TIPOS_DE_CAMBIO_BOLIVIA_20260730.md`.

- **Aduana** (DS 25870 art. 20): TC de **venta**, del **último día hábil de la semana
  anterior** a la aceptación de la DUI. Flexible desde el 4-jul-2026.
- **SIN** (RND 102600000026, 17-jul-2026): **TCO del día** de la transacción.
- **Consecuencia:** la misma mercadería se nacionaliza a un TC y se factura a otro.
- **TCO al 29-jul-2026: Bs 11,89.** Cambia todos los días; nunca citarlo de memoria.

**🔴 BUG ABIERTO, riesgo de plata:** `onia-core/logic/fx.logic.mjs:31` — `officialRate()`
cae en silencio al fallback **6,96** si no le inyectan el TCO. Con el oficial en 11,89 emite
una factura **41,5% subvaluada, sin error ni aviso**. Está fijado por tests, o sea que es
deliberado. En una ruta de plata el patrón correcto es fallar fuerte.
**Si Onia Platform va a facturar, esto DEJA de estar parqueado.**

**Brechas del core:** no existe entidad de tipos de cambio (ni tabla, ni serie de tiempo) ·
`journal_entry_lines` no tiene `currency` ni `exchange_rate` · `exchangeDifference` está
implementada y testeada pero huérfana (módulo equivocado, sin asiento, sin persistencia).

## 6. Otros carriles congelados

- **ONIA Center C4:** partir `operating-source.ts` (2.466 líneas) y `live-runtime.ts` (949),
  matar `onia-center.css` (5.366). Plan en `ONIA_C4_PLAN_REBUILD_REMANENTE_20260725.md`.
- **Rama `onia-colaboradores-sin-inversion-d69b19`:** 48 commits adelante, 78 atrás de `main`.
  Divergida. Trae el Estudio de Contenido (fases 0-3) y es prerrequisito para tocar el panel.
- **Canales de YouTube** (Onia Automatiza · Ciencia de tu Cuerpo), **Lucía**, contenido
  generativo: parqueados con gatillo en `ONIA_CATALOGO_MAESTRO_IDEAS_20260726.md`.
- **Higgsfield / generación paga:** en pausa por gasto.

## 7. Bloqueos que solo dependen de Sergio

| # | Qué | Qué destraba |
|---|---|---|
| S1 | Búsqueda SENAPI PI-112 (Bs 75, clase 42) | Gastar en marca / registrar |
| S2 | NIT + homologación SIAT | **Facturación real. Caduca 1-oct-2026** |
| S3 | Número de WhatsApp Business definitivo | Chatbot y mensajes de venta |
| S4 | Forma manual de cobrar el primer trimestre | Cerrar la primera venta |
| S5 | Contraparte gerencial en Bolivian Electric | Presentar el plan de BE |
| S6 | Token de Instagram | Publicación automática |

---

**Al terminar Onia Platform, el orden de retoma es:** §1 (vender, con la corrección del
SIAT hecha y empezando por los 5 tibios) → §2 (lo que quede sin cerrar) → §4 (presentar BE)
→ el resto.
