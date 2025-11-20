import { JSX, use, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable, InertiaPlugin } from "gsap/all";
import useMoveCursor from "@/hooks/useMoveCursor";
gsap.registerPlugin(Draggable, InertiaPlugin);

export default function SienaStyle({}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  const scrollWrapper = useRef<HTMLDivElement>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);
  const scrollContainerItems = useRef<HTMLDivElement[]>([]);
  const imgeContainerItems = useRef<(HTMLImageElement | null)[]>([]);
  const computedImgOffset = useRef<(y: number) => void>(() => {});
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
  const ySetter = useRef<any>(null);

  const currentIndexWatcher = useRef<any>(null);

  useEffect(() => {
    ySetter.current = gsap.quickSetter(scrollContainer.current, "y", "px");
    const _main = () => {
      if (
        scrollWrapper.current === null ||
        scrollContainerItems.current[0] === null ||
        scrollContainer.current === null ||
        imgeContainerItems.current[0] === null
      )
        return;
      const wrapperHeight = scrollWrapper.current.offsetHeight;
      const itemHeight = scrollContainerItems.current[0].offsetHeight;
      const imageHeight = imgeContainerItems.current[0].offsetHeight;
      const maxScroll =
        scrollContainer.current.scrollHeight -
        scrollWrapper.current.offsetHeight;
      const itemCount = data.length * 3;
      const _snap = Array.from(
        { length: itemCount },
        (_, i) =>
          -i * (gap + itemHeight) + (wrapperHeight / 2 - itemHeight / 2 - gap)
      );
      setSnap(_snap);

      ySetter.current(_snap[Math.ceil(_snap.length / 2) - 1]);
      // img静止
      computedImgOffset.current = (y: number) => {
        for (let i = 0; i < _snap.length; i++) {
          const imgEl = imgeContainerItems.current[i];
          if (!imgEl) continue;
          const changeY =
            ((y - _snap[i]) * imageHeight) / scrollContainerHeight;
          const maxChangeY = (imageHeight - itemHeight) / 2;
          gsap.set(imgEl, {
            y: changeY < -maxChangeY ? -maxChangeY : changeY,
          });
        }
      };

      loop.current = function (this: any) {
        // 无限loop
        let _y = this.y;
        if (this.y <= _snap[_snap.length - data.length]) {
          _y = this.y + (gap + itemHeight) * data.length;
          ySetter.current(_y);
          computedImgOffset.current(_y);
          return;
        }
        if (this.y >= _snap[data.length - 1]) {
          _y = this.y - (gap + itemHeight) * data.length;
          ySetter.current(_y);
          computedImgOffset.current(_y);

          return;
        }
        computedImgOffset.current(_y);
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
    const scrollContainerHeight: number = scrollContainer.current!.offsetHeight;
    const itemHeight = scrollContainerItems.current[0]!.offsetHeight;
    let velosity = itemHeight;
    let brightness = 1;
    let blur = 1;
    const init = () => {
      scrollY %= -_snap[_snap.length - data.length];
      gsap.set(scrollContainer.current, {
        y: -scrollY,
        filter: `brightness(${brightness}) saturate(${
          brightness / 3
        }) blur(${blur}px)`,
      });
      scrollY += velosity;
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
            y: _snap[Math.ceil(_snap.length / 2) - 1],
            filter: `brightness(1)`,
          });
        },
      }
    );

    window.addEventListener("resize", resizeCb);

    return () => {
      window.removeEventListener("resize", resizeCb);
    };
  }, []);

  useEffect(() => {
    // 控制滚轮事件
    let wheelTimer: any = null;
    let offset = 0;
    const itemHeight = scrollContainerItems.current[0].offsetHeight;
    const wheelCb = (e: any) => {
      // offset越靠近itemHeight，速度越慢
      offset += (Math.abs(itemHeight - offset) * e.deltaY) / 500;
      if (e.deltaY > 0) {
        offset = offset >= itemHeight / 2 ? itemHeight / 2 : offset;
      } else {
        offset = offset <= -itemHeight / 2 ? -itemHeight / 2 : offset;
      }

      const currentY = +gsap.getProperty(scrollContainer.current, "y");
      const targetY = gsap.utils.snap(snap, currentY) + offset;
      gsap.to(scrollContainer.current, {
        y: targetY,
      });
      computedImgOffset.current(targetY);
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        offset = 0;
        const targetY = gsap.utils.snap(
          snap,
          +gsap.getProperty(scrollContainer.current, "y")
        );
        gsap.to(scrollContainer.current, {
          y: targetY,
        });
        computedImgOffset.current(targetY);
      }, 100);
    };
    window.addEventListener("wheel", wheelCb);
    return () => {
      window.removeEventListener("wheel", wheelCb);
    };
  }, [snap]);

  const dragInst = useRef<any>(null);
  useEffect(() => {
    dragInst.current = Draggable.create(scrollContainer.current, {
      type: "y",
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
      snap: { y: snap },
    });
    return () => {
      dragInst.current[0].kill();
    };
  }, [snap]);

  const { cursor, setForm } = useMoveCursor();

  // 控制cursor状态
  const handleControlCursor = (index: number) => {
    if (index < currentIndex) {
      setForm("up");
    }
    if (index > currentIndex) {
      setForm("down");
    }
    if (index === currentIndex) {
      setForm("default");
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
      y: snap[type === "down" ? currentIndex - 1 : currentIndex + 1],
      onUpdate: () => {
        const y = gsap.getProperty(scrollContainer.current, "y");
        loop.current.call({ y, target: scrollContainer.current });
        handleControlCursor(
          type === "down" ? currentIndex - 1 : currentIndex + 1
        );
      },
      onComplete: () => {
        const y = gsap.getProperty(scrollContainer.current, "y");
        loop.current.call({ y, target: scrollContainer.current });
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
      const y = +gsap.getProperty(scrollContainer.current, "y");
      setCurrentIndex(
        snap.findIndex((item) => item === gsap.utils.snap(snap, y))
      );
    }, 16);
    return () => {
      clearInterval(currentIndexWatcher.current);
    };
  }, [snap]);
  return (
    <div
      ref={scrollWrapper}
      className="bg-black h-[100dvh] w-full overflow-hidden relative"
    >
      {cursor}
      <div
        className="h-fit w-full flex items-center justify-center px-[4%] flex-col gap-8"
        style={{
          paddingTop: "calc(var(--spacing) * 8)",
          paddingBottom: "calc(var(--spacing) * 8)",
        }}
        ref={scrollContainer}
      >
        {[...data, ...data, ...data].map((item, index) => (
          <div
            className="h-[60dvh] w-full rounded-4xl flex justify-center items-center text-4xl overflow-hidden"
            key={index}
            ref={(el: any) => {
              scrollContainerItems.current[index] = el;
            }}
            onMouseEnter={(e) => {
              handleControlCursor(index);
            }}
            onMouseLeave={(e) => {
              handleControlCursor(index);
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
                className="w-[100vw] h-fit object-cover absolute top-1/2 left-1/2 -translate-1/2 select-none"
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
