# Cloud, Higgsfield y VPS — mapa de permisos y modelos

Fecha: 6-oct-2026, America/Caracas. Preparado para revisión de la madre principal; v2 no ordena ni activa servicios.

META: definir el acceso mínimo para trabajar en cloud sin trasladar sesiones personales al VPS. PRUEBA: capacidades observadas, fuentes oficiales abiertas y bloqueos con intervención humana precisa. PARADA: runbook listo; sin login, SSH, instalación, configuración, pagos, generación, publicación ni deploy.

## Decisión propuesta

Usar Codex cloud para trabajo acotado de repositorios. Para contenido de ONIA, priorizar la CLI oficial de Higgsfield con la cuenta existente y presupuesto aprobado. La API comercial de Higgsfield se evalúa solo si ONIA necesita integrar generación en un producto: tiene cuenta y facturación separadas. El navegador personal permanece en la laptop; el VPS conserva su función de producto.

## Evidencia local comprobada

| Capacidad | Resultado del 6-oct | Límite de la comprobación |
|---|---|---|
| Codex CLI | `codex-cli 0.139.0`; `codex cloud list --limit 1 --json` terminó con exit 0 y devolvió `tasks`/`cursor`, sin tareas en esa muestra | Lectura cloud autenticada; no se creó una tarea ni se comprobó un modelo remoto |
| Entornos cloud | La madre informó que la CLI ya ve entornos | Esta pasada no abrió el selector interactivo ni inspeccionó configuración remota; IDs, repos y red pendientes de confirmar por madre |
| Selección cloud por CLI | `codex cloud exec --help` anuncia `--env`, `--branch`, `--attempts` y `-c`; no anuncia un selector `--model` | Un override genérico `-c model=...` no demuestra que el servidor cloud lo respete |
| Configuración CLI local | Snapshot inicial: `gpt-6-astra`, esfuerzo `high`; madre cambió sólo effort a `medium` y verificó TOML | Modelo CLI permanece Astra para programación. Los defaults no describen necesariamente la sesión desktop ni el modelo cloud |
| Higgsfield CLI | Instalada, versión 1.1.24; `account status` termina con exit 2 y el mensaje coincide con la categoría login | No hay sesión CLI utilizable acreditada; no se imprimió la salida de cuenta ni se inició login |
| Configuración Higgsfield | Existe `C:/Users/PC/.config/higgsfield/`; aparecen `config.json` y `credentials.json.lock`; `credentials.json` ausente | Presencia de configuración no equivale a autorización; no se leyó su contenido |
| Navegador expuesto a este carril (inventario propio) | `cua.getState()` devuelve IAB y MCP Apps sin pestañas; no expone Chrome OnIA | Inventario del carril, no global: madre sí controla IAB con pestañas Datec. Chrome OnIA no está expuesto; logincloudIAB previo falló |
| KeePassXC | CLI instalada; `C:/Users/PC/BovedaPrivada/Agentes.kdbx` ausente; carpeta prevista `BrowserProfiles` ausente | Puente y ubicación real no comprobados; no buscar ni exportar entradas como sustituto |
| Credenciales locales de servicios | Existen `~/.codex/auth.json` y la ruta de llave SSH documentada | Solo presencia, sin abrir archivos; no demuestra validez, scope ni acceso desde cloud |
| Variables del proceso actual | Ausentes: `HF_API_KEY`, `HF_API_SECRET`, `HF_API_KEY_ID`, `HF_API_KEY_SECRET`, `HIGGSFIELD_API_KEY`, `HIGGSFIELD_API_SECRET`, `OPENAI_API_KEY`, `GH_ACTIONS_TOKEN`, `ONIA_VPS_SSH_KEY_B64`, `CLOUDFLARE_API_TOKEN` | No demuestra ausencia en el VPS, otra sesión o un entorno cloud; no se enumeraron valores |

No hay herramientas MCP de Higgsfield expuestas en el catálogo de esta sesión. Tener skills o CLI instaladas no conecta una cuenta. Las sesiones cloud de Claude descritas en los handoffs no transfieren automáticamente sus conectores a Codex.

## Permisos mínimos por destino

| Destino | Acceso mínimo propuesto | Credencial/cuenta | Intervención humana si falta |
|---|---|---|---|
| Codex cloud: documentación/QA | Entorno privado; solo repos del carril; sin credenciales de producción; salida de red limitada a documentación y dependencias necesarias | Sesión ChatGPT/GitHub autorizada; permisos de repos necesarios para tarea/PR, sin administrar organización, workflows ni secretos | Madre/Sergio verifica repos y privacidad en entorno existente; consentimiento GitHub solo si lo requiere la UI |
| Codex cloud: contenido Higgsfield | Entorno separado de producto; sin llave VPS ni token Actions; CLI o conector oficial soportado y aprobado | Cuenta Higgsfield existente, sesión autorizada propia del entorno | Sergio completa login/consentimiento/MFA cuando se autorice ese paso; no copiar cookies de Chrome ni archivo de credenciales de laptop |
| Higgsfield web | Conector que realmente alcance Chrome OnIA; sitios de la tarea, uso serializado | Sesión web ya autorizada; puente KeePassXC solo si existe/configurado | Si sesión no accesible, madre prepara revisión del conector; Sergio desbloquea bóveda o responde Google/MFA, nunca por chat |
| Higgsfield API comercial | HTTPS al endpoint oficial `api.higgsfield.ai`, credencial específica y presupuesto separado; sin Google/cookies/bóveda personal | Cuenta API, clave API y balance propio; no inferir scopes granulares que el proveedor no documente | Sergio autoriza cuenta/términos, provisión de clave por canal seguro y presupuesto; no financiar balance en esta tarea |
| VPS: diagnóstico | Solo operaciones necesarias por workflow controlado o cuenta de diagnóstico limitada; preferir sin credencial VPS para tareas de código/contenido | Acceso existente comprobado después de autorización; no entregar root como permiso general | Sergio autoriza operación concreta; madre coordina dueño de infra. Si hace falta ampliar acceso, revisión separada |
| VPS: deploy/cambio de servicios | Fuera de permisos de desarrollo y generación | Mecanismo de deploy existente, revisión y respaldo/rollback | Aprobación explícita contemporánea y validación previa; no se configura aquí |

El permiso de GitHub puede ser más amplio que las rutas de una tarea: el lease y el alcance escrito coordinan el trabajo, pero no son una frontera criptográfica. No suponer que un permiso Actions: write queda limitado a un workflow.

## Higgsfield: qué factura cada vía

Web usa la suscripción/créditos de `higgsfield.ai`. CLI y MCP se conectan a esa misma cuenta y consumen créditos del plan; no requieren una clave de la API comercial. La guía CLI/MCP excluye Unlimited y generaciones gratuitas para esas conexiones. Por ello, no presentar una generación CLI como gratis porque el plan web diga Unlimited. [Guía CLI](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-access-higgsfield-via-cli).

La API es un producto separado: cuenta API, catálogo propio y balance prepago independiente en dólares/unidades. La suscripción anual de ONIA no acredita saldo API. El catálogo puede diferir del web. Los hosts de consola publicados varían entre enlaces oficiales; seguir el enlace vigente de la guía hacia la consola, sin asumir que `cloud.higgsfield.ai` hereda el login web. [Diferencia API/plan/CLI](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api), [términos API, secciones 1.2 y 9](https://open.higgsfield.ai/terms-of-service).

Para ONIA contenido: recuperar primero la sesión CLI mediante flujo oficial cuando se autorice; después comprobar cuenta/workspace y saldo sin exponer identificadores, cotizar con `generate cost` y revisar ajustes antes de solicitar generación. CLI autenticada y saldo no autorizan gasto ni publicación. No se generó, subió ni descargó media en esta pasada. [CLI oficial](https://github.com/higgsfield-ai/cli).

## Codex cloud actual frente a Legacy

La guía actual permite entornos privados, destinos de red y secretos de red: el programa recibe un placeholder y el proxy sustituye la credencial para destinos HTTPS:443 autorizados; variables directas sí quedan legibles por el proceso. Privacidad, identidad VPN y credenciales de entorno requieren revisión antes de compartir. Configurar un dominio no concede permiso en el servicio. Preferir secreto de red cuando el cliente sea compatible; no prometer que la CLI Higgsfield admite ese mecanismo sin probarlo. [Entornos actuales](https://learn.chatgpt.com/docs/environments/cloud-environments).

La guía antigua está marcada Legacy y dice que los secretos solo están disponibles durante setup. No aplicar esa regla automáticamente al producto actual ni convertir secretos a variables/archivos para sortearla. Identificar primero la clase de entorno visible en la cuenta. [Legacy](https://learn.chatgpt.com/docs/environments/cloud-environment).

Propuesta de red: documentación y lecturas con los hosts necesarios; Higgsfield API solo con su host API y hosts oficiales de assets que el flujo requiera; CLI/MCP con los hosts que documente su conexión, sin confundirlos con el endpoint de la API comercial. No abrir todos los dominios para resolver un bloqueo. En Legacy se documentan restricciones por método HTTP: GET/HEAD/OPTIONS para lectura, y generación necesita escritura. Comprobar controles equivalentes en la UI actual antes de prometer una allowlist por método. [Red Legacy](https://learn.chatgpt.com/docs/cloud/internet-access).

VPN/OIDC existen en la documentación actual, pero no están configurados ni autorizados aquí. No son motivo para instalar Tailscale, ampliar Cloudflare ni trasladar el navegador al VPS. El VPS de producto no es un navegador personal ni un ejecutor general de media.

## Modelos y reserva

Política de esta tarea: Platform y ambas madres `gpt-6-astra` medium; otros carriles `gpt-6.1-sol` medium (cambio Sergio6-oct). El routing canónico AI_MODEL_ROUTING_2026.md ya tiene precedencia Codex del5-oct con esa política; la tabla histórica22-sep no manda. Madre corrigió el esfuerzo CLI de high a medium; no cambió modelo CLI ni configuración cloud.

Desktop y CLI documentan selectores de modelo/esfuerzo; la CLI normal documenta `-m`. Esto no demuestra selección mediante `codex cloud exec` 0.139. La documentación dice que disponibilidad depende de cuenta/cliente. Antes de un trabajo Platform cloud, verificar el selector de la superficie concreta y conservar metadata del modelo/esfuerzo del run, si la superficie los expone; si no los expone, registrar **no verificable** y escalar a madre. Un prompt que diga Astra tampoco acredita que Astra ejecutó. [Modelos](https://learn.chatgpt.com/docs/models), [comandos cloud](https://learn.chatgpt.com/docs/developer-commands?surface=cli).

No hacer fallback automático a GPT-5.5. El handoff del 4-oct documenta un fallo de `gpt-6-*` con CLI antigua; no acredita indisponibilidad actual en desktop/cloud. La guía oficial anuncia retiro de GPT-5.5 de Codex con login ChatGPT el 14-oct-2026, por lo que esa receta necesita revisión antes de reutilizarse. No se actualizó CLI ni ejecutó inferencia para probar modelos. [Aviso oficial](https://learn.chatgpt.com/docs/models).

Snapshot de límites de esta cuenta: ventana semanal, 23% usado / 77% restante; reset 11-oct-2026 19:30 America/Caracas. Reserva requerida: 20% de cuota total; margen previo a reserva en esta muestra: 57 puntos porcentuales. Volver a consultar antes de cada tanda; no es cuota exclusiva de un carril ni un candado automático. No se compraron créditos ni usó un reset. Si el margen cae a la reserva, cerrar evidencia y no iniciar tandas opcionales; necesidad crítica pasa a madre, sin bajar Platform de Astra por suposición.

## Siguiente intervención concreta de la madre/Sergio

1. Verificar en el entorno cloud existente: repos, privacidad, clase actual/Legacy, red y controles de modelo/esfuerzo. No requiere repetir el login CLI que ya permite lectura; el login IAB previo fallido no se repite a ciegas.
2. Elegir CLI de Higgsfield para el trabajo de contenido existente. Tras autorización específica de login, Sergio completa el consentimiento en un navegador accesible y se comprueba `account status` con salida reducida. Si hace falta una instalación/conector, explicar nombre, origen y propósito y obtener aprobación antes.
3. Para usar navegador personal, confirmar conector Chrome OnIA y ubicación/puente real de la bóveda: la ruta prevista está ausente. No pedir contraseña maestra, exportar entradas ni trasladarlas a cloud/VPS.
4. Mantener diagnóstico/deploy VPS como tarea independiente con alcance, revisión y aprobación. La presencia de una llave local o permisos antiguos no autoriza ejecutar SSH ahora.
5. Solo si ONIA decide integrar generación en su producto: proponer cuenta/clave API separadas y presupuesto verificable. No abrir cuenta, aceptar términos ni recargar en nombre de esta inspección.

HECHO: inventario local, fuentes oficiales, separación de facturación y runbook. BLOQUEADO: modelo cloud realmente seleccionado, sesión Higgsfield, acceso Chrome/bóveda y runtime VPS; no se intentaron las operaciones excluidas. Frentes usados: operaciones, seguridad de credenciales y verificación; sin agentes extra.

Fuentes locales: `AGENTS.md`, `COORDINATION_MANIFEST.md`, `.claude/skills/onia-router/SKILL.md`, `.claude/skills/onia-infra/SKILL.md`, `.claude/skills/onia-sesion-madre/SKILL.md`, `.claude/skills/higgsfield-generate/SKILL.md`, `hermes-content/skills/seguridad-credenciales.md`, `hermes-content/docs/AI_MODEL_ROUTING_2026.md`, `hermes-content/docs/handoff/codex-relevo.md`, `hermes-content/docs/handoff/hermes-jarvis.md`. Fuentes públicas abiertas el 6-oct-2026; estado local es una muestra de este proceso, no inventario de todos los entornos.

## Reels: destino cloud y fallback local — instrucción Sergio6-oct

Sergio pide trabajar todo en cloud; autoriza analizar desde la madre local si el entorno cloud no puede. No afirmar incapacidad universal de cloud para video: hay que probar este entorno y este proveedor. Los reels Ddm5jEHOgK6/Dd6Lo7uApvT fueron descargados/analizados en laptop, no en cloud. Ambas llamadas Gemini devolvieron503: disponibilidad transitoria del proveedor, no prueba de restricción cloud. Cobertura visual por fotogramas; audio no analizado.

Prueba de habilitación cloud (pendiente, no ejecutada):
1. Comprobar repo, modelo/esfuerzo, herramientas existentes y permisos de red del entorno de contenido; ninguna llave VPS para esta tarea. Instalación ausente requiere aprobación previa.
2. Comprobar acceso autorizado al reel/MP4. Instagram puede exigir sesión o bloquear tráfico; no copiar cookies personales a cloud ni eludir controles. Si enlace falla, usar un MP4 accesible autorizado o fallback madre local.
3. Verificar ffprobe/ffmpeg o herramientas equivalentes existentes y lectura de fotogramas por el agente. Registrar duración, timestamps y cobertura, no sólo metadata.
4. Para audio/video nativo, comprobar credencial segura y presupuesto del proveedor soportado; Geminihelper es una opción, no una capacidad garantizada por Codex. Una API externa puede facturarse aparte de la suscripciónCodex; verificar antes de gasto. SinAPIaudio, informar cobertura parcial.
5. Hacer una sola prueba acotada, cachear resultado y no repetir503 en loops. Éxito exige análisis visual+audio corroborado y fuente; descargar un archivo no basta.
6. Guardar ficha y evidencia no secreta canónica. Ante bloqueo, mandar a madre causa exacta(red/login/herramienta/proveedor/modelo/costo) y seguir otro trabajo seguro. No pasar a Sergio edición/descarga que madre pueda completar con acceso disponible.

No se creó entorno, instaló herramienta, movió secretos ni ejecutó inferencia cloud en este cambio. Fallback actual: laptop disponible. Todo-cloud sólo se anuncia logrado cuando la prueba termina verificable.

## Revalidación6-oct tras pedido de autonomía

Madre comprobó nuevamente CLI0.139: `cloud list --limit 3 --json` devuelve tasks vacío; `cloud exec --help` sin selector explícito de modelo, sólo overridegenérico. Navegador disponibleIAB/MCPApps, sinChrome; abrirCodexcloud redirige al login. No se creó tarea ni se trasladaron chats/cloudsecretos. Pregunta concreta enviada aSergio: si Codexcloudabre en su navegadorhabitual, para distinguir falloIAB de cuenta. Regla: bloqueo técnico sigue pendiente, sin asumir imposibilidaduniversal ni volver a pedirclaves.

## Corrección de capacidad — navegador cloud, 6-oct-2026

META: habilitar operación remota con navegador sin confundir productos. PRUEBA DE HECHO: documentación oficial vigente y una futura prueba real de sesión. REGLA DE PARADA: no anunciar migración ni acceso Higgsfield hasta probarlos; no instalar ni contratar servicios para sortear limitaciones.

La documentación de Codex Cloud, sección Current limitations, enumera Computer and browser use como no soportado. Por tanto, abrir Internet o permitir dominios NO habilita el navegador interactivo en esos entornos. Esto corrige la expectativa anterior de resolverlo únicamente con permisos/login. Fuente abierta 6-oct: https://learn.chatgpt.com/docs/environments/cloud-environments

ChatGPT Work Cloud sí documenta navegador remoto, sesiones propias y login privado/toma de control. Su disponibilidad depende de cuenta, despliegue y permisos; no hereda cookies locales ni garantiza acceso Higgsfield. Fuente abierta: https://learn.chatgpt.com/docs/browser . Los dots también documentan navegador cloud propio: https://learn.chatgpt.com/docs/dots/computers-and-apps . Ninguna de estas capacidades se comprobó en la cuenta ONIA en esta pasada.

Decisión operativa propuesta: Codex Cloud para desarrollo/QA; Work Cloud para operaciones con navegador, si la cuenta permite comprobar modelo y acceso. Una sola madre; Work sería ejecutor, no otra madre. Modelo requerido para operaciones Sol6.1 medium; no crear una tarea con modelo desconocido y presentarla como conforme. Madre y v2 siguen Astra medium. No recurrir a API pagada o VPS nuevo como sustitución silenciosa.

Contrato de primera prueba Work Cloud, preparado para ejecutar al disponer de superficie/modelo:
- Confirmar entorno remoto y modelo desde metadata/selector; no inferirlo del prompt.
- Abrir únicamente https://higgsfield.ai/ y comprobar navegador mediante lectura de interfaz y captura. Sin instalación, generación ni subida de archivos.
- Si requiere login, usar formulario privado o toma de control oficial; Sergio completa consentimiento/MFA fuera del chat. No copiar cookies, credenciales locales ni bóveda.
- Tras login comprobar acceso a biblioteca y saldo mostrado, sin publicar identificadores de cuenta. Parar si el sitio bloquea automatización, exige compra o no ofrece flujo compatible.
- Cerrar con evidencia de acceso o bloqueo preciso. Una sesión autenticada no autoriza generaciones pagadas ni publicaciones. Persistencia y ejecución recurrente se validan aparte; el heartbeat actual sigue local.

Configuración preparada, NO aplicada remotamente. CLI0.139 no expone administración de entornos; UI anterior vuelve al login. Pendiente intervención mínima: comprobar que la cuenta muestra Work Cloud/navegador y selector Sol6.1. No repetir petición de claves ni intentar resolver el acceso mediante exportación de sesiones.
