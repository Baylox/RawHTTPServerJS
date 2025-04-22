const server = require("./server");

// Récupérer le dossier via --directory
const args = process.argv;
const dirIndex = args.indexOf("--directory");
const directory = dirIndex !== -1 ? args[dirIndex + 1] : null;

server.listen(4221, directory, () => {
    console.log("Serveur lancé sur http://localhost:4221");
    if (directory) {
        console.log("Dossier des fichiers :", directory);
    }
});
