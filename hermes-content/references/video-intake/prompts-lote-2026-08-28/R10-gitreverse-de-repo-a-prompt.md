# R10 · GitReverse: convierte un repositorio en el prompt que lo habría creado

- **Destino:** `pendiente`
- **Sale de:** [la ficha](../2026-08-28-gitreverse-de-repo-a-prompt.md) · `DbtcMKxttvh`
- **Fuente:** https://www.instagram.com/p/DbtcMKxttvh/
- **Qué falta para hacerlo hoy:** Nada para probarlo: la web es pública.

---

```text
Objetivo único: probar GitReverse en un caso real nuestro y decidir si entra al stack o se descarta.

De dónde sale: ficha `gitreverse-de-repo-a-prompt` (IG DbtcMKxttvh). La herramienta (gitreverse.com) toma una URL de GitHub y devuelve el prompt que habría producido ese repositorio, escrito como brief en primera persona.

Para qué serviría acá: el carril evalúa herramientas ajenas todo el tiempo, y esto acorta "leer un repo entero" a "leer su brief".

Pasos:

1) Probarlo con DOS repos donde podamos juzgar la respuesta:
   - uno que ya conozcamos bien, para ver si el brief que devuelve se parece a lo que el proyecto realmente es
   - uno que estemos evaluando de verdad — por ejemplo el de OpenReply, del lote anterior, que es candidato a comparar contra nuestro circuito comentario->DM

2) Juzgar con un criterio y no con impresión: ¿el brief te ahorra leer el repo, o te da una versión bonita que igual tenés que verificar? Si hay que verificar todo, no ahorra nada.

3) LA TRAMPA, que el reel no menciona y hay que dejar escrita: el prompt que devuelve es una HIPÓTESIS PLAUSIBLE, no el prompt real. Nadie sabe si ese proyecto se hizo así. Es exactamente la distinción que la skill sacar-prompt ya define entre RECUPERAR (está escrito, se lee) y RECONSTRUIR (se infiere, y se dice que se infirió). Si adoptamos la herramienta, su salida se rotula siempre como reconstruida.

4) Veredicto de una línea: entra al stack / no entra, con el motivo. Si no entra, decirlo y cerrar — no dejarlo en "a evaluar" para siempre.

LISTO = las dos pruebas hechas con su salida guardada, el juicio sobre si ahorra trabajo real, la advertencia de reconstruido-no-recuperado escrita, y un veredicto de una línea.
```
