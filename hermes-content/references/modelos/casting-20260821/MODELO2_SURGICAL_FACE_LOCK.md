# Modelo 2 — Surgical Face Lock

> 2026-08-21. **Mismo método que `references/models/LUCIA_SURGICAL_FACE_LOCK.md`**, aplicado a
> la modelo 2 por orden de Sergio. Las 10 tomas del shot list de Lucía, fondo blanco de
> estudio, con su ancla v3 como única fuente de identidad.

## Ancla (única fuente de identidad)

- Element `06404192-fe02-48e6-9ce8-3e146f977f67` (`modelo2-ancla-v3-bases`) — 3 bases serias.
- Modelo pedido: `nano_banana_pro`. **Dato del ruteo: el servidor ejecutó los 10 jobs como
  `nano_banana_2`** — mismo comportamiento que documenta el propio FACE_LOCK de Lucía
  ("nano_banana_pro rutea a nano_banana_2"). El método es idéntico al de ella.

## Rasgos sagrados (de FICHA-RASGOS-MODELO2.md — NUNCA alterar)

- Rostro ovalado angosto, pómulos altos, mandíbula fina, mentón delicado.
- Ojos verde claro con centro avellana, almendrados; pestañas cargadas glam.
- Sonrisa grande con dientes blancos parejos (rasgo dominante).
- Bronceado dorado profundo; **pecas suaves en nariz y mejillas — nunca limpiar**.
- Pelo castaño CLARO con reflejos caramelo, muy largo, lacio.
- Caravanas de brillante (accesorio de identidad).

## Las 10 tomas (en `surgical-shoot/`)

| # | Toma | Archivo |
|---|---|---|
| 01 | Frontal neutral | `shot-01-frontal-neutral.png` |
| 02 | Frontal sonrisa suave | `shot-02-sonrisa-suave.png` |
| 03 | Frontal sonrisa completa | `shot-03-sonrisa-completa.png` |
| 04 | Perfil izquierdo | `shot-04-perfil-izq.png` |
| 05 | Perfil derecho | `shot-05-perfil-der.png` |
| 06 | Tres cuartos izq | `shot-06-trescuartos-izq.png` |
| 07 | Tres cuartos der | `shot-07-trescuartos-der.png` |
| 08 | Detalle nariz/pecas | `shot-08-detalle-nariz.png` |
| 09 | Detalle oreja/nacimiento | `shot-09-detalle-oreja.png` |
| 10 | Cuerpo completo | `shot-10-cuerpo-completo.png` |

## Criterio de aprobación (heredado literal del método de Lucía)

Una toma solo pasa si, comparada contra las otras 9, se reconoce como la MISMA persona:
mismos ojos, nariz, labios, mentón, pelo, pecas. **Si una toma se ve "más linda" pero cambia
un rasgo, se rechaza y se regenera.** El QA lo hace Sergio mirando el set completo.

## Después del QA de Sergio

Las tomas aprobadas reemplazan las medias del Element v3 (o forman el v4 definitivo), y ese
Element pasa a ser LA identidad para toda generación de imagen y todo video de ella.
