Piso: 0,70 (FLUJO.md:28)
refs_internal.leave_one_out_min: 0.698
negatives_max: 0.224

### Tests

| Imagen | Parecido (centroid) | Cara (px) | Veredicto |
| --- | --- | --- | --- |
| g2-v2-final-1080x1920_t1.png | 0.801 | 180 | OK · cara < 200 px: poco confiable |
| g2-v2-final-1080x1920_t3.png | 0.793 | 186 | OK · cara < 200 px: poco confiable |
| g2-v2-final-1080x1920_t6.png | 0.781 | 94 | OK · cara < 200 px: poco confiable |
| g2-v2-final-1080x1920_t9.png | 0.792 | 179 | OK · cara < 200 px: poco confiable |
| g2-v2-final-1080x1920_t12.png | 0.651 | 234 | BAJO |
| g2-v2-final-1080x1920_t15.png | 0.774 | 153 | OK · cara < 200 px: poco confiable |
| g2-v2-final-1080x1920_t17.png | 0.796 | 195 | OK · cara < 200 px: poco confiable |
| g2-v2-final-1080x1920_t26.png | 0.745 | 173 | OK · cara < 200 px: poco confiable |

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

8 tests · 1 bajo el piso · 0 sin cara
