# Dónde va cada cosa

> 📍 **Índice del carril, con qué documento manda sobre qué:**
> [`ONIA_CIRCUITO_DE_CONTENIDO.md`](ONIA_CIRCUITO_DE_CONTENIDO.md) — y la misma
> estructura para consultar de un vistazo en
> <https://claude.ai/code/artifact/fb52b4b9-4504-4b8a-afca-46cf2a8f9586>

> Sergio Urcullo, 2026-09-08: *"¿pero dónde publico eso? Separá la comunidad y mi marca
> personal, se supone que lo de la comunidad tiene que ser exclusivo"*.
>
> Tenía razón en las dos cosas. **Este documento manda sobre los otros** en todo lo que sea
> "qué va en qué lugar".

## 🔴 Primero, la corrección: el modelo anterior dejaba poco exclusivo

Como estaba escrito, lo único que la comunidad tenía de propio era **llegar seis días
antes**. Y eso no se siente exclusivo cuando después todo está afuera y gratis. El reclamo
es correcto y el modelo se corrige acá.

**La separación no es de temas. Es de PROFUNDIDAD.**

| | | |
|---|---|---|
| **La web** | *entendés* | qué es, por qué importa, qué instalar, en qué orden, qué NO hace |
| **La comunidad** | *lo tenés hecho* | el archivo armado y probado, listo para pegar |

Los comandos que están en la web son los **públicos de la documentación oficial** — los
googlea cualquiera y no son de nadie. Lo que **no** está afuera nunca es la configuración
armada: el `docker-compose` completo con las variables ya puestas, el workflow exportado
para importar, la plantilla lista para llenar.

> **La web te enseña a hacerlo. La comunidad te lo da hecho.**

Nadie que lea la guía se siente estafado —enseña de verdad—, y nadie que esté adentro
siente que le da igual estar afuera.

---

# La tabla, sin vueltas

## Los lugares

⚠️ **Corregido el 10-sep: faltaba `@oniahq`.** Esta tabla decía "los cuatro lugares" y no
listaba la cuenta de la empresa — así que la pieza de producto («Cuatro cosas a mano») no
tenía lugar definido en el doc que manda sobre lugares, y cada sesión lo resolvía de
memoria.

| Lugar | Qué es | Quién entra |
|---|---|---|
| **Instagram** `@sergiourcullo` | videos cortos, carruseles, historias — la marca personal | todos |
| **Instagram** `@oniahq` | la cuenta de la EMPRESA: piezas de producto. Sólo nombra módulos 🟢 del `ONIA_CATALOGO_DE_VENTA.md`, cero cifras inventadas, cero obra | todos |
| **YouTube** | el tema entero en video | todos |
| **La web** `sergiourcullo.vercel.app` | las guías escritas | todos |
| **Onia Community** (WhatsApp) | drops diarios + los archivos | los que entran |

## Cada cosa, y adónde va

| Cosa | Dónde se publica | ¿Exclusivo? |
|---|---|---|
| Video corto diario | **Instagram** | no |
| Carrusel | **Instagram** (`@sergiourcullo`; si es pieza de producto, `@oniahq`) | no |
| **Carrusel cuyo tema es la semana VIGENTE del motor** | **comunidad**, Announcements — abre la semana con el mapa entero | ✅ **sí** |
| Historia | **Instagram** | no |
| Video largo del tema | **YouTube** | no |
| La guía escrita | **la web**, `/tema` | no |
| **El drop diario** | **comunidad**, canal Announcements | ✅ **sí** |
| **Los archivos armados** | **la web**, `/tema/archivos` — link **sólo** en Announcements | ✅ **sí** |
| **Lo que salió mal** | **comunidad** | ✅ **sí** |
| **Responder tu caso** | **comunidad**, grupo General | ✅ **sí** |
| El link del recurso al que comenta | **DM de Instagram** | no |

> **La fila del carrusel de semana vigente nace del 10-sep**, con «Mi stack»: Sergio
> Urcullo — *«'Mi stack' NO va al perfil público, va a la comunidad»*. La razón que la
> vuelve regla: la semana del motor ya cuenta ese tema en Instagram con seis videos, uno
> por día. Un carrusel del mismo tema en el perfil la spoilea (antes) o la resume
> (después); en Announcements, en cambio, es el mapa de apertura que sólo ve el de
> adentro. El detalle del caso: `cola/AUDITORIA-8-CARRUSELES.md`, «El reparto, cerrado».

⚠️ **Los archivos viven en la web pero NO son públicos.** `/tema/archivos` no está enlazada
desde ninguna página, lleva `noindex` y está bloqueada en el `robots.txt`. Está ahí sólo
porque WhatsApp es pésimo archivo: a las dos semanas nadie encuentra nada en el scroll del
canal. **El link se pasa únicamente en Announcements.**

## Un tema, de punta a punta

Tomemos «el panel del servidor». Lo mismo sirve para cualquiera:

```
LUN  📱 video     «tu servidor sin escribir comandos»        → Instagram, público
     💬 drop      qué es, por qué éste y no el otro          → comunidad, EXCLUSIVO
                  + el docker-compose para pegar             → EXCLUSIVO

MAR  📱 video     el comando en pantalla                     → Instagram, público
     💬 drop      qué hacer si tira error de puerto          → comunidad, EXCLUSIVO

MIÉ  📱 video     «esto casi me borra un contenedor»         → Instagram, público
     💬 drop      qué botón no tocar y cómo se recupera      → comunidad, EXCLUSIVO
...
DOM  🌐 guía      /panel — todo lo conceptual y el orden     → la web, PÚBLICO
     🔒           /panel/archivos — los 3 archivos juntos    → link sólo en Announcements

LUN+1 📱 video    «comentá PANEL y te paso la guía»          → Instagram
      📩 DM       el link de /panel + invitación             → público el link
```

**El que sólo mira Instagram** entiende de qué se trata.
**El que lee la guía** puede hacerlo solo, con trabajo.
**El que está adentro** lo tiene hecho, y si se traba pregunta.

Tres niveles, y cada uno recibe algo entero. Ninguno se siente estafado.

---

## Lo que NUNCA se publica en la web

1. **Los archivos armados en una página pública.** Van en `/tema/archivos`.
2. **Lo que salió mal, con capturas propias.** En público un error propio envejece mal y
   expone; adentro es lo más útil que hay.
3. **Respuestas a casos concretos.** Son de quien preguntó, en General.
4. **Un recurso antes de que la comunidad lo haya tenido.** Si sale a la web primero, se
   perdió la única ventaja de tiempo que hay.

## Lo que NUNCA se guarda para la comunidad

1. **El conocimiento.** Si la guía no alcanza para hacerlo, está mutilada, y se nota.
2. **La respuesta a "¿cómo se hace?".** Eso va afuera, completo, siempre.

**La comunidad no se sostiene escondiendo. Se sostiene entregando el trabajo hecho.**

## Y la pregunta más incómoda, contestada

*«Si la guía tiene todo, ¿para qué entro?»*

> Porque la guía te dice **qué escribir**, y adentro está **escrito**. Porque cuando te
> trabe, acá hay alguien que contesta. Y porque lo que casi nadie publica —lo que me salió
> mal— sólo lo cuento adentro.

Si alguien lee la guía, lo hace solo y nunca entra: **perfecto**. Ése no iba a entrar
igual, y ahora sabe quién sos.
