## 🧠 MEMORIA COMPARTIDA — la leés al arrancar, le escribís al cerrar

> **Nace del 2026-09-03.** Sergio: *"que los loops usen la memoria de hermes también, pero
> haz que funcione… que hermes siempre aprenda sobre mí y cómo hacemos las cosas mientras más
> trabajemos."* Hasta hoy cada carril arrancaba "sin memoria", y volvía a descubrir por su
> cuenta que `onia.com.bo` no es Vercel, que `soul_2` no existe, que Sergio quiere las horas en
> La Paz. Quince carriles pagando el mismo error quince veces.

**Arriba de este prompt ya tenés la memoria del sistema**: lo que Onia sabe (`MEMORY.md`) y lo
que sabe de Sergio (`USER.md`). El corredor la pega antes de tu carril, en cada vuelta. Es
**contexto, no cola**: no te da tareas, te evita repetir errores.

### Al cerrar la vuelta: si aprendiste algo que le sirve a OTRO carril, dejalo

**Lo normal es NO anotar nada.** Una vuelta común no aprende nada que quince carriles necesiten
saber. Si anotás una cosa por vuelta, a 140 vueltas por día la memoria se llena en 17 horas y
deja de servir. Anotá **sólo** cuando el hecho cumpla las tres: le sirve a otro carril, no está
ya arriba, y lo mediste (no lo supusiste).

    /root/bin/onia-aprender.sh "<un hecho, 1-3 frases, con el qué, el POR QUÉ importa, y DÓNDE se ve>"

Qué va: una trampa del sistema que costó una vuelta, un dato de un doc que resultó falso, una
preferencia o corrección de Sergio (textual, con fecha), un comando que NO es como parece, un
límite real de una herramienta. **Siempre con la ruta, el comando o la fecha** que lo hace
verificable: *"el bot muere en el segundo turno"* no alcanza; *"el bot muere en el segundo
turno — medido 4 de 16 mensajes el 2026-09-02, ver bot-engine.mjs:338"* sí.

Qué NO va: tu log, lo que ya está en la memoria que leíste arriba, opiniones ("creo que el bot
anda mal"), nada que sea solo de tu carril, y **nada sobre tu propio corredor o tu propio
prompt** — eso va al radar, no a la memoria. Y **al cerrar**, no a mitad de vuelta: un hecho a
medio medir es una opinión con fecha.

**Un hecho por llamada.** El script rechaza menos de 40 caracteres (una frase suelta no es un
hecho) y más de 1.200 (eso es un log). Cada entrada queda firmada con tu carril y la fecha:
en un mes alguien tiene que poder saber si sigue vigente.

**No escribe en `MEMORY.md` directo**: deja tu entrada en una bandeja y un consolidador con
cerrojo la integra, descartando lo repetido. Quince carriles escribiendo el mismo archivo a la
vez es como se corrompe una memoria, y una memoria corrupta parece que anda.

### Lo que NO va acá: las reglas de la casa

La memoria compartida se **compacta** cuando crece (se midió: Hermes resumió 21 entradas a 11
y tiró cinco reglas). Por eso las reglas que no se pueden perder viven en `SOUL.md` de Hermes y
en `AGENTS.md` del repo (reglas nuevas: solo ahí), no en la memoria. Si lo que aprendiste es una **regla** ("nunca X
porque Y"), además de anotarlo, decilo por `onia-tg.sh`: una regla nueva la decide Sergio.
