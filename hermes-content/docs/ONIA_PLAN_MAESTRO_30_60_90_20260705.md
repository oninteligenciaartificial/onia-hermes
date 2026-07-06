# ONIA — Plan Maestro 30/60/90 días (2026-07-05)

> Documento canónico de estrategia y ejecución. Objetivo: convertir el sistema
> que ya existe (web factory, DentalGest, GestiOS, n8n, contenido, vendedora)
> en ingresos recurrentes crecientes en 90 días.
> Fuentes: `ONIA_PROXIMA_SESION_PLAN_20260705.md` (backlog P/S/R/M),
> `PRICING_RATIONALE_INTERNO.md` (precios lanzamiento), CLAUDE.md (reglas),
> `ONIA_CATALOGO_PRECIOS_2026.md` (hoja canónica para cotizar).

---

## 1. Tesis del negocio (dónde está la plata)

1. **El margen vive en lo recurrente.** La web barata (Landing 790 / Web Pro
   1.500 Bs, fase sin portafolio) es el GANCHO. El negocio es: Cuidado Web
   (190-690/mes), GestiOS (350-1.250/mes), DentalGest (320-1.500/mes),
   Videos IA (2.200/mes). Regla de cierre: **cerrar la web → activar el
   mensual en la misma firma.**
2. **DentalGest es el producto escalable.** Self-service (landing → registro →
   pago QR → wizard → operando) = vender sin horas de Sergio. Planes
   390/890/1.990 Bs + Empresarial E1 (4.900 USD setup + 490 USD/mes).
3. **Bolivian Electric es el ancla Empresarial.** Un caso real cerrado y
   documentado calibra y justifica la línea E1/E2 (ancla TR4 ~USD 20k).
4. **El sistema ya está ~70% automatizado** (50 workflows n8n, prospección,
   radar, contenido, agenda). Lo que falta no es construir más: es DESTRABAR
   (S1-S9), CONECTAR (funnel completo) y VENDER todos los días.
5. **Portafolio = palanca de precio.** Con 3-5 casos publicados, los precios
   suben a línea premium (Landing 2.000 / Web Pro 4.500). Cada cliente de la
   fase barata es también un activo de marketing.

## 2. Metas numéricas (propuestas — Sergio valida, cf. S1)

| Métrica | Día 30 | Día 60 | Día 90 |
|---|---|---|---|
| Ingresos acumulados (Bs) | 6.000 | 16.000 | 30.000 |
| MRR activo (Bs/mes) | 1.500 | 4.500 | 9.000 |
| Webs entregadas (acumulado) | 3 | 7 | 12 |
| Mensuales activos (Cuidado Web/GestiOS/DentalGest) | 2 | 6 | 12 |
| Clínicas DentalGest pagando | 1 (manual) | 3 | 6 (self-service vivo) |
| Cliente Empresarial (E1) | propuesta enviada | negociación | 1 cerrado o pipeline 2+ |
| Casos en portafolio publicados | 2 | 4 | 5 → subir a precios premium |
| Propuestas enviadas/semana | 5 | 5 | 5 |
| Piezas de contenido/semana | 5 | 5 | 5 |

Regla: si al día 45 el MRR va a menos de la mitad del objetivo, la causa #1 a
auditar es el embudo (leads→propuesta→cierre→mensual), no el producto.

## 3. Los 4 motores de ingreso + 2 de combustible

| Motor | Qué vende | Quién opera | Carril |
|---|---|---|---|
| **M-WEB** Web Factory | Landing/Web Pro + Cuidado Web mensual | vendedora + Sergio cierra, agentes producen | B, C |
| **M-DENTAL** DentalGest | SaaS clínicas 390/890/1.990 + E1 | funnel self-service + demos Sergio | B (landing), D (producto) |
| **M-GESTIOS** GestiOS | SaaS operativo pymes 350-1.250/mes | instalación con ONIA Core | E |
| **M-EMP** Empresarial | E1/E2 (BE, TR4, landed cost) | Sergio/Arthur directo | F, G |
| **C-CONTENIDO** | autoridad + leads inbound IG/redes | Hermes skills (plan-semanal, carruseles, video) | H |
| **C-PROSPECCION** | leads outbound diarios calificados | n8n 09:00 + skill prospeccion + seguimiento | n8n |

---

## 4. FASE 0 — Semana 1 (días 1-7): destrabar y dejar el sistema de venta operativo

La semana más importante del plan. Casi todo lo comercial está bloqueado por
minutos de Sergio, no por trabajo técnico.

### Sergio (una sesión de ~1 hora destraba TODO)
- [ ] **S1** Validar precios v2 (pymes 390/890/1.990 + E1) → destraba P1, P4, R4.
- [ ] **S3** Pegar secret intake DentalGest en n8n (2 min) → circuito email completo.
- [ ] **S6** Token IG long-lived + Business Account ID → publicación IG automática.
- [ ] **S7** API keys Tavily + fal.ai (free tier) → prospección con fuentes.
- [ ] **S9** Cambiar password ONIA Center (higiene, 2 min).
- [ ] **S2** Iniciar trámite NIT (arranca ya: es el lead time más largo del plan).
- [ ] **S5** Avanzar verificación Meta (idem: lead time largo, destraba WhatsApp).
- [ ] Capturar chat ID de Arthur (escribir al bot) → todos los reportes a ambos.

### Agentes (carriles, en paralelo)
- [ ] **P1** Propuestas oficiales v2 (DentalGest + Empresarial E1/E2) generadas.
- [ ] **P2→P3** ONIA Center saneado (solo datos reales) — código listo.
- [ ] **P4** Landing captación DentalGest (keywords de dolor dental → CTA registro).
- [ ] **M1** Deploy saneamiento a VPS + cleanup 61 tareas (con OK humano).
- [ ] **M2** n8n autónomo: briefing + tendencias + cron prospección 09:00 +
      cron propuestas 12:00.

### Salida de la Fase 0 (checklist de "sistema de venta vivo")
Prospección diaria automática → pipeline con seguimiento → propuesta en <24h
con el generador → agenda Cal.com self-hosted → cierre → onboarding → mensual
activado. Si un eslabón falta el día 7, es la prioridad del día 8.

---

## 5. FASE 1 — Días 8-30: VENDER con lo que hay (no construir más)

Objetivo: primeros ingresos del plan + 2-3 casos de portafolio.

### Ventas (el trabajo diario, no negociable)
- Prospección: cron 09:00 genera candidatos → vendedora/Sergio aprueban
  contactos (`Apruebo contactar: <empresa>`) → 5+ contactos nuevos/semana.
- Rubros foco (señal de necesidad + capacidad de pago): clínicas dentales
  (DentalGest directo), restaurantes, inmobiliarias, estudios profesionales,
  comercios multi-sucursal. Santa Cruz primero, luego La Paz/Cochabamba.
- 5 propuestas/semana con el generador (`node generar-propuestas.js <slug> --pdf`).
- Oferta de entrada fría: Auditoría Express 250 Bs / Diagnóstico 690 Bs →
  convierte a Landing 790 → convierte a Cuidado Web mensual.
- **Toda web cerrada firma el mensual en el mismo acto.** Sin excepción.
- Seguimiento con cadencia (skill `seguimiento-prospectos-onia`): toque a los
  3 y 7 días; propuesta enviada → 48h y 5 días. Reporte de pipeline y
  atrasados a Arthur y Sergio.

### DentalGest (manual primero, self-service después)
- Cerrar la clínica #1 con demo manual (`Prepara venta DentalGest: <clinica>`)
  aunque el self-service no esté: el caso vale más que el funnel.
- Landing P4 publicada recibiendo tráfico (aunque el pago sea manual/QR directo).

### Contenido (combustible, no distracción)
- `Plan semanal ONIA` cada lunes; 5 piezas/semana (2 carruseles pack
  dark-product, 1-2 video, 1 historia). Publicación IG automática al tener S6.
- Ángulos que venden: antes/después de automatizar, errores que pierden leads,
  caso clínica dental, flujo IG/WhatsApp→Chatwoot→n8n.
- Cada cliente entregado = 1 caso de portafolio (con permiso) = 1 pieza.

### Empresarial
- **R3** Bolivian Electric fase 1: migrar inbox Chatwoot a SU VPS, cerrar y
  documentar ticket real → primer caso ancla; calibrar precios E1/E2.
- Enviar propuesta Empresarial E1 (de P1) al primer candidato real.

### Gate del día 30
- ≥ Bs 6.000 cobrados, 2 mensuales activos, 1 clínica DentalGest, 2 casos
  publicados. Si no: semana 5 = SOLO ventas (parar construcción, todos los
  carriles a soporte comercial).

---

## 6. FASE 2 — Días 31-60: PRODUCTIZAR (que el sistema venda solo)

Objetivo: DentalGest self-service completo + base recurrente creciendo.

### DentalGest self-service (prioridad #1 de la fase)
- **R4**: registro → pago QR/pasarela BCP → wizard `/setup` → clínica operando
  + org demo. Requiere S1 firme.
- Embudo medido: landing → registro → pago (instrumentar cada paso).
- Primeras 3 clínicas del funnel con onboarding asistido (aprender del wizard).

### GestiOS
- **R1** ONIA Core instalado en GestiOS → **R5** extraer paquetes `@onia/*`
  (solo después de que R1 pruebe los patrones).
- Vender GestiOS como el "nivel 3" de toda propuesta web (N3 = automatizar).

### Escalera de precios
- Al llegar a 3-5 casos publicados: **subir a línea premium** (Landing 2.000 /
  Web Pro 4.500) para clientes nuevos. Los precios de lanzamiento cumplieron
  su función.

### Operación
- WhatsApp→Chatwoot activo si Meta verificó (S5); si no, escalar el reclamo.
- **M3** limpieza n8n (reparar sendAdminEmail GestiOS) + **M6** backup cron.
- **S8** datos fiscales con contador → recordatorios fiscales activos.
- Facturación: avanzar SIAT (S2 en curso desde Fase 0).

### Gate del día 60
- Self-service DentalGest cobrando solo, ≥ 6 mensuales, ≥ Bs 16.000 acumulado,
  precios premium activos para nuevos.

---

## 7. FASE 3 — Días 61-90: ESCALAR (recurrente + Empresarial + decisión ventures)

Objetivo: MRR ≥ Bs 9.000 y decidir la próxima apuesta con datos.

- **Empresarial:** cerrar E1 #1 (BE como caso ancla + TR4). **M5** landed cost
  v1 (necesita S4: columnas de Saúl — pedirlas en Fase 1, no esperar).
- **DentalGest:** 6 clínicas; el funnel corre con pauta chica si el unit
  economics cierra (CAC < 3 meses de suscripción).
- **Ventas:** la vendedora opera el pipeline completo (prospección→propuesta→
  agenda) con Sergio solo en cierres y técnico. Comisiones claras (catálogo).
- **Ventures (carril I decide con datos, no con entusiasmo):** importadora
  automatizada (cruza M5/TR4) vs motor de venta diaria vs storefront tipo
  Nuvia. Regla: el que gane tiene carril propio; los otros se archivan con
  fecha de revisión.
- **Radar → WorkItem (M4)** activo cuando exista org ONIA con intake (R1/R2+S3).
- Contenido: duplicar lo que funcionó (mirar métricas de 60 días, no gustos).

### Gate del día 90
- MRR ≥ Bs 9.000, 12 mensuales, 1 Empresarial cerrado o 2 en pipeline,
- 5 casos portafolio, precios premium consolidados,
- decisión de venture tomada y documentada.

---

## 8. Cadencia operativa (el ritmo que sostiene todo)

| Cuándo | Qué | Quién |
|---|---|---|
| Diario 08:00 | Briefing agenda + prioridades (n8n → Telegram) | Hermes |
| Diario 09:00 | Cron prospección: candidatos calificados | n8n + aprobación |
| Diario 12:00 | Cron propuestas: borradores de seguimiento | n8n |
| Diario (tarde) | Ventana comercial 14:00-20:00 (Cal.com) | Sergio/Arthur/vendedora |
| Lunes | `Plan semanal ONIA` (contenido) + `Plan Semana` (operación) | Hermes + Sergio |
| Miércoles | Revisión pipeline: atrasados y estancados (`Seguimiento ONIA`) | vendedora + Sergio |
| Viernes | Cierre semanal: números vs metas §2, a Arthur Y Sergio | Hermes |
| Mensual | Revisar precios, churn de mensuales, gate de fase | Sergio + Arthur |

## 9. Tablero de KPIs (medir poco, medir siempre)

Embudo: leads nuevos/sem → contactados → reuniones → propuestas → cierres →
**mensuales activados** (el KPI rey) → MRR → churn.
Contenido: piezas publicadas/sem, seguidores IG, leads inbound.
Producto: registros DentalGest, conversión landing→pago, clínicas activas.
El cierre del viernes reporta estos números contra la tabla §2. Sin excusas
narrativas: número, delta, causa, acción.

## 10. Reglas de oro (violarlas = perder plata)

1. El mensual se firma junto con la web. Siempre.
2. Nunca cotizar fuera del catálogo canónico (`ONIA_CATALOGO_PRECIOS_2026.md`).
3. Propuestas SOLO con el generador. Nunca HTML a mano.
4. Plantillas internas = confidencial.
5. No fabricar datos de clientes; pedir o marcar lo que falta.
6. Aprobaciones literales para publicar/contactar (skill `aprobaciones-onia`).
7. Dominio, hosting y terceros: siempre a cargo del cliente.
8. Construir solo lo que un cliente pagando necesita. Lo demás va al backlog.
9. Infra (n8n/VPS/DB) = un solo dueño a la vez (carril G).
10. Reportes y avisos SIEMPRE a Arthur Y Sergio.

## 11. Riesgos principales y mitigación

| Riesgo | Señal | Mitigación |
|---|---|---|
| Construir en vez de vender | semana sin propuestas enviadas | gate día 30: semana 5 solo ventas |
| Bloqueos S* eternos | S1/S3/S6 sin cerrar en semana 1 | sesión única de destrabe + recordatorio diario |
| Web barata sin mensual | cierres sin recurrente | regla de oro #1; comisión de vendedora atada al mensual |
| Meta/WhatsApp no verifica | S5 estancado >30 días | operar con Telegram+IG+llamadas; WhatsApp manual |
| Churn de mensuales | cancelaciones mes 2 | Cuidado Web con entregable visible mensual (reporte) |
| Dispersión de ventures | empezar a codear ideas nuevas | todo pasa por carril I con doc de decisión |
| Único punto humano (Sergio) | pipeline muere si Sergio no está | vendedora dueña del pipeline; Hermes automatiza seguimiento |

## 12. Mapa de dependencias (camino crítico)

```
S1 precios ──→ P1 propuestas enviables ──→ ventas Fase 1
           └─→ P4 landing ──→ R4 self-service ──→ DentalGest escala (Fase 2)
S3 secret ──→ intake email DentalGest completo
S6 token IG ──→ publicación automática ──→ contenido H a full
S2 NIT ──→ SIAT ──→ facturación formal (lead time largo: arrancar YA)
S5 Meta ──→ WhatsApp→Chatwoot ──→ atención automatizada
P2/P3 código ──→ M1 deploy ──→ panel limpio ──→ M2 n8n autónomo
R1 GestiOS core ──→ R5 paquetes @onia/* ──→ instalar rápido en próximos SaaS
R3 BE fase 1 ──→ caso ancla Empresarial ──→ cerrar E1 (Fase 3)
S4 columnas TR4 ──→ M5 landed cost ──→ venture importadora (decisión Fase 3)
```

---

*Revisión de este plan: cada gate de fase (día 30/60/90) o antes si un número
se desvía >50%. Editar este archivo, no crear otro plan paralelo.*
