# ONIA Catalogo Comercial 2026 — EL MAPA UNICO DE VENTA (v2)

Fecha: 2026-07-04 (v2 — repricing con ancla real TR4 ~USD 20.000).
Estado: documento maestro de empaquetado. Manda sobre lo comercial.
Owner: ONIA / Sergio.

## 0. Las reglas que ordenan todo

```text
1. ONIA Core NO SE VENDE. El cliente compra EL SISTEMA DE SU RUBRO.
2. LO QUE LA EMPRESA NECESITA VA DENTRO DEL PLAN.
   Extra SOLO si: (a) tiene costo por uso de terceros (WhatsApp API,
   creditos IA, pauta), (b) es infraestructura dedicada, o (c) es
   desarrollo a medida. Nada mas es extra.
3. Ancla de mercado: TR4 costo ~USD 20.000 (pago unico, software muerto).
   ONIA compite con MAS valor vivo por el mismo orden de precio total,
   o entrada mensual sin barrera.
4. Pymes se cobran en Bs (mensual/anual). Enterprise se cotiza en USD
   (como cotizan los ERP en Bolivia).
5. Anual = 10 meses (2 gratis). Nunca pago unico sin mensualidad: el
   pais cambia cada mes (RNDs, dolar) y mantenerse legal ES el servicio.
```

## 1. El portfolio

| # | Producto | Rubro | Estado venta |
|---|---|---|---|
| 1 | **DentalGest** | Clinicas dentales | ✅ vender YA |
| 2 | **ProveeGest** | Importadoras/distribuidoras B2B | ✅ via ONIA Empresarial (BE = caso fundador) |
| 3 | **GestiOS** | Pymes servicios/comercio | ✅ vender |
| 4 | Ganadero OS | Agro | ⏸️ pausado (decision) |
| 5 | Webs ONIA | Todos | ✅ puerta de entrada |
| — | ONIA Core | motor interno | ❌ nunca se vende solo |

## 2. Planes pymes (Bs/mes por sucursal — TODO INCLUIDO por nivel)

Anual = x10 (2 meses gratis). Precios de LISTA nuevos; los precios de
lanzamiento vigentes (Dental 320/750/1500, GestiOS 350-1250) se respetan a
quien cierre antes del 31-jul-2026 y quedan congelados 12 meses.

| | **ORDENADO** | **PROFESIONAL** | **EMPRESA** |
|---|---|---|---|
| Precio | **Bs 390/mes** (anual 3.900) | **Bs 890/mes** (anual 8.900) | **Bs 1.990/mes** (anual 19.900) |
| Promesa | "Sabes que pasa" | "Ningun cliente se escapa" | "Controlas sin estar encima" |
| Panel del dueno + pendientes con responsable | ✅ | ✅ | ✅ |
| Agenda + clientes + historial | ✅ | ✅ | ✅ |
| Usuarios | 3 | 8 | 20 |
| Canales registrados (correos/tel) -> intake automatico | — | ✅ | ✅ |
| Roles finos (caja no ve lo clinico, etc.) | — | ✅ | ✅ |
| Comentarios + documentos/consentimientos | — | ✅ | ✅ |
| **Contador Pack** (RCV + vencimientos NIT + radar normativo) | — | ✅ **INCLUIDO** | ✅ INCLUIDO |
| Inventario basico (stock, minimos -> pendiente reponer) | — | ✅ | ✅ |
| **Inventario detallado** (multi-almacen, lotes/vencimientos, kardex promedio ponderado, conteos fisicos) | — | — | ✅ |
| Aprobaciones (descuentos/anulaciones) + SLA + escalamiento | — | — | ✅ |
| Multi-area/sucursal (hasta 3) + vistas por rol | — | — | ✅ |
| **Chatbot WhatsApp** (escalera N1/N2/N3 — ver §4) | add-on | add-on | add-on |
| **Facturacion SIAT en linea** (al certificar) | — | +Bs 190/mes | ✅ INCLUIDO* |
| Soporte | correo | WhatsApp habil | prioritario |

(*) Facturacion SIAT: incluido el software (activo al certificar); los costos POR
USO de terceros van aparte por regla 2. El chatbot WhatsApp NO va incluido en el
plan: se cotiza como add-on por nivel (§4) — su setup es entrenar el bot y la IA
es costo por uso (excepciones a+c de la regla 2). Implementacion unica: Ordenado
Bs 490 / Profesional Bs 1.490 / Empresa Bs 3.900 / Grupo Clinico desde Bs 5.900
(carga guiada + wizard + capacitacion).

### 2.1 Grupo Clinico (4o nivel Bs — grupos/franquicias)

Para clinicas con varias sucursales que quieren manejar el grupo como una sola
operacion, sin pasar aun al modelo gestionado en USD.

- **Precio**: Bs 3.900/mes (anual 39.000) · lanzamiento 2.900 congelado 12m.
- **Promesa**: "todas tus clinicas como un solo grupo".
- **Sobre Empresa**: sucursales ILIMITADAS incluidas (sin el +490/suc) + panel de
  grupo (consolidado + comparativa entre sucursales) + facturacion SIAT por
  sucursal (codigo propio) + usuarios ilimitados + soporte prioritario del grupo.
- Sigue self-serve (el cliente opera). El salto a "ONIA opera + infra dedicada +
  puentes a otros sistemas" es ONIA Empresarial (§3, USD).
- Implementacion desde Bs 5.900 (estimado por nº de sucursales — a confirmar).

## 3. ONIA EMPRESARIAL (enterprise, cotizado en USD — ancla TR4 $20k)

El modelo Bolivian Electric productizado. Para empresas robustas que
"quieren ver absolutamente TODO": multi-sucursal real, sistemas propios,
gerencia exigente.

**TODO INCLUIDO** (nada de add-ons): Empresa completo + infraestructura
dedicada (su VPS gestionado o on-premise con backups verificados) + puentes
de solo-lectura a sus sistemas (patron TR4/SQL Server/planillas) +
automatizaciones a medida en n8n (tipo de cambio -> reprecios con
aprobacion, radar normativo del rubro, correos multi-sucursal ruteados) +
**Hermes ejecutivo por Telegram** (gerencia consulta y ordena: /pendientes,
/crm, /tarea) + bot WhatsApp con IA + SLA de vendedores con aviso a
gerencia + usuarios ilimitados + gestion mensual ONIA (operamos,
monitoreamos, actualizamos ante cada RND).

| Escala | Implementacion (unica) | Suscripcion |
|---|---|---|
| **E1** (1 empresa, hasta 3 sucursales, 1 puente) | **USD 4.900** | **USD 490/mes** o USD 4.900/ano |
| **E2** (multi-sucursal amplio, 2+ puentes, reprecios) | **USD 8.900** | **USD 790/mes** o USD 7.900/ano |
| **E3** (a medida: integraciones profundas, modulos propios) | desde USD 14.900 | desde USD 1.190/mes |

**El pitch contra el ancla**: "TR4 te costo $20.000 y quedo congelado en el
tiempo. Por menos de la mitad de entrada tenes un sistema VIVO: se actualiza
con cada RND del SIN, se adapta al dolar de cada dia, tu gerencia lo maneja
desde Telegram, y si mañana cambia la ley, nosotros ya lo cambiamos. Y si
preferis, entras sin los $20.000: USD 490 al mes." TCO 3 anos E1 ≈ USD
22.500 — misma liga que TR4, valor incomparable.

Regla: BE fase 1 define el precio ancla REAL; estos numeros se calibran con
su ticket al cerrar.

## 4. Extras legitimos (los UNICOS, por la regla 2)

| Extra | Por que es extra | Precio |
|---|---|---|
| **Chatbot WhatsApp N1** (recordatorios, sin IA) | automatizacion configurable | Bs 300 setup + 200/mes |
| **Chatbot WhatsApp N2** (IA responde+capta) ⭐ | trabajo de entrenar el bot + IA por uso | Bs 1.500 setup + 550/mes + Meta |
| **Chatbot WhatsApp N3** (IA opera) | automatizacion avanzada a medida | desde Bs 3.500 setup + 900/mes + Meta |
| Conversaciones WhatsApp API (Meta) | costo por uso de tercero | al costo + 20% gestion |
| Creditos IA de alto volumen (bot avanzado) | costo por uso | al costo + 20% |
| Web del negocio + Cuidado Web | producto aparte (puerta de entrada) | 790-2.900 + 190-690/mes (vigente) |
| Sucursal adicional (pymes, >3 en Empresa) | infraestructura/uso | Bs 490/mes c/u |
| Desarrollo a medida fuera de alcance | ingenieria dedicada | cotizado (USD 60/h referencia interna) |
| Videos/contenido IA | servicio creativo | pausado (regla vigente) |

## 5. Terminar el desarrollo — el TODO priorizado

Lo que las empresas necesitan vs donde estamos:

| Necesidad | Estado | Que falta | Cuando |
|---|---|---|---|
| Columna vertebral (pendientes, canales, aprobaciones, panel) | ✅ 9/9 en DentalGest | replicar a GestiOS con la install guide | Q3 |
| Contador Pack (RCV, vencimientos, radar) | ✅ construido | precio ya definido: INCLUIDO desde Profesional | listo |
| Automatizaciones (FX diario, radar normativo) | ✅ vivas en n8n | radar -> WorkItem automatico via intake | Q3 |
| **Inventario MUY detallado** | basico en Dental/GestiOS | multi-almacen, lotes/vencimientos, kardex promedio ponderado (norma BO), conteos fisicos, integracion landed-cost | **Q3 — siguiente sprint grande (GestiOS/ProveeGest)** |
| Bots WhatsApp | patron BE construido | productizar: config por org (ya hay whatsappAddon + wizard) | Q3 |
| **Facturacion SIAT** | gated | certificacion proveedor (prerequisito: NIT ONIA) | **Q3 — antes del 30-sep** |
| Hermes en productos | 5 integraciones disenadas | /tarea y /dentalgest primero (usa intake vivo) | Q3 |
| **Contabilidad** | estrategia 4 capas | capa 3 lista (Contador Pack); estados financieros basicos (balance de comprobacion exportable) en Empresa+; contabilidad plena SOLO si un segmento la paga (capa 4, 2027) | Q4 eval |
| Puentes a ERPs (TR4-style) | disenado (planillas/tunel) | primera implementacion real con BE | con BE |

Regla de foco: NO abrimos contabilidad plena ni rubros nuevos hasta que
DentalGest venda, BE cierre fase 1 y la certificacion SIAT este en tramite.

## 6. Proceso de venta y orden de ejecucion

```text
Entrada por dolor del rubro -> demo org demo -> plan 1-2 + implementacion
-> mes 2-3 upgrade natural -> empresas robustas: consultoria -> Empresarial
```

1. DentalGest venta directa YA (cuota 90d).
2. BE fase 1 cerrado = nace ONIA Empresarial con precio ancla real.
3. GestiOS con contadores aliados (35% primera mensualidad + Pack gratis).
4. Certificacion SIAT antes del 30-sep (deadline legal = pitch).
5. Sprint inventario detallado (habilita ProveeGest completo).

## Decisiones abiertas (Sergio)

- [x] Validar lista nueva pymes (390/890/1.990) y ventana de lanzamiento 31-jul.
      **RATIFICADO por Sergio 2026-07-05**: lista v2 oficial; quien cierre antes
      del 31-jul-2026 mantiene 320/750/1.500 congelado 12 meses.
- [x] Validar bandas Empresarial — **RATIFICADO PARCIAL 2026-07-05**: E1
      (4.900 + 490/mes) ofertable desde hoy; E2/E3 quedan como referencia y se
      calibran con el cierre de BE fase 1 (no firmar E2/E3 sin recotizar).
- [ ] Ganadero OS: pausa formal o rescate.
- [ ] Iniciar tramite NIT ONIA (prerequisito SIAT).
