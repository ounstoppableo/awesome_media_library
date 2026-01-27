import AnoAI from "@/components/ui/shader-background";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useEffect, useRef } from "react";

export default function usePortfolioLogic(props: any) {
  const { hiddenStarBackground } = props;
  const portfolioRef = useRef<HTMLDivElement>(null);
  const ariseLineRef = useRef<HTMLDivElement>(null);
  const chineseIntroduceRef = useRef<HTMLDivElement>(null);
  const englishIntroduceRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<any>(null);
  useEffect(() => {
    const _twines: any = [];
    const tm = gsap.timeline({
      scrollTrigger: {
        trigger: chineseIntroduceRef.current,
        start: "top bottom",
        end: "bottom 60%",
        scrub: true,
      },
    });
    _twines.push(tm);
    const tm2 = gsap.timeline({
      scrollTrigger: {
        trigger: chineseIntroduceRef.current,
        start: "top bottom",
        end: "bottom 40%",
        scrub: true,
      },
    });
    _twines.push(tm2);
    splitRef.current?.revert();
    splitRef.current = SplitText.create(portfolioRef.current);
    splitRef.current.chars.forEach((char: any) => {
      _twines.push(
        gsap.set(char, {
          y: "-100%",
          opacity: 0,
        })
      );
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

    _twines.push(gsap.set(ariseLineRef.current, { scaleY: 0 }));
    tm2.fromTo(
      ariseLineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
      },
      0
    );
    _twines.push(
      gsap.set(chineseIntroduceRef.current, { x: "-100%", opacity: 0 })
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
    _twines.push(
      gsap.set(englishIntroduceRef.current, { x: "100%", opacity: 0 })
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
      _twines.forEach((tw: any) => tw?.kill?.());
      splitRef.current?.revert();
    };
  }, []);
  const portfolioJsx = (
    <>
      <div
        className="text-[16vmin] leading-[16vmin] font-extrabold text-white mb-[4vmin] z-1"
        ref={portfolioRef}
      >
        {"portfolio".toUpperCase()}
      </div>
      <div className="text-white text-center mb-[3vmin] flex flex-col items-center justify-center gap-[1vmin] z-1">
        <div className="text-[3vmin] leading-[3vmin]" ref={chineseIntroduceRef}>
          Unstoppable840的摄影作品集
        </div>
        <div className="text-[2vmin] leading-[2vmin]" ref={englishIntroduceRef}>
          Unstoppable840's photography works
        </div>
      </div>
      <div
        className="h-1/3 w-[2px] absolute bottom-0 bg-linear-to-b from-[var(--themeColor)] to-transparent z-1"
        ref={ariseLineRef}
      ></div>
      {!hiddenStarBackground && <AnoAI></AnoAI>}
    </>
  );
  return { portfolioJsx };
}
