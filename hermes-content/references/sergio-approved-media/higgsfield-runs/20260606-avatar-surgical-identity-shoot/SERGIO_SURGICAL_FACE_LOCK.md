# Sergio Surgical Face Lock

## Objetivo

Crear un shooting completo de avatar IA de Sergio usando un bloqueo quirurgico de identidad. La prioridad absoluta es mantener la misma persona reconocible en todos los angulos. La mejora permitida es cosmetica y de produccion: limpiar granos, textura temporal, brillo duro, fatiga visual y pequenas arrugas de iluminacion sin cambiar la estructura real de la cara.

## Anchors reales

- `source-anchors/01_front_neutral_real.jpg`: frontal neutral, principal para estructura facial, ojos, nariz, labios, edad y presencia.
- `source-anchors/02_front_smile_real.jpg`: sonrisa, dientes, comisuras, pliegues naturales y energia simpatica.
- `source-anchors/03_profile_left_real.jpg`: perfil, nariz, frente, menton, linea mandibular, oreja y cuello.
- `source-anchors/04_profile_right_real.jpg`: perfil opuesto, cabello, nuca, oreja, linea mandibular y cuello.
- `source-anchors/05_three_quarter_a_real.jpg`: tres cuartos para volumen facial, cejas, ojo lateral y puente nasal.
- `source-anchors/06_three_quarter_b_real.jpg`: tres cuartos suave para transicion entre frente y perfil.
- `source-anchors/07_front_video_neutral_real.jpg`: frame frontal de video para validar continuidad en movimiento.
- `source-anchors/08_front_video_smile_real.jpg`: sonrisa de video para validar boca y expresion.

## Rasgos que son sagrados

- Misma edad aparente joven. No envejecerlo, no hacerlo maduro, no hacerlo infantil.
- Rostro alargado y delgado natural, con frente media/alta y proporcion juvenil.
- Ojos oscuros almendrados, con asimetria natural y parpados reales. No agrandar, no separar, no hacer "ojos de modelo" genericos.
- Cejas oscuras, gruesas, definidas, rectas con ligera inclinacion natural. No afinar ni redibujar.
- Nariz recta con puente y punta naturales. No adelgazar, no respingar, no cambiar fosas nasales.
- Labios medianos a llenos, labio inferior mas presente, comisuras reales. No inflar, no reducir, no cambiar arco.
- Dientes y sonrisa deben seguir la referencia real: limpios, alineados de forma natural, sin convertirlos en carillas falsas.
- Mandibula y menton definidos pero jovenes. No hacer mandibula cuadrada exagerada ni cuello artificialmente largo.
- Cabello negro con side part italiano, peinado, con brillo natural y volumen. No pelo caido, no flequillo pesado, no cambio de corte.
- Piel morena clara/calida con textura humana. No piel plastica ni demasiado suavizada.
- Orejas, nacimiento del pelo, cuello y proporciones de cabeza deben seguir los perfiles reales.

## Limpieza permitida

- Quitar granos activos, marcas temporales, pequenas irritaciones, brillo excesivo de flash y arrugas generadas por luz o expresion.
- Quitar lineas horizontales marcadas de la frente, textura dura de acne, marcas temporales y sombra de barba inventada, manteniendo piel humana joven y poros finos.
- Mejorar nitidez, iluminacion, detalle del cabello, textura fina de piel y balance de color.
- Unificar vestimenta premium: blazer negro o chaqueta limpia sobre camiseta negra, estetica emprendedor moderno.
- Fondo moderno limpio, cinematografico y premium sin distraer.

## Prohibido

- Crear una persona parecida.
- Cambiar distancia entre ojos, tamano de ojos, forma de nariz, labios, menton, mandibula, dientes, edad o estructura del craneo.
- Hacerlo mas viejo, mas flaco, mas generico, demasiado modelo, plastico, anime, caricatura o hiperretocado.
- Envejecerlo con lineas en la frente, o agregar bigote/barba/sombra facial mas marcada que la referencia.
- Agregar barba marcada, cicatrices, rasgunos de cuello, accesorios raros, manos deformes o anatomia falsa.
- Usar outputs anteriores como identidad base. Solo usar referencias reales de este run.

## Criterio de aprobacion

Una toma solo pasa si Sergio se reconoce como la misma persona al comparar contra `01_front_neutral_real.jpg` y `02_front_smile_real.jpg`. Si una toma se ve mas bella pero cambia la identidad, se rechaza.
