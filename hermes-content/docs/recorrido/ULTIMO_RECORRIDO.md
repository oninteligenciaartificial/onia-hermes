# El recorrido de cliente — último estado

**Un tema = un archivo sin fecha. Este archivo se EDITA, no se duplica.** Las fotos con fecha
van en `capturas/`.

Cómo se reproduce, y es un comando, no una intención:

    cd /root/loops/onia-hermes-recorrido && node scripts/recorrido_cliente.mjs

---

## Medido el 2026-09-02 22:20 UTC

**Llegó hasta el paso 2 de 8.** El corte NO es una rotura del producto: el paso 3 crea una
cuenta real en la base de producción y por eso está detrás de `--escribir`, apagado por defecto.

| # | paso | estado | qué se vio |
|---|---|---|---|
| 1 | Entrar a `onia.com.bo` y que se VEA | ✔ OK | cargó en 1,8 s, 6.977 caracteres visibles |
| 2 | Encontrar el camino de alta | ✔ OK | 7 botones de alta; **2 clics** hasta el formulario |
| 3 | Pedir acceso / registrarse | · no medido | el formulario **existe y pide contraseña**. No se envió: `--escribir` apagado |
| 4 | Entrar a la plataforma | · no medido | sin cuenta y sin `RECORRIDO_USER`/`RECORRIDO_PASS` |
| 5-8 | rubro · dato · cobro · bandeja | · no medido | sin sesión |

Capturas: `capturas/paso-01-home.png`, `paso-02-camino-de-alta.png`,
`paso-03-pedir-acceso.png`. Datos crudos en `capturas/resumen.json`.

**No se escribió nada en la base esta vuelta.** Cero filas creadas, cero por limpiar.

---

## 🔴 El alta NO está cerrada. Lo que dice la documentación es falso

`CLAUDE.md` y el prompt de este carril dan por conocida esta trampa:

> «`/register` dejó de crear cuentas y `/empezar` es un formulario de "Pedí tu acceso"».

**Medido en vivo hoy, las dos mitades son falsas:**

- **`/empezar` no es un formulario.** Tiene **0 `<input>` y 0 `<form>`** — contado con el DOM,
  dos veces, con dos instrumentos distintos. Es una landing cuyo título es *"Creá tu cuenta y
  usalo de verdad 14 días"* y cuyos botones saltan a `app.onia.com.bo/register`.
- **`/register` está VIVO y crea cuentas.** Es un asistente de dos pasos —(1) tu rubro, entre
  cinco tarjetas; (2) tu cuenta— con nombre, correo, contraseña, nombre del negocio y un botón
  **"Crear mi cuenta — 14 días gratis"**. Se ve en `capturas/paso-03-pedir-acceso.png`.

Por qué importa: la regla existe para que nadie prometa un alta inexistente. Hoy manda al revés
— hace creer que la puerta está cerrada cuando está abierta, y cualquier sesión que la lea va a
"arreglar" una promesa que el producto sí cumple. **La corrección es del carril dueño de
`CLAUDE.md`, no de este.**

## Lo que sí es un dato de fricción: el alta está a DOS clics, en otro host

El camino completo es `onia.com.bo/` → `onia.com.bo/empezar` → `app.onia.com.bo/register`.
`/empezar` es una pantalla intermedia que **no pide ningún dato**: sólo vuelve a prometer y
manda a otro lado. Es una pregunta abierta —no un defecto probado— si conviene que el primer
clic caiga directo en el formulario.

## Dos trampas del instrumento, encontradas y evitadas

Las dos son de la familia *"medí con el instrumento correcto"*, y las dos me habrían hecho
reportar un defecto inexistente:

1. **Los nombres de iconos en el texto NO son el bug del login.** El DOM de `/register`
   devuelve `dentistry`, `credit_card_off`, `smart_toy` como texto — idéntico al defecto que
   Sergio encontró en producción. Pero es una fuente de **ligaduras**: el texto del DOM *es* el
   nombre del icono y renderiza como glifo. **Mirada la captura, se ven los dibujos, no las
   palabras.** El DOM sirvió para sospechar; sólo la imagen podía confirmar o descartar.
2. **El único campo con `name` es el honeypot.** Los cuatro campos reales del alta no tienen
   `name` ni `id`, sólo `placeholder`. El único con `name` es `sitioWeb`, la trampa anti-bots.
   Un relleno que busque por `name` —lo obvio— llena **exactamente la trampa y nada más**, y
   después culpa al producto por rechazar el alta. El script lo saltea a propósito.

## Estado del instrumento

`scripts/recorrido_cliente.mjs` existe y corre. Lo que ya sabe hacer:

- Captura con **scroll real** antes de la foto (`fullPage` solo devuelve tiras en blanco en
  este sitio: las secciones se revelan con `IntersectionObserver`) y con el **Chromium
  completo** (`channel: 'chromium'`), no el `headless_shell` que inventa texto roto.
- **Sigue la cadena** de alta en vez de asumir que es una pantalla. Es lo que falló en la
  primera corrida de hoy: tomó `/empezar` por el formulario, contó cero campos y reportó "el
  alta no crea cuenta" — un falso hallazgo que contradecía al producto.
- **Descubre los campos** en vez de hardcodearlos, para que un cambio de forma se note en vez
  de romper un selector.
- Sale con código 0 aunque el recorrido se corte: "se corta en el paso 3" es el **reporte**, no
  una caída del script.

Lo que le falta: los pasos 4 a 8 nunca se ejecutaron todavía. Están escritos contra rutas
supuestas (`/onboarding`, `/patients`, `/billing`, `/dashboard`) que **nadie verificó**.
Hasta que una corrida con sesión las toque, esas cuatro rutas son una hipótesis.
