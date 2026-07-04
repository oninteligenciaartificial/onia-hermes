// ONIA - Prospeccion diaria (n8n). Live id: jspfoUsjQfQ1VXY4.
// Lun-Vie 09:00: nudge que rota rubro+ciudad y manda el prompt de prospeccion ONIA
// a Telegram (no contacta, no inventa). v1; upgrade a auto-busqueda cuando haya
// fuente (Google Places / Tavily). No usa SSH ni credencial.
import { workflow, node, trigger, expr } from "@n8n/workflow-sdk";

const weekday9 = trigger({
  type: "n8n-nodes-base.scheduleTrigger",
  version: 1.3,
  config: { name: "Lun-Vie 09:00", position: [240, 300], parameters: { rule: { interval: [{ field: "cronExpression", expression: "0 9 * * 1-5" }] } } },
});

const armar = node({
  type: "n8n-nodes-base.code",
  version: 2,
  config: {
    name: "Armar prospeccion del dia",
    position: [540, 300],
    parameters: {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode:
        "const rubros = ['clinicas dentales','esteticas y dermatologia','restaurantes y cafes','inmobiliarias','gimnasios','ecommerce y tiendas locales','servicios locales (plomeria/limpieza/electricidad)','constructoras y arquitectura'];\n" +
        "const ciudades = ['Santa Cruz','La Paz','Cochabamba'];\n" +
        "const now = new Date();\n" +
        "const dayIdx = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);\n" +
        "const rubro = rubros[dayIdx % rubros.length];\n" +
        "const ciudad = ciudades[dayIdx % ciudades.length];\n" +
        "const message = [\n" +
        "  'Prospeccion de hoy',\n" +
        "  'Busca 5 ' + rubro + ' en ' + ciudad + ' con senal de oportunidad (web mejorable, sin CRM, redes sin sistema, mucho manual).',\n" +
        "  'Fuentes publicas verificables (Google Maps, web, redes). Nada inventado.',\n" +
        "  'Carga los 5 buenos al CRM (Notion) como por-revisar.',\n" +
        "  'Regla: NO contactar sin aprobar antes el mensaje y canal con Sergio.',\n" +
        "].join('\\n');\n" +
        "return [{ json: { rubro, ciudad, message } }];",
    },
  },
});

const enviar = node({
  type: "n8n-nodes-base.httpRequest",
  version: 4.4,
  config: {
    name: "Enviar a Telegram",
    position: [840, 300],
    parameters: {
      method: "POST",
      url: expr("{{ 'https://api.telegram.org/bot' + $env.TELEGRAM_BOT_TOKEN + '/sendMessage' }}"),
      sendBody: true, contentType: "json", specifyBody: "json",
      jsonBody: expr("{{ { chat_id: $env.TELEGRAM_SERGIO_CHAT_ID, text: $json.message, disable_web_page_preview: true } }}"),
      options: { timeout: 30000 },
    },
  },
});

export default workflow("onia-prospeccion-nudge", "ONIA - Prospeccion diaria")
  .add(weekday9)
  .to(armar)
  .to(enviar);
