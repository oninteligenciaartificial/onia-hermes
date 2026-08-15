# ONIA — Decisión de arquitectura y plan de arranque (UNA app)

> **Carril I (research/estrategia).** Fecha: 2026-07-23. Para pegar al Onia Core (orquestador).
> **DECISIÓN TOMADA — no reabrir.** Supersede el modelo de "puerta + SSO bridge + multi-dominio"
> del doc `ONIA_PLATAFORMA_UNICA_ESTRUCTURA_DESPACHO_20260723.md` (§1 dominio, §5 puerta separada):
> Sergio decidió UNA sola app, un dominio, un login. Este doc manda sobre ese punto.
> Docs hermanos vigentes en lo demás (foso Bolivia, costos, carriles técnicos, brief).

## 0. La decisión, como empresa

**Existe UN solo producto: la app Onia.** Un código, un dominio, un login. Adentro vive todo: el sistema/ERP, los rubros, el chatbot, la página web, los agentes. **No hay apps separadas, no hay puente SSO entre productos, no hay multi-dominio de producto, no se muda a ningún cliente de dominio jamás.**

**La app Onia NO se construye de cero: ES DentalGest evolucionado EN SU LUGAR.** DentalGest ya tiene ~80% del esqueleto de plataforma (multi-tenant/org, roles finos, módulos agenda/facturación/inventario, wizard `/setup`, cola `/pending`). Se GENERALIZA ese esqueleto; no se reescribe. Regla anti-runway y anti-rework a la vez.

- Hoy la app corre en **modo dental** (~90%).
- Se agrega la capa de **cuenta + selector de rubro** (buena parte ya existe en DentalGest).
- Los demás rubros (comercio, etc.) entran como **configuración** vía onia-core `verticalPack` — NO como otra app.
- **Chatbot, web y agentes** entran como **módulos dentro de la misma app**, encendidos por cuenta (entitlements).
- **onia-core** sigue siendo la fuente de verdad del contrato (en onia-hermes); la app usa la lógica ya portada. **SIAT emitter** (onia-hermes/integrations/siat) es un servicio compartido que la app llama. **Web Factory** arma los sitios de marketing, separados de la app.

El primer cliente entra a la app Onia en modo dental (alta a mano), y la plataforma crece debajo sin moverlo nunca. Cero reconstrucción, cero migración, cero segundo dominio.

## 1. Dominios (decidido)

| URL | Qué es | Cambia |
|---|---|---|
| **`app.onia.com.bo`** | **La app. Única. Permanente.** Internacional futuro = agregar `app.onia.app` apuntando a la MISMA app (redirect), nunca fragmentar | Nunca |
| `onia.com.bo` | Sitio público de Onia (la plataforma) | Nunca |
| `dentalgest.app` | Embudo de marketing dental (SEO "software dental") que **entra a la MISMA app**. Es un anuncio, no un producto | Nunca |

Marketing puede tener varios embudos; el PRODUCTO es UNA app en UN dominio. Costo cero (dominios ya en mano). **No comprar `onia.app` hasta LatAm real + cliente pagando + OK de Sergio.**

## 2. La cadencia de trabajo (regla dura por carril)

> **Estructura primero (spec completo del carril) → STOP → revisión/aprobación → construir → STOP → analizar → seguir.**
> Ningún carril construye sin su estructura terminada y aprobada. Ninguno avanza a otra cosa hasta cerrar lo suyo. Nada de "ya que estoy toco esto otro". Así no se reconstruye ni se re-decide.

**Flujo de despacho:** primero al **Onia Core (orquestador)** va **C0** (esqueleto maestro). Se termina y se aprueba. De ahí el orquestador abre los demás carriles en paralelo (repos/carpetas distintas = cero choque). Cada carril: worktree explícito → `git branch --show-current` → estructura → stop → build → gates (`tsc --noEmit`, e2e, review) → merge a `main` como árbol coherente que compila.

## 3. Los carriles (UNA app)

⭐ = ruta crítica al primer cobro. El repo de la app = el actual `C:\dev\proyectos\DentaGest\dental-saas` evolucionando a "app Onia" (no se abre repo nuevo; se evoluciona el que tiene el 90%).

| # | Carril | Quién | Repo / carpeta | Entrega (ESTRUCTURA primero, luego build) | Depende |
|---|---|---|---|---|---|
| **C0** ⭐ | **Esqueleto maestro** | Onia Core (orquestador) | onia-core (`contract.json`) + spec de la app | Define: mapa de rutas de la una-app, capa de cuenta/organización/rol, cómo el `verticalPack` configura módulos por rubro, cómo se encienden add-ons (entitlements), contrato con SIAT/agents. **Output = el spec que gobierna C1–C7. Se termina, STOP, se aprueba antes de construir.** | — |
| **C1** | Shell de plataforma | Agente | repo app | Cuenta + selector de rubro + navegación de "mis módulos" dentro de la app. Reusa org/roles/wizard existentes. Cargar `impeccable` + tokens web-factory antes de UI | C0 |
| **C2** ⭐ | Vertical dental (aspirina) | Agente | repo app + `onia-hermes/…/integrations/siat` | Emisor SIAT→endpoint (no reescribir) + migrar facturación a campos SIAT + agentes Recall/Cobrador en `/pending` + última milla. Módulos de la app | C0 · S2 (CUF prod) |
| **C3** | Add-ons como módulos | Agente | repo app + Web Factory | Chatbot (módulo agents), web (Web Factory integrada), presencia — adentro de la app, encendibles por cuenta | C1 |
| **C4** | Sala de agentes | Agente | `onia-hermes/web-factory/apps/site/…/onia-center` | Cola de aprobación / operación de agentes, integrada al modelo de la app | — (data existe) |
| **C5** | Infra / deploy | Agente (1 dueño) | VPS Easypanel `187.77.16.63` · n8n · Supabase | Deploy de la una-app (`app.onia.com.bo`) + workflows agentes + intake. n8n = Credentials, nada de `$env` | C0–C3 en `main` · S3 · S6 |
| **C6** | Presencia + venta | **Artur** | `dentalgest.app` funnel (`web-factory/apps/dentalgest-landing`) + `hermes-content/sales-kit` | Landing embudo (entra a la app) + kit de venta. Aislado, regla "termina y PARA hasta nuevo aviso" | — |
| **C7** | Research fiscal | Agente | `hermes-content/docs/research` | Cerrar `[VERIFICAR]` fiscales (grupo SIAT piloto, no-show BO, ticket Bs) + insumos S1. NO codea | — |

**Paralelo tras C0:** C1 · C2 · C4 · C6 · C7 (repos/carpetas distintas). C3 tras C1. C5 serial (un dueño). C2 es cadena serial interna (SIAT→facturación→agentes→última milla).

## 4. Disciplina de plata (no se negocia)

- **La plata no espera a que esté todo.** Se vende el **modo dental de la app apenas esté presentable** (~semana 2), mientras la plataforma sigue creciendo en paralelo.
- **Horas de Sergio = vender + destrabar trámites** (S2 NIT/creds SIAT, SEPREC matrícula, S1 precios). No codea. Los agentes y Artur construyen.
- Runway ~Bs 11.000 (~2,5-3 meses), piso Bs 4.000/mes, deuda Bs 4.000. Primer objetivo = 3-5 clínicas pagando (cobro a mano en Bs), empezando por los **warm leads que ya llamaron/escribieron**.
- Aspirina (facturar/operar/SIAT) antes que vitamina (web/chatbot). C2 es ruta crítica; C1/C3/C6 son aceleradores en paralelo, nunca el gate del cobro.

## 5. Lo que NO se hace hasta 1 cliente pagando

Si aparece antes, es la trampa (plataforma linda, cuarto vacío):
1. **Billing self-serve / metered post-pago.** Cobro a mano en Bs; crédito solo topa fair-use interno.
2. **Argentina / LatAm / countryPack implementado.** Solo se preserva el "socket" país-pluggable como invariante (columnas countryCode/currency/taxIdType, interfaz `FiscalEmitter`); nada de AFIP/ARCA sin lead AR pagando.
3. **Interfaz conversacional standalone estilo Dapta** (el meta-agente caro). Se reusa onia-center + `/pending` + intake. Fase 2.
4. **Voz como oferta** (cara, quema caja) · **capacitadora como negocio** · **Nuvia como retail** (solo dogfood).
5. **Comercio/GestiOS y otros rubros como oferta** antes de validar dental. Entran como config de la una-app cuando la #1 pague.

## 6. Cambio respecto a docs previos (para el orquestador)

Este doc **REVISA** la arquitectura: de "productos separados + puerta + SSO bridge + multi-dominio" (Opción B) a **UNA app, un dominio, evolución en el lugar de DentalGest** (Opción A pragmática). Motivo: decisión de producto de Sergio — un producto ganador es una sola app. El resto de los docs (foso Bolivia, costos de agentes, carriles técnicos N/D1/D2/D3, brief de decisión, disciplina de runway) sigue vigente; solo cambia que todo vive DENTRO de una app, no en apps enlazadas.
