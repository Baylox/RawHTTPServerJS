const fs = require("fs");
const path = require("path");

module.exports = (requestPath, baseDir) => {
    const filename = requestPath.slice("/files/".length);
    const fullPath = path.join(baseDir, filename);

    if (!fs.existsSync(fullPath)) {
        return {
            status: "404 Not Found",
            headers: {
                "Content-Type": "text/plain",
                "Content-Length": 0
            },
            body: ""
        };
    }

    const content = fs.readFileSync(fullPath);

    return {
        status: "200 OK",
        headers: {
            "Content-Type": "application/octet-stream",
            "Content-Length": content.length
        },
        body: content
    };
};