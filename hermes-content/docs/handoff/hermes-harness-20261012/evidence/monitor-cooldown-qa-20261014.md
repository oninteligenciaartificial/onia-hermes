# QA independiente — monitor cooldown — 2026-10-14

Veredicto: PASS limitado a revisión estática y fixtures offline. Sustituye NEEDS_FIX anterior.
Base CODE: 5e8cb7c7bda3de50ce2b350d84615d4036eb7bb8.
Revisión final acotada a corrección del título, siete fixtures y empaquetado ya observado.

## Fuentes SHA-256 verificadas
- onia-mirar-cliente.mjs: 855b99491a5c8a1dd9a2b461d98190c037229e8a0b03562a6ddeaca081411fa5
- onia-mirar-aviso-estado.mjs: c34e0635d3cb61b75d5b52c73305f707972f08c3c67e46bbd05d3c31c2441b38
- onia-mirar-aviso-estado.test.mjs: 1dd48ad886fb1b9dace5287ce452307ff6142ce1211156186a450dcfab1c9057
- scripts/loops/sincronizar.sh: ebce76c80850e8a9962e4ab724ed23e33b4610bd35152b57821b97608f0fa739
Los tres archivos .mjs están en hermes-content/deploy/vps-ops/.

## Corrección confirmada
El monitor utiliza directamente tituloAviso del helper. La frase de recuperación exige historial válido y previo.roto=true; estado desconocido o previamente sano produce un título neutral, incluso con --forzar-aviso. El título roto conserva conteo actual.
El séptimo fixture ejercita la misma función usada por el monitor: historial nulo, incompleto, sano, futuro inválido, recuperación válida y resultado roto.
El helper sigue siendo puro; la suite sólo importa node:test, node:assert/strict y ese helper.
La copia de empaquetado conserva el helper junto al monitor en DESTINO_BIN. No se ejecutó sincronizar.sh.

## Validación final
Una ejecución autorizada: node --test hermes-content/deploy/vps-ops/onia-mirar-aviso-estado.test.mjs.
Resultado: 7/7 PASS, 0 fallos, 0 omitidos, 81.0481 ms, exit 0.
Los cuatro hashes coinciden con freeze de Root. git diff --name-only vacío; git diff --cached --check sin errores.
Sin nuevos hallazgos concretos en el delta. Se conserva la revisión previa del cooldown y fallos pendientes; no se reejecutó otra suite.

## Límites
No prueba visual, E2E, Telegram, navegador, SSH, proveedor, instalación, servicio ni despliegue; sin DB real.
La aceptación HTTP no acredita entrega humana. No se probó atomicidad entre envío y persistencia.
No se modificaron código, patch, index ni commits; sólo este informe público fuera de Git.
