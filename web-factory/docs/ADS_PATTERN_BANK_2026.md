# Ads Pattern Bank 2026 — qué está corriendo y qué copiamos

> Research 2026-08-06 con la **Meta Ad Library** en vivo (conector Ads MCP), no con blogs.
> Muestra: 367 anuncios activos de "automatiza tu negocio con IA" en MX/CO/AR/CL/PE + el
> nicho dental LatAm. El banco de carruseles orgánicos vive en `CAROUSEL_PATTERN_BANK_2026.md`.
>
> ⚠️ **La pauta sigue en pausa**: ninguna cuenta de ads tiene método de pago. Esto es el
> arsenal listo para el día que se active — y sirve IGUAL para el orgánico, porque el ángulo
> que gana pagando gana gratis.

---

## 1. Lo que la Ad Library dice HOY (no teoría)

### El nicho dental está casi vacío en LatAm

**Solo 5 anuncios activos** con "software para clínicas dentales" en 5 países. Casi todos son
**agencias de marketing vendiendo pacientes** (Odental Agency, DigLab, Agencia Despega), no
software. Dos lecturas:

- **Bueno:** el ángulo "sistema para tu clínica" está desocupado. No hay ruido.
- **Cuidado:** poca competencia también puede significar poca demanda vía ads. Por eso el
  orgánico + outreach van primero, y la pauta después de que algo convierta.

**El hook que repiten los que sí facturan:** `SOLO Para Clínicas Dentales` y
`¿Muchas Consultas, Pocas Cirugías?` — exclusión + dolor específico. No dicen qué venden.

### El nicho "IA para negocios" está saturado: 367 activos

Ángulos que dominan, en orden de frecuencia observada:

| Ángulo | Ejemplo real activo | Nuestra lectura |
|---|---|---|
| **Miedo competitivo** | *"Mientras tú respondes WhatsApp, tu competencia ya vende con IA"* | El más replicado. Funciona pero está gastado |
| **Curso / formación** | *"Crea Apps y Automatiza con IA: El Futuro es HOY"*, *"Domina la IA Hoy"* | Confirma que el mercado de cursos existe y paga |
| **Asesoría gratis** | *"Solicita una asesoría sin costo"*, *"Habla con un especialista"* | Lead magnet estándar; barato de copiar |
| **Vertical específico** | *"ChatGPT para Agentes Inmobiliarios"*, *"CRM Inmobiliario"* | **El más defendible.** Nicho > genérico |
| **Sistema completo** | *"Sistemas para negocios: ventas, stock, turnos e IA"* | Nuestro competidor directo de encuadre |

## 2. Lo que copiamos y lo que NO

**Copiamos la ESTRUCTURA, nunca la identidad:**

✅ **Exclusión en el hook** — "SOLO para clínicas dentales de Santa Cruz". Auto-selecciona y
sube relevancia.
✅ **Vertical antes que genérico** — "IA para tu negocio" compite con 367; "el sistema de tu
clínica" compite con 5.
✅ **Dolor con consecuencia** — el patrón `¿Muchas consultas, pocas cirugías?` traducido:
*"¿Muchos pacientes nuevos, pocos que vuelven?"*
✅ **CTA de conversación**, no de compra — en LatAm el B2B cierra hablando.

❌ **El miedo competitivo genérico** — está quemado y no es nuestra voz.
❌ **Urgencia falsa** ("el futuro es HOY", "últimos cupos").
❌ **Prometer resultados** ni testimonios inventados (regla dura + FTC).
❌ **"Obligatorio por ley"** sobre el SIAT — el Portal del SIN es gratis y cumple.

## 3. Los 4 ángulos Onia listos para producir

Cada uno es un carrusel orgánico Y un ad el día que haya pauta:

| # | Ángulo | Hook (slide 1) | Para quién |
|---|---|---|---|
| **A1** | Exclusión + dolor | "SOLO para clínicas dentales de Santa Cruz" | Cliente A dental |
| **A2** | El paciente que no vuelve | "¿Cuántos pacientes no volvieron este mes?" | Cliente A dental |
| **A3** | La silla vacía (número) | "Una silla vacía te cuesta Bs X al mes" | Cliente A cualquier rubro |
| **A4** | Web muerta | "Tu negocio factura. Tu web no existe." | Cliente B servicios |

## 4. Cuando se active la pauta — el orden correcto

1. **Nada de pauta a puerta fría.** Primero el ángulo gana en orgánico (leads con `?src=`).
2. **Amplificar lo que ya funcionó**, no adivinar: se paga el post que ya trajo reuniones.
3. **Presupuesto mínimo real:** la cuenta ONIA Ads (USD) permite desde **$1/día**; la
   personal (BOB) desde ~Bs 11/día. Empezar con $5/día × 7 días por ángulo.
4. **Motor DRY ya deployado** (cero gasto hasta activar) — ver memoria `meta-ads-engine`.
5. ⚠️ **El token USER vence 2026-09-05** → migrar a System User antes o el motor muere solo.

## 5. Datos de la cuenta (verificado 2026-08-06)

| Qué | Valor |
|---|---|
| Business Manager | **OniaAgency** `1451773736711697` |
| Cuenta de ads principal | **ONIA Ads** `1073680778314945` (USD, activa, MCP habilitado) |
| Cuenta secundaria | `679613631427810` (BOB, mínimo Bs 11,26/día) |
| Página FB | **Onia** `1140384625819526` (única, a nivel usuario) |
| **Método de pago** | ❌ **ninguna cuenta lo tiene** — bloqueo real de la pauta |
| **Página vinculada a la cuenta de ads** | ❌ **ninguna** (`ads_get_ad_account_pages` → vacío) |
| Campañas creadas alguna vez | **0** (`date_preset=maximum` → vacío). La cuenta está virgen |
| IG vinculado a ads | La API aún no lo expone para esta cuenta (rollout gradual de Meta) |

> **Re-verificado 2026-08-06 (segunda pasada, misma fecha).** Aparece un **segundo bloqueo que
> no estaba anotado**: la página *Onia* existe a nivel usuario pero **no está promocionada bajo
> la cuenta de ads**. Sin eso no se puede crear un creative (`object_story_spec` exige `page_id`
> de una página de la cuenta), aunque haya tarjeta. Son 2 trámites, no 1 — y el de la página es
> gratis y se hace hoy.

## 6. La primera campaña — lista para disparar el día que haya tarjeta

Nada de esto se puede crear hoy (faltan los 2 trámites). Queda escrito para que el día que se
destrabe sea copiar y pegar, no pensar.

**Trámites previos, en orden (Sergio):**
1. Vincular la página **Onia** `1140384625819526` a la cuenta **ONIA Ads** `1073680778314945`
   dentro del BM OniaAgency. Gratis, 5 min.
2. Cargar método de pago en esa cuenta (USD).
3. Migrar el token USER a **System User** — vence **2026-09-05** y se lleva el motor puesto.

**Estructura de la campaña 1 (la única que se lanza primero):**

| Nivel | Config |
|---|---|
| Campaña | Objetivo `OUTCOME_LEADS`, presupuesto a nivel ad set (no CBO con 1 ad set) |
| Ad set | Santa Cruz de la Sierra + 25 km · 25-55 · sin intereses (audiencia amplia: el catálogo es chico y el algoritmo aprende mejor) · optimización **conversaciones/mensajes** o `LEAD_GENERATION` |
| Presupuesto | **USD 5/día × 7 días** por ángulo (mínimo real de la cuenta: $1/día) |
| Anuncios | 2 creatividades del mismo ángulo, nunca 4 (con $5/día no hay señal para dividir) |
| Destino | `onia.com.bo/?src=ads-<angulo>` → lead al panel → Cal. **Sin `?src=` no se lanza** |

**Qué ángulo va primero:** el que ya haya traído un lead en orgánico. Si al momento de activar
no hay ninguno con señal, arranca **A2** ("¿Cuántos pacientes no volvieron este mes?") porque
es el vertical más desocupado según §1.

**Regla de corte a los 7 días:** si el costo por conversación supera ~USD 5, se apaga y se
cambia el ángulo — no se sube el presupuesto para "darle tiempo".

⚠️ Si la página no se vincula antes de cargar la tarjeta, la cuenta va a cobrar $0 pero
igual va a parecer "lista": el error recién aparece al crear el creative. Vincular primero.

---

Relacionado: `CAROUSEL_PATTERN_BANK_2026.md` (cómo se arma la pieza) ·
`hermes-content/docs/historial/ONIA_EJERCITO_INFLUENCERS_IA_PLAN_20260806.md` (quién la publica) ·
`ONIA_KIT_VENTA_DENTAL_20260727.md` (los guiones ya escritos) · memoria `meta-ads-engine`.
