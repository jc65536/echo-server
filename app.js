import express from "express";
import fs from "node:fs";
import cors from "cors";

const app = express();
const port = 3640;
const logFile = "req.log";

app.use(cors({ origin: "*" }));
app.use(express.text({ type: () => true }));

app.get("/", (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const paramMap = {};
    url.searchParams.forEach((value, name) => paramMap[name] = value);

    const info = {
        method: req.method,
        url: req.url,
        path: url.pathname,
        params: paramMap,
        headers: req.headers,
        body: req.body,
    };

    console.log(JSON.stringify(info));

    res.send(info);
});

app.post("/log", (req, res) => {
    fs.appendFile(logFile, req.body, err => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send();
        }
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
