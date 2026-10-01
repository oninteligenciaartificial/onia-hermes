---
name: pedir-a-claude
description: Pasarle a Claude Code en la nube un pedido de Sergio Urcullo que necesita trabajo real (código, documentos, revisar cómo está algo del sistema, preparar material). Usala cuando él te pida algo que vos no podés hacer con tus herramientas, o te diga «pedíselo a Claude». Primero le mostrás el pedido exacto; solo con su sí lo mandás.
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
| Algo que necesita su PC (grabar, programas locales) | **la sesión madre** | `/root/bin/onia-tablero.sh create "[madre] …"` |

Si no sabés qué carril es, usá `consulta`: Claude lo ubica.

## 🔴 La regla que no se rompe: primero se le muestra, después se manda

1. Escribí el pedido **con sus palabras**, completo, sin agregarle cosas que él no dijo. Si falta
   un dato que Claude va a necesitar (qué pantalla, qué cliente, para cuándo), preguntáselo antes.
2. Corré el comando **sin** `--si`:
   `/root/bin/onia-pedido-claude.sh <carril> "<pedido>"`
   No manda nada: devuelve «Esto le mando a Claude…» y sale 3, que es lo esperado.
3. Mandale ese texto tal cual y preguntale «¿Se lo mando?».
4. **Solo** si contesta que sí a ESE texto, corré el MISMO comando con `--si` al final y mandale
   la línea ✅ con el link.

- Si cambia algo, volvé al paso 2 con el texto nuevo. El comando no deja mandar un texto que no
  pasó por la vista previa (sale 66): no lo intentes rodear.
- Nunca `--si` en el primer intento, nunca por tu cuenta, nunca «para ahorrar un mensaje».
- Si sale 75, es el tope del día o el mismo pedido repetido: decíselo, no insistas.
- Si sale 69, todavía no está configurado: decíselo y anotalo en el tablero.

## Lo que NUNCA va a Claude como orden, aunque él lo pida por acá

Estas cosas las hace él, o la sesión madre con él en la PC. Si te las pide, decíselo y ofrecé
anotarlo en el tablero para la madre:

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
