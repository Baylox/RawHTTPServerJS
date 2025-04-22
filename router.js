// Importation des handlers
const rootHandler = require("./handlers/root");
const echoHandler = require("./handlers/echo");
const userAgentHandler = require("./handlers/userAgent");
const fileGetHandler = require("./handlers/fileGet");
const filePostHandler = require("./handlers/filePost");
const notFoundHandler = require("./handlers/notFound");

module.exports = function router(method, path, headers, directory, body) {
  if (isRoot(method, path)) {
    return rootHandler();
  }

  if (isEcho(method, path)) {
    return echoHandler(path, headers);
  }

  if (isUserAgent(method, path)) {
    return userAgentHandler(headers);
  }

  if (isFileGet(method, path)) {
    return fileGetHandler(path, directory);
  }

  if (isFilePost(method, path)) {
    return filePostHandler(path, directory, body);
  }

  return notFoundHandler();
};

function isRoot(method, path) {
  return method === "GET" && path === "/";
}

function isEcho(method, path) {
  return method === "GET" && path.startsWith("/echo/");
}

function isUserAgent(method, path) {
  return method === "GET" && path === "/user-agent";
}

function isFileGet(method, path) {
  return method === "GET" && path.startsWith("/files/");
}

function isFilePost(method, path) {
  return method === "POST" && path.startsWith("/files/");
}