Piso: 0,70 (FLUJO.md:28)
refs_internal.leave_one_out_min: 0.698
negatives_max: 0.224

### Tests

| Imagen | Parecido (centroid) | Cara (px) | Veredicto |
| --- | --- | --- | --- |
| k1-1-recepcion-celular-4afffb96.jpg | 0.806 | 237 | OK |
| k2-1-cafe-mostrador-3e05cfd0.jpg | 0.830 | 225 | OK |
| img-nano-banana-2-1-a4dd1a48-limpia.jpg | 0.724 | 242 | OK |
| img-kling-omni-image-c3706d45.jpg | 0.789 | 234 | OK |
| k4-3-cafe-teclado-186c82f0.jpg | 0.839 | 456 | OK |

### Referencias (informativas; centroid leave-one-out)

| Imagen | Parecido (centroid) | Cara (px) | Veredicto |
| --- | --- | --- | --- |
| R1_frontal_canon | 0.799 | 440 | OK |
| R2_34_medio | 0.758 | 196 | OK · cara < 200 px: poco confiable |
| R3_casi_frontal | 0.772 | 744 | OK |
| R4_casi_perfil | 0.698 | 444 | ref bajo el piso |
| R5_34_izq | 0.820 | 317 | OK |
| R6_34_der | 0.816 | 206 | OK |
| R7_frontal_2752 | 0.780 | 614 | OK |
| R8_anchor_902eeebb | 0.726 | 572 | OK |

### Negativas (caras de otras personas que calibran el piso; informativas)

| Imagen | Parecido (centroid) | Cara (px) | Veredicto |
| --- | --- | --- | --- |
| N1_casting_C01 | 0.187 | 815 | negativa (calibra el piso) |
| N2_casting_C13 | 0.058 | 406 | negativa (calibra el piso) |
| N3_casting_retrato | 0.224 | 497 | negativa (calibra el piso) |

5 tests · 0 bajo el piso · 0 sin cara
