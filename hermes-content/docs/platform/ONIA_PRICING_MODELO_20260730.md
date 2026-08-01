# Precios de Onia Platform — el modelo

> 2026-07-30. Sergio: *"no sé qué precios colocar, hay que medirlos en base a las soluciones
> que les vamos a dar y a las facilidades que se les da"*.
>
> Este doc **reemplaza** a `ONIA_PRICING_2026.md` como fuente de verdad del precio de la
> plataforma. Aquel queda para servicios (webs, automatizaciones, comisiones de vendedor).
>
> **Regla de honestidad:** los números marcados `[SUPUESTO]` son míos y hay que confirmarlos.
> Los marcados `[FALTA DATO]` no los puedo estimar sin inventar.

---

## 1. La recomendación, en cinco líneas

1. **Mantener 390 / 890 / 1.990 de lista** y **320 / 750 / 1.500 de lanzamiento.** Están bien
   ubicados; el problema no es el número.
2. **El eje de cobro debe cambiar por rubro**, porque el valor no crece por la misma variable
   en una clínica que en una importadora. En dental: **por sillón**. En importadora: **por
   sucursal**.
3. **No bajar el precio: bajar el RIESGO.** Con cero clientes, lo que frena al comprador no es
   la plata, es la desconfianza. Descontar no la resuelve; garantizar sí.
4. **El margen no está en la suscripción base, está en los módulos** (chatbot, web, contenido).
   La base se precia para entrar; los módulos son el negocio.
5. **Importadora todavía no se puede precisar** — falta un dato concreto (§7).

## 2. La contradicción entre documentos: resuelta

`ONIA_PRICING_2026.md` lista Bs 320 / 750 / 1.500. La landing muestra 390/890/1.990 de lista y
320/750/1.500 de lanzamiento. **No se contradicen en el número**: aquel doc solo escribió los
de lanzamiento.

**Lo que sí contradice es el encuadre.** Ese doc todavía vende "DentalGest" y "GestiOS" como
productos separados, cada uno con su tabla de planes. Eso ya no es cierto: **Onia es una
plataforma con packs por rubro.**

**Resolución:** este doc manda para el precio de la plataforma. `ONIA_PRICING_2026.md` conserva
lo suyo (webs, automatizaciones, motor local, comisiones de vendedor) y hay que **borrarle las
tablas de "DentalGest" y "GestiOS" como productos**.

## 3. Qué se entrega hoy — no se cobra por lo que no existe

Verificado contra el código el 2026-07-30 (`ONIA_PLATFORM_ESTRUCTURA_20260730.md`).

| Capacidad | Estado | ¿Se puede cobrar? |
|---|---|---|
| Agenda, ficha, odontograma, tratamientos | 🟢 Funciona | **Sí** |
| Cobros y caja, reportes | 🟢 Funciona | **Sí** |
| Reserva pública de citas (`/book`) | 🟢 Funciona | **Sí** |
| Chatbot de WhatsApp entrante (confirma y cancela citas) | 🟢 Código completo | **Sí, cuando esté el número conectado** |
| Multi-usuario con permisos por rol | 🟢 Cerrado el 2026-07-30 | **Sí** |
| Agentes 24/7 con aprobación humana | 🟡 Existen, **aprobar no dispara envío** | **No como "trabaja solo"** |
| Facturación fiscal SIAT | 🔴 **Mock** | **NO.** Está en la web como "en homologación" |
| Pack importadora | 🟡 Declarado, **sin pantallas** | **No todavía** |

**Consecuencia directa:** hoy Onia se vende como *"ordená tu clínica y no pierdas pacientes"*,
**no** como *"factura sola y trabaja sola"*. Lo segundo llega; cobrarlo antes es venderle humo
a alguien que se va a dar cuenta en la primera semana.

## 4. Cuánto vale, en plata

El método: estimar lo que el negocio gana o deja de perder al mes, y capturar una fracción.

### 4.1 Dental — una clínica de 2 sillones

| Palanca | Cálculo | Valor mensual |
|---|---|---|
| **Pacientes que no vuelven** | El agente de recall los reactiva. `[SUPUESTO]` 3 pacientes/mes × valor de un tratamiento promedio `[FALTA DATO: cuánto factura un tratamiento típico]` | **La palanca más grande** |
| **Ausencias** | Recordatorio automático por WhatsApp. `[SUPUESTO]` 4 sillas vacías/mes recuperadas × precio de consulta `[FALTA DATO]` | Alto |
| **Horas de recepción** | `[SUPUESTO]` 1,5 h/día en agenda manual, recordatorios y buscar fichas → 33 h/mes. Con salario mínimo Bs 3.300 (DS 5516) el costo hora ronda **Bs 17** → **~Bs 560/mes** | **~Bs 560** |
| **Cobros olvidados** | Saldos que se pierden por no seguirlos | `[FALTA DATO]` |
| **Facturar sin re-tipear** | Hoy **no aplica**: el emisor es mock | **Bs 0 hoy** |

**Lo único que puedo calcular sin inventar es el ahorro de horas: ~Bs 560/mes.** Solo con eso,
**Bs 320 de lanzamiento ya se paga solo** — y esa es la palanca más chica de la lista.

> **Los dos datos que faltan y que valen más que todo este doc:**
> **¿cuánto cobra una clínica dental de Santa Cruz por una consulta, y cuánto por un
> tratamiento promedio?** Con esos dos números, las dos primeras filas se llenan y el
> argumento de venta pasa de "te ahorra tiempo" a **"recuperás X bolivianos al mes"**.
> Se consiguen preguntando en una sola llamada.

### 4.2 La regla de captura

Un SaaS sano cobra entre **10% y 25%** del valor que crea. Con Bs 320 capturando solo el ahorro
de horas (Bs 560), estamos en **57%** — o sea **caro** si eso fuera todo lo que hace. Pero al
sumar una sola reactivación de paciente al mes, el valor se multiplica y el porcentaje se
desploma.

**Traducción:** el precio actual es correcto, pero **el argumento de venta está mal**. No se
vende "ahorrás tiempo" (donde el precio se ve caro): se vende **"recuperás pacientes"** (donde
se ve barato).

## 4-bis. Contra qué competimos, con datos verificados

De `ONIA_PRECIOS_COMPETENCIA_20260730.md` (32 precios con URL, consultados 2026-07-30).

| | Precio | Qué es |
|---|---|---|
| **El cero** | Bs 0 | **Portal Web del SIN.** Gratis y cumple la ley. Es el competidor real |
| **Piso publicado en Bolivia** | **Bs 85/mes** | Sintic — SIAT con facturas ilimitadas. Sin agenda, sin ficha |
| **Techo publicado en Bolivia** | **Bs 1.000/mes** | administraTe Premium, con 5 h semanales de consultoría incluidas |
| **Dentiqa** (dental, lista Bolivia) | USD 89-249 (≈ **Bs 1.058-2.961**) | Agenda, odontograma, historia, chatbot IA. **Sin facturación fiscal de ningún país** |
| **Clinera.io** (el comparable más cercano) | USD 279-479 + 450 de setup (≈ **Bs 3.317-5.695**) | Mismo concepto: agentes IA con créditos, multi-sucursal |

### El hallazgo que vale más que todos los precios

> **No existe UN SOLO software que cruce agenda + ficha clínica + facturación SIAT.**
>
> Los que tienen SIAT (Sintic, administraTe, Emizor) son facturadores o ERPs genéricos: no
> tienen agenda ni ficha. Los que tienen agenda y ficha (Dentiqa, Doctocliq) **no facturan en
> Bolivia** — Doctocliq excluye a Bolivia explícitamente de su lista de facturación electrónica.
>
> **Ese cruce es el espacio de Onia.** No es una ventaja de features: es una categoría que
> nadie ocupa.

### Cómo calibra nuestro precio

Bs 320-1.500 queda **por encima del rango publicado boliviano** (85-1.000) y **muy por debajo
del comparable regional** (Dentiqa desde Bs 1.058, Clinera desde Bs 3.317).

**Eso está bien, y hay que saber defenderlo:** contra el software boliviano competimos con
algo que ellos no tienen (agenda + clínica + agentes); contra el regional, con algo que ellos
no tienen (**la ley boliviana**) y a un tercio del precio.

**El riesgo del dato:** ningún precio boliviano en Bs tiene fecha de vigencia verificable. Si
Sintic o administraTe fijaron tarifa antes de junio 2026, hoy están cobrando ~41% menos en
dólares sin haberlo decidido. **Ese piso puede subir solo** — no conviene anclarse a él.

### El número que falta y hay que producir

**Cuánto tarda cargar una factura a mano en el Portal del SIN.** No lo publica nadie, ni el SIN
ni terceros. Es el argumento central contra el competidor gratuito y **se produce
cronometrándolo con una cuenta propia** — que Onia ya tiene. Una tarde de trabajo, y pasa a ser
un dato propio que nadie más puede citar.

## 5. El eje de cobro — la decisión más importante

No es lo mismo qué precio, que **por qué unidad**. El eje decide si Onia crece cuando el cliente
crece.

| Eje | Sirve | Problema |
|---|---|---|
| **Por usuario** | Nunca acá | La clínica limita usuarios para pagar menos → **recepción termina compartiendo contraseña** y se rompe la trazabilidad clínica que acabamos de construir |
| **Por factura** | Alineado con el SIAT | Castiga al que crece justo cuando crece. Y hoy la facturación es mock |
| **Por sillón (dental)** | ✅ | Escala con los ingresos reales, es legible, y es como se precia el software dental en el mundo |
| **Por sucursal (comercio/importadora)** | ✅ | Ahí el valor crece por punto de venta y por stock, no por gente |

**Recomendación: eje distinto por rubro, y está bien que lo sea** — porque el valor crece por
variables distintas. El plan base cubre 1-2 sillones (o 1 sucursal) y el siguiente escalón se
activa por unidad, no por "más funciones".

**Ventaja secundaria:** el cliente entiende por qué sube. "Abriste otro consultorio" es un
motivo legítimo; "querés exportar a Excel" no lo es.

## 6. Las facilidades — la otra mitad de la pregunta

Con **cero clientes**, el obstáculo no es el precio: es que **nadie quiere ser el primero**.
Descontar no arregla eso; **garantizar sí**. Por eso:

| Facilidad | Propuesta | Por qué |
|---|---|---|
| **Setup** | **Bonificado** en el precio de lanzamiento, con el valor mostrado y tachado | Cobrarlo es la barrera más alta del embudo justo cuando no hay confianza |
| **Migración de datos** | **Incluida** (cargamos sus pacientes) | Es lo que más miedo da y lo que más ata: una vez migrado, no se va |
| **Prueba** | **14 días sin tarjeta** | Sin tarjeta porque en Bolivia pedirla en frío mata la conversión |
| **Garantía** | **Primer mes: si no sirve, se devuelve** | Esto reemplaza al descuento. Invierte el riesgo y no toca el precio |
| **Anual** | **10 meses por 12** | Ya definido. Mejora la caja, que es lo escaso |
| **Cohorte fundador** | Precio de lanzamiento **congelado 12 meses** para los primeros 5, con **fecha de corte explícita** | **Nunca "de por vida"** — con la devaluación de 2026 eso es suicida |
| **Ajuste por TC** | Cláusula obligatoria: referencia al TCO del BCB, banda 8%, ajuste solo sobre el exceso, nunca retroactivo, aviso 15 días | Los costos de Onia son en USD. Ver `ONIA_TIPOS_DE_CAMBIO_BOLIVIA_20260730.md` |

**La frase que reemplaza al descuento:** *"Probalo 14 días. Si al primer mes no te sirve, te
devolvemos. Y migramos tus pacientes nosotros."* Eso vende más que Bs 50 menos.

## 7. Los rubros sin precio

- **Importadora:** no se puede precisar todavía. Falta **`[FALTA DATO]`: cuántas sucursales,
  cuántos usuarios y qué volumen de cotizaciones al mes maneja el cliente objetivo.** Con eso
  el eje "por sucursal" se traduce a número. Bolivian Electric puede darlo en una reunión.
  **Además** el pack no tiene pantallas: aunque hubiera precio, hoy no hay qué entregar.
- **Comercio y servicios:** sin pack construido. La landing lo dice de frente y ofrece lo que
  sí existe. Correcto — no forzar un precio para llenar el cuadro.

## 8. Lo que hay que hacer con esto

1. **Conseguir los dos números del §4.1** (precio de consulta y de tratamiento en Santa Cruz).
   Es una llamada y cambia todo el argumento de venta.
2. **Limpiar `ONIA_PRICING_2026.md`**: sacarle las tablas de DentalGest y GestiOS como productos.
3. **Cambiar el argumento en el kit de venta**: de "te ahorra tiempo" a "recuperás pacientes".
4. **Definir la fecha de corte** del precio de lanzamiento. Sin fecha, no es lanzamiento: es
   el precio.

---

Relacionado: `ONIA_ENFOQUE_20260727.md` (a quién) · `ONIA_PLATFORM_ESTRUCTURA_20260730.md`
(qué se entrega) · `ONIA_PRECIOS_COMPETENCIA_20260730.md` (contra qué) ·
`ONIA_TIPOS_DE_CAMBIO_BOLIVIA_20260730.md` (la cláusula de ajuste).
