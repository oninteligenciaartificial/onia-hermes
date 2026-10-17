# 17-oct-2026 (tarde): lo que aprendimos del canal PC → nube y por qué se pasó a local

> Foto de un día. Escrita por la madre local a pedido de Sergio Urcullo: «dejá todo eso anotado para historia de que aprendimos y lo solucionamos luego». Complementa a `2026-10-17-por-que-fallo-el-proyecto-nube.md` (la madrugada); esto es la tarde.

## Decisiones de Sergio Urcullo
- ~17:40 La Paz: «puro local, no tengo tiempo para esperar».
- ~17:50: «dame a Hermes un panel de ella 24/7 y que ella orqueste todo con suscripción de Codex; te va a hacer trabajar a vos».
- ~18:00: «puede tocar VPS para trabajar, pero necesitamos todos los frentes orquestados».
- No descargar OpenClaw por ahora (Clicky solo corre en Mac).

## Qué SÍ funcionó
- Con las reglas cargadas, la jefa del proyecto «ONIA · Hermes» recibió la orden (15:00), abrió los 4 hilos y en ~1 h subieron trabajo real: `claude/project-thread-y6ts0m` (taller: láminas v4, página /auditoria), `claude/ventas-y-pauta-956mvd` (prepago, webinar, funnel), `claude/competencia-1-0-gx9igo` y `claude/project-thread-zgcsga` (Lucía).
- Lista de grabación del Día 1 (10 piezas, grabar dom 18, salir lun 19): vive SOLO en la nube, `/mnt/project-files/marca/LISTA_DE_GRABACION_DEL_DIA.md`.
- Lo que frenaba no era la nube: los 4 hilos esperaban tarjetas de Sergio Urcullo (Plataforma: 5 cuentas «ZZ QA Prueba»; Marca: historias reales de las piezas 1, 3, 7, 8 y 9 y cierre A/B de la pieza 8; Ventas: «ok pauta G1 US$ 56»; Lucía: ok del resto de T5).
- Meta v2 del proyecto aplicada desde Chrome (engranaje → General → campo Meta: click + ctrl+a + escribir; `form_input` no sirve porque es contenteditable).
- Chrome con las sesiones de Sergio Urcullo sirve para la investigación con login: 4 referentes de Instagram y sus anuncios en la Biblioteca de Meta (rama `claude/referentes-capturas-17oct`). Hallazgo: de los 4, solo Iman Gadzhi paga pauta; Taveras, Rocha y Santiago Muñoz crecen sin anuncios visibles.

## Qué NO funcionó y por qué (para resolver después)
1. **La terminal no le puede escribir a la nube.** `claude -p --cloud <id>` da 403 «device-bound sessions require a trusted-device token». Viene del ajuste de la cuenta «Requerir dispositivos de confianza» (code.claude.com/docs/en/remote-control#trusted-devices): cada dispositivo necesita su credencial y un login de 18 h o menos, renovado con Windows Hello o passkey. No hay comando de enrolamiento aparte: se enrola al iniciar sesión.
2. **Esta PC es DESKTOP-ENV6SDA** y SÍ figura como dispositivo de confianza («Claude Code on DESKTOP-ENV6SDA», 1-oct y 16-oct). Hipótesis sin probar: su login venció (más de 18 h). Se renueva con `claude auth login`, sin `logout` antes.
3. **Chrome NO está enrolado** (solo figura como sesión activa). Por eso escribir en el chat del proyecto desde la automatización no publica: el texto entra al campo (`execCommand('insertText')`), pero ni Enter ni «Enviar» lo mandan.
4. **No existe `remote-devices` en el proyecto.** La jefa lo verificó a las 17:23: ni ella, ni sus ayudantes, ni los 4 hilos ven `device_list_dir`, `device_stage_files`, `device_request_folder_access` ni `computer_request_access`. Solo ven `list_devices` y `connect_device`, y este falla por el mismo ajuste. El log del 7-sep que lo mostraba era un chat común, no un proyecto. La doc lo confirma: «A project can't run a thread on your computer while Require trusted devices is on».
5. **No se puede leer a la coordinadora por la API.** `RemoteTrigger get_run_log` con su id (`cse_01TJUsc1ohiVRCQ2yysprxpZ`, que sí aparece en la página del proyecto) devuelve un chat del 7-sep. Para leerla queda Chrome, con el chat virtualizado (solo se ve lo que está en pantalla).
6. **No sirven para este canal** `claude setup-token`, `CLAUDE_CODE_OAUTH_TOKEN` ni `ANTHROPIC_API_KEY`: solo hacen pedidos al modelo.

## Cómo se soluciona luego (opciones, sin decidir)
- Renovar el login del CLI cada ≤18 h y volver a probar `claude -p --cloud`. Es frágil: el issue anthropics/claude-code#81164 reporta re-enrolamiento cada 8-12 h y se cerró como «not planned».
- Enrolar Chrome como dispositivo de confianza (requiere el paso con biometría de Sergio Urcullo).
- Apagar «Requerir dispositivos de confianza». Es decisión de seguridad de Sergio Urcullo: sin el ajuste, quien robe su sesión de claude.ai podría dirigir sesiones que corren en su PC.
- Canales oficiales sin probar: rutinas con disparador por API (`POST /fire`, crea una sesión NUEVA cada vez, 30 por hora) y Auto-fix de PR (los comentarios entran a una sesión existente). La doc no dice si los afecta el ajuste.

## Opinión de la madre sobre el VPS (registrada, no manda)
Antes de la decisión de Sergio Urcullo, la madre desaconsejó armar en el VPS un coordinador nuevo con trabajadores por API (Agent SDK) por cuatro motivos: repite el harness archivado el 16-oct, pasa a pago por token, mezcla trabajadores que leen la web con el servidor de producción y no arregla lo que frenaba (las aprobaciones y lo que necesita la PC). Sergio Urcullo decidió Hermes como coordinador con la suscripción de Codex y permiso para tocar el VPS: esa es la línea vigente.

## Trampas y costos medidos
- `get_page_text` del chat del proyecto trae ~8 k tokens; mejor `javascript_tool` sobre `main.innerText` en trozos de 2.600 caracteres.
- El campo del chat solo recibe texto si se le da foco por JS (`el.focus()`), y aun así no publica sin el dispositivo enrolado.
- Subagente haiku con el navegador: 4 perfiles de Instagram = 289 k tokens y 89 herramientas; Biblioteca de Meta = 310 k tokens y 126 herramientas.
- El túnel SSH al panel de Hermes desde la sesión lo frenó el control de permisos («ejecución remota sensible»). Lo corre Sergio Urcullo: `ssh -i $HOME\.ssh\onia_hermes_vps_ed25519 -N -L 9119:127.0.0.1:9119 root@187.77.16.63` y abre http://localhost:9119.
