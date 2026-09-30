> **Foto de investigación del 2026-09-30 (carril Mercado, sesión «Análisis de mercado Onia Platform»).** No es fuente de verdad: lo vigente está en `ONIA_ADQUISICION_Y_PAUTA.md`, `ONIA_CLIENTE_IDEAL.md` y `ONIA_ESTRATEGIA_DE_EMPRESA.md` §14. Los avisos de este texto sobre "cambios sin commitear" en otros docs se refieren al árbol durante la sesión y ya quedaron resueltos en esos docs.

# Informe D: playbook de pauta en Meta para ONIA (estado al 30-sep-2026)

> Investigación de solo lectura. No se tocó el repo `onia-hermes` ni ninguna cuenta publicitaria.
> Para: sesión de control (carril Mercado / pauta). Cliente ideal según `hermes-content/docs/ONIA_CLIENTE_IDEAL.md`.

**Leyenda de marcas**

| Marca | Significa |
|---|---|
| [oficial Meta] | Texto del Centro de ayuda o de la documentación de Meta. Salvo que se indique 🔎, se leyó completo con la herramienta de ayuda del conector Meta Ads el 30-sep-2026 |
| [secundaria] | Blog, agencia o vendor |
| [inferencia] | Cálculo o juicio propio, con los supuestos a la vista |
| [repo] | Documento o código de `onia-hermes` |
| 🔎 | Solo se vio el resumen del buscador: el proxy bloqueó abrir la página. Confianza baja |
| ⏳ | Dato con más de 12 meses |

**Límites del método (leer antes de usar cualquier cifra)**
- El proxy de salida bloqueó abrir páginas externas: `developers.facebook.com`, `datareportal.com`, `jonloomer.com`, `lebesgue.io` y `superads.ai` devolvieron EGRESS_BLOCKED. Lo oficial de Meta se leyó con `ads_get_help_article`, que devuelve el texto del Centro de ayuda.
- El cupo de búsquedas web de la sesión se agotó (200/200) antes de cubrir tres temas: pagos con tarjeta boliviana en 2026, la tarifa de WhatsApp para Bolivia y benchmarks B2B bolivianos.
- No se consultó ninguna cuenta publicitaria. Según el handoff, el conector Meta Ads de la sesión está logueado en otra empresa (NUVO / Arthur Fuentes), así que no sirve para ONIA. Además, ONIA no tiene entrega, así que tampoco hay benchmarks propios que pedir.

---

## 0. La respuesta corta

1. **Canal:** anuncios de clic a WhatsApp (CTWA). Objetivo **Clientes potenciales**, ubicación de conversión **WhatsApp**, meta **"Maximizar el número de conversaciones"**. Un solo conjunto de anuncios. Advantage+ queda encendido, pero con estos **controles duros**:
   - Santa Cruz de la Sierra + radio
   - "Llegar a más personas…" **apagado**
   - Edad mínima 25
2. **Lo que filtra no es la segmentación: son la pieza y el bot.** En una sola ciudad, el cliente ideal es ~150-400 clínicas: ≲0,1% del público alcanzable [inferencia, §2.1]. Meta busca las conversaciones más baratas, y un anuncio que dice "clínica dental" atrae **pacientes**. La KPI es el **costo por conversación calificada**, nunca el costo por conversación.
3. **Presupuesto:**
   - **USD 5/día:** queda en "aprendizaje limitado" por diseño. Sirve para medir qué porcentaje de conversaciones califica.
   - **USD 10/día:** es el mínimo razonable para leer resultados.
   - **USD 20/día:** puede salir de aprendizaje si la conversación cuesta ≤ USD 2,8. La cuenta sale de la regla oficial de ~50 eventos por semana.
4. **Salud:** no es una categoría especial de anuncios. El riesgo real es que Meta **clasifique el dominio** como "Salud y bienestar" si el píxel o la CAPI se instalan en el producto (`app.onia.com.bo` guarda fichas y tratamientos). CTWA no depende del píxel, así que ese riesgo **no bloquea** la estructura recomendada.
5. **Antes de gastar hay precondiciones del repo** (§4.1):
   - cargar la tarjeta;
   - vincular la página;
   - conectar el WhatsApp a la página;
   - recuperar la atribución que Chatwoot descarta;
   - contestar a los leads orgánicos que ya esperan.

---

## 1. Cómo funciona hoy la pauta de Meta (cambios 2025-2026)

### 1.1 Estructura, público, aprendizaje

**Advantage+ por defecto**
- **Qué dice Meta hoy:** con Ventas, Promoción de app o Clientes potenciales aparece la configuración Advantage+. Meta aclara que "manual campaign features are all still available".
- **Qué significa para ONIA:** no hace falta pelearse con Advantage+. Hay que fijar bien los controles.
- **Fuente:** [oficial Meta] [About the Advantage+ campaign experience](https://www.facebook.com/business/help/1292656978738967)

**Campañas Advantage+ de clientes potenciales**
- **Qué dice Meta hoy:**
  - Presupuesto, público y ubicaciones vienen en Advantage+ por defecto.
  - Si fijás presupuesto por conjunto o elegís ubicaciones a mano, Advantage+ se apaga.
  - Mantiene todos los destinos: formulario, web, llamada y mensajes.
  - Prueba propia de Meta (nov-2024 a ene-2025, incluye B2B): **−14% de costo por lead y −10% de costo por lead calificado** frente a Advantage+ apagado.
- **Qué significa para ONIA:** con un solo conjunto no se pierde nada dejándolo encendido. Las cifras son del propio Meta, no independientes.
- **Fuente:** [oficial Meta] [About Advantage+ leads campaigns](https://www.facebook.com/business/help/992035952809423)

**Presupuesto de campaña (Advantage+ campaign budget)**
- **Qué dice Meta hoy:** viene encendido por defecto en Ventas, Clientes potenciales y App. Hay un mínimo de 2 h para encenderlo o apagarlo.
- **Qué significa para ONIA:** —
- **Fuente:** [oficial Meta] [Set up Advantage+ campaign budget](https://www.facebook.com/business/help/343242619559352)

**Público Advantage+**
- **Qué dice Meta hoy:**
  - **Controles (duros):** ubicación, edad mínima (no menor a 18), exclusión de públicos personalizados e idiomas.
  - **Sugerencias (blandas):** edad, género, segmentación detallada y públicos personalizados a incluir.
  - La opción **"limitar más"** vuelve duros algunos de esos campos, y entonces Advantage+ figura como "off".
  - No se pueden excluir públicos similares (lookalikes).
  - Salvedad: una página de Meta incluye la segmentación detallada entre lo que "limitar más" vuelve duro. Otra no la incluye, y Advantage+ detailed targeting puede ampliar igual.
- **Qué significa para ONIA:** no contar con que un interés restrinja quién ve el anuncio. Lo que sí restringe: ubicación y edad mínima.
- **Fuentes:** [oficial Meta] [audience controls vs suggestions](https://www.facebook.com/business/help/938372127764391) · [create a campaign using Advantage+ audience](https://www.facebook.com/business/help/793748385630490) · [choose audience settings in Advantage+ campaigns](https://www.facebook.com/business/help/25941857932125812) · [about Advantage+ detailed targeting](https://www.facebook.com/business/help/128066880933676)

**Controles de cuenta**
- **Qué dice Meta hoy:**
  - Se fijan a nivel cuenta: ubicaciones, edad mínima, exclusión "por protección de marca" (una lista acotada) y exclusión de un empleador (para no mostrar anuncios a los empleados propios).
  - También se pueden excluir ubicaciones de anuncio: Audience Network, Marketplace y columna derecha.
  - Se aplican a todas las campañas. El despliegue es gradual.
- **Qué significa para ONIA:** sirve para fijar edad mínima y ubicaciones una sola vez.
- **Fuente:** [oficial Meta] [Set audience and placement controls for your ad account](https://www.facebook.com/business/help/1438478636941047)

**Segmentación detallada**
- **Qué dice Meta hoy:**
  - Las **exclusiones por intereses/comportamientos se eliminaron** el 31-mar-2025 en Ads Manager y el 10-jun-2025 en publicaciones promocionadas.
  - Desde el 23-jun-2025 Meta **consolida intereses** en grupos más amplios.
  - Los conjuntos que seguían usando opciones retiradas **dejaron de entregar el 15-ene-2026**.
  - Según Meta, el costo mediano por conversión fue −22,6% sin exclusiones (15 pruebas, abr-jun 2024).
- **Qué significa para ONIA:** "Excluir pacientes o estudiantes" por intereses **ya no existe**. Solo se puede excluir con públicos personalizados.
- **Fuente:** [oficial Meta] [Updates to detailed targeting](https://www.facebook.com/business/help/458835214668072)

**Ubicación: "Llegar a más personas con probabilidad de responder"**
- **Qué dice Meta hoy:**
  - Al elegir una ciudad **puede venir marcado por defecto**. Suma gente que viaja a la ciudad, la busca, tiene amigos ahí o vive en localidades cercanas (siempre del mismo país).
  - Meta sugiere apagarlo si solo querés llegar a quien vive o está en el lugar.
  - La precisión "no está garantizada": pueden llegar mensajes o leads desde fuera de la zona.
- **Qué significa para ONIA:** **apagarlo.** Revisar el desglose por región la primera semana.
- **Fuentes:** [oficial Meta] [reach people interested in your cities](https://www.facebook.com/business/help/726389026372510) · [about location targeting](https://www.facebook.com/business/help/202297959811696) · [use location targeting](https://www.facebook.com/business/help/365561350785642)

**Fase de aprendizaje**
- **Qué dice Meta hoy:**
  - Un conjunto sale de aprendizaje "después de unos **50 resultados en la semana** posterior a la última edición significativa".
  - Queda en **"aprendizaje limitado"** cuando es improbable que llegue a esos ~50. Las causas típicas son público chico, presupuesto bajo, puja baja, mucha superposición entre conjuntos, un evento poco frecuente o demasiados anuncios.
- **Qué significa para ONIA:** con USD 5-10 por día, "aprendizaje limitado" es lo esperable (§4.3). **No es una penalización.**
- **Fuentes:** [oficial Meta] [About the learning phase](https://www.facebook.com/business/help/112167992830700) · [About learning limited](https://www.facebook.com/business/help/269269737396981)

**Ediciones significativas**
- **Qué dice Meta hoy:**
  - Reinician el aprendizaje: cambiar segmentación, creatividad o evento de optimización; **agregar un anuncio**; pausar 7 días o más; cambiar la estrategia de puja.
  - Un cambio de presupuesto reinicia o no según su tamaño: de $100 a $101 no, de $100 a $1.000 sí.
- **Qué significa para ONIA:** los creativos se prueban **por tandas**, nunca agregando anuncios de a uno.
- **Fuente:** [oficial Meta] [Significant edits and learning phase](https://www.facebook.com/business/help/316478108955072)

**Presupuesto mínimo razonable**
- **Qué dice Meta hoy:**
  - Regla general de Meta: **presupuesto diario de al menos 10 veces el costo medio del evento de optimización**.
  - Meta puede gastar **hasta +75% del presupuesto diario** en un día, pero nunca más de 7 veces el diario en una semana.
- **Qué significa para ONIA:** conviene poner un tope total (presupuesto total de la campaña o límite de gasto) para no llevarse sorpresas.
- **Fuentes:** [oficial Meta] [troubleshoot: not enough delivery](https://www.facebook.com/business/help/666335734044063) · [troubleshoot: ad set isn't running](https://www.facebook.com/business/help/164406965378460)

**Frecuencia**
- **Qué dice Meta hoy:** el tope de frecuencia y la frecuencia objetivo solo existen para metas de alcance, ThruPlay y algunas de reconocimiento o interacción. **No hay tope de frecuencia para clientes potenciales ni para conversaciones.**
- **Qué significa para ONIA:** la frecuencia se vigila a mano (§4.5).
- **Fuentes:** [oficial Meta] [About frequency controls for auction](https://www.facebook.com/business/help/422853447344162) · [frequency controls for reservation](https://www.facebook.com/business/help/1461336133922536)

**Cantidad de anuncios**
- **Qué dice Meta hoy:** "Evitá volúmenes altos de anuncios y conjuntos". Combinar conjuntos combina los aprendizajes.
- **Qué significa para ONIA:** 1 conjunto con 2-4 anuncios mientras el presupuesto sea chico.
- **Fuente:** [oficial Meta] [About the learning phase](https://www.facebook.com/business/help/112167992830700)

**Andromeda (motor de recuperación de anuncios)**
- **Qué dice Meta hoy:**
  - Nuevo motor de recuperación de anuncios, publicado en dic-2024 ⏳. Meta reporta +6% de recall y +8% de calidad de anuncios, y lo diseñó para manejar la explosión de creatividades.
  - Lectura práctica 2025-2026 [secundaria 🔎]: la creatividad hace de segmentación, y la diversidad real de piezas vale más que muchas variaciones de la misma.
- **Qué significa para ONIA:** la pieza tiene que decir **para quién es**. Eso es lo que hace de segmentación B2B.
- **Fuentes:** [oficial Meta ⏳] [Engineering at Meta, 2024-12-02](https://engineering.fb.com/2024/12/02/production-engineering/meta-andromeda-advantage-automation-next-gen-personalized-ads-retrieval-engine/) · [secundaria 🔎] [jonloomer.com](https://www.jonloomer.com/meta-andromeda-creative-diversification/) · [segwise.ai 2026](https://segwise.ai/blog/meta-andromeda-update-creative-strategy-2026)

### 1.2 WhatsApp como destino (anuncios de clic a WhatsApp, CTWA)

**Requisito**
- **Qué dice Meta:** el número de WhatsApp (app Business o API) tiene que estar **conectado a la página de Facebook o al portafolio del negocio**.
- **Fuente:** [oficial Meta] [Create ads that click to WhatsApp](https://www.facebook.com/business/help/447934475640650)

**Objetivos que admite**
- **Qué dice Meta:** Tráfico, Interacción, Clientes potenciales, Ventas y Reconocimiento. Con **Clientes potenciales**, la ubicación de conversión es WhatsApp y la meta viene fijada en **"Maximizar el número de conversaciones"**. Advantage+ puede aparecer encendido.
- **Fuente:** idem

**Plantilla de mensaje**
- **Qué dice Meta:** hay dos opciones.
  - **"Iniciar conversación":** un saludo más preguntas o mensajes sugeridos que la persona toca.
  - **"Recolectar info con un formulario en WhatsApp"** (WhatsApp Flows: citas, alta, datos de contacto). Puede no estar disponible todavía.
- **Fuente:** idem

**Varios destinos a la vez**
- **Qué dice Meta:** Messenger + Instagram Direct + WhatsApp con destino automático; para eso Meta recomienda el objetivo Interacción. Mejores prácticas: **correr la campaña 7 días o más**, dejar claro en la pieza que abre un chat y usar el botón "Enviar mensaje".
- **Fuentes:** [oficial Meta] [multiple message destinations](https://www.facebook.com/business/help/1192884166182156) · [best practices click-to-message](https://www.facebook.com/business/help/269324800441478)

**"Maximizar leads por mensajes"**
- **Qué dice Meta:**
  - Para WhatsApp exige **10 o más eventos de lead o compra compartidos con Meta en 30 días**. Se comparten con las etiquetas predefinidas de la app WhatsApp Business o con la CAPI para mensajería.
  - El chat tiene que **venir de un CTWA y quedar etiquetado como lead dentro de los 7 días** posteriores al clic.
  - Meta midió **−24% de costo por lead** frente a optimizar a conversaciones (nov-2024).
  - El despliegue es gradual.
- **Fuente:** [oficial Meta] [About maximizing number of leads using ads that click to message](https://www.facebook.com/business/help/575610661605746)

**Conversions API para mensajería (WhatsApp)**
- **Qué dice Meta:**
  - Requiere la **Cloud API**, el campo `ctwa_clid` (obligatorio, llega en el webhook del mensaje), los permisos `whatsapp_business_management` + `whatsapp_business_manage_events` y acceso estándar a Ads Management.
  - La alternativa es un partner. La lista incluye 360dialog, respond.io, Kommo, ManyChat, Wati, Botmaker, Zenvia, Gupshup, Infobip y HighLevel, entre otros. **Chatwoot no figura.**
- **Fuentes:** [oficial Meta] [CAPI for Business Messaging](https://developers.facebook.com/docs/marketing-api/conversions-api/business-messaging) · [partner integrations for business messaging](https://www.facebook.com/business/help/1050753706106190)

**Precio de WhatsApp**
- **Qué dice Meta:**
  - Se cobra **por mensaje desde el 1-jul-2025**.
  - **Punto de entrada gratis:** si la persona escribe desde un CTWA y la empresa responde dentro de 24 h, **ningún mensaje de la empresa se cobra durante 72 h**.
  - Hay además un anuncio de cambios en el cobro de mensajes de servicio para oct-2026, visto solo como título.
- **Fuentes:** [oficial Meta 🔎] [WhatsApp pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing) · [pricing updates July 2025](https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing/) · [non-template messages](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)

**Anuncios en Estados de WhatsApp**
- **Qué dice Meta:** los mensajes que se originan en anuncios de Estados **no traen el `ctwa_clid`**.
- **Fuente:** [oficial Meta 🔎] [WhatsApp changelog](https://developers.facebook.com/documentation/business-messaging/whatsapp/changelog)

**Hoy, en ONIA**
- **Qué dice el repo:** Chatwoot 4.12.1 **descarta** `messages[].referral` (`source_id`, `source_url`, `ctwa_clid`). Un lead de CTWA **entra sin origen**, y sin `ctwa_clid` tampoco se puede mandar la señal de CAPI.
- **Fuentes:** [repo] `hermes-content/deploy/vps-ops/bot/chatwoot-adapter.mjs` líneas 129-133 · `ONIA_ESTADO_CHATBOT_Y_VOZ_20260816.md` l.90

### 1.3 Formularios instantáneos

- **Tipos de formulario** [oficial Meta] ([About instant form types](https://www.facebook.com/business/help/252352181957512)):
  - **Más volumen:** el default.
  - **Mayor intención:** agrega una pantalla de revisión y un aviso de que la empresa puede hacer seguimiento. Solo se entrega en el feed de Facebook e Instagram en móvil.
  - **Creativo enriquecido.**
- **Herramientas para calificar** [oficial Meta] ([Create a lead ad with instant form](https://www.facebook.com/business/help/791294492679966)):
  - hasta **15 preguntas propias**: opción múltiple, respuesta corta, condicional y solicitud de cita;
  - lógica condicional;
  - **verificación por SMS obligatoria** para enviar el formulario (el teléfono tiene que ser campo obligatorio).
- **Metas de optimización** [oficial Meta] ([About performance goals for lead ads](https://www.facebook.com/business/help/782657799338685)): maximizar leads, maximizar leads calificados, leads por mensajes y valor.
  - **Desde abril de 2026, "leads calificados" no está disponible para campañas nuevas sin integración de Conversions API con el CRM.** Las campañas existentes quedaron afectadas desde agosto de 2026.
  - Con formulario y fuente Meta, se puede elegir **"leads con conversaciones de WhatsApp"** como evento de seguimiento.
  - Dato de Meta: −21% de costo por lead de calidad con CAPI-CRM (ene-2025, 567 anunciantes).

### 1.4 Restricciones de salud: ¿alcanzan a un software B2B que le vende a clínicas?

Son cuatro reglas distintas; conviene no mezclarlas.

**1. Categorías especiales de anuncios**
- **Qué es:** financieros, empleo, vivienda y temas sociales, electorales o políticos. **Salud no está en la lista.**
- **¿Aplica a ONIA?** **No.** No hay que declarar ninguna categoría especial.
- **Fuente:** [oficial Meta] [938372127764391](https://www.facebook.com/business/help/938372127764391)

**2. Política de anuncios de salud y bienestar**
- **Qué es:** cubre adelgazamiento, procedimientos cosméticos (solo para 18+, con el antes/después permitido únicamente a 18+, y sin frases de inferioridad sobre el aspecto físico), salud sexual y "curas" de enfermedades incurables.
- **¿Aplica a ONIA?** No a la pieza dental B2B. **Sí puede rozar en estética** si la pieza muestra procedimientos o un antes/después. Mostrar la agenda y el sistema, no cuerpos.
- **Fuente:** [oficial Meta] [health and wellness ad policy](https://www.facebook.com/business/help/2489235377779939)

**3. Atributos personales**
- **Qué es:** prohíbe afirmar o insinuar una condición médica **de quien ve el anuncio** (por ejemplo, "¿te diagnosticaron…?"). "Vos" y "tu" están permitidos si la frase no nombra un atributo prohibido.
- **¿Aplica a ONIA?**
  - "¿Cuántos pacientes no volvieron?" habla de los pacientes **del negocio**, no de quien mira el anuncio: es compatible [inferencia].
  - Evitar frases como "¿Te duele…?" o "¿Tenés caries?".
- **Fuente:** [oficial Meta] [personal attributes policy](https://www.facebook.com/business/help/2557868957763449)

**4. Categorías de fuentes de datos (píxel, CAPI, SDK)**
- **Qué es:**
  - Meta puede clasificar un **dominio o app** como "Salud y bienestar" si está asociado a condiciones médicas, a **relaciones proveedor/paciente** o a servicios para acceder a información personal de salud. Sus ejemplos: portal de pacientes, telemedicina.
  - Hay tres niveles de restricción:
    - *core setup:* corta todo lo que va después del dominio y los parámetros personalizados;
    - *bloqueo de eventos estándar* de mitad y fondo de embudo;
    - *restricción total.*
  - Las restricciones **pueden ser regionales o globales**.
  - La empresa puede categorizarse sola y pedir revisión. Lo que asigna Meta no se puede editar.
  - Está **prohibido compartir información de salud** en URL, UTM, nombres de eventos o listas de clientes.
- **¿Aplica a ONIA?**
  - **Riesgo real si el píxel o la CAPI van en `app.onia.com.bo`**, donde el producto guarda fichas y tratamientos: se parece a un "portal".
  - En `onia.com.bo` (sitio de cinco rubros) el riesgo es menor. Sube en las páginas dentales con "pacientes" o "tratamientos" en la URL [inferencia].
  - **El CTWA optimizado a conversaciones no usa el píxel**, así que la estructura recomendada no queda bloqueada.
- **Fuentes:** [oficial Meta] [data source categories](https://www.facebook.com/business/help/1402913027039332) · [data sharing restrictions](https://www.facebook.com/business/help/511197658391698) · [prohibited information](https://www.facebook.com/business/help/361948878201809)

**Veredicto [inferencia]:** ONIA **no es un anunciante de salud** para las reglas de anuncios. Sí puede ser tratado como **fuente de datos de salud** si el píxel se instala donde viven los datos de pacientes. Para evitarlo:
1. Píxel **solo** en el sitio de venta (`onia.com.bo`), **nunca** en la app.
2. El alta (`/register`) se informa **del lado del servidor** con la CAPI: evento neutro (`CompleteRegistration` o `Lead`) y email y teléfono hasheados, sin la ruta de la URL.
3. Nombres de eventos y UTM **neutros**, por ejemplo `utm_campaign=a2v1` y no `pacientes-perdidos`.
4. Revisar la categoría asignada en Events Manager apenas exista el dataset.
5. **Nunca** subir a Meta datos de pacientes de los clientes, ni como lista de clientes ni como parámetros.

---

## 2. Cómo llegar a dueños de clínicas dentales en Santa Cruz

### 2.1 Tamaño: el orden de magnitud importa más que la cifra

| Dato | Valor | Fuente | Marca |
|---|---|---|---|
| Población del municipio de Santa Cruz de la Sierra | **1.606.671** (Censo 2024) | [El Deber, citando al INE](https://eldeber.com.bo/santa-cruz/censo-2024-cinco-municipios-crucenos-concentran-la-mayor-cantidad-poblacional-del-departamento/) | [secundaria 🔎] |
| Población del departamento de Santa Cruz | 3.122.605 (Censo 2024) | idem | [secundaria 🔎] |
| Población de Bolivia | 11.365.333 (Censo 2024) | [UNFPA Bolivia](https://bolivia.unfpa.org/es/news/bolivia-tiene-11365333-habitantes-seg%C3%BAn-el-censo-2024-ine-socializa-los-datos-en-la-paz-santa) | [secundaria 🔎] |
| Alcance publicitario de Facebook en Bolivia | **59,8% de la población** a fines de 2025 | [DataReportal, *Digital 2026: Bolivia*](https://datareportal.com/reports/digital-2026-bolivia) | [secundaria 🔎] |
| Uso de Instagram (población de 13+) | 25,8% | [DataReportal, *Digital 2025: Bolivia*](https://datareportal.com/reports/digital-2025-bolivia) | [secundaria 🔎 ⏳] |
| Odontólogos colegiados en los tres ejes | ~15.000 | [Dental Tribune](https://la.dental-tribune.com/news/la-odontologia-en-bolivia-2/) (dato de 2019; el repo ya lo marca como direccional) | [secundaria ⏳] |
| Personas alcanzables en Meta dentro del municipio | **~0,9-1,0 millones** | 1,61 M × ~60% | [inferencia] |
| Odontólogos en Santa Cruz | ~5.000-6.000 | si Santa Cruz concentra entre 1/3 y 2/5 de los 15.000 | [inferencia débil] |
| **Clínicas de 2 a 6 profesionales con recepción** (el cliente ideal) | No hay un dato directo. Orden de magnitud: **cientos** | fracción de lo anterior | [inferencia] |
| Mismo segmento, estimado por el carril Mercado | **~150-400 clínicas** (punto medio ~250), a partir de SEDES Santa Cruz (125 clínicas + 1.812 consultorios dentales, dato de ~2018) cruzado con conteos de odontólogos | [repo, **en vuelo y sin commitear**] cambio del 30-sep 03:36 UTC en `ONIA_CLIENTE_IDEAL.md` §7. Cita un `ONIA_ADQUISICION_Y_PAUTA.md` §1 que **todavía no existe en el árbol**. No lo verifiqué | [inferencia de otro carril] |
| Parte del público alcanzable que es cliente ideal | **~0,02-0,04%**, siempre ≲0,1% | 150-400 sobre ~0,96 millones | [inferencia] |

**Lectura:**
- El público **no es técnicamente chico**: la ciudad tiene cerca de un millón de personas alcanzables, así que no aparece el aviso de "audiencia demasiado pequeña".
- El problema es de **precisión**. No quedan exclusiones ni cargos confiables, así que el filtro lo hacen la pieza y el bot.
- La audiencia **sí se vuelve demasiado chica** si se la limita en duro:
  - a públicos personalizados propios, por ejemplo los seguidores de @oniahq, que eran ~22-23 al 20-ago [repo];
  - o apilando intereses como controles.

### 2.2 Opciones de público que existen hoy

**Ciudad + radio, o "solo la ciudad actual"**
- **¿Existe hoy?** Sí [oficial]. El radio mínimo y máximo depende del tipo de ubicación.
- **¿En Bolivia?** Bolivia se puede segmentar; la clave de "Santa Cruz de la Sierra" no se verificó.
- **Uso recomendado para ONIA:** control duro, con "Llegar a más personas…" **apagado**.

**Edad mínima como control**
- **¿Existe hoy?** Sí, desde 18 [oficial].
- **¿En Bolivia?** Sí.
- **Uso recomendado para ONIA:** 25 como control y 28-60 como sugerencia.

**Intereses** (Odontología, Clínica dental, Dentistry, Ortodoncia)
- **¿Existe hoy?** Sí, pero consolidados desde jun-2025 [oficial]. Con Advantage+ son **sugerencia**.
- **¿En Bolivia?** No verificado.
- **Uso recomendado para ONIA:** solo como sugerencia. Mezclan pacientes, estudiantes y proveedores.

**Comportamientos "Administradores de páginas" y "Dueños de pequeñas empresas"**
- **¿Existe hoy?** Siguen en 2026 según fuentes secundarias ([skylinesocial](https://www.skylinesocial.com/target-business-owners-facebook-ads/), [adlibrary](https://adlibrary.com/posts/detailed-targeting)) [secundaria 🔎].
- **¿En Bolivia?** No verificado.
- **Uso recomendado para ONIA:** sugerencia.

**Cargo, empleador o estudios (por ejemplo, "Odontología")**
- **¿Existe hoy?** Existen, pero muy reducidos y con estado 2026 incierto [secundaria 🔎, [contactlevel](https://www.contactlevel.com/playbooks/meta-job-title-targeting)]. El empleador solo sirve para **excluir** a los empleados propios desde los controles de cuenta [oficial].
- **¿En Bolivia?** No verificado.
- **Uso recomendado para ONIA:** los perfiles bolivianos casi nunca completan el cargo [inferencia]. No contar con esto.

**Exclusión por intereses**
- **¿Existe hoy?** **No existe** desde el 31-mar-2025 [oficial].
- **Uso recomendado para ONIA:** solo excluir públicos personalizados.

**Interacción con Instagram o con la página**
- **¿Existe hoy?** Sí. En Instagram la retención llega hasta 365 días [oficial]: [IG custom audience](https://www.facebook.com/business/help/214981095688584) · [engagement audiences](https://www.facebook.com/business/help/1090330204367211).
- **¿En Bolivia?** Sí.
- **Uso recomendado para ONIA:** hoy está casi vacío. Sirve como sugerencia o como exclusión, y más adelante para retargeting.

**Espectadores de video y quienes abrieron un formulario**
- **¿Existe hoy?** Sí [oficial].
- **¿En Bolivia?** Sí.
- **Uso recomendado para ONIA:** retargeting de quienes vieron al menos el 50% de la demo, cuando haya volumen.

**Visitantes del sitio**
- **¿Existe hoy?** Requiere píxel.
- **Uso recomendado para ONIA:** hoy no hay: `onia.com.bo` **no tiene píxel** (`COORDINATION_MANIFEST.md`, 30-sep) [repo].

**Lista de clientes**
- **¿Existe hoy?** Sí [oficial], pero una cuenta nueva **puede tardar semanas** en poder crearla, y la lista **no puede basarse en información de salud** ([customer list](https://www.facebook.com/business/help/170456843145568)).
- **Uso recomendado para ONIA:** como **exclusión**, con los registros que ya existen.

**Públicos similares (lookalike)**
- **¿Existe hoy?** Sí. La fuente necesita **100 personas o más, y Meta recomienda entre 1.000 y 5.000** [oficial] ([lookalike](https://www.facebook.com/business/help/465262276878947)). Con Advantage+ solo funcionan como sugerencia.
- **Uso recomendado para ONIA:** **inviable hoy**: la semilla serían unos 5 registros.

### 2.3 Qué hace Meta con el B2B en un mercado chico

1. **Expande dentro de los controles.** Las sugerencias se ignoran cuando Meta estima que le rinde más ignorarlas [oficial]. Con ubicación y edad mínima como controles, la expansión queda dentro de Santa Cruz, pero puede llegar **a cualquiera** de la ciudad.
2. **Se va a lo barato.** Optimizando a conversaciones, Meta busca a quien escribe más barato. Con un anuncio sobre "clínica dental", eso es **el paciente que busca turno** [inferencia]. Por eso el dato local de Bs 1-3,5 por conversación (§3) puede verse "bien" con cero clientes calificados.
3. **Puede salirse de la ciudad.** "Llegar a más personas…" viene marcado para ciudades y la precisión de ubicación no está garantizada [oficial].
4. **La estimación de tamaño engaña.** Con expansión Advantage+, el tamaño estimado **no refleja** el alcance real [oficial] ([estimated audience size](https://www.facebook.com/business/help/1665333080167380)).
5. **La pieza segmenta.** Con Andromeda, la creatividad decide a quién se le muestra el anuncio [secundaria]. Una pieza que dice "para dueños/as de clínicas" y muestra la agenda y la ficha actúa como filtro. Una pieza que habla de sonrisas atrae pacientes.

**Competencia en la Biblioteca de Anuncios** (consultada el 30-sep-2026 vía conector, datos públicos) [oficial Meta, metadatos]:
- Búsqueda "software dental", Bolivia, activos: **10 resultados.**
  - **Dentalink** (USD) tiene 2 anuncios creados el **10-sep-2026**: *"Dicta tus fichas con IA 🎙️"* y *"Simula sonrisas con IA ✨"*.
  - **Medilink** tiene *"Controla tu clínica hoy"*, creado el **28-sep-2026**.
  - softwaredentalpro (ARS, 26-sep) y Resulta SRL (BOB, 28-sep; sin título).
- **No se abrieron las piezas**; la clasificación visual queda pendiente.
- **Lectura:** el nicho sigue casi vacío, pero ya hay un jugador regional pautando en Bolivia **con funciones de IA como gancho**. El diferencial escrito de ONIA son los agentes y el seguimiento del paciente a medias (`ONIA_CLIENTE_IDEAL.md` §2).
- **Coincide con lo que está midiendo el carril Mercado** (cambio sin commitear en `ONIA_CLIENTE_IDEAL.md` §2 y §6, 30-sep):
  - Healthatom (Dentalink/Medilink) pauta en Bolivia desde junio, con IA del trabajo clínico;
  - ningún software boliviano pauta en dental;
  - ~20 clínicas dentales de Santa Cruz pagan pauta para conseguir pacientes;
  - la home de `onia.com.bo` todavía le habla a "tu negocio", no a una clínica. Es un argumento más para no mandar esta pauta a la web todavía (§4.3).

### 2.4 Configuración de público recomendada

- **Controles:**
  - Santa Cruz de la Sierra (ciudad + ~17-25 km, o "solo la ciudad actual"), con **"Llegar a más personas…" apagado**;
  - **edad mínima 25**;
  - idioma español;
  - **exclusión** de la lista de registros y clientes, cuando la cuenta lo permita.
- **Sugerencias (opcionales):**
  - edad 28-60;
  - intereses de odontología o clínica dental;
  - "Administradores de páginas", si aparece.
- **No** limitar en duro a intereses ni a públicos propios: con esos volúmenes el conjunto no entrega.
- Antes de encender, **mirar en Ads Manager el tamaño estimado** con y sin sugerencias y anotarlo como punto de partida. No se pudo verificar desde acá.

---

## 3. Benchmarks (Bolivia / LatAm, 2025-2026)

**No hay benchmark B2B ni de SaaS para Bolivia.** Lo que sigue es LatAm o Bolivia B2C, marcado como tal.

| Métrica | Valor | País / segmento | Fuente (fecha) | Marca / confianza |
|---|---|---|---|---|
| CPM Meta | Colombia USD 2,00 · Chile 2,44 · Brasil 2,63 · México 3,92; promedio global 6,59 | LatAm, general | [AdAmigo, CPM & CPC by country 2026](https://www.adamigo.ai/blog/meta-ads-cpm-cpc-benchmarks-by-country-2026) | [secundaria 🔎] media-baja |
| CPM Bolivia | USD 1,40 según una fuente; USD 0,13 según otra | Bolivia | [bloggingkart](https://bloggingkart.com/facebook-high-cpm-countries-list/) · [thesrzone](https://www.thesrzone.com/2024/03/facebook-cpm-rates-by-country.html) | [secundaria 🔎] **no usable**: se contradicen y no tienen método |
| Costo por conversación iniciada en WhatsApp | **Bs 1,00-3,50** | Bolivia, B2C amplio | [rikcarez, "Costo de Facebook Ads en Bolivia: guía completa 2025"](https://rikcarez.com/costo-facebook-ads-bolivia-guia-completa/) | [secundaria local 🔎], sin metodología. ≈USD 0,14-0,50 al tipo oficial de 6,96; el tipo de mercado no se verificó |
| Costo por interacción | Bs 0,08-0,25 | Bolivia | [basicmarketing.com.bo](https://basicmarketing.com.bo/agencia-publicidad/costos-publicitarios-en-bolivia/) (sin fecha visible) | [secundaria local 🔎] |
| Mínimo diario | Bs 7 ≈ USD 1 | Bolivia | las dos fuentes locales + [repo]: la cuenta ONIA Ads tiene mínimo de USD 1/día | [secundaria] + [repo] |
| Costo por conversación en CTWA | USD 0,95 (India) a 5,20 (EE. UU.); LatAm queda en el medio | global | [getkanal, CTWA benchmarks 2026](https://getkanal.com/blog/click-to-whatsapp-ads-benchmarks-2026) | [secundaria vendor 🔎] |
| Costo por lead (CPL) | USD 1-30 en general; **odontología ≈ 15,2** (B2C: pacientes) | Colombia | [Consolidación Digital 2026](https://www.consolidaciondigital.com/blog/performance-marketing/cuanto-cuesta-meta-ads-colombia) | [secundaria 🔎] |
| CPL "Dentists & Dental Services" (objetivo clientes potenciales) | 2025: USD 76,71 → 2026: 61,56. CTR 1,05% → 1,62%. CPC 9,78 → 5,70 | EE. UU., B2C | [WordStream 2025](https://www.wordstream.com/blog/facebook-ads-benchmarks-2025) · [WordStream 2026](https://www.wordstream.com/blog/facebook-ads-benchmarks-2026) | [secundaria 🔎]. Referencia de techo, **no aplica a Bolivia** |
| CPL y CTR por objetivo | CPL USD 27,66. CTR: leads 2,59% vs tráfico 1,71% | global | [AdAmigo, by objective 2026](https://www.adamigo.ai/blog/meta-ads-benchmarks-2026-by-objective-and-placement) | [secundaria 🔎] |
| CPL de SaaS B2B | ~USD 63-220 con formulario | centrado en EE. UU. | [aimers.io](https://aimers.io/blog/facebook-ads-cost) · [growthspree](https://www.growthspreeofficial.com/blogs/meta-ads-benchmarks-2026-b2b-saas-b2b-cpm-cpc-cpl-vertical) | [secundaria 🔎] baja: el resumen mezcla fuentes |
| Mejoras relativas medidas por Meta | CTWA optimizado a leads: −24% CPL vs conversaciones. Advantage+ leads: −14% CPL y −10% CPL calificado. Leads calificados con CAPI-CRM: −21% | global | Centro de ayuda de Meta (§1) | [oficial Meta]: son relativos, no absolutos |

**Cómo usarlos [inferencia]:**
- El único dato local (Bs 1-3,5 por conversación) sale de **pauta B2C amplia**. Hablándole a dueños de clínicas en una ciudad, con copy que aleja a los pacientes, hay que esperar **bastante más por conversación calificada**.
- **Hipótesis para planificar, a reemplazar por la semana 1:**
  - conversación a **USD 1-4**;
  - **10-30%** de conversaciones calificadas;
  - ⇒ **USD 3-40 por conversación calificada.**
- El benchmark que sirve es el propio: se mide en 7-14 días y se fija ahí.

---

## 4. Estructura recomendada

### 4.1 Precondiciones (del repo; estado al 17-30-sep, re-verificar)

| # | Qué | Estado conocido | Fuente |
|---|---|---|---|
| 1 | Método de pago en `act_1073680778314945` | ❌ al 21-sep | [repo] `docs/handoff/meta-ads-prospeccion.md` §3.1 |
| 2 | Página "Onia" `1140384625819526` promocionable desde la cuenta | ❌ al 17-sep (`promote_pages` vacío) | idem |
| 3 | WhatsApp de ONIA conectado a esa página o al portafolio | desconocido | requisito [oficial] de CTWA |
| 4 | **Atribución del CTWA:** capturar `referral` antes de Chatwoot (o parchear el canal) **y**, mientras tanto, un **código por anuncio** en el mensaje prellenado | ❌ Chatwoot descarta el `referral` | [repo] `chatwoot-adapter.mjs:129-133` |
| 5 | Bot con las **5 preguntas de calificación**, salida cortés para pacientes, aviso a Sergio Urcullo y etiqueta "lead" | por verificar | [repo] `ONIA_CLIENTE_IDEAL.md` §9 |
| 6 | Contestar **primero** a los leads orgánicos que esperan | 5 sin respuesta al 21-sep | [repo] handoff §6–§7 ("pagar por leads nuevos mientras cinco gratis esperan… es tirar la plata") |
| 7 | OK explícito de gasto de Sergio Urcullo | pendiente | [repo] handoff §6 |
| 8 | Operar solo sobre `act_1073680778314945`, **nunca** sobre las cuentas NUVO / Arthur Fuentes del conector | trampa conocida | [repo] handoff §3.1 |
| 9 | Solo si se usa web o formulario: propagar `utm_*` y `fbclid` desde los CTA; píxel solo en `onia.com.bo` | ❌ al 30-sep: los CTA van **sin** utm/fbclid y no hay píxel | [repo] `COORDINATION_MANIFEST.md` l.112-116 |
| 10 | Definir cuántas demos por semana puede dar Sergio Urcullo | — | [repo] `CLAUDE.md` §1: el techo son horas, no pauta |

> ⚠️ **Discrepancia a verificar:** el pedido dice que "la web y el registro guardan el origen (utm/fbclid) desde la 1.0". Según el manifest del 30-sep, el registro lo guarda **si le llega**, pero los CTA del sitio **no lo propagan**. Para CTWA da igual; para formulario o web, no.

### 4.2 Configuración común a las tres escalas

**Campaña**
- Objetivo **Clientes potenciales**, con Advantage+ encendido y presupuesto de campaña (hay un solo conjunto).
- **Techo duro:** presupuesto total de la campaña, o límite de gasto de campaña. Según el repo, el límite de gasto de campaña no acepta menos de USD 100.

**Conjunto de anuncios**
- Ubicación de conversión: **WhatsApp**.
- Meta: **"Maximizar el número de conversaciones"**.
- Puja "mayor volumen", sin tope de costo: no hay datos para fijarlo, y Meta advierte que una puja baja deja el conjunto en aprendizaje limitado [oficial].

**Público:** el de §2.4.

**Ubicaciones de anuncio**
- Dejar Advantage+.
- Evaluar excluir **Estados de WhatsApp**, porque ahí se pierde el `ctwa_clid` [oficial 🔎].
- Evaluar excluir Audience Network desde los controles de cuenta [inferencia].

**Anuncio**
- Botón **"Enviar mensaje"**.
- Primera línea: **"Para dueños/as de clínicas dentales en Santa Cruz."** Es autoexclusión, y es el patrón que ya usa la competencia (`ADS_PATTERN_BANK_2026.md` §1) [repo].
- Plantilla **"Iniciar conversación"** con tres respuestas para tocar:
  1. "Tengo una clínica y quiero ver cómo funciona";
  2. "Trabajo en una clínica";
  3. "Busco atención dental": el bot responde que Onia es un sistema para clínicas y cierra con cortesía.
- **Cada anuncio con su código** en el texto prellenado (`[A2-DEMO]`, `[A2-CARR]`…). Es la atribución barata mientras Chatwoot siga tirando el `referral` [inferencia].
- Si la cuenta tiene **"Formulario en WhatsApp" (Flows)**, probarlo para las 5 preguntas [oficial, disponibilidad desconocida].

**Bot**
- Responde **al instante**. Además, la ventana gratis de 72 h exige responder en 24 h o menos [oficial 🔎].
- Hace las 5 preguntas de calificación.
- Si la clínica califica: ofrece demo con horario, la **etiqueta como lead**, porque eso alimenta la optimización a leads [oficial], y avisa a Sergio Urcullo **el mismo día**.

**Ventana:** no tocar nada durante **7 días como mínimo** [oficial]. Con estos volúmenes, **decidir a los 14 días**.

### 4.3 Por presupuesto

**USD 5/día (≈ 150/mes)**
- **Para qué sirve:** medir qué porcentaje de conversaciones califica y validar el ángulo. **Queda en aprendizaje limitado por diseño.**
- **Regla oficial del 10×:** se cumple solo si la conversación cuesta ≤ USD 0,50.
- **Conversaciones por semana** (hipótesis USD 1-4 cada una) [inferencia]: 9-35.
- **Calificadas por semana** (10-30%) [inferencia]: ~1-10.
- **Estructura:** 1 campaña · 1 conjunto · **2-3 anuncios**.
- **Qué se prueba:** el **formato** dentro del ángulo #1 (el paciente con tratamiento a medias): demo de pantalla frente a carrusel con UI real.
- **Cuándo se evalúa:** a los 14 días (≈ USD 70).
- **Qué sigue:** con al menos 1 demo realizada, subir a USD 10.

**USD 10/día (≈ 300/mes)**
- **Para qué sirve:** es el **mínimo razonable** para leer el costo por conversación calificada en 2 semanas.
- **Regla oficial del 10×:** se cumple si la conversación cuesta ≤ USD 1,00.
- **Conversaciones por semana** [inferencia]: 17-70.
- **Calificadas por semana** [inferencia]: ~2-21.
- **Estructura:** 1 · 1 · **3-4 anuncios**.
- **Qué se prueba:** lo mismo, más un **2.º ángulo**: la agenda que vive en la cabeza de la recepcionista.
- **Cuándo se evalúa:** a los 7-14 días.
- **Qué sigue:** con **10 o más leads etiquetados en 30 días**, pasar a un conjunto nuevo con **"Maximizar leads por mensajes"**. Reinicia el aprendizaje. Exige etiquetas o la CAPI, y por eso el precondición 4 va antes.

**USD 20/día (≈ 600/mes)**
- **Para qué sirve:** **puede salir de aprendizaje** si la conversación cuesta ≤ USD 2,8, y permite una prueba A/B limpia.
- **Regla oficial del 10×:** se cumple si la conversación cuesta ≤ USD 2,00.
- **Conversaciones por semana** [inferencia]: 35-140.
- **Calificadas por semana** [inferencia]: ~3-42.
- **Estructura, dos opciones:**
  - **A:** 1 · 1 · **4-6 anuncios**.
  - **B**, con el etiquetado o la CAPI listos: **prueba A/B de Meta, mitad y mitad, 14 días**, CTWA contra formulario **"Mayor intención"** (3 preguntas de opción múltiple + SMS + seguimiento por WhatsApp).
- **Qué se prueba:** lo anterior, más un **presentador**: Sergio Urcullo, o un presentador IA declarado.
- **Cuándo se evalúa:** a los 7 días por ronda.
- **Qué sigue:** escalar lo que gane de a +20-30% cada 3-4 días (§4.5).

**No se recomienda empezar con web ni landing.** Hoy no hay píxel, los CTA no propagan el origen, la CAPI no existe y está el riesgo de categoría de salud (§1.4). La web entra cuando se resuelva el precondición 9.

### 4.4 Creativos: qué probar y en qué orden

**Orden de prueba.** Una variable por ronda, y cada ronda es una sola "edición significativa", no un goteo:
1. **Formato**, dentro del ángulo #1: el paciente con tratamiento a medias. Es el dolor que el lead real dijo con sus palabras (`ONIA_CLIENTE_IDEAL.md` §3-4).
2. **Ángulo:** #2 la agenda en la cabeza de la recepcionista; #3 la silla vacía.
   - **No usar el SIAT como urgencia:** el emisor está en trámite y decir "obligatorio" está prohibido [repo].
3. **Gancho** de los primeros 3 segundos.

**Formatos permitidos por las reglas internas** (`CLAUDE.md` §5, "Publicidad que no parezca hecha por IA"):
- ✅ **Demo del producto real:** grabación de pantalla de 15-30 s donde se vea la lista de pacientes que no volvieron y el seguimiento.
- ✅ **Carrusel con UI real:** ya existe `hermes-content/carousels/out/ads/onia-platform-dental-meta-20260921-carousel-v2-feed/`, 8 láminas con agenda, alta de cita y cobros reales, y portada humana [repo, visto].
- ✅ **Presentador que explica y muestra la pantalla.**
  - Un presentador IA solo si Sergio Urcullo lo pide, **nunca haciéndose pasar por cliente u odontólogo**.
  - Toda generación paga necesita aprobación.
- ❌ **Testimonio: no.** Con cero clientes que pagan, fabricar un testimonio está prohibido.

**Observaciones sobre las piezas que ya existen** [repo, miradas]:
- **`ad-a2-v1-no-volvieron/slide-01.png` (13-ago):**
  - es **solo tipografía, sin UI**, así que **no pasa "producto visible o no sale"** (regla del 21-sep);
  - además firma `@oniaagency`.
  - Rehacerla con UI o reemplazarla.
- **Carrusel V2 (21-sep), lámina 8:** cierra con *"Creá tu cuenta — Probá ONIA 14 días sin tarjeta. Desde Bs 320/mes"*.
  - Para CTWA, cambiar el CTA a "Escribinos por WhatsApp".
  - Revisar el ancla de precio: el cliente ideal **arranca en Crece, no en Básico** (`ONIA_CLIENTE_IDEAL.md` §2). Un "desde" del plan más barato atrae al consultorio de un solo profesional [inferencia].
  - Todo precio se lee de `subscription-plans.ts`.
- **Antes de pautar, verificar en el producto que lo que muestra cada pieza exista hoy.** La lista de "pacientes sin volver" y el *recall* deben estar encendidos y verificados, porque la regla dice "construido ≠ terminado".

### 4.5 Frecuencia, corte y escala

**Frecuencia**
- No hay tope para esta meta [oficial].
- **Alarma** [inferencia]: frecuencia de 7 días mayor a 3, y además una caída de más del 30% en la tasa de conversaciones iniciadas sobre impresiones frente a la semana 1.
- Respuesta: **una tanda nueva** de creatividades.

**Cortar un anuncio**
- Si gastó el equivalente a **1 CPCC objetivo** (≈ USD 27, ver §4.6) sin ninguna conversación calificada, se pausa [inferencia].

**Cortar la campaña**
- Cambiar el ángulo o la oferta **sin subir presupuesto** si pasa una de estas dos cosas [inferencia; coincide con la regla del repo "no subir para darle tiempo"]:
  - **14 días con 0 demos;**
  - **CPCC mayor al doble del objetivo.**

**Alerta temprana** [repo]
- Si la conversación cuesta más de USD 5 en la semana 1, revisar la pieza (`ADS_PATTERN_BANK_2026.md` §6).

**Escalar**
- Solo cuando se dan las dos cosas:
  - costo por demo ≤ objetivo **durante 2 semanas seguidas**;
  - la agenda de Sergio Urcullo tiene lugar.
- Cómo: **+20-30% cada 3-4 días** [secundaria / práctica]. Meta dice que un cambio de presupuesto reinicia el aprendizaje "según la magnitud" [oficial].

**Techo**
- Cuando las demos superan la capacidad semanal de Sergio Urcullo, **no se escala**: el límite es de horas, no de pauta [repo, `CLAUDE.md`].

### 4.6 KPIs y fórmulas

| KPI | Fórmula | Dónde se mide |
|---|---|---|
| Costo por conversación (CPCv) | gasto ÷ conversaciones iniciadas | Ads Manager |
| % calificadas | conversaciones que pasan las 5 preguntas ÷ conversaciones | bot / CRM (con el código por anuncio) |
| **Costo por conversación calificada (CPCC)** | gasto ÷ conversaciones calificadas | Ads Manager + CRM |
| % demo | demos realizadas ÷ calificadas | agenda |
| **Costo por demo (CPD)** | gasto ÷ demos realizadas | idem |
| % cierre | clientes con primer pago ÷ demos | `subscription_payments` |
| **CAC pagado** | gasto ÷ clientes nuevos atribuidos | idem |
| Margen mensual por cliente (MC) | precio × margen bruto | — |
| LTV | MC ÷ churn mensual | — |
| LTV:CAC | LTV ÷ CAC (objetivo ≥ 3) | — |
| Payback | CAC ÷ MC (objetivo ≤ 3-6 meses) | — |

**Ejemplo ilustrativo [inferencia].** Cada supuesto está a la vista; se reemplaza con datos reales.

**Supuestos:**
- **Precio:** ≈ USD 95/mes, punto medio del rango de 80-110 que dio el pedido. Verificar contra `DEFAULT_PLAN_AMOUNTS` en `onia-platform/lib/subscription-plans.ts`.
- **Margen bruto:** 95% (`CLAUDE.md`: 94-99,8%). ⇒ **MC ≈ USD 90.**
- **Churn:** desconocido (hay 0 clientes). Se prueban tres escenarios.

**LTV y CAC máximo:**

| Churn mensual | LTV | CAC máximo con LTV:CAC = 3 |
|---|---|---|
| 3% | ≈ 3.000 | ≈ 1.000 |
| 5% | ≈ 1.800 | ≈ 600 |
| 8% | ≈ 1.130 | ≈ 375 |

- Por payback: a 3 meses ≈ USD 270; a 6 meses ≈ USD 540.
- **Objetivo prudente** mientras el churn sea incierto: **CAC pagado ≤ USD 270.**

**Embudo supuesto:**
- calificada → demo: 40%;
- demo → pago: 25%;
- ⇒ el 10% de las conversaciones calificadas termina en cliente.
- ⇒ **CPCC objetivo ≤ USD 27** y **CPD objetivo ≤ USD 68.**

**Qué exige cada presupuesto:**

| Presupuesto | Gasto mensual | Clientes/mes para cumplir CAC ≤ 270 |
|---|---|---|
| USD 5/día | 150 | ≥ 0,6 (uno cada ~2 meses) |
| USD 10/día | 300 | ≥ 1,1 |
| USD 20/día | 600 | ≥ 2,2 |

- El break-even del negocio es ≈ 5 clientes (`CLAUDE.md`). A 1 cliente por mes desde la pauta, son **~5 meses**.

---

## 5. Lo que suele salir mal en un B2B chico en Meta, y cómo prevenirlo

**1. Escriben pacientes que buscan turno**
- **Por qué pasa:** Meta optimiza a la conversación más barata, y "clínica dental" atrae demanda de pacientes.
- **Prevención:**
  - primera línea "Para dueños/as de clínicas";
  - respuesta "Busco atención dental" con salida cortés;
  - **medir el CPCC**, no el CPCv.
- **Marca:** [inferencia]

**2. Curiosos, estudiantes de odontología, proveedores y agencias que quieren venderte algo**
- **Por qué pasa:** los intereses solo sugieren y ya no hay exclusiones detalladas.
- **Prevención:**
  - preguntas 1-2 de calificación al empezar;
  - **etiquetar como lead solo a los calificados**, para que el algoritmo aprenda de ellos.
- **Marca:** [oficial] (exclusiones) + [inferencia]

**3. Formularios basura**
- **Por qué pasa:** en "Más volumen" el formulario viene prellenado y se envía en dos toques.
- **Prevención:** "**Mayor intención**" + preguntas de opción múltiple + **verificación por SMS**.
- **Marca:** [oficial] (las funciones)

**4. El anuncio se riega fuera de Santa Cruz**
- **Por qué pasa:** "Llegar a más personas…" viene marcado, y la precisión de ubicación no está garantizada.
- **Prevención:** apagarlo y revisar el desglose por región.
- **Marca:** [oficial]

**5. Se ignora la edad**
- **Por qué pasa:** en Advantage+ la edad es una sugerencia.
- **Prevención:** fijar la **edad mínima como control**.
- **Marca:** [oficial]

**6. "Aprendizaje limitado" permanente**
- **Por qué pasa:** con USD 5-10 por día no se llega a 50 eventos por semana.
- **Prevención:**
  - aceptarlo y juzgar por el CPCC;
  - **no agregar anuncios de a uno**, porque cada uno reinicia el aprendizaje.
- **Marca:** [oficial]

**7. La audiencia "se agota"**
- **Por qué pasa:** el cliente ideal son cientos de personas y ven siempre lo mismo.
- **Prevención:**
  - una tanda nueva cada 2-3 semanas;
  - ángulos nuevos;
  - no pausar 7 días o más, porque reinicia el aprendizaje.
- **Marca:** [oficial] + [inferencia]

**8. Atribución rota: el costo por cliente no se puede calcular**
- **Por qué pasa:**
  - Chatwoot tira el `referral`;
  - los CTA van sin utm/fbclid;
  - no hay píxel.
- **Prevención:** código por anuncio, capturar el webhook antes de Chatwoot y propagar utm en la web.
- **Marca:** [repo]

**9. Sin `ctwa_clid` no hay optimización a leads**
- **Por qué pasa:** la CAPI de mensajería exige `ctwa_clid`, y con Cloud API no existen las etiquetas de la app.
- **Prevención:** capturar el `referral` **es doble condición**: sirve para la atribución y para la señal.
- **Marca:** [oficial] + [repo]

**10. Rechazo por atributos personales**
- **Por qué pasa:** frases que insinúan una condición de salud de quien mira.
- **Prevención:** hablar de "tu clínica" y de "tus pacientes" (los del negocio); nunca "¿te duele?".
- **Marca:** [oficial] + [inferencia]

**11. En estética: procedimientos o antes/después**
- **Por qué pasa:** la política de salud y bienestar exige 18+ y prohíbe hablar mal del aspecto físico.
- **Prevención:** mostrar la agenda y el sistema, no cuerpos.
- **Marca:** [oficial]

**12. Restricción de datos de salud en el píxel**
- **Por qué pasa:** un dominio con relación proveedor/paciente puede quedar clasificado como salud.
- **Prevención:**
  - píxel solo en `onia.com.bo`, nunca en la app;
  - eventos y UTM neutros;
  - revisar la categoría en Events Manager.
- **Marca:** [oficial] + [inferencia]

**13. Subir listas con datos de pacientes**
- **Por qué pasa:** está prohibido (es información de salud).
- **Prevención:** **nunca** subir datos de pacientes de los clientes.
- **Marca:** [oficial]

**14. Gastar más que el diario**
- **Por qué pasa:** Meta permite hasta +75% en un día.
- **Prevención:** presupuesto total o límite de gasto de campaña.
- **Marca:** [oficial] + [repo]

**15. Demasiados anuncios o conjuntos para poca plata**
- **Por qué pasa:** fragmenta el aprendizaje y genera superposición entre conjuntos.
- **Prevención:** 1 conjunto con 2-4 anuncios.
- **Marca:** [oficial]

**16. Responder tarde**
- **Por qué pasa:** la ventana gratis exige respuesta en 24 h o menos, y un lead B2B se enfría.
- **Prevención:** bot instantáneo + aviso a Sergio Urcullo el mismo día.
- **Marca:** [oficial 🔎] + [inferencia]

**17. Anclar en el precio del plan más barato**
- **Por qué pasa:** atrae al consultorio de un solo profesional, que no es cliente ideal.
- **Prevención:** sin precio en el anuncio, o con el precio del plan que le calza al cliente ideal, leído de la fuente.
- **Marca:** [repo] + [inferencia]

**18. Gastar en la cuenta equivocada**
- **Por qué pasa:** el conector de la sesión está logueado en NUVO / Arthur Fuentes.
- **Prevención:** confirmar `act_1073680778314945` antes de cualquier escritura.
- **Marca:** [repo]

**19. Pagar leads nuevos con leads gratis esperando**
- **Por qué pasa:** es la conclusión del handoff del 21-sep.
- **Prevención:** paso 1 del handoff: contestarles primero.
- **Marca:** [repo]

**20. Una pieza sin producto visible o que exhibe obra**
- **Por qué pasa:** incumple las reglas de la casa.
- **Prevención:** "producto visible o no sale" y nada de "muy pronto".
- **Marca:** [repo] (`CLAUDE.md`)

**21. La tarjeta boliviana rechaza el cobro de Meta**
- **Por qué pasa:** hubo límites a las compras en el exterior en 2024-2025.
- **Prevención:** **no verificado para 2026** (se agotó la búsqueda). Probar con un cobro chico antes de lanzar.
- **Marca:** sin fuente

---

## 6. Qué no pude verificar

- **Tamaño estimado del público** en Santa Cruz + radio, con y sin intereses. Requiere Ads Manager o la API de segmentación con el token de ONIA; el conector de la sesión está en otra cuenta.
- **Si existen hoy para Bolivia** estas opciones: "Odontología" y "Clínica dental" como intereses, "Administradores de páginas", "Dueños de pequeñas empresas", y cargo / empleador / estudios. Tampoco la clave geográfica de Santa Cruz de la Sierra ni los radios mínimo y máximo que admite.
- **Benchmarks:** cualquier benchmark B2B o SaaS de Bolivia, y un CPM confiable de Bolivia. Las dos fuentes encontradas se contradicen.
- **WhatsApp:**
  - la **tarifa por mensaje para Bolivia**;
  - el detalle del cambio de cobro de mensajes de servicio anunciado para oct-2026 (solo se vio el título);
  - la página de precios completa (el proxy la bloqueó; solo se vio el snippet).
- **Disponibilidad en la cuenta de ONIA** (Meta las despliega gradualmente): "Maximizar leads por mensajes", "Advantage+ leads", y "Formulario en WhatsApp" (Flows) como plantilla de CTWA.
- **Categoría de salud:** si Meta clasificaría `onia.com.bo` o `app.onia.com.bo` como "Salud y bienestar". Solo se ve en el Events Manager de ONIA, una vez creado el dataset.
- **CAPI propia:** requisitos exactos para que ONIA, como anunciante y no como partner, mande eventos de WhatsApp por CAPI desde su propia app. La documentación está escrita para partners; hay que aclarar si el acceso avanzado y las 1.500 llamadas aplican a un anunciante que usa sus propios activos.
- **Estado de las precondiciones hoy (30-sep):** los datos del repo son del 17-21-sep. Falta confirmar:
  - la tarjeta;
  - la página vinculada;
  - el WhatsApp conectado a la página;
  - si los 5 leads ya fueron contestados.
- **Pagos:** problemas de pago a Meta con tarjetas bolivianas en 2026 (se agotó el cupo de búsqueda).
- **Tipo de cambio:** el Bs/USD vigente. Afecta cómo se traducen los benchmarks en Bs.
- **Biblioteca de Anuncios:** el contenido visual de las piezas de Dentalink, Medilink y Resulta SRL (no se abrieron los snapshots).
- **Andromeda:** si trae efectos específicos para mercados chicos (solo hay fuentes secundarias).
- **Tamaño del segmento:** la estimación de ~150-400 clínicas del carril Mercado. Su doc de método (`ONIA_ADQUISICION_Y_PAUTA.md`) no existía en el árbol al escribir este informe, y el cambio en `ONIA_CLIENTE_IDEAL.md` estaba sin commitear.
- **Metodología de las fuentes secundarias** (AdAmigo, WordStream, getkanal, rikcarez, Consolidación Digital): no se pudieron abrir. Las cifras vienen de resúmenes del buscador.

---

## Fuentes

**[oficial Meta]: Centro de ayuda y documentación, leídos el 30-sep-2026 con la herramienta de ayuda del conector Meta Ads**

Advantage+ y presupuesto:
- [About the Advantage+ campaign experience](https://www.facebook.com/business/help/1292656978738967)
- [About Advantage+ leads campaigns](https://www.facebook.com/business/help/992035952809423)
- [Set up Advantage+ campaign budget](https://www.facebook.com/business/help/343242619559352)

Público y segmentación:
- [About audience controls and audience suggestions in Advantage+ audience](https://www.facebook.com/business/help/938372127764391)
- [Create a campaign using Advantage+ audience](https://www.facebook.com/business/help/793748385630490)
- [Choose audience settings in Advantage+ campaigns](https://www.facebook.com/business/help/25941857932125812)
- [Set audience and placement controls for your ad account](https://www.facebook.com/business/help/1438478636941047)
- [Updates to detailed targeting](https://www.facebook.com/business/help/458835214668072)
- [About Advantage+ detailed targeting](https://www.facebook.com/business/help/128066880933676)
- [About detailed targeting](https://www.facebook.com/business/help/182371508761821)

Ubicación:
- [How to reach people interested in your selected cities and regions](https://www.facebook.com/business/help/726389026372510)
- [Use location targeting](https://www.facebook.com/business/help/365561350785642)
- [About location targeting](https://www.facebook.com/business/help/202297959811696)

Aprendizaje, entrega y frecuencia:
- [About the learning phase](https://www.facebook.com/business/help/112167992830700)
- [About learning limited](https://www.facebook.com/business/help/269269737396981)
- [Significant edits and learning phase](https://www.facebook.com/business/help/316478108955072)
- [Troubleshoot: not delivered enough](https://www.facebook.com/business/help/666335734044063)
- [Troubleshoot: ad set isn't running](https://www.facebook.com/business/help/164406965378460)
- [About estimated audience size](https://www.facebook.com/business/help/1665333080167380)
- [About frequency controls for auction](https://www.facebook.com/business/help/422853447344162)
- [Frequency controls for reservation](https://www.facebook.com/business/help/1461336133922536)

Mensajería (CTWA):
- [Create ads that click to WhatsApp in Ads Manager](https://www.facebook.com/business/help/447934475640650)
- [Create an ad that clicks to multiple message destinations](https://www.facebook.com/business/help/1192884166182156)
- [Best practices for ads that click to message](https://www.facebook.com/business/help/269324800441478)
- [About maximizing number of leads using ads that click to message](https://www.facebook.com/business/help/575610661605746)

Formularios y metas de leads:
- [About instant form types](https://www.facebook.com/business/help/252352181957512)
- [Create a lead ad with instant form in Ads Manager](https://www.facebook.com/business/help/791294492679966)
- [About performance goals for lead ads](https://www.facebook.com/business/help/782657799338685)
- [Set up your CRM for qualified leads](https://www.facebook.com/business/help/279369167153556)

Conversions API:
- [Conversions API for Business Messaging (developers)](https://developers.facebook.com/docs/marketing-api/conversions-api/business-messaging)
- [About partner integrations for business messaging events](https://www.facebook.com/business/help/1050753706106190)
- [About Conversions API](https://www.facebook.com/business/help/2041148702652965)

Datos de salud y políticas de anuncios:
- [About data source categories](https://www.facebook.com/business/help/1402913027039332)
- [Understand data sharing restrictions based on data source categories](https://www.facebook.com/business/help/511197658391698)
- [About prohibited information](https://www.facebook.com/business/help/361948878201809)
- [About Meta's health and wellness advertising policy](https://www.facebook.com/business/help/2489235377779939)
- [About Meta's personal attributes advertising policy](https://www.facebook.com/business/help/2557868957763449)

Públicos personalizados y similares:
- [Create a lookalike audience](https://www.facebook.com/business/help/465262276878947)
- [About engagement custom audiences](https://www.facebook.com/business/help/1090330204367211)
- [Create an Instagram account custom audience](https://www.facebook.com/business/help/214981095688584)
- [Create a customer list custom audience](https://www.facebook.com/business/help/170456843145568)

**[oficial Meta 🔎]: solo snippet del buscador; el proxy bloqueó la página**
- [WhatsApp pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing)
- [Pricing updates July 2025](https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing/)
- [Non-template messages pricing updates](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)
- [WhatsApp changelog](https://developers.facebook.com/documentation/business-messaging/whatsapp/changelog)
- [CTWA welcome message sequences](https://developers.facebook.com/documentation/business-messaging/whatsapp/ctwa/welcome-message-sequences)

**[oficial Meta ⏳]**
- [Meta Andromeda, Engineering at Meta, 2024-12-02](https://engineering.fb.com/2024/12/02/production-engineering/meta-andromeda-advantage-automation-next-gen-personalized-ads-retrieval-engine/)

**[oficial Meta, datos públicos]**
- Biblioteca de Anuncios vía `ads_library_search`, 30-sep-2026. Búsqueda "software dental" en Bolivia: 10 activos. Ejemplo: [Dentalink, "Dicta tus fichas con IA"](https://www.facebook.com/ads/library/?id=1059477226705411).

**[secundaria] (🔎 salvo indicación)**

Benchmarks:
- [AdAmigo, CPM/CPC by country 2026](https://www.adamigo.ai/blog/meta-ads-cpm-cpc-benchmarks-by-country-2026)
- [AdAmigo, by objective 2026](https://www.adamigo.ai/blog/meta-ads-benchmarks-2026-by-objective-and-placement)
- [WordStream 2025](https://www.wordstream.com/blog/facebook-ads-benchmarks-2025)
- [WordStream 2026](https://www.wordstream.com/blog/facebook-ads-benchmarks-2026)
- [rikcarez, Bolivia 2025](https://rikcarez.com/costo-facebook-ads-bolivia-guia-completa/)
- [Basic Marketing, Bolivia](https://basicmarketing.com.bo/agencia-publicidad/costos-publicitarios-en-bolivia/)
- [Consolidación Digital, Colombia 2026](https://www.consolidaciondigital.com/blog/performance-marketing/cuanto-cuesta-meta-ads-colombia)
- [getkanal, CTWA 2026](https://getkanal.com/blog/click-to-whatsapp-ads-benchmarks-2026)
- [aimers.io](https://aimers.io/blog/facebook-ads-cost)
- [growthspree](https://www.growthspreeofficial.com/blogs/meta-ads-benchmarks-2026-b2b-saas-b2b-cpm-cpc-cpl-vertical)
- [bloggingkart](https://bloggingkart.com/facebook-high-cpm-countries-list/)
- [thesrzone](https://www.thesrzone.com/2024/03/facebook-cpm-rates-by-country.html)

Población y mercado:
- [DataReportal, Digital 2026: Bolivia](https://datareportal.com/reports/digital-2026-bolivia)
- [DataReportal, Digital 2025: Bolivia](https://datareportal.com/reports/digital-2025-bolivia)
- [El Deber, Censo 2024](https://eldeber.com.bo/santa-cruz/censo-2024-cinco-municipios-crucenos-concentran-la-mayor-cantidad-poblacional-del-departamento/)
- [UNFPA, Censo 2024](https://bolivia.unfpa.org/es/news/bolivia-tiene-11365333-habitantes-seg%C3%BAn-el-censo-2024-ine-socializa-los-datos-en-la-paz-santa)
- [Dental Tribune ⏳](https://la.dental-tribune.com/news/la-odontologia-en-bolivia-2/)

Segmentación y Advantage+:
- [Jon Loomer, targeting 2026](https://www.jonloomer.com/meta-ads-targeting-2026/)
- [Jon Loomer, lookalikes expand](https://www.jonloomer.com/lookalike-audiences-expand-performance-goals/)
- [Jon Loomer, Advantage+ sales/app/leads](https://www.jonloomer.com/advantage-plus-sales-app-leads-campaigns/)
- [Jon Loomer, Andromeda](https://www.jonloomer.com/meta-andromeda-creative-diversification/)
- [Segwise, Andromeda 2026](https://segwise.ai/blog/meta-andromeda-update-creative-strategy-2026)
- [Search Engine Land, health restrictions](https://searchengineland.com/meta-ads-restrictions-health-wellness-campaigns-453094)
- [Skyline Social, business owners](https://www.skylinesocial.com/target-business-owners-facebook-ads/)
- [contactlevel, job titles 2026](https://www.contactlevel.com/playbooks/meta-job-title-targeting)

**[repo] onia-hermes, leído el 30-sep-2026**
- `hermes-content/docs/handoff/meta-ads-prospeccion.md`
- `hermes-content/docs/ONIA_ADS_CAMPANA_1_LISTA_20260813.md`
- `hermes-content/docs/ONIA_PLAN_CONTENIDO_Y_ADS_20260820.md`
- `hermes-content/docs/ONIA_CLIENTE_IDEAL.md`
- `web-factory/docs/ADS_PATTERN_BANK_2026.md`
- `hermes-content/docs/ONIA_PAUTA_COMPETENCIA_20260815.md`
- `hermes-content/deploy/vps-ops/bot/chatwoot-adapter.mjs`
- `COORDINATION_MANIFEST.md`
- `hermes-content/carousels/out/ads/` (piezas miradas)
- `CLAUDE.md`
