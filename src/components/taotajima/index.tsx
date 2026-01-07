"use client";
import React, {
  Children,
  Ref,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Instagram, Play, Twitter, X } from "lucide-react";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { AnimatedText3D, pxToWorld, remToWorld } from "@/utils/AnimatedText3D";
import { Engine } from "@/utils/engine";
import useSoftTextLogic from "./hooks/useSoftTextLogic";
import useResizeLogic from "./hooks/useResizeLogic";
import usePhotoChangeLogic from "./hooks/usePhotoChangeLogic";
import useOtherAnimateLogic from "./hooks/useOtherAnimateLogic";

/**
 * 操作量：图片尺寸、canvas尺寸(坐标轴尺度)、缩放比例
 * 一般来说，图片按照原始尺寸映射到canvas坐标轴上，比如说500x500的图片，映射到300x300的canvas上，将会超出
 * 但如果canvas尺寸为500x500，那么则可以正好填满
 *
 * 但是假设我们就是想将500x500的图片正好铺满300x300的canvas，应该怎么做?
 * 只需要设置ctx.drawImage(image,x,y,swidth,sheight)的swidth和sheight即可，其含义为将图片尺寸伸缩至swidth和sheight
 * 比如ctx.drawImage(image,0,0,300,300),假设图片原始宽高为500x500,那么绘制到canvas上将占300x300的位置,但是图片能够完全展示,由于尺寸明显变小,所以图片被压缩了,伸长同理
 *
 * 到这里我们其实可以知道,原始图片尺寸与canvas尺寸是一一对应的,也就是1单位的图片像素等于1单位的canvas坐标点,而通过调节swidth和sheight可以控制图片像素与canvas尺寸的关系
 * 其像素比(每canvas单位对应多少图片像素)将为: 图片尺寸 / s[width|height]
 */

export default function Taotajima() {
  const backBtnRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const twitterBtnRef = useRef<any>(null);
  const instagramBtnRef = useRef<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState({
    id: "taotajima",
    title: "taotajima",
    children: [
      {
        id: "1",
        img: `/video.mp4`,
        title: "Magic",
        tag: "client work",
        content:
          "Planned and produced a short video that was exhibited in NHK (Japan Broadcasting Corporation)'s TECHNE. This experimental video captures nothing but the movements of the line of sight of living creatures. It explored the idea that each individual creature's characteristic might remain, even in a video with just these movements and sound effects.",
      },
      {
        id: "2",
        img: `/magic.jpg`,
        title: "MN concept movie",
        tag: "private work",
        content:
          "Directed and produced a concept movie for the MN cosmetic brand.Instead of giving many instructions to the female models, the autonomy of each of the three models was respected and enhanced.",
      },
      {
        id: "3",
        img: `/video.mp4`,
        title: "TELE-PLAY - prism",
        tag: "client work",
        content:
          "Directed and produced the music video “prism” for TELE-PLAY.The new song by TELE-PLAY, a music unit that explores how music can be performed in a pandemic environment. It expresses the importance of connecting with others and the tranquility of gazing into one's inner world",
      },
    ],
  });
  const { resizeObserverCb } = useResizeLogic();
  const { currentSoftTextInst, generateSoftText, softText } = useSoftTextLogic({
    resizeObserverCb,
    data,
    contentRef,
  });
  const {
    animateOpacity,
    animatePageToggleBtn,
    animateBtn,
    splitRef,
    shareRef,
    playRef,
    leftBtnRef,
    rightBtnRef,
  } = useOtherAnimateLogic({});

  const togglePageControl = useRef<any>(null);

  const clearCb = async (nextOperate: "next" | "prev") => {
    animateOpacity.current.reverse();
    return currentSoftTextInst.current?.toHidden?.(nextOperate);
  };
  const prevCb = (current: number) => {
    let _resolve: any;
    const promise = new Promise((resolve) => {
      _resolve = resolve;
    });
    setCurrent(current);
    requestAnimationFrame(() => {
      animateOpacity.current.play();
      generateSoftText
        .current(
          `#${(current + 1).toString().padStart(3, "0")}      ${
            data.children[current].tag
          }`,
          data.children[current].title,
          data.children[current].content,
          "prev"
        )
        .toShow("prev")
        .then(() => {
          _resolve(1);
        });
    });
    return promise;
  };
  const nextCb = (current: number) => {
    let _resolve: any;
    const promise = new Promise((resolve) => {
      _resolve = resolve;
    });
    setCurrent(current);
    requestAnimationFrame(() => {
      animateOpacity.current.play();
      generateSoftText
        .current(
          `#${(current + 1).toString().padStart(3, "0")}      ${
            data.children[current].tag
          }`,
          data.children[current].title,
          data.children[current].content,
          "next"
        )
        .toShow("next")
        .then(() => {
          _resolve(1);
        });
    });
    return promise;
  };

  const { sketch } = usePhotoChangeLogic({
    data,
    clearCb: clearCb,
    prevCb: prevCb,
    nextCb: nextCb,
    togglePageControl,
  });

  return (
    <>
      <div
        id="taotajimaSliderContent"
        className="w-[100dvw] h-[100dvh] relative"
      >
        <div
          className="w-full h-full relative after:absolute after:inset-0 after:bg-black/40"
          id="taotajimaSlider"
        ></div>
        <div className="absolute inset-0 z-1 flex justify-center items-center flex-col p-16 pt-8 cursor-default">
          <div className="flex text-xl text-white justify-between w-full">
            <div className=" flex gap-4">
              <div
                className="flex cursor-pointer"
                ref={backBtnRef}
                onMouseEnter={animatePageToggleBtn.bind(
                  null,
                  backBtnRef,
                  "left",
                  "enter"
                )}
                onMouseLeave={animatePageToggleBtn.bind(
                  null,
                  backBtnRef,
                  "left",
                  "leave"
                )}
              >
                <svg
                  viewBox="0 0 35 7"
                  className="w-12 fill-white arrow origin-right"
                >
                  <polyline points="360,7 0,7 21,0 21,6 360,6"></polyline>
                </svg>
                <div className="text-end title">BACK</div>
              </div>
              <div className="w-[.0625rem] h-9 bg-white/80 rotate-20"></div>
              <div className="select-none">{data.title.toUpperCase()}</div>
            </div>
            <div className="flex text-2xl gap-4 h-fit">
              <div className="select-none">Blog</div>
              <div className="w-[.0625rem] h-9 bg-white/80 rotate-20"></div>
              <div className="cursor-pointer relative after:bottom-0 after:left-0 after:absolute after:border-b-2 after:border-white hover:after:w-full after:transition-all after:w-0">
                Unstoppable840
              </div>
            </div>
          </div>
          <div className="flex-1"></div>
          <div className="relative flex gap-8 items-center max-w-[50dvw]">
            <div className=" text-white gap-4 flex flex-col items-start">
              <div
                className=" gap-4 flex flex-col items-start relative"
                ref={contentRef}
              >
                <div className="flex text-2xl gap-4 h-fit ">
                  <div className="opacity-0">
                    #{(current + 1).toString().padStart(3, "0")}
                  </div>
                  <div
                    className="w-[.0625rem] h-9 bg-white/80 rotate-20"
                    ref={splitRef}
                  ></div>
                  <div className="opacity-0">{data.children[current].tag}</div>
                </div>
                <div className="text-6xl opacity-0">
                  {data.children[current].title}
                </div>
                <div className="line-clamp-4 leading-8 opacity-0">
                  {data.children[current].content}
                </div>
              </div>
              <div className="text-xl flex gap-4 items-center" ref={shareRef}>
                <div>Share:</div>
                <div className="flex gap-4">
                  <Twitter
                    ref={twitterBtnRef}
                    onMouseEnter={animateBtn.bind(null, twitterBtnRef)}
                    className="cursor-pointer"
                  />
                  <Instagram
                    ref={instagramBtnRef}
                    onMouseEnter={animateBtn.bind(null, instagramBtnRef)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="dark" ref={playRef}>
              <InteractiveHoverButton
                className="text-xl w-40 aspect-1/1 z-20 opacity-80"
                text="play"
                defaultColor="white"
                border={false}
                hoverColor="black"
                dotPosition={"50%"}
              />
            </div>
          </div>
          <div className="flex-1"></div>
          <div className="relative text-white text-xl flex gap-[10dvw] max-w-[50dvw] select-none">
            {
              <div
                className="relative flex flex-col items-end w-[20dvw] cursor-pointer"
                ref={leftBtnRef}
                onMouseEnter={() => {
                  if (togglePageControl.current) return;
                  animatePageToggleBtn(leftBtnRef, "left", "enter");
                }}
                onMouseLeave={() => {
                  if (togglePageControl.current) return;
                  animatePageToggleBtn(leftBtnRef, "left", "leave");
                }}
                onClick={async () => {
                  if (togglePageControl.current) return;
                  clearCb("prev");
                  togglePageControl.current = sketch.current.prev();
                  togglePageControl.current.then(async (current: number) => {
                    await prevCb(current);
                    togglePageControl.current = null;
                  });
                }}
              >
                {
                  <>
                    <div
                      className="pageCount"
                      key={current === 0 ? data.children.length : current}
                    >
                      #
                      {(current === 0 ? data.children.length : current)
                        .toString()
                        .padStart(3, "0")}
                    </div>
                    <div className="truncate w-[80%] title text-right">
                      {
                        data.children[
                          current === 0 ? data.children.length - 1 : current - 1
                        ].title
                      }
                    </div>
                    <svg
                      viewBox="0 0 360 7"
                      className="fill-white absolute bottom-2 arrow origin-right"
                    >
                      <polyline points="360,7 0,7 21,0 21,6 360,6"></polyline>
                    </svg>
                  </>
                }
              </div>
            }
            {
              <div
                className="relative flex flex-col items-start w-[20dvw] cursor-pointer"
                ref={rightBtnRef}
                onMouseEnter={() => {
                  if (togglePageControl.current) return;
                  animatePageToggleBtn(rightBtnRef, "right", "enter");
                }}
                onMouseLeave={() => {
                  if (togglePageControl.current) return;
                  animatePageToggleBtn(rightBtnRef, "right", "leave");
                }}
                onClick={async () => {
                  if (togglePageControl.current) return;
                  clearCb("next");
                  togglePageControl.current = sketch.current.next();
                  togglePageControl.current.then(async (current: number) => {
                    await nextCb(current);
                    togglePageControl.current = null;
                  });
                }}
              >
                {
                  <>
                    <div
                      className="pageCount"
                      key={current + 2 > data.children.length ? 1 : current + 2}
                    >
                      #
                      {(current + 2 > data.children.length ? 1 : current + 2)
                        .toString()
                        .padStart(3, "0")}
                    </div>
                    <div className="truncate w-[80%] title">
                      {
                        data.children[
                          current + 1 > data.children.length - 1
                            ? 1
                            : current + 1
                        ].title
                      }
                    </div>
                    <svg
                      viewBox="0 0 360 7"
                      className="fill-white absolute bottom-2 arrow origin-left"
                    >
                      <polyline points="0,7 360,7 339,0 339,6 0,6"></polyline>
                    </svg>
                  </>
                }
              </div>
            }
          </div>
        </div>
        <div className="absolute inset-0 z-0" ref={softText}></div>
      </div>
    </>
  );
}
