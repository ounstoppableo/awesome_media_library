import { JSX, use, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable, InertiaPlugin } from "gsap/all";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SvgIcon from "../svgIcon";
import useWheelLogic from "./hooks/useWheelLogic";
import useBaseLogic from "./hooks/useBaseLogic";
import useDraggableLogic from "./hooks/useDraggableLogic";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSienaLoading } from "@/store/loading/loading-slice";
import {
  selectTaojimaControlOpenStatus,
  setOpen as setTaotajimaOpen,
} from "@/store/taotajimaControl/taotajima-slice";
import ContentInsufficient from "../contentInsufficient";
import dayjs from "dayjs";

gsap.registerPlugin(Draggable, InertiaPlugin);

export default function SienaStyle({}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  const [tabValue, setTabValue] = useState("horizontalSingleScroll");
  const odometer = useRef<HTMLDivElement | null>(null);

  const {
    currentDirection,
    scrollContainerItems,
    currentReadPhotoId,
    dualScrollRef,
    snap,
    switchToItemWithEffect,
    scrollContainer,
    init,
    scrollWrapper,
    setCurrentReadPhotoId,
    setRepeatCount,
    repeatCount,
    data,
    currentIndexWatcher,
    loop,
    imgeContainerItems,
    currentIndex,
    setCurrentIndex,
    getCurrentReadPhotoChildren,
    getIdFromKey,
    generateKey,
    setCurrentDirection,
    gap,
    initEffect,
  } = useBaseLogic({});

  useWheelLogic({
    currentDirection,
    scrollContainerItems,
    currentReadPhotoId,
    dualScrollRef,
    snap,
    switchToItemWithEffect,
    scrollContainer,
    init,
    scrollWrapper,
    data,
  });

  const { cursor, handleChangeCurrent, handleControlCursor, setCursorVisible } =
    useDraggableLogic({
      init,
      odometer,
      currentDirection,
      scrollContainer,
      dualScrollRef,
      loop,
      scrollWrapper,
      currentReadPhotoId,
      snap,
      switchToItemWithEffect,
      currentIndex,
      currentIndexWatcher,
      setCurrentIndex,
      scrollContainerItems,
      gap,
      data,
    });

  const dispatch = useAppDispatch();

  useEffect(() => {
    const cb = () => {
      if (innerWidth / innerHeight < 1.4) {
        currentDirection !== "x" && toggleToHorizontal();
      }
    };
    window.addEventListener("resize", cb);
    return () => {
      window.removeEventListener("resize", cb);
    };
  }, [currentDirection]);

  const taotajimaOpenStatus = useAppSelector(selectTaojimaControlOpenStatus);
  const handleExplore = (info: any) => {
    dispatch(setTaotajimaOpen({ open: !taotajimaOpenStatus, id: info.id }));
  };

  const photoItem = (
    item: any,
    index: number,
    type: "small" | "default" = "default"
  ) => {
    if (!item) return <></>;
    return (
      <>
        <div
          className={`h-full w-full overflow-hidden relative select-none ${
            type === "small"
              ? "transition-all after:absolute after:inset-0 after:pointer-events-none after:z-10 after:bg-[linear-gradient(transparent_0%,transparent_50%,#000_100%)]"
              : currentDirection === "x"
              ? "rounded-4xl after:absolute after:inset-0 after:pointer-events-none after:z-10 after:bg-[linear-gradient(transparent_0%,transparent_40%,#000_100%)]"
              : "rounded-4xl after:absolute after:inset-0 after:pointer-events-none after:z-10 after:bg-[linear-gradient(rgba(0,0,0,0.6)_0%,transparent_20%,transparent_80%,rgba(0,0,0,0.6)_100%)]"
          }`}
        >
          <img
            src={item.img}
            className={`${
              type === "small"
                ? "w-[8vmin] h-[10vmin] rounded-lg transition-all"
                : currentDirection === "y"
                ? "w-[100dvw] h-[100dvh] top-1/2 left-1/2 -translate-1/2"
                : "w-fit h-[100vh] top-1/2 left-1/2 -translate-1/2"
            } object-cover absolute  select-none`}
            ref={(el) => {
              type === "default" && (imgeContainerItems.current[index] = el);
            }}
          ></img>
        </div>
        {init && (
          <div
            className={`absolute z-10 w-fit flex text-white gap-[2vmin]   ${
              type === "small"
                ? "left-[11vmin] bottom-[-2vmin] h-full transition-all"
                : currentDirection === "y"
                ? "h-fit left-[8vmin] flex-col justify-center items-center bottom-[6vmin]"
                : "h-fit flex-col justify-center items-center bottom-[4vmin]"
            }`}
          >
            <div
              className={`flex flex-col justify-center items-center  ${
                type === "small"
                  ? "whitespace-nowrap scale-80 -translate-x-1/24 transition-all"
                  : currentDirection === "y"
                  ? "gap-[2vmin]"
                  : "gap-[.5vmin]"
              }`}
            >
              <div className="text-[2vmin] tracking-[.5vmin]">
                {item.category.toUpperCase()}
              </div>
              <div
                className={`photoTitle ${
                  currentDirection === "y"
                    ? "text-[8vmin] leading-[8vmin]"
                    : "text-[4vmin] leading-[4vmin]"
                }`}
              >
                {(item.chineseTitle || item.englishTitle).toUpperCase()}
              </div>
            </div>
            <div
              className={`${
                type === "small"
                  ? "hidden [@media(min-aspect-ratio:2/1)]:flex"
                  : ""
              } ${
                currentDirection === "y" ? "text-[2.5vmin]" : "text-[2vmin]"
              } flex-col w-full justify-center items-center`}
              style={{
                lineHeight:
                  currentDirection === "y"
                    ? "calc(2.5vmin - 4px)"
                    : "calc(2vmin - 4px)",
                verticalAlign: "center",
              }}
            >
              <div className="flex border-t border-white items-center justify-center gap-[8vmin] px-[2vmin] w-full">
                <div>YEAR</div>
                <div>{dayjs(item.date).year()}</div>
              </div>
              <div className="flex border-t border-white items-center justify-center  gap-[4vmin] px-[3vmin] w-full">
                <div>LOCATION</div>
                <div>{item.location.toUpperCase()}</div>
              </div>
              <div className="flex border-t border-white border-b items-center justify-center gap-[6vmin] px-[1vmin] w-full">
                <div>CATEGORY</div>
                <div>{item.category.toUpperCase()}</div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const daulScrollItem = (item: any, index: number) => {
    return (
      <div
        ref={(el: any) => {
          currentReadPhotoId && (scrollContainerItems.current[index] = el);
        }}
        key={generateKey(item.id, index)}
        className="h-full aspect-1/1 overflow-hidden relative after:absolute after:inset-0 after:pointer-events-none after:z-10 after:bg-[radial-gradient(transparent_0%,#000_90%)]"
      >
        <img
          src={item.img}
          className={`w-full h-full object-cover select-none rounded-lg`}
          ref={(el) => {
            currentReadPhotoId && (imgeContainerItems.current[index] = el);
          }}
        ></img>
      </div>
    );
  };

  const toggleToHorizontal = () => {
    setCurrentDirection("x");
    switchToItemWithEffect(getIdFromKey(currentReadPhotoId));
    setCurrentReadPhotoId("");
    setRepeatCount(5);
  };

  return (
    <div
      ref={scrollWrapper}
      className={`bg-black flex flex-col gap-[4vmin] select-none h-[100dvh] w-full overflow-hidden relative after:absolute after:inset-0 after:pointer-events-none after:z-10  ${
        currentDirection === "y"
          ? "after:bg-[linear-gradient(#000_0%,transparent_10%,transparent_90%,#000_100%)]"
          : "after:bg-[linear-gradient(to_right,#000_0%,transparent_10%,transparent_90%,#000_100%)] py-[6vmin]"
      }`}
    >
      {cursor}
      <Transition show={init && currentDirection === "x"}>
        <Tabs
          defaultValue="tab-1"
          className={clsx([
            "self-center dark z-20",
            "data-closed:opacity-0 data-enter:duration-300 data-leave:duration-300",
            "data-enter:data-closed:-translate-y-full",
            "data-leave:data-closed:-translate-y-full",
          ])}
          value={tabValue}
          onValueChange={(value) => {
            setTabValue(value);
            if (tabValue === value) return;
            if (value === "horizontalSingleScroll") {
              toggleToHorizontal();
            }
            if (value === "dualScroll") {
              toggleToHorizontal();
              setCurrentReadPhotoId(
                generateKey(
                  Array.from({ length: repeatCount }, (_, i) => data).flat()[
                    currentIndex
                  ].id,
                  currentIndex
                )
              );
              setRepeatCount(
                Math.floor(
                  (5 * innerWidth) / scrollContainerItems.current[0].offsetWidth
                )
              );
            }
          }}
        >
          <TabsList>
            <TabsTrigger value="horizontalSingleScroll">
              <div
                className={`cursor-pointer w-6 h-8 overflow-hidden flex justify-center items-center relative after:absolute after:inset-0 after:pointer-events-none after:z-10 after:transition-all ${
                  tabValue === "horizontalSingleScroll"
                    ? "after:bg-[radial-gradient(transparent_0%,transparent_20%,#0a0a0a_100%)]"
                    : "after:bg-[radial-gradient(transparent_0%,transparent_20%,#262626_100%)]"
                }`}
              >
                <SvgIcon
                  path={"/siena/horizontalSingleScroll.svg"}
                  className="w-8 h-8 text-yellow-400"
                ></SvgIcon>
              </div>
            </TabsTrigger>
            <TabsTrigger value="dualScroll">
              <div
                className={`cursor-pointer w-6 h-8 overflow-hidden flex justify-center items-center relative after:absolute after:inset-0 after:pointer-events-none after:z-10 after:transition-all ${
                  tabValue === "dualScroll"
                    ? "after:bg-[radial-gradient(transparent_0%,transparent_20%,#0a0a0a_100%)]"
                    : "after:bg-[radial-gradient(transparent_0%,transparent_20%,#262626_100%)]"
                }`}
              >
                <SvgIcon
                  path={"/siena/dualScroll.svg"}
                  className="w-8 h-8 text-yellow-400"
                ></SvgIcon>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Transition>

      <Transition show={init && (!currentReadPhotoId as any)}>
        {
          <div
            className={clsx([
              "absolute top-[6vmin] left-[8vmin] text-white text-[4vmin] font-semibold cursor-pointer z-20 [@media(min-aspect-ratio:1.4/1)]:block hidden",
              "data-closed:opacity-0 data-enter:duration-300 data-leave:duration-300",
              "data-enter:data-closed:-translate-x-full",
              "data-leave:data-closed:-translate-x-full",
            ])}
            onClick={() => {
              setCurrentDirection(currentDirection === "y" ? "x" : "y");
            }}
          >
            {(currentDirection === "y"
              ? "vertical"
              : "horizontal"
            ).toUpperCase()}
            <div
              className="text-[2vmin] font-thin w-full"
              style={{ textAlign: "justify", textAlignLast: "justify" }}
            >
              C l i c k T o T o g g l e
            </div>
          </div>
        }
      </Transition>

      {data.length >= 3 ? (
        !currentReadPhotoId && (
          <div
            className={`flex ${
              currentDirection === "y"
                ? "h-fit w-full px-16 flex-col z-[0!important] items-center justify-center gap-8"
                : "h-full w-fit z-[0!important] items-center justify-center gap-8"
            } `}
            ref={(el) => {
              if (!currentReadPhotoId) {
                scrollContainer.current = el;
              }
            }}
            onMouseMove={() => {
              setCursorVisible(true);
            }}
            onMouseLeave={() => {
              setCursorVisible(false);
            }}
          >
            {Array.from({ length: repeatCount }, (_, i) => data)
              .flat()
              .map((item, index) => (
                <div
                  className={`
                    ${
                      currentDirection === "y"
                        ? "h-[70dvh] w-full justify-center items-center"
                        : "h-[60dvh] aspect-[4/5] justify-center items-center"
                    } flex text-4xl relative select-none `}
                  key={generateKey(item.id, index)}
                  ref={(el: any) => {
                    !currentReadPhotoId &&
                      (scrollContainerItems.current[index] = el);
                  }}
                  onMouseEnter={(e) => {
                    handleControlCursor(index);
                  }}
                  onMouseLeave={(e) => {
                    handleControlCursor(currentIndex);
                  }}
                  onMouseMove={(e) => {
                    handleControlCursor(index);
                  }}
                  onClick={() =>
                    handleChangeCurrent(
                      currentIndex > index
                        ? "down"
                        : currentIndex < index
                        ? "up"
                        : ""
                    )
                  }
                >
                  {photoItem(item, index, "default")}
                  {currentDirection === "y" && init && (
                    <div className="absolute bottom-[6vmin] right-[8vmin] z-20">
                      <InteractiveHoverButton
                        className="text-xl w-[32vmin] h-[7vmin]"
                        text="Explore"
                        defaultColor="bg-transparent"
                        hoverColor="white"
                        onClick={() => {
                          handleExplore(item);
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        )
      ) : (
        <ContentInsufficient count={3}></ContentInsufficient>
      )}
      {
        <Transition show={currentReadPhotoId as any}>
          <div
            className={clsx([
              "absolute h-[10vmin] w-[50dvw] z-20 transition ease-in-out bottom-[6vmin] left-[8vmin] translate-0",
              "data-closed:opacity-0 data-enter:duration-300 data-leave:duration-300",
              "data-enter:data-closed:-translate-x-full",
              "data-leave:data-closed:-translate-x-full",
            ])}
          >
            {photoItem(
              data.find(
                (item: any) => item.id === getIdFromKey(currentReadPhotoId)
              ) ||
                Array.from({ length: repeatCount }, (_, i) => data).flat()[
                  currentIndex
                ],
              0,
              "small"
            )}
          </div>
        </Transition>
      }
      {currentReadPhotoId ? (
        data.find(
          (item: any) => item.id + "" === getIdFromKey(currentReadPhotoId)
        ).children?.length >= 3 ? (
          <div
            className="h-full w-fit flex flex-col gap-8 overflow-hidden m-12 rounded-lg"
            onMouseMove={() => {
              setCursorVisible(true);
            }}
            onMouseLeave={() => {
              setCursorVisible(false);
            }}
            ref={(el) => {
              if (currentReadPhotoId) {
                scrollContainer.current = el;
              }
            }}
          >
            <div
              ref={(el) => {
                dualScrollRef.current[0] = el;
              }}
              className="w-fit flex-1 flex gap-8 overflow-hidden"
            >
              {Array.from({ length: repeatCount }, (_, i) =>
                getCurrentReadPhotoChildren("front")
              )
                .flat()
                .map((item: any, index) => daulScrollItem(item, index))}
            </div>
            <div
              ref={(el) => {
                dualScrollRef.current[1] = el;
              }}
              className="w-fit flex-1 flex gap-8 overflow-hidden"
            >
              {Array.from({ length: repeatCount }, (_, i) =>
                getCurrentReadPhotoChildren("back")
              )
                .flat()
                .map((item: any, index) => daulScrollItem(item, index))}
            </div>
          </div>
        ) : (
          <>
            <ContentInsufficient count={3}></ContentInsufficient>
          </>
        )
      ) : (
        <></>
      )}

      {currentDirection === "x" && init && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] scale-x-20 bg-white z-10"></div>
          <div className="w-full px-16 flex justify-between items-center relative">
            <div className="flex:1"></div>
            <div className=" gap-2 items-end h-fit absolute top-1/2 left-1/2 -translate-1/2 z-20 hidden [@media(min-aspect-ratio:2/1)]:flex">
              <div className="w-[1px] h-3 bg-white"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-3 bg-white"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-3 bg-white"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-3 bg-white"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-3 bg-white"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-3 bg-white"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-1.5 bg-gray-200"></div>
              <div className="w-[1px] h-3 bg-white"></div>
              <div
                className="absolute top-1/2 left-1/2 w-5 h-3 rounded-[4px] bg-black border border-white -translate-1/2"
                ref={odometer}
              ></div>
            </div>
            <InteractiveHoverButton
              className="text-xl w-[24vmin] h-[6vmin] z-20"
              text="Explore"
              defaultColor="bg-transparent"
              hoverColor="white"
            />
          </div>
        </>
      )}
    </div>
  );
}
