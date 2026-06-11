/* Local mock of the sync worker (same GET/PUT-by-code contract + CORS),
   used only to test the app's cloud-sync client end-to-end. */
const http = require("http");
const store = {};
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,PUT,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
function send(res, status, obj) { res.writeHead(status, { ...CORS, "Content-Type": "application/json" }); res.end(typeof obj === "string" ? obj : JSON.stringify(obj)); }

http.createServer((req, res) => {
  if (req.method === "OPTIONS") { res.writeHead(204, CORS); return res.end(); }
  const u = new URL(req.url, "http://localhost");
  const code = (u.searchParams.get("code") || "").trim();
  if (code.length < 6) return send(res, 400, { error: "bad code" });
  if (req.method === "GET") { return store[code] ? send(res, 200, store[code]) : send(res, 404, { save: null }); }
  if (req.method === "PUT" || req.method === "POST") {
    let body = ""; req.on("data", (c) => (body += c));
    req.on("end", () => { try { const j = JSON.parse(body); store[code] = JSON.stringify({ save: j.save, updatedAt: Date.now() }); send(res, 200, { ok: true }); } catch (e) { send(res, 400, { error: "bad json" }); } });
    return;
  }
  return send(res, 405, { error: "method not allowed" });
}).listen(8799, () => console.log("mock sync server on http://localhost:8799"));
