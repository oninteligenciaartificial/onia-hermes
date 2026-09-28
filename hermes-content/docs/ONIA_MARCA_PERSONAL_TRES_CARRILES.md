# Marca personal — los tres carriles y qué NO va en cada uno

> **Corrección vigente · 28-sep-2026:** Sergio pidió que los guiones enseñen de
> verdad. Lo público entrega una acción completa y comprobable; la web amplía
> y la comunidad aporta material preparado y aplicación al caso del miembro.
> El [mapa de frentes](ONIA_MAPA_DE_TEMAS.md) reúne ONIA, Platform, Sergio,
> enseñanza de IA y comunidad. Las métricas y estados de septiembre de abajo
> son históricos; no confirman conexiones, archivos ni publicaciones actuales.

> 📍 **Índice del carril, con qué documento manda sobre qué:**
> [`ONIA_CIRCUITO_DE_CONTENIDO.md`](ONIA_CIRCUITO_DE_CONTENIDO.md) — y la misma
> estructura para consultar de un vistazo en
> <https://claude.ai/code/artifact/fb52b4b9-4504-4b8a-afca-46cf2a8f9586>

> Pedido de Sergio Urcullo, 2026-09-07: *"a la hora de que decimos comentá algo y te lo
> envío, prometemos algo como instalar y demás, hay que desarrollarlo… también eso puede ir
> para mi comunidad, así que quiero que ordenes tus cosas"*.
>
> Fuente única del **reparto**: qué va en cada carril y qué no. Si otro doc contradice
> esto, gana éste.
>
> 👉 **Cómo se produce y se distribuye cada recurso** —una sola vez, tres puertas, con su
> catálogo y sus estados— está en
> [`ONIA_RECURSOS_UN_RECURSO_TRES_PUERTAS.md`](ONIA_RECURSOS_UN_RECURSO_TRES_PUERTAS.md).

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

**Trabajo:** que te encuentren, entiendan tu criterio y reciban algo útil.

**Formato:** carruseles del patrón `apple-editorial` en Instagram. Cinco piezas hoy, con su
orden en [`cola/PARA-PUBLICAR-APPLE-ORDEN.md`](cola/PARA-PUBLICAR-APPLE-ORDEN.md).

**Qué SÍ va:** una idea aplicada: prompt, ejemplo, cálculo, caso o criterio con
evidencia. También decisiones propias y humor del trabajo, con propósito claro.

**El cómo sí va.** Se elige una unidad pequeña que quepa y se entregue completa.
Si el tema requiere una instalación larga, el video muestra un paso con su
resultado y la guía desarrolla el proceso completo. No se oculta el procedimiento
para obligar a comentar o entrar a la comunidad.

**Cierre:** una llamada a la acción coherente: guía existente, aplicación en
comunidad, conversación o demo de producto. El comentario con envío de material
sólo se usa con recurso y entrega comprobados; no es obligatorio en cada pieza.

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

### 🎯 Dónde vive esto: `sergiourcullo.com`

Sergio Urcullo, 07-sep: *"podemos empezar a postear este tipo de recursos a una página web
que se llame sergiourcullo.com… y que quede como histórico ahí posteado"*. **Es la decisión
correcta y hay tres razones, no una:**

1. **El link de artifact no es suyo.** Hoy la guía vive en `claude.ai/code/artifact/…`. Un
   dominio propio en el DM se lee distinto, y el activo queda del lado de él.
2. **Se acumula.** Cada guía nueva suma al mismo lugar en vez de ser un link suelto que se
   pierde en la conversación. Eso es lo que convierte contenido en biblioteca.
3. **La que no dijo: SEO.** Alguien que busca "instalar n8n en una PC vieja" lo encuentra.
   Es tráfico que no depende del algoritmo de Instagram — el único de los tres carriles que
   no depende de que alguien scrollee.

**Disponibilidad verificada el 07-sep** contra el registro de Verisign (RDAP): tanto
`sergiourcullo.com` como `.net` responden **404 = libres**. `.dev` está tomado.

**Dónde alojarla — Vercel, DNS en Cloudflare.** No en el VPS: ya sirve `onia.com.bo` en un
contenedor, ya sufrió una penalidad de Hostinger por saturación
([[vps-saturado-deploy-bloqueado]]), y un sitio de contenido estático no tiene por qué
compartir suerte con producción. La zona DNS va a Cloudflare porque **la de Vercel es un
fantasma** ([[onia-dns-cloudflare-no-vercel]]).

🔴 **REGLA DURA: la web NO bloquea la publicación.** Hay cinco piezas rendidas y ninguna
publicada. Si la web se vuelve un proyecto de dos semanas, retrasa todo lo que ya está
listo — y ése es exactamente el patrón que `CLAUDE.md` §*Nada a medias* existe para evitar.
El orden es:

| Cuándo | Qué |
|---|---|
| **Ahora** | Comprar `sergiourcullo.com`. Son ~$12 al año y cinco minutos. Lo hace Sergio Urcullo: **ningún agente ejecuta compras** |
| **Esta semana** | Publicar «Mi stack» con el link de artifact que ya existe. No esperar a la web |
| **Después** | Armar el sitio con el contenido que ya está escrito, y redirigir el artifact hacia allá |

**Qué va en el sitio:** este carril, el 2, y nada más. Los carruseles son de Instagram y lo
de la comunidad es de la comunidad. Un sitio que intenta ser las tres cosas no es ninguna.

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

### 🔴 Corrección del 07-sep: la comunidad SÍ existe

**La primera versión de este documento decía que la comunidad "no existe todavía: no hay
plataforma elegida, ni nombre, ni una sola persona adentro". Es falso, y lo escribí sin
verificar.** Sergio Urcullo me mandó a leer el repo y ahí estaba, con cinco días de
funcionamiento encima. Es exactamente el error que `CLAUDE.md` §*Verificar antes de decir
que no existe* está escrito para evitar.

**Lo que hay, medido en el repo el 07-sep:**

| | |
|---|---|
| **Plataforma** | Comunidad de **WhatsApp**: canal *Announcements* (publica sólo él) + grupo *General* |
| **Nombre** | Onia Community |
| **Arranque** | miércoles **2026-09-02** |
| **Contenido** | serie **D0–D6**, un drop por día, guiones en `ONIA_COMUNIDAD_CONTENIDO.md` |
| **Semana 2** | siete drops ya escritos, arranca **lunes 14-sep** |
| **Biblioteca** | `ONIA_COMUNIDAD_BIBLIOTECA.md` + página Notion — 🔴 **en borrador privado**, falta que Sergio Urcullo la publique |
| **Estado y piezas** | `docs/comunidad/ESTADO_COMUNIDAD.md` |
| **Horarios** | lun-vie 14–17 y 20–22 · sáb 9–15 (La Paz), reuniones con 1 día de anticipación |

**Fuentes del carril, por si otra sesión las busca:** `docs/comunidad/ESTADO_COMUNIDAD.md`
(qué existe y qué se publicó) · `ONIA_COMUNIDAD_CONTENIDO.md` (los guiones y el calendario)
· `ONIA_COMUNIDAD_BIBLIOTECA.md` · `cola/drops/AAAA-MM-DD.md` (cada drop listo para pegar).

### ⚠️ Lo que sigue sin resolver

1. **La comunidad es gratis hoy, y así pasa el test de tres preguntas** — es donde viven
   los que van a comprar Onia, no un producto aparte. **Si algún día se cobra, se convierte
   en línea de negocio nueva** y falla la tercera pregunta (§10 de
   `ONIA_ESTRATEGIA_DE_EMPRESA.md`): una comunidad de pago son horas de Sergio Urcullo por
   cliente. Mientras siga gratis, no hay conflicto.
2. **La palabra clave sigue sin cablear.** `palabras: {}` en el workflow n8n activo de
   private-reply: un "Comentá COMUNIDAD" hoy sale con `palabra=null` y **quien comenta no
   recibe nada, sin dejar registro**. Por eso todos los CTA piden respuesta a mano.
3. **La biblioteca de Notion está en borrador privado.** Es un link que la comunidad ya
   tendría que tener y depende de un clic suyo: Compartir → Publicar en la web.

---

## Cómo se alimentan entre sí

| De | A | Qué pasa |
|---|---|---|
| 1 → 2 | El CTA de la pieza pide comentario, y el comentario se responde con el link |
| 2 → 3 | La guía termina diciendo qué **no** cubre. Ahí es donde la comunidad tiene sentido |
| 3 → 1 | Lo que se pregunta adentro es el mejor listado de temas para el próximo carrusel |

Cada pieza entrega completo lo que promete. El video resuelve una unidad pequeña;
la guía desarrolla el procedimiento; la comunidad aporta el trabajo preparado,
la práctica y preguntas sobre el caso de cada miembro. Enseñar bien afuera
construye confianza y no reemplaza ese acompañamiento.
