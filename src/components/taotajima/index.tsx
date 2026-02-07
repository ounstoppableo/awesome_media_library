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
import { motion } from "motion/react";
import { AnimatedText3D, pxToWorld, remToWorld } from "@/utils/AnimatedText3D";
import { Engine } from "@/utils/engine";
import useSoftTextLogic from "./hooks/useSoftTextLogic";
import useResizeLogic from "./hooks/useResizeLogic";
import usePhotoChangeLogic from "./hooks/usePhotoChangeLogic";
import useOtherAnimateLogic from "./hooks/useOtherAnimateLogic";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectTaojimaCurrentId,
  setOpen,
} from "@/store/taotajimaControl/taotajima-slice";
import request from "@/utils/fetch";
import ContentInsufficient from "../contentInsufficient";
import { CommonResponse } from "@/types/response";
import { codeMap } from "@/utils/backendStatus";
import { CategoryDetail, CategoryItem } from "@/types/media";
import { App } from "antd";
import { toast } from "sonner";
import { RiTiktokLine, RiTwitterXLine } from "@remixicon/react";

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
  const [current, _setCurrent] = useState(0);
  const currentRef = useRef(0);
  const setCurrent = (value: number) => {
    _setCurrent(value);
    currentRef.current = value;
  };
  const contentRef = useRef<HTMLDivElement>(null);
  const introduceRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<CategoryDetail | null>(null);
  const { resizeObserverCb } = useResizeLogic();
  const { message } = App.useApp();

  const {
    animateOpacity,
    animatePageToggleBtn,
    splitRef,
    shareRef,
    playRef,
    leftBtnRef,
    rightBtnRef,
  } = useOtherAnimateLogic({ data });
  const { currentSoftTextInst, generateSoftText, softText } = useSoftTextLogic({
    resizeObserverCb,
    data,
    contentRef,
    shareRef,
    introduceRef,
    currentRef,
  });

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
      if (!data) return;
      animateOpacity.current.play();
      generateSoftText
        .current(
          `#${(current + 1).toString().padStart(3, "0")}  /  ${
            data.children[current].tag
          }`,
          data.children[current].chineseTitle ||
            data.children[current].englishTitle,
          data.children[current].introduce,
          "prev",
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
      if (!data) return;
      animateOpacity.current.play();
      generateSoftText
        .current(
          `#${(current + 1).toString().padStart(3, "0")}  /  ${
            data.children[current].tag
          }`,
          data.children[current].chineseTitle ||
            data.children[current].englishTitle,
          data.children[current].introduce,
          "next",
        )
        .toShow("next")
        .then(() => {
          _resolve(1);
        });
    });
    return promise;
  };

  const currentId = useAppSelector(selectTaojimaCurrentId);
  const dispatch = useAppDispatch();
  useEffect(() => {
    currentId &&
      request("/api/category/categoryDetail", {
        method: "post",
        body: { id: currentId },
      }).then(async (res: CommonResponse) => {
        if (res.code === codeMap.success) {
          const data: CategoryDetail = res.data;
          if (!res.data || !res.data.children) {
            back();
            message.warning("打开摄影集时似乎出现了一点问题😇");
            return;
          }
          const coverIndex = data.children.findIndex(
            (item: CategoryItem) => item.mediaId === data.mediaId,
          );
          const cover = data.children.splice(coverIndex, 1);
          data.children = [...cover, ...data.children];
          setData(data);
        } else {
          back();
          message.warning("打开摄影集时似乎出现了一点问题😇");
        }
      });
  }, []);
  const back = () => {
    dispatch(setOpen({ open: false, id: "" }));
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
      {data ? (
        <div
          id="taotajimaSliderContent"
          className="w-full h-full relative select-none bg-black"
        >
          <div
            className="w-full h-full relative after:absolute after:inset-0 after:bg-black/40"
            id="taotajimaSlider"
          ></div>
          <div className="absolute inset-0 z-1 flex justify-center items-center flex-col p-[6vmin] pt-[4vmin] cursor-default">
            <div className="flex text-xl text-white justify-between w-full">
              <div className=" flex gap-4">
                <div
                  className="flex cursor-pointer"
                  ref={backBtnRef}
                  onMouseEnter={animatePageToggleBtn.bind(
                    null,
                    backBtnRef,
                    "left",
                    "enter",
                  )}
                  onMouseLeave={animatePageToggleBtn.bind(
                    null,
                    backBtnRef,
                    "left",
                    "leave",
                  )}
                >
                  <svg
                    viewBox="0 0 35 7"
                    className="w-12 fill-white arrow origin-right"
                  >
                    <polyline points="360,7 0,7 21,0 21,6 360,6"></polyline>
                  </svg>
                  <div className="text-end title text-[2.5vmin]" onClick={back}>
                    BACK
                  </div>
                </div>
                <div className="w-[.0625rem] h-[4vmin] bg-white/80 rotate-20"></div>
                <div className="select-none text-[2.5vmin]">
                  {(data.chineseTitle || data.englishTitle).toUpperCase()}
                </div>
              </div>
              <div className="flex text-2xl gap-4 h-fit">
                <div className="select-none text-[2.5vmin]">Blog</div>
                <div className="w-[.0625rem] h-[4vmin] bg-white/80 rotate-20"></div>
                <div className="text-[2.5vmin] cursor-pointer relative after:bottom-0 after:left-0 after:absolute after:border-b-2 after:border-white hover:after:w-full after:transition-all after:w-0">
                  Unstoppable840
                </div>
              </div>
            </div>
            {data.children.length >= 1 ? (
              <div className="absolute top-1/2 left-1/2 -translate-1/2 flex gap-[4vmin] items-center max-w-[50dvw]">
                <div className=" text-white gap-[3vmin] flex flex-col items-start">
                  <div
                    className=" gap-[2vmin] flex flex-col items-start relative opacity-0"
                    ref={contentRef}
                  >
                    <div className="flex text-[3vmin] leading-[3vmin] gap-[2vmin] h-fit">
                      <div>#{(current + 1).toString().padStart(3, "0")}</div>
                      <div className="w-[.0625rem] h-[2vmin] rotate-20"></div>
                      <div className="">{data.children[current].tag}</div>
                    </div>
                    <div className="text-[5vmin] leading-[4vmin]">
                      {data.children[current].chineseTitle ||
                        data.children[current].englishTitle}
                    </div>
                    <div
                      className="text-[2vmin] leading-[3.6vmin]"
                      ref={introduceRef}
                    >
                      {data.children[current].introduce}
                    </div>
                  </div>
                  {
                    <div
                      className="text-[2vmin] flex gap-[2vmin] items-center"
                      ref={shareRef}
                    >
                      <div>Share:</div>
                      <div className="flex gap-[2vmin]">
                        <motion.div
                          whileHover={{
                            scale: 1.3,
                            rotate: 360,
                            transition: { duration: 0.1 },
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <RiTiktokLine
                            className="cursor-pointer w-[3vmin] hover:text-[var(--themeColor)] transition-all duration-300"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `请欣赏unstoppable840的摄影作品「${data.chineseTitle || data.englishTitle}」\n网址:${`${window.origin}/?categoryId=${currentId}`}`,
                              );
                              toast("Share", {
                                description: "您已成功复制文案🎉",
                                action: {
                                  label: "跳转",
                                  onClick: () => {
                                    window.open(`https://www.douyin.com/`);
                                  },
                                },
                              });
                            }}
                          />
                        </motion.div>
                        <motion.div
                          whileHover={{
                            scale: 1.3,
                            rotate: 360,
                            transition: { duration: 0.1 },
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <RiTwitterXLine
                            className="cursor-pointer w-[3vmin] hover:text-[var(--themeColor)] transition-all duration-300"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `请欣赏unstoppable840的摄影作品「${data.chineseTitle || data.englishTitle}」\n网址:${`${window.origin}/?categoryId=${currentId}`}`,
                              );
                              toast("Share", {
                                description: "您已成功复制文案🎉",
                                action: {
                                  label: "跳转",
                                  onClick: () => {
                                    window.open(
                                      `https://twitter.com/intent/tweet?url=${`${window.origin}/?categoryId=${currentId}`}&text=${`请欣赏unstoppable840的摄影作品「${data.chineseTitle || data.englishTitle}」`}`,
                                    );
                                  },
                                },
                              });
                            }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  }
                </div>

                {
                  <div ref={playRef}>
                    <InteractiveHoverButton
                      className="text-xl w-[20vmin] h-[20vmin] aspect-1/1 z-20 opacity-80"
                      text="play"
                      defaultBgColor="white"
                      defaultBorderColor="white"
                      defaultTextColor="black"
                      hoverBgColor="black"
                      hoverBorderColor="black"
                      hoverTextColor="white"
                      border={false}
                      dotPosition={"50%"}
                      onClick={() => {
                        window.open(
                          location.origin +
                            "/" +
                            data.children[current].sourcePath,
                          "_blank",
                        );
                      }}
                    />
                  </div>
                }
              </div>
            ) : (
              <div className="absolute inset-0 flex justify-center items-center z-[-1]">
                <ContentInsufficient count={1}></ContentInsufficient>
              </div>
            )}
            <div className="flex-1"></div>
            {data.children?.length >= 2 && (
              <>
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
                        togglePageControl.current.then(
                          async (current: number) => {
                            await prevCb(current);
                            togglePageControl.current = null;
                          },
                        );
                      }}
                    >
                      {
                        <>
                          <div
                            className="pageCount text-[2vmin]"
                            key={current === 0 ? data.children.length : current}
                          >
                            #
                            {(current === 0 ? data.children.length : current)
                              .toString()
                              .padStart(3, "0")}
                          </div>
                          <div className="truncate w-[80%] title text-right text-[2.5vmin]">
                            {data.children[
                              current === 0
                                ? data.children.length - 1
                                : current - 1
                            ].chineseTitle ||
                              data.children[
                                current === 0
                                  ? data.children.length - 1
                                  : current - 1
                              ].englishTitle}
                          </div>
                          <svg
                            viewBox="0 0 360 7"
                            className="fill-white absolute bottom-[1vmin] arrow origin-right"
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
                        togglePageControl.current.then(
                          async (current: number) => {
                            await nextCb(current);
                            togglePageControl.current = null;
                          },
                        );
                      }}
                    >
                      {
                        <>
                          <div
                            className="pageCount text-[2vmin]"
                            key={
                              current + 2 > data.children.length
                                ? 1
                                : current + 2
                            }
                          >
                            #
                            {(current + 2 > data.children.length
                              ? 1
                              : current + 2
                            )
                              .toString()
                              .padStart(3, "0")}
                          </div>
                          <div className="truncate w-[80%] title text-[2.5vmin]">
                            {data.children[
                              current + 1 > data.children.length - 1
                                ? 1
                                : current + 1
                            ].chineseTitle ||
                              data.children[
                                current + 1 > data.children.length - 1
                                  ? 1
                                  : current + 1
                              ].englishTitle}
                          </div>
                          <svg
                            viewBox="0 0 360 7"
                            className="fill-white absolute bottom-[1vmin] arrow origin-left"
                          >
                            <polyline points="0,7 360,7 339,0 339,6 0,6"></polyline>
                          </svg>
                        </>
                      }
                    </div>
                  }
                </div>
              </>
            )}
          </div>
          <div className="absolute inset-0 z-0" ref={softText}></div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
