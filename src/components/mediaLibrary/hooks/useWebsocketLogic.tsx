import { useEffect, useRef } from "react";

export default function useWebsocketLogic() {
  const socketRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    // 连接 WebSocket 服务
    socketRef.current = new WebSocket(`ws://${location.hostname}:10000`);

    socketRef.current.onopen = () => {
      console.log("✅ WebSocket connected");
      socketRef.current?.send("Hello Server!");
    };

    socketRef.current.onmessage = (event) => {};

    socketRef.current.onclose = () => {
      console.log("❌ WebSocket closed");
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);
}
