import express from "express";
import fs from "node:fs";
import cors from "cors";
import { Mutex } from "async-mutex";

const app = express();
const port = 3640;

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

const numLocks = 10;
const locks = Array(numLocks).fill(0).map(_ => new Mutex());

app.post("/log", async (req, res) => {
    const bucket = Math.floor(Math.random() * numLocks);
    const filename = `log-${bucket}`;

    const lock = locks[bucket];

    const entry = `${Date.now()} ${req.body}`;

    lock.acquire()
        .then(release => fs.appendFile(filename, entry, err => {
            release();
            if (err) {
                res.status(500).send(err);
            } else {
                res.send();
            }
        }));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
