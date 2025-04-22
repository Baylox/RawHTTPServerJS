const net = require("net");

const server = net.createServer((socket) => {
    socket.once("data", (data) => {
      const request = data.toString();
      console.log("Requête reçue :");
      console.log(request);
  
      // Extraire la première ligne de la requête
      const [requestLine] = request.split("\r\n");
      const parts = requestLine.split(" ");
      const method = parts[0];
      const path = parts[1];
  
      if (method === "GET" && path === "/") {
        // Réponse pour la racine "/"
        socket.write("HTTP/1.1 200 OK\r\n\r\n");
      } else {
        // Réponse pour tout autre chemin
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      }
  
      socket.end();
    });
  });
  
  server.listen(4221, () => {
    console.log("Serveur lancé sur http://localhost:4221");
  });
