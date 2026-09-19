// Las preguntas de la portada, en su propio archivo.
//
// Estaban dentro de page.tsx y no se podian reusar: la exploracion /v4 las
// necesita y copiarlas habria creado una segunda lista de respuestas — con
// cifras — que se desincroniza en la primera edicion. Un dato que se muestra
// en dos pantallas vive en un archivo, no en dos.

import { PRUEBA, bs, cuantosPlanes, nombresConChatbot, traeOTraen } from "@/lib/pricing";

import { CHATBOT_PLAN, precioStack } from "@/content/chatbot-precios";
import { CUANTOS_RUBROS } from "@/content/rubros";

import {
  ALTA_VERBO_VOS,
  DE_DONDE_LLEGA_EL_ENLACE,
  PASO_CONFIRMAR_CORREO,
} from "./alta";

/**
 * FAQ de la portada — respuestas con los números TRAÍDOS de las fuentes.
 *
 * El verbo del alta NO se escribe acá: sale de `./alta`. El 23-ago se barrió a
 * mano a "pedís tu acceso" (el alta estaba cerrada) y cuando el alta se reabrió
 * esta respuesta quedó atrás pidiendo permiso para entrar a un formulario que ya
 * crea la cuenta sola. La prueba de 14 días sin tarjeta es cierta en las dos
 * ramas y es lo que se promete.
 *
 * Las cuatro preguntas nuevas (carga de datos, aprender a usarlo, dejar de
 * pagar, rubro fuera de la lista) son las que frenan la compra. Ninguna
 * respuesta se redactó de cero — cada una cita su fuente en el repo.
 */
export const FAQ = [
  {
    q: "¿Necesito tarjeta para probar?",
    // El paso del medio NO se tipea: sale de `alta.ts`, que sigue a lo que el
    // producto exige. Faltaba, y es el último clic del embudo: sin confirmar, el
    // login contesta 403 y el lead no tiene cómo saber qué le faltó.
    a: `No. La prueba de ${PRUEBA.dias} días no pide tarjeta ni pago: ${ALTA_VERBO_VOS}, ${PASO_CONFIRMAR_CORREO} ${DE_DONDE_LLEGA_EL_ENLACE}, elegís tu rubro y usás el plan ${PRUEBA.planQueCorre} completo esos ${PRUEBA.dias} días.`,
  },
  {
    // lib/pricing.ts:283 (CONDICIONES) + (sitio)/empezar/page.tsx (paso 02).
    // La pregunta es "¿los cargo yo?" y la respuesta vieja no la contestaba:
    // decía "alguien que te la explica" y seguía de largo. Se contesta que sí,
    // con la herramienta que existe de verdad (app/api/patients/import y
    // app/api/comercio/products/import: CSV con asistente de columnas).
    q: "¿Los datos del Excel o del cuaderno los cargo yo?",
    // La cantidad de planes tampoco se tipea: sale de `cuantosPlanes()`. Decía "los tres planes"
    // y la escalera C (12-sep) ya vendía cuatro — el lead parado en el Crece leía una promesa de
    // plata que no lo nombraba, con las cuatro tarjetas a la vista.
    a: `Sí, los cargás vos, y no a mano uno por uno: hay importación por CSV con un asistente que te va diciendo qué columna es cada cosa. No arrancás con la pantalla vacía — la cuenta llega con la configuración de tu rubro puesta. En los ${cuantosPlanes()} planes no cobramos implementación ni migración: el checkout cobra solo el plan. Grupo / Empresarial sí lleva implementación acompañada y se cotiza aparte.`,
  },
  {
    // Acá decía "alguien que te la explica", y ese alguien no existe: el alta es
    // automática y no avisa a nadie que te llame. Lo cierto es el asistente de
    // puesta en marcha del producto y el WhatsApp, que sí contesta.
    q: "¿Y si no sé de computación? ¿Quién me enseña?",
    a: "Nadie instala nada ni arranca un proyecto de meses: la cuenta llega con la configuración de tu rubro puesta y el sistema te lleva paso a paso por la puesta en marcha. Si te trabás después, escribinos por WhatsApp.",
  },
  {
    // content/legal/terminos.md:83 (sin permanencia) y §3.4 (mora: gracia →
    // suspensión con datos intactos, nunca borrado inmediato) + pricing.ts:284.
    q: "¿Y si dejo de pagar, pierdo todo?",
    a: "No. No hay contrato de permanencia: podés no renovar, sin penalidad. Si un pago no entra, primero hay un período de gracia con el servicio activo y avisos; después el acceso se suspende, pero tus datos se conservan intactos — la suspensión nunca implica borrarlos. Y los exportás en CSV cuando quieras, sin importar el plan.",
  },
  {
    // (sitio)/rubros/page.tsx:78-80 y (sitio)/contacto/page.tsx:118-121.
    q: "¿Sirve para mi rubro si no está en la lista?",
    a: `Onia no es un software distinto por industria: es el mismo núcleo con módulos y vocabulario propios. Hoy la cuenta se arma sola para los ${CUANTOS_RUBROS} rubros que ves en Rubros. ¿El tuyo es otro? Escribinos por WhatsApp y lo vemos con tu caso.`,
  },
  {
    q: "¿La factura al SIN ya funciona?",
    a: "Nuestro emisor está registrado ante el SIN y la homologación está en trámite. Mientras tanto cada venta queda lista y facturás en el Portal Web del SIN, gratis y legal. Te avisamos apenas concluya. Está contado entero, con las resoluciones y las fechas, en la página de facturación.",
  },
  {
    q: "¿El chatbot de WhatsApp está incluido?",
    // Depende del plan, y decir "no" a secas le cobraba Bs 390/mes al cliente de Full por algo que
    // su plan ya le da (`whatsappIncluded` en el catálogo del producto). Lo ata
    // `scripts/inclusion-chatbot.mjs`; quién lo trae NO se tipea acá.
    a: `${nombresConChatbot()} ya ${traeOTraen()} el chatbot de WhatsApp incluido. En los demás planes va aparte, ${precioStack(CHATBOT_PLAN)}. El botón de WhatsApp de tu web sí va gratis.`,
  },
  {
    // El export integral NO se gatea por plan: `onia-platform`
    // `app/api/settings/export/route.ts:14` lo dice en su propio comentario
    // («es un derecho del titular, no una feature del plan»), y la prueba corre
    // con el plan Pro (`TRIAL_PLAN`). Acá decía «en cualquier plan pago»: una
    // condición que el producto no impone, y que se la negaba justo a quien
    // está probando, que es quien abre esta pregunta antes de decidir.
    q: "¿Mis datos son míos?",
    a: "Sí. Los exportás en CSV cuando quieras, también durante la prueba: llevarte tus datos es un derecho tuyo, no una función del plan. No vendemos datos ni entrenamos modelos con ellos.",
  },
];
