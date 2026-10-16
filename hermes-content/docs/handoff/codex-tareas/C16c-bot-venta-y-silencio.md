# C16c · Bot: el número de Onia siempre vende, y un WhatsApp desconectado no contesta

Sos Codex. SOLO `onia-hermes`, carpeta `hermes-content/deploy/vps-ops/bot/`, rama nueva `codex/c16c-bot` desde `origin/main`.

## META
Medido el 8-oct (código de `main`):
1. **Agujero de modo:** el bot reconoce el número de Onia solo cuando `/published` responde 200
   (`knowledge.mjs:675-683`, `803-812`). Si responde 404 con el `organizationId` de la org interna (add-on vencido, fila
   despublicada), cae en «ajena» y el número de ventas atiende como recepcionista neutral (`knowledge.mjs:772-792`;
   `esAjenoAOnia` ~:700 no mira la org interna; `esInboxDeCliente` ~:735-743 sí).
2. **Huérfano que contesta:** una bandeja de WhatsApp sin organización (cliente que desconectó) recibe el recepcionista
   neutral (`knowledge.mjs:~1526`). Debe callar.

## Lo que se hace
1. Aplicar la misma regla de la org interna (`orgInternaDe` o equivalente) al camino 404/409: si el `organizationId` es el de
   `ONIA_KNOWLEDGE_URL`, modo venta, igual que con 200.
2. Bandeja de WhatsApp sin organización → no responde (ni menú ni «no tengo el dato»), registra una vez por conversación
   «bandeja huérfana, no se responde». Las bandejas web huérfanas quedan como están.

## PRUEBA DE HECHO
- Tests nuevos al lado de `knowledge.test.mjs:1536-1574`: 404 con org interna → venta; 404 con org de cliente → como hoy;
  WhatsApp sin org → sin respuesta y un solo log; web sin org → como hoy.
- La suite del bot completa verde (`npm test` en esa carpeta; anotá el número real).

## REGLA DE PARADA
- No despliegues al VPS ni toques `/opt/onia/bot`: lo despliega Plataforma o la madre.
- No cambies el texto de venta ni el conocimiento. No toques `onia-platform` (C16a/C16b).

## Entrega
Commits conventional en castellano con el porqué. Draft PR contra `main`. Resumen con SHAs y el número real de tests.
