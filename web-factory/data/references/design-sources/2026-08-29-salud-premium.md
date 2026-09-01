# Salud premium — despiece medido (2026-08-29)

Método: Playwright headless, `reducedMotion`, estilos computados de la home
pública (colores/tipo/CTA medidos, NO copiados: se estudia el patrón, no la
identidad). Pedido de Sergio: aprender estilos/colores de referencias reales y
aplicarlos a la creación. Tend (hellotend.com) quedó fuera: Cloudflare bloquea
también el navegador del pane, y bot-walls no se pelean.

## One Medical (onemedical.com) — 200 OK

- Display: **GT Super Display 72px / peso 500** (serif editorial, no negrita).
- Cuerpo: **Ginto** (sans geométrica) — 371 nodos vs 65 del display: la serif es
  ESCASA y por eso manda.
- Paleta medida: verde profundo `#005450` (superficie y CTA) · blanco ·
  `#f4f4f4` · **miel `#ffc776`** · crema `#ffedce` · hueso `#f5f3ef`.
- CTA: pill (36px radius) verde profundo, texto blanco.

## Parsley Health (parsleyhealth.com) — 200 OK

- Display: **Teodor 64px / peso 300** — serif LIVIANA; la elegancia es el peso
  bajo a tamaño grande.
- Cuerpo: **Euclid Circular B** (geométrica).
- Paleta medida: petróleo `#284849` (dominante, 59 nodos) · hueso `#f8f6f2` ·
  menta `#c1e5db` · salvia `#6fb29f` · **caramelo `#bf7e3d`**.
- CTA: pill petróleo, texto blanco.

## El patrón destilado (regla operable)

1. **Serif de display en peso 300–500 a tamaño grande.** La marca no grita con
   negrita: la elegancia clínica es serif liviana enorme + sans geométrica de
   cuerpo. Nuestro clinic pedía 820 — apagaba la dirección premium.
2. **Verde profundo/petróleo como superficie Y CTA**, nunca como texto chillón.
3. **Neutros CÁLIDOS** (hueso/crema), jamás gris frío.
4. **UN acento cálido tierra (miel/caramelo `#bf7e3d`–`#ffc776`)** en dosis
   chicas. El coral saturado no aparece en ninguna de las dos: el rubro pide
   calidez baja en saturación.
5. **CTA = pill sobre el verde profundo** con blanco. Consistente en ambas.
6. Superficies secundarias en la familia del primario aclarada (menta/salvia),
   no en gris.

## Aplicado (misma fecha)

- `landing-clinic`: pesos display 820→450 (hero), 820→560 (números), 750→650
  (botón), 640→480 (heading del pedido).
- `dental-amanecer`: acento `#e46a4a` (coral) → **`#c98a3b` (miel)**.
- Cadena del conocimiento: esta ficha es capa 3 (cruda); si el patrón se
  confirma en más rubros, destilar a `WEB_FACTORY_PATTERN_BANK_2026.md`.
