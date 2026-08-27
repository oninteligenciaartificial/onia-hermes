# Q01 · Cinco paletas de lujo con sus hex — recuperadas, no reconstruidas

- **Destino:** `web-factory`
- **Sale de:** [la ficha](../2026-08-24-cinco-paletas-de-lujo-hex-recuperados.md) · `DbvmsWlDKo6` · @suraj.dsgn
- **Fuente:** https://www.instagram.com/p/DbvmsWlDKo6/
- **Qué falta para hacerlo hoy:** Nada.

---

```text
Objetivo único: incorporar las 5 paletas de lujo al banco de patrones como tokens usables, y contrastarlas contra la regla de color que el corpus ya había deducido.

De dónde sale: ficha `cinco-paletas-de-lujo-hex-recuperados` (IG DbvmsWlDKo6). Los hex están ESCRITOS en pantalla: esto es recuperado, no reconstruido. No hace falta muestrear ni adivinar.

Las 5 paletas, literales:
1. Racing: Alabaster Grey #D9D9D9 · Racing Red #DD0200 · Black Cherry #55100D · Coffee Bean #1A0706
2. Gold & Slate: Warm Gold #F4B044 · Burnt Orange #E0680E · Light Slate Blue #88A5B7 · Dark Blue #112532
3. Rosewood: Alabaster Cream #F1ECE6 · Warm Greige #DDD5CD · Vintage Rosewood #7D4047 · Charcoal Espresso #2E2E2E
4. Terracotta: Terracotta Clay #B5543A · Olive Accent #6F7F5F · Soft Limestone #F0E6D8 · Deep Rust #5A2E25
5. Earth: Beige #C29B72 · Terracotta #8D321F · Olive #3A4027 · Charcoal #2B2D31

Pasos:

1) Crear hermes-content/references/ui-patterns/paletas-lujo/ con las 5 paletas como custom properties CSS, siguiendo la convención de tokens que ya usa web-factory (mirar cómo están escritos los tokens existentes antes de inventar un formato nuevo).

2) Para cada paleta, declarar el ROL de cada color: fondo, superficie, acento, texto. No alcanza con listar hex: sin rol, nadie la usa bien.

3) Verificar CONTRASTE de cada combinación texto/fondo contra WCAG AA. Si alguna combinación no llega, decirlo en el archivo — una paleta linda que no pasa contraste es una trampa para el próximo que la use.

4) Contrastar contra la regla que el corpus ya había deducido por su cuenta: "un solo acento saturado, y siempre sobre el sujeto o el producto, nunca sobre la interfaz" (síntesis del lote del 23-ago, punto 6, ocho fichas coincidiendo). ¿Las cinco paletas la cumplen? Si alguna no, es la excepción interesante y hay que anotarla.

5) Decir cuál de las cinco, si alguna, sirve para Onia. Hoy la marca es verde. Ninguna de estas lo es, así que lo más probable es que sirvan para webs DE CLIENTE, no para nosotros. Ser explícito al respecto.

LISTO = la carpeta paletas-lujo/ con los 5 sets de tokens, cada color con su rol, el resultado del chequeo de contraste anotado, y un párrafo diciendo cuáles sirven para clientes y por qué ninguna reemplaza la marca de Onia.
```
