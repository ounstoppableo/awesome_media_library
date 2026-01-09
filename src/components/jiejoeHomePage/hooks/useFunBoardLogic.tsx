import { animate, svg } from "animejs";
import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../assets/funBoardMove";

export default function useFunBoardLogic() {
  const funBoardRef = useRef<any>(null);
  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: funBoardRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
    });

    return () => anim.destroy();
  }, []);
  const funBoardJsx = <div ref={funBoardRef} className="w-full h-full"></div>;
  return { funBoardJsx };
}
