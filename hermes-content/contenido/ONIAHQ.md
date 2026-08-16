# @oniahq — plan y estado

> La cuenta del **vendedor**. Reglas de qué puede publicar: [`README.md`](README.md).
> Verificado en Instagram el 2026-08-16: la cuenta **existe**, es **profesional**
> (categoría "Empresa de software"), está **vinculada a la página de Facebook "Onia"**
> — o sea que cumple el requisito de la API — y tiene **0 publicaciones · 22 seguidores**.

---

## 1. La bio — ✅ cambiada el 2026-08-16

**Lo que decía y por qué salió:**

> ~~*"Facturá al SIAT, agendá y cobrá sin tipear una sola línea."*~~

La facturación al SIAT está bloqueada por el NIT (bloqueo S2). Prometerlo en la bio es peor
que prometerlo en un post: la bio la lee todo el que cae.

**Lo que dice ahora** (Instagram contó 130/150):

```
Nombre:  Onia · Sistema con IA

Un solo sistema: agenda, cobros, inventario y caja.
Reemplaza el cuaderno, el Excel y el WhatsApp suelto.
Santa Cruz, Bolivia 🇧🇴
```

*Por qué así: la primera línea nombra la plataforma por sus módulos; la segunda nombra las
tres cosas que el comprador tiene en la mano AHORA — que es el dolor de los carruseles 1 y 2.*

⚠️ No dice "obligatorio por ley" ni menciona el SIAT. **Cuando el NIT esté, se suma.**

---

## 2. Los dos tipos, y el cierre es aparte

Sergio: *"los carruseles tienen que ser informativos o de venta."*

**El TIPO es uno de dos. El CIERRE es una decisión distinta**, y confundirlos fue el error
del plan anterior (donde "engagement" figuraba como si fuera un tipo de contenido, cuando en
realidad es una forma de cerrar).

| Tipo | Qué hace | Cierres posibles |
|---|---|---|
| 📚 **Informativo aplicado** | enseña algo usable sobre SU negocio | *"Guardalo"* · una pregunta barata |
| 🎯 **Venta** | producto, precio, prueba, oferta | la palabra clave |

**Regla de cadencia: máximo 1 de cada 4 piezas pide la palabra clave.** Un feed donde cada
post cobra peaje entrena a la gente a scrollear, y el algoritmo lo castiga antes que la gente.

---

## 3. Inventario real — qué está listo y qué no

### Listo y renderizado

| # | Pieza | Tipo | Cierre | Estado |
|---|---|---|---|---|
| 1 | WhatsApp a mano | 📚 informativo | pregunta | ✅ |
| 2 | R.I.P. al cuaderno | 📚 informativo | pregunta | ✅ |
| 3 | 3 procesos a mano | 📚 informativo | guardalo | ✅ |
| 4 | El costo invisible | 📚 informativo | guardalo | ✅ |
| 5 | Mitos de la IA | 📚 informativo | guardalo | ✅ |
| 6 | 5 tareas que la IA hace mejor | 🎯 venta | **LISTA** | ✅ |
| 7 | Tu competencia ya vende con IA | 📚 informativo | pregunta | ✅ |
| 8 | Paradigma de escala | 🎯 venta | **SISTEMA** | ✅ |
| 9 | Recibo itemizado | 🎯 venta | **LISTA** | ✅ |
| 10-12 | 3 piezas de `ui-patterns` (upload · carrito · chat) | 🎯 venta | **SISTEMA** | ⚠️ ver abajo |

### Escrito, falta renderizar

| Pieza | Tipo | Nota |
|---|---|---|
| 6 placas por rubro (dental · comercio · importadora · estética · veterinaria · servicios) | 🎯 venta | texto listo en `docs/ONIA_KIT_VENTA_POR_RUBRO_20260815.md` |

### Bloqueado por algo que no es contenido

| Pieza | Qué lo bloquea |
|---|---|
| Antes/después de web | **no hay ninguna web de cliente entregada.** `web-factory/data/clients/` tiene 9 contextos: **8 son demos** (`clinic-demo`, `dashboard-demo`, `demo`, `dental-demo`, `engineering-demo`, `restaurant-demo`, `saas-demo`, `skincare-demo`) y el noveno es **Nuvia, proyecto propio de Onia**, no un cliente. El pipeline ya está probado con Nuvia |

### ⚠️ Los dos problemas del inventario

1. **Las 3 piezas de `ui-patterns` cierran las tres pidiendo SISTEMA.** Van seguidas rompen
   la regla de 1 de cada 4. Hay que intercalarlas entre los informativos.
2. ~~Dos piezas piden LISTA y el PDF no existe.~~ **Resuelto el 2026-08-16:**
   `recursos/lista-por-donde-empezar.pdf`, una página, verificado a tamaño A4.

---

## 4. El orden de salida

3 por semana (lunes, miércoles, viernes). Va de dolor universal → objeción → ambición, y
**nunca dos piezas de venta seguidas**.

| Semana | L | X | V |
|---|---|---|---|
| 1 | 1 · WhatsApp a mano | 2 · R.I.P. al cuaderno | 3 · 3 procesos a mano |
| 2 | 4 · El costo invisible | 10 · ui-pattern *(venta)* | 5 · Mitos de la IA |
| 3 | 7 · Tu competencia | 11 · ui-pattern *(venta)* | placa de rubro |
| 4 | 8 · Paradigma de escala *(venta)* | placa de rubro | 12 · ui-pattern *(venta)* |

Las piezas 6 y 9 ya están destrabadas: el PDF de LISTA existe.

**Historias:** los días que hay carrusel, una sola — la portada + "link en bio". Sin
producción. Sirve para que el carrusel no dependa del alcance del feed.

---

## 5. Cómo se mide

**La métrica del negocio es una: reuniones agendadas con `?src=`.** Pero **no se le pide a
cada post** — se le pide al conjunto.

Cada pieza se mide por su tipo: los informativos por **guardados**, los de venta por
**reuniones**. Un informativo con 40 guardados y 0 reuniones está haciendo su trabajo.

Cada pieza lleva su `?src=onia-<slug>`. El circuito `?src=` → panel → Cal está vivo y probado.

**Umbral a las 3 semanas:** 0 reuniones → el problema es el contenido o el canal, se cambia
de formato · 1-2 → hay señal, se amplifica ESE ángulo con pauta · 3+ → funciona, segunda tanda.

---

## 6. Qué falta para publicar el primero

| # | Qué | Quién |
|---|---|---|
| 1 | ~~Cambiar la bio (sacar SIAT)~~ | ✅ hecho |
| 2 | ~~Armar el PDF de **LISTA**~~ | ✅ hecho |
| 3 | Conectar `@oniahq` en Postiz | **Sergio** |
| 4 | Programar la semana 1 | yo |

**Queda un solo bloqueo y es de Sergio: conectar `@oniahq` en Postiz.** Es de un minuto.
Sin eso se puede publicar igual, pero a mano.
