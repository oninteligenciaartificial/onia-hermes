# Carril `lucia-ugc` en el VPS — montado el 2026-09-01

Produce material de Lucía y @oniahq **sin la PC de Sergio encendida**. Corre headless con el CLI
oficial de Higgsfield, no con navegador.

## Las piezas

| Qué | Dónde |
|---|---|
| Corredor | `/root/bin/lucia-ugc.sh` |
| Prompt | `/root/bin/loops-lucia/ugc.md` |
| Árbol | `/root/loops/lucia-contenido` · rama **`claude/lucia-vps`** |
| Log | `/var/log/onia-loop-lucia-ugc.log` |
| Cron | `37 */3 * * *` (UTC; La Paz es UTC−4) |

**Nombres propios a propósito.** La otra sesión usa `/root/bin/onia-loop.sh`, `/root/bin/loops/`
y `/root/loops/onia-hermes`. Nada compartido salvo el npm global y el crontab, y en el crontab se
agregó una línea sin tocar las otras 26.

## Cada 3 horas, y por qué no más seguido

Medido: imagen `nano_banana_pro` 2K 9:16 = **2 cr** · video `seedance1_5` = **4,8 cr** ·
escribir un creativo = **0 cr**. Plan ultra: **3.000 cr/mes**.

| Cadencia | Vueltas/día | Gasto/mes | % del plan |
|---|---|---|---|
| Cada hora | 24 | ~1.700 | 57% |
| **Cada 3 h** | **8** | **~600** | **20%** |
| Cada 6 h | 4 | ~300 | 10% |

**La razón real no es el crédito: es que más piezas no es más posts.** Hay 1 publicado y decenas
producidas. Un loop cada hora deja ~700 piezas al mes que nadie mira. **El límite es el ojo de
Sergio, no el saldo.** Si algún día el cuello pasa a ser la producción, se sube la frecuencia.

## Las barandas del corredor

Las cuatro de `COMO_SE_ARMA_UN_LOOP.md` más una propia:

1. **`flock`** — una vuelta lenta no se pisa a sí misma.
2. **`cd` verificado** — si la rama no es `claude/lucia-vps`, **aborta**. Ya funcionó: la primera
   corrida se negó sola porque la variable decía otra rama.
3. **`unset ANTHROPIC_API_KEY`** — la del `.env` está vencida y pisaría la suscripción.
4. **Tools en UNA cadena y prompt por STDIN** — `--allowedTools` es variadic y se come el
   argumento siguiente.
5. **Piso de créditos (300)** — propia. Por debajo no genera nada. Un loop sin techo se come el
   plan del mes.

Además registra el saldo antes y después de cada vuelta, así el gasto queda medido y no estimado.

## 🔴 Por qué la rama es `claude/lucia-vps` y no `claude/carril-contenido`

**`claude/carril-contenido` no se puede pushear.** GitHub la rechaza entera:

```
File hermes-content/references/oniahq/reel-R01/clips/b3.mp4 is 149.25 MB;
this exceeds GitHub's file size limit of 100.00 MB
```

Un video de 149 MB quedó en el historial de esa rama. Reescribir historia con otra sesión
trabajando el mismo repo es peligroso, así que el carril del VPS sale de `main` con rama propia.
**Pendiente:** sacar ese MP4 del historial o pasarlo a LFS, y recién ahí reunificar las ramas.

## Estado
✅ CLI instalado y autenticado · ✅ árbol clonado · ✅ corredor probado a mano (corrió y generó
trabajo) · ✅ cron instalado sin tocar las otras 26 entradas.
