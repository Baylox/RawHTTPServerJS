// Appel des modules nécessaires pour les handlers
const rootHandler = require("./handlers/root");
const echoHandler = require("./handlers/echo");
const userAgentHandler = require("./handlers/userAgent");
const notFoundHandler = require("./handlers/notFound");

module.exports = function router(method, path, headers) {
  if (method === "GET" && path === "/") {
    return rootHandler();
  }

  if (method === "GET" && path.startsWith("/echo/")) {
    return echoHandler(path);
  }

  if (method === "GET" && path === "/user-agent") {
    return userAgentHandler(headers);
  }

  return notFoundHandler();
};