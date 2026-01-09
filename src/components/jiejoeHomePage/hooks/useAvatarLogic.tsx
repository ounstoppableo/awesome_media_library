import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function useAvatarLogic(props: any) {
  const textCircle = useRef<SVGSVGElement>(null);
  const twine = useRef<gsap.core.Tween | null>(null);
  useEffect(() => {
    const cb = () => {
      twine.current?.kill();
      twine.current = gsap.fromTo(
        textCircle.current,
        {
          rotate: 0,
        },
        {
          rotate: 360,
          duration: 4,
          ease: "linear",
          repeat: -1,
        }
      );
    };
    cb();
    return () => {
      twine.current?.kill();
    };
  }, []);
  const avatarJsx = (
    <>
      <div className="w-full h-full relative text-shadow-none flex justify-center items-center">
        <img
          src="/avatar.png"
          className="w-1/2 h-1/2 absolute top-1/2 left-1/2 -translate-1/2 -rotate-45"
        ></img>
        <svg viewBox="0 0 300 300" ref={textCircle}>
          <defs>
            <path
              id="circlePath"
              d="
        M 150, 150
        m -100, 0
        a 100,100 0 1,1 200,0
        a 100,100 0 1,1 -200,0
      "
            />
          </defs>
          <text fontSize="32" stroke="var(--themeColor)">
            <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
              WELCOME to UNSTOPPABLE840 MEDIA LIB
            </textPath>
          </text>
        </svg>
      </div>
    </>
  );
  return { avatarJsx };
}
