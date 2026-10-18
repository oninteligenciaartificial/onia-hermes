---
id: hermes-L1
carril: hermes
estado: pendiente   # pendiente | lanzada | PR | hecha | bloqueada
modelo: gpt-6-luna  # mecánico: un script de Node sin dependencias y su prueba
repo: onia-hermes
rama: codex/hermes-qa-web-vs-producto
base: main
pr:
escrita: 2026-10-11 por Hermes-Jarvis (nube)
actualizada: 2026-10-11 por Hermes-Jarvis (nube)
nota: Independiente de #194 (no toca `diagnostico.sh` ni el workflow). Usa las páginas de ejemplo de `docs/research/promesas-web/2026-10-11/`, que hoy viajan en #194: se lanza cuando entren a main.
---
# L1 · El chequeo de «la web contra el producto» como script que se repite (Codex Luna, mecánico)

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-hermes` que creó la madre, en la rama `codex/hermes-qa-web-vs-producto`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin `npm install`, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.

## META
Hoy, cada vez que alguien quiere saber si `onia.com.bo` todavía promete lo que el catálogo no deja, o si sus precios siguen siendo los del código, lo mira a mano (Q7 y Q8 del 11-oct, ~40 min). Que sea un script de Node sin dependencias nuevas, repetible, que lee las páginas ya convertidas a texto y el código de `onia-platform`, y dice qué cambió. **No usa LLM ni navegador.**

## PRUEBA DE HECHO
1. `node --test .claude/skills/onia-hermes-jarvis/scripts/web-vs-producto.test.mjs` en verde.
2. Con las 8 páginas de ejemplo de hoy el script reproduce, tal cual, lo que escribió la madre a mano:
   `node .claude/skills/onia-hermes-jarvis/scripts/web-vs-producto.mjs --texto-dir hermes-content/docs/research/promesas-web/2026-10-11/texto --platform .claude/skills/onia-hermes-jarvis/scripts/fixtures/platform`
   - sale con código 0 y dice **0 diferencias de precio** (planes mensual, anual y semanal; add-ons; topes);
   - lista las **9 promesas de `ONIA_PROMESA_VS_PRODUCTO.md` §3**: las 8 que se pueden chequear por frase dicen «sigue» (la de `/register` también: `app-register-paso2.txt` trae «Nombre de tu clínica») y la novena, la del catálogo que se contradice, dice «manual»;
   - dice **0 textos de obra**.
3. Pruebas de mutación (en el test, sobre una copia en memoria): cambiar «890» por «900» en `precios.txt` → código 1 y nombra «Profesional · mensual: web 900, código 890»; agregar «Muy pronto» a `home.txt` → código 1 y cita la línea; borrar la frase del tratamiento a medias de `rubros.txt` → esa promesa pasa a «no está» y sigue con código 0.
4. Si el código de `onia-platform` cambia de forma y el script no puede leer un número, **sale con código 2 («NO MEDIDO») y dice cuál**, nunca con 0 ni con un número inventado. Hay una prueba para eso (un `subscription-plans.ts` sin `DEFAULT_PLAN_AMOUNTS`).

## REGLA DE PARADA
- **Sin red en las pruebas y sin navegador.** El modo en vivo es solo para uso manual y es opcional (ver abajo): si no lo podés probar, dejalo marcado como no probado en el resumen.
- **No toques `ONIA_PROMESA_VS_PRODUCTO.md`, `package.json`, `.github/` ni el crontab.** La madre decide si lo cablea al CI o a un cron.
- **No leas ni escribas nada de `onia-platform`.** Solo lo lee el script, y solo dos archivos: `lib/subscription-plans.ts` y `lib/pricing.ts`.
- **No ejecutes TypeScript:** extraé los números con expresiones regulares acotadas al bloque `DEFAULT_PLAN_AMOUNTS` y a los nombres de las constantes del add-on. Si el bloque no aparece, código 2.
- Tres archivos nuevos como máximo (`web-vs-producto.mjs`, su test, la carpeta `fixtures/platform/` con dos archivos mínimos) y nada más.
- Si algo de la web no se parece a lo que describe este documento, no lo adivines: anotalo en el resumen.

## Qué construir
Todo en `.claude/skills/onia-hermes-jarvis/scripts/`.

### 1. `web-vs-producto.mjs`
Argumentos: `--texto-dir <carpeta con home.txt, precios.txt, chatbot.txt, rubros.txt, contacto.txt, comparativa.txt, servicios-webs.txt, nosotros.txt, app-register-paso2.txt>` y `--platform <carpeta de onia-platform>`; opcional `--json` para imprimir solo JSON. Una función `htmlATexto(html)` exportada (para el modo en vivo: `--base https://onia.com.bo` hace `fetch` de cada ruta y la pasa por esa función: quita `script` y `style`, separa con salto de línea los bloques, decodifica entidades). El modo en vivo no se prueba con red; sí se prueba `htmlATexto` con un HTML chico.

Tres chequeos:
1. **Precios.** Del código, `DEFAULT_PLAN_AMOUNTS` (`basic`, `crece`, `professional`, `clinic`, `enterprise`; `monthly`, `annual`, `weekly`) y las constantes de los add-ons que están en `lib/pricing.ts`: agente de WhatsApp (`entryMonthly`, `annualTotal`), recarga de 200 conversaciones (`precio`), reservas (`BOOKING_ADDON_PRICE.monthly`), usuario extra (`EXTRA_USER_ADDON_PRICE.monthly`), implementación de Grupo (`setupFrom`). De la web, en `precios.txt`: la cifra que sigue a cada nombre de plan («Básico», «Crece», «Profesional», «Completo»; «320» y «Bs / mes» van en renglones separados), «N Bs/año», «N Bs/sem», y los add-ons por su frase («Bs 390/mes», «Bs 190», «Bs 150/mes», «Bs 70/mes», «desde 3.500»). Los miles se escriben con punto: `3.200` es 3200. Cada diferencia sale como «Plan · ciclo: web X, código Y».
2. **Obra.** Estas expresiones, sin distinguir mayúsculas, en las 8 páginas y en el alta: `muy pronto`, `pr[óo]ximamente`, `en construcci[óo]n`, `\bbeta\b`, `\[CONFIRMAR`. «Borrador» NO cuenta (en `/privacidad` y `/terminos` habla de los borradores de la IA). Cada hallazgo cita archivo y línea.
3. **Promesas.** Un arreglo `PROMESAS` dentro del script, una entrada por fila de la §3 de `hermes-content/docs/ONIA_PROMESA_VS_PRODUCTO.md`, con `id`, `pagina` y una expresión que busca la frase: «responde las 24 horas» en `chatbot.txt`; «tratamiento a medias» en `rubros.txt`; «Agente conversacional de WhatsApp incluido» en `precios.txt`; «Dentiqa» o «Doctocliq» en `comparativa.txt`; «Bs 2.000» en `servicios-webs.txt`; «en Crece y Profesional, las que necesites» en `precios.txt`; «30 MINUTOS» en `contacto.txt`; «Nombre de tu» en `app-register-paso2.txt`. La novena (el catálogo se contradice) es de un `.md`: no se chequea acá, imprimí «manual». Para cada una, «sigue» (la frase está) o «no está».

Salida: una tabla en texto plano con los tres chequeos y una línea final «N diferencias de precio · M textos de obra · P promesas siguen · Q no están». Código de salida: 0 si no hay diferencias ni obra; 1 si hay alguna; 2 si no pudo medir algo (y dice qué).

### 2. `web-vs-producto.test.mjs`
Con `node:test`. Cubre la PRUEBA DE HECHO 2 a 4 con las páginas de ejemplo (leídas de `hermes-content/docs/research/promesas-web/2026-10-11/texto/`, sin copiarlas) y el `htmlATexto`.

### 3. `fixtures/platform/lib/subscription-plans.ts` y `pricing.ts`
Dos archivos mínimos, copiados a mano de lo que dice la §3.1 del doc (basic 320/3200/89, crece 550/5500/145, professional 890/8900/229, clinic 1290/12900, enterprise 2900/29000; add-ons 390, 3900, 190, 150, 70, 3500) con la misma forma que el código real (`export const DEFAULT_PLAN_AMOUNTS: Record<…> = { basic: { monthly: 320, weekly: 89, annual: 3200 }, … }`). Un tercer archivo `subscription-plans.sin-bloque.ts` para la prueba de código 2.

## Contexto mínimo
- **Qué es:** Onia vende un sistema de gestión por rubro a negocios de Bolivia; la web es `onia.com.bo`. Los precios mandan en `onia-platform/lib/subscription-plans.ts` (planes) y `lib/pricing.ts` (add-ons): la web LEE de ahí, nunca define un precio.
- **Por qué importa:** `CLAUDE.md` cuenta el 15-ago, cuando había cuatro precios vivos del mismo producto. Y la venta nunca exhibe obra (regla del 20-ago).
- **Qué no es este script:** no juzga si una promesa está bien (eso lo decide la madre con el catálogo); solo dice si la frase sigue en la web.
- **Hecho a mano el 11-oct:** la §3 y la §3.1 de `ONIA_PROMESA_VS_PRODUCTO.md`. Leelas: son tu respuesta esperada.
- Estilo: JavaScript de módulos, sin dependencias, funciones chicas, errores explícitos. Los textos que imprime van de usted y en español.
