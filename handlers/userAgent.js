module.exports = (headers) => {
    const userAgent = headers["user-agent"] || "";
    const length = Buffer.byteLength(userAgent);

    return {
        status: "200 OK",
        headers: {
            "Content-Type": "text/plain",
            "Content-Length": length
        },
        body: userAgent
    };
};