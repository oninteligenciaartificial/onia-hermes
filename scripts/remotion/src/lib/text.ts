// Split determinista de texto en palabras (conservando espacios) o en líneas
// (respetando \n del autor), para el revelado tipográfico de Quote.
export function splitWords(text: string): string[] {
  return text.split(/(\s+)/).filter((token) => token.length > 0);
}

export function splitLines(text: string): string[] {
  return text.split(/\n+/).filter((line) => line.trim().length > 0);
}
