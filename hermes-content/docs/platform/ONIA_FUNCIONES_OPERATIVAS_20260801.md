# Onia Platform — qué funciona HOY y qué falta por rubro

> **2026-08-01 (noche).** Contra el contrato del core (v1.0.0, 21 capacidades, 11 rubros)
> y el código en producción — no de memoria. Se actualiza al encender cada rubro.

## 1. Capacidades del contrato: estado real en el producto

| Capacidad | Estado | Dónde vive |
|---|---|---|
| Tenant y organización | ✅ en prod | alta self-service multirubro por `provisionOrganization` |
| Equipo, roles y permisos | ✅ en prod | roles finos (recepción no ve historia clínica) |
| Clientes/contactos | ✅ en prod | pacientes (dental) · clientes (comercio) |
| Tareas y pendientes (work items) | ✅ en prod | espejo del core, máquina de estados alineada |
| Evidencia y auditoría | ✅ en prod | actividad por organización |
| Alertas y reportes | ✅ en prod | reportes + alertas médicas dental |
| Import/export de datos | 🟡 parcial | módulo `imports` portado con tests; CSV exports; falta UI de importación |
| Agenda, citas y recordatorios | ✅ en prod (dental) | agenda + booking público + recordatorios |
| Aprobaciones internas | 🟡 encendida | tablas+flags on; falta que el cron genere las primeras propuestas |
| Catálogo e inventario | ✅ en prod | insumos dental · kardex valorado comercio (FEFO/conteos: lógica lista, sin UI) |
| Ventas y caja | ✅ en prod | facturación dental · caja comercio con corte |
| **Contabilidad Bolivia** (transversal) | ✅ en prod HOY | `/contabilidad`: RCV ambos rubros, IVA 13%/IT 3%, calendario NIT, balance |
| Agentes IA (human-in-the-loop) | 🟡 encendida | runtime on; propone→aprueba; falta seed + envío real |
| WhatsApp automático | 🟡 gateada | add-on con cupo fail-closed; envío real espera Meta (S5/S6) |
| **SIAT / factura fiscal** | ❌ en trámite | mock listo; homologación bloqueada por NIT (S2, caduca 1-oct) |
| Cotizaciones B2B (`quotes_b2b`) | ❌ no portada | la pide importadora/construcción |
| Base de conocimiento (`knowledge_base`) | ❌ no portada | la pide importadora/construcción |
| TR4 adapter | ❌ | importadora (S4: columnas TR4 de Sergio) |
| Canales/chatbot | 🟡 decisión | dos bots en dos repos; Sergio revisa cuál sobrevive |

## 2. Rubros: qué falta para encender cada uno

**La regla se cumplió hoy:** un rubro nuevo = encender capacidades del core + pantallas
+ seeder + copy. Comercio tomó UN día porque el core ya era la columna.

| Rubro (track) | Estado | Qué le falta EXACTAMENTE |
|---|---|---|
| **Dental** | ✅ VENDIBLE | factura SIAT real (NIT) · envío WhatsApp real (Meta) |
| **Comercio** (`gestios-general`) | ✅ VENDIBLE núcleo | UI de FEFO/conteos · compras a crédito (alimenta crédito fiscal) |
| **Estética** (`esteticagest`) | 🟢 CASI GRATIS | mismo set que dental (agenda+ficha+aprobaciones). Es: copy/vocabulario + ficha genérica en vez de odontograma + seeder. ~días, no semanas |
| **Veterinaria** (`vetgest`) | 🟢 CASI GRATIS | ídem estética (la "ficha del paciente" es la mascota + dueño) |
| **Gastronomía · Servicios profesionales · Educación · Turismo** (`gestios-*`) | 🟢 BARATOS | mismo set que comercio (catálogo+caja). Es: habilitar track + vocabulario + seeder por rubro. El de servicios/educación se beneficia de agenda (ya existe) |
| **Importadora** (`proveegest-electrico`) | 🟠 TRABAJO REAL | necesita las 2 capacidades NO portadas: **cotizaciones B2B** + **base de conocimiento**, más el costeo de importación (`import_costing` ya está en el core) y TR4 (S4). Provisiona pero entra a menú vacío |
| **Construcción** (`proveegest-construccion`) | 🟠 | mismas 2 capacidades que importadora — un solo porte sirve a ambos |
| **Ganadero** (`ganadero-offline`) | 🔴 EL MÁS LEJOS | exige **modo offline** — arquitectura, no pantallas. Último a propósito |

## 3. El orden que conviene (propuesta)

1. **Estética + Veterinaria** — dos rubros vendibles en días reusando el 90% de dental.
   Multiplican el mercado de la MISMA venta (agenda llena + impuestos al día).
2. **Gastronomía/Servicios/Educación/Turismo** — habilitar los que tengan prospecto real
   (la regla: WOW con cliente pagando, no de antemano).
3. **Cotizaciones B2B + knowledge** — un porte, dos rubros (importadora + construcción).
   Además Bolivian Electric ya es el caso real de importadora.
4. Ganadero al final (offline).

**Transversales que suben TODOS los rubros a la vez:** UI de importación de datos (el
onboarding con Crawl4AI ya probado) · seed del cron de aprobaciones · compras a crédito.

---
Bloqueos de Sergio que gatean lo comercial: NIT/SIAT (S2, caduca 1-oct) · Meta/WhatsApp
(S5/S6) · columnas TR4 (S4) · cuál chatbot sobrevive.
