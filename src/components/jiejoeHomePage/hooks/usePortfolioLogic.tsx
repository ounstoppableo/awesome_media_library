import { SplitText } from "gsap/all";
import { useEffect, useRef } from "react";

export default function usePortfolioLogic() {
  const portfolioRef = useRef<HTMLDivElement>(null);
  const ariseLineRef = useRef<HTMLDivElement>(null);
  const chineseIntroduceRef = useRef<HTMLDivElement>(null);
  const englishIntroduceRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tm = gsap.timeline({
      scrollTrigger: {
        trigger: chineseIntroduceRef.current,
        start: "top bottom",
        end: "bottom 40%",
        scrub: true,
      },
    });
    const tm2 = gsap.timeline({
      scrollTrigger: {
        trigger: chineseIntroduceRef.current,
        start: "top bottom",
        end: "bottom 40%",
        scrub: true,
      },
    });
    const split = SplitText.create(portfolioRef.current);
    split.chars.forEach((char) => {
      tm.fromTo(
        char,
        {
          y: "-100%",
          opacity: 0,
        },
        { y: 0, opacity: 1 },
        ">"
      );
    });

    tm2.fromTo(
      ariseLineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
      },
      0
    );
    tm2.fromTo(
      chineseIntroduceRef.current,
      { x: "-100%", opacity: 0 },
      {
        x: 0,
        opacity: 1,
      },
      0
    );
    tm2.fromTo(
      englishIntroduceRef.current,
      { x: "100%", opacity: 0 },
      {
        x: 0,
        opacity: 1,
      },
      0
    );
    return () => {
      tm.kill();
      tm2.kill();
      split.revert();
    };
  }, []);
  const portfolioJsx = (
    <>
      <div
        className="text-[16vmin] leading-[16vmin] font-extrabold text-white mb-[4vmin]"
        ref={portfolioRef}
      >
        {"portfolio".toUpperCase()}
      </div>
      <div className="text-white text-center mb-[3vmin] flex flex-col items-center justify-center gap-[1vmin]">
        <div className="text-[3vmin] leading-[3vmin]" ref={chineseIntroduceRef}>
          Unstoppable840的摄影作品集
        </div>
        <div className="text-[2vmin] leading-[2vmin]" ref={englishIntroduceRef}>
          Unstoppable840's photography works
        </div>
      </div>
      <div
        className="h-1/3 w-[2px] absolute bottom-0 bg-linear-to-b from-[var(--themeColor)] to-transparent"
        ref={ariseLineRef}
      ></div>
    </>
  );
  return { portfolioJsx };
}
