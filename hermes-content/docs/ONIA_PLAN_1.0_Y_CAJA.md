# Plan de Onia: la 1.0 lista y campañas que no gasten la caja (3-oct-2026)

Para Sergio Urcullo. Etiquetas: **MEDIDO** (archivo o página oficial), **DE TERCEROS** (otros lo publican), **SUPUESTO** (estimación o propuesta mía). Siglas: «brecha» = `ONIA_NIVEL_REFERENTES_BRECHA.md`, «ADQ» = `ONIA_ADQUISICION_Y_PAUTA.md`, «ESTR» = `ONIA_ESTRATEGIA_DE_EMPRESA.md`.

## 1. El objetivo

**El viernes 30-oct-2026, los 15 puntos de abajo pasan su prueba en app.onia.com.bo. Además, una cuenta de prueba hace el cobro completo: paga, sube el comprobante, usted lo aprueba y el plan queda activo.** Los puntos 1 a 4 se cierran antes, el viernes 16-oct, porque sin ellos no se le puede cobrar a nadie. Las fechas son mi propuesta (SUPUESTO).

Los estados de brecha se midieron antes de la versión publicada del 3-oct. Cada punto se vuelve a mirar en producción antes de marcarlo como hecho.

Puntos que bloquean **vender**:
- [ ] 1. Cobro completo con el QR del BCP. **A medias:** hay 0 pagos registrados (catálogo:85).
- [ ] 2. El checkout no promete factura automática y el titular del QR está explicado. **Falta** (brecha:68, catálogo:89).
- [ ] 3. Los datos clínicos no salen por el canal de la agenda ni con la clave pública. **Falta** (brecha:70).
- [ ] 4. Respaldos fuera del VPS, con una restauración probada. **A medias:** hoy están solo en el disco del VPS (brecha:69).
- [ ] 5. Agenda de recepción con una columna por profesional y confirmación en 1 clic. **Falta / a medias** (brecha:49-50).
- [ ] 6. Ficha con «ver todo» y odontograma con 5 zonas por diente. **A medias / falta** (brecha:60-61).
- [ ] 7. Presupuesto por fases y carga de tratamientos ya empezados. **Hecho en `dev/plataforma`, sin publicar** (handoff:60).
- [ ] 8. Caja diaria con apertura, cierre y descuadre. **Falta** en los rubros clínicos (brecha:65).
- [ ] 9. Demo lista: el recall propone pacientes en «Clínica Demo Onia». **A medias** (brecha:64, handoff:148).

Puntos que bloquean **usar**:
- [ ] 10. Botón «Enviar por WhatsApp» en cada cita, sin promesas falsas en la conexión. **A medias** (brecha:56, 58).
- [ ] 11. La agenda no miente: reprogramar, feriados y aviso de reserva online. **A medias / falta** (brecha:51-53).
- [ ] 12. Importar CSV separado por «;» y WhatsApp de soporte en `/help`. **A medias** (brecha:66-67).
- [ ] 13. Plan pago vencido: **7 días de gracia** antes de cortar (hoy corta el mismo día) y botón «no renovar». **Falta** (`research/ONIA_PAGO_AUTOSERVICIO_AUDITORIA.md`, agregado por Sergio Urcullo el 3-oct).
- [ ] 14. Se guarda que el cliente aceptó los términos (fecha y versión). **Falta** (misma auditoría).
- [ ] 15. Checklist al aprobar cada pago: **factura manual en el Portal Web del SIN** hasta que la factura sea automática. Va una factura por cobro; cobrar sin factura arriesga una clausura de 6 a 48 días. **Falta** (misma auditoría).

Quedan para después de la 1.0: la factura SIAT automática, el recordatorio con botones, el QR que activa el plan solo y los otros rubros.

## 2. La caja: Bs 4.000 (corregida el 3-oct con los gastos reales)

Sergio Urcullo, 3-oct: *«solo pago Codex 100 $, el servidor VPS y Higgsfield, nada más»*. La versión anterior de este plan
contaba Claude Max (US$200) y estaba mal.

| Gasto fijo | US$/mes | Bs/mes (a ~11,5, SUPUESTO) |
|---|---|---|
| Codex (ChatGPT prolite) | 100 | ~1.150 |
| VPS (el producto) | 40 | ~461 |
| Higgsfield | 0 este mes: el plan Pro se pagó anual (US$348) | 0 |
| **Total** | **140** | **~1.611** |

**Reparto propuesto (SUPUESTO):**

| Bloque | Bs |
|---|---|
| VPS por 3 meses: el producto no se puede caer | 1.383 |
| Codex por 1 mes: terminar la 1.0 | 1.150 |
| **Reserva (no se toca)** | **2.533** |
| **Techo para conseguir clientes** (Meta 750 + auditorías, comunidad y eventos 650) | **1.400** |

- **Meses de aire:** 2,5 con todo, o 8,6 solo con el VPS.
- **Para cubrir el gasto fijo (~Bs 1.611) hacen falta:** 2 clientes en Profesional (Bs 890) o 3 en Crece (Bs 550). Precios de `subscription-plans.ts:39-45`.
- **El tipo de cambio que cobra el banco a la tarjeta** sigue sin medirse. Se lee en el próximo extracto.

### Por qué «la pauta paga unas 3 demos»
Con Bs 750 en Meta, a lo que suelen costar las conversaciones (SUPUESTO, §3), salen unas 3 demos. Con el 25 % de cierre
(DE TERCEROS), 5 clientes necesitan unas 20 demos. **Las otras ~17 no se compran: salen de los canales gratis.**
Por eso, el orden de Sergio Urcullo (3-oct):
1. **Marca personal + auditorías + llamadas 1 a 1 + comunidad** (gratis, cuestan sus horas). Embudo en `ONIA_COMUNIDAD_CONTENIDO.md`.
2. **Lo que le falta a la 1.0** (§1).
3. **Mirar cómo funcionan los competidores:** Lety y otros que faltan (Dapta y SendyPro ya están en
   `research/competencia/DAPTA_COMO_FUNCIONA.md` y `REVISION-HERRAMIENTAS-CHATBOT.md`).

## 3. Campañas sin quedarse sin plata

**Orden de canales, del más barato por demo al más caro** (ADQ:279-283):
1. **Los 7 leads que ya escribieron** (3 pedidos de acceso y 4 conversaciones; ONIA_LEADS_ESPERANDO.md:40-57). Esperan desde agosto. Cuestan entre Bs 0 y 7: una plantilla de marketing sale unos USD 0,085 ≈ Bs 1 (DE TERCEROS). Empezar por la conversación 35, la clínica de 4 doctores.
2. **Los 20 prospectos de agosto y las clínicas que ya pagan pauta.** Bs 0, pero cuestan horas suyas.
3. **El Colegio de Odontólogos SCZ y el congreso CIO 2026.** Existen (MEDIDO), pero no se sabe cuánto cuesta un stand.
4. **Meta, anuncio de clic a WhatsApp en Santa Cruz.** Tope de Bs 750.
5. **Contenido:** hoy no llega al comprador (ADQ:283).

**La prueba de pauta mínima** (SUPUESTO; escala de ADQ:332-334):
- **Cuándo:** desde el 16-oct, con los puntos 1 y 2 ya cerrados y los canales 1 y 2 ya contactados.
- **Monto:** US$4 por día durante 14 días, o sea US$56. Son Bs 637 a 11,37, Bs 666 a 11,89 y Bs 840 a 15.
- **Si el tipo de cambio pasa de 13,4:** los 14 días superan los Bs 750 y hay que cortar antes. A 15, se corta el día 12.
- **Estructura:** un solo conjunto de anuncios, optimizado por conversación iniciada. Optimizar por demo o por pago no sale nunca de la fase de aprendizaje con esta caja (DE TERCEROS: hacen falta unos 50 resultados por semana).
- **Piso de la fase de aprendizaje:** unos Bs 25 por día (SUPUESTO sobre datos de terceros). US$4 por día lo supera.
- **Límite de gasto:** Meta no acepta un límite de campaña menor a US$100 (ADQ:337, MEDIDO). Por eso el tope se cuida con el presupuesto total de la campaña (US$ 56) con fecha de fin y apagando a mano el día 14 (corregido el 10-oct: antes decía «diario fijo»; el total es el único que garantiza el techo, ADQ §5.3).
- **Respuesta:** antes de 24 horas. Así se abre una ventana gratis de 72 horas para los mensajes (página oficial de Meta, MEDIDO).
- **Qué se mide cada día, a mano en una planilla:** conversaciones; cuántas son de un dueño o administrador de clínica; demos agendadas; costo por conversación; costo por demo; CTR; frecuencia.

**Criterios para cortar y para seguir.** Los límites salen del costo máximo por cliente de ADQ:418 (Bs 1.570, SUPUESTO) y de mis supuestos de conversión:

| Momento | CORTAR si... | SEGUIR si... |
|---|---|---|
| Día 3 | 0 conversaciones, o CTR < 0,8% (cambiar la pieza) | hay conversaciones |
| Día 7 | costo por conversación > Bs 40, o 0 conversaciones de dueños de clínica | ≤ Bs 40 y al menos 1 calificada |
| Día 14 | 0 demos, o costo por demo > Bs 390 | costo por demo ≤ Bs 390 |

- El límite por demo sale de 1.570 × 25% de cierre. El límite por conversación sale de 390 × 10% de conversación a demo. Las dos cuentas son SUPUESTO.
- Durante la prueba no se toca la segmentación ni se sube el presupuesto más de 20%, porque eso reinicia el aprendizaje (DE TERCEROS).
- **Seguir** quiere decir una segunda tanda igual, **pagada sólo con plata de un cliente que ya pagó**, nunca con la reserva.

**Techo total que no se pasa: Bs 1.400** (Meta 750 + auditorías, comunidad y eventos 650). Al llegar a ese monto se apaga todo.

**El embudo hasta 5 clientes:**

| Canal | Base | De ahí a demo (SUPUESTO) | Demos |
|---|---|---|---|
| Leads que ya escribieron | 7 | 40% | 3 |
| Prospectos de agosto | 20 | 20% | 4 |
| Meta (Bs 750) | 14 a 56 conversaciones (a US$1-4 cada una, ADQ:339, SUPUESTO) | 10% (sin fuente) | 1 a 6, unas 3 |
| **Total** | | | **unas 10** |

- De demo a cliente cierra entre el 20% y el 35% (DE TERCEROS, EE. UU.). Con 25%: 10 demos dan unos 2,5 clientes.
- **Para 5 clientes hacen falta unas 20 demos.** Las 10 que faltan no las compra la caja: salen de más prospección y del Colegio o el CIO, con horas suyas. Esa es la conclusión principal de esta sección.

**Cuánto tarda en recuperarse lo gastado con 1 cliente** (techo de Bs 750, precios MEDIDOS; la cuenta es mía):
- Profesional (Bs 890/mes): con el primer cobro.
- Crece (Bs 550/mes): con el segundo cobro (1.100).
- Básico (Bs 320/mes): con el tercer cobro (960).

## 4. Lo que no se hace (para no gastar)

- No se contrata el bot de Dapta. Sirvió sólo como referencia de pantallas y funciones.
- No se mandan plantillas de marketing en frío: 1.000 mensajes cuestan unos Bs 970, el 24% de la caja (DE TERCEROS).
- No hay más de un conjunto de anuncios ni se optimiza por demo o por pago.
- La pauta no se agranda con la reserva, sólo con plata ya cobrada.
- No se paga un stand en el CIO sin saber el precio y sin que entre en los Bs 750.
- No hay generaciones pagas de imagen o video (Higgsfield) para la pauta este mes.
- No se gasta la caja chica en octubre.
- No se construye nada fuera de los 12 puntos. No se abre otro rubro ni otra línea de negocio: sólo dental.
- No se publica un anuncio que prometa algo que producción no hace hoy (ADQ §5.4).

## 5. Qué decide Sergio Urcullo

1. **Las fechas y la caja:** el 16-oct para los puntos 1-4 y el 30-oct para la 1.0; la reserva de Bs 3.226 y el techo de Bs 750. También si Claude Max sale de esta caja o de otra fuente, y si se baja de plan después de la 1.0.
2. **Encender Meta el 16-oct:** cargar la tarjeta en ONIA Ads, dar el OK de gasto con tope de Bs 750 y decidir quién contesta en WhatsApp antes de 24 horas (ADQ §5.9).
3. **Lo que sólo usted puede hacer para la 1.0:** crear el bucket de respaldos (punto 4), resolver con el BCP el nombre del titular del QR (punto 2), y confirmar el correo de la demo y dar `module.agents` (punto 9).
