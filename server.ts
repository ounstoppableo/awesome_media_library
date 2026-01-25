import WebSocket, { WebSocketServer } from "ws";
import wsConstructor from "./src/wsConstructor";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const wss = new WebSocketServer({
  port: 10000,
  maxPayload: 1024 * 1024 * 15,
});
wss.on("connection", (ws: WebSocket) => {
  wsConstructor(ws);
});
