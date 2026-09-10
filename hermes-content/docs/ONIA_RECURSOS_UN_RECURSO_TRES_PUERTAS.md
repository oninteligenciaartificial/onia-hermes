# Un recurso, tres puertas — cómo se administra lo que prometemos

> Sergio Urcullo, 2026-09-07: *"a veces decimos al final comentá tal palabra y te paso tal
> cosa… luego a la hora de que enviemos a la comunidad, podemos enviar lo mismo que
> subimos, o cómo podemos administrarlo. Para eso sería crear la página. Organizalo"*.
>
> Fuente única de **cómo se produce y se distribuye un recurso**. El reparto de qué va en
> cada carril está en [`ONIA_MARCA_PERSONAL_TRES_CARRILES.md`](ONIA_MARCA_PERSONAL_TRES_CARRILES.md);
> **por qué la comunidad sigue valiendo aunque todo sea público, y el registro de videos**,
> en [`ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md`](ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md);
> **el ritmo con que se produce todo eso**, en
> [`ONIA_MOTOR_SEMANAL_CONTENIDO.md`](ONIA_MOTOR_SEMANAL_CONTENIDO.md).

## El problema, dicho sin vueltas

Hoy hay **dos líneas de producción corriendo en paralelo**: los drops diarios de Onia
Community y los recursos que se prometen al pedir comentario en Instagram. Con una sola
persona, mantener las dos significa escribir todo dos veces — y la segunda siempre sale
peor, porque se hace apurado.

**La respuesta no es elegir una. Es que sean el mismo contenido.**

## La regla

> **Un recurso se escribe UNA vez, vive en la web, y las tres puertas apuntan al mismo
> lugar. Lo que cambia entre puertas no es el contenido: es CUÁNDO llega y QUÉ lo acompaña.**

```
                    ┌──────────────────────────┐
                    │   sergiourcullo.com/x    │  ← se escribe UNA vez
                    │   la página del recurso  │     y no se duplica nunca
                    └────────────┬─────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
   COMUNIDAD                INSTAGRAM                  GOOGLE
   día 1                    día 3                      siempre
   el link + los            "comentá X"                 lo encuentra
   archivos listos          → DM con el link            quien lo busca
   + él contesta
```

### Por qué la comunidad vale la pena si el recurso es público

Ésta es la pregunta que hay que tener contestada, porque alguien la va a hacer. **La
comunidad no vale por contenido secreto. Vale por tres cosas que no se pueden copiar:**

| | |
|---|---|
| **Llega primero** | La comunidad lo tiene 2–3 días antes que el público. No es poco: es la diferencia entre enterarse y estar adentro |
| **Trae los archivos** | La página enseña **cómo hacerlo**. La comunidad recibe el workflow exportado, la plantilla, el `docker-compose` — el trabajo hecho |
| **Él contesta** | En la web nadie te responde. En General sí, con tu negocio delante |

Guardar el contenido para adentro cuesta el doble de trabajo y regala el SEO. Guardar el
**acompañamiento** no cuesta nada extra y es lo que la gente realmente paga con su atención.

## Los tres estados de un recurso

| Estado | Dónde está | Quién lo ve |
|---|---|---|
| 🔵 **Borrador** | Sólo en el repo | Nadie |
| 🟡 **En comunidad** | Publicado en la web, link pasado sólo en Announcements | Los de adentro |
| 🟢 **Público** | El mismo link, ahora prometido en una pieza de Instagram | Todos |

Un recurso **nunca salta de 🔵 a 🟢**. Pasa siempre por la comunidad primero — ése es el
beneficio de estar adentro, y no cuesta producir nada aparte.

## La receta para sacar un recurso nuevo

1. **Escribir la página.** Una sola, en la web, con su slug corto (`/stack`, `/prompts`).
   Con el bloque de **«qué no hace»** en cada cosa que recomiende: es la marca de la casa.
2. **Anotarlo en el catálogo de abajo** con estado 🔵.
3. **Pasarlo a la comunidad** (Announcements). Estado → 🟡. El drop de ese día **es** el
   link, con dos líneas de por qué le sirve. No se reescribe el contenido en WhatsApp.
4. **Dos o tres días después**, la pieza de Instagram que lo promete. Estado → 🟢.
5. **El DM lleva el link**, no el contenido. (Instagram corta el mensaje directo en 1.000
   caracteres: el paso a paso no entra como texto, el link sí.)

🔴 **La regla que ya nos mordió una vez: primero existe el recurso, después se publica la
pieza que lo promete.** El 07-sep el carrusel «Mi stack» prometía una guía que no existía.
Eso se rompe en el primer comentario.

## Catálogo de recursos

| Slug | Recurso | Estado | Lo promete | Archivos para comunidad |
|---|---|---|---|---|
| [`/homelab`](https://sergiourcullo.vercel.app/homelab) | **El homelab** — qué es, cuánto gasta de luz, qué corre adentro, cómo armarlo. Ocho preguntas del video contestadas | 🟢 **público** | Reel del 07-sep (`HOMELAB`) — ⚠️ la promesa salió ANTES que el recurso | 🟢 [`/homelab/archivos`](https://sergiourcullo.vercel.app/homelab/archivos) — primer arranque, respaldo automático, lista de la BIOS |
| [`/stack`](https://sergiourcullo.vercel.app/stack) | **El stack de $200** — las 6 herramientas, qué hace cada una, qué no hace, cómo instalarla | 🟡 **en comunidad** | Carrusel «Mi stack», lámina 11 (`COMENTÁ STACK`) | 🟢 [`/stack/archivos`](https://sergiourcullo.vercel.app/stack/archivos) — `docker-compose` de n8n, las 6 respuestas de WhatsApp, plantilla del `SOUL.md` |

> 🟢 **La web está arriba desde el 08-sep: https://sergiourcullo.vercel.app**. Fuente en
> `hermes-content/sitio-sergiourcullo/`; para volver a desplegar, `deploy_to_vercel` con
> los archivos de esa carpeta (el proyecto NO se publica por push desde este repo).
> El artifact `667b1ec5` queda como respaldo; el link que se reparte es el de arriba.

### Candidatos, en orden — cada uno sale de un drop que ya funcionó

Los recursos no se inventan: **se ascienden**. Un drop que generó respuestas ya demostró
que el tema interesa, y convertirlo en página cuesta poco porque el contenido está probado.

| Slug | Sale de | Qué sería |
|---|---|---|
| `/prompts` | D2 — los 5 prompts de negocio | Los prompts completos, con el hueco marcado para que cada uno ponga lo suyo |
| `/que-automatizar` | D3 — la auditoría `veces × minutos` | La tabla en blanco para llenar, y cómo leer el resultado |
| `/habilidades` | D4 — las habilidades de Claude | Cómo escribir la primera, con una de ejemplo entera |

## Qué NO se sube nunca a la web

- **Los archivos.** Workflows exportados, plantillas, configuraciones: ésos son de la
  comunidad, y son la única razón material para estar adentro.
- **Precios de Onia.** Estas páginas son contenido, no venta. Onia se nombra una sola vez,
  en la lista de lo que el recurso **no** cubre.
- **Nada con datos reales de clientes**, ni capturas sin borrar lo que identifique a nadie.

## La web: qué es y qué no es

**Es** el lugar donde vive el recurso, para que haya un link estable que sobreviva a las
plataformas y para que Google lo encuentre. Un sitio de guías, nada más.

**No es** un blog, ni un portafolio, ni la web de Onia. `onia.com.bo` vende el sistema;
ésta enseña. Si se mezclan, el que llega desde un comentario cree que le están vendiendo
antes de leer una línea — y ahí se pierde el único clic que iba a dar.

**Estado hoy: 🟢 en el aire, https://sergiourcullo.vercel.app** (08-sep). En Vercel gratis, hasta que se pueda comprar
el dominio. El día que se compre, se agrega a este mismo proyecto y **los slugs no cambian**:
los links ya repartidos por DM siguen sirviendo. Por eso no se tocan.
