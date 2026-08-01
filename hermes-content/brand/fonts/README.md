# Fuentes de marca ONIA — autohospedadas

Fuente de verdad de la decisión tipográfica:
`web-factory/docs/ONIA_BRAND_IDENTITY_2026.md` §2. **Acá no se decide nada** —
si cambia el trío, se edita ese doc primero y después esta carpeta.

| Rol | Familia | Pesos | Dónde se usa |
| --- | --- | --- | --- |
| Display / titulares / etiquetas | Bricolage Grotesque | 500–700 | composiciones HyperFrames, apoyos estáticos, subtítulos |
| Cuerpo / UI / texto de apoyo | DM Sans | 400/500 | composiciones, apoyos estáticos |
| Cifras / datos / código / URLs | Spline Sans Mono | 400/500 | tarjeta Stat, barra de URL del mockup de navegador |

## Por qué existen estos archivos

Para que un render salga **igual en la máquina de Sergio (Windows) y en el VPS
(Linux)**. Eso exige que la fuente viaje con el repo: nada de Google Fonts en
tiempo de render, nada de "la fuente está instalada en el sistema".

Los `.woff2` **no** se bajan del CSS de Google: ese CSS sirve archivos con los
ejes recortados y el default en el máximo — para Bricolage devolvía un archivo
cuyo `wght` por defecto era **800**, justo el corte que el brand system prohíbe.
Se construyen con `build-onia-fonts.py` desde el TTF variable upstream de
`google/fonts`, recortando los ejes a mano:

- **Bricolage Grotesque** → `wght` 500–700 (default 600) y `wdth` fijo en 100.
  El peso 800 y los cortes ultra-condensed **no existen en el archivo**: la
  regla de marca queda garantizada por construcción, no por disciplina.
- **DM Sans** → `wght` 400–500.
- **Spline Sans Mono** → `wght` 400–500.

`opsz` se deja vivo donde la familia lo trae: el tamaño óptico sigue al
`font-size`, que es determinista.

## Archivos

| Archivo | Para qué |
| --- | --- |
| `*-var-latin.woff2` | HTML (composiciones HyperFrames + apoyos estáticos vía Chrome). Subset latin — cubre el español completo. |
| `BricolageGrotesque-Bold.ttf` | Subtítulos quemados. **libass no lee woff2 ni sabe elegir instancia de un variable**, así que necesita una estática. Es peso 700 real, marcada como Bold, sin engorde sintético. |
| `OFL-*.txt` | Licencia de cada familia. |
| `build-onia-fonts.py` | Reconstruye todo y **reparte** las copias a las composiciones. |

Las copias en `scripts/hyperframes/compositions/<slug>/fonts/` **no se editan a
mano**: HyperFrames sirve cada composición con su carpeta como raíz y rechaza
por lint cualquier asset con `../` por encima, así que cada una necesita los
archivos adentro. Se regeneran con:

```bash
python hermes-content/brand/fonts/build-onia-fonts.py
```

## Licencia

Las tres son **SIL Open Font License 1.1** — libres de embeber y redistribuir,
también en un producto comercial. El texto completo está en los `OFL-*.txt` de
esta carpeta y junto a cada copia en las composiciones.

- Bricolage Grotesque © 2022 The Bricolage Grotesque Project Authors
- DM Sans © 2014 The DM Sans Project Authors
- Spline Sans Mono © 2022 The Spline Sans Mono Project Authors

Los archivos derivados (subset + ejes recortados) mantienen la misma licencia;
la OFL lo permite explícitamente siempre que no se use el Reserved Font Name,
y ninguna de las tres declara uno.
