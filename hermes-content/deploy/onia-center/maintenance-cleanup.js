// Call the ONIA Center maintenance endpoint from INSIDE the container, so the
// internal API key is read from the container env and never leaves the VPS.
//
// Usage (on the VPS):
//   docker exec -i onia-center node - < maintenance-cleanup.js            # dry-run (count)
//   docker exec -e MCHECK_COMMIT=true -i onia-center node - < maintenance-cleanup.js   # delete
const http = require("http");

const commit = process.env.MCHECK_COMMIT === "true";
const key = process.env.ONIA_CENTER_INTERNAL_API_KEY || process.env.ONIA_DAILY_BRIEFING_API_KEY || "";
const data = JSON.stringify({ action: "cleanup_generated_tasks", commit });

const req = http.request(
  "http://127.0.0.1:3012/api/onia-center/maintenance",
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
      console.log("HTTP", res.statusCode, commit ? "(COMMIT)" : "(dry-run)");
      console.log(body);
    });
  },
);
req.on("error", (e) => {
  console.error("ERR", e.message);
  process.exit(1);
});
req.write(data);
req.end();
