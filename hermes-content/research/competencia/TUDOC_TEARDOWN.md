# Teardown — TuDoc (tudoc.com.bo)

**Medido el 2026-10-01**, sin crear cuenta, sin llenar formularios y sin pedir demo.
Capturas en `tudoc/`. Fuentes: [S] = sitio `tudoc.com.bo` (HTML + bundles JS bajados con curl);
[PW] = Playwright/Chromium, pantalla renderizada y mirada; [AS] = App Store (API `itunes.apple.com/lookup`);
[FB] = Facebook; [T] = blog de Turnito; [OC] = `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`.

## 0. Lo primero: no se puede ver el programa por dentro

- El sitio es **una sola landing** (Next.js detrás de Caddy, o sea un VPS propio) [S, cabeceras HTTP].
  **No hay ninguna captura del producto**: el fondo del hero es una foto de stock de un consultorio [PW `home_full_desktop.png`].
- No hay video: YouTube no devuelve nada de TuDoc [búsqueda web]. El botón «Ver TuDoc en acción» **no hace nada** [PW].
- **Los cuatro CTA están muertos** [PW + S]:
  - «Comenzar Gratis» y «Conocer planes» no navegan ni hacen scroll.
  - El formulario «Agendar mi demostración» **no es un `<form>`**: no tiene handler ni endpoint (0 `<form>` en el HTML; el bundle es un `div` con un botón).
  - Hoy **un lead no les puede llegar por la web**.
- El sitemap declara `/precios` y `/facturacion-siat`, y **las dos dan 404** [S `sitemap.xml`, `lastmod` 2026-04-02].
- «Términos» y «Privacidad» apuntan a `#` [S]. No hay teléfono, email ni WhatsApp en todo el sitio [S].
- El roadmap dice «Actualizado Q1 2025» y promete cosas para «Q3 2025» y «Q4 2025» que siguen sin marcarse como hechas.
  Los ids `CHU-64…CHU-75` parecen tickets de Linear copiados tal cual [S].
- Conclusión: todo lo que sigue son **afirmaciones de la landing**, no funciones observadas.

## 1. Módulos (lo que dicen tener)

| Módulo | Qué se ve | Fuente |
|---|---|---|
| Agenda | «Agenda Médica Inteligente», horarios por especialista y sincronización con Google Calendar | [S] |
| Historia clínica | «Historias Clínicas Digitales», plantillas por especialidad, recetas electrónicas con vademécum, PDF | [S] |
| Odontograma | **No aparece.** Cero menciones de odontograma, dental o dientes en el HTML ni en el JS. El producto es médico general | [S grep] |
| Recordatorios | «Automatiza recordatorios», **sin decir el canal**: no nombra WhatsApp, SMS ni correo para el paciente | [S] |
| Pacientes inactivos / recall | **No aparece** (0 menciones de recall, inactivo, seguimiento o tratamiento) | [S grep] |
| Facturación SIAT | Ver abajo | [S] |
| Caja | No hay caja ni cierre. Solo «Dashboard Financiero» (ingresos diarios, pagos) | [S] |
| Reportes | El mismo dashboard financiero, más una «Auditoría» con registro inmodificable | [S] |
| IA | «Resúmenes clínicos con IA» del historial. El escriba ambiental (notas SOAP) figura como «Próximamente» | [S] |
| App | **No tienen app propia** (ver §3) | [AS] |
| Soporte | «Soporte técnico real en Bolivia, por WhatsApp y sin bots», pero no publican el número | [S] |
| Onboarding | «Migramos tus pacientes y agendas» y «capacitamos en menos de 2 horas». Es por demo, sin alta sola | [S] |
| Otros | Multi-clínica (sucursales), integración de laboratorio, roles, búsqueda global, notificaciones | [S] |
| Roadmap | Nómina y comisiones («en desarrollo»), consentimiento digital, FHIR, portal del paciente | [S] |

**SIAT, cómo y en qué modalidad:**
- Dicen «Facturación en Línea SIAT», «facturas autorizadas al instante» y «actualizamos las normativas del SIN automáticamente» [S].
- El JSON-LD dice «facturación en línea SIAT autorizada por el SIN» [S].
- **No dicen la modalidad.** Por la redacción sería Computarizada en Línea con su propio sistema, pero es inferencia.
- No muestran NIT, certificado ni código de sistema. La página `/facturacion-siat` que lo explicaría da 404.

## 2. ¿Recall de pacientes que dejaron el tratamiento a medias?

**No.** No hay ninguna mención de recall, pacientes inactivos, seguimiento ni tratamientos en curso.
Su modelo es consulta médica (SOAP, recetas, laboratorio), no plan de tratamiento por etapas.
Lo más cercano son las «notificaciones en tiempo real», que avisan al médico de pagos y laboratorio, no al paciente [S].

## 3. Precio y clientes reales

- **Precio: nada.**
  - Ni en el sitio, ni en `/precios` (404). El JSON-LD declara `price: "0"`, que es un valor por defecto, no un precio [S].
  - Turnito confirma: «los precios exactos requieren contacto comercial» [T].
- **«+200 clínicas · +50k citas · 4.9★ · 99.9%»** no tienen respaldo visible [S]:
  - No dicen de dónde sale el 4.9★: no hay reseñas en ningún lado.
  - Los contadores se renderizan en 0 antes de la animación [S].
- **Logos «Confían en nosotros»:** son nombres de texto sin logo (Clínica Santa María, Hospital Metropolitano, Centro Médico Andes, Salud Total, Medicina Integral, MedCenter Pro, HealthFirst).
  - «MedCenter Pro» y «HealthFirst» son nombres de plantilla en inglés.
  - Sin ciudad, sin link y sin testimonio con nombre. **Tienen pinta de placeholder** [S, PW].
- **Testimonios con nombre: cero** [S].
- **App Store id1435104984 NO es de ellos** [AS `appstore_id1435104984_shot1.png`]:
  - Es «TuDOC» de *Primary Care Partners of Mexico, LLC*, la app de pacientes de una clínica mexicana (precios en $ MXN).
  - Última versión 2.7 del 2021-07-22. **0 reseñas, 0 calificación.**
  - Buscar «tudoc» en la App Store de Bolivia no devuelve otra app.
  - **Ojo:** el blog de Lideresmexicanos sobre «Tu Doc» también es de esa empresa mexicana.
- **Facebook «Tu Doc En Linea»** [FB, vía resultado de búsqueda]:
  - Es telemedicina en La Paz, con contacto `tudocbolivia@gmail.com` y +591 78824457.
  - Tiene muro de login: no se pudo abrir ni capturar.
  - **No está probado que sea la misma empresa** que el software (el sitio no enlaza redes).
  - Existe también `pinterest.com/tudocbolivia`.
- Turnito y los resúmenes de buscadores **repiten las cifras de la landing** sin verificarlas.
  Turnito suma «videollamadas propias», que el sitio no menciona [T].

## 4. TuDoc contra Onia

| Tema | Ellos tienen (dicho) | Onia tiene [OC] | Quién lo hace mejor |
|---|---|---|---|
| Agenda | Agenda y Google Calendar | Agenda y citas, link de reserva online desde Crece | Onia: se ve funcionando y tiene reserva pública. Ellos, por Google Calendar |
| Historia clínica | HC médica, plantillas, recetas con vademécum, laboratorio | Ficha con HC y tratamientos | TuDoc en lo médico general (recetas, laboratorio) |
| Odontograma | No | Sí (dental) | **Onia** |
| Recordatorio al paciente | «Automatiza», sin canal | Correo 24 h y 2 h antes; WhatsApp todavía no | Empate dudoso: Onia lo prueba, ellos no dicen el canal |
| Recall / tratamiento a medias | No | Agente «Tratamiento a medias», diario | **Onia** |
| SIAT | Dicen que está vivo | En certificación y apagado (§7) | **TuDoc**, si es cierto |
| Caja | No (dashboard) | Cobros, facturas, caja en comercio, contabilidad | Onia |
| Reportes | Dashboard financiero + auditoría | `/reports` desde Profesional | Parejo. Ellos venden la auditoría |
| IA | Resumen del historial | Agentes que proponen y el dueño aprueba | Distinto. Lo suyo ahorra tiempo al médico, lo de Onia trae plata |
| Multi-sucursal | Sí | No (§7) | **TuDoc** |
| App | No tienen | No tiene | Nadie |
| Soporte | WhatsApp humano (dicho) | Sergio Urcullo | Parejo. Ellos lo prometen en la venta |
| Onboarding | Migración + capacitación de 2 h, por demo | Alta sola y 14 días gratis sin tarjeta | **Onia** en fricción. **TuDoc** en promesa de migración |
| Precio | Oculto | Público, checkout propio | **Onia** |
| Captación web | CTA y formulario muertos | Alta abierta que funciona | **Onia** |
| Prueba social | Cifras y logos sin respaldo | Cero (y no inventa) | Nadie |

## 5. Top 5 de lo que tienen y a Onia le falta (clínica de 2-6 profesionales, Santa Cruz)

1. **SIAT vendido como vivo.** Es la objeción fiscal que cierra la venta. Onia no lo puede nombrar hasta certificar [OC §6-7].
2. **Migración de datos y capacitación prometidas** («migramos tus pacientes», «menos de 2 horas»). Bajan el miedo a cambiar de sistema.
3. **Recetas electrónicas con vademécum e impresión en PDF.** Es lo diario del médico, y Onia no lo lista.
4. **Multi-sucursal y roles por profesional** en una cuenta. Onia tiene roles pero no sucursales.
5. **Resumen del historial con IA y registro de auditoría.** Son argumentos de «moderno y seguro» fáciles de mostrar en la demo.

## 6. Top 3 de lo que Onia hace mejor

1. **Recall del tratamiento a medias.** Ellos no lo tienen ni lo nombran, y es justo el dolor de entrada de Onia.
2. **Odontograma y vocabulario dental.** TuDoc es médico general y no le habla al dentista.
3. **Se puede probar y comprar solo**: alta en 2 pasos, 14 días sin tarjeta y precio público.
   TuDoc no muestra precio, ni pantallas, ni demo, y sus botones no funcionan.
   Al que compara, Onia le gana en el primer clic.

## Capturas

- `tudoc/home_full_desktop.png`: la landing entera, a 1440 px.
- `tudoc/home_hero.png` y `tudoc/home_mobile.png`.
- `tudoc/appstore_id1435104984_shot1.png`: la app mexicana, con el logo «TuDOC — la nueva forma de ir al doctor».
- Facebook no se capturó porque pide iniciar sesión.

**Nota técnica:** Chromium no conecta directo a `tudoc.com.bo` desde esta red (ERR_TOO_MANY_RETRIES).
La página se renderizó interceptando las peticiones y sirviéndolas con curl, con el mismo HTML y JS de producción.
