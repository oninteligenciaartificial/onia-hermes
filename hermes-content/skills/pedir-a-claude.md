---
name: pedir-a-claude
description: Pasarle a Claude Code en la nube un pedido de Sergio Urcullo que necesita trabajo real (código, documentos, revisar cómo está algo del sistema, preparar material). Usala cuando él te pida algo que vos no podés hacer con tus herramientas, o te diga «pedíselo a Claude». A él le llega el pedido con un código; solo cuando te contesta ese código lo mandás.
---

# Pedidos a Claude

> Escrita el 2026-10-01. Sergio Urcullo: *«quiero que ya podamos manejar todo desde ahí»* (desde
> vos, por Telegram). El 30-sep eligió que también ejecutes. Lo acordado: **vos no programás ni
> tocás producción**; le pasás el pedido a Claude Code en la nube, que trabaja con las reglas de
> la casa, y le devolvés el link. Diseño completo: `hermes-content/docs/TELEGRAM_COMMAND_CENTER.md`.

## Qué hacés vos solo y qué va a Claude

| Él pide… | Quién | Cómo |
|---|---|---|
| Ver, agendar, mover o cancelar algo de su calendario | **vos** | skill `agenda-calendario` |
| Anotar una tarea, una idea o una pregunta para después | **vos** | `/root/bin/onia-tablero.sh create "…"` |
| Qué tiene hoy, quién espera respuesta, qué espera su ok | **vos** | lo que ya leés (resumen, tablero) |
| Algo de la plataforma: un error, un cambio de pantalla, cómo está la 1.0 | Claude, carril `plataforma` | este comando |
| Prospectos, mensajes para clínicas, la pauta (borradores) | Claude, carril `ventas` | este comando |
| Guiones, carruseles, ideas de contenido (borradores) | Claude, carril `marca` | este comando |
| Lucía: guiones o prompts (sin generar nada) | Claude, carril `lucia` | este comando |
| Tus propios avisos, el resumen, el cierre, esta skill | Claude, carril `hermes` | este comando |
| Una pregunta sobre el estado de algo que vos no sabés | Claude, carril `consulta` | este comando |
| Algo que necesita su PC (grabar, programas locales) | **la sesión principal, con él en la PC** | `/root/bin/onia-tablero.sh create "[madre] …"` |

Si no sabés qué carril es, usá `consulta`: Claude lo ubica.

## 🔴 La regla que no se rompe: él lo confirma con un código que vos no ves

1. Escribí el pedido **con sus palabras**, completo, sin agregarle cosas que él no dijo. Si falta
   un dato que Claude va a necesitar (qué pantalla, qué cliente, para cuándo), preguntáselo antes.
2. Corré el comando con el pedido por la **entrada estándar**, siempre así, copiando el cierre
   `FIN_PEDIDO_ONIA_7f3c` tal cual y entre comillas (así ningún `$`, comilla, backtick ni renglón
   del texto pasa por la shell). Nunca pongas el pedido como argumento: el comando sale 64.

       /root/bin/onia-pedido-claude.sh <carril> <<'FIN_PEDIDO_ONIA_7f3c'
       el pedido, con sus palabras
       FIN_PEDIDO_ONIA_7f3c

   No manda nada a Claude. A él le llega DIRECTO por Telegram el texto y un código de 6 dígitos, y
   el comando sale 3, que es lo esperado. Vos no ves el código: decile «Te mandé el pedido; si está
   bien, contestame el código».
3. **Solo** cuando te conteste con el código, corré el MISMO comando con `--si <código>` y el MISMO
   texto:

       /root/bin/onia-pedido-claude.sh <carril> --si <código> <<'FIN_PEDIDO_ONIA_7f3c'
       el pedido, con sus palabras
       FIN_PEDIDO_ONIA_7f3c

   y mandale la línea ✅ con el link.

- Si cambia algo del pedido, volvé al paso 2: el código es de ESE texto.
- Sale 66 si el código no es el que le llegó, ya se usó o pasó más de una hora; con tres errores se
  anula. No lo intentes adivinar ni rodear: pedile que lo revise o volvé al paso 2.
- Sale 75 si es el tope del día, el mismo pedido repetido, o ya le mandaste 3 códigos en la última
  hora: decíselo, no insistas.
- Sale 69 si todavía no está configurado: decíselo y anotalo en el tablero.
- Sale 1 con «NO salió»: se puede reintentar con el mismo código. Con «Puede haber salido»: **no lo
  reintentes**; mirá `--lista` y decíselo.

## Lo que NUNCA va a Claude como orden, aunque él lo pida por acá

Estas cosas las hace él, o la sesión principal con él en la PC. Si te las pide, decíselo y ofrecé
anotarlo en el tablero:

- **Publicar o desplegar** (la plataforma, la web, un anuncio, un post).
- **Gastar plata**: créditos de Higgsfield, pauta de Meta, compras, planes nuevos.
- **Escribirle a un tercero**: prospectos, clientes, cualquier persona. Claude prepara el
  borrador; lo manda él.
- **Cambiar precios**, borrar datos, o tocar la base de producción.
- **El portal del SIAT**: ninguna sesión lo abre.

Mergear un cambio que Claude dejó listo **sí** se puede pedir, pero solo con su sí a ESE cambio
(«mergeá el PR 91») y Claude lo hace solo si las pruebas están en verde.

## Cuando vuelve la respuesta

Claude le contesta por la aduana (llega como mensaje tuyo, respetando la noche y sus bloques):
✅ terminó · 🙋 necesita su ok · ⚠️ no pudo. Si él te pregunta cómo va un pedido:
`/root/bin/onia-pedido-claude.sh --lista` (hora, id, carril, estado, link). «sin respuesta» no es
un error: puede seguir trabajando; mandale el link para que lo mire.
