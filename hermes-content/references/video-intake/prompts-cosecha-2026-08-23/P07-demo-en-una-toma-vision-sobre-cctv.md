# P07 · Guion + plan de rodaje: el reel de demo en UNA sola toma para ONIA

- **Destino:** `marketing`
- **Sale de:** [la ficha](../2026-08-23-cosecha-demo-en-una-toma-vision-sobre-cctv.md) · `DadOo9Mo3AA` · @supra_digitalsolutions
- **Fuente:** https://www.instagram.com/p/DadOo9Mo3AA/
- **Tipo:** MIXTO
- **Qué falta para hacerlo hoy:** Para el molde: NADA. Se graba hoy con un celular, el monitor y una cuenta de demo de ONIA Platform. Para el producto: falta todo lo caro — una decisión de Sergio sobre si Onia entra a video-analytics (vertical nuevo, no pack del core), un cliente real que preste su NVR, hardware de inferencia, y una postura legal sobre reidentificación de personas por nombre en Bolivia. Eso es BANCO, no descarte: la idea sirve, el momento no.

---

```text
Sos la sesión de marketing de ONIA. Objetivo único y verificable: dejar escrito, listo para apretar REC, UN guion de reel de 55-70 s que copie el molde verificado del reel de @supra_digitalsolutions (Instagram DadOo9Mo3AA), adaptado a ONIA Platform. No grabás nada en esta sesión: entregás el guion y el plan de rodaje.

== CONTEXTO QUE NO SE NEGOCIA ==
- Lead magnet decidido el 2026-08-23: AGENDAR UNA DEMO en cal.onia.com.bo. El CTA del reel es ESE. Ni PDF, ni 'escribinos', ni DM automático.
- Regla 'no fabricar' (cero clientes pagando): prohibido inventar testimonios, logos, cifras de ROI, nombres de clientes o capturas de cuentas que no existan. Todo número que aparezca en pantalla sale de una cuenta de demo REAL de ONIA Platform.
- Regla 'la venta nunca exhibe obra': cero 'muy pronto', 'beta', 'en construcción', 'próximamente'. Solo se nombra lo que está VIVO. Antes de nombrar un rubro, verificá su estado en hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md (dental está vivo; el resto, comprobalo, no lo supongas).
- Precios: si el guion nombra un precio, se LEE de onia-platform/lib/subscription-plans.ts (planes) o onia-platform/lib/pricing.ts (add-ons). Recomendación fuerte: no nombrar precio en el reel.

== EL MOLDE A COPIAR (5 bloques, en este orden) ==
1. GANCHO POR PREGUNTA FRECUENTE (0-3 s). Literal del original: 'Muchas personas nos preguntan si nosotros hacemos este tipo de implementaciones'. Cero promesa, cero cifra, cero 'descubrí el secreto'. Abre con la duda del que mira y la responde MOSTRANDO. Adaptalo, no lo copies palabra por palabra.
2. DEMOSTRACIÓN CON EL DEDO (3-30 s). La pantalla YA está corriendo cuando arranca el plano. Se enumeran capacidades señalándolas FÍSICAMENTE con la mano sobre el monitor, una por una, en frases cortas encadenadas con 'incluso también se puede…'. El original encadena 8 mediciones seguidas sin respirar.
3. AMPLITUD DE RUBRO (30-40 s). El original: '…absolutamente todo en cualquier tipo de industria: de servicio, quioscos, almacenes, fábricas, centros logísticos, lo que vos necesites nosotros lo podemos medir.' Convierte un caso en un mercado. Para ONIA: nombrá SOLO rubros vivos, y cerrá la lista capturando demanda futura sin admitir obra ('¿otro rubro? escribinos').
4. EL REMATE QUE VENDE (40-52 s). El original mete la salida por WhatsApp, dicha en primera persona del sistema: 'se puede configurar para que WhatsApp te envíe notificaciones… hey, hoy tuviste un día de productividad mucho más abajo que lo normal.' Es el único momento con una frase citada textual y por eso es el único que se recuerda. ONIA tiene ese canal VIVO (n8n + Chatwoot): usalo. El remate es que el sistema te HABLA, no que tiene pantallas.
5. CIERRE A DEMO (52-65 s). El original: 'haceme el formulario… podemos hablar de hacer una demo totalmente gratis.' El nuestro: agendar en cal.onia.com.bo. Fricción baja, objeto claro, la palabra 'gratis' al FINAL y no al principio.

== EL PLAN DE RODAJE (esto es lo que hace que el molde funcione) ==
- UNA SOLA TOMA. El original mide 64,700 s con 0 cortes (medido con ffmpeg, umbral scene 0.3). No se corta: el ritmo lo dan la mano que entra a señalar y el contenido que cambia en la pantalla. Si el guion necesita un corte, el guion está mal escrito.
- Cámara EN MANO filmando el monitor en DIAGONAL, nunca frontal. El monitor ocupa los dos tercios inferiores; arriba a la izquierda entra ventana/luz/planta para que no sea solo pantalla.
- La MANO es el editor: entra en cuadro cada vez que la voz nombra algo nuevo. Reemplaza al corte, al zoom y al puntero animado.
- PiP del hablante arriba a la derecha: rectángulo vertical de esquinas muy redondeadas, sin borde ni sombra. Puede flotar, no hace falta clavarlo.
- Subtítulos quemados: 3 líneas máximo, caja negra OPACA POR RENGLÓN (no un rectángulo único), texto blanco, sans grotesca pesada, a ~75-80% de la altura. Bloque completo cada ~3 s, sin karaoke palabra por palabra.
- Textura real: que se vean el moiré del monitor, los cables, el teclado. NO limpiar el set. Esa suciedad es lo que hace creíble que el sistema esté corriendo de verdad; limpio parece render.

== ENTREGABLE ==
Un archivo en hermes-content/docs/ (sin fecha en el nombre si es fuente de verdad; con fecha y en historial/ si es la foto de un día), que contenga:
- El guion segundo a segundo, con los 5 bloques y sus tiempos.
- Qué pantalla de ONIA Platform se muestra en cada segundo, nombrada por su RUTA en el repo, y con qué cuenta de demo.
- El caption de Instagram.
- La checklist de lo que hay que tener listo antes de apretar REC.

LISTO = existe el archivo del guion en hermes-content/docs/, con los 5 bloques y sus tiempos sumando entre 55 y 70 s, con el CTA a cal.onia.com.bo escrito literal, con cada pantalla nombrada por su ruta dentro de onia-platform, con cero apariciones de 'muy pronto' / 'beta' / 'próximamente' / 'en construcción', y con cero cifras que no provengan de subscription-plans.ts, de pricing.ts o de una cuenta de demo real.
```
