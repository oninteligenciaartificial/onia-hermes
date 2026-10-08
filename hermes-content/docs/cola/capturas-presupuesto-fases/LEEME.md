# Presupuesto por fases (punto 7 de la 1.0) — para el OK de Sergio Urcullo

**Versión vigente: de usted, 8-oct.** Las capturas de esta carpeta son las nuevas (390 y 1440 px), sacadas
del banco `/dev/presupuesto` y `/dev/ficha` con datos de ejemplo. El parche de código es
`presupuesto-por-fases-p2-usted.patch` (3 commits, `git am` limpio sobre la integración de onia-platform#122).
`presupuesto-por-fases-p2.patch` es la versión vieja (de vos): no se usa.

Qué mirar, en este orden:
1. `p2-ficha-boton-presupuesto-*.png`: el botón «Presupuesto» en el plan de tratamiento de la ficha.
2. `p2-armador-dos-fases-*.png`: se asigna cada tratamiento a una fase; totales por fase y total.
3. `p2-armador-enviado-*.png`: «Enviar al paciente» abre WhatsApp con el enlace.
4. `p2-hoja-dental-*.png` y `p2-hoja-estetica-*.png`: lo que ve el paciente, sin entrar a Onia.
5. `p2-link-invalido-*.png`, `p2-armador-error-*.png`, `p2-armador-estetica-sin-celular-*.png`,
   `p2-ficha-servicios-sin-presupuesto-*.png`: casos borde.

Con el OK: Plataforma aplica el parche, CI, merge y publicación; después se MIRA en producción. No lleva migración.
