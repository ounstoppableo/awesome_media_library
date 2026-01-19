"use client";
import { FiMousePointer } from "react-icons/fi";
import MouseImageTrail from "../mouseImageTrail";
import { RainbowCursor } from "../rainbow-cursor";
import { VoicePoweredOrb } from "../voice-powered-orb";
import useAvatarLogic from "./hooks/useAvatarLogic";
import useBrightBallLogic from "./hooks/useBrightBallLogic";
import useFireWorksLogic from "./hooks/useFireWorksLogic";
import useFunBoardLogic from "./hooks/useFunBoardLogic";
import useResizeLogic from "./hooks/useResizeLogic";
import { ImageSwiper } from "../image-swiper";
import { use, useEffect, useRef, useState } from "react";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import useListLogic from "./components/List";
import { BrandScroller, BrandScrollerReverse } from "../ui/brand-scoller";
import useFooterLogic from "./hooks/useFooterLogic";
import Title from "./components/Title";
import List from "./components/List";
import useMouseImageTrailLogis from "./hooks/useMouseImageTrailLogis";
import useSmoothScrollerLogic from "./hooks/useSmoothScrollerLogic";
import usePortfolioLogic from "./hooks/usePortfolioLogic";
import RandomContent from "./components/RandomContent";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectTaojimaControlOpenStatus,
  setOpen,
} from "@/store/taotajimaControl/taotajima-slice";
import ContentInsufficient from "../contentInsufficient";
import useAccessData from "./hooks/useAccessData";

export default function JiejoeHomePage() {
  const dispatch = useAppDispatch();
  const taojimaOpen = useAppSelector(selectTaojimaControlOpenStatus);
  const handleExplore = (info: any) => {
    dispatch(setOpen({ open: !taojimaOpen, id: info.id }));
  };

  const { resizeObserver, resizeObserverCb } = useResizeLogic();
  const { smoothWrapper, smoothContent } = useSmoothScrollerLogic();
  const { funBoardJsx } = useFunBoardLogic();
  const { brightBallJsx } = useBrightBallLogic();
  const { avatarJsx } = useAvatarLogic({ resizeObserverCb });
  const { fireworksJsx } = useFireWorksLogic();

  const { newestData, randomData } = useAccessData();
  const { footerJsx } = useFooterLogic();
  const { mouseImageTrailJsx, setCurrentIndex } = useMouseImageTrailLogis({
    data: randomData,
    resizeObserverCb,
  });
  const { portfolioJsx } = usePortfolioLogic();

  return (
    <div className="w-[100dvw] h-[100dvh]">
      <div ref={smoothWrapper}>
        <div ref={smoothContent}>
          <div className="flex flex-col w-[100dvw] h-fit bg-black select-none noScrollbar overflow-x-hidden">
            <div className="w-full h-[100dvh] flex justify-center items-center relative">
              <div className="absolute inset-0 z-9">{fireworksJsx}</div>
              <div
                className="flex flex-col font-extrabold brightness-120 gap-2 absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3"
                style={{
                  textShadow: ` 
            2px 0 0 #fff,
           -2px 0 0 #fff,
            0 2px 0 #fff,
            0 -2px 0 #fff`,
                }}
              >
                <div className="flex justify-center relative">
                  <div className="w-[min(5dvw,14dvh)] aspect-square absolute left-0 bottom-0 translate-x-1/5">
                    {avatarJsx}
                  </div>
                  <div className="text-[min(6dvw,16dvh)] leading-[min(6dvw,16dvh)] scale-y-125 text-white">
                    AWESOME!
                  </div>
                </div>
                <div
                  className="pr-[min(16dvw,32dvh)] text-[var(--themeColor)] relative"
                  style={{
                    textShadow: ` 
                2px 0 0 var(--themeColor),
               -2px 0 0 var(--themeColor),
                0 2px 0 var(--themeColor),
                0 -2px 0 var(--themeColor)`,
                  }}
                >
                  <div className="text-[min(6dvw,16dvh)] leading-[min(6dvw,16dvh)] scale-y-125">
                    CREATIVE!
                  </div>
                  <div className="w-1/3 absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/8">
                    {funBoardJsx}
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="text-[min(6dvw,16dvh)] leading-[min(6dvw,16dvh)] scale-y-125 flex gap-8">
                    <span
                      style={{
                        textShadow: ` 
                2px 0 0 var(--themeColor),
               -2px 0 0 var(--themeColor),
                0 2px 0 var(--themeColor),
                0 -2px 0 var(--themeColor)`,
                      }}
                    >
                      AND
                    </span>
                    <span className="text-white">COOL!</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 z-1">{brightBallJsx}</div>
              <div className="absolute bottom-[8vmin] text-[var(--themeColor)] flex flex-col items-center brightness-120 text-sm z-8 gap-[1vmin]">
                <VoicePoweredOrb
                  enableScrollControl={true}
                  enableVoiceControl={false}
                  className="rounded-xl overflow-hidden shadow-2xl w-[16vmin] h-[8vmin]"
                />

                <div className="text-[2vmin] leading-[2vmin]">
                  - SCROLL TO EXPLORE -
                </div>
                <div className="text-[2vmin] leading-[2vmin]">
                  滚 · 动 · 探 · 索
                </div>
              </div>
            </div>
            <div className="w-full h-[100dvh] flex flex-col justify-center items-center relative">
              {portfolioJsx}
            </div>
            <Title
              title={"NEWEST"}
              useScrollAnimation={true}
              textStyle={{
                textShadow: `
                2px 0 0 var(--themeColor),
               -2px 0 0 var(--themeColor),
                0 2px 0 var(--themeColor),
                0 -2px 0 var(--themeColor)`,
              }}
            ></Title>

            <div className="w-full h-[200dvh] flex flex-col">
              {newestData.length < 6 ? (
                <div className="w-full h-full flex justify-center items-center dark">
                  <ContentInsufficient count={6}></ContentInsufficient>
                </div>
              ) : (
                <List
                  data={newestData}
                  windowTrackRef={smoothWrapper}
                  clickCb={(info: any) => {
                    handleExplore(info);
                  }}
                ></List>
              )}
            </div>
            <Title
              title={"RANDOM"}
              useScrollAnimation={true}
              textStyle={{
                textShadow: `
                  2px 0 0 #fff,
                 -2px 0 0 #fff,
                  0 2px 0 #fff,
                  0 -2px 0 #fff`,
              }}
            ></Title>
            <div className="w-full h-[100dvh] flex items-center relative">
              {randomData.length < 6 ? (
                <div className="w-full h-full flex justify-center items-center dark">
                  <ContentInsufficient count={6}></ContentInsufficient>
                </div>
              ) : (
                <RandomContent
                  data={randomData}
                  clickCb={(info: any) => {
                    handleExplore(info);
                  }}
                  handleCurrentIndexChange={setCurrentIndex}
                ></RandomContent>
              )}
            </div>
            <div className="w-full h-[100dvh]">{mouseImageTrailJsx}</div>
            <div className="w-full">{footerJsx}</div>
            <div className="absolute z-0">{/* <RainbowCursor /> */}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
