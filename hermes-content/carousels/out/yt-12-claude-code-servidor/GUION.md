# Guion de grabación · Claude Code en un servidor, sin API key y con barandas

**Título público:** Claude Code en un servidor, sin API key y con barandas

**Miniatura:** SIN API KEY

**Resultado prometido:** Al terminar, la persona podrá armar un loop de Claude Code en un servidor con candado, carpeta verificada y aviso, y evitar las cinco trampas.

**Duración objetivo:** 10–14 minutos. No acelerar para meter más conceptos; cortar lo
que no contribuya al resultado prometido.

## 01 · Resultado primero

**Lámina:** Claude Code trabajando en un servidor, sin mí y sin API key.

**Guion:** No usás una API key: corren con tu suscripción. Prometé las dos piezas, las tres barandas que casi nadie pone y cinco trampas que te costaron vueltas perdidas. Todo medido en tu servidor.

**Pantalla / prueba:** Diagrama del loop. Nunca la terminal del servidor.

## 02 · Por qué en un servidor

**Lámina:** Nadie está mirando: la mitad del trabajo son las barandas.

**Guion:** Si encadenabas trabajo, los agentes nunca tenían turno, y no fallaban ni avisaban: simplemente no corrían. En el servidor, claude guion p recibe un pedido, trabaja y termina; cron, el reloj de Linux, lo corre cada hora. Si algo sale mal a las tres de la mañana, nadie lo ve.

**Pantalla / prueba:** Lámina a pantalla completa.

## 03 · Las dos piezas

**Lámina:** Un loop son dos archivos: el corredor y el prompt.

**Guion:** El corredor es un solo script de bash para todos los loops. El prompt es uno por loop y dice qué hace ese carril y qué tiene prohibido. Como cada vuelta arranca sin memoria, el prompt dice todo: carpeta, verificar la rama, dónde está su lista y lo prohibido: desplegar, mezclar en la rama principal, tocar otro carril, gastar y escribirle a alguien de afuera.

**Pantalla / prueba:** Esqueleto del prompt de un carril.

## 04 · Las tres barandas

**Lámina:** Candado, carpeta verificada y aviso cuando se muere.

**Guion:** Uno, flock: si la vuelta anterior sigue, la nueva no arranca; dos sesiones editando los mismos archivos es el peor modo de falla. Dos, entrar a la carpeta o avisar y detenerse: el guardián pasó semanas diagnosticando desde una carpeta que había desaparecido. Tres, avisar por Telegram como mucho una vez cada seis horas por loop. Y el tope, menor que el intervalo.

**Pantalla / prueba:** Esqueleto del corredor con las tres barandas resaltadas.

## 05 · Las cinco trampas

**Lámina:** Cinco trampas que me costaron vueltas perdidas.

**Guion:** Uno: con ANTHROPIC_API_KEY en el entorno usa esa clave y no la suscripción; el corredor la borra con unset. Para dejar la suscripción en el servidor está claude setup guion token, y eso nunca va al repositorio. Dos: las herramientas van en una sola cadena separada por comas. Tres: el pedido entra siempre desde un archivo. Cuatro: cron en hora universal, Bolivia cuatro horas atrás. Cinco: versión nueva en un temporal, bash guion n, y mv.

**Pantalla / prueba:** Esqueleto del corredor: unset, --allowedTools y el pedido desde archivo.

## 06 · La prueba

**Lámina:** Un loop sirve por lo que cambia, no porque corrió.

**Guion:** La pregunta no es cuántos commits hizo, es qué cambió. Un loop que deja catorce commits de «verifiqué que sigue bien» quema tu límite para producir la misma frase. Antes de ponerle cron, corrélo a mano una vez y leé el registro entero: un cron escrito no es un cron que anda.

**Pantalla / prueba:** Tres commits de un loop, abiertos.

## 07 · El error común

**Lámina:** Un loop no piensa: come de su lista.

**Guion:** El error más común no es técnico: es armar un loop para algo que no tiene lista de tareas. Antes de escribir una línea de script, preguntate si ese trabajo tiene una lista real y visible.

**Pantalla / prueba:** Lámina a pantalla completa.

## 08 · Cierre

**Lámina:** El esqueleto del corredor está en la comunidad.

**Guion:** Repetí las cuatro piezas del esqueleto y mandá a la comunidad de WhatsApp. El link está en la web.

**Pantalla / prueba:** Link de la comunidad en la web.

## Tomas de seguridad

- Repetir hook, frase de transición y CTA en una segunda toma.
- Capturar 8–12 segundos limpios de cada pantalla importante.
- Grabar un error real si aparece y explicar cómo se detectó.
- Mantener fuera de cuadro tokens, correos, nombres de clientes y notificaciones.
