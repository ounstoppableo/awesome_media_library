import { message } from "antd";
import { bufferToObject, objectToBuffer } from "./objAndBufferTransform";
import { WsRequestMsgType, WsResponseMsgType } from "@/wsConstructor";

export const wsSend = (
  socket: WebSocket,
  msg: Omit<WsRequestMsgType<any>, "token">
) => {
  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }
  socket.send(objectToBuffer({ ...msg, token: localStorage.getItem("token") }));
};

let _listener: any = null;
let _cbs: any[] = [];
let _errCbs: any[] = [];

export const wsListen = (
  socket: WebSocket,
  cb: (data: WsResponseMsgType<any>) => any,
  errCb: (params: WsResponseMsgType<any>) => any
) => {
  const clearListner = () => {
    socket.removeEventListener("message", _listener);
    _listener = null;
    _errCbs = [];
  };
  _errCbs.push(errCb);
  _cbs.push(cb);
  if (_listener) {
    return clearListner;
  }
  _listener = async (event: any) => {
    const data = event.data;
    try {
      const _data: WsResponseMsgType<any> = bufferToObject(
        new Uint8Array(await data.arrayBuffer()) as any
      ) as WsResponseMsgType<any>;
      if (_data.type === "error") {
        message.error({
          content:
            (_data as WsResponseMsgType<"error">).data.msg || "服务端错误",
        });
        _errCbs.forEach((errCb) => errCb(_data));
      }
      _cbs.forEach((cb) => cb(_data));
    } catch (err) {
      _errCbs.forEach((errCb) => errCb());
      message.error({ content: "服务器返回值无法解析" });
    }
  };
  socket.addEventListener("message", _listener);
  return clearListner;
};
