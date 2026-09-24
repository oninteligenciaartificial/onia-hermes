import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { codigoTotp, segundosHastaLaProximaVentana } from "./totp.mjs";

const SESION = fileURLToPath(new URL("./sesion_dueno.mjs", import.meta.url));

// Clave de los vectores oficiales del RFC 6238 (apéndice B): el ASCII
// "12345678901234567890" escrito en base32, que es como lo guarda GoTrue.
const CLAVE_RFC = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";

test("RFC 6238 — los seis vectores oficiales, SHA-1, 6 dígitos", () => {
  // Éste es el único test que prueba que el código que mandamos es el que el
  // servidor espera. Sin vectores externos, una implementación que se equivoca
  // igual en generar y en verificar se prueba sola a sí misma y sale verde.
  const vectores = [
    [59, "287082"],
    [1111111109, "081804"],
    [1111111111, "050471"],
    [1234567890, "005924"],
    [2000000000, "279037"],
    [20000000000, "353130"],
  ];
  for (const [enSegundos, esperado] of vectores) {
    assert.equal(codigoTotp(CLAVE_RFC, { enSegundos }), esperado, `T=${enSegundos}`);
  }
});

test("el código siempre trae 6 dígitos, también cuando el número empieza en cero", () => {
  // Un `String(n)` sin relleno devuelve "5924" para el vector T=1234567890 y
  // GoTrue lo rechaza con "Invalid TOTP code" — que se lee como "el secreto está
  // mal", que es la conclusión equivocada.
  for (const enSegundos of [59, 1111111109, 1234567890, 2000000000, 20000000000]) {
    assert.match(codigoTotp(CLAVE_RFC, { enSegundos }), /^\d{6}$/);
  }
});

test("un secreto que NO es base32 se rechaza nombrando el motivo, no devuelve un código cualquiera", () => {
  // Si alguna vez se enciende GOTRUE_DB_ENCRYPTION_KEY, `auth.mfa_factors.secret`
  // deja de ser base32 y pasa a ser un JSON cifrado. Sin esta guarda el
  // instrumento mandaría un código inventado y el fallo se leería como
  // "el 2FA rechaza al instrumento" en vez de "el secreto ahora viene cifrado".
  assert.throws(
    () => codigoTotp('{"key_id":"x","data":"AAAA"}'),
    /base32/i,
    "un secreto cifrado tiene que fallar fuerte"
  );
  assert.throws(() => codigoTotp(""), /base32/i);
});

test("segundosHastaLaProximaVentana nunca devuelve 0 ni más que el período", () => {
  // GoTrue NO acepta dos veces el mismo código: correr el instrumento dos veces
  // dentro de los mismos 30 s falla el segundo. La espera es la salida, así que
  // tiene que ser siempre una espera real y acotada.
  for (const enSegundos of [0, 1, 29, 30, 31, 59, 1234567890]) {
    const s = segundosHastaLaProximaVentana({ enSegundos });
    assert.ok(s > 0 && s <= 30, `T=${enSegundos} devolvió ${s}`);
  }
});

test("el segundo factor está CABLEADO en el mint de sesión, no sólo disponible", () => {
  // El módulo puede estar perfecto y no llamarlo nadie: así nace un gate verde
  // sobre un instrumento ciego. Esto mira al LLAMADOR.
  const fuente = readFileSync(SESION, "utf8");
  assert.match(fuente, /from "\.\/totp\.mjs"/, "sesion_dueno.mjs tiene que importar totp.mjs");
  assert.match(fuente, /mfa\.challenge\(/, "tiene que pedir el desafío del segundo factor");
  assert.match(fuente, /mfa\.verify\(/, "tiene que verificar el segundo factor");
  assert.match(fuente, /mfa\.listFactors\(/, "tiene que preguntar los factores, no asumirlos");
});

test("el secreto NUNCA se imprime ni se guarda fuera de la base", () => {
  // La diferencia entre leer el secreto en vivo (mismo alcance que ya tiene el
  // instrumento: docker exec a supabase-db) y COPIARLO a un env o a un archivo
  // (un lugar más que proteger) es justo lo que hace que esto no degrade el 2FA.
  const fuente = readFileSync(SESION, "utf8");
  const lineasConSecreto = fuente
    .split("\n")
    .filter((l) => /\bsecreto\b/.test(l) && !l.trimStart().startsWith("*") && !l.trimStart().startsWith("//"));
  for (const linea of lineasConSecreto) {
    assert.doesNotMatch(linea, /console\.(log|error|warn)/, `el secreto no se imprime: ${linea.trim()}`);
    assert.doesNotMatch(linea, /writeFileSync|appendFileSync|process\.env\./, `el secreto no se copia: ${linea.trim()}`);
  }
});
