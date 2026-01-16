"use client";
import { message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import SienaStyle from "@/components/sienaStyle";
import Taotajima from "@/components/taotajima";
import JiejoeHomePage from "@/components/jiejoeHomePage";
import UniqueLoading from "@/components/morph-loading";
import { OrbitalLoader } from "@/components/orbital-loader";
import {
  selectGlobalLoading,
  selectSienaLoading,
  selectTaotajimaLoading,
  setSienaLoading,
  setTaotajimaLoading,
} from "@/store/loading/loading-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { MenuToggleIcon } from "@/components/menu-toggle-icon";
import {
  selectSienaControlOpenStatus,
  setOpen,
} from "@/store/sienaControl/sinaControl-slice";
import { useGSAP } from "@gsap/react";
import { selectTaojimaControlOpenStatus } from "@/store/taotajimaControl/taotajima-slice";

export default function Home() {
  const router = useRouter();
  const loading = useAppSelector(selectGlobalLoading);

  const dispatch = useAppDispatch();
  const buttonRef = useRef<any>(null);
  const tw = useRef<any>(null);

  const { contextSafe } = useGSAP(
    () => {
      tw.current = gsap.timeline({ paused: true });
      tw.current.to(
        "button",
        {
          background: "white",
        },
        0
      );
      tw.current.to("svg", { stroke: "black" }, 0);
    },
    { scope: buttonRef }
  );

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
  const handleMouseEnter = contextSafe(() => {
    tw.current.play();
  });
  const handleMouseLeave = contextSafe(() => {
    tw.current.reverse();
  });

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
    <>
      {loading && (
        <div className="inset-0 top-0 z-[99999] w-[100dvw] h-[100dvh] [--foreground:white] bg-black flex justify-center items-center">
          <OrbitalLoader />
        </div>
      )}
      <button
        ref={buttonRef}
        onClick={() => {
          dispatch(setOpen({ open: !sienaOpenStatus }));
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="absolute focus:outline-none top-[6vmin] right-[8vmin] z-120 w-8 h-8 bg-transparent rounded-full flex justify-center items-center cursor-pointer"
      >
        <MenuToggleIcon
          open={sienaOpenStatus}
          className="size-6"
          duration={500}
          stroke={"white"}
        />
      </button>
      <div
        className="fixed inset-0 translate-y-1/1 z-100 overflow-hidden"
        ref={sienaContainer}
      >
        {sienaLoading && (
          <div className="inset-0 top-0 z-[99999] w-[100dvw] h-[100dvh] [--foreground:white] bg-black flex justify-center items-center">
            <OrbitalLoader />
          </div>
        )}
        {showSiena && <SienaStyle></SienaStyle>}
      </div>
      <div
        className="fixed inset-0 translate-x-1/1 z-140 overflow-hidden"
        ref={taojimaContainer}
      >
        {taojimaLoading && (
          <div className="inset-0 top-0 z-[99999] w-[100dvw] h-[100dvh] [--foreground:white] bg-black flex justify-center items-center">
            <OrbitalLoader />
          </div>
        )}
        {showTaojima && <Taotajima></Taotajima>}
      </div>
      {<JiejoeHomePage></JiejoeHomePage>}
    </>
  );
}
