Cuando un usuario comenta 'COMUNIDAD' en cualquier post:  
1) Registrar el comentario (post id) en /root/loops/onia-hermes/out/guiones/20260903/assets/comments_inbox.csv  
2) Responder manualmente con el enlace que corresponda. Plantilla de respuesta: "Gracias — te paso el recurso: [ENLACE]."  
3) Si se requiere entrega automatizada, ejecutar: /root/loops/onia-hermes/scripts/send_link_on_comment.sh --post-id <POST_ID> --resource <resource_file>  

Nota: el script send_link_on_comment.sh es un placeholder; para habilitarlo se necesita credenciales de API de la plataforma (no incluidas). No ejecutar sin tokens.