ONIA - Cómo funciona hoy el sistema autónomo
Fecha: 16 de octubre de 2026
Para: Sergio Urcullo y las sesiones de agentes

----------------------------------------------------------------------

## 1. En una frase

Una jefa en la nube recibe lo que le pide Sergio Urcullo, lo reparte en
hilos (uno por área de trabajo), revisa y decide. Los hilos construyen.
Codex revisa cada cambio. El servidor publica. Telegram avisa.
Todo sigue andando con la PC apagada.

Palabras que se usan acá:

| Palabra | Qué es |
|---|---|
| Jefa | La sesión que reparte y decide. No hace el trabajo ella. |
| Carril | Un área de trabajo (producto, ventas, marca, etc.). |
| Hilo | La conversación de trabajo de un carril. |
| Subagente | Ayudante que un hilo llama para una tarea corta. |
| GitHub | El sitio donde vive el código. Cada cambio se propone ahí. |
| Pruebas automáticas | Chequeos que corren solos antes de aceptar un cambio. |
| Servidor | El computador remoto donde corre el producto. |
| Hoja de relevo | Archivo donde un hilo deja su estado antes de cerrarse. |
| Manual del carril | Archivo con lo aprendido de ese carril (se llama skill). |

----------------------------------------------------------------------

## 2. Diagrama simple

```
 Sergio Urcullo
   |  (app de Claude, o comando "jefa" en la PC)
   v
 JEFA  (proyecto "ONIA · Hermes", en la nube)
   |  reparte, revisa, decide
   +--> Hilo Plataforma ------+
   +--> Hilo Ventas y pauta --+--> Subagentes (ayudantes)
   +--> Hilo Marca personal --+     Opus decide lo riesgoso
   +--> Hilo Lucía/Higgsfield +     Sonnet construye
   +--> Hilo QA y avisos -----+     Haiku lee, cuenta, verifica
                |
                v
        Cambio propuesto en GitHub
                |
                v
        CODEX revisa  +  pruebas automáticas en verde
                |
                v
        Se une al código principal
                |
                v
        SERVIDOR publica el producto (cada 3 horas, minuto :50)
                |
                v
        QA mira producción con capturas
                |
                v
        TELEGRAM avisa a Sergio Urcullo (06:30 y 21:30, y OK por código)
```

----------------------------------------------------------------------

## 3. Quién hace qué

| Pieza | Qué hace | Qué NO hace |
|---|---|---|
| Sergio Urcullo | Pide, decide lo que solo él decide, da los OK. | No tiene que mirar código. |
| Jefa | Reparte en hilos, revisa, decide. Lee sus órdenes escritas en cada vuelta. Encadena sola su siguiente vuelta. | No hace el trabajo ella. |
| Hilos | Hacen el trabajo de su carril. Dejan su hoja de relevo al llenarse. | No mezclan carriles. |
| Subagentes | Leen, auditan, construyen, revisan. Un solo escritor por grupo de archivos. | No escriben dos a la vez sobre los mismos archivos. |
| Codex | Revisa cada cambio en GitHub. | No reparte trabajo. |
| Servidor | Pruebas automáticas, publicador del producto, n8n (automatizador), bot de WhatsApp, Jarvis. Tiene un navegador para QA con capturas (cuentas de prueba). | No guarda la bóveda de claves ni sesiones personales. |
| Telegram | Es el teléfono: resumen 06:30, cierre 21:30, avisos, OK por código. Lo corre Hermes Agent (de NousResearch) en el servidor, bot @aalfredhq_bot. | No decide ni programa. Usa un modelo barato que ya inventó cosas. |
| Orca | Tablero en la PC con dos pestañas (ver sección 4). | No ve la nube. Con la PC apagada no sirve. |
| Sesión de control | Corre en la PC. Instala y vigila el sistema. Hace lo que exige la PC o una sesión iniciada (Chrome, paneles). Le escribe a la jefa y a los carriles por terminal. | Con la PC apagada no existe. La jefa sigue igual. |
| Conectores de claude.ai | Dan acceso desde la nube a Higgsfield, Meta Ads, Gmail, Drive, Calendar, Notion, n8n, Vercel, Figma, Gamma. | No dan acceso a lo que dice la sección 7. |

### Los carriles de hoy

| Carril | De qué trata |
|---|---|
| Plataforma | El producto (onia-platform). Hoy apunta a cobrar y a la versión 1.0 para presentar al banco. |
| Ventas y pauta | Conseguir clientes y avisos pagados. |
| Marca personal | Incluye comunidad de WhatsApp, workshops, consultorías y carruseles. |
| Lucía / Higgsfield | La influencer IA y la generación de imagen y video. |
| QA y avisos | Mirar producción con capturas y avisar. |

Antes había rutinas de Claude por hora para cuatro carriles (Plataforma :17,
Marca :27, Lucía :47, QA :57). Ahora los carriles son hilos de la jefa.

### Cómo está armada la jefa hoy

| Dato | Valor |
|---|---|
| Dónde vive | claude.ai/code, sección Proyectos (beta), proyecto "ONIA · Hermes" |
| Quién coordina | Sonnet 5.5, esfuerzo medio; para decidir lo riesgoso llama a un subagente Opus |
| Quién trabaja en los hilos | Sonnet 5.5 |
| Repos que ve | onia-hermes y onia-platform |
| Entorno de nube | "Onia" |
| Su panel | Hilos en "Esperando tu respuesta", "En curso" y "Resuelto" |
| Cadena | Programa sola la vuelta siguiente. La tarea fija de cada hora NO está creada (decisión de Sergio Urcullo). |

----------------------------------------------------------------------

## 4. Cómo hablar con el sistema

| Si querés... | Hacé esto |
|---|---|
| Mandar un reel, una idea o un pedido | Escribile a la jefa. Ella elige el hilo. |
| Hablar con la jefa desde el celular o la PC | App de Claude, pestaña Code, Proyectos, "ONIA · Hermes". |
| Hablar con la jefa desde la terminal de la PC | `jefa "tu mensaje"` |
| Ver qué está pasando | Panel de la jefa (Esperando / En curso / Resuelto). |
| Ver cambios abiertos y publicados | Orca, pestaña "PANEL ONIA" (se actualiza cada 5 min). Solo con la PC prendida. |
| Hablar con la jefa desde Orca | Orca, pestaña "HABLAR CON LA JEFA". |
| Recibir avisos y dar OK | Telegram. |
| Dejar una orden que valga siempre | Se escribe en el archivo de órdenes de la jefa (abajo). |

Regla corta: pedidos y reels van a la jefa. Telegram es para recibir avisos y
dar OK. No se pide trabajo por Telegram.

### Para las sesiones de agentes

| Qué | Dónde / cómo |
|---|---|
| Órdenes escritas | `hermes-content/docs/cola/loop/hermes-jefa.md`. La jefa lo lee en cada vuelta. |
| Mensaje directo a la jefa | `claude -p "mensaje" --cloud cse_011cQSargj5qz516CNpPQEko --output-format json` |
| Lo mismo, con script | `scripts/hermes/jefa.sh` |
| Panel de Orca | `scripts/hermes/panel.sh` |
| Hojas de relevo | `hermes-content/docs/handoff/<carril>.md` |

Límite de hoy: abrir una sesión de la nube en vivo desde la terminal NO está
habilitado en la cuenta. Mandar mensajes sí.

----------------------------------------------------------------------

## 5. Un trabajo de punta a punta

Ejemplo: Sergio Urcullo manda un reel y dice "implementá esta idea".

| Paso | Quién | Qué pasa |
|---|---|---|
| 1 | Sergio Urcullo | Le manda el reel y el pedido a la jefa. |
| 2 | Jefa | Lo lee y lo deriva al hilo que corresponde (por ejemplo Marca personal, o Plataforma si cambia el producto). |
| 3 | Hilo | Parte el trabajo. Si algo es dudoso o riesgoso (seguridad, plata, migraciones), llama a un subagente Opus. |
| 4 | Subagentes | Sonnet construye. Haiku lee, cuenta y verifica. Un solo escritor por grupo de archivos. |
| 5 | Hilo | Propone el cambio en GitHub como borrador. Cuando termina, lo pasa a "listo". |
| 6 | Codex | Revisa el cambio. Si no aparece la revisión, se pide con el comentario `@codex review`. |
| 7 | Pruebas | Las pruebas automáticas deben estar en verde. |
| 8 | Jefa | Con pruebas en verde y revisión de Codex, une el cambio. |
| 9 | Servidor | Si es del producto, lo publica en el próximo turno (cada 3 horas, minuto :50). |
| 10 | QA | Mira producción con capturas y cuentas de prueba. |
| 11 | Hilo | Anota lo aprendido en el manual del carril, en el mismo cambio. |
| 12 | Telegram | Avisa en el resumen o el cierre. El hilo queda en "Resuelto". |

Si en el medio aparece algo de la sección 7, la jefa deja el hilo en
"Esperando tu respuesta" y NO sigue hasta que Sergio Urcullo conteste.

Cuando un hilo se llena, deja su hoja de relevo en
`hermes-content/docs/handoff/<carril>.md` y la jefa abre uno nuevo.

----------------------------------------------------------------------

## 6. Modelos y cupo

### Quién usa qué modelo

| Modelo | Para qué |
|---|---|
| Opus | Decidir lo dudoso y lo riesgoso: seguridad, plata, migraciones. |
| Sonnet | Construir. |
| Haiku | Leer, contar, verificar. |

Reglas: cada subagente lleva modelo explícito. Muchos agentes solo para
leer, auditar o revisar; para escribir, uno solo por grupo de archivos.

### Cupo de Codex

| Dato | Valor |
|---|---|
| Plan | 100 USD por mes |
| Uso al 16 de octubre | 72 % del cupo semanal |
| Dónde está prendida la revisión automática | onia-hermes y onia-platform (chatgpt.com/settings/code-review) |
| Qué no revisa | Borradores. Por eso el hilo pasa su cambio a "listo" al terminar. |
| Si no revisa solo | Comentario `@codex review` en el cambio. |
| Si se acaba el cupo | Revisa un agente Sonnet. |

Se usa Codex hasta gastar el cupo de la semana.

----------------------------------------------------------------------

## 7. Qué necesita a Sergio Urcullo

### Siempre le pregunta antes

| Tema | Ejemplo |
|---|---|
| Gasto | Generaciones pagadas, pauta, compras. |
| Textos legales | Términos, privacidad, contratos. |
| Diseño nuevo | Una pantalla o sección que no existía. |
| Contactar clientes o terceros | Mensajes, correos, llamadas. |
| Precios | Cualquier cifra de venta. |
| Datos de producción | Escribir o cambiar datos reales. |
| Portal de impuestos (SIAT) | Lo abre solo Sergio Urcullo, a mano. |

### Nunca está en la nube (lo hace Sergio Urcullo)

| Qué | Por qué importa |
|---|---|
| SIAT (portal de impuestos) | Lo abre solo él. |
| BCP Credinet (banco) | Es dinero. |
| Bóveda de claves KeePassXC | Vive solo en su laptop. |
| Cookies de la PC | Son sesiones personales. |
| Login de Google | Lo hace él. |
| Códigos de verificación | Los hace él. |

### Cuentas que SÍ llegan a la nube

Por los conectores oficiales de claude.ai: Higgsfield, Meta Ads, Gmail,
Drive, Calendar, Notion, n8n, Vercel, Figma, Gamma.

Cuidado: Higgsfield y Meta Ads, dentro de rutinas automáticas, pueden gastar
sin preguntar. Hay que sacarlos de las rutinas. Usarlos solo en hilos donde
la jefa pida el OK antes de gastar.

----------------------------------------------------------------------

## 8. Si algo se rompe

| Qué pasa | Cómo se nota | Qué hacer |
|---|---|---|
| Se corta la cadena de la jefa | Los hilos dejan de moverse y el panel no cambia. | Crear la tarea fija en "Tareas programadas" del proyecto. Hoy no existe (decisión de Sergio Urcullo), se crea solo si la cadena falla. Mientras, escribirle a la jefa con `jefa "seguí"`. |
| Una rutina vieja sigue prendida | Aparece una rutina por hora de un carril que ya es hilo. | Apagarla. Los carriles son hilos de la jefa. |
| Una rutina gasta sin preguntar | Higgsfield o Meta Ads dentro de una rutina automática. | Sacar esos conectores de la rutina. |
| Codex no responde | El cambio queda sin revisión. | Comentar `@codex review`. Si sigue sin responder o no hay cupo, revisa un agente Sonnet. |
| Gmail desconectado | Los avisos por correo dejan de llegar. | Reconectar el conector de Gmail en claude.ai. Hace falta el login de Google de Sergio Urcullo. |
| Telegram no avisa | No llega el resumen de 06:30 o el cierre de 21:30. | Revisar Hermes Agent en el servidor. Desde la sesión de control, no desde la nube. |
| La PC está apagada | Orca no muestra nada. | Es normal. Mirar el panel de la jefa en la app de Claude. La jefa sigue trabajando. |
| Un hilo se llenó | Respuestas lentas o confusas. | La jefa lo cierra, deja la hoja de relevo y abre uno nuevo. |
| Hace falta algo de la PC | Chrome, un panel con login. | Lo hace la sesión de control. |

El pedido por Telegram ("Pedidos a Claude") está apagado. Para prenderlo falta
crear la rutina con disparo por API y guardar su llave. Hasta entonces, los
pedidos van a la jefa.

----------------------------------------------------------------------

## 9. Qué NO hacemos

| Descartado | Por qué (una línea) |
|---|---|
| Harness propio de Codex | 20.000 líneas en 5 días y quedó bloqueado: OpenAI no da una vía oficial para mandarle tareas a Codex en la nube. |
| Hermes Agent como jefe | Usa un modelo barato que ya inventó cosas, y usar tu suscripción de Claude desde otro programa está prohibido; queda como teléfono. |
| Warp Oz | Cobra API, máquinas y plataforma; no acepta tu suscripción. |
| dots (OpenAI) | Solo maneja Codex, no tiene API y pide ser mayor de 18. |
| Grok Bot (xAI) | De pago, solo modelos de xAI, y habría que darle tus claves a un tercero. |
| Muse (Meta) | Corre en tu PC y reemplaza a Claude y Codex en vez de coordinarlos. |

Si algo de esta lista vuelve a proponerse, primero se le pregunta a Sergio Urcullo.
