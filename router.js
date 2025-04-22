const net = require("net"); 
const router = require("./router");

// Fonction pour analyser les en-têtes HTTP à partir des lignes d'en-têtes
function parseHeaders(headerLines) {
    const headers = {};
    for (const line of headerLines) {
        // Sépare la ligne en clé et valeur en utilisant ":" comme séparateur
        const [key, ...rest] = line.split(":");
        if (key && rest.length > 0) {
            // Nettoie les espaces et convertit la clé en minuscule pour uniformité
            headers[key.trim().toLowerCase()] = rest.join(":").trim();
        }
    }
    return headers; // Retourne un objet contenant les en-têtes analysés
}

const server = net.createServer((socket) => { // Crée un serveur TCP
  socket.once("data", (data) => { 
    // Traite les données reçues une seule fois et les convertit en chaîne de caractères
    const request = data.toString(); 
    const lines = request.split("\r\n");
    const [requestLine, ...headerLines] = lines;

    // Par sécurité, on vérifie qu’on a bien une ligne de requête
    if (!requestLine) return;

    const [method, path] = requestLine.split(" ");

    const headers = parseHeaders(headerLines);

    const handler = router(method, path, headers);
    const { status, headers: resHeaders, body } = handler;

    // Construction de la réponse HTTP
    const responseLines = [
      `HTTP/1.1 ${status}`,
      ...Object.entries(resHeaders).map(([k, v]) => `${k}: ${v}`),
      "", // ligne vide pour séparer les headers du body
      body
    ];

    const response = responseLines.join("\r\n");
    socket.write(response);
    socket.end();
  });
});

module.exports = server;