import { codeMap } from "@/utils/backendStatus";
import { wsListen } from "@/utils/clientWsMethod";
import { WsResponseMsgType } from "@/wsConstructor";
import { App } from "antd";
import { useEffect, useRef } from "react";

export default function useWebsocketLogic() {
  const socketRef = useRef<WebSocket | null>(null);
  const { message } = App.useApp();
  useEffect(() => {
    // 连接 WebSocket 服务
    socketRef.current = new WebSocket(`ws://${location.hostname}:10000`);

    socketRef.current.onopen = () => {};
    const clear = wsListen(
      socketRef.current,
      () => {},
      (res: WsResponseMsgType<any>) => {
        if (res.type === "error") {
          (res as WsResponseMsgType<"error">).data.code ===
          codeMap.limitsOfAuthority
            ? message.warning((res as WsResponseMsgType<"error">).data.msg)
            : message.error((res as WsResponseMsgType<"error">).data.msg);
        }
      }
    );
    socketRef.current.onclose = () => {};

    return () => {
      clear();
      socketRef.current?.close();
    };
  }, []);
  return { socketRef };
}
