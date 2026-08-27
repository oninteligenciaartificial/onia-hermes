# Q06 · OpenReply: el comentario→DM de Instagram, open source, contra los $139/mes de ManyChat

- **Destino:** `chatbot`
- **Sale de:** [la ficha](../2026-08-24-openreply-manychat-open-source.md) · `DceDGTbjOtI` · @anas.tecnologia
- **Fuente:** https://www.instagram.com/p/DceDGTbjOtI/
- **Qué falta para hacerlo hoy:** Nada para evaluarlo: el repo es público. Lo que falta es CONTAR de nuevo si nuestro circuito sigue vivo — es un dato heredado de hace 6 días del que dependen 8 prompts.

---

```text
Objetivo único: decidir, con evidencia, si nuestro circuito comentario→DM sigue vivo y si OpenReply aporta algo que no tengamos.

Contexto: 8 prompts del lote O (O1, O4, O6, O8, O9, O10, O14, O15) convierten por comentario→DM, y ahora el lead magnet está decidido (agendar una demo en cal.onia.com.bo). Todo eso descansa en un dato de hace días: "el circuito comentario→DM está vivo desde el 18-ago". Nadie lo re-verificó, y el propio lote del 23-ago se contradice: 5 fichas lo afirman en presente y 3 lo marcan como no verificado.

Pasos:

1) CONTAR DE NUEVO, no citar. Abrir el workflow de n8n que atiende el webhook de comentarios de Instagram y verificar: que esté ACTIVO, que su última ejecución sea reciente y exitosa, y que el DM haya llegado de verdad. Un workflow activo que no ejecuta hace días no es un circuito vivo.

2) Probar de punta a punta con un comentario real en un post propio, y MIRAR el DM que llega — no asumirlo por un 200 en el log.

3) Recién ahí, comparar contra OpenReply (repo público, open source, "ManyChat para comentario→DM"). Responder tres cosas concretas:
   - ¿maneja algo que el nuestro no? (reintentos, rate limit de Meta, ventana de 24 h, multi-cuenta)
   - ¿qué pide de configuración de Meta que nosotros ya tengamos resuelto?
   - ¿conviene adoptarlo, robarle una idea, o no tocarlo?

4) Anotar el dato de precio de ManyChat para la venta: Advanced $139/mes (25.000 contactos), Business $69/mes (7.500). Sirve como ancla de ahorro frente a un cliente que ya lo paga.

5) Dejar escrito el veredicto con fecha, para que la próxima sesión no vuelva a heredarlo sin contar.

LISTO = un documento que dice, con fecha y evidencia mirada, si el circuito está vivo; y una decisión de una línea sobre OpenReply: adoptar / robar idea / descartar, con el motivo.
```
