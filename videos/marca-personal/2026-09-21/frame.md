# Dirección visual · 01-feed-3-nodos

## Concepto

**Workflow primero.** La interfaz real es la prueba y ocupa la mayor parte del
cuadro. Los gráficos solo orientan la mirada; no compiten con los nodos.

Flujo canónico: `Webhook → IF → Google Sheets / Append Row → Telegram / Send Message`.
El Webhook muestra `name`, `phone`, `service` y `source`; el IF valida `phone` y
`service`, y la edición debe enseñar tanto la rama true como la rama false.

## Composición

- Canvas: 1080×1920, 30 fps.
- Foco: captura verticalizada del workflow, con nodos y conexiones siempre legibles.
- Rail de subtítulos: se coloca en el lateral que el bruto deje libre; ancho máximo sugerido 260 px.
- Talking head: opcional, como PiP pequeño o corte breve, solo si el bruto es limpio.
- Safe areas: reservar 120 px superiores y 260 px inferiores para UI de Reels/TikTok.

## Jerarquía

1. Nodo o rama explicada.
2. Subtítulo de la frase actual.
3. Rótulo puntual `ENTRADA`, `VALIDACIÓN`, `REGISTRO` o `AVISO`.
4. Detalle de interfaz no esencial.

## Sistema visual

- Fondo: interfaz real; no reemplazarla con un mockup inventado.
- Texto principal: blanco cálido `#F5F1E8`.
- Acento ONIA y camino correcto: verde `#00D26A`.
- Rama que requiere completar datos: ámbar `#F4A261`.
- Sombra/rail: negro azulado `#0B0F14` con opacidad suficiente para contraste.
- Tipografía prevista: Archivo para subtítulos; Spline Sans Mono para labels técnicos.

## Movimiento

- Zooms solo para dirigir la mirada a un nodo real (`coordinate-target-zoom`).
- Labels con llegada breve y firme (`spring-pop-entrance`, `power3.out`, sin rebote).
- Cortes sobre cambios de estado o respiraciones largas; no usar wipes, glitch ni transiciones ornamentales.
- Una idea visible por beat.

## Audio

- Voz al frente, sin música en el master entregado.
- Limpieza de ruido solo si no introduce artefactos.
- Normalización final: objetivo −14 LUFS integrado, true peak máximo −1.5 dBTP.
