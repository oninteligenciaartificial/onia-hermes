/**
 * DESIGN.md por cliente — «un estilo que puedas repetir».
 *
 * Nace del carrusel de Enrique Rocha «Stop AI slop» (2026-09-17, lámina 4):
 * un DESIGN.md en texto plano es lo que cualquier agente (Stitch, Claude,
 * Codex) lee para generar UI consistente. El motor ya tenía la RECETA
 * (`<slug>.design.md`: referencias, diales, riesgos) pero no el SISTEMA:
 * colores con rol, tipografía, radios, componentes y reglas de voz. Esto lo
 * escribe desde el perfil del cliente, así la web, un banner o un post salen
 * con la misma identidad sin volver a decidir nada.
 *
 * Formato: el de Google Stitch / VoltAgent awesome-design-md — secciones
 * cortas, tokens con rol, do/don't. Nada inventado: todo sale del perfil.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { clientSchema, type ClientProfile } from "../data/schema";

/** Contraste WCAG entre dos hex (misma fórmula que el configurador). */
export function contrastRatio(a: string, b: string): number {
  const lum = (hex: string): number => {
    const v = hex.replace("#", "");
    const parts = v.length === 3 ? v.split("").map((c) => c + c) : v.match(/.{2}/g);
    if (!parts || parts.length !== 3) return 0;
    const [r, g, bb] = parts.map((p) => {
      const c = parseInt(p, 16) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bb;
  };
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const fmt = (n: number): string => `${Math.round(n * 10) / 10}:1`;

/** Reglas de voz en español, destiladas de humanizer / stop-slop para copy de venta. */
export const VOICE_RULES = [
  "Voseo boliviano, presente, segunda persona: «reservá», «escribinos», «pedí».",
  "Titulares de 3 a 8 palabras. Sin raya (—) ni dos puntos dramáticos en titulares.",
  "Un hecho por frase. Nada de «llevá tu negocio al siguiente nivel», «soluciones integrales», «experiencia única», «sin esfuerzo».",
  "Sin tríadas forzadas ni «no es X, es Y». Sin adverbios de relleno («realmente», «simplemente»).",
  "Precios y plazos sólo si el cliente los dio. Si falta un dato, se pide; no se rellena.",
  "Sin autobombo del estudio: la web habla del negocio del cliente, nunca de quién la hizo.",
] as const;

export function designMdFromProfile(profile: ClientProfile): string {
  const c = profile.colores;
  const t = profile.tipografia;
  const textOnBg = contrastRatio(c.fg, c.bg);
  const primaryOnBg = contrastRatio(c.primary, c.bg);
  const whiteOnPrimary = contrastRatio("#FFFFFF", c.primary);
  const inkOnPrimary = contrastRatio(c.fg, c.primary);
  const buttonInk = whiteOnPrimary >= inkOnPrimary ? "#FFFFFF" : c.fg;
  const buttonRatio = Math.max(whiteOnPrimary, inkOnPrimary);
  const primaryAsText = primaryOnBg >= 4.5 ? "sirve como texto sobre fondo" : "NO sirve como texto sobre fondo (usar sólo como superficie: botones, chips, líneas)";

  return `# DESIGN.md — ${profile.nombre}

> Sistema de diseño de ${profile.nombre} (${profile.slug}). Lo lee cualquier agente antes de
> generar una pantalla, un banner o un post: todo lo de abajo sale del perfil del cliente
> (\`data/clients/${profile.slug}.json\`); si el perfil cambia, este archivo se regenera.

## Marca

- Nombre: **${profile.nombre}**${profile.logo ? ` · logotipo de texto: \`${profile.logo}\`` : ""}
- Promesa (tagline): ${profile.tagline || "_pendiente del cliente_"}
- Descripción: ${profile.descripcion || "_pendiente del cliente_"}
- Contacto principal: ${profile.contacto.whatsapp || profile.contacto.tel || profile.contacto.email || "_pendiente_"}${profile.contacto.direccion ? ` · ${profile.contacto.direccion}` : ""}

## Colores

| Rol | Hex | Uso | Contraste |
|---|---|---|---|
| Fondo | \`${c.bg}\` | fondo de página y secciones claras | — |
| Tinta | \`${c.fg}\` | texto principal | ${fmt(textOnBg)} sobre fondo${textOnBg >= 4.5 ? " ✓" : " ✗ (menos de 4,5:1)"} |
| Primario | \`${c.primary}\` | botones, enlaces, acentos de marca | ${fmt(primaryOnBg)} sobre fondo — ${primaryAsText} |
| Secundario | \`${c.secondary}\` | superficies oscuras, pies, titulares sobre claro | ${fmt(contrastRatio(c.secondary, c.bg))} sobre fondo |
| Acento | \`${c.accent}\` | detalles, iconos, estados | ${fmt(contrastRatio(c.accent, c.bg))} sobre fondo |

- Texto sobre primario: \`${buttonInk}\` (${fmt(buttonRatio)}).
- Un solo primario por pantalla. El acento nunca compite con el botón principal.

## Tipografía

- Titulares: **${t.heading}**, peso 700–800, interletrado −0,02em, líneas cortas (máx. 12 palabras).
- Texto: **${t.body}**, 16–18px, interlineado 1,5. Nunca menos de 14px.
- Escala: hero 48–64px · h2 32–40px · h3 22–24px · cuerpo 16–18px · etiqueta 12–13px en mayúsculas con +0,08em.

## Espacio y forma

- Ritmo de 8px. Secciones separadas por 64–96px en escritorio y 40–56px en móvil.
- Radio: 6px en botones y campos, 12px en tarjetas. Sin esquinas mezcladas en una misma vista.
- Sombras suaves y sólo en elementos que flotan (tarjeta destacada, botón fijo). Nada de sombras en todo.

## Componentes

- **Botón principal**: fondo \`${c.primary}\`, texto \`${buttonInk}\`, 44px de alto mínimo, radio 6px. Uno por vista.
- **Botón secundario**: borde 1px \`${c.fg}\` al 20%, texto \`${c.fg}\`, fondo transparente.
- **Tarjeta**: fondo blanco o \`${c.bg}\`, borde 1px al 10%, radio 12px, título + una frase + acción.
- **Chip / etiqueta**: fondo \`${c.primary}\` al 12%, texto \`${c.fg}\`, mayúsculas 12px.
- **Enlace de WhatsApp**: siempre con el mensaje prellenado y el número del cliente, nunca el del estudio.

## Movimiento

- Sólo \`transform\` y \`opacity\`. Entradas 0,6–0,9s con \`cubic-bezier(0.16, 1, 0.3, 1)\`.
- Respetar \`prefers-reduced-motion\`. Nada que se mueva solo sin que el usuario haga algo.

## Voz y copy

${VOICE_RULES.map((r) => `- ${r}`).join("\n")}

## Sí / No

- Sí: fotos reales del negocio, una acción clara por pantalla, precios sólo si el cliente los dio.
- No: stock de gente sonriendo a cámara, degradados y brillos sin función, tarjetas idénticas en grilla uniforme, texto sobre foto sin contraste, cualquier frase que suene a IA.
`;
}

/** Escribe data/clients/<slug>.DESIGN.md desde el perfil ya guardado. */
export async function writeDesignMd(rootDir: string, slug: string): Promise<string> {
  const profilePath = path.join(rootDir, "data", "clients", `${slug}.json`);
  const profile = clientSchema.parse(JSON.parse(await readFile(profilePath, "utf8")));
  const outPath = path.join(rootDir, "data", "clients", `${slug}.DESIGN.md`);
  await writeFile(outPath, designMdFromProfile(profile), "utf8");
  return outPath;
}
