# SendyPro — qué es, y en qué NO es lo que hace Onia

**Pregunta que contesta este doc:** Sergio dijo *"es literal lo que queremos hacer, mira
cómo funciona"*. ¿Lo es?

**Respuesta corta: no del todo.** SendyPro es lo que quiere ser **un add-on nuestro** (el
chatbot de WhatsApp), ejecutado mejor y cobrado ~10x más barato. No es lo que es Onia.
El detalle, con evidencia, abajo.

> **Cómo se leyó.** Todo lo de acá se midió o se leyó el **2026-08-20**:
> - La web, con nuestro instrumento: `web-factory/harvester/vision/extract_web_anatomy.mjs`
>   → salida en `web-factory/data/references/design-sources/anatomia/sendypro-com.md`.
> - El sitio público `sendypro.com` y `sendypro.com/terms-of-service`, renderizados.
> - La pantalla de registro `app.sendypro.com/signup`, **abierta y leída, sin crear cuenta**.
> - El bundle público de la app, `app.sendypro.com/static/js/main.a86ac8c0.js` (6,8 MB),
>   que es JavaScript servido abiertamente: de ahí salen rutas, endpoints, textos de
>   producto y una segunda lista de precios.
>
> Este doc **complementa** `ONIA_PSICOLOGIA_PRECIOS_COMPETENCIA.md` (que ya cubre Hostinger,
> Wix, Squarespace, Shopify, Framer, Webflow, Lovable y Lety.ai). No lo duplica: SendyPro no
> estaba ahí y es el competidor más cercano al add-on de chatbot.
> Los precios de Onia mandan desde el código: `onia-platform/lib/subscription-plans.ts`
> (planes) y `lib/pricing.ts` (add-ons). Acá se citan, no se definen.

---

## 1. Qué es SendyPro, en tres líneas

Una bandeja de entrada multiagente de WhatsApp **multi-empresa**, con CRM kanban,
campañas masivas y un constructor de flujos, encima de la cual pusieron una capa de IA que
contesta por texto y por audio y a la que llaman **"tu vendedor con IA"**.

Se vende **self-serve, en dólares, sin tarjeta, desde $19/mes**, a vendedores de LATAM que
cierran ventas por WhatsApp — con el producto claramente afinado para el **e-commerce
peruano de contraentrega** (Yape, Plin, "Lima y provincias").

No es un sistema de gestión: **no tiene agenda, ni inventario, ni facturación, ni
contabilidad, ni planillas.** Es el canal, no el sistema de registro.

### De dónde viene el código (inferencia, con huellas)

El bundle trae rutas y textos que **no son suyos**: `/financeiro`, `/queues`,
`/quick-messages`, `/todolist`, `/announcements`, `/helps`, `/tickets`, `/companies`,
`/queue-integration`, `/campaign/:campaignId/report`. Y adentro conviven traducciones en
portugués de Brasil sin traducir:

```
invoices: { title:"Faturas", paid:"Pago", open:"Em Aberto", dueDate:"Data Venc." }
moment.locale("pt-br")
"Sua licença foi renovada até ..."
```

Ese conjunto exacto de rutas + el pt-BR es la huella de la familia **Whaticket-SaaS**
(los multi-tenant brasileños de tickets de WhatsApp). Conclusión razonable:
**SendyPro no construyó la base — la adoptó y le puso encima la capa de IA, el modo fácil
y el diseño.** No pude ver la licencia, así que esto es una inferencia por huellas, no una
confesión suya (§7).

**Y eso, para nosotros, es la noticia buena, no la mala:** su ventaja no es haber escrito
un inbox de WhatsApp. Es la capa de arriba. Esa capa se puede estudiar sin envidiarle el
motor.

---

## 2. Cómo funciona

### 2.1 El primer minuto (leído, sin registrarse)

`app.sendypro.com/signup` pide exactamente cuatro cosas: **nombre, correo, teléfono
(prellenado en `Perú +51`), contraseña**, más el check de términos. Debajo del botón, la
única promesa: **"Sin tarjeta de crédito · Configuración guiada"**. El título de la
pantalla es *"Crea tu cuenta gratis"* y el subtítulo, *"Configura tu vendedor con IA en
menos de 10 minutos."*

Paso 2 es un **código de verificación al correo**. Después:

1. **Conectar un WhatsApp.** Dos caminos, y el producto los distingue:
   - **Meta Cloud API** — marcada *"Recomendado. Número verificado por Meta. Plantillas
     aprobadas y envíos masivos sin riesgo de bloqueo."* Tienen implementado el
     **Embedded Signup de Meta** (el bundle escucha `WA_EMBEDDED_SIGNUP` desde
     `facebook.com`).
   - **Baileys** — *"WhatsApp Business: conecta tu número escaneando un QR, como WhatsApp
     Web."* Esto es la conexión **no oficial**. Es lo que el sitio vende como *"Bonus:
     WhatsApp Business gratis adicional"*.
2. **"Crear vendedor con IA"** — botón literal del producto.
3. **Modo Fácil**: un asistente por pasos con plantillas de flujo, y una pantalla de
   revisión final: *"Revisa antes de encenderla. Verde significa listo. Si algo falta, toca
   ese paso arriba para corregirlo."*

### 2.2 La unidad de trabajo

**El `company` (la empresa-inquilino), y dentro de ella el "vendedor IA" atado a una
conexión de WhatsApp.** Lo que se mide y se cobra no son asientos ni contactos: son
**chats por día** (150/día o ilimitado). Usuarios, agentes, flujos y campañas son
ilimitados en los dos planes — es decir, **el único techo del producto es el volumen de
conversación**.

El menú lateral completo, tal como está en el código:

`Inicio` · `Super Chat` · `Agente IA` · `Agente IA 2.0` · `Kanban` · `Productos` ·
`Pedidos` · `Etiquetas` · `Grupos` · `Comunidades` · `Campañas` · `Automatizaciones` ·
`Estadísticas` · `Difusiones` · `Activadores` · `Flujos` · `Plantillas API` ·
`Rastreador API` · `Lista Negra Global` · `Usuarios` · `Reseller` · `Aula Virtual`

Tres cosas que valen más que el resto de la lista:

- **`Pagos` / OCR de comprobantes.** Reconoce con IA la captura del pago y actualiza el
  pedido solo. Los bancos y billeteras cableados son peruanos: `Yape`, `Plin`, `BIM`,
  `Agora`, `BBVA Empresas`, `Global66`. La lista de monedas soportadas **ya incluye `BOB`**.
- **El bucle de corrección de la IA.** Cuando el dueño corrige a la IA, el producto
  responde: *"¡Listo! Tu vendedora ya aprendió. Desde ahora atiende así"* — y hay un botón
  **Deshacer**. Es human-in-the-loop convertido en interfaz, no en configuración.
- **`Reseller`.** La ruta existe y está gateada por
  `GET /authorized-resellers/check-my-authorization`. Y hay **"Plantillas Modo Fácil:
  marca flujos existentes como plantillas para que tus clientes los usen en el wizard"**.
  O sea: la agencia/revendedor es un concepto de primera clase, aunque no lo publiciten.
  El registro además acepta **código de referido** (`/free/:referralCode`, `?ref=`).

### 2.3 El modelo de negocio

Suscripción mensual por empresa, en **USD**
(`Intl.NumberFormat('es-419', {currency:'USD'})`), con **período de prueba**
(`company.trialExpiration`, *"Su período de prueba termina en X días"*) y **sin tarjeta al
registrarse**.

El cobro **no es con tarjeta en línea**: el checkout termina en un botón *"Ya realicé los
pasos"* que deja la factura en `PENDING_REVIEW` hasta que alguien la marca `CONCLUIDA`
("Sua licença foi renovada até…"). Es decir, **transferencia / billetera + confirmación
manual**. Muy LATAM, y muy relevante para Bolivia.

Distribución: web propia + **app Android en Google Play** (`com.sendypro.app`) + tutoriales
en YouTube hechos por terceros que parecen afiliados (canal "Polo Marketing").

---

## 3. Precios — con fecha y fuente

**Leído el 2026-08-20 en `sendypro.com/#precios`, renderizado.** Están **públicos**, sin
formulario, sin "contáctanos".

| Plan | Precio | Techo | Incluye |
|---|---|---|---|
| **WhatsApp API** | **$19 USD/mes** | hasta **150 chats/día** | API oficial de Meta, IA por texto, audios con IA, flujos/CRM/campañas ilimitados, "bonus" WhatsApp Business por QR |
| **WhatsApp API ∞** ← *Más Popular* | **$39 USD/mes** | **chats ilimitados** | lo mismo + soporte prioritario + onboarding |

Su propio FAQ: *"El plan de $19 permite hasta 150 chats por día con la API oficial. El de
$39 es ilimitado. Lo demás (IA, audios, flujos, CRM) es idéntico."* Y: *"La IA y los audios
realistas están totalmente incluidos. Sin pagar extra. Sin pagar por mensaje."*

### ⚠️ Tienen DOS listas de precios vivas al mismo tiempo

Dentro del bundle de la app (`main.a86ac8c0.js`) hay **otra** página de precios, todavía
desplegada, con números distintos:

| Plan (versión in-app) | Precio | Descripción |
|---|---|---|
| **WhatsApp Business** | **$17** | "Conexión directa" (= Baileys, el QR) |
| **WhatsApp API ∞** | **$39** | "Sin límites" |

y en las viñetas de ese segundo plan quedó una línea fósil: **"Todo en API 250 +"** — un
plan llamado *API 250* que ya no aparece en ninguna parte.

O sea: **$17 vs $19 para el escalón de entrada, y un plan fantasma en la letra chica.**
Es exactamente la enfermedad que nuestro `CLAUDE.md` prohíbe (una sola fuente de verdad por
tema) y que a nosotros nos costó tener cuatro precios vivos del chatbot. Verlo en la
competencia confirma que la regla no es paranoia.

### Comparación de plata contra Onia (con el cuidado que hace falta)

Precios de Onia leídos del código el 2026-08-20 —
`lib/subscription-plans.ts` y `lib/pricing.ts`:

| | SendyPro | Onia |
|---|---|---|
| Entrada | **$19/mes** (todo el producto) | **Bs. 320/mes** plan Básico (o Bs. 89/semana) |
| Tope publicado | **$39/mes** | Bs. 2.900/mes plan Empresa |
| Chatbot de WhatsApp con IA | **incluido en los dos planes** | **add-on**: Bs. 1.500 instalación + **Bs. 1.490/mes** + Meta, con 500 conversaciones/mes incluidas |

Convertido con el tipo de cambio que usan nuestros propios docs (**USD 1 ≈ Bs. 11,37**,
`a verificar` — viene de la nota de devaluación 2026, no de una fuente primaria de hoy):
**$39 ≈ Bs. 443/mes**.

**El dato que importa:** un comerciante de Santa Cruz que googlea "chatbot de WhatsApp con
IA" puede comparar **Bs. ~443/mes por todo** contra **Bs. 1.490/mes + Bs. 1.500 de
instalación por nuestro add-on solo**. Esa brecha es real y hay que poder explicarla, no
esconderla. Nuestra propia justificación ya está escrita en `pricing.ts`: los Bs. 1.490 no
compran mensajes, compran **soporte humano** (el comentario del código dice que a Bs. 550
bastaban 5,5 h de soporte para perder plata). SendyPro, en cambio, no promete soporte
humano de implementación: promete "onboarding" en el plan de $39 y un **Aula Virtual**.

---

## 4. Parecidos y diferencias — en las dos direcciones

### En qué se parecen

| | Los dos hacen |
|---|---|
| Arquitectura | SaaS **multi-empresa** (tenant = `company`), en español, para pymes de LATAM |
| Corazón del pitch | un **agente de IA que atiende WhatsApp 24/7** y vende |
| Piezas comunes | CRM kanban, etiquetas, flujos visuales, campañas, plantillas, handoff a humano |
| Distribución | **registro self-serve sin vendedor y sin tarjeta** |
| Ambición de canal | los dos tienen la capa de **revendedor / subcuentas** en el plan (nosotros anotada en `ONIA_PSICOLOGIA_PRECIOS_COMPETENCIA.md` §4.2.6; ellos ya con ruta y endpoint) |
| Realidad de cobro | los dos viven donde la tarjeta no manda: ellos con confirmación manual, nosotros con ciclo semanal y QR Simple |

### En qué NO se parecen

| Tema | SendyPro | Onia | Quién queda mejor |
|---|---|---|---|
| **Qué vende** | el **canal**: bandeja de WhatsApp + IA | el **sistema de registro**: agenda, clientes, inventario, cobros, contabilidad, RRHH — y el chatbot como add-on | distinto producto, no hay ganador |
| **Agenda / citas / inventario / facturación** | **no existen** | 14 módulos con pantalla y tablas (`ONIA_CATALOGO_DE_VENTA.md` §4) | **Onia** |
| **Fiscal Bolivia (SIAT, IVA/IT/IUE)** | ni lo menciona | es una capacidad del core y una skill entera | **Onia** |
| **Rubros / vocabulario por industria** | uno solo, implícito: e-commerce COD peruano | 7 rubros declarados, 5 contratables, vocabulario por rubro | **Onia** |
| **Precio y forma de entrar** | $19–$39, sin tarjeta, en minutos | Bs. 320–2.900 + add-on de Bs. 1.490 con instalación | **SendyPro**, sin discusión |
| **Chats/día como única métrica** | sí, simple de entender y de vender | límites por pacientes/usuarios/emails que el cliente descubre **cuando le rebotan** | **SendyPro** |
| **OCR de comprobantes de pago** | producto vivo, multi-banco | no existe | **SendyPro** |
| **Grupos / comunidades / difusiones masivas** | módulo completo | no existe (ni debería, sin oficializar) | SendyPro, con asterisco |
| **Conexión no oficial (QR/Baileys)** | la vende como bonus | no la tenemos | **Onia** — es un riesgo, no una función |
| **App móvil nativa** | Android en Play Store | no hay | **SendyPro** |
| **Prueba social** | "500+ empresas", "4.9/5", "+340% ventas", testimonios sin apellido ni empresa verificable, "99.9% uptime" — **cero respaldo de terceros** | prohibido inventar (`CATALOGO` §7): cero clientes pagando y se dice | **Onia**, y es la diferencia que más vale |
| **Identidad de la empresa** | sin razón social, sin dirección, sin país; Cloudflare tapa el origen; contacto = un correo y un WhatsApp `+51` | SEPREC, matrícula, titular | **Onia** |
| **Calidad de la web** (medido, §6) | 2 pares de color reprueban AA (2,43:1 y 3,53:1), 16 de 34 objetivos táctiles < 44px, sin `prefers-reduced-motion`, sin canonical, sin datos estructurados | nuestro piso de web-factory es más alto | **Onia** |
| **Coherencia de precios** | dos escaleras vivas ($17/$19) y un plan fantasma | una sola fuente por tema, por regla dura | **Onia**, y por poco: nosotros tuvimos el mismo bug |

---

## 5. VEREDICTO

> **No, SendyPro no es "literal lo que queremos hacer". Es literal lo que quiere ser UNO de
> nuestros SKUs — el add-on de chatbot de WhatsApp — y lo cobra a la décima parte.**

Dónde se separa, en concreto:

1. **Categoría distinta.** SendyPro es un producto de **canal**. Onia es un producto de
   **gestión**. Ellos no tienen dónde guardar una cita, un tratamiento, un lote de
   inventario ni una factura; nosotros no tenemos difusiones masivas ni OCR de
   comprobantes. La intersección es **exactamente un SKU**, no el negocio.
2. **Cliente distinto.** Ellos venden al vendedor de e-commerce contraentrega de Lima.
   Nosotros al dueño de negocio **formal** de Santa Cruz, que tiene NIT y va a tener que
   facturar en línea. Un dentista no compra una bandeja de WhatsApp: compra una agenda.
3. **Precio incomparable a propósito.** Su $39 no incluye implementación ni soporte humano
   de puesta en marcha. Nuestros Bs. 1.490 sí, y el código explica por qué.

**Dónde Sergio tiene toda la razón, y es lo importante:** SendyPro es **la prueba viva más
cercana** de que este producto se vende en LATAM **self-serve, sin vendedor, sin tarjeta,
por menos de $40/mes**, y de que la IA que contesta con audios es un gancho que la gente
paga. Nosotros hoy tenemos cero clientes pagando y un add-on que exige Bs. 1.500 de entrada
antes de que nadie vea nada funcionando. Ellos ya resolvieron el "primer minuto"; nosotros
todavía no lo vendimos ni una vez.

**Y es una amenaza concreta:** su lista de monedas ya incluye **BOB**. Nada les impide
aparecer en Bolivia mañana.

---

## 6. Qué copiaríamos mañana, y qué no

### Copiar (en este orden)

1. **El bucle "tu vendedora ya aprendió" + Deshacer.** Es human-in-the-loop convertido en
   una sola interacción: el dueño corrige a la IA en el chat y el sistema confirma que
   aprendió, con deshacer. `CLAUDE.md` ya nos obliga a que los agentes propongan con
   aprobación humana — esto es cómo se ve esa regla cuando está bien hecha. Lo más barato y
   lo más valioso de la lista.
2. **La pantalla "revisa antes de encenderla".** *"Verde significa listo. Si algo falta,
   toca ese paso arriba."* Es el antídoto exacto contra nuestro pecado documentado de dar
   por terminado lo que está detrás de un flag apagado.
3. **Una sola métrica de techo, visible.** "150 chats/día" se entiende sin leer nada.
   Nuestros límites viven en `lib/plan-limits.ts` y el cliente los descubre cuando le
   rebota una acción — ya lo señala `ONIA_PSICOLOGIA_PRECIOS_COMPETENCIA.md` §4.2.1 como
   nuestro hueco más caro. SendyPro es el segundo testigo.
4. **Confirmación manual de pago (`PENDING_REVIEW → CONCLUIDA`).** Encaja con Bolivia mejor
   que cualquier pasarela: transferencia o QR, el cliente dice "ya pagué", nosotros
   confirmamos. Cuadra con lo ya decidido en `onia-pasarelas-pago-bolivia`.
5. **OCR de comprobantes** para el rubro comercio (QR Simple, transferencia). Bolivia tiene
   idéntico problema de confirmar pagos por captura. **Idea anotada, no compromiso**: no se
   promete hasta que exista y se haya mirado funcionando.

### No copiar

1. **La prueba social fabricada.** "500+ empresas", "4.9/5", "+340% ventas", testimonios sin
   nombre completo ni empresa comprobable. Está prohibido por `CATALOGO` §7 y por memoria.
   No es un detalle de estilo: es lo único que hoy nos distingue hacia arriba.
2. **Baileys / conexión por QR.** Vender la conexión no oficial como "bonus" traslada al
   cliente el riesgo de que Meta le baneé el número — su propio código ya contempla estados
   `BANNED`, `FLAGGED`, `RATE_LIMITED`. Si eso pasa con un cliente nuestro, el que queda mal
   es Onia.
3. **"Chats ilimitados" / "sin pagar por mensaje".** El **1-oct-2026 Meta termina la ventana
   gratuita de 24 h** y empieza a facturar también las respuestas (ya está escrito como
   alerta dentro de `pricing.ts`). Prometer ilimitado sobre un costo variable que sube es
   firmar un pasivo abierto. Nuestro modelo de 500 conversaciones + Meta al costo es más
   feo de vender y más honesto de sostener.
4. **Dos escaleras de precio vivas.** Lo que les encontramos ($17 vs $19, plan fantasma
   "API 250") es el mismo bug que a nosotros nos costó una regla dura. No se copia un bug
   porque el que lo tiene venda más.
5. **La ejecución visual de la landing.** Medida: 601 KB de imágenes sobre 710 KB totales,
   `1,2 KB` de JS (es HTML estático a mano), contraste blanco-sobre-cian **2,43:1** y
   blanco-sobre-rosa **3,53:1** — los dos reprueban AA —, 16 de 34 objetivos táctiles bajo
   44px, sin `prefers-reduced-motion` (17 elementos siguen animando con la preferencia
   puesta), sin canonical y sin datos estructurados. Vende igual, pero no es nuestro piso.

---

## 7. Lo que NO pude verificar

- **Si son realmente "Meta Business Partner".** El directorio oficial de partners de Meta
  exige inicio de sesión. La afirmación es de ellos, no comprobada.
- **Quién es SendyPro.** No hay razón social, ni país, ni dirección en la web ni en los
  términos ("la jurisdicción donde opera SendyPro", sin nombrarla). Cloudflare oculta el
  origen. **Perú es una inferencia fuerte**, por: teléfono prellenado `+51`,
  `wa.me/51900063575` en el código, Yape/Plin/BIM/Agora/BBVA Empresas/Global66,
  "Envíos en Lima y provincias", y `money:"S/"` en las traducciones.
- **Cuántos días dura la prueba gratis.** Existe (`company.trialExpiration`), el número lo
  pone el backend y no es visible sin cuenta.
- **Quién paga las conversaciones de Meta.** Su FAQ dice "sin pagar por mensaje" refiriéndose
  a *su* IA, y no menciona en ningún lado la tarifa de Meta. No se puede saber si la
  absorben, si va a la WABA del cliente, o si el plan de $19 la incluye.
- **Instalaciones y calificación en Google Play.** La ficha se renderiza con JS y el conteo
  no venía en el HTML descargado.
- **Reseñas de terceros: no encontré ninguna.** Ni G2, ni Capterra, ni Trustpilot, ni prensa.
  Lo único que existe fuera de su web son tutoriales de YouTube que parecen de afiliados
  ("Polo Marketing", "Registro Sendy Pro"). **El "4.9/5" del sitio no tiene contraparte
  externa.**
- **La licencia del código base.** Las huellas (`/financeiro`, `Faturas`, `moment.locale
  ("pt-br")`, el set de rutas) muestran **linaje** Whaticket-SaaS, no si es un fork
  licenciado, comprado o pirateado.
- **Todo lo que está detrás del login**: qué tan buena es la IA de verdad, cómo suenan los
  audios, los términos del programa Reseller, los límites reales, `Agente IA 2.0` vs
  `Agente IA`. **No se creó cuenta, por regla.**
- **El tipo de cambio USD→BOB usado en §3** viene de nuestros propios documentos
  (≈ 11,37), no de una fuente primaria consultada hoy. `a verificar`.

---

*Fuentes externas, todas leídas el 2026-08-20:* `sendypro.com`, `sendypro.com/#precios`,
`sendypro.com/terms-of-service`, `app.sendypro.com/signup` (renderizada, sin registro),
`app.sendypro.com/static/js/main.a86ac8c0.js`,
`play.google.com/store/apps/details?id=com.sendypro.app`.
*Medición propia:* `web-factory/data/references/design-sources/anatomia/sendypro-com.md`
(contrato de las 15 capas en `web-factory/docs/ANATOMIA_DE_UNA_WEB.md`).
*Fuentes internas:* `onia-platform/lib/subscription-plans.ts`, `onia-platform/lib/pricing.ts`,
`hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`,
`hermes-content/docs/ONIA_PSICOLOGIA_PRECIOS_COMPETENCIA.md`.
