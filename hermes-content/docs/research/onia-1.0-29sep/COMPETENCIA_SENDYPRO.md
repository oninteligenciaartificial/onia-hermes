# SendyPro por dentro: qué hace, cuánto cuesta y qué ideas le sirven a Onia

Para Sergio Urcullo · 29-sep-2026, de 21:50 a 23:15 (La Paz) · Recorrido hecho con la sesión que dejaste abierta en tu Chrome (cuenta de Arthur Teles, número NUVO conectado por la API oficial).

**Cómo se hizo:** solo mirando. No abrí Super Chat ni ninguna conversación, lista de contactos, compradores ni difusión con destinatarios. No escribí en ningún chat de IA, no creé ni guardé nada, no toqué conexiones, pagos ni planes. Los modales se abrieron para ver sus opciones y se cerraron con «Cancelar» o «Cerrar». Las guías y tutoriales no se usaron como fuente.

**Complementa** `COMPETENCIA_BOTS_WHATSAPP.md` (el estudio público, desde afuera). Este mira lo que solo se ve con cuenta. Donde los dos dicen lo mismo, no lo repito.

**Marcas:** [V] visto en pantalla hoy · [O] dato de Onia sacado de `INVENTARIO_POR_RUBRO.md` o de `lib/pricing.ts` · ? no verificado.

> **Advertencia de Sergio Urcullo, textual:** «si ves algo en esa plataforma no significa que sea mejor que la nuestra ni que haya que copiarlo; son ideas, estamos analizando cómo trabajan». La sección 5 está escrita así: cada idea con el problema que resolvería, la regla de Onia con la que choca y lo que cuesta.

---

## 1. Veredicto en 8 líneas

1. **SendyPro por dentro es una máquina de embudos de venta por WhatsApp para infoproductos y tiendas contraentrega** (Perú y Bolivia). No es un sistema de gestión: no tiene agenda, fichas, cuotas ni caja. Por eso no compite con Onia en la clínica; compite por el mismo presupuesto de «bot de WhatsApp».
2. **Su «Vendedor IA» no es una IA suelta: es un flujo de nodos donde algunos nodos son agentes IA**, cada uno con su propio prompt y sus «caminos de ruteo». La IA elige el camino y el flujo manda los mensajes armados. Es un híbrido guion + IA, más parecido al motor de Onia de lo que dice su publicidad.
3. **Lo más fuerte que tiene: la IA lee el comprobante de pago** (monto, moneda, titular, fecha, un texto fijo de la cuenta) y **rechaza un número de operación ya usado**. Con eso entrega el producto y le avisa al dueño. Es el mismo trabajo que hoy hacés vos a mano con los comprobantes del checkout de Onia [O: 3.9].
4. **Otras cosas bien resueltas:** editar el agente conversando con botones de ideas rápidas; «Vista cliente», que muestra el recorrido como lo ve el comprador; un mapa de avance por etapa con el porcentaje que pasa; y la medición de anuncios Click-to-WhatsApp (identificador del clic + envío de la compra a Meta) con ROAS.
5. **Lo flojo:** dos interfaces conviviendo (la clásica y «Sendy 3.0 Beta») con pantallas duplicadas, carteles «PRONTO», textos internos de desarrollo a la vista del cliente, videos que no cargan, saltos de pantalla al cargar, luces de Navidad en septiembre y una cinta de noticias. Se nota construido rápido y por capas.
6. **Lo riesgoso:** conexión por QR con un nodo «AntiBaneo» y consejos para que no te bloqueen; modelos de IA etiquetados «Sin ética, para blacks»; SendyPay, que cobra en cuentas de terceros por país y te liquida en USDT por Binance con 10 % de comisión; y una lista negra de números compartida entre todos los negocios.
7. **Precio de hoy, visto adentro:** US$19 (1 línea QR + 1 API, 150 chats con IA por día) y después US$39 por cada paquete de líneas, con IA sin tope, en 21 niveles. Se paga por Hotmart o por Yape/transferencia subiendo la captura. Contra los Bs 390 + Meta del agente de Onia, sale más barato por línea, pero no trae ningún sistema detrás.
8. **Para Onia es un catálogo de ideas, no un modelo a seguir.** Las que vale la pena evaluar se apoyan en lo que Onia ya tiene (comprobante → Cobros, anuncio → cita → cobro, vista cliente, armar el agente conversando). Copiar su cultura (QR, urgencia falsa, envíos masivos) choca con las reglas de Onia.

---

## 2. Mapa completo

### 2.0 El marco: dos aplicaciones en una
- **Interfaz clásica** (`/clasica`, menú lateral) y **«SENDY 3.0 - BETA»** (`/home`, barra de arriba). Casi todo existe dos veces con otro nombre: Kanban = «Mi tablero», Dashboard IA = «Analista», Integraciones = «Conexiones», Herramientas IA = «Diseñador». [V]
- **Barra de arriba (3.0):** liga «TOP #465 · ORO», SendyDrop, SendyPay, Vendedor, Marketero, Analista, Diseñador, Modo claro, Conexiones, Usuarios, Tutoriales, Super Chat, Mi plan (su flecha solo tiene «Cerrar sesión»). [V]
- **Barra de abajo:** «Todo funcionando», fecha y hora, un tipo de cambio que rota entre soles, bolivianos y bolívares (USD 1 = S/3,44 / Bs 12,0 / Bs.S 961), una cinta de noticias de marketing, «Vence en 14 días · 13/10/2026» y una campana. [V]
- **Botón flotante «SOPORTE IA PRO MAX 5G» / «Hablar con Sendy»:** tapa contenido; en una pantalla apareció solo el globo «Si tienes problemas cuéntamelo y te ayudo rápido». [V]
- **Versión:** 8.0.1. Decoración navideña (luces en el borde, gorro en el logo) y «Bono navideño» en septiembre. [V]

### 2.1 Inicio clásico (`/clasica`)
| Bloque | Qué tiene | Qué hace |
|---|---|---|
| Tu progreso (100 %) | 3 «pasos esenciales»: Conectá tu WhatsApp, Creá tu primer producto, Armá tu robot de ventas | Lista de arranque con tilde verde |
| Mis robots | «+ Nuevo»; por robot: Desactivar, Ver en editor, Duplicar, Eliminar | Los flujos activos |
| Mejorá tu negocio | Invitar asesoras, Crear etiqueta, Plantilla de respuesta, Horarios de atención, Activar Agente IA, Ver métricas | Atajos a cada pantalla |
| Caja «Describí tu negocio y creamos la automatización» | Texto + enviar | Arma un flujo con IA (no lo usé) |
| Videos tutoriales | 9 módulos | El video no cargó («No se pudo cargar el video») |
| Consejos | Modal | Límites para no ser bloqueado: «No recibir más de 100 conversaciones al día» en cuentas nuevas, 200 en medio antiguas, 300 en antiguas |
| Plantillas | 3 flujos para descargar | «InfoProductos con Botones API», «INFOPRODUCTOS», «ECOMMERCE COD» (Perú) |
| Recursos | Modal | Un enlace de Google Drive con cursos de Canva, CapCut y TikTok |
| Grupo WhatsApp / Soporte | Enlaces | Comunidad y soporte a un número de Perú |

### 2.2 Inicio 3.0 (`/home`): «Panorama de tu negocio»
Ingreso total confirmado, monedas, pagos, clientes, compras extra, recompra (nuevos contra antiguos), ingreso por comprador, compradores que repiten, variación contra el período anterior, «mejor conversión por flujo». Un globo terráqueo animado en el centro. Accesos: Soporte, Comunidad, Notificaciones, Consejos, selector de período. [V] Todo vacío en esta cuenta hoy.

### 2.3 Vendedor (`/home/vendedor`): el corazón
Submenú: Mis embudos · Mi tablero · Área de miembros · Difusiones · Plantillas API · Lista Negra Global · Grupos de WhatsApp.

**Mis embudos** [V]
- Arriba: **Bienvenida** (elige un flujo para el contacto nuevo que no coincide con ninguna frase, por conexión), **Importar**, **Crear vendedor con IA**, **Crear manualmente**, **Prediseñados** («Excelente para empezar»).
- Aviso rojo **«Activadores sin vendedor: siguen escuchando mensajes aunque su embudo fue eliminado. Elimínalos para evitar cruces.»** Un resto de datos que el sistema le pasa al usuario para que lo limpie.
- Filtros: estado (atendiendo / en descanso), categoría o carpeta, WhatsApp; agrupar y ordenar.
- Tarjeta de cada vendedor: frase que lo activa, estado, y seis botones: **Entrenar, Analizar, Pruebas A/B, SendyPay, Activadores, Más opciones** (Cambiar sus datos, Ver estructura, Duplicar, Exportar «el guion encriptado», Desactivar).

**Crear vendedor con IA** (modal) [V]: un chat que pregunta 3 cosas: qué vendés, cuánto cuesta y cómo cobrás, a quién le vendés; admite fotos o videos del producto. Promete preparar «tu guion completo, respuestas de envío, frase activadora, tus archivos ubicados». Botón final «Crear flujo».

**Prediseñados** [V]: solo dos: «E-commerce Perú · Lima + Provincias» e «Infoproducto 100K + Upsell». Se completa una ficha.

**Entrenar** («Entrena a Vendedor IA», modal) [V]
- Izquierda, **«Enséñale conversando»:** «Dile qué debe aprender»; ideas rápidas: Enseñarle una respuesta nueva, Agregar un método de pago, Cambiar un precio, Que recuerde a quien no responde, Cambiar cómo saluda. Se pueden **adjuntar fotos, audios y documentos**. Botón «Guardar lo aprendido».
- Derecha, **«Guion actual»** con dos vistas: **Pasos** (cada paso en lenguaje de dueño: «Saluda y presenta el producto», «Le pregunta cómo quiere pagar», «Espera y revisa el comprobante», «Avisa al dueño de la venta», «Le entrega el acceso», «Ofrece un producto adicional», «Si no responde, le insiste 3 veces: 20 min, 1,7 h, 3 h») y **Vista cliente** («Así le llega al cliente»: la conversación como burbujas de WhatsApp). Enlace «Detalle técnico» al editor.

**Editor técnico** (`/home/flujo/:id`) [V]
- Lienzo de nodos con minimapa, zoom y «No te olvides de guardar tu flujo». Botones «Actualizar contexto IA» y «Guardar flujo».
- **Agregar nodo:** Básicos (Inicio, Contenido, Menú, Mensaje con botones) · Automatización (**AntiBaneo**, Seguimiento, Espera, Etiqueta, Activar flujo, Código de país, Dar acceso, Acceso Drive, Notificación, **Agente IA**) · Integraciones (Google Sheets, Mensajes API, OrderyPro, Agencias).
- **Nodo Agente IA** (abierto y cancelado): prompt propio de hasta 10.000 caracteres («Solo aplican a este nodo»); **biblioteca de media compartida** entre todos los nodos IA (archivos con un nombre descriptivo para que la IA sepa cuándo mandarlos); **caminos de ruteo** («La IA decidirá por cuál opción continuar»). Cada camino valida **Texto, Pago o Imagen**. Para Pago: monto (solo para métricas), moneda, titular «como aparece en el comprobante», y validaciones opcionales: **identificador** (texto que siempre aparece en un comprobante real de esa cuenta), **exigir pago confirmado** («rechaza capturas antes de pagar»), **exigir fecha** y **bloquear comprobantes reutilizados** («rechaza un número de operación usado antes en esta cuenta»).
- Al salir, el navegador avisa «cambios sin guardar» aunque no se haya tocado nada (el aviso está siempre).

**Analizar** («Recorrido del cliente», `/analizar/:id`) [V]: clientes en el recorrido, cantidad de agentes del vendedor, «mejor paso entre agentes» y un **mapa de avance**: Clientes recibidos → primer agente → rutas (QR o transferencia) → etapa 2 (comprobante) → etapa 3 (upsell) → fin. Cada ruta con su porcentaje y color (verde ≥ 70 %, amarillo ≥ 40 %, rojo < 40 %). Filtros Hoy / 7 / 30 días / rango.

**Pruebas A/B** («Laboratorio de ventas», `/pruebas-ab/:id`) [V]: variantes con porcentaje de reparto, encender/apagar, editar, exportar e importar variantes, «Analizar resultados», historial de repartos. Reglas: cada cliente se queda en la variante que le tocó; cambiar porcentajes solo afecta a clientes nuevos.

**Cambiar datos del embudo** [V]: nombre, **«Frases o IDs de anuncios que activan al vendedor»** (separadas por coma, hasta 200 caracteres cada una; el ID del anuncio coincide aunque cambie el mensaje), categoría, canales de atención (qué número), «Repetible» (una vez por contacto o siempre).

**Mi tablero** (`/embudo-hub`) [V]: kanban de conversaciones por estado; la pestaña **Estados de cliente** define las columnas con etiquetas (interesado, compró, posventa). Filtro por fecha y conexión.

**Área de miembros** [V]: un portal de alumnos tipo Hotmart. Diseño (logo, título, enlace, colores, WhatsApp de soporte), «Mostrar productos bloqueados» para vender más, «Portal publicado», productos y contenido, alumnos y accesos, vista previa.

**Difusiones** [V]: pestañas Difusiones (en progreso, programadas, finalizadas, pendientes, canceladas), Listas de contactos y **Configuración de intervalos**: espera de 20 s entre mensajes, pausa cada 20 mensajes, pausa de 1 minuto. Es la receta para que un número por QR no caiga.

**Plantillas Cloud** [V]: total, aprobadas, pendientes, rechazadas; «Facturación de Meta» (abre el administrador de pagos de Meta en otra pestaña), «Sincronizar», «Nueva plantilla».

**Lista Negra Global** [V]: «red de protección»; hoy muestra **20.301 números reportados** por toda la comunidad, protección apagada en esta cuenta, números enmascarados, «Exportar para Meta Ads». Funciona así: una tienda bloquea a un cliente «problemático (por ejemplo, pagos falsos)» y el número entra a la lista de todos.

**Grupos de WhatsApp** [V]: Mis grupos, Campañas, Contenidos, Automatizaciones, Estadísticas; «Nuevo grupo» y «Sincronizar». Los grupos solo andan por QR (lo confirma el estudio público).

### 2.4 Marketero (`/home/marketing`) [V]
- **Meta Ads:** un administrador de anuncios adentro de Sendy: campañas, conjuntos, anuncios; Crear, Duplicar, Editar, «Configurar A/B en Meta»; columnas propias **«ROAS Sendy»**, compras «con foto / sin foto» (con o sin comprobante), adicionales, costo por compra. Hoy: «La administración no está disponible en este momento».
- **Caza Winners** (`/radar`): «Top 500 Winners de mercados hispanos», productos de Latinoamérica y España agrupados por página de venta, ordenados por cantidad de anuncios, días activos y escala. Pestañas Ganadores, Mi Botín, Mercado, Tiendas. Es una herramienta de espionaje de anuncios.
- **Crear copy con IA** (`/generador-copy`): «Te escribo el anuncio en 10 segundos» para Meta, TikTok o Google; producto + descripción → 3 anuncios; historial.

### 2.5 Analista (`/home/analista`, igual a Dashboard IA → WhatsApp de la clásica) [V]
Pestañas Resumen, Origen y Meta, Conversión, Canales. Filtros: fecha, moneda (total en USD), flujos, conexiones, etiquetas; «Exportar ventas». Tarjetas: ventas totales, gasto en ads, ganancia, tasa de conversión, costo por compra, ROAS global; ventas por hora; **de dónde viene el dinero** (publicidad, orgánico, cliente recurrente, «Meta puede atribuir»); **del interés a la compra** (desde anuncios → con interés → calificados → con venta); rendimiento por flujo. Botón «Analista IA · Pregúntame por tus métricas» (no lo usé).

### 2.6 Diseñador (`/home/sendy`, igual a Herramientas IA de la clásica) [V]
Créditos para PDF e imágenes (0, «Agregar créditos»); 15 imágenes incluidas por mes. **Fábrica de infoproductos**: la IA escribe e ilustra un PDF (1 gratis por mes de 15 páginas; de 10 a 50 páginas con créditos). Además: anuncio con IA, landing, producto en uso, foto de catálogo, portada de curso, miniatura de video, logo. **«Locutor» y «Transcriptor» con cartel «PRONTO».**

### 2.7 Conexiones (`/home/conexiones`; clásica `/connections` y `/queue-integration`) [V]
- «Bono navideño»: 1 WhatsApp Business por QR gratis. «Cambiar modo Salud» (no lo toqué). La línea NUVO: «Meta Cloud API · Conectado · WABA aprobado», «Moneda automática por comprobante», «Chats automatizados hoy 0/150», «Administrar API Oficial». «Agregar WhatsApp».
- Canales: Facebook/Messenger y Instagram (mensajes privados y comentarios), Meta Ads. Integraciones: Google Sheets, Gmail (responder correos desde Super Chat), Google Drive (entrega archivos al confirmar el pago), Shopify, **Meta CAPI Business** («atribuir compras CTWA por página»), **Meta CAPI Cloud** («rastreo oficial Click to WhatsApp»), OrderyPro, Zentro.
- **IA incluida (gratis):** «OpenAI GPT-6 Luna · Inteligencia muy alta · Puede contradecir blacks» y «Gemini 2.5 Flash-Lite · Inteligencia media · **Sin ética, para blacks**». Con clave propia: OpenAI, Anthropic Claude (Haiku, Sonnet, Opus, Fable), Google Gemini.
- **Medición de anuncios** por número: «compras generadas por la inversión de hoy»; con clic pagado identificable (ctwa_clid); aceptados (llegaron y pagaron hoy); captados antes y pagaron hoy; sin referencia publicitaria; aviso «Falta Dataset».

### 2.8 Usuarios (`/home/usuarios` y `/users`) [V]
«Tu equipo: quién entra, qué puede ver y a quién le tocan los leads». Directorio y **Desempeño** (conversaciones de anuncios, compras y ventas por agente; «puede tardar unos minutos»). **Roles:** Administrador (todo), **Supervisor** («ve todos los chats para supervisar o cobrar segundos abonos, sin cambiar quién tiene asignado cada chat»), Agente (sus chats y sus colas). **Reparto de leads por porcentaje** («si Ana tiene 60 % y Luis 40 %, de cada 10 leads 6 van a Ana»), con regla por producto. Alta de usuario: nombre, correo, **contraseña inicial que pone el administrador, mínimo 5 caracteres**, rol y qué conexiones ve en Super Chat.

### 2.9 Mi plan (`/home/plan`): ver sección 3.

### 2.10 SendyPay (`/sendypay` y el botón de cada vendedor) [V]
- Menú: Resumen, Mis ventas, Observaciones, Mis abonos, Mi cuenta (cuentas locales y Binance). Sello «Operación real y auditada».
- Cómo funciona: **«Tus clientes pagan a las cuentas oficiales»** de SendyPay en 7 países (Argentina, Bolivia, Colombia, Ecuador, México, Panamá, Venezuela). Los comprobantes van a revisión; lo aprobado se abona **en USDT a tu Binance**, con **comisión de 10 %**. Para activarlo te obliga a **quitar tus propias cuentas** de los mensajes del vendedor y pegar el mensaje oficial (con banco y titular de una persona). Separa pagos «observados» de lo liquidable.

### 2.11 SendyDrop (`sendydrop.com/app`) [V]
Otro producto, «Comercio + logística», para contraentrega en Lima: panel «Así va tu tienda», Crear envío, «Excel con IA», centro de envíos (reparto local, provincias), gestión de ventas (Shopify, WhatsApp, manual, carritos por recuperar, formularios de captación), catálogo y stock, **caja y resultados** (cobros, costos, canales de pago, depósitos), **equipo y pagos** (reglas de comisión por entrega, bonos, turnos, cierres), rendimiento (por vendedor, producto, zona, courier), **campañas con ROAS vendido, entregado y cobrado**, conexiones.
- **Textos internos a la vista:** en Plan dice «No se han inventado precios, límites ni cargos»; en Conexiones muestra los endpoints de su API y «La sincronización externa aún debe implementarse en SendyPro». Es una obra en curso mostrada al cliente.

### 2.12 Liga y avisos [V]
- **Liga mensual** (clic en «TOP #465»): liga Oro, puesto en el ranking de todos los usuarios según lo **facturado en el mes**, y cuánto falta para subir un puesto. Se actualiza solo.
- **Notificaciones = Novedades:** «Todo al día · Sistema operativo».
- **Tutoriales 3.0** (no usados como fuente): curso «Aprende SendyPro 3.0» de 14 lecciones con avance.

### 2.13 Otras funciones de la clásica [V]
- **Agente IA viejo** (`/ai-agent`): «Responses API + Vector Store + Function Tools», apagado, tope 100 mensajes por día, modelo GPT-4o mini. Formulario: tipo de negocio (e-commerce, infoproductos, **servicios con citas**, restaurante, consultoría, otro), identidad y personalidad, objetivo (vender, **agendar citas**, calificar, soporte, informar), acción al cumplirlo (pasar a humano, resumen por correo, crear pedido, **agendar en calendario**), datos a pedir (nombre, teléfono, correo, distrito, dirección, DNI, empresa, cargo, presupuesto), instrucciones, horario, bienvenida, mensaje si no entiende, **pase a humano tras X intentos** con aviso a un WhatsApp. Parece la versión anterior al Vendedor IA.
- **Palabras clave** (`/keywords`): palabras que escribe **el operador** (no el cliente) y disparan acciones; ejemplo: escribir «parar» apaga el bot en ese chat, «bot» lo vuelve a prender. La ayuda también explica extraer datos de la conversación a Google Sheets con IA y enviar compras a Meta o TikTok.
- **Rastreador API** (`/ad-tracker`): anuncios que trajeron clientes por Click-to-WhatsApp; al abrir sincronizó solo «25 nuevos Ad IDs».
- **Productos** (`/products`): tarjetas; alta con nombre, tipo (físico o digital), precio, costo, descripción, estado, imagen.
- **Etiquetas** (`/tags`): nombre, cantidad de registros, editar, borrar.
- **Kanban** (`/kanban`): igual a «Mi tablero».
- **Grupos** (menú): 5 páginas (`/grupos`, `/comunidades-grupos`, `/campanas-grupos`, `/automatizaciones-grupos`, `/stats-grupos`).

### 2.14 Lo que no se abrió, a propósito
Super Chat y cualquier conversación; Compradores y Centro de conversaciones de SendyDrop; «Configurar este vendedor» de un prediseñado; Importar; «Cambiar modo Salud»; «Actualizar contexto IA»; el panel de Shopify en detalle; «Analista IA» y «Hablar con Sendy» (hay que escribir).

### 2.15 Lo que toqué sin querer (para que lo sepas)
- El engranaje de la barra clásica era **el cambio de modo claro/oscuro**: se pasó a claro y lo volví a oscuro en unos 5 segundos.
- Hice clic en «SENDY 3.0 - BETA» para ver la interfaz nueva; eso solo cambia de pantalla, pero es posible que la próxima vez abra en `/home` en lugar de `/clasica` (?).
- «Facturación de Meta» abrió solo una pestaña del administrador de pagos de Meta; la cerré sin leerla.
- La pestaña quedó donde estaba: `app.sendypro.com/difusiones`, modo oscuro.

---

## 3. Planes y precios de hoy (pantalla `Mi plan`, 29-sep-2026) [V]

Bs a **11,37 por USD**, el tipo de referencia de Onia (`lib/pricing.ts`); la barra de SendyPro mostraba Bs 12,0.

| Nivel | USD / mes | Soles | ≈ Bs | Líneas | IA |
|---|---|---|---|---|---|
| 0 (el de esta cuenta) | 19 | 65 | 216 | 1 WhatsApp por QR + 1 API oficial | **150 chats con IA por día** |
| 1 | 39 | 130 | 443 | 1 QR + 1 API + 1 API «de calentamiento» | Sin tope |
| 2 | 78 | 260 | 887 | 2 + 2 + 2 | Sin tope |
| 3 | 117 | 390 | 1.330 | 3 + 3 + 3 | Sin tope |
| N (hasta 20) | 39 × N | 130 × N | 443 × N | N + N + N | Sin tope |

- **21 niveles**, todos con lo mismo; lo único que sube es la cantidad de líneas. «Sin marca amarilla, los chats con IA son ilimitados» (la marca amarilla es el tope de 150 del nivel 0).
- En el nivel 0 la pantalla dice **30 usuarios** y «2 cupo total» (las dos líneas). La línea QR: «sin límite de chats». La API de calentamiento: «topada a 50 chats por día para madurar números nuevos».
- Funciones activas en todos: campañas masivas, horarios, chat interno, API externa, embudo/kanban, integraciones, IA.
- **Cómo se paga:** por **Hotmart**, que renueva solo cada ciclo, o **a mano**: elegir plan y meses, pagar por **Yape o transferencia**, subir la foto y esperar la validación. Es el mismo esquema manual que usa Onia hoy [O: 3.9].
- **Extras aparte:** créditos del Diseñador (precio no visible, ?); SendyPay 10 % de lo cobrado; los mensajes de Meta de la API oficial los paga el dueño de la línea y la pantalla no lo explica (solo un aviso en la cinta sobre el 1-oct).

**Onia, para comparar** [O]: agente conversacional **Bs 390/mes** o Bs 3.900/año, sin cargo inicial, **500 conversaciones al mes**, recarga de 200 por Bs 190 que vale hasta fin de mes; incluido sin costo en los planes Completo y Empresa; los mensajes los cobra Meta directo al cliente, y la venta lo dice.

---

## 4. SendyPro contra el agente conversacional de Onia

| Función | SendyPro [V] | Onia [O] | Lectura |
|---|---|---|---|
| **Conexión** | API oficial por el alta de Meta + WhatsApp por QR (no oficial) en todos los planes; «API de calentamiento»; nodo AntiBaneo; consejos para no ser bloqueado | Solo API oficial por el alta de Meta. **Nunca se conectó el número real de un cliente** (3.8) | Onia elige bien; le falta probarlo con un número real |
| **IA que responde** | Nodos «Agente IA» con prompt propio; la IA decide el camino y puede contestar libre. Modelos incluidos sin costo, o clave propia | Responde **por guion, sin IA**; lo que no entiende lo pasa a una persona. IA (gpt-4.1-mini) solo para editar el agente y describir fotos (sección 6) | SendyPro contesta preguntas raras; Onia no inventa. Brecha en la demo |
| **Editar el agente** | «Enséñale conversando» + ideas rápidas + adjuntar fotos, audios y documentos; guion en pasos legibles | «Enseñale conversando» con IA (propone, aplicar, descartar) + formulario de 3 pestañas + «Responder 6 preguntas» | Parecidos. SendyPro suma adjuntos y el guion visible en pasos |
| **Probar antes de publicar** | «Vista cliente»: el recorrido dibujado como chat | «Probá tu agente»: le escribís y contesta con el borrador | Los dos lo tienen; SendyPro lo muestra sin tener que escribir |
| **Crear desde cero** | Chat de 3 preguntas → flujo armado; 2 prediseñados (tienda Perú, infoproducto) | Formulario de datos + «Responder 6 preguntas» (sin IA) | SendyPro arma el guion solo; Onia pide llenar campos |
| **Flujos visuales** | Editor de nodos completo (menú, botones, espera, etiqueta, Sheets, Drive, notificación) | No hay editor de flujos; el guion vive en el formulario | Para una clínica, el editor de nodos es más carga que ayuda |
| **Activar por anuncio** | «Frases o IDs de anuncios» por vendedor | Campo «campañas» (frase exacta → respuesta) **existe en el motor pero no en el formulario** (3.8) | Onia lo tiene a medias |
| **Seguimiento a quien no contesta** | Insiste hasta 3 veces con tiempos configurables | Interruptor «seguimiento» + horas en el formulario; `pricing.ts` prohíbe venderlo como «hace seguimiento» | ? Hay que ver qué hace de verdad el de Onia antes de prometerlo |
| **Envíos masivos** | Difusiones con intervalos, listas, grupos | No existe. Los agentes proponen mensajes uno a uno y el dueño aprueba (3.12, 3.13) | Distinto a propósito: Onia no es de envío masivo |
| **Bandeja y CRM** | Super Chat (no abierto), kanban por estados-etiqueta, etiquetas, colas | Conversaciones (`/inbox`): lista, responder (el bot se aparta), resolver, adjuntos (3.14). Sin kanban de conversaciones | SendyPro más completo en bandeja; Onia tiene la ficha del paciente detrás |
| **Agenda y citas** | No tiene. El agente viejo ofrecía «agendar en calendario» (apagado) | Agenda, reserva online y fichas completas; **el bot no agenda**, deriva (pricing.ts) | Onia tiene la mitad difícil hecha; falta unir bot y agenda |
| **Cobros** | IA valida comprobantes (monto, titular, fecha, reuso) y entrega; SendyPay intermedia | Cobros con recibo, cuotas, caja; el comprobante del **plan de Onia** se aprueba a mano; el bot no lee comprobantes | La mejor idea de SendyPro para Onia (sección 5, idea 1) |
| **Métricas** | Panorama de ingresos, Analista (origen del dinero, embudo, ROAS), mapa por agente, desempeño por asesor | «Cómo le va» (qué hizo el asistente en la semana); reportes del sistema | SendyPro mide ventas del chat; Onia podría medir citas y cobros reales |
| **Atribución de anuncios** | ctwa_clid + Meta CAPI + Rastreador de Ad IDs + ROAS | **No hay píxel ni CAPI**; no se guarda de qué anuncio viene cada alta (3.22) | Hueco de Onia para su propia campaña y para clientes que pautan |
| **Multiusuario** | Admin, Supervisor, Agente; reparto de leads por %; qué líneas ve cada uno; 30 usuarios en el nivel 0 | Roles por plan; permisos finos que **no alcanzan a Caja, Catálogo ni Fiados** (3.7); sin reparto de conversaciones | SendyPro más fino en atención; Onia tiene deudas de permisos |
| **Límites** | 150 chats IA por día (nivel 0) o sin tope; QR «sin límite» | 500 conversaciones al mes; recarga manual | SendyPro vende «ilimitado»; Onia es honesta con el tope |
| **Costo de Meta** | No lo explica en el plan; solo una noticia en la cinta | Lo dice en el precio y estima cuánto cuesta | Onia mejor |
| **Canales** | WhatsApp (API y QR), Facebook, Instagram, Gmail | WhatsApp y chat web; **Facebook e Instagram apagados** | SendyPro más canales |
| **Onboarding** | Registro sin tarjeta; lista de 3 pasos; curso de 14 lecciones; comunidad y soporte por WhatsApp | Prueba de 14 días **sin el agente**; activación manual tras aprobar el comprobante; agente a 4 clics fuera del menú (3.8) | SendyPro deja probar el bot; Onia no |
| **Precio** | Desde ≈ Bs 216 (con tope de IA) o ≈ Bs 443 | Bs 390 + Meta | Parecido; SendyPro no trae sistema |
| **Calidad de pantalla** | Llena, oscura, con luces y cinta de noticias; duplicada; textos internos visibles; «PRONTO» | Reglas de UI propias, sin carteles de obra (REGLAS_UI_ONIA_v2) | Onia más sobria, si se cumple |

---

## 5. Ideas para evaluar

Cada idea dice qué problema del cliente de Onia resolvería, con qué regla de Onia choca y cuánto cuesta. **Que SendyPro lo tenga no es razón para hacerlo.** El orden es por valor para un cliente de los 5 rubros contra esfuerzo. Etapa vigente: **1, producto único, 5 clientes** (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §7): lo que no ayude a esos 5 se anota y no se hace.

Esfuerzo: **S** = días · **M** = una o dos semanas · **L** = más.

| # | Idea | Problema del cliente de Onia que resolvería | Rubros | Choca con | Costo | Lectura |
|---|---|---|---|---|---|---|
| 1 | **Leer el comprobante que manda el cliente** (monto, titular, fecha, texto fijo de la cuenta, número de operación ya usado) y **proponer** registrar el cobro en Onia | La recepción revisa capturas de QR a mano para adelantos, cuotas y fiados; un comprobante reenviado pasa. Y es tu propio dolor: hoy apruebas a mano cada pago del plan | Todos | **Honestidad:** una lectura de imagen se equivoca; tiene que proponer en Pendientes, nunca aprobar solo. **Etapa:** sirve al núcleo y pasa las 3 preguntas | M (Onia ya describe fotos con gpt-4.1-mini; falta sacar campos, guardar números de operación y unirlo a Cobros) | La que más valor tiene. Probarla primero en el checkout de Onia |
| 2 | **Mostrar el campo «frase o ID del anuncio» en el formulario del agente** | La clínica que pauta «blanqueamiento» quiere que quien llega de ese anuncio reciba esa respuesta, no el saludo general | Todos los que pautan | Ninguna | S (el motor ya lo tiene, 3.8) | Barata; conviene antes de prender Meta Ads |
| 3 | **Guardar de qué anuncio viene cada conversación** (el identificador del clic que manda Meta) y contar «consulta → cita → atendido → cobrado» | El dueño paga Meta y no sabe qué anuncio le trae pacientes que pagan. Onia tiene la cita y el cobro; SendyPro solo tiene el chat | Dental, estética, servicios; comercio | **Etapa:** primero sirve a la campaña de Onia misma (3.22 ya lo pide). **Honestidad:** atribuir solo lo que tiene rastro; decir cuánto queda «sin referencia» | M (guardar el dato del webhook y cruzarlo); **L** si se manda de vuelta a Meta (CAPI) | Hacer primero para Onia; al cliente, cuando haya clientes que paguen anuncios |
| 4 | **Vista «así lo ve tu cliente»** junto al guion | El dueño no sabe qué contesta el bot y pregunta por WhatsApp; eso son horas de soporte | Todos | Ninguna | S | Baja el soporte, que es el techo del negocio (§9) |
| 5 | **Armar el agente conversando** (3 preguntas → borrador del guion que el dueño revisa) | Configurar el agente hoy es llenar campos; cada cliente te cuesta una llamada | Todos | **Honestidad:** el borrador se muestra y se aprueba, no se publica solo. **Multi-rubro:** las preguntas cambian por rubro | M | Útil para la etapa 2 («cada cliente cuesta menos que el anterior»); anotar |
| 6 | **Adjuntar el PDF de precios o fotos al «Enseñale conversando»** | La clínica tiene su lista de precios en un PDF o una foto y no quiere tipearla | Todos | **Honestidad:** lo que se extraiga se revisa antes de publicar | M | Anotar |
| 7 | **Avisarle al dueño en su celular** cuando el bot deriva o llega un comprobante | La derivación hoy queda en el panel y la campana no se actualiza sola (3.11) | Todos | Ninguna | S-M (Onia ya tiene notificaciones al teléfono) | Arreglar primero la campana; después el aviso |
| 8 | **Mapa del recorrido con el porcentaje que pasa en cada paso** | Saber dónde se pierden las consultas (pidió precio, no agendó) | Todos | **Etapa:** con 0 clientes no hay nada que medir; mostraría ceros | M | Anotar para cuando haya uso real |
| 9 | **Rol «Supervisor» y reparto de conversaciones por porcentaje** | Clínica de 2-6 profesionales con recepción: quién atiende qué chat | Dental, estética, servicios | **Etapa:** el cliente de 1 recepcionista no lo necesita. Antes hay que arreglar que los permisos alcancen a Caja (3.7) | M | Anotar; primero la deuda de permisos |
| 10 | **Lista de números bloqueados por negocio** (no compartida) | Comercio: quien mandó un comprobante falso vuelve a pedir fiado | Comercio, importadora | **Privacidad** si se comparte entre negocios (ver «no copiar») | S | Solo por negocio; baja prioridad |
| 11 | **Palabra para pausar o reanudar el bot en una conversación** | La recepcionista quiere que el bot no conteste a un paciente puntual | Todos | Ninguna; en Onia el bot ya se aparta cuando contestás desde Conversaciones (3.14) | S | Probablemente sobra; ver si alguien lo pide |
| 12 | **Pruebas A/B de guiones** | Mejorar cuántas consultas terminan en cita | Todos | **Velocidad y etapa:** con 20 consultas por semana no hay resultado confiable | M-L | No por ahora |
| 13 | **Difusiones** | «Campaña de limpieza semestral» a todos los pacientes | Dental, estética | **Honestidad y costo:** Meta cobra cada plantilla de marketing; cultura de spam. La versión Onia ya existe: agentes que proponen uno a uno y el dueño aprueba | L | No copiar el masivo; si se pide, que salga por Agentes con aprobación |

**Si hubiera que elegir tres para la 1.0.1:** 2 (es mostrar un campo que ya existe), 4 (baja soporte) y 1 probado primero en tu propio checkout. Las demás se anotan.

### Qué NO copiar (visto adentro, no supuesto)
| Qué | Evidencia | Por qué no |
|---|---|---|
| WhatsApp por QR, «calentamiento», nodo AntiBaneo, «Blindar cuentas» | Consejos de no pasar de 100 conversaciones por día; intervalos de 20 s en difusiones [V] | Los términos de WhatsApp lo prohíben; el cliente arriesga su número y Onia su nombre |
| Modelos «Sin ética, para blacks» | Conexiones → IA incluida [V] | Riesgo de marca y legal |
| SendyPay | Cuentas de terceros por país, 10 %, USDT a Binance, obliga a sacar tus cuentas [V] | Intermediar cobros sin licencia; en Bolivia los servicios de pago los regula ASFI (?) y liquidar en cripto espanta a una clínica |
| Lista negra **compartida** entre negocios | 20.301 números de toda la comunidad, exportables a Meta Ads [V] | Pasa datos personales de un negocio a otro sin consentimiento |
| Carteles «PRONTO» | Locutor y Transcriptor [V] | Regla de Onia: la venta nunca exhibe obra |
| Textos internos a la vista | SendyDrop: «No se han inventado precios», «aún debe implementarse» [V] | Hace creer que el sistema no funciona |
| Urgencia falsa en los guiones | El guion de ejemplo de la cuenta: «este mensaje se borra en 10 minutos», «último aviso» [V] | A un paciente eso le baja la confianza; choca con no fabricar |
| «Ilimitado» sin explicar Meta | Plan sin una línea sobre el costo de Meta [V] | Onia ya lo explica; es una ventaja, no hay que perderla |
| Dos interfaces a la vez, cinta de noticias, luces | Pantallas duplicadas, saltos al cargar [V] | Ruido; contra las reglas de UI de Onia |
| Contraseña inicial de 5 caracteres puesta por el admin | Alta de usuario [V] | Seguridad floja |
| Ranking de negocios por facturación | Liga Oro, puesto por lo facturado [V] | Una clínica no quiere que su facturación entre en una tabla con otras |

---

## 6. Nota de estrategia: los infoproductores

Lo que se ve en esta cuenta: productos digitales baratos (packs de planos, cuadernillos) cobrados en bolivianos por QR, con anuncios que llevan a WhatsApp, upsell en el mismo chat y entrega por el chat o por Drive. Es un negocio de volumen: muchos chats, ticket bajo, venta en minutos.

**Qué habría que tener para venderles** (solo el inventario, no una recomendación):
1. Leer y validar comprobantes y **entregar solo** el producto digital al aprobarse (Drive, enlace, área de alumnos).
2. Upsell y downsell dentro del mismo chat, con varios precios por producto.
3. Atribución por anuncio con ROAS sobre lo cobrado, y envío de la compra a Meta.
4. IA que conteste libre y venda (no por guion), con tope alto de chats.
5. Plantillas de embudo listas y comunidad para aprender a usarlas.
6. Precio en USD bajo (US$19 a 39) y cobro por Hotmart.
7. Envíos masivos y grupos, que en la práctica solo andan por QR.

**Con el test de las tres preguntas** (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §10): no es el mismo cliente que paga el núcleo (un infoproductor no usa agenda, fichas ni caja), no depende del núcleo, y para competir en precio empuja hacia el QR. **Falla las tres: sería una línea de negocio nueva**, y la etapa 1 dice que no se abre ninguna. Queda anotado; la decisión es tuya, Sergio Urcullo.

Lo que sí se puede llevar al núcleo sin cambiar de cliente son las ideas 1, 2 y 3 de la sección 5: le sirven a la clínica que cobra adelantos por QR y pauta en Meta.
