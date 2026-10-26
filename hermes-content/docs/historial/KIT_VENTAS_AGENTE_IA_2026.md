# Kit de Ventas — Agente IA Onia (Sprint 15 días)

> ⚠️ **PRECIOS DESACTUALIZADOS (corregido 2026-08-01).** Este doc cita Landing Bs 1.490 y
> flujos a 1.800: son de la lista vieja.
>
> 🔴 **Ojo, 2026-08-27: ese Bs 1.490 es un precio de WEB (landing), NO el del chatbot.**
> Coincide por casualidad con el abono viejo del add-on de WhatsApp. **No lo "corrijas"
> contra `pricing.ts`**: ese archivo no cubre la línea de webs, que por decisión del
> 2026-08-24 **no lleva lista de precios y se cotiza caso por caso**
> (`ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md` §4.5). **Manda `PRICING_RATIONALE_INTERNO.md` §0**
> (lanzamiento: Landing **790** · Web Pro **1.500**, desde 2026-07-03) y la tabla por caso
> de `ONIA_SERVICIOS_POR_CASO_PRECIOS_20260801.md`. Los guiones y mensajes de acá siguen
> siendo válidos — solo reemplazar el número al usarlos.
>
> Objetivo: convertir las capacidades tipo "Hermes Agent" (las del video que vimos)
> en ventas reales en menos de 15 días, usando el demo ya activo y los 60
> prospectos Bolivia sin web.
> Reglas de contacto: `HERMES_TELEGRAM_COMMAND_CENTER.md` (no contactar sin
> aprobación; WhatsApp automático bloqueado hasta verificación Meta → enviar a mano).

---

## 1. Qué vendemos (traducido a beneficio)

No vendemos "un bot" ni "IA". Vendemos **un asistente que trabaja solo todos los
días** para el negocio del cliente. El demo (clima + tip a Telegram, 7am) es la
prueba visible de que "esto llega solo, sin que nadie lo prenda".

| Capacidad del agente (video) | Cómo se lo decimos al cliente | Producto Onia que lo cobra |
|---|---|---|
| Briefing diario programado | "Cada mañana recibís tu resumen del negocio en tu celular" | Flujo n8n / Conectores (setup Bs. 1,800) + Monitoreo Bs. 350/mes |
| Integración de servicios (APIs) | "Conecto tus herramientas para que dejen de copiar y pegar" | Flujo de aprobación n8n Bs. 1,800 / Integración extra desde Bs. 1,900 |
| Pipeline de contenido | "Te genero videos/posts constantes con guion y aprobación" | 8 videos Bs. 2,200/mes · 16 Bs. 3,900 · 24 Bs. 6,500 |
| Asistente que aprende (memoria) | "Se acuerda de tus clientes y procesos" | GestiOS Bs. 350–1,250/mes |
| Research acumulativo | "Te aviso qué hace tu competencia y qué se viene" | Consultoría: Diagnóstico Bs. 990 / Implementación Bs. 4,900+ |
| Recordatorios / seguimiento | "Ningún cliente queda en visto" | GestiOS + Cuidado Web |

**Punta de lanza para cerrar rápido** (ticket bajo, dolor universal en los 60
prospectos sin web): **Landing de Captación Bs. 1,490** + botón WhatsApp incluido,
y de ahí abrir el mensual (Cuidado Web / videos / GestiOS).

---

## 2. La oferta de entrada (la que cierra en 15 días)

**"Presencia + Asistente": Bs. 1,490 una vez + desde Bs. 190/mes**

- Landing de captación profesional (estás en Google y se ve serio).
- Botón de WhatsApp click-to-chat incluido.
- **Bonus de cierre:** activamos un *briefing diario por Telegram/WhatsApp* (como
  el demo) con los datos de SU negocio durante el primer mes.
- Mensual: Cuidado Web Bs. 190 (o subir a videos/GestiOS según el negocio).

Por qué funciona: el prospecto no tiene web → dolor claro; el demo lo ve en vivo
→ "magia" tangible; el ticket inicial es bajo → fácil sí; el mensual deja margen.

---

## 3. Guion de venta (3 minutos)

1. **Gancho (problema):** "Vi que [Negocio] está solo en Facebook. Cuando alguien
   te busca en Google, no apareces — y ese cliente termina en la competencia."
2. **Prueba (demo en vivo):** "Mirá esto" → mostrás el Telegram del demo:
   *así de simple le puedo hacer llegar a tu negocio un resumen automático cada
   mañana (reservas del día, clima para tu terraza, recordatorios)."*
3. **Oferta:** "Te dejo online con una página profesional por Bs. 1,490, con
   botón de WhatsApp, y te activo ese asistente el primer mes."
4. **Cierre:** "¿Lo dejamos andando esta semana? Reservo el precio con el
   anticipo." (mitad anticipo / mitad contra entrega.)

Reglas: no prometer ventas/viralidad garantizadas. WhatsApp automático aún no
(solo botón). Precio reservado solo con pago (frase de `ONIA_PRICING_2026.md`).

---

## 4. Mensajes de outreach (listos para enviar A MANO)

> WhatsApp automático está bloqueado hasta verificación Meta. Estos se envían
> manualmente o tras `Apruebo contactar: <empresa>`. Personalizar [Negocio].

**Restaurante / Café / Comida rápida (la mayoría de la lista):**
```
Hola [Negocio] 👋 Soy [nombre] de ONIA. Vi que están en Facebook pero no tienen
página web. Hoy mucha gente busca dónde comer en Google y, si no apareces, te
encuentran a la competencia. Les armo una página profesional con botón de
WhatsApp y menú, y de regalo les activo un asistente que cada mañana les manda
un resumen a su celular. ¿Les muestro cómo se ve en 2 minutos?
```

**Genérico (otros rubros):**
```
Hola [Negocio] 👋 Soy [nombre] de ONIA. Ayudo a negocios como el suyo a estar
en Google y a automatizar tareas repetitivas. Tengo un demo de 2 minutos de un
asistente que trabaja solo todos los días. ¿Se lo muestro hoy o mañana?
```

**Seguimiento (si no responden en 48h):**
```
[Negocio], les dejo el ejemplo en video del asistente automático 👇 Si les sirve
para [reservas / pedidos / clientes], lo dejamos andando esta semana. ¿Coordinamos?
```

---

## 5. Plan de ataque de la lista (60 prospectos)

- **Tanda 1 (días 1-3):** 15 restaurantes/cafés de La Paz con WhatsApp → mensaje
  de rubro + demo. Meta: 5 demos agendadas.
- **Tanda 2 (días 4-7):** siguientes 15 + seguimiento de la tanda 1.
- **Tanda 3 (días 8-12):** resto + cierres. Meta global: 3-5 ventas de entrada
  (Bs. 1,490) = Bs. ~4,500–7,500 + mensuales abiertos.
- Registrar cada contacto en el CRM (estado, fecha, notas) — sin CRM no hay
  comisión (`ONIA_PRICING_2026.md`).

---

## 6. Personalizar el demo para un cliente (cuando se cierra)

El demo base es el workflow n8n `ONIA - Demo Asistente Diario` (ID `GnmIyrHWb1mO5eNy`).
Para un cliente real:
1. Duplicar el workflow.
2. Cambiar lat/lon al de su ciudad (ej. La Paz: -16.5, -68.15).
3. Cambiar `chatId` por el del cliente (que escriba al bot; capturarlo con
   `Hermes Telegram Chat ID Capture`).
4. Sumar su dato real: reservas del día, pedidos, recordatorios de su agenda.
5. Activar y cobrar setup (Bs. 1,800) + monitoreo mensual (Bs. 350).
