const net = require("net");

const server = net.createServer((socket) => {
  socket.once("data", (data) => {
    const request = data.toString();
    const [requestLine] = request.split("\r\n");

    const parts = requestLine.split(" ");
    const method = parts[0];
    const path = parts[1];

    console.log("requestLine", requestLine);
    
    if (method === "GET") {
      //  chemin exact "/"
      if (path === "/") {
        socket.write("HTTP/1.1 200 OK\r\n\r\n");

      // Chemin commence par "/echo/"
      } else if (path.startsWith("/echo/")) {
        const echoStr = path.slice("/echo/".length);
        const contentLength = Buffer.byteLength(echoStr); // nombre d’octets

        const response =
          `HTTP/1.1 200 OK\r\n` +
          `Content-Type: text/plain\r\n` +
          `Content-Length: ${contentLength}\r\n` +
          `\r\n` +
          `${echoStr}`;

        socket.write(response);

      // toute autre route → 404
      } else {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      }
    }

    socket.end();
  });
});

server.listen(4221, () => {
  console.log("Serveur lancé sur http://localhost:4221");
});
