import { JSX, use, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable, InertiaPlugin } from "gsap/all";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SvgIcon from "../svgIcon";
import useWheelLogic from "./hooks/useWheelLogic";
import useBaseLogic from "./hooks/useBaseLogic";
import useDraggableLogic from "./hooks/useDraggableLogic";
gsap.registerPlugin(Draggable, InertiaPlugin);

export default function SienaStyle({}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  const [tabValue, setTabValue] = useState("singleScroll");
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
  } = useBaseLogic({});

  useWheelLogic({
    currentDirection,
    scrollContainerItems,
    currentReadPhotoId,
    dualScrollRef,
    snap,
    switchToItemWithEffect,
    scrollContainer,
  });

  const { cursor, handleChangeCurrent, handleControlCursor } =
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
    });

  const photoItem = (
    item: any,
    index: number,
    type: "small" | "default" = "default"
  ) => {
    return (
      <>
        <div
          className={`h-full w-full overflow-hidden relative select-none   ${
            type === "small"
              ? "transition-all after:absolute after:inset-0 after:pointer-events-none after:z-10 after:bg-[linear-gradient(transparent_0%,transparent_50%,#000_100%)]"
              : currentDirection === "x"
              ? "rounded-4xl after:absolute after:inset-0 after:pointer-events-none after:z-10 after:bg-[linear-gradient(transparent_0%,transparent_50%,#000_100%)]"
              : "rounded-4xl"
          }`}
        >
          <img
            src={item.img}
            className={`${
              type === "small"
                ? "w-16 h-20 rounded-lg transition-all"
                : currentDirection === "y"
                ? "w-[100vw] h-fit top-1/2 left-1/2 -translate-1/2"
                : "w-fit h-[100vh] top-1/2 left-1/2 -translate-1/2"
            } object-cover absolute  select-none`}
            ref={(el) => {
              type === "default" && (imgeContainerItems.current[index] = el);
            }}
          ></img>
        </div>
        {init && (
          <div
            className={`absolute z-10 w-fit  flex text-white gap-4   ${
              type === "small"
                ? "left-22 h-full transition-all"
                : currentDirection === "y"
                ? "h-fit left-8 flex-col justify-center items-center bottom-8"
                : "h-fit flex-col justify-center items-center bottom-8"
            }`}
          >
            <div
              className={`flex flex-col justify-center items-center  ${
                type === "small"
                  ? "whitespace-nowrap scale-80 -translate-x-1/8 self-end transition-all"
                  : currentDirection === "y"
                  ? "gap-4"
                  : "gap-1"
              }`}
            >
              <div
                className="text-xs tracking-[4px]"
                style={{
                  fontFamily: "P22 Parrish Roman,Arial,sans-serif",
                }}
              >
                {"Documentary".toUpperCase()}
              </div>
              <div
                className={`${
                  currentDirection === "y" ? "text-6xl" : "text-3xl"
                }`}
                style={{ fontFamily: "Neue Brucke,Arial,sans-serif" }}
              >
                {"My Project X".toUpperCase()}
              </div>
            </div>
            <div
              className={`${
                currentDirection === "y" ? "text-lg" : "text-base"
              } flex flex-col w-full justify-center items-center`}
              style={{
                fontFamily: "Neue Brucke,Arial,sans-serif",
                lineHeight:
                  currentDirection === "y"
                    ? "calc(var(--text-lg) - 4px)"
                    : "calc(var(--text-base) - 4px)",
                verticalAlign: "center",
              }}
            >
              <div className="flex border-t border-white items-center justify-center gap-16 px-4 w-full">
                <div>YEAR</div>
                <div>2024</div>
              </div>
              <div className="flex border-t border-white items-center justify-center  gap-8 px-6 w-full">
                <div>LOCATION</div>
                <div>TEL AVIV</div>
              </div>
              <div className="flex border-t border-white border-b items-center justify-center gap-12 px-2 w-full">
                <div>CATEGORY</div>
                <div>DOCUMENTARY</div>
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
        key={item.id + index}
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

  return (
    <div
      ref={scrollWrapper}
      className={`bg-black flex flex-col gap-8 select-none h-[100dvh] w-full overflow-hidden relative after:absolute after:inset-0 after:pointer-events-none after:z-10  ${
        currentDirection === "y"
          ? "after:bg-[linear-gradient(#000_0%,transparent_10%,transparent_90%,#000_100%)]"
          : "after:bg-[linear-gradient(to_right,#000_0%,transparent_10%,transparent_90%,#000_100%)] py-12"
      }`}
    >
      {cursor}
      {currentDirection === "x" && init && (
        <Tabs
          defaultValue="tab-1"
          className="self-center dark z-20"
          value={tabValue}
          onValueChange={(value) => {
            setTabValue(value);
            if (value === "singleScroll") {
              if (tabValue === "singleScroll") return;
              switchToItemWithEffect(getIdFromKey(currentReadPhotoId));
              setCurrentReadPhotoId("");
              setRepeatCount(5);
            }
            if (value === "dualScroll") {
              if (tabValue === "dualScroll") return;
              setCurrentReadPhotoId(
                Array.from({ length: repeatCount }, (_, i) => data).flat()[
                  currentIndex
                ].id +
                  "-" +
                  currentIndex
              );
              setRepeatCount(25);
            }
          }}
        >
          <TabsList>
            <TabsTrigger value="singleScroll">
              <div
                className={`w-6 h-8 overflow-hidden flex justify-center items-center relative after:absolute after:inset-0 after:pointer-events-none after:z-10 after:transition-all ${
                  tabValue === "singleScroll"
                    ? "after:bg-[linear-gradient(to_right,#0a0a0a_0%,transparent_20%,transparent_80%,#0a0a0a_100%)]"
                    : "after:bg-[linear-gradient(to_right,#262626_0%,transparent_20%,transparent_80%,#262626_100%)]"
                }`}
              >
                <SvgIcon
                  path={"/siena/singleScroll.svg"}
                  className="w-8 h-8"
                ></SvgIcon>
              </div>
            </TabsTrigger>
            <TabsTrigger value="dualScroll">
              <div
                className={`w-6 h-8 overflow-hidden flex justify-center items-center relative after:absolute after:inset-0 after:pointer-events-none after:z-10 after:transition-all ${
                  tabValue === "dualScroll"
                    ? "after:bg-[linear-gradient(to_right,#0a0a0a_0%,transparent_30%,transparent_70%,#0a0a0a_100%)]"
                    : "after:bg-[linear-gradient(to_right,#262626_0%,transparent_30%,transparent_70%,#262626_100%)]"
                }`}
              >
                <SvgIcon
                  path={"/siena/dualScroll.svg"}
                  className="w-8 h-8"
                ></SvgIcon>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      {!currentReadPhotoId && (
        <div
          className={`flex  ${
            currentDirection === "y"
              ? "h-fit w-full px-[4%] flex-col z-[0!important] items-center justify-center gap-8"
              : "h-full w-fit z-[0!important] items-center justify-center gap-8"
          } `}
          ref={(el) => {
            if (!currentReadPhotoId) {
              scrollContainer.current = el;
            }
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
                key={item.id + index}
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
                  <div className="absolute bottom-8 right-8">
                    <InteractiveHoverButton
                      className="text-xl w-48"
                      text="Explore"
                      defaultColor="bg-transparent"
                      hoverColor="white"
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
      {currentReadPhotoId && (
        <div className="absolute h-20 w-[50dvw] flex bottom-8 translate-0 left-16 z-20">
          {photoItem(
            data.find(
              (item: any) => item.id === getIdFromKey(currentReadPhotoId)
            ),
            0,
            "small"
          )}
        </div>
      )}
      {currentReadPhotoId && (
        <div
          className="h-full w-fit flex flex-col gap-8 overflow-hidden m-12 rounded-lg"
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
              getCurrentReadPhotoChildren("front")
            )
              .flat()
              .map((item: any, index) => daulScrollItem(item, index))}
          </div>
        </div>
      )}

      {currentDirection === "x" && init && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] scale-x-20 bg-white z-10"></div>
          <div className="w-full px-16 flex justify-between items-center relative">
            <div className="flex:1"></div>
            <div className="flex gap-2 items-end h-fit absolute top-1/2 left-1/2 -translate-1/2 z-20">
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
              className="text-xl w-48 z-20"
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
