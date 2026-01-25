import { OrbitalLoader } from "@/components/orbital-loader";
import Taotajima from "@/components/taotajima";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectTaotajimaLoading,
  setTaotajimaLoading,
} from "@/store/loading/loading-slice";
import { selectTaojimaControlOpenStatus } from "@/store/taotajimaControl/taotajima-slice";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

export default function TaotajimaDialog() {
  const dispatch = useAppDispatch();
  const taojimaOpenStatus = useAppSelector(selectTaojimaControlOpenStatus);
  const taojimaLoading = useAppSelector(selectTaotajimaLoading);
  const taojimaContainer = useRef<any>(null);
  const [showTaojima, setShowTaojima] = useState(false);
  const { contextSafe: taojima } = useGSAP(
    () => {
      const tm = gsap.timeline();
      if (taojimaOpenStatus) {
        dispatch(setTaotajimaLoading({ taotajimaLoading: true }));
        tm.to(taojimaContainer.current, {
          x: 0,
          duration: 0.5,
          ease: "linear",
        });
        tm.fromTo(
          taojimaContainer.current,
          {
            borderTopLeftRadius: "20vmin",
            borderBottomLeftRadius: "20vmin",
          },
          {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            duration: 0.5,
            ease: "linear",
          }
        );
        tm.play().then(() => {
          setShowTaojima(true);
        });
      } else {
        tm.to(
          taojimaContainer.current,
          {
            x: "100%",
            duration: 0.5,
            ease: "linear",
          },
          0
        ).then(() => {
          setShowTaojima(false);
        });
        tm.fromTo(
          taojimaContainer.current,
          {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
          {
            borderTopLeftRadius: "20vmin",
            borderBottomLeftRadius: "20vmin",
            duration: 0.1,
            ease: "linear",
          },
          0
        );
      }
    },
    {
      scope: taojimaContainer,
      dependencies: [taojimaOpenStatus],
    }
  );
  return (
    <div
      className="fixed inset-0 w-[100dvw] h-[100dvh] translate-x-1/1 z-140 overflow-hidden"
      ref={taojimaContainer}
    >
      {taojimaLoading && (
        <div className="inset-0 top-0 z-[var(--maxZIndex)] w-[100dvw] h-[100dvh] [--foreground:white] bg-black flex justify-center items-center">
          <OrbitalLoader />
        </div>
      )}
      {showTaojima && <Taotajima></Taotajima>}
    </div>
  );
}
