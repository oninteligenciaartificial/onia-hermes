# Candidato de diagnóstico mínimo PC-off

Estado: **preparado y verificado offline; desconectado del workflow; no ejecutado**.

El diagnóstico existente (`diagnostico.sh`) inspecciona crontab, datos y logs de Hermes,
Telegram y n8n. No cumple el límite de esta preparación. Estos archivos ofrecen una
alternativa acotada que solo informa versiones de herramientas, disponibilidad y espacio
libre, y presencia booleana de cuatro rutas requeridas. No lee contenido de esas rutas.

`diagnostico-pc-off-runner.sh` es una plantilla revisable, no está incluida en
`.github/workflows/hermes-jarvis.yml`. Falla cerrado si no recibe identidad ya configurada,
archivo `known_hosts` confiable con entrada para `187.77.16.63`, `ssh` y `timeout`. Si llega
a habilitarse en un cambio futuro, exige `StrictHostKeyChecking=yes`, usa solo el archivo
de pins indicado y limita el intento a 60 segundos. No contiene `ssh-keyscan`, `accept-new`
ni bypass de verificación.

El pin de host de fuente confiable **no está disponible para este candidato**. No se debe
crear a partir de una conexión nueva ni confiar en `ssh-keyscan`. El responsable de la
infraestructura está verificando el pin por su fuente local confiable; hasta que entregue
el archivo/valor por la configuración protegida aprobada, no conectar ni integrar el
runner. La ubicación/canal aprobado para ese pin también debe confirmarse. La identidad SSH
existente no se inspeccionó ni se copió.

La prueba focal (`python3 -m unittest hermes-content/deploy/hermes-jarvis/test_diagnostico_pc_off.py`)
es estática y local: detecta canales extra, primitivas de mutación, falta de timeout o de
pin requerido, opciones inseguras y cableado accidental al workflow. No ejecuta los scripts
remotos, SSH, workflow, servicios ni APIs. No repite los 18 tests del harness.
