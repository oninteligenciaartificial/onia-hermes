# Calendario de publicación · sábado 17 → viernes 23 de octubre

Continúa `CALENDARIO-PUBLICACION-9-16-OCT.md` (las **reglas fijas del día**, los horarios y el trial valen igual: no se copian acá). Las piezas salen de `GRABAR-17-23-OCT.md`, que trae el guion, el molde, la fórmula y el CTA de cada una. Horas en La Paz (UTC = La Paz + 4).

**Regla nueva del 10-oct (madre v4, a pedido de Sergio Urcullo: «mostrame antes de subir»):** ninguna pieza nueva se agenda ni se publica hasta que la madre confirme «mostrada, publicá <pieza>». Pieza lista = renderizada en la rama + commit con «LISTA PARA MOSTRAR: <pieza>». Este calendario ordena; no autoriza.

## Calendario

| Día | Carrusel 16:00 · 16:01 · 16:02 | Video A · 12:30 (yap 13:30) | Video B · 18:30 (yap 19:30) | Palabra y aviso (pegarlo antes del video) |
|---|---|---|---|---|
| **Sáb 17** | **P2** «7 herramientas. 4 son gratis.» (faltan capturas y la lámina 6) | **N08** mods de Claude Code | S2-D09-A (reserva, dueño) | MODS |
| **Dom 18** | **«78h en una tarea»** (render listo, espera «mostrada») | **DU-01** la cuenta de tres números | libre (reserva de desarrollo) | CHECKLIST en el carrusel · asesoría en el video |
| **Lun 19** | por armar (palabra FACTURA) | **DU-02** facturación sin fecha (F8: video único de 100-120 s) | — | FACTURA |
| **Mar 20** | por armar (palabra RONDAS) | el YouTube de la semana (S2-D13-C si entra) | **CC-01** cuatro rondas, Claude Code contra Codex | RONDAS (antes de las 18:30) |
| **Mié 21** | **«Tics de webs con IA»** (borrador: faltan C1 y `[X] [Y] [X2] [Y2]`) | **CC-02** misma landing con y sin skill de diseño | S2-D08-C (reverificada contra la página de precios de Meta) | DISEÑO |
| **Jue 22** | por armar (cotizar; sin palabra, el video pide la asesoría) | **DU-03** una tarea, una herramienta, un número | libre | asesoría |
| **Vie 23** | por armar (palabra EQUIPO) | **CC-03** cupo de Codex en 32 horas | libre | EQUIPO |

- **Sin pieza de dueño el vie 23**, como el vie 16 (el plan lo anota).
- **El carrusel lleva la palabra de la pieza del día** y sale después del video, con el estilo del pack `referentes` (receta «Inventario continuo» donde hay 6 o más ítems del mismo tipo). El cierre es «Buscá PALABRA en Avisos · link en mi perfil»; nunca «comentá», y solo si el aviso ya está pegado.
- **Lo que bloquea publicar** (de `GRABAR-17-23-OCT.md`): la bio con el link de la asesoría para DU-01 y DU-03; los 5 avisos nuevos (MODS, FACTURA, RONDAS, DISEÑO, EQUIPO) y el aviso CHECKLIST pegados antes de la hora de su video; y las mediciones que Sergio Urcullo dice en cámara. Una pieza sin su medición no se graba: entra P1 o P3.

## Cuándo sube cada bruto

Antes de las 18:00 del día anterior a su publicación, a Drive «Videos Onia Octubre», con el código en el nombre. Con el bruto llegan, antes de cortar, la tabla de cortes y el preview de 360p (regla de oro).

| Bruto | Se graba | Sube antes de |
|---|---|---|
| N08, DU-02, DU-03 (set Santiago) | jue 15 | jue 15 · 18:00 (N08 sale el sáb 17) |
| DU-01, CC-01 (set Erik) | vie 16 | vie 16 · 18:00 |
| CC-02, CC-03 (set Rocha) | sáb 17 | sáb 17 · 18:00 (CC-02 sale el mié 21) |

## Qué falta agendar

Todo. Nada de esta semana está en el servidor. Cada video y su yap se agendan con `agendar-publicacion.sh` después de «mostrada, publicá <pieza>» y de ver Sergio Urcullo su tabla de cortes. Los carruseles de los días «por armar» los arma Marca personal una vez que existan las mediciones de su video; los dos ya renderizados están en `hermes-content/carousels/out/sergio-78h-una-tarea-20261018/` y `…/sergio-tics-webs-ia-20261021-borrador/`.
