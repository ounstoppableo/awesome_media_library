import gsap from "gsap";
import { ScrollSmoother, ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import { useAppSelector } from "@/store/hooks";
import { selectTaojimaControlOpenStatus } from "@/store/taotajimaControl/taotajima-slice";
import { selectSienaControlOpenStatus } from "@/store/sienaControl/sinaControl-slice";
import { selectGlobalLoading } from "@/store/loading/loading-slice";
import { selectMediaLibraryOpenStatus } from "@/store/mediaLibraryControl/mediaLibrary-slice";
import { selectAssetsManageOpenStatus } from "@/store/assetsManageControl/assetsManage-slice";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
export default function useSmoothScrollerLogic() {
  const smoothWrapper = useRef<HTMLDivElement>(null);
  const smoothContent = useRef<HTMLDivElement>(null);
  const loading = useAppSelector(selectGlobalLoading);
  const sienaOpenStatus = useAppSelector(selectSienaControlOpenStatus);
  const taotajimaOpenStatus = useAppSelector(selectTaojimaControlOpenStatus);
  const mediaLibraryOpenStatus = useAppSelector(selectMediaLibraryOpenStatus);
  const assetsManageOpenStatus = useAppSelector(selectAssetsManageOpenStatus);
  const _scrollCbs = useRef<((params?: any) => any)[]>([]);
  const addScrollCb = (cb: (params?: any) => any) => {
    _scrollCbs.current.push(cb);
  };
  const removeScrollCb = (cb: (params?: any) => any) => {
    _scrollCbs.current = _scrollCbs.current.filter((_cb) => _cb !== cb);
  };
  const mobileInit = useRef(false);
  useEffect(() => {
    if (
      !(
        sienaOpenStatus ||
        taotajimaOpenStatus ||
        loading ||
        assetsManageOpenStatus ||
        mediaLibraryOpenStatus
      )
    ) {
      (window as any).scrollSmoother = ScrollSmoother.create({
        wrapper: smoothWrapper.current,
        content: smoothContent.current,
        smooth: 1,
        effects: true,
        normalizeScroll: true,
        onUpdate: () => {
          _scrollCbs.current.forEach((cb: any) => cb?.());
        },
      });

      if ((window as any).scrollSmoother && innerWidth / innerHeight < 1.2) {
        (window as any).scrollSmoother.refresh();
        mobileInit.current = true;
      }
    }

    return () => {
      ScrollSmoother.get()?.kill();
      (window as any).scrollSmoother = null;
    };
  }, [
    sienaOpenStatus,
    taotajimaOpenStatus,
    loading,
    assetsManageOpenStatus,
    mediaLibraryOpenStatus,
  ]);
  return { smoothWrapper, smoothContent, addScrollCb, removeScrollCb };
}
