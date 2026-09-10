// Abre una pantalla de app.onia.com.bo con sesion real y la fotografia.
// La sesion se toma con un magic link de la Admin API: no cambia ninguna credencial.
const { chromium } = require("/root/node_modules/playwright");
const { execSync } = require("child_process");

const BASE = "https://app.onia.com.bo";
const email = process.argv[2];
const target = process.argv[3] || "/dashboard";
const shot = process.argv[4] || "/root/shot.png";

// fetch nativo en vez de curl: sin shell de por medio, no hay quoting que romper
// (curl ya se comio dos intentos por eso) y la clave no aparece en ninguna linea
// de comando ni en el mensaje de error si algo falla.
async function magicLink(email) {
  const srk = execSync("docker exec onia-platform printenv SUPABASE_SERVICE_ROLE_KEY")
    .toString()
    .trim();
  const res = await fetch(BASE + "/supabase/auth/v1/admin/generate_link", {
    method: "POST",
    headers: {
      apikey: srk,
      Authorization: "Bearer " + srk,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "magiclink", email }),
  });
  const out = await res.text();
  if (!res.ok) throw new Error("generate_link HTTP " + res.status + ": " + out.slice(0, 300));
  const { hashed_token: hashedToken } = JSON.parse(out);
  if (!hashedToken) throw new Error("sin hashed_token: " + out.slice(0, 300));
  // NO se usa `action_link`: ese va a /auth/v1/verify y termina en /auth/callback
  // con un `?code=` de PKCE, que solo canjea el navegador que tiene la cookie
  // `code_verifier`. Este navegador nunca la tuvo, asi que caia en /login con el
  // token ya quemado. /auth/confirm usa token_hash + verifyOtp y no depende de
  // ninguna cookie previa — es el mismo camino que la app arreglo para los mails.
  return (
    BASE +
    "/auth/confirm?token_hash=" +
    encodeURIComponent(hashedToken) +
    "&type=magiclink&next=" +
    encodeURIComponent(target)
  );
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  const errores = [];
  page.on("console", (m) => {
    if (m.type() === "error") errores.push(m.text().slice(0, 200));
  });

  await page.goto(await magicLink(email), { waitUntil: "networkidle", timeout: 60000 });
  await page.goto(BASE + target, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2500);

  await page.screenshot({ path: shot, fullPage: true });
  console.log("URL_FINAL=" + page.url());
  console.log("TITULO=" + (await page.title()));
  const txt = (await page.evaluate(() => document.body.innerText)).replace(/\n{2,}/g, "\n");
  console.log("---TEXTO---");
  console.log(txt.slice(0, 2500));
  if (errores.length) {
    console.log("---ERRORES CONSOLA---");
    console.log(errores.slice(0, 10).join("\n"));
  }
  await browser.close();
})().catch((e) => {
  console.error("FALLO: " + e.message);
  process.exit(1);
});
