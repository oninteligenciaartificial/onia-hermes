import * as viejo from "./old/voseo-ratchet.ts";
import * as nuevo from "./new/voseo-ratchet.ts";
// [texto, esTuOVos]  — verdad de terreno escrita a mano para copia de interfaz en español de Bolivia
const casos: [string, boolean][] = [
  // VOS / TÚ que DEBEN cazarse
  ["Elegí tu plan", true], ["Podés consultar y exportar", true], ["¿Necesitás más?", true], ["Subí a Crece cuando quieras", true],
  ["Revisá tu conexión e intentá de nuevo", true], ["Escribí el nombre del negocio", true], ["No podés eliminarte a vos mismo", true],
  ["Tus datos siguen intactos", true], ["Tu suscripción ha vencido. Renueva para continuar.", true], ["Has alcanzado el límite", true],
  ["Regístrate gratis", true], ["Escríbenos por WhatsApp", true], ["Mantén tu sesión abierta", true], ["Cuando termines la prueba", true],
  ["Para que abras la agenda", true], ["Para que seas parte", true], ["Cuando des de baja a alguien", true], ["Contá el motivo del ajuste", true],
  ["Escribile para coordinarlo", true], ["Te avisamos cuando llegue", true], ["Podrás verlo en tu panel", true], ["Si querés, pagá por QR", true],
  ["Tenés 3 usuarios", true], ["Sos el dueño de la cuenta", true], ["Ahorrás 20% al año", true], ["Pagás por adelantado", true], ["activalo pagando acá", true],
  ["Hacé clic en Guardar", true], ["Volvé a intentar", true], ["Cargá tus productos", true], ["Entrá con tu correo", true], ["Dale, confirmá", true],
  ["Puedes cambiarlo cuando quieras", true], ["Quieres cancelar tu plan", true], ["Necesitas ayuda", true], ["Tienes una cita hoy", true],
  ["Haz clic aquí", true], ["Elige un plan", true], ["Sube el comprobante", true], ["Envía tu pregunta", true], ["Te cuesta menos", true],
  ["Cuéntanos qué necesitas", true], ["Llámanos al 70000000", true], ["Regístrate y pruébalo", true], ["Ponte en contacto", true],
  // USTED que NO deben cazarse
  ["Elija su plan", false], ["Puede consultar y exportar", false], ["¿Necesita más?", false], ["Suba a Crece cuando quiera", false],
  ["Revise su conexión e inténtelo de nuevo", false], ["Escriba el nombre del negocio", false], ["No puede eliminar su propio usuario", false],
  ["Sus datos siguen intactos", false], ["Su suscripción venció. Renuévela desde Mi plan", false], ["Ha alcanzado el límite", false],
  ["Regístrese gratis", false], ["Escríbanos por WhatsApp", false], ["Mantenga su sesión abierta", false], ["Cuando termine la prueba", false],
  ["Recibirá un correo de confirmación", false], ["Será notificado cuando llegue", false], ["Revisé los datos por usted", false], ["El país de su negocio", false],
  ["A través de Mi plan", false], ["Resultados generales", false], ["animate-pulse", false], ["Le avisamos cuando llegue", false], ["Sírvase elegir", false],
  ["Tiene 3 usuarios", false], ["Es el dueño de la cuenta", false], ["Ahorra 20% al año", false], ["Paga por adelantado", false], ["actívelo pagando aquí", false],
  ["Haga clic en Guardar", false], ["Vuelva a intentar", false], ["Cargue sus productos", false], ["Entre con su correo", false],
  ["Más información", false], ["Está en el menú", false], ["Todavía no hay cobros hoy", false], ["Café con leche", false], ["Para qué sirve", false],
  ["Hoy salió el pedido", false], ["Cuénteme qué necesita", false], ["Ya tiene cuenta?", false], ["Inicie sesión", false], ["Pruebe el plan Profesional", false],
];
let fallasViejo = 0, fallasNuevo = 0, regresiones: string[] = [], mejoras: string[] = [];
for (const [t, esperado] of casos) {
  const v = viejo.tuOVosEn(t).length > 0 || viejo.voseoEn(t).length > 0;
  const n = nuevo.tuOVosEn(t).length > 0 || nuevo.voseoEn(t).length > 0;
  if (v !== esperado) fallasViejo++;
  if (n !== esperado) fallasNuevo++;
  if (v === esperado && n !== esperado) regresiones.push(`${esperado ? "NO caza" : "caza de más"}: «${t}»`);
  if (v !== esperado && n === esperado) mejoras.push(`${esperado ? "ahora caza" : "ya no caza"}: «${t}»`);
}
console.log(`casos: ${casos.length} | aciertos viejo: ${casos.length - fallasViejo} | aciertos nuevo: ${casos.length - fallasNuevo}`);
console.log("REGRESIONES del nuevo (acertaba el viejo, falla el nuevo):", regresiones.length ? regresiones : "ninguna");
console.log("MEJORAS del nuevo:", mejoras.length, mejoras.slice(0, 12));
const faltan = casos.filter(([t, e]) => (nuevo.tuOVosEn(t).length > 0 || nuevo.voseoEn(t).length > 0) !== e).map(([t, e]) => `${e ? "NO caza" : "caza de más"}: «${t}»`);
console.log("Fallos que le quedan al nuevo:", faltan);
