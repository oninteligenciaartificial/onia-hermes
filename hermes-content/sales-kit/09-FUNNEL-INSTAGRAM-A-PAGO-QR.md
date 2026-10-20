# 09 · Funnel de Instagram: del post o anuncio al pago por QR del BCP

> Origen: orden de Sergio Urcullo del 16-oct (punto 3 de `docs/cola/loop/hermes-jefa.md`). Hilo Ventas y pauta.
> **Nada de esto se publica, se envía ni se gasta sin su OK escrito.** Es el mapa y los textos listos para que él los use.
> **Los workshops y consultorías pagas los arma el hilo «Marca, comunidad y workshops».** Acá solo se enlazan (§4): ni precio, ni temario, ni fechas se duplican.

## 0. La cuenta que da el límite de tiempo (léala primero)

Quedan **15 días** (16 → 31 oct). La prueba gratis dura **14 días**. Quien empiece una prueba hoy decide después del 30. Entonces:

- **Con prueba primero, el pago llega tarde.** Para que entre plata antes del 31, el pago tiene que ocurrir **al terminar la demo o el workshop**, no al terminar la prueba.
- **Camino más corto a la plata, en orden:** (1) los 6 contactos tibios de `07-PREPAGO-LEADS-Y-PROSPECTOS.md`; (2) workshops y consultorías pagas del hilo de Marca (ticket bajo, se vende a la audiencia de Sergio Urcullo); (3) Instagram → demo → plan anual. El (3) es el más lento: una persona fría que ve un post, escribe, agenda, ve la demo y paga un año a alguien sin clientes ni testimonios. **No se debe prometer que el funnel por sí solo llega a la meta;** sí sirve para llenar la agenda de demos y los workshops.
- Un plan Básico anual ya cubre la meta de caja con **una sola venta**; un workshop necesita varias. Por eso la demo con prepago no se abandona para vender solo talleres.

## 1. El mapa (una pantalla)

```
POST / REEL / HISTORIA (cuenta de Sergio Urcullo)
        │  llamado: «escríbame CLÍNICA por mensaje directo»  (a mano, sin automatizar)
        ▼
MENSAJE DIRECTO (Sergio Urcullo contesta, de usted)  ── 3 preguntas ──┐
        │                                                          │
   dueño de clínica, 2-6 profesionales            quiere aprender / es colega
        │                                                          │
        ▼                                                          ▼
LLAMADA DE 20 MIN (sergiourcullo.vercel.app/llamada)     WORKSHOP o CONSULTORÍA (hilo de Marca, §4)
        │  muestra su agenda en la demo                            │
        ▼                                                          │
OFERTA: prueba de 14 días  ó  plan anual (10 meses por 12)         │
        │                                                          │
        └──────────────► PAGO POR QR DEL BCP ◄─────────────────────┘
                         comprobante por WhatsApp o en /checkout → Sergio Urcullo aprueba → plan activo
```

**Cuántos pasos:** el cliente da 5 (ver, escribir, contestar 3 preguntas, agendar, pagar). Se sacó el botón de formulario y la página intermedia: ahí se pierde gente (regla «Simple»).

## 2. Qué está listo y qué no (verificado en los archivos, 16-oct)

| Pieza | Estado | Fuente |
|---|---|---|
| Enlace en la biografía | ✅ `sergiourcullo.vercel.app` y `/llamada` lleva a `cal.com/sergiourcullo/20min` | `ONIA_ADQUISICION_Y_PAUTA.md` §5.6 |
| Pago por QR del BCP + comprobante + aprobación en `/admin/payments` | 🟡 construido; **cobro de punta a punta sin probar, 0 pagos reales**. Lo prueba el carril Plataforma | catálogo §3 |
| El QR muestra un nombre de persona, no «OniaAgency» | 🟡 avisarlo antes del pago (mensaje 4.4) | catálogo §6 |
| Devolución del prepago | ✅ **decidido 16-oct: no hay.** No se promete; se avisa antes del QR | `07` §0 |
| Cuenta demo para la llamada | ⬜ la hace Plataforma. Sin ella, la llamada dice «20 minutos para ver si le sirve» y no promete «clínica de ejemplo» | `ONIA_ADQUISICION_Y_PAUTA.md` §5.6 punto 4 |
| Comentar una palabra → mensaje automático | ❌ **no usar.** Meta rechazó 2 veces ese mecanismo. Se pide **escribir por mensaje directo**, sin automatización | CLAUDE.md, «Qué se publica sin preguntar» |
| Anuncio pago | ❌ la cuenta publicitaria no tiene método de pago ni Instagram vinculado. Requiere OK de gasto | `ONIA_ADQUISICION_Y_PAUTA.md` §5.9 |

## 3. Los cinco pasos, con el texto

### 3.1 Atraer: tres piezas por semana, ninguna promete lo que el producto no hace

Formatos que sostienen más días en la competencia (ver `research/competencia/anuncios/BIBLIOTECA-REPASO-16OCT.md`): una persona a cámara, una sola idea, final con un solo llamado.

| Pieza | Gancho (voseo: es la cuenta personal) | Llamado final |
|---|---|---|
| Reel selfie 25 s | «Lo primero que mira una clínica cada mañana» (guion F1 de `FORMATOS-QUE-SOSTIENEN.md`) | «Si tenés clínica y querés verlo con tu agenda, escribime CLÍNICA por mensaje.» |
| Reel «No es X, es Z» 40 s | «No es conseguir más pacientes. Es saber hoy quién de mañana no confirmó.» (F3) | igual |
| Historia con caja de preguntas | «¿Cuántas citas por semana se le caen a tu clínica?» (la caja devuelve respuestas como mensajes directos) | respuesta de Sergio Urcullo, 3.2 |

- **No se muestra** la lista de tratamientos a medias, el envío por el WhatsApp propio del negocio, «clínica de ejemplo», cifras de ausencias ni clientes: está en la tabla «no se dice» de `07` §4.
- Las piezas de producto que prometan o muestren una función pasan antes por Sergio Urcullo (regla de publicación de contenido).

### 3.2 Conversar: respuesta al primer mensaje (de usted, con quien escribe)

> «Hola, gracias por escribir. Para ver si Onia le sirve le hago tres preguntas cortas:
> 1) ¿Cuántos profesionales atienden en su clínica?
> 2) ¿Cómo agenda hoy: cuaderno, Excel, WhatsApp o un sistema?
> 3) ¿Qué es lo que más le hace perder citas?
> Con eso le digo si vale la pena una llamada de 20 minutos.»

**Si es clínica con 2 a 6 profesionales y recepción:** pasa a la llamada (3.3). **Si es otro rubro (estética, servicios, comercio, importadora) o un solo consultorio:** se le ofrece el plan que le corresponde en `07` §0 y se mira caso por caso. **Si quiere aprender o es colega:** workshop (§4). **Si no encaja:** respuesta cortés y se termina; no se insiste.

### 3.3 Agendar la demo (mismo hilo)

> «Gracias. Le propongo una llamada de 20 minutos para ver cómo quedaría con su agenda. Elija el horario acá: sergiourcullo.vercel.app/llamada»

Si en 24 horas no agendó: **un solo** recordatorio («¿Pudo ver el link de la llamada?»). Después no se insiste (regla de seguimiento de `07` §3.4).

### 3.4 Cerrar: la oferta al final de la demo

- **Oferta única:** plan anual (se cobra 10 meses y se usan 12), y, como alternativa, probar antes 14 días sin tarjeta; si paga, la prueba termina al activarse el plan. No se inventa descuento ni cuenta regresiva.
- **Texto de cierre y manejo de objeciones:** `07` §2.7 (texto del cierre) y `04-OBJECIONES.md`. Precios: `07` §0, leídos de `subscription-plans.ts`.
- **Antes de pasar el QR, avisar el nombre que aparece** («aparecerá a nombre de {titular del QR}») para que no frene el pago.

### 3.5 Pagar por QR del BCP

> Este flujo es del **plan anual de Onia**. Workshops y consultorías se cobran aparte (§4).

1. Si no tiene cuenta, la crea primero con `app.onia.com.bo/register?plan=<clave>` (`/checkout` sin sesión lo manda al login). Claves: `basic` = Básico, `crece` = Crece, `professional` = Profesional, `clinic` = Completo. El plan solo sobrevive al registro con ese enlace. Después entra a `app.onia.com.bo/checkout`, **confirma que el plan marcado es el elegido antes de pagar**, elige ciclo **anual** y ve el QR. Al aprobarse el pago el plan pago se activa de inmediato y la prueba termina; el anual no se reembolsa.
2. Paga desde su banco y **sube el comprobante** (o lo manda por WhatsApp si la pantalla falla).
3. Sergio Urcullo lo aprueba en `/admin/payments`. El plan queda activo.
4. Se emite la factura aparte desde el portal del SIN; **ese portal lo abre solo Sergio Urcullo.**

Si la pantalla de pago falla en la prueba del carril Plataforma, el plan B es QR + comprobante por WhatsApp y activación manual. **No se usa hasta que él lo autorice**, porque cambia cómo se cobra.

## 4. Enlace con workshops y consultorías (no duplicado)

Sergio Urcullo dijo que sí a workshops y consultorías pagas para la caja de octubre. **Esa oferta (temario, precio, fechas, mensajes) la arma el hilo «Marca, comunidad y workshops».** Este funnel solo prevé dos cosas:

- En el mensaje directo (3.2), quien quiere aprender recibe el enlace o el texto que ese hilo entregue. Hasta que exista, se le responde: «Estoy armando un workshop; le aviso apenas tenga fecha» **(solo si Sergio Urcullo lo aprueba).**
- **El pago del workshop NO pasa por `/checkout`:** esa pantalla solo vende los cuatro planes anuales y activa un plan al aprobarse. El workshop se cobra con el QR del BCP enviado directamente por Sergio Urcullo (monto abierto), comprobante por WhatsApp y confirmación manual suya, sin tocar `/admin/payments`. El procedimiento y el monto los fija el hilo de Marca; acá no se escribe ninguno.
- **Oferta de workshop: en definición; sin precio ni promesa hasta que Sergio Urcullo la apruebe y quede en el árbol.**
- **Cómo encaja con este funnel:** solo quien en el mensaje directo (3.2) quiere aprender o es colega va a esta oferta; quien es dueño de clínica va a la llamada de 20 minutos, y el dueño de estética, servicios, comercio o importadora sigue en el flujo de plan y demo (`07` §0) aunque quiera aprender. Un asistente del workshop que además tiene clínica pasa a la llamada después, con el descuento del plan anual de `07` §0 como única oferta de Onia.
- ⚠️ El texto «le aviso apenas tenga fecha» de arriba queda reemplazado por esta oferta **solo cuando Sergio Urcullo la apruebe**.

## 5. Qué se mide (a mano, en una planilla, cada día)

| Columna | Qué cuenta |
|---|---|
| Mensajes recibidos | por pieza (reel, historia, post) |
| Dueños de clínica | los que pasan las 3 preguntas |
| Llamadas agendadas / hechas | desde `/llamada` |
| Pagos aprobados | monto y plan |

**Reglas de corte** (sin inventar umbral): si en 7 días las piezas no traen ni un dueño de clínica, se cambia el gancho, no el público. Si traen mensajes pero nadie agenda, se revisa el texto 3.3. Si agendan pero nadie paga, el problema es la oferta o la confianza (garantía, nombre del QR), no la atracción.

## 6. Qué decide Sergio Urcullo (una hoja)

1. ¿Autoriza usar los textos de 3.1 a 3.4 en sus mensajes y piezas? (sí/no)
2. ~~Devolución del prepago~~ decidido: no hay. Como el cliente paga un año sin devolución, **la oferta va después de la demo o la prueba**, no en frío.
3. ¿Se enciende el anuncio pago de US$ 56 (gasto, requiere tarjeta, Instagram vinculado y su OK)? Recomiendo **no** hasta que el funnel orgánico muestre el primer dueño de clínica.
4. Horarios libres en `/llamada` para las próximas dos semanas.
