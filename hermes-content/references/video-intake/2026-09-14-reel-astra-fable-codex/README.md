# GPT-6 Astra vs Fable 5.1 — edición social

Edición vertical 1080×1920, 30 fps y 32 segundos para Instagram Reels y TikTok.
La toma original se conserva en `C:\Users\PC\Downloads\video fable 5.1 vs gpt 6 astra.MP4`.

`edit.py` recorta pausas, compone seis mockups de pantalla originales, alterna
transiciones laterales de 340 ms, sincroniza subtítulos breves revisados a
partir de una transcripción local y normaliza la voz. El montaje toma del
[Reel de referencia](https://www.instagram.com/p/DdE7wYbxjPK/) la estructura de
pantalla grande arriba y presentador abajo; no incorpora su video, música,
marcas ni imágenes.

Las cifras mostradas corresponden a [OpenAI](https://openai.com/index/gpt-6-astra/)
y [Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-1). Los paneles
"EN MI PRUEBA" señalan opiniones del presentador, no resultados de benchmarks.

Para regenerar, instalar `Pillow`, tener FFmpeg en el PATH y ejecutar
`python edit.py` desde esta carpeta. El script evita sobrescribir el MP4 final;
se debe mover o renombrar el archivo existente antes de una nueva renderización.
Los PNG, subtítulos y el filtro reproducible quedan en `build/`.
