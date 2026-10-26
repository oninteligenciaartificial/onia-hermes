# Homelab y orquestación — medición del 27-sep-2026

## Actualización del 28-sep-2026: acceso a casa interrumpido

A las 20:59–21:03 UTC (16:59–17:03 Bolivia), SSH al VPS responde y
`hermes-gateway.service` está `active`. El salto a casa por
`127.0.0.1:2222` devuelve `Connection refused`; no aparece su listener.
Esto no permite determinar si la causa es energía, Windows/WSL, red o el túnel.

Los cuatro logs sincronizados bajo `/var/log/homelab` tienen última modificación
a las 16:00 UTC (12:00 Bolivia). Últimos arranques registrados: `web-venta`
14:48 UTC, `onia-cola` 15:33, `chatbot-cola` 15:43 y `recorrido-cliente` 15:09.
El vigía conserva marcas de silencio para tres loops; no se verificó entrega
de Telegram. Sus cadencias de vigilancia son conservadoras y no coinciden todas
con las frecuencias del cron de casa observado el día anterior.

La tabla de abajo conserva la inspección del **27-sep**, no acredita ejecución
continua hoy. Las pruebas Linux ejecutadas entonces y sus hashes siguen siendo
evidencia válida del candidato. No se reinició nada, se reactivaron loops ni se
añadieron escritores en otro host. Recuperar acceso al nodo y conciliar el trabajo
remoto antes de iniciar otro ejecutor evita que vuelva y duplique tareas.

## Estado comprobado

Medición por SSH a las 23:07–23:09 UTC (19:07–19:09 La Paz), sin modificar
servicios, cron, tableros, credenciales ni repositorios remotos.

| Componente | Resultado vivo |
| --- | --- |
| Nodo de casa | `DESKTOP-0GGGNMF`, marcador `/root/.onia-nodo = casa`, seis días encendido. |
| Recursos disponibles en WSL | 12 CPU lógicas, 10.7 GiB RAM total, ~9 GiB disponible; disco `/root/loops` con 885 GiB libres. Es capacidad visible en WSL, no inventario físico completo. |
| Acceso | Túnel inverso `127.0.0.1:2222` activo; acceso con llave y host previamente verificado. |
| Ejecución | Cron activo; cuatro loops programados y dos procesos Claude en la muestra. |
| VPS | `hermes-gateway.service` activo; ninguna entrada activa `onia-loop.sh`. Las siete líneas comentadas no cuentan como loops activos. |
| Modelo de Hermes | Configuración viva: `gpt-5-mini`, proveedor `openai-api`. No se invocó el modelo ni se cambió su configuración. |
| Codex en casa | No apareció en el PATH de la sesión SSH usada. No se instaló ni se transfirieron credenciales. |
| Alertas remotas | El cron del vigía en VPS ya incluye `ONIA_TG_DIRECTO=1`; esta inspección no envió ni acreditó entrega de un mensaje. |

Los cuatro loops **sí tienen actividad reciente**. No reactivarlos ni duplicarlos
basándose en el handoff del 21-sep, cuando el túnel estaba caído.

El archivo vivo de jobs de Hermes también registra cierres `ok`: plan de
contenido hoy 08:12, ordenador del tablero hoy 13:01 y veredicto hoy 16:01
(La Paz). La agenda de días hábiles terminó `ok` el viernes 25 a las 08:02;
el 27 es domingo. Los dos primeros resúmenes usan `gpt-5-mini` y tablero/veredicto
`gpt-5-nano`. Es estado registrado del job, no prueba independiente de recepción
en Telegram ni auditoría de la calidad del contenido.

| Loop existente | Horario UTC | Última evidencia leída |
| --- | --- | --- |
| `chatbot-cola` | :13 y :43 cada hora | Cierre 22:40, exit 0, un commit; siguiente vuelta iniciada 22:43. |
| `onia-cola` | :33 cada hora | Cierre 22:51, exit 0, dos commits; árbol Hermes limpio en `02a4eef8`. |
| `web-venta` | :48 cada dos horas | Cierre anterior 21:04, exit 0, dos commits; vuelta iniciada 22:48. |
| `recorrido-cliente` | :09 cada hora | Cierre 22:25, exit 0, un commit. |

Un exit 0/commit acredita actividad, no la calidad ni la publicación de una
función. No se inspeccionó el contenido completo de esos trabajos como parte
de esta medición. El checkout de referencia Platform en casa estaba limpio y
12 commits detrás de su `origin/master` local; no confundirlo con el worktree
activo de chatbot ni actualizarlo a ciegas.

## Decisión para usar el equipo

Mantener **Hermes y el tablero en el VPS**; casa funciona como ejecutor de
trabajos acotados y pruebas. Mover el gateway de Telegram a casa añadiría la
dependencia de luz, conexión y sesión Windows sin resolver la coordinación.
La laptop conserva la interacción y la integración que Sergio está revisando.

La orquestación debe entregar resultados del negocio: una web gestionada, una
consulta atendida, una reserva o un fallo corregido. El cliente de ONIA recibe
el servicio preparado; no necesita configurar agentes ni elegir modelos.

- Hermes prioriza la cola y conserva evidencia/decisiones.
- Cada ejecutor toma una tarea con rutas, recursos y salida verificable.
- Scripts realizan hashes, pruebas y chequeos repetibles sin gastar un LLM.
- Luna hace una revisión acotada al cerrar la tanda. Errores, evidencia faltante
  y asuntos sensibles se elevan; no autoriza facturación, SIAT ni despliegues.
- Astra revisa integración y riesgos. Publicación y operaciones sensibles
  conservan sus autorizaciones específicas.

El runner existente limita duración y usa `flock` por ID de loop. Eso evita dos
vueltas del mismo loop en ese host; **no reserva rutas ni recursos entre casa y
la laptop**. Los prompts observados pesan entre 94 y 117 kB: añadir más loops
antes de reducir duplicación/contexto aumentaría consumo sin asegurar avance.

El nuevo `scripts/loops/tandas-v1.mjs` es un cierre local, no un scheduler ni un
lease distribuido. Los nuevos carriles quedan en discovery mientras sus
responsabilidades puedan chocar con los cuatro ejecutores existentes. Antes de
activar escritura automática entre hosts hace falta una reserva central de
rutas/recursos que todos los workers respeten; un lock local no la sustituye.

## Trabajo útil ejecutado en casa en esta sesión

Se envió una copia de **43 archivos del paquete SIAT**, sin configuración real,
a una carpeta temporal privada. Se compararon hashes con la integración local.
Las pruebas corrieron con entorno vacío y namespace de red propio: solamente
loopback, sin salida a Internet. No hubo SOAP ni uso de credenciales fiscales.

La primera ejecución descubrió un fallo de portabilidad que Windows no mostraba:
`run-fase1-volumen.sh` tenía CRLF y `/bin/sh` devolvía 2 en vez de la salida
controlada 1. Se normalizó a LF, se añadió la regla de Git para los wrappers y
una aserción de regresión. El archivo sigue retirado y aborta antes de operar.

**Resultado final: 446/446 pruebas, 113 suites, exit 0 en Node 22.22.1.**

- Artefacto en casa: `/tmp/onia-siat-qa-lf-20260927-uo16_oxu/`.
- SHA-256 del paquete: `ac2b2b389498eff159b0c3adb8b779ff00e57735e8372e87ed64019871a6df4e`.
- Evidencia: `result.json`, `files.json`, `tests.log`, `candidate.tar.gz`.
- Copia local: `.tmp/homelab-20260927/siat-linux-result.json` y
  `siat-linux-files.json` (temporales, no documentos canónicos).

Se conservaron ambas ejecuciones. No se sustituyó el paquete del servicio ni
se tocaron los worktrees de los loops. Esta prueba acredita el candidato, no
la homologación del SIN ni su ejecución recurrente en casa.

## Revisión de cierre y segunda tarea Linux

El control de tandas pasó **16/16 pruebas** con revisor simulado. El intento real
con Luna fue rechazado por el CLI; `model/list` de esa instalación sólo anunció
`gpt-5.5`. Se seleccionó explícitamente ese modelo con esfuerzo `medium`; la
revisión real terminó sin hallazgos y escaló por sensibilidad. La revisión
integradora habilita únicamente el uso local. Modelo, hashes y límites están en
[el registro de cierre](revision-orquestacion-20260927.json). No se atribuye a
Luna una revisión que no pudo ejecutar.

Casa ejecutó además **11/11 comprobaciones del backup de Storage**, con fixtures
y sin red, incluida la comprobación de permisos 0700. Se reprodujo y corrigió
la publicación del archivo definitivo antes de verificarlo; también se detecta
cambio de contenido con el mismo número de archivos, tamaño y fecha. Artefacto:
`/tmp/onia-storage-qa-20260927-ocsws445/`. No se ejecutó un respaldo real ni se
instaló el script en producción. Comparar el archivo contra su origen no crea
un snapshot atómico conjunto con la base de datos.

## Siguiente activación concreta

Conciliar las rutas de los carriles remotos y aplicar un contrato común de
reserva antes de conectar un segundo ejecutor de escritura automática. Hasta
entonces, casa aporta QA aislada y los loops existentes continúan con su
configuración actual. No se agrega otro cron sólo para duplicar su trabajo.

Skills: `continuous-agent-loop` y `code-review-and-quality`. Se usaron ayuda
local del CLI, código del repo y lecturas SSH. No se incorporaron dependencias
ni hizo falta investigación externa para estos comandos conocidos.

## Apéndice — QA completa de la web pública en casa

La nueva corrida usó una copia privada en
`/tmp/onia-web-qa-completa-20260927-5q0_nb8j`, sobre la integración reconciliada
`02a4eef8`, sin modificar los loops, servicios ni cron. Node 22.22.1;
dependencias locales copiadas a esa carpeta con lockfile coincidente; namespace
aislado con sólo loopback. No hubo proveedores, API fiscal ni publicación.

**Resultado comprobado: 125 suites pasan; 1.693 pruebas pasan, 4 omitidas;
exit 0.** SHA-256 del candidato:
`ac57c5c4477c107e2e3200798dcd55b44e68a7efb60dfbea4b9c21fbca6b8dda`.
Los 1.079 archivos del manifiesto existen y coinciden con la integración local
mediante hashes de texto LF y bytes de binarios. El lockfile LF coincide con
`2037fea2ce427896ece9d5323aac59fe26a6672685222c31edd96534438b56d1`.
Los originales Windows permanecen intactos.

Se preservaron los nombres de directorios hermanos de raíz y `web-factory/`,
además de las fuentes de las demás apps; se omitieron sus assets. Las dos
primeras copias recortadas no se aceptan como validación: sus universos del
scanner eran distintos. `alta-confirma-vivo.mjs` conserva su declaración;
retirarla por falta de `supabase/` en la copia habría ajustado el guard al
recorte, sin corregir el producto. El guard de agenda tiene una exención acotada
para la tarjeta «Servicios», con encabezado visible y agenda ejercitada por E2E;
no se llamó a una API ni se cambió la frase para apaciguar la prueba.

Tres omisiones son las pruebas de historia Git de `deploy-vivo.test.ts`: el
paquete no trae `.git` ni `origin/main`; en el repositorio Windows ese archivo
pasó 52/52. La cuarta es de `puesta-en-marcha.test.ts`. Cierre dirigido pasó
20 pruebas y reconciliación hero/sección 51/51, con tipos Windows verdes; no se
declara suite completa Windows verde. El build de 56 rutas y la medición móvil
16.170 → 4.845 px son evidencias previas, no un nuevo build/recorrido final.

Ver [resultado](../../../.tmp/homelab-20260927/web-linux-completa-result.json),
[hashes](../../../.tmp/homelab-20260927/web-linux-completa-files.json),
[log](../../../.tmp/homelab-20260927/web-linux-completa-tests.log) y
[detalle de integración](onia-v1-validacion-integrada-20260927.md#apéndice--suite-completa-posterior-con-inventario-fiel).
Se conserva el historial anterior. Esto acredita QA aislada del candidato,
sin instalarlo ni demostrar conversión, cliente real o segunda mensualidad;
SIAT sigue al 80% oficial, aunque su paquete local pasó 446/446 sin SOAP.
