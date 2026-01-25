import { OrbitalLoader } from "@/components/orbital-loader";
import SienaStyle from "@/components/sienaStyle";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectSienaLoading,
  setSienaLoading,
} from "@/store/loading/loading-slice";
import { selectSienaControlOpenStatus } from "@/store/sienaControl/sinaControl-slice";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

export default function SienaDialog() {
  const dispatch = useAppDispatch();
  const sienaOpenStatus = useAppSelector(selectSienaControlOpenStatus);
  const sienaContainer = useRef<any>(null);
  const [showSiena, setShowSiena] = useState(false);
  const sienaLoading = useAppSelector(selectSienaLoading);
  const { contextSafe: siena } = useGSAP(
    () => {
      const tm = gsap.timeline();
      if (sienaOpenStatus) {
        dispatch(setSienaLoading({ sienaLoading: true }));
        tm.to(sienaContainer.current, {
          y: 0,
          duration: 0.5,
          ease: "linear",
        });
        tm.fromTo(
          sienaContainer.current,
          {
            borderTopLeftRadius: "20vmin",
            borderTopRightRadius: "20vmin",
          },
          {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            duration: 0.5,
            ease: "linear",
          }
        );
        tm.play().then(() => {
          setShowSiena(true);
        });
      } else {
        tm.to(
          sienaContainer.current,
          {
            y: "100%",
            duration: 0.5,
            ease: "linear",
          },
          0
        ).then(() => {
          setShowSiena(false);
        });
        tm.fromTo(
          sienaContainer.current,
          {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },
          {
            borderTopLeftRadius: "20vmin",
            borderTopRightRadius: "20vmin",
            duration: 0.1,
            ease: "linear",
          },
          0
        );
      }
    },
    {
      scope: sienaContainer,
      dependencies: [sienaOpenStatus],
    }
  );
  return (
    <div
      className="fixed inset-0 translate-y-1/1 z-100 overflow-hidden"
      ref={sienaContainer}
    >
      {sienaLoading && (
        <div className="inset-0 top-0 z-[var(--maxZIndex)] w-[100dvw] h-[100dvh] [--foreground:white] bg-black flex justify-center items-center">
          <OrbitalLoader />
        </div>
      )}
      {showSiena && <SienaStyle></SienaStyle>}
    </div>
  );
}
