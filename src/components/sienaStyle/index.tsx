import { JSX, use, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable, InertiaPlugin } from "gsap/all";
import useMoveCursor from "@/hooks/useMoveCursor";
import { scaleNumber } from "@/utils/convention";
import { createDraggable } from "animejs";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SvgIcon from "../svgIcon";
gsap.registerPlugin(Draggable, InertiaPlugin);

export default function SienaStyle({}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  const scrollWrapper = useRef<HTMLDivElement>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);
  const scrollContainerItems = useRef<HTMLDivElement[]>([]);
  const imgeContainerItems = useRef<(HTMLImageElement | null)[]>([]);
  const computedImgOffset = useRef<
    (offset: number, animateType?: "set" | "to") => void
  >(() => {});
  const [currentDirection, setCurrentDirection] = useState<"y" | "x">("x");
  const computedItemOffset = useRef<
    (offset: number, animateType?: "set" | "to") => void
  >(() => {});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState([
    {
      img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/675eb903f604a7a856c87467_taboo.webp",
    },
    {
      img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c551123732db723b050_ana.jpg",
    },
    {
      img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c37a45465ae82ee3f8b_kafka.jpg",
    },
  ]);
  const loop = useRef<(...params: any) => any>(function () {});
  const [snap, setSnap] = useState<number[]>([]);
  const resizeAntiShake = useRef<NodeJS.Timeout | null>(null);
  const gap = 32;
  const offsetSetter = useRef<any>(null);
  const [init, setInit] = useState(false);
  const [repeatCount, setRepeatCount] = useState(5);
  const [tabValue, setTabValue] = useState("singleScroll");

  const currentIndexWatcher = useRef<any>(null);

  useEffect(() => {
    offsetSetter.current = gsap.quickSetter(
      scrollContainer.current,
      currentDirection,
      "px"
    );
  }, [currentDirection]);
  const lastSpeed = useRef<any>(0);
  useEffect(() => {
    const _main = () => {
      if (
        scrollWrapper.current === null ||
        scrollContainerItems.current[0] === null ||
        scrollContainer.current === null ||
        imgeContainerItems.current[0] === null
      )
        return;
      const wrapperSize =
        currentDirection === "y"
          ? scrollWrapper.current.offsetHeight
          : scrollWrapper.current.offsetWidth;
      const itemSize =
        currentDirection === "y"
          ? scrollContainerItems.current[0].offsetHeight
          : scrollContainerItems.current[0].offsetWidth;
      const imageSize =
        currentDirection === "y"
          ? imgeContainerItems.current[0].offsetHeight
          : imgeContainerItems.current[0].offsetWidth;
      const itemCount = data.length * repeatCount;
      const _snap = Array.from(
        { length: itemCount },
        (_, i) => -i * (itemSize + gap) + (wrapperSize / 2 - itemSize / 2)
      );
      setSnap(_snap);

      offsetSetter.current(_snap[Math.ceil(_snap.length / 2) - 1]);
      // img静止
      computedImgOffset.current =
        currentDirection === "y"
          ? (offset: number, animateType: "set" | "to" = "set") => {
              for (let i = 0; i < _snap.length; i++) {
                const imgEl = imgeContainerItems.current[i];
                if (!imgEl) continue;
                const changeOffset =
                  ((_snap[i] - offset) * 2 * imageSize) / scrollContainerSize;
                const maxChangeOffset = (imageSize - itemSize) / 2;
                gsap[animateType](imgEl, {
                  [currentDirection]:
                    changeOffset < -maxChangeOffset
                      ? -maxChangeOffset
                      : changeOffset,
                });
              }
            }
          : () => {};

      computedItemOffset.current = (offset: number, animateType = "set") => {
        if (currentDirection === "y") return;
        const snapGap = Math.abs(_snap[0] - _snap[_snap.length - 1]);
        const _speed =
          InertiaPlugin.getVelocity(
            scrollContainer.current!,
            currentDirection
          ) || 0;
        const speed = gsap.utils.interpolate(lastSpeed.current, _speed, 0.1);
        lastSpeed.current = speed;
        const maxSpeed = 5000;
        const minSpeed = 0;
        const maxLeapOffset = 100;
        const minLeapOffset = 0;
        const maxBlur = 30;
        const minBlur = 0;
        const maxBrightnessMinus = 2;
        const minBrightnessMinus = 0;
        const maxGap = gap * 150;
        const minScale = 1;
        const maxScale = 1.2;

        for (let i = 0; i < _snap.length; i++) {
          const scrollItem = scrollContainerItems.current[i];
          if (!scrollItem) continue;
          const offsetDiff = Math.abs(_snap[i] - offset);
          const blur = scaleNumber(offsetDiff, 0, snapGap, minBlur, maxBlur);
          const brightness = scaleNumber(
            offsetDiff,
            0,
            snapGap,
            minBrightnessMinus,
            maxBrightnessMinus
          );
          // const _gap = scaleNumber(
          //   Math.abs(speed) > maxSpeed
          //     ? maxSpeed * (offset - _snap[i])
          //     : Math.abs(speed) * (offset - _snap[i]),
          //   0,
          //   snapGap * maxSpeed,
          //   0,
          //   maxGap
          // );

          // const _scale =
          //   scaleNumber(
          //     Math.abs(speed) > maxSpeed ? maxSpeed : Math.abs(speed),
          //     0,
          //     maxSpeed,
          //     minScale,
          //     maxScale
          //   ) || 1;

          // gsap.to(scrollItem, {
          //   [currentDirection]: _gap,
          //   ["scale" + currentDirection.toUpperCase()]:
          //     _scale < minScale ? minScale : _scale,
          // });

          gsap[animateType](scrollItem, {
            filter: `blur(${blur}px) brightness(${1 - brightness})`,
          });
        }
      };

      loop.current = function (offset: any) {
        let _offset =
          (parseFloat(offset) % ((gap + itemSize) * data.length)) -
          (gap + itemSize) * data.length;

        computedItemOffset.current(_offset);
        if (currentDirection === "y") {
          computedImgOffset.current(_offset);
        }
        return _offset;
      };
      return _snap;
    };
    const resizeCb = () => {
      resizeAntiShake.current && clearTimeout(resizeAntiShake.current);
      resizeAntiShake.current = setTimeout(() => {
        _main();
      }, 500);
    };

    const _snap: any = _main();

    // 初始化电影轮播
    const scrollContainerSize: number =
      currentDirection === "y"
        ? scrollContainer.current!.offsetHeight
        : scrollContainer.current!.offsetWidth;
    const itemSize =
      currentDirection === "y"
        ? scrollContainerItems.current[0]!.offsetHeight
        : scrollContainerItems.current[0]!.offsetWidth;
    let velosity = itemSize;
    let brightness = 1;
    let scrollOffset = 0;
    const init = () => {
      scrollOffset %= -_snap[_snap.length - data.length];
      gsap.set(scrollContainer.current, {
        [currentDirection]: -scrollOffset,
        filter: `brightness(${brightness}) saturate(${brightness / 3})`,
      });
      scrollOffset += velosity;
      computedItemOffset.current(scrollOffset);
    };
    gsap
      .to(
        {},
        {
          duration: 2,
          ease: "power1.inOut",
          onUpdate() {
            velosity *= 1.003;
            brightness *= 1.02;
            init();
          },
          onComplete() {
            gsap.to(scrollContainer.current, {
              [currentDirection]: _snap[Math.ceil(_snap.length / 2) - 1],
              filter: `brightness(1)`,
            });
            computedItemOffset.current(_snap[Math.ceil(_snap.length / 2) - 1]);
          },
        }
      )
      .then(() => {
        setInit(true);
      });

    window.addEventListener("resize", resizeCb);

    return () => {
      window.removeEventListener("resize", resizeCb);
    };
  }, [currentDirection]);

  useEffect(() => {
    // 控制滚轮事件
    let wheelTimer: any = null;
    let offset = 0;
    const itemSize =
      currentDirection === "y"
        ? scrollContainerItems.current[0].offsetHeight
        : scrollContainerItems.current[0]!.offsetWidth;
    const wheelCb = (e: any) => {
      // offset越靠近itemSize，速度越慢
      offset += (Math.abs(itemSize - offset) * e["deltaY"]) / 500;
      if (e["deltaY"] > 0) {
        offset = offset >= itemSize / 2 ? itemSize / 2 : offset;
      } else {
        offset = offset <= -itemSize / 2 ? -itemSize / 2 : offset;
      }
      const currentOffset = +gsap.getProperty(
        scrollContainer.current,
        currentDirection
      );
      const targetOffset = gsap.utils.snap(snap, currentOffset) + offset;
      gsap.to(scrollContainer.current, {
        [currentDirection]: targetOffset,
      });
      computedImgOffset.current(targetOffset, "to");
      computedItemOffset.current(targetOffset, "to");
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        offset = 0;
        const targetOffset = gsap.utils.snap(
          snap,
          +gsap.getProperty(scrollContainer.current, currentDirection)
        );
        gsap.to(scrollContainer.current, {
          [currentDirection]: targetOffset,
        });
        computedImgOffset.current(targetOffset, "to");
        computedItemOffset.current(targetOffset, "to");
      }, 100);
    };
    window.addEventListener("wheel", wheelCb);
    return () => {
      window.removeEventListener("wheel", wheelCb);
    };
  }, [snap, currentDirection]);

  const dragInst = useRef<any>(null);
  useEffect(() => {
    if (!init) return;
    dragInst.current = Draggable.create(scrollContainer.current, {
      type: currentDirection,
      cursor: "grab",
      activeCursor: "grabbing",
      allowEventDefault: false,
      inertia: true,
      onDrag: function () {
        computedItemOffset.current(this[currentDirection]);
        if (currentDirection === "y") {
          computedImgOffset.current(this[currentDirection]);
        }
      },
      onThrowUpdate() {
        gsap.set(this.target, {
          [currentDirection]: this[currentDirection],
          modifiers: {
            [currentDirection]: function (offset) {
              return loop.current(offset) + "px";
            },
          },
        });
      },
      snap: { [currentDirection]: snap },
    });
    return () => {
      dragInst.current[0].kill();
    };
  }, [snap, currentDirection, init]);

  const { form, cursor, setForm } = useMoveCursor({ currentDirection });

  // 控制cursor状态
  const handleControlCursor = (index: number) => {
    if (index < currentIndex) {
      setForm("up");
    }
    if (index > currentIndex) {
      setForm("down");
    }
    if (index === currentIndex) {
      setForm(form === "mousedown" ? "mousedown" : "default");
    }
  };
  useEffect(() => {
    handleControlCursor(currentIndex);
  }, [currentIndex]);

  const twine = useRef<any>(null);
  const handleChangeCurrent = (type: "up" | "down" | "") => {
    if (!type) return;
    if (twine.current) return;
    dragInst.current[0].disable();
    twine.current = gsap.to(scrollContainer.current, {
      overwrite: false,
      [currentDirection]:
        snap[type === "down" ? currentIndex - 1 : currentIndex + 1],
      onUpdate: () => {
        const offset = gsap.getProperty(
          scrollContainer.current,
          currentDirection
        );
        gsap.set(scrollContainer.current, {
          [currentDirection]: loop.current(offset),
        });
        handleControlCursor(
          type === "down" ? currentIndex - 1 : currentIndex + 1
        );
      },
      onComplete: () => {
        const offset = gsap.getProperty(
          scrollContainer.current,
          currentDirection
        );
        gsap.set(scrollContainer.current, {
          [currentDirection]: loop.current(offset),
        });
        handleControlCursor(
          type === "down" ? currentIndex - 1 : currentIndex + 1
        );
        dragInst.current[0].enable();
        twine.current = null;
      },
    });
  };

  useEffect(() => {
    currentIndexWatcher.current = setInterval(() => {
      if (scrollContainer.current === null) return;
      const offset = +gsap.getProperty(
        scrollContainer.current,
        currentDirection
      );
      setCurrentIndex(
        snap.findIndex((item) => item === gsap.utils.snap(snap, offset))
      );
    }, 16);
    return () => {
      clearInterval(currentIndexWatcher.current);
    };
  }, [snap]);
  return (
    <div
      ref={scrollWrapper}
      className={`bg-black select-none h-[100dvh] w-full overflow-hidden relative after:absolute after:inset-0 after:pointer-events-none after:z-10 flex flex-col py-16 gap-8 ${
        currentDirection === "y"
          ? "after:bg-[linear-gradient(#000_0%,transparent_10%,transparent_90%,#000_100%)"
          : "after:bg-[linear-gradient(to_right,#000_0%,transparent_10%,transparent_90%,#000_100%)"
      }]`}
    >
      {cursor}
      {currentDirection === "x" && init && (
        <Tabs
          defaultValue="tab-1"
          className="self-center dark z-20"
          value={tabValue}
          onValueChange={(value) => setTabValue(value)}
        >
          <TabsList>
            <TabsTrigger value="singleScroll">
              <div
                className={`w-6 h-8 overflow-hidden flex justify-center items-center ${
                  tabValue === "singleScroll"
                    ? " relative after:absolute after:inset-0 after:pointer-events-none after:z-10 after:bg-[linear-gradient(to_right,#000_0%,transparent_20%,transparent_80%,#000_100%)]"
                    : ""
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
                className={`w-6 h-8 overflow-hidden flex justify-center items-center relative ${
                  tabValue === "dualScroll"
                    ? "relative after:absolute after:inset-0 after:pointer-events-none after:z-10 after:bg-[linear-gradient(to_right,#000_0%,transparent_30%,transparent_70%,#000_100%)]"
                    : ""
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
      <div
        className={`${
          currentDirection === "y" ? "h-fit w-full px-[4%]" : "h-full w-fit"
        }  flex items-center justify-center ${
          currentDirection === "y" ? "flex-col" : ""
        } gap-8 z-[0!important]`}
        ref={scrollContainer}
      >
        {Array.from({ length: repeatCount }, (_, i) => data)
          .flat()
          .map((item, index) => (
            <div
              className={`${
                currentDirection === "y"
                  ? "h-[70dvh] w-full"
                  : "h-[60dvh] aspect-[4/5]"
              } flex justify-center items-center text-4xl relative select-none`}
              key={index}
              ref={(el: any) => {
                scrollContainerItems.current[index] = el;
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
              <div
                className={`h-full w-full overflow-hidden relative select-none rounded-4xl ${
                  currentDirection === "x"
                    ? "after:absolute after:inset-0 after:pointer-events-none after:z-10 after:bg-[linear-gradient(transparent_0%,transparent_50%,#000_100%)]"
                    : ""
                }`}
              >
                <img
                  src={item.img}
                  className={`${
                    currentDirection === "y"
                      ? "w-[100vw] h-fit"
                      : "w-fit h-[100vh]"
                  } object-cover absolute top-1/2 left-1/2 -translate-1/2 select-none`}
                  ref={(el) => {
                    imgeContainerItems.current[index] = el;
                  }}
                ></img>
              </div>
              {init && (
                <div
                  className={`absolute z-10 w-fit h-fit flex flex-col justify-center items-center text-white gap-4 bottom-8 ${
                    currentDirection === "y" ? "left-8" : ""
                  }`}
                >
                  <div
                    className={`flex flex-col justify-center items-center ${
                      currentDirection === "y" ? "gap-4" : "gap-1"
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

      {currentDirection === "x" && init && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] scale-x-20 bg-white z-10"></div>
          <div className="self-end mr-16">
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
