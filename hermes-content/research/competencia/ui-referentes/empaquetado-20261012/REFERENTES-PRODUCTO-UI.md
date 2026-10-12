# Referentes de producto/UI: empaquetar sin trasladar complejidad

2026-10-12 · Encargo Sergio Urcullo · worker orbix_analisis · madre revisa.
META: cubrir referentes documentados de producto, clínica, conversación y web IA; PRUEBA: fuentes oficiales actuales, lectura de cuenta existente y capturas; PARADA: sin generaciones, gasto, cuentas nuevas, publicación, contacto ni implementación.

## Decisión útil

ONIA debe tener un solo plan integrado y un recorrido guiado: negocio/rubro → datos necesarios → vista previa → revisión → resultado. Los referentes reducen decisiones mediante recetas, ejemplos, defaults e infraestructura gestionada. No todos ocultan modelos: Higgsfield y Lety todavía los muestran. Tomar su empaquetado, no importar toda su navegación ni su modelo comercial.

La instrucción vigente de **un solo plan integrado** fue confirmada por continuidad y se registra en `PRODUCT.md`/estrategia/handoff (commit `45c84312`). Los add-ons de esta matriz describen competidores, no proponen packs nuevos para ONIA.

## Cobertura y matriz de observaciones

**O:** oferta/documentación oficial pública leída ahora; **V:** UI visible capturada; **C:** lectura autenticada de connector; **H:** evidencia histórica local, sin revalidación interna. Una landing que promete un proceso no prueba su resultado.

**Quién revisa:** worker `orbix_analisis` ejecutó la lectura y contrastó las capturas; madre `/root` revisa el informe y decide qué entra al plan ONIA. Continuidad inventarió las referencias y preserva la decisión comercial; no hizo una segunda auditoría visual.

**Lista exacta por estado:** lectura pública actual de Higgsfield, Lety, Dapta, ManyChat, Cal.com, Dentalink, Medilink, Doctocliq, AgendaPro, SendyPro, Chatwoot, **Durable, Hostinger AI, Wix AI, 10Web y Squarespace** (16). Orbix reutiliza su auditoría cerrada. Citalo no accesible; TuDoc parcial/timeout. Los cinco builders web están revisados a nivel de fuente pública, y queda sin verificar su recorrido interno intake → preview → resultado. Interacción observada en este lote: catálogo y apertura del modal Product Link de Higgsfield; landing/demo pública de Lety. Ninguno de esos accesos equivale a generación o validación end-to-end.

| Referente y fuente | Decisiones que simplifica / entrada → resultado declarado | Límites observados y acceso real |
|---|---|---|
| [Higgsfield Marketing](https://higgsfield.ai/marketing-studio), [Ads Studio](https://higgsfield.ai/ads-studio) | Plantilla por tipo de pieza; entrada web/producto y kit de marca; receta fija parte de formato/modelo/prompt. Product Link presenta un campo, no un brief técnico. | O/V/C. Catálogo y modal vistos; no Continue/Generate ni resultado nuevo. Connector get_profile autenticado; Chrome muestra Login: no confundir esas sesiones. |
| [Lety](https://lety.ai/), [planes](https://lety.ai/pricing/) | Rubro/nicho/brief, fuentes y herramientas; dashboard bajo marca de agencia. Los siete pasos y selector Brain siguen expuestos en demo pública. | O/V. Tarifa de plataforma + costes de LLM/WhatsApp separados según su web; prueba requiere tarjeta. No se creó agente ni se operó cuenta. |
| [Dapta](https://dapta.ai/), [planes](https://dapta.ai/pricing/) | Agentes texto/voz, calificar y agendar; implementación asistida según nivel. | O/H. Créditos, usuarios, workspaces y almacenamiento limitados aunque agentes/flujos se anuncien ilimitados. Playground/configuración actual no operados; cuenta histórica no demuestra acceso hoy. |
| [ManyChat](https://manychat.com/), [planes](https://manychat.com/pricing) | Quick Automations y plantillas por objetivo: bienvenida, FAQ, comentario → DM. | O. Límites por contactos activos, canales, automatizaciones/usuarios e Inbox; capacidades IA según nivel. No canal conectado ni flujo ejecutado; precio del plan no prueba coste total del canal. |
| [Cal.com](https://cal.com/), [planes](https://cal.com/pricing) | Conectar calendario → disponibilidad → tipo de reunión; motor evita conflictos según oferta. El invitado elige hueco, no infraestructura. | O. Teams/Organizations separan capacidad, permisos y routing; no reserva real. Hosted, self-hosted y API no se trataron como licencia o coste equivalentes. |
| [Orbix](https://www.orbix.studio/) | Familia de páginas y casos/CTA coherentes; calificación por contacto. | Reusar [informe existente](../../../orbix-2026-10-12/INFORME.md), commit `6bc40cc4`; no duplicado. Oferta agencia, no producto SaaS operado. |
| [Dentalink](https://www.softwaredentalink.com/) | Agenda, ficha, presupuesto, cobro y retorno del paciente presentados por etapas. | O/H. Planes Esencial/Pro/Titanium por cotización; sin cuenta actual. Capturas internas antiguas solo como antecedentes. |
| [Medilink](https://www.softwaremedilink.com/) | Ficha por especialidad, agenda por profesional, pagos y ejemplos IA. | O/H. Cobro depende de médicos según FAQ; demo comercial. Ejemplo de chat/agendamiento no prueba integración real. |
| [Doctocliq](https://www.doctocliq.com/) | Antes/durante/después de consulta; software integrado con especialidades. | O/H. Prueba anunciada siete días; Marketing y Soyla IA aparecen como complementos. No se reabrió prueba ni se verificó qué incluye cada país. |
| [AgendaPro](https://agendapro.com/es) | Agenda, sitio de reservas, WhatsApp/IA, ventas y marketing presentados como tareas del negocio. | O/H. Landing y módulos; reserva/configuración/paquetes actuales no ejecutados. |
| [Citalo](https://citalo.com/) | Referente documentado de agenda/recordatorios. | No accesible en web tool; H en `AGENDAPRO_CITALO_TEARDOWN.md`. Sin afirmaciones actuales de UI, límites ni precios. |
| [TuDoc](https://tudoc.com.bo/) | Referente boliviano de consultorio documentado. | Respuesta inicial parcial y posteriores timeout; H en `TUDOC_TEARDOWN.md`. No se validó hoy producto ni CTA; no repetir conclusiones históricas como estado actual. |
| [SendyPro](https://sendypro.com/) | Conectar → configurar IA/productos/respuestas → activar flujos/CRM → ampliar conexiones. | O/H. Publica límite diario en entrada y paquetes de conexiones; QR/API respaldos e ilimitados son claims del proveedor, no validación ni recomendación ONIA. No canal conectado. |
| [Chatwoot](https://www.chatwoot.com/) | Inbox común; Captain usa fuentes, responde/deriva y propone FAQs para revisión. | O. Copiloto distingue borrador y envío humano; cuenta, resolución efectiva y coste IA no verificados. |
| [Durable](https://durable.com/) | Negocio integrado con web, CRM, reservas e IA; promete elegir modelos por el cliente. | O/H. Landing actual cambia el foco a business builder. No se ejecutó creación/preview; no arrastrar precios o gates del estudio de septiembre. |
| [Hostinger AI](https://www.hostinger.com/ai-website-builder) | Describir → ajustar texto/diseño → publicar; hosting/dominio/email empaquetados. Manual y Agentic mode. | O/H. Agentic tiene créditos de prompting y recargas; no se generó ni pagó. hPanel sigue solo como antecedente local de navegación. |
| [Wix AI](https://www.wix.com/ai-website-builder) | Prompt → web → ajustes con Aria o editor → publicar; soluciones negocio integradas. | O/H. Inicio gratis declarado no equivale a dominio/plan/uso API gratis. Editor y salida no operados. |
| [10Web](https://10web.io/ai-website-builder/) | Prompt → generación → ajustes por copiloto/editor → publicación; identifica categoría y páginas según su oferta. | O/H. Dominio tras upgrade según FAQ; prueba y continuidad comercial, sin generar. No copiar webs por URL ni asumir derechos de contenido. |
| [Squarespace](https://www.squarespace.com/) | Blueprint AI: preguntas → sugerencias de copy/imagen/diseño → revisar/ajustar → web; alternativa plantilla. | O/H. Página actual accesible; la antigua URL 404 no prueba caída del producto. No builder, prueba, compra ni licencia verificadas. |
| Tiendanube | Solo aparece como intento histórico fallido en configuradores. | Excluido de aprendizaje actual: e-commerce fuera del foco web/IA de este lote y sin flujo previo validado. No repetir 404 histórico como indisponibilidad hoy. |

## Tres adaptaciones implementables, aún sin implementar

1. **Intake único con defaults por rubro.** Pedir negocio/rubro, objetivo, servicios/horarios y fuente opcional; revisar el brief extraído antes de usarlo. Dental: disponibilidad, tipos de cita y reglas; multirrubro: vocabulario/campos específicos; web: estructura y contenido. Modelo/proveedor/prompt/retries se deciden en backoffice. **Aceptación:** los datos aprobados llegan al asistente y a la web; un dato ausente se pregunta, no se inventa. Base: Higgsfield Product Link/Ads Studio, Lety y builders web.
2. **Preview de la configuración real y acción final separada.** Mostrar ejemplo de conversación/reserva y preview web con los datos aprobados, estado y siguiente paso. Indicar qué es simulación y qué está conectado. Activar/publicar conserva aprobación. **Aceptación:** cambiar un horario/precio del brief cambia la preview; no confirmar cupo sin agenda; resultado y fuente recuperables. Base: recipes Higgsfield, revisión Blueprint, operación por etapas Doctocliq y derivación Chatwoot. Advertencia Dapta histórica: un playground distinto del agente real da falsa confianza; no se revalidó esa incidencia.
3. **Plan integrado con uso visible en unidades del negocio.** Gestión + WhatsApp + web IA en un recorrido, con límite incluido y estado de uso; consumo técnico/coste/proveedor interno. Mostrar el coste o límite antes de una operación que exceda el alcance, sin inventar importes ni umbrales. **Aceptación:** ninguna llamada pagada oculta ni “ilimitado” general; distinguir borrador, aprobado, activo y bloqueado. Base: límites ManyChat/Dapta, disponibilidad Cal y billing Higgsfield. No exige importar sus add-ons ni cambiar hoy precio/contrato ONIA.

## Costes: corrección expresa

**“Todo gratis por API” es falso.** [API Higgsfield](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api): producto separado, saldo USD y cobro por generación; el plan web no lo cubre. [Créditos](https://higgsfield.ai/creator-hub/help-center/credits/how-credits-work): MCP/CLI y otras herramientas automatizadas consumen créditos; Unlimited/free gens corresponden solo a la web bajo sus condiciones. Una lectura de perfil/catálogo no generó media. No se midió coste de operación concreta ni se autorizó gasto.

## Cobertura completa del inventario acotado y exclusiones

Inventario: `ui-referentes/README.md`, `configuradores-web-ia-2026-09-17.md`, `PRODUCTO_COMPETENCIA_RESUMEN.md`, `MAPA_COMPETENCIA.md`, `ONIA_NIVEL_REFERENTES_BRECHA.md`, `ONIA_WEB_FACTORY_Y_PRODUCTO_UI.md` y fila de grupos de continuidad en handoff `codex-cloud-pc-20261011.md`. Los 19 referentes principales arriba tienen lectura actual, reuso Orbix o bloqueo explícito; Tiendanube se excluye expresamente.

- **Piso interno:** Bench, Garabato, HSB Engineers; se conserva la instrucción de calidad, sin reauditar entregas ni copiar identidad en este lote.
- **Resto del mapa34, excluido del research actual:** Doctoralia, Eholo, Agenda en Día, Dt.Dental, Huli, Reservo, Clinera, Calu, CitaPro, Calendico, Medizona, NativeCode (segmentos clínicos o evidencias comerciales adicionales); Alegra, Siigo, Odoo, Bind, Holded, eDoc Pyme, Control Facilito, Mi Factura Bolivia (ERP/fiscal); Forges y Datec (servicios locales); Kommo, Leadsales, Wati, Fluker AI, Jelou (CRM/conversación adicionales). Siguen documentados en sus fichas; no necesarios para decidir las tres adaptaciones y no investigados ahora, de acuerdo con recorte de madre/continuidad. “Todos” cubre todo el inventario por estado, no todos sus productos internos.
- **Media y referencias visuales externas:** Lucía, anuncios, lipsync y cada creador/reel fuera de alcance; Higgsfield aquí solo UX/empaquetado.

## Prueba y límites

Webs oficiales leídas el 12-oct; claims no auditados independientemente. Cuenta Higgsfield comprobada mediante get_profile; marketing_list_video_presets devolvió 26 formatos, con recetas que contienen modelo/duración/aspecto/prompt/producto/avatar y previews. Se guarda solo resumen de estructura, sin IDs de cuenta ni assets privados.

Chrome OnIA disponible en este lote: 01 catálogo Marketing; 02 modal Product Link sin rellenar; 03 landing Lety con demo pública. Archivos abiertos e inspeccionados. Modal 02 contiene región de media vacía/cargando: sirve para probar intake, no preview del resultado. Captura adicional Lety tras scroll falló por timeout; no se usa ni se declara entregada. UI Higgsfield tenía Login aunque connector sí estaba autenticado; no se forzó login, MFA ni puente. La bóveda prevista no existe en esta ruta verificada; no se pidió secreto porque las lecturas posibles bastaron.

No se operaron cuentas de otros referentes: inventario Chrome no contenía sus tabs y no se pidieron nuevas credenciales. Sin pruebas end-to-end, mobile de este lote, publicación, backend inferido ni pruebas de coste real. Orbix conserva su cobertura visual desktop/móvil previa. Modelo real no observable en herramienta; worker heredado, sin override.
