const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { URL } = require("node:url");

const root = process.cwd();
const port = Number(process.env.PORT || 3000);
const clients = new Set();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/babel; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".ts": "text/plain; charset=utf-8",
  ".tsx": "text/plain; charset=utf-8",
  ".webp": "image/webp"
};

const liveReloadScript = `
<script>
(() => {
  const source = new EventSource("/__live-reload");
  source.addEventListener("reload", () => window.location.reload());
  source.onerror = () => {
    const retry = setInterval(() => {
      fetch("/__live-reload-ping", { cache: "no-store" })
        .then(() => window.location.reload())
        .catch(() => {});
    }, 1000);
    window.addEventListener("beforeunload", () => clearInterval(retry), { once: true });
  };
})();
</script>`;

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function requestedPath(req) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const decoded = decodeURIComponent(url.pathname);
  const pathname = decoded === "/" ? "/index.html" : decoded;
  const filePath = path.resolve(root, `.${pathname}`);

  if (!filePath.startsWith(root)) {
    return null;
  }

  return filePath;
}

function injectLiveReload(html) {
  if (html.includes("/__live-reload")) {
    return html;
  }

  if (html.includes("</body>")) {
    return html.replace("</body>", `${liveReloadScript}\n</body>`);
  }

  return `${html}\n${liveReloadScript}`;
}

function broadcastReload(fileName) {
  for (const res of clients) {
    res.write(`event: reload\ndata: ${JSON.stringify({ fileName })}\n\n`);
  }
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/__live-reload-ping")) {
    send(res, 204, "");
    return;
  }

  if (req.url.startsWith("/__live-reload")) {
    res.writeHead(200, {
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "Content-Type": "text/event-stream"
    });
    res.write("retry: 1000\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }

  const filePath = requestedPath(req);
  if (!filePath) {
    send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extension] || "application/octet-stream";

    if (extension === ".html") {
      fs.readFile(filePath, "utf8", (readError, html) => {
        if (readError) {
          send(res, 500, "Unable to read file", { "Content-Type": "text/plain; charset=utf-8" });
          return;
        }

        send(res, 200, injectLiveReload(html), {
          "Cache-Control": "no-store",
          "Content-Type": contentType
        });
      });
      return;
    }

    res.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": contentType
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

let reloadTimer = null;
const watchedExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".jsx",
  ".json",
  ".ts",
  ".tsx"
]);

function handleFileChange(eventType, fileName) {
  if (!fileName || fileName.includes("node_modules")) {
    return;
  }

  const extension = path.extname(fileName).toLowerCase();
  if (!watchedExtensions.has(extension)) {
    return;
  }

  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    console.log(`Reloading after ${eventType}: ${fileName}`);
    broadcastReload(fileName);
  }, 120);
}

function watchDirectory(directory) {
  try {
    fs.watch(directory, { recursive: true }, handleFileChange);
  } catch (error) {
    console.warn(`Recursive watching is unavailable: ${error.message}`);
    fs.watch(directory, handleFileChange);
  }
}

watchDirectory(root);

server.listen(port, () => {
  console.log(`Live preview: http://localhost:${port}/`);
  console.log(`Phone preview: http://localhost:${port}/phone.html`);
  console.log("Edit HTML, CSS, JS, or JSX files and the browser will refresh.");
});
