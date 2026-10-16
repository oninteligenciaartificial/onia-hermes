estado: en curso (Codex Sol, lanzada por la madre el 11-oct antes de las 09:31 UTC)
modelo: gpt-6.1-sol
carril: plataforma
origen: E10 y E16 de Hermes (11-oct): el Inicio de comercio e importadora sigue de vos. Escrita el 11-oct por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C). Va después de #152, que dejó de usted el Inicio de los rubros con agenda y trae el gate por pantalla.

# U7 · El Inicio de comercio e importadora le habla de usted

Sos Codex. Carpeta `C:/dev/proyectos/onia-platform-codex-u7`. La madre la prepara desde `origin/master` con #152 mergeado y te pasa el
SHA base. No hagas git: la madre revisa, corre `tsc` y la suite completa, commitea y abre el PR.

## META
Lo primero que ve el dueño de un comercio o de una importadora al entrar es su Inicio, y sigue de vos y de tú. Ejemplos de hoy:
- `app/(dashboard)/dashboard/comercio-hoy.tsx`: «Cómo te pagaron», «cliente te debe», «vendés ~N por semana»;
- `app/(dashboard)/dashboard/importadora-hoy.tsx`: «Todavía no cargaste cotizaciones este mes. Creá la primera…», «vendés a Bs…»,
  «Todavía no aplicaste costeos al catálogo. Calculá…»;
- `app/api/comercio/clientes/[id]/route.ts:57`: «No se pudo guardar. Probá de nuevo.» (la pantalla lo muestra tal cual).

El de los rubros con agenda (dental, estética, servicios) ya es de usted desde #152. La importadora es 1.0 acotada
(`docs/ONIA_1.0_CORTE.md` §1).

## Qué hacer
1. **Todo texto que ve el dueño en esos tres archivos pasa a usted**, con el vocabulario de `lib/onboarding/vocabulario.ts`:
   - «Cómo le pagaron», «cliente le debe», «vende ~N por semana», «Todavía no cargó cotizaciones este mes. Cree la primera con
     «Nueva cotización».», «Inténtelo de nuevo»;
   - si una frase de usted queda ambigua («le debe»: ¿a quién?), se pasa a impersonal, como hizo #152 en la ficha.
2. **Seguí los imports:** si esos archivos muestran textos que vienen de `lib/` (rótulos, vacíos, avisos), esos textos también.
   Revisá también `interna-hoy.tsx` y `guia-del-panel.tsx`, aunque hoy parecen limpios.
3. **Sumá los archivos a la lista `ARCHIVOS` del gate `__tests__/pantallas-del-video-de-usted.test.ts`** (lo trajo #152), con un
   comentario «el Inicio de comercio e importadora (U7)». No hagas un detector nuevo.
4. **Actualizá cada test que afirmaba el texto viejo**, sin borrar ninguno (`comercio-hoy.*.render.test.ts`,
   `importadora-hoy.plata.render.test.ts` y los que aparezcan), y bajá la línea base de `__tests__/voseo-ratchet.linea-base.json`
   donde el trinquete lo pida.

## PRUEBA DE HECHO
Primero en rojo: con el gate ampliado y el texto viejo, anotá cuántos hallazgos da por archivo.
- El gate y el trinquete en verde.
- `npx tsc --noEmit` 0, eslint de lo tocado 0 y `npx vitest run` completo en verde.

## REGLA DE PARADA
- Solo textos: no cambies lógica, rutas, cálculos de plata ni permisos.
- Los mensajes al cliente del negocio (WhatsApp, recibos) no se tocan en este contrato.
- Si un texto no se puede pasar sin cambiar lo que promete (por ejemplo, una función que no existe), dejalo y anotalo.
- Si después de dos intentos algo sigue rojo por una causa fuera de esta lista, pará y anotalo.

## Entrega
Sección «PARA LA MADRE:» con:
- los archivos;
- los números de tsc, eslint y vitest;
- los hallazgos del gate antes y después;
- las frases que no pudiste pasar y por qué.
