# NutriApp — un módulo vertical completo, mostrado entero

- **Video:** https://www.instagram.com/p/DcB6PoXkql2/ · 78 s
- **Carril:** B (idea) + evidencia visual de producto
- **Cobertura real:** audio 100% ([verbatim](transcripciones/Instagram-DcB6PoXkql2.txt)) · 5 de 39 fotogramas leídos
- **Veredicto: SIRVE YA — el más importante del lote para ONIA Platform**

---

## Qué afirma, textual

> *"literalmente acabo de crear una aplicación funcional para un nutriólogo usando inteligencia
> artificial, esto lo hicimos con el modelo **fable 5 de cloud**"*

Y enumera, en 78 segundos, el producto entero:

| # | Capacidad, verbatim | Qué es en realidad |
|---|---|---|
| 1 | *"el nutriólogo puede enviar sus planes de alimentación"* | panel del profesional → asigna un plan al cliente |
| 2 | *"el usuario puede registrarse con su correo directamente con Google y ver su plan completo"* | portal del cliente, auth social |
| 3 | *"puede registrar sus comidas, incluso tomar una foto y va a ser el cálculo con inteligencia artificial"* | intake por foto con estimación automática |
| 4 | *"ya el paciente lo puede verificar o lo puede modificar"* | **human-in-the-loop sobre la salida de IA** |
| 5 | *"con el plan que envíe el nutriólogo se le va a generar una lista del supermercado"* | artefacto derivado del plan |
| 6 | *"integramos un sistema de inteligencia artificial en cada conversación, que ya tiene un plan precargado"* | chat con el contexto del cliente cargado |
| 7 | *"si es algo más importante o algo delicado te pide que lo consultes con el nutriólogo"* | **escalamiento al profesional humano** |

## Con qué lo respalda

**Demo en pantalla, filmada del monitor.** Verificado en fotogramas: pantalla "Crea tu cuenta /
Continuar con Google" con la marca **NutriApp**; y la vista de chat, con barra inferior de 5
destinos (Inicio · Mi plan · [+] · Progreso · Consejos), placeholder *"Pregunta o cuéntame qué
comiste"*, y una respuesta real del asistente con **4 opciones de desayuno y su rango calórico**.
Debajo del input hay un **texto de descargo** en letra chica.

Nivel de fuente: **PRIMERA PARTE con demo**. No hay usuarios, ni precio, ni tiempo de
construcción. El "lo hice con IA" es creíble; el "es funcional" está mostrado, no probado.

## Lo que esto es realmente: el molde de un rubro

Los 7 puntos NO son features sueltas. Son **la anatomía de cualquier vertical profesional↔cliente**:

```
profesional define un PLAN → cliente lo ve → cliente REGISTRA su cumplimiento
   → la IA estima, el humano corrige → del plan salen ARTEFACTOS derivados
   → un chat con el contexto ya cargado → lo delicado ESCALA al profesional
```

Cambiá "nutriólogo/plan de alimentación" por:

| Rubro | Profesional | Plan | Registro | Artefacto derivado |
|---|---|---|---|---|
| dental | odontólogo | plan de tratamiento | foto de la evolución | presupuesto por fases |
| ganadero | veterinario | plan sanitario | foto/peso del animal | lista de insumos |
| gimnasio | entrenador | rutina | foto o registro de serie | lista de compras |
| taller | mecánico | plan de mantenimiento | foto del odómetro | orden de repuestos |

**Ese esqueleto ya existe en ONIA Core** (work items, entidades, adapters). Lo que el video
enseña no es una idea nueva: es **qué encender**, y en qué orden, para que un rubro se sienta
completo. Enlaza directo con la nota de `CLAUDE.md`: *"un rubro nuevo debe salir de ENCENDER
capacidades del core, no de escribir código nuevo."*

## Los dos detalles que valen más que la app entera

**1. El paciente verifica o modifica el cálculo de la IA.** No es un detalle de UX: es la
diferencia entre "la IA dijo 620 kcal" (que si se equivoca, el usuario abandona) y "la IA
propuso, vos confirmás". Es el mismo patrón human-in-the-loop de nuestros agentes con cola de
aprobación. **Reusar el patrón, no reinventarlo.**

**2. Lo delicado escala al profesional.** Un guardrail explícito, dicho en cámara, más un
descargo visible en la pantalla del chat. Nutrición es YMYL igual que salud dental. Si nuestro
chatbot de un rubro sanitario no tiene ese corte, tenemos el riesgo y ellos no.

## Filtro 1 — lo que NO se puede repetir de acá

- No dice cuánto tardó, ni cuánto cuesta correrlo, ni si hay un usuario real. **No repetir "lo
  hice en X horas" como nuestro.**
- `fable 5 de cloud` = **Claude Fable 5**, modelo real y disponible. Eso sí es verificable y
  cierto.
- Cierra con *"acabo de crear un curso gratuito... deja la palabra cloud"* — cebo de comentario.
  El método está en el video; no hace falta comentar.

## A dónde va

| Sesión | Qué |
|---|---|
| **`onia-plattform`** | el molde de 7 pasos como checklist de completitud por rubro (prompt E1) |
| **`chatbot`** | el corte YMYL: escalar a humano + descargo visible (prompt E2) |
