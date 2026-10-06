# Revisión auth usted — 2026-10-06

META: revisar sólo el delta de copy, consistencia de usted y preservación de comportamiento.
PRUEBA DE HECHO: inspección de los17 paths y ejecución independiente de las7 suites modificadas.
REGLA DE PARADA: dictamen por SHA; sin implementación, navegador, build ni cambios de fuentes.

SHA: 78e8f67d9ed58df2a2cd405a94dd04b74cec63d9.
Padre: 5cdd6b9d8b6504335f2066e629ccba080d2910b7.

## Dictamen

CORRECCIONES MENORES REQUERIDAS para declarar completo el trato de usted. Sin hallazgos de lógica o seguridad en el delta.

1. [P3] app/(auth)/register/AccessRequestForm.tsx:165 conserva «con la configuración de tu rubro» en el mismo párrafo que «su sistema». Cambiar a «su rubro».
2. [P3] app/(auth)/register/VerificarWhatsapp.tsx:191-192 conserva «Tocá “Copiar código” ... pegalo acá» después de «Le mandamos». Cambiar a «Toque ... péguelo aquí».
3. [P3] components/auth/AuthShell.test.ts:38 sustituye una promesa prohibida válida por «creá su cuenta y empezá». Ese híbrido ya no detecta la antigua frase ni la equivalente formal. Conservar la variante anterior y añadir «cree su cuenta y empiece»; revisar variantes formales de los demás guards negativos sin perder las anteriores. acceso-acompanado.test.ts:80 también conserva «te escribimos» como alternativa; sus asserts no constituyen un gate de usted consistente.

Los dos residuos de copy estaban parcialmente presentes antes, pero quedan dentro de frases/pantallas intervenidas por esta unidad y contradicen su criterio de completitud. No requieren cambiar comportamiento.

## Verificación

- 69/69 PASS en7 archivos: LoginForm, acceso-acompanado, page, plan-y-peso, verificar-whatsapp-estado, verificar-whatsapp.render y AuthShell.
- git diff --check del commit: PASS.
- Inspección del delta: cambios de textos JSX/literales y expectativas; se conservan ramas, handlers, flags, URLs, atributos, permisos, duración/plan de prueba e importes. Texto de aceptación mantiene el mismo significado; no se modifican términos ni mecanismo de aceptación.
- Los tests verdes no detectan los residuos listados. No se reclama QA visual ni autenticación real.
- Frente único de revisión de copy/contrato, sin subagentes.
- app/layout.tsx y app/global-error.tsx estaban dirty al iniciar; excluidos de la revisión y no modificados.

## Integración y alcance

El padre es QA C13/C15 sin integrar. Este dictamen sólo cubre el commit de copy, no autoriza publicar toda la rama ni importa validación de su base. Preparar sólo el delta sobre master para PR limpio y verificar el nuevo SHA/diff antes de trasladar el dictamen.

Fuera de los17 paths existen textos informales en login/2fa/page.tsx y el default de AuthLoading.tsx. Se anotan sólo como alcance residual: esta revisión no amplía el encargo ni acredita «todo auth en usted».

## Cierre de hallazgos — PR117

Revisión incremental de 6e52f86b07ad1b65e74674b702dce9b35cf2dbf9 a ae641152c2a626aff6ad18757885c61830b0e639. Dictamen actualizado: FAVORABLE para el delta de copy; los tres P3 quedan cerrados.

- AccessRequestForm usa «configuración de su rubro».
- VerificarWhatsapp usa «Toque ... péguelo aquí».
- AuthShell conserva los guards negativos anteriores y añade variantes formales; acceso-acompanado exige «le contactamos/le escribimos».
- Inspección de los4 archivos del delta: sin cambio de lógica, precios, condiciones, flags o permisos.
- Verificación independiente: AuthShell12/12PASS; diffcheckPASS. No se repitieron las69 pruebas.
- HEAD exacto y worktree auth-usted-pr limpio al revisar.
- Cadena Git comprobada: master5102535c → 6e52f86b → 3dd5027a → ae641152. El traslado6e52f86b tiene patch-id estable bce2655087c9792a5380871101c4f7a16c0146ff, igual al reportado para78e8f67d. No arrastra la base QA C13/C15.
- QA visual pertenece a Madre y no está acreditada por esta revisión. Los textos fuera del alcance inicial permanecen como límite, no como hallazgos abiertos de este delta.
