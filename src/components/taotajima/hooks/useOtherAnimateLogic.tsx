import { RefObject, useEffect, useRef } from "react";
import { splitText, animate as animejsAnimate, stagger } from "animejs";

export default function useOtherAnimateLogic() {
  const leftBtnRef = useRef<HTMLDivElement>(null);
  const rightBtnRef = useRef<HTMLDivElement>(null);
  const animeObj = useRef<any>({});
  const animatePageToggleBtn = (
    container: RefObject<HTMLDivElement | null>,
    direction: "left" | "right",
    animate: "enter" | "leave"
  ) => {
    if (!container.current) return;
    const arrow = container.current.querySelector<SVGElement>(".arrow")!;
    const title = container.current.querySelector<HTMLDivElement>(".title")!;
    const pageCount =
      container.current.querySelector<HTMLDivElement>(".pageCount")!;

    if (direction === "left") {
      if (animate === "leave") {
      } else {
        gsap.fromTo(container.current, { opacity: 0 }, { opacity: 1 });
        gsap.fromTo(
          arrow,
          {
            scaleX: 0,
          },
          {
            scaleX: 1,
            duration: 0.3,
            ease: "linear",
          }
        );
      }
    } else {
      if (animate === "leave") {
      } else {
        gsap.fromTo(container.current, { opacity: 0 }, { opacity: 1 });
        gsap.fromTo(
          arrow,
          {
            scaleX: 0,
          },
          {
            scaleX: 1,
            duration: 0.3,
            ease: "linear",
          }
        );
      }
    }
    if (animate === "leave") {
      animeObj.current.titleChars?.revert?.();
      animeObj.current.pageCountChars?.revert?.();
    } else {
      title &&
        (animeObj.current.titleChars = splitText(title, {
          chars: { class: "page-btn-title-split-char" },
        }));
      pageCount &&
        (animeObj.current.pageCountChars = splitText(pageCount, {
          chars: { class: "page-btn-pageCount-split-char" },
        }));
      animejsAnimate(".page-btn-title-split-char", {
        y: ["0px", "-8px", "0px"],
        duration: 300,
        delay: stagger(30),
      });
      animejsAnimate(".page-btn-pageCount-split-char", {
        y: ["0px", "-8px", "0px"],
        duration: 300,
        delay: stagger(30),
      });
    }
  };

  const animateBtn = (btnRef: RefObject<any>) => {
    if (!btnRef.current) return;
    if (animeObj.current.btnTwine) return;
    animeObj.current.btnTwine = gsap
      .fromTo(
        btnRef.current,
        { scale: 0.5 },
        { scale: 1, ease: "power2.inOut", duration: 0.3 }
      )
      .then(() => {
        animeObj.current.btnTwine = null;
      });
  };

  const animateOpacity = useRef<any>({});
  const generateAnimateOpacity = (refs: any[]) => {
    animateOpacity.current = gsap.timeline();
    refs.forEach((ref) => {
      if (!ref.current) return;
      animateOpacity.current.fromTo(
        ref.current,
        0.3,
        { opacity: 0 },
        { opacity: 1 },
        0
      );
    });
  };
  const splitRef = useRef<any>(null);
  const shareRef = useRef<any>(null);
  const playRef = useRef<any>(null);
  useEffect(() => {
    generateAnimateOpacity([
      splitRef,
      shareRef,
      playRef,
      leftBtnRef,
      rightBtnRef,
    ]);
  }, []);

  return {
    animateOpacity,
    animatePageToggleBtn,
    animateBtn,
    splitRef,
    shareRef,
    playRef,
    leftBtnRef,
    rightBtnRef,
  };
}
