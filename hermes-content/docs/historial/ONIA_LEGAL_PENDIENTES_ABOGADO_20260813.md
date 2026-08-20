# Pendientes para el abogado — política de privacidad y términos

**Fecha:** 2026-08-13 · **Interno. NO se publica.**

## Por qué existe este documento

La política de privacidad publicada tenía **7 notas internas `[REVISAR ABOGADO: ...]`
renderizándose en la página pública** — cualquiera que entrara a `onia.com.bo/privacidad`
leía "confirmar razón social exacta, NIT y domicilio legal". Para un revisor de Meta o un
cliente empresa, eso se lee como que no sabemos quiénes somos.

Se sacaron del texto público y se listan acá para no perderlas. **La política pasó a
`status: vigente`, versión 1.0** — quitarle el cartel de "BORRADOR" era necesario: una
política laboral marcada como borrador no sirve para publicar una app en Meta.

## Lo que el abogado tiene que confirmar

1. **Razón social, NIT y domicilio legal exactos.** Se publicó *OniaAgency, matrícula de
   comercio y NIT 5371375010, Santa Cruz de la Sierra*. Confirmar que la denominación
   registrada en SEPREC coincide **literalmente** y que el domicilio legal es ese.
   ⚠️ La titular es **Leslie Mercado Moreno**; Sergio es menor de edad y no puede figurar
   como firmante.
2. **Anexo de tratamiento de datos por cliente.** Si conviene un anexo firmado con cada
   cliente, en especial en el vertical salud (datos de pacientes = categoría sensible).
3. **País del centro de datos y transferencia internacional.** El servidor está contratado
   a un proveedor internacional. Determinar las implicancias para datos de salud y si hace
   falta declararlo con más precisión.
4. **Plazos de retención**: se publicó exportación dentro de 30 días y borrado a los 90
   días desde la terminación. Validar contra la normativa boliviana.
5. **Plazo de conservación del registro de bajas** del chatbot: se publicó 24 meses.
6. **Teléfono/WhatsApp oficial de contacto**: se publicó **+591 75414930**. Confirmar que
   es el número que queremos como oficial en un documento legal.
7. **Mecanismo y plazo de aviso de cambio de subprocesadores**: se comprometió aviso al
   correo de la cuenta y publicación en la página con **30 días de anticipación**, salvo
   urgencia por seguridad. Validar que el compromiso sea sostenible.

## Lo que YA es correcto y no hay que tocar

La sección de seguridad se corrigió el 2026-08-13 contra la infraestructura real: se
eliminaron las afirmaciones de **cifrado en reposo** y **copias de seguridad cifradas**
(ambas falsas), y se corrigió que la base corre en un **servidor privado de Onia**, no en
el servicio cloud de Supabase. Detalle en `ONIA_ESTADO_REAL_20260813.md` §5.

**No volver a poner esas afirmaciones** sin que exista cifrado de disco de verdad.
