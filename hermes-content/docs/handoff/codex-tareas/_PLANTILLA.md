---
id: <CARRIL>-<ID>
carril: plataforma | hermes | lucia | marca | ventas
estado: pendiente   # pendiente | lanzada | PR | hecha | bloqueada
modelo: gpt-6.1-sol # gpt-6.1-sol: por defecto | gpt-6-astra: seguridad, cobros, producción, permisos | gpt-6-luna: mecánico
repo: onia-platform # o onia-hermes
rama: codex/<slug>  # la crea la madre al lanzar
base: master        # onia-platform: master | onia-hermes: main
pr:                 # número o URL cuando exista
escrita: AAAA-MM-DD por <sesion>
actualizada: AAAA-MM-DD por <sesion>
nota:               # una línea; obligatoria si estado = bloqueada
---
# <ID> · <titulo corto>

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `<repo>` que creó la madre, en la rama `<rama>`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin npm install, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.

## META
<1-3 frases: qué cambia para el cliente. Textos a clientes, de USTED.>

## PRUEBA DE HECHO
<Tests o comando exacto que tiene que quedar en verde, casos numerados.>

## REGLA DE PARADA
<Cuándo parar y reportar en vez de seguir.>

## ARCHIVOS
<Lista de archivos que puede tocar; todo lo demás, prohibido.>
