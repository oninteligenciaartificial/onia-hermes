# Onia — Bitácora de los 155 días

> **Documento vivo.** Del 30-jul al 31-dic-2026. Acá se registra TODO: lo que salió bien,
> lo que salió mal, los números reales y las decisiones. Es la fuente del guion de cada
> episodio y la única memoria confiable de la serie.
>
> Plan que rige: [[ONIA_PLAN_155_DIAS_CONSEJO_20260727]]
> Marca y handles: [[ONIA_ARQUITECTURA_MARCA_Y_RUTA_GLOBAL_20260727]]

---

## Cómo se usa (leer una vez)

| Cuándo | Qué se llena | Cuánto tarda |
|---|---|---|
| **Todos los días** | Una línea en §3. Cinco números y una frase | 2 minutos |
| **Domingos** | El bloque semanal de §4 | 15 minutos |
| **Cuando pasa algo** | §5 hitos · §6 decisiones · §7 errores | cuando pasa |
| **Fin de mes** | El corte mensual en §4 | 30 minutos |

**Tres reglas:**
1. **Los números malos se escriben igual.** Este doc no es para mostrar, es para decidir.
   Un mes maquillado acá es un mes perdido de verdad.
2. **Si no se llenó el mismo día, se escribe "sin registro"** en vez de reconstruirlo de
   memoria. Un dato inventado contamina todo lo que se decida después.
3. **Cada entrada lleva fecha absoluta** (2026-08-14), nunca "ayer" ni "la semana pasada".

---

## 1. Estado de los 12 objetivos

> Se actualiza los domingos. Es la misma tabla que sale en pantalla al final del video
> semanal (composición `ScoreboardFull`) y la que alimenta `scripts/hyperframes/data/serie-objetivos.json`.

> **Cerrados por Sergio el 2026-07-30.** Se eliminaron cuatro: **NIT** (ya estaba resuelto
> desde antes, no es meta del semestre), **suscriptores de YouTube**, **leads del contenido**
> y **entrevistas con los que no compraron**. Y las tres filas de clientes (anclas / clínicas /
> webs) se colapsaron en **un solo número: 50**.

| # | Categoría | Objetivo | Meta | Actual | Estado |
|---|---|---|---|---|---|
| 1 | Fiscal | **Homologación SIAT** | aprobada antes del 15-sep | — | ⬜ |
| 2 | Negocio | **MRR** | USD 5.000 | $0 | ⬜ |
| 3 | Clientes | **Clientes activos** | 50 | 0 | ⬜ |
| 4 | Ventas | **Llamadas y demos con dueños de negocio** | 250 | 0 | ⬜ |
| 5 | Expansión | **Clientes internacionales** | 3 | 0 | ⬜ |
| 6 | Retención | **Churn mensual** | menor a 5% | — | ⬜ |
| 7 | Negocio | **Caja neutra personal** | sí | — | ⬜ |
| 8 | Empresa | **Primera oficina** | MRR = 3× alquiler | — | ⬜ |
| 9 | Aprendizaje | **Aprender a programar SIN IA** | 15 programas escritos a mano | 0 | ⬜ |
| 10 | TikTok | **Videos publicados** | 155 | 0 | ⬜ |
| 11 | TikTok | **Seguidores** | 20.000 | — | ⬜ |
| 12 | YouTube | **Resúmenes semanales** | 22 | 0 | ⬜ |

**Progreso: 0 de 12.**

> **Eliminada la "primera contratación"** (2026-07-30, decisión de Sergio). Sigue siendo real
> que 50 clientes no los soporta una persona sola — pero deja de ser objetivo del tablero y
> pasa a ser una consecuencia que va a aparecer cuando el soporte apriete.

### De dónde sale cada número

**Llamadas y demos = 250.** No es un número al azar: **sale de la meta de 50 clientes.**
```
50 clientes ÷ 20% de cierre (1 de cada 5 demos) = 250 demos
250 demos ÷ ~110 días hábiles                   = 2,3 por día
```
Con 200 demos y la misma tasa salen 40 clientes, no 50. **Es el único objetivo del tablero
que es puro esfuerzo propio** — no depende del SIN, ni del algoritmo, ni de que el cliente
diga que sí. Es el que se mueve todos los días y el que produce a todos los demás.

**Aprender a programar SIN IA = 15 programas escritos a mano.** El "sin IA" no es un detalle:
es el objetivo. Escribir el código uno mismo, con documentación y errores propios, sin
autocompletado que piense por vos. Un programa que corre y hace algo real vale más que 40
horas de tutorial. Con 3 h/semana × 22 semanas (~66 h) dan 15 programas chicos que funcionen.

**Por qué es el mejor objetivo del tablero:** es el único que construye una capacidad que
no se puede comprar ni delegar. Y narrativamente es la mejor historia que tenés —
*el chico que construye una empresa de IA aprendiendo a programar sin IA.* Además tiene un
efecto práctico: el día que la IA escriba algo mal, vas a poder darte cuenta. Hoy no.

El worker del Cobrador IA deja de ser la meta y pasa a ser **la graduación**: el programa
número 15, el primero que corre en producción.

**Churn < 5%.** Es el % de clientes que se van cada mes. Con 50 clientes y 10% se van 5 por
mes: hay que vender 5 nuevos **solo para quedarse igual**. Importa más que el MRR porque el
MRR avisa tarde — si entran 8 y se van 6, el MRR sube un poco y parece que va bien mientras
el negocio se desangra.

**Homologación SIAT: se queda, con la contra dicha.** Es el único objetivo que **gatea el
producto** (sin ella no se vende la parte de facturación, que es el gancho de demanda) y el
30-sep es un reloj nacional real. La contra honesta: es el único que **no se controla del
todo**, porque depende del proceso del SIN. Se deja igual: un tablero donde solo están las
cosas controlables no cuenta la verdad de construir una empresa en Bolivia.

> **La aritmética ahora cierra sola.** Bs 56.850 ÷ 50 clientes = **Bs 1.137 por cliente**, y el
> ARPU real del stack (plan + chatbot + cuidado web) es Bs 1.000-1.400. Con los 30 clientes del
> plan original hacía falta Bs 1.895, que era casi el plan más caro del catálogo: el número solo
> cerraba si TODOS compraban el tope. Con 50 cierra con una mezcla normal.

Leyenda: ⬜ pendiente · 🟡 en progreso · ✅ cumplido · ❌ caído (con motivo en §7)

---

## 2. Los tres relojes

> **Día 1 = jueves 30 de julio de 2026** (Sergio sube el primer TikTok hoy).
> **Día 155 = 31 de diciembre de 2026.** Verificado: del 30-jul inclusive al 31-dic son 155 días.

| Reloj | Fecha | Por qué importa |
|---|---|---|
| ⏰ **SIAT** | ~~**30-sep-2026**~~ | ⚠️ *Corregido el 3-oct:* ese plazo (grupos 9° a 12°, nunca «el país entero») quedó sin efecto el mismo 30-sep (RND 102600000038). Ya no es un reloj de la serie |
| 💸 **Runway** | **~mediados de octubre** | *(Decía «cae casi el mismo día que el SIAT»: ese reloj ya no corre)* |
| 🎬 **Serie** | **31-dic-2026** | Día 155 de 155 |

---

## 3. Registro diario

> Una línea por día. Si un día no se registró, se escribe `sin registro` y se sigue.
> Las cinco métricas son de ACCIÓN, no de resultado: son las que dependen de vos.

Formato:

```
2026-08-01 | conv 5 | demos 1 | grab 12min | código 1 | soporte 0 | Primera visita a una clínica. Dijo que lo piensa.
```

| Campo | Qué es | Meta diaria |
|---|---|---|
| `conv` | Conversaciones nuevas con dueños de negocio | 5 |
| `demos` | Demos agendadas | 1 |
| `grab` | Minutos de material crudo grabado | 10 |
| `código` | Bloques de 90 min en código de producción | 1 |
| `soporte` | Tickets abiertos al cerrar el día | 0 |

### Julio 2026

```
2026-07-30 | DÍA 1 de 155 | conv _ | demos _ | grab _ | código _ | soporte _ | Primer TikTok publicado. Arranca la serie.
2026-07-31 | DÍA 2 de 155 |
```

### Agosto 2026

```
2026-08-01 | DÍA 3 de 155 |
```

### Septiembre 2026

```
```

### Octubre 2026

```
```

### Noviembre 2026

```
```

### Diciembre 2026

```
```

---

## 4. Registro semanal

> Se llena los domingos. Es el guion del episodio de YouTube de esa semana.

Plantilla a copiar:

```markdown
### Semana N (2026-MM-DD a 2026-MM-DD) · Días X-Y de 155

**Números**
| Métrica | Esta semana | Semana pasada | Δ |
|---|---|---|---|
| Semanas de runway | | | |
| Clientes pagando | | | |
| Altas / Bajas | | | |
| Churn | | | |
| MRR (Bs / USD) | | | |
| Conversión demo → cliente | | | |
| Horas de soporte por cliente | | | |
| CAC en horas | | | |
| Leads que llegaron del contenido | | | |
| TikToks publicados | | | |
| Retención a 30 s (TikTok) | | | |

**Lo que se prometió la semana pasada** → ¿se cumplió? sí / no / parcial. Sin excusas.

**Lo que salió bien**

**Lo que salió mal** (este bloque nunca va vacío)

**Qué aprendí**

**Compromiso verificable para la próxima semana**
```

---

## 5. Hitos

> Cada uno es un episodio especial. Se anota el día que pasa, con fecha y contexto.

| Hito | Fecha | Episodio | Notas |
|---|---|---|---|
| 🎬 Episodio 0 — el punto de partida | | | |
| 🔓 NIT desbloqueado | | | |
| 💰 **Primer cliente pagando** | | | El único que cambia la naturaleza de la empresa |
| 📋 Homologación SIAT aprobada | | | |
| ⏰ 30 de septiembre — el día del SIAT | | | |
| 😰 El día que casi se acaba la plata | | | |
| 🔁 **Primer cliente que RENUEVA** | | | Vale más que el primero que compra |
| 🤝 Primera contratación | | | |
| 🦷 Cliente #10 del mismo rubro | | | Habilita el vertical #2 |
| 🌎 Primer cliente internacional | | | |
| 🏢 Primera oficina | | | Gatillo: MRR = 3× alquiler, 2 meses |
| 📊 Episodio 155 — el cierre | | | |

---

## 6. Decisiones

> Toda decisión que cambie el rumbo. **Con el porqué**, que es lo que se olvida.
> Si en dos meses no se entiende por qué se decidió algo, se vuelve a discutir desde cero.

| Fecha | Decisión | Por qué | Quién |
|---|---|---|---|
| 2026-07-27 | Marca única `Onia`, producto `Onia Platform`, handle `@oniahq` | 15 nombres alternativos verificados, 15 quemados. El espacio está agotado | Sergio |
| 2026-07-27 | Un solo vertical (dental) y un solo país (Bolivia) para la fase 1 | Bolivia es el mercado menos saturado y cobra 2-10× más que Ecuador | Sergio |
| 2026-07-27 | Meta $5.000 MRR con forma barbell, no 30 clientes uniformes | Con 30 iguales da $1.500. Con 5 anclas + base, cierra | Sergio |
| 2026-07-27 | TikTok diario (155/155), pero se elimina el "sin fallar" | El contador exige diario; la culpa es lo que mata la serie | Sergio |
| | | | |

---

## 7. Errores y aprendizajes

> El material más valioso de la serie y el más incómodo de escribir.
> **Un error no registrado se repite.**

| Fecha | Qué pasó | Qué costó | Qué cambió para que no vuelva |
|---|---|---|---|
| 2026-07-27 | El runbook de Meta mandaba poner la razón social como nombre de la Página | Casi queda "OniaAgency" público en vez de "Onia" | Se separaron las 4 capas (legal / marca / producto / presencia) en un doc |
| | | | |

---

## 8. Oportunidades que aparecieron

> Todo lo que no estaba en el plan: mentorías, eventos, viajes, clientes grandes,
> productos nuevos. **Anotar no es perseguir.** Se registra, se evalúa contra el
> objetivo del mes, y la mayoría se pospone.

| Fecha | Qué apareció | Decisión | Motivo |
|---|---|---|---|
| | | | |

---

## 9. Qué NO se publica

> Regla dura del plan §9. Repetida acá para que esté a mano cuando haya dudas en el corte.

Datos de clientes · grabar sin consentimiento escrito · ingresos exactos en tiempo real ·
domicilio, familia, rutina o colegio · datos legales de Leslie · credenciales y `.env` en
pantalla · precios negociados y márgenes · peleas con nombre · funciones que no existen.

---

## 10. Cierre de mes

| Mes | Objetivo del mes | ¿Se cumplió? | MRR | Clientes | Runway | Nota |
|---|---|---|---|---|---|---|
| Agosto | NIT + cliente #1 | | | | | |
| Septiembre | Homologación SIAT | | | | | |
| Octubre | Caja neutra + churn <10% | | | | | |
| Noviembre | Que el modelo se repita sin Sergio | | | | | |
| Diciembre | Cerrar sin heroísmo | | | | | |
