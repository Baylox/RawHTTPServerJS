# RawHTTPServerJS

Un serveur HTTP codé entièrement à la main en Node.js, sans framework ni bibliothèque externe.  
Ce projet implémente toutes les fonctionnalités fondamentales d’un serveur HTTP 1.1 à bas niveau, uniquement avec les modules natifs de Node.js (`net`, `fs`, etc.).

Il permet de comprendre en profondeur :
- le fonctionnement du protocole HTTP
- la gestion des sockets
- les connexions persistantes
- les en-têtes et la structure des requêtes
- le routage manuel
- la compression Gzip


## Fonctionnalités

Support des requêtes **GET** et **POST**  
Routage simple :
- `/` : renvoie `200 OK`
- `/echo/{message}` : renvoie le message dans le body
- `/user-agent` : extrait l'en-tête `User-Agent`
- `/files/{filename}` :
  - `GET` : lit le fichier si présent
  - `POST` : écrit le fichier avec le contenu du body

Lecture/écriture du corps via `Content-Length`  
Support de `Accept-Encoding: gzip` (avec compression réelle via `zlib`)  
Connexions persistantes (`keep-alive`)  
Fermeture explicite via `Connection: close`  
Gestion manuelle de `Content-Type`, `Content-Length`, `Content-Encoding`, etc.



## Lancement

```bash
node main.js --directory ./mon_dossier_de_fichiers
```

Le serveur écoute ensuite sur le port 4221 (modifiable dans server.js si besoin).
### Exemple de commandes possibles 

```bash
# Simple GET
curl http://localhost:4221/
```
```bash
# Echo
curl http://localhost:4221/echo/hello
```
```bash
# User-Agent
curl -H "User-Agent: test/1.0" http://localhost:4221/user-agent
```
```bash
# POST vers un fichier
curl -X POST --data "Hello World" http://localhost:4221/files/monfichier.txt
```
```bash
# GET du fichier
curl http://localhost:4221/files/monfichier.txt
```
```bash
# Compression Gzip
curl -H "Accept-Encoding: gzip" http://localhost:4221/echo/abc --output -
```

## Explorations associées

**[ShellJS – un shell UNIX en JavaScript](https://github.com/Baylox/ShellJS)** 

Ce projet simule un shell avec des commandes comme echo, cd, exit, des redirections (>, <) et même de l’autocomplétion, entièrement en JS natif.