# S01 · Graphify: el mapa del repo que sobrevive a la sesión

- **Destino:** `pendiente` (herramienta interna, no toca producto)
- **Sale de:** [la ficha](../2026-08-28-graphify-memoria-permanente-del-agente.md) · `DcjRvK1EZWE`
- **Fuente:** https://www.instagram.com/p/DcjRvK1EZWE/
- **Qué falta para hacerlo hoy:** nada para evaluarlo — es open source y los comandos están transcritos. Lo que falta es **comparar contra la skill `understand-anything` que ya tenemos**.

---

```text
Objetivo único: decidir si Graphify entra al stack — pero PRIMERO verificar si ya tenemos lo mismo.

POR QUÉ ESTO IMPORTA HOY, con el caso medido: el 2026-08-28 Sergio cortó un lote a mitad
preguntando por qué se gastaban tantos tokens. La mitad de esa respuesta eran las imágenes, y ya
se arregló (640px, ver 2026-08-23-costo-del-analisis.md). La otra mitad es esto: cada sesión de
este repo vuelve a descubrir dónde están las cosas.

El carrusel de origen pone la cuenta: un agente que arranca de cero gasta ~46.740 tokens sólo en
redescubrir un proyecto — grep 3.240, y siete archivos leídos enteros entre 1.900 y 11.200 cada
uno. Y lo tira todo al cerrar.

PASO 0, Y ES EL QUE MÁS IMPORTA — NO EMPEZAR INSTALANDO:

En el stack ya hay una skill llamada `understand-anything` que construye grafos de conocimiento
de un codebase. Antes de sumar una herramienta nueva:

  a) Leer qué hace exactamente esa skill: qué extrae, dónde deja la salida, si se actualiza sola.
  b) Contestar sin adornos: ¿resuelve el mismo problema que Graphify?
  c) Si lo resuelve, la tarea deja de ser "instalar Graphify" y pasa a ser "por qué no la usamos".

Esto no es burocracia. En esta misma sesión pasó DOS veces que algo "nuevo" ya existía: el
estándar de handoff que reinventé cuando main ya lo tenía, y la GEMINI_API_KEY que la memoria
daba por faltante y estaba puesta. La regla del proyecto es mirar antes de construir.

SI Y SÓLO SI `understand-anything` no cubre el caso, seguir:

1) Instalar y correr, con los comandos transcritos del carrusel:

     uv tool install "graphifyy[office,mcp]"        # ojo: el paquete es graphifyy con DOS 'y'
     graphify install --project                      # --project lo deja dentro del repo

   Verificar el nombre del paquete antes de correrlo. Si no existe o cambió, decirlo y parar: el
   dato viene de una captura de pantalla, no de haberlo instalado.

2) CREAR .graphifyignore ANTES de construir el grafo. El propio autor lo marca como el paso
   crítico y explica por qué: Graphify NO lee tu .gitignore, son archivos distintos. Sin este
   archivo parsea node_modules entero y el grafo sale 95% dependencias de terceros. Empezar por:

     node_modules/
     dist/
     build/
     .next/
     coverage/
     *.min.js
     package-lock.json
     pnpm-lock.yaml

   Y agregarle lo específico de ESTE repo, que es grande y tiene varios proyectos adentro:
   .hermes/, scratchpad, los assets de video, los backups de n8n.

3) Construir el grafo DESDE EL ASISTENTE, no desde la terminal:

     /graphify .

   La diferencia es de plata y el carrusel la explica: desde el asistente la extracción se
   despacha como subagentes de la suscripción; desde la terminal exige una API key de pago.

4) Leer GRAPH_REPORT.md primero — según el autor trae "god nodes, comunidades, conexiones que no
   sabías que tenías". Para este repo eso es interesante de verdad: onia-hermes tiene el cerebro,
   el core, web-factory y la orquestación conviviendo.

5) Instalar el hook: `graphify hook install`. El autor avisa que no es opcional, y tiene razón:
   un grafo desactualizado es peor que ninguno, porque el agente confía en él y cita líneas que
   ya no existen.

6) MEDIR, que es lo único que decide. Correr una tarea típica del carril DOS veces — una sin
   grafo y otra con grafo — y comparar tokens de entrada. Si no baja de forma clara, no entra.
   Sin ese número esto es fe, no ingeniería.

LO QUE NO SE PUEDE DAR POR CIERTO:
  - los 46.740 tokens son un ejemplo del autor, no una medición publicada. El orden de magnitud
    es creíble; el número no se cita como dato.
  - el caption promete "7 pasos", la portada dice "5" y el carrusel muestra 01-05. Son cinco.

LISTO = un documento con (a) el veredicto sobre si `understand-anything` ya lo cubre, y (b) si no
lo cubre, la medición de tokens de la misma tarea con y sin grafo, y una decisión de una línea:
entra al stack / no entra, con el motivo.
```
