// Post-deploy verification of the daily briefing endpoint, from INSIDE the
// container (internal key never leaves the VPS). Dry-run only (commit:false) —
// does NOT create tasks.
//   docker exec -i onia-center node - < briefing-dryrun.js
const http = require("http");

const key = process.env.ONIA_CENTER_INTERNAL_API_KEY || process.env.ONIA_DAILY_BRIEFING_API_KEY || "";
const data = JSON.stringify({
  audiences: ["sergio", "arthur", "seller"],
  commit: false,
  source: "post-deploy-verify",
});

const req = http.request(
  "http://127.0.0.1:3012/api/onia-center/briefings/daily",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + key,
      "Content-Length": Buffer.byteLength(data),
    },
  },
  (res) => {
    let body = "";
    res.on("data", (c) => (body += c));
    res.on("end", () => {
      console.log("HTTP", res.statusCode);
      // print only the envelope fields, not the full payload
      try {
        const j = JSON.parse(body);
        console.log(JSON.stringify({ ok: j.ok, mode: j.mode, message: j.message }));
      } catch {
        console.log(body.slice(0, 400));
      }
    });
  },
);
req.on("error", (e) => {
  console.error("ERR", e.message);
  process.exit(1);
});
req.write(data);
req.end();
