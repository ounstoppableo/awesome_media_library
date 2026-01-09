import { useEffect, useRef } from "react";

export default function useResizeLogic() {
  const resizeObserver = useRef<any>(null);
  const resizeObserverCb = useRef<any[]>([]);
  const antiShake = useRef<any>(null);
  useEffect(() => {
    resizeObserver.current = new ResizeObserver(() => {
      if (antiShake.current) clearTimeout(antiShake.current);
      antiShake.current = setTimeout(() => {
        resizeObserverCb.current.forEach((cb: any) => cb());
      }, 500);
    });
    resizeObserver.current.observe(document.body);
    return () => {
      resizeObserver.current.disconnect();
    };
  }, []);
  return { resizeObserver, resizeObserverCb };
}
