# Q07 · Checkout por visión: detecta el producto, decodifica el código y arma el recibo solo

- **Destino:** `onia-plattform`
- **Sale de:** [la ficha](../2026-08-24-checkout-por-vision-recibo-en-vivo.md) · `DcRflPJDLhG` · @suprapixel
- **Fuente:** https://www.instagram.com/p/DcRflPJDLhG/
- **Qué falta para hacerlo hoy:** Una decisión, no una credencial: si el rubro comercio quiere caja por visión o le alcanza con lector de código. Es un salto grande de alcance.

---

```text
Objetivo único: contrastar el flujo de "checkout por visión" contra ONIA Core y decir qué existe, qué falta y si vale encenderlo — SIN construir nada todavía.

De dónde sale: ficha de video-intake `checkout-por-vision-recibo-en-vivo` (IG DcRflPJDLhG). Un sistema que detecta productos que pasan por una cinta, decodifica su código de barras, lo matchea contra catálogo y arma un recibo en vivo con el total acumulando.

Pasos:

1) Escribir la MÁQUINA DE ESTADOS del flujo, tal como se observó: producto entra al campo -> detección con confianza -> localización del código dentro del recorte -> decodificación -> match contra catálogo (nombre + precio) -> línea al recibo -> recálculo de total. Marcar en cuál de esos pasos falla más seguido un sistema real y qué pasa cuando falla (producto no reconocido, código ilegible, dos productos a la vez).

2) Contrastar contra el core, entidad por entidad. Para cada una decir EXISTE / NO EXISTE / EXISTE PERO APAGADA, citando el archivo:
   - producto (código, nombre, precio, marca, stock)
   - detección (id, confianza, bounding box)
   - línea de recibo y recibo
   - venta / cierre de caja
   Usar el contract.json y el base-schema del core, no la memoria.

3) Responder la pregunta de negocio, que es la que decide: para un comercio boliviano típico, ¿la caja por visión resuelve un dolor real, o el lector de código de barras de siempre ya lo resuelve por una fracción del costo? Ser honesto: si la respuesta es que no vale, decirlo y cerrar el tema.

4) Si sí vale, escribir el camino mínimo: qué se enciende primero, con qué hardware, y qué se le promete al cliente. Si no vale, anotar en qué condición cambiaría (por ejemplo, un cliente con volumen alto y catálogo chico).

NO se implementa nada en esta tarea. El entregable es la decisión escrita.

LISTO = un documento con la máquina de estados, la tabla entidad-por-entidad contra el core con EXISTE/NO EXISTE/APAGADA citando archivos, y un veredicto de una línea: se enciende / no se enciende, con el motivo.
```
