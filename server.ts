import { WebSocketServer } from "ws";

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import log from "./src/logs/setting/index";

const port = parseInt(process.env.PORT || "9999", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(port);

  log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );
});

const wss = new WebSocketServer({ port: 10000 });
wss.on("connection", (ws: any) => {
  log("New client connected Websocket at port 10000!");
  ws.send("Welcome!");

  ws.on("message", (message: any) => {
    log(`Received: ${message.toString()}`);
    ws.send(`Echo: ${message}`);
  });
});
