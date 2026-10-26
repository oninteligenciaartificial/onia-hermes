# Lucia — Demo end-to-end (2026-07-09)

## Lipsync — 3 intentos, la lección de la ANCLA

- ❌ `lucia-lipsync-elevenlabs-demo.mp4` (wan2_7, 8s) — **SE ROMPE**. Ancla mala: still de
  cocina en pose de acción (revolviendo café, riendo, mano en cuadro). El modelo peleó
  contra la pose y se deformó. NO usar esta como referencia — es el ejemplo de qué NO hacer.
- ✅ `lipsync-wan27-cleananchor.mp4` (wan2_7, 6s) — ESTABLE. Misma voz, ancla limpia.
- ✅ `lipsync-seedancemini-cleananchor.mp4` (seedance_2_0_mini, 6s) — ESTABLE, identidad
  un toque más natural. **Preferido.**

**Lo que cambió:** la ancla (`191be0be`) es un retrato cara-y-hombros de FRENTE, calma,
manos fuera de cuadro, generado con `nano_banana_pro` + `902eeebb`. Con esa ancla los dos
modelos quedan bien. **El problema era la ancla, no (solo) el modelo.** Ver regla en
`hermes-content/docs/historial/references/VIDEO_MODEL_STACK_DECISION_2026.md`.

- **Voz (los 3):** ElevenLabs "Lucia-ONIA" `wrXs6GqcC7X03dDKMoeT` → mp3 subido a Higgsfield
  (`2e376e85`) → pasado como `audio_references`. Confirma que wan2_7 Y seedance_2_0_mini
  toman NUESTRA voz (Marketing Studio no, hace la suya).

## Estado del sistema de Lucia (COMPLETO y funcional)
- ✅ Identidad: shoot quirúrgico aprobado (10 ángulos), Element `902eeebb`, avatar MS `a1e334f3`.
- ✅ Ropa: 5 fichas turnaround control (`lucia-fit-*-v2`), sin marca, todos los ángulos.
- ✅ Generación original: cara-Element + ficha + escena en texto (no copia fotos viejas).
- ✅ Voz propia: ElevenLabs "Lucia-ONIA" `wrXs6GqcC7X03dDKMoeT`, en VPS.
- ✅ Stack de video definido (`hermes-content/docs/historial/references/VIDEO_MODEL_STACK_DECISION_2026.md`).
- ✅ Lipsync con su voz (este demo) + b-roll (minimax/kling) + edición.

Pendiente (no técnico): crear cuenta IG (handle+bio), y armar el template Remotion del
formato para producir en volumen.
