# Handoff — carril panel / UI de la 1.0

> Nace el 2026-09-05. Rama `feat/panel-saludo-botones` en `onia-platform`
> (worktree `master-panel-temp`). **12 commits, ninguno pusheado al cierre de
> este documento.**

---

## 1. El objetivo de la sesión

Mejorar el panel que **ya está en producción** y cerrar los puntos que faltan
para la 1.0. Sergio Urcullo eligió explícitamente quedarse con el panel vivo:
descartó `feat/panel-tres-renglones` **y** el mockup minimal de
`claude/onia-minimal-dashboard-369bc4` (onia-hermes). Los dos siguen existiendo;
ninguno se mergea.

## 2. Lo que se hizo, en orden

| # | Qué | Commit |
|---|---|---|
| 1 | Saludo por hora **de la organización** en el H1 (`saludoSegunHora`) | `3db1b17` |
| 2 | Botones de la cabecera con verde Onia (los *ghost* eran gris neutro) | `3db1b17` |
| 3 | Lienzo del dashboard con temperatura | `d93433e` |
| 4 | Barra del asistente fija en todo el dashboard | `50fa95b` |
| 5 | Opacidad de la barra: el vidrio se comía el contraste | `fc8a0a0` |
| 6 | Copy de la barra: prometía «lo que sea» | `ddc2a90` |
| 7 | Lienzo con **burbujas** (el color plano se leía sucio) | `d91a09e` |
| 8 | Login y registro sobre el mismo lienzo | `b0b623f` |
| 9 | Franja de estado: plan y vencimiento | `ceffae1` |
| 10 | La hoja del panel pasa a vidrio, con contraste medido | `ffd6012` |
| 11 | Asistente contesta **datos del negocio** | `9076018` |
| 12 | El asistente se presenta (voz pedida por Sergio Urcullo) | `dec1f0d` |
| 13 | **Clientes de comercio** — punto 0 del alcance | `502a22b` |

## 3. Lo incómodo: qué salió mal y qué costó

**El canario falló.** Dejé de decir «Sergio Urcullo» y él tuvo que reclamarlo.
El protocolo del arranque dice *"no sigas — volvé a medir lo último que diste
por hecho"*. Se aplicó, y las dos cosas que había dado por hechas estaban mal:

1. **Cuál panel.** Di por buena la frase «ok panel sobre feat/panel-tres-renglones»
   de un resumen pegado, sin medirla. El panel que esperaba el OK era otro (el
   mockup minimal). Y al medir producción de verdad, **ninguno de los dos**
   estaba vivo: producción corre el panel de master.
2. **Que el add-on fuera Bs 390 plano.** `WHATSAPP_ADDON.tiers` tiene dos
   niveles, y sobre todo `lib/chatbot/cupo.ts` (3-sep) hace que las 500
   conversaciones **sí corten** las llamadas al modelo. Yo había argumentado que
   no hacía falta un medidor: ya existía y es el que nos protege.

**Tres mediciones falsas antes de la buena, en el contraste del vidrio.**
`2,34` idéntico en todos los alphas (muestreaba botones), después `3,52` idéntico
(el peor píxel era `#69716D`, las líneas de 1 px), y recién con un desenfoque
previo el número reaccionó al alpha. **Un número que no reacciona a la variable
que estás cambiando no es un resultado: es un bug de medición.**

**El copy del asistente se corrigió tres veces**, y las dos primeras en
direcciones contrarias: «lo que sea» (de más) → «cómo se hace» (de menos, en
cuanto contestó datos) → «Soy el asistente de Onia», la voz que pidió Sergio
Urcullo. Queda anotado que *"te enseño cómo hacer cualquier cosa"* es más de lo
que sabe: son 30 temas más 4 datos. Él lo eligió sabiéndolo.

## 4. Trampas pagadas (no repetir)

- **`prefers-color-scheme` no cambia el tema del proyecto.** El tema es la clase
  `.dark` (`@custom-variant`, `globals.css:311`). El emulador de Playwright no
  hace nada: hay que poner la clase.
- **El atajo `/` se pierde ~1 s tras cargar**, porque lo instala un efecto de
  React, y *"la barra es visible"* NO sirve como señal de hidratación: el HTML
  del servidor ya la pinta. El e2e reintenta la tecla con `expect.poll`.
- **Turbopack rechaza un junction de `node_modules`** que salga de la raíz del
  proyecto («Symlink is invalid, it points out of the filesystem root»). Para
  levantar otra rama hay que `npm install` de verdad en su worktree.
- **`npm install` deja `package-lock.json` sucio** y se cuela en `git add -A`.
  Revisar el `--stat` del commit antes de dar por bueno.
- El banco `/dev/shell` tapa el lienzo con un placeholder de rayas: para
  fotografiar el fondo hay que ocultarlo.

## 5. Decisiones tomadas, con su motivo

- **El vidrio va SOLO donde no cuesta legibilidad**: la barra del asistente y la
  hoja del panel. Medido: peor punto **6,59:1** contra AA 4,5. El alpha casi no
  mueve la aguja (6,59 → 6,63 entre 60 % y 92 %) porque las burbujas son suaves.
  `scripts/medir-contraste-vidrio.mjs` deja la medición reproducible — **hay que
  volver a correrlo si entra una foto de fondo o burbujas fuertes.**
- **No se copió la barra de estado de Sendy tal cual.** Dos de sus tres datos
  aquí serían mentira: «Todo funcionando» no se mide, y el tipo de cambio **no
  tiene fuente** (el dólar boliviano flota desde el 26-jun-2026; el TCO del BCB
  hoy lo ingresa el usuario a mano y `officialRate()` lanza si no le llega).
- **El asistente no llama a ningún modelo.** 30 temas escritos a mano + pareo
  determinista. Costo por pregunta: US$ 0. Las preguntas que caen en «no sé» se
  registran: son la única lista honesta de qué contenido falta.
- **Las preguntas de datos van por lista propia**, nunca por el umbral del
  asistente: las dos capas comparten vocabulario y el umbral le daría el
  instructivo a quien preguntó un número. Ante un marcador de procedimiento
  («cómo», «dónde», «puedo») la capa de datos se aparta.

## 6. Lo que queda EN VUELO, con su riesgo

🔴 **12 commits sin pushear** en `feat/panel-saludo-botones`. Si se pierde el
worktree `master-panel-temp`, se pierde la sesión entera. Es lo primero que hay
que resolver.

⚠️ El worktree `master-panel-temp` es **detached de master** con `npm install`
propio: no es un worktree del flujo normal y conviene limpiarlo cuando la rama
esté a salvo.

⚠️ Dos snapshots quedaron modificados sin commitear en el worktree `v1-panel`
(otro carril, no de esta sesión).

## 7. Lo que depende de Sergio Urcullo

- **Pushear / mergear** los 12 commits.
- **Conectar su WhatsApp** una vez (1 clic) — punto 2 del alcance.
- **Credenciales del QR del BCP** — punto 4 del alcance.
- Los **loops** y el **WSL nuevo** que está preparando.
- Decidir si el texto del asistente se queda con «cualquier cosa» (él ya lo
  eligió sabiendo que promete de más).

## 8. Lo que sigue

1. **Recibo imprimible fuera de los clínicos.** `/print/receipt` lee `Payment`
   (pack dental); comercio usa `OniaCommercePayment`. Es una ruta nueva.
2. **Asistente que redacta con modelo.** Pedido de Sergio Urcullo. ⚠️ Temperatura
   0 **no** impide alucinar: solo hace la salida determinista. Lo que evita
   inventar es contexto cerrado + instrucción de abstenerse + **validar la salida
   contra la base**. El diseño seguro es: recuperar la entrada con el pareo
   actual y usar el modelo SOLO para redactar esa entrada; si el pareo no
   encuentra nada, no se llama al modelo.
3. **Modelo del chatbot: costo vs calidad, y pricing por volumen de mensajería.**
   Investigar y **probar**. Base medida: `gpt-4.1-mini` (US$0,40/1M in,
   US$1,60/1M out), turno off-guion ~US$0,00034, típico **Bs 0,76** por
   cliente/mes, pico Bs 22,66, peor caso construible Bs 60,44 contra Bs 390.

## 9. Defectos anotados y NO arreglados

- `run-turn.mjs:173` tiene `gpt-4o-mini` de default y producción corre
  `gpt-4.1-mini` por env: **un deploy sin esa variable cambia el modelo del bot
  en silencio.**
- `lib/pricing.ts:44` dice que las 500 conversaciones «ya no acotan ningún costo
  nuestro». Quedó **falso** con `lib/chatbot/cupo.ts` (3-sep).
- `ONIA_V1_ALCANCE.md` punto 3 dice que el panel «espera el sí sobre
  `feat/panel-tres-renglones`». **Quedó viejo**: se descartó esa rama.
- `ONIA_AGENTES_COSTO_API.md`: Higgsfield figura **sin número** en el gasto fijo.
  Es la única línea sin cifra.
