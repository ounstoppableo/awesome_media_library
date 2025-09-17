import WebSocket from "ws";
import operateRouter, {
  WsOperateRequestDataType,
  WsOperateResponseDataType,
} from "./router/operateRouter";

import uploadRouter, {
  WsUploadRequestDataType,
  WsUploadResponseDataType,
} from "./router/uploadRouter";
import log from "../logs/setting";
import { bufferToObject, objectToBuffer } from "../utils/objAndBufferTransform";

export type wsMessageTypes = "operate" | "upload" | "error";

export type WsRequestMsgType<T extends wsMessageTypes> = {
  type: T;
  data: T extends "operate"
    ? WsOperateRequestDataType
    : T extends "upload"
    ? WsUploadRequestDataType<any>
    : never;
};

export type WsResponseMsgType<T> = {
  type: wsMessageTypes;
  data: T extends "operate"
    ? WsOperateResponseDataType
    : T extends "upload"
    ? WsUploadResponseDataType<any>
    : T extends "error"
    ? {
        msg: string;
        code: number;
      }
    : never;
};

export default async function wsConstructor(ws: WebSocket) {
  ws.on("message", async (message: Buffer, isBinary) => {
    if (isBinary) {
      try {
        const _message = bufferToObject(
          message
        ) as WsRequestMsgType<wsMessageTypes>;

        try {
          if (_message.type === "operate") {
            await operateRouter(
              ws,
              (_message as WsRequestMsgType<"operate">).data
            );
          } else if (_message.type === "upload") {
            await uploadRouter(
              ws,
              (_message as WsRequestMsgType<"upload">).data
            );
          }
        } catch (e: any) {
          log(e.message, "error");
          clientError(ws, "服务端错误");
        }
      } catch (e) {
        log("Can't parse the buffer data: " + message, "error");
        clientError(ws, "数据解析失败，请检查发送的数据格式");
      }
      return;
    } else {
      log("Message type must be Buffer!", "error");
      clientError(ws, "数据解析失败，请检查发送的数据格式");
    }
  });
  ws.on("error", (err) => {
    if (err.message.includes("Max payload size exceeded")) {
      log("客户端消息超出大小限制");
      // 给客户端返回错误
      if (ws.readyState === ws.OPEN) {
        clientError(ws, "负载过大");
      }
    } else {
      log(err.message, "error");
    }
  });
}

export function wsSend<T extends wsMessageTypes>(
  ws: WebSocket,
  res: WsResponseMsgType<T>
) {
  ws.send(objectToBuffer(res));
}

export enum codeMap {
  errorOperate = 1001,
  fileExceedLimit = 1010,
}

export function clientError(ws: WebSocket, msg: string, code: number = 1000) {
  const res: WsResponseMsgType<"error"> = {
    type: "error",
    data: { msg, code },
  };
  wsSend(ws, res);
}
