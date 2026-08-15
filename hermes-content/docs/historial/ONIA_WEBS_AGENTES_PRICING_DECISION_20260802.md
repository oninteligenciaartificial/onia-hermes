# Webs de clientes · agentes WhatsApp · pricing por valor

> **2026-08-02.** Respuestas de decisión a las 4 preguntas de Sergio. Fuentes:
> `ONIA_VALOR_Y_ESCALERA_PLANES_20260731.md` · análisis Dapta (memoria) · research
> Meta Tech Provider Terms (jul-2026) · `ONIA_PLANES_REQUISITOS_20260801.md`.

## 1. Las webs de los clientes — tres niveles, no uno

| Nivel | Qué es | Quién la hace | Precio |
|---|---|---|---|
| **Mini-web automática** | Página pública del negocio generada de SUS datos del onboarding (nombre, servicios, precios, horarios, botón WhatsApp, reservas). El portal de reservas `/book` YA existe — esto es vestirlo | **Nadie** — sale sola del sistema | Incluida desde Pro |
| **Web completa** | Landing/web de venta hecha con la web-factory (pipeline probado, anti-template) | **Nosotros** | Add-on: 790 landing / 1.500 web pro (pricing vigente) |
| **Builder self-service** | Que el cliente arme su web solo | ❌ **NO se construye** | — |

**Por qué NO builder:** es un producto entero aparte (años de trabajo), el mercado ya lo
regala (Canva/Wix), y nuestro cliente NO quiere armar — quiere que exista. El
diferenciador es el contrario: *"tu web sale sola de tus datos, y si querés una de
verdad, te la hacemos nosotros conectada al sistema"*.

## 2. Agentes de WhatsApp — el modelo elegido: PRE-ARMADO por rubro

Las tres opciones sobre la mesa:

| | A: estilo Dapta (self-service) | B: managed (lo armamos todo) | **C: pre-armado por rubro** ✅ |
|---|---|---|---|
| El cliente | arma sus flows/prompts | no toca nada | **conecta su número y aprueba mensajes** |
| Control nuestro | bajo (arman cualquier cosa) | total | **total: el agente viene entrenado por rubro** |
| Escala | alta pero con soporte caro | no escala (manos por cuenta) | **alta: config = elegir rubro** |
| Riesgo marca | alto (mensajes malos con nuestro motor) | bajo | **bajo: plantillas nuestras pre-aprobadas** |

**El diferenciador contra Dapta, en una frase:** Dapta te vende las herramientas para
armar un empleado; **nosotros te entregamos el empleado ya entrenado para tu rubro** —
solo le prestás tu número y aprobás lo que manda. El análisis Dapta ya lo decía: robar
cuenta única + agentes + packaging, NO la plataforma horizontal de armado.

**Restricciones Meta que moldean esto (research jul-2026):**
- Tech Provider Terms prohíben cobrar por "el uso de la plataforma WhatsApp" en sí →
  **se cobra el AGENTE (software), nunca el WhatsApp**. El pricing ya está así.
- Sin verificación de negocio: máx. 2 números → **S5 (verificación Meta) es la traba
  real de escala**, no el código.
- Conexión del cliente: **embedded signup** (conecta SU número con clics, la WABA es
  suya) — más control para él, menos responsabilidad legal para nosotros.

## 3. Cada cuenta con su propio agente — cómo se maneja (ya construido así)

No hay "un bot global". El runtime de agentes corre **por organización**:

- **Sus datos**: el agente solo ve la organización dueña (tenant scope en cada query).
- **Su número**: la WABA es del cliente (embedded signup); nosotros orquestamos.
- **Su cola**: propone → cola de aprobación DEL dueño → ejecuta con idempotencia.
- **Su cupo**: propuestas/mes y envíos gateados por plan, fail-closed (si no puede
  verificar consumo, no envía). El costo real (tokens) queda acotado por diseño.
- **Su config por rubro**: el pack del track define qué agentes existen (dental:
  Recall/Cobrador/Recordatorios · comercio: stock/cobros — según pack).

Lo que falta para encenderlo entero: sembrar primeras propuestas (cron ya corre) y
el envío real (S5/S6 de Meta).

## 4. Pricing por valor — sí, y el número existe

Cálculo hecho (`ONIA_VALOR_...`): valor mensual entregado **Bs 911 (conservador) /
3.527 (medio) / 13.599 (optimista)** vs Pro Bs 750. El pitch de venta es exactamente
el que dijiste: *"si el agente te recupera UNA cita al mes, ya se pagó"* — falta TU
dato del ticket promedio en SCZ (pendiente S) para ponerlo en plata exacta.

**Decisiones de estructura:**
- **Mensual, NO semanal.** Cobro semanal = 4x fricción de cobranza, churn
  administrativo y contabilidad sucia. El "probar barato" ya lo resuelve el trial de
  14 días sin tarjeta. Anual = 2 meses gratis (vigente).
- **Promociones que SÍ** (no devalúan): precio de lanzamiento YA es la promo
  (320/750/1500 vs lista 390/890/1990, publicado con letra chica honesta) ·
  **"clientes fundadores"**: primeros 10, precio congelado 12 meses (urgencia real,
  stock real) · **referidos**: 1 mes gratis por negocio referido que pague (el mejor
  canal en SCZ es el boca a boca entre dueños).
- **Promociones que NO**: descuentos permanentes o "ofertas" recurrentes — enseñan a
  esperar la rebaja y matan el precio de lista. Con devaluación (Bs flotando), los
  contratos llevan cláusula de ajuste, nunca precio de por vida.

---
Pendientes de Sergio que esto destapa: ticket promedio por cita SCZ · verificación
Meta (S5) + número (S6) · decidir si "fundadores" arranca con las 50 clínicas.
