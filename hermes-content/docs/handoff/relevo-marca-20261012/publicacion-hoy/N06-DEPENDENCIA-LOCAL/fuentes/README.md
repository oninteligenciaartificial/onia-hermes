# Fuentes oficiales candidatas — N06

Estado: tres candidatos Inter estáticos de metadata 4.001 y un candidato oficial JetBrains Mono SemiBold v2.304 estático con peso OS/2 600. La SemiBold Inter local existente se conserva y se referencia por separado.

- `Inter-Black.ttf`, `Inter-Bold.ttf`, `Inter-Regular.ttf`: caras estáticas extraídas de `Inter.ttc` del release oficial Inter v4.1 (build `git-9221beed3`), sin tabla `fvar`. Son extracciones en contenedor TTF, no entradas TTF independientes nativas del ZIP.
- La SemiBold Inter local de build `git-66647c0bb` permanece sin reemplazo; la cara extraída del TTC v4.1 se comparó y difiere en SHA/bytes. Igual metadata 4.001 no implica mismo build.
- `JetBrainsMono-SemiBold.ttf`: asset del tag oficial v2.304; metadata 2.304, OS/2.usWeightClass=600, estático y sin `fvar`. Las referencias locales Bold/ExtraBold son 2.211, pero la versión de la caché N06 no está observada. Se ofrece como candidato de familia/peso para QA local, no como original equivalente. Licencia OFL del mismo tag.
- JetBrains v2.305 se conserva sin modificar bajo `not-selected/`: sus nombres indican SemiBold pero `OS/2.usWeightClass=472`, por lo que no se selecciona como fuente SemiBold.
- `LICENSE-Inter-OFL.txt` y `LICENSE-JetBrains-OFL.txt` contienen las licencias OFL oficiales correspondientes.

No se instalaron fuentes, no se alteraron originales/ZIP N06 y no se generaron fuentes variables. Para procedencia, versiones, commits, blobs, hashes, tamaños y límites, consulte `MANIFEST.json`.
