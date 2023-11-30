const http = require("node:http");

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const paramMap = {};
    url.searchParams.forEach((value, name) => paramMap[name] = value);

    const info = {
        method: req.method,
        url: req.url,
        path: url.pathname,
        params: paramMap,
        headers: req.headers
    };

    const s = JSON.stringify(info);
    console.log(s);
    res.end(s);
});

server.listen(3640);
