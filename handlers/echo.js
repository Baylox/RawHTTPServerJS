module.exports = (path) => {
    const echoStr = path.slice("/echo/".length);
    const length = Buffer.byteLength(echoStr);

    return {
        status: "200 OK",
        headers: {
            "Content-Type": "text/plain",
            "Content-Length": length
        },
        body: echoStr
    };
};