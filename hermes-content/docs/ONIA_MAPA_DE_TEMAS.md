# El mapa de temas — de dónde sale lo que se graba

> 📍 **Índice del carril, con qué documento manda sobre qué:**
> [`ONIA_CIRCUITO_DE_CONTENIDO.md`](ONIA_CIRCUITO_DE_CONTENIDO.md) — y la misma
> estructura para consultar de un vistazo en
> <https://claude.ai/code/artifact/fb52b4b9-4504-4b8a-afca-46cf2a8f9586>

> Sergio Urcullo, 2026-09-08: *"hoy se me puede ocurrir que es un VPS y le hago un video,
> ¿eso va a la comunidad o a la web? O mejor armemos una estructura de todo lo que queramos
> hacer y de ahí ya veo qué puedo grabar. Por ejemplo ahorita hice un video para YT sobre
> qué es Claude y Claude Code"*.
>
> Fuente única del **backlog**. El ritmo con que se produce está en
> [`ONIA_MOTOR_SEMANAL_CONTENIDO.md`](ONIA_MOTOR_SEMANAL_CONTENIDO.md).

## La pregunta del VPS, contestada primero

*"¿Va a la comunidad o a la web?"* — **La pregunta no es dónde. Es cuándo.** Un tema no
elige puerta: pasa por las tres, en orden.

```
grabás el video   →  IG, hoy
contás el cómo    →  comunidad, hoy
se junta con      →  la web, cuando el tema esté completo
los de la semana
```

Lo que sí hay que decidir de cada tema es **de qué tamaño es**, porque eso cambia todo:

| | Tema de UNA pieza | Tema de SEMANA |
|---|---|---|
| Ejemplo | «qué es un VPS» | «montá tu servidor» |
| Se agota en | un video y un drop | seis días |
| Termina en | nada más | una **guía en la web** |
| ¿Puede prometer? | no | sí, la semana siguiente |

**«Qué es un VPS» es de una pieza.** Se explica en cuarenta segundos y no hay paso a paso
que dar: no da para guía y no hace falta que dé. Se graba, se cuenta mejor en el drop del
día, y listo.

⚠️ **El error a evitar es al revés**: agarrar un tema de semana y gastarlo en un video
suelto. Si hacés «montá tu servidor» en una sola pieza, quedó contado por encima y ya no se
puede volver a él sin repetirse.

## YouTube cambia una pieza del modelo, y para mejor

Esto no estaba contemplado hasta hoy. El video de **«qué es Claude y Claude Code»** es
largo: no es una pieza de IG, es **el desarrollo completo de un tema**.

> **En YouTube, el video ES el recurso.** No promete uno: es uno.

Eso le da a cada canal un trabajo distinto y ninguno pisa al otro:

| Canal | Qué hace | Formato |
|---|---|---|
| **Instagram** | que te encuentren | corto, diario, un ángulo por vez |
| **YouTube** | el tema entero, en video | largo, **diario desde el 17-sep** ⚠️ |
| **La web** | el tema entero, en texto — **con el video de YouTube arriba** | la guía |
| **Comunidad** | el cómo, los archivos, y tus preguntas | drops diarios |

> ⚠️ **Corregido el 2026-09-25.** En la fila de YouTube decía «largo, uno por semana o cada
> dos». Medido: el 17-sep Sergio Urcullo pasó YouTube a **diario** —primero se termina la serie
> «Claude Code de cero» y después la alimentan los cortos que pegan—
> ([`ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md`](ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md) §«La escalera
> a YouTube»). En cadencia y YouTube manda ése; el resto de esta tabla sigue igual.

**La página de la web pasa a tener las dos formas del mismo tema:** el video para el que
prefiere mirar, y la guía escrita para el que va a copiar comandos. Es la misma página,
sirve al doble de gente, y no cuesta producir nada extra.

Y hay un motivo práctico además: **YouTube es un buscador**. Un video de «qué es Claude
Code» en español se sigue encontrando meses después. Instagram no hace eso.

✅ **Hecho el 11-sep:** la página del tema en la web,
[`/claude-code`](https://sergiourcullo.vercel.app/claude-code), se publicó con los videos 01 y
02 de YouTube embebidos (commit `0533c8e7`, `sitio-sergiourcullo/claude-code/index.html`).

> ⚠️ **Corregido el 2026-09-25.** Acá decía: *«🔴 Pendiente de Sergio Urcullo: el video de
> Claude y Claude Code ya está grabado. En cuanto esté publicado, su página en la web
> (`/claude-code`) es lo próximo que hay que escribir — y ahí se embebe. Falta el link de
> YouTube.»* Medido en el repo: la página existe desde el 11-sep con los dos videos. Lo que
> queda abierto es el lugar del video 03, que sigue comentado en la página (`VIDEO03_ID`).

---

# El backlog

Todo sale de lo que ya usa y puede mostrar en pantalla. **Nada que no tenga andando.**

Marcas: **`S`** tema de semana (termina en guía) · **`P`** tema de una pieza.
Estado: 🟢 recurso publicado · 🟡 en curso · ⬜ sin empezar.

## 1 · Servidor propio

| | Tema | Estado |
|---|---|---|
| **S** | Montá tu homelab con una PC vieja | 🟢 [`/homelab`](https://sergiourcullo.vercel.app/homelab) |
| **S** | El panel: manejá el servidor sin escribir comandos | ⬜ |
| **S** | Respaldos: qué pasa el día que el disco muere | ⬜ |
| **S** | Entrar desde afuera sin exponerte (VPN) | ⬜ |
| P | Qué es un VPS y cuándo conviene contra el homelab | ⬜ |
| P | Qué es Docker, explicado sin jerga | ⬜ |
| P | Cuánta luz gasta tener un servidor prendido | ⬜ |
| P | Por qué una notebook vieja es mejor servidor que una PC | ⬜ |

## 2 · Automatización

| | Tema | Estado |
|---|---|---|
| **S** | Tu primer flujo en n8n, de cero | ⬜ |
| **S** | Cómo saber qué automatizar primero (`veces × minutos`) | ⬜ · sale del drop D3 |
| **S** | El seguimiento que no se olvida de ningún cliente | ⬜ |
| P | Qué es un webhook, en un minuto | ⬜ |
| P | El flujo más simple que le sirve a cualquier negocio | ⬜ |
| P | Por qué empezar con UN flujo y no con cinco | ⬜ |

## 3 · IA aplicada

| | Tema | Estado |
|---|---|---|
| **S** | Qué es Claude y qué es Claude Code | 🟢 [`/claude-code`](https://sergiourcullo.vercel.app/claude-code) con los videos 01 y 02 (11-sep) · la instalación, en el paso 04 de [`/stack`](https://sergiourcullo.vercel.app/stack) · ⚠️ corregido el 25-sep: decía «🟡 video de YouTube grabado … falta el link para embeber» |
| **S** | Escribí tu primera habilidad (skill) | ⬜ · sale del drop D4 |
| **S** | Los cinco prompts que uso para vender | ⬜ · sale del drop D2 |
| **S** | Un agente que te avisa cuando algo se rompe | ⬜ · Hermes |
| P | La diferencia entre pedirle algo y que lo haga solo | ⬜ |
| P | Qué NO le delegaría nunca a una IA | ⬜ |
| P | Cuánto cuesta de verdad tener un agente corriendo | ⬜ |

## 4 · Atender clientes

| | Tema | Estado |
|---|---|---|
| **S** | WhatsApp Business ordenado, de punta a punta | ⬜ |
| P | Las seis respuestas guardadas que necesita todo negocio | ⬜ · ya escritas en `/stack/archivos` |
| P | La respuesta que cierra, y por qué casi nadie la tiene | ⬜ |
| P | Por qué contestar rápido vende más que bajar el precio | ⬜ |

## 5 · Construir un negocio en Bolivia

| | Tema | Estado |
|---|---|---|
| **S** | Todo mi stack y lo que cuesta | 🟢 [`/stack`](https://sergiourcullo.vercel.app/stack) |
| P | Stripe no acepta Bolivia: cómo cobra uno acá | ⬜ · ya es el carrusel Founders BO |
| P | Lo que gasto por mes para que todo funcione | ⬜ |
| P | Qué cambió cuando dejé de hacer todo a mano | ⬜ |

## 6 · Cómo hago el contenido

| | Tema | Estado |
|---|---|---|
| P | Los carruseles los genera un script, no los diseño | ⬜ |
| P | Video renderizado desde HTML | ⬜ · HyperFrames |
| P | Por qué escribo «qué NO hace» en todo lo que recomiendo | ⬜ |

---

## Cómo se usa esto

1. **El domingo se elige el tema de la semana** de las filas **`S`**. Ése manda: los seis
   días salen de él.
2. **Cuando se te ocurra algo, no lo grabes: anotalo acá** con su marca. Si es **`P`** se
   graba cualquier día como pieza suelta; si es **`S`**, espera su semana.
3. **Un tema `P` puede ascender a `S`** si el video pega fuerte. Ahí se mueve de fila y se
   le arma la semana.
4. **Cuando un tema termina en guía**, se le pone el link y queda 🟢. Un tema 🟢 se puede
   volver a prometer en videos nuevos: **una guía buena no se gasta en un solo video.**

## Lo que NO va en este mapa

- **Temas que no tiene andando.** Cada fila de acá se puede mostrar en pantalla hoy. El día
  que se escriba de algo que no usa, se nota — y es lo único que no se recupera.
- **Nada de Onia como producto.** Este contenido enseña; la venta es otra superficie.
- **Nada de Higgsfield hasta que se resuelva el cobro anual en reclamo**
  ([[higgsfield-cobro-anual-no-deseado]]). Recomendar la plataforma que te cobró de más es
  un problema esperando.
