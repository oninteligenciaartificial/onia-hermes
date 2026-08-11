# Web 3D scrollytelling — United Carriers (logística)

- **Fuente:** https://www.instagram.com/p/Db0yxc5xnpD/ · 10,8 s · sin voz (música)
- **Visto:** 2026-08-11 (Gemini nativo)
- **Archivo:** `Instagram-Db0yxc5xnpD.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-11-Instagram-Db0yxc5xnpD.md](transcripciones/2026-08-11-Instagram-Db0yxc5xnpD.md)

## Qué dice realmente

Formato "POV" de flex de portafolio, sin voz, con un texto superpuesto todo el video:
*"POV: you finally mastered 3D websites"*.

- **00:00-00:03** — una mano hace scroll en el trackpad de una laptop; en el navegador,
  `unitedcarriers.com`. Una grúa apiladora en 3D levanta un contenedor de una pila.
- **00:03-00:06** — sigue el scroll: la grúa carga el contenedor en un camión; aparece una
  sección de título con cuatro tarjetas de servicio (transporte marítimo, aduana,
  almacenaje/3PL, carga de proyecto).
- **00:06-00:08** — nueva sección de texto, luego vista aérea de un buque portacontenedores
  navegando, animado en 3D.
- **00:08-00:10** — eslogan final sobre el buque y cierre con sección de
  confianza/clientes.

No se nombra herramienta ni framework (¿Three.js? ¿Spline? ¿WebGL a mano?), no hay código
en pantalla, no hay CTA hablado. Es puro b-roll de scroll mostrando el resultado, sin
explicar el método.

## Veredicto: FUTURO

La técnica es real y madura — sitios 3D con scroll-jacking son un formato asentado en el
circuito de agencias/Awwwards desde hace varios años, no es humo. **A VERIFICAR:** que
`unitedcarriers.com` siga online y sea el sitio real en producción (no un mockup de
portafolio armado para el reel).

No aplica a lo que vendemos hoy, por dos motivos concretos:

- Choca con el presupuesto de performance del propio proyecto
  (`rules/web/performance.md`: landing ≤ 150 kb JS gzipped, LCP < 2.5 s). Un sitio con
  este nivel de animación 3D no entra en ese presupuesto.
- El precio de lanzamiento actual (Landing 790 / Web Pro 1.500 Bs) no cubre el tiempo de
  desarrollo que exige una pieza 3D de este nivel, y tampoco lo cubre todavía la línea
  premium (2.000/4.500 Bs).

El video tampoco enseña método (sin librería nombrada, sin código visible), así que hoy no
hay nada ejecutable que copiar — solo el objetivo visual como techo de referencia.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Web Factory (roadmap) | Guardar como referencia de techo para una futura oferta 3D flagship, solo cuando haya portafolio y un tier de precio que lo sostenga |
| Marketing / portafolio propio | Candidato a pieza única de ONIA (no de cliente) el día que se justifique una demo de autoridad técnica de alto impacto |
| Web Factory (hoy) | No abrir este frente — no toca ningún carril activo ni el precio actual lo cubre |

## Riesgo

Que se lea como "hay que igualar esto ya" y se meta tiempo de desarrollo en una pieza 3D
sin cliente que la pague ni presupuesto de performance que la sostenga. El riesgo es de
scope creep, no técnico.
