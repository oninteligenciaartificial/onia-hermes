# RL03 — «Nadie filmó esto» · reel de 11 s para Meta Ads

> 🔴 **REGLA DE ORO: esta tabla y el `_PREVIEW-360p.mp4` se muestran a Sergio ANTES de
> aplicar nada.** Nunca se corta a ciegas.
>
> Montado el 2026-09-02 con ffmpeg local. **Cero créditos** — los tres clips ya existían.

## Por qué este reel existe

Había tres videos verticales sueltos y **ninguno encadenado**. Suelto, cada clip es b-roll de
4 segundos: no alcanza para gancho + argumento + CTA. Encadenados, el argumento se sostiene —
y aparece **el único argumento que un clip solo no puede dar: es la MISMA persona en tres
negocios distintos**. Eso es lo que hace creíble a una influencer que no existe.

## Los cortes

| # | Desde | Clip | Por qué va ahí |
|---|---|---|---|
| 1 | 0,00 s | `c1` — taller mecánico (`V09`) | **Abre el mejor: es la única pieza 9/9 del banco.** La cara aguanta los 4 frames y la entrega de la llave se completa |
| 2 | 4,05 s | `c2` — restaurante (`V10`, **recortado a 3 s**) | 🔴 El original dura 4,05 s pero **en el último segundo el comensal sale y ella abre la boca sin diálogo**. Cortado a 3 s, ese defecto no entra |
| 3 | 7,05 s | `c3` — peluquería (`V07`) | Cierra con la acción más suave (la tijera sobre el mechón), que deja espacio para el CTA |

**Total: 11,14 s · 720×1280 (9:16) · con audio.**

**Verificado MIRANDO** `_TIRA-CORTES.jpg` (frames a 1,5 / 4,5 / 6,5 / 9,5 s): los tres cortes
empalman y la cara es la misma en los tres lugares — pecas, cejas, cadenita.

## Lo que FALTA antes de subirlo

1. **Quemar el gancho** en los primeros 2 s. Sin texto en pantalla, un clip mudo de 11 s no
   comunica nada. El gancho propuesto:
   > **Tres negocios. La misma empleada. Ninguno la contrató.**
2. **Decidir el audio.** Los tres clips traen pista propia de Seedance y **se cortan de golpe**
   entre clips. O se silencia todo y va música, o se hace un fade de 200 ms en cada corte.
3. **El CTA**, al final o en el caption: `Comentá COMUNIDAD` (Lucía) o `Comentá DEMO` (@oniahq).

## Caption propuesta

```
Tres negocios distintos. La misma empleada. Ninguno la contrató.

Lo que costaría filmar estos once segundos de verdad:
  · modelo por jornada completa        → Bs …
  · permiso para grabar en 3 locales   → Bs …
  · alguien que sostenga la luz        → Bs …

Y la partida que nadie factura: que los tres dueños digan que sí el mismo día.

No es que salga más barato. Es que deja de depender de que todo salga bien.

Igual que tu negocio: el problema no es el precio de la persona.
Es que el sistema depende de que se acuerde.
```

🔴 **Cifras vacías a propósito.** Sin fuente real se sacan las tres líneas y queda el argumento.

---

## ✅ TERMINADO — `final/RL03-CON-GANCHO.mp4`

Sergio, 2026-09-02: *«¿qué necesitás de mí? Vos podés hacer esas tareas»*. Tenía razón: los tres
pendientes de arriba eran trabajo mío, no suyo. Hechos con ffmpeg local, **cero créditos**:

1. **Gancho quemado**, en tres líneas escalonadas (0,2 s / 0,6 s / 1,1 s) para que se lea en orden
   y no como un bloque. La tercera va en **verde de Onia** — el único color saturado, misma regla
   que `bloque-solido`.
2. **Audio arreglado.** Los tres clips traían pista propia de Seedance y se cortaban de golpe.
   Ahora: fade-out de 0,4-0,5 s al final de cada clip y fade-in de 0,3 s al empezar el siguiente.
3. **CTA quemado** desde el segundo 9: `Comentá COMUNIDAD` en cápsula verde.

**11,17 s · 720×1280 · con audio · 3,4 MB.**

### ⚠️ La trampa de `drawtext`: se come los acentos

El primer render salió con **«contrato»** y **«Comenta»**, sin tilde. `drawtext` con `text=`
inline pierde los caracteres acentuados en este entorno.

**La solución: `textfile=` apuntando a un `.txt` en UTF-8** (uno por línea, en `txt/`). Verificado
con `file`: `Unicode text, UTF-8`. Y verificado MIRANDO el frame — que es la única forma de
enterarse, porque el render no falla: sale mudo el acento y listo.

Copia lista para publicar en `hermes-content/PARA-PUBLICAR/D15-lucia-reel-tres-negocios/`.
