# Panel "LIVE OPS" en la pared — Maria Wendt

- **Fuente:** https://www.instagram.com/p/DaAu59nmAng/ · 22 s · inglés
- **Visto:** 2026-08-09 (Gemini nativo)
- **Archivo:** `Instagram-DaAu59nmAng.mp4` (no versionado)

## Qué dice realmente

Una emprendedora muestra un TV en la pared de su oficina con un dashboard en vivo
("Maria Wendt LIVE OPS"). Va señalando cada tile:

- `REVENUE TODAY $33,646` · `REVENUE MTD $580,759` · `ORDERS TODAY 249`
- `ROAS MTD 3.17x` · `AD SPEND TODAY $4,278` · `AVG ORDER VALUE $95.08`
- `LTV : CAC` — LTV $186.78 / costo de adquisición $77.74 (lo llama *"un número
  importante"*)
- `INSTAGRAM FOLLOWERS 777,468` · `YOUTUBE SUBS 123,000` · `IG GAINED TODAY +1,613`
- `NEW CUSTOMERS TODAY 109` · gráfico `Revenue Source MTD`

El momento del video: a los 00:17 entra una **notificación flotante de venta nueva
($24.00)** y ella grita de emoción. Sin CTA — es prueba social.

## Veredicto: MEJORA LO ACTUAL (ONIA Center) + gancho comercial

Los números son de ella, no replicables, y un panel no genera una sola venta — esa parte
es humo aspiracional. Lo aprovechable es el **diseño de qué se mide y cómo se siente**.

Contra lo que ya tenemos: ONIA Center ya es la sala de agentes con vista Finanzas y
`finance_summary`. Le faltan dos cosas de este panel:

1. **LTV : CAC y ROAS.** Hoy no los calculamos. Son las dos métricas que deciden si la
   pauta de Meta Ads se escala o se apaga — y el motor de Meta Ads ya está deployado en
   DRY. Sin LTV:CAC, encender pauta es apostar.
2. **El toast de venta en vivo.** Es puro dopamine loop, pero es lo que hace que alguien
   deje el panel encendido. Barato: ya hay pipeline de leads y atribución `?src=` en prod.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Carril A (ONIA Center) | Añadir tiles `LTV:CAC`, `ROAS`, `AOV` a la vista Finanzas + toast de venta nueva |
| ONIA Platform (venta) | "Tu negocio en una pantalla, en vivo" es un gancho para el comprador A (dueño de negocio formal). Vende **resultado visible**, no software |
| Contenido | El formato "muestro mi panel y entra una venta en vivo" es replicable **solo cuando tengamos ventas reales que mostrar**. Hoy sería fabricar — prohibido |

## Riesgo

Construir tiles de vanidad (followers) en vez de las que deciden plata. Si entra solo una
métrica, que sea **LTV:CAC**.
