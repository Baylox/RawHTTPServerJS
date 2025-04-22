const fs = require("fs");
const path = require("path");

module.exports = (requestPath, baseDir, body) => {
    const filename = requestPath.slice("/files/".length);
    const fullPath = path.join(baseDir, filename);

    fs.writeFileSync(fullPath, body);

    return {
        status: "201 Created",
        headers: {
            "Content-Type": "text/plain",
            "Content-Length": 0
        },
        body: ""
    };
};
