# Onia — Qué datos necesita el chatbot de cada cliente, por rubro

**2026-08-16.** Esta es la planilla de alta: lo que el dueño del negocio tiene que darnos
para que su bot funcione. Cada campo dice si **hoy entra** en la capa de conocimiento o si
**exige un commit**, porque prometer un campo que el motor no puede cargar es el fallo
silencioso que esa capa existe para evitar.

Contra qué se verificó: `bot/knowledge.mjs` (allowlist real), `bot/config.mjs` (rubros del
bot), `onia-platform/lib/platform/types.ts` (tracks del producto). Todo el 2026-08-16.

---

## 1. Los rubros: el producto tiene 7, el bot conoce 4

| Track del producto | Rubro del bot | ¿Chatbot? |
|---|---|---|
| `dentagest-clinical` | `dental` | sí |
| `esteticagest-clinical` | `dental` (reusa agenda+ficha) | sí — **falta su propio léxico** |
| `vetgest-clinical` | `dental` (reusa agenda+ficha) | sí — **falta su propio léxico** |
| `gestios-general` | `comercio` | sí |
| `gestios-servicios-profesionales` | `servicios` | sí |
| `proveegest-electrico` | `proveedores` | sí |
| `ganadero-offline` | — | **NO.** El contrato del core le **bloquea WhatsApp**. No se le vende chatbot |

**Acción que sale de acá:** estética y veterinaria hoy caen en el léxico `dental`. Un cliente
veterinario que escriba "vacunación" o "desparasitación" no matchea nada. Se arregla **sin
desplegar**, cargando `rubrosExtra` (§3).

---

## 2. La planilla de alta — lo que le pedimos al cliente

Esto es lo que va en el formulario que llena el dueño. **Ningún campo pide un precio**: el bot
no cotiza, y la capa de conocimiento no tiene dónde escribir una cifra (es a propósito).

### Bloque A — Identidad y horario · ✅ entra hoy

| Dato | Ejemplo | Límite real | Campo |
|---|---|---|---|
| Cómo se llama el negocio | "Clínica Sonrisa" | 60 car. | `identity.productName` |
| A quién deriva el bot | "Dr. Peredo" | 60 car. | `identity.humanName` |
| Cómo se presenta el bot | "Soy el asistente de Clínica Sonrisa 🙂" | 140 car. | `identity.botName` |
| Días que atiende | lun a vie | 0=dom … 6=sáb | `empresa.horario.dias` |
| Hora de apertura / cierre | 9 a 18 | enteros 0-24 | `empresa.horario.desde` / `.hasta` |
| Cómo se dice el horario | "lun-vie, 9:00-18:00" | 80 car. | `empresa.horario.frase` |

### Bloque B — La cita · ✅ entra hoy

| Dato | Ejemplo | Regla dura | Campo |
|---|---|---|---|
| Cuánto dura | 30 | 5-240 min | `demo.duracionMinutos` |
| Cómo se dice | "media hora" | **tiene que decir el MISMO número** | `demo.duracionFrase` |
| Modalidad | "en el consultorio" o "por videollamada" | 140 car. | `demo.modalidad` |

> El validador rechaza el archivo si el número y la frase no coinciden. Nace de una
> contradicción que ya pagamos: el guion decía 15 minutos y el calendario bloqueaba 45.

### Bloque C — Cómo habla su cliente · ✅ entra hoy, y es lo que más cambia el resultado

| Dato | Ejemplo (veterinaria) | Límite | Campo |
|---|---|---|---|
| Nombre del rubro | "Veterinaria" | 40 car. | `rubrosExtra[].label` |
| Palabras **fuertes** (identifican el rubro solas) | vacuna, desparasitación, castración, consulta veterinaria | 40 palabras | `rubrosExtra[].fuerte` |
| Palabras **débiles** (suman pero no deciden) | mascota, perro, gato, cachorro | 20 palabras | `rubrosExtra[].debil` |

> **Palabras, JAMÁS expresiones regulares.** Quien llena esto no es programador y una regex mala
> cuelga el proceso. El motor las escapa y las compila solo.

### Bloque D — Qué ofrece el negocio · ✅ entra hoy

| Dato | Ejemplo | Límite | Campo |
|---|---|---|---|
| Hasta 16 servicios o módulos | "Ortodoncia — plan de tratamiento y controles" | `nombre` 60 car. · `queResuelve` 120 car. | `productos[]` |

### Bloque E — Preguntas frecuentes · 🔴 **NO entra hoy**

**El motor solo acepta una FAQ: `siat`.** Está codificado en `FAQ_TEMPLATE`, y un `id` que no
esté ahí **rechaza el archivo entero**. Es un candado deliberado: una FAQ sin un mensaje del
guion que la consuma sería una edición que no hace nada.

Consecuencia práctica: **hoy no se le puede prometer al cliente "cargá tus preguntas
frecuentes".** Para habilitarlo hay que, por cada FAQ nueva: agregar su `id` a `FAQ_TEMPLATE`,
crear el mensaje del guion que la consume y su test. Es un commit, no una edición.

**Decisión pendiente de Sergio** — ver §4.

---

## 3. Lo que hay que cargar YA, sin esperar al panel

Sin tocar código, y arregla el hueco más grande:

- `rubrosExtra` para **veterinaria** y **estética** — hoy comparten el léxico dental.
- `productos` con lo que realmente vendemos, para que el bot no invente.
- Revisar `empresa.horario` (hoy dice lun-vie 9-18) contra lo que atendemos de verdad.

Se edita `/opt/onia/bot/knowledge.json` en el VPS y el motor lo relee solo a los 5 minutos.
Si el archivo tiene un error, **se rechaza entero y el bot sigue vendiendo con los valores del
código** — nunca queda a medias.

---

## 4. Las tres decisiones que faltan

| # | Decisión | Por qué importa |
|---|---|---|
| 1 | **¿Se habilitan FAQs por cliente?** | Es lo primero que un dueño quiere cargar. Hoy es imposible sin commit. Alternativa barata: **una** FAQ genérica por cliente (`id: "negocio"`) con un mensaje de guion que la consuma — un commit, y después es edición pura |
| 2 | **¿El conocimiento pasa a la base?** | Hoy es UN archivo global. Para N clientes tiene que ser una fila por organización. Sin esto el panel no tiene qué editar |
| 3 | **¿Veterinaria y estética son rubros propios del bot o siguen bajo `dental`?** | Si son propios, cambian las preguntas de calificación (a un veterinario no se le pregunta cuántos sillones tiene) |

---

## 5. Lo que NO se le pide al cliente, y por qué

- **Precios.** El bot no cotiza. No hay campo donde escribirlos.
- **Datos de salud de sus pacientes.** El bot no los persiste; el cuerpo de los mensajes
  entrantes se guarda como `(entrante — texto no persistido)`.
- **Sus credenciales de Meta.** El número se conecta por el alta que hacemos nosotros.
