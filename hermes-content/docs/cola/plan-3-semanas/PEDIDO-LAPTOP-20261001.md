# Pedido para la sesión de la laptop · 1-oct-2026

La sesión de Marca personal en la nube (`session_012ppFowADbJNtZ6WBMtqpuf`) no pudo hacer esto: la nube no
llega a esas páginas, a la llave del VPS ni a los archivos de la PC. Sergio Urcullo lo lanza en la laptop.

**Reglas para no pisarse:**
- Primero `git pull` de `claude/marca-personal-contenido-ae658c`.
- Escribí SOLO en `hermes-content/docs/cola/plan-3-semanas/VERIFICACION-LAPTOP-20261001.md`: un bloque por ítem
  con lo que viste, la fuente y si el guion queda igual o qué frase cambia. No edites los guiones ni el handoff:
  eso lo integra la sesión de la nube.
- Commit y push al terminar.
- No publiques, no gastes créditos y no le escribas a nadie.

## Urgente (antes de grabar el jueves 1)

1. **Precios de WhatsApp de Meta** (`developers.facebook.com/documentation/business-messaging/whatsapp/pricing`
   y la página de *non-template messages*). Hay que confirmar tres cosas: desde el 1-oct los mensajes de servicio
   se cobran por mensaje; se cobran a la tarifa de utilidad; y cada número tiene 1.000 mensajes de servicio gratis
   por mes. Lo afirma el guion D02-B de `GUIONES-2-SEMANAS-1-14-OCT.md`. Si alguna de las tres no figura, anotá la
   frase exacta que hay que cortar. Revisá también la ventana gratis de 72 h de los anuncios que abren WhatsApp,
   que usa S2-D08-C (dom 11).

## Para la semana

2. **OpenAI DevDay del 29-sep.** Leé las fuentes oficiales (openai.com, developers.openai.com). Elegí lo que le
   sirve a quien aprende a construir o vender con IA, y escribí 1 o 2 guiones verticales con la vara de
   `BRIEF-ESCRITOR.md` (110–170 palabras, fuente primaria, algo que se demuestre en pantalla). Si encontrás algo
   sobre «GPT-6.1 Sol», confirmalo; es lo único que se vio desde la nube, en el SDK.
3. **La web `sergiourcullo.vercel.app`:** confirmá que estén vivas `/claude-code`, `/stack`, `/vps` y `/homelab`,
   que son los cierres de varios guiones. Anotá además si `/claude-code` todavía dice «3 subagentes» (hoy queda 1).
4. **gitdiagram.com:** abrí `gitdiagram.com/harry0703/MoneyPrinterTurbo` y confirmá que genera el diagrama y que
   un clic en un componente abre su archivo. Lo afirma el guion R01 (mar 6).
5. **Memoria local:** buscá en la memoria de Claude Code de la laptop (`git-en-worktree-usar-git-C.md` o similar)
   el caso del 1-sep: un `reset --hard` movió una rama 424 commits. Lo usa D05-A (sáb 10). Si el número no
   aparece, se usa la versión sin cifra.

## Con el VPS (solo si la sesión de la laptop tiene la llave y la infraestructura no tiene otro dueño en ese momento)

6. **n8n:** confirmá que el filtro por workflows activos muestra hoy los activos, como cuenta D05-C (lun 12).
   Solo lectura.

## Lo que sigue necesitando la laptop todos los días

- **Los brutos de video** (`C:\Users\PC\Videos\ONIA-brutos\`): o la laptop los edita, o se suben a una carpeta de
  Google Drive para que los edite la nube. Esto lo decide Sergio Urcullo.
- **Publicar y agendar desde el VPS** (`deploy/vps-ops/publicar/README.md`).
- **La revisión de perfiles con el Chrome logueado** (Instagram, TikTok, YouTube, LinkedIn): solo leer y proponer.
