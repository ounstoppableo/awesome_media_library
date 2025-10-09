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
import useAuth from "@/hooks/useAuth";
import { codeMap } from "@/utils/backendStatus";

export type wsMessageTypes = "operate" | "upload" | "error";

export type WsRequestMsgType<T extends wsMessageTypes> = {
  type: T;
  data: T extends "operate"
    ? WsOperateRequestDataType<any>
    : T extends "upload"
    ? WsUploadRequestDataType<any>
    : never;
  token: string;
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
        [key: string]: any;
      }
    : never;
};

const tokenMapExpireTime: any = {};
export const tokenMapUsername: any = {};

export default async function wsConstructor(ws: WebSocket) {
  ws.on("message", async (message: Buffer, isBinary) => {
    if (isBinary) {
      try {
        const _message = bufferToObject(
          message
        ) as WsRequestMsgType<wsMessageTypes>;
        if (
          tokenMapExpireTime[_message.token] &&
          tokenMapExpireTime[_message.token] < +new Date()
        ) {
        } else {
          if (await useAuth(_message.token)) {
            const info = JSON.parse(
              Buffer.from(_message.token.split(".")[1], "base64").toString(
                "utf-8"
              )
            );
            tokenMapExpireTime[_message.token] = info.exp;
            tokenMapUsername[_message.token] = info.data;
          } else {
            delete tokenMapExpireTime[_message.token];
            delete tokenMapUsername[_message.token];
            clientError(ws, "权限不足", codeMap.limitsOfAuthority);
            ws.close();
            return;
          }
        }

        try {
          if (_message.type === "operate") {
            await operateRouter(ws, {
              ...(_message as WsRequestMsgType<"operate">).data,
              token: _message.token,
            });
          } else if (_message.type === "upload") {
            await uploadRouter(ws, {
              ...(_message as WsRequestMsgType<"upload">).data,
              token: _message.token,
            });
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
        ws.close();
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

export function clientError(
  ws: WebSocket,
  msg: string,
  code: number = codeMap.serverError,
  args?: any
) {
  const res: WsResponseMsgType<"error"> = {
    type: "error",
    data: { msg, code, ...args },
  };
  wsSend(ws, res);
}
