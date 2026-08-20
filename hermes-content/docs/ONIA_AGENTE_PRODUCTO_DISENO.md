# Agente "Producto" — diseño y schema

**Estado:** diseño aprobable, sin construir. 2026-08-15.

---

## Antes del diseño: tres cosas que corrigen el pedido

### 1. Hoy no hay comportamiento que leer

Consultado en la base de producción el 2026-08-15:

```
organizations = 0   profiles = 0   audit_logs = 0
```

Cero usuarios, cero eventos. No es un problema del diseño —es el orden de las cosas—
pero define qué se puede prometer: **este agente no puede producir una sola lección
hasta que haya clientes usando el producto.** Diseñarlo ahora está bien; esperar que
devuelva algo esta semana, no.

Consecuencia de diseño: se construye **primero la captura**, después la lectura. Un
agente que lee una tabla vacía es un cron que falla en silencio, y de esos ya
encontramos varios muertos hoy.

### 2. No hace falta un agente. Es una vista.

El pedido decía verificar contra los agentes que ya corren antes de crear otro.
Verificado, y la respuesta es que **no corresponde un agente todavía**:

| | Agente | Vista |
|---|---|---|
| Cuándo se justifica | hay juicio que aplicar repetidamente, a una cadencia | la pregunta se contesta con una consulta |
| Costo | otro cron, otra credencial, otro punto de fallo silencioso | cero |
| Con 0 usuarios | falla o devuelve vacío todos los días | no corre hasta que se la mira |

Un agente aporta cuando hay que **decidir** algo con criterio. "¿Qué porcentaje de
propuestas del agente Cobrador se aprueban?" no necesita criterio: necesita un
`GROUP BY`. El juicio recién hace falta cuando hay que decir *por qué* bajó, y eso
requiere volumen que hoy no existe.

**Se promueve a agente cuando se cumplan las dos:** ≥10 organizaciones activas y
≥30 días de eventos. Antes, es una consulta guardada.

### 3. La señal más valiosa ya se está guardando

No hay que instrumentar nada nuevo para empezar. `onia_agents_actions` registra lo
que un agente **propuso** y si el humano lo **aprobó o descartó**.

Eso es un dataset etiquetado de juicio humano sobre el producto, y es la única
información que Onia tiene y que un competidor no puede copiar. La tasa de
aprobación por tipo de acción **es** la lección de producto: si el Cobrador se
aprueba 90% y el Recall 40%, el Recall está redactando mal o disparando cuando no
corresponde.

---

## De qué se alimenta — solo lo que YA existe

Nada de plataformas nuevas. Cero gasto.

| Fuente | Ya existe | Qué responde |
|---|---|---|
| `onia_agents_actions` | sí | qué propone el agente y qué aprueba el humano ← **la más valiosa** |
| `onia_agents_runs` | sí | si el agente corrió, cuánto tardó, si falló |
| `audit_logs` | sí | qué pantallas y acciones usa la gente de verdad |
| `onia_core_work_items` | sí | qué entra al sistema y dónde se traba |
| `subscription_payments` | sí | quién paga, quién deja de pagar |
| `onia_trial_drip_sends` | sí | qué correo de la prueba precede a una conversión |
| Google Analytics (ya instalado) | sí | qué trae al visitante antes de registrarse |

**Descartado a propósito:** PostHog, Mixpanel y cualquier plataforma de producto —
es gasto y requiere permiso. Y los MCP de NotebookLM que circulan son repos de
terceros no oficiales: no se usan, ya hay pipeline de voz propio.

---

## El schema

Una fila = una lección **con la evidencia que la sostiene**. Si no se puede llenar
la evidencia, no se guarda: eso es lo que separa esto de un cuaderno de opiniones.

```prisma
model ProductLesson {
  id             String   @id @default(cuid())

  // ── La lección ───────────────────────────────────────────────
  enunciado      String   // una sola frase afirmativa y falsable
  categoria      String   // adopcion | friccion | valor | abandono | pricing
  rubro          String?  // verticalTrackId, o null si aplica a todos

  // ── La evidencia (sin esto no se guarda) ─────────────────────
  consulta       String   // el SQL exacto que la produjo — reproducible por otro
  valor          String   // el número que salió ("aprobacion 41%")
  muestra        Int      // n de observaciones. n<20 nace como "candidata"
  ventanaDesde   DateTime
  ventanaHasta   DateTime

  // ── Lo que impide que sea una opinión ────────────────────────
  contrafactual  String   // qué dato la refutaría. Si no existe, no es una leccion
  confianza      String   // baja | media | alta — derivada de muestra y ventana
  estado         String   @default("candidata") // candidata|confirmada|refutada|aplicada

  // ── Qué se hizo y qué paso despues ───────────────────────────
  accion         String?  // el cambio concreto que propone
  aplicadaEn     DateTime?
  resultado      String?  // que paso al volver a medir. Puede decir "no cambio nada"

  organizationId String?  // null = leccion transversal del producto
  detectadaEn    DateTime @default(now())
  revisadaEn     DateTime @updatedAt

  @@index([categoria, estado])
  @@index([rubro])
  @@map("onia_product_lessons")
}
```

### Los dos campos que hacen el trabajo

**`consulta`** — el SQL que la produjo. Obliga a que la lección sea reproducible por
cualquiera y a que se pueda **volver a correr en tres meses** para ver si sigue
siendo cierta. Una lección que nadie puede recalcular envejece sin que nadie lo note,
que es exactamente el problema que tenemos hoy con los docs.

**`contrafactual`** — qué dato la dejaría sin efecto. Si nadie puede escribir qué la
refutaría, no es una lección: es una impresión. Este campo solo es lo que separa
"los dentistas no usan el módulo de inventario" (falsable: mirar `audit_logs`) de
"a los dentistas no les importa el inventario" (no falsable, no entra).

### Reglas de escritura

- `muestra` < 20 → nace `candidata`, nunca `confirmada`. Una lección con n=1 es una
  anécdota y con n=3 es ruido.
- `estado = refutada` **no se borra.** Saber qué creímos y resultó falso vale tanto
  como lo confirmado, y evita volver a proponerlo.
- `resultado` puede decir "no cambió nada" — es un resultado, y el más común.
- `enunciado` en una frase. Si necesita un párrafo, son dos lecciones o ninguna.

---

## Qué falta para que esto sirva

1. **Clientes usando el producto.** Es el único bloqueo real. Todo lo demás está.
2. Que `audit_logs` registre las pantallas, no solo las escrituras — hoy hay que
   verificar qué se está escribiendo ahí (NO VERIFICADO).
3. Una vista de lectura en el panel. No un agente.

## Lo NO verificado

- Si `audit_logs` hoy registra navegación o solo cambios de datos. Cambia mucho qué
  se puede responder sobre fricción.
- Si Google Analytics está enviando de verdad (el componente existe; que reporte no
  se comprobó).
- Si los agentes Recall y Cobrador escriben en `onia_agents_actions` en producción:
  las tablas existen desde hoy y nunca tuvieron datos.

Ver [[onia-agents-module-y-reframe-venta]] · `dentalgest-deploy-db-state`.
