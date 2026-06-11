/* ============================================================
   THE CONSTRUCT — profile sync worker (Cloudflare Workers + KV).
   Stores one progress blob per profile code. No accounts, no PII —
   just: GET ?code=XXXX -> { save }   |   PUT ?code=XXXX { save }
   Deploy free in ~2 min — see README.md in this folder.
   ============================================================ */
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const code = (new URL(request.url).searchParams.get("code") || "").trim();
    if (code.length < 6 || code.length > 64) return json({ error: "missing or invalid code" }, 400);
    const key = "profile:" + code;

    if (request.method === "GET") {
      const val = await env.CONSTRUCT.get(key);
      if (!val) return json({ save: null }, 404);
      return new Response(val, { headers: { ...CORS, "Content-Type": "application/json" } });
    }
    if (request.method === "PUT" || request.method === "POST") {
      let body;
      try { body = await request.json(); } catch (e) { return json({ error: "bad json" }, 400); }
      if (!body || !body.save) return json({ error: "no save" }, 400);
      const payload = JSON.stringify({ save: body.save, updatedAt: Date.now() });
      if (payload.length > 512 * 1024) return json({ error: "payload too large" }, 413);
      await env.CONSTRUCT.put(key, payload);
      return json({ ok: true }, 200);
    }
    return json({ error: "method not allowed" }, 405);
  },
};
