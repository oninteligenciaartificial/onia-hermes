# ONIA 1.0 — validación pública de la integración Hermes (27-sep-2026)

**Estado vigente:** el apéndice registra el candidato sobre `02a4eef8` y la
suite Linux de 1.693 pruebas aprobadas, 4 omitidas. La
[revisión menor y adjudicación](revision-hermes-20260927.json) conserva los
hashes del código. El bloque siguiente documenta la primera comprobación.

## Registro inicial

Worktree `codex/v1-integracion-20260927`, base `origin/main` en
`d0757d4dba38112873b6988f7b0e37e589bef283`. Alcance: portada corta,
promesas públicas, rubros, CTA y facturación SIAT. No se editó código de producto,
no se publicó ni se usaron datos reales.

| Comprobación | Resultado |
| --- | --- |
| Manifiesto `onia-v1-integracion-20260927.json` | 21/21 archivos presentes y SHA256 coincidente. |
| Dependencias aisladas | `npm ci --no-audit --no-fund` en `web-factory/apps/onia-platform`; sin junction compartido. Aviso de entorno: Node local 24.13.0; el paquete declara 22.x. |
| Tipos | `npm run typecheck`: OK. |
| Tests home, fiscal, rubros y CTA | Vitest focal: 12 archivos y 256 tests pasan; 2 tests de `src/app/(sitio)/cierre.test.ts` fallan en Windows. Ese archivo no cambió en la integración: usa `path.relative()` (separador `\` en Windows) y compara contra rutas literales con `/`; el segundo fallo deriva de no encontrar `sitio.module.css`. No se corrigió código fuera del alcance. |
| Build | `node_modules/.bin/next.cmd build`: OK; 56 rutas generadas, incluidas `/`, `/rubros`, `/facturacion` y `/empezar`. Se ejecutó Next directamente porque `npm run build` dispara antes la suite completa, que ya tiene el fallo de Windows anterior. |
| Browser local | Chrome contra `next start` aislado en `localhost:49327`: portada renderizada; el CTA «Ver cómo funciona» navega a `/rubros`; enlace de Facturación navega a `/facturacion`; los cinco rubros se leen y el CTA «Creá tu cuenta» tiene destino `https://app.onia.com.bo/register`. No se abrió el alta productiva. |

La portada muestra un hero, rubros, tres tareas, precio y cierre. En la prueba
desktop de 1536×695 px, su altura fue 3.686 px (unas 5,3 pantallas). El hero y
el CTA principal caben en la primera pantalla; esta medición no sustituye una
comparación visual contra la portada publicada ni una revisión móvil.

La ruta `/facturacion` dice expresamente que el emisor de ONIA sigue en
homologación, que la factura con valor fiscal se carga en el Portal Web del SIN
y que el registro exportable no es el RCV oficial. El pie heredado «EMITE
FACTURA» identifica al vendedor junto a su NIT y está exigido por el guard
legal `src/app/legal-publico.test.ts`; no debe leerse como capacidad del emisor
de Platform. Sigue pendiente la prueba bancaria/fiscal real y la autorización
del SIN: esta validación es sólo del sitio local integrado.

Antes de integrar, queda por ejecutar la suite/prebuild en el entorno Linux
de despliegue y confirmar el diseño móvil. No se hizo deploy, push ni commit.

## Apéndice — suite completa posterior con inventario fiel

La integración se reconcilió sobre `02a4eef8`. El resultado anterior se conserva
como historia: no es el resultado de esta nueva corrida ni se declara verde la
suite completa Windows. Las dos copias Linux recortadas anteriores se descartaron
como aceptación: omitir nombres de directorios hermanos cambiaba el universo del
scanner y podía producir un verde sin medir la misma fuente.

| Comprobación posterior | Resultado y límite |
| --- | --- |
| Candidato Linux completo | `/tmp/onia-web-qa-completa-20260927-5q0_nb8j`; SHA-256 `ac57c5c4477c107e2e3200798dcd55b44e68a7efb60dfbea4b9c21fbca6b8dda`. Node 22.22.1, dependencias copiadas a la carpeta privada con lockfile coincidente; namespace sin red exterior, sólo loopback. |
| Fuente | 1.079/1.079 archivos del manifiesto presentes y SHA coincidente contra integración local: texto normalizado a LF, binarios conservados. Lockfile normalizado: `2037fea2ce427896ece9d5323aac59fe26a6672685222c31edd96534438b56d1`. Originales Windows conservados. |
| Universo del scanner | Inventarios de directorios de raíz y `web-factory/` preservados; fuentes de las demás apps incluidas, sus assets omitidos. La entrada `alta-confirma-vivo.mjs` se restituyó: su aparente obsolescencia venía del recorte, no de un cambio del producto. |
| Suite completa Linux | **125 suites pasan; 1.693 pruebas pasan, 4 omitidas; exit 0.** Tres omisiones de `deploy-vivo.test.ts` requieren historia Git `origin/main`, ausente del paquete; ese archivo pasó 52/52 en el repositorio Windows. La cuarta omisión pertenece a `puesta-en-marcha.test.ts`. No se acredita historia Git con un repositorio vacío. |
| Agenda en rubros | El guard conserva una exención específica para la descripción bajo el encabezado visible «Servicios»: ese rubro tiene agenda y el recorrido E2E la ejercita. No se cambió el copy ni se llamó a una API para satisfacer el test. La exención se vuelve a medir por archivo y fragmento. |
| Checks dirigidos y tipos | `cierre.test.ts`: 20 pruebas pasan; reconciliación de hero/guard de sección: 51/51; typecheck Windows pasa. Son checks adicionales, no una suite completa Windows verde. |
| Build y medición | El build previo generó 56 rutas, antes de los últimos ajustes de pruebas; no se ejecutó otro build tras ellos. Se conserva la medición móvil previa 16.170 → 4.845 px a 390 × 844; no se hizo una nueva medición del candidato final ni se midió conversión. |

Evidencia local: [resultado](../../../.tmp/homelab-20260927/web-linux-completa-result.json),
[manifiesto de archivos](../../../.tmp/homelab-20260927/web-linux-completa-files.json)
y [log completo](../../../.tmp/homelab-20260927/web-linux-completa-tests.log).
Este apéndice acredita pruebas del candidato aislado: no un deploy, el build de
todo el monorepo, un pago real ni la homologación. SIAT permanece oficialmente al
80% (VI 150/560, IX 60/160); la 1.0 comercial y el segundo pago siguen abiertos.
