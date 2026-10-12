# Delta de transporte binario — Marca, 12-oct-2026

Destino nativo: `01a13170-b488-71d9-83f8-12663d5a0013`. Manifest base: commit `1467b2d3ed4e794137311d6451165430124b30c6`, sin modificar. Rama de delta: `codex/relevo-marca-20261012`.

## Causa y alcance
El destino reportó 43/59 sin diferencias y límite técnico de su conector >32MiB. Aquí se verificaron metadatos de los tres originales y carpeta sin denegación; todos sólo user/owner. Los bytes completos ya se habían leído correctamente en Work. No se reprodujo el error nativo ni se deduce de ello acceso/login nativo. La partición autorizada sólo adapta transporte, no elude denegaciones de acceso o política.
Son tres objetos: ZIP N02, bruto DD-A, bruto N06. Hay 17 rutas asociadas en el inventario; N02-borrador-original-Claude.mp4 también está en Borradores-originales-Claude.zip, objeto pequeño ya transferido. Por tanto 16 rutas todavía dependientes de estos objetos es consistente con el reporte del destino. No se afirma cotejo de sus 16 rutas nominales sin recibir su lista.

## Destino y conservación
Misma carpeta privada: `1bYK_ahMyjIh_Ta9CHGF_1WflOiuFFRZa`. No se cambió ningún permiso ni objeto existente. Fuentes locales y 59 archivos originales intactos. No recodificación, edición, conversión, compresión nueva ni instalación.
12 partes; límite 20MiB = 20.971.520 bytes, todas dentro del límite. Cada parte fue descargada desde Drive y medida, no sólo intentada/subida. 12/12 bytes+SHA256 y metadata carpeta/permisos coinciden.
Reensamblado local en orden antes de subir: tres SHA256 completos coinciden exactamente. El nativo todavía debe descargar/reensamblar/comprobar antes de abrir. Objetivo 59/59 recepción pendiente de esa comprobación independiente.

## Orden, IDs privados y hashes
Los nombres deben guardarse exactamente como figuran. Concatenar part001, part002…; las partes individuales no son archivos reproducibles ni ZIP abiertos.

### N02-ajuste-privado-evidencia.zip
Original conservado: `1dAZfGj0T2nKIgAdyXoKIVeFXyU5AeX6Z`. Bytes completos: 53323533. SHA256 completo: `e29c4b151b602de862a470c13abf1771c9489f8755791150117bc3f48b920fb6`.

| Orden | Nombre | Bytes | SHA256 parte | ID Drive privado |
|---:|---|---:|---|---|
| 1 | `N02-ajuste-privado-evidencia.zip.part001` | 20971520 | `9389ada23574ae0f5be6ad7179cac9e76e69cf3bf596e25a8b0716e212c08bc3` | `1AjSr8Itu-BEy2Xr0faGKbE5TNy8VAO2W` |
| 2 | `N02-ajuste-privado-evidencia.zip.part002` | 20971520 | `102ab32f0c02ee7caa0cc35a75aaaeb22a1e563176e460caf76f57a7215d54f3` | `19xBsFNR_7cv9U6jrcJ71c5vnrdkTiH7A` |
| 3 | `N02-ajuste-privado-evidencia.zip.part003` | 11380493 | `cfe3208b2783c236756ae384ca559057573fad07768c94c41d38c51915c3882c` | `1Ss_nnFMl0-DCP1u6hOsCPxQXZ7Bpog-b` |

### media-adjustment/DD-A-bruto-original.mp4
Original conservado: `1xFKbMIvoStrjVPbfrg6hG742kVirTPY5`. Bytes completos: 92453888. SHA256 completo: `8220af93f24be363a90c9fcc0fad4c1a77e4f9fb4556abe4cefaaace2f302593`.

| Orden | Nombre | Bytes | SHA256 parte | ID Drive privado |
|---:|---|---:|---|---|
| 1 | `media-adjustment--DD-A-bruto-original.mp4.part001` | 20971520 | `fe49dad6ce2540c46f0f91ee4a16999c04189a35fb808f507736141a763c9657` | `1Yzr0ITPQDUdpBpdmlITTYPNDKyt3ppvf` |
| 2 | `media-adjustment--DD-A-bruto-original.mp4.part002` | 20971520 | `fbad69d97102c989a9680922e8fafeca5eb7537906d7f2d0b3b8c03f4045086b` | `1JnNMcdjWprZTuzWXhA49zBEJ74u0uJm0` |
| 3 | `media-adjustment--DD-A-bruto-original.mp4.part003` | 20971520 | `3bc289c1930b73207adc828abebcb83f3fb5bb760528793df5e1458b2ce8b9c2` | `1bKCGdxKCscdUEKoiBmm2T-5NNyrghc67` |
| 4 | `media-adjustment--DD-A-bruto-original.mp4.part004` | 20971520 | `06be26e2c1bae35dd96c9080d62d13afaf8ca07d74da3b37fbd0b41f6fed5d81` | `1fvCpgZNi3Y9VhDoHJCcss-PiSwfjDnmL` |
| 5 | `media-adjustment--DD-A-bruto-original.mp4.part005` | 8567808 | `b061a2011c30a8b4ee4f530c7153c4f5089f645c2e685dbb9aba30bf9385eba2` | `1EPsC2tBqFkxVrH66WGl300a7sb4J61Uj` |

### media-review-n06/bruto.mp4
Original conservado: `18WULGYFlDTEaAneWUDzxWrxYi5OZFbSY`. Bytes completos: 69843125. SHA256 completo: `6e3702e1378de3432843633c2bff2f76c654acaa251b3c38b9f1f3a9acff8fb9`.

| Orden | Nombre | Bytes | SHA256 parte | ID Drive privado |
|---:|---|---:|---|---|
| 1 | `media-review-n06--bruto.mp4.part001` | 20971520 | `64035c85764d2b5fc03a9192d0c927c97eafa448dc73b76c676aacf1ca457474` | `1sqkFQlhWD-aW8QrEFZvRtDPkx3Ho__R_` |
| 2 | `media-review-n06--bruto.mp4.part002` | 20971520 | `894a7a394a3527534bf1fc9448099036e34c623d1198dfbc2203ab44dc6b1003` | `1LOuwqXDNonIw2-QDTYa90ZIu7VbFLQjN` |
| 3 | `media-review-n06--bruto.mp4.part003` | 20971520 | `07a66b03e8bac4e3baf6f232b77f1eabbc06b3071bca56687ac91ebea7735352` | `1LxxJ4W089K3BqCPVZO3B_HcJ7MZZesAH` |
| 4 | `media-review-n06--bruto.mp4.part004` | 6928565 | `5e6088fe0af1327fc832c0e3a9911c0ed573cebdeeff6a6ed2de61b7291594a2` | `1p4EPhitplEA1zYYvdoobi07TDgmFfKfG` |

## Rutas recuperables afectadas
El JSON base conserva bytes/hash/dimensiones de cada ruta y miembro ZIP; este delta cambia sólo la forma de transportar tres contenedores.

- `N02-ajuste-privado-evidencia.zip`
- `media-adjustment/DD-A-bruto-original.mp4`
- `media-adjustment/DD-A-marcador-original.png`
- `media-adjustment/N02-antes-ajuste.jpg`
- `media-adjustment/N02-despues-ajuste.jpg`
- `media-adjustment/N02-empalme-comparado.jpg`
- `media-adjustment/N02-preview-sin-arranque-falso.mp4`
- `media-adjustment/seam-0.png`
- `media-adjustment/seam-1.png`
- `media-adjustment/seam-2.png`
- `media-adjustment/seam-3.png`
- `media-adjustment/seam-4.png`
- `media-adjustment/seam-5.png`
- `media-adjustment/seam-6.png`
- `media-adjustment/seam-7.png`
- `media-review-n06/N02-borrador-original-Claude.mp4`
- `media-review-n06/bruto.mp4`

## Receta nativa segura
1. Leer JSON de delta y SHA256SUMS; descargar por IDs mediante conector autorizado, guardando nombres originales.
2. Ejecutar `python reensamblar-marca-partes.py RELEVO_MARCA_20261012_DELTA_PARTES.json carpeta-partes carpeta-salida` con Python ya existente. La receta verifica cada parte, concatena en orden, mide archivo completo y sólo después renombra a extensión original. No sobrescribe ni abre medios.
3. Sólo tras verified=true, abrir el MP4 o extraer el ZIP N02. Restituir rutas según manifest base y cotejar sus hashes.
4. Devolver conteo final de 59/59 desde destino; no declarar recuperación final por subida de partes.

## Evidencia y límites
Las 12 IDs son resultados observados de upload_file; hashes remotos de download_raw_file autenticado, sin publicar URLs firmadas. Permisos leídos: únicamente user/owner en misma carpeta. SHA256 medidos completos en JSON. Modelo Work no observable. No nuevas publicaciones, gastos, ediciones, credenciales ni acceso al PC.

Receta entregada probada con las 12 partes locales: reconstruyó los tres archivos en salida separada, bytes y SHA256 completos correctos. No se abrieron medios.
