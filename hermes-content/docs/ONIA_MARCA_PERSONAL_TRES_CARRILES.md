# Marca personal — los tres carriles y qué NO va en cada uno

> Pedido de Sergio Urcullo, 2026-09-07: *"a la hora de que decimos comentá algo y te lo
> envío, prometemos algo como instalar y demás, hay que desarrollarlo… también eso puede ir
> para mi comunidad, así que quiero que ordenes tus cosas"*.
>
> Fuente única del tema. Si otro doc contradice esto, gana éste.

Los tres carriles no son tres tipos de contenido: son **tres momentos de una misma
escalera**, y cada uno tiene un trabajo distinto. La decisión que importa no es qué va en
cada uno — es **qué NO va**, porque eso es lo único que hace que el siguiente escalón tenga
sentido.

```
  PÚBLICO              ENTREGABLE               COMUNIDAD
  (marca personal)     (lo que prometemos)      (alto valor)
       │                       │                     │
  te encuentra  ──────►  te da algo real  ──────►  te queda debiendo
  y te hace                y prueba que             lo que sólo se
  comentar                 lo que dice              aprende adentro
                           es cierto
```

---

## 1 · Marca personal — lo público

**Trabajo:** que te encuentren y que comenten. Nada más.

**Formato:** carruseles del patrón `apple-editorial` en Instagram. Cinco piezas hoy, con su
orden en [`cola/PARA-PUBLICAR-APPLE-ORDEN.md`](cola/PARA-PUBLICAR-APPLE-ORDEN.md).

**Qué SÍ va:** el qué y el porqué. La lista de herramientas, el precio, la opinión, el
dato que sorprende.

**🔴 Qué NO va: el cómo.** Ni un comando, ni un paso a paso, ni una configuración. No por
mezquindad — es que **no entra en una lámina y nadie lo lee ahí**. Un carrusel que intenta
enseñar a instalar Docker fracasa en las dos cosas: no enseña y no engancha.

**Cierre obligatorio:** las cinco piezas terminan pidiendo comentario. Es la bisagra con el
carril 2.

---

## 2 · El entregable — lo que prometemos al pedir comentario

**Trabajo:** cumplir lo prometido, y que el que lo recibe piense *"si esto es lo gratis,
lo otro debe valer la pena"*.

**Formato:** una **página web con link propio**, no un PDF ni un mensaje largo. Motivo
práctico: el DM de Instagram corta en 1.000 caracteres, así que el paso a paso no entra
como texto. Un link entra siempre.

**🟢 Vivo hoy — «El stack de $200»**
`https://claude.ai/code/artifact/667b1ec5-e963-4f8d-b43c-268f4b4243c5`
Las seis herramientas, qué hace cada una, **qué no hace**, y cómo instalarla. Con checklist
que recuerda dónde quedó el lector.
El DM que lleva a ella: [`cola/PARA-PUBLICAR-DM-STACK.md`](cola/PARA-PUBLICAR-DM-STACK.md).

**Qué SÍ va:** el paso a paso completo y real de lo que se prometió. Comandos que funcionan,
tiempos honestos, y en cada herramienta un bloque de **«qué no hace»** — que es la parte que
nadie más escribe y la que hace que se confíe en el resto.

**🔴 Qué NO va:**
- **No se promete más de lo que la página entrega.** Si el carrusel dice "cómo instalarlo",
  la página instala. Si dijera "te armo el sistema", habría que armarlo.
- **No lleva venta de Onia.** Quien pidió una guía gratis y recibe un pitch no vuelve a
  comentar nunca más. La página nombra el sistema propio una sola vez, en la lista de lo
  que la guía **no** cubre.
- **No lleva los archivos.** Los workflows exportados, las plantillas y las configuraciones
  son del carril 3. La guía dice **cómo hacerlo**; la comunidad **te lo da hecho**.

⚠️ **Regla dura de este carril: primero existe el entregable, después se publica la pieza
que lo promete.** El 07-sep el carrusel «Mi stack» ya prometía la guía y la guía no existía
— eso se rompe en el primer comentario, y la cuenta lo paga.

---

## 3 · Comunidad — alto valor, sólo adentro

**Trabajo:** que lo que se aprende adentro no esté afuera.

**Qué SÍ va, y sólo va acá:**
- **Los archivos.** Workflows de n8n exportados y listos para importar, el `SOUL.md` de
  Hermes, plantillas de HyperFrames, los `docker-compose` completos.
- **Lo que salió mal.** Los callejones, los costos que no se ven, lo que hubo que revertir.
  Es lo más valioso que hay y es lo único que no se puede googlear.
- **Lo que todavía no funciona.** Adentro se puede mostrar obra en curso; en la venta no
  (`CLAUDE.md` §*La venta nunca exhibe obra*).
- **Respuestas a casos concretos**, con el negocio de cada uno delante.

**🔴 Qué NO va:** contenido que ya está en el carril 2 con otro título. Si un miembro puede
encontrar afuera lo mismo que paga por ver adentro, la comunidad se muere sola — no de
golpe, de a poco, que es peor.

### ⚠️ Dos cosas sin resolver, y hay que decirlas

1. **La comunidad no existe todavía.** No hay plataforma elegida, ni nombre, ni una sola
   persona adentro. Todo lo de arriba es el diseño del carril, no su estado.
2. **Si la comunidad se cobra, es una línea de negocio nueva** — y `CLAUDE.md` §*El objetivo
   del NEGOCIO manda* lo prohíbe con nueve líneas ya abiertas y cero clientes pagando.
   El test de tres preguntas (§10 de `ONIA_ESTRATEGIA_DE_EMPRESA.md`): ¿se le vende al mismo
   cliente que ya paga? ¿deja de tener sentido sin el núcleo? ¿se entrega sin horas de
   Sergio Urcullo por cliente? **Una comunidad de pago falla la tercera** — la comunidad es
   horas suyas, por definición.

   **Una comunidad gratis, en cambio, pasa**: es el lugar donde viven los que van a comprar
   Onia, no un producto aparte. Ésa es la forma que no abre la décima línea.

   La decisión es de Sergio Urcullo. Mientras no la tome, el carril 3 se diseña pero **no se
   construye**, y el esfuerzo va a los carriles 1 y 2, que sí están andando.

---

## Cómo se alimentan entre sí

| De | A | Qué pasa |
|---|---|---|
| 1 → 2 | El CTA de la pieza pide comentario, y el comentario se responde con el link |
| 2 → 3 | La guía termina diciendo qué **no** cubre. Ahí es donde la comunidad tiene sentido |
| 3 → 1 | Lo que se pregunta adentro es el mejor listado de temas para el próximo carrusel |

**El error a evitar es siempre el mismo en los tres:** dar de más en el escalón anterior.
Un carrusel que enseña a instalar deja sin trabajo al entregable; un entregable que regala
los archivos deja sin sentido a la comunidad. Cada escalón entrega **completo** lo suyo y
**nada** de lo del siguiente.
