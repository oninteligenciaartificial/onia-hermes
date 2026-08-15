# Onia — Documento de decisión: el SaaS, la consultoría y los próximos 90 días

**Fecha:** 2026-08-13 · **Para:** Sergio
**Estado del negocio al escribirlo:** 0 clientes, 0 pagos acreditados, 0 mensajes despachados.

> Producido por un análisis de 17 agentes con verificación adversarial (cada afirmación
> fuerte pasó por un refutador antes de entrar acá). Lo que no tiene fuente está marcado
> como tal. Un primer intento salió vacío por un error de esquemas y se descartó entero.

---

## 1. "Los SaaS están muriendo"

**No hay fuente verificada para esa tesis y no se cita como hecho.** Pero aunque fuera
cierta, no aplica a Onia — y no porque Onia sea especial, sino porque **Onia todavía no
entró a ese mercado**. La tesis habla de SaaS horizontales en inglés, con features de
commodity, cobrando por asiento, a los que un modelo de IA les come el diferencial.

Lo que **sí** es verificable es que en Bolivia hoy hay gente cobrando por software de
gestión, con precios públicos:

| Producto | Precio | Fuente |
|---|---|---|
| Growing Cloud | Bs 100/mes (hasta 700 facturas) | growingcloud.net |
| Sintic MonoBusiness 2.0 | Bs 150/mes | sinticbolivia.net |
| Codex (Sinergya) | Bs 1.000/año | sinergyasoftware.com |
| CUCU (Odoo) | Bs 1.080/mes + Bs 4.500 setup | cucu.com.bo |

**El mercado paga.** El problema de Onia no es que el SaaS esté muriendo: es que **Onia
todavía no cobró un peso y tiene el aviso de pago caído en producción**.

**Consecuencia directa sobre el precio:** todos esos competidores **emiten factura** y
Onia no. Cualquier plan de Onia **debajo de Bs 200 compite contra eso sin diferencia
visible y pierde**. El precio de entrada tiene que estar arriba de Bs 200 y justificarse
con **operación** (agenda, recall, cobranza, caja), **nunca con emisión**.

---

## 2. Pros y contras — los contras primero

### Contras (verificados)

| Contra | Qué tan grave |
|---|---|
| El correo que avisa un pago **falla en producción**: `535 5.7.8 Authentication failed` contra `smtp-relay.brevo.com`. Un cliente puede pagar hoy y nadie se entera nunca. | Mata la plata. El más barato de arreglar. |
| El cobro no es self-service: el cliente sube foto del comprobante y un superadmin aprueba a mano. `subscription_payments` = **0 filas**. | Operable a mano, pero hay que asumirlo. |
| La función estrella (agentes que proponen y vos aprobás) **no puede enviar nada**. Doble candado: el cupo lee el booleano viejo `whatsappAddon` (ninguna org lo tiene) y las credenciales de Meta son el literal `SIN_CONFIGURAR`. En prod: **90 corridas, 5 aprobaciones pendientes, 0 despachos**. | Mata la demo justo en el botón "Aprobar". |
| **13 de 16 capacidades** no las lee ninguna línea de código. Prender el módulo no cambia nada. Solo `module.agents` está punta a punta. | Prohibido poner add-ons como líneas de precio. |
| La pantalla que otorga capacidades **no está en producción**: vive en `feat/importar-catalogo-dropzone`, 22 commits por delante de master. | Construido detrás de una rama vale cero. |
| SIAT apagado por partida doble (`SIAT_EMISSION` y `SIAT_SERVICE_URL` vacíos), `onia_invoicing_invoices` = 0 filas. **No podemos emitir una factura real.** | El único que no se resuelve con código. |
| **Estética y veterinaria son la app dental con dos rótulos cambiados.** El modelo `Patient` pide CI, género M/F/Otro y tipo de sangre ABO/Rh humano; no existe especie, dueño ni raza. Peor: `Invoice.patientId` es obligatorio y la factura toma nombre y NIT **del paciente** — una veterinaria **no puede facturarle al dueño** sin cargar al dueño como paciente. | Venderlas como "sistema para X" es mentir. |
| Ganadería es cascarón: nav de comercio por referencia, cero entidades de hacienda o sanidad, y el core la marca `pending_adoption`. | Sacarla del registro. |
| `/help` le dice "odontograma" a **todos** los rubros. Una ferretería lee eso en su Ayuda. | Ridículo y barato. |
| El drip del trial nunca envió un correo (`onia_trial_drip_sends` = 0). | El trial es un cronómetro sin vendedor. |
| Las organizaciones en producción son **todas** demos y QA internas. | Todo lo demás es hipótesis. |

### Pros (verificados)

| Pro | Por qué importa |
|---|---|
| **Dental es producto propio de verdad**: 8 páginas bajo `/patients` (ficha, odontograma, recetas), citas, agenda, tratamientos, facturación. Con datos vivos en prod. | Se demuestra en vivo sin disculpas. |
| **Comercio está completo** para un negocio de barrio: catálogo, inventario, caja, fiados (CxC/CxP), kardex al promedio ponderado. | Segundo rubro real. |
| **El motor fiscal/laboral boliviano con la norma citada en el código**: IVA 13% / IT 3% (Ley 843), vencimiento por último dígito de NIT (D.S. 25619), kardex promedio ponderado (D.S. 24051), bono de antigüedad (DS 21060 art. 60), TCO del BCB (RND 102600000026). | Un SaaS extranjero no lo hace; un dev local lo hace mal. **Es el único candidato a foso.** |
| El despachador tiene idempotencia a nivel base (`approvalId` UNIQUE, transiciones condicionales, auditoría de quién aprobó y qué texto salió). | No se copia en un fin de semana — pero es invisible, no vende. |
| Registro y login funcionan y no dependen del correo. | El alta se puede ofrecer hoy. |

**Veredicto honesto: el motor es real, el catálogo es humo.** De 7 rubros que se venden,
2 son producto. De 16 capacidades, 3 hacen algo. Un producto real de dos rubros envuelto
en un catálogo de siete — y el envoltorio es el riesgo: en un mercado chico, el primer
veterinario que descubra que no puede facturarle al dueño quema a todos los veterinarios
de Santa Cruz.

---

## 3. La propuesta de valor, en las palabras del dueño

> **"Sabés quién te debe, quién no vino, y quién te va a comprar de nuevo — sin abrir un
> Excel ni buscar en WhatsApp. Y el sistema te lo escribe; vos solo apretás Enviar."**

Sin "IA", sin "plataforma", sin "transformación digital". El dueño boliviano no compra
software: compra **dejar de perseguir gente de memoria**.

El segundo párrafo, el que cierra: **habla boliviano.** Sabe que tu NIT vence el día 13,
calcula IVA 13% e IT 3%, mueve el inventario al promedio ponderado, calcula el bono de
antigüedad. No hay que explicarle Bolivia.

---

## 4. El modelo: consultoría que lleva a suscripción, sin vender horas

**La regla no se toca: Onia vende software, nunca horas.** Ni desarrollo a comisión, ni
sociedad por promesas. Sociedad solo por earn-in con hitos medibles.

1. **Diagnóstico gratis, 40 minutos, en el local del cliente.** No es consultoría: es la
   demo con SUS datos. Se cargan en vivo 10 pacientes o productos reales. El entregable
   es que el cliente vea su propio negocio adentro.
2. **Puesta en marcha a precio fijo, por el sistema andando** — nunca por hora ni por día.
   Si tarda el doble, es problema de Onia. Eso es literalmente lo que separa "vender
   software" de "vender horas". El mercado ya paga esto (CUCU: Bs 2.800–4.500 de inicio).
3. **Mensual sin fin.** El setup existe para que el mensual arranque bien, no para ganar
   plata.

### Por qué la consultoría es valiosa AHORA — y dónde es trampa

**Como descubrimiento: es lo más valioso que se puede hacer hoy.** Con cero clientes,
todo lo que creemos del producto es hipótesis. Prueba: el bug de que una veterinaria no
puede facturarle al dueño se detecta en **10 minutos** sentado con una veterinaria; se
descubrió leyendo código *después* de haber puesto el rubro a la venta.

**Como fuente de ingresos: es la trampa.** El día que se cobra por entender el problema,
el incentivo se invierte: conviene que cada cliente sea distinto. Ahí el producto se
fragmenta, aparece la rama por cliente, y en seis meses Onia es una agencia con un SaaS
de adorno.

**Riesgo específico con 0 clientes:** la consultoría paga rápido y da sensación de avance.
Si el primer ingreso de Onia viene de consultoría, **el SaaS nunca se termina**, porque la
consultoría siempre es más urgente. Acá tiene que ser el anzuelo gratis que termina en
suscripción, no el plato principal.

---

## 5. Personalización: dónde se traza la línea

**Sí se moldea** (dato y configuración, sin deploy): catálogo, tratamientos, precios,
usuarios, roles, marca y logo · los textos de las plantillas que los agentes proponen ·
las reglas (a los cuántos días se recuerda, desde qué monto se cobra, qué exige
aprobación) · qué capacidades tiene la organización.

**No se moldea nunca:** pantallas para un solo cliente · ramas de código por cliente ·
integraciones a medida con el sistema viejo de alguien · reportes que sólo él va a mirar.

**Regla de escalamiento:** si **dos** clientes distintos piden lo mismo, deja de ser
personalización y entra al producto para todos. Si lo pide **uno**, es no.

---

## 6. Los próximos 90 días

### La apuesta, en una línea
**Odontólogos de Santa Cruz, vendidos a mano por Sergio, cobrando la operación
(agenda + recall + cobranza), NO la factura.**

**Por qué dental y no comercio**, aunque comercio tenga los disparadores fiscales: los
tres disparadores vivos —el 1-oct-2026 para los **27.973 contribuyentes** de los grupos
9-12 · la factura en línea para trasladar mercancía por puntos de control desde el
4-may-2026 (RND 102600000006) · la clausura de 6 a 48 días del art. 164 de la Ley 2492—
**se resuelven todos emitiendo factura, y Onia no puede emitir.** Correr esa carrera sin
homologación es entrar tarde, más caro y sin producto. Dental compra por otra razón: la
agenda vacía y los saldos sin cobrar. Y es el único rubro con producto profundo.

### Movida 1 · semanas 1-2 — que el producto se pueda cobrar
No es feature nueva. Es destrabar lo construido:
1. Arreglar la credencial SMTP, **o** desviar el aviso de pago a Telegram por n8n (ya corre). ~1 hora.
2. Desplegar los 22 commits de `feat/importar-catalogo-dropzone` (incluye la pantalla de capacidades).
3. **Agregar un canal "manual" al despachador**: aprobar genera un link `wa.me` + el texto
   copiable. Convierte la función estrella de "no funciona" a "funciona con tu dedo", sin
   depender de Meta.
4. Mover el cupo de WhatsApp del booleano suelto al **plan**.
5. Limpiar la oferta: sacar ganadería del registro; bajar estética y veterinaria a
   "agenda + citas + facturación a personas"; sacar "odontograma" de `/help`.

**Métrica:** una persona que no es Sergio se registra desde cero, paga por QR, el aviso
llega en menos de 5 minutos, y un agente aprobado produce un mensaje enviable.

### Movida 2 · semanas 3-8 — UN cliente pagando
**Métrica:** 1 clínica con pago acreditado **y usándolo tres semanas seguidas** (login ≥3
días/semana, ≥20 citas cargadas). "Leads interesados" no cuenta. "Le encantó la demo" no cuenta.

### Movida 3 · semanas 9-13 — repetirlo sin construir nada
**Métrica:** 5 pagando, **cero features construidas para cerrarlas**, y la **renovación del
mes 2** del primero. Esa renovación es el único dato que prueba que hay producto. Si para
cerrar la clínica 3 hubo que programar algo, la apuesta está mal y se dice en la semana 10.

---

## 7. Qué nos frena

| Freno | Depende de | Realidad |
|---|---|---|
| **Homologación SIAT con NIT** | Sergio (legalmente Leslie) | El único que no se arregla con código. Bloquea el mercado de los 27.973. |
| **Credenciales de Meta (WABA)**, hoy `SIN_CONFIGURAR` | Sergio | El canal manual lo esquiva; no lo elimina. |
| **Credencial SMTP** | Sergio | 1 hora. Lo más caro que hay: sin esto un pago entra y se pierde. |
| **22 commits sin desplegar** | equipo | Nada afuera. |
| **Cero clientes = cero evidencia** | nadie con trabajo | El freno de fondo. Todo lo demás es hipótesis hasta que renueve el primero. |
| **Sergio es menor de edad** — todo acto legal va por Leslie | estructural | No es obstáculo si se planifica; es desastre si aparece el día de firmar. |

**Dos avisos de honestidad:**
- La homologación de productos contra el RNC (RND 102500000018, prorrogada al **31-jul-2026**
  por la RND 102600000017) **ya venció**. No se verificó si hubo otra prórroga. Antes de
  mencionárselo a un cliente, verificarlo.
- El dato de devaluación del USD **quedó sin fuente verificada en este análisis**. No usarlo
  en una propuesta hasta contrastarlo.

---

## 8. Lo que NO vamos a hacer

1. **No encender un rubro más** hasta que haya un cliente pagando.
2. **No mencionar facturación electrónica en la venta.** No podemos emitir; y decir "la ley
   te obliga a comprarme" es falso — el Portal Web del SIN es gratis.
3. **No vender veterinaria, estética ni ganadería como producto propio.**
4. **No construir la pasarela todavía.** Cobrar a mano con 5 clientes es media hora por
   semana. Automatizarlo con cero clientes es procrastinar programando.
5. **No construir más SIAT** hasta tener el NIT homologado. Ni una línea.
6. **No desarrollo a medida, ni a comisión, ni sociedad por promesas.**
7. **No pauta, no marca, no contenido masivo.**
8. **No construir features para cerrar una venta.** Si no compra lo que existe, no es el
   cliente o no es el producto.
9. **No abrir el segundo rubro** hasta que el primero renueve el mes 2.

---

**En una línea:** dejamos de construir, destrabamos lo construido, y salimos a vender
dental a mano hasta que uno pague dos meses seguidos.

Ver también: `ONIA_REUNION_BCP_PREP_20260812.md` · `ONIA_MODULO_INMOBILIARIO_SPEC_20260808.md`
· `PRICING_RATIONALE_INTERNO.md`.
