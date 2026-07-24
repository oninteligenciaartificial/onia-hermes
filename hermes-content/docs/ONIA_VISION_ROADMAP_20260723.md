# ONIA — Visión, roadmap y cómo continuar

> **Carril I (research/estrategia).** Fecha: 2026-07-23. El doc que engloba TODO el futuro de la plataforma y cómo se continúa, para que nada se pierda entre sesiones.
> Docs de detalle: `ONIA_ARRANQUE_UNA_APP_20260723.md` (arquitectura) · `ONIA_C0_ESQUELETO_MAESTRO_20260723.md` (spec) · `ONIA_CARRILES_PROMPTS_20260723.md` (ejecución) · `ONIA_PLATAFORMA_UNICA_BRIEF_DECISION_20260723.md` (decisión) · `ONIA_PLATAFORMA_UNICA_ESTRUCTURA_DESPACHO_20260723.md` (marca/costos/internacional).

## 1. La tesis en una frase

**Onia = una sola app, un dominio, un login: el sistema con IA para negocios de LatAm (Bolivia primero). El cliente entra, elige su rubro, y adentro tiene su ERP + agentes 24/7 + web + chatbot, todo cumpliendo la ley local que ningún sistema global cumple.** Se vende un vertical maduro (DentalGest), y la plataforma crece alrededor sin mover a nadie. Land-and-expand: la misma cuenta paga cada vez más (enciende módulos), sin sumar clientes nuevos.

## 2. El principio que ordena TODAS las decisiones

**Ingresos en semanas, no plataforma en meses.** Runway ~Bs 11.000 (~2,5-3 meses), piso Bs 4.000/mes, deuda Bs 4.000. Sergio VENDE (no codea); los agentes/subagentes construyen; Arthur produce presencia. **No se construye la habitación #2 (2º vertical, LatAm, billing, cursos) hasta que la #1 tenga inquilino pagando y haya encendido un segundo módulo.** Aterrizar en la aspirina (facturar/operar/SIAT) antes que en la vitamina (web/chatbot/cursos).

## 3. Roadmap por horizontes

### AHORA (0-8 semanas) — validar DentalGest = habitación #1
Lo que cubren los carriles C0-C7 (ver `ONIA_CARRILES_PROMPTS`):
- La una-app: capa de cuenta/rubro/entitlements sobre DentalGest (C1), factura SIAT + agentes demoables (C2), add-ons encendibles (C3), sala de agentes interna (C4), infra (C5), presencia+venta (C6, Arthur), research fiscal (C7).
- **Objetivo medible:** 3-5 clínicas pagando (cobro a mano en Bs), empezando por los warm leads que ya escribieron. 1ª factura SIAT validada (estado 908). 1 agente aprobado en `/pending`.

### PRÓXIMO (tras los primeros clientes pagando)
- **2º vertical (GestiOS/comercio)** como CONFIG de la misma app (`gestios-general` pack), no código de core, no otra app.
- **Add-ons escalando:** el chatbot IA, la web, las automatizaciones se venden como upsell a las cuentas ya aterrizadas (el corazón del land-and-expand).
- **Puerta self-serve:** signup automático + provisioning (hoy a mano); recién cuando el volumen lo justifique.

### FUTURO (capturado para no perderlo — NO se persigue hasta validar)
- **Más verticales** (proveedores, ganadero, estética, veterinaria) = packs de config sobre el mismo core.
- **LatAm — Argentina (AFIP/ARCA) y más países** vía `countryPack` + adapter `FiscalEmitter`. El "socket" se deja listo ahora (columnas país + interfaz), pero el país NUEVO solo se construye con un lead de ese país pagando. Multi-país es MOAT, no wedge.
- **Higgsfield / marketing IA:** hoy = canal de adquisición PROPIO (llena el embudo de DentalGest, se mide por demos agendadas, no views). Futuro = línea de servicio "Onia Studio" a clientes. NUNCA agencia-para-terceros antes de que la plataforma esté probada.
- **Educación / Cursos (línea nueva que Sergio suma):**
  - (a) Cursos para que negocios aprendan a operar/vender con IA (compone con el marketing = lead-magnet + autoridad).
  - (b) Cursos para enseñar a **levantar su propia plataforma / SaaS con IA** (público = builders/emprendedores, DISTINTO al dueño de clínica que compra DentalGest → complementa la marca, no canibaliza la venta del ERP).
  - (c) Cursos de **Higgsfield marketing** (monetiza el know-how de contenido que ya se produce).
  - **Criterio:** los cursos son un info-product real y de alto margen, PERO son otro negocio (otra venta, otra entrega, otro soporte). En esta ventana entran SOLO como taller gratis/lead-magnet dentro del marketing (autoridad → demos de DentalGest). Como P&L propio (academia, cohortes pagas) = DESPUÉS de tener la plataforma validada y casos reales desde los cuales enseñar. Capturado acá; parqueado hasta entonces.
- **Nuvia (B2C):** dogfood/caso de éxito (correr el stack SIAT+QR+checkout sobre NIT propio), NO retail operado.

## 4. Cómo se continúa (modelo operativo)

- **Una plataforma que crece, no productos que se reemplazan.** Cada cosa nueva (vertical, add-on, país, curso) se SUMA; nunca se muda ni se reconstruye al cliente.
- **Modelo de sesiones + subagentes** (ver §5): pocas sesiones de control, muchos subagentes en paralelo donde NO hay choque de archivos; serial donde comparten repo/archivos.
- **Cadencia por carril:** estructura primero → STOP → build → gates (`tsc`, e2e, review) → merge a `main` como árbol coherente → y PARÁ. Nada de "ya que estoy toco esto otro".
- **`main` siempre compila** (alimenta Vercel + VPS). Nunca merge parcial.
- **Bloqueos humanos de Sergio** que destraban lo comercial: S1 precios · S2 NIT/creds SIAT piloto · S3 secreto intake n8n · S6 token WhatsApp/IG. Empujarlos desde el día 0 en paralelo al build.

## 5. Modelo de sesiones + subagentes (para no abrir demasiadas sesiones)

**Regla física:** subagentes en paralelo SOLO si NO tocan los mismos archivos. Mismo repo + archivos compartidos (schema, nav) = SERIAL.

| Sesión | Qué corre | Cómo |
|---|---|---|
| **Sesión APP** (repo DentaGest) | Cadena **C1 → C2 → C3** (misma app, comparten `schema.prisma`/`navigation.ts`) | SERIAL. Subagentes para subtareas que NO chocan dentro de cada paso (ej. migración vs `lib/platform/**` vs tests). Es la ruta crítica |
| **Sesión CONTROL** (onia-hermes) | **C7** (research, docs) + **C4** (onia-center, carpeta distinta) + coordina **C5** (infra) cuando hay algo en `main` | PARALELO como subagentes (repos/carpetas distintas = cero choque) |
| **Arthur** (su máquina/sesión) | **C6** (landing + sales kit), carpetas aisladas | Aislado. Prompts que "terminan y paran" |

**Resultado: 2 sesiones activas + Arthur, no 7.** Los subagentes dan la velocidad DENTRO de cada sesión.

**Lo que NO se puede colapsar en subagentes paralelos:** la cadena de la app (C1→C2→C3 comparte archivos → serial); la infra (C5 necesita código en `main` + secrets S3/S6); los bloqueos humanos (S1/S2/S6 = solo Sergio). Arthur es humano, no subagente.
