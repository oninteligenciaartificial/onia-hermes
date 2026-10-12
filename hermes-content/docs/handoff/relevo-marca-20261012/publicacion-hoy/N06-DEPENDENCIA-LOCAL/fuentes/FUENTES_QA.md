# QA independiente de cinco TTF candidatas — dictamen actual

12-oct-2026. Revisor `/root/qa_sol`. **PASS5/5 integridad y pesos900/700/600/400/600**, TrueType estáticas sinfvar/gvar, OFL coherente. Sin instalación, render o master.

| Archivo | Bytes | OS/2peso | Versión/build | Procedencia |
|---|---:|---:|---|---|
| Inter-Black.ttf |419896|900|4.001/git-9221beed3| cara extraídaTTCoficialv4.1 |
| Inter-Bold.ttf |420396|700|4.001/git-9221beed3| cara extraídaTTCoficialv4.1 |
| Inter-SemiBold.ttf existenteGit |339120|600|4.001/git-66647c0bb| Gitfbad86d1 exacto |
| Inter-Regular.ttf |411608|400|4.001/git-9221beed3| cara extraídaTTCoficialv4.1 |
| JetBrainsMono-SemiBold.ttf seleccionado |277092|600|2.304| tagoficialv2.304 |

Cuatro fuentesInter reutilizan pruebaspreviasPASS:SHA256/bytes exactos, SemiGitidéntica y trescaras con tablas iguales alTTCoficial salvohead/checksum delcontenedor. No se repitieron ni se modificaron. Las tresextracciones no son entradasTTFnativas ybuild9221 difiere deSemiGit66647, aunque metadata sea4.001.

## Único delta verificado

JetBrainsMono-SemiBold2.304:SHA2561b3bfa1ed5665a4ce3f9feb68d2d4e40e70bf8b4b7d9a3edd418f321b4e166a0, blob a70e69bd21aa901f93ffa280f691cf513d13859d. Metadata2.304, peso600, glyf estático sinfvar/gvar. Tagoficialv2.304, commitcd5227bd1f61dff3bbd6c814ceaf7ffd95e947d9.

OFLdel mismo tag:SHA25630f0c136e3c88e422d0791acd97238870f9054a9729bc34cf2ff0d4ed8cac4ad, blob8bee4148c1d54dbf5dae6d6c117fc80414266abb. Campos de hash delmanifiesto coherentes con archivo. Se verificaron únicamente esteTTF/licencia/etiquetas modificados; sin repetirotrascuatro fuentes.

## Límites y hallazgo preservado

JetBrains2.305tenía nombreSemiBold peroOS/2peso472; queda archivada comoNOSELECCIONADA, sinalterarla. El hash de licencia superior anterior quedó corregido. Historial enFUENTES_QA.json.

JetBrains2.304sigue candidato nominal de familia/peso, no fuenteoriginalequivalente. AssetsGitBold/ExtraBold son2.211; versión de cachéN06UNKNOWN. Intercandidatas build9221 no equivalentes aGitSemi66647. README/manifest distinguenCANDIDATOS y originales; no se afirma inexistencia universal deSemi2.211 desde búsquedaacotada heredada.

OFL1.1 permite uso/bundle/embedding conservando licencia/copyright ycondiciones. AdapterPillowporruta requiere revisar composición,saltosde línea y cortes. EsteQA no prueba igualdad depíxeles, fuenteusadaenrenderClaude ni masterpublicable.
