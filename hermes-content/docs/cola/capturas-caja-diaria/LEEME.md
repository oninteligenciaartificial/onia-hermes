# Caja diaria (PR #110) — para el OK de Sergio Urcullo

Capturas de 390 y 1440 px del banco nuevo `/dev/caja-diaria` (no existía): monta la pantalla real `CajaDiariaClient` dentro del shell y responde la API en el navegador con la misma forma y el mismo cálculo. `?estado=sin-abrir|abierta|cerrada` y `?rol=dueno|recepcion`. Letra Instrument Sans verificada.

**PR #110** · código en `34daf14e` · cambios de banco en `wip/cap110`: `a7e45f28` (nombre del plan) y `51763ef3` (banco nuevo).

Qué mirar, en este orden:
1. `caja-diaria-sin-abrir-*.png`: «Abrir caja de hoy» con fondo inicial.
2. `caja-diaria-abierta-dueno-*.png`: fondo Bs 100, cobrado Bs 550, efectivo esperado Bs 230; cobros por medio y por persona; egreso «Taxi» Bs 20; formulario de cierre.
3. `caja-diaria-abierta-recepcion-*.png`: lo que ve recepción (no debería ver el esperado; ver el primer problema).
4. `caja-diaria-cerrada-descuadre-dueno-*.png`: contado Bs 225, esperado Bs 230, descuadre −Bs 5 en rojo.
5. Extras: `caja-diaria-cerrada-recepcion-*.png`, `caja-diaria-abierta-dueno-contando-*.png` y `caja-diaria-abierta-recepcion-contando-*.png` (con 225 escrito en «Efectivo contado»).

Datos de ejemplo: cobros de Camila Rojas (efectivo 150, tarjeta 120) y de la Dra. Ana Aramayo (QR 200, transferencia 80); egreso Taxi 20. Nombres inventados.

Lo raro que se ve en el producto (no lo arreglé):
- **Recepción ve «Efectivo esperado Bs 0,00».** La API manda `null` para ella y la pantalla lo imprime como cero. En el cierre sale «Esperado Bs 0,00 · Descuadre Bs 0,00» antes de escribir nada, y al escribir 225 muestra «Descuadre Bs 225,00» en rojo, como si hubiera un faltante o un sobrante que no existe. Debería ocultar esos campos. Se ve en `caja-diaria-abierta-recepcion-1440.png`, `caja-diaria-abierta-recepcion-contando-390.png` y `caja-diaria-cerrada-recepcion-390.png`.
- Dueño, caja abierta y sin escribir nada: el cierre ya dice «Contado Bs 0,00 · Descuadre Bs −230,00» en rojo (`caja-diaria-abierta-dueno-1440.png`).
- Textos sin tilde: «Salidas del dia», «Todavia no hay cobros hoy.», «Solo el duenio ve el detalle completo.» (esta última en `caja-diaria-cerrada-recepcion-390.png`).
- Rótulos técnicos: «EFECTIVO · Camila Rojas», «TRANSFERENCIA»; y siempre aparecen las tarjetas STRIPE y OTRO en Bs 0,00, aunque no se usen.
- La pantalla no dice de qué día es la caja, y la nota del cierre («Falta un billete de Bs 5…») se guarda pero no se muestra.
- Del shell, no de este PR: «Preguntá por tu negocio» (de vos) en la barra del asistente, `components/ayuda/BarraAsistente.tsx`, líneas 116 y 121.
- Consola: sólo ruido del banco (websocket a `localhost:59999` bloqueado y un 401 del shell sin sesión).

Con el OK: Plataforma sigue con CI, merge y publicación; después se MIRA en producción. Los dos primeros problemas conviene arreglarlos antes de publicar.
