import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function useBrightBallLogic() {
  const originalMousePos = { x: 0, y: 0 };
  const tm = useRef<any>(gsap.timeline());
  const container = useRef<any>(null);
  const throttle = useRef<any>(null);
  useEffect(() => {
    tm.current.fromTo(
      container.current,
      { rotate: -30 },
      {
        rotate: 5,
        duration: 2,
        repeatDelay: 1,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      }
    );
    tm.current.play();
    return () => {
      tm.current.kill();
    };
  }, []);
  const brightBallJsx = (
    <div className="w-full h-full" ref={container}>
      <div
        className="h-[100vmin] aspect-square rounded-full blur-3xl absolute left-0 top-0 -translate-1/4"
        style={{
          background: "radial-gradient(var(--themeColor), transparent)",
        }}
      ></div>
      <div
        className="h-[100vmin] aspect-square rounded-full blur-3xl absolute right-0 bottom-0 translate-1/4"
        style={{
          background: "radial-gradient(var(--themeColor), transparent)",
        }}
      ></div>
    </div>
  );
  return { brightBallJsx };
}
