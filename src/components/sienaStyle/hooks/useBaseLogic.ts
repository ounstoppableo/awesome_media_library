import { scaleNumber } from "@/utils/convention";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { InertiaPlugin } from "gsap/all";
import { useGSAP } from "@gsap/react";
import request from "@/utils/fetch";
import { useAppDispatch } from "@/store/hooks";
import { setSienaLoading } from "@/store/loading/loading-slice";
import { CommonResponse } from "@/types/response";
import { codeMap } from "@/utils/backendStatus";
import { CategoryDetail } from "@/types/media";

export default function useBaseLogic(props: any) {
  const gap = 32;
  const [init, setInit] = useState(false);
  const resizeAntiShake = useRef<NodeJS.Timeout | null>(null);
  const dualScrollRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentReadPhotoId, setCurrentReadPhotoId] = useState("");
  const [data, setData] = useState<CategoryDetail[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexWatcher = useRef<any>(null);
  const loop = useRef<(...params: any) => any>(function () {});
  const [snap, setSnap] = useState<number[]>([]);
  const scrollWrapper = useRef<HTMLDivElement>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);
  const scrollContainerItems = useRef<HTMLDivElement[]>([]);
  const imageContainerItems = useRef<(HTMLImageElement | null)[]>([]);
  const [currentDirection, _setCurrentDirection] = useState<"y" | "x">("y");
  const currentDirectionSync = useRef<"y" | "x">("y");
  const setCurrentDirection = (direction: "y" | "x") => {
    _setCurrentDirection(direction);
    currentDirectionSync.current = direction;
  };
  const [repeatCount, setRepeatCount] = useState(3);

  const dispatch = useAppDispatch();
  useEffect(() => {
    request("/api/category/categoryList", { method: "get" }).then(
      (res: CommonResponse) => {
        if (res.code === codeMap.success) {
          setData(res.data);
          dispatch(setSienaLoading({ sienaLoading: false }));
        }
      }
    );
  }, []);

  const computedImgOffset = useRef<
    (offset: number, animateType?: "set" | "to") => void
  >(() => {});

  const computedItemOffset = useRef<
    (offset: number, animateType?: "set" | "to") => void
  >(() => {});
  const { contextSafe } = useGSAP({ scope: scrollWrapper });
  useGSAP(
    () => {
      setInit(false);
      gsap.set(scrollContainer.current, {
        x: 0,
        y: 0,
      });
      clearItemEffect();
    },
    {
      dependencies: [currentDirection],
      scope: scrollWrapper,
      revertOnUpdate: true,
    }
  );

  useGSAP(
    () => {
      if (data.length < 3) return;

      const _twine: any = [];
      const _data = currentReadPhotoId
        ? getCurrentReadPhotoChildren("front")
        : data;
      const _main = () => {
        if (
          scrollWrapper.current === null ||
          scrollContainerItems.current[0] === null ||
          scrollContainer.current === null ||
          imageContainerItems.current[0] === null
        )
          return;
        const wrapperSize =
          currentDirectionSync.current === "y"
            ? scrollWrapper.current.offsetHeight
            : scrollWrapper.current.offsetWidth;
        const itemSize =
          currentDirectionSync.current === "y"
            ? scrollContainerItems.current[0].offsetHeight
            : scrollContainerItems.current[0].offsetWidth;
        const imageSize =
          currentDirectionSync.current === "y"
            ? imageContainerItems.current[0].offsetHeight
            : imageContainerItems.current[0].offsetWidth;
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
          if (currentDirectionSync.current === "y") {
            for (let i = 0; i < _snap.length; i++) {
              const imgEl = imageContainerItems.current[i];
              if (!imgEl) continue;
              const changeOffset =
                ((_snap[i] - offset) * 3 * imageSize) / scrollContainerSize;
              const maxChangeOffset = (imageSize - itemSize) / 2;
              gsap[animateType](imgEl, {
                [currentDirectionSync.current]:
                  changeOffset < -maxChangeOffset
                    ? -maxChangeOffset
                    : changeOffset,
              });
            }
          }
        };

        computedItemOffset.current = (offset: number, animateType = "set") => {
          if (currentDirectionSync.current === "y") return;
          const snapGap = Math.abs(_snap[0] - _snap[_snap.length - 1]);
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
              const blur = scaleNumber(
                offsetDiff,
                0,
                snapGap,
                minBlur,
                maxBlur
              );
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
            currentDirectionSync.current
          );
          _twine.push(
            gsap.to(scrollContainer.current, {
              [currentDirectionSync.current]: gsap.utils.snap(_snap, _offset),
            })
          );
          switchToItemWithEffect(null, null, _offset, "to");
        }, 500);
      };

      const _snap: any = _main();

      for (let i = 0; i < initEffect.current.length; i++) {
        initEffect.current.pop()({ snap: _snap, repeatCount });
      }

      if (!scrollContainer.current) return;
      // 初始化电影轮播
      const scrollContainerSize: number =
        currentDirectionSync.current === "y"
          ? scrollContainer.current.offsetHeight
          : scrollContainer.current.offsetWidth;
      const itemSize =
        currentDirectionSync.current === "y"
          ? scrollContainerItems.current[0].offsetHeight
          : scrollContainerItems.current[0].offsetWidth;
      let velosity = itemSize;
      let brightness = 1;
      let scrollOffset = 0;
      const _init = () => {
        scrollOffset %= -_snap[_snap.length - _data.length];
        gsap.set(scrollContainer.current, {
          [currentDirectionSync.current]: -scrollOffset,
        });
        scrollContainerItems.current.forEach((item) => {
          gsap.set(item, {
            filter: `brightness(${brightness}) saturate(${
              brightness / 3
            }) blur(${5 + brightness / 2}px)`,
          });
        });

        scrollOffset += velosity;
      };
      !init &&
        gsap.set(scrollContainer.current, {
          [currentDirectionSync.current]:
            _snap[Math.ceil(_snap.length / 2) - 1],
        });
      !init &&
        _twine.push(
          gsap.to(
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
                _twine.push(
                  gsap.to(scrollContainer.current, {
                    [currentDirectionSync.current]:
                      _snap[Math.ceil(_snap.length / 2) - 1],
                    filter: `brightness(1)`,
                  })
                );

                if (currentDirectionSync.current === "y") {
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
                setInit(true);
              },
            }
          )
        );
      window.addEventListener("resize", resizeCb);

      return () => {
        window.removeEventListener("resize", resizeCb);
        _twine.forEach((twine: any) => {
          twine.kill();
        });
      };
    },
    {
      dependencies: [
        currentDirection,
        currentReadPhotoId,
        repeatCount,
        init,
        data,
      ],
      scope: scrollWrapper,
    }
  );

  const generateKey = (id: string, index: any) => {
    return id + "-" + index;
  };
  const getIdFromKey = (key: string) => {
    return key.split("-")[0];
  };

  const initEffect = useRef<any[]>([]);
  const switchToItemWithEffect = contextSafe(
    (
      id?: string | null,
      index?: number | null,
      offset?: number | null,
      animateType: "to" | "set" = "set"
    ) => {
      if (!id && !index && !offset) return;
      if (id || index) {
        if (id) {
          index =
            (data.findIndex((item: any) => item.id === id) as number) +
            Math.floor(repeatCount / 2) * data.length;
        }
        offset = snap[index as number] as number;
        gsap[animateType](scrollContainer.current, {
          [currentDirectionSync.current]: offset,
        });
        initEffect.current.push((props: { snap: any; repeatCount: number }) => {
          if (id) {
            index =
              (data.findIndex((item: any) => item.id === id) as number) +
              Math.floor(props.repeatCount / 2) * data.length;
          }
          offset = props.snap[index as number] as number;
          gsap[animateType](scrollContainer.current, {
            [currentDirectionSync.current]: offset,
          });
          computedItemOffset.current(offset, animateType);
          if (currentDirectionSync.current === "y") {
            computedImgOffset.current(offset, animateType);
          }
        });
      }

      const _offset = offset as number;
      computedItemOffset.current(_offset, animateType);
      if (currentDirectionSync.current === "y") {
        computedImgOffset.current(_offset, animateType);
      }
    }
  );
  const clearItemEffect = contextSafe(() => {
    for (let i = 0; i < imageContainerItems.current.length; i++) {
      gsap.set(imageContainerItems.current[i], {
        transform: "translate(-50%,-50%)",
        filter: "unset",
      });
      gsap.set(scrollContainerItems.current[i], {
        filter: "unset",
      });
    }
  });

  const getCurrentReadPhotoChildren = (
    type: "all" | "front" | "back" = "all"
  ) => {
    const arr = data.find(
      (item: any) => item.id + "" === getIdFromKey(currentReadPhotoId)
    )?.children;
    if (!arr) return [];
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
    imageContainerItems,
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
