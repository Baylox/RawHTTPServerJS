const zlib = require("zlib");

module.exports = (path, headers) => {
  const rawContent = path.slice("/echo/".length);
  const acceptEncoding = headers["accept-encoding"] || "";

  const shouldGzip = acceptEncoding.includes("gzip");

  let responseBody;
  let responseHeaders = {
    "Content-Type": "text/plain"
  };

  if (shouldGzip) {
    // Compression réelle
    const compressed = zlib.gzipSync(rawContent); // retourne un Buffer
    responseBody = compressed;
    responseHeaders["Content-Encoding"] = "gzip";
    responseHeaders["Content-Length"] = compressed.length;
  } else {
    // Pas de compression
    responseBody = rawContent;
    responseHeaders["Content-Length"] = Buffer.byteLength(rawContent);
  }

  return {
    status: "200 OK",
    headers: responseHeaders,
    body: responseBody
  };
};