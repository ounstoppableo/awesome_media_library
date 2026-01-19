import gsap from "gsap";
import { ScrollSmoother, ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import { useAppSelector } from "@/store/hooks";
import { selectTaojimaControlOpenStatus } from "@/store/taotajimaControl/taotajima-slice";
import { selectSienaControlOpenStatus } from "@/store/sienaControl/sinaControl-slice";
import { selectGlobalLoading } from "@/store/loading/loading-slice";
import { selectJiejoeControlCloseScrollStatus } from "@/store/jiejoeControl/jiejoeControl-slice";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
export default function useSmoothScrollerLogic() {
  const smoothWrapper = useRef<HTMLDivElement>(null);
  const smoothContent = useRef<HTMLDivElement>(null);
  const loading = useAppSelector(selectGlobalLoading);
  const sienaOpenStatus = useAppSelector(selectSienaControlOpenStatus);
  const taotajimaOpenStatus = useAppSelector(selectTaojimaControlOpenStatus);
  const jiejoeControlCloseScrollStatus = useAppSelector(
    selectJiejoeControlCloseScrollStatus
  );
  useEffect(() => {
    if (
      !sienaOpenStatus &&
      !taotajimaOpenStatus &&
      !loading &&
      !jiejoeControlCloseScrollStatus
    ) {
      ScrollSmoother.create({
        wrapper: smoothWrapper.current,
        content: smoothContent.current,
        smooth: 1,
        effects: true,
        normalizeScroll: true,
      });
    }

    return () => {
      ScrollSmoother.get()?.kill();
    };
  }, [
    sienaOpenStatus,
    taotajimaOpenStatus,
    loading,
    jiejoeControlCloseScrollStatus,
  ]);
  return { smoothWrapper, smoothContent };
}
