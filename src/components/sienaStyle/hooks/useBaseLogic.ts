import { scaleNumber } from "@/utils/convention";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { InertiaPlugin } from "gsap/all";

export default function useBaseLogic(props: any) {
  const gap = 32;
  const [init, setInit] = useState(false);
  const lastSpeed = useRef<any>(0);
  const resizeAntiShake = useRef<NodeJS.Timeout | null>(null);
  const dualScrollRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentReadPhotoId, setCurrentReadPhotoId] = useState("");
  const [data, setData] = useState([
    {
      id: "1",
      img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/675eb903f604a7a856c87467_taboo.webp",
      children: [
        {
          id: "1.1",
          img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/675eb903f604a7a856c87467_taboo.webp",
        },
        {
          id: "1.2",
          img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c551123732db723b050_ana.jpg",
        },
        {
          id: "1.3",
          img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c37a45465ae82ee3f8b_kafka.jpg",
        },
        {
          id: "1.4",
          img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/675eb903f604a7a856c87467_taboo.webp",
        },
        {
          id: "1.5",
          img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c37a45465ae82ee3f8b_kafka.jpg",
        },
        {
          id: "1.6",
          img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c551123732db723b050_ana.jpg",
        },
      ],
    },
    {
      id: "2",
      img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c551123732db723b050_ana.jpg",
      children: [
        {
          id: "2.1",
          img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/675eb903f604a7a856c87467_taboo.webp",
        },
        {
          id: "2.2",
          img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c551123732db723b050_ana.jpg",
        },
        {
          id: "2.3",
          img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c37a45465ae82ee3f8b_kafka.jpg",
        },
      ],
    },
    {
      id: "3",
      img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c37a45465ae82ee3f8b_kafka.jpg",
      children: [
        {
          id: "3.1",
          img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/675eb903f604a7a856c87467_taboo.webp",
        },
        {
          id: "3.2",
          img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c551123732db723b050_ana.jpg",
        },
        {
          id: "3.3",
          img: "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c37a45465ae82ee3f8b_kafka.jpg",
        },
      ],
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexWatcher = useRef<any>(null);
  const loop = useRef<(...params: any) => any>(function () {});
  const [snap, setSnap] = useState<number[]>([]);
  const scrollWrapper = useRef<HTMLDivElement>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);
  const scrollContainerItems = useRef<HTMLDivElement[]>([]);
  const imgeContainerItems = useRef<(HTMLImageElement | null)[]>([]);
  const [currentDirection, setCurrentDirection] = useState<"y" | "x">("x");
  const [repeatCount, setRepeatCount] = useState(5);
  const computedImgOffset = useRef<
    (offset: number, animateType?: "set" | "to") => void
  >(() => {});

  const computedItemOffset = useRef<
    (offset: number, animateType?: "set" | "to") => void
  >(() => {});
  useEffect(() => {
    setInit(false);
    gsap.set(scrollContainer.current, {
      x: 0,
      y: 0,
    });
    clearItemEffect();
  }, [currentDirection]);

  useEffect(() => {
    const _data = currentReadPhotoId
      ? getCurrentReadPhotoChildren("front")
      : data;
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
      const itemCount = _data.length * repeatCount;
      const _snap = Array.from(
        { length: itemCount },
        (_, i) => -i * (itemSize + gap) + (wrapperSize / 2 - itemSize / 2)
      );
      setSnap(_snap);

      // img静止
      computedImgOffset.current = (
        offset: number,
        animateType: "set" | "to" = "set"
      ) => {
        if (currentDirection === "y") {
          for (let i = 0; i < _snap.length; i++) {
            const imgEl = imgeContainerItems.current[i];
            if (!imgEl) continue;
            const changeOffset =
              ((_snap[i] - offset) * 3 * imageSize) / scrollContainerSize;
            const maxChangeOffset = (imageSize - itemSize) / 2;
            gsap[animateType](imgEl, {
              [currentDirection]:
                changeOffset < -maxChangeOffset
                  ? -maxChangeOffset
                  : changeOffset,
            });
          }
        }
      };

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
        const maxBlur = 30;
        const minBlur = 0;
        const maxBrightnessMinus = 2;
        const minBrightnessMinus = 0;

        if (currentReadPhotoId) {
        } else {
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

            gsap[animateType](scrollItem, {
              filter: `blur(${blur}px) brightness(${1 - brightness})`,
            });
          }
        }
      };

      loop.current = function (offset: any) {
        let _offset =
          (parseFloat(offset) % ((gap + itemSize) * _data.length)) -
          (gap + itemSize) * _data.length;
        switchToItemWithEffect(null, null, _offset);
        return _offset;
      };
      return _snap;
    };
    const resizeCb = () => {
      resizeAntiShake.current && clearTimeout(resizeAntiShake.current);
      resizeAntiShake.current = setTimeout(() => {
        const _snap = _main() as number[];
        const _offset = +gsap.getProperty(
          scrollContainer.current,
          currentDirection
        );
        gsap.to(scrollContainer.current, {
          [currentDirection]: gsap.utils.snap(_snap, _offset),
        });
        switchToItemWithEffect(null, null, _offset, "to");
      }, 500);
    };

    const _snap: any = _main();

    for (let i = 0; i < initEffect.current.length; i++) {
      initEffect.current.pop()({ snap: _snap, repeatCount });
    }

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
    const _init = () => {
      scrollOffset %= -_snap[_snap.length - _data.length];
      gsap.set(scrollContainer.current, {
        [currentDirection]: -scrollOffset,
      });
      scrollContainerItems.current.forEach((item) => {
        gsap.set(item, {
          filter: `brightness(${brightness}) saturate(${brightness / 3}) blur(${
            5 + brightness / 2
          }px)`,
        });
      });

      scrollOffset += velosity;
    };
    !init &&
      gsap.set(scrollContainer.current, {
        [currentDirection]: _snap[Math.ceil(_snap.length / 2) - 1],
      });
    !init &&
      gsap
        .to(
          {},
          {
            duration: 2,
            ease: "power1.inOut",
            onUpdate() {
              velosity *= 1.003;
              brightness *= 1.02;
              _init();
            },
            onComplete() {
              gsap.to(scrollContainer.current, {
                [currentDirection]: _snap[Math.ceil(_snap.length / 2) - 1],
                filter: `brightness(1)`,
              });

              if (currentDirection === "y") {
                scrollContainerItems.current.forEach((item) => {
                  gsap.to(item, {
                    filter: `unset`,
                  });
                });
              } else {
                switchToItemWithEffect(
                  null,
                  null,
                  _snap[Math.ceil(_snap.length / 2) - 1]
                );
              }
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
  }, [currentDirection, currentReadPhotoId, repeatCount, init]);

  const generateKey = (id: string, index: any) => {
    return id + "-" + index;
  };
  const getIdFromKey = (key: string) => {
    return key.split("-")[0];
  };

  const initEffect = useRef<any[]>([]);
  const switchToItemWithEffect = (
    id?: string | null,
    index?: number | null,
    offset?: number | null,
    animateType: "to" | "set" = "set"
  ) => {
    if (!id && !index && !offset) return;
    if (id || index) {
      if (id) {
        index =
          (data.findIndex((item) => item.id === id) as number) +
          Math.floor(repeatCount / 2) * data.length;
      }
      offset = snap[index as number] as number;
      gsap[animateType](scrollContainer.current, {
        [currentDirection]: offset,
      });
      initEffect.current.push((props: { snap: any; repeatCount: number }) => {
        if (id) {
          index =
            (data.findIndex((item) => item.id === id) as number) +
            Math.floor(props.repeatCount / 2) * data.length;
        }
        offset = props.snap[index as number] as number;
        gsap[animateType](scrollContainer.current, {
          [currentDirection]: offset,
        });
        computedItemOffset.current(offset, animateType);
        if (currentDirection === "y") {
          computedImgOffset.current(offset, animateType);
        }
      });
    }

    const _offset = offset as number;
    computedItemOffset.current(_offset, animateType);
    if (currentDirection === "y") {
      computedImgOffset.current(_offset, animateType);
    }
  };
  const clearItemEffect = () => {
    for (let i = 0; i < imgeContainerItems.current.length; i++) {
      gsap.set(imgeContainerItems.current[i], {
        transform: "translate(-50%,-50%)",
        filter: "unset",
      });
      gsap.set(scrollContainerItems.current[i], {
        filter: "unset",
      });
    }
  };

  const getCurrentReadPhotoChildren = (
    type: "all" | "front" | "back" = "all"
  ) => {
    const arr = data.find(
      (item: any) => item.id === getIdFromKey(currentReadPhotoId)
    )!.children;
    return type === "front"
      ? arr.slice(0, Math.ceil(arr.length / 2))
      : type === "back"
      ? arr.slice(Math.ceil(arr.length / 2), arr.length)
      : arr;
  };

  return {
    init,
    currentDirection,
    scrollContainerItems,
    currentReadPhotoId,
    dualScrollRef,
    snap,
    switchToItemWithEffect,
    scrollContainer,
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
  };
}
