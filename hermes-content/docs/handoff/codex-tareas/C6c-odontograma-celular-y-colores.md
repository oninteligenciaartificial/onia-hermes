# C6c · Odontograma: que funcione en el celular y que caries no se confunda con corona

Sos Codex. Trabajás SOLO en `onia-platform`, rama `codex/c6b1-caras-api` (la del PR #119, head `da3820ea`).
- Primero `git branch --show-current`. Después `git merge origin/master`.
- Aplicá el banco de las capturas: `git am hermes-content/docs/cola/capturas-odontograma/banco.patch` (en `onia-hermes`;
  agrega el escenario `?caso=varias`). Si no aplica limpio, copiá a mano solo `app/dev/**`.

## META
A 390 px el arco no se puede usar: piezas de ~14 px, encimadas, y tocar la 36 abre la 37. Es lo único que impide usar
el odontograma desde el celular. Y caries (ámbar) y corona (amarillo) casi no se distinguen.

## Causa medida (no la busques de nuevo)
`app/globals.css:615` tiene `*, *::before, *::after { min-width: 0; }` **fuera de capa**. En Tailwind 4 los estilos sin
capa le ganan a `@layer utilities`, así que **todos** los `min-w-*` del producto están apagados (`min-w-11` de cada pieza,
`min-w-[800px]` del arco y unos 20 más en `app/` y `components/`; los 118 `min-w-0` no cambian nada).

## Lo que se hace
1. Envolver esa regla en `@layer base { … }`. Así los `min-w-*` vuelven a valer y el reset sigue para todo lo demás.
2. **Barrido obligatorio**: `grep -rnoE "min-w-[^ \"'\`]+" app components --include=*.tsx | grep -v "min-w-0"`.
   Cada uso que no sea `min-w-0`: abrir la pantalla en un banco `/dev/*` existente (o el componente montado en un test de
   render si no hay banco) a 390 px y comprobar que **la página** no gana scroll lateral (`documentElement.scrollWidth <= 390`).
   Lo que tenga ancho mínimo grande (tablas `min-w-[60rem]`, `[52rem]`, `[640px]`…) tiene que estar dentro de un
   contenedor con `overflow-x-auto`; si no lo está, agregáselo. Tabla en el resumen: archivo · clase · ¿tenía contenedor? · qué hiciste.
3. Arco a 390: con el `min-w-[800px]` vivo el arco se desplaza de lado dentro de su caja. Que se vea una pista de que hay
   más (sombra o borde en el lado cortado) y que la pieza abierta quede visible (`scrollIntoView({inline:'center'})` al abrir).
   Cada pieza ≥ 44 px de ancho tocable.
4. Colores: caries y corona tienen que distinguirse a simple vista en el arco y en la leyenda. Usá tokens existentes del
   tema (buscá los de estado en `app/globals.css` / `components/odontogram/`); no inventes hex. Si solo queda color, sumá una
   segunda señal (borde o patrón) a uno de los dos.
5. Botones de cara: que cada uno lleve el color de su condición (además del texto), para ver las cinco caras de un vistazo.

## PRUEBA DE HECHO
- Test que lea `app/globals.css` y falle si el reset de `min-width` está fuera de `@layer base`.
- Playwright en `/dev/odontograma?caso=varias` a 390: `page.click()` real (sin `dispatchEvent`) sobre la 36 abre la 36.
  Escribí ese test en `e2e/` o como script en `scripts/` y anotá el resultado.
- Capturas 390 y 1440 (arco, pieza 36 abierta, pieza 11) en `docs/capturas/c6c/`, abiertas y MIRADAS.
- `npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` completo verde.

## REGLA DE PARADA
- Tocás: `app/globals.css` (solo esa regla), `components/odontogram/**`, `app/dev/odontograma/**`, sus tests, y los
  contenedores `overflow-x-auto` que el barrido pida. Nada más.
- No cambies datos, API, migración ni permisos del PR. No toques `components/agenda/**` (C5b) ni `app/(dashboard)/caja-diaria/**` (C8b).
- Si el barrido encuentra una pantalla que se rompe y no se arregla con un contenedor, NO la rediseñes: anotala y seguí.
- Textos de usted.

## Entrega
Commits conventional en castellano con el porqué, push a la misma rama (actualiza el PR #119). Resumen: SHAs, tabla del
barrido, resultado del clic real, números de tsc/eslint/vitest y la lista de capturas.
