const net = require("net");
const router = require("./router");

// Fonction pour analyser les en-têtes HTTP
function parseHeaders(headerLines) {
    const headers = {};
    for (const line of headerLines) {
        const [key, ...rest] = line.split(":");
        if (key && rest.length > 0) {
            headers[key.trim().toLowerCase()] = rest.join(":").trim();
        }
    }
    return headers;
}

// Fonction pour analyser une requête HTTP à partir d'un buffer
function parseRequest(buffer) {
    const requestString = buffer.toString();
    const headerEndIndex = requestString.indexOf("\r\n\r\n");
    if (headerEndIndex === -1) return null; // Pas encore de requête complète

    const rawHeaders = requestString.slice(0, headerEndIndex);
    const lines = rawHeaders.split("\r\n");
    const [requestLine, ...headerLines] = lines;
    if (!requestLine) return null;

    const [method, path] = requestLine.split(" ");
    const headers = parseHeaders(headerLines);
    const contentLength = parseInt(headers["content-length"] || "0", 10);

    const bodyStart = headerEndIndex + 4;
    const totalLength = bodyStart + contentLength;

    if (buffer.length < totalLength) return null; // Requête incomplète

    const body = buffer.slice(bodyStart, totalLength).toString();

    return {
        method,
        path,
        headers,
        body,
        totalLength
    };
}

// Fonction pour envoyer une réponse HTTP
function sendResponse(socket, { status, headers, body }, shouldClose) {
    if (shouldClose) {
        headers["Connection"] = "close"; // Forcer la fermeture de la connexion
    }

    const headerString = [
        `HTTP/1.1 ${status}`,
        ...Object.entries(headers).map(([k, v]) => `${k}: ${v}`),
        "",
        ""
    ].join("\r\n");

    socket.write(headerString);

    if (Buffer.isBuffer(body)) {
        socket.write(body);
    } else {
        socket.write(body.toString());
    }

    if (shouldClose) {
        socket.end(); // Fermer la connexion si nécessaire
    }
}

module.exports = {
    listen: (port, directory, callback) => {
        const server = net.createServer((socket) => {
            let buffer = Buffer.alloc(0);

            socket.on("data", (chunk) => {
                buffer = Buffer.concat([buffer, chunk]);

                while (true) {
                    const req = parseRequest(buffer);
                    if (!req) return; // Attendre plus de données si la requête est incomplète
                    
                    const res = router(req.method, req.path, req.headers, directory, req.body);
                    const shouldClose = req.headers["connection"]?.toLowerCase() === "close";
                    
                    sendResponse(socket, res, shouldClose);
                    
                    buffer = buffer.slice(req.totalLength); // Traiter les requêtes suivantes dans le buffer
                    if (buffer.length === 0 || shouldClose) return;
                }
            });
        });

        server.listen(port, callback); // Démarrer le serveur sur le port spécifié
    }
};