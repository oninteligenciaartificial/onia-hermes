---
id: hermes-C3b
carril: hermes
estado: pendiente   # pendiente | lanzada | PR | hecha | bloqueada
modelo: gpt-6.1-sol # cambia un script que corre como root en el VPS (solo lee): la madre lo revisa fuerte
repo: onia-hermes
rama: codex/hermes-c3b-latido
base: codex/hermes-c1-c3   # PR #196; si ya entró a main, base: main
pr:
escrita: 2026-10-11 por Hermes-Jarvis (nube)
actualizada: 2026-10-11 por Hermes-Jarvis (nube)
nota: Corrige la parte B de la sección 16 de diagnostico.sh (C3): con el crontab REAL no nombra ningún trabajo. El ejemplo del contrato C3 estaba mal; el error es del contrato, no de Codex.
---
# C3b · La sección 16 tiene que leer el crontab que de verdad tiene el VPS

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-hermes` que creó la madre, en la rama `codex/hermes-c3b-latido`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin `npm install`, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.

## META
La sección 16 de `hermes-content/deploy/hermes-jarvis/diagnostico.sh` (C3) existe para que se vea **qué modelo usa cada trabajo y cada cuánto corre**. Con el
crontab que `aplicar.sh` instala de verdad, la parte B **no dice nada útil**. Esta tarea la arregla y hace que su prueba use las líneas reales del VPS.

## Qué falla hoy (medido con la rama de #196, no supuesto)
`aplicar.sh` instala **todos** los trabajos de Hermes envueltos en el latido, con el comando entero entre comillas simples:
```
30 10 * * * /root/bin/onia-latido.sh resumen-manana 86400 '/root/bin/onia-jarvis-resumen.sh manana' >> /var/log/onia-jarvis-resumen.log 2>&1
*/5 * * * * /root/bin/onia-latido.sh aduana-soltar 300 'ONIA_AVISO_SOLTAR=1 /root/bin/onia-tg.sh' >> /var/log/onia-tg-soltar.log 2>&1
*/2 * * * * /root/bin/onia-latido.sh respuestas-pedidos 120 '[ ! -x /root/bin/onia-respuestas-pedidos.sh ] || /root/bin/onia-respuestas-pedidos.sh' >> …
```
(las siete líneas están en `aplicar.sh`, bloque «Los seis trabajos…», variable `LAT`). La parte B toma la primera palabra `/root/bin/<nombre>`, que es siempre
`/root/bin/onia-latido.sh`: el comando de adentro es **una sola palabra con espacios** y no coincide. Salida real (6 líneas casi iguales):
```
/root/bin/onia-latido.sh | cada 30 10 * * * | modelo sin modelo declarado
/root/bin/onia-latido.sh | cada 30 1 * * * | modelo sin modelo declarado
/root/bin/onia-latido.sh | cada */5 * * * * | modelo sin modelo declarado
…
```
No se sabe cuál es cuál y **el resumen de las 06:30, que declara `ONIA_JARVIS_MODELO:-gpt-5-mini`, sale «sin modelo declarado»**. La prueba actual (`diagnostico-modelo.test.mjs`)
no lo vio porque usa líneas directas (`30 10 * * * /root/bin/onia-jarvis-resumen.sh …`), la forma del ejemplo del contrato C3, que no existe en producción.

## Qué se cambia (solo la sección 16 y su prueba)
### A. Desenvolver el latido en la parte B
Cuando la primera palabra `/root/bin/…` de la línea del crontab sea `/root/bin/onia-latido.sh`:
- La forma es `onia-latido.sh <nombre> <segundos> '<comando>'`. Tomá `<nombre>` (solo `[A-Za-z0-9._-]+`; si no, `(sin nombre)`) y `<comando>` (la palabra 3 después del latido).
- `shlex.split` del comando de adentro. Las asignaciones `NOMBRE=valor` que estén **antes** del script de adentro (por ejemplo `ONIA_AVISO_SOLTAR=1`) son los overrides.
  El script es la primera palabra que coincida con `/root/bin/<nombre>` (en `[ ! -x X ] || X` es `X` las dos veces: da igual cuál).
- La declaración del modelo se busca en el **texto del script de adentro** (no en el del latido), con las mismas reglas de hoy (primera `${VARIABLE:-valor}` con `MODEL`,
  override de la línea gana, lista blanca del valor `[A-Za-z0-9][A-Za-z0-9._:/+-]*`, si no `sin modelo declarado`). Las asignaciones de la línea del crontab **antes del latido** también cuentan.
- Línea de salida de un trabajo envuelto: `<nombre> → <script de adentro> | cada <horario> | modelo <…>`. Ejemplo esperado:
  `resumen-manana → /root/bin/onia-jarvis-resumen.sh | cada 30 10 * * * | modelo gpt-5-mini`.
- Si el script de adentro no está instalado: `<nombre> → <script> | cada … | modelo no instalado`. Si no se puede sacar el script de adentro: `<nombre> → (no pude leer el comando) | cada …`.
- Una línea **sin** latido sigue como hoy (`<script> | cada … | modelo …`).

### B. Dos retoques chicos en la misma sección
1. **Parte A:** los valores que se imprimen (`nombre`, `horario`, `modelo`) pasan por una función que, si no son texto, imprime `(estructura)` y que corta a 80 caracteres. Así un `model` o un `schedule`
   que en algún archivo sea un objeto no vuelca su contenido. No imprimas ninguna otra clave. Hoy un `schedule` objeto se imprime entero.
2. **Silencio no es información:** si la parte A termina sin ningún trabajo, imprimí `(el archivo no trae trabajos)`; si la parte B no imprimió ninguna línea, `(el crontab no trae trabajos con un script de /root/bin)`;
   si `crontab -l` falló o salió vacío, `(crontab ilegible o vacío)`.

## PRUEBA DE HECHO
1. `npm run test:jarvis-modelo` en verde. **Las líneas del crontab de la prueba salen de `aplicar.sh`**, no de un texto escrito a mano: el test lee `hermes-content/deploy/hermes-jarvis/aplicar.sh`,
   toma las líneas del bloque «Los seis trabajos…» (las que contienen `LAT +`), reemplaza `" + LAT + "` por la ruta del latido de la prueba y le quita las comillas de Python. Si el formato de
   `aplicar.sh` cambia y no se puede leer, el test **falla** (no se salta). Con eso:
   - a. Salen **6 líneas de trabajos envueltos**, una por nombre del latido (`resumen-manana`, `resumen-noche`, `aduana-soltar`, `agenda-bloques`, `respuestas-pedidos`, `qa-release`), cada una con su script de adentro distinto del latido.
   - b. `resumen-manana` y `resumen-noche` dicen `gpt-5-mini` (con un `onia-jarvis-resumen.sh` falso instalado que declara `MODELO="${ONIA_JARVIS_MODELO:-gpt-5-mini}"`); el resto dice `sin modelo declarado`.
   - c. `aduana-soltar` no pierde su `ONIA_AVISO_SOLTAR=1`, y un script de adentro que declara `${ONIA_X_MODELO:-...}` con `ONIA_X_MODELO=otro` antes en el comando de adentro gana `otro`.
   - d. Ninguna de las líneas de salida es `onia-latido.sh | … | modelo sin modelo declarado` (la forma rota de hoy).
   - e. Un script de adentro no instalado → `no instalado`.
2. **Mutación:** una copia del texto de la sección donde el desenvolvimiento se desactiva (por ejemplo, ignorar el caso `onia-latido.sh`) hace fallar a (a), (b) y (d). La prueba lo comprueba.
3. **Parte A:** `schedule` como objeto `{"kind":"cron","expr":"0 6 * * *"}` y `model` como objeto imprimen `(estructura)`, nunca el contenido; un `model` de 200 caracteres sale cortado a 80. `SECRETO-DE-PRUEBA` en el `prompt` o dentro de un `model` objeto no aparece.
4. Los casos que ya había (a-h del contrato C3) siguen pasando salvo los que dependan del texto exacto que cambia; si cambiás una expectativa existente, decí cuál y por qué.
5. `npm run test:jarvis-aplicar`, `test:jarvis-diagnostico`, `test:qa-diario-guarda`, `test:jarvis-resumen`, `test:herramientas-desplegadas` y `test:docs-hygiene` siguen en verde. `bash -n diagnostico.sh` sin errores.

## REGLA DE PARADA
- **El script solo lee.** Nada de `systemctl restart`, `crontab -e`, escrituras fuera de `/tmp`, `docker`, `curl`, ni llamadas a `hermes` o a cualquier modelo. No ejecutes los scripts de `/root/bin`: se leen como texto.
- **No toques las secciones 1 a 15** ni el resto del archivo. Solo la sección 16.
- No imprimas el `prompt`, ninguna clave de API ni el valor de una variable de entorno: solo nombres de modelo (lista blanca) y horarios.
- El texto de la sección 16 sigue sin contener `curl`, `wget`, `urllib`, `requests`, `http://`, `https://`, `api.openai`, `LITELLM` ni `hermes cron` (la prueba existente lo comprueba).
- Sin dependencias nuevas. Este script corre como root en producción: entregá un diff chico y legible.

## ARCHIVOS
Puede editar: `hermes-content/deploy/hermes-jarvis/diagnostico.sh` (solo la sección 16) y `scripts/loops/diagnostico-modelo.test.mjs`.
Todo lo demás, prohibido (incluido `aplicar.sh`: la prueba lo **lee**, no lo cambia).

## Contexto mínimo
- Onia (Bolivia) vende un sistema de gestión por rubro. **Hermes** es su asistente por Telegram y corre en un VPS con un `crontab` de root que `aplicar.sh` instala.
- Cada trabajo de Hermes corre dentro de `onia-latido.sh` (deja en `/var/lib/onia-latido/<nombre>` cuándo terminó y con qué código). Por eso el comando de verdad va entre comillas.
- `diagnostico.sh` lo ejecuta GitHub Actions todos los días por SSH y su salida queda en un log: nada secreto. Cada sección pasa por `| redactar`.
- Lección que esta tarea corrige: **el ejemplo de una prueba tiene que salir del sistema real, no del contrato.**
