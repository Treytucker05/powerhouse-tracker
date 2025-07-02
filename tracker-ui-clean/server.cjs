const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;

const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url);
  if (req.url === "/" || req.url === "") {
    filePath = path.join(__dirname, "index.html");
  }
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(400);
    return res.end("Bad Request");
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 Not Found</h1>", "utf-8");
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, "utf-8");
      }
    } else {
      res.writeHead(200, { "Content-Type": mimeType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(port, () => {
  console.log(`\n🚀 PowerHouseATX RP Toolkit Server running at:`);
  console.log(`   http://localhost:${port}/`);
  console.log(`\n📝 Open this URL in your browser to use the application.`);
  console.log(`   Press Ctrl+C to stop the server.\n`);
});
