# Carruseles IG — Investigación 2026 (notas para mejorar el sistema ONIA)

Hallazgos de mejores prácticas 2026 que **refinan** las 5 reglas y el motor de render.
Fecha: 2026-06-17. Fuentes al final.

## Lo que el algoritmo 2026 premia (cambió)
- Señal primaria ya NO son los likes: es **dwell time** (tiempo activo) + **swipe-through velocity** (cuántos pasan de slide).
- **DM shares pesan 3-5x más que un like.** → reforzar el comment_trigger que dispara DM (ya lo hacemos, regla 5).
- **Saves: +22% en carruseles** vs foto única. → la slide guardable (regla 4) es aún más valiosa.
- **Re-serving:** si alguien no llega al final, IG **vuelve a mostrar el carrusel** con las slides no vistas como "contenido nuevo". Un carrusel rinde por días, no horas. → más slides = más reintentos.

## Cambios concretos a aplicar
1. **Subir el número de slides: 7-10** (veníamos en 5-6). 8-10 maximiza dwell time **si la completion rate se mantiene >60%**. Si el contenido se estira, mejor 5-7. Regla práctica: no rellenar, pero apuntar a 7-9 con puntos fuertes en el medio.
2. **Engagement cae después del slide 3 y repunta en 8+** → meter un "segundo gancho" / dato fuerte alrededor del slide 4-5 para sostener el swipe (no dejar que decaiga).
3. **Portada = 80% del peso, 2-3 segundos.** Fórmula confirmada: hook de **5-8 palabras** + pattern interrupt (color/contraste brutal) + curiosity trigger (revelación parcial o pregunta abierta). Ya alineado con nuestra regla 1.
4. **Especificidad en el hook:** "5 cambios que me ahorraron 10 horas/semana" > "tips de productividad". Números + resultado temporal concreto.
5. **Cue de swipe que sangra del borde** aumenta completion. → nuestra curva verde continua y la flecha ya cumplen; mantener.
6. **Mixed media (imagen + video)** rinde más (2.33% vs 1.80% solo imagen). → a futuro: una slide-video (mockup animado, n8n corriendo) dentro del carrusel.
7. **CTA final claro** + el comment_trigger para empujar DM (ya lo hacemos).

## Tensión con las 5 reglas (resolver)
Las 5 reglas priorizan calidad/1-idea-por-slide; la data pide 7-10 slides. No se contradicen: mantener 1 idea por slide pero **estirar la lista** (más puntos/ejemplos/pruebas) en vez de inflar con relleno. Estructura sugerida 8 slides:
`cover → stakes → punto1 → punto2 → (segundo gancho/dato) → punto3 → save → cta`.

## Benchmark
Carruseles = formato de mayor engagement en 2026 (~1.92% prom. vs 0.50% Reels). +114% vs foto única. Formato correcto: **1080×1350 (4:5)**, lo que ya usamos.

## Fuentes
- TrueFuture Media — Instagram Carousel Strategy 2026
- Marketing Agent — "The Algorithm Demands Swipes, Not Just Scrolls" (2026-01)
- Krumzi — 15 Carousel Ideas 3x Engagement 2026
- Carouselli — Carousel Engagement Stats & Benchmarks 2026
- Resont — Best Hooks for IG Carousel
- Metricool / CreatorFlow — Best Practices 2026
