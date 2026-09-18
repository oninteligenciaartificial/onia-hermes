# DESIGN.md — Clínica Amanecer

> Sistema de diseño de Clínica Amanecer (clinica-amanecer). Lo lee cualquier agente antes de
> generar una pantalla, un banner o un post: todo lo de abajo sale del perfil del cliente
> (`data/clients/clinica-amanecer.json`); si el perfil cambia, este archivo se regenera.

## Marca

- Nombre: **Clínica Amanecer** · logotipo de texto: `CA`
- Promesa (tagline): Tu sonrisa, atendida con calma y sin esperas
- Descripción: Tu sonrisa, atendida con calma y sin esperas. Clínica dental en Santa Cruz.
- Contacto principal: +591 70000000 · Santa Cruz, Bolivia

## Colores

| Rol | Hex | Uso | Contraste |
|---|---|---|---|
| Fondo | `#EEF4FA` | fondo de página y secciones claras | — |
| Tinta | `#102A43` | texto principal | 13.2:1 sobre fondo ✓ |
| Primario | `#1769AA` | botones, enlaces, acentos de marca | 5.2:1 sobre fondo — sirve como texto sobre fondo |
| Secundario | `#102A43` | superficies oscuras, pies, titulares sobre claro | 13.2:1 sobre fondo |
| Acento | `#1769AA` | detalles, iconos, estados | 5.2:1 sobre fondo |

- Texto sobre primario: `#FFFFFF` (5.8:1).
- Un solo primario por pantalla. El acento nunca compite con el botón principal.

## Tipografía

- Titulares: **Archivo**, peso 700–800, interletrado −0,02em, líneas cortas (máx. 12 palabras).
- Texto: **Inter**, 16–18px, interlineado 1,5. Nunca menos de 14px.
- Escala: hero 48–64px · h2 32–40px · h3 22–24px · cuerpo 16–18px · etiqueta 12–13px en mayúsculas con +0,08em.

## Espacio y forma

- Ritmo de 8px. Secciones separadas por 64–96px en escritorio y 40–56px en móvil.
- Radio: 6px en botones y campos, 12px en tarjetas. Sin esquinas mezcladas en una misma vista.
- Sombras suaves y sólo en elementos que flotan (tarjeta destacada, botón fijo). Nada de sombras en todo.

## Componentes

- **Botón principal**: fondo `#1769AA`, texto `#FFFFFF`, 44px de alto mínimo, radio 6px. Uno por vista.
- **Botón secundario**: borde 1px `#102A43` al 20%, texto `#102A43`, fondo transparente.
- **Tarjeta**: fondo blanco o `#EEF4FA`, borde 1px al 10%, radio 12px, título + una frase + acción.
- **Chip / etiqueta**: fondo `#1769AA` al 12%, texto `#102A43`, mayúsculas 12px.
- **Enlace de WhatsApp**: siempre con el mensaje prellenado y el número del cliente, nunca el del estudio.

## Movimiento

- Sólo `transform` y `opacity`. Entradas 0,6–0,9s con `cubic-bezier(0.16, 1, 0.3, 1)`.
- Respetar `prefers-reduced-motion`. Nada que se mueva solo sin que el usuario haga algo.

## Voz y copy

- Voseo boliviano, presente, segunda persona: «reservá», «escribinos», «pedí».
- Titulares de 3 a 8 palabras. Sin raya (—) ni dos puntos dramáticos en titulares.
- Un hecho por frase. Nada de «llevá tu negocio al siguiente nivel», «soluciones integrales», «experiencia única», «sin esfuerzo».
- Sin tríadas forzadas ni «no es X, es Y». Sin adverbios de relleno («realmente», «simplemente»).
- Precios y plazos sólo si el cliente los dio. Si falta un dato, se pide; no se rellena.
- Sin autobombo del estudio: la web habla del negocio del cliente, nunca de quién la hizo.

## Sí / No

- Sí: fotos reales del negocio, una acción clara por pantalla, precios sólo si el cliente los dio.
- No: stock de gente sonriendo a cámara, degradados y brillos sin función, tarjetas idénticas en grilla uniforme, texto sobre foto sin contraste, cualquier frase que suene a IA.
