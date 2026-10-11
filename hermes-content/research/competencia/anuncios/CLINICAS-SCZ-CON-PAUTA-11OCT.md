# Clínicas dentales con pauta HOY en la Biblioteca de Meta · lista para Sergio Urcullo

> **11-oct-2026, 12:40 UTC (08:40 La Paz) · Ventas y pauta · encargo de la MADRE MARKETING («la señal más barata», ADQ §3).** Solo lectura con el conector `Meta_ads` (`ads_library_search`, estado ACTIVE, sin gasto). **Nadie fue contactado, no se creó nada en Meta.** Datos: `CLINICAS-SCZ-CON-PAUTA-11OCT.json`; este archivo lo genera `.claude/skills/onia-ventas-pauta/scripts/clinicas-scz-lista.mjs` y no se edita a mano.
> **Corregida el 11-oct a las 13:30 UTC.** La primera versión puntuó «Alta» a las clínicas con varias sedes o muchos anuncios y recomendó empezar por Ortobom y Cortez: **seis de esas ocho ya estaban descartadas con evidencia** en `ONIA_PROSPECTOS_DENTAL_SCZ.md` §6.2, §6.6, §6.7 y §6.9 (multi-sede, cadena, otra ciudad) y yo no leí esos veredictos antes de ordenar. Ahora el orden sale de esos veredictos: **ya no hay «Alta»**.
> **Contactar a cualquiera de estas clínicas requiere el OK escrito de Sergio Urcullo sobre el mensaje y el canal exactos** (`ONIA_ADQUISICION_Y_PAUTA.md` §3, subagente `onia-crm-prospeccion`) y el mensaje **no promete el Recall de tratamiento a medias** (§5.4).

## 0. Lo que esta lista NO puede decir (leer antes de usarla)

- **La Biblioteca no da ubicación.** Se buscó por texto («Santa Cruz» en el texto del anuncio) con alcance Bolivia: sale gente de La Paz, Cochabamba y hasta Perú. **«Ciudad: indicio» no es confirmación**; solo valen como confirmación el nombre de la página con «Santa Cruz» o la verificación de los docs previos (directorio o web propia).
- **No contesta ninguna de las 5 preguntas** de `ONIA_CLIENTE_IDEAL.md` §9 (profesionales, quién agenda, cómo llevan la agenda, tratamientos a medias, NIT). **Cantidad de anuncios y de sedes no miden el encaje**: una cadena o una red de sedes pasa de los 2-6 profesionales y **sale**.
- **No es exhaustiva.** Sale de 5 consultas por texto (los 50 anuncios más nuevos de cada una) y de recuentos por `page_ids`; 5 páginas de la pasada del 8-oct no habían salido y se sumaron por `page_id`. Puede faltar alguna.
- **«Anuncios activos» = copias activas en la Biblioteca**, no campañas. **«Desde» = el anuncio activo más viejo**, no desde cuándo pauta la página (una reactivación reinicia la fecha). Lo que el anuncio **promete** es solo su titular: el conector no trae el texto ni la imagen.
- **«Botón de chat»** es el titular «Chatea con nosotros», «NUESTRO WHATSAPP», «Agenda tu cita» o similar: puede llevar a WhatsApp o a Messenger (la Biblioteca no distingue).

## 1. Resumen

- **62 clínicas o páginas dentales con pauta activa hoy** (las hermanas cuentan como una), más 12 profesionales con página propia.
- De las 44 con indicio de Santa Cruz: **6 candidatas** (la verificación previa dice SIGUE y pautan hoy), **32 a verificar** y **6 fuera** por evidencia previa (67 anuncios que no cambian eso).
- **Candidatas:** Clínica Dental Hurtado, COYR DENT, Clinica clarident plus, Smile Dental, Clínica Dental Innova Kids, Clínica Dental Ezequiel - Spadental. Todas con una condición de tamaño: si pasan de 6 profesionales, o son uno solo, salen.
- Del 30-sep, **6 páginas de la lista ya no tienen anuncios activos** (tabla 5), entre ellas la hipótesis «DS». También sin anuncios hoy: San Pablo, Henners, Dentessa y Gooddental kids (del 8-oct).

## 2. Candidatas: la verificación previa dice SIGUE y pautan hoy

| Clínica | page_id | Ciudad: evidencia | Anuncios activos | Desde (el más viejo) | Qué promete (titulares) | Botón de chat | Moneda | Lo que ya se sabía (docs del 30-sep al 8-oct) |
|---|---|---|---|---|---|---|---|---|
| **Clínica Dental Hurtado** | 284462084761388 | Santa Cruz verificada en los docs previos (directorio o web) | 6 | 2026-04-13 (181 d) · el último, hace 5 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **Candidata**: Santa Cruz confirmado; si pasa de 6 profesionales, sale (§6.9 #2) |
| **COYR DENT** | 2042184532678966 | Santa Cruz verificada en los docs previos (directorio o web) | 4 | 2026-08-21 (51 d) · el último, hace 3 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | USD | **Candidata**: Santa Cruz confirmado; riesgo alto de ser un solo profesional: si lo es, sale (§6.9 #6) |
| **Clinica clarident plus** | 339088019578381 | Santa Cruz verificada en los docs previos (directorio o web) | 3 | 2026-10-07 (4 d) · el último, hace 3 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **Candidata**: Santa Cruz confirmado; mirar si «Clarident Duo» es otra sede: si lo es, sale (§6.9 #1) |
| **Smile Dental** | 1099790733394902 | Santa Cruz verificada en los docs previos (directorio o web) | 3 | 2026-10-07 (4 d) · el último, hace 3 d | «Chatea con nosotros» | sí | BOB | **Candidata**: Santa Cruz confirmado; preguntar el tamaño (§6.9 #3). Santa Cruz por el directorio (§6.9 #3); no salió en las consultas por texto de hoy |
| **Clínica Dental Innova Kids** | 105982241767033 | Santa Cruz verificada en los docs previos (directorio o web) | 3 | 2026-02-03 (250 d) · el último, hace 82 d | «Agenda tu cita ahora» · «Clínica Dental Innova Kids» · «Cuidado dental para niños en Santa Cruz» | sí | BOB | **Candidata**: Santa Cruz confirmado; solo odontopediatría, la cita la confirma el padre o la madre (§6.9 #5). Solo odontopediatría |
| **Clínica Dental Ezequiel - Spadental** | 758264870991469 | Santa Cruz verificada en los docs previos (directorio o web) | 2 | 2026-08-08 (64 d) · el último, hace 20 d | «Recupera tu sonrisa» · «Tu sonrisa blanca desde Bs 300» | no se ve | BOB | **Candidata**: Santa Cruz confirmado (Av. Japón 3593); si es un solo doctor, sale (§6.5-6.6) |

## 3. A verificar (ciudad y tamaño, desde la PC)

| Clínica | page_id | Ciudad: evidencia | Anuncios activos | Desde (el más viejo) | Qué promete (titulares) | Botón de chat | Moneda | Lo que ya se sabía (docs del 30-sep al 8-oct) |
|---|---|---|---|---|---|---|---|---|
| **Clinica Platinum** | 890615774144480 | salió con «clínica dental Santa Cruz» (indicio, no prueba) | 15 | 2026-09-24 (17 d) · el último, hace 1 d | «Curso de Bruxismo y DTM» · «Tratamiento Pink Glow» · «Evaluación periodontal en Platinum» · «El sangrado de encías no es normal» · «Aprende del especialista que forma especialistas» | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar. La mayoría de sus anuncios son un CURSO para odontólogos, no captación de pacientes |
| **Sonríe a La Vida** | 255332044891977 | salió con «clínica dental Santa Cruz», «odontología Santa Cruz de la Sierra» (indicio, no prueba) | 13 | 2026-08-25 (47 d) · el último, hace 19 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: nombre parecido al lead «consultorio dental sonrisa feliz» (28-ago, ya pidió acceso): si es la misma, va por ONIA_LEADS_ESPERANDO y no se le escribe dos veces (§6.2); ciudad y tamaño sin verificar |
| **Clínica Dental ODES** | 447192008650376 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz», «dentista Santa Cruz» (indicio, no prueba) | 12 | 2026-07-18 (84 d) · el último, hace 12 d | «¡Di adiós a las caries!» · «¿Le tienes miedo al dentista?» · «¿Te duele la muela?» | no se ve | USD | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Doctormaxilofacial (Odontología Avanzada + Doctormaxilofacial)** | 511897128678646 · 102844034875276 | salió con «ortodoncia Santa Cruz» (indicio, no prueba) | 11 | 2026-09-11 (29 d) · el último, hace 24 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: dos páginas pueden ser dos sedes (§6.9, 8-oct). Hermana: Doctormaxilofacial (102844034875276) |
| **Yari-Dent Consultorio Odontológico** | 1297857270066603 | salió con «ortodoncia Santa Cruz», «dentista Santa Cruz» (indicio, no prueba) | 9 | 2026-10-01 (10 d) · el último, hace 7 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Odontología & Armonización Orofacial** | 922767334264415 | salió con «odontología Santa Cruz de la Sierra» (indicio, no prueba) | 8+ | 2026-09-17 (24 d) · el último, hace 3 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | USD | **A verificar**: no está claro quién es ni si es clínica. Estética orofacial; se vieron 8 en una consulta de 50: puede haber más |
| **Clínica Dental "Sarita"** | 1709119185977006 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz» (indicio, no prueba) | 5 | 2026-09-14 (27 d) · el último, hace 3 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Clinica Dental Ramos** | 105318748337327 | sin indicio | 5 | 2026-10-05 (6 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: ciudad por mirar desde la PC (§6.9, 8-oct). EN ESPERA el 8-oct: ciudad por mirar desde la PC |
| **Cosmetic Dental and Face Center** | 867483409790142 | sin indicio | 5 | 2026-08-16 (55 d) · el último, hace 8 d | «Carillas con un resultado natural» · «Valoración capilar profesional» · «Agenda tu valoración capilar hoy» · «Agenda tu valoración capilar» · «Blanqueamiento con sistema de 3 luces» | no se ve | BOB | **A verificar**: mezcla dental con capilar; ciudad por mirar desde la PC (§6.9, 8-oct). Mezcla dental con valoración capilar; EN ESPERA el 8-oct |
| **Centro Médico Odontológico BAires** | 103698302731501 | salió con «ortodoncia Santa Cruz», «odontología Santa Cruz de la Sierra» (indicio, no prueba) | 4 | 2026-01-22 (261 d) · el último, hace 26 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: ciudad por mirar desde la PC (§6.9, 8-oct) |
| **SOI Servicios Odontológicos Integrales** | 631408986884357 | salió con «ortodoncia Santa Cruz» (indicio, no prueba) | 4 | 2026-10-10 (1 d) · el último, hace 1 d | «Agende su cita» · «Chatea con nosotros» | sí | USD | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Clínica Odontológica Beautiful** | 589482644245798 | salió con «odontología Santa Cruz de la Sierra», «dentista Santa Cruz» (indicio, no prueba) | 4 | 2026-03-16 (209 d) · el último, hace 125 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Natural Smile Santa Cruz** | 100193878311097 | Santa Cruz en el nombre de la página (o su zona) | 3 | 2026-08-06 (66 d) · el último, hace 43 d | «Natural Smile Santa Cruz» | no se ve | BOB | **A verificar**: Santa Cruz en el nombre, tamaño sin dato; hay otra página «Natural Smile Dra. Carrazana»: ¿segunda sede? (§6.6, reserva) |
| **Clinica Dental Center** | 1015671418298509 | salió con «clínica dental Santa Cruz» (indicio, no prueba) | 3 | 2026-08-11 (61 d) · el último, hace 3 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | USD | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Odontología Integral Digital** | 756968257500768 | salió con «dentista Santa Cruz» (indicio, no prueba) | 3 | 2026-04-22 (172 d) · el último, hace 67 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Clinica Dental ROCHA** | 113481741822891 | salió con «ortodoncia Santa Cruz» (indicio, no prueba) | 2 | 2026-08-25 (47 d) · el último, hace 47 d | «Agenda tu cita» | sí | BOB | **A verificar**: Santa Cruz por su página «ClinicaDentalRochaSantaCruz» (fragmento), tamaño sin dato; ¿es la misma que Consultorio Dental Rocha? (§6.6, reserva) |
| **Casa dental sc** | 105650449163721 | Santa Cruz en el nombre de la página (o su zona) | 2 | 2026-08-10 (62 d) · el último, hace 24 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar. «sc» en el nombre: probablemente Santa Cruz (inferencia) |
| **Dental Top** | 110773264549760 | salió con «ortodoncia Santa Cruz» (indicio, no prueba) | 2 | 2026-08-04 (68 d) · el último, hace 24 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Unidental Santa Cruz** | 554435031080616 | Santa Cruz en el nombre de la página (o su zona) | 1 | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Consultorio Dental Rocha** | 169289006270602 | listada el 30-sep por «clínica dental Santa Cruz» (indicio) | 1 | 2026-07-13 (90 d) · el último, hace 90 d | «¡Tu nueva sonrisa comienza aquí» | no se ve | BOB | **A verificar**: «consultorio» sugiere una sola persona; ciudad sin dato (§6.6) |
| **Clinica Dental KOREA** | 697014900382758 | listada el 30-sep por «clínica dental Santa Cruz» (indicio) | 1 | 2026-08-07 (65 d) · el último, hace 65 d | «726-29818» | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Happy Dent** | 608572659242258 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz» (indicio, no prueba) | 1 | 2026-09-09 (31 d) · el último, hace 31 d | «Happy Dent \| Ortodoncia en Happy Dent \| Renová tu sonrisa ✨» | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Clínica Dental Dulce Sonrisa** | 101512028641874 | salió con «clínica dental Santa Cruz», «dentista Santa Cruz» (indicio, no prueba) | 1 | 2026-10-03 (8 d) · el último, hace 8 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Implantes Dentales** | 106274010711823 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz» (indicio, no prueba) | 1 | 2026-10-07 (4 d) · el último, hace 4 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no está claro quién es ni si es clínica. Página genérica de implantes; no se sabe quién es |
| **Fresh Denture** | 913517105184132 | salió con «clínica dental Santa Cruz» (indicio, no prueba) | 1 | 2026-10-06 (4 d) · el último, hace 4 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no está claro quién es ni si es clínica. Nombre de prótesis/laboratorio; no es claro que sea clínica |
| **Odonto Click** | 413881708472622 | salió con «ortodoncia Santa Cruz» (indicio, no prueba) | 1 | 2026-09-17 (24 d) · el último, hace 24 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no está claro quién es ni si es clínica |
| **Estudio_oral** | 113111194494738 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz» (indicio, no prueba) | 1 | 2026-10-10 (1 d) · el último, hace 1 d | «Semana Invisalign 12 al 16 de Octubre» | no se ve | USD | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Oral Group Clínica Dental** | 950490698330677 | salió con «clínica dental Santa Cruz» (indicio, no prueba) | 1 | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | USD | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Clínica Fundepi** | 908015955728944 | salió con «ortodoncia Santa Cruz» (indicio, no prueba) | 1 | 2026-01-23 (261 d) · el último, hace 261 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | USD | **A verificar**: no está claro quién es ni si es clínica. Estética (plantilla de catálogo sin rellenar) |
| **Másqsonrisas Santa Cruz / Bolivia** | 416106969199277 | Santa Cruz en el nombre de la página (o su zona) | 1+ | 2026-10-10 (1 d) · el último, hace 1 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Consultorio dental Syriadent** | 103586632489948 | salió con «dentista Santa Cruz» (indicio, no prueba) | 1+ | 2026-07-07 (96 d) · el último, hace 96 d | «Agenda tu cita» | sí | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Epica Centro Odontológico** | 437878689605332 | sin indicio | 1 | 2026-10-07 (4 d) · el último, hace 4 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: ciudad por mirar desde la PC (§6.9, 8-oct). EN ESPERA el 8-oct: ciudad por mirar desde la PC |

## 4. Fuera por evidencia previa, aunque pautan hoy

> Esta tabla existe para que nadie las vuelva a contar como señal. La cantidad de anuncios es la que muestra la Biblioteca; no cambia el veredicto.

| Clínica | page_id | Ciudad: evidencia | Anuncios activos | Desde (el más viejo) | Qué promete (titulares) | Botón de chat | Moneda | Lo que ya se sabía (docs del 30-sep al 8-oct) |
|---|---|---|---|---|---|---|---|---|
| **Clínica Dental Imagina** | 817088911667589 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz», «dentista Santa Cruz» (indicio, no prueba) | 27 | 2026-07-01 (102 d) · el último, hace 4 d | «Chatea con nosotros» · «¡ Aprovecha AHORA!» | sí | USD | **Fuera**: cadena: 4 sucursales y +12.000 pacientes declarados; un WhatsApp por sucursal (§6.2) |
| **Ortobom Odontología (Santa Cruz de la Sierra + Mutualista)** | 103822665275137 · 110177058793289 | Santa Cruz en el nombre de la página (o su zona) | 13 | 2026-09-16 (25 d) · el último, hace 4 d | «NUESTRO WHATSAPP👉» · «Chatea con nosotros» · «BRACKETS sin pagar una fortuna👉» | sí | USD | **Fuera**: red de varias sedes: páginas «Santa Cruz» y «Mutualista» (§6.9, 8-oct). Hermana de Ortobom Mutualista (otra sucursal) |
| **Boquita Sana (Dentofacial + Sucursal Udabol)** | 380639486016768 · 100226682495467 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz», «dentista Santa Cruz» (indicio, no prueba) | 10 | 2026-10-02 (9 d) · el último, hace 9 d | «📣Estamos buscando pacientes!» | no se ve | BOB | **Fuera**: 2 sedes en Santa Cruz (Av. Prefecto Rivas y Sucursal Udabol); vuelve solo si Sergio Urcullo acepta 2 sedes (§6.9, 8-oct). Misma campaña que la sucursal Udabol (página 100226682495467) |
| **Clínica Dental Europea** | 1951772081778585 | salió con «clínica dental Santa Cruz», «ortodoncia Santa Cruz», «dentista Santa Cruz» (indicio, no prueba) | 10 | 2026-09-30 (11 d) · el último, hace 6 d | «30% DE DESCUENTO EN MUELAS DEL JUICIO + VALORACIÓN 100% GRATUITA» | no se ve | BOB | **Fuera**: Cochabamba según el directorio (§6.9, 8-oct) |
| **MUN (Clínica Odontología Especializada + Odontopediatría)** | 572588712615373 · 108942198437850 | salió con «odontología Santa Cruz de la Sierra» (indicio, no prueba) | 5 | 2026-03-06 (219 d) · el último, hace 31 d | «Chatea con nosotros» · «RESERVA TU CUPO» · «Mas informacion» | sí | BOB | **Fuera**: 2 sucursales en Santa Cruz, Zona Norte y Zona Sur; vuelve solo si Sergio Urcullo acepta 2 sedes (§6.7, 2-oct). Hermana: MUN Odontopediatría (108942198437850) |
| **Clínica Dental Cortez Santa Cruz Bolivia** | 111017921072549 | Santa Cruz en el nombre de la página (o su zona) | 2 | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **Fuera**: multi-sede: una página por ciudad, «Sucursales en La Paz y Santa Cruz» (§6.6, 1-oct). Tiene otra página para La Paz (101343895932574). El 30-sep llevaba 6+ anuncios; hoy 2 |

## 5. Estaban en la lista del 30-sep y hoy NO tienen anuncios activos

| Página | page_id | Nota |
|---|---|---|
| Clínica Dental San Pedro | 662533600624550 | #1 de los 20 prospectos; 23-sep con clic a WhatsApp |
| Clínica Dental "DS" | 625324393996576 | hipótesis: el lead de la conversación 36 (`ds-santacruz.bo`). **Ya no paga pauta activa** |
| Stildent Santa Cruz | 110445244840996 | hay otra página «Clinica Dental Stildent» (918559771552554) con 2 anuncios, a verificar si es la misma |
| Clínica Dental Vid | 920721404450647 | — |
| DÚO Consultorio Dental | 109306495537111 | — |
| Clínica Dental Sanident | 787098867820512 | — |

«Sin anuncios activos hoy» no dice que cerraron ni que no inviertan: puede ser una pausa o un cambio de página.

## 6. Dentales en Bolivia con ciudad SIN indicio (incompleto: sale de una sola consulta de 50 de 92)

> «Blanqueamiento dental» no lleva ciudad: estas páginas pueden ser de cualquier ciudad de Bolivia. Sirven para saber **quién más pauta**, no para elegir a quién escribir.

| Clínica | page_id | Ciudad: evidencia | Anuncios activos | Desde (el más viejo) | Qué promete (titulares) | Botón de chat | Moneda | Lo que ya se sabía (docs del 30-sep al 8-oct) |
|---|---|---|---|---|---|---|---|---|
| **Clínica Dental Integral Ustaris** | 110444090446243 | sin indicio | 4+ | 2026-10-09 (2 d) · el último, hace 1 d | «Reserva tu cita AQUI» | sí | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Endodent Centro Odontológico** | 718627938215118 | sin indicio | 2+ | 2026-10-08 (2 d) · el último, hace 2 d | «Quiero agendar una cita» | sí | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Clinica Dental Stildent** | 918559771552554 | sin indicio | 2+ | 2026-10-02 (9 d) · el último, hace 9 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar. El 30-sep se listó «Stildent Santa Cruz» (110445244840996), otra página: sin ads activos hoy |
| **SKY Dental Center Plus** | 104353664290431 | sin indicio | 1+ | 2026-10-07 (4 d) · el último, hace 4 d | «Agenda cita Ya!» | sí | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Dental Health suc. Suárez Arana** | 102510038459495 | sin indicio | 1+ | 2026-10-01 (10 d) · el último, hace 10 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Clinica Dentalkt** | 198922956648057 | sin indicio | 1+ | 2026-10-11 (0 d) · el último, hace 0 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Odontología Integral** | 100202315033963 | sin indicio | 1+ | 2026-10-10 (1 d) · el último, hace 1 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Reino Dental SAN PEDRO** | 2244847179114224 | sin indicio | 1+ | 2026-10-09 (1 d) · el último, hace 1 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar. No es la página «Clínica Dental San Pedro» del 30-sep (662533600624550), que hoy no tiene ads activos |
| **OdontoNicky GDLR** | 674864382374715 | sin indicio | 1+ | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Consultorio Dental "Divino Niño"** | 122403477628402 | sin indicio | 1+ | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Pardo Dental** | 168031719724129 | sin indicio | 1+ | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Clinica Dental OralVid** | 105853962262188 | sin indicio | 1+ | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **DentalYS** | 283513188181711 | sin indicio | 1+ | 2026-10-09 (2 d) · el último, hace 2 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Dental Care A&S** | 152609645522464 | sin indicio | 1+ | 2026-10-08 (3 d) · el último, hace 3 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Dentall Bolivia** | 125441410658875 | sin indicio | 1+ | 2026-10-05 (6 d) · el último, hace 6 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | USD | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Salud Bucal** | 561641773702831 | sin indicio | 1+ | 2026-10-03 (8 d) · el último, hace 8 d | «Salud Bucal» | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **Dental Cast** | 243569185515020 | sin indicio | 1+ | 2026-09-29 (11 d) · el último, hace 11 d | «Cuidado dental integral 🦷» | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |
| **RASS Dental Care - Centro Odontológico** | 1286396557890207 | sin indicio | 1+ | 2026-09-29 (12 d) · el último, hace 12 d | — (el texto va en la imagen o el cuerpo; el conector no lo trae) | no se ve | BOB | **A verificar**: no estaba en las listas previas: ciudad y tamaño sin verificar |

## 7. Profesionales con página propia (un profesional: no es el tamaño de 2-6)

Dra. Mishel Rodriguez (1008202805702373, 1 anuncio) · Dr. Abner Valdivia (1732856310310270, 3+ anuncios) · Dra. Jessica Zelaya (1156462164210198, 1+ anuncio) · Dra. Micaela Aliaga Rejas (1217079781480419, 1+ anuncio) · Dra. Lourdes Robles (rehabilitación oral y estética) (1013090891892178, 2+ anuncios) · Dra. Andrea Romero (311234288750022, 1+ anuncio) · Dra. Ashley Viscarra G. (106356259092152, 1+ anuncio) · Dra. Yessenia Galvez Saucedo (1149093801631362, 1+ anuncio) · Dra. Nayra Suyo Rivera (652000974666300, 1+ anuncio) · Kimberly Crespo Odontología Estética (790074584719525, 1+ anuncio) · Dra. Pasapera (106862378310296, 1+ anuncio) · Dra. Montemayor (480913058448332, 1+ anuncio).

## 8. Fuera de la lista, y por qué

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

## 9. Las 5 preguntas: qué se sabe y qué falta

| Pregunta (`ONIA_CLIENTE_IDEAL.md` §9) | La Biblioteca dice | Cómo se contesta |
|---|---|---|
| 1. ¿Cuántos profesionales atienden? (2-6 es el punto dulce) | Solo pistas: varias sedes (que **sacan**), varios anuncios | Preguntarla; **es la primera** |
| 2. ¿Quién agenda las citas? (con recepción, el dolor existe) | Nada. «Agenda tu cita» / «Chatea con nosotros» indican que alguien contesta el chat | Preguntarla; **es la segunda** |
| 3. ¿Cómo llevan la agenda y las fichas? | Nada | En la llamada |
| 4. ¿Cuántos pacientes tienen un tratamiento empezado y no volvieron? (**la que vende**) | Nada | En la llamada; si no lo saben, ya dijeron el problema |
| 5. ¿Facturan con NIT? | Nada | En la llamada |

## 10. Qué sigue, y quién decide

| Qué | Quién |
|---|---|
| Elegir a cuáles contactar entre las **6 candidatas** y aprobar el mensaje y el canal exactos de cada una (borrador: `sales-kit/PRIMER-MENSAJE-8-CLINICAS-11OCT.md`) | Sergio Urcullo |
| Resolver desde la PC las filas «A verificar» (ciudad, tamaño, número que abre WhatsApp); **Sonríe a La Vida**: cruzar con el lead «consultorio dental sonrisa feliz» antes de escribirle | La madre en la PC |
| Decidir si acepta 2 sedes en la misma ciudad (MUN, Boquita Sana): hoy están fuera | Sergio Urcullo |
| Repetir esta lista cada semana con la tanda de competencia (la lista del 30-sep ya perdió 6 páginas) | Ventas y pauta |

**Recomendación de este análisis:** escribir, con el OK de Sergio Urcullo, solo a las **candidatas**, y empezar por las que ya pautan con chat y **tienen Santa Cruz verificada**; el tamaño es la primera pregunta de la conversación. Ningún dato de esta lista justifica escribirle a las 44 páginas: con 5 conversaciones buenas alcanza (ADQ §4).
