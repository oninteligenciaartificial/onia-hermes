# Clínicas dentales con pauta HOY en la Biblioteca de Meta · lista para Sergio Urcullo

> **11-oct-2026, 12:40 UTC (08:40 La Paz) · Ventas y pauta · encargo de la MADRE MARKETING («la señal más barata», ADQ §3).** Solo lectura con el conector `Meta_ads` (`ads_library_search`, estado ACTIVE, sin gasto). **Nadie fue contactado, no se creó nada en Meta.** Datos: `CLINICAS-SCZ-CON-PAUTA-11OCT.json`; este archivo lo genera `.claude/skills/onia-ventas-pauta/scripts/clinicas-scz-lista.mjs` y no se edita a mano.
> **Contactar a cualquiera de estas clínicas requiere el OK escrito de Sergio Urcullo sobre el mensaje y el canal exactos** (`ONIA_ADQUISICION_Y_PAUTA.md` §3, subagente `onia-crm-prospeccion`) y el mensaje **no promete el Recall de tratamiento a medias** (§5.4).

## 0. Lo que esta lista NO puede decir (leer antes de usarla)

- **La Biblioteca no da ubicación.** Se buscó por texto («Santa Cruz» en el texto del anuncio) con alcance Bolivia: sale gente de La Paz, Cochabamba y hasta Perú. **«Ciudad: indicio» no es confirmación**; solo vale como confirmación el nombre de la página con «Santa Cruz» (o su zona). Cualquier contacto empieza por confirmar ciudad.
- **No contesta ninguna de las 5 preguntas** de `ONIA_CLIENTE_IDEAL.md` §9 (profesionales, quién agenda, cómo llevan la agenda, tratamientos a medias, NIT). El **«Encaje visible»** es solo una pista barata (cuántos anuncios, cuántas sedes, si hay botón de chat) y **no califica a nadie**: califica la conversación.
- **«Anuncios activos» = copias activas en la Biblioteca**, no campañas: una clínica puede tener 10 copias de una sola idea. **«Desde» = el anuncio activo más viejo**, no desde cuándo pauta la página (una reactivación reinicia la fecha). Lo que el anuncio **promete** es solo su titular: el conector no trae el texto ni la imagen (el 10-oct, 22 de 41 anuncios no traían titular).
- **«Botón de chat»** es el titular «Chatea con nosotros», «NUESTRO WHATSAPP», «Agenda tu cita» o similar: puede llevar a WhatsApp o a Messenger (la Biblioteca no distingue).
- Las consultas por texto devuelven los 50 anuncios más nuevos: las páginas de las tablas 1 y 2 se recontaron **por `page_ids`** (conteo entero, el `+` marca las que no); las de la tabla 3 salen de una sola consulta y pueden tener más.

## 1. Resumen

- **57 clínicas o páginas dentales con pauta activa hoy** (las hermanas cuentan como una) (218 anuncios), más 12 profesionales con página propia.
- **39 con Santa Cruz en el nombre o en la búsqueda** (195 anuncios): encaje visible **Alta 8** · Media 15 · Baja 16 · No 0.
- **Con «Santa Cruz» en el NOMBRE** (la única confirmación que da la Biblioteca): Ortobom Odontología, Clínica Dental Cortez Santa Cruz Bolivia, Unidental Santa Cruz, Natural Smile Santa Cruz, Casa dental sc, Másqsonrisas Santa Cruz / Bolivia.
- Del 30-sep, **6 páginas de la lista ya no tienen anuncios activos** (tabla 4), entre ellas la hipótesis «DS».

## 2. Con indicio de Santa Cruz, por encaje visible

| Clínica | page_id | Ciudad: indicio | Anuncios activos | Desde (el más viejo) | Qué promete (titulares) | Botón de chat | Moneda | En la lista del 30-sep | Encaje visible |
|---|---|---|---|---|---|---|---|---|---|
| **Clínica Dental Imagina** | 817088911667589 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz», «dentista Santa Cruz» (indicio, no prueba) | 27 | 2026-07-01 (102 d) · el último, hace 4 d | «Chatea con nosotros» · «¡ Aprovecha AHORA!» | sí | USD | no estaba | **Alta**: 27 anuncios activos: gasta de forma sostenida |
| **Ortobom Odontología (Santa Cruz de la Sierra + Mutualista)** | 103822665275137 · 110177058793289 | Santa Cruz en el nombre de la página (o su zona) | 13 | 2026-09-16 (25 d) · el último, hace 4 d | «NUESTRO WHATSAPP👉» · «Chatea con nosotros» · «BRACKETS sin pagar una fortuna👉» | sí | USD | no estaba | **Alta**: 2 páginas o sedes con 13 anuncios: más de un lugar de atención. Hermana de Ortobom Mutualista (otra sucursal) |
| **Sonríe a La Vida** | 255332044891977 | salió con «clínica dental Santa Cruz», «odontología Santa Cruz de la Sierra» (indicio, no prueba) | 13 | 2026-08-25 (47 d) · el último, hace 19 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | §5.1 | **Alta**: 13 anuncios activos: gasta de forma sostenida |
| **Clínica Dental ODES** | 447192008650376 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz», «dentista Santa Cruz» (indicio, no prueba) | 12 | 2026-07-18 (84 d) · el último, hace 12 d | «¡Di adiós a las caries!» · «¿Le tienes miedo al dentista?» · «¿Te duele la muela?» | no se ve | USD | §5.1 | **Alta**: 12 anuncios activos: gasta de forma sostenida |
| **Boquita Sana (Dentofacial + Sucursal Udabol)** | 380639486016768 · 100226682495467 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz», «dentista Santa Cruz» (indicio, no prueba) | 10 | 2026-10-02 (9 d) · el último, hace 9 d | «📣Estamos buscando pacientes!» | no se ve | BOB | no estaba | **Alta**: 2 páginas o sedes con 10 anuncios: más de un lugar de atención. Misma campaña que la sucursal Udabol (página 100226682495467) |
| **Clínica Dental Europea** | 1951772081778585 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz», «dentista Santa Cruz» (indicio, no prueba) | 10 | 2026-09-30 (11 d) · el último, hace 6 d | «30% DE DESCUENTO EN MUELAS DEL JUICIO + VALORACIÓN 100% GRATUITA» | no se ve | BOB | no estaba | **Alta**: 10 anuncios activos: gasta de forma sostenida |
| **MUN (Clínica Odontología Especializada + Odontopediatría)** | 572588712615373 · 108942198437850 | salió con «odontología Santa Cruz de la Sierra» (indicio, no prueba) | 5 | 2026-03-06 (219 d) · el último, hace 31 d | «Chatea con nosotros» · «RESERVA TU CUPO» · «Mas informacion» | sí | BOB | §5.1 | **Alta**: 2 páginas o sedes con 5 anuncios: más de un lugar de atención. Hermana: MUN Odontopediatría (108942198437850) |
| **Clínica Dental Cortez Santa Cruz Bolivia** | 111017921072549 | Santa Cruz en el nombre de la página (o su zona) | 2 | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | #9 de los 20 prospectos | **Alta**: dos ciudades (página de La Paz) y «+15 años» según el prospecto #9 del 30-sep: la Biblioteca solo muestra 2 anuncios hoy; verificar si pasa de 6 profesionales. Tiene otra página para La Paz (101343895932574). El 30-sep llevaba 6+ anuncios; hoy 2 |
| **Clinica Platinum** | 890615774144480 | salió con «clínica dental Santa Cruz» (indicio, no prueba) | 15 | 2026-09-24 (17 d) · el último, hace 1 d | «Curso de Bruxismo y DTM» · «Tratamiento Pink Glow» · «Evaluación periodontal en Platinum» · «El sangrado de encías no es normal» · «Aprende del especialista que forma especialistas» | no se ve | BOB | no estaba | **Media**: 9 de sus 15 anuncios son cursos o formación para odontólogos; solo 6 son de pacientes. La mayoría de sus anuncios son un CURSO para odontólogos, no captación de pacientes |
| **Doctormaxilofacial (Odontología Avanzada + Doctormaxilofacial)** | 511897128678646 · 102844034875276 | salió con «ortodoncia Santa Cruz» (indicio, no prueba) | 11 | 2026-09-11 (29 d) · el último, hace 24 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Media**: nombre de marca de un especialista (inferencia): puede ser un solo profesional, aunque tiene 2 páginas y 11 anuncios. Hermana: Doctormaxilofacial (102844034875276) |
| **Yari-Dent Consultorio Odontológico** | 1297857270066603 | salió con «ortodoncia Santa Cruz», «dentista Santa Cruz» (indicio, no prueba) | 9 | 2026-10-01 (10 d) · el último, hace 7 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Media**: «consultorio» en el nombre: probable 1-2 profesionales, aunque gasta de forma sostenida (9 anuncios) |
| **Clínica Dental Hurtado** | 284462084761388 | salió con «clínica dental Santa Cruz», «dentista Santa Cruz» (indicio, no prueba) | 6 | 2026-04-13 (181 d) · el último, hace 5 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Media**: 6 anuncios |
| **Clínica Dental "Sarita"** | 1709119185977006 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz» (indicio, no prueba) | 5 | 2026-09-14 (27 d) · el último, hace 3 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | §5.1 | **Media**: 5 anuncios |
| **Centro Médico Odontológico BAires** | 103698302731501 | salió con «ortodoncia Santa Cruz», «odontología Santa Cruz de la Sierra» (indicio, no prueba) | 4 | 2026-01-22 (261 d) · el último, hace 26 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Media**: 4 anuncios |
| **SOI Servicios Odontológicos Integrales** | 631408986884357 | salió con «ortodoncia Santa Cruz» (indicio, no prueba) | 4 | 2026-10-10 (1 d) · el último, hace 1 d | «Agende su cita» · «Chatea con nosotros» | sí | USD | no estaba | **Media**: 4 anuncios con botón de chat |
| **COYR DENT** | 2042184532678966 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz» (indicio, no prueba) | 4 | 2026-08-21 (51 d) · el último, hace 3 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | USD | no estaba | **Media**: 4 anuncios |
| **Clínica Odontológica Beautiful** | 589482644245798 | salió con «odontología Santa Cruz de la Sierra», «dentista Santa Cruz» (indicio, no prueba) | 4 | 2026-03-16 (209 d) · el último, hace 125 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Media**: 4 anuncios |
| **Natural Smile Santa Cruz** | 100193878311097 | Santa Cruz en el nombre de la página (o su zona) | 3 | 2026-08-06 (66 d) · el último, hace 43 d | «Natural Smile Santa Cruz» | no se ve | BOB | §5.1 | **Media**: 3 anuncios |
| **Clinica Dental Center** | 1015671418298509 | salió con «clínica dental Santa Cruz» (indicio, no prueba) | 3 | 2026-08-11 (61 d) · el último, hace 3 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | USD | no estaba | **Media**: 3 anuncios |
| **Clinica clarident plus** | 339088019578381 | salió con «clínica dental Santa Cruz» (indicio, no prueba) | 3 | 2026-10-07 (4 d) · el último, hace 3 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Media**: 3 anuncios |
| **Odontología Integral Digital** | 756968257500768 | salió con «dentista Santa Cruz» (indicio, no prueba) | 3 | 2026-04-22 (172 d) · el último, hace 67 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | §5.1 | **Media**: 3 anuncios |
| **Clinica Dental ROCHA** | 113481741822891 | salió con «ortodoncia Santa Cruz» (indicio, no prueba) | 2 | 2026-08-25 (47 d) · el último, hace 47 d | «Agenda tu cita» | sí | BOB | §5.1 | **Media**: botón de chat o de cita, pocos anuncios |
| **Consultorio dental Syriadent** | 103586632489948 | salió con «dentista Santa Cruz» (indicio, no prueba) | 1+ | 2026-07-07 (96 d) · el último, hace 96 d | «Agenda tu cita» | sí | BOB | no estaba | **Media**: botón de chat o de cita, pocos anuncios |
| **Odontología & Armonización Orofacial** | 922767334264415 | salió con «odontología Santa Cruz de la Sierra» (indicio, no prueba) | 8+ | 2026-09-17 (24 d) · el último, hace 3 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | USD | no estaba | **Baja**: no está claro quién es ni si es clínica. Estética orofacial; se vieron 8 en una consulta de 50: puede haber más |
| **Clínica Dental Ezequiel - Spadental** | 758264870991469 | salió con «clínica dental Santa Cruz» (indicio, no prueba) | 2 | 2026-08-08 (64 d) · el último, hace 20 d | «Recupera tu sonrisa» · «Tu sonrisa blanca desde Bs 300» | no se ve | BOB | §5.1 | **Baja**: 2 anuncios y sin botón visible |
| **Casa dental sc** | 105650449163721 | Santa Cruz en el nombre de la página (o su zona) | 2 | 2026-08-10 (62 d) · el último, hace 24 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 2 anuncios y sin botón visible. «sc» en el nombre: probablemente Santa Cruz (inferencia) |
| **Dental Top** | 110773264549760 | salió con «ortodoncia Santa Cruz» (indicio, no prueba) | 2 | 2026-08-04 (68 d) · el último, hace 24 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 2 anuncios y sin botón visible |
| **Unidental Santa Cruz** | 554435031080616 | Santa Cruz en el nombre de la página (o su zona) | 1 | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **Consultorio Dental Rocha** | 169289006270602 | listada el 30-sep por «clínica dental Santa Cruz» (indicio) | 1 | 2026-07-13 (90 d) · el último, hace 90 d | «¡Tu nueva sonrisa comienza aquí» | no se ve | BOB | §5.1 | **Baja**: 1 anuncio y sin botón visible |
| **Clinica Dental KOREA** | 697014900382758 | listada el 30-sep por «clínica dental Santa Cruz» (indicio) | 1 | 2026-08-07 (65 d) · el último, hace 65 d | «726-29818» | no se ve | BOB | §5.1 | **Baja**: 1 anuncio y sin botón visible |
| **Happy Dent** | 608572659242258 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz» (indicio, no prueba) | 1 | 2026-09-09 (31 d) · el último, hace 31 d | «Happy Dent \| Ortodoncia en Happy Dent \| Renová tu sonrisa ✨» | no se ve | BOB | §5.1 | **Baja**: 1 anuncio y sin botón visible |
| **Clínica Dental Dulce Sonrisa** | 101512028641874 | salió con «clínica dental Santa Cruz», «dentista Santa Cruz» (indicio, no prueba) | 1 | 2026-10-03 (8 d) · el último, hace 8 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **Implantes Dentales** | 106274010711823 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz» (indicio, no prueba) | 1 | 2026-10-07 (4 d) · el último, hace 4 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: no está claro quién es ni si es clínica. Página genérica de implantes; no se sabe quién es |
| **Fresh Denture** | 913517105184132 | salió con «clínica dental Santa Cruz» (indicio, no prueba) | 1 | 2026-10-06 (4 d) · el último, hace 4 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: no está claro quién es ni si es clínica. Nombre de prótesis/laboratorio; no es claro que sea clínica |
| **Odonto Click** | 413881708472622 | salió con «ortodoncia Santa Cruz» (indicio, no prueba) | 1 | 2026-09-17 (24 d) · el último, hace 24 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: no está claro quién es ni si es clínica |
| **Estudio_oral** | 113111194494738 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz» (indicio, no prueba) | 1 | 2026-10-10 (1 d) · el último, hace 1 d | «Semana Invisalign 12 al 16 de Octubre» | no se ve | USD | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **Oral Group Clínica Dental** | 950490698330677 | salió con «clínica dental Santa Cruz» (indicio, no prueba) | 1 | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | USD | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **Clínica Fundepi** | 908015955728944 | salió con «ortodoncia Santa Cruz» (indicio, no prueba) | 1 | 2026-01-23 (261 d) · el último, hace 261 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | USD | no estaba | **Baja**: no está claro quién es ni si es clínica. Estética (plantilla de catálogo sin rellenar) |
| **Másqsonrisas Santa Cruz / Bolivia** | 416106969199277 | Santa Cruz en el nombre de la página (o su zona) | 1+ | 2026-10-10 (1 d) · el último, hace 1 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible |

## 3. Dentales en Bolivia con ciudad SIN indicio (incompleto: sale de una sola consulta de 50 de 92)

> «Blanqueamiento dental» no lleva ciudad: estas páginas pueden ser de cualquier ciudad de Bolivia. Sirven para saber **quién más pauta**, no para elegir a quién escribir.

| Clínica | page_id | Ciudad: indicio | Anuncios activos | Desde (el más viejo) | Qué promete (titulares) | Botón de chat | Moneda | En la lista del 30-sep | Encaje visible |
|---|---|---|---|---|---|---|---|---|---|
| **Clínica Dental Integral Ustaris** | 110444090446243 | sin indicio | 4+ | 2026-10-09 (2 d) · el último, hace 1 d | «Reserva tu cita AQUI» | sí | BOB | no estaba | **Media**: 4 anuncios con botón de chat |
| **Endodent Centro Odontológico** | 718627938215118 | sin indicio | 2+ | 2026-10-08 (2 d) · el último, hace 2 d | «Quiero agendar una cita» | sí | BOB | no estaba | **Media**: botón de chat o de cita, pocos anuncios |
| **Clinica Dental Stildent** | 918559771552554 | sin indicio | 2+ | 2026-10-02 (9 d) · el último, hace 9 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 2 anuncios y sin botón visible. El 30-sep se listó «Stildent Santa Cruz» (110445244840996), otra página: sin ads activos hoy |
| **SKY Dental Center Plus** | 104353664290431 | sin indicio | 1+ | 2026-10-07 (4 d) · el último, hace 4 d | «Agenda cita Ya!» | sí | BOB | no estaba | **Media**: botón de chat o de cita, pocos anuncios |
| **Dental Health suc. Suárez Arana** | 102510038459495 | sin indicio | 1+ | 2026-10-01 (10 d) · el último, hace 10 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **Clinica Dentalkt** | 198922956648057 | sin indicio | 1+ | 2026-10-11 (0 d) · el último, hace 0 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **Odontología Integral** | 100202315033963 | sin indicio | 1+ | 2026-10-10 (1 d) · el último, hace 1 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **Reino Dental SAN PEDRO** | 2244847179114224 | sin indicio | 1+ | 2026-10-09 (1 d) · el último, hace 1 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible. No es la página «Clínica Dental San Pedro» del 30-sep (662533600624550), que hoy no tiene ads activos |
| **OdontoNicky GDLR** | 674864382374715 | sin indicio | 1+ | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **Consultorio Dental "Divino Niño"** | 122403477628402 | sin indicio | 1+ | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **Pardo Dental** | 168031719724129 | sin indicio | 1+ | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **Clinica Dental OralVid** | 105853962262188 | sin indicio | 1+ | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **DentalYS** | 283513188181711 | sin indicio | 1+ | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **Dental Care A&S** | 152609645522464 | sin indicio | 1+ | 2026-10-08 (3 d) · el último, hace 3 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **Dentall Bolivia** | 125441410658875 | sin indicio | 1+ | 2026-10-05 (6 d) · el último, hace 6 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | USD | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **Salud Bucal** | 561641773702831 | sin indicio | 1+ | 2026-10-03 (8 d) · el último, hace 8 d | «Salud Bucal» | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **Dental Cast** | 243569185515020 | sin indicio | 1+ | 2026-09-29 (11 d) · el último, hace 11 d | «Cuidado dental integral 🦷» | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible |
| **RASS Dental Care - Centro Odontológico** | 1286396557890207 | sin indicio | 1+ | 2026-09-29 (12 d) · el último, hace 12 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | no estaba | **Baja**: 1 anuncio y sin botón visible |

## 4. Estaban en la lista del 30-sep y hoy NO tienen anuncios activos

| Página | page_id | Nota |
|---|---|---|
| Clínica Dental San Pedro | 662533600624550 | #1 de los 20 prospectos; 23-sep con clic a WhatsApp |
| Clínica Dental "DS" | 625324393996576 | hipótesis: el lead de la conversación 36 (`ds-santacruz.bo`). **Ya no paga pauta activa** |
| Stildent Santa Cruz | 110445244840996 | hay otra página «Clinica Dental Stildent» (918559771552554) con 2 anuncios, a verificar si es la misma |
| Clínica Dental Vid | 920721404450647 | — |
| DÚO Consultorio Dental | 109306495537111 | — |
| Clínica Dental Sanident | 787098867820512 | — |

«Sin anuncios activos hoy» no dice que cerraron ni que no inviertan: puede ser una pausa o un cambio de página.

## 5. Profesionales con página propia (un profesional: no es el tamaño de 2-6)

Dra. Mishel Rodriguez (1008202805702373, 1 anuncio) · Dr. Abner Valdivia (1732856310310270, 3+ anuncios) · Dra. Jessica Zelaya (1156462164210198, 1+ anuncio) · Dra. Micaela Aliaga Rejas (1217079781480419, 1+ anuncio) · Dra. Lourdes Robles (rehabilitación oral y estética) (1013090891892178, 2+ anuncios) · Dra. Andrea Romero (311234288750022, 1+ anuncio) · Dra. Ashley Viscarra G. (106356259092152, 1+ anuncio) · Dra. Yessenia Galvez Saucedo (1149093801631362, 1+ anuncio) · Dra. Nayra Suyo Rivera (652000974666300, 1+ anuncio) · Kimberly Crespo Odontología Estética (790074584719525, 1+ anuncio) · Dra. Pasapera (106862378310296, 1+ anuncio) · Dra. Montemayor (480913058448332, 1+ anuncio).

## 6. Fuera de la lista, y por qué

| Página | page_id | Motivo |
|---|---|---|
| Clinica Dental Cortez La Paz Bolivia | 101343895932574 | La Paz (la hermana de Cortez Santa Cruz) |
| Cuid-Arte Clínica dental Sopocahi | 298595199992821 | Sopocahi es un barrio de La Paz |
| CARIZ Odontología Cochabamba | 597627036774607 | Cochabamba |
| OdontoAte | 195609023638171 | Moneda PEN (soles): cuenta peruana; 17+ anuncios vistos |
| Clínica TELLO | 1133570930064492 | Moneda PEN: probable cuenta peruana; ciudad no verificada |
| Cursos de Mejoramiento Profesional – Clínica Dental Zeballos / Clínica Zeballos – Curso | 130188780175449 · 1750205808334798 | Pauta de CURSOS para odontólogos, no de pacientes |
| OsteoCompas Bolivia · CEPAC Centro de Capacitación · Dra Laura Pardoux (entrenamiento) · Enfocate Santa Cruz | 105637481563258 · 110271241861054 · 1133988523344618 · 117785944539143 | Capacitación o escuelas, no clínicas |
| Ultra Pack Dentista · Artebiss-publicidad · Xio - Creativa | 116497988215732 · 484312588107139 · 121083415255396 | Agencias o artes para dentistas (por el nombre): son competencia de Onia en pauta, no clientes (apunte aparte) |
| Servicios Médicos AYVI SRL Central Cochabamba · Pasta dental Bolivia · Blanceresem.MB06 · Formatos digitales · habloportugues_ · María Fernanda Roca · Reality 3D | varios | Ruido de la búsqueda (otra ciudad, producto, otro país u otro rubro) |
| Arge Nathali ToMi | 988484651012477 | Sin identificar: un anuncio «30% de descuento!» que salió con «blanqueamiento dental»; no es claro que sea una clínica |

## 7. Las 5 preguntas: qué se sabe y qué falta

| Pregunta (`ONIA_CLIENTE_IDEAL.md` §9) | La Biblioteca dice | Cómo se contesta |
|---|---|---|
| 1. ¿Cuántos profesionales atienden? (2-6 es el punto dulce) | Solo pistas: varias sedes, varios anuncios | Preguntarla; **es la primera** |
| 2. ¿Quién agenda las citas? (con recepción, el dolor existe) | Nada. «Agenda tu cita» / «Chatea con nosotros» indican que alguien contesta el chat | Preguntarla; **es la segunda** |
| 3. ¿Cómo llevan la agenda y las fichas? | Nada | En la llamada |
| 4. ¿Cuántos pacientes tienen un tratamiento empezado y no volvieron? (**la que vende**) | Nada | En la llamada; si no lo saben, ya dijeron el problema |
| 5. ¿Facturan con NIT? | Nada | En la llamada |

## 8. Qué sigue, y quién decide

| Qué | Quién |
|---|---|
| Elegir a cuáles contactar (propuesta: empezar por las de encaje **Alta** con «Santa Cruz» en el nombre y confirmar ciudad y tamaño antes de cualquier oferta) | Sergio Urcullo |
| Aprobar el mensaje y el canal exactos de cada contacto | Sergio Urcullo (`onia-crm-prospeccion` redacta, no envía) |
| Cruzar con los 7 leads de agosto y los 20 prospectos (`SEGUIMIENTO-LEADS.md`, `ONIA_PROSPECTOS_DENTAL_SCZ.md` §6) | Ventas y pauta, con el OK de Sergio Urcullo para contactar |
| Repetir esta lista cada semana con la tanda de competencia (la lista del 30-sep ya perdió 6 páginas) | Ventas y pauta |

**Recomendación de este análisis:** son **8 clínicas de encaje Alta** (más de un lugar de atención o gasto sostenido), de las que **2 traen «Santa Cruz» en el nombre**. Ningún dato de esta lista justifica escribirle a las 39 páginas: con 5 conversaciones buenas alcanza (ADQ §4). Escribir a todas es la forma más rápida de quemar la lista.
