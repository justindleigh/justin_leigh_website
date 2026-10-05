/* Serves dist/ on the LAN exactly the way Vercel will: real file first, then
 * the /ai redirect, then index.html as the SPA fallback. Review only. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
const DIST = path.resolve("dist"), PORT = 4500;
const MIME = {".html":"text/html;charset=utf-8",".js":"text/javascript",".css":"text/css",
  ".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",
  ".webp":"image/webp",".ico":"image/x-icon",".json":"application/json",
  ".xml":"application/xml",".txt":"text/plain",".woff2":"font/woff2"};
createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/ai" || url === "/ai/") {           // the 301 from vercel.json
    res.writeHead(301, { Location: "/evergreen-legal-ai" }); return res.end();
  }
  let f = path.join(DIST, url);
  try { if ((await stat(f)).isDirectory()) f = path.join(f, "index.html"); }
  catch { f = path.join(DIST, "index.html"); }
  try {
    const b = await readFile(f);
    res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream",
                         "Cache-Control": "no-store" });
    res.end(b);
  } catch { res.writeHead(404).end("not found"); }
}).listen(PORT, "0.0.0.0", () => console.log("preview listening on 0.0.0.0:" + PORT));
