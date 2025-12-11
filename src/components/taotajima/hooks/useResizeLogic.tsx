import { useEffect, useRef } from "react";

export default function useResizeLogic() {
  const resizeObserver = useRef<any>(null);
  const resizeObserverCb = useRef<any[]>([]);
  useEffect(() => {
    resizeObserver.current = new ResizeObserver(() => {
      resizeObserverCb.current.forEach((cb: any) => cb());
    });
    resizeObserver.current.observe(document.body);
    return () => {
      resizeObserver.current.disconnect();
    };
  }, []);
  return { resizeObserver, resizeObserverCb };
}
