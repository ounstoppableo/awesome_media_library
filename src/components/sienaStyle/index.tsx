import { JSX, use, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable, InertiaPlugin } from "gsap/all";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SvgIcon from "../svgIcon";
import useWheelLogic from "./hooks/useWheelLogic";
import useBaseLogic from "./hooks/useBaseLogic";
import useDraggableLogic from "./hooks/useDraggableLogic";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSienaLoading } from "@/store/loading/loading-slice";
import {
  selectTaojimaControlOpenStatus,
  setOpen as setTaotajimaOpen,
} from "@/store/taotajimaControl/taotajima-slice";
import ContentInsufficient from "../contentInsufficient";
import dayjs from "dayjs";
import PhotoItem from "./components/photoItem";
import Coordiation from "./components/coordiation";
import DaulScrollItem from "./components/daulScrollItem";
import Cursor from "../cursor";
import { AnimatePresence, motion } from "motion/react";

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
    imageContainerItems,
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

  const {
    cursorVisible,
    form,
    setForm,
    handleChangeCurrent,
    handleControlCursor,
    setCursorVisible,
  } = useDraggableLogic({
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
    cb();
    window.addEventListener("resize", cb);
    return () => {
      window.removeEventListener("resize", cb);
    };
  }, [currentDirection]);

  const taotajimaOpenStatus = useAppSelector(selectTaojimaControlOpenStatus);
  const handleExplore = (info: any) => {
    dispatch(setTaotajimaOpen({ open: true, id: info.id }));
  };

  const toggleToHorizontal = () => {
    setCurrentDirection("x");
    switchToItemWithEffect(getIdFromKey(currentReadPhotoId));
    setCurrentReadPhotoId("");
    setRepeatCount(5);
  };

  return (
    <>
      <div className="absolute inset-0">
        <Cursor
          currentDirection={currentDirection}
          form={form}
          setForm={setForm}
          cursorVisible={cursorVisible}
        ></Cursor>
      </div>
      <div
        ref={scrollWrapper}
        className={`bg-black flex flex-col gap-[4vmin] select-none h-[100dvh] w-full overflow-hidden relative after:absolute after:inset-0 after:pointer-events-none after:z-10  ${
          currentDirection === "y"
            ? "after:bg-[linear-gradient(#000_0%,transparent_10%,transparent_90%,#000_100%)]"
            : "after:bg-[linear-gradient(to_right,#000_0%,transparent_10%,transparent_90%,#000_100%)] py-[6vmin]"
        }`}
      >
        <AnimatePresence>
          {init && currentDirection === "x" && (
            <motion.div
              initial={{ opacity: 0, y: "-100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={clsx(["self-center dark z-20"])}
            >
              <Tabs
                defaultValue="tab-1"
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
                        Array.from(
                          { length: repeatCount },
                          (_, i) => data,
                        ).flat()[currentIndex].id as any,
                        currentIndex,
                      ),
                    );
                    setRepeatCount(
                      Math.floor(
                        (5 * innerWidth) /
                          scrollContainerItems.current[0].offsetWidth,
                      ),
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
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {init && (!currentReadPhotoId as any) && (
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={() => {
                setCurrentDirection(currentDirection === "y" ? "x" : "y");
              }}
              className="absolute top-[6vmin] left-[8vmin] text-white text-[4vmin] leading-[4vmin] font-semibold cursor-pointer z-20 [@media(min-aspect-ratio:1.4/1)]:flex hidden flex-col gap-[1vmin]"
            >
              {(currentDirection === "y"
                ? "vertical"
                : "horizontal"
              ).toUpperCase()}
              <div
                className="text-[2vmin] leading-[2vmin] font-thin w-full"
                style={{ textAlign: "justify", textAlignLast: "justify" }}
              >
                C l i c k T o T o g g l e
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    key={generateKey(item.id as string, index)}
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
                            : "",
                      )
                    }
                  >
                    <PhotoItem
                      ref={imageContainerItems}
                      currentDirection={currentDirection}
                      init={init}
                      info={item}
                      index={index}
                      type={"default"}
                    ></PhotoItem>
                    {currentDirection === "y" && init && (
                      <div className="absolute bottom-[6vmin] right-[8vmin] z-20">
                        <InteractiveHoverButton
                          className="text-xl w-[32vmin] h-[7vmin]"
                          text="Explore"
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
        {currentReadPhotoId ? (
          (
            data.find(
              (item: any) => item.id + "" === getIdFromKey(currentReadPhotoId),
            ) as any
          )?.children?.length >= 3 ? (
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
                  getCurrentReadPhotoChildren("front"),
                )
                  .flat()
                  .map((item: any, index) => (
                    <DaulScrollItem
                      key={generateKey(item.id, index)}
                      info={item}
                      index={index}
                      currentReadPhotoId={currentReadPhotoId}
                      scrollContainerItems={scrollContainerItems}
                      imageContainerItems={imageContainerItems}
                      generateKey={generateKey}
                    ></DaulScrollItem>
                  ))}
              </div>
              <div
                ref={(el) => {
                  dualScrollRef.current[1] = el;
                }}
                className="w-fit flex-1 flex gap-8 overflow-hidden"
              >
                {Array.from({ length: repeatCount }, (_, i) =>
                  getCurrentReadPhotoChildren("back"),
                )
                  .flat()
                  .map((item: any, index) => (
                    <DaulScrollItem
                      key={generateKey(item.id, index)}
                      info={item}
                      index={index}
                      currentReadPhotoId={currentReadPhotoId}
                      scrollContainerItems={scrollContainerItems}
                      imageContainerItems={imageContainerItems}
                      generateKey={generateKey}
                    ></DaulScrollItem>
                  ))}
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

        <AnimatePresence>
          {init && currentDirection === "x" && (
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute h-[10vmin] flex w-[50dvw] z-20 transition ease-in-out bottom-[6vmin] left-[8vmin] translate-0 gap-[2vmin]"
            >
              <PhotoItem
                ref={imageContainerItems}
                currentDirection={currentDirection}
                init={init}
                info={
                  data.find(
                    (item: any) => item.id === getIdFromKey(currentReadPhotoId),
                  ) ||
                  Array.from({ length: repeatCount }, (_, i) => data).flat()[
                    currentIndex
                  ]
                }
                index={0}
                type={"small"}
              ></PhotoItem>
            </motion.div>
          )}
        </AnimatePresence>

        {currentDirection === "x" && init && (
          <>
            <Coordiation
              currentDirection={currentDirection}
              init={init}
              odometer={odometer}
            ></Coordiation>
            <div className="absolute bottom-[6vmin] right-[8vmin]">
              <InteractiveHoverButton
                className="text-xl w-[24vmin] h-[6vmin] z-20"
                text="Explore"
                onClick={() =>
                  handleExplore(
                    data.find(
                      (item: any) =>
                        item.id === getIdFromKey(currentReadPhotoId),
                    ) ||
                      Array.from(
                        { length: repeatCount },
                        (_, i) => data,
                      ).flat()[currentIndex],
                  )
                }
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
