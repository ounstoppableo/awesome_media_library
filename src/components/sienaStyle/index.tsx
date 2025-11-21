import { JSX, use, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable, InertiaPlugin } from "gsap/all";
import useMoveCursor from "@/hooks/useMoveCursor";
import { scaleNumber } from "@/utils/convention";
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

  const currentIndexWatcher = useRef<any>(null);

  useEffect(() => {
    offsetSetter.current = gsap.quickSetter(
      scrollContainer.current,
      currentDirection,
      "px"
    );
  }, [currentDirection]);

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

      const itemCount = data.length * 3;
      const _snap = Array.from(
        { length: itemCount },
        (_, i) => -i * (gap + itemSize) + (wrapperSize / 2 - itemSize / 2 - gap)
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
        const snapGap = Math.abs(_snap[1] - _snap[0]);
        const speed = InertiaPlugin.getVelocity(
          scrollContainer.current!,
          currentDirection
        );
        const maxSpeed = 5000;
        const minSpeed = 0;
        const maxLeapOffset = 100;
        const minLeapOffset = 0;
        const maxBlur = 5;
        const minBlur = 1;
        const maxBrightnessMinus = 0.2;
        const minBrightnessMinus = 0;
        const minGap = 0;
        const maxGap = gap * 6;

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

          const _gap = scaleNumber(
            (Math.abs(speed) > maxSpeed ? maxSpeed : Math.abs(speed)) *
              (offset - _snap[i]),
            0,
            snapGap,
            0,
            maxGap
          );

          // gsap.set(scrollItem, {
          //   [currentDirection]: _gap / maxSpeed,
          // });
          gsap[animateType](scrollItem, {
            filter: `blur(${blur}px) brightness(${1 - brightness})`,
          });
        }
      };

      loop.current = function (this: any) {
        let _offset = +gsap.getProperty(
          scrollContainer.current,
          currentDirection
        );
        if (_offset <= _snap[_snap.length - data.length]) {
          _offset = _offset + (gap + itemSize) * data.length;
          offsetSetter.current(_offset);
          computedImgOffset.current(_offset);
          computedItemOffset.current(_offset);
          this.update?.();
          return;
        }
        if (_offset >= _snap[data.length - 1]) {
          _offset = _offset - (gap + itemSize) * data.length;
          offsetSetter.current(_offset);
          computedImgOffset.current(_offset);
          computedItemOffset.current(_offset);
          this.update?.();
          return;
        }
        computedImgOffset.current(_offset);
        computedItemOffset.current(_offset);
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
    let blur = 1;
    let scrollOffset = 0;
    const init = () => {
      scrollOffset %= -_snap[_snap.length - data.length];
      gsap.set(scrollContainer.current, {
        [currentDirection]: -scrollOffset,
        filter: `brightness(${brightness}) saturate(${
          brightness / 3
        }) blur(${blur}px)`,
      });
      scrollOffset += velosity;
    };
    gsap.to(
      {},
      {
        duration: 2,
        ease: "power1.inOut",
        onUpdate() {
          velosity *= 1.003;
          brightness *= 1.02;
          blur *= 1.02;
          init();
        },
        onComplete() {
          gsap.to(scrollContainer.current, {
            [currentDirection]: _snap[Math.ceil(_snap.length / 2) - 1],
            filter: `brightness(1)`,
          });
        },
      }
    );

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
      offset +=
        (Math.abs(itemSize - offset) *
          e["delta" + currentDirection.toLocaleUpperCase()]) /
        500;
      if (e["delta" + currentDirection.toLocaleUpperCase()] > 0) {
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
    dragInst.current = Draggable.create(scrollContainer.current, {
      type: currentDirection,
      inertia: true,
      cursor: "grab",
      activeCursor: "grabbing",
      allowEventDefault: false,

      onDrag: function () {
        loop.current.call(this);
      },
      onThrowUpdate: function () {
        loop.current.call(this);
      },
      snap: { [currentDirection]: snap },
    });
    return () => {
      dragInst.current[0].kill();
    };
  }, [snap, currentDirection]);

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
        loop.current.call({
          [currentDirection]: offset,
          target: scrollContainer.current,
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
        loop.current.call({
          [currentDirection]: offset,
          target: scrollContainer.current,
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
      className={`bg-black h-[100dvh] w-full overflow-hidden relative after:absolute after:inset-0 after:pointer-events-none after:z-10 ${
        currentDirection === "y"
          ? "after:bg-[linear-gradient(#000_0%,transparent_10%,transparent_90%,#000_100%)"
          : "after:bg-[linear-gradient(to right,#000_0%,transparent_10%,transparent_90%,#000_100%)"
      }]`}
    >
      {cursor}
      <div
        className={`${
          currentDirection === "y" ? "h-fit w-full" : "h-full w-fit"
        }  flex items-center justify-center px-[4%] ${
          currentDirection === "y" ? "flex-col" : ""
        } gap-8`}
        style={{
          paddingTop: "calc(var(--spacing) * 8)",
          paddingBottom: "calc(var(--spacing) * 8)",
        }}
        ref={scrollContainer}
      >
        {[...data, ...data, ...data].map((item, index) => (
          <div
            className={`${
              currentDirection === "y"
                ? "h-[70dvh] w-full"
                : "h-[60dvh] aspect-[3/4]"
            }  rounded-4xl flex justify-center items-center text-4xl overflow-hidden`}
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
                currentIndex > index ? "down" : currentIndex < index ? "up" : ""
              )
            }
          >
            <div className="h-full w-full overflow-hidden relative select-none">
              <img
                src={item.img}
                className={`${
                  currentDirection === "y" ? "w-[100vw] h-fit" : "w-fit h-full"
                } object-cover absolute top-1/2 left-1/2 -translate-1/2 select-none`}
                ref={(el) => {
                  imgeContainerItems.current[index] = el;
                }}
              ></img>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
