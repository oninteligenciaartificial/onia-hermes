# Higgsfield Content Use Cases

## Objetivo
Dar a Hermes una biblioteca comercial para producir contenido para Sergio, ONIA
y clientes por rubro. Cada rubro tiene dolores, formatos, hooks, CTAs,
referencias que debe pedir n8n y limites de seguridad.

Fuente machine-readable (la consumen n8n/Hermes):
`hermes-content/references/higgsfield-content-use-cases.json`. Flujo n8n:
`hermes-content/references/n8n-higgsfield-generation-flow.md`. Este documento es
la version legible por humanos; mantener ambos en sync.

## Como usarlo

1. Elegir rubro.
2. Elegir objetivo: confianza, leads, reservas, ventas, demo o autoridad.
3. Crear Video Lab job con hook, guion, escenas y CTA.
4. n8n arma el paquete de referencias para Higgsfield.
5. Sergio aprueba.
6. Higgsfield genera.
7. Video Lab guarda URL y espera revision.

## n8n como puente hacia Higgsfield

n8n si sirve para que Higgsfield cree mejor porque puede preparar el paquete de
contexto:

- rubro;
- oferta;
- objetivo;
- audiencia;
- estilo;
- guion;
- escenas;
- referencias aprobadas;
- assets permitidos;
- claims seguros;
- negative prompt;
- CTA;
- formato de salida;
- estado de aprobacion.

n8n no reemplaza a Hermes. Hermes decide la estrategia. n8n junta piezas,
agenda, pide aprobacion, registra y entrega el paquete a Higgsfield.

## Casos de uso por rubro

### 1. Clinicas dentales

Ofertas ONIA:

- DentalGest.
- landing dental.
- videos educativos.
- seguimiento de consultas.

Videos:

- "Por que una clinica pierde pacientes aunque tenga buen servicio".
- demo de flujo: consulta -> estado -> cita -> presupuesto -> seguimiento.
- video del doctor explicando un tratamiento sin promesas medicas.
- carrusel-to-reel: errores de seguimiento dental.

Hooks:

- "No siempre pierdes pacientes por precio."
- "Si tus presupuestos quedan en visto, esto te interesa."
- "Tu recepcion no deberia depender de notas sueltas."

CTA:

- "Escribe demo."
- "Pide una auditoria de seguimiento."

No decir:

- curas garantizadas;
- resultados medicos;
- testimonios inventados.

### 2. Esteticas, dermatologia y belleza

Ofertas ONIA:

- videos de confianza;
- agenda/CRM;
- landing de tratamientos;
- seguimiento de valoraciones.

Videos:

- educacion antes de agendar;
- mito vs realidad;
- proceso de reserva;
- UGC estilo "lo que nadie te explica antes de elegir una estetica".

Hooks:

- "Tus consultas no deberian perderse en mensajes."
- "La confianza se gana antes de la cita."

CTA:

- "Agenda una valoracion."
- "Pide informacion del tratamiento."

No decir:

- antes/despues falso;
- resultados garantizados;
- claims medicos no aprobados.

### 3. Restaurantes, cafes y comida

Ofertas ONIA:

- videos de menu/oferta;
- landing de reservas;
- contenido semanal;
- flujo de reservas.

Videos:

- plato estrella;
- promo dia flojo;
- experiencia del local;
- "que pedir si vienes por primera vez".

Hooks:

- "Si estas en Santa Cruz y no sabes donde comer, mira esto."
- "Este plato necesita video, no solo una foto."

CTA:

- "Reserva hoy."
- "Pide el menu."

No decir:

- reseñas falsas;
- descuentos no aprobados;
- fotos de otro restaurante.

### 4. Inmobiliarias

Ofertas ONIA:

- videos de propiedad;
- landing por propiedad/proyecto;
- CRM de interesados;
- seguimiento de visitas.

Videos:

- walkthrough de propiedad;
- comparativa zona/precio/beneficio;
- asesor explicando oportunidad;
- formulario -> visita -> seguimiento.

Hooks:

- "Una propiedad sin video claro pierde interesados antes de la visita."
- "No vendas metros cuadrados, vende la vida que permite."

CTA:

- "Pide la ficha."
- "Agenda una visita."

No decir:

- precios inventados;
- disponibilidad no verificada;
- promesas de inversion garantizada.

### 5. Gimnasios y fitness

Ofertas ONIA:

- videos de reto/oferta;
- landing de inscripcion;
- seguimiento de pruebas;
- calendario mensual.

Videos:

- reto 7 dias;
- tour del gimnasio;
- test de primera clase;
- objeciones: tiempo, miedo, constancia.

Hooks:

- "El problema no es motivacion, es empezar con un plan simple."
- "Si tu gimnasio solo publica maquinas, estas perdiendo historias."

CTA:

- "Reserva una clase de prueba."
- "Escribe reto."

No decir:

- transformaciones falsas;
- promesas fisicas garantizadas.

### 6. Ecommerce y tiendas locales

Ofertas ONIA:

- demos de producto;
- videos UGC;
- landing/oferta;
- seguimiento de compras.

Videos:

- producto en uso;
- problema/solucion;
- comparativa;
- unboxing;
- preguntas frecuentes.

Hooks:

- "Una foto no explica por que alguien deberia comprarlo."
- "Mira como se usa en 10 segundos."

CTA:

- "Pide catalogo."
- "Compra hoy."

No decir:

- stock falso;
- garantias no aprobadas;
- reseñas inventadas.

### 7. Profesionales y marca personal

Ofertas ONIA:

- contenido founder-led;
- agenda/landing;
- videos educativos;
- sistema de citas.

Videos:

- opinion experta;
- caso anonimo;
- errores comunes;
- "como trabajo con clientes".

Hooks:

- "Si vendes servicios, tu confianza se construye antes de la llamada."
- "Tu contenido no tiene que ser viral; tiene que responder dudas reales."

CTA:

- "Agenda una llamada."
- "Guarda esto."

No decir:

- resultados garantizados;
- casos privados;
- promesas financieras/legales no verificadas.

### 8. Consultorios medicos y salud no dental

Ofertas ONIA:

- videos educativos seguros;
- agenda;
- landing informativa;
- seguimiento de consultas.

Videos:

- preguntas frecuentes;
- preparacion para consulta;
- proceso de agenda;
- confianza del equipo.

Hooks:

- "La primera impresion de tu consulta pasa antes de que el paciente llegue."
- "Responder bien una duda puede convertirse en una cita."

CTA:

- "Agenda una consulta."

No decir:

- diagnosticos;
- curas;
- resultados garantizados.

### 9. Educacion, cursos y academias

Ofertas ONIA:

- videos de captacion;
- landing de inscripcion;
- CRM de alumnos;
- embudo de seguimiento.

Videos:

- clase muestra;
- resultado esperado;
- objeciones del alumno;
- tour de plataforma.

Hooks:

- "La gente no compra un curso; compra claridad sobre que va a lograr."
- "Si tu curso no se entiende en video, estas perdiendo alumnos."

CTA:

- "Pide el temario."
- "Inscribete a la clase gratuita."

No decir:

- ingresos garantizados;
- certificaciones no reales.

### 10. Turismo, hoteles y experiencias

Ofertas ONIA:

- videos de experiencia;
- landing de reserva;
- calendario de contenidos;
- seguimiento de consultas.

Videos:

- experiencia en primera persona;
- tour de habitacion;
- itinerario;
- "fin de semana ideal".

Hooks:

- "La reserva empieza cuando alguien se imagina ahi."
- "Tu lugar necesita sentirse antes de venderse."

CTA:

- "Consulta disponibilidad."
- "Reserva tu fecha."

No decir:

- disponibilidad falsa;
- ubicaciones engañosas;
- reseñas inventadas.

### 11. Automotriz, talleres y repuestos

Ofertas ONIA:

- videos de servicio;
- landing de cotizacion;
- CRM de consultas;
- recordatorios de mantenimiento.

Videos:

- antes/despues del proceso si es real;
- tips de mantenimiento;
- cotizacion rapida;
- confianza del taller.

Hooks:

- "Tu taller no solo vende arreglo, vende confianza."
- "Si un cliente pregunta y nadie registra, ese trabajo se pierde."

CTA:

- "Pide cotizacion."
- "Agenda revision."

No decir:

- reparaciones garantizadas sin diagnostico;
- marcas/logos sin permiso.

### 12. Constructoras, arquitectura e interiorismo

Ofertas ONIA:

- videos de proyecto;
- landing de portafolio;
- CRM de cotizaciones;
- contenido de autoridad.

Videos:

- recorrido render/obra;
- proceso de diseño;
- errores al construir/remodelar;
- caso real si esta aprobado.

Hooks:

- "Antes de cotizar, el cliente necesita imaginar el resultado."
- "Un buen proyecto se vende mejor cuando se explica visualmente."

CTA:

- "Pide una evaluacion."
- "Agenda una visita."

No decir:

- costos inventados;
- permisos no confirmados;
- obras no propias.

### 13. Servicios locales

Incluye limpieza, plomeria, electricidad, mantenimiento, seguridad, fumigacion.

Ofertas ONIA:

- videos de confianza;
- landing de cotizacion;
- seguimiento de solicitudes;
- Google/SEO local.

Videos:

- problema comun;
- proceso seguro;
- antes/despues real;
- urgencia y respuesta.

Hooks:

- "Cuando alguien tiene una urgencia, gana quien responde claro."
- "Tu servicio necesita verse confiable en 5 segundos."

CTA:

- "Pide cotizacion."
- "Agenda servicio."

No decir:

- garantias falsas;
- fotos de trabajos ajenos.

### 14. SaaS, software y B2B

Ofertas ONIA:

- demos de producto;
- videos de problema/solucion;
- landing de demo;
- CRM y seguimiento.

Videos:

- antes/despues operativo;
- demo de 30 segundos;
- problema especifico;
- caso de uso por rol.

Hooks:

- "Tu software no necesita mas features; necesita que entiendan el problema."
- "Una demo corta puede vender mas que una reunion larga."

CTA:

- "Pide demo."
- "Mira el flujo."

No decir:

- logos de clientes sin permiso;
- metricas inventadas.

### 15. Sergio marca personal

Objetivo:

- vender confianza;
- mostrar construccion real;
- atraer fundadores y negocios;
- explicar ONIA sin sonar a anuncio.

Videos:

- "Estoy construyendo una maquina de contenido para negocios."
- detras de escena con Hermes, n8n, Higgsfield;
- aprendizajes de vender SaaS en Bolivia;
- errores y decisiones reales.

Hooks:

- "Estoy intentando convertir ONIA en una maquina que venda mientras construimos."
- "No quiero hacer contenido bonito; quiero hacer contenido que traiga conversaciones."

CTA:

- "Escribeme tu rubro."
- "Te muestro el sistema."
- "Sigue el proceso."

No decir:

- ingresos inventados;
- autoridad falsa;
- promesas de exito rapido.

## Primer paquete de produccion recomendado

1. Sergio: manifiesto corto del sistema de contenido ONIA.
2. ONIA/DentalGest: clinica dental pierde pacientes por seguimiento.
3. Cliente demo: restaurante/cafe con video de oferta.
4. Gesti-OS: Excel infinito en pymes.
5. Web ONIA: tu Instagram no reemplaza una landing.

## Archivos relacionados

- `HIGGSFIELD_VIDEO_SYSTEM.md`
- `CLIENT_CONTENT_PRODUCTION_SYSTEM.md`
- `HIGGSFIELD_CLIENT_SALES_PLAYBOOK.md`
- `hermes-content/references/higgsfield-content-use-cases.json`
- `hermes-content/references/n8n-higgsfield-generation-flow.md`
