Piso: 0,70 (FLUJO.md:28)
refs_internal.leave_one_out_min: 0.698
negatives_max: 0.224

### Tests

| Imagen | Parecido (centroid) | Cara (px) | Veredicto |
| --- | --- | --- | --- |
| p9-final-1080x1920_t1.png | 0.788 | 179 | OK · cara < 200 px: poco confiable |
| p9-final-1080x1920_t3.png | 0.738 | 175 | OK · cara < 200 px: poco confiable |
| p9-final-1080x1920_t5.png | 0.709 | 172 | OK · cara < 200 px: poco confiable |
| p9-final-1080x1920_t8.png | 0.763 | 383 | OK |
| p9-final-1080x1920_t10.png | 0.781 | 463 | OK |

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
