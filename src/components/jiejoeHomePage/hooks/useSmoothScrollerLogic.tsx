import gsap from "gsap";
import { ScrollSmoother, ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
export default function useSmoothScrollerLogic() {
  const smoothWrapper = useRef<HTMLDivElement>(null);
  const smoothContent = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ScrollSmoother.create({
      wrapper: smoothWrapper.current,
      content: smoothContent.current,
      smooth: 1,
      effects: true,
      normalizeScroll: true,
    });
  });
  return { smoothWrapper, smoothContent };
}
